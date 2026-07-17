import { Router } from 'express';
import { ObjectId } from 'mongodb';
import {
  getAllGames,
  createGame,
  updateGame,
  deleteGame,
  findGameById,
} from '../models/games.js';

const router = Router();

// Get all games (with optional search, sport, and skill level filters)
router.get('/', async (req, res) => {
  try {
    const { search, sport, skillLevel } = req.query;
    const query = {};

    if (sport) {
      query.sport = sport;
    }
    if (skillLevel) {
      query.skillLevel = skillLevel;
    }
    if (search) {
      query.$or = [
        { location: { $regex: search, $options: 'i' } },
        { host: { $regex: search, $options: 'i' } },
      ];
    }

    const games = await getAllGames(query);
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to retrieve games.' });
  }
});

// Create a new game
router.post('/', async (req, res) => {
  try {
    const { sport, time, skillLevel, host, location, maxPlayers, description } =
      req.body;

    if (!sport || !time || !skillLevel || !host || !location || !maxPlayers) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const newGame = {
      sport,
      time,
      skillLevel,
      host,
      location,
      maxPlayers: parseInt(maxPlayers),
      participants: [host],
      description: description || '',
      createdAt: new Date(),
    };

    const result = await createGame(newGame);
    res.status(201).json({ _id: result.insertedId, ...newGame });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game.' });
  }
});

// Update a game
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sport, time, skillLevel, host, location, maxPlayers, description } =
      req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid game ID format.' });
    }
    if (!sport || !time || !skillLevel || !host || !location || !maxPlayers) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const result = await updateGame(new ObjectId(id), {
      sport,
      time,
      skillLevel,
      host,
      location,
      maxPlayers: parseInt(maxPlayers),
      description: description || '',
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Game not found.' });
    }

    const updatedGame = await findGameById(new ObjectId(id));
    res.status(200).json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ error: 'Failed to update game.' });
  }
});

// Join a game (add a player to participants)
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid game ID format.' });
    }
    if (!username) {
      return res.status(400).json({ error: 'Username is required to join.' });
    }

    const game = await findGameById(new ObjectId(id));
    if (!game) {
      return res.status(404).json({ error: 'Game not found.' });
    }
    if (game.participants.includes(username)) {
      return res.status(400).json({ error: 'You already joined this game.' });
    }
    if (game.participants.length >= game.maxPlayers) {
      return res.status(400).json({ error: 'This game is already full.' });
    }

    const updatedParticipants = [...game.participants, username];
    await updateGame(new ObjectId(id), { participants: updatedParticipants });

    const updatedGame = await findGameById(new ObjectId(id));
    res.status(200).json(updatedGame);
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({ error: 'Failed to join game.' });
  }
});

// Delete a game
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid game ID format.' });
    }

    const result = await deleteGame(new ObjectId(id));
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Game not found.' });
    }

    res.status(200).json({ message: 'Game successfully deleted.' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game.' });
  }
});

export default router;
