// dashboard.js — Dashboard UI and real-time updates

// ── utilities ──────────────────────────────────────────────────────────────
function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function getStatusEmoji(solved) {
  return solved ? '✓' : '◇';
}

// ── state ──────────────────────────────────────────────────────────────────
let allRecords = {};
let currentFilter = 'all';

// ── update stats ───────────────────────────────────────────────────────────
function updateStats() {
  const stats = {
    total: Object.keys(allRecords).length,
    easy: { total: 0, solved: 0 },
    medium: { total: 0, solved: 0 },
    hard: { total: 0, solved: 0 }
  };

  Object.values(allRecords).forEach(record => {
    const diff = (record.difficulty || 'Easy').toLowerCase();
    if (stats[diff]) {
      stats[diff].total++;
      if (record.solved) stats[diff].solved++;
    }
  });

  document.getElementById('statTotal').textContent = stats.total;
  document.getElementById('statEasySolved').textContent = stats.easy.solved;
  document.getElementById('statEasyTotal').textContent = `of ${stats.easy.total}`;
  document.getElementById('statMediumSolved').textContent = stats.medium.solved;
  document.getElementById('statMediumTotal').textContent = `of ${stats.medium.total}`;
  document.getElementById('statHardSolved').textContent = stats.hard.solved;
  document.getElementById('statHardTotal').textContent = `of ${stats.hard.total}`;
}

// ── filter & render table ──────────────────────────────────────────────────
function shouldShowRecord(record) {
  if (currentFilter === 'all') return true;
  if (currentFilter === 'solved') return record.solved;
  if (currentFilter === 'pending') return !record.solved;
  if (currentFilter === 'easy') return record.difficulty === 'Easy';
  if (currentFilter === 'medium') return record.difficulty === 'Medium';
  if (currentFilter === 'hard') return record.difficulty === 'Hard';
  return true;
}

function renderProblems() {
  const contentDiv = document.getElementById('problemsContent');
  const problems = Object.values(allRecords)
    .filter(shouldShowRecord)
    .sort((a, b) => b.lastSeen - a.lastSeen);

  document.getElementById('problemsCount').textContent = problems.length;

  if (problems.length === 0) {
    contentDiv.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>No problems found with this filter.</p>
      </div>
    `;
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th style="width: 40px;">#</th>
          <th>Problem</th>
          <th style="width: 100px;">Status</th>
          <th style="width: 80px;">Difficulty</th>
          <th style="width: 90px;">Time Spent</th>
          <th style="width: 60px;">Rating</th>
          <th style="width: 100px;">Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  problems.forEach((record, idx) => {
    const statusClass = record.solved ? 'status-solved' : 'status-pending';
    const statusText = record.solved ? '✓ Solved' : '◇ Pending';
    const diffClass = `difficulty-${record.difficulty || 'Easy'}`;
    const starsHtml = '★'.repeat(record.stars || 0) + (record.stars ? '' : '☆');

    html += `
      <tr>
        <td class="problem-num">${idx + 1}</td>
        <td class="problem-title" title="${record.title || record.slug}">
          ${record.title || record.slug}
        </td>
        <td>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </td>
        <td>
          <span class="difficulty-badge ${diffClass}">${record.difficulty || 'Easy'}</span>
        </td>
        <td class="problem-time">${formatTime(record.totalMs || 0)}</td>
        <td class="problem-stars ${record.stars ? 'filled' : 'empty'}">
          ${starsHtml}
        </td>
        <td class="problem-actions">
          <button class="action-btn ${record.solved ? 'solved' : ''}" 
                  onclick="toggleSolved('${record.slug}', ${!record.solved})">
            ${record.solved ? '✓ Solved' : 'Mark Solved'}
          </button>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  contentDiv.innerHTML = html;
}

// ── toggle solved status ────────────────────────────────────────────────────
function toggleSolved(slug, solved) {
  const msgType = solved ? 'MARK_SOLVED' : 'MARK_PENDING';
  chrome.runtime.sendMessage({ type: msgType, slug }, () => {
    loadData();
  });
}

// ── load data from background ──────────────────────────────────────────────
async function loadData() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: 'GET_DATA' }, response => {
      if (response && response.records) {
        allRecords = response.records;
        updateStats();
        renderProblems();
      }
      resolve();
    });
  });
}

// ── event listeners ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      renderProblems();
    });
  });

  // Clear all button
  document.getElementById('btnClearAll').addEventListener('click', () => {
    if (confirm('Are you sure? This will delete all tracked data.')) {
      chrome.runtime.sendMessage({ type: 'CLEAR_ALL' }, () => {
        allRecords = {};
        updateStats();
        renderProblems();
      });
    }
  });

  // Initial load
  loadData();

  // Listen for updates from background
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'DASHBOARD_UPDATE') {
      allRecords = msg.records;
      updateStats();
      renderProblems();
    }
  });

  // Refresh data every 2 seconds to catch updates
  setInterval(() => {
    loadData();
  }, 2000);
});
