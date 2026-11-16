import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryInput {
  date: string;
  text: string;
}

export interface JournalRepository {
  getByDate(date: string): Promise<JournalEntry | null>;
  list(): Promise<JournalEntry[]>;
  save(entry: JournalEntryInput): Promise<JournalEntry>;
  delete(date: string): Promise<void>;
}

type SupabaseJournalRow = Database['public']['Tables']['journal_entries']['Row'];

const fromRow = (row: SupabaseJournalRow): JournalEntry => ({
  id: row.id,
  date: row.entry_date,
  text: row.reflection,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createSupabaseJournalRepository = (client: SupabaseClient<Database>): JournalRepository => ({
  async getByDate(date) {
    const { data, error } = await client.from('journal_entries')
      .select('*').eq('entry_date', date).maybeSingle();
    if (error) throw error;
    return data ? fromRow(data) : null;
  },
  async list() {
    const { data, error } = await client.from('journal_entries')
      .select('*').order('entry_date', { ascending: false });
    if (error) throw error;
    return data.map(fromRow);
  },
  async save(entry) {
    const { data, error } = await client.from('journal_entries')
      .upsert({ entry_date: entry.date, reflection: entry.text }, { onConflict: 'user_id,entry_date' })
      .select('*').single();
    if (error) throw error;
    return fromRow(data);
  },
  async delete(date) {
    const { error } = await client.from('journal_entries').delete().eq('entry_date', date);
    if (error) throw error;
  },
});
