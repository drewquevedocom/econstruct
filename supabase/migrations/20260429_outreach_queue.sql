-- Outreach queue + provider attempt tracking.
-- Run in Supabase SQL Editor before deploying code that reads these columns.

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS outreach_status text NOT NULL DEFAULT 'needs_email',
  ADD COLUMN IF NOT EXISTS outreach_status_updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS outreach_notes text,
  ADD COLUMN IF NOT EXISTS outreach_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS outreach_exported_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_email_enrichment_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_enrichment_attempts int NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_outreach_status_check'
  ) THEN
    ALTER TABLE leads
      ADD CONSTRAINT leads_outreach_status_check
      CHECK (
        outreach_status IN (
          'needs_email',
          'email_found',
          'ready_for_email_review',
          'ready_for_mail_review',
          'approved',
          'sent',
          'skipped',
          'do_not_contact'
        )
      ) NOT VALID;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_outreach_queue
  ON leads (outreach_status, lead_score DESC, created_at)
  WHERE lead_score >= 70;

CREATE INDEX IF NOT EXISTS idx_leads_outreach_email_missing
  ON leads (lead_score DESC, created_at)
  WHERE lead_score >= 70 AND email IS NULL;

CREATE TABLE IF NOT EXISTS email_enrichment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  provider text NOT NULL,
  status text NOT NULL,
  email text,
  phone text,
  cost_estimate numeric(8,4),
  error text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT email_enrichment_attempts_status_check
    CHECK (status IN ('success', 'no_match', 'failed', 'skipped'))
);

CREATE INDEX IF NOT EXISTS idx_email_enrichment_attempts_lead_provider
  ON email_enrichment_attempts (lead_id, provider, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_enrichment_attempts_provider_status
  ON email_enrichment_attempts (provider, status, created_at DESC);

UPDATE leads
SET outreach_status = CASE
    WHEN COALESCE(dnc, false) = true THEN 'do_not_contact'
    WHEN email IS NOT NULL THEN 'ready_for_email_review'
    WHEN lead_score >= 70
      AND owner_mailing_address IS NOT NULL
      AND created_at < now() - interval '7 days'
      THEN 'ready_for_mail_review'
    ELSE 'needs_email'
  END,
  outreach_status_updated_at = now()
WHERE outreach_status = 'needs_email';
