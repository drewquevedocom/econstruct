-- CRM events feed: networking + fire-rebuild community events the GC should attend.
-- Goal: show up, hand out cards, meet architects/realtors/displaced homeowners.
-- Paste into Supabase SQL Editor once.

CREATE TABLE IF NOT EXISTS crm_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_date date,
  location text,
  host_org text,
  event_url text,
  audience text NOT NULL DEFAULT 'mixed-industry',
  notes text,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT crm_events_audience_check CHECK (
    audience IN (
      'fire-victims',
      'architects',
      'realtors',
      'permit-runners',
      'insurance',
      'mixed-industry'
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_crm_events_date
  ON crm_events (event_date, is_archived);

-- Seed: 7 real LA-area events researched 2026-06-04 (verify dates/URLs before attending).
INSERT INTO crm_events (title, event_date, location, host_org, event_url, audience, notes)
VALUES
  (
    'PPCC Board Meeting — Long-Term Recovery Plan Vote',
    '2026-06-11',
    'Pacific Palisades (Via Zoom)',
    'Pacific Palisades Community Council',
    'https://pacpalicc.org/index.php/calendar/',
    'fire-victims',
    'Board votes on Long-Term Recovery Plan. Displaced homeowners + rebuild-focused locals attend — prime venue to position as rebuild partner.'
  ),
  (
    'AIA|LA Design For Dignity 2026 — From Crisis to Construction',
    '2026-06-05',
    'Center for Communities, 4450 West Adams, Los Angeles',
    'AIA Los Angeles',
    'https://www.aialosangeles.org/aiala-calendar/',
    'architects',
    'Flagship AIA|LA conference on housing/rebuild. Architects, planners, permit officials all in one room.'
  ),
  (
    'AIA|LA Quarterly Roundtable with LADBS GM Osama Younan',
    '2026-06-15',
    'Virtual on Zoom',
    'AIA Los Angeles',
    'https://www.aialosangeles.org/aiala-calendar/',
    'permit-runners',
    'Direct access to LADBS leadership — permit expediters + architects attend. Ground truth on rebuild plan-check timelines.'
  ),
  (
    'AIA|LA City Leaders Breakfast — Greg Ames (Trammell Crow)',
    '2026-06-19',
    'HKS, 8665 Hayden Pl, Culver City',
    'AIA Los Angeles',
    'https://www.aialosangeles.org/aiala-calendar/',
    'mixed-industry',
    'In-person breakfast networking with developers + architects. Easy face-to-face to hand out cards to design firms feeding rebuild work.'
  ),
  (
    'PPCC Board Meeting — LADWP Water Infrastructure',
    '2026-06-25',
    'Pacific Palisades (Via Zoom)',
    'Pacific Palisades Community Council',
    'https://pacpalicc.org/index.php/calendar/',
    'fire-victims',
    'Utility-timing meeting draws homeowners worried about when they can rebuild. Direct line to fire-victim decision makers.'
  ),
  (
    'Altadena Town Council Monthly Meeting',
    '2026-07-21',
    'Altadena Community Center, 730 E. Altadena Dr, Altadena',
    'Altadena Town Council',
    'https://altadenatowncouncil.org/calendar-2/',
    'fire-victims',
    'Eaton Fire rebuild dominates the agenda monthly. Room of Altadena homeowners actively choosing GCs.'
  ),
  (
    'PaliBu Recovery Expo (Quarterly) — Q3 2026',
    NULL,
    'Pacific Palisades / Malibu (TBD — past expos at Civic Center Way, Malibu)',
    'Malibu-Pacific Palisades Chamber & Pali LTRG',
    'https://paliltrg.org/events/',
    'fire-victims',
    'Recurring quarterly expo connecting Palisades Fire victims with contractors, insurance, permit help. Check host for next date.'
  )
ON CONFLICT DO NOTHING;
