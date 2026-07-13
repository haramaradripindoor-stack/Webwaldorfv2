import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role key to bypass RLS!
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: noticias, error: selectError } = await supabase.from('noticias').select('*');
    if (selectError) {
        console.error("Error reading:", selectError);
        return;
    }
    
    for (const post of noticias) {
        if (post.image_url && post.image_url.startsWith('/images/')) {
            const newUrl = post.image_url.replace('/images/', 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/');
            console.log(`Fixing ${post.title}: ${newUrl}`);
            const { error: updateError } = await supabase.from('noticias').update({ image_url: newUrl }).eq('id', post.id);
            if (updateError) {
                console.error("Update error:", updateError);
            }
        }
    }
    console.log("Done fixing ALL /images/ paths.");
}

run();
