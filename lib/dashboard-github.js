// GitHub sync dashboard view

(function () {
  'use strict';

  const REPOS_PER_PAGE = 3;
  let repoPage = 0;

  const cloud = () => window.LeetLensCloud;
  function el(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatDate(ts) {
    if (!ts) return 'Never';
    return new Date(ts).toLocaleString();
  }

  function formatShortDate(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString();
  }

  function bindHandlers(state) {
    el('ghBtnLink')?.addEventListener('click', async () => {
      const username = el('ghUsernameInput')?.value?.trim();
      const status = el('ghLinkStatus');
      if (!username) return;
      try {
        if (status) { status.textContent = 'Validating…'; status.className = 'sync-status info'; }
        await cloud().linkGithubUsername(username);
        if (status) { status.textContent = `Linked @${username}`; status.className = 'sync-status ok'; }
        repoPage = 0;
        render(cloud().getCloudState());
        window.LeetLensCloudUI?.renderAll(cloud().getCloudState());
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('ghBtnSync')?.addEventListener('click', async () => {
      const status = el('ghLinkStatus');
      try {
        if (status) { status.textContent = 'Syncing from GitHub…'; status.className = 'sync-status info'; }
        await cloud().syncGithub();
        if (status) { status.textContent = 'GitHub profile synced'; status.className = 'sync-status ok'; }
        repoPage = 0;
        render(cloud().getCloudState());
        window.LeetLensCloudUI?.renderAll(cloud().getCloudState());
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('ghRepoPrev')?.addEventListener('click', () => {
      if (repoPage > 0) { repoPage--; render(state); }
    });
    el('ghRepoNext')?.addEventListener('click', () => {
      const repos = state.profile?.githubStats?.recentRepos || [];
      const maxPage = Math.ceil(repos.length / REPOS_PER_PAGE) - 1;
      if (repoPage < maxPage) { repoPage++; render(state); }
    });
  }

  function renderLangBars(languages) {
    if (!languages?.length) return '<span class="text-sm text-on-surface-variant">No language data</span>';
    const max = Math.max(...languages.map(l => l.percent), 1);
    return languages.map(l => `
      <div class="gh-lang-bar-row">
        <div class="gh-lang-bar-header">
          <span class="gh-lang-bar-name">${escapeHtml(l.name)}</span>
          <span class="gh-lang-bar-pct">${l.percent}% · ${l.count} repo${l.count !== 1 ? 's' : ''}</span>
        </div>
        <div class="gh-lang-bar-track">
          <div class="gh-lang-bar-fill" style="width:${Math.max(4, Math.round((l.percent / max) * 100))}%"></div>
        </div>
      </div>`).join('');
  }

  function render(state) {
    const container = el('githubContent');
    if (!container) return;

    if (!state?.user) {
      container.innerHTML = `
        <div class="sync-card text-center py-12 space-y-4">
          <span class="material-symbols-outlined text-5xl text-on-surface-variant/40">login</span>
          <h2 class="text-lg font-semibold text-on-surface">Sign in to sync GitHub</h2>
          <p class="text-sm text-on-surface-variant max-w-md mx-auto">Connect your account to pull public repos, stars, and language stats from GitHub.</p>
          <button id="ghGoSignIn" class="sync-btn sync-btn-primary px-8 py-3">Sign In</button>
        </div>`;
      el('ghGoSignIn')?.addEventListener('click', () => window.switchView?.('signin'));
      return;
    }

    const profile = state.profile || {};
    const gh = profile.githubStats || {};
    const linked = profile.githubUsername;
    const repos = gh.recentRepos || [];
    const totalPages = Math.max(1, Math.ceil(repos.length / REPOS_PER_PAGE));
    const pageRepos = repos.slice(repoPage * REPOS_PER_PAGE, (repoPage + 1) * REPOS_PER_PAGE);

    container.innerHTML = `
      <div class="github-page">
        <div class="github-layout">
          <div class="github-sidebar space-y-4">
            <div class="sync-card github-link-card">
              <div class="sync-card-header">
                <div class="sync-card-icon gh">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </div>
                <div>
                  <div class="text-sm font-bold text-on-surface">GitHub Account</div>
                  <div class="text-xs text-on-surface-variant mt-0.5">${linked ? `@${escapeHtml(linked)}` : 'Not linked'}</div>
                </div>
              </div>
              <div class="github-form">
                <input id="ghUsernameInput" type="text" placeholder="GitHub username" value="${escapeHtml(linked || '')}" class="sync-input github-input" />
                <div class="github-form-actions">
                  <button id="ghBtnLink" class="sync-btn sync-btn-secondary">Link</button>
                  <button id="ghBtnSync" class="sync-btn sync-btn-primary" ${state.syncing ? 'disabled' : ''}>
                    ${state.syncing ? 'Syncing…' : 'Sync Now'}
                  </button>
                </div>
              </div>
              <div id="ghLinkStatus" class="sync-status info">
                ${profile.githubLastSyncedAt ? `Last synced: ${formatDate(profile.githubLastSyncedAt)}` : 'Enter username and sync'}
              </div>
            </div>

            ${gh.avatarUrl ? `
              <div class="sync-card github-profile-card">
                <img src="${escapeHtml(gh.avatarUrl)}" alt="" class="github-avatar" />
                <div class="github-profile-info">
                  <div class="font-bold text-on-surface text-base">${escapeHtml(gh.displayName || linked)}</div>
                  <div class="text-sm text-on-surface-variant mt-2 leading-relaxed">${escapeHtml(gh.bio || 'No bio')}</div>
                  ${gh.accountCreated ? `<div class="text-xs text-on-surface-variant mt-2">Member since ${formatShortDate(gh.accountCreated)}</div>` : ''}
                  ${gh.profileUrl ? `<a href="${escapeHtml(gh.profileUrl)}" target="_blank" class="text-sm text-primary hover:underline mt-3 inline-flex items-center gap-1">View on GitHub <span class="material-symbols-outlined text-sm">open_in_new</span></a>` : ''}
                </div>
              </div>` : ''}
          </div>

          <div class="github-main space-y-5">
            ${gh.username ? `
              <div class="analytics-hero github-kpis">
                <div class="analytics-kpi"><div class="analytics-kpi-label">Public Repos</div><div class="analytics-kpi-val text-primary">${gh.publicRepos ?? 0}</div></div>
                <div class="analytics-kpi"><div class="analytics-kpi-label">Total Stars</div><div class="analytics-kpi-val text-diff-medium">${gh.totalStars ?? 0}</div></div>
                <div class="analytics-kpi"><div class="analytics-kpi-label">Total Forks</div><div class="analytics-kpi-val">${gh.totalForks ?? 0}</div></div>
                <div class="analytics-kpi"><div class="analytics-kpi-label">Followers</div><div class="analytics-kpi-val">${gh.followers ?? 0}</div></div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sync-card">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">Engagement</div>
                  <div class="gh-insight-list">
                    <div class="gh-insight-row"><span>Avg stars / repo</span><strong>${gh.avgStarsPerRepo ?? 0}</strong></div>
                    <div class="gh-insight-row"><span>Updated (30 days)</span><strong>${gh.recentlyUpdated ?? 0} repos</strong></div>
                    <div class="gh-insight-row"><span>With description</span><strong>${gh.reposWithDescription ?? 0}</strong></div>
                    <div class="gh-insight-row"><span>Total watchers</span><strong>${gh.totalWatchers ?? 0}</strong></div>
                  </div>
                </div>
                ${gh.topRepo ? `
                <div class="sync-card gh-top-repo-card">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">Top Repository</div>
                  <a href="${escapeHtml(gh.topRepo.url)}" target="_blank" class="gh-top-repo-name">${escapeHtml(gh.topRepo.name)}</a>
                  <div class="flex flex-wrap gap-3 mt-3 text-sm">
                    <span class="text-diff-medium">★ ${gh.topRepo.stars}</span>
                    <span class="text-on-surface-variant">${escapeHtml(gh.topRepo.language)}</span>
                  </div>
                </div>` : ''}
              </div>

              <div class="sync-card">
                <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-4">Language Distribution</div>
                <div class="gh-lang-bars">${renderLangBars(gh.topLanguages)}</div>
              </div>

              <div class="sync-card">
                <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Recent Repositories</div>
                  ${repos.length > REPOS_PER_PAGE ? `
                  <div class="gh-repo-pagination">
                    <button id="ghRepoPrev" class="rev-cal-nav-btn" type="button" ${repoPage === 0 ? 'disabled' : ''}>‹</button>
                    <span class="text-xs text-on-surface-variant px-2">${repoPage + 1} / ${totalPages}</span>
                    <button id="ghRepoNext" class="rev-cal-nav-btn" type="button" ${repoPage >= totalPages - 1 ? 'disabled' : ''}>›</button>
                  </div>` : ''}
                </div>
                <div class="gh-repo-list">
                  ${pageRepos.length
                    ? pageRepos.map(r => `
                        <div class="gh-repo-card">
                          <div class="gh-repo-header">
                            <a href="${escapeHtml(r.url)}" target="_blank" class="gh-repo-name">${escapeHtml(r.name)}</a>
                            <div class="gh-repo-meta">
                              <span class="gh-repo-stars">★ ${r.stars}</span>
                              <span class="gh-repo-forks">⑂ ${r.forks || 0}</span>
                            </div>
                          </div>
                          <p class="gh-repo-desc">${escapeHtml(r.description || 'No description')}</p>
                          <div class="gh-repo-footer">
                            <span class="gh-repo-lang">${escapeHtml(r.language || '—')}</span>
                            <span class="gh-repo-updated">Updated ${formatShortDate(r.updatedAt)}</span>
                          </div>
                        </div>`).join('')
                    : '<div class="text-sm text-on-surface-variant py-4">Sync to load repositories</div>'}
                </div>
              </div>` : `
              <div class="sync-card github-empty text-center py-16 px-6">
                <span class="material-symbols-outlined text-5xl text-on-surface-variant/40">cloud_sync</span>
                <h3 class="text-base font-semibold text-on-surface mt-4">Connect your GitHub</h3>
                <p class="text-sm text-on-surface-variant mt-2 max-w-sm mx-auto leading-relaxed">Link your GitHub username and click Sync to import repos, stars, and language stats.</p>
              </div>`}
          </div>
        </div>
      </div>`;

    bindHandlers(state);
  }

  window.LeetLensGitHub = { render };
})();
