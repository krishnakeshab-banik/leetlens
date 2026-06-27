'use strict';

const { cors, verifyRequest, sendError } = require('./_lib/auth');
const { createSquad } = require('./_lib/squads-service');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const user = await verifyRequest(req);
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const squad = await createSquad(user.uid, user, body);
    return res.status(201).json(squad);
  } catch (err) {
    return sendError(res, err);
  }
};
