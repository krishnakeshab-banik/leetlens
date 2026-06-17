import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getDb } from './firebase-init.js';

const AUTH_STORAGE_KEY = 'leetlensAuth';
const PENDING_REDIRECT_KEY = 'leetlensPendingAuthRedirect';
let redirectResultHandled = false;

export function isPendingAuthRedirect() {
  try {
    return sessionStorage.getItem(PENDING_REDIRECT_KEY) === '1';
  } catch (_) {
    return false;
  }
}

export function isAuthCallbackUrl() {
  if (typeof window === 'undefined') return false;
  const { search, hash } = window.location;
  return /[?&]apiKey=/.test(search)
    || /[?&]authType=/.test(search)
    || /[?&]code=/.test(search)
    || /[?&]state=/.test(search)
    || /(?:^|[?#&])apiKey=/.test(hash);
}

function markPendingRedirect() {
  try {
    sessionStorage.setItem(PENDING_REDIRECT_KEY, '1');
  } catch (_) {}
}

function clearPendingRedirect() {
  try {
    sessionStorage.removeItem(PENDING_REDIRECT_KEY);
  } catch (_) {}
}

export function formatAuthError(err) {
  const code = err?.code || '';
  const msg = err?.message || String(err);

  const map = {
    'auth/internal-error': 'Firebase authentication failed. Enable Google sign-in in Firebase Console and add this app domain under Authorized domains.',
    'auth/invalid-credential': 'Google sign-in failed. Ensure Google is enabled in Firebase Console → Authentication → Sign-in method, and that this domain is authorized.',
    'auth/operation-not-allowed': 'Google sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method → Google.',
    'auth/popup-blocked': 'Sign-in popup was blocked. Allow popups for this site or try again — we will use redirect sign-in automatically when blocked.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/unauthorized-domain': 'This domain is not authorized for Firebase Auth. Add it in Firebase Console → Authentication → Settings → Authorized domains.',
    'auth/user-not-found': 'No account found with this email. Try signing up instead.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
    'auth/missing-or-invalid-nonce': 'Sign-in session expired. Please try again. If this keeps happening on iPhone, disable private browsing or use Safari settings → allow cross-site tracking for this site.',
    'auth/web-storage-unsupported': 'This browser blocks sign-in storage. Disable private browsing or try a different browser.'
  };

  if (map[code]) return map[code];
  if (msg.includes('INVALID_IDP_RESPONSE') || msg.includes('audience')) {
    return 'Google sign-in must use Firebase Authentication only. Enable Google in Firebase Console and remove any custom OAuth client configuration from this app.';
  }
  return msg.replace(/^Firebase:\s*/i, '').replace(/^Error\s*\([^)]+\)\.\s*/i, '');
}

async function ensureAuthPersistence(auth) {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (_) {
    try {
      await setPersistence(auth, inMemoryPersistence);
    } catch (_) {}
  }
}

function isMobileBrowser() {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (window.matchMedia('(max-width: 1023px)').matches && 'ontouchstart' in window);
}

function shouldPreferRedirect() {
  return isMobileBrowser() || isPendingAuthRedirect() || isAuthCallbackUrl();
}

function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

/** Call on app load to complete signInWithRedirect flows. */
export async function handleGoogleRedirectResult() {
  if (redirectResultHandled) return null;
  redirectResultHandled = true;

  const auth = getFirebaseAuth();
  await ensureAuthPersistence(auth);
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      clearPendingRedirect();
      return completeSignIn(result.user);
    }
    if (auth.currentUser && (isPendingAuthRedirect() || isAuthCallbackUrl())) {
      clearPendingRedirect();
      return completeSignIn(auth.currentUser);
    }
  } catch (err) {
    clearPendingRedirect();
    throw new Error(formatAuthError(err));
  }
  return null;
}

async function signInWithGoogleRedirect(auth, provider) {
  markPendingRedirect();
  await signInWithRedirect(auth, provider);
  return null;
}

async function signInWithGoogleFirebase() {
  const auth = getFirebaseAuth();
  await ensureAuthPersistence(auth);
  const provider = createGoogleProvider();

  if (shouldPreferRedirect()) {
    return signInWithGoogleRedirect(auth, provider);
  }

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    const useRedirect = err?.code === 'auth/popup-blocked'
      || err?.code === 'auth/cancelled-popup-request'
      || err?.code === 'auth/operation-not-supported-in-this-environment';
    if (useRedirect) {
      return signInWithGoogleRedirect(auth, provider);
    }
    throw err;
  }
}

async function upsertUserDoc(user) {
  const db = getDb();
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const now = serverTimestamp();
  const payload = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    lastLoginAt: now
  };
  if (!snap.exists()) {
    payload.createdAt = now;
    payload.emailRemindersEnabled = true;
    payload.reminderTime = '10:00';
    payload.timezone = 'Asia/Kolkata';
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

export async function signInWithGoogle() {
  try {
    const user = await signInWithGoogleFirebase();
    if (!user) return null;
    return await completeSignIn(user);
  } catch (err) {
    throw new Error(formatAuthError(err));
  }
}

export async function signUpWithGoogle() {
  return signInWithGoogle();
}

export async function signUpWithEmail(email, password, displayName = '') {
  const auth = getFirebaseAuth();
  await ensureAuthPersistence(auth);
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName.trim()) await updateProfile(result.user, { displayName: displayName.trim() });
    return completeSignIn(result.user);
  } catch (err) {
    throw new Error(formatAuthError(err));
  }
}

export async function signInWithEmail(email, password) {
  const auth = getFirebaseAuth();
  await ensureAuthPersistence(auth);
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    return completeSignIn(result.user);
  } catch (err) {
    throw new Error(formatAuthError(err));
  }
}

export async function signOutUser() {
  const auth = getFirebaseAuth();
  await signOut(auth);
  await chrome.storage.local.remove([AUTH_STORAGE_KEY, 'leetlensUserProfile', 'leetlensStats', 'cloudSignedIn']);
  try {
    chrome.runtime.sendMessage({ type: 'AUTH_STATE_CHANGED', user: null }).catch(() => {});
  } catch (_) {}
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
    chrome.runtime.sendMessage({ type: 'AUTH_STATE_CHANGED', user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }}).catch(() => {});
  } catch (_) {}
}

export function watchAuthState(callback) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, async user => {
    if (user) {
      await persistAuthState(user);
      callback({ user, loading: false, error: null });
    } else {
      await chrome.storage.local.remove([AUTH_STORAGE_KEY, 'cloudSignedIn']);
      callback({ user: null, loading: false, error: null });
    }
  }, error => {
    callback({ user: null, loading: false, error: formatAuthError(error) });
  });
}

export async function getStoredAuth() {
  const data = await chrome.storage.local.get([AUTH_STORAGE_KEY]);
  return data[AUTH_STORAGE_KEY] || null;
}

export async function getUserProfile(uid) {
  try {
    const db = getDb();
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    throw wrapFirestoreError(err);
  }
}

export function getCurrentAuthUser() {
  return getFirebaseAuth().currentUser;
}

export async function requireAuthUser() {
  const auth = getFirebaseAuth();
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Sign in required. Your session may have expired — please sign out and sign in again.');
  }
  return user;
}

export function wrapFirestoreError(err) {
  const code = err?.code || '';
  if (code === 'permission-denied') {
    throw new Error(
      'Missing or insufficient permissions. Sign out, sign in again, then deploy Firestore rules.'
    );
  }
  return err;
}

export async function updateUserProfile(uid, updates) {
  const current = await requireAuthUser();
  if (current.uid !== uid) {
    throw new Error('Account mismatch. Please sign out and sign in again.');
  }
  const db = getDb();
  try {
    await setDoc(doc(db, 'users', uid), {
      ...updates,
      uid,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    throw wrapFirestoreError(err);
  }
}
