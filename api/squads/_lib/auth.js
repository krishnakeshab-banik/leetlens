'use strict';

const { getAuth } = require('./firebase-admin');

async function verifyRequest(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    const err = new Error('Authentication required');
    err.status = 401;
    throw err;
  }
  try {
    const decoded = await getAuth().verifyIdToken(match[1]);
    return decoded;
  } catch (_) {
    const err = new Error('Invalid or expired token');
    err.status = 401;
    throw err;
  }
}

function sendError(res, err) {
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Request failed' });
}

function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { verifyRequest, sendError, cors };
