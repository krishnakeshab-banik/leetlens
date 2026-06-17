// content.js — runs on https://leetcode.com/problems/*

(function () {
  'use strict';

  // ── slug + meta extraction ───────────────────────────────────────────────
  function getSlug() {
    const m = location.pathname.match(/\/problems\/([^/]+)/);
    return m ? m[1] : null;
  }

  function getTitle() {
    // LeetCode renders title in several places depending on layout
    const selectors = [
      '[data-cy="question-title"]',
      '.mr-2.text-lg',
      'div[class*="title"] a',
      'h4[class*="title"]',
      '.css-v3d350',           // older layout
      'title'                  // last resort: page title
    ];
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) {
        const t = el.textContent.trim();
        if (t && t.length > 1 && t.toLowerCase() !== 'loading...') return t;
      }
    }
    // parse from document.title: "Two Sum - LeetCode"
    const pt = document.title.replace(/\s*[-|].*$/, '').trim();
    return pt || 'Unknown';
  }

  function getDifficulty() {
    const selectors = [
      '[diff]',
      '[class*="difficulty"]',
      '.css-10o4wqw',
      '.text-olive',
      '.text-yellow',
      '.text-pink'
    ];
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) {
        const t = el.textContent.trim();
        if (['Easy', 'Medium', 'Hard'].includes(t)) return t;
      }
    }
    // colour-class hints
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const cls = el.className || '';
      const t = el.textContent.trim();
      if (['Easy', 'Medium', 'Hard'].includes(t) && t === el.textContent.trim()) return t;
    }
    return 'Unknown';
  }

  // ── detect submission success ────────────────────────────────────────────
  function detectSubmissionSuccess() {
    // Check for specific accepted selectors to avoid matching general page statistics
    const selectors = [
      '[data-e2e-locator="submission-result"]',
      '[data-testid="result-accepted"]',
      'div[class*="accepted"]',
      '[class*="success"]',
      '.text-sd-green-1'
    ];

    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el && el.innerText && el.innerText.toLowerCase().includes('accepted')) {
        return true;
      }
    }

    return false;
  }

  // Real-time submission detection with MutationObserver
  let submissionObserver = null;
  function setupSubmissionDetection(slug) {
    // Kill previous observer
    if (submissionObserver) {
      submissionObserver.disconnect();
    }

    // Watch for DOM changes that might indicate submission result
    submissionObserver = new MutationObserver((mutations) => {
      // Debounce checks
      clearTimeout(submissionObserver.checkTimeout);
      submissionObserver.checkTimeout = setTimeout(() => {
        checkSubmissionStatus(slug);
      }, 100);
    });

    // Observe the entire body for changes
    submissionObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'data-testid', 'aria-label'],
      attributeOldValue: false
    });
  }

  // ── send to background ───────────────────────────────────────────────────
  let currentSlug = null;
  let metaSentAt = 0;
  let lastSolvedState = false;

  function sendEnter(slug) {
    chrome.runtime.sendMessage({
      type: 'PAGE_ENTER',
      slug,
      title: getTitle(),
      difficulty: getDifficulty()
    });
    currentSlug = slug;
    metaSentAt = Date.now();
  }

  function sendLeave(slug) {
    chrome.runtime.sendMessage({ type: 'PAGE_LEAVE', slug });
  }

  // After DOM settles (React hydration etc.), push better title/difficulty
  function sendMetaUpdate(slug) {
    if (Date.now() - metaSentAt < 500) return; // debounce
    metaSentAt = Date.now();
    chrome.runtime.sendMessage({
      type: 'UPDATE_META',
      slug,
      title: getTitle(),
      difficulty: getDifficulty()
    });
  }

  // Check for submission status periodically
  function checkSubmissionStatus(slug) {
    const isSolved = detectSubmissionSuccess();
    // Only auto-mark solved; never auto-unmark (user can do that manually)
    if (isSolved && !lastSolvedState) {
      lastSolvedState = true;
      chrome.runtime.sendMessage({ type: 'MARK_SOLVED', slug });
    }
  }

  // ── init ─────────────────────────────────────────────────────────────────
  const slug = getSlug();
  if (!slug) return;

  sendEnter(slug);

  // Re-send meta after React renders the content
  setTimeout(() => sendMetaUpdate(slug), 1500);
  setTimeout(() => sendMetaUpdate(slug), 4000);

  // Setup real-time submission detection
  setupSubmissionDetection(slug);

  // Also do periodic checks every 1 second as fallback
  setInterval(() => checkSubmissionStatus(slug), 1000);

  // Cleanup on page leave
  window.addEventListener('beforeunload', () => {
    sendLeave(slug);
  });

  // Observe DOM for SPA navigation (LeetCode is a Next.js app)
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      const prevSlug = currentSlug;
      lastUrl = location.href;
      const newSlug = getSlug();
      if (newSlug && newSlug !== prevSlug) {
        if (prevSlug) sendLeave(prevSlug);
        sendEnter(newSlug);
        setTimeout(() => sendMetaUpdate(newSlug), 1500);
        setTimeout(() => sendMetaUpdate(newSlug), 4000);
        // Reset submission detection for new problem
        setupSubmissionDetection(newSlug);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Flush on tab hide / close
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentSlug) sendLeave(currentSlug);
    else if (!document.hidden && currentSlug) sendEnter(currentSlug);
  });

  window.addEventListener('beforeunload', () => {
    if (currentSlug) sendLeave(currentSlug);
  });
})();
