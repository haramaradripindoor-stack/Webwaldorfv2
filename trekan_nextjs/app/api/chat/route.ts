import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

// Setup Groq as an OpenAI compatible provider
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

const SYSTEM_PROMPT = `
Eres el Asistente de Admisión del Colegio Waldorf Trekan, ubicado en Puerto Varas, Chile.
Tu rol es atender a los padres interesados con mucha calidez, paciencia y claridad. Aunque eres un asistente virtual, debes responder de manera orgánica, empática y no robótica. 

Información clave que conoces:
- Ubicación: Parcela 50, Parque Ivian II, Puerto Varas.
- Niveles: Playgroup (3 años) hasta 8vo Básico (14 años).
- Admisión 2026: Está abierta. El proceso incluye llenar un formulario, entrevista de padres, entrevista del niño, y matriculación.
- Pedagogía Waldorf: Busca educar de forma integral (cabeza, corazón y manos), respetando los ritmos de cada niño, con fuerte enfoque en artes, manualidades, contacto con la naturaleza y sin pantallas en los primeros años.

Estilo de comunicación:
- Cálido, humano y orgánico.
- Usa emojis de naturaleza sutilmente (🌱, 🌿, 🌻, 🍂).
- No uses lenguaje robótico.
- Si te preguntan algo que no sabes (como precios exactos de matrícula si no están en tu base) o requieren una decisión compleja, diles amablemente que Ivonne (la Coordinadora General) se pondrá en contacto con ellos, o invítalos a hacer click en el botón de WhatsApp para hablar directamente con ella.

BASE DE CONOCIMIENTOS (RAG):
- Ubicación: Las Azaleas 96, Parque Ivian 1, Puerto Varas.
- Horario de clases: Lunes a viernes, de 08:00 a 14:00 horas.
- Alimentación/Transporte: No ofrecemos. Cada niño trae su almuerzo/colación.
- Metodología Waldorf: Acompañamos el desarrollo del niño (mente, corazón y manos) a través de experiencias vivenciales, arte, contacto con la naturaleza (Parque Ivian es nuestro campus vivo).
- Evaluaciones: Cualitativas y continuas (informes narrativos y portafolios). No usamos notas.
- Admisión: Abierta todo el año según disponibilidad. Máximo 16 niños por curso (Jardín hasta 8vo Básico). 
- Talleres: Acuarela, tejido, música, carpintería, euritmia.
`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, leadData } = body

    // 1. Guardar o actualizar Lead en Supabase
    if (leadData && leadData.email && messages.length <= 2) {
      const { error } = await supabaseAdmin.from('leads').upsert({
        email: leadData.email,
        name: leadData.name,
        phone: leadData.phone,
        source: 'Web Bot Waldorf',
      }, { onConflict: 'email' })
      
      if (error) {
        console.error('Error guardando lead en Supabase:', error)
        // No bloqueamos el chat si falla la base de datos
      }
    }

    // 2. Generar respuesta con Llama 3 (Groq) usando ai-sdk
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: SYSTEM_PROMPT,
      messages: messages as any,
      temperature: 0.3,
      // @ts-expect-error: maxTokens es válido en runtime pero Typescript 5+ y este SDK arrojan error
      maxTokens: 500,
    })

    return result.toTextStreamResponse()
    
  } catch (error) {
    console.error('Error en Chat API:', error)
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 })
  }
}
