import { isFirebaseConfigured } from './config.js';

const pendingSync = [];
let syncTimer = null;

function queueSync(type, payload) {
  pendingSync.push({ type, payload, at: Date.now() });
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(flushSyncQueue, 1500);
}

async function flushSyncQueue() {
  if (!pendingSync.length) return;
  const batch = pendingSync.splice(0, pendingSync.length);
  try {
    await chrome.runtime.sendMessage({ type: 'CLOUD_SYNC_BATCH', batch });
  } catch {
    pendingSync.unshift(...batch);
  }
}

function handleMessage(msg) {
  switch (msg.type) {
    case 'MARK_SOLVED':
    case 'SET_STARS':
    case 'PAGE_ENTER':
    case 'SESSION_FLUSHED':
      if (isFirebaseConfigured()) queueSync(msg.type, msg);
      break;
    default:
      break;
  }
}

function init() {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'GET_CLOUD_READY') {
      sendResponse({ ready: isFirebaseConfigured() });
      return true;
    }
    if (msg.type === 'QUEUE_CLOUD_SYNC') {
      queueSync(msg.syncType, msg.payload);
      sendResponse({ ok: true });
      return true;
    }
    return false;
  });
}

const LeetLensBackgroundAPI = {
  init,
  handleMessage,
  isFirebaseConfigured
};

self.LeetLensBackground = LeetLensBackgroundAPI;
if (typeof globalThis !== 'undefined') globalThis.LeetLensBackground = LeetLensBackgroundAPI;

init();
