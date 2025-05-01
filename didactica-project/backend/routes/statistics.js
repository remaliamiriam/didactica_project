import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Utilitar pentru calcul streak folosind Supabase
async function calculateStreak(userId) {
  const { data: completions, error } = await supabase
    .from('statistics')
    .select('completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error || !completions || completions.length === 0) return 0;

  let streak = 1;
  let prevDate = new Date(completions[0].completed_at);

  for (let i = 1; i < completions.length; i++) {
    const currentDate = new Date(completions[i].completed_at);
    const diffTime = prevDate - currentDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      prevDate = currentDate;
    } else if (diffDays > 1) {
      break;
    }
  }

  // Actualizează streak-ul în tabela users
  await supabase
    .from('users')
    .update({ streak })
    .eq('id', userId);

  return streak;
}

router.post('/', async (req, res) => {
  const { user_id, test_id, score } = req.body;

  if (!user_id || !test_id || score === undefined) {
    return res.status(400).json({ error: 'Date lipsă' });
  }

  try {
    // 1. Inserare în statistics
    const { data: inserted, error: insertError } = await supabase
      .from('statistics')
      .insert([{
        user_id,
        test_id,
        score,
        completed_at: new Date()
      }])
      .select();

    if (insertError) throw insertError;

    // 2. Recalculează scorul mediu și numărul de teste
    const { data: stats, error: userStatsError } = await supabase
      .from('statistics')
      .select('score')
      .eq('user_id', user_id);

    const scores = stats.map(row => row.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const testsCompleted = scores.length;

    await supabase
      .from('users')
      .update({
        average_score: Math.round(averageScore * 100) / 100,
        tests_completed: testsCompleted
      })
      .eq('id', user_id);

    // 3. Adaugă timestamp în perfect_scores dacă scorul e 100
    if (score === 100) {
      await supabase.rpc('append_perfect_score', {
        uid: user_id,
        timestamp: Math.floor(Date.now() / 1000) // Unix timestamp
      });
    }

    // 4. Calculează streak-ul
    await calculateStreak(user_id);

    res.status(201).json({ success: true, statistics: inserted[0] });
  } catch (err) {
    console.error('Eroare la salvarea statisticilor:', err);
    res.status(500).json({ error: 'Eroare internă' });
  }
});

export default router;
