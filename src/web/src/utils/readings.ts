import { Reading, ReadingQuote } from '../interfaces/Reading';

export const monthNames = [
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

export const formatDateWithSuffix = (readingKey: string): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const [month, day] = readingKey.split('-').map(Number);
  const daySuffix =
    day % 10 === 1 && day !== 11 ? suffixes[1]
    : day % 10 === 2 && day !== 12 ? suffixes[2]
    : day % 10 === 3 && day !== 13 ? suffixes[3]
    : suffixes[0];

  return `${monthNames[month - 1]} ${day}${daySuffix}`;
};

export const getMonthName = (readingKey: string): string => {
  const [month] = readingKey.split('-').map(Number);
  return monthNames[month - 1];
};

export const normalizeText = (text: string): string => {
  return text
    .replace(/\s+--\s+/g, '—')
    .replace(/--/g, '—')
    .replace(/ \. \. \./g, ' . . .');
};

export const getReadingQuotes = (reading: Reading): ReadingQuote[] => {
  return reading.quotes ?? [
    {
      text: reading.quote,
      author: reading.author,
      citation: reading.citation,
    },
  ];
};

export const getReadingTextLines = (text: ReadingQuote['text']): string[] => {
  const lines = Array.isArray(text) ? text : [text];
  return lines.map(normalizeText);
};

export const hasStandaloneReadingSource = (reading: Reading): boolean => {
  return Boolean(reading.quotes?.length && reading.quotes.some((quote) => !quote.citation));
};
