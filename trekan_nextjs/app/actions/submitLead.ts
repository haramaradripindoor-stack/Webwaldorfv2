'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitLead(formData: FormData) {
  try {
    const parentName = formData.get('parentName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const childrenAges = formData.get('childrenAges') as string
    const message = formData.get('message') as string

    if (!parentName || (!email && !phone)) {
      return { 
        success: false, 
        error: 'El nombre y al menos un método de contacto (email o teléfono) son obligatorios.' 
      }
    }

    // Insertar en Supabase usando el rol de administrador para saltar el RLS
    const { error } = await supabaseAdmin
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

    if (error) {
      console.error('Error insertando lead en Supabase:', error)
      return { success: false, error: 'Hubo un problema al guardar la postulación. Por favor intenta contactarnos por WhatsApp.' }
    }

    // Enviar email de notificación con Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Colegio Waldorf Trekan <onboarding@resend.dev>',
          to: 'admision@colegiowaldorftrekan.cl',
          subject: `Nueva postulación web: ${parentName}`,
          html: `
            <h2>Nueva Postulación Recibida</h2>
            <p><strong>Apoderado:</strong> ${parentName}</p>
            <p><strong>Email:</strong> ${email || 'No provisto'}</p>
            <p><strong>Teléfono:</strong> ${phone || 'No provisto'}</p>
            <p><strong>Edades hijos:</strong> ${childrenAges || 'No especificado'}</p>
            <p><strong>Mensaje:</strong><br/>${message || 'Sin mensaje'}</p>
          `
        })
      } catch (emailError) {
        console.error('Error enviando email con Resend:', emailError)
        // No fallar la petición completa si el email falla, ya que el lead se guardó en Supabase
      }
    }

    revalidatePath('/admision')
    return { success: true }
  } catch (error) {
    console.error('Error en submitLead:', error)
    return { success: false, error: 'Error interno del servidor.' }
  }
}
