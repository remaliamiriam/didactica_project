import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.js';
import { createClient } from '@supabase/supabase-js';

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
// 🧭 Conectează rutele
app.use('/users', usersRoutes);

//res.header('Access-Control-Allow-Credentials', 'true');

// ✅ Adaugă ruta check-nickname direct aici dacă n-ai făcut-o deja:
app.post('/check-nickname', async (req, res) => {
  const { nickname } = req.body;
  if (!nickname || nickname.trim() === '') {
    return res.status(400).json({ error: 'Nickname-ul este necesar.' });
  }

  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('nickname', nickname)
    .single();

  res.status(200).json({ exists: !!existingUser });
});

// 🔁 Pornește serverul
app.listen(PORT, () => {
  console.log(`✅ Serverul rulează pe http://localhost:${PORT}`);
});
