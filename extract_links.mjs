import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: noticias, error } = await supabase.from('noticias').select('id, title, content');
  if (error) {
    console.error("Error fetching noticias:", error);
    return;
  }

  for (const post of noticias) {
    // Find all markdown links [text](url)
    const links = post.content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
    if (links) {
        console.log(`\n--- Links in: ${post.title} ---`);
        links.forEach(l => console.log(l));
    }
  }
}

run();
