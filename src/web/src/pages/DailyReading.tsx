import React, { useMemo, useState, useEffect } from 'react';
import CopyButton from '../components/CopyButton';
import readings from '../data/daily_stoic_readings.json';
import { Reading, Readings } from '../interfaces/Reading';

const readingsTyped: Readings = readings;

const orderedReadingKeys = Object.keys(readingsTyped).sort();

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const daysByMonth = orderedReadingKeys.reduce<Record<string, string[]>>((acc, key) => {
  const [month, day] = key.split('-');
  acc[month] = [...(acc[month] ?? []), day];
  return acc;
}, {});

const getPacificDate = (): string => {
  const now = new Date();
  const pacificTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  );
  const year = pacificTime.getFullYear();
  const month = String(pacificTime.getMonth() + 1).padStart(2, '0');
  const day = String(pacificTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTodayKey = (): string => {
  const [, month, day] = getPacificDate().split('-');
  return `${month}-${day}`;
};

const getInitialReadingKey = (): string => {
  const queryDate = new URLSearchParams(window.location.search).get('date');
  const queryMatch = queryDate?.match(/^(?:\d{4}-)?(\d{2}-\d{2})$/);
  const queryKey = queryMatch?.[1];

  if (queryKey && readingsTyped[queryKey]) {
    return queryKey;
  }

  const todayKey = getTodayKey();
  return readingsTyped[todayKey] ? todayKey : '01-01';
};

const formatDateWithSuffix = (readingKey: string): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const [month, day] = readingKey.split('-').map(Number);
  const daySuffix =
    day % 10 === 1 && day !== 11 ? suffixes[1]
    : day % 10 === 2 && day !== 12 ? suffixes[2]
    : day % 10 === 3 && day !== 13 ? suffixes[3]
    : suffixes[0];

  return `${monthNames[month - 1]} ${day}${daySuffix}`;
};

const getMonthName = (readingKey: string): string => {
  const [month] = readingKey.split('-').map(Number);
  return monthNames[month - 1];
};

const normalizeText = (text: string): string => {
  return text
    .replace(/\s+--\s+/g, '\u2014')
    .replace(/--/g, '\u2014')
    .replace(/ \. \. \./g, ' . . .');
};

const getAdjacentReadingKey = (readingKey: string, direction: -1 | 1): string => {
  const currentIndex = orderedReadingKeys.indexOf(readingKey);
  const nextIndex = (currentIndex + direction + orderedReadingKeys.length) % orderedReadingKeys.length;
  return orderedReadingKeys[nextIndex];
};

const toDatePickerValue = (readingKey: string): string => {
  const currentYear = getPacificDate().split('-')[0];
  const datePickerYear = readingKey === '02-29' ? '2024' : currentYear;
  return `${datePickerYear}-${readingKey}`;
};

const getKeyFromDatePickerValue = (dateValue: string): string | null => {
  const match = dateValue.match(/^\d{4}-(\d{2}-\d{2})$/);
  return match?.[1] ?? null;
};

const DailyReading: React.FC = () => {
  const [readingKey, setReadingKey] = useState<string>(getInitialReadingKey);
  const reading: Reading | null = readingsTyped[readingKey] ?? null;
  const [month, selectedDay] = readingKey.split('-');
  const availableDays = daysByMonth[month] ?? [];

  const displayQuote = useMemo(
    () => (reading ? normalizeText(reading.quote) : ''),
    [reading]
  );

  const updateReadingKey = (nextReadingKey: string) => {
    if (readingsTyped[nextReadingKey]) {
      setReadingKey(nextReadingKey);
    }
  };

  useEffect(() => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('date', readingKey);
    window.history.replaceState(null, '', nextUrl);
  }, [readingKey]);

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '720px', margin: 'auto', padding: '1rem' }}>
      <section aria-label="Choose a daily reading" style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <label htmlFor="reading-date">Date</label>
          <input
            id="reading-date"
            type="date"
            value={toDatePickerValue(readingKey)}
            onChange={(event) => {
              const nextKey = getKeyFromDatePickerValue(event.target.value);
              if (nextKey) {
                updateReadingKey(nextKey);
              }
            }}
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
          <label htmlFor="reading-month">Month</label>
          <select
            id="reading-month"
            value={month}
            onChange={(event) => {
              const nextMonth = event.target.value;
              const nextDay = daysByMonth[nextMonth].includes(selectedDay)
                ? selectedDay
                : daysByMonth[nextMonth][daysByMonth[nextMonth].length - 1];
              updateReadingKey(`${nextMonth}-${nextDay}`);
            }}
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          >
            {monthNames.map((monthName, index) => {
              const monthValue = String(index + 1).padStart(2, '0');
              return (
                <option key={monthValue} value={monthValue}>
                  {monthName}
                </option>
              );
            })}
          </select>
          <label htmlFor="reading-day">Day</label>
          <select
            id="reading-day"
            value={selectedDay}
            onChange={(event) => updateReadingKey(`${month}-${event.target.value}`)}
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          >
            {availableDays.map((day) => (
              <option key={day} value={day}>
                {Number(day)}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button type="button" onClick={() => updateReadingKey(getAdjacentReadingKey(readingKey, -1))}>
            Previous
          </button>
          <button type="button" onClick={() => updateReadingKey(getTodayKey())}>
            Today
          </button>
          <button type="button" onClick={() => updateReadingKey(getAdjacentReadingKey(readingKey, 1))}>
            Next
          </button>
        </div>
      </section>

      {reading ? (
        <article style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: 0, fontSize: '0.85rem' }}>
            {getMonthName(readingKey)} - {reading.theme}
          </p>
          <p>{formatDateWithSuffix(readingKey)}</p>
          <h3>{reading.title}</h3>
          <blockquote>
            <p>&ldquo;{displayQuote}&rdquo;</p>
          </blockquote>
          <footer>
            - {reading.author}, <em>{reading.citation}</em>
          </footer>
          {reading.meditation?.map((paragraph) => (
            <p key={paragraph}>{normalizeText(paragraph)}</p>
          ))}
          <CopyButton
            date={toDatePickerValue(readingKey)}
            title={reading.title}
            quote={displayQuote}
            author={reading.author}
            citation={reading.citation}
          />
        </article>
      ) : (
        <p>No reading available for this date.</p>
      )}
    </main>
  );
};

export default DailyReading;
