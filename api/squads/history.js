'use strict';

const { cors, verifyRequest, sendError } = require('./_lib/auth');
const { listHistory } = require('./_lib/squads-service');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const user = await verifyRequest(req);
    const data = await listHistory(user.uid);
    return res.status(200).json(data);
  } catch (err) {
    return sendError(res, err);
  }
};
