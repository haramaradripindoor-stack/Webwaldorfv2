import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rootDirectory = path.join(process.cwd(), '..');

async function migrateFolder(folderName, tableName) {
  const directory = path.join(rootDirectory, folderName);
  
  if (!fs.existsSync(directory)) {
    console.log(`La carpeta ${folderName} no existe.`);
    return;
  }

  const fileNames = fs.readdirSync(directory);
  
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;

    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-/);
    const fallbackDate = match ? match[1] : new Date().toISOString();

    let validDate = fallbackDate;
    if (data.date || data.published_at) {
      const parsed = new Date(data.date || data.published_at);
      if (!isNaN(parsed.getTime())) {
        validDate = parsed.toISOString();
      }
    }

    const title = data.title || data.nombre || data.titulo || 'Sin título';
    const excerpt = data.excerpt || data.descripcion || content.substring(0, 150) + '...';
    const image_url = data.image_url || data.imagen || data.foto || '/images/galeria3.webp';

    console.log(`Migrando [${tableName}]: ${slug}`);

    const payload = {
      slug: slug,
      title: title,
      excerpt: excerpt,
      content: content,
      image_url: image_url,
      published_at: validDate
    };

    if (tableName === 'actividades') {
      payload.mes = data.mes || null;
      payload.dia = data.dia ? String(data.dia) : null;
      payload.tipo = data.tipo || null;
      payload.lugar = data.lugar || null;
      payload.hora = data.hora || null;
    }

    const { error } = await supabase
      .from(tableName)
      .upsert(payload, { onConflict: 'slug' });

    if (error) {
      console.error(`Error migrando ${slug}:`, error.message);
    }
  }
}

async function run() {
  console.log('Iniciando migración de Markdown a Supabase...');
  await migrateFolder('_noticias', 'noticias');
  await migrateFolder('_actividades', 'actividades');
  console.log('¡Migración completada!');
}

run();
