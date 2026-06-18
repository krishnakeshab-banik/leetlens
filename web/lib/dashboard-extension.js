// Extension status & install page

(function () {
  'use strict';

  const EXTENSION_ID = 'hahacfpglcbjeflkpolohnacmoadeopi';
  const STORE_URL = 'https://chromewebstore.google.com/detail/hahacfpglcbjeflkpolohnacmoadeopi?utm_source=item-share-cb';
  const PING_TIMEOUT_MS = 5000;

  function el(id) { return document.getElementById(id); }

  function isMobile() {
    return window.matchMedia('(max-width: 1023px)').matches;
  }

  function isExtensionContext() {
    return typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id) && !window.__LEETLENS_WEB__;
  }

  function isSignedIn() {
    return Boolean(window.LeetLensCloud?.getCloudState?.()?.user);
  }

  function sendRuntimeMessage(target, payload, timeoutMs = PING_TIMEOUT_MS) {
    return new Promise(resolve => {
      if (!chrome?.runtime?.sendMessage) {
        resolve(null);
        return;
      }
      const timer = setTimeout(() => resolve(null), timeoutMs);
      const done = response => {
        clearTimeout(timer);
        if (chrome.runtime?.lastError) {
          resolve(null);
          return;
        }
        resolve(response || null);
      };
      try {
        if (target) {
          chrome.runtime.sendMessage(target, payload, done);
        } else {
          chrome.runtime.sendMessage(payload, done);
        }
      } catch (_) {
        clearTimeout(timer);
        resolve(null);
      }
    });
  }

  async function pingExtension() {
    const response = await sendRuntimeMessage(EXTENSION_ID, { type: 'EXTENSION_PING' });
    if (!response?.ok) return { installed: false };
    return { installed: true, ...response };
  }

  async function getExtensionStatus() {
    if (isExtensionContext()) {
      const [recordsRes, sessionRes] = await Promise.all([
        sendRuntimeMessage(null, { type: 'GET_RECORDS' }),
        sendRuntimeMessage(null, { type: 'GET_CURRENT' })
      ]);
      const records = recordsRes?.records || {};
      const count = Object.keys(records).length;
      const solved = Object.values(records).filter(r => r.solved).length;
      const session = sessionRes?.session;
      return {
        mode: 'active',
        installed: true,
        inUse: Boolean(session?.slug),
        currentProblem: session?.title || session?.slug || null,
        recordCount: count,
        solvedCount: solved,
        version: chrome.runtime.getManifest?.()?.version || '1.0.0'
      };
    }

    const ping = await pingExtension();
    if (ping.installed) {
      return {
        mode: 'connected',
        installed: true,
        inUse: Boolean(ping.inUse),
        currentProblem: ping.currentProblem || null,
        recordCount: ping.recordCount || 0,
        solvedCount: ping.solvedCount || 0,
        version: ping.version || '1.0.0'
      };
    }

    return { mode: 'missing', installed: false, inUse: false, recordCount: 0, solvedCount: 0 };
  }

  function renderLoading() {
    const container = el('extensionContent');
    if (!container) return;
    container.innerHTML = `
      <div class="ext-hero">
        <div class="auth-state-spinner mx-auto mb-4"></div>
        <h2 class="ext-hero-title">Checking extension…</h2>
        <p class="ext-hero-sub">Detecting whether LeetLens is installed in your browser.</p>
      </div>`;
  }

  function bindSyncButton(statusElId) {
    el('extSyncCloud')?.addEventListener('click', async () => {
      const btn = el('extSyncCloud');
      const status = el(statusElId);
      if (!isSignedIn()) {
        window.switchView?.('signin');
        return;
      }
      if (btn) { btn.disabled = true; btn.textContent = 'Syncing…'; }
      if (status) {
        status.style.display = 'block';
        status.textContent = 'Syncing local extension data to cloud…';
        status.className = 'sync-status info';
      }
      try {
        const target = isExtensionContext() ? null : EXTENSION_ID;
        const recordsRes = await sendRuntimeMessage(target, { type: 'GET_RECORDS' });
        const records = recordsRes?.records || {};
        if (!Object.keys(records).length) {
          throw new Error('No local extension data found. Solve a problem on LeetCode first.');
        }
        await window.LeetLensCloud?.syncLocalRecords?.(records);
        if (status) {
          status.textContent = 'Sync complete! Your extension data is backed up to the cloud.';
          status.className = 'sync-status ok';
        }
        if (window.LeetLensCloudUI) {
          window.LeetLensCloudUI.renderAll(window.LeetLensCloud.getCloudState());
        }
      } catch (err) {
        if (status) {
          status.style.display = 'block';
          status.textContent = err.message || 'Sync failed';
          status.className = 'sync-status err';
        }
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Sync to Cloud'; }
      }
    });
  }

  function renderInstalledPanel(status, mode) {
    const signedIn = isSignedIn();
    const syncBlock = signedIn ? `
      <button id="extSyncCloud" class="ext-install-btn mt-6">
        <span class="material-symbols-outlined">cloud_sync</span>
        Sync to Cloud
      </button>
      <p id="extSyncStatus" class="sync-status mt-3" style="display:none"></p>` : `
      <button id="extGoSignIn" class="ext-install-btn mt-6">
        <span class="material-symbols-outlined">login</span>
        Sign In to Sync
      </button>
      <p class="text-xs text-on-surface-variant mt-3">Sign in first, then sync your extension solves to the cloud.</p>`;

    const heroClass = mode === 'active' ? 'ext-hero ext-hero-active' : 'ext-status-card ext-connected';
    const title = mode === 'active' ? 'Extension Active' : 'Extension Installed';
    const subtitle = mode === 'active'
      ? 'LeetLens is running in this dashboard. Problems you solve on LeetCode are tracked automatically.'
      : 'LeetLens is installed in Chrome. Use the web dashboard to sign in and sync your local solves to the cloud.';

    return `
      <div class="${heroClass}">
        ${mode === 'active' ? '<span class="ext-live-dot"></span>' : '<span class="material-symbols-outlined ext-status-icon ok">extension</span>'}
        <h2 class="${mode === 'active' ? 'ext-hero-title' : 'ext-status-title'}">${title}</h2>
        <p class="${mode === 'active' ? 'ext-hero-sub' : 'ext-status-desc'}">${subtitle}</p>
      </div>
      <div class="ext-grid">
        <div class="ext-stat-card">
          <span class="material-symbols-outlined text-diff-easy">check_circle</span>
          <div class="ext-stat-val">${status.solvedCount}</div>
          <div class="ext-stat-label">Solved (local)</div>
        </div>
        <div class="ext-stat-card">
          <span class="material-symbols-outlined text-primary">list_alt</span>
          <div class="ext-stat-val">${status.recordCount}</div>
          <div class="ext-stat-label">Tracked Problems</div>
        </div>
        <div class="ext-stat-card">
          <span class="material-symbols-outlined text-diff-medium">info</span>
          <div class="ext-stat-val text-base">v${status.version}</div>
          <div class="ext-stat-label">Version</div>
        </div>
      </div>
      <div class="glass-panel p-5 sm:p-6 rounded-xl">
        <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">Current Status</div>
        ${status.inUse ? `
          <div class="ext-active-session">
            <span class="material-symbols-outlined text-primary animate-pulse">timer</span>
            <div>
              <div class="text-sm font-semibold text-on-surface">Tracking now</div>
              <div class="text-xs text-on-surface-variant">${status.currentProblem}</div>
            </div>
          </div>` : `
          <div class="text-sm text-on-surface-variant">No active LeetCode session. Open a problem on leetcode.com to start tracking.</div>`}
        <div class="ext-tips mt-5 space-y-2 text-xs text-on-surface-variant">
          <div>✓ Timer runs in the LeetCode sidebar</div>
          <div>✓ Mark solved &amp; rate difficulty from the extension</div>
          <div>✓ Sync local data to cloud when signed in</div>
        </div>
        ${syncBlock}
        <button id="extRecheck" class="ext-install-btn secondary mt-3">Re-check Extension</button>
      </div>`;
  }

  async function render() {
    const container = el('extensionContent');
    if (!container) return;

    if (isMobile()) {
      container.innerHTML = `
        <div class="glass-panel p-6 rounded-xl ext-mobile-notice text-center">
          <span class="material-symbols-outlined text-4xl text-primary mb-3">phone_android</span>
          <h2 class="text-lg font-bold text-on-surface mb-2">Desktop Only</h2>
          <p class="text-sm text-on-surface-variant">The LeetLens Chrome extension runs on desktop browsers. Open this dashboard on a laptop to install and sync.</p>
        </div>`;
      return;
    }

    renderLoading();

    const status = await getExtensionStatus();

    if (status.mode === 'active' || status.mode === 'connected') {
      container.innerHTML = renderInstalledPanel(status, status.mode);
      bindSyncButton('extSyncStatus');
      el('extGoSignIn')?.addEventListener('click', () => window.switchView?.('signin'));
      el('extRecheck')?.addEventListener('click', () => render());
      return;
    }

    container.innerHTML = `
      <div class="ext-hero">
        <div class="ext-hero-glow"></div>
        <span class="material-symbols-outlined ext-hero-icon">extension_off</span>
        <h2 class="ext-hero-title">Extension Not Detected</h2>
        <p class="ext-hero-sub">Install LeetLens on desktop Chrome to track time on every LeetCode problem. After installing, come back here — we'll detect it automatically and let you sync.</p>
      </div>

      <div class="glass-panel p-5 sm:p-6 rounded-xl ext-install-panel">
        <div class="ext-install-steps">
          <div class="ext-step"><span class="ext-step-num">1</span><div><strong>Install</strong><p>Add LeetLens from the Chrome Web Store (desktop Chrome, Brave, or Edge)</p></div></div>
          <div class="ext-step"><span class="ext-step-num">2</span><div><strong>Open LeetCode</strong><p>Visit any problem — the timer sidebar appears automatically</p></div></div>
          <div class="ext-step"><span class="ext-step-num">3</span><div><strong>Sync</strong><p>Return here, sign in, and tap Sync to Cloud on this page</p></div></div>
        </div>
        <a href="${STORE_URL}" target="_blank" rel="noopener" class="ext-install-btn">
          <span class="material-symbols-outlined">download</span>
          Install from Chrome Web Store
        </a>
        <button id="extRecheck" class="ext-install-btn secondary mt-3">Already installed? Re-check</button>
        <p class="text-[10px] text-on-surface-variant/60 text-center mt-4">Use Chrome on desktop · Reload this page after installing</p>
      </div>

      <div class="glass-panel p-5 sm:p-6 rounded-xl">
        <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">What the extension adds</div>
        <div class="ext-feature-grid">
          <div class="ext-feature"><span class="material-symbols-outlined">timer</span><span>Per-problem timer</span></div>
          <div class="ext-feature"><span class="material-symbols-outlined">star</span><span>Difficulty rating</span></div>
          <div class="ext-feature"><span class="material-symbols-outlined">cloud_sync</span><span>Cloud backup</span></div>
          <div class="ext-feature"><span class="material-symbols-outlined">autorenew</span><span>Spaced revision</span></div>
        </div>
      </div>`;

    el('extRecheck')?.addEventListener('click', () => render());
  }

  window.LeetLensExtension = { render, getExtensionStatus };
})();
