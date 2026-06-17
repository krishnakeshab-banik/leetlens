const GRAPHQL_URL = 'https://leetcode.com/graphql';

async function graphql(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
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
      submitStats {
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

const USER_PROBLEMS_QUERY = `
  query userProblems($username: String!) {
    matchedUser(username: $username) {
      problemsSolvedBeatsStats { difficulty percentage }
      tagProblemCounts { advanced { tagName problemsSolved } intermediate { tagName problemsSolved } fundamental { tagName problemsSolved } }
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
    return { valid: false, error: err.message };
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
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

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

export async function syncLeetCodeProfile(username) {
  const year = new Date().getFullYear();
  const [profileData, calendar, recentSubmissions] = await Promise.all([
    fetchUserProfile(username),
    fetchSubmissionCalendar(username, year),
    fetchRecentSubmissions(username, 50)
  ]);

  const streak = computeStreakFromCalendar(calendar);
  const stats = {
    ...profileData.stats,
    streak,
    submissionCalendar: calendar,
    recentSubmissions,
    acceptanceStats: profileData.profile,
    syncedAt: Date.now()
  };

  const solvedProblems = recentSubmissions
    .filter(s => s.statusDisplay === 'Accepted')
    .map(s => ({
      problemId: s.titleSlug,
      title: s.title,
      solvedAt: Number(s.timestamp) * 1000,
      source: 'leetcode-sync'
    }));

  return { stats, solvedProblems };
}

export function slugFromLeetCodeUrl(url) {
  if (!url) return null;
  const m = String(url).match(/leetcode\.com\/problems\/([^/?#]+)/i);
  return m ? m[1] : null;
}
