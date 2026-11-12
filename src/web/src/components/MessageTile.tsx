import React, { useState } from 'react';
import type { MeetingMessage } from '../data/meetingMessages';

const MessageTile: React.FC<{ message: MeetingMessage }> = ({ message }) => {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copyMessage = async () => {
    try {
      if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({
          'text/html': new Blob([message.html], { type: 'text/html' }),
          'text/plain': new Blob([message.text], { type: 'text/plain' }),
        });
        try {
          await navigator.clipboard.write([item]);
        } catch {
          if (!navigator.clipboard.writeText) throw new Error('Clipboard access is unavailable');
          await navigator.clipboard.writeText(message.text);
        }
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message.text);
      } else {
        throw new Error('Clipboard access is unavailable');
      }
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    window.setTimeout(() => setStatus('idle'), 2200);
  };

  return (
    <button className="message-tile" type="button" onClick={copyMessage} aria-label={`Copy message: ${message.text.slice(0, 90)}`}>
      <span className="message-content" dangerouslySetInnerHTML={{ __html: message.displayHtml ?? message.html }} />
      <span className="message-action" aria-hidden="true">{status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Click to copy'}</span>
      <span className="sr-only" role="status">{status === 'copied' ? 'Message copied to clipboard.' : status === 'failed' ? 'Could not copy message.' : ''}</span>
    </button>
  );
};

export default MessageTile;
