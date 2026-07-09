# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenarios.spec.ts >> Scenario-based E2E Verification (Tier 4) >> test_journey_news_navigation_and_details: news list and detailed page navigation
- Location: tests\scenarios.spec.ts:77:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('main.min-h-screen a[href^="/noticias/"]').first()
    - locator resolved to <a href="/noticias/2026-04-29-escuela-para-padres-el-ritmo-y-la-respiración-en-el-hogar">…</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <img loading="lazy" decoding="async" data-nimg="fill" alt="Construyendo y Embelleciendo Nuestro Colegio" src="/_next/image?url=%2Fimages%2Fnoticia3.webp&w=3840&q=75" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" class="object-cover transition-transform duration-700 group-hover:scale-105" srcset="/_next/image?url=%2Fimages%2Fnoticia3.webp&w=256&q=75 256w, /_next/image?url=%2Fimages%2Fnoticia3.webp&w=384&q=75 384w, /_next/image?url=%2Fimages%2Fnoticia3.webp&w=640&q=75 640w, /_next/…/> from <a href="/noticias/2025-02-20-construyendo">…</a> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <img loading="lazy" decoding="async" data-nimg="fill" alt="Construyendo y Embelleciendo Nuestro Colegio" src="/_next/image?url=%2Fimages%2Fnoticia3.webp&w=3840&q=75" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" class="object-cover transition-transform duration-700 group-hover:scale-105" srcset="/_next/image?url=%2Fimages%2Fnoticia3.webp&w=256&q=75 256w, /_next/image?url=%2Fimages%2Fnoticia3.webp&w=384&q=75 384w, /_next/image?url=%2Fimages%2Fnoticia3.webp&w=640&q=75 640w, /_next/…/> from <a href="/noticias/2025-02-20-construyendo">…</a> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    100 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
        - done scrolling
        - <img loading="lazy" decoding="async" data-nimg="fill" alt="Construyendo y Embelleciendo Nuestro Colegio" src="/_next/image?url=%2Fimages%2Fnoticia3.webp&w=3840&q=75" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" class="object-cover transition-transform duration-700 group-hover:scale-105" srcset="/_next/image?url=%2Fimages%2Fnoticia3.webp&w=256&q=75 256w, /_next/image?url=%2Fimages%2Fnoticia3.webp&w=384&q=75 384w, /_next/image?url=%2Fimages%2Fnoticia3.webp&w=640&q=75 640w, /_next/…/> from <a href="/noticias/2025-02-20-construyendo">…</a> subtree intercepts pointer events
      - retrying click action
        - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - link "Colegio Waldorf Trekan Colegio WaldorfTrekan" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Colegio Waldorf Trekan" [ref=e5]
        - generic [ref=e6]: Colegio WaldorfTrekan
      - generic [ref=e7]:
        - link "Inicio" [ref=e8] [cursor=pointer]:
          - /url: /
        - generic [ref=e9]:
          - button "Nosotros" [ref=e10]:
            - text: Nosotros
            - img [ref=e11]
          - generic [ref=e13]:
            - link "Quiénes Somos" [ref=e14] [cursor=pointer]:
              - /url: /#quienes-somos
            - link "Pedagogía Waldorf" [ref=e15] [cursor=pointer]:
              - /url: /#pedagogia
            - link "Recursos Waldorf" [ref=e16] [cursor=pointer]:
              - /url: /recursos
            - link "Comunidad" [ref=e17] [cursor=pointer]:
              - /url: /#comunidad
            - link "Actividades" [ref=e18] [cursor=pointer]:
              - /url: /#actividades
            - link "Noticias" [ref=e19] [cursor=pointer]:
              - /url: /noticias
        - generic [ref=e20]:
          - button "Admisión 2026" [ref=e21]:
            - text: Admisión 2026
            - img [ref=e22]
          - generic [ref=e24]:
            - link "Valores y Aranceles" [ref=e25] [cursor=pointer]:
              - /url: /admision
            - link "Preguntas Frecuentes" [ref=e26] [cursor=pointer]:
              - /url: /admision#faq
        - link "Arriendo de Salón" [ref=e27] [cursor=pointer]:
          - /url: /arriendo-salon
        - link "Contacto" [ref=e28] [cursor=pointer]:
          - /url: /#contacto
        - generic [ref=e29]:
          - button "ES" [ref=e30]
          - text: "|"
          - button "DE" [ref=e31]
          - text: "|"
          - button "EN" [ref=e32]
      - button [ref=e33]:
        - img [ref=e34]
    - generic [ref=e35]:
      - generic [ref=e36]:
        - heading "Vida Escolar y Noticias" [level=1] [ref=e37]
        - paragraph [ref=e38]: Reflexiones pedagógicas, crónicas de nuestras festividades y el día a día de nuestra comunidad educativa en el sur de Chile.
      - generic [ref=e39]:
        - link [ref=e40] [cursor=pointer]:
          - /url: /noticias/2026-04-29-escuela-para-padres-el-ritmo-y-la-respiración-en-el-hogar
          - article [ref=e41]:
            - 'img "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [ref=e42]'
            - generic [ref=e43]:
              - time [ref=e44]:
                - img [ref=e45]
                - text: 28 de abril de 2026
              - 'heading "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [level=3] [ref=e47]'
              - paragraph [ref=e48]: El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritm...
              - generic [ref=e49]:
                - text: Leer artículo completo
                - img [ref=e50]
        - link [ref=e52] [cursor=pointer]:
          - /url: /noticias/2026-04-20-fiesta-de-la-luz
          - article [ref=e53]:
            - img "Fiesta de la Luz" [ref=e54]
            - generic [ref=e55]:
              - time [ref=e56]:
                - img [ref=e57]
                - text: 19 de abril de 2026
              - heading "Fiesta de la Luz" [level=3] [ref=e59]
              - paragraph [ref=e60]: En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz. ...
              - generic [ref=e61]:
                - text: Leer artículo completo
                - img [ref=e62]
        - link [ref=e64] [cursor=pointer]:
          - /url: /noticias/2025-03-05-inauguracion
          - article [ref=e65]:
            - img "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [ref=e66]
            - generic [ref=e67]:
              - time [ref=e68]:
                - img [ref=e69]
                - text: 4 de marzo de 2025
              - heading "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [level=3] [ref=e71]
              - paragraph [ref=e72]: "Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se uni..."
              - generic [ref=e73]:
                - text: Leer artículo completo
                - img [ref=e74]
        - link [ref=e76] [cursor=pointer]:
          - /url: /noticias/2025-02-20-construyendo
          - article [ref=e77]:
            - img "Construyendo y Embelleciendo Nuestro Colegio" [ref=e78]
            - generic [ref=e79]:
              - time [ref=e80]:
                - img [ref=e81]
                - text: 19 de febrero de 2025
              - heading "Construyendo y Embelleciendo Nuestro Colegio" [level=3] [ref=e83]
              - paragraph [ref=e84]: "En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir..."
              - generic [ref=e85]:
                - text: Leer artículo completo
                - img [ref=e86]
    - generic [ref=e88]:
      - generic [ref=e89]:
        - generic [ref=e90]:
          - generic [ref=e91]:
            - generic [ref=e92]: T
            - text: TREKAN
          - paragraph [ref=e93]: Un espacio educativo independiente inspirado en la pedagogía Waldorf, comprometido con el florecimiento libre e íntegro de la infancia en el sur de Chile.
          - generic [ref=e94]:
            - link [ref=e95] [cursor=pointer]:
              - /url: https://www.instagram.com/waldorftrekanpv/
              - img [ref=e96]
            - link [ref=e99] [cursor=pointer]:
              - /url: https://www.facebook.com/profile.php?id=61573063135723
              - img [ref=e100]
        - generic [ref=e102]:
          - heading "Contacto" [level=4] [ref=e103]
          - list [ref=e104]:
            - listitem [ref=e105]:
              - img [ref=e106]
              - text: +56 9 6776 5106
            - listitem [ref=e108]:
              - img [ref=e109]
              - link "admision@colegiowaldorftrekan.cl" [ref=e112] [cursor=pointer]:
                - /url: https://mail.google.com/mail/?view=cm&fs=1&to=admision@colegiowaldorftrekan.cl&su=Contacto%20Sitio%20Web
            - listitem [ref=e113]:
              - img [ref=e114]
              - text: Las Azaleas 96, Parque Ivian 1, Puerto Varas
        - generic [ref=e117]:
          - heading "Navegación" [level=4] [ref=e118]
          - list [ref=e119]:
            - listitem [ref=e120]:
              - link "Quiénes Somos" [ref=e121] [cursor=pointer]:
                - /url: /#quienes-somos
            - listitem [ref=e122]:
              - link "Pedagogía Waldorf" [ref=e123] [cursor=pointer]:
                - /url: /#pedagogia
            - listitem [ref=e124]:
              - link "Admisión 2026" [ref=e125] [cursor=pointer]:
                - /url: /#admision
            - listitem [ref=e126]:
              - link "Arriendo de Salón" [ref=e127] [cursor=pointer]:
                - /url: /arriendo-salon
      - generic [ref=e128]:
        - paragraph [ref=e129]: © 2026 Colegio Waldorf Trekan - Puerto Varas
        - paragraph [ref=e130]: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
        - link "Directorio de Recursos Waldorf y Antroposóficos en Chile" [ref=e131] [cursor=pointer]:
          - /url: /recursos
  - button "Contactar por WhatsApp" [ref=e134]:
    - img [ref=e135]
  - generic [ref=e138]:
    - generic [ref=e139]: ¿Dudas? ¡Pregúntame! 🌱
    - button "Abrir Chat" [ref=e140]:
      - generic [ref=e141]:
        - img [ref=e142]
        - text: Hablemos
      - text: "1"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Scenario-based E2E Verification (Tier 4)', () => {
  4   |   
  5   |   test('test_journey_home_to_faq_to_admission_submit: navigate home -> FAQ -> Admission form', async ({ page }) => {
  6   |     // 1. Visit home page
  7   |     await page.goto('/');
  8   |     await page.waitForTimeout(1000); // Hydration safety
  9   |     
  10  |     // 2. Click the second FAQ button to expand it (the first is open by default)
  11  |     const faqSection = page.locator('#faq');
  12  |     const secondQuestion = faqSection.locator('button').nth(1);
  13  |     await secondQuestion.click();
  14  |     
  15  |     // Wait for animation
  16  |     await page.waitForTimeout(500);
  17  |     
  18  |     // Verify the second answer is visible
  19  |     const secondAnswer = faqSection.locator('text=Funcionamos con un máximo de 16');
  20  |     await expect(secondAnswer).toBeVisible();
  21  |     
  22  |     // 3. Click Admission link in Navbar to navigate
  23  |     // First click the dropdown trigger to make the link visible and clickable
  24  |     const dropdownTrigger = page.locator('button:has-text("Admisión 2026")').first();
  25  |     await dropdownTrigger.click();
  26  |     
  27  |     const admissionLink = page.locator('a[href="/admision"]').first();
  28  |     await admissionLink.click();
  29  |     await expect(page).toHaveURL(/\/admision/);
  30  |     
  31  |     // 4. Fill and submit admission form
  32  |     await page.locator('input[name="parentName"]').fill('Test Father');
  33  |     await page.locator('input[name="childrenAges"]').fill('6 years');
  34  |     await page.locator('textarea[name="message"]').fill('Hello Waldorf!');
  35  |     await page.locator('button:has-text("Martes")').click();
  36  | 
  37  |     // Submit form and wait for popup window/tab redirect
  38  |     const [popup] = await Promise.all([
  39  |       page.waitForEvent('popup'),
  40  |       page.locator('button[type="submit"]:has-text("Conversar con Ivonne")').click()
  41  |     ]);
  42  | 
  43  |     // Verify WhatsApp URL
  44  |     const openedUrl = popup.url();
  45  |     expect(openedUrl).toContain('56967765106');
  46  |     expect(decodeURIComponent(openedUrl).replace(/\+/g, ' ')).toContain('Test Father');
  47  |     expect(openedUrl).toContain('Martes');
  48  |   });
  49  | 
  50  |   test('test_journey_booking_with_dynamic_quote: select dates + services -> verify total price', async ({ page }) => {
  51  |     await page.goto('/arriendo-salon');
  52  |     await page.waitForTimeout(1000); // Hydration safety
  53  |     
  54  |     // Set a date and time for 3 hours (3 * $10,000 = $30,000 base cost)
  55  |     const todayStr = new Date().toISOString().split('T')[0];
  56  |     await page.locator('input[type="date"]').fill(todayStr);
  57  |     await page.locator('input[type="time"]').nth(0).fill('10:00');
  58  |     await page.locator('input[type="time"]').nth(1).fill('13:00');
  59  |     
  60  |     await page.waitForTimeout(500);
  61  |     
  62  |     // Verify total is $30.000 initially
  63  |     const totalPayText = page.locator('text=Total a pagar').locator('..').locator('p').nth(1);
  64  |     await expect(totalPayText).toContainText('$30.000');
  65  |     
  66  |     // Go to step 2 (Servicios adicionales)
  67  |     await page.locator('button:has-text("Siguiente")').click();
  68  |     
  69  |     // Try to toggle "Kit Audiovisual Completo (+$20.000)"
  70  |     await page.locator('text=Kit Audiovisual Completo').click();
  71  |     
  72  |     // Expected total: $50.000 (Calculated dynamically)
  73  |     // This is expected to FAIL because step 2 selection is broken and doesn't change state/price.
  74  |     await expect(totalPayText).toContainText('$50.000');
  75  |   });
  76  | 
  77  |   test('test_journey_news_navigation_and_details: news list and detailed page navigation', async ({ page }) => {
  78  |     await page.goto('/noticias');
  79  |     await page.waitForTimeout(1000); // Hydration safety
  80  |     
  81  |     // Find the first news article card and select it
  82  |     const articleLink = page.locator('main.min-h-screen a[href^="/noticias/"]').first();
  83  |     await expect(articleLink).toBeVisible();
  84  |     
  85  |     const href = await articleLink.getAttribute('href');
  86  |     const decodedHref = decodeURIComponent(href || '');
  87  |     
  88  |     // Click the article link
> 89  |     await articleLink.click();
      |                       ^ Error: locator.click: Test timeout of 60000ms exceeded.
  90  |     
  91  |     // Wait for URL to match either encoded or decoded version
  92  |     await page.waitForURL(url => decodeURIComponent(url.pathname) === decodedHref);
  93  |     
  94  |     // Details page contains the main header title
  95  |     const articleTitle = page.locator('h1');
  96  |     await expect(articleTitle).toBeVisible();
  97  |     
  98  |     // Back link is visible
  99  |     const backBtn = page.locator('text=Volver a noticias');
  100 |     await expect(backBtn).toBeVisible();
  101 |   });
  102 | });
  103 | 
```