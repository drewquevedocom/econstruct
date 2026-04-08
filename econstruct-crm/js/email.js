/* eConstruct CRM — Email via Instantly.ai
 *
 * Leads are added to Instantly campaigns via the Next.js API proxy at
 * http://localhost:3000/api/crm/send (keeps the API key server-side).
 *
 * CAMPAIGN IDs — paste yours below once created in Instantly:
 *   app.instantly.ai → open campaign → copy ID from URL
 */

const INSTANTLY_CFG = {
  apiProxy: 'https://econstruct-three.vercel.app/api/crm/send',

  campaigns: {
    // Keyed by lead.type — maps to Instantly campaign UUID
    'Fire Rebuild':    '2109b970-7baf-4770-b57b-cac95df91316', // Palisades Fire Rebuild
    'New Construction':'2109b970-7baf-4770-b57b-cac95df91316', // Palisades Fire Rebuild
    'Major Remodel':   'e053a38e-fde2-47d7-9841-ed62e568a068', // Brentwood Luxury
    'ADU + Remodel':   'e053a38e-fde2-47d7-9841-ed62e568a068', // Brentwood Luxury
    'Hillside Build':  'ec77c781-3448-48d5-a919-9de65227f8f2', // Malibu Coastal
    'default':         '2109b970-7baf-4770-b57b-cac95df91316', // Palisades Fire Rebuild
  },

  // Override recipient — all adds go to this email during testing.
  // Clear when going live.
  testEmail: '',
};

// ── Pick the right campaign for a lead ───────────────────────────────────────
function _campaignFor(lead) {
  return INSTANTLY_CFG.campaigns[lead.type] || INSTANTLY_CFG.campaigns['default'];
}

function _isConfigured() {
  const ids = Object.values(INSTANTLY_CFG.campaigns);
  return ids.every(id => id && !id.startsWith('PASTE_') && !id.startsWith('http'));
}

// ── Toast notification ────────────────────────────────────────────────────────
function _showToast(msg, type) {
  let toast = document.getElementById('emailToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'emailToast';
    toast.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:999',
      'padding:12px 18px', 'border-radius:8px', 'font-size:13px',
      'font-family:inherit', 'font-weight:600', 'max-width:360px',
      'box-shadow:0 4px 20px rgba(0,0,0,0.15)', 'transition:opacity .3s',
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = type === 'warn' ? '#FFF3CD'
    : type === 'success' ? '#D4EDDA'
      : type === 'error' ? '#F8D7DA'
        : '#F8F9FA';
  toast.style.color = type === 'warn' ? '#856404'
    : type === 'success' ? '#155724'
      : type === 'error' ? '#721C24'
        : '#212529';
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 5000);
}

// ── Core: add a lead to an Instantly campaign ─────────────────────────────────
function _addToInstantly(lead, campaignId, label) {
  const nameParts = (lead.contact && lead.contact !== '—')
    ? lead.contact.trim().split(/\s+/) : ['', ''];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const toEmail = INSTANTLY_CFG.testEmail || lead.email;

  fetch(INSTANTLY_CFG.apiProxy, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: toEmail,
      firstName,
      lastName,
      campaignId,
      customVariables: {
        property: lead.address || '',
        type: lead.type || '',
        source: lead.source || '',
        value: lead.value || '',
        score: String(lead.score || ''),
        phone: lead.phone !== '—' ? lead.phone : '',
      },
    }),
  })
    .then(r => {
      if (!r.ok && r.status === 0) throw new Error('Cannot reach Next.js server — make sure it is running on port 3000');
      return r.json();
    })
    .then(data => {
      if (data.error) throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
      _showToast(label + ' added to campaign — outreach sequence starting', 'success');
      console.log('Instantly: lead added', data);
      // Record in timeline
      if (typeof addTimelineEntry === 'function') {
        addTimelineEntry(lead, 'Added to Instantly campaign — outreach sequence started');
        saveLeads();
      }
    })
    .catch(err => {
      console.error('Instantly error:', err);
      const msg = err.message.includes('fetch') || err.message.includes('Failed')
        ? 'Cannot reach API server — is Next.js running on port 3000?'
        : 'Campaign add failed: ' + err.message;
      _showToast(msg, 'error');
    });
}

// ── Triggered when a lead is manually added (Enriched stage) ─────────────────
function sendLeadIntroEmail(lead) {
  if (!lead.email || lead.email === '—') {
    _showToast('Lead saved ✓ — no email provided, skipping outreach', 'warn');
    return;
  }

  if (!_isConfigured()) {
    _showToast('Lead saved ✓  —  Paste campaign IDs into js/email.js to activate outreach', 'warn');
    return;
  }

  const campaignId = _campaignFor(lead);
  _addToInstantly(lead, campaignId, lead.contact);
}

// ── Triggered when a lead is moved to Outreach stage ─────────────────────────
function sendOutreachEmail(lead) {
  if (!lead.email || lead.email === '—') {
    _showToast('No email on file for ' + lead.contact + ' — outreach skipped', 'warn');
    return;
  }

  if (!_isConfigured()) {
    _showToast('Paste campaign IDs into js/email.js to activate outreach', 'warn');
    return;
  }

  const campaignId = _campaignFor(lead);
  _addToInstantly(lead, campaignId, lead.contact);
}

// ── Triggered by Send button in email queue ───────────────────────────────────
function sendQueueEmail(btn) {
  if (!_isConfigured()) {
    _showToast('Paste campaign IDs into js/email.js to activate outreach', 'warn');
    return;
  }

  const item = btn.closest('.email-queue-item');
  const recipLine = item.querySelector('.email-queue-recipient').textContent.trim();
  const parts = recipLine.split('·');
  const contact = parts[0].trim();
  const email = parts[1] ? parts[1].trim() : '';

  if (!email) { _showToast('No recipient email found', 'warn'); return; }

  // Find matching lead to get the right campaign
  const lead = leads.find(l => l.email === email) || {
    email, contact, type: 'default', address: '—', phone: '—',
    source: '—', value: '—', score: 0,
  };

  btn.textContent = 'Adding…';
  btn.disabled = true;

  const campaignId = _campaignFor(lead);

  fetch(INSTANTLY_CFG.apiProxy, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: INSTANTLY_CFG.testEmail || email,
      firstName: contact.split(' ')[0] || '',
      lastName: contact.split(' ').slice(1).join(' ') || '',
      campaignId,
      customVariables: {
        property: lead.address || '',
        type: lead.type || '',
        source: lead.source || '',
      },
    }),
  })
    .then(r => r.json())
    .then(data => {
      if (data.error) throw new Error(JSON.stringify(data.error));
      btn.textContent = 'Sent ✓';
      btn.style.color = '#2E7D32';
      btn.style.borderColor = '#2E7D32';
      btn.disabled = false;
      _showToast(contact + ' added to campaign', 'success');
    })
    .catch(err => {
      console.error('Queue send error:', err);
      btn.textContent = 'Failed — retry';
      btn.disabled = false;
      _showToast('Failed: ' + err.message, 'error');
    });
}
