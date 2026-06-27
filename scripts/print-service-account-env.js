#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const defaultPath = path.join(root, 'firebase-service-account.json');
const filePath = process.argv[2]
  || process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  || defaultPath;

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  console.error('Download from Firebase Console → Project settings → Service accounts → Generate new private key');
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const minified = JSON.stringify(json);
const base64 = Buffer.from(minified, 'utf8').toString('base64');

console.log('Add ONE of these to Vercel → Settings → Environment Variables (Production + Preview):\n');
console.log('--- Option A (recommended): FIREBASE_SERVICE_ACCOUNT_BASE64 ---');
console.log(base64);
console.log('\n--- Option B: FIREBASE_SERVICE_ACCOUNT (single line) ---');
console.log(minified);
console.log('\nRemove FIREBASE_SERVICE_ACCOUNT_PATH on Vercel (files are not deployed).');
console.log('After saving, redeploy the project.');
