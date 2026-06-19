'use strict';

const DEFAULT_BRIDGE_URL = 'https://leetlens.srminsider.in/auth-google.html';
const AUTH_TIMEOUT_MS = 120000;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen' || message.type !== 'START_GOOGLE_AUTH') {
    return false;
  }

  const bridgeUrl = message.bridgeUrl || DEFAULT_BRIDGE_URL;
  let bridgeOrigin;
  try {
    bridgeOrigin = new URL(bridgeUrl).origin;
  } catch (_) {
    sendResponse({ ok: false, message: 'Invalid auth bridge URL.' });
    return false;
  }

  const parentOrigin = chrome.runtime.getURL('').replace(/\/$/, '');
  const iframe = document.createElement('iframe');
  iframe.src = bridgeUrl;
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;border:0';
  document.documentElement.appendChild(iframe);

  let finished = false;
  const timeout = setTimeout(() => {
    if (finished) return;
    finished = true;
    cleanup();
    sendResponse({ ok: false, message: 'Google sign-in timed out. Please try again.' });
  }, AUTH_TIMEOUT_MS);

  function cleanup() {
    clearTimeout(timeout);
    window.removeEventListener('message', onIframeMessage);
    iframe.remove();
  }

  function onIframeMessage(event) {
    if (finished) return;
    if (event.source !== iframe.contentWindow) return;
    if (event.origin !== bridgeOrigin) return;
    if (typeof event.data !== 'string') return;
    if (event.data.startsWith('!_{')) return;

    try {
      const data = JSON.parse(event.data);
      finished = true;
      cleanup();
      sendResponse(data);
    } catch (_) {}
  }

  window.addEventListener('message', onIframeMessage);

  iframe.addEventListener('load', () => {
    try {
      iframe.contentWindow.postMessage({
        initAuth: true,
        parentOrigin
      }, bridgeOrigin);
    } catch (err) {
      if (finished) return;
      finished = true;
      cleanup();
      sendResponse({ ok: false, message: err.message || 'Failed to start Google sign-in.' });
    }
  });

  return true;
});
