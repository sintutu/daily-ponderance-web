import { describe, expect, it } from 'vitest';
import readings from '../data/daily_stoic_readings.json';
import { Readings } from '../interfaces/Reading';
import {
  formatDateWithSuffix,
  getReadingQuotes,
  getReadingTextLines,
  hasStandaloneReadingSource,
  normalizeText,
} from './readings';

const readingsTyped: Readings = readings;

describe('reading formatting', () => {
  it('formats day suffixes', () => {
    expect(formatDateWithSuffix('01-01')).toBe('January 1st');
    expect(formatDateWithSuffix('01-02')).toBe('January 2nd');
    expect(formatDateWithSuffix('01-03')).toBe('January 3rd');
    expect(formatDateWithSuffix('01-11')).toBe('January 11th');
    expect(formatDateWithSuffix('12-26')).toBe('December 26th');
  });

  it('normalizes double hyphens to em dashes', () => {
    expect(normalizeText('Life is long--if you know how to use it')).toBe(
      'Life is long—if you know how to use it'
    );
  });

  it('contains no literal double hyphens in reading data', () => {
    expect(JSON.stringify(readingsTyped)).not.toContain('--');
  });

  it('keeps PDF line spacing for January 21', () => {
    const lines = getReadingTextLines(readingsTyped['01-21'].quote);
    expect(lines).toEqual([
      'Ask yourself the following first thing in the morning:',
      'What am I lacking in attaining freedom from passion?',
      'What for tranquility?',
      'What am I? A mere body, estate-holder, or reputation? None of these things. What, then? A rational being.',
      'What then is demanded of me? Meditate on your actions.',
      'How did I steer away from serenity?',
      'What did I do that was unfriendly, unsocial, or uncaring?',
      'What did I fail to do in all these things?',
    ]);
  });

  it('renders May 22 as multiple readings with separate citations', () => {
    const quotes = getReadingQuotes(readingsTyped['05-22']);
    expect(quotes).toHaveLength(2);
    expect(quotes[0]).toMatchObject({
      author: 'MARCUS AURELIUS',
      citation: 'MEDITATIONS, 8.22',
    });
    expect(quotes[1]).toMatchObject({
      author: 'SENECA',
      citation: 'MEDEA, 423–425',
    });
  });

  it('keeps a standalone source for November 19 maxims', () => {
    expect(getReadingQuotes(readingsTyped['11-19'])).toHaveLength(3);
    expect(hasStandaloneReadingSource(readingsTyped['11-19'])).toBe(true);
  });
});
