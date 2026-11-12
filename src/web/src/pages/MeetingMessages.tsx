import React from 'react';
import MessageTile from '../components/MessageTile';
import { meetingSections } from '../data/meetingMessages';

const MeetingMessages: React.FC = () => {
  const sectionLinks = () => meetingSections.map((section) => (
    <a key={section.id} href={`#${section.id}`} aria-label={section.title} title={section.title}>
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
      <section className="message-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
        <div className="section-heading">
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          {section.id === 'last-five'}
        </div>
        <div className="message-grid">
          {section.messages.map((message) => <MessageTile message={message} key={message.id} />)}
        </div>
      </section>
    ))}
  </div>
  );
};

export default MeetingMessages;
