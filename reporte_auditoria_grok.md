# Auditoría de UI — `globals.css` y `layout.tsx`

**Proyecto:** Webwaldorfv2 (Colegio Waldorf Trekan)  
**Auditor:** Grok (xAI)  
**Fecha:** 2026-07-23  
**Alcance:** últimos cambios de UI en `app/globals.css` y `app/layout.tsx`, con impacto colateral en componentes/páginas relacionados  
**Rama auditada:** `main` (working tree limpio, al día con `origin/main`)

---

## 1. Resumen ejecutivo

Los commits recientes refuerzan la identidad tipográfica Waldorf (fuente **Antroposofia** en títulos) e introducen un **modelo 3D global** (Martín Pescador de madera) como elemento de marca Awwwards-style. La dirección de arte es coherente con la paleta y el tono orgánico del sitio, pero la implementación actual tiene **riesgos serios de rendimiento y UX**, y al menos un **bug de doble montaje** en la home.

| Severidad | Cantidad | Acción |
|-----------|----------|--------|
| Crítica   | 2        | Corregir antes de considerar el cambio “listo” en producción |
| Alta      | 4        | Priorizar en el próximo ciclo |
| Media     | 5        | Planificar mejoras |
| Baja / OK | 4        | Mantener o pulir |

**Veredicto:** la tipografía global va en la dirección correcta; el layout global necesita **acotar el 3D**, **cargar fuentes de cuerpo de forma real** y **evitar efectos de marca en rutas admin**.

---

## 2. Commits revisados

| Hash | Mensaje | Archivos UI relevantes |
|------|---------|------------------------|
| `d34e927` | UI: Inyectar modelo 3D del Martín Pescador… | `app/layout.tsx` |
| `e7a626b` | UI: Restaurar fuente Antroposofia en h1/h2… | `app/globals.css` |
| `4b059cc` | ok | `app/globals.css` (+ cursor, page) |
| `d98e546` | l | `app/globals.css`, `app/layout.tsx` |

**Nota de proceso:** mensajes `"ok"` y `"l"` dificultan el historial y futuras auditorías. Conviene commits descriptivos (`fix(ui): …` / `feat(ui): …`).

---

## 3. Cambios observados

### 3.1 `app/globals.css`

1. **Tokens de fuente renombrados a convención Tailwind**
   - Antes: `--font-quicksand`, `--font-merriweather`
   - Ahora: `--font-sans` → Quicksand; `--font-serif` → Antroposofia + Merriweather
   - Se mantiene `--font-antroposofia`
2. **`@layer base` diferencia h1/h2 de h3–h6**
   - `h1, h2`: familia Antroposofia, `font-weight: 400`, color moss, `letter-spacing: 0.02em`
   - `h3–h6`: solo `font-weight: 700` + color moss (sin familia explícita)
3. **Base visual ya existente (contexto, no solo el diff)**
   - Paleta Waldorf en `@theme`
   - Film grain `.awwwards-noise`
   - Glass / sombras orgánicas
   - Google Translate headless
   - `cursor: none !important` en desktop (`min-width: 768px`)

### 3.2 `app/layout.tsx`

1. **Carga dinámica del 3D**
   ```ts
   const MartinPescador3D = dynamic(() => import('@/components/MartinPescador3D'), { ssr: false })
   ```
2. **Montaje global** del modelo junto a `AIChatWidget` (todas las rutas del root layout).
3. **Limpieza de stubs de fuentes**
   - Se eliminaron:
     ```ts
     const quicksand = { variable: 'font-sans' }
     const merriweather = { variable: 'font-serif' }
     ```
   - Y el `className` en `<html>` que los aplicaba.
   - Esos objetos **no eran** `next/font`; no cargaban archivos reales. Quitarlos es correcto, pero deja el vacío de carga más visible.

---

## 4. Hallazgos

### CRÍTICO

#### C1. Doble montaje del Martín Pescador en la homepage

El componente se instancia en:

- `app/layout.tsx` (global)
- `app/page.tsx` (home, líneas 22 y 117)

**Efecto en `/`:** dos canvases WebGL, dos árboles de React Three Fiber, posible doble descarga/parse del GLB (~**6,4 MB** en `public/assets/3d/martinpescador.glb`), y dos capas fijas `bottom-8 right-8` superpuestas.

**Recomendación:** dejar **una sola fuente de verdad**.
- Preferible: solo en `layout.tsx` **o** solo en la home.
- Si es “mascota de marca global”, quitarlo de `page.tsx`.
- Si es solo home, quitarlo de `layout.tsx`.

#### C2. WebGL + GLB + Environment en **todas** las rutas del root layout

`MartinPescador3D` vive en el root layout → también en `/admin/*`, `/login`, formularios, páginas SEO, etc.

**Impacto:**
- Coste de JS (three / R3F / drei) y GPU en paneles internos.
- UI decorativa encima del CMS (z-index `40`, fixed).
- Peor LCP/TBT/INP en móvil no aplica (hidden `md:block`), pero en desktop admin sí.

**Recomendación:**
- Montar solo en rutas públicas de marketing, **o**
- feature-flag / pathname guard (`usePathname` + exclude `/admin`, `/login`), **o**
- lazy real: montar tras idle + viewport + `prefers-reduced-motion: no-preference`.

---

### ALTA

#### A1. Quicksand y Merriweather no se cargan en ningún lado

Estado actual:

| Fuente | Declarada en CSS | Archivo / CDN / next/font |
|--------|------------------|---------------------------|
| Antroposofia | `@font-face` → `/fonts/antroposofia.ttf` | **Sí** (~50 KB) |
| Quicksand | `--font-sans` | **No** |
| Merriweather | fallback de serif | **No** |

No hay `next/font/google`, ni `<link>` a Google Fonts, ni `@font-face` adicionales. El body usa `font-sans` → el navegador cae al **sans-serif del sistema**. La identidad “Quicksand” del diseño **no está garantizada**.

Los stubs eliminados en `layout.tsx` nunca resolvieron esto; solo maquillaban variables CSS.

**Recomendación:**
```ts
// layout.tsx (ejemplo)
import { Quicksand, Merriweather } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-sans' })
const merriweather = Merriweather({ subsets: ['latin'], weight: ['300','400','700'], variable: '--font-merriweather' })
```
Y alinear `@theme` / `@font-face` de Antroposofia con variables reales de Next (self-host + `font-display: swap` ya está bien en Antroposofia).

#### A2. Antroposofia: un solo peso; el sitio fuerza bold en títulos

`@font-face` solo declara `font-weight: normal`. En base, h1/h2 van a `400`, pero decenas de componentes usan `font-bold` / `font-bold font-serif` en h1/h2 (Hero, Admisión, FAQ, etc.).

**Efecto:** *faux bold* del navegador → bordes irregulares, aspecto menos “artesanal”, peor legibilidad en fluid hero.

**Recomendación:**
- Si solo hay un master: **no usar bold** en títulos Antroposofia; reforzar con tamaño, tracking y color.
- O exportar pesos reales (400/700) si el archivo lo permite.
- Alinear utilidades: quitar `font-bold` de h1/h2 o forzar `font-normal` en base con mayor especificidad consciente.

#### A3. Conflicto de cursores: `cursor: none` vs canvas 3D

En `globals.css` (desktop):

```css
html, body, a, button, input, select, textarea, [role="button"] {
  cursor: none !important;
}
```

Además `MagneticCursor` fuerza `document.body.style.cursor = 'none'`.

El canvas del 3D declara `cursor-grab` / `active:cursor-grabbing`, pero:
- el body/cursores globales compiten con `!important`;
- `PresentationControls` con prop **`global`** captura drag en toda la ventana, no solo en el cuadro 220×220.

**Riesgo UX:** arrastrar “en cualquier parte” rota el pajarito y puede pelear con selección de texto, sliders, maps, formularios.

**Recomendación:**
- Quitar `global` de `PresentationControls` (limitar interacción al contenedor).
- Excluir el contenedor 3D del cursor custom, o usar `cursor: grab` local sin `!important` global tan agresivo.
- Respetar `prefers-reduced-motion` y dispositivos pointer coarse (ya hay hide en mobile del 3D; el cursor custom también detecta touch — bien).

#### A4. Coste de runtime del 3D sin controles de carga

`MartinPescador3D`:
- `Canvas` + luces + **`Environment preset="forest"`** (HDRI de red/CDN de assets drei)
- `Float` + `PresentationControls`
- `useGLTF('/assets/3d/martinpescador.glb')` sin `preload` explícito ni dispose documentado
- Solo gate `mounted` (hidratación), no idle/intersection

**Recomendación mínima:**
- `IntersectionObserver` o montar tras `requestIdleCallback`
- `dpr={[1, 1.5]}` y `frameloop="demand"` cuando no hay interacción
- Suspense + fallback null
- No montar en admin
- Considerar versión estática WebP en mobile (ya hidden) y low-power mode

---

### MEDIA

#### M1. Token `--font-antroposofia` con fallback `sans-serif`

```css
--font-antroposofia: 'Antroposofia', sans-serif;
```

Debería ser `serif` / `Georgia, serif` para coherencia con h1/h2 y `--font-serif`.

#### M2. h3–h6 sin familia tipográfica en base

Solo heredan color/peso. Si el body es Quicksand (o system sans), los h3 quedan en sans mientras el diseño usa mucho `font-serif` en componentes. No es bug grave, pero la base es **inconsistente**: h1/h2 “siempre Antroposofia”, h3 “solo si el componente lo pide”.

**Recomendación de DA:** decidir si h3 también lleva Antroposofia o Merriweather y documentarlo en el design system.

#### M3. Color base moss en h1/h2 vs títulos sobre foto/video

La regla base pinta h1/h2 en `--color-waldorf-moss`. En Hero y otras zonas se anula con utilidades (`text-white`, gradients). Funciona por cascada de utilidades Tailwind, pero:

- cualquier h1 “desnudo” sin clase de color quedará verde musgo (puede ser deseado);
- en admin (`h2` del sidebar con `text-[var(--color-waldorf-cream)]`) depende de utilidades — OK, pero frágil si alguien olvida la clase.

#### M4. Stack de efectos globales denso

En el body del layout conviven a la vez:

| Capa | Componente / clase | z-index aprox. |
|------|--------------------|----------------|
| Splash | `LiquidSplash` | — |
| Cursor | `MagneticCursor` | 9999 |
| Grain | `.awwwards-noise` | 9997 |
| Scroll | `SmoothScroll` | — |
| 3D | `MartinPescador3D` | 40 |
| Chat | `AIChatWidget` | (propio) |
| Tracking | GTM + Meta Pixel + Translate | — |

Para un colegio (público familiar, conversión admisión), el stack es **muy “portfolio Awwwards”**. No es incorrecto, pero cada capa suma JS, repaints y superficie de bugs. El grain a opacity 0.04 es sutil y aceptable; el 3D global es el más caro.

#### M5. `html, body { position: static !important; top: 0 !important }` (Google Translate)

Necesario para matar el banner, pero puede interferir con sticky/fixed edge cases y con librerías de scroll suave. Conviene revalidar Navbar sticky y `SmoothScroll` tras traducir página.

---

### BAJA / ASPECTOS POSITIVOS

#### B1. Buenas prácticas detectadas

- `font-display: swap` en Antroposofia → menos FOIT.
- `dynamic(..., { ssr: false })` para el 3D → evita SSR de WebGL.
- Renombrar tokens a `--font-sans` / `--font-serif` alinea con utilidades `font-sans` / `font-serif` usadas en todo el codebase (decenas de archivos).
- Separar h1/h2 (display) de h3–h6 es una decisión de DA razonable.
- 3D oculto en mobile (`hidden md:block`) → buen criterio de performance móvil.
- Paleta centralizada en `@theme` (cream, sage, moss, terracotta, mustard).

#### B2. SEO / metadata en layout (fuera de UI pura pero presente)

Open Graph, Twitter Cards, JSON-LD EducationalOrganization y GTM están en el mismo archivo. No son regresiones de este diff de UI; se mantienen. Vigilar que scripts de marketing no bloqueen interacción junto al 3D.

#### B3. Duplicidad cosmética de estilos en `body`

```tsx
<body className="font-sans antialiased bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-text)]">
```

y en CSS:

```css
body {
  background-color: var(--color-waldorf-cream);
  color: var(--color-waldorf-text);
}
```

Redundante, no roto. Preferir una sola fuente de verdad (CSS base o className).

#### B4. Commits de cursor (relacionados, fuera del diff estricto)

En `4b059cc`, el cursor pasó de blanco + `mix-blend-difference` a terracotta semitransparente. Mejor alineación de marca; pierde contraste en fondos terracotta/oscuro — validar en Hero oscuro y en footer.

---

## 5. Matriz de impacto por superficie

| Superficie | Tipografía h1/h2 | 3D global | Cursor none | Notas |
|------------|------------------|-----------|-------------|-------|
| Home `/` | ✅ Antroposofia (con bold conflictivo) | ⚠️ **×2 instancias** | ✅ | Crítico |
| Páginas marketing | ✅ | ⚠️ 1 instancia | ✅ | Coste WebGL |
| Admin `/admin/*` | Aplica reglas base | ⚠️ 3D + grain + cursor | ✅ | No deseable |
| Login | Aplica | ⚠️ | ✅ | No deseable |
| Mobile | Fuente sí | 3D oculto | cursor default (media query) | Mejor que desktop admin |

---

## 6. Checklist de verificación manual sugerida

- [ ] Home: DevTools → contar nodos canvas WebGL (debe ser **1**, no 2)
- [ ] Network: una sola request a `martinpescador.glb` al navegar home
- [ ] Navegar `/admin` y `/login`: **no** debe verse el pajarito 3D
- [ ] Computed styles en h1 Hero: familia `Antroposofia`, peso sin faux-bold excesivo
- [ ] Body: confirmar si Quicksand está en “Fonts” del inspector (hoy probablemente no)
- [ ] Arrastrar en el centro de la página: **no** debe rotar el 3D si se quita `global`
- [ ] Lighthouse desktop: TBT / Performance antes vs después de desmontar 3D
- [ ] `prefers-reduced-motion: reduce`: idealmente sin Float ni auto-animación
- [ ] Contraste cursor terracotta sobre Hero oscuro y sobre cream
- [ ] Traducción ES→DE/EN: sin salto de layout por banner Google

---

## 7. Plan de remediación priorizado

### Sprint inmediato (bloqueantes)

1. **Eliminar duplicado** `MartinPescador3D` de `app/page.tsx` **o** de `layout.tsx` (una sola instancia).
2. **Excluir** 3D (y ojalá cursor custom / grain) de rutas `/admin` y `/login`.
3. **Quitar `global`** de `PresentationControls` en `MartinPescador3D.tsx`.

### Siguiente iteración

4. Cargar **Quicksand** (y Merriweather si se usa como fallback real) con `next/font`.
5. Unificar pesos: o `font-normal` en títulos Antroposofia, o archivos multi-weight.
6. Lazy-mount 3D (idle + reduced-motion + opcional “cerrar mascota”).
7. Corregir fallback de `--font-antroposofia` a `serif`.
8. Mensajes de commit claros en futuros cambios de UI.

### Deuda de diseño/sistema

9. Documentar scale tipográfico (qué nivel usa Antroposofia vs Quicksand).
10. Revisar si el stack Awwwards (grain + magnetic cursor + liquid splash + 3D + smooth scroll) es el tono correcto para conversión de admisión familiar; medir con analítica (scroll depth, rage clicks, bounce en mobile desktop-emulado).

---

## 8. Fragmentos de referencia (estado auditado)

### Tipografía base (`globals.css`)

```css
h1, h2 {
  font-family: 'Antroposofia', 'Merriweather', Georgia, serif;
  font-weight: 400;
  color: var(--color-waldorf-moss);
  letter-spacing: 0.02em;
}
```

### Inyección global (`layout.tsx`)

```tsx
const MartinPescador3D = dynamic(() => import('@/components/MartinPescador3D'), { ssr: false })
// ...
<MartinPescador3D />
<AIChatWidget />
```

### Duplicado en home (`page.tsx`) — a eliminar si el 3D es global

```tsx
const MartinPescador3D = dynamic(() => import('@/components/MartinPescador3D'), { ssr: false })
// ...
<MartinPescador3D />
```

---

## 9. Conclusión

Los últimos cambios de UI **aciertan en marca** (Antroposofia en títulos, tokens `font-sans`/`font-serif`, mascota 3D de madera) pero **no están listos como implementación global limpia**:

1. Hay un **bug claro de doble instancia** en la home.  
2. El **3D en el root layout** castiga admin y páginas que no lo necesitan.  
3. La **carga real de fuentes de cuerpo** sigue incompleta.  
4. Hay **fricciones de interacción** (cursor + PresentationControls global) y **pesos tipográficos** que pelean con un único master TTF.

Corregidos C1–C2 y A1–A3, el resultado puede ser una UI distintiva y alineada con la pedagogía Waldorf sin sacrificar performance ni usabilidad del panel interno.

---

*Fin del reporte. Archivo generado como `reporte_auditoria_grok.md` en la raíz del repositorio.*
