-- Adds saved/favorited venues for logged-in event planners.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  venue_id uuid not null references venues(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, venue_id)
);

-- Unlike reviews, favorites are private to each user, so no public SELECT
-- policy — RLS is enabled with zero policies. The app reads/writes this
-- table only server-side via the service-role client, filtered by the
-- authenticated user's own id, same pattern as profiles/venues/inquiries.
alter table favorites enable row level security;
