import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from './config/passport.js'; // imports configured passport
import courtRoutes from './routes/courts.js';
import checklistRoutes from './routes/checklists.js';
import gameRoutes from './routes/games.js';
import matchRoutes from './routes/matches.js';
import authRoutes from './routes/Auth.js'; // capital A

dotenv.config();

if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET is not defined in the environment variables.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Set up __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'courtside_secret_key_123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day session cookie
    },
  })
);

// Initialize Passport & Session Support
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/courts', courtRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/auth', authRoutes);

// Serve static React files (built in dist/)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for React Router client-side routing (SPAs)
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
