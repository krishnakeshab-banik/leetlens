// background.js — LeetCode Time Tracker Service Worker

let activeSession = null; // { slug, title, difficulty, startTime, tabId }
let trackedTabs = {}; // tabId -> { urls[], startedAt }

// ── helpers ────────────────────────────────────────────────────────────────
function now() { return Date.now(); }

async function getRecords() {
  return new Promise(resolve => {
    chrome.storage.local.get(['leetcodeRecords'], r =>
      resolve(r.leetcodeRecords || {})
    );
  });
}

async function saveRecords(records) {
  return new Promise(resolve => {
    chrome.storage.local.set({ leetcodeRecords: records }, resolve);
  });
}

async function upsertSession(slug, title, difficulty, elapsedMs) {
  const records = await getRecords();
  if (!records[slug]) {
    records[slug] = {
      slug,
      title,
      difficulty,
      totalMs: 0,
      sessions: 0,
      stars: 0,
      solved: false,
      openedTabs: [],
      firstSeen: now(),
      lastSeen: now()
    };
  }
  records[slug].totalMs += elapsedMs;
  records[slug].sessions += 1;
  records[slug].lastSeen = now();
  if (title && title !== 'Unknown') records[slug].title = title;
  if (difficulty && difficulty !== 'Unknown') records[slug].difficulty = difficulty;
  await saveRecords(records);
  return records[slug];
}

async function updateStars(slug, stars) {
  const records = await getRecords();
  if (records[slug]) {
    records[slug].stars = stars;
    await saveRecords(records);
  }
}

async function updateSolved(slug, solved) {
  const records = await getRecords();
  if (records[slug]) {
    records[slug].solved = solved;
    records[slug].lastSeen = now();
    await saveRecords(records);
    broadcastUpdate();
  }
}

// ── session management ─────────────────────────────────────────────────────
function startSession(slug, title, difficulty, tabId) {
  // flush any existing session first
  if (activeSession) flushSession();

  activeSession = { slug, title, difficulty, startTime: now(), tabId };
  trackedTabs[tabId] = { urls: [], startedAt: now() };
  console.log('[LCT] Session started:', slug);

  // heartbeat alarm every 30 s so service worker stays alive
  chrome.alarms.create('heartbeat', { periodInMinutes: 0.5 });
}

async function flushSession() {
  if (!activeSession) return;
  const elapsed = now() - activeSession.startTime;
  if (elapsed < 2000) { activeSession = null; return; } // ignore sub-2s blips
  await upsertSession(
    activeSession.slug,
    activeSession.title,
    activeSession.difficulty,
    elapsed
  );
  console.log('[LCT] Flushed session:', activeSession.slug, elapsed + 'ms');
  activeSession = null;
}

// ── broadcast updates to dashboard ─────────────────────────────────────────
async function broadcastUpdate() {
  const records = await getRecords();
  const session = activeSession;
  chrome.runtime.sendMessage({
    type: 'DASHBOARD_UPDATE',
    records,
    session
  }).catch(() => {
    // dashboard might not be open, that's ok
  });
}

// ── message handler ────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    switch (msg.type) {
      case 'PAGE_ENTER': {
        startSession(msg.slug, msg.title, msg.difficulty, sender.tab?.id);
        sendResponse({ ok: true });
        break;
      }
      case 'PAGE_LEAVE': {
        if (activeSession && activeSession.slug === msg.slug) {
          await flushSession();
        }
        sendResponse({ ok: true });
        break;
      }
      case 'UPDATE_META': {
        // content script found better title/difficulty after DOM settled
        if (activeSession && activeSession.slug === msg.slug) {
          activeSession.title = msg.title || activeSession.title;
          activeSession.difficulty = msg.difficulty || activeSession.difficulty;
        }
        sendResponse({ ok: true });
        break;
      }
      case 'SET_STARS': {
        await updateStars(msg.slug, msg.stars);
        broadcastUpdate();
        sendResponse({ ok: true });
        break;
      }
      case 'GET_RECORDS': {
        const records = await getRecords();
        sendResponse({ records });
        break;
      }
      case 'GET_CURRENT': {
        sendResponse({ session: activeSession });
        break;
      }
      case 'MARK_SOLVED': {
        await updateSolved(msg.slug, true);
        sendResponse({ ok: true });
        break;
      }
      case 'MARK_PENDING': {
        await updateSolved(msg.slug, false);
        sendResponse({ ok: true });
        break;
      }
      case 'GET_STATS': {
        const records = await getRecords();
        const stats = {
          total: Object.keys(records).length,
          solved: 0,
          pending: 0,
          easy: { total: 0, solved: 0 },
          medium: { total: 0, solved: 0 },
          hard: { total: 0, solved: 0 }
        };
        Object.values(records).forEach(r => {
          if (r.solved) stats.solved++; else stats.pending++;
          const diff = r.difficulty || 'Easy';
          if (stats[diff.toLowerCase()]) {
            stats[diff.toLowerCase()].total++;
            if (r.solved) stats[diff.toLowerCase()].solved++;
          }
        });
        sendResponse({ stats });
        break;
      }
      case 'GET_DATA': {
        const records = await getRecords();
        sendResponse({ records, session: activeSession });
        break;
      }
      case 'CLEAR_ALL': {
        await saveRecords({});
        broadcastUpdate();
        sendResponse({ ok: true });
        break;
      }
    }
  })();
  return true; // keep channel open for async
});

// ── tab/window lifecycle ───────────────────────────────────────────────────
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (activeSession && activeSession.tabId === tabId) {
    await flushSession();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    // navigating away
    if (activeSession && activeSession.tabId === tabId) {
      const url = tab.url || '';
      if (!url.includes('leetcode.com/problems/')) {
        await flushSession();
      }
    }
  }
});

// heartbeat — just keeps the worker alive; real flush happens on messages
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'heartbeat') {
    // no-op, just prevents termination
  }
});

// flush on startup in case previous session was dirty
chrome.runtime.onStartup.addListener(async () => {
  activeSession = null;
});
