import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

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

    // 3. Obtener lista negra de desuscritos (marcados con UNSUBSCRIBED)
    const { data: unsubscribedLeads, error: err3 } = await supabase
      .from('chat_leads')
      .select('apoderado_email')
      .eq('apoderado_name', 'UNSUBSCRIBED');
      
    const blacklistedEmails = new Set();
    if (unsubscribedLeads && !err3) {
      unsubscribedLeads.forEach(u => {
        if (u.apoderado_email) blacklistedEmails.add(u.apoderado_email.trim().toLowerCase());
      });
    }

    // 4. Obtener etiquetas de contact_tags
    const { data: tagsData, error: err4 } = await supabase
      .from('contact_tags')
      .select('email, tags');

    const tagsMap = new Map<string, string[]>();
    if (tagsData && !err4) {
      tagsData.forEach(t => {
        tagsMap.set(t.email.trim().toLowerCase(), t.tags || []);
      });
    }

    // 5. Unificar todos los contactos, eliminando duplicados y filtrando bajas
    const unifiedContacts: any[] = [];
    const seenEmails = new Set();

    if (admisionLeads) {
      admisionLeads.forEach(lead => {
        const email = lead.email_apoderado?.trim().toLowerCase();
        if (email && !seenEmails.has(email) && !blacklistedEmails.has(email)) {
          seenEmails.add(email);
          unifiedContacts.push({
            email: email,
            nombre: lead.nombre_apoderado || 'Desconocido',
            fuente: lead.origen || 'registro web',
            fecha: lead.created_at,
            tags: tagsMap.get(email) || []
          });
        }
      });
    }

    if (chatLeads) {
      chatLeads.forEach(lead => {
        const email = lead.apoderado_email?.trim().toLowerCase();
        // Evitamos meter los registros fantasmas de UNSUBSCRIBED en la lista
        if (email && !seenEmails.has(email) && !blacklistedEmails.has(email) && lead.apoderado_name !== 'UNSUBSCRIBED') {
          seenEmails.add(email);
          unifiedContacts.push({
            email: email,
            nombre: lead.apoderado_name || 'Desconocido',
            fuente: 'chatbot',
            fecha: lead.created_at,
            tags: tagsMap.get(email) || []
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
    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

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
    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

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

    // Actualizar también en contact_tags si el email cambió
    if (cleanOld !== cleanNew) {
      await supabase.from('contact_tags').update({ email: cleanNew }).eq('email', cleanOld);
    }

    if (resAdmision.error) console.error(resAdmision.error);
    if (resChat.error) console.error(resChat.error);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { emails } = await req.json();
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ success: false, error: 'Emails requeridos' }, { status: 400 });
    }

    const cleanEmails = emails.map(e => e.trim().toLowerCase());

    // Eliminar de ambas tablas y de tags
    const [resAdmision, resChat] = await Promise.all([
      supabase.from('leads_admision').delete().in('email_apoderado', cleanEmails),
      supabase.from('chat_leads').delete().in('apoderado_email', cleanEmails),
      supabase.from('contact_tags').delete().in('email', cleanEmails)
    ]);

    if (resAdmision.error) throw resAdmision.error;
    if (resChat.error) throw resChat.error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
