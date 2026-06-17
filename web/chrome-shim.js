// Chrome API shim for web deployment (Vercel)
(function () {
  'use strict';

  if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) return;

  const STORAGE_KEY = 'leetlensRecords';
  const SESSION_KEY = 'leetlensSession';

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const runtime = {
    getURL(path) {
      return new URL(path, window.location.href).href;
    },
    sendMessage(msg, cb) {
      const type = msg?.type;
      let response = {};

      if (type === 'GET_RECORDS') {
        response = { records: readStore(STORAGE_KEY, {}) };
      } else if (type === 'GET_CURRENT') {
        response = { session: readStore(SESSION_KEY, null) };
      } else if (type === 'SET_STARS') {
        const records = readStore(STORAGE_KEY, {});
        if (records[msg.slug]) {
          records[msg.slug].stars = msg.stars;
          writeStore(STORAGE_KEY, records);
        }
        response = { ok: true };
      } else if (type === 'TOGGLE_SOLVED') {
        const records = readStore(STORAGE_KEY, {});
        if (records[msg.slug]) {
          records[msg.slug].solved = msg.solved;
          if (msg.solved) records[msg.slug].solvedAt = Date.now();
          writeStore(STORAGE_KEY, records);
        }
        response = { ok: true };
      } else if (type === 'DELETE_RECORD') {
        const records = readStore(STORAGE_KEY, {});
        delete records[msg.slug];
        writeStore(STORAGE_KEY, records);
        response = { ok: true };
      } else if (type === 'CLEAR_ALL') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SESSION_KEY);
        response = { ok: true };
      }

      if (typeof cb === 'function') setTimeout(() => cb(response), 0);
      return Promise.resolve(response);
    },
    lastError: null
  };

  const storage = {
    local: {
      get(keys, cb) {
        const out = {};
        const list = Array.isArray(keys) ? keys : keys ? [keys] : Object.keys(localStorage);
        list.forEach(k => {
          const v = localStorage.getItem(k);
          if (v != null) {
            try { out[k] = JSON.parse(v); } catch (_) { out[k] = v; }
          }
        });
        if (typeof cb === 'function') cb(out);
        return Promise.resolve(out);
      },
      set(obj, cb) {
        Object.entries(obj).forEach(([k, v]) => {
          localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
        });
        if (typeof cb === 'function') cb();
        return Promise.resolve();
      },
      remove(keys, cb) {
        (Array.isArray(keys) ? keys : [keys]).forEach(k => localStorage.removeItem(k));
        if (typeof cb === 'function') cb();
        return Promise.resolve();
      }
    }
  };

  const identity = {
    getRedirectURL() {
      return `${window.location.origin}/`;
    },
    launchWebAuthFlow({ url, interactive }, cb) {
      if (!interactive) {
        cb('');
        return;
      }
      const w = 500;
      const h = 600;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      const popup = window.open(url, 'leetlens_oauth', `width=${w},height=${h},left=${left},top=${top}`);
      const timer = setInterval(() => {
        try {
          if (!popup || popup.closed) {
            clearInterval(timer);
            cb('');
            return;
          }
          const href = popup.location.href;
          if (href && href.startsWith(window.location.origin)) {
            const responseUrl = href;
            popup.close();
            clearInterval(timer);
            cb(responseUrl);
          }
        } catch (_) {}
      }, 300);
    }
  };

  window.chrome = { runtime, storage, identity, tabs: { create: ({ url }) => window.open(url, '_blank') } };
  window.__LEETLENS_WEB__ = true;
})();
