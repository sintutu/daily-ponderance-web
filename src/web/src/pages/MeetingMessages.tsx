import React, { useEffect, useRef, useState } from 'react';
import MessageTile from '../components/MessageTile';
import { meetingSections } from '../data/meetingMessages';

const MeetingMessages: React.FC = () => {
  const [directMessagesVisible, setDirectMessagesVisible] = useState(false);
  const directMessagesRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (directMessagesVisible && !directMessagesRef.current?.contains(event.target as Node)) {
        setDirectMessagesVisible(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsidePointer);
    return () => document.removeEventListener('pointerdown', handleOutsidePointer);
  }, [directMessagesVisible]);
  const focusSection = (id: string) => {
    if (id === 'items-to-paste-in-chat') setDirectMessagesVisible(true);
    else setDirectMessagesVisible(false);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };
  const sectionLinks = () => meetingSections.map((section) => (
    <a key={section.id} href={`#${section.id}`} aria-label={section.title} title={section.title} onClick={(event) => {
      event.preventDefault();
      focusSection(section.id);
    }}>
      {section.title}
    </a>
  ));

  return (
  <div className="messages-page">
    <header className="messages-header">
      <p className="eyebrow">ASMM · Scribe messages</p>
      <h1>Items to paste in chat</h1>
      <p className="messages-intro">Choose a message to copy it with its formatting, ready to paste into chat.</p>
    </header>
    <nav className="section-nav" aria-label="Message sections">
      {sectionLinks()}
    </nav>
    {meetingSections.map((section) => (
      <section ref={section.id === 'items-to-paste-in-chat' ? directMessagesRef : undefined} className="message-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
        <div className="section-heading">
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          {section.id === 'items-to-paste-in-chat' && <button type="button" className="section-toggle" aria-label={directMessagesVisible ? 'Hide direct messages' : 'Show direct messages'} aria-expanded={directMessagesVisible} onClick={() => setDirectMessagesVisible((visible) => !visible)} title={directMessagesVisible ? 'Hide direct messages' : 'Show direct messages'}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={directMessagesVisible ? 'm6 9 6 6 6-6' : 'm9 6 6 6-6 6'} /></svg>
          </button>}
        </div>
        <div className="message-grid" hidden={section.id === 'items-to-paste-in-chat' && !directMessagesVisible}>
          {section.messages.map((message) => <MessageTile message={message} key={message.id} />)}
        </div>
      </section>
    ))}
  </div>
  );
};

export default MeetingMessages;
