# Auditoría completa — Webwaldorfv2 (Colegio Waldorf Trekan)

| Campo | Valor |
|--------|--------|
| **Fecha** | 2026-07-16 |
| **Repositorio** | `Webwaldorfv2` |
| **Stack** | Next.js 14.2.4 (App Router), React 18, Supabase (Auth + DB + Storage), Tailwind 4, Groq/Cohere (IA/RAG), Resend/Nodemailer, Firebase Admin (push) |
| **Alcance** | Seguridad, arquitectura, datos/PII, rendimiento, calidad de código, deuda operativa |
| **Método** | Revisión estática del código, rutas API, middleware, scripts, dependencias (`npm audit`), configuración y patrones de auth/RLS |

---

## 1. Resumen ejecutivo

El proyecto es un sitio público de colegio + panel admin/CRM + bot/RAG + webhooks de mensajería y pagos, construido en Next.js sobre Supabase. Funcionalmente cubre landing, admisión, noticias, arriendo de salón y un backoffice amplio.

**Estado general: funcional, pero con superficie de ataque y deuda arquitectónica altas.**

Los problemas más graves no son de UI, sino de **confianza de seguridad**:

1. APIs administrativas y de coste (IA, newsletter, RAG, leads) **sin autenticación de servidor**.
2. Middleware de `/admin` con **autorización frágil** (emails hardcodeados + `user_metadata.role`).
3. **Contraseña de admin en el repositorio Git** (`scripts/create_admin.mjs`).
4. **Next.js 14.2.4 con vulnerabilidad crítica** y decenas de CVEs (cache poisoning, middleware bypass, DoS).
5. Código y módulos **heredados de Clínica GAP** (pacientes, templates, webhooks Meta, AI fallback) que confunden dominio y aumentan mantenimiento.
6. Cache desactivado en páginas públicas (`revalidate = 0`) y home muy pesada (muchos client components + video/animaciones).

### Matriz de riesgo (priorizada)

| Prioridad | Hallazgo | Impacto |
|-----------|----------|---------|
| **P0** | APIs abiertas (`/api/admin/rag`, `/api/seo`, `/api/newsletter`, `/api/chat`, webhooks sin firma) | Abuso de IA, spam masivo, manipulación de RAG/CRM, coste API |
| **P0** | Password admin versionado en Git | Compromiso de cuenta admin |
| **P0** | Next.js desactualizado (critical) | RCE/DoS/bypass según CVE |
| **P1** | Admin auth por emails hardcodeados / metadata editable | Escalada de privilegios |
| **P1** | Server Actions con service role sin re-chequeo de rol | Escritura no autorizada de CMS |
| **P1** | XSS por interpolación HTML en emails (cotización/leads) | Phishing interno / robo de sesión de correo |
| **P1** | Múltiples tablas de leads sin modelo unificado | Pérdida de datos, inconsistencia CRM |
| **P2** | `revalidate = 0` + home monolitica | Lento, coste serverless alto |
| **P2** | Código muerto / fork Clínica GAP | Complejidad, bugs silentes |
| **P2** | Sin headers de seguridad, sin rate limit | Endurecimiento básico ausente |
| **P3** | Scripts one-off, credenciales de scraping en `.env.local` | Riesgo operativo y legal |

---

## 2. Mapa del sistema (as-is)

```
[Visitante]
   │
   ├─► App Router público (/ , /admision, /noticias, /actividades, /arriendo-salon, /ciudades/…)
   │      └─► Supabase (anon) + fallback markdown
   │
   ├─► Widgets (AIChatWidget → /api/leads → Resend + DB)
   │
   └─► /api/chat (RAG Cohere + Groq stream)  ← público, sin rate limit

[Admin UI /admin/*]
   │  Middleware: sesión Supabase + emails hardcodeados / user_metadata.role
   ├─► Cliente Supabase anon (depende de RLS)
   └─► fetch a /api/*  (muchas rutas sin auth server-side)

[Webhooks]
   /api/webhook/meta | flow | mercadopago | google-forms
   (firma/verificación incompleta o ausente)

[Infra]
   Vercel (vercel.json vacío) · Supabase · Gmail SMTP · Resend · Groq · Cohere · Firebase
```

### Superficie API actual

| Ruta | Auth | Riesgo principal |
|------|------|------------------|
| `POST /api/chat` | No | Abuso IA + escritura leads + coste Cohere/Groq |
| `POST /api/leads` | No | Spam CRM + emails |
| `POST /api/cotizacion` | No | Spam SMTP + XSS en HTML de correo |
| `POST /api/seo` | No | Abuso Groq desde admin UI (pero API pública) |
| `POST /api/newsletter` | No | **Envío masivo a todos los leads** sin auth |
| `GET/POST/DELETE /api/admin/rag` | No | Lectura/escritura/borrado knowledge base |
| `GET /api/cron/keep-alive` | No | Endpoint público de health (bajo, pero ruidoso) |
| `POST /api/webhook/*` | Débil/nula | Inyección de leads o activación premium falsa |
| Referencias a `/api/patients`, `/api/campaigns`, `/api/cms`, `/api/rag/*`, `/api/push`, `/api/settings` | — | **Rutas referenciadas en admin que no existen en `app/api`** |

---

## 3. Vulnerabilidades y riesgos de seguridad

### 3.1 [CRÍTICO] Contraseña de administrador en el repositorio

**Archivo:** `scripts/create_admin.mjs` (trackeado por Git)

```js
const email = 'administracion@colegiowaldorftrekan.cl';
const password = 'Fviva*2026';
```

**Impacto:** cualquiera con acceso al repo (o historial Git) conoce credenciales de admin.

**Remediación inmediata:**
1. Rotar la contraseña en Supabase Auth **ahora**.
2. Eliminar el password del archivo; leer de env o generar y mostrar una sola vez.
3. Purgar del historial si el repo es/fue público (`git filter-repo` / BFG).
4. Añadir `scripts/create_admin.mjs` a `.gitignore` o reescribirlo sin secretos.

---

### 3.2 [CRÍTICO] APIs sensibles sin autenticación ni autorización

El middleware protege **páginas** `/admin/*`, no las **Route Handlers** bajo `/api/*`. Un atacante puede llamar las APIs directamente sin cookie de sesión.

#### `/api/admin/rag` — CRUD completo de knowledge chunks con service role

- `GET` lista todo el conocimiento del bot.
- `POST` inserta contenido + embeddings (coste Cohere).
- `DELETE` borra por `id`.
- Usa `supabaseAdmin` (bypass RLS).

#### `/api/newsletter` — broadcast masivo sin auth

- Lee emails de `chat_leads` y envía por Resend en batches BCC.
- Un atacante puede spammear la base de contactos o agotar cuota Resend.
- HTML interpola `title`, `excerpt`, `image_url` sin sanitizar (XSS en clientes de correo).

#### `/api/seo` — generación de artículos con Groq

- Cualquiera puede gastar la API key con prompts arbitrarios.

#### `/api/chat` — IA + RAG + upsert de leads

- Sin rate limit, sin captcha, sin límite de tamaño de `messages`.
- Vector search + rerank + LLM por request = vector de coste/DoS económico.
- Acepta `messages` del cliente sin validación Zod ni tope de tokens.

#### `/api/leads` y `/api/cotizacion`

- Inserción/email sin honeypot (a diferencia de `submitLead`), sin rate limit, sin validación estricta.
- Cotización arma HTML con `${data.nombre}`, etc. → **HTML injection en correo interno**.

**Remediación:**
- Helper `requireAdmin(request)` en todas las rutas admin (session + rol desde DB).
- Rate limiting (Upstash Redis / Vercel KV / middleware) en chat, leads, cotización.
- CAPTCHA o honeypot + Zod en todos los formularios públicos.
- Webhooks: verificar firmas (Meta `X-Hub-Signature-256`, Flow, Mercado Pago).

---

### 3.3 [CRÍTICO] Dependencias: Next.js 14.2.4 con advisory critical

`npm audit` reporta **1 critical + 7 moderate**, casi todas en `next@14.2.4`:

- Cache poisoning, middleware authorization bypass, DoS en Image Optimizer / RSC, SSRF en redirects, request smuggling en rewrites, etc.
- Fix sugerido: `next@14.2.35` (mínimo dentro de la línea 14.2.x); ideal evaluar 15.x con plan de migración.

**Acción:** actualizar `next` (y `eslint-config-next` si aplica) de inmediato; re-ejecutar build y E2E Playwright.

---

### 3.4 [ALTO] Autorización admin frágil

**Archivo:** `utils/supabase/middleware.ts`

```ts
const isAdmin =
  user.user_metadata?.role === 'admin' ||
  user.email === 'trekancomunicaciones2025@gmail.com' ||
  user.email === 'fvivancorne@gmail.com';
```

**Problemas:**
- `user_metadata` es **editable por el propio usuario** en muchos flujos de Supabase Auth (no usar para RBAC).
- Emails hardcodeados: rotación de personal requiere deploy; fuga de PII en el código.
- No hay tabla `profiles.role` / `app_metadata` (solo admin vía service role).
- Cualquier usuario autenticado que no sea admin es redirigido a `/`, pero las políticas RLS de CMS dicen `TO authenticated … USING (true)` → **cualquier cuenta registrada podría mutar noticias/actividades** si se crea un usuario no-admin.

**Políticas SQL revisadas** (`scripts/setup_cms.sql`):

```sql
CREATE POLICY "Allow authenticated full access to noticias"
ON public.noticias FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

Esto es equivalente a “cualquier login = editor total”.

**Remediación:**
- Roles en `auth.users.raw_app_meta_data` (solo service role) o tabla `profiles` con RLS.
- Policies: `auth.jwt() ->> 'role' = 'admin'` o `exists (select 1 from profiles where id = auth.uid() and role = 'admin')`.
- Quitar emails hardcodeados del middleware.

---

### 3.5 [ALTO] Server Action de portada sin verificación de identidad

**Archivo:** `app/admin/portada/actions.ts`

- Usa `SUPABASE_SERVICE_ROLE_KEY` para upsert de `homepage_content`.
- No llama a `supabase.auth.getUser()` ni valida rol.
- En Next.js, las Server Actions son invocables si se conoce el endpoint/ID de acción.

**Remediación:** al inicio de cada Server Action admin:

```ts
const supabase = await createClient() // server con cookies
const { data: { user } } = await supabase.auth.getUser()
if (!user || !(await isUserAdmin(user))) throw new Error('Unauthorized')
// luego usar admin client solo si hace falta bypass RLS
```

---

### 3.6 [ALTO] Webhooks sin verificación criptográfica

| Webhook | Problema |
|---------|----------|
| `meta` | Verify token con fallback `'tu_token_secreto'`; POST **sin** validar `X-Hub-Signature-256`. Cualquiera puede simular mensajes WhatsApp/IG. Logs dumpan body completo (PII en logs). |
| `google-forms` | Sin secret compartido; cualquiera inserta en `chat_leads` con service role. |
| `mercadopago` | No consulta API real de MP; **simula** `approved`. Sin firma de notificación. |
| `flow` | Consulta status (bien), pero no valida IP/origen del webhook; `listUsers()` completo para encontrar email (O(n), y expone patrón peligroso). |

**Código de dominio incorrecto en Meta:**

```ts
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://clinicagap.cl';
// mensaje por defecto: "Soy la IA de la clínica..."
```

Riesgo de reenviar tráfico a otro dominio o de respuestas de marca incorrecta.

---

### 3.7 [ALTO] XSS / inyección HTML en emails

Rutas que interpolan input de usuario en HTML:

- `app/api/cotizacion/route.ts` — `data.nombre`, `data.dias_detalle`, etc.
- `app/api/leads/route.ts` — campos del formulario.
- `app/actions/submitLead.ts` — similar (menor riesgo si Resend sanitiza, no confiar).
- `app/api/newsletter/route.ts` — `title`, `excerpt`, `image_url` (admin o atacante vía API abierta).

**Remediación:** escapar HTML (`escape-html` / template seguro) o usar componentes React-email; validar URLs de imagen (allowlist de host Supabase).

---

### 3.8 [MEDIO] Exposición y gestión de secretos

**Positivo:** `.env.local` está en `.gitignore`.

**Negativo / operativo:**
- `.env.local` concentra secretos de **múltiples negocios** (Trekan, cuentas ghost IG/FB, Apify de varias marcas, AdsPower, Gmail). Superficie de blast radius enorme si se filtra el archivo.
- Duplicado `COHERE_API_KEY`.
- Credenciales de redes sociales y scrapers en el mismo env del sitio público → riesgo legal (ToS de Meta) y de ban.
- No hay `.env.example` documentando variables requeridas sin valores.
- Scripts con service role (`create_admin`, `seed_rag`, `upload_to_supabase`) en el árbol principal.

**Recomendación:** separar secrets por proyecto (1Password/Vault + Vercel envs por environment); nunca mezclar cuentas “fantasma” de growth con el monorepo del colegio en producción.

---

### 3.9 [MEDIO] Cron keep-alive sin protección

`GET /api/cron/keep-alive` es público. En Vercel se recomienda validar `Authorization: Bearer ${CRON_SECRET}` o header `x-vercel-cron`.

`vercel.json` está vacío `{}` — el cron puede no estar configurado en repo (solo en dashboard), sin documentación en código.

---

### 3.10 [MEDIO] Headers de seguridad ausentes

`next.config.js` no define:

- `Content-Security-Policy`
- `X-Frame-Options` / `frame-ancestors`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `Strict-Transport-Security` (si no lo pone Vercel por defecto en custom domains)

Imágenes: `remotePatterns` permite `*.supabase.co` — correcto y acotado.

---

### 3.11 [MEDIO] Privacy / compliance (datos de menores y apoderados)

El sistema almacena:

- Nombres de niños, edades, NEE (necesidades educativas especiales), teléfonos y emails de apoderados.
- Canales: web, WhatsApp, Google Forms, chat bot.

**Implicaciones (Ley 19.628 / Ley 21.719 en Chile, y buenas prácticas):**
- Base legal y aviso de privacidad en formularios (no auditado en UI completa).
- Retención y derecho de eliminación.
- Acceso al CRM solo admin (hoy depende de RLS débil).
- Newsletter sin consentimiento explícito opt-in (envía a quienes “contactaron o postularon” — base legal débil para marketing).
- Logs de Meta webhook con mensajes completos y números de teléfono.

---

### 3.12 [BAJO–MEDIO] Otros

| Tema | Detalle |
|------|---------|
| Fallback Ollama a `127.0.0.1` | Irrelevante en Vercel; ruido en cascada de errores. Modelo `clinicagap-cm`. |
| Gemini API key en query string | Patrón de Google; preferir header si el API lo permite; no loguear URLs. |
| Resend `from: onboarding@resend.dev` | Funcional en sandbox; emails de admisión pueden ir a spam o fallar en prod. |
| Dual clients Supabase | `lib/supabase.ts` y `utils/supabase/client.ts` — inconsistencia. |
| `knowledge_chunks` policy `Allow public select` | Expone contenido del cerebro del bot a anon (puede ser intencional; documentar). |

---

## 4. Arquitectura — hallazgos y mejoras

### 4.1 Deuda de fork / código de “Clínica GAP”

El proyecto nació o se bifurcó de un producto clínico. Evidencia:

| Área | Síntoma |
|------|---------|
| `lib/emailTemplates.ts` | Templates y links a `clinicagap.cl` |
| `app/admin/pacientes` | CRUD de “pacientes”, mock data clínica |
| `app/api/webhook/meta` | Default URL clínica, copy de clínica |
| `lib/ai.ts` | Modelo Ollama `clinicagap-cm`; entidades `dolencia` en types |
| `types/index.ts` | `extractedEntities.dolencia` |
| Admin: `campanas`, `servicios`, `cms-ia`, `push`, `settings` | Llaman APIs inexistentes (`/api/campaigns`, `/api/services`, …) |
| Sidebar admin | Solo 6 ítems; el resto de páginas existen como “órfanas” |

**Impacto:** confusión de producto, bugs al desplegar features half-ported, peso de bundle/mantenimiento, riesgo de mostrar copy erróneo a familias.

**Mejora:**
1. Inventario “Trekan-core” vs “legado GAP”.
2. Eliminar o aislar en `/legacy` lo no usado.
3. Un solo dominio de lenguaje: **apoderados / postulantes / leads**, no pacientes.

---

### 4.2 Modelo de datos fragmentado (CRM)

Al menos **tres** destinos de leads:

| Origen | Tabla |
|--------|--------|
| `submitLead` / chat upsert | `leads` |
| Widget / `AdmisionForm` /api/leads | `leads_admision` |
| Google Forms webhook / Kanban | `chat_leads` |

**Consecuencias:** el admin de Admisiones no ve lo del bot; el newsletter solo lee `chat_leads`; reportes incompletos; duplicados por email.

**Propuesta de arquitectura de datos:**

```
contacts (id, email, phone, name, …)
  └─ opportunities / admissions (estado, curso, nino_*, source, …)
  └─ interactions (channel, message, created_at)
  └─ consent (newsletter, marketing, source)
```

Migración con vistas de compatibilidad temporal.

---

### 4.3 Capas de acceso a datos inconsistentes

Hoy coexisten:

1. Server Components + `utils/supabase/server`
2. Client Components + anon key + RLS
3. `supabaseAdmin` / service role en routes y actions
4. Instanciaciones locales `createClient(url, SERVICE_ROLE)` duplicadas en webhooks

**Target architecture:**

```
app/ (UI)
  → lib/services/* (reglas de negocio)
      → lib/db/supabase-server | supabase-admin
  → lib/auth/requireAdmin.ts
  → lib/validation/*.ts (Zod)
```

- Un solo factory admin.
- Nunca service role en client components (actualmente bien en la mayoría, mantenerlo).
- Mutations admin vía Server Actions o route handlers **siempre** con `requireAdmin`.

---

### 4.4 Admin UI sobredimensionado y desconectado

- **21** páginas bajo `app/admin`.
- Sidebar muestra ~6.
- `cms-ia/page.tsx` (~66 KB) es el archivo más grande del repo y depende de APIs no presentes.
- Kanban, pacientes, bot, finanzas, push, etc. en distinto estado de madurez.

**Mejora:**
- Definir MVP admin: Dashboard, Portada, Admisiones, Noticias, Actividades, Cerebro RAG, Settings.
- Archivar el resto o completar APIs + tests.
- Layout admin como Server Component + shell client solo para nav (ahora todo el layout es `'use client'`).

---

### 4.5 IA / RAG — diseño actual y límites

**Flujo chat:**

1. Upsert lead si hay email.
2. Embedding Cohere query.
3. RPC `match_knowledge_chunks` (threshold 0.2, top 10).
4. Rerank Cohere top 3.
5. Stream Groq Llama 3.3 70B.

**Problemas de diseño:**
- Cascada `lib/ai.ts` (Groq → OpenRouter → Gemini → Ollama) **no se usa** en `/api/chat` (solo ai-sdk + Groq). Código muerto / divergente.
- `/api/chat` devuelve stream de texto; webhook Meta espera **JSON** (`messageToUser`) → integración rota o inconsistente.
- Sin guardrails de prompt injection (“ignora el system prompt…”).
- Sin tope de historial de mensajes.
- Sin observabilidad (traces, coste por request).

**Mejoras:**
- Unificar pipeline IA (un módulo, un contrato de respuesta).
- Para WhatsApp: endpoint JSON no streaming, o adaptar el cliente Meta al stream.
- System prompt + “solo responde con base en RAG; si no sabes, deriva a WhatsApp Ivonne”.
- Métricas: tokens, latency p95, tasa de fallback.

---

### 4.6 Content pipeline

- CMS portada en JSON columns (`hero_section`, `text_reveal`, `masonry_gallery`).
- Noticias/actividades en tablas + fallback markdown local (`lib/markdown.ts` con parser YAML casero).
- `revalidate = 0` en home, ciudades, noticias, actividades → **sin ISR**.

**Mejora:** `revalidate = 60` (o on-demand `revalidateTag` al guardar en admin). Eliminar markdown legacy cuando Supabase sea fuente de verdad.

---

### 4.7 Testing

Existen Playwright specs (`tests/*.spec.ts`) orientados a UI (hero, scroll, WhatsApp, cotizador).

**Faltan:**
- Tests de auth/middleware (usuario no admin no entra).
- Tests de API (401 sin sesión en admin routes).
- Tests de validación de formularios / honeypot.
- CI (no hay workflow GitHub Actions visible en el árbol revisado).

---

### 4.8 Observabilidad y ops

- `console.log` abundante en webhooks (PII).
- Sin estructura de logging (nivel, request id).
- Sin Sentry/OpenTelemetry.
- Sin health check autenticado más allá del keep-alive de Supabase free tier.
- `package.json` name sigue siendo `"trekan-nextjs"` (ok), sin scripts de typecheck estricto en CI.

---

## 5. Optimizaciones (rendimiento, coste, DX)

### 5.1 Rendimiento web (Core Web Vitals)

| Problema | Detalle | Acción |
|----------|---------|--------|
| Home con `revalidate = 0` | SSR en cada visita + queries Supabase | ISR 60–300s + `revalidatePath` en admin |
| Muchos client components en home | GSAP, Framer, Lenis, cursor custom, video hero, marquee… | Code-split, `dynamic(() => import(), { ssr: false })` para below-fold |
| Video/imágenes pesadas en `public/` | `public/images` gitignored pero `public/assets` con muchos jpg/mp4; también CDN Supabase | Preferir CDN + `next/image`; posters para video; no cargar todos los assets de galería al inicio |
| Triple floating UI potencial | `AIChatWidget` en layout; también existen `FloatingWhatsApp` y `WhatsAppWidget` | Un solo CTA de contacto global |
| Fuentes | Variables CSS mock (`quicksand`/`merriweather` no usan `next/font`) | `next/font/google` para eliminar FOIT y requests extra |
| Custom cursor + liquid splash | Coste main-thread en móvil | Desactivar en `prefers-reduced-motion` y en touch devices |

### 5.2 Coste de infraestructura e IA

| Vector | Riesgo | Mitigación |
|--------|--------|------------|
| Chat público sin límite | Burn de Groq/Cohere | Rate limit IP + daily cap + cache embeddings frecuentes |
| Newsletter API abierta | Burn Resend + reputación | Auth admin + confirmación UI + dry-run |
| Keep-alive cada 5 min | Wakes free tier | Aceptable; o migrar a plan que no pause |
| `listUsers()` en Flow webhook | Escala mal | Índice por email en `profiles` |
| Embeddings por chunk en admin | OK si autenticado | Batch embed al reindexar |

### 5.3 Bundle y dependencias

- `firebase` + `firebase-admin` + `resend` + `nodemailer` + `ai` + `recharts` + `papaparse` + `react-email-editor` + dnd-kit: validar qué se usa en el path crítico del sitio público.
- Admin-only libs deben importarse solo en rutas admin (tree-shaking por route).
- Actualizar `next` a 14.2.35+; alinear `uuid` / postcss vía audit fix.

### 5.4 DX y calidad de código

| Mejora | Beneficio |
|--------|-----------|
| ESLint + Prettier + `tsc --noEmit` en CI | Evitar roturas |
| `.env.example` | Onboarding |
| Eliminar `scripts/one-off` del repo productivo o documentar “no deploy” | Ruido |
| Tipos estrictos en leads (no `any[]` en admin) | Menos bugs CRM |
| Unificar validación Zod (ya en `submitLead`) en todas las entradas | Seguridad + DX |
| Commits con mensajes `"ok"` | Adoptar Conventional Commits |

### 5.5 Imágenes y media

- Ya hay migración a Supabase CDN (comentario en `.gitignore` sobre `public/images/`).
- Completar: no versionar MP4 grandes; servir desde storage con CDN; tamaños responsive.
- `next/image` con `remotePatterns` ya configurado para Supabase.

---

## 6. Checklist de remediación recomendado

### Sprint 0 — emergencia (1–2 días)

- [ ] Rotar password `administracion@…` y cualquier otra cuenta expuesta.
- [ ] Quitar secretos de `scripts/create_admin.mjs`; rotar si hubo push a remoto compartido.
- [ ] Actualizar `next` a ≥ 14.2.35 y redesplegar.
- [ ] Proteger con `requireAdmin`: `/api/admin/rag`, `/api/seo`, `/api/newsletter`.
- [ ] Rate limit + validación Zod en `/api/chat`, `/api/leads`, `/api/cotizacion`.
- [ ] Añadir secret a webhooks Meta/Google Forms; dejar de simular pagos MP.
- [ ] Escapar HTML en templates de email.

### Sprint 1 — seguridad y datos (1 semana)

- [ ] RBAC real (`app_metadata` o `profiles.role`) + policies RLS admin-only en mutaciones.
- [ ] Auth en Server Actions (`saveHomepageContent` y futuras).
- [ ] Unificar tablas de leads o vista consolidada.
- [ ] Headers de seguridad en `next.config.js`.
- [ ] `CRON_SECRET` en keep-alive.
- [ ] Revisar consentimiento newsletter y texto legal en formularios.

### Sprint 2 — arquitectura (1–2 semanas)

- [ ] Podar admin/páginas/APIs de legado Clínica GAP.
- [ ] Unificar clientes Supabase y capa `lib/services`.
- [ ] Alinear contrato chat stream vs webhooks Meta.
- [ ] ISR + revalidación on-demand.
- [ ] CI: lint, typecheck, Playwright smoke, `npm audit`.

### Sprint 3 — producto y performance

- [ ] Optimizar home (dynamic imports, font, media).
- [ ] Observabilidad (Sentry + logs sin PII).
- [ ] Documentación `README` + `.env.example` + diagrama de datos.
- [ ] Tests de regresión en admisión y cotizador.

---

## 7. Fortalezas del proyecto (para equilibrar)

No todo es deuda; hay bases sólidas:

1. **App Router + Server Components** en páginas públicas clave (`app/page.tsx`).
2. **Honeypot + Zod** en `submitLead` (buen patrón a replicar).
3. **RAG con pgvector + Cohere rerank** — arquitectura moderna para el bot de admisión.
4. **Service role aislado en `lib/supabase-admin.ts`** con comentario de no usar en client.
5. **Middleware de sesión Supabase SSR** presente (solo falta reforzar RBAC).
6. **SEO** base: metadata, JSON-LD, sitemap/robots, redirects de URLs legacy.
7. **Playwright** ya en el repo — se puede expandir a seguridad y regresión.
8. Media y CMS orientados a no commitear assets pesados.

---

## 8. Conclusión

**Webwaldorfv2** es un producto ambicioso (sitio + CRM + IA + mensajería) con valor real para el colegio, pero hoy opera con un modelo de confianza implícito: “si la UI es admin, la API es segura”. Eso **no es cierto** en Next.js.

Prioridad absoluta:

1. **Cerrar APIs y rotar credenciales.**
2. **Actualizar Next.js.**
3. **RBAC + RLS correctos.**
4. **Limpiar el fork clínico y unificar el CRM.**
5. **Reactivar cache/ISR y reducir coste de IA.**

Con el Sprint 0–1 el riesgo pasa de “explotable remotamente” a “base endurecida”. Con Sprint 2–3 el proyecto se vuelve mantenible a largo plazo como plataforma Trekan, no como monorepo multi-negocio.

---

## 9. Apéndice — archivos críticos revisados

| Archivo | Rol en la auditoría |
|---------|---------------------|
| `middleware.ts` / `utils/supabase/middleware.ts` | Authz admin |
| `app/api/**/route.ts` | Superficie de ataque |
| `app/actions/submitLead.ts` | Patrón bueno de validación |
| `app/admin/portada/actions.ts` | Service role sin auth |
| `lib/supabase-admin.ts`, `lib/ai.ts`, `lib/emailTemplates.ts` | Privilegios / legado |
| `scripts/create_admin.mjs` | Secreto en Git |
| `scripts/setup_cms.sql`, `setup_rag.sql` | RLS débil / público |
| `package.json` / `npm audit` | CVEs Next |
| `next.config.js` | Sin security headers |
| `app/page.tsx` | `revalidate = 0`, composición home |
| `app/admin/*` | Deuda y páginas huérfanas |

---

*Informe generado por auditoría estática del repositorio local. No incluye pentest dinámico, revisión de políticas RLS reales en el proyecto Supabase cloud, ni escaneo de secretos en historial remoto completo. Se recomienda validar RLS en el dashboard de Supabase y ejecutar un smoke de auth en staging tras los fixes del Sprint 0.*
