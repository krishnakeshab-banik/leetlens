'use strict';

// Deep diagnostic: replay scoring for one member of a squad.
// Usage: node scripts/diagnose-progress.js "SRM INSIDER" <uid>

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const { MongoClient } = require('mongodb');
const { fetchUserProgress } = require('../lib/squads-server/leetcode-sync');
const { computeSlugDeltas, computePoints, toMs } = require('../lib/squads-server/scoring');

function fmt(v) {
  const t = toMs(v);
  return t ? new Date(t).toISOString() : '(none)';
}

(async () => {
  const name = process.argv[2] || 'SRM INSIDER';
  const wantUid = process.argv[3];

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || 'leetlens');

  const squad = await db.collection('squads').findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  const sid = String(squad._id);
  console.log('squad window:', fmt(squad.startTime), '->', fmt(squad.endTime));

  const members = await db.collection('squadMembers').find({ squadId: sid }).toArray();
  const targets = wantUid ? members.filter(m => m.userId === wantUid) : members;

  for (const m of targets) {
    console.log(`\n===== ${m.displayName} (${m.userId}) =====`);
    const baseline = await db.collection('squadBaselines').findOne({ squadId: sid, userId: m.userId });
    console.log('baseline solvedSlugs:', (baseline?.solvedSlugs || []).length, 'totals E/M/H/T:',
      baseline?.easy, baseline?.medium, baseline?.hard, baseline?.total);

    let progress;
    try {
      progress = await fetchUserProgress(db, m.userId);
    } catch (e) {
      console.log('fetchUserProgress FAILED:', e.message);
      continue;
    }
    console.log('live stats E/M/H/T:', progress.easySolved, progress.mediumSolved, progress.hardSolved, progress.totalSolved);
    console.log('solvedProblems fetched:', (progress.solvedProblems || []).length);

    const startMs = toMs(squad.startTime);
    const endMs = toMs(squad.endTime);
    const baselineSet = new Set((baseline?.solvedSlugs || []).map(s => String(s).toLowerCase()));

    const inWindow = (progress.solvedProblems || []).filter(p => {
      const t = toMs(p.solvedAt);
      return t >= startMs && t <= endMs;
    });
    console.log(`solves with timestamp inside window (${inWindow.length}):`);
    inWindow.slice(0, 25).forEach(p => {
      console.log(`   ${p.slug}  solvedAt=${fmt(p.solvedAt)}  diff=${p.difficulty}  inBaseline=${baselineSet.has(String(p.slug).toLowerCase())}`);
    });

    const deltas = computeSlugDeltas(progress, baseline || {}, squad);
    const points = computePoints(deltas, squad.scoringMode);
    console.log('=> computed deltas:', deltas, 'points:', points);
  }

  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
