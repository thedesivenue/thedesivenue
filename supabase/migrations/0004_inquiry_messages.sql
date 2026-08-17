-- Adds reply threads on inquiries (not real-time — refreshes on send/reload).
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table if not exists inquiry_messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references inquiries(id) on delete cascade,
  sender_id uuid references auth.users(id),
  body text not null,
  created_at timestamptz not null default now()
);

-- Private per-thread data (only the planner who sent the inquiry and the
-- owner of the venue it was sent to should see it) — RLS enabled with no
-- policies, same pattern as profiles/venues/inquiries/favorites. Reads and
-- writes go through server actions using the service-role client with an
-- explicit ownership check in app code.
alter table inquiry_messages enable row level security;
