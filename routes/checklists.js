import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../db/connector.js';

const router = Router();

// Get checklists for a specific user
router.get('/:userId', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database connection is not active.' });
  }

  try {
    const { userId } = req.params; // username (e.g. "Morgan")
    const checklists = await db
      .collection('checklists')
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(checklists);
  } catch (error) {
    console.error('Error fetching checklists:', error);
    res.status(500).json({ error: 'Failed to retrieve checklists.' });
  }
});

// Create a new checklist
router.post('/', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database connection is not active.' });
  }

  try {
    const { userId, title, items } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: 'UserId (username) and Title are required.' });
    }

    const newChecklist = {
      userId,
      title,
      items: Array.isArray(items) ? items : [], // Array of { name: String, checked: Boolean }
      createdAt: new Date()
    };

    const result = await db.collection('checklists').insertOne(newChecklist);
    res.status(201).json({
      _id: result.insertedId,
      ...newChecklist
    });
  } catch (error) {
    console.error('Error creating checklist:', error);
    res.status(500).json({ error: 'Failed to create checklist.' });
  }
});

// Update a checklist (e.g. modify checklist items, checked states, or title)
router.put('/:id', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database connection is not active.' });
  }

  try {
    const { id } = req.params;
    const { title, items } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid checklist ID format.' });
    }

    if (!title || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Title and items array are required.' });
    }

    const filter = { _id: new ObjectId(id) };
    const result = await db.collection('checklists').updateOne(filter, {
      $set: { title, items }
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Checklist not found.' });
    }

    const updatedChecklist = await db.collection('checklists').findOne(filter);
    res.status(200).json(updatedChecklist);
  } catch (error) {
    console.error('Error updating checklist:', error);
    res.status(500).json({ error: 'Failed to update checklist.' });
  }
});

// Delete a checklist
router.delete('/:id', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database connection is not active.' });
  }

  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid checklist ID format.' });
    }

    const result = await db.collection('checklists').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Checklist not found.' });
    }

    res.status(200).json({ message: 'Checklist successfully deleted.' });
  } catch (error) {
    console.error('Error deleting checklist:', error);
    res.status(500).json({ error: 'Failed to delete checklist.' });
  }
});

export default router;
