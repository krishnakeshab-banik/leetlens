(() => {
  // <define:__FIREBASE_CONFIG__>
  var define_FIREBASE_CONFIG_default = { apiKey: "AIzaSyDHnjmQvfh9tmKoZj4FTUGFcoblBY8ELPM", authDomain: "automation-of-electricity.firebaseapp.com", projectId: "automation-of-electricity", storageBucket: "automation-of-electricity.firebasestorage.app", messagingSenderId: "1041850387087", appId: "1:1041850387087:web:93b1bce9f129b733f77efa", measurementId: "G-PD2VTP8F3C" };

  // src/config.js
  var firebaseConfig = typeof define_FIREBASE_CONFIG_default !== "undefined" ? define_FIREBASE_CONFIG_default : {
    apiKey: "AIzaSyDHnjmQvfh9tmKoZj4FTUGFcoblBY8ELPM",
    authDomain: "automation-of-electricity.firebaseapp.com",
    projectId: "automation-of-electricity",
    storageBucket: "automation-of-electricity.firebasestorage.app",
    messagingSenderId: "1041850387087",
    appId: "1:1041850387087:web:93b1bce9f129b733f77efa",
    measurementId: "G-PD2VTP8F3C"
  };
  function isFirebaseConfigured() {
    return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
  }

  // node_modules/@firebase/util/dist/postinstall.mjs
  var getDefaultsFromPostinstall = () => void 0;

  // node_modules/@firebase/util/dist/index.esm2017.js
  var stringToByteArray$1 = function(str) {
    const out = [];
    let p = 0;
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 128) {
        out[p++] = c;
      } else if (c < 2048) {
        out[p++] = c >> 6 | 192;
        out[p++] = c & 63 | 128;
      } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
        c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
        out[p++] = c >> 18 | 240;
        out[p++] = c >> 12 & 63 | 128;
        out[p++] = c >> 6 & 63 | 128;
        out[p++] = c & 63 | 128;
      } else {
        out[p++] = c >> 12 | 224;
        out[p++] = c >> 6 & 63 | 128;
        out[p++] = c & 63 | 128;
      }
    }
    return out;
  };
  var byteArrayToString = function(bytes) {
    const out = [];
    let pos = 0, c = 0;
    while (pos < bytes.length) {
      const c1 = bytes[pos++];
      if (c1 < 128) {
        out[c++] = String.fromCharCode(c1);
      } else if (c1 > 191 && c1 < 224) {
        const c2 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
      } else if (c1 > 239 && c1 < 365) {
        const c2 = bytes[pos++];
        const c3 = bytes[pos++];
        const c4 = bytes[pos++];
        const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
        out[c++] = String.fromCharCode(55296 + (u >> 10));
        out[c++] = String.fromCharCode(56320 + (u & 1023));
      } else {
        const c2 = bytes[pos++];
        const c3 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      }
    }
    return out.join("");
  };
  var base64 = {
    /**
     * Maps bytes to characters.
     */
    byteToCharMap_: null,
    /**
     * Maps characters to bytes.
     */
    charToByteMap_: null,
    /**
     * Maps bytes to websafe characters.
     * @private
     */
    byteToCharMapWebSafe_: null,
    /**
     * Maps websafe characters to bytes.
     * @private
     */
    charToByteMapWebSafe_: null,
    /**
     * Our default alphabet, shared between
     * ENCODED_VALS and ENCODED_VALS_WEBSAFE
     */
    ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    /**
     * Our default alphabet. Value 64 (=) is special; it means "nothing."
     */
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + "+/=";
    },
    /**
     * Our websafe alphabet.
     */
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + "-_.";
    },
    /**
     * Whether this browser supports the atob and btoa functions. This extension
     * started at Mozilla but is now implemented by many browsers. We use the
     * ASSUME_* variables to avoid pulling in the full useragent detection library
     * but still allowing the standard per-browser compilations.
     *
     */
    HAS_NATIVE_SUPPORT: typeof atob === "function",
    /**
     * Base64-encode an array of bytes.
     *
     * @param input An array of bytes (numbers with
     *     value in [0, 255]) to encode.
     * @param webSafe Boolean indicating we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeByteArray(input, webSafe) {
      if (!Array.isArray(input)) {
        throw Error("encodeByteArray takes an array as a parameter");
      }
      this.init_();
      const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
      const output = [];
      for (let i = 0; i < input.length; i += 3) {
        const byte1 = input[i];
        const haveByte2 = i + 1 < input.length;
        const byte2 = haveByte2 ? input[i + 1] : 0;
        const haveByte3 = i + 2 < input.length;
        const byte3 = haveByte3 ? input[i + 2] : 0;
        const outByte1 = byte1 >> 2;
        const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
        let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
        let outByte4 = byte3 & 63;
        if (!haveByte3) {
          outByte4 = 64;
          if (!haveByte2) {
            outByte3 = 64;
          }
        }
        output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
      }
      return output.join("");
    },
    /**
     * Base64-encode a string.
     *
     * @param input A string to encode.
     * @param webSafe If true, we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return btoa(input);
      }
      return this.encodeByteArray(stringToByteArray$1(input), webSafe);
    },
    /**
     * Base64-decode a string.
     *
     * @param input to decode.
     * @param webSafe True if we should use the
     *     alternative alphabet.
     * @return string representing the decoded value.
     */
    decodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return atob(input);
      }
      return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
    },
    /**
     * Base64-decode a string.
     *
     * In base-64 decoding, groups of four characters are converted into three
     * bytes.  If the encoder did not apply padding, the input length may not
     * be a multiple of 4.
     *
     * In this case, the last group will have fewer than 4 characters, and
     * padding will be inferred.  If the group has one or two characters, it decodes
     * to one byte.  If the group has three characters, it decodes to two bytes.
     *
     * @param input Input to decode.
     * @param webSafe True if we should use the web-safe alphabet.
     * @return bytes representing the decoded value.
     */
    decodeStringToByteArray(input, webSafe) {
      this.init_();
      const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
      const output = [];
      for (let i = 0; i < input.length; ) {
        const byte1 = charToByteMap[input.charAt(i++)];
        const haveByte2 = i < input.length;
        const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
        ++i;
        const haveByte3 = i < input.length;
        const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
        ++i;
        const haveByte4 = i < input.length;
        const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
        ++i;
        if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
          throw new DecodeBase64StringError();
        }
        const outByte1 = byte1 << 2 | byte2 >> 4;
        output.push(outByte1);
        if (byte3 !== 64) {
          const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
          output.push(outByte2);
          if (byte4 !== 64) {
            const outByte3 = byte3 << 6 & 192 | byte4;
            output.push(outByte3);
          }
        }
      }
      return output;
    },
    /**
     * Lazy static initialization function. Called before
     * accessing any of the static map variables.
     * @private
     */
    init_() {
      if (!this.byteToCharMap_) {
        this.byteToCharMap_ = {};
        this.charToByteMap_ = {};
        this.byteToCharMapWebSafe_ = {};
        this.charToByteMapWebSafe_ = {};
        for (let i = 0; i < this.ENCODED_VALS.length; i++) {
          this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
          this.charToByteMap_[this.byteToCharMap_[i]] = i;
          this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
          this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
          if (i >= this.ENCODED_VALS_BASE.length) {
            this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
            this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
          }
        }
      }
    }
  };
  var DecodeBase64StringError = class extends Error {
    constructor() {
      super(...arguments);
      this.name = "DecodeBase64StringError";
    }
  };
  var base64Encode = function(str) {
    const utf8Bytes = stringToByteArray$1(str);
    return base64.encodeByteArray(utf8Bytes, true);
  };
  var base64urlEncodeWithoutPadding = function(str) {
    return base64Encode(str).replace(/\./g, "");
  };
  var base64Decode = function(str) {
    try {
      return base64.decodeString(str, true);
    } catch (e) {
      console.error("base64Decode failed: ", e);
    }
    return null;
  };
  function getGlobal() {
    if (typeof self !== "undefined") {
      return self;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("Unable to locate global object.");
  }
  var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
  var getDefaultsFromEnvVariable = () => {
    if (typeof process === "undefined" || typeof process.env === "undefined") {
      return;
    }
    const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
    if (defaultsJsonString) {
      return JSON.parse(defaultsJsonString);
    }
  };
  var getDefaultsFromCookie = () => {
    if (typeof document === "undefined") {
      return;
    }
    let match;
    try {
      match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
    } catch (e) {
      return;
    }
    const decoded = match && base64Decode(match[1]);
    return decoded && JSON.parse(decoded);
  };
  var getDefaults = () => {
    try {
      return getDefaultsFromPostinstall() || getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
    } catch (e) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
      return;
    }
  };
  var getDefaultEmulatorHost = (productName) => {
    var _a, _b;
    return (_b = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.emulatorHosts) === null || _b === void 0 ? void 0 : _b[productName];
  };
  var getDefaultEmulatorHostnameAndPort = (productName) => {
    const host = getDefaultEmulatorHost(productName);
    if (!host) {
      return void 0;
    }
    const separatorIndex = host.lastIndexOf(":");
    if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
      throw new Error(`Invalid host ${host} with no separate hostname and port!`);
    }
    const port = parseInt(host.substring(separatorIndex + 1), 10);
    if (host[0] === "[") {
      return [host.substring(1, separatorIndex - 1), port];
    } else {
      return [host.substring(0, separatorIndex), port];
    }
  };
  var getDefaultAppConfig = () => {
    var _a;
    return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.config;
  };
  var getExperimentalSetting = (name4) => {
    var _a;
    return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a[`_${name4}`];
  };
  var Deferred = class {
    constructor() {
      this.reject = () => {
      };
      this.resolve = () => {
      };
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
    /**
     * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
     * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
     * and returns a node-style callback which will resolve or reject the Deferred's promise.
     */
    wrapCallback(callback) {
      return (error, value) => {
        if (error) {
          this.reject(error);
        } else {
          this.resolve(value);
        }
        if (typeof callback === "function") {
          this.promise.catch(() => {
          });
          if (callback.length === 1) {
            callback(error);
          } else {
            callback(error, value);
          }
        }
      };
    }
  };
  function isCloudWorkstation(url) {
    try {
      const host = url.startsWith("http://") || url.startsWith("https://") ? new URL(url).hostname : url;
      return host.endsWith(".cloudworkstations.dev");
    } catch (_a) {
      return false;
    }
  }
  async function pingServer(endpoint) {
    const result = await fetch(endpoint, {
      credentials: "include"
    });
    return result.ok;
  }
  function createMockUserToken(token, projectId) {
    if (token.uid) {
      throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
    }
    const header = {
      alg: "none",
      type: "JWT"
    };
    const project = projectId || "demo-project";
    const iat = token.iat || 0;
    const sub = token.sub || token.user_id;
    if (!sub) {
      throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
    }
    const payload = Object.assign({
      // Set all required fields to decent defaults
      iss: `https://securetoken.google.com/${project}`,
      aud: project,
      iat,
      exp: iat + 3600,
      auth_time: iat,
      sub,
      user_id: sub,
      firebase: {
        sign_in_provider: "custom",
        identities: {}
      }
    }, token);
    const signature = "";
    return [
      base64urlEncodeWithoutPadding(JSON.stringify(header)),
      base64urlEncodeWithoutPadding(JSON.stringify(payload)),
      signature
    ].join(".");
  }
  var emulatorStatus = {};
  function getEmulatorSummary() {
    const summary = {
      prod: [],
      emulator: []
    };
    for (const key of Object.keys(emulatorStatus)) {
      if (emulatorStatus[key]) {
        summary.emulator.push(key);
      } else {
        summary.prod.push(key);
      }
    }
    return summary;
  }
  function getOrCreateEl(id) {
    let parentDiv = document.getElementById(id);
    let created = false;
    if (!parentDiv) {
      parentDiv = document.createElement("div");
      parentDiv.setAttribute("id", id);
      created = true;
    }
    return { created, element: parentDiv };
  }
  var previouslyDismissed = false;
  function updateEmulatorBanner(name4, isRunningEmulator) {
    if (typeof window === "undefined" || typeof document === "undefined" || !isCloudWorkstation(window.location.host) || emulatorStatus[name4] === isRunningEmulator || emulatorStatus[name4] || // If already set to use emulator, can't go back to prod.
    previouslyDismissed) {
      return;
    }
    emulatorStatus[name4] = isRunningEmulator;
    function prefixedId(id) {
      return `__firebase__banner__${id}`;
    }
    const bannerId = "__firebase__banner";
    const summary = getEmulatorSummary();
    const showError = summary.prod.length > 0;
    function tearDown() {
      const element = document.getElementById(bannerId);
      if (element) {
        element.remove();
      }
    }
    function setupBannerStyles(bannerEl) {
      bannerEl.style.display = "flex";
      bannerEl.style.background = "#7faaf0";
      bannerEl.style.position = "fixed";
      bannerEl.style.bottom = "5px";
      bannerEl.style.left = "5px";
      bannerEl.style.padding = ".5em";
      bannerEl.style.borderRadius = "5px";
      bannerEl.style.alignItems = "center";
    }
    function setupIconStyles(prependIcon, iconId) {
      prependIcon.setAttribute("width", "24");
      prependIcon.setAttribute("id", iconId);
      prependIcon.setAttribute("height", "24");
      prependIcon.setAttribute("viewBox", "0 0 24 24");
      prependIcon.setAttribute("fill", "none");
      prependIcon.style.marginLeft = "-6px";
    }
    function setupCloseBtn() {
      const closeBtn = document.createElement("span");
      closeBtn.style.cursor = "pointer";
      closeBtn.style.marginLeft = "16px";
      closeBtn.style.fontSize = "24px";
      closeBtn.innerHTML = " &times;";
      closeBtn.onclick = () => {
        previouslyDismissed = true;
        tearDown();
      };
      return closeBtn;
    }
    function setupLinkStyles(learnMoreLink, learnMoreId) {
      learnMoreLink.setAttribute("id", learnMoreId);
      learnMoreLink.innerText = "Learn more";
      learnMoreLink.href = "https://firebase.google.com/docs/studio/preview-apps#preview-backend";
      learnMoreLink.setAttribute("target", "__blank");
      learnMoreLink.style.paddingLeft = "5px";
      learnMoreLink.style.textDecoration = "underline";
    }
    function setupDom() {
      const banner = getOrCreateEl(bannerId);
      const firebaseTextId = prefixedId("text");
      const firebaseText = document.getElementById(firebaseTextId) || document.createElement("span");
      const learnMoreId = prefixedId("learnmore");
      const learnMoreLink = document.getElementById(learnMoreId) || document.createElement("a");
      const prependIconId = prefixedId("preprendIcon");
      const prependIcon = document.getElementById(prependIconId) || document.createElementNS("http://www.w3.org/2000/svg", "svg");
      if (banner.created) {
        const bannerEl = banner.element;
        setupBannerStyles(bannerEl);
        setupLinkStyles(learnMoreLink, learnMoreId);
        const closeBtn = setupCloseBtn();
        setupIconStyles(prependIcon, prependIconId);
        bannerEl.append(prependIcon, firebaseText, learnMoreLink, closeBtn);
        document.body.appendChild(bannerEl);
      }
      if (showError) {
        firebaseText.innerText = `Preview backend disconnected.`;
        prependIcon.innerHTML = `<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`;
      } else {
        prependIcon.innerHTML = `<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`;
        firebaseText.innerText = "Preview backend running in this workspace.";
      }
      firebaseText.setAttribute("id", firebaseTextId);
    }
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", setupDom);
    } else {
      setupDom();
    }
  }
  function getUA() {
    if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
      return navigator["userAgent"];
    } else {
      return "";
    }
  }
  function isMobileCordova() {
    return typeof window !== "undefined" && // @ts-ignore Setting up an broadly applicable index signature for Window
    // just to deal with this case would probably be a bad idea.
    !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
  }
  function isNode() {
    var _a;
    const forceEnvironment = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.forceEnvironment;
    if (forceEnvironment === "node") {
      return true;
    } else if (forceEnvironment === "browser") {
      return false;
    }
    try {
      return Object.prototype.toString.call(global.process) === "[object process]";
    } catch (e) {
      return false;
    }
  }
  function isCloudflareWorker() {
    return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
  }
  function isBrowserExtension() {
    const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : void 0;
    return typeof runtime === "object" && runtime.id !== void 0;
  }
  function isReactNative() {
    return typeof navigator === "object" && navigator["product"] === "ReactNative";
  }
  function isIE() {
    const ua = getUA();
    return ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
  }
  function isSafari() {
    return !isNode() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
  }
  function isIndexedDBAvailable() {
    try {
      return typeof indexedDB === "object";
    } catch (e) {
      return false;
    }
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          var _a;
          reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  var ERROR_NAME = "FirebaseError";
  var FirebaseError = class _FirebaseError extends Error {
    constructor(code, message, customData) {
      super(message);
      this.code = code;
      this.customData = customData;
      this.name = ERROR_NAME;
      Object.setPrototypeOf(this, _FirebaseError.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ErrorFactory.prototype.create);
      }
    }
  };
  var ErrorFactory = class {
    constructor(service, serviceName, errors) {
      this.service = service;
      this.serviceName = serviceName;
      this.errors = errors;
    }
    create(code, ...data) {
      const customData = data[0] || {};
      const fullCode = `${this.service}/${code}`;
      const template = this.errors[code];
      const message = template ? replaceTemplate(template, customData) : "Error";
      const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
      const error = new FirebaseError(fullCode, fullMessage, customData);
      return error;
    }
  };
  function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_, key) => {
      const value = data[key];
      return value != null ? String(value) : `<${key}?>`;
    });
  }
  var PATTERN = /\{\$([^}]+)}/g;
  function isEmpty(obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const k2 of aKeys) {
      if (!bKeys.includes(k2)) {
        return false;
      }
      const aProp = a[k2];
      const bProp = b[k2];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k2 of bKeys) {
      if (!aKeys.includes(k2)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  function querystring(querystringParams) {
    const params = [];
    for (const [key, value] of Object.entries(querystringParams)) {
      if (Array.isArray(value)) {
        value.forEach((arrayVal) => {
          params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
        });
      } else {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }
    return params.length ? "&" + params.join("&") : "";
  }
  function querystringDecode(querystring2) {
    const obj = {};
    const tokens = querystring2.replace(/^\?/, "").split("&");
    tokens.forEach((token) => {
      if (token) {
        const [key, value] = token.split("=");
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    return obj;
  }
  function extractQuerystring(url) {
    const queryStart = url.indexOf("?");
    if (!queryStart) {
      return "";
    }
    const fragmentStart = url.indexOf("#", queryStart);
    return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : void 0);
  }
  function createSubscribe(executor, onNoObservers) {
    const proxy = new ObserverProxy(executor, onNoObservers);
    return proxy.subscribe.bind(proxy);
  }
  var ObserverProxy = class {
    /**
     * @param executor Function which can make calls to a single Observer
     *     as a proxy.
     * @param onNoObservers Callback when count of Observers goes to zero.
     */
    constructor(executor, onNoObservers) {
      this.observers = [];
      this.unsubscribes = [];
      this.observerCount = 0;
      this.task = Promise.resolve();
      this.finalized = false;
      this.onNoObservers = onNoObservers;
      this.task.then(() => {
        executor(this);
      }).catch((e) => {
        this.error(e);
      });
    }
    next(value) {
      this.forEachObserver((observer) => {
        observer.next(value);
      });
    }
    error(error) {
      this.forEachObserver((observer) => {
        observer.error(error);
      });
      this.close(error);
    }
    complete() {
      this.forEachObserver((observer) => {
        observer.complete();
      });
      this.close();
    }
    /**
     * Subscribe function that can be used to add an Observer to the fan-out list.
     *
     * - We require that no event is sent to a subscriber synchronously to their
     *   call to subscribe().
     */
    subscribe(nextOrObserver, error, complete) {
      let observer;
      if (nextOrObserver === void 0 && error === void 0 && complete === void 0) {
        throw new Error("Missing Observer.");
      }
      if (implementsAnyMethods(nextOrObserver, [
        "next",
        "error",
        "complete"
      ])) {
        observer = nextOrObserver;
      } else {
        observer = {
          next: nextOrObserver,
          error,
          complete
        };
      }
      if (observer.next === void 0) {
        observer.next = noop;
      }
      if (observer.error === void 0) {
        observer.error = noop;
      }
      if (observer.complete === void 0) {
        observer.complete = noop;
      }
      const unsub = this.unsubscribeOne.bind(this, this.observers.length);
      if (this.finalized) {
        this.task.then(() => {
          try {
            if (this.finalError) {
              observer.error(this.finalError);
            } else {
              observer.complete();
            }
          } catch (e) {
          }
          return;
        });
      }
      this.observers.push(observer);
      return unsub;
    }
    // Unsubscribe is synchronous - we guarantee that no events are sent to
    // any unsubscribed Observer.
    unsubscribeOne(i) {
      if (this.observers === void 0 || this.observers[i] === void 0) {
        return;
      }
      delete this.observers[i];
      this.observerCount -= 1;
      if (this.observerCount === 0 && this.onNoObservers !== void 0) {
        this.onNoObservers(this);
      }
    }
    forEachObserver(fn) {
      if (this.finalized) {
        return;
      }
      for (let i = 0; i < this.observers.length; i++) {
        this.sendOne(i, fn);
      }
    }
    // Call the Observer via one of it's callback function. We are careful to
    // confirm that the observe has not been unsubscribed since this asynchronous
    // function had been queued.
    sendOne(i, fn) {
      this.task.then(() => {
        if (this.observers !== void 0 && this.observers[i] !== void 0) {
          try {
            fn(this.observers[i]);
          } catch (e) {
            if (typeof console !== "undefined" && console.error) {
              console.error(e);
            }
          }
        }
      });
    }
    close(err) {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      if (err !== void 0) {
        this.finalError = err;
      }
      this.task.then(() => {
        this.observers = void 0;
        this.onNoObservers = void 0;
      });
    }
  };
  function implementsAnyMethods(obj, methods) {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    for (const method of methods) {
      if (method in obj && typeof obj[method] === "function") {
        return true;
      }
    }
    return false;
  }
  function noop() {
  }
  var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
  function getModularInstance(service) {
    if (service && service._delegate) {
      return service._delegate;
    } else {
      return service;
    }
  }

  // node_modules/@firebase/component/dist/esm/index.esm2017.js
  var Component = class {
    /**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
    constructor(name4, instanceFactory, type) {
      this.name = name4;
      this.instanceFactory = instanceFactory;
      this.type = type;
      this.multipleInstances = false;
      this.serviceProps = {};
      this.instantiationMode = "LAZY";
      this.onInstanceCreated = null;
    }
    setInstantiationMode(mode) {
      this.instantiationMode = mode;
      return this;
    }
    setMultipleInstances(multipleInstances) {
      this.multipleInstances = multipleInstances;
      return this;
    }
    setServiceProps(props) {
      this.serviceProps = props;
      return this;
    }
    setInstanceCreatedCallback(callback) {
      this.onInstanceCreated = callback;
      return this;
    }
  };
  var DEFAULT_ENTRY_NAME = "[DEFAULT]";
  var Provider = class {
    constructor(name4, container) {
      this.name = name4;
      this.container = container;
      this.component = null;
      this.instances = /* @__PURE__ */ new Map();
      this.instancesDeferred = /* @__PURE__ */ new Map();
      this.instancesOptions = /* @__PURE__ */ new Map();
      this.onInitCallbacks = /* @__PURE__ */ new Map();
    }
    /**
     * @param identifier A provider can provide multiple instances of a service
     * if this.component.multipleInstances is true.
     */
    get(identifier) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      if (!this.instancesDeferred.has(normalizedIdentifier)) {
        const deferred = new Deferred();
        this.instancesDeferred.set(normalizedIdentifier, deferred);
        if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
          try {
            const instance = this.getOrInitializeService({
              instanceIdentifier: normalizedIdentifier
            });
            if (instance) {
              deferred.resolve(instance);
            }
          } catch (e) {
          }
        }
      }
      return this.instancesDeferred.get(normalizedIdentifier).promise;
    }
    getImmediate(options) {
      var _a;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
      const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          return this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
        } catch (e) {
          if (optional) {
            return null;
          } else {
            throw e;
          }
        }
      } else {
        if (optional) {
          return null;
        } else {
          throw Error(`Service ${this.name} is not available`);
        }
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(component) {
      if (component.name !== this.name) {
        throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
      }
      if (this.component) {
        throw Error(`Component for ${this.name} has already been provided`);
      }
      this.component = component;
      if (!this.shouldAutoInitialize()) {
        return;
      }
      if (isComponentEager(component)) {
        try {
          this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
        } catch (e) {
        }
      }
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          instanceDeferred.resolve(instance);
        } catch (e) {
        }
      }
    }
    clearInstance(identifier = DEFAULT_ENTRY_NAME) {
      this.instancesDeferred.delete(identifier);
      this.instancesOptions.delete(identifier);
      this.instances.delete(identifier);
    }
    // app.delete() will call this method on every provider to delete the services
    // TODO: should we mark the provider as deleted?
    async delete() {
      const services = Array.from(this.instances.values());
      await Promise.all([
        ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
        ...services.filter((service) => "_delete" in service).map((service) => service._delete())
      ]);
    }
    isComponentSet() {
      return this.component != null;
    }
    isInitialized(identifier = DEFAULT_ENTRY_NAME) {
      return this.instances.has(identifier);
    }
    getOptions(identifier = DEFAULT_ENTRY_NAME) {
      return this.instancesOptions.get(identifier) || {};
    }
    initialize(opts = {}) {
      const { options = {} } = opts;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
      if (this.isInitialized(normalizedIdentifier)) {
        throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
      }
      if (!this.isComponentSet()) {
        throw Error(`Component ${this.name} has not been registered yet`);
      }
      const instance = this.getOrInitializeService({
        instanceIdentifier: normalizedIdentifier,
        options
      });
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        if (normalizedIdentifier === normalizedDeferredIdentifier) {
          instanceDeferred.resolve(instance);
        }
      }
      return instance;
    }
    /**
     *
     * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
     * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
     *
     * @param identifier An optional instance identifier
     * @returns a function to unregister the callback
     */
    onInit(callback, identifier) {
      var _a;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Set();
      existingCallbacks.add(callback);
      this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
      const existingInstance = this.instances.get(normalizedIdentifier);
      if (existingInstance) {
        callback(existingInstance, normalizedIdentifier);
      }
      return () => {
        existingCallbacks.delete(callback);
      };
    }
    /**
     * Invoke onInit callbacks synchronously
     * @param instance the service instance`
     */
    invokeOnInitCallbacks(instance, identifier) {
      const callbacks = this.onInitCallbacks.get(identifier);
      if (!callbacks) {
        return;
      }
      for (const callback of callbacks) {
        try {
          callback(instance, identifier);
        } catch (_a) {
        }
      }
    }
    getOrInitializeService({ instanceIdentifier, options = {} }) {
      let instance = this.instances.get(instanceIdentifier);
      if (!instance && this.component) {
        instance = this.component.instanceFactory(this.container, {
          instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
          options
        });
        this.instances.set(instanceIdentifier, instance);
        this.instancesOptions.set(instanceIdentifier, options);
        this.invokeOnInitCallbacks(instance, instanceIdentifier);
        if (this.component.onInstanceCreated) {
          try {
            this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
          } catch (_a) {
          }
        }
      }
      return instance || null;
    }
    normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
      if (this.component) {
        return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
      } else {
        return identifier;
      }
    }
    shouldAutoInitialize() {
      return !!this.component && this.component.instantiationMode !== "EXPLICIT";
    }
  };
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  var ComponentContainer = class {
    constructor(name4) {
      this.name = name4;
      this.providers = /* @__PURE__ */ new Map();
    }
    /**
     *
     * @param component Component being added
     * @param overwrite When a component with the same name has already been registered,
     * if overwrite is true: overwrite the existing component with the new component and create a new
     * provider with the new component. It can be useful in tests where you want to use different mocks
     * for different tests.
     * if overwrite is false: throw an exception
     */
    addComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
      }
      provider.setComponent(component);
    }
    addOrOverwriteComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        this.providers.delete(component.name);
      }
      this.addComponent(component);
    }
    /**
     * getProvider provides a type safe interface where it can only be called with a field name
     * present in NameServiceMapping interface.
     *
     * Firebase SDKs providing services should extend NameServiceMapping interface to register
     * themselves.
     */
    getProvider(name4) {
      if (this.providers.has(name4)) {
        return this.providers.get(name4);
      }
      const provider = new Provider(name4, this);
      this.providers.set(name4, provider);
      return provider;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  };

  // node_modules/@firebase/logger/dist/esm/index.esm2017.js
  var instances = [];
  var LogLevel;
  (function(LogLevel2) {
    LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
    LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
    LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
    LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
    LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
    LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
  })(LogLevel || (LogLevel = {}));
  var levelStringToEnum = {
    "debug": LogLevel.DEBUG,
    "verbose": LogLevel.VERBOSE,
    "info": LogLevel.INFO,
    "warn": LogLevel.WARN,
    "error": LogLevel.ERROR,
    "silent": LogLevel.SILENT
  };
  var defaultLogLevel = LogLevel.INFO;
  var ConsoleMethod = {
    [LogLevel.DEBUG]: "log",
    [LogLevel.VERBOSE]: "log",
    [LogLevel.INFO]: "info",
    [LogLevel.WARN]: "warn",
    [LogLevel.ERROR]: "error"
  };
  var defaultLogHandler = (instance, logType, ...args) => {
    if (logType < instance.logLevel) {
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const method = ConsoleMethod[logType];
    if (method) {
      console[method](`[${now}]  ${instance.name}:`, ...args);
    } else {
      throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
    }
  };
  var Logger = class {
    /**
     * Gives you an instance of a Logger to capture messages according to
     * Firebase's logging scheme.
     *
     * @param name The name that the logs will be associated with
     */
    constructor(name4) {
      this.name = name4;
      this._logLevel = defaultLogLevel;
      this._logHandler = defaultLogHandler;
      this._userLogHandler = null;
      instances.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(val) {
      if (!(val in LogLevel)) {
        throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
      }
      this._logLevel = val;
    }
    // Workaround for setter/getter having to be the same type.
    setLogLevel(val) {
      this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(val) {
      if (typeof val !== "function") {
        throw new TypeError("Value assigned to `logHandler` must be a function");
      }
      this._logHandler = val;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(val) {
      this._userLogHandler = val;
    }
    /**
     * The functions below are all based on the `console` interface
     */
    debug(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
      this._logHandler(this, LogLevel.DEBUG, ...args);
    }
    log(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
      this._logHandler(this, LogLevel.VERBOSE, ...args);
    }
    info(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
      this._logHandler(this, LogLevel.INFO, ...args);
    }
    warn(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
      this._logHandler(this, LogLevel.WARN, ...args);
    }
    error(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
      this._logHandler(this, LogLevel.ERROR, ...args);
    }
  };

  // node_modules/idb/build/wrap-idb-value.js
  var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var cursorRequestMap = /* @__PURE__ */ new WeakMap();
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "objectStoreNames") {
          return target.objectStoreNames || transactionStoreNamesMap.get(target);
        }
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap = (value) => reverseTransformCache.get(value);

  // node_modules/idb/build/index.js
  function openDB(name4, version4, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name4, version4);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db2) => {
      if (terminated)
        db2.addEventListener("close", () => terminated());
      if (blocking) {
        db2.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));

  // node_modules/@firebase/app/dist/esm/index.esm2017.js
  var PlatformLoggerServiceImpl = class {
    constructor(container) {
      this.container = container;
    }
    // In initial implementation, this will be called by installations on
    // auth token refresh, and installations will send this string.
    getPlatformInfoString() {
      const providers = this.container.getProviders();
      return providers.map((provider) => {
        if (isVersionServiceProvider(provider)) {
          const service = provider.getImmediate();
          return `${service.library}/${service.version}`;
        } else {
          return null;
        }
      }).filter((logString) => logString).join(" ");
    }
  };
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION";
  }
  var name$q = "@firebase/app";
  var version$1 = "0.13.2";
  var logger = new Logger("@firebase/app");
  var name$p = "@firebase/app-compat";
  var name$o = "@firebase/analytics-compat";
  var name$n = "@firebase/analytics";
  var name$m = "@firebase/app-check-compat";
  var name$l = "@firebase/app-check";
  var name$k = "@firebase/auth";
  var name$j = "@firebase/auth-compat";
  var name$i = "@firebase/database";
  var name$h = "@firebase/data-connect";
  var name$g = "@firebase/database-compat";
  var name$f = "@firebase/functions";
  var name$e = "@firebase/functions-compat";
  var name$d = "@firebase/installations";
  var name$c = "@firebase/installations-compat";
  var name$b = "@firebase/messaging";
  var name$a = "@firebase/messaging-compat";
  var name$9 = "@firebase/performance";
  var name$8 = "@firebase/performance-compat";
  var name$7 = "@firebase/remote-config";
  var name$6 = "@firebase/remote-config-compat";
  var name$5 = "@firebase/storage";
  var name$4 = "@firebase/storage-compat";
  var name$3 = "@firebase/firestore";
  var name$2 = "@firebase/ai";
  var name$1 = "@firebase/firestore-compat";
  var name = "firebase";
  var version = "11.10.0";
  var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
  var PLATFORM_LOG_STRING = {
    [name$q]: "fire-core",
    [name$p]: "fire-core-compat",
    [name$n]: "fire-analytics",
    [name$o]: "fire-analytics-compat",
    [name$l]: "fire-app-check",
    [name$m]: "fire-app-check-compat",
    [name$k]: "fire-auth",
    [name$j]: "fire-auth-compat",
    [name$i]: "fire-rtdb",
    [name$h]: "fire-data-connect",
    [name$g]: "fire-rtdb-compat",
    [name$f]: "fire-fn",
    [name$e]: "fire-fn-compat",
    [name$d]: "fire-iid",
    [name$c]: "fire-iid-compat",
    [name$b]: "fire-fcm",
    [name$a]: "fire-fcm-compat",
    [name$9]: "fire-perf",
    [name$8]: "fire-perf-compat",
    [name$7]: "fire-rc",
    [name$6]: "fire-rc-compat",
    [name$5]: "fire-gcs",
    [name$4]: "fire-gcs-compat",
    [name$3]: "fire-fst",
    [name$1]: "fire-fst-compat",
    [name$2]: "fire-vertex",
    "fire-js": "fire-js",
    // Platform identifier for JS SDK.
    [name]: "fire-js-all"
  };
  var _apps = /* @__PURE__ */ new Map();
  var _serverApps = /* @__PURE__ */ new Map();
  var _components = /* @__PURE__ */ new Map();
  function _addComponent(app2, component) {
    try {
      app2.container.addComponent(component);
    } catch (e) {
      logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app2.name}`, e);
    }
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger.debug(`There were multiple attempts to register component ${componentName}.`);
      return false;
    }
    _components.set(componentName, component);
    for (const app2 of _apps.values()) {
      _addComponent(app2, component);
    }
    for (const serverApp of _serverApps.values()) {
      _addComponent(serverApp, component);
    }
    return true;
  }
  function _getProvider(app2, name4) {
    const heartbeatController = app2.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app2.container.getProvider(name4);
  }
  function _isFirebaseServerApp(obj) {
    if (obj === null || obj === void 0) {
      return false;
    }
    return obj.settings !== void 0;
  }
  var ERRORS = {
    [
      "no-app"
      /* AppError.NO_APP */
    ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
    [
      "bad-app-name"
      /* AppError.BAD_APP_NAME */
    ]: "Illegal App name: '{$appName}'",
    [
      "duplicate-app"
      /* AppError.DUPLICATE_APP */
    ]: "Firebase App named '{$appName}' already exists with different options or config",
    [
      "app-deleted"
      /* AppError.APP_DELETED */
    ]: "Firebase App named '{$appName}' already deleted",
    [
      "server-app-deleted"
      /* AppError.SERVER_APP_DELETED */
    ]: "Firebase Server App has been deleted",
    [
      "no-options"
      /* AppError.NO_OPTIONS */
    ]: "Need to provide options, when not being deployed to hosting via source.",
    [
      "invalid-app-argument"
      /* AppError.INVALID_APP_ARGUMENT */
    ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    [
      "invalid-log-argument"
      /* AppError.INVALID_LOG_ARGUMENT */
    ]: "First argument to `onLog` must be null or a function.",
    [
      "idb-open"
      /* AppError.IDB_OPEN */
    ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-get"
      /* AppError.IDB_GET */
    ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-set"
      /* AppError.IDB_WRITE */
    ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-delete"
      /* AppError.IDB_DELETE */
    ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "finalization-registry-not-supported"
      /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
    ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
    [
      "invalid-server-app-environment"
      /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
    ]: "FirebaseServerApp is not for use in browser environments."
  };
  var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
  var FirebaseAppImpl = class {
    constructor(options, config, container) {
      this._isDeleted = false;
      this._options = Object.assign({}, options);
      this._config = Object.assign({}, config);
      this._name = config.name;
      this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
      this._container = container;
      this.container.addComponent(new Component(
        "app",
        () => this,
        "PUBLIC"
        /* ComponentType.PUBLIC */
      ));
    }
    get automaticDataCollectionEnabled() {
      this.checkDestroyed();
      return this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(val) {
      this.checkDestroyed();
      this._automaticDataCollectionEnabled = val;
    }
    get name() {
      this.checkDestroyed();
      return this._name;
    }
    get options() {
      this.checkDestroyed();
      return this._options;
    }
    get config() {
      this.checkDestroyed();
      return this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(val) {
      this._isDeleted = val;
    }
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    checkDestroyed() {
      if (this.isDeleted) {
        throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
      }
    }
  };
  var SDK_VERSION = version;
  function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== "object") {
      const name5 = rawConfig;
      rawConfig = { name: name5 };
    }
    const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: true }, rawConfig);
    const name4 = config.name;
    if (typeof name4 !== "string" || !name4) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name4)
      });
    }
    options || (options = getDefaultAppConfig());
    if (!options) {
      throw ERROR_FACTORY.create(
        "no-options"
        /* AppError.NO_OPTIONS */
      );
    }
    const existingApp = _apps.get(name4);
    if (existingApp) {
      if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY.create("duplicate-app", { appName: name4 });
      }
    }
    const container = new ComponentContainer(name4);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name4, newApp);
    return newApp;
  }
  function getApp(name4 = DEFAULT_ENTRY_NAME2) {
    const app2 = _apps.get(name4);
    if (!app2 && name4 === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
      return initializeApp();
    }
    if (!app2) {
      throw ERROR_FACTORY.create("no-app", { appName: name4 });
    }
    return app2;
  }
  function registerVersion(libraryKeyOrName, version4, variant) {
    var _a;
    let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
    if (variant) {
      library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version4.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        `Unable to register library "${library}" with version "${version4}":`
      ];
      if (libraryMismatch) {
        warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push(`version name "${version4}" contains illegal characters (whitespace or "/")`);
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(
      `${library}-version`,
      () => ({ library, version: version4 }),
      "VERSION"
      /* ComponentType.VERSION */
    ));
  }
  var DB_NAME = "firebase-heartbeat-database";
  var DB_VERSION = 1;
  var STORE_NAME = "firebase-heartbeat-store";
  var dbPromise = null;
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade: (db2, oldVersion) => {
          switch (oldVersion) {
            case 0:
              try {
                db2.createObjectStore(STORE_NAME);
              } catch (e) {
                console.warn(e);
              }
          }
        }
      }).catch((e) => {
        throw ERROR_FACTORY.create("idb-open", {
          originalErrorMessage: e.message
        });
      });
    }
    return dbPromise;
  }
  async function readHeartbeatsFromIndexedDB(app2) {
    try {
      const db2 = await getDbPromise();
      const tx = db2.transaction(STORE_NAME);
      const result = await tx.objectStore(STORE_NAME).get(computeKey(app2));
      await tx.done;
      return result;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-get", {
          originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  async function writeHeartbeatsToIndexedDB(app2, heartbeatObject) {
    try {
      const db2 = await getDbPromise();
      const tx = db2.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app2));
      await tx.done;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-set", {
          originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  function computeKey(app2) {
    return `${app2.name}!${app2.options.appId}`;
  }
  var MAX_HEADER_BYTES = 1024;
  var MAX_NUM_STORED_HEARTBEATS = 30;
  var HeartbeatServiceImpl = class {
    constructor(container) {
      this.container = container;
      this._heartbeatsCache = null;
      const app2 = this.container.getProvider("app").getImmediate();
      this._storage = new HeartbeatStorageImpl(app2);
      this._heartbeatsCachePromise = this._storage.read().then((result) => {
        this._heartbeatsCache = result;
        return result;
      });
    }
    /**
     * Called to report a heartbeat. The function will generate
     * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
     * to IndexedDB.
     * Note that we only store one heartbeat per day. So if a heartbeat for today is
     * already logged, subsequent calls to this function in the same day will be ignored.
     */
    async triggerHeartbeat() {
      var _a, _b;
      try {
        const platformLogger = this.container.getProvider("platform-logger").getImmediate();
        const agent = platformLogger.getPlatformInfoString();
        const date = getUTCDateString();
        if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null) {
          this._heartbeatsCache = await this._heartbeatsCachePromise;
          if (((_b = this._heartbeatsCache) === null || _b === void 0 ? void 0 : _b.heartbeats) == null) {
            return;
          }
        }
        if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
          return;
        } else {
          this._heartbeatsCache.heartbeats.push({ date, agent });
          if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
            const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
            this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
          }
        }
        return this._storage.overwrite(this._heartbeatsCache);
      } catch (e) {
        logger.warn(e);
      }
    }
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     *
     * NOTE: Consuming product SDKs should not send the header if this method
     * returns an empty string.
     */
    async getHeartbeatsHeader() {
      var _a;
      try {
        if (this._heartbeatsCache === null) {
          await this._heartbeatsCachePromise;
        }
        if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0) {
          return "";
        }
        const date = getUTCDateString();
        const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
        const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
        this._heartbeatsCache.lastSentHeartbeatDate = date;
        if (unsentEntries.length > 0) {
          this._heartbeatsCache.heartbeats = unsentEntries;
          await this._storage.overwrite(this._heartbeatsCache);
        } else {
          this._heartbeatsCache.heartbeats = [];
          void this._storage.overwrite(this._heartbeatsCache);
        }
        return headerString;
      } catch (e) {
        logger.warn(e);
        return "";
      }
    }
  };
  function getUTCDateString() {
    const today = /* @__PURE__ */ new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  var HeartbeatStorageImpl = class {
    constructor(app2) {
      this.app = app2;
      this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
    }
    async runIndexedDBEnvironmentCheck() {
      if (!isIndexedDBAvailable()) {
        return false;
      } else {
        return validateIndexedDBOpenable().then(() => true).catch(() => false);
      }
    }
    /**
     * Read all heartbeats.
     */
    async read() {
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return { heartbeats: [] };
      } else {
        const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
        if (idbHeartbeatObject === null || idbHeartbeatObject === void 0 ? void 0 : idbHeartbeatObject.heartbeats) {
          return idbHeartbeatObject;
        } else {
          return { heartbeats: [] };
        }
      }
    }
    // overwrite the storage with the provided heartbeats
    async overwrite(heartbeatsObject) {
      var _a;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: heartbeatsObject.heartbeats
        });
      }
    }
    // add heartbeats
    async add(heartbeatsObject) {
      var _a;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: [
            ...existingHeartbeatsObject.heartbeats,
            ...heartbeatsObject.heartbeats
          ]
        });
      }
    }
  };
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(
      // heartbeatsCache wrapper properties
      JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
    ).length;
  }
  function getEarliestHeartbeatIdx(heartbeats) {
    if (heartbeats.length === 0) {
      return -1;
    }
    let earliestHeartbeatIdx = 0;
    let earliestHeartbeatDate = heartbeats[0].date;
    for (let i = 1; i < heartbeats.length; i++) {
      if (heartbeats[i].date < earliestHeartbeatDate) {
        earliestHeartbeatDate = heartbeats[i].date;
        earliestHeartbeatIdx = i;
      }
    }
    return earliestHeartbeatIdx;
  }
  function registerCoreComponents(variant) {
    _registerComponent(new Component(
      "platform-logger",
      (container) => new PlatformLoggerServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    _registerComponent(new Component(
      "heartbeat",
      (container) => new HeartbeatServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name$q, version$1, variant);
    registerVersion(name$q, version$1, "esm2017");
    registerVersion("fire-js", "");
  }
  registerCoreComponents("");

  // node_modules/firebase/app/dist/esm/index.esm.js
  var name2 = "firebase";
  var version2 = "11.10.0";
  registerVersion(name2, version2, "app");

  // node_modules/tslib/tslib.es6.mjs
  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }

  // node_modules/@firebase/auth/dist/esm2017/index-35c79a8a.js
  function _prodErrorMap() {
    return {
      [
        "dependent-sdk-initialized-before-auth"
        /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
      ]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
    };
  }
  var prodErrorMap = _prodErrorMap;
  var _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
  var logClient = new Logger("@firebase/auth");
  function _logWarn(msg, ...args) {
    if (logClient.logLevel <= LogLevel.WARN) {
      logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
  }
  function _logError(msg, ...args) {
    if (logClient.logLevel <= LogLevel.ERROR) {
      logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
  }
  function _fail(authOrCode, ...rest) {
    throw createErrorInternal(authOrCode, ...rest);
  }
  function _createError(authOrCode, ...rest) {
    return createErrorInternal(authOrCode, ...rest);
  }
  function _errorWithCustomMessage(auth2, code, message) {
    const errorMap = Object.assign(Object.assign({}, prodErrorMap()), { [code]: message });
    const factory = new ErrorFactory("auth", "Firebase", errorMap);
    return factory.create(code, {
      appName: auth2.name
    });
  }
  function _serverAppCurrentUserOperationNotSupportedError(auth2) {
    return _errorWithCustomMessage(auth2, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
  }
  function _assertInstanceOf(auth2, object, instance) {
    const constructorInstance = instance;
    if (!(object instanceof constructorInstance)) {
      if (constructorInstance.name !== object.constructor.name) {
        _fail(
          auth2,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
      }
      throw _errorWithCustomMessage(auth2, "argument-error", `Type of ${object.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`);
    }
  }
  function createErrorInternal(authOrCode, ...rest) {
    if (typeof authOrCode !== "string") {
      const code = rest[0];
      const fullParams = [...rest.slice(1)];
      if (fullParams[0]) {
        fullParams[0].appName = authOrCode.name;
      }
      return authOrCode._errorFactory.create(code, ...fullParams);
    }
    return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
  }
  function _assert(assertion, authOrCode, ...rest) {
    if (!assertion) {
      throw createErrorInternal(authOrCode, ...rest);
    }
  }
  function debugFail(failure) {
    const message = `INTERNAL ASSERTION FAILED: ` + failure;
    _logError(message);
    throw new Error(message);
  }
  function debugAssert(assertion, message) {
    if (!assertion) {
      debugFail(message);
    }
  }
  function _getCurrentUrl() {
    var _a;
    return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.href) || "";
  }
  function _isHttpOrHttps() {
    return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
  }
  function _getCurrentScheme() {
    var _a;
    return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.protocol) || null;
  }
  function _isOnline() {
    if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && // Apply only for traditional web apps and Chrome extensions.
    // This is especially true for Cordova apps which have unreliable
    // navigator.onLine behavior unless cordova-plugin-network-information is
    // installed which overwrites the native navigator.onLine value and
    // defines navigator.connection.
    (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) {
      return navigator.onLine;
    }
    return true;
  }
  function _getUserLanguage() {
    if (typeof navigator === "undefined") {
      return null;
    }
    const navigatorLanguage = navigator;
    return (
      // Most reliable, but only supported in Chrome/Firefox.
      navigatorLanguage.languages && navigatorLanguage.languages[0] || // Supported in most browsers, but returns the language of the browser
      // UI, not the language set in browser settings.
      navigatorLanguage.language || // Couldn't determine language.
      null
    );
  }
  var Delay = class {
    constructor(shortDelay, longDelay) {
      this.shortDelay = shortDelay;
      this.longDelay = longDelay;
      debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
      this.isMobile = isMobileCordova() || isReactNative();
    }
    get() {
      if (!_isOnline()) {
        return Math.min(5e3, this.shortDelay);
      }
      return this.isMobile ? this.longDelay : this.shortDelay;
    }
  };
  function _emulatorUrl(config, path) {
    debugAssert(config.emulator, "Emulator should always be set here");
    const { url } = config.emulator;
    if (!path) {
      return url;
    }
    return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
  }
  var FetchProvider = class {
    static initialize(fetchImpl, headersImpl, responseImpl) {
      this.fetchImpl = fetchImpl;
      if (headersImpl) {
        this.headersImpl = headersImpl;
      }
      if (responseImpl) {
        this.responseImpl = responseImpl;
      }
    }
    static fetch() {
      if (this.fetchImpl) {
        return this.fetchImpl;
      }
      if (typeof self !== "undefined" && "fetch" in self) {
        return self.fetch;
      }
      if (typeof globalThis !== "undefined" && globalThis.fetch) {
        return globalThis.fetch;
      }
      if (typeof fetch !== "undefined") {
        return fetch;
      }
      debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
    static headers() {
      if (this.headersImpl) {
        return this.headersImpl;
      }
      if (typeof self !== "undefined" && "Headers" in self) {
        return self.Headers;
      }
      if (typeof globalThis !== "undefined" && globalThis.Headers) {
        return globalThis.Headers;
      }
      if (typeof Headers !== "undefined") {
        return Headers;
      }
      debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
    static response() {
      if (this.responseImpl) {
        return this.responseImpl;
      }
      if (typeof self !== "undefined" && "Response" in self) {
        return self.Response;
      }
      if (typeof globalThis !== "undefined" && globalThis.Response) {
        return globalThis.Response;
      }
      if (typeof Response !== "undefined") {
        return Response;
      }
      debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
  };
  var SERVER_ERROR_MAP = {
    // Custom token errors.
    [
      "CREDENTIAL_MISMATCH"
      /* ServerError.CREDENTIAL_MISMATCH */
    ]: "custom-token-mismatch",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_CUSTOM_TOKEN"
      /* ServerError.MISSING_CUSTOM_TOKEN */
    ]: "internal-error",
    // Create Auth URI errors.
    [
      "INVALID_IDENTIFIER"
      /* ServerError.INVALID_IDENTIFIER */
    ]: "invalid-email",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_CONTINUE_URI"
      /* ServerError.MISSING_CONTINUE_URI */
    ]: "internal-error",
    // Sign in with email and password errors (some apply to sign up too).
    [
      "INVALID_PASSWORD"
      /* ServerError.INVALID_PASSWORD */
    ]: "wrong-password",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_PASSWORD"
      /* ServerError.MISSING_PASSWORD */
    ]: "missing-password",
    // Thrown if Email Enumeration Protection is enabled in the project and the email or password is
    // invalid.
    [
      "INVALID_LOGIN_CREDENTIALS"
      /* ServerError.INVALID_LOGIN_CREDENTIALS */
    ]: "invalid-credential",
    // Sign up with email and password errors.
    [
      "EMAIL_EXISTS"
      /* ServerError.EMAIL_EXISTS */
    ]: "email-already-in-use",
    [
      "PASSWORD_LOGIN_DISABLED"
      /* ServerError.PASSWORD_LOGIN_DISABLED */
    ]: "operation-not-allowed",
    // Verify assertion for sign in with credential errors:
    [
      "INVALID_IDP_RESPONSE"
      /* ServerError.INVALID_IDP_RESPONSE */
    ]: "invalid-credential",
    [
      "INVALID_PENDING_TOKEN"
      /* ServerError.INVALID_PENDING_TOKEN */
    ]: "invalid-credential",
    [
      "FEDERATED_USER_ID_ALREADY_LINKED"
      /* ServerError.FEDERATED_USER_ID_ALREADY_LINKED */
    ]: "credential-already-in-use",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_REQ_TYPE"
      /* ServerError.MISSING_REQ_TYPE */
    ]: "internal-error",
    // Send Password reset email errors:
    [
      "EMAIL_NOT_FOUND"
      /* ServerError.EMAIL_NOT_FOUND */
    ]: "user-not-found",
    [
      "RESET_PASSWORD_EXCEED_LIMIT"
      /* ServerError.RESET_PASSWORD_EXCEED_LIMIT */
    ]: "too-many-requests",
    [
      "EXPIRED_OOB_CODE"
      /* ServerError.EXPIRED_OOB_CODE */
    ]: "expired-action-code",
    [
      "INVALID_OOB_CODE"
      /* ServerError.INVALID_OOB_CODE */
    ]: "invalid-action-code",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_OOB_CODE"
      /* ServerError.MISSING_OOB_CODE */
    ]: "internal-error",
    // Operations that require ID token in request:
    [
      "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
      /* ServerError.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */
    ]: "requires-recent-login",
    [
      "INVALID_ID_TOKEN"
      /* ServerError.INVALID_ID_TOKEN */
    ]: "invalid-user-token",
    [
      "TOKEN_EXPIRED"
      /* ServerError.TOKEN_EXPIRED */
    ]: "user-token-expired",
    [
      "USER_NOT_FOUND"
      /* ServerError.USER_NOT_FOUND */
    ]: "user-token-expired",
    // Other errors.
    [
      "TOO_MANY_ATTEMPTS_TRY_LATER"
      /* ServerError.TOO_MANY_ATTEMPTS_TRY_LATER */
    ]: "too-many-requests",
    [
      "PASSWORD_DOES_NOT_MEET_REQUIREMENTS"
      /* ServerError.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */
    ]: "password-does-not-meet-requirements",
    // Phone Auth related errors.
    [
      "INVALID_CODE"
      /* ServerError.INVALID_CODE */
    ]: "invalid-verification-code",
    [
      "INVALID_SESSION_INFO"
      /* ServerError.INVALID_SESSION_INFO */
    ]: "invalid-verification-id",
    [
      "INVALID_TEMPORARY_PROOF"
      /* ServerError.INVALID_TEMPORARY_PROOF */
    ]: "invalid-credential",
    [
      "MISSING_SESSION_INFO"
      /* ServerError.MISSING_SESSION_INFO */
    ]: "missing-verification-id",
    [
      "SESSION_EXPIRED"
      /* ServerError.SESSION_EXPIRED */
    ]: "code-expired",
    // Other action code errors when additional settings passed.
    // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
    // This is OK as this error will be caught by client side validation.
    [
      "MISSING_ANDROID_PACKAGE_NAME"
      /* ServerError.MISSING_ANDROID_PACKAGE_NAME */
    ]: "missing-android-pkg-name",
    [
      "UNAUTHORIZED_DOMAIN"
      /* ServerError.UNAUTHORIZED_DOMAIN */
    ]: "unauthorized-continue-uri",
    // getProjectConfig errors when clientId is passed.
    [
      "INVALID_OAUTH_CLIENT_ID"
      /* ServerError.INVALID_OAUTH_CLIENT_ID */
    ]: "invalid-oauth-client-id",
    // User actions (sign-up or deletion) disabled errors.
    [
      "ADMIN_ONLY_OPERATION"
      /* ServerError.ADMIN_ONLY_OPERATION */
    ]: "admin-restricted-operation",
    // Multi factor related errors.
    [
      "INVALID_MFA_PENDING_CREDENTIAL"
      /* ServerError.INVALID_MFA_PENDING_CREDENTIAL */
    ]: "invalid-multi-factor-session",
    [
      "MFA_ENROLLMENT_NOT_FOUND"
      /* ServerError.MFA_ENROLLMENT_NOT_FOUND */
    ]: "multi-factor-info-not-found",
    [
      "MISSING_MFA_ENROLLMENT_ID"
      /* ServerError.MISSING_MFA_ENROLLMENT_ID */
    ]: "missing-multi-factor-info",
    [
      "MISSING_MFA_PENDING_CREDENTIAL"
      /* ServerError.MISSING_MFA_PENDING_CREDENTIAL */
    ]: "missing-multi-factor-session",
    [
      "SECOND_FACTOR_EXISTS"
      /* ServerError.SECOND_FACTOR_EXISTS */
    ]: "second-factor-already-in-use",
    [
      "SECOND_FACTOR_LIMIT_EXCEEDED"
      /* ServerError.SECOND_FACTOR_LIMIT_EXCEEDED */
    ]: "maximum-second-factor-count-exceeded",
    // Blocking functions related errors.
    [
      "BLOCKING_FUNCTION_ERROR_RESPONSE"
      /* ServerError.BLOCKING_FUNCTION_ERROR_RESPONSE */
    ]: "internal-error",
    // Recaptcha related errors.
    [
      "RECAPTCHA_NOT_ENABLED"
      /* ServerError.RECAPTCHA_NOT_ENABLED */
    ]: "recaptcha-not-enabled",
    [
      "MISSING_RECAPTCHA_TOKEN"
      /* ServerError.MISSING_RECAPTCHA_TOKEN */
    ]: "missing-recaptcha-token",
    [
      "INVALID_RECAPTCHA_TOKEN"
      /* ServerError.INVALID_RECAPTCHA_TOKEN */
    ]: "invalid-recaptcha-token",
    [
      "INVALID_RECAPTCHA_ACTION"
      /* ServerError.INVALID_RECAPTCHA_ACTION */
    ]: "invalid-recaptcha-action",
    [
      "MISSING_CLIENT_TYPE"
      /* ServerError.MISSING_CLIENT_TYPE */
    ]: "missing-client-type",
    [
      "MISSING_RECAPTCHA_VERSION"
      /* ServerError.MISSING_RECAPTCHA_VERSION */
    ]: "missing-recaptcha-version",
    [
      "INVALID_RECAPTCHA_VERSION"
      /* ServerError.INVALID_RECAPTCHA_VERSION */
    ]: "invalid-recaptcha-version",
    [
      "INVALID_REQ_TYPE"
      /* ServerError.INVALID_REQ_TYPE */
    ]: "invalid-req-type"
    /* AuthErrorCode.INVALID_REQ_TYPE */
  };
  var CookieAuthProxiedEndpoints = [
    "/v1/accounts:signInWithCustomToken",
    "/v1/accounts:signInWithEmailLink",
    "/v1/accounts:signInWithIdp",
    "/v1/accounts:signInWithPassword",
    "/v1/accounts:signInWithPhoneNumber",
    "/v1/token"
    /* Endpoint.TOKEN */
  ];
  var DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
  function _addTidIfNecessary(auth2, request) {
    if (auth2.tenantId && !request.tenantId) {
      return Object.assign(Object.assign({}, request), { tenantId: auth2.tenantId });
    }
    return request;
  }
  async function _performApiRequest(auth2, method, path, request, customErrorMap = {}) {
    return _performFetchWithErrorHandling(auth2, customErrorMap, async () => {
      let body = {};
      let params = {};
      if (request) {
        if (method === "GET") {
          params = request;
        } else {
          body = {
            body: JSON.stringify(request)
          };
        }
      }
      const query2 = querystring(Object.assign({ key: auth2.config.apiKey }, params)).slice(1);
      const headers = await auth2._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/json";
      if (auth2.languageCode) {
        headers[
          "X-Firebase-Locale"
          /* HttpHeader.X_FIREBASE_LOCALE */
        ] = auth2.languageCode;
      }
      const fetchArgs = Object.assign({
        method,
        headers
      }, body);
      if (!isCloudflareWorker()) {
        fetchArgs.referrerPolicy = "no-referrer";
      }
      if (auth2.emulatorConfig && isCloudWorkstation(auth2.emulatorConfig.host)) {
        fetchArgs.credentials = "include";
      }
      return FetchProvider.fetch()(await _getFinalTarget(auth2, auth2.config.apiHost, path, query2), fetchArgs);
    });
  }
  async function _performFetchWithErrorHandling(auth2, customErrorMap, fetchFn) {
    auth2._canInitEmulator = false;
    const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
    try {
      const networkTimeout = new NetworkTimeout(auth2);
      const response = await Promise.race([
        fetchFn(),
        networkTimeout.promise
      ]);
      networkTimeout.clearNetworkTimeout();
      const json = await response.json();
      if ("needConfirmation" in json) {
        throw _makeTaggedError(auth2, "account-exists-with-different-credential", json);
      }
      if (response.ok && !("errorMessage" in json)) {
        return json;
      } else {
        const errorMessage = response.ok ? json.errorMessage : json.error.message;
        const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
        if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
          throw _makeTaggedError(auth2, "credential-already-in-use", json);
        } else if (serverErrorCode === "EMAIL_EXISTS") {
          throw _makeTaggedError(auth2, "email-already-in-use", json);
        } else if (serverErrorCode === "USER_DISABLED") {
          throw _makeTaggedError(auth2, "user-disabled", json);
        }
        const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
        if (serverErrorMessage) {
          throw _errorWithCustomMessage(auth2, authError, serverErrorMessage);
        } else {
          _fail(auth2, authError);
        }
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        throw e;
      }
      _fail(auth2, "network-request-failed", { "message": String(e) });
    }
  }
  async function _performSignInRequest(auth2, method, path, request, customErrorMap = {}) {
    const serverResponse = await _performApiRequest(auth2, method, path, request, customErrorMap);
    if ("mfaPendingCredential" in serverResponse) {
      _fail(auth2, "multi-factor-auth-required", {
        _serverResponse: serverResponse
      });
    }
    return serverResponse;
  }
  async function _getFinalTarget(auth2, host, path, query2) {
    const base = `${host}${path}?${query2}`;
    const authInternal = auth2;
    const finalTarget = authInternal.config.emulator ? _emulatorUrl(auth2.config, base) : `${auth2.config.apiScheme}://${base}`;
    if (CookieAuthProxiedEndpoints.includes(path)) {
      await authInternal._persistenceManagerAvailable;
      if (authInternal._getPersistenceType() === "COOKIE") {
        const cookiePersistence = authInternal._getPersistence();
        return cookiePersistence._getFinalTarget(finalTarget).toString();
      }
    }
    return finalTarget;
  }
  function _parseEnforcementState(enforcementStateStr) {
    switch (enforcementStateStr) {
      case "ENFORCE":
        return "ENFORCE";
      case "AUDIT":
        return "AUDIT";
      case "OFF":
        return "OFF";
      default:
        return "ENFORCEMENT_STATE_UNSPECIFIED";
    }
  }
  var NetworkTimeout = class {
    clearNetworkTimeout() {
      clearTimeout(this.timer);
    }
    constructor(auth2) {
      this.auth = auth2;
      this.timer = null;
      this.promise = new Promise((_, reject) => {
        this.timer = setTimeout(() => {
          return reject(_createError(
            this.auth,
            "network-request-failed"
            /* AuthErrorCode.NETWORK_REQUEST_FAILED */
          ));
        }, DEFAULT_API_TIMEOUT_MS.get());
      });
    }
  };
  function _makeTaggedError(auth2, code, response) {
    const errorParams = {
      appName: auth2.name
    };
    if (response.email) {
      errorParams.email = response.email;
    }
    if (response.phoneNumber) {
      errorParams.phoneNumber = response.phoneNumber;
    }
    const error = _createError(auth2, code, errorParams);
    error.customData._tokenResponse = response;
    return error;
  }
  function isEnterprise(grecaptcha) {
    return grecaptcha !== void 0 && grecaptcha.enterprise !== void 0;
  }
  var RecaptchaConfig = class {
    constructor(response) {
      this.siteKey = "";
      this.recaptchaEnforcementState = [];
      if (response.recaptchaKey === void 0) {
        throw new Error("recaptchaKey undefined");
      }
      this.siteKey = response.recaptchaKey.split("/")[3];
      this.recaptchaEnforcementState = response.recaptchaEnforcementState;
    }
    /**
     * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
     *
     * @param providerStr - The provider whose enforcement state is to be returned.
     * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
     */
    getProviderEnforcementState(providerStr) {
      if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) {
        return null;
      }
      for (const recaptchaEnforcementState of this.recaptchaEnforcementState) {
        if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) {
          return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
        }
      }
      return null;
    }
    /**
     * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
     *
     * @param providerStr - The provider whose enablement state is to be returned.
     * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
     */
    isProviderEnabled(providerStr) {
      return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
    }
    /**
     * Returns true if reCAPTCHA Enterprise protection is enabled in at least one provider, otherwise
     * returns false.
     *
     * @returns Whether or not reCAPTCHA Enterprise protection is enabled for at least one provider.
     */
    isAnyProviderEnabled() {
      return this.isProviderEnabled(
        "EMAIL_PASSWORD_PROVIDER"
        /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
      ) || this.isProviderEnabled(
        "PHONE_PROVIDER"
        /* RecaptchaAuthProvider.PHONE_PROVIDER */
      );
    }
  };
  async function getRecaptchaConfig(auth2, request) {
    return _performApiRequest(auth2, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth2, request));
  }
  async function deleteAccount(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:delete", request);
  }
  async function getAccountInfo(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:lookup", request);
  }
  function utcTimestampToDateString(utcTimestamp) {
    if (!utcTimestamp) {
      return void 0;
    }
    try {
      const date = new Date(Number(utcTimestamp));
      if (!isNaN(date.getTime())) {
        return date.toUTCString();
      }
    } catch (e) {
    }
    return void 0;
  }
  async function getIdTokenResult(user, forceRefresh = false) {
    const userInternal = getModularInstance(user);
    const token = await userInternal.getIdToken(forceRefresh);
    const claims = _parseToken(token);
    _assert(
      claims && claims.exp && claims.auth_time && claims.iat,
      userInternal.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const firebase = typeof claims.firebase === "object" ? claims.firebase : void 0;
    const signInProvider = firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_provider"];
    return {
      claims,
      token,
      authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
      issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
      expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
      signInProvider: signInProvider || null,
      signInSecondFactor: (firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_second_factor"]) || null
    };
  }
  function secondsStringToMilliseconds(seconds) {
    return Number(seconds) * 1e3;
  }
  function _parseToken(token) {
    const [algorithm, payload, signature] = token.split(".");
    if (algorithm === void 0 || payload === void 0 || signature === void 0) {
      _logError("JWT malformed, contained fewer than 3 sections");
      return null;
    }
    try {
      const decoded = base64Decode(payload);
      if (!decoded) {
        _logError("Failed to decode base64 JWT payload");
        return null;
      }
      return JSON.parse(decoded);
    } catch (e) {
      _logError("Caught error parsing JWT payload as JSON", e === null || e === void 0 ? void 0 : e.toString());
      return null;
    }
  }
  function _tokenExpiresIn(token) {
    const parsedToken = _parseToken(token);
    _assert(
      parsedToken,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof parsedToken.exp !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof parsedToken.iat !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return Number(parsedToken.exp) - Number(parsedToken.iat);
  }
  async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
    if (bypassAuthState) {
      return promise;
    }
    try {
      return await promise;
    } catch (e) {
      if (e instanceof FirebaseError && isUserInvalidated(e)) {
        if (user.auth.currentUser === user) {
          await user.auth.signOut();
        }
      }
      throw e;
    }
  }
  function isUserInvalidated({ code }) {
    return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
  }
  var ProactiveRefresh = class {
    constructor(user) {
      this.user = user;
      this.isRunning = false;
      this.timerId = null;
      this.errorBackoff = 3e4;
    }
    _start() {
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;
      this.schedule();
    }
    _stop() {
      if (!this.isRunning) {
        return;
      }
      this.isRunning = false;
      if (this.timerId !== null) {
        clearTimeout(this.timerId);
      }
    }
    getInterval(wasError) {
      var _a;
      if (wasError) {
        const interval = this.errorBackoff;
        this.errorBackoff = Math.min(
          this.errorBackoff * 2,
          96e4
          /* Duration.RETRY_BACKOFF_MAX */
        );
        return interval;
      } else {
        this.errorBackoff = 3e4;
        const expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== void 0 ? _a : 0;
        const interval = expTime - Date.now() - 3e5;
        return Math.max(0, interval);
      }
    }
    schedule(wasError = false) {
      if (!this.isRunning) {
        return;
      }
      const interval = this.getInterval(wasError);
      this.timerId = setTimeout(async () => {
        await this.iteration();
      }, interval);
    }
    async iteration() {
      try {
        await this.user.getIdToken(true);
      } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"network-request-failed"}`) {
          this.schedule(
            /* wasError */
            true
          );
        }
        return;
      }
      this.schedule();
    }
  };
  var UserMetadata = class {
    constructor(createdAt, lastLoginAt) {
      this.createdAt = createdAt;
      this.lastLoginAt = lastLoginAt;
      this._initializeTime();
    }
    _initializeTime() {
      this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
      this.creationTime = utcTimestampToDateString(this.createdAt);
    }
    _copy(metadata) {
      this.createdAt = metadata.createdAt;
      this.lastLoginAt = metadata.lastLoginAt;
      this._initializeTime();
    }
    toJSON() {
      return {
        createdAt: this.createdAt,
        lastLoginAt: this.lastLoginAt
      };
    }
  };
  async function _reloadWithoutSaving(user) {
    var _a;
    const auth2 = user.auth;
    const idToken = await user.getIdToken();
    const response = await _logoutIfInvalidated(user, getAccountInfo(auth2, { idToken }));
    _assert(
      response === null || response === void 0 ? void 0 : response.users.length,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const coreAccount = response.users[0];
    user._notifyReloadListener(coreAccount);
    const newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === void 0 ? void 0 : _a.length) ? extractProviderData(coreAccount.providerUserInfo) : [];
    const providerData = mergeProviderData(user.providerData, newProviderData);
    const oldIsAnonymous = user.isAnonymous;
    const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
    const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
    const updates = {
      uid: coreAccount.localId,
      displayName: coreAccount.displayName || null,
      photoURL: coreAccount.photoUrl || null,
      email: coreAccount.email || null,
      emailVerified: coreAccount.emailVerified || false,
      phoneNumber: coreAccount.phoneNumber || null,
      tenantId: coreAccount.tenantId || null,
      providerData,
      metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
      isAnonymous
    };
    Object.assign(user, updates);
  }
  async function reload(user) {
    const userInternal = getModularInstance(user);
    await _reloadWithoutSaving(userInternal);
    await userInternal.auth._persistUserIfCurrent(userInternal);
    userInternal.auth._notifyListenersIfCurrent(userInternal);
  }
  function mergeProviderData(original, newData) {
    const deduped = original.filter((o) => !newData.some((n) => n.providerId === o.providerId));
    return [...deduped, ...newData];
  }
  function extractProviderData(providers) {
    return providers.map((_a) => {
      var { providerId } = _a, provider = __rest(_a, ["providerId"]);
      return {
        providerId,
        uid: provider.rawId || "",
        displayName: provider.displayName || null,
        email: provider.email || null,
        phoneNumber: provider.phoneNumber || null,
        photoURL: provider.photoUrl || null
      };
    });
  }
  async function requestStsToken(auth2, refreshToken) {
    const response = await _performFetchWithErrorHandling(auth2, {}, async () => {
      const body = querystring({
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
      }).slice(1);
      const { tokenApiHost, apiKey } = auth2.config;
      const url = await _getFinalTarget(auth2, tokenApiHost, "/v1/token", `key=${apiKey}`);
      const headers = await auth2._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/x-www-form-urlencoded";
      const options = {
        method: "POST",
        headers,
        body
      };
      if (auth2.emulatorConfig && isCloudWorkstation(auth2.emulatorConfig.host)) {
        options.credentials = "include";
      }
      return FetchProvider.fetch()(url, options);
    });
    return {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token
    };
  }
  async function revokeToken(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth2, request));
  }
  var StsTokenManager = class _StsTokenManager {
    constructor() {
      this.refreshToken = null;
      this.accessToken = null;
      this.expirationTime = null;
    }
    get isExpired() {
      return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
    }
    updateFromServerResponse(response) {
      _assert(
        response.idToken,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      _assert(
        typeof response.idToken !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      _assert(
        typeof response.refreshToken !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
      this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
    }
    updateFromIdToken(idToken) {
      _assert(
        idToken.length !== 0,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const expiresIn = _tokenExpiresIn(idToken);
      this.updateTokensAndExpiration(idToken, null, expiresIn);
    }
    async getToken(auth2, forceRefresh = false) {
      if (!forceRefresh && this.accessToken && !this.isExpired) {
        return this.accessToken;
      }
      _assert(
        this.refreshToken,
        auth2,
        "user-token-expired"
        /* AuthErrorCode.TOKEN_EXPIRED */
      );
      if (this.refreshToken) {
        await this.refresh(auth2, this.refreshToken);
        return this.accessToken;
      }
      return null;
    }
    clearRefreshToken() {
      this.refreshToken = null;
    }
    async refresh(auth2, oldToken) {
      const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth2, oldToken);
      this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
    }
    updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
      this.refreshToken = refreshToken || null;
      this.accessToken = accessToken || null;
      this.expirationTime = Date.now() + expiresInSec * 1e3;
    }
    static fromJSON(appName, object) {
      const { refreshToken, accessToken, expirationTime } = object;
      const manager = new _StsTokenManager();
      if (refreshToken) {
        _assert(typeof refreshToken === "string", "internal-error", {
          appName
        });
        manager.refreshToken = refreshToken;
      }
      if (accessToken) {
        _assert(typeof accessToken === "string", "internal-error", {
          appName
        });
        manager.accessToken = accessToken;
      }
      if (expirationTime) {
        _assert(typeof expirationTime === "number", "internal-error", {
          appName
        });
        manager.expirationTime = expirationTime;
      }
      return manager;
    }
    toJSON() {
      return {
        refreshToken: this.refreshToken,
        accessToken: this.accessToken,
        expirationTime: this.expirationTime
      };
    }
    _assign(stsTokenManager) {
      this.accessToken = stsTokenManager.accessToken;
      this.refreshToken = stsTokenManager.refreshToken;
      this.expirationTime = stsTokenManager.expirationTime;
    }
    _clone() {
      return Object.assign(new _StsTokenManager(), this.toJSON());
    }
    _performRefresh() {
      return debugFail("not implemented");
    }
  };
  function assertStringOrUndefined(assertion, appName) {
    _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
  }
  var UserImpl = class _UserImpl {
    constructor(_a) {
      var { uid, auth: auth2, stsTokenManager } = _a, opt = __rest(_a, ["uid", "auth", "stsTokenManager"]);
      this.providerId = "firebase";
      this.proactiveRefresh = new ProactiveRefresh(this);
      this.reloadUserInfo = null;
      this.reloadListener = null;
      this.uid = uid;
      this.auth = auth2;
      this.stsTokenManager = stsTokenManager;
      this.accessToken = stsTokenManager.accessToken;
      this.displayName = opt.displayName || null;
      this.email = opt.email || null;
      this.emailVerified = opt.emailVerified || false;
      this.phoneNumber = opt.phoneNumber || null;
      this.photoURL = opt.photoURL || null;
      this.isAnonymous = opt.isAnonymous || false;
      this.tenantId = opt.tenantId || null;
      this.providerData = opt.providerData ? [...opt.providerData] : [];
      this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
    }
    async getIdToken(forceRefresh) {
      const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
      _assert(
        accessToken,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      if (this.accessToken !== accessToken) {
        this.accessToken = accessToken;
        await this.auth._persistUserIfCurrent(this);
        this.auth._notifyListenersIfCurrent(this);
      }
      return accessToken;
    }
    getIdTokenResult(forceRefresh) {
      return getIdTokenResult(this, forceRefresh);
    }
    reload() {
      return reload(this);
    }
    _assign(user) {
      if (this === user) {
        return;
      }
      _assert(
        this.uid === user.uid,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
      this.email = user.email;
      this.emailVerified = user.emailVerified;
      this.phoneNumber = user.phoneNumber;
      this.isAnonymous = user.isAnonymous;
      this.tenantId = user.tenantId;
      this.providerData = user.providerData.map((userInfo) => Object.assign({}, userInfo));
      this.metadata._copy(user.metadata);
      this.stsTokenManager._assign(user.stsTokenManager);
    }
    _clone(auth2) {
      const newUser = new _UserImpl(Object.assign(Object.assign({}, this), { auth: auth2, stsTokenManager: this.stsTokenManager._clone() }));
      newUser.metadata._copy(this.metadata);
      return newUser;
    }
    _onReload(callback) {
      _assert(
        !this.reloadListener,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      this.reloadListener = callback;
      if (this.reloadUserInfo) {
        this._notifyReloadListener(this.reloadUserInfo);
        this.reloadUserInfo = null;
      }
    }
    _notifyReloadListener(userInfo) {
      if (this.reloadListener) {
        this.reloadListener(userInfo);
      } else {
        this.reloadUserInfo = userInfo;
      }
    }
    _startProactiveRefresh() {
      this.proactiveRefresh._start();
    }
    _stopProactiveRefresh() {
      this.proactiveRefresh._stop();
    }
    async _updateTokensIfNecessary(response, reload2 = false) {
      let tokensRefreshed = false;
      if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
        this.stsTokenManager.updateFromServerResponse(response);
        tokensRefreshed = true;
      }
      if (reload2) {
        await _reloadWithoutSaving(this);
      }
      await this.auth._persistUserIfCurrent(this);
      if (tokensRefreshed) {
        this.auth._notifyListenersIfCurrent(this);
      }
    }
    async delete() {
      if (_isFirebaseServerApp(this.auth.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this.auth));
      }
      const idToken = await this.getIdToken();
      await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
      this.stsTokenManager.clearRefreshToken();
      return this.auth.signOut();
    }
    toJSON() {
      return Object.assign(Object.assign({
        uid: this.uid,
        email: this.email || void 0,
        emailVerified: this.emailVerified,
        displayName: this.displayName || void 0,
        isAnonymous: this.isAnonymous,
        photoURL: this.photoURL || void 0,
        phoneNumber: this.phoneNumber || void 0,
        tenantId: this.tenantId || void 0,
        providerData: this.providerData.map((userInfo) => Object.assign({}, userInfo)),
        stsTokenManager: this.stsTokenManager.toJSON(),
        // Redirect event ID must be maintained in case there is a pending
        // redirect event.
        _redirectEventId: this._redirectEventId
      }, this.metadata.toJSON()), {
        // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
        apiKey: this.auth.config.apiKey,
        appName: this.auth.name
      });
    }
    get refreshToken() {
      return this.stsTokenManager.refreshToken || "";
    }
    static _fromJSON(auth2, object) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const displayName = (_a = object.displayName) !== null && _a !== void 0 ? _a : void 0;
      const email = (_b = object.email) !== null && _b !== void 0 ? _b : void 0;
      const phoneNumber = (_c = object.phoneNumber) !== null && _c !== void 0 ? _c : void 0;
      const photoURL = (_d = object.photoURL) !== null && _d !== void 0 ? _d : void 0;
      const tenantId = (_e = object.tenantId) !== null && _e !== void 0 ? _e : void 0;
      const _redirectEventId = (_f = object._redirectEventId) !== null && _f !== void 0 ? _f : void 0;
      const createdAt = (_g = object.createdAt) !== null && _g !== void 0 ? _g : void 0;
      const lastLoginAt = (_h = object.lastLoginAt) !== null && _h !== void 0 ? _h : void 0;
      const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
      _assert(
        uid && plainObjectTokenManager,
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
      _assert(
        typeof uid === "string",
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      assertStringOrUndefined(displayName, auth2.name);
      assertStringOrUndefined(email, auth2.name);
      _assert(
        typeof emailVerified === "boolean",
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      _assert(
        typeof isAnonymous === "boolean",
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      assertStringOrUndefined(phoneNumber, auth2.name);
      assertStringOrUndefined(photoURL, auth2.name);
      assertStringOrUndefined(tenantId, auth2.name);
      assertStringOrUndefined(_redirectEventId, auth2.name);
      assertStringOrUndefined(createdAt, auth2.name);
      assertStringOrUndefined(lastLoginAt, auth2.name);
      const user = new _UserImpl({
        uid,
        auth: auth2,
        email,
        emailVerified,
        displayName,
        isAnonymous,
        photoURL,
        phoneNumber,
        tenantId,
        stsTokenManager,
        createdAt,
        lastLoginAt
      });
      if (providerData && Array.isArray(providerData)) {
        user.providerData = providerData.map((userInfo) => Object.assign({}, userInfo));
      }
      if (_redirectEventId) {
        user._redirectEventId = _redirectEventId;
      }
      return user;
    }
    /**
     * Initialize a User from an idToken server response
     * @param auth
     * @param idTokenResponse
     */
    static async _fromIdTokenResponse(auth2, idTokenResponse, isAnonymous = false) {
      const stsTokenManager = new StsTokenManager();
      stsTokenManager.updateFromServerResponse(idTokenResponse);
      const user = new _UserImpl({
        uid: idTokenResponse.localId,
        auth: auth2,
        stsTokenManager,
        isAnonymous
      });
      await _reloadWithoutSaving(user);
      return user;
    }
    /**
     * Initialize a User from an idToken server response
     * @param auth
     * @param idTokenResponse
     */
    static async _fromGetAccountInfoResponse(auth2, response, idToken) {
      const coreAccount = response.users[0];
      _assert(
        coreAccount.localId !== void 0,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const providerData = coreAccount.providerUserInfo !== void 0 ? extractProviderData(coreAccount.providerUserInfo) : [];
      const isAnonymous = !(coreAccount.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
      const stsTokenManager = new StsTokenManager();
      stsTokenManager.updateFromIdToken(idToken);
      const user = new _UserImpl({
        uid: coreAccount.localId,
        auth: auth2,
        stsTokenManager,
        isAnonymous
      });
      const updates = {
        uid: coreAccount.localId,
        displayName: coreAccount.displayName || null,
        photoURL: coreAccount.photoUrl || null,
        email: coreAccount.email || null,
        emailVerified: coreAccount.emailVerified || false,
        phoneNumber: coreAccount.phoneNumber || null,
        tenantId: coreAccount.tenantId || null,
        providerData,
        metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
        isAnonymous: !(coreAccount.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length)
      };
      Object.assign(user, updates);
      return user;
    }
  };
  var instanceCache = /* @__PURE__ */ new Map();
  function _getInstance(cls) {
    debugAssert(cls instanceof Function, "Expected a class definition");
    let instance = instanceCache.get(cls);
    if (instance) {
      debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
      return instance;
    }
    instance = new cls();
    instanceCache.set(cls, instance);
    return instance;
  }
  var InMemoryPersistence = class {
    constructor() {
      this.type = "NONE";
      this.storage = {};
    }
    async _isAvailable() {
      return true;
    }
    async _set(key, value) {
      this.storage[key] = value;
    }
    async _get(key) {
      const value = this.storage[key];
      return value === void 0 ? null : value;
    }
    async _remove(key) {
      delete this.storage[key];
    }
    _addListener(_key, _listener) {
      return;
    }
    _removeListener(_key, _listener) {
      return;
    }
  };
  InMemoryPersistence.type = "NONE";
  var inMemoryPersistence = InMemoryPersistence;
  function _persistenceKeyName(key, apiKey, appName) {
    return `${"firebase"}:${key}:${apiKey}:${appName}`;
  }
  var PersistenceUserManager = class _PersistenceUserManager {
    constructor(persistence, auth2, userKey) {
      this.persistence = persistence;
      this.auth = auth2;
      this.userKey = userKey;
      const { config, name: name4 } = this.auth;
      this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name4);
      this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name4);
      this.boundEventHandler = auth2._onStorageEvent.bind(auth2);
      this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
    }
    setCurrentUser(user) {
      return this.persistence._set(this.fullUserKey, user.toJSON());
    }
    async getCurrentUser() {
      const blob = await this.persistence._get(this.fullUserKey);
      if (!blob) {
        return null;
      }
      if (typeof blob === "string") {
        const response = await getAccountInfo(this.auth, { idToken: blob }).catch(() => void 0);
        if (!response) {
          return null;
        }
        return UserImpl._fromGetAccountInfoResponse(this.auth, response, blob);
      }
      return UserImpl._fromJSON(this.auth, blob);
    }
    removeCurrentUser() {
      return this.persistence._remove(this.fullUserKey);
    }
    savePersistenceForRedirect() {
      return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
    }
    async setPersistence(newPersistence) {
      if (this.persistence === newPersistence) {
        return;
      }
      const currentUser = await this.getCurrentUser();
      await this.removeCurrentUser();
      this.persistence = newPersistence;
      if (currentUser) {
        return this.setCurrentUser(currentUser);
      }
    }
    delete() {
      this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
    }
    static async create(auth2, persistenceHierarchy, userKey = "authUser") {
      if (!persistenceHierarchy.length) {
        return new _PersistenceUserManager(_getInstance(inMemoryPersistence), auth2, userKey);
      }
      const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
        if (await persistence._isAvailable()) {
          return persistence;
        }
        return void 0;
      }))).filter((persistence) => persistence);
      let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
      const key = _persistenceKeyName(userKey, auth2.config.apiKey, auth2.name);
      let userToMigrate = null;
      for (const persistence of persistenceHierarchy) {
        try {
          const blob = await persistence._get(key);
          if (blob) {
            let user;
            if (typeof blob === "string") {
              const response = await getAccountInfo(auth2, {
                idToken: blob
              }).catch(() => void 0);
              if (!response) {
                break;
              }
              user = await UserImpl._fromGetAccountInfoResponse(auth2, response, blob);
            } else {
              user = UserImpl._fromJSON(auth2, blob);
            }
            if (persistence !== selectedPersistence) {
              userToMigrate = user;
            }
            selectedPersistence = persistence;
            break;
          }
        } catch (_a) {
        }
      }
      const migrationHierarchy = availablePersistences.filter((p) => p._shouldAllowMigration);
      if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
        return new _PersistenceUserManager(selectedPersistence, auth2, userKey);
      }
      selectedPersistence = migrationHierarchy[0];
      if (userToMigrate) {
        await selectedPersistence._set(key, userToMigrate.toJSON());
      }
      await Promise.all(persistenceHierarchy.map(async (persistence) => {
        if (persistence !== selectedPersistence) {
          try {
            await persistence._remove(key);
          } catch (_a) {
          }
        }
      }));
      return new _PersistenceUserManager(selectedPersistence, auth2, userKey);
    }
  };
  function _getBrowserName(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) {
      return "Opera";
    } else if (_isIEMobile(ua)) {
      return "IEMobile";
    } else if (ua.includes("msie") || ua.includes("trident/")) {
      return "IE";
    } else if (ua.includes("edge/")) {
      return "Edge";
    } else if (_isFirefox(ua)) {
      return "Firefox";
    } else if (ua.includes("silk/")) {
      return "Silk";
    } else if (_isBlackBerry(ua)) {
      return "Blackberry";
    } else if (_isWebOS(ua)) {
      return "Webos";
    } else if (_isSafari(ua)) {
      return "Safari";
    } else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) {
      return "Chrome";
    } else if (_isAndroid(ua)) {
      return "Android";
    } else {
      const re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
      const matches = userAgent.match(re);
      if ((matches === null || matches === void 0 ? void 0 : matches.length) === 2) {
        return matches[1];
      }
    }
    return "Other";
  }
  function _isFirefox(ua = getUA()) {
    return /firefox\//i.test(ua);
  }
  function _isSafari(userAgent = getUA()) {
    const ua = userAgent.toLowerCase();
    return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
  }
  function _isChromeIOS(ua = getUA()) {
    return /crios\//i.test(ua);
  }
  function _isIEMobile(ua = getUA()) {
    return /iemobile/i.test(ua);
  }
  function _isAndroid(ua = getUA()) {
    return /android/i.test(ua);
  }
  function _isBlackBerry(ua = getUA()) {
    return /blackberry/i.test(ua);
  }
  function _isWebOS(ua = getUA()) {
    return /webos/i.test(ua);
  }
  function _isIOS(ua = getUA()) {
    return /iphone|ipad|ipod/i.test(ua) || /macintosh/i.test(ua) && /mobile/i.test(ua);
  }
  function _isIOSStandalone(ua = getUA()) {
    var _a;
    return _isIOS(ua) && !!((_a = window.navigator) === null || _a === void 0 ? void 0 : _a.standalone);
  }
  function _isIE10() {
    return isIE() && document.documentMode === 10;
  }
  function _isMobileBrowser(ua = getUA()) {
    return _isIOS(ua) || _isAndroid(ua) || _isWebOS(ua) || _isBlackBerry(ua) || /windows phone/i.test(ua) || _isIEMobile(ua);
  }
  function _getClientVersion(clientPlatform, frameworks = []) {
    let reportedPlatform;
    switch (clientPlatform) {
      case "Browser":
        reportedPlatform = _getBrowserName(getUA());
        break;
      case "Worker":
        reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
        break;
      default:
        reportedPlatform = clientPlatform;
    }
    const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
    return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
  }
  var AuthMiddlewareQueue = class {
    constructor(auth2) {
      this.auth = auth2;
      this.queue = [];
    }
    pushCallback(callback, onAbort) {
      const wrappedCallback = (user) => new Promise((resolve, reject) => {
        try {
          const result = callback(user);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
      wrappedCallback.onAbort = onAbort;
      this.queue.push(wrappedCallback);
      const index = this.queue.length - 1;
      return () => {
        this.queue[index] = () => Promise.resolve();
      };
    }
    async runMiddleware(nextUser) {
      if (this.auth.currentUser === nextUser) {
        return;
      }
      const onAbortStack = [];
      try {
        for (const beforeStateCallback of this.queue) {
          await beforeStateCallback(nextUser);
          if (beforeStateCallback.onAbort) {
            onAbortStack.push(beforeStateCallback.onAbort);
          }
        }
      } catch (e) {
        onAbortStack.reverse();
        for (const onAbort of onAbortStack) {
          try {
            onAbort();
          } catch (_) {
          }
        }
        throw this.auth._errorFactory.create("login-blocked", {
          originalMessage: e === null || e === void 0 ? void 0 : e.message
        });
      }
    }
  };
  async function _getPasswordPolicy(auth2, request = {}) {
    return _performApiRequest(auth2, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth2, request));
  }
  var MINIMUM_MIN_PASSWORD_LENGTH = 6;
  var PasswordPolicyImpl = class {
    constructor(response) {
      var _a, _b, _c, _d;
      const responseOptions = response.customStrengthOptions;
      this.customStrengthOptions = {};
      this.customStrengthOptions.minPasswordLength = (_a = responseOptions.minPasswordLength) !== null && _a !== void 0 ? _a : MINIMUM_MIN_PASSWORD_LENGTH;
      if (responseOptions.maxPasswordLength) {
        this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
      }
      if (responseOptions.containsLowercaseCharacter !== void 0) {
        this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
      }
      if (responseOptions.containsUppercaseCharacter !== void 0) {
        this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
      }
      if (responseOptions.containsNumericCharacter !== void 0) {
        this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
      }
      if (responseOptions.containsNonAlphanumericCharacter !== void 0) {
        this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
      }
      this.enforcementState = response.enforcementState;
      if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") {
        this.enforcementState = "OFF";
      }
      this.allowedNonAlphanumericCharacters = (_c = (_b = response.allowedNonAlphanumericCharacters) === null || _b === void 0 ? void 0 : _b.join("")) !== null && _c !== void 0 ? _c : "";
      this.forceUpgradeOnSignin = (_d = response.forceUpgradeOnSignin) !== null && _d !== void 0 ? _d : false;
      this.schemaVersion = response.schemaVersion;
    }
    validatePassword(password) {
      var _a, _b, _c, _d, _e, _f;
      const status = {
        isValid: true,
        passwordPolicy: this
      };
      this.validatePasswordLengthOptions(password, status);
      this.validatePasswordCharacterOptions(password, status);
      status.isValid && (status.isValid = (_a = status.meetsMinPasswordLength) !== null && _a !== void 0 ? _a : true);
      status.isValid && (status.isValid = (_b = status.meetsMaxPasswordLength) !== null && _b !== void 0 ? _b : true);
      status.isValid && (status.isValid = (_c = status.containsLowercaseLetter) !== null && _c !== void 0 ? _c : true);
      status.isValid && (status.isValid = (_d = status.containsUppercaseLetter) !== null && _d !== void 0 ? _d : true);
      status.isValid && (status.isValid = (_e = status.containsNumericCharacter) !== null && _e !== void 0 ? _e : true);
      status.isValid && (status.isValid = (_f = status.containsNonAlphanumericCharacter) !== null && _f !== void 0 ? _f : true);
      return status;
    }
    /**
     * Validates that the password meets the length options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    validatePasswordLengthOptions(password, status) {
      const minPasswordLength = this.customStrengthOptions.minPasswordLength;
      const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
      if (minPasswordLength) {
        status.meetsMinPasswordLength = password.length >= minPasswordLength;
      }
      if (maxPasswordLength) {
        status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
      }
    }
    /**
     * Validates that the password meets the character options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    validatePasswordCharacterOptions(password, status) {
      this.updatePasswordCharacterOptionsStatuses(
        status,
        /* containsLowercaseCharacter= */
        false,
        /* containsUppercaseCharacter= */
        false,
        /* containsNumericCharacter= */
        false,
        /* containsNonAlphanumericCharacter= */
        false
      );
      let passwordChar;
      for (let i = 0; i < password.length; i++) {
        passwordChar = password.charAt(i);
        this.updatePasswordCharacterOptionsStatuses(
          status,
          /* containsLowercaseCharacter= */
          passwordChar >= "a" && passwordChar <= "z",
          /* containsUppercaseCharacter= */
          passwordChar >= "A" && passwordChar <= "Z",
          /* containsNumericCharacter= */
          passwordChar >= "0" && passwordChar <= "9",
          /* containsNonAlphanumericCharacter= */
          this.allowedNonAlphanumericCharacters.includes(passwordChar)
        );
      }
    }
    /**
     * Updates the running validation status with the statuses for the character options.
     * Expected to be called each time a character is processed to update each option status
     * based on the current character.
     *
     * @param status Validation status.
     * @param containsLowercaseCharacter Whether the character is a lowercase letter.
     * @param containsUppercaseCharacter Whether the character is an uppercase letter.
     * @param containsNumericCharacter Whether the character is a numeric character.
     * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
     */
    updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
      if (this.customStrengthOptions.containsLowercaseLetter) {
        status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
      }
      if (this.customStrengthOptions.containsUppercaseLetter) {
        status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
      }
      if (this.customStrengthOptions.containsNumericCharacter) {
        status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
      }
      if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
        status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
      }
    }
  };
  var AuthImpl = class {
    constructor(app2, heartbeatServiceProvider, appCheckServiceProvider, config) {
      this.app = app2;
      this.heartbeatServiceProvider = heartbeatServiceProvider;
      this.appCheckServiceProvider = appCheckServiceProvider;
      this.config = config;
      this.currentUser = null;
      this.emulatorConfig = null;
      this.operations = Promise.resolve();
      this.authStateSubscription = new Subscription(this);
      this.idTokenSubscription = new Subscription(this);
      this.beforeStateQueue = new AuthMiddlewareQueue(this);
      this.redirectUser = null;
      this.isProactiveRefreshEnabled = false;
      this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
      this._canInitEmulator = true;
      this._isInitialized = false;
      this._deleted = false;
      this._initializationPromise = null;
      this._popupRedirectResolver = null;
      this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
      this._agentRecaptchaConfig = null;
      this._tenantRecaptchaConfigs = {};
      this._projectPasswordPolicy = null;
      this._tenantPasswordPolicies = {};
      this._resolvePersistenceManagerAvailable = void 0;
      this.lastNotifiedUid = void 0;
      this.languageCode = null;
      this.tenantId = null;
      this.settings = { appVerificationDisabledForTesting: false };
      this.frameworks = [];
      this.name = app2.name;
      this.clientVersion = config.sdkClientVersion;
      this._persistenceManagerAvailable = new Promise((resolve) => this._resolvePersistenceManagerAvailable = resolve);
    }
    _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
      if (popupRedirectResolver) {
        this._popupRedirectResolver = _getInstance(popupRedirectResolver);
      }
      this._initializationPromise = this.queue(async () => {
        var _a, _b, _c;
        if (this._deleted) {
          return;
        }
        this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
        (_a = this._resolvePersistenceManagerAvailable) === null || _a === void 0 ? void 0 : _a.call(this);
        if (this._deleted) {
          return;
        }
        if ((_b = this._popupRedirectResolver) === null || _b === void 0 ? void 0 : _b._shouldInitProactively) {
          try {
            await this._popupRedirectResolver._initialize(this);
          } catch (e) {
          }
        }
        await this.initializeCurrentUser(popupRedirectResolver);
        this.lastNotifiedUid = ((_c = this.currentUser) === null || _c === void 0 ? void 0 : _c.uid) || null;
        if (this._deleted) {
          return;
        }
        this._isInitialized = true;
      });
      return this._initializationPromise;
    }
    /**
     * If the persistence is changed in another window, the user manager will let us know
     */
    async _onStorageEvent() {
      if (this._deleted) {
        return;
      }
      const user = await this.assertedPersistence.getCurrentUser();
      if (!this.currentUser && !user) {
        return;
      }
      if (this.currentUser && user && this.currentUser.uid === user.uid) {
        this._currentUser._assign(user);
        await this.currentUser.getIdToken();
        return;
      }
      await this._updateCurrentUser(
        user,
        /* skipBeforeStateCallbacks */
        true
      );
    }
    async initializeCurrentUserFromIdToken(idToken) {
      try {
        const response = await getAccountInfo(this, { idToken });
        const user = await UserImpl._fromGetAccountInfoResponse(this, response, idToken);
        await this.directlySetCurrentUser(user);
      } catch (err) {
        console.warn("FirebaseServerApp could not login user with provided authIdToken: ", err);
        await this.directlySetCurrentUser(null);
      }
    }
    async initializeCurrentUser(popupRedirectResolver) {
      var _a;
      if (_isFirebaseServerApp(this.app)) {
        const idToken = this.app.settings.authIdToken;
        if (idToken) {
          return new Promise((resolve) => {
            setTimeout(() => this.initializeCurrentUserFromIdToken(idToken).then(resolve, resolve));
          });
        } else {
          return this.directlySetCurrentUser(null);
        }
      }
      const previouslyStoredUser = await this.assertedPersistence.getCurrentUser();
      let futureCurrentUser = previouslyStoredUser;
      let needsTocheckMiddleware = false;
      if (popupRedirectResolver && this.config.authDomain) {
        await this.getOrInitRedirectPersistenceManager();
        const redirectUserEventId = (_a = this.redirectUser) === null || _a === void 0 ? void 0 : _a._redirectEventId;
        const storedUserEventId = futureCurrentUser === null || futureCurrentUser === void 0 ? void 0 : futureCurrentUser._redirectEventId;
        const result = await this.tryRedirectSignIn(popupRedirectResolver);
        if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && (result === null || result === void 0 ? void 0 : result.user)) {
          futureCurrentUser = result.user;
          needsTocheckMiddleware = true;
        }
      }
      if (!futureCurrentUser) {
        return this.directlySetCurrentUser(null);
      }
      if (!futureCurrentUser._redirectEventId) {
        if (needsTocheckMiddleware) {
          try {
            await this.beforeStateQueue.runMiddleware(futureCurrentUser);
          } catch (e) {
            futureCurrentUser = previouslyStoredUser;
            this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
          }
        }
        if (futureCurrentUser) {
          return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
        } else {
          return this.directlySetCurrentUser(null);
        }
      }
      _assert(
        this._popupRedirectResolver,
        this,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      await this.getOrInitRedirectPersistenceManager();
      if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
        return this.directlySetCurrentUser(futureCurrentUser);
      }
      return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
    }
    async tryRedirectSignIn(redirectResolver) {
      let result = null;
      try {
        result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
      } catch (e) {
        await this._setRedirectUser(null);
      }
      return result;
    }
    async reloadAndSetCurrentUserOrClear(user) {
      try {
        await _reloadWithoutSaving(user);
      } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) !== `auth/${"network-request-failed"}`) {
          return this.directlySetCurrentUser(null);
        }
      }
      return this.directlySetCurrentUser(user);
    }
    useDeviceLanguage() {
      this.languageCode = _getUserLanguage();
    }
    async _delete() {
      this._deleted = true;
    }
    async updateCurrentUser(userExtern) {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      const user = userExtern ? getModularInstance(userExtern) : null;
      if (user) {
        _assert(
          user.auth.config.apiKey === this.config.apiKey,
          this,
          "invalid-user-token"
          /* AuthErrorCode.INVALID_AUTH */
        );
      }
      return this._updateCurrentUser(user && user._clone(this));
    }
    async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
      if (this._deleted) {
        return;
      }
      if (user) {
        _assert(
          this.tenantId === user.tenantId,
          this,
          "tenant-id-mismatch"
          /* AuthErrorCode.TENANT_ID_MISMATCH */
        );
      }
      if (!skipBeforeStateCallbacks) {
        await this.beforeStateQueue.runMiddleware(user);
      }
      return this.queue(async () => {
        await this.directlySetCurrentUser(user);
        this.notifyAuthListeners();
      });
    }
    async signOut() {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      await this.beforeStateQueue.runMiddleware(null);
      if (this.redirectPersistenceManager || this._popupRedirectResolver) {
        await this._setRedirectUser(null);
      }
      return this._updateCurrentUser(
        null,
        /* skipBeforeStateCallbacks */
        true
      );
    }
    setPersistence(persistence) {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      return this.queue(async () => {
        await this.assertedPersistence.setPersistence(_getInstance(persistence));
      });
    }
    _getRecaptchaConfig() {
      if (this.tenantId == null) {
        return this._agentRecaptchaConfig;
      } else {
        return this._tenantRecaptchaConfigs[this.tenantId];
      }
    }
    async validatePassword(password) {
      if (!this._getPasswordPolicyInternal()) {
        await this._updatePasswordPolicy();
      }
      const passwordPolicy = this._getPasswordPolicyInternal();
      if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
        return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
      }
      return passwordPolicy.validatePassword(password);
    }
    _getPasswordPolicyInternal() {
      if (this.tenantId === null) {
        return this._projectPasswordPolicy;
      } else {
        return this._tenantPasswordPolicies[this.tenantId];
      }
    }
    async _updatePasswordPolicy() {
      const response = await _getPasswordPolicy(this);
      const passwordPolicy = new PasswordPolicyImpl(response);
      if (this.tenantId === null) {
        this._projectPasswordPolicy = passwordPolicy;
      } else {
        this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
      }
    }
    _getPersistenceType() {
      return this.assertedPersistence.persistence.type;
    }
    _getPersistence() {
      return this.assertedPersistence.persistence;
    }
    _updateErrorMap(errorMap) {
      this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
    }
    onAuthStateChanged(nextOrObserver, error, completed) {
      return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
    }
    beforeAuthStateChanged(callback, onAbort) {
      return this.beforeStateQueue.pushCallback(callback, onAbort);
    }
    onIdTokenChanged(nextOrObserver, error, completed) {
      return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
    }
    authStateReady() {
      return new Promise((resolve, reject) => {
        if (this.currentUser) {
          resolve();
        } else {
          const unsubscribe = this.onAuthStateChanged(() => {
            unsubscribe();
            resolve();
          }, reject);
        }
      });
    }
    /**
     * Revokes the given access token. Currently only supports Apple OAuth access tokens.
     */
    async revokeAccessToken(token) {
      if (this.currentUser) {
        const idToken = await this.currentUser.getIdToken();
        const request = {
          providerId: "apple.com",
          tokenType: "ACCESS_TOKEN",
          token,
          idToken
        };
        if (this.tenantId != null) {
          request.tenantId = this.tenantId;
        }
        await revokeToken(this, request);
      }
    }
    toJSON() {
      var _a;
      return {
        apiKey: this.config.apiKey,
        authDomain: this.config.authDomain,
        appName: this.name,
        currentUser: (_a = this._currentUser) === null || _a === void 0 ? void 0 : _a.toJSON()
      };
    }
    async _setRedirectUser(user, popupRedirectResolver) {
      const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
      return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
    }
    async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
      if (!this.redirectPersistenceManager) {
        const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
        _assert(
          resolver,
          this,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        this.redirectPersistenceManager = await PersistenceUserManager.create(
          this,
          [_getInstance(resolver._redirectPersistence)],
          "redirectUser"
          /* KeyName.REDIRECT_USER */
        );
        this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
      }
      return this.redirectPersistenceManager;
    }
    async _redirectUserForId(id) {
      var _a, _b;
      if (this._isInitialized) {
        await this.queue(async () => {
        });
      }
      if (((_a = this._currentUser) === null || _a === void 0 ? void 0 : _a._redirectEventId) === id) {
        return this._currentUser;
      }
      if (((_b = this.redirectUser) === null || _b === void 0 ? void 0 : _b._redirectEventId) === id) {
        return this.redirectUser;
      }
      return null;
    }
    async _persistUserIfCurrent(user) {
      if (user === this.currentUser) {
        return this.queue(async () => this.directlySetCurrentUser(user));
      }
    }
    /** Notifies listeners only if the user is current */
    _notifyListenersIfCurrent(user) {
      if (user === this.currentUser) {
        this.notifyAuthListeners();
      }
    }
    _key() {
      return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
    }
    _startProactiveRefresh() {
      this.isProactiveRefreshEnabled = true;
      if (this.currentUser) {
        this._currentUser._startProactiveRefresh();
      }
    }
    _stopProactiveRefresh() {
      this.isProactiveRefreshEnabled = false;
      if (this.currentUser) {
        this._currentUser._stopProactiveRefresh();
      }
    }
    /** Returns the current user cast as the internal type */
    get _currentUser() {
      return this.currentUser;
    }
    notifyAuthListeners() {
      var _a, _b;
      if (!this._isInitialized) {
        return;
      }
      this.idTokenSubscription.next(this.currentUser);
      const currentUid = (_b = (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : null;
      if (this.lastNotifiedUid !== currentUid) {
        this.lastNotifiedUid = currentUid;
        this.authStateSubscription.next(this.currentUser);
      }
    }
    registerStateListener(subscription, nextOrObserver, error, completed) {
      if (this._deleted) {
        return () => {
        };
      }
      const cb = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
      let isUnsubscribed = false;
      const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
      _assert(
        promise,
        this,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      promise.then(() => {
        if (isUnsubscribed) {
          return;
        }
        cb(this.currentUser);
      });
      if (typeof nextOrObserver === "function") {
        const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
        return () => {
          isUnsubscribed = true;
          unsubscribe();
        };
      } else {
        const unsubscribe = subscription.addObserver(nextOrObserver);
        return () => {
          isUnsubscribed = true;
          unsubscribe();
        };
      }
    }
    /**
     * Unprotected (from race conditions) method to set the current user. This
     * should only be called from within a queued callback. This is necessary
     * because the queue shouldn't rely on another queued callback.
     */
    async directlySetCurrentUser(user) {
      if (this.currentUser && this.currentUser !== user) {
        this._currentUser._stopProactiveRefresh();
      }
      if (user && this.isProactiveRefreshEnabled) {
        user._startProactiveRefresh();
      }
      this.currentUser = user;
      if (user) {
        await this.assertedPersistence.setCurrentUser(user);
      } else {
        await this.assertedPersistence.removeCurrentUser();
      }
    }
    queue(action) {
      this.operations = this.operations.then(action, action);
      return this.operations;
    }
    get assertedPersistence() {
      _assert(
        this.persistenceManager,
        this,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return this.persistenceManager;
    }
    _logFramework(framework) {
      if (!framework || this.frameworks.includes(framework)) {
        return;
      }
      this.frameworks.push(framework);
      this.frameworks.sort();
      this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
    }
    _getFrameworks() {
      return this.frameworks;
    }
    async _getAdditionalHeaders() {
      var _a;
      const headers = {
        [
          "X-Client-Version"
          /* HttpHeader.X_CLIENT_VERSION */
        ]: this.clientVersion
      };
      if (this.app.options.appId) {
        headers[
          "X-Firebase-gmpid"
          /* HttpHeader.X_FIREBASE_GMPID */
        ] = this.app.options.appId;
      }
      const heartbeatsHeader = await ((_a = this.heartbeatServiceProvider.getImmediate({
        optional: true
      })) === null || _a === void 0 ? void 0 : _a.getHeartbeatsHeader());
      if (heartbeatsHeader) {
        headers[
          "X-Firebase-Client"
          /* HttpHeader.X_FIREBASE_CLIENT */
        ] = heartbeatsHeader;
      }
      const appCheckToken = await this._getAppCheckToken();
      if (appCheckToken) {
        headers[
          "X-Firebase-AppCheck"
          /* HttpHeader.X_FIREBASE_APP_CHECK */
        ] = appCheckToken;
      }
      return headers;
    }
    async _getAppCheckToken() {
      var _a;
      if (_isFirebaseServerApp(this.app) && this.app.settings.appCheckToken) {
        return this.app.settings.appCheckToken;
      }
      const appCheckTokenResult = await ((_a = this.appCheckServiceProvider.getImmediate({ optional: true })) === null || _a === void 0 ? void 0 : _a.getToken());
      if (appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.error) {
        _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
      }
      return appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.token;
    }
  };
  function _castAuth(auth2) {
    return getModularInstance(auth2);
  }
  var Subscription = class {
    constructor(auth2) {
      this.auth = auth2;
      this.observer = null;
      this.addObserver = createSubscribe((observer) => this.observer = observer);
    }
    get next() {
      _assert(
        this.observer,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return this.observer.next.bind(this.observer);
    }
  };
  var externalJSProvider = {
    async loadJS() {
      throw new Error("Unable to load external scripts");
    },
    recaptchaV2Script: "",
    recaptchaEnterpriseScript: "",
    gapiScript: ""
  };
  function _setExternalJSProvider(p) {
    externalJSProvider = p;
  }
  function _loadJS(url) {
    return externalJSProvider.loadJS(url);
  }
  function _recaptchaEnterpriseScriptUrl() {
    return externalJSProvider.recaptchaEnterpriseScript;
  }
  function _gapiScriptUrl() {
    return externalJSProvider.gapiScript;
  }
  function _generateCallbackName(prefix) {
    return `__${prefix}${Math.floor(Math.random() * 1e6)}`;
  }
  var MockGreCAPTCHATopLevel = class {
    constructor() {
      this.enterprise = new MockGreCAPTCHA();
    }
    ready(callback) {
      callback();
    }
    execute(_siteKey, _options) {
      return Promise.resolve("token");
    }
    render(_container, _parameters) {
      return "";
    }
  };
  var MockGreCAPTCHA = class {
    ready(callback) {
      callback();
    }
    execute(_siteKey, _options) {
      return Promise.resolve("token");
    }
    render(_container, _parameters) {
      return "";
    }
  };
  var RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
  var FAKE_TOKEN = "NO_RECAPTCHA";
  var RecaptchaEnterpriseVerifier = class {
    /**
     *
     * @param authExtern - The corresponding Firebase {@link Auth} instance.
     *
     */
    constructor(authExtern) {
      this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
      this.auth = _castAuth(authExtern);
    }
    /**
     * Executes the verification process.
     *
     * @returns A Promise for a token that can be used to assert the validity of a request.
     */
    async verify(action = "verify", forceRefresh = false) {
      async function retrieveSiteKey(auth2) {
        if (!forceRefresh) {
          if (auth2.tenantId == null && auth2._agentRecaptchaConfig != null) {
            return auth2._agentRecaptchaConfig.siteKey;
          }
          if (auth2.tenantId != null && auth2._tenantRecaptchaConfigs[auth2.tenantId] !== void 0) {
            return auth2._tenantRecaptchaConfigs[auth2.tenantId].siteKey;
          }
        }
        return new Promise(async (resolve, reject) => {
          getRecaptchaConfig(auth2, {
            clientType: "CLIENT_TYPE_WEB",
            version: "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }).then((response) => {
            if (response.recaptchaKey === void 0) {
              reject(new Error("recaptcha Enterprise site key undefined"));
            } else {
              const config = new RecaptchaConfig(response);
              if (auth2.tenantId == null) {
                auth2._agentRecaptchaConfig = config;
              } else {
                auth2._tenantRecaptchaConfigs[auth2.tenantId] = config;
              }
              return resolve(config.siteKey);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      }
      function retrieveRecaptchaToken(siteKey, resolve, reject) {
        const grecaptcha = window.grecaptcha;
        if (isEnterprise(grecaptcha)) {
          grecaptcha.enterprise.ready(() => {
            grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
              resolve(token);
            }).catch(() => {
              resolve(FAKE_TOKEN);
            });
          });
        } else {
          reject(Error("No reCAPTCHA enterprise script loaded."));
        }
      }
      if (this.auth.settings.appVerificationDisabledForTesting) {
        const mockRecaptcha = new MockGreCAPTCHATopLevel();
        return mockRecaptcha.execute("siteKey", { action: "verify" });
      }
      return new Promise((resolve, reject) => {
        retrieveSiteKey(this.auth).then((siteKey) => {
          if (!forceRefresh && isEnterprise(window.grecaptcha)) {
            retrieveRecaptchaToken(siteKey, resolve, reject);
          } else {
            if (typeof window === "undefined") {
              reject(new Error("RecaptchaVerifier is only supported in browser"));
              return;
            }
            let url = _recaptchaEnterpriseScriptUrl();
            if (url.length !== 0) {
              url += siteKey;
            }
            _loadJS(url).then(() => {
              retrieveRecaptchaToken(siteKey, resolve, reject);
            }).catch((error) => {
              reject(error);
            });
          }
        }).catch((error) => {
          reject(error);
        });
      });
    }
  };
  async function injectRecaptchaFields(auth2, request, action, isCaptchaResp = false, isFakeToken = false) {
    const verifier = new RecaptchaEnterpriseVerifier(auth2);
    let captchaResponse;
    if (isFakeToken) {
      captchaResponse = FAKE_TOKEN;
    } else {
      try {
        captchaResponse = await verifier.verify(action);
      } catch (error) {
        captchaResponse = await verifier.verify(action, true);
      }
    }
    const newRequest = Object.assign({}, request);
    if (action === "mfaSmsEnrollment" || action === "mfaSmsSignIn") {
      if ("phoneEnrollmentInfo" in newRequest) {
        const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
        const recaptchaToken = newRequest.phoneEnrollmentInfo.recaptchaToken;
        Object.assign(newRequest, {
          "phoneEnrollmentInfo": {
            phoneNumber,
            recaptchaToken,
            captchaResponse,
            "clientType": "CLIENT_TYPE_WEB",
            "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }
        });
      } else if ("phoneSignInInfo" in newRequest) {
        const recaptchaToken = newRequest.phoneSignInInfo.recaptchaToken;
        Object.assign(newRequest, {
          "phoneSignInInfo": {
            recaptchaToken,
            captchaResponse,
            "clientType": "CLIENT_TYPE_WEB",
            "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }
        });
      }
      return newRequest;
    }
    if (!isCaptchaResp) {
      Object.assign(newRequest, { captchaResponse });
    } else {
      Object.assign(newRequest, { "captchaResp": captchaResponse });
    }
    Object.assign(newRequest, {
      "clientType": "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    });
    Object.assign(newRequest, {
      "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
      /* RecaptchaVersion.ENTERPRISE */
    });
    return newRequest;
  }
  async function handleRecaptchaFlow(authInstance, request, actionName, actionMethod, recaptchaAuthProvider) {
    var _a, _b;
    if (recaptchaAuthProvider === "EMAIL_PASSWORD_PROVIDER") {
      if ((_a = authInstance._getRecaptchaConfig()) === null || _a === void 0 ? void 0 : _a.isProviderEnabled(
        "EMAIL_PASSWORD_PROVIDER"
        /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
      )) {
        const requestWithRecaptcha = await injectRecaptchaFields(
          authInstance,
          request,
          actionName,
          actionName === "getOobCode"
          /* RecaptchaActionName.GET_OOB_CODE */
        );
        return actionMethod(authInstance, requestWithRecaptcha);
      } else {
        return actionMethod(authInstance, request).catch(async (error) => {
          if (error.code === `auth/${"missing-recaptcha-token"}`) {
            console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
            const requestWithRecaptcha = await injectRecaptchaFields(
              authInstance,
              request,
              actionName,
              actionName === "getOobCode"
              /* RecaptchaActionName.GET_OOB_CODE */
            );
            return actionMethod(authInstance, requestWithRecaptcha);
          } else {
            return Promise.reject(error);
          }
        });
      }
    } else if (recaptchaAuthProvider === "PHONE_PROVIDER") {
      if ((_b = authInstance._getRecaptchaConfig()) === null || _b === void 0 ? void 0 : _b.isProviderEnabled(
        "PHONE_PROVIDER"
        /* RecaptchaAuthProvider.PHONE_PROVIDER */
      )) {
        const requestWithRecaptcha = await injectRecaptchaFields(authInstance, request, actionName);
        return actionMethod(authInstance, requestWithRecaptcha).catch(async (error) => {
          var _a2;
          if (((_a2 = authInstance._getRecaptchaConfig()) === null || _a2 === void 0 ? void 0 : _a2.getProviderEnforcementState(
            "PHONE_PROVIDER"
            /* RecaptchaAuthProvider.PHONE_PROVIDER */
          )) === "AUDIT") {
            if (error.code === `auth/${"missing-recaptcha-token"}` || error.code === `auth/${"invalid-app-credential"}`) {
              console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${actionName} flow.`);
              const requestWithRecaptchaFields = await injectRecaptchaFields(
                authInstance,
                request,
                actionName,
                false,
                // isCaptchaResp
                true
                // isFakeToken
              );
              return actionMethod(authInstance, requestWithRecaptchaFields);
            }
          }
          return Promise.reject(error);
        });
      } else {
        const requestWithRecaptchaFields = await injectRecaptchaFields(
          authInstance,
          request,
          actionName,
          false,
          // isCaptchaResp
          true
          // isFakeToken
        );
        return actionMethod(authInstance, requestWithRecaptchaFields);
      }
    } else {
      return Promise.reject(recaptchaAuthProvider + " provider is not supported.");
    }
  }
  async function _initializeRecaptchaConfig(auth2) {
    const authInternal = _castAuth(auth2);
    const response = await getRecaptchaConfig(authInternal, {
      clientType: "CLIENT_TYPE_WEB",
      version: "RECAPTCHA_ENTERPRISE"
      /* RecaptchaVersion.ENTERPRISE */
    });
    const config = new RecaptchaConfig(response);
    if (authInternal.tenantId == null) {
      authInternal._agentRecaptchaConfig = config;
    } else {
      authInternal._tenantRecaptchaConfigs[authInternal.tenantId] = config;
    }
    if (config.isAnyProviderEnabled()) {
      const verifier = new RecaptchaEnterpriseVerifier(authInternal);
      void verifier.verify();
    }
  }
  function initializeAuth(app2, deps) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
      const auth3 = provider.getImmediate();
      const initialOptions = provider.getOptions();
      if (deepEqual(initialOptions, deps !== null && deps !== void 0 ? deps : {})) {
        return auth3;
      } else {
        _fail(
          auth3,
          "already-initialized"
          /* AuthErrorCode.ALREADY_INITIALIZED */
        );
      }
    }
    const auth2 = provider.initialize({ options: deps });
    return auth2;
  }
  function _initializeAuthInstance(auth2, deps) {
    const persistence = (deps === null || deps === void 0 ? void 0 : deps.persistence) || [];
    const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
    if (deps === null || deps === void 0 ? void 0 : deps.errorMap) {
      auth2._updateErrorMap(deps.errorMap);
    }
    auth2._initializeWithPersistence(hierarchy, deps === null || deps === void 0 ? void 0 : deps.popupRedirectResolver);
  }
  function connectAuthEmulator(auth2, url, options) {
    const authInternal = _castAuth(auth2);
    _assert(
      /^https?:\/\//.test(url),
      authInternal,
      "invalid-emulator-scheme"
      /* AuthErrorCode.INVALID_EMULATOR_SCHEME */
    );
    const disableWarnings = !!(options === null || options === void 0 ? void 0 : options.disableWarnings);
    const protocol = extractProtocol(url);
    const { host, port } = extractHostAndPort(url);
    const portStr = port === null ? "" : `:${port}`;
    const emulator = { url: `${protocol}//${host}${portStr}/` };
    const emulatorConfig = Object.freeze({
      host,
      port,
      protocol: protocol.replace(":", ""),
      options: Object.freeze({ disableWarnings })
    });
    if (!authInternal._canInitEmulator) {
      _assert(
        authInternal.config.emulator && authInternal.emulatorConfig,
        authInternal,
        "emulator-config-failed"
        /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
      );
      _assert(
        deepEqual(emulator, authInternal.config.emulator) && deepEqual(emulatorConfig, authInternal.emulatorConfig),
        authInternal,
        "emulator-config-failed"
        /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
      );
      return;
    }
    authInternal.config.emulator = emulator;
    authInternal.emulatorConfig = emulatorConfig;
    authInternal.settings.appVerificationDisabledForTesting = true;
    if (isCloudWorkstation(host)) {
      void pingServer(`${protocol}//${host}${portStr}`);
      updateEmulatorBanner("Auth", true);
    } else if (!disableWarnings) {
      emitEmulatorWarning();
    }
  }
  function extractProtocol(url) {
    const protocolEnd = url.indexOf(":");
    return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
  }
  function extractHostAndPort(url) {
    const protocol = extractProtocol(url);
    const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
    if (!authority) {
      return { host: "", port: null };
    }
    const hostAndPort = authority[2].split("@").pop() || "";
    const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
    if (bracketedIPv6) {
      const host = bracketedIPv6[1];
      return { host, port: parsePort(hostAndPort.substr(host.length + 1)) };
    } else {
      const [host, port] = hostAndPort.split(":");
      return { host, port: parsePort(port) };
    }
  }
  function parsePort(portStr) {
    if (!portStr) {
      return null;
    }
    const port = Number(portStr);
    if (isNaN(port)) {
      return null;
    }
    return port;
  }
  function emitEmulatorWarning() {
    function attachBanner() {
      const el = document.createElement("p");
      const sty = el.style;
      el.innerText = "Running in emulator mode. Do not use with production credentials.";
      sty.position = "fixed";
      sty.width = "100%";
      sty.backgroundColor = "#ffffff";
      sty.border = ".1em solid #000000";
      sty.color = "#b50000";
      sty.bottom = "0px";
      sty.left = "0px";
      sty.margin = "0px";
      sty.zIndex = "10000";
      sty.textAlign = "center";
      el.classList.add("firebase-emulator-warning");
      document.body.appendChild(el);
    }
    if (typeof console !== "undefined" && typeof console.info === "function") {
      console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
    }
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", attachBanner);
      } else {
        attachBanner();
      }
    }
  }
  var AuthCredential = class {
    /** @internal */
    constructor(providerId, signInMethod) {
      this.providerId = providerId;
      this.signInMethod = signInMethod;
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns a JSON-serializable representation of this object.
     */
    toJSON() {
      return debugFail("not implemented");
    }
    /** @internal */
    _getIdTokenResponse(_auth) {
      return debugFail("not implemented");
    }
    /** @internal */
    _linkToIdToken(_auth, _idToken) {
      return debugFail("not implemented");
    }
    /** @internal */
    _getReauthenticationResolver(_auth) {
      return debugFail("not implemented");
    }
  };
  async function linkEmailPassword(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:signUp", request);
  }
  async function signInWithPassword(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth2, request));
  }
  async function signInWithEmailLink$1(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
  }
  async function signInWithEmailLinkForLinking(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
  }
  var EmailAuthCredential = class _EmailAuthCredential extends AuthCredential {
    /** @internal */
    constructor(_email, _password, signInMethod, _tenantId = null) {
      super("password", signInMethod);
      this._email = _email;
      this._password = _password;
      this._tenantId = _tenantId;
    }
    /** @internal */
    static _fromEmailAndPassword(email, password) {
      return new _EmailAuthCredential(
        email,
        password,
        "password"
        /* SignInMethod.EMAIL_PASSWORD */
      );
    }
    /** @internal */
    static _fromEmailAndCode(email, oobCode, tenantId = null) {
      return new _EmailAuthCredential(email, oobCode, "emailLink", tenantId);
    }
    /** {@inheritdoc AuthCredential.toJSON} */
    toJSON() {
      return {
        email: this._email,
        password: this._password,
        signInMethod: this.signInMethod,
        tenantId: this._tenantId
      };
    }
    /**
     * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
     *
     * @param json - Either `object` or the stringified representation of the object. When string is
     * provided, `JSON.parse` would be called first.
     *
     * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
     */
    static fromJSON(json) {
      const obj = typeof json === "string" ? JSON.parse(json) : json;
      if ((obj === null || obj === void 0 ? void 0 : obj.email) && (obj === null || obj === void 0 ? void 0 : obj.password)) {
        if (obj.signInMethod === "password") {
          return this._fromEmailAndPassword(obj.email, obj.password);
        } else if (obj.signInMethod === "emailLink") {
          return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
        }
      }
      return null;
    }
    /** @internal */
    async _getIdTokenResponse(auth2) {
      switch (this.signInMethod) {
        case "password":
          const request = {
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(
            auth2,
            request,
            "signInWithPassword",
            signInWithPassword,
            "EMAIL_PASSWORD_PROVIDER"
            /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
          );
        case "emailLink":
          return signInWithEmailLink$1(auth2, {
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }
    /** @internal */
    async _linkToIdToken(auth2, idToken) {
      switch (this.signInMethod) {
        case "password":
          const request = {
            idToken,
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(
            auth2,
            request,
            "signUpPassword",
            linkEmailPassword,
            "EMAIL_PASSWORD_PROVIDER"
            /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
          );
        case "emailLink":
          return signInWithEmailLinkForLinking(auth2, {
            idToken,
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }
    /** @internal */
    _getReauthenticationResolver(auth2) {
      return this._getIdTokenResponse(auth2);
    }
  };
  async function signInWithIdp(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth2, request));
  }
  var IDP_REQUEST_URI$1 = "http://localhost";
  var OAuthCredential = class _OAuthCredential extends AuthCredential {
    constructor() {
      super(...arguments);
      this.pendingToken = null;
    }
    /** @internal */
    static _fromParams(params) {
      const cred = new _OAuthCredential(params.providerId, params.signInMethod);
      if (params.idToken || params.accessToken) {
        if (params.idToken) {
          cred.idToken = params.idToken;
        }
        if (params.accessToken) {
          cred.accessToken = params.accessToken;
        }
        if (params.nonce && !params.pendingToken) {
          cred.nonce = params.nonce;
        }
        if (params.pendingToken) {
          cred.pendingToken = params.pendingToken;
        }
      } else if (params.oauthToken && params.oauthTokenSecret) {
        cred.accessToken = params.oauthToken;
        cred.secret = params.oauthTokenSecret;
      } else {
        _fail(
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
      }
      return cred;
    }
    /** {@inheritdoc AuthCredential.toJSON}  */
    toJSON() {
      return {
        idToken: this.idToken,
        accessToken: this.accessToken,
        secret: this.secret,
        nonce: this.nonce,
        pendingToken: this.pendingToken,
        providerId: this.providerId,
        signInMethod: this.signInMethod
      };
    }
    /**
     * Static method to deserialize a JSON representation of an object into an
     * {@link  AuthCredential}.
     *
     * @param json - Input can be either Object or the stringified representation of the object.
     * When string is provided, JSON.parse would be called first.
     *
     * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
     */
    static fromJSON(json) {
      const obj = typeof json === "string" ? JSON.parse(json) : json;
      const { providerId, signInMethod } = obj, rest = __rest(obj, ["providerId", "signInMethod"]);
      if (!providerId || !signInMethod) {
        return null;
      }
      const cred = new _OAuthCredential(providerId, signInMethod);
      cred.idToken = rest.idToken || void 0;
      cred.accessToken = rest.accessToken || void 0;
      cred.secret = rest.secret;
      cred.nonce = rest.nonce;
      cred.pendingToken = rest.pendingToken || null;
      return cred;
    }
    /** @internal */
    _getIdTokenResponse(auth2) {
      const request = this.buildRequest();
      return signInWithIdp(auth2, request);
    }
    /** @internal */
    _linkToIdToken(auth2, idToken) {
      const request = this.buildRequest();
      request.idToken = idToken;
      return signInWithIdp(auth2, request);
    }
    /** @internal */
    _getReauthenticationResolver(auth2) {
      const request = this.buildRequest();
      request.autoCreate = false;
      return signInWithIdp(auth2, request);
    }
    buildRequest() {
      const request = {
        requestUri: IDP_REQUEST_URI$1,
        returnSecureToken: true
      };
      if (this.pendingToken) {
        request.pendingToken = this.pendingToken;
      } else {
        const postBody = {};
        if (this.idToken) {
          postBody["id_token"] = this.idToken;
        }
        if (this.accessToken) {
          postBody["access_token"] = this.accessToken;
        }
        if (this.secret) {
          postBody["oauth_token_secret"] = this.secret;
        }
        postBody["providerId"] = this.providerId;
        if (this.nonce && !this.pendingToken) {
          postBody["nonce"] = this.nonce;
        }
        request.postBody = querystring(postBody);
      }
      return request;
    }
  };
  async function sendPhoneVerificationCode(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:sendVerificationCode", _addTidIfNecessary(auth2, request));
  }
  async function signInWithPhoneNumber$1(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth2, request));
  }
  async function linkWithPhoneNumber$1(auth2, request) {
    const response = await _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth2, request));
    if (response.temporaryProof) {
      throw _makeTaggedError(auth2, "account-exists-with-different-credential", response);
    }
    return response;
  }
  var VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = {
    [
      "USER_NOT_FOUND"
      /* ServerError.USER_NOT_FOUND */
    ]: "user-not-found"
    /* AuthErrorCode.USER_DELETED */
  };
  async function verifyPhoneNumberForExisting(auth2, request) {
    const apiRequest = Object.assign(Object.assign({}, request), { operation: "REAUTH" });
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth2, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_);
  }
  var PhoneAuthCredential = class _PhoneAuthCredential extends AuthCredential {
    constructor(params) {
      super(
        "phone",
        "phone"
        /* SignInMethod.PHONE */
      );
      this.params = params;
    }
    /** @internal */
    static _fromVerification(verificationId, verificationCode) {
      return new _PhoneAuthCredential({ verificationId, verificationCode });
    }
    /** @internal */
    static _fromTokenResponse(phoneNumber, temporaryProof) {
      return new _PhoneAuthCredential({ phoneNumber, temporaryProof });
    }
    /** @internal */
    _getIdTokenResponse(auth2) {
      return signInWithPhoneNumber$1(auth2, this._makeVerificationRequest());
    }
    /** @internal */
    _linkToIdToken(auth2, idToken) {
      return linkWithPhoneNumber$1(auth2, Object.assign({ idToken }, this._makeVerificationRequest()));
    }
    /** @internal */
    _getReauthenticationResolver(auth2) {
      return verifyPhoneNumberForExisting(auth2, this._makeVerificationRequest());
    }
    /** @internal */
    _makeVerificationRequest() {
      const { temporaryProof, phoneNumber, verificationId, verificationCode } = this.params;
      if (temporaryProof && phoneNumber) {
        return { temporaryProof, phoneNumber };
      }
      return {
        sessionInfo: verificationId,
        code: verificationCode
      };
    }
    /** {@inheritdoc AuthCredential.toJSON} */
    toJSON() {
      const obj = {
        providerId: this.providerId
      };
      if (this.params.phoneNumber) {
        obj.phoneNumber = this.params.phoneNumber;
      }
      if (this.params.temporaryProof) {
        obj.temporaryProof = this.params.temporaryProof;
      }
      if (this.params.verificationCode) {
        obj.verificationCode = this.params.verificationCode;
      }
      if (this.params.verificationId) {
        obj.verificationId = this.params.verificationId;
      }
      return obj;
    }
    /** Generates a phone credential based on a plain object or a JSON string. */
    static fromJSON(json) {
      if (typeof json === "string") {
        json = JSON.parse(json);
      }
      const { verificationId, verificationCode, phoneNumber, temporaryProof } = json;
      if (!verificationCode && !verificationId && !phoneNumber && !temporaryProof) {
        return null;
      }
      return new _PhoneAuthCredential({
        verificationId,
        verificationCode,
        phoneNumber,
        temporaryProof
      });
    }
  };
  function parseMode(mode) {
    switch (mode) {
      case "recoverEmail":
        return "RECOVER_EMAIL";
      case "resetPassword":
        return "PASSWORD_RESET";
      case "signIn":
        return "EMAIL_SIGNIN";
      case "verifyEmail":
        return "VERIFY_EMAIL";
      case "verifyAndChangeEmail":
        return "VERIFY_AND_CHANGE_EMAIL";
      case "revertSecondFactorAddition":
        return "REVERT_SECOND_FACTOR_ADDITION";
      default:
        return null;
    }
  }
  function parseDeepLink(url) {
    const link = querystringDecode(extractQuerystring(url))["link"];
    const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
    const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
    const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
  }
  var ActionCodeURL = class _ActionCodeURL {
    /**
     * @param actionLink - The link from which to extract the URL.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @internal
     */
    constructor(actionLink) {
      var _a, _b, _c, _d, _e, _f;
      const searchParams = querystringDecode(extractQuerystring(actionLink));
      const apiKey = (_a = searchParams[
        "apiKey"
        /* QueryField.API_KEY */
      ]) !== null && _a !== void 0 ? _a : null;
      const code = (_b = searchParams[
        "oobCode"
        /* QueryField.CODE */
      ]) !== null && _b !== void 0 ? _b : null;
      const operation = parseMode((_c = searchParams[
        "mode"
        /* QueryField.MODE */
      ]) !== null && _c !== void 0 ? _c : null);
      _assert(
        apiKey && code && operation,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      this.apiKey = apiKey;
      this.operation = operation;
      this.code = code;
      this.continueUrl = (_d = searchParams[
        "continueUrl"
        /* QueryField.CONTINUE_URL */
      ]) !== null && _d !== void 0 ? _d : null;
      this.languageCode = (_e = searchParams[
        "lang"
        /* QueryField.LANGUAGE_CODE */
      ]) !== null && _e !== void 0 ? _e : null;
      this.tenantId = (_f = searchParams[
        "tenantId"
        /* QueryField.TENANT_ID */
      ]) !== null && _f !== void 0 ? _f : null;
    }
    /**
     * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
     * otherwise returns null.
     *
     * @param link  - The email action link string.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @public
     */
    static parseLink(link) {
      const actionLink = parseDeepLink(link);
      try {
        return new _ActionCodeURL(actionLink);
      } catch (_a) {
        return null;
      }
    }
  };
  var EmailAuthProvider = class _EmailAuthProvider {
    constructor() {
      this.providerId = _EmailAuthProvider.PROVIDER_ID;
    }
    /**
     * Initialize an {@link AuthCredential} using an email and password.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credential(email, password);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * const userCredential = await signInWithEmailAndPassword(auth, email, password);
     * ```
     *
     * @param email - Email address.
     * @param password - User account password.
     * @returns The auth provider credential.
     */
    static credential(email, password) {
      return EmailAuthCredential._fromEmailAndPassword(email, password);
    }
    /**
     * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
     * email link operation.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * await sendSignInLinkToEmail(auth, email);
     * // Obtain emailLink from user.
     * const userCredential = await signInWithEmailLink(auth, email, emailLink);
     * ```
     *
     * @param auth - The {@link Auth} instance used to verify the link.
     * @param email - Email address.
     * @param emailLink - Sign-in email link.
     * @returns - The auth provider credential.
     */
    static credentialWithLink(email, emailLink) {
      const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
      _assert(
        actionCodeUrl,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
    }
  };
  EmailAuthProvider.PROVIDER_ID = "password";
  EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
  EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
  var FederatedAuthProvider = class {
    /**
     * Constructor for generic OAuth providers.
     *
     * @param providerId - Provider for which credentials should be generated.
     */
    constructor(providerId) {
      this.providerId = providerId;
      this.defaultLanguageCode = null;
      this.customParameters = {};
    }
    /**
     * Set the language gode.
     *
     * @param languageCode - language code
     */
    setDefaultLanguage(languageCode) {
      this.defaultLanguageCode = languageCode;
    }
    /**
     * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
     * operations.
     *
     * @remarks
     * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
     * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
     *
     * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
     */
    setCustomParameters(customOAuthParameters) {
      this.customParameters = customOAuthParameters;
      return this;
    }
    /**
     * Retrieve the current list of {@link CustomParameters}.
     */
    getCustomParameters() {
      return this.customParameters;
    }
  };
  var BaseOAuthProvider = class extends FederatedAuthProvider {
    constructor() {
      super(...arguments);
      this.scopes = [];
    }
    /**
     * Add an OAuth scope to the credential.
     *
     * @param scope - Provider OAuth scope to add.
     */
    addScope(scope) {
      if (!this.scopes.includes(scope)) {
        this.scopes.push(scope);
      }
      return this;
    }
    /**
     * Retrieve the current list of OAuth scopes.
     */
    getScopes() {
      return [...this.scopes];
    }
  };
  var FacebookAuthProvider = class _FacebookAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "facebook.com"
        /* ProviderId.FACEBOOK */
      );
    }
    /**
     * Creates a credential for Facebook.
     *
     * @example
     * ```javascript
     * // `event` from the Facebook auth.authResponseChange callback.
     * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param accessToken - Facebook access token.
     */
    static credential(accessToken) {
      return OAuthCredential._fromParams({
        providerId: _FacebookAuthProvider.PROVIDER_ID,
        signInMethod: _FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
        accessToken
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return _FacebookAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return _FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
        return null;
      }
      if (!tokenResponse.oauthAccessToken) {
        return null;
      }
      try {
        return _FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
      } catch (_a) {
        return null;
      }
    }
  };
  FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
  FacebookAuthProvider.PROVIDER_ID = "facebook.com";
  var GoogleAuthProvider = class _GoogleAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "google.com"
        /* ProviderId.GOOGLE */
      );
      this.addScope("profile");
    }
    /**
     * Creates a credential for Google. At least one of ID token and access token is required.
     *
     * @example
     * ```javascript
     * // \`googleUser\` from the onsuccess Google Sign In callback.
     * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param idToken - Google ID token.
     * @param accessToken - Google access token.
     */
    static credential(idToken, accessToken) {
      return OAuthCredential._fromParams({
        providerId: _GoogleAuthProvider.PROVIDER_ID,
        signInMethod: _GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
        idToken,
        accessToken
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return _GoogleAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return _GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse) {
        return null;
      }
      const { oauthIdToken, oauthAccessToken } = tokenResponse;
      if (!oauthIdToken && !oauthAccessToken) {
        return null;
      }
      try {
        return _GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
      } catch (_a) {
        return null;
      }
    }
  };
  GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
  GoogleAuthProvider.PROVIDER_ID = "google.com";
  var GithubAuthProvider = class _GithubAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "github.com"
        /* ProviderId.GITHUB */
      );
    }
    /**
     * Creates a credential for GitHub.
     *
     * @param accessToken - GitHub access token.
     */
    static credential(accessToken) {
      return OAuthCredential._fromParams({
        providerId: _GithubAuthProvider.PROVIDER_ID,
        signInMethod: _GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
        accessToken
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return _GithubAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return _GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
        return null;
      }
      if (!tokenResponse.oauthAccessToken) {
        return null;
      }
      try {
        return _GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
      } catch (_a) {
        return null;
      }
    }
  };
  GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
  GithubAuthProvider.PROVIDER_ID = "github.com";
  var TwitterAuthProvider = class _TwitterAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "twitter.com"
        /* ProviderId.TWITTER */
      );
    }
    /**
     * Creates a credential for Twitter.
     *
     * @param token - Twitter access token.
     * @param secret - Twitter secret.
     */
    static credential(token, secret) {
      return OAuthCredential._fromParams({
        providerId: _TwitterAuthProvider.PROVIDER_ID,
        signInMethod: _TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
        oauthToken: token,
        oauthTokenSecret: secret
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return _TwitterAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return _TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse) {
        return null;
      }
      const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
      if (!oauthAccessToken || !oauthTokenSecret) {
        return null;
      }
      try {
        return _TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
      } catch (_a) {
        return null;
      }
    }
  };
  TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
  TwitterAuthProvider.PROVIDER_ID = "twitter.com";
  async function signUp(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signUp", _addTidIfNecessary(auth2, request));
  }
  var UserCredentialImpl = class _UserCredentialImpl {
    constructor(params) {
      this.user = params.user;
      this.providerId = params.providerId;
      this._tokenResponse = params._tokenResponse;
      this.operationType = params.operationType;
    }
    static async _fromIdTokenResponse(auth2, operationType, idTokenResponse, isAnonymous = false) {
      const user = await UserImpl._fromIdTokenResponse(auth2, idTokenResponse, isAnonymous);
      const providerId = providerIdForResponse(idTokenResponse);
      const userCred = new _UserCredentialImpl({
        user,
        providerId,
        _tokenResponse: idTokenResponse,
        operationType
      });
      return userCred;
    }
    static async _forOperation(user, operationType, response) {
      await user._updateTokensIfNecessary(
        response,
        /* reload */
        true
      );
      const providerId = providerIdForResponse(response);
      return new _UserCredentialImpl({
        user,
        providerId,
        _tokenResponse: response,
        operationType
      });
    }
  };
  function providerIdForResponse(response) {
    if (response.providerId) {
      return response.providerId;
    }
    if ("phoneNumber" in response) {
      return "phone";
    }
    return null;
  }
  var MultiFactorError = class _MultiFactorError extends FirebaseError {
    constructor(auth2, error, operationType, user) {
      var _a;
      super(error.code, error.message);
      this.operationType = operationType;
      this.user = user;
      Object.setPrototypeOf(this, _MultiFactorError.prototype);
      this.customData = {
        appName: auth2.name,
        tenantId: (_a = auth2.tenantId) !== null && _a !== void 0 ? _a : void 0,
        _serverResponse: error.customData._serverResponse,
        operationType
      };
    }
    static _fromErrorAndOperation(auth2, error, operationType, user) {
      return new _MultiFactorError(auth2, error, operationType, user);
    }
  };
  function _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential, user) {
    const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth2) : credential._getIdTokenResponse(auth2);
    return idTokenProvider.catch((error) => {
      if (error.code === `auth/${"multi-factor-auth-required"}`) {
        throw MultiFactorError._fromErrorAndOperation(auth2, error, operationType, user);
      }
      throw error;
    });
  }
  async function _link$1(user, credential, bypassAuthState = false) {
    const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
    return UserCredentialImpl._forOperation(user, "link", response);
  }
  async function _reauthenticate(user, credential, bypassAuthState = false) {
    const { auth: auth2 } = user;
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const operationType = "reauthenticate";
    try {
      const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential, user), bypassAuthState);
      _assert(
        response.idToken,
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const parsed = _parseToken(response.idToken);
      _assert(
        parsed,
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const { sub: localId } = parsed;
      _assert(
        user.uid === localId,
        auth2,
        "user-mismatch"
        /* AuthErrorCode.USER_MISMATCH */
      );
      return UserCredentialImpl._forOperation(user, operationType, response);
    } catch (e) {
      if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"user-not-found"}`) {
        _fail(
          auth2,
          "user-mismatch"
          /* AuthErrorCode.USER_MISMATCH */
        );
      }
      throw e;
    }
  }
  async function _signInWithCredential(auth2, credential, bypassAuthState = false) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const operationType = "signIn";
    const response = await _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential);
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth2, operationType, response);
    if (!bypassAuthState) {
      await auth2._updateCurrentUser(userCredential.user);
    }
    return userCredential;
  }
  async function signInWithCredential(auth2, credential) {
    return _signInWithCredential(_castAuth(auth2), credential);
  }
  async function recachePasswordPolicy(auth2) {
    const authInternal = _castAuth(auth2);
    if (authInternal._getPasswordPolicyInternal()) {
      await authInternal._updatePasswordPolicy();
    }
  }
  async function createUserWithEmailAndPassword(auth2, email, password) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const authInternal = _castAuth(auth2);
    const request = {
      returnSecureToken: true,
      email,
      password,
      clientType: "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    };
    const signUpResponse = handleRecaptchaFlow(
      authInternal,
      request,
      "signUpPassword",
      signUp,
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
    );
    const response = await signUpResponse.catch((error) => {
      if (error.code === `auth/${"password-does-not-meet-requirements"}`) {
        void recachePasswordPolicy(auth2);
      }
      throw error;
    });
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response);
    await authInternal._updateCurrentUser(userCredential.user);
    return userCredential;
  }
  function signInWithEmailAndPassword(auth2, email, password) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    return signInWithCredential(getModularInstance(auth2), EmailAuthProvider.credential(email, password)).catch(async (error) => {
      if (error.code === `auth/${"password-does-not-meet-requirements"}`) {
        void recachePasswordPolicy(auth2);
      }
      throw error;
    });
  }
  async function updateProfile$1(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:update", request);
  }
  async function updateProfile(user, { displayName, photoURL: photoUrl }) {
    if (displayName === void 0 && photoUrl === void 0) {
      return;
    }
    const userInternal = getModularInstance(user);
    const idToken = await userInternal.getIdToken();
    const profileRequest = {
      idToken,
      displayName,
      photoUrl,
      returnSecureToken: true
    };
    const response = await _logoutIfInvalidated(userInternal, updateProfile$1(userInternal.auth, profileRequest));
    userInternal.displayName = response.displayName || null;
    userInternal.photoURL = response.photoUrl || null;
    const passwordProvider = userInternal.providerData.find(
      ({ providerId }) => providerId === "password"
      /* ProviderId.PASSWORD */
    );
    if (passwordProvider) {
      passwordProvider.displayName = userInternal.displayName;
      passwordProvider.photoURL = userInternal.photoURL;
    }
    await userInternal._updateTokensIfNecessary(response);
  }
  function setPersistence(auth2, persistence) {
    return getModularInstance(auth2).setPersistence(persistence);
  }
  function onIdTokenChanged(auth2, nextOrObserver, error, completed) {
    return getModularInstance(auth2).onIdTokenChanged(nextOrObserver, error, completed);
  }
  function beforeAuthStateChanged(auth2, callback, onAbort) {
    return getModularInstance(auth2).beforeAuthStateChanged(callback, onAbort);
  }
  function onAuthStateChanged(auth2, nextOrObserver, error, completed) {
    return getModularInstance(auth2).onAuthStateChanged(nextOrObserver, error, completed);
  }
  function signOut(auth2) {
    return getModularInstance(auth2).signOut();
  }
  function startEnrollPhoneMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth2, request));
  }
  function finalizeEnrollPhoneMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth2, request));
  }
  function startEnrollTotpMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth2, request));
  }
  function finalizeEnrollTotpMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth2, request));
  }
  var STORAGE_AVAILABLE_KEY = "__sak";
  var BrowserPersistenceClass = class {
    constructor(storageRetriever, type) {
      this.storageRetriever = storageRetriever;
      this.type = type;
    }
    _isAvailable() {
      try {
        if (!this.storage) {
          return Promise.resolve(false);
        }
        this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
        this.storage.removeItem(STORAGE_AVAILABLE_KEY);
        return Promise.resolve(true);
      } catch (_a) {
        return Promise.resolve(false);
      }
    }
    _set(key, value) {
      this.storage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    }
    _get(key) {
      const json = this.storage.getItem(key);
      return Promise.resolve(json ? JSON.parse(json) : null);
    }
    _remove(key) {
      this.storage.removeItem(key);
      return Promise.resolve();
    }
    get storage() {
      return this.storageRetriever();
    }
  };
  var _POLLING_INTERVAL_MS$1 = 1e3;
  var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
  var BrowserLocalPersistence = class extends BrowserPersistenceClass {
    constructor() {
      super(
        () => window.localStorage,
        "LOCAL"
        /* PersistenceType.LOCAL */
      );
      this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
      this.listeners = {};
      this.localCache = {};
      this.pollTimer = null;
      this.fallbackToPolling = _isMobileBrowser();
      this._shouldAllowMigration = true;
    }
    forAllChangedKeys(cb) {
      for (const key of Object.keys(this.listeners)) {
        const newValue = this.storage.getItem(key);
        const oldValue = this.localCache[key];
        if (newValue !== oldValue) {
          cb(key, oldValue, newValue);
        }
      }
    }
    onStorageEvent(event, poll = false) {
      if (!event.key) {
        this.forAllChangedKeys((key2, _oldValue, newValue) => {
          this.notifyListeners(key2, newValue);
        });
        return;
      }
      const key = event.key;
      if (poll) {
        this.detachListener();
      } else {
        this.stopPolling();
      }
      const triggerListeners = () => {
        const storedValue2 = this.storage.getItem(key);
        if (!poll && this.localCache[key] === storedValue2) {
          return;
        }
        this.notifyListeners(key, storedValue2);
      };
      const storedValue = this.storage.getItem(key);
      if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
        setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
      } else {
        triggerListeners();
      }
    }
    notifyListeners(key, value) {
      this.localCache[key] = value;
      const listeners2 = this.listeners[key];
      if (listeners2) {
        for (const listener of Array.from(listeners2)) {
          listener(value ? JSON.parse(value) : value);
        }
      }
    }
    startPolling() {
      this.stopPolling();
      this.pollTimer = setInterval(() => {
        this.forAllChangedKeys((key, oldValue, newValue) => {
          this.onStorageEvent(
            new StorageEvent("storage", {
              key,
              oldValue,
              newValue
            }),
            /* poll */
            true
          );
        });
      }, _POLLING_INTERVAL_MS$1);
    }
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    }
    attachListener() {
      window.addEventListener("storage", this.boundEventHandler);
    }
    detachListener() {
      window.removeEventListener("storage", this.boundEventHandler);
    }
    _addListener(key, listener) {
      if (Object.keys(this.listeners).length === 0) {
        if (this.fallbackToPolling) {
          this.startPolling();
        } else {
          this.attachListener();
        }
      }
      if (!this.listeners[key]) {
        this.listeners[key] = /* @__PURE__ */ new Set();
        this.localCache[key] = this.storage.getItem(key);
      }
      this.listeners[key].add(listener);
    }
    _removeListener(key, listener) {
      if (this.listeners[key]) {
        this.listeners[key].delete(listener);
        if (this.listeners[key].size === 0) {
          delete this.listeners[key];
        }
      }
      if (Object.keys(this.listeners).length === 0) {
        this.detachListener();
        this.stopPolling();
      }
    }
    // Update local cache on base operations:
    async _set(key, value) {
      await super._set(key, value);
      this.localCache[key] = JSON.stringify(value);
    }
    async _get(key) {
      const value = await super._get(key);
      this.localCache[key] = JSON.stringify(value);
      return value;
    }
    async _remove(key) {
      await super._remove(key);
      delete this.localCache[key];
    }
  };
  BrowserLocalPersistence.type = "LOCAL";
  var browserLocalPersistence = BrowserLocalPersistence;
  var POLLING_INTERVAL_MS = 1e3;
  function getDocumentCookie(name4) {
    var _a, _b;
    const escapedName = name4.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    const matcher = RegExp(`${escapedName}=([^;]+)`);
    return (_b = (_a = document.cookie.match(matcher)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : null;
  }
  function getCookieName(key) {
    const isDevMode = window.location.protocol === "http:";
    return `${isDevMode ? "__dev_" : "__HOST-"}FIREBASE_${key.split(":")[3]}`;
  }
  var CookiePersistence = class {
    constructor() {
      this.type = "COOKIE";
      this.listenerUnsubscribes = /* @__PURE__ */ new Map();
    }
    // used to get the URL to the backend to proxy to
    _getFinalTarget(originalUrl) {
      if (typeof window === void 0) {
        return originalUrl;
      }
      const url = new URL(`${window.location.origin}/__cookies__`);
      url.searchParams.set("finalTarget", originalUrl);
      return url;
    }
    // To be a usable persistence method in a chain browserCookiePersistence ensures that
    // prerequisites have been met, namely that we're in a secureContext, navigator and document are
    // available and cookies are enabled. Not all UAs support these method, so fallback accordingly.
    async _isAvailable() {
      var _a;
      if (typeof isSecureContext === "boolean" && !isSecureContext) {
        return false;
      }
      if (typeof navigator === "undefined" || typeof document === "undefined") {
        return false;
      }
      return (_a = navigator.cookieEnabled) !== null && _a !== void 0 ? _a : true;
    }
    // Set should be a noop as we expect middleware to handle this
    async _set(_key, _value) {
      return;
    }
    // Attempt to get the cookie from cookieStore, fallback to document.cookie
    async _get(key) {
      if (!this._isAvailable()) {
        return null;
      }
      const name4 = getCookieName(key);
      if (window.cookieStore) {
        const cookie = await window.cookieStore.get(name4);
        return cookie === null || cookie === void 0 ? void 0 : cookie.value;
      }
      return getDocumentCookie(name4);
    }
    // Log out by overriding the idToken with a sentinel value of ""
    async _remove(key) {
      if (!this._isAvailable()) {
        return;
      }
      const existingValue = await this._get(key);
      if (!existingValue) {
        return;
      }
      const name4 = getCookieName(key);
      document.cookie = `${name4}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`;
      await fetch(`/__cookies__`, { method: "DELETE" }).catch(() => void 0);
    }
    // Listen for cookie changes, both cookieStore and fallback to polling document.cookie
    _addListener(key, listener) {
      if (!this._isAvailable()) {
        return;
      }
      const name4 = getCookieName(key);
      if (window.cookieStore) {
        const cb = ((event) => {
          const changedCookie = event.changed.find((change) => change.name === name4);
          if (changedCookie) {
            listener(changedCookie.value);
          }
          const deletedCookie = event.deleted.find((change) => change.name === name4);
          if (deletedCookie) {
            listener(null);
          }
        });
        const unsubscribe2 = () => window.cookieStore.removeEventListener("change", cb);
        this.listenerUnsubscribes.set(listener, unsubscribe2);
        return window.cookieStore.addEventListener("change", cb);
      }
      let lastValue = getDocumentCookie(name4);
      const interval = setInterval(() => {
        const currentValue = getDocumentCookie(name4);
        if (currentValue !== lastValue) {
          listener(currentValue);
          lastValue = currentValue;
        }
      }, POLLING_INTERVAL_MS);
      const unsubscribe = () => clearInterval(interval);
      this.listenerUnsubscribes.set(listener, unsubscribe);
    }
    _removeListener(_key, listener) {
      const unsubscribe = this.listenerUnsubscribes.get(listener);
      if (!unsubscribe) {
        return;
      }
      unsubscribe();
      this.listenerUnsubscribes.delete(listener);
    }
  };
  CookiePersistence.type = "COOKIE";
  var BrowserSessionPersistence = class extends BrowserPersistenceClass {
    constructor() {
      super(
        () => window.sessionStorage,
        "SESSION"
        /* PersistenceType.SESSION */
      );
    }
    _addListener(_key, _listener) {
      return;
    }
    _removeListener(_key, _listener) {
      return;
    }
  };
  BrowserSessionPersistence.type = "SESSION";
  var browserSessionPersistence = BrowserSessionPersistence;
  function _allSettled(promises) {
    return Promise.all(promises.map(async (promise) => {
      try {
        const value = await promise;
        return {
          fulfilled: true,
          value
        };
      } catch (reason) {
        return {
          fulfilled: false,
          reason
        };
      }
    }));
  }
  var Receiver = class _Receiver {
    constructor(eventTarget) {
      this.eventTarget = eventTarget;
      this.handlersMap = {};
      this.boundEventHandler = this.handleEvent.bind(this);
    }
    /**
     * Obtain an instance of a Receiver for a given event target, if none exists it will be created.
     *
     * @param eventTarget - An event target (such as window or self) through which the underlying
     * messages will be received.
     */
    static _getInstance(eventTarget) {
      const existingInstance = this.receivers.find((receiver) => receiver.isListeningto(eventTarget));
      if (existingInstance) {
        return existingInstance;
      }
      const newInstance = new _Receiver(eventTarget);
      this.receivers.push(newInstance);
      return newInstance;
    }
    isListeningto(eventTarget) {
      return this.eventTarget === eventTarget;
    }
    /**
     * Fans out a MessageEvent to the appropriate listeners.
     *
     * @remarks
     * Sends an {@link Status.ACK} upon receipt and a {@link Status.DONE} once all handlers have
     * finished processing.
     *
     * @param event - The MessageEvent.
     *
     */
    async handleEvent(event) {
      const messageEvent = event;
      const { eventId, eventType, data } = messageEvent.data;
      const handlers = this.handlersMap[eventType];
      if (!(handlers === null || handlers === void 0 ? void 0 : handlers.size)) {
        return;
      }
      messageEvent.ports[0].postMessage({
        status: "ack",
        eventId,
        eventType
      });
      const promises = Array.from(handlers).map(async (handler) => handler(messageEvent.origin, data));
      const response = await _allSettled(promises);
      messageEvent.ports[0].postMessage({
        status: "done",
        eventId,
        eventType,
        response
      });
    }
    /**
     * Subscribe an event handler for a particular event.
     *
     * @param eventType - Event name to subscribe to.
     * @param eventHandler - The event handler which should receive the events.
     *
     */
    _subscribe(eventType, eventHandler) {
      if (Object.keys(this.handlersMap).length === 0) {
        this.eventTarget.addEventListener("message", this.boundEventHandler);
      }
      if (!this.handlersMap[eventType]) {
        this.handlersMap[eventType] = /* @__PURE__ */ new Set();
      }
      this.handlersMap[eventType].add(eventHandler);
    }
    /**
     * Unsubscribe an event handler from a particular event.
     *
     * @param eventType - Event name to unsubscribe from.
     * @param eventHandler - Optional event handler, if none provided, unsubscribe all handlers on this event.
     *
     */
    _unsubscribe(eventType, eventHandler) {
      if (this.handlersMap[eventType] && eventHandler) {
        this.handlersMap[eventType].delete(eventHandler);
      }
      if (!eventHandler || this.handlersMap[eventType].size === 0) {
        delete this.handlersMap[eventType];
      }
      if (Object.keys(this.handlersMap).length === 0) {
        this.eventTarget.removeEventListener("message", this.boundEventHandler);
      }
    }
  };
  Receiver.receivers = [];
  function _generateEventId(prefix = "", digits = 10) {
    let random = "";
    for (let i = 0; i < digits; i++) {
      random += Math.floor(Math.random() * 10);
    }
    return prefix + random;
  }
  var Sender = class {
    constructor(target) {
      this.target = target;
      this.handlers = /* @__PURE__ */ new Set();
    }
    /**
     * Unsubscribe the handler and remove it from our tracking Set.
     *
     * @param handler - The handler to unsubscribe.
     */
    removeMessageHandler(handler) {
      if (handler.messageChannel) {
        handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
        handler.messageChannel.port1.close();
      }
      this.handlers.delete(handler);
    }
    /**
     * Send a message to the Receiver located at {@link target}.
     *
     * @remarks
     * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
     * receiver has had a chance to fully process the event.
     *
     * @param eventType - Type of event to send.
     * @param data - The payload of the event.
     * @param timeout - Timeout for waiting on an ACK from the receiver.
     *
     * @returns An array of settled promises from all the handlers that were listening on the receiver.
     */
    async _send(eventType, data, timeout = 50) {
      const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;
      if (!messageChannel) {
        throw new Error(
          "connection_unavailable"
          /* _MessageError.CONNECTION_UNAVAILABLE */
        );
      }
      let completionTimer;
      let handler;
      return new Promise((resolve, reject) => {
        const eventId = _generateEventId("", 20);
        messageChannel.port1.start();
        const ackTimer = setTimeout(() => {
          reject(new Error(
            "unsupported_event"
            /* _MessageError.UNSUPPORTED_EVENT */
          ));
        }, timeout);
        handler = {
          messageChannel,
          onMessage(event) {
            const messageEvent = event;
            if (messageEvent.data.eventId !== eventId) {
              return;
            }
            switch (messageEvent.data.status) {
              case "ack":
                clearTimeout(ackTimer);
                completionTimer = setTimeout(
                  () => {
                    reject(new Error(
                      "timeout"
                      /* _MessageError.TIMEOUT */
                    ));
                  },
                  3e3
                  /* _TimeoutDuration.COMPLETION */
                );
                break;
              case "done":
                clearTimeout(completionTimer);
                resolve(messageEvent.data.response);
                break;
              default:
                clearTimeout(ackTimer);
                clearTimeout(completionTimer);
                reject(new Error(
                  "invalid_response"
                  /* _MessageError.INVALID_RESPONSE */
                ));
                break;
            }
          }
        };
        this.handlers.add(handler);
        messageChannel.port1.addEventListener("message", handler.onMessage);
        this.target.postMessage({
          eventType,
          eventId,
          data
        }, [messageChannel.port2]);
      }).finally(() => {
        if (handler) {
          this.removeMessageHandler(handler);
        }
      });
    }
  };
  function _window() {
    return window;
  }
  function _setWindowLocation(url) {
    _window().location.href = url;
  }
  function _isWorker() {
    return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
  }
  async function _getActiveServiceWorker() {
    if (!(navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker)) {
      return null;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.active;
    } catch (_a) {
      return null;
    }
  }
  function _getServiceWorkerController() {
    var _a;
    return ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) || null;
  }
  function _getWorkerGlobalScope() {
    return _isWorker() ? self : null;
  }
  var DB_NAME2 = "firebaseLocalStorageDb";
  var DB_VERSION2 = 1;
  var DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
  var DB_DATA_KEYPATH = "fbase_key";
  var DBPromise = class {
    constructor(request) {
      this.request = request;
    }
    toPromise() {
      return new Promise((resolve, reject) => {
        this.request.addEventListener("success", () => {
          resolve(this.request.result);
        });
        this.request.addEventListener("error", () => {
          reject(this.request.error);
        });
      });
    }
  };
  function getObjectStore(db2, isReadWrite) {
    return db2.transaction([DB_OBJECTSTORE_NAME], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
  }
  function _deleteDatabase() {
    const request = indexedDB.deleteDatabase(DB_NAME2);
    return new DBPromise(request).toPromise();
  }
  function _openDatabase() {
    const request = indexedDB.open(DB_NAME2, DB_VERSION2);
    return new Promise((resolve, reject) => {
      request.addEventListener("error", () => {
        reject(request.error);
      });
      request.addEventListener("upgradeneeded", () => {
        const db2 = request.result;
        try {
          db2.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
        } catch (e) {
          reject(e);
        }
      });
      request.addEventListener("success", async () => {
        const db2 = request.result;
        if (!db2.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
          db2.close();
          await _deleteDatabase();
          resolve(await _openDatabase());
        } else {
          resolve(db2);
        }
      });
    });
  }
  async function _putObject(db2, key, value) {
    const request = getObjectStore(db2, true).put({
      [DB_DATA_KEYPATH]: key,
      value
    });
    return new DBPromise(request).toPromise();
  }
  async function getObject(db2, key) {
    const request = getObjectStore(db2, false).get(key);
    const data = await new DBPromise(request).toPromise();
    return data === void 0 ? null : data.value;
  }
  function _deleteObject(db2, key) {
    const request = getObjectStore(db2, true).delete(key);
    return new DBPromise(request).toPromise();
  }
  var _POLLING_INTERVAL_MS = 800;
  var _TRANSACTION_RETRY_COUNT = 3;
  var IndexedDBLocalPersistence = class {
    constructor() {
      this.type = "LOCAL";
      this._shouldAllowMigration = true;
      this.listeners = {};
      this.localCache = {};
      this.pollTimer = null;
      this.pendingWrites = 0;
      this.receiver = null;
      this.sender = null;
      this.serviceWorkerReceiverAvailable = false;
      this.activeServiceWorker = null;
      this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
      }, () => {
      });
    }
    async _openDb() {
      if (this.db) {
        return this.db;
      }
      this.db = await _openDatabase();
      return this.db;
    }
    async _withRetries(op) {
      let numAttempts = 0;
      while (true) {
        try {
          const db2 = await this._openDb();
          return await op(db2);
        } catch (e) {
          if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
            throw e;
          }
          if (this.db) {
            this.db.close();
            this.db = void 0;
          }
        }
      }
    }
    /**
     * IndexedDB events do not propagate from the main window to the worker context.  We rely on a
     * postMessage interface to send these events to the worker ourselves.
     */
    async initializeServiceWorkerMessaging() {
      return _isWorker() ? this.initializeReceiver() : this.initializeSender();
    }
    /**
     * As the worker we should listen to events from the main window.
     */
    async initializeReceiver() {
      this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
      this.receiver._subscribe("keyChanged", async (_origin, data) => {
        const keys = await this._poll();
        return {
          keyProcessed: keys.includes(data.key)
        };
      });
      this.receiver._subscribe("ping", async (_origin, _data) => {
        return [
          "keyChanged"
          /* _EventType.KEY_CHANGED */
        ];
      });
    }
    /**
     * As the main window, we should let the worker know when keys change (set and remove).
     *
     * @remarks
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready | ServiceWorkerContainer.ready}
     * may not resolve.
     */
    async initializeSender() {
      var _a, _b;
      this.activeServiceWorker = await _getActiveServiceWorker();
      if (!this.activeServiceWorker) {
        return;
      }
      this.sender = new Sender(this.activeServiceWorker);
      const results = await this.sender._send(
        "ping",
        {},
        800
        /* _TimeoutDuration.LONG_ACK */
      );
      if (!results) {
        return;
      }
      if (((_a = results[0]) === null || _a === void 0 ? void 0 : _a.fulfilled) && ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.value.includes(
        "keyChanged"
        /* _EventType.KEY_CHANGED */
      ))) {
        this.serviceWorkerReceiverAvailable = true;
      }
    }
    /**
     * Let the worker know about a changed key, the exact key doesn't technically matter since the
     * worker will just trigger a full sync anyway.
     *
     * @remarks
     * For now, we only support one service worker per page.
     *
     * @param key - Storage key which changed.
     */
    async notifyServiceWorker(key) {
      if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
        return;
      }
      try {
        await this.sender._send(
          "keyChanged",
          { key },
          // Use long timeout if receiver has previously responded to a ping from us.
          this.serviceWorkerReceiverAvailable ? 800 : 50
          /* _TimeoutDuration.ACK */
        );
      } catch (_a) {
      }
    }
    async _isAvailable() {
      try {
        if (!indexedDB) {
          return false;
        }
        const db2 = await _openDatabase();
        await _putObject(db2, STORAGE_AVAILABLE_KEY, "1");
        await _deleteObject(db2, STORAGE_AVAILABLE_KEY);
        return true;
      } catch (_a) {
      }
      return false;
    }
    async _withPendingWrite(write) {
      this.pendingWrites++;
      try {
        await write();
      } finally {
        this.pendingWrites--;
      }
    }
    async _set(key, value) {
      return this._withPendingWrite(async () => {
        await this._withRetries((db2) => _putObject(db2, key, value));
        this.localCache[key] = value;
        return this.notifyServiceWorker(key);
      });
    }
    async _get(key) {
      const obj = await this._withRetries((db2) => getObject(db2, key));
      this.localCache[key] = obj;
      return obj;
    }
    async _remove(key) {
      return this._withPendingWrite(async () => {
        await this._withRetries((db2) => _deleteObject(db2, key));
        delete this.localCache[key];
        return this.notifyServiceWorker(key);
      });
    }
    async _poll() {
      const result = await this._withRetries((db2) => {
        const getAllRequest = getObjectStore(db2, false).getAll();
        return new DBPromise(getAllRequest).toPromise();
      });
      if (!result) {
        return [];
      }
      if (this.pendingWrites !== 0) {
        return [];
      }
      const keys = [];
      const keysInResult = /* @__PURE__ */ new Set();
      if (result.length !== 0) {
        for (const { fbase_key: key, value } of result) {
          keysInResult.add(key);
          if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
            this.notifyListeners(key, value);
            keys.push(key);
          }
        }
      }
      for (const localKey of Object.keys(this.localCache)) {
        if (this.localCache[localKey] && !keysInResult.has(localKey)) {
          this.notifyListeners(localKey, null);
          keys.push(localKey);
        }
      }
      return keys;
    }
    notifyListeners(key, newValue) {
      this.localCache[key] = newValue;
      const listeners2 = this.listeners[key];
      if (listeners2) {
        for (const listener of Array.from(listeners2)) {
          listener(newValue);
        }
      }
    }
    startPolling() {
      this.stopPolling();
      this.pollTimer = setInterval(async () => this._poll(), _POLLING_INTERVAL_MS);
    }
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    }
    _addListener(key, listener) {
      if (Object.keys(this.listeners).length === 0) {
        this.startPolling();
      }
      if (!this.listeners[key]) {
        this.listeners[key] = /* @__PURE__ */ new Set();
        void this._get(key);
      }
      this.listeners[key].add(listener);
    }
    _removeListener(key, listener) {
      if (this.listeners[key]) {
        this.listeners[key].delete(listener);
        if (this.listeners[key].size === 0) {
          delete this.listeners[key];
        }
      }
      if (Object.keys(this.listeners).length === 0) {
        this.stopPolling();
      }
    }
  };
  IndexedDBLocalPersistence.type = "LOCAL";
  var indexedDBLocalPersistence = IndexedDBLocalPersistence;
  function startSignInPhoneMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:start", _addTidIfNecessary(auth2, request));
  }
  function finalizeSignInPhoneMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth2, request));
  }
  function finalizeSignInTotpMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth2, request));
  }
  var _JSLOAD_CALLBACK = _generateCallbackName("rcb");
  var NETWORK_TIMEOUT_DELAY = new Delay(3e4, 6e4);
  var RECAPTCHA_VERIFIER_TYPE = "recaptcha";
  async function _verifyPhoneNumber(auth2, options, verifier) {
    var _a;
    if (!auth2._getRecaptchaConfig()) {
      try {
        await _initializeRecaptchaConfig(auth2);
      } catch (error) {
        console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.");
      }
    }
    try {
      let phoneInfoOptions;
      if (typeof options === "string") {
        phoneInfoOptions = {
          phoneNumber: options
        };
      } else {
        phoneInfoOptions = options;
      }
      if ("session" in phoneInfoOptions) {
        const session = phoneInfoOptions.session;
        if ("phoneNumber" in phoneInfoOptions) {
          _assert(
            session.type === "enroll",
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const startPhoneMfaEnrollmentRequest = {
            idToken: session.credential,
            phoneEnrollmentInfo: {
              phoneNumber: phoneInfoOptions.phoneNumber,
              clientType: "CLIENT_TYPE_WEB"
              /* RecaptchaClientType.WEB */
            }
          };
          const startEnrollPhoneMfaActionCallback = async (authInstance, request) => {
            if (request.phoneEnrollmentInfo.captchaResponse === FAKE_TOKEN) {
              _assert(
                (verifier === null || verifier === void 0 ? void 0 : verifier.type) === RECAPTCHA_VERIFIER_TYPE,
                authInstance,
                "argument-error"
                /* AuthErrorCode.ARGUMENT_ERROR */
              );
              const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
              return startEnrollPhoneMfa(authInstance, requestWithRecaptchaV2);
            }
            return startEnrollPhoneMfa(authInstance, request);
          };
          const startPhoneMfaEnrollmentResponse = handleRecaptchaFlow(
            auth2,
            startPhoneMfaEnrollmentRequest,
            "mfaSmsEnrollment",
            startEnrollPhoneMfaActionCallback,
            "PHONE_PROVIDER"
            /* RecaptchaAuthProvider.PHONE_PROVIDER */
          );
          const response = await startPhoneMfaEnrollmentResponse.catch((error) => {
            return Promise.reject(error);
          });
          return response.phoneSessionInfo.sessionInfo;
        } else {
          _assert(
            session.type === "signin",
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const mfaEnrollmentId = ((_a = phoneInfoOptions.multiFactorHint) === null || _a === void 0 ? void 0 : _a.uid) || phoneInfoOptions.multiFactorUid;
          _assert(
            mfaEnrollmentId,
            auth2,
            "missing-multi-factor-info"
            /* AuthErrorCode.MISSING_MFA_INFO */
          );
          const startPhoneMfaSignInRequest = {
            mfaPendingCredential: session.credential,
            mfaEnrollmentId,
            phoneSignInInfo: {
              clientType: "CLIENT_TYPE_WEB"
              /* RecaptchaClientType.WEB */
            }
          };
          const startSignInPhoneMfaActionCallback = async (authInstance, request) => {
            if (request.phoneSignInInfo.captchaResponse === FAKE_TOKEN) {
              _assert(
                (verifier === null || verifier === void 0 ? void 0 : verifier.type) === RECAPTCHA_VERIFIER_TYPE,
                authInstance,
                "argument-error"
                /* AuthErrorCode.ARGUMENT_ERROR */
              );
              const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
              return startSignInPhoneMfa(authInstance, requestWithRecaptchaV2);
            }
            return startSignInPhoneMfa(authInstance, request);
          };
          const startPhoneMfaSignInResponse = handleRecaptchaFlow(
            auth2,
            startPhoneMfaSignInRequest,
            "mfaSmsSignIn",
            startSignInPhoneMfaActionCallback,
            "PHONE_PROVIDER"
            /* RecaptchaAuthProvider.PHONE_PROVIDER */
          );
          const response = await startPhoneMfaSignInResponse.catch((error) => {
            return Promise.reject(error);
          });
          return response.phoneResponseInfo.sessionInfo;
        }
      } else {
        const sendPhoneVerificationCodeRequest = {
          phoneNumber: phoneInfoOptions.phoneNumber,
          clientType: "CLIENT_TYPE_WEB"
          /* RecaptchaClientType.WEB */
        };
        const sendPhoneVerificationCodeActionCallback = async (authInstance, request) => {
          if (request.captchaResponse === FAKE_TOKEN) {
            _assert(
              (verifier === null || verifier === void 0 ? void 0 : verifier.type) === RECAPTCHA_VERIFIER_TYPE,
              authInstance,
              "argument-error"
              /* AuthErrorCode.ARGUMENT_ERROR */
            );
            const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
            return sendPhoneVerificationCode(authInstance, requestWithRecaptchaV2);
          }
          return sendPhoneVerificationCode(authInstance, request);
        };
        const sendPhoneVerificationCodeResponse = handleRecaptchaFlow(
          auth2,
          sendPhoneVerificationCodeRequest,
          "sendVerificationCode",
          sendPhoneVerificationCodeActionCallback,
          "PHONE_PROVIDER"
          /* RecaptchaAuthProvider.PHONE_PROVIDER */
        );
        const response = await sendPhoneVerificationCodeResponse.catch((error) => {
          return Promise.reject(error);
        });
        return response.sessionInfo;
      }
    } finally {
      verifier === null || verifier === void 0 ? void 0 : verifier._reset();
    }
  }
  async function injectRecaptchaV2Token(auth2, request, recaptchaV2Verifier) {
    _assert(
      recaptchaV2Verifier.type === RECAPTCHA_VERIFIER_TYPE,
      auth2,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    const recaptchaV2Token = await recaptchaV2Verifier.verify();
    _assert(
      typeof recaptchaV2Token === "string",
      auth2,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    const newRequest = Object.assign({}, request);
    if ("phoneEnrollmentInfo" in newRequest) {
      const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
      const captchaResponse = newRequest.phoneEnrollmentInfo.captchaResponse;
      const clientType = newRequest.phoneEnrollmentInfo.clientType;
      const recaptchaVersion = newRequest.phoneEnrollmentInfo.recaptchaVersion;
      Object.assign(newRequest, {
        "phoneEnrollmentInfo": {
          phoneNumber,
          recaptchaToken: recaptchaV2Token,
          captchaResponse,
          clientType,
          recaptchaVersion
        }
      });
      return newRequest;
    } else if ("phoneSignInInfo" in newRequest) {
      const captchaResponse = newRequest.phoneSignInInfo.captchaResponse;
      const clientType = newRequest.phoneSignInInfo.clientType;
      const recaptchaVersion = newRequest.phoneSignInInfo.recaptchaVersion;
      Object.assign(newRequest, {
        "phoneSignInInfo": {
          recaptchaToken: recaptchaV2Token,
          captchaResponse,
          clientType,
          recaptchaVersion
        }
      });
      return newRequest;
    } else {
      Object.assign(newRequest, { "recaptchaToken": recaptchaV2Token });
      return newRequest;
    }
  }
  var PhoneAuthProvider = class _PhoneAuthProvider {
    /**
     * @param auth - The Firebase {@link Auth} instance in which sign-ins should occur.
     *
     */
    constructor(auth2) {
      this.providerId = _PhoneAuthProvider.PROVIDER_ID;
      this.auth = _castAuth(auth2);
    }
    /**
     *
     * Starts a phone number authentication flow by sending a verification code to the given phone
     * number.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param phoneInfoOptions - The user's {@link PhoneInfoOptions}. The phone number should be in
     * E.164 format (e.g. +16505550101).
     * @param applicationVerifier - An {@link ApplicationVerifier}, which prevents
     * requests from unauthorized clients. This SDK includes an implementation
     * based on reCAPTCHA v2, {@link RecaptchaVerifier}. If you've enabled
     * reCAPTCHA Enterprise bot protection in Enforce mode, this parameter is
     * optional; in all other configurations, the parameter is required.
     *
     * @returns A Promise for a verification ID that can be passed to
     * {@link PhoneAuthProvider.credential} to identify this flow.
     */
    verifyPhoneNumber(phoneOptions, applicationVerifier) {
      return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
    }
    /**
     * Creates a phone auth credential, given the verification ID from
     * {@link PhoneAuthProvider.verifyPhoneNumber} and the code that was sent to the user's
     * mobile device.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = await confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param verificationId - The verification ID returned from {@link PhoneAuthProvider.verifyPhoneNumber}.
     * @param verificationCode - The verification code sent to the user's mobile device.
     *
     * @returns The auth provider credential.
     */
    static credential(verificationId, verificationCode) {
      return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
    }
    /**
     * Generates an {@link AuthCredential} from a {@link UserCredential}.
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      const credential = userCredential;
      return _PhoneAuthProvider.credentialFromTaggedObject(credential);
    }
    /**
     * Returns an {@link AuthCredential} when passed an error.
     *
     * @remarks
     *
     * This method works for errors like
     * `auth/account-exists-with-different-credentials`. This is useful for
     * recovering when attempting to set a user's phone number but the number
     * in question is already tied to another account. For example, the following
     * code tries to update the current user's phone number, and if that
     * fails, links the user with the account associated with that number:
     *
     * ```js
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(number, verifier);
     * try {
     *   const code = ''; // Prompt the user for the verification code
     *   await updatePhoneNumber(
     *       auth.currentUser,
     *       PhoneAuthProvider.credential(verificationId, code));
     * } catch (e) {
     *   if ((e as FirebaseError)?.code === 'auth/account-exists-with-different-credential') {
     *     const cred = PhoneAuthProvider.credentialFromError(e);
     *     await linkWithCredential(auth.currentUser, cred);
     *   }
     * }
     *
     * // At this point, auth.currentUser.phoneNumber === number.
     * ```
     *
     * @param error - The error to generate a credential from.
     */
    static credentialFromError(error) {
      return _PhoneAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse) {
        return null;
      }
      const { phoneNumber, temporaryProof } = tokenResponse;
      if (phoneNumber && temporaryProof) {
        return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
      }
      return null;
    }
  };
  PhoneAuthProvider.PROVIDER_ID = "phone";
  PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone";
  function _withDefaultResolver(auth2, resolverOverride) {
    if (resolverOverride) {
      return _getInstance(resolverOverride);
    }
    _assert(
      auth2._popupRedirectResolver,
      auth2,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    return auth2._popupRedirectResolver;
  }
  var IdpCredential = class extends AuthCredential {
    constructor(params) {
      super(
        "custom",
        "custom"
        /* ProviderId.CUSTOM */
      );
      this.params = params;
    }
    _getIdTokenResponse(auth2) {
      return signInWithIdp(auth2, this._buildIdpRequest());
    }
    _linkToIdToken(auth2, idToken) {
      return signInWithIdp(auth2, this._buildIdpRequest(idToken));
    }
    _getReauthenticationResolver(auth2) {
      return signInWithIdp(auth2, this._buildIdpRequest());
    }
    _buildIdpRequest(idToken) {
      const request = {
        requestUri: this.params.requestUri,
        sessionId: this.params.sessionId,
        postBody: this.params.postBody,
        tenantId: this.params.tenantId,
        pendingToken: this.params.pendingToken,
        returnSecureToken: true,
        returnIdpCredential: true
      };
      if (idToken) {
        request.idToken = idToken;
      }
      return request;
    }
  };
  function _signIn(params) {
    return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
  }
  function _reauth(params) {
    const { auth: auth2, user } = params;
    _assert(
      user,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
  }
  async function _link(params) {
    const { auth: auth2, user } = params;
    _assert(
      user,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return _link$1(user, new IdpCredential(params), params.bypassAuthState);
  }
  var AbstractPopupRedirectOperation = class {
    constructor(auth2, filter, resolver, user, bypassAuthState = false) {
      this.auth = auth2;
      this.resolver = resolver;
      this.user = user;
      this.bypassAuthState = bypassAuthState;
      this.pendingPromise = null;
      this.eventManager = null;
      this.filter = Array.isArray(filter) ? filter : [filter];
    }
    execute() {
      return new Promise(async (resolve, reject) => {
        this.pendingPromise = { resolve, reject };
        try {
          this.eventManager = await this.resolver._initialize(this.auth);
          await this.onExecution();
          this.eventManager.registerConsumer(this);
        } catch (e) {
          this.reject(e);
        }
      });
    }
    async onAuthEvent(event) {
      const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
      if (error) {
        this.reject(error);
        return;
      }
      const params = {
        auth: this.auth,
        requestUri: urlResponse,
        sessionId,
        tenantId: tenantId || void 0,
        postBody: postBody || void 0,
        user: this.user,
        bypassAuthState: this.bypassAuthState
      };
      try {
        this.resolve(await this.getIdpTask(type)(params));
      } catch (e) {
        this.reject(e);
      }
    }
    onError(error) {
      this.reject(error);
    }
    getIdpTask(type) {
      switch (type) {
        case "signInViaPopup":
        case "signInViaRedirect":
          return _signIn;
        case "linkViaPopup":
        case "linkViaRedirect":
          return _link;
        case "reauthViaPopup":
        case "reauthViaRedirect":
          return _reauth;
        default:
          _fail(
            this.auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }
    resolve(cred) {
      debugAssert(this.pendingPromise, "Pending promise was never set");
      this.pendingPromise.resolve(cred);
      this.unregisterAndCleanUp();
    }
    reject(error) {
      debugAssert(this.pendingPromise, "Pending promise was never set");
      this.pendingPromise.reject(error);
      this.unregisterAndCleanUp();
    }
    unregisterAndCleanUp() {
      if (this.eventManager) {
        this.eventManager.unregisterConsumer(this);
      }
      this.pendingPromise = null;
      this.cleanUp();
    }
  };
  var _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2e3, 1e4);
  async function signInWithPopup(auth2, provider, resolver) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_createError(
        auth2,
        "operation-not-supported-in-this-environment"
        /* AuthErrorCode.OPERATION_NOT_SUPPORTED */
      ));
    }
    const authInternal = _castAuth(auth2);
    _assertInstanceOf(auth2, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(authInternal, resolver);
    const action = new PopupOperation(authInternal, "signInViaPopup", provider, resolverInternal);
    return action.executeNotNull();
  }
  var PopupOperation = class _PopupOperation extends AbstractPopupRedirectOperation {
    constructor(auth2, filter, provider, resolver, user) {
      super(auth2, filter, resolver, user);
      this.provider = provider;
      this.authWindow = null;
      this.pollId = null;
      if (_PopupOperation.currentPopupAction) {
        _PopupOperation.currentPopupAction.cancel();
      }
      _PopupOperation.currentPopupAction = this;
    }
    async executeNotNull() {
      const result = await this.execute();
      _assert(
        result,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return result;
    }
    async onExecution() {
      debugAssert(this.filter.length === 1, "Popup operations only handle one event");
      const eventId = _generateEventId();
      this.authWindow = await this.resolver._openPopup(
        this.auth,
        this.provider,
        this.filter[0],
        // There's always one, see constructor
        eventId
      );
      this.authWindow.associatedEvent = eventId;
      this.resolver._originValidation(this.auth).catch((e) => {
        this.reject(e);
      });
      this.resolver._isIframeWebStorageSupported(this.auth, (isSupported) => {
        if (!isSupported) {
          this.reject(_createError(
            this.auth,
            "web-storage-unsupported"
            /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */
          ));
        }
      });
      this.pollUserCancellation();
    }
    get eventId() {
      var _a;
      return ((_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.associatedEvent) || null;
    }
    cancel() {
      this.reject(_createError(
        this.auth,
        "cancelled-popup-request"
        /* AuthErrorCode.EXPIRED_POPUP_REQUEST */
      ));
    }
    cleanUp() {
      if (this.authWindow) {
        this.authWindow.close();
      }
      if (this.pollId) {
        window.clearTimeout(this.pollId);
      }
      this.authWindow = null;
      this.pollId = null;
      _PopupOperation.currentPopupAction = null;
    }
    pollUserCancellation() {
      const poll = () => {
        var _a, _b;
        if ((_b = (_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.closed) {
          this.pollId = window.setTimeout(
            () => {
              this.pollId = null;
              this.reject(_createError(
                this.auth,
                "popup-closed-by-user"
                /* AuthErrorCode.POPUP_CLOSED_BY_USER */
              ));
            },
            8e3
            /* _Timeout.AUTH_EVENT */
          );
          return;
        }
        this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
      };
      poll();
    }
  };
  PopupOperation.currentPopupAction = null;
  var PENDING_REDIRECT_KEY = "pendingRedirect";
  var redirectOutcomeMap = /* @__PURE__ */ new Map();
  var RedirectAction = class extends AbstractPopupRedirectOperation {
    constructor(auth2, resolver, bypassAuthState = false) {
      super(auth2, [
        "signInViaRedirect",
        "linkViaRedirect",
        "reauthViaRedirect",
        "unknown"
        /* AuthEventType.UNKNOWN */
      ], resolver, void 0, bypassAuthState);
      this.eventId = null;
    }
    /**
     * Override the execute function; if we already have a redirect result, then
     * just return it.
     */
    async execute() {
      let readyOutcome = redirectOutcomeMap.get(this.auth._key());
      if (!readyOutcome) {
        try {
          const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
          const result = hasPendingRedirect ? await super.execute() : null;
          readyOutcome = () => Promise.resolve(result);
        } catch (e) {
          readyOutcome = () => Promise.reject(e);
        }
        redirectOutcomeMap.set(this.auth._key(), readyOutcome);
      }
      if (!this.bypassAuthState) {
        redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
      }
      return readyOutcome();
    }
    async onAuthEvent(event) {
      if (event.type === "signInViaRedirect") {
        return super.onAuthEvent(event);
      } else if (event.type === "unknown") {
        this.resolve(null);
        return;
      }
      if (event.eventId) {
        const user = await this.auth._redirectUserForId(event.eventId);
        if (user) {
          this.user = user;
          return super.onAuthEvent(event);
        } else {
          this.resolve(null);
        }
      }
    }
    async onExecution() {
    }
    cleanUp() {
    }
  };
  async function _getAndClearPendingRedirectStatus(resolver, auth2) {
    const key = pendingRedirectKey(auth2);
    const persistence = resolverPersistence(resolver);
    if (!await persistence._isAvailable()) {
      return false;
    }
    const hasPendingRedirect = await persistence._get(key) === "true";
    await persistence._remove(key);
    return hasPendingRedirect;
  }
  async function _setPendingRedirectStatus(resolver, auth2) {
    return resolverPersistence(resolver)._set(pendingRedirectKey(auth2), "true");
  }
  function _overrideRedirectResult(auth2, result) {
    redirectOutcomeMap.set(auth2._key(), result);
  }
  function resolverPersistence(resolver) {
    return _getInstance(resolver._redirectPersistence);
  }
  function pendingRedirectKey(auth2) {
    return _persistenceKeyName(PENDING_REDIRECT_KEY, auth2.config.apiKey, auth2.name);
  }
  function signInWithRedirect(auth2, provider, resolver) {
    return _signInWithRedirect(auth2, provider, resolver);
  }
  async function _signInWithRedirect(auth2, provider, resolver) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const authInternal = _castAuth(auth2);
    _assertInstanceOf(auth2, provider, FederatedAuthProvider);
    await authInternal._initializationPromise;
    const resolverInternal = _withDefaultResolver(authInternal, resolver);
    await _setPendingRedirectStatus(resolverInternal, authInternal);
    return resolverInternal._openRedirect(
      authInternal,
      provider,
      "signInViaRedirect"
      /* AuthEventType.SIGN_IN_VIA_REDIRECT */
    );
  }
  async function getRedirectResult(auth2, resolver) {
    await _castAuth(auth2)._initializationPromise;
    return _getRedirectResult(auth2, resolver, false);
  }
  async function _getRedirectResult(auth2, resolverExtern, bypassAuthState = false) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const authInternal = _castAuth(auth2);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = await action.execute();
    if (result && !bypassAuthState) {
      delete result.user._redirectEventId;
      await authInternal._persistUserIfCurrent(result.user);
      await authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
  }
  var EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1e3;
  var AuthEventManager = class {
    constructor(auth2) {
      this.auth = auth2;
      this.cachedEventUids = /* @__PURE__ */ new Set();
      this.consumers = /* @__PURE__ */ new Set();
      this.queuedRedirectEvent = null;
      this.hasHandledPotentialRedirect = false;
      this.lastProcessedEventTime = Date.now();
    }
    registerConsumer(authEventConsumer) {
      this.consumers.add(authEventConsumer);
      if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
        this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
        this.saveEventToCache(this.queuedRedirectEvent);
        this.queuedRedirectEvent = null;
      }
    }
    unregisterConsumer(authEventConsumer) {
      this.consumers.delete(authEventConsumer);
    }
    onEvent(event) {
      if (this.hasEventBeenHandled(event)) {
        return false;
      }
      let handled = false;
      this.consumers.forEach((consumer) => {
        if (this.isEventForConsumer(event, consumer)) {
          handled = true;
          this.sendToConsumer(event, consumer);
          this.saveEventToCache(event);
        }
      });
      if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
        return handled;
      }
      this.hasHandledPotentialRedirect = true;
      if (!handled) {
        this.queuedRedirectEvent = event;
        handled = true;
      }
      return handled;
    }
    sendToConsumer(event, consumer) {
      var _a;
      if (event.error && !isNullRedirectEvent(event)) {
        const code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split("auth/")[1]) || "internal-error";
        consumer.onError(_createError(this.auth, code));
      } else {
        consumer.onAuthEvent(event);
      }
    }
    isEventForConsumer(event, consumer) {
      const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
      return consumer.filter.includes(event.type) && eventIdMatches;
    }
    hasEventBeenHandled(event) {
      if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
        this.cachedEventUids.clear();
      }
      return this.cachedEventUids.has(eventUid(event));
    }
    saveEventToCache(event) {
      this.cachedEventUids.add(eventUid(event));
      this.lastProcessedEventTime = Date.now();
    }
  };
  function eventUid(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId].filter((v) => v).join("-");
  }
  function isNullRedirectEvent({ type, error }) {
    return type === "unknown" && (error === null || error === void 0 ? void 0 : error.code) === `auth/${"no-auth-event"}`;
  }
  function isRedirectEvent(event) {
    switch (event.type) {
      case "signInViaRedirect":
      case "linkViaRedirect":
      case "reauthViaRedirect":
        return true;
      case "unknown":
        return isNullRedirectEvent(event);
      default:
        return false;
    }
  }
  async function _getProjectConfig(auth2, request = {}) {
    return _performApiRequest(auth2, "GET", "/v1/projects", request);
  }
  var IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  var HTTP_REGEX = /^https?/;
  async function _validateOrigin(auth2) {
    if (auth2.config.emulator) {
      return;
    }
    const { authorizedDomains } = await _getProjectConfig(auth2);
    for (const domain of authorizedDomains) {
      try {
        if (matchDomain(domain)) {
          return;
        }
      } catch (_a) {
      }
    }
    _fail(
      auth2,
      "unauthorized-domain"
      /* AuthErrorCode.INVALID_ORIGIN */
    );
  }
  function matchDomain(expected) {
    const currentUrl = _getCurrentUrl();
    const { protocol, hostname } = new URL(currentUrl);
    if (expected.startsWith("chrome-extension://")) {
      const ceUrl = new URL(expected);
      if (ceUrl.hostname === "" && hostname === "") {
        return protocol === "chrome-extension:" && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
      }
      return protocol === "chrome-extension:" && ceUrl.hostname === hostname;
    }
    if (!HTTP_REGEX.test(protocol)) {
      return false;
    }
    if (IP_ADDRESS_REGEX.test(expected)) {
      return hostname === expected;
    }
    const escapedDomainPattern = expected.replace(/\./g, "\\.");
    const re = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
    return re.test(hostname);
  }
  var NETWORK_TIMEOUT = new Delay(3e4, 6e4);
  function resetUnloadedGapiModules() {
    const beacon = _window().___jsl;
    if (beacon === null || beacon === void 0 ? void 0 : beacon.H) {
      for (const hint of Object.keys(beacon.H)) {
        beacon.H[hint].r = beacon.H[hint].r || [];
        beacon.H[hint].L = beacon.H[hint].L || [];
        beacon.H[hint].r = [...beacon.H[hint].L];
        if (beacon.CP) {
          for (let i = 0; i < beacon.CP.length; i++) {
            beacon.CP[i] = null;
          }
        }
      }
    }
  }
  function loadGapi(auth2) {
    return new Promise((resolve, reject) => {
      var _a, _b, _c;
      function loadGapiIframe() {
        resetUnloadedGapiModules();
        gapi.load("gapi.iframes", {
          callback: () => {
            resolve(gapi.iframes.getContext());
          },
          ontimeout: () => {
            resetUnloadedGapiModules();
            reject(_createError(
              auth2,
              "network-request-failed"
              /* AuthErrorCode.NETWORK_REQUEST_FAILED */
            ));
          },
          timeout: NETWORK_TIMEOUT.get()
        });
      }
      if ((_b = (_a = _window().gapi) === null || _a === void 0 ? void 0 : _a.iframes) === null || _b === void 0 ? void 0 : _b.Iframe) {
        resolve(gapi.iframes.getContext());
      } else if (!!((_c = _window().gapi) === null || _c === void 0 ? void 0 : _c.load)) {
        loadGapiIframe();
      } else {
        const cbName = _generateCallbackName("iframefcb");
        _window()[cbName] = () => {
          if (!!gapi.load) {
            loadGapiIframe();
          } else {
            reject(_createError(
              auth2,
              "network-request-failed"
              /* AuthErrorCode.NETWORK_REQUEST_FAILED */
            ));
          }
        };
        return _loadJS(`${_gapiScriptUrl()}?onload=${cbName}`).catch((e) => reject(e));
      }
    }).catch((error) => {
      cachedGApiLoader = null;
      throw error;
    });
  }
  var cachedGApiLoader = null;
  function _loadGapi(auth2) {
    cachedGApiLoader = cachedGApiLoader || loadGapi(auth2);
    return cachedGApiLoader;
  }
  var PING_TIMEOUT = new Delay(5e3, 15e3);
  var IFRAME_PATH = "__/auth/iframe";
  var EMULATED_IFRAME_PATH = "emulator/auth/iframe";
  var IFRAME_ATTRIBUTES = {
    style: {
      position: "absolute",
      top: "-100px",
      width: "1px",
      height: "1px"
    },
    "aria-hidden": "true",
    tabindex: "-1"
  };
  var EID_FROM_APIHOST = /* @__PURE__ */ new Map([
    ["identitytoolkit.googleapis.com", "p"],
    // production
    ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
    // staging
    ["test-identitytoolkit.sandbox.googleapis.com", "t"]
    // test
  ]);
  function getIframeUrl(auth2) {
    const config = auth2.config;
    _assert(
      config.authDomain,
      auth2,
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    );
    const url = config.emulator ? _emulatorUrl(config, EMULATED_IFRAME_PATH) : `https://${auth2.config.authDomain}/${IFRAME_PATH}`;
    const params = {
      apiKey: config.apiKey,
      appName: auth2.name,
      v: SDK_VERSION
    };
    const eid = EID_FROM_APIHOST.get(auth2.config.apiHost);
    if (eid) {
      params.eid = eid;
    }
    const frameworks = auth2._getFrameworks();
    if (frameworks.length) {
      params.fw = frameworks.join(",");
    }
    return `${url}?${querystring(params).slice(1)}`;
  }
  async function _openIframe(auth2) {
    const context = await _loadGapi(auth2);
    const gapi2 = _window().gapi;
    _assert(
      gapi2,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return context.open({
      where: document.body,
      url: getIframeUrl(auth2),
      messageHandlersFilter: gapi2.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
      attributes: IFRAME_ATTRIBUTES,
      dontclear: true
    }, (iframe) => new Promise(async (resolve, reject) => {
      await iframe.restyle({
        // Prevent iframe from closing on mouse out.
        setHideOnLeave: false
      });
      const networkError = _createError(
        auth2,
        "network-request-failed"
        /* AuthErrorCode.NETWORK_REQUEST_FAILED */
      );
      const networkErrorTimer = _window().setTimeout(() => {
        reject(networkError);
      }, PING_TIMEOUT.get());
      function clearTimerAndResolve() {
        _window().clearTimeout(networkErrorTimer);
        resolve(iframe);
      }
      iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
        reject(networkError);
      });
    }));
  }
  var BASE_POPUP_OPTIONS = {
    location: "yes",
    resizable: "yes",
    statusbar: "yes",
    toolbar: "no"
  };
  var DEFAULT_WIDTH = 500;
  var DEFAULT_HEIGHT = 600;
  var TARGET_BLANK = "_blank";
  var FIREFOX_EMPTY_URL = "http://localhost";
  var AuthPopup = class {
    constructor(window2) {
      this.window = window2;
      this.associatedEvent = null;
    }
    close() {
      if (this.window) {
        try {
          this.window.close();
        } catch (e) {
        }
      }
    }
  };
  function _open(auth2, url, name4, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
    const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    let target = "";
    const options = Object.assign(Object.assign({}, BASE_POPUP_OPTIONS), {
      width: width.toString(),
      height: height.toString(),
      top,
      left
    });
    const ua = getUA().toLowerCase();
    if (name4) {
      target = _isChromeIOS(ua) ? TARGET_BLANK : name4;
    }
    if (_isFirefox(ua)) {
      url = url || FIREFOX_EMPTY_URL;
      options.scrollbars = "yes";
    }
    const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, "");
    if (_isIOSStandalone(ua) && target !== "_self") {
      openAsNewWindowIOS(url || "", target);
      return new AuthPopup(null);
    }
    const newWin = window.open(url || "", target, optionsString);
    _assert(
      newWin,
      auth2,
      "popup-blocked"
      /* AuthErrorCode.POPUP_BLOCKED */
    );
    try {
      newWin.focus();
    } catch (e) {
    }
    return new AuthPopup(newWin);
  }
  function openAsNewWindowIOS(url, target) {
    const el = document.createElement("a");
    el.href = url;
    el.target = target;
    const click = document.createEvent("MouseEvent");
    click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
    el.dispatchEvent(click);
  }
  var WIDGET_PATH = "__/auth/handler";
  var EMULATOR_WIDGET_PATH = "emulator/auth/handler";
  var FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent("fac");
  async function _getRedirectUrl(auth2, provider, authType, redirectUrl, eventId, additionalParams) {
    _assert(
      auth2.config.authDomain,
      auth2,
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    );
    _assert(
      auth2.config.apiKey,
      auth2,
      "invalid-api-key"
      /* AuthErrorCode.INVALID_API_KEY */
    );
    const params = {
      apiKey: auth2.config.apiKey,
      appName: auth2.name,
      authType,
      redirectUrl,
      v: SDK_VERSION,
      eventId
    };
    if (provider instanceof FederatedAuthProvider) {
      provider.setDefaultLanguage(auth2.languageCode);
      params.providerId = provider.providerId || "";
      if (!isEmpty(provider.getCustomParameters())) {
        params.customParameters = JSON.stringify(provider.getCustomParameters());
      }
      for (const [key, value] of Object.entries(additionalParams || {})) {
        params[key] = value;
      }
    }
    if (provider instanceof BaseOAuthProvider) {
      const scopes = provider.getScopes().filter((scope) => scope !== "");
      if (scopes.length > 0) {
        params.scopes = scopes.join(",");
      }
    }
    if (auth2.tenantId) {
      params.tid = auth2.tenantId;
    }
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
      if (paramsDict[key] === void 0) {
        delete paramsDict[key];
      }
    }
    const appCheckToken = await auth2._getAppCheckToken();
    const appCheckTokenFragment = appCheckToken ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}` : "";
    return `${getHandlerBase(auth2)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
  }
  function getHandlerBase({ config }) {
    if (!config.emulator) {
      return `https://${config.authDomain}/${WIDGET_PATH}`;
    }
    return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
  }
  var WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";
  var BrowserPopupRedirectResolver = class {
    constructor() {
      this.eventManagers = {};
      this.iframes = {};
      this.originValidationPromises = {};
      this._redirectPersistence = browserSessionPersistence;
      this._completeRedirectFn = _getRedirectResult;
      this._overrideRedirectResult = _overrideRedirectResult;
    }
    // Wrapping in async even though we don't await anywhere in order
    // to make sure errors are raised as promise rejections
    async _openPopup(auth2, provider, authType, eventId) {
      var _a;
      debugAssert((_a = this.eventManagers[auth2._key()]) === null || _a === void 0 ? void 0 : _a.manager, "_initialize() not called before _openPopup()");
      const url = await _getRedirectUrl(auth2, provider, authType, _getCurrentUrl(), eventId);
      return _open(auth2, url, _generateEventId());
    }
    async _openRedirect(auth2, provider, authType, eventId) {
      await this._originValidation(auth2);
      const url = await _getRedirectUrl(auth2, provider, authType, _getCurrentUrl(), eventId);
      _setWindowLocation(url);
      return new Promise(() => {
      });
    }
    _initialize(auth2) {
      const key = auth2._key();
      if (this.eventManagers[key]) {
        const { manager, promise: promise2 } = this.eventManagers[key];
        if (manager) {
          return Promise.resolve(manager);
        } else {
          debugAssert(promise2, "If manager is not set, promise should be");
          return promise2;
        }
      }
      const promise = this.initAndGetManager(auth2);
      this.eventManagers[key] = { promise };
      promise.catch(() => {
        delete this.eventManagers[key];
      });
      return promise;
    }
    async initAndGetManager(auth2) {
      const iframe = await _openIframe(auth2);
      const manager = new AuthEventManager(auth2);
      iframe.register("authEvent", (iframeEvent) => {
        _assert(
          iframeEvent === null || iframeEvent === void 0 ? void 0 : iframeEvent.authEvent,
          auth2,
          "invalid-auth-event"
          /* AuthErrorCode.INVALID_AUTH_EVENT */
        );
        const handled = manager.onEvent(iframeEvent.authEvent);
        return {
          status: handled ? "ACK" : "ERROR"
          /* GapiOutcome.ERROR */
        };
      }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
      this.eventManagers[auth2._key()] = { manager };
      this.iframes[auth2._key()] = iframe;
      return manager;
    }
    _isIframeWebStorageSupported(auth2, cb) {
      const iframe = this.iframes[auth2._key()];
      iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, (result) => {
        var _a;
        const isSupported = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a[WEB_STORAGE_SUPPORT_KEY];
        if (isSupported !== void 0) {
          cb(!!isSupported);
        }
        _fail(
          auth2,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
      }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    }
    _originValidation(auth2) {
      const key = auth2._key();
      if (!this.originValidationPromises[key]) {
        this.originValidationPromises[key] = _validateOrigin(auth2);
      }
      return this.originValidationPromises[key];
    }
    get _shouldInitProactively() {
      return _isMobileBrowser() || _isSafari() || _isIOS();
    }
  };
  var browserPopupRedirectResolver = BrowserPopupRedirectResolver;
  var MultiFactorAssertionImpl = class {
    constructor(factorId) {
      this.factorId = factorId;
    }
    _process(auth2, session, displayName) {
      switch (session.type) {
        case "enroll":
          return this._finalizeEnroll(auth2, session.credential, displayName);
        case "signin":
          return this._finalizeSignIn(auth2, session.credential);
        default:
          return debugFail("unexpected MultiFactorSessionType");
      }
    }
  };
  var PhoneMultiFactorAssertionImpl = class _PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
    constructor(credential) {
      super(
        "phone"
        /* FactorId.PHONE */
      );
      this.credential = credential;
    }
    /** @internal */
    static _fromCredential(credential) {
      return new _PhoneMultiFactorAssertionImpl(credential);
    }
    /** @internal */
    _finalizeEnroll(auth2, idToken, displayName) {
      return finalizeEnrollPhoneMfa(auth2, {
        idToken,
        displayName,
        phoneVerificationInfo: this.credential._makeVerificationRequest()
      });
    }
    /** @internal */
    _finalizeSignIn(auth2, mfaPendingCredential) {
      return finalizeSignInPhoneMfa(auth2, {
        mfaPendingCredential,
        phoneVerificationInfo: this.credential._makeVerificationRequest()
      });
    }
  };
  var PhoneMultiFactorGenerator = class {
    constructor() {
    }
    /**
     * Provides a {@link PhoneMultiFactorAssertion} to confirm ownership of the phone second factor.
     *
     * @remarks
     * This method does not work in a Node.js environment.
     *
     * @param phoneAuthCredential - A credential provided by {@link PhoneAuthProvider.credential}.
     * @returns A {@link PhoneMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}
     */
    static assertion(credential) {
      return PhoneMultiFactorAssertionImpl._fromCredential(credential);
    }
  };
  PhoneMultiFactorGenerator.FACTOR_ID = "phone";
  var TotpMultiFactorGenerator = class {
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
     * the TOTP (time-based one-time password) second factor.
     * This assertion is used to complete enrollment in TOTP second factor.
     *
     * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorUser.enroll}.
     */
    static assertionForEnrollment(secret, oneTimePassword) {
      return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
    }
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
     * This assertion is used to complete signIn with TOTP as the second factor.
     *
     * @param enrollmentId identifies the enrolled TOTP second factor.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}.
     */
    static assertionForSignIn(enrollmentId, oneTimePassword) {
      return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
    }
    /**
     * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
     * Creates a TOTP secret as part of enrolling a TOTP second factor.
     * Used for generating a QR code URL or inputting into a TOTP app.
     * This method uses the auth instance corresponding to the user in the multiFactorSession.
     *
     * @param session The {@link MultiFactorSession} that the user is part of.
     * @returns A promise to {@link TotpSecret}.
     */
    static async generateSecret(session) {
      var _a;
      const mfaSession = session;
      _assert(
        typeof ((_a = mfaSession.user) === null || _a === void 0 ? void 0 : _a.auth) !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const response = await startEnrollTotpMfa(mfaSession.user.auth, {
        idToken: mfaSession.credential,
        totpEnrollmentInfo: {}
      });
      return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
    }
  };
  TotpMultiFactorGenerator.FACTOR_ID = "totp";
  var TotpMultiFactorAssertionImpl = class _TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
    constructor(otp, enrollmentId, secret) {
      super(
        "totp"
        /* FactorId.TOTP */
      );
      this.otp = otp;
      this.enrollmentId = enrollmentId;
      this.secret = secret;
    }
    /** @internal */
    static _fromSecret(secret, otp) {
      return new _TotpMultiFactorAssertionImpl(otp, void 0, secret);
    }
    /** @internal */
    static _fromEnrollmentId(enrollmentId, otp) {
      return new _TotpMultiFactorAssertionImpl(otp, enrollmentId);
    }
    /** @internal */
    async _finalizeEnroll(auth2, idToken, displayName) {
      _assert(
        typeof this.secret !== "undefined",
        auth2,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      return finalizeEnrollTotpMfa(auth2, {
        idToken,
        displayName,
        totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
      });
    }
    /** @internal */
    async _finalizeSignIn(auth2, mfaPendingCredential) {
      _assert(
        this.enrollmentId !== void 0 && this.otp !== void 0,
        auth2,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      const totpVerificationInfo = { verificationCode: this.otp };
      return finalizeSignInTotpMfa(auth2, {
        mfaPendingCredential,
        mfaEnrollmentId: this.enrollmentId,
        totpVerificationInfo
      });
    }
  };
  var TotpSecret = class _TotpSecret {
    // The public members are declared outside the constructor so the docs can be generated.
    constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth2) {
      this.sessionInfo = sessionInfo;
      this.auth = auth2;
      this.secretKey = secretKey;
      this.hashingAlgorithm = hashingAlgorithm;
      this.codeLength = codeLength;
      this.codeIntervalSeconds = codeIntervalSeconds;
      this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
    }
    /** @internal */
    static _fromStartTotpMfaEnrollmentResponse(response, auth2) {
      return new _TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth2);
    }
    /** @internal */
    _makeTotpVerificationInfo(otp) {
      return { sessionInfo: this.sessionInfo, verificationCode: otp };
    }
    /**
     * Returns a QR code URL as described in
     * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
     * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
     * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
     *
     * @param accountName the name of the account/app along with a user identifier.
     * @param issuer issuer of the TOTP (likely the app name).
     * @returns A QR code URL string.
     */
    generateQrCodeUrl(accountName, issuer) {
      var _a;
      let useDefaults = false;
      if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
        useDefaults = true;
      }
      if (useDefaults) {
        if (_isEmptyString(accountName)) {
          accountName = ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.email) || "unknownuser";
        }
        if (_isEmptyString(issuer)) {
          issuer = this.auth.name;
        }
      }
      return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
    }
  };
  function _isEmptyString(input) {
    return typeof input === "undefined" || (input === null || input === void 0 ? void 0 : input.length) === 0;
  }
  var name3 = "@firebase/auth";
  var version3 = "1.10.8";
  var AuthInterop = class {
    constructor(auth2) {
      this.auth = auth2;
      this.internalListeners = /* @__PURE__ */ new Map();
    }
    getUid() {
      var _a;
      this.assertAuthConfigured();
      return ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || null;
    }
    async getToken(forceRefresh) {
      this.assertAuthConfigured();
      await this.auth._initializationPromise;
      if (!this.auth.currentUser) {
        return null;
      }
      const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
      return { accessToken };
    }
    addAuthTokenListener(listener) {
      this.assertAuthConfigured();
      if (this.internalListeners.has(listener)) {
        return;
      }
      const unsubscribe = this.auth.onIdTokenChanged((user) => {
        listener((user === null || user === void 0 ? void 0 : user.stsTokenManager.accessToken) || null);
      });
      this.internalListeners.set(listener, unsubscribe);
      this.updateProactiveRefresh();
    }
    removeAuthTokenListener(listener) {
      this.assertAuthConfigured();
      const unsubscribe = this.internalListeners.get(listener);
      if (!unsubscribe) {
        return;
      }
      this.internalListeners.delete(listener);
      unsubscribe();
      this.updateProactiveRefresh();
    }
    assertAuthConfigured() {
      _assert(
        this.auth._initializationPromise,
        "dependent-sdk-initialized-before-auth"
        /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
      );
    }
    updateProactiveRefresh() {
      if (this.internalListeners.size > 0) {
        this.auth._startProactiveRefresh();
      } else {
        this.auth._stopProactiveRefresh();
      }
    }
  };
  function getVersionForPlatform(clientPlatform) {
    switch (clientPlatform) {
      case "Node":
        return "node";
      case "ReactNative":
        return "rn";
      case "Worker":
        return "webworker";
      case "Cordova":
        return "cordova";
      case "WebExtension":
        return "web-extension";
      default:
        return void 0;
    }
  }
  function registerAuth(clientPlatform) {
    _registerComponent(new Component(
      "auth",
      (container, { options: deps }) => {
        const app2 = container.getProvider("app").getImmediate();
        const heartbeatServiceProvider = container.getProvider("heartbeat");
        const appCheckServiceProvider = container.getProvider("app-check-internal");
        const { apiKey, authDomain } = app2.options;
        _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app2.name });
        const config = {
          apiKey,
          authDomain,
          clientPlatform,
          apiHost: "identitytoolkit.googleapis.com",
          tokenApiHost: "securetoken.googleapis.com",
          apiScheme: "https",
          sdkClientVersion: _getClientVersion(clientPlatform)
        };
        const authInstance = new AuthImpl(app2, heartbeatServiceProvider, appCheckServiceProvider, config);
        _initializeAuthInstance(authInstance, deps);
        return authInstance;
      },
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ).setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
      const authInternalProvider = container.getProvider(
        "auth-internal"
        /* _ComponentName.AUTH_INTERNAL */
      );
      authInternalProvider.initialize();
    }));
    _registerComponent(new Component(
      "auth-internal",
      (container) => {
        const auth2 = _castAuth(container.getProvider(
          "auth"
          /* _ComponentName.AUTH */
        ).getImmediate());
        return ((auth3) => new AuthInterop(auth3))(auth2);
      },
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ));
    registerVersion(name3, version3, getVersionForPlatform(clientPlatform));
    registerVersion(name3, version3, "esm2017");
  }
  var DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
  var authIdTokenMaxAge = getExperimentalSetting("authIdTokenMaxAge") || DEFAULT_ID_TOKEN_MAX_AGE;
  var lastPostedIdToken = null;
  var mintCookieFactory = (url) => async (user) => {
    const idTokenResult = user && await user.getIdTokenResult();
    const idTokenAge = idTokenResult && ((/* @__PURE__ */ new Date()).getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1e3;
    if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
      return;
    }
    const idToken = idTokenResult === null || idTokenResult === void 0 ? void 0 : idTokenResult.token;
    if (lastPostedIdToken === idToken) {
      return;
    }
    lastPostedIdToken = idToken;
    await fetch(url, {
      method: idToken ? "POST" : "DELETE",
      headers: idToken ? {
        "Authorization": `Bearer ${idToken}`
      } : {}
    });
  };
  function getAuth(app2 = getApp()) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
      return provider.getImmediate();
    }
    const auth2 = initializeAuth(app2, {
      popupRedirectResolver: browserPopupRedirectResolver,
      persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence
      ]
    });
    const authTokenSyncPath = getExperimentalSetting("authTokenSyncURL");
    if (authTokenSyncPath && typeof isSecureContext === "boolean" && isSecureContext) {
      const authTokenSyncUrl = new URL(authTokenSyncPath, location.origin);
      if (location.origin === authTokenSyncUrl.origin) {
        const mintCookie = mintCookieFactory(authTokenSyncUrl.toString());
        beforeAuthStateChanged(auth2, mintCookie, () => mintCookie(auth2.currentUser));
        onIdTokenChanged(auth2, (user) => mintCookie(user));
      }
    }
    const authEmulatorHost = getDefaultEmulatorHost("auth");
    if (authEmulatorHost) {
      connectAuthEmulator(auth2, `http://${authEmulatorHost}`);
    }
    return auth2;
  }
  function getScriptParentElement() {
    var _a, _b;
    return (_b = (_a = document.getElementsByTagName("head")) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : document;
  }
  _setExternalJSProvider({
    loadJS(url) {
      return new Promise((resolve, reject) => {
        const el = document.createElement("script");
        el.setAttribute("src", url);
        el.onload = resolve;
        el.onerror = (e) => {
          const error = _createError(
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          error.customData = e;
          reject(error);
        };
        el.type = "text/javascript";
        el.charset = "UTF-8";
        getScriptParentElement().appendChild(el);
      });
    },
    gapiScript: "https://apis.google.com/js/api.js",
    recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
    recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render="
  });
  registerAuth(
    "Browser"
    /* ClientPlatform.BROWSER */
  );

  // node_modules/@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var bloom_blob_es2018 = {};
  var Integer;
  var Md5;
  (function() {
    var h;
    function k2(f, a) {
      function c() {
      }
      c.prototype = a.prototype;
      f.D = a.prototype;
      f.prototype = new c();
      f.prototype.constructor = f;
      f.C = function(d, e, g) {
        for (var b = Array(arguments.length - 2), r = 2; r < arguments.length; r++) b[r - 2] = arguments[r];
        return a.prototype[e].apply(d, b);
      };
    }
    function l() {
      this.blockSize = -1;
    }
    function m() {
      this.blockSize = -1;
      this.blockSize = 64;
      this.g = Array(4);
      this.B = Array(this.blockSize);
      this.o = this.h = 0;
      this.s();
    }
    k2(m, l);
    m.prototype.s = function() {
      this.g[0] = 1732584193;
      this.g[1] = 4023233417;
      this.g[2] = 2562383102;
      this.g[3] = 271733878;
      this.o = this.h = 0;
    };
    function n(f, a, c) {
      c || (c = 0);
      var d = Array(16);
      if ("string" === typeof a) for (var e = 0; 16 > e; ++e) d[e] = a.charCodeAt(c++) | a.charCodeAt(c++) << 8 | a.charCodeAt(c++) << 16 | a.charCodeAt(c++) << 24;
      else for (e = 0; 16 > e; ++e) d[e] = a[c++] | a[c++] << 8 | a[c++] << 16 | a[c++] << 24;
      a = f.g[0];
      c = f.g[1];
      e = f.g[2];
      var g = f.g[3];
      var b = a + (g ^ c & (e ^ g)) + d[0] + 3614090360 & 4294967295;
      a = c + (b << 7 & 4294967295 | b >>> 25);
      b = g + (e ^ a & (c ^ e)) + d[1] + 3905402710 & 4294967295;
      g = a + (b << 12 & 4294967295 | b >>> 20);
      b = e + (c ^ g & (a ^ c)) + d[2] + 606105819 & 4294967295;
      e = g + (b << 17 & 4294967295 | b >>> 15);
      b = c + (a ^ e & (g ^ a)) + d[3] + 3250441966 & 4294967295;
      c = e + (b << 22 & 4294967295 | b >>> 10);
      b = a + (g ^ c & (e ^ g)) + d[4] + 4118548399 & 4294967295;
      a = c + (b << 7 & 4294967295 | b >>> 25);
      b = g + (e ^ a & (c ^ e)) + d[5] + 1200080426 & 4294967295;
      g = a + (b << 12 & 4294967295 | b >>> 20);
      b = e + (c ^ g & (a ^ c)) + d[6] + 2821735955 & 4294967295;
      e = g + (b << 17 & 4294967295 | b >>> 15);
      b = c + (a ^ e & (g ^ a)) + d[7] + 4249261313 & 4294967295;
      c = e + (b << 22 & 4294967295 | b >>> 10);
      b = a + (g ^ c & (e ^ g)) + d[8] + 1770035416 & 4294967295;
      a = c + (b << 7 & 4294967295 | b >>> 25);
      b = g + (e ^ a & (c ^ e)) + d[9] + 2336552879 & 4294967295;
      g = a + (b << 12 & 4294967295 | b >>> 20);
      b = e + (c ^ g & (a ^ c)) + d[10] + 4294925233 & 4294967295;
      e = g + (b << 17 & 4294967295 | b >>> 15);
      b = c + (a ^ e & (g ^ a)) + d[11] + 2304563134 & 4294967295;
      c = e + (b << 22 & 4294967295 | b >>> 10);
      b = a + (g ^ c & (e ^ g)) + d[12] + 1804603682 & 4294967295;
      a = c + (b << 7 & 4294967295 | b >>> 25);
      b = g + (e ^ a & (c ^ e)) + d[13] + 4254626195 & 4294967295;
      g = a + (b << 12 & 4294967295 | b >>> 20);
      b = e + (c ^ g & (a ^ c)) + d[14] + 2792965006 & 4294967295;
      e = g + (b << 17 & 4294967295 | b >>> 15);
      b = c + (a ^ e & (g ^ a)) + d[15] + 1236535329 & 4294967295;
      c = e + (b << 22 & 4294967295 | b >>> 10);
      b = a + (e ^ g & (c ^ e)) + d[1] + 4129170786 & 4294967295;
      a = c + (b << 5 & 4294967295 | b >>> 27);
      b = g + (c ^ e & (a ^ c)) + d[6] + 3225465664 & 4294967295;
      g = a + (b << 9 & 4294967295 | b >>> 23);
      b = e + (a ^ c & (g ^ a)) + d[11] + 643717713 & 4294967295;
      e = g + (b << 14 & 4294967295 | b >>> 18);
      b = c + (g ^ a & (e ^ g)) + d[0] + 3921069994 & 4294967295;
      c = e + (b << 20 & 4294967295 | b >>> 12);
      b = a + (e ^ g & (c ^ e)) + d[5] + 3593408605 & 4294967295;
      a = c + (b << 5 & 4294967295 | b >>> 27);
      b = g + (c ^ e & (a ^ c)) + d[10] + 38016083 & 4294967295;
      g = a + (b << 9 & 4294967295 | b >>> 23);
      b = e + (a ^ c & (g ^ a)) + d[15] + 3634488961 & 4294967295;
      e = g + (b << 14 & 4294967295 | b >>> 18);
      b = c + (g ^ a & (e ^ g)) + d[4] + 3889429448 & 4294967295;
      c = e + (b << 20 & 4294967295 | b >>> 12);
      b = a + (e ^ g & (c ^ e)) + d[9] + 568446438 & 4294967295;
      a = c + (b << 5 & 4294967295 | b >>> 27);
      b = g + (c ^ e & (a ^ c)) + d[14] + 3275163606 & 4294967295;
      g = a + (b << 9 & 4294967295 | b >>> 23);
      b = e + (a ^ c & (g ^ a)) + d[3] + 4107603335 & 4294967295;
      e = g + (b << 14 & 4294967295 | b >>> 18);
      b = c + (g ^ a & (e ^ g)) + d[8] + 1163531501 & 4294967295;
      c = e + (b << 20 & 4294967295 | b >>> 12);
      b = a + (e ^ g & (c ^ e)) + d[13] + 2850285829 & 4294967295;
      a = c + (b << 5 & 4294967295 | b >>> 27);
      b = g + (c ^ e & (a ^ c)) + d[2] + 4243563512 & 4294967295;
      g = a + (b << 9 & 4294967295 | b >>> 23);
      b = e + (a ^ c & (g ^ a)) + d[7] + 1735328473 & 4294967295;
      e = g + (b << 14 & 4294967295 | b >>> 18);
      b = c + (g ^ a & (e ^ g)) + d[12] + 2368359562 & 4294967295;
      c = e + (b << 20 & 4294967295 | b >>> 12);
      b = a + (c ^ e ^ g) + d[5] + 4294588738 & 4294967295;
      a = c + (b << 4 & 4294967295 | b >>> 28);
      b = g + (a ^ c ^ e) + d[8] + 2272392833 & 4294967295;
      g = a + (b << 11 & 4294967295 | b >>> 21);
      b = e + (g ^ a ^ c) + d[11] + 1839030562 & 4294967295;
      e = g + (b << 16 & 4294967295 | b >>> 16);
      b = c + (e ^ g ^ a) + d[14] + 4259657740 & 4294967295;
      c = e + (b << 23 & 4294967295 | b >>> 9);
      b = a + (c ^ e ^ g) + d[1] + 2763975236 & 4294967295;
      a = c + (b << 4 & 4294967295 | b >>> 28);
      b = g + (a ^ c ^ e) + d[4] + 1272893353 & 4294967295;
      g = a + (b << 11 & 4294967295 | b >>> 21);
      b = e + (g ^ a ^ c) + d[7] + 4139469664 & 4294967295;
      e = g + (b << 16 & 4294967295 | b >>> 16);
      b = c + (e ^ g ^ a) + d[10] + 3200236656 & 4294967295;
      c = e + (b << 23 & 4294967295 | b >>> 9);
      b = a + (c ^ e ^ g) + d[13] + 681279174 & 4294967295;
      a = c + (b << 4 & 4294967295 | b >>> 28);
      b = g + (a ^ c ^ e) + d[0] + 3936430074 & 4294967295;
      g = a + (b << 11 & 4294967295 | b >>> 21);
      b = e + (g ^ a ^ c) + d[3] + 3572445317 & 4294967295;
      e = g + (b << 16 & 4294967295 | b >>> 16);
      b = c + (e ^ g ^ a) + d[6] + 76029189 & 4294967295;
      c = e + (b << 23 & 4294967295 | b >>> 9);
      b = a + (c ^ e ^ g) + d[9] + 3654602809 & 4294967295;
      a = c + (b << 4 & 4294967295 | b >>> 28);
      b = g + (a ^ c ^ e) + d[12] + 3873151461 & 4294967295;
      g = a + (b << 11 & 4294967295 | b >>> 21);
      b = e + (g ^ a ^ c) + d[15] + 530742520 & 4294967295;
      e = g + (b << 16 & 4294967295 | b >>> 16);
      b = c + (e ^ g ^ a) + d[2] + 3299628645 & 4294967295;
      c = e + (b << 23 & 4294967295 | b >>> 9);
      b = a + (e ^ (c | ~g)) + d[0] + 4096336452 & 4294967295;
      a = c + (b << 6 & 4294967295 | b >>> 26);
      b = g + (c ^ (a | ~e)) + d[7] + 1126891415 & 4294967295;
      g = a + (b << 10 & 4294967295 | b >>> 22);
      b = e + (a ^ (g | ~c)) + d[14] + 2878612391 & 4294967295;
      e = g + (b << 15 & 4294967295 | b >>> 17);
      b = c + (g ^ (e | ~a)) + d[5] + 4237533241 & 4294967295;
      c = e + (b << 21 & 4294967295 | b >>> 11);
      b = a + (e ^ (c | ~g)) + d[12] + 1700485571 & 4294967295;
      a = c + (b << 6 & 4294967295 | b >>> 26);
      b = g + (c ^ (a | ~e)) + d[3] + 2399980690 & 4294967295;
      g = a + (b << 10 & 4294967295 | b >>> 22);
      b = e + (a ^ (g | ~c)) + d[10] + 4293915773 & 4294967295;
      e = g + (b << 15 & 4294967295 | b >>> 17);
      b = c + (g ^ (e | ~a)) + d[1] + 2240044497 & 4294967295;
      c = e + (b << 21 & 4294967295 | b >>> 11);
      b = a + (e ^ (c | ~g)) + d[8] + 1873313359 & 4294967295;
      a = c + (b << 6 & 4294967295 | b >>> 26);
      b = g + (c ^ (a | ~e)) + d[15] + 4264355552 & 4294967295;
      g = a + (b << 10 & 4294967295 | b >>> 22);
      b = e + (a ^ (g | ~c)) + d[6] + 2734768916 & 4294967295;
      e = g + (b << 15 & 4294967295 | b >>> 17);
      b = c + (g ^ (e | ~a)) + d[13] + 1309151649 & 4294967295;
      c = e + (b << 21 & 4294967295 | b >>> 11);
      b = a + (e ^ (c | ~g)) + d[4] + 4149444226 & 4294967295;
      a = c + (b << 6 & 4294967295 | b >>> 26);
      b = g + (c ^ (a | ~e)) + d[11] + 3174756917 & 4294967295;
      g = a + (b << 10 & 4294967295 | b >>> 22);
      b = e + (a ^ (g | ~c)) + d[2] + 718787259 & 4294967295;
      e = g + (b << 15 & 4294967295 | b >>> 17);
      b = c + (g ^ (e | ~a)) + d[9] + 3951481745 & 4294967295;
      f.g[0] = f.g[0] + a & 4294967295;
      f.g[1] = f.g[1] + (e + (b << 21 & 4294967295 | b >>> 11)) & 4294967295;
      f.g[2] = f.g[2] + e & 4294967295;
      f.g[3] = f.g[3] + g & 4294967295;
    }
    m.prototype.u = function(f, a) {
      void 0 === a && (a = f.length);
      for (var c = a - this.blockSize, d = this.B, e = this.h, g = 0; g < a; ) {
        if (0 == e) for (; g <= c; ) n(this, f, g), g += this.blockSize;
        if ("string" === typeof f) for (; g < a; ) {
          if (d[e++] = f.charCodeAt(g++), e == this.blockSize) {
            n(this, d);
            e = 0;
            break;
          }
        }
        else for (; g < a; ) if (d[e++] = f[g++], e == this.blockSize) {
          n(this, d);
          e = 0;
          break;
        }
      }
      this.h = e;
      this.o += a;
    };
    m.prototype.v = function() {
      var f = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
      f[0] = 128;
      for (var a = 1; a < f.length - 8; ++a) f[a] = 0;
      var c = 8 * this.o;
      for (a = f.length - 8; a < f.length; ++a) f[a] = c & 255, c /= 256;
      this.u(f);
      f = Array(16);
      for (a = c = 0; 4 > a; ++a) for (var d = 0; 32 > d; d += 8) f[c++] = this.g[a] >>> d & 255;
      return f;
    };
    function p(f, a) {
      var c = q2;
      return Object.prototype.hasOwnProperty.call(c, f) ? c[f] : c[f] = a(f);
    }
    function t(f, a) {
      this.h = a;
      for (var c = [], d = true, e = f.length - 1; 0 <= e; e--) {
        var g = f[e] | 0;
        d && g == a || (c[e] = g, d = false);
      }
      this.g = c;
    }
    var q2 = {};
    function u(f) {
      return -128 <= f && 128 > f ? p(f, function(a) {
        return new t([a | 0], 0 > a ? -1 : 0);
      }) : new t([f | 0], 0 > f ? -1 : 0);
    }
    function v(f) {
      if (isNaN(f) || !isFinite(f)) return w;
      if (0 > f) return x2(v(-f));
      for (var a = [], c = 1, d = 0; f >= c; d++) a[d] = f / c | 0, c *= 4294967296;
      return new t(a, 0);
    }
    function y(f, a) {
      if (0 == f.length) throw Error("number format error: empty string");
      a = a || 10;
      if (2 > a || 36 < a) throw Error("radix out of range: " + a);
      if ("-" == f.charAt(0)) return x2(y(f.substring(1), a));
      if (0 <= f.indexOf("-")) throw Error('number format error: interior "-" character');
      for (var c = v(Math.pow(a, 8)), d = w, e = 0; e < f.length; e += 8) {
        var g = Math.min(8, f.length - e), b = parseInt(f.substring(e, e + g), a);
        8 > g ? (g = v(Math.pow(a, g)), d = d.j(g).add(v(b))) : (d = d.j(c), d = d.add(v(b)));
      }
      return d;
    }
    var w = u(0), z2 = u(1), A = u(16777216);
    h = t.prototype;
    h.m = function() {
      if (B2(this)) return -x2(this).m();
      for (var f = 0, a = 1, c = 0; c < this.g.length; c++) {
        var d = this.i(c);
        f += (0 <= d ? d : 4294967296 + d) * a;
        a *= 4294967296;
      }
      return f;
    };
    h.toString = function(f) {
      f = f || 10;
      if (2 > f || 36 < f) throw Error("radix out of range: " + f);
      if (C(this)) return "0";
      if (B2(this)) return "-" + x2(this).toString(f);
      for (var a = v(Math.pow(f, 6)), c = this, d = ""; ; ) {
        var e = D(c, a).g;
        c = F2(c, e.j(a));
        var g = ((0 < c.g.length ? c.g[0] : c.h) >>> 0).toString(f);
        c = e;
        if (C(c)) return g + d;
        for (; 6 > g.length; ) g = "0" + g;
        d = g + d;
      }
    };
    h.i = function(f) {
      return 0 > f ? 0 : f < this.g.length ? this.g[f] : this.h;
    };
    function C(f) {
      if (0 != f.h) return false;
      for (var a = 0; a < f.g.length; a++) if (0 != f.g[a]) return false;
      return true;
    }
    function B2(f) {
      return -1 == f.h;
    }
    h.l = function(f) {
      f = F2(this, f);
      return B2(f) ? -1 : C(f) ? 0 : 1;
    };
    function x2(f) {
      for (var a = f.g.length, c = [], d = 0; d < a; d++) c[d] = ~f.g[d];
      return new t(c, ~f.h).add(z2);
    }
    h.abs = function() {
      return B2(this) ? x2(this) : this;
    };
    h.add = function(f) {
      for (var a = Math.max(this.g.length, f.g.length), c = [], d = 0, e = 0; e <= a; e++) {
        var g = d + (this.i(e) & 65535) + (f.i(e) & 65535), b = (g >>> 16) + (this.i(e) >>> 16) + (f.i(e) >>> 16);
        d = b >>> 16;
        g &= 65535;
        b &= 65535;
        c[e] = b << 16 | g;
      }
      return new t(c, c[c.length - 1] & -2147483648 ? -1 : 0);
    };
    function F2(f, a) {
      return f.add(x2(a));
    }
    h.j = function(f) {
      if (C(this) || C(f)) return w;
      if (B2(this)) return B2(f) ? x2(this).j(x2(f)) : x2(x2(this).j(f));
      if (B2(f)) return x2(this.j(x2(f)));
      if (0 > this.l(A) && 0 > f.l(A)) return v(this.m() * f.m());
      for (var a = this.g.length + f.g.length, c = [], d = 0; d < 2 * a; d++) c[d] = 0;
      for (d = 0; d < this.g.length; d++) for (var e = 0; e < f.g.length; e++) {
        var g = this.i(d) >>> 16, b = this.i(d) & 65535, r = f.i(e) >>> 16, E = f.i(e) & 65535;
        c[2 * d + 2 * e] += b * E;
        G2(c, 2 * d + 2 * e);
        c[2 * d + 2 * e + 1] += g * E;
        G2(c, 2 * d + 2 * e + 1);
        c[2 * d + 2 * e + 1] += b * r;
        G2(c, 2 * d + 2 * e + 1);
        c[2 * d + 2 * e + 2] += g * r;
        G2(c, 2 * d + 2 * e + 2);
      }
      for (d = 0; d < a; d++) c[d] = c[2 * d + 1] << 16 | c[2 * d];
      for (d = a; d < 2 * a; d++) c[d] = 0;
      return new t(c, 0);
    };
    function G2(f, a) {
      for (; (f[a] & 65535) != f[a]; ) f[a + 1] += f[a] >>> 16, f[a] &= 65535, a++;
    }
    function H(f, a) {
      this.g = f;
      this.h = a;
    }
    function D(f, a) {
      if (C(a)) throw Error("division by zero");
      if (C(f)) return new H(w, w);
      if (B2(f)) return a = D(x2(f), a), new H(x2(a.g), x2(a.h));
      if (B2(a)) return a = D(f, x2(a)), new H(x2(a.g), a.h);
      if (30 < f.g.length) {
        if (B2(f) || B2(a)) throw Error("slowDivide_ only works with positive integers.");
        for (var c = z2, d = a; 0 >= d.l(f); ) c = I(c), d = I(d);
        var e = J2(c, 1), g = J2(d, 1);
        d = J2(d, 2);
        for (c = J2(c, 2); !C(d); ) {
          var b = g.add(d);
          0 >= b.l(f) && (e = e.add(c), g = b);
          d = J2(d, 1);
          c = J2(c, 1);
        }
        a = F2(f, e.j(a));
        return new H(e, a);
      }
      for (e = w; 0 <= f.l(a); ) {
        c = Math.max(1, Math.floor(f.m() / a.m()));
        d = Math.ceil(Math.log(c) / Math.LN2);
        d = 48 >= d ? 1 : Math.pow(2, d - 48);
        g = v(c);
        for (b = g.j(a); B2(b) || 0 < b.l(f); ) c -= d, g = v(c), b = g.j(a);
        C(g) && (g = z2);
        e = e.add(g);
        f = F2(f, b);
      }
      return new H(e, f);
    }
    h.A = function(f) {
      return D(this, f).h;
    };
    h.and = function(f) {
      for (var a = Math.max(this.g.length, f.g.length), c = [], d = 0; d < a; d++) c[d] = this.i(d) & f.i(d);
      return new t(c, this.h & f.h);
    };
    h.or = function(f) {
      for (var a = Math.max(this.g.length, f.g.length), c = [], d = 0; d < a; d++) c[d] = this.i(d) | f.i(d);
      return new t(c, this.h | f.h);
    };
    h.xor = function(f) {
      for (var a = Math.max(this.g.length, f.g.length), c = [], d = 0; d < a; d++) c[d] = this.i(d) ^ f.i(d);
      return new t(c, this.h ^ f.h);
    };
    function I(f) {
      for (var a = f.g.length + 1, c = [], d = 0; d < a; d++) c[d] = f.i(d) << 1 | f.i(d - 1) >>> 31;
      return new t(c, f.h);
    }
    function J2(f, a) {
      var c = a >> 5;
      a %= 32;
      for (var d = f.g.length - c, e = [], g = 0; g < d; g++) e[g] = 0 < a ? f.i(g + c) >>> a | f.i(g + c + 1) << 32 - a : f.i(g + c);
      return new t(e, f.h);
    }
    m.prototype.digest = m.prototype.v;
    m.prototype.reset = m.prototype.s;
    m.prototype.update = m.prototype.u;
    Md5 = bloom_blob_es2018.Md5 = m;
    t.prototype.add = t.prototype.add;
    t.prototype.multiply = t.prototype.j;
    t.prototype.modulo = t.prototype.A;
    t.prototype.compare = t.prototype.l;
    t.prototype.toNumber = t.prototype.m;
    t.prototype.toString = t.prototype.toString;
    t.prototype.getBits = t.prototype.i;
    t.fromNumber = v;
    t.fromString = y;
    Integer = bloom_blob_es2018.Integer = t;
  }).apply(typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  // node_modules/@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js
  var commonjsGlobal2 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var webchannel_blob_es2018 = {};
  var XhrIo;
  var FetchXmlHttpFactory;
  var WebChannel;
  var EventType;
  var ErrorCode;
  var Stat;
  var Event;
  var getStatEventTarget;
  var createWebChannelTransport;
  (function() {
    var h, aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
      if (a == Array.prototype || a == Object.prototype) return a;
      a[b] = c.value;
      return a;
    };
    function ba(a) {
      a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof commonjsGlobal2 && commonjsGlobal2];
      for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math) return c;
      }
      throw Error("Cannot find global object");
    }
    var ca = ba(this);
    function da(a, b) {
      if (b) a: {
        var c = ca;
        a = a.split(".");
        for (var d = 0; d < a.length - 1; d++) {
          var e = a[d];
          if (!(e in c)) break a;
          c = c[e];
        }
        a = a[a.length - 1];
        d = c[a];
        b = b(d);
        b != d && null != b && aa(c, a, { configurable: true, writable: true, value: b });
      }
    }
    function ea(a, b) {
      a instanceof String && (a += "");
      var c = 0, d = false, e = { next: function() {
        if (!d && c < a.length) {
          var f = c++;
          return { value: b(f, a[f]), done: false };
        }
        d = true;
        return { done: true, value: void 0 };
      } };
      e[Symbol.iterator] = function() {
        return e;
      };
      return e;
    }
    da("Array.prototype.values", function(a) {
      return a ? a : function() {
        return ea(this, function(b, c) {
          return c;
        });
      };
    });
    var fa = fa || {}, k2 = this || self;
    function ha(a) {
      var b = typeof a;
      b = "object" != b ? b : a ? Array.isArray(a) ? "array" : b : "null";
      return "array" == b || "object" == b && "number" == typeof a.length;
    }
    function n(a) {
      var b = typeof a;
      return "object" == b && null != a || "function" == b;
    }
    function ia(a, b, c) {
      return a.call.apply(a.bind, arguments);
    }
    function ja(a, b, c) {
      if (!a) throw Error();
      if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
          var e = Array.prototype.slice.call(arguments);
          Array.prototype.unshift.apply(e, d);
          return a.apply(b, e);
        };
      }
      return function() {
        return a.apply(b, arguments);
      };
    }
    function p(a, b, c) {
      p = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ia : ja;
      return p.apply(null, arguments);
    }
    function ka(a, b) {
      var c = Array.prototype.slice.call(arguments, 1);
      return function() {
        var d = c.slice();
        d.push.apply(d, arguments);
        return a.apply(this, d);
      };
    }
    function r(a, b) {
      function c() {
      }
      c.prototype = b.prototype;
      a.aa = b.prototype;
      a.prototype = new c();
      a.prototype.constructor = a;
      a.Qb = function(d, e, f) {
        for (var g = Array(arguments.length - 2), m = 2; m < arguments.length; m++) g[m - 2] = arguments[m];
        return b.prototype[e].apply(d, g);
      };
    }
    function la(a) {
      const b = a.length;
      if (0 < b) {
        const c = Array(b);
        for (let d = 0; d < b; d++) c[d] = a[d];
        return c;
      }
      return [];
    }
    function ma(a, b) {
      for (let c = 1; c < arguments.length; c++) {
        const d = arguments[c];
        if (ha(d)) {
          const e = a.length || 0, f = d.length || 0;
          a.length = e + f;
          for (let g = 0; g < f; g++) a[e + g] = d[g];
        } else a.push(d);
      }
    }
    class na {
      constructor(a, b) {
        this.i = a;
        this.j = b;
        this.h = 0;
        this.g = null;
      }
      get() {
        let a;
        0 < this.h ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
        return a;
      }
    }
    function t(a) {
      return /^[\s\xa0]*$/.test(a);
    }
    function u() {
      var a = k2.navigator;
      return a && (a = a.userAgent) ? a : "";
    }
    function oa(a) {
      oa[" "](a);
      return a;
    }
    oa[" "] = function() {
    };
    var pa = -1 != u().indexOf("Gecko") && !(-1 != u().toLowerCase().indexOf("webkit") && -1 == u().indexOf("Edge")) && !(-1 != u().indexOf("Trident") || -1 != u().indexOf("MSIE")) && -1 == u().indexOf("Edge");
    function qa(a, b, c) {
      for (const d in a) b.call(c, a[d], d, a);
    }
    function ra(a, b) {
      for (const c in a) b.call(void 0, a[c], c, a);
    }
    function sa(a) {
      const b = {};
      for (const c in a) b[c] = a[c];
      return b;
    }
    const ta = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
    function ua(a, b) {
      let c, d;
      for (let e = 1; e < arguments.length; e++) {
        d = arguments[e];
        for (c in d) a[c] = d[c];
        for (let f = 0; f < ta.length; f++) c = ta[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
      }
    }
    function va(a) {
      var b = 1;
      a = a.split(":");
      const c = [];
      for (; 0 < b && a.length; ) c.push(a.shift()), b--;
      a.length && c.push(a.join(":"));
      return c;
    }
    function wa(a) {
      k2.setTimeout(() => {
        throw a;
      }, 0);
    }
    function xa() {
      var a = za;
      let b = null;
      a.g && (b = a.g, a.g = a.g.next, a.g || (a.h = null), b.next = null);
      return b;
    }
    class Aa {
      constructor() {
        this.h = this.g = null;
      }
      add(a, b) {
        const c = Ba.get();
        c.set(a, b);
        this.h ? this.h.next = c : this.g = c;
        this.h = c;
      }
    }
    var Ba = new na(() => new Ca(), (a) => a.reset());
    class Ca {
      constructor() {
        this.next = this.g = this.h = null;
      }
      set(a, b) {
        this.h = a;
        this.g = b;
        this.next = null;
      }
      reset() {
        this.next = this.g = this.h = null;
      }
    }
    let x2, y = false, za = new Aa(), Ea = () => {
      const a = k2.Promise.resolve(void 0);
      x2 = () => {
        a.then(Da);
      };
    };
    var Da = () => {
      for (var a; a = xa(); ) {
        try {
          a.h.call(a.g);
        } catch (c) {
          wa(c);
        }
        var b = Ba;
        b.j(a);
        100 > b.h && (b.h++, a.next = b.g, b.g = a);
      }
      y = false;
    };
    function z2() {
      this.s = this.s;
      this.C = this.C;
    }
    z2.prototype.s = false;
    z2.prototype.ma = function() {
      this.s || (this.s = true, this.N());
    };
    z2.prototype.N = function() {
      if (this.C) for (; this.C.length; ) this.C.shift()();
    };
    function A(a, b) {
      this.type = a;
      this.g = this.target = b;
      this.defaultPrevented = false;
    }
    A.prototype.h = function() {
      this.defaultPrevented = true;
    };
    var Fa = (function() {
      if (!k2.addEventListener || !Object.defineProperty) return false;
      var a = false, b = Object.defineProperty({}, "passive", { get: function() {
        a = true;
      } });
      try {
        const c = () => {
        };
        k2.addEventListener("test", c, b);
        k2.removeEventListener("test", c, b);
      } catch (c) {
      }
      return a;
    })();
    function C(a, b) {
      A.call(this, a ? a.type : "");
      this.relatedTarget = this.g = this.target = null;
      this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
      this.key = "";
      this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
      this.state = null;
      this.pointerId = 0;
      this.pointerType = "";
      this.i = null;
      if (a) {
        var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
        this.target = a.target || a.srcElement;
        this.g = b;
        if (b = a.relatedTarget) {
          if (pa) {
            a: {
              try {
                oa(b.nodeName);
                var e = true;
                break a;
              } catch (f) {
              }
              e = false;
            }
            e || (b = null);
          }
        } else "mouseover" == c ? b = a.fromElement : "mouseout" == c && (b = a.toElement);
        this.relatedTarget = b;
        d ? (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
        this.button = a.button;
        this.key = a.key || "";
        this.ctrlKey = a.ctrlKey;
        this.altKey = a.altKey;
        this.shiftKey = a.shiftKey;
        this.metaKey = a.metaKey;
        this.pointerId = a.pointerId || 0;
        this.pointerType = "string" === typeof a.pointerType ? a.pointerType : Ga[a.pointerType] || "";
        this.state = a.state;
        this.i = a;
        a.defaultPrevented && C.aa.h.call(this);
      }
    }
    r(C, A);
    var Ga = { 2: "touch", 3: "pen", 4: "mouse" };
    C.prototype.h = function() {
      C.aa.h.call(this);
      var a = this.i;
      a.preventDefault ? a.preventDefault() : a.returnValue = false;
    };
    var D = "closure_listenable_" + (1e6 * Math.random() | 0);
    var Ha = 0;
    function Ia(a, b, c, d, e) {
      this.listener = a;
      this.proxy = null;
      this.src = b;
      this.type = c;
      this.capture = !!d;
      this.ha = e;
      this.key = ++Ha;
      this.da = this.fa = false;
    }
    function Ja(a) {
      a.da = true;
      a.listener = null;
      a.proxy = null;
      a.src = null;
      a.ha = null;
    }
    function Ka(a) {
      this.src = a;
      this.g = {};
      this.h = 0;
    }
    Ka.prototype.add = function(a, b, c, d, e) {
      var f = a.toString();
      a = this.g[f];
      a || (a = this.g[f] = [], this.h++);
      var g = La(a, b, d, e);
      -1 < g ? (b = a[g], c || (b.fa = false)) : (b = new Ia(b, this.src, f, !!d, e), b.fa = c, a.push(b));
      return b;
    };
    function Ma(a, b) {
      var c = b.type;
      if (c in a.g) {
        var d = a.g[c], e = Array.prototype.indexOf.call(d, b, void 0), f;
        (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
        f && (Ja(b), 0 == a.g[c].length && (delete a.g[c], a.h--));
      }
    }
    function La(a, b, c, d) {
      for (var e = 0; e < a.length; ++e) {
        var f = a[e];
        if (!f.da && f.listener == b && f.capture == !!c && f.ha == d) return e;
      }
      return -1;
    }
    var Na = "closure_lm_" + (1e6 * Math.random() | 0), Oa = {};
    function Qa(a, b, c, d, e) {
      if (d && d.once) return Ra(a, b, c, d, e);
      if (Array.isArray(b)) {
        for (var f = 0; f < b.length; f++) Qa(a, b[f], c, d, e);
        return null;
      }
      c = Sa(c);
      return a && a[D] ? a.K(b, c, n(d) ? !!d.capture : !!d, e) : Ta(a, b, c, false, d, e);
    }
    function Ta(a, b, c, d, e, f) {
      if (!b) throw Error("Invalid event type");
      var g = n(e) ? !!e.capture : !!e, m = Ua(a);
      m || (a[Na] = m = new Ka(a));
      c = m.add(b, c, d, g, f);
      if (c.proxy) return c;
      d = Va();
      c.proxy = d;
      d.src = a;
      d.listener = c;
      if (a.addEventListener) Fa || (e = g), void 0 === e && (e = false), a.addEventListener(b.toString(), d, e);
      else if (a.attachEvent) a.attachEvent(Wa(b.toString()), d);
      else if (a.addListener && a.removeListener) a.addListener(d);
      else throw Error("addEventListener and attachEvent are unavailable.");
      return c;
    }
    function Va() {
      function a(c) {
        return b.call(a.src, a.listener, c);
      }
      const b = Xa;
      return a;
    }
    function Ra(a, b, c, d, e) {
      if (Array.isArray(b)) {
        for (var f = 0; f < b.length; f++) Ra(a, b[f], c, d, e);
        return null;
      }
      c = Sa(c);
      return a && a[D] ? a.L(b, c, n(d) ? !!d.capture : !!d, e) : Ta(a, b, c, true, d, e);
    }
    function Ya(a, b, c, d, e) {
      if (Array.isArray(b)) for (var f = 0; f < b.length; f++) Ya(a, b[f], c, d, e);
      else (d = n(d) ? !!d.capture : !!d, c = Sa(c), a && a[D]) ? (a = a.i, b = String(b).toString(), b in a.g && (f = a.g[b], c = La(f, c, d, e), -1 < c && (Ja(f[c]), Array.prototype.splice.call(f, c, 1), 0 == f.length && (delete a.g[b], a.h--)))) : a && (a = Ua(a)) && (b = a.g[b.toString()], a = -1, b && (a = La(b, c, d, e)), (c = -1 < a ? b[a] : null) && Za(c));
    }
    function Za(a) {
      if ("number" !== typeof a && a && !a.da) {
        var b = a.src;
        if (b && b[D]) Ma(b.i, a);
        else {
          var c = a.type, d = a.proxy;
          b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(Wa(c), d) : b.addListener && b.removeListener && b.removeListener(d);
          (c = Ua(b)) ? (Ma(c, a), 0 == c.h && (c.src = null, b[Na] = null)) : Ja(a);
        }
      }
    }
    function Wa(a) {
      return a in Oa ? Oa[a] : Oa[a] = "on" + a;
    }
    function Xa(a, b) {
      if (a.da) a = true;
      else {
        b = new C(b, this);
        var c = a.listener, d = a.ha || a.src;
        a.fa && Za(a);
        a = c.call(d, b);
      }
      return a;
    }
    function Ua(a) {
      a = a[Na];
      return a instanceof Ka ? a : null;
    }
    var $a = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
    function Sa(a) {
      if ("function" === typeof a) return a;
      a[$a] || (a[$a] = function(b) {
        return a.handleEvent(b);
      });
      return a[$a];
    }
    function E() {
      z2.call(this);
      this.i = new Ka(this);
      this.M = this;
      this.F = null;
    }
    r(E, z2);
    E.prototype[D] = true;
    E.prototype.removeEventListener = function(a, b, c, d) {
      Ya(this, a, b, c, d);
    };
    function F2(a, b) {
      var c, d = a.F;
      if (d) for (c = []; d; d = d.F) c.push(d);
      a = a.M;
      d = b.type || b;
      if ("string" === typeof b) b = new A(b, a);
      else if (b instanceof A) b.target = b.target || a;
      else {
        var e = b;
        b = new A(d, a);
        ua(b, e);
      }
      e = true;
      if (c) for (var f = c.length - 1; 0 <= f; f--) {
        var g = b.g = c[f];
        e = ab(g, d, true, b) && e;
      }
      g = b.g = a;
      e = ab(g, d, true, b) && e;
      e = ab(g, d, false, b) && e;
      if (c) for (f = 0; f < c.length; f++) g = b.g = c[f], e = ab(g, d, false, b) && e;
    }
    E.prototype.N = function() {
      E.aa.N.call(this);
      if (this.i) {
        var a = this.i, c;
        for (c in a.g) {
          for (var d = a.g[c], e = 0; e < d.length; e++) Ja(d[e]);
          delete a.g[c];
          a.h--;
        }
      }
      this.F = null;
    };
    E.prototype.K = function(a, b, c, d) {
      return this.i.add(String(a), b, false, c, d);
    };
    E.prototype.L = function(a, b, c, d) {
      return this.i.add(String(a), b, true, c, d);
    };
    function ab(a, b, c, d) {
      b = a.i.g[String(b)];
      if (!b) return true;
      b = b.concat();
      for (var e = true, f = 0; f < b.length; ++f) {
        var g = b[f];
        if (g && !g.da && g.capture == c) {
          var m = g.listener, q2 = g.ha || g.src;
          g.fa && Ma(a.i, g);
          e = false !== m.call(q2, d) && e;
        }
      }
      return e && !d.defaultPrevented;
    }
    function bb(a, b, c) {
      if ("function" === typeof a) c && (a = p(a, c));
      else if (a && "function" == typeof a.handleEvent) a = p(a.handleEvent, a);
      else throw Error("Invalid listener argument");
      return 2147483647 < Number(b) ? -1 : k2.setTimeout(a, b || 0);
    }
    function cb(a) {
      a.g = bb(() => {
        a.g = null;
        a.i && (a.i = false, cb(a));
      }, a.l);
      const b = a.h;
      a.h = null;
      a.m.apply(null, b);
    }
    class eb extends z2 {
      constructor(a, b) {
        super();
        this.m = a;
        this.l = b;
        this.h = null;
        this.i = false;
        this.g = null;
      }
      j(a) {
        this.h = arguments;
        this.g ? this.i = true : cb(this);
      }
      N() {
        super.N();
        this.g && (k2.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
      }
    }
    function G2(a) {
      z2.call(this);
      this.h = a;
      this.g = {};
    }
    r(G2, z2);
    var fb = [];
    function gb(a) {
      qa(a.g, function(b, c) {
        this.g.hasOwnProperty(c) && Za(b);
      }, a);
      a.g = {};
    }
    G2.prototype.N = function() {
      G2.aa.N.call(this);
      gb(this);
    };
    G2.prototype.handleEvent = function() {
      throw Error("EventHandler.handleEvent not implemented");
    };
    var hb = k2.JSON.stringify;
    var ib = k2.JSON.parse;
    var jb = class {
      stringify(a) {
        return k2.JSON.stringify(a, void 0);
      }
      parse(a) {
        return k2.JSON.parse(a, void 0);
      }
    };
    function kb() {
    }
    kb.prototype.h = null;
    function lb(a) {
      return a.h || (a.h = a.i());
    }
    function mb() {
    }
    var H = { OPEN: "a", kb: "b", Ja: "c", wb: "d" };
    function nb() {
      A.call(this, "d");
    }
    r(nb, A);
    function ob() {
      A.call(this, "c");
    }
    r(ob, A);
    var I = {}, pb = null;
    function qb() {
      return pb = pb || new E();
    }
    I.La = "serverreachability";
    function rb(a) {
      A.call(this, I.La, a);
    }
    r(rb, A);
    function J2(a) {
      const b = qb();
      F2(b, new rb(b));
    }
    I.STAT_EVENT = "statevent";
    function sb(a, b) {
      A.call(this, I.STAT_EVENT, a);
      this.stat = b;
    }
    r(sb, A);
    function K(a) {
      const b = qb();
      F2(b, new sb(b, a));
    }
    I.Ma = "timingevent";
    function tb(a, b) {
      A.call(this, I.Ma, a);
      this.size = b;
    }
    r(tb, A);
    function ub(a, b) {
      if ("function" !== typeof a) throw Error("Fn must not be null and must be a function");
      return k2.setTimeout(function() {
        a();
      }, b);
    }
    function vb() {
      this.g = true;
    }
    vb.prototype.xa = function() {
      this.g = false;
    };
    function wb(a, b, c, d, e, f) {
      a.info(function() {
        if (a.g) if (f) {
          var g = "";
          for (var m = f.split("&"), q2 = 0; q2 < m.length; q2++) {
            var l = m[q2].split("=");
            if (1 < l.length) {
              var v = l[0];
              l = l[1];
              var w = v.split("_");
              g = 2 <= w.length && "type" == w[1] ? g + (v + "=" + l + "&") : g + (v + "=redacted&");
            }
          }
        } else g = null;
        else g = f;
        return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + g;
      });
    }
    function xb(a, b, c, d, e, f, g) {
      a.info(function() {
        return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f + " " + g;
      });
    }
    function L2(a, b, c, d) {
      a.info(function() {
        return "XMLHTTP TEXT (" + b + "): " + yb(a, c) + (d ? " " + d : "");
      });
    }
    function zb(a, b) {
      a.info(function() {
        return "TIMEOUT: " + b;
      });
    }
    vb.prototype.info = function() {
    };
    function yb(a, b) {
      if (!a.g) return b;
      if (!b) return null;
      try {
        var c = JSON.parse(b);
        if (c) {
          for (a = 0; a < c.length; a++) if (Array.isArray(c[a])) {
            var d = c[a];
            if (!(2 > d.length)) {
              var e = d[1];
              if (Array.isArray(e) && !(1 > e.length)) {
                var f = e[0];
                if ("noop" != f && "stop" != f && "close" != f) for (var g = 1; g < e.length; g++) e[g] = "";
              }
            }
          }
        }
        return hb(c);
      } catch (m) {
        return b;
      }
    }
    var Ab = { NO_ERROR: 0, gb: 1, tb: 2, sb: 3, nb: 4, rb: 5, ub: 6, Ia: 7, TIMEOUT: 8, xb: 9 };
    var Bb = { lb: "complete", Hb: "success", Ja: "error", Ia: "abort", zb: "ready", Ab: "readystatechange", TIMEOUT: "timeout", vb: "incrementaldata", yb: "progress", ob: "downloadprogress", Pb: "uploadprogress" };
    var Cb;
    function Db() {
    }
    r(Db, kb);
    Db.prototype.g = function() {
      return new XMLHttpRequest();
    };
    Db.prototype.i = function() {
      return {};
    };
    Cb = new Db();
    function M2(a, b, c, d) {
      this.j = a;
      this.i = b;
      this.l = c;
      this.R = d || 1;
      this.U = new G2(this);
      this.I = 45e3;
      this.H = null;
      this.o = false;
      this.m = this.A = this.v = this.L = this.F = this.S = this.B = null;
      this.D = [];
      this.g = null;
      this.C = 0;
      this.s = this.u = null;
      this.X = -1;
      this.J = false;
      this.O = 0;
      this.M = null;
      this.W = this.K = this.T = this.P = false;
      this.h = new Eb();
    }
    function Eb() {
      this.i = null;
      this.g = "";
      this.h = false;
    }
    var Fb = {}, Gb = {};
    function Hb(a, b, c) {
      a.L = 1;
      a.v = Ib(N2(b));
      a.m = c;
      a.P = true;
      Jb(a, null);
    }
    function Jb(a, b) {
      a.F = Date.now();
      Kb(a);
      a.A = N2(a.v);
      var c = a.A, d = a.R;
      Array.isArray(d) || (d = [String(d)]);
      Lb(c.i, "t", d);
      a.C = 0;
      c = a.j.J;
      a.h = new Eb();
      a.g = Mb(a.j, c ? b : null, !a.m);
      0 < a.O && (a.M = new eb(p(a.Y, a, a.g), a.O));
      b = a.U;
      c = a.g;
      d = a.ca;
      var e = "readystatechange";
      Array.isArray(e) || (e && (fb[0] = e.toString()), e = fb);
      for (var f = 0; f < e.length; f++) {
        var g = Qa(c, e[f], d || b.handleEvent, false, b.h || b);
        if (!g) break;
        b.g[g.key] = g;
      }
      b = a.H ? sa(a.H) : {};
      a.m ? (a.u || (a.u = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.g.ea(
        a.A,
        a.u,
        a.m,
        b
      )) : (a.u = "GET", a.g.ea(a.A, a.u, null, b));
      J2();
      wb(a.i, a.u, a.A, a.l, a.R, a.m);
    }
    M2.prototype.ca = function(a) {
      a = a.target;
      const b = this.M;
      b && 3 == P(a) ? b.j() : this.Y(a);
    };
    M2.prototype.Y = function(a) {
      try {
        if (a == this.g) a: {
          const w = P(this.g);
          var b = this.g.Ba();
          const O2 = this.g.Z();
          if (!(3 > w) && (3 != w || this.g && (this.h.h || this.g.oa() || Nb(this.g)))) {
            this.J || 4 != w || 7 == b || (8 == b || 0 >= O2 ? J2(3) : J2(2));
            Ob(this);
            var c = this.g.Z();
            this.X = c;
            b: if (Pb(this)) {
              var d = Nb(this.g);
              a = "";
              var e = d.length, f = 4 == P(this.g);
              if (!this.h.i) {
                if ("undefined" === typeof TextDecoder) {
                  Q2(this);
                  Qb(this);
                  var g = "";
                  break b;
                }
                this.h.i = new k2.TextDecoder();
              }
              for (b = 0; b < e; b++) this.h.h = true, a += this.h.i.decode(d[b], { stream: !(f && b == e - 1) });
              d.length = 0;
              this.h.g += a;
              this.C = 0;
              g = this.h.g;
            } else g = this.g.oa();
            this.o = 200 == c;
            xb(this.i, this.u, this.A, this.l, this.R, w, c);
            if (this.o) {
              if (this.T && !this.K) {
                b: {
                  if (this.g) {
                    var m, q2 = this.g;
                    if ((m = q2.g ? q2.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !t(m)) {
                      var l = m;
                      break b;
                    }
                  }
                  l = null;
                }
                if (c = l) L2(this.i, this.l, c, "Initial handshake response via X-HTTP-Initial-Response"), this.K = true, Rb(this, c);
                else {
                  this.o = false;
                  this.s = 3;
                  K(12);
                  Q2(this);
                  Qb(this);
                  break a;
                }
              }
              if (this.P) {
                c = true;
                let B2;
                for (; !this.J && this.C < g.length; ) if (B2 = Sb(this, g), B2 == Gb) {
                  4 == w && (this.s = 4, K(14), c = false);
                  L2(this.i, this.l, null, "[Incomplete Response]");
                  break;
                } else if (B2 == Fb) {
                  this.s = 4;
                  K(15);
                  L2(this.i, this.l, g, "[Invalid Chunk]");
                  c = false;
                  break;
                } else L2(this.i, this.l, B2, null), Rb(this, B2);
                Pb(this) && 0 != this.C && (this.h.g = this.h.g.slice(this.C), this.C = 0);
                4 != w || 0 != g.length || this.h.h || (this.s = 1, K(16), c = false);
                this.o = this.o && c;
                if (!c) L2(this.i, this.l, g, "[Invalid Chunked Response]"), Q2(this), Qb(this);
                else if (0 < g.length && !this.W) {
                  this.W = true;
                  var v = this.j;
                  v.g == this && v.ba && !v.M && (v.j.info("Great, no buffering proxy detected. Bytes received: " + g.length), Tb(v), v.M = true, K(11));
                }
              } else L2(this.i, this.l, g, null), Rb(this, g);
              4 == w && Q2(this);
              this.o && !this.J && (4 == w ? Ub(this.j, this) : (this.o = false, Kb(this)));
            } else Vb(this.g), 400 == c && 0 < g.indexOf("Unknown SID") ? (this.s = 3, K(12)) : (this.s = 0, K(13)), Q2(this), Qb(this);
          }
        }
      } catch (w) {
      } finally {
      }
    };
    function Pb(a) {
      return a.g ? "GET" == a.u && 2 != a.L && a.j.Ca : false;
    }
    function Sb(a, b) {
      var c = a.C, d = b.indexOf("\n", c);
      if (-1 == d) return Gb;
      c = Number(b.substring(c, d));
      if (isNaN(c)) return Fb;
      d += 1;
      if (d + c > b.length) return Gb;
      b = b.slice(d, d + c);
      a.C = d + c;
      return b;
    }
    M2.prototype.cancel = function() {
      this.J = true;
      Q2(this);
    };
    function Kb(a) {
      a.S = Date.now() + a.I;
      Wb(a, a.I);
    }
    function Wb(a, b) {
      if (null != a.B) throw Error("WatchDog timer not null");
      a.B = ub(p(a.ba, a), b);
    }
    function Ob(a) {
      a.B && (k2.clearTimeout(a.B), a.B = null);
    }
    M2.prototype.ba = function() {
      this.B = null;
      const a = Date.now();
      0 <= a - this.S ? (zb(this.i, this.A), 2 != this.L && (J2(), K(17)), Q2(this), this.s = 2, Qb(this)) : Wb(this, this.S - a);
    };
    function Qb(a) {
      0 == a.j.G || a.J || Ub(a.j, a);
    }
    function Q2(a) {
      Ob(a);
      var b = a.M;
      b && "function" == typeof b.ma && b.ma();
      a.M = null;
      gb(a.U);
      a.g && (b = a.g, a.g = null, b.abort(), b.ma());
    }
    function Rb(a, b) {
      try {
        var c = a.j;
        if (0 != c.G && (c.g == a || Xb(c.h, a))) {
          if (!a.K && Xb(c.h, a) && 3 == c.G) {
            try {
              var d = c.Da.g.parse(b);
            } catch (l) {
              d = null;
            }
            if (Array.isArray(d) && 3 == d.length) {
              var e = d;
              if (0 == e[0]) a: {
                if (!c.u) {
                  if (c.g) if (c.g.F + 3e3 < a.F) Yb(c), Zb(c);
                  else break a;
                  $b(c);
                  K(18);
                }
              }
              else c.za = e[1], 0 < c.za - c.T && 37500 > e[2] && c.F && 0 == c.v && !c.C && (c.C = ub(p(c.Za, c), 6e3));
              if (1 >= ac(c.h) && c.ca) {
                try {
                  c.ca();
                } catch (l) {
                }
                c.ca = void 0;
              }
            } else R(c, 11);
          } else if ((a.K || c.g == a) && Yb(c), !t(b)) for (e = c.Da.g.parse(b), b = 0; b < e.length; b++) {
            let l = e[b];
            c.T = l[0];
            l = l[1];
            if (2 == c.G) if ("c" == l[0]) {
              c.K = l[1];
              c.ia = l[2];
              const v = l[3];
              null != v && (c.la = v, c.j.info("VER=" + c.la));
              const w = l[4];
              null != w && (c.Aa = w, c.j.info("SVER=" + c.Aa));
              const O2 = l[5];
              null != O2 && "number" === typeof O2 && 0 < O2 && (d = 1.5 * O2, c.L = d, c.j.info("backChannelRequestTimeoutMs_=" + d));
              d = c;
              const B2 = a.g;
              if (B2) {
                const ya = B2.g ? B2.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                if (ya) {
                  var f = d.h;
                  f.g || -1 == ya.indexOf("spdy") && -1 == ya.indexOf("quic") && -1 == ya.indexOf("h2") || (f.j = f.l, f.g = /* @__PURE__ */ new Set(), f.h && (bc(f, f.h), f.h = null));
                }
                if (d.D) {
                  const db2 = B2.g ? B2.g.getResponseHeader("X-HTTP-Session-Id") : null;
                  db2 && (d.ya = db2, S(d.I, d.D, db2));
                }
              }
              c.G = 3;
              c.l && c.l.ua();
              c.ba && (c.R = Date.now() - a.F, c.j.info("Handshake RTT: " + c.R + "ms"));
              d = c;
              var g = a;
              d.qa = cc(d, d.J ? d.ia : null, d.W);
              if (g.K) {
                dc(d.h, g);
                var m = g, q2 = d.L;
                q2 && (m.I = q2);
                m.B && (Ob(m), Kb(m));
                d.g = g;
              } else ec(d);
              0 < c.i.length && fc(c);
            } else "stop" != l[0] && "close" != l[0] || R(c, 7);
            else 3 == c.G && ("stop" == l[0] || "close" == l[0] ? "stop" == l[0] ? R(c, 7) : gc(c) : "noop" != l[0] && c.l && c.l.ta(l), c.v = 0);
          }
        }
        J2(4);
      } catch (l) {
      }
    }
    var hc = class {
      constructor(a, b) {
        this.g = a;
        this.map = b;
      }
    };
    function ic(a) {
      this.l = a || 10;
      k2.PerformanceNavigationTiming ? (a = k2.performance.getEntriesByType("navigation"), a = 0 < a.length && ("hq" == a[0].nextHopProtocol || "h2" == a[0].nextHopProtocol)) : a = !!(k2.chrome && k2.chrome.loadTimes && k2.chrome.loadTimes() && k2.chrome.loadTimes().wasFetchedViaSpdy);
      this.j = a ? this.l : 1;
      this.g = null;
      1 < this.j && (this.g = /* @__PURE__ */ new Set());
      this.h = null;
      this.i = [];
    }
    function jc(a) {
      return a.h ? true : a.g ? a.g.size >= a.j : false;
    }
    function ac(a) {
      return a.h ? 1 : a.g ? a.g.size : 0;
    }
    function Xb(a, b) {
      return a.h ? a.h == b : a.g ? a.g.has(b) : false;
    }
    function bc(a, b) {
      a.g ? a.g.add(b) : a.h = b;
    }
    function dc(a, b) {
      a.h && a.h == b ? a.h = null : a.g && a.g.has(b) && a.g.delete(b);
    }
    ic.prototype.cancel = function() {
      this.i = kc(this);
      if (this.h) this.h.cancel(), this.h = null;
      else if (this.g && 0 !== this.g.size) {
        for (const a of this.g.values()) a.cancel();
        this.g.clear();
      }
    };
    function kc(a) {
      if (null != a.h) return a.i.concat(a.h.D);
      if (null != a.g && 0 !== a.g.size) {
        let b = a.i;
        for (const c of a.g.values()) b = b.concat(c.D);
        return b;
      }
      return la(a.i);
    }
    function lc(a) {
      if (a.V && "function" == typeof a.V) return a.V();
      if ("undefined" !== typeof Map && a instanceof Map || "undefined" !== typeof Set && a instanceof Set) return Array.from(a.values());
      if ("string" === typeof a) return a.split("");
      if (ha(a)) {
        for (var b = [], c = a.length, d = 0; d < c; d++) b.push(a[d]);
        return b;
      }
      b = [];
      c = 0;
      for (d in a) b[c++] = a[d];
      return b;
    }
    function mc(a) {
      if (a.na && "function" == typeof a.na) return a.na();
      if (!a.V || "function" != typeof a.V) {
        if ("undefined" !== typeof Map && a instanceof Map) return Array.from(a.keys());
        if (!("undefined" !== typeof Set && a instanceof Set)) {
          if (ha(a) || "string" === typeof a) {
            var b = [];
            a = a.length;
            for (var c = 0; c < a; c++) b.push(c);
            return b;
          }
          b = [];
          c = 0;
          for (const d in a) b[c++] = d;
          return b;
        }
      }
    }
    function nc(a, b) {
      if (a.forEach && "function" == typeof a.forEach) a.forEach(b, void 0);
      else if (ha(a) || "string" === typeof a) Array.prototype.forEach.call(a, b, void 0);
      else for (var c = mc(a), d = lc(a), e = d.length, f = 0; f < e; f++) b.call(void 0, d[f], c && c[f], a);
    }
    var oc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
    function pc(a, b) {
      if (a) {
        a = a.split("&");
        for (var c = 0; c < a.length; c++) {
          var d = a[c].indexOf("="), e = null;
          if (0 <= d) {
            var f = a[c].substring(0, d);
            e = a[c].substring(d + 1);
          } else f = a[c];
          b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
        }
      }
    }
    function T(a) {
      this.g = this.o = this.j = "";
      this.s = null;
      this.m = this.l = "";
      this.h = false;
      if (a instanceof T) {
        this.h = a.h;
        qc(this, a.j);
        this.o = a.o;
        this.g = a.g;
        rc(this, a.s);
        this.l = a.l;
        var b = a.i;
        var c = new sc();
        c.i = b.i;
        b.g && (c.g = new Map(b.g), c.h = b.h);
        tc(this, c);
        this.m = a.m;
      } else a && (b = String(a).match(oc)) ? (this.h = false, qc(this, b[1] || "", true), this.o = uc(b[2] || ""), this.g = uc(b[3] || "", true), rc(this, b[4]), this.l = uc(b[5] || "", true), tc(this, b[6] || "", true), this.m = uc(b[7] || "")) : (this.h = false, this.i = new sc(null, this.h));
    }
    T.prototype.toString = function() {
      var a = [], b = this.j;
      b && a.push(vc(b, wc, true), ":");
      var c = this.g;
      if (c || "file" == b) a.push("//"), (b = this.o) && a.push(vc(b, wc, true), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.s, null != c && a.push(":", String(c));
      if (c = this.l) this.g && "/" != c.charAt(0) && a.push("/"), a.push(vc(c, "/" == c.charAt(0) ? xc : yc, true));
      (c = this.i.toString()) && a.push("?", c);
      (c = this.m) && a.push("#", vc(c, zc));
      return a.join("");
    };
    function N2(a) {
      return new T(a);
    }
    function qc(a, b, c) {
      a.j = c ? uc(b, true) : b;
      a.j && (a.j = a.j.replace(/:$/, ""));
    }
    function rc(a, b) {
      if (b) {
        b = Number(b);
        if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);
        a.s = b;
      } else a.s = null;
    }
    function tc(a, b, c) {
      b instanceof sc ? (a.i = b, Ac(a.i, a.h)) : (c || (b = vc(b, Bc)), a.i = new sc(b, a.h));
    }
    function S(a, b, c) {
      a.i.set(b, c);
    }
    function Ib(a) {
      S(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
      return a;
    }
    function uc(a, b) {
      return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
    }
    function vc(a, b, c) {
      return "string" === typeof a ? (a = encodeURI(a).replace(b, Cc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
    }
    function Cc(a) {
      a = a.charCodeAt(0);
      return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
    }
    var wc = /[#\/\?@]/g, yc = /[#\?:]/g, xc = /[#\?]/g, Bc = /[#\?@]/g, zc = /#/g;
    function sc(a, b) {
      this.h = this.g = null;
      this.i = a || null;
      this.j = !!b;
    }
    function U(a) {
      a.g || (a.g = /* @__PURE__ */ new Map(), a.h = 0, a.i && pc(a.i, function(b, c) {
        a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
      }));
    }
    h = sc.prototype;
    h.add = function(a, b) {
      U(this);
      this.i = null;
      a = V(this, a);
      var c = this.g.get(a);
      c || this.g.set(a, c = []);
      c.push(b);
      this.h += 1;
      return this;
    };
    function Dc(a, b) {
      U(a);
      b = V(a, b);
      a.g.has(b) && (a.i = null, a.h -= a.g.get(b).length, a.g.delete(b));
    }
    function Ec(a, b) {
      U(a);
      b = V(a, b);
      return a.g.has(b);
    }
    h.forEach = function(a, b) {
      U(this);
      this.g.forEach(function(c, d) {
        c.forEach(function(e) {
          a.call(b, e, d, this);
        }, this);
      }, this);
    };
    h.na = function() {
      U(this);
      const a = Array.from(this.g.values()), b = Array.from(this.g.keys()), c = [];
      for (let d = 0; d < b.length; d++) {
        const e = a[d];
        for (let f = 0; f < e.length; f++) c.push(b[d]);
      }
      return c;
    };
    h.V = function(a) {
      U(this);
      let b = [];
      if ("string" === typeof a) Ec(this, a) && (b = b.concat(this.g.get(V(this, a))));
      else {
        a = Array.from(this.g.values());
        for (let c = 0; c < a.length; c++) b = b.concat(a[c]);
      }
      return b;
    };
    h.set = function(a, b) {
      U(this);
      this.i = null;
      a = V(this, a);
      Ec(this, a) && (this.h -= this.g.get(a).length);
      this.g.set(a, [b]);
      this.h += 1;
      return this;
    };
    h.get = function(a, b) {
      if (!a) return b;
      a = this.V(a);
      return 0 < a.length ? String(a[0]) : b;
    };
    function Lb(a, b, c) {
      Dc(a, b);
      0 < c.length && (a.i = null, a.g.set(V(a, b), la(c)), a.h += c.length);
    }
    h.toString = function() {
      if (this.i) return this.i;
      if (!this.g) return "";
      const a = [], b = Array.from(this.g.keys());
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        const f = encodeURIComponent(String(d)), g = this.V(d);
        for (d = 0; d < g.length; d++) {
          var e = f;
          "" !== g[d] && (e += "=" + encodeURIComponent(String(g[d])));
          a.push(e);
        }
      }
      return this.i = a.join("&");
    };
    function V(a, b) {
      b = String(b);
      a.j && (b = b.toLowerCase());
      return b;
    }
    function Ac(a, b) {
      b && !a.j && (U(a), a.i = null, a.g.forEach(function(c, d) {
        var e = d.toLowerCase();
        d != e && (Dc(this, d), Lb(this, e, c));
      }, a));
      a.j = b;
    }
    function Fc(a, b) {
      const c = new vb();
      if (k2.Image) {
        const d = new Image();
        d.onload = ka(W, c, "TestLoadImage: loaded", true, b, d);
        d.onerror = ka(W, c, "TestLoadImage: error", false, b, d);
        d.onabort = ka(W, c, "TestLoadImage: abort", false, b, d);
        d.ontimeout = ka(W, c, "TestLoadImage: timeout", false, b, d);
        k2.setTimeout(function() {
          if (d.ontimeout) d.ontimeout();
        }, 1e4);
        d.src = a;
      } else b(false);
    }
    function Gc(a, b) {
      const c = new vb(), d = new AbortController(), e = setTimeout(() => {
        d.abort();
        W(c, "TestPingServer: timeout", false, b);
      }, 1e4);
      fetch(a, { signal: d.signal }).then((f) => {
        clearTimeout(e);
        f.ok ? W(c, "TestPingServer: ok", true, b) : W(c, "TestPingServer: server error", false, b);
      }).catch(() => {
        clearTimeout(e);
        W(c, "TestPingServer: error", false, b);
      });
    }
    function W(a, b, c, d, e) {
      try {
        e && (e.onload = null, e.onerror = null, e.onabort = null, e.ontimeout = null), d(c);
      } catch (f) {
      }
    }
    function Hc() {
      this.g = new jb();
    }
    function Ic(a, b, c) {
      const d = c || "";
      try {
        nc(a, function(e, f) {
          let g = e;
          n(e) && (g = hb(e));
          b.push(d + f + "=" + encodeURIComponent(g));
        });
      } catch (e) {
        throw b.push(d + "type=" + encodeURIComponent("_badmap")), e;
      }
    }
    function Jc(a) {
      this.l = a.Ub || null;
      this.j = a.eb || false;
    }
    r(Jc, kb);
    Jc.prototype.g = function() {
      return new Kc(this.l, this.j);
    };
    Jc.prototype.i = /* @__PURE__ */ (function(a) {
      return function() {
        return a;
      };
    })({});
    function Kc(a, b) {
      E.call(this);
      this.D = a;
      this.o = b;
      this.m = void 0;
      this.status = this.readyState = 0;
      this.responseType = this.responseText = this.response = this.statusText = "";
      this.onreadystatechange = null;
      this.u = new Headers();
      this.h = null;
      this.B = "GET";
      this.A = "";
      this.g = false;
      this.v = this.j = this.l = null;
    }
    r(Kc, E);
    h = Kc.prototype;
    h.open = function(a, b) {
      if (0 != this.readyState) throw this.abort(), Error("Error reopening a connection");
      this.B = a;
      this.A = b;
      this.readyState = 1;
      Lc(this);
    };
    h.send = function(a) {
      if (1 != this.readyState) throw this.abort(), Error("need to call open() first. ");
      this.g = true;
      const b = { headers: this.u, method: this.B, credentials: this.m, cache: void 0 };
      a && (b.body = a);
      (this.D || k2).fetch(new Request(this.A, b)).then(this.Sa.bind(this), this.ga.bind(this));
    };
    h.abort = function() {
      this.response = this.responseText = "";
      this.u = new Headers();
      this.status = 0;
      this.j && this.j.cancel("Request was aborted.").catch(() => {
      });
      1 <= this.readyState && this.g && 4 != this.readyState && (this.g = false, Mc(this));
      this.readyState = 0;
    };
    h.Sa = function(a) {
      if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, Lc(this)), this.g && (this.readyState = 3, Lc(this), this.g))) if ("arraybuffer" === this.responseType) a.arrayBuffer().then(this.Qa.bind(this), this.ga.bind(this));
      else if ("undefined" !== typeof k2.ReadableStream && "body" in a) {
        this.j = a.body.getReader();
        if (this.o) {
          if (this.responseType) throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
          this.response = [];
        } else this.response = this.responseText = "", this.v = new TextDecoder();
        Nc(this);
      } else a.text().then(this.Ra.bind(this), this.ga.bind(this));
    };
    function Nc(a) {
      a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a));
    }
    h.Pa = function(a) {
      if (this.g) {
        if (this.o && a.value) this.response.push(a.value);
        else if (!this.o) {
          var b = a.value ? a.value : new Uint8Array(0);
          if (b = this.v.decode(b, { stream: !a.done })) this.response = this.responseText += b;
        }
        a.done ? Mc(this) : Lc(this);
        3 == this.readyState && Nc(this);
      }
    };
    h.Ra = function(a) {
      this.g && (this.response = this.responseText = a, Mc(this));
    };
    h.Qa = function(a) {
      this.g && (this.response = a, Mc(this));
    };
    h.ga = function() {
      this.g && Mc(this);
    };
    function Mc(a) {
      a.readyState = 4;
      a.l = null;
      a.j = null;
      a.v = null;
      Lc(a);
    }
    h.setRequestHeader = function(a, b) {
      this.u.append(a, b);
    };
    h.getResponseHeader = function(a) {
      return this.h ? this.h.get(a.toLowerCase()) || "" : "";
    };
    h.getAllResponseHeaders = function() {
      if (!this.h) return "";
      const a = [], b = this.h.entries();
      for (var c = b.next(); !c.done; ) c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
      return a.join("\r\n");
    };
    function Lc(a) {
      a.onreadystatechange && a.onreadystatechange.call(a);
    }
    Object.defineProperty(Kc.prototype, "withCredentials", { get: function() {
      return "include" === this.m;
    }, set: function(a) {
      this.m = a ? "include" : "same-origin";
    } });
    function Oc(a) {
      let b = "";
      qa(a, function(c, d) {
        b += d;
        b += ":";
        b += c;
        b += "\r\n";
      });
      return b;
    }
    function Pc(a, b, c) {
      a: {
        for (d in c) {
          var d = false;
          break a;
        }
        d = true;
      }
      d || (c = Oc(c), "string" === typeof a ? null != c && encodeURIComponent(String(c)) : S(a, b, c));
    }
    function X2(a) {
      E.call(this);
      this.headers = /* @__PURE__ */ new Map();
      this.o = a || null;
      this.h = false;
      this.v = this.g = null;
      this.D = "";
      this.m = 0;
      this.l = "";
      this.j = this.B = this.u = this.A = false;
      this.I = null;
      this.H = "";
      this.J = false;
    }
    r(X2, E);
    var Qc = /^https?$/i, Rc = ["POST", "PUT"];
    h = X2.prototype;
    h.Ha = function(a) {
      this.J = a;
    };
    h.ea = function(a, b, c, d) {
      if (this.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.D + "; newUri=" + a);
      b = b ? b.toUpperCase() : "GET";
      this.D = a;
      this.l = "";
      this.m = 0;
      this.A = false;
      this.h = true;
      this.g = this.o ? this.o.g() : Cb.g();
      this.v = this.o ? lb(this.o) : lb(Cb);
      this.g.onreadystatechange = p(this.Ea, this);
      try {
        this.B = true, this.g.open(b, String(a), true), this.B = false;
      } catch (f) {
        Sc(this, f);
        return;
      }
      a = c || "";
      c = new Map(this.headers);
      if (d) if (Object.getPrototypeOf(d) === Object.prototype) for (var e in d) c.set(e, d[e]);
      else if ("function" === typeof d.keys && "function" === typeof d.get) for (const f of d.keys()) c.set(f, d.get(f));
      else throw Error("Unknown input type for opt_headers: " + String(d));
      d = Array.from(c.keys()).find((f) => "content-type" == f.toLowerCase());
      e = k2.FormData && a instanceof k2.FormData;
      !(0 <= Array.prototype.indexOf.call(Rc, b, void 0)) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
      for (const [f, g] of c) this.g.setRequestHeader(f, g);
      this.H && (this.g.responseType = this.H);
      "withCredentials" in this.g && this.g.withCredentials !== this.J && (this.g.withCredentials = this.J);
      try {
        Tc(this), this.u = true, this.g.send(a), this.u = false;
      } catch (f) {
        Sc(this, f);
      }
    };
    function Sc(a, b) {
      a.h = false;
      a.g && (a.j = true, a.g.abort(), a.j = false);
      a.l = b;
      a.m = 5;
      Uc(a);
      Vc(a);
    }
    function Uc(a) {
      a.A || (a.A = true, F2(a, "complete"), F2(a, "error"));
    }
    h.abort = function(a) {
      this.g && this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false, this.m = a || 7, F2(this, "complete"), F2(this, "abort"), Vc(this));
    };
    h.N = function() {
      this.g && (this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false), Vc(this, true));
      X2.aa.N.call(this);
    };
    h.Ea = function() {
      this.s || (this.B || this.u || this.j ? Wc(this) : this.bb());
    };
    h.bb = function() {
      Wc(this);
    };
    function Wc(a) {
      if (a.h && "undefined" != typeof fa && (!a.v[1] || 4 != P(a) || 2 != a.Z())) {
        if (a.u && 4 == P(a)) bb(a.Ea, 0, a);
        else if (F2(a, "readystatechange"), 4 == P(a)) {
          a.h = false;
          try {
            const g = a.Z();
            a: switch (g) {
              case 200:
              case 201:
              case 202:
              case 204:
              case 206:
              case 304:
              case 1223:
                var b = true;
                break a;
              default:
                b = false;
            }
            var c;
            if (!(c = b)) {
              var d;
              if (d = 0 === g) {
                var e = String(a.D).match(oc)[1] || null;
                !e && k2.self && k2.self.location && (e = k2.self.location.protocol.slice(0, -1));
                d = !Qc.test(e ? e.toLowerCase() : "");
              }
              c = d;
            }
            if (c) F2(a, "complete"), F2(a, "success");
            else {
              a.m = 6;
              try {
                var f = 2 < P(a) ? a.g.statusText : "";
              } catch (m) {
                f = "";
              }
              a.l = f + " [" + a.Z() + "]";
              Uc(a);
            }
          } finally {
            Vc(a);
          }
        }
      }
    }
    function Vc(a, b) {
      if (a.g) {
        Tc(a);
        const c = a.g, d = a.v[0] ? () => {
        } : null;
        a.g = null;
        a.v = null;
        b || F2(a, "ready");
        try {
          c.onreadystatechange = d;
        } catch (e) {
        }
      }
    }
    function Tc(a) {
      a.I && (k2.clearTimeout(a.I), a.I = null);
    }
    h.isActive = function() {
      return !!this.g;
    };
    function P(a) {
      return a.g ? a.g.readyState : 0;
    }
    h.Z = function() {
      try {
        return 2 < P(this) ? this.g.status : -1;
      } catch (a) {
        return -1;
      }
    };
    h.oa = function() {
      try {
        return this.g ? this.g.responseText : "";
      } catch (a) {
        return "";
      }
    };
    h.Oa = function(a) {
      if (this.g) {
        var b = this.g.responseText;
        a && 0 == b.indexOf(a) && (b = b.substring(a.length));
        return ib(b);
      }
    };
    function Nb(a) {
      try {
        if (!a.g) return null;
        if ("response" in a.g) return a.g.response;
        switch (a.H) {
          case "":
          case "text":
            return a.g.responseText;
          case "arraybuffer":
            if ("mozResponseArrayBuffer" in a.g) return a.g.mozResponseArrayBuffer;
        }
        return null;
      } catch (b) {
        return null;
      }
    }
    function Vb(a) {
      const b = {};
      a = (a.g && 2 <= P(a) ? a.g.getAllResponseHeaders() || "" : "").split("\r\n");
      for (let d = 0; d < a.length; d++) {
        if (t(a[d])) continue;
        var c = va(a[d]);
        const e = c[0];
        c = c[1];
        if ("string" !== typeof c) continue;
        c = c.trim();
        const f = b[e] || [];
        b[e] = f;
        f.push(c);
      }
      ra(b, function(d) {
        return d.join(", ");
      });
    }
    h.Ba = function() {
      return this.m;
    };
    h.Ka = function() {
      return "string" === typeof this.l ? this.l : String(this.l);
    };
    function Xc(a, b, c) {
      return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
    }
    function Yc(a) {
      this.Aa = 0;
      this.i = [];
      this.j = new vb();
      this.ia = this.qa = this.I = this.W = this.g = this.ya = this.D = this.H = this.m = this.S = this.o = null;
      this.Ya = this.U = 0;
      this.Va = Xc("failFast", false, a);
      this.F = this.C = this.u = this.s = this.l = null;
      this.X = true;
      this.za = this.T = -1;
      this.Y = this.v = this.B = 0;
      this.Ta = Xc("baseRetryDelayMs", 5e3, a);
      this.cb = Xc("retryDelaySeedMs", 1e4, a);
      this.Wa = Xc("forwardChannelMaxRetries", 2, a);
      this.wa = Xc("forwardChannelRequestTimeoutMs", 2e4, a);
      this.pa = a && a.xmlHttpFactory || void 0;
      this.Xa = a && a.Tb || void 0;
      this.Ca = a && a.useFetchStreams || false;
      this.L = void 0;
      this.J = a && a.supportsCrossDomainXhr || false;
      this.K = "";
      this.h = new ic(a && a.concurrentRequestLimit);
      this.Da = new Hc();
      this.P = a && a.fastHandshake || false;
      this.O = a && a.encodeInitMessageHeaders || false;
      this.P && this.O && (this.O = false);
      this.Ua = a && a.Rb || false;
      a && a.xa && this.j.xa();
      a && a.forceLongPolling && (this.X = false);
      this.ba = !this.P && this.X && a && a.detectBufferingProxy || false;
      this.ja = void 0;
      a && a.longPollingTimeout && 0 < a.longPollingTimeout && (this.ja = a.longPollingTimeout);
      this.ca = void 0;
      this.R = 0;
      this.M = false;
      this.ka = this.A = null;
    }
    h = Yc.prototype;
    h.la = 8;
    h.G = 1;
    h.connect = function(a, b, c, d) {
      K(0);
      this.W = a;
      this.H = b || {};
      c && void 0 !== d && (this.H.OSID = c, this.H.OAID = d);
      this.F = this.X;
      this.I = cc(this, null, this.W);
      fc(this);
    };
    function gc(a) {
      Zc(a);
      if (3 == a.G) {
        var b = a.U++, c = N2(a.I);
        S(c, "SID", a.K);
        S(c, "RID", b);
        S(c, "TYPE", "terminate");
        $c(a, c);
        b = new M2(a, a.j, b);
        b.L = 2;
        b.v = Ib(N2(c));
        c = false;
        if (k2.navigator && k2.navigator.sendBeacon) try {
          c = k2.navigator.sendBeacon(b.v.toString(), "");
        } catch (d) {
        }
        !c && k2.Image && (new Image().src = b.v, c = true);
        c || (b.g = Mb(b.j, null), b.g.ea(b.v));
        b.F = Date.now();
        Kb(b);
      }
      ad(a);
    }
    function Zb(a) {
      a.g && (Tb(a), a.g.cancel(), a.g = null);
    }
    function Zc(a) {
      Zb(a);
      a.u && (k2.clearTimeout(a.u), a.u = null);
      Yb(a);
      a.h.cancel();
      a.s && ("number" === typeof a.s && k2.clearTimeout(a.s), a.s = null);
    }
    function fc(a) {
      if (!jc(a.h) && !a.s) {
        a.s = true;
        var b = a.Ga;
        x2 || Ea();
        y || (x2(), y = true);
        za.add(b, a);
        a.B = 0;
      }
    }
    function bd(a, b) {
      if (ac(a.h) >= a.h.j - (a.s ? 1 : 0)) return false;
      if (a.s) return a.i = b.D.concat(a.i), true;
      if (1 == a.G || 2 == a.G || a.B >= (a.Va ? 0 : a.Wa)) return false;
      a.s = ub(p(a.Ga, a, b), cd(a, a.B));
      a.B++;
      return true;
    }
    h.Ga = function(a) {
      if (this.s) if (this.s = null, 1 == this.G) {
        if (!a) {
          this.U = Math.floor(1e5 * Math.random());
          a = this.U++;
          const e = new M2(this, this.j, a);
          let f = this.o;
          this.S && (f ? (f = sa(f), ua(f, this.S)) : f = this.S);
          null !== this.m || this.O || (e.H = f, f = null);
          if (this.P) a: {
            var b = 0;
            for (var c = 0; c < this.i.length; c++) {
              b: {
                var d = this.i[c];
                if ("__data__" in d.map && (d = d.map.__data__, "string" === typeof d)) {
                  d = d.length;
                  break b;
                }
                d = void 0;
              }
              if (void 0 === d) break;
              b += d;
              if (4096 < b) {
                b = c;
                break a;
              }
              if (4096 === b || c === this.i.length - 1) {
                b = c + 1;
                break a;
              }
            }
            b = 1e3;
          }
          else b = 1e3;
          b = dd(this, e, b);
          c = N2(this.I);
          S(c, "RID", a);
          S(c, "CVER", 22);
          this.D && S(c, "X-HTTP-Session-Id", this.D);
          $c(this, c);
          f && (this.O ? b = "headers=" + encodeURIComponent(String(Oc(f))) + "&" + b : this.m && Pc(c, this.m, f));
          bc(this.h, e);
          this.Ua && S(c, "TYPE", "init");
          this.P ? (S(c, "$req", b), S(c, "SID", "null"), e.T = true, Hb(e, c, null)) : Hb(e, c, b);
          this.G = 2;
        }
      } else 3 == this.G && (a ? ed(this, a) : 0 == this.i.length || jc(this.h) || ed(this));
    };
    function ed(a, b) {
      var c;
      b ? c = b.l : c = a.U++;
      const d = N2(a.I);
      S(d, "SID", a.K);
      S(d, "RID", c);
      S(d, "AID", a.T);
      $c(a, d);
      a.m && a.o && Pc(d, a.m, a.o);
      c = new M2(a, a.j, c, a.B + 1);
      null === a.m && (c.H = a.o);
      b && (a.i = b.D.concat(a.i));
      b = dd(a, c, 1e3);
      c.I = Math.round(0.5 * a.wa) + Math.round(0.5 * a.wa * Math.random());
      bc(a.h, c);
      Hb(c, d, b);
    }
    function $c(a, b) {
      a.H && qa(a.H, function(c, d) {
        S(b, d, c);
      });
      a.l && nc({}, function(c, d) {
        S(b, d, c);
      });
    }
    function dd(a, b, c) {
      c = Math.min(a.i.length, c);
      var d = a.l ? p(a.l.Na, a.l, a) : null;
      a: {
        var e = a.i;
        let f = -1;
        for (; ; ) {
          const g = ["count=" + c];
          -1 == f ? 0 < c ? (f = e[0].g, g.push("ofs=" + f)) : f = 0 : g.push("ofs=" + f);
          let m = true;
          for (let q2 = 0; q2 < c; q2++) {
            let l = e[q2].g;
            const v = e[q2].map;
            l -= f;
            if (0 > l) f = Math.max(0, e[q2].g - 100), m = false;
            else try {
              Ic(v, g, "req" + l + "_");
            } catch (w) {
              d && d(v);
            }
          }
          if (m) {
            d = g.join("&");
            break a;
          }
        }
      }
      a = a.i.splice(0, c);
      b.D = a;
      return d;
    }
    function ec(a) {
      if (!a.g && !a.u) {
        a.Y = 1;
        var b = a.Fa;
        x2 || Ea();
        y || (x2(), y = true);
        za.add(b, a);
        a.v = 0;
      }
    }
    function $b(a) {
      if (a.g || a.u || 3 <= a.v) return false;
      a.Y++;
      a.u = ub(p(a.Fa, a), cd(a, a.v));
      a.v++;
      return true;
    }
    h.Fa = function() {
      this.u = null;
      fd(this);
      if (this.ba && !(this.M || null == this.g || 0 >= this.R)) {
        var a = 2 * this.R;
        this.j.info("BP detection timer enabled: " + a);
        this.A = ub(p(this.ab, this), a);
      }
    };
    h.ab = function() {
      this.A && (this.A = null, this.j.info("BP detection timeout reached."), this.j.info("Buffering proxy detected and switch to long-polling!"), this.F = false, this.M = true, K(10), Zb(this), fd(this));
    };
    function Tb(a) {
      null != a.A && (k2.clearTimeout(a.A), a.A = null);
    }
    function fd(a) {
      a.g = new M2(a, a.j, "rpc", a.Y);
      null === a.m && (a.g.H = a.o);
      a.g.O = 0;
      var b = N2(a.qa);
      S(b, "RID", "rpc");
      S(b, "SID", a.K);
      S(b, "AID", a.T);
      S(b, "CI", a.F ? "0" : "1");
      !a.F && a.ja && S(b, "TO", a.ja);
      S(b, "TYPE", "xmlhttp");
      $c(a, b);
      a.m && a.o && Pc(b, a.m, a.o);
      a.L && (a.g.I = a.L);
      var c = a.g;
      a = a.ia;
      c.L = 1;
      c.v = Ib(N2(b));
      c.m = null;
      c.P = true;
      Jb(c, a);
    }
    h.Za = function() {
      null != this.C && (this.C = null, Zb(this), $b(this), K(19));
    };
    function Yb(a) {
      null != a.C && (k2.clearTimeout(a.C), a.C = null);
    }
    function Ub(a, b) {
      var c = null;
      if (a.g == b) {
        Yb(a);
        Tb(a);
        a.g = null;
        var d = 2;
      } else if (Xb(a.h, b)) c = b.D, dc(a.h, b), d = 1;
      else return;
      if (0 != a.G) {
        if (b.o) if (1 == d) {
          c = b.m ? b.m.length : 0;
          b = Date.now() - b.F;
          var e = a.B;
          d = qb();
          F2(d, new tb(d, c));
          fc(a);
        } else ec(a);
        else if (e = b.s, 3 == e || 0 == e && 0 < b.X || !(1 == d && bd(a, b) || 2 == d && $b(a))) switch (c && 0 < c.length && (b = a.h, b.i = b.i.concat(c)), e) {
          case 1:
            R(a, 5);
            break;
          case 4:
            R(a, 10);
            break;
          case 3:
            R(a, 6);
            break;
          default:
            R(a, 2);
        }
      }
    }
    function cd(a, b) {
      let c = a.Ta + Math.floor(Math.random() * a.cb);
      a.isActive() || (c *= 2);
      return c * b;
    }
    function R(a, b) {
      a.j.info("Error code " + b);
      if (2 == b) {
        var c = p(a.fb, a), d = a.Xa;
        const e = !d;
        d = new T(d || "//www.google.com/images/cleardot.gif");
        k2.location && "http" == k2.location.protocol || qc(d, "https");
        Ib(d);
        e ? Fc(d.toString(), c) : Gc(d.toString(), c);
      } else K(2);
      a.G = 0;
      a.l && a.l.sa(b);
      ad(a);
      Zc(a);
    }
    h.fb = function(a) {
      a ? (this.j.info("Successfully pinged google.com"), K(2)) : (this.j.info("Failed to ping google.com"), K(1));
    };
    function ad(a) {
      a.G = 0;
      a.ka = [];
      if (a.l) {
        const b = kc(a.h);
        if (0 != b.length || 0 != a.i.length) ma(a.ka, b), ma(a.ka, a.i), a.h.i.length = 0, la(a.i), a.i.length = 0;
        a.l.ra();
      }
    }
    function cc(a, b, c) {
      var d = c instanceof T ? N2(c) : new T(c);
      if ("" != d.g) b && (d.g = b + "." + d.g), rc(d, d.s);
      else {
        var e = k2.location;
        d = e.protocol;
        b = b ? b + "." + e.hostname : e.hostname;
        e = +e.port;
        var f = new T(null);
        d && qc(f, d);
        b && (f.g = b);
        e && rc(f, e);
        c && (f.l = c);
        d = f;
      }
      c = a.D;
      b = a.ya;
      c && b && S(d, c, b);
      S(d, "VER", a.la);
      $c(a, d);
      return d;
    }
    function Mb(a, b, c) {
      if (b && !a.J) throw Error("Can't create secondary domain capable XhrIo object.");
      b = a.Ca && !a.pa ? new X2(new Jc({ eb: c })) : new X2(a.pa);
      b.Ha(a.J);
      return b;
    }
    h.isActive = function() {
      return !!this.l && this.l.isActive(this);
    };
    function gd() {
    }
    h = gd.prototype;
    h.ua = function() {
    };
    h.ta = function() {
    };
    h.sa = function() {
    };
    h.ra = function() {
    };
    h.isActive = function() {
      return true;
    };
    h.Na = function() {
    };
    function hd() {
    }
    hd.prototype.g = function(a, b) {
      return new Y2(a, b);
    };
    function Y2(a, b) {
      E.call(this);
      this.g = new Yc(b);
      this.l = a;
      this.h = b && b.messageUrlParams || null;
      a = b && b.messageHeaders || null;
      b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
      this.g.o = a;
      a = b && b.initMessageHeaders || null;
      b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = { "X-WebChannel-Content-Type": b.messageContentType });
      b && b.va && (a ? a["X-WebChannel-Client-Profile"] = b.va : a = { "X-WebChannel-Client-Profile": b.va });
      this.g.S = a;
      (a = b && b.Sb) && !t(a) && (this.g.m = a);
      this.v = b && b.supportsCrossDomainXhr || false;
      this.u = b && b.sendRawJson || false;
      (b = b && b.httpSessionIdParam) && !t(b) && (this.g.D = b, a = this.h, null !== a && b in a && (a = this.h, b in a && delete a[b]));
      this.j = new Z(this);
    }
    r(Y2, E);
    Y2.prototype.m = function() {
      this.g.l = this.j;
      this.v && (this.g.J = true);
      this.g.connect(this.l, this.h || void 0);
    };
    Y2.prototype.close = function() {
      gc(this.g);
    };
    Y2.prototype.o = function(a) {
      var b = this.g;
      if ("string" === typeof a) {
        var c = {};
        c.__data__ = a;
        a = c;
      } else this.u && (c = {}, c.__data__ = hb(a), a = c);
      b.i.push(new hc(b.Ya++, a));
      3 == b.G && fc(b);
    };
    Y2.prototype.N = function() {
      this.g.l = null;
      delete this.j;
      gc(this.g);
      delete this.g;
      Y2.aa.N.call(this);
    };
    function id(a) {
      nb.call(this);
      a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
      var b = a.__sm__;
      if (b) {
        a: {
          for (const c in b) {
            a = c;
            break a;
          }
          a = void 0;
        }
        if (this.i = a) a = this.i, b = null !== b && a in b ? b[a] : void 0;
        this.data = b;
      } else this.data = a;
    }
    r(id, nb);
    function jd() {
      ob.call(this);
      this.status = 1;
    }
    r(jd, ob);
    function Z(a) {
      this.g = a;
    }
    r(Z, gd);
    Z.prototype.ua = function() {
      F2(this.g, "a");
    };
    Z.prototype.ta = function(a) {
      F2(this.g, new id(a));
    };
    Z.prototype.sa = function(a) {
      F2(this.g, new jd());
    };
    Z.prototype.ra = function() {
      F2(this.g, "b");
    };
    hd.prototype.createWebChannel = hd.prototype.g;
    Y2.prototype.send = Y2.prototype.o;
    Y2.prototype.open = Y2.prototype.m;
    Y2.prototype.close = Y2.prototype.close;
    createWebChannelTransport = webchannel_blob_es2018.createWebChannelTransport = function() {
      return new hd();
    };
    getStatEventTarget = webchannel_blob_es2018.getStatEventTarget = function() {
      return qb();
    };
    Event = webchannel_blob_es2018.Event = I;
    Stat = webchannel_blob_es2018.Stat = { mb: 0, pb: 1, qb: 2, Jb: 3, Ob: 4, Lb: 5, Mb: 6, Kb: 7, Ib: 8, Nb: 9, PROXY: 10, NOPROXY: 11, Gb: 12, Cb: 13, Db: 14, Bb: 15, Eb: 16, Fb: 17, ib: 18, hb: 19, jb: 20 };
    Ab.NO_ERROR = 0;
    Ab.TIMEOUT = 8;
    Ab.HTTP_ERROR = 6;
    ErrorCode = webchannel_blob_es2018.ErrorCode = Ab;
    Bb.COMPLETE = "complete";
    EventType = webchannel_blob_es2018.EventType = Bb;
    mb.EventType = H;
    H.OPEN = "a";
    H.CLOSE = "b";
    H.ERROR = "c";
    H.MESSAGE = "d";
    E.prototype.listen = E.prototype.K;
    WebChannel = webchannel_blob_es2018.WebChannel = mb;
    FetchXmlHttpFactory = webchannel_blob_es2018.FetchXmlHttpFactory = Jc;
    X2.prototype.listenOnce = X2.prototype.L;
    X2.prototype.getLastError = X2.prototype.Ka;
    X2.prototype.getLastErrorCode = X2.prototype.Ba;
    X2.prototype.getStatus = X2.prototype.Z;
    X2.prototype.getResponseJson = X2.prototype.Oa;
    X2.prototype.getResponseText = X2.prototype.oa;
    X2.prototype.send = X2.prototype.ea;
    X2.prototype.setWithCredentials = X2.prototype.Ha;
    XhrIo = webchannel_blob_es2018.XhrIo = X2;
  }).apply(typeof commonjsGlobal2 !== "undefined" ? commonjsGlobal2 : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  // node_modules/@firebase/firestore/dist/index.esm2017.js
  var F = "@firebase/firestore";
  var M = "4.8.0";
  var User = class {
    constructor(e) {
      this.uid = e;
    }
    isAuthenticated() {
      return null != this.uid;
    }
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */
    toKey() {
      return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
    isEqual(e) {
      return e.uid === this.uid;
    }
  };
  User.UNAUTHENTICATED = new User(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
  // non-FirebaseAuth providers.
  User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
  var x = "11.10.0";
  var O = new Logger("@firebase/firestore");
  function __PRIVATE_getLogLevel() {
    return O.logLevel;
  }
  function __PRIVATE_logDebug(e, ...t) {
    if (O.logLevel <= LogLevel.DEBUG) {
      const n = t.map(__PRIVATE_argToString);
      O.debug(`Firestore (${x}): ${e}`, ...n);
    }
  }
  function __PRIVATE_logError(e, ...t) {
    if (O.logLevel <= LogLevel.ERROR) {
      const n = t.map(__PRIVATE_argToString);
      O.error(`Firestore (${x}): ${e}`, ...n);
    }
  }
  function __PRIVATE_logWarn(e, ...t) {
    if (O.logLevel <= LogLevel.WARN) {
      const n = t.map(__PRIVATE_argToString);
      O.warn(`Firestore (${x}): ${e}`, ...n);
    }
  }
  function __PRIVATE_argToString(e) {
    if ("string" == typeof e) return e;
    try {
      return (function __PRIVATE_formatJSON(e2) {
        return JSON.stringify(e2);
      })(e);
    } catch (t) {
      return e;
    }
  }
  function fail(e, t, n) {
    let r = "Unexpected state";
    "string" == typeof t ? r = t : n = t, __PRIVATE__fail(e, r, n);
  }
  function __PRIVATE__fail(e, t, n) {
    let r = `FIRESTORE (${x}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;
    if (void 0 !== n) try {
      r += " CONTEXT: " + JSON.stringify(n);
    } catch (e2) {
      r += " CONTEXT: " + n;
    }
    throw __PRIVATE_logError(r), new Error(r);
  }
  function __PRIVATE_hardAssert(e, t, n, r) {
    let i = "Unexpected state";
    "string" == typeof n ? i = n : r = n, e || __PRIVATE__fail(t, i, r);
  }
  function __PRIVATE_debugCast(e, t) {
    return e;
  }
  var N = {
    // Causes are copied from:
    // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
    /** Not an error; returned on success. */
    OK: "ok",
    /** The operation was cancelled (typically by the caller). */
    CANCELLED: "cancelled",
    /** Unknown error or an error from a different error domain. */
    UNKNOWN: "unknown",
    /**
     * Client specified an invalid argument. Note that this differs from
     * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
     * problematic regardless of the state of the system (e.g., a malformed file
     * name).
     */
    INVALID_ARGUMENT: "invalid-argument",
    /**
     * Deadline expired before operation could complete. For operations that
     * change the state of the system, this error may be returned even if the
     * operation has completed successfully. For example, a successful response
     * from a server could have been delayed long enough for the deadline to
     * expire.
     */
    DEADLINE_EXCEEDED: "deadline-exceeded",
    /** Some requested entity (e.g., file or directory) was not found. */
    NOT_FOUND: "not-found",
    /**
     * Some entity that we attempted to create (e.g., file or directory) already
     * exists.
     */
    ALREADY_EXISTS: "already-exists",
    /**
     * The caller does not have permission to execute the specified operation.
     * PERMISSION_DENIED must not be used for rejections caused by exhausting
     * some resource (use RESOURCE_EXHAUSTED instead for those errors).
     * PERMISSION_DENIED must not be used if the caller cannot be identified
     * (use UNAUTHENTICATED instead for those errors).
     */
    PERMISSION_DENIED: "permission-denied",
    /**
     * The request does not have valid authentication credentials for the
     * operation.
     */
    UNAUTHENTICATED: "unauthenticated",
    /**
     * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
     * entire file system is out of space.
     */
    RESOURCE_EXHAUSTED: "resource-exhausted",
    /**
     * Operation was rejected because the system is not in a state required for
     * the operation's execution. For example, directory to be deleted may be
     * non-empty, an rmdir operation is applied to a non-directory, etc.
     *
     * A litmus test that may help a service implementor in deciding
     * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
     *  (a) Use UNAVAILABLE if the client can retry just the failing call.
     *  (b) Use ABORTED if the client should retry at a higher-level
     *      (e.g., restarting a read-modify-write sequence).
     *  (c) Use FAILED_PRECONDITION if the client should not retry until
     *      the system state has been explicitly fixed. E.g., if an "rmdir"
     *      fails because the directory is non-empty, FAILED_PRECONDITION
     *      should be returned since the client should not retry unless
     *      they have first fixed up the directory by deleting files from it.
     *  (d) Use FAILED_PRECONDITION if the client performs conditional
     *      REST Get/Update/Delete on a resource and the resource on the
     *      server does not match the condition. E.g., conflicting
     *      read-modify-write on the same resource.
     */
    FAILED_PRECONDITION: "failed-precondition",
    /**
     * The operation was aborted, typically due to a concurrency issue like
     * sequencer check failures, transaction aborts, etc.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    ABORTED: "aborted",
    /**
     * Operation was attempted past the valid range. E.g., seeking or reading
     * past end of file.
     *
     * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
     * if the system state changes. For example, a 32-bit file system will
     * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
     * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
     * an offset past the current file size.
     *
     * There is a fair bit of overlap between FAILED_PRECONDITION and
     * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
     * when it applies so that callers who are iterating through a space can
     * easily look for an OUT_OF_RANGE error to detect when they are done.
     */
    OUT_OF_RANGE: "out-of-range",
    /** Operation is not implemented or not supported/enabled in this service. */
    UNIMPLEMENTED: "unimplemented",
    /**
     * Internal errors. Means some invariants expected by underlying System has
     * been broken. If you see one of these errors, Something is very broken.
     */
    INTERNAL: "internal",
    /**
     * The service is currently unavailable. This is a most likely a transient
     * condition and may be corrected by retrying with a backoff.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    UNAVAILABLE: "unavailable",
    /** Unrecoverable data loss or corruption. */
    DATA_LOSS: "data-loss"
  };
  var FirestoreError = class extends FirebaseError {
    /** @hideconstructor */
    constructor(e, t) {
      super(e, t), this.code = e, this.message = t, // HACK: We write a toString property directly because Error is not a real
      // class and so inheritance does not work correctly. We could alternatively
      // do the same "back-door inheritance" trick that FirebaseError does.
      this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
    }
  };
  var __PRIVATE_Deferred = class {
    constructor() {
      this.promise = new Promise(((e, t) => {
        this.resolve = e, this.reject = t;
      }));
    }
  };
  var __PRIVATE_OAuthToken = class {
    constructor(e, t) {
      this.user = t, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e}`);
    }
  };
  var __PRIVATE_EmptyAuthCredentialsProvider = class {
    getToken() {
      return Promise.resolve(null);
    }
    invalidateToken() {
    }
    start(e, t) {
      e.enqueueRetryable((() => t(User.UNAUTHENTICATED)));
    }
    shutdown() {
    }
  };
  var __PRIVATE_EmulatorAuthCredentialsProvider = class {
    constructor(e) {
      this.token = e, /**
       * Stores the listener registered with setChangeListener()
       * This isn't actually necessary since the UID never changes, but we use this
       * to verify the listen contract is adhered to in tests.
       */
      this.changeListener = null;
    }
    getToken() {
      return Promise.resolve(this.token);
    }
    invalidateToken() {
    }
    start(e, t) {
      this.changeListener = t, // Fire with initial user.
      e.enqueueRetryable((() => t(this.token.user)));
    }
    shutdown() {
      this.changeListener = null;
    }
  };
  var __PRIVATE_FirebaseAuthCredentialsProvider = class {
    constructor(e) {
      this.t = e, /** Tracks the current User. */
      this.currentUser = User.UNAUTHENTICATED, /**
       * Counter used to detect if the token changed while a getToken request was
       * outstanding.
       */
      this.i = 0, this.forceRefresh = false, this.auth = null;
    }
    start(e, t) {
      __PRIVATE_hardAssert(void 0 === this.o, 42304);
      let n = this.i;
      const __PRIVATE_guardedChangeListener = (e2) => this.i !== n ? (n = this.i, t(e2)) : Promise.resolve();
      let r = new __PRIVATE_Deferred();
      this.o = () => {
        this.i++, this.currentUser = this.u(), r.resolve(), r = new __PRIVATE_Deferred(), e.enqueueRetryable((() => __PRIVATE_guardedChangeListener(this.currentUser)));
      };
      const __PRIVATE_awaitNextToken = () => {
        const t2 = r;
        e.enqueueRetryable((async () => {
          await t2.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
        }));
      }, __PRIVATE_registerAuth = (e2) => {
        __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e2, this.o && (this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken());
      };
      this.t.onInit(((e2) => __PRIVATE_registerAuth(e2))), // Our users can initialize Auth right after Firestore, so we give it
      // a chance to register itself with the component framework before we
      // determine whether to start up in unauthenticated mode.
      setTimeout((() => {
        if (!this.auth) {
          const e2 = this.t.getImmediate({
            optional: true
          });
          e2 ? __PRIVATE_registerAuth(e2) : (
            // If auth is still not available, proceed with `null` user
            (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r.resolve(), r = new __PRIVATE_Deferred())
          );
        }
      }), 0), __PRIVATE_awaitNextToken();
    }
    getToken() {
      const e = this.i, t = this.forceRefresh;
      return this.forceRefresh = false, this.auth ? this.auth.getToken(t).then(((t2) => (
        // Cancel the request since the token changed while the request was
        // outstanding so the response is potentially for a previous user (which
        // user, we can't be sure).
        this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t2 ? (__PRIVATE_hardAssert("string" == typeof t2.accessToken, 31837, {
          l: t2
        }), new __PRIVATE_OAuthToken(t2.accessToken, this.currentUser)) : null
      ))) : Promise.resolve(null);
    }
    invalidateToken() {
      this.forceRefresh = true;
    }
    shutdown() {
      this.auth && this.o && this.auth.removeAuthTokenListener(this.o), this.o = void 0;
    }
    // Auth.getUid() can return null even with a user logged in. It is because
    // getUid() is synchronous, but the auth code populating Uid is asynchronous.
    // This method should only be called in the AuthTokenListener callback
    // to guarantee to get the actual user.
    u() {
      const e = this.auth && this.auth.getUid();
      return __PRIVATE_hardAssert(null === e || "string" == typeof e, 2055, {
        h: e
      }), new User(e);
    }
  };
  var __PRIVATE_FirstPartyToken = class {
    constructor(e, t, n) {
      this.P = e, this.T = t, this.I = n, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.A = /* @__PURE__ */ new Map();
    }
    /**
     * Gets an authorization token, using a provided factory function, or return
     * null.
     */
    R() {
      return this.I ? this.I() : null;
    }
    get headers() {
      this.A.set("X-Goog-AuthUser", this.P);
      const e = this.R();
      return e && this.A.set("Authorization", e), this.T && this.A.set("X-Goog-Iam-Authorization-Token", this.T), this.A;
    }
  };
  var __PRIVATE_FirstPartyAuthCredentialsProvider = class {
    constructor(e, t, n) {
      this.P = e, this.T = t, this.I = n;
    }
    getToken() {
      return Promise.resolve(new __PRIVATE_FirstPartyToken(this.P, this.T, this.I));
    }
    start(e, t) {
      e.enqueueRetryable((() => t(User.FIRST_PARTY)));
    }
    shutdown() {
    }
    invalidateToken() {
    }
  };
  var AppCheckToken = class {
    constructor(e) {
      this.value = e, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
    }
  };
  var __PRIVATE_FirebaseAppCheckTokenProvider = class {
    constructor(t, n) {
      this.V = n, this.forceRefresh = false, this.appCheck = null, this.m = null, this.p = null, _isFirebaseServerApp(t) && t.settings.appCheckToken && (this.p = t.settings.appCheckToken);
    }
    start(e, t) {
      __PRIVATE_hardAssert(void 0 === this.o, 3512);
      const onTokenChanged = (e2) => {
        null != e2.error && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e2.error.message}`);
        const n = e2.token !== this.m;
        return this.m = e2.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), n ? t(e2.token) : Promise.resolve();
      };
      this.o = (t2) => {
        e.enqueueRetryable((() => onTokenChanged(t2)));
      };
      const __PRIVATE_registerAppCheck = (e2) => {
        __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e2, this.o && this.appCheck.addTokenListener(this.o);
      };
      this.V.onInit(((e2) => __PRIVATE_registerAppCheck(e2))), // Our users can initialize AppCheck after Firestore, so we give it
      // a chance to register itself with the component framework.
      setTimeout((() => {
        if (!this.appCheck) {
          const e2 = this.V.getImmediate({
            optional: true
          });
          e2 ? __PRIVATE_registerAppCheck(e2) : (
            // If AppCheck is still not available, proceed without it.
            __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected")
          );
        }
      }), 0);
    }
    getToken() {
      if (this.p) return Promise.resolve(new AppCheckToken(this.p));
      const e = this.forceRefresh;
      return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(e).then(((e2) => e2 ? (__PRIVATE_hardAssert("string" == typeof e2.token, 44558, {
        tokenResult: e2
      }), this.m = e2.token, new AppCheckToken(e2.token)) : null)) : Promise.resolve(null);
    }
    invalidateToken() {
      this.forceRefresh = true;
    }
    shutdown() {
      this.appCheck && this.o && this.appCheck.removeTokenListener(this.o), this.o = void 0;
    }
  };
  function __PRIVATE_randomBytes(e) {
    const t = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "undefined" != typeof self && (self.crypto || self.msCrypto)
    ), n = new Uint8Array(e);
    if (t && "function" == typeof t.getRandomValues) t.getRandomValues(n);
    else
      for (let t2 = 0; t2 < e; t2++) n[t2] = Math.floor(256 * Math.random());
    return n;
  }
  function __PRIVATE_newTextEncoder() {
    return new TextEncoder();
  }
  var __PRIVATE_AutoId = class {
    static newId() {
      const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = 62 * Math.floor(256 / 62);
      let n = "";
      for (; n.length < 20; ) {
        const r = __PRIVATE_randomBytes(40);
        for (let i = 0; i < r.length; ++i)
          n.length < 20 && r[i] < t && (n += e.charAt(r[i] % 62));
      }
      return n;
    }
  };
  function __PRIVATE_primitiveComparator(e, t) {
    return e < t ? -1 : e > t ? 1 : 0;
  }
  function __PRIVATE_compareUtf8Strings(e, t) {
    let n = 0;
    for (; n < e.length && n < t.length; ) {
      const r = e.codePointAt(n), i = t.codePointAt(n);
      if (r !== i) {
        if (r < 128 && i < 128)
          return __PRIVATE_primitiveComparator(r, i);
        {
          const s = __PRIVATE_newTextEncoder(), o = __PRIVATE_compareByteArrays$1(s.encode(__PRIVATE_getUtf8SafeSubstring(e, n)), s.encode(__PRIVATE_getUtf8SafeSubstring(t, n)));
          return 0 !== o ? o : __PRIVATE_primitiveComparator(r, i);
        }
      }
      n += r > 65535 ? 2 : 1;
    }
    return __PRIVATE_primitiveComparator(e.length, t.length);
  }
  function __PRIVATE_getUtf8SafeSubstring(e, t) {
    return e.codePointAt(t) > 65535 ? e.substring(t, t + 2) : e.substring(t, t + 1);
  }
  function __PRIVATE_compareByteArrays$1(e, t) {
    for (let n = 0; n < e.length && n < t.length; ++n) if (e[n] !== t[n]) return __PRIVATE_primitiveComparator(e[n], t[n]);
    return __PRIVATE_primitiveComparator(e.length, t.length);
  }
  function __PRIVATE_arrayEquals(e, t, n) {
    return e.length === t.length && e.every(((e2, r) => n(e2, t[r])));
  }
  var B = "__name__";
  var BasePath = class _BasePath {
    constructor(e, t, n) {
      void 0 === t ? t = 0 : t > e.length && fail(637, {
        offset: t,
        range: e.length
      }), void 0 === n ? n = e.length - t : n > e.length - t && fail(1746, {
        length: n,
        range: e.length - t
      }), this.segments = e, this.offset = t, this.len = n;
    }
    get length() {
      return this.len;
    }
    isEqual(e) {
      return 0 === _BasePath.comparator(this, e);
    }
    child(e) {
      const t = this.segments.slice(this.offset, this.limit());
      return e instanceof _BasePath ? e.forEach(((e2) => {
        t.push(e2);
      })) : t.push(e), this.construct(t);
    }
    /** The index of one past the last segment of the path. */
    limit() {
      return this.offset + this.length;
    }
    popFirst(e) {
      return e = void 0 === e ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
    }
    popLast() {
      return this.construct(this.segments, this.offset, this.length - 1);
    }
    firstSegment() {
      return this.segments[this.offset];
    }
    lastSegment() {
      return this.get(this.length - 1);
    }
    get(e) {
      return this.segments[this.offset + e];
    }
    isEmpty() {
      return 0 === this.length;
    }
    isPrefixOf(e) {
      if (e.length < this.length) return false;
      for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return false;
      return true;
    }
    isImmediateParentOf(e) {
      if (this.length + 1 !== e.length) return false;
      for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return false;
      return true;
    }
    forEach(e) {
      for (let t = this.offset, n = this.limit(); t < n; t++) e(this.segments[t]);
    }
    toArray() {
      return this.segments.slice(this.offset, this.limit());
    }
    /**
     * Compare 2 paths segment by segment, prioritizing numeric IDs
     * (e.g., "__id123__") in numeric ascending order, followed by string
     * segments in lexicographical order.
     */
    static comparator(e, t) {
      const n = Math.min(e.length, t.length);
      for (let r = 0; r < n; r++) {
        const n2 = _BasePath.compareSegments(e.get(r), t.get(r));
        if (0 !== n2) return n2;
      }
      return __PRIVATE_primitiveComparator(e.length, t.length);
    }
    static compareSegments(e, t) {
      const n = _BasePath.isNumericId(e), r = _BasePath.isNumericId(t);
      return n && !r ? -1 : !n && r ? 1 : n && r ? _BasePath.extractNumericId(e).compare(_BasePath.extractNumericId(t)) : __PRIVATE_compareUtf8Strings(e, t);
    }
    // Checks if a segment is a numeric ID (starts with "__id" and ends with "__").
    static isNumericId(e) {
      return e.startsWith("__id") && e.endsWith("__");
    }
    static extractNumericId(e) {
      return Integer.fromString(e.substring(4, e.length - 2));
    }
  };
  var ResourcePath = class _ResourcePath extends BasePath {
    construct(e, t, n) {
      return new _ResourcePath(e, t, n);
    }
    canonicalString() {
      return this.toArray().join("/");
    }
    toString() {
      return this.canonicalString();
    }
    /**
     * Returns a string representation of this path
     * where each path segment has been encoded with
     * `encodeURIComponent`.
     */
    toUriEncodedString() {
      return this.toArray().map(encodeURIComponent).join("/");
    }
    /**
     * Creates a resource path from the given slash-delimited string. If multiple
     * arguments are provided, all components are combined. Leading and trailing
     * slashes from all components are ignored.
     */
    static fromString(...e) {
      const t = [];
      for (const n of e) {
        if (n.indexOf("//") >= 0) throw new FirestoreError(N.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
        t.push(...n.split("/").filter(((e2) => e2.length > 0)));
      }
      return new _ResourcePath(t);
    }
    static emptyPath() {
      return new _ResourcePath([]);
    }
  };
  var L = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
  var FieldPath$1 = class _FieldPath$1 extends BasePath {
    construct(e, t, n) {
      return new _FieldPath$1(e, t, n);
    }
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */
    static isValidIdentifier(e) {
      return L.test(e);
    }
    canonicalString() {
      return this.toArray().map(((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), _FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e))).join(".");
    }
    toString() {
      return this.canonicalString();
    }
    /**
     * Returns true if this field references the key of a document.
     */
    isKeyField() {
      return 1 === this.length && this.get(0) === B;
    }
    /**
     * The field designating the key of a document.
     */
    static keyField() {
      return new _FieldPath$1([B]);
    }
    /**
     * Parses a field string from the given server-formatted string.
     *
     * - Splitting the empty string is not allowed (for now at least).
     * - Empty segments within the string (e.g. if there are two consecutive
     *   separators) are not allowed.
     *
     * TODO(b/37244157): we should make this more strict. Right now, it allows
     * non-identifier path components, even if they aren't escaped.
     */
    static fromServerFormat(e) {
      const t = [];
      let n = "", r = 0;
      const __PRIVATE_addCurrentSegment = () => {
        if (0 === n.length) throw new FirestoreError(N.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
        t.push(n), n = "";
      };
      let i = false;
      for (; r < e.length; ) {
        const t2 = e[r];
        if ("\\" === t2) {
          if (r + 1 === e.length) throw new FirestoreError(N.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
          const t3 = e[r + 1];
          if ("\\" !== t3 && "." !== t3 && "`" !== t3) throw new FirestoreError(N.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
          n += t3, r += 2;
        } else "`" === t2 ? (i = !i, r++) : "." !== t2 || i ? (n += t2, r++) : (__PRIVATE_addCurrentSegment(), r++);
      }
      if (__PRIVATE_addCurrentSegment(), i) throw new FirestoreError(N.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
      return new _FieldPath$1(t);
    }
    static emptyPath() {
      return new _FieldPath$1([]);
    }
  };
  var DocumentKey = class _DocumentKey {
    constructor(e) {
      this.path = e;
    }
    static fromPath(e) {
      return new _DocumentKey(ResourcePath.fromString(e));
    }
    static fromName(e) {
      return new _DocumentKey(ResourcePath.fromString(e).popFirst(5));
    }
    static empty() {
      return new _DocumentKey(ResourcePath.emptyPath());
    }
    get collectionGroup() {
      return this.path.popLast().lastSegment();
    }
    /** Returns true if the document is in the specified collectionId. */
    hasCollectionId(e) {
      return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
    }
    /** Returns the collection group (i.e. the name of the parent collection) for this key. */
    getCollectionGroup() {
      return this.path.get(this.path.length - 2);
    }
    /** Returns the fully qualified path to the parent collection. */
    getCollectionPath() {
      return this.path.popLast();
    }
    isEqual(e) {
      return null !== e && 0 === ResourcePath.comparator(this.path, e.path);
    }
    toString() {
      return this.path.toString();
    }
    static comparator(e, t) {
      return ResourcePath.comparator(e.path, t.path);
    }
    static isDocumentKey(e) {
      return e.length % 2 == 0;
    }
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */
    static fromSegments(e) {
      return new _DocumentKey(new ResourcePath(e.slice()));
    }
  };
  function __PRIVATE_validateNonEmptyArgument(e, t, n) {
    if (!n) throw new FirestoreError(N.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
  }
  function __PRIVATE_validateIsNotUsedTogether(e, t, n, r) {
    if (true === t && true === r) throw new FirestoreError(N.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
  }
  function __PRIVATE_validateDocumentPath(e) {
    if (!DocumentKey.isDocumentKey(e)) throw new FirestoreError(N.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
  }
  function __PRIVATE_validateCollectionPath(e) {
    if (DocumentKey.isDocumentKey(e)) throw new FirestoreError(N.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
  }
  function __PRIVATE_isPlainObject(e) {
    return "object" == typeof e && null !== e && (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e));
  }
  function __PRIVATE_valueDescription(e) {
    if (void 0 === e) return "undefined";
    if (null === e) return "null";
    if ("string" == typeof e) return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
    if ("number" == typeof e || "boolean" == typeof e) return "" + e;
    if ("object" == typeof e) {
      if (e instanceof Array) return "an array";
      {
        const t = (
          /** try to get the constructor name for an object. */
          (function __PRIVATE_tryGetCustomObjectType(e2) {
            if (e2.constructor) return e2.constructor.name;
            return null;
          })(e)
        );
        return t ? `a custom ${t} object` : "an object";
      }
    }
    return "function" == typeof e ? "a function" : fail(12329, {
      type: typeof e
    });
  }
  function __PRIVATE_cast(e, t) {
    if ("_delegate" in e && // Unwrap Compat types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e = e._delegate), !(e instanceof t)) {
      if (t.name === e.constructor.name) throw new FirestoreError(N.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
      {
        const n = __PRIVATE_valueDescription(e);
        throw new FirestoreError(N.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
      }
    }
    return e;
  }
  function __PRIVATE_validatePositiveNumber(e, t) {
    if (t <= 0) throw new FirestoreError(N.INVALID_ARGUMENT, `Function ${e}() requires a positive number, but it was: ${t}.`);
  }
  function property(e, t) {
    const n = {
      typeString: e
    };
    return t && (n.value = t), n;
  }
  function __PRIVATE_validateJSON(e, t) {
    if (!__PRIVATE_isPlainObject(e)) throw new FirestoreError(N.INVALID_ARGUMENT, "JSON must be an object");
    let n;
    for (const r in t) if (t[r]) {
      const i = t[r].typeString, s = "value" in t[r] ? {
        value: t[r].value
      } : void 0;
      if (!(r in e)) {
        n = `JSON missing required field: '${r}'`;
        break;
      }
      const o = e[r];
      if (i && typeof o !== i) {
        n = `JSON field '${r}' must be a ${i}.`;
        break;
      }
      if (void 0 !== s && o !== s.value) {
        n = `Expected '${r}' field to equal '${s.value}'`;
        break;
      }
    }
    if (n) throw new FirestoreError(N.INVALID_ARGUMENT, n);
    return true;
  }
  var k = -62135596800;
  var q = 1e6;
  var Timestamp = class _Timestamp {
    /**
     * Creates a new timestamp with the current date, with millisecond precision.
     *
     * @returns a new timestamp representing the current date.
     */
    static now() {
      return _Timestamp.fromMillis(Date.now());
    }
    /**
     * Creates a new timestamp from the given date.
     *
     * @param date - The date to initialize the `Timestamp` from.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     date.
     */
    static fromDate(e) {
      return _Timestamp.fromMillis(e.getTime());
    }
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */
    static fromMillis(e) {
      const t = Math.floor(e / 1e3), n = Math.floor((e - 1e3 * t) * q);
      return new _Timestamp(t, n);
    }
    /**
     * Creates a new timestamp.
     *
     * @param seconds - The number of seconds of UTC time since Unix epoch
     *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
     *     9999-12-31T23:59:59Z inclusive.
     * @param nanoseconds - The non-negative fractions of a second at nanosecond
     *     resolution. Negative second values with fractions must still have
     *     non-negative nanoseconds values that count forward in time. Must be
     *     from 0 to 999,999,999 inclusive.
     */
    constructor(e, t) {
      if (this.seconds = e, this.nanoseconds = t, t < 0) throw new FirestoreError(N.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
      if (t >= 1e9) throw new FirestoreError(N.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
      if (e < k) throw new FirestoreError(N.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
      if (e >= 253402300800) throw new FirestoreError(N.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    }
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */
    toDate() {
      return new Date(this.toMillis());
    }
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */
    toMillis() {
      return 1e3 * this.seconds + this.nanoseconds / q;
    }
    _compareTo(e) {
      return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
    }
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */
    isEqual(e) {
      return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
    }
    /** Returns a textual representation of this `Timestamp`. */
    toString() {
      return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
    }
    /**
     * Returns a JSON-serializable representation of this `Timestamp`.
     */
    toJSON() {
      return {
        type: _Timestamp._jsonSchemaVersion,
        seconds: this.seconds,
        nanoseconds: this.nanoseconds
      };
    }
    /**
     * Builds a `Timestamp` instance from a JSON object created by {@link Timestamp.toJSON}.
     */
    static fromJSON(e) {
      if (__PRIVATE_validateJSON(e, _Timestamp._jsonSchema)) return new _Timestamp(e.seconds, e.nanoseconds);
    }
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */
    valueOf() {
      const e = this.seconds - k;
      return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
    }
  };
  Timestamp._jsonSchemaVersion = "firestore/timestamp/1.0", Timestamp._jsonSchema = {
    type: property("string", Timestamp._jsonSchemaVersion),
    seconds: property("number"),
    nanoseconds: property("number")
  };
  var SnapshotVersion = class _SnapshotVersion {
    static fromTimestamp(e) {
      return new _SnapshotVersion(e);
    }
    static min() {
      return new _SnapshotVersion(new Timestamp(0, 0));
    }
    static max() {
      return new _SnapshotVersion(new Timestamp(253402300799, 999999999));
    }
    constructor(e) {
      this.timestamp = e;
    }
    compareTo(e) {
      return this.timestamp._compareTo(e.timestamp);
    }
    isEqual(e) {
      return this.timestamp.isEqual(e.timestamp);
    }
    /** Returns a number representation of the version for use in spec tests. */
    toMicroseconds() {
      return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
    }
    toString() {
      return "SnapshotVersion(" + this.timestamp.toString() + ")";
    }
    toTimestamp() {
      return this.timestamp;
    }
  };
  var Q = -1;
  var FieldIndex = class {
    constructor(e, t, n, r) {
      this.indexId = e, this.collectionGroup = t, this.fields = n, this.indexState = r;
    }
  };
  FieldIndex.UNKNOWN_ID = -1;
  function __PRIVATE_newIndexOffsetSuccessorFromReadTime(e, t) {
    const n = e.toTimestamp().seconds, r = e.toTimestamp().nanoseconds + 1, i = SnapshotVersion.fromTimestamp(1e9 === r ? new Timestamp(n + 1, 0) : new Timestamp(n, r));
    return new IndexOffset(i, DocumentKey.empty(), t);
  }
  function __PRIVATE_newIndexOffsetFromDocument(e) {
    return new IndexOffset(e.readTime, e.key, Q);
  }
  var IndexOffset = class _IndexOffset {
    constructor(e, t, n) {
      this.readTime = e, this.documentKey = t, this.largestBatchId = n;
    }
    /** Returns an offset that sorts before all regular offsets. */
    static min() {
      return new _IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), Q);
    }
    /** Returns an offset that sorts after all regular offsets. */
    static max() {
      return new _IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), Q);
    }
  };
  function __PRIVATE_indexOffsetComparator(e, t) {
    let n = e.readTime.compareTo(t.readTime);
    return 0 !== n ? n : (n = DocumentKey.comparator(e.documentKey, t.documentKey), 0 !== n ? n : __PRIVATE_primitiveComparator(e.largestBatchId, t.largestBatchId));
  }
  var $ = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
  var PersistenceTransaction = class {
    constructor() {
      this.onCommittedListeners = [];
    }
    addOnCommittedListener(e) {
      this.onCommittedListeners.push(e);
    }
    raiseOnCommittedEvent() {
      this.onCommittedListeners.forEach(((e) => e()));
    }
  };
  async function __PRIVATE_ignoreIfPrimaryLeaseLoss(e) {
    if (e.code !== N.FAILED_PRECONDITION || e.message !== $) throw e;
    __PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
  }
  var PersistencePromise = class _PersistencePromise {
    constructor(e) {
      this.nextCallback = null, this.catchCallback = null, // When the operation resolves, we'll set result or error and mark isDone.
      this.result = void 0, this.error = void 0, this.isDone = false, // Set to true when .then() or .catch() are called and prevents additional
      // chaining.
      this.callbackAttached = false, e(((e2) => {
        this.isDone = true, this.result = e2, this.nextCallback && // value should be defined unless T is Void, but we can't express
        // that in the type system.
        this.nextCallback(e2);
      }), ((e2) => {
        this.isDone = true, this.error = e2, this.catchCallback && this.catchCallback(e2);
      }));
    }
    catch(e) {
      return this.next(void 0, e);
    }
    next(e, t) {
      return this.callbackAttached && fail(59440), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new _PersistencePromise(((n, r) => {
        this.nextCallback = (t2) => {
          this.wrapSuccess(e, t2).next(n, r);
        }, this.catchCallback = (e2) => {
          this.wrapFailure(t, e2).next(n, r);
        };
      }));
    }
    toPromise() {
      return new Promise(((e, t) => {
        this.next(e, t);
      }));
    }
    wrapUserFunction(e) {
      try {
        const t = e();
        return t instanceof _PersistencePromise ? t : _PersistencePromise.resolve(t);
      } catch (e2) {
        return _PersistencePromise.reject(e2);
      }
    }
    wrapSuccess(e, t) {
      return e ? this.wrapUserFunction((() => e(t))) : _PersistencePromise.resolve(t);
    }
    wrapFailure(e, t) {
      return e ? this.wrapUserFunction((() => e(t))) : _PersistencePromise.reject(t);
    }
    static resolve(e) {
      return new _PersistencePromise(((t, n) => {
        t(e);
      }));
    }
    static reject(e) {
      return new _PersistencePromise(((t, n) => {
        n(e);
      }));
    }
    static waitFor(e) {
      return new _PersistencePromise(((t, n) => {
        let r = 0, i = 0, s = false;
        e.forEach(((e2) => {
          ++r, e2.next((() => {
            ++i, s && i === r && t();
          }), ((e3) => n(e3)));
        })), s = true, i === r && t();
      }));
    }
    /**
     * Given an array of predicate functions that asynchronously evaluate to a
     * boolean, implements a short-circuiting `or` between the results. Predicates
     * will be evaluated until one of them returns `true`, then stop. The final
     * result will be whether any of them returned `true`.
     */
    static or(e) {
      let t = _PersistencePromise.resolve(false);
      for (const n of e) t = t.next(((e2) => e2 ? _PersistencePromise.resolve(e2) : n()));
      return t;
    }
    static forEach(e, t) {
      const n = [];
      return e.forEach(((e2, r) => {
        n.push(t.call(this, e2, r));
      })), this.waitFor(n);
    }
    /**
     * Concurrently map all array elements through asynchronous function.
     */
    static mapArray(e, t) {
      return new _PersistencePromise(((n, r) => {
        const i = e.length, s = new Array(i);
        let o = 0;
        for (let _ = 0; _ < i; _++) {
          const a = _;
          t(e[a]).next(((e2) => {
            s[a] = e2, ++o, o === i && n(s);
          }), ((e2) => r(e2)));
        }
      }));
    }
    /**
     * An alternative to recursive PersistencePromise calls, that avoids
     * potential memory problems from unbounded chains of promises.
     *
     * The `action` will be called repeatedly while `condition` is true.
     */
    static doWhile(e, t) {
      return new _PersistencePromise(((n, r) => {
        const process2 = () => {
          true === e() ? t().next((() => {
            process2();
          }), r) : n();
        };
        process2();
      }));
    }
  };
  function __PRIVATE_getAndroidVersion(e) {
    const t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
    return Number(n);
  }
  function __PRIVATE_isIndexedDbTransactionError(e) {
    return "IndexedDbTransactionError" === e.name;
  }
  var __PRIVATE_ListenSequence = class {
    constructor(e, t) {
      this.previousValue = e, t && (t.sequenceNumberHandler = (e2) => this._e(e2), this.ae = (e2) => t.writeSequenceNumber(e2));
    }
    _e(e) {
      return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
    }
    next() {
      const e = ++this.previousValue;
      return this.ae && this.ae(e), e;
    }
  };
  __PRIVATE_ListenSequence.ue = -1;
  var G = -1;
  function __PRIVATE_isNullOrUndefined(e) {
    return null == e;
  }
  function __PRIVATE_isNegativeZero(e) {
    return 0 === e && 1 / e == -1 / 0;
  }
  function isSafeInteger(e) {
    return "number" == typeof e && Number.isInteger(e) && !__PRIVATE_isNegativeZero(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER;
  }
  var z = "";
  function __PRIVATE_encodeResourcePath(e) {
    let t = "";
    for (let n = 0; n < e.length; n++) t.length > 0 && (t = __PRIVATE_encodeSeparator(t)), t = __PRIVATE_encodeSegment(e.get(n), t);
    return __PRIVATE_encodeSeparator(t);
  }
  function __PRIVATE_encodeSegment(e, t) {
    let n = t;
    const r = e.length;
    for (let t2 = 0; t2 < r; t2++) {
      const r2 = e.charAt(t2);
      switch (r2) {
        case "\0":
          n += "";
          break;
        case z:
          n += "";
          break;
        default:
          n += r2;
      }
    }
    return n;
  }
  function __PRIVATE_encodeSeparator(e) {
    return e + z + "";
  }
  var j = "remoteDocuments";
  var J = "owner";
  var Y = "mutationQueues";
  var X = "mutations";
  var ie = "documentMutations";
  var se = "remoteDocumentsV14";
  var le = "remoteDocumentGlobal";
  var Pe = "targets";
  var de = "targetDocuments";
  var me = "targetGlobal";
  var fe = "collectionParents";
  var pe = "clientMetadata";
  var we = "bundles";
  var be = "namedQueries";
  var ve = "indexConfiguration";
  var xe = "indexState";
  var Le = "indexEntries";
  var $e = "documentOverlays";
  var je = "globals";
  var He = [...[...[...[...[Y, X, ie, j, Pe, J, me, de], pe], le], fe], we, be];
  var Ye = [...He, $e];
  var Ze = [Y, X, ie, se, Pe, J, me, de, pe, le, fe, we, be, $e];
  var Xe = Ze;
  var et = [...Xe, ve, xe, Le];
  var nt = [...et, je];
  function __PRIVATE_objectSize(e) {
    let t = 0;
    for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
    return t;
  }
  function forEach(e, t) {
    for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
  }
  function isEmpty2(e) {
    for (const t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return false;
    return true;
  }
  var SortedMap = class _SortedMap {
    constructor(e, t) {
      this.comparator = e, this.root = t || LLRBNode.EMPTY;
    }
    // Returns a copy of the map, with the specified key/value added or replaced.
    insert(e, t) {
      return new _SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns a copy of the map, with the specified key removed.
    remove(e) {
      return new _SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns the value of the node with the given key, or null.
    get(e) {
      let t = this.root;
      for (; !t.isEmpty(); ) {
        const n = this.comparator(e, t.key);
        if (0 === n) return t.value;
        n < 0 ? t = t.left : n > 0 && (t = t.right);
      }
      return null;
    }
    // Returns the index of the element in this sorted map, or -1 if it doesn't
    // exist.
    indexOf(e) {
      let t = 0, n = this.root;
      for (; !n.isEmpty(); ) {
        const r = this.comparator(e, n.key);
        if (0 === r) return t + n.left.size;
        r < 0 ? n = n.left : (
          // Count all nodes left of the node plus the node itself
          (t += n.left.size + 1, n = n.right)
        );
      }
      return -1;
    }
    isEmpty() {
      return this.root.isEmpty();
    }
    // Returns the total number of nodes in the map.
    get size() {
      return this.root.size;
    }
    // Returns the minimum key in the map.
    minKey() {
      return this.root.minKey();
    }
    // Returns the maximum key in the map.
    maxKey() {
      return this.root.maxKey();
    }
    // Traverses the map in key order and calls the specified action function
    // for each key/value pair. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(e) {
      return this.root.inorderTraversal(e);
    }
    forEach(e) {
      this.inorderTraversal(((t, n) => (e(t, n), false)));
    }
    toString() {
      const e = [];
      return this.inorderTraversal(((t, n) => (e.push(`${t}:${n}`), false))), `{${e.join(", ")}}`;
    }
    // Traverses the map in reverse key order and calls the specified action
    // function for each key/value pair. If action returns true, traversal is
    // aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(e) {
      return this.root.reverseTraversal(e);
    }
    // Returns an iterator over the SortedMap.
    getIterator() {
      return new SortedMapIterator(this.root, null, this.comparator, false);
    }
    getIteratorFrom(e) {
      return new SortedMapIterator(this.root, e, this.comparator, false);
    }
    getReverseIterator() {
      return new SortedMapIterator(this.root, null, this.comparator, true);
    }
    getReverseIteratorFrom(e) {
      return new SortedMapIterator(this.root, e, this.comparator, true);
    }
  };
  var SortedMapIterator = class {
    constructor(e, t, n, r) {
      this.isReverse = r, this.nodeStack = [];
      let i = 1;
      for (; !e.isEmpty(); ) if (i = t ? n(e.key, t) : 1, // flip the comparison if we're going in reverse
      t && r && (i *= -1), i < 0)
        e = this.isReverse ? e.left : e.right;
      else {
        if (0 === i) {
          this.nodeStack.push(e);
          break;
        }
        this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
      }
    }
    getNext() {
      let e = this.nodeStack.pop();
      const t = {
        key: e.key,
        value: e.value
      };
      if (this.isReverse) for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), e = e.right;
      else for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), e = e.left;
      return t;
    }
    hasNext() {
      return this.nodeStack.length > 0;
    }
    peek() {
      if (0 === this.nodeStack.length) return null;
      const e = this.nodeStack[this.nodeStack.length - 1];
      return {
        key: e.key,
        value: e.value
      };
    }
  };
  var LLRBNode = class _LLRBNode {
    constructor(e, t, n, r, i) {
      this.key = e, this.value = t, this.color = null != n ? n : _LLRBNode.RED, this.left = null != r ? r : _LLRBNode.EMPTY, this.right = null != i ? i : _LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
    }
    // Returns a copy of the current node, optionally replacing pieces of it.
    copy(e, t, n, r, i) {
      return new _LLRBNode(null != e ? e : this.key, null != t ? t : this.value, null != n ? n : this.color, null != r ? r : this.left, null != i ? i : this.right);
    }
    isEmpty() {
      return false;
    }
    // Traverses the tree in key order and calls the specified action function
    // for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(e) {
      return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
    }
    // Traverses the tree in reverse key order and calls the specified action
    // function for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(e) {
      return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
    }
    // Returns the minimum node in the tree.
    min() {
      return this.left.isEmpty() ? this : this.left.min();
    }
    // Returns the maximum key in the tree.
    minKey() {
      return this.min().key;
    }
    // Returns the maximum key in the tree.
    maxKey() {
      return this.right.isEmpty() ? this.key : this.right.maxKey();
    }
    // Returns new tree, with the key/value added.
    insert(e, t, n) {
      let r = this;
      const i = n(e, r.key);
      return r = i < 0 ? r.copy(null, null, null, r.left.insert(e, t, n), null) : 0 === i ? r.copy(null, t, null, null, null) : r.copy(null, null, null, null, r.right.insert(e, t, n)), r.fixUp();
    }
    removeMin() {
      if (this.left.isEmpty()) return _LLRBNode.EMPTY;
      let e = this;
      return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
    }
    // Returns new tree, with the specified item removed.
    remove(e, t) {
      let n, r = this;
      if (t(e, r.key) < 0) r.left.isEmpty() || r.left.isRed() || r.left.left.isRed() || (r = r.moveRedLeft()), r = r.copy(null, null, null, r.left.remove(e, t), null);
      else {
        if (r.left.isRed() && (r = r.rotateRight()), r.right.isEmpty() || r.right.isRed() || r.right.left.isRed() || (r = r.moveRedRight()), 0 === t(e, r.key)) {
          if (r.right.isEmpty()) return _LLRBNode.EMPTY;
          n = r.right.min(), r = r.copy(n.key, n.value, null, null, r.right.removeMin());
        }
        r = r.copy(null, null, null, null, r.right.remove(e, t));
      }
      return r.fixUp();
    }
    isRed() {
      return this.color;
    }
    // Returns new tree after performing any needed rotations.
    fixUp() {
      let e = this;
      return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
    }
    moveRedLeft() {
      let e = this.colorFlip();
      return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
    }
    moveRedRight() {
      let e = this.colorFlip();
      return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
    }
    rotateLeft() {
      const e = this.copy(null, null, _LLRBNode.RED, null, this.right.left);
      return this.right.copy(null, null, this.color, e, null);
    }
    rotateRight() {
      const e = this.copy(null, null, _LLRBNode.RED, this.left.right, null);
      return this.left.copy(null, null, this.color, null, e);
    }
    colorFlip() {
      const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
      return this.copy(null, null, !this.color, e, t);
    }
    // For testing.
    checkMaxDepth() {
      const e = this.check();
      return Math.pow(2, e) <= this.size + 1;
    }
    // In a balanced RB tree, the black-depth (number of black nodes) from root to
    // leaves is equal on both sides.  This function verifies that or asserts.
    check() {
      if (this.isRed() && this.left.isRed()) throw fail(43730, {
        key: this.key,
        value: this.value
      });
      if (this.right.isRed()) throw fail(14113, {
        key: this.key,
        value: this.value
      });
      const e = this.left.check();
      if (e !== this.right.check()) throw fail(27949);
      return e + (this.isRed() ? 0 : 1);
    }
  };
  LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
  LLRBNode.EMPTY = new // Represents an empty node (a leaf node in the Red-Black Tree).
  class LLRBEmptyNode {
    constructor() {
      this.size = 0;
    }
    get key() {
      throw fail(57766);
    }
    get value() {
      throw fail(16141);
    }
    get color() {
      throw fail(16727);
    }
    get left() {
      throw fail(29726);
    }
    get right() {
      throw fail(36894);
    }
    // Returns a copy of the current node.
    copy(e, t, n, r, i) {
      return this;
    }
    // Returns a copy of the tree, with the specified key/value added.
    insert(e, t, n) {
      return new LLRBNode(e, t);
    }
    // Returns a copy of the tree, with the specified key removed.
    remove(e, t) {
      return this;
    }
    isEmpty() {
      return true;
    }
    inorderTraversal(e) {
      return false;
    }
    reverseTraversal(e) {
      return false;
    }
    minKey() {
      return null;
    }
    maxKey() {
      return null;
    }
    isRed() {
      return false;
    }
    // For testing.
    checkMaxDepth() {
      return true;
    }
    check() {
      return 0;
    }
  }();
  var SortedSet = class _SortedSet {
    constructor(e) {
      this.comparator = e, this.data = new SortedMap(this.comparator);
    }
    has(e) {
      return null !== this.data.get(e);
    }
    first() {
      return this.data.minKey();
    }
    last() {
      return this.data.maxKey();
    }
    get size() {
      return this.data.size;
    }
    indexOf(e) {
      return this.data.indexOf(e);
    }
    /** Iterates elements in order defined by "comparator" */
    forEach(e) {
      this.data.inorderTraversal(((t, n) => (e(t), false)));
    }
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
    forEachInRange(e, t) {
      const n = this.data.getIteratorFrom(e[0]);
      for (; n.hasNext(); ) {
        const r = n.getNext();
        if (this.comparator(r.key, e[1]) >= 0) return;
        t(r.key);
      }
    }
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */
    forEachWhile(e, t) {
      let n;
      for (n = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); n.hasNext(); ) {
        if (!e(n.getNext().key)) return;
      }
    }
    /** Finds the least element greater than or equal to `elem`. */
    firstAfterOrEqual(e) {
      const t = this.data.getIteratorFrom(e);
      return t.hasNext() ? t.getNext().key : null;
    }
    getIterator() {
      return new SortedSetIterator(this.data.getIterator());
    }
    getIteratorFrom(e) {
      return new SortedSetIterator(this.data.getIteratorFrom(e));
    }
    /** Inserts or updates an element */
    add(e) {
      return this.copy(this.data.remove(e).insert(e, true));
    }
    /** Deletes an element */
    delete(e) {
      return this.has(e) ? this.copy(this.data.remove(e)) : this;
    }
    isEmpty() {
      return this.data.isEmpty();
    }
    unionWith(e) {
      let t = this;
      return t.size < e.size && (t = e, e = this), e.forEach(((e2) => {
        t = t.add(e2);
      })), t;
    }
    isEqual(e) {
      if (!(e instanceof _SortedSet)) return false;
      if (this.size !== e.size) return false;
      const t = this.data.getIterator(), n = e.data.getIterator();
      for (; t.hasNext(); ) {
        const e2 = t.getNext().key, r = n.getNext().key;
        if (0 !== this.comparator(e2, r)) return false;
      }
      return true;
    }
    toArray() {
      const e = [];
      return this.forEach(((t) => {
        e.push(t);
      })), e;
    }
    toString() {
      const e = [];
      return this.forEach(((t) => e.push(t))), "SortedSet(" + e.toString() + ")";
    }
    copy(e) {
      const t = new _SortedSet(this.comparator);
      return t.data = e, t;
    }
  };
  var SortedSetIterator = class {
    constructor(e) {
      this.iter = e;
    }
    getNext() {
      return this.iter.getNext().key;
    }
    hasNext() {
      return this.iter.hasNext();
    }
  };
  var FieldMask = class _FieldMask {
    constructor(e) {
      this.fields = e, // TODO(dimond): validation of FieldMask
      // Sort the field mask to support `FieldMask.isEqual()` and assert below.
      e.sort(FieldPath$1.comparator);
    }
    static empty() {
      return new _FieldMask([]);
    }
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */
    unionWith(e) {
      let t = new SortedSet(FieldPath$1.comparator);
      for (const e2 of this.fields) t = t.add(e2);
      for (const n of e) t = t.add(n);
      return new _FieldMask(t.toArray());
    }
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */
    covers(e) {
      for (const t of this.fields) if (t.isPrefixOf(e)) return true;
      return false;
    }
    isEqual(e) {
      return __PRIVATE_arrayEquals(this.fields, e.fields, ((e2, t) => e2.isEqual(t)));
    }
  };
  var __PRIVATE_Base64DecodeError = class extends Error {
    constructor() {
      super(...arguments), this.name = "Base64DecodeError";
    }
  };
  var ByteString = class _ByteString {
    constructor(e) {
      this.binaryString = e;
    }
    static fromBase64String(e) {
      const t = (function __PRIVATE_decodeBase64(e2) {
        try {
          return atob(e2);
        } catch (e3) {
          throw "undefined" != typeof DOMException && e3 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e3) : e3;
        }
      })(e);
      return new _ByteString(t);
    }
    static fromUint8Array(e) {
      const t = (
        /**
        * Helper function to convert an Uint8array to a binary string.
        */
        (function __PRIVATE_binaryStringFromUint8Array(e2) {
          let t2 = "";
          for (let n = 0; n < e2.length; ++n) t2 += String.fromCharCode(e2[n]);
          return t2;
        })(e)
      );
      return new _ByteString(t);
    }
    [Symbol.iterator]() {
      let e = 0;
      return {
        next: () => e < this.binaryString.length ? {
          value: this.binaryString.charCodeAt(e++),
          done: false
        } : {
          value: void 0,
          done: true
        }
      };
    }
    toBase64() {
      return (function __PRIVATE_encodeBase64(e) {
        return btoa(e);
      })(this.binaryString);
    }
    toUint8Array() {
      return (function __PRIVATE_uint8ArrayFromBinaryString(e) {
        const t = new Uint8Array(e.length);
        for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
        return t;
      })(this.binaryString);
    }
    approximateByteSize() {
      return 2 * this.binaryString.length;
    }
    compareTo(e) {
      return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
    }
    isEqual(e) {
      return this.binaryString === e.binaryString;
    }
  };
  ByteString.EMPTY_BYTE_STRING = new ByteString("");
  var it = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
  function __PRIVATE_normalizeTimestamp(e) {
    if (__PRIVATE_hardAssert(!!e, 39018), "string" == typeof e) {
      let t = 0;
      const n = it.exec(e);
      if (__PRIVATE_hardAssert(!!n, 46558, {
        timestamp: e
      }), n[1]) {
        let e2 = n[1];
        e2 = (e2 + "000000000").substr(0, 9), t = Number(e2);
      }
      const r = new Date(e);
      return {
        seconds: Math.floor(r.getTime() / 1e3),
        nanos: t
      };
    }
    return {
      seconds: __PRIVATE_normalizeNumber(e.seconds),
      nanos: __PRIVATE_normalizeNumber(e.nanos)
    };
  }
  function __PRIVATE_normalizeNumber(e) {
    return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
  }
  function __PRIVATE_normalizeByteString(e) {
    return "string" == typeof e ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
  }
  var st = "server_timestamp";
  var ot = "__type__";
  var _t = "__previous_value__";
  var at = "__local_write_time__";
  function __PRIVATE_isServerTimestamp(e) {
    var t, n;
    return (null === (n = ((null === (t = null == e ? void 0 : e.mapValue) || void 0 === t ? void 0 : t.fields) || {})[ot]) || void 0 === n ? void 0 : n.stringValue) === st;
  }
  function __PRIVATE_getPreviousValue(e) {
    const t = e.mapValue.fields[_t];
    return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
  }
  function __PRIVATE_getLocalWriteTime(e) {
    const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields[at].timestampValue);
    return new Timestamp(t.seconds, t.nanos);
  }
  var DatabaseInfo = class {
    /**
     * Constructs a DatabaseInfo using the provided host, databaseId and
     * persistenceKey.
     *
     * @param databaseId - The database to use.
     * @param appId - The Firebase App Id.
     * @param persistenceKey - A unique identifier for this Firestore's local
     * storage (used in conjunction with the databaseId).
     * @param host - The Firestore backend host to connect to.
     * @param ssl - Whether to use SSL when connecting.
     * @param forceLongPolling - Whether to use the forceLongPolling option
     * when using WebChannel as the network transport.
     * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
     * option when using WebChannel as the network transport.
     * @param longPollingOptions Options that configure long-polling.
     * @param useFetchStreams Whether to use the Fetch API instead of
     * XMLHTTPRequest
     */
    constructor(e, t, n, r, i, s, o, _, a, u) {
      this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r, this.ssl = i, this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = _, this.useFetchStreams = a, this.isUsingEmulator = u;
    }
  };
  var ut = "(default)";
  var DatabaseId = class _DatabaseId {
    constructor(e, t) {
      this.projectId = e, this.database = t || ut;
    }
    static empty() {
      return new _DatabaseId("", "");
    }
    get isDefaultDatabase() {
      return this.database === ut;
    }
    isEqual(e) {
      return e instanceof _DatabaseId && e.projectId === this.projectId && e.database === this.database;
    }
  };
  var ct = "__type__";
  var lt = "__max__";
  var ht = {
    mapValue: {
      fields: {
        __type__: {
          stringValue: lt
        }
      }
    }
  };
  var Pt = "__vector__";
  var Tt = "value";
  function __PRIVATE_typeOrder(e) {
    return "nullValue" in e ? 0 : "booleanValue" in e ? 1 : "integerValue" in e || "doubleValue" in e ? 2 : "timestampValue" in e ? 3 : "stringValue" in e ? 5 : "bytesValue" in e ? 6 : "referenceValue" in e ? 7 : "geoPointValue" in e ? 8 : "arrayValue" in e ? 9 : "mapValue" in e ? __PRIVATE_isServerTimestamp(e) ? 4 : __PRIVATE_isMaxValue(e) ? 9007199254740991 : __PRIVATE_isVectorValue(e) ? 10 : 11 : fail(28295, {
      value: e
    });
  }
  function __PRIVATE_valueEquals(e, t) {
    if (e === t) return true;
    const n = __PRIVATE_typeOrder(e);
    if (n !== __PRIVATE_typeOrder(t)) return false;
    switch (n) {
      case 0:
      case 9007199254740991:
        return true;
      case 1:
        return e.booleanValue === t.booleanValue;
      case 4:
        return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));
      case 3:
        return (function __PRIVATE_timestampEquals(e2, t2) {
          if ("string" == typeof e2.timestampValue && "string" == typeof t2.timestampValue && e2.timestampValue.length === t2.timestampValue.length)
            return e2.timestampValue === t2.timestampValue;
          const n2 = __PRIVATE_normalizeTimestamp(e2.timestampValue), r = __PRIVATE_normalizeTimestamp(t2.timestampValue);
          return n2.seconds === r.seconds && n2.nanos === r.nanos;
        })(e, t);
      case 5:
        return e.stringValue === t.stringValue;
      case 6:
        return (function __PRIVATE_blobEquals(e2, t2) {
          return __PRIVATE_normalizeByteString(e2.bytesValue).isEqual(__PRIVATE_normalizeByteString(t2.bytesValue));
        })(e, t);
      case 7:
        return e.referenceValue === t.referenceValue;
      case 8:
        return (function __PRIVATE_geoPointEquals(e2, t2) {
          return __PRIVATE_normalizeNumber(e2.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e2.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.longitude);
        })(e, t);
      case 2:
        return (function __PRIVATE_numberEquals(e2, t2) {
          if ("integerValue" in e2 && "integerValue" in t2) return __PRIVATE_normalizeNumber(e2.integerValue) === __PRIVATE_normalizeNumber(t2.integerValue);
          if ("doubleValue" in e2 && "doubleValue" in t2) {
            const n2 = __PRIVATE_normalizeNumber(e2.doubleValue), r = __PRIVATE_normalizeNumber(t2.doubleValue);
            return n2 === r ? __PRIVATE_isNegativeZero(n2) === __PRIVATE_isNegativeZero(r) : isNaN(n2) && isNaN(r);
          }
          return false;
        })(e, t);
      case 9:
        return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], __PRIVATE_valueEquals);
      case 10:
      case 11:
        return (function __PRIVATE_objectEquals(e2, t2) {
          const n2 = e2.mapValue.fields || {}, r = t2.mapValue.fields || {};
          if (__PRIVATE_objectSize(n2) !== __PRIVATE_objectSize(r)) return false;
          for (const e3 in n2) if (n2.hasOwnProperty(e3) && (void 0 === r[e3] || !__PRIVATE_valueEquals(n2[e3], r[e3]))) return false;
          return true;
        })(e, t);
      default:
        return fail(52216, {
          left: e
        });
    }
  }
  function __PRIVATE_arrayValueContains(e, t) {
    return void 0 !== (e.values || []).find(((e2) => __PRIVATE_valueEquals(e2, t)));
  }
  function __PRIVATE_valueCompare(e, t) {
    if (e === t) return 0;
    const n = __PRIVATE_typeOrder(e), r = __PRIVATE_typeOrder(t);
    if (n !== r) return __PRIVATE_primitiveComparator(n, r);
    switch (n) {
      case 0:
      case 9007199254740991:
        return 0;
      case 1:
        return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);
      case 2:
        return (function __PRIVATE_compareNumbers(e2, t2) {
          const n2 = __PRIVATE_normalizeNumber(e2.integerValue || e2.doubleValue), r2 = __PRIVATE_normalizeNumber(t2.integerValue || t2.doubleValue);
          return n2 < r2 ? -1 : n2 > r2 ? 1 : n2 === r2 ? 0 : (
            // one or both are NaN.
            isNaN(n2) ? isNaN(r2) ? 0 : -1 : 1
          );
        })(e, t);
      case 3:
        return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);
      case 4:
        return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));
      case 5:
        return __PRIVATE_compareUtf8Strings(e.stringValue, t.stringValue);
      case 6:
        return (function __PRIVATE_compareBlobs(e2, t2) {
          const n2 = __PRIVATE_normalizeByteString(e2), r2 = __PRIVATE_normalizeByteString(t2);
          return n2.compareTo(r2);
        })(e.bytesValue, t.bytesValue);
      case 7:
        return (function __PRIVATE_compareReferences(e2, t2) {
          const n2 = e2.split("/"), r2 = t2.split("/");
          for (let e3 = 0; e3 < n2.length && e3 < r2.length; e3++) {
            const t3 = __PRIVATE_primitiveComparator(n2[e3], r2[e3]);
            if (0 !== t3) return t3;
          }
          return __PRIVATE_primitiveComparator(n2.length, r2.length);
        })(e.referenceValue, t.referenceValue);
      case 8:
        return (function __PRIVATE_compareGeoPoints(e2, t2) {
          const n2 = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.latitude), __PRIVATE_normalizeNumber(t2.latitude));
          if (0 !== n2) return n2;
          return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.longitude), __PRIVATE_normalizeNumber(t2.longitude));
        })(e.geoPointValue, t.geoPointValue);
      case 9:
        return __PRIVATE_compareArrays(e.arrayValue, t.arrayValue);
      case 10:
        return (function __PRIVATE_compareVectors(e2, t2) {
          var n2, r2, i, s;
          const o = e2.fields || {}, _ = t2.fields || {}, a = null === (n2 = o[Tt]) || void 0 === n2 ? void 0 : n2.arrayValue, u = null === (r2 = _[Tt]) || void 0 === r2 ? void 0 : r2.arrayValue, c = __PRIVATE_primitiveComparator((null === (i = null == a ? void 0 : a.values) || void 0 === i ? void 0 : i.length) || 0, (null === (s = null == u ? void 0 : u.values) || void 0 === s ? void 0 : s.length) || 0);
          if (0 !== c) return c;
          return __PRIVATE_compareArrays(a, u);
        })(e.mapValue, t.mapValue);
      case 11:
        return (function __PRIVATE_compareMaps(e2, t2) {
          if (e2 === ht.mapValue && t2 === ht.mapValue) return 0;
          if (e2 === ht.mapValue) return 1;
          if (t2 === ht.mapValue) return -1;
          const n2 = e2.fields || {}, r2 = Object.keys(n2), i = t2.fields || {}, s = Object.keys(i);
          r2.sort(), s.sort();
          for (let e3 = 0; e3 < r2.length && e3 < s.length; ++e3) {
            const t3 = __PRIVATE_compareUtf8Strings(r2[e3], s[e3]);
            if (0 !== t3) return t3;
            const o = __PRIVATE_valueCompare(n2[r2[e3]], i[s[e3]]);
            if (0 !== o) return o;
          }
          return __PRIVATE_primitiveComparator(r2.length, s.length);
        })(e.mapValue, t.mapValue);
      default:
        throw fail(23264, {
          le: n
        });
    }
  }
  function __PRIVATE_compareTimestamps(e, t) {
    if ("string" == typeof e && "string" == typeof t && e.length === t.length) return __PRIVATE_primitiveComparator(e, t);
    const n = __PRIVATE_normalizeTimestamp(e), r = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(n.seconds, r.seconds);
    return 0 !== i ? i : __PRIVATE_primitiveComparator(n.nanos, r.nanos);
  }
  function __PRIVATE_compareArrays(e, t) {
    const n = e.values || [], r = t.values || [];
    for (let e2 = 0; e2 < n.length && e2 < r.length; ++e2) {
      const t2 = __PRIVATE_valueCompare(n[e2], r[e2]);
      if (t2) return t2;
    }
    return __PRIVATE_primitiveComparator(n.length, r.length);
  }
  function canonicalId(e) {
    return __PRIVATE_canonifyValue(e);
  }
  function __PRIVATE_canonifyValue(e) {
    return "nullValue" in e ? "null" : "booleanValue" in e ? "" + e.booleanValue : "integerValue" in e ? "" + e.integerValue : "doubleValue" in e ? "" + e.doubleValue : "timestampValue" in e ? (function __PRIVATE_canonifyTimestamp(e2) {
      const t = __PRIVATE_normalizeTimestamp(e2);
      return `time(${t.seconds},${t.nanos})`;
    })(e.timestampValue) : "stringValue" in e ? e.stringValue : "bytesValue" in e ? (function __PRIVATE_canonifyByteString(e2) {
      return __PRIVATE_normalizeByteString(e2).toBase64();
    })(e.bytesValue) : "referenceValue" in e ? (function __PRIVATE_canonifyReference(e2) {
      return DocumentKey.fromName(e2).toString();
    })(e.referenceValue) : "geoPointValue" in e ? (function __PRIVATE_canonifyGeoPoint(e2) {
      return `geo(${e2.latitude},${e2.longitude})`;
    })(e.geoPointValue) : "arrayValue" in e ? (function __PRIVATE_canonifyArray(e2) {
      let t = "[", n = true;
      for (const r of e2.values || []) n ? n = false : t += ",", t += __PRIVATE_canonifyValue(r);
      return t + "]";
    })(e.arrayValue) : "mapValue" in e ? (function __PRIVATE_canonifyMap(e2) {
      const t = Object.keys(e2.fields || {}).sort();
      let n = "{", r = true;
      for (const i of t) r ? r = false : n += ",", n += `${i}:${__PRIVATE_canonifyValue(e2.fields[i])}`;
      return n + "}";
    })(e.mapValue) : fail(61005, {
      value: e
    });
  }
  function __PRIVATE_estimateByteSize(e) {
    switch (__PRIVATE_typeOrder(e)) {
      case 0:
      case 1:
        return 4;
      case 2:
        return 8;
      case 3:
      case 8:
        return 16;
      case 4:
        const t = __PRIVATE_getPreviousValue(e);
        return t ? 16 + __PRIVATE_estimateByteSize(t) : 16;
      case 5:
        return 2 * e.stringValue.length;
      case 6:
        return __PRIVATE_normalizeByteString(e.bytesValue).approximateByteSize();
      case 7:
        return e.referenceValue.length;
      case 9:
        return (function __PRIVATE_estimateArrayByteSize(e2) {
          return (e2.values || []).reduce(((e3, t2) => e3 + __PRIVATE_estimateByteSize(t2)), 0);
        })(e.arrayValue);
      case 10:
      case 11:
        return (function __PRIVATE_estimateMapByteSize(e2) {
          let t2 = 0;
          return forEach(e2.fields, ((e3, n) => {
            t2 += e3.length + __PRIVATE_estimateByteSize(n);
          })), t2;
        })(e.mapValue);
      default:
        throw fail(13486, {
          value: e
        });
    }
  }
  function __PRIVATE_refValue(e, t) {
    return {
      referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`
    };
  }
  function isInteger(e) {
    return !!e && "integerValue" in e;
  }
  function isArray(e) {
    return !!e && "arrayValue" in e;
  }
  function __PRIVATE_isNullValue(e) {
    return !!e && "nullValue" in e;
  }
  function __PRIVATE_isNanValue(e) {
    return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
  }
  function __PRIVATE_isMapValue(e) {
    return !!e && "mapValue" in e;
  }
  function __PRIVATE_isVectorValue(e) {
    var t, n;
    return (null === (n = ((null === (t = null == e ? void 0 : e.mapValue) || void 0 === t ? void 0 : t.fields) || {})[ct]) || void 0 === n ? void 0 : n.stringValue) === Pt;
  }
  function __PRIVATE_deepClone(e) {
    if (e.geoPointValue) return {
      geoPointValue: Object.assign({}, e.geoPointValue)
    };
    if (e.timestampValue && "object" == typeof e.timestampValue) return {
      timestampValue: Object.assign({}, e.timestampValue)
    };
    if (e.mapValue) {
      const t = {
        mapValue: {
          fields: {}
        }
      };
      return forEach(e.mapValue.fields, ((e2, n) => t.mapValue.fields[e2] = __PRIVATE_deepClone(n))), t;
    }
    if (e.arrayValue) {
      const t = {
        arrayValue: {
          values: []
        }
      };
      for (let n = 0; n < (e.arrayValue.values || []).length; ++n) t.arrayValue.values[n] = __PRIVATE_deepClone(e.arrayValue.values[n]);
      return t;
    }
    return Object.assign({}, e);
  }
  function __PRIVATE_isMaxValue(e) {
    return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === lt;
  }
  var dt = {
    mapValue: {
      fields: {
        [ct]: {
          stringValue: Pt
        },
        [Tt]: {
          arrayValue: {}
        }
      }
    }
  };
  var ObjectValue = class _ObjectValue {
    constructor(e) {
      this.value = e;
    }
    static empty() {
      return new _ObjectValue({
        mapValue: {}
      });
    }
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */
    field(e) {
      if (e.isEmpty()) return this.value;
      {
        let t = this.value;
        for (let n = 0; n < e.length - 1; ++n) if (t = (t.mapValue.fields || {})[e.get(n)], !__PRIVATE_isMapValue(t)) return null;
        return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
      }
    }
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */
    set(e, t) {
      this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
    }
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */
    setAll(e) {
      let t = FieldPath$1.emptyPath(), n = {}, r = [];
      e.forEach(((e2, i2) => {
        if (!t.isImmediateParentOf(i2)) {
          const e3 = this.getFieldsMap(t);
          this.applyChanges(e3, n, r), n = {}, r = [], t = i2.popLast();
        }
        e2 ? n[i2.lastSegment()] = __PRIVATE_deepClone(e2) : r.push(i2.lastSegment());
      }));
      const i = this.getFieldsMap(t);
      this.applyChanges(i, n, r);
    }
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */
    delete(e) {
      const t = this.field(e.popLast());
      __PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
    }
    isEqual(e) {
      return __PRIVATE_valueEquals(this.value, e.value);
    }
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */
    getFieldsMap(e) {
      let t = this.value;
      t.mapValue.fields || (t.mapValue = {
        fields: {}
      });
      for (let n = 0; n < e.length; ++n) {
        let r = t.mapValue.fields[e.get(n)];
        __PRIVATE_isMapValue(r) && r.mapValue.fields || (r = {
          mapValue: {
            fields: {}
          }
        }, t.mapValue.fields[e.get(n)] = r), t = r;
      }
      return t.mapValue.fields;
    }
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */
    applyChanges(e, t, n) {
      forEach(t, ((t2, n2) => e[t2] = n2));
      for (const t2 of n) delete e[t2];
    }
    clone() {
      return new _ObjectValue(__PRIVATE_deepClone(this.value));
    }
  };
  function __PRIVATE_extractFieldMask(e) {
    const t = [];
    return forEach(e.fields, ((e2, n) => {
      const r = new FieldPath$1([e2]);
      if (__PRIVATE_isMapValue(n)) {
        const e3 = __PRIVATE_extractFieldMask(n.mapValue).fields;
        if (0 === e3.length)
          t.push(r);
        else
          for (const n2 of e3) t.push(r.child(n2));
      } else
        t.push(r);
    })), new FieldMask(t);
  }
  var MutableDocument = class _MutableDocument {
    constructor(e, t, n, r, i, s, o) {
      this.key = e, this.documentType = t, this.version = n, this.readTime = r, this.createTime = i, this.data = s, this.documentState = o;
    }
    /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */
    static newInvalidDocument(e) {
      return new _MutableDocument(
        e,
        0,
        /* version */
        SnapshotVersion.min(),
        /* readTime */
        SnapshotVersion.min(),
        /* createTime */
        SnapshotVersion.min(),
        ObjectValue.empty(),
        0
        /* DocumentState.SYNCED */
      );
    }
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */
    static newFoundDocument(e, t, n, r) {
      return new _MutableDocument(
        e,
        1,
        /* version */
        t,
        /* readTime */
        SnapshotVersion.min(),
        /* createTime */
        n,
        r,
        0
        /* DocumentState.SYNCED */
      );
    }
    /** Creates a new document that is known to not exist at the given version. */
    static newNoDocument(e, t) {
      return new _MutableDocument(
        e,
        2,
        /* version */
        t,
        /* readTime */
        SnapshotVersion.min(),
        /* createTime */
        SnapshotVersion.min(),
        ObjectValue.empty(),
        0
        /* DocumentState.SYNCED */
      );
    }
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */
    static newUnknownDocument(e, t) {
      return new _MutableDocument(
        e,
        3,
        /* version */
        t,
        /* readTime */
        SnapshotVersion.min(),
        /* createTime */
        SnapshotVersion.min(),
        ObjectValue.empty(),
        2
        /* DocumentState.HAS_COMMITTED_MUTATIONS */
      );
    }
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */
    convertToFoundDocument(e, t) {
      return !this.createTime.isEqual(SnapshotVersion.min()) || 2 !== this.documentType && 0 !== this.documentType || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
    }
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */
    convertToNoDocument(e) {
      return this.version = e, this.documentType = 2, this.data = ObjectValue.empty(), this.documentState = 0, this;
    }
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */
    convertToUnknownDocument(e) {
      return this.version = e, this.documentType = 3, this.data = ObjectValue.empty(), this.documentState = 2, this;
    }
    setHasCommittedMutations() {
      return this.documentState = 2, this;
    }
    setHasLocalMutations() {
      return this.documentState = 1, this.version = SnapshotVersion.min(), this;
    }
    setReadTime(e) {
      return this.readTime = e, this;
    }
    get hasLocalMutations() {
      return 1 === this.documentState;
    }
    get hasCommittedMutations() {
      return 2 === this.documentState;
    }
    get hasPendingWrites() {
      return this.hasLocalMutations || this.hasCommittedMutations;
    }
    isValidDocument() {
      return 0 !== this.documentType;
    }
    isFoundDocument() {
      return 1 === this.documentType;
    }
    isNoDocument() {
      return 2 === this.documentType;
    }
    isUnknownDocument() {
      return 3 === this.documentType;
    }
    isEqual(e) {
      return e instanceof _MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
    }
    mutableCopy() {
      return new _MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
    }
    toString() {
      return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
    }
  };
  var Bound = class {
    constructor(e, t) {
      this.position = e, this.inclusive = t;
    }
  };
  function __PRIVATE_boundCompareToDocument(e, t, n) {
    let r = 0;
    for (let i = 0; i < e.position.length; i++) {
      const s = t[i], o = e.position[i];
      if (s.field.isKeyField()) r = DocumentKey.comparator(DocumentKey.fromName(o.referenceValue), n.key);
      else {
        r = __PRIVATE_valueCompare(o, n.data.field(s.field));
      }
      if ("desc" === s.dir && (r *= -1), 0 !== r) break;
    }
    return r;
  }
  function __PRIVATE_boundEquals(e, t) {
    if (null === e) return null === t;
    if (null === t) return false;
    if (e.inclusive !== t.inclusive || e.position.length !== t.position.length) return false;
    for (let n = 0; n < e.position.length; n++) {
      if (!__PRIVATE_valueEquals(e.position[n], t.position[n])) return false;
    }
    return true;
  }
  var OrderBy = class {
    constructor(e, t = "asc") {
      this.field = e, this.dir = t;
    }
  };
  function __PRIVATE_orderByEquals(e, t) {
    return e.dir === t.dir && e.field.isEqual(t.field);
  }
  var Filter = class {
  };
  var FieldFilter = class _FieldFilter extends Filter {
    constructor(e, t, n) {
      super(), this.field = e, this.op = t, this.value = n;
    }
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(e, t, n) {
      return e.isKeyField() ? "in" === t || "not-in" === t ? this.createKeyFieldInFilter(e, t, n) : new __PRIVATE_KeyFieldFilter(e, t, n) : "array-contains" === t ? new __PRIVATE_ArrayContainsFilter(e, n) : "in" === t ? new __PRIVATE_InFilter(e, n) : "not-in" === t ? new __PRIVATE_NotInFilter(e, n) : "array-contains-any" === t ? new __PRIVATE_ArrayContainsAnyFilter(e, n) : new _FieldFilter(e, t, n);
    }
    static createKeyFieldInFilter(e, t, n) {
      return "in" === t ? new __PRIVATE_KeyFieldInFilter(e, n) : new __PRIVATE_KeyFieldNotInFilter(e, n);
    }
    matches(e) {
      const t = e.data.field(this.field);
      return "!=" === this.op ? null !== t && void 0 === t.nullValue && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : null !== t && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
    }
    matchesComparison(e) {
      switch (this.op) {
        case "<":
          return e < 0;
        case "<=":
          return e <= 0;
        case "==":
          return 0 === e;
        case "!=":
          return 0 !== e;
        case ">":
          return e > 0;
        case ">=":
          return e >= 0;
        default:
          return fail(47266, {
            operator: this.op
          });
      }
    }
    isInequality() {
      return [
        "<",
        "<=",
        ">",
        ">=",
        "!=",
        "not-in"
        /* Operator.NOT_IN */
      ].indexOf(this.op) >= 0;
    }
    getFlattenedFilters() {
      return [this];
    }
    getFilters() {
      return [this];
    }
  };
  var CompositeFilter = class _CompositeFilter extends Filter {
    constructor(e, t) {
      super(), this.filters = e, this.op = t, this.he = null;
    }
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(e, t) {
      return new _CompositeFilter(e, t);
    }
    matches(e) {
      return __PRIVATE_compositeFilterIsConjunction(this) ? void 0 === this.filters.find(((t) => !t.matches(e))) : void 0 !== this.filters.find(((t) => t.matches(e)));
    }
    getFlattenedFilters() {
      return null !== this.he || (this.he = this.filters.reduce(((e, t) => e.concat(t.getFlattenedFilters())), [])), this.he;
    }
    // Returns a mutable copy of `this.filters`
    getFilters() {
      return Object.assign([], this.filters);
    }
  };
  function __PRIVATE_compositeFilterIsConjunction(e) {
    return "and" === e.op;
  }
  function __PRIVATE_compositeFilterIsFlatConjunction(e) {
    return __PRIVATE_compositeFilterIsFlat(e) && __PRIVATE_compositeFilterIsConjunction(e);
  }
  function __PRIVATE_compositeFilterIsFlat(e) {
    for (const t of e.filters) if (t instanceof CompositeFilter) return false;
    return true;
  }
  function __PRIVATE_canonifyFilter(e) {
    if (e instanceof FieldFilter)
      return e.field.canonicalString() + e.op.toString() + canonicalId(e.value);
    if (__PRIVATE_compositeFilterIsFlatConjunction(e))
      return e.filters.map(((e2) => __PRIVATE_canonifyFilter(e2))).join(",");
    {
      const t = e.filters.map(((e2) => __PRIVATE_canonifyFilter(e2))).join(",");
      return `${e.op}(${t})`;
    }
  }
  function __PRIVATE_filterEquals(e, t) {
    return e instanceof FieldFilter ? (function __PRIVATE_fieldFilterEquals(e2, t2) {
      return t2 instanceof FieldFilter && e2.op === t2.op && e2.field.isEqual(t2.field) && __PRIVATE_valueEquals(e2.value, t2.value);
    })(e, t) : e instanceof CompositeFilter ? (function __PRIVATE_compositeFilterEquals(e2, t2) {
      if (t2 instanceof CompositeFilter && e2.op === t2.op && e2.filters.length === t2.filters.length) {
        return e2.filters.reduce(((e3, n, r) => e3 && __PRIVATE_filterEquals(n, t2.filters[r])), true);
      }
      return false;
    })(e, t) : void fail(19439);
  }
  function __PRIVATE_stringifyFilter(e) {
    return e instanceof FieldFilter ? (function __PRIVATE_stringifyFieldFilter(e2) {
      return `${e2.field.canonicalString()} ${e2.op} ${canonicalId(e2.value)}`;
    })(e) : e instanceof CompositeFilter ? (function __PRIVATE_stringifyCompositeFilter(e2) {
      return e2.op.toString() + " {" + e2.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
    })(e) : "Filter";
  }
  var __PRIVATE_KeyFieldFilter = class extends FieldFilter {
    constructor(e, t, n) {
      super(e, t, n), this.key = DocumentKey.fromName(n.referenceValue);
    }
    matches(e) {
      const t = DocumentKey.comparator(e.key, this.key);
      return this.matchesComparison(t);
    }
  };
  var __PRIVATE_KeyFieldInFilter = class extends FieldFilter {
    constructor(e, t) {
      super(e, "in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t);
    }
    matches(e) {
      return this.keys.some(((t) => t.isEqual(e.key)));
    }
  };
  var __PRIVATE_KeyFieldNotInFilter = class extends FieldFilter {
    constructor(e, t) {
      super(e, "not-in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t);
    }
    matches(e) {
      return !this.keys.some(((t) => t.isEqual(e.key)));
    }
  };
  function __PRIVATE_extractDocumentKeysFromArrayValue(e, t) {
    var n;
    return ((null === (n = t.arrayValue) || void 0 === n ? void 0 : n.values) || []).map(((e2) => DocumentKey.fromName(e2.referenceValue)));
  }
  var __PRIVATE_ArrayContainsFilter = class extends FieldFilter {
    constructor(e, t) {
      super(e, "array-contains", t);
    }
    matches(e) {
      const t = e.data.field(this.field);
      return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
    }
  };
  var __PRIVATE_InFilter = class extends FieldFilter {
    constructor(e, t) {
      super(e, "in", t);
    }
    matches(e) {
      const t = e.data.field(this.field);
      return null !== t && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
    }
  };
  var __PRIVATE_NotInFilter = class extends FieldFilter {
    constructor(e, t) {
      super(e, "not-in", t);
    }
    matches(e) {
      if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
        nullValue: "NULL_VALUE"
      })) return false;
      const t = e.data.field(this.field);
      return null !== t && void 0 === t.nullValue && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
    }
  };
  var __PRIVATE_ArrayContainsAnyFilter = class extends FieldFilter {
    constructor(e, t) {
      super(e, "array-contains-any", t);
    }
    matches(e) {
      const t = e.data.field(this.field);
      return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some(((e2) => __PRIVATE_arrayValueContains(this.value.arrayValue, e2)));
    }
  };
  var __PRIVATE_TargetImpl = class {
    constructor(e, t = null, n = [], r = [], i = null, s = null, o = null) {
      this.path = e, this.collectionGroup = t, this.orderBy = n, this.filters = r, this.limit = i, this.startAt = s, this.endAt = o, this.Pe = null;
    }
  };
  function __PRIVATE_newTarget(e, t = null, n = [], r = [], i = null, s = null, o = null) {
    return new __PRIVATE_TargetImpl(e, t, n, r, i, s, o);
  }
  function __PRIVATE_canonifyTarget(e) {
    const t = __PRIVATE_debugCast(e);
    if (null === t.Pe) {
      let e2 = t.path.canonicalString();
      null !== t.collectionGroup && (e2 += "|cg:" + t.collectionGroup), e2 += "|f:", e2 += t.filters.map(((e3) => __PRIVATE_canonifyFilter(e3))).join(","), e2 += "|ob:", e2 += t.orderBy.map(((e3) => (function __PRIVATE_canonifyOrderBy(e4) {
        return e4.field.canonicalString() + e4.dir;
      })(e3))).join(","), __PRIVATE_isNullOrUndefined(t.limit) || (e2 += "|l:", e2 += t.limit), t.startAt && (e2 += "|lb:", e2 += t.startAt.inclusive ? "b:" : "a:", e2 += t.startAt.position.map(((e3) => canonicalId(e3))).join(",")), t.endAt && (e2 += "|ub:", e2 += t.endAt.inclusive ? "a:" : "b:", e2 += t.endAt.position.map(((e3) => canonicalId(e3))).join(",")), t.Pe = e2;
    }
    return t.Pe;
  }
  function __PRIVATE_targetEquals(e, t) {
    if (e.limit !== t.limit) return false;
    if (e.orderBy.length !== t.orderBy.length) return false;
    for (let n = 0; n < e.orderBy.length; n++) if (!__PRIVATE_orderByEquals(e.orderBy[n], t.orderBy[n])) return false;
    if (e.filters.length !== t.filters.length) return false;
    for (let n = 0; n < e.filters.length; n++) if (!__PRIVATE_filterEquals(e.filters[n], t.filters[n])) return false;
    return e.collectionGroup === t.collectionGroup && (!!e.path.isEqual(t.path) && (!!__PRIVATE_boundEquals(e.startAt, t.startAt) && __PRIVATE_boundEquals(e.endAt, t.endAt)));
  }
  function __PRIVATE_targetIsDocumentTarget(e) {
    return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
  }
  var __PRIVATE_QueryImpl = class {
    /**
     * Initializes a Query with a path and optional additional query constraints.
     * Path must currently be empty if this is a collection group query.
     */
    constructor(e, t = null, n = [], r = [], i = null, s = "F", o = null, _ = null) {
      this.path = e, this.collectionGroup = t, this.explicitOrderBy = n, this.filters = r, this.limit = i, this.limitType = s, this.startAt = o, this.endAt = _, this.Te = null, // The corresponding `Target` of this `Query` instance, for use with
      // non-aggregate queries.
      this.Ie = null, // The corresponding `Target` of this `Query` instance, for use with
      // aggregate queries. Unlike targets for non-aggregate queries,
      // aggregate query targets do not contain normalized order-bys, they only
      // contain explicit order-bys.
      this.de = null, this.startAt, this.endAt;
    }
  };
  function __PRIVATE_newQuery(e, t, n, r, i, s, o, _) {
    return new __PRIVATE_QueryImpl(e, t, n, r, i, s, o, _);
  }
  function __PRIVATE_newQueryForPath(e) {
    return new __PRIVATE_QueryImpl(e);
  }
  function __PRIVATE_queryMatchesAllDocuments(e) {
    return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField());
  }
  function __PRIVATE_isCollectionGroupQuery(e) {
    return null !== e.collectionGroup;
  }
  function __PRIVATE_queryNormalizedOrderBy(e) {
    const t = __PRIVATE_debugCast(e);
    if (null === t.Te) {
      t.Te = [];
      const e2 = /* @__PURE__ */ new Set();
      for (const n2 of t.explicitOrderBy) t.Te.push(n2), e2.add(n2.field.canonicalString());
      const n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc", r = (function __PRIVATE_getInequalityFilterFields(e3) {
        let t2 = new SortedSet(FieldPath$1.comparator);
        return e3.filters.forEach(((e4) => {
          e4.getFlattenedFilters().forEach(((e5) => {
            e5.isInequality() && (t2 = t2.add(e5.field));
          }));
        })), t2;
      })(t);
      r.forEach(((r2) => {
        e2.has(r2.canonicalString()) || r2.isKeyField() || t.Te.push(new OrderBy(r2, n));
      })), // Add the document key field to the last if it is not explicitly ordered.
      e2.has(FieldPath$1.keyField().canonicalString()) || t.Te.push(new OrderBy(FieldPath$1.keyField(), n));
    }
    return t.Te;
  }
  function __PRIVATE_queryToTarget(e) {
    const t = __PRIVATE_debugCast(e);
    return t.Ie || (t.Ie = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), t.Ie;
  }
  function __PRIVATE__queryToTarget(e, t) {
    if ("F" === e.limitType) return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
    {
      t = t.map(((e2) => {
        const t2 = "desc" === e2.dir ? "asc" : "desc";
        return new OrderBy(e2.field, t2);
      }));
      const n = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, r = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
      return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, n, r);
    }
  }
  function __PRIVATE_queryWithAddedFilter(e, t) {
    const n = e.filters.concat([t]);
    return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), n, e.limit, e.limitType, e.startAt, e.endAt);
  }
  function __PRIVATE_queryWithLimit(e, t, n) {
    return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
  }
  function __PRIVATE_queryEquals(e, t) {
    return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t)) && e.limitType === t.limitType;
  }
  function __PRIVATE_canonifyQuery(e) {
    return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e))}|lt:${e.limitType}`;
  }
  function __PRIVATE_stringifyQuery(e) {
    return `Query(target=${(function __PRIVATE_stringifyTarget(e2) {
      let t = e2.path.canonicalString();
      return null !== e2.collectionGroup && (t += " collectionGroup=" + e2.collectionGroup), e2.filters.length > 0 && (t += `, filters: [${e2.filters.map(((e3) => __PRIVATE_stringifyFilter(e3))).join(", ")}]`), __PRIVATE_isNullOrUndefined(e2.limit) || (t += ", limit: " + e2.limit), e2.orderBy.length > 0 && (t += `, orderBy: [${e2.orderBy.map(((e3) => (function __PRIVATE_stringifyOrderBy(e4) {
        return `${e4.field.canonicalString()} (${e4.dir})`;
      })(e3))).join(", ")}]`), e2.startAt && (t += ", startAt: ", t += e2.startAt.inclusive ? "b:" : "a:", t += e2.startAt.position.map(((e3) => canonicalId(e3))).join(",")), e2.endAt && (t += ", endAt: ", t += e2.endAt.inclusive ? "a:" : "b:", t += e2.endAt.position.map(((e3) => canonicalId(e3))).join(",")), `Target(${t})`;
    })(__PRIVATE_queryToTarget(e))}; limitType=${e.limitType})`;
  }
  function __PRIVATE_queryMatches(e, t) {
    return t.isFoundDocument() && (function __PRIVATE_queryMatchesPathAndCollectionGroup(e2, t2) {
      const n = t2.key.path;
      return null !== e2.collectionGroup ? t2.key.hasCollectionId(e2.collectionGroup) && e2.path.isPrefixOf(n) : DocumentKey.isDocumentKey(e2.path) ? e2.path.isEqual(n) : e2.path.isImmediateParentOf(n);
    })(e, t) && (function __PRIVATE_queryMatchesOrderBy(e2, t2) {
      for (const n of __PRIVATE_queryNormalizedOrderBy(e2))
        if (!n.field.isKeyField() && null === t2.data.field(n.field)) return false;
      return true;
    })(e, t) && (function __PRIVATE_queryMatchesFilters(e2, t2) {
      for (const n of e2.filters) if (!n.matches(t2)) return false;
      return true;
    })(e, t) && (function __PRIVATE_queryMatchesBounds(e2, t2) {
      if (e2.startAt && !/**
      * Returns true if a document sorts before a bound using the provided sort
      * order.
      */
      (function __PRIVATE_boundSortsBeforeDocument(e3, t3, n) {
        const r = __PRIVATE_boundCompareToDocument(e3, t3, n);
        return e3.inclusive ? r <= 0 : r < 0;
      })(e2.startAt, __PRIVATE_queryNormalizedOrderBy(e2), t2)) return false;
      if (e2.endAt && !(function __PRIVATE_boundSortsAfterDocument(e3, t3, n) {
        const r = __PRIVATE_boundCompareToDocument(e3, t3, n);
        return e3.inclusive ? r >= 0 : r > 0;
      })(e2.endAt, __PRIVATE_queryNormalizedOrderBy(e2), t2)) return false;
      return true;
    })(e, t);
  }
  function __PRIVATE_queryCollectionGroup(e) {
    return e.collectionGroup || (e.path.length % 2 == 1 ? e.path.lastSegment() : e.path.get(e.path.length - 2));
  }
  function __PRIVATE_newQueryComparator(e) {
    return (t, n) => {
      let r = false;
      for (const i of __PRIVATE_queryNormalizedOrderBy(e)) {
        const e2 = __PRIVATE_compareDocs(i, t, n);
        if (0 !== e2) return e2;
        r = r || i.field.isKeyField();
      }
      return 0;
    };
  }
  function __PRIVATE_compareDocs(e, t, n) {
    const r = e.field.isKeyField() ? DocumentKey.comparator(t.key, n.key) : (function __PRIVATE_compareDocumentsByField(e2, t2, n2) {
      const r2 = t2.data.field(e2), i = n2.data.field(e2);
      return null !== r2 && null !== i ? __PRIVATE_valueCompare(r2, i) : fail(42886);
    })(e.field, t, n);
    switch (e.dir) {
      case "asc":
        return r;
      case "desc":
        return -1 * r;
      default:
        return fail(19790, {
          direction: e.dir
        });
    }
  }
  var ObjectMap = class {
    constructor(e, t) {
      this.mapKeyFn = e, this.equalsFn = t, /**
       * The inner map for a key/value pair. Due to the possibility of collisions we
       * keep a list of entries that we do a linear search through to find an actual
       * match. Note that collisions should be rare, so we still expect near
       * constant time lookups in practice.
       */
      this.inner = {}, /** The number of entries stored in the map */
      this.innerSize = 0;
    }
    /** Get a value for this key, or undefined if it does not exist. */
    get(e) {
      const t = this.mapKeyFn(e), n = this.inner[t];
      if (void 0 !== n) {
        for (const [t2, r] of n) if (this.equalsFn(t2, e)) return r;
      }
    }
    has(e) {
      return void 0 !== this.get(e);
    }
    /** Put this key and value in the map. */
    set(e, t) {
      const n = this.mapKeyFn(e), r = this.inner[n];
      if (void 0 === r) return this.inner[n] = [[e, t]], void this.innerSize++;
      for (let n2 = 0; n2 < r.length; n2++) if (this.equalsFn(r[n2][0], e))
        return void (r[n2] = [e, t]);
      r.push([e, t]), this.innerSize++;
    }
    /**
     * Remove this key from the map. Returns a boolean if anything was deleted.
     */
    delete(e) {
      const t = this.mapKeyFn(e), n = this.inner[t];
      if (void 0 === n) return false;
      for (let r = 0; r < n.length; r++) if (this.equalsFn(n[r][0], e)) return 1 === n.length ? delete this.inner[t] : n.splice(r, 1), this.innerSize--, true;
      return false;
    }
    forEach(e) {
      forEach(this.inner, ((t, n) => {
        for (const [t2, r] of n) e(t2, r);
      }));
    }
    isEmpty() {
      return isEmpty2(this.inner);
    }
    size() {
      return this.innerSize;
    }
  };
  var Et = new SortedMap(DocumentKey.comparator);
  function __PRIVATE_mutableDocumentMap() {
    return Et;
  }
  var At = new SortedMap(DocumentKey.comparator);
  function documentMap(...e) {
    let t = At;
    for (const n of e) t = t.insert(n.key, n);
    return t;
  }
  function __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e) {
    let t = At;
    return e.forEach(((e2, n) => t = t.insert(e2, n.overlayedDocument))), t;
  }
  function __PRIVATE_newOverlayMap() {
    return __PRIVATE_newDocumentKeyMap();
  }
  function __PRIVATE_newMutationMap() {
    return __PRIVATE_newDocumentKeyMap();
  }
  function __PRIVATE_newDocumentKeyMap() {
    return new ObjectMap(((e) => e.toString()), ((e, t) => e.isEqual(t)));
  }
  var Rt = new SortedMap(DocumentKey.comparator);
  var Vt = new SortedSet(DocumentKey.comparator);
  function __PRIVATE_documentKeySet(...e) {
    let t = Vt;
    for (const n of e) t = t.add(n);
    return t;
  }
  var mt = new SortedSet(__PRIVATE_primitiveComparator);
  function __PRIVATE_targetIdSet() {
    return mt;
  }
  function __PRIVATE_toDouble(e, t) {
    if (e.useProto3Json) {
      if (isNaN(t)) return {
        doubleValue: "NaN"
      };
      if (t === 1 / 0) return {
        doubleValue: "Infinity"
      };
      if (t === -1 / 0) return {
        doubleValue: "-Infinity"
      };
    }
    return {
      doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t
    };
  }
  function __PRIVATE_toInteger(e) {
    return {
      integerValue: "" + e
    };
  }
  function toNumber(e, t) {
    return isSafeInteger(t) ? __PRIVATE_toInteger(t) : __PRIVATE_toDouble(e, t);
  }
  var TransformOperation = class {
    constructor() {
      this._ = void 0;
    }
  };
  function __PRIVATE_applyTransformOperationToLocalView(e, t, n) {
    return e instanceof __PRIVATE_ServerTimestampTransform ? (function serverTimestamp$1(e2, t2) {
      const n2 = {
        fields: {
          [ot]: {
            stringValue: st
          },
          [at]: {
            timestampValue: {
              seconds: e2.seconds,
              nanos: e2.nanoseconds
            }
          }
        }
      };
      return t2 && __PRIVATE_isServerTimestamp(t2) && (t2 = __PRIVATE_getPreviousValue(t2)), t2 && (n2.fields[_t] = t2), {
        mapValue: n2
      };
    })(n, t) : e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : (function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e2, t2) {
      const n2 = __PRIVATE_computeTransformOperationBaseValue(e2, t2), r = asNumber(n2) + asNumber(e2.Ee);
      return isInteger(n2) && isInteger(e2.Ee) ? __PRIVATE_toInteger(r) : __PRIVATE_toDouble(e2.serializer, r);
    })(e, t);
  }
  function __PRIVATE_applyTransformOperationToRemoteDocument(e, t, n) {
    return e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : n;
  }
  function __PRIVATE_computeTransformOperationBaseValue(e, t) {
    return e instanceof __PRIVATE_NumericIncrementTransformOperation ? (
      /** Returns true if `value` is either an IntegerValue or a DoubleValue. */
      (function __PRIVATE_isNumber(e2) {
        return isInteger(e2) || (function __PRIVATE_isDouble(e3) {
          return !!e3 && "doubleValue" in e3;
        })(e2);
      })(t) ? t : {
        integerValue: 0
      }
    ) : null;
  }
  var __PRIVATE_ServerTimestampTransform = class extends TransformOperation {
  };
  var __PRIVATE_ArrayUnionTransformOperation = class extends TransformOperation {
    constructor(e) {
      super(), this.elements = e;
    }
  };
  function __PRIVATE_applyArrayUnionTransformOperation(e, t) {
    const n = __PRIVATE_coercedFieldValuesArray(t);
    for (const t2 of e.elements) n.some(((e2) => __PRIVATE_valueEquals(e2, t2))) || n.push(t2);
    return {
      arrayValue: {
        values: n
      }
    };
  }
  var __PRIVATE_ArrayRemoveTransformOperation = class extends TransformOperation {
    constructor(e) {
      super(), this.elements = e;
    }
  };
  function __PRIVATE_applyArrayRemoveTransformOperation(e, t) {
    let n = __PRIVATE_coercedFieldValuesArray(t);
    for (const t2 of e.elements) n = n.filter(((e2) => !__PRIVATE_valueEquals(e2, t2)));
    return {
      arrayValue: {
        values: n
      }
    };
  }
  var __PRIVATE_NumericIncrementTransformOperation = class extends TransformOperation {
    constructor(e, t) {
      super(), this.serializer = e, this.Ee = t;
    }
  };
  function asNumber(e) {
    return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
  }
  function __PRIVATE_coercedFieldValuesArray(e) {
    return isArray(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
  }
  var FieldTransform = class {
    constructor(e, t) {
      this.field = e, this.transform = t;
    }
  };
  function __PRIVATE_fieldTransformEquals(e, t) {
    return e.field.isEqual(t.field) && (function __PRIVATE_transformOperationEquals(e2, t2) {
      return e2 instanceof __PRIVATE_ArrayUnionTransformOperation && t2 instanceof __PRIVATE_ArrayUnionTransformOperation || e2 instanceof __PRIVATE_ArrayRemoveTransformOperation && t2 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e2.elements, t2.elements, __PRIVATE_valueEquals) : e2 instanceof __PRIVATE_NumericIncrementTransformOperation && t2 instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_valueEquals(e2.Ee, t2.Ee) : e2 instanceof __PRIVATE_ServerTimestampTransform && t2 instanceof __PRIVATE_ServerTimestampTransform;
    })(e.transform, t.transform);
  }
  var MutationResult = class {
    constructor(e, t) {
      this.version = e, this.transformResults = t;
    }
  };
  var Precondition = class _Precondition {
    constructor(e, t) {
      this.updateTime = e, this.exists = t;
    }
    /** Creates a new empty Precondition. */
    static none() {
      return new _Precondition();
    }
    /** Creates a new Precondition with an exists flag. */
    static exists(e) {
      return new _Precondition(void 0, e);
    }
    /** Creates a new Precondition based on a version a document exists at. */
    static updateTime(e) {
      return new _Precondition(e);
    }
    /** Returns whether this Precondition is empty. */
    get isNone() {
      return void 0 === this.updateTime && void 0 === this.exists;
    }
    isEqual(e) {
      return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
    }
  };
  function __PRIVATE_preconditionIsValidForDocument(e, t) {
    return void 0 !== e.updateTime ? t.isFoundDocument() && t.version.isEqual(e.updateTime) : void 0 === e.exists || e.exists === t.isFoundDocument();
  }
  var Mutation = class {
  };
  function __PRIVATE_calculateOverlayMutation(e, t) {
    if (!e.hasLocalMutations || t && 0 === t.fields.length) return null;
    if (null === t) return e.isNoDocument() ? new __PRIVATE_DeleteMutation(e.key, Precondition.none()) : new __PRIVATE_SetMutation(e.key, e.data, Precondition.none());
    {
      const n = e.data, r = ObjectValue.empty();
      let i = new SortedSet(FieldPath$1.comparator);
      for (let e2 of t.fields) if (!i.has(e2)) {
        let t2 = n.field(e2);
        null === t2 && e2.length > 1 && (e2 = e2.popLast(), t2 = n.field(e2)), null === t2 ? r.delete(e2) : r.set(e2, t2), i = i.add(e2);
      }
      return new __PRIVATE_PatchMutation(e.key, r, new FieldMask(i.toArray()), Precondition.none());
    }
  }
  function __PRIVATE_mutationApplyToRemoteDocument(e, t, n) {
    e instanceof __PRIVATE_SetMutation ? (function __PRIVATE_setMutationApplyToRemoteDocument(e2, t2, n2) {
      const r = e2.value.clone(), i = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults);
      r.setAll(i), t2.convertToFoundDocument(n2.version, r).setHasCommittedMutations();
    })(e, t, n) : e instanceof __PRIVATE_PatchMutation ? (function __PRIVATE_patchMutationApplyToRemoteDocument(e2, t2, n2) {
      if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
        return void t2.convertToUnknownDocument(n2.version);
      const r = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults), i = t2.data;
      i.setAll(__PRIVATE_getPatch(e2)), i.setAll(r), t2.convertToFoundDocument(n2.version, i).setHasCommittedMutations();
    })(e, t, n) : (function __PRIVATE_deleteMutationApplyToRemoteDocument(e2, t2, n2) {
      t2.convertToNoDocument(n2.version).setHasCommittedMutations();
    })(0, t, n);
  }
  function __PRIVATE_mutationApplyToLocalView(e, t, n, r) {
    return e instanceof __PRIVATE_SetMutation ? (function __PRIVATE_setMutationApplyToLocalView(e2, t2, n2, r2) {
      if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
        return n2;
      const i = e2.value.clone(), s = __PRIVATE_localTransformResults(e2.fieldTransforms, r2, t2);
      return i.setAll(s), t2.convertToFoundDocument(t2.version, i).setHasLocalMutations(), null;
    })(e, t, n, r) : e instanceof __PRIVATE_PatchMutation ? (function __PRIVATE_patchMutationApplyToLocalView(e2, t2, n2, r2) {
      if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2)) return n2;
      const i = __PRIVATE_localTransformResults(e2.fieldTransforms, r2, t2), s = t2.data;
      if (s.setAll(__PRIVATE_getPatch(e2)), s.setAll(i), t2.convertToFoundDocument(t2.version, s).setHasLocalMutations(), null === n2) return null;
      return n2.unionWith(e2.fieldMask.fields).unionWith(e2.fieldTransforms.map(((e3) => e3.field)));
    })(e, t, n, r) : (function __PRIVATE_deleteMutationApplyToLocalView(e2, t2, n2) {
      if (__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2)) return t2.convertToNoDocument(t2.version).setHasLocalMutations(), null;
      return n2;
    })(e, t, n);
  }
  function __PRIVATE_mutationExtractBaseValue(e, t) {
    let n = null;
    for (const r of e.fieldTransforms) {
      const e2 = t.data.field(r.field), i = __PRIVATE_computeTransformOperationBaseValue(r.transform, e2 || null);
      null != i && (null === n && (n = ObjectValue.empty()), n.set(r.field, i));
    }
    return n || null;
  }
  function __PRIVATE_mutationEquals(e, t) {
    return e.type === t.type && (!!e.key.isEqual(t.key) && (!!e.precondition.isEqual(t.precondition) && (!!(function __PRIVATE_fieldTransformsAreEqual(e2, t2) {
      return void 0 === e2 && void 0 === t2 || !(!e2 || !t2) && __PRIVATE_arrayEquals(e2, t2, ((e3, t3) => __PRIVATE_fieldTransformEquals(e3, t3)));
    })(e.fieldTransforms, t.fieldTransforms) && (0 === e.type ? e.value.isEqual(t.value) : 1 !== e.type || e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask)))));
  }
  var __PRIVATE_SetMutation = class extends Mutation {
    constructor(e, t, n, r = []) {
      super(), this.key = e, this.value = t, this.precondition = n, this.fieldTransforms = r, this.type = 0;
    }
    getFieldMask() {
      return null;
    }
  };
  var __PRIVATE_PatchMutation = class extends Mutation {
    constructor(e, t, n, r, i = []) {
      super(), this.key = e, this.data = t, this.fieldMask = n, this.precondition = r, this.fieldTransforms = i, this.type = 1;
    }
    getFieldMask() {
      return this.fieldMask;
    }
  };
  function __PRIVATE_getPatch(e) {
    const t = /* @__PURE__ */ new Map();
    return e.fieldMask.fields.forEach(((n) => {
      if (!n.isEmpty()) {
        const r = e.data.field(n);
        t.set(n, r);
      }
    })), t;
  }
  function __PRIVATE_serverTransformResults(e, t, n) {
    const r = /* @__PURE__ */ new Map();
    __PRIVATE_hardAssert(e.length === n.length, 32656, {
      Ae: n.length,
      Re: e.length
    });
    for (let i = 0; i < n.length; i++) {
      const s = e[i], o = s.transform, _ = t.data.field(s.field);
      r.set(s.field, __PRIVATE_applyTransformOperationToRemoteDocument(o, _, n[i]));
    }
    return r;
  }
  function __PRIVATE_localTransformResults(e, t, n) {
    const r = /* @__PURE__ */ new Map();
    for (const i of e) {
      const e2 = i.transform, s = n.data.field(i.field);
      r.set(i.field, __PRIVATE_applyTransformOperationToLocalView(e2, s, t));
    }
    return r;
  }
  var __PRIVATE_DeleteMutation = class extends Mutation {
    constructor(e, t) {
      super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
    }
    getFieldMask() {
      return null;
    }
  };
  var __PRIVATE_VerifyMutation = class extends Mutation {
    constructor(e, t) {
      super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
    }
    getFieldMask() {
      return null;
    }
  };
  var MutationBatch = class {
    /**
     * @param batchId - The unique ID of this mutation batch.
     * @param localWriteTime - The original write time of this mutation.
     * @param baseMutations - Mutations that are used to populate the base
     * values when this mutation is applied locally. This can be used to locally
     * overwrite values that are persisted in the remote document cache. Base
     * mutations are never sent to the backend.
     * @param mutations - The user-provided mutations in this mutation batch.
     * User-provided mutations are applied both locally and remotely on the
     * backend.
     */
    constructor(e, t, n, r) {
      this.batchId = e, this.localWriteTime = t, this.baseMutations = n, this.mutations = r;
    }
    /**
     * Applies all the mutations in this MutationBatch to the specified document
     * to compute the state of the remote document
     *
     * @param document - The document to apply mutations to.
     * @param batchResult - The result of applying the MutationBatch to the
     * backend.
     */
    applyToRemoteDocument(e, t) {
      const n = t.mutationResults;
      for (let t2 = 0; t2 < this.mutations.length; t2++) {
        const r = this.mutations[t2];
        if (r.key.isEqual(e.key)) {
          __PRIVATE_mutationApplyToRemoteDocument(r, e, n[t2]);
        }
      }
    }
    /**
     * Computes the local view of a document given all the mutations in this
     * batch.
     *
     * @param document - The document to apply mutations to.
     * @param mutatedFields - Fields that have been updated before applying this mutation batch.
     * @returns A `FieldMask` representing all the fields that are mutated.
     */
    applyToLocalView(e, t) {
      for (const n of this.baseMutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
      for (const n of this.mutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
      return t;
    }
    /**
     * Computes the local view for all provided documents given the mutations in
     * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
     * replace all the mutation applications.
     */
    applyToLocalDocumentSet(e, t) {
      const n = __PRIVATE_newMutationMap();
      return this.mutations.forEach(((r) => {
        const i = e.get(r.key), s = i.overlayedDocument;
        let o = this.applyToLocalView(s, i.mutatedFields);
        o = t.has(r.key) ? null : o;
        const _ = __PRIVATE_calculateOverlayMutation(s, o);
        null !== _ && n.set(r.key, _), s.isValidDocument() || s.convertToNoDocument(SnapshotVersion.min());
      })), n;
    }
    keys() {
      return this.mutations.reduce(((e, t) => e.add(t.key)), __PRIVATE_documentKeySet());
    }
    isEqual(e) {
      return this.batchId === e.batchId && __PRIVATE_arrayEquals(this.mutations, e.mutations, ((e2, t) => __PRIVATE_mutationEquals(e2, t))) && __PRIVATE_arrayEquals(this.baseMutations, e.baseMutations, ((e2, t) => __PRIVATE_mutationEquals(e2, t)));
    }
  };
  var MutationBatchResult = class _MutationBatchResult {
    constructor(e, t, n, r) {
      this.batch = e, this.commitVersion = t, this.mutationResults = n, this.docVersions = r;
    }
    /**
     * Creates a new MutationBatchResult for the given batch and results. There
     * must be one result for each mutation in the batch. This static factory
     * caches a document=&gt;version mapping (docVersions).
     */
    static from(e, t, n) {
      __PRIVATE_hardAssert(e.mutations.length === n.length, 58842, {
        Ve: e.mutations.length,
        me: n.length
      });
      let r = /* @__PURE__ */ (function __PRIVATE_documentVersionMap() {
        return Rt;
      })();
      const i = e.mutations;
      for (let e2 = 0; e2 < i.length; e2++) r = r.insert(i[e2].key, n[e2].version);
      return new _MutationBatchResult(e, t, n, r);
    }
  };
  var Overlay = class {
    constructor(e, t) {
      this.largestBatchId = e, this.mutation = t;
    }
    getKey() {
      return this.mutation.key;
    }
    isEqual(e) {
      return null !== e && this.mutation === e.mutation;
    }
    toString() {
      return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
    }
  };
  var ExistenceFilter = class {
    constructor(e, t) {
      this.count = e, this.unchangedNames = t;
    }
  };
  var ft;
  var gt;
  function __PRIVATE_isPermanentError(e) {
    switch (e) {
      case N.OK:
        return fail(64938);
      case N.CANCELLED:
      case N.UNKNOWN:
      case N.DEADLINE_EXCEEDED:
      case N.RESOURCE_EXHAUSTED:
      case N.INTERNAL:
      case N.UNAVAILABLE:
      // Unauthenticated means something went wrong with our token and we need
      // to retry with new credentials which will happen automatically.
      case N.UNAUTHENTICATED:
        return false;
      case N.INVALID_ARGUMENT:
      case N.NOT_FOUND:
      case N.ALREADY_EXISTS:
      case N.PERMISSION_DENIED:
      case N.FAILED_PRECONDITION:
      // Aborted might be retried in some scenarios, but that is dependent on
      // the context and should handled individually by the calling code.
      // See https://cloud.google.com/apis/design/errors.
      case N.ABORTED:
      case N.OUT_OF_RANGE:
      case N.UNIMPLEMENTED:
      case N.DATA_LOSS:
        return true;
      default:
        return fail(15467, {
          code: e
        });
    }
  }
  function __PRIVATE_mapCodeFromRpcCode(e) {
    if (void 0 === e)
      return __PRIVATE_logError("GRPC error has no .code"), N.UNKNOWN;
    switch (e) {
      case ft.OK:
        return N.OK;
      case ft.CANCELLED:
        return N.CANCELLED;
      case ft.UNKNOWN:
        return N.UNKNOWN;
      case ft.DEADLINE_EXCEEDED:
        return N.DEADLINE_EXCEEDED;
      case ft.RESOURCE_EXHAUSTED:
        return N.RESOURCE_EXHAUSTED;
      case ft.INTERNAL:
        return N.INTERNAL;
      case ft.UNAVAILABLE:
        return N.UNAVAILABLE;
      case ft.UNAUTHENTICATED:
        return N.UNAUTHENTICATED;
      case ft.INVALID_ARGUMENT:
        return N.INVALID_ARGUMENT;
      case ft.NOT_FOUND:
        return N.NOT_FOUND;
      case ft.ALREADY_EXISTS:
        return N.ALREADY_EXISTS;
      case ft.PERMISSION_DENIED:
        return N.PERMISSION_DENIED;
      case ft.FAILED_PRECONDITION:
        return N.FAILED_PRECONDITION;
      case ft.ABORTED:
        return N.ABORTED;
      case ft.OUT_OF_RANGE:
        return N.OUT_OF_RANGE;
      case ft.UNIMPLEMENTED:
        return N.UNIMPLEMENTED;
      case ft.DATA_LOSS:
        return N.DATA_LOSS;
      default:
        return fail(39323, {
          code: e
        });
    }
  }
  (gt = ft || (ft = {}))[gt.OK = 0] = "OK", gt[gt.CANCELLED = 1] = "CANCELLED", gt[gt.UNKNOWN = 2] = "UNKNOWN", gt[gt.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", gt[gt.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", gt[gt.NOT_FOUND = 5] = "NOT_FOUND", gt[gt.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", gt[gt.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", gt[gt.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", gt[gt.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", gt[gt.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", gt[gt.ABORTED = 10] = "ABORTED", gt[gt.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", gt[gt.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", gt[gt.INTERNAL = 13] = "INTERNAL", gt[gt.UNAVAILABLE = 14] = "UNAVAILABLE", gt[gt.DATA_LOSS = 15] = "DATA_LOSS";
  var pt = null;
  var yt = new Integer([4294967295, 4294967295], 0);
  function __PRIVATE_getMd5HashValue(e) {
    const t = __PRIVATE_newTextEncoder().encode(e), n = new Md5();
    return n.update(t), new Uint8Array(n.digest());
  }
  function __PRIVATE_get64BitUints(e) {
    const t = new DataView(e.buffer), n = t.getUint32(
      0,
      /* littleEndian= */
      true
    ), r = t.getUint32(
      4,
      /* littleEndian= */
      true
    ), i = t.getUint32(
      8,
      /* littleEndian= */
      true
    ), s = t.getUint32(
      12,
      /* littleEndian= */
      true
    );
    return [new Integer([n, r], 0), new Integer([i, s], 0)];
  }
  var BloomFilter = class _BloomFilter {
    constructor(e, t, n) {
      if (this.bitmap = e, this.padding = t, this.hashCount = n, t < 0 || t >= 8) throw new __PRIVATE_BloomFilterError(`Invalid padding: ${t}`);
      if (n < 0) throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
      if (e.length > 0 && 0 === this.hashCount)
        throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
      if (0 === e.length && 0 !== t)
        throw new __PRIVATE_BloomFilterError(`Invalid padding when bitmap length is 0: ${t}`);
      this.fe = 8 * e.length - t, // Set the bit count in Integer to avoid repetition in mightContain().
      this.ge = Integer.fromNumber(this.fe);
    }
    // Calculate the ith hash value based on the hashed 64bit integers,
    // and calculate its corresponding bit index in the bitmap to be checked.
    pe(e, t, n) {
      let r = e.add(t.multiply(Integer.fromNumber(n)));
      return 1 === r.compare(yt) && (r = new Integer([r.getBits(0), r.getBits(1)], 0)), r.modulo(this.ge).toNumber();
    }
    // Return whether the bit on the given index in the bitmap is set to 1.
    ye(e) {
      return !!(this.bitmap[Math.floor(e / 8)] & 1 << e % 8);
    }
    mightContain(e) {
      if (0 === this.fe) return false;
      const t = __PRIVATE_getMd5HashValue(e), [n, r] = __PRIVATE_get64BitUints(t);
      for (let e2 = 0; e2 < this.hashCount; e2++) {
        const t2 = this.pe(n, r, e2);
        if (!this.ye(t2)) return false;
      }
      return true;
    }
    /** Create bloom filter for testing purposes only. */
    static create(e, t, n) {
      const r = e % 8 == 0 ? 0 : 8 - e % 8, i = new Uint8Array(Math.ceil(e / 8)), s = new _BloomFilter(i, r, t);
      return n.forEach(((e2) => s.insert(e2))), s;
    }
    insert(e) {
      if (0 === this.fe) return;
      const t = __PRIVATE_getMd5HashValue(e), [n, r] = __PRIVATE_get64BitUints(t);
      for (let e2 = 0; e2 < this.hashCount; e2++) {
        const t2 = this.pe(n, r, e2);
        this.we(t2);
      }
    }
    we(e) {
      const t = Math.floor(e / 8), n = e % 8;
      this.bitmap[t] |= 1 << n;
    }
  };
  var __PRIVATE_BloomFilterError = class extends Error {
    constructor() {
      super(...arguments), this.name = "BloomFilterError";
    }
  };
  var RemoteEvent = class _RemoteEvent {
    constructor(e, t, n, r, i) {
      this.snapshotVersion = e, this.targetChanges = t, this.targetMismatches = n, this.documentUpdates = r, this.resolvedLimboDocuments = i;
    }
    /**
     * HACK: Views require RemoteEvents in order to determine whether the view is
     * CURRENT, but secondary tabs don't receive remote events. So this method is
     * used to create a synthesized RemoteEvent that can be used to apply a
     * CURRENT status change to a View, for queries executed in a different tab.
     */
    // PORTING NOTE: Multi-tab only
    static createSynthesizedRemoteEventForCurrentChange(e, t, n) {
      const r = /* @__PURE__ */ new Map();
      return r.set(e, TargetChange.createSynthesizedTargetChangeForCurrentChange(e, t, n)), new _RemoteEvent(SnapshotVersion.min(), r, new SortedMap(__PRIVATE_primitiveComparator), __PRIVATE_mutableDocumentMap(), __PRIVATE_documentKeySet());
    }
  };
  var TargetChange = class _TargetChange {
    constructor(e, t, n, r, i) {
      this.resumeToken = e, this.current = t, this.addedDocuments = n, this.modifiedDocuments = r, this.removedDocuments = i;
    }
    /**
     * This method is used to create a synthesized TargetChanges that can be used to
     * apply a CURRENT status change to a View (for queries executed in a different
     * tab) or for new queries (to raise snapshots with correct CURRENT status).
     */
    static createSynthesizedTargetChangeForCurrentChange(e, t, n) {
      return new _TargetChange(n, t, __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet());
    }
  };
  var __PRIVATE_DocumentWatchChange = class {
    constructor(e, t, n, r) {
      this.Se = e, this.removedTargetIds = t, this.key = n, this.be = r;
    }
  };
  var __PRIVATE_ExistenceFilterChange = class {
    constructor(e, t) {
      this.targetId = e, this.De = t;
    }
  };
  var __PRIVATE_WatchTargetChange = class {
    constructor(e, t, n = ByteString.EMPTY_BYTE_STRING, r = null) {
      this.state = e, this.targetIds = t, this.resumeToken = n, this.cause = r;
    }
  };
  var __PRIVATE_TargetState = class {
    constructor() {
      this.ve = 0, /**
       * Keeps track of the document changes since the last raised snapshot.
       *
       * These changes are continuously updated as we receive document updates and
       * always reflect the current set of changes against the last issued snapshot.
       */
      this.Ce = __PRIVATE_snapshotChangesMap(), /** See public getters for explanations of these fields. */
      this.Fe = ByteString.EMPTY_BYTE_STRING, this.Me = false, /**
       * Whether this target state should be included in the next snapshot. We
       * initialize to true so that newly-added targets are included in the next
       * RemoteEvent.
       */
      this.xe = true;
    }
    /**
     * Whether this target has been marked 'current'.
     *
     * 'Current' has special meaning in the RPC protocol: It implies that the
     * Watch backend has sent us all changes up to the point at which the target
     * was added and that the target is consistent with the rest of the watch
     * stream.
     */
    get current() {
      return this.Me;
    }
    /** The last resume token sent to us for this target. */
    get resumeToken() {
      return this.Fe;
    }
    /** Whether this target has pending target adds or target removes. */
    get Oe() {
      return 0 !== this.ve;
    }
    /** Whether we have modified any state that should trigger a snapshot. */
    get Ne() {
      return this.xe;
    }
    /**
     * Applies the resume token to the TargetChange, but only when it has a new
     * value. Empty resumeTokens are discarded.
     */
    Be(e) {
      e.approximateByteSize() > 0 && (this.xe = true, this.Fe = e);
    }
    /**
     * Creates a target change from the current set of changes.
     *
     * To reset the document changes after raising this snapshot, call
     * `clearPendingChanges()`.
     */
    Le() {
      let e = __PRIVATE_documentKeySet(), t = __PRIVATE_documentKeySet(), n = __PRIVATE_documentKeySet();
      return this.Ce.forEach(((r, i) => {
        switch (i) {
          case 0:
            e = e.add(r);
            break;
          case 2:
            t = t.add(r);
            break;
          case 1:
            n = n.add(r);
            break;
          default:
            fail(38017, {
              changeType: i
            });
        }
      })), new TargetChange(this.Fe, this.Me, e, t, n);
    }
    /**
     * Resets the document changes and sets `hasPendingChanges` to false.
     */
    ke() {
      this.xe = false, this.Ce = __PRIVATE_snapshotChangesMap();
    }
    qe(e, t) {
      this.xe = true, this.Ce = this.Ce.insert(e, t);
    }
    Qe(e) {
      this.xe = true, this.Ce = this.Ce.remove(e);
    }
    $e() {
      this.ve += 1;
    }
    Ue() {
      this.ve -= 1, __PRIVATE_hardAssert(this.ve >= 0, 3241, {
        ve: this.ve
      });
    }
    Ke() {
      this.xe = true, this.Me = true;
    }
  };
  var __PRIVATE_WatchChangeAggregator = class {
    constructor(e) {
      this.We = e, /** The internal state of all tracked targets. */
      this.Ge = /* @__PURE__ */ new Map(), /** Keeps track of the documents to update since the last raised snapshot. */
      this.ze = __PRIVATE_mutableDocumentMap(), this.je = __PRIVATE_documentTargetMap(), /** A mapping of document keys to their set of target IDs. */
      this.Je = __PRIVATE_documentTargetMap(), /**
       * A map of targets with existence filter mismatches. These targets are
       * known to be inconsistent and their listens needs to be re-established by
       * RemoteStore.
       */
      this.He = new SortedMap(__PRIVATE_primitiveComparator);
    }
    /**
     * Processes and adds the DocumentWatchChange to the current set of changes.
     */
    Ye(e) {
      for (const t of e.Se) e.be && e.be.isFoundDocument() ? this.Ze(t, e.be) : this.Xe(t, e.key, e.be);
      for (const t of e.removedTargetIds) this.Xe(t, e.key, e.be);
    }
    /** Processes and adds the WatchTargetChange to the current set of changes. */
    et(e) {
      this.forEachTarget(e, ((t) => {
        const n = this.tt(t);
        switch (e.state) {
          case 0:
            this.nt(t) && n.Be(e.resumeToken);
            break;
          case 1:
            n.Ue(), n.Oe || // We have a freshly added target, so we need to reset any state
            // that we had previously. This can happen e.g. when remove and add
            // back a target for existence filter mismatches.
            n.ke(), n.Be(e.resumeToken);
            break;
          case 2:
            n.Ue(), n.Oe || this.removeTarget(t);
            break;
          case 3:
            this.nt(t) && (n.Ke(), n.Be(e.resumeToken));
            break;
          case 4:
            this.nt(t) && // Reset the target and synthesizes removes for all existing
            // documents. The backend will re-add any documents that still
            // match the target before it sends the next global snapshot.
            (this.rt(t), n.Be(e.resumeToken));
            break;
          default:
            fail(56790, {
              state: e.state
            });
        }
      }));
    }
    /**
     * Iterates over all targetIds that the watch change applies to: either the
     * targetIds explicitly listed in the change or the targetIds of all currently
     * active targets.
     */
    forEachTarget(e, t) {
      e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.Ge.forEach(((e2, n) => {
        this.nt(n) && t(n);
      }));
    }
    /**
     * Handles existence filters and synthesizes deletes for filter mismatches.
     * Targets that are invalidated by filter mismatches are added to
     * `pendingTargetResets`.
     */
    it(e) {
      const t = e.targetId, n = e.De.count, r = this.st(t);
      if (r) {
        const i = r.target;
        if (__PRIVATE_targetIsDocumentTarget(i)) if (0 === n) {
          const e2 = new DocumentKey(i.path);
          this.Xe(t, e2, MutableDocument.newNoDocument(e2, SnapshotVersion.min()));
        } else __PRIVATE_hardAssert(1 === n, 20013, {
          expectedCount: n
        });
        else {
          const r2 = this.ot(t);
          if (r2 !== n) {
            const n2 = this._t(e), i2 = n2 ? this.ut(n2, e, r2) : 1;
            if (0 !== i2) {
              this.rt(t);
              const e2 = 2 === i2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
              this.He = this.He.insert(t, e2);
            }
            null == pt || pt.ct((function __PRIVATE_createExistenceFilterMismatchInfoForTestingHooks(e2, t2, n3, r3, i3) {
              var s, o, _, a, u, c;
              const l = {
                localCacheCount: e2,
                existenceFilterCount: t2.count,
                databaseId: n3.database,
                projectId: n3.projectId
              }, h = t2.unchangedNames;
              h && (l.bloomFilter = {
                applied: 0 === i3,
                hashCount: null !== (s = null == h ? void 0 : h.hashCount) && void 0 !== s ? s : 0,
                bitmapLength: null !== (a = null === (_ = null === (o = null == h ? void 0 : h.bits) || void 0 === o ? void 0 : o.bitmap) || void 0 === _ ? void 0 : _.length) && void 0 !== a ? a : 0,
                padding: null !== (c = null === (u = null == h ? void 0 : h.bits) || void 0 === u ? void 0 : u.padding) && void 0 !== c ? c : 0,
                mightContain: (e3) => {
                  var t3;
                  return null !== (t3 = null == r3 ? void 0 : r3.mightContain(e3)) && void 0 !== t3 && t3;
                }
              });
              return l;
            })(r2, e.De, this.We.lt(), n2, i2));
          }
        }
      }
    }
    /**
     * Parse the bloom filter from the "unchanged_names" field of an existence
     * filter.
     */
    _t(e) {
      const t = e.De.unchangedNames;
      if (!t || !t.bits) return null;
      const { bits: { bitmap: n = "", padding: r = 0 }, hashCount: i = 0 } = t;
      let s, o;
      try {
        s = __PRIVATE_normalizeByteString(n).toUint8Array();
      } catch (e2) {
        if (e2 instanceof __PRIVATE_Base64DecodeError) return __PRIVATE_logWarn("Decoding the base64 bloom filter in existence filter failed (" + e2.message + "); ignoring the bloom filter and falling back to full re-query."), null;
        throw e2;
      }
      try {
        o = new BloomFilter(s, r, i);
      } catch (e2) {
        return __PRIVATE_logWarn(e2 instanceof __PRIVATE_BloomFilterError ? "BloomFilter error: " : "Applying bloom filter failed: ", e2), null;
      }
      return 0 === o.fe ? null : o;
    }
    /**
     * Apply bloom filter to remove the deleted documents, and return the
     * application status.
     */
    ut(e, t, n) {
      return t.De.count === n - this.ht(e, t.targetId) ? 0 : 2;
    }
    /**
     * Filter out removed documents based on bloom filter membership result and
     * return number of documents removed.
     */
    ht(e, t) {
      const n = this.We.getRemoteKeysForTarget(t);
      let r = 0;
      return n.forEach(((n2) => {
        const i = this.We.lt(), s = `projects/${i.projectId}/databases/${i.database}/documents/${n2.path.canonicalString()}`;
        e.mightContain(s) || (this.Xe(
          t,
          n2,
          /*updatedDocument=*/
          null
        ), r++);
      })), r;
    }
    /**
     * Converts the currently accumulated state into a remote event at the
     * provided snapshot version. Resets the accumulated changes before returning.
     */
    Pt(e) {
      const t = /* @__PURE__ */ new Map();
      this.Ge.forEach(((n2, r2) => {
        const i = this.st(r2);
        if (i) {
          if (n2.current && __PRIVATE_targetIsDocumentTarget(i.target)) {
            const t2 = new DocumentKey(i.target.path);
            this.Tt(t2).has(r2) || this.It(r2, t2) || this.Xe(r2, t2, MutableDocument.newNoDocument(t2, e));
          }
          n2.Ne && (t.set(r2, n2.Le()), n2.ke());
        }
      }));
      let n = __PRIVATE_documentKeySet();
      this.Je.forEach(((e2, t2) => {
        let r2 = true;
        t2.forEachWhile(((e3) => {
          const t3 = this.st(e3);
          return !t3 || "TargetPurposeLimboResolution" === t3.purpose || (r2 = false, false);
        })), r2 && (n = n.add(e2));
      })), this.ze.forEach(((t2, n2) => n2.setReadTime(e)));
      const r = new RemoteEvent(e, t, this.He, this.ze, n);
      return this.ze = __PRIVATE_mutableDocumentMap(), this.je = __PRIVATE_documentTargetMap(), this.Je = __PRIVATE_documentTargetMap(), this.He = new SortedMap(__PRIVATE_primitiveComparator), r;
    }
    /**
     * Adds the provided document to the internal list of document updates and
     * its document key to the given target's mapping.
     */
    // Visible for testing.
    Ze(e, t) {
      if (!this.nt(e)) return;
      const n = this.It(e, t.key) ? 2 : 0;
      this.tt(e).qe(t.key, n), this.ze = this.ze.insert(t.key, t), this.je = this.je.insert(t.key, this.Tt(t.key).add(e)), this.Je = this.Je.insert(t.key, this.dt(t.key).add(e));
    }
    /**
     * Removes the provided document from the target mapping. If the
     * document no longer matches the target, but the document's state is still
     * known (e.g. we know that the document was deleted or we received the change
     * that caused the filter mismatch), the new document can be provided
     * to update the remote document cache.
     */
    // Visible for testing.
    Xe(e, t, n) {
      if (!this.nt(e)) return;
      const r = this.tt(e);
      this.It(e, t) ? r.qe(
        t,
        1
        /* ChangeType.Removed */
      ) : (
        // The document may have entered and left the target before we raised a
        // snapshot, so we can just ignore the change.
        r.Qe(t)
      ), this.Je = this.Je.insert(t, this.dt(t).delete(e)), this.Je = this.Je.insert(t, this.dt(t).add(e)), n && (this.ze = this.ze.insert(t, n));
    }
    removeTarget(e) {
      this.Ge.delete(e);
    }
    /**
     * Returns the current count of documents in the target. This includes both
     * the number of documents that the LocalStore considers to be part of the
     * target as well as any accumulated changes.
     */
    ot(e) {
      const t = this.tt(e).Le();
      return this.We.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size;
    }
    /**
     * Increment the number of acks needed from watch before we can consider the
     * server to be 'in-sync' with the client's active targets.
     */
    $e(e) {
      this.tt(e).$e();
    }
    tt(e) {
      let t = this.Ge.get(e);
      return t || (t = new __PRIVATE_TargetState(), this.Ge.set(e, t)), t;
    }
    dt(e) {
      let t = this.Je.get(e);
      return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.Je = this.Je.insert(e, t)), t;
    }
    Tt(e) {
      let t = this.je.get(e);
      return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.je = this.je.insert(e, t)), t;
    }
    /**
     * Verifies that the user is still interested in this target (by calling
     * `getTargetDataForTarget()`) and that we are not waiting for pending ADDs
     * from watch.
     */
    nt(e) {
      const t = null !== this.st(e);
      return t || __PRIVATE_logDebug("WatchChangeAggregator", "Detected inactive target", e), t;
    }
    /**
     * Returns the TargetData for an active target (i.e. a target that the user
     * is still interested in that has no outstanding target change requests).
     */
    st(e) {
      const t = this.Ge.get(e);
      return t && t.Oe ? null : this.We.Et(e);
    }
    /**
     * Resets the state of a Watch target to its initial state (e.g. sets
     * 'current' to false, clears the resume token and removes its target mapping
     * from all documents).
     */
    rt(e) {
      this.Ge.set(e, new __PRIVATE_TargetState());
      this.We.getRemoteKeysForTarget(e).forEach(((t) => {
        this.Xe(
          e,
          t,
          /*updatedDocument=*/
          null
        );
      }));
    }
    /**
     * Returns whether the LocalStore considers the document to be part of the
     * specified target.
     */
    It(e, t) {
      return this.We.getRemoteKeysForTarget(e).has(t);
    }
  };
  function __PRIVATE_documentTargetMap() {
    return new SortedMap(DocumentKey.comparator);
  }
  function __PRIVATE_snapshotChangesMap() {
    return new SortedMap(DocumentKey.comparator);
  }
  var wt = /* @__PURE__ */ (() => {
    const e = {
      asc: "ASCENDING",
      desc: "DESCENDING"
    };
    return e;
  })();
  var St = /* @__PURE__ */ (() => {
    const e = {
      "<": "LESS_THAN",
      "<=": "LESS_THAN_OR_EQUAL",
      ">": "GREATER_THAN",
      ">=": "GREATER_THAN_OR_EQUAL",
      "==": "EQUAL",
      "!=": "NOT_EQUAL",
      "array-contains": "ARRAY_CONTAINS",
      in: "IN",
      "not-in": "NOT_IN",
      "array-contains-any": "ARRAY_CONTAINS_ANY"
    };
    return e;
  })();
  var bt = /* @__PURE__ */ (() => {
    const e = {
      and: "AND",
      or: "OR"
    };
    return e;
  })();
  var JsonProtoSerializer = class {
    constructor(e, t) {
      this.databaseId = e, this.useProto3Json = t;
    }
  };
  function __PRIVATE_toInt32Proto(e, t) {
    return e.useProto3Json || __PRIVATE_isNullOrUndefined(t) ? t : {
      value: t
    };
  }
  function toTimestamp(e, t) {
    if (e.useProto3Json) {
      return `${new Date(1e3 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
    }
    return {
      seconds: "" + t.seconds,
      nanos: t.nanoseconds
    };
  }
  function __PRIVATE_toBytes(e, t) {
    return e.useProto3Json ? t.toBase64() : t.toUint8Array();
  }
  function __PRIVATE_toVersion(e, t) {
    return toTimestamp(e, t.toTimestamp());
  }
  function __PRIVATE_fromVersion(e) {
    return __PRIVATE_hardAssert(!!e, 49232), SnapshotVersion.fromTimestamp((function fromTimestamp(e2) {
      const t = __PRIVATE_normalizeTimestamp(e2);
      return new Timestamp(t.seconds, t.nanos);
    })(e));
  }
  function __PRIVATE_toResourceName(e, t) {
    return __PRIVATE_toResourcePath(e, t).canonicalString();
  }
  function __PRIVATE_toResourcePath(e, t) {
    const n = (function __PRIVATE_fullyQualifiedPrefixPath(e2) {
      return new ResourcePath(["projects", e2.projectId, "databases", e2.database]);
    })(e).child("documents");
    return void 0 === t ? n : n.child(t);
  }
  function __PRIVATE_fromResourceName(e) {
    const t = ResourcePath.fromString(e);
    return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t), 10190, {
      key: t.toString()
    }), t;
  }
  function __PRIVATE_toName(e, t) {
    return __PRIVATE_toResourceName(e.databaseId, t.path);
  }
  function fromName(e, t) {
    const n = __PRIVATE_fromResourceName(t);
    if (n.get(1) !== e.databaseId.projectId) throw new FirestoreError(N.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + e.databaseId.projectId);
    if (n.get(3) !== e.databaseId.database) throw new FirestoreError(N.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + e.databaseId.database);
    return new DocumentKey(__PRIVATE_extractLocalPathFromResourceName(n));
  }
  function __PRIVATE_toQueryPath(e, t) {
    return __PRIVATE_toResourceName(e.databaseId, t);
  }
  function __PRIVATE_fromQueryPath(e) {
    const t = __PRIVATE_fromResourceName(e);
    return 4 === t.length ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t);
  }
  function __PRIVATE_getEncodedDatabaseId(e) {
    return new ResourcePath(["projects", e.databaseId.projectId, "databases", e.databaseId.database]).canonicalString();
  }
  function __PRIVATE_extractLocalPathFromResourceName(e) {
    return __PRIVATE_hardAssert(e.length > 4 && "documents" === e.get(4), 29091, {
      key: e.toString()
    }), e.popFirst(5);
  }
  function __PRIVATE_toMutationDocument(e, t, n) {
    return {
      name: __PRIVATE_toName(e, t),
      fields: n.value.mapValue.fields
    };
  }
  function __PRIVATE_fromWatchChange(e, t) {
    let n;
    if ("targetChange" in t) {
      t.targetChange;
      const r = (function __PRIVATE_fromWatchTargetChangeState(e2) {
        return "NO_CHANGE" === e2 ? 0 : "ADD" === e2 ? 1 : "REMOVE" === e2 ? 2 : "CURRENT" === e2 ? 3 : "RESET" === e2 ? 4 : fail(39313, {
          state: e2
        });
      })(t.targetChange.targetChangeType || "NO_CHANGE"), i = t.targetChange.targetIds || [], s = (function __PRIVATE_fromBytes(e2, t2) {
        return e2.useProto3Json ? (__PRIVATE_hardAssert(void 0 === t2 || "string" == typeof t2, 58123), ByteString.fromBase64String(t2 || "")) : (__PRIVATE_hardAssert(void 0 === t2 || // Check if the value is an instance of both Buffer and Uint8Array,
        // despite the fact that Buffer extends Uint8Array. In some
        // environments, such as jsdom, the prototype chain of Buffer
        // does not indicate that it extends Uint8Array.
        t2 instanceof Buffer || t2 instanceof Uint8Array, 16193), ByteString.fromUint8Array(t2 || new Uint8Array()));
      })(e, t.targetChange.resumeToken), o = t.targetChange.cause, _ = o && (function __PRIVATE_fromRpcStatus(e2) {
        const t2 = void 0 === e2.code ? N.UNKNOWN : __PRIVATE_mapCodeFromRpcCode(e2.code);
        return new FirestoreError(t2, e2.message || "");
      })(o);
      n = new __PRIVATE_WatchTargetChange(r, i, s, _ || null);
    } else if ("documentChange" in t) {
      t.documentChange;
      const r = t.documentChange;
      r.document, r.document.name, r.document.updateTime;
      const i = fromName(e, r.document.name), s = __PRIVATE_fromVersion(r.document.updateTime), o = r.document.createTime ? __PRIVATE_fromVersion(r.document.createTime) : SnapshotVersion.min(), _ = new ObjectValue({
        mapValue: {
          fields: r.document.fields
        }
      }), a = MutableDocument.newFoundDocument(i, s, o, _), u = r.targetIds || [], c = r.removedTargetIds || [];
      n = new __PRIVATE_DocumentWatchChange(u, c, a.key, a);
    } else if ("documentDelete" in t) {
      t.documentDelete;
      const r = t.documentDelete;
      r.document;
      const i = fromName(e, r.document), s = r.readTime ? __PRIVATE_fromVersion(r.readTime) : SnapshotVersion.min(), o = MutableDocument.newNoDocument(i, s), _ = r.removedTargetIds || [];
      n = new __PRIVATE_DocumentWatchChange([], _, o.key, o);
    } else if ("documentRemove" in t) {
      t.documentRemove;
      const r = t.documentRemove;
      r.document;
      const i = fromName(e, r.document), s = r.removedTargetIds || [];
      n = new __PRIVATE_DocumentWatchChange([], s, i, null);
    } else {
      if (!("filter" in t)) return fail(11601, {
        At: t
      });
      {
        t.filter;
        const e2 = t.filter;
        e2.targetId;
        const { count: r = 0, unchangedNames: i } = e2, s = new ExistenceFilter(r, i), o = e2.targetId;
        n = new __PRIVATE_ExistenceFilterChange(o, s);
      }
    }
    return n;
  }
  function toMutation(e, t) {
    let n;
    if (t instanceof __PRIVATE_SetMutation) n = {
      update: __PRIVATE_toMutationDocument(e, t.key, t.value)
    };
    else if (t instanceof __PRIVATE_DeleteMutation) n = {
      delete: __PRIVATE_toName(e, t.key)
    };
    else if (t instanceof __PRIVATE_PatchMutation) n = {
      update: __PRIVATE_toMutationDocument(e, t.key, t.data),
      updateMask: __PRIVATE_toDocumentMask(t.fieldMask)
    };
    else {
      if (!(t instanceof __PRIVATE_VerifyMutation)) return fail(16599, {
        Rt: t.type
      });
      n = {
        verify: __PRIVATE_toName(e, t.key)
      };
    }
    return t.fieldTransforms.length > 0 && (n.updateTransforms = t.fieldTransforms.map(((e2) => (function __PRIVATE_toFieldTransform(e3, t2) {
      const n2 = t2.transform;
      if (n2 instanceof __PRIVATE_ServerTimestampTransform) return {
        fieldPath: t2.field.canonicalString(),
        setToServerValue: "REQUEST_TIME"
      };
      if (n2 instanceof __PRIVATE_ArrayUnionTransformOperation) return {
        fieldPath: t2.field.canonicalString(),
        appendMissingElements: {
          values: n2.elements
        }
      };
      if (n2 instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
        fieldPath: t2.field.canonicalString(),
        removeAllFromArray: {
          values: n2.elements
        }
      };
      if (n2 instanceof __PRIVATE_NumericIncrementTransformOperation) return {
        fieldPath: t2.field.canonicalString(),
        increment: n2.Ee
      };
      throw fail(20930, {
        transform: t2.transform
      });
    })(0, e2)))), t.precondition.isNone || (n.currentDocument = (function __PRIVATE_toPrecondition(e2, t2) {
      return void 0 !== t2.updateTime ? {
        updateTime: __PRIVATE_toVersion(e2, t2.updateTime)
      } : void 0 !== t2.exists ? {
        exists: t2.exists
      } : fail(27497);
    })(e, t.precondition)), n;
  }
  function __PRIVATE_fromWriteResults(e, t) {
    return e && e.length > 0 ? (__PRIVATE_hardAssert(void 0 !== t, 14353), e.map(((e2) => (function __PRIVATE_fromWriteResult(e3, t2) {
      let n = e3.updateTime ? __PRIVATE_fromVersion(e3.updateTime) : __PRIVATE_fromVersion(t2);
      return n.isEqual(SnapshotVersion.min()) && // The Firestore Emulator currently returns an update time of 0 for
      // deletes of non-existing documents (rather than null). This breaks the
      // test "get deleted doc while offline with source=cache" as NoDocuments
      // with version 0 are filtered by IndexedDb's RemoteDocumentCache.
      // TODO(#2149): Remove this when Emulator is fixed
      (n = __PRIVATE_fromVersion(t2)), new MutationResult(n, e3.transformResults || []);
    })(e2, t)))) : [];
  }
  function __PRIVATE_toDocumentsTarget(e, t) {
    return {
      documents: [__PRIVATE_toQueryPath(e, t.path)]
    };
  }
  function __PRIVATE_toQueryTarget(e, t) {
    const n = {
      structuredQuery: {}
    }, r = t.path;
    let i;
    null !== t.collectionGroup ? (i = r, n.structuredQuery.from = [{
      collectionId: t.collectionGroup,
      allDescendants: true
    }]) : (i = r.popLast(), n.structuredQuery.from = [{
      collectionId: r.lastSegment()
    }]), n.parent = __PRIVATE_toQueryPath(e, i);
    const s = (function __PRIVATE_toFilters(e2) {
      if (0 === e2.length) return;
      return __PRIVATE_toFilter(CompositeFilter.create(
        e2,
        "and"
        /* CompositeOperator.AND */
      ));
    })(t.filters);
    s && (n.structuredQuery.where = s);
    const o = (function __PRIVATE_toOrder(e2) {
      if (0 === e2.length) return;
      return e2.map(((e3) => (
        // visible for testing
        (function __PRIVATE_toPropertyOrder(e4) {
          return {
            field: __PRIVATE_toFieldPathReference(e4.field),
            direction: __PRIVATE_toDirection(e4.dir)
          };
        })(e3)
      )));
    })(t.orderBy);
    o && (n.structuredQuery.orderBy = o);
    const _ = __PRIVATE_toInt32Proto(e, t.limit);
    return null !== _ && (n.structuredQuery.limit = _), t.startAt && (n.structuredQuery.startAt = (function __PRIVATE_toStartAtCursor(e2) {
      return {
        before: e2.inclusive,
        values: e2.position
      };
    })(t.startAt)), t.endAt && (n.structuredQuery.endAt = (function __PRIVATE_toEndAtCursor(e2) {
      return {
        before: !e2.inclusive,
        values: e2.position
      };
    })(t.endAt)), {
      Vt: n,
      parent: i
    };
  }
  function __PRIVATE_convertQueryTargetToQuery(e) {
    let t = __PRIVATE_fromQueryPath(e.parent);
    const n = e.structuredQuery, r = n.from ? n.from.length : 0;
    let i = null;
    if (r > 0) {
      __PRIVATE_hardAssert(1 === r, 65062);
      const e2 = n.from[0];
      e2.allDescendants ? i = e2.collectionId : t = t.child(e2.collectionId);
    }
    let s = [];
    n.where && (s = (function __PRIVATE_fromFilters(e2) {
      const t2 = __PRIVATE_fromFilter(e2);
      if (t2 instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t2)) return t2.getFilters();
      return [t2];
    })(n.where));
    let o = [];
    n.orderBy && (o = (function __PRIVATE_fromOrder(e2) {
      return e2.map(((e3) => (function __PRIVATE_fromPropertyOrder(e4) {
        return new OrderBy(
          __PRIVATE_fromFieldPathReference(e4.field),
          // visible for testing
          (function __PRIVATE_fromDirection(e5) {
            switch (e5) {
              case "ASCENDING":
                return "asc";
              case "DESCENDING":
                return "desc";
              default:
                return;
            }
          })(e4.direction)
        );
      })(e3)));
    })(n.orderBy));
    let _ = null;
    n.limit && (_ = (function __PRIVATE_fromInt32Proto(e2) {
      let t2;
      return t2 = "object" == typeof e2 ? e2.value : e2, __PRIVATE_isNullOrUndefined(t2) ? null : t2;
    })(n.limit));
    let a = null;
    n.startAt && (a = (function __PRIVATE_fromStartAtCursor(e2) {
      const t2 = !!e2.before, n2 = e2.values || [];
      return new Bound(n2, t2);
    })(n.startAt));
    let u = null;
    return n.endAt && (u = (function __PRIVATE_fromEndAtCursor(e2) {
      const t2 = !e2.before, n2 = e2.values || [];
      return new Bound(n2, t2);
    })(n.endAt)), __PRIVATE_newQuery(t, i, o, s, _, "F", a, u);
  }
  function __PRIVATE_toListenRequestLabels(e, t) {
    const n = (function __PRIVATE_toLabel(e2) {
      switch (e2) {
        case "TargetPurposeListen":
          return null;
        case "TargetPurposeExistenceFilterMismatch":
          return "existence-filter-mismatch";
        case "TargetPurposeExistenceFilterMismatchBloom":
          return "existence-filter-mismatch-bloom";
        case "TargetPurposeLimboResolution":
          return "limbo-document";
        default:
          return fail(28987, {
            purpose: e2
          });
      }
    })(t.purpose);
    return null == n ? null : {
      "goog-listen-tags": n
    };
  }
  function __PRIVATE_fromFilter(e) {
    return void 0 !== e.unaryFilter ? (function __PRIVATE_fromUnaryFilter(e2) {
      switch (e2.unaryFilter.op) {
        case "IS_NAN":
          const t = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
          return FieldFilter.create(t, "==", {
            doubleValue: NaN
          });
        case "IS_NULL":
          const n = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
          return FieldFilter.create(n, "==", {
            nullValue: "NULL_VALUE"
          });
        case "IS_NOT_NAN":
          const r = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
          return FieldFilter.create(r, "!=", {
            doubleValue: NaN
          });
        case "IS_NOT_NULL":
          const i = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
          return FieldFilter.create(i, "!=", {
            nullValue: "NULL_VALUE"
          });
        case "OPERATOR_UNSPECIFIED":
          return fail(61313);
        default:
          return fail(60726);
      }
    })(e) : void 0 !== e.fieldFilter ? (function __PRIVATE_fromFieldFilter(e2) {
      return FieldFilter.create(__PRIVATE_fromFieldPathReference(e2.fieldFilter.field), (function __PRIVATE_fromOperatorName(e3) {
        switch (e3) {
          case "EQUAL":
            return "==";
          case "NOT_EQUAL":
            return "!=";
          case "GREATER_THAN":
            return ">";
          case "GREATER_THAN_OR_EQUAL":
            return ">=";
          case "LESS_THAN":
            return "<";
          case "LESS_THAN_OR_EQUAL":
            return "<=";
          case "ARRAY_CONTAINS":
            return "array-contains";
          case "IN":
            return "in";
          case "NOT_IN":
            return "not-in";
          case "ARRAY_CONTAINS_ANY":
            return "array-contains-any";
          case "OPERATOR_UNSPECIFIED":
            return fail(58110);
          default:
            return fail(50506);
        }
      })(e2.fieldFilter.op), e2.fieldFilter.value);
    })(e) : void 0 !== e.compositeFilter ? (function __PRIVATE_fromCompositeFilter(e2) {
      return CompositeFilter.create(e2.compositeFilter.filters.map(((e3) => __PRIVATE_fromFilter(e3))), (function __PRIVATE_fromCompositeOperatorName(e3) {
        switch (e3) {
          case "AND":
            return "and";
          case "OR":
            return "or";
          default:
            return fail(1026);
        }
      })(e2.compositeFilter.op));
    })(e) : fail(30097, {
      filter: e
    });
  }
  function __PRIVATE_toDirection(e) {
    return wt[e];
  }
  function __PRIVATE_toOperatorName(e) {
    return St[e];
  }
  function __PRIVATE_toCompositeOperatorName(e) {
    return bt[e];
  }
  function __PRIVATE_toFieldPathReference(e) {
    return {
      fieldPath: e.canonicalString()
    };
  }
  function __PRIVATE_fromFieldPathReference(e) {
    return FieldPath$1.fromServerFormat(e.fieldPath);
  }
  function __PRIVATE_toFilter(e) {
    return e instanceof FieldFilter ? (function __PRIVATE_toUnaryOrFieldFilter(e2) {
      if ("==" === e2.op) {
        if (__PRIVATE_isNanValue(e2.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NAN"
          }
        };
        if (__PRIVATE_isNullValue(e2.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NULL"
          }
        };
      } else if ("!=" === e2.op) {
        if (__PRIVATE_isNanValue(e2.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NAN"
          }
        };
        if (__PRIVATE_isNullValue(e2.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NULL"
          }
        };
      }
      return {
        fieldFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: __PRIVATE_toOperatorName(e2.op),
          value: e2.value
        }
      };
    })(e) : e instanceof CompositeFilter ? (function __PRIVATE_toCompositeFilter(e2) {
      const t = e2.getFilters().map(((e3) => __PRIVATE_toFilter(e3)));
      if (1 === t.length) return t[0];
      return {
        compositeFilter: {
          op: __PRIVATE_toCompositeOperatorName(e2.op),
          filters: t
        }
      };
    })(e) : fail(54877, {
      filter: e
    });
  }
  function __PRIVATE_toDocumentMask(e) {
    const t = [];
    return e.fields.forEach(((e2) => t.push(e2.canonicalString()))), {
      fieldPaths: t
    };
  }
  function __PRIVATE_isValidResourceName(e) {
    return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
  }
  var TargetData = class _TargetData {
    constructor(e, t, n, r, i = SnapshotVersion.min(), s = SnapshotVersion.min(), o = ByteString.EMPTY_BYTE_STRING, _ = null) {
      this.target = e, this.targetId = t, this.purpose = n, this.sequenceNumber = r, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = s, this.resumeToken = o, this.expectedCount = _;
    }
    /** Creates a new target data instance with an updated sequence number. */
    withSequenceNumber(e) {
      return new _TargetData(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
    }
    /**
     * Creates a new target data instance with an updated resume token and
     * snapshot version.
     */
    withResumeToken(e, t) {
      return new _TargetData(
        this.target,
        this.targetId,
        this.purpose,
        this.sequenceNumber,
        t,
        this.lastLimboFreeSnapshotVersion,
        e,
        /* expectedCount= */
        null
      );
    }
    /**
     * Creates a new target data instance with an updated expected count.
     */
    withExpectedCount(e) {
      return new _TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
    }
    /**
     * Creates a new target data instance with an updated last limbo free
     * snapshot version number.
     */
    withLastLimboFreeSnapshotVersion(e) {
      return new _TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
    }
  };
  var __PRIVATE_LocalSerializer = class {
    constructor(e) {
      this.gt = e;
    }
  };
  function __PRIVATE_fromBundledQuery(e) {
    const t = __PRIVATE_convertQueryTargetToQuery({
      parent: e.parent,
      structuredQuery: e.structuredQuery
    });
    return "LAST" === e.limitType ? __PRIVATE_queryWithLimit(
      t,
      t.limit,
      "L"
      /* LimitType.Last */
    ) : t;
  }
  var __PRIVATE_FirestoreIndexValueWriter = class {
    constructor() {
    }
    // The write methods below short-circuit writing terminators for values
    // containing a (terminating) truncated value.
    // As an example, consider the resulting encoding for:
    // ["bar", [2, "foo"]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TERM, TERM, TERM)
    // ["bar", [2, truncated("foo")]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TRUNC)
    // ["bar", truncated(["foo"])] -> (STRING, "bar", TERM, ARRAY. STRING, "foo", TERM, TRUNC)
    /** Writes an index value.  */
    bt(e, t) {
      this.Dt(e, t), // Write separator to split index values
      // (see go/firestore-storage-format#encodings).
      t.vt();
    }
    Dt(e, t) {
      if ("nullValue" in e) this.Ct(t, 5);
      else if ("booleanValue" in e) this.Ct(t, 10), t.Ft(e.booleanValue ? 1 : 0);
      else if ("integerValue" in e) this.Ct(t, 15), t.Ft(__PRIVATE_normalizeNumber(e.integerValue));
      else if ("doubleValue" in e) {
        const n = __PRIVATE_normalizeNumber(e.doubleValue);
        isNaN(n) ? this.Ct(t, 13) : (this.Ct(t, 15), __PRIVATE_isNegativeZero(n) ? (
          // -0.0, 0 and 0.0 are all considered the same
          t.Ft(0)
        ) : t.Ft(n));
      } else if ("timestampValue" in e) {
        let n = e.timestampValue;
        this.Ct(t, 20), "string" == typeof n && (n = __PRIVATE_normalizeTimestamp(n)), t.Mt(`${n.seconds || ""}`), t.Ft(n.nanos || 0);
      } else if ("stringValue" in e) this.xt(e.stringValue, t), this.Ot(t);
      else if ("bytesValue" in e) this.Ct(t, 30), t.Nt(__PRIVATE_normalizeByteString(e.bytesValue)), this.Ot(t);
      else if ("referenceValue" in e) this.Bt(e.referenceValue, t);
      else if ("geoPointValue" in e) {
        const n = e.geoPointValue;
        this.Ct(t, 45), t.Ft(n.latitude || 0), t.Ft(n.longitude || 0);
      } else "mapValue" in e ? __PRIVATE_isMaxValue(e) ? this.Ct(t, Number.MAX_SAFE_INTEGER) : __PRIVATE_isVectorValue(e) ? this.Lt(e.mapValue, t) : (this.kt(e.mapValue, t), this.Ot(t)) : "arrayValue" in e ? (this.qt(e.arrayValue, t), this.Ot(t)) : fail(19022, {
        Qt: e
      });
    }
    xt(e, t) {
      this.Ct(t, 25), this.$t(e, t);
    }
    $t(e, t) {
      t.Mt(e);
    }
    kt(e, t) {
      const n = e.fields || {};
      this.Ct(t, 55);
      for (const e2 of Object.keys(n)) this.xt(e2, t), this.Dt(n[e2], t);
    }
    Lt(e, t) {
      var n, r;
      const i = e.fields || {};
      this.Ct(t, 53);
      const s = Tt, o = (null === (r = null === (n = i[s].arrayValue) || void 0 === n ? void 0 : n.values) || void 0 === r ? void 0 : r.length) || 0;
      this.Ct(t, 15), t.Ft(__PRIVATE_normalizeNumber(o)), // Vectors then sort by position value
      this.xt(s, t), this.Dt(i[s], t);
    }
    qt(e, t) {
      const n = e.values || [];
      this.Ct(t, 50);
      for (const e2 of n) this.Dt(e2, t);
    }
    Bt(e, t) {
      this.Ct(t, 37);
      DocumentKey.fromName(e).path.forEach(((e2) => {
        this.Ct(t, 60), this.$t(e2, t);
      }));
    }
    Ct(e, t) {
      e.Ft(t);
    }
    Ot(e) {
      e.Ft(2);
    }
  };
  __PRIVATE_FirestoreIndexValueWriter.Ut = new __PRIVATE_FirestoreIndexValueWriter();
  var __PRIVATE_MemoryIndexManager = class {
    constructor() {
      this.Dn = new __PRIVATE_MemoryCollectionParentIndex();
    }
    addToCollectionParentIndex(e, t) {
      return this.Dn.add(t), PersistencePromise.resolve();
    }
    getCollectionParents(e, t) {
      return PersistencePromise.resolve(this.Dn.getEntries(t));
    }
    addFieldIndex(e, t) {
      return PersistencePromise.resolve();
    }
    deleteFieldIndex(e, t) {
      return PersistencePromise.resolve();
    }
    deleteAllFieldIndexes(e) {
      return PersistencePromise.resolve();
    }
    createTargetIndexes(e, t) {
      return PersistencePromise.resolve();
    }
    getDocumentsMatchingTarget(e, t) {
      return PersistencePromise.resolve(null);
    }
    getIndexType(e, t) {
      return PersistencePromise.resolve(
        0
        /* IndexType.NONE */
      );
    }
    getFieldIndexes(e, t) {
      return PersistencePromise.resolve([]);
    }
    getNextCollectionGroupToUpdate(e) {
      return PersistencePromise.resolve(null);
    }
    getMinOffset(e, t) {
      return PersistencePromise.resolve(IndexOffset.min());
    }
    getMinOffsetFromCollectionGroup(e, t) {
      return PersistencePromise.resolve(IndexOffset.min());
    }
    updateCollectionGroup(e, t, n) {
      return PersistencePromise.resolve();
    }
    updateIndexEntries(e, t) {
      return PersistencePromise.resolve();
    }
  };
  var __PRIVATE_MemoryCollectionParentIndex = class {
    constructor() {
      this.index = {};
    }
    // Returns false if the entry already existed.
    add(e) {
      const t = e.lastSegment(), n = e.popLast(), r = this.index[t] || new SortedSet(ResourcePath.comparator), i = !r.has(n);
      return this.index[t] = r.add(n), i;
    }
    has(e) {
      const t = e.lastSegment(), n = e.popLast(), r = this.index[t];
      return r && r.has(n);
    }
    getEntries(e) {
      return (this.index[e] || new SortedSet(ResourcePath.comparator)).toArray();
    }
  };
  var Ct = new Uint8Array(0);
  var Ft = {
    didRun: false,
    sequenceNumbersCollected: 0,
    targetsRemoved: 0,
    documentsRemoved: 0
  };
  var Mt = 41943040;
  var LruParams = class _LruParams {
    static withCacheSize(e) {
      return new _LruParams(e, _LruParams.DEFAULT_COLLECTION_PERCENTILE, _LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
    }
    constructor(e, t, n) {
      this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
    }
  };
  LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, LruParams.DEFAULT = new LruParams(Mt, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);
  var __PRIVATE_TargetIdGenerator = class ___PRIVATE_TargetIdGenerator {
    constructor(e) {
      this._r = e;
    }
    next() {
      return this._r += 2, this._r;
    }
    static ar() {
      return new ___PRIVATE_TargetIdGenerator(0);
    }
    static ur() {
      return new ___PRIVATE_TargetIdGenerator(-1);
    }
  };
  var xt = "LruGarbageCollector";
  var Ot = 1048576;
  function __PRIVATE_bufferEntryComparator([e, t], [n, r]) {
    const i = __PRIVATE_primitiveComparator(e, n);
    return 0 === i ? __PRIVATE_primitiveComparator(t, r) : i;
  }
  var __PRIVATE_RollingSequenceNumberBuffer = class {
    constructor(e) {
      this.Tr = e, this.buffer = new SortedSet(__PRIVATE_bufferEntryComparator), this.Ir = 0;
    }
    dr() {
      return ++this.Ir;
    }
    Er(e) {
      const t = [e, this.dr()];
      if (this.buffer.size < this.Tr) this.buffer = this.buffer.add(t);
      else {
        const e2 = this.buffer.last();
        __PRIVATE_bufferEntryComparator(t, e2) < 0 && (this.buffer = this.buffer.delete(e2).add(t));
      }
    }
    get maxValue() {
      return this.buffer.last()[0];
    }
  };
  var __PRIVATE_LruScheduler = class {
    constructor(e, t, n) {
      this.garbageCollector = e, this.asyncQueue = t, this.localStore = n, this.Ar = null;
    }
    start() {
      -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.Rr(6e4);
    }
    stop() {
      this.Ar && (this.Ar.cancel(), this.Ar = null);
    }
    get started() {
      return null !== this.Ar;
    }
    Rr(e) {
      __PRIVATE_logDebug(xt, `Garbage collection scheduled in ${e}ms`), this.Ar = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, (async () => {
        this.Ar = null;
        try {
          await this.localStore.collectGarbage(this.garbageCollector);
        } catch (e2) {
          __PRIVATE_isIndexedDbTransactionError(e2) ? __PRIVATE_logDebug(xt, "Ignoring IndexedDB error during garbage collection: ", e2) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
        }
        await this.Rr(3e5);
      }));
    }
  };
  var __PRIVATE_LruGarbageCollectorImpl = class {
    constructor(e, t) {
      this.Vr = e, this.params = t;
    }
    calculateTargetCount(e, t) {
      return this.Vr.mr(e).next(((e2) => Math.floor(t / 100 * e2)));
    }
    nthSequenceNumber(e, t) {
      if (0 === t) return PersistencePromise.resolve(__PRIVATE_ListenSequence.ue);
      const n = new __PRIVATE_RollingSequenceNumberBuffer(t);
      return this.Vr.forEachTarget(e, ((e2) => n.Er(e2.sequenceNumber))).next((() => this.Vr.gr(e, ((e2) => n.Er(e2))))).next((() => n.maxValue));
    }
    removeTargets(e, t, n) {
      return this.Vr.removeTargets(e, t, n);
    }
    removeOrphanedDocuments(e, t) {
      return this.Vr.removeOrphanedDocuments(e, t);
    }
    collect(e, t) {
      return -1 === this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", "Garbage collection skipped; disabled"), PersistencePromise.resolve(Ft)) : this.getCacheSize(e).next(((n) => n < this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), Ft) : this.pr(e, t)));
    }
    getCacheSize(e) {
      return this.Vr.getCacheSize(e);
    }
    pr(e, t) {
      let n, r, i, s, o, _, u;
      const c = Date.now();
      return this.calculateTargetCount(e, this.params.percentileToCollect).next(((t2) => (
        // Cap at the configured max
        (t2 > this.params.maximumSequenceNumbersToCollect ? (__PRIVATE_logDebug("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t2}`), r = this.params.maximumSequenceNumbersToCollect) : r = t2, s = Date.now(), this.nthSequenceNumber(e, r))
      ))).next(((r2) => (n = r2, o = Date.now(), this.removeTargets(e, n, t)))).next(((t2) => (i = t2, _ = Date.now(), this.removeOrphanedDocuments(e, n)))).next(((e2) => {
        if (u = Date.now(), __PRIVATE_getLogLevel() <= LogLevel.DEBUG) {
          __PRIVATE_logDebug("LruGarbageCollector", `LRU Garbage Collection
	Counted targets in ${s - c}ms
	Determined least recently used ${r} in ` + (o - s) + `ms
	Removed ${i} targets in ` + (_ - o) + `ms
	Removed ${e2} documents in ` + (u - _) + `ms
Total Duration: ${u - c}ms`);
        }
        return PersistencePromise.resolve({
          didRun: true,
          sequenceNumbersCollected: r,
          targetsRemoved: i,
          documentsRemoved: e2
        });
      }));
    }
  };
  function __PRIVATE_newLruGarbageCollector(e, t) {
    return new __PRIVATE_LruGarbageCollectorImpl(e, t);
  }
  var RemoteDocumentChangeBuffer = class {
    constructor() {
      this.changes = new ObjectMap(((e) => e.toString()), ((e, t) => e.isEqual(t))), this.changesApplied = false;
    }
    /**
     * Buffers a `RemoteDocumentCache.addEntry()` call.
     *
     * You can only modify documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */
    addEntry(e) {
      this.assertNotApplied(), this.changes.set(e.key, e);
    }
    /**
     * Buffers a `RemoteDocumentCache.removeEntry()` call.
     *
     * You can only remove documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */
    removeEntry(e, t) {
      this.assertNotApplied(), this.changes.set(e, MutableDocument.newInvalidDocument(e).setReadTime(t));
    }
    /**
     * Looks up an entry in the cache. The buffered changes will first be checked,
     * and if no buffered change applies, this will forward to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKey - The key of the entry to look up.
     * @returns The cached document or an invalid document if we have nothing
     * cached.
     */
    getEntry(e, t) {
      this.assertNotApplied();
      const n = this.changes.get(t);
      return void 0 !== n ? PersistencePromise.resolve(n) : this.getFromCache(e, t);
    }
    /**
     * Looks up several entries in the cache, forwarding to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKeys - The keys of the entries to look up.
     * @returns A map of cached documents, indexed by key. If an entry cannot be
     *     found, the corresponding key will be mapped to an invalid document.
     */
    getEntries(e, t) {
      return this.getAllFromCache(e, t);
    }
    /**
     * Applies buffered changes to the underlying RemoteDocumentCache, using
     * the provided transaction.
     */
    apply(e) {
      return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(e);
    }
    /** Helper to assert this.changes is not null  */
    assertNotApplied() {
    }
  };
  var OverlayedDocument = class {
    constructor(e, t) {
      this.overlayedDocument = e, this.mutatedFields = t;
    }
  };
  var LocalDocumentsView = class {
    constructor(e, t, n, r) {
      this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = n, this.indexManager = r;
    }
    /**
     * Get the local view of the document identified by `key`.
     *
     * @returns Local view of the document or null if we don't have any cached
     * state for it.
     */
    getDocument(e, t) {
      let n = null;
      return this.documentOverlayCache.getOverlay(e, t).next(((r) => (n = r, this.remoteDocumentCache.getEntry(e, t)))).next(((e2) => (null !== n && __PRIVATE_mutationApplyToLocalView(n.mutation, e2, FieldMask.empty(), Timestamp.now()), e2)));
    }
    /**
     * Gets the local view of the documents identified by `keys`.
     *
     * If we don't have cached state for a document in `keys`, a NoDocument will
     * be stored for that key in the resulting set.
     */
    getDocuments(e, t) {
      return this.remoteDocumentCache.getEntries(e, t).next(((t2) => this.getLocalViewOfDocuments(e, t2, __PRIVATE_documentKeySet()).next((() => t2))));
    }
    /**
     * Similar to `getDocuments`, but creates the local view from the given
     * `baseDocs` without retrieving documents from the local store.
     *
     * @param transaction - The transaction this operation is scoped to.
     * @param docs - The documents to apply local mutations to get the local views.
     * @param existenceStateChanged - The set of document keys whose existence state
     *   is changed. This is useful to determine if some documents overlay needs
     *   to be recalculated.
     */
    getLocalViewOfDocuments(e, t, n = __PRIVATE_documentKeySet()) {
      const r = __PRIVATE_newOverlayMap();
      return this.populateOverlays(e, r, t).next((() => this.computeViews(e, t, r, n).next(((e2) => {
        let t2 = documentMap();
        return e2.forEach(((e3, n2) => {
          t2 = t2.insert(e3, n2.overlayedDocument);
        })), t2;
      }))));
    }
    /**
     * Gets the overlayed documents for the given document map, which will include
     * the local view of those documents and a `FieldMask` indicating which fields
     * are mutated locally, `null` if overlay is a Set or Delete mutation.
     */
    getOverlayedDocuments(e, t) {
      const n = __PRIVATE_newOverlayMap();
      return this.populateOverlays(e, n, t).next((() => this.computeViews(e, t, n, __PRIVATE_documentKeySet())));
    }
    /**
     * Fetches the overlays for {@code docs} and adds them to provided overlay map
     * if the map does not already contain an entry for the given document key.
     */
    populateOverlays(e, t, n) {
      const r = [];
      return n.forEach(((e2) => {
        t.has(e2) || r.push(e2);
      })), this.documentOverlayCache.getOverlays(e, r).next(((e2) => {
        e2.forEach(((e3, n2) => {
          t.set(e3, n2);
        }));
      }));
    }
    /**
     * Computes the local view for the given documents.
     *
     * @param docs - The documents to compute views for. It also has the base
     *   version of the documents.
     * @param overlays - The overlays that need to be applied to the given base
     *   version of the documents.
     * @param existenceStateChanged - A set of documents whose existence states
     *   might have changed. This is used to determine if we need to re-calculate
     *   overlays from mutation queues.
     * @return A map represents the local documents view.
     */
    computeViews(e, t, n, r) {
      let i = __PRIVATE_mutableDocumentMap();
      const s = __PRIVATE_newDocumentKeyMap(), o = (function __PRIVATE_newOverlayedDocumentMap() {
        return __PRIVATE_newDocumentKeyMap();
      })();
      return t.forEach(((e2, t2) => {
        const o2 = n.get(t2.key);
        r.has(t2.key) && (void 0 === o2 || o2.mutation instanceof __PRIVATE_PatchMutation) ? i = i.insert(t2.key, t2) : void 0 !== o2 ? (s.set(t2.key, o2.mutation.getFieldMask()), __PRIVATE_mutationApplyToLocalView(o2.mutation, t2, o2.mutation.getFieldMask(), Timestamp.now())) : (
          // no overlay exists
          // Using EMPTY to indicate there is no overlay for the document.
          s.set(t2.key, FieldMask.empty())
        );
      })), this.recalculateAndSaveOverlays(e, i).next(((e2) => (e2.forEach(((e3, t2) => s.set(e3, t2))), t.forEach(((e3, t2) => {
        var n2;
        return o.set(e3, new OverlayedDocument(t2, null !== (n2 = s.get(e3)) && void 0 !== n2 ? n2 : null));
      })), o)));
    }
    recalculateAndSaveOverlays(e, t) {
      const n = __PRIVATE_newDocumentKeyMap();
      let r = new SortedMap(((e2, t2) => e2 - t2)), i = __PRIVATE_documentKeySet();
      return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next(((e2) => {
        for (const i2 of e2) i2.keys().forEach(((e3) => {
          const s = t.get(e3);
          if (null === s) return;
          let o = n.get(e3) || FieldMask.empty();
          o = i2.applyToLocalView(s, o), n.set(e3, o);
          const _ = (r.get(i2.batchId) || __PRIVATE_documentKeySet()).add(e3);
          r = r.insert(i2.batchId, _);
        }));
      })).next((() => {
        const s = [], o = r.getReverseIterator();
        for (; o.hasNext(); ) {
          const r2 = o.getNext(), _ = r2.key, a = r2.value, u = __PRIVATE_newMutationMap();
          a.forEach(((e2) => {
            if (!i.has(e2)) {
              const r3 = __PRIVATE_calculateOverlayMutation(t.get(e2), n.get(e2));
              null !== r3 && u.set(e2, r3), i = i.add(e2);
            }
          })), s.push(this.documentOverlayCache.saveOverlays(e, _, u));
        }
        return PersistencePromise.waitFor(s);
      })).next((() => n));
    }
    /**
     * Recalculates overlays by reading the documents from remote document cache
     * first, and saves them after they are calculated.
     */
    recalculateAndSaveOverlaysForDocumentKeys(e, t) {
      return this.remoteDocumentCache.getEntries(e, t).next(((t2) => this.recalculateAndSaveOverlays(e, t2)));
    }
    /**
     * Performs a query against the local view of all documents.
     *
     * @param transaction - The persistence transaction.
     * @param query - The query to match documents against.
     * @param offset - Read time and key to start scanning by (exclusive).
     * @param context - A optional tracker to keep a record of important details
     *   during database local query execution.
     */
    getDocumentsMatchingQuery(e, t, n, r) {
      return (function __PRIVATE_isDocumentQuery$1(e2) {
        return DocumentKey.isDocumentKey(e2.path) && null === e2.collectionGroup && 0 === e2.filters.length;
      })(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : __PRIVATE_isCollectionGroupQuery(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r) : this.getDocumentsMatchingCollectionQuery(e, t, n, r);
    }
    /**
     * Given a collection group, returns the next documents that follow the provided offset, along
     * with an updated batch ID.
     *
     * <p>The documents returned by this method are ordered by remote version from the provided
     * offset. If there are no more remote documents after the provided offset, documents with
     * mutations in order of batch id from the offset are returned. Since all documents in a batch are
     * returned together, the total number of documents returned can exceed {@code count}.
     *
     * @param transaction
     * @param collectionGroup The collection group for the documents.
     * @param offset The offset to index into.
     * @param count The number of documents to return
     * @return A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
     */
    getNextDocuments(e, t, n, r) {
      return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r).next(((i) => {
        const s = r - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, n.largestBatchId, r - i.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
        let o = Q, _ = i;
        return s.next(((t2) => PersistencePromise.forEach(t2, ((t3, n2) => (o < n2.largestBatchId && (o = n2.largestBatchId), i.get(t3) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e, t3).next(((e2) => {
          _ = _.insert(t3, e2);
        }))))).next((() => this.populateOverlays(e, t2, i))).next((() => this.computeViews(e, _, t2, __PRIVATE_documentKeySet()))).next(((e2) => ({
          batchId: o,
          changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e2)
        })))));
      }));
    }
    getDocumentsMatchingDocumentQuery(e, t) {
      return this.getDocument(e, new DocumentKey(t)).next(((e2) => {
        let t2 = documentMap();
        return e2.isFoundDocument() && (t2 = t2.insert(e2.key, e2)), t2;
      }));
    }
    getDocumentsMatchingCollectionGroupQuery(e, t, n, r) {
      const i = t.collectionGroup;
      let s = documentMap();
      return this.indexManager.getCollectionParents(e, i).next(((o) => PersistencePromise.forEach(o, ((o2) => {
        const _ = (function __PRIVATE_asCollectionQueryAtPath(e2, t2) {
          return new __PRIVATE_QueryImpl(
            t2,
            /*collectionGroup=*/
            null,
            e2.explicitOrderBy.slice(),
            e2.filters.slice(),
            e2.limit,
            e2.limitType,
            e2.startAt,
            e2.endAt
          );
        })(t, o2.child(i));
        return this.getDocumentsMatchingCollectionQuery(e, _, n, r).next(((e2) => {
          e2.forEach(((e3, t2) => {
            s = s.insert(e3, t2);
          }));
        }));
      })).next((() => s))));
    }
    getDocumentsMatchingCollectionQuery(e, t, n, r) {
      let i;
      return this.documentOverlayCache.getOverlaysForCollection(e, t.path, n.largestBatchId).next(((s) => (i = s, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r)))).next(((e2) => {
        i.forEach(((t2, n3) => {
          const r2 = n3.getKey();
          null === e2.get(r2) && (e2 = e2.insert(r2, MutableDocument.newInvalidDocument(r2)));
        }));
        let n2 = documentMap();
        return e2.forEach(((e3, r2) => {
          const s = i.get(e3);
          void 0 !== s && __PRIVATE_mutationApplyToLocalView(s.mutation, r2, FieldMask.empty(), Timestamp.now()), // Finally, insert the documents that still match the query
          __PRIVATE_queryMatches(t, r2) && (n2 = n2.insert(e3, r2));
        })), n2;
      }));
    }
  };
  var __PRIVATE_MemoryBundleCache = class {
    constructor(e) {
      this.serializer = e, this.Br = /* @__PURE__ */ new Map(), this.Lr = /* @__PURE__ */ new Map();
    }
    getBundleMetadata(e, t) {
      return PersistencePromise.resolve(this.Br.get(t));
    }
    saveBundleMetadata(e, t) {
      return this.Br.set(
        t.id,
        /** Decodes a BundleMetadata proto into a BundleMetadata object. */
        (function __PRIVATE_fromBundleMetadata(e2) {
          return {
            id: e2.id,
            version: e2.version,
            createTime: __PRIVATE_fromVersion(e2.createTime)
          };
        })(t)
      ), PersistencePromise.resolve();
    }
    getNamedQuery(e, t) {
      return PersistencePromise.resolve(this.Lr.get(t));
    }
    saveNamedQuery(e, t) {
      return this.Lr.set(t.name, (function __PRIVATE_fromProtoNamedQuery(e2) {
        return {
          name: e2.name,
          query: __PRIVATE_fromBundledQuery(e2.bundledQuery),
          readTime: __PRIVATE_fromVersion(e2.readTime)
        };
      })(t)), PersistencePromise.resolve();
    }
  };
  var __PRIVATE_MemoryDocumentOverlayCache = class {
    constructor() {
      this.overlays = new SortedMap(DocumentKey.comparator), this.kr = /* @__PURE__ */ new Map();
    }
    getOverlay(e, t) {
      return PersistencePromise.resolve(this.overlays.get(t));
    }
    getOverlays(e, t) {
      const n = __PRIVATE_newOverlayMap();
      return PersistencePromise.forEach(t, ((t2) => this.getOverlay(e, t2).next(((e2) => {
        null !== e2 && n.set(t2, e2);
      })))).next((() => n));
    }
    saveOverlays(e, t, n) {
      return n.forEach(((n2, r) => {
        this.wt(e, t, r);
      })), PersistencePromise.resolve();
    }
    removeOverlaysForBatchId(e, t, n) {
      const r = this.kr.get(n);
      return void 0 !== r && (r.forEach(((e2) => this.overlays = this.overlays.remove(e2))), this.kr.delete(n)), PersistencePromise.resolve();
    }
    getOverlaysForCollection(e, t, n) {
      const r = __PRIVATE_newOverlayMap(), i = t.length + 1, s = new DocumentKey(t.child("")), o = this.overlays.getIteratorFrom(s);
      for (; o.hasNext(); ) {
        const e2 = o.getNext().value, s2 = e2.getKey();
        if (!t.isPrefixOf(s2.path)) break;
        s2.path.length === i && (e2.largestBatchId > n && r.set(e2.getKey(), e2));
      }
      return PersistencePromise.resolve(r);
    }
    getOverlaysForCollectionGroup(e, t, n, r) {
      let i = new SortedMap(((e2, t2) => e2 - t2));
      const s = this.overlays.getIterator();
      for (; s.hasNext(); ) {
        const e2 = s.getNext().value;
        if (e2.getKey().getCollectionGroup() === t && e2.largestBatchId > n) {
          let t2 = i.get(e2.largestBatchId);
          null === t2 && (t2 = __PRIVATE_newOverlayMap(), i = i.insert(e2.largestBatchId, t2)), t2.set(e2.getKey(), e2);
        }
      }
      const o = __PRIVATE_newOverlayMap(), _ = i.getIterator();
      for (; _.hasNext(); ) {
        if (_.getNext().value.forEach(((e2, t2) => o.set(e2, t2))), o.size() >= r) break;
      }
      return PersistencePromise.resolve(o);
    }
    wt(e, t, n) {
      const r = this.overlays.get(n.key);
      if (null !== r) {
        const e2 = this.kr.get(r.largestBatchId).delete(n.key);
        this.kr.set(r.largestBatchId, e2);
      }
      this.overlays = this.overlays.insert(n.key, new Overlay(t, n));
      let i = this.kr.get(t);
      void 0 === i && (i = __PRIVATE_documentKeySet(), this.kr.set(t, i)), this.kr.set(t, i.add(n.key));
    }
  };
  var __PRIVATE_MemoryGlobalsCache = class {
    constructor() {
      this.sessionToken = ByteString.EMPTY_BYTE_STRING;
    }
    getSessionToken(e) {
      return PersistencePromise.resolve(this.sessionToken);
    }
    setSessionToken(e, t) {
      return this.sessionToken = t, PersistencePromise.resolve();
    }
  };
  var __PRIVATE_ReferenceSet = class {
    constructor() {
      this.qr = new SortedSet(__PRIVATE_DocReference.Qr), // A set of outstanding references to a document sorted by target id.
      this.$r = new SortedSet(__PRIVATE_DocReference.Ur);
    }
    /** Returns true if the reference set contains no references. */
    isEmpty() {
      return this.qr.isEmpty();
    }
    /** Adds a reference to the given document key for the given ID. */
    addReference(e, t) {
      const n = new __PRIVATE_DocReference(e, t);
      this.qr = this.qr.add(n), this.$r = this.$r.add(n);
    }
    /** Add references to the given document keys for the given ID. */
    Kr(e, t) {
      e.forEach(((e2) => this.addReference(e2, t)));
    }
    /**
     * Removes a reference to the given document key for the given
     * ID.
     */
    removeReference(e, t) {
      this.Wr(new __PRIVATE_DocReference(e, t));
    }
    Gr(e, t) {
      e.forEach(((e2) => this.removeReference(e2, t)));
    }
    /**
     * Clears all references with a given ID. Calls removeRef() for each key
     * removed.
     */
    zr(e) {
      const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1), i = [];
      return this.$r.forEachInRange([n, r], ((e2) => {
        this.Wr(e2), i.push(e2.key);
      })), i;
    }
    jr() {
      this.qr.forEach(((e) => this.Wr(e)));
    }
    Wr(e) {
      this.qr = this.qr.delete(e), this.$r = this.$r.delete(e);
    }
    Jr(e) {
      const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1);
      let i = __PRIVATE_documentKeySet();
      return this.$r.forEachInRange([n, r], ((e2) => {
        i = i.add(e2.key);
      })), i;
    }
    containsKey(e) {
      const t = new __PRIVATE_DocReference(e, 0), n = this.qr.firstAfterOrEqual(t);
      return null !== n && e.isEqual(n.key);
    }
  };
  var __PRIVATE_DocReference = class {
    constructor(e, t) {
      this.key = e, this.Hr = t;
    }
    /** Compare by key then by ID */
    static Qr(e, t) {
      return DocumentKey.comparator(e.key, t.key) || __PRIVATE_primitiveComparator(e.Hr, t.Hr);
    }
    /** Compare by ID then by key */
    static Ur(e, t) {
      return __PRIVATE_primitiveComparator(e.Hr, t.Hr) || DocumentKey.comparator(e.key, t.key);
    }
  };
  var __PRIVATE_MemoryMutationQueue = class {
    constructor(e, t) {
      this.indexManager = e, this.referenceDelegate = t, /**
       * The set of all mutations that have been sent but not yet been applied to
       * the backend.
       */
      this.mutationQueue = [], /** Next value to use when assigning sequential IDs to each mutation batch. */
      this.er = 1, /** An ordered mapping between documents and the mutations batch IDs. */
      this.Yr = new SortedSet(__PRIVATE_DocReference.Qr);
    }
    checkEmpty(e) {
      return PersistencePromise.resolve(0 === this.mutationQueue.length);
    }
    addMutationBatch(e, t, n, r) {
      const i = this.er;
      this.er++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
      const s = new MutationBatch(i, t, n, r);
      this.mutationQueue.push(s);
      for (const t2 of r) this.Yr = this.Yr.add(new __PRIVATE_DocReference(t2.key, i)), this.indexManager.addToCollectionParentIndex(e, t2.key.path.popLast());
      return PersistencePromise.resolve(s);
    }
    lookupMutationBatch(e, t) {
      return PersistencePromise.resolve(this.Zr(t));
    }
    getNextMutationBatchAfterBatchId(e, t) {
      const n = t + 1, r = this.Xr(n), i = r < 0 ? 0 : r;
      return PersistencePromise.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
    }
    getHighestUnacknowledgedBatchId() {
      return PersistencePromise.resolve(0 === this.mutationQueue.length ? G : this.er - 1);
    }
    getAllMutationBatches(e) {
      return PersistencePromise.resolve(this.mutationQueue.slice());
    }
    getAllMutationBatchesAffectingDocumentKey(e, t) {
      const n = new __PRIVATE_DocReference(t, 0), r = new __PRIVATE_DocReference(t, Number.POSITIVE_INFINITY), i = [];
      return this.Yr.forEachInRange([n, r], ((e2) => {
        const t2 = this.Zr(e2.Hr);
        i.push(t2);
      })), PersistencePromise.resolve(i);
    }
    getAllMutationBatchesAffectingDocumentKeys(e, t) {
      let n = new SortedSet(__PRIVATE_primitiveComparator);
      return t.forEach(((e2) => {
        const t2 = new __PRIVATE_DocReference(e2, 0), r = new __PRIVATE_DocReference(e2, Number.POSITIVE_INFINITY);
        this.Yr.forEachInRange([t2, r], ((e3) => {
          n = n.add(e3.Hr);
        }));
      })), PersistencePromise.resolve(this.ei(n));
    }
    getAllMutationBatchesAffectingQuery(e, t) {
      const n = t.path, r = n.length + 1;
      let i = n;
      DocumentKey.isDocumentKey(i) || (i = i.child(""));
      const s = new __PRIVATE_DocReference(new DocumentKey(i), 0);
      let o = new SortedSet(__PRIVATE_primitiveComparator);
      return this.Yr.forEachWhile(((e2) => {
        const t2 = e2.key.path;
        return !!n.isPrefixOf(t2) && // Rows with document keys more than one segment longer than the query
        // path can't be matches. For example, a query on 'rooms' can't match
        // the document /rooms/abc/messages/xyx.
        // TODO(mcg): we'll need a different scanner when we implement
        // ancestor queries.
        (t2.length === r && (o = o.add(e2.Hr)), true);
      }), s), PersistencePromise.resolve(this.ei(o));
    }
    ei(e) {
      const t = [];
      return e.forEach(((e2) => {
        const n = this.Zr(e2);
        null !== n && t.push(n);
      })), t;
    }
    removeMutationBatch(e, t) {
      __PRIVATE_hardAssert(0 === this.ti(t.batchId, "removed"), 55003), this.mutationQueue.shift();
      let n = this.Yr;
      return PersistencePromise.forEach(t.mutations, ((r) => {
        const i = new __PRIVATE_DocReference(r.key, t.batchId);
        return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r.key);
      })).next((() => {
        this.Yr = n;
      }));
    }
    rr(e) {
    }
    containsKey(e, t) {
      const n = new __PRIVATE_DocReference(t, 0), r = this.Yr.firstAfterOrEqual(n);
      return PersistencePromise.resolve(t.isEqual(r && r.key));
    }
    performConsistencyCheck(e) {
      return this.mutationQueue.length, PersistencePromise.resolve();
    }
    /**
     * Finds the index of the given batchId in the mutation queue and asserts that
     * the resulting index is within the bounds of the queue.
     *
     * @param batchId - The batchId to search for
     * @param action - A description of what the caller is doing, phrased in passive
     * form (e.g. "acknowledged" in a routine that acknowledges batches).
     */
    ti(e, t) {
      return this.Xr(e);
    }
    /**
     * Finds the index of the given batchId in the mutation queue. This operation
     * is O(1).
     *
     * @returns The computed index of the batch with the given batchId, based on
     * the state of the queue. Note this index can be negative if the requested
     * batchId has already been removed from the queue or past the end of the
     * queue if the batchId is larger than the last added batch.
     */
    Xr(e) {
      if (0 === this.mutationQueue.length)
        return 0;
      return e - this.mutationQueue[0].batchId;
    }
    /**
     * A version of lookupMutationBatch that doesn't return a promise, this makes
     * other functions that uses this code easier to read and more efficient.
     */
    Zr(e) {
      const t = this.Xr(e);
      if (t < 0 || t >= this.mutationQueue.length) return null;
      return this.mutationQueue[t];
    }
  };
  var __PRIVATE_MemoryRemoteDocumentCacheImpl = class {
    /**
     * @param sizer - Used to assess the size of a document. For eager GC, this is
     * expected to just return 0 to avoid unnecessarily doing the work of
     * calculating the size.
     */
    constructor(e) {
      this.ni = e, /** Underlying cache of documents and their read times. */
      this.docs = (function __PRIVATE_documentEntryMap() {
        return new SortedMap(DocumentKey.comparator);
      })(), /** Size of all cached documents. */
      this.size = 0;
    }
    setIndexManager(e) {
      this.indexManager = e;
    }
    /**
     * Adds the supplied entry to the cache and updates the cache size as appropriate.
     *
     * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()`.
     */
    addEntry(e, t) {
      const n = t.key, r = this.docs.get(n), i = r ? r.size : 0, s = this.ni(t);
      return this.docs = this.docs.insert(n, {
        document: t.mutableCopy(),
        size: s
      }), this.size += s - i, this.indexManager.addToCollectionParentIndex(e, n.path.popLast());
    }
    /**
     * Removes the specified entry from the cache and updates the cache size as appropriate.
     *
     * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()`.
     */
    removeEntry(e) {
      const t = this.docs.get(e);
      t && (this.docs = this.docs.remove(e), this.size -= t.size);
    }
    getEntry(e, t) {
      const n = this.docs.get(t);
      return PersistencePromise.resolve(n ? n.document.mutableCopy() : MutableDocument.newInvalidDocument(t));
    }
    getEntries(e, t) {
      let n = __PRIVATE_mutableDocumentMap();
      return t.forEach(((e2) => {
        const t2 = this.docs.get(e2);
        n = n.insert(e2, t2 ? t2.document.mutableCopy() : MutableDocument.newInvalidDocument(e2));
      })), PersistencePromise.resolve(n);
    }
    getDocumentsMatchingQuery(e, t, n, r) {
      let i = __PRIVATE_mutableDocumentMap();
      const s = t.path, o = new DocumentKey(s.child("__id-9223372036854775808__")), _ = this.docs.getIteratorFrom(o);
      for (; _.hasNext(); ) {
        const { key: e2, value: { document: o2 } } = _.getNext();
        if (!s.isPrefixOf(e2.path)) break;
        e2.path.length > s.length + 1 || (__PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(o2), n) <= 0 || (r.has(o2.key) || __PRIVATE_queryMatches(t, o2)) && (i = i.insert(o2.key, o2.mutableCopy())));
      }
      return PersistencePromise.resolve(i);
    }
    getAllFromCollectionGroup(e, t, n, r) {
      fail(9500);
    }
    ri(e, t) {
      return PersistencePromise.forEach(this.docs, ((e2) => t(e2)));
    }
    newChangeBuffer(e) {
      return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
    }
    getSize(e) {
      return PersistencePromise.resolve(this.size);
    }
  };
  var __PRIVATE_MemoryRemoteDocumentChangeBuffer = class extends RemoteDocumentChangeBuffer {
    constructor(e) {
      super(), this.Or = e;
    }
    applyChanges(e) {
      const t = [];
      return this.changes.forEach(((n, r) => {
        r.isValidDocument() ? t.push(this.Or.addEntry(e, r)) : this.Or.removeEntry(n);
      })), PersistencePromise.waitFor(t);
    }
    getFromCache(e, t) {
      return this.Or.getEntry(e, t);
    }
    getAllFromCache(e, t) {
      return this.Or.getEntries(e, t);
    }
  };
  var __PRIVATE_MemoryTargetCache = class {
    constructor(e) {
      this.persistence = e, /**
       * Maps a target to the data about that target
       */
      this.ii = new ObjectMap(((e2) => __PRIVATE_canonifyTarget(e2)), __PRIVATE_targetEquals), /** The last received snapshot version. */
      this.lastRemoteSnapshotVersion = SnapshotVersion.min(), /** The highest numbered target ID encountered. */
      this.highestTargetId = 0, /** The highest sequence number encountered. */
      this.si = 0, /**
       * A ordered bidirectional mapping between documents and the remote target
       * IDs.
       */
      this.oi = new __PRIVATE_ReferenceSet(), this.targetCount = 0, this._i = __PRIVATE_TargetIdGenerator.ar();
    }
    forEachTarget(e, t) {
      return this.ii.forEach(((e2, n) => t(n))), PersistencePromise.resolve();
    }
    getLastRemoteSnapshotVersion(e) {
      return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
    }
    getHighestSequenceNumber(e) {
      return PersistencePromise.resolve(this.si);
    }
    allocateTargetId(e) {
      return this.highestTargetId = this._i.next(), PersistencePromise.resolve(this.highestTargetId);
    }
    setTargetsMetadata(e, t, n) {
      return n && (this.lastRemoteSnapshotVersion = n), t > this.si && (this.si = t), PersistencePromise.resolve();
    }
    hr(e) {
      this.ii.set(e.target, e);
      const t = e.targetId;
      t > this.highestTargetId && (this._i = new __PRIVATE_TargetIdGenerator(t), this.highestTargetId = t), e.sequenceNumber > this.si && (this.si = e.sequenceNumber);
    }
    addTargetData(e, t) {
      return this.hr(t), this.targetCount += 1, PersistencePromise.resolve();
    }
    updateTargetData(e, t) {
      return this.hr(t), PersistencePromise.resolve();
    }
    removeTargetData(e, t) {
      return this.ii.delete(t.target), this.oi.zr(t.targetId), this.targetCount -= 1, PersistencePromise.resolve();
    }
    removeTargets(e, t, n) {
      let r = 0;
      const i = [];
      return this.ii.forEach(((s, o) => {
        o.sequenceNumber <= t && null === n.get(o.targetId) && (this.ii.delete(s), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r++);
      })), PersistencePromise.waitFor(i).next((() => r));
    }
    getTargetCount(e) {
      return PersistencePromise.resolve(this.targetCount);
    }
    getTargetData(e, t) {
      const n = this.ii.get(t) || null;
      return PersistencePromise.resolve(n);
    }
    addMatchingKeys(e, t, n) {
      return this.oi.Kr(t, n), PersistencePromise.resolve();
    }
    removeMatchingKeys(e, t, n) {
      this.oi.Gr(t, n);
      const r = this.persistence.referenceDelegate, i = [];
      return r && t.forEach(((t2) => {
        i.push(r.markPotentiallyOrphaned(e, t2));
      })), PersistencePromise.waitFor(i);
    }
    removeMatchingKeysForTargetId(e, t) {
      return this.oi.zr(t), PersistencePromise.resolve();
    }
    getMatchingKeysForTargetId(e, t) {
      const n = this.oi.Jr(t);
      return PersistencePromise.resolve(n);
    }
    containsKey(e, t) {
      return PersistencePromise.resolve(this.oi.containsKey(t));
    }
  };
  var __PRIVATE_MemoryPersistence = class {
    /**
     * The constructor accepts a factory for creating a reference delegate. This
     * allows both the delegate and this instance to have strong references to
     * each other without having nullable fields that would then need to be
     * checked or asserted on every access.
     */
    constructor(e, t) {
      this.ai = {}, this.overlays = {}, this.ui = new __PRIVATE_ListenSequence(0), this.ci = false, this.ci = true, this.li = new __PRIVATE_MemoryGlobalsCache(), this.referenceDelegate = e(this), this.hi = new __PRIVATE_MemoryTargetCache(this);
      this.indexManager = new __PRIVATE_MemoryIndexManager(), this.remoteDocumentCache = (function __PRIVATE_newMemoryRemoteDocumentCache(e2) {
        return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e2);
      })(((e2) => this.referenceDelegate.Pi(e2))), this.serializer = new __PRIVATE_LocalSerializer(t), this.Ti = new __PRIVATE_MemoryBundleCache(this.serializer);
    }
    start() {
      return Promise.resolve();
    }
    shutdown() {
      return this.ci = false, Promise.resolve();
    }
    get started() {
      return this.ci;
    }
    setDatabaseDeletedListener() {
    }
    setNetworkEnabled() {
    }
    getIndexManager(e) {
      return this.indexManager;
    }
    getDocumentOverlayCache(e) {
      let t = this.overlays[e.toKey()];
      return t || (t = new __PRIVATE_MemoryDocumentOverlayCache(), this.overlays[e.toKey()] = t), t;
    }
    getMutationQueue(e, t) {
      let n = this.ai[e.toKey()];
      return n || (n = new __PRIVATE_MemoryMutationQueue(t, this.referenceDelegate), this.ai[e.toKey()] = n), n;
    }
    getGlobalsCache() {
      return this.li;
    }
    getTargetCache() {
      return this.hi;
    }
    getRemoteDocumentCache() {
      return this.remoteDocumentCache;
    }
    getBundleCache() {
      return this.Ti;
    }
    runTransaction(e, t, n) {
      __PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e);
      const r = new __PRIVATE_MemoryTransaction(this.ui.next());
      return this.referenceDelegate.Ii(), n(r).next(((e2) => this.referenceDelegate.di(r).next((() => e2)))).toPromise().then(((e2) => (r.raiseOnCommittedEvent(), e2)));
    }
    Ei(e, t) {
      return PersistencePromise.or(Object.values(this.ai).map(((n) => () => n.containsKey(e, t))));
    }
  };
  var __PRIVATE_MemoryTransaction = class extends PersistenceTransaction {
    constructor(e) {
      super(), this.currentSequenceNumber = e;
    }
  };
  var __PRIVATE_MemoryEagerDelegate = class ___PRIVATE_MemoryEagerDelegate {
    constructor(e) {
      this.persistence = e, /** Tracks all documents that are active in Query views. */
      this.Ai = new __PRIVATE_ReferenceSet(), /** The list of documents that are potentially GCed after each transaction. */
      this.Ri = null;
    }
    static Vi(e) {
      return new ___PRIVATE_MemoryEagerDelegate(e);
    }
    get mi() {
      if (this.Ri) return this.Ri;
      throw fail(60996);
    }
    addReference(e, t, n) {
      return this.Ai.addReference(n, t), this.mi.delete(n.toString()), PersistencePromise.resolve();
    }
    removeReference(e, t, n) {
      return this.Ai.removeReference(n, t), this.mi.add(n.toString()), PersistencePromise.resolve();
    }
    markPotentiallyOrphaned(e, t) {
      return this.mi.add(t.toString()), PersistencePromise.resolve();
    }
    removeTarget(e, t) {
      this.Ai.zr(t.targetId).forEach(((e2) => this.mi.add(e2.toString())));
      const n = this.persistence.getTargetCache();
      return n.getMatchingKeysForTargetId(e, t.targetId).next(((e2) => {
        e2.forEach(((e3) => this.mi.add(e3.toString())));
      })).next((() => n.removeTargetData(e, t)));
    }
    Ii() {
      this.Ri = /* @__PURE__ */ new Set();
    }
    di(e) {
      const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
      return PersistencePromise.forEach(this.mi, ((n) => {
        const r = DocumentKey.fromPath(n);
        return this.fi(e, r).next(((e2) => {
          e2 || t.removeEntry(r, SnapshotVersion.min());
        }));
      })).next((() => (this.Ri = null, t.apply(e))));
    }
    updateLimboDocument(e, t) {
      return this.fi(e, t).next(((e2) => {
        e2 ? this.mi.delete(t.toString()) : this.mi.add(t.toString());
      }));
    }
    Pi(e) {
      return 0;
    }
    fi(e, t) {
      return PersistencePromise.or([() => PersistencePromise.resolve(this.Ai.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.Ei(e, t)]);
    }
  };
  var __PRIVATE_MemoryLruDelegate = class ___PRIVATE_MemoryLruDelegate {
    constructor(e, t) {
      this.persistence = e, this.gi = new ObjectMap(((e2) => __PRIVATE_encodeResourcePath(e2.path)), ((e2, t2) => e2.isEqual(t2))), this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t);
    }
    static Vi(e, t) {
      return new ___PRIVATE_MemoryLruDelegate(e, t);
    }
    // No-ops, present so memory persistence doesn't have to care which delegate
    // it has.
    Ii() {
    }
    di(e) {
      return PersistencePromise.resolve();
    }
    forEachTarget(e, t) {
      return this.persistence.getTargetCache().forEachTarget(e, t);
    }
    mr(e) {
      const t = this.yr(e);
      return this.persistence.getTargetCache().getTargetCount(e).next(((e2) => t.next(((t2) => e2 + t2))));
    }
    yr(e) {
      let t = 0;
      return this.gr(e, ((e2) => {
        t++;
      })).next((() => t));
    }
    gr(e, t) {
      return PersistencePromise.forEach(this.gi, ((n, r) => this.Sr(e, n, r).next(((e2) => e2 ? PersistencePromise.resolve() : t(r)))));
    }
    removeTargets(e, t, n) {
      return this.persistence.getTargetCache().removeTargets(e, t, n);
    }
    removeOrphanedDocuments(e, t) {
      let n = 0;
      const r = this.persistence.getRemoteDocumentCache(), i = r.newChangeBuffer();
      return r.ri(e, ((r2) => this.Sr(e, r2, t).next(((e2) => {
        e2 || (n++, i.removeEntry(r2, SnapshotVersion.min()));
      })))).next((() => i.apply(e))).next((() => n));
    }
    markPotentiallyOrphaned(e, t) {
      return this.gi.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
    }
    removeTarget(e, t) {
      const n = t.withSequenceNumber(e.currentSequenceNumber);
      return this.persistence.getTargetCache().updateTargetData(e, n);
    }
    addReference(e, t, n) {
      return this.gi.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
    }
    removeReference(e, t, n) {
      return this.gi.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
    }
    updateLimboDocument(e, t) {
      return this.gi.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
    }
    Pi(e) {
      let t = e.key.toString().length;
      return e.isFoundDocument() && (t += __PRIVATE_estimateByteSize(e.data.value)), t;
    }
    Sr(e, t, n) {
      return PersistencePromise.or([() => this.persistence.Ei(e, t), () => this.persistence.getTargetCache().containsKey(e, t), () => {
        const e2 = this.gi.get(t);
        return PersistencePromise.resolve(void 0 !== e2 && e2 > n);
      }]);
    }
    getCacheSize(e) {
      return this.persistence.getRemoteDocumentCache().getSize(e);
    }
  };
  var __PRIVATE_LocalViewChanges = class ___PRIVATE_LocalViewChanges {
    constructor(e, t, n, r) {
      this.targetId = e, this.fromCache = t, this.Is = n, this.ds = r;
    }
    static Es(e, t) {
      let n = __PRIVATE_documentKeySet(), r = __PRIVATE_documentKeySet();
      for (const e2 of t.docChanges) switch (e2.type) {
        case 0:
          n = n.add(e2.doc.key);
          break;
        case 1:
          r = r.add(e2.doc.key);
      }
      return new ___PRIVATE_LocalViewChanges(e, t.fromCache, n, r);
    }
  };
  var QueryContext = class {
    constructor() {
      this._documentReadCount = 0;
    }
    get documentReadCount() {
      return this._documentReadCount;
    }
    incrementDocumentReadCount(e) {
      this._documentReadCount += e;
    }
  };
  var __PRIVATE_QueryEngine = class {
    constructor() {
      this.As = false, this.Rs = false, /**
       * SDK only decides whether it should create index when collection size is
       * larger than this.
       */
      this.Vs = 100, this.fs = /**
      * This cost represents the evaluation result of
      * (([index, docKey] + [docKey, docContent]) per document in the result set)
      * / ([docKey, docContent] per documents in full collection scan) coming from
      * experiment [enter PR experiment URL here].
      */
      (function __PRIVATE_getDefaultRelativeIndexReadCostPerDocument() {
        return isSafari() ? 8 : __PRIVATE_getAndroidVersion(getUA()) > 0 ? 6 : 4;
      })();
    }
    /** Sets the document view to query against. */
    initialize(e, t) {
      this.gs = e, this.indexManager = t, this.As = true;
    }
    /** Returns all local documents matching the specified query. */
    getDocumentsMatchingQuery(e, t, n, r) {
      const i = {
        result: null
      };
      return this.ps(e, t).next(((e2) => {
        i.result = e2;
      })).next((() => {
        if (!i.result) return this.ys(e, t, r, n).next(((e2) => {
          i.result = e2;
        }));
      })).next((() => {
        if (i.result) return;
        const n2 = new QueryContext();
        return this.ws(e, t, n2).next(((r2) => {
          if (i.result = r2, this.Rs) return this.Ss(e, t, n2, r2.size);
        }));
      })).next((() => i.result));
    }
    Ss(e, t, n, r) {
      return n.documentReadCount < this.Vs ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.Vs, "documents"), PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t), "scans", n.documentReadCount, "local documents and returns", r, "documents as results."), n.documentReadCount > this.fs * r ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, __PRIVATE_queryToTarget(t))) : PersistencePromise.resolve());
    }
    /**
     * Performs an indexed query that evaluates the query based on a collection's
     * persisted index values. Returns `null` if an index is not available.
     */
    ps(e, t) {
      if (__PRIVATE_queryMatchesAllDocuments(t))
        return PersistencePromise.resolve(null);
      let n = __PRIVATE_queryToTarget(t);
      return this.indexManager.getIndexType(e, n).next(((r) => 0 === r ? null : (null !== t.limit && 1 === r && // We cannot apply a limit for targets that are served using a partial
      // index. If a partial index will be used to serve the target, the
      // query may return a superset of documents that match the target
      // (e.g. if the index doesn't include all the target's filters), or
      // may return the correct set of documents in the wrong order (e.g. if
      // the index doesn't include a segment for one of the orderBys).
      // Therefore, a limit should not be applied in such cases.
      (t = __PRIVATE_queryWithLimit(
        t,
        null,
        "F"
        /* LimitType.First */
      ), n = __PRIVATE_queryToTarget(t)), this.indexManager.getDocumentsMatchingTarget(e, n).next(((r2) => {
        const i = __PRIVATE_documentKeySet(...r2);
        return this.gs.getDocuments(e, i).next(((r3) => this.indexManager.getMinOffset(e, n).next(((n2) => {
          const s = this.bs(t, r3);
          return this.Ds(t, s, i, n2.readTime) ? this.ps(e, __PRIVATE_queryWithLimit(
            t,
            null,
            "F"
            /* LimitType.First */
          )) : this.vs(e, s, t, n2);
        }))));
      })))));
    }
    /**
     * Performs a query based on the target's persisted query mapping. Returns
     * `null` if the mapping is not available or cannot be used.
     */
    ys(e, t, n, r) {
      return __PRIVATE_queryMatchesAllDocuments(t) || r.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.gs.getDocuments(e, n).next(((i) => {
        const s = this.bs(t, i);
        return this.Ds(t, s, n, r) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r.toString(), __PRIVATE_stringifyQuery(t)), this.vs(e, s, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r, Q)).next(((e2) => e2)));
      }));
    }
    /** Applies the query filter and sorting to the provided documents.  */
    bs(e, t) {
      let n = new SortedSet(__PRIVATE_newQueryComparator(e));
      return t.forEach(((t2, r) => {
        __PRIVATE_queryMatches(e, r) && (n = n.add(r));
      })), n;
    }
    /**
     * Determines if a limit query needs to be refilled from cache, making it
     * ineligible for index-free execution.
     *
     * @param query - The query.
     * @param sortedPreviousResults - The documents that matched the query when it
     * was last synchronized, sorted by the query's comparator.
     * @param remoteKeys - The document keys that matched the query at the last
     * snapshot.
     * @param limboFreeSnapshotVersion - The version of the snapshot when the
     * query was last synchronized.
     */
    Ds(e, t, n, r) {
      if (null === e.limit)
        return false;
      if (n.size !== t.size)
        return true;
      const i = "F" === e.limitType ? t.last() : t.first();
      return !!i && (i.hasPendingWrites || i.version.compareTo(r) > 0);
    }
    ws(e, t, n) {
      return __PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQuery(t)), this.gs.getDocumentsMatchingQuery(e, t, IndexOffset.min(), n);
    }
    /**
     * Combines the results from an indexed execution with the remaining documents
     * that have not yet been indexed.
     */
    vs(e, t, n, r) {
      return this.gs.getDocumentsMatchingQuery(e, n, r).next(((e2) => (
        // Merge with existing results
        (t.forEach(((t2) => {
          e2 = e2.insert(t2.key, t2);
        })), e2)
      )));
    }
  };
  var Qt = "LocalStore";
  var $t = 3e8;
  var __PRIVATE_LocalStoreImpl = class {
    constructor(e, t, n, r) {
      this.persistence = e, this.Cs = t, this.serializer = r, /**
       * Maps a targetID to data about its target.
       *
       * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
       * of `applyRemoteEvent()` idempotent.
       */
      this.Fs = new SortedMap(__PRIVATE_primitiveComparator), /** Maps a target to its targetID. */
      // TODO(wuandy): Evaluate if TargetId can be part of Target.
      this.Ms = new ObjectMap(((e2) => __PRIVATE_canonifyTarget(e2)), __PRIVATE_targetEquals), /**
       * A per collection group index of the last read time processed by
       * `getNewDocumentChanges()`.
       *
       * PORTING NOTE: This is only used for multi-tab synchronization.
       */
      this.xs = /* @__PURE__ */ new Map(), this.Os = e.getRemoteDocumentCache(), this.hi = e.getTargetCache(), this.Ti = e.getBundleCache(), this.Ns(n);
    }
    Ns(e) {
      this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new LocalDocumentsView(this.Os, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.Os.setIndexManager(this.indexManager), this.Cs.initialize(this.localDocuments, this.indexManager);
    }
    collectGarbage(e) {
      return this.persistence.runTransaction("Collect garbage", "readwrite-primary", ((t) => e.collect(t, this.Fs)));
    }
  };
  function __PRIVATE_newLocalStore(e, t, n, r) {
    return new __PRIVATE_LocalStoreImpl(e, t, n, r);
  }
  async function __PRIVATE_localStoreHandleUserChange(e, t) {
    const n = __PRIVATE_debugCast(e);
    return await n.persistence.runTransaction("Handle user change", "readonly", ((e2) => {
      let r;
      return n.mutationQueue.getAllMutationBatches(e2).next(((i) => (r = i, n.Ns(t), n.mutationQueue.getAllMutationBatches(e2)))).next(((t2) => {
        const i = [], s = [];
        let o = __PRIVATE_documentKeySet();
        for (const e3 of r) {
          i.push(e3.batchId);
          for (const t3 of e3.mutations) o = o.add(t3.key);
        }
        for (const e3 of t2) {
          s.push(e3.batchId);
          for (const t3 of e3.mutations) o = o.add(t3.key);
        }
        return n.localDocuments.getDocuments(e2, o).next(((e3) => ({
          Bs: e3,
          removedBatchIds: i,
          addedBatchIds: s
        })));
      }));
    }));
  }
  function __PRIVATE_localStoreAcknowledgeBatch(e, t) {
    const n = __PRIVATE_debugCast(e);
    return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", ((e2) => {
      const r = t.batch.keys(), i = n.Os.newChangeBuffer({
        trackRemovals: true
      });
      return (function __PRIVATE_applyWriteToRemoteDocuments(e3, t2, n2, r2) {
        const i2 = n2.batch, s = i2.keys();
        let o = PersistencePromise.resolve();
        return s.forEach(((e4) => {
          o = o.next((() => r2.getEntry(t2, e4))).next(((t3) => {
            const s2 = n2.docVersions.get(e4);
            __PRIVATE_hardAssert(null !== s2, 48541), t3.version.compareTo(s2) < 0 && (i2.applyToRemoteDocument(t3, n2), t3.isValidDocument() && // We use the commitVersion as the readTime rather than the
            // document's updateTime since the updateTime is not advanced
            // for updates that do not modify the underlying document.
            (t3.setReadTime(n2.commitVersion), r2.addEntry(t3)));
          }));
        })), o.next((() => e3.mutationQueue.removeMutationBatch(t2, i2)));
      })(n, e2, t, i).next((() => i.apply(e2))).next((() => n.mutationQueue.performConsistencyCheck(e2))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(e2, r, t.batch.batchId))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e2, (function __PRIVATE_getKeysWithTransformResults(e3) {
        let t2 = __PRIVATE_documentKeySet();
        for (let n2 = 0; n2 < e3.mutationResults.length; ++n2) {
          e3.mutationResults[n2].transformResults.length > 0 && (t2 = t2.add(e3.batch.mutations[n2].key));
        }
        return t2;
      })(t)))).next((() => n.localDocuments.getDocuments(e2, r)));
    }));
  }
  function __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e) {
    const t = __PRIVATE_debugCast(e);
    return t.persistence.runTransaction("Get last remote snapshot version", "readonly", ((e2) => t.hi.getLastRemoteSnapshotVersion(e2)));
  }
  function __PRIVATE_localStoreApplyRemoteEventToLocalCache(e, t) {
    const n = __PRIVATE_debugCast(e), r = t.snapshotVersion;
    let i = n.Fs;
    return n.persistence.runTransaction("Apply remote event", "readwrite-primary", ((e2) => {
      const s = n.Os.newChangeBuffer({
        trackRemovals: true
      });
      i = n.Fs;
      const o = [];
      t.targetChanges.forEach(((s2, _2) => {
        const a2 = i.get(_2);
        if (!a2) return;
        o.push(n.hi.removeMatchingKeys(e2, s2.removedDocuments, _2).next((() => n.hi.addMatchingKeys(e2, s2.addedDocuments, _2))));
        let u = a2.withSequenceNumber(e2.currentSequenceNumber);
        null !== t.targetMismatches.get(_2) ? u = u.withResumeToken(ByteString.EMPTY_BYTE_STRING, SnapshotVersion.min()).withLastLimboFreeSnapshotVersion(SnapshotVersion.min()) : s2.resumeToken.approximateByteSize() > 0 && (u = u.withResumeToken(s2.resumeToken, r)), i = i.insert(_2, u), // Update the target data if there are target changes (or if
        // sufficient time has passed since the last update).
        /**
        * Returns true if the newTargetData should be persisted during an update of
        * an active target. TargetData should always be persisted when a target is
        * being released and should not call this function.
        *
        * While the target is active, TargetData updates can be omitted when nothing
        * about the target has changed except metadata like the resume token or
        * snapshot version. Occasionally it's worth the extra write to prevent these
        * values from getting too stale after a crash, but this doesn't have to be
        * too frequent.
        */
        (function __PRIVATE_shouldPersistTargetData(e3, t2, n2) {
          if (0 === e3.resumeToken.approximateByteSize()) return true;
          const r2 = t2.snapshotVersion.toMicroseconds() - e3.snapshotVersion.toMicroseconds();
          if (r2 >= $t) return true;
          const i2 = n2.addedDocuments.size + n2.modifiedDocuments.size + n2.removedDocuments.size;
          return i2 > 0;
        })(a2, u, s2) && o.push(n.hi.updateTargetData(e2, u));
      }));
      let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
      if (t.documentUpdates.forEach(((r2) => {
        t.resolvedLimboDocuments.has(r2) && o.push(n.persistence.referenceDelegate.updateLimboDocument(e2, r2));
      })), // Each loop iteration only affects its "own" doc, so it's safe to get all
      // the remote documents in advance in a single call.
      o.push(__PRIVATE_populateDocumentChangeBuffer(e2, s, t.documentUpdates).next(((e3) => {
        _ = e3.Ls, a = e3.ks;
      }))), !r.isEqual(SnapshotVersion.min())) {
        const t2 = n.hi.getLastRemoteSnapshotVersion(e2).next(((t3) => n.hi.setTargetsMetadata(e2, e2.currentSequenceNumber, r)));
        o.push(t2);
      }
      return PersistencePromise.waitFor(o).next((() => s.apply(e2))).next((() => n.localDocuments.getLocalViewOfDocuments(e2, _, a))).next((() => _));
    })).then(((e2) => (n.Fs = i, e2)));
  }
  function __PRIVATE_populateDocumentChangeBuffer(e, t, n) {
    let r = __PRIVATE_documentKeySet(), i = __PRIVATE_documentKeySet();
    return n.forEach(((e2) => r = r.add(e2))), t.getEntries(e, r).next(((e2) => {
      let r2 = __PRIVATE_mutableDocumentMap();
      return n.forEach(((n2, s) => {
        const o = e2.get(n2);
        s.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n2)), // Note: The order of the steps below is important, since we want
        // to ensure that rejected limbo resolutions (which fabricate
        // NoDocuments with SnapshotVersion.min()) never add documents to
        // cache.
        s.isNoDocument() && s.version.isEqual(SnapshotVersion.min()) ? (
          // NoDocuments with SnapshotVersion.min() are used in manufactured
          // events. We remove these documents from cache since we lost
          // access.
          (t.removeEntry(n2, s.readTime), r2 = r2.insert(n2, s))
        ) : !o.isValidDocument() || s.version.compareTo(o.version) > 0 || 0 === s.version.compareTo(o.version) && o.hasPendingWrites ? (t.addEntry(s), r2 = r2.insert(n2, s)) : __PRIVATE_logDebug(Qt, "Ignoring outdated watch update for ", n2, ". Current version:", o.version, " Watch version:", s.version);
      })), {
        Ls: r2,
        ks: i
      };
    }));
  }
  function __PRIVATE_localStoreGetNextMutationBatch(e, t) {
    const n = __PRIVATE_debugCast(e);
    return n.persistence.runTransaction("Get next mutation batch", "readonly", ((e2) => (void 0 === t && (t = G), n.mutationQueue.getNextMutationBatchAfterBatchId(e2, t))));
  }
  function __PRIVATE_localStoreAllocateTarget(e, t) {
    const n = __PRIVATE_debugCast(e);
    return n.persistence.runTransaction("Allocate target", "readwrite", ((e2) => {
      let r;
      return n.hi.getTargetData(e2, t).next(((i) => i ? (
        // This target has been listened to previously, so reuse the
        // previous targetID.
        // TODO(mcg): freshen last accessed date?
        (r = i, PersistencePromise.resolve(r))
      ) : n.hi.allocateTargetId(e2).next(((i2) => (r = new TargetData(t, i2, "TargetPurposeListen", e2.currentSequenceNumber), n.hi.addTargetData(e2, r).next((() => r)))))));
    })).then(((e2) => {
      const r = n.Fs.get(e2.targetId);
      return (null === r || e2.snapshotVersion.compareTo(r.snapshotVersion) > 0) && (n.Fs = n.Fs.insert(e2.targetId, e2), n.Ms.set(t, e2.targetId)), e2;
    }));
  }
  async function __PRIVATE_localStoreReleaseTarget(e, t, n) {
    const r = __PRIVATE_debugCast(e), i = r.Fs.get(t), s = n ? "readwrite" : "readwrite-primary";
    try {
      n || await r.persistence.runTransaction("Release target", s, ((e2) => r.persistence.referenceDelegate.removeTarget(e2, i)));
    } catch (e2) {
      if (!__PRIVATE_isIndexedDbTransactionError(e2)) throw e2;
      __PRIVATE_logDebug(Qt, `Failed to update sequence numbers for target ${t}: ${e2}`);
    }
    r.Fs = r.Fs.remove(t), r.Ms.delete(i.target);
  }
  function __PRIVATE_localStoreExecuteQuery(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    let i = SnapshotVersion.min(), s = __PRIVATE_documentKeySet();
    return r.persistence.runTransaction(
      "Execute query",
      "readwrite",
      // Use readwrite instead of readonly so indexes can be created
      // Use readwrite instead of readonly so indexes can be created
      ((e2) => (function __PRIVATE_localStoreGetTargetData(e3, t2, n2) {
        const r2 = __PRIVATE_debugCast(e3), i2 = r2.Ms.get(n2);
        return void 0 !== i2 ? PersistencePromise.resolve(r2.Fs.get(i2)) : r2.hi.getTargetData(t2, n2);
      })(r, e2, __PRIVATE_queryToTarget(t)).next(((t2) => {
        if (t2) return i = t2.lastLimboFreeSnapshotVersion, r.hi.getMatchingKeysForTargetId(e2, t2.targetId).next(((e3) => {
          s = e3;
        }));
      })).next((() => r.Cs.getDocumentsMatchingQuery(e2, t, n ? i : SnapshotVersion.min(), n ? s : __PRIVATE_documentKeySet()))).next(((e3) => (__PRIVATE_setMaxReadTime(r, __PRIVATE_queryCollectionGroup(t), e3), {
        documents: e3,
        qs: s
      }))))
    );
  }
  function __PRIVATE_setMaxReadTime(e, t, n) {
    let r = e.xs.get(t) || SnapshotVersion.min();
    n.forEach(((e2, t2) => {
      t2.readTime.compareTo(r) > 0 && (r = t2.readTime);
    })), e.xs.set(t, r);
  }
  var __PRIVATE_LocalClientState = class {
    constructor() {
      this.activeTargetIds = __PRIVATE_targetIdSet();
    }
    Gs(e) {
      this.activeTargetIds = this.activeTargetIds.add(e);
    }
    zs(e) {
      this.activeTargetIds = this.activeTargetIds.delete(e);
    }
    /**
     * Converts this entry into a JSON-encoded format we can use for WebStorage.
     * Does not encode `clientId` as it is part of the key in WebStorage.
     */
    Ws() {
      const e = {
        activeTargetIds: this.activeTargetIds.toArray(),
        updateTimeMs: Date.now()
      };
      return JSON.stringify(e);
    }
  };
  var __PRIVATE_MemorySharedClientState = class {
    constructor() {
      this.Fo = new __PRIVATE_LocalClientState(), this.Mo = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
    }
    addPendingMutation(e) {
    }
    updateMutationState(e, t, n) {
    }
    addLocalQueryTarget(e, t = true) {
      return t && this.Fo.Gs(e), this.Mo[e] || "not-current";
    }
    updateQueryState(e, t, n) {
      this.Mo[e] = t;
    }
    removeLocalQueryTarget(e) {
      this.Fo.zs(e);
    }
    isLocalQueryTarget(e) {
      return this.Fo.activeTargetIds.has(e);
    }
    clearQueryState(e) {
      delete this.Mo[e];
    }
    getAllActiveQueryTargets() {
      return this.Fo.activeTargetIds;
    }
    isActiveQueryTarget(e) {
      return this.Fo.activeTargetIds.has(e);
    }
    start() {
      return this.Fo = new __PRIVATE_LocalClientState(), Promise.resolve();
    }
    handleUserChange(e, t, n) {
    }
    setOnlineState(e) {
    }
    shutdown() {
    }
    writeSequenceNumber(e) {
    }
    notifyBundleLoaded(e) {
    }
  };
  var __PRIVATE_NoopConnectivityMonitor = class {
    xo(e) {
    }
    shutdown() {
    }
  };
  var zt = "ConnectivityMonitor";
  var __PRIVATE_BrowserConnectivityMonitor = class {
    constructor() {
      this.Oo = () => this.No(), this.Bo = () => this.Lo(), this.ko = [], this.qo();
    }
    xo(e) {
      this.ko.push(e);
    }
    shutdown() {
      window.removeEventListener("online", this.Oo), window.removeEventListener("offline", this.Bo);
    }
    qo() {
      window.addEventListener("online", this.Oo), window.addEventListener("offline", this.Bo);
    }
    No() {
      __PRIVATE_logDebug(zt, "Network connectivity changed: AVAILABLE");
      for (const e of this.ko) e(
        0
        /* NetworkStatus.AVAILABLE */
      );
    }
    Lo() {
      __PRIVATE_logDebug(zt, "Network connectivity changed: UNAVAILABLE");
      for (const e of this.ko) e(
        1
        /* NetworkStatus.UNAVAILABLE */
      );
    }
    // TODO(chenbrian): Consider passing in window either into this component or
    // here for testing via FakeWindow.
    /** Checks that all used attributes of window are available. */
    static C() {
      return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
    }
  };
  var jt = null;
  function __PRIVATE_generateUniqueDebugId() {
    return null === jt ? jt = (function __PRIVATE_generateInitialUniqueDebugId() {
      return 268435456 + Math.round(2147483648 * Math.random());
    })() : jt++, "0x" + jt.toString(16);
  }
  var Jt = "RestConnection";
  var Ht = {
    BatchGetDocuments: "batchGet",
    Commit: "commit",
    RunQuery: "runQuery",
    RunAggregationQuery: "runAggregationQuery"
  };
  var __PRIVATE_RestConnection = class {
    get Qo() {
      return false;
    }
    constructor(e) {
      this.databaseInfo = e, this.databaseId = e.databaseId;
      const t = e.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r = encodeURIComponent(this.databaseId.database);
      this.$o = t + "://" + e.host, this.Uo = `projects/${n}/databases/${r}`, this.Ko = this.databaseId.database === ut ? `project_id=${n}` : `project_id=${n}&database_id=${r}`;
    }
    Wo(e, t, n, r, i) {
      const s = __PRIVATE_generateUniqueDebugId(), o = this.Go(e, t.toUriEncodedString());
      __PRIVATE_logDebug(Jt, `Sending RPC '${e}' ${s}:`, o, n);
      const _ = {
        "google-cloud-resource-prefix": this.Uo,
        "x-goog-request-params": this.Ko
      };
      this.zo(_, r, i);
      const { host: a } = new URL(o), u = isCloudWorkstation(a);
      return this.jo(e, o, _, n, u).then(((t2) => (__PRIVATE_logDebug(Jt, `Received RPC '${e}' ${s}: `, t2), t2)), ((t2) => {
        throw __PRIVATE_logWarn(Jt, `RPC '${e}' ${s} failed with error: `, t2, "url: ", o, "request:", n), t2;
      }));
    }
    Jo(e, t, n, r, i, s) {
      return this.Wo(e, t, n, r, i);
    }
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */
    zo(e, t, n) {
      e["X-Goog-Api-Client"] = // SDK_VERSION is updated to different value at runtime depending on the entry point,
      // so we need to get its value when we need it in a function.
      (function __PRIVATE_getGoogApiClientValue() {
        return "gl-js/ fire/" + x;
      })(), // Content-Type: text/plain will avoid preflight requests which might
      // mess with CORS and redirects by proxies. If we add custom headers
      // we will need to change this code to potentially use the $httpOverwrite
      // parameter supported by ESF to avoid triggering preflight requests.
      e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach(((t2, n2) => e[n2] = t2)), n && n.headers.forEach(((t2, n2) => e[n2] = t2));
    }
    Go(e, t) {
      const n = Ht[e];
      return `${this.$o}/v1/${t}:${n}`;
    }
    /**
     * Closes and cleans up any resources associated with the connection. This
     * implementation is a no-op because there are no resources associated
     * with the RestConnection that need to be cleaned up.
     */
    terminate() {
    }
  };
  var __PRIVATE_StreamBridge = class {
    constructor(e) {
      this.Ho = e.Ho, this.Yo = e.Yo;
    }
    Zo(e) {
      this.Xo = e;
    }
    e_(e) {
      this.t_ = e;
    }
    n_(e) {
      this.r_ = e;
    }
    onMessage(e) {
      this.i_ = e;
    }
    close() {
      this.Yo();
    }
    send(e) {
      this.Ho(e);
    }
    s_() {
      this.Xo();
    }
    o_() {
      this.t_();
    }
    __(e) {
      this.r_(e);
    }
    a_(e) {
      this.i_(e);
    }
  };
  var Yt = "WebChannelConnection";
  var __PRIVATE_WebChannelConnection = class extends __PRIVATE_RestConnection {
    constructor(e) {
      super(e), /** A collection of open WebChannel instances */
      this.u_ = [], this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
    }
    jo(e, t, n, r, i) {
      const s = __PRIVATE_generateUniqueDebugId();
      return new Promise(((i2, o) => {
        const _ = new XhrIo();
        _.setWithCredentials(true), _.listenOnce(EventType.COMPLETE, (() => {
          try {
            switch (_.getLastErrorCode()) {
              case ErrorCode.NO_ERROR:
                const t2 = _.getResponseJson();
                __PRIVATE_logDebug(Yt, `XHR for RPC '${e}' ${s} received:`, JSON.stringify(t2)), i2(t2);
                break;
              case ErrorCode.TIMEOUT:
                __PRIVATE_logDebug(Yt, `RPC '${e}' ${s} timed out`), o(new FirestoreError(N.DEADLINE_EXCEEDED, "Request time out"));
                break;
              case ErrorCode.HTTP_ERROR:
                const n2 = _.getStatus();
                if (__PRIVATE_logDebug(Yt, `RPC '${e}' ${s} failed with status:`, n2, "response text:", _.getResponseText()), n2 > 0) {
                  let e2 = _.getResponseJson();
                  Array.isArray(e2) && (e2 = e2[0]);
                  const t3 = null == e2 ? void 0 : e2.error;
                  if (t3 && t3.status && t3.message) {
                    const e3 = (function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e4) {
                      const t4 = e4.toLowerCase().replace(/_/g, "-");
                      return Object.values(N).indexOf(t4) >= 0 ? t4 : N.UNKNOWN;
                    })(t3.status);
                    o(new FirestoreError(e3, t3.message));
                  } else o(new FirestoreError(N.UNKNOWN, "Server responded with status " + _.getStatus()));
                } else
                  o(new FirestoreError(N.UNAVAILABLE, "Connection failed."));
                break;
              default:
                fail(9055, {
                  c_: e,
                  streamId: s,
                  l_: _.getLastErrorCode(),
                  h_: _.getLastError()
                });
            }
          } finally {
            __PRIVATE_logDebug(Yt, `RPC '${e}' ${s} completed.`);
          }
        }));
        const a = JSON.stringify(r);
        __PRIVATE_logDebug(Yt, `RPC '${e}' ${s} sending request:`, r), _.send(t, "POST", a, n, 15);
      }));
    }
    P_(e, t, n) {
      const r = __PRIVATE_generateUniqueDebugId(), i = [this.$o, "/", "google.firestore.v1.Firestore", "/", e, "/channel"], s = createWebChannelTransport(), o = getStatEventTarget(), _ = {
        // Required for backend stickiness, routing behavior is based on this
        // parameter.
        httpSessionIdParam: "gsessionid",
        initMessageHeaders: {},
        messageUrlParams: {
          // This param is used to improve routing and project isolation by the
          // backend and must be included in every request.
          database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
        },
        sendRawJson: true,
        supportsCrossDomainXhr: true,
        internalChannelParams: {
          // Override the default timeout (randomized between 10-20 seconds) since
          // a large write batch on a slow internet connection may take a long
          // time to send to the backend. Rather than have WebChannel impose a
          // tight timeout which could lead to infinite timeouts and retries, we
          // set it very large (5-10 minutes) and rely on the browser's builtin
          // timeouts to kick in if the request isn't working.
          forwardChannelRequestTimeoutMs: 6e5
        },
        forceLongPolling: this.forceLongPolling,
        detectBufferingProxy: this.autoDetectLongPolling
      }, a = this.longPollingOptions.timeoutSeconds;
      void 0 !== a && (_.longPollingTimeout = Math.round(1e3 * a)), this.useFetchStreams && (_.useFetchStreams = true), this.zo(_.initMessageHeaders, t, n), // Sending the custom headers we just added to request.initMessageHeaders
      // (Authorization, etc.) will trigger the browser to make a CORS preflight
      // request because the XHR will no longer meet the criteria for a "simple"
      // CORS request:
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
      // Therefore to avoid the CORS preflight request (an extra network
      // roundtrip), we use the encodeInitMessageHeaders option to specify that
      // the headers should instead be encoded in the request's POST payload,
      // which is recognized by the webchannel backend.
      _.encodeInitMessageHeaders = true;
      const u = i.join("");
      __PRIVATE_logDebug(Yt, `Creating RPC '${e}' stream ${r}: ${u}`, _);
      const c = s.createWebChannel(u, _);
      this.T_(c);
      let l = false, h = false;
      const P = new __PRIVATE_StreamBridge({
        Ho: (t2) => {
          h ? __PRIVATE_logDebug(Yt, `Not sending because RPC '${e}' stream ${r} is closed:`, t2) : (l || (__PRIVATE_logDebug(Yt, `Opening RPC '${e}' stream ${r} transport.`), c.open(), l = true), __PRIVATE_logDebug(Yt, `RPC '${e}' stream ${r} sending:`, t2), c.send(t2));
        },
        Yo: () => c.close()
      }), __PRIVATE_unguardedEventListen = (e2, t2, n2) => {
        e2.listen(t2, ((e3) => {
          try {
            n2(e3);
          } catch (e4) {
            setTimeout((() => {
              throw e4;
            }), 0);
          }
        }));
      };
      return __PRIVATE_unguardedEventListen(c, WebChannel.EventType.OPEN, (() => {
        h || (__PRIVATE_logDebug(Yt, `RPC '${e}' stream ${r} transport opened.`), P.s_());
      })), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.CLOSE, (() => {
        h || (h = true, __PRIVATE_logDebug(Yt, `RPC '${e}' stream ${r} transport closed`), P.__(), this.I_(c));
      })), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.ERROR, ((t2) => {
        h || (h = true, __PRIVATE_logWarn(Yt, `RPC '${e}' stream ${r} transport errored. Name:`, t2.name, "Message:", t2.message), P.__(new FirestoreError(N.UNAVAILABLE, "The operation could not be completed")));
      })), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.MESSAGE, ((t2) => {
        var n2;
        if (!h) {
          const i2 = t2.data[0];
          __PRIVATE_hardAssert(!!i2, 16349);
          const s2 = i2, o2 = (null == s2 ? void 0 : s2.error) || (null === (n2 = s2[0]) || void 0 === n2 ? void 0 : n2.error);
          if (o2) {
            __PRIVATE_logDebug(Yt, `RPC '${e}' stream ${r} received error:`, o2);
            const t3 = o2.status;
            let n3 = (
              /**
              * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
              *
              * @returns The Code equivalent to the given status string or undefined if
              *     there is no match.
              */
              (function __PRIVATE_mapCodeFromRpcStatus(e2) {
                const t4 = ft[e2];
                if (void 0 !== t4) return __PRIVATE_mapCodeFromRpcCode(t4);
              })(t3)
            ), i3 = o2.message;
            void 0 === n3 && (n3 = N.INTERNAL, i3 = "Unknown error status: " + t3 + " with message " + o2.message), // Mark closed so no further events are propagated
            h = true, P.__(new FirestoreError(n3, i3)), c.close();
          } else __PRIVATE_logDebug(Yt, `RPC '${e}' stream ${r} received:`, i2), P.a_(i2);
        }
      })), __PRIVATE_unguardedEventListen(o, Event.STAT_EVENT, ((t2) => {
        t2.stat === Stat.PROXY ? __PRIVATE_logDebug(Yt, `RPC '${e}' stream ${r} detected buffering proxy`) : t2.stat === Stat.NOPROXY && __PRIVATE_logDebug(Yt, `RPC '${e}' stream ${r} detected no buffering proxy`);
      })), setTimeout((() => {
        P.o_();
      }), 0), P;
    }
    /**
     * Closes and cleans up any resources associated with the connection.
     */
    terminate() {
      this.u_.forEach(((e) => e.close())), this.u_ = [];
    }
    /**
     * Add a WebChannel instance to the collection of open instances.
     * @param webChannel
     */
    T_(e) {
      this.u_.push(e);
    }
    /**
     * Remove a WebChannel instance from the collection of open instances.
     * @param webChannel
     */
    I_(e) {
      this.u_ = this.u_.filter(((t) => t === e));
    }
  };
  function getDocument() {
    return "undefined" != typeof document ? document : null;
  }
  function __PRIVATE_newSerializer(e) {
    return new JsonProtoSerializer(
      e,
      /* useProto3Json= */
      true
    );
  }
  var __PRIVATE_ExponentialBackoff = class {
    constructor(e, t, n = 1e3, r = 1.5, i = 6e4) {
      this.Fi = e, this.timerId = t, this.d_ = n, this.E_ = r, this.A_ = i, this.R_ = 0, this.V_ = null, /** The last backoff attempt, as epoch milliseconds. */
      this.m_ = Date.now(), this.reset();
    }
    /**
     * Resets the backoff delay.
     *
     * The very next backoffAndWait() will have no delay. If it is called again
     * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
     * subsequent ones will increase according to the backoffFactor.
     */
    reset() {
      this.R_ = 0;
    }
    /**
     * Resets the backoff delay to the maximum delay (e.g. for use after a
     * RESOURCE_EXHAUSTED error).
     */
    f_() {
      this.R_ = this.A_;
    }
    /**
     * Returns a promise that resolves after currentDelayMs, and increases the
     * delay for any subsequent attempts. If there was a pending backoff operation
     * already, it will be canceled.
     */
    g_(e) {
      this.cancel();
      const t = Math.floor(this.R_ + this.p_()), n = Math.max(0, Date.now() - this.m_), r = Math.max(0, t - n);
      r > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), this.V_ = this.Fi.enqueueAfterDelay(this.timerId, r, (() => (this.m_ = Date.now(), e()))), // Apply backoff factor to determine next delay and ensure it is within
      // bounds.
      this.R_ *= this.E_, this.R_ < this.d_ && (this.R_ = this.d_), this.R_ > this.A_ && (this.R_ = this.A_);
    }
    y_() {
      null !== this.V_ && (this.V_.skipDelay(), this.V_ = null);
    }
    cancel() {
      null !== this.V_ && (this.V_.cancel(), this.V_ = null);
    }
    /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */
    p_() {
      return (Math.random() - 0.5) * this.R_;
    }
  };
  var Zt = "PersistentStream";
  var __PRIVATE_PersistentStream = class {
    constructor(e, t, n, r, i, s, o, _) {
      this.Fi = e, this.w_ = n, this.S_ = r, this.connection = i, this.authCredentialsProvider = s, this.appCheckCredentialsProvider = o, this.listener = _, this.state = 0, /**
       * A close count that's incremented every time the stream is closed; used by
       * getCloseGuardedDispatcher() to invalidate callbacks that happen after
       * close.
       */
      this.b_ = 0, this.D_ = null, this.v_ = null, this.stream = null, /**
       * Count of response messages received.
       */
      this.C_ = 0, this.F_ = new __PRIVATE_ExponentialBackoff(e, t);
    }
    /**
     * Returns true if start() has been called and no error has occurred. True
     * indicates the stream is open or in the process of opening (which
     * encompasses respecting backoff, getting auth tokens, and starting the
     * actual RPC). Use isOpen() to determine if the stream is open and ready for
     * outbound requests.
     */
    M_() {
      return 1 === this.state || 5 === this.state || this.x_();
    }
    /**
     * Returns true if the underlying RPC is open (the onOpen() listener has been
     * called) and the stream is ready for outbound requests.
     */
    x_() {
      return 2 === this.state || 3 === this.state;
    }
    /**
     * Starts the RPC. Only allowed if isStarted() returns false. The stream is
     * not immediately ready for use: onOpen() will be invoked when the RPC is
     * ready for outbound requests, at which point isOpen() will return true.
     *
     * When start returns, isStarted() will return true.
     */
    start() {
      this.C_ = 0, 4 !== this.state ? this.auth() : this.O_();
    }
    /**
     * Stops the RPC. This call is idempotent and allowed regardless of the
     * current isStarted() state.
     *
     * When stop returns, isStarted() and isOpen() will both return false.
     */
    async stop() {
      this.M_() && await this.close(
        0
        /* PersistentStreamState.Initial */
      );
    }
    /**
     * After an error the stream will usually back off on the next attempt to
     * start it. If the error warrants an immediate restart of the stream, the
     * sender can use this to indicate that the receiver should not back off.
     *
     * Each error will call the onClose() listener. That function can decide to
     * inhibit backoff if required.
     */
    N_() {
      this.state = 0, this.F_.reset();
    }
    /**
     * Marks this stream as idle. If no further actions are performed on the
     * stream for one minute, the stream will automatically close itself and
     * notify the stream's onClose() handler with Status.OK. The stream will then
     * be in a !isStarted() state, requiring the caller to start the stream again
     * before further use.
     *
     * Only streams that are in state 'Open' can be marked idle, as all other
     * states imply pending network operations.
     */
    B_() {
      this.x_() && null === this.D_ && (this.D_ = this.Fi.enqueueAfterDelay(this.w_, 6e4, (() => this.L_())));
    }
    /** Sends a message to the underlying stream. */
    k_(e) {
      this.q_(), this.stream.send(e);
    }
    /** Called by the idle timer when the stream should close due to inactivity. */
    async L_() {
      if (this.x_())
        return this.close(
          0
          /* PersistentStreamState.Initial */
        );
    }
    /** Marks the stream as active again. */
    q_() {
      this.D_ && (this.D_.cancel(), this.D_ = null);
    }
    /** Cancels the health check delayed operation. */
    Q_() {
      this.v_ && (this.v_.cancel(), this.v_ = null);
    }
    /**
     * Closes the stream and cleans up as necessary:
     *
     * * closes the underlying GRPC stream;
     * * calls the onClose handler with the given 'error';
     * * sets internal stream state to 'finalState';
     * * adjusts the backoff timer based on the error
     *
     * A new stream can be opened by calling start().
     *
     * @param finalState - the intended state of the stream after closing.
     * @param error - the error the connection was closed with.
     */
    async close(e, t) {
      this.q_(), this.Q_(), this.F_.cancel(), // Invalidates any stream-related callbacks (e.g. from auth or the
      // underlying stream), guaranteeing they won't execute.
      this.b_++, 4 !== e ? (
        // If this is an intentional close ensure we don't delay our next connection attempt.
        this.F_.reset()
      ) : t && t.code === N.RESOURCE_EXHAUSTED ? (
        // Log the error. (Probably either 'quota exceeded' or 'max queue length reached'.)
        (__PRIVATE_logError(t.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), this.F_.f_())
      ) : t && t.code === N.UNAUTHENTICATED && 3 !== this.state && // "unauthenticated" error means the token was rejected. This should rarely
      // happen since both Auth and AppCheck ensure a sufficient TTL when we
      // request a token. If a user manually resets their system clock this can
      // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
      // before we received the first message and we need to invalidate the token
      // to ensure that we fetch a new token.
      (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), // Clean up the underlying stream because we are no longer interested in events.
      null !== this.stream && (this.U_(), this.stream.close(), this.stream = null), // This state must be assigned before calling onClose() to allow the callback to
      // inhibit backoff or otherwise manipulate the state in its non-started state.
      this.state = e, // Notify the listener that the stream closed.
      await this.listener.n_(t);
    }
    /**
     * Can be overridden to perform additional cleanup before the stream is closed.
     * Calling super.tearDown() is not required.
     */
    U_() {
    }
    auth() {
      this.state = 1;
      const e = this.K_(this.b_), t = this.b_;
      Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then((([e2, n]) => {
        this.b_ === t && // Normally we'd have to schedule the callback on the AsyncQueue.
        // However, the following calls are safe to be called outside the
        // AsyncQueue since they don't chain asynchronous calls
        this.W_(e2, n);
      }), ((t2) => {
        e((() => {
          const e2 = new FirestoreError(N.UNKNOWN, "Fetching auth token failed: " + t2.message);
          return this.G_(e2);
        }));
      }));
    }
    W_(e, t) {
      const n = this.K_(this.b_);
      this.stream = this.z_(e, t), this.stream.Zo((() => {
        n((() => this.listener.Zo()));
      })), this.stream.e_((() => {
        n((() => (this.state = 2, this.v_ = this.Fi.enqueueAfterDelay(this.S_, 1e4, (() => (this.x_() && (this.state = 3), Promise.resolve()))), this.listener.e_())));
      })), this.stream.n_(((e2) => {
        n((() => this.G_(e2)));
      })), this.stream.onMessage(((e2) => {
        n((() => 1 == ++this.C_ ? this.j_(e2) : this.onNext(e2)));
      }));
    }
    O_() {
      this.state = 5, this.F_.g_((async () => {
        this.state = 0, this.start();
      }));
    }
    // Visible for tests
    G_(e) {
      return __PRIVATE_logDebug(Zt, `close with error: ${e}`), this.stream = null, this.close(4, e);
    }
    /**
     * Returns a "dispatcher" function that dispatches operations onto the
     * AsyncQueue but only runs them if closeCount remains unchanged. This allows
     * us to turn auth / stream callbacks into no-ops if the stream is closed /
     * re-opened, etc.
     */
    K_(e) {
      return (t) => {
        this.Fi.enqueueAndForget((() => this.b_ === e ? t() : (__PRIVATE_logDebug(Zt, "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve())));
      };
    }
  };
  var __PRIVATE_PersistentListenStream = class extends __PRIVATE_PersistentStream {
    constructor(e, t, n, r, i, s) {
      super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, n, r, s), this.serializer = i;
    }
    z_(e, t) {
      return this.connection.P_("Listen", e, t);
    }
    j_(e) {
      return this.onNext(e);
    }
    onNext(e) {
      this.F_.reset();
      const t = __PRIVATE_fromWatchChange(this.serializer, e), n = (function __PRIVATE_versionFromListenResponse(e2) {
        if (!("targetChange" in e2)) return SnapshotVersion.min();
        const t2 = e2.targetChange;
        return t2.targetIds && t2.targetIds.length ? SnapshotVersion.min() : t2.readTime ? __PRIVATE_fromVersion(t2.readTime) : SnapshotVersion.min();
      })(e);
      return this.listener.J_(t, n);
    }
    /**
     * Registers interest in the results of the given target. If the target
     * includes a resumeToken it will be included in the request. Results that
     * affect the target will be streamed back as WatchChange messages that
     * reference the targetId.
     */
    H_(e) {
      const t = {};
      t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.addTarget = (function __PRIVATE_toTarget(e2, t2) {
        let n2;
        const r = t2.target;
        if (n2 = __PRIVATE_targetIsDocumentTarget(r) ? {
          documents: __PRIVATE_toDocumentsTarget(e2, r)
        } : {
          query: __PRIVATE_toQueryTarget(e2, r).Vt
        }, n2.targetId = t2.targetId, t2.resumeToken.approximateByteSize() > 0) {
          n2.resumeToken = __PRIVATE_toBytes(e2, t2.resumeToken);
          const r2 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
          null !== r2 && (n2.expectedCount = r2);
        } else if (t2.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
          n2.readTime = toTimestamp(e2, t2.snapshotVersion.toTimestamp());
          const r2 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
          null !== r2 && (n2.expectedCount = r2);
        }
        return n2;
      })(this.serializer, e);
      const n = __PRIVATE_toListenRequestLabels(this.serializer, e);
      n && (t.labels = n), this.k_(t);
    }
    /**
     * Unregisters interest in the results of the target associated with the
     * given targetId.
     */
    Y_(e) {
      const t = {};
      t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.removeTarget = e, this.k_(t);
    }
  };
  var __PRIVATE_PersistentWriteStream = class extends __PRIVATE_PersistentStream {
    constructor(e, t, n, r, i, s) {
      super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, n, r, s), this.serializer = i;
    }
    /**
     * Tracks whether or not a handshake has been successfully exchanged and
     * the stream is ready to accept mutations.
     */
    get Z_() {
      return this.C_ > 0;
    }
    // Override of PersistentStream.start
    start() {
      this.lastStreamToken = void 0, super.start();
    }
    U_() {
      this.Z_ && this.X_([]);
    }
    z_(e, t) {
      return this.connection.P_("Write", e, t);
    }
    j_(e) {
      return __PRIVATE_hardAssert(!!e.streamToken, 31322), this.lastStreamToken = e.streamToken, // The first response is always the handshake response
      __PRIVATE_hardAssert(!e.writeResults || 0 === e.writeResults.length, 55816), this.listener.ea();
    }
    onNext(e) {
      __PRIVATE_hardAssert(!!e.streamToken, 12678), this.lastStreamToken = e.streamToken, // A successful first write response means the stream is healthy,
      // Note, that we could consider a successful handshake healthy, however,
      // the write itself might be causing an error we want to back off from.
      this.F_.reset();
      const t = __PRIVATE_fromWriteResults(e.writeResults, e.commitTime), n = __PRIVATE_fromVersion(e.commitTime);
      return this.listener.ta(n, t);
    }
    /**
     * Sends an initial streamToken to the server, performing the handshake
     * required to make the StreamingWrite RPC work. Subsequent
     * calls should wait until onHandshakeComplete was called.
     */
    na() {
      const e = {};
      e.database = __PRIVATE_getEncodedDatabaseId(this.serializer), this.k_(e);
    }
    /** Sends a group of mutations to the Firestore backend to apply. */
    X_(e) {
      const t = {
        streamToken: this.lastStreamToken,
        writes: e.map(((e2) => toMutation(this.serializer, e2)))
      };
      this.k_(t);
    }
  };
  var Datastore = class {
  };
  var __PRIVATE_DatastoreImpl = class extends Datastore {
    constructor(e, t, n, r) {
      super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = n, this.serializer = r, this.ra = false;
    }
    ia() {
      if (this.ra) throw new FirestoreError(N.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    /** Invokes the provided RPC with auth and AppCheck tokens. */
    Wo(e, t, n, r) {
      return this.ia(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([i, s]) => this.connection.Wo(e, __PRIVATE_toResourcePath(t, n), r, i, s))).catch(((e2) => {
        throw "FirebaseError" === e2.name ? (e2.code === N.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(N.UNKNOWN, e2.toString());
      }));
    }
    /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
    Jo(e, t, n, r, i) {
      return this.ia(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([s, o]) => this.connection.Jo(e, __PRIVATE_toResourcePath(t, n), r, s, o, i))).catch(((e2) => {
        throw "FirebaseError" === e2.name ? (e2.code === N.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(N.UNKNOWN, e2.toString());
      }));
    }
    terminate() {
      this.ra = true, this.connection.terminate();
    }
  };
  var __PRIVATE_OnlineStateTracker = class {
    constructor(e, t) {
      this.asyncQueue = e, this.onlineStateHandler = t, /** The current OnlineState. */
      this.state = "Unknown", /**
       * A count of consecutive failures to open the stream. If it reaches the
       * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
       * Offline.
       */
      this.sa = 0, /**
       * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
       * transition from OnlineState.Unknown to OnlineState.Offline without waiting
       * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
       */
      this.oa = null, /**
       * Whether the client should log a warning message if it fails to connect to
       * the backend (initially true, cleared after a successful stream, or if we've
       * logged the message already).
       */
      this._a = true;
    }
    /**
     * Called by RemoteStore when a watch stream is started (including on each
     * backoff attempt).
     *
     * If this is the first attempt, it sets the OnlineState to Unknown and starts
     * the onlineStateTimer.
     */
    aa() {
      0 === this.sa && (this.ua(
        "Unknown"
        /* OnlineState.Unknown */
      ), this.oa = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, (() => (this.oa = null, this.ca("Backend didn't respond within 10 seconds."), this.ua(
        "Offline"
        /* OnlineState.Offline */
      ), Promise.resolve()))));
    }
    /**
     * Updates our OnlineState as appropriate after the watch stream reports a
     * failure. The first failure moves us to the 'Unknown' state. We then may
     * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
     * actually transition to the 'Offline' state.
     */
    la(e) {
      "Online" === this.state ? this.ua(
        "Unknown"
        /* OnlineState.Unknown */
      ) : (this.sa++, this.sa >= 1 && (this.ha(), this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.ua(
        "Offline"
        /* OnlineState.Offline */
      )));
    }
    /**
     * Explicitly sets the OnlineState to the specified state.
     *
     * Note that this resets our timers / failure counters, etc. used by our
     * Offline heuristics, so must not be used in place of
     * handleWatchStreamStart() and handleWatchStreamFailure().
     */
    set(e) {
      this.ha(), this.sa = 0, "Online" === e && // We've connected to watch at least once. Don't warn the developer
      // about being offline going forward.
      (this._a = false), this.ua(e);
    }
    ua(e) {
      e !== this.state && (this.state = e, this.onlineStateHandler(e));
    }
    ca(e) {
      const t = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
      this._a ? (__PRIVATE_logError(t), this._a = false) : __PRIVATE_logDebug("OnlineStateTracker", t);
    }
    ha() {
      null !== this.oa && (this.oa.cancel(), this.oa = null);
    }
  };
  var Xt = "RemoteStore";
  var __PRIVATE_RemoteStoreImpl = class {
    constructor(e, t, n, r, i) {
      this.localStore = e, this.datastore = t, this.asyncQueue = n, this.remoteSyncer = {}, /**
       * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
       * LocalStore via fillWritePipeline() and have or will send to the write
       * stream.
       *
       * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
       * restart the write stream. When the stream is established the writes in the
       * pipeline will be sent in order.
       *
       * Writes remain in writePipeline until they are acknowledged by the backend
       * and thus will automatically be re-sent if the stream is interrupted /
       * restarted before they're acknowledged.
       *
       * Write responses from the backend are linked to their originating request
       * purely based on order, and so we can just shift() writes from the front of
       * the writePipeline as we receive responses.
       */
      this.Pa = [], /**
       * A mapping of watched targets that the client cares about tracking and the
       * user has explicitly called a 'listen' for this target.
       *
       * These targets may or may not have been sent to or acknowledged by the
       * server. On re-establishing the listen stream, these targets should be sent
       * to the server. The targets removed with unlistens are removed eagerly
       * without waiting for confirmation from the listen stream.
       */
      this.Ta = /* @__PURE__ */ new Map(), /**
       * A set of reasons for why the RemoteStore may be offline. If empty, the
       * RemoteStore may start its network connections.
       */
      this.Ia = /* @__PURE__ */ new Set(), /**
       * Event handlers that get called when the network is disabled or enabled.
       *
       * PORTING NOTE: These functions are used on the Web client to create the
       * underlying streams (to support tree-shakeable streams). On Android and iOS,
       * the streams are created during construction of RemoteStore.
       */
      this.da = [], this.Ea = i, this.Ea.xo(((e2) => {
        n.enqueueAndForget((async () => {
          __PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug(Xt, "Restarting streams for network reachability change."), await (async function __PRIVATE_restartNetwork(e3) {
            const t2 = __PRIVATE_debugCast(e3);
            t2.Ia.add(
              4
              /* OfflineCause.ConnectivityChange */
            ), await __PRIVATE_disableNetworkInternal(t2), t2.Aa.set(
              "Unknown"
              /* OnlineState.Unknown */
            ), t2.Ia.delete(
              4
              /* OfflineCause.ConnectivityChange */
            ), await __PRIVATE_enableNetworkInternal(t2);
          })(this));
        }));
      })), this.Aa = new __PRIVATE_OnlineStateTracker(n, r);
    }
  };
  async function __PRIVATE_enableNetworkInternal(e) {
    if (__PRIVATE_canUseNetwork(e)) for (const t of e.da) await t(
      /* enabled= */
      true
    );
  }
  async function __PRIVATE_disableNetworkInternal(e) {
    for (const t of e.da) await t(
      /* enabled= */
      false
    );
  }
  function __PRIVATE_remoteStoreListen(e, t) {
    const n = __PRIVATE_debugCast(e);
    n.Ta.has(t.targetId) || // Mark this as something the client is currently listening for.
    (n.Ta.set(t.targetId, t), __PRIVATE_shouldStartWatchStream(n) ? (
      // The listen will be sent in onWatchStreamOpen
      __PRIVATE_startWatchStream(n)
    ) : __PRIVATE_ensureWatchStream(n).x_() && __PRIVATE_sendWatchRequest(n, t));
  }
  function __PRIVATE_remoteStoreUnlisten(e, t) {
    const n = __PRIVATE_debugCast(e), r = __PRIVATE_ensureWatchStream(n);
    n.Ta.delete(t), r.x_() && __PRIVATE_sendUnwatchRequest(n, t), 0 === n.Ta.size && (r.x_() ? r.B_() : __PRIVATE_canUseNetwork(n) && // Revert to OnlineState.Unknown if the watch stream is not open and we
    // have no listeners, since without any listens to send we cannot
    // confirm if the stream is healthy and upgrade to OnlineState.Online.
    n.Aa.set(
      "Unknown"
      /* OnlineState.Unknown */
    ));
  }
  function __PRIVATE_sendWatchRequest(e, t) {
    if (e.Ra.$e(t.targetId), t.resumeToken.approximateByteSize() > 0 || t.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
      const n = e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;
      t = t.withExpectedCount(n);
    }
    __PRIVATE_ensureWatchStream(e).H_(t);
  }
  function __PRIVATE_sendUnwatchRequest(e, t) {
    e.Ra.$e(t), __PRIVATE_ensureWatchStream(e).Y_(t);
  }
  function __PRIVATE_startWatchStream(e) {
    e.Ra = new __PRIVATE_WatchChangeAggregator({
      getRemoteKeysForTarget: (t) => e.remoteSyncer.getRemoteKeysForTarget(t),
      Et: (t) => e.Ta.get(t) || null,
      lt: () => e.datastore.serializer.databaseId
    }), __PRIVATE_ensureWatchStream(e).start(), e.Aa.aa();
  }
  function __PRIVATE_shouldStartWatchStream(e) {
    return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWatchStream(e).M_() && e.Ta.size > 0;
  }
  function __PRIVATE_canUseNetwork(e) {
    return 0 === __PRIVATE_debugCast(e).Ia.size;
  }
  function __PRIVATE_cleanUpWatchStreamState(e) {
    e.Ra = void 0;
  }
  async function __PRIVATE_onWatchStreamConnected(e) {
    e.Aa.set(
      "Online"
      /* OnlineState.Online */
    );
  }
  async function __PRIVATE_onWatchStreamOpen(e) {
    e.Ta.forEach(((t, n) => {
      __PRIVATE_sendWatchRequest(e, t);
    }));
  }
  async function __PRIVATE_onWatchStreamClose(e, t) {
    __PRIVATE_cleanUpWatchStreamState(e), // If we still need the watch stream, retry the connection.
    __PRIVATE_shouldStartWatchStream(e) ? (e.Aa.la(t), __PRIVATE_startWatchStream(e)) : (
      // No need to restart watch stream because there are no active targets.
      // The online state is set to unknown because there is no active attempt
      // at establishing a connection
      e.Aa.set(
        "Unknown"
        /* OnlineState.Unknown */
      )
    );
  }
  async function __PRIVATE_onWatchStreamChange(e, t, n) {
    if (
      // Mark the client as online since we got a message from the server
      e.Aa.set(
        "Online"
        /* OnlineState.Online */
      ), t instanceof __PRIVATE_WatchTargetChange && 2 === t.state && t.cause
    )
      try {
        await (async function __PRIVATE_handleTargetError(e2, t2) {
          const n2 = t2.cause;
          for (const r of t2.targetIds)
            e2.Ta.has(r) && (await e2.remoteSyncer.rejectListen(r, n2), e2.Ta.delete(r), e2.Ra.removeTarget(r));
        })(e, t);
      } catch (n2) {
        __PRIVATE_logDebug(Xt, "Failed to remove targets %s: %s ", t.targetIds.join(","), n2), await __PRIVATE_disableNetworkUntilRecovery(e, n2);
      }
    else if (t instanceof __PRIVATE_DocumentWatchChange ? e.Ra.Ye(t) : t instanceof __PRIVATE_ExistenceFilterChange ? e.Ra.it(t) : e.Ra.et(t), !n.isEqual(SnapshotVersion.min())) try {
      const t2 = await __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore);
      n.compareTo(t2) >= 0 && // We have received a target change with a global snapshot if the snapshot
      // version is not equal to SnapshotVersion.min().
      /**
      * Takes a batch of changes from the Datastore, repackages them as a
      * RemoteEvent, and passes that on to the listener, which is typically the
      * SyncEngine.
      */
      await (function __PRIVATE_raiseWatchSnapshot(e2, t3) {
        const n2 = e2.Ra.Pt(t3);
        return n2.targetChanges.forEach(((n3, r) => {
          if (n3.resumeToken.approximateByteSize() > 0) {
            const i = e2.Ta.get(r);
            i && e2.Ta.set(r, i.withResumeToken(n3.resumeToken, t3));
          }
        })), // Re-establish listens for the targets that have been invalidated by
        // existence filter mismatches.
        n2.targetMismatches.forEach(((t4, n3) => {
          const r = e2.Ta.get(t4);
          if (!r)
            return;
          e2.Ta.set(t4, r.withResumeToken(ByteString.EMPTY_BYTE_STRING, r.snapshotVersion)), // Cause a hard reset by unwatching and rewatching immediately, but
          // deliberately don't send a resume token so that we get a full update.
          __PRIVATE_sendUnwatchRequest(e2, t4);
          const i = new TargetData(r.target, t4, n3, r.sequenceNumber);
          __PRIVATE_sendWatchRequest(e2, i);
        })), e2.remoteSyncer.applyRemoteEvent(n2);
      })(e, n);
    } catch (t2) {
      __PRIVATE_logDebug(Xt, "Failed to raise snapshot:", t2), await __PRIVATE_disableNetworkUntilRecovery(e, t2);
    }
  }
  async function __PRIVATE_disableNetworkUntilRecovery(e, t, n) {
    if (!__PRIVATE_isIndexedDbTransactionError(t)) throw t;
    e.Ia.add(
      1
      /* OfflineCause.IndexedDbFailed */
    ), // Disable network and raise offline snapshots
    await __PRIVATE_disableNetworkInternal(e), e.Aa.set(
      "Offline"
      /* OnlineState.Offline */
    ), n || // Use a simple read operation to determine if IndexedDB recovered.
    // Ideally, we would expose a health check directly on SimpleDb, but
    // RemoteStore only has access to persistence through LocalStore.
    (n = () => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore)), // Probe IndexedDB periodically and re-enable network
    e.asyncQueue.enqueueRetryable((async () => {
      __PRIVATE_logDebug(Xt, "Retrying IndexedDB access"), await n(), e.Ia.delete(
        1
        /* OfflineCause.IndexedDbFailed */
      ), await __PRIVATE_enableNetworkInternal(e);
    }));
  }
  function __PRIVATE_executeWithRecovery(e, t) {
    return t().catch(((n) => __PRIVATE_disableNetworkUntilRecovery(e, n, t)));
  }
  async function __PRIVATE_fillWritePipeline(e) {
    const t = __PRIVATE_debugCast(e), n = __PRIVATE_ensureWriteStream(t);
    let r = t.Pa.length > 0 ? t.Pa[t.Pa.length - 1].batchId : G;
    for (; __PRIVATE_canAddToWritePipeline(t); ) try {
      const e2 = await __PRIVATE_localStoreGetNextMutationBatch(t.localStore, r);
      if (null === e2) {
        0 === t.Pa.length && n.B_();
        break;
      }
      r = e2.batchId, __PRIVATE_addToWritePipeline(t, e2);
    } catch (e2) {
      await __PRIVATE_disableNetworkUntilRecovery(t, e2);
    }
    __PRIVATE_shouldStartWriteStream(t) && __PRIVATE_startWriteStream(t);
  }
  function __PRIVATE_canAddToWritePipeline(e) {
    return __PRIVATE_canUseNetwork(e) && e.Pa.length < 10;
  }
  function __PRIVATE_addToWritePipeline(e, t) {
    e.Pa.push(t);
    const n = __PRIVATE_ensureWriteStream(e);
    n.x_() && n.Z_ && n.X_(t.mutations);
  }
  function __PRIVATE_shouldStartWriteStream(e) {
    return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWriteStream(e).M_() && e.Pa.length > 0;
  }
  function __PRIVATE_startWriteStream(e) {
    __PRIVATE_ensureWriteStream(e).start();
  }
  async function __PRIVATE_onWriteStreamOpen(e) {
    __PRIVATE_ensureWriteStream(e).na();
  }
  async function __PRIVATE_onWriteHandshakeComplete(e) {
    const t = __PRIVATE_ensureWriteStream(e);
    for (const n of e.Pa) t.X_(n.mutations);
  }
  async function __PRIVATE_onMutationResult(e, t, n) {
    const r = e.Pa.shift(), i = MutationBatchResult.from(r, t, n);
    await __PRIVATE_executeWithRecovery(e, (() => e.remoteSyncer.applySuccessfulWrite(i))), // It's possible that with the completion of this mutation another
    // slot has freed up.
    await __PRIVATE_fillWritePipeline(e);
  }
  async function __PRIVATE_onWriteStreamClose(e, t) {
    t && __PRIVATE_ensureWriteStream(e).Z_ && // This error affects the actual write.
    await (async function __PRIVATE_handleWriteError(e2, t2) {
      if ((function __PRIVATE_isPermanentWriteError(e3) {
        return __PRIVATE_isPermanentError(e3) && e3 !== N.ABORTED;
      })(t2.code)) {
        const n = e2.Pa.shift();
        __PRIVATE_ensureWriteStream(e2).N_(), await __PRIVATE_executeWithRecovery(e2, (() => e2.remoteSyncer.rejectFailedWrite(n.batchId, t2))), // It's possible that with the completion of this mutation
        // another slot has freed up.
        await __PRIVATE_fillWritePipeline(e2);
      }
    })(e, t), // The write stream might have been started by refilling the write
    // pipeline for failed writes
    __PRIVATE_shouldStartWriteStream(e) && __PRIVATE_startWriteStream(e);
  }
  async function __PRIVATE_remoteStoreHandleCredentialChange(e, t) {
    const n = __PRIVATE_debugCast(e);
    n.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(Xt, "RemoteStore received new credentials");
    const r = __PRIVATE_canUseNetwork(n);
    n.Ia.add(
      3
      /* OfflineCause.CredentialChange */
    ), await __PRIVATE_disableNetworkInternal(n), r && // Don't set the network status to Unknown if we are offline.
    n.Aa.set(
      "Unknown"
      /* OnlineState.Unknown */
    ), await n.remoteSyncer.handleCredentialChange(t), n.Ia.delete(
      3
      /* OfflineCause.CredentialChange */
    ), await __PRIVATE_enableNetworkInternal(n);
  }
  async function __PRIVATE_remoteStoreApplyPrimaryState(e, t) {
    const n = __PRIVATE_debugCast(e);
    t ? (n.Ia.delete(
      2
      /* OfflineCause.IsSecondary */
    ), await __PRIVATE_enableNetworkInternal(n)) : t || (n.Ia.add(
      2
      /* OfflineCause.IsSecondary */
    ), await __PRIVATE_disableNetworkInternal(n), n.Aa.set(
      "Unknown"
      /* OnlineState.Unknown */
    ));
  }
  function __PRIVATE_ensureWatchStream(e) {
    return e.Va || // Create stream (but note that it is not started yet).
    (e.Va = (function __PRIVATE_newPersistentWatchStream(e2, t, n) {
      const r = __PRIVATE_debugCast(e2);
      return r.ia(), new __PRIVATE_PersistentListenStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
    })(e.datastore, e.asyncQueue, {
      Zo: __PRIVATE_onWatchStreamConnected.bind(null, e),
      e_: __PRIVATE_onWatchStreamOpen.bind(null, e),
      n_: __PRIVATE_onWatchStreamClose.bind(null, e),
      J_: __PRIVATE_onWatchStreamChange.bind(null, e)
    }), e.da.push((async (t) => {
      t ? (e.Va.N_(), __PRIVATE_shouldStartWatchStream(e) ? __PRIVATE_startWatchStream(e) : e.Aa.set(
        "Unknown"
        /* OnlineState.Unknown */
      )) : (await e.Va.stop(), __PRIVATE_cleanUpWatchStreamState(e));
    }))), e.Va;
  }
  function __PRIVATE_ensureWriteStream(e) {
    return e.ma || // Create stream (but note that it is not started yet).
    (e.ma = (function __PRIVATE_newPersistentWriteStream(e2, t, n) {
      const r = __PRIVATE_debugCast(e2);
      return r.ia(), new __PRIVATE_PersistentWriteStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
    })(e.datastore, e.asyncQueue, {
      Zo: () => Promise.resolve(),
      e_: __PRIVATE_onWriteStreamOpen.bind(null, e),
      n_: __PRIVATE_onWriteStreamClose.bind(null, e),
      ea: __PRIVATE_onWriteHandshakeComplete.bind(null, e),
      ta: __PRIVATE_onMutationResult.bind(null, e)
    }), e.da.push((async (t) => {
      t ? (e.ma.N_(), // This will start the write stream if necessary.
      await __PRIVATE_fillWritePipeline(e)) : (await e.ma.stop(), e.Pa.length > 0 && (__PRIVATE_logDebug(Xt, `Stopping write stream with ${e.Pa.length} pending writes`), e.Pa = []));
    }))), e.ma;
  }
  var DelayedOperation = class _DelayedOperation {
    constructor(e, t, n, r, i) {
      this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r, this.removalCallback = i, this.deferred = new __PRIVATE_Deferred(), this.then = this.deferred.promise.then.bind(this.deferred.promise), // It's normal for the deferred promise to be canceled (due to cancellation)
      // and so we attach a dummy catch callback to avoid
      // 'UnhandledPromiseRejectionWarning' log spam.
      this.deferred.promise.catch(((e2) => {
      }));
    }
    get promise() {
      return this.deferred.promise;
    }
    /**
     * Creates and returns a DelayedOperation that has been scheduled to be
     * executed on the provided asyncQueue after the provided delayMs.
     *
     * @param asyncQueue - The queue to schedule the operation on.
     * @param id - A Timer ID identifying the type of operation this is.
     * @param delayMs - The delay (ms) before the operation should be scheduled.
     * @param op - The operation to run.
     * @param removalCallback - A callback to be called synchronously once the
     *   operation is executed or canceled, notifying the AsyncQueue to remove it
     *   from its delayedOperations list.
     *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
     *   the DelayedOperation class public.
     */
    static createAndSchedule(e, t, n, r, i) {
      const s = Date.now() + n, o = new _DelayedOperation(e, t, s, r, i);
      return o.start(n), o;
    }
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */
    start(e) {
      this.timerHandle = setTimeout((() => this.handleDelayElapsed()), e);
    }
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */
    skipDelay() {
      return this.handleDelayElapsed();
    }
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */
    cancel(e) {
      null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(N.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
    }
    handleDelayElapsed() {
      this.asyncQueue.enqueueAndForget((() => null !== this.timerHandle ? (this.clearTimeout(), this.op().then(((e) => this.deferred.resolve(e)))) : Promise.resolve()));
    }
    clearTimeout() {
      null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
    }
  };
  function __PRIVATE_wrapInUserErrorIfRecoverable(e, t) {
    if (__PRIVATE_logError("AsyncQueue", `${t}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e)) return new FirestoreError(N.UNAVAILABLE, `${t}: ${e}`);
    throw e;
  }
  var DocumentSet = class _DocumentSet {
    /**
     * Returns an empty copy of the existing DocumentSet, using the same
     * comparator.
     */
    static emptySet(e) {
      return new _DocumentSet(e.comparator);
    }
    /** The default ordering is by key if the comparator is omitted */
    constructor(e) {
      this.comparator = e ? (t, n) => e(t, n) || DocumentKey.comparator(t.key, n.key) : (e2, t) => DocumentKey.comparator(e2.key, t.key), this.keyedMap = documentMap(), this.sortedSet = new SortedMap(this.comparator);
    }
    has(e) {
      return null != this.keyedMap.get(e);
    }
    get(e) {
      return this.keyedMap.get(e);
    }
    first() {
      return this.sortedSet.minKey();
    }
    last() {
      return this.sortedSet.maxKey();
    }
    isEmpty() {
      return this.sortedSet.isEmpty();
    }
    /**
     * Returns the index of the provided key in the document set, or -1 if the
     * document key is not present in the set;
     */
    indexOf(e) {
      const t = this.keyedMap.get(e);
      return t ? this.sortedSet.indexOf(t) : -1;
    }
    get size() {
      return this.sortedSet.size;
    }
    /** Iterates documents in order defined by "comparator" */
    forEach(e) {
      this.sortedSet.inorderTraversal(((t, n) => (e(t), false)));
    }
    /** Inserts or updates a document with the same key */
    add(e) {
      const t = this.delete(e.key);
      return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
    }
    /** Deletes a document with a given key */
    delete(e) {
      const t = this.get(e);
      return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
    }
    isEqual(e) {
      if (!(e instanceof _DocumentSet)) return false;
      if (this.size !== e.size) return false;
      const t = this.sortedSet.getIterator(), n = e.sortedSet.getIterator();
      for (; t.hasNext(); ) {
        const e2 = t.getNext().key, r = n.getNext().key;
        if (!e2.isEqual(r)) return false;
      }
      return true;
    }
    toString() {
      const e = [];
      return this.forEach(((t) => {
        e.push(t.toString());
      })), 0 === e.length ? "DocumentSet ()" : "DocumentSet (\n  " + e.join("  \n") + "\n)";
    }
    copy(e, t) {
      const n = new _DocumentSet();
      return n.comparator = this.comparator, n.keyedMap = e, n.sortedSet = t, n;
    }
  };
  var __PRIVATE_DocumentChangeSet = class {
    constructor() {
      this.fa = new SortedMap(DocumentKey.comparator);
    }
    track(e) {
      const t = e.doc.key, n = this.fa.get(t);
      n ? (
        // Merge the new change with the existing change.
        0 !== e.type && 3 === n.type ? this.fa = this.fa.insert(t, e) : 3 === e.type && 1 !== n.type ? this.fa = this.fa.insert(t, {
          type: n.type,
          doc: e.doc
        }) : 2 === e.type && 2 === n.type ? this.fa = this.fa.insert(t, {
          type: 2,
          doc: e.doc
        }) : 2 === e.type && 0 === n.type ? this.fa = this.fa.insert(t, {
          type: 0,
          doc: e.doc
        }) : 1 === e.type && 0 === n.type ? this.fa = this.fa.remove(t) : 1 === e.type && 2 === n.type ? this.fa = this.fa.insert(t, {
          type: 1,
          doc: n.doc
        }) : 0 === e.type && 1 === n.type ? this.fa = this.fa.insert(t, {
          type: 2,
          doc: e.doc
        }) : (
          // This includes these cases, which don't make sense:
          // Added->Added
          // Removed->Removed
          // Modified->Added
          // Removed->Modified
          // Metadata->Added
          // Removed->Metadata
          fail(63341, {
            At: e,
            ga: n
          })
        )
      ) : this.fa = this.fa.insert(t, e);
    }
    pa() {
      const e = [];
      return this.fa.inorderTraversal(((t, n) => {
        e.push(n);
      })), e;
    }
  };
  var ViewSnapshot = class _ViewSnapshot {
    constructor(e, t, n, r, i, s, o, _, a) {
      this.query = e, this.docs = t, this.oldDocs = n, this.docChanges = r, this.mutatedKeys = i, this.fromCache = s, this.syncStateChanged = o, this.excludesMetadataChanges = _, this.hasCachedResults = a;
    }
    /** Returns a view snapshot as if all documents in the snapshot were added. */
    static fromInitialDocuments(e, t, n, r, i) {
      const s = [];
      return t.forEach(((e2) => {
        s.push({
          type: 0,
          doc: e2
        });
      })), new _ViewSnapshot(
        e,
        t,
        DocumentSet.emptySet(t),
        s,
        n,
        r,
        /* syncStateChanged= */
        true,
        /* excludesMetadataChanges= */
        false,
        i
      );
    }
    get hasPendingWrites() {
      return !this.mutatedKeys.isEmpty();
    }
    isEqual(e) {
      if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && __PRIVATE_queryEquals(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs))) return false;
      const t = this.docChanges, n = e.docChanges;
      if (t.length !== n.length) return false;
      for (let e2 = 0; e2 < t.length; e2++) if (t[e2].type !== n[e2].type || !t[e2].doc.isEqual(n[e2].doc)) return false;
      return true;
    }
  };
  var __PRIVATE_QueryListenersInfo = class {
    constructor() {
      this.ya = void 0, this.wa = [];
    }
    // Helper methods that checks if the query has listeners that listening to remote store
    Sa() {
      return this.wa.some(((e) => e.ba()));
    }
  };
  var __PRIVATE_EventManagerImpl = class {
    constructor() {
      this.queries = __PRIVATE_newQueriesObjectMap(), this.onlineState = "Unknown", this.Da = /* @__PURE__ */ new Set();
    }
    terminate() {
      !(function __PRIVATE_errorAllTargets(e, t) {
        const n = __PRIVATE_debugCast(e), r = n.queries;
        n.queries = __PRIVATE_newQueriesObjectMap(), r.forEach(((e2, n2) => {
          for (const e3 of n2.wa) e3.onError(t);
        }));
      })(this, new FirestoreError(N.ABORTED, "Firestore shutting down"));
    }
  };
  function __PRIVATE_newQueriesObjectMap() {
    return new ObjectMap(((e) => __PRIVATE_canonifyQuery(e)), __PRIVATE_queryEquals);
  }
  async function __PRIVATE_eventManagerListen(e, t) {
    const n = __PRIVATE_debugCast(e);
    let r = 3;
    const i = t.query;
    let s = n.queries.get(i);
    s ? !s.Sa() && t.ba() && // Query has been listening to local cache, and tries to add a new listener sourced from watch.
    (r = 2) : (s = new __PRIVATE_QueryListenersInfo(), r = t.ba() ? 0 : 1);
    try {
      switch (r) {
        case 0:
          s.ya = await n.onListen(
            i,
            /** enableRemoteListen= */
            true
          );
          break;
        case 1:
          s.ya = await n.onListen(
            i,
            /** enableRemoteListen= */
            false
          );
          break;
        case 2:
          await n.onFirstRemoteStoreListen(i);
      }
    } catch (e2) {
      const n2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, `Initialization of query '${__PRIVATE_stringifyQuery(t.query)}' failed`);
      return void t.onError(n2);
    }
    if (n.queries.set(i, s), s.wa.push(t), // Run global snapshot listeners if a consistent snapshot has been emitted.
    t.va(n.onlineState), s.ya) {
      t.Ca(s.ya) && __PRIVATE_raiseSnapshotsInSyncEvent(n);
    }
  }
  async function __PRIVATE_eventManagerUnlisten(e, t) {
    const n = __PRIVATE_debugCast(e), r = t.query;
    let i = 3;
    const s = n.queries.get(r);
    if (s) {
      const e2 = s.wa.indexOf(t);
      e2 >= 0 && (s.wa.splice(e2, 1), 0 === s.wa.length ? i = t.ba() ? 0 : 1 : !s.Sa() && t.ba() && // The removed listener is the last one that sourced from watch.
      (i = 2));
    }
    switch (i) {
      case 0:
        return n.queries.delete(r), n.onUnlisten(
          r,
          /** disableRemoteListen= */
          true
        );
      case 1:
        return n.queries.delete(r), n.onUnlisten(
          r,
          /** disableRemoteListen= */
          false
        );
      case 2:
        return n.onLastRemoteStoreUnlisten(r);
      default:
        return;
    }
  }
  function __PRIVATE_eventManagerOnWatchChange(e, t) {
    const n = __PRIVATE_debugCast(e);
    let r = false;
    for (const e2 of t) {
      const t2 = e2.query, i = n.queries.get(t2);
      if (i) {
        for (const t3 of i.wa) t3.Ca(e2) && (r = true);
        i.ya = e2;
      }
    }
    r && __PRIVATE_raiseSnapshotsInSyncEvent(n);
  }
  function __PRIVATE_eventManagerOnWatchError(e, t, n) {
    const r = __PRIVATE_debugCast(e), i = r.queries.get(t);
    if (i) for (const e2 of i.wa) e2.onError(n);
    r.queries.delete(t);
  }
  function __PRIVATE_raiseSnapshotsInSyncEvent(e) {
    e.Da.forEach(((e2) => {
      e2.next();
    }));
  }
  var en;
  var tn;
  (tn = en || (en = {})).Fa = "default", /** Listen to changes in cache only */
  tn.Cache = "cache";
  var __PRIVATE_QueryListener = class {
    constructor(e, t, n) {
      this.query = e, this.Ma = t, /**
       * Initial snapshots (e.g. from cache) may not be propagated to the wrapped
       * observer. This flag is set to true once we've actually raised an event.
       */
      this.xa = false, this.Oa = null, this.onlineState = "Unknown", this.options = n || {};
    }
    /**
     * Applies the new ViewSnapshot to this listener, raising a user-facing event
     * if applicable (depending on what changed, whether the user has opted into
     * metadata-only changes, etc.). Returns true if a user-facing event was
     * indeed raised.
     */
    Ca(e) {
      if (!this.options.includeMetadataChanges) {
        const t2 = [];
        for (const n of e.docChanges) 3 !== n.type && t2.push(n);
        e = new ViewSnapshot(
          e.query,
          e.docs,
          e.oldDocs,
          t2,
          e.mutatedKeys,
          e.fromCache,
          e.syncStateChanged,
          /* excludesMetadataChanges= */
          true,
          e.hasCachedResults
        );
      }
      let t = false;
      return this.xa ? this.Na(e) && (this.Ma.next(e), t = true) : this.Ba(e, this.onlineState) && (this.La(e), t = true), this.Oa = e, t;
    }
    onError(e) {
      this.Ma.error(e);
    }
    /** Returns whether a snapshot was raised. */
    va(e) {
      this.onlineState = e;
      let t = false;
      return this.Oa && !this.xa && this.Ba(this.Oa, e) && (this.La(this.Oa), t = true), t;
    }
    Ba(e, t) {
      if (!e.fromCache) return true;
      if (!this.ba()) return true;
      const n = "Offline" !== t;
      return (!this.options.ka || !n) && (!e.docs.isEmpty() || e.hasCachedResults || "Offline" === t);
    }
    Na(e) {
      if (e.docChanges.length > 0) return true;
      const t = this.Oa && this.Oa.hasPendingWrites !== e.hasPendingWrites;
      return !(!e.syncStateChanged && !t) && true === this.options.includeMetadataChanges;
    }
    La(e) {
      e = ViewSnapshot.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), this.xa = true, this.Ma.next(e);
    }
    ba() {
      return this.options.source !== en.Cache;
    }
  };
  var __PRIVATE_AddedLimboDocument = class {
    constructor(e) {
      this.key = e;
    }
  };
  var __PRIVATE_RemovedLimboDocument = class {
    constructor(e) {
      this.key = e;
    }
  };
  var __PRIVATE_View = class {
    constructor(e, t) {
      this.query = e, this.Ha = t, this.Ya = null, this.hasCachedResults = false, /**
       * A flag whether the view is current with the backend. A view is considered
       * current after it has seen the current flag from the backend and did not
       * lose consistency within the watch stream (e.g. because of an existence
       * filter mismatch).
       */
      this.current = false, /** Documents in the view but not in the remote target */
      this.Za = __PRIVATE_documentKeySet(), /** Document Keys that have local changes */
      this.mutatedKeys = __PRIVATE_documentKeySet(), this.Xa = __PRIVATE_newQueryComparator(e), this.eu = new DocumentSet(this.Xa);
    }
    /**
     * The set of remote documents that the server has told us belongs to the target associated with
     * this view.
     */
    get tu() {
      return this.Ha;
    }
    /**
     * Iterates over a set of doc changes, applies the query limit, and computes
     * what the new results should be, what the changes were, and whether we may
     * need to go back to the local cache for more results. Does not make any
     * changes to the view.
     * @param docChanges - The doc changes to apply to this view.
     * @param previousChanges - If this is being called with a refill, then start
     *        with this set of docs and changes instead of the current view.
     * @returns a new set of docs, changes, and refill flag.
     */
    nu(e, t) {
      const n = t ? t.ru : new __PRIVATE_DocumentChangeSet(), r = t ? t.eu : this.eu;
      let i = t ? t.mutatedKeys : this.mutatedKeys, s = r, o = false;
      const _ = "F" === this.query.limitType && r.size === this.query.limit ? r.last() : null, a = "L" === this.query.limitType && r.size === this.query.limit ? r.first() : null;
      if (e.inorderTraversal(((e2, t2) => {
        const u = r.get(e2), c = __PRIVATE_queryMatches(this.query, t2) ? t2 : null, l = !!u && this.mutatedKeys.has(u.key), h = !!c && (c.hasLocalMutations || // We only consider committed mutations for documents that were
        // mutated during the lifetime of the view.
        this.mutatedKeys.has(c.key) && c.hasCommittedMutations);
        let P = false;
        if (u && c) {
          u.data.isEqual(c.data) ? l !== h && (n.track({
            type: 3,
            doc: c
          }), P = true) : this.iu(u, c) || (n.track({
            type: 2,
            doc: c
          }), P = true, (_ && this.Xa(c, _) > 0 || a && this.Xa(c, a) < 0) && // This doc moved from inside the limit to outside the limit.
          // That means there may be some other doc in the local cache
          // that should be included instead.
          (o = true));
        } else !u && c ? (n.track({
          type: 0,
          doc: c
        }), P = true) : u && !c && (n.track({
          type: 1,
          doc: u
        }), P = true, (_ || a) && // A doc was removed from a full limit query. We'll need to
        // requery from the local cache to see if we know about some other
        // doc that should be in the results.
        (o = true));
        P && (c ? (s = s.add(c), i = h ? i.add(e2) : i.delete(e2)) : (s = s.delete(e2), i = i.delete(e2)));
      })), null !== this.query.limit) for (; s.size > this.query.limit; ) {
        const e2 = "F" === this.query.limitType ? s.last() : s.first();
        s = s.delete(e2.key), i = i.delete(e2.key), n.track({
          type: 1,
          doc: e2
        });
      }
      return {
        eu: s,
        ru: n,
        Ds: o,
        mutatedKeys: i
      };
    }
    iu(e, t) {
      return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
    }
    /**
     * Updates the view with the given ViewDocumentChanges and optionally updates
     * limbo docs and sync state from the provided target change.
     * @param docChanges - The set of changes to make to the view's docs.
     * @param limboResolutionEnabled - Whether to update limbo documents based on
     *        this change.
     * @param targetChange - A target change to apply for computing limbo docs and
     *        sync state.
     * @param targetIsPendingReset - Whether the target is pending to reset due to
     *        existence filter mismatch. If not explicitly specified, it is treated
     *        equivalently to `false`.
     * @returns A new ViewChange with the given docs, changes, and sync state.
     */
    // PORTING NOTE: The iOS/Android clients always compute limbo document changes.
    applyChanges(e, t, n, r) {
      const i = this.eu;
      this.eu = e.eu, this.mutatedKeys = e.mutatedKeys;
      const s = e.ru.pa();
      s.sort(((e2, t2) => (function __PRIVATE_compareChangeType(e3, t3) {
        const order = (e4) => {
          switch (e4) {
            case 0:
              return 1;
            case 2:
            case 3:
              return 2;
            case 1:
              return 0;
            default:
              return fail(20277, {
                At: e4
              });
          }
        };
        return order(e3) - order(t3);
      })(e2.type, t2.type) || this.Xa(e2.doc, t2.doc))), this.su(n), r = null != r && r;
      const o = t && !r ? this.ou() : [], _ = 0 === this.Za.size && this.current && !r ? 1 : 0, a = _ !== this.Ya;
      if (this.Ya = _, 0 !== s.length || a) {
        return {
          snapshot: new ViewSnapshot(
            this.query,
            e.eu,
            i,
            s,
            e.mutatedKeys,
            0 === _,
            a,
            /* excludesMetadataChanges= */
            false,
            !!n && n.resumeToken.approximateByteSize() > 0
          ),
          _u: o
        };
      }
      return {
        _u: o
      };
    }
    /**
     * Applies an OnlineState change to the view, potentially generating a
     * ViewChange if the view's syncState changes as a result.
     */
    va(e) {
      return this.current && "Offline" === e ? (
        // If we're offline, set `current` to false and then call applyChanges()
        // to refresh our syncState and generate a ViewChange as appropriate. We
        // are guaranteed to get a new TargetChange that sets `current` back to
        // true once the client is back online.
        (this.current = false, this.applyChanges(
          {
            eu: this.eu,
            ru: new __PRIVATE_DocumentChangeSet(),
            mutatedKeys: this.mutatedKeys,
            Ds: false
          },
          /* limboResolutionEnabled= */
          false
        ))
      ) : {
        _u: []
      };
    }
    /**
     * Returns whether the doc for the given key should be in limbo.
     */
    au(e) {
      return !this.Ha.has(e) && // The local store doesn't think it's a result, so it shouldn't be in limbo.
      (!!this.eu.has(e) && !this.eu.get(e).hasLocalMutations);
    }
    /**
     * Updates syncedDocuments, current, and limbo docs based on the given change.
     * Returns the list of changes to which docs are in limbo.
     */
    su(e) {
      e && (e.addedDocuments.forEach(((e2) => this.Ha = this.Ha.add(e2))), e.modifiedDocuments.forEach(((e2) => {
      })), e.removedDocuments.forEach(((e2) => this.Ha = this.Ha.delete(e2))), this.current = e.current);
    }
    ou() {
      if (!this.current) return [];
      const e = this.Za;
      this.Za = __PRIVATE_documentKeySet(), this.eu.forEach(((e2) => {
        this.au(e2.key) && (this.Za = this.Za.add(e2.key));
      }));
      const t = [];
      return e.forEach(((e2) => {
        this.Za.has(e2) || t.push(new __PRIVATE_RemovedLimboDocument(e2));
      })), this.Za.forEach(((n) => {
        e.has(n) || t.push(new __PRIVATE_AddedLimboDocument(n));
      })), t;
    }
    /**
     * Update the in-memory state of the current view with the state read from
     * persistence.
     *
     * We update the query view whenever a client's primary status changes:
     * - When a client transitions from primary to secondary, it can miss
     *   LocalStorage updates and its query views may temporarily not be
     *   synchronized with the state on disk.
     * - For secondary to primary transitions, the client needs to update the list
     *   of `syncedDocuments` since secondary clients update their query views
     *   based purely on synthesized RemoteEvents.
     *
     * @param queryResult.documents - The documents that match the query according
     * to the LocalStore.
     * @param queryResult.remoteKeys - The keys of the documents that match the
     * query according to the backend.
     *
     * @returns The ViewChange that resulted from this synchronization.
     */
    // PORTING NOTE: Multi-tab only.
    uu(e) {
      this.Ha = e.qs, this.Za = __PRIVATE_documentKeySet();
      const t = this.nu(e.documents);
      return this.applyChanges(
        t,
        /* limboResolutionEnabled= */
        true
      );
    }
    /**
     * Returns a view snapshot as if this query was just listened to. Contains
     * a document add for every existing document and the `fromCache` and
     * `hasPendingWrites` status of the already established view.
     */
    // PORTING NOTE: Multi-tab only.
    cu() {
      return ViewSnapshot.fromInitialDocuments(this.query, this.eu, this.mutatedKeys, 0 === this.Ya, this.hasCachedResults);
    }
  };
  var nn = "SyncEngine";
  var __PRIVATE_QueryView = class {
    constructor(e, t, n) {
      this.query = e, this.targetId = t, this.view = n;
    }
  };
  var LimboResolution = class {
    constructor(e) {
      this.key = e, /**
       * Set to true once we've received a document. This is used in
       * getRemoteKeysForTarget() and ultimately used by WatchChangeAggregator to
       * decide whether it needs to manufacture a delete event for the target once
       * the target is CURRENT.
       */
      this.lu = false;
    }
  };
  var __PRIVATE_SyncEngineImpl = class {
    constructor(e, t, n, r, i, s) {
      this.localStore = e, this.remoteStore = t, this.eventManager = n, this.sharedClientState = r, this.currentUser = i, this.maxConcurrentLimboResolutions = s, this.hu = {}, this.Pu = new ObjectMap(((e2) => __PRIVATE_canonifyQuery(e2)), __PRIVATE_queryEquals), this.Tu = /* @__PURE__ */ new Map(), /**
       * The keys of documents that are in limbo for which we haven't yet started a
       * limbo resolution query. The strings in this set are the result of calling
       * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
       *
       * The `Set` type was chosen because it provides efficient lookup and removal
       * of arbitrary elements and it also maintains insertion order, providing the
       * desired queue-like FIFO semantics.
       */
      this.Iu = /* @__PURE__ */ new Set(), /**
       * Keeps track of the target ID for each document that is in limbo with an
       * active target.
       */
      this.du = new SortedMap(DocumentKey.comparator), /**
       * Keeps track of the information about an active limbo resolution for each
       * active target ID that was started for the purpose of limbo resolution.
       */
      this.Eu = /* @__PURE__ */ new Map(), this.Au = new __PRIVATE_ReferenceSet(), /** Stores user completion handlers, indexed by User and BatchId. */
      this.Ru = {}, /** Stores user callbacks waiting for all pending writes to be acknowledged. */
      this.Vu = /* @__PURE__ */ new Map(), this.mu = __PRIVATE_TargetIdGenerator.ur(), this.onlineState = "Unknown", // The primary state is set to `true` or `false` immediately after Firestore
      // startup. In the interim, a client should only be considered primary if
      // `isPrimary` is true.
      this.fu = void 0;
    }
    get isPrimaryClient() {
      return true === this.fu;
    }
  };
  async function __PRIVATE_syncEngineListen(e, t, n = true) {
    const r = __PRIVATE_ensureWatchCallbacks(e);
    let i;
    const s = r.Pu.get(t);
    return s ? (
      // PORTING NOTE: With Multi-Tab Web, it is possible that a query view
      // already exists when EventManager calls us for the first time. This
      // happens when the primary tab is already listening to this query on
      // behalf of another tab and the user of the primary also starts listening
      // to the query. EventManager will not have an assigned target ID in this
      // case and calls `listen` to obtain this ID.
      (r.sharedClientState.addLocalQueryTarget(s.targetId), i = s.view.cu())
    ) : i = await __PRIVATE_allocateTargetAndMaybeListen(
      r,
      t,
      n,
      /** shouldInitializeView= */
      true
    ), i;
  }
  async function __PRIVATE_triggerRemoteStoreListen(e, t) {
    const n = __PRIVATE_ensureWatchCallbacks(e);
    await __PRIVATE_allocateTargetAndMaybeListen(
      n,
      t,
      /** shouldListenToRemote= */
      true,
      /** shouldInitializeView= */
      false
    );
  }
  async function __PRIVATE_allocateTargetAndMaybeListen(e, t, n, r) {
    const i = await __PRIVATE_localStoreAllocateTarget(e.localStore, __PRIVATE_queryToTarget(t)), s = i.targetId, o = e.sharedClientState.addLocalQueryTarget(s, n);
    let _;
    return r && (_ = await __PRIVATE_initializeViewAndComputeSnapshot(e, t, s, "current" === o, i.resumeToken)), e.isPrimaryClient && n && __PRIVATE_remoteStoreListen(e.remoteStore, i), _;
  }
  async function __PRIVATE_initializeViewAndComputeSnapshot(e, t, n, r, i) {
    e.gu = (t2, n2, r2) => (async function __PRIVATE_applyDocChanges(e2, t3, n3, r3) {
      let i2 = t3.view.nu(n3);
      i2.Ds && // The query has a limit and some docs were removed, so we need
      // to re-run the query against the local store to make sure we
      // didn't lose any good docs that had been past the limit.
      (i2 = await __PRIVATE_localStoreExecuteQuery(
        e2.localStore,
        t3.query,
        /* usePreviousResults= */
        false
      ).then((({ documents: e3 }) => t3.view.nu(e3, i2))));
      const s2 = r3 && r3.targetChanges.get(t3.targetId), o2 = r3 && null != r3.targetMismatches.get(t3.targetId), _2 = t3.view.applyChanges(
        i2,
        /* limboResolutionEnabled= */
        e2.isPrimaryClient,
        s2,
        o2
      );
      return __PRIVATE_updateTrackedLimbos(e2, t3.targetId, _2._u), _2.snapshot;
    })(e, t2, n2, r2);
    const s = await __PRIVATE_localStoreExecuteQuery(
      e.localStore,
      t,
      /* usePreviousResults= */
      true
    ), o = new __PRIVATE_View(t, s.qs), _ = o.nu(s.documents), a = TargetChange.createSynthesizedTargetChangeForCurrentChange(n, r && "Offline" !== e.onlineState, i), u = o.applyChanges(
      _,
      /* limboResolutionEnabled= */
      e.isPrimaryClient,
      a
    );
    __PRIVATE_updateTrackedLimbos(e, n, u._u);
    const c = new __PRIVATE_QueryView(t, n, o);
    return e.Pu.set(t, c), e.Tu.has(n) ? e.Tu.get(n).push(t) : e.Tu.set(n, [t]), u.snapshot;
  }
  async function __PRIVATE_syncEngineUnlisten(e, t, n) {
    const r = __PRIVATE_debugCast(e), i = r.Pu.get(t), s = r.Tu.get(i.targetId);
    if (s.length > 1) return r.Tu.set(i.targetId, s.filter(((e2) => !__PRIVATE_queryEquals(e2, t)))), void r.Pu.delete(t);
    if (r.isPrimaryClient) {
      r.sharedClientState.removeLocalQueryTarget(i.targetId);
      r.sharedClientState.isActiveQueryTarget(i.targetId) || await __PRIVATE_localStoreReleaseTarget(
        r.localStore,
        i.targetId,
        /*keepPersistedTargetData=*/
        false
      ).then((() => {
        r.sharedClientState.clearQueryState(i.targetId), n && __PRIVATE_remoteStoreUnlisten(r.remoteStore, i.targetId), __PRIVATE_removeAndCleanupTarget(r, i.targetId);
      })).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
    } else __PRIVATE_removeAndCleanupTarget(r, i.targetId), await __PRIVATE_localStoreReleaseTarget(
      r.localStore,
      i.targetId,
      /*keepPersistedTargetData=*/
      true
    );
  }
  async function __PRIVATE_triggerRemoteStoreUnlisten(e, t) {
    const n = __PRIVATE_debugCast(e), r = n.Pu.get(t), i = n.Tu.get(r.targetId);
    n.isPrimaryClient && 1 === i.length && // PORTING NOTE: Unregister the target ID with local Firestore client as
    // watch target.
    (n.sharedClientState.removeLocalQueryTarget(r.targetId), __PRIVATE_remoteStoreUnlisten(n.remoteStore, r.targetId));
  }
  async function __PRIVATE_syncEngineWrite(e, t, n) {
    const r = __PRIVATE_syncEngineEnsureWriteCallbacks(e);
    try {
      const e2 = await (function __PRIVATE_localStoreWriteLocally(e3, t2) {
        const n2 = __PRIVATE_debugCast(e3), r2 = Timestamp.now(), i = t2.reduce(((e4, t3) => e4.add(t3.key)), __PRIVATE_documentKeySet());
        let s, o;
        return n2.persistence.runTransaction("Locally write mutations", "readwrite", ((e4) => {
          let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
          return n2.Os.getEntries(e4, i).next(((e5) => {
            _ = e5, _.forEach(((e6, t3) => {
              t3.isValidDocument() || (a = a.add(e6));
            }));
          })).next((() => n2.localDocuments.getOverlayedDocuments(e4, _))).next(((i2) => {
            s = i2;
            const o2 = [];
            for (const e5 of t2) {
              const t3 = __PRIVATE_mutationExtractBaseValue(e5, s.get(e5.key).overlayedDocument);
              null != t3 && // NOTE: The base state should only be applied if there's some
              // existing document to override, so use a Precondition of
              // exists=true
              o2.push(new __PRIVATE_PatchMutation(e5.key, t3, __PRIVATE_extractFieldMask(t3.value.mapValue), Precondition.exists(true)));
            }
            return n2.mutationQueue.addMutationBatch(e4, r2, o2, t2);
          })).next(((t3) => {
            o = t3;
            const r3 = t3.applyToLocalDocumentSet(s, a);
            return n2.documentOverlayCache.saveOverlays(e4, t3.batchId, r3);
          }));
        })).then((() => ({
          batchId: o.batchId,
          changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(s)
        })));
      })(r.localStore, t);
      r.sharedClientState.addPendingMutation(e2.batchId), (function __PRIVATE_addMutationCallback(e3, t2, n2) {
        let r2 = e3.Ru[e3.currentUser.toKey()];
        r2 || (r2 = new SortedMap(__PRIVATE_primitiveComparator));
        r2 = r2.insert(t2, n2), e3.Ru[e3.currentUser.toKey()] = r2;
      })(r, e2.batchId, n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e2.changes), await __PRIVATE_fillWritePipeline(r.remoteStore);
    } catch (e2) {
      const t2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, "Failed to persist write");
      n.reject(t2);
    }
  }
  async function __PRIVATE_syncEngineApplyRemoteEvent(e, t) {
    const n = __PRIVATE_debugCast(e);
    try {
      const e2 = await __PRIVATE_localStoreApplyRemoteEventToLocalCache(n.localStore, t);
      t.targetChanges.forEach(((e3, t2) => {
        const r = n.Eu.get(t2);
        r && // Since this is a limbo resolution lookup, it's for a single document
        // and it could be added, modified, or removed, but not a combination.
        (__PRIVATE_hardAssert(e3.addedDocuments.size + e3.modifiedDocuments.size + e3.removedDocuments.size <= 1, 22616), e3.addedDocuments.size > 0 ? r.lu = true : e3.modifiedDocuments.size > 0 ? __PRIVATE_hardAssert(r.lu, 14607) : e3.removedDocuments.size > 0 && (__PRIVATE_hardAssert(r.lu, 42227), r.lu = false));
      })), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2, t);
    } catch (e2) {
      await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
    }
  }
  function __PRIVATE_syncEngineApplyOnlineStateChange(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    if (r.isPrimaryClient && 0 === n || !r.isPrimaryClient && 1 === n) {
      const e2 = [];
      r.Pu.forEach(((n2, r2) => {
        const i = r2.view.va(t);
        i.snapshot && e2.push(i.snapshot);
      })), (function __PRIVATE_eventManagerOnOnlineStateChange(e3, t2) {
        const n2 = __PRIVATE_debugCast(e3);
        n2.onlineState = t2;
        let r2 = false;
        n2.queries.forEach(((e4, n3) => {
          for (const e5 of n3.wa)
            e5.va(t2) && (r2 = true);
        })), r2 && __PRIVATE_raiseSnapshotsInSyncEvent(n2);
      })(r.eventManager, t), e2.length && r.hu.J_(e2), r.onlineState = t, r.isPrimaryClient && r.sharedClientState.setOnlineState(t);
    }
  }
  async function __PRIVATE_syncEngineRejectListen(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    r.sharedClientState.updateQueryState(t, "rejected", n);
    const i = r.Eu.get(t), s = i && i.key;
    if (s) {
      let e2 = new SortedMap(DocumentKey.comparator);
      e2 = e2.insert(s, MutableDocument.newNoDocument(s, SnapshotVersion.min()));
      const n2 = __PRIVATE_documentKeySet().add(s), i2 = new RemoteEvent(
        SnapshotVersion.min(),
        /* targetChanges= */
        /* @__PURE__ */ new Map(),
        /* targetMismatches= */
        new SortedMap(__PRIVATE_primitiveComparator),
        e2,
        n2
      );
      await __PRIVATE_syncEngineApplyRemoteEvent(r, i2), // Since this query failed, we won't want to manually unlisten to it.
      // We only remove it from bookkeeping after we successfully applied the
      // RemoteEvent. If `applyRemoteEvent()` throws, we want to re-listen to
      // this query when the RemoteStore restarts the Watch stream, which should
      // re-trigger the target failure.
      r.du = r.du.remove(s), r.Eu.delete(t), __PRIVATE_pumpEnqueuedLimboResolutions(r);
    } else await __PRIVATE_localStoreReleaseTarget(
      r.localStore,
      t,
      /* keepPersistedTargetData */
      false
    ).then((() => __PRIVATE_removeAndCleanupTarget(r, t, n))).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
  }
  async function __PRIVATE_syncEngineApplySuccessfulWrite(e, t) {
    const n = __PRIVATE_debugCast(e), r = t.batch.batchId;
    try {
      const e2 = await __PRIVATE_localStoreAcknowledgeBatch(n.localStore, t);
      __PRIVATE_processUserCallback(
        n,
        r,
        /*error=*/
        null
      ), __PRIVATE_triggerPendingWritesCallbacks(n, r), n.sharedClientState.updateMutationState(r, "acknowledged"), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2);
    } catch (e2) {
      await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
    }
  }
  async function __PRIVATE_syncEngineRejectFailedWrite(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    try {
      const e2 = await (function __PRIVATE_localStoreRejectBatch(e3, t2) {
        const n2 = __PRIVATE_debugCast(e3);
        return n2.persistence.runTransaction("Reject batch", "readwrite-primary", ((e4) => {
          let r2;
          return n2.mutationQueue.lookupMutationBatch(e4, t2).next(((t3) => (__PRIVATE_hardAssert(null !== t3, 37113), r2 = t3.keys(), n2.mutationQueue.removeMutationBatch(e4, t3)))).next((() => n2.mutationQueue.performConsistencyCheck(e4))).next((() => n2.documentOverlayCache.removeOverlaysForBatchId(e4, r2, t2))).next((() => n2.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e4, r2))).next((() => n2.localDocuments.getDocuments(e4, r2)));
        }));
      })(r.localStore, t);
      __PRIVATE_processUserCallback(r, t, n), __PRIVATE_triggerPendingWritesCallbacks(r, t), r.sharedClientState.updateMutationState(t, "rejected", n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e2);
    } catch (n2) {
      await __PRIVATE_ignoreIfPrimaryLeaseLoss(n2);
    }
  }
  function __PRIVATE_triggerPendingWritesCallbacks(e, t) {
    (e.Vu.get(t) || []).forEach(((e2) => {
      e2.resolve();
    })), e.Vu.delete(t);
  }
  function __PRIVATE_processUserCallback(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    let i = r.Ru[r.currentUser.toKey()];
    if (i) {
      const e2 = i.get(t);
      e2 && (n ? e2.reject(n) : e2.resolve(), i = i.remove(t)), r.Ru[r.currentUser.toKey()] = i;
    }
  }
  function __PRIVATE_removeAndCleanupTarget(e, t, n = null) {
    e.sharedClientState.removeLocalQueryTarget(t);
    for (const r of e.Tu.get(t)) e.Pu.delete(r), n && e.hu.pu(r, n);
    if (e.Tu.delete(t), e.isPrimaryClient) {
      e.Au.zr(t).forEach(((t2) => {
        e.Au.containsKey(t2) || // We removed the last reference for this key
        __PRIVATE_removeLimboTarget(e, t2);
      }));
    }
  }
  function __PRIVATE_removeLimboTarget(e, t) {
    e.Iu.delete(t.path.canonicalString());
    const n = e.du.get(t);
    null !== n && (__PRIVATE_remoteStoreUnlisten(e.remoteStore, n), e.du = e.du.remove(t), e.Eu.delete(n), __PRIVATE_pumpEnqueuedLimboResolutions(e));
  }
  function __PRIVATE_updateTrackedLimbos(e, t, n) {
    for (const r of n) if (r instanceof __PRIVATE_AddedLimboDocument) e.Au.addReference(r.key, t), __PRIVATE_trackLimboChange(e, r);
    else if (r instanceof __PRIVATE_RemovedLimboDocument) {
      __PRIVATE_logDebug(nn, "Document no longer in limbo: " + r.key), e.Au.removeReference(r.key, t);
      e.Au.containsKey(r.key) || // We removed the last reference for this key
      __PRIVATE_removeLimboTarget(e, r.key);
    } else fail(19791, {
      yu: r
    });
  }
  function __PRIVATE_trackLimboChange(e, t) {
    const n = t.key, r = n.path.canonicalString();
    e.du.get(n) || e.Iu.has(r) || (__PRIVATE_logDebug(nn, "New document in limbo: " + n), e.Iu.add(r), __PRIVATE_pumpEnqueuedLimboResolutions(e));
  }
  function __PRIVATE_pumpEnqueuedLimboResolutions(e) {
    for (; e.Iu.size > 0 && e.du.size < e.maxConcurrentLimboResolutions; ) {
      const t = e.Iu.values().next().value;
      e.Iu.delete(t);
      const n = new DocumentKey(ResourcePath.fromString(t)), r = e.mu.next();
      e.Eu.set(r, new LimboResolution(n)), e.du = e.du.insert(n, r), __PRIVATE_remoteStoreListen(e.remoteStore, new TargetData(__PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(n.path)), r, "TargetPurposeLimboResolution", __PRIVATE_ListenSequence.ue));
    }
  }
  async function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, t, n) {
    const r = __PRIVATE_debugCast(e), i = [], s = [], o = [];
    r.Pu.isEmpty() || (r.Pu.forEach(((e2, _) => {
      o.push(r.gu(_, t, n).then(((e3) => {
        var t2;
        if ((e3 || n) && r.isPrimaryClient) {
          const i2 = e3 ? !e3.fromCache : null === (t2 = null == n ? void 0 : n.targetChanges.get(_.targetId)) || void 0 === t2 ? void 0 : t2.current;
          r.sharedClientState.updateQueryState(_.targetId, i2 ? "current" : "not-current");
        }
        if (e3) {
          i.push(e3);
          const t3 = __PRIVATE_LocalViewChanges.Es(_.targetId, e3);
          s.push(t3);
        }
      })));
    })), await Promise.all(o), r.hu.J_(i), await (async function __PRIVATE_localStoreNotifyLocalViewChanges(e2, t2) {
      const n2 = __PRIVATE_debugCast(e2);
      try {
        await n2.persistence.runTransaction("notifyLocalViewChanges", "readwrite", ((e3) => PersistencePromise.forEach(t2, ((t3) => PersistencePromise.forEach(t3.Is, ((r2) => n2.persistence.referenceDelegate.addReference(e3, t3.targetId, r2))).next((() => PersistencePromise.forEach(t3.ds, ((r2) => n2.persistence.referenceDelegate.removeReference(e3, t3.targetId, r2)))))))));
      } catch (e3) {
        if (!__PRIVATE_isIndexedDbTransactionError(e3)) throw e3;
        __PRIVATE_logDebug(Qt, "Failed to update sequence numbers: " + e3);
      }
      for (const e3 of t2) {
        const t3 = e3.targetId;
        if (!e3.fromCache) {
          const e4 = n2.Fs.get(t3), r2 = e4.snapshotVersion, i2 = e4.withLastLimboFreeSnapshotVersion(r2);
          n2.Fs = n2.Fs.insert(t3, i2);
        }
      }
    })(r.localStore, s));
  }
  async function __PRIVATE_syncEngineHandleCredentialChange(e, t) {
    const n = __PRIVATE_debugCast(e);
    if (!n.currentUser.isEqual(t)) {
      __PRIVATE_logDebug(nn, "User change. New user:", t.toKey());
      const e2 = await __PRIVATE_localStoreHandleUserChange(n.localStore, t);
      n.currentUser = t, // Fails tasks waiting for pending writes requested by previous user.
      (function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e3, t2) {
        e3.Vu.forEach(((e4) => {
          e4.forEach(((e5) => {
            e5.reject(new FirestoreError(N.CANCELLED, t2));
          }));
        })), e3.Vu.clear();
      })(n, "'waitForPendingWrites' promise is rejected due to a user change."), // TODO(b/114226417): Consider calling this only in the primary tab.
      n.sharedClientState.handleUserChange(t, e2.removedBatchIds, e2.addedBatchIds), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2.Bs);
    }
  }
  function __PRIVATE_syncEngineGetRemoteKeysForTarget(e, t) {
    const n = __PRIVATE_debugCast(e), r = n.Eu.get(t);
    if (r && r.lu) return __PRIVATE_documentKeySet().add(r.key);
    {
      let e2 = __PRIVATE_documentKeySet();
      const r2 = n.Tu.get(t);
      if (!r2) return e2;
      for (const t2 of r2) {
        const r3 = n.Pu.get(t2);
        e2 = e2.unionWith(r3.view.tu);
      }
      return e2;
    }
  }
  function __PRIVATE_ensureWatchCallbacks(e) {
    const t = __PRIVATE_debugCast(e);
    return t.remoteStore.remoteSyncer.applyRemoteEvent = __PRIVATE_syncEngineApplyRemoteEvent.bind(null, t), t.remoteStore.remoteSyncer.getRemoteKeysForTarget = __PRIVATE_syncEngineGetRemoteKeysForTarget.bind(null, t), t.remoteStore.remoteSyncer.rejectListen = __PRIVATE_syncEngineRejectListen.bind(null, t), t.hu.J_ = __PRIVATE_eventManagerOnWatchChange.bind(null, t.eventManager), t.hu.pu = __PRIVATE_eventManagerOnWatchError.bind(null, t.eventManager), t;
  }
  function __PRIVATE_syncEngineEnsureWriteCallbacks(e) {
    const t = __PRIVATE_debugCast(e);
    return t.remoteStore.remoteSyncer.applySuccessfulWrite = __PRIVATE_syncEngineApplySuccessfulWrite.bind(null, t), t.remoteStore.remoteSyncer.rejectFailedWrite = __PRIVATE_syncEngineRejectFailedWrite.bind(null, t), t;
  }
  var __PRIVATE_MemoryOfflineComponentProvider = class {
    constructor() {
      this.kind = "memory", this.synchronizeTabs = false;
    }
    async initialize(e) {
      this.serializer = __PRIVATE_newSerializer(e.databaseInfo.databaseId), this.sharedClientState = this.bu(e), this.persistence = this.Du(e), await this.persistence.start(), this.localStore = this.vu(e), this.gcScheduler = this.Cu(e, this.localStore), this.indexBackfillerScheduler = this.Fu(e, this.localStore);
    }
    Cu(e, t) {
      return null;
    }
    Fu(e, t) {
      return null;
    }
    vu(e) {
      return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine(), e.initialUser, this.serializer);
    }
    Du(e) {
      return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.Vi, this.serializer);
    }
    bu(e) {
      return new __PRIVATE_MemorySharedClientState();
    }
    async terminate() {
      var e, t;
      null === (e = this.gcScheduler) || void 0 === e || e.stop(), null === (t = this.indexBackfillerScheduler) || void 0 === t || t.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
    }
  };
  __PRIVATE_MemoryOfflineComponentProvider.provider = {
    build: () => new __PRIVATE_MemoryOfflineComponentProvider()
  };
  var __PRIVATE_LruGcMemoryOfflineComponentProvider = class extends __PRIVATE_MemoryOfflineComponentProvider {
    constructor(e) {
      super(), this.cacheSizeBytes = e;
    }
    Cu(e, t) {
      __PRIVATE_hardAssert(this.persistence.referenceDelegate instanceof __PRIVATE_MemoryLruDelegate, 46915);
      const n = this.persistence.referenceDelegate.garbageCollector;
      return new __PRIVATE_LruScheduler(n, e.asyncQueue, t);
    }
    Du(e) {
      const t = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
      return new __PRIVATE_MemoryPersistence(((e2) => __PRIVATE_MemoryLruDelegate.Vi(e2, t)), this.serializer);
    }
  };
  var OnlineComponentProvider = class {
    async initialize(e, t) {
      this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(
        t,
        /* startAsPrimary=*/
        !e.synchronizeTabs
      ), this.sharedClientState.onlineStateHandler = (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
        this.syncEngine,
        e2,
        1
        /* OnlineStateSource.SharedClientState */
      ), this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), await __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
    }
    createEventManager(e) {
      return (function __PRIVATE_newEventManager() {
        return new __PRIVATE_EventManagerImpl();
      })();
    }
    createDatastore(e) {
      const t = __PRIVATE_newSerializer(e.databaseInfo.databaseId), n = (function __PRIVATE_newConnection(e2) {
        return new __PRIVATE_WebChannelConnection(e2);
      })(e.databaseInfo);
      return (function __PRIVATE_newDatastore(e2, t2, n2, r) {
        return new __PRIVATE_DatastoreImpl(e2, t2, n2, r);
      })(e.authCredentials, e.appCheckCredentials, n, t);
    }
    createRemoteStore(e) {
      return (function __PRIVATE_newRemoteStore(e2, t, n, r, i) {
        return new __PRIVATE_RemoteStoreImpl(e2, t, n, r, i);
      })(this.localStore, this.datastore, e.asyncQueue, ((e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
        this.syncEngine,
        e2,
        0
        /* OnlineStateSource.RemoteStore */
      )), (function __PRIVATE_newConnectivityMonitor() {
        return __PRIVATE_BrowserConnectivityMonitor.C() ? new __PRIVATE_BrowserConnectivityMonitor() : new __PRIVATE_NoopConnectivityMonitor();
      })());
    }
    createSyncEngine(e, t) {
      return (function __PRIVATE_newSyncEngine(e2, t2, n, r, i, s, o) {
        const _ = new __PRIVATE_SyncEngineImpl(e2, t2, n, r, i, s);
        return o && (_.fu = true), _;
      })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
    }
    async terminate() {
      var e, t;
      await (async function __PRIVATE_remoteStoreShutdown(e2) {
        const t2 = __PRIVATE_debugCast(e2);
        __PRIVATE_logDebug(Xt, "RemoteStore shutting down."), t2.Ia.add(
          5
          /* OfflineCause.Shutdown */
        ), await __PRIVATE_disableNetworkInternal(t2), t2.Ea.shutdown(), // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
        // triggering spurious listener events with cached data, etc.
        t2.Aa.set(
          "Unknown"
          /* OnlineState.Unknown */
        );
      })(this.remoteStore), null === (e = this.datastore) || void 0 === e || e.terminate(), null === (t = this.eventManager) || void 0 === t || t.terminate();
    }
  };
  OnlineComponentProvider.provider = {
    build: () => new OnlineComponentProvider()
  };
  var __PRIVATE_AsyncObserver = class {
    constructor(e) {
      this.observer = e, /**
       * When set to true, will not raise future events. Necessary to deal with
       * async detachment of listener.
       */
      this.muted = false;
    }
    next(e) {
      this.muted || this.observer.next && this.xu(this.observer.next, e);
    }
    error(e) {
      this.muted || (this.observer.error ? this.xu(this.observer.error, e) : __PRIVATE_logError("Uncaught Error in snapshot listener:", e.toString()));
    }
    Ou() {
      this.muted = true;
    }
    xu(e, t) {
      setTimeout((() => {
        this.muted || e(t);
      }), 0);
    }
  };
  var rn = "FirestoreClient";
  var FirestoreClient = class {
    constructor(e, t, n, r, i) {
      this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this.databaseInfo = r, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this._uninitializedComponentsProvider = i, this.authCredentials.start(n, (async (e2) => {
        __PRIVATE_logDebug(rn, "Received user=", e2.uid), await this.authCredentialListener(e2), this.user = e2;
      })), this.appCheckCredentials.start(n, ((e2) => (__PRIVATE_logDebug(rn, "Received new app check token=", e2), this.appCheckCredentialListener(e2, this.user))));
    }
    get configuration() {
      return {
        asyncQueue: this.asyncQueue,
        databaseInfo: this.databaseInfo,
        clientId: this.clientId,
        authCredentials: this.authCredentials,
        appCheckCredentials: this.appCheckCredentials,
        initialUser: this.user,
        maxConcurrentLimboResolutions: 100
      };
    }
    setCredentialChangeListener(e) {
      this.authCredentialListener = e;
    }
    setAppCheckTokenChangeListener(e) {
      this.appCheckCredentialListener = e;
    }
    terminate() {
      this.asyncQueue.enterRestrictedMode();
      const e = new __PRIVATE_Deferred();
      return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async () => {
        try {
          this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), // The credentials provider must be terminated after shutting down the
          // RemoteStore as it will prevent the RemoteStore from retrieving auth
          // tokens.
          this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
        } catch (t) {
          const n = __PRIVATE_wrapInUserErrorIfRecoverable(t, "Failed to shutdown persistence");
          e.reject(n);
        }
      })), e.promise;
    }
  };
  async function __PRIVATE_setOfflineComponentProvider(e, t) {
    e.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(rn, "Initializing OfflineComponentProvider");
    const n = e.configuration;
    await t.initialize(n);
    let r = n.initialUser;
    e.setCredentialChangeListener((async (e2) => {
      r.isEqual(e2) || (await __PRIVATE_localStoreHandleUserChange(t.localStore, e2), r = e2);
    })), t.persistence.setDatabaseDeletedListener((() => {
      __PRIVATE_logWarn("Terminating Firestore due to IndexedDb database deletion"), e.terminate().then((() => {
        __PRIVATE_logDebug("Terminating Firestore due to IndexedDb database deletion completed successfully");
      })).catch(((e2) => {
        __PRIVATE_logWarn("Terminating Firestore due to IndexedDb database deletion failed", e2);
      }));
    })), e._offlineComponents = t;
  }
  async function __PRIVATE_setOnlineComponentProvider(e, t) {
    e.asyncQueue.verifyOperationInProgress();
    const n = await __PRIVATE_ensureOfflineComponents(e);
    __PRIVATE_logDebug(rn, "Initializing OnlineComponentProvider"), await t.initialize(n, e.configuration), // The CredentialChangeListener of the online component provider takes
    // precedence over the offline component provider.
    e.setCredentialChangeListener(((e2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, e2))), e.setAppCheckTokenChangeListener(((e2, n2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, n2))), e._onlineComponents = t;
  }
  async function __PRIVATE_ensureOfflineComponents(e) {
    if (!e._offlineComponents) if (e._uninitializedComponentsProvider) {
      __PRIVATE_logDebug(rn, "Using user provided OfflineComponentProvider");
      try {
        await __PRIVATE_setOfflineComponentProvider(e, e._uninitializedComponentsProvider._offline);
      } catch (t) {
        const n = t;
        if (!(function __PRIVATE_canFallbackFromIndexedDbError(e2) {
          return "FirebaseError" === e2.name ? e2.code === N.FAILED_PRECONDITION || e2.code === N.UNIMPLEMENTED : !("undefined" != typeof DOMException && e2 instanceof DOMException) || // When the browser is out of quota we could get either quota exceeded
          // or an aborted error depending on whether the error happened during
          // schema migration.
          22 === e2.code || 20 === e2.code || // Firefox Private Browsing mode disables IndexedDb and returns
          // INVALID_STATE for any usage.
          11 === e2.code;
        })(n)) throw n;
        __PRIVATE_logWarn("Error using user provided cache. Falling back to memory cache: " + n), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_MemoryOfflineComponentProvider());
      }
    } else __PRIVATE_logDebug(rn, "Using default OfflineComponentProvider"), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_LruGcMemoryOfflineComponentProvider(void 0));
    return e._offlineComponents;
  }
  async function __PRIVATE_ensureOnlineComponents(e) {
    return e._onlineComponents || (e._uninitializedComponentsProvider ? (__PRIVATE_logDebug(rn, "Using user provided OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, e._uninitializedComponentsProvider._online)) : (__PRIVATE_logDebug(rn, "Using default OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, new OnlineComponentProvider()))), e._onlineComponents;
  }
  function __PRIVATE_getSyncEngine(e) {
    return __PRIVATE_ensureOnlineComponents(e).then(((e2) => e2.syncEngine));
  }
  async function __PRIVATE_getEventManager(e) {
    const t = await __PRIVATE_ensureOnlineComponents(e), n = t.eventManager;
    return n.onListen = __PRIVATE_syncEngineListen.bind(null, t.syncEngine), n.onUnlisten = __PRIVATE_syncEngineUnlisten.bind(null, t.syncEngine), n.onFirstRemoteStoreListen = __PRIVATE_triggerRemoteStoreListen.bind(null, t.syncEngine), n.onLastRemoteStoreUnlisten = __PRIVATE_triggerRemoteStoreUnlisten.bind(null, t.syncEngine), n;
  }
  function __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(e, t, n = {}) {
    const r = new __PRIVATE_Deferred();
    return e.asyncQueue.enqueueAndForget((async () => (function __PRIVATE_readDocumentViaSnapshotListener(e2, t2, n2, r2, i) {
      const s = new __PRIVATE_AsyncObserver({
        next: (_) => {
          s.Ou(), t2.enqueueAndForget((() => __PRIVATE_eventManagerUnlisten(e2, o)));
          const a = _.docs.has(n2);
          !a && _.fromCache ? (
            // TODO(dimond): If we're online and the document doesn't
            // exist then we resolve with a doc.exists set to false. If
            // we're offline however, we reject the Promise in this
            // case. Two options: 1) Cache the negative response from
            // the server so we can deliver that even when you're
            // offline 2) Actually reject the Promise in the online case
            // if the document doesn't exist.
            i.reject(new FirestoreError(N.UNAVAILABLE, "Failed to get document because the client is offline."))
          ) : a && _.fromCache && r2 && "server" === r2.source ? i.reject(new FirestoreError(N.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : i.resolve(_);
        },
        error: (e3) => i.reject(e3)
      }), o = new __PRIVATE_QueryListener(__PRIVATE_newQueryForPath(n2.path), s, {
        includeMetadataChanges: true,
        ka: true
      });
      return __PRIVATE_eventManagerListen(e2, o);
    })(await __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r))), r.promise;
  }
  function __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(e, t, n = {}) {
    const r = new __PRIVATE_Deferred();
    return e.asyncQueue.enqueueAndForget((async () => (function __PRIVATE_executeQueryViaSnapshotListener(e2, t2, n2, r2, i) {
      const s = new __PRIVATE_AsyncObserver({
        next: (n3) => {
          s.Ou(), t2.enqueueAndForget((() => __PRIVATE_eventManagerUnlisten(e2, o))), n3.fromCache && "server" === r2.source ? i.reject(new FirestoreError(N.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n3);
        },
        error: (e3) => i.reject(e3)
      }), o = new __PRIVATE_QueryListener(n2, s, {
        includeMetadataChanges: true,
        ka: true
      });
      return __PRIVATE_eventManagerListen(e2, o);
    })(await __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r))), r.promise;
  }
  function __PRIVATE_cloneLongPollingOptions(e) {
    const t = {};
    return void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t;
  }
  var sn = /* @__PURE__ */ new Map();
  var on = "firestore.googleapis.com";
  var _n = true;
  var FirestoreSettingsImpl = class {
    constructor(e) {
      var t, n;
      if (void 0 === e.host) {
        if (void 0 !== e.ssl) throw new FirestoreError(N.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
        this.host = on, this.ssl = _n;
      } else this.host = e.host, this.ssl = null !== (t = e.ssl) && void 0 !== t ? t : _n;
      if (this.isUsingEmulator = void 0 !== e.emulatorOptions, this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, void 0 === e.cacheSizeBytes) this.cacheSizeBytes = Mt;
      else {
        if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < Ot) throw new FirestoreError(N.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
        this.cacheSizeBytes = e.cacheSizeBytes;
      }
      __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : void 0 === e.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : (
        // For backwards compatibility, coerce the value to boolean even though
        // the TypeScript compiler has narrowed the type to boolean already.
        // noinspection PointlessBooleanExpressionJS
        this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling
      ), this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(null !== (n = e.experimentalLongPollingOptions) && void 0 !== n ? n : {}), (function __PRIVATE_validateLongPollingOptions(e2) {
        if (void 0 !== e2.timeoutSeconds) {
          if (isNaN(e2.timeoutSeconds)) throw new FirestoreError(N.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (must not be NaN)`);
          if (e2.timeoutSeconds < 5) throw new FirestoreError(N.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (minimum allowed value is 5)`);
          if (e2.timeoutSeconds > 30) throw new FirestoreError(N.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (maximum allowed value is 30)`);
        }
      })(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
    }
    isEqual(e) {
      return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && (function __PRIVATE_longPollingOptionsEqual(e2, t) {
        return e2.timeoutSeconds === t.timeoutSeconds;
      })(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
    }
  };
  var Firestore$1 = class {
    /** @hideconstructor */
    constructor(e, t, n, r) {
      this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, this._app = r, /**
       * Whether it's a Firestore or Firestore Lite instance.
       */
      this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false, this._emulatorOptions = {}, // A task that is assigned when the terminate() is invoked and resolved when
      // all components have shut down. Otherwise, Firestore is not terminated,
      // which can mean either the FirestoreClient is in the process of starting,
      // or restarting.
      this._terminateTask = "notTerminated";
    }
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */
    get app() {
      if (!this._app) throw new FirestoreError(N.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
      return this._app;
    }
    get _initialized() {
      return this._settingsFrozen;
    }
    get _terminated() {
      return "notTerminated" !== this._terminateTask;
    }
    _setSettings(e) {
      if (this._settingsFrozen) throw new FirestoreError(N.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
      this._settings = new FirestoreSettingsImpl(e), this._emulatorOptions = e.emulatorOptions || {}, void 0 !== e.credentials && (this._authCredentials = (function __PRIVATE_makeAuthCredentialsProvider(e2) {
        if (!e2) return new __PRIVATE_EmptyAuthCredentialsProvider();
        switch (e2.type) {
          case "firstParty":
            return new __PRIVATE_FirstPartyAuthCredentialsProvider(e2.sessionIndex || "0", e2.iamToken || null, e2.authTokenFactory || null);
          case "provider":
            return e2.client;
          default:
            throw new FirestoreError(N.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
        }
      })(e.credentials));
    }
    _getSettings() {
      return this._settings;
    }
    _getEmulatorOptions() {
      return this._emulatorOptions;
    }
    _freezeSettings() {
      return this._settingsFrozen = true, this._settings;
    }
    _delete() {
      return "notTerminated" === this._terminateTask && (this._terminateTask = this._terminate()), this._terminateTask;
    }
    async _restart() {
      "notTerminated" === this._terminateTask ? await this._terminate() : this._terminateTask = "notTerminated";
    }
    /** Returns a JSON-serializable representation of this `Firestore` instance. */
    toJSON() {
      return {
        app: this._app,
        databaseId: this._databaseId,
        settings: this._settings
      };
    }
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */
    _terminate() {
      return (function __PRIVATE_removeComponents(e) {
        const t = sn.get(e);
        t && (__PRIVATE_logDebug("ComponentProvider", "Removing Datastore"), sn.delete(e), t.terminate());
      })(this), Promise.resolve();
    }
  };
  function connectFirestoreEmulator(e, t, n, r = {}) {
    var i;
    e = __PRIVATE_cast(e, Firestore$1);
    const s = isCloudWorkstation(t), o = e._getSettings(), _ = Object.assign(Object.assign({}, o), {
      emulatorOptions: e._getEmulatorOptions()
    }), a = `${t}:${n}`;
    s && (pingServer(`https://${a}`), updateEmulatorBanner("Firestore", true)), o.host !== on && o.host !== a && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
    const u = Object.assign(Object.assign({}, o), {
      host: a,
      ssl: s,
      emulatorOptions: r
    });
    if (!deepEqual(u, _) && (e._setSettings(u), r.mockUserToken)) {
      let t2, n2;
      if ("string" == typeof r.mockUserToken) t2 = r.mockUserToken, n2 = User.MOCK_USER;
      else {
        t2 = createMockUserToken(r.mockUserToken, null === (i = e._app) || void 0 === i ? void 0 : i.options.projectId);
        const s2 = r.mockUserToken.sub || r.mockUserToken.user_id;
        if (!s2) throw new FirestoreError(N.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
        n2 = new User(s2);
      }
      e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t2, n2));
    }
  }
  var Query = class _Query {
    // This is the lite version of the Query class in the main SDK.
    /** @hideconstructor protected */
    constructor(e, t, n) {
      this.converter = t, this._query = n, /** The type of this Firestore reference. */
      this.type = "query", this.firestore = e;
    }
    withConverter(e) {
      return new _Query(this.firestore, e, this._query);
    }
  };
  var DocumentReference = class _DocumentReference {
    /** @hideconstructor */
    constructor(e, t, n) {
      this.converter = t, this._key = n, /** The type of this Firestore reference. */
      this.type = "document", this.firestore = e;
    }
    get _path() {
      return this._key.path;
    }
    /**
     * The document's identifier within its collection.
     */
    get id() {
      return this._key.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */
    get path() {
      return this._key.path.canonicalString();
    }
    /**
     * The collection this `DocumentReference` belongs to.
     */
    get parent() {
      return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
    }
    withConverter(e) {
      return new _DocumentReference(this.firestore, e, this._key);
    }
    /**
     * Returns a JSON-serializable representation of this `DocumentReference` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON() {
      return {
        type: _DocumentReference._jsonSchemaVersion,
        referencePath: this._key.toString()
      };
    }
    static fromJSON(e, t, n) {
      if (__PRIVATE_validateJSON(t, _DocumentReference._jsonSchema)) return new _DocumentReference(e, n || null, new DocumentKey(ResourcePath.fromString(t.referencePath)));
    }
  };
  DocumentReference._jsonSchemaVersion = "firestore/documentReference/1.0", DocumentReference._jsonSchema = {
    type: property("string", DocumentReference._jsonSchemaVersion),
    referencePath: property("string")
  };
  var CollectionReference = class _CollectionReference extends Query {
    /** @hideconstructor */
    constructor(e, t, n) {
      super(e, t, __PRIVATE_newQueryForPath(n)), this._path = n, /** The type of this Firestore reference. */
      this.type = "collection";
    }
    /** The collection's identifier. */
    get id() {
      return this._query.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */
    get path() {
      return this._query.path.canonicalString();
    }
    /**
     * A reference to the containing `DocumentReference` if this is a
     * subcollection. If this isn't a subcollection, the reference is null.
     */
    get parent() {
      const e = this._path.popLast();
      return e.isEmpty() ? null : new DocumentReference(
        this.firestore,
        /* converter= */
        null,
        new DocumentKey(e)
      );
    }
    withConverter(e) {
      return new _CollectionReference(this.firestore, e, this._path);
    }
  };
  function collection(e, t, ...n) {
    if (e = getModularInstance(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t), e instanceof Firestore$1) {
      const r = ResourcePath.fromString(t, ...n);
      return __PRIVATE_validateCollectionPath(r), new CollectionReference(
        e,
        /* converter= */
        null,
        r
      );
    }
    {
      if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(N.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
      const r = e._path.child(ResourcePath.fromString(t, ...n));
      return __PRIVATE_validateCollectionPath(r), new CollectionReference(
        e.firestore,
        /* converter= */
        null,
        r
      );
    }
  }
  function doc(e, t, ...n) {
    if (e = getModularInstance(e), // We allow omission of 'pathString' but explicitly prohibit passing in both
    // 'undefined' and 'null'.
    1 === arguments.length && (t = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t), e instanceof Firestore$1) {
      const r = ResourcePath.fromString(t, ...n);
      return __PRIVATE_validateDocumentPath(r), new DocumentReference(
        e,
        /* converter= */
        null,
        new DocumentKey(r)
      );
    }
    {
      if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(N.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
      const r = e._path.child(ResourcePath.fromString(t, ...n));
      return __PRIVATE_validateDocumentPath(r), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new DocumentKey(r));
    }
  }
  var an = "AsyncQueue";
  var __PRIVATE_AsyncQueueImpl = class {
    constructor(e = Promise.resolve()) {
      this.Zu = [], // Is this AsyncQueue being shut down? Once it is set to true, it will not
      // be changed again.
      this.Xu = false, // Operations scheduled to be queued in the future. Operations are
      // automatically removed after they are run or canceled.
      this.ec = [], // visible for testing
      this.tc = null, // Flag set while there's an outstanding AsyncQueue operation, used for
      // assertion sanity-checks.
      this.nc = false, // Enabled during shutdown on Safari to prevent future access to IndexedDB.
      this.rc = false, // List of TimerIds to fast-forward delays for.
      this.sc = [], // Backoff timer used to schedule retries for retryable operations
      this.F_ = new __PRIVATE_ExponentialBackoff(
        this,
        "async_queue_retry"
        /* TimerId.AsyncQueueRetry */
      ), // Visibility handler that triggers an immediate retry of all retryable
      // operations. Meant to speed up recovery when we regain file system access
      // after page comes into foreground.
      this.oc = () => {
        const e2 = getDocument();
        e2 && __PRIVATE_logDebug(an, "Visibility state changed to " + e2.visibilityState), this.F_.y_();
      }, this._c = e;
      const t = getDocument();
      t && "function" == typeof t.addEventListener && t.addEventListener("visibilitychange", this.oc);
    }
    get isShuttingDown() {
      return this.Xu;
    }
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */
    enqueueAndForget(e) {
      this.enqueue(e);
    }
    enqueueAndForgetEvenWhileRestricted(e) {
      this.ac(), // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.uc(e);
    }
    enterRestrictedMode(e) {
      if (!this.Xu) {
        this.Xu = true, this.rc = e || false;
        const t = getDocument();
        t && "function" == typeof t.removeEventListener && t.removeEventListener("visibilitychange", this.oc);
      }
    }
    enqueue(e) {
      if (this.ac(), this.Xu)
        return new Promise((() => {
        }));
      const t = new __PRIVATE_Deferred();
      return this.uc((() => this.Xu && this.rc ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise))).then((() => t.promise));
    }
    enqueueRetryable(e) {
      this.enqueueAndForget((() => (this.Zu.push(e), this.cc())));
    }
    /**
     * Runs the next operation from the retryable queue. If the operation fails,
     * reschedules with backoff.
     */
    async cc() {
      if (0 !== this.Zu.length) {
        try {
          await this.Zu[0](), this.Zu.shift(), this.F_.reset();
        } catch (e) {
          if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
          __PRIVATE_logDebug(an, "Operation failed with retryable error: " + e);
        }
        this.Zu.length > 0 && // If there are additional operations, we re-schedule `retryNextOp()`.
        // This is necessary to run retryable operations that failed during
        // their initial attempt since we don't know whether they are already
        // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
        // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
        // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
        // call scheduled here.
        // Since `backoffAndRun()` cancels an existing backoff and schedules a
        // new backoff on every call, there is only ever a single additional
        // operation in the queue.
        this.F_.g_((() => this.cc()));
      }
    }
    uc(e) {
      const t = this._c.then((() => (this.nc = true, e().catch(((e2) => {
        this.tc = e2, this.nc = false;
        throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", __PRIVATE_getMessageOrStack(e2)), e2;
      })).then(((e2) => (this.nc = false, e2))))));
      return this._c = t, t;
    }
    enqueueAfterDelay(e, t, n) {
      this.ac(), // Fast-forward delays for timerIds that have been overridden.
      this.sc.indexOf(e) > -1 && (t = 0);
      const r = DelayedOperation.createAndSchedule(this, e, t, n, ((e2) => this.lc(e2)));
      return this.ec.push(r), r;
    }
    ac() {
      this.tc && fail(47125, {
        hc: __PRIVATE_getMessageOrStack(this.tc)
      });
    }
    verifyOperationInProgress() {
    }
    /**
     * Waits until all currently queued tasks are finished executing. Delayed
     * operations are not run.
     */
    async Pc() {
      let e;
      do {
        e = this._c, await e;
      } while (e !== this._c);
    }
    /**
     * For Tests: Determine if a delayed operation with a particular TimerId
     * exists.
     */
    Tc(e) {
      for (const t of this.ec) if (t.timerId === e) return true;
      return false;
    }
    /**
     * For Tests: Runs some or all delayed operations early.
     *
     * @param lastTimerId - Delayed operations up to and including this TimerId
     * will be drained. Pass TimerId.All to run all delayed operations.
     * @returns a Promise that resolves once all operations have been run.
     */
    Ic(e) {
      return this.Pc().then((() => {
        this.ec.sort(((e2, t) => e2.targetTimeMs - t.targetTimeMs));
        for (const t of this.ec) if (t.skipDelay(), "all" !== e && t.timerId === e) break;
        return this.Pc();
      }));
    }
    /**
     * For Tests: Skip all subsequent delays for a timer id.
     */
    dc(e) {
      this.sc.push(e);
    }
    /** Called once a DelayedOperation is run or canceled. */
    lc(e) {
      const t = this.ec.indexOf(e);
      this.ec.splice(t, 1);
    }
  };
  function __PRIVATE_getMessageOrStack(e) {
    let t = e.message || "";
    return e.stack && (t = e.stack.includes(e.message) ? e.stack : e.message + "\n" + e.stack), t;
  }
  var Firestore = class extends Firestore$1 {
    /** @hideconstructor */
    constructor(e, t, n, r) {
      super(e, t, n, r), /**
       * Whether it's a {@link Firestore} or Firestore Lite instance.
       */
      this.type = "firestore", this._queue = new __PRIVATE_AsyncQueueImpl(), this._persistenceKey = (null == r ? void 0 : r.name) || "[DEFAULT]";
    }
    async _terminate() {
      if (this._firestoreClient) {
        const e = this._firestoreClient.terminate();
        this._queue = new __PRIVATE_AsyncQueueImpl(e), this._firestoreClient = void 0, await e;
      }
    }
  };
  function getFirestore(e, n) {
    const r = "object" == typeof e ? e : getApp(), i = "string" == typeof e ? e : n || ut, s = _getProvider(r, "firestore").getImmediate({
      identifier: i
    });
    if (!s._initialized) {
      const e2 = getDefaultEmulatorHostnameAndPort("firestore");
      e2 && connectFirestoreEmulator(s, ...e2);
    }
    return s;
  }
  function ensureFirestoreConfigured(e) {
    if (e._terminated) throw new FirestoreError(N.FAILED_PRECONDITION, "The client has already been terminated.");
    return e._firestoreClient || __PRIVATE_configureFirestore(e), e._firestoreClient;
  }
  function __PRIVATE_configureFirestore(e) {
    var t, n, r;
    const i = e._freezeSettings(), s = (function __PRIVATE_makeDatabaseInfo(e2, t2, n2, r2) {
      return new DatabaseInfo(e2, t2, n2, r2.host, r2.ssl, r2.experimentalForceLongPolling, r2.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(r2.experimentalLongPollingOptions), r2.useFetchStreams, r2.isUsingEmulator);
    })(e._databaseId, (null === (t = e._app) || void 0 === t ? void 0 : t.options.appId) || "", e._persistenceKey, i);
    e._componentsProvider || (null === (n = i.localCache) || void 0 === n ? void 0 : n._offlineComponentProvider) && (null === (r = i.localCache) || void 0 === r ? void 0 : r._onlineComponentProvider) && (e._componentsProvider = {
      _offline: i.localCache._offlineComponentProvider,
      _online: i.localCache._onlineComponentProvider
    }), e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, s, e._componentsProvider && (function __PRIVATE_buildComponentProvider(e2) {
      const t2 = null == e2 ? void 0 : e2._online.build();
      return {
        _offline: null == e2 ? void 0 : e2._offline.build(t2),
        _online: t2
      };
    })(e._componentsProvider));
  }
  var Bytes = class _Bytes {
    /** @hideconstructor */
    constructor(e) {
      this._byteString = e;
    }
    /**
     * Creates a new `Bytes` object from the given Base64 string, converting it to
     * bytes.
     *
     * @param base64 - The Base64 string used to create the `Bytes` object.
     */
    static fromBase64String(e) {
      try {
        return new _Bytes(ByteString.fromBase64String(e));
      } catch (e2) {
        throw new FirestoreError(N.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e2);
      }
    }
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */
    static fromUint8Array(e) {
      return new _Bytes(ByteString.fromUint8Array(e));
    }
    /**
     * Returns the underlying bytes as a Base64-encoded string.
     *
     * @returns The Base64-encoded string created from the `Bytes` object.
     */
    toBase64() {
      return this._byteString.toBase64();
    }
    /**
     * Returns the underlying bytes in a new `Uint8Array`.
     *
     * @returns The Uint8Array created from the `Bytes` object.
     */
    toUint8Array() {
      return this._byteString.toUint8Array();
    }
    /**
     * Returns a string representation of the `Bytes` object.
     *
     * @returns A string representation of the `Bytes` object.
     */
    toString() {
      return "Bytes(base64: " + this.toBase64() + ")";
    }
    /**
     * Returns true if this `Bytes` object is equal to the provided one.
     *
     * @param other - The `Bytes` object to compare against.
     * @returns true if this `Bytes` object is equal to the provided one.
     */
    isEqual(e) {
      return this._byteString.isEqual(e._byteString);
    }
    /**
     * Returns a JSON-serializable representation of this `Bytes` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON() {
      return {
        type: _Bytes._jsonSchemaVersion,
        bytes: this.toBase64()
      };
    }
    /**
     * Builds a `Bytes` instance from a JSON object created by {@link Bytes.toJSON}.
     *
     * @param json a JSON object represention of a `Bytes` instance
     * @returns an instance of {@link Bytes} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(e) {
      if (__PRIVATE_validateJSON(e, _Bytes._jsonSchema)) return _Bytes.fromBase64String(e.bytes);
    }
  };
  Bytes._jsonSchemaVersion = "firestore/bytes/1.0", Bytes._jsonSchema = {
    type: property("string", Bytes._jsonSchemaVersion),
    bytes: property("string")
  };
  var FieldPath = class {
    /**
     * Creates a `FieldPath` from the provided field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     * @param fieldNames - A list of field names.
     */
    constructor(...e) {
      for (let t = 0; t < e.length; ++t) if (0 === e[t].length) throw new FirestoreError(N.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
      this._internalPath = new FieldPath$1(e);
    }
    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other - The `FieldPath` to compare against.
     * @returns true if this `FieldPath` is equal to the provided one.
     */
    isEqual(e) {
      return this._internalPath.isEqual(e._internalPath);
    }
  };
  var FieldValue = class {
    /**
     * @param _methodName - The public API endpoint that returns this class.
     * @hideconstructor
     */
    constructor(e) {
      this._methodName = e;
    }
  };
  var GeoPoint = class _GeoPoint {
    /**
     * Creates a new immutable `GeoPoint` object with the provided latitude and
     * longitude values.
     * @param latitude - The latitude as number between -90 and 90.
     * @param longitude - The longitude as number between -180 and 180.
     */
    constructor(e, t) {
      if (!isFinite(e) || e < -90 || e > 90) throw new FirestoreError(N.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
      if (!isFinite(t) || t < -180 || t > 180) throw new FirestoreError(N.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
      this._lat = e, this._long = t;
    }
    /**
     * The latitude of this `GeoPoint` instance.
     */
    get latitude() {
      return this._lat;
    }
    /**
     * The longitude of this `GeoPoint` instance.
     */
    get longitude() {
      return this._long;
    }
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */
    isEqual(e) {
      return this._lat === e._lat && this._long === e._long;
    }
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */
    _compareTo(e) {
      return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
    }
    /**
     * Returns a JSON-serializable representation of this `GeoPoint` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON() {
      return {
        latitude: this._lat,
        longitude: this._long,
        type: _GeoPoint._jsonSchemaVersion
      };
    }
    /**
     * Builds a `GeoPoint` instance from a JSON object created by {@link GeoPoint.toJSON}.
     *
     * @param json a JSON object represention of a `GeoPoint` instance
     * @returns an instance of {@link GeoPoint} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(e) {
      if (__PRIVATE_validateJSON(e, _GeoPoint._jsonSchema)) return new _GeoPoint(e.latitude, e.longitude);
    }
  };
  GeoPoint._jsonSchemaVersion = "firestore/geoPoint/1.0", GeoPoint._jsonSchema = {
    type: property("string", GeoPoint._jsonSchemaVersion),
    latitude: property("number"),
    longitude: property("number")
  };
  var VectorValue = class _VectorValue {
    /**
     * @private
     * @internal
     */
    constructor(e) {
      this._values = (e || []).map(((e2) => e2));
    }
    /**
     * Returns a copy of the raw number array form of the vector.
     */
    toArray() {
      return this._values.map(((e) => e));
    }
    /**
     * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
     */
    isEqual(e) {
      return (function __PRIVATE_isPrimitiveArrayEqual(e2, t) {
        if (e2.length !== t.length) return false;
        for (let n = 0; n < e2.length; ++n) if (e2[n] !== t[n]) return false;
        return true;
      })(this._values, e._values);
    }
    /**
     * Returns a JSON-serializable representation of this `VectorValue` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON() {
      return {
        type: _VectorValue._jsonSchemaVersion,
        vectorValues: this._values
      };
    }
    /**
     * Builds a `VectorValue` instance from a JSON object created by {@link VectorValue.toJSON}.
     *
     * @param json a JSON object represention of a `VectorValue` instance.
     * @returns an instance of {@link VectorValue} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(e) {
      if (__PRIVATE_validateJSON(e, _VectorValue._jsonSchema)) {
        if (Array.isArray(e.vectorValues) && e.vectorValues.every(((e2) => "number" == typeof e2))) return new _VectorValue(e.vectorValues);
        throw new FirestoreError(N.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
      }
    }
  };
  VectorValue._jsonSchemaVersion = "firestore/vectorValue/1.0", VectorValue._jsonSchema = {
    type: property("string", VectorValue._jsonSchemaVersion),
    vectorValues: property("object")
  };
  var cn = /^__.*__$/;
  var ParsedSetData = class {
    constructor(e, t, n) {
      this.data = e, this.fieldMask = t, this.fieldTransforms = n;
    }
    toMutation(e, t) {
      return null !== this.fieldMask ? new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms) : new __PRIVATE_SetMutation(e, this.data, t, this.fieldTransforms);
    }
  };
  function __PRIVATE_isWrite(e) {
    switch (e) {
      case 0:
      // fall through
      case 2:
      // fall through
      case 1:
        return true;
      case 3:
      case 4:
        return false;
      default:
        throw fail(40011, {
          Ec: e
        });
    }
  }
  var __PRIVATE_ParseContextImpl = class ___PRIVATE_ParseContextImpl {
    /**
     * Initializes a ParseContext with the given source and path.
     *
     * @param settings - The settings for the parser.
     * @param databaseId - The database ID of the Firestore instance.
     * @param serializer - The serializer to use to generate the Value proto.
     * @param ignoreUndefinedProperties - Whether to ignore undefined properties
     * rather than throw.
     * @param fieldTransforms - A mutable list of field transforms encountered
     * while parsing the data.
     * @param fieldMask - A mutable list of field paths encountered while parsing
     * the data.
     *
     * TODO(b/34871131): We don't support array paths right now, so path can be
     * null to indicate the context represents any location within an array (in
     * which case certain features will not work and errors will be somewhat
     * compromised).
     */
    constructor(e, t, n, r, i, s) {
      this.settings = e, this.databaseId = t, this.serializer = n, this.ignoreUndefinedProperties = r, // Minor hack: If fieldTransforms is undefined, we assume this is an
      // external call and we need to validate the entire path.
      void 0 === i && this.Ac(), this.fieldTransforms = i || [], this.fieldMask = s || [];
    }
    get path() {
      return this.settings.path;
    }
    get Ec() {
      return this.settings.Ec;
    }
    /** Returns a new context with the specified settings overwritten. */
    Rc(e) {
      return new ___PRIVATE_ParseContextImpl(Object.assign(Object.assign({}, this.settings), e), this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
    }
    Vc(e) {
      var t;
      const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e), r = this.Rc({
        path: n,
        mc: false
      });
      return r.fc(e), r;
    }
    gc(e) {
      var t;
      const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e), r = this.Rc({
        path: n,
        mc: false
      });
      return r.Ac(), r;
    }
    yc(e) {
      return this.Rc({
        path: void 0,
        mc: true
      });
    }
    wc(e) {
      return __PRIVATE_createError(e, this.settings.methodName, this.settings.Sc || false, this.path, this.settings.bc);
    }
    /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
    contains(e) {
      return void 0 !== this.fieldMask.find(((t) => e.isPrefixOf(t))) || void 0 !== this.fieldTransforms.find(((t) => e.isPrefixOf(t.field)));
    }
    Ac() {
      if (this.path) for (let e = 0; e < this.path.length; e++) this.fc(this.path.get(e));
    }
    fc(e) {
      if (0 === e.length) throw this.wc("Document fields must not be empty");
      if (__PRIVATE_isWrite(this.Ec) && cn.test(e)) throw this.wc('Document fields cannot begin and end with "__"');
    }
  };
  var __PRIVATE_UserDataReader = class {
    constructor(e, t, n) {
      this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = n || __PRIVATE_newSerializer(e);
    }
    /** Creates a new top-level parse context. */
    Dc(e, t, n, r = false) {
      return new __PRIVATE_ParseContextImpl({
        Ec: e,
        methodName: t,
        bc: n,
        path: FieldPath$1.emptyPath(),
        mc: false,
        Sc: r
      }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
    }
  };
  function __PRIVATE_newUserDataReader(e) {
    const t = e._freezeSettings(), n = __PRIVATE_newSerializer(e._databaseId);
    return new __PRIVATE_UserDataReader(e._databaseId, !!t.ignoreUndefinedProperties, n);
  }
  function __PRIVATE_parseSetData(e, t, n, r, i, s = {}) {
    const o = e.Dc(s.merge || s.mergeFields ? 2 : 0, t, n, i);
    __PRIVATE_validatePlainObject("Data must be an object, but it was:", o, r);
    const _ = __PRIVATE_parseObject(r, o);
    let a, u;
    if (s.merge) a = new FieldMask(o.fieldMask), u = o.fieldTransforms;
    else if (s.mergeFields) {
      const e2 = [];
      for (const r2 of s.mergeFields) {
        const i2 = __PRIVATE_fieldPathFromArgument$1(t, r2, n);
        if (!o.contains(i2)) throw new FirestoreError(N.INVALID_ARGUMENT, `Field '${i2}' is specified in your field mask but missing from your input data.`);
        __PRIVATE_fieldMaskContains(e2, i2) || e2.push(i2);
      }
      a = new FieldMask(e2), u = o.fieldTransforms.filter(((e3) => a.covers(e3.field)));
    } else a = null, u = o.fieldTransforms;
    return new ParsedSetData(new ObjectValue(_), a, u);
  }
  var __PRIVATE_ServerTimestampFieldValueImpl = class ___PRIVATE_ServerTimestampFieldValueImpl extends FieldValue {
    _toFieldTransform(e) {
      return new FieldTransform(e.path, new __PRIVATE_ServerTimestampTransform());
    }
    isEqual(e) {
      return e instanceof ___PRIVATE_ServerTimestampFieldValueImpl;
    }
  };
  function __PRIVATE_parseQueryValue(e, t, n, r = false) {
    return __PRIVATE_parseData(n, e.Dc(r ? 4 : 3, t));
  }
  function __PRIVATE_parseData(e, t) {
    if (__PRIVATE_looksLikeJsonObject(
      // Unwrap the API type from the Compat SDK. This will return the API type
      // from firestore-exp.
      e = getModularInstance(e)
    )) return __PRIVATE_validatePlainObject("Unsupported field value:", t, e), __PRIVATE_parseObject(e, t);
    if (e instanceof FieldValue)
      return (function __PRIVATE_parseSentinelFieldValue(e2, t2) {
        if (!__PRIVATE_isWrite(t2.Ec)) throw t2.wc(`${e2._methodName}() can only be used with update() and set()`);
        if (!t2.path) throw t2.wc(`${e2._methodName}() is not currently supported inside arrays`);
        const n = e2._toFieldTransform(t2);
        n && t2.fieldTransforms.push(n);
      })(e, t), null;
    if (void 0 === e && t.ignoreUndefinedProperties)
      return null;
    if (
      // If context.path is null we are inside an array and we don't support
      // field mask paths more granular than the top-level array.
      t.path && t.fieldMask.push(t.path), e instanceof Array
    ) {
      if (t.settings.mc && 4 !== t.Ec) throw t.wc("Nested arrays are not supported");
      return (function __PRIVATE_parseArray(e2, t2) {
        const n = [];
        let r = 0;
        for (const i of e2) {
          let e3 = __PRIVATE_parseData(i, t2.yc(r));
          null == e3 && // Just include nulls in the array for fields being replaced with a
          // sentinel.
          (e3 = {
            nullValue: "NULL_VALUE"
          }), n.push(e3), r++;
        }
        return {
          arrayValue: {
            values: n
          }
        };
      })(e, t);
    }
    return (function __PRIVATE_parseScalarValue(e2, t2) {
      if (null === (e2 = getModularInstance(e2))) return {
        nullValue: "NULL_VALUE"
      };
      if ("number" == typeof e2) return toNumber(t2.serializer, e2);
      if ("boolean" == typeof e2) return {
        booleanValue: e2
      };
      if ("string" == typeof e2) return {
        stringValue: e2
      };
      if (e2 instanceof Date) {
        const n = Timestamp.fromDate(e2);
        return {
          timestampValue: toTimestamp(t2.serializer, n)
        };
      }
      if (e2 instanceof Timestamp) {
        const n = new Timestamp(e2.seconds, 1e3 * Math.floor(e2.nanoseconds / 1e3));
        return {
          timestampValue: toTimestamp(t2.serializer, n)
        };
      }
      if (e2 instanceof GeoPoint) return {
        geoPointValue: {
          latitude: e2.latitude,
          longitude: e2.longitude
        }
      };
      if (e2 instanceof Bytes) return {
        bytesValue: __PRIVATE_toBytes(t2.serializer, e2._byteString)
      };
      if (e2 instanceof DocumentReference) {
        const n = t2.databaseId, r = e2.firestore._databaseId;
        if (!r.isEqual(n)) throw t2.wc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);
        return {
          referenceValue: __PRIVATE_toResourceName(e2.firestore._databaseId || t2.databaseId, e2._key.path)
        };
      }
      if (e2 instanceof VectorValue)
        return (function __PRIVATE_parseVectorValue(e3, t3) {
          const n = {
            fields: {
              [ct]: {
                stringValue: Pt
              },
              [Tt]: {
                arrayValue: {
                  values: e3.toArray().map(((e4) => {
                    if ("number" != typeof e4) throw t3.wc("VectorValues must only contain numeric values.");
                    return __PRIVATE_toDouble(t3.serializer, e4);
                  }))
                }
              }
            }
          };
          return {
            mapValue: n
          };
        })(e2, t2);
      throw t2.wc(`Unsupported field value: ${__PRIVATE_valueDescription(e2)}`);
    })(e, t);
  }
  function __PRIVATE_parseObject(e, t) {
    const n = {};
    return isEmpty2(e) ? (
      // If we encounter an empty object, we explicitly add it to the update
      // mask to ensure that the server creates a map entry.
      t.path && t.path.length > 0 && t.fieldMask.push(t.path)
    ) : forEach(e, ((e2, r) => {
      const i = __PRIVATE_parseData(r, t.Vc(e2));
      null != i && (n[e2] = i);
    })), {
      mapValue: {
        fields: n
      }
    };
  }
  function __PRIVATE_looksLikeJsonObject(e) {
    return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof Timestamp || e instanceof GeoPoint || e instanceof Bytes || e instanceof DocumentReference || e instanceof FieldValue || e instanceof VectorValue);
  }
  function __PRIVATE_validatePlainObject(e, t, n) {
    if (!__PRIVATE_looksLikeJsonObject(n) || !__PRIVATE_isPlainObject(n)) {
      const r = __PRIVATE_valueDescription(n);
      throw "an object" === r ? t.wc(e + " a custom object") : t.wc(e + " " + r);
    }
  }
  function __PRIVATE_fieldPathFromArgument$1(e, t, n) {
    if (
      // If required, replace the FieldPath Compat class with the firestore-exp
      // FieldPath.
      (t = getModularInstance(t)) instanceof FieldPath
    ) return t._internalPath;
    if ("string" == typeof t) return __PRIVATE_fieldPathFromDotSeparatedString(e, t);
    throw __PRIVATE_createError(
      "Field path arguments must be of type string or ",
      e,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      n
    );
  }
  var ln = new RegExp("[~\\*/\\[\\]]");
  function __PRIVATE_fieldPathFromDotSeparatedString(e, t, n) {
    if (t.search(ln) >= 0) throw __PRIVATE_createError(
      `Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,
      e,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      n
    );
    try {
      return new FieldPath(...t.split("."))._internalPath;
    } catch (r) {
      throw __PRIVATE_createError(
        `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
        e,
        /* hasConverter= */
        false,
        /* path= */
        void 0,
        n
      );
    }
  }
  function __PRIVATE_createError(e, t, n, r, i) {
    const s = r && !r.isEmpty(), o = void 0 !== i;
    let _ = `Function ${t}() called with invalid data`;
    n && (_ += " (via `toFirestore()`)"), _ += ". ";
    let a = "";
    return (s || o) && (a += " (found", s && (a += ` in field ${r}`), o && (a += ` in document ${i}`), a += ")"), new FirestoreError(N.INVALID_ARGUMENT, _ + e + a);
  }
  function __PRIVATE_fieldMaskContains(e, t) {
    return e.some(((e2) => e2.isEqual(t)));
  }
  var DocumentSnapshot$1 = class {
    // Note: This class is stripped down version of the DocumentSnapshot in
    // the legacy SDK. The changes are:
    // - No support for SnapshotMetadata.
    // - No support for SnapshotOptions.
    /** @hideconstructor protected */
    constructor(e, t, n, r, i) {
      this._firestore = e, this._userDataWriter = t, this._key = n, this._document = r, this._converter = i;
    }
    /** Property of the `DocumentSnapshot` that provides the document's ID. */
    get id() {
      return this._key.path.lastSegment();
    }
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */
    get ref() {
      return new DocumentReference(this._firestore, this._converter, this._key);
    }
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */
    exists() {
      return null !== this._document;
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */
    data() {
      if (this._document) {
        if (this._converter) {
          const e = new QueryDocumentSnapshot$1(
            this._firestore,
            this._userDataWriter,
            this._key,
            this._document,
            /* converter= */
            null
          );
          return this._converter.fromFirestore(e);
        }
        return this._userDataWriter.convertValue(this._document.data.value);
      }
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(e) {
      if (this._document) {
        const t = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
        if (null !== t) return this._userDataWriter.convertValue(t);
      }
    }
  };
  var QueryDocumentSnapshot$1 = class extends DocumentSnapshot$1 {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * @override
     * @returns An `Object` containing all fields in the document.
     */
    data() {
      return super.data();
    }
  };
  function __PRIVATE_fieldPathFromArgument(e, t) {
    return "string" == typeof t ? __PRIVATE_fieldPathFromDotSeparatedString(e, t) : t instanceof FieldPath ? t._internalPath : t._delegate._internalPath;
  }
  function __PRIVATE_validateHasExplicitOrderByForLimitToLast(e) {
    if ("L" === e.limitType && 0 === e.explicitOrderBy.length) throw new FirestoreError(N.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
  }
  var AppliableConstraint = class {
  };
  var QueryConstraint = class extends AppliableConstraint {
  };
  function query(e, t, ...n) {
    let r = [];
    t instanceof AppliableConstraint && r.push(t), r = r.concat(n), (function __PRIVATE_validateQueryConstraintArray(e2) {
      const t2 = e2.filter(((e3) => e3 instanceof QueryCompositeFilterConstraint)).length, n2 = e2.filter(((e3) => e3 instanceof QueryFieldFilterConstraint)).length;
      if (t2 > 1 || t2 > 0 && n2 > 0) throw new FirestoreError(N.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
    })(r);
    for (const t2 of r) e = t2._apply(e);
    return e;
  }
  var QueryFieldFilterConstraint = class _QueryFieldFilterConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(e, t, n) {
      super(), this._field = e, this._op = t, this._value = n, /** The type of this query constraint */
      this.type = "where";
    }
    static _create(e, t, n) {
      return new _QueryFieldFilterConstraint(e, t, n);
    }
    _apply(e) {
      const t = this._parse(e);
      return __PRIVATE_validateNewFieldFilter(e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t));
    }
    _parse(e) {
      const t = __PRIVATE_newUserDataReader(e.firestore), n = (function __PRIVATE_newQueryFilter(e2, t2, n2, r, i, s, o) {
        let _;
        if (i.isKeyField()) {
          if ("array-contains" === s || "array-contains-any" === s) throw new FirestoreError(N.INVALID_ARGUMENT, `Invalid Query. You can't perform '${s}' queries on documentId().`);
          if ("in" === s || "not-in" === s) {
            __PRIVATE_validateDisjunctiveFilterElements(o, s);
            const t3 = [];
            for (const n3 of o) t3.push(__PRIVATE_parseDocumentIdValue(r, e2, n3));
            _ = {
              arrayValue: {
                values: t3
              }
            };
          } else _ = __PRIVATE_parseDocumentIdValue(r, e2, o);
        } else "in" !== s && "not-in" !== s && "array-contains-any" !== s || __PRIVATE_validateDisjunctiveFilterElements(o, s), _ = __PRIVATE_parseQueryValue(
          n2,
          t2,
          o,
          /* allowArrays= */
          "in" === s || "not-in" === s
        );
        const a = FieldFilter.create(i, s, _);
        return a;
      })(e._query, "where", t, e.firestore._databaseId, this._field, this._op, this._value);
      return n;
    }
  };
  var QueryCompositeFilterConstraint = class _QueryCompositeFilterConstraint extends AppliableConstraint {
    /**
     * @internal
     */
    constructor(e, t) {
      super(), this.type = e, this._queryConstraints = t;
    }
    static _create(e, t) {
      return new _QueryCompositeFilterConstraint(e, t);
    }
    _parse(e) {
      const t = this._queryConstraints.map(((t2) => t2._parse(e))).filter(((e2) => e2.getFilters().length > 0));
      return 1 === t.length ? t[0] : CompositeFilter.create(t, this._getOperator());
    }
    _apply(e) {
      const t = this._parse(e);
      return 0 === t.getFilters().length ? e : ((function __PRIVATE_validateNewFilter(e2, t2) {
        let n = e2;
        const r = t2.getFlattenedFilters();
        for (const e3 of r) __PRIVATE_validateNewFieldFilter(n, e3), n = __PRIVATE_queryWithAddedFilter(n, e3);
      })(e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t)));
    }
    _getQueryConstraints() {
      return this._queryConstraints;
    }
    _getOperator() {
      return "and" === this.type ? "and" : "or";
    }
  };
  var QueryOrderByConstraint = class _QueryOrderByConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(e, t) {
      super(), this._field = e, this._direction = t, /** The type of this query constraint */
      this.type = "orderBy";
    }
    static _create(e, t) {
      return new _QueryOrderByConstraint(e, t);
    }
    _apply(e) {
      const t = (function __PRIVATE_newQueryOrderBy(e2, t2, n) {
        if (null !== e2.startAt) throw new FirestoreError(N.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
        if (null !== e2.endAt) throw new FirestoreError(N.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
        const r = new OrderBy(t2, n);
        return r;
      })(e._query, this._field, this._direction);
      return new Query(e.firestore, e.converter, (function __PRIVATE_queryWithAddedOrderBy(e2, t2) {
        const n = e2.explicitOrderBy.concat([t2]);
        return new __PRIVATE_QueryImpl(e2.path, e2.collectionGroup, n, e2.filters.slice(), e2.limit, e2.limitType, e2.startAt, e2.endAt);
      })(e._query, t));
    }
  };
  function orderBy(e, t = "asc") {
    const n = t, r = __PRIVATE_fieldPathFromArgument("orderBy", e);
    return QueryOrderByConstraint._create(r, n);
  }
  var QueryLimitConstraint = class _QueryLimitConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(e, t, n) {
      super(), this.type = e, this._limit = t, this._limitType = n;
    }
    static _create(e, t, n) {
      return new _QueryLimitConstraint(e, t, n);
    }
    _apply(e) {
      return new Query(e.firestore, e.converter, __PRIVATE_queryWithLimit(e._query, this._limit, this._limitType));
    }
  };
  function limit(e) {
    return __PRIVATE_validatePositiveNumber("limit", e), QueryLimitConstraint._create(
      "limit",
      e,
      "F"
      /* LimitType.First */
    );
  }
  function __PRIVATE_parseDocumentIdValue(e, t, n) {
    if ("string" == typeof (n = getModularInstance(n))) {
      if ("" === n) throw new FirestoreError(N.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
      if (!__PRIVATE_isCollectionGroupQuery(t) && -1 !== n.indexOf("/")) throw new FirestoreError(N.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
      const r = t.path.child(ResourcePath.fromString(n));
      if (!DocumentKey.isDocumentKey(r)) throw new FirestoreError(N.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);
      return __PRIVATE_refValue(e, new DocumentKey(r));
    }
    if (n instanceof DocumentReference) return __PRIVATE_refValue(e, n._key);
    throw new FirestoreError(N.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${__PRIVATE_valueDescription(n)}.`);
  }
  function __PRIVATE_validateDisjunctiveFilterElements(e, t) {
    if (!Array.isArray(e) || 0 === e.length) throw new FirestoreError(N.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${t.toString()}' filters.`);
  }
  function __PRIVATE_validateNewFieldFilter(e, t) {
    const n = (function __PRIVATE_findOpInsideFilters(e2, t2) {
      for (const n2 of e2) for (const e3 of n2.getFlattenedFilters()) if (t2.indexOf(e3.op) >= 0) return e3.op;
      return null;
    })(e.filters, (function __PRIVATE_conflictingOps(e2) {
      switch (e2) {
        case "!=":
          return [
            "!=",
            "not-in"
            /* Operator.NOT_IN */
          ];
        case "array-contains-any":
        case "in":
          return [
            "not-in"
            /* Operator.NOT_IN */
          ];
        case "not-in":
          return [
            "array-contains-any",
            "in",
            "not-in",
            "!="
            /* Operator.NOT_EQUAL */
          ];
        default:
          return [];
      }
    })(t.op));
    if (null !== n)
      throw n === t.op ? new FirestoreError(N.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${t.op.toString()}' filter.`) : new FirestoreError(N.INVALID_ARGUMENT, `Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`);
  }
  var AbstractUserDataWriter = class {
    convertValue(e, t = "none") {
      switch (__PRIVATE_typeOrder(e)) {
        case 0:
          return null;
        case 1:
          return e.booleanValue;
        case 2:
          return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
        case 3:
          return this.convertTimestamp(e.timestampValue);
        case 4:
          return this.convertServerTimestamp(e, t);
        case 5:
          return e.stringValue;
        case 6:
          return this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue));
        case 7:
          return this.convertReference(e.referenceValue);
        case 8:
          return this.convertGeoPoint(e.geoPointValue);
        case 9:
          return this.convertArray(e.arrayValue, t);
        case 11:
          return this.convertObject(e.mapValue, t);
        case 10:
          return this.convertVectorValue(e.mapValue);
        default:
          throw fail(62114, {
            value: e
          });
      }
    }
    convertObject(e, t) {
      return this.convertObjectMap(e.fields, t);
    }
    /**
     * @internal
     */
    convertObjectMap(e, t = "none") {
      const n = {};
      return forEach(e, ((e2, r) => {
        n[e2] = this.convertValue(r, t);
      })), n;
    }
    /**
     * @internal
     */
    convertVectorValue(e) {
      var t, n, r;
      const i = null === (r = null === (n = null === (t = e.fields) || void 0 === t ? void 0 : t[Tt].arrayValue) || void 0 === n ? void 0 : n.values) || void 0 === r ? void 0 : r.map(((e2) => __PRIVATE_normalizeNumber(e2.doubleValue)));
      return new VectorValue(i);
    }
    convertGeoPoint(e) {
      return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
    }
    convertArray(e, t) {
      return (e.values || []).map(((e2) => this.convertValue(e2, t)));
    }
    convertServerTimestamp(e, t) {
      switch (t) {
        case "previous":
          const n = __PRIVATE_getPreviousValue(e);
          return null == n ? null : this.convertValue(n, t);
        case "estimate":
          return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));
        default:
          return null;
      }
    }
    convertTimestamp(e) {
      const t = __PRIVATE_normalizeTimestamp(e);
      return new Timestamp(t.seconds, t.nanos);
    }
    convertDocumentKey(e, t) {
      const n = ResourcePath.fromString(e);
      __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(n), 9688, {
        name: e
      });
      const r = new DatabaseId(n.get(1), n.get(3)), i = new DocumentKey(n.popFirst(5));
      return r.isEqual(t) || // TODO(b/64130202): Somehow support foreign references.
      __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), i;
    }
  };
  function __PRIVATE_applyFirestoreDataConverter(e, t, n) {
    let r;
    return r = e ? n && (n.merge || n.mergeFields) ? e.toFirestore(t, n) : e.toFirestore(t) : t, r;
  }
  var SnapshotMetadata = class {
    /** @hideconstructor */
    constructor(e, t) {
      this.hasPendingWrites = e, this.fromCache = t;
    }
    /**
     * Returns true if this `SnapshotMetadata` is equal to the provided one.
     *
     * @param other - The `SnapshotMetadata` to compare against.
     * @returns true if this `SnapshotMetadata` is equal to the provided one.
     */
    isEqual(e) {
      return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache;
    }
  };
  var DocumentSnapshot = class _DocumentSnapshot extends DocumentSnapshot$1 {
    /** @hideconstructor protected */
    constructor(e, t, n, r, i, s) {
      super(e, t, n, r, s), this._firestore = e, this._firestoreImpl = e, this.metadata = i;
    }
    /**
     * Returns whether or not the data exists. True if the document exists.
     */
    exists() {
      return super.exists();
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document or `undefined` if
     * the document doesn't exist.
     */
    data(e = {}) {
      if (this._document) {
        if (this._converter) {
          const t = new QueryDocumentSnapshot(
            this._firestore,
            this._userDataWriter,
            this._key,
            this._document,
            this.metadata,
            /* converter= */
            null
          );
          return this._converter.fromFirestore(t, e);
        }
        return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
      }
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * By default, a `serverTimestamp()` that has not yet been set to
     * its final value will be returned as `null`. You can override this by
     * passing an options object.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @param options - An options object to configure how the field is retrieved
     * from the snapshot (for example the desired behavior for server timestamps
     * that have not yet been set to their final value).
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(e, t = {}) {
      if (this._document) {
        const n = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
        if (null !== n) return this._userDataWriter.convertValue(n, t.serverTimestamps);
      }
    }
    /**
     * Returns a JSON-serializable representation of this `DocumentSnapshot` instance.
     *
     * @returns a JSON representation of this object.  Throws a {@link FirestoreError} if this
     * `DocumentSnapshot` has pending writes.
     */
    toJSON() {
      if (this.metadata.hasPendingWrites) throw new FirestoreError(N.FAILED_PRECONDITION, "DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
      const e = this._document, t = {};
      if (t.type = _DocumentSnapshot._jsonSchemaVersion, t.bundle = "", t.bundleSource = "DocumentSnapshot", t.bundleName = this._key.toString(), !e || !e.isValidDocument() || !e.isFoundDocument()) return t;
      this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields, "previous");
      return t.bundle = (this._firestore, this.ref.path, "NOT SUPPORTED"), t;
    }
  };
  DocumentSnapshot._jsonSchemaVersion = "firestore/documentSnapshot/1.0", DocumentSnapshot._jsonSchema = {
    type: property("string", DocumentSnapshot._jsonSchemaVersion),
    bundleSource: property("string", "DocumentSnapshot"),
    bundleName: property("string"),
    bundle: property("string")
  };
  var QueryDocumentSnapshot = class extends DocumentSnapshot {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @override
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document.
     */
    data(e = {}) {
      return super.data(e);
    }
  };
  var QuerySnapshot = class _QuerySnapshot {
    /** @hideconstructor */
    constructor(e, t, n, r) {
      this._firestore = e, this._userDataWriter = t, this._snapshot = r, this.metadata = new SnapshotMetadata(r.hasPendingWrites, r.fromCache), this.query = n;
    }
    /** An array of all the documents in the `QuerySnapshot`. */
    get docs() {
      const e = [];
      return this.forEach(((t) => e.push(t))), e;
    }
    /** The number of documents in the `QuerySnapshot`. */
    get size() {
      return this._snapshot.docs.size;
    }
    /** True if there are no documents in the `QuerySnapshot`. */
    get empty() {
      return 0 === this.size;
    }
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */
    forEach(e, t) {
      this._snapshot.docs.forEach(((n) => {
        e.call(t, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, n.key, n, new SnapshotMetadata(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
      }));
    }
    /**
     * Returns an array of the documents changes since the last snapshot. If this
     * is the first snapshot, all documents will be in the list as 'added'
     * changes.
     *
     * @param options - `SnapshotListenOptions` that control whether metadata-only
     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
     * snapshot events.
     */
    docChanges(e = {}) {
      const t = !!e.includeMetadataChanges;
      if (t && this._snapshot.excludesMetadataChanges) throw new FirestoreError(N.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
      return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t || (this._cachedChanges = /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
      (function __PRIVATE_changesFromSnapshot(e2, t2) {
        if (e2._snapshot.oldDocs.isEmpty()) {
          let t3 = 0;
          return e2._snapshot.docChanges.map(((n) => {
            const r = new QueryDocumentSnapshot(e2._firestore, e2._userDataWriter, n.doc.key, n.doc, new SnapshotMetadata(e2._snapshot.mutatedKeys.has(n.doc.key), e2._snapshot.fromCache), e2.query.converter);
            return n.doc, {
              type: "added",
              doc: r,
              oldIndex: -1,
              newIndex: t3++
            };
          }));
        }
        {
          let n = e2._snapshot.oldDocs;
          return e2._snapshot.docChanges.filter(((e3) => t2 || 3 !== e3.type)).map(((t3) => {
            const r = new QueryDocumentSnapshot(e2._firestore, e2._userDataWriter, t3.doc.key, t3.doc, new SnapshotMetadata(e2._snapshot.mutatedKeys.has(t3.doc.key), e2._snapshot.fromCache), e2.query.converter);
            let i = -1, s = -1;
            return 0 !== t3.type && (i = n.indexOf(t3.doc.key), n = n.delete(t3.doc.key)), 1 !== t3.type && (n = n.add(t3.doc), s = n.indexOf(t3.doc.key)), {
              type: __PRIVATE_resultChangeType(t3.type),
              doc: r,
              oldIndex: i,
              newIndex: s
            };
          }));
        }
      })(this, t), this._cachedChangesIncludeMetadataChanges = t), this._cachedChanges;
    }
    /**
     * Returns a JSON-serializable representation of this `QuerySnapshot` instance.
     *
     * @returns a JSON representation of this object. Throws a {@link FirestoreError} if this
     * `QuerySnapshot` has pending writes.
     */
    toJSON() {
      if (this.metadata.hasPendingWrites) throw new FirestoreError(N.FAILED_PRECONDITION, "QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
      const e = {};
      e.type = _QuerySnapshot._jsonSchemaVersion, e.bundleSource = "QuerySnapshot", e.bundleName = __PRIVATE_AutoId.newId(), this._firestore._databaseId.database, this._firestore._databaseId.projectId;
      const t = [], n = [], r = [];
      return this.docs.forEach(((e2) => {
        null !== e2._document && (t.push(e2._document), n.push(this._userDataWriter.convertObjectMap(e2._document.data.value.mapValue.fields, "previous")), r.push(e2.ref.path));
      })), e.bundle = (this._firestore, this.query._query, e.bundleName, "NOT SUPPORTED"), e;
    }
  };
  function __PRIVATE_resultChangeType(e) {
    switch (e) {
      case 0:
        return "added";
      case 2:
      case 3:
        return "modified";
      case 1:
        return "removed";
      default:
        return fail(61501, {
          type: e
        });
    }
  }
  function getDoc(e) {
    e = __PRIVATE_cast(e, DocumentReference);
    const t = __PRIVATE_cast(e.firestore, Firestore);
    return __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(ensureFirestoreConfigured(t), e._key).then(((n) => __PRIVATE_convertToDocSnapshot(t, e, n)));
  }
  QuerySnapshot._jsonSchemaVersion = "firestore/querySnapshot/1.0", QuerySnapshot._jsonSchema = {
    type: property("string", QuerySnapshot._jsonSchemaVersion),
    bundleSource: property("string", "QuerySnapshot"),
    bundleName: property("string"),
    bundle: property("string")
  };
  var __PRIVATE_ExpUserDataWriter = class extends AbstractUserDataWriter {
    constructor(e) {
      super(), this.firestore = e;
    }
    convertBytes(e) {
      return new Bytes(e);
    }
    convertReference(e) {
      const t = this.convertDocumentKey(e, this.firestore._databaseId);
      return new DocumentReference(
        this.firestore,
        /* converter= */
        null,
        t
      );
    }
  };
  function getDocs(e) {
    e = __PRIVATE_cast(e, Query);
    const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r = new __PRIVATE_ExpUserDataWriter(t);
    return __PRIVATE_validateHasExplicitOrderByForLimitToLast(e._query), __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(n, e._query).then(((n2) => new QuerySnapshot(t, r, e, n2)));
  }
  function setDoc(e, t, n) {
    e = __PRIVATE_cast(e, DocumentReference);
    const r = __PRIVATE_cast(e.firestore, Firestore), i = __PRIVATE_applyFirestoreDataConverter(e.converter, t, n);
    return executeWrite(r, [__PRIVATE_parseSetData(__PRIVATE_newUserDataReader(r), "setDoc", e._key, i, null !== e.converter, n).toMutation(e._key, Precondition.none())]);
  }
  function executeWrite(e, t) {
    return (function __PRIVATE_firestoreClientWrite(e2, t2) {
      const n = new __PRIVATE_Deferred();
      return e2.asyncQueue.enqueueAndForget((async () => __PRIVATE_syncEngineWrite(await __PRIVATE_getSyncEngine(e2), t2, n))), n.promise;
    })(ensureFirestoreConfigured(e), t);
  }
  function __PRIVATE_convertToDocSnapshot(e, t, n) {
    const r = n.docs.get(t._key), i = new __PRIVATE_ExpUserDataWriter(e);
    return new DocumentSnapshot(e, i, t._key, r, new SnapshotMetadata(n.hasPendingWrites, n.fromCache), t.converter);
  }
  function serverTimestamp() {
    return new __PRIVATE_ServerTimestampFieldValueImpl("serverTimestamp");
  }
  !(function __PRIVATE_registerFirestore(e, t = true) {
    !(function __PRIVATE_setSDKVersion(e2) {
      x = e2;
    })(SDK_VERSION), _registerComponent(new Component("firestore", ((e2, { instanceIdentifier: n, options: r }) => {
      const i = e2.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(e2.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(i, e2.getProvider("app-check-internal")), (function __PRIVATE_databaseIdFromApp(e3, t2) {
        if (!Object.prototype.hasOwnProperty.apply(e3.options, ["projectId"])) throw new FirestoreError(N.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
        return new DatabaseId(e3.options.projectId, t2);
      })(i, n), i);
      return r = Object.assign({
        useFetchStreams: t
      }, r), s._setSettings(r), s;
    }), "PUBLIC").setMultipleInstances(true)), registerVersion(F, M, e), // BUILD_TARGET will be replaced by values like esm2017, cjs2017, etc during the compilation
    registerVersion(F, M, "esm2017");
  })();

  // src/firebase-init.js
  var app = null;
  var auth = null;
  var db = null;
  function createAuth(instance) {
    try {
      return initializeAuth(instance, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
        popupRedirectResolver: browserPopupRedirectResolver
      });
    } catch (_) {
      return getAuth(instance);
    }
  }
  function initFirebase() {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase is not configured. Add credentials to .env and run npm run build.");
    }
    if (!app) {
      app = initializeApp(firebaseConfig);
      auth = createAuth(app);
      db = getFirestore(app);
    }
    return { app, auth, db };
  }
  function getFirebaseAuth() {
    return initFirebase().auth;
  }
  function getDb() {
    return initFirebase().db;
  }

  // src/stubs/auth-google-extension-stub.js
  async function signInWithGoogleExtension() {
    throw new Error("Extension Google sign-in is not bundled in the web build.");
  }

  // src/auth-google-web.js
  function isMobileBrowser() {
    if (typeof window === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia("(max-width: 1023px)").matches && "ontouchstart" in window;
  }
  function createGoogleProvider() {
    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");
    provider.setCustomParameters({ prompt: "select_account" });
    return provider;
  }
  function shouldPreferRedirect() {
    const { search, hash } = window.location;
    return /[?&]apiKey=/.test(search) || /[?&]authType=/.test(search) || /[?&]code=/.test(search) || /[?&]state=/.test(search) || /(?:^|[?#&])apiKey=/.test(hash);
  }
  async function signInWithGooglePlatform() {
    const auth2 = getFirebaseAuth();
    const provider = createGoogleProvider();
    if (shouldPreferRedirect()) {
      await signInWithRedirect(auth2, provider);
      return null;
    }
    try {
      const result = await signInWithPopup(auth2, provider);
      return result.user;
    } catch (err) {
      const useRedirect = err?.code === "auth/popup-blocked" || err?.code === "auth/cancelled-popup-request" || err?.code === "auth/operation-not-supported-in-this-environment";
      if (useRedirect || isMobileBrowser()) {
        await signInWithRedirect(auth2, provider);
        return null;
      }
      throw err;
    }
  }

  // src/auth-shared.js
  var AUTH_STORAGE_KEY = "leetlensAuth";
  var PENDING_REDIRECT_KEY2 = "leetlensPendingAuthRedirect";
  function isChromeExtensionPage() {
    return typeof chrome !== "undefined" && Boolean(chrome.runtime?.id) && !window.__LEETLENS_WEB__;
  }
  async function ensureAuthPersistence(auth2) {
    try {
      await setPersistence(auth2, browserLocalPersistence);
    } catch (_) {
      try {
        await setPersistence(auth2, inMemoryPersistence);
      } catch (_2) {
      }
    }
  }
  function formatAuthError(err) {
    const code = err?.code || "";
    const msg = err?.message || String(err);
    const map = {
      "auth/internal-error": "Firebase authentication failed. Enable Google sign-in in Firebase Console and add this app domain under Authorized domains.",
      "auth/invalid-credential": "Google sign-in failed. Use the Web client ID from Firebase Console \u2192 Authentication \u2192 Google in VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID.",
      "auth/operation-not-allowed": "Google sign-in is disabled. Enable it in Firebase Console \u2192 Authentication \u2192 Sign-in method \u2192 Google.",
      "auth/popup-blocked": "Sign-in popup was blocked. Allow popups for this site or try again.",
      "auth/popup-closed-by-user": "Sign-in cancelled.",
      "auth/network-request-failed": "Network error. Check your connection and try again.",
      "auth/unauthorized-domain": "This domain is not authorized for Firebase Auth. Add it in Firebase Console \u2192 Authentication \u2192 Settings \u2192 Authorized domains.",
      "auth/user-not-found": "No account found with this email. Try signing up instead.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/email-already-in-use": "An account with this email already exists. Try signing in.",
      "auth/weak-password": "Password is too weak. Use at least 6 characters.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
      "auth/missing-or-invalid-nonce": "Sign-in session expired. Please try again.",
      "auth/web-storage-unsupported": "This browser blocks sign-in storage. Disable private browsing or try a different browser."
    };
    if (map[code]) return map[code];
    if (msg.includes("INVALID_IDP_RESPONSE") || msg.includes("audience")) {
      return "Google sign-in failed: the OAuth client ID must match Firebase Console \u2192 Authentication \u2192 Google \u2192 Web client ID (VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID).";
    }
    return msg.replace(/^Firebase:\s*/i, "").replace(/^Error\s*\([^)]+\)\.\s*/i, "");
  }

  // src/auth-service.js
  var redirectResultHandled = false;
  function isPendingAuthRedirect() {
    try {
      return sessionStorage.getItem(PENDING_REDIRECT_KEY2) === "1";
    } catch (_) {
      return false;
    }
  }
  function isAuthCallbackUrl() {
    if (typeof window === "undefined") return false;
    const { search, hash } = window.location;
    return /[?&]apiKey=/.test(search) || /[?&]authType=/.test(search) || /[?&]code=/.test(search) || /[?&]state=/.test(search) || /(?:^|[?#&])apiKey=/.test(hash);
  }
  function markPendingRedirect() {
    try {
      sessionStorage.setItem(PENDING_REDIRECT_KEY2, "1");
    } catch (_) {
    }
  }
  function clearPendingRedirect() {
    try {
      sessionStorage.removeItem(PENDING_REDIRECT_KEY2);
    } catch (_) {
    }
  }
  function cleanAuthParamsFromUrl() {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      const authParams = ["apiKey", "authType", "code", "state", "oobCode", "mode", "lang", "tid", "eid"];
      let changed = false;
      authParams.forEach((param) => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          changed = true;
        }
      });
      if (!changed) return;
      const search = url.searchParams.toString();
      const next = `${url.pathname}${search ? `?${search}` : ""}${url.hash}`;
      history.replaceState(null, "", next);
    } catch (_) {
    }
  }
  async function handleGoogleRedirectResult() {
    if (isChromeExtensionPage()) return null;
    if (redirectResultHandled) return null;
    redirectResultHandled = true;
    const hadCallback = isAuthCallbackUrl() || isPendingAuthRedirect();
    if (!hadCallback) return null;
    const auth2 = getFirebaseAuth();
    await ensureAuthPersistence(auth2);
    try {
      await auth2.authStateReady();
      const result = await getRedirectResult(auth2);
      if (result?.user) {
        clearPendingRedirect();
        cleanAuthParamsFromUrl();
        return completeSignIn(result.user);
      }
      if (auth2.currentUser) {
        clearPendingRedirect();
        cleanAuthParamsFromUrl();
        return completeSignIn(auth2.currentUser);
      }
      clearPendingRedirect();
      cleanAuthParamsFromUrl();
      throw new Error("Google sign-in could not be completed after redirect. Please try again.");
    } catch (err) {
      clearPendingRedirect();
      cleanAuthParamsFromUrl();
      throw new Error(formatAuthError(err));
    }
  }
  async function signInWithGoogleFirebase() {
    if (isChromeExtensionPage()) {
      return signInWithGoogleExtension();
    }
    if (isAuthCallbackUrl() || isPendingAuthRedirect()) {
      markPendingRedirect();
    }
    const user = await signInWithGooglePlatform();
    return user;
  }
  async function upsertUserDoc(user) {
    const db2 = getDb();
    const ref = doc(db2, "users", user.uid);
    const snap = await getDoc(ref);
    const now = serverTimestamp();
    const payload = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      lastLoginAt: now
    };
    if (!snap.exists()) {
      payload.createdAt = now;
      payload.emailRemindersEnabled = true;
      payload.reminderTime = "10:00";
      payload.timezone = "Asia/Kolkata";
    }
    try {
      await setDoc(ref, payload, { merge: true });
    } catch (err) {
      throw wrapFirestoreError(err);
    }
  }
  async function completeSignIn(user) {
    await upsertUserDoc(user);
    await persistAuthState(user);
    return user;
  }
  async function signInWithGoogle() {
    try {
      const user = await signInWithGoogleFirebase();
      if (!user) return null;
      return await completeSignIn(user);
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  }
  async function signUpWithEmail(email, password, displayName = "") {
    const auth2 = getFirebaseAuth();
    await ensureAuthPersistence(auth2);
    try {
      const result = await createUserWithEmailAndPassword(auth2, email.trim(), password);
      if (displayName.trim()) await updateProfile(result.user, { displayName: displayName.trim() });
      return completeSignIn(result.user);
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  }
  async function signInWithEmail(email, password) {
    const auth2 = getFirebaseAuth();
    await ensureAuthPersistence(auth2);
    try {
      const result = await signInWithEmailAndPassword(auth2, email.trim(), password);
      return completeSignIn(result.user);
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  }
  async function signOutUser() {
    const auth2 = getFirebaseAuth();
    await signOut(auth2);
    await chrome.storage.local.remove([AUTH_STORAGE_KEY, "leetlensUserProfile", "leetlensStats", "cloudSignedIn"]);
    try {
      chrome.runtime.sendMessage({ type: "AUTH_STATE_CHANGED", user: null }).catch(() => {
      });
    } catch (_) {
    }
  }
  async function persistAuthState(user) {
    await chrome.storage.local.set({
      [AUTH_STORAGE_KEY]: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      cloudSignedIn: true
    });
    try {
      chrome.runtime.sendMessage({ type: "AUTH_STATE_CHANGED", user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      } }).catch(() => {
      });
    } catch (_) {
    }
  }
  function watchAuthState(callback) {
    const auth2 = getFirebaseAuth();
    return onAuthStateChanged(auth2, async (user) => {
      if (user) {
        await persistAuthState(user);
        callback({ user, loading: false, error: null });
      } else {
        await chrome.storage.local.remove([AUTH_STORAGE_KEY, "cloudSignedIn"]);
        callback({ user: null, loading: false, error: null });
      }
    }, (error) => {
      callback({ user: null, loading: false, error: formatAuthError(error) });
    });
  }
  async function getUserProfile(uid) {
    try {
      const db2 = getDb();
      const snap = await getDoc(doc(db2, "users", uid));
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw wrapFirestoreError(err);
    }
  }
  async function requireAuthUser() {
    const auth2 = getFirebaseAuth();
    await auth2.authStateReady();
    const user = auth2.currentUser;
    if (!user) {
      throw new Error("Sign in required. Your session may have expired \u2014 please sign out and sign in again.");
    }
    return user;
  }
  function wrapFirestoreError(err) {
    const code = err?.code || "";
    if (code === "permission-denied") {
      throw new Error(
        "Missing or insufficient permissions. Sign out, sign in again, then deploy Firestore rules."
      );
    }
    return err;
  }
  async function updateUserProfile(uid, updates) {
    const current = await requireAuthUser();
    if (current.uid !== uid) {
      throw new Error("Account mismatch. Please sign out and sign in again.");
    }
    const db2 = getDb();
    try {
      await setDoc(doc(db2, "users", uid), {
        ...updates,
        uid,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      throw wrapFirestoreError(err);
    }
  }

  // src/firestore-service.js
  function statsRef(uid) {
    return doc(getDb(), "users", uid, "stats", "current");
  }
  function dailySnapshotRef(uid, dateKey) {
    return doc(getDb(), "users", uid, "dailySnapshots", dateKey);
  }
  function solvedProblemRef(uid, problemId) {
    return doc(getDb(), "users", uid, "solvedProblems", problemId);
  }
  function activityRef(uid, activityId) {
    return doc(getDb(), "users", uid, "activity", activityId);
  }
  function weeklyPlanRef(uid, weekId) {
    return doc(getDb(), "users", uid, "weeklyPlans", weekId);
  }
  async function saveSolvedProblem(uid, data) {
    try {
      const ref = solvedProblemRef(uid, data.problemId);
      const existing = await getDoc(ref);
      if (existing.exists()) {
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      } else {
        await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    } catch (err) {
      throw wrapFirestoreError(err);
    }
  }
  async function saveActivity(uid, activityId, data) {
    try {
      await setDoc(activityRef(uid, activityId), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      throw wrapFirestoreError(err);
    }
  }
  async function saveStats(uid, stats) {
    try {
      await setDoc(statsRef(uid), {
        ...stats,
        syncedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      throw wrapFirestoreError(err);
    }
  }
  async function saveDailySnapshot(uid, dateKey, snapshot) {
    try {
      const ref = dailySnapshotRef(uid, dateKey);
      const existing = await getDoc(ref);
      const prev = existing.exists() ? existing.data() : {};
      const merged = { ...prev, ...snapshot, date: dateKey };
      if (snapshot.solvedToday) {
        merged.solvedToday = (prev.solvedToday || 0) + snapshot.solvedToday;
      }
      if (!existing.exists()) {
        await setDoc(ref, { ...merged, createdAt: serverTimestamp() });
      } else {
        await setDoc(ref, { ...merged, updatedAt: serverTimestamp() }, { merge: true });
      }
    } catch (err) {
      throw wrapFirestoreError(err);
    }
  }
  async function getStats(uid) {
    const snap = await getDoc(statsRef(uid));
    return snap.exists() ? snap.data() : null;
  }
  async function getDailySnapshots(uid, max = 365) {
    const q2 = query(
      collection(getDb(), "users", uid, "dailySnapshots"),
      orderBy("date", "desc"),
      limit(max)
    );
    const snap = await getDocs(q2);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  async function getSolvedProblems(uid) {
    const snap = await getDocs(collection(getDb(), "users", uid, "solvedProblems"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  async function getRecentActivity(uid, max = 20) {
    const q2 = query(
      collection(getDb(), "users", uid, "activity"),
      orderBy("endedAt", "desc"),
      limit(max)
    );
    const snap = await getDocs(q2);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  async function saveWeeklyPlan(uid, weekId, plan) {
    try {
      await setDoc(weeklyPlanRef(uid, weekId), {
        ...plan,
        weekId,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      throw wrapFirestoreError(err);
    }
  }
  async function getCurrentWeeklyPlan(uid) {
    const weekId = getWeekId(/* @__PURE__ */ new Date());
    const snap = await getDoc(weeklyPlanRef(uid, weekId));
    return snap.exists() ? snap.data() : null;
  }
  function getWeekId(date = /* @__PURE__ */ new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().slice(0, 10);
  }
  function getWeekRange(date = /* @__PURE__ */ new Date()) {
    const weekId = getWeekId(date);
    const start = new Date(weekId);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return {
      weekId,
      startDate: weekId,
      endDate: end.toISOString().slice(0, 10)
    };
  }
  async function syncLocalRecordToCloud(uid, record, source = "extension") {
    if (!record.solved) return;
    const problemId = record.slug;
    await saveSolvedProblem(uid, {
      problemId,
      title: record.title || record.slug,
      difficulty: record.difficulty || "Unknown",
      solvedAt: record.solvedAt || Date.now(),
      timeSpentMinutes: Math.round((record.totalMs || 0) / 6e4),
      userDifficultyRating: record.stars || 0,
      tags: record.tags || [],
      source
    });
  }

  // src/leetcode-api.js
  var GRAPHQL_URL = "https://leetcode.com/graphql";
  function graphqlEndpoint() {
    if (typeof window !== "undefined" && window.__LEETLENS_WEB__) {
      return "/api/leetcode";
    }
    return GRAPHQL_URL;
  }
  async function graphql(query2, variables = {}) {
    const res = await fetch(graphqlEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query2, variables })
    });
    if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
  }
  var USER_EXISTS_QUERY = `
  query userExists($username: String!) {
    matchedUser(username: $username) {
      username
      profile { userAvatar realName }
    }
  }
`;
  var USER_STATS_QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
      profile { ranking reputation starRating }
    }
  }
`;
  var CALENDAR_QUERY = `
  query userCalendar($username: String!, $year: Int!) {
    matchedUser(username: $username) {
      userCalendar(year: $year) { submissionCalendar }
    }
  }
`;
  var RECENT_AC_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;
  var RECENT_AC_PAGED_QUERY = `
  query recentAcPaged($username: String!, $limit: Int!, $skip: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit, skip: $skip) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;
  var RECENT_SUBMISSIONS_QUERY = `
  query recentSubmissions($username: String!, $limit: Int!) {
    recentSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`;
  var PROBLEM_DIFFICULTY_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      titleSlug
      difficulty
    }
  }
`;
  async function validateUsername(username) {
    const clean = (username || "").trim().toLowerCase();
    if (!clean || !/^[a-zA-Z0-9_-]+$/.test(clean)) {
      return { valid: false, error: "Invalid username format" };
    }
    try {
      const data = await graphql(USER_EXISTS_QUERY, { username: clean });
      if (!data?.matchedUser) {
        return { valid: false, error: "LeetCode user not found" };
      }
      return { valid: true, username: clean, profile: data.matchedUser.profile };
    } catch (err) {
      const msg = err.message === "Failed to fetch" ? "Could not reach LeetCode. Check your connection or try again from the Chrome extension." : err.message;
      return { valid: false, error: msg };
    }
  }
  function parseSubmitStats(acSubmissionNum = []) {
    const stats = { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
    acSubmissionNum.forEach((item) => {
      const count = item.count || 0;
      if (item.difficulty === "All") stats.totalSolved = count;
      if (item.difficulty === "Easy") stats.easySolved = count;
      if (item.difficulty === "Medium") stats.mediumSolved = count;
      if (item.difficulty === "Hard") stats.hardSolved = count;
    });
    return stats;
  }
  function parseSubmissionCalendar(calendarStr) {
    if (!calendarStr) return {};
    try {
      return JSON.parse(calendarStr);
    } catch {
      return {};
    }
  }
  function computeStreakFromCalendar(calendar) {
    const dates = Object.keys(calendar).map((ts) => new Date(Number(ts) * 1e3)).sort((a, b) => b - a);
    if (!dates.length) return 0;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const mostRecent = new Date(dates[0]);
    mostRecent.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - mostRecent) / 864e5);
    if (diffDays > 1) return 0;
    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const curr = new Date(dates[i]);
      const next = new Date(dates[i + 1]);
      curr.setHours(0, 0, 0, 0);
      next.setHours(0, 0, 0, 0);
      const gap = Math.round((curr - next) / 864e5);
      if (gap === 1) streak++;
      else if (gap > 1) break;
    }
    return streak;
  }
  async function fetchUserProfile(username) {
    const data = await graphql(USER_STATS_QUERY, { username });
    const user = data?.matchedUser;
    if (!user) throw new Error("User not found");
    const stats = parseSubmitStats(user.submitStats?.acSubmissionNum);
    return { stats, profile: user.profile };
  }
  async function fetchSubmissionCalendar(username, year = (/* @__PURE__ */ new Date()).getFullYear()) {
    const data = await graphql(CALENDAR_QUERY, { username, year });
    const calendarStr = data?.matchedUser?.userCalendar?.submissionCalendar;
    return parseSubmissionCalendar(calendarStr);
  }
  async function fetchRecentSubmissions(username, limit2 = 20) {
    const data = await graphql(RECENT_SUBMISSIONS_QUERY, { username, limit: limit2 });
    return data?.recentSubmissionList || [];
  }
  async function fetchProblemDifficulty(titleSlug) {
    try {
      const data = await graphql(PROBLEM_DIFFICULTY_QUERY, { titleSlug });
      return data?.question?.difficulty || "Unknown";
    } catch {
      return "Unknown";
    }
  }
  async function enrichDifficulties(problems, concurrency = 6, maxEnrich = 200) {
    const toEnrich = problems.slice(0, maxEnrich);
    for (let i = 0; i < toEnrich.length; i += concurrency) {
      const batch = toEnrich.slice(i, i + concurrency);
      await Promise.all(batch.map(async (p) => {
        if (p.difficulty && p.difficulty !== "Unknown") return;
        p.difficulty = await fetchProblemDifficulty(p.problemId);
      }));
    }
    return problems;
  }
  function collectUniqueSubmissions(submissions, seen, problems) {
    submissions.forEach((s) => {
      const slug = (s.titleSlug || "").toLowerCase();
      if (!slug || seen.has(slug)) return;
      seen.add(slug);
      problems.push({
        problemId: slug,
        title: s.title || slug,
        difficulty: "Unknown",
        solvedAt: Number(s.timestamp) * 1e3,
        source: "leetcode-sync"
      });
    });
  }
  async function fetchAcSubmissionsAll(username, targetTotal) {
    const seen = /* @__PURE__ */ new Set();
    const problems = [];
    const pageSize = 50;
    let skip = 0;
    let usePaging = true;
    while (problems.length < targetTotal) {
      let batch = [];
      if (usePaging) {
        try {
          const data = await graphql(RECENT_AC_PAGED_QUERY, { username, limit: pageSize, skip });
          batch = data?.recentAcSubmissionList || [];
        } catch (_) {
          usePaging = false;
        }
      }
      if (!usePaging) {
        const limit2 = Math.min(Math.max(targetTotal, 50), 3e3);
        const data = await graphql(RECENT_AC_QUERY, { username, limit: limit2 });
        batch = data?.recentAcSubmissionList || [];
        collectUniqueSubmissions(batch, seen, problems);
        break;
      }
      if (!batch.length) break;
      const before = problems.length;
      collectUniqueSubmissions(batch, seen, problems);
      if (batch.length < pageSize || problems.length === before) break;
      skip += pageSize;
      if (skip > targetTotal + 200) break;
    }
    if (problems.length < targetTotal) {
      const extra = await fetchRecentSubmissions(username, Math.min(targetTotal * 3, 500));
      collectUniqueSubmissions(
        extra.filter((s) => s.statusDisplay === "Accepted"),
        seen,
        problems
      );
    }
    return problems;
  }
  async function fetchAllSolvedProblems(username) {
    const profileData = await fetchUserProfile(username);
    const total = profileData.stats.totalSolved || 0;
    const problems = await fetchAcSubmissionsAll(username, total || 50);
    await enrichDifficulties(problems);
    return { problems, stats: profileData.stats };
  }
  async function syncLeetCodeProfile(username) {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const [{ problems: solvedProblems, stats: baseStats }, calendar] = await Promise.all([
      fetchAllSolvedProblems(username),
      fetchSubmissionCalendar(username, year)
    ]);
    const streak = computeStreakFromCalendar(calendar);
    const stats = {
      ...baseStats,
      streak,
      submissionCalendar: calendar,
      syncedAt: Date.now()
    };
    return { stats, solvedProblems };
  }

  // src/github-api.js
  var GITHUB_API = "https://api.github.com";
  function githubUrl(path) {
    if (typeof window !== "undefined" && window.__LEETLENS_WEB__) {
      return `/api/github?path=${encodeURIComponent(path)}`;
    }
    return `${GITHUB_API}${path}`;
  }
  async function ghFetch(path) {
    const res = await fetch(githubUrl(path), {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    return res.json();
  }
  async function validateGithubUsername(username) {
    const clean = (username || "").trim().toLowerCase();
    if (!clean || !/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/.test(clean)) {
      return { valid: false, error: "Invalid GitHub username" };
    }
    try {
      const profile = await ghFetch(`/users/${clean}`);
      if (!profile) return { valid: false, error: "GitHub user not found" };
      return { valid: true, username: clean, profile };
    } catch (err) {
      const msg = err.message === "Failed to fetch" ? "Could not reach GitHub. Check your connection or try again later." : err.message;
      return { valid: false, error: msg };
    }
  }
  async function syncGithubProfile(username) {
    const clean = username.trim().toLowerCase();
    const [profile, repos] = await Promise.all([
      ghFetch(`/users/${clean}`),
      ghFetch(`/users/${clean}/repos?per_page=100&sort=updated`)
    ]);
    if (!profile) throw new Error("GitHub user not found");
    const repoList = Array.isArray(repos) ? repos : [];
    const languages = {};
    let totalForks = 0;
    let totalWatchers = 0;
    let recentlyUpdated = 0;
    const thirtyDaysAgo = Date.now() - 30 * 864e5;
    repoList.forEach((r) => {
      if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
      totalForks += r.forks_count || 0;
      totalWatchers += r.watchers_count || 0;
      if (r.updated_at && new Date(r.updated_at).getTime() > thirtyDaysAgo) recentlyUpdated++;
    });
    const sortedByStars = [...repoList].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    const topRepo = sortedByStars[0];
    const totalStars = repoList.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const langTotal = Object.values(languages).reduce((s, n) => s + n, 0) || 1;
    const topLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name4, count]) => ({
      name: name4,
      count,
      percent: Math.round(count / langTotal * 100)
    }));
    const reposWithDesc = repoList.filter((r) => r.description).length;
    const avgStars = repoList.length ? Math.round(totalStars / repoList.length * 10) / 10 : 0;
    return {
      username: clean,
      displayName: profile.name || clean,
      bio: profile.bio || "",
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url,
      publicRepos: profile.public_repos || 0,
      followers: profile.followers || 0,
      following: profile.following || 0,
      totalStars,
      totalForks,
      totalWatchers,
      recentlyUpdated,
      reposWithDescription: reposWithDesc,
      avgStarsPerRepo: avgStars,
      accountCreated: profile.created_at,
      topRepo: topRepo ? {
        name: topRepo.name,
        stars: topRepo.stargazers_count || 0,
        url: topRepo.html_url,
        language: topRepo.language || "Unknown"
      } : null,
      topLanguages,
      recentRepos: repoList.map((r) => ({
        name: r.name,
        description: r.description || "",
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        watchers: r.watchers_count || 0,
        language: r.language || "Unknown",
        updatedAt: r.updated_at,
        createdAt: r.created_at,
        url: r.html_url,
        hasWiki: r.has_wiki,
        openIssues: r.open_issues_count || 0
      })),
      syncedAt: Date.now()
    };
  }

  // src/dashboard-bundle.js
  var authUnsubscribe = null;
  var authBootPromise = null;
  var cloudState = {
    user: null,
    profile: null,
    stats: null,
    loading: true,
    error: null,
    syncing: false
  };
  var listeners = /* @__PURE__ */ new Set();
  function emit() {
    listeners.forEach((fn) => fn({ ...cloudState }));
  }
  function setState(patch) {
    cloudState = { ...cloudState, ...patch };
    emit();
  }
  async function loadCloudData(uid) {
    const [profile, stats] = await Promise.all([
      getUserProfile(uid),
      getStats(uid)
    ]);
    setState({ profile, stats });
    await chrome.storage.local.set({
      leetlensUserProfile: profile,
      leetlensStats: stats
    });
  }
  function toCloudUser(firebaseUser) {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    };
  }
  async function initCloud() {
    if (authBootPromise) return authBootPromise;
    authBootPromise = (async () => {
      if (!isFirebaseConfigured()) {
        setState({ loading: false, error: "Firebase not configured" });
        return cloudState;
      }
      initFirebase();
      if (authUnsubscribe) authUnsubscribe();
      let redirectError = null;
      try {
        const redirectUser = await handleGoogleRedirectResult();
        if (redirectUser) {
          setState({ user: toCloudUser(redirectUser), loading: true, error: null });
          try {
            await loadCloudData(redirectUser.uid);
            setState({ loading: false });
          } catch (err) {
            setState({ loading: false, error: err.message });
          }
        }
      } catch (err) {
        redirectError = err.message;
        setState({ loading: false, error: err.message });
      }
      authUnsubscribe = watchAuthState(async ({ user, error }) => {
        if (error) {
          setState({ user: null, loading: false, error: error.message || redirectError });
          return;
        }
        if (user) {
          setState({ user: toCloudUser(user), loading: true, error: null });
          try {
            await loadCloudData(user.uid);
          } catch (err) {
            setState({ loading: false, error: err.message });
            return;
          }
          setState({ loading: false });
        } else {
          setState({ user: null, profile: null, stats: null, loading: false, error: redirectError });
        }
      });
      return cloudState;
    })();
    return authBootPromise;
  }
  function ensureAuthBoot() {
    return initCloud();
  }
  function onCloudStateChange(fn) {
    listeners.add(fn);
    fn({ ...cloudState });
    return () => listeners.delete(fn);
  }
  function getCloudState() {
    return { ...cloudState };
  }
  async function login() {
    setState({ loading: true, error: null });
    try {
      const user = await signInWithGoogle();
      if (!user) {
        return null;
      }
      await loadCloudData(user.uid);
      setState({ user: toCloudUser(user), loading: false });
      return user;
    } catch (err) {
      setState({ loading: false, error: err.message });
      throw err;
    }
  }
  async function signUpGoogle() {
    return login();
  }
  async function loginWithEmail(email, password) {
    setState({ loading: true, error: null });
    try {
      const user = await signInWithEmail(email, password);
      await loadCloudData(user.uid);
      setState({ user: toCloudUser(user), loading: false });
      return user;
    } catch (err) {
      setState({ loading: false, error: err.message });
      throw err;
    }
  }
  async function signUpWithEmailAccount(email, password, displayName) {
    setState({ loading: true, error: null });
    try {
      const user = await signUpWithEmail(email, password, displayName);
      await loadCloudData(user.uid);
      setState({ user: toCloudUser(user), loading: false });
      return user;
    } catch (err) {
      setState({ loading: false, error: err.message });
      throw err;
    }
  }
  async function logout() {
    await signOutUser();
    setState({ user: null, profile: null, stats: null, loading: false, error: null });
  }
  async function linkLeetCodeUsername(username) {
    const user = await requireAuthUser();
    const result = await validateUsername(username);
    if (!result.valid) throw new Error(result.error);
    await updateUserProfile(user.uid, { leetcodeUsername: result.username });
    await loadCloudData(user.uid);
    return result.username;
  }
  async function syncProfile() {
    const user = await requireAuthUser();
    const username = cloudState.profile?.leetcodeUsername;
    if (!username) throw new Error("Link your LeetCode username first");
    setState({ syncing: true, error: null });
    try {
      const { stats, solvedProblems } = await syncLeetCodeProfile(username);
      await saveStats(user.uid, stats);
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      await saveDailySnapshot(user.uid, today, {
        totalSolved: stats.totalSolved,
        easySolved: stats.easySolved,
        mediumSolved: stats.mediumSolved,
        hardSolved: stats.hardSolved,
        streak: stats.streak,
        solvedToday: stats.solvedToday || 0
      });
      for (const p of solvedProblems) {
        await saveSolvedProblem(user.uid, {
          problemId: p.problemId,
          title: p.title,
          difficulty: p.difficulty || "Unknown",
          solvedAt: p.solvedAt,
          timeSpentMinutes: 0,
          userDifficultyRating: 0,
          tags: [],
          source: p.source
        });
      }
      await updateUserProfile(user.uid, { leetcodeLastSyncedAt: Date.now() });
      await loadCloudData(user.uid);
      setState({ syncing: false });
      return stats;
    } catch (err) {
      setState({ syncing: false, error: err.message });
      throw err;
    }
  }
  async function linkGithubUsername(username) {
    const user = await requireAuthUser();
    const result = await validateGithubUsername(username);
    if (!result.valid) throw new Error(result.error);
    await updateUserProfile(user.uid, { githubUsername: result.username });
    await loadCloudData(user.uid);
    return result.username;
  }
  async function syncGithub() {
    const user = await requireAuthUser();
    const username = cloudState.profile?.githubUsername;
    if (!username) throw new Error("Link your GitHub username first");
    setState({ syncing: true, error: null });
    try {
      const githubData = await syncGithubProfile(username);
      await updateUserProfile(user.uid, {
        githubUsername: username,
        githubStats: githubData,
        githubLastSyncedAt: Date.now()
      });
      await loadCloudData(user.uid);
      setState({ syncing: false });
      return githubData;
    } catch (err) {
      setState({ syncing: false, error: err.message });
      throw err;
    }
  }
  async function syncLocalRecords(records) {
    const user = cloudState.user;
    if (!user) return;
    const values = Object.values(records || {});
    for (const record of values) {
      if (record.solved) await syncLocalRecordToCloud(user.uid, record);
    }
  }
  async function saveProblemActivity(activity) {
    const user = cloudState.user;
    if (!user) return;
    const id = `${activity.problemId}_${activity.startedAt}`;
    await saveActivity(user.uid, id, activity);
  }
  async function saveProblemRating(problemId, rating, record) {
    const user = cloudState.user;
    if (!user || !record?.solved) return;
    await saveSolvedProblem(user.uid, {
      problemId,
      title: record.title || problemId,
      difficulty: record.difficulty || "Unknown",
      solvedAt: record.solvedAt || Date.now(),
      timeSpentMinutes: Math.round((record.totalMs || 0) / 6e4),
      userDifficultyRating: rating,
      tags: record.tags || [],
      source: "extension"
    });
  }
  async function updateReminderSettings(settings) {
    const user = await requireAuthUser();
    await updateUserProfile(user.uid, settings);
    await loadCloudData(user.uid);
  }
  async function fetchAnalyticsData() {
    const user = cloudState.user;
    if (!user) return null;
    const [snapshots, solved, activity] = await Promise.all([
      getDailySnapshots(user.uid),
      getSolvedProblems(user.uid),
      getRecentActivity(user.uid, 50)
    ]);
    return { snapshots, solved, activity, stats: cloudState.stats };
  }
  async function fetchLiveLeetCodeProblems() {
    const username = cloudState.profile?.leetcodeUsername;
    if (!username) return [];
    const cacheKey = `lc_live_${username}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { at: at2, problems: problems2 } = JSON.parse(cached);
        if (Date.now() - at2 < 5 * 60 * 1e3) return problems2;
      }
    } catch (_) {
    }
    const { problems } = await fetchAllSolvedProblems(username);
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), problems }));
    } catch (_) {
    }
    return problems;
  }
  async function fetchWeeklyPlanData() {
    const user = cloudState.user;
    if (!user) return null;
    return getCurrentWeeklyPlan(user.uid);
  }
  async function fetchWeeklyGoals() {
    const plan = await fetchWeeklyPlanData();
    return plan?.goals || [];
  }
  async function saveWeeklyGoals(goals) {
    const user = await requireAuthUser();
    const range = getWeekRange();
    const existing = await getCurrentWeeklyPlan(user.uid) || {};
    await saveWeeklyPlan(user.uid, range.weekId, {
      ...existing,
      weekId: range.weekId,
      startDate: range.startDate,
      endDate: range.endDate,
      goals
    });
    return goals;
  }
  async function addWeeklyGoal(goal) {
    const goals = await fetchWeeklyGoals();
    const newGoal = {
      id: `g_${Date.now()}`,
      title: goal.title || "Weekly Goal",
      type: goal.type || "count",
      targetCount: Number(goal.targetCount) || 0,
      targetSlugs: goal.targetSlugs || [],
      difficulty: goal.difficulty || "all",
      completedSlugs: [],
      status: "active",
      createdAt: Date.now()
    };
    goals.push(newGoal);
    await saveWeeklyGoals(goals);
    return newGoal;
  }
  async function updateWeeklyGoal(goalId, updates) {
    const goals = await fetchWeeklyGoals();
    const idx = goals.findIndex((g) => g.id === goalId);
    if (idx === -1) throw new Error("Goal not found");
    goals[idx] = { ...goals[idx], ...updates };
    await saveWeeklyGoals(goals);
    return goals[idx];
  }
  async function deleteWeeklyGoal(goalId) {
    const goals = (await fetchWeeklyGoals()).filter((g) => g.id !== goalId);
    await saveWeeklyGoals(goals);
    return goals;
  }
  async function markGoalProblemComplete(slug) {
    const goals = await fetchWeeklyGoals();
    let changed = false;
    goals.forEach((goal) => {
      if (goal.status === "completed") return;
      const completed = goal.completedSlugs || [];
      if (completed.includes(slug)) return;
      if (goal.type === "specific") {
        const targets = goal.targetSlugs || [];
        if (targets.includes(slug)) {
          completed.push(slug);
          goal.completedSlugs = completed;
          changed = true;
        }
      } else if (goal.type === "count") {
        completed.push(slug);
        goal.completedSlugs = completed;
        changed = true;
      }
      const target = goal.type === "specific" ? (goal.targetSlugs || []).length : goal.targetCount || 0;
      if (target > 0 && (goal.completedSlugs || []).length >= target) {
        goal.status = "completed";
      }
    });
    if (changed) await saveWeeklyGoals(goals);
  }
  async function createOrUpdateWeeklyPlan(targetProblems, problemSlugs = []) {
    const user = await requireAuthUser();
    const range = getWeekRange();
    const existing = await getCurrentWeeklyPlan(user.uid);
    const completed = (existing?.completedProblems || []).slice();
    const plan = {
      weekId: range.weekId,
      startDate: range.startDate,
      endDate: range.endDate,
      targetProblems: Number(targetProblems) || 0,
      targetSlugs: problemSlugs,
      completedProblems: completed,
      status: "active"
    };
    await saveWeeklyPlan(user.uid, range.weekId, plan);
    return plan;
  }
  async function markWeeklyProblemComplete(slug) {
    const user = cloudState.user;
    if (!user) return;
    const range = getWeekRange();
    const existing = await getCurrentWeeklyPlan(user.uid) || {
      weekId: range.weekId,
      startDate: range.startDate,
      endDate: range.endDate,
      targetProblems: 0,
      targetSlugs: [],
      completedProblems: [],
      status: "active"
    };
    if (!existing.completedProblems.includes(slug)) {
      existing.completedProblems.push(slug);
    }
    const target = existing.targetProblems || 0;
    const done = existing.completedProblems.length;
    existing.status = target > 0 && done >= target ? "completed" : "active";
    await saveWeeklyPlan(user.uid, range.weekId, existing);
    return existing;
  }
  async function onProblemSolved(record) {
    const user = cloudState.user;
    if (!user || !record?.solved) return;
    await syncLocalRecordToCloud(user.uid, record);
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    await saveDailySnapshot(user.uid, today, { solvedToday: 1 });
    await markWeeklyProblemComplete(record.slug);
    await markGoalProblemComplete(record.slug);
  }
  var LeetLensCloudAPI = {
    initCloud,
    ensureAuthBoot,
    onCloudStateChange,
    getCloudState,
    login,
    signUpGoogle,
    loginWithEmail,
    signUpWithEmailAccount,
    logout,
    linkLeetCodeUsername,
    syncProfile,
    linkGithubUsername,
    syncGithub,
    syncLocalRecords,
    saveProblemActivity,
    saveProblemRating,
    updateReminderSettings,
    fetchAnalyticsData,
    fetchLiveLeetCodeProblems,
    fetchWeeklyPlanData,
    fetchWeeklyGoals,
    addWeeklyGoal,
    updateWeeklyGoal,
    deleteWeeklyGoal,
    createOrUpdateWeeklyPlan,
    markWeeklyProblemComplete,
    onProblemSolved,
    validateUsername,
    isFirebaseConfigured,
    isPendingAuthRedirect,
    isAuthCallbackUrl
  };
  window.LeetLensCloud = LeetLensCloudAPI;
  if (typeof globalThis !== "undefined") globalThis.LeetLensCloud = LeetLensCloudAPI;
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    const pendingRedirect = (() => {
      try {
        return sessionStorage.getItem("leetlensPendingAuthRedirect") === "1";
      } catch (_) {
        return false;
      }
    })();
    const authCallback = /[?&](apiKey|authType|code|state)=/.test(window.location.search) || /(?:^|[?#&])(apiKey|authType)=/.test(window.location.hash);
    if (pendingRedirect || authCallback) {
      initCloud();
    }
  }
})();
/*! Bundled license information:

@firebase/util/dist/index.esm2017.js:
@firebase/util/dist/index.esm2017.js:
@firebase/util/dist/index.esm2017.js:
@firebase/util/dist/index.esm2017.js:
@firebase/util/dist/index.esm2017.js:
@firebase/util/dist/index.esm2017.js:
@firebase/util/dist/index.esm2017.js:
@firebase/util/dist/index.esm2017.js:
@firebase/util/dist/index.esm2017.js:
@firebase/logger/dist/esm/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
@firebase/component/dist/esm/index.esm2017.js:
@firebase/app/dist/esm/index.esm2017.js:
@firebase/app/dist/esm/index.esm2017.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
firebase/app/dist/esm/index.esm.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/index.esm2017.js:
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law | agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
