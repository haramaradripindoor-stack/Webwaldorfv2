import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usamos el cliente del lado del servidor con la clave Service Role 
// para evitar problemas de Row Level Security (RLS) en el webhook
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.AIO_WEBHOOK_SECRET;

    if (!expectedToken) {
      return NextResponse.json({ error: 'Falta AIO_WEBHOOK_SECRET en Vercel' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await req.json();

    const { title, excerpt, content, keywords } = data;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Generar un slug a partir del título
    const slug = title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar tildes
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const { error: insertError } = await supabase.from('noticias').insert([
      {
        slug,
        title,
        excerpt: excerpt || '',
        content,
        meta_keywords: keywords || 'waldorf, educación, sur de chile',
        image_url: '/imagenes-web/galeria3.webp', // Por defecto o usar Unsplash/Pexels más adelante
        published_at: new Date().toISOString()
      }
    ]);

    if (insertError) {
      console.error('Error insertando en BD:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Artículo "${title}" publicado vía AIO.` });

  } catch (error: any) {
    console.error('Error procesando webhook AIO:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
