import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.from('noticias').select('*').limit(5);
  if (error) {
    console.error("Error fetching 'noticias':", error);
  } else {
    console.log("Noticias table data:", JSON.stringify(data, null, 2));
  }
}

check();
