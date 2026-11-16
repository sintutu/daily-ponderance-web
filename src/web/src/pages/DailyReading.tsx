import React, { useState, useEffect } from 'react';
import DatePicker from '../components/DatePicker';
import CopyButton from '../components/CopyButton';
import readings from '../data/daily_stoic_readings.json';
import { Readings } from '../interfaces/Reading'
import JournalEditor from '../components/JournalEditor';

export const getPacificDate = (): string => {
  const now = new Date();
  const pacificTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  );
  const year = pacificTime.getFullYear();
  const month = String(pacificTime.getMonth() + 1).padStart(2, '0');
  const day = String(pacificTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

export const formatDateWithSuffix = (date: string): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const [year, month, day] = date.split("-").map(Number);

  const monthName = new Date(year, month - 1, day).toLocaleString("default", { month: "long" });
  const daySuffix = day % 10 === 1 && day !== 11 ? suffixes[1]
    : day % 10 === 2 && day !== 12 ? suffixes[2]
    : day % 10 === 3 && day !== 13 ? suffixes[3]
    : suffixes[0];

  return `${monthName} ${day}${daySuffix}`;
};

const getMonthName = (date: string): string => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleString("default", { month: "long" });
};

const DailyReading: React.FC = () => {
  const [date, setDate] = useState<string>(() => {
    const requestedDate = new URLSearchParams(window.location.search).get('date');
    return requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? requestedDate : getPacificDate();
  }); // Today's date in US Pacific Time
  const [reading, setReading] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [journalDirty, setJournalDirty] = useState(false);

  const changeDate = (nextDate: string) => {
    if (journalDirty && !window.confirm('You have unsaved changes. Discard them and change the date?')) return;
    setDate(nextDate);
  };

  useEffect(() => {
    try {
      const match = date.match(/^\d{4}-(\d{2}-\d{2})$/);
      if (!match) {
        throw new Error('Invalid date format. Use YYYY-MM-DD.');
      }

      const readingsTyped: Readings = readings;
      const mmdd = match[1];
      const reading = readingsTyped[mmdd];

      if (!reading) {
        setError('Reading not found for the given date.');
        setReading(null);
      } else {
        setReading(reading);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message);
      setReading(null);
    }
  }, [date]);

  return (
    <div className="daily-reading">
      <p className="eyebrow page-eyebrow">ASMM · Daily Ponderance · {reading?.theme}</p>

      <div className="reading-toolbar">
        <DatePicker defaultDate={date} onDateChange={changeDate} />
      </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Reading Display */}
      {reading ? (
        <div className="reading-card">
          <p className="reading-date">{formatDateWithSuffix(date)}</p>
          <h3>{reading.title}</h3>
          <p className="reading-quote">"{reading.quote.replace(/--/g, "\u2014")}"</p>
          <footer className="reading-citation">&mdash;{reading.author}, <em>{reading.citation}</em></footer>
          <CopyButton
            date={date}
            title={reading.title}
            quote={reading.quote.replace(/--/g, "\u2014")}
            author={reading.author}
            citation={reading.citation}
            theme={reading.theme}
          />
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
      <div className="meditation-control reflection-control">
        <button className="footer-link" type="button" aria-expanded={showReflection} aria-controls="reflection-editor-panel" onClick={() => setShowReflection((visible) => !visible)}>
          <span className="sr-only">{showReflection ? 'Hide reflection editor' : 'Show reflection editor'}</span>
          <svg className="reflection-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
        </button>
      </div>
      <div id="reflection-editor-panel" hidden={!showReflection}>
        <JournalEditor date={date} onDirtyChange={setJournalDirty} />
      </div>
      <div className="meditation-control">
        <button className="footer-link" type="button" aria-expanded={showMeditation} onClick={() => setShowMeditation((visible) => !visible)}>
          <span className="sr-only">{showMeditation ? 'Hide meditation' : 'Play meditation'}</span>
          <svg className="meditation-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12M6 21h12M7 3c0 4.5 2 6.5 5 9-3 2.5-5 4.5-5 9m10-18c0 4.5-2 6.5-5 9 3 2.5 5 4.5 5 9" /></svg>
        </button>
      </div>
      {showMeditation && (
        <section className="meditation-card" aria-label="ASMM meditation video">
          <iframe
            src="https://drive.google.com/file/d/15mnjeE43Fhm_z8Vzxac4YshH8oOz4lqS/preview"
            title="ASMM meditation"
            allow="autoplay"
            allowFullScreen
          />
        </section>
      )}
    </div>
  );
};

export default DailyReading;
