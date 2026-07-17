import { Router } from 'express';
import { ObjectId } from 'mongodb';
import {
  getMatchesByUser,
  createMatch,
  updateMatch,
  deleteMatch,
  findMatchById,
} from '../models/matches.js';

const router = Router();

// Get all match results for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const matches = await getMatchesByUser(userId);
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to retrieve match results.' });
  }
});

// Create a new match result
router.post('/', async (req, res) => {
  try {
    const { sport, userId, score, outcome, date } = req.body;

    if (!sport || !userId || !score || !outcome || !date) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const newMatch = {
      sport,
      userId,
      score,
      outcome,
      date,
      createdAt: new Date(),
    };

    const result = await createMatch(newMatch);
    res.status(201).json({ _id: result.insertedId, ...newMatch });
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Failed to create match result.' });
  }
});

// Update a match result
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sport, score, outcome, date } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid match ID format.' });
    }
    if (!sport || !score || !outcome || !date) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const result = await updateMatch(new ObjectId(id), {
      sport,
      score,
      outcome,
      date,
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Match result not found.' });
    }

    const updatedMatch = await findMatchById(new ObjectId(id));
    res.status(200).json(updatedMatch);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ error: 'Failed to update match result.' });
  }
});

// Delete a match result
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid match ID format.' });
    }

    const result = await deleteMatch(new ObjectId(id));
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Match result not found.' });
    }

    res.status(200).json({ message: 'Match result successfully deleted.' });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: 'Failed to delete match result.' });
  }
});

export default router;
