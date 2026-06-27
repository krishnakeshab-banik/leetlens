'use strict';

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let initialized = false;

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw?.trim()) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      throw Object.assign(new Error('FIREBASE_SERVICE_ACCOUNT is invalid JSON'), { status: 500 });
    }
  }

  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath) {
    const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(resolved)) {
      throw Object.assign(new Error(`Service account file not found: ${filePath}`), { status: 500 });
    }
    try {
      return JSON.parse(fs.readFileSync(resolved, 'utf8'));
    } catch (_) {
      throw Object.assign(new Error(`Could not parse service account file: ${filePath}`), { status: 500 });
    }
  }

  throw Object.assign(new Error(
    'Firebase Admin not configured. Add FIREBASE_SERVICE_ACCOUNT (minified JSON) or FIREBASE_SERVICE_ACCOUNT_PATH (path to JSON key file) to .env — see .env.example'
  ), { status: 500 });
}

function ensureInitialized() {
  if (initialized && admin.apps.length) return;
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(loadServiceAccount()) });
  }
  initialized = true;
}

function getFirestore() {
  ensureInitialized();
  return admin.firestore();
}

function getAuth() {
  ensureInitialized();
  return admin.auth();
}

function initAdmin() {
  return getFirestore();
}

module.exports = {
  initAdmin,
  getFirestore,
  getAuth,
  admin,
  FieldValue: admin.firestore.FieldValue,
  Timestamp: admin.firestore.Timestamp
};
