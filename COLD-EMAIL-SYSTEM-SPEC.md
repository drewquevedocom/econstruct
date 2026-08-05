# econstruct Lead System — Master Spec

**Owner:** Drew Quevedo
**Last updated:** 2026-08-04
**Status:** Active — this is the single source of truth

> **Read this before changing anything.** This document exists because scope kept getting re-litigated every session, causing rework. If a decision is listed under LOCKED DECISIONS, it is not up for debate without explicitly updating this file first.

---

## LOCKED DECISIONS

These were decided with real numbers. Do not re-open without new data.

| Decision | Value | Why |
|---|---|---|
| Target outcome | **3–6 closed jobs per year** | Frank's stated goal |
| Job size | **$1M+**, only 1–2 at ~$500k | Frank, 8/4 |
| Email volume needed | **~1,000/year (~4–5/day)** | Funnel math below |
| Lead source | **LADBS permit data** (LA County, free) | Signal-triggered = 15–25% reply vs 3.43% generic |
| Permit filter | **Declared valuation ≥ $1M** | Matches job-size target |
| Audience split | **60% homeowners / 40% partners** | Homeowners = only real signal; partners = Frank's method, kept |
| Send platform | **Keep Instantly** | Handles warmup/rotation/inbox mechanics. Rebuilding = deliverability suicide |
| Mailboxes | 3, capped | Industry-safe is 50–100/mailbox/day; we need far less |
| Automation tool | **No n8n.** Current stack only | Next.js / Vercel / Supabase / GitHub Actions |

### The funnel math (why volume is low)

| Stage | Rate | Volume needed |
|---|---|---|
| Closed jobs | — | 6/year |
| Qualified conversations → close | ~15% | 40/year |
| Replies → qualified | ~20% | 200/year |
| Emails → replies (signal-triggered) | ~20% | **~1,000/year** |

**~4 emails per working day.** Not 90. Not 800. This is the number that governs all scope decisions.

---

## EXPLICITLY NOT BUILDING (and why)

Captured so these stop being re-proposed. Revisit only if reply volume justifies it.

| Feature | Status | Trigger to reconsider |
|---|---|---|
| LinkedIn outreach automation | **Deferred** — future feature | After email channel proves out |
| Agentic auto-responder to leads | **Deferred** | At ~4 emails/day, replies are ~1/week. Handle manually |
| SMS hot-lead alerts (Twilio) | **Deferred** | New vendor + cost, unapproved. Email alerts work today |
| A/B testing + variant attribution | **Cut** | At this volume you'd never reach significance — you'd be reading noise |
| Multi-provider sourcing engine (CSLB/DRE/CDI/Apollo) | **Cut** | LADBS alone supplies enough $1M+ permits |
| Bringing sending in-house (raw SMTP) | **Rejected** | Would require rebuilding warmup/rotation/bounce protection |
| Migrating to Smartlead/Apollo sequences | **Rejected** | Loses CRM/permit-data integration — our only real signal |

---

## CURRENT ARCHITECTURE

**CRM:** Custom build at `econstructhomes.com/crm` — Next.js on Vercel, Supabase backend, in the econstruct repo. Fully owned, not third-party.

**Partner track:** `weekly-apollo-refresh.yml` → `partner-refresh/route.ts` (Apollo → `partner_leads`) → `partner-enroll/route.ts` (weighted batches → 10 hardcoded Instantly campaign IDs).

**Homeowner track:** `daily-scrape` → `deed-monitor` → enrich → `score-leads` → `campaign-enroll/route.ts` (score ≥ 40, human-approved, non-fire permits).

**Reply loop:** `webhooks/instantly/route.ts` — 609-line monolith. OOO regex → Claude Haiku sentiment → status flip + task + hot-lead email + `lead_events`.

**Reporting:** `daily-report.ts` — nightly email to Frank from `reports@econstructhomes.com`.

### Known state as of 8/4

- Instantly partner campaigns configured but **starved** — Apollo exhausted for LA
- Homeowner campaign — **still in draft, never launched**. This is the track that produced the only real signal
- Email verification credits — **dead since 7/10**
- 2 of 3 sending domains — **missing DKIM/DMARC** (mandatory since Feb 2024 Google/Yahoo, May 2025 Microsoft)
- `referral_fee: 5000` hardcoded onto every sourced contact at `partner-refresh/route.ts:290` — compliance risk in the **data layer**, not just copy
- Hardcoded Supabase anon key fallback at `webhooks/instantly/route.ts:18`
- `email_sequences` / `sequence_steps` tables exist but **nothing connects them to Instantly** — sequence copy is hand-typed in Instantly's UI, 1 step, 1 variant

---

## PHASE ORDER

### PHASE 0 — Fix the daily report (DO FIRST)
**Why first:** it is actively misleading Frank right now, and it is small.

- Report real sends only — not queued-but-unsent
- Report real replies — exclude out-of-office auto-responders
- Show empty-queue state explicitly ("0 sent — no contacts in queue")
- Plain language, readable in 30 seconds, no jargon
- Flag red when: queue empty, bounce rate > 3%, or campaign paused

**Done when:** Frank reads it without asking a clarifying question.

#### PHASE 0 BUILD SPEC — `daily-report.ts`

**File:** `daily-report.ts` · **Sends from:** `reports@econstructhomes.com` · **Recipients:** Frank, Katie, Drew

**The bug that caused this:** the report counted contacts *added to the enrollment queue* as "emails sent." Frank was told hundreds/day when the true number was ~12/day. Every number below must come from actual Instantly send/reply events, never from queue or enrollment tables.

##### Data contract — every field, and where it comes from

| Field | Source of truth | Never use |
|---|---|---|
| `emails_sent_today` | Instantly API — actual send events | `partner_leads` status changes, enrollment counts |
| `emails_sent_7d` | Instantly API, rolling 7 days | — |
| `replies_today` | Instantly reply webhook, **after** OOO filter | Raw webhook count |
| `replies_7d` | Same, rolling 7 days | — |
| `ooo_filtered_today` | Count of auto-responders excluded | — |
| `bounces_today` | Instantly bounce events | — |
| `bounce_rate_7d` | bounces ÷ sends, rolling 7d | Lifetime average |
| `queue_depth` | Count of leads eligible to enroll **right now** | Total leads in table |
| `verification_credits` | Verifier API balance | Cached/assumed value |
| `campaign_status` | Instantly campaign state per campaign | Assumed "active" |
| `new_leads_sourced_7d` | Rows inserted into lead tables, last 7d | — |

**Rule: if a value cannot be read from its source of truth, print `unavailable` — never 0.** A zero that means "broken" is what caused this whole problem.

##### Health checks — evaluate before rendering

| # | Condition | Severity | Message to Frank |
|---|---|---|---|
| 1 | `queue_depth == 0` | RED | "No one left to email. Need new contacts." |
| 2 | `emails_sent_today == 0` AND `queue_depth > 0` | RED | "Nothing went out today — something is broken." |
| 3 | `bounce_rate_7d > 3%` | RED | "Too many bad addresses. Sending paused." |
| 4 | `spam_complaint_rate > 0.1%` | RED | "Spam complaints too high. Sending paused." |
| 5 | `verification_credits < 100` | YELLOW | "Address checker running low." |
| 6 | Any campaign paused/draft unexpectedly | YELLOW | "A campaign is turned off." |
| 7 | Any domain failing SPF/DKIM/DMARC | RED | "One of our email addresses isn't set up right." |
| 8 | All clear | GREEN | "Everything running normally." |

RED conditions 3 and 4 must **auto-pause sending**, not just warn.

##### Output format — plain language, 30-second read

```
econstruct Daily Report — [date]

STATUS: [GREEN / YELLOW / RED] — [one sentence]

YESTERDAY
Emails sent: X
Real replies: X        (X auto-replies filtered out)
Bounced: X

LAST 7 DAYS
Emails sent: X
Real replies: X
Bounce rate: X%        (healthy is under 3%)

PIPELINE
People left to email: X
New contacts added this week: X

[NEEDS ATTENTION — only appears when not GREEN]
- [plain-language issue + what's being done]
```

**Formatting rules:**
- No jargon. Banned: crawl, index, API, webhook, sequence, enrollment, deliverability, DMARC, DKIM, SPF, bounce *rate* without explanation
- "Real replies" always excludes out-of-office
- Always show the healthy benchmark next to any rate
- Green state = short. Do not manufacture content when nothing is wrong
- Section headers dark (`#1a1a1a`), never light grey — light text has failed to render before

##### Acceptance tests

1. Empty queue → RED, condition 1, and the report says so plainly
2. Queue full but zero sends → RED, condition 2
3. 6 replies of which 5 are OOO → shows "1 real reply (5 auto-replies filtered out)"
4. Instantly API unreachable → prints `unavailable`, not 0
5. Bounce at 3.5% → RED **and** sending auto-paused
6. All healthy → GREEN, under 15 lines
7. Read it aloud to someone non-technical — they can state what happened and what's needed

##### KNOWN GAP — spam complaint rate (health check #4)

**Status: not implemented. Deliberately, not by oversight.**

Verified against Instantly's live API docs: **there is no spam complaint field anywhere** — not on campaigns, not on accounts, not on warmup analytics. That data only exists in Gmail's and Yahoo's postmaster tools, which Instantly does not expose.

Per this spec's own rule (*"if a value cannot be read from its source of truth, print unavailable — never 0"*), check #4 was omitted rather than faked as always-passing. There is a code comment in `daily-report.ts` explaining this.

**Consequence: we currently have zero visibility into spam complaints.** That is a real blind spot — spam complaints above 0.3% will get domains blocked, and we would not know until sends stopped landing.

**Fix (Phase 1, not Phase 0):** wire up **Google Postmaster Tools API** — free, gives real complaint rate per domain. Separate integration, not something Instantly can supply. Add health check #4 once that data source exists.

##### Explicitly out of scope for Phase 0

Revenue attribution, per-variant stats, open rates (unreliable — tracking was off on half of sends), forecasting. Phase 0 is: **true numbers, plainly stated, with alarms that fire.**

### PHASE 1 — Deliverability floor
- DMARC/DKIM on both unauthenticated domains (10 min DNS)
- Buy $30 verification credits; make verification **fail-closed**, never fail-open
- Bounce-rate circuit breaker: auto-pause at 3%
- Per-mailbox daily budget enforced **in code**, not policy
- Unified suppression list across both tracks
- Strip `referral_fee: 5000` from the data layer

**Done when:** bounce < 3%, all 3 domains authenticated, sends stop automatically on breach.

### PHASE 2 — Sequence engine
- `sequence-sync` route: push `email_sequences` / `sequence_steps` from Supabase → Instantly
- **4–7 emails per sequence** (industry sweet spot; 3 is too few)
- Repo/DB becomes source of truth for copy — versioned, follow-ups guaranteed
- Rewrite opener: shorter, about them, permit-specific

**Note:** first email drives 58% of replies; follow-ups drive 42%. Opener copy matters more than sequence machinery.

**Done when:** every enrolled lead receives a multi-step sequence with no manual Instantly editing.

### PHASE 3 — LADBS sourcing
- Weekly pull of new LA County permits
- Filter: declared valuation ≥ $1M
- Push qualified permits into homeowner track
- **Freshness is critical** — signal decays in days. A 60-day-old permit is a cold list again

**Done when:** queue self-refills weekly with $1M+ permits, no manual work.

---

## GUARDRAILS / HEALTH CHECKS

The system must tell us when it is broken, not fail silently.

| Check | Threshold | Action |
|---|---|---|
| Queue depth | 0 contacts | Red flag on daily report |
| Bounce rate | > 3% | Auto-pause sending |
| Spam complaints | > 0.1% | Auto-pause, alert immediately |
| Verification credits | < 100 remaining | Alert before running dry |
| Domain auth (SPF/DKIM/DMARC) | Any failing | Alert |
| Campaign status | Paused/draft unexpectedly | Red flag on daily report |
| Sends today | 0 when queue is non-empty | Red flag — something is broken |

**Rule: fail closed, never fail open.** The 7/10 verification outage went unnoticed for three weeks because it failed open.

---

## 2026 BENCHMARKS (for judging results)

| Metric | Target | Elite |
|---|---|---|
| Reply rate | 4–6% | 10%+ / 15–25% signal-triggered |
| Bounce rate | < 3% | < 1.5% |
| Spam complaints | < 0.1% | — |
| Sequence length | 4–7 emails | — |
| Volume per mailbox | 50–100/day safe | — |

Industry average reply rate is 3.43%. Signal-triggered outreach hits 15–25% — a 5x difference for the same effort. That gap is the entire strategy.

---

## OPEN ITEMS NEEDING FRANK

1. **$30** — verification credits (blocking, dead since 7/10)
2. **$45/month** — call tracking number for postcard attribution (optional)
3. Confirm: drop the $5,000 referral offer from cold opens
