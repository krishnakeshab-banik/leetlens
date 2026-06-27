// Personal study plan — goals first, synced from LeetCode

(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  const cloud = () => window.LeetLensCloud;

  async function getPlan() {
    if (!cloud()?.getCloudState()?.user) return null;
    return cloud().fetchWeeklyPlanData();
  }

  function defaultRange() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10)
    };
  }

  function calcGoalProgress(goal) {
    const done = (goal.completedSlugs || []).length;
    const target = goal.type === 'specific'
      ? (goal.targetSlugs || []).length
      : (goal.targetCount || 0);
    const percent = target ? Math.min(100, Math.round((done / target) * 100)) : 0;
    return { done, target, percent, remaining: Math.max(0, target - done) };
  }

  function goalTypeLabel(type) {
    return { count: 'Problem count', specific: 'Specific problems', difficulty: 'By difficulty' }[type] || type;
  }

  function planDateKey(ts) {
    if (ts == null) return null;
    const ms = typeof ts === 'number' ? ts : Date.parse(ts);
    if (!ms || Number.isNaN(ms)) return null;
    return new Date(ms).toISOString().slice(0, 10);
  }

  function buildPlanDays(startDate, endDate) {
    const days = [];
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);
    const today = new Date().toISOString().slice(0, 10);
    const cur = new Date(start);
    while (cur <= end) {
      const key = cur.toISOString().slice(0, 10);
      days.push({
        date: key,
        short: cur.toLocaleDateString(undefined, { weekday: 'short' }),
        dayNum: cur.getDate(),
        isToday: key === today,
        isPast: key < today,
        isFuture: key > today
      });
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }

  function solvesByDateInRange(solvedList, startDate, endDate) {
    const map = {};
    (solvedList || []).forEach(p => {
      const key = planDateKey(p.solvedAt);
      if (!key || key < startDate || key > endDate) return;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }

  function collectSolvedInRange(records, cloudSolved, liveSolved, startDate, endDate) {
    const slugMap = new Map();
    const add = (slug, difficulty, solvedAt) => {
      const key = planDateKey(solvedAt);
      if (!slug || !key || key < startDate || key > endDate) return;
      if (!slugMap.has(slug)) slugMap.set(slug, { slug, difficulty, solvedAt });
    };
    Object.values(records || {}).forEach(r => {
      if (r.solved) add(String(r.slug).toLowerCase(), r.difficulty, r.solvedAt || r.lastSeen);
    });
    (cloudSolved || []).forEach(p => {
      add(String(p.problemId || '').toLowerCase(), p.difficulty, p.solvedAt);
    });
    (liveSolved || []).forEach(p => {
      add(String(p.problemId || '').toLowerCase(), p.difficulty, p.solvedAt);
    });
    return [...slugMap.values()];
  }

  function renderProgressRing(percent, label, size = 'md') {
    const r = size === 'sm' ? 40 : 54;
    const dim = size === 'sm' ? 96 : 128;
    const c = 2 * Math.PI * r;
    const offset = c - (percent / 100) * c;
    const cx = dim / 2;
    return `<div class="plan-ring-wrap plan-ring-${size}" style="width:${dim}px;height:${dim}px">
      <svg class="plan-ring" viewBox="0 0 ${dim} ${dim}" aria-hidden="true" style="width:${dim}px;height:${dim}px">
        <circle class="plan-ring-bg" cx="${cx}" cy="${cx}" r="${r}" />
        <circle class="plan-ring-fill" cx="${cx}" cy="${cx}" r="${r}"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}" />
      </svg>
      <div class="plan-ring-center">
        <div class="plan-ring-val">${percent}%</div>
        <div class="plan-ring-label">${label}</div>
      </div>
    </div>`;
  }

  function renderDayTracker(days, solveMap) {
    return `<div class="plan-day-tracker">
      <div class="plan-day-track">
        ${days.map(d => {
          const count = solveMap[d.date] || 0;
          const level = count >= 3 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0;
          const cls = ['plan-day-cell', d.isToday ? 'today' : '', d.isPast ? 'past' : '', d.isFuture ? 'future' : '', level ? `active l${level}` : ''].filter(Boolean).join(' ');
          return `<div class="${cls}" title="${d.date}: ${count} LeetCode solve(s)">
            <span class="plan-day-name">${d.short}</span>
            <span class="plan-day-num">${d.dayNum}</span>
            ${count ? `<span class="plan-day-count">${count}</span>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  function formatSyncTime(ts) {
    if (!ts) return 'Not synced yet';
    return `Synced ${new Date(ts).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}`;
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms))
    ]);
  }

  let eventsBound = false;
  let backgroundSyncRunning = false;
  const SYNC_STALE_MS = 30 * 60 * 1000;

  function loadLocalRecords() {
    return new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, r => resolve(r?.records || {}));
    });
  }

  function filterNewSolves(solvedList, baselineSlugs) {
    const baselineSet = new Set((baselineSlugs || []).map(x => String(x).toLowerCase()));
    return (solvedList || []).filter(s => !baselineSet.has(String(s.slug).toLowerCase()));
  }

  function buildPlanLayout(plan, goals, startDate, endDate, lcLinked, activityBodyHtml, activitySub) {
    const totalDone = goals.reduce((s, g) => s + (g.completedSlugs || []).length, 0);
    const totalTarget = goals.reduce((s, g) => {
      const t = g.type === 'specific' ? (g.targetSlugs || []).length : (g.targetCount || 0);
      return s + t;
    }, 0);
    const goalPct = totalTarget ? Math.min(100, Math.round((totalDone / totalTarget) * 100)) : 0;
    const goalsCompleted = goals.filter(g => g.status === 'completed').length;
    const daysLeft = Math.max(0, Math.ceil((new Date(`${endDate}T23:59:59`) - Date.now()) / 86400000));
    const planDays = buildPlanDays(startDate, endDate);

    return `
      <div class="plan-layout plan-layout-goals-first">
        <header class="plan-top-bar glass-panel rounded-xl">
          <div class="plan-top-main">
            ${renderProgressRing(goalPct, 'Complete', 'sm')}
            <div class="plan-top-copy">
              <h2 class="plan-top-title">Your personal goals</h2>
              <p class="plan-top-sub">${startDate} → ${endDate} · ${daysLeft} day(s) left · ${goalsCompleted}/${goals.length} goals done</p>
              <p class="plan-sync-status" id="planSyncMsg">${formatSyncTime(plan?.lastSyncedAt)}${lcLinked ? '' : ' · Link LeetCode in Profile to auto-track'}</p>
            </div>
          </div>
          <div class="plan-top-actions">
            ${lcLinked
              ? `<button type="button" id="btnSyncPlanLC" class="sync-btn sync-btn-primary"><span class="material-symbols-outlined text-base">sync</span> Sync LeetCode</button>`
              : `<button type="button" class="sync-btn sync-btn-secondary" onclick="window.switchView?.('profile')">Link LeetCode</button>`}
          </div>
        </header>

        <section class="plan-goals-primary">
          <div class="plan-add-goal glass-panel rounded-xl">
            <div class="plan-add-head">
              <span class="material-symbols-outlined">add_circle</span>
              <div>
                <h3 class="plan-section-title">New goal</h3>
                <p class="plan-section-sub">Set a target — only newly solved problems in this period count (re-solves excluded).</p>
              </div>
            </div>
            <div class="plan-add-grid">
              <input id="goalTitle" type="text" placeholder="e.g. Solve 5 medium problems" class="sync-input plan-add-full" />
              <select id="goalType" class="sync-input">
                <option value="count">Problem count</option>
                <option value="specific">Specific problems</option>
                <option value="difficulty">By difficulty</option>
              </select>
              <input id="goalTarget" type="number" min="1" max="100" class="sync-input" value="5" placeholder="Target" />
              <select id="goalDifficulty" class="sync-input">
                <option value="all">Any difficulty</option>
                <option value="Easy">Easy only</option>
                <option value="Medium">Medium only</option>
                <option value="Hard">Hard only</option>
              </select>
            </div>
            <input id="goalSlugs" type="text" placeholder="Problem slugs: two-sum, valid-anagram" class="sync-input w-full hidden mt-3" />
            <button type="button" id="btnAddGoal" class="sync-btn sync-btn-primary mt-3">Add goal</button>
          </div>

          <div class="plan-goals-list">
            ${goals.length ? goals.map(g => {
              const p = calcGoalProgress(g);
              const isDone = g.status === 'completed';
              return `
                <article class="plan-goal-card glass-panel rounded-xl ${isDone ? 'completed' : ''}">
                  <div class="plan-goal-head">
                    ${renderProgressRing(p.percent, isDone ? 'Done' : 'Progress', 'sm')}
                    <div class="plan-goal-info">
                      <div class="plan-goal-title-row">
                        <h3>${g.title || 'Personal goal'}</h3>
                        <button type="button" class="plan-goal-delete" data-delete-goal="${g.id}" title="Remove">✕</button>
                      </div>
                      <p class="plan-goal-meta">${goalTypeLabel(g.type)}${g.difficulty && g.difficulty !== 'all' ? ` · ${g.difficulty}` : ''}</p>
                      <div class="plan-goal-metrics">
                        <span><strong>${p.done}</strong> / ${p.target || '—'} completed</span>
                        <span>${p.remaining} to go</span>
                      </div>
                      <div class="plan-goal-bar"><div class="plan-goal-bar-fill ${isDone ? 'done' : ''}" style="width:${p.percent}%"></div></div>
                    </div>
                  </div>
                  ${g.type === 'specific' && g.targetSlugs?.length ? `
                    <div class="plan-slug-chips">
                      ${g.targetSlugs.map(s => {
                        const done = (g.completedSlugs || []).includes(s);
                        return `<a href="https://leetcode.com/problems/${s}/" target="_blank" class="plan-slug-chip ${done ? 'done' : ''}">${done ? '✓' : '○'} ${s}</a>`;
                      }).join('')}
                    </div>` : ''}
                  ${(g.completedSlugs || []).length && g.type !== 'specific' ? `
                    <div class="plan-completed-slugs">
                      <span class="plan-completed-label">Counted from LeetCode:</span>
                      ${(g.completedSlugs || []).slice(0, 8).map(s =>
                        `<a href="https://leetcode.com/problems/${s}/" target="_blank" class="plan-slug-chip done">${s}</a>`).join('')}
                      ${(g.completedSlugs || []).length > 8 ? `<span class="plan-more-slugs">+${g.completedSlugs.length - 8} more</span>` : ''}
                    </div>` : ''}
                </article>`;
            }).join('') : `<div class="plan-empty glass-panel rounded-xl">
              <span class="material-symbols-outlined plan-empty-icon">flag</span>
              <p>No goals yet. Add one above — then sync LeetCode to track completion automatically.</p>
            </div>`}
          </div>
        </section>

        <details class="plan-period-details glass-panel rounded-xl">
          <summary class="plan-period-summary">
            <span class="material-symbols-outlined">date_range</span>
            Plan period · ${startDate} → ${endDate}
          </summary>
          <div class="plan-period-body">
            <div class="plan-date-grid">
              <label class="plan-field"><span>Start</span><input id="planStartDate" type="date" class="sync-input" value="${startDate}" /></label>
              <label class="plan-field"><span>End</span><input id="planEndDate" type="date" class="sync-input" value="${endDate}" /></label>
            </div>
            <div class="plan-date-actions">
              <button type="button" id="btnSavePlanDates" class="sync-btn sync-btn-primary">Save & re-sync</button>
              <button type="button" id="btnResetPlanWeek" class="sync-btn sync-btn-secondary">This week</button>
              <span id="planDateMsg" class="plan-date-msg"></span>
            </div>
          </div>
        </details>

        <section class="plan-activity-section glass-panel rounded-xl">
          <div class="plan-section-head">
            <span class="material-symbols-outlined">monitoring</span>
            <div>
              <h3 class="plan-section-title">LeetCode activity this period</h3>
              <p class="plan-section-sub" id="planActivitySub">${activitySub}</p>
            </div>
          </div>
          <div id="planActivityBody">${activityBodyHtml || renderDayTracker(planDays, {})}</div>
        </section>
      </div>`;
  }

  async function loadActivityPanel(plan, startDate, endDate, lcLinked) {
    const subEl = el('planActivitySub');
    const bodyEl = el('planActivityBody');
    if (!subEl || !bodyEl) return;

    try {
      const fetches = [
        loadLocalRecords(),
        withTimeout(cloud().fetchAnalyticsData(), 5000).catch(() => null)
      ];
      if (lcLinked && cloud().fetchPlanLeetCodeActivity) {
        fetches.push(withTimeout(cloud().fetchPlanLeetCodeActivity(startDate, endDate), 15000).catch(() => []));
      }

      const [records, analytics, liveSolved = []] = await Promise.all(fetches);
      const cloudSolved = analytics?.solved || [];
      const solvedInRange = filterNewSolves(
        collectSolvedInRange(records, cloudSolved, liveSolved, startDate, endDate),
        plan?.baselineSlugs
      );
      const solveMap = solvesByDateInRange(solvedInRange, startDate, endDate);
      const planDays = buildPlanDays(startDate, endDate);
      subEl.textContent = `${solvedInRange.length} new unique solve(s) between ${startDate} and ${endDate} (re-solves excluded)`;
      bodyEl.innerHTML = renderDayTracker(planDays, solveMap);
    } catch (_) {
      subEl.textContent = `Activity between ${startDate} and ${endDate} — click Sync LeetCode if data is missing`;
      bodyEl.innerHTML = renderDayTracker(buildPlanDays(startDate, endDate), {});
    }
  }

  function maybeBackgroundSync(plan, startDate, endDate, lcLinked, skipBackgroundSync) {
    if (skipBackgroundSync || !lcLinked || !cloud().syncPlanFromLeetCode || backgroundSyncRunning) return;
    const lastSync = plan?.lastSyncedAt || 0;
    if (lastSync && Date.now() - lastSync < SYNC_STALE_MS) return;

    backgroundSyncRunning = true;
    const msg = el('planSyncMsg');
    if (msg) msg.textContent = 'Syncing LeetCode in background…';

    withTimeout(cloud().syncPlanFromLeetCode({ forceRefresh: false }), 45000)
      .then(() => render({ skipBackgroundSync: true }))
      .catch(() => {
        if (msg) msg.textContent = formatSyncTime(plan?.lastSyncedAt);
      })
      .finally(() => { backgroundSyncRunning = false; });
  }

  function bindEvents(container) {
    if (eventsBound || !container) return;
    eventsBound = true;

    container.addEventListener('change', e => {
      if (e.target.id === 'goalType') {
        el('goalSlugs')?.classList.toggle('hidden', e.target.value !== 'specific');
      }
    });

    container.addEventListener('click', async e => {
      if (e.target.closest('[data-delete-goal]')) {
        await cloud().deleteWeeklyGoal(e.target.closest('[data-delete-goal]').dataset.deleteGoal);
        render();
        renderOverviewWidget();
        return;
      }

      if (e.target.id === 'btnSyncPlanLC' || e.target.closest('#btnSyncPlanLC')) {
        const msg = el('planSyncMsg');
        const btn = el('btnSyncPlanLC');
        if (btn) btn.disabled = true;
        if (msg) msg.textContent = 'Syncing from LeetCode…';
        try {
          const result = await cloud().syncPlanFromLeetCode({ forceRefresh: true });
          if (msg) msg.textContent = `Updated — ${result.solvesInPeriod} solve(s) in your plan period`;
          render();
          renderOverviewWidget();
        } catch (err) {
          if (msg) msg.textContent = err.message || 'Sync failed';
        } finally {
          if (btn) btn.disabled = false;
        }
        return;
      }

      if (e.target.id === 'btnSavePlanDates' || e.target.closest('#btnSavePlanDates')) {
        const msg = el('planDateMsg');
        try {
          await cloud().updateWeeklyPlanSchedule(el('planStartDate')?.value, el('planEndDate')?.value);
          if (msg) msg.textContent = 'Dates saved';
          await cloud().syncPlanFromLeetCode?.({ forceRefresh: true });
          render();
        } catch (err) {
          if (msg) msg.textContent = err.message;
        }
        return;
      }

      if (e.target.id === 'btnResetPlanWeek' || e.target.closest('#btnResetPlanWeek')) {
        const range = defaultRange();
        await cloud().updateWeeklyPlanSchedule(range.startDate, range.endDate);
        await cloud().syncPlanFromLeetCode?.({ forceRefresh: true });
        render();
        return;
      }

      if (e.target.id === 'btnAddGoal' || e.target.closest('#btnAddGoal')) {
        const slugsRaw = el('goalSlugs')?.value?.trim() || '';
        await cloud().addWeeklyGoal({
          title: el('goalTitle')?.value?.trim() || 'Personal goal',
          type: el('goalType')?.value || 'count',
          targetCount: Number(el('goalTarget')?.value || 5),
          difficulty: el('goalDifficulty')?.value || 'all',
          targetSlugs: slugsRaw ? slugsRaw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : []
        });
        if (el('goalTitle')) el('goalTitle').value = '';
        if (el('goalSlugs')) el('goalSlugs').value = '';
        await cloud().syncPlanFromLeetCode?.({ forceRefresh: true });
        render();
        renderOverviewWidget();
      }
    });
  }

  async function render(options = {}) {
    const { skipBackgroundSync = false } = options;
    const container = el('planContent');
    if (!container) return;

    if (!cloud()) {
      container.innerHTML = `<div class="plan-signin glass-panel p-8 rounded-xl text-center">
        <span class="material-symbols-outlined plan-signin-icon">cloud_off</span>
        <p class="text-on-surface-variant mt-2">Cloud features failed to load. Refresh the page or run <code>npm run build</code> if developing locally.</p>
      </div>`;
      return;
    }

    const state = cloud()?.getCloudState();
    if (!state?.user) {
      container.innerHTML = `<div class="plan-signin glass-panel p-8 rounded-xl text-center">
        <span class="material-symbols-outlined plan-signin-icon">flag</span>
        <p class="text-on-surface-variant mt-2">Sign in to set personal goals and track completion from LeetCode.</p>
      </div>`;
      return;
    }

    const lcLinked = Boolean(state.profile?.leetcodeUsername);
    container.innerHTML = `<div class="plan-loading glass-panel p-8 rounded-xl text-center text-on-surface-variant">
      <span class="material-symbols-outlined plan-loading-spin">progress_activity</span>
      <p class="mt-2">Loading your goals…</p>
    </div>`;

    try {
    let plan = null;
    try { plan = await withTimeout(getPlan(), 5000); } catch (_) {}

    const range = defaultRange();
    const startDate = plan?.startDate || range.startDate;
    const endDate = plan?.endDate || range.endDate;
    const goals = plan?.goals || [];

    container.innerHTML = buildPlanLayout(
      plan,
      goals,
      startDate,
      endDate,
      lcLinked,
      `<div class="plan-activity-loading text-sm text-on-surface-variant py-4">Loading activity…</div>`,
      `Activity between ${startDate} and ${endDate}`
    );

    bindEvents(container);
    loadActivityPanel(plan, startDate, endDate, lcLinked);
    maybeBackgroundSync(plan, startDate, endDate, lcLinked, skipBackgroundSync);
    } catch (err) {
      container.innerHTML = `<div class="plan-signin glass-panel p-8 rounded-xl text-center">
        <span class="material-symbols-outlined plan-signin-icon">error</span>
        <p class="text-on-surface-variant mt-2">Could not load your goals${err?.message ? `: ${err.message}` : ''}.</p>
        <button type="button" class="sync-btn sync-btn-primary mt-4" id="btnPlanRetry">Try again</button>
      </div>`;
      el('btnPlanRetry')?.addEventListener('click', () => render());
    }
  }

  async function renderOverviewWidget() {
    const widget = el('weeklyGoalWidget');
    if (!widget) return;
    const plan = await getPlan();
    const goals = plan?.goals || [];
    if (!goals.length) {
      widget.innerHTML = `
        <div class="overview-widget-head">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Personal Goals</div>
        </div>
        <div class="overview-widget-body">
          <div class="text-sm text-on-surface-variant">No goals set yet</div>
          <button id="planWidgetGo" class="overview-widget-link">Set goals →</button>
        </div>`;
      el('planWidgetGo')?.addEventListener('click', () => window.switchView?.('plan'));
      return;
    }
    const totalDone = goals.reduce((s, g) => s + (g.completedSlugs || []).length, 0);
    const totalTarget = goals.reduce((s, g) => {
      const t = g.type === 'specific' ? (g.targetSlugs || []).length : (g.targetCount || 0);
      return s + t;
    }, 0);
    const pct = totalTarget ? Math.min(100, Math.round((totalDone / totalTarget) * 100)) : 0;
    widget.innerHTML = `
      <div class="overview-widget-head">
        <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Personal Goals</div>
        <span class="overview-widget-meta">${goals.filter(g => g.status === 'completed').length}/${goals.length}</span>
      </div>
      <div class="overview-widget-body">
        <div>
          <div class="overview-widget-stat">${pct}%</div>
          <div class="overview-widget-sub">${totalDone}/${totalTarget} targets · LeetCode synced</div>
          <div class="overview-widget-progress"><div style="width:${pct}%"></div></div>
        </div>
        <button id="planWidgetGo" class="overview-widget-link">View goals →</button>
      </div>`;
    el('planWidgetGo')?.addEventListener('click', () => window.switchView?.('plan'));
  }

  window.LeetLensPlan = { render, renderOverviewWidget };
})();
