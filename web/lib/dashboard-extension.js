// Extension status & install page

(function () {
  'use strict';

  const EXTENSION_ID = 'hahacfpglcbjeflkpolohnacmoadeopi';
  const STORE_URL = 'https://chromewebstore.google.com/detail/hahacfpglcbjeflkpolohnacmoadeopi?utm_source=item-share-cb';

  function el(id) { return document.getElementById(id); }

  function isMobile() {
    return window.matchMedia('(max-width: 1023px)').matches;
  }

  function isExtensionContext() {
    return typeof chrome !== 'undefined' && chrome.runtime?.id && !isWebDashboard();
  }

  function isWebDashboard() {
    return Boolean(window.__LEETLENS_WEB__)
      || (typeof location !== 'undefined' && /^https?:/.test(location.protocol));
  }

  function isWebShimChrome() {
    return isWebDashboard()
      && typeof chrome?.runtime?.sendMessage === 'function'
      && typeof chrome?.runtime?.getManifest !== 'function';
  }

  function canPingExternalExtension() {
    if (!chrome?.runtime?.sendMessage) return false;
    // Local web shim cannot reach the real browser extension.
    if (isWebShimChrome()) return false;
    return true;
  }

  function runtimeSend(message, extensionId, timeoutMs = 3000) {
    return new Promise(resolve => {
      if (!chrome?.runtime?.sendMessage) {
        resolve(null);
        return;
      }
      let settled = false;
      const finish = value => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(value);
      };
      const timer = setTimeout(() => finish(null), timeoutMs);
      const onResponse = response => {
        if (chrome.runtime?.lastError) {
          finish(null);
          return;
        }
        finish(response ?? null);
      };
      try {
        if (extensionId) {
          chrome.runtime.sendMessage(extensionId, message, onResponse);
        } else {
          chrome.runtime.sendMessage(message, onResponse);
        }
      } catch (_) {
        finish(null);
      }
    });
  }

  async function pingExtension() {
    if (!canPingExternalExtension()) {
      return { installed: false, active: false };
    }
    const response = await runtimeSend({ type: 'EXTENSION_PING' }, EXTENSION_ID);
    if (!response?.ok) {
      return { installed: false, active: false };
    }
    return { installed: true, active: true, ...response };
  }

  async function getExtensionStatus() {
    if (isExtensionContext()) {
      const [recordsRes, sessionRes] = await Promise.all([
        runtimeSend({ type: 'GET_RECORDS' }),
        runtimeSend({ type: 'GET_CURRENT' })
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
        inUse: ping.inUse,
        currentProblem: ping.currentProblem,
        recordCount: ping.recordCount || 0,
        solvedCount: ping.solvedCount || 0,
        version: ping.version || '1.0.0'
      };
    }

    return { mode: 'missing', installed: false, inUse: false };
  }

  function renderMissingPage(mobile) {
    const mobileNote = mobile ? `
      <div class="glass-panel p-4 sm:p-5 rounded-xl border border-primary/20 bg-primary/5 mb-6">
        <div class="flex gap-3 items-start">
          <span class="material-symbols-outlined text-primary shrink-0">laptop_mac</span>
          <div class="text-sm text-on-surface-variant">
            <strong class="text-on-surface">Works on laptop &amp; desktop</strong>
            <p class="mt-1">The LeetLens extension runs in Chrome, Brave, or Edge on a computer. Open this page on a laptop or desktop to install and start tracking on LeetCode.</p>
          </div>
        </div>
      </div>` : '';

    const footerNote = mobile
      ? '<p class="text-[10px] text-on-surface-variant/60 text-center mt-4">Install from a laptop or desktop browser</p>'
      : '<p class="text-[10px] text-on-surface-variant/60 text-center mt-4">Not available on mobile · Chrome, Brave, Edge supported</p>';

    return `
      <div class="ext-hero">
        <div class="ext-hero-glow"></div>
        <span class="material-symbols-outlined ext-hero-icon">extension_off</span>
        <h2 class="ext-hero-title">Extension Not Detected</h2>
        <p class="ext-hero-sub">Install LeetLens to track time on every LeetCode problem. Your solves sync here automatically — including problems done before installing.</p>
      </div>

      ${mobileNote}

      <div class="glass-panel p-5 sm:p-6 rounded-xl ext-install-panel">
        <div class="ext-install-steps">
          <div class="ext-step"><span class="ext-step-num">1</span><div><strong>Install</strong><p>Add LeetLens from the Chrome Web Store${mobile ? ' on a laptop or desktop' : ' (desktop only)'}</p></div></div>
          <div class="ext-step"><span class="ext-step-num">2</span><div><strong>Open LeetCode</strong><p>Visit any problem — the timer sidebar appears automatically</p></div></div>
          <div class="ext-step"><span class="ext-step-num">3</span><div><strong>Sync</strong><p>Sign in here and link LeetCode to merge all your solves</p></div></div>
        </div>
        <a href="${STORE_URL}" target="_blank" rel="noopener" class="ext-install-btn">
          <span class="material-symbols-outlined">download</span>
          Install from Chrome Web Store
        </a>
        ${footerNote}
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
  }

  async function render() {
    const container = el('extensionContent');
    if (!container) return;

    const mobile = isMobile();
    const onWebsite = isWebDashboard() && !isExtensionContext();

    // On the hosted website, show the install page immediately (no blank wait).
    if (onWebsite) {
      container.innerHTML = renderMissingPage(mobile);
    }

    try {
      const status = await getExtensionStatus();

      if (status.mode === 'active') {
        container.innerHTML = `
        <div class="ext-hero ext-hero-active">
          <div class="ext-hero-glow"></div>
          <span class="ext-live-dot"></span>
          <h2 class="ext-hero-title">Extension Active</h2>
          <p class="ext-hero-sub">LeetLens is running and connected to this dashboard. Problems you solve on LeetCode are tracked automatically.</p>
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
            <div>✓ Mark solved & rate difficulty from the extension</div>
            <div>✓ Data syncs to cloud when signed in</div>
          </div>
        </div>`;
        return;
      }

      if (status.mode === 'connected') {
        container.innerHTML = `
        <div class="ext-status-card ext-connected">
          <span class="material-symbols-outlined ext-status-icon ok">extension</span>
          <h2 class="ext-status-title">Extension Installed</h2>
          <p class="ext-status-desc">LeetLens is installed in your browser but this dashboard tab is not inside the extension. Open the dashboard from the extension popup for full integration.</p>
          <div class="ext-grid mt-6">
            <div class="ext-stat-card"><div class="ext-stat-val">${status.solvedCount}</div><div class="ext-stat-label">Solved</div></div>
            <div class="ext-stat-card"><div class="ext-stat-val">${status.recordCount}</div><div class="ext-stat-label">Tracked</div></div>
          </div>
          <button id="extOpenPopup" class="ext-install-btn mt-6">Open Extension Popup</button>
        </div>`;
        el('extOpenPopup')?.addEventListener('click', () => {
          window.open(STORE_URL, '_blank');
        });
        return;
      }

      container.innerHTML = renderMissingPage(mobile);
    } catch (_) {
      container.innerHTML = renderMissingPage(isMobile());
    }
  }

  window.LeetLensExtension = { render, getExtensionStatus };
})();
