import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase-init.js';

function isMobileBrowser() {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (window.matchMedia('(max-width: 1023px)').matches && 'ontouchstart' in window);
}

function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

function shouldPreferRedirect() {
  const { search, hash } = window.location;
  return /[?&]apiKey=/.test(search)
    || /[?&]authType=/.test(search)
    || /[?&]code=/.test(search)
    || /[?&]state=/.test(search)
    || /(?:^|[?#&])apiKey=/.test(hash);
}

/** Web dashboard only — may load apis.google.com (not used in extension pages). */
export async function signInWithGooglePlatform() {
  const auth = getFirebaseAuth();
  const provider = createGoogleProvider();

  if (shouldPreferRedirect()) {
    try { sessionStorage.setItem('leetlensPendingAuthRedirect', '1'); } catch (_) {}
    await signInWithRedirect(auth, provider);
    return null;
  }

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    const useRedirect = err?.code === 'auth/popup-blocked'
      || err?.code === 'auth/cancelled-popup-request'
      || err?.code === 'auth/operation-not-supported-in-this-environment';
    if (useRedirect || isMobileBrowser()) {
      try { sessionStorage.setItem('leetlensPendingAuthRedirect', '1'); } catch (_) {}
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
}
