(function () {
  'use strict';

  const API_BASE = '/api/squads';

  async function getToken(forceRefresh = false) {
    const cloud = window.LeetLensCloud;
    if (!cloud?.getAuthToken) throw new Error('Sign in to use Squads');
    return cloud.getAuthToken(forceRefresh);
  }

  async function request(path, options = {}, retried = false) {
    let token;
    try {
      token = await getToken(retried);
    } catch (_) {
      const err = new Error('Sign in to use Squads');
      err.code = 'AUTH_REQUIRED';
      throw err;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    const data = await res.json().catch(() => ({}));

    if (res.status === 401 && !retried) {
      return request(path, options, true);
    }

    if (!res.ok) {
      const err = new Error(
        res.status === 401
          ? 'Session expired — please sign in again'
          : (data.error || `Request failed (${res.status})`)
      );
      err.code = res.status === 401 ? 'AUTH_EXPIRED' : 'API_ERROR';
      throw err;
    }
    return data;
  }

  window.SquadsAPI = {
    create: (body) => request('/create', { method: 'POST', body: JSON.stringify(body) }),
    join: (body) => request('/join', { method: 'POST', body: JSON.stringify(body) }),
    lookup: (code) => fetch(`${API_BASE}/lookup?code=${encodeURIComponent(code)}`).then(r => r.json()).then(d => {
      if (d.error) throw new Error(d.error);
      return d;
    }),
    active: () => request('/active'),
    history: () => request('/history'),
    get: (id) => request(`/${id}`),
    leaderboard: (id) => request(`/${id}/leaderboard`),
    sync: (id) => request(`/${id}/sync`, { method: 'POST' }),
    results: (id) => request(`/${id}/results`)
  };
})();
