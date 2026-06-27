'use strict';

// Quick routing smoke test for squads catch-all parser.
function parseSegments(req) {
  const raw = req.query.path;
  if (raw) {
    return Array.isArray(raw) ? raw.filter(Boolean) : String(raw).split('/').filter(Boolean);
  }

  const urlPath = (req.url || '').split('?')[0].replace(/\/+$/, '') || '/';
  const apiPrefix = '/api/squads';
  if (urlPath === apiPrefix) return [];
  if (urlPath.startsWith(`${apiPrefix}/`)) {
    return urlPath.slice(apiPrefix.length + 1).split('/').filter(Boolean);
  }

  const relative = urlPath.replace(/^\/+/, '');
  if (relative && !relative.startsWith('api/')) {
    return relative.split('/').filter(Boolean);
  }

  return [];
}

const cases = [
  { url: '/api/squads/health', query: {}, expect: ['health'] },
  { url: '/api/squads/history', query: {}, expect: ['history'] },
  { url: '/api/squads/active', query: {}, expect: ['active'] },
  { url: '/history', query: {}, expect: ['history'] },
  { url: '/active', query: {}, expect: ['active'] },
  { url: '/6a3fa37bd827a41703a8a186/leaderboard', query: {}, expect: ['6a3fa37bd827a41703a8a186', 'leaderboard'] },
  { url: '/api/squads/6a3fa37bd827a41703a8a186', query: {}, expect: ['6a3fa37bd827a41703a8a186'] },
  { url: '/api/squads/lookup', query: { code: 'ABC' }, expect: ['lookup'] },
  { url: '/api/squads', query: {}, expect: [] }
];

let failed = 0;
for (const c of cases) {
  const got = parseSegments({ url: c.url, query: c.query });
  const ok = JSON.stringify(got) === JSON.stringify(c.expect);
  if (!ok) {
    failed++;
    console.error('FAIL', c.url, 'got', got, 'expected', c.expect);
  }
}
if (failed) process.exit(1);
console.log('parseSegments OK', cases.length, 'cases');
