const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const libDir = path.join(root, 'lib');

function loadEnv() {
  const env = {};
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx === -1) return;
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
    });
  }
  // Vercel injects VITE_* via process.env — prefer those over .env file
  Object.entries(process.env).forEach(([key, value]) => {
    if (value != null && value !== '' && (key.startsWith('VITE_') || key.startsWith('FIREBASE_'))) {
      env[key] = value;
    }
  });
  return env;
}

const env = loadEnv();
const define = {};
Object.entries(env).forEach(([key, value]) => {
  define[`process.env.${key}`] = JSON.stringify(value);
});

define['__OAUTH_CONFIGURED__'] = JSON.stringify(Boolean(env.VITE_GOOGLE_OAUTH_CLIENT_ID || env.VITE_CHROME_OAUTH_CLIENT_ID));
define['__GOOGLE_OAUTH_CLIENT_ID__'] = JSON.stringify(env.VITE_GOOGLE_OAUTH_CLIENT_ID || env.VITE_CHROME_OAUTH_CLIENT_ID || '');

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

define['__FIREBASE_CONFIG__'] = JSON.stringify(firebaseConfig);

if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

const builds = [
  {
    entry: 'src/dashboard-bundle.js',
    outfile: 'lib/dashboard-bundle.js'
  },
  {
    entry: 'src/background-bundle.js',
    outfile: 'lib/background-bundle.js'
  }
];

async function run() {
  for (const b of builds) {
    await esbuild.build({
      entryPoints: [path.join(root, b.entry)],
      bundle: true,
      outfile: path.join(root, b.outfile),
      format: 'iife',
      platform: 'browser',
      target: ['chrome109'],
      define,
      minify: false,
      sourcemap: false
    });
    console.log(`Built ${b.outfile}`);
  }

  // Web OAuth uses launchWebAuthFlow — no manifest oauth2 patch needed
  if (!env.VITE_GOOGLE_OAUTH_CLIENT_ID && !env.VITE_CHROME_OAUTH_CLIENT_ID) {
    console.warn('VITE_GOOGLE_OAUTH_CLIENT_ID not set — Google Sign-In will not work until configured');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
