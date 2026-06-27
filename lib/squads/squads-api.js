(function () {
  'use strict';

  const API_BASE = '/api/squads';

  async function ensureSession() {
    const cloud = window.LeetLensCloud;
    if (!cloud?.getAuthToken) {
      const err = new Error('Sign in to use Squads');
      err.code = 'AUTH_REQUIRED';
      throw err;
    }
    if (cloud.ensureAuthBoot) {
      await cloud.ensureAuthBoot();
    }
    if (!cloud.getCloudState?.()?.user) {
      const err = new Error('Sign in to use Squads');
      err.code = 'AUTH_REQUIRED';
      throw err;
    }
  }

  async function getToken(forceRefresh = false) {
    await ensureSession();
    return window.LeetLensCloud.getAuthToken(forceRefresh);
  }

  async function request(path, options = {}, retried = false) {
    let token;
    try {
      token = await getToken(retried);
    } catch (err) {
      if (!err.code) err.code = 'AUTH_REQUIRED';
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
      const serverMsg = data.error || `Request failed (${res.status})`;
      const err = new Error(
        res.status === 401
          ? (serverMsg.includes('configuration') ? serverMsg : 'Session expired — please sign in again')
          : serverMsg
      );
      if (res.status === 401) err.code = 'AUTH_EXPIRED';
      else if (res.status >= 500) err.code = 'SERVER_ERROR';
      else err.code = 'API_ERROR';
      err.status = res.status;
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
