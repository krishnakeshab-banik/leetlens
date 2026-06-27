'use strict';

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let initialized = false;

function stripBom(value) {
  return String(value || '').replace(/^\uFEFF/, '');
}

function validateServiceAccount(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;
  if (!parsed.client_email || !parsed.private_key) return null;
  if (typeof parsed.private_key === 'string') {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }
  return parsed;
}

function parseServiceAccountJson(raw) {
  let text = stripBom(raw).trim();
  if (!text) return null;

  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  const candidates = [text];

  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    try {
      const unwrapped = JSON.parse(text);
      if (typeof unwrapped === 'string' && unwrapped.trim()) {
        candidates.push(unwrapped.trim());
      }
    } catch (_) {}
  }

  for (const candidate of candidates) {
    try {
      let parsed = JSON.parse(candidate);
      if (Array.isArray(parsed) && parsed.length === 1 && parsed[0] && typeof parsed[0] === 'object') {
        parsed = parsed[0];
      }
      parsed = validateServiceAccount(parsed);
      if (parsed) return parsed;
    } catch (_) {}
  }

  if (text.startsWith('{{') && text.endsWith('}}')) {
    candidates.push(text.slice(1, -1).trim());
    try {
      const parsed = validateServiceAccount(JSON.parse(text.slice(1, -1).trim()));
      if (parsed) return parsed;
    } catch (_) {}
  }

  if (text.includes('"private_key"')) {
    try {
      const fixed = text.replace(
        /("private_key"\s*:\s*")([\s\S]*?)(")/,
        (_, open, keyBody, close) => open + keyBody.replace(/\r?\n/g, '\\n') + close
      );
      const parsed = validateServiceAccount(JSON.parse(fixed));
      if (parsed) return parsed;
    } catch (_) {}
  }

  return null;
}

function loadServiceAccountFromBase64(raw) {
  try {
    let text = stripBom(raw).trim();
    if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
      text = text.slice(1, -1).trim();
    }
    text = text.replace(/\s/g, '');
    if (!text) return null;
    const decoded = Buffer.from(text, 'base64').toString('utf8');
    return parseServiceAccountJson(decoded);
  } catch (_) {
    return null;
  }
}

function loadServiceAccountFromFile(filePath) {
  const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    throw Object.assign(new Error(`Service account file not found: ${filePath}`), { status: 500 });
  }
  try {
    const parsed = parseServiceAccountJson(fs.readFileSync(resolved, 'utf8'));
    if (parsed) return parsed;
    throw new Error('invalid JSON');
  } catch (_) {
    throw Object.assign(new Error(`Could not parse service account file: ${filePath}`), { status: 500 });
  }
}

function loadServiceAccount() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (inline?.trim()) {
    const parsed = parseServiceAccountJson(inline);
    if (parsed) return parsed;
    throw Object.assign(new Error(
      'FIREBASE_SERVICE_ACCOUNT is invalid JSON. Paste the raw JSON object once (starts with { ends with }), not wrapped in [] or extra quotes. Easiest fix: use FIREBASE_SERVICE_ACCOUNT_BASE64 from node scripts/print-service-account-env.js'
    ), { status: 500 });
  }

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (base64?.trim()) {
    const parsed = loadServiceAccountFromBase64(base64);
    if (parsed) return parsed;
    throw Object.assign(new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is invalid'), { status: 500 });
  }

  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath) {
    return loadServiceAccountFromFile(filePath);
  }

  throw Object.assign(new Error(
    'Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT (minified JSON), FIREBASE_SERVICE_ACCOUNT_BASE64, or FIREBASE_SERVICE_ACCOUNT_PATH for local dev — see .env.example'
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
  Timestamp: admin.firestore.Timestamp,
  parseServiceAccountJson
};
