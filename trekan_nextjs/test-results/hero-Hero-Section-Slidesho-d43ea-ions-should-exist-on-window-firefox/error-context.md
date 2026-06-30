# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hero.spec.ts >> Hero Section / Slideshow (Tier 1) >> test_hero_global_api_present: changeSlide and currentSlide functions should exist on window
- Location: tests\hero.spec.ts:37:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - link "Volver al sitio" [ref=e3] [cursor=pointer]:
      - /url: index.html
      - img [ref=e4]
      - text: Volver al sitio
    - banner [ref=e6]:
      - heading "COTIZACIÓN DE ARRIENDO DE SALÓN" [level=1] [ref=e7]
      - paragraph [ref=e8]: Espacio Trekan — Un lugar pensado para el aprendizaje, la conexión y el crecimiento
      - generic [ref=e9]: 💰 Tarifa desde $10.000 CLP / hora
      - generic [ref=e10]:
        - generic [ref=e11]:
          - strong [ref=e12]: 🏡 Galería del Espacio Trekan
          - text: Las Azaleas 96, Puerto Varas
        - generic [ref=e13]:
          - generic [ref=e14]:
            - generic [ref=e15] [cursor=pointer]:
              - img "Salón principal" [ref=e16]
              - generic [ref=e17]:
                - heading "Salón Principal" [level=3] [ref=e18]
                - paragraph [ref=e19]: 25m² con capacidad para 20 personas.
            - generic [ref=e20] [cursor=pointer]:
              - img "Vista exterior" [ref=e21]
              - generic [ref=e22]:
                - heading "Vista Exterior" [level=3] [ref=e23]
                - paragraph [ref=e24]: Las Azaleas 96, rodeado de naturaleza.
            - generic [ref=e25] [cursor=pointer]:
              - img "Cocina equipada" [ref=e26]
              - generic [ref=e27]:
                - heading "Cocina Equipada" [level=3] [ref=e28]
                - paragraph [ref=e29]: Completamente equipada para tu evento.
            - generic [ref=e30] [cursor=pointer]:
              - img "Ambiente cálido" [ref=e31]
              - generic [ref=e32]:
                - heading "Ambiente Cálido" [level=3] [ref=e33]
                - paragraph [ref=e34]: Calefacción a leña disponible.
            - generic [ref=e35] [cursor=pointer]:
              - img "Estacionamiento" [ref=e36]
              - generic [ref=e37]:
                - heading "Estacionamiento" [level=3] [ref=e38]
                - paragraph [ref=e39]: Capacidad para 10 vehículos.
          - generic:
            - button "‹" [ref=e40] [cursor=pointer]
            - button "›" [ref=e41] [cursor=pointer]
        - generic [ref=e48]:
          - img "Salón" [ref=e50] [cursor=pointer]
          - img "Exterior" [ref=e52] [cursor=pointer]
          - img "Cocina" [ref=e54] [cursor=pointer]
          - img "Ambiente" [ref=e56] [cursor=pointer]
          - img "Estacionamiento" [ref=e58] [cursor=pointer]
    - generic [ref=e59]:
      - generic [ref=e60]:
        - heading "📋 Información del Cliente" [level=2] [ref=e61]
        - generic [ref=e62]: "Nombre:"
        - textbox "Nombre:" [ref=e63]
        - generic [ref=e64]: "Teléfono:"
        - textbox "Teléfono:" [ref=e65]
        - generic [ref=e66]: "Correo electrónico:"
        - textbox "Correo electrónico:" [ref=e67]
      - generic [ref=e68]:
        - heading "📅 Duración del Evento" [level=2] [ref=e69]
        - paragraph [ref=e70]: "Selecciona cada día con su horario específico:"
        - generic [ref=e72]:
          - strong [ref=e73]: Día 1
          - generic [ref=e74]: "Fecha:"
          - textbox [ref=e75]
          - generic [ref=e76]: "Hora de inicio:"
          - textbox [ref=e77]
          - generic [ref=e78]: "Hora de término:"
          - textbox [ref=e79]
        - button "+ Agregar otro día" [ref=e80] [cursor=pointer]
      - generic [ref=e81]:
        - heading "💲 Tarifas" [level=2] [ref=e82]
        - table [ref=e83]:
          - rowgroup [ref=e84]:
            - row "Duración Tarifa" [ref=e85]:
              - columnheader "Duración" [ref=e86]
              - columnheader "Tarifa" [ref=e87]
          - rowgroup [ref=e88]:
            - row "1 – 3 horas $10.000 CLP / hora" [ref=e89]:
              - cell "1 – 3 horas" [ref=e90]
              - cell "$10.000 CLP / hora" [ref=e91]
            - row "4 – 6 horas $9.000 CLP / hora" [ref=e92]:
              - cell "4 – 6 horas" [ref=e93]
              - cell "$9.000 CLP / hora" [ref=e94]
            - row "Jornada completa (7 hrs) $50.000 CLP total" [ref=e95]:
              - cell "Jornada completa (7 hrs)" [ref=e96]
              - cell "$50.000 CLP total" [ref=e97]
            - row "Horas extra (>7 hrs) $7.000 CLP / hora adicional" [ref=e98]:
              - cell "Horas extra (>7 hrs)" [ref=e99]
              - cell "$7.000 CLP / hora adicional" [ref=e100]
      - generic [ref=e101]:
        - heading "🔌 Servicios y Equipamiento Opcional" [level=2] [ref=e102]
        - generic [ref=e104]:
          - checkbox "Kit Audiovisual Completo (proyector + pantalla + parlantes + micrófono) — $20.000 CLP" [ref=e105]
          - text: Kit Audiovisual Completo (proyector + pantalla + parlantes + micrófono) — $20.000 CLP
        - generic [ref=e107]:
          - 'checkbox "Calefacción a leña: incluye 1 vara y encendido inicial — $15.000 CLP El cliente se responsabiliza de alimentar la calefacción durante el evento." [ref=e108]'
          - text: "Calefacción a leña: incluye 1 vara y encendido inicial — $15.000 CLP"
          - generic [ref=e109]: El cliente se responsabiliza de alimentar la calefacción durante el evento.
        - generic [ref=e111]:
          - checkbox "Otra necesidad (especifica abajo)" [ref=e112]
          - text: Otra necesidad (especifica abajo)
      - generic [ref=e113]:
        - heading "💰 Resumen de Costo Estimado" [level=2] [ref=e114]
        - generic [ref=e115]:
          - strong [ref=e116]: "Desglose:"
          - text: "Total: 0.0 horas en 1 día(s)"
          - text: "Salón: 0 CLP"
          - text: "Servicios adicionales: 0 CLP"
          - strong [ref=e117]: "Total: $0"
          - separator [ref=e118]
          - strong [ref=e119]: "Pagos:"
          - text: "Reserva (30%): $0"
          - text: "Saldo (70%): $0"
          - text: El saldo debe pagarse hasta 24 horas antes del evento.
      - generic [ref=e120]:
        - heading "✅ Incluye" [level=2] [ref=e121]
        - list [ref=e122]:
          - listitem [ref=e123]: Uso exclusivo del salón de 25 m² (capacidad para 20 personas)
          - listitem [ref=e124]: Mesas y sillas modulares (para trabajo en grupo o en U)
          - listitem [ref=e125]: Baño de uso común
          - listitem [ref=e126]: Cocina equipada (para coffee break o autogestión)
          - listitem [ref=e127]: Estacionamiento para hasta 10 vehículos
          - listitem [ref=e128]: Limpieza básica (el cliente deja el espacio ordenado)
          - listitem [ref=e129]: Salón cálido con opción de calefacción a leña (bajo pedido)
      - generic [ref=e130]:
        - heading "🍽️ Catering" [level=2] [ref=e131]
        - paragraph [ref=e132]: Se permite catering externo o autogestionado sin costo adicional.
      - generic [ref=e133]:
        - heading "⚠️ Política de Cancelación" [level=2] [ref=e134]
        - list [ref=e135]:
          - listitem [ref=e136]: "Cancelación con más de 5 días: se devuelve el 50% de la reserva."
          - listitem [ref=e137]: "Cancelación con menos de 3 días: no hay devolución."
      - generic [ref=e138]:
        - heading "💬 Dudas, consultas o inquietudes" [level=2] [ref=e139]
        - paragraph [ref=e140]: ¿Tienes alguna pregunta, necesidad especial o quieres coordinar algo no incluido?
        - textbox "Escríbenos aquí tus dudas, requerimientos especiales o comentarios..." [ref=e141]
      - generic [ref=e142]:
        - heading "✏️ Confirmación" [level=2] [ref=e143]
        - paragraph [ref=e144]: Al enviar este formulario, confirmo que acepto los términos y condiciones.
        - generic [ref=e145]: "Nombre completo (firma digital):"
        - textbox "Nombre completo (firma digital):" [ref=e146]
        - generic [ref=e147]: "Fecha:"
        - textbox "Fecha:" [ref=e148]: 2026-06-28
      - button "Enviar Cotización y Reservar Fecha" [ref=e149] [cursor=pointer]
    - contentinfo [ref=e150]:
      - paragraph [ref=e151]:
        - strong [ref=e152]: Espacio Trekan
        - text: 📞 +56 9 677 65 106
        - text: ✉️
        - link "coordinacion@colegiowaldorftrekan.cl" [ref=e153] [cursor=pointer]:
          - /url: mailto:coordinacion@colegiowaldorftrekan.cl
        - text: 📍 Las Azaleas 96, Puerto Varas, Chile
        - emphasis [ref=e154]: Un espacio pensado para inspirar, conectar y transformar
  - link "Contactar por WhatsApp" [ref=e155] [cursor=pointer]:
    - /url: https://wa.me/56967765106?text=Hola,%20quiero%20saber%20sobre%20el%20arriendo%20del%20salón
    - text: 💬
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | // Add the slideshow-container class before the main script runs
  4   | test.beforeEach(async ({ page }) => {
  5   |   await page.addInitScript(() => {
  6   |     const observer = new MutationObserver(() => {
  7   |       const slider = document.querySelector('.image-slider');
  8   |       if (slider && !slider.classList.contains('slideshow-container')) {
  9   |         slider.classList.add('slideshow-container');
  10  |         observer.disconnect();
  11  |       }
  12  |     });
  13  |     observer.observe(document.documentElement, { childList: true, subtree: true });
  14  |   });
  15  |   await page.goto('/cotizacion-salon.html');
  16  | });
  17  | 
  18  | test.describe('Hero Section / Slideshow (Tier 1)', () => {
  19  |   test('test_hero_initial_active_slide: first slide should be active and visible', async ({ page }) => {
  20  |     const firstSlide = page.locator('.slide').first();
  21  |     await expect(firstSlide).toHaveClass(/active/);
  22  |     const opacity = await firstSlide.evaluate(el => window.getComputedStyle(el).opacity);
  23  |     expect(opacity).toBe('1');
  24  |   });
  25  | 
  26  |   test('test_hero_slides_present: should have at least 3 slides', async ({ page }) => {
  27  |     const slides = page.locator('.slide');
  28  |     const count = await slides.count();
  29  |     expect(count).toBeGreaterThanOrEqual(3);
  30  |   });
  31  | 
  32  |   test('test_hero_first_dot_active: dot indicator for the first slide should be active', async ({ page }) => {
  33  |     const firstDot = page.locator('.dot').first();
  34  |     await expect(firstDot).toHaveClass(/active/);
  35  |   });
  36  | 
  37  |   test('test_hero_global_api_present: changeSlide and currentSlide functions should exist on window', async ({ page }) => {
  38  |     const hasAPI = await page.evaluate(() => {
  39  |       return typeof (window as any).changeSlide === 'function' && typeof (window as any).currentSlide === 'function';
  40  |     });
> 41  |     expect(hasAPI).toBe(true);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  42  |   });
  43  | 
  44  |   test('test_hero_container_exists: verify slideshow container is rendered', async ({ page }) => {
  45  |     const container = page.locator('.slideshow-container');
  46  |     await expect(container).toBeVisible();
  47  |   });
  48  | });
  49  | 
  50  | test.describe('Hero Section / Slideshow (Tier 2)', () => {
  51  |   test('test_hero_next_click: next button click should transition to the second slide', async ({ page }) => {
  52  |     const nextBtn = page.locator('.slider-btn').last(); // next slide button
  53  |     const slides = page.locator('.slide');
  54  |     
  55  |     // Verify first slide is active
  56  |     await expect(slides.nth(0)).toHaveClass(/active/);
  57  |     
  58  |     // Click next
  59  |     await nextBtn.click();
  60  |     
  61  |     // Verify second slide becomes active
  62  |     await expect(slides.nth(1)).toHaveClass(/active/);
  63  |     await expect(slides.nth(0)).not.toHaveClass(/active/);
  64  |   });
  65  | 
  66  |   test('test_hero_prev_click: prev button click should transition to the last slide', async ({ page }) => {
  67  |     const prevBtn = page.locator('.slider-btn').first(); // prev slide button
  68  |     const slides = page.locator('.slide');
  69  |     const totalSlides = await slides.count();
  70  |     
  71  |     // Verify first slide is active
  72  |     await expect(slides.nth(0)).toHaveClass(/active/);
  73  |     
  74  |     // Click prev
  75  |     await prevBtn.click();
  76  |     
  77  |     // Verify last slide becomes active
  78  |     await expect(slides.nth(totalSlides - 1)).toHaveClass(/active/);
  79  |     await expect(slides.nth(0)).not.toHaveClass(/active/);
  80  |   });
  81  | 
  82  |   test('test_hero_dot_click: clicking a dot transitions directly to that slide', async ({ page }) => {
  83  |     const dots = page.locator('.dot');
  84  |     const slides = page.locator('.slide');
  85  |     
  86  |     // Click 3rd dot
  87  |     await dots.nth(2).click();
  88  |     
  89  |     // Verify 3rd slide is active
  90  |     await expect(slides.nth(2)).toHaveClass(/active/);
  91  |   });
  92  | 
  93  |   test('test_hero_animation_lock: rapid double clicks are locked by isAnimating', async ({ page }) => {
  94  |     const nextBtn = page.locator('.slider-btn').last();
  95  |     const slides = page.locator('.slide');
  96  |     
  97  |     // Click next rapidly twice
  98  |     await nextBtn.click();
  99  |     await nextBtn.click();
  100 |     
  101 |     // Due to the 300ms transition lock, it should only move by 1 slide immediately
  102 |     await expect(slides.nth(1)).toHaveClass(/active/);
  103 |     await expect(slides.nth(2)).not.toHaveClass(/active/);
  104 |   });
  105 | 
  106 |   test('test_hero_hover_pause: hover over slideshow should pause the slideshow auto-advance', async ({ page }) => {
  107 |     const isPausedBefore = await page.evaluate(() => (window as any).isPaused);
  108 |     
  109 |     // Hover
  110 |     await page.locator('.slideshow-container').hover();
  111 |     
  112 |     // Expect state to be paused
  113 |     const isPausedAfter = await page.evaluate(() => (window as any).isPaused);
  114 |     expect(isPausedBefore).toBe(false);
  115 |     expect(isPausedAfter).toBe(true);
  116 |   });
  117 | });
  118 | 
```