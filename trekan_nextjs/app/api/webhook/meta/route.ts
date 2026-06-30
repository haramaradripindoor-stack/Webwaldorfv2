import { NextResponse } from 'next/server';

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'tu_token_secreto';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || '';
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://clinicagap.cl';

// ─── GET: Verificación del Webhook exigida por Meta ─────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log('🔐 [META VERIFY] Intento de verificación recibido');

  if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
    console.log('✅ [META VERIFY] Token válido — webhook verificado');
    return new NextResponse(challenge, { status: 200 });
  }

  console.log('❌ [META VERIFY] Token inválido o modo incorrecto');
  return new NextResponse('Error de Verificación', { status: 403 });
}

// ─── POST: Recepción y procesamiento de mensajes WhatsApp ───────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ── DEBUG: Dump completo del body para diagnosticar estructura ──
    console.log('📩 [META WEBHOOK] === BODY COMPLETO ===', JSON.stringify(body, null, 0));
    console.log('📩 [META WEBHOOK] Objeto:', body.object);
    console.log('📩 [META WEBHOOK] Entry[0] keys:', JSON.stringify(Object.keys(body.entry?.[0] || {})));
    if (body.entry?.[0]?.messaging) {
      console.log('📩 [META WEBHOOK] messaging[0]:', JSON.stringify(body.entry[0].messaging[0]));
    }
    if (body.entry?.[0]?.changes) {
      console.log('📩 [META WEBHOOK] changes[0]:', JSON.stringify(body.entry[0].changes[0]));
    }

    // Validar que sea un evento de WhatsApp Business
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];
      const receivingPhoneNumber = value?.metadata?.phone_number_id;

      if (!message) {
        console.log('⚠️ [META WEBHOOK] Evento sin mensaje (posible status update)');
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
      }

      const senderId = message.from; // Número de WhatsApp del remitente
      const text = message.text?.body;
      const contactName = value?.contacts?.[0]?.profile?.name || `WhatsApp (${senderId})`;

      if (!text) {
        console.log('⚠️ [META WEBHOOK] Mensaje sin texto (posible imagen/audio)');
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
      }

      console.log(`💬 [META WEBHOOK] Mensaje a ${receivingPhoneNumber} desde ${senderId} (${contactName}): "${text}"`);

      // ── PASO 1: Enviar el mensaje a nuestra IA (POST /api/chat) ──────
      let aiResponseText = '¡Hola! Soy la IA de la clínica. Hubo un error procesando tu mensaje, pero un humano te contactará pronto. 🙏';

      try {
        console.log('🧠 [IA] Enviando mensaje al cerebro de IA...');

        const aiResponse = await fetch(`${APP_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: text }],
            sessionId: senderId,
            channel: 'whatsapp',
            clientName: contactName,
            receivingPhoneNumber: receivingPhoneNumber,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          console.log('🧠 [IA] Respuesta completa:', JSON.stringify(aiData));

          // Extraer el mensaje para el usuario del JSON estructurado
          aiResponseText = aiData.messageToUser || aiData.message || aiResponseText;

          // Log de clasificación del lead
          if (aiData.leadClassification) {
            console.log(`🏷️ [IA] Lead clasificado como: ${aiData.leadClassification}`);
          }
          if (aiData.interestedService) {
            console.log(`🎯 [IA] Servicio de interés: ${aiData.interestedService}`);
          }
          if (aiData.requiresHuman) {
            console.log('🚨 [IA] ¡REQUIERE INTERVENCIÓN HUMANA!');
          }
        } else {
          console.error(`❌ [IA] Error en /api/chat: ${aiResponse.status} ${aiResponse.statusText}`);
        }
      } catch (aiError) {
        console.error('❌ [IA] Fallo de conexión al cerebro:', aiError);
      }

      // ── PASO 2: Enviar respuesta de vuelta al usuario via Graph API ──
      try {
        console.log(`📤 [META SEND] Enviando respuesta a ${senderId}...`);

        const targetPhoneNumberId = receivingPhoneNumber || META_PHONE_NUMBER_ID;
        const metaResponse = await fetch(
          `https://graph.facebook.com/v19.0/${targetPhoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: senderId,
              type: 'text',
              text: {
                preview_url: false,
                body: aiResponseText,
              },
            }),
          }
        );

        if (metaResponse.ok) {
          const metaData = await metaResponse.json();
          console.log(`✅ [META SEND] Mensaje enviado exitosamente. ID: ${metaData.messages?.[0]?.id}`);
        } else {
          const errorData = await metaResponse.text();
          console.error(`❌ [META SEND] Error al enviar: ${metaResponse.status}`, errorData);
        }
      } catch (sendError) {
        console.error('❌ [META SEND] Fallo de conexión a Graph API:', sendError);
      }

      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    // Soporte para eventos de Instagram / Facebook Page
    if (body.object === 'page' || body.object === 'instagram') {
      console.log(`📘 [META WEBHOOK] Evento de ${body.object} recibido`);
      const entry = body.entry?.[0];
      
      // Instagram usa DOS formatos posibles:
      // 1. NUEVO (Instagram Business API): entry.changes[0].value.message
      // 2. LEGACY (Messenger/Page): entry.messaging[0].message
      
      let senderId: string | undefined;
      let recipientId: string | undefined;
      let text: string | undefined;

      // ── Formato NUEVO: changes[] ──
      const change = entry?.changes?.[0];
      if (change?.field === 'messages' && change?.value?.message) {
        if (change.value.message.is_echo) {
           console.log('⚠️ [META WEBHOOK IG] Ignorando mensaje echo en changes');
           return new NextResponse('EVENT_RECEIVED', { status: 200 });
        }
        senderId = change.value.sender?.id;
        recipientId = change.value.recipient?.id;
        text = change.value.message?.text;
        console.log('📘 [META WEBHOOK IG] Formato detectado: changes (nuevo)');
      }
      
      // ── Formato LEGACY: messaging[] ──
      if (!text) {
        const messaging = entry?.messaging?.[0];
        if (messaging?.message) {
          if (messaging.message.is_echo) {
             console.log('⚠️ [META WEBHOOK IG] Ignorando mensaje echo (enviado por el propio bot)');
             return new NextResponse('EVENT_RECEIVED', { status: 200 });
          }
          senderId = messaging.sender?.id;
          recipientId = messaging.recipient?.id;
          text = messaging.message?.text;
          console.log('📘 [META WEBHOOK IG] Formato detectado: messaging (legacy)');
        }
      }

      if (!senderId || !text) {
        console.log('⚠️ [META WEBHOOK IG] Evento sin mensaje procesable (read receipt, eco, o sin texto)');
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
      }

      console.log(`💬 [META WEBHOOK IG] Mensaje a ${recipientId} desde ${senderId}: "${text}"`);

      // ── PASO 1: Enviar el mensaje a nuestra IA (POST /api/chat) ──────
      let aiResponseText = 'Benjamín te contactará pronto. Deja tus datos de correo, WhatsApp si quieres, o llenaremos un formulario para ti.';

      try {
        console.log('🧠 [IA IG] Enviando mensaje al cerebro de IA...');
        const aiResponse = await fetch(`${APP_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: text }],
            sessionId: senderId,
            channel: 'instagram',
            clientName: `Instagram (${senderId})`,
            receivingPhoneNumber: recipientId, // Reutilizamos este campo para el Page ID en DB
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiResponseText = aiData.messageToUser || aiData.message || aiResponseText;
          if (aiData.requiresHuman) console.log('🚨 [IA IG] ¡REQUIERE INTERVENCIÓN HUMANA!');
        } else {
          console.error(`❌ [IA IG] Error en /api/chat: ${aiResponse.status}`);
        }
      } catch (aiError) {
        console.error('❌ [IA IG] Fallo de conexión al cerebro:', aiError);
      }

      // ── PASO 2: Enviar respuesta de vuelta via Graph API (Send API) ──
      try {
        console.log(`📤 [META SEND IG] Enviando respuesta a ${senderId}...`);
        
        // Usamos META_IG_ACCESS_TOKEN si existe, o el token general de Meta
        const IG_ACCESS_TOKEN = process.env.META_IG_ACCESS_TOKEN || META_ACCESS_TOKEN;
        
        // La nueva API de Instagram usa graph.instagram.com, la antigua usa graph.facebook.com
        const isInstagramApi = body.object === 'instagram' || IG_ACCESS_TOKEN.startsWith('IGA');
        const graphUrl = isInstagramApi 
          ? `https://graph.instagram.com/v21.0/me/messages`
          : `https://graph.facebook.com/v21.0/me/messages`;

        const metaResponse = await fetch(graphUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${IG_ACCESS_TOKEN}`
          },
          body: JSON.stringify({
            recipient: { id: senderId },
            message: { text: aiResponseText }
          }),
        });

        if (metaResponse.ok) {
          console.log(`✅ [META SEND IG] Mensaje enviado exitosamente a Instagram`);
        } else {
          const errorData = await metaResponse.text();
          console.error(`❌ [META SEND IG] Error al enviar: ${metaResponse.status}`, errorData);
        }
      } catch (sendError) {
        console.error('❌ [META SEND IG] Fallo de conexión a Graph API:', sendError);
      }

      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    console.log('❓ [META WEBHOOK] Objeto desconocido:', body.object);
    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    console.error('💥 [META WEBHOOK] Error crítico:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
