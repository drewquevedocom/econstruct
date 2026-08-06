-- Compliance fix: the $5,000 referral fee was baked onto every auto-sourced
-- contact (Apollo refresh, bulk imports) before any relationship existed --
-- a live exposure for adjusters/attorneys/escrow officers, whose professional
-- conduct rules can treat an unsolicited fee offer from a stranger as a
-- reportable conflict. The fee only belongs on a partner record once a real
-- agreement is actually underway.
--
-- 1. referral_fee was NOT NULL DEFAULT 5000 -- meaning even removing the
--    hardcoded value from application code wouldn't have helped; the column
--    default would have silently reapplied it on every insert. Both are
--    fixed here.
ALTER TABLE partner_leads
  ALTER COLUMN referral_fee DROP NOT NULL,
  ALTER COLUMN referral_fee SET DEFAULT NULL;

-- 2. Null the fee only where it's still just the untouched auto-populated
--    default and no real agreement has started -- this intentionally leaves
--    the fee alone for any partner who has actually progressed past "Not
--    Started" (a real, human-confirmed relationship), whether auto-sourced
--    originally or not.
UPDATE partner_leads
SET referral_fee = NULL
WHERE referral_fee = 5000
  AND referral_agreement_status = 'Not Started';
