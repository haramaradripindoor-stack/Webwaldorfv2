// =====================================================================
// VERCEL FUNCTION — Proxy seguro a Groq API
// =====================================================================
// Esta función vive en el servidor de Vercel. La API key NUNCA se expone
// al navegador del usuario. El chatbot le pega a /api/chat y esta función
// se encarga de hablar con Groq.
// =====================================================================

export const config = {
  runtime: 'edge', // más rápido y con mejor cuota gratis
};

// Dominios permitidos para usar esta API (ajústalo a tu dominio real)
const ALLOWED_ORIGINS = [
  'https://www.colegiowaldorftrekan.cl',
  'https://colegiowaldorftrekan.cl',
  'http://localhost:3000',          // para pruebas locales
  'http://localhost:8080',
  'http://127.0.0.1:5500',          // Live Server de VS Code
];

// Rate limiting simple en memoria (por IP): 20 mensajes por minuto
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW;
  }

  record.count++;
  rateLimitMap.set(ip, record);

  // Limpieza ocasional para que el Map no crezca infinito
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  return record.count <= RATE_LIMIT_MAX;
}

export default async function handler(req) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  // Cabeceras CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Solo aceptamos POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método no permitido' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Bloqueo por origen (opcional pero recomendado)
  if (!isAllowed) {
    return new Response(
      JSON.stringify({ error: 'Origen no autorizado' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Rate limiting por IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          || req.headers.get('x-real-ip')
          || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Demasiadas peticiones. Espera un minuto.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const { messages, model } = body;

    // Validaciones básicas
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Mensajes inválidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limitar tamaño del contexto para ahorrar cuota
    if (messages.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Contexto demasiado largo' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Modelos permitidos (evita que alguien use modelos caros)
    const ALLOWED_MODELS = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'openai/gpt-oss-120b',
    ];
    const chosenModel = ALLOWED_MODELS.includes(model) ? model : 'llama-3.3-70b-versatile';

    // Leer la API key desde las variables de entorno de Vercel
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API Key no configurada en el servidor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Llamar a Groq
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: chosenModel,
        messages: messages,
        temperature: 0.6,
        max_tokens: 500,
      }),
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: errData?.error?.message || `Error de Groq (${groqRes.status})`
        }),
        { status: groqRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || '';

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Error interno: ' + err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
