'use strict';

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

const { getLeaderboard, getSquadDetails } = require('../lib/squads-server/squads-service');

(async () => {
  const sid = '6a3fa37bd827a41703a8a186';
  const hostUid = 'Hq6ehQEypqfA7BgCqWp1hLQjcls2';
  const memberUid = '9djvB0OlksOPqpnkAL2DKlII9Dq1';

  const hostLb = await getLeaderboard(sid, hostUid);
  const memberLb = await getLeaderboard(sid, memberUid);
  const squad = await getSquadDetails(sid, hostUid);

  console.log('HOST leaderboard keys:', Object.keys(hostLb));
  console.log('HOST isHost:', hostLb.isHost, 'creatorId:', hostLb.creatorId, 'members:', hostLb.members?.length);
  console.log('HOST squad isHost:', squad.isHost, 'creatorId:', squad.creatorId);
  console.log('MEMBER isHost:', memberLb.isHost);
})().catch(e => { console.error(e); process.exit(1); });
