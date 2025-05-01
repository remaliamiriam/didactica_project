import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Setăm __dirname pentru ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ghid teoretic
router.get('/guide', async (req, res) => {
  try {
    const guideData = await readFile(path.join(__dirname, '../data/step1_objectives_guide.json'), 'utf8');
    res.json(JSON.parse(guideData));
  } catch (err) {
    res.status(500).json({ error: 'Eroare la citirea ghidului.' });
  }
});

// Quiz
router.get('/quiz', async (req, res) => {
  try {
    const quizData = await readFile(path.join(__dirname, '../data/quizzes/step1_quiz.json'), 'utf8');
    res.json(JSON.parse(quizData));
  } catch (err) {
    res.status(500).json({ error: 'Eroare la citirea quiz-ului.' });
  }
});

export default router;
