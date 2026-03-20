/* eConstruct CRM — Leads Page (Table, Filters, Bulk Actions, Sort) */

// ============ RENDER TABLE (Leads Page) ============
function renderTable2(data) {
  const tbody = document.getElementById('leadsTableBody2');
  if (!tbody) return;
  tbody.innerHTML = '';
  data.forEach((lead) => {
    const scoreClass = lead.score >= 85 ? 'score-high' : 'score-mid';
    const stageClass = STAGE_CLASSES[lead.stage] || 'stage-enriched';
    const tr = document.createElement('tr');
    tr.onclick = (e) => { if(!e.target.closest('.td-checkbox') && !e.target.closest('.stage-tag')) openPanel(lead.id); };
    tr.innerHTML = `
      <td class="td-checkbox"><input type="checkbox" data-id="${lead.id}" onchange="updateBulkBar()"></td>
      <td class="td-address">${lead.address}</td>
      <td class="td-contact">${lead.contact}</td>
      <td class="td-link"><a href="tel:${lead.phone}">${lead.phone}</a></td>
      <td class="td-link"><a href="mailto:${lead.email}">${lead.email}</a></td>
      <td><span class="score-badge ${scoreClass}">${lead.score}</span></td>
      <td class="td-value">${lead.value}</td>
      <td><button class="stage-tag ${stageClass}" onclick="cycleStage(event, ${lead.id})" data-lead-id="${lead.id}">${lead.stage}</button></td>
      <td class="td-source">${lead.source}</td>
      <td class="td-activity">${lead.activity}</td>
      <td class="td-actions">
        <button class="action-btn" onclick="event.stopPropagation();openPanel(${lead.id})" title="View Details">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="3"/><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5S1 8 1 8z"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById('leadsTableCount2').textContent = `${data.length} leads`;
  document.getElementById('paginationInfo2').textContent = `Showing 1–${data.length} of 843 leads`;
}

// ============ LEAD FILTERS ============
function applyLeadFilters() {
  const stage = document.getElementById('filterStage').value;
  const source = document.getElementById('filterSource').value;
  const minScore = parseInt(document.getElementById('filterScore').value) || 0;
  const search = (document.getElementById('filterLeadSearch').value || '').toLowerCase();
  
  let filtered = leads.filter(l => {
    if (stage && l.stage !== stage) return false;
    if (source && l.source !== source) return false;
    if (l.score < minScore) return false;
    if (search && !l.address.toLowerCase().includes(search) && !l.contact.toLowerCase().includes(search) && !l.email.toLowerCase().includes(search)) return false;
    return true;
  });
  renderTable2(filtered);
}

// ============ BULK ACTIONS ============
function updateBulkBar() {
  const checked = document.querySelectorAll('#leadsTableBody2 input[type="checkbox"]:checked');
  const bar = document.getElementById('bulkBar');
  const count = document.getElementById('bulkCount');
  if (checked.length > 0) {
    bar.classList.add('visible');
    count.textContent = checked.length;
  } else {
    bar.classList.remove('visible');
  }
}

function toggleAllCheckboxes2(master) {
  document.querySelectorAll('#leadsTableBody2 input[type="checkbox"]').forEach(cb => { cb.checked = master.checked; });
  updateBulkBar();
}

// ============ SORT (Leads Page) ============
let sortCol2 = -1, sortDir2 = 1;
function sortTable2(col) {
  if (sortCol2 === col) { sortDir2 *= -1; } else { sortCol2 = col; sortDir2 = 1; }
  const keys = ['address','contact','phone','email','score','valueNum','stage','source','activity'];
  const key = keys[col];
  leads.sort((a,b) => {
    let va = a[key], vb = b[key];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return -1 * sortDir2;
    if (va > vb) return 1 * sortDir2;
    return 0;
  });
  applyLeadFilters();
}
