# Project Rules: Webwaldorfv2

## 🛑 Regla Estricta de Gobernanza de Marca y Sitio Web (Anti-Alucinaciones)
- **Prohibición de Despliegue sin Aprobación:** Está ESTRICTAMENTE PROHIBIDO modificar el código fuente del sitio web (`Navbar.tsx`, `Footer.tsx`, `layout.tsx`, páginas, componentes, colores, tipografías o assets) con nuevas propuestas de marca hasta que Felipe y la comunidad fundadora den su aprobación formal y explícita.
- **Prohibición de Asumir / Inventar Decisiones:** Ningún agente debe dar por cerrado un proceso de diseño ni asumir que una propuesta es la definitiva solo porque se discutió o se generó. Cero suposiciones.
- **Estatus del Consolidado de los 4 Fundadores:** El brief de las 4 visiones (Sleater, Ivonne, Felipe, Gerard: «Cuidado que libera» / «Educamos para la vida» / Cobijo / Verde Raíz) es la **referencia estratégica en proceso de evaluación y validación**. Se mantiene como material de trabajo, NO como identidad inyectada en producción.
- **Aislamiento de Bocetos y Propuestas:** Todo activo de exploración o tablero visual debe permanecer aislado y no debe vincularse al código vivo de Next.js sin autorización directa.
- **Integridad y Salud de la Web:** Mantener siempre el sitio web compilando limpiamente (verificado 100% funcional con 52 páginas estáticas). No romper el tracking de Meta Pixel, formularios ni estilos actuales.

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



## Reglas de Marketing y Algoritmo Meta (Instagram/Facebook Ads)
- **Categorización de Cuenta:** La cuenta de Instagram DEBE estar categorizada como 'Colegio' o 'Escuela' (nunca como emprendedor/educación general) para activar el algoritmo geo-localizado de Meta hacia padres de familia.
- **Link in Bio Estratégico:** El enlace principal debe ser SIEMPRE la ruta de baja fricción '/admision' (primer lugar en LinkTree o enlaces de perfil) para disparar el Meta Pixel con conversiones de bajo costo.
- **Tipología de Interacción y Métrica Rey (Shares):** La métrica más potente para alcanzar no-seguidores es el "Envío por DM" (pesa 3 a 5 veces más que un like). Priorizar contenido altamente compartible sobre el diseñado solo para likes. Los "Llamados a la Acción" (CTAs) de fase ToFu deben enfocarse en compartir: "Envíale esto a una mamá que busque alternativas".
- **Límite Estricto de Hashtags (Regla 2026):** Instagram limita el uso a un máximo de 5 hashtags. Su propósito es dar contexto y ayudar a la búsqueda (SEO interno), no aumentar el alcance mágico. Usa entre 3 y 5 hashtags extremadamente precisos y locales (ej. '#PuertoVaras', '#PedagogiaWaldorfChile'). NUNCA excedas el límite ni uses hashtags genéricos.
- **Expectativas de Conversión Realistas:** NUNCA prometas que una optimización técnica llenará los cupos "en semanas". El proceso de decisión familiar toma tiempo y debe respetar estrictamente el Roadmap Operativo diseñado (ej. 3 meses). La optimización técnica solo abarata el costo de adquisición.
- **Accesibilidad y Alt Text:** Inyectar siempre 'Alt Text' en las imágenes de Instagram ('Niños felices en el Colegio Waldorf Trekan en Puerto Varas') para maximizar el SEO algorítmico.
- **Prohibición Estricta de Seguir a la Competencia (Estatus y Algoritmo):** Las cuentas operadas por la agencia (especialmente colegios o marcas de Alta Gama) NO deben seguir a sus competidores, ni siquiera a instituciones de su mismo rubro (ej. no seguir a otros Colegios Waldorf ni tradicionales).
  1. **Algoritmo:** Seguir colegios confunde a Meta, haciéndole creer que tu cuenta es de interés "B2B" (colegio a colegio), desviando tus anuncios de los padres reales.
  2. **Estatus:** Mantener un ratio de "Seguidos" ultra-bajo, compuesto exclusivamente por aliados locales (pediatras, centros de yoga, tiendas orgánicas), protege el posicionamiento premium (High-End). El Growth Engine solo hace *follow* a clientes finales o ecosistema de valor.

## Reglas de SEO para Blog y Web (Prohibición de Hashtags)
- **Prohibición de Hashtags en la Web:** NUNCA utilizar hashtags (ej. #Educacion) en los artículos del blog (archivos .md) ni en ningún componente de texto de Next.js. Esto confunde a los crawlers de Google y arruina el SEO Semántico.
- **GEO (Generative Engine Optimization):** En lugar de hashtags, el SEO de la web se basa estrictamente en la inyección de palabras clave de alto intento (long-tail) dentro de los párrafos, H1 y H2 (ej. 'Buscando colegios alternativos en Puerto Varas').

## Reglas de Interfaz de Usuario (UI/UX)
- **Sistemas Kanban y CRM:** NUNCA utilizar botones dentro de las tarjetas para mover elementos entre columnas. TODO sistema tipo Kanban (como Admisiones o Gestión de Tareas) debe implementarse estrictamente utilizando una experiencia de 'Arrastrar y Soltar' (Drag and Drop).
- **Librería Estándar:** Para implementar Drag and Drop en React/Next.js, utilizar SIEMPRE @dnd-kit/core y sus utilidades asociadas. Es el estándar moderno, ligero y accesible, preferido sobre react-beautiful-dnd.

## Regla de Excelencia Operativa y Uso de Recursos
Nunca limites las soluciones técnicas, ni evites instalar librerías o dependencias (npm, pip, CLI, etc.) asumiendo que el usuario tiene poco espacio en disco o capacidad de cómputo. El entorno tiene capacidad de sobra.
Ante cualquier solicitud de creación (presentaciones, webs, assets, scripts), asume SIEMPRE la ruta técnica que entregue el resultado de mayor calidad, más profesional y de estándar "Awwwards-level / High-End", sin importar la cantidad o el peso de las dependencias que deban ser instaladas para lograrlo.

## Reglas de Neurociencias y Mindfulness (Colegio Waldorf)
- **Marcadores Somáticos (Damasio):** Todo copy, diseño o estrategia Waldorf debe apuntar a crear un "marcador somático positivo" de calma, seguridad y contención (activación del Sistema Nervioso Parasimpático), en contraste con el estrés del sistema tradicional (Cortisol/Amígdala).
- **Regulación de la Working Memory (LeDoux):** La comunicación hacia los padres y el diseño UI/UX debe tener una carga cognitiva mínima. Cero sobreestimulación. Uso de espacios en blanco y lectura fluida para no abrumar la memoria de trabajo.
- **Interocepción y Presencia:** Fomentar narrativas que conecten la educación con el momento presente (mindfulness), enfatizando la importancia de los procesos lentos y el desarrollo de la "mente de principiante" en los niños.
- **Entorno Biopsicosocial:** Posicionar a la pedagogía Waldorf como un ecosistema que previene enfermedades psicosomáticas y el *Burnout* infantil, ofreciendo un refugio evolutivo alineado con las necesidades biológicas reales del cerebro humano (neuroplasticidad positiva).

## Reglas de Exportación de Datos (Business Standard)
- **Prohibición Absoluta de CSV:** SIEMPRE que se deba implementar un botón o funcionalidad de exportación de datos en una UI o un script (ej. "Exportar Leads", "Descargar CRM"), el formato OBLIGATORIO es Excel nativo (`.xlsx`). Está estrictamente prohibido usar o generar archivos `.csv`.
- **Implementación Técnica:** No dudes en instalar dependencias adicionales (como `xlsx` o `exceljs` en Node/Next.js, o `pandas`/`openpyxl` en Python) para construir el archivo Excel con formato correcto. El peso de las dependencias es irrelevante frente a la calidad del entregable para el cliente.

## Prevención de Código Redundante (Codebase E2E Audit)
- **Prohibición de Proponer sin Auditar:** ANTES de escribir cualquier propuesta estratégica para desarrollar una nueva página, componente o CRM, tienes la OBLIGACIÓN ESTRICTA de escanear el sistema de archivos (ej. `ls -R app/admin`) para verificar si el cliente ya lo construyó. NUNCA asumas vacíos funcionales basándote en que el usuario no lo mencionó en el chat. Si el usuario pide una solución, primero verifica exhaustivamente si el ecosistema actual ya la tiene implementada.

## Auditoría de Veracidad (Despliegues, Legal y Datos Históricos)
- **Despliegues vs. Entorno Local:** NUNCA afirmes que un problema de producción está "solucionado" solo porque editaste un archivo localmente mediante scripts o CLI. Siempre aclara al usuario que el cambio reside en su máquina local y requiere un commit/deploy explícito para afectar el entorno vivo.
- **Dictámenes Legales y de Privacidad:** NUNCA afirmes que un cambio de código "cumple con la ley" (ej. Ley de Datos Personales). Limítate estrictamente a describir los hechos técnicos verificables (qué datos se guardan, qué no se guarda, y a qué endpoints de terceros se envía la información).
- **Remediación de Datos Históricos:** Cuando el usuario pida corregir un bug que afectaba el almacenamiento de datos (ej. guardar mensajes privados por error), NUNCA des por terminado el trabajo solo arreglando la función de inserción futura. Es OBLIGATORIO auditar activamente la base de datos (ej. Supabase/SQL) buscando registros antiguos afectados y proponer su limpieza.


## Reglas de Generación de Voz (TTS) y Audio IA (Trekan)
- **Prohibición de Voz Comercial:** Todo audio generado por IA (Coqui XTTS, ElevenLabs, etc.) debe mantener el "Marcador Somático de Calma" y el principio de "Slow Living". Están prohibidas las voces rápidas, enérgicas o estilo locutor de radio/TikTok.
- **Ingeniería de Puntuación:** Para obligar a la IA a respetar la cadencia Waldorf, el texto NO debe escribirse de forma plana. Se deben usar puntos suspensivos (`...`) de manera abundante para forzar respiraciones profundas y pausas antes de los conceptos clave.
- **Audio de Referencia (Clonación):** La IA clona la emoción y velocidad de la referencia. El audio de referencia para TTS debe ser obligatoriamente un clip corto (6-8s) de alguien hablando *extremadamente lento y con pausas*.
- **Edición en Bloques:** El audio generado debe exportarse en fragmentos cortos e inyectar 1.5 a 2 segundos de silencio absoluto entre cada frase en el editor de video (CapCut/Premiere) para emular el "ritmo de la infancia".

## Regla Estricta Antialucinación de Contenido (Ficha de Hechos y [DATO PENDIENTE])
- **Prohibición Absoluta de Ficción Fáctica:** Al redactar copys, carruseles, guiones o cartas para Trekan, NUNCA inventes horarios (ej. "a las 8:47"), actividades específicas no confirmadas, porcentajes de aranceles ni nombres de niños.
- **Uso Obligatorio de [DATO PENDIENTE]:** Si un pedido requiere un dato que no esté explícitamente confirmado en la Ficha de Hechos o por Dirección, escribe obligatoriamente `[DATO PENDIENTE: qué falta]` y deja la variable para verificación humana.
- **Erradicación de Neuromitos y Pseudociencia:** No utilices términos científicos como argumento comercial ("la ciencia demuestra", "corteza prefrontal social", "cortisol por diseño"). La neurociencia se mantiene como marco de contención interno del equipo, no como eslogan de venta.
- **Lo que NO se genera:** Prohibido crear "Anti-anuncios" para pauta pagada, transmisiones en vivo (Lives) con niños no editables, y contenido nocturno manipulativo.

## Regla Estricta de Fuentes y Atribución en Publicaciones
- **Obligatoriedad de Fuentes:** Ningún artículo institucional, pedagógico o reflexivo del Colegio Trekan puede publicarse sin su bloque formal de cierre: `### Fuentes y Lecturas Recomendadas` (o `### Fuentes y Evidencia Científica` para piezas cognitivas/médicas).
- **Formato Estándar:** Cada fuente debe consignar: `* **Autor / Institución.** *Título de la obra en cursiva* (Editorial/Año o enlace)`.
- **Autores Canónicos:** En gobernanza y vida comunitaria, referenciar a Valentín Wember (*La gestión de la escuela*) y Rudolf Steiner. En neurociencia/desarrollo, citar estudios indexados (PubMed, AAP Pediatrics, ScienceDirect, UNESCO) evitando pseudociencia.
- **Autoría Visible:** Todo artículo debe declarar autor visible en cabecera (`Por: Equipo Pedagógico y Fundador` o autor individual) y en el frontmatter (`author: "..."`) para alimentar los esquemas JSON-LD BlogPosting y consolidar autoridad E-E-A-T en Google y buscadores de IA.

## Protocolo de Despliegue de Noticias (Sincronización Dual)
- **Local vs. Producción:** Crear un archivo `.md` en `_noticias/` actualiza el entorno local, pero `colegiovaldorftrekan.cl` en Vercel consume la tabla `noticias` de Supabase (ISR 60s) y el commit de GitHub.
- **Inyección Inmediata:** Al crear o modificar una noticia para producción, el agente DEBE ejecutar el script de upsert a Supabase `noticias` para que impacte la web viva en 1 minuto, y posteriormente solicitar o ejecutar el commit y push a GitHub para sincronizar el repositorio.

## Regla de Hitos Canónicos Waldorf Interescolares (Pentatlón)
- **Carácter Nacional e Interescolar:** Al redactar crónicas o contenidos sobre la Pentatlón de 5° básico (época de la Antigua Grecia, 11 años), NUNCA describirla como un torneo interno en el patio de Puerto Varas. Es un encuentro nacional interescolar (celebrado en San Felipe en 2026) que reúne a escuelas Waldorf de Chile.
- **Principio Panhelénico (Cero Rivalidad Escolar):** Enfatizar siempre que los niños no compiten «colegio contra colegio». Se integran en poleis griegas mixtas (Atenas, Esparta, Corinto, Delfos) conviviendo en campamento, cultivando la *Kalokagathia* y la hermandad panhelénica.

## Reglas de Social Sharing y Open Graph (Tarjetas Panorámicas)
- **URL Limpia en WhatsApp Share:** En los botones de compartir (`components/ShareButtons.tsx`), enviar siempre la URL limpia (`api.whatsapp.com/send?text=${url}`) sin anteponer títulos largos en la misma línea. Esto garantiza que el scraper de Meta despliegue la tarjeta panorámica de alta resolución (1200×630 px `summary_large_image`) en el 100% de los chats móviles y web.
- **Autoría Dinámica en Artículos:** Las barras laterales editoriales deben reflejar dinámicamente el autor definido en el frontmatter (`postAuthor`) y no textos estáticos hardcodeados.

## Regla CRO de Admisión: Selector Multicurso y Modo Hermanos
- **Fricción Cero en Móvil:** Reemplazar campos de texto libre para cursos por botoneras táctiles de chips/pills correspondientes a la oferta oficial de cursos.
- **Detección Dinámica de Hermanos:** Al seleccionar 2 o más cursos, el formulario debe activar el "Modo Hermanos", adaptando etiquetas y placeholders (ej. "Nombres y edades de tus hijos/as") y serializando de forma limpia (`Curso A, Curso B`) para alimentar tanto el mensaje de WhatsApp como la Matriz CRM de Quórum sin corromper el cálculo de vacantes.

## Protocolo Operativo Canónico de Entrega de Contenido (Paquete de 7 Elementos)
Toda solicitud de creación o preparación de contenido para Instagram (Reels, Posts o Carruseles) de Trekan DEBE entregarse invariablemente consolidada en el **Paquete Canónico de 7 Elementos** en un único bloque listo para copiar y pegar:
1. **Archivo y Formato:** Ruta local del video/foto, resolución 9:16 (1080×1920) a 24-30 fps, audio ambiente (100%) + música suave (-20 dB), tipografía editorial `Merriweather Bold`.
2. **Copy Principal (Caption):** Redactado bajo la fórmula de reducción de cortisol Waldorf (Hook humano -> Hecho real sin ficción -> Cierre fraterno -> CTA suave a bio/WhatsApp -> Estímulo a compartir por DM -> 3 a 5 hashtags específicos locales).
3. **Ubicación Geográfica Obligatoria:** `Puerto Varas, Chile`.
4. **Texto Alternativo (Alt Text):** Descripción literal y accesible para indexación visual de Meta.
5. **Portada Editorial:** Segundo exacto o fotograma libre de caras forzadas (estética Kinfolk/Patagonia).
6. **Primer Comentario Fijado 📌:** URL web directa para mantener el caption limpio de links rotos.
7. **Texto para Historias ✈️:** Frase breve y sticker para repostear con el avioncito a la comunidad existente.
*(Referencia completa en `docs/GUIA_OPERATIVA_PUBLICACION_CONTENIDO_INSTAGRAM.md`).*


