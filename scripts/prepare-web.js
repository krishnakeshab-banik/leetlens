const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const webDir = path.join(root, 'web');

const COPY_DIRS = ['lib', 'assets', 'data', 'icons'];
const COPY_FILES = ['dashboard.html', 'dashboard.js', 'tailwind.css', 'input.css', 'auth-google.html'];
const REQUIRED_LIB_FILES = [
  'dashboard-bundle.js',
  'dashboard-cloud-ui.js',
  'dashboard-heatmap.js',
  'dashboard-striver.js',
  'dashboard-plan.js',
  'dashboard-analytics.js',
  'dashboard-github.js',
  'dashboard-extension.js',
  'dashboard-developers.js',
  'dashboard-enhanced.css'
];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(name => copyRecursive(path.join(src, name), path.join(dest, name)));
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function patchDashboardHtml(content) {
  const shim = '  <script src="chrome-shim.js"></script>\n';
  if (content.includes('chrome-shim.js')) return content;
  return content.replace(/<body([^>]*)>/, `<body$1>\n${shim}`);
}

function main() {
  if (fs.existsSync(webDir)) {
    fs.readdirSync(webDir).forEach(name => {
      if (name === 'index.html') return;
      const p = path.join(webDir, name);
      fs.rmSync(p, { recursive: true, force: true });
    });
  } else {
    fs.mkdirSync(webDir, { recursive: true });
  }

  const shimSrc = path.join(root, 'chrome-shim.js');
  if (fs.existsSync(shimSrc)) {
    fs.copyFileSync(shimSrc, path.join(webDir, 'chrome-shim.js'));
  }

  COPY_DIRS.forEach(dir => copyRecursive(path.join(root, dir), path.join(webDir, dir)));
  COPY_FILES.forEach(file => {
    const src = path.join(root, file);
    if (!fs.existsSync(src)) return;
    let content = fs.readFileSync(src, 'utf8');
    if (file === 'dashboard.html') content = patchDashboardHtml(content);
    fs.writeFileSync(path.join(webDir, file), content);
  });

  const authBridgeSrc = path.join(root, 'lib', 'auth-google.js');
  if (fs.existsSync(authBridgeSrc)) {
    fs.copyFileSync(authBridgeSrc, path.join(webDir, 'auth-google.js'));
  }

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0;url=dashboard.html" />
  <title>LeetLens Dashboard</title>
</head>
<body>
  <p>Redirecting to <a href="dashboard.html">LeetLens Dashboard</a>…</p>
</body>
</html>`;
  fs.writeFileSync(path.join(webDir, 'index.html'), indexHtml);

  const missing = REQUIRED_LIB_FILES.filter(name => !fs.existsSync(path.join(webDir, 'lib', name)));
  if (missing.length) {
    console.error('Missing required web assets in lib/:');
    missing.forEach(name => console.error(`  - ${name}`));
    console.error('Ensure lib/ source files are committed to git (see .gitignore).');
    process.exit(1);
  }

  console.log('Web build prepared in web/');
}

main();
