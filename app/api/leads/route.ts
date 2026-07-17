import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usamos el service role en el backend
);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const escapeHTML = (str: string) => str ? String(str).replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
    ) : '';
    
    let { nombre_apoderado, telefono_apoderado, email_apoderado, nombre_nino, edad_nino, curso_postula } = data;
    nombre_apoderado = escapeHTML(nombre_apoderado);
    telefono_apoderado = escapeHTML(telefono_apoderado);
    email_apoderado = escapeHTML(email_apoderado);
    nombre_nino = escapeHTML(nombre_nino);
    edad_nino = escapeHTML(edad_nino);
    curso_postula = escapeHTML(curso_postula);

    // 1. Guardar en Supabase CRM
    const { error: dbError } = await supabase.from('leads_admision').insert([{
      nombre_apoderado,
      telefono_apoderado,
      email_apoderado,
      nombre_nino,
      edad_nino,
      curso_postula,
      estado: 'nuevo',
      origen: 'Formulario Web'
    }]);

    if (dbError) throw dbError;

    // 2. Enviar Alerta por Email a Ivonne usando Resend
    const htmlContent = `
      <h2>¡Nuevo Contacto de Admisión! 🎯</h2>
      <p>Un nuevo apoderado ha llenado el formulario web y ha sido registrado en el CRM.</p>
      <h3>Datos del Apoderado:</h3>
      <ul>
        <li><strong>Nombre:</strong> ${nombre_apoderado}</li>
        <li><strong>WhatsApp:</strong> ${telefono_apoderado}</li>
        <li><strong>Email:</strong> ${email_apoderado}</li>
      </ul>
      <h3>Datos del Postulante:</h3>
      <ul>
        <li><strong>Niño/a:</strong> ${nombre_nino}</li>
        <li><strong>Edad:</strong> ${edad_nino}</li>
        <li><strong>Curso:</strong> ${curso_postula}</li>
      </ul>
      <br/>
      <p><a href="https://www.colegiowaldorftrekan.cl/admin/admisiones" style="padding: 10px 20px; background-color: #2b4c3b; color: white; text-decoration: none; border-radius: 5px;">Ir al Panel CRM</a></p>
    `;

    try {
      await resend.emails.send({
        from: 'Colegio Waldorf Trekan <onboarding@resend.dev>', // Usamos el fallback seguro de Resend
        to: 'admision@colegiowaldorftrekan.cl',
        subject: `NUEVO LEAD: ${nombre_apoderado} (Admisión 2026)`,
        html: htmlContent
      });
    } catch (emailError) {
      console.error('Error enviando email con Resend:', emailError);
      // No rompemos el flujo si el correo falla, el lead ya está en la DB
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error procesando lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
