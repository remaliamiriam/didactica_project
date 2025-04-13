import express from 'express';
import { supabase } from './supabase.js';  // Corrected syntax
import cors from 'cors';

const app = express();

// Set up CORS to allow credentials
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your React app
  methods: ['GET', 'POST', 'OPTIONS'], // Allow GET, POST, and OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow credentials to be sent
}));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Your routes for checking and saving the nickname
app.post('/check-nickname', async (req, res) => {
  const { nickname } = req.body;
  console.log('Checking nickname:', nickname);

  const { data, error } = await supabase
    .from('users')
    .select('nickname')
    .eq('nickname', nickname);

  if (error) {
    console.error('Error checking nickname:', error.message);
    return res.status(400).json({ error: error.message });
  }

  if (data.length > 0) {
    return res.status(200).json({ exists: true });
  } else {
    return res.status(200).json({ exists: false });
  }
});

// Start server
app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
