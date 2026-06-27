// dashboard.js — Dashboard UI, view routing, and real-time updates

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
let mergedRecords = {};
let recordsLoaded = false;
let mergeLoadId = 0;
let mergeInFlight = false;
let currentFilter = 'all';
let searchQuery = '';
let currentSortField = 'lastSeen';
let currentSortDirection = 'desc';
let currentView = 'overview';

function getJoinCodeFromUrl() {
  if (window.LeetLensSquadsJoin?.getJoinCodeFromUrl) {
    return window.LeetLensSquadsJoin.getJoinCodeFromUrl();
  }
  const fromQuery = new URLSearchParams(window.location.search).get('joinCode');
  if (fromQuery) return fromQuery.trim().toUpperCase();
  const match = window.location.pathname.match(/\/squads\/join\/([^/?#]+)/i);
  if (match) return decodeURIComponent(match[1]).trim().toUpperCase();
  return null;
}
const VIEW_TITLES = {
  overview: 'Analytics Dashboard',
  problems: 'All Problems',
  revise:   'Revision Schedule',
  signin:   'Sign In',
  profile:  'Profile',
  striver:  'A2Z Striver Sheet',
  plan:     'Personal Goals',
  analytics: 'Analytics',
  github:   'GitHub Sync',
  developers: 'Developers',
  extension: 'Extension',
  squads: 'Squads'
};

const DESKTOP_ONLY_VIEWS = [];

function isMobileViewport() {
  return window.matchMedia('(max-width: 1023px)').matches;
}

function isAuthCallbackUrl() {
  const { search, hash } = window.location;
  return /[?&](apiKey|authType|code|state)=/.test(search)
    || /(?:^|[?#&])(apiKey|authType)=/.test(hash);
}

function switchView(viewId) {
  if (DESKTOP_ONLY_VIEWS.includes(viewId) && isMobileViewport()) {
    viewId = 'overview';
  }
  if (currentView === viewId) {
    closeSidebar();
    if (viewId === 'extension' && window.LeetLensExtension) {
      window.LeetLensExtension.render();
    }
    if (viewId === 'squads' && window.LeetLensSquads) {
      const joinCode = window.LeetLensSquadsJoin?.readStoredJoinCode?.()
        || sessionStorage.getItem('squadsJoinCode')
        || getJoinCodeFromUrl();
      if (joinCode || window.LeetLensSquadsJoin?.hasPendingJoin?.()) {
        const code = joinCode || window.LeetLensSquadsJoin?.readStoredJoinCode?.();
        if (code) window.LeetLensSquadsJoin?.markPendingAutoJoin?.(code);
        window.LeetLensSquads.render('squads', code
          ? { code, tab: 'join', autoJoin: true }
          : undefined);
      }
    }
    return;
  }
  currentView = viewId;
  closeSidebar();

  // Hide all panels
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));

  // Show target panel
  const panel = document.getElementById(`view-${viewId}`);
  if (panel) panel.classList.add('active');

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewId);
  });

  // Update top bar title
  const titleEl = document.getElementById('topBarTitle');
  if (titleEl) titleEl.textContent = VIEW_TITLES[viewId] || 'Dashboard';

  // Update hash without reload — keep Firebase OAuth query params until auth boot finishes
  if (history.replaceState) {
    const preserveSearch = isAuthCallbackUrl() ? window.location.search : '';
    history.replaceState(null, '', `${window.location.pathname}${preserveSearch}#${viewId}`);
  }

  // If switching to revise, render revision view with latest data
  if (viewId === 'revise') {
    revScheduleMap = buildRevSchedule(allRecords);
    renderRevStats();
    renderRevTodayPanel();
    renderRevCalendar();
  }
  if (viewId === 'striver' && window.LeetLensStriver) {
    window.LeetLensStriver.render();
  }
  if (viewId === 'plan' && window.LeetLensPlan) {
    window.LeetLensPlan.render();
  }
  if (viewId === 'analytics' && window.LeetLensAnalytics) {
    window.LeetLensAnalytics.render();
  }
  if (viewId === 'github' && window.LeetLensGitHub) {
    window.LeetLensGitHub.render(window.LeetLensCloud?.getCloudState() || {});
  }
  if (viewId === 'developers' && window.LeetLensDevelopers) {
    window.LeetLensDevelopers.render();
  }
  if (viewId === 'extension' && window.LeetLensExtension) {
    window.LeetLensExtension.render();
  }
  if (viewId === 'squads') {
    if (window.LeetLensSquads) {
      const joinCode = window.LeetLensSquadsJoin?.readStoredJoinCode?.()
        || sessionStorage.getItem('squadsJoinCode')
        || getJoinCodeFromUrl();
      const params = joinCode
        ? { code: joinCode, tab: 'join', autoJoin: true }
        : undefined;
      if (joinCode) window.LeetLensSquadsJoin?.markPendingAutoJoin?.(joinCode);
      window.LeetLensSquads.render('squads', params);
    }
  } else if (window.LeetLensSquads?.stopPolling) {
    window.LeetLensSquads.stopPolling();
  }
  if (viewId === 'problems') {
    loadMergedRecords().then(() => renderProblems());
  }
  if (viewId === 'signin' && window.LeetLensCloudUI) {
    window.LeetLensCloudUI.renderAll(window.LeetLensCloud?.getCloudState() || {});
  }
  if (viewId === 'profile' && window.LeetLensCloudUI) {
    window.LeetLensCloudUI.renderAll(window.LeetLensCloud?.getCloudState() || {});
  }
  if (viewId === 'overview') {
    const cloudState = window.LeetLensCloud?.getCloudState() || {};
    if (window.LeetLensCloudUI) {
      window.LeetLensCloudUI.renderAuthPanel?.(cloudState);
      window.LeetLensCloudUI.updateNavAndHeader?.(cloudState);
      window.LeetLensCloudUI.renderSyncHub(cloudState);
    }
    if (window.LeetLensAnalytics) window.LeetLensAnalytics.renderRecentActivity();
    if (window.LeetLensStriver) window.LeetLensStriver.renderOverviewWidget();
    if (window.LeetLensPlan) window.LeetLensPlan.renderOverviewWidget();
    refreshHeatmap();
  }
}

function refreshHeatmap() {
  if (window.LeetLensHeatmap) {
    window.LeetLensHeatmap.render(
      window.LeetLensCloud?.getCloudState() || {},
      allRecords
    );
  }
}

// Expose for cloud UI navigation
window.switchView = switchView;

window.LeetLensDashboard = {
  async reloadProblems() {
    await loadMergedRecords();
    renderProblems();
    updateStats();
  },
  refreshHeatmap
};

function openSidebar() {
  document.getElementById('sidebarNav')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.add('open');
  document.body.classList.add('sidebar-open');
}

function closeSidebar() {
  document.getElementById('sidebarNav')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
  document.body.classList.remove('sidebar-open');
}

function mergeProblemRecord(mergedRecords, slug, incoming) {
  if (!mergedRecords[slug]) {
    mergedRecords[slug] = { ...incoming, slug };
    return;
  }
  const rec = mergedRecords[slug];
  rec.solved = rec.solved || incoming.solved;
  if (incoming.title && (!rec.title || rec.title === rec.slug)) rec.title = incoming.title;
  if (incoming.difficulty && incoming.difficulty !== 'Unknown' && rec.difficulty === 'Unknown') {
    rec.difficulty = incoming.difficulty;
  }
  if (incoming.totalMs > (rec.totalMs || 0)) rec.totalMs = incoming.totalMs;
  if (incoming.stars > (rec.stars || 0)) rec.stars = incoming.stars;
  if (incoming.source === 'tracked' && incoming.bookmarked != null) rec.bookmarked = incoming.bookmarked;
  if (incoming.solvedAt && (!rec.solvedAt || incoming.solvedAt > rec.solvedAt)) rec.solvedAt = incoming.solvedAt;
  rec.lastSeen = Math.max(rec.lastSeen || 0, incoming.lastSeen || 0);
  if (incoming.source === 'tracked' && rec.source === 'leetcode') rec.source = 'both';
  else if (!rec.source) rec.source = incoming.source;
}

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

  // Update active coding streak
  const streak = getStreak(allRecords);
  const streakTextEl = document.getElementById('streakText');
  if (streakTextEl) {
    streakTextEl.textContent = `${streak} Day${streak === 1 ? '' : 's'}`;
  }
}

// ── calculate streak ────────────────────────────────────────────────────────
function getStreak(records) {
  const dates = Object.values(records)
    .map(r => new Date(r.lastSeen).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i); // unique dates

  if (dates.length === 0) return 0;

  const dateObjects = dates.map(d => new Date(d));
  // sort descending (most recent date first)
  dateObjects.sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the most recent active date is today or yesterday
  const currentCheck = dateObjects[0];
  const diffFromToday = Math.round((today - currentCheck) / (1000 * 60 * 60 * 24));

  if (diffFromToday > 1) {
    // Coding streak is broken (most recent activity is older than yesterday)
    return 0;
  }

  streak = 1;
  for (let i = 0; i < dateObjects.length - 1; i++) {
    const diff = Math.round((dateObjects[i] - dateObjects[i + 1]) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
  }
  return streak;
}

// ── update charts ──────────────────────────────────────────────────────────
function updateCharts() {
  // 1. Donut Chart
  const stats = {
    easy: 0,
    medium: 0,
    hard: 0
  };

  Object.values(allRecords).forEach(record => {
    if (record.solved) {
      const diff = (record.difficulty || 'Easy').toLowerCase();
      if (stats[diff] !== undefined) {
        stats[diff]++;
      }
    }
  });

  const totalSolved = stats.easy + stats.medium + stats.hard;
  const chartTotalCountEl = document.getElementById('chartTotalCount');
  if (chartTotalCountEl) chartTotalCountEl.textContent = totalSolved;

  const legEasy = document.getElementById('legendEasyVal');
  const legMed = document.getElementById('legendMediumVal');
  const legHard = document.getElementById('legendHardVal');
  if (legEasy) legEasy.textContent = stats.easy;
  if (legMed) legMed.textContent = stats.medium;
  if (legHard) legHard.textContent = stats.hard;

  const circleEasy = document.querySelector('.segment-easy');
  const circleMedium = document.querySelector('.segment-medium');
  const circleHard = document.querySelector('.segment-hard');

  if (circleEasy && circleMedium && circleHard) {
    const C = 251.3; // Circumference for r=40
    if (totalSolved === 0) {
      circleEasy.style.strokeDasharray = `0 ${C}`;
      circleMedium.style.strokeDasharray = `0 ${C}`;
      circleHard.style.strokeDasharray = `0 ${C}`;
    } else {
      const pEasy = stats.easy / totalSolved;
      const pMedium = stats.medium / totalSolved;
      const pHard = stats.hard / totalSolved;

      const lEasy = pEasy * C;
      const lMedium = pMedium * C;
      const lHard = pHard * C;

      circleEasy.style.strokeDasharray = `${lEasy} ${C - lEasy}`;
      circleEasy.style.strokeDashoffset = `0`;

      circleMedium.style.strokeDasharray = `${lMedium} ${C - lMedium}`;
      circleMedium.style.strokeDashoffset = `-${lEasy}`;

      circleHard.style.strokeDasharray = `${lHard} ${C - lHard}`;
      circleHard.style.strokeDashoffset = `-${lEasy + lMedium}`;
    }
  }

  // 2. Top 5 Most Practiced Problems Chart
  const topProblemsContent = document.getElementById('topProblemsChart');
  if (topProblemsContent) {
    const sortedByTime = Object.values(allRecords)
      .sort((a, b) => (b.totalMs || 0) - (a.totalMs || 0))
      .slice(0, 5);

    if (sortedByTime.length === 0) {
      topProblemsContent.innerHTML = `
        <div class="empty-state" style="padding: 20px;">
          <div class="empty-state-icon">📊</div>
          <p>No data available yet.</p>
        </div>
      `;
      return;
    }

    const maxTime = sortedByTime[0].totalMs || 1;

    let html = '<div class="bar-chart-container">';
    sortedByTime.forEach(record => {
      const percentage = ((record.totalMs || 0) / maxTime) * 100;
      const formattedTime = formatTime(record.totalMs || 0);
      const difficulty = (record.difficulty || 'Easy').toLowerCase();

      html += `
        <div class="bar-row">
          <div class="bar-info">
            <span class="bar-problem-title" title="${record.title || record.slug}">${record.title || record.slug}</span>
            <span class="bar-problem-time">${formattedTime}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill ${difficulty}" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    topProblemsContent.innerHTML = html;
  }
}

// ── merge local + LeetCode cloud solved ─────────────────────────────────────
async function loadMergedRecords() {
  const loadId = ++mergeLoadId;
  mergeInFlight = true;
  try {
    const next = {};

    Object.entries(allRecords).forEach(([slug, rec]) => {
      mergeProblemRecord(next, slug, {
        ...rec,
        source: 'tracked',
        solved: !!rec.solved,
        bookmarked: !!rec.bookmarked
      });
    });

    const cloud = window.LeetLensCloud;
    const state = cloud?.getCloudState();

    if (state?.user) {
      try {
        const data = await cloud.fetchAnalyticsData();
        (data?.solved || []).forEach(p => {
          const slug = String(p.problemId || '').toLowerCase();
          if (!slug) return;
          mergeProblemRecord(next, slug, {
            slug,
            title: p.title || slug,
            difficulty: p.difficulty || 'Unknown',
            solved: true,
            stars: p.userDifficultyRating || 0,
            totalMs: (p.timeSpentMinutes || 0) * 60000,
            source: 'leetcode',
            solvedAt: p.solvedAt,
            lastSeen: p.solvedAt || Date.now()
          });
        });
      } catch (_) {}

      if (state.profile?.leetcodeUsername) {
        try {
          const live = await cloud.fetchLiveLeetCodeProblems();
          live.forEach(p => {
            const slug = String(p.problemId || '').toLowerCase();
            if (!slug) return;
            mergeProblemRecord(next, slug, {
              slug,
              title: p.title || slug,
              difficulty: p.difficulty || 'Unknown',
              solved: true,
              stars: 0,
              totalMs: 0,
              source: 'leetcode',
              solvedAt: p.solvedAt,
              lastSeen: p.solvedAt || Date.now()
            });
          });
        } catch (_) {}
      }
    }

    if (loadId !== mergeLoadId) return mergedRecords;

    Object.values(next).forEach(r => {
      if (!r.source) r.source = r.totalMs ? 'tracked' : 'leetcode';
      if (r.source === 'leetcode' || r.source === 'both') r.solved = true;
    });
    mergedRecords = next;
    recordsLoaded = true;
    return mergedRecords;
  } finally {
    if (loadId === mergeLoadId) mergeInFlight = false;
  }
}

function getProblemsSource() {
  return recordsLoaded ? mergedRecords : allRecords;
}

// ── filter & render table ──────────────────────────────────────────────────
function shouldShowRecord(record) {
  if (currentFilter === 'all') return true;
  if (currentFilter === 'solved') return record.solved;
  if (currentFilter === 'pending') return !record.solved;
  if (currentFilter === 'easy') return record.difficulty === 'Easy';
  if (currentFilter === 'medium') return record.difficulty === 'Medium';
  if (currentFilter === 'hard') return record.difficulty === 'Hard';
  if (currentFilter === 'tracked') return record.source === 'tracked' || record.source === 'both';
  if (currentFilter === 'leetcode') return record.source === 'leetcode' || record.source === 'both';
  if (currentFilter === 'bookmarked') return !!record.bookmarked;
  if (currentFilter === 'star-0') return !record.stars;
  if (currentFilter.startsWith('star-')) {
    const n = parseInt(currentFilter.replace('star-', ''), 10);
    return (record.stars || 0) === n;
  }
  return true;
}

function syncProblemsFilterSelect() {
  const sel = document.getElementById('problemsFilter');
  if (sel && sel.value !== currentFilter) sel.value = currentFilter;
}

function renderProblems() {
  const contentDiv = document.getElementById('problemsContent');
  if (!contentDiv) return;

  syncProblemsFilterSelect();

  const countEl = document.getElementById('problemsCount');
  const showInitialLoading = mergeInFlight && !recordsLoaded;
  if (showInitialLoading) {
    if (countEl) countEl.textContent = '…';
    contentDiv.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-12 text-on-surface-variant/40">
          <span class="material-symbols-outlined text-3xl problems-loading-spin">progress_activity</span>
          <p class="text-sm mt-3">Loading problems…</p>
        </td>
      </tr>
    `;
    return;
  }
  
  // Filter by status/difficulty
  let problems = Object.values(getProblemsSource()).filter(shouldShowRecord);
  
  // Filter by search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    problems = problems.filter(r => 
      (r.title && r.title.toLowerCase().includes(q)) || 
      (r.slug && r.slug.toLowerCase().includes(q)) ||
      (r.difficulty && r.difficulty.toLowerCase().includes(q))
    );
  }

  // Sort
  problems.sort((a, b) => {
    let valA, valB;
    if (currentSortField === 'title') {
      valA = (a.title || a.slug || '').toLowerCase();
      valB = (b.title || b.slug || '').toLowerCase();
    } else if (currentSortField === 'solved') {
      valA = a.solved ? 1 : 0;
      valB = b.solved ? 1 : 0;
    } else if (currentSortField === 'difficulty') {
      const diffOrder = { easy: 1, medium: 2, hard: 3, unknown: 4 };
      valA = diffOrder[(a.difficulty || 'Easy').toLowerCase()] || 4;
      valB = diffOrder[(b.difficulty || 'Easy').toLowerCase()] || 4;
    } else if (currentSortField === 'totalMs') {
      valA = a.totalMs || 0;
      valB = b.totalMs || 0;
    } else if (currentSortField === 'stars') {
      valA = a.stars || 0;
      valB = b.stars || 0;
    } else { // default 'lastSeen'
      valA = a.lastSeen || 0;
      valB = b.lastSeen || 0;
    }

    if (valA < valB) return currentSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return currentSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  document.getElementById('problemsCount').textContent = mergeInFlight
    ? `${problems.length} · syncing…`
    : String(problems.length);

  if (problems.length === 0) {
    contentDiv.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-12 text-on-surface-variant/40">
          <span class="material-symbols-outlined text-3xl">search_off</span>
          <p class="text-sm mt-3">No matching problems found.</p>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  problems.forEach((record, idx) => {
    const statusClass = record.solved ? 'status-solved' : 'status-pending';
    const statusText = record.solved ? '✓ Solved' : '◇ Pending';
    const diffClass = `difficulty-${record.difficulty || 'Easy'}`;
    
    // Star HTML
    let starsHtml = `<div class="problem-stars-interactive" data-slug="${record.slug}">`;
    for (let i = 1; i <= 5; i++) {
      const isLit = i <= (record.stars || 0) ? 'lit' : 'dim';
      starsHtml += `<span class="table-star ${isLit}" data-val="${i}">★</span>`;
    }
    starsHtml += '</div>';

    const sourceBadge = record.source === 'both'
      ? '<span class="problem-src-badge both" title="LeetCode + LeetLens">LC+</span>'
      : record.source === 'leetcode'
        ? '<span class="problem-src-badge lc" title="Solved on LeetCode">LC</span>'
        : record.totalMs
          ? '<span class="problem-src-badge tracked" title="Tracked in LeetLens">⏱</span>'
          : '';

    html += `
      <tr>
        <td class="problem-num font-semibold text-on-surface-variant/60">${idx + 1}</td>
        <td>
          <div class="flex items-center gap-1">
            <button type="button" class="problem-bookmark-btn ${record.bookmarked ? 'active' : ''}" data-slug="${record.slug}" title="${record.bookmarked ? 'Remove bookmark' : 'Bookmark'}">
              <span class="material-symbols-outlined">${record.bookmarked ? 'bookmark' : 'bookmark_border'}</span>
            </button>
            <a href="https://leetcode.com/problems/${record.slug}/" target="_blank" class="table-problem-link">
              ${record.title || record.slug}
            </a>
            ${sourceBadge}
          </div>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </td>
        <td>
          <span class="difficulty-badge ${diffClass}">${record.difficulty || 'Easy'}</span>
        </td>
        <td class="problem-time">${formatTime(record.totalMs || 0)}</td>
        <td>
          ${starsHtml}
        </td>
        <td>
          <div class="flex items-center gap-2">
            <button class="action-btn ${record.solved ? 'solved' : ''}" 
                    data-slug="${record.slug}" 
                    data-solved="${!record.solved}">
              ${record.solved ? '✓ Solved' : 'Mark Solved'}
            </button>
            <button class="btn-delete-row" title="Delete record" data-slug="${record.slug}">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  contentDiv.innerHTML = html;

  // Programmatic event listeners for table interactivity
  contentDiv.querySelectorAll('.problem-bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleBookmarkTable(btn.dataset.slug);
    });
  });

  contentDiv.querySelectorAll('.table-star').forEach(star => {
    star.addEventListener('click', (e) => {
      const parent = e.target.parentElement;
      const slug = parent.dataset.slug;
      const val = parseInt(e.target.dataset.val, 10);
      setStarsTable(slug, val);
    });
  });

  contentDiv.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const slug = e.currentTarget.dataset.slug;
      const solved = e.currentTarget.dataset.solved === 'true';
      toggleSolved(slug, solved);
    });
  });

  contentDiv.querySelectorAll('.btn-delete-row').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const slug = e.currentTarget.dataset.slug;
      deleteProblemTable(slug);
    });
  });

  updateSortIcons();
}

// ── toggle solved status ────────────────────────────────────────────────────
function toggleSolved(slug, solved) {
  // Optimistic update: reflect change immediately in UI
  if (allRecords[slug]) {
    allRecords[slug].solved = solved;
    allRecords[slug].solvedAt = solved ? Date.now() : null;
    renderProblems();
    updateStats();
    updateCharts();
  }
  // Then sync with background
  const msgType = solved ? 'MARK_SOLVED' : 'MARK_PENDING';
  chrome.runtime.sendMessage({ type: msgType, slug }, () => {
    loadData(); // final sync to confirm persisted state
  });
}

function toggleBookmarkTable(slug) {
  const next = !allRecords[slug]?.bookmarked;
  if (allRecords[slug]) {
    allRecords[slug].bookmarked = next;
    renderProblems();
  }
  chrome.runtime.sendMessage({ type: 'TOGGLE_BOOKMARK', slug, bookmarked: next }, () => {
    loadData();
  });
}

function setStarsTable(slug, stars) {
  // Optimistic update: reflect star change immediately
  if (allRecords[slug]) {
    allRecords[slug].stars = stars;
    renderProblems();
  }
  chrome.runtime.sendMessage({ type: 'SET_STARS', slug, stars }, () => {
    loadData();
  });
}

function deleteProblemTable(slug) {
  if (confirm(`Are you sure you want to delete the record for "${slug}"?`)) {
    // Optimistic update: remove row immediately
    delete allRecords[slug];
    renderProblems();
    updateStats();
    updateCharts();
    chrome.runtime.sendMessage({ type: 'DELETE_RECORD', slug }, () => {
      loadData();
    });
  }
}

function updateSortIcons() {
  document.querySelectorAll('.sortable-header').forEach(header => {
    const field = header.dataset.sort;
    const iconEl = header.querySelector('.sort-icon');
    if (!iconEl) return;

    if (currentSortField === field) {
      iconEl.innerHTML = currentSortDirection === 'asc' ? ' ▲' : ' ▼';
      iconEl.style.opacity = '1';
      iconEl.classList.add('text-primary');
    } else {
      iconEl.innerHTML = ' ↕';
      iconEl.style.opacity = '0.4';
      iconEl.classList.remove('text-primary');
    }
  });
}

// ── load data from background ──────────────────────────────────────────────
async function loadData() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: 'GET_DATA' }, response => {
      if (response && response.records) {
        allRecords = response.records;
        updateStats();
        updateCharts();
        if (currentView === 'problems') {
          loadMergedRecords().then(() => renderProblems());
        } else {
          renderProblems();
        }
        if (currentView === 'overview') refreshHeatmap();
        // If revise view is active, also refresh it
        if (currentView === 'revise') {
          revScheduleMap = buildRevSchedule(allRecords);
          renderRevStats();
          renderRevTodayPanel();
          renderRevCalendar();
        }
      }
      resolve();
    });
  });
}

// ══════════════════════════════════════════════════════════════════
// ── REVISION VIEW LOGIC (ported from revision.js) ─────────────────
// ══════════════════════════════════════════════════════════════════

const REV_OFFSETS = [2, 7, 14, 21];
const REV_LABELS  = ['R1', 'R2', 'R3', 'R4'];
const REV_DIFF_COLORS = {
  Easy:    { bg: 'rgba(0,165,114,0.12)',   text: '#00a572', border: 'rgba(0,165,114,0.25)' },
  Medium:  { bg: 'rgba(251,163,21,0.12)',  text: '#fba315', border: 'rgba(251,163,21,0.25)' },
  Hard:    { bg: 'rgba(255,180,171,0.12)', text: '#ffb4ab', border: 'rgba(255,180,171,0.25)' },
  Unknown: { bg: 'rgba(139,148,158,0.12)', text: '#8b949e', border: 'rgba(139,148,158,0.25)' },
};

let revViewYear  = new Date().getFullYear();
let revViewMonth = new Date().getMonth();
let revScheduleMap = {};

function revToDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function revTodayKey() { return revToDateKey(new Date()); }
function revAddDays(ts, days) {
  const d = new Date(ts);
  d.setDate(d.getDate() + days);
  return d;
}
function revFmtDate(date) {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
function revFmtTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
function revDaysBetween(dateA, dateB) {
  return Math.round((dateA - dateB) / (1000 * 60 * 60 * 24));
}

function buildRevSchedule(records) {
  const map = {};
  Object.values(records).forEach(rec => {
    if (!rec.solved || !rec.solvedAt) return;
    REV_OFFSETS.forEach((offset, i) => {
      const revDate = revAddDays(rec.solvedAt, offset);
      const key     = revToDateKey(revDate);
      if (!map[key]) map[key] = [];
      map[key].push({
        slug:       rec.slug,
        title:      rec.title || rec.slug,
        difficulty: rec.difficulty || 'Unknown',
        revision:   REV_LABELS[i],
        revDate,
        solvedAt:   rec.solvedAt,
        offset,
      });
    });
  });
  return map;
}

function renderRevStats() {
  const tk    = revTodayKey();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let total = 0, overdue = 0, todayC = 0, upcoming = 0;

  Object.entries(revScheduleMap).forEach(([key, items]) => {
    const d = new Date(key + 'T00:00:00');
    total += items.length;
    if (key === tk)     todayC  += items.length;
    else if (d < today) overdue += items.length;
    else                upcoming += items.length;
  });

  const el = (id) => document.getElementById(id);
  if (el('revStatTotal'))    el('revStatTotal').textContent    = total;
  if (el('revStatOverdue'))  el('revStatOverdue').textContent  = overdue;
  if (el('revStatToday'))    el('revStatToday').textContent    = todayC;
  if (el('revStatUpcoming')) el('revStatUpcoming').textContent = upcoming;
}

function renderRevTodayPanel() {
  const container = document.getElementById('revTodayPanel');
  if (!container) return;

  const tk    = revTodayKey();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const overdue  = [];
  const dueToday = revScheduleMap[tk] || [];

  Object.entries(revScheduleMap).forEach(([key, items]) => {
    const d = new Date(key + 'T00:00:00');
    if (d < today) overdue.push(...items);
  });

  if (overdue.length === 0 && dueToday.length === 0) {
    container.innerHTML = `<div class="rev-no-urgent"><span class="rev-icon-lg">🎉</span><p>No revisions due today. Keep it up!</p></div>`;
    return;
  }

  let html = '';
  if (overdue.length > 0) {
    html += `<div class="rev-urgent-group-title rev-overdue-title">⚠ Overdue</div>`;
    overdue.forEach(item => {
      const daysLate = revDaysBetween(today, new Date(revToDateKey(item.revDate) + 'T00:00:00'));
      const dc = REV_DIFF_COLORS[item.difficulty] || REV_DIFF_COLORS.Unknown;
      html += revUrgentCard(item, dc, `${Math.abs(daysLate)} day${Math.abs(daysLate) !== 1 ? 's' : ''} overdue`, 'overdue');
    });
  }
  if (dueToday.length > 0) {
    html += `<div class="rev-urgent-group-title rev-today-title">📅 Due Today</div>`;
    dueToday.forEach(item => {
      const dc = REV_DIFF_COLORS[item.difficulty] || REV_DIFF_COLORS.Unknown;
      html += revUrgentCard(item, dc, 'Due today', 'due-today');
    });
  }
  container.innerHTML = html;
}

function revUrgentCard(item, dc, label, cls) {
  const solvedDate = revFmtDate(new Date(item.solvedAt));
  const solvedTime = revFmtTime(new Date(item.solvedAt));
  return `<a href="https://leetcode.com/problems/${item.slug}/" target="_blank" class="rev-urgent-card ${cls}">
    <div class="rev-urgent-card-top">
      <span class="revision-pill" style="background:${dc.bg};color:${dc.text};border:1px solid ${dc.border}">${item.revision}</span>
      <span class="diff-pill" style="background:${dc.bg};color:${dc.text};border:1px solid ${dc.border}">${item.difficulty}</span>
      <span class="rev-urgent-label">${label}</span>
    </div>
    <div class="rev-urgent-card-title">${item.title}</div>
    <div class="rev-urgent-card-meta">Solved ${solvedDate} at ${solvedTime} · +${item.offset} days</div>
  </a>`;
}

const REV_MONTH_NAMES = ['January','February','March','April','May','June',
                         'July','August','September','October','November','December'];

function renderRevCalendar() {
  const monthLabel = document.getElementById('revCalMonthLabel');
  if (!monthLabel) return;
  monthLabel.textContent = `${REV_MONTH_NAMES[revViewMonth]} ${revViewYear}`;

  const today  = new Date(); today.setHours(0, 0, 0, 0);
  const todayK = revTodayKey();

  const firstDay    = new Date(revViewYear, revViewMonth, 1).getDay();
  const daysInMonth = new Date(revViewYear, revViewMonth + 1, 0).getDate();

  const grid = document.getElementById('revCalGrid');
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'rev-cal-cell empty';
    grid.appendChild(blank);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(revViewYear, revViewMonth, d);
    const key      = revToDateKey(cellDate);
    const items    = revScheduleMap[key] || [];
    const isToday  = key === todayK;
    const isPast   = cellDate < today && !isToday;
    const hasItems = items.length > 0;

    const cell = document.createElement('div');
    cell.className = 'rev-cal-cell';
    if (isToday)                cell.classList.add('cal-today');
    else if (isPast && hasItems) cell.classList.add('cal-past-event');
    else if (hasItems)           cell.classList.add('cal-future-event');
    else if (isPast)             cell.classList.add('cal-past');

    cell.dataset.dateKey = key;

    const dayNum = document.createElement('span');
    dayNum.className = 'rev-cal-day-num';
    dayNum.textContent = d;
    cell.appendChild(dayNum);

    if (hasItems) {
      const dotsRow = document.createElement('div');
      dotsRow.className = 'rev-cal-dots';
      const seen = {};
      items.forEach(it => { seen[it.revision] = it; });
      Object.values(seen).forEach(it => {
        const dc  = REV_DIFF_COLORS[it.difficulty] || REV_DIFF_COLORS.Unknown;
        const dot = document.createElement('span');
        dot.className = 'rev-cal-dot';
        dot.style.background = dc.text;
        dotsRow.appendChild(dot);
      });
      cell.appendChild(dotsRow);

      const badge = document.createElement('span');
      badge.className = 'rev-cal-item-count';
      badge.textContent = `${items.length} problem${items.length !== 1 ? 's' : ''}`;
      cell.appendChild(badge);
    }

    grid.appendChild(cell);
  }
}

function openRevDayModal(key) {
  const items = revScheduleMap[key];
  if (!items || items.length === 0) return;

  const cellDate = new Date(key + 'T00:00:00');
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const daysAway = revDaysBetween(cellDate, today);

  const dayName = cellDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = cellDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  let relLabel;
  if (daysAway === 0)    relLabel = 'Today';
  else if (daysAway > 0) relLabel = `In ${daysAway} day${daysAway !== 1 ? 's' : ''}`;
  else                   relLabel = `${Math.abs(daysAway)} day${Math.abs(daysAway) !== 1 ? 's' : ''} ago`;

  document.getElementById('revModalDateMain').textContent = `${dayName}, ${dateStr}`;
  document.getElementById('revModalDateSub').textContent  =
    `${items.length} revision${items.length !== 1 ? 's' : ''} · ${relLabel}`;

  const body = document.getElementById('revModalBody');
  body.innerHTML = '';

  items.forEach(item => {
    const dc   = REV_DIFF_COLORS[item.difficulty] || REV_DIFF_COLORS.Unknown;
    const card = document.createElement('a');
    card.href   = `https://leetcode.com/problems/${item.slug}/`;
    card.target = '_blank';
    card.className = 'rev-modal-card';

    card.innerHTML = `
      <div class="rev-modal-card-header">
        <span class="revision-pill" style="background:${dc.bg};color:${dc.text};border:1px solid ${dc.border}">${item.revision}</span>
        <span class="diff-pill"     style="background:${dc.bg};color:${dc.text};border:1px solid ${dc.border}">${item.difficulty}</span>
      </div>
      <div class="rev-modal-card-title">${item.title}</div>
      <div class="rev-modal-card-meta">
        <span><span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle">check_circle</span>&nbsp;Solved ${revFmtDate(new Date(item.solvedAt))} at ${revFmtTime(new Date(item.solvedAt))}</span>
        <span><span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle">schedule</span>&nbsp;+${item.offset}-day interval</span>
      </div>
      <div class="rev-modal-card-open">
        <span class="material-symbols-outlined" style="font-size:13px">open_in_new</span>
        Open on LeetCode
      </div>`;

    body.appendChild(card);
  });

  document.getElementById('revDayModal').classList.add('open');
}

function closeRevModal() {
  document.getElementById('revDayModal').classList.remove('open');
}

// ── event listeners ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile sidebar drawer ──
  document.getElementById('btnMobileMenu')?.addEventListener('click', openSidebar);
  document.getElementById('btnSidebarClose')?.addEventListener('click', closeSidebar);
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeSidebar();
  });

  // ── Nav view switching ──
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
    });
  });

  // Mobile nav uses same handler (already covered by .nav-item[data-view])

  // Filter dropdown
  const filterSelect = document.getElementById('problemsFilter');
  if (filterSelect) {
    filterSelect.value = currentFilter;
    filterSelect.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      renderProblems();
    });
  }

  // Search input listener
  const searchInput = document.getElementById('searchProblems');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProblems();
    });
  }

  // Sortable headers listener
  document.querySelectorAll('.sortable-header').forEach(header => {
    header.addEventListener('click', () => {
      const field = header.dataset.sort;
      if (currentSortField === field) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortField = field;
        currentSortDirection = 'asc';
      }
      renderProblems();
    });
  });

  // Clear all buttons (desktop & mobile)
  const clearHandler = () => {
    if (confirm('Are you sure? This will delete all tracked data.')) {
      chrome.runtime.sendMessage({ type: 'CLEAR_ALL' }, () => {
        allRecords = {};
        updateStats();
        updateCharts();
        renderProblems();
        if (currentView === 'revise') {
          revScheduleMap = {};
          renderRevStats();
          renderRevTodayPanel();
          renderRevCalendar();
        }
      });
    }
  };

  const btnClearAll = document.getElementById('btnClearAll');
  if (btnClearAll) btnClearAll.addEventListener('click', clearHandler);

  const btnClearAllMobile = document.getElementById('btnClearAllMobile');
  if (btnClearAllMobile) btnClearAllMobile.addEventListener('click', clearHandler);

  // Export Data button
  const btnExportData = document.getElementById('btnExportData');
  if (btnExportData) {
    btnExportData.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, response => {
        const records = response?.records || {};
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "leettrack_backup.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      });
    });
  }

  // ── Revision calendar controls ──
  const revBtnPrev = document.getElementById('revBtnPrevMonth');
  if (revBtnPrev) {
    revBtnPrev.addEventListener('click', () => {
      revViewMonth--;
      if (revViewMonth < 0) { revViewMonth = 11; revViewYear--; }
      renderRevCalendar();
    });
  }
  const revBtnNext = document.getElementById('revBtnNextMonth');
  if (revBtnNext) {
    revBtnNext.addEventListener('click', () => {
      revViewMonth++;
      if (revViewMonth > 11) { revViewMonth = 0; revViewYear++; }
      renderRevCalendar();
    });
  }
  const revBtnToday = document.getElementById('revBtnToday');
  if (revBtnToday) {
    revBtnToday.addEventListener('click', () => {
      revViewYear  = new Date().getFullYear();
      revViewMonth = new Date().getMonth();
      renderRevCalendar();
    });
  }

  // Revision calendar click (event delegation)
  const revCalGrid = document.getElementById('revCalGrid');
  if (revCalGrid) {
    revCalGrid.addEventListener('click', e => {
      const cell = e.target.closest('.rev-cal-cell[data-date-key]');
      if (!cell) return;
      openRevDayModal(cell.dataset.dateKey);
    });
  }

  // Revision modal close
  const revDayModal = document.getElementById('revDayModal');
  if (revDayModal) {
    revDayModal.addEventListener('click', e => {
      if (e.target === revDayModal) closeRevModal();
    });
  }
  const revModalClose = document.getElementById('revModalClose');
  if (revModalClose) revModalClose.addEventListener('click', closeRevModal);

  // Escape key closes revision modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeRevModal();
      closeSidebar();
    }
  });

  // ── Hash-based initial view (wait for Google redirect auth if returning from OAuth) ──
  async function applyInitialView() {
    if (window.LeetLensCloud?.ensureAuthBoot) {
      try {
        await window.LeetLensCloud.ensureAuthBoot();
      } catch (_) {}
    }
    const joinCode = getJoinCodeFromUrl();
    if (joinCode) {
      window.LeetLensSquadsJoin?.markPendingAutoJoin?.(joinCode);
      await window.LeetLensSquadsJoin?.resumeJoinFlowWhenReady?.();
      return;
    }
    const hashView = window.location.hash.replace('#', '');
    const squadsLegacy = ['squads-create', 'squads-join', 'squads-active', 'squads-history', 'squads-detail', 'squads-results'];
    if (squadsLegacy.includes(hashView)) {
      switchView('squads');
    } else if (hashView && ['overview', 'problems', 'revise', 'signin', 'profile', 'striver', 'plan', 'analytics', 'github', 'developers', 'extension', 'squads'].includes(hashView)) {
      switchView(hashView);
    }
  }
  applyInitialView();
  setTimeout(() => window.LeetLensSquadsAnnouncement?.maybeShow(), 800);

  // Initial load
  loadData();

  // Cloud sync listeners (extension only — web shim provides no-op onMessage)
  if (chrome.runtime?.onMessage?.addListener) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'CLOUD_MARK_SOLVED' && window.LeetLensCloud?.getCloudState()?.user) {
        window.LeetLensCloud.onProblemSolved(msg.record);
        if (window.LeetLensStriver) window.LeetLensStriver.renderOverviewWidget();
        if (window.LeetLensPlan) window.LeetLensPlan.renderOverviewWidget();
      }
      if (msg.type === 'SAVE_ACTIVITY' && window.LeetLensCloud?.getCloudState()?.user) {
        window.LeetLensCloud.saveProblemActivity(msg.activity);
      }
    });
  }

  // Listen for updates from background
  if (chrome.runtime?.onMessage?.addListener) chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'DASHBOARD_UPDATE') {
      allRecords = msg.records;
      updateStats();
      updateCharts();
      if (currentView === 'problems') {
        loadMergedRecords().then(() => renderProblems());
      } else {
        renderProblems();
      }
      if (currentView === 'revise') {
        revScheduleMap = buildRevSchedule(allRecords);
        renderRevStats();
        renderRevTodayPanel();
        renderRevCalendar();
      }
      if (currentView === 'overview' && window.LeetLensAnalytics) {
        window.LeetLensAnalytics.renderRecentActivity();
      }
    }
  });

  // Refresh data every 2 seconds to catch updates
  setInterval(() => {
    loadData();
  }, 2000);

  // Refresh heatmap every 30s while on overview
  setInterval(() => {
    if (currentView === 'overview') refreshHeatmap();
  }, 30000);
});
