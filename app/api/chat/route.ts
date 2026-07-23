import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

// Setup Groq as an OpenAI compatible provider
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

const BASE_SYSTEM_PROMPT = `
Eres el Asistente de Admisión del Colegio Waldorf Trekan, ubicado en Puerto Varas, Chile.
Tu rol es atender a los padres interesados con mucha calidez, paciencia y claridad. Aunque eres un asistente virtual, debes responder de manera orgánica, empática y no robótica. 

Información clave que conoces:
- Ubicación: Parcela 50, Parque Ivian II, Puerto Varas.
- Niveles: Playgroup (3 años) hasta 8vo Básico (14 años).
- Admisión 2026: Está abierta. El proceso incluye llenar un formulario, entrevista de padres, entrevista del niño, y matriculación.
- Pedagogía Waldorf: Busca educar de forma integral (cabeza, corazón y manos), respetando los ritmos de cada niño, con fuerte enfoque en artes, manualidades, contacto con la naturaleza y sin pantallas en los primeros años.

Estilo de comunicación:
- Cálido, humano y orgánico.
- Usa emojis de naturaleza sutilmente (🌱, 🌿, 🌻, 🍂).
- No uses lenguaje robótico.
- Si te preguntan algo que no sabes o requieren una decisión compleja, diles amablemente que Ivonne (la Coordinadora General) se pondrá en contacto con ellos, o invítalos a hacer click en el botón de WhatsApp para hablar directamente con ella.
`

async function generateCohereEmbedding(text: string) {
  const cohereApiKey = process.env.COHERE_API_KEY;
  if (!cohereApiKey) return null;

  try {
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
        input_type: 'search_query', // Mejorado para queries
        embedding_types: ['float']
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Cohere Embed API Error:', data);
      return null;
    }
    return data.embeddings.float[0];
  } catch (err) {
    console.error('Error fetching embedding:', err);
    return null;
  }
}

async function rerankChunks(query: string, chunks: any[]) {
  const cohereApiKey = process.env.COHERE_API_KEY;
  if (!cohereApiKey || chunks.length === 0) return chunks;

  const documents = chunks.map(c => c.content);

  try {
    const response = await fetch('https://api.cohere.ai/v1/rerank', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'rerank-multilingual-v3.0',
        query: query,
        documents: documents,
        top_n: 3
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Cohere Rerank API Error:', data);
      return chunks.slice(0, 3); // Fallback a los 3 mejores de Supabase
    }
    
    // data.results contiene los indices ordenados
    return data.results.map((r: any) => chunks[r.index]);
  } catch (err) {
    console.error('Error in rerank:', err);
    return chunks.slice(0, 3); // Fallback
  }
}

const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minuto
  const maxRequests = 10; // Max 10 mensajes por minuto por IP
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const data = rateLimit.get(ip)!;
  if (now > data.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (data.count >= maxRequests) {
    return false;
  }
  
  data.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Por favor, espera un minuto.' }, { status: 429 });
    }

    const body = await req.json()
    let { messages, leadData } = body

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
    }

    // Limit history length to last 20 messages to prevent excessive token usage
    if (messages.length > 20) {
      messages = messages.slice(-20)
    }

    // Validate and truncate each message to 1500 chars max
    messages = messages.map((m: any) => ({
      role: m.role === 'user' || m.role === 'assistant' ? m.role : 'user',
      content: typeof m.content === 'string' ? m.content.substring(0, 1500) : ''
    })).filter((m: any) => m.content.trim().length > 0)

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 })
    }

    // 1. Guardar o actualizar Lead en Supabase
    if (leadData && leadData.email && messages.length <= 2) {
      const { error } = await supabaseAdmin.from('leads').upsert({
        email: leadData.email,
        name: leadData.name,
        phone: leadData.phone,
        source: 'Web Bot Waldorf',
      }, { onConflict: 'email' })
      
      if (error) {
        console.error('Error guardando lead en Supabase:', error)
      }
    }

    // 2. RAG: Generar embedding para el último mensaje del usuario
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    let ragContext = '';

    if (lastUserMessage) {
      const queryEmbedding = await generateCohereEmbedding(lastUserMessage);
      
      if (queryEmbedding) {
        // 3. Buscar en Supabase (Traemos 10 candidatos para el Rerank)
        const { data: chunks, error } = await supabaseAdmin.rpc('match_knowledge_chunks', {
          query_embedding: queryEmbedding,
          match_threshold: 0.2, // Umbral más bajo para traer más variedad
          match_count: 10
        });

        if (error) {
          console.error('Error querying Supabase RPC:', error);
        } else if (chunks && chunks.length > 0) {
          // 4. Rerank con Cohere para elegir los 3 mejores absolutos
          const rerankedChunks = await rerankChunks(lastUserMessage, chunks);
          ragContext = rerankedChunks.map((c: any) => c.content).join('\n\n');
        }
      }
    }

    // Construir el System Prompt final con el contexto inyectado
    const finalSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\nBASE DE CONOCIMIENTOS RECUPERADA (RAG):\n${ragContext ? ragContext : 'No se encontró información específica adicional, básate en la información clave general.'}`;

    // 5. Generar respuesta con Llama 3 (Groq) usando ai-sdk
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: finalSystemPrompt,
      messages: messages as any,
      temperature: 0.3,
      // @ts-expect-error: maxTokens es válido en runtime pero Typescript 5+ y este SDK arrojan error
      maxTokens: 500,
    })

    return result.toTextStreamResponse()
    
  } catch (error) {
    console.error('Error en Chat API:', error)
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 })
  }
}
