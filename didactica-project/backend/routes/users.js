import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// Conectare Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ Creare cont doar pe baza nickname-ului (fără parolă)
router.post('/create-nickname-account', async (req, res) => {
  console.log('Cerere POST primită: ', req.body);
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
      console.error('Eroare verificare utilizator:', existingUserError);
      return res.status(500).json({ 
        error: 'Eroare la verificarea utilizatorului.', 
        details: existingUserError.message || existingUserError 
      });
    }
    

  if (existingUser) {
    console.log('Utilizator deja existent:', existingUser);
    return res.status(200).json({ message: 'Utilizator deja existent.', user: existingUser });
  }

  // Creare cont fără parolă
  const { data, error } = await supabase
    .from('users')
    .insert([{ nickname }])
    .select(); // 👈 Asta forțează returnarea rândului inserat

  if (error) {
    console.error('Eroare la crearea contului:', error);
    return res.status(500).json({ error: 'Eroare la crearea contului.', details: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(500).json({ error: 'Eroare la crearea contului.' });
  }

  console.log('Cont creat cu succes:', data[0]);
  res.status(201).json({ message: 'Cont creat cu succes!', user: data[0] });
});

export default router;
