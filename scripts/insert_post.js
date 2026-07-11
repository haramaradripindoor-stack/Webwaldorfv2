require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertPost() {
  const post = {
    title: "Pedagogía Waldorf vs Tradicional: ¿Cuál es el mejor método para tu hijo en 2026?",
    slug: "pedagogia-waldorf-vs-tradicional-" + Date.now(),
    excerpt: "Descubre las diferencias clave entre la educación tradicional y la metodología Waldorf. Conoce por qué cada vez más familias en Puerto Varas eligen una educación enfocada en el respeto, el arte y la naturaleza.",
    content: `Elegir el colegio adecuado es una de las decisiones más importantes que toman las familias. Hoy en día, términos como **educación Waldorf** o metodologías alternativas resuenan con fuerza, pero, ¿en qué se diferencian realmente del sistema tradicional?

Si estás buscando un **colegio Waldorf en Puerto Varas** o en el sur de Chile, es fundamental entender cómo este enfoque transforma la experiencia educativa de los niños.

### 1. El ritmo de aprendizaje: Respeto vs. Estandarización
En la educación tradicional, el foco suele estar en la estandarización: todos los niños deben aprender lo mismo, al mismo tiempo, priorizando el rendimiento académico temprano. 

La **pedagogía Waldorf**, por el contrario, entiende que el desarrollo infantil ocurre en etapas (los septenios). No forzamos la intelectualización precoz. En el primer septenio (3 a 6 años), el enfoque es el juego libre, la imitación y el desarrollo de la voluntad. El niño aprende a habitar su cuerpo antes de sentarse frente a un pizarrón.

### 2. El Arte como motor de aprendizaje
Mientras que en una escuela convencional el arte, la música y las manualidades son "materias de relleno", en una **escuela Waldorf** son el hilo conductor del conocimiento. Las matemáticas se aprenden con movimiento, la historia se narra con imágenes vivas y la ciencia se experimenta antes de teorizarse. Esto crea un aprendizaje profundo que no se olvida después de un examen.

### 3. Conexión con la Naturaleza
En el **Colegio Waldorf Trekan**, la naturaleza no es un decorado, es nuestra principal aula. Siguiendo el ritmo de las estaciones, celebramos festividades que conectan a los niños con los ciclos de la tierra (como la Fiesta de la Luz). Esta inmersión al aire libre fortalece su sistema inmunológico, su motricidad y su respeto por el entorno, algo invaluable en nuestra región de Los Lagos.

### 4. Sin notas ni pantallas en la infancia
El **método Waldorf** protege la infancia. Evitamos la sobreexposición a pantallas en los primeros años para permitir que la imaginación del niño se desarrolle sin imágenes prefabricadas. Asimismo, en lugar de calificaciones numéricas que fomentan la competencia y el estrés, los maestros realizan evaluaciones cualitativas profundas, observando el desarrollo integral de cada estudiante: su cabeza, su corazón y sus manos.

### Una educación hacia la libertad
El objetivo final de nuestra pedagogía no es formar estudiantes para que encajen en un sistema, sino individuos libres, conscientes y con propósito. 

Si te resuena esta visión y buscas una comunidad educativa comprometida en el sur de Chile, te invitamos a conocer el **Colegio Waldorf Trekan**. 

**Las admisiones 2026 ya están abiertas.** [Haz clic aquí para contactarnos y comenzar el viaje.](#admision)`,
    image_url: "/images/actividapedagogicahumedales1.jpg",
    meta_keywords: "educación Waldorf, colegio Waldorf en Puerto Varas, pedagogía Waldorf, escuela Waldorf, método Waldorf",
    published_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('noticias').insert([post]);

  if (error) {
    console.error("Error inserting post:", error);
  } else {
    console.log("Success! Post inserted.");
  }
}

insertPost();
