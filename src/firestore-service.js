import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore';
import { getDb } from './firebase-init.js';
import { wrapFirestoreError } from './auth-service.js';

function userRef(uid) {
  return doc(getDb(), 'users', uid);
}

function statsRef(uid) {
  return doc(getDb(), 'users', uid, 'stats', 'current');
}

function dailySnapshotRef(uid, dateKey) {
  return doc(getDb(), 'users', uid, 'dailySnapshots', dateKey);
}

function solvedProblemRef(uid, problemId) {
  return doc(getDb(), 'users', uid, 'solvedProblems', problemId);
}

function activityRef(uid, activityId) {
  return doc(getDb(), 'users', uid, 'activity', activityId);
}

function weeklyPlanRef(uid, weekId) {
  return doc(getDb(), 'users', uid, 'weeklyPlans', weekId);
}

export async function saveSolvedProblem(uid, data) {
  try {
    const ref = solvedProblemRef(uid, data.problemId);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    } else {
      await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
  } catch (err) {
    throw wrapFirestoreError(err);
  }
}

export async function saveActivity(uid, activityId, data) {
  try {
    await setDoc(activityRef(uid, activityId), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    throw wrapFirestoreError(err);
  }
}

export async function saveStats(uid, stats) {
  try {
    await setDoc(statsRef(uid), {
      ...stats,
      syncedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    throw wrapFirestoreError(err);
  }
}

export async function saveDailySnapshot(uid, dateKey, snapshot) {
  try {
    const ref = dailySnapshotRef(uid, dateKey);
    const existing = await getDoc(ref);
    const prev = existing.exists() ? existing.data() : {};
    const merged = { ...prev, ...snapshot, date: dateKey };
    if (snapshot.solvedToday) {
      merged.solvedToday = (prev.solvedToday || 0) + snapshot.solvedToday;
    }
    if (!existing.exists()) {
      await setDoc(ref, { ...merged, createdAt: serverTimestamp() });
    } else {
      await setDoc(ref, { ...merged, updatedAt: serverTimestamp() }, { merge: true });
    }
  } catch (err) {
    throw wrapFirestoreError(err);
  }
}

export async function getStats(uid) {
  const snap = await getDoc(statsRef(uid));
  return snap.exists() ? snap.data() : null;
}

export async function getDailySnapshots(uid, max = 365) {
  const q = query(
    collection(getDb(), 'users', uid, 'dailySnapshots'),
    orderBy('date', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getSolvedProblems(uid) {
  const snap = await getDocs(collection(getDb(), 'users', uid, 'solvedProblems'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getRecentActivity(uid, max = 20) {
  const q = query(
    collection(getDb(), 'users', uid, 'activity'),
    orderBy('endedAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getWeeklyPlans(uid) {
  const q = query(
    collection(getDb(), 'users', uid, 'weeklyPlans'),
    orderBy('startDate', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveWeeklyPlan(uid, weekId, plan) {
  try {
    await setDoc(weeklyPlanRef(uid, weekId), {
      ...plan,
      weekId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    throw wrapFirestoreError(err);
  }
}

export async function getCurrentWeeklyPlan(uid) {
  const weekId = getWeekId(new Date());
  const snap = await getDoc(weeklyPlanRef(uid, weekId));
  return snap.exists() ? snap.data() : null;
}

export function getWeekId(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

export function getWeekRange(date = new Date()) {
  const weekId = getWeekId(date);
  const start = new Date(weekId);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return {
    weekId,
    startDate: weekId,
    endDate: end.toISOString().slice(0, 10)
  };
}

export async function hasSolvedToday(uid, timezone = 'Asia/Kolkata') {
  const today = getDateInTimezone(new Date(), timezone);
  const snap = await getDoc(dailySnapshotRef(uid, today));
  if (!snap.exists()) return false;
  const data = snap.data();
  return (data.totalSolved || 0) > 0 || (data.solvedToday || 0) > 0;
}

function getDateInTimezone(date, timezone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export async function syncLocalRecordToCloud(uid, record, source = 'extension') {
  if (!record.solved) return;
  const problemId = record.slug;
  await saveSolvedProblem(uid, {
    problemId,
    title: record.title || record.slug,
    difficulty: record.difficulty || 'Unknown',
    solvedAt: record.solvedAt || Date.now(),
    timeSpentMinutes: Math.round((record.totalMs || 0) / 60000),
    userDifficultyRating: record.stars || 0,
    tags: record.tags || [],
    source
  });
}
