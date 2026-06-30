'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

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
      return { success: false, error: 'Hubo un problema al enviar la postulación. Por favor intenta contactarnos por WhatsApp.' }
    }

    revalidatePath('/admision')
    return { success: true }
  } catch (error) {
    console.error('Error en submitLead:', error)
    return { success: false, error: 'Error interno del servidor.' }
  }
}
