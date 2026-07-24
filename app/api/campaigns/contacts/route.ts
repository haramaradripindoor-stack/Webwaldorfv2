import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1. Fetch leads_admision (formulario web y widget Hablemos)
    const { data: admisionLeads, error: err1 } = await supabase
      .from('leads_admision')
      .select('email_apoderado, nombre_apoderado, origen, created_at')
      .not('email_apoderado', 'is', null)
      .neq('email_apoderado', '');

    // 2. Fetch chat_leads (Chatbot Meta / OpenClaw)
    const { data: chatLeads, error: err2 } = await supabase
      .from('chat_leads')
      .select('apoderado_email, apoderado_name, created_at')
      .not('apoderado_email', 'is', null)
      .neq('apoderado_email', '');

    if (err1) {
      console.error("Error leyendo leads_admision:", err1);
    }

    // 3. Unificar todos los contactos, eliminando correos duplicados
    const unifiedContacts: any[] = [];
    const seenEmails = new Set();

    if (admisionLeads) {
      admisionLeads.forEach(lead => {
        const email = lead.email_apoderado?.trim().toLowerCase();
        if (email && !seenEmails.has(email)) {
          seenEmails.add(email);
          unifiedContacts.push({
            email: email,
            nombre: lead.nombre_apoderado || 'Desconocido',
            fuente: lead.origen || 'registro web',
            fecha: lead.created_at
          });
        }
      });
    }

    if (chatLeads) {
      chatLeads.forEach(lead => {
        const email = lead.apoderado_email?.trim().toLowerCase();
        if (email && !seenEmails.has(email)) {
          seenEmails.add(email);
          unifiedContacts.push({
            email: email,
            nombre: lead.apoderado_name || 'Desconocido',
            fuente: 'chatbot',
            fecha: lead.created_at
          });
        }
      });
    }

    // Ordenar de más reciente a más antiguo
    unifiedContacts.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    return NextResponse.json({ success: true, data: unifiedContacts });

  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, nombre } = await req.json();
    if (!email) return NextResponse.json({ success: false, error: 'Email requerido' }, { status: 400 });

    const { error } = await supabase.from('leads_admision').insert([{
      email_apoderado: email.trim().toLowerCase(),
      nombre_apoderado: nombre || 'Desconocido',
      origen: 'Directorio Manual',
      estado: 'nuevo'
    }]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { oldEmail, newEmail, newNombre } = await req.json();
    if (!oldEmail) return NextResponse.json({ success: false, error: 'Email original requerido' }, { status: 400 });

    const cleanOld = oldEmail.trim().toLowerCase();
    const cleanNew = newEmail ? newEmail.trim().toLowerCase() : cleanOld;

    // Intentar actualizar en ambas tablas (Supabase ignorará si no existe en una)
    const [resAdmision, resChat] = await Promise.all([
      supabase.from('leads_admision').update({
        email_apoderado: cleanNew,
        nombre_apoderado: newNombre || undefined
      }).eq('email_apoderado', cleanOld),
      supabase.from('chat_leads').update({
        apoderado_email: cleanNew,
        apoderado_name: newNombre || undefined
      }).eq('apoderado_email', cleanOld)
    ]);

    if (resAdmision.error) console.error(resAdmision.error);
    if (resChat.error) console.error(resChat.error);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { emails } = await req.json();
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ success: false, error: 'Emails requeridos' }, { status: 400 });
    }

    const cleanEmails = emails.map(e => e.trim().toLowerCase());

    // Eliminar de ambas tablas
    const [resAdmision, resChat] = await Promise.all([
      supabase.from('leads_admision').delete().in('email_apoderado', cleanEmails),
      supabase.from('chat_leads').delete().in('apoderado_email', cleanEmails)
    ]);

    if (resAdmision.error) throw resAdmision.error;
    if (resChat.error) throw resChat.error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
