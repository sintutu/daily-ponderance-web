import React, { useState, useRef } from "react";

const CopyButton: React.FC<{ date: string; title: string; quote: string; author: string; citation: string; theme: string }> = ({
  date,
  title,
  quote,
  author,
  citation,
  theme,
}) => {
  const [buttonText, setButtonText] = useState("Click to copy");
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatDate = (dateString: string): string => {
    const [year, month, dayOfMonth] = dateString.split("-").map(Number);
    const dateObj = new Date(year, month - 1, dayOfMonth);
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

  const escapeHtml = (value: string) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const handleCopy = async () => {
    const formattedDate = formatDate(date);
    const dateLine = `${formattedDate} · ${theme}`;
    const contentToCopy = `${dateLine}\n\n${title}\n\n"${quote}"\n\n\u2014${author}, ${citation}`;
    const htmlToCopy = `<p style="margin:0 0 12px;font-size:10pt">${escapeHtml(dateLine)}</p><p></p><h3 style="margin:0 0 12px">${escapeHtml(title)}<p></p></h3><p style="margin:0;font-size:12pt">&quot;${escapeHtml(quote)}&quot;</p><p></p><p style="margin:0">\u2014${escapeHtml(author)}, <em>${escapeHtml(citation)}</em></p>`;

    try {
      if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        const item = new ClipboardItem({
          "text/html": new Blob([htmlToCopy], { type: "text/html" }),
          "text/plain": new Blob([contentToCopy], { type: "text/plain" }),
        });
        try {
          await navigator.clipboard.write([item]);
        } catch {
          if (!navigator.clipboard.writeText) throw new Error("Clipboard access is unavailable");
          await navigator.clipboard.writeText(contentToCopy);
        }
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(contentToCopy);
      } else {
        throw new Error("Clipboard access is unavailable");
      }
      setButtonText("Copied");
    } catch {
      setButtonText("Copy failed");
    }
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setButtonText("Click to copy");
      copyTimeoutRef.current = null;
    }, 5000);
  };

  return <button className="message-action reading-copy-button" type="button" onClick={handleCopy}>{buttonText}</button>;
};

export default CopyButton;
