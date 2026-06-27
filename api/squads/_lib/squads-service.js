'use strict';

const { ObjectId } = require('mongodb');
const { connectMongo } = require('./mongodb');
const { generateSquadCode } = require('./codes');
const { computeDeltas, computePoints, rankEntries, squadStatus, pickDeltas, toMs } = require('./scoring');
const { sanitizeSquad, sanitizeLeaderboardEntry, publicDisplayName } = require('./sanitize');
const { fetchUserProgress } = require('./leetcode-sync');

function parseTime(dateStr, timeStr) {
  if (!dateStr) return null;
  const t = timeStr || '00:00';
  const iso = `${dateStr}T${t.length === 5 ? t + ':00' : t}`;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : ms;
}

function computeSchedule(body) {
  const startMs = parseTime(body.startDate, body.startTime);
  if (!startMs) throw Object.assign(new Error('Start date is required'), { status: 400 });

  const now = Date.now();
  if (startMs <= now) {
    throw Object.assign(new Error('Start date and time must be in the future'), { status: 400 });
  }

  const type = body.competitionType || 'custom';
  let endMs;

  if (type === 'daily') {
    endMs = startMs + 24 * 60 * 60 * 1000;
  } else if (type === 'weekly') {
    endMs = startMs + 7 * 24 * 60 * 60 * 1000;
  } else if (type === 'monthly') {
    endMs = startMs + 30 * 24 * 60 * 60 * 1000;
  } else {
    endMs = parseTime(body.endDate, body.endTime);
    if (!endMs || endMs <= startMs) {
      throw Object.assign(new Error('Invalid schedule — end must be after start'), { status: 400 });
    }
  }

  if (endMs <= now) {
    throw Object.assign(new Error('Competition end time must be in the future'), { status: 400 });
  }

  return { startMs, endMs };
}

function inviteBaseUrl() {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL.replace(/\/$/, '');
  return 'https://leetlens.srminsider.in';
}

async function ensureUniqueCode(db) {
  for (let i = 0; i < 12; i++) {
    const code = generateSquadCode();
    const existing = await db.collection('squadCodes').findOne({ code });
    if (!existing) return code;
  }
  throw new Error('Could not generate squad code');
}

function checkEligibility(stats, rules) {
  if (!rules || rules.noRestrictions) return { ok: true };
  if ((rules.minTotal || 0) > (stats.totalSolved || 0)) {
    return { ok: false, error: `Minimum ${rules.minTotal} total solved required` };
  }
  if ((rules.minEasy || 0) > (stats.easySolved || 0)) {
    return { ok: false, error: `Minimum ${rules.minEasy} Easy solved required` };
  }
  if ((rules.minMedium || 0) > (stats.mediumSolved || 0)) {
    return { ok: false, error: `Minimum ${rules.minMedium} Medium solved required` };
  }
  if ((rules.minHard || 0) > (stats.hardSolved || 0)) {
    return { ok: false, error: `Minimum ${rules.minHard} Hard solved required` };
  }
  return { ok: true };
}

async function getMemberCount(db, squadId) {
  return db.collection('squadMembers').countDocuments({ squadId: String(squadId) });
}

async function captureBaseline(db, squadId, uid, progress) {
  const baseline = {
    squadId: String(squadId),
    userId: uid,
    easy: progress.easySolved || 0,
    medium: progress.mediumSolved || 0,
    hard: progress.hardSolved || 0,
    total: progress.totalSolved || 0,
    githubContributions: progress.githubContributions || 0,
    solvedSlugs: progress.solvedSlugs || [],
    capturedAt: new Date()
  };
  await db.collection('squadBaselines').updateOne(
    { squadId: String(squadId), userId: uid },
    { $set: baseline },
    { upsert: true }
  );
  return baseline;
}

async function ensureCompetitionBaselines(db, squad) {
  if (!squad || squad.baselinesLockedAtStart) return squad;
  if (squadStatus(squad) !== 'active') return squad;

  const sid = String(squad._id);
  const members = await db.collection('squadMembers').find({ squadId: sid }).toArray();
  for (const m of members) {
    const progress = await fetchUserProgress(db, m.userId);
    const baseline = await captureBaseline(db, sid, m.userId, progress);
    await updateLeaderboardForUser(db, sid, m.userId, m, baseline, progress, squad.scoringMode, squad);
  }

  await db.collection('squads').updateOne(
    { _id: squad._id },
    { $set: { baselinesLockedAtStart: new Date(), status: 'active' } }
  );

  return { ...squad, baselinesLockedAtStart: new Date(), status: 'active' };
}

async function updateLeaderboardForUser(db, squadId, uid, member, baseline, progress, scoringMode, squad = null) {
  const status = squad ? squadStatus(squad) : 'active';
  const deltas = status === 'scheduled'
    ? { easyDelta: 0, mediumDelta: 0, hardDelta: 0, totalDelta: 0, githubDelta: 0, lastSolveAt: null }
    : pickDeltas(progress, baseline, squad || {});
  const points = computePoints(deltas, scoringMode);
  const entry = {
    squadId: String(squadId),
    userId: uid,
    displayName: member.displayName,
    squadNickname: member.squadNickname || null,
    ...deltas,
    points,
    lastSolveAt: deltas.lastSolveAt ? new Date(deltas.lastSolveAt) : null,
    lastUpdatedAt: new Date()
  };
  await db.collection('squadLeaderboard').updateOne(
    { squadId: String(squadId), userId: uid },
    { $set: entry },
    { upsert: true }
  );
  return entry;
}

async function recomputeRanks(db, squadId) {
  const sid = String(squadId);
  const entries = await db.collection('squadLeaderboard').find({ squadId: sid }).toArray();
  const ranked = rankEntries(entries);
  await Promise.all(ranked.map(e =>
    db.collection('squadLeaderboard').updateOne(
      { squadId: sid, userId: e.userId },
      { $set: { rank: e.rank } }
    )
  ));
  return ranked;
}

async function createSquad(uid, userRecord, body) {
  const db = await connectMongo();
  const { startMs, endMs } = computeSchedule(body);
  if (!body.name?.trim()) throw Object.assign(new Error('Squad name is required'), { status: 400 });

  const code = await ensureUniqueCode(db);
  const squadId = new ObjectId();
  const displayName = userRecord.displayName || userRecord.name || 'LeetLens User';
  const now = new Date();

  const squad = {
    _id: squadId,
    name: body.name.trim(),
    description: (body.description || '').trim(),
    code,
    creatorId: uid,
    creatorDisplayName: displayName,
    visibility: body.visibility === 'public' ? 'public' : 'private',
    maxMembers: Math.min(Math.max(Number(body.maxMembers) || 10, 2), 100),
    startTime: new Date(startMs),
    endTime: new Date(endMs),
    status: 'scheduled',
    competitionType: body.competitionType || 'custom',
    scoringMode: body.scoringMode === 'total' ? 'total' : 'weighted',
    goals: Array.isArray(body.goals) ? body.goals : [],
    rules: {
      minTotal: Number(body.minTotal) || 0,
      minEasy: Number(body.minEasy) || 0,
      minMedium: Number(body.minMedium) || 0,
      minHard: Number(body.minHard) || 0,
      noRestrictions: !!body.noRestrictions
    },
    memberCount: 1,
    createdAt: now
  };

  const sid = String(squadId);
  const member = {
    squadId: sid,
    userId: uid,
    displayName,
    squadNickname: null,
    role: 'creator',
    joinedAt: now
  };

  await db.collection('squads').insertOne(squad);
  await db.collection('squadCodes').insertOne({ code, squadId: sid });
  await db.collection('squadMembers').insertOne(member);

  const progress = await fetchUserProgress(db, uid);
  const baseline = await captureBaseline(db, sid, uid, progress);
  await updateLeaderboardForUser(db, sid, uid, member, baseline, progress, squad.scoringMode, squad);

  await db.collection('userSquads').insertOne({
    userId: uid,
    squadId: sid,
    name: squad.name,
    code,
    status: 'scheduled',
    joinedAt: now,
    role: 'creator'
  });

  return sanitizeSquad(
    { id: sid, ...squad },
    { memberCount: 1, inviteUrl: `${inviteBaseUrl()}/squads/join/${code}` }
  );
}

async function joinSquad(uid, userRecord, body) {
  const db = await connectMongo();
  const code = String(body.code || '').trim().toUpperCase();
  if (!code) throw Object.assign(new Error('Squad code required'), { status: 400 });

  const codeDoc = await db.collection('squadCodes').findOne({ code });
  if (!codeDoc) throw Object.assign(new Error('Squad not found'), { status: 404 });
  const squadId = codeDoc.squadId;

  const squad = await db.collection('squads').findOne({ _id: new ObjectId(squadId) });
  if (!squad) throw Object.assign(new Error('Squad not found'), { status: 404 });

  const existingMember = await db.collection('squadMembers').findOne({ squadId, userId: uid });
  if (existingMember) throw Object.assign(new Error('Already joined this squad'), { status: 409 });

  const status = squadStatus(squad);
  if (status === 'ended') throw Object.assign(new Error('Competition has ended'), { status: 400 });

  const memberCount = await getMemberCount(db, squadId);
  if (memberCount >= squad.maxMembers) throw Object.assign(new Error('Squad is full'), { status: 400 });

  const progress = await fetchUserProgress(db, uid);
  const elig = checkEligibility(progress, squad.rules);
  if (!elig.ok) throw Object.assign(new Error(elig.error), { status: 403 });

  const displayName = userRecord.displayName || userRecord.name || 'LeetLens User';
  const squadNickname = (body.squadNickname || '').trim() || null;
  const now = new Date();
  const member = {
    squadId,
    userId: uid,
    displayName,
    squadNickname,
    role: 'member',
    joinedAt: now
  };

  await db.collection('squadMembers').insertOne(member);
  const baseline = await captureBaseline(db, squadId, uid, progress);
  await updateLeaderboardForUser(db, squadId, uid, member, baseline, progress, squad.scoringMode, squad);
  await recomputeRanks(db, squadId);
  await db.collection('squads').updateOne({ _id: new ObjectId(squadId) }, { $set: { memberCount: memberCount + 1 } });

  await db.collection('userSquads').insertOne({
    userId: uid,
    squadId,
    name: squad.name,
    code: squad.code,
    status,
    joinedAt: now,
    role: 'member'
  });

  return sanitizeSquad({ id: squadId, ...squad }, { memberCount: memberCount + 1, status });
}

async function lookupByCode(code) {
  const db = await connectMongo();
  const normalized = String(code || '').trim().toUpperCase();
  const codeDoc = await db.collection('squadCodes').findOne({ code: normalized });
  if (!codeDoc) throw Object.assign(new Error('Squad not found'), { status: 404 });

  const squad = await db.collection('squads').findOne({ _id: new ObjectId(codeDoc.squadId) });
  if (!squad) throw Object.assign(new Error('Squad not found'), { status: 404 });

  const status = squadStatus(squad);
  return sanitizeSquad(
    { id: String(squad._id), ...squad },
    { memberCount: squad.memberCount || 0, status, canJoin: status !== 'ended' }
  );
}

async function getSquadDetails(squadId, uid) {
  const db = await connectMongo();
  const squad = await db.collection('squads').findOne({ _id: new ObjectId(squadId) });
  if (!squad) throw Object.assign(new Error('Squad not found'), { status: 404 });

  const member = await db.collection('squadMembers').findOne({ squadId: String(squadId), userId: uid });
  if (!member) throw Object.assign(new Error('Not a squad member'), { status: 403 });

  const status = squadStatus(squad);
  return sanitizeSquad(
    { id: String(squad._id), ...squad },
    { memberCount: squad.memberCount || 0, status, isMember: true }
  );
}

async function getLeaderboard(squadId, uid) {
  const db = await connectMongo();
  const sid = String(squadId);
  const member = await db.collection('squadMembers').findOne({ squadId: sid, userId: uid });
  if (!member) throw Object.assign(new Error('Not a squad member'), { status: 403 });

  const squad = await db.collection('squads').findOne({ _id: new ObjectId(sid) });
  const status = squadStatus(squad || {});

  if (status === 'ended') {
    await finalizeSquad(sid, uid);
  } else {
    try {
      await smartSyncIfStale(squadId, uid);
    } catch (_) {}
  }

  await recomputeRanks(db, sid);
  const lbEntries = await db.collection('squadLeaderboard').find({ squadId: sid }).toArray();
  const entries = lbEntries.map(e => sanitizeLeaderboardEntry(e, uid)).sort((a, b) => a.rank - b.rank);

  const you = entries.find(e => e.isYou);
  const nextRank = entries.find(e => e.rank === (you?.rank || 0) - 1);
  const positionCard = you ? {
    rank: you.rank,
    points: you.points,
    totalDelta: you.totalDelta,
    distanceToNext: nextRank ? Math.max(0, nextRank.points - you.points) : 0,
    nextRank: nextRank ? nextRank.rank : null
  } : null;

  return {
    squadId: sid,
    status,
    scoringMode: squad?.scoringMode || 'weighted',
    entries,
    podium: entries.filter(e => e.rank <= 3),
    positionCard,
    updatedAt: Date.now()
  };
}

async function syncParticipant(squadId, uid, force = false, options = {}) {
  const { allowEnded = false } = options;
  const db = await connectMongo();
  const sid = String(squadId);
  let squad = await db.collection('squads').findOne({ _id: new ObjectId(sid) });
  if (!squad) throw Object.assign(new Error('Squad not found'), { status: 404 });

  const status = squadStatus(squad);
  if (status === 'ended' && !allowEnded) {
    throw Object.assign(new Error('Competition ended'), { status: 400 });
  }

  const member = await db.collection('squadMembers').findOne({ squadId: sid, userId: uid });
  if (!member) throw Object.assign(new Error('Not a squad member'), { status: 403 });

  const lb = await db.collection('squadLeaderboard').findOne({ squadId: sid, userId: uid });
  const lastMs = lb?.lastUpdatedAt instanceof Date ? lb.lastUpdatedAt.getTime() : 0;
  const cooldownMs = 15 * 60 * 1000;
  if (!force && !allowEnded && lastMs && Date.now() - lastMs < cooldownMs) {
    const waitMin = Math.ceil((cooldownMs - (Date.now() - lastMs)) / 60000);
    throw Object.assign(new Error(`Sync available in ${waitMin} min`), { status: 429 });
  }

  const baseline = await db.collection('squadBaselines').findOne({ squadId: sid, userId: uid });
  if (!baseline) throw Object.assign(new Error('Baseline missing'), { status: 500 });

  squad = await ensureCompetitionBaselines(db, squad);
  const freshBaseline = await db.collection('squadBaselines').findOne({ squadId: sid, userId: uid });
  const progress = await fetchUserProgress(db, uid);
  await updateLeaderboardForUser(db, sid, uid, member, freshBaseline || baseline, progress, squad.scoringMode, squad);
  await recomputeRanks(db, sid);

  return { ok: true, syncedAt: Date.now() };
}

async function smartSyncIfStale(squadId, uid) {
  const db = await connectMongo();
  const sid = String(squadId);
  const squad = await db.collection('squads').findOne({ _id: new ObjectId(sid) });
  if (!squad || squadStatus(squad) === 'ended') return;

  const lb = await db.collection('squadLeaderboard').findOne({ squadId: sid, userId: uid });
  const lastMs = lb?.lastUpdatedAt instanceof Date ? lb.lastUpdatedAt.getTime() : 0;
  if (!lastMs || Date.now() - lastMs > 30 * 60 * 1000) {
    try {
      await syncParticipant(squadId, uid, true);
    } catch (err) {
      if (err.status !== 429) throw err;
    }
  }
}

async function listActive(uid) {
  const db = await connectMongo();
  const entries = await db.collection('userSquads').find({
    userId: uid,
    status: { $in: ['scheduled', 'active'] }
  }).toArray();

  const items = [];
  for (const entry of entries) {
    let squad;
    try {
      squad = await db.collection('squads').findOne({ _id: new ObjectId(entry.squadId) });
    } catch (_) {
      continue;
    }
    if (!squad) continue;

    const status = squadStatus(squad);
    if (status === 'ended') {
      try {
        await finalizeSquad(String(squad._id), uid);
      } catch (_) {}
      continue;
    }

    const lb = await db.collection('squadLeaderboard').findOne({ squadId: entry.squadId, userId: uid });
    items.push({
      squadId: entry.squadId,
      name: squad.name,
      code: squad.code,
      status,
      rank: lb?.rank ?? null,
      points: lb?.points ?? 0,
      endTime: squad.endTime,
      startTime: squad.startTime,
      memberCount: squad.memberCount || 0,
      competitionType: squad.competitionType || 'custom',
      goals: squad.goals || [],
      inviteUrl: `${inviteBaseUrl()}/squads/join/${squad.code}`
    });
  }
  return { squads: items };
}

async function listHistory(uid) {
  const db = await connectMongo();
  const stale = await db.collection('userSquads').find({
    userId: uid,
    status: { $in: ['scheduled', 'active'] }
  }).toArray();
  for (const entry of stale) {
    try {
      const squad = await db.collection('squads').findOne({ _id: new ObjectId(entry.squadId) });
      if (squad && squadStatus(squad) === 'ended') {
        await finalizeSquad(String(squad._id), uid);
      }
    } catch (_) {}
  }

  const entries = await db.collection('userSquads').find({ userId: uid, status: 'ended' }).toArray();
  const items = [];
  let wins = 0;
  let runnerUps = 0;
  let top3 = 0;

  for (const entry of entries) {
    const lb = await db.collection('squadLeaderboard').findOne({ squadId: entry.squadId, userId: uid });
    const results = await db.collection('squadResults').findOne({ squadId: entry.squadId });
    const rank = lb?.rank ?? null;
    if (rank === 1) wins++;
    if (rank === 2) runnerUps++;
    if (rank && rank <= 3) top3++;
    items.push({
      squadId: entry.squadId,
      name: entry.name,
      rank,
      points: lb?.points ?? 0,
      endedAt: results?.generatedAt ?? null
    });
  }

  return {
    squads: items,
    stats: { wins, runnerUps, top3Finishes: top3, totalParticipations: items.length },
    achievements: buildAchievements({ wins, runnerUps, top3, total: items.length })
  };
}

function buildAchievements({ wins, runnerUps, top3, total }) {
  const list = [];
  if (wins >= 1) list.push({ id: 'champion', label: 'Champion', icon: '🏆' });
  if (top3 >= 3) list.push({ id: 'consistency', label: 'Consistency King', icon: '👑' });
  if (total >= 5) list.push({ id: 'veteran', label: 'Squad Veteran', icon: '⚔️' });
  if (runnerUps >= 2) list.push({ id: 'silver', label: 'Runner Up', icon: '🥈' });
  return list;
}

function formatDurationMs(ms) {
  if (!ms || ms < 0) return '—';
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ${hours}h`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  return `${Math.max(1, Math.floor(ms / 60000))} min`;
}

function pickCategoryLeader(ranked, field) {
  if (!ranked.length) return null;
  const best = ranked.reduce((a, b) => ((b[field] || 0) > (a[field] || 0) ? b : a));
  if (!(best[field] || 0)) return null;
  return { displayLabel: publicDisplayName(best), value: best[field] };
}

function buildResultsAnalysis(squad, ranked, uid) {
  const startMs = toMs(squad.startTime);
  const endMs = toMs(squad.endTime);
  const durationMs = endMs && startMs ? endMs - startMs : 0;
  const participantCount = ranked.length;
  const totalProblems = ranked.reduce((s, e) => s + (e.totalDelta || 0), 0);
  const totalEasy = ranked.reduce((s, e) => s + (e.easyDelta || 0), 0);
  const totalMedium = ranked.reduce((s, e) => s + (e.mediumDelta || 0), 0);
  const totalHard = ranked.reduce((s, e) => s + (e.hardDelta || 0), 0);
  const totalPoints = ranked.reduce((s, e) => s + (e.points || 0), 0);
  const avgPoints = participantCount ? Math.round((totalPoints / participantCount) * 10) / 10 : 0;
  const avgProblems = participantCount ? Math.round((totalProblems / participantCount) * 10) / 10 : 0;

  const youEntry = ranked.find(e => e.userId === uid);
  const youRank = youEntry?.rank || null;
  const percentile = youRank && participantCount > 1
    ? Math.round(((participantCount - youRank) / (participantCount - 1)) * 100)
    : (youRank === 1 ? 100 : null);

  const winner = ranked[0];
  const podium = ranked.slice(0, 3).map(e => ({
    rank: e.rank,
    displayLabel: publicDisplayName(e),
    points: e.points || 0,
    totalDelta: e.totalDelta || 0,
    easyDelta: e.easyDelta || 0,
    mediumDelta: e.mediumDelta || 0,
    hardDelta: e.hardDelta || 0,
    isYou: e.userId === uid
  }));

  const highlights = [];
  if (winner) {
    highlights.push({
      icon: 'emoji_events',
      title: 'Champion',
      text: `${publicDisplayName(winner)} finished 1st with ${winner.points || 0} points and ${winner.totalDelta || 0} new solve(s) during the event.`
    });
  }
  if (participantCount > 1 && ranked[1]) {
    const gap = (winner?.points || 0) - (ranked[1].points || 0);
    highlights.push({
      icon: 'insights',
      title: 'Winning margin',
      text: gap === 0
        ? 'Top competitors tied on points — ranks used hard/medium counts, then who reached the score earliest.'
        : `${publicDisplayName(winner)} led by ${gap} point${gap === 1 ? '' : 's'} over 2nd place.`
    });
  }
  if (totalProblems > 0) {
    highlights.push({
      icon: 'code',
      title: 'Squad activity',
      text: `${participantCount} competitor${participantCount === 1 ? '' : 's'} logged ${totalProblems} new unique solve${totalProblems === 1 ? '' : 's'} (${totalEasy} Easy · ${totalMedium} Medium · ${totalHard} Hard).`
    });
  } else {
    highlights.push({
      icon: 'info',
      title: 'Low activity',
      text: 'No new LeetCode solves were recorded during this competition window.'
    });
  }
  if (youEntry) {
    highlights.push({
      icon: 'person',
      title: 'Your performance',
      text: youRank === 1
        ? `You won with ${youEntry.points || 0} points and ${youEntry.totalDelta || 0} new solve(s).`
        : `You finished #${youRank} with ${youEntry.points || 0} points (${youEntry.totalDelta || 0} new solve(s)${percentile != null ? `, top ${percentile}%` : ''}).`
    });
  }

  const categoryWinners = {
    mostEasy: pickCategoryLeader(ranked, 'easyDelta'),
    mostMedium: pickCategoryLeader(ranked, 'mediumDelta'),
    mostHard: pickCategoryLeader(ranked, 'hardDelta'),
    mostGithub: pickCategoryLeader(ranked, 'githubDelta'),
    highestPoints: winner ? { displayLabel: publicDisplayName(winner), value: winner.points || 0 } : null
  };

  return {
    event: {
      name: squad.name,
      competitionType: squad.competitionType || 'custom',
      scoringMode: squad.scoringMode || 'weighted',
      startTime: squad.startTime,
      endTime: squad.endTime,
      durationLabel: formatDurationMs(durationMs),
      memberCount: squad.memberCount || participantCount,
      participantCount,
      goals: squad.goals || []
    },
    totals: {
      totalProblems,
      totalEasy,
      totalMedium,
      totalHard,
      totalPoints,
      avgPoints,
      avgProblems
    },
    yourResult: youEntry ? {
      rank: youRank,
      points: youEntry.points || 0,
      totalDelta: youEntry.totalDelta || 0,
      easyDelta: youEntry.easyDelta || 0,
      mediumDelta: youEntry.mediumDelta || 0,
      hardDelta: youEntry.hardDelta || 0,
      percentile
    } : null,
    podium,
    highlights,
    categoryWinners
  };
}

async function finalizeSquad(squadId, uidForAnalysis = null) {
  const db = await connectMongo();
  const sid = String(squadId);
  const squad = await db.collection('squads').findOne({ _id: new ObjectId(sid) });
  if (!squad) return null;

  const existing = await db.collection('squadResults').findOne({ squadId: sid });
  if (squad.status === 'ended' && existing) return existing;

  const members = await db.collection('squadMembers').find({ squadId: sid }).toArray();
  for (const m of members) {
    try {
      await syncParticipant(sid, m.userId, true, { allowEnded: true });
    } catch (_) {}
  }

  await recomputeRanks(db, sid);
  const lbEntries = await db.collection('squadLeaderboard').find({ squadId: sid }).toArray();
  const ranked = rankEntries(lbEntries);

  const winner = ranked[0];
  const second = ranked[1];
  const third = ranked[2];
  const analysisUid = uidForAnalysis || winner?.userId || members[0]?.userId;
  const analysis = buildResultsAnalysis(squad, ranked, analysisUid);

  const summary = {
    squadId: sid,
    winnerId: winner?.userId || null,
    winnerLabel: winner ? publicDisplayName(winner) : null,
    winnerPoints: winner?.points || 0,
    secondId: second?.userId || null,
    secondLabel: second ? publicDisplayName(second) : null,
    secondPoints: second?.points || 0,
    thirdId: third?.userId || null,
    thirdLabel: third ? publicDisplayName(third) : null,
    thirdPoints: third?.points || 0,
    generatedAt: new Date(),
    analysis,
    stats: analysis.categoryWinners,
    frozenLeaderboard: ranked.map(e => sanitizeLeaderboardEntry(e))
  };

  await db.collection('squadResults').updateOne({ squadId: sid }, { $set: summary }, { upsert: true });
  await db.collection('squads').updateOne({ _id: new ObjectId(sid) }, { $set: { status: 'ended' } });

  await Promise.all(members.map(m =>
    db.collection('userSquads').updateOne(
      { userId: m.userId, squadId: sid },
      { $set: { status: 'ended' } }
    )
  ));

  return summary;
}

async function getResults(squadId, uid) {
  const db = await connectMongo();
  const sid = String(squadId);
  const member = await db.collection('squadMembers').findOne({ squadId: sid, userId: uid });
  if (!member) throw Object.assign(new Error('Not a squad member'), { status: 403 });

  const squad = await db.collection('squads').findOne({ _id: new ObjectId(sid) });
  const status = squadStatus(squad || {});
  if (status !== 'ended') {
    throw Object.assign(new Error('Competition still active'), { status: 400 });
  }

  let data = await db.collection('squadResults').findOne({ squadId: sid });
  if (!data) {
    await finalizeSquad(sid, uid);
    data = await db.collection('squadResults').findOne({ squadId: sid });
  }
  if (!data) throw Object.assign(new Error('Results not ready'), { status: 404 });

  if (!data.analysis) {
    const ranked = (data.frozenLeaderboard || []).map((e, i) => ({ ...e, rank: e.rank || i + 1 }));
    const analysis = buildResultsAnalysis(squad || {}, ranked, uid);
    await db.collection('squadResults').updateOne(
      { squadId: sid },
      { $set: { analysis, stats: analysis.categoryWinners } }
    );
    data = { ...data, analysis, stats: analysis.categoryWinners };
  } else if (data.analysis.yourResult == null || data.analysis.yourResult.rank == null) {
    const ranked = (data.frozenLeaderboard || []).map((e, i) => ({ ...e, rank: e.rank || i + 1 }));
    const analysis = buildResultsAnalysis(squad || {}, ranked, uid);
    data = { ...data, analysis: { ...data.analysis, yourResult: analysis.yourResult, highlights: analysis.highlights } };
  }

  const analysis = data.analysis || {};
  const leaderboard = (data.frozenLeaderboard || []).map(e => sanitizeLeaderboardEntry(e, uid));

  return {
    squadId: sid,
    name: squad?.name,
    status: 'ended',
    champion: { displayLabel: data.winnerLabel, points: data.winnerPoints },
    podium: analysis.podium || [
      { rank: 1, displayLabel: data.winnerLabel, points: data.winnerPoints },
      { rank: 2, displayLabel: data.secondLabel, points: data.secondPoints || 0 },
      { rank: 3, displayLabel: data.thirdLabel, points: data.thirdPoints || 0 }
    ].filter(p => p.displayLabel),
    leaderboard,
    stats: data.stats || analysis.categoryWinners || {},
    analysis,
    event: analysis.event || null,
    totals: analysis.totals || null,
    yourResult: analysis.yourResult || null,
    highlights: analysis.highlights || [],
    generatedAt: data.generatedAt
  };
}

async function syncAllActiveMembers() {
  const db = await connectMongo();
  const now = Date.now();
  const squads = await db.collection('squads').find({ status: { $in: ['scheduled', 'active'] } }).toArray();
  let count = 0;

  for (const squad of squads) {
    const sid = String(squad._id);
    const status = squadStatus(squad, now);
    if (status === 'ended') {
      await finalizeSquad(sid);
      continue;
    }
    if (status === 'active' && squad.status !== 'active') {
      await db.collection('squads').updateOne({ _id: squad._id }, { $set: { status: 'active' } });
      squad.status = 'active';
    }
    squad = await ensureCompetitionBaselines(db, squad);
    const members = await db.collection('squadMembers').find({ squadId: sid }).toArray();
    for (const m of members) {
      try {
        await syncParticipant(sid, m.userId, true);
        count++;
      } catch (_) {}
    }
  }
  return count;
}

module.exports = {
  createSquad,
  joinSquad,
  lookupByCode,
  getSquadDetails,
  getLeaderboard,
  syncParticipant,
  smartSyncIfStale,
  listActive,
  listHistory,
  getResults,
  finalizeSquad,
  syncAllActiveMembers,
  squadStatus
};
