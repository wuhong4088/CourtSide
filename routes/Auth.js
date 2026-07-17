import { Router } from 'express';
import passport from 'passport';
import crypto from 'crypto';
import { findUserByUsername, createUser } from '../models/users.js';
import { hashPassword } from '../config/passport.js';

const router = Router();

// GET /api/auth/session
router.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ username: req.user.username });
  }
  return res.status(401).json({ error: 'No active session' });
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  const { username, password, name, age, gender } = req.body;
  if (!username || !password || !name || !age || !gender) {
    return res.status(400).json({
      error: 'Email, password, name, age, and gender are required.',
    });
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  if (!isValidEmail) {
    return res
      .status(400)
      .json({ error: 'Please provide a valid email address.' });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);

    const newUser = {
      username,
      salt,
      passwordHash,
      name,
      age: parseInt(age),
      gender,
      createdAt: new Date(),
    };

    await createUser(newUser);

    req.login(newUser, (err) => {
      if (err) return next(err);
      return res.status(201).json({ username: newUser.username });
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required.' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(400)
        .json({ error: info.message || 'Invalid username or password.' });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.status(200).json({ username: user.username });
    });
  })(req, res, next);
});

// POST /api/auth/logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Successfully logged out.' });
    });
  });
});

export default router;
