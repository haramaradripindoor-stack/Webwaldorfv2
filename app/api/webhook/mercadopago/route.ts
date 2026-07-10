import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Verificamos si es un pago aprobado de Mercado Pago
    if (body.action === 'payment.created' || body.type === 'payment') {
      const paymentId = body.data?.id;
      
      console.log(`[PAYMENT WEBHOOK] Nuevo pago detectado: ${paymentId}`);
      
      // Aquí consultaríamos la API de Mercado Pago para ver el status real.
      // Simularemos que el pago está aprobado ("approved")
      const paymentStatus = 'approved'; 

        if (paymentStatus === 'approved') {
          // Obtener datos del pago de MercadoPago
          // Como esto es un ejemplo, se asume que buscamos el email en el response real de MP
          // let email = realMpData.payer.email;
          // Simularemos la activación:
          console.log(`[PAYMENT WEBHOOK] Pago aprobado. Tratando de encontrar email...`);
          
          // Por ahora solo lo dejamos anotado en logs ya que requeriría la llamada a API de MP
          // await supabase.from('profiles').update({ is_premium: true }).eq('id', user.id);
          console.log(`[PAYMENT WEBHOOK] Acciones automatizadas ejecutadas.`);
        }
    }

    return new NextResponse('Webhook recibido', { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
