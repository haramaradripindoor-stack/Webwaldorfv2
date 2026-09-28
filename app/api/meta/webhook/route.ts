import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase (Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Token de verificación de Meta (debes poner este mismo token en tu panel de Meta for Developers)
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'antigravity_trekan_2026';

// GET: Verificación de Meta Webhook
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
      console.error('❌ Token mismatch', { received: token, expected: VERIFY_TOKEN });
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return new NextResponse('Bad Request', { status: 400 });
}

// POST: Recepción de Eventos (Leads / Mensajes)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📥 Incoming Webhook Payload:', JSON.stringify(body, null, 2));

    if (body.object === 'page' || body.object === 'instagram' || body.object === 'whatsapp_business_account') {
      
      // Iterar sobre las entradas (Meta agrupa los eventos)
      for (const entry of body.entry) {
        
        // 1. Caso: Mensajes de Instagram/WhatsApp
        if (entry.messaging) {
          for (const event of entry.messaging) {
            // Regla Anti-Bucle: Ignorar mensajes que el propio bot envió (echoes)
            if (event.message?.is_echo) continue;

            const senderId = event.sender?.id;
            const messageText = event.message?.text;
            
            if (messageText) {
              console.log(`📩 Mensaje recibido de ${senderId}: ${messageText}`);
              
              // Inyectar a Supabase (CRM)
              await supabase.from('crm_mensajes').insert([{
                origen: body.object,
                remitente_id: senderId,
                contenido: messageText,
                estado: 'nuevo',
                fecha: new Date().toISOString()
              }]);
            }
          }
        }

        // 2. Caso: Facebook Lead Ads (Formularios)
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'leadgen') {
              const leadId = change.value.leadgen_id;
              console.log(`🔥 Nuevo Lead de Anuncio! ID: ${leadId}`);
              
              // Inyectar a Supabase (CRM)
              await supabase.from('crm_leads_ads').insert([{
                origen: 'meta_ads',
                lead_id: leadId,
                estado: 'sin_contactar',
                fecha: new Date().toISOString()
              }]);

              // Aquí, opcionalmente, llamarías al modelo Qwen/Groq localmente 
              // para notificar o cualificar al lead.
            }
          }
        }
      }

      // IMPORTANTE: Siempre responder 200 OK rápido a Meta para evitar retries (timeouts)
      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    console.error('❌ Error procesando Webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
