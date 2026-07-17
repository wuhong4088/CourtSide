import { db } from '../db/connector.js';

export async function getMatchesByUser(userId) {
  if (!db) return [];
  return await db
    .collection('match_results')
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createMatch(match) {
  if (!db) return null;
  return await db.collection('match_results').insertOne(match);
}

export async function updateMatch(id, fields) {
  if (!db) return null;
  return await db
    .collection('match_results')
    .updateOne({ _id: id }, { $set: fields });
}

export async function deleteMatch(id) {
  if (!db) return null;
  return await db.collection('match_results').deleteOne({ _id: id });
}

export async function findMatchById(id) {
  if (!db) return null;
  return await db.collection('match_results').findOne({ _id: id });
}
