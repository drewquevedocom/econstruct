/* eConstruct CRM — Dashboard Page (Table Render, Sort) */

// ============ RENDER TABLE (Dashboard) ============
function renderTable(data) {
  const tbody = document.getElementById('leadsTableBody');
  tbody.innerHTML = '';
  data.filter(l => !l.archived).forEach((lead) => {
    const scoreClass = lead.score >= 85 ? 'score-high' : 'score-mid';
    const stageClass = STAGE_CLASSES[lead.stage] || 'stage-enriched';
    const tr = document.createElement('tr');
    tr.onclick = (e) => { if(!e.target.closest('.td-checkbox') && !e.target.closest('.stage-tag')) openPanel(lead.id); };
    tr.innerHTML = `
      <td class="td-checkbox"><input type="checkbox" data-id="${lead.id}"></td>
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
  document.getElementById('tableCount').textContent = `${data.length} leads`;
  document.getElementById('paginationInfo').textContent = `Showing 1–${data.length} of 843 leads`;
}

// ============ SORT TABLE (Dashboard) ============
let sortCol = -1, sortDir = 1;
function sortTable(col) {
  if (sortCol === col) { sortDir *= -1; } else { sortCol = col; sortDir = 1; }
  document.querySelectorAll('#page-dashboard thead th').forEach((th,i) => { th.classList.toggle('sorted', i-1 === col); });
  const keys = ['address','contact','phone','email','score','valueNum','stage','source','activity'];
  const key = keys[col];
  leads.sort((a,b) => {
    let va = a[key], vb = b[key];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return -1 * sortDir;
    if (va > vb) return 1 * sortDir;
    return 0;
  });
  renderTable(leads);
}
