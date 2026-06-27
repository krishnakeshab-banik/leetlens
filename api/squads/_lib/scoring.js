'use strict';

const WEIGHTS = { easy: 1, medium: 3, hard: 5 };

function computeDeltas(current, baseline) {
  const easy = Math.max(0, (current.easySolved || 0) - (baseline.easy || 0));
  const medium = Math.max(0, (current.mediumSolved || 0) - (baseline.medium || 0));
  const hard = Math.max(0, (current.hardSolved || 0) - (baseline.hard || 0));
  const total = Math.max(0, (current.totalSolved || 0) - (baseline.total || 0));
  const github = Math.max(0, (current.githubContributions || 0) - (baseline.githubContributions || 0));
  return { easyDelta: easy, mediumDelta: medium, hardDelta: hard, totalDelta: total, githubDelta: github, lastSolveAt: null };
}

/** Only count problems not already solved at baseline (re-submissions excluded). */
function computeSlugDeltas(progress, baseline, squad = {}) {
  const baselineSet = new Set((baseline.solvedSlugs || []).map(s => String(s).toLowerCase()));
  const startMs = toMs(squad.startTime);
  const endMs = toMs(squad.endTime);
  const now = Date.now();
  const competitionActive = !startMs || now >= startMs;

  const newProblems = (progress.solvedProblems || []).filter(p => {
    const slug = String(p.slug || p.problemId || '').toLowerCase();
    if (!slug || baselineSet.has(slug)) return false;
    if (!competitionActive) return false;
    const solvedAt = toMs(p.solvedAt);
    if (startMs && solvedAt && solvedAt < startMs) return false;
    if (endMs && solvedAt && solvedAt > endMs) return false;
    return true;
  });

  let easy = 0;
  let medium = 0;
  let hard = 0;
  let lastSolveAt = 0;
  newProblems.forEach(p => {
    const d = String(p.difficulty || '').toLowerCase();
    if (d === 'easy') easy++;
    else if (d === 'medium') medium++;
    else if (d === 'hard') hard++;
    const solvedAt = toMs(p.solvedAt);
    if (solvedAt > lastSolveAt) lastSolveAt = solvedAt;
  });

  const github = Math.max(0, (progress.githubContributions || 0) - (baseline.githubContributions || 0));
  return {
    easyDelta: easy,
    mediumDelta: medium,
    hardDelta: hard,
    totalDelta: newProblems.length,
    githubDelta: github,
    lastSolveAt: lastSolveAt || null
  };
}

function pickDeltas(progress, baseline, squad) {
  if (Array.isArray(baseline.solvedSlugs)) {
    return computeSlugDeltas(progress, baseline, squad);
  }
  return computeDeltas(progress, baseline);
}

function computePoints(deltas, scoringMode) {
  if (scoringMode === 'total') return deltas.totalDelta;
  return deltas.easyDelta * WEIGHTS.easy
    + deltas.mediumDelta * WEIGHTS.medium
    + deltas.hardDelta * WEIGHTS.hard;
}

function tieBreakTime(entry) {
  const t = toMs(entry?.lastSolveAt);
  return t > 0 ? t : Number.MAX_SAFE_INTEGER;
}

function rankEntries(entries) {
  return [...entries].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.hardDelta !== a.hardDelta) return b.hardDelta - a.hardDelta;
    if (b.mediumDelta !== a.mediumDelta) return b.mediumDelta - a.mediumDelta;
    if (b.totalDelta !== a.totalDelta) return b.totalDelta - a.totalDelta;
    return tieBreakTime(a) - tieBreakTime(b);
  }).map((e, i) => ({ ...e, rank: i + 1 }));
}

function toMs(v) {
  if (!v) return 0;
  if (typeof v === 'number') return v;
  if (v instanceof Date) return v.getTime();
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (v._seconds != null) return v._seconds * 1000;
  return Date.parse(v) || 0;
}

function squadStatus(squad, now = Date.now()) {
  const start = toMs(squad.startTime);
  const end = toMs(squad.endTime);
  if (squad.status === 'ended') return 'ended';
  if (now < start) return 'scheduled';
  if (now >= end) return 'ended';
  return 'active';
}

module.exports = {
  WEIGHTS,
  computeDeltas,
  computeSlugDeltas,
  pickDeltas,
  computePoints,
  rankEntries,
  tieBreakTime,
  squadStatus,
  toMs
};
