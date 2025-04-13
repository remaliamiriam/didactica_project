import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Încarcă fișierul .env
dotenv.config();

console.log('Supabase URL din ENV:', process.env.SUPABASE_URL);
console.log('Supabase Key din ENV:', process.env.SUPABASE_KEY);
// Inițializează clientul Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,  // URL din .env
  process.env.SUPABASE_KEY   // Key din .env
);

// Exportă instanța Supabase
export { supabase };
