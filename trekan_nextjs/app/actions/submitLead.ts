'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

// Zod Schema para validación estricta
const formSchema = z.object({
  parentName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().email('El correo electrónico no es válido.').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  childrenAges: z.string().optional(),
  message: z.string().optional(),
  website: z.string().optional(), // Honeypot
}).refine(data => data.email || data.phone, {
  message: 'Debes proporcionar al menos un correo o un teléfono.',
  path: ['email'] // attach the error to the email field conceptually
})

export async function submitLead(formData: FormData) {
  try {
    // 1. Extraer datos
    const rawData = {
      parentName: formData.get('parentName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      childrenAges: formData.get('childrenAges') as string,
      message: formData.get('message') as string,
      website: formData.get('website') as string,
    }

    // 2. Anti-Spam (Honeypot)
    if (rawData.website) {
      console.warn('Bot detectado vía honeypot:', rawData)
      // Simulamos éxito para confundir al bot
      return { success: true }
    }

    // 3. Validación Zod
    const validatedData = formSchema.safeParse(rawData)

    if (!validatedData.success) {
      // Retornar el primer mensaje de error
      return { 
        success: false, 
        error: validatedData.error.errors[0].message 
      }
    }

    const { parentName, email, phone, childrenAges, message } = validatedData.data

    // 4. Inserción en Supabase (CRM)
    const { error: dbError } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          name: parentName,
          email: email || null,
          phone: phone || null,
          details: `Edades: ${childrenAges || 'No especificado'}. Mensaje: ${message || 'Sin mensaje'}`,
          source: 'web_admision',
          status: 'nuevo'
        }
      ])

    if (dbError) {
      console.error('Error insertando lead en Supabase:', dbError)
      return { success: false, error: 'Hubo un problema al guardar la postulación. Por favor intenta contactarnos por WhatsApp.' }
    }

    // 5. Envío de correos con Resend
    if (process.env.RESEND_API_KEY) {
      try {
        // A) Correo interno para Admisión
        await resend.emails.send({
          from: 'Colegio Waldorf Trekan <onboarding@resend.dev>',
          to: 'admision@colegiowaldorftrekan.cl',
          subject: `NUEVO LEAD: ${parentName}`,
          html: `
            <h2>Nueva Postulación Web</h2>
            <p><strong>Apoderado:</strong> ${parentName}</p>
            <p><strong>Email:</strong> ${email || 'No provisto'}</p>
            <p><strong>Teléfono:</strong> ${phone || 'No provisto'}</p>
            <p><strong>Edades hijos:</strong> ${childrenAges || 'No especificado'}</p>
            <p><strong>Mensaje:</strong><br/>${message || 'Sin mensaje'}</p>
          `
        })

        // B) Auto-responder para el Apoderado (si dejó su email)
        if (email) {
          await resend.emails.send({
            from: 'Admisión Colegio Waldorf Trekan <onboarding@resend.dev>',
            to: email,
            subject: 'Hemos recibido tu postulación - Colegio Waldorf Trekan',
            html: `
              <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4A5D23;">¡Hola, ${parentName}!</h2>
                <p>Muchas gracias por tu interés en el Colegio Waldorf Trekan.</p>
                <p>Te escribimos para confirmar que hemos recibido correctamente tus datos para el proceso de admisión 2026. Hemos registrado la siguiente información:</p>
                <ul>
                  <li><strong>Teléfono de contacto:</strong> ${phone || 'No provisto'}</li>
                  <li><strong>Edades a postular:</strong> ${childrenAges || 'No especificado'}</li>
                </ul>
                <p>Ivonne, nuestra encargada de admisión, revisará tu solicitud y se pondrá en contacto contigo muy pronto (usualmente a través de WhatsApp) para coordinar los próximos pasos y resolver cualquier duda que puedas tener.</p>
                <p>Un abrazo cálido desde el sur,<br/><strong>El equipo del Colegio Waldorf Trekan</strong></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">Por favor no respondas a este correo automatizado. Si necesitas comunicarte urgente, escríbenos a nuestro WhatsApp oficial.</p>
              </div>
            `
          })
        }
      } catch (emailError) {
        console.error('Error enviando emails con Resend:', emailError)
        // No fallamos la operación si falla el correo, el lead ya está en CRM
      }
    }

    revalidatePath('/admision')
    return { success: true }
  } catch (error) {
    console.error('Error en submitLead:', error)
    return { success: false, error: 'Error interno del servidor.' }
  }
}
