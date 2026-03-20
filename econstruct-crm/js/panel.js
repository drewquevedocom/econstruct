/* eConstruct CRM — Slide-Out Detail Panel */

function openPanel(leadId) {
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;
  
  document.getElementById('panelAddress').textContent = lead.address;
  const body = document.getElementById('panelBody');
  
  const stageClass = STAGE_CLASSES[lead.stage] || 'stage-enriched';
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (lead.score / 100) * circumference;
  
  const stagePills = STAGES.map(s => 
    `<button class="stage-pill ${s === lead.stage ? 'active-pill' : ''}" onclick="changePanelStage(${lead.id}, '${s}')">${s}</button>`
  ).join('');

  const notesHtml = (lead.notes || []).map(n => `
    <div class="note-item">
      ${n.text}
      <div class="note-meta">${n.time} · ${n.author}</div>
    </div>
  `).join('');

  const timelineHtml = (lead.timeline || []).map(t => `
    <div class="timeline-item">
      <div class="timeline-dot ${t.filled ? 'filled' : ''}"></div>
      <div class="timeline-event">${t.event}</div>
      <div class="timeline-time">${t.time}</div>
    </div>
  `).join('');
  
  body.innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">Contact</div>
      <div class="contact-card">
        <div class="contact-name">${lead.contact}</div>
        <div class="contact-row">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 3.5A1.5 1.5 0 012.5 2h2l1.5 3-1.5 1a7 7 0 003.5 3.5l1-1.5 3 1.5v2A1.5 1.5 0 0110.5 13 9.5 9.5 0 011 3.5z"/></svg>
          <a href="tel:${lead.phone}">${lead.phone}</a>
        </div>
        <div class="contact-row">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="12" height="8" rx="1"/><path d="M1 4l6 4 6-4"/></svg>
          <a href="mailto:${lead.email}">${lead.email}</a>
        </div>
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Details</div>
      <div class="editable-field">
        <span class="editable-label">Value</span>
        <span class="editable-value" id="editValue-${lead.id}">${lead.value}</span>
        <svg class="edit-pencil" onclick="startEdit(this)" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2l2 2-8 8H2v-2l8-8z"/></svg>
        <div class="edit-actions" id="editActions-val-${lead.id}">
          <button class="edit-save" onclick="saveEdit(this, ${lead.id}, 'value')">Save</button>
          <button class="edit-cancel" onclick="cancelEdit(this)">Cancel</button>
        </div>
      </div>
      <div class="editable-field">
        <span class="editable-label">Type</span>
        <span class="editable-value" id="editType-${lead.id}">${lead.type}</span>
        <svg class="edit-pencil" onclick="startEdit(this)" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2l2 2-8 8H2v-2l8-8z"/></svg>
        <div class="edit-actions" id="editActions-type-${lead.id}">
          <button class="edit-save" onclick="saveEdit(this, ${lead.id}, 'type')">Save</button>
          <button class="edit-cancel" onclick="cancelEdit(this)">Cancel</button>
        </div>
      </div>
      <div class="editable-field">
        <span class="editable-label">Source</span>
        <span class="editable-value" id="editSource-${lead.id}">${lead.source}</span>
        <svg class="edit-pencil" onclick="startEdit(this)" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2l2 2-8 8H2v-2l8-8z"/></svg>
        <div class="edit-actions" id="editActions-src-${lead.id}">
          <button class="edit-save" onclick="saveEdit(this, ${lead.id}, 'source')">Save</button>
          <button class="edit-cancel" onclick="cancelEdit(this)">Cancel</button>
        </div>
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Stage</div>
      <div class="stage-pills" id="stagePills-${lead.id}">${stagePills}</div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Lead Score</div>
      <div class="score-ring-container">
        <div class="score-ring-wrap">
          <svg viewBox="0 0 64 64">
            <circle class="score-ring-bg" cx="32" cy="32" r="26"/>
            <circle class="score-ring-fill" cx="32" cy="32" r="26"
              stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
          </svg>
          <div class="score-ring-value">${lead.score}</div>
        </div>
        <div class="score-ring-label">Based on permit data, property value,<br>engagement signals & enrichment quality</div>
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Notes</div>
      <div class="notes-input-wrap">
        <textarea class="notes-textarea" id="newNote-${lead.id}" placeholder="Add a note…"></textarea>
        <button class="btn btn-gold" style="height:60px;padding:0 16px;" onclick="addNote(${lead.id})">Add</button>
      </div>
      <div id="notesList-${lead.id}" style="display:flex;flex-direction:column;gap:8px;">
        ${notesHtml}
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Activity Timeline</div>
      <div class="timeline">
        ${timelineHtml}
      </div>
    </div>
  `;

  document.getElementById('panelOverlay').classList.add('active');
  document.getElementById('detailPanel').classList.add('active');
}

function closePanel() {
  document.getElementById('panelOverlay').classList.remove('active');
  document.getElementById('detailPanel').classList.remove('active');
}

// ============ PANEL INTERACTIONS ============
function changePanelStage(leadId, newStage) {
  const lead = leads.find(l => l.id === leadId);
  if (lead) { lead.stage = newStage; renderTable(leads); renderTable2(leads); renderKanban(); }
  const pills = document.getElementById(`stagePills-${leadId}`);
  if (pills) {
    pills.querySelectorAll('.stage-pill').forEach(p => {
      p.classList.toggle('active-pill', p.textContent === newStage);
    });
  }
}

function startEdit(pencilEl) {
  const field = pencilEl.previousElementSibling;
  field.setAttribute('contenteditable', 'true');
  field.focus();
  pencilEl.style.display = 'none';
  pencilEl.nextElementSibling.classList.add('visible');
}

function saveEdit(btn, leadId, fieldName) {
  const container = btn.closest('.editable-field');
  const value = container.querySelector('.editable-value');
  value.setAttribute('contenteditable', 'false');
  container.querySelector('.edit-pencil').style.display = '';
  btn.closest('.edit-actions').classList.remove('visible');
  const lead = leads.find(l => l.id === leadId);
  if (lead && fieldName === 'value') { lead.value = value.textContent; renderTable(leads); renderTable2(leads); }
  if (lead && fieldName === 'type') { lead.type = value.textContent; }
  if (lead && fieldName === 'source') { lead.source = value.textContent; renderTable(leads); renderTable2(leads); }
}

function cancelEdit(btn) {
  const container = btn.closest('.editable-field');
  const value = container.querySelector('.editable-value');
  value.setAttribute('contenteditable', 'false');
  container.querySelector('.edit-pencil').style.display = '';
  btn.closest('.edit-actions').classList.remove('visible');
}

function addNote(leadId) {
  const ta = document.getElementById(`newNote-${leadId}`);
  const text = ta.value.trim();
  if (!text) return;
  const lead = leads.find(l => l.id === leadId);
  const now = new Date();
  const timeStr = now.toLocaleDateString('en-US', { month:'short', day:'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
  const note = { text, time: timeStr, author: 'Frank N.' };
  lead.notes.unshift(note);
  ta.value = '';
  const list = document.getElementById(`notesList-${leadId}`);
  const div = document.createElement('div');
  div.className = 'note-item';
  div.innerHTML = `${note.text}<div class="note-meta">${note.time} · ${note.author}</div>`;
  list.prepend(div);
}
