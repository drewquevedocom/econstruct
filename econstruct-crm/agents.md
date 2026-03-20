# eConstruct CEO Dashboard — CRM

## Overview
Full-featured CRM dashboard for eConstruct Inc, a luxury home construction company in Los Angeles. This is the internal CEO dashboard for Frank Neimroozi.

## Tech Stack
- Vanilla HTML/CSS/JS (no framework)
- Chart.js for data visualization
- Playfair Display (headings) + Plus Jakarta Sans (body) typography
- CSS Custom Properties for theming

## Brand Colors
- White: #FFFFFF
- Off-White: #F8F6F2
- Charcoal: #1C1C1E
- Brass Gold: #B8963E

## Pages (7)
1. **Dashboard** — KPIs, donut chart, pipeline funnel, leads table, agent status, fire zone
2. **Leads** — Full CRM table with filters, search, sort, bulk actions, detail panel
3. **Pipeline** — Kanban board with 8 columns
4. **Outreach** — Campaign cards, email queue, performance metrics
5. **Fire Intel** — Zone cards (Palisades/Altadena/Malibu), news feed
6. **Agents** — System health, 7 AI agent cards with metrics
7. **Settings** — Account, API connections, notifications, team, branding

## Key Features
- AI Alice chatbot (drops from top bar)
- Slide-out detail panel for lead records
- All data is currently demo/mock — backend API integration pending
- Sidebar collapses to icons, expands on hover

## File Structure
```
econstruct-crm/
├── index.html              # Main HTML (layout + all page content)
├── agents.md               # This file — AntiGravity agent instructions
├── assets/
│   └── logo.jpg            # eConstruct logo
├── css/
│   ├── variables.css       # CSS custom properties (:root vars)
│   ├── reset.css           # Reset & base styles
│   ├── layout.css          # Dashboard grid, sidebar, topbar, main, footer, responsive
│   ├── components.css      # Shared: KPIs, charts, tables, bottom row
│   ├── animations.css      # All @keyframes
│   ├── alice.css           # AI Alice chat panel
│   ├── panel.css           # Slide-out detail panel
│   └── pages/
│       ├── dashboard.css   # Dashboard-specific (KPI extras)
│       ├── leads.css       # Leads page filters, bulk actions
│       ├── pipeline.css    # Kanban board
│       ├── outreach.css    # Campaign cards, email queue
│       ├── fire-intel.css  # Zone cards, news feed
│       ├── agents.css      # Agent cards, system health
│       └── settings.css    # Settings sections, toggles
└── js/
    ├── data.js             # Mock data & constants (STAGES, leads array)
    ├── app.js              # Router, datetime, search, CSV export, init
    ├── dashboard.js        # Dashboard table render & sort
    ├── leads.js            # Leads page table, filters, bulk actions, sort
    ├── pipeline.js         # Kanban board render
    ├── panel.js            # Slide-out panel, editable fields, notes, timeline
    ├── alice.js            # AI Alice chatbot logic
    └── charts.js           # Chart.js donut initialization
```

## CSS Load Order (important)
1. variables.css (defines all custom properties)
2. reset.css (normalize + base)
3. layout.css (grid structure)
4. components.css (shared components)
5. animations.css (keyframes)
6. alice.css, panel.css (features)
7. pages/*.css (page-specific)

## JS Load Order (important)
1. data.js (constants + mock data — no DOM dependency)
2. dashboard.js, leads.js, pipeline.js (page renderers)
3. panel.js (detail panel)
4. alice.js (chatbot)
5. charts.js (Chart.js init, uses DOMContentLoaded)
6. app.js (router + init, uses DOMContentLoaded)

## Backend (Not Yet Connected)
- API: Next.js 14 + TypeScript on Vercel
- Database: Supabase (PostgreSQL)
- GitHub: drewquevedocom/econstruct-backend
- 11 database tables, 7 automated agent cron jobs
- Authentication via Supabase Auth

## Design Principles
- Light mode only — elegant, restrained, photography-forward
- Gold accent (#B8963E) used sparingly for CTAs and active states
- Playfair Display for section headings, Plus Jakarta Sans for everything else
- High data density with generous whitespace between sections
- All data uses tabular-nums for alignment
