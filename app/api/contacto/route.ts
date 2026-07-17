import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    
    let { user_name, user_email, message } = data;
    user_name = escapeHTML(user_name);
    user_email = escapeHTML(user_email);
    message = escapeHTML(message);

    const htmlContent = `
      <h2>¡Nuevo Mensaje de Contacto (Sitio Web)! ✉️</h2>
      <p>Has recibido un nuevo mensaje a través del formulario "Hablemos" del sitio web.</p>
      <h3>Datos del Remitente:</h3>
      <ul>
        <li><strong>Nombre:</strong> ${user_name}</li>
        <li><strong>Email:</strong> ${user_email}</li>
      </ul>
      <h3>Mensaje:</h3>
      <p style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #2b4c3b; border-radius: 4px;">
        ${message.replace(/\n/g, '<br/>')}
      </p>
    `;

    // Enviar Alerta por Email usando Resend
    await resend.emails.send({
      from: 'Colegio Waldorf Trekan <onboarding@resend.dev>', // Fallback seguro
      to: 'admision@colegiowaldorftrekan.cl',
      reply_to: user_email, // Permite responder directamente al usuario
      subject: `NUEVO MENSAJE WEB: ${user_name}`,
      html: htmlContent
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error procesando mensaje de contacto:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
