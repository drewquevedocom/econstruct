/* eConstruct CRM — Pipeline / Kanban with Drag & Drop */

let draggedLeadId = null;

function renderKanban() {
  const board = document.getElementById('kanbanBoard');
  if (!board) return;
  board.innerHTML = '';

  STAGES.forEach(stage => {
    const stageLeads = leads.filter(l => l.stage === stage && !l.archived);
    const totalValue = stageLeads.reduce((sum, l) => sum + l.valueNum, 0);

    const col = document.createElement('div');
    col.className = 'kanban-col';
    col.dataset.stage = stage;

    let cardsHtml = '';
    stageLeads.forEach(lead => {
      const cardClass = lead.score >= 85 ? 'score-high-card' : 'score-mid-card';
      const scoreClass = lead.score >= 85 ? 'score-high' : 'score-mid';
      cardsHtml += `
        <div class="kanban-card ${cardClass}"
             draggable="true"
             data-lead-id="${lead.id}"
             ondragstart="onCardDragStart(event, ${lead.id})"
             ondragend="onCardDragEnd(event)"
             onclick="openPanel(${lead.id})">
          <div class="kanban-card-address">${lead.address}</div>
          <div class="kanban-card-contact">${lead.contact}</div>
          <div class="kanban-card-bottom">
            <span class="kanban-card-value">${lead.value}</span>
            <div class="kanban-card-meta">
              <span class="score-badge ${scoreClass}" style="font-size:10px;padding:2px 6px;">${lead.score}</span>
              <span style="font-size:10px;color:var(--text-muted);font-weight:500;">${lead.source}</span>
            </div>
          </div>
        </div>
      `;
    });

    const formattedValue = totalValue >= 1000000 ? '$' + (totalValue / 1000000).toFixed(1) + 'M' : '$' + totalValue.toLocaleString();

    col.innerHTML = `
      <div class="kanban-col-header">
        <div>
          <div class="kanban-col-name">${stage}</div>
          <div class="kanban-col-value">${formattedValue}</div>
        </div>
        <span class="kanban-col-count">${stageLeads.length}</span>
      </div>
      <div class="kanban-cards"
           data-stage="${stage}"
           ondragover="onColumnDragOver(event)"
           ondragenter="onColumnDragEnter(event)"
           ondragleave="onColumnDragLeave(event)"
           ondrop="onColumnDrop(event, '${stage}')">
        ${cardsHtml || '<div class="kanban-empty">No leads</div>'}
      </div>
    `;
    board.appendChild(col);
  });
}

function onCardDragStart(e, leadId) {
  draggedLeadId = leadId;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', leadId);
  e.target.classList.add('dragging');
  // Highlight all drop zones
  document.querySelectorAll('.kanban-cards').forEach(el => el.classList.add('drop-zone'));
}

function onCardDragEnd(e) {
  e.target.classList.remove('dragging');
  draggedLeadId = null;
  document.querySelectorAll('.kanban-cards').forEach(el => {
    el.classList.remove('drop-zone', 'drop-zone-active');
  });
}

function onColumnDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function onColumnDragEnter(e) {
  e.preventDefault();
  const cards = e.currentTarget.closest ? e.currentTarget : e.target.closest('.kanban-cards');
  if (cards) cards.classList.add('drop-zone-active');
}

function onColumnDragLeave(e) {
  const cards = e.currentTarget;
  // Only remove if we're actually leaving the container
  if (!cards.contains(e.relatedTarget)) {
    cards.classList.remove('drop-zone-active');
  }
}

function onColumnDrop(e, newStage) {
  e.preventDefault();
  const cards = e.currentTarget;
  cards.classList.remove('drop-zone-active');

  if (draggedLeadId === null) return;

  const lead = leads.find(l => l.id === draggedLeadId);
  if (!lead || lead.stage === newStage) return;

  const prevStage = lead.stage;
  lead.stage = newStage;
  addTimelineEntry(lead, 'Stage changed: ' + prevStage + ' → ' + newStage);
  saveLeads();
  renderKanban();
  // Update other views
  if (typeof renderTable  === 'function') renderTable(leads.filter(l => !l.archived));
  if (typeof renderTable2 === 'function') renderTable2(leads.filter(l => !l.archived));
  // Fire outreach email when dragged into Outreach column
  if (newStage === 'Outreach' && typeof sendOutreachEmail === 'function') sendOutreachEmail(lead);
}
