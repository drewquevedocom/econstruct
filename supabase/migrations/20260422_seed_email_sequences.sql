-- Auto-generated seed for email_sequences and sequence_steps
-- Source: econstruct-crm/js/campaign-templates.js
-- Generated: 2026-04-22T16:51:56.448Z

BEGIN;

-- FIRE REBUILD OUTREACH
WITH seq_fire_rebuild_outreach AS (
  INSERT INTO email_sequences (name, description, is_active)
  VALUES ('FIRE REBUILD OUTREACH', 'Target: Palisades & Altadena homeowners/investors with fire-damaged or destroyed properties   |   Trigger: Lead opts in via "Fire Rebuild" form or is added manually', true)
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO sequence_steps (sequence_id, step_number, delay_days, subject, body)
VALUES
    (CAST((SELECT id FROM seq_fire_rebuild_outreach) AS uuid), 1, 0, 'Your rebuild starts here — let''s talk', 'Hi [First Name],

The rebuild process can feel overwhelming — permits, architects, insurance coordination, contractors. Most homeowners don''t know where to start.

We do.

econstruct Homes is a licensed General Contractor specializing in fire rebuild projects in Pacific Palisades and Altadena. We''ve navigated the city''s permitting process for years, worked directly with insurance adjusters, and we partner with LA Expedite — a full-service architectural and permitting firm — so you have one team handling everything from design to breaking ground.

You don''t have to figure this out alone.

Let''s get on a quick 30-minute call and talk through your options.

[BOOK YOUR FREE CONSULTATION CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_fire_rebuild_outreach) AS uuid), 2, 2, 'Here''s exactly how the rebuild process works', 'Hi [First Name],

If you''re researching the rebuild process, you''ve probably heard terms like RTI, plan check, and grading permit — and it can feel like a foreign language.

Here''s a simple breakdown:

Phase 1 — Design & Plans (8-12 weeks): Our architectural partners at LA Expedite create your plans and submit to the city.

Phase 2 — Plan Check (4-6 weeks): The city reviews and approves. In the Palisades right now, approvals are moving faster than usual.

Phase 3 — RTI + Contract: Once plans are approved, we finalize your econstruct contract and mobilize the team.

Phase 4 — Grading + Build: We break ground, complete grading, receive city approvals, then proceed with the full build out.

The sooner you start Phase 1, the sooner you''re back home.

[SCHEDULE YOUR FREE CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_fire_rebuild_outreach) AS uuid), 3, 5, 'Your insurance company has a timeline. Do you?', 'Hi [First Name],

One thing many fire victims don''t realize until it''s too late:

Your ALE (Additional Living Expense) benefits — the funds your insurance company pays for your temporary housing — have a limit. Typically 18-24 months from the date of loss.

For the Palisades fire, that clock started January 2025.

The longer you wait to start your rebuild, the more you''ll be paying out of pocket for housing while your property sits vacant.

We work directly with your insurance adjuster to maximize your rebuild budget and minimize delays. Let''s make sure you''re using every dollar you''re entitled to.

[BOOK YOUR FREE CALL TODAY]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_fire_rebuild_outreach) AS uuid), 4, 9, 'A question about your rebuild decision', 'Hi [First Name],

We talk to a lot of homeowners who are still deciding: do I rebuild, or do I sell the lot and move on?

Honest answer: it depends on your situation, your insurance coverage, and your long-term goals. We won''t push you either way.

But here''s what we''ve seen:

Homeowners who rebuilt in fire-affected areas in the past (Woolsey, Thomas, Creek) saw significant property value increases once the neighborhood recovered.

If you want a no-pressure conversation about your specific situation — your insurance payout, your lot value, your timeline — we''re happy to walk through it with you.

No commitment. Just clarity.

[LET''S TALK THROUGH YOUR OPTIONS]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_fire_rebuild_outreach) AS uuid), 5, 14, 'Last check-in — want to connect before the rush?', 'Hi [First Name],

Spring is here, and rebuild season is starting.

We have a limited number of project slots available for Q3 & Q4 2026 starts. Once those are filled, we won''t be taking on new projects until 2027.

If you''ve been thinking about starting your rebuild, now is the time to get on the calendar.

If the timing isn''t right yet — no problem. We''ll be here when you''re ready.

Either way, I''d love to connect for 20 minutes and give you an honest assessment of where your project stands.

[BOOK A CALL — LIMITED Q2 SLOTS AVAILABLE]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2')
ON CONFLICT (sequence_id, step_number) DO NOTHING;

-- LUXURY MODERNIZATION
WITH seq_luxury_modernization AS (
  INSERT INTO email_sequences (name, description, is_active)
  VALUES ('LUXURY MODERNIZATION', 'Target: High-net-worth homeowners in Brentwood, Pacific Palisades, Santa Monica, Malibu, Calabasas   |   Trigger: Lead opts in via "Remodel" or "Luxury" form, or is added manually', true)
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO sequence_steps (sequence_id, step_number, delay_days, subject, body)
VALUES
    (CAST((SELECT id FROM seq_luxury_modernization) AS uuid), 1, 0, 'What does a $1M+ remodel actually look like?', 'Hi [First Name],

Not every general contractor is equipped for a high-end remodel.

econstruct Homes specializes in luxury renovations — $500K to $3M+ projects in Pacific Palisades, Brentwood, Santa Monica, Bell Canyon, Calabasas, Agoura Hills and Malibu. We''ve delivered open-concept transformations, full smart home integrations (Crestron, Savant, Lutron), and complete gut renovations with zero corner-cutting.

Our clients don''t get surprises. They get a detailed scope, a fixed timeline, and a contractor who answers the phone shows up.

If you''re planning a significant renovation in the next 6-12 months, let''s talk now.

[SCHEDULE YOUR DISCOVERY CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_luxury_modernization) AS uuid), 2, 3, 'The 3 mistakes most homeowners make with high-end remodels', 'Hi [First Name],

After years of high-end remodels on the West Side, we''ve seen the same three mistakes over and over:

1. Hiring the contractor and architect separately — they don''t communicate often and sometimes not at all, and you pay for the gaps in change orders.

2. Starting construction before every revision is fully made & permits are fully approved — the project stalls mid-build, and you''re paying holding costs.

3. No fixed-price scope — every decision becomes a negotiation, and the budget balloons 20-30% over.

We built our process to eliminate all three. We partner with LA Expedite for architecture and permitting — same team, same timeline, no gaps.

Want to see how it works?

[BOOK A 30-MINUTE WALK-THROUGH CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_luxury_modernization) AS uuid), 3, 7, 'What smart home integration actually costs in 2026', 'Hi [First Name],

One of the most common things we hear from clients after a remodel: ''I wish we''d planned for the smart home system from the beginning.''

Retrofitting is expensive. Running conduit, adding panels, coordinating subcontractors after walls are closed & finishes are installed — it costs 2 x what it would have during the remodel.

We integrate smart home planning into every project from day one:

- Solar + battery backup (whole-home resilience)
- AV/LV: home theater, distributed audio, whole-home speakers
- Lighting control (Lutron, custom scenes)
- Security: cameras, access control, monitoring
- Networking: structured cabling, Wi-Fi 7 coverage, rack build-out

If you''re already doing a significant remodel, the incremental cost to do it right is smaller than you think.

[LET''S TALK ABOUT YOUR PROJECT]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_luxury_modernization) AS uuid), 4, 12, 'What''s your home worth after a full renovation?', 'Hi [First Name],

For homeowners on the West Side, a well-executed luxury remodel isn''t just an aesthetic upgrade — it''s a financial one.

In Pacific Palisades, Brentwood, and Santa Monica, high-end renovated homes are commanding premiums of 20-40% over comparable unrenovated properties.

A $600K full renovation on a $2.5M home can push the value to $3.2-3.5M — a return of $300K-$400K on top of the renovation cost itself.

And if you''re not selling — you''re living in a better home, with better systems, and lower maintenance costs for the next two decades.

Want to talk through the numbers for your specific property?

[BOOK YOUR COMPLIMENTARY ASSESSMENT]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_luxury_modernization) AS uuid), 5, 18, 'Still thinking about it? Here''s our honest take.', 'Hi [First Name],

We''ve reached out a few times and haven''t connected — that''s completely fine. Remodel decisions are big ones, and timing matters.

If you''re still in research mode, we get it. We''re happy to be a resource when the time is right.

But if you''re moving toward a decision in the next 60 days, here''s where we stand: we have two remaining project start slots for Q2 2026. After those are filled, new projects go to a Q3 waitlist.

No pressure — but if timing aligns, a 20-minute call costs you nothing.

[CHECK AVAILABILITY FOR A QUICK CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2')
ON CONFLICT (sequence_id, step_number) DO NOTHING;

-- REFERRAL PARTNER OUTREACH
WITH seq_referral_partner_outreach AS (
  INSERT INTO email_sequences (name, description, is_active)
  VALUES ('REFERRAL PARTNER OUTREACH', 'Target: Realtors, architects, insurance agents, insurance adjusters, interior designers in the LA area   |   Trigger: Added manually after meeting or referral conversation', true)
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO sequence_steps (sequence_id, step_number, delay_days, subject, body)
VALUES
    (CAST((SELECT id FROM seq_referral_partner_outreach) AS uuid), 1, 0, 'Let''s build something together — referral partnership', 'Hi [First Name],

I''m Frank Neimroozi with econstruct Homes — we''re a licensed GC specializing in luxury remodels and fire rebuilds on the West Side.

We''re building out a referral network with the best professionals in the LA market — realtors, architects, designers, insurance agents, and insurance adjusters — people who are seeing the same clients we are.

The idea is simple: when your clients need a contractor, you send them to us. When our clients need your services, we send them to you. No fees, no contracts — just good business between trusted professionals.

Would you be open to a 15-minute call to see if there''s a fit?

[BOOK A QUICK INTRO CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_referral_partner_outreach) AS uuid), 2, 4, 'What we offer your clients (quick overview)', 'Hi [First Name],

Following up with a quick overview of what we do, so you have it handy when the right client comes along.

econstruct Homes serves:

- Fire rebuild clients (Palisades, Altadena) — full rebuild from demo to final walkthrough
- Luxury remodel clients — $750K-$3M+ renovations in Brentwood, Santa Monica, Malibu, Calabasas, Agoura Hills. Bell Canyon
- ADU clients — permitted detached/attached ADUs, ground-up new construction
- Insurance coordination — we work directly with adjusters to maximize the client''s payout

We partner with LA Expedite for architecture and permitting — so your clients get a truly one-stop experience.

Any of these fit clients you''re currently working with?

[LET''S SET UP A QUICK CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_referral_partner_outreach) AS uuid), 3, 10, 'A mutual client opportunity — worth a quick call?', 'Hi [First Name],

I have a client currently in the planning phase of a significant West Side project — they''re going to need [realtor services / interior design help / insurance coordination] in the next 60 days.

If you''re open to connecting, I''d be happy to make the intro.

We''re not looking for anything in return right now — just trying to build the right network and make sure my clients are taken care of end-to-end.

Open to a quick 15-minute intro this week?

[YES — BOOK A CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_referral_partner_outreach) AS uuid), 4, 16, 'Co-marketing & branding idea — events, content, and more', 'Hi [First Name],

Beyond just swapping referrals, I''ve been thinking about how we could show up together in front of each other''s audiences.

A few ideas:

- Co-hosted events (we''re already doing Malibu and Palisades community events — you''d be featured as a trusted partner)
- Email campaigns (we can co-brand our drip sequences and feature each other''s services)
- Blog and social content (guest posts, Instagram collabs)
- Backlink exchange (good for both of our SEO)

This is the kind of partnership that builds real visibility in the market, not just one-off referrals.

Interested in exploring it?

[LET''S TALK ABOUT A FULL PARTNERSHIP]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_referral_partner_outreach) AS uuid), 5, 22, 'Closing the loop — still interested?', 'Hi [First Name],

I''ve reached out a few times about a potential partnership — totally understand if the timing isn''t right or it''s not a fit.

I''ll keep the door open. If a client ever needs a high-end contractor — fire rebuild, luxury remodel, or ADU — you can always reach me directly.

And if you ever want to revisit the co-marketing conversation, I''m easy to find.

Wishing you a great rest of the month.

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2')
ON CONFLICT (sequence_id, step_number) DO NOTHING;

-- ADU / GROUND-UP NEW CONSTRUCTION
WITH seq_adu_ground_up_new_construction AS (
  INSERT INTO email_sequences (name, description, is_active)
  VALUES ('ADU / GROUND-UP NEW CONSTRUCTION', 'Target: Homeowners interested in ADUs, investors, property owners with vacant lots   |   Trigger: Lead opts in via ADU or new construction form, or added manually', true)
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO sequence_steps (sequence_id, step_number, delay_days, subject, body)
VALUES
    (CAST((SELECT id FROM seq_adu_ground_up_new_construction) AS uuid), 1, 0, 'Your property can generate $3,000-$5,000/month. Here''s how.', 'Hi [First Name],

A permitted ADU (Accessory Dwelling Unit) on your property can generate $3,000-$5,000/month in rental income in the LA market — depending on location, size, and finish level.

econstruct Homes builds turnkey ADUs — we handle everything from permits to final inspection.

Here''s what most homeowners don''t realize: LA''s ADU permit process has been significantly streamlined. In many cases, we can get a detached ADU permitted and under construction within 2-3 months.

Want to know if your lot qualifies and what your income potential looks like?

[BOOK A FREE LOT ASSESSMENT]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_adu_ground_up_new_construction) AS uuid), 2, 3, 'ADU types, costs, and timelines — the honest breakdown', 'Hi [First Name],

Here''s an honest breakdown of ADU costs in the LA market:

Garage Conversion: $125K-$175K (lowest cost, fastest permit, limited size)

Attached ADU: $250K-$400K (connected to main house, shares some utilities)

Detached ADU: $300K-$450K+ (most valuable, best rental income, own entrance)

New Construction (ground up): $500K-$900k+ depending on scope and size

All of these numbers depend on finishes, lot conditions, and current permit costs. We give every client a detailed scope and fixed price before any work begins.

Ready to get a real number for your property?

[BOOK YOUR FREE ASSESSMENT]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_adu_ground_up_new_construction) AS uuid), 3, 7, 'The permit process for ADUs in LA — what you actually need', 'Hi [First Name],

The #1 reason ADU projects stall: permit issues.

Missing documents, incorrect site plans, zoning conflicts — any of these can push your timeline back up to 6 months and add thousands in holding costs.

Here''s how we handle it:

We partner with LA Expedite — a full-service architectural and permitting firm with deep relationships at LADBS and city planning. They''ve expedited hundreds of permits in LA County. We submit complete, accurate packages the first time.

Our typical timeline from signed contract to permit approval: 8-14 weeks.

Want to see a sample project timeline?

[BOOK A CALL — WE''LL WALK YOU THROUGH IT]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_adu_ground_up_new_construction) AS uuid), 4, 12, 'Financing your ADU — options most people don''t know about', 'Hi [First Name],

One of the most common things we hear: ''I love the idea, but I don''t have the cash right now.''

Here''s what most homeowners don''t know: you may not need it.

Three financing options our clients commonly use:

1. HELOC (Home Equity Line of Credit): Tap your existing equity — rates are variable but accessible.

2. Cash-out refinance: If you have significant equity, you can refinance and pull cash at a fixed rate.

3. ADU-specific loans: Several lenders (including CalHFA for qualifying properties) offer ADU construction loans with favorable terms.

In many cases, the rental income from the ADU covers the monthly loan payment within the first 12 months.

Want to talk through the financing options for your situation?

[LET''S RUN THE NUMBERS TOGETHER]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_adu_ground_up_new_construction) AS uuid), 5, 17, 'Last check-in on your ADU project', 'Hi [First Name],

I wanted to reach out one more time before closing the loop.

We have one remaining ADU project slot for a Q2 2026 start — which means project commencement by June. After that, new ADU projects go to a Q3 waitlist.

If you''re serious about moving forward this year, now is the time to get on the calendar.

If the timing isn''t right — no problem. We''ll be here when you''re ready.

[CLAIM THE Q2 SLOT — BOOK A CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2')
ON CONFLICT (sequence_id, step_number) DO NOTHING;

-- LA EXPEDITE CO-BRANDED OUTREACH
WITH seq_la_expedite_co_branded_outreac AS (
  INSERT INTO email_sequences (name, description, is_active)
  VALUES ('LA EXPEDITE CO-BRANDED OUTREACH', 'Target: Fire rebuild leads — co-branded with LA Expedite (Jennifer & Josias)   |   Trigger: Fire rebuild lead who needs both contractor and architecture/permitting services', true)
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO sequence_steps (sequence_id, step_number, delay_days, subject, body)
VALUES
    (CAST((SELECT id FROM seq_la_expedite_co_branded_outreac) AS uuid), 1, 0, 'Palisades rebuild? One team handles everything.', 'Hi [First Name],

Rebuilding after a fire is complicated enough without having to manage construction, architects, and permit consultants separately.

We built a solution.

econstruct Homes (licensed GC) and LA Expedite (full-service architectural and permitting firm) are partners to offer fire rebuild clients a completely integrated experience:

- LA Expedite handles: architectural plans, all consultants (structural, civil, MEP, landscaping), permit submission and expediting
- econstruct handles: design consulting, construction, site management, insurance coordination, final walkthrough

One point of contact. One timeline. No gaps.

As a special offer for Palisades and Altadena fire rebuild clients, we''re offering $750 off joint feasibility assessment — normally valued at $4500. You''ll get a clear picture of your rebuild scope, timeline, and estimated budget before committing to anything.

[BOOK YOUR FEASIBILITY ASSESSMENT]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_la_expedite_co_branded_outreac) AS uuid), 2, 3, 'What our free feasibility assessment actually covers', 'Hi [First Name],

We''ve gotten a few questions about what our joint feasibility assessment actually covers. Here''s exactly what you get:

1. Site review: We assess your lot, existing conditions, zoning, and any debris/demo considerations.

2. Scope definition: LA Expedite walks through your rebuild options — like-for-like replacement vs. modified plans.

3. Budget range: econstruct provides a preliminary cost range based on your scope and current material/labor costs.

4. Insurance gap analysis: We review your insurance payout and identify any gaps vs. actual rebuild cost — so there are no surprises.

5. Timeline projection: From design submission to expected occupancy.

This assessment is normally a $5000+ engagement. For Palisades and Altadena fire rebuild clients, we''re offering $500 discount as part of our commitment to the community.

[BOOK YOUR DETAILED ASSESSMENT]

Robyn Ellis | econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_la_expedite_co_branded_outreac) AS uuid), 3, 8, 'How other Palisades families are navigating the rebuild', 'Hi [First Name],

We''ve been on the ground in Pacific Palisades every week since January, and we want to give you an honest picture of where things stand:

The rebuild community is moving. We''re seeing a significant number of homeowners already in design and plan check phases — some who started as early as last summer are approaching project completion.

The homeowners who are furthest along all have one thing in common: they started early and had an integrated team from day one.

Every week you wait is a week added to your move-back-in date.

Our detailed joint feasibility assessment takes a week to prepare. It gives you a complete picture so you can make an informed decision — whether you rebuild with us or not.

[BOOK YOUR ASSESSMENT]

Robyn Ellis | econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_la_expedite_co_branded_outreac) AS uuid), 4, 13, 'Your insurance company is watching the clock', 'Hi [First Name],

We want to flag something important that many fire rebuild clients don''t realize until it''s too late.

Your ALE (Additional Living Expense) benefits — the housing stipend your insurance company pays while you''re displaced — have a hard deadline. Typically 18-24 months from the date of loss.

For the January 2025 Palisades fire, many policies will hit that deadline in mid-to-late 2026.

If you''re not actively in a rebuild when your ALE runs out, you lose the benefit — and start paying your temporary housing costs out of pocket.

Our detailed feasibility assessment includes a full review of your ALE timeline and how to structure your rebuild to protect every dollar.

[PROTECT YOUR ALE — BOOK YOUR ASSESSMENT]

Robyn Ellis | econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_la_expedite_co_branded_outreac) AS uuid), 5, 19, 'Last message from the econstruct + LA Expedite team', 'Hi [First Name],

This will be our last outreach — we don''t want to fill your inbox.

We''re closing our $750 discount towards joint feasibility assessment offer for new applicants at the end of next month. We''re limiting it to active Palisades and Altadena fire rebuild cases so we can give each family the attention they deserve.

If you want to take advantage of it, now is the time.

If the timing truly isn''t right — we understand. Reach out whenever you''re ready. We''ll be here.

[CLAIM YOUR $750 DISCOUNT TOWARDS ASSESSMENT BEFORE THE DEADLINE]

Robyn Ellis | econstruct Homes
(310) 740-9999 ext. 2')
ON CONFLICT (sequence_id, step_number) DO NOTHING;

-- MARKET INTELLIGENCE / HOT LEAD NURTURE
WITH seq_market_intelligence_hot_lead_n AS (
  INSERT INTO email_sequences (name, description, is_active)
  VALUES ('MARKET INTELLIGENCE / HOT LEAD NURTURE', 'Target: High-intent leads who''ve engaged multiple times, requested info, or been referred directly   |   Trigger: Lead score threshold reached, or manually flagged as hot by Frank/Robin', true)
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO sequence_steps (sequence_id, step_number, delay_days, subject, body)
VALUES
    (CAST((SELECT id FROM seq_market_intelligence_hot_lead_n) AS uuid), 1, 0, 'Robyn here — let''s talk this week', 'Hi [First Name],

This is Robyn Ellis — I work at econstruct Homes.

I saw that you''ve been looking into [rebuild / remodel / ADU — personalize] and I wanted to reach out personally.

I don''t do a lot of direct outreach, but when I see someone who''s clearly serious about moving forward, I prefer to just pick up the phone or jump on a call.

Do you have 20 minutes this week? I''d like to learn more about your project and give you my honest take — no pitch, no pressure.

[YES — BOOK A CALL WITH ROBYN]

Robyn Ellis
econstruct Homes
(310) 740.9999 ext. 2'),
    (CAST((SELECT id FROM seq_market_intelligence_hot_lead_n) AS uuid), 2, 1, 'Quick follow-up — did you see my note yesterday?', 'Hi [First Name],

Just wanted to make sure my note from yesterday didn''t get buried.

I have a few open slots this week for a quick call — 20 minutes, no commitment.

If it''s easier, you can text me directly at (818) 489-8891.

[BOOK A CALL — 20 MINUTES]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_market_intelligence_hot_lead_n) AS uuid), 3, 3, 'I put something together for you', 'Hi [First Name],

I took a few minutes to think through what your project might look like based on what I know about your situation.

[PERSONALIZE — insert 2-3 sentences about their specific project type, neighborhood, likely scope, and one key consideration specific to them]

This is obviously rough — a real scope requires a site visit and a detailed conversation. But I wanted to show you that I''ve actually thought about your project, not just sent a templated email.

When can we talk?

[BOOK YOUR CALL — I''LL BRING THE FULL BREAKDOWN]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_market_intelligence_hot_lead_n) AS uuid), 4, 6, 'A project like yours just closed — here''s what happened', 'Hi [First Name],

I wanted to share a recent project that''s similar to what you''re considering.

[PERSONALIZE — insert anonymized project details: neighborhood, scope, timeline, budget range, outcome. Example:]

West Side luxury remodel — Brentwood, 4,200 SF, full gut renovation including smart home integration:
- Total project value: $1.4M
- Timeline: 11 months from permit to final walkthrough
- Outcome: Client estimated $1.1M+ increase in property value

Every project is different, but this gives you a realistic picture of what to expect.

Ready to talk about yours?

[BOOK YOUR STRATEGY CALL]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2'),
    (CAST((SELECT id FROM seq_market_intelligence_hot_lead_n) AS uuid), 5, 10, 'I''m going to stop reaching out after this — but I want to leave you with one thing', 'Hi [First Name],

This is my last outreach — I don''t want to be the contractor who won''t take a hint.

But before I close the loop, I want to leave you with a genuine offer:

If you ever have questions about your project — even if you''re working with another contractor, or not ready to build at all — you can call or text me directly. I''m happy to be a resource with no strings attached.

(818) 489-8891 cell.

And if the timing ever shifts and you want to have a real conversation about your project, my calendar is always open.

[BOOK A CALL WHENEVER YOU''RE READY]

Robyn Ellis
econstruct Homes
(310) 740-9999 ext. 2')
ON CONFLICT (sequence_id, step_number) DO NOTHING;

COMMIT;
