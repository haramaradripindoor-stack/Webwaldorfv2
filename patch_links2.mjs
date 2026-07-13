import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: noticias, error } = await supabase.from('noticias').select('id, content');
  if (error) {
    console.error("Error fetching noticias:", error);
    return;
  }

  for (const post of noticias) {
    let newContent = post.content;
    
    // Replace absolute URL for /postula
    newContent = newContent.replace(/\]\(https:\/\/www\.colegiowaldorftrekan\.cl\/postula\)/g, "](/admision)");
    // Replace #admision
    newContent = newContent.replace(/\]\(#admision\)/g, "](/admision)");
    
    if (newContent !== post.content) {
      console.log(`Updating post ${post.id}`);
      const { error: updateError } = await supabase.from('noticias').update({ content: newContent }).eq('id', post.id);
      if (updateError) {
        console.error(`Error updating post ${post.id}:`, updateError);
      }
    }
  }
  console.log("Done updating links in noticias.");
}

run();
