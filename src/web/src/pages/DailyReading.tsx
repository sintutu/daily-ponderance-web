import React, { useState, useEffect } from 'react';
import DatePicker from '../components/DatePicker';
import CopyButton from '../components/CopyButton';
import readings from '../data/daily_stoic_readings.json';
import { Readings } from '../interfaces/Reading'

const getPacificDate = (): string => {
  const now = new Date();
  const pacificTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  );
  const year = pacificTime.getFullYear();
  const month = String(pacificTime.getMonth() + 1).padStart(2, '0');
  const day = String(pacificTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

const formatDateWithSuffix = (date: string): string => {
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
  const [date, setDate] = useState<string>(getPacificDate()); // Today's date in US Pacific Time
  const [reading, setReading] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', padding: '1rem' }}>

      {/* DatePicker with default date */}
      <DatePicker defaultDate={date} onDateChange={setDate} />
      {reading ? (
          <p>{getMonthName(date)}'s theme: {reading.theme}</p>
        ) : (
          <p>No reading available for this date.</p>
        )}

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Reading Display */}
      {reading ? (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <p>{formatDateWithSuffix(date)}</p>
          <h3>{reading.title}</h3>
          <blockquote>
            <p>"{reading.quote.replace(/--/g, "\u2014")}"</p>
          </blockquote>
          <footer>- {reading.author}, <em>{reading.citation}</em></footer>
          {/* Add the CopyButton here */}
          <CopyButton
            date={date}
            title={reading.title}
            quote={reading.quote.replace(/--/g, "\u2014")}
            author={reading.author}
            citation={reading.citation}
          />
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default DailyReading;
