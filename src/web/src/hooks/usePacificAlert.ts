import { useEffect } from 'react';

const PACIFIC_TIME_ZONE = 'America/Los_Angeles';
const ALERT_HOUR = 9;
const ALERT_MINUTE = 53;
const pacificPartsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: PACIFIC_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

type PacificParts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

const getPacificParts = (date: Date): PacificParts => {
  const values = Object.fromEntries(pacificPartsFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return {
    year: Number(values.year), month: Number(values.month), day: Number(values.day),
    hour: Number(values.hour), minute: Number(values.minute), second: Number(values.second),
  };
};

const dateKey = ({ year, month, day }: PacificParts) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

// Convert a wall-clock time in Pacific time into an absolute instant without a date library.
const pacificWallTimeToDate = (year: number, month: number, day: number, hour: number, minute: number) => {
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let candidate = targetAsUtc;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const actual = getPacificParts(new Date(candidate));
    const actualAsUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, actual.second);
    candidate += targetAsUtc - actualAsUtc;
  }
  return new Date(candidate);
};

export const usePacificAlert = (onAlert: () => void) => {
  useEffect(() => {
    let timer: number | undefined;
    let target = new Date();
    let lastFiredDate: string | null = null;

    try {
      lastFiredDate = window.localStorage.getItem('last-five-alert-date');
    } catch {
      // The alert still works for this page session if storage is unavailable.
    }

    const fireIfDue = () => {
      const now = new Date();
      if (now < target || document.visibilityState !== 'visible') return;
      const today = dateKey(getPacificParts(now));
      if (lastFiredDate === today) return;
      lastFiredDate = today;
      try {
        window.localStorage.setItem('last-five-alert-date', today);
      } catch {
        // Ignore storage restrictions; the in-memory guard prevents duplicates.
      }
      onAlert();
    };

    const scheduleNext = () => {
      const now = new Date();
      const parts = getPacificParts(now);
      let day = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
      let candidate = pacificWallTimeToDate(parts.year, parts.month, parts.day, ALERT_HOUR, ALERT_MINUTE);
      if (candidate <= now || lastFiredDate === dateKey(parts)) {
        day = new Date(day.getTime() + 86400000);
        candidate = pacificWallTimeToDate(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), ALERT_HOUR, ALERT_MINUTE);
      }
      target = candidate;
      timer = window.setTimeout(() => {
        if (document.visibilityState !== 'visible') return;
        fireIfDue();
        scheduleNext();
      }, Math.max(0, target.getTime() - Date.now()));
    };

    const handleVisibility = () => {
      fireIfDue();
      if (timer !== undefined) window.clearTimeout(timer);
      scheduleNext();
    };

    scheduleNext();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [onAlert]);
};
