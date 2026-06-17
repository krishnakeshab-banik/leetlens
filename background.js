// background.js — LeetCode Time Tracker Service Worker

try {
  importScripts('lib/background-bundle.js');
} catch (e) {
  console.warn('[LCT] Cloud bundle not built yet. Run npm run build.');
}

let activeSession = null; // { slug, title, difficulty, startTime, tabId, paused, pausedAt, activityId }
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
  if (!records[slug]) {
    const title = (activeSession && activeSession.slug === slug) ? activeSession.title : 'Unknown';
    const difficulty = (activeSession && activeSession.slug === slug) ? activeSession.difficulty : 'Unknown';
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
  records[slug].stars = stars;
  await saveRecords(records);
  broadcastUpdate();
}

async function updateSolved(slug, solved) {
  const records = await getRecords();
  if (!records[slug]) {
    const title = (activeSession && activeSession.slug === slug) ? activeSession.title : 'Unknown';
    const difficulty = (activeSession && activeSession.slug === slug) ? activeSession.difficulty : 'Unknown';
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
  records[slug].solved = solved;
  records[slug].lastSeen = now();
  if (solved) {
    records[slug].solvedAt = now(); // timestamp for revision scheduling
  } else {
    records[slug].solvedAt = null;  // clear schedule when marking pending
  }
  await saveRecords(records);
  broadcastUpdate();
}

async function deleteRecord(slug) {
  const records = await getRecords();
  if (records[slug]) {
    delete records[slug];
    await saveRecords(records);
    if (activeSession && activeSession.slug === slug) {
      activeSession = null;
    }
    broadcastUpdate();
  }
}


// ── session management ─────────────────────────────────────────────────────
function startSession(slug, title, difficulty, tabId) {
  // flush any existing session first
  if (activeSession) flushSession();

  activeSession = {
    slug,
    title,
    difficulty,
    startTime: now(),
    tabId,
    paused: false,
    pausedAt: null,
    activityId: `${slug}_${now()}`
  };
  trackedTabs[tabId] = { urls: [], startedAt: now() };
  console.log('[LCT] Session started:', slug);

  if (typeof LeetLensBackground !== 'undefined') {
    LeetLensBackground.handleMessage({ type: 'PAGE_ENTER', slug, title, difficulty });
  }

  // heartbeat alarm every 30 s so service worker stays alive
  chrome.alarms.create('heartbeat', { periodInMinutes: 0.5 });
}

async function flushSession() {
  if (!activeSession) return;
  // Compute elapsed, accounting for paused sessions
  const elapsed = activeSession.paused
    ? (activeSession.pausedAt - activeSession.startTime)
    : (now() - activeSession.startTime);
  if (elapsed < 2000) { activeSession = null; return; } // ignore sub-2s blips
  const record = await upsertSession(
    activeSession.slug,
    activeSession.title,
    activeSession.difficulty,
    elapsed
  );
  console.log('[LCT] Flushed session:', activeSession.slug, elapsed + 'ms');

  // Cloud activity tracking
  if (activeSession.activityId) {
    const activity = {
      problemId: activeSession.slug,
      startedAt: activeSession.startTime,
      endedAt: now(),
      timeSpentMinutes: Math.round(elapsed / 60000),
      result: record?.solved ? 'accepted' : 'in_progress'
    };
    chrome.runtime.sendMessage({ type: 'SAVE_ACTIVITY', activity }).catch(() => {});
    if (typeof LeetLensBackground !== 'undefined') {
      LeetLensBackground.handleMessage({ type: 'SESSION_FLUSHED', ...activity });
    }
  }

  activeSession = null;
  broadcastUpdate();
}

// Pause the active session (called when problem is marked solved)
function pauseSession() {
  if (!activeSession || activeSession.paused) return;
  activeSession.paused = true;
  activeSession.pausedAt = now();
  console.log('[LCT] Session paused:', activeSession.slug);
  broadcastUpdate();
}

// Resume a paused session (called when problem is marked pending again)
function resumeSession() {
  if (!activeSession || !activeSession.paused) return;
  // Shift startTime forward by the duration we were paused
  const pausedDuration = now() - activeSession.pausedAt;
  activeSession.startTime += pausedDuration;
  activeSession.paused = false;
  activeSession.pausedAt = null;
  console.log('[LCT] Session resumed:', activeSession.slug);
  broadcastUpdate();
}

// ── broadcast updates to dashboard & sidebar ───────────────────────────────
async function broadcastUpdate() {
  const records = await getRecords();
  const session = activeSession;

  // Send to popup/dashboard
  chrome.runtime.sendMessage({
    type: 'DASHBOARD_UPDATE',
    records,
    session
  }).catch(() => {
    // popup/dashboard might not be open, that's ok
  });

  // Send to all LeetCode problem tabs (for sidebar)
  chrome.tabs.query({ url: 'https://leetcode.com/problems/*' }, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'DASHBOARD_UPDATE',
        records,
        session
      }).catch(() => {
        // tab might have unloaded, that's ok
      });
    });
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
        if (typeof LeetLensBackground !== 'undefined') {
          LeetLensBackground.handleMessage({ type: 'SET_STARS', slug: msg.slug, stars: msg.stars });
        }
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
        // Pause the timer when the problem is solved
        if (activeSession && activeSession.slug === msg.slug) {
          pauseSession();
        }
        const records = await getRecords();
        const rec = records[msg.slug];
        // Show personal difficulty rating modal if not rated yet
        if (!rec?.stars) {
          chrome.tabs.query({ url: 'https://leetcode.com/problems/*' }, tabs => {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, {
                type: 'SHOW_RATING_MODAL',
                slug: msg.slug,
                title: rec?.title || msg.slug
              }).catch(() => {});
            });
          });
        }
        // Cloud sync + weekly plan
        if (typeof LeetLensBackground !== 'undefined') {
          LeetLensBackground.handleMessage({ type: 'MARK_SOLVED', slug: msg.slug, record: rec });
        }
        chrome.runtime.sendMessage({ type: 'CLOUD_MARK_SOLVED', slug: msg.slug, record: rec }).catch(() => {});
        sendResponse({ ok: true });
        break;
      }
      case 'MARK_PENDING': {
        await updateSolved(msg.slug, false);
        // Resume the timer when problem is marked pending again
        if (activeSession && activeSession.slug === msg.slug) {
          resumeSession();
        }
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
      case 'GET_AUTH': {
        const data = await chrome.storage.local.get(['leetlensAuth', 'leetlensUserProfile']);
        sendResponse(data);
        break;
      }
      case 'CLEAR_ALL': {
        await saveRecords({});
        broadcastUpdate();
        sendResponse({ ok: true });
        break;
      }
      case 'DELETE_RECORD': {
        await deleteRecord(msg.slug);
        sendResponse({ ok: true });
        break;
      }
      case 'OPEN_DASHBOARD': {
        chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
        sendResponse({ ok: true });
        break;
      }
      case 'SAVE_ACTIVITY': {
        // Forwarded to dashboard cloud bundle when open
        sendResponse({ ok: true });
        break;
      }
      case 'CLOUD_SYNC_BATCH': {
        sendResponse({ ok: true });
        break;
      }
      case 'EXTENSION_PING': {
        const records = await getRecords();
        const solved = Object.values(records).filter(r => r.solved).length;
        sendResponse({
          ok: true,
          version: chrome.runtime.getManifest().version,
          recordCount: Object.keys(records).length,
          solvedCount: solved,
          inUse: Boolean(activeSession?.slug),
          currentProblem: activeSession?.title || activeSession?.slug || null
        });
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

// Keyboard shortcut — open dashboard
chrome.commands.onCommand.addListener(command => {
  if (command === 'open_dashboard') {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  }
});
