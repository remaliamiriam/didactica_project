import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticateToken } from '../authMiddleware.js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Step to test_id mapping
const stepToTestId = {
  1: '1705dc84-019d-4016-aeeb-9b881f4731e0',
  2: '77c370d4-f4f4-45fa-8bb8-6ae45c3d85cf',
  3: '9c76345b-6bf3-4ec7-ac9f-0d186c8a82a2',
  4: 'd0e6172f-a834-4ec3-ac25-8457305124e9',
  5: '70eb6b63-1651-46b7-a278-2f8b8729e29f',
  6: '532a2b4a-a072-47bd-93ed-aa78a51125e9',
  7: '6601bb0e-8939-4476-b2f5-8c97d3e1926c'
};

// Get unlocked steps
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('statistics')
      .select('test_id')
      .eq('user_id', userId);

    if (error) throw error;

    const stepsUnlocked = data.map(row => {
      for (const [step, testId] of Object.entries(stepToTestId)) {
        if (row.test_id === testId) return `step${step}`;
      }
      return null;
    }).filter(Boolean);

    res.status(200).json({ stepsUnlocked });
  } catch (err) {
    console.error('Eroare la obținerea progresului:', err);
    res.status(500).json({ error: 'Eroare internă la obținerea progresului.' });
  }
});

// Record quiz completion
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { step, score, total } = req.body;

  try {
    const testId = stepToTestId[step];
    if (!testId) {
      return res.status(400).json({ error: 'Etapă invalidă' });
    }

    // Verificare dacă deja a fost salvat
    const { data: existing } = await supabase
      .from('statistics')
      .select('*')
      .eq('user_id', userId)
      .eq('test_id', testId);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Etapa deja completată' });
    }

    const { error } = await supabase
      .from('statistics')
      .insert([
        {
          user_id: userId,
          test_id: testId,
          score,
          total
        }
      ]);

    if (error) throw error;

    // Returnăm din nou lista actualizată de etape
    const { data, error: fetchError } = await supabase
      .from('statistics')
      .select('test_id')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    const stepsUnlocked = data.map(row => {
      for (const [step, id] of Object.entries(stepToTestId)) {
        if (row.test_id === id) return `step${step}`;
      }
      return null;
    }).filter(Boolean);

    res.status(200).json({ success: true, stepsUnlocked });
  } catch (err) {
    console.error('Eroare la înregistrarea progresului:', err);
    res.status(500).json({ error: 'Eroare internă la înregistrarea progresului.' });
  }
});


export default router;