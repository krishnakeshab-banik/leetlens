import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './config.js';

let app = null;
let auth = null;
let db = null;

/** Extension pages: no popupRedirectResolver (MV3 forbids loading apis.google.com). */
function createAuth(instance) {
  try {
    return initializeAuth(instance, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence]
    });
  } catch (err) {
    if (err?.code === 'auth/already-initialized') {
      return getAuth(instance);
    }
    throw err;
  }
}

export function initFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Add credentials to .env and run npm run build.');
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = createAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
}

export function getFirebaseAuth() {
  return initFirebase().auth;
}

export function getDb() {
  return initFirebase().db;
}
