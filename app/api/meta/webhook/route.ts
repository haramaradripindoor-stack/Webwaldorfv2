import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'antigravity_trekan_2026';
const IA_API_KEY = process.env.IA_API_KEY || process.env.OPEN_ROUTER_API || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ WEBHOOK_VERIFIED');
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  return new NextResponse('Bad Request', { status: 400 });
}

// Función asíncrona de procesamiento (IA en las sombras)
async function processMessageWithAI(senderId: string, messageText: string, source: string) {
  try {
    console.log(`🤖 Iniciando análisis IA para mensaje de ${senderId}`);
    
    // 1. Llamada a OpenRouter para extraer datos (Fallback ultra-estable)
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${IA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente clasificador del Colegio Waldorf Trekan.
Lee el mensaje del usuario y extrae la información en formato JSON estricto.
Trata de inferir si están preguntando por un curso específico (ej. "1ro básico", "Jardín", "Pre-kinder"). Si no menciona curso, pon "Por consultar".
Tu única respuesta debe ser el JSON.
Formato:
{
  "curso_postula": "El curso o 'Por consultar'",
  "resumen": "Resumen del mensaje en máximo 8 palabras"
}`
          },
          { role: 'user', content: messageText }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!openRouterResponse.ok) {
      console.error('Error en OpenRouter API:', await openRouterResponse.text());
      return;
    }

    const data = await openRouterResponse.json();
    const iaResult = JSON.parse(data.choices[0].message.content);
    console.log('🧠 IA extrajo:', iaResult);

    // 2. Insertar silenciosamente en el Kanban (leads_admision)
    const { error } = await supabase.from('leads_admision').insert([{
      origen: source,
      nombre_apoderado: 'IG User: ' + senderId, 
      email_apoderado: 'No proporcionado',
      telefono_apoderado: 'No proporcionado',
      nombre_nino: 'Por consultar',
      edad_nino: 'Por consultar',
      curso_postula: iaResult.curso_postula || 'Consultas Generales',
      estado: 'nuevo',
      notas: `🤖 Resumen IA: ${iaResult.resumen}\n\nMensaje Original: "${messageText}"`
    }]);

    if (error) console.error('Error inyectando lead a Supabase:', error);
    else console.log('✅ Lead inyectado al Kanban de Admisiones con éxito.');

  } catch (error) {
    console.error('❌ Error en processMessageWithAI:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.object === 'page' || body.object === 'instagram' || body.object === 'whatsapp_business_account') {
      
      for (const entry of body.entry) {
        if (entry.messaging) {
          for (const event of entry.messaging) {
            if (event.message?.is_echo) continue;

            const senderId = event.sender?.id;
            const messageText = event.message?.text;
            
            if (messageText) {
              // Disparamos la IA en segundo plano (Fire and Forget)
              // NOTA: En Vercel Serverless esto puede morir prematuramente, pero Groq toma ~500ms
              // Por seguridad, hacemos await. El timeout de Meta es 20s, Groq es ultra rápido.
              await processMessageWithAI(senderId, messageText, `Instagram DM`);
            }
          }
        }
      }

      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    console.error('❌ Error procesando Webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
