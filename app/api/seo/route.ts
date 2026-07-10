import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Falta el prompt (título o tema)' }, { status: 400 });
    }

    const { object } = await generateObject({
      model: groq('llama-3.3-70b-versatile'),
      system: `Eres un experto redactor SEO y especialista en Pedagogía Waldorf. 
      Tu objetivo es generar artículos perfectos para el blog del Colegio Waldorf Trekan (Puerto Varas).
      Deben ser cálidos, profesionales, orientados a padres y optimizados para SEO local.
      Responde SOLO con el JSON estructurado.`,
      prompt: `Genera un artículo de blog sobre el siguiente tema o título: "${prompt}". 
      Proporciona:
      1. title: Un título atractivo (máx 60 caracteres).
      2. excerpt: Una meta descripción persuasiva para Google (máx 155 caracteres).
      3. keywords: 5 a 7 palabras clave separadas por comas.
      4. content: El contenido del artículo formateado en Markdown (mínimo 300 palabras). Incluye subtítulos (H2, H3), viñetas y un llamado a la acción invitando a conocer el proceso de admisión 2026 del Colegio Trekan.`,
      schema: z.object({
        title: z.string(),
        excerpt: z.string(),
        keywords: z.string(),
        content: z.string()
      }),
      temperature: 0.7,
    });

    return NextResponse.json(object);

  } catch (error) {
    console.error('Error generando SEO con IA:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
