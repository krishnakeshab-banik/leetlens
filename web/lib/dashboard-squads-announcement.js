// One-time Squads feature announcement (hidden after 4 Jul 2026)

(function () {
  'use strict';

  const STORAGE_KEY = 'leetlens_squads_announcement_seen';
  /** Popup stops showing from 5 Jul 2026 00:00 local time */
  const CUTOFF_MS = new Date(2026, 6, 5).getTime();

  let modalEl = null;
  let wired = false;

  function isAuthCallback() {
    const { search, hash } = window.location;
    return /[?&](apiKey|authType|code|state)=/.test(search)
      || /(?:^|[?#&])(apiKey|authType)=/.test(hash);
  }

  function shouldShow() {
    if (Date.now() >= CUTOFF_MS) return false;
    if (isAuthCallback()) return false;
    if (new URLSearchParams(window.location.search).get('joinCode')) return false;
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1';
    } catch (_) {
      return false;
    }
  }

  function markSeen() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
  }

  function close() {
    if (modalEl) modalEl.classList.remove('open');
    document.body.classList.remove('squads-announcement-open');
    markSeen();
  }

  function goToSquads() {
    markSeen();
    if (modalEl) modalEl.classList.remove('open');
    document.body.classList.remove('squads-announcement-open');
    window.switchView?.('squads');
  }

  function wireEvents() {
    if (wired || !modalEl) return;
    wired = true;
    modalEl.querySelector('[data-squads-announce-close]')?.addEventListener('click', close);
    modalEl.querySelector('[data-squads-announce-later]')?.addEventListener('click', close);
    modalEl.querySelector('[data-squads-announce-cta]')?.addEventListener('click', goToSquads);
    modalEl.querySelector('.squads-announcement-backdrop')?.addEventListener('click', e => {
      if (e.target.classList.contains('squads-announcement-backdrop')) close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modalEl?.classList.contains('open')) close();
    });
  }

  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.id = 'squadsAnnouncementModal';
    modalEl.className = 'squads-announcement-modal';
    modalEl.innerHTML = `
      <div class="squads-announcement-backdrop" role="presentation">
        <div class="squads-announcement-box" role="dialog" aria-labelledby="squadsAnnounceTitle" aria-modal="true">
          <button type="button" class="squads-announcement-close" data-squads-announce-close aria-label="Close">
            <span class="material-symbols-outlined">close</span>
          </button>
          <div class="squads-announcement-glow"></div>
          <span class="squads-announcement-badge">New Feature</span>
          <div class="squads-announcement-icon">
            <span class="material-symbols-outlined">groups</span>
          </div>
          <h2 id="squadsAnnounceTitle" class="squads-announcement-title">Squads</h2>
          <p class="squads-announcement-desc">
            Compete with friends in private coding competitions. Create a squad, invite your crew, and climb the delta-score leaderboard together.
          </p>
          <ul class="squads-announcement-features">
            <li><span class="material-symbols-outlined">emoji_events</span> Daily, weekly &amp; monthly sprints</li>
            <li><span class="material-symbols-outlined">leaderboard</span> Live leaderboard &amp; final results</li>
            <li><span class="material-symbols-outlined">lock</span> LeetCode usernames stay private</li>
          </ul>
          <div class="squads-announcement-actions">
            <button type="button" class="squads-announcement-cta" data-squads-announce-cta>
              Try with your friends now
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
            <button type="button" class="squads-announcement-later" data-squads-announce-later>Maybe later</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modalEl);
    wireEvents();
    return modalEl;
  }

  function maybeShow() {
    if (!shouldShow()) return;
    ensureModal();
    requestAnimationFrame(() => {
      modalEl.classList.add('open');
      document.body.classList.add('squads-announcement-open');
    });
  }

  window.LeetLensSquadsAnnouncement = { maybeShow, close };
})();
