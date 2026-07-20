# Project Rules: Webwaldorfv2

## Reglas de Arquitectura de Admisión (Doble Embudo)
- **Prohibición de Google Forms:** Nunca utilizar Google Forms para procesos de admisión, ya que rompen el ecosistema de tracking (Meta Pixel). Todo formulario debe ser nativo en Next.js.
- **Topología de Doble Embudo:**
  1. **Tráfico Frío (Baja Fricción):** La ruta `/admision` debe mantenerse con un formulario ultra-rápido (Nombre, WhatsApp, Email, Curso) enfocado en capturar leads desde Instagram Ads.
  2. **Tráfico Caliente (Alta Fricción):** La ruta `/postular` contiene el formulario exhaustivo de 6 pasos (datos familiares, NEE, traslados). Este enlace es privado y solo se envía por WhatsApp a prospectos filtrados.
- **Serialización de Datos (CRM):** Para evitar migraciones complejas en Supabase, los datos exhaustivos del formulario `/postular` se serializan en texto plano dentro de la columna `curso_postula` y se envían formateados vía Resend al equipo de admisión.

## Reglas de Diseño de Interfaz (High-End Waldorf)
- **Footer Minimalista (Monograma):** Nunca colocar el logo ilustrado (Árbol) completo en el Footer. El Header lleva el logo completo, mientras que el Footer debe usar exclusivamente un Monograma Tipográfico (ej. una "T" dentro de un círculo) para mantener un diseño editorial, limpio y de alta gama.

## Reglas de Marketing y Algoritmo Meta (Instagram/Facebook Ads)
- **Categorización de Cuenta:** La cuenta de Instagram DEBE estar categorizada como `Colegio` o `Escuela` (nunca como emprendedor/educación general) para activar el algoritmo geo-localizado de Meta hacia padres de familia.
- **Link in Bio Estratégico:** El enlace principal debe ser SIEMPRE la ruta de baja fricción `/admision` (primer lugar en LinkTree o enlaces de perfil) para disparar el Meta Pixel con conversiones de bajo costo.
- **Tipología de Interacción:** Priorizar la creación de contenido "Guardable" (tips de crianza Waldorf) o "Compartible" sobre contenido diseñado solo para likes. Responder a los comentarios en la primera hora de publicación.
- **Fórmula de Hashtags (3-3-3):** Los posts deben usar entre 9 y 12 hashtags máximo.
  1. Geográficos exactos (ej. `#PuertoVaras`, `#ParqueIvian`).
  2. Nicho local (ej. `#MamasPuertoVaras`).
  3. Temáticos educativos (ej. `#PedagogiaWaldorfChile`). Nunca usar hashtags masivos globales como `#Educacion`.
- **Accesibilidad y Alt Text:** Inyectar siempre "Alt Text" en las imágenes de Instagram ("Niños felices en el Colegio Waldorf Trekan en Puerto Varas") para maximizar el SEO algorítmico.
