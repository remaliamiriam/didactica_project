import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticateToken } from '../authMiddleware.js'; // Asigură-te că calea e corectă

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Mapează step-urile la UUID-uri corespunzătoare
const stepToUUID = {
  "step1": "1705dc84-019d-4016-aeeb-9b881f4731e0",
  "step2": "77c370d4-f4f4-45fa-8bb8-6ae45c3d85cf",
  "step3": "9c76345b-6bf3-4ec7-ac9f-0d186c8a82a2",
  "step4": "d0e6172f-a834-4ec3-ac25-8457305124e9",
  "step5": "70eb6b63-1651-46b7-a278-2f8b8729e29f",
  "step6": "532a2b4a-a072-47bd-93ed-aa78a51125e9",
  "step7": "6601bb0e-8939-4476-b2f5-8c97d3e1926c",
};

// Calculează și actualizează streak-ul
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

  const { error: streakError } = await supabase
    .from('users')
    .update({ streak })
    .eq('id', userId);

  if (streakError) {
    console.error('Eroare la actualizarea streak-ului:', streakError);
    return 0;
  }

  return streak;
}

// ✅ Middleware JWT aplicat pe rută
router.post('/', authenticateToken, async (req, res) => {
  const user_id = req.user.id; // 🔐 Obținut din JWT
  const { test_id, score } = req.body;

  if (!test_id || score === undefined) {
    return res.status(400).json({ error: 'Date lipsă' });
  }

  try {
    const testUUID = stepToUUID[test_id];
    if (!testUUID) {
      return res.status(400).json({ error: 'Test ID invalid' });
    }

    const { data: inserted, error: insertError } = await supabase
      .from('statistics')
      .insert([{
        user_id,
        test_id: testUUID,
        score,
        completed_at: new Date()
      }])
      .select();

    if (insertError) throw insertError;

    const { data: stats, error: userStatsError } = await supabase
      .from('statistics')
      .select('score')
      .eq('user_id', user_id);

    if (userStatsError || !stats || stats.length === 0) {
      return res.status(500).json({ error: 'Eroare la obținerea statisticilor utilizatorului' });
    }

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

    if (score === 100) {
      await supabase.rpc('append_perfect_score', {
        uid: user_id,
        timestamp: Math.floor(Date.now() / 1000)
      });
    }

    const streak = await calculateStreak(user_id);
    if (streak === 0) {
      return res.status(500).json({ error: 'Eroare la calcularea streak-ului' });
    }

    res.status(201).json({ success: true, statistics: inserted[0] });
  } catch (err) {
    console.error('Eroare la salvarea statisticilor:', err);
    res.status(500).json({ error: 'Eroare internă' });
  }
});

export default router;
