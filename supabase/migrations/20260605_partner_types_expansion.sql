-- Expand partner_type categories: +6 high-value LA referral channels, -1 GC bucket.
-- Drew's call (client feedback): GCs are competitors not partners. We want the
-- people who refer rebuild/luxury new-build work TO a GC, not other GCs.
-- Top targets: Realtors, Real Estate Attorneys, Architects.

BEGIN;

-- Drop the old constraint so we can broaden it.
ALTER TABLE partner_leads
  DROP CONSTRAINT IF EXISTS partner_leads_partner_type_check;

-- Reclassify any orphaned 'General Contractor (subcontract partner)' rows.
-- (Safety net only — current prod has 0 such rows.)
UPDATE partner_leads
   SET partner_type = 'Other'
 WHERE partner_type = 'General Contractor (subcontract partner)';

-- New canonical set (12 active categories, GC removed).
ALTER TABLE partner_leads
  ADD CONSTRAINT partner_leads_partner_type_check CHECK (
    partner_type IN (
      'Architect',
      'Realtor / Real Estate Agent',
      'Insurance Agent / Adjuster',
      'Expediter / Permit Runner',
      'Interior Designer',
      'Real Estate Attorney',
      'CPA / Wealth Advisor',
      'Escrow Officer',
      'Structural / Geotech Engineer',
      'Fire / Water Restoration',
      'HOA / Property Manager',
      'Other'
    )
  );

-- Seed cold-email templates for the 6 new categories.
-- Frank's voice, LA + fire-rebuild + luxury-new-build framing, $5K referral fee.
INSERT INTO partner_email_templates (template_key, name, subject, body)
VALUES
  (
    'interior_designer_cold',
    'Interior Designers: Referral GC Partner',
    'GC partner for your design clients — econstruct',
    'Hi [First Name],

I am Frank Neimroozi, owner of econstruct, a licensed general contractor here in Los Angeles. We specialize in luxury residential rebuilds, ADUs, and full ground-ups across LA County, including a heavy lift in the Palisades and Eaton rebuild zones this year.

Designers are typically hired before the GC, which means you are the person clients trust to recommend a build team. I would like to be that recommendation when the fit is right.

We pay a $5,000 referral fee for every signed contract that comes through a partner, and we run our projects in a way that protects the designer relationship instead of muscling in on it.

Would you be open to a quick 15-minute call to compare notes?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com'
  ),
  (
    'real_estate_attorney_cold',
    'Real Estate Attorneys: Post-Fire + Litigation Rebuild',
    'Trusted GC for your post-fire and rebuild clients',
    'Hi [First Name],

I am Frank Neimroozi with econstruct, a Los Angeles general contractor. We are deep in the Palisades and Eaton rebuild work and most of the families we are helping had legal disputes with insurers or HOAs before they ever broke ground.

When the dust settles on litigation or settlement, the next question is always the same — who do we trust to actually build this back. I would like to be the GC you call when that question comes up.

We pay a $5,000 referral fee on signed contracts and we keep the project paper trail clean enough that it does not put your file work at risk.

Open to a 15-minute intro this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com'
  ),
  (
    'cpa_wealth_cold',
    'CPAs / Wealth Advisors: ADU Income + Cost-Seg + 1031 Rebuilds',
    'GC partner for your real estate clients — econstruct',
    'Hi [First Name],

I am Frank Neimroozi at econstruct, a Los Angeles general contractor focused on luxury residential rebuilds, ADUs, and ground-up new builds.

You see real estate decisions before anyone else — clients asking about ADU income, cost-segregation depreciation, 1031 exchange targets, or rebuild ROI on a fire claim. When those conversations turn into a build, I want to be the person you point them to.

We pay a $5,000 referral fee on every signed GC contract that comes through a partner and we are happy to coordinate directly with your office so the numbers and the schedule line up cleanly.

Worth a brief intro this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com'
  ),
  (
    'escrow_officer_cold',
    'Escrow Officers: GC Referral at the Closing Table',
    '"Who do we call for renovations?" — let it be econstruct',
    'Hi [First Name],

I am Frank Neimroozi, owner of econstruct, a licensed LA general contractor. Most of our luxury rebuild and renovation work in LA County starts at the closing table — buyers ask their escrow officer who to call for renovations or ADU plans.

I would like to be the GC you mention when that question comes up. We pay a $5,000 referral fee on every signed contract that comes through a partner, and we will not put you in the middle of the build — once the intro is made, we own the relationship from there.

Open to a quick intro call this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com'
  ),
  (
    'structural_engineer_cold',
    'Structural & Geotech Engineers: Hillside + Rebuild GC Partner',
    'GC partner for hillside + rebuild projects — econstruct',
    'Hi [First Name],

I am Frank Neimroozi at econstruct, a Los Angeles GC focused on luxury residential rebuilds, hillside ground-ups, and ADUs. We are working a significant volume of Palisades and Eaton rebuilds this year and most of them start with a call to an engineer.

When you finish a report and the owner asks who they should hire to build it, I would like to be on that short list. We pay a $5,000 referral fee on signed contracts, and we run hillside and rebuild projects clean — your stamped work does not get questioned in the field.

Worth a 15-minute intro this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com'
  ),
  (
    'restoration_cold',
    'Fire / Water Restoration: First In, GC for the Rebuild',
    'GC partner for your post-loss rebuilds — econstruct',
    'Hi [First Name],

I am Frank Neimroozi, owner of econstruct, a Los Angeles general contractor running fire and water rebuild projects across LA County, including a heavy Palisades and Eaton load.

Your team is first in the door after a loss — once mitigation is done, the homeowner is staring at a long rebuild and asking who to hire. I would like to be the GC you hand that conversation off to.

We pay a $5,000 referral fee per signed rebuild contract, and we coordinate directly with your job file so the transition is clean for the insured.

Open to a quick intro this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com'
  )
ON CONFLICT (template_key) DO NOTHING;

COMMIT;
