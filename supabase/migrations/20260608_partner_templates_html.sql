-- Convert all 10 partner cold-email templates to clean professional HTML.
-- Drew's call (2026-06-08): HTML so it doesn't read DIY, gold accent on
-- the signature line for subtle brand.
--
-- Sender mailbox decision: outreach moves OFF @econstructinc.com to the
-- warmed alt mailboxes (@econstructllc.com etc) to keep the main brand
-- domain's reputation isolated. Reply-To + signature stay @econstructinc.com.
--
-- This migration is idempotent — UPSERTs all 10 templates, so it works
-- whether the 6 new types from 20260605 were applied or not.

INSERT INTO partner_email_templates (template_key, name, subject, body) VALUES

-- ─────────────── Existing 4 (rewritten to HTML) ───────────────

(
  'architect_cold_intro',
  'Architects: ADU + Fire Rebuild',
  'GC partner for your rebuild + ADU clients',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>My name is Frank Neimroozi — I''m the owner of econstruct, a general contracting firm here in Los Angeles. We specialize in luxury residential rebuilds, ADU construction, and fire-rebuild projects across LA County.</p>
<p>With Palisades and Eaton rebuild volume ramping this year, I''m building a small network of trusted architects and design firms we can refer clients to, and vice versa.</p>
<p>The idea is simple: when you have a client who needs a reliable GC, we''d love to be your first call. When we have a client who needs design work, we send them your way. We also pay a <strong>$5,000 referral fee</strong> for every signed GC contract that comes through a partner.</p>
<p>Open to a quick 15-minute intro this week?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
),

(
  'realtor_cold_intro',
  'Realtors: Pre-Sale Reno + Buyer Referrals',
  'GC partner for your buyer + seller clients',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>I''m Frank Neimroozi, owner of econstruct — a full-service general contractor in Los Angeles. We focus on luxury residential rebuilds, ADUs, and ground-up new builds across LA County.</p>
<p>Realtors are the gatekeepers on both sides of our business: buyers asking who to call for renovations or ADU plans before move-in, sellers asking what to fix before listing. I''d like to be the GC you point them to when that question comes up.</p>
<p>We pay a <strong>$5,000 referral fee</strong> on every signed contract that comes through a partner, and we move fast — we know what it means when a client''s listing timeline is on the line.</p>
<p>Worth a quick 15-minute intro this week?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
),

(
  'adjuster_fire_rebuild',
  'Insurance Adjusters: Fire Claim to Rebuild',
  'GC referral partnership — Palisades + Eaton rebuilds',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>I''m Frank Neimroozi, owner of econstruct — a licensed general contracting firm in Los Angeles. We''ve been doing a lot of work in the fire-rebuild space this year and I wanted to connect with adjusters actively working claims in the Palisades and Eaton areas.</p>
<p>Here''s what I''ve noticed: once a homeowner gets their settlement, the #1 question is "who do I trust to rebuild?" That gap is where we can help each other.</p>
<p>We''re offering a <strong>$5,000 referral fee</strong> for every signed rebuild contract that comes from an adjuster partner. No strings — just a simple agreement and a wire when the contract is signed.</p>
<p>We''re fully licensed, insured, and have handled everything from full teardowns to structural repairs, ground-ups, and ADU additions. Happy to send our credentials if helpful.</p>
<p>Any interest in a quick call this week?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
),

(
  'expediter_permit_partner',
  'Expediters / Permit Runners',
  'Ongoing permit work + referral partnership',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>My name is Frank Neimroozi — I run econstruct, a general contracting firm in Los Angeles. We pull 15 to 20 permits per year across commercial TI, ADU, and residential rebuild projects, and I''m looking to build a long-term relationship with a reliable permit-expediting partner.</p>
<p>Beyond our own volume, we also work with clients who need expediting support independently of us — and I''d rather refer them to a trusted partner than have them go searching on their own.</p>
<p>We have a mutual referral program in place: <strong>$5,000 for any GC contract</strong> that comes our way through your network, and I''ll make sure you''re our first call on every permit we pull.</p>
<p>Open to a brief 10-minute intro this week?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
),

-- ─────────────── 6 new types (HTML bodies) ───────────────

(
  'interior_designer_cold',
  'Interior Designers: Referral GC Partner',
  'GC partner for your design clients',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>I''m Frank Neimroozi, owner of econstruct — a licensed general contractor here in Los Angeles. We specialize in luxury residential rebuilds, ADUs, and full ground-ups, including a heavy lift in the Palisades and Eaton rebuild zones this year.</p>
<p>Designers are typically hired before the GC, which means you''re the person clients trust to recommend a build team. I''d like to be that recommendation when the fit is right.</p>
<p>We pay a <strong>$5,000 referral fee</strong> on every signed contract that comes through a partner, and we run projects in a way that protects the designer relationship instead of muscling in on it.</p>
<p>Open to a 15-minute call to compare notes?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
),

(
  'real_estate_attorney_cold',
  'Real Estate Attorneys: Post-Fire + Litigation Rebuild',
  'Trusted GC for your post-fire and rebuild clients',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>I''m Frank Neimroozi with econstruct, a Los Angeles general contractor. We''re deep in the Palisades and Eaton rebuild work, and most of the families we''re helping had legal disputes with insurers or HOAs before they ever broke ground.</p>
<p>When the dust settles on litigation or settlement, the next question is always the same: <em>who do we trust to actually build this back?</em> I''d like to be the GC you call when that question comes up.</p>
<p>We pay a <strong>$5,000 referral fee</strong> on signed contracts and we keep the project paper trail clean enough that it doesn''t put your file work at risk.</p>
<p>Open to a 15-minute intro this week?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
),

(
  'cpa_wealth_cold',
  'CPAs / Wealth Advisors: ADU Income + Cost-Seg + 1031 Rebuilds',
  'GC partner for your real estate clients',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>I''m Frank Neimroozi at econstruct, a Los Angeles general contractor focused on luxury residential rebuilds, ADUs, and ground-up new builds.</p>
<p>You see real estate decisions before anyone else — clients asking about ADU income, cost-segregation depreciation, 1031 exchange targets, or rebuild ROI on a fire claim. When those conversations turn into a build, I want to be the person you point them to.</p>
<p>We pay a <strong>$5,000 referral fee</strong> on every signed GC contract that comes through a partner, and we''re happy to coordinate directly with your office so the numbers and the schedule line up cleanly.</p>
<p>Worth a brief intro this week?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
),

(
  'escrow_officer_cold',
  'Escrow Officers: GC Referral at the Closing Table',
  'GC referral for your buyers at the closing table',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>I''m Frank Neimroozi, owner of econstruct — a licensed LA general contractor. Most of our luxury rebuild and renovation work in LA County starts at the closing table, when buyers ask their escrow officer who to call for renovations or ADU plans.</p>
<p>I''d like to be the GC you mention when that question comes up. We pay a <strong>$5,000 referral fee</strong> on every signed contract that comes through a partner, and we won''t put you in the middle of the build — once the intro is made, we own the relationship from there.</p>
<p>Open to a quick intro call this week?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
),

(
  'structural_engineer_cold',
  'Structural & Geotech Engineers: Hillside + Rebuild GC Partner',
  'GC partner for hillside + rebuild projects',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>I''m Frank Neimroozi at econstruct, a Los Angeles GC focused on luxury residential rebuilds, hillside ground-ups, and ADUs. We''re working a significant volume of Palisades and Eaton rebuilds this year, and most of them start with a call to an engineer.</p>
<p>When you finish a report and the owner asks who they should hire to build it, I''d like to be on that short list. We pay a <strong>$5,000 referral fee</strong> on signed contracts, and we run hillside and rebuild projects clean — your stamped work doesn''t get questioned in the field.</p>
<p>Worth a 15-minute intro this week?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
),

(
  'restoration_cold',
  'Fire / Water Restoration: First In, GC for the Rebuild',
  'GC partner for your post-loss rebuilds',
  '<div style="font-family:''Helvetica Neue'',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi {{firstName}},</p>
<p>I''m Frank Neimroozi, owner of econstruct — a Los Angeles general contractor running fire and water rebuild projects across LA County, including a heavy Palisades and Eaton load.</p>
<p>Your team is first in the door after a loss. Once mitigation is done, the homeowner is staring at a long rebuild and asking who to hire. I''d like to be the GC you hand that conversation off to.</p>
<p>We pay a <strong>$5,000 referral fee</strong> per signed rebuild contract, and we coordinate directly with your job file so the transition is clean for the insured.</p>
<p>Open to a quick intro this week?</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:''Helvetica Neue'',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>'
)

ON CONFLICT (template_key) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  body = EXCLUDED.body,
  updated_at = now();
