import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Map Google Forms data to our schema
    const newLead = {
      nombre: data.apoderado_nombre || 'Sin nombre',
      apoderado_email: data.apoderado_email || '',
      apoderado_telefono: data.apoderado_telefono || '',
      horario_contacto: data.horario_contacto || '',
      nino_nombre: data.nino_nombre || '',
      nino_edad: data.nino_edad || '',
      curso_postula: data.curso_postula || '',
      postulan_mas_hijos: data.postulan_mas_hijos || '',
      nee: data.nee || 'No',
      nee_detalle: data.nee_detalle || '',
      ciudad: data.ciudad || '',
      traslado: data.traslado || '',
      nivel_interes: data.nivel_interes || '🟡 Evaluando opciones',
      dudas_principales: data.dudas_principales || '',
      comentarios: data.comentarios || '',
      canal: 'formulario',
      estado: 'ingreso',
      clasificacion: data.nivel_interes?.includes('Listo') ? 'HOT' : (data.nivel_interes?.includes('Muy interesado') ? 'WARM' : 'COLD'),
      servicio: data.curso_postula || 'Postulación Admisión'
    };

    const { error } = await supabase.from('chat_leads').insert([newLead]);

    if (error) {
      console.error('Error insertando lead de forms:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('Error procesando webhook de forms:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
