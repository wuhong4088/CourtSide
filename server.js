import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import courtRoutes from './routes/courts.js';
import checklistRoutes from './routes/checklists.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set up __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// API Routes
app.use('/api/courts', courtRoutes);
app.use('/api/checklist', checklistRoutes); // Mounts to match the proposal paths

// Serve static React files (built in dist/)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for React Router client-side routing (SPAs)
app.get('*', (req, res) => {
  // If the request starts with /api but wasn't handled by routes above, send 404
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

