import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { JournalEntry } from '../lib/journalRepository';
import { useJournalAuth } from '../contexts/JournalAuthContext';

const friendlyError = (error: unknown): string => error instanceof Error ? error.message : 'Something went wrong. Please try again.';

const Journal: React.FC = () => {
  const { configured, loading, user, repository } = useJournalAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entriesBusy, setEntriesBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!repository) {
      setEntries([]);
      return;
    }
    let active = true;
    setEntriesBusy(true);
    setError('');
    repository.list().then((result) => {
      if (active) setEntries(result);
    }).catch((reason: unknown) => {
      if (active) setError(friendlyError(reason));
    }).finally(() => {
      if (active) setEntriesBusy(false);
    });
    return () => { active = false; };
  }, [repository]);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setAuthBusy(true);
    setError('');
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
    } catch (reason) {
      setError(friendlyError(reason));
    } finally {
      setAuthBusy(false);
    }
  };

  const exportEntries = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'daily-ponderance-journal.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteEntry = async (entry: JournalEntry) => {
    if (!repository || !window.confirm(`Delete your reflection for ${entry.date}?`)) return;
    setError('');
    try {
      await repository.delete(entry.date);
      setEntries((current) => current.filter((item) => item.date !== entry.date));
    } catch (reason) {
      setError(friendlyError(reason));
    }
  };

  return (
    <section className="journal-page">
      <header className="messages-header">
        <p className="eyebrow">Private reflections</p>
        <h1>Journal</h1>
        <p className="messages-intro">Your reflections are private to your account.</p>
      </header>

      {!configured ? (
        <div className="journal-card" role="status">
          <h2>Supabase setup needed</h2>
          <p>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>src/web/.env.local</code>, then apply the SQL migration in <code>supabase/migrations</code>.</p>
          <p>Public readings continue to work while the journal is not configured.</p>
        </div>
      ) : loading ? <p role="status">Checking your session…</p>
        : !user ? (
          <div className="journal-card">
            <h2>Sign in</h2>
            <form className="journal-form" onSubmit={handleAuth}>
              <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
              {error && <p className="journal-error" role="alert">{error}</p>}
              <button className="journal-primary" type="submit" disabled={authBusy}>{authBusy ? 'Please wait…' : 'Sign in'}</button>
            </form>
            <p className="journal-muted">This journal is for its owner only. Account creation is disabled in the app.</p>
          </div>
        ) : (
          <div className="journal-card">
            <div className="journal-account-row">
              <p>Signed in as <strong>{user.email}</strong></p>
              <button className="footer-link" type="button" onClick={() => { void supabase?.auth.signOut(); }}>Sign out</button>
            </div>
            <div className="journal-list-heading">
              <h2>Your reflections</h2>
              <button className="footer-link" type="button" disabled={!entries.length} onClick={exportEntries}>Export JSON</button>
            </div>
            {error && <p className="journal-error" role="alert">{error}</p>}
            {entriesBusy ? <p role="status">Loading your reflections…</p>
              : entries.length === 0 ? <p className="journal-muted">No reflections saved yet. Write one from a daily reading.</p>
                : <ul className="journal-entry-list">{entries.map((entry) => (
                  <li key={entry.id}>
                    <a href={`/daily-ponderance?date=${entry.date}`}>{entry.date}</a>
                    <p>{entry.text}</p>
                    <button className="journal-text-button danger" type="button" onClick={() => { void deleteEntry(entry); }}>Delete</button>
                  </li>
                ))}</ul>}
          </div>
        )}
    </section>
  );
};

export default Journal;
