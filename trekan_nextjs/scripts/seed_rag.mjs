import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const cohereApiKey = process.env.COHERE_API_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Faltan credenciales de Supabase en .env.local')
  process.exit(1)
}
if (!cohereApiKey) {
  console.error('Falta COHERE_API_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Conocimiento base de Trekan para inyectar en el RAG
const TREKAN_KNOWLEDGE = [
  "El Colegio Waldorf Trekan está ubicado en Parcela 50, Parque Ivian II, Puerto Varas, Región de Los Lagos, Chile.",
  "Trekan ofrece niveles educativos desde Playgroup (3 años) hasta 8vo Básico (14 años), manteniendo cursos pequeños de máximo 16 alumnos para una atención personalizada.",
  "El proceso de Admisión 2026 está actualmente abierto todo el año según disponibilidad de cupos. Los pasos incluyen: completar un formulario online, entrevista de padres con el equipo docente, entrevista de observación del niño/a, y finalmente la matriculación.",
  "La Pedagogía Waldorf en Trekan busca educar de forma integral (cabeza, corazón y manos), respetando profundamente los ritmos de cada niño. Hay un fuerte enfoque en las artes, manualidades y el contacto directo con la naturaleza.",
  "En los primeros años (Jardín y primeros básicos), la pedagogía Waldorf desaconseja totalmente el uso de pantallas, favoreciendo el juego libre y la imaginación.",
  "El horario escolar es de lunes a viernes, de 08:00 a 14:00 horas.",
  "El colegio no ofrece servicio de alimentación ni transporte escolar. Cada familia debe encargarse del traslado y cada niño debe traer su propia colación y almuerzo.",
  "Las evaluaciones en Trekan son cualitativas y continuas, entregando informes narrativos detallados y portafolios del trabajo de los alumnos. No se utilizan notas numéricas tradicionales.",
  "Trekan cuenta con diversos talleres formativos integrados en el currículum, tales como: acuarela, tejido, música, carpintería y euritmia.",
  "El entorno natural del colegio (Parque Ivian) es considerado un 'campus vivo', donde la naturaleza es parte fundamental del día a día y del aprendizaje de los niños."
]

async function generateCohereEmbedding(text) {
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
      input_type: 'search_document',
      embedding_types: ['float']
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Error Cohere: ${JSON.stringify(data)}`);
  }
  
  // Cohere returns { embeddings: { float: [ [...] ] } } if embedding_types is specified
  return data.embeddings.float[0];
}

async function seedDatabase() {
  console.log('🌱 Iniciando siembra de conocimiento RAG en Trekan...')
  
  for (const chunk of TREKAN_KNOWLEDGE) {
    try {
      console.log(`Vectorizando: "${chunk.substring(0, 30)}..."`)
      const embedding = await generateCohereEmbedding(chunk)
      
      const { error } = await supabase
        .from('knowledge_chunks')
        .insert({
          content: chunk,
          metadata: { source: 'base_conocimiento_trekan', type: 'general' },
          embedding: embedding
        })
        
      if (error) {
        console.error('Error insertando en Supabase:', error.message)
      } else {
        console.log('✅ Chunk guardado correctamente.')
      }
      
      // Pequeña pausa para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (e) {
      console.error('Error procesando chunk:', e)
    }
  }
  
  console.log('🎉 Siembra completada.')
}

seedDatabase()
