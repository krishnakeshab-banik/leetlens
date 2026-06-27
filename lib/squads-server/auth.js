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
    const decoded = await getAuth().verifyIdToken(match[1], true);
    return decoded;
  } catch (e) {
    if (e?.status && e.status >= 500) throw e;
    const raw = e?.message || '';
    let message = 'Invalid or expired token';
    if (/incorrect "aud"/i.test(raw) || /project/i.test(raw)) {
      message = 'Auth configuration mismatch on server (Firebase service account / project ID)';
    }
    const err = new Error(message);
    err.status = 401;
    throw err;
  }
}

function sendError(res, err) {
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Request failed' });
}

function cors(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { verifyRequest, sendError, cors };
