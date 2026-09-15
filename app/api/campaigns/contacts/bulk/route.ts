import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { contacts } = await req.json();
    if (!contacts || !Array.isArray(contacts)) {
      return NextResponse.json({ success: false, error: 'Lista de contactos inválida' }, { status: 400 });
    }

    let inserted = 0;
    
    // Batch insert
    const insertData = contacts
      .filter((c: any) => c.email && typeof c.email === 'string')
      .map((c: any) => ({
        email_apoderado: c.email.trim().toLowerCase(),
        nombre_apoderado: c.nombre || 'Desconocido',
        origen: 'Importación Excel',
        estado: 'nuevo'
      }));

    if (insertData.length > 0) {
      const { error } = await supabase.from('leads_admision').insert(insertData);
      if (error) {
        console.error("Error bulk insert:", error);
        throw error;
      }
      inserted = insertData.length;
    }

    return NextResponse.json({ success: true, inserted });
  } catch (error: any) {
    console.error('Error en bulk import:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
