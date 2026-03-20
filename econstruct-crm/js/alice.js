/* eConstruct CRM — AI Alice Chatbot */

let aliceOpen = false;

function toggleAlice() {
  aliceOpen = !aliceOpen;
  document.getElementById('alicePanel').classList.toggle('open', aliceOpen);
  if (aliceOpen) {
    const msgs = document.getElementById('aliceMessages');
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => document.getElementById('aliceInput').focus(), 300);
  }
}

// Close alice on outside click
document.addEventListener('click', (e) => {
  if (aliceOpen && !e.target.closest('.alice-panel') && !e.target.closest('.ai-btn')) {
    toggleAlice();
  }
});

function addAliceMessage(text, sender) {
  const msgs = document.getElementById('aliceMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `alice-msg ${sender}`;
  const avatarText = sender === 'alice' ? '✦' : 'FN';
  msgDiv.innerHTML = `
    <div class="alice-msg-avatar">${avatarText}</div>
    <div class="alice-msg-bubble">${text}</div>
  `;
  msgs.appendChild(msgDiv);
  msgs.scrollTop = msgs.scrollHeight;
}

function getAliceResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('lead') || lower.includes('new')) {
    return "I found 4 new leads in the last 24 hours. The highest-value prospect is at 1430 Capri Dr — $5.1M fire rebuild. Should I schedule outreach?";
  }
  if (lower.includes('outreach') || lower.includes('email')) {
    return "You have 3 emails pending review in the outreach queue. Open rate this week: 42%, up from 38%. Want me to draft follow-ups for non-responders?";
  }
  if (lower.includes('meeting') || lower.includes('schedule')) {
    return "You have 2 meetings this week: Michael Chen (Mar 18, 10am) and Jennifer Walsh (Mar 16, 2pm). Both are high-intent — I've prepared briefing packets.";
  }
  if (lower.includes('report') || lower.includes('status')) {
    return "Pipeline summary: 843 total leads, 7 replied, 2 meetings booked, 1 proposal out. Conversion rate trending up at 2.3%. Your fire rebuild campaign has the highest engagement.";
  }
  return "I can help with lead enrichment, outreach scheduling, pipeline analysis, or fire zone intel. What would you like me to focus on?";
}

function sendAliceMessage() {
  const input = document.getElementById('aliceInput');
  const text = input.value.trim();
  if (!text) return;
  
  addAliceMessage(text, 'user');
  input.value = '';
  
  // Simulate typing delay
  setTimeout(() => {
    addAliceMessage(getAliceResponse(text), 'alice');
  }, 600 + Math.random() * 400);
}

// Pre-load conversation
function initAliceConversation() {
  addAliceMessage("Good morning. I noticed 3 new LADBS permits filed in 90272 overnight. Two match your fire rebuild profile — want me to enrich them?", 'alice');
  setTimeout(() => addAliceMessage("Yes, prioritize the higher value ones", 'user'), 100);
  setTimeout(() => addAliceMessage("Done. 1247 Palisades Beach Rd scored 96 — already enriched via Apollo. Michael Chen, architect retained. I've queued the outreach email for your review.", 'alice'), 200);
}
