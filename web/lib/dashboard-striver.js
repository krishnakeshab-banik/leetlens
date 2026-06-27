// Striver A2Z DSA Sheet — enhanced UI with collapsible sections

(function () {
  'use strict';

  let sheetData = null;
  let solvedSlugs = new Set();
  let searchQuery = '';
  let filterDifficulty = 'all';
  let filterStatus = 'all';
  const openSections = new Set();

  function el(id) { return document.getElementById(id); }

  async function loadSheet() {
    if (sheetData) return sheetData;
    const url = chrome.runtime.getURL('data/striver-a2z.json');
    const res = await fetch(url);
    sheetData = await res.json();
    return sheetData;
  }

  function extractSlug(url) {
    if (!url) return null;
    const m = String(url).match(/leetcode\.com\/problems\/([^/?#]+)/i);
    return m ? m[1].toLowerCase() : null;
  }

  function flattenProblems() {
    const items = [];
    (sheetData?.sections || []).forEach(section => {
      (section.subcategories || []).forEach(sub => {
        (sub.problems || []).forEach(p => {
          const slug = extractSlug(p.leetcode);
          items.push({
            section: section.category_name,
            subcategory: sub.subcategory_name,
            name: p.problem_name,
            difficulty: p.difficulty || 'Unknown',
            slug,
            leetcode: p.leetcode
          });
        });
      });
    });
    return items;
  }

  async function refreshSolvedSlugs() {
    solvedSlugs = new Set();
    const local = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, r => resolve(r?.records || {}));
    });
    Object.entries(local).forEach(([slug, rec]) => {
      if (rec.solved) solvedSlugs.add(slug.toLowerCase());
    });

    const cloud = window.LeetLensCloud?.getCloudState();
    if (cloud?.user) {
      try {
        const data = await window.LeetLensCloud.fetchAnalyticsData();
        (data?.solved || []).forEach(p => {
          if (p.problemId) solvedSlugs.add(String(p.problemId).toLowerCase());
        });
      } catch (_) {}
    }
  }

  function computeProgress(items) {
    const withLeetcode = items.filter(i => i.slug);
    const completed = withLeetcode.filter(i => solvedSlugs.has(i.slug));
    return {
      total: withLeetcode.length,
      completed: completed.length,
      remaining: withLeetcode.length - completed.length,
      percent: withLeetcode.length ? Math.round((completed.length / withLeetcode.length) * 100) : 0
    };
  }

  function filterItems(items) {
    return items.filter(item => {
      if (filterDifficulty !== 'all' && item.difficulty !== filterDifficulty) return false;
      const done = item.slug && solvedSlugs.has(item.slug);
      if (filterStatus === 'done' && !done) return false;
      if (filterStatus === 'todo' && done) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        (item.slug || '').includes(q);
    });
  }

  function sectionKey(name) {
    return name.replace(/\s+/g, '-').toLowerCase();
  }

  async function render() {
    const container = el('striverContent');
    if (!container) return;
    container.innerHTML = '<div class="text-sm text-on-surface-variant py-8 text-center">Loading A2Z sheet…</div>';

    await loadSheet();
    await refreshSolvedSlugs();
    const allItems = flattenProblems();
    const progress = computeProgress(allItems);
    const items = filterItems(allItems);

    const bySection = {};
    items.forEach(item => {
      if (!bySection[item.section]) bySection[item.section] = [];
      bySection[item.section].push(item);
    });

    if (!openSections.size && sheetData?.sections?.length) {
      openSections.add(sheetData.sections[0].category_name);
    }

    container.innerHTML = `
      <div class="glass-panel p-6 rounded-xl mb-6">
        <div class="flex flex-wrap items-center gap-6">
          <div class="relative shrink-0" style="width:100px;height:100px">
            <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#201f22" stroke-width="3"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffa116" stroke-width="3" stroke-dasharray="${progress.percent}, 100"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center flex-col">
              <span class="text-xl font-bold text-primary">${progress.percent}%</span>
            </div>
          </div>
          <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><div class="text-[10px] uppercase text-on-surface-variant">Completed</div><div class="text-2xl font-bold text-diff-easy">${progress.completed}</div></div>
            <div><div class="text-[10px] uppercase text-on-surface-variant">Remaining</div><div class="text-2xl font-bold text-diff-medium">${progress.remaining}</div></div>
            <div><div class="text-[10px] uppercase text-on-surface-variant">Total LC</div><div class="text-2xl font-bold">${progress.total}</div></div>
            <div><div class="text-[10px] uppercase text-on-surface-variant">Sections</div><div class="text-2xl font-bold">${Object.keys(bySection).length}</div></div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 mb-6">
        <input id="striverSearch" type="text" placeholder="Search topics or problems…" value="${searchQuery}"
          class="px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-sm flex-1 min-w-[200px] outline-none focus:border-primary/50" />
        <select id="striverDifficulty" class="px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-sm">
          <option value="all">All difficulties</option>
          <option value="Easy" ${filterDifficulty === 'Easy' ? 'selected' : ''}>Easy</option>
          <option value="Medium" ${filterDifficulty === 'Medium' ? 'selected' : ''}>Medium</option>
          <option value="Hard" ${filterDifficulty === 'Hard' ? 'selected' : ''}>Hard</option>
        </select>
        <select id="striverStatus" class="px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-sm">
          <option value="all">All status</option>
          <option value="done" ${filterStatus === 'done' ? 'selected' : ''}>Completed</option>
          <option value="todo" ${filterStatus === 'todo' ? 'selected' : ''}>To do</option>
        </select>
      </div>

      <div class="space-y-3">
        ${Object.entries(bySection).map(([section, problems]) => {
          const secWithLc = problems.filter(p => p.slug);
          const secDone = secWithLc.filter(p => solvedSlugs.has(p.slug)).length;
          const secPct = secWithLc.length ? Math.round((secDone / secWithLc.length) * 100) : 0;
          const isOpen = openSections.has(section);
          const key = sectionKey(section);
          return `
            <div class="striver-section-card" data-section="${key}">
              <div class="striver-section-header" data-toggle="${key}">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="material-symbols-outlined text-sm text-on-surface-variant">${isOpen ? 'expand_less' : 'expand_more'}</span>
                  <div class="text-sm font-semibold truncate">${section}</div>
                </div>
                <div class="text-xs text-on-surface-variant shrink-0 ml-4">${secDone}/${secWithLc.length} · ${secPct}%</div>
              </div>
              <div class="striver-section-progress"><div class="striver-section-progress-fill" style="width:${secPct}%"></div></div>
              <div class="striver-section-body ${isOpen ? 'open' : ''}" id="striver-body-${key}">
                ${problems.map(p => {
                  const done = p.slug && solvedSlugs.has(p.slug);
                  return `
                    <div class="striver-problem-row ${done ? 'done' : ''}">
                      <div class="flex items-center gap-3 min-w-0">
                        <span class="text-lg ${done ? 'text-diff-easy' : 'text-on-surface-variant/30'}">${done ? '✓' : '○'}</span>
                        <div class="min-w-0">
                          <div class="text-sm font-medium truncate">${p.name}</div>
                          <div class="text-[10px] text-on-surface-variant">${p.subcategory}</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        <span class="difficulty-badge difficulty-${p.difficulty}">${p.difficulty}</span>
                        ${p.leetcode ? `<a href="${p.leetcode}" target="_blank" class="sync-btn sync-btn-secondary py-1.5 px-3 text-[10px]">Solve</a>` : ''}
                      </div>
                    </div>`;
                }).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>`;

    el('striverSearch')?.addEventListener('input', e => { searchQuery = e.target.value; render(); });
    el('striverDifficulty')?.addEventListener('change', e => { filterDifficulty = e.target.value; render(); });
    el('striverStatus')?.addEventListener('change', e => { filterStatus = e.target.value; render(); });

    container.querySelectorAll('[data-toggle]').forEach(header => {
      header.addEventListener('click', () => {
        const key = header.dataset.toggle;
        const sectionName = Object.keys(bySection).find(s => sectionKey(s) === key);
        if (!sectionName) return;
        if (openSections.has(sectionName)) openSections.delete(sectionName);
        else openSections.add(sectionName);
        const body = el(`striver-body-${key}`);
        if (body) body.classList.toggle('open');
        const icon = header.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = body?.classList.contains('open') ? 'expand_less' : 'expand_more';
      });
    });
  }

  async function renderOverviewWidget() {
    await loadSheet();
    await refreshSolvedSlugs();
    const progress = computeProgress(flattenProblems());
    const widget = el('a2zProgressWidget');
    if (!widget) return;
    widget.innerHTML = `
      <div class="overview-widget-head">
        <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">A2Z Progress</div>
        <span class="overview-widget-meta">${progress.completed}/${progress.total}</span>
      </div>
      <div class="overview-widget-body">
        <div>
          <div class="overview-widget-stat">${progress.percent}%</div>
          <div class="overview-widget-sub">Striver A2Z sheet completion</div>
          <div class="overview-widget-progress"><div style="width:${progress.percent}%"></div></div>
        </div>
        <button id="a2zWidgetGo" class="overview-widget-link">View sheet →</button>
      </div>`;
    el('a2zWidgetGo')?.addEventListener('click', () => window.switchView?.('striver'));
  }

  window.LeetLensStriver = { render, renderOverviewWidget };
})();
