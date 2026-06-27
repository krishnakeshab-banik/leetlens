'use strict';

const { cors, verifyRequest, sendError } = require('./_lib/auth');
const { lookupByCode } = require('./_lib/squads-service');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const code = req.query.code;
    const squad = await lookupByCode(code);
    return res.status(200).json(squad);
  } catch (err) {
    return sendError(res, err);
  }
};
