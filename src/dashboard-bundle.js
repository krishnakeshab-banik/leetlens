import { isFirebaseConfigured, isOAuthConfigured } from './config.js';
import { initFirebase } from './firebase-init.js';
import {
  getUserProfile,
  getOAuthRedirectUri,
  getOAuthSetupInfo,
  requireAuthUser,
  signInWithGoogle,
  signUpWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  updateUserProfile,
  watchAuthState
} from './auth-service.js';
import {
  getCurrentWeeklyPlan,
  getDailySnapshots,
  getRecentActivity,
  getSolvedProblems,
  getStats,
  getWeekRange,
  saveActivity,
  saveDailySnapshot,
  saveSolvedProblem,
  saveStats,
  saveWeeklyPlan,
  syncLocalRecordToCloud
} from './firestore-service.js';
import {
  fetchAllSolvedProblems,
  syncLeetCodeProfile,
  validateUsername
} from './leetcode-api.js';
import {
  syncGithubProfile,
  validateGithubUsername
} from './github-api.js';

let authUnsubscribe = null;
let cloudState = {
  user: null,
  profile: null,
  stats: null,
  loading: true,
  error: null,
  syncing: false
};

const listeners = new Set();

function emit() {
  listeners.forEach(fn => fn({ ...cloudState }));
}

function setState(patch) {
  cloudState = { ...cloudState, ...patch };
  emit();
}

async function loadCloudData(uid) {
  const [profile, stats] = await Promise.all([
    getUserProfile(uid),
    getStats(uid)
  ]);
  setState({ profile, stats });
  await chrome.storage.local.set({
    leetlensUserProfile: profile,
    leetlensStats: stats
  });
}

function toCloudUser(firebaseUser) {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL
  };
}

export async function initCloud() {
  if (!isFirebaseConfigured()) {
    setState({ loading: false, error: 'Firebase not configured' });
    return cloudState;
  }

  initFirebase();
  if (authUnsubscribe) authUnsubscribe();

  authUnsubscribe = watchAuthState(async ({ user, error }) => {
    if (error) {
      setState({ user: null, loading: false, error: error.message });
      return;
    }
    if (user) {
      setState({ user: toCloudUser(user), loading: true, error: null });
      try {
        await loadCloudData(user.uid);
      } catch (err) {
        setState({ loading: false, error: err.message });
        return;
      }
      setState({ loading: false });
    } else {
      setState({ user: null, profile: null, stats: null, loading: false, error: null });
    }
  });

  return cloudState;
}

export function onCloudStateChange(fn) {
  listeners.add(fn);
  fn({ ...cloudState });
  return () => listeners.delete(fn);
}

export function getCloudState() {
  return { ...cloudState };
}

export async function login() {
  setState({ loading: true, error: null });
  try {
    const user = await signInWithGoogle();
    await loadCloudData(user.uid);
    setState({ user: toCloudUser(user), loading: false });
    return user;
  } catch (err) {
    setState({ loading: false, error: err.message });
    throw err;
  }
}

export async function signUpGoogle() {
  return login();
}

export async function loginWithEmail(email, password) {
  setState({ loading: true, error: null });
  try {
    const user = await signInWithEmail(email, password);
    await loadCloudData(user.uid);
    setState({ user: toCloudUser(user), loading: false });
    return user;
  } catch (err) {
    setState({ loading: false, error: err.message });
    throw err;
  }
}

export async function signUpWithEmailAccount(email, password, displayName) {
  setState({ loading: true, error: null });
  try {
    const user = await signUpWithEmail(email, password, displayName);
    await loadCloudData(user.uid);
    setState({ user: toCloudUser(user), loading: false });
    return user;
  } catch (err) {
    setState({ loading: false, error: err.message });
    throw err;
  }
}

export async function logout() {
  await signOutUser();
  setState({ user: null, profile: null, stats: null, loading: false, error: null });
}

export async function linkLeetCodeUsername(username) {
  const user = await requireAuthUser();
  const result = await validateUsername(username);
  if (!result.valid) throw new Error(result.error);
  await updateUserProfile(user.uid, { leetcodeUsername: result.username });
  await loadCloudData(user.uid);
  return result.username;
}

export async function syncProfile() {
  const user = await requireAuthUser();
  const username = cloudState.profile?.leetcodeUsername;
  if (!username) throw new Error('Link your LeetCode username first');

  setState({ syncing: true, error: null });
  try {
    const { stats, solvedProblems } = await syncLeetCodeProfile(username);
    await saveStats(user.uid, stats);

    const today = new Date().toISOString().slice(0, 10);
    await saveDailySnapshot(user.uid, today, {
      totalSolved: stats.totalSolved,
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
      streak: stats.streak,
      solvedToday: stats.solvedToday || 0
    });

    for (const p of solvedProblems) {
      await saveSolvedProblem(user.uid, {
        problemId: p.problemId,
        title: p.title,
        difficulty: p.difficulty || 'Unknown',
        solvedAt: p.solvedAt,
        timeSpentMinutes: 0,
        userDifficultyRating: 0,
        tags: [],
        source: p.source
      });
    }

    await updateUserProfile(user.uid, { leetcodeLastSyncedAt: Date.now() });
    await loadCloudData(user.uid);
    setState({ syncing: false });
    return stats;
  } catch (err) {
    setState({ syncing: false, error: err.message });
    throw err;
  }
}

export async function linkGithubUsername(username) {
  const user = await requireAuthUser();
  const result = await validateGithubUsername(username);
  if (!result.valid) throw new Error(result.error);
  await updateUserProfile(user.uid, { githubUsername: result.username });
  await loadCloudData(user.uid);
  return result.username;
}

export async function syncGithub() {
  const user = await requireAuthUser();
  const username = cloudState.profile?.githubUsername;
  if (!username) throw new Error('Link your GitHub username first');

  setState({ syncing: true, error: null });
  try {
    const githubData = await syncGithubProfile(username);
    await updateUserProfile(user.uid, {
      githubUsername: username,
      githubStats: githubData,
      githubLastSyncedAt: Date.now()
    });
    await loadCloudData(user.uid);
    setState({ syncing: false });
    return githubData;
  } catch (err) {
    setState({ syncing: false, error: err.message });
    throw err;
  }
}

export async function syncLocalRecords(records) {
  const user = cloudState.user;
  if (!user) return;
  const values = Object.values(records || {});
  for (const record of values) {
    if (record.solved) await syncLocalRecordToCloud(user.uid, record);
  }
}

export async function saveProblemActivity(activity) {
  const user = cloudState.user;
  if (!user) return;
  const id = `${activity.problemId}_${activity.startedAt}`;
  await saveActivity(user.uid, id, activity);
}

export async function saveProblemRating(problemId, rating, record) {
  const user = cloudState.user;
  if (!user || !record?.solved) return;
  await saveSolvedProblem(user.uid, {
    problemId,
    title: record.title || problemId,
    difficulty: record.difficulty || 'Unknown',
    solvedAt: record.solvedAt || Date.now(),
    timeSpentMinutes: Math.round((record.totalMs || 0) / 60000),
    userDifficultyRating: rating,
    tags: record.tags || [],
    source: 'extension'
  });
}

export async function updateReminderSettings(settings) {
  const user = await requireAuthUser();
  await updateUserProfile(user.uid, settings);
  await loadCloudData(user.uid);
}

export async function fetchAnalyticsData() {
  const user = cloudState.user;
  if (!user) return null;
  const [snapshots, solved, activity] = await Promise.all([
    getDailySnapshots(user.uid),
    getSolvedProblems(user.uid),
    getRecentActivity(user.uid, 50)
  ]);
  return { snapshots, solved, activity, stats: cloudState.stats };
}

export async function fetchLiveLeetCodeProblems() {
  const username = cloudState.profile?.leetcodeUsername;
  if (!username) return [];
  const cacheKey = `lc_live_${username}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { at, problems } = JSON.parse(cached);
      if (Date.now() - at < 5 * 60 * 1000) return problems;
    }
  } catch (_) {}

  const { problems } = await fetchAllSolvedProblems(username);
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), problems }));
  } catch (_) {}
  return problems;
}

export async function fetchWeeklyPlanData() {
  const user = cloudState.user;
  if (!user) return null;
  return getCurrentWeeklyPlan(user.uid);
}

export async function fetchWeeklyGoals() {
  const plan = await fetchWeeklyPlanData();
  return plan?.goals || [];
}

export async function saveWeeklyGoals(goals) {
  const user = await requireAuthUser();
  const range = getWeekRange();
  const existing = (await getCurrentWeeklyPlan(user.uid)) || {};
  await saveWeeklyPlan(user.uid, range.weekId, {
    ...existing,
    weekId: range.weekId,
    startDate: range.startDate,
    endDate: range.endDate,
    goals
  });
  return goals;
}

export async function addWeeklyGoal(goal) {
  const goals = await fetchWeeklyGoals();
  const newGoal = {
    id: `g_${Date.now()}`,
    title: goal.title || 'Weekly Goal',
    type: goal.type || 'count',
    targetCount: Number(goal.targetCount) || 0,
    targetSlugs: goal.targetSlugs || [],
    difficulty: goal.difficulty || 'all',
    completedSlugs: [],
    status: 'active',
    createdAt: Date.now()
  };
  goals.push(newGoal);
  await saveWeeklyGoals(goals);
  return newGoal;
}

export async function updateWeeklyGoal(goalId, updates) {
  const goals = await fetchWeeklyGoals();
  const idx = goals.findIndex(g => g.id === goalId);
  if (idx === -1) throw new Error('Goal not found');
  goals[idx] = { ...goals[idx], ...updates };
  await saveWeeklyGoals(goals);
  return goals[idx];
}

export async function deleteWeeklyGoal(goalId) {
  const goals = (await fetchWeeklyGoals()).filter(g => g.id !== goalId);
  await saveWeeklyGoals(goals);
  return goals;
}

export async function markGoalProblemComplete(slug) {
  const goals = await fetchWeeklyGoals();
  let changed = false;
  goals.forEach(goal => {
    if (goal.status === 'completed') return;
    const completed = goal.completedSlugs || [];
    if (completed.includes(slug)) return;

    if (goal.type === 'specific') {
      const targets = goal.targetSlugs || [];
      if (targets.includes(slug)) {
        completed.push(slug);
        goal.completedSlugs = completed;
        changed = true;
      }
    } else if (goal.type === 'count') {
      completed.push(slug);
      goal.completedSlugs = completed;
      changed = true;
    }

    const target = goal.type === 'specific'
      ? (goal.targetSlugs || []).length
      : (goal.targetCount || 0);
    if (target > 0 && (goal.completedSlugs || []).length >= target) {
      goal.status = 'completed';
    }
  });
  if (changed) await saveWeeklyGoals(goals);
}

export async function createOrUpdateWeeklyPlan(targetProblems, problemSlugs = []) {
  const user = await requireAuthUser();
  const range = getWeekRange();
  const existing = await getCurrentWeeklyPlan(user.uid);
  const completed = (existing?.completedProblems || []).slice();
  const plan = {
    weekId: range.weekId,
    startDate: range.startDate,
    endDate: range.endDate,
    targetProblems: Number(targetProblems) || 0,
    targetSlugs: problemSlugs,
    completedProblems: completed,
    status: 'active'
  };
  await saveWeeklyPlan(user.uid, range.weekId, plan);
  return plan;
}

export async function markWeeklyProblemComplete(slug) {
  const user = cloudState.user;
  if (!user) return;
  const range = getWeekRange();
  const existing = await getCurrentWeeklyPlan(user.uid) || {
    weekId: range.weekId,
    startDate: range.startDate,
    endDate: range.endDate,
    targetProblems: 0,
    targetSlugs: [],
    completedProblems: [],
    status: 'active'
  };
  if (!existing.completedProblems.includes(slug)) {
    existing.completedProblems.push(slug);
  }
  const target = existing.targetProblems || 0;
  const done = existing.completedProblems.length;
  existing.status = target > 0 && done >= target ? 'completed' : 'active';
  await saveWeeklyPlan(user.uid, range.weekId, existing);
  return existing;
}

export async function onProblemSolved(record) {
  const user = cloudState.user;
  if (!user || !record?.solved) return;
  await syncLocalRecordToCloud(user.uid, record);
  const today = new Date().toISOString().slice(0, 10);
  await saveDailySnapshot(user.uid, today, { solvedToday: 1 });
  await markWeeklyProblemComplete(record.slug);
  await markGoalProblemComplete(record.slug);
}

// Expose API on window only (avoid esbuild globalName conflicts)
const LeetLensCloudAPI = {
  initCloud,
  onCloudStateChange,
  getCloudState,
  login,
  signUpGoogle,
  loginWithEmail,
  signUpWithEmailAccount,
  logout,
  linkLeetCodeUsername,
  syncProfile,
  linkGithubUsername,
  syncGithub,
  syncLocalRecords,
  saveProblemActivity,
  saveProblemRating,
  updateReminderSettings,
  fetchAnalyticsData,
  fetchLiveLeetCodeProblems,
  fetchWeeklyPlanData,
  fetchWeeklyGoals,
  addWeeklyGoal,
  updateWeeklyGoal,
  deleteWeeklyGoal,
  createOrUpdateWeeklyPlan,
  markWeeklyProblemComplete,
  onProblemSolved,
  validateUsername,
  isFirebaseConfigured,
  isOAuthConfigured,
  getOAuthRedirectUri,
  getOAuthSetupInfo
};

window.LeetLensCloud = LeetLensCloudAPI;
if (typeof globalThis !== 'undefined') globalThis.LeetLensCloud = LeetLensCloudAPI;
