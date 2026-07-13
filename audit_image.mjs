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
      resolve({ statusCode: res.statusCode, contentType: res.headers['content-type'] });
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function run() {
    console.log("=== INICIANDO AUDITORÍA PRÁCTICA ===");
    
    // 1. Obtener la fila exacta de la base de datos
    const { data: noticia, error } = await supabase
        .from('noticias')
        .select('title, image_url')
        .like('title', '%Pedagogía Waldorf vs Tradicional%')
        .single();
        
    if (error) {
        console.error("Error leyendo DB:", error);
        return;
    }
    
    console.log(`Noticia encontrada: "${noticia.title}"`);
    console.log(`URL en Base de Datos: ${noticia.image_url}`);
    
    // 2. Verificar que la URL ya no es local (no empieza con /images/)
    if (noticia.image_url.startsWith('/images/')) {
        console.log("❌ ERROR: La URL sigue siendo local.");
    } else {
        console.log("✅ ÉXITO: La URL apunta al CDN de Supabase.");
        
        // 3. Hacer una petición HTTP real a la imagen para verificar que existe (no 404)
        console.log(`Haciendo ping HTTP a: ${noticia.image_url} ...`);
        const result = await checkUrl(noticia.image_url);
        
        if (result.statusCode === 200) {
            console.log(`✅ ÉXITO: La imagen responde con código 200 OK.`);
            console.log(`✅ TIPO DE ARCHIVO: ${result.contentType}`);
        } else {
            console.log(`❌ ERROR: La imagen respondió con código ${result.statusCode}`);
        }
    }
    console.log("=== FIN DE LA AUDITORÍA ===");
}

run();
