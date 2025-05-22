// routes/progress.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticateToken } from '../authMiddleware.js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Inversul mapării test_id → stepX
const uuidToStep = {
  "1705dc84-019d-4016-aeeb-9b881f4731e0": "step1",
  "77c370d4-f4f4-45fa-8bb8-6ae45c3d85cf": "step2",
  "9c76345b-6bf3-4ec7-ac9f-0d186c8a82a2": "step3",
  "d0e6172f-a834-4ec3-ac25-8457305124e9": "step4",
  "70eb6b63-1651-46b7-a278-2f8b8729e29f": "step5",
  "532a2b4a-a072-47bd-93ed-aa78a51125e9": "step6",
  "6601bb0e-8939-4476-b2f5-8c97d3e1926c": "step7",
};

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('statistics')
      .select('test_id')
      .eq('user_id', userId);

    if (error) throw error;

    const stepsUnlocked = [...new Set(data.map(row => uuidToStep[row.test_id]).filter(Boolean))];

    res.status(200).json({ stepsUnlocked });
  } catch (err) {
    console.error('Eroare la obținerea progresului:', err);
    res.status(500).json({ error: 'Eroare internă la obținerea progresului.' });
  }
});

export default router;
