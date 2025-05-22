import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();
const router = express.Router();

// Conectare Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Creare cont cu nickname + parolă
router.post('/create-account', async (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || nickname.trim() === '' || !password) {
    return res.status(400).json({ error: 'Nickname și parola sunt necesare.' });
  }

  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('*')
    .eq('nickname', nickname)
    .maybeSingle();

  if (existingUserError) {
    return res.status(500).json({
      error: 'Eroare la verificarea utilizatorului.',
      details: existingUserError.message || existingUserError
    });
  }

  if (existingUser) {
    return res.status(409).json({ error: 'Nickname deja folosit.' });
  }

  // Hash-uiește parola
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ nickname, password: hashedPassword }])
    .select();

  if (error) {
    return res.status(500).json({ error: 'Eroare la crearea contului.', details: error.message });
  }

  const newUser = data[0];

  const token = jwt.sign(
    { id: newUser.id, nickname: newUser.nickname },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.status(201).json({
    message: 'Cont creat cu succes!',
    user: newUser,
    token
  });
});

// Login cu nickname + parolă
router.post('/login', async (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({ error: 'Nickname și parola sunt necesare.' });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('nickname', nickname)
    .maybeSingle();

  if (error || !user) {
    return res.status(401).json({ error: 'Nickname sau parolă incorecte.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: 'Nickname sau parolă incorecte.' });
  }

  const token = jwt.sign(
    { id: user.id, nickname: user.nickname },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.status(200).json({
    message: 'Autentificare reușită!',
    user,
    token
  });
});

export default router;
