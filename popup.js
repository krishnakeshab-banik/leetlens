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
  if (h > 0) return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

function starHtml(n, slug) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= n ? 'lit' : 'dim'}" data-slug="${slug}" data-val="${i}">★</span>`;
  }
  return html;
}

// ── live timer ────────────────────────────────────────────────────────────
let tickInterval = null;
let refreshInterval = null;
let currentSession = null;
let currentRecords = {};

function tick() {
  const timerEl = document.getElementById('nowTimer');
  if (!timerEl || !currentSession) return;

  if (currentSession.paused) {
    const frozen = currentSession.pausedAt - currentSession.startTime;
    timerEl.textContent = fmtTimerLive(frozen);
    return;
  }

  const elapsed = Date.now() - currentSession.startTime;
  timerEl.textContent = fmtTimerLive(elapsed);
}

function renderSession(session, records) {
  currentSession = session;
  currentRecords = records;

  const timerEl = document.getElementById('nowTimer');
  const titleEl = document.getElementById('nowTitle');
  const diffEl = document.getElementById('nowDiff');
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
  const diff = session.difficulty !== 'Unknown' ? session.difficulty : (rec.difficulty || 'Unknown');
  const stars = rec.stars || 0;
  const solved = rec.solved || false;

  titleEl.textContent = title;
  diffEl.textContent = diff;
  diffEl.className = `diff-badge diff-${diff}`;
  starsEl.innerHTML = `<span>Rate:</span>${starHtml(stars, session.slug)}`;

  const pausedLabel = session.paused ? ' <span style="font-size:10px;opacity:.7">(paused)</span>' : '';
  statusEl.innerHTML = solved
    ? `<span class="status-badge solved">✓ Solved${pausedLabel}</span>`
    : `<span class="status-badge pending">◇ Pending</span>`;

  tick();
}

// ── cloud auth state in popup ─────────────────────────────────────────────
async function renderAuthState() {
  const bar = document.getElementById('cloudAuthBar');
  const label = document.getElementById('cloudLabel');
  const emailEl = document.getElementById('cloudEmail');
  const metaEl = document.getElementById('cloudMeta');
  const signInBtn = document.getElementById('openSignIn');

  if (!bar || !emailEl) return;

  const data = await chrome.storage.local.get(['leetlensAuth', 'leetlensUserProfile']);
  const auth = data.leetlensAuth;
  const profile = data.leetlensUserProfile;

  // Remove any prior avatar node
  bar.querySelectorAll('.cloud-avatar, .cloud-avatar-placeholder').forEach(n => n.remove());

  if (auth?.uid && auth?.email) {
    bar.classList.add('signed-in');
    if (label) label.textContent = 'Signed in';
    emailEl.textContent = auth.displayName || auth.email;

    const parts = [];
    if (profile?.leetcodeUsername) parts.push(`LC @${profile.leetcodeUsername}`);
    if (profile?.githubUsername) parts.push(`GH @${profile.githubUsername}`);
    if (metaEl) metaEl.textContent = parts.length ? parts.join(' · ') : 'Cloud sync active';

    const avatar = auth.photoURL
      ? Object.assign(document.createElement('img'), {
          className: 'cloud-avatar',
          src: auth.photoURL,
          alt: ''
        })
      : Object.assign(document.createElement('div'), {
          className: 'cloud-avatar-placeholder',
          textContent: (auth.displayName || auth.email || '?').charAt(0).toUpperCase()
        });
    bar.insertBefore(avatar, bar.firstChild);

    if (signInBtn) {
      signInBtn.textContent = 'Account';
      signInBtn.classList.add('signed-in');
    }
  } else {
    bar.classList.remove('signed-in');
    if (label) label.textContent = 'Cloud';
    emailEl.textContent = 'Not signed in';
    if (metaEl) metaEl.textContent = 'Sign in to sync LeetCode & GitHub';
    if (signInBtn) {
      signInBtn.textContent = 'Sign In';
      signInBtn.classList.remove('signed-in');
    }
  }
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

// ── star click ────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  if (!e.target.classList.contains('star')) return;
  const slug = e.target.dataset.slug;
  const stars = parseInt(e.target.dataset.val, 10);
  chrome.runtime.sendMessage({ type: 'SET_STARS', slug, stars }, () => {
    document.querySelectorAll(`[data-slug="${slug}"]`).forEach(s => {
      s.className = `star ${parseInt(s.dataset.val) <= stars ? 'lit' : 'dim'}`;
    });
  });
});

// ── navigation ──────────────────────────────────────────────────────────
document.getElementById('openDevelopers')?.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html#developers') });
  window.close();
});

document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  window.close();
});

document.getElementById('openSignIn')?.addEventListener('click', async () => {
  const data = await chrome.storage.local.get(['leetlensAuth']);
  const view = data.leetlensAuth?.uid ? 'profile' : 'signin';
  chrome.tabs.create({ url: chrome.runtime.getURL(`dashboard.html#${view}`) });
  window.close();
});

document.getElementById('cloudAuthBar')?.addEventListener('click', async () => {
  const data = await chrome.storage.local.get(['leetlensAuth']);
  const view = data.leetlensAuth?.uid ? 'profile' : 'signin';
  chrome.tabs.create({ url: chrome.runtime.getURL(`dashboard.html#${view}`) });
  window.close();
});

// ── init / refresh ─────────────────────────────────────────────────────────
async function fetchAndRender() {
  const [sessionRes, recordsRes] = await Promise.all([
    new Promise(r => chrome.runtime.sendMessage({ type: 'GET_CURRENT' }, r)),
    new Promise(r => chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, r))
  ]);

  const session = sessionRes?.session || null;
  const records = recordsRes?.records || {};

  renderSession(session, records);
  renderList(records, session?.slug);
  await renderAuthState();
}

function init() {
  if (!tickInterval) tickInterval = setInterval(tick, 1000);
  fetchAndRender();
  if (!refreshInterval) refreshInterval = setInterval(fetchAndRender, 5000);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.leetlensAuth || changes.leetlensUserProfile) {
      renderAuthState();
    }
  });
}

init();
