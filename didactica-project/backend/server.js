/*// server.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.js';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import step1Routes from './routes/step1.js';
import leaderboardRoutes from './routes/leaderboard.js';
import statisticsRoutes from './routes/statistics.js';
import progressRoutes from './routes/progress.js'; 

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

const app = express();
const PORT = 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
  credentials: true,
}));

app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token lipsă.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid sau expirat.' });
    req.user = user;
    next();
  });
};

// Conectăm rutele
app.use('/users', usersRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/step1', step1Routes);
app.use('/api/progress', progressRoutes); 

// rută protejată
app.get('/secure-data', authenticateToken, (req, res) => {
  res.json({ message: `Salut ${req.user.nickname}, ai acces la datele secrete!` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  console.log(`Cerere necunoscută către: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Rută inexistentă');
});*/

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname în ES module:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const distPath = path.join(__dirname, '../frontend/dist');

console.log(' Serving static files from:', distPath);
console.log(' dist folder exists:', fs.existsSync(distPath));

app.use(express.static(distPath));

app.get('/test', (req, res) => {
  res.send(' Server is working!');
});

app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(' index.html NOT FOUND at:', indexPath);
    res.status(500).send('index.html missing');
  }
});

app.listen(port, () => {
  console.log(` Server started on port ${port}`);
});
