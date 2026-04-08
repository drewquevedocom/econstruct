/* eConstruct CRM — App Core (Router, DateTime, Init) */

// ============ SIDEBAR TOGGLE ============
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const dashboard = document.querySelector('.dashboard');
  const isPinned = sidebar.classList.toggle('pinned');
  dashboard.classList.toggle('sidebar-pinned', isPinned);
  localStorage.setItem('sidebarPinned', isPinned);
}
// Restore sidebar state on load
(function() {
  if (localStorage.getItem('sidebarPinned') === 'true') {
    document.querySelector('.sidebar').classList.add('pinned');
    document.querySelector('.dashboard').classList.add('sidebar-pinned');
  }
})();

// ============ PLAYBOOK DROPDOWN ============
let playbookOpen = false;
function togglePlaybook() {
  playbookOpen = !playbookOpen;
  document.getElementById('playbookDropdown').classList.toggle('open', playbookOpen);
  document.getElementById('playbookToggle').classList.toggle('active', playbookOpen);
}
// Close playbook on outside click
document.addEventListener('click', function(e) {
  if (playbookOpen && !e.target.closest('.playbook-dropdown-wrap')) {
    playbookOpen = false;
    document.getElementById('playbookDropdown').classList.remove('open');
    document.getElementById('playbookToggle').classList.remove('active');
  }
});

// ============ PAGE SWITCHING ============
function switchPage(page) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  document.getElementById('topbarTitle').textContent = PAGE_TITLES[page] || page.charAt(0).toUpperCase() + page.slice(1);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  document.getElementById('mainContent').scrollTop = 0;
  if (page === 'leads') { applyLeadFilters(); }
  if (page === 'pipeline') { renderKanban(); }
  if (page === 'dashboard') {
    renderTable(leads);
    if (window.donutChartInstance) { window.donutChartInstance.update(); }
  }
}

// ============ DATE/TIME ============
function updateDateTime() {
  const now = new Date();
  const opts = { weekday:'short', month:'short', day:'numeric', hour:'numeric', minute:'2-digit' };
  document.getElementById('topbarDateTime').textContent = now.toLocaleDateString('en-US', opts);
}
updateDateTime();
setInterval(updateDateTime, 60000);

// ============ SEARCH FILTER (Dashboard) ============
function filterLeads(query) {
  if (!query) { renderTable(leads); return; }
  const q = query.toLowerCase();
  const filtered = leads.filter(l =>
    l.address.toLowerCase().includes(q) || l.contact.toLowerCase().includes(q) ||
    l.email.toLowerCase().includes(q) || l.phone.includes(q) ||
    l.source.toLowerCase().includes(q) || l.stage.toLowerCase().includes(q) || l.type.toLowerCase().includes(q)
  );
  renderTable(filtered);
}

// ============ STAGE CYCLING ============
function cycleStage(e, leadId) {
  e.stopPropagation();
  const lead = leads.find(l => l.id === leadId);
  const prevStage = lead.stage;
  const idx = STAGES.indexOf(lead.stage);
  lead.stage = STAGES[(idx + 1) % STAGES.length];
  addTimelineEntry(lead, 'Stage changed: ' + prevStage + ' → ' + lead.stage);
  saveLeads();
  renderTable(leads.filter(l => !l.archived));
  renderTable2(leads.filter(l => !l.archived));
  renderKanban();
  if (lead.stage === 'Outreach' && prevStage !== 'Outreach') {
    if (typeof sendOutreachEmail === 'function') sendOutreachEmail(lead);
  }
}

// ============ EXPORT CSV ============
function exportCSV() {
  const headers = ['Address','Contact','Phone','Email','Score','Value','Stage','Source','Type','Last Activity'];
  const rows = leads.map(l => [l.address, l.contact, l.phone, l.email, l.score, l.value, l.stage, l.source, l.type, l.activity]);
  let csv = headers.join(',') + '\n' + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'econstruct-leads.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ============ CHECKBOX (Dashboard) ============
function toggleAllCheckboxes(master) {
  document.querySelectorAll('#leadsTableBody input[type="checkbox"]').forEach(cb => { cb.checked = master.checked; });
}

// ============ GLOBAL KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (playbookOpen) { togglePlaybook(); return; }
    if (aliceOpen) { toggleAlice(); return; }
    closeAddLeadModal();
    closePanel();
  }
});

// ============ EMAIL EDITING ============
function editEmail(btn) {
  const item = btn.closest('.email-queue-item');
  const subject = item.querySelector('.email-queue-subject');
  const origText = subject.textContent;
  subject.contentEditable = true;
  subject.focus();
  subject.style.outline = '2px solid var(--gold)';
  subject.style.borderRadius = '4px';
  subject.style.padding = '2px 6px';
  subject.style.background = '#FFFDF5';

  const actionsDiv = btn.parentElement;
  const origHTML = actionsDiv.innerHTML;
  actionsDiv.innerHTML = '<button class="btn btn-gold" style="padding:5px 10px;font-size:11px;" onclick="saveEmail(this)">Save</button><button class="btn" style="padding:5px 10px;font-size:11px;margin-left:4px;" onclick="cancelEmail(this,\'' + origText.replace(/'/g, "\\'") + '\')">Cancel</button>';
}

function saveEmail(btn) {
  const item = btn.closest('.email-queue-item');
  const subject = item.querySelector('.email-queue-subject');
  subject.contentEditable = false;
  subject.style.outline = '';
  subject.style.borderRadius = '';
  subject.style.padding = '';
  subject.style.background = '';

  const actionsDiv = btn.parentElement;
  actionsDiv.innerHTML = '<button class="btn" style="padding:5px 10px;font-size:11px;" onclick="sendQueueEmail(this)">Send</button><button class="btn" style="padding:5px 10px;font-size:11px;" onclick="editEmail(this)">Edit</button>';
}

function cancelEmail(btn, origText) {
  const item = btn.closest('.email-queue-item');
  const subject = item.querySelector('.email-queue-subject');
  subject.textContent = origText;
  subject.contentEditable = false;
  subject.style.outline = '';
  subject.style.borderRadius = '';
  subject.style.padding = '';
  subject.style.background = '';

  const actionsDiv = btn.parentElement;
  actionsDiv.innerHTML = '<button class="btn" style="padding:5px 10px;font-size:11px;" onclick="sendQueueEmail(this)">Send</button><button class="btn" style="padding:5px 10px;font-size:11px;" onclick="editEmail(this)">Edit</button>';
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderTable(leads.filter(l => !l.archived));
  initAliceConversation();
});
