-- Reply/handoff event log for the Instantly webhook + daily report.
-- The webhook has been inserting into this table since June, but the table
-- was never created — every insert failed silently (supabase-js returns the
-- error instead of throwing), so the daily report's "Replies received" and
-- "Interested replies (hot)" lines have always shown 0.
CREATE TABLE IF NOT EXISTS lead_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_email text,
  event_type text NOT NULL,
  campaign_id text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_events_type_created_idx
  ON lead_events (event_type, created_at DESC);

-- Service-role access only: RLS on with no anon policies.
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
