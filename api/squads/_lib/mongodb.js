'use strict';

const { MongoClient } = require('mongodb');

let client = null;
let dbPromise = null;

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('squadCodes').createIndex({ code: 1 }, { unique: true }),
    db.collection('squadMembers').createIndex({ squadId: 1, userId: 1 }, { unique: true }),
    db.collection('squadBaselines').createIndex({ squadId: 1, userId: 1 }, { unique: true }),
    db.collection('squadLeaderboard').createIndex({ squadId: 1, userId: 1 }, { unique: true }),
    db.collection('squadLeaderboard').createIndex({ squadId: 1, rank: 1 }),
    db.collection('userSquads').createIndex({ userId: 1, squadId: 1 }, { unique: true }),
    db.collection('userSquads').createIndex({ userId: 1, status: 1 }),
    db.collection('squads').createIndex({ status: 1 })
  ]);
}

async function connectMongo() {
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw Object.assign(new Error('MongoDB not configured. Set MONGODB_URI in environment.'), { status: 500 });
    }
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || 'leetlens');
    await ensureIndexes(db);
    return db;
  })();
  return dbPromise;
}

module.exports = { connectMongo };
