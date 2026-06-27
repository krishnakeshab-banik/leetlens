// Analytics — LeetCode difficulty focused (compact layout)

(function () {
  'use strict';

  const LIST_PREVIEW = 12;
  const STREAK_PREVIEW = 10;
  const CHART_BARS = 8;

  function el(id) { return document.getElementById(id); }

  function pluralDays(n) {
    const count = Number(n) || 0;
    return `${count} day${count === 1 ? '' : 's'}`;
  }

  function formatSnapshotDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(`${dateStr}T12:00:00`);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function renderProblemRows(problems, diffClass) {
    const preview = problems.slice(0, LIST_PREVIEW);
    if (!preview.length) {
      return '<div class="text-sm text-on-surface-variant py-6 text-center">No problems in this category yet.</div>';
    }
    return `<div class="analytics-list">${preview.map(p => `
      <div class="analytics-list-row">
        <a href="https://leetcode.com/problems/${encodeURIComponent(p.problemId)}/" target="_blank" rel="noopener" class="analytics-list-link" title="${p.title || p.problemId}">${p.title || p.problemId}</a>
        <span class="analytics-diff-badge ${diffClass === 'unknown' ? (p.difficulty || 'Easy').toLowerCase() : diffClass}">${p.difficulty || diffClass}</span>
      </div>`).join('')}</div>`;
  }

  function renderProblemExplorer(recent, hard, medium) {
    const tabs = [
      { id: 'recent', label: 'Recent', count: recent.length, html: renderProblemRows(recent, 'unknown') },
      { id: 'hard', label: 'Hard', count: hard.length, html: renderProblemRows(hard, 'hard') },
      { id: 'medium', label: 'Medium', count: medium.length, html: renderProblemRows(medium, 'medium') }
    ].filter(t => t.count > 0 || t.id === 'recent');

    if (!tabs.length) return '';

    return `<div class="glass-panel p-5 sm:p-6 rounded-xl mt-4 sm:mt-6">
      <div class="analytics-section-head">
        <div class="analytics-section-title">Problem Highlights</div>
        <span class="analytics-section-meta">Scroll inside panel · up to ${LIST_PREVIEW} per tab</span>
      </div>
      <div class="analytics-tabs" role="tablist">
        ${tabs.map((t, i) => `<button type="button" class="analytics-tab ${i === 0 ? 'active' : ''}" data-analytics-tab="${t.id}" role="tab">${t.label} (${t.count})</button>`).join('')}
      </div>
      ${tabs.map((t, i) => `
        <div class="analytics-tab-panel ${i === 0 ? '' : 'hidden'}" data-analytics-panel="${t.id}" role="tabpanel">
          <div class="analytics-scroll-panel">${t.html}</div>
          ${t.count > LIST_PREVIEW ? `<p class="text-[10px] text-on-surface-variant mt-2">${t.count - LIST_PREVIEW} more on your LeetCode profile.</p>` : ''}
        </div>`).join('')}
    </div>`;
  }

  function renderStreakHistory(snapshots) {
    if (!snapshots.length) return '';
    const rows = snapshots
      .slice()
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
      .slice(0, STREAK_PREVIEW);
    return `<div class="glass-panel p-5 sm:p-6 rounded-xl mt-4 sm:mt-6">
      <div class="analytics-section-head">
        <div class="analytics-section-title">Streak History</div>
        <span class="analytics-section-meta">Last ${rows.length} sync day${rows.length === 1 ? '' : 's'}</span>
      </div>
      <p class="text-xs text-on-surface-variant mb-3">Recorded when you sync or solve with LeetLens.</p>
      <div class="analytics-scroll-panel">
        <div class="analytics-streak-list">
          ${rows.map(s => `
            <div class="analytics-streak-row">
              <div>
                <div class="analytics-streak-date">${formatSnapshotDate(s.date)}</div>
                ${s.solvedToday ? `<div class="analytics-streak-meta">${s.solvedToday} solved</div>` : ''}
              </div>
              <span class="analytics-streak-val">🔥 ${pluralDays(s.streak)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
  }

  function wireProblemTabs(root) {
    const tabs = root.querySelectorAll('[data-analytics-tab]');
    const panels = root.querySelectorAll('[data-analytics-panel]');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.analyticsTab;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.analyticsTab === id));
        panels.forEach(p => p.classList.toggle('hidden', p.dataset.analyticsPanel !== id));
      });
    });
  }

  function groupByPeriod(solved, period) {
    const groups = {};
    solved.forEach(p => {
      const d = new Date(p.solvedAt || p.createdAt || Date.now());
      let key;
      if (period === 'day') key = d.toISOString().slice(0, 10);
      else if (period === 'week') {
        const copy = new Date(d);
        const day = copy.getDay();
        const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
        copy.setDate(diff);
        key = copy.toISOString().slice(0, 10);
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
      groups[key] = (groups[key] || 0) + 1;
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }

  function renderBarChart(containerId, data) {
    const container = el(containerId);
    if (!container) return;
    const max = Math.max(...data.map(([, v]) => v), 1);
    container.innerHTML = data.length ? data.slice(-CHART_BARS).map(([k, v]) => `
      <div class="chart-bar-row">
        <span class="chart-bar-label">${k.slice(5) || k}</span>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="width:${Math.max(4, Math.round((v / max) * 100))}%"></div>
        </div>
        <span class="chart-bar-val">${v}</span>
      </div>`).join('') : `<div class="text-sm text-on-surface-variant py-6 text-center">No data yet — sync LeetCode in Overview</div>`;
  }

  function trackedTimeByDifficulty(localRecords) {
    const stats = { Easy: { count: 0, minutes: 0 }, Medium: { count: 0, minutes: 0 }, Hard: { count: 0, minutes: 0 } };
    Object.values(localRecords).filter(r => r.solved).forEach(r => {
      const d = r.difficulty || 'Easy';
      const key = stats[d] ? d : 'Medium';
      stats[key].count++;
      stats[key].minutes += Math.round((r.totalMs || 0) / 60000);
    });
    return stats;
  }

  async function render() {
    const container = el('analyticsContent');
    if (!container) return;

    const state = window.LeetLensCloud?.getCloudState();
    const local = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, r => resolve(r?.records || {}));
    });

    let cloudStats = null;
    let lcSolved = [];
    let snapshots = [];
    const lcLinked = Boolean(state?.profile?.leetcodeUsername);

    if (state?.user) {
      try {
        const data = await window.LeetLensCloud.fetchAnalyticsData();
        cloudStats = data?.stats;
        lcSolved = data?.solved || [];
        snapshots = data?.snapshots || [];
      } catch (_) {}
    }

    const lcTotal = cloudStats?.totalSolved ?? lcSolved.length;
    const lcEasy = cloudStats?.easySolved ?? lcSolved.filter(p => p.difficulty === 'Easy').length;
    const lcMedium = cloudStats?.mediumSolved ?? lcSolved.filter(p => p.difficulty === 'Medium').length;
    const lcHard = cloudStats?.hardSolved ?? lcSolved.filter(p => p.difficulty === 'Hard').length;
    const trackedTime = trackedTimeByDifficulty(local);
    const chartData = lcSolved.length ? lcSolved : Object.values(local).filter(r => r.solved).map(r => ({
      solvedAt: r.solvedAt,
      problemId: r.slug,
      title: r.title,
      difficulty: r.difficulty
    }));

    const last7 = groupByPeriod(chartData, 'day').slice(-7).reduce((s, [, v]) => s + v, 0);

    const recentSolved = [...lcSolved].sort((a, b) => (b.solvedAt || 0) - (a.solvedAt || 0));
    const hardProblems = lcSolved
      .filter(p => p.difficulty === 'Hard')
      .sort((a, b) => (b.solvedAt || 0) - (a.solvedAt || 0));
    const mediumProblems = lcSolved
      .filter(p => p.difficulty === 'Medium')
      .sort((a, b) => (b.solvedAt || 0) - (a.solvedAt || 0));

    container.innerHTML = `
      ${!lcLinked ? `
      <div class="analytics-notice glass-panel p-4 rounded-xl mb-6 flex items-start gap-3">
        <span class="material-symbols-outlined text-primary text-xl shrink-0">link</span>
        <div>
          <p class="text-sm font-semibold text-on-surface">Link your LeetCode account</p>
          <p class="text-xs text-on-surface-variant mt-1">Analytics uses your full LeetCode solve history — not star ratings. Go to Overview → Account Sync to link and sync.</p>
        </div>
      </div>` : ''}

      <div class="analytics-hero mb-6">
        <div class="analytics-kpi">
          <div class="analytics-kpi-label">LeetCode Solved</div>
          <div class="analytics-kpi-val text-primary">${lcLinked ? lcTotal : '—'}</div>
        </div>
        <div class="analytics-kpi">
          <div class="analytics-kpi-label">Last 7 Days</div>
          <div class="analytics-kpi-val text-diff-easy">${last7}</div>
        </div>
        <div class="analytics-kpi">
          <div class="analytics-kpi-label">Streak</div>
          <div class="analytics-kpi-val text-diff-medium">🔥 ${cloudStats?.streak != null ? pluralDays(cloudStats.streak) : '—'}</div>
        </div>
        <div class="analytics-kpi">
          <div class="analytics-kpi-label">Tracked in App</div>
          <div class="analytics-kpi-val text-sm">${Object.values(local).filter(r => r.solved).length}</div>
        </div>
      </div>

      <div class="glass-panel p-5 sm:p-6 rounded-xl mb-6">
        <div class="analytics-section-head">
          <div class="analytics-section-title">LeetCode Solve Breakdown</div>
          <span class="analytics-section-meta">All problems on your LC profile</span>
        </div>
        <div class="stat-card-grid">
          <div class="stat-card stat-card-easy">
            <div class="stat-card-value text-diff-easy">${lcEasy}</div>
            <div class="stat-card-label">Easy</div>
            <div class="stat-card-sub">solved on LeetCode</div>
          </div>
          <div class="stat-card stat-card-medium">
            <div class="stat-card-value text-diff-medium">${lcMedium}</div>
            <div class="stat-card-label">Medium</div>
            <div class="stat-card-sub">solved on LeetCode</div>
          </div>
          <div class="stat-card stat-card-hard">
            <div class="stat-card-value text-diff-hard">${lcHard}</div>
            <div class="stat-card-label">Hard</div>
            <div class="stat-card-sub">solved on LeetCode</div>
          </div>
        </div>
        ${lcTotal > 0 ? `
        <div class="mt-5 space-y-3">
          ${['Easy', 'Medium', 'Hard'].map(d => {
            const count = d === 'Easy' ? lcEasy : d === 'Medium' ? lcMedium : lcHard;
            const pct = lcTotal ? Math.round((count / lcTotal) * 100) : 0;
            return `<div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="font-semibold difficulty-${d}">${d}</span>
                <span class="text-on-surface-variant">${count} · ${pct}%</span>
              </div>
              <div class="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-diff-${d.toLowerCase()}" style="width:${pct}%"></div>
              </div>
            </div>`;
          }).join('')}
        </div>` : ''}
      </div>

      <div class="glass-panel p-5 sm:p-6 rounded-xl mb-6">
        <div class="analytics-section-head">
          <div class="analytics-section-title">Time Tracked in LeetLens</div>
          <span class="analytics-section-meta">Extension sidebar only</span>
        </div>
        <div class="stat-card-grid">
          ${['Easy', 'Medium', 'Hard'].map(d => `
            <div class="stat-card">
              <div class="stat-card-value text-on-surface">${trackedTime[d].minutes}<span class="text-sm font-normal text-on-surface-variant">m</span></div>
              <div class="stat-card-label">${d}</div>
              <div class="stat-card-sub">${trackedTime[d].count} tracked</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div class="glass-panel p-5 sm:p-6 rounded-xl">
          <div class="analytics-section-title mb-3">Solved Per Day</div>
          <div id="chartDaily" class="analytics-chart-scroll space-y-2"></div>
        </div>
        <div class="glass-panel p-5 sm:p-6 rounded-xl">
          <div class="analytics-section-title mb-3">Solved Per Week</div>
          <div id="chartWeekly" class="analytics-chart-scroll space-y-2"></div>
        </div>
        <div class="glass-panel p-5 sm:p-6 rounded-xl">
          <div class="analytics-section-title mb-3">Solved Per Month</div>
          <div id="chartMonthly" class="analytics-chart-scroll space-y-2"></div>
        </div>
      </div>

      ${renderProblemExplorer(recentSolved, hardProblems, mediumProblems)}
      ${renderStreakHistory(snapshots)}`;

    wireProblemTabs(container);
    renderBarChart('chartDaily', groupByPeriod(chartData, 'day'));
    renderBarChart('chartWeekly', groupByPeriod(chartData, 'week'));
    renderBarChart('chartMonthly', groupByPeriod(chartData, 'month'));
  }

  const RECENT_ACTIVITY_LIMIT = 5;

  async function renderRecentActivity() {
    const container = el('recentActivityList');
    if (!container) return;

    let items = [];
    const state = window.LeetLensCloud?.getCloudState();
    if (state?.user) {
      try {
        const data = await window.LeetLensCloud.fetchAnalyticsData();
        if (data?.solved?.length) {
          items = data.solved
            .sort((a, b) => (b.solvedAt || 0) - (a.solvedAt || 0))
            .slice(0, RECENT_ACTIVITY_LIMIT)
            .map(p => ({
              title: p.title || p.problemId,
              slug: p.problemId,
              solvedAt: p.solvedAt,
              difficulty: p.difficulty || 'Unknown'
            }));
        }
      } catch (_) {}
    }

    if (!items.length) {
      const local = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, r => resolve(r?.records || {}));
      });
      items = Object.values(local)
        .filter(r => r.solved)
        .sort((a, b) => (b.solvedAt || 0) - (a.solvedAt || 0))
        .slice(0, RECENT_ACTIVITY_LIMIT)
        .map(r => ({
          title: r.title || r.slug,
          slug: r.slug,
          solvedAt: r.solvedAt,
          difficulty: r.difficulty || 'Unknown'
        }));
    }

    container.innerHTML = items.length ? items.map(r => `
      <div class="overview-activity-row">
        <div class="min-w-0">
          <div class="overview-activity-title">${r.title || r.slug}</div>
          <div class="overview-activity-date">${r.solvedAt ? new Date(r.solvedAt).toLocaleDateString() : '—'}</div>
        </div>
        <span class="analytics-diff-badge ${(r.difficulty || 'unknown').toLowerCase()}">${r.difficulty || '?'}</span>
      </div>`).join('') : '<div class="text-sm text-on-surface-variant py-4">No recent activity yet.</div>';
  }

  window.LeetLensAnalytics = { render, renderRecentActivity };
})();
