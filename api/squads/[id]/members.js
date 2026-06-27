'use strict';

const { cors, verifyRequest, sendError } = require('../_lib/auth');
const { removeMember } = require('../_lib/squads-service');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const user = await verifyRequest(req);
    const squadId = req.query.id;
    if (!squadId) return res.status(400).json({ error: 'Squad id required' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const data = await removeMember(squadId, user.uid, body.userId);
    return res.status(200).json(data);
  } catch (err) {
    return sendError(res, err);
  }
};
