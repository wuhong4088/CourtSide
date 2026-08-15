import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../db/connector.js';

const router = Router();

// Older courts only have a single review/rating field. Normalize them into
// the reviews-array shape so the frontend only ever deals with one format.
function normalizeCourt(court) {
  if (Array.isArray(court.reviews)) {
    return court;
  }

  const reviews = court.review
    ? [
        {
          _id: new ObjectId(),
          author: 'CourtSide Community',
          rating: court.rating,
          text: court.review,
          createdAt: court.createdAt,
        },
      ]
    : [];

  return { ...court, reviews, rating: court.rating };
}

function averageRating(reviews) {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

// Get all court locations
router.get('/', async (req, res) => {
  if (!db) {
    return res
      .status(500)
      .json({ error: 'Database connection is not active.' });
  }

  try {
    const { search, sport } = req.query;
    let query = {};

    if (sport) {
      query.sport = sport;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const courts = await db
      .collection('courts')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(courts.map(normalizeCourt));
  } catch (error) {
    console.error('Error fetching courts:', error);
    res.status(500).json({ error: 'Failed to retrieve courts.' });
  }
});

// Create a new court location (with its first review)
router.post('/', async (req, res) => {
  if (!db) {
    return res
      .status(500)
      .json({ error: 'Database connection is not active.' });
  }

  try {
    const { name, address, review, rating, sport, author } = req.body;

    if (!name || !address || !review || rating === undefined || !sport) {
      return res.status(400).json({
        error:
          'Missing required fields. Required: name, address, review, rating, sport.',
      });
    }

    const firstReview = {
      _id: new ObjectId(),
      author: author || 'Anonymous',
      rating: parseFloat(rating),
      text: review,
      createdAt: new Date(),
    };

    const newCourt = {
      name,
      address,
      sport,
      reviews: [firstReview],
      rating: firstReview.rating,
      createdAt: new Date(),
    };

    const result = await db.collection('courts').insertOne(newCourt);
    res.status(201).json({
      _id: result.insertedId,
      ...newCourt,
    });
  } catch (error) {
    console.error('Error creating court:', error);
    res.status(500).json({ error: 'Failed to create court.' });
  }
});

// Update a court's facility info (name/address/sport only, not reviews)
router.put('/:id', async (req, res) => {
  if (!db) {
    return res
      .status(500)
      .json({ error: 'Database connection is not active.' });
  }

  try {
    const { id } = req.params;
    const { name, address, sport } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid court ID format.' });
    }

    if (!name || !address || !sport) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const filter = { _id: new ObjectId(id) };
    const result = await db.collection('courts').updateOne(filter, {
      $set: { name, address, sport },
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Court location not found.' });
    }

    const updatedCourt = await db.collection('courts').findOne(filter);
    res.status(200).json(normalizeCourt(updatedCourt));
  } catch (error) {
    console.error('Error updating court:', error);
    res.status(500).json({ error: 'Failed to update court.' });
  }
});

// Add a new review to an existing court
router.post('/:id/reviews', async (req, res) => {
  if (!db) {
    return res
      .status(500)
      .json({ error: 'Database connection is not active.' });
  }

  try {
    const { id } = req.params;
    const { author, rating, text } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid court ID format.' });
    }
    if (!author || rating === undefined || !text) {
      return res
        .status(400)
        .json({ error: 'Author, rating, and review text are required.' });
    }

    const filter = { _id: new ObjectId(id) };
    const court = await db.collection('courts').findOne(filter);
    if (!court) {
      return res.status(404).json({ error: 'Court location not found.' });
    }

    const normalized = normalizeCourt(court);
    if (normalized.reviews.some((r) => r.author === author)) {
      return res.status(400).json({
        error:
          'You already reviewed this court. Edit your existing review instead.',
      });
    }

    const newReview = {
      _id: new ObjectId(),
      author,
      rating: parseFloat(rating),
      text,
      createdAt: new Date(),
    };
    const updatedReviews = [...normalized.reviews, newReview];

    await db.collection('courts').updateOne(filter, {
      $set: { reviews: updatedReviews, rating: averageRating(updatedReviews) },
    });

    const updatedCourt = await db.collection('courts').findOne(filter);
    res.status(201).json(normalizeCourt(updatedCourt));
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review.' });
  }
});

// Update your own review on a court
router.put('/:id/reviews/:reviewId', async (req, res) => {
  if (!db) {
    return res
      .status(500)
      .json({ error: 'Database connection is not active.' });
  }

  try {
    const { id, reviewId } = req.params;
    const { author, rating, text } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid court ID format.' });
    }
    if (!author || rating === undefined || !text) {
      return res
        .status(400)
        .json({ error: 'Author, rating, and review text are required.' });
    }

    const filter = { _id: new ObjectId(id) };
    const court = await db.collection('courts').findOne(filter);
    if (!court) {
      return res.status(404).json({ error: 'Court location not found.' });
    }

    const normalized = normalizeCourt(court);
    const targetReview = normalized.reviews.find(
      (r) => r._id.toString() === reviewId
    );
    if (!targetReview) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    if (targetReview.author !== author) {
      return res
        .status(403)
        .json({ error: 'You can only edit your own review.' });
    }

    const updatedReviews = normalized.reviews.map((r) =>
      r._id.toString() === reviewId
        ? { ...r, rating: parseFloat(rating), text }
        : r
    );

    await db.collection('courts').updateOne(filter, {
      $set: { reviews: updatedReviews, rating: averageRating(updatedReviews) },
    });

    const updatedCourt = await db.collection('courts').findOne(filter);
    res.status(200).json(normalizeCourt(updatedCourt));
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review.' });
  }
});

// Delete your own review from a court
router.delete('/:id/reviews/:reviewId', async (req, res) => {
  if (!db) {
    return res
      .status(500)
      .json({ error: 'Database connection is not active.' });
  }

  try {
    const { id, reviewId } = req.params;
    const { author } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid court ID format.' });
    }

    const filter = { _id: new ObjectId(id) };
    const court = await db.collection('courts').findOne(filter);
    if (!court) {
      return res.status(404).json({ error: 'Court location not found.' });
    }

    const normalized = normalizeCourt(court);
    const targetReview = normalized.reviews.find(
      (r) => r._id.toString() === reviewId
    );
    if (!targetReview) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    if (targetReview.author !== author) {
      return res
        .status(403)
        .json({ error: 'You can only delete your own review.' });
    }

    const updatedReviews = normalized.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );

    await db.collection('courts').updateOne(filter, {
      $set: { reviews: updatedReviews, rating: averageRating(updatedReviews) },
    });

    const updatedCourt = await db.collection('courts').findOne(filter);
    res.status(200).json(normalizeCourt(updatedCourt));
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review.' });
  }
});

// Delete a court location
router.delete('/:id', async (req, res) => {
  if (!db) {
    return res
      .status(500)
      .json({ error: 'Database connection is not active.' });
  }

  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid court ID format.' });
    }

    const result = await db
      .collection('courts')
      .deleteOne({ _id: new ObjectId(id) });

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
