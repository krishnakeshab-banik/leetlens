'use strict';

// Routing smoke test for api/squads.js segment parser (mirrors production rewrite).
function parseSegments(req) {
  for (const key of ['segments', 'path']) {
    const raw = req.query[key];
    if (raw == null || raw === '') continue;
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return String(raw).split('/').filter(Boolean);
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
  { url: '/api/squads?segments=health', query: { segments: 'health' }, expect: ['health'] },
  { url: '/api/squads?segments=history', query: { segments: 'history' }, expect: ['history'] },
  { url: '/api/squads?segments=active', query: { segments: 'active' }, expect: ['active'] },
  { url: '/api/squads?segments=6a3fa37bd827a41703a8a186/leaderboard', query: { segments: '6a3fa37bd827a41703a8a186/leaderboard' }, expect: ['6a3fa37bd827a41703a8a186', 'leaderboard'] },
  { url: '/api/squads?segments=6a3fa37bd827a41703a8a186/results', query: { segments: '6a3fa37bd827a41703a8a186/results' }, expect: ['6a3fa37bd827a41703a8a186', 'results'] },
  { url: '/api/squads/health', query: {}, expect: ['health'] },
  { url: '/api/squads/history', query: {}, expect: ['history'] },
  { url: '/api/squads/6a3fa37bd827a41703a8a186/leaderboard', query: {}, expect: ['6a3fa37bd827a41703a8a186', 'leaderboard'] },
  { url: '/history', query: {}, expect: ['history'] },
  { url: '/6a3fa37bd827a41703a8a186/leaderboard', query: {}, expect: ['6a3fa37bd827a41703a8a186', 'leaderboard'] }
];

let failed = 0;
for (const c of cases) {
  const got = parseSegments({ url: c.url, query: c.query });
  const ok = JSON.stringify(got) === JSON.stringify(c.expect);
  if (!ok) {
    failed++;
    console.error('FAIL', c.url, JSON.stringify(c.query), 'got', got, 'expected', c.expect);
  }
}

require('../api/squads.js');
console.log('api/squads.js loads OK');

if (failed) process.exit(1);
console.log('parseSegments OK', cases.length, 'cases');
