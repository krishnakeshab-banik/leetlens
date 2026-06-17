// GitHub-style submission heatmap — merges LeetCode + local activity

(function () {
  'use strict';

  let viewYear = new Date().getFullYear();
  let lastStateKey = '';

  function el(id) { return document.getElementById(id); }

  function getLevel(count) {
    if (!count) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
  }

  function buildLocalCalendar(localRecords) {
    const cal = {};
    Object.values(localRecords || {}).forEach(r => {
      if (!r.solved) return;
      const ts = r.solvedAt || r.lastSeen;
      if (!ts) return;
      const day = new Date(ts);
      day.setHours(0, 0, 0, 0);
      const key = Math.floor(day.getTime() / 1000);
      cal[key] = (cal[key] || 0) + 1;
    });
    return cal;
  }

  function mergeCalendars(lcCalendar, localCalendar) {
    const merged = { ...lcCalendar };
    Object.entries(localCalendar).forEach(([k, v]) => {
      merged[k] = (merged[k] || 0) + v;
    });
    return merged;
  }

  function buildWeeks(calendar) {
    const start = new Date(viewYear, 0, 1);
    const end = new Date(viewYear, 11, 31);
    const weeks = [];
    let current = new Date(start);
    current.setDate(current.getDate() - current.getDay());

    while (current <= end) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(current);
        const key = Math.floor(day.getTime() / 1000);
        const count = calendar[key] || calendar[String(key)] || 0;
        week.push({ date: new Date(day), count, level: getLevel(count) });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }

  function totalSubmissions(calendar) {
    return Object.values(calendar).reduce((s, n) => s + (Number(n) || 0), 0);
  }

  function render(state, localRecords = {}) {
    const container = el('submissionHeatmap');
    if (!container) return;

    const lcCalendar = state?.stats?.submissionCalendar || {};
    const localCal = buildLocalCalendar(localRecords);
    const calendar = mergeCalendars(lcCalendar, localCal);
    const weeks = buildWeeks(calendar);
    const total = totalSubmissions(calendar);
    const linked = Boolean(state?.profile?.leetcodeUsername);
    const stateKey = `${viewYear}-${total}-${linked}`;
    if (stateKey === lastStateKey && container.querySelector('.heatmap-grid')) return;
    lastStateKey = stateKey;

    if (!linked && !total) {
      container.innerHTML = `
        <div class="text-sm text-on-surface-variant">Sign in and sync LeetCode profile to view heatmap. Local solves will appear once you track problems.</div>`;
      return;
    }

    container.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Submission Heatmap</div>
          <div class="text-xs text-on-surface-variant mt-1">${total} active day(s) · auto-updates</div>
        </div>
        <div class="flex items-center gap-2">
          <button id="heatmapPrev" class="rev-cal-nav-btn" type="button">‹</button>
          <span class="text-sm font-semibold min-w-[3rem] text-center">${viewYear}</span>
          <button id="heatmapNext" class="rev-cal-nav-btn" type="button">›</button>
        </div>
      </div>
      <div class="heatmap-scroll overflow-x-auto pb-2 -mx-1 px-1">
        <div class="heatmap-grid">
          ${weeks.map(week => `
            <div class="heatmap-week">
              ${week.map(day => `
                <div class="heatmap-cell level-${day.level}" title="${day.date.toDateString()}: ${day.count} submission(s)"></div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2 mt-3 text-[10px] text-on-surface-variant">
        <span>Less</span>
        ${[0, 1, 2, 3, 4].map(l => `<div class="heatmap-legend level-${l}"></div>`).join('')}
        <span>More</span>
        ${linked ? '<span class="ml-auto">LeetCode + LeetLens activity</span>' : '<span class="ml-auto">LeetLens activity</span>'}
      </div>`;

    el('heatmapPrev')?.addEventListener('click', () => { viewYear--; lastStateKey = ''; render(state, localRecords); });
    el('heatmapNext')?.addEventListener('click', () => { viewYear++; lastStateKey = ''; render(state, localRecords); });
  }

  window.LeetLensHeatmap = { render };
})();
