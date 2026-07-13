import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: content, error: selectError } = await supabase.from('homepage_content').select('*');
    
    if (selectError) {
        console.error("Error reading homepage_content:", selectError);
        return;
    }
    
    console.log("Current content rows:", content.length);
    
    if (content.length === 0) {
        console.log("Table is empty. Inserting default data...");
        const defaultData = {
            id: '1',
            hero_title: 'Un viaje hacia el desarrollo integral y el amor por el aprendizaje.',
            hero_subtitle: 'Colegio Waldorf Trekan • Puerto Varas, Chile.',
            hero_video: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/hero-video.mp4',
            
            phrase_1: 'La verdadera educación es cultivar en el niño un sentido profundo de asombro por el mundo y una confianza inquebrantable en sí mismo, preparándolo no solo para una carrera, sino para una vida llena de significado y propósito.',
            phrase_1_author: 'Rudolf Steiner, fundador de la Pedagogía Waldorf',
            
            phrase_2: 'Cada niño es una semilla que contiene el bosque entero. Nuestra labor es ofrecerles la tierra, el agua y el sol necesarios para que desplieguen todo su potencial.',
            phrase_2_author: 'Equipo Docente Trekan',
            
            gallery_1: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria1.webp',
            gallery_2: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria2.webp',
            gallery_3: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria3.webp',
            gallery_4: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria4.webp',
            gallery_5: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria5.webp',
            gallery_6: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria6.webp',
        };
        
        const { error: insertError } = await supabase.from('homepage_content').insert([defaultData]);
        if (insertError) {
            console.error("Insert error:", insertError);
        } else {
            console.log("Inserted default data successfully!");
        }
    } else {
        console.log("Content already exists.");
        console.log(content[0]);
    }
}

run();
