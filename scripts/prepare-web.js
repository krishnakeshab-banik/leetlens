const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const webDir = path.join(root, 'web');

const SITE_URL = 'https://leetlens.srminsider.in';
const SITE_NAME = 'LeetLens';
const SITE_DESCRIPTION =
  'LeetLens is a LeetCode analytics dashboard and progress tracker. Track practice time, sync LeetCode stats, review with spaced repetition, and monitor coding interview prep.';
const OG_IMAGE = `${SITE_URL}/icons/icon128.png`;

const COPY_DIRS = ['lib', 'assets', 'data', 'icons'];
const COPY_FILES = ['dashboard.html', 'dashboard.js', 'tailwind.css', 'input.css', 'auth-google.html', 'google27c406003378d777.html', 'vercel-analytics.js'];
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
  const webBoot = [
    '  <script src="chrome-shim.js"></script>',
    '  <script>window.__LEETLENS_WEB__ = true;</script>'
  ].join('\n') + '\n';

  if (!content.includes('chrome-shim.js')) {
    content = content.replace(/<body([^>]*)>/, `<body$1>\n${webBoot}`);
  } else if (!content.includes('__LEETLENS_WEB__')) {
    content = content.replace(
      /(<script src="chrome-shim\.js"><\/script>\s*)/,
      `$1  <script>window.__LEETLENS_WEB__ = true;</script>\n`
    );
  }
  if (!content.includes('vercel-analytics.js')) {
    content = content.replace(
      /<\/body>/,
      '  <script src="vercel-analytics.js"></script>\n</body>'
    );
  }
  return content;
}

function writeRobotsTxt() {
  const robots = `# LeetLens — https://leetlens.srminsider.in
User-agent: *
Allow: /
Disallow: /auth-google.html

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(webDir, 'robots.txt'), robots);
}

function writeSitemapXml() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/dashboard</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`;
  fs.writeFileSync(path.join(webDir, 'sitemap.xml'), sitemap);
}

function writeIndexHtml() {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${SITE_NAME} — LeetCode Analytics Dashboard &amp; Progress Tracker</title>
  <meta name="description" content="${SITE_DESCRIPTION}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0b0b0c" />
  <link rel="canonical" href="${SITE_URL}/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${SITE_NAME} — LeetCode Analytics Dashboard &amp; Progress Tracker" />
  <meta property="og:description" content="${SITE_DESCRIPTION}" />
  <meta property="og:url" content="${SITE_URL}/" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${SITE_NAME} — LeetCode Analytics Dashboard" />
  <meta name="twitter:description" content="${SITE_DESCRIPTION}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <link rel="icon" href="/icons/icon48.png" type="image/png" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "${SITE_URL}/#website",
        "url": "${SITE_URL}/",
        "name": "${SITE_NAME}",
        "description": "${SITE_DESCRIPTION}",
        "publisher": { "@id": "${SITE_URL}/#organization" }
      },
      {
        "@type": "Organization",
        "@id": "${SITE_URL}/#organization",
        "name": "${SITE_NAME}",
        "url": "${SITE_URL}/",
        "logo": "${OG_IMAGE}"
      },
      {
        "@type": "SoftwareApplication",
        "@id": "${SITE_URL}/#software",
        "name": "${SITE_NAME}",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web, Chrome",
        "description": "${SITE_DESCRIPTION}",
        "url": "${SITE_URL}/dashboard",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }
    ]
  }
  </script>
  <style>
    :root { color-scheme: dark; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: #0b0b0c;
      color: #e5e1e4;
      line-height: 1.6;
    }
    main { max-width: 720px; margin: 0 auto; padding: 48px 24px 64px; }
    h1 { font-size: 1.75rem; letter-spacing: -0.02em; margin: 0 0 12px; }
    .lead { color: #8b949e; margin: 0 0 24px; }
    ul { padding-left: 1.25rem; color: #c9c4c8; }
    a { color: #ffa116; }
    .cta {
      display: inline-block;
      margin-top: 28px;
      padding: 12px 20px;
      background: #ffa116;
      color: #0b0b0c;
      text-decoration: none;
      font-weight: 700;
      border-radius: 12px;
    }
    .redirect-note { margin-top: 32px; font-size: 0.875rem; color: #8b949e; }
  </style>
  <script>
    (function () {
      var target = '/dashboard';
      if (location.pathname === '/' || location.pathname.endsWith('/index.html')) {
        location.replace(target);
      }
    })();
  </script>
</head>
<body>
  <main>
    <h1>${SITE_NAME} — LeetCode Analytics &amp; Progress Tracker</h1>
    <p class="lead">${SITE_DESCRIPTION}</p>
    <p>LeetLens helps you master coding interview prep with a dedicated LeetCode dashboard, practice analytics, and coding interview analytics in one place.</p>
    <ul>
      <li>LeetCode progress tracker with difficulty breakdown and streaks</li>
      <li>LeetCode analytics dashboard for time spent and problem ratings</li>
      <li>Spaced revision schedule and weekly planning</li>
      <li>Chrome extension for automatic LeetCode session tracking</li>
    </ul>
    <a class="cta" href="/dashboard">Open LeetLens Dashboard</a>
    <p class="redirect-note">Redirecting to your dashboard… <a href="/dashboard">Continue now</a></p>
  </main>
  <script src="vercel-analytics.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(webDir, 'index.html'), indexHtml);
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

  const webBundleSrc = path.join(root, 'lib', 'dashboard-bundle-web.js');
  if (fs.existsSync(webBundleSrc)) {
    fs.copyFileSync(webBundleSrc, path.join(webDir, 'lib', 'dashboard-bundle.js'));
  }

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

  writeIndexHtml();
  writeRobotsTxt();
  writeSitemapXml();

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
