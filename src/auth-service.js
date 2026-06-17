import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getDb } from './firebase-init.js';
import { googleOAuthClientId, isOAuthConfigured } from './config.js';

const AUTH_STORAGE_KEY = 'leetlensAuth';

function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export function formatAuthError(err) {
  const code = err?.code || '';
  const msg = err?.message || String(err);

  const map = {
    'auth/internal-error': 'Firebase auth failed. Ensure Email/Password & Google are enabled in Firebase Console, add chrome-extension://YOUR_ID to Authorized domains, and use the same Web Client ID in Firebase Google provider settings.',
    'auth/invalid-credential': 'Invalid credentials. For Google sign-in, verify your OAuth Web Client ID matches Firebase → Authentication → Google → Web SDK configuration.',
    'auth/operation-not-allowed': 'This sign-in method is disabled. Enable it in Firebase Console → Authentication → Sign-in method.',
    'auth/user-not-found': 'No account found with this email. Try signing up instead.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Check your connection and reload the extension.'
  };

  if (map[code]) return map[code];
  if (msg.includes('redirect_uri_mismatch')) return `OAuth redirect mismatch. Add this URI in Google Cloud Console:\n${getOAuthRedirectUri()}`;
  if (msg.includes('auth/internal-error')) return map['auth/internal-error'];
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

export function getOAuthRedirectUri() {
  return chrome.identity.getRedirectURL();
}

export function getOAuthSetupInfo() {
  return {
    clientId: googleOAuthClientId,
    redirectUri: getOAuthRedirectUri(),
    configured: isOAuthConfigured()
  };
}

function parseOAuthResponse(responseUrl) {
  const hash = new URL(responseUrl).hash.replace(/^#/, '');
  const params = new URLSearchParams(hash);
  if (params.get('error')) {
    throw new Error(params.get('error_description') || params.get('error'));
  }
  return {
    idToken: params.get('id_token'),
    accessToken: params.get('access_token')
  };
}

function getGoogleCredentialViaWebAuthFlow() {
  return new Promise((resolve, reject) => {
    if (!isOAuthConfigured()) {
      reject(new Error('Google OAuth client ID missing in .env'));
      return;
    }

    const redirectUri = getOAuthRedirectUri();
    const nonce = createNonce();
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', googleOAuthClientId);
    authUrl.searchParams.set('response_type', 'id_token token');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('nonce', nonce);
    authUrl.searchParams.set('prompt', 'select_account');

    chrome.identity.launchWebAuthFlow({ url: authUrl.toString(), interactive: true }, responseUrl => {
      if (chrome.runtime.lastError) {
        const raw = chrome.runtime.lastError.message || 'Google sign-in failed';
        if (raw.includes('redirect_uri_mismatch') || raw.includes('Authorization page could not be loaded')) {
          reject(new Error(`Add this redirect URI in Google Cloud Console:\n${redirectUri}`));
        } else if (raw.includes('OAuth2') || raw.includes('canceled')) {
          reject(new Error('Sign-in cancelled'));
        } else {
          reject(new Error(raw));
        }
        return;
      }
      if (!responseUrl) {
        reject(new Error('Sign-in cancelled'));
        return;
      }

      try {
        const { idToken, accessToken } = parseOAuthResponse(responseUrl);
        if (idToken) {
          resolve(GoogleAuthProvider.credential(idToken));
        } else if (accessToken) {
          resolve(GoogleAuthProvider.credential(null, accessToken));
        } else {
          reject(new Error('No token received from Google. Check OAuth client configuration.'));
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function signInWithGoogleWebAuthFlow() {
  const auth = getFirebaseAuth();
  await ensureAuthPersistence(auth);
  const credential = await getGoogleCredentialViaWebAuthFlow();
  const result = await signInWithCredential(auth, credential);
  return result.user;
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
    return await completeSignIn(await signInWithGoogleWebAuthFlow());
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
      'Missing or insufficient permissions. Sign out, sign in again, then deploy Firestore rules: npx firebase deploy --only firestore:rules --project automation-of-electricity'
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
