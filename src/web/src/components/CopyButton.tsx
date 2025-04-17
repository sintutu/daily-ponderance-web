import React, { useState, useRef } from "react";

const CopyButton: React.FC<{ date: string; title: string; quote: string; author: string; citation: string }> = ({
  date,
  title,
  quote,
  author,
  citation,
}) => {
  const [buttonText, setButtonText] = useState("Copy");
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
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
    const contentToCopy = `${formattedDate}\n\n${title}\n\n${quote}\n\n- ${author} - ${citation}`;

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
