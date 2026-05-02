import React, { useState, useEffect } from 'react';
import CopyButton from '../components/CopyButton';
import readings from '../data/daily_stoic_readings.json';
import { Reading, Readings } from '../interfaces/Reading';
import {
  formatDateWithSuffix,
  getMonthName,
  getReadingQuotes,
  getReadingTextLines,
  hasStandaloneReadingSource,
  monthNames,
} from '../utils/readings';

const readingsTyped: Readings = readings;

const orderedReadingKeys = Object.keys(readingsTyped).sort();

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
  const readingQuotes = reading ? getReadingQuotes(reading) : [];

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

        </div>
      </section>

      {reading ? (
        <article style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: 0, fontSize: '0.85rem' }}>
            {getMonthName(readingKey)} - {reading.theme}
          </p>
          <p>{formatDateWithSuffix(readingKey)}</p>
          <h3>{reading.title}</h3>
          {readingQuotes.map((quote, index) => {
            const lines = getReadingTextLines(quote.text);
            const quoteKey = `${quote.author}-${quote.citation ?? index}`;

            return (
              <section key={quoteKey} style={{ marginTop: index === 0 ? '1rem' : '1.25rem' }}>
                <blockquote style={{ margin: 0 }}>
                  {lines.map((line, lineIndex) => {
                    const isFirstLine = lineIndex === 0;
                    const isLastLine = lineIndex === lines.length - 1;
                    return (
                      <p key={`${lineIndex}-${line}`} style={{ margin: lineIndex === 0 ? 0 : '1rem 0 0' }}>
                        {isFirstLine ? '\u201c' : ''}
                        {line}
                        {isLastLine ? '\u201d' : ''}
                      </p>
                    );
                  })}
                </blockquote>
                <footer style={{ marginTop: '0.75rem' }}>
                  - {quote.author}
                  {quote.citation ? (
                    <>
                      , <em>{quote.citation}</em>
                    </>
                  ) : null}
                </footer>
              </section>
            );
          })}
          {hasStandaloneReadingSource(reading) ? (
            <footer style={{ marginTop: '0.75rem' }}>
              - {reading.author}, <em>{reading.citation}</em>
            </footer>
          ) : null}
          {reading.meditation?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <CopyButton
            date={toDatePickerValue(readingKey)}
            title={reading.title}
            quotes={readingQuotes}
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
