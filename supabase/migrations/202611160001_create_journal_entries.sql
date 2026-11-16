create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  entry_date date not null,
  reflection text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_entries_user_date_unique unique (user_id, entry_date),
  constraint journal_entries_reflection_length check (char_length(reflection) <= 50000)
);

create index if not exists journal_entries_user_date_idx
  on public.journal_entries (user_id, entry_date desc);

create or replace function public.set_journal_entry_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists journal_entries_set_updated_at on public.journal_entries;
create trigger journal_entries_set_updated_at
  before update on public.journal_entries
  for each row execute function public.set_journal_entry_updated_at();

alter table public.journal_entries enable row level security;

drop policy if exists "Users can read their own journal entries" on public.journal_entries;
create policy "Users can read their own journal entries"
  on public.journal_entries for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own journal entries" on public.journal_entries;
create policy "Users can create their own journal entries"
  on public.journal_entries for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own journal entries" on public.journal_entries;
create policy "Users can update their own journal entries"
  on public.journal_entries for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own journal entries" on public.journal_entries;
create policy "Users can delete their own journal entries"
  on public.journal_entries for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.journal_entries to authenticated;
