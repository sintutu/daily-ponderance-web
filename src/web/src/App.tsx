import React, { useCallback, useEffect, useState } from 'react';
import DailyReading from './pages/DailyReading';
import MeetingMessages from './pages/MeetingMessages';
import { meetingSections } from './data/meetingMessages';
import { usePacificAlert } from './hooks/usePacificAlert';

type Theme = 'light-mode' | 'dark-mode';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light-mode');
  const [page, setPage] = useState<'reading' | 'messages'>('reading');
  const [showLastFiveAlert, setShowLastFiveAlert] = useState(false);

  const handlePacificAlert = useCallback(() => {
    setPage('messages');
    setShowLastFiveAlert(true);
  }, []);

  usePacificAlert(handlePacificAlert);

  const navigate = (nextPage: 'reading' | 'messages') => {
    setPage(nextPage);
    if (nextPage === 'messages') {
      window.requestAnimationFrame(() => {
        document.getElementById('items-to-paste-in-chat')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    document.title = page === 'messages' ? 'Items to paste in chat | Daily Ponderance' : 'Daily Ponderance';
  }, [page]);

  useEffect(() => {
    if (!showLastFiveAlert || page !== 'messages') return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('last-five')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page, showLastFiveAlert]);

  const toggleTheme = () => {
    setTheme((current) => current === 'light-mode' ? 'dark-mode' : 'light-mode');
  };

  const isDarkMode = theme === 'dark-mode';

  return (
    <main className="app-shell">
      <div className="page-content">
        {page === 'reading' ? (
          <DailyReading themeToggle={
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
                </svg>
              )}
            </button>
          } />
        ) : (
          <MeetingMessages />
        )}
      </div>
      <footer className="site-footer">
        <nav aria-label="Page navigation">
          <button className="footer-link" type="button" onClick={() => navigate(page === 'reading' ? 'messages' : 'reading')}>
            {page === 'reading' ? 'Items to paste in chat' : 'Daily reading'}
          </button>
        </nav>
      </footer>
      {showLastFiveAlert && (
        <div className="alert-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowLastFiveAlert(false);
        }}>
          <section className="last-five-dialog" role="alertdialog" aria-modal="true" aria-labelledby="last-five-alert-title" aria-describedby="last-five-alert-description" onKeyDown={(event) => {
            if (event.key === 'Escape') setShowLastFiveAlert(false);
          }}>
            <p className="eyebrow">Meeting reminder · 9:53 a.m. Pacific</p>
            <h2 id="last-five-alert-title">Last 5 Min</h2>
            <p id="last-five-alert-description">The last five minutes of the meeting are starting.</p>
            <div className="alert-message-list">
              {meetingSections.find((section) => section.id === 'last-five')?.messages.map((message) => (
                <p key={message.id} dangerouslySetInnerHTML={{ __html: message.html }} />
              ))}
            </div>
            <button className="dialog-close" type="button" onClick={() => setShowLastFiveAlert(false)} autoFocus>Close</button>
          </section>
        </div>
      )}
    </main>
  );
};

export default App;
