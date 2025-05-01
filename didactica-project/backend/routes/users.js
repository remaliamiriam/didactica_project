import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const router = express.Router();

// Conectare Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Creare cont doar pe baza nickname-ului (fără parolă)
router.post('/create-nickname-account', async (req, res) => {
  const { nickname } = req.body;

  if (!nickname || nickname.trim() === '') {
    return res.status(400).json({ error: 'Nickname-ul este necesar.' });
  }

  // Verifică dacă deja există
  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('*')
    .eq('nickname', nickname)
    .maybeSingle(); // 👈 Asta returnează un singur rând sau nimic

  if (existingUserError) {
    return res.status(500).json({ 
      error: 'Eroare la verificarea utilizatorului.', 
      details: existingUserError.message || existingUserError 
    });
  }

  if (existingUser) {
    // Generează token temporar (valabil 24h)
    const token = jwt.sign(
      { id: existingUser.id, nickname: existingUser.nickname },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ 
      message: 'Utilizator deja existent.', 
      user: existingUser,
      token
    });
  }

  // Creare cont fără parolă
  const { data, error } = await supabase
    .from('users')
    .insert([{ nickname }])
    .select(); // 👈 Asta forțează returnarea rândului inserat

  if (error) {
    return res.status(500).json({ error: 'Eroare la crearea contului.', details: error.message });
  }

  const newUser = data[0];

  // Generează token temporar (valabil 24h)
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

export default router;
