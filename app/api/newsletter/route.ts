import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { title, excerpt, slug, image_url } = await req.json();

    if (!title || !slug) {
      return NextResponse.json({ error: 'Faltan datos de la noticia' }, { status: 400 });
    }

    // 1. Fetch all leads with emails
    const { data: leads, error: dbError } = await supabase
      .from('chat_leads')
      .select('apoderado_email')
      .not('apoderado_email', 'is', null)
      .neq('apoderado_email', '');

    if (dbError) {
      console.error('Error fetch leads:', dbError);
      return NextResponse.json({ error: 'Error consultando destinatarios' }, { status: 500 });
    }

    // Deduplicate emails using Array.from to avoid TS downlevelIteration error
    const emails = Array.from(new Set(leads.map(l => l.apoderado_email.trim().toLowerCase()).filter(Boolean)));

    if (emails.length === 0) {
      return NextResponse.json({ error: 'No hay correos registrados en el CRM' }, { status: 400 });
    }

    const BATCH_SIZE = 50; // Resend allows up to 50 recipients per batch request if using the batch API, or Bcc up to 50
    const articleUrl = `https://www.colegiowaldorftrekan.cl/noticias/${slug}`;
    const coverImage = image_url || 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria3.webp';

    const htmlContent = `
      <div style="font-family: 'Georgia', serif; background-color: #FAF9F6; color: #2C3E35; max-width: 600px; margin: 0 auto; padding: 40px 20px; border-radius: 12px;">
        <p style="font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #D35D3E; margin-bottom: 20px; text-align: center;">Novedades Colegio Waldorf Trekan</p>
        
        <h1 style="font-size: 32px; font-weight: bold; line-height: 1.2; text-align: center; margin-bottom: 30px;">
          ${title}
        </h1>
        
        <img src="${coverImage}" alt="Portada Noticia" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 30px;" />
        
        <div style="border-left: 3px solid #D35D3E; padding-left: 20px; margin-bottom: 30px;">
          <p style="font-size: 18px; color: #555; line-height: 1.6; font-style: italic;">
            ${excerpt}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
          <a href="${articleUrl}" style="display: inline-block; padding: 16px 32px; background-color: #D35D3E; color: #ffffff; text-decoration: none; font-family: 'Arial', sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 50px;">
            Leer artículo completo
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #EAE6DF; margin: 40px 0 20px;" />
        <p style="font-family: 'Arial', sans-serif; font-size: 12px; color: #888; text-align: center;">
          Recibes este correo porque te has contactado o postulado al Colegio Waldorf Trekan.<br/>
          <a href="https://www.colegiowaldorftrekan.cl" style="color: #D35D3E;">www.colegiowaldorftrekan.cl</a>
        </p>
      </div>
    `;

    // Attempt to use the production domain. If Resend fails, the user will see it in the logs.
    const sender = 'Colegio Waldorf Trekan <admision@colegiowaldorftrekan.cl>';
    let successCount = 0;

    // Send emails in batches using Bcc to protect privacy
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      
      try {
        await resend.emails.send({
          from: sender,
          to: 'admision@colegiowaldorftrekan.cl', // Primary recipient (self)
          bcc: batch,
          subject: title,
          html: htmlContent,
        });
        successCount += batch.length;
      } catch (e: any) {
        // Fallback to onboarding@resend.dev if domain not verified
        if (e.message?.includes('verified') || e.name === 'validation_error') {
          console.warn('Domain not verified. Falling back to onboarding@resend.dev');
          await resend.emails.send({
            from: 'Colegio Waldorf Trekan <onboarding@resend.dev>',
            to: 'admision@colegiowaldorftrekan.cl',
            bcc: batch,
            subject: title,
            html: htmlContent,
          });
          successCount += batch.length;
        } else {
          console.error('Batch failed:', e);
        }
      }
    }

    return NextResponse.json({ success: true, count: successCount });

  } catch (error) {
    console.error('Error en newsletter route:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
