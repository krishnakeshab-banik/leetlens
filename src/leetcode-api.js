const GRAPHQL_URL = 'https://leetcode.com/graphql';

function graphqlEndpoint() {
  if (typeof window !== 'undefined' && window.__LEETLENS_WEB__) {
    return '/api/leetcode';
  }
  return GRAPHQL_URL;
}

async function graphql(query, variables = {}) {
  const res = await fetch(graphqlEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

const USER_EXISTS_QUERY = `
  query userExists($username: String!) {
    matchedUser(username: $username) {
      username
      profile { userAvatar realName }
    }
  }
`;

const USER_STATS_QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
      profile { ranking reputation starRating }
    }
  }
`;

const CALENDAR_QUERY = `
  query userCalendar($username: String!, $year: Int!) {
    matchedUser(username: $username) {
      userCalendar(year: $year) { submissionCalendar }
    }
  }
`;

const RECENT_AC_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

const RECENT_AC_PAGED_QUERY = `
  query recentAcPaged($username: String!, $limit: Int!, $skip: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit, skip: $skip) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

const RECENT_SUBMISSIONS_QUERY = `
  query recentSubmissions($username: String!, $limit: Int!) {
    recentSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`;

const PROBLEM_DIFFICULTY_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      titleSlug
      difficulty
    }
  }
`;

export async function validateUsername(username) {
  const clean = (username || '').trim().toLowerCase();
  if (!clean || !/^[a-zA-Z0-9_-]+$/.test(clean)) {
    return { valid: false, error: 'Invalid username format' };
  }
  try {
    const data = await graphql(USER_EXISTS_QUERY, { username: clean });
    if (!data?.matchedUser) {
      return { valid: false, error: 'LeetCode user not found' };
    }
    return { valid: true, username: clean, profile: data.matchedUser.profile };
  } catch (err) {
    const msg = err.message === 'Failed to fetch'
      ? 'Could not reach LeetCode. Check your connection or try again from the Chrome extension.'
      : err.message;
    return { valid: false, error: msg };
  }
}

export function parseSubmitStats(acSubmissionNum = []) {
  const stats = { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
  acSubmissionNum.forEach(item => {
    const count = item.count || 0;
    if (item.difficulty === 'All') stats.totalSolved = count;
    if (item.difficulty === 'Easy') stats.easySolved = count;
    if (item.difficulty === 'Medium') stats.mediumSolved = count;
    if (item.difficulty === 'Hard') stats.hardSolved = count;
  });
  return stats;
}

export function parseSubmissionCalendar(calendarStr) {
  if (!calendarStr) return {};
  try {
    return JSON.parse(calendarStr);
  } catch {
    return {};
  }
}

export function computeStreakFromCalendar(calendar) {
  const dates = Object.keys(calendar)
    .map(ts => new Date(Number(ts) * 1000))
    .sort((a, b) => b - a);
  if (!dates.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecent = new Date(dates[0]);
  mostRecent.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - mostRecent) / 86400000);
  if (diffDays > 1) return 0;

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const curr = new Date(dates[i]);
    const next = new Date(dates[i + 1]);
    curr.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);
    const gap = Math.round((curr - next) / 86400000);
    if (gap === 1) streak++;
    else if (gap > 1) break;
  }
  return streak;
}

export async function fetchUserProfile(username) {
  const data = await graphql(USER_STATS_QUERY, { username });
  const user = data?.matchedUser;
  if (!user) throw new Error('User not found');
  const stats = parseSubmitStats(user.submitStats?.acSubmissionNum);
  return { stats, profile: user.profile };
}

export async function fetchSubmissionCalendar(username, year = new Date().getFullYear()) {
  const data = await graphql(CALENDAR_QUERY, { username, year });
  const calendarStr = data?.matchedUser?.userCalendar?.submissionCalendar;
  return parseSubmissionCalendar(calendarStr);
}

export async function fetchRecentSubmissions(username, limit = 20) {
  const data = await graphql(RECENT_SUBMISSIONS_QUERY, { username, limit });
  return data?.recentSubmissionList || [];
}

async function fetchProblemDifficulty(titleSlug) {
  try {
    const data = await graphql(PROBLEM_DIFFICULTY_QUERY, { titleSlug });
    return data?.question?.difficulty || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

async function enrichDifficulties(problems, concurrency = 6, maxEnrich = 200) {
  const toEnrich = problems.slice(0, maxEnrich);
  for (let i = 0; i < toEnrich.length; i += concurrency) {
    const batch = toEnrich.slice(i, i + concurrency);
    await Promise.all(batch.map(async p => {
      if (p.difficulty && p.difficulty !== 'Unknown') return;
      p.difficulty = await fetchProblemDifficulty(p.problemId);
    }));
  }
  return problems;
}

function collectUniqueSubmissions(submissions, seen, problems) {
  submissions.forEach(s => {
    const slug = (s.titleSlug || '').toLowerCase();
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    problems.push({
      problemId: slug,
      title: s.title || slug,
      difficulty: 'Unknown',
      solvedAt: Number(s.timestamp) * 1000,
      source: 'leetcode-sync'
    });
  });
}

async function fetchAcSubmissionsAll(username, targetTotal) {
  const seen = new Set();
  const problems = [];
  const pageSize = 50;
  let skip = 0;
  let usePaging = true;

  while (problems.length < targetTotal) {
    let batch = [];
    if (usePaging) {
      try {
        const data = await graphql(RECENT_AC_PAGED_QUERY, { username, limit: pageSize, skip });
        batch = data?.recentAcSubmissionList || [];
      } catch (_) {
        usePaging = false;
      }
    }

    if (!usePaging) {
      const limit = Math.min(Math.max(targetTotal, 50), 3000);
      const data = await graphql(RECENT_AC_QUERY, { username, limit });
      batch = data?.recentAcSubmissionList || [];
      collectUniqueSubmissions(batch, seen, problems);
      break;
    }

    if (!batch.length) break;
    const before = problems.length;
    collectUniqueSubmissions(batch, seen, problems);
    if (batch.length < pageSize || problems.length === before) break;
    skip += pageSize;
    if (skip > targetTotal + 200) break;
  }

  if (problems.length < targetTotal) {
    const extra = await fetchRecentSubmissions(username, Math.min(targetTotal * 3, 500));
    collectUniqueSubmissions(
      extra.filter(s => s.statusDisplay === 'Accepted'),
      seen,
      problems
    );
  }

  return problems;
}

/** Fast fetch: recent AC submissions within a date range (paginates until before startDate). */
export async function fetchRecentAcActivity(username, startDate, endDate, maxPages = 20) {
  const startMs = new Date(`${startDate}T00:00:00`).getTime();
  const endMs = new Date(`${endDate}T23:59:59`).getTime();
  const results = [];
  const pageSize = 50;
  let skip = 0;
  let usePaging = true;

  for (let page = 0; page < maxPages; page++) {
    let batch = [];
    if (usePaging) {
      try {
        const data = await graphql(RECENT_AC_PAGED_QUERY, { username, limit: pageSize, skip });
        batch = data?.recentAcSubmissionList || [];
      } catch (_) {
        usePaging = false;
      }
    }

    if (!usePaging) {
      const data = await graphql(RECENT_AC_QUERY, { username, limit: Math.min(pageSize * maxPages, 500) });
      batch = data?.recentAcSubmissionList || [];
      batch.forEach(s => {
        const ts = Number(s.timestamp) * 1000;
        if (!ts || ts < startMs || ts > endMs) return;
        results.push({
          problemId: String(s.titleSlug || '').toLowerCase(),
          title: s.title || s.titleSlug,
          solvedAt: ts,
          difficulty: 'Unknown',
          source: 'leetcode-recent'
        });
      });
      break;
    }

    if (!batch.length) break;

    let oldestInBatch = Infinity;
    batch.forEach(s => {
      const ts = Number(s.timestamp) * 1000;
      if (ts) oldestInBatch = Math.min(oldestInBatch, ts);
      if (!ts || ts < startMs || ts > endMs) return;
      results.push({
        problemId: String(s.titleSlug || '').toLowerCase(),
        title: s.title || s.titleSlug,
        solvedAt: ts,
        difficulty: 'Unknown',
        source: 'leetcode-recent'
      });
    });

    if (oldestInBatch < startMs) break;
    if (batch.length < pageSize) break;
    skip += pageSize;
  }

  return results;
}

export async function fetchAllSolvedProblems(username) {
  const profileData = await fetchUserProfile(username);
  const total = profileData.stats.totalSolved || 0;
  const problems = await fetchAcSubmissionsAll(username, total || 50);
  await enrichDifficulties(problems);
  return { problems, stats: profileData.stats };
}

export async function syncLeetCodeProfile(username) {
  const year = new Date().getFullYear();
  const [{ problems: solvedProblems, stats: baseStats }, calendar] = await Promise.all([
    fetchAllSolvedProblems(username),
    fetchSubmissionCalendar(username, year)
  ]);

  const streak = computeStreakFromCalendar(calendar);
  const stats = {
    ...baseStats,
    streak,
    submissionCalendar: calendar,
    syncedAt: Date.now()
  };

  return { stats, solvedProblems };
}

export function slugFromLeetCodeUrl(url) {
  if (!url) return null;
  const m = String(url).match(/leetcode\.com\/problems\/([^/?#]+)/i);
  return m ? m[1] : null;
}
