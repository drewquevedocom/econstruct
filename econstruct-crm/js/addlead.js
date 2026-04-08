/* eConstruct CRM — Add Lead Modal */

function openAddLeadModal() {
  ['newAddress','newContact','newPhone','newEmail','newValue','newScore']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('newStage').value  = 'Enriched';
  document.getElementById('newSource').value = 'LADBS';
  document.getElementById('newType').value   = 'New Construction';
  document.getElementById('addLeadError').style.display = 'none';
  document.getElementById('addLeadOverlay').classList.add('active');
  document.getElementById('addLeadModal').classList.add('active');
  document.getElementById('newAddress').focus();
}

function closeAddLeadModal() {
  document.getElementById('addLeadOverlay').classList.remove('active');
  document.getElementById('addLeadModal').classList.remove('active');
}

function submitAddLead() {
  const address = document.getElementById('newAddress').value.trim();
  const errEl   = document.getElementById('addLeadError');

  if (!address) {
    errEl.textContent = 'Property address is required.';
    errEl.style.display = 'block';
    document.getElementById('newAddress').focus();
    return;
  }

  const contact  = document.getElementById('newContact').value.trim();
  const phone    = document.getElementById('newPhone').value.trim();
  const email    = document.getElementById('newEmail').value.trim();
  const valueRaw = document.getElementById('newValue').value.trim();
  const stage    = document.getElementById('newStage').value;
  const source   = document.getElementById('newSource').value;
  const type     = document.getElementById('newType').value;
  const scoreRaw = parseInt(document.getElementById('newScore').value) || 70;

  // Parse value: accepts "$2.5M", "$500K", "2500000", etc.
  let valueNum = 0;
  const valClean = valueRaw.replace(/[$,\s]/g, '').toUpperCase();
  if (valClean.endsWith('M'))      valueNum = parseFloat(valClean) * 1_000_000;
  else if (valClean.endsWith('K')) valueNum = parseFloat(valClean) * 1_000;
  else                             valueNum = parseFloat(valClean) || 0;
  const valueDisplay = valueNum >= 1_000_000
    ? '$' + (valueNum / 1_000_000).toFixed(1) + 'M'
    : (valueRaw || '—');

  const now = new Date();
  const timeStr = now.toLocaleDateString('en-US', { month:'short', day:'numeric' })
    + ', ' + now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });

  const newLead = {
    id:       nextLeadId(),
    address,
    contact:  contact  || '—',
    phone:    phone    || '—',
    email:    email    || '—',
    score:    Math.min(100, Math.max(0, scoreRaw)),
    value:    valueDisplay,
    valueNum,
    stage,
    source,
    type,
    activity: 'Just now',
    notes:    [],
    timeline: [{ event: 'Lead added manually', time: timeStr, filled: true }]
  };

  leads.unshift(newLead);
  saveLeads();

  if (typeof renderTable  === 'function') renderTable(leads);
  if (typeof renderTable2 === 'function') renderTable2(leads);
  if (typeof renderKanban === 'function') renderKanban();

  // Show immediate confirmation
  if (typeof _showToast === 'function') {
    _showToast('Lead saved ✓ — adding to Instantly campaign...', 'success');
  }

  // Fire intro email to the lead if they have an email address
  if (typeof sendLeadIntroEmail === 'function') sendLeadIntroEmail(newLead);

  closeAddLeadModal();
}
