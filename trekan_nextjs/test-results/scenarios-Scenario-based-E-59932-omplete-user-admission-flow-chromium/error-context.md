# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenarios.spec.ts >> Scenario-based E2E Verification (Tier 4) >> test_scenario_admission_funnel_journey: complete user admission flow
- Location: tests\scenarios.spec.ts:116:7

# Error details

```
Error: expect(locator).not.toHaveClass(expected) failed

Locator: locator('#cookie-banner')
Expected pattern: not /visible/
Received string: "visible"
Timeout: 5000ms

Call log:
  - Expect "not toHaveClass" with timeout 5000ms
  - waiting for locator('#cookie-banner')
    13 × locator resolved to <div role="dialog" class="visible" id="cookie-banner" aria-label="Aviso de cookies">…</div>
       - unexpected value "visible"

```

```yaml
- dialog "Aviso de cookies":
  - paragraph
  - button "Rechazar"
  - button "Aceptar"
```

# Test source

```ts
  28  |     expect(await hiddenCards.count()).toBeLessThanOrEqual(totalCards);
  29  |   });
  30  | 
  31  |   test('test_scenario_image_modal_full_interaction: open lightbox, navigate images, toggle zoom, close lightbox', async ({ page }) => {
  32  |     await page.goto('/index.html');
  33  |     
  34  |     // 1. Locate gallery image thumbnail inside news card
  35  |     const firstThumb = page.locator('.cms-gallery-thumb').first();
  36  |     await firstThumb.click();
  37  |     await page.waitForTimeout(500);
  38  |     
  39  |     // Lightbox is open
  40  |     const lightbox = page.locator('#cms-lightbox');
  41  |     await expect(lightbox).toHaveClass(/open/);
  42  |     
  43  |     // 2. Press arrow right to navigate to next image
  44  |     const imgBefore = await lightbox.locator('img').getAttribute('src');
  45  |     await page.keyboard.press('ArrowRight');
  46  |     await page.waitForTimeout(500);
  47  |     
  48  |     const imgAfter = await lightbox.locator('img').getAttribute('src');
  49  |     expect(imgBefore).not.toBe(imgAfter);
  50  |     
  51  |     // 3. Close the lightbox
  52  |     const closeBtn = lightbox.locator('.cms-lb-close');
  53  |     await closeBtn.click();
  54  |     await page.waitForTimeout(500);
  55  |     await expect(lightbox).not.toHaveClass(/open/);
  56  |   });
  57  | 
  58  |   test('test_scenario_contact_form_feedback: fill and submit form, verify submit button displays loading feedback', async ({ page }) => {
  59  |     await page.goto('/index.html');
  60  |     
  61  |     // 1. Fill out the contact form fields
  62  |     await page.locator('#contact-name').fill('John Doe');
  63  |     await page.locator('#contact-email').fill('john@example.com');
  64  |     await page.locator('#contact-phone').fill('+56999999999');
  65  |     await page.locator('#contact-subject').selectOption('Visita al colegio');
  66  |     await page.locator('#contact-message').fill('Me gustaría agendar una visita al colegio.');
  67  |     
  68  |     // 2. Mock form submission behavior to prevent redirect page reload
  69  |     await page.evaluate(() => {
  70  |       const form = document.getElementById('contact-form');
  71  |       if (form) {
  72  |         form.addEventListener('submit', (e) => {
  73  |           e.preventDefault(); // Stop redirection
  74  |         });
  75  |       }
  76  |     });
  77  |     
  78  |     // 3. Click submit
  79  |     const submitBtn = page.locator('.contact-submit');
  80  |     await submitBtn.click();
  81  |     
  82  |     // 4. Verify text changes to "Enviando..." and is disabled
  83  |     await expect(submitBtn).toHaveText('Enviando...');
  84  |     await expect(submitBtn).toBeDisabled();
  85  |   });
  86  | 
  87  |   test('test_scenario_chatbot_complete_interaction: open chatbot, select quick reply, verify KB response rendering', async ({ page }) => {
  88  |     await page.goto('/index.html');
  89  |     
  90  |     const bubble = page.locator('#trekan-bot-bubble');
  91  |     const panel = page.locator('#trekan-bot-panel');
  92  |     const chatInput = page.locator('#trekan-bot-input');
  93  |     const sendBtn = page.locator('#trekan-bot-send');
  94  |     
  95  |     // 1. Open the chatbot
  96  |     await bubble.click();
  97  |     await expect(panel).toHaveClass(/open/);
  98  |     
  99  |     // 2. Click a quick reply chip (e.g., "¿Cuáles son los aranceles 2026?")
  100 |     const quickReply = page.locator('.chat-quick-replies .chat-chip').first();
  101 |     const replyText = await quickReply.innerText();
  102 |     
  103 |     await quickReply.click();
  104 |     
  105 |     // 3. Verify user message is rendered in chat body
  106 |     const userMsg = page.locator('.chat-msg.user').last();
  107 |     await expect(userMsg).toContainText(replyText);
  108 |     
  109 |     // 4. Verify bot response is received (either KB info or fallback)
  110 |     await page.waitForTimeout(1000); // Wait for chatbot delay
  111 |     const botMsg = page.locator('.chat-msg.bot').last();
  112 |     await expect(botMsg).toBeVisible();
  113 |     await expect(botMsg).toContainText(/Aranceles|aranceles|Matrícula|matrícula/i);
  114 |   });
  115 | 
  116 |   test('test_scenario_admission_funnel_journey: complete user admission flow', async ({ page }) => {
  117 |     await page.goto('/index.html');
  118 |     
  119 |     // 1. Accept cookies
  120 |     const cookieBanner = page.locator('#cookie-banner');
  121 |     // Wait for banner to be visible
  122 |     await page.waitForTimeout(4000); // banner template has 3.5s delay
  123 |     await expect(cookieBanner).toHaveClass(/visible/);
  124 |     
  125 |     const acceptBtn = page.locator('#cookie-accept');
  126 |     await acceptBtn.click();
  127 |     await page.waitForTimeout(500);
> 128 |     await expect(cookieBanner).not.toHaveClass(/visible/);
      |                                    ^ Error: expect(locator).not.toHaveClass(expected) failed
  129 |     
  130 |     // 2. View FAQ Item
  131 |     const faqItem = page.locator('.faq-item').first();
  132 |     const faqQuestion = faqItem.locator('.faq-question');
  133 |     const faqAnswer = faqItem.locator('.faq-answer');
  134 |     
  135 |     await faqQuestion.click();
  136 |     await page.waitForTimeout(500);
  137 |     await expect(faqItem).toHaveClass(/active/);
  138 |     
  139 |     // 3. Click Admission CTA to check redirect
  140 |     // We target the Conocer admisión button
  141 |     const admissionBtn = page.locator('a[href="/admision.html"]').first();
  142 |     await expect(admissionBtn).toBeVisible();
  143 |   });
  144 | });
  145 | 
```