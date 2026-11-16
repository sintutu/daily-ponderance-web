import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';
import { createSupabaseJournalRepository } from './journalRepository';

const row = {
  id: 'entry-1',
  user_id: 'user-1',
  entry_date: '2026-11-14',
  reflection: 'Stay present.',
  created_at: '2026-11-14T10:00:00Z',
  updated_at: '2026-11-14T10:00:00Z',
};

const makeClient = (result: { data?: unknown; error?: Error | null }) => {
  const query: Record<string, unknown> = {};
  query.select = vi.fn(() => query);
  query.eq = vi.fn(() => query);
  query.order = vi.fn(() => Promise.resolve({ data: result.data ?? [], error: result.error ?? null }));
  query.maybeSingle = vi.fn(() => Promise.resolve({ data: result.data ?? null, error: result.error ?? null }));
  query.upsert = vi.fn(() => query);
  query.single = vi.fn(() => Promise.resolve({ data: result.data ?? row, error: result.error ?? null }));
  query.delete = vi.fn(() => query);
  query.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
    Promise.resolve({ data: result.data ?? null, error: result.error ?? null }).then(resolve, reject);
  const from = vi.fn(() => query);
  return { client: { from } as unknown as SupabaseClient<Database>, from, query };
};

describe('Supabase journal repository', () => {
  it('loads and maps one entry by date', async () => {
    const { client, from, query } = makeClient({ data: row });
    const repository = createSupabaseJournalRepository(client);

    await expect(repository.getByDate(row.entry_date)).resolves.toEqual({
      id: row.id,
      date: row.entry_date,
      text: row.reflection,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
    expect(from).toHaveBeenCalledWith('journal_entries');
    expect(query.eq).toHaveBeenCalledWith('entry_date', row.entry_date);
  });

  it('lists entries in reverse date order', async () => {
    const { client, query } = makeClient({ data: [row] });
    const repository = createSupabaseJournalRepository(client);

    await expect(repository.list()).resolves.toHaveLength(1);
    expect(query.order).toHaveBeenCalledWith('entry_date', { ascending: false });
  });

  it('upserts by account and date and deletes by date', async () => {
    const { client, query } = makeClient({ data: row });
    const repository = createSupabaseJournalRepository(client);

    await expect(repository.save({ date: row.entry_date, text: row.reflection })).resolves.toMatchObject({
      date: row.entry_date,
      text: row.reflection,
    });
    expect(query.upsert).toHaveBeenCalledWith(
      { entry_date: row.entry_date, reflection: row.reflection },
      { onConflict: 'user_id,entry_date' },
    );

    await expect(repository.delete(row.entry_date)).resolves.toBeUndefined();
    expect(query.delete).toHaveBeenCalledOnce();
  });
});
