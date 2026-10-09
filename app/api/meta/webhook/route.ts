import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'antigravity_trekan_2026';
const IA_API_KEY = process.env.IA_API_KEY || process.env.OPEN_ROUTER_API || '';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';

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

// Enviar Mensaje Directo vía Graph API
async function sendInstagramMessage(recipientId: string, text: string) {
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${META_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: text }
      })
    });
    const data = await res.json();
    if (data.error) {
      console.error('❌ Error enviando mensaje a Meta:', JSON.stringify(data.error));
    } else {
      console.log(`✅ Mensaje enviado exitosamente a ${recipientId}`);
    }
  } catch (error) {
    console.error('❌ Error fatal en sendInstagramMessage:', error);
  }
}

// Función asíncrona de procesamiento (IA en las sombras)
async function processMessageWithAI(senderId: string, messageText: string, source: string) {
  try {
    console.log(`🤖 Iniciando análisis IA para mensaje de ${senderId}`);
    
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
            content: `Eres el Asistente del Colegio Waldorf Trekan.
Lee el mensaje del usuario y extrae la información en JSON estricto.
Trata de inferir si están preguntando por un curso específico (ej. "1ro básico"). Si no, pon "Por consultar".
Extrae el nombre del apoderado y del niño/a si los mencionan explícitamente en el mensaje. Si no se mencionan, pon "No proporcionado".
Formato:
{
  "nombre_apoderado": "Nombre del adulto o 'No proporcionado'",
  "nombre_nino": "Nombre del niño/a o 'No proporcionado'",
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

    // 1. Insertar silenciosamente en el Kanban
    const { error } = await supabase.from('leads_admision').insert([{
      origen: source,
      nombre_apoderado: iaResult.nombre_apoderado && iaResult.nombre_apoderado !== 'No proporcionado' ? iaResult.nombre_apoderado : 'IG User: ' + senderId, 
      email_apoderado: 'No proporcionado',
      telefono_apoderado: 'No proporcionado',
      nombre_nino: iaResult.nombre_nino || 'Por consultar',
      edad_nino: 'Por consultar',
      curso_postula: iaResult.curso_postula || 'Consultas Generales',
      estado: 'nuevo',
      notas: `🤖 Resumen IA (Anónimo): ${iaResult.resumen}`
    }]);

    if (error) console.error('Error inyectando lead a Supabase:', error);
    else console.log('✅ Lead inyectado al Kanban de Admisiones.');

    // 2. DISPARAR RESPUESTA AUTOMÁTICA AL INSTAGRAM DEL USUARIO
    if (META_ACCESS_TOKEN && iaResult.respuesta_sugerida) {
      // await sendInstagramMessage(senderId, iaResult.respuesta_sugerida); // DESACTIVADO: El cliente maneja DMs orgánicamente
    }

  } catch (error) {
    console.error('❌ Error en processMessageWithAI:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.object === 'page' || body.object === 'instagram') {
      
      for (const entry of body.entry) {
        // Formato Legacy (Messaging)
        if (entry.messaging) {
          for (const event of entry.messaging) {
            if (event.message?.is_echo) continue;

            const senderId = event.sender?.id;
            const messageText = event.message?.text;
            
            if (messageText && senderId) {
              // Fire and forget (No blocking the 200 OK)
              processMessageWithAI(senderId, messageText, `Instagram DM (Legacy)`).catch(console.error);
            }
          }
        }

        // Nuevo formato Instagram (Changes)
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'messages' || change.field === 'comments') {
              const messageData = change.value?.message || change.value;
              if (messageData?.is_echo) continue;

              const senderId = change.value?.sender?.id || change.value?.from?.id;
              const messageText = messageData?.text;
              
              if (messageText && senderId) {
                // Fire and forget
                processMessageWithAI(senderId, messageText, `Instagram ${change.field}`).catch(console.error);
              }
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
