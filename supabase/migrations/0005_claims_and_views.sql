-- Adds venue ownership claims and a view-count counter for owner analytics.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table if not exists venue_claims (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (venue_id, user_id)
);

-- Private data, reviewed only by the admin dashboard (service-role) and the
-- claimant's own account page — same no-policy pattern as profiles/favorites.
alter table venue_claims enable row level security;

alter table venues add column if not exists view_count integer not null default 0;

-- Atomic increment (a plain fetch-then-update from the app would race under
-- concurrent page loads).
create or replace function increment_venue_views(venue_id_input uuid)
returns void as $$
  update venues set view_count = view_count + 1 where id = venue_id_input;
$$ language sql;
