# Project Rules: Webwaldorfv2

## Reglas de Arquitectura de Admisión (Doble Embudo)
- **Prohibición de Google Forms:** Nunca utilizar Google Forms para procesos de admisión, ya que rompen el ecosistema de tracking (Meta Pixel). Todo formulario debe ser nativo en Next.js.
- **Topología de Doble Embudo:**
  1. **Tráfico Frío (Baja Fricción):** La ruta `/admision` debe mantenerse con un formulario ultra-rápido (Nombre, WhatsApp, Email, Curso) enfocado en capturar leads desde Instagram Ads.
  2. **Tráfico Caliente (Alta Fricción):** La ruta `/postular` contiene el formulario exhaustivo de 6 pasos (datos familiares, NEE, traslados). Este enlace es privado y solo se envía por WhatsApp a prospectos filtrados.
- **Serialización de Datos (CRM):** Para evitar migraciones complejas en Supabase, los datos exhaustivos del formulario `/postular` se serializan en texto plano dentro de la columna `curso_postula` y se envían formateados vía Resend al equipo de admisión.

## Reglas de Diseño de Interfaz (High-End Waldorf)
- **Footer Minimalista (Monograma):** Nunca colocar el logo ilustrado (Árbol) completo en el Footer. El Header lleva el logo completo, mientras que el Footer debe usar exclusivamente un Monograma Tipográfico (ej. una "T" dentro de un círculo) para mantener un diseño editorial, limpio y de alta gama.
