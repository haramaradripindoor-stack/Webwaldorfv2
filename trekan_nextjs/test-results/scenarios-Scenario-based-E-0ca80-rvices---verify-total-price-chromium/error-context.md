# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenarios.spec.ts >> Scenario-based E2E Verification (Tier 4) >> test_journey_booking_with_dynamic_quote: select dates + services -> verify total price
- Location: tests\scenarios.spec.ts:50:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('text=Total a pagar').locator('..').locator('p').nth(1)
Expected substring: "$30.000"
Received string:    "$0"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('text=Total a pagar').locator('..').locator('p').nth(1)
    13 × locator resolved to <p class="text-4xl font-serif font-bold text-[var(--color-waldorf-mustard)]">$0</p>
       - unexpected value "$0"

```

```yaml
- paragraph: $0
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
> 64  |     await expect(totalPayText).toContainText('$30.000');
      |                                ^ Error: expect(locator).toContainText(expected) failed
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
  89  |     await articleLink.click();
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