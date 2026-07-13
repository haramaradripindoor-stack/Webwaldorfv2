import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const defaultData = {
        hero_section: { 
            title: 'La Vida en Trekan', 
            subtitle: 'Educación con sentido', 
            media_url: '/assets/testimonial.mp4', 
            media_type: 'video' 
        },
        text_reveal: 'Educar no es llenar un cubo, es encender un fuego. En Trekan, respetamos el ritmo natural de cada niño, cultivando la cabeza, el corazón y las manos en perfecta armonía.',
        masonry_gallery: [
            { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20264.jpg', alt: 'Exploración en la naturaleza', span: 'col-span-2 row-span-2' },
            { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/actividapedagogicahumedales5.jpg', alt: 'Conexión vivencial', span: 'col-span-1 row-span-1' },
            { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/fiesta%20de%20la%20luz202610.jpg', alt: 'Ritmos y tradiciones', span: 'col-span-1 row-span-2' },
            { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20268.jpg', alt: 'Comunidad en movimiento', span: 'col-span-1 row-span-1' },
            { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/actividapedagogicahumedales6.jpg', alt: 'Aprendizaje en el entorno', span: 'col-span-2 row-span-1' },
            { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20269.jpg', alt: 'Libertad y asombro', span: 'col-span-1 row-span-1' },
            { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/fiesta%20de%20la%20luz20268.jpg', alt: 'Luz y calidez', span: 'col-span-1 row-span-1' }
        ]
    };
    
    const { error: updateError } = await supabase.from('homepage_content').update(defaultData).eq('id', 1);
    
    if (updateError) {
        console.error("Update error:", updateError);
    } else {
        console.log("Seeding successful! Added the correct JSON payload to homepage_content.");
    }
}

run();
