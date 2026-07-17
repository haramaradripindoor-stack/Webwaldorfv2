import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAdmin } from '@/lib/auth/requireAdmin';

// Helper to generate embedding via Cohere
async function generateCohereEmbedding(text: string) {
  const cohereApiKey = process.env.COHERE_API_KEY;
  if (!cohereApiKey) throw new Error('COHERE_API_KEY no está configurado');

  const response = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cohereApiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      texts: [text],
      model: 'embed-multilingual-v3.0',
      input_type: 'search_document', // Para los documentos guardados
      embedding_types: ['float']
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Cohere API Error: ${JSON.stringify(data)}`);
  }
  return data.embeddings.float[0];
}

// GET all knowledge chunks
export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data, error } = await supabaseAdmin
      .from('knowledge_chunks')
      .select('id, content, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching chunks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new knowledge chunk
export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { content } = await req.json();
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'El contenido es requerido y debe ser texto' }, { status: 400 });
    }

    // 1. Generate embedding
    const embedding = await generateCohereEmbedding(content);

    // 2. Save to Supabase
    const { data, error } = await supabaseAdmin
      .from('knowledge_chunks')
      .insert({
        content,
        embedding,
        metadata: { source: 'Admin Panel UI' }
      })
      .select('id, content, created_at')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error saving chunk:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a knowledge chunk
export async function DELETE(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Falta el ID del chunk' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('knowledge_chunks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting chunk:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
