# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: masonry.spec.ts >> Asymmetric Masonry Grid Layout (Tier 2) >> test_masonry_chip_filtering: clicking a chip filters shown items
- Location: tests\masonry.spec.ts:44:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.innerText: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.cms-chip').locator(':not(.active)').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "Logo Trekan Trekan" [ref=e4] [cursor=pointer]:
        - /url: index.html#inicio
        - img "Logo Trekan" [ref=e6]
        - generic [ref=e7]: Trekan
      - list [ref=e8]:
        - listitem [ref=e9]:
          - link "Inicio" [ref=e10] [cursor=pointer]:
            - /url: index.html#inicio
        - listitem [ref=e11]:
          - link "Nosotros ▾" [ref=e12] [cursor=pointer]:
            - /url: index.html#quienes-somos
        - listitem [ref=e13]:
          - link "Admisión 2026 ▾" [ref=e14] [cursor=pointer]:
            - /url: index.html#admission
        - listitem [ref=e15]:
          - link "Arriendo de Salón" [ref=e16] [cursor=pointer]:
            - /url: index.html#arriendo-salon
        - listitem [ref=e17]:
          - link "Contacto" [ref=e18] [cursor=pointer]:
            - /url: index.html#contacto
      - link "Conocer el proceso de admisión" [ref=e19] [cursor=pointer]:
        - /url: /admision.html
        - text: 🌿 Conocer admisión
  - main [ref=e20]:
    - generic [ref=e21]:
      - heading "Archivo de noticias" [level=1] [ref=e22]
      - paragraph [ref=e23]: Todas las publicaciones del colegio, filtrables por año.
    - tablist "Filtrar por año" [ref=e24]:
      - tab "Todas" [selected] [ref=e25] [cursor=pointer]
      - tab "2026" [ref=e26] [cursor=pointer]
      - tab "2025" [ref=e27] [cursor=pointer]
    - generic [ref=e28]:
      - article [ref=e29]:
        - generic [ref=e30]:
          - button "Click para ampliar imagen" [ref=e33] [cursor=pointer]
          - generic [ref=e34]:
            - generic [ref=e35]: 22 de Abril de 2026
            - 'heading "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [level=3] [ref=e36]'
            - paragraph [ref=e37]: "El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritmo diario en el hogar, comprendido como una respiración: momentos de actividad (inhalación) y momentos de descanso (exhalación), que brindan seguridad, contención y calidez a nuestros niños. Durante la jornada se abrió un espacio de diálogo cercano, donde las familias pudieron compartir sus conocimientos, experiencias e inquietudes. A partir de preguntas como ¿qué saben sobre la pedagogía Waldorf?, surgieron diversas reflexiones, dudas e intereses en torno a este enfoque educativo. Asimismo, se abordó el tema del uso de pantallas en la vida cotidiana de los niños, generando una conversación en torno a sus efectos, límites y desafíos dentro del hogar. Este espacio permitió fortalecer el vínculo entre familia y escuela, acogiendo las preguntas e inquietudes de la comunidad, y abriendo caminos para seguir profundizando en estos temas en futuros encuentros."
            - generic [ref=e38]:
              - button "Ver imagen 1" [ref=e39] [cursor=pointer]:
                - img "Foto 1" [ref=e41]
                - generic [ref=e42]: 🔍
              - button "Ver imagen 2" [ref=e43] [cursor=pointer]:
                - img "Foto 2" [ref=e45]
                - generic [ref=e46]: 🔍
              - button "Ver imagen 3" [ref=e47] [cursor=pointer]:
                - img "Foto 3" [ref=e49]
                - generic [ref=e50]: 🔍
      - article [ref=e51]:
        - generic [ref=e52]:
          - button "Click para ampliar imagen" [ref=e55] [cursor=pointer]
          - generic [ref=e56]:
            - generic [ref=e57]: 21 de junio de 2025
            - heading "Fiesta de la Luz" [level=3] [ref=e58]
            - paragraph [ref=e59]: En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz.
            - iframe [ref=e61]:
              - generic [active] [ref=f1e1]:
                - generic "YouTube Video Player" [ref=f1e3]
                - generic [ref=f1e5]:
                  - generic:
                    - generic:
                      - button "Play video" [ref=f1e10] [cursor=pointer]
                      - button "Hide player controls" [ref=f1e12] [cursor=pointer]
                      - generic [ref=f1e19]:
                        - generic [ref=f1e20]:
                          - link "Fiesta de la Luz" [ref=f1e21] [cursor=pointer]:
                            - /url: https://www.youtube.com/watch?v=eOsbR_QoNAY
                          - link "waldorftrekanpv" [ref=f1e22] [cursor=pointer]:
                            - /url: /channel/UCB6XxnEIiPucekFbSXKrlaw
                            - generic [ref=f1e23]: waldorftrekanpv
                        - generic [ref=f1e24]:
                          - button [ref=f1e25] [cursor=pointer]
                          - generic [ref=f1e27]:
                            - generic: waldorftrekanpv
                            - generic: 2 subscribers
      - article [ref=e62]:
        - generic [ref=e63]:
          - button "Click para ampliar imagen" [ref=e66] [cursor=pointer]
          - generic [ref=e67]:
            - generic [ref=e68]: 5 de Marzo de 2025
            - heading "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [level=3] [ref=e69]
            - paragraph [ref=e70]: "Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se unieran para educar?"
            - generic [ref=e71]:
              - button "Ver imagen 1" [ref=e72] [cursor=pointer]:
                - img "Foto 1" [ref=e74]
                - generic [ref=e75]: 🔍
              - button "Ver imagen 2" [ref=e76] [cursor=pointer]:
                - img "Foto 2" [ref=e78]
                - generic [ref=e79]: 🔍
            - iframe [ref=e81]:
              - generic [active] [ref=f2e1]:
                - generic "YouTube Video Player" [ref=f2e3]
                - generic [ref=f2e5]:
                  - generic:
                    - generic:
                      - button "Play video" [ref=f2e10] [cursor=pointer]
                      - button "Hide player controls" [ref=f2e12] [cursor=pointer]
                      - generic [ref=f2e19]:
                        - generic [ref=f2e20]:
                          - link "Apertura Colegio Waldorf Trekan 2025" [ref=f2e21] [cursor=pointer]:
                            - /url: https://www.youtube.com/watch?v=Sy4PO2UIy2w
                          - link "waldorftrekanpv" [ref=f2e22] [cursor=pointer]:
                            - /url: /channel/UCB6XxnEIiPucekFbSXKrlaw
                            - generic [ref=f2e23]: waldorftrekanpv
                        - generic [ref=f2e24]:
                          - button [ref=f2e25] [cursor=pointer]
                          - generic [ref=f2e27]:
                            - generic: waldorftrekanpv
                            - generic: 2 subscribers
      - article [ref=e82]:
        - generic [ref=e83]:
          - button "Click para ampliar imagen" [ref=e86] [cursor=pointer]
          - generic [ref=e87]:
            - generic [ref=e88]: 20 de Febrero de 2025
            - heading "Construyendo y Embelleciendo Nuestro Colegio" [level=3] [ref=e89]
            - paragraph [ref=e90]: "En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir a nuestras niñas, niños y familias."
            - generic [ref=e91]:
              - button "Ver imagen 1" [ref=e92] [cursor=pointer]:
                - img "Foto 1" [ref=e94]
                - generic [ref=e95]: 🔍
              - button "Ver imagen 2" [ref=e96] [cursor=pointer]:
                - img "Foto 2" [ref=e98]
                - generic [ref=e99]: 🔍
  - contentinfo [ref=e100]:
    - generic [ref=e101]:
      - paragraph [ref=e102]: © 2026 Colegio Waldorf Trekan - Puerto Varas
      - paragraph [ref=e103]: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
  - dialog "Contacto WhatsApp":
    - generic:
      - img "Ivonne Parada A."
      - generic:
        - generic: Ivonne Parada A.
        - generic: Coordinadora General
      - button "Cerrar": ✕
    - generic:
      - paragraph: Hola 👋 Escríbeme directamente, con gusto respondo tus preguntas sobre el colegio o agenda tu visita.
      - link "Enviar mensaje":
        - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20el%20Colegio%20Waldorf%20Trekan
        - img
        - text: Enviar mensaje
  - button "Contactar por WhatsApp" [ref=e104] [cursor=pointer]:
    - img "WhatsApp Trekan" [ref=e105]
  - generic: ¿Tienes dudas? Pregúntame 🌱
  - button "Abrir asistente virtual Trekan" [ref=e106] [cursor=pointer]:
    - img
  - dialog:
    - generic:
      - generic:
        - generic:
          - img
        - generic:
          - heading [level=4]: Asistente Trekan
          - generic: En línea
      - button: ×
  - dialog "Aviso de cookies" [ref=e107]:
    - paragraph [ref=e108]:
      - text: 🍪 Usamos cookies para mejorar tu visita.
      - link "Saber más" [ref=e109] [cursor=pointer]:
        - /url: https://policies.google.com/privacy
    - generic [ref=e110]:
      - button "Rechazar" [ref=e111] [cursor=pointer]
      - button "Aceptar" [ref=e112] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.beforeEach(async ({ page }) => {
  4   |   await page.goto('/noticias.html');
  5   | });
  6   | 
  7   | test.describe('Asymmetric Masonry Grid Layout (Tier 1)', () => {
  8   |   test('test_masonry_grid_exists: grid container should be visible', async ({ page }) => {
  9   |     const grid = page.locator('.cms-archivo-grid');
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
> 52  |     const chipText = await inactiveChip.innerText();
      |                                         ^ Error: locator.innerText: Test timeout of 30000ms exceeded.
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
  110 |     await expect(lightbox).toHaveClass(/open/);
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