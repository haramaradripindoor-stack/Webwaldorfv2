require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runAudit() {
  // 1. Check existing rows in Supabase
  try {
    const { data, count, error } = await supabase
      .from('leads_admision')
      .select('id, notas', { count: 'exact' })
      .like('notas', '%Mensaje Original%');
      
    if (error) throw error;
    console.log(`[SUPABASE] Registros encontrados con 'Mensaje Original': ${count}`);
    if (count > 0) {
      console.log(`[SUPABASE] IDs afectados: ${data.map(d => d.id).join(', ')}`);
    }
  } catch (e) {
    console.log(`[SUPABASE ERROR] No se pudo conectar a Supabase: ${e.message}`);
  }

  // 2. Fix route.ts completely (LLM prompt + Sanitization)
  let routeContent = fs.readFileSync('app/api/meta/webhook/route.ts', 'utf8');
  
  // Fix LLM Prompt
  routeContent = routeContent.replace(
    `Trata de inferir si están preguntando por un curso específico (ej. "1ro básico"). Si no, pon "Por consultar".`,
    `Trata de inferir si están preguntando por un curso específico (ej. "1ro básico"). Si no, pon "Por consultar".\nREGLA ESTRICTA DE PRIVACIDAD: NUNCA incluyas nombres propios de adultos o niños en el resumen. Limítate estrictamente a reportar la intención de la consulta, la edad o el curso de interés.`
  );

  // Remove any raw message logging
  routeContent = routeContent.replace(/Mensaje Original: "\$\{messageText\}"/g, '');
  
  fs.writeFileSync('app/api/meta/webhook/route.ts', routeContent);
  console.log(`[ROUTE.TS] Archivo actualizado y sanitizado.`);
}

runAudit();
