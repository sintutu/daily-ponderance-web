export type ReadingText = string | string[];

export interface ReadingQuote {
  text: ReadingText;
  author: string;
  citation?: string;
}

export interface Reading {
  theme: string;
  title: string;
  quote: ReadingText;
  author: string;
  citation: string;
  quotes?: ReadingQuote[];
  meditation?: string[];
}

export type Readings = Record<string, Reading>;
