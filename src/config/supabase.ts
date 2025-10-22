import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not found. Using in-memory data.');
  console.warn('SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.warn('SUPABASE_ANON_KEY:', supabaseKey ? 'SET' : 'MISSING');
} else {
  console.log('✅ Supabase connected:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
