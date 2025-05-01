import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ error: 'userId lipsă' });

  try {
    // Extragem toți userii cu date relevante
    const { data: users, error } = await supabase
      .from('users')
      .select('id, nickname, average_score, tests_completed, perfect_scores, streak');

    if (error) throw error;

    const parsedUsers = users.map(user => ({
      ...user,
      perfect_scores: Array.isArray(user.perfect_scores) ? user.perfect_scores : [],
    }));

    const currentUser = parsedUsers.find(u => u.id === userId);
    if (!currentUser) return res.status(404).json({ error: 'Utilizator inexistent' });

    // 1. 🕒 Clasament pe timp (cei mai rapizi cu punctaj maxim)
    const topPerformers = parsedUsers
      .filter(u => u.perfect_scores.length > 0)
      .sort((a, b) => Math.min(...a.perfect_scores) - Math.min(...b.perfect_scores))
      .slice(0, 5)
      .map(u => ({
        nickname: u.nickname,
        value: Math.min(...u.perfect_scores) + ' sec',
      }));

    // 2. 📈 Clasament după nr. teste completate
    const mostTests = parsedUsers
      .sort((a, b) => b.tests_completed - a.tests_completed)
      .slice(0, 5)
      .map(u => ({
        nickname: u.nickname,
        value: u.tests_completed + ' teste',
      }));

    // 3. 🔥 Clasament streak (zile consecutive de activitate)
    const streaks = parsedUsers
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5)
      .map(u => ({
        nickname: u.nickname,
        value: u.streak + ' zile',
      }));

    // 4. 🧠 Quiz Masters (scor mediu)
    const quizMasters = parsedUsers
      .filter(u => typeof u.average_score === 'number')
      .sort((a, b) => b.average_score - a.average_score)
      .slice(0, 5)
      .map(u => ({
        nickname: u.nickname,
        value: u.average_score.toFixed(2) + ' pct.',
      }));

    // 5. 🎯 Similar cu tine (scor apropiat)
    const similar = parsedUsers
      .filter(u =>
        u.id !== userId &&
        typeof u.average_score === 'number' &&
        Math.abs(u.average_score - currentUser.average_score) <= 2
      )
      .slice(0, 5)
      .map(u => ({
        nickname: u.nickname,
        value: u.average_score.toFixed(2) + ' pct.',
      }));

    res.json({
      topPerformers,
      mostTests,
      streaks,
      quizMasters,
      similar,
    });

  } catch (err) {
    console.error("Eroare leaderboard:", err.message);
    res.status(500).json({ error: 'Eroare la extragerea clasamentului' });
  }
});

export default router;
