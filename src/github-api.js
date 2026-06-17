const GITHUB_API = 'https://api.github.com';

function githubUrl(path) {
  if (typeof window !== 'undefined' && window.__LEETLENS_WEB__) {
    return `/api/github?path=${encodeURIComponent(path)}`;
  }
  return `${GITHUB_API}${path}`;
}

async function ghFetch(path) {
  const res = await fetch(githubUrl(path), {
    headers: { Accept: 'application/vnd.github+json' }
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function validateGithubUsername(username) {
  const clean = (username || '').trim().toLowerCase();
  if (!clean || !/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/.test(clean)) {
    return { valid: false, error: 'Invalid GitHub username' };
  }
  try {
    const profile = await ghFetch(`/users/${clean}`);
    if (!profile) return { valid: false, error: 'GitHub user not found' };
    return { valid: true, username: clean, profile };
  } catch (err) {
    const msg = err.message === 'Failed to fetch'
      ? 'Could not reach GitHub. Check your connection or try again later.'
      : err.message;
    return { valid: false, error: msg };
  }
}

export async function syncGithubProfile(username) {
  const clean = username.trim().toLowerCase();
  const [profile, repos] = await Promise.all([
    ghFetch(`/users/${clean}`),
    ghFetch(`/users/${clean}/repos?per_page=100&sort=updated`)
  ]);
  if (!profile) throw new Error('GitHub user not found');

  const repoList = Array.isArray(repos) ? repos : [];
  const languages = {};
  let totalForks = 0;
  let totalWatchers = 0;
  let recentlyUpdated = 0;
  const thirtyDaysAgo = Date.now() - 30 * 86400000;

  repoList.forEach(r => {
    if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
    totalForks += r.forks_count || 0;
    totalWatchers += r.watchers_count || 0;
    if (r.updated_at && new Date(r.updated_at).getTime() > thirtyDaysAgo) recentlyUpdated++;
  });

  const sortedByStars = [...repoList].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
  const topRepo = sortedByStars[0];
  const totalStars = repoList.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const langTotal = Object.values(languages).reduce((s, n) => s + n, 0) || 1;

  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / langTotal) * 100)
    }));

  const reposWithDesc = repoList.filter(r => r.description).length;
  const avgStars = repoList.length ? Math.round((totalStars / repoList.length) * 10) / 10 : 0;

  return {
    username: clean,
    displayName: profile.name || clean,
    bio: profile.bio || '',
    avatarUrl: profile.avatar_url,
    profileUrl: profile.html_url,
    publicRepos: profile.public_repos || 0,
    followers: profile.followers || 0,
    following: profile.following || 0,
    totalStars,
    totalForks,
    totalWatchers,
    recentlyUpdated,
    reposWithDescription: reposWithDesc,
    avgStarsPerRepo: avgStars,
    accountCreated: profile.created_at,
    topRepo: topRepo ? {
      name: topRepo.name,
      stars: topRepo.stargazers_count || 0,
      url: topRepo.html_url,
      language: topRepo.language || 'Unknown'
    } : null,
    topLanguages,
    recentRepos: repoList.map(r => ({
      name: r.name,
      description: r.description || '',
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      watchers: r.watchers_count || 0,
      language: r.language || 'Unknown',
      updatedAt: r.updated_at,
      createdAt: r.created_at,
      url: r.html_url,
      hasWiki: r.has_wiki,
      openIssues: r.open_issues_count || 0
    })),
    syncedAt: Date.now()
  };
}
