import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Utilizamos la tabla chat_leads como una "lista negra" sin tener que alterar el esquema
    // Insertamos un registro especial que marca al usuario como desuscrito
    const { error } = await supabase.from('chat_leads').insert([{
      apoderado_email: cleanEmail,
      apoderado_name: 'UNSUBSCRIBED', // Palabra clave reservada para filtrar
      origen: 'Baja Voluntaria'
    }]);

    if (error) {
      console.error('Error guardando baja:', error);
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Te has dado de baja exitosamente.' });
  } catch (error: any) {
    console.error('Error en /api/unsubscribe:', error);
    return NextResponse.json({ success: false, error: 'No pudimos procesar tu solicitud. Intenta nuevamente.' }, { status: 500 });
  }
}
