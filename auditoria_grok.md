# Auditoría técnica completa — Colegio Waldorf Trekan

| Campo | Valor |
|--------|--------|
| **Fecha** | 2026-07-18 |
| **Repositorio** | `Webwaldorfv2` |
| **Producto** | Sitio público + panel admin/CRM del Colegio Waldorf Trekan (Puerto Varas) |
| **Stack** | Next.js 14.2.35 (App Router), React 18.3, TypeScript, Tailwind CSS 4, Supabase, Framer Motion, GSAP, Lenis, Playwright |
| **Dominio canónico** | `https://www.colegiowaldorftrekan.cl` |
| **Alcance** | UI, UX, componentes, arquitectura, SEO (y notas transversales de performance, accesibilidad y deuda operativa) |
| **Método** | Revisión estática del código fuente, estructura de rutas, metadata, componentes de presentación, APIs, admin y assets |

> **Nota:** Existe un informe previo centrado en seguridad (`reporte_auditoria_grok.md`, 2026-07-16). Este documento es una auditoría de producto y calidad de frontend/arquitectura. Cuando un hallazgo de seguridad impacta UX o arquitectura, se menciona de forma breve.

---

## 1. Resumen ejecutivo

El proyecto es un **sitio marketing de alto diseño** (estética editorial / Awwwards) para un colegio Waldorf, con un **backoffice amplio** (CMS de portada, noticias, actividades, CRM de admisiones, RAG, campañas, etc.) construido sobre Supabase.

### Veredicto global

| Dimensión | Nota (1–10) | Lectura |
|-----------|-------------|---------|
| **UI / diseño visual** | **8.5** | Identidad visual madura, tipografía fluida, paleta coherente, hero cinematográfico |
| **UX / conversión** | **6.5** | Buen embudo conceptual, pero home demasiado larga, widgets confusos y fricción por animaciones |
| **Componentes** | **6.0** | Muchos bien resueltos; mezcla de código muerto, duplicados y monstruos admin |
| **Arquitectura** | **5.0** | App Router bien usado en público; admin es un fork de “Clínica GAP” a medio migrar |
| **SEO** | **7.0** | Metadata, JSON-LD, landings por ciudad y redirects bien pensados; gaps en sitemap, OG y cache |
| **Accesibilidad** | **4.5** | Pocas `aria-*`, cursor custom hostil, sin `prefers-reduced-motion` |
| **Performance percibida** | **4.0** | Video splash + hero video + ~17 secciones client-side + `revalidate = 0` |

**Estado general:** producto **visualmente fuerte y con intención de conversión clara**, pero lastrado por **deuda de arquitectura (fork clínico)**, **peso de la home**, **admin inconsistente** y **gaps de SEO técnico / a11y**.

### Top 10 hallazgos (priorizados)

| # | Prioridad | Hallazgo | Impacto |
|---|-----------|----------|---------|
| 1 | **P0** | Home monstruo: ~17 secciones client-heavy + video splash + video hero + Lenis/GSAP/Framer | LCP, TBT, abandono móvil |
| 2 | **P0** | `revalidate = 0` en home, noticias, ciudades, actividades | Sin ISR; cada visita pega a Supabase |
| 3 | **P0** | Admin heredado de clínica (“LeónAdmin”, pacientes, kanban clínico) mezclado con Panel Trekan | Confusión operativa, APIs fantasma |
| 4 | **P1** | Fuentes Quicksand/Merriweather declaradas pero **no cargadas** (`next/font` ausente) | FOUT/FOIT, branding inconsistente |
| 5 | **P1** | Sitemap sin slugs de noticias; landings ciudad con OG débil | SEO de contenido y social incompleto |
| 6 | **P1** | Custom cursor global + `cursor: none` en desktop | UX/accesibilidad; problemas en formularios |
| 7 | **P1** | IDs de ancla duplicados (`#admision`, `#quienes-somos`) | Navegación interna rota o impredecible |
| 8 | **P1** | Tres widgets de contacto (AIChat form, FloatingWhatsApp, WhatsAppWidget) | Ruido UI; tests desalineados |
| 9 | **P2** | Share buttons en noticias sin handlers | Feature visual muerta |
| 10 | **P2** | Assets locales ~194 MB (`public/images` + `public/assets`) en el repo | Deploy pesado; oportunidad CDN completa |

---

## 2. Mapa del sistema (as-is)

```
[Visitante]
   │
   ├─ /                    Home CMS (homepage_content) + 17 secciones
   ├─ /admision            Admisión 2026 (client)
   ├─ /arriendo-salon      Cotizador de salón (client)
   ├─ /noticias, /noticias/[slug]   Markdown + Supabase
   ├─ /actividades, /recursos
   ├─ /colegio-waldorf-:ciudad  → rewrite → /ciudades/[ciudad]  (SEO local)
   │
   ├─ Widgets globales: LiquidSplash, CustomCursor, AIChatWidget, grain overlay
   ├─ Tracking: GTM (GTM-NWT7GVSD), Meta Pixel, Google Translate headless
   │
   └─ APIs públicas: /api/leads, /api/contacto, /api/cotizacion, /api/chat, …

[Admin /admin/*]
   │  Middleware Supabase + emails hardcodeados / user_metadata.role
   ├─ Layout "Panel Trekan" (6 ítems de nav)
   ├─ Sidebar legacy "LeónAdmin" (pacientes, clínicas, push…) — código paralelo
   └─ Páginas que llaman APIs inexistentes (/api/services, /api/patients, …)

[Datos]
   Supabase (Auth, DB, Storage CDN) · _noticias/*.md (fallback FS)
   Resend / Nodemailer · Firebase Admin · Cohere/Groq/Gemini (IA)
```

### Superficie de rutas públicas

| Ruta | Tipo | Rol de negocio |
|------|------|----------------|
| `/` | Server + muchos clients | Conversión principal |
| `/admision` | Client page + metadata | Embudos de matrícula |
| `/arriendo-salon` | Client + cotizador | Ingreso secundario (salón) |
| `/noticias`, `/noticias/[slug]` | Server + markdown/CMS | Contenido + SEO |
| `/actividades` | Server | Calendario comunitario |
| `/recursos` | Server estático | Link equity / autoridad temática |
| `/colegio-waldorf-{ciudad}` | Rewrite SEO local | Captura de intención geográfica |
| `/login`, `/admin/*` | Auth | Backoffice |

---

## 3. UI (diseño visual y sistema)

### 3.1 Fortalezas

1. **Sistema de color Waldorf bien definido** en `app/globals.css` (`@theme`):
   - Cream `#FAF9F6`, paper, sage, moss, terracotta, mustard, text.
   - Tokens reutilizados de forma consistente en Navbar, Footer, Hero y secciones.
2. **Tipografía fluid** con `clamp()` para hero y H2 (`--text-fluid-hero`, `--text-fluid-h2`).
3. **Estética editorial** en noticias (`/noticias/[slug]`): layout split tipográfico + fotográfico, prose custom, CTA final de admisión.
4. **Microinteracciones de marca**: MagneticButton, film grain (`.awwwards-noise`), glassmorphism claro (`.glass-light`), sombras terrosas.
5. **Logo optimizado** con `next/image` y `priority` en Navbar.
6. **Respuesta visual al scroll** (parallax hero, TextReveal, indicadores de “Descubrir”).

### 3.2 Debilidades de UI

| Hallazgo | Detalle | Recomendación |
|----------|---------|---------------|
| Fuentes fantasma | Layout asigna `font-sans` / `font-serif` a variables vacías (`quicksand`/`merriweather` son stubs). CSS espera Quicksand y Merriweather pero no hay `next/font` ni `<link>` a Google Fonts. Solo Antroposofia se carga vía `@font-face`. | Cargar con `next/font/google` (Quicksand + Merriweather) o self-host WOFF2. |
| Typo de token | Admin usa `var(--color-waldorf-terracota)` (sin segunda “r”); el token real es `terracotta`. | Unificar tokens; lint de CSS vars. |
| Footer logo placeholder | Círculo con “T” en lugar del logo real. | Usar `logo-mini.webp` como en Navbar. |
| Dark splash vs cream brand | Splash a pantalla completa en negro y hero `#0A0A10` contrastan fuerte con el resto cream/paper. | Aceptable como “cinema”, pero acortar splash (máx. 3–4s) o ofrecer skip. |
| Inconsistencia de hex hardcodeados | Muchos componentes usan `#2C3E35`, `#D35D3E`, `#FAF8F5` en vez de tokens. | Migrar a CSS variables del design system. |
| Admin dual-brand | “Panel Trekan” (layout) vs “LeónAdmin” cyan (Sidebar legacy). | Eliminar Sidebar legacy o unificar 100% Trekan. |

### 3.3 Design system (estado)

| Elemento | Estado |
|----------|--------|
| Colores | Parcialmente sistematizado (`@theme`) |
| Spacing / radii | Ad-hoc (rounded-2xl/3xl, py-24/32) |
| Componentes UI base | No hay `Button`, `Input`, `Card` reutilizables; todo inline Tailwind |
| Iconografía | Lucide (consistente) |
| Motion | Framer + GSAP + Lenis sin capa de “motion tokens” ni reduced-motion |

**Recomendación:** extraer un kit mínimo (`Button`, `SectionHeader`, `Card`, `Input`, `Modal`) antes de seguir creciendo secciones.

---

## 4. UX (experiencia y conversión)

### 4.1 Embudo conceptual de la home (bien pensado)

El orden de `app/page.tsx` es una narrativa de conversión sólida:

1. **Despertar** — Hero + manifiesto (TextReveal)  
2. **Experiencia visual** — MasonryGallery  
3. **Camino educativo** — PedagogiaHorizontal + BentoGrid  
4. **Humano y ritmo** — Team, Trimembración, Comunidad, Actividades  
5. **Validación y filtro** — Testimonials, MicroSegmentador, DeslizadorCompromiso  
6. **Pulso actual** — Noticias + Instagram  
7. **Resolución** — FAQ, Contacto, Mapa, Transparencia radical  

Esto es **UX de storytelling** de calidad; el problema no es la lógica, es la **longitud y el peso**.

### 4.2 Problemas de UX

#### 4.2.1 Home demasiado larga (P0)

~17 bloques en una sola página. En móvil, el scroll es extremo. Riesgos:

- Abandono antes de FAQ/contacto.
- Competencia entre CTAs (Hero “Comenzar el Viaje”, MicroSegmentador, Contacto, chat flotante).
- SEO de “thin experience” percibido por usuarios aunque el contenido sea rico.

**Recomendación:**

- Mantener en home: Hero, 1 bloque pedagogía, galería, equipo, FAQ, CTA admisión, footer.
- Mover a rutas: Trimembración, transparencia radical, Instagram denso, segmentador largo.
- O usar “lazy sections” con `dynamic(() => import(...), { ssr: false })` + intersection observer.

#### 4.2.2 Splash de ~8–15s (P1)

`LiquidSplash` reproduce un video de marca y solo se oculta con `onEnded` o timeout de **15s**. El Hero espera el indicador de scroll a **9s**.

- Primera visita = fricción alta.
- No hay botón “Saltar”.
- No respeta `prefers-reduced-motion`.

**Recomendación:** splash ≤ 3s, skip visible, o solo en landing de campaña.

#### 4.2.3 Widgets de contacto superpuestos (P1)

| Widget | Archivo | Montado en |
|--------|---------|------------|
| Formulario “Hablemos” (lead) | `AIChatWidget.tsx` | `layout.tsx` (global) |
| WhatsApp flotante card | `FloatingWhatsApp.tsx` | No en layout (tests sí lo esperan) |
| WhatsApp simple | `WhatsAppWidget.tsx` | No en layout |

El nombre `AIChatWidget` es engañoso: es un **formulario de leads**, no un chat de IA. Los tests Playwright (`scroll.spec.ts`, `whatsapp.spec.ts`) buscan `aria-label="Contactar por WhatsApp"` / `"Abrir Chat"`, lo que sugiere **desalineación tests ↔ UI real**.

**Recomendación:** un solo FAB de contacto con menú (WhatsApp | Formulario | Llamar). Renombrar el widget. Actualizar tests.

#### 4.2.4 Custom cursor (P1)

- `CustomCursor` fuerza `cursor: none !important` en todo el documento (también en CSS global para `md+`).
- En inputs, selects y áreas de texto el cursor nativo es más usable.
- Puede interferir con trackpads, monitores táctiles híbridos y software de accesibilidad.

**Recomendación:** desactivar cursor custom en formularios y en `prefers-reduced-motion`; o limitarlo al hero.

#### 4.2.5 Smooth scroll (Lenis) (P2)

`SmoothScroll` (Lenis + GSAP ticker) se monta **por página**, no en root layout (aunque el layout lo importa sin usarlo — import muerto). Efectos:

- Anclas `#contacto` pueden sentirse “flotantes”.
- Posible conflicto con scroll nativo del navegador y focus management.
- Coste de JS en cada página.

#### 4.2.6 Anclas rotas / ambiguas (P1)

| Ancla | Dónde se define | Problema |
|-------|-----------------|----------|
| `#admision` | `MicroSegmentador` **y** `AdmisionSection` | ID duplicado; el browser salta al primero en DOM |
| `#quienes-somos` | `TeamSection` **y** `MissionSection` | Idem (MissionSection parece no montada en home actual) |
| `#pedagogia` | `BentoGrid` | OK |
| Navbar “Admisión → Valores” | `/admision` | OK |
| Footer “Admisión 2026” | `/#admision` | Puede no llevar a aranceles reales |

#### 4.2.7 MicroSegmentador y DeslizadorCompromiso (P2)

Buenos como **filtros de intención** (califican al prospecto). Riesgos UX:

- Multi-step sin progreso numérico claro ni “atrás” en todos los flujos.
- Al final dependen de WhatsApp; si el usuario no tiene WA, el embudo muere.
- No hay persistencia del segmentado en CRM (salvo que se derive a form).

#### 4.2.8 Transparencia radical (Mineduc) (positivo)

FAQ y sección de transparencia abordan el **no reconocimiento oficial del Mineduc** con enlaces a Ayuda Mineduc y estudios. Esto es **excelente UX ética** y reduce objeciones en admisión. Mantener visible y actualizado.

#### 4.2.9 Share en noticias (P2)

Botones “En Facebook / WhatsApp / Copiar enlace” **sin `onClick`**. Pura decoración.

#### 4.2.10 Admin UX (P1)

- Layout Trekan solo lista 6 módulos; el resto de rutas (`/admin/pacientes`, `/admin/campanas`, …) existen pero no están en la nav principal.
- Sidebar legacy habla de “Kanban Clínico”, “Pacientes”, “Benjamín León” — **totalmente fuera de dominio Trekan**.
- Varias pantallas llaman APIs que no existen (`/api/services`, `/api/patients`, `/api/campaigns`, `/api/push`, `/api/upload`).
- Tipografía/colores admin grises genéricos, no alineados al design system público.

### 4.3 Flujos de conversión (evaluación)

| Flujo | Calidad | Notas |
|-------|---------|-------|
| Hero → `#admision` (MicroSegmentador) | Media | Ancla ambigua; no es la página de aranceles |
| Formulario AIChatWidget → `/api/leads` → WhatsApp | Buena | Escape HTML en API; pixel Lead; WA prefill |
| ContactSection → `/api/contacto` | Buena | Estados loading/success/error claros |
| AdmisionForm | Buena | Labels con `htmlFor`; validación básica |
| Cotizador salón | Buena (negocio) | Playwright cubre escenarios de precio y fechas |
| Landing ciudad → misma home | Media | Banner SEO útil; poco contenido diferenciado |

---

## 5. Componentes

### 5.1 Inventario (público)

| Componente | LOC (aprox.) | Rol | Notas |
|------------|--------------|-----|-------|
| `CotizadorSalon` | 313 | Arriendo | Más complejo del front; bien acotado |
| `MicroSegmentador` | 238 | Qualifier | Multi-step |
| `AdmisionClient` | 235 | Página admisión | Página casi monolitica client |
| `ComunidadSection` | 220 | Storytelling | |
| `AIChatWidget` | 213 | Lead capture global | Nombre engañoso |
| `PedagogiaHorizontal` | 209 | Pedagogy | Scroll horizontal |
| `Hero` | 200 | Above the fold | Video/YT/img |
| `ContactSection` | 184 | Form + vCard | |
| `Navbar` | 166 | Nav + i18n Google | Dropdowns hover/click |
| `FAQSection` | 151 | FAQ a11y parcial | Mejor del set en a11y |
| `NewsSection` | 139 | Listado home | |
| `BentoGrid` | 136 | Pilares | `id=pedagogia` |
| `MasonryGallery` | 129 | Galería + lightbox | aria labels OK |
| Resto | <120 | Efectos / secciones | |

### 5.2 Patrones positivos

- **Server Components donde importa**: home, noticias, actividades fetch en servidor.
- **Props CMS**: Hero y Masonry reciben `data` desde `homepage_content`.
- **FAQ** con `aria-expanded`, `aria-controls`, `role="region"`.
- **MasonryGallery** con `aria-label` en controles lightbox.
- **ActividadRow / noticias** usan `next/image` + `loading="lazy"` en listados.
- **Fallback resiliente**: si Supabase falla, se usa markdown en `_noticias`.

### 5.3 Problemas de componentes

1. **Client-side por defecto en casi todo lo visual**  
   Framer Motion obliga `'use client'`. Casi toda la home es un grafo de clients → hidratación pesada.

2. **Tipado débil**  
   `data?: any`, `displayNews: any[]`, markdown parser casero. `types/index.ts` modela **chat clínico** (HOT/WARM/COLD, dolencia, comuna), no el dominio colegio.

3. **Código muerto / paralelo**  
   - `FloatingWhatsApp`, `WhatsAppWidget`, `MissionSection`, `AdmisionSection` (parcial), `components/admin/Sidebar` (LeónAdmin).  
   - `SmoothScroll` importado en `layout.tsx` y no renderizado.

4. **Duplicación home ↔ ciudades**  
   `app/ciudades/[ciudad]/page.tsx` copia casi toda la composición de home (mismos imports y fetch). Debería ser un layout/composición compartida.

5. **Markdown parser propio** en `lib/markdown.ts`  
   Reemplaza `gray-matter` en runtime (aunque `gray-matter` sigue en deps y en `serverComponentsExternalPackages`). Parser frágil (YAML multi-línea, arrays).

6. **Monolitos admin**  
   `admin/cms-ia/page.tsx` ~1300 líneas; `settings`, `campanas`, `servicios` 450–500 líneas. Inmantenibles sin modularizar.

7. **Imágenes con `<img>` nativo** en Hero (fallback) y varios admin → sin optimización Next.

### 5.4 Matriz de madurez por área de componentes

| Área | Madurez | Comentario |
|------|---------|------------|
| Marketing / storytelling | Alta | Diseño y motion cuidadosos |
| Formularios públicos | Media-alta | Funcionan; poca validación client/Zod unificada |
| CMS portada | Media | Server actions en portada; resto client+fetch |
| CRM admisiones | Media | Tabla `leads_admision`; UI simple |
| RAG / bot / campañas | Baja | Superficie grande, APIs incompletas, dominio clínico |
| Design system | Baja | Sin librería de primitivos |

---

## 6. Arquitectura

### 6.1 Lo que está bien

- **App Router** con separación clara `app/` + `components/` + `lib/` + `utils/supabase/`.
- **Supabase SSR** (`@supabase/ssr`) con client browser, server y middleware de sesión.
- **Rewrites SEO** `/colegio-waldorf-:ciudad` → `/ciudades/:ciudad` + `generateStaticParams`.
- **Redirects** legacy (`/postula` → `/admision`, `/recursos-waldorf-chile` → `/recursos`).
- **CMS parcial** de homepage (`homepage_content`) + noticias en DB.
- **Dual content source** (DB + markdown) con merge por fecha.
- **Playwright** presente (hero, masonry, scroll, whatsapp, scenarios, combinations).
- **TypeScript strict** habilitado.

### 6.2 Deuda arquitectónica principal: fork clínico

El repositorio mezcla **Colegio Trekan** con restos de un producto de **clínica / “León Admin”**:

| Señal | Ubicación |
|-------|-----------|
| “Kanban Clínico”, “Pacientes y Fichas”, “Portal Paciente” | `components/admin/Sidebar.tsx` |
| Branding “LeónAdmin”, usuario “Benjamín León” | Mismo archivo |
| Tipos `dolencia`, clasificación HOT/WARM/COLD clínica | `types/index.ts`, `lib/ai.ts` |
| Páginas `/admin/pacientes`, `finanzas`, `servicios`, `push` | `app/admin/*` |
| Webhooks Meta pensados como bot de mensajería clínica | `app/api/webhook/meta` |
| APIs referenciadas que no existen en `app/api` | settings, campanas, servicios, pacientes, push |

Esto no es solo estética: **aumenta superficie de ataque, confunde a operadores y rompe el modelo mental del producto**.

**Recomendación estratégica:**  
Definir un **core Trekan v1** (portada, noticias, actividades, admisiones CRM, recursos, arriendo) y **archivar o borrar** el resto en una rama `legacy-clinica`.

### 6.3 Capas y dependencias

```
UI (components/*)
   ↓ fetch / server props
App Router (app/*)
   ↓
lib/*  (ai, embeddings, markdown, email, firebase, auth)
   ↓
Supabase | Resend | Groq/Cohere/Gemini | Firebase
```

Problemas:

- **Múltiples clientes Supabase**: `utils/supabase/*`, `lib/supabase.ts`, `lib/supabase-admin.ts`, y creates ad-hoc en kanban/webhooks con service role.
- **Leads en varias tablas** (`leads_admision`, `chat_leads`, posibles leads del bot) → CRM fragmentado.
- **`vercel.json` vacío** — sin headers de seguridad, crons documentados, ni regiones.
- **Middleware corre en casi todas las rutas** (matcher amplio) solo para refrescar sesión; coste en edge en cada request pública.

### 6.4 Caching y datos

```ts
export const revalidate = 0; // home, noticias, ciudades, actividades…
```

Efecto: **SSR dinámico siempre**. Correcto solo si el contenido cambia por minuto. Para un colegio, `revalidate = 60`–`300` o on-demand revalidation tras guardar en admin es más sano.

### 6.5 Seguridad (resumen cruzado)

No es el foco de este informe, pero afecta arquitectura:

- Auth admin por lista de emails + `user_metadata.role` (editable).
- Varias APIs históricas sin auth (el newsletter ya usa `requireAdmin` — mejora respecto al informe de seguridad previo).
- Webhooks con verificación incompleta.
- Password de setup en scripts (ver informe de seguridad).

### 6.6 Testing

| Aspecto | Estado |
|---------|--------|
| E2E Playwright | Presente; specs de UI y cotizador |
| unit tests | No hay |
| test-results en repo | Fallos previos commiteados / locales (ruido) |
| CI | No visible en repo (sin workflow GitHub Actions en el árbol revisado) |
| Alineación tests | Specs de WhatsApp/chat no coinciden con widget montado actual |

### 6.7 Dependencias notables

- Next **14.2.35** (parcheado respecto a 14.2.4 del informe anterior — bien).
- Tailwind **4** + `@tailwindcss/postcss`.
- `ai` / `@ai-sdk/*` para bot.
- `dotenv` en dependencies de runtime (mejor en devDependencies).
- `eslint-config-next` en dependencies (debería ser devDependency).
- Sin ESLint script config file visible más allá de `next lint`.

---

## 7. SEO

### 7.1 Fortalezas

1. **Metadata root sólida** (`app/layout.tsx`): title, description, keywords, canonical, Open Graph con imagen 1200×630, icons.
2. **JSON-LD** `EducationalOrganization` + `LocalBusiness` + `School` con address, geo, teléfono, sameAs, openingHours.
3. **`robots.ts`**: allow `/`, disallow `/admin/`, sitemap URL correcta.
4. **`sitemap.ts`**: home + secciones + 8 landings de ciudad con prioridad alta (0.9).
5. **Landings locales** con `generateMetadata` dinámico por ciudad y banner de confianza.
6. **Metadata por página** en admision, arriendo, recursos, noticias listado y `[slug]`.
7. **Canonicals** en páginas clave.
8. **Redirects 301** de URLs antiguas.
9. **Rewrites limpios** para URLs keyword-rich (`/colegio-waldorf-puerto-varas`).
10. **Contenido largo de valor** en FAQ (Mineduc, exámenes libres) y directorio `/recursos`.
11. **Idioma** `lang="es"` en `<html>`.
12. **GTM + Meta Pixel** para medición (complementa SEO con SEM/social).

### 7.2 Gaps y riesgos SEO

| # | Hallazgo | Severidad | Detalle |
|---|----------|-----------|---------|
| 1 | Sitemap sin artículos de noticias | **Alta** | Solo rutas fijas; Google no descubre automáticamente los ~17 markdown + DB posts |
| 2 | `revalidate = 0` | **Alta** | TTFB alto; peor crawl budget / Core Web Vitals |
| 3 | OG de ciudades usa `/assets/logo.png` | **Media** | No es imagen social 1200×630; preview pobre en WhatsApp/FB |
| 4 | Sin Twitter/X cards | **Media** | `twitter: card` no definido en metadata |
| 5 | Noticias: OG incompleto en `generateMetadata` | **Media** | Title/description/canonical sí; falta `openGraph.images` del post |
| 6 | Keywords meta | **Baja** | Google las ignora; no dañan, no ayudan |
| 7 | Google Translate | **Media** | Puede generar contenido hreflang “sucio”, DOM alterado, duplicados percibidos; no es i18n real |
| 8 | Contenido de landings ciudad casi clon | **Media** | Riesgo de thin/duplicate content; solo cambia H1/banner/texto parcial |
| 9 | Video LCP | **Alta** | Hero video y splash compiten con LCP; SEO local pierde si CWV fallan |
| 10 | Fuentes no cargadas | **Media** | CLS/FOUT y peor percepción de calidad |
| 11 | Imágenes con espacios en nombres | **Baja** | `fiesta de faroles2025.mp4`, etc. — URLs frágiles |
| 12 | JSON-LD `logo` apunta a PNG local | **Baja** | Preferir URL absoluta webp optimizado ya en CDN |
| 13 | H1 animado por palabras | **Baja** | Generalmente OK para crawlers modernos; verificar que el texto final esté en HTML |
| 14 | Admin no indexado | OK | `disallow: /admin/` correcto |
| 15 | Sin `manifest` / PWA metadata | **Baja** | Opcional |
| 16 | Email de contacto en footer abre Gmail compose | **Baja** | Peor UX que `mailto:`; no es SEO directo |

### 7.3 SEO de contenido

**Bien:**

- Enfoque semántico “Colegio Waldorf Puerto Varas / sur de Chile”.
- Blog/noticias de gobernanza y pedagogía (autoridad temática).
- Recursos externos + PDFs propios (dwell time, backlinks potenciales).

**Mejorable:**

- Incluir en sitemap todos los `slug` de noticias (Supabase + markdown).
- Páginas ciudad: 300–600 palabras **únicas** (cómo llegar desde Puerto Montt, transporte, familias de Frutillar, etc.) + FAQ local + mapa.
- Article schema (`BlogPosting`) en `/noticias/[slug]`.
- BreadcrumbList schema en interior.

### 7.4 SEO técnico — checklist

| Item | Estado |
|------|--------|
| HTTPS / dominio canónico | Asumido en prod (metadata OK) |
| robots.txt | OK |
| sitemap.xml | Parcial |
| Canonicals | Mayormente OK |
| Meta title/description | OK en rutas clave |
| Open Graph | Root OK; interior incompleto |
| JSON-LD Organization | OK |
| JSON-LD Article | Ausente |
| hreflang | No (Translate no cuenta) |
| Core Web Vitals | En riesgo (video + JS) |
| Imágenes next/image | Parcial |
| 404 útiles | Noticia not found básico; sin `not-found.tsx` global revisado |
| Headers seguridad (CSP, HSTS) | No en next.config / vercel.json |

---

## 8. Performance

### 8.1 Factores que degradan

1. **LiquidSplash** video full-screen desde Supabase Storage en primera visita.  
2. **Hero video** autoplay loop (o iframe YouTube 150vw).  
3. **Framer Motion** en decenas de componentes + Lenis + GSAP.  
4. **Custom cursor** listeners globales `mousemove`/`mouseover`.  
5. **Film grain** SVG filter fixed full viewport.  
6. **`revalidate = 0`** → sin HTML cacheado en CDN.  
7. **~194 MB** de media en `public/` (además de CDN Supabase): repo y deploys pesados.  
8. **GTM + Meta Pixel + Google Translate** en layout (third-party).  
9. Home importa **todas** las secciones de forma estática (sin code-splitting por sección).

### 8.2 Acciones de performance (ordenadas)

1. `revalidate = 300` (o tag-based revalidation al publicar).  
2. Splash opcional / ≤3s / skip.  
3. Hero: poster image + video lazy tras interacción o `preload="metadata"`.  
4. `dynamic()` para Instagram, Trimembracion, RadicalTransparency, Deslizador.  
5. `next/font` + subset.  
6. Convertir restos JPG grandes a WebP/AVIF en CDN; limpiar `public/images` duplicados.  
7. Quitar o condicionar CustomCursor.  
8. Evaluar quitar Lenis en móvil.  
9. `prefers-reduced-motion: reduce` → desactivar parallax y autoplay no esencial.

---

## 9. Accesibilidad (a11y)

| Criterio | Estado |
|----------|--------|
| `lang="es"` | OK |
| Contraste cream/moss | Generalmente bueno; hero white/60 sobre video puede fallar |
| Focus visible | Comprometido por `cursor: none` y estilos custom |
| Skip link | Ausente |
| Landmarks | `main`/`nav`/`footer` parciales; FAQ bien |
| Formularios | Algunos `htmlFor`; AIChatWidget revisar labels |
| Teclado en dropdowns Navbar | Hover-first; click en touch OK; sin teclas flecha |
| Motion | Sin `prefers-reduced-motion` |
| Alt texts | Presentes en logos y varias imágenes; Hero fallback genérico |
| Live regions en forms | No (success solo visual) |

**Prioridad a11y:** skip-to-content, focus rings, reduced-motion, labels en AIChatWidget, no ocultar cursor en inputs.

---

## 10. Admin / CMS (UX y arquitectura)

### 10.1 Panel Trekan actual (layout)

Navegación real del layout:

- Dashboard `/admin`
- Portada `/admin/portada`
- Admisiones CRM `/admin/admisiones`
- Noticias/SEO `/admin/noticias`
- Actividades `/admin/actividades`
- Prospectos `/admin/prospectos`

Esto es un **MVP CMS razonable** para un colegio.

### 10.2 Superficie sombra (legacy)

Más de 15 rutas admin adicionales con UI clínica o genérica. Muchas dependen de endpoints que **no están en `app/api`**. Resultado: pantallas que cargan en error o vacías.

### 10.3 Recomendación de producto admin

**Mantener:** portada, noticias (+ newsletter auth), actividades, admisiones, prospectos, cerebro RAG (si se usa el chat), settings de marca.  

**Eliminar o aislar:** pacientes, kanban clínico, servicios/tarifario clínico, finanzas genéricas, push, campanas (hasta tener API), cms-ia monstruo, Sidebar León.

---

## 11. Fortalezas del proyecto (para no perder de vista)

1. Identidad visual diferenciada y coherente con pedagogía Waldorf.  
2. Narrativa de home orientada a conversión y educación del prospecto.  
3. Transparencia sobre estatus Mineduc (confianza).  
4. SEO local por ciudad con URLs amigables.  
5. CMS de portada y noticias con fallback markdown (resiliencia).  
6. Integración leads → CRM + email + WhatsApp + Meta Pixel.  
7. Cotizador de salón con lógica de negocio y tests.  
8. Stack moderno (App Router, Supabase SSR, Tailwind 4).  
9. Next ya en 14.2.35 (mejor postura de seguridad que 14.2.4).  
10. Contenido editorial de calidad en `_noticias`.

---

## 12. Plan de acción recomendado

### Fase 0 — Estabilizar (1 semana)

- [ ] Inventariar y **archivar rutas admin legacy** (o 404 controlado).  
- [ ] Alinear Playwright con el widget real.  
- [ ] Corregir IDs duplicados `#admision` / `#quienes-somos`.  
- [ ] Cargar fuentes con `next/font`.  
- [ ] Añadir noticias al `sitemap.ts`.  
- [ ] `revalidate` > 0 en páginas públicas.

### Fase 1 — Performance y UX (2 semanas)

- [ ] Acortar/skip splash; poster en hero.  
- [ ] Unificar FAB de contacto.  
- [ ] Desactivar custom cursor en forms / reduced-motion.  
- [ ] Code-split secciones below-the-fold.  
- [ ] Compartir composición Home/Ciudad.  
- [ ] OG images correctas en ciudades y posts.

### Fase 2 — Arquitectura limpia (2–4 semanas)

- [ ] Un solo cliente Supabase server/admin.  
- [ ] Modelo único de leads.  
- [ ] Primitivos UI + tokens únicos.  
- [ ] Modularizar admin CMS.  
- [ ] Headers de seguridad en `next.config` / Vercel.  
- [ ] CI: lint + playwright smoke en PR.

### Fase 3 — SEO de contenido (continuo)

- [ ] Textos únicos por ciudad (300+ palabras).  
- [ ] `BlogPosting` + breadcrumbs.  
- [ ] Auditoría Search Console / CWV de campo.  
- [ ] Evaluar i18n real (next-intl) vs quitar Google Translate.

---

## 13. Matriz de scores detallada

| Subárea | Score | Comentario breve |
|---------|-------|------------------|
| Identidad visual | 9/10 | Muy sólida |
| Consistencia design tokens | 6/10 | Tokens + hex sueltos |
| Navegación pública | 7/10 | Clara; anclas mejorables |
| Mobile UX | 5/10 | Peso, scroll, widgets |
| Conversión admisión | 7/10 | Embudo rico; fricción técnica |
| Accesibilidad | 4.5/10 | Gaps serios de motion/cursor |
| Calidad de componentes | 6/10 | Buenos y muertos conviven |
| Arquitectura pública | 7/10 | App Router correcto |
| Arquitectura admin | 3.5/10 | Fork clínico |
| SEO on-page | 8/10 | Metadata y schema buenos |
| SEO técnico/CWV | 5/10 | Cache, media, JS |
| SEO local | 7.5/10 | Buena idea; thin content |
| Testing | 5/10 | E2E parcial, desalineado |
| Operabilidad CMS | 6/10 | Core OK; ruido legacy |
| **Promedio ponderado** | **~6.3/10** | Listo para pulir, no para “congelar” |

---

## 14. Conclusión

Colegio Waldorf Trekan tiene un **front de marketing por encima del promedio** del sector educación en Chile: storytelling, estética, transparencia y SEO local demuestran intención de producto alta. El techo de calidad está en:

1. **Simplificar la home y el peso de motion/video**,  
2. **Cerrar el capítulo del fork clínico en admin**,  
3. **Completar SEO técnico (sitemap de noticias, cache, OG, CWV)**,  
4. **Tratar accesibilidad y un solo camino de contacto** como requisitos, no extras.

Con la Fase 0 + Fase 1, el sitio puede pasar de “demo Awwwards pesada” a **producto de captación confiable, rápido y mantenible** sin renunciar a la identidad visual que ya es un activo del colegio.

---

*Generado por auditoría estática de código — 2026-07-18. No incluye mediciones Lighthouse de producción ni revisión de políticas RLS de Supabase en el dashboard.*
