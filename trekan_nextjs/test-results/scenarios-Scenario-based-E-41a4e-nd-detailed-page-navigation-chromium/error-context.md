# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenarios.spec.ts >> Scenario-based E2E Verification (Tier 4) >> test_journey_news_navigation_and_details: news list and detailed page navigation
- Location: tests\scenarios.spec.ts:84:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 60000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://127.0.0.1:3000/noticias/2026-04-29-escuela-para-padres-el-ritmo-y-la-respiraci%C3%B3n-en-el-hogar"
  navigated to "http://127.0.0.1:3000/noticias/2026-04-29-escuela-para-padres-el-ritmo-y-la-respiraci%C3%B3n-en-el-hogar"
  navigated to "http://127.0.0.1:3000/noticias/2026-04-29-escuela-para-padres-el-ritmo-y-la-respiraci%C3%B3n-en-el-hogar"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - link "Colegio Waldorf Trekan Colegio Waldorf Trekan" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Colegio Waldorf Trekan" [ref=e6]
        - generic [ref=e7]:
          - generic [ref=e8]: Colegio Waldorf
          - generic [ref=e9]: Trekan
      - generic [ref=e10]:
        - link "Inicio" [ref=e11] [cursor=pointer]:
          - /url: /
        - button "Nosotros" [ref=e13]:
          - text: Nosotros
          - img [ref=e14]
        - button "Admisión 2026" [ref=e17]:
          - text: Admisión 2026
          - img [ref=e18]
        - link "Arriendo de Salón" [ref=e20] [cursor=pointer]:
          - /url: /arriendo-salon
        - link "Contacto" [ref=e21] [cursor=pointer]:
          - /url: /#contacto
        - generic [ref=e22]:
          - button "ES" [ref=e23]
          - generic [ref=e24]: "|"
          - button "DE" [ref=e25]
          - generic [ref=e26]: "|"
          - button "EN" [ref=e27]
    - article [ref=e28]:
      - link "Volver a noticias" [ref=e29] [cursor=pointer]:
        - /url: /#noticias
        - img [ref=e30]
        - text: Volver a noticias
      - generic [ref=e32]:
        - time [ref=e33]:
          - img [ref=e34]
          - text: 28 de abril de 2026
        - 'heading "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [level=1] [ref=e36]'
      - 'img "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [ref=e38]'
      - generic [ref=e39]:
        - paragraph [ref=e40]: "El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritmo diario en el hogar, comprendido como una respiración: momentos de actividad (inhalación) y momentos de descanso (exhalación), que brindan seguridad, contención y calidez a nuestros niños."
        - paragraph [ref=e41]: Durante la jornada se abrió un espacio de diálogo cercano, donde las familias pudieron compartir sus conocimientos, experiencias e inquietudes. A partir de preguntas como ¿qué saben sobre la pedagogía Waldorf?, surgieron diversas reflexiones, dudas e intereses en torno a este enfoque educativo.
        - paragraph [ref=e42]: Asimismo, se abordó el tema del uso de pantallas en la vida cotidiana de los niños, generando una conversación en torno a sus efectos, límites y desafíos dentro del hogar.
        - paragraph [ref=e43]: Este espacio permitió fortalecer el vínculo entre familia y escuela, acogiendo las preguntas e inquietudes de la comunidad, y abriendo caminos para seguir profundizando en estos temas en futuros encuentros.
    - generic [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - generic [ref=e47]:
            - generic [ref=e48]: T
            - generic [ref=e49]: TREKAN
          - paragraph [ref=e50]: Un espacio educativo independiente inspirado en la pedagogía Waldorf, comprometido con el florecimiento libre e íntegro de la infancia en el sur de Chile.
          - generic [ref=e51]:
            - link [ref=e52] [cursor=pointer]:
              - /url: https://www.instagram.com/waldorftrekanpv/
              - img [ref=e53]
            - link [ref=e56] [cursor=pointer]:
              - /url: https://www.facebook.com/profile.php?id=61573063135723
              - img [ref=e57]
        - generic [ref=e59]:
          - heading "Contacto" [level=4] [ref=e60]
          - list [ref=e61]:
            - listitem [ref=e62]:
              - img [ref=e63]
              - generic [ref=e65]: +56 9 6776 5106
            - listitem [ref=e66]:
              - img [ref=e67]
              - link "admision@colegiowaldorftrekan.cl" [ref=e70] [cursor=pointer]:
                - /url: https://mail.google.com/mail/?view=cm&fs=1&to=admision@colegiowaldorftrekan.cl&su=Contacto%20Sitio%20Web
            - listitem [ref=e71]:
              - img [ref=e72]
              - generic [ref=e75]: Las Azaleas 96, Parque Ivian 1, Puerto Varas
        - generic [ref=e76]:
          - heading "Navegación" [level=4] [ref=e77]
          - list [ref=e78]:
            - listitem [ref=e79]:
              - link "Quiénes Somos" [ref=e80] [cursor=pointer]:
                - /url: /#quienes-somos
            - listitem [ref=e81]:
              - link "Pedagogía Waldorf" [ref=e82] [cursor=pointer]:
                - /url: /#pedagogia
            - listitem [ref=e83]:
              - link "Admisión 2026" [ref=e84] [cursor=pointer]:
                - /url: /#admision
            - listitem [ref=e85]:
              - link "Arriendo de Salón" [ref=e86] [cursor=pointer]:
                - /url: /arriendo-salon
      - generic [ref=e87]:
        - paragraph [ref=e88]: © 2026 Colegio Waldorf Trekan - Puerto Varas
        - paragraph [ref=e89]: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
        - link "Directorio de Recursos Waldorf y Antroposóficos en Chile" [ref=e90] [cursor=pointer]:
          - /url: /recursos-waldorf-chile
  - generic [ref=e92]:
    - generic [ref=e93]: ¿Tienes dudas? ¡Escríbeme! 👋
    - button "Contactar por WhatsApp" [ref=e95]:
      - img [ref=e96]
  - button "Abrir Chat" [ref=e101]:
    - img [ref=e103]
  - alert [ref=e105]: Colegio Waldorf Trekan | Educación y Armonía - Puerto Varas
  - img [ref=e108]
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
  8   |     
  9   |     // 2. Click the second FAQ button to expand it (the first is open by default)
  10  |     const faqSection = page.locator('#faq');
  11  |     const secondQuestion = faqSection.locator('button').nth(1);
  12  |     await secondQuestion.click();
  13  |     
  14  |     // Wait for animation
  15  |     await page.waitForTimeout(500);
  16  |     
  17  |     // Verify the second answer is visible
  18  |     const secondAnswer = faqSection.locator('text=Funcionamos con un máximo de 16');
  19  |     await expect(secondAnswer).toBeVisible();
  20  |     
  21  |     // 3. Click Admission link in Navbar to navigate
  22  |     // First click the dropdown trigger to make the link visible and clickable
  23  |     const dropdownTrigger = page.locator('button:has-text("Admisión 2026")').first();
  24  |     await dropdownTrigger.click();
  25  |     
  26  |     const admissionLink = page.locator('a[href="/admision"]').first();
  27  |     await admissionLink.click();
  28  |     await expect(page).toHaveURL(/\/admision/);
  29  |     
  30  |     // 4. Fill and submit admission form
  31  |     await page.locator('input[name="parentName"]').fill('Test Father');
  32  |     await page.locator('input[name="childrenAges"]').fill('6 years');
  33  |     await page.locator('textarea[name="message"]').fill('Hello Waldorf!');
  34  |     await page.locator('button:has-text("Martes")').click();
  35  | 
  36  |     // Mock window.open to capture the WhatsApp redirection URL
  37  |     let openedUrl = '';
  38  |     await page.exposeFunction('mockWindowOpen', (url: string) => {
  39  |       openedUrl = url;
  40  |     });
  41  |     await page.evaluate(() => {
  42  |       window.open = (url) => {
  43  |         (window as any).mockWindowOpen(url);
  44  |         return null;
  45  |       };
  46  |     });
  47  | 
  48  |     // Submit form
  49  |     await page.locator('button[type="submit"]:has-text("Conversar con Ivonne")').click();
  50  |     await page.waitForTimeout(500);
  51  | 
  52  |     // Verify WhatsApp API link was opened with filled values
  53  |     expect(openedUrl).toContain('wa.me/56967765106');
  54  |     expect(openedUrl).toContain('Test%20Father');
  55  |     expect(openedUrl).toContain('Martes');
  56  |   });
  57  | 
  58  |   test('test_journey_booking_with_dynamic_quote: select dates + services -> verify total price', async ({ page }) => {
  59  |     await page.goto('/arriendo-salon');
  60  |     
  61  |     // Set a date and time for 3 hours (3 * $10,000 = $30,000 base cost)
  62  |     const todayStr = new Date().toISOString().split('T')[0];
  63  |     await page.locator('input[type="date"]').fill(todayStr);
  64  |     await page.locator('input[type="time"]').first().fill('10:00');
  65  |     await page.locator('input[type="time"]').last().fill('13:00');
  66  |     
  67  |     await page.waitForTimeout(500);
  68  |     
  69  |     // Verify total is $30.000 initially
  70  |     const totalPayText = page.locator('text=Total a pagar').locator('..').locator('p.text-[var(--color-waldorf-mustard)]');
  71  |     await expect(totalPayText).toContainText('$30.000');
  72  |     
  73  |     // Go to step 2 (Servicios adicionales)
  74  |     await page.locator('button:has-text("Siguiente")').click();
  75  |     
  76  |     // Try to toggle "Kit Audiovisual Completo (+$20.000)"
  77  |     await page.locator('text=Kit Audiovisual Completo').click();
  78  |     
  79  |     // Expected total: $50.000 (Calculated dynamically)
  80  |     // This is expected to FAIL because step 2 selection is broken and doesn't change state/price.
  81  |     await expect(totalPayText).toContainText('$50.000');
  82  |   });
  83  | 
  84  |   test('test_journey_news_navigation_and_details: news list and detailed page navigation', async ({ page }) => {
  85  |     await page.goto('/noticias');
  86  |     
  87  |     // Find the first news article card and select it
  88  |     const articleLink = page.locator('main.min-h-screen a[href^="/noticias/"]').first();
  89  |     await expect(articleLink).toBeVisible();
  90  |     
  91  |     const href = await articleLink.getAttribute('href');
  92  |     const decodedHref = decodeURIComponent(href || '');
  93  |     
  94  |     // Click the article link
  95  |     await articleLink.click();
  96  |     
  97  |     // Wait for URL to match either encoded or decoded version
> 98  |     await page.waitForURL(url => url.pathname === decodedHref || url.pathname === href);
      |                ^ Error: page.waitForURL: Test timeout of 60000ms exceeded.
  99  |     
  100 |     // Details page contains the main header title
  101 |     const articleTitle = page.locator('h1');
  102 |     await expect(articleTitle).toBeVisible();
  103 |     
  104 |     // Back link is visible
  105 |     const backBtn = page.locator('text=Volver a noticias');
  106 |     await expect(backBtn).toBeVisible();
  107 |   });
  108 | });
  109 | 
```