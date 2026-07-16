import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../db/connector.js';

const router = Router();

// Get all court locations
router.get('/', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database connection is not active.' });
  }

  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const courts = await db.collection('courts').find(query).sort({ createdAt: -1 }).toArray();
    res.status(200).json(courts);
  } catch (error) {
    console.error('Error fetching courts:', error);
    res.status(500).json({ error: 'Failed to retrieve courts.' });
  }
});

// Create a new court location
router.post('/', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database connection is not active.' });
  }

  try {
    const { name, address, review, rating } = req.body;

    if (!name || !address || !review || rating === undefined) {
      return res.status(400).json({
        error: 'Missing required fields. Required: name, address, review, rating.'
      });
    }

    const newCourt = {
      name,
      address,
      review,
      rating: parseFloat(rating),
      createdAt: new Date()
    };

    const result = await db.collection('courts').insertOne(newCourt);
    res.status(201).json({
      _id: result.insertedId,
      ...newCourt
    });
  } catch (error) {
    console.error('Error creating court:', error);
    res.status(500).json({ error: 'Failed to create court.' });
  }
});

// Update an existing court location
router.put('/:id', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database connection is not active.' });
  }

  try {
    const { id } = req.params;
    const { name, address, review, rating } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid court ID format.' });
    }

    if (!name || !address || !review || rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const filter = { _id: new ObjectId(id) };
    const result = await db.collection('courts').updateOne(filter, {
      $set: {
        name,
        address,
        review,
        rating: parseFloat(rating)
      }
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Court location not found.' });
    }

    const updatedCourt = await db.collection('courts').findOne(filter);
    res.status(200).json(updatedCourt);
  } catch (error) {
    console.error('Error updating court:', error);
    res.status(500).json({ error: 'Failed to update court.' });
  }
});

// Delete a court location
router.delete('/:id', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database connection is not active.' });
  }

  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid court ID format.' });
    }

    const result = await db.collection('courts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Court location not found.' });
    }

    res.status(200).json({ message: 'Court location successfully deleted.' });
  } catch (error) {
    console.error('Error deleting court:', error);
    res.status(500).json({ error: 'Failed to delete court.' });
  }
});

export default router;
