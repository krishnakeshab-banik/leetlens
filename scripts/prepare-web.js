const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const webDir = path.join(root, 'web');

const COPY_DIRS = ['lib', 'assets', 'data', 'icons'];
const COPY_FILES = ['dashboard.html', 'dashboard.js', 'tailwind.css', 'input.css'];
const LIB_FILES = ['dashboard-extension.js'];

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
      if (name === 'chrome-shim.js' || name === 'index.html') return;
      const p = path.join(webDir, name);
      fs.rmSync(p, { recursive: true, force: true });
    });
  } else {
    fs.mkdirSync(webDir, { recursive: true });
  }

  COPY_DIRS.forEach(dir => copyRecursive(path.join(root, dir), path.join(webDir, dir)));
  COPY_FILES.forEach(file => {
    const src = path.join(root, file);
    if (!fs.existsSync(src)) return;
    let content = fs.readFileSync(src, 'utf8');
    if (file === 'dashboard.html') content = patchDashboardHtml(content);
    fs.writeFileSync(path.join(webDir, file), content);
  });

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

  console.log('Web build prepared in web/');
}

main();
