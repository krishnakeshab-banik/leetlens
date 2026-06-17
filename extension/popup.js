// popup.js

function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function fmtTimerLive(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
  return `${m}:${String(s % 60).padStart(2,'0')}`;
}

function starHtml(n, slug) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= n ? 'lit' : 'dim'}" data-slug="${slug}" data-val="${i}">★</span>`;
  }
  return html;
}

// ── live timer ────────────────────────────────────────────────────────────
let timerInterval = null;
let sessionStart = null;
let currentSession = null;

function startLiveTimer(session, records) {
  currentSession = session;
  sessionStart = session ? session.startTime : null;

  const timerEl = document.getElementById('nowTimer');
  const titleEl = document.getElementById('nowTitle');
  const diffEl  = document.getElementById('nowDiff');
  const starsEl = document.getElementById('nowStars');
  const statusEl = document.getElementById('nowStatus');

  if (!session) {
    titleEl.textContent = 'No active problem';
    timerEl.textContent = '—';
    diffEl.textContent = '—';
    diffEl.className = 'diff-badge diff-Unknown';
    starsEl.innerHTML = '<span>Rate:</span>';
    statusEl.innerHTML = '';
    return;
  }

  const rec = records[session.slug] || {};
  const title = session.title !== 'Unknown' ? session.title : (rec.title || session.slug);
  const diff  = session.difficulty !== 'Unknown' ? session.difficulty : (rec.difficulty || 'Unknown');
  const stars = rec.stars || 0;
  const solved = rec.solved || false;

  titleEl.textContent = title;
  diffEl.textContent = diff;
  diffEl.className = `diff-badge diff-${diff}`;
  starsEl.innerHTML = `<span>Rate:</span>${starHtml(stars, session.slug)}`;
  
  // Show status
  statusEl.innerHTML = solved ? 
    `<span class="status-badge solved">✓ Solved</span>` : 
    `<span class="status-badge pending">◇ Pending</span>`;

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - session.startTime + (rec.totalMs || 0);
    timerEl.textContent = fmtTimerLive(Date.now() - session.startTime);
  }, 1000);
}

// ── records list ──────────────────────────────────────────────────────────
function renderList(records, currentSlug) {
  const list = document.getElementById('recList');
  const sorted = Object.values(records)
    .sort((a, b) => b.totalMs - a.totalMs)
    .slice(0, 5);

  if (sorted.length === 0) {
    list.innerHTML = '<div class="empty">No problems tracked yet.<br>Open a LeetCode problem to start.</div>';
    return;
  }

  list.innerHTML = sorted.map((r, i) => {
    const statusEmoji = r.solved ? '✓' : '◇';
    return `
    <div class="list-item" style="${r.slug === currentSlug ? 'border-color:var(--accent)' : ''}">
      <span class="rank">#${i + 1}</span>
      <span class="item-title" title="${r.title || r.slug}">${r.title || r.slug}</span>
      <span class="item-status">${statusEmoji}</span>
      <span class="item-stars">${r.stars ? '★'.repeat(r.stars) : '☆'}</span>
      <span class="item-time">${fmtTime(r.totalMs)}</span>
    </div>
  `;
  }).join('');
}

// ── star click (popup context — for current question) ─────────────────────
document.addEventListener('click', e => {
  if (!e.target.classList.contains('star')) return;
  const slug  = e.target.dataset.slug;
  const stars = parseInt(e.target.dataset.val, 10);
  chrome.runtime.sendMessage({ type: 'SET_STARS', slug, stars }, () => {
    // re-render stars
    document.querySelectorAll(`[data-slug="${slug}"]`).forEach(s => {
      s.className = `star ${parseInt(s.dataset.val) <= stars ? 'lit' : 'dim'}`;
    });
  });
});

// ── open dashboard ─────────────────────────────────────────────────────────
document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  window.close();
});

// ── init ───────────────────────────────────────────────────────────────────
async function init() {
  const [sessionRes, recordsRes] = await Promise.all([
    new Promise(r => chrome.runtime.sendMessage({ type: 'GET_CURRENT' }, r)),
    new Promise(r => chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, r))
  ]);

  const session = sessionRes?.session || null;
  const records = recordsRes?.records || {};

  startLiveTimer(session, records);
  renderList(records, session?.slug);
}

init();

// refresh every 1 second
setInterval(init, 1000);
