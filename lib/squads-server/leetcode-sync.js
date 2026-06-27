'use strict';



const LC_STATS_QUERY = `

  query userProfile($username: String!) {

    matchedUser(username: $username) {

      submitStatsGlobal {

        acSubmissionNum { difficulty count }

      }

    }

  }

`;



const LC_AC_PAGED_QUERY = `

  query recentAcPaged($username: String!, $limit: Int!, $skip: Int!) {

    recentAcSubmissionList(username: $username, limit: $limit, skip: $skip) {

      titleSlug

      timestamp

    }

  }

`;



async function fetchLeetCodeStats(username) {

  if (!username) return null;

  const res = await fetch('https://leetcode.com/graphql', {

    method: 'POST',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({ query: LC_STATS_QUERY, variables: { username } })

  });

  if (!res.ok) throw new Error('LeetCode API unavailable');

  const json = await res.json();

  const items = json?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];

  const stats = { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };

  items.forEach(item => {

    const count = item.count || 0;

    if (item.difficulty === 'All') stats.totalSolved = count;

    if (item.difficulty === 'Easy') stats.easySolved = count;

    if (item.difficulty === 'Medium') stats.mediumSolved = count;

    if (item.difficulty === 'Hard') stats.hardSolved = count;

  });

  return stats;

}



async function fetchLeetCodeSolvedSlugs(username, targetTotal = 2500) {

  if (!username) return [];

  const seen = new Set();

  const slugs = [];

  const pageSize = 50;

  let skip = 0;



  while (slugs.length < targetTotal) {

    const res = await fetch('https://leetcode.com/graphql', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({

        query: LC_AC_PAGED_QUERY,

        variables: { username, limit: pageSize, skip }

      })

    });

    if (!res.ok) break;

    const json = await res.json();

    const batch = json?.data?.recentAcSubmissionList || [];

    if (!batch.length) break;



    batch.forEach(item => {

      const slug = String(item.titleSlug || '').toLowerCase();

      if (!slug || seen.has(slug)) return;

      seen.add(slug);

      slugs.push({

        slug,

        solvedAt: Number(item.timestamp) * 1000 || Date.now(),

        difficulty: 'Unknown'

      });

    });



    if (batch.length < pageSize) break;

    skip += pageSize;

    if (skip > targetTotal + 100) break;

  }



  return slugs;

}



function githubContributions(profile) {

  const gh = profile?.githubStats;

  if (!gh) return 0;

  return gh.totalContributions || gh.contributionsThisYear || gh.contributionCount || 0;

}



const LC_DIFFICULTY_QUERY = `

  query questionDifficulty($titleSlug: String!) {

    question(titleSlug: $titleSlug) {

      difficulty

    }

  }

`;



async function fetchProblemDifficulty(titleSlug) {

  if (!titleSlug) return 'Unknown';

  try {

    const res = await fetch('https://leetcode.com/graphql', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({

        query: LC_DIFFICULTY_QUERY,

        variables: { titleSlug }

      })

    });

    if (!res.ok) return 'Unknown';

    const json = await res.json();

    return json?.data?.question?.difficulty || 'Unknown';

  } catch (_) {

    return 'Unknown';

  }

}



async function enrichDifficulties(problems, concurrency = 8, maxEnrich = 150) {

  const toEnrich = (problems || []).filter(p => {

    const d = String(p.difficulty || '');

    return !d || d === 'Unknown';

  }).slice(0, maxEnrich);



  for (let i = 0; i < toEnrich.length; i += concurrency) {

    const batch = toEnrich.slice(i, i + concurrency);

    await Promise.all(batch.map(async p => {

      p.difficulty = await fetchProblemDifficulty(p.slug);

    }));

  }



  return problems;

}



function mergeSolvedProblems(firestoreRows, leetcodeRows) {

  const map = new Map();

  (firestoreRows || []).forEach(row => {

    const slug = String(row.problemId || row.slug || row.id || '').toLowerCase();

    if (!slug) return;

    map.set(slug, {

      slug,

      difficulty: row.difficulty || 'Unknown',

      solvedAt: row.solvedAt?.toMillis?.() ?? row.solvedAt ?? Date.now()

    });

  });

  (leetcodeRows || []).forEach(row => {

    const slug = String(row.slug || '').toLowerCase();

    if (!slug) return;

    if (!map.has(slug)) {

      map.set(slug, row);

    }

  });

  return [...map.values()];

}



async function fetchUserProgress(_db, uid) {

  let profile = {};

  let stats = null;

  let firestoreSolved = [];



  try {

    const { getFirestore } = require('./firebase-admin');

    const db = getFirestore();

    const userSnap = await db.collection('users').doc(uid).get();

    profile = userSnap.exists ? userSnap.data() : {};

    const statsSnap = await db.collection('users').doc(uid).collection('stats').doc('current').get();

    if (statsSnap.exists) stats = statsSnap.data();

    const solvedSnap = await db.collection('users').doc(uid).collection('solvedProblems').get();

    firestoreSolved = solvedSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  } catch (err) {

    console.warn('[squads] Could not load user profile from Firestore:', err.message);

  }



  const lcUsername = profile.leetcodeUsername;

  let leetcodeSolved = [];

  if (lcUsername) {

    try {

      const live = await fetchLeetCodeStats(lcUsername);

      if (live) stats = { ...stats, ...live };

    } catch (_) {}

    try {

      leetcodeSolved = await fetchLeetCodeSolvedSlugs(lcUsername, stats?.totalSolved || 500);

    } catch (_) {}

  }



  const solvedProblems = mergeSolvedProblems(firestoreSolved, leetcodeSolved);

  await enrichDifficulties(solvedProblems);

  const solvedSlugs = solvedProblems.map(p => p.slug);



  return {

    totalSolved: stats?.totalSolved || solvedSlugs.length || 0,

    easySolved: stats?.easySolved || 0,

    mediumSolved: stats?.mediumSolved || 0,

    hardSolved: stats?.hardSolved || 0,

    githubContributions: githubContributions(profile),

    solvedSlugs,

    solvedProblems

  };

}



module.exports = {

  fetchLeetCodeStats,

  fetchLeetCodeSolvedSlugs,

  fetchUserProgress,

  githubContributions

};


