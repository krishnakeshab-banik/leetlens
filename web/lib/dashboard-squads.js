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
      sessionStorage.setItem(JOIN_CODE_KEY, code);
      sessionStorage.setItem(PENDING_JOIN_KEY, code);
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

  function openSquadsJoinFlow() {
    const code = readStoredJoinCode() || getJoinCodeFromUrl();
    if (code) rememberJoinCode(code);
    const params = code ? { code, tab: 'join', autoJoin: true } : undefined;
    window.switchView?.('squads');
    if (params && window.LeetLensSquads) {
      window.LeetLensSquads.render('squads', params);
    }
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
    clearPendingJoin,
    openSquadsJoinFlow,
    hasPendingJoin() {
      return !!(readStoredJoinCode() || getJoinCodeFromUrl());
    }
  };

  const inviteCode = getJoinCodeFromUrl();
  if (inviteCode) {
    rememberJoinCode(inviteCode);
    const boot = () => {
      if (!window.LeetLensSquadsUI) {
        window.setTimeout(boot, 50);
        return;
      }
      openSquadsJoinFlow();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }
})();
