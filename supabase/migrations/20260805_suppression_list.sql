-- Unified suppression list, shared across both send tracks. Before this,
-- unsubscribes were only handled inline in the Instantly webhook (flipping
-- partner_leads.status to Inactive) with no shared list -- a homeowner-track
-- lead who unsubscribed had no record anywhere stopping a future re-send,
-- and hard bounces weren't suppressed at all beyond Instantly's own
-- per-campaign bounce-protect. One list, checked by every enrollment path,
-- regardless of which track (or which webhook event) suppressed the address.
create table if not exists public.suppression_list (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  reason text not null check (reason in ('unsubscribed', 'hard_bounce', 'complaint', 'manual')),
  source_track text not null check (source_track in ('partner', 'homeowner')),
  created_at timestamptz not null default now(),
  unique (email)
);

create index if not exists suppression_list_email_idx on public.suppression_list (email);

-- Service-role access only: RLS on with no anon policies, same as lead_events.
alter table public.suppression_list enable row level security;
