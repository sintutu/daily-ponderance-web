import React, { useEffect, useState } from 'react';
import DailyReading from './pages/DailyReading';

type Theme = 'light-mode' | 'dark-mode';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light-mode');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => current === 'light-mode' ? 'dark-mode' : 'light-mode');
  };

  const isDarkMode = theme === 'dark-mode';

  return (
    <main className="app-shell">
      <header className="app-header">
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
      </header>
      <DailyReading />
    </main>
  );
};

export default App;
