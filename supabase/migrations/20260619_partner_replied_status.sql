-- Add "Replied" stage to the partner lifecycle workflow.
-- Sits between Contacted and Agreement Sent so Frank can see who
-- has replied to cold outreach and needs to be moved forward.

ALTER TABLE partner_leads
  DROP CONSTRAINT IF EXISTS partner_leads_status_check;

ALTER TABLE partner_leads
  ADD CONSTRAINT partner_leads_status_check CHECK (
    status IN (
      'New Lead',
      'Contacted',
      'Replied',
      'Agreement Sent',
      'Active Partner',
      'Inactive'
    )
  );
