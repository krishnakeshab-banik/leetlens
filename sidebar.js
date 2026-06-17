// sidebar.js — Injects and manages the sidebar UI

(function () {
  'use strict';

  // Format time functions
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

  // Create sidebar HTML
  function createSidebarHTML() {
    return `
      <div class="lct-sidebar-header">
        <p class="lct-sidebar-title">⏱ LeetLens</p>
        <button id="lct-close-sidebar" class="lct-close-btn" title="Hide sidebar">✕</button>
      </div>
      <div class="lct-sidebar-content">
        <div id="lct-session-container">
          <div class="lct-no-session">
            <div class="lct-no-session-icon">⏱️</div>
            Loading session...
          </div>
        </div>
      </div>
    `;
  }

  // Create toggle button HTML
  function createToggleButtonHTML() {
    return `<button id="lct-toggle-sidebar" class="lct-toggle-btn" title="Show sidebar">⏱</button>`;
  }

  // Inject sidebar into page
  function injectSidebar() {
    // Check if already injected
    if (document.getElementById('lct-sidebar')) return;

    // Inject styles if not already present
    if (!document.getElementById('lct-sidebar-styles')) {
      const style = document.createElement('link');
      style.id = 'lct-sidebar-styles';
      style.rel = 'stylesheet';
      style.href = chrome.runtime.getURL('sidebar.css');
      document.head.appendChild(style);
    }

    // Create and inject sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'lct-sidebar';
    sidebar.innerHTML = createSidebarHTML();
    document.body.appendChild(sidebar);

    // Create and inject toggle button
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'lct-toggle-btn-container';
    toggleBtn.innerHTML = createToggleButtonHTML();
    document.body.appendChild(toggleBtn);

    // Adjust page layout to accommodate sidebar
    document.body.style.marginRight = '320px';

    // Attach toggle listeners
    const sidebarEl = document.getElementById('lct-sidebar');
    const toggleBtnEl = document.getElementById('lct-toggle-sidebar');
    const closeBtnEl = document.getElementById('lct-close-sidebar');

    if (toggleBtnEl) {
      toggleBtnEl.addEventListener('click', () => {
        sidebarEl.classList.remove('hidden');
        document.body.style.marginRight = '320px';
        toggleBtnEl.style.display = 'none';
      });
    }

    if (closeBtnEl) {
      closeBtnEl.addEventListener('click', () => {
        sidebarEl.classList.add('hidden');
        document.body.style.marginRight = '0';
        if (toggleBtnEl) toggleBtnEl.style.display = 'flex';
      });
    }
  }

  // Update sidebar content
  async function updateSidebar() {
    const sidebarEl = document.getElementById('lct-sidebar');
    if (!sidebarEl) return;

    const containerEl = document.getElementById('lct-session-container');
    if (!containerEl) return;

    // Get current session and records
    const session = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_CURRENT' }, msg => {
        resolve(msg?.session || null);
      });
    });

    const records = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, msg => {
        resolve(msg?.records || {});
      });
    });

    if (!session) {
      containerEl.innerHTML = `
        <div class="lct-no-session">
          <div class="lct-no-session-icon">✨</div>
          No active problem
        </div>
      `;
      return;
    }

    const rec = records[session.slug] || {};
    const title = session.title !== 'Unknown' ? session.title : (rec.title || session.slug);
    const difficulty = (session.difficulty !== 'Unknown' ? session.difficulty : (rec.difficulty || 'Unknown')).toLowerCase();
    const stars = rec.stars || 0;
    const solved = rec.solved || false;

    const diffClass = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'unknown';
    const statusClass = solved ? 'solved' : 'pending';
    const pausedLabel = session.paused ? ' <span style="font-size:10px;opacity:.7">(paused)</span>' : '';
    const statusText = solved ? `✓ Solved${pausedLabel}` : '◇ Pending';

    const starsHTML = Array.from({ length: 5 }, (_, i) => {
      const val = i + 1;
      const isLit = val <= stars ? 'lit' : '';
      return `<span class="lct-star ${isLit}" data-slug="${session.slug}" data-val="${val}">★</span>`;
    }).join('');

    containerEl.innerHTML = `
      <div class="lct-session-box">
        <div class="lct-difficulty-badge ${diffClass}">${session.difficulty || 'Unknown'}</div>
        <div class="lct-status-badge ${statusClass}">${statusText}</div>
        <div class="lct-problem-title">${title}</div>
        <div class="lct-timer" id="lct-sidebar-timer">0:00</div>
        
        <div class="lct-rating-section">
          <label class="lct-rating-label">Rate this problem</label>
          <div class="lct-stars">${starsHTML}</div>
        </div>

        <div class="lct-action-buttons">
          <button class="lct-btn lct-btn-secondary lct-btn-small" id="lct-toggle-solved">
            ${solved ? 'Mark Pending' : 'Mark Solved'}
          </button>
          <button class="lct-btn lct-btn-secondary lct-btn-small" id="lct-open-dashboard">
            Dashboard
          </button>
        </div>
      </div>

      <div class="lct-section">
        <label class="lct-section-title">Today's Stats</label>
        <div class="lct-stat-item">
          <span class="lct-stat-label">Session Time:</span>
          <span class="lct-stat-value" id="lct-session-time">0s</span>
        </div>
        <div class="lct-stat-item">
          <span class="lct-stat-label">Total Sessions:</span>
          <span class="lct-stat-value">${rec.sessions || 0}</span>
        </div>
        <div class="lct-stat-item">
          <span class="lct-stat-label">Total Time:</span>
          <span class="lct-stat-value">${fmtTime(rec.totalMs || 0)}</span>
        </div>
      </div>
    `;

    // Attach event listeners
    attachSidebarEvents(session.slug);

    // Update the live timer session reference and do an immediate tick
    startLiveTimer(session);
    sidebarTick();
  }

  // Attach event listeners to sidebar elements
  function attachSidebarEvents(slug) {
    // Star clicks
    document.querySelectorAll('.lct-star').forEach(star => {
      star.addEventListener('click', (e) => {
        const val = parseInt(e.target.dataset.val, 10);
        chrome.runtime.sendMessage({ type: 'SET_STARS', slug, stars: val }, () => {
          updateSidebar();
        });
      });
    });

    // Toggle solved button
    const toggleBtn = document.getElementById('lct-toggle-solved');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', async () => {
        const records = await new Promise(resolve => {
          chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, msg => {
            resolve(msg?.records || {});
          });
        });
        const isSolved = records[slug]?.solved || false;
        const msgType = isSolved ? 'MARK_PENDING' : 'MARK_SOLVED';
        chrome.runtime.sendMessage({ type: msgType, slug }, () => {
          updateSidebar();
        });
      });
    }

    // Open dashboard button
    const dashboardBtn = document.getElementById('lct-open-dashboard');
    if (dashboardBtn) {
      dashboardBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD' });
      });
    }
  }

  // Update live timer
  let timerInterval = null;
  let sidebarSession = null; // tracks current session for tick()

  function sidebarTick() {
    const timerEl = document.getElementById('lct-sidebar-timer');
    const sessionTimeEl = document.getElementById('lct-session-time');
    if (!timerEl || !sidebarSession) return;

    if (sidebarSession.paused) {
      const frozen = sidebarSession.pausedAt - sidebarSession.startTime;
      timerEl.textContent = fmtTimerLive(frozen);
      if (sessionTimeEl) sessionTimeEl.textContent = fmtTime(frozen);
      return;
    }

    const elapsed = Date.now() - sidebarSession.startTime;
    timerEl.textContent = fmtTimerLive(elapsed);
    if (sessionTimeEl) sessionTimeEl.textContent = fmtTime(elapsed);
  }

  function startLiveTimer(session) {
    sidebarSession = session;
    if (timerInterval) return; // already running — don't create a second one
    timerInterval = setInterval(sidebarTick, 1000);
  }

  // Listen for messages from background
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'DASHBOARD_UPDATE') {
      updateSidebar();
    }
  });

  // Initialize
  function init() {
    injectSidebar();

    // Hide toggle button by default (sidebar is visible)
    const toggleBtnEl = document.getElementById('lct-toggle-sidebar');
    if (toggleBtnEl) {
      toggleBtnEl.style.display = 'none';
    }

    updateSidebar();

    // Get session and start timer
    chrome.runtime.sendMessage({ type: 'GET_CURRENT' }, msg => {
      const session = msg?.session;
      if (session) {
        startLiveTimer(session);
        sidebarTick();
      }
    });
  }

  // Wait for DOM to be ready
  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  // Refresh every 5 seconds as fallback (DASHBOARD_UPDATE messages handle most cases)
  setInterval(updateSidebar, 5000);
})();
