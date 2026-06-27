import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as logger from 'firebase-functions/logger';

// Re-use squads sync logic via dynamic require of shared module pattern
// Scheduled sync runs in Cloud Functions with Admin SDK already initialized

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

if (!getApps().length) initializeApp();

const db = getFirestore();

async function fetchUserProgress(uid) {
  const userSnap = await db.collection('users').doc(uid).get();
  const profile = userSnap.exists ? userSnap.data() : {};
  const statsSnap = await db.collection('users').doc(uid).collection('stats').doc('current').get();
  const stats = statsSnap.exists ? statsSnap.data() : {};
  const gh = profile.githubStats || {};
  return {
    totalSolved: stats.totalSolved || 0,
    easySolved: stats.easySolved || 0,
    mediumSolved: stats.mediumSolved || 0,
    hardSolved: stats.hardSolved || 0,
    githubContributions: gh.totalContributions || gh.contributionsThisYear || 0
  };
}

function computeDeltas(current, baseline) {
  return {
    easyDelta: Math.max(0, (current.easySolved || 0) - (baseline.easy || 0)),
    mediumDelta: Math.max(0, (current.mediumSolved || 0) - (baseline.medium || 0)),
    hardDelta: Math.max(0, (current.hardSolved || 0) - (baseline.hard || 0)),
    totalDelta: Math.max(0, (current.totalSolved || 0) - (baseline.total || 0)),
    githubDelta: Math.max(0, (current.githubContributions || 0) - (baseline.githubContributions || 0))
  };
}

function computePoints(deltas, mode) {
  if (mode === 'total') return deltas.totalDelta;
  return deltas.easyDelta + deltas.mediumDelta * 3 + deltas.hardDelta * 5;
}

function squadStatus(startMs, endMs, status, now = Date.now()) {
  if (status === 'ended') return 'ended';
  if (now < startMs) return 'scheduled';
  if (now >= endMs) return 'ended';
  return 'active';
}

export const squadsScheduledSync = onSchedule(
  { schedule: 'every 6 hours', timeZone: 'UTC' },
  async () => {
    const squadsSnap = await db.collection('squads').where('status', 'in', ['scheduled', 'active']).get();
    let synced = 0;
    for (const doc of squadsSnap.docs) {
      const squad = doc.data();
      const startMs = squad.startTime?.toMillis?.() || 0;
      const endMs = squad.endTime?.toMillis?.() || 0;
      const status = squadStatus(startMs, endMs, squad.status);
      if (status === 'ended') {
        await doc.ref.update({ status: 'ended' });
        continue;
      }
      if (status === 'active' && squad.status !== 'active') {
        await doc.ref.update({ status: 'active' });
      }
      const members = await doc.ref.collection('members').get();
      for (const m of members.docs) {
        const uid = m.id;
        const member = m.data();
        const baselineSnap = await doc.ref.collection('baselines').doc(uid).get();
        if (!baselineSnap.exists) continue;
        const baseline = baselineSnap.data();
        const progress = await fetchUserProgress(uid);
        const deltas = computeDeltas(progress, baseline);
        const points = computePoints(deltas, squad.scoringMode);
        await doc.ref.collection('leaderboard').doc(uid).set({
          userId: uid,
          displayName: member.displayName,
          squadNickname: member.squadNickname || null,
          ...deltas,
          points,
          lastUpdatedAt: FieldValue.serverTimestamp()
        }, { merge: true });
        synced++;
      }
    }
    logger.info(`Squads scheduled sync complete: ${synced} participants updated`);
  }
);
