'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import * as nodemailer from 'nodemailer'
import { z } from 'zod'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const formSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().email('El correo electrónico no es válido.'),
  area: z.string().min(1, 'Debes seleccionar un área.'),
  motivation: z.string().optional(),
})

export async function submitTeacher(formData: FormData) {
  try {
    const rawData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      area: formData.get('area') as string,
      motivation: formData.get('motivation') as string,
    }

    const validatedData = formSchema.safeParse(rawData)

    if (!validatedData.success) {
      return { 
        success: false, 
        error: validatedData.error.issues[0].message 
      }
    }

    const { fullName, email, area, motivation } = validatedData.data
    
    // Manejo de archivo (CV)
    const cvFile = formData.get('cv') as File | null
    let cvUrl = ''

    if (cvFile && cvFile.size > 0) {
      if (cvFile.size > 5 * 1024 * 1024) {
        return { success: false, error: 'El archivo CV no debe superar los 5MB.' }
      }

      const fileExt = cvFile.name.split('.').pop()
      const fileName = `${Date.now()}_${fullName.replace(/\s+/g, '_')}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('cvs')
        .upload(fileName, cvFile)

      if (uploadError) {
        console.error('Error subiendo CV:', uploadError)
        return { success: false, error: 'Error al subir el archivo CV.' }
      }

      const { data: { publicUrl } } = supabaseAdmin.storage.from('cvs').getPublicUrl(fileName)
      cvUrl = publicUrl
    }

    // Insertar en CRM
    const { error: dbError } = await supabaseAdmin
      .from('teacher_applications')
      .insert([
        {
          name: fullName,
          email: email,
          area: area,
          motivation: motivation || null,
          cv_url: cvUrl || null,
          status: 'nuevo'
        }
      ])

    if (dbError) {
      console.error('Error insertando postulante en Supabase:', dbError)
      return { success: false, error: 'Hubo un problema al guardar tu postulación.' }
    }

    // Enviar correos con Nodemailer
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        await transporter.sendMail({
          from: '"Colegio Waldorf Trekan" <admision@colegiowaldorftrekan.cl>',
          to: 'admision@colegiowaldorftrekan.cl',
          subject: `NUEVO PROFESOR POSTULANTE: ${fullName}`,
          html: `
            <h2>Nueva Postulación de Equipo</h2>
            <p><strong>Nombre:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Área:</strong> ${area}</p>
            <p><strong>Motivación:</strong><br/>${motivation || 'Sin mensaje'}</p>
            <p><strong>CV:</strong> ${cvUrl ? `<a href="${cvUrl}">Descargar CV</a>` : 'No adjuntó'}</p>
          `
        })
      } catch (emailError) {
        console.error('Error enviando emails con Nodemailer:', emailError)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error en submitTeacher:', error)
    return { success: false, error: 'Error interno del servidor.' }
  }
}
