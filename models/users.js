import { db } from '../db/connector.js';

export async function findUserByUsername(username) {
  if (!db) return null;
  return await db.collection('users').findOne({ username });
}

export async function createUser(user) {
  if (!db) return null;
  return await db.collection('users').insertOne(user);
}
