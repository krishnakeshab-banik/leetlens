// Weekly planning — multi-goal system

(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  const cloud = () => window.LeetLensCloud;

  async function getPlan() {
    if (!cloud()?.getCloudState()?.user) return null;
    return cloud().fetchWeeklyPlanData();
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
    return { count: 'Problem Count', specific: 'Specific Problems', difficulty: 'By Difficulty' }[type] || type;
  }

  let eventsBound = false;

  function bindEvents(container) {
    if (eventsBound || !container) return;
    eventsBound = true;

    container.addEventListener('change', e => {
      if (e.target.id === 'goalType') {
        const slugsInput = el('goalSlugs');
        if (slugsInput) slugsInput.classList.toggle('hidden', e.target.value !== 'specific');
      }
    });

    container.addEventListener('click', async e => {
      const delBtn = e.target.closest('[data-delete-goal]');
      if (delBtn) {
        await cloud().deleteWeeklyGoal(delBtn.dataset.deleteGoal);
        render();
        renderOverviewWidget();
        return;
      }
      if (e.target.id === 'btnAddGoal' || e.target.closest('#btnAddGoal')) {
        const title = el('goalTitle')?.value?.trim() || 'Weekly Goal';
        const type = el('goalType')?.value || 'count';
        const targetCount = Number(el('goalTarget')?.value || 5);
        const difficulty = el('goalDifficulty')?.value || 'all';
        const slugsRaw = el('goalSlugs')?.value?.trim() || '';
        const targetSlugs = slugsRaw ? slugsRaw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
        await cloud().addWeeklyGoal({ title, type, targetCount, targetSlugs, difficulty });
        render();
        renderOverviewWidget();
      }
    });
  }

  async function render() {
    const container = el('planContent');
    if (!container) return;

    const state = cloud()?.getCloudState();
    if (!state?.user) {
      container.innerHTML = `<div class="glass-panel p-8 rounded-xl text-center text-on-surface-variant">Sign in to create and track weekly goals.</div>`;
      return;
    }

    const plan = await getPlan();
    const goals = plan?.goals || [];
    const records = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, r => resolve(r?.records || {}));
    });
    const recordList = Object.values(records);

    const totalDone = goals.reduce((s, g) => s + (g.completedSlugs || []).length, 0);
    const totalTarget = goals.reduce((s, g) => {
      const t = g.type === 'specific' ? (g.targetSlugs || []).length : (g.targetCount || 0);
      return s + t;
    }, 0);
    const overallPct = totalTarget ? Math.min(100, Math.round((totalDone / totalTarget) * 100)) : 0;

    container.innerHTML = `
      <div class="plan-hero glass-panel p-6 rounded-xl mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">This Week</div>
            <div class="text-lg font-bold text-on-surface mt-1">${plan?.startDate || '—'} → ${plan?.endDate || '—'}</div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-primary">${overallPct}%</div>
            <div class="text-xs text-on-surface-variant">${totalDone} / ${totalTarget} across ${goals.length} goal(s)</div>
          </div>
        </div>
        <div class="w-full h-2 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
          <div class="h-full bg-gradient-to-r from-diff-easy to-primary rounded-full" style="width:${overallPct}%"></div>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-xl mb-6 space-y-4">
        <div class="text-sm font-semibold text-on-surface">Create New Goal</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input id="goalTitle" type="text" placeholder="Goal title (e.g. Solve 5 mediums)" class="sync-input" />
          <select id="goalType" class="sync-input">
            <option value="count">Problem count</option>
            <option value="specific">Specific problems</option>
            <option value="difficulty">Difficulty target</option>
          </select>
          <input id="goalTarget" type="number" min="1" max="100" placeholder="Target count" class="sync-input" value="5" />
          <select id="goalDifficulty" class="sync-input">
            <option value="all">Any difficulty</option>
            <option value="Easy">Easy only</option>
            <option value="Medium">Medium only</option>
            <option value="Hard">Hard only</option>
          </select>
        </div>
        <input id="goalSlugs" type="text" placeholder="Specific slugs (comma-separated, e.g. two-sum,valid-anagram)" class="sync-input w-full hidden" />
        <button id="btnAddGoal" class="sync-btn sync-btn-primary">+ Add Goal</button>
      </div>

      <div class="space-y-4" id="goalsList">
        ${goals.length ? goals.map(g => {
          const p = calcGoalProgress(g);
          const isDone = g.status === 'completed';
          return `
            <div class="glass-panel p-5 rounded-xl plan-goal-card ${isDone ? 'completed' : ''}">
              <div class="flex justify-between items-start gap-3 mb-3">
                <div>
                  <div class="text-sm font-bold text-on-surface">${g.title || 'Weekly Goal'}</div>
                  <div class="text-[10px] text-on-surface-variant mt-1">${goalTypeLabel(g.type)}${g.difficulty && g.difficulty !== 'all' ? ` · ${g.difficulty}` : ''}</div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold ${isDone ? 'text-diff-easy' : 'text-primary'}">${p.percent}%</span>
                  <button class="btn-delete-row" data-delete-goal="${g.id}">✕</button>
                </div>
              </div>
              <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mb-2">
                <div class="h-full ${isDone ? 'bg-diff-easy' : 'bg-primary'} rounded-full" style="width:${p.percent}%"></div>
              </div>
              <div class="text-xs text-on-surface-variant">${p.done} / ${p.target} completed · ${p.remaining} remaining</div>
              ${g.type === 'specific' && g.targetSlugs?.length ? `
                <div class="mt-3 flex flex-wrap gap-2">
                  ${g.targetSlugs.map(s => {
                    const done = (g.completedSlugs || []).includes(s);
                    return `<span class="text-[10px] px-2 py-1 rounded-full ${done ? 'bg-diff-easy/20 text-diff-easy' : 'bg-surface-container text-on-surface-variant'}">${done ? '✓' : '○'} ${s}</span>`;
                  }).join('')}
                </div>` : ''}
            </div>`;
        }).join('') : '<div class="glass-panel p-8 rounded-xl text-center text-on-surface-variant">No goals yet. Create one above!</div>'}
      </div>

      <div class="glass-panel rounded-xl overflow-hidden mt-6">
        <div class="px-5 py-3 border-b border-outline-variant/10 text-sm font-semibold">Available Problems (${recordList.length})</div>
        <div class="max-h-64 overflow-y-auto divide-y divide-outline-variant/10">
          ${recordList.slice(0, 40).map(r => `
            <div class="px-5 py-2.5 flex justify-between text-sm">
              <span class="truncate">${r.title || r.slug}</span>
              <span class="text-xs text-on-surface-variant shrink-0 ml-2">${r.difficulty || '?'} · ${r.solved ? '✓' : '○'}</span>
            </div>`).join('') || '<div class="p-6 text-sm text-on-surface-variant">No tracked problems yet.</div>'}
        </div>
      </div>`;

    bindEvents(container);
  }

  async function renderOverviewWidget() {
    const widget = el('weeklyGoalWidget');
    if (!widget) return;
    const plan = await getPlan();
    const goals = plan?.goals || [];
    if (!goals.length) {
      widget.innerHTML = `
        <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Weekly Goals</div>
        <div class="text-sm text-on-surface-variant">No goals set</div>
        <button id="planWidgetGo" class="text-[10px] text-primary font-bold uppercase mt-3 hover:underline">Set goals →</button>`;
      el('planWidgetGo')?.addEventListener('click', () => window.switchView?.('plan'));
      return;
    }
    const done = goals.filter(g => g.status === 'completed').length;
    widget.innerHTML = `
      <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Weekly Goals</div>
      <div class="text-2xl font-bold text-primary">${done} / ${goals.length}</div>
      <div class="text-xs text-on-surface-variant mt-1">goals completed</div>
      <button id="planWidgetGo" class="text-[10px] text-primary font-bold uppercase mt-3 hover:underline">View plan →</button>`;
    el('planWidgetGo')?.addEventListener('click', () => window.switchView?.('plan'));
  }

  window.LeetLensPlan = { render, renderOverviewWidget };
})();
