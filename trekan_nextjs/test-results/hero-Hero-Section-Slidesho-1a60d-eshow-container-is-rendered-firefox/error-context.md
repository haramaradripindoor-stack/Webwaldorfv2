# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hero.spec.ts >> Hero Section / Slideshow (Tier 1) >> test_hero_container_exists: verify slideshow container is rendered
- Location: tests\hero.spec.ts:44:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.slideshow-container')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.slideshow-container')

```

```yaml
- link "Volver al sitio":
  - /url: index.html
  - img
  - text: Volver al sitio
- banner:
  - heading "COTIZACIÓN DE ARRIENDO DE SALÓN" [level=1]
  - paragraph: Espacio Trekan — Un lugar pensado para el aprendizaje, la conexión y el crecimiento
  - text: 💰 Tarifa desde $10.000 CLP / hora
  - strong: 🏡 Galería del Espacio Trekan
  - text: Las Azaleas 96, Puerto Varas
  - img "Salón principal"
  - heading "Salón Principal" [level=3]
  - paragraph: 25m² con capacidad para 20 personas.
  - img "Vista exterior"
  - heading "Vista Exterior" [level=3]
  - paragraph: Las Azaleas 96, rodeado de naturaleza.
  - img "Cocina equipada"
  - heading "Cocina Equipada" [level=3]
  - paragraph: Completamente equipada para tu evento.
  - img "Ambiente cálido"
  - heading "Ambiente Cálido" [level=3]
  - paragraph: Calefacción a leña disponible.
  - img "Estacionamiento"
  - heading "Estacionamiento" [level=3]
  - paragraph: Capacidad para 10 vehículos.
  - button "‹"
  - button "›"
  - img "Salón"
  - img "Exterior"
  - img "Cocina"
  - img "Ambiente"
  - img "Estacionamiento"
- heading "📋 Información del Cliente" [level=2]
- text: "Nombre:"
- textbox "Nombre:"
- text: "Teléfono:"
- textbox "Teléfono:"
- text: "Correo electrónico:"
- textbox "Correo electrónico:"
- heading "📅 Duración del Evento" [level=2]
- paragraph: "Selecciona cada día con su horario específico:"
- strong: Día 1
- text: "Fecha:"
- textbox
- text: "Hora de inicio:"
- textbox
- text: "Hora de término:"
- textbox
- button "+ Agregar otro día"
- heading "💲 Tarifas" [level=2]
- table:
  - rowgroup:
    - row "Duración Tarifa":
      - columnheader "Duración"
      - columnheader "Tarifa"
  - rowgroup:
    - row "1 – 3 horas $10.000 CLP / hora":
      - cell "1 – 3 horas"
      - cell "$10.000 CLP / hora"
    - row "4 – 6 horas $9.000 CLP / hora":
      - cell "4 – 6 horas"
      - cell "$9.000 CLP / hora"
    - row "Jornada completa (7 hrs) $50.000 CLP total":
      - cell "Jornada completa (7 hrs)"
      - cell "$50.000 CLP total"
    - row "Horas extra (>7 hrs) $7.000 CLP / hora adicional":
      - cell "Horas extra (>7 hrs)"
      - cell "$7.000 CLP / hora adicional"
- heading "🔌 Servicios y Equipamiento Opcional" [level=2]
- checkbox "Kit Audiovisual Completo (proyector + pantalla + parlantes + micrófono) — $20.000 CLP"
- text: Kit Audiovisual Completo (proyector + pantalla + parlantes + micrófono) — $20.000 CLP
- 'checkbox "Calefacción a leña: incluye 1 vara y encendido inicial — $15.000 CLP El cliente se responsabiliza de alimentar la calefacción durante el evento."'
- text: "Calefacción a leña: incluye 1 vara y encendido inicial — $15.000 CLP El cliente se responsabiliza de alimentar la calefacción durante el evento."
- checkbox "Otra necesidad (especifica abajo)"
- text: Otra necesidad (especifica abajo)
- heading "💰 Resumen de Costo Estimado" [level=2]
- strong: "Desglose:"
- text: "Total: 0.0 horas en 1 día(s) Salón: 0 CLP Servicios adicionales: 0 CLP"
- strong: "Total: $0"
- separator
- strong: "Pagos:"
- text: "Reserva (30%): $0 Saldo (70%): $0 El saldo debe pagarse hasta 24 horas antes del evento."
- heading "✅ Incluye" [level=2]
- list:
  - listitem: Uso exclusivo del salón de 25 m² (capacidad para 20 personas)
  - listitem: Mesas y sillas modulares (para trabajo en grupo o en U)
  - listitem: Baño de uso común
  - listitem: Cocina equipada (para coffee break o autogestión)
  - listitem: Estacionamiento para hasta 10 vehículos
  - listitem: Limpieza básica (el cliente deja el espacio ordenado)
  - listitem: Salón cálido con opción de calefacción a leña (bajo pedido)
- heading "🍽️ Catering" [level=2]
- paragraph: Se permite catering externo o autogestionado sin costo adicional.
- heading "⚠️ Política de Cancelación" [level=2]
- list:
  - listitem: "Cancelación con más de 5 días: se devuelve el 50% de la reserva."
  - listitem: "Cancelación con menos de 3 días: no hay devolución."
- heading "💬 Dudas, consultas o inquietudes" [level=2]
- paragraph: ¿Tienes alguna pregunta, necesidad especial o quieres coordinar algo no incluido?
- textbox "Escríbenos aquí tus dudas, requerimientos especiales o comentarios..."
- heading "✏️ Confirmación" [level=2]
- paragraph: Al enviar este formulario, confirmo que acepto los términos y condiciones.
- text: "Nombre completo (firma digital):"
- textbox "Nombre completo (firma digital):"
- text: "Fecha:"
- textbox "Fecha:": 2026-06-28
- button "Enviar Cotización y Reservar Fecha"
- contentinfo:
  - paragraph:
    - strong: Espacio Trekan
    - text: 📞 +56 9 677 65 106 ✉️
    - link "coordinacion@colegiowaldorftrekan.cl":
      - /url: mailto:coordinacion@colegiowaldorftrekan.cl
    - text: 📍 Las Azaleas 96, Puerto Varas, Chile
    - emphasis: Un espacio pensado para inspirar, conectar y transformar
- link "Contactar por WhatsApp":
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
  41  |     expect(hasAPI).toBe(true);
  42  |   });
  43  | 
  44  |   test('test_hero_container_exists: verify slideshow container is rendered', async ({ page }) => {
  45  |     const container = page.locator('.slideshow-container');
> 46  |     await expect(container).toBeVisible();
      |                             ^ Error: expect(locator).toBeVisible() failed
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