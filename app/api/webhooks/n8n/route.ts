import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Aquí se valida el token o secreto de Supabase/n8n
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET || 'secret_token'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Aquí se puede procesar el evento (ej: un nuevo contacto, un cambio en supabase)
    console.log('Recibido webhook de automatización:', payload);

    return NextResponse.json({ success: true, message: 'Webhook procesado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
