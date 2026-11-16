import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { createSupabaseJournalRepository, type JournalRepository } from '../lib/journalRepository';

interface JournalAuthValue {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  repository: JournalRepository | null;
}

const JournalAuthContext = createContext<JournalAuthValue | null>(null);

export const JournalAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) {
        setSession(data.session);
        setLoading(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
    configured: isSupabaseConfigured,
    loading,
    session,
    user: session?.user ?? null,
    repository: supabase && session ? createSupabaseJournalRepository(supabase) : null,
  }), [loading, session]);

  return <JournalAuthContext.Provider value={value}>{children}</JournalAuthContext.Provider>;
};

export const useJournalAuth = (): JournalAuthValue => {
  const value = useContext(JournalAuthContext);
  if (!value) throw new Error('useJournalAuth must be used inside JournalAuthProvider');
  return value;
};
