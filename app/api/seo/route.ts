import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Falta el prompt (título o tema)' }, { status: 400 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `Eres un experto redactor SEO y especialista en Pedagogía Waldorf. 
Tu objetivo es generar artículos perfectos para el blog del Colegio Waldorf Trekan (Puerto Varas).
Deben ser cálidos, profesionales, orientados a padres y optimizados para SEO local.

REGLA CRÍTICA: Responde ÚNICA Y EXCLUSIVAMENTE con un objeto JSON válido (sin código markdown extra alrededor) con la siguiente estructura exacta:
{
  "title": "Un título atractivo (máx 60 caracteres)",
  "excerpt": "Una meta descripción persuasiva para Google (máx 155 caracteres)",
  "keywords": "5 a 7 palabras clave separadas por comas",
  "content": "El contenido del artículo formateado en Markdown (mínimo 300 palabras). Incluye subtítulos (H2, H3), viñetas y un llamado a la acción invitando a postular."
}`
          },
          {
            role: 'user',
            content: `Genera el artículo JSON para el siguiente tema o título: "${prompt}"`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error Response:', errorText);
      return NextResponse.json({ error: 'Error del proveedor de IA' }, { status: 500 });
    }

    const data = await response.json();
    const jsonString = data.choices[0].message.content;
    
    // Parse the JSON safely
    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse Groq response as JSON:', jsonString);
      return NextResponse.json({ error: 'La IA no devolvió un JSON válido' }, { status: 500 });
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Error generando SEO con IA:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
