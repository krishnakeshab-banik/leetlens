const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const libDir = path.join(root, 'lib');

const firebaseAuthWebExtension = path.join(
  root,
  'node_modules/firebase/auth/web-extension/dist/esm/index.esm.js'
);

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
  Object.entries(process.env).forEach(([key, value]) => {
    if (value != null && value !== '' && (key.startsWith('VITE_') || key.startsWith('FIREBASE_'))) {
      env[key] = value;
    }
  });
  return env;
}

const env = loadEnv();
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

function makeDefine(extra = {}) {
  const define = {
    __FIREBASE_CONFIG__: JSON.stringify(firebaseConfig),
    __AUTH_BRIDGE_URL__: JSON.stringify(
      env.VITE_AUTH_BRIDGE_URL || 'https://leetlens.srminsider.in/auth-google.html'
    ),
    __FIREBASE_GOOGLE_WEB_CLIENT_ID__: JSON.stringify(
      env.VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID || ''
    ),
    ...extra
  };
  Object.entries(env).forEach(([key, value]) => {
    define[`process.env.${key}`] = JSON.stringify(value);
  });
  return define;
}

function makePlatformPlugin(extensionBuild) {
  const platformModule = extensionBuild
    ? path.join(root, 'src/auth-google-extension.js')
    : path.join(root, 'src/auth-google-web.js');
  const firebaseInitModule = extensionBuild
    ? path.join(root, 'src/firebase-init-extension.js')
    : path.join(root, 'src/firebase-init.js');
  const authServiceModule = extensionBuild
    ? path.join(root, 'src/auth-service-extension.js')
    : path.join(root, 'src/auth-service.js');

  return {
    name: 'leetlens-platform-modules',
    setup(build) {
      build.onResolve({ filter: /auth-google-platform\.js$/ }, () => ({ path: platformModule }));
      build.onResolve({ filter: /[/\\]firebase-init\.js$/ }, () => ({ path: firebaseInitModule }));
      build.onResolve({ filter: /[/\\]auth-service\.js$/ }, () => ({ path: authServiceModule }));
    }
  };
}

async function buildBundle({ entry, outfile, extensionBuild }) {
  const alias = extensionBuild ? { 'firebase/auth': firebaseAuthWebExtension } : {};

  await esbuild.build({
    entryPoints: [path.join(root, entry)],
    bundle: true,
    outfile: path.join(root, outfile),
    format: 'iife',
    platform: 'browser',
    target: ['chrome109'],
    alias,
    plugins: [makePlatformPlugin(extensionBuild)],
    define: makeDefine({ __EXTENSION_BUILD__: extensionBuild ? 'true' : 'false' }),
    minify: false,
    sourcemap: false
  });
  console.log(`Built ${outfile}`);
}

async function run() {
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

  await buildBundle({
    entry: 'src/dashboard-bundle.js',
    outfile: 'lib/dashboard-bundle.js',
    extensionBuild: true
  });

  await buildBundle({
    entry: 'src/dashboard-bundle.js',
    outfile: 'lib/dashboard-bundle-web.js',
    extensionBuild: false
  });

  await esbuild.build({
    entryPoints: [path.join(root, 'src/background-bundle.js')],
    bundle: true,
    outfile: path.join(root, 'lib/background-bundle.js'),
    format: 'iife',
    platform: 'browser',
    target: ['chrome109'],
    define: makeDefine({ __EXTENSION_BUILD__: 'true' }),
    minify: false,
    sourcemap: false
  });
  console.log('Built lib/background-bundle.js');

  await esbuild.build({
    entryPoints: [path.join(root, 'src/auth-google-bridge.js')],
    bundle: true,
    outfile: path.join(root, 'lib/auth-google.js'),
    format: 'iife',
    platform: 'browser',
    target: ['chrome109'],
    define: makeDefine({ __EXTENSION_BUILD__: 'false' }),
    minify: false,
    sourcemap: false
  });
  console.log('Built lib/auth-google.js');

  if (!env.VITE_FIREBASE_API_KEY || !env.VITE_FIREBASE_PROJECT_ID) {
    console.warn('VITE_FIREBASE_* vars not set — cloud sign-in will not work until configured');
  }
  if (!env.VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID) {
    console.warn('VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID not set — extension Google sign-in requires the Web client ID from Firebase Console');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
