# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: masonry.spec.ts >> Asymmetric Masonry Grid Layout (Tier 2) >> test_masonry_keyboard_nav: tab and enter opens lightbox modal
- Location: tests\masonry.spec.ts:99:7

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#cms-lightbox')
Expected pattern: /open/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#cms-lightbox')
    10 × locator resolved to <div class="" role="dialog" id="cms-lightbox" aria-modal="true" aria-label="Galería de imágenes">…</div>
       - unexpected value ""

```

```yaml
- navigation:
  - link "Logo Trekan Trekan":
    - /url: index.html#inicio
    - img "Logo Trekan"
    - text: Trekan
  - list:
    - listitem:
      - link "Inicio":
        - /url: index.html#inicio
    - listitem:
      - link "Nosotros ▾":
        - /url: index.html#quienes-somos
    - listitem:
      - link "Admisión 2026 ▾":
        - /url: index.html#admission
    - listitem:
      - link "Arriendo de Salón":
        - /url: index.html#arriendo-salon
    - listitem:
      - link "Contacto":
        - /url: index.html#contacto
  - link "Conocer el proceso de admisión":
    - /url: /admision.html
    - text: 🌿 Conocer admisión
- main:
  - heading "Archivo de noticias" [level=1]
  - paragraph: Todas las publicaciones del colegio, filtrables por año.
  - tablist "Filtrar por año":
    - tab "Todas" [selected]
    - tab "2026"
    - tab "2025"
  - article:
    - button "Click para ampliar imagen"
    - text: 22 de Abril de 2026
    - 'heading "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [level=3]'
    - paragraph: "El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritmo diario en el hogar, comprendido como una respiración: momentos de actividad (inhalación) y momentos de descanso (exhalación), que brindan seguridad, contención y calidez a nuestros niños. Durante la jornada se abrió un espacio de diálogo cercano, donde las familias pudieron compartir sus conocimientos, experiencias e inquietudes. A partir de preguntas como ¿qué saben sobre la pedagogía Waldorf?, surgieron diversas reflexiones, dudas e intereses en torno a este enfoque educativo. Asimismo, se abordó el tema del uso de pantallas en la vida cotidiana de los niños, generando una conversación en torno a sus efectos, límites y desafíos dentro del hogar. Este espacio permitió fortalecer el vínculo entre familia y escuela, acogiendo las preguntas e inquietudes de la comunidad, y abriendo caminos para seguir profundizando en estos temas en futuros encuentros."
    - button "Ver imagen 1":
      - img "Foto 1"
      - text: 🔍
    - button "Ver imagen 2":
      - img "Foto 2"
      - text: 🔍
    - button "Ver imagen 3":
      - img "Foto 3"
      - text: 🔍
  - article:
    - button "Click para ampliar imagen"
    - text: 21 de junio de 2025
    - heading "Fiesta de la Luz" [level=3]
    - paragraph: En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz.
    - iframe
  - article:
    - button "Click para ampliar imagen"
    - text: 5 de Marzo de 2025
    - heading "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [level=3]
    - paragraph: "Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se unieran para educar?"
    - button "Ver imagen 1":
      - img "Foto 1"
      - text: 🔍
    - button "Ver imagen 2":
      - img "Foto 2"
      - text: 🔍
    - iframe
  - article:
    - button "Click para ampliar imagen"
    - text: 20 de Febrero de 2025
    - heading "Construyendo y Embelleciendo Nuestro Colegio" [level=3]
    - paragraph: "En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir a nuestras niñas, niños y familias."
    - button "Ver imagen 1":
      - img "Foto 1"
      - text: 🔍
    - button "Ver imagen 2":
      - img "Foto 2"
      - text: 🔍
- contentinfo:
  - paragraph: © 2026 Colegio Waldorf Trekan - Puerto Varas
  - paragraph: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
- dialog "Contacto WhatsApp":
  - img "Ivonne Parada A."
  - text: Ivonne Parada A. Coordinadora General
  - button "Cerrar": ✕
  - paragraph: Hola 👋 Escríbeme directamente, con gusto respondo tus preguntas sobre el colegio o agenda tu visita.
  - link "Enviar mensaje":
    - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20el%20Colegio%20Waldorf%20Trekan
    - img
    - text: Enviar mensaje
- button "Contactar por WhatsApp":
  - img "WhatsApp Trekan"
- button "Abrir asistente virtual Trekan"
- dialog "Aviso de cookies":
  - paragraph:
    - text: 🍪 Usamos cookies para mejorar tu visita.
    - link "Saber más":
      - /url: https://policies.google.com/privacy
  - button "Rechazar"
  - button "Aceptar"
- button "Volver arriba": ↑
```

# Test source

```ts
  10  |     await expect(grid).toBeVisible();
  11  |   });
  12  | 
  13  |   test('test_masonry_cards_present: should render multiple cards', async ({ page }) => {
  14  |     const cards = page.locator('.cms-archivo-card');
  15  |     const count = await cards.count();
  16  |     expect(count).toBeGreaterThanOrEqual(1);
  17  |   });
  18  | 
  19  |   test('test_masonry_column_css: check columns count property in styles', async ({ page }) => {
  20  |     const grid = page.locator('.cms-archivo-grid');
  21  |     const columns = await grid.evaluate(el => window.getComputedStyle(el).columnCount || window.getComputedStyle(el).getPropertyValue('columns'));
  22  |     expect(columns).not.toBeNull();
  23  |   });
  24  | 
  25  |   test('test_masonry_break_inside: elements should prevent breaking inside columns', async ({ page }) => {
  26  |     const card = page.locator('.cms-archivo-card').first();
  27  |     const breakInside = await card.evaluate(el => window.getComputedStyle(el).breakInside || window.getComputedStyle(el).getPropertyValue('break-inside'));
  28  |     expect(breakInside).toBe('avoid');
  29  |   });
  30  | 
  31  |   test('test_masonry_responsive_viewport: test that viewport resizing preserves grid properties', async ({ page }) => {
  32  |     const grid = page.locator('.cms-archivo-grid');
  33  |     await page.setViewportSize({ width: 480, height: 800 });
  34  |     const colsMobile = await grid.evaluate(el => window.getComputedStyle(el).columnCount);
  35  |     
  36  |     await page.setViewportSize({ width: 1200, height: 800 });
  37  |     const colsDesktop = await grid.evaluate(el => window.getComputedStyle(el).columnCount);
  38  |     
  39  |     expect(colsMobile || colsDesktop).toBeDefined();
  40  |   });
  41  | });
  42  | 
  43  | test.describe('Asymmetric Masonry Grid Layout (Tier 2)', () => {
  44  |   test('test_masonry_chip_filtering: clicking a chip filters shown items', async ({ page }) => {
  45  |     const chips = page.locator('.cms-chip');
  46  |     const cards = page.locator('.cms-archivo-card');
  47  |     
  48  |     const initialCount = await cards.count();
  49  |     
  50  |     // Find a non-active chip and click it
  51  |     const inactiveChip = chips.locator(':not(.active)').first();
  52  |     const chipText = await inactiveChip.innerText();
  53  |     
  54  |     await inactiveChip.click();
  55  |     
  56  |     // Some cards should be hidden, or at least filtered. Let's check hidden vs visible
  57  |     // In many setups, filtering adds a "hidden" class or sets display: none
  58  |     const visibleCards = page.locator('.cms-archivo-card:not(.hidden)');
  59  |     const visibleCount = await visibleCards.count();
  60  |     
  61  |     expect(visibleCount).toBeLessThanOrEqual(initialCount);
  62  |   });
  63  | 
  64  |   test('test_masonry_chip_active_state: active class toggles correctly on chips click', async ({ page }) => {
  65  |     const chips = page.locator('.cms-chip');
  66  |     const firstChip = chips.first();
  67  |     const secondChip = chips.nth(1);
  68  |     
  69  |     await firstChip.click();
  70  |     await expect(firstChip).toHaveClass(/active/);
  71  |     await expect(secondChip).not.toHaveClass(/active/);
  72  |     
  73  |     await secondChip.click();
  74  |     await expect(secondChip).toHaveClass(/active/);
  75  |     await expect(firstChip).not.toHaveClass(/active/);
  76  |   });
  77  | 
  78  |   test('test_masonry_empty_state: verify behavior when no items match category filter', async ({ page }) => {
  79  |     // If we click a chip with no items, it might show an empty state message
  80  |     // Let's programmatically simulate filtering to zero items or click a chip that has no items
  81  |     const emptyMsg = page.locator('.cms-archivo-empty');
  82  |     
  83  |     // Let's add a dummy chip that filters to something non-existent
  84  |     await page.evaluate(() => {
  85  |       const container = document.querySelector('.cms-archivo-chips');
  86  |       if (container) {
  87  |         const btn = document.createElement('button');
  88  |         btn.className = 'cms-chip';
  89  |         btn.setAttribute('data-filter', 'non-existent-year-tag');
  90  |         btn.textContent = 'Non-existent';
  91  |         container.appendChild(btn);
  92  |       }
  93  |     });
  94  |     
  95  |     await page.locator('.cms-chip:has-text("Non-existent")').click();
  96  |     await expect(emptyMsg).toBeVisible();
  97  |   });
  98  | 
  99  |   test('test_masonry_keyboard_nav: tab and enter opens lightbox modal', async ({ page }) => {
  100 |     const firstCardThumb = page.locator('.cms-gallery-thumb').first();
  101 |     
  102 |     // Focus the thumbnail
  103 |     await firstCardThumb.focus();
  104 |     
  105 |     // Press Enter key
  106 |     await page.keyboard.press('Enter');
  107 |     
  108 |     // Verify lightbox is open
  109 |     const lightbox = page.locator('#cms-lightbox');
> 110 |     await expect(lightbox).toHaveClass(/open/);
      |                            ^ Error: expect(locator).toHaveClass(expected) failed
  111 |   });
  112 | 
  113 |   test('test_masonry_dynamic_reflow: columns structure dynamically shifts layout', async ({ page }) => {
  114 |     const grid = page.locator('.cms-archivo-grid');
  115 |     const initialWidth = await grid.evaluate(el => el.getBoundingClientRect().width);
  116 |     
  117 |     await page.setViewportSize({ width: 600, height: 800 });
  118 |     const finalWidth = await grid.evaluate(el => el.getBoundingClientRect().width);
  119 |     
  120 |     expect(finalWidth).toBeLessThan(initialWidth);
  121 |   });
  122 | });
  123 | 
```