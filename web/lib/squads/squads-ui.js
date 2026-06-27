(function () {
  'use strict';

  const GOAL_PRESETS = [
    { type: 'total', label: 'Solve 10 problems', target: 10 },
    { type: 'total', label: 'Solve 20 problems', target: 20 },
    { type: 'easy', label: 'Solve 5 Easy', target: 5 },
    { type: 'medium', label: 'Solve 5 Medium', target: 5 },
    { type: 'hard', label: 'Solve 2 Hard', target: 2 }
  ];

  const TABS = [
    { id: 'create', label: 'Create', icon: 'add_circle' },
    { id: 'join', label: 'Join', icon: 'group_add' },
    { id: 'active', label: 'Active', icon: 'emoji_events' },
    { id: 'history', label: 'History', icon: 'history' }
  ];

  let pollTimer = null;
  let countdownTimer = null;
  let activePollTimer = null;
  let currentTab = 'create';
  let subView = null;
  let subViewId = null;
  let detailTab = 'leaderboard';
  let presetJoinCode = '';
  let detailCache = { squadId: null, squad: null, lb: null, fetchedAt: 0 };
  const DETAIL_CACHE_MS = 15000;

  function el(id) { return document.getElementById(id); }

  function escapeHtml(t) {
    return String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function mount() {
    return el('view-squads');
  }

  const DEFAULT_SITE_URL = 'https://leetlens.srminsider.in';

  function inviteBaseOrigin() {
    const configured = window.__LEETLENS_SITE_URL__;
    if (configured) return String(configured).replace(/\/$/, '');
    return DEFAULT_SITE_URL;
  }

  function inviteUrl(code) {
    return `${inviteBaseOrigin()}/squads/join/${String(code || '').trim().toUpperCase()}`;
  }

  function loadingSkeleton(lines = 3) {
    return `<div class="squads-loading">
      <span class="material-symbols-outlined squads-loading-icon">progress_activity</span>
      ${Array.from({ length: lines }, () => '<div class="squads-skeleton-line"></div>').join('')}
    </div>`;
  }

  function emptyState(icon, title, desc, actionHtml = '') {
    return `<div class="squads-empty">
      <span class="material-symbols-outlined squads-empty-icon">${icon}</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(desc)}</p>
      ${actionHtml}
    </div>`;
  }

  function showApiError(container, err) {
    const msg = err?.message || '';
    const isServer = err?.code === 'SERVER_ERROR' || /Firebase Admin|Service account|MONGODB|not configured|configuration mismatch/i.test(msg);
    const isAuth = !isServer && (
      err?.code === 'AUTH_EXPIRED' || err?.code === 'AUTH_REQUIRED'
      || /expired|sign in/i.test(msg)
    );
    if (isServer) {
      container.innerHTML = `<div class="squads-error-card">
        <span class="material-symbols-outlined">cloud_off</span>
        <div>
          <strong>Squads server unavailable</strong>
          <p class="text-sm mt-1">${escapeHtml(msg || 'Server configuration error')}</p>
          <p class="text-xs text-on-surface-variant mt-2">On Vercel set <code>FIREBASE_SERVICE_ACCOUNT_BASE64</code> (recommended) or minified <code>FIREBASE_SERVICE_ACCOUNT</code>. Remove <code>FIREBASE_SERVICE_ACCOUNT_PATH</code> — it does not work in production. Run <code>node scripts/print-service-account-env.js</code> locally to generate the value.</p>
        </div>
      </div>`;
      return;
    }
    if (isAuth) {
      container.innerHTML = `<div class="squads-error-card">
        <span class="material-symbols-outlined">lock_clock</span>
        <div>
          <strong>Session expired</strong>
          <p class="text-sm mt-1">Your sign-in token expired. Sign in again to use Squads.</p>
          <button type="button" class="squads-btn squads-btn-primary mt-3" id="squadsReSignIn">Sign In Again</button>
        </div>
      </div>`;
      el('squadsReSignIn')?.addEventListener('click', async () => {
        try { await window.LeetLensCloud?.logout?.(); } catch (_) {}
        window.switchView?.('signin');
      });
      return;
    }
    container.innerHTML = `<div class="squads-error-card"><span class="material-symbols-outlined">error</span>${escapeHtml(err?.message || 'Something went wrong')}</div>`;
  }

  function requireAuth(container) {
    const user = window.LeetLensCloud?.getCloudState()?.user;
    if (user) return true;
    container.innerHTML = `<div class="squads-page">
      <div class="squads-signin-prompt glass-panel rounded-xl">
        <span class="material-symbols-outlined text-4xl text-primary">groups</span>
        <h2 class="squads-title mt-3">Squads Competitions</h2>
        <p class="squads-sub mt-2">Sign in to create private coding squads, join friends, and compete on delta scores.</p>
        <button type="button" class="squads-btn squads-btn-primary mt-4" id="squadsGoSignIn">Sign In to Continue</button>
      </div>
    </div>`;
    el('squadsGoSignIn')?.addEventListener('click', () => window.switchView?.('signin'));
    return false;
  }

  function parseTs(v) {
    if (!v) return 0;
    if (typeof v === 'number') return v;
    if (v instanceof Date) return v.getTime();
    if (v._seconds) return v._seconds * 1000;
    if (v.seconds) return v.seconds * 1000;
    return Date.parse(v) || 0;
  }

  function formatDateTime(ts) {
    return new Date(parseTs(ts)).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  function formatSprintType(type) {
    const map = { daily: 'Daily Sprint', weekly: 'Weekly Sprint', monthly: 'Monthly Marathon', custom: 'Custom' };
    return map[type] || 'Custom';
  }

  function competitionDurationRule(squad) {
    const type = squad.competitionType || 'custom';
    if (type === 'daily') {
      return 'This is a <strong>Daily Sprint</strong> — the competition runs for <strong>24 hours</strong> starting at the scheduled start time.';
    }
    if (type === 'weekly') {
      return 'This is a <strong>Weekly Sprint</strong> — the competition runs for <strong>7 days</strong> starting at the scheduled start time.';
    }
    if (type === 'monthly') {
      return 'This is a <strong>Monthly Marathon</strong> — the competition runs for <strong>30 days</strong> starting at the scheduled start time.';
    }
    return 'This is a <strong>Custom</strong> competition with a fixed start and end window chosen by the host.';
  }

  function scoringRulesBlock(squad) {
    if (squad.scoringMode === 'total') {
      return `<ul class="squads-rules-list">
        <li><strong>Total Problems</strong> scoring — each new problem solved during the competition counts as <strong>1 point</strong>, regardless of difficulty.</li>
        <li>Easy, Medium, and Hard problems all contribute equally to your score.</li>
        <li>Rankings use total points first, then Hard solves, then Medium, then total problem count.</li>
        <li>If still tied, the player who reached that score <strong>earliest</strong> ranks higher (based on solve timestamps).</li>
      </ul>`;
    }
    return `<ul class="squads-rules-list">
      <li><strong>Weighted</strong> scoring — points depend on difficulty:</li>
      <li class="squads-rules-weights"><span>Easy</span><strong>×1</strong><span>Medium</span><strong>×3</strong><span>Hard</span><strong>×5</strong></li>
      <li>Example: 2 Easy + 1 Medium + 1 Hard = 2×1 + 1×3 + 1×5 = <strong>10 points</strong>.</li>
      <li>Rankings use total points first, then Hard solves, then Medium, then total problem count.</li>
      <li>If still tied, the player who reached that score <strong>earliest</strong> ranks higher (based on solve timestamps).</li>
    </ul>`;
  }

  function eligibilityRulesBlock(rules) {
    const r = rules || {};
    if (r.noRestrictions !== false && !r.minTotal && !r.minEasy && !r.minMedium && !r.minHard) {
      return '<p class="squads-rules-text">No minimum LeetCode solve requirements — any signed-in member can join this squad.</p>';
    }
    const lines = [];
    if (r.minTotal) lines.push(`At least <strong>${r.minTotal}</strong> total problems solved on LeetCode`);
    if (r.minEasy) lines.push(`At least <strong>${r.minEasy}</strong> Easy problems solved`);
    if (r.minMedium) lines.push(`At least <strong>${r.minMedium}</strong> Medium problems solved`);
    if (r.minHard) lines.push(`At least <strong>${r.minHard}</strong> Hard problems solved`);
    if (!lines.length) {
      return '<p class="squads-rules-text">No minimum LeetCode solve requirements — any signed-in member can join this squad.</p>';
    }
    return `<ul class="squads-rules-list">${lines.map(l => `<li>${l}</li>`).join('')}</ul>`;
  }

  function goalsRulesBlock(goals) {
    const list = Array.isArray(goals) ? goals.filter(g => g && (g.label || g.goalType)) : [];
    if (!list.length) {
      return '<p class="squads-rules-text squads-rules-muted">No optional squad goals were set for this event. Compete for the highest score on the leaderboard.</p>';
    }
    return `<ul class="squads-rules-list squads-rules-goals">
      ${list.map(g => `<li><span class="material-symbols-outlined squads-rules-goal-icon">flag</span><span>${escapeHtml(g.label || `${g.goalType} × ${g.targetValue}`)}</span></li>`).join('')}
    </ul>
    <p class="squads-rules-text squads-rules-muted">Goals are milestones for this squad — track your progress toward them during the competition window.</p>`;
  }

  function renderSquadRulesPanel(squad) {
    const startMs = parseTs(squad.startTime);
    const endMs = parseTs(squad.endTime);
    return `<div class="squads-rules-panel">
      <div class="squads-card squads-rules-section">
        <div class="squads-rules-section-head">
          <span class="material-symbols-outlined">schedule</span>
          <h3>Competition Window</h3>
        </div>
        <p class="squads-rules-text">${competitionDurationRule(squad)}</p>
        <div class="squads-schedule-list squads-rules-schedule">
          <div><span>Starts</span><strong>${formatDateTime(startMs)}</strong></div>
          <div><span>Ends</span><strong>${formatDateTime(endMs)}</strong></div>
        </div>
      </div>
      <div class="squads-card squads-rules-section">
        <div class="squads-rules-section-head">
          <span class="material-symbols-outlined">scoreboard</span>
          <h3>Scoring — ${squad.scoringMode === 'total' ? 'Total Problems' : 'Weighted'}</h3>
        </div>
        ${scoringRulesBlock(squad)}
      </div>
      <div class="squads-card squads-rules-section">
        <div class="squads-rules-section-head">
          <span class="material-symbols-outlined">trending_up</span>
          <h3>Delta Scoring</h3>
        </div>
        <ul class="squads-rules-list">
          <li>Only problems solved <strong>during this competition window</strong> count toward your score.</li>
          <li>Your baseline is captured when you join — solves you already had do not count again.</li>
          <li>Re-solving the same problem does not add extra points.</li>
          <li>Use <strong>Sync Progress</strong> on the Leaderboard tab to refresh your latest LeetCode solves.</li>
        </ul>
      </div>
      <div class="squads-card squads-rules-section">
        <div class="squads-rules-section-head">
          <span class="material-symbols-outlined">verified_user</span>
          <h3>Who Can Join</h3>
        </div>
        ${eligibilityRulesBlock(squad.rules)}
      </div>
      <div class="squads-card squads-rules-section">
        <div class="squads-rules-section-head">
          <span class="material-symbols-outlined">flag</span>
          <h3>Squad Goals</h3>
        </div>
        ${goalsRulesBlock(squad.goals)}
      </div>
      <div class="squads-card squads-rules-section squads-rules-section-muted">
        <div class="squads-rules-section-head">
          <span class="material-symbols-outlined">visibility_off</span>
          <h3>Privacy</h3>
        </div>
        <p class="squads-rules-text">Your LeetCode username is never shown to other squad members. Only your chosen display name appears on the leaderboard.</p>
      </div>
    </div>`;
  }

  function renderDetailTabsBar() {
    return `<div class="squads-detail-tabs" role="tablist">
      <button type="button" class="squads-detail-tab ${detailTab === 'leaderboard' ? 'active' : ''}" data-detail-tab="leaderboard" role="tab">
        <span class="material-symbols-outlined text-base">leaderboard</span> Leaderboard
      </button>
      <button type="button" class="squads-detail-tab ${detailTab === 'rules' ? 'active' : ''}" data-detail-tab="rules" role="tab">
        <span class="material-symbols-outlined text-base">gavel</span> Rules
      </button>
    </div>`;
  }

  function wireDetailTabs(container, squadId) {
    container.querySelectorAll('[data-detail-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.detailTab;
        if (!next || next === detailTab) return;
        detailTab = next;
        stopPolling();
        const tabContent = el('squadsTabContent');
        if (tabContent) renderDetailTab(tabContent, squadId, { soft: true });
        const shell = mount()?.querySelector('.squads-title');
        const sub = mount()?.querySelector('.squads-sub');
        if (shell) shell.textContent = detailTab === 'rules' ? 'Competition Rules' : 'Squad Leaderboard';
        if (sub) sub.textContent = detailTab === 'rules'
          ? 'Rules and scoring for this squad only — they do not apply to other events.'
          : 'Delta scoring — only progress during the competition window counts.';
      });
    });
  }

  async function fetchDetailData(squadId, { force = false, needLeaderboard = true } = {}) {
    const cached = !force
      && detailCache.squadId === squadId
      && detailCache.squad
      && Date.now() - detailCache.fetchedAt < DETAIL_CACHE_MS;
    if (cached) {
      if (!needLeaderboard || detailCache.lb) return detailCache;
    }

    const squad = cached && detailCache.squad
      ? detailCache.squad
      : await window.SquadsAPI.get(squadId);

    let lb = cached && detailCache.lb ? detailCache.lb : null;
    if (needLeaderboard && !lb) {
      try {
        lb = await window.SquadsAPI.leaderboard(squadId);
      } catch (err) {
        if (/cancelled|Competition was cancelled/i.test(err?.message || '')) {
          err.code = 'CANCELLED';
        }
        throw err;
      }
    }

    detailCache = { squadId, squad, lb, fetchedAt: Date.now() };
    return detailCache;
  }

  function formatTimeLeft(endMs) {
    const diff = Math.max(0, endMs - Date.now());
    if (diff <= 0) return 'Ended';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `${d}d ${h}h remaining`;
    if (h > 0) return `${h}h ${m}m remaining`;
    return `${m}m remaining`;
  }

  function formatTimeUntil(targetMs) {
    const diff = Math.max(0, targetMs - Date.now());
    if (diff <= 0) return 'Starting soon';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `Starts in ${d}d ${h}h`;
    if (h > 0) return `Starts in ${h}h ${m}m`;
    return `Starts in ${m}m`;
  }

  function invalidateDetailCache() {
    detailCache = { squadId: null, squad: null, lb: null, fetchedAt: 0 };
  }

  function currentUserId() {
    return window.LeetLensCloud?.getCloudState()?.user?.uid || '';
  }

  function resolveIsHost(squad, lb) {
    const uid = currentUserId();
    const creatorId = lb?.creatorId || squad?.creatorId || '';
    if (lb?.isHost === true || squad?.isHost === true) return true;
    if (lb?.isHost === false && squad?.isHost === false) return false;
    return !!(uid && creatorId && uid === creatorId);
  }

  function resolveHostUserId(squad, lb) {
    return lb?.creatorId || squad?.creatorId || currentUserId();
  }

  function timeProgressPercent(startMs, endMs) {
    const now = Date.now();
    if (!startMs || !endMs || endMs <= startMs) return 0;
    if (now >= endMs) return 100;
    if (now <= startMs) return 0;
    return Math.min(100, Math.round(((now - startMs) / (endMs - startMs)) * 100));
  }

  function renderMetaBar(squad) {
    const id = squad.id || squad.squadId || '';
    const code = squad.code || '';
    const link = squad.inviteUrl || (code ? inviteUrl(code) : '');
    return `<div class="squads-meta-bar">
      ${code ? `<div class="squads-meta-chip squads-meta-chip-accent">
        <span class="squads-meta-label">Invite Code</span>
        <span class="squads-code squads-code-sm">${escapeHtml(code)}</span>
        <button type="button" class="squads-copy-btn" data-copy="${escapeHtml(code)}" title="Copy invite code">
          <span class="material-symbols-outlined">content_copy</span>
        </button>
      </div>` : ''}
      ${link ? `<div class="squads-meta-chip squads-meta-chip-accent">
        <span class="squads-meta-label">Join Link</span>
        <a href="${escapeHtml(link)}" class="squads-invite-link-text" target="_blank" rel="noopener">${escapeHtml(link)}</a>
        <button type="button" class="squads-copy-btn" data-copy="${escapeHtml(link)}" title="Copy invite link">
          <span class="material-symbols-outlined">content_copy</span>
        </button>
      </div>` : ''}
      <div class="squads-meta-chip">
        <span class="squads-meta-label">Squad ID</span>
        <code class="squads-id-text" title="${escapeHtml(id)}">${escapeHtml(id)}</code>
        <button type="button" class="squads-copy-btn" data-copy="${escapeHtml(id)}" title="Copy squad ID">
          <span class="material-symbols-outlined">content_copy</span>
        </button>
      </div>
    </div>`;
  }

  function readInviteCode() {
    return presetJoinCode
      || window.LeetLensSquadsJoin?.readStoredJoinCode?.()
      || window.LeetLensSquadsJoin?.getJoinCodeFromUrl?.()
      || new URLSearchParams(window.location.search).get('joinCode')
      || '';
  }

  function autoJoinStorageKey(code) {
    return `squads_auto_join_${String(code || '').toUpperCase()}`;
  }

  const CREATED_SQUAD_KEY = 'squadsCreatedSquad';

  function saveCreatedSquad(squad) {
    try {
      sessionStorage.setItem(CREATED_SQUAD_KEY, JSON.stringify({
        id: squad.id,
        squadId: squad.id,
        name: squad.name,
        code: squad.code,
        inviteUrl: squad.inviteUrl || inviteUrl(squad.code),
        status: squad.status || 'scheduled'
      }));
    } catch (_) {}
  }

  function loadCreatedSquad() {
    try {
      const raw = sessionStorage.getItem(CREATED_SQUAD_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function clearCreatedSquad() {
    try { sessionStorage.removeItem(CREATED_SQUAD_KEY); } catch (_) {}
  }

  function renderCreatedSquadBanner(squad) {
    const link = squad.inviteUrl || inviteUrl(squad.code);
    return `<div class="squads-created-banner squads-card">
      <div class="squads-created-banner-head">
        <div class="squads-success-card squads-created-success">
          <span class="material-symbols-outlined">check_circle</span>
          <div>
            <strong>Squad created — ${escapeHtml(squad.name)}</strong>
            <p class="text-sm mt-1">Share the invite code or link below. Your squad is now in Active.</p>
          </div>
        </div>
        <button type="button" class="squads-created-dismiss" id="squadsDismissCreated" aria-label="Dismiss">✕</button>
      </div>
      ${renderMetaBar(squad)}
      <div class="squads-invite-box">
        <button type="button" class="squads-btn squads-btn-ghost" id="squadsCopyCreatedLink">Copy Join Link</button>
        <button type="button" class="squads-btn squads-btn-primary" id="squadsOpenCreatedActive">Open Leaderboard</button>
      </div>
    </div>`;
  }

  function wireCreatedSquadBanner(root, squad) {
    const link = squad.inviteUrl || inviteUrl(squad.code);
    wireCopyButtons(root);
    el('squadsCopyCreatedLink')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(link);
        const btn = el('squadsCopyCreatedLink');
        if (btn) {
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy Join Link'; }, 1600);
        }
      } catch (_) {}
    });
    el('squadsOpenCreatedActive')?.addEventListener('click', () => openDetail(squad.id));
    el('squadsDismissCreated')?.addEventListener('click', () => {
      clearCreatedSquad();
      const content = el('squadsTabContent');
      if (content) renderActiveTab(content);
    });
  }

  function goToActiveAfterCreate(squad) {
    saveCreatedSquad(squad);
    subView = null;
    subViewId = null;
    currentTab = 'active';
    stopPolling();
    const container = mount();
    if (container) renderHub(container);
  }

  async function tryAutoJoinFromInvite(code) {
    const normalized = String(code || '').trim().toUpperCase();
    if (!normalized) return null;
    const user = window.LeetLensCloud?.getCloudState()?.user;
    if (!user) return null;
    try {
      if (sessionStorage.getItem(autoJoinStorageKey(normalized)) === 'done') return null;
    } catch (_) {}

    const profile = window.LeetLensCloud?.getCloudState()?.profile;
    const defaultName = profile?.displayName || user.displayName || '';
    try {
      const squad = await window.SquadsAPI.join({
        code: normalized,
        squadNickname: defaultName || null
      });
      try { sessionStorage.setItem(autoJoinStorageKey(normalized), 'done'); } catch (_) {}
      window.LeetLensSquadsJoin?.clearPendingJoin?.();
      presetJoinCode = '';
      return squad;
    } catch (err) {
      try { sessionStorage.setItem(autoJoinStorageKey(normalized), 'failed'); } catch (_) {}
      throw err;
    }
  }

  function wireCopyButtons(root) {
    (root || document).querySelectorAll('.squads-copy-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(btn.dataset.copy || '');
          const icon = btn.querySelector('.material-symbols-outlined');
          if (icon) {
            icon.textContent = 'check';
            setTimeout(() => { icon.textContent = 'content_copy'; }, 1600);
          }
        } catch (_) {}
      });
    });
  }

  function rankBadge(rank) {
    if (rank === 1) return '<span class="squads-rank-medal gold">🥇</span>';
    if (rank === 2) return '<span class="squads-rank-medal silver">🥈</span>';
    if (rank === 3) return '<span class="squads-rank-medal bronze">🥉</span>';
    return `<span class="squads-rank-num">#${rank}</span>`;
  }

  function sprintEndPreview(type, startDate, startTime) {
    if (!startDate || type === 'custom') return '';
    const start = Date.parse(`${startDate}T${(startTime || '09:00').length === 5 ? startTime + ':00' : startTime}`);
    if (Number.isNaN(start)) return '';
    const days = type === 'daily' ? 1 : type === 'weekly' ? 7 : type === 'monthly' ? 30 : 0;
    if (!days) return '';
    const end = new Date(start + days * 86400000);
    return `Ends automatically: ${end.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`;
  }

  function renderCountdown(targetMs, containerId, onReached, options = {}) {
    clearInterval(countdownTimer);
    const node = el(containerId);
    if (!node || !targetMs) return;
    const endedLabel = options.endedLabel || 'Ended';
    function tick() {
      const diff = Math.max(0, targetMs - Date.now());
      if (diff <= 0) {
        node.innerHTML = `<span class="squads-status-pill squads-status-${options.endedStatus || 'ended'}">${endedLabel}</span>`;
        clearInterval(countdownTimer);
        onReached?.();
        return;
      }
      const s = Math.floor(diff / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      node.innerHTML = `<div class="squads-countdown">
        ${d ? `<div class="squads-countdown-unit"><div class="squads-countdown-val">${d}</div><div class="squads-countdown-label">Days</div></div>` : ''}
        <div class="squads-countdown-unit"><div class="squads-countdown-val">${String(h).padStart(2, '0')}</div><div class="squads-countdown-label">Hours</div></div>
        <div class="squads-countdown-unit"><div class="squads-countdown-val">${String(m).padStart(2, '0')}</div><div class="squads-countdown-label">Min</div></div>
        <div class="squads-countdown-unit"><div class="squads-countdown-val">${String(sec).padStart(2, '0')}</div><div class="squads-countdown-label">Sec</div></div>
      </div>`;
    }
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  function renderMemberRoster(members, options = {}) {
    const { isHost, hostUserId, showRemove } = options;
    if (!members?.length) {
      return emptyState('groups', 'No members yet', 'Share the invite link so others can join before the competition starts.');
    }
    return `<div class="squads-roster">${members.map(m => `
      <div class="squads-roster-row">
        <div class="squads-roster-info">
          <strong>${escapeHtml(m.displayLabel || m.displayName || 'Member')}</strong>
          ${m.role === 'creator' ? '<span class="squads-host-badge">Host</span>' : ''}
          ${m.joinedAt ? `<span class="squads-roster-joined">Joined ${formatDateTime(m.joinedAt)}</span>` : ''}
        </div>
        ${isHost && showRemove && m.userId !== hostUserId
          ? `<button type="button" class="squads-btn squads-btn-ghost squads-btn-sm squads-remove-member" data-user-id="${escapeHtml(m.userId)}" title="Remove member">Remove</button>`
          : ''}
      </div>`).join('')}</div>`;
  }

  function wireHostActions(container, squadId, squad, lb) {
    container.querySelectorAll('.squads-remove-member').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.dataset.userId;
        const label = btn.closest('.squads-roster-row')?.querySelector('strong')?.textContent || 'this member';
        if (!userId || !confirm(`Remove ${label} from the squad?`)) return;
        btn.disabled = true;
        try {
          await window.SquadsAPI.removeMember(squadId, userId);
          invalidateDetailCache();
          const tabContent = el('squadsTabContent');
          if (tabContent) renderDetailTab(tabContent, squadId, { force: true });
        } catch (err) {
          alert(err.message);
          btn.disabled = false;
        }
      });
    });

    el('squadsCancelSquad')?.addEventListener('click', async () => {
      if (!confirm('Cancel this squad for everyone? This cannot be undone.')) return;
      const btn = el('squadsCancelSquad');
      if (btn) btn.disabled = true;
      try {
        await window.SquadsAPI.cancel(squadId);
        invalidateDetailCache();
        subView = null;
        subViewId = null;
        currentTab = 'active';
        renderHub(mount());
      } catch (err) {
        alert(err.message);
        if (btn) btn.disabled = false;
      }
    });
  }

  function renderPodium(podium) {
    if (!podium?.length) return '';
    const order = [podium.find(p => p.rank === 2), podium.find(p => p.rank === 1), podium.find(p => p.rank === 3)].filter(Boolean);
    const medals = ['🥈', '🥇', '🥉'];
    const classes = ['second', 'first', 'third'];
    return `<div class="squads-podium">${order.map(p => {
      const idx = p.rank === 1 ? 1 : p.rank === 2 ? 0 : 2;
      return `<div class="squads-podium-slot ${classes[idx]} ${p.isYou ? 'squads-podium-you' : ''}">
        <div class="squads-podium-medal">${medals[idx]}</div>
        <div class="squads-podium-name">${escapeHtml(p.displayLabel)}${p.isYou ? ' <span class="squads-lb-you-badge">You</span>' : ''}</div>
        <div class="squads-podium-points">${p.points ?? 0} pts</div>
        ${p.totalDelta != null ? `<div class="squads-podium-solves">${p.totalDelta} new solve(s)</div>` : ''}
      </div>`;
    }).join('')}</div>`;
  }

  function renderResultsEndedBanner(data, squad) {
    const event = data.event || data.analysis?.event || {};
    const startMs = parseTs(event.startTime || squad?.startTime);
    const endMs = parseTs(event.endTime || squad?.endTime);
    const generated = data.generatedAt ? formatDateTime(data.generatedAt) : '—';
    return `<div class="squads-results-ended-banner">
      <span class="material-symbols-outlined">flag</span>
      <div>
        <strong>Competition ended</strong>
        <p>${formatDateTime(startMs)} → ${formatDateTime(endMs)} · ${escapeHtml(event.durationLabel || '—')} · Finalized ${generated}</p>
      </div>
    </div>`;
  }

  function renderResultsSummaryGrid(data) {
    const totals = data.totals || data.analysis?.totals || {};
    const event = data.event || data.analysis?.event || {};
    return `<div class="squads-results-summary-grid">
      <div class="squads-results-metric"><span>Competitors</span><strong>${event.participantCount || totals.participantCount || '—'}</strong></div>
      <div class="squads-results-metric"><span>New Solves</span><strong>${totals.totalProblems ?? 0}</strong><em>${totals.totalEasy || 0}E · ${totals.totalMedium || 0}M · ${totals.totalHard || 0}H</em></div>
      <div class="squads-results-metric"><span>Total Points</span><strong>${totals.totalPoints ?? 0}</strong></div>
      <div class="squads-results-metric"><span>Avg / Player</span><strong>${totals.avgProblems ?? 0}</strong><em>${totals.avgPoints ?? 0} pts</em></div>
    </div>`;
  }

  function renderYourResultsCard(yourResult) {
    if (!yourResult) return '';
    return `<div class="squads-you-card squads-results-you-card">
      <div class="squads-results-you-head">
        <span class="material-symbols-outlined">person</span>
        <div>
          <div class="squads-detail-panel-label">Your Final Result</div>
          <strong>#${yourResult.rank} · ${yourResult.points} points</strong>
        </div>
      </div>
      <div class="squads-you-metrics">
        <div class="squads-you-metric"><span class="squads-you-stat-label">New Solves</span><span class="squads-you-stat-val">${yourResult.totalDelta}</span></div>
        <div class="squads-you-metric"><span class="squads-you-stat-label">Easy</span><span class="squads-you-stat-val">${yourResult.easyDelta}</span></div>
        <div class="squads-you-metric"><span class="squads-you-stat-label">Medium</span><span class="squads-you-stat-val">${yourResult.mediumDelta}</span></div>
        <div class="squads-you-metric"><span class="squads-you-stat-label">Hard</span><span class="squads-you-stat-val">${yourResult.hardDelta}</span></div>
      </div>
      ${yourResult.percentile != null ? `<p class="squads-results-percentile">Top ${yourResult.percentile}% of the squad</p>` : ''}
    </div>`;
  }

  function renderResultsHighlights(highlights) {
    if (!highlights?.length) return '';
    return `<div class="squads-card squads-results-analysis">
      <div class="squads-section-label">Event Analysis</div>
      <div class="squads-results-highlights">${highlights.map(h => `
        <div class="squads-results-highlight">
          <span class="material-symbols-outlined">${escapeHtml(h.icon || 'info')}</span>
          <div>
            <strong>${escapeHtml(h.title)}</strong>
            <p>${escapeHtml(h.text)}</p>
          </div>
        </div>`).join('')}</div>
    </div>`;
  }

  function renderCategoryWinners(stats) {
    const items = [
      { label: 'Most Easy', data: stats?.mostEasy },
      { label: 'Most Medium', data: stats?.mostMedium },
      { label: 'Most Hard', data: stats?.mostHard },
      { label: 'Top Points', data: stats?.highestPoints },
      { label: 'Most GitHub', data: stats?.mostGithub }
    ].filter(i => i.data?.displayLabel);
    if (!items.length) return '';
    return `<div class="squads-card squads-stats-grid squads-category-winners">
      <div class="squads-section-label squads-field-full">Category Leaders</div>
      ${items.map(i => `<div class="squads-stat-box"><span>${escapeHtml(i.label)}</span><strong>${escapeHtml(i.data.displayLabel)}</strong><em>${i.data.value || 0}</em></div>`).join('')}
    </div>`;
  }

  function renderPositionCard(card) {
    if (!card) return '';
    return `<div class="squads-you-card squads-you-card-enhanced">
      <div class="squads-you-rank-ring">
        <span class="squads-you-rank-num">#${card.rank}</span>
        <span class="squads-you-rank-label">Your Rank</span>
      </div>
      <div class="squads-you-metrics">
        <div class="squads-you-metric"><span class="squads-you-stat-label">Points</span><span class="squads-you-stat-val">${card.points}</span></div>
        <div class="squads-you-metric"><span class="squads-you-stat-label">Solved</span><span class="squads-you-stat-val">${card.totalDelta}</span></div>
        <div class="squads-you-metric"><span class="squads-you-stat-label">To Next</span><span class="squads-you-stat-val">${card.distanceToNext || '—'}</span></div>
      </div>
    </div>`;
  }

  function renderLeaderboardTable(entries, title = 'Leaderboard') {
    if (!entries?.length) {
      return `<div class="squads-lb-card">${emptyState('leaderboard', 'No scores yet', 'Sync your progress or wait for members to join.')}</div>`;
    }
    return `<div class="squads-lb-card">
      <div class="squads-lb-header">
        <h3 class="squads-lb-title">${escapeHtml(title)}</h3>
        <span class="squads-lb-count">${entries.length} competitor${entries.length === 1 ? '' : 's'}</span>
      </div>
      <div class="squads-lb-scroll">
        <table class="squads-lb-table">
          <thead><tr>
            <th>Rank</th><th>Player</th><th class="squads-col-e">E</th><th class="squads-col-m">M</th><th class="squads-col-h">H</th><th>Total</th><th>Pts</th>
          </tr></thead>
          <tbody>${entries.map(e => `<tr class="squads-lb-row ${e.isYou ? 'squads-lb-you' : ''} ${e.rank <= 3 ? `squads-lb-top-${e.rank}` : ''}">
            <td class="squads-lb-rank-cell">${rankBadge(e.rank)}${e.isYou ? '<span class="squads-lb-you-badge">You</span>' : ''}</td>
            <td class="squads-lb-name">${escapeHtml(e.displayLabel)}</td>
            <td class="squads-col-e">${e.easyDelta}</td>
            <td class="squads-col-m">${e.mediumDelta}</td>
            <td class="squads-col-h">${e.hardDelta}</td>
            <td>${e.totalDelta}</td>
            <td class="squads-lb-pts"><strong>${e.points}</strong></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`;
  }

  function defaultStartSchedule() {
    const start = new Date(Date.now() + 30 * 60 * 1000);
    start.setSeconds(0, 0);
    return {
      date: start.toISOString().slice(0, 10),
      time: `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`
    };
  }

  function parseLocalScheduleMs(dateStr, timeStr) {
    if (!dateStr) return NaN;
    const t = timeStr || '00:00';
    return Date.parse(`${dateStr}T${t.length === 5 ? t + ':00' : t}`);
  }

  function validateCreateSchedule(form, isCustom) {
    const startDate = form.querySelector('[name=startDate]').value;
    const startTime = form.querySelector('[name=startTime]').value;
    const startMs = parseLocalScheduleMs(startDate, startTime);
    if (Number.isNaN(startMs)) return 'Enter a valid start date and time';
    if (startMs <= Date.now()) return 'Start date and time must be in the future';
    if (isCustom) {
      const endDate = form.querySelector('[name=endDate]').value;
      const endTime = form.querySelector('[name=endTime]').value;
      const endMs = parseLocalScheduleMs(endDate, endTime);
      if (Number.isNaN(endMs)) return 'Enter a valid end date and time';
      if (endMs <= startMs) return 'End must be after the start time';
      if (endMs <= Date.now()) return 'End time must be in the future';
    }
    return null;
  }

  function squadToActiveCard(squad) {
    return {
      squadId: squad.id || squad.squadId,
      name: squad.name,
      code: squad.code,
      status: squad.status || 'scheduled',
      rank: 1,
      points: 0,
      endTime: squad.endTime,
      startTime: squad.startTime,
      memberCount: squad.memberCount || 1,
      competitionType: squad.competitionType || 'custom',
      inviteUrl: squad.inviteUrl || inviteUrl(squad.code)
    };
  }

  function renderHubShell(container) {
    const showTabs = !subView || subView === 'results';
    const showBack = subView === 'detail';
    container.innerHTML = `<div class="squads-page">
      <div class="squads-hero">
        <div class="squads-hero-glow"></div>
        <span class="squads-badge"><span class="material-symbols-outlined text-sm">sports_esports</span> Squads</span>
        <h1 class="squads-title">${subView === 'detail' ? (detailTab === 'rules' ? 'Competition Rules' : 'Squad Leaderboard') : subView === 'results' ? 'Competition Results' : 'Compete with Friends'}</h1>
        <p class="squads-sub">${subView === 'results' ? 'Final standings, event stats, and performance analysis for this competition.' : subView === 'detail' && detailTab === 'rules' ? 'Rules and scoring for this squad only — they do not apply to other events.' : subView ? 'Delta scoring — only progress during the competition window counts.' : 'Create or join private coding competitions. Your LeetCode username stays hidden from other members.'}</p>
      </div>
      ${showTabs ? `<div class="squads-tabs" role="tablist">
        ${TABS.map(t => `<button type="button" class="squads-tab ${currentTab === t.id ? 'active' : ''}" data-tab="${t.id}" role="tab">
          <span class="material-symbols-outlined text-base">${t.icon}</span>${t.label}
        </button>`).join('')}
      </div>` : ''}
      ${showBack ? `<button type="button" class="squads-btn squads-btn-ghost squads-back-btn" id="squadsBackBtn">
        <span class="material-symbols-outlined text-base">arrow_back</span> Back to Squads
      </button>` : ''}
      <div id="squadsTabContent"></div>
    </div>`;

    if (showTabs) {
      container.querySelectorAll('.squads-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          if (subView === 'results') {
            subView = null;
            subViewId = null;
          }
          currentTab = btn.dataset.tab;
          renderHub(container);
        });
      });
    } else if (showBack) {
      el('squadsBackBtn')?.addEventListener('click', () => {
        subView = null;
        subViewId = null;
        stopPolling();
        renderHub(container);
      });
    }
  }

  async function renderCreateTab(content) {
    const defaults = defaultStartSchedule();
    content.innerHTML = `<form id="squadsCreateForm" class="squads-card squads-form-grid">
      <div class="squads-field squads-field-full"><label>Squad Name *</label><input name="name" required maxlength="60" placeholder="Binary Bandits" /></div>
      <div class="squads-field squads-field-full"><label>Description</label><textarea name="description" rows="2" placeholder="Optional challenge description"></textarea></div>
      <div class="squads-field"><label>Max Members</label><input name="maxMembers" type="number" min="2" max="100" value="10" /></div>
      <div class="squads-field"><label>Visibility</label><select name="visibility"><option value="private">Private</option><option value="public">Public</option></select></div>
      <div class="squads-field squads-field-full"><label>Competition Type</label><select name="competitionType" id="squadsCompType">
        <option value="daily">Daily Sprint (24h)</option>
        <option value="weekly">Weekly Sprint (7 days)</option>
        <option value="monthly">Monthly Marathon (30 days)</option>
        <option value="custom">Custom dates</option>
      </select></div>
      <div class="squads-field"><label>Start Date *</label><input name="startDate" type="date" required min="${defaults.date}" value="${defaults.date}" /></div>
      <div class="squads-field"><label>Start Time *</label><input name="startTime" type="time" required value="${defaults.time}" /></div>
      <div class="squads-field squads-end-field" id="squadsEndDateField" hidden><label>End Date *</label><input name="endDate" type="date" min="${defaults.date}" /></div>
      <div class="squads-field squads-end-field" id="squadsEndTimeField" hidden><label>End Time *</label><input name="endTime" type="time" value="21:00" /></div>
      <div class="squads-field squads-field-full" id="squadsAutoEndHint"><p class="squads-hint" id="squadsAutoEndText">Start must be scheduled in the future (your local time).</p></div>
      <div class="squads-field"><label>Scoring Mode</label><select name="scoringMode">
        <option value="weighted">Weighted (E×1 M×3 H×5)</option>
        <option value="total">Total Problems</option>
      </select></div>
      <div class="squads-field squads-field-full"><label><input type="checkbox" name="noRestrictions" checked /> No eligibility restrictions</label></div>
      <div class="squads-field"><label>Min Total Solved</label><input name="minTotal" type="number" min="0" value="0" disabled /></div>
      <div class="squads-field"><label>Min Easy</label><input name="minEasy" type="number" min="0" value="0" disabled /></div>
      <div class="squads-field"><label>Min Medium</label><input name="minMedium" type="number" min="0" value="0" disabled /></div>
      <div class="squads-field"><label>Min Hard</label><input name="minHard" type="number" min="0" value="0" disabled /></div>
      <div class="squads-field squads-field-full"><label>Goals (optional)</label>
        <div class="squads-goal-chips">${GOAL_PRESETS.map((g, i) =>
          `<label class="squads-goal-chip"><input type="checkbox" name="goal" value="${i}" /> ${g.label}</label>`).join('')}
        </div>
      </div>
      <div class="squads-field squads-field-full squads-btn-row">
        <button type="submit" class="squads-btn squads-btn-primary" id="squadsCreateBtn">Create Squad</button>
      </div>
      <div id="squadsCreateMsg" class="squads-field-full"></div>
    </form>`;

    const form = el('squadsCreateForm');
    const compType = form.querySelector('[name=competitionType]');
    const endFields = form.querySelectorAll('.squads-end-field');
    const hint = el('squadsAutoEndText');

    function updateScheduleUI() {
      const isCustom = compType.value === 'custom';
      endFields.forEach(f => { f.hidden = !isCustom; });
      const startDate = form.querySelector('[name=startDate]').value;
      const startTime = form.querySelector('[name=startTime]').value;
      const endDateInput = form.querySelector('[name=endDate]');
      if (endDateInput) endDateInput.min = startDate || defaults.date;
      hint.textContent = isCustom
        ? 'Start and end must both be in the future. End must be after start.'
        : sprintEndPreview(compType.value, startDate, startTime);
    }

    compType.addEventListener('change', updateScheduleUI);
    form.querySelector('[name=startDate]')?.addEventListener('change', updateScheduleUI);
    form.querySelector('[name=startTime]')?.addEventListener('change', updateScheduleUI);
    updateScheduleUI();

    const noRestrictions = form.querySelector('[name=noRestrictions]');
    noRestrictions?.addEventListener('change', () => {
      ['minTotal', 'minEasy', 'minMedium', 'minHard'].forEach(n => {
        form.querySelector(`[name=${n}]`).disabled = noRestrictions.checked;
      });
    });

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const scheduleError = validateCreateSchedule(form, compType.value === 'custom');
      if (scheduleError) {
        const msg = el('squadsCreateMsg');
        msg.innerHTML = `<div class="squads-error-card"><span class="material-symbols-outlined">schedule</span>${escapeHtml(scheduleError)}</div>`;
        return;
      }
      const fd = new FormData(form);
      const goals = [];
      form.querySelectorAll('[name=goal]:checked').forEach(cb => {
        const g = GOAL_PRESETS[Number(cb.value)];
        if (g) goals.push({ goalType: g.type, targetValue: g.target, label: g.label });
      });
      const msg = el('squadsCreateMsg');
      const btn = el('squadsCreateBtn');
      msg.innerHTML = loadingSkeleton(1);
      msg.className = '';
      btn.disabled = true;
      try {
        const payload = {
          name: fd.get('name'),
          description: fd.get('description'),
          maxMembers: fd.get('maxMembers'),
          visibility: fd.get('visibility'),
          competitionType: fd.get('competitionType'),
          scoringMode: fd.get('scoringMode'),
          startDate: fd.get('startDate'),
          startTime: fd.get('startTime'),
          noRestrictions: noRestrictions.checked,
          minTotal: fd.get('minTotal'),
          minEasy: fd.get('minEasy'),
          minMedium: fd.get('minMedium'),
          minHard: fd.get('minHard'),
          goals
        };
        if (compType.value === 'custom') {
          payload.endDate = fd.get('endDate');
          payload.endTime = fd.get('endTime');
        }
        const squad = await window.SquadsAPI.create(payload);
        saveCreatedSquad({
          ...squad,
          status: squad.status || 'scheduled',
          memberCount: squad.memberCount || 1
        });
        goToActiveAfterCreate(squad);
      } catch (err) {
        msg.innerHTML = '';
        showApiError(msg, err);
      } finally {
        btn.disabled = false;
      }
    });
  }

  async function renderJoinTab(content) {
    const profile = window.LeetLensCloud?.getCloudState()?.profile;
    const defaultName = profile?.displayName || window.LeetLensCloud?.getCloudState()?.user?.displayName || '';
    const inviteCode = readInviteCode();
    let autoJoinError = '';

    if (inviteCode && !window.LeetLensCloud?.getCloudState()?.user) {
      window.LeetLensSquadsJoin?.rememberJoinCode?.(String(inviteCode).trim().toUpperCase());
      content.innerHTML = `<div class="squads-card squads-signin-prompt">
        <span class="material-symbols-outlined text-4xl text-primary">group_add</span>
        <h3 class="font-semibold mt-3">Join Squad ${escapeHtml(inviteCode.toUpperCase())}</h3>
        <p class="text-sm text-on-surface-variant mt-2">Sign in to join this squad automatically.</p>
        <button type="button" class="squads-btn squads-btn-primary mt-4" id="squadsInviteSignIn">Sign In to Join</button>
      </div>`;
      el('squadsInviteSignIn')?.addEventListener('click', () => {
        window.LeetLensSquadsJoin?.rememberJoinCode?.(String(inviteCode).trim().toUpperCase());
        window.switchView?.('signin');
      });
      return;
    }

    if (inviteCode) {
      content.innerHTML = loadingSkeleton(3);
      try {
        const squad = await tryAutoJoinFromInvite(inviteCode);
        if (squad) {
          openDetail(squad.id);
          return;
        }
      } catch (err) {
        autoJoinError = err?.message || 'Could not join squad';
        presetJoinCode = inviteCode;
      }
    }

    content.innerHTML = `
      ${autoJoinError ? `<div class="squads-error-card mb-4"><span class="material-symbols-outlined">error</span>${escapeHtml(autoJoinError)}</div>` : ''}
      <div class="squads-card squads-form-grid">
      <div class="squads-field"><label>Squad Code</label><input id="squadsJoinCode" maxlength="6" placeholder="ABC7K2" value="${escapeHtml(presetJoinCode || inviteCode || '')}" class="squads-code-input" /></div>
      <div class="squads-field"><label>&nbsp;</label><button type="button" class="squads-btn squads-btn-ghost" id="squadsPreviewBtn">Preview Squad</button></div>
      <div id="squadsPreview" class="squads-field squads-field-full"></div>
      <div class="squads-field squads-field-full"><label>Display Name For This Squad</label>
        <input id="squadsJoinNickname" placeholder="${escapeHtml(defaultName)}" value="${escapeHtml(defaultName)}" />
      </div>
      <div class="squads-field squads-field-full squads-btn-row">
        <button type="button" class="squads-btn squads-btn-primary" id="squadsJoinBtn">Join Squad</button>
      </div>
      <div id="squadsJoinMsg" class="squads-field-full"></div>
    </div>`;

    el('squadsPreviewBtn')?.addEventListener('click', async () => {
      const code = el('squadsJoinCode')?.value?.trim();
      const prev = el('squadsPreview');
      if (!code) { prev.innerHTML = '<span class="squads-error">Enter a squad code first.</span>'; return; }
      prev.innerHTML = loadingSkeleton(2);
      try {
        const s = await window.SquadsAPI.lookup(code);
        prev.innerHTML = `<div class="squads-preview-card">
          <div class="squads-preview-head">
            <strong>${escapeHtml(s.name)}</strong>
            <span class="squads-status-pill squads-status-${s.status}">${s.status}</span>
          </div>
          ${renderMetaBar(s)}
          <p class="text-sm text-on-surface-variant mt-2">${s.memberCount}/${s.maxMembers} members · ${formatSprintType(s.competitionType)}</p>
        </div>`;
        wireCopyButtons(prev);
      } catch (err) {
        prev.innerHTML = `<div class="squads-error-card"><span class="material-symbols-outlined">search_off</span>${escapeHtml(err.message)}</div>`;
      }
    });

    el('squadsJoinBtn')?.addEventListener('click', async () => {
      const msg = el('squadsJoinMsg');
      const btn = el('squadsJoinBtn');
      msg.innerHTML = loadingSkeleton(1);
      btn.disabled = true;
      try {
        const squad = await window.SquadsAPI.join({
          code: el('squadsJoinCode')?.value?.trim(),
          squadNickname: el('squadsJoinNickname')?.value?.trim() || null
        });
        msg.innerHTML = `<div class="squads-success-card"><span class="material-symbols-outlined">check_circle</span>Joined ${escapeHtml(squad.name)}!</div>`;
        setTimeout(() => openDetail(squad.id), 600);
      } catch (err) {
        showApiError(msg, err);
      } finally {
        btn.disabled = false;
      }
    });

    if (presetJoinCode) el('squadsPreviewBtn')?.click();
  }

  async function renderActiveTab(content) {
    content.innerHTML = loadingSkeleton(4);
    try {
      const data = await window.SquadsAPI.active();
      let squads = Array.isArray(data?.squads) ? data.squads : [];
      const createdSquad = loadCreatedSquad();
      const createdId = createdSquad?.id || createdSquad?.squadId || '';
      if (createdSquad && !squads.some(s => s.squadId === createdId)) {
        squads = [squadToActiveCard(createdSquad), ...squads];
      }
      const endedRedirect = sessionStorage.getItem('squadsEndedRedirect');
      if (endedRedirect) {
        sessionStorage.removeItem('squadsEndedRedirect');
        openResults(endedRedirect, { fromActive: true });
        return;
      }
      if (!squads.length) {
        if (activePollTimer) { clearInterval(activePollTimer); activePollTimer = null; }
        content.innerHTML = emptyState('emoji_events', 'No active squads', 'Create a squad or join one with an invite code. Ended competitions appear in History.', '<button type="button" class="squads-btn squads-btn-primary mt-3" id="squadsGoCreate">Create Squad</button><button type="button" class="squads-btn squads-btn-ghost mt-3" id="squadsGoHistory">View History</button>');
        el('squadsGoCreate')?.addEventListener('click', () => { currentTab = 'create'; renderHub(mount()); });
        el('squadsGoHistory')?.addEventListener('click', () => { currentTab = 'history'; renderHub(mount()); });
        return;
      }
      const bannerHtml = createdSquad ? renderCreatedSquadBanner(createdSquad) : '';
      content.innerHTML = `${bannerHtml}<div class="squads-active-grid">${squads.map(s => {
        const startMs = parseTs(s.startTime);
        const endMs = parseTs(s.endTime);
        const isScheduled = s.status === 'scheduled';
        const progress = isScheduled ? 0 : timeProgressPercent(startMs, endMs);
        const timeLabel = isScheduled ? formatTimeUntil(startMs) : formatTimeLeft(endMs);
        const isNew = createdId && s.squadId === createdId;
        return `<article class="squads-active-card-v2${isNew ? ' squads-active-card-new' : ''}" data-squad-id="${escapeHtml(s.squadId)}" data-status="${escapeHtml(s.status || 'active')}">
          <div class="squads-active-card-top">
            <span class="squads-status-pill squads-status-${s.status}">${s.status}</span>
            <span class="squads-sprint-badge">${formatSprintType(s.competitionType)}</span>
          </div>
          <h3 class="squads-active-name">${escapeHtml(s.name)}</h3>
          <div class="squads-active-meta">${renderMetaBar(s)}</div>
          <div class="squads-active-stats">
            <div class="squads-active-stat"><span>Your Rank</span><strong>#${s.rank || '—'}</strong></div>
            <div class="squads-active-stat"><span>Points</span><strong>${s.points || 0}</strong></div>
            <div class="squads-active-stat"><span>Members</span><strong>${s.memberCount}</strong></div>
            <div class="squads-active-stat"><span>Time</span><strong>${timeLabel}</strong></div>
          </div>
          <div class="squads-progress-bar" title="${isScheduled ? 'Waiting for start' : `${progress}% elapsed`}"><div class="squads-progress-fill" style="width:${progress}%"></div></div>
          <div class="squads-btn-row squads-active-actions">
            <button type="button" class="squads-btn squads-btn-primary squads-open-btn">Leaderboard</button>
            <button type="button" class="squads-btn squads-btn-ghost squads-rules-btn">Rules</button>
            <button type="button" class="squads-btn squads-btn-ghost squads-sync-btn">Sync</button>
          </div>
        </article>`;
      }).join('')}</div>`;
      if (createdSquad) wireCreatedSquadBanner(content, createdSquad);
      wireCopyButtons(content);
      content.querySelectorAll('.squads-active-card-v2').forEach(card => {
        const id = card.dataset.squadId;
        card.querySelector('.squads-open-btn')?.addEventListener('click', () => openDetail(id));
        card.querySelector('.squads-rules-btn')?.addEventListener('click', () => openDetail(id, { tab: 'rules' }));
        card.querySelector('.squads-sync-btn')?.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (card.dataset.status === 'scheduled') {
            alert('Competition has not started yet. Sync will be available once it begins.');
            return;
          }
          try { await window.SquadsAPI.sync(id); renderActiveTab(content); }
          catch (err) { alert(err.message); }
        });
      });

      if (!activePollTimer) {
        activePollTimer = setInterval(async () => {
          if (currentTab !== 'active' || subView) return;
          try {
            const prev = content.querySelectorAll('.squads-active-card-v2').length;
            const { squads: next } = await window.SquadsAPI.active();
            if (prev > 0 && next.length < prev) {
              const endedId = [...content.querySelectorAll('.squads-active-card-v2')]
                .map(c => c.dataset.squadId)
                .find(sid => !next.some(s => s.squadId === sid));
              if (endedId) sessionStorage.setItem('squadsEndedRedirect', endedId);
            }
            if (currentTab === 'active' && !subView) renderActiveTab(content);
          } catch (_) {}
        }, 30000);
      }
    } catch (err) {
      showApiError(content, err);
    }
  }

  async function renderHistoryTab(content) {
    content.innerHTML = loadingSkeleton(4);
    try {
      const data = await window.SquadsAPI.history();
      const squads = data.squads || [];
      content.innerHTML = `<div class="squads-card squads-stats-row">
        <div><div class="squads-you-stat-label">Wins</div><div class="squads-you-stat-val">${data.stats.wins}</div></div>
        <div><div class="squads-you-stat-label">Runner Ups</div><div class="squads-you-stat-val">${data.stats.runnerUps}</div></div>
        <div><div class="squads-you-stat-label">Top 3</div><div class="squads-you-stat-val">${data.stats.top3Finishes}</div></div>
        <div><div class="squads-you-stat-label">Total</div><div class="squads-you-stat-val">${data.stats.totalParticipations}</div></div>
      </div>
      <div class="squads-achievements mt-4">${(data.achievements || []).map(a =>
        `<div class="squads-achievement"><span>${a.icon}</span>${escapeHtml(a.label)}</div>`).join('') || '<span class="text-on-surface-variant text-sm">Compete to earn badges</span>'}
      </div>
      ${squads.length ? `<div class="squads-history-toolbar mt-4">
        <label class="squads-history-select-all"><input type="checkbox" id="squadsHistorySelectAll"> Select all</label>
        <button type="button" class="squads-btn squads-btn-ghost squads-btn-sm" id="squadsHistoryDeleteSelected" disabled>Delete selected</button>
        <button type="button" class="squads-btn squads-btn-ghost squads-btn-sm squads-btn-danger-text" id="squadsHistoryClearAll">Clear all history</button>
      </div>` : ''}
      <div class="squads-card mt-4" id="squadsHistoryList">${squads.length ? squads.map(s =>
        `<div class="squads-history-row">
          <label class="squads-history-check"><input type="checkbox" class="squads-history-cb" value="${escapeHtml(s.squadId)}"></label>
          <div class="squads-history-info">
            <span class="font-semibold">${escapeHtml(s.name)}</span>
            <code class="squads-id-text squads-id-inline">${escapeHtml(s.squadId)}</code>
          </div>
          <span class="text-sm text-on-surface-variant">#${s.rank || '—'} · ${s.points} pts${s.endedAt ? ` · ${formatDateTime(s.endedAt)}` : ''}</span>
          <button type="button" class="squads-btn squads-btn-primary squads-results-btn" data-id="${escapeHtml(s.squadId)}">View Results</button>
        </div>`).join('') : emptyState('history', 'No past squads', 'Finished competitions appear here after they end.')}</div>
      <div id="squadsHistoryMsg" class="mt-2"></div>`;

      function updateHistoryDeleteState() {
        const checked = content.querySelectorAll('.squads-history-cb:checked');
        const delBtn = el('squadsHistoryDeleteSelected');
        if (delBtn) delBtn.disabled = checked.length === 0;
      }

      content.querySelectorAll('.squads-history-cb').forEach(cb => {
        cb.addEventListener('change', updateHistoryDeleteState);
      });

      el('squadsHistorySelectAll')?.addEventListener('change', (e) => {
        const on = e.target.checked;
        content.querySelectorAll('.squads-history-cb').forEach(cb => { cb.checked = on; });
        updateHistoryDeleteState();
      });

      el('squadsHistoryDeleteSelected')?.addEventListener('click', async () => {
        const ids = [...content.querySelectorAll('.squads-history-cb:checked')].map(cb => cb.value);
        if (!ids.length) return;
        if (!confirm(`Remove ${ids.length} squad(s) from your history?`)) return;
        const msg = el('squadsHistoryMsg');
        try {
          const result = await window.SquadsAPI.deleteHistory({ squadIds: ids });
          msg.innerHTML = `<span class="squads-success">Removed ${result.removed || ids.length} from history.</span>`;
          renderHistoryTab(content);
        } catch (err) {
          msg.innerHTML = `<span class="squads-error">${escapeHtml(err.message)}</span>`;
        }
      });

      el('squadsHistoryClearAll')?.addEventListener('click', async () => {
        if (!confirm('Clear your entire squad history? Stats will reset. This only hides entries for you — it does not delete squad data for others.')) return;
        const msg = el('squadsHistoryMsg');
        try {
          const result = await window.SquadsAPI.deleteHistory({ all: true });
          msg.innerHTML = `<span class="squads-success">Cleared ${result.removed || 0} history entries.</span>`;
          renderHistoryTab(content);
        } catch (err) {
          msg.innerHTML = `<span class="squads-error">${escapeHtml(err.message)}</span>`;
        }
      });

      content.querySelectorAll('.squads-results-btn').forEach(btn => {
        btn.addEventListener('click', () => openResults(btn.dataset.id));
      });
    } catch (err) {
      showApiError(content, err);
    }
  }

  async function renderDetailTab(content, squadId, options = {}) {
    const soft = options.soft;
    const force = options.force;
    if (!soft) content.innerHTML = loadingSkeleton(5);

    async function paint(forceRefresh = false) {
      try {
        if (detailTab === 'rules') {
          const { squad } = await fetchDetailData(squadId, { force: force || forceRefresh, needLeaderboard: false });
          content.innerHTML = `
            <div class="squads-detail-hero squads-detail-hero-compact">
              <div class="squads-detail-badges">
                <span class="squads-status-pill squads-status-${squad.status || 'active'}">${squad.status || 'active'}</span>
                <span class="squads-sprint-badge">${formatSprintType(squad.competitionType)}</span>
                <span class="squads-sprint-badge squads-sprint-badge-muted">${squad.scoringMode === 'total' ? 'Total solves' : 'Weighted scoring'}</span>
              </div>
              <h2 class="squads-detail-title">${escapeHtml(squad.name)}</h2>
              ${squad.description ? `<p class="squads-detail-desc">${escapeHtml(squad.description)}</p>` : ''}
            </div>
            ${renderDetailTabsBar()}
            ${renderSquadRulesPanel(squad)}`;
          wireDetailTabs(content, squadId);
          return;
        }

        const { squad, lb } = await fetchDetailData(squadId, { force: force || forceRefresh, needLeaderboard: true });

        if (lb.status === 'ended') {
          stopPolling();
          openResults(squadId, { fromActive: true });
          return;
        }

        const endMs = parseTs(squad.endTime || lb.endTime);
        const startMs = parseTs(squad.startTime || lb.startTime);
        const isScheduled = lb.status === 'scheduled';
        const progress = isScheduled ? 0 : timeProgressPercent(startMs, endMs);
        const isHost = resolveIsHost(squad, lb);
        const hostUserId = resolveHostUserId(squad, lb);
        let members = lb.members || [];
        if (!members.length && lb.entries?.length) {
          members = lb.entries.map(e => ({
            userId: e.userId,
            displayLabel: e.displayLabel,
            displayName: e.displayName,
            squadNickname: e.squadNickname,
            role: e.userId === hostUserId ? 'creator' : 'member'
          }));
        }
        const goalsHtml = (squad.goals || []).map(g =>
          `<span class="squads-goal-chip">${escapeHtml(g.label || g.goalType)}</span>`).join('');

        const hostControlsHtml = isHost ? `
          <div class="squads-card squads-detail-panel squads-host-panel">
            <div class="squads-detail-panel-label">Host Controls</div>
            <p class="squads-detail-hint">Remove members or cancel the squad before it ends.</p>
            <div class="squads-btn-row">
              <button type="button" class="squads-btn squads-btn-ghost squads-btn-danger-text" id="squadsCancelSquad">Cancel Squad</button>
            </div>
          </div>` : '';

        const membersSectionHtml = members.length && (isScheduled || isHost) ? `
          <div class="squads-section-label">${isScheduled ? 'Onboarded Players' : 'Squad Members'} (${members.length})</div>
          <div class="squads-card squads-detail-panel">${renderMemberRoster(members, { isHost, hostUserId, showRemove: isHost })}</div>` : '';

        content.innerHTML = `
        <div class="squads-detail-hero">
          <div class="squads-detail-head">
            <div>
              <div class="squads-detail-badges">
                <span class="squads-status-pill squads-status-${lb.status}">${lb.status}</span>
                <span class="squads-sprint-badge">${formatSprintType(squad.competitionType)}</span>
                <span class="squads-sprint-badge squads-sprint-badge-muted">${squad.scoringMode === 'total' ? 'Total solves' : 'Weighted scoring'}</span>
              </div>
              <h2 class="squads-detail-title">${escapeHtml(squad.name)}</h2>
              ${squad.description ? `<p class="squads-detail-desc">${escapeHtml(squad.description)}</p>` : ''}
              <p class="squads-detail-sub">Hosted by ${escapeHtml(squad.creatorDisplayName)} · ${squad.memberCount}/${squad.maxMembers} members${isHost ? ' · <span class="squads-host-badge">You are the host</span>' : ''}</p>
              ${goalsHtml ? `<div class="squads-goal-chips squads-detail-goals">${goalsHtml}</div>` : ''}
            </div>
          </div>
          ${renderMetaBar(squad)}
        </div>

        ${renderDetailTabsBar()}

        <div class="squads-detail-grid">
          <div class="squads-card squads-detail-panel">
            <div class="squads-detail-panel-label">${isScheduled ? 'Starts In' : 'Time Remaining'}</div>
            <div id="squadsCountdown"></div>
            <div class="squads-progress-bar mt-3"><div class="squads-progress-fill" style="width:${progress}%"></div></div>
            <p class="squads-detail-time-meta">${isScheduled ? 'Competition has not started — scores unlock at start time.' : `${progress}% of competition elapsed`}</p>
            <div class="squads-schedule-list">
              <div><span>Starts</span><strong>${formatDateTime(startMs)}</strong></div>
              <div><span>Ends</span><strong>${formatDateTime(endMs)}</strong></div>
            </div>
          </div>
          <div class="squads-card squads-detail-panel">
            <div class="squads-detail-panel-label">${isScheduled ? 'Before Start' : 'Quick Actions'}</div>
            <div class="squads-btn-row squads-detail-actions">
              ${isScheduled
                ? '<button type="button" class="squads-btn squads-btn-ghost" disabled>Sync available after start</button>'
                : '<button type="button" class="squads-btn squads-btn-primary" id="squadsManualSync">Sync Progress</button>'}
            </div>
            <p class="squads-detail-hint">${isScheduled
              ? 'Only solves during the competition window count toward E/M/H totals and points.'
              : 'Sync pulls your latest LeetCode solves and updates delta scores.'}</p>
            <div id="squadsSyncMsg" class="mt-2"></div>
          </div>
        </div>

        ${membersSectionHtml}

        ${hostControlsHtml}

        ${isScheduled ? '' : renderPositionCard(lb.positionCard)}
        ${!isScheduled && lb.podium?.length ? `<div class="squads-section-label">Top 3</div>${renderPodium(lb.podium)}` : ''}
        ${renderLeaderboardTable(lb.entries, isScheduled ? 'Registered Players (scores at start)' : 'Live Leaderboard')}`;

        wireCopyButtons(content);
        wireDetailTabs(content, squadId);
        wireHostActions(content, squadId, squad, lb);

        if (isScheduled) {
          renderCountdown(startMs, 'squadsCountdown', () => {
            invalidateDetailCache();
            paint(true);
          }, { endedLabel: 'Starting…', endedStatus: 'active' });
        } else {
          renderCountdown(endMs, 'squadsCountdown', () => openResults(squadId, { fromActive: true }));
        }

        el('squadsManualSync')?.addEventListener('click', async () => {
          const msg = el('squadsSyncMsg');
          try {
            await window.SquadsAPI.sync(squadId);
            msg.innerHTML = '<span class="squads-success">Synced!</span>';
            invalidateDetailCache();
            paint(true);
          } catch (err) {
            msg.innerHTML = `<span class="squads-error">${escapeHtml(err.message)}</span>`;
          }
        });
        el('squadsViewResults')?.addEventListener('click', () => openResults(squadId));
      } catch (err) {
        if (err?.code === 'CANCELLED' || /cancelled/i.test(err?.message || '')) {
          content.innerHTML = `<div class="squads-error-card">
            <span class="material-symbols-outlined">block</span>
            <div><strong>Squad cancelled</strong><p class="text-sm mt-1">The host cancelled this competition.</p>
            <button type="button" class="squads-btn squads-btn-primary mt-3" id="squadsBackFromCancelled">Back to Squads</button></div>
          </div>`;
          el('squadsBackFromCancelled')?.addEventListener('click', () => {
            subView = null;
            subViewId = null;
            invalidateDetailCache();
            renderHub(mount());
          });
          return;
        }
        if (/ended|Competition ended/i.test(err?.message || '')) {
          stopPolling();
          openResults(squadId, { fromActive: true });
          return;
        }
        showApiError(content, err);
      }
    }

    await paint(force);
    if (detailTab === 'leaderboard') {
      pollTimer = setInterval(() => paint(false), 30000);
    }
  }

  async function renderResultsTab(content, squadId) {
    content.innerHTML = loadingSkeleton(5);
    try {
      const [data, squad] = await Promise.all([
        window.SquadsAPI.results(squadId),
        window.SquadsAPI.get(squadId).catch(() => ({ id: squadId }))
      ]);
      const event = data.event || data.analysis?.event || {};
      const scoringLabel = event.scoringMode === 'total' ? 'Total solves' : 'Weighted (E×1 M×3 H×5)';
      content.innerHTML = `
      ${renderResultsEndedBanner(data, squad)}
      <div class="squads-detail-hero squads-results-hero">
        <div class="squads-detail-badges">
          <span class="squads-status-pill squads-status-ended">Ended</span>
          <span class="squads-sprint-badge">${formatSprintType(event.competitionType || squad.competitionType)}</span>
          <span class="squads-sprint-badge squads-sprint-badge-muted">${scoringLabel}</span>
        </div>
        <h2 class="squads-detail-title">${escapeHtml(data.name || squad.name || 'Squad Results')}</h2>
        ${squad.description ? `<p class="squads-detail-desc">${escapeHtml(squad.description)}</p>` : ''}
        ${renderMetaBar(squad)}
      </div>
      ${renderResultsSummaryGrid(data)}
      <div class="squads-champion-banner">
        <div class="squads-champion-title">🏆 Squad Champion</div>
        <div class="squads-champion-name">${escapeHtml(data.champion?.displayLabel || '—')}</div>
        <p class="text-sm text-on-surface-variant mt-2">${data.champion?.points || 0} points · competition winner</p>
      </div>
      ${renderYourResultsCard(data.yourResult || data.analysis?.yourResult)}
      ${renderPodium(data.podium)}
      ${renderLeaderboardTable(data.leaderboard, 'Final Leaderboard')}
      ${renderResultsHighlights(data.highlights || data.analysis?.highlights)}
      ${renderCategoryWinners(data.stats || data.analysis?.categoryWinners)}
      <div class="squads-btn-row mt-4">
        <button type="button" class="squads-btn squads-btn-ghost" id="squadsResultsBackHub">Back to Squads</button>
      </div>`;
      wireCopyButtons(content);
      el('squadsResultsBackHub')?.addEventListener('click', () => {
        subView = null;
        subViewId = null;
        currentTab = 'history';
        renderHub(mount());
      });
    } catch (err) {
      showApiError(content, err);
    }
  }

  function stopPolling() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    if (activePollTimer) { clearInterval(activePollTimer); activePollTimer = null; }
    clearInterval(countdownTimer);
  }

  async function renderHub(container) {
    if (!container) return;

    try {
      if (window.LeetLensCloud?.ensureAuthBoot) {
        await window.LeetLensCloud.ensureAuthBoot();
      }
    } catch (_) {}

    if (!window.LeetLensCloud?.getCloudState()?.user) {
      if (!requireAuth(container)) return;
    }

    const preContent = el('squadsTabContent');
    if (preContent) preContent.innerHTML = loadingSkeleton(3);
    else if (!container.querySelector('.squads-page')) container.innerHTML = loadingSkeleton(3);

    try {
      await window.LeetLensCloud?.getAuthToken?.(false);
    } catch (err) {
      const errTarget = el('squadsTabContent') || container;
      showApiError(errTarget, { code: 'AUTH_REQUIRED', message: err?.message || 'Sign in to use Squads' });
      return;
    }

    renderHubShell(container);
    const tabContent = el('squadsTabContent');
    if (!tabContent) return;

    if (subView === 'detail' && subViewId) return renderDetailTab(tabContent, subViewId);
    if (subView === 'results' && subViewId) return renderResultsTab(tabContent, subViewId);

    if (currentTab === 'create') return renderCreateTab(tabContent);
    if (currentTab === 'join') return renderJoinTab(tabContent);
    if (currentTab === 'active') return renderActiveTab(tabContent);
    if (currentTab === 'history') return renderHistoryTab(tabContent);
  }

  function openDetail(squadId, options = {}) {
    if (subViewId !== squadId) invalidateDetailCache();
    subView = 'detail';
    subViewId = squadId;
    detailTab = options.tab === 'rules' ? 'rules' : 'leaderboard';
    stopPolling();
    const container = mount();
    if (container) renderHub(container);
  }

  function openResults(squadId, options = {}) {
    subView = 'results';
    subViewId = squadId;
    currentTab = 'history';
    stopPolling();
    const container = mount();
    if (container) renderHub(container);
    if (options.fromActive) {
      try { sessionStorage.setItem('squadsLastEndedId', squadId); } catch (_) {}
    }
  }

  function render(viewId, params) {
    stopPolling();
    const container = mount();
    if (!container) return;

    if (params?.tab) currentTab = params.tab;
    if (params?.code) {
      presetJoinCode = String(params.code).trim().toUpperCase();
      currentTab = 'join';
    }
    if (params?.autoJoin && presetJoinCode) {
      currentTab = 'join';
    }
    if (params?.squadId) {
      if (viewId === 'squads-results' || params.results) {
        subView = 'results';
        subViewId = params.squadId;
      } else {
        subView = 'detail';
        subViewId = params.squadId;
      }
    } else if (viewId === 'squads') {
      subView = null;
      subViewId = null;
    }

    renderHub(container);
  }

  window.LeetLensSquadsUI = {
    render,
    stopPolling,
    openDetail,
    openResults
  };
})();
