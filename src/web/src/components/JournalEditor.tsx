import React, { useEffect, useState } from 'react';
import { useJournalAuth } from '../contexts/JournalAuthContext';
import type { JournalEntry } from '../lib/journalRepository';

interface JournalEditorProps {
  date: string;
  onDirtyChange: (dirty: boolean) => void;
}

const readableError = (error: unknown): string => error instanceof Error ? error.message : 'Unable to load your reflection.';

const JournalEditor: React.FC<JournalEditorProps> = ({ date, onDirtyChange }) => {
  const { configured, loading, user, repository } = useJournalAuth();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [draft, setDraft] = useState('');
  const [savedText, setSavedText] = useState('');
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const dirty = draft !== savedText;

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!repository) {
      setEntry(null);
      setDraft('');
      setSavedText('');
      return;
    }
    let active = true;
    setFetching(true);
    setError('');
    setStatus('');
    repository.getByDate(date).then((result) => {
      if (!active) return;
      setEntry(result);
      setDraft(result?.text ?? '');
      setSavedText(result?.text ?? '');
    }).catch((reason: unknown) => {
      if (active) setError(readableError(reason));
    }).finally(() => { if (active) setFetching(false); });
    return () => { active = false; };
  }, [date, repository]);

  useEffect(() => {
    if (!user || !dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, user]);

  const save = async () => {
    if (!repository || !dirty) return;
    setSaving(true);
    setError('');
    setStatus('');
    try {
      if (draft.trim()) {
        const saved = await repository.save({ date, text: draft });
        setEntry(saved);
        setDraft(saved.text);
        setSavedText(saved.text);
      } else if (entry) {
        await repository.delete(date);
        setEntry(null);
        setSavedText('');
      } else {
        setSavedText('');
      }
      setStatus('Reflection saved.');
    } catch (reason) {
      setError(readableError(reason));
    } finally {
      setSaving(false);
    }
  };

  if (!configured) return null;

  return (
    <section className="journal-editor" aria-labelledby="reflection-heading">
      <div className="journal-editor-heading">
        <div><p className="eyebrow">Your journal</p><h2 id="reflection-heading">Reflection</h2></div>
        {!loading && !user && <a className="footer-link" href="/journal">Sign in to write</a>}
      </div>
      {loading ? <p className="journal-muted" role="status">Checking your session…</p>
        : !user ? <p className="journal-muted">Sign in to save private reflections and access them across devices.</p>
          : fetching ? <p className="journal-muted" role="status">Loading your reflection…</p>
            : <>
              <label className="sr-only" htmlFor="journal-reflection">Reflection for {date}</label>
              <textarea id="journal-reflection" rows={7} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="What are you taking from today's reading?" />
              <div className="journal-editor-actions">
                <span className="journal-status" role="status">{error || status || (dirty ? 'Unsaved changes' : entry ? 'Saved' : 'Nothing saved for this date yet')}</span>
                <button className="journal-primary" type="button" disabled={!dirty || saving} onClick={() => { void save(); }}>{saving ? 'Saving…' : 'Save reflection'}</button>
              </div>
              {error && <p className="journal-error" role="alert">{error}</p>}
            </>}
    </section>
  );
};

export default JournalEditor;
