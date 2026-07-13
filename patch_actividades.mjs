import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role key to bypass RLS!
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: actividades, error: selectError } = await supabase.from('actividades').select('*');
    if (selectError) {
        console.error("Error reading actividades:", selectError);
        return;
    }
    
    let updatedCount = 0;
    
    for (const post of actividades) {
        if (post.image_url && post.image_url.startsWith('/images/')) {
            let newUrl = post.image_url.replace('/images/', 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/');
            
            // Convert literal spaces to %20
            if (newUrl.includes(' ')) {
                newUrl = newUrl.replace(/ /g, '%20');
            }
            
            console.log(`Fixing ${post.title}: ${newUrl}`);
            const { error: updateError } = await supabase.from('actividades').update({ image_url: newUrl }).eq('id', post.id);
            if (updateError) {
                console.error("Update error:", updateError);
            } else {
                updatedCount++;
            }
        }
    }
    console.log(`Done fixing ALL /images/ paths in actividades. Fixed: ${updatedCount}`);
}

run();
