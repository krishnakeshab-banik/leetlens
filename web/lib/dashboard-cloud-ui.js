// Dashboard cloud UI — Sign In page, Profile page, auth panel, overview widgets

(function () {
  'use strict';

  const cloud = () => window.LeetLensCloud;
  let authMode = 'signin'; // 'signin' | 'signup'
  const GOOGLE_BTN_HTML = `<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
  const LEETCODE_LOGO_SVG = `<svg class="lc-logo-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M13.483 0a1.65 1.65 0 0 0-1.65 1.65v13.275H0V4.925A4.925 4.925 0 0 1 4.925 0h8.558zm4.65 5.6a1.65 1.65 0 0 0-1.65-1.65h-2.758v15.675A1.65 1.65 0 0 0 14.925 21h3.3V5.6z"/></svg>`;

  function el(id) { return document.getElementById(id); }

  function cloudReady() {
    const c = cloud();
    return Boolean(
      c &&
      typeof c.initCloud === 'function' &&
      typeof c.getCloudState === 'function'
    );
  }

  function firebaseReady() {
    try {
      const fn = cloud()?.isFirebaseConfigured;
      return typeof fn === 'function' ? fn() : false;
    } catch (_) {
      return false;
    }
  }

  function oauthReady() {
    try {
      const fn = cloud()?.isOAuthConfigured;
      return typeof fn === 'function' ? fn() : false;
    } catch (_) {
      return false;
    }
  }

  function getRedirectUri() {
    try {
      const fn = cloud()?.getOAuthRedirectUri;
      if (typeof fn === 'function') return fn();
    } catch (_) {}
    try {
      return chrome.identity.getRedirectURL();
    } catch (_) {
      return '';
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function bindLogoutButton(id) {
    const btn = el(id);
    if (!btn) return;
    btn.onclick = () => handleLogout(btn);
  }

  async function handleLogout(triggerBtn) {
    if (!cloudReady()) return;
    const originalText = triggerBtn?.textContent;
    if (triggerBtn) {
      triggerBtn.disabled = true;
      triggerBtn.textContent = 'Signing out…';
    }
    try {
      await cloud().logout();
      const state = cloud().getCloudState();
      renderAll(state);
      window.switchView?.('signin');
    } catch (err) {
      if (triggerBtn) {
        triggerBtn.disabled = false;
        triggerBtn.textContent = originalText || 'Sign Out';
      }
      const status = el('authFormStatus');
      if (status) {
        status.textContent = err.message || 'Sign out failed';
        status.className = 'auth-status error';
      }
    }
  }

  function bindProfilePageHandlers(state) {
    bindLogoutButton('profileBtnSignOut');

    el('profileBtnSync')?.addEventListener('click', async () => {
      const status = el('profileLinkStatus');
      try {
        await cloud().syncProfile();
        if (status) { status.textContent = 'Profile synced successfully'; status.className = 'sync-status ok'; }
        refreshOverviewWidgets(cloud().getCloudState());
        if (window.LeetLensDashboard?.refreshHeatmap) window.LeetLensDashboard.refreshHeatmap();
        else if (window.LeetLensHeatmap) window.LeetLensHeatmap.render(cloud().getCloudState());
        if (window.LeetLensAnalytics) window.LeetLensAnalytics.render();
        if (window.LeetLensDashboard) await window.LeetLensDashboard.reloadProblems();
        if (window.LeetLensDashboard?.refreshHeatmap) window.LeetLensDashboard.refreshHeatmap();
        renderProfilePage(cloud().getCloudState());
        renderSyncHub(cloud().getCloudState());
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('profileBtnLink')?.addEventListener('click', async () => {
      const username = el('profileLeetcodeInput')?.value?.trim();
      const status = el('profileLinkStatus');
      if (!username) return;
      try {
        if (status) { status.textContent = 'Validating…'; status.className = 'sync-status info'; }
        await cloud().linkLeetCodeUsername(username);
        if (status) { status.textContent = `Connected as @${username}`; status.className = 'sync-status ok'; }
        renderProfilePage(cloud().getCloudState());
        renderAuthPanel(cloud().getCloudState());
        renderSyncHub(cloud().getCloudState());
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('profileGhBtnLink')?.addEventListener('click', async () => {
      const username = el('profileGhInput')?.value?.trim();
      const status = el('profileGhStatus');
      if (!username) return;
      try {
        if (status) { status.textContent = 'Validating…'; status.className = 'sync-status info'; }
        await cloud().linkGithubUsername(username);
        if (status) { status.textContent = `Linked @${username}`; status.className = 'sync-status ok'; }
        renderProfilePage(cloud().getCloudState());
        renderSyncHub(cloud().getCloudState());
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('profileGhBtnSync')?.addEventListener('click', async () => {
      const status = el('profileGhStatus');
      try {
        if (status) { status.textContent = 'Syncing…'; status.className = 'sync-status info'; }
        await cloud().syncGithub();
        if (status) { status.textContent = 'GitHub synced'; status.className = 'sync-status ok'; }
        renderProfilePage(cloud().getCloudState());
        renderSyncHub(cloud().getCloudState());
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('profileEmailToggle')?.addEventListener('change', async e => {
      const profile = state.profile || {};
      await cloud().updateReminderSettings({
        emailRemindersEnabled: e.target.checked,
        reminderTime: profile.reminderTime || '10:00',
        timezone: profile.timezone || 'Asia/Kolkata'
      });
    });
  }

  function oauthSetupHtml() {
    if (!oauthReady()) {
      return `
        <div class="auth-status error">
          <p class="font-semibold">Google OAuth client ID missing</p>
          <p class="mt-1">Add Web Application client ID to <code>.env</code> as <code>VITE_GOOGLE_OAUTH_CLIENT_ID</code>, run <code>npm run build</code>, reload extension.</p>
        </div>`;
    }
    const info = (typeof cloud().getOAuthSetupInfo === 'function'
      ? cloud().getOAuthSetupInfo()
      : { redirectUri: getRedirectUri(), configured: oauthReady() });
    const uri = escapeHtml(info.redirectUri || getRedirectUri());
    return `
      <button type="button" id="authSetupToggle" class="auth-setup-toggle">⚙ OAuth setup (one-time) — click to expand</button>
      <div id="authSetupPanel" class="auth-setup-panel">
        <p>Add this <strong>Authorized redirect URI</strong> in Google Cloud Console → OAuth client:</p>
        <code>${uri}</code>
        <p class="mt-2">In Firebase → Authentication → Settings → Authorized domains, add:</p>
        <code>chrome-extension://YOUR_EXTENSION_ID</code>
        <p class="mt-2 text-[10px]">Open dashboard via extension popup (chrome-extension://), not localhost.</p>
      </div>`;
  }

  function bindAuthFormHandlers(state) {
    el('authTabSignIn')?.addEventListener('click', () => { authMode = 'signin'; renderSignInPage(state); });
    el('authTabSignUp')?.addEventListener('click', () => { authMode = 'signup'; renderSignInPage(state); });

    el('btnGoogleAuth')?.addEventListener('click', async () => {
      const btn = el('btnGoogleAuth');
      const originalHtml = btn?.innerHTML;
      if (btn) { btn.disabled = true; btn.innerHTML = '<span>Signing in…</span>'; }
      try {
        if (authMode === 'signup' && cloud().signUpGoogle) await cloud().signUpGoogle();
        else await cloud().login();
        window.switchView?.('profile');
      } catch (err) {
        if (btn) { btn.disabled = false; btn.innerHTML = originalHtml; }
        renderSignInPage({ ...(cloud().getCloudState?.() || state), error: err.message, loading: false });
      }
    });

    el('btnEmailAuth')?.addEventListener('click', async () => {
      const email = el('authEmail')?.value?.trim();
      const password = el('authPassword')?.value || '';
      const name = el('authDisplayName')?.value?.trim() || '';
      const status = el('authFormStatus');
      const btn = el('btnEmailAuth');
      if (!email || !password) {
        if (status) { status.textContent = 'Email and password are required'; status.className = 'auth-status error'; }
        return;
      }
      if (authMode === 'signup' && password.length < 6) {
        if (status) { status.textContent = 'Password must be at least 6 characters'; status.className = 'auth-status error'; }
        return;
      }
      try {
        if (btn) btn.disabled = true;
        if (status) { status.textContent = 'Please wait…'; status.className = 'auth-status info'; status.style.display = 'block'; }
        if (authMode === 'signup') await cloud().signUpWithEmailAccount(email, password, name);
        else await cloud().loginWithEmail(email, password);
        window.switchView?.('profile');
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'auth-status error'; status.style.display = 'block'; }
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    el('authSetupToggle')?.addEventListener('click', () => {
      el('authSetupPanel')?.classList.toggle('open');
    });

    bindLogoutButton('authSignedInLogout');
  }

  function renderSignInPage(state) {
    const container = el('signInPageContent');
    if (!container) return;

    if (!firebaseReady()) {
      container.innerHTML = `
        <div class="auth-state-card auth-state-card--error">
          <div class="auth-state-icon"><span class="material-symbols-outlined">cloud_off</span></div>
          <h2>Firebase not configured</h2>
          <p>Add credentials to <code>.env</code> and run <code>npm run build</code>, then reload the extension.</p>
        </div>`;
      return;
    }

    if (state.loading) {
      container.innerHTML = `
        <div class="auth-state-card">
          <div class="auth-state-spinner"></div>
          <p>Restoring session…</p>
        </div>`;
      return;
    }

    if (state.user) {
      const avatar = state.user.photoURL
        ? `<img src="${escapeHtml(state.user.photoURL)}" class="auth-signed-in-avatar" alt="">`
        : `<div class="auth-signed-in-placeholder"><span class="material-symbols-outlined text-4xl text-primary">person</span></div>`;
      const initial = (state.user.displayName || state.user.email || '?').charAt(0).toUpperCase();
      container.innerHTML = `
        <div class="auth-welcome-card">
          <div class="auth-welcome-glow"></div>
          <div class="auth-welcome-body">
            ${state.user.photoURL ? avatar : `<div class="auth-signed-in-placeholder"><span>${escapeHtml(initial)}</span></div>`}
            <div class="auth-welcome-text">
              <span class="auth-welcome-label">You're signed in</span>
              <h3>Welcome back, ${escapeHtml((state.user.displayName || 'there').split(' ')[0])}!</h3>
              <p>${escapeHtml(state.user.email || '')}</p>
            </div>
            <div class="auth-signed-in-actions">
              <button id="goToOverviewBtn" class="auth-btn-primary auth-btn-primary--inline">
                <span class="material-symbols-outlined text-base">dashboard</span>
                Go to Dashboard
              </button>
              <button id="goToProfileBtn" class="auth-btn-outline">
                <span class="material-symbols-outlined text-base">person</span>
                Profile
              </button>
              <button id="authSignedInLogout" class="auth-btn-logout">Sign Out</button>
            </div>
          </div>
        </div>`;
      el('goToProfileBtn')?.addEventListener('click', () => window.switchView?.('profile'));
      el('goToOverviewBtn')?.addEventListener('click', () => window.switchView?.('overview'));
      bindLogoutButton('authSignedInLogout');
      return;
    }

    const isSignUp = authMode === 'signup';
    container.innerHTML = `
      <div class="auth-page">
        <div class="auth-hero">
          <div class="auth-hero-glow"></div>
          <div class="auth-hero-inner">
            <div class="auth-brand">
              <span class="auth-brand-icon material-symbols-outlined">timer</span>
              <span class="auth-brand-name">LeetLens</span>
            </div>
            <div class="auth-hero-badge"><span class="material-symbols-outlined text-sm">cloud_sync</span> Cloud Sync</div>
            <h2>${isSignUp ? 'Start your coding journey' : 'Pick up where you left off'}</h2>
            <p>${isSignUp
              ? 'Create a free account to sync LeetCode progress, GitHub repos, and study plans across every device.'
              : 'Sign in to access your synced problems, analytics, heatmaps, and weekly study plans.'}</p>
            <div class="auth-features">
              <div class="auth-feature"><span class="material-symbols-outlined">code</span><span>LeetCode sync</span></div>
              <div class="auth-feature"><span class="material-symbols-outlined">school</span><span>Striver A2Z</span></div>
              <div class="auth-feature"><span class="material-symbols-outlined">insights</span><span>Analytics</span></div>
              <div class="auth-feature"><span class="material-symbols-outlined">calendar_month</span><span>Weekly plans</span></div>
            </div>
            <div class="auth-pills">
              <span class="auth-pill"><span class="material-symbols-outlined">verified_user</span> Secure</span>
              <span class="auth-pill"><span class="material-symbols-outlined">savings</span> Free</span>
              <span class="auth-pill"><span class="material-symbols-outlined">devices</span> Cross-device</span>
            </div>
          </div>
        </div>

        <div class="auth-card auth-form-card">
          <div class="auth-form-header">
            <h3>${isSignUp ? 'Create account' : 'Welcome back'}</h3>
            <p>${isSignUp ? 'Join LeetLens to back up and sync your progress.' : 'Sign in to continue to your dashboard.'}</p>
          </div>

          <div class="auth-tabs" role="tablist">
            <button type="button" id="authTabSignIn" class="auth-tab ${!isSignUp ? 'active' : ''}" role="tab">Sign In</button>
            <button type="button" id="authTabSignUp" class="auth-tab ${isSignUp ? 'active' : ''}" role="tab">Sign Up</button>
          </div>

          <div class="auth-form-fields">
            <div class="auth-field">
              <label for="authEmail">Email</label>
              <input id="authEmail" type="email" placeholder="you@example.com" autocomplete="email" inputmode="email" />
            </div>
            ${isSignUp ? `
            <div class="auth-field">
              <label for="authDisplayName">Display name</label>
              <input id="authDisplayName" type="text" placeholder="How should we call you?" autocomplete="name" />
            </div>` : ''}
            <div class="auth-field">
              <label for="authPassword">Password</label>
              <input id="authPassword" type="password" placeholder="Min. 6 characters" autocomplete="${isSignUp ? 'new-password' : 'current-password'}" />
            </div>
          </div>

          <button type="button" id="btnEmailAuth" class="auth-btn-primary">
            ${isSignUp ? 'Create Account' : 'Sign In with Email'}
          </button>
          <div id="authFormStatus" class="auth-status" style="display:none"></div>

          <div class="auth-divider"><span>or continue with</span></div>

          <button type="button" id="btnGoogleAuth" class="auth-btn-google" ${oauthReady() ? '' : 'disabled'}>
            ${GOOGLE_BTN_HTML}
            <span>${isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </button>

          <p class="auth-form-footer">${isSignUp
            ? 'Already have an account? <button type="button" id="authFooterSwitchSignIn" class="auth-link-btn">Sign in</button>'
            : 'New here? <button type="button" id="authFooterSwitchSignUp" class="auth-link-btn">Create an account</button>'}</p>

          ${state.error ? `<div class="auth-status error">${escapeHtml(state.error)}</div>` : ''}
          ${oauthSetupHtml()}
        </div>
      </div>`;

    bindAuthFormHandlers(state);
    el('authFooterSwitchSignIn')?.addEventListener('click', () => { authMode = 'signin'; renderSignInPage(state); });
    el('authFooterSwitchSignUp')?.addEventListener('click', () => { authMode = 'signup'; renderSignInPage(state); });
    const statusEl = el('authFormStatus');
    if (statusEl && !statusEl.textContent) statusEl.style.display = 'none';
  }

  function renderProfilePage(state) {
    const container = el('profilePageContent');
    if (!container) return;

    if (!state.user) {
      container.innerHTML = `
        <div class="profile-guest-card">
          <span class="material-symbols-outlined profile-guest-icon">lock</span>
          <h2>Sign in required</h2>
          <p>You need to sign in to view and manage your profile.</p>
          <button id="profileGoSignIn" class="auth-btn-primary auth-btn-primary--inline">Sign In</button>
        </div>`;
      el('profileGoSignIn')?.addEventListener('click', () => window.switchView?.('signin'));
      return;
    }

    const profile = state.profile || {};
    const stats = state.stats || {};
    const memberSince = profile.createdAt
      ? (profile.createdAt.toDate ? profile.createdAt.toDate().toLocaleDateString() : 'synced account')
      : 'recently joined';
    const lcLinked = Boolean(profile.leetcodeUsername);
    const ghLinked = Boolean(profile.githubUsername);

    container.innerHTML = `
      <div class="profile-page-card">
        <div class="profile-header">
          <div class="profile-header-main">
            ${state.user.photoURL
              ? `<img src="${escapeHtml(state.user.photoURL)}" class="profile-avatar" alt="">`
              : `<div class="profile-avatar profile-avatar--placeholder"><span class="material-symbols-outlined">person</span></div>`}
            <div class="profile-header-info">
              <h2>${escapeHtml(state.user.displayName || 'User')}</h2>
              <p class="profile-email">${escapeHtml(state.user.email)}</p>
              <p class="profile-member-since">Member since ${escapeHtml(memberSince)}</p>
            </div>
          </div>
          <button id="profileBtnSignOut" class="auth-btn-logout profile-signout-btn">Sign Out</button>
        </div>

        <div class="profile-stats-grid">
          <div class="profile-stat"><span class="profile-stat-label">Total Solved</span><span class="profile-stat-val text-primary">${stats.totalSolved ?? '—'}</span></div>
          <div class="profile-stat"><span class="profile-stat-label">Streak</span><span class="profile-stat-val">🔥 ${stats.streak ?? '—'}</span></div>
          <div class="profile-stat"><span class="profile-stat-label">Easy</span><span class="profile-stat-val text-diff-easy">${stats.easySolved ?? '—'}</span></div>
          <div class="profile-stat"><span class="profile-stat-label">Hard</span><span class="profile-stat-val text-diff-hard">${stats.hardSolved ?? '—'}</span></div>
        </div>

        <div class="profile-section">
          <h3 class="profile-section-title"><span class="profile-lc-icon" aria-hidden="true">${LEETCODE_LOGO_SVG}</span> LeetCode Account</h3>
          <div class="profile-link-row">
            <input id="profileLeetcodeInput" type="text" placeholder="LeetCode username" value="${escapeHtml(profile.leetcodeUsername || '')}" class="profile-input" />
            <div class="profile-link-actions">
              <button id="profileBtnLink" class="profile-btn profile-btn--secondary">Link</button>
              <button id="profileBtnSync" class="profile-btn profile-btn--primary" ${state.syncing ? 'disabled' : ''}>
                ${state.syncing ? 'Syncing…' : 'Sync Profile'}
              </button>
            </div>
          </div>
          <div id="profileLinkStatus" class="sync-status">${lcLinked ? `@${escapeHtml(profile.leetcodeUsername)} linked` : ''}</div>
        </div>

        <div class="profile-section">
          <h3 class="profile-section-title"><span class="material-symbols-outlined">account_circle</span> GitHub Account</h3>
          <div class="profile-link-row">
            <input id="profileGhInput" type="text" placeholder="GitHub username" value="${escapeHtml(profile.githubUsername || '')}" class="profile-input" />
            <div class="profile-link-actions">
              <button id="profileGhBtnLink" class="profile-btn profile-btn--secondary">Link</button>
              <button id="profileGhBtnSync" class="profile-btn profile-btn--primary" ${state.syncing ? 'disabled' : ''}>
                ${state.syncing ? 'Syncing…' : 'Sync GitHub'}
              </button>
            </div>
          </div>
          <div id="profileGhStatus" class="sync-status info">${profile.githubLastSyncedAt ? `Last synced: ${new Date(profile.githubLastSyncedAt).toLocaleString()}` : (ghLinked ? 'Linked — tap Sync to pull repos' : '')}</div>
          ${profile.githubStats?.publicRepos != null ? `<p class="profile-meta-line">${profile.githubStats.publicRepos} repos · ${profile.githubStats.totalStars || 0} stars</p>` : ''}
        </div>

        <div class="profile-section profile-section--last">
          <h3 class="profile-section-title"><span class="material-symbols-outlined">mail</span> Email Reminders</h3>
          <label class="profile-toggle-row">
            <input type="checkbox" id="profileEmailToggle" ${profile.emailRemindersEnabled !== false ? 'checked' : ''} />
            <span>Send daily reminder at 10:00 AM IST if I haven't solved a problem</span>
          </label>
        </div>
      </div>`;

    bindProfilePageHandlers(state);
  }

  function formatSyncTime(ts) {
    if (!ts) return null;
    return new Date(ts).toLocaleString();
  }

  function bindSyncHubHandlers() {
    el('ovLcLink')?.addEventListener('click', async () => {
      const username = el('ovLcInput')?.value?.trim();
      const status = el('ovLcStatus');
      if (!username) return;
      try {
        if (status) { status.textContent = 'Validating…'; status.className = 'sync-status info'; }
        await cloud().linkLeetCodeUsername(username);
        if (status) { status.textContent = `Linked @${username}`; status.className = 'sync-status ok'; }
        const s = cloud().getCloudState();
        renderSyncHub(s);
        renderAuthPanel(s);
        renderProfilePage(s);
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('ovLcSync')?.addEventListener('click', async () => {
      const status = el('ovLcStatus');
      try {
        if (status) { status.textContent = 'Syncing LeetCode…'; status.className = 'sync-status info'; }
        await cloud().syncProfile();
        if (status) { status.textContent = 'LeetCode synced successfully'; status.className = 'sync-status ok'; }
        const s = cloud().getCloudState();
        renderSyncHub(s);
        refreshOverviewWidgets(s);
        if (window.LeetLensDashboard?.refreshHeatmap) window.LeetLensDashboard.refreshHeatmap();
        else if (window.LeetLensHeatmap) window.LeetLensHeatmap.render(s);
        if (window.LeetLensAnalytics) window.LeetLensAnalytics.render();
        if (window.LeetLensDashboard) await window.LeetLensDashboard.reloadProblems();
        if (window.LeetLensDashboard?.refreshHeatmap) window.LeetLensDashboard.refreshHeatmap();
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('ovGhLink')?.addEventListener('click', async () => {
      const username = el('ovGhInput')?.value?.trim();
      const status = el('ovGhStatus');
      if (!username) return;
      try {
        if (status) { status.textContent = 'Validating…'; status.className = 'sync-status info'; }
        await cloud().linkGithubUsername(username);
        if (status) { status.textContent = `Linked @${username}`; status.className = 'sync-status ok'; }
        renderSyncHub(cloud().getCloudState());
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('ovGhSync')?.addEventListener('click', async () => {
      const status = el('ovGhStatus');
      try {
        if (status) { status.textContent = 'Syncing GitHub…'; status.className = 'sync-status info'; }
        await cloud().syncGithub();
        if (status) { status.textContent = 'GitHub synced'; status.className = 'sync-status ok'; }
        renderSyncHub(cloud().getCloudState());
      } catch (err) {
        if (status) { status.textContent = err.message; status.className = 'sync-status err'; }
      }
    });

    el('syncHubSignIn')?.addEventListener('click', () => window.switchView?.('signin'));
  }

  function isAccountFullySynced(profile) {
    return Boolean(
      profile?.leetcodeUsername &&
      profile?.leetcodeLastSyncedAt &&
      profile?.githubUsername &&
      profile?.githubLastSyncedAt
    );
  }

  function renderSyncHub(state) {
    const hub = el('syncHubPanel');
    if (!hub) return;

    if (!firebaseReady()) {
      hub.innerHTML = '';
      return;
    }

    if (!state.user) {
      hub.innerHTML = `
        <div class="overview-section-title"><span class="material-symbols-outlined text-base">cloud_sync</span> Account Sync</div>
        <div class="sync-card flex flex-wrap items-center justify-between gap-4">
          <div>
            <div class="text-sm font-semibold text-on-surface">Sign in to sync LeetCode & GitHub</div>
            <p class="text-xs text-on-surface-variant mt-1">Backup progress, import solved problems, and track your GitHub repos.</p>
          </div>
          <button id="syncHubSignIn" class="sync-btn sync-btn-primary px-6 py-3">Sign In</button>
        </div>`;
      bindSyncHubHandlers();
      return;
    }

    const profile = state.profile || {};
    const stats = state.stats || {};
    const gh = profile.githubStats || {};

    if (isAccountFullySynced(profile)) {
      hub.innerHTML = `
        <div class="overview-section-title"><span class="material-symbols-outlined text-base">cloud_done</span> Accounts Connected</div>
        <div class="sync-summary-card">
          <div class="sync-summary-item">
            <span class="sync-summary-icon lc" aria-hidden="true">${LEETCODE_LOGO_SVG}</span>
            <div class="sync-summary-text">
              <span class="sync-summary-label">LeetCode</span>
              <span class="sync-summary-value">@${escapeHtml(profile.leetcodeUsername)}</span>
              <span class="sync-summary-meta">${stats.totalSolved ?? 0} solved · Last sync ${formatSyncTime(profile.leetcodeLastSyncedAt)}</span>
            </div>
          </div>
          <div class="sync-summary-item">
            <span class="sync-summary-icon gh" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </span>
            <div class="sync-summary-text">
              <span class="sync-summary-label">GitHub</span>
              <span class="sync-summary-value">@${escapeHtml(profile.githubUsername)}</span>
              <span class="sync-summary-meta">${gh.publicRepos ?? 0} repos · Last sync ${formatSyncTime(profile.githubLastSyncedAt)}</span>
            </div>
          </div>
          <button type="button" id="syncHubGoProfile" class="sync-summary-manage">Manage in Profile</button>
        </div>`;
      el('syncHubGoProfile')?.addEventListener('click', () => window.switchView?.('profile'));
      return;
    }

    hub.innerHTML = `
      <div class="overview-section-title"><span class="material-symbols-outlined text-base">cloud_sync</span> Account Sync</div>
      <div class="sync-hub">
        <div class="sync-card">
          <div class="sync-card-header">
            <div class="sync-card-icon lc" aria-hidden="true">${LEETCODE_LOGO_SVG}</div>
            <div>
              <div class="text-sm font-bold text-on-surface">LeetCode Sync</div>
              <div class="text-xs text-on-surface-variant">${profile.leetcodeUsername ? `@${escapeHtml(profile.leetcodeUsername)}` : 'Not linked'}</div>
            </div>
          </div>
          <div class="sync-input-row">
            <input id="ovLcInput" type="text" placeholder="LeetCode username" value="${escapeHtml(profile.leetcodeUsername || '')}" class="sync-input" />
            <button id="ovLcLink" class="sync-btn sync-btn-secondary">Link</button>
            <button id="ovLcSync" class="sync-btn sync-btn-primary" ${state.syncing ? 'disabled' : ''}>${state.syncing ? '…' : 'Sync'}</button>
          </div>
          <div id="ovLcStatus" class="sync-status info">${profile.leetcodeLastSyncedAt ? `Last synced: ${formatSyncTime(profile.leetcodeLastSyncedAt)}` : 'Link username then sync'}</div>
          ${stats.totalSolved != null ? `
            <div class="sync-stats-row">
              <div class="sync-stat"><div class="sync-stat-val text-primary">${stats.totalSolved}</div><div class="sync-stat-label">Solved</div></div>
              <div class="sync-stat"><div class="sync-stat-val">🔥 ${stats.streak ?? 0}</div><div class="sync-stat-label">Streak</div></div>
              <div class="sync-stat"><div class="sync-stat-val text-diff-hard">${stats.hardSolved ?? 0}</div><div class="sync-stat-label">Hard</div></div>
            </div>` : ''}
        </div>

        <div class="sync-card">
          <div class="sync-card-header">
            <div class="sync-card-icon gh">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </div>
            <div>
              <div class="text-sm font-bold text-on-surface">GitHub Sync</div>
              <div class="text-xs text-on-surface-variant">${profile.githubUsername ? `@${escapeHtml(profile.githubUsername)}` : 'Not linked'}</div>
            </div>
          </div>
          <div class="sync-input-row">
            <input id="ovGhInput" type="text" placeholder="GitHub username" value="${escapeHtml(profile.githubUsername || '')}" class="sync-input" />
            <button id="ovGhLink" class="sync-btn sync-btn-secondary">Link</button>
            <button id="ovGhSync" class="sync-btn sync-btn-primary" ${state.syncing ? 'disabled' : ''}>${state.syncing ? '…' : 'Sync'}</button>
          </div>
          <div id="ovGhStatus" class="sync-status info">${profile.githubLastSyncedAt ? `Last synced: ${formatSyncTime(profile.githubLastSyncedAt)}` : 'Link username then sync'}</div>
          ${gh.publicRepos != null ? `
            <div class="sync-stats-row">
              <div class="sync-stat"><div class="sync-stat-val text-primary">${gh.publicRepos}</div><div class="sync-stat-label">Repos</div></div>
              <div class="sync-stat"><div class="sync-stat-val text-diff-medium">${gh.totalStars ?? 0}</div><div class="sync-stat-label">Stars</div></div>
              <div class="sync-stat"><div class="sync-stat-val">${gh.followers ?? 0}</div><div class="sync-stat-label">Followers</div></div>
            </div>` : ''}
        </div>
      </div>`;
    bindSyncHubHandlers();
  }

  function isOverviewActive() {
    return document.getElementById('view-overview')?.classList.contains('active');
  }

  function renderAuthPanel(state) {
    const panel = el('authPanel');
    if (!panel) return;

    if (state.user) {
      panel.classList.add('hidden');
      panel.innerHTML = '';
      return;
    }

    panel.classList.remove('hidden');

    if (!firebaseReady()) {
      panel.innerHTML = `
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <span>Cloud sync unavailable — run <code>npm run build</code> and reload extension</span>
          <button id="btnAuthPanelSetup" class="text-primary text-xs font-bold uppercase">Setup →</button>
        </div>`;
      el('btnAuthPanelSetup')?.addEventListener('click', () => window.switchView?.('signin'));
      return;
    }

    if (state.loading && !state.user) {
      panel.innerHTML = 'Restoring session…';
      return;
    }

    panel.innerHTML = `
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span class="font-semibold text-on-surface">Cloud sync available</span>
          <span class="text-xs text-on-surface-variant ml-2">Sign in to backup progress</span>
        </div>
        <button id="btnAuthPanelSignIn" class="px-4 py-2 rounded-xl bg-primary text-black text-xs font-bold uppercase">Sign In</button>
      </div>`;
    el('btnAuthPanelSignIn')?.addEventListener('click', () => window.switchView?.('signin'));
  }

  function updateNavAndHeader(state) {
    const signedIn = Boolean(state.user);
    ['navSignIn', 'navProfile'].forEach(id => {
      const node = el(id);
      if (!node) return;
      if (id.includes('SignIn')) node.classList.toggle('hidden', signedIn);
      if (id.includes('Profile')) node.classList.toggle('hidden', !signedIn);
    });

    const headerSignIn = el('headerSignInBtn');
    const headerSignOut = el('headerSignOutBtn');
    const headerProfile = el('headerProfileBtn');
    const headerAvatar = el('headerAvatar');
    const headerName = el('headerProfileName');

    const onOverview = isOverviewActive();
    if (headerSignIn) {
      headerSignIn.classList.toggle('hidden', signedIn || (!signedIn && onOverview));
      headerSignIn.onclick = () => window.switchView?.('signin');
    }
    if (headerSignOut) {
      headerSignOut.classList.toggle('hidden', !signedIn);
      bindLogoutButton('headerSignOutBtn');
    }
    if (headerProfile) {
      headerProfile.classList.toggle('hidden', !signedIn);
      headerProfile.classList.toggle('flex', signedIn);
      headerProfile.onclick = () => window.switchView?.('profile');
    }

    if (signedIn && state.user) {
      if (headerName) headerName.textContent = state.user.displayName?.split(' ')[0] || 'Profile';
      const mailIcon = el('headerMailIcon');
      const remindersOn = state.profile?.emailRemindersEnabled !== false;
      if (mailIcon) {
        mailIcon.classList.toggle('hidden', !remindersOn);
      }
      if (headerAvatar && state.user.photoURL) {
        headerAvatar.src = state.user.photoURL;
        headerAvatar.classList.remove('hidden');
      } else if (headerAvatar) {
        headerAvatar.classList.add('hidden');
      }
    }
  }

  function renderCloudStats(state) {
    const stats = state.stats;
    if (!stats) return;
    const map = {
      cloudTotalSolved: stats.totalSolved,
      cloudEasySolved: stats.easySolved,
      cloudMediumSolved: stats.mediumSolved,
      cloudHardSolved: stats.hardSolved,
      cloudStreak: stats.streak
    };
    Object.entries(map).forEach(([id, val]) => {
      const node = el(id);
      if (node && val != null) node.textContent = val;
    });
  }

  async function refreshOverviewWidgets(state) {
    renderCloudStats(state);
    if (window.LeetLensDashboard?.refreshHeatmap) window.LeetLensDashboard.refreshHeatmap();
    else if (window.LeetLensHeatmap) window.LeetLensHeatmap.render(state);
    if (window.LeetLensPlan) await window.LeetLensPlan.renderOverviewWidget();
    if (window.LeetLensStriver) await window.LeetLensStriver.renderOverviewWidget();
    if (window.LeetLensAnalytics) await window.LeetLensAnalytics.renderRecentActivity();
  }

  function renderAll(state) {
    if (!cloudReady()) return;
    renderAuthPanel(state);
    renderSyncHub(state);
    renderSignInPage(state);
    renderProfilePage(state);
    updateNavAndHeader(state);
    refreshOverviewWidgets(state);
    const syncLabel = el('syncStatusLabel');
    if (syncLabel) syncLabel.textContent = state.user ? 'Cloud Sync Active' : 'Local Storage Sync Active';
  }

  function renderBundleMissing() {
    const msg = `
      <div class="glass-panel p-8 rounded-xl text-center space-y-3">
        <span class="material-symbols-outlined text-4xl text-error">error</span>
        <h2 class="font-semibold text-on-surface">Cloud module failed to load</h2>
        <p class="text-sm text-on-surface-variant">Run <code>npm run build</code> in the extension folder, then reload the extension in <code>chrome://extensions</code>.</p>
        <p class="text-xs text-on-surface-variant">Load unpacked from: <code>leetcode-extension-main/leetcode-extension-main</code></p>
      </div>`;
    ['signInPageContent', 'profilePageContent', 'authPanel'].forEach(id => {
      const node = el(id);
      if (node) node.innerHTML = msg;
    });
  }

  async function waitForCloud(maxMs = 12000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const c = cloud();
      if (c && typeof c.initCloud === 'function' && typeof c.isFirebaseConfigured === 'function') {
        return true;
      }
      await new Promise(r => setTimeout(r, 100));
    }
    return cloudReady();
  }

  async function init() {
    const ready = await waitForCloud();
    if (!ready) {
      renderBundleMissing();
      return;
    }

    renderAll({ loading: true, user: null, profile: null, stats: null, error: null, syncing: false });

    await cloud().initCloud();
    cloud().onCloudStateChange(state => {
      renderAll(state);
      if (state.user && !state.loading && window.location.hash === '#signin') {
        window.switchView?.('profile');
      }
    });

    const records = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, r => resolve(r?.records || {}));
    });
    await cloud().syncLocalRecords(records);

    const hash = window.location.hash.replace('#', '');
    const validViews = ['overview', 'problems', 'revise', 'signin', 'profile', 'striver', 'plan', 'analytics', 'github'];
    if (validViews.includes(hash)) {
      window.switchView?.(hash);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LeetLensCloudUI = {
    refreshOverviewWidgets,
    renderAll,
    renderAuthPanel,
    updateNavAndHeader,
    renderSignInPage,
    renderProfilePage,
    renderSyncHub,
    handleLogout
  };
})();
