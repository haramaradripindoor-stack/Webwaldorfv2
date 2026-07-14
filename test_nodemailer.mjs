import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const data = {
    nombre: "TEST AUTOMATIZADO - AGENTE IA",
    telefono: "+56 9 9999 9999",
    email: "fvivancorne@gmail.com",
    firma: "Felipe V (Prueba)",
    fecha_firma: "2026-07-14",
    detalle_horas: "Total: 3.0 horas en 1 día(s)",
    costo_salones: "Salón: 30.000 CLP",
    costo_equipos: "Servicios adicionales: 20.000 CLP",
    total_costo: "$ 50.000",
    pago_reserva: "Reserva (30%): $ 15.000",
    pago_saldo: "Saldo (70%): $ 35.000",
    kit_completo: "Sí",
    calefaccion: "No solicitada",
    otro_servicio: "Ninguno",
    consultas: "ESTO ES UNA PRUEBA AUTOMÁTICA DEL SISTEMA SMTP (Nodemailer).",
    dias_detalle: "Día 1: 2026-07-15 de 15:00 a 18:00"
};

const htmlContent = `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #3b533d; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">Nueva Cotización Recibida</h2>
      <p style="margin: 5px 0 0 0; opacity: 0.8;">Salón Trekan (PRUEBA SMTP)</p>
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

      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 30px; border: 1px solid #e2e8f0;">
        <h3 style="color: #3b533d; margin-top: 0;">💰 Resumen de Pagos</h3>
        <p><strong>${data.costo_salones}</strong></p>
        <p><strong>${data.costo_equipos}</strong></p>
        <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
        <p style="font-size: 18px; margin: 0;"><strong>Total a Pagar: ${data.total_costo}</strong></p>
      </div>
    </div>
  </div>
`;

async function test() {
    console.log("Configurando SMTP de Gmail...");
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    try {
        console.log("Enviando correo al admin...");
        let info = await transporter.sendMail({
          from: '"Colegio Waldorf Trekan" <' + process.env.GMAIL_USER + '>',
          to: 'Coordinacion@colegiowaldorftrekan.cl, administracion@colegiowaldorftrekan.cl',
          subject: `Nueva Cotización Salón: ${data.nombre}`,
          html: htmlContent,
          replyTo: data.email,
        });
        console.log("Éxito Admin! Message ID: " + info.messageId);
        
        console.log("Enviando correo resumen al cliente...");
        const clientHtmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; margin-bottom: 20px;">
            <p>Hola <strong>${data.nombre}</strong>,</p>
            <p>Hemos recibido exitosamente tu solicitud de arriendo para el Salón Trekan. Nuestro equipo revisará la disponibilidad y te contactará a la brevedad. A continuación te enviamos una copia de tu solicitud:</p>
          </div>
          ${htmlContent}
        `;

        let info2 = await transporter.sendMail({
          from: '"Colegio Waldorf Trekan" <' + process.env.GMAIL_USER + '>',
          to: data.email,
          subject: 'Resumen de tu Cotización - Salón Trekan',
          html: clientHtmlContent,
        });
        console.log("Éxito Cliente! Message ID: " + info2.messageId);

        console.log("LA ARQUITECTURA SMTP DE GMAIL ESTÁ FUNCIONANDO PERFECTAMENTE.");
    } catch (error) {
        console.error("ERROR CRÍTICO SMTP:", error);
    }
}
test();
