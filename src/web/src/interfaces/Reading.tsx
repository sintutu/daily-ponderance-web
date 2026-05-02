export interface Reading {
  theme: string;
  title: string;
  quote: string;
  author: string;
  citation: string;
  meditation?: string[];
}

export type Readings = Record<string, Reading>;
