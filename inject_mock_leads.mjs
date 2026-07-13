import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockLeads = [
  {
    ig_username: 'mama_waldorf_sur',
    bio: 'Crianza respetuosa 🌿 Mamá de León y Sofía. Amante del sur y la naturaleza. Arquitecta. 📍 Puerto Varas.',
    followers: 1240,
    calificacion_ia: 'HOT',
    estado_cm: 'Pendiente'
  },
  {
    ig_username: 'familia_sustentable_pv',
    bio: 'Buscando una vida más lenta y consciente. Huerto en casa 🌱. Papá de 3.',
    followers: 890,
    calificacion_ia: 'HOT',
    estado_cm: 'Pendiente'
  },
  {
    ig_username: 'juguetes_madera_chile',
    bio: 'Juguetes de madera nobles inspirados en Waldorf y Montessori. Hechos a mano.',
    followers: 5600,
    calificacion_ia: 'WARM',
    estado_cm: 'Pendiente'
  }
];

async function injectLeads() {
  console.log("Inyectando 3 prospectos de prueba (HOT/WARM) a la base de datos...");
  
  // Asumiendo que la tabla se llama 'prospectos_outbound' o similar. 
  // Let's check the exact table name by catching errors.
  let { data, error } = await supabase.from('prospectos_outbound').insert(mockLeads);
  
  if (error) {
    console.error("Error inyectando prospectos (tal vez la tabla se llama distinto):", error.message);
    // Intentar con otra tabla si falla
    if (error.message.includes('relation "prospectos_outbound" does not exist')) {
        console.log("Intentando con la tabla 'prospects'...");
        let res2 = await supabase.from('prospects').insert(mockLeads);
        if(res2.error) console.error(res2.error.message);
        else console.log("Prospectos inyectados en 'prospects' exitosamente.");
    }
  } else {
    console.log("¡Prospectos inyectados exitosamente en prospectos_outbound!");
  }
}

injectLeads();
