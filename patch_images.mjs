import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: noticias, error } = await supabase.from('noticias').select('id, image_url, title');
  
  for (const post of noticias) {
    if (post.image_url) {
      let newUrl = post.image_url;
      if (newUrl.startsWith('/images/')) {
        newUrl = newUrl.replace('/images/', 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/');
      } else if (newUrl.startsWith('images/')) {
        newUrl = newUrl.replace('images/', 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/');
      }
      
      // Convert any literal spaces to %20
      if (newUrl.includes(' ')) {
        newUrl = newUrl.replace(/ /g, '%20');
      }
      
      if (newUrl !== post.image_url) {
        console.log(`Fixing ${post.title} image_url: ${post.image_url} -> ${newUrl}`);
        await supabase.from('noticias').update({ image_url: newUrl }).eq('id', post.id);
      }
    }
  }
  console.log("Done fixing image_url spaces and paths in noticias.");
}

run();
