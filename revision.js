// revision.js — Spaced-Repetition Revision Calendar

// ── constants ─────────────────────────────────────────────────────────────
const REVISION_OFFSETS = [2, 7, 14, 21]; // days after solve
const REVISION_LABELS  = ['R1', 'R2', 'R3', 'R4'];
const DIFF_COLORS = {
  Easy:    { bg: 'rgba(0,165,114,0.12)',   text: '#00a572', border: 'rgba(0,165,114,0.25)' },
  Medium:  { bg: 'rgba(251,163,21,0.12)',  text: '#fba315', border: 'rgba(251,163,21,0.25)' },
  Hard:    { bg: 'rgba(255,180,171,0.12)', text: '#ffb4ab', border: 'rgba(255,180,171,0.25)' },
  Unknown: { bg: 'rgba(139,148,158,0.12)', text: '#8b949e', border: 'rgba(139,148,158,0.25)' },
};

// ── state ─────────────────────────────────────────────────────────────────
let viewYear    = new Date().getFullYear();
let viewMonth   = new Date().getMonth(); // 0-based
let scheduleMap = {};   // 'YYYY-MM-DD' → [{slug, title, difficulty, revision, revDate, solvedAt, offset}]
let allRecords  = {};

// ── helpers ───────────────────────────────────────────────────────────────
function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function todayKey() { return toDateKey(new Date()); }
function addDays(ts, days) {
  const d = new Date(ts);
  d.setDate(d.getDate() + days);
  return d;
}
function fmtDate(date) {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
function daysBetween(dateA, dateB) {
  // Positive = dateA is in the future relative to dateB
  return Math.round((dateA - dateB) / (1000 * 60 * 60 * 24));
}

// ── schedule builder ──────────────────────────────────────────────────────
function buildSchedule(records) {
  const map = {};
  Object.values(records).forEach(rec => {
    if (!rec.solved || !rec.solvedAt) return;
    REVISION_OFFSETS.forEach((offset, i) => {
      const revDate = addDays(rec.solvedAt, offset);
      const key     = toDateKey(revDate);
      if (!map[key]) map[key] = [];
      map[key].push({
        slug:       rec.slug,
        title:      rec.title || rec.slug,
        difficulty: rec.difficulty || 'Unknown',
        revision:   REVISION_LABELS[i],
        revDate,
        solvedAt:   rec.solvedAt,
        offset,
      });
    });
  });
  return map;
}

// ── today / overdue panel ─────────────────────────────────────────────────
function renderTodayPanel() {
  const container = document.getElementById('todayPanel');
  const tk    = todayKey();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const overdue  = [];
  const dueToday = scheduleMap[tk] || [];

  Object.entries(scheduleMap).forEach(([key, items]) => {
    const d = new Date(key + 'T00:00:00');
    if (d < today) overdue.push(...items);
  });

  if (overdue.length === 0 && dueToday.length === 0) {
    container.innerHTML = `<div class="no-urgent"><span class="icon-lg">🎉</span><p>No revisions due today. Keep it up!</p></div>`;
    return;
  }

  let html = '';
  if (overdue.length > 0) {
    html += `<div class="urgent-group-title overdue-title">⚠ Overdue</div>`;
    overdue.forEach(item => {
      const daysLate = daysBetween(today, new Date(toDateKey(item.revDate) + 'T00:00:00'));
      const dc = DIFF_COLORS[item.difficulty] || DIFF_COLORS.Unknown;
      html += urgentCard(item, dc, `${Math.abs(daysLate)} day${Math.abs(daysLate) !== 1 ? 's' : ''} overdue`, 'overdue');
    });
  }
  if (dueToday.length > 0) {
    html += `<div class="urgent-group-title today-title">📅 Due Today</div>`;
    dueToday.forEach(item => {
      const dc = DIFF_COLORS[item.difficulty] || DIFF_COLORS.Unknown;
      html += urgentCard(item, dc, 'Due today', 'due-today');
    });
  }
  container.innerHTML = html;
}

function urgentCard(item, dc, label, cls) {
  const solvedDate = fmtDate(new Date(item.solvedAt));
  const solvedTime = fmtTime(new Date(item.solvedAt));
  return `<a href="https://leetcode.com/problems/${item.slug}/" target="_blank" class="urgent-card ${cls}">
    <div class="urgent-card-top">
      <span class="revision-pill" style="background:${dc.bg};color:${dc.text};border:1px solid ${dc.border}">${item.revision}</span>
      <span class="diff-pill" style="background:${dc.bg};color:${dc.text};border:1px solid ${dc.border}">${item.difficulty}</span>
      <span class="urgent-label">${label}</span>
    </div>
    <div class="urgent-card-title">${item.title}</div>
    <div class="urgent-card-meta">Solved ${solvedDate} at ${solvedTime} · +${item.offset} days</div>
  </a>`;
}

// ── calendar renderer ─────────────────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

function renderCalendar() {
  document.getElementById('calMonthLabel').textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  const today  = new Date(); today.setHours(0, 0, 0, 0);
  const todayK = todayKey();

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const grid = document.getElementById('calGrid');
  grid.innerHTML = ''; // clear previous cells

  // Leading blank cells
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-cell empty';
    grid.appendChild(blank);
  }

  // Day cells — NO inline onclick; we use event delegation on the grid
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(viewYear, viewMonth, d);
    const key      = toDateKey(cellDate);
    const items    = scheduleMap[key] || [];
    const isToday  = key === todayK;
    const isPast   = cellDate < today && !isToday;
    const hasItems = items.length > 0;

    const cell = document.createElement('div');
    cell.className = 'cal-cell';
    if (isToday)                cell.classList.add('cal-today');
    else if (isPast && hasItems) cell.classList.add('cal-past-event');
    else if (hasItems)           cell.classList.add('cal-future-event');
    else if (isPast)             cell.classList.add('cal-past');

    // Store date key as data attribute (no JSON — items are looked up from scheduleMap)
    cell.dataset.dateKey = key;

    // Day number
    const dayNum = document.createElement('span');
    dayNum.className = 'cal-day-num';
    dayNum.textContent = d;
    cell.appendChild(dayNum);

    // Dots
    if (hasItems) {
      const dotsRow = document.createElement('div');
      dotsRow.className = 'cal-dots';
      const seen = {};
      items.forEach(it => { seen[it.revision] = it; });
      Object.values(seen).forEach(it => {
        const dc  = DIFF_COLORS[it.difficulty] || DIFF_COLORS.Unknown;
        const dot = document.createElement('span');
        dot.className = 'cal-dot';
        dot.style.background = dc.text;
        dotsRow.appendChild(dot);
      });
      cell.appendChild(dotsRow);

      // Item count badge
      const badge = document.createElement('span');
      badge.className = 'cal-item-count';
      badge.textContent = `${items.length} problem${items.length !== 1 ? 's' : ''}`;
      cell.appendChild(badge);
    }

    grid.appendChild(cell);
  }
}

// ── day-detail popup ──────────────────────────────────────────────────────
function openDayModal(key) {
  const items = scheduleMap[key];
  if (!items || items.length === 0) return;

  const cellDate = new Date(key + 'T00:00:00');
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const daysAway = daysBetween(cellDate, today);

  const dayName = cellDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = cellDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  let relLabel;
  if (daysAway === 0)    relLabel = 'Today';
  else if (daysAway > 0) relLabel = `In ${daysAway} day${daysAway !== 1 ? 's' : ''}`;
  else                   relLabel = `${Math.abs(daysAway)} day${Math.abs(daysAway) !== 1 ? 's' : ''} ago`;

  document.getElementById('modalDateMain').textContent = `${dayName}, ${dateStr}`;
  document.getElementById('modalDateSub').textContent  =
    `${items.length} revision${items.length !== 1 ? 's' : ''} · ${relLabel}`;

  const body = document.getElementById('modalBody');
  body.innerHTML = '';

  items.forEach(item => {
    const dc   = DIFF_COLORS[item.difficulty] || DIFF_COLORS.Unknown;
    const card = document.createElement('a');
    card.href   = `https://leetcode.com/problems/${item.slug}/`;
    card.target = '_blank';
    card.className = 'modal-card';

    card.innerHTML = `
      <div class="modal-card-header">
        <span class="revision-pill" style="background:${dc.bg};color:${dc.text};border:1px solid ${dc.border}">${item.revision}</span>
        <span class="diff-pill"     style="background:${dc.bg};color:${dc.text};border:1px solid ${dc.border}">${item.difficulty}</span>
      </div>
      <div class="modal-card-title">${item.title}</div>
      <div class="modal-card-meta">
        <span><span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle">check_circle</span>&nbsp;Solved ${fmtDate(new Date(item.solvedAt))} at ${fmtTime(new Date(item.solvedAt))}</span>
        <span><span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle">schedule</span>&nbsp;+${item.offset}-day interval</span>
      </div>
      <div class="modal-card-open">
        <span class="material-symbols-outlined" style="font-size:13px">open_in_new</span>
        Open on LeetCode
      </div>`;

    body.appendChild(card);
  });

  document.getElementById('dayModal').classList.add('open');
}

function closeModal() {
  document.getElementById('dayModal').classList.remove('open');
}

// ── stats strip ───────────────────────────────────────────────────────────
function renderStats() {
  const tk    = todayKey();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let total = 0, overdue = 0, todayC = 0, upcoming = 0;

  Object.entries(scheduleMap).forEach(([key, items]) => {
    const d = new Date(key + 'T00:00:00');
    total += items.length;
    if (key === tk)     todayC  += items.length;
    else if (d < today) overdue += items.length;
    else                upcoming += items.length;
  });

  document.getElementById('statTotalRev').textContent = total;
  document.getElementById('statOverdue').textContent  = overdue;
  document.getElementById('statToday').textContent    = todayC;
  document.getElementById('statUpcoming').textContent = upcoming;
}

// ── init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Load data
  chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, response => {
    allRecords  = response?.records || {};
    scheduleMap = buildSchedule(allRecords);
    renderStats();
    renderTodayPanel();
    renderCalendar();
  });

  // Month navigation
  document.getElementById('btnPrevMonth').addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  document.getElementById('btnNextMonth').addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });
  document.getElementById('btnToday').addEventListener('click', () => {
    viewYear  = new Date().getFullYear();
    viewMonth = new Date().getMonth();
    renderCalendar();
  });

  // ── Calendar click — event delegation (MV3 CSP-safe, no inline onclick) ──
  document.getElementById('calGrid').addEventListener('click', e => {
    const cell = e.target.closest('.cal-cell[data-date-key]');
    if (!cell) return;
    openDayModal(cell.dataset.dateKey);
  });

  // Modal close
  document.getElementById('dayModal').addEventListener('click', e => {
    if (e.target === document.getElementById('dayModal')) closeModal();
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);

  // Escape key to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});
