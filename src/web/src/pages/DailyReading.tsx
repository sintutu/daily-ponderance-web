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

const DailyReading: React.FC = () => {
  const [date, setDate] = useState<string>(getPacificDate()); // Today's date in US Pacific Time
  const [reading, setReading] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReading(date); // Fetch reading whenever the date changes
  }, [date]);

  const fetchReading = (date: string) => {
    const match = date.match(/^\d{4}-(\d{2}-\d{2})$/);
    if (!match) {
      throw new Error('Invalid date format. Use YYYY-MM-DD.');
    }

    const readingsTyped: Readings = readings;

    const mmdd = match[1];
    const reading = readingsTyped[mmdd];
    if (!reading) {
      throw new Error('Reading not found for the given date.');
    }
  
    return reading;
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Daily Ponderance</h1>

      {/* DatePicker with default date */}
      <DatePicker defaultDate={date} onDateChange={setDate} />

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Reading Display */}
      {reading ? (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h2>{reading.theme}</h2>
          <h3>{reading.title}</h3>
          <blockquote>
            <p>{reading.quote}</p>
          </blockquote>
          <footer>- {reading.author} - {reading.citation}</footer>
          {/* Add the CopyButton here */}
          <CopyButton
            date={date}
            title={reading.title}
            quote={reading.quote}
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
