import { describe, expect, it, vi } from 'vitest';
import { formatDateWithSuffix, getPacificDate } from './DailyReading';

describe('reading dates', () => {
  it('formats ordinal endings, including the teen exceptions', () => {
    expect(formatDateWithSuffix('2026-01-01')).toBe('January 1st');
    expect(formatDateWithSuffix('2026-01-02')).toBe('January 2nd');
    expect(formatDateWithSuffix('2026-01-03')).toBe('January 3rd');
    expect(formatDateWithSuffix('2026-01-11')).toBe('January 11th');
    expect(formatDateWithSuffix('2026-01-12')).toBe('January 12th');
    expect(formatDateWithSuffix('2026-01-13')).toBe('January 13th');
    expect(formatDateWithSuffix('2026-01-21')).toBe('January 21st');
  });

  it('uses the Pacific calendar date when it differs from UTC', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-15T07:30:00Z'));
    expect(getPacificDate()).toBe('2026-11-14');
    vi.useRealTimers();
  });
});
