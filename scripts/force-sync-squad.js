'use strict';

// Force-sync all members of a squad (bypasses cooldown) using current code.
// Usage: node scripts/force-sync-squad.js "SRM INSIDER"

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const { connectMongo } = require('../lib/squads-server/mongodb');
const { syncParticipant } = require('../lib/squads-server/squads-service');

(async () => {
  const name = process.argv[2] || 'SRM INSIDER';
  const db = await connectMongo();
  const squad = await db.collection('squads').findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (!squad) throw new Error('squad not found');
  const sid = String(squad._id);
  const members = await db.collection('squadMembers').find({ squadId: sid }).toArray();

  for (const m of members) {
    try {
      await syncParticipant(sid, m.userId, true);
      const lb = await db.collection('squadLeaderboard').findOne({ squadId: sid, userId: m.userId });
      console.log(`OK ${m.displayName}: points=${lb.points} E=${lb.easyDelta} M=${lb.mediumDelta} H=${lb.hardDelta} total=${lb.totalDelta}`);
    } catch (e) {
      console.log(`FAIL ${m.displayName}: ${e.message}`);
    }
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
