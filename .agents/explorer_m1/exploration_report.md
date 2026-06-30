# Exploration Report: Webwaldorfv2 Codebase and Assets Analysis

This report documents the findings from the read-only exploration of the `Webwaldorfv2` repository, focusing on reusable assets, configuration keys, and the details of the WhatsApp floating widget.

---

## 1. Reusable Assets (Fonts, Styles, Images)

### A. Fonts (`/fonts`)
- **`Antroposofia.ttf`** (50,436 bytes) - Custom serif/script font used for Waldorf brand-style headings.
- **`WaldorfTwo.ttf`** (50,436 bytes) - Secondary custom typography.

### B. Stylesheets (`/` and `/src/css`)
- **`style.css`** (57,768 bytes in root) - Main stylesheet defining the global theme colors:
  - `--primary-green`: `#2E5E4E` (Brand Dark Green)
  - `--secondary-green`: `#A8D8B9` (Brand Sage Green)
  - `--light-green`: `#E8F5E8` (Light Sage BG)
  - `--accent-orange`: `#D4A574` (Brand Orange/Gold Accent)
  - `--text-dark`: `#2C3E50`
  - `--bg-color`: `#F9F6F0` (Cream/Off-White Background)
- **`/src/css/base.css`**, **`/src/css/components.css`**, **`/src/css/responsive.css`** - Fragmented styling files used to compile the final `style.css`.

### C. Assets Directory (`/assets`)
- **`Coordinadora.png`** (737,957 bytes) - High-resolution portrait of the Coordinator, Ivonne Parada, used in the WhatsApp widget card header.
- **`colegio-fondo.webp`** (130,300 bytes) / **`colegio-fondo-800.webp`** (78,310 bytes) - WebP background images.
- **`logo.png`** (774,522 bytes) / **`logo.webp`** (381,070 bytes) - Primary brand logo.
- **`logo-mini.png`** (11,874 bytes) / **`logo-mini.webp`** (10,357 bytes) - Compact favicon/avatar logo.

### D. Images Directory (`/images`)
Contains **88 assets**, including:
- Page illustrations (e.g. `admision2.webp`, `cocina.webp`, `estacionamiento.webp`).
- Gallery & event images (`galeria-Inauguracion.webp`, `galeria1.webp` through `galeria11.webp`).
- Community and building photos (`escuela1.webp` through `escuela5.webp`).
- Local MP4 videos (`video_2025-08-15_12-38-13.mp4`, etc.).

---

## 2. Environment Variables (`.env.local`)

The `.env.local` file contains the following keys (values are excluded for security):
1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`
4. `GROQ_API_KEY`

---

## 3. WhatsApp Floating Widget Implementation

### A. Location
The widget markup and styles are defined in **`src/templates/modals-scripts.html`** (lines 29–74) and built dynamically into all static pages (e.g., `index.html` lines 1292–1338) via `build.js`.

### B. Markup and Structure
```html
<div class="wa-card" id="waCard" role="dialog" aria-modal="true" aria-label="Contacto WhatsApp">
  <div class="wa-card-header">
    <img class="wa-card-logo" src="assets/Coordinadora.png" alt="Ivonne Parada A.">
    <div class="wa-card-identity">
      <span class="wa-card-name">Ivonne Parada A.</span>
      <span class="wa-card-role">Coordinadora General</span>
    </div>
    <button class="wa-card-close" onclick="waClose()" aria-label="Cerrar">✕</button>
  </div>
  <div class="wa-card-body">
    <p class="wa-card-msg">Hola 👋 Escríbeme directamente, con gusto respondo tus preguntas sobre el colegio o agenda tu visita.</p>
    <a class="wa-card-btn" href="https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20el%20Colegio%20Waldorf%20Trekan" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24">...</svg>
      Enviar mensaje
    </a>
  </div>
</div>
<button class="wa-trigger" id="waTrigger" aria-label="Contactar por WhatsApp" onclick="waToggle()">
  <img src="assets/logo.png" alt="WhatsApp Trekan">
</button>
```

### C. Styling Details
- **Trigger Button (`.wa-trigger`)**:
  - `position: fixed; bottom: 1.75rem; left: 1.5rem; z-index: 1000; width: 52px; height: 52px;`
  - Background color: `#2E5E4E` (Brand Green)
  - Animation: Ripple effect (`wa-ripple` 2.4s infinite) to capture attention.
- **Card Container (`.wa-card`)**:
  - `position: fixed; bottom: 5.5rem; left: 1.5rem; z-index: 1000; width: 270px; background: #fff; border-radius: 16px;`
  - Smooth animation on open: scale `.97` and translation to scale `1` and translation `0` (controlled via `.wa-card.open` class toggling opacity and scale).
- **Message and Button**:
  - Greeting text in Quicksand font, size `0.8rem`.
  - Active button: Background `#25D366` (official WhatsApp green), text "Enviar mensaje".
  - Link: Directs to WhatsApp Web/App API `https://wa.me/56967765106` with pre-filled text: `"Hola, me gustaría saber más sobre el Colegio Waldorf Trekan"`.

### D. Interaction Logic
- **Toggling**:
  - `waToggle()` toggles the `.open` class on `#waCard`.
  - `waClose()` removes the `.open` class.
- **Keyboard Dismissal**:
  - Pressing `Escape` closes the card: `document.addEventListener('keydown', function(e){ if(e.key==='Escape') waClose(); });`

---

## 4. Code / Specification Discrepancies (QA Notes)

During code inspection, two deviations from `TEST_INFRA.md` specifications were identified:
1. **Click Outside Dismissal (`test_whatsapp_outside_dismiss`)**: The codebase does not actually contain any click event listener to dismiss `#waCard` when clicking outside of it. The `Escape` key and close `✕` button are the only working ways to dismiss the card.
2. **Cookie Banner Interaction (`test_combo_whatsapp_cookie_banner`)**: CSS shifting on active cookie banner (`transform: translateY(-80px)`) is only applied to the chatbot bubble (`.trekan-bot-bubble`) and its tooltip, but not to the WhatsApp floating trigger button (`.wa-trigger`).
3. **Legacy Script References**: `js/script.js` has a script searching for `.floating-whatsapp` to dynamically inject a `.wa-badge` showing "Escríbenos" on a timer. However, the HTML markup does not contain any `.floating-whatsapp` class (it has been replaced by `.wa-trigger`), making this dynamic badge script inactive.
