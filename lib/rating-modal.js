// Personal difficulty rating modal (shown after solving)

(function () {
  'use strict';

  let modalEl = null;

  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.id = 'lct-rating-modal';
    modalEl.innerHTML = `
      <div class="lct-rating-modal-backdrop">
        <div class="lct-rating-modal-box">
          <div class="lct-rating-modal-title">How difficult was this for you?</div>
          <div class="lct-rating-modal-sub">Your personal rating helps track truly hard problems.</div>
          <div class="lct-rating-modal-stars" id="lct-rating-stars"></div>
          <button class="lct-rating-modal-skip" id="lct-rating-skip">Skip for now</button>
        </div>
      </div>`;
    document.body.appendChild(modalEl);

    const style = document.createElement('style');
    style.textContent = `
      #lct-rating-modal { display:none; position:fixed; inset:0; z-index:999999; }
      #lct-rating-modal.open { display:block; }
      .lct-rating-modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; }
      .lct-rating-modal-box { background:#111; border:1px solid rgba(255,161,22,0.3); border-radius:16px; padding:24px; width:320px; text-align:center; color:#e5e1e4; font-family:system-ui,sans-serif; }
      .lct-rating-modal-title { font-size:16px; font-weight:700; margin-bottom:6px; }
      .lct-rating-modal-sub { font-size:12px; color:#8b949e; margin-bottom:16px; }
      .lct-rating-modal-stars { display:flex; justify-content:center; gap:8px; margin-bottom:16px; }
      .lct-rating-modal-stars span { font-size:28px; cursor:pointer; color:#353437; transition:transform .15s,color .15s; }
      .lct-rating-modal-stars span:hover, .lct-rating-modal-stars span.lit { color:#fba315; transform:scale(1.15); }
      .lct-rating-modal-skip { background:transparent; border:1px solid rgba(255,255,255,0.15); color:#8b949e; padding:8px 16px; border-radius:8px; cursor:pointer; font-size:12px; }
    `;
    document.head.appendChild(style);
    return modalEl;
  }

  function showRatingModal(slug, title) {
    const modal = ensureModal();
    const starsEl = modal.querySelector('#lct-rating-stars');
    starsEl.innerHTML = Array.from({ length: 5 }, (_, i) => {
      const val = i + 1;
      return `<span data-val="${val}" title="${val} star${val > 1 ? 's' : ''}">★</span>`;
    }).join('');

    modal.classList.add('open');

    const close = () => modal.classList.remove('open');

    starsEl.querySelectorAll('span').forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.dataset.val, 10);
        chrome.runtime.sendMessage({ type: 'SET_STARS', slug, stars: val }, () => {
          chrome.runtime.sendMessage({ type: 'GET_RECORDS' }, res => {
            const record = res?.records?.[slug];
            if (window.LeetLensCloud?.getCloudState()?.user && record) {
              window.LeetLensCloud?.saveProblemRating(slug, val, record);
            }
          });
          close();
        });
      });
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.dataset.val, 10);
        starsEl.querySelectorAll('span').forEach((s, idx) => {
          s.classList.toggle('lit', idx < val);
        });
      });
    });

    modal.querySelector('#lct-rating-skip')?.addEventListener('click', close, { once: true });
    modal.querySelector('.lct-rating-modal-backdrop')?.addEventListener('click', e => {
      if (e.target.classList.contains('lct-rating-modal-backdrop')) close();
    }, { once: true });
  }

  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === 'SHOW_RATING_MODAL') {
      showRatingModal(msg.slug, msg.title);
    }
  });

  window.LeetLensRatingModal = { showRatingModal };
})();
