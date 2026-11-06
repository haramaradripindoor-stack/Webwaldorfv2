import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

// Helper canónico de normalización de cursos Trekan para Admisión 2027
function cleanCurso(curso?: string | null, edad?: string | null): string {
  if (!curso && !edad) return 'Consultas Generales';
  const c = (curso || '').toLowerCase();
  const e = (edad || '').trim();

  if (c.includes('kinde')) return 'Kinder (2027)';
  if (c.includes('playgroup')) return 'Playgroup (2027)';
  if (c.includes('jardin') || c.includes('jardín')) return 'Jardín Infantil (2027)';
  if (c.includes('medio') || c.includes('14 años') || c.includes('13 años')) return 'Ed. Media / Fuera de Rango';
  if (c.includes('1ro') || c.includes('1ero') || c.includes('primero') || c.includes('1 b') || c.includes('1 básico') || c.includes('1°')) return '1ro Básico (2027)';
  if (c.includes('2do') || c.includes('segundo') || c.includes('2 b') || c.includes('2 básico') || c.includes('2°') || c.match(/2[^a-z]*b/)) return '2do Básico (2027)';
  if (c.includes('3ro') || c.includes('tercero') || c.includes('3 b') || c.includes('3 básico') || c.includes('3°') || c.match(/3[^a-z]*b/)) return '3ro Básico (2027)';
  if (c.includes('4to') || c.includes('cuarto') || c.includes('4 b') || c.includes('4 básico') || c.includes('4°')) return '4to Básico (2027)';
  if (c.includes('5to') || c.includes('quinto') || c.includes('5 b') || c.includes('5 básico') || c.includes('5°')) return '5to Básico (2027)';
  if (c.includes('6to') || c.includes('sexto') || c.includes('6 b') || c.includes('6 básico') || c.includes('6°')) return '6to Básico (2027)';
  if (c.includes('7mo') || c.includes('septimo') || c.includes('séptimo') || c.includes('7 b') || c.includes('7°')) return '7mo Básico (2027)';
  if (c.includes('8vo') || c.includes('octavo') || c.includes('8 b') || c.includes('8°')) return '8vo Básico (2027)';

  // Respaldo por edad del niño para proyectar a 2027
  if (e === '6' || e === '6 años' || e === '7' || e === '7 años') return '2do Básico (2027)';
  if (e === '8' || e === '8 años') return '3ro Básico (2027)';
  if (e === '5' || e === '5 años') return '1ro Básico (2027)';
  if (e === '4' || e === '4 años') return 'Kinder (2027)';

  if (curso) {
    const rawFirst = curso.split(' | ')[0].trim();
    if (rawFirst && rawFirst.length <= 35) return rawFirst;
  }
  return 'Consultas Generales';
}

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
      .select('email_apoderado, nombre_apoderado, origen, created_at, curso_postula, edad_nino, nombre_nino, estado')
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
        const estado = lead.estado || 'nuevo';

        // Filtro de seguridad: excluir automáticamente a los ya matriculados o descartados fuera de perfil
        if (estado === 'matriculado' || estado === 'no_corresponde') {
          return;
        }

        if (email && !seenEmails.has(email) && !blacklistedEmails.has(email)) {
          seenEmails.add(email);
          const cursoNorm = cleanCurso(lead.curso_postula, lead.edad_nino);
          unifiedContacts.push({
            email: email,
            nombre: lead.nombre_apoderado || 'Desconocido',
            nombreNino: lead.nombre_nino || '',
            edadNino: lead.edad_nino || '',
            curso: cursoNorm,
            estado: estado,
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
            nombreNino: '',
            edadNino: '',
            curso: 'Consultas Generales',
            estado: 'nuevo',
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
