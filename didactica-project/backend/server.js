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

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

const app = express();
const PORT = 4000;

// Configurare CORS cu cookies
app.use(cors({
  origin: 'http://localhost:3000', // Frontend-ul tău
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
  credentials: true, // Asta e cheia
}));

app.use(express.json());

// Middleware pentru autentificare token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: 'Token lipsă.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid sau expirat.' });
    req.user = user;
    next();
  });
};

// Conectează rutele
app.use('/users', usersRoutes);

// Ruta protejată de autentificare
app.get('/secure-data', authenticateToken, (req, res) => {
  res.json({ message: `Salut ${req.user.nickname}, ai acces la datele secrete!` });
});

app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/step1', step1Routes);

// Pornește serverul
app.listen(PORT, () => {
  console.log(`✅ Serverul rulează pe http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  console.log(`➡️ Cerere necunoscută către: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Rută inexistentă');
});


