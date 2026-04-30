-- Partner Network CRM module.
-- Run in Supabase SQL Editor before using /crm/partners.

CREATE SEQUENCE IF NOT EXISTS partner_lead_number_seq START 1;

CREATE TABLE IF NOT EXISTS partner_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id text NOT NULL UNIQUE DEFAULT (
    'P-' || lpad(nextval('partner_lead_number_seq')::text, 3, '0')
  ),
  partner_name text NOT NULL,
  company_firm text,
  partner_type text NOT NULL,
  specialization text,
  source text NOT NULL,
  contact_email text,
  contact_phone text,
  linkedin_url text,
  how_we_met text,
  referral_agreement_status text NOT NULL DEFAULT 'Not Started',
  referral_fee numeric(12,2) NOT NULL DEFAULT 5000,
  notes text,
  date_added date NOT NULL DEFAULT CURRENT_DATE,
  last_contact_date date,
  next_follow_up_date date,
  assigned_to text NOT NULL DEFAULT 'Drew Quevedo',
  status text NOT NULL DEFAULT 'New Lead',
  date_signed date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partner_leads_partner_type_check CHECK (
    partner_type IN (
      'Architect',
      'Realtor / Real Estate Agent',
      'Insurance Agent / Adjuster',
      'Expediter / Permit Runner',
      'General Contractor (subcontract partner)',
      'HOA / Property Manager',
      'Other'
    )
  ),
  CONSTRAINT partner_leads_source_check CHECK (
    source IN (
      'AIA LA Event',
      'BNI / Networking',
      'Cold Outreach',
      'Referral from Frank',
      'Inbound / Found Us',
      'Other'
    )
  ),
  CONSTRAINT partner_leads_agreement_status_check CHECK (
    referral_agreement_status IN ('Not Started', 'Sent', 'Signed', 'Active')
  ),
  CONSTRAINT partner_leads_status_check CHECK (
    status IN ('New Lead', 'Contacted', 'Agreement Sent', 'Active Partner', 'Inactive')
  )
);

CREATE INDEX IF NOT EXISTS idx_partner_leads_status
  ON partner_leads (status, next_follow_up_date);

CREATE INDEX IF NOT EXISTS idx_partner_leads_type_source
  ON partner_leads (partner_type, source);

CREATE TABLE IF NOT EXISTS partner_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_lead_id uuid NOT NULL REFERENCES partner_leads(id) ON DELETE CASCADE,
  title text NOT NULL,
  due_date date NOT NULL,
  is_recurring boolean NOT NULL DEFAULT false,
  recurrence text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_tasks_due
  ON partner_tasks (due_date, completed_at);

CREATE TABLE IF NOT EXISTS partner_email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL UNIQUE,
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO partner_email_templates (template_key, name, subject, body)
VALUES
  (
    'first_outreach',
    'First Outreach',
    'Referral partnership with econstruct',
    'Hi [Partner Name],

I wanted to introduce myself. I am Drew Quevedo with econstruct, and we are building a focused partner network around high-quality residential and commercial construction opportunities.

Since you are a [Partner Type], I thought there may be a clean way for us to help each other. We offer a referral program for signed GC contracts, and I would be glad to walk you through how it works.

Would you be open to a quick call this week?

[Drew''s contact info]'
  ),
  (
    'agreement_follow_up',
    'Agreement Follow-Up',
    'Quick follow-up on the referral agreement',
    'Hi [Partner Name],

Quick follow-up on the referral agreement I sent over. I wanted to see if you had any questions or wanted to walk through the details together.

The goal is to keep this simple and make sure expectations are clear before referrals start moving.

[Drew''s contact info]'
  ),
  (
    'monthly_check_in',
    'Monthly Check-In',
    'Any projects or referrals this month?',
    'Hi [Partner Name],

Hope you are doing well. I wanted to check in and see if you have any clients, property owners, or projects that may need a trusted GC this month.

If anything is active or coming up, send it my way and I will take good care of the conversation.

[Drew''s contact info]'
  )
ON CONFLICT (template_key) DO NOTHING;
