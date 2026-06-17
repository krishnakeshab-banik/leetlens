const GITHUB_API = 'https://api.github.com';

async function ghFetch(path) {
  const res = await fetch(`${GITHUB_API}${path}`, {
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
    return { valid: false, error: err.message };
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
  repoList.forEach(r => {
    if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
  });

  return {
    username: clean,
    displayName: profile.name || clean,
    bio: profile.bio || '',
    avatarUrl: profile.avatar_url,
    profileUrl: profile.html_url,
    publicRepos: profile.public_repos || 0,
    followers: profile.followers || 0,
    following: profile.following || 0,
    totalStars: repoList.reduce((s, r) => s + (r.stargazers_count || 0), 0),
    topLanguages: Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    recentRepos: repoList.slice(0, 8).map(r => ({
      name: r.name,
      description: r.description || '',
      stars: r.stargazers_count || 0,
      language: r.language || 'Unknown',
      updatedAt: r.updated_at,
      url: r.html_url
    })),
    syncedAt: Date.now()
  };
}
