'use strict';

const { cors, sendError } = require('./_lib/auth');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
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
};
