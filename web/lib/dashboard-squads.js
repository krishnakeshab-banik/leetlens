(function () {
  'use strict';

  const JOIN_CODE_KEY = 'squadsJoinCode';
  const PENDING_JOIN_KEY = 'squadsPendingAutoJoin';

  function getJoinCodeFromUrl() {
    const fromQuery = new URLSearchParams(window.location.search).get('joinCode');
    if (fromQuery) return fromQuery.trim().toUpperCase();
    const match = window.location.pathname.match(/\/squads\/join\/([^/?#]+)/i);
    if (match) return decodeURIComponent(match[1]).trim().toUpperCase();
    return null;
  }

  function rememberJoinCode(code) {
    if (!code) return;
    try {
      sessionStorage.setItem(JOIN_CODE_KEY, String(code).trim().toUpperCase());
    } catch (_) {}
  }

  function markPendingAutoJoin(code) {
    if (!code) return;
    rememberJoinCode(code);
    try {
      sessionStorage.setItem(PENDING_JOIN_KEY, String(code).trim().toUpperCase());
    } catch (_) {}
  }

  function readStoredJoinCode() {
    try {
      return sessionStorage.getItem(JOIN_CODE_KEY)
        || sessionStorage.getItem(PENDING_JOIN_KEY)
        || null;
    } catch (_) {
      return null;
    }
  }

  function clearPendingJoin() {
    try { sessionStorage.removeItem(PENDING_JOIN_KEY); } catch (_) {}
  }

  function cleanInviteUrl() {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('joinCode')) return;
      url.searchParams.delete('joinCode');
      const next = url.pathname + (url.search || '') + (url.hash || '');
      window.history.replaceState({}, '', next);
    } catch (_) {}
  }

  async function resumeJoinFlowWhenReady() {
    const code = readStoredJoinCode() || getJoinCodeFromUrl();
    if (!code) return;

    rememberJoinCode(code);
    markPendingAutoJoin(code);

    window.switchView?.('squads');

    try {
      if (window.LeetLensCloud?.ensureAuthBoot) {
        await window.LeetLensCloud.ensureAuthBoot();
      }
    } catch (_) {}

    if (window.LeetLensSquads) {
      window.LeetLensSquads.render('squads', {
        code,
        tab: 'join',
        autoJoin: true
      });
    }
  }

  function openSquadsJoinFlow() {
    resumeJoinFlowWhenReady();
  }

  window.LeetLensSquads = {
    render(viewId, params) {
      if (!window.LeetLensSquadsUI) return;
      window.LeetLensSquadsUI.render(viewId || 'squads', params || {});
    },
    openDetail(squadId) {
      window.LeetLensSquadsUI?.openDetail(squadId);
    },
    openResults(squadId) {
      window.LeetLensSquadsUI?.openResults(squadId);
    },
    stopPolling() {
      window.LeetLensSquadsUI?.stopPolling();
    }
  };

  window.LeetLensSquadsJoin = {
    getJoinCodeFromUrl,
    readStoredJoinCode,
    rememberJoinCode,
    markPendingAutoJoin,
    clearPendingJoin,
    cleanInviteUrl,
    openSquadsJoinFlow,
    resumeJoinFlowWhenReady,
    hasPendingJoin() {
      try {
        return !!sessionStorage.getItem(PENDING_JOIN_KEY);
      } catch (_) {
        return false;
      }
    }
  };

  const inviteCode = getJoinCodeFromUrl();
  if (inviteCode) {
    markPendingAutoJoin(inviteCode);
  }
})();
