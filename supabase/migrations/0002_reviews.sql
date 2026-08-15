-- Adds venue reviews/ratings.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (venue_id, user_id)
);

-- Writes go through a server action using the service-role client (same
-- pattern as profiles/venues/inquiries elsewhere in the app), but reviews
-- are meant to be publicly visible on the venue detail page, which reads
-- with the anon client — so, unlike profiles, this table gets a real
-- public SELECT policy.
alter table reviews enable row level security;

create policy "Reviews are publicly readable" on reviews
  for select using (true);
