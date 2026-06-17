// Developers page

(function () {
  'use strict';

  const DEVS = [
    {
      name: 'Arihant Jain',
      reg: 'RA2311028010118',
      university: 'SRM University of Science and Technology, Kattankulathur',
      batch: '2023 – 2027',
      role: 'Developer',
      photo: 'assets/developers/arihant.png',
      instagram: 'https://www.instagram.com/arihannttt/',
      linkedin: 'https://www.linkedin.com/in/arihantjain6739',
      github: 'https://github.com/arihantjain6739'
    },
    {
      name: 'Krishna Keshab Banik',
      reg: 'RA2411026011003',
      university: 'SRM University of Science and Technology, Kattankulathur',
      batch: '2024 – 2028',
      role: 'Developer',
      photo: 'assets/developers/krishna.png',
      instagram: 'https://www.instagram.com/krish.banik.1234?igsh=YXNhYThlNnUwYjNr',
      linkedin: 'https://www.linkedin.com/in/krishna-keshab-banik-067819324',
      github: 'https://github.com/krishnakeshab-banik'
    }
  ];

  function el(id) { return document.getElementById(id); }

  function socialBtn(href, label, icon) {
    if (!href) return '';
    return `<a href="${href}" target="_blank" rel="noopener" class="dev-social-btn">
      <span class="material-symbols-outlined text-sm">${icon}</span>${label}
    </a>`;
  }

  function render() {
    const container = el('developersContent');
    if (!container) return;

    container.innerHTML = `
      <div class="dev-hero">
        <div class="dev-hero-glow"></div>
        <span class="dev-badge"><span class="material-symbols-outlined text-sm">school</span> Built by the students, built for the students</span>
        <h2 class="dev-hero-title">Meet the LeetLens Team</h2>
        <p class="dev-hero-sub">LeetLens is a LeetCode productivity platform built by students at SRM IST — combining time tracking, cloud sync, analytics, and spaced revision into one extension.</p>
      </div>

      <a href="https://srminsider.in" target="_blank" rel="noopener" class="srm-insider-banner">
        <div class="srm-insider-glow"></div>
        <div class="srm-insider-content">
          <div class="srm-insider-icon">
            <span class="material-symbols-outlined">auto_stories</span>
          </div>
          <div class="srm-insider-text">
            <div class="srm-insider-tag">From the same campus</div>
            <div class="srm-insider-title">SRM Insider</div>
            <div class="srm-insider-sub">Campus news, resources & student life at SRM IST — visit srminsider.in</div>
          </div>
          <span class="material-symbols-outlined srm-insider-arrow">arrow_forward</span>
        </div>
      </a>

      <div class="dev-grid">
        ${DEVS.map(d => `
          <div class="dev-card">
            <div class="dev-photo-wrap">
              <img src="${d.photo}" alt="${d.name}" class="dev-photo" />
              <div class="dev-photo-ring"></div>
            </div>
            <h3 class="dev-name">${d.name}</h3>
            <p class="dev-role">${d.role}</p>
            <div class="dev-meta">
              <div><span class="dev-meta-label">Reg. No</span><span>${d.reg}</span></div>
              <div><span class="dev-meta-label">University</span><span>${d.university}</span></div>
              <div><span class="dev-meta-label">Batch</span><span>${d.batch}</span></div>
            </div>
            <div class="dev-socials">
              ${socialBtn(d.github, 'GitHub', 'code')}
              ${socialBtn(d.linkedin, 'LinkedIn', 'work')}
              ${socialBtn(d.instagram, 'Instagram', 'photo_camera')}
            </div>
          </div>`).join('')}
      </div>

      <div class="dev-footer glass-panel p-6 rounded-xl text-center">
        <p class="text-sm text-on-surface-variant">LeetLens — Track smarter. Revise better. Sync everywhere.</p>
        <p class="text-xs text-on-surface-variant/60 mt-2">Built by the students, built for the students · SRM University of Science and Technology</p>
      </div>`;
  }

  window.LeetLensDevelopers = { render };
})();
