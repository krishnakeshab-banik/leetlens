import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  indexedDBLocalPersistence,
  inMemoryPersistence,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getDb } from './firebase-init.js';
import { signInWithGooglePlatform } from './auth-google-platform.js';

const AUTH_STORAGE_KEY = 'leetlensAuth';

export function isPendingAuthRedirect() {
  return false;
}

export function isAuthCallbackUrl() {
  return false;
}

export function formatAuthError(err) {
  const code = err?.code || '';
  const msg = err?.message || String(err);

  const map = {
    'auth/internal-error': 'Firebase authentication failed. Enable Google sign-in in Firebase Console and add this app domain under Authorized domains.',
    'auth/invalid-credential': 'Google sign-in failed. Ensure Google is enabled in Firebase Console → Authentication → Sign-in method, and that this domain is authorized.',
    'auth/operation-not-allowed': 'Google sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method → Google.',
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
    return 'Google sign-in client ID must match Firebase Console → Authentication → Google → Web client ID. Set VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID in .env and rebuild.';
  }
  if (msg.includes('redirect_uri_mismatch')) {
    const redirectUri = chrome?.identity?.getRedirectURL?.() || 'https://YOUR_EXTENSION_ID.chromiumapp.org/';
    return `OAuth redirect mismatch. Add this URI to your Firebase Google Web OAuth client: ${redirectUri}`;
  }
  return msg.replace(/^Firebase:\s*/i, '').replace(/^Error\s*\([^)]+\)\.\s*/i, '');
}

async function ensureAuthPersistence(auth) {
  try {
    await setPersistence(auth, indexedDBLocalPersistence);
  } catch (_) {
    try {
      await setPersistence(auth, inMemoryPersistence);
    } catch (_) {}
  }
}

export async function handleGoogleRedirectResult() {
  return null;
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
    const auth = getFirebaseAuth();
    await ensureAuthPersistence(auth);
    const user = await signInWithGooglePlatform();
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
