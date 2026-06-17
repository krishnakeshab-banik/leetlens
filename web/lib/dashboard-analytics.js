// Analytics — LeetCode difficulty focused (all LC solved, not star ratings)

(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }

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
    container.innerHTML = data.length ? data.slice(-12).map(([k, v]) => `
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

    const recentSolved = [...lcSolved]
      .sort((a, b) => (b.solvedAt || 0) - (a.solvedAt || 0))
      .slice(0, 8);

    const hardProblems = lcSolved.filter(p => p.difficulty === 'Hard').slice(0, 6);
    const mediumProblems = lcSolved.filter(p => p.difficulty === 'Medium').slice(0, 6);

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
          <div class="analytics-kpi-val text-diff-medium">🔥 ${cloudStats?.streak ?? '—'}</div>
        </div>
        <div class="analytics-kpi">
          <div class="analytics-kpi-label">Tracked in App</div>
          <div class="analytics-kpi-val text-sm">${Object.values(local).filter(r => r.solved).length}</div>
        </div>
      </div>

      <div class="glass-panel p-5 sm:p-6 rounded-xl mb-6">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">LeetCode Solve Breakdown</div>
          <span class="text-[10px] text-on-surface-variant/70">All problems on your LC profile</span>
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
        <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Time Tracked in LeetLens</div>
        <p class="text-xs text-on-surface-variant mb-4">Practice time from problems you solved using the extension sidebar.</p>
        <div class="stat-card-grid">
          ${['Easy', 'Medium', 'Hard'].map(d => `
            <div class="stat-card">
              <div class="stat-card-value text-on-surface">${trackedTime[d].minutes}<span class="text-sm font-normal text-on-surface-variant">m</span></div>
              <div class="stat-card-label">${d}</div>
              <div class="stat-card-sub">${trackedTime[d].count} tracked</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div class="glass-panel p-5 sm:p-6 rounded-xl">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Solved Per Day</div>
          <div id="chartDaily" class="space-y-2"></div>
        </div>
        <div class="glass-panel p-5 sm:p-6 rounded-xl">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Solved Per Week</div>
          <div id="chartWeekly" class="space-y-2"></div>
        </div>
        <div class="glass-panel p-5 sm:p-6 rounded-xl">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Solved Per Month</div>
          <div id="chartMonthly" class="space-y-2"></div>
        </div>
        <div class="glass-panel p-5 sm:p-6 rounded-xl">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Recently Solved (LeetCode)</div>
          ${recentSolved.length ? recentSolved.map(p => `
            <div class="flex justify-between items-center py-2.5 border-b border-outline-variant/10 text-sm gap-3">
              <a href="https://leetcode.com/problems/${p.problemId}/" target="_blank" class="truncate hover:text-primary">${p.title || p.problemId}</a>
              <span class="shrink-0 text-[10px] difficulty-${p.difficulty || 'Easy'} px-2 py-0.5 rounded-full">${p.difficulty || '?'}</span>
            </div>`).join('') : '<div class="text-sm text-on-surface-variant py-4">Sync LeetCode to see recent solves.</div>'}
        </div>
      </div>

      ${(hardProblems.length || mediumProblems.length) ? `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        ${hardProblems.length ? `
        <div class="glass-panel p-5 sm:p-6 rounded-xl">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Hard Problems Solved</div>
          ${hardProblems.map(p => `
            <div class="flex justify-between py-2 border-b border-outline-variant/10 text-sm">
              <span class="truncate pr-4">${p.title || p.problemId}</span>
              <span class="text-diff-hard shrink-0 text-xs">Hard</span>
            </div>`).join('')}
        </div>` : ''}
        ${mediumProblems.length ? `
        <div class="glass-panel p-5 sm:p-6 rounded-xl">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Medium Problems Solved</div>
          ${mediumProblems.map(p => `
            <div class="flex justify-between py-2 border-b border-outline-variant/10 text-sm">
              <span class="truncate pr-4">${p.title || p.problemId}</span>
              <span class="text-diff-medium shrink-0 text-xs">Medium</span>
            </div>`).join('')}
        </div>` : ''}
      </div>` : ''}

      ${snapshots.length ? `
      <div class="glass-panel p-5 sm:p-6 rounded-xl mt-4 sm:mt-6">
        <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Streak History</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          ${snapshots.slice(0, 14).map(s => `
            <div class="flex justify-between py-2 border-b border-outline-variant/10 text-sm">
              <span class="font-mono text-on-surface-variant">${s.date}</span>
              <span>🔥 ${s.streak || 0} days</span>
            </div>`).join('')}
        </div>
      </div>` : ''}`;

    renderBarChart('chartDaily', groupByPeriod(chartData, 'day'));
    renderBarChart('chartWeekly', groupByPeriod(chartData, 'week'));
    renderBarChart('chartMonthly', groupByPeriod(chartData, 'month'));
  }

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
            .slice(0, 8)
            .map(p => ({
              title: p.title || p.problemId,
              slug: p.problemId,
              solvedAt: p.solvedAt,
              totalMs: (p.timeSpentMinutes || 0) * 60000,
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
        .slice(0, 8);
    }

    container.innerHTML = items.length ? items.map(r => `
      <div class="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0 gap-3">
        <div class="min-w-0">
          <div class="text-sm font-medium truncate">${r.title || r.slug}</div>
          <div class="text-[10px] text-on-surface-variant">${r.solvedAt ? new Date(r.solvedAt).toLocaleDateString() : '—'} · <span class="difficulty-${r.difficulty || 'Unknown'}">${r.difficulty || 'Unknown'}</span></div>
        </div>
        ${r.totalMs ? `<div class="text-xs font-mono text-primary shrink-0">${Math.round(r.totalMs / 60000)}m</div>` : ''}
      </div>`).join('') : '<div class="text-sm text-on-surface-variant py-4">No recent activity yet.</div>';
  }

  window.LeetLensAnalytics = { render, renderRecentActivity };
})();
