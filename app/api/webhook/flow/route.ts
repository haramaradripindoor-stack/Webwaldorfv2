import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const token = params.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 });
    }

    const FLOW_API_URL = process.env.FLOW_API_URL || 'https://sandbox.flow.cl/api';
    const FLOW_API_KEY = process.env.FLOW_API_KEY;
    const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;

    if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
      return NextResponse.json({ error: 'Servicio no configurado' }, { status: 500 });
    }

    // Preparar firma para consultar el estado del pago
    const statusParams = {
      apiKey: FLOW_API_KEY,
      token: token
    };

    const toSign = `apiKey${FLOW_API_KEY}token${token}`;
    const signature = crypto.createHmac('sha256', FLOW_SECRET_KEY).update(toSign).digest('hex');

    const statusUrl = `${FLOW_API_URL}/payment/getStatus?apiKey=${FLOW_API_KEY}&token=${token}&s=${signature}`;

    const response = await fetch(statusUrl, { method: 'GET' });
    const data = await response.json();

    console.log('[FLOW WEBHOOK] Estado de la transacción:', data);

    if (data.status === 2) { // 2 = Pagado en Flow
      console.log(`[FLOW WEBHOOK] ¡Pago aprobado con éxito! Orden: ${data.commerceOrder}`);
      
      // Intentar extraer el email para activar el plan
      const payerEmail = data.payer;
      if (payerEmail) {
        // Buscar el usuario por email en profiles (si tienes el campo) o auth.users
        // Para simplificar, asumiremos que actualizamos transaction y profile si encontramos el email.
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users?.users?.find((u) => u.email === payerEmail);
        
        if (user) {
          await supabase.from('profiles').update({ is_premium: true }).eq('id', user.id);
          console.log(`[FLOW WEBHOOK] Perfil de ${payerEmail} actualizado a Premium.`);
        }
      }
    } else if (data.status === 3) {
      console.log(`[FLOW WEBHOOK] Pago rechazado. Orden: ${data.commerceOrder}`);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Flow Webhook Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
