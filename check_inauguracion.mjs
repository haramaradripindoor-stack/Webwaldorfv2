import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: noticia, error } = await supabase.from('noticias').select('*').eq('slug', '2025-03-05-inauguracion').single();
    if (error) {
        console.error("Error:", error);
    } else {
        console.log(noticia);
    }
}

run();
