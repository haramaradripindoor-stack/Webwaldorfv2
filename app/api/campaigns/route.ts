import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Ej: trekancomisiondeaministracion@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD, // Contraseña de Aplicación
  },
});

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
      
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

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Credenciales SMTP (GMAIL_USER/GMAIL_APP_PASSWORD) no configuradas en Vercel' }, { status: 500 });
    }

    // 1. Guardar la campaña en el historial
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

    // 2. Enviar correos en BATCH usando Nodemailer BCC
    const chunkSize = 50; // Agrupamos en bloques de 50 para evitar time-outs del servidor SMTP
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipients.length; i += chunkSize) {
      const chunk = recipients.slice(i, i + chunkSize);
      
      try {
        await transporter.sendMail({
          from: `"Colegio Waldorf Trekan" <coordinacion@colegiowaldorftrekan.cl>`,
          to: 'administracion@colegiowaldorftrekan.cl', // Se envía a sí mismo (como blind carbon copy a los demás)
          bcc: chunk,
          subject: subject,
          html: body_html
        });
        sentCount += chunk.length;
      } catch (err) {
        console.error('Error enviando lote SMTP:', err);
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

