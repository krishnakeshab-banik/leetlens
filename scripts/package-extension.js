const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'dist', 'extension');
const zipPath = path.join(root, 'dist', 'leetlens-extension.zip');

const COPY_FILES = [
  'manifest.json',
  'background.js',
  'content.js',
  'sidebar.js',
  'sidebar.css',
  'popup.html',
  'popup.js',
  'dashboard.html',
  'dashboard.js',
  'revision.html',
  'revision.js',
  'tailwind.css',
  'offscreen.html',
  'offscreen.js'
];

const COPY_DIRS = ['icons', 'lib', 'data', 'assets'];

const REQUIRED_BUILT = [
  'lib/dashboard-bundle.js',
  'lib/background-bundle.js'
];

function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(name => copyRecursive(path.join(src, name), path.join(dest, name)));
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function zipFolder(sourceDir, destinationZip) {
  rmrf(destinationZip);
  if (process.platform === 'win32') {
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${sourceDir.replace(/'/g, "''")}\\*' -DestinationPath '${destinationZip.replace(/'/g, "''")}' -Force"`,
      { stdio: 'inherit' }
    );
    return;
  }
  const parent = path.dirname(sourceDir);
  const folderName = path.basename(sourceDir);
  execSync(`cd "${parent}" && zip -r "${destinationZip}" "${folderName}"`, { stdio: 'inherit' });
}

function main() {
  console.log('Building extension bundles...');
  execSync('node scripts/build.js', { cwd: root, stdio: 'inherit' });

  const missing = REQUIRED_BUILT.filter(rel => !fs.existsSync(path.join(root, rel)));
  if (missing.length) {
    console.error('Missing required build outputs:');
    missing.forEach(file => console.error(`  - ${file}`));
    process.exit(1);
  }

  rmrf(outDir);
  fs.mkdirSync(outDir, { recursive: true });

  COPY_FILES.forEach(file => {
    const src = path.join(root, file);
    if (!fs.existsSync(src)) {
      console.error(`Missing required file: ${file}`);
      process.exit(1);
    }
    fs.copyFileSync(src, path.join(outDir, file));
  });

  COPY_DIRS.forEach(dir => {
    const src = path.join(root, dir);
    if (!fs.existsSync(src)) {
      console.error(`Missing required directory: ${dir}`);
      process.exit(1);
    }
    copyRecursive(src, path.join(outDir, dir));
  });

  fs.mkdirSync(path.dirname(zipPath), { recursive: true });
  zipFolder(outDir, zipPath);

  console.log(`\nChrome Web Store package ready:\n  ${zipPath}`);
  console.log('Upload this zip in Chrome Developer Dashboard.');
  console.log('manifest.json is at the zip root (only one manifest).');
}

main();
