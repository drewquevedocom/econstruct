/* eConstruct CRM — Data & Constants */

const STAGES = ['Enriched','Outreach','Contacted','Replied','Meeting','Proposal','Won','Lost'];
const STAGE_CLASSES = {
  'Enriched':'stage-enriched','Outreach':'stage-outreach','Contacted':'stage-contacted',
  'Replied':'stage-replied','Meeting':'stage-meeting','Proposal':'stage-proposal',
  'Won':'stage-won','Lost':'stage-lost'
};

const PAGE_TITLES = {
  dashboard: 'Lead Gen Dashboard',
  leads: 'Leads',
  pipeline: 'Pipeline',
  outreach: 'Outreach',
  fire: 'Fire Intel',
  agents: 'Agents',
  settings: 'Settings'
};

// ============ STORAGE ============
const STORAGE_KEY = 'econstruct_leads';

function saveLeads() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); }
  catch(e) { console.warn('eConstruct: localStorage save failed', e); }
}

function loadLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        leads.length = 0;
        parsed.forEach(l => leads.push(l));
        return true;
      }
    }
  } catch(e) { console.warn('eConstruct: localStorage load failed', e); }
  return false;
}

function nextLeadId() {
  if (leads.length === 0) return 1;
  return Math.max(...leads.map(l => l.id)) + 1;
}

// ============ TIMELINE HELPER ============
function addTimelineEntry(lead, event) {
  if (!lead.timeline) lead.timeline = [];
  const now = new Date();
  const timeStr = now.toLocaleDateString('en-US', { month:'short', day:'numeric' })
    + ', ' + now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
  lead.timeline.push({ event, time: timeStr, filled: true });
  lead.activity = 'Just now';
}

let leads = [
  { id:1, address:'1247 Palisades Beach Rd, 90272', contact:'Michael Chen', phone:'310-555-0142', email:'mchen@gmail.com', score:96, value:'$4.2M', valueNum:4200000, stage:'Proposal', source:'LADBS', type:'New Construction', activity:'2h ago',
    notes: [
      { text:'Initial contact via email — very responsive. Has architect (Marmol Radziner) already retained.', time:'Mar 13, 2:15 PM', author:'System' },
      { text:'Frank called — scheduling site visit for next week.', time:'Mar 13, 4:30 PM', author:'Frank N.' }
    ],
    timeline: [
      { event:'Lead discovered via LADBS permit scan', time:'Mar 8, 9:00 AM', filled:true },
      { event:'Enriched via Apollo — contact verified', time:'Mar 8, 9:12 AM', filled:true },
      { event:'Added to Palisades Fire Rebuild campaign', time:'Mar 9, 10:00 AM', filled:true },
      { event:'Email sent — personalized intro', time:'Mar 10, 8:30 AM', filled:true },
      { event:'Email opened (3×)', time:'Mar 10, 11:45 AM', filled:true },
      { event:'Reply received — interested', time:'Mar 11, 2:20 PM', filled:true },
      { event:'Meeting scheduled — Mar 18', time:'Mar 13, 4:30 PM', filled:false }
    ]
  },
  { id:2, address:'815 Alma Real Dr, 90272', contact:'Jennifer Walsh', phone:'310-555-0198', email:'jwalsh@outlook.com', score:93, value:'$3.8M', valueNum:3800000, stage:'Meeting', source:'Deed Transfer', type:'Major Remodel', activity:'Yesterday',
    notes: [{ text:'Transferred from trust — likely estate planning rebuild. High intent signals.', time:'Mar 12, 11:00 AM', author:'System' }],
    timeline: [
      { event:'Deed transfer flagged by monitor', time:'Mar 6, 8:00 AM', filled:true },
      { event:'Enriched — owner identified', time:'Mar 6, 8:15 AM', filled:true },
      { event:'Queued for outreach', time:'Mar 7, 9:00 AM', filled:true },
      { event:'Email sent', time:'Mar 8, 10:00 AM', filled:true },
      { event:'Phone call — positive', time:'Mar 11, 3:00 PM', filled:true },
      { event:'Meeting booked — Mar 16', time:'Mar 13, 10:00 AM', filled:false }
    ]
  },
  { id:3, address:'550 N Bundy Dr, 90049', contact:'Robert Tanaka', phone:'424-555-0167', email:'rtanaka@icloud.com', score:91, value:'$2.9M', valueNum:2900000, stage:'Meeting', source:'Architect Referral', type:'ADU + Remodel', activity:'Yesterday',
    notes: [{ text:'Referred by Kovac Design — plans for main house remodel plus ADU.', time:'Mar 11, 2:00 PM', author:'System' }],
    timeline: [
      { event:'Architect referral received', time:'Mar 9, 11:00 AM', filled:true },
      { event:'Enriched via Apollo', time:'Mar 9, 11:05 AM', filled:true },
      { event:'Email sent with portfolio', time:'Mar 10, 9:00 AM', filled:true },
      { event:'Reply — wants to meet', time:'Mar 12, 1:30 PM', filled:true },
      { event:'Meeting scheduled — Mar 17', time:'Mar 13, 9:00 AM', filled:false }
    ]
  },
  { id:4, address:'1430 Capri Dr, 90272', contact:'Sarah Goldstein', phone:'310-555-0234', email:'sgoldstein@gmail.com', score:88, value:'$5.1M', valueNum:5100000, stage:'Replied', source:'LADBS', type:'Fire Rebuild', activity:'Mar 12',
    notes: [{ text:'Fire rebuild — lot cleared. Very motivated to begin asap.', time:'Mar 12, 10:00 AM', author:'System' }],
    timeline: [
      { event:'LADBS permit detected', time:'Mar 7, 8:30 AM', filled:true },
      { event:'Enriched — fire rebuild confirmed', time:'Mar 7, 8:45 AM', filled:true },
      { event:'Email sent', time:'Mar 9, 10:00 AM', filled:true },
      { event:'Reply — requesting proposal', time:'Mar 12, 9:15 AM', filled:true }
    ]
  },
  { id:5, address:'12401 Promontory Rd, 90049', contact:'David Park', phone:'424-555-0289', email:'dpark@yahoo.com', score:85, value:'$3.4M', valueNum:3400000, stage:'Replied', source:'Pre-Permit', type:'New Construction', activity:'Mar 11',
    notes: [{ text:'Pre-permit signal — geotech survey completed. Planning new build.', time:'Mar 10, 3:00 PM', author:'System' }],
    timeline: [
      { event:'Pre-permit signal detected', time:'Mar 6, 10:00 AM', filled:true },
      { event:'Enriched via Apollo', time:'Mar 6, 10:10 AM', filled:true },
      { event:'Added to outreach queue', time:'Mar 7, 9:00 AM', filled:true },
      { event:'Email sent', time:'Mar 9, 11:00 AM', filled:true },
      { event:'Reply received', time:'Mar 11, 4:00 PM', filled:true }
    ]
  },
  { id:6, address:'765 Bienveneda Ave, 90272', contact:'Lisa Montgomery', phone:'310-555-0356', email:'lmontgomery@gmail.com', score:82, value:'$2.6M', valueNum:2600000, stage:'Contacted', source:'Geotech', type:'Hillside Build', activity:'Mar 10',
    notes: [{ text:'Geotech report filed — hillside lot, complex foundation requirements.', time:'Mar 9, 11:00 AM', author:'System' }],
    timeline: [
      { event:'Geotech report flagged', time:'Mar 5, 9:00 AM', filled:true },
      { event:'Enriched — contact found', time:'Mar 5, 9:20 AM', filled:true },
      { event:'Email sent', time:'Mar 8, 10:00 AM', filled:true },
      { event:'Follow-up call', time:'Mar 10, 2:00 PM', filled:true }
    ]
  },
  { id:7, address:'301 N Saltair Ave, 90049', contact:"James O'Brien", phone:'424-555-0412', email:'jobrien@outlook.com', score:79, value:'$1.8M', valueNum:1800000, stage:'Outreach', source:'RE Agent', type:'Major Remodel', activity:'Mar 9',
    notes: [{ text:'RE agent tip — recently purchased, planning major renovation.', time:'Mar 8, 4:00 PM', author:'System' }],
    timeline: [
      { event:'RE agent referral logged', time:'Mar 7, 3:00 PM', filled:true },
      { event:'Enriched via Apollo', time:'Mar 7, 3:10 PM', filled:true },
      { event:'Queued for outreach', time:'Mar 9, 9:00 AM', filled:false }
    ]
  },
  { id:8, address:'1600 Sunset Blvd, 90272', contact:'Amanda Reeves', phone:'310-555-0478', email:'areeves@gmail.com', score:76, value:'$6.7M', valueNum:6700000, stage:'Enriched', source:'PA Referral', type:'Fire Rebuild', activity:'Mar 8',
    notes: [{ text:'PA referral — high-value lot in fire zone. Owner actively seeking GC.', time:'Mar 8, 9:00 AM', author:'System' }],
    timeline: [
      { event:'PA referral received', time:'Mar 7, 11:00 AM', filled:true },
      { event:'Enriched — ownership confirmed', time:'Mar 8, 8:30 AM', filled:true }
    ]
  }
];

// Restore persisted data or seed localStorage on first visit
if (!loadLeads()) { saveLeads(); }
