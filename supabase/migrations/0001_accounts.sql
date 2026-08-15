-- Adds accounts (users + venue owners/representatives) on top of Supabase Auth.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'venue_owner')),
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- RLS is enabled with no policies attached: the app only ever reads/writes
-- this table through server-side routes using the service-role key, which
-- bypasses RLS. Enabling it with zero policies means direct client-side
-- access (anon or authenticated) is denied by default.
alter table profiles enable row level security;

alter table venues add column if not exists owner_id uuid references auth.users(id);
alter table inquiries add column if not exists user_id uuid references auth.users(id);
