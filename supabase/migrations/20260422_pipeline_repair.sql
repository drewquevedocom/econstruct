-- Migration: 2026-04-22 — CRM Pipeline Repair (manual paste in Supabase SQL Editor)
--
-- Status of automated parts (already executed via REST API on 2026-04-22):
--   ✅ Cleared zombie agent_runs stuck in "running" state
--   ✅ Backfilled 778 leads into enrichment_queue with status=pending
--
-- The parts below CANNOT be done via REST API — they need DDL execution.
-- Paste this entire file into the Supabase Dashboard → SQL Editor and click Run.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Add campaign tracking columns to leads
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS campaign_enrolled_at timestamptz,
  ADD COLUMN IF NOT EXISTS instantly_campaign_id text;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Email sequence tables (for the /crm/sequences editor)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  campaign_id text,
  is_active boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sequence_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  step_number int NOT NULL,
  delay_days int NOT NULL DEFAULT 0,
  subject text NOT NULL,
  body text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sequence_id, step_number)
);

CREATE INDEX IF NOT EXISTS idx_sequence_steps_sequence
  ON sequence_steps(sequence_id, step_number);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. NOTE: calculate_lead_score() RPC already exists in Supabase and works
--    (verified 2026-04-22 — scored test lead at 40/100). Do NOT overwrite.
-- ─────────────────────────────────────────────────────────────────────────────

-- Verification queries (run after the above to confirm):
--   SELECT column_name FROM information_schema.columns
--     WHERE table_name='leads' AND column_name IN ('campaign_enrolled_at','instantly_campaign_id');
--   SELECT table_name FROM information_schema.tables WHERE table_name IN ('email_sequences','sequence_steps');
