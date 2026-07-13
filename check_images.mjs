import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve('Error'));
  });
}

async function run() {
  const { data: noticias, error } = await supabase.from('noticias').select('id, title, image_url');
  if (error) {
    console.error("Error fetching noticias:", error);
    return;
  }

  for (const post of noticias) {
    let img = post.image_url || '/images/equipoescolar.jpg';
    
    if (img.startsWith('/images/')) {
        img = img.replace('/images/', 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/');
    }
    
    // Also encode spaces
    img = img.replace(/ /g, '%20');
    
    const status = await checkUrl(img);
    if (status !== 200) {
        console.log(`[${status}] ${post.title} -> ${img}`);
    }
  }
}

run();
