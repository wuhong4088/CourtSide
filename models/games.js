import { db } from '../db/connector.js';

export async function getAllGames(query) {
  if (!db) return [];
  return await db
    .collection('games')
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createGame(game) {
  if (!db) return null;
  return await db.collection('games').insertOne(game);
}

export async function updateGame(id, fields) {
  if (!db) return null;
  return await db.collection('games').updateOne({ _id: id }, { $set: fields });
}

export async function deleteGame(id) {
  if (!db) return null;
  return await db.collection('games').deleteOne({ _id: id });
}

export async function findGameById(id) {
  if (!db) return null;
  return await db.collection('games').findOne({ _id: id });
}
