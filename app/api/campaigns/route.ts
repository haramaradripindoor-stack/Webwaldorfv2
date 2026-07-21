import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
      
    // En caso de que la tabla aún no exista, capturamos el error sin romper el panel
    if (error) {
       console.log("Aviso: No se pudo leer el historial de email_campaigns:", error.message);
       return NextResponse.json({ success: true, data: [] });
    }
    
    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { subject, body_html, recipients, template } = await req.json();
    
    if (!recipients || recipients.length === 0) {
      return NextResponse.json({ success: false, error: 'No se seleccionaron destinatarios' }, { status: 400 });
    }

    // 1. Guardar la campaña en el historial (si la tabla existe)
    let campaignId = null;
    const { data: newCamp, error: insertError } = await supabase
      .from('email_campaigns')
      .insert([{
        subject,
        sent_count: 0,
        failed_count: 0,
        status: 'sending'
      }])
      .select('id')
      .single();
      
    if (!insertError && newCamp) {
       campaignId = newCamp.id;
    }

    // 2. Enviar correos en BATCH (lotes de 50) usando Resend BCC para proteger privacidad
    const chunkSize = 50;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipients.length; i += chunkSize) {
      const chunk = recipients.slice(i, i + chunkSize);
      
      try {
        await resend.emails.send({
          from: 'Colegio Waldorf Trekan <onboarding@resend.dev>', // Usamos el fallback seguro de desarrollo
          to: 'admision@colegiowaldorftrekan.cl',
          bcc: chunk,
          subject: subject,
          html: body_html
        });
        sentCount += chunk.length;
      } catch (err) {
        console.error('Error enviando lote:', err);
        failedCount += chunk.length;
      }
    }

    // 3. Actualizar estado de la campaña
    if (campaignId) {
      await supabase.from('email_campaigns').update({
        sent_count: sentCount,
        failed_count: failedCount,
        status: 'sent',
        sent_at: new Date().toISOString()
      }).eq('id', campaignId);
    }

    return NextResponse.json({ 
      success: true, 
      sentCount, 
      failedCount 
    });

  } catch (err: any) {
    console.error('Error in POST /api/campaigns:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
