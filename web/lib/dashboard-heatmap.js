// LeetCode-style submission heatmap — live calendar + local activity merge

(function () {
  'use strict';

  let viewYear = new Date().getFullYear();
  let lastStateKey = '';
  let calendarCache = {};

  const CALENDAR_QUERY = `
    query userCalendar($username: String!, $year: Int!) {
      matchedUser(username: $username) {
        userCalendar(year: $year) { submissionCalendar }
      }
    }
  `;

  function el(id) { return document.getElementById(id); }

  function graphqlEndpoint() {
    return window.__LEETLENS_WEB__ ? '/api/leetcode' : 'https://leetcode.com/graphql';
  }

  function parseSubmissionCalendar(calendarStr) {
    if (!calendarStr) return {};
    try {
      return typeof calendarStr === 'string' ? JSON.parse(calendarStr) : calendarStr;
    } catch (_) {
      return {};
    }
  }

  /** Normalize LeetCode keys (unix seconds) → YYYY-MM-DD UTC */
  function normalizeCalendar(raw) {
    const byDate = {};
    Object.entries(raw || {}).forEach(([k, v]) => {
      const count = Number(v) || 0;
      if (!count) return;
      const d = new Date(Number(k) * 1000);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      byDate[key] = (byDate[key] || 0) + count;
    });
    return byDate;
  }

  async function fetchLeetCodeCalendar(username, year) {
    const cacheKey = `${username}:${year}`;
    if (calendarCache[cacheKey]) return calendarCache[cacheKey];

    const res = await fetch(graphqlEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: CALENDAR_QUERY, variables: { username, year } })
    });
    if (!res.ok) throw new Error('LeetCode calendar unavailable');
    const json = await res.json();
    const calendarStr = json?.data?.matchedUser?.userCalendar?.submissionCalendar;
    const cal = normalizeCalendar(parseSubmissionCalendar(calendarStr));
    calendarCache[cacheKey] = cal;
    return cal;
  }

  /** LeetCode profile uses quartiles relative to the busiest day in the year */
  function getLevel(count, maxCount) {
    if (!count || count <= 0) return 0;
    if (maxCount <= 1) return 4;
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }

  function maxCountForYear(calendar) {
    let max = 0;
    Object.entries(calendar).forEach(([k, v]) => {
      if (!k.startsWith(String(viewYear))) return;
      max = Math.max(max, Number(v) || 0);
    });
    return max;
  }

  function buildLocalCalendar(localRecords) {
    const cal = {};
    Object.values(localRecords || {}).forEach(r => {
      if (!r.solved) return;
      const ts = r.solvedAt || r.lastSeen;
      if (!ts) return;
      const d = new Date(ts);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
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

  function utcDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function buildWeeks(calendar) {
    const maxCount = maxCountForYear(calendar);
    const weeks = [];
    const start = new Date(Date.UTC(viewYear, 0, 1));
    const end = new Date(Date.UTC(viewYear, 11, 31));
    const cur = new Date(start);
    cur.setUTCDate(cur.getUTCDate() - cur.getUTCDay());

    while (cur <= end) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const y = cur.getUTCFullYear();
        const m = cur.getUTCMonth();
        const day = cur.getUTCDate();
        const key = utcDateKey(y, m, day);
        const count = calendar[key] || 0;
        const inYear = y === viewYear;
        week.push({
          date: new Date(Date.UTC(y, m, day)),
          count: inYear ? count : 0,
          level: inYear ? getLevel(count, maxCount) : 0,
          inYear
        });
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }

  function activeDays(calendar) {
    return Object.entries(calendar).filter(([k, v]) => {
      return k.startsWith(String(viewYear)) && Number(v) > 0;
    }).length;
  }

  function totalSubmissions(calendar) {
    return Object.entries(calendar).reduce((s, [k, n]) => {
      if (!k.startsWith(String(viewYear))) return s;
      return s + (Number(n) || 0);
    }, 0);
  }

  function renderLoading() {
    const container = el('submissionHeatmap');
    if (!container) return;
    container.innerHTML = `
      <div class="flex items-center gap-2 text-sm text-on-surface-variant py-4">
        <span class="material-symbols-outlined problems-loading-spin">progress_activity</span>
        Loading submission heatmap from LeetCode…
      </div>`;
  }

  function renderGrid(state, localRecords, calendar, fetchError) {
    const container = el('submissionHeatmap');
    if (!container) return;

    const weeks = buildWeeks(calendar);
    const days = activeDays(calendar);
    const submissions = totalSubmissions(calendar);
    const linked = Boolean(state?.profile?.leetcodeUsername);
    const stateKey = `${viewYear}-${days}-${submissions}-${linked}-${fetchError || ''}`;
    if (stateKey === lastStateKey && container.querySelector('.heatmap-grid')) return;
    lastStateKey = stateKey;

    if (!linked && !days) {
      container.innerHTML = `
        <div class="text-sm text-on-surface-variant">Link your LeetCode profile in Profile settings to load your submission heatmap.</div>`;
      return;
    }

    container.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Submission Heatmap</div>
          <div class="text-xs text-on-surface-variant mt-1">${days} active day(s) · ${submissions} submission(s) in ${viewYear}${linked ? ' · LeetCode calendar' : ''}</div>
          ${fetchError ? `<div class="text-xs text-amber-400/80 mt-1">${fetchError}</div>` : ''}
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
                <div class="heatmap-cell level-${day.level}${day.inYear ? '' : ' out-year'}" title="${day.inYear ? `${day.date.toLocaleDateString(undefined, { timeZone: 'UTC' })}: ${day.count} submission(s)` : ''}"></div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2 mt-3 text-[10px] text-on-surface-variant">
        <span>Less</span>
        ${[0, 1, 2, 3, 4].map(l => `<div class="heatmap-legend level-${l}"></div>`).join('')}
        <span>More</span>
        ${linked ? '<span class="ml-auto">Matches LeetCode profile activity colors</span>' : '<span class="ml-auto">Local activity</span>'}
      </div>`;

    el('heatmapPrev')?.addEventListener('click', () => {
      viewYear--;
      lastStateKey = '';
      render(state, localRecords);
    });
    el('heatmapNext')?.addEventListener('click', () => {
      viewYear++;
      lastStateKey = '';
      render(state, localRecords);
    });
  }

  async function render(state, localRecords = {}) {
    const username = state?.profile?.leetcodeUsername;
    const localCal = buildLocalCalendar(localRecords);
    let lcCalendar = normalizeCalendar(state?.stats?.submissionCalendar || {});
    let fetchError = null;

    if (username) {
      renderLoading();
      try {
        lcCalendar = await fetchLeetCodeCalendar(username, viewYear);
      } catch (err) {
        fetchError = 'Could not reach LeetCode — showing cached data.';
        lcCalendar = normalizeCalendar(state?.stats?.submissionCalendar || {});
      }
    }

    const calendar = mergeCalendars(lcCalendar, localCal);
    renderGrid(state, localRecords, calendar, fetchError);
  }

  window.LeetLensHeatmap = { render };
})();
