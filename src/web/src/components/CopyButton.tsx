import React, { useState, useRef } from "react";
import { ReadingQuote } from "../interfaces/Reading";
import { getReadingTextLines, normalizeText } from "../utils/readings";

const CopyButton: React.FC<{
  date: string;
  title: string;
  quote?: string;
  quotes?: ReadingQuote[];
  author: string;
  citation: string;
}> = ({
  date,
  title,
  quote,
  quotes,
  author,
  citation,
}) => {
  const [buttonText, setButtonText] = useState("Copy");
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatDate = (dateString: string): string => {
    const [year, month, dayValue] = dateString.split("-").map(Number);
    const dateObj = new Date(year, month - 1, dayValue);
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
    const suffixes = ["th", "st", "nd", "rd"];
    const day = dateObj.getDate();
    const daySuffix = 
        day % 10 === 1 && day !== 11 ? suffixes[1]
      : day % 10 === 2 && day !== 12 ? suffixes[2]
      : day % 10 === 3 && day !== 13 ? suffixes[3]
      : suffixes[0];
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return `${formattedDate}${daySuffix}`;
  };

  const handleCopy = () => {
    const formattedDate = formatDate(date);
    const quoteBlocks = quotes?.length
      ? quotes.map((readingQuote) => {
          const quoteText = getReadingTextLines(readingQuote.text).join("\n\n");
          const source = readingQuote.citation
            ? `${readingQuote.author}, ${readingQuote.citation}`
            : readingQuote.author;
          return `"${quoteText}"\n\n- ${source}`;
        })
      : [`"${normalizeText(quote ?? "")}"\n\n- ${author}, ${citation}`];

    const needsStandaloneSource = quotes?.some((readingQuote) => !readingQuote.citation);
    const sourceBlock = needsStandaloneSource ? `\n\n- ${author}, ${citation}` : "";
    const contentToCopy = `${formattedDate}\n\n${title}\n\n${quoteBlocks.join("\n\n")}${sourceBlock}`;

    navigator.clipboard.writeText(contentToCopy).then(() => {
      setButtonText("Copied!");
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setButtonText("Copy");
        copyTimeoutRef.current = null;
      }, 5000);
    });
  };

  return <button className="copy-button" onClick={handleCopy}>{buttonText}</button>;
};

export default CopyButton;
