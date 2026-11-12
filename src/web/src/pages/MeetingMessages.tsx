import React, { useEffect, useRef, useState } from 'react';
import MessageTile from '../components/MessageTile';
import { meetingSections } from '../data/meetingMessages';

const MeetingMessages: React.FC = () => {
  const sectionNavRef = useRef<HTMLElement | null>(null);
  const [sectionNavVisible, setSectionNavVisible] = useState(true);

  useEffect(() => {
    const element = sectionNavRef.current;
    if (!element) return;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => setSectionNavVisible(entry.isIntersecting), { threshold: 0.05 });
      observer.observe(element);
      return () => observer.disconnect();
    }
    const updateVisibility = () => setSectionNavVisible(element.getBoundingClientRect().bottom > 0);
    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

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
    <nav className="section-nav" aria-label="Message sections" ref={sectionNavRef}>
      {sectionLinks()}
    </nav>
    {!sectionNavVisible && (
      <nav className="section-nav section-nav-floating" aria-label="Message sections while scrolling">
        {sectionLinks()}
      </nav>
    )}
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
