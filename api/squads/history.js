'use strict';

const { cors, verifyRequest, sendError } = require('./_lib/auth');
const { listHistory, deleteHistoryEntries } = require('./_lib/squads-service');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  try {
    const user = await verifyRequest(req);
    if (req.method === 'GET') {
      const data = await listHistory(user.uid);
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const data = await deleteHistoryEntries(user.uid, body);
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return sendError(res, err);
  }
};
