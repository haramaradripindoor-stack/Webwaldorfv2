import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const markdownContent = `Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se unieran para educar?

<br/>

<div align="center" style="margin-top: 40px; margin-bottom: 40px;">
  <iframe style="width:100%; aspect-ratio: 16/9; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" src="https://www.youtube.com/embed/Sy4PO2UIy2w" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<br/>
<br/>

![Inauguración Colegio Waldorf Trekan 2025](https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria-Inauguracion.webp)
<br/>
![Inauguración Colegio Waldorf Trekan 2025](https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria-Inauguracion2.webp)
<br/>
![Inauguración Colegio Waldorf Trekan 2025](https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria-Inauguracion3.webp)
`;

    const { error } = await supabase.from('noticias').update({ content: markdownContent }).eq('slug', '2025-03-05-inauguracion');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Inauguracion post content updated successfully!");
    }
}

run();
