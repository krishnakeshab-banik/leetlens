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
  Object.entries(process.env).forEach(([key, value]) => {
    if (value != null && value !== '' && (key.startsWith('VITE_') || key.startsWith('FIREBASE_'))) {
      env[key] = value;
    }
  });
  return env;
}

function aliasPlugin(targetFile, stubFile) {
  return {
    name: `alias-${targetFile}`,
    setup(build) {
      build.onResolve({ filter: new RegExp(`/${targetFile.replace('.', '\\.')}$`) }, () => ({
        path: path.join(root, 'src/stubs', stubFile)
      }));
    }
  };
}

function replaceModulePlugin(moduleName, replacementPath) {
  return {
    name: `replace-${moduleName}`,
    setup(build) {
      build.onResolve({ filter: new RegExp(`/${moduleName.replace('.', '\\.')}$`) }, () => ({
        path: path.join(root, replacementPath)
      }));
    }
  };
}

const env = loadEnv();
const define = {};
Object.entries(env).forEach(([key, value]) => {
  define[`process.env.${key}`] = JSON.stringify(value);
});

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
define['__FIREBASE_GOOGLE_WEB_CLIENT_ID__'] = JSON.stringify(
  env.VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID || ''
);

if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

const sharedBuildOptions = {
  format: 'iife',
  platform: 'browser',
  target: ['chrome109'],
  define,
  minify: false,
  sourcemap: false
};

async function run() {
  await esbuild.build({
    ...sharedBuildOptions,
    entryPoints: [path.join(root, 'src/dashboard-bundle.js')],
    bundle: true,
    outfile: path.join(root, 'lib/dashboard-bundle.js'),
    plugins: [
      aliasPlugin('auth-google-web.js', 'auth-google-web-stub.js'),
      replaceModulePlugin('firebase-init.js', 'src/firebase-init-extension.js')
    ]
  });
  console.log('Built lib/dashboard-bundle.js (extension — no apis.google.com)');

  await esbuild.build({
    ...sharedBuildOptions,
    entryPoints: [path.join(root, 'src/dashboard-bundle.js')],
    bundle: true,
    outfile: path.join(root, 'lib/dashboard-bundle-web.js'),
    plugins: [aliasPlugin('auth-google-extension.js', 'auth-google-extension-stub.js')]
  });
  console.log('Built lib/dashboard-bundle-web.js (web dashboard)');

  await esbuild.build({
    ...sharedBuildOptions,
    entryPoints: [path.join(root, 'src/background-bundle.js')],
    bundle: true,
    outfile: path.join(root, 'lib/background-bundle.js')
  });
  console.log('Built lib/background-bundle.js');

  await esbuild.build({
    ...sharedBuildOptions,
    entryPoints: [path.join(root, 'src/vercel-analytics.js')],
    bundle: true,
    outfile: path.join(root, 'vercel-analytics.js')
  });
  console.log('Built vercel-analytics.js (web only)');

  if (!env.VITE_FIREBASE_API_KEY || !env.VITE_FIREBASE_PROJECT_ID) {
    console.warn('VITE_FIREBASE_* vars not set — cloud sign-in will not work until configured');
  }
  if (!env.VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID) {
    console.warn('VITE_FIREBASE_GOOGLE_WEB_CLIENT_ID not set — extension Google sign-in needs the Web client ID from Firebase Console → Authentication → Google');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
