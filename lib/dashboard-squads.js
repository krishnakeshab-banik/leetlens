(function () {
  'use strict';

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

  document.addEventListener('DOMContentLoaded', () => {
    const m = window.location.pathname.match(/\/squads\/join\/([A-Za-z0-9]+)/);
    if (m) {
      sessionStorage.setItem('squadsJoinCode', m[1].toUpperCase());
    }
  });
})();
