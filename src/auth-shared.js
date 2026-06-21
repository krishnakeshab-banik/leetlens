import {
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence
} from 'firebase/auth';

export const AUTH_STORAGE_KEY = 'leetlensAuth';
export const PENDING_REDIRECT_KEY = 'leetlensPendingAuthRedirect';

export function isChromeExtensionPage() {
  return typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id) && !window.__LEETLENS_WEB__;
}

export async function ensureAuthPersistence(auth) {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (_) {
    try {
      await setPersistence(auth, inMemoryPersistence);
    } catch (_) {}
  }
}

export function formatAuthError(err) {
  const code = err?.code || '';
  const msg = err?.message || String(err);

  const map = {
    'auth/internal-error': 'Firebase authentication failed. Enable Google sign-in in Firebase Console and add this app domain under Authorized domains.',
    'auth/invalid-credential': 'Google sign-in failed. Use the Web client ID from Firebase Console → Authentication → Google in VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID.',
    'auth/operation-not-allowed': 'Google sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method → Google.',
    'auth/popup-blocked': 'Sign-in popup was blocked. Allow popups for this site or try again.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/unauthorized-domain': 'This domain is not authorized for Firebase Auth. Add it in Firebase Console → Authentication → Settings → Authorized domains.',
    'auth/user-not-found': 'No account found with this email. Try signing up instead.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
    'auth/missing-or-invalid-nonce': 'Sign-in session expired. Please try again.',
    'auth/web-storage-unsupported': 'This browser blocks sign-in storage. Disable private browsing or try a different browser.'
  };

  if (map[code]) return map[code];
  if (msg.includes('INVALID_IDP_RESPONSE') || msg.includes('audience')) {
    return 'Google sign-in failed: the OAuth client ID must match Firebase Console → Authentication → Google → Web client ID (VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID).';
  }
  return msg.replace(/^Firebase:\s*/i, '').replace(/^Error\s*\([^)]+\)\.\s*/i, '');
}
