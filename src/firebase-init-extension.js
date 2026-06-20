import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './config.js';

let app = null;
let auth = null;
let db = null;

function createAuth(instance) {
  try {
    return initializeAuth(instance, {
      persistence: [indexedDBLocalPersistence, inMemoryPersistence]
    });
  } catch (_) {
    return getAuth(instance);
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
