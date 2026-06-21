import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getDb } from './firebase-init.js';
import { signInWithGoogleExtension } from './auth-google-extension.js';
import { signInWithGooglePlatform } from './auth-google-web.js';
import {
  AUTH_STORAGE_KEY,
  PENDING_REDIRECT_KEY,
  ensureAuthPersistence,
  formatAuthError,
  isChromeExtensionPage
} from './auth-shared.js';

let redirectResultHandled = false;

export { formatAuthError, isChromeExtensionPage };

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

function cleanAuthParamsFromUrl() {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    const authParams = ['apiKey', 'authType', 'code', 'state', 'oobCode', 'mode', 'lang', 'tid', 'eid'];
    let changed = false;
    authParams.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        changed = true;
      }
    });
    if (!changed) return;
    const search = url.searchParams.toString();
    const next = `${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
    history.replaceState(null, '', next);
  } catch (_) {}
}

/** Web only — completes signInWithRedirect flows. No-op in extension pages. */
export async function handleGoogleRedirectResult() {
  if (isChromeExtensionPage()) return null;
  if (redirectResultHandled) return null;
  redirectResultHandled = true;

  const hadCallback = isAuthCallbackUrl() || isPendingAuthRedirect();
  if (!hadCallback) return null;

  const auth = getFirebaseAuth();
  await ensureAuthPersistence(auth);
  try {
    await auth.authStateReady();
    const result = await getRedirectResult(auth);
    if (result?.user) {
      clearPendingRedirect();
      cleanAuthParamsFromUrl();
      return completeSignIn(result.user);
    }
    if (auth.currentUser) {
      clearPendingRedirect();
      cleanAuthParamsFromUrl();
      return completeSignIn(auth.currentUser);
    }
    clearPendingRedirect();
    cleanAuthParamsFromUrl();
    throw new Error('Google sign-in could not be completed after redirect. Please try again.');
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
