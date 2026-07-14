import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #3b533d; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Nueva Cotización Recibida</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.8;">Salón Trekan</p>
        </div>
        
        <div style="padding: 20px;">
          <h3 style="color: #3b533d; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">📌 Información del Cliente</h3>
          <p><strong>Nombre:</strong> ${data.nombre}</p>
          <p><strong>Teléfono:</strong> ${data.telefono}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Firma:</strong> ${data.firma} (${data.fecha_firma})</p>

          <h3 style="color: #3b533d; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 30px;">📅 Detalle del Evento</h3>
          <p><strong>Días y Horarios:</strong><br/>${data.dias_detalle.replace(/ \| /g, '<br/>')}</p>
          <p><strong>Duración:</strong> ${data.detalle_horas}</p>
          <p><strong>Consultas:</strong> ${data.consultas}</p>

          <h3 style="color: #3b533d; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 30px;">🛠️ Servicios Solicitados</h3>
          <p><strong>Kit Audiovisual:</strong> ${data.kit_completo}</p>
          <p><strong>Calefacción:</strong> ${data.calefaccion}</p>
          <p><strong>Otros:</strong> ${data.otro_servicio}</p>

          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 30px; border: 1px solid #e2e8f0;">
            <h3 style="color: #3b533d; margin-top: 0;">💰 Resumen de Pagos</h3>
            <p><strong>${data.costo_salones}</strong></p>
            <p><strong>${data.costo_equipos}</strong></p>
            <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
            <p style="font-size: 18px; margin: 0;"><strong>Total a Pagar: ${data.total_costo}</strong></p>
            <p style="color: #b04a32; font-weight: bold; margin-top: 10px;">${data.pago_reserva}</p>
            <p style="color: #64748b; margin-top: 5px;">${data.pago_saldo}</p>
          </div>
        </div>
      </div>
    `;

    const { data: responseData, error } = await resend.emails.send({
      from: 'Colegio Waldorf Trekan <noreply@colegiowaldorftrekan.cl>',
      to: ['admision@colegiowaldorftrekan.cl', 'fvivancorne@gmail.com'], // Copia al user
      subject: `Nueva Cotización Salón: ${data.nombre}`,
      html: htmlContent,
      reply_to: data.email,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
