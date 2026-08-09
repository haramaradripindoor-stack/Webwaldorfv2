import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { emails, tags } = await req.json();
    
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ success: false, error: 'Se requieren emails' }, { status: 400 });
    }
    
    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json({ success: false, error: 'Se requieren etiquetas (tags)' }, { status: 400 });
    }

    const cleanEmails = emails.map(e => e.trim().toLowerCase());
    const uniqueTags = Array.from(new Set(tags.map(t => t.trim())));

    // Primero obtenemos los tags actuales de esos emails
    const { data: currentData, error: fetchError } = await supabase
      .from('contact_tags')
      .select('email, tags')
      .in('email', cleanEmails);

    if (fetchError) {
      console.error("Error fetching current tags:", fetchError);
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    const currentMap = new Map();
    if (currentData) {
      currentData.forEach(row => {
        currentMap.set(row.email, row.tags || []);
      });
    }

    // Preparamos los upserts
    const upserts = cleanEmails.map(email => {
      const existingTags = currentMap.get(email) || [];
      // Hacemos un merge de los tags existentes con los nuevos, sin duplicados
      const mergedTags = Array.from(new Set([...existingTags, ...uniqueTags]));
      
      return {
        email,
        tags: mergedTags
      };
    });

    const { error: upsertError } = await supabase
      .from('contact_tags')
      .upsert(upserts, { onConflict: 'email' });

    if (upsertError) {
      console.error("Error upserting tags:", upsertError);
      return NextResponse.json({ success: false, error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: upserts.length });

  } catch (error: any) {
    console.error('Error in POST tags:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
