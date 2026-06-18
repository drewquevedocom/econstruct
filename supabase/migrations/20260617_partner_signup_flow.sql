-- Partner self-signup flow: referral code + click-to-agree token + signed timestamps.
-- After Frank approves a reply, Drew/CRM fires /api/agents/send-agreement which
-- generates the token, emails the partner, and waits for them to click "I agree."

ALTER TABLE partner_leads
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS agreement_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS agreement_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS agreement_signed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_partner_leads_agreement_token
  ON partner_leads (agreement_token);
