'use strict';

/**
 * Verifies daily reminder skip rules (no email if user already practiced today).
 * Run: node scripts/test-reminder-logic.js
 */

function getDayBounds(dateKey) {
  const start = new Date(dateKey + 'T00:00:00');
  const end = new Date(dateKey.replace(/(\d+)-(\d+)-(\d+)/, (_, y, m, d) => {
    const dt = new Date(Number(y), Number(m) - 1, Number(d) + 1);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }) + 'T00:00:00');
  return { start, end };
}

function hasPracticedTodayFromData(todayKey, snapshot, activities, solvedProblems) {
  if (snapshot?.solvedToday > 0) return true;
  const { start, end } = getDayBounds(todayKey);
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (activities.some(a => a.endedAt >= start && a.endedAt < end)) return true;
  if (solvedProblems.some(p => p.solvedAt >= startMs && p.solvedAt < endMs)) return true;
  return false;
}

const todayKey = '2026-06-27';
const cases = [
  {
    name: 'No activity — should send reminder',
    data: { snapshot: null, activities: [], solved: [] },
    expect: false
  },
  {
    name: 'Snapshot solvedToday > 0 — skip reminder',
    data: { snapshot: { solvedToday: 2 }, activities: [], solved: [] },
    expect: true
  },
  {
    name: 'Extension activity today — skip reminder',
    data: {
      snapshot: null,
      activities: [{ endedAt: new Date(todayKey + 'T10:30:00') }],
      solved: []
    },
    expect: true
  },
  {
    name: 'Solved problem synced today — skip reminder',
    data: {
      snapshot: null,
      activities: [],
      solved: [{ solvedAt: new Date(todayKey + 'T14:00:00').getTime() }]
    },
    expect: true
  }
];

let passed = 0;
for (const c of cases) {
  const result = hasPracticedTodayFromData(todayKey, c.data.snapshot, c.data.activities, c.data.solved);
  const ok = result === c.expect;
  console.log(`${ok ? '✓' : '✗'} ${c.name}`);
  if (ok) passed++;
}

console.log(`\n${passed}/${cases.length} reminder skip checks passed.`);

if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.TEST_EMAIL_TO) {
  console.log('\nRESEND_API_KEY + TEST_EMAIL_TO set — deploy functions and trigger sendDailyReminders to verify delivery.');
} else {
  console.log('\nTo live-test Resend delivery: set RESEND_API_KEY, EMAIL_FROM, TEST_EMAIL_TO in Firebase secrets and deploy functions.');
}

process.exit(passed === cases.length ? 0 : 1);
