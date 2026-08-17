import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || process.env.AIO_WEBHOOK_SECRET || 'tu_token_secreto';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_ACCESS_TOKEN || '';
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || '';
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://clinicagap.cl';
const META_APP_SECRET = process.env.META_APP_SECRET || process.env.AIO_WEBHOOK_SECRET || '';

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

// ─── POST: Recepción y procesamiento de mensajes WhatsApp e Instagram ──────────
export async function POST(req: Request) {
  try {
    const rawBody = await req.text(); // Necesitamos el texto crudo para validar la firma HMAC
    
    // ─── Validación HMAC-SHA256 (Requisito de la Agencia) ─────────────────────
    if (META_APP_SECRET) {
      const signature = req.headers.get('x-hub-signature-256');
      if (!signature) {
        console.warn('⚠️ [META WEBHOOK] Petición sin firma x-hub-signature-256');
        return new NextResponse('Unauthorized', { status: 401 });
      }
      
      const expectedHash = crypto.createHmac('sha256', META_APP_SECRET).update(rawBody).digest('hex');
      const expectedSignature = `sha256=${expectedHash}`;
      
      if (signature !== expectedSignature) {
        console.error('❌ [META WEBHOOK] Firma HMAC inválida');
        return new NextResponse('Unauthorized', { status: 401 });
      }
    } else {
      console.warn('⚠️ [META WEBHOOK] META_APP_SECRET no está configurado. Saltando validación HMAC.');
    }

    const body = JSON.parse(rawBody);

    // ── DEBUG: Dump de estructura ──
    console.log('📩 [META WEBHOOK] Objeto:', body.object);

    // =========================================================================
    // 1. EVENTOS DE WHATSAPP BUSINESS
    // =========================================================================
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];
      const receivingPhoneNumber = value?.metadata?.phone_number_id;

      if (!message) {
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
      }

      const senderId = message.from; 
      const text = message.text?.body;
      const contactName = value?.contacts?.[0]?.profile?.name || `WhatsApp (${senderId})`;

      if (!text) {
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
      }

      console.log(`💬 [META WEBHOOK] WhatsApp a ${receivingPhoneNumber} desde ${senderId}: "${text}"`);

      // ── Procesamiento Asíncrono para evitar Timeout de Meta ──
      const processMessageInBackground = async () => {
        let aiResponseText = '¡Hola! Hubo un error procesando tu mensaje, pero un humano te contactará pronto. 🙏';

        try {
          console.log(`💾 [CRM] Registrando nuevo lead de WhatsApp en Supabase...`);
          const { error } = await supabaseAdmin.from('leads_admision').insert({
            nombre_apoderado: contactName,
            telefono_apoderado: senderId,
            origen: 'WhatsApp Directo',
            estado: 'nuevo'
          });

          if (error) {
            console.error('❌ [CRM] Error al registrar lead de WhatsApp:', error.message);
          } else {
            console.log(`✅ [CRM] Lead de WhatsApp registrado exitosamente para seguimiento humano.`);
          }
        } catch (dbError) {
          console.error('❌ [CRM] Fallo en la conexión a la base de datos:', dbError);
        }
      };

      // Ejecutar en background sin bloquear la respuesta HTTP
      processMessageInBackground().catch(console.error);

      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    // =========================================================================
    // 2. EVENTOS DE INSTAGRAM / PAGE
    // =========================================================================
    if (body.object === 'page' || body.object === 'instagram') {
      const entry = body.entry?.[0];
      
      let senderId: string | undefined;
      let recipientId: string | undefined;
      let text: string | undefined;

      // ── Formato NUEVO: changes[] ──
      const change = entry?.changes?.[0];
      if (change?.field === 'messages' && change?.value?.message) {
        if (change.value.message.is_echo) {
           console.log('⚠️ [META WEBHOOK IG] Ignorando mensaje echo en changes (Evitando bucle)');
           return new NextResponse('EVENT_RECEIVED', { status: 200 });
        }
        senderId = change.value.sender?.id;
        recipientId = change.value.recipient?.id;
        text = change.value.message?.text;
      }
      
      // ── Formato LEGACY: messaging[] ──
      if (!text) {
        const messaging = entry?.messaging?.[0];
        if (messaging?.message) {
          if (messaging.message.is_echo) {
             console.log('⚠️ [META WEBHOOK IG] Ignorando mensaje echo en messaging (Evitando bucle)');
             return new NextResponse('EVENT_RECEIVED', { status: 200 });
          }
          senderId = messaging.sender?.id;
          recipientId = messaging.recipient?.id;
          text = messaging.message?.text;
        }
      }

      if (!senderId || !text) {
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
      }

      console.log(`💬 [META WEBHOOK IG] Mensaje a ${recipientId} desde ${senderId}: "${text}"`);

      // ── Procesamiento Asíncrono para evitar Timeout de Meta ──
      const processMessageInBackground = async () => {
        let aiResponseText = 'Hubo un error procesando tu solicitud, pero alguien te contactará pronto. Déjanos tus datos si lo deseas.';

        try {
          console.log(`💾 [CRM] Registrando nuevo lead de Instagram en Supabase...`);
          
          const { error } = await supabaseAdmin.from('leads_admision').insert({
            nombre_apoderado: `Instagram User (${senderId})`,
            email_apoderado: `ig_${senderId}@instagram.com`, // Email falso para control
            origen: 'Instagram DM',
            estado: 'nuevo'
          });

          if (error) {
            console.error('❌ [CRM] Error al registrar lead de Instagram:', error.message);
          } else {
            console.log(`✅ [CRM] Lead de Instagram registrado exitosamente para seguimiento humano.`);
          }
        } catch (dbError) {
          console.error('❌ [CRM] Fallo en la conexión a la base de datos:', dbError);
        }
      };

      // Ejecutar en background sin bloquear la respuesta HTTP
      processMessageInBackground().catch(console.error);

      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    console.error('💥 [META WEBHOOK] Error crítico:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
