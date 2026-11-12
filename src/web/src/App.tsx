import React, { useCallback, useEffect, useState } from 'react';
import DailyReading from './pages/DailyReading';
import MeetingMessages from './pages/MeetingMessages';
import Preamble from './pages/Preamble';
import { meetingSections } from './data/meetingMessages';
import { usePacificAlert } from './hooks/usePacificAlert';

type Theme = 'light-mode' | 'dark-mode';
type Page = 'reading' | 'preamble' | 'messages';

const PAGE_PATHS: Record<Page, string> = {
  reading: '/daily-ponderance',
  preamble: '/preamble',
  messages: '/items-to-paste-in-chat',
};

const getPageFromPath = (path: string): Page => {
  if (path === PAGE_PATHS.preamble) return 'preamble';
  if (path === PAGE_PATHS.messages) return 'messages';
  return 'reading';
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light-mode');
  const [page, setPage] = useState<Page>(() => getPageFromPath(window.location.pathname));
  const [showLastFiveAlert, setShowLastFiveAlert] = useState(false);

  const handlePacificAlert = useCallback(() => {
    window.history.pushState({}, '', PAGE_PATHS.messages);
    setPage('messages');
    setShowLastFiveAlert(true);
  }, []);

  usePacificAlert(handlePacificAlert);

  const navigate = (nextPage: Page) => {
    window.history.pushState({}, '', PAGE_PATHS[nextPage]);
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
    const pageAtLoad = getPageFromPath(window.location.pathname);
    if (window.location.pathname !== PAGE_PATHS[pageAtLoad]) {
      window.history.replaceState({}, '', PAGE_PATHS[pageAtLoad]);
    }
    const handlePopState = () => {
      setPage(getPageFromPath(window.location.pathname));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    document.title = page === 'messages'
      ? 'Items to paste in chat | Daily Ponderance'
      : page === 'preamble' ? 'Preamble | Daily Ponderance' : 'Daily Ponderance';
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
        {page === 'reading' ? <DailyReading /> : page === 'preamble' ? <Preamble /> : <MeetingMessages />}
      </div>
      <footer className="site-footer">
        <nav aria-label="Page navigation" className="page-navigation">
          <a className="footer-link" href={PAGE_PATHS.reading} aria-current={page === 'reading' ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate('reading'); }}>
            Daily ponderance
          </a>
          <a className="footer-link" href={PAGE_PATHS.preamble} aria-current={page === 'preamble' ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate('preamble'); }}>
            Preamble
          </a>
          <a className="footer-link" href={PAGE_PATHS.messages} aria-current={page === 'messages' ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate('messages'); }}>
            Items to paste in chat
          </a>
        </nav>
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
