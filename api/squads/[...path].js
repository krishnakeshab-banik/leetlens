'use strict';

const { cors, verifyRequest, sendError } = require('./_lib/auth');
const {
  createSquad,
  joinSquad,
  lookupByCode,
  getSquadDetails,
  getLeaderboard,
  syncParticipant,
  getResults,
  listActive,
  listHistory,
  deleteHistoryEntries,
  cancelSquad,
  removeMember
} = require('./_lib/squads-service');

const NAMED = new Set(['health', 'active', 'history', 'create', 'join', 'lookup']);

function parseSegments(req) {
  const raw = req.query.path;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function parseBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return {};
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
}

async function handleHealth(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const checks = { firebaseAdmin: false, mongodb: false };

  try {
    const { getAuth } = require('./_lib/firebase-admin');
    getAuth();
    checks.firebaseAdmin = true;
  } catch (err) {
    return res.status(503).json({
      ok: false,
      checks,
      error: err.message || 'Firebase Admin not configured'
    });
  }

  try {
    const { connectMongo } = require('./_lib/mongodb');
    const db = await connectMongo();
    await db.command({ ping: 1 });
    checks.mongodb = true;
  } catch (err) {
    return res.status(503).json({
      ok: false,
      checks,
      error: err.message || 'MongoDB not configured'
    });
  }

  return res.status(200).json({ ok: true, checks });
}

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  const segments = parseSegments(req);
  const head = segments[0] || '';

  try {
    if (head === 'health') return handleHealth(req, res);

    if (head === 'lookup') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const squad = await lookupByCode(req.query.code);
      return res.status(200).json(squad);
    }

    const user = await verifyRequest(req);

    if (head === 'active') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      return res.status(200).json(await listActive(user.uid));
    }

    if (head === 'history') {
      if (req.method === 'GET') return res.status(200).json(await listHistory(user.uid));
      if (req.method === 'DELETE') {
        return res.status(200).json(await deleteHistoryEntries(user.uid, parseBody(req)));
      }
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (head === 'create') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const squad = await createSquad(user.uid, user, parseBody(req));
      return res.status(201).json(squad);
    }

    if (head === 'join') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      return res.status(200).json(await joinSquad(user.uid, user, parseBody(req)));
    }

    if (!head || NAMED.has(head)) {
      return res.status(404).json({ error: 'Not found' });
    }

    const squadId = head;
    const action = segments[1] || '';

    if (!action) {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      return res.status(200).json(await getSquadDetails(squadId, user.uid));
    }

    if (action === 'leaderboard') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      return res.status(200).json(await getLeaderboard(squadId, user.uid));
    }

    if (action === 'sync') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      return res.status(200).json(await syncParticipant(squadId, user.uid, false));
    }

    if (action === 'results') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      return res.status(200).json(await getResults(squadId, user.uid));
    }

    if (action === 'cancel') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      return res.status(200).json(await cancelSquad(squadId, user.uid));
    }

    if (action === 'members') {
      if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
      const body = parseBody(req);
      return res.status(200).json(await removeMember(squadId, user.uid, body.userId));
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    return sendError(res, err);
  }
};
