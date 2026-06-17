(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // <define:__FIREBASE_CONFIG__>
  var define_FIREBASE_CONFIG_default;
  var init_define_FIREBASE_CONFIG = __esm({
    "<define:__FIREBASE_CONFIG__>"() {
      define_FIREBASE_CONFIG_default = { apiKey: "AIzaSyDHnjmQvfh9tmKoZj4FTUGFcoblBY8ELPM", authDomain: "automation-of-electricity.firebaseapp.com", projectId: "automation-of-electricity", storageBucket: "automation-of-electricity.firebasestorage.app", messagingSenderId: "1041850387087", appId: "1:1041850387087:web:93b1bce9f129b733f77efa", measurementId: "G-PD2VTP8F3C" };
    }
  });

  // src/config.js
  function isFirebaseConfigured() {
    return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
  }
  var firebaseConfig;
  var init_config = __esm({
    "src/config.js"() {
      init_define_FIREBASE_CONFIG();
      firebaseConfig = typeof define_FIREBASE_CONFIG_default !== "undefined" ? define_FIREBASE_CONFIG_default : {
        apiKey: "AIzaSyDHnjmQvfh9tmKoZj4FTUGFcoblBY8ELPM",
        authDomain: "automation-of-electricity.firebaseapp.com",
        projectId: "automation-of-electricity",
        storageBucket: "automation-of-electricity.firebasestorage.app",
        messagingSenderId: "1041850387087",
        appId: "1:1041850387087:web:93b1bce9f129b733f77efa",
        measurementId: "G-PD2VTP8F3C"
      };
    }
  });

  // src/background-bundle.js
  var require_background_bundle = __commonJS({
    "src/background-bundle.js"() {
      init_define_FIREBASE_CONFIG();
      init_config();
      var pendingSync = [];
      var syncTimer = null;
      function queueSync(type, payload) {
        pendingSync.push({ type, payload, at: Date.now() });
        if (syncTimer) clearTimeout(syncTimer);
        syncTimer = setTimeout(flushSyncQueue, 1500);
      }
      async function flushSyncQueue() {
        if (!pendingSync.length) return;
        const batch = pendingSync.splice(0, pendingSync.length);
        try {
          await chrome.runtime.sendMessage({ type: "CLOUD_SYNC_BATCH", batch });
        } catch {
          pendingSync.unshift(...batch);
        }
      }
      function handleMessage(msg) {
        switch (msg.type) {
          case "MARK_SOLVED":
          case "SET_STARS":
          case "PAGE_ENTER":
          case "SESSION_FLUSHED":
            if (isFirebaseConfigured()) queueSync(msg.type, msg);
            break;
          default:
            break;
        }
      }
      function init() {
        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
          if (msg.type === "GET_CLOUD_READY") {
            sendResponse({ ready: isFirebaseConfigured() });
            return true;
          }
          if (msg.type === "QUEUE_CLOUD_SYNC") {
            queueSync(msg.syncType, msg.payload);
            sendResponse({ ok: true });
            return true;
          }
          return false;
        });
      }
      var LeetLensBackgroundAPI = {
        init,
        handleMessage,
        isFirebaseConfigured
      };
      self.LeetLensBackground = LeetLensBackgroundAPI;
      if (typeof globalThis !== "undefined") globalThis.LeetLensBackground = LeetLensBackgroundAPI;
      init();
    }
  });
  require_background_bundle();
})();
