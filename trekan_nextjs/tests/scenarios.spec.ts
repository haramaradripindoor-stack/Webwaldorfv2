import { test, expect } from '@playwright/test';

test.describe('Scenario-based E2E Verification (Tier 4)', () => {
  
  test('test_journey_home_to_faq_to_admission_submit: navigate home -> FAQ -> Admission form', async ({ page }) => {
    // 1. Visit home page
    await page.goto('/');
    
    // 2. Click the second FAQ button to expand it (the first is open by default)
    const faqSection = page.locator('#faq');
    const secondQuestion = faqSection.locator('button').nth(1);
    await secondQuestion.click();
    
    // Wait for animation
    await page.waitForTimeout(500);
    
    // Verify the second answer is visible
    const secondAnswer = faqSection.locator('text=Funcionamos con un máximo de 16');
    await expect(secondAnswer).toBeVisible();
    
    // 3. Click Admission link in Navbar to navigate
    // First click the dropdown trigger to make the link visible and clickable
    const dropdownTrigger = page.locator('button:has-text("Admisión 2026")').first();
    await dropdownTrigger.click();
    
    const admissionLink = page.locator('a[href="/admision"]').first();
    await admissionLink.click();
    await expect(page).toHaveURL(/\/admision/);
    
    // 4. Fill and submit admission form
    await page.locator('input[name="parentName"]').fill('Test Father');
    await page.locator('input[name="childrenAges"]').fill('6 years');
    await page.locator('textarea[name="message"]').fill('Hello Waldorf!');
    await page.locator('button:has-text("Martes")').click();

    // Mock window.open to capture the WhatsApp redirection URL
    let openedUrl = '';
    await page.exposeFunction('mockWindowOpen', (url: string) => {
      openedUrl = url;
    });
    await page.evaluate(() => {
      window.open = (url) => {
        (window as any).mockWindowOpen(url);
        return null;
      };
    });

    // Submit form
    await page.locator('button[type="submit"]:has-text("Conversar con Ivonne")').click();
    await page.waitForTimeout(500);

    // Verify WhatsApp API link was opened with filled values
    expect(openedUrl).toContain('wa.me/56967765106');
    expect(openedUrl).toContain('Test%20Father');
    expect(openedUrl).toContain('Martes');
  });

  test('test_journey_booking_with_dynamic_quote: select dates + services -> verify total price', async ({ page }) => {
    await page.goto('/arriendo-salon');
    
    // Set a date and time for 3 hours (3 * $10,000 = $30,000 base cost)
    const todayStr = new Date().toISOString().split('T')[0];
    await page.locator('input[type="date"]').fill(todayStr);
    await page.locator('input[type="time"]').first().fill('10:00');
    await page.locator('input[type="time"]').last().fill('13:00');
    
    await page.waitForTimeout(500);
    
    // Verify total is $30.000 initially
    const totalPayText = page.locator('text=Total a pagar').locator('..').locator('p.text-[var(--color-waldorf-mustard)]');
    await expect(totalPayText).toContainText('$30.000');
    
    // Go to step 2 (Servicios adicionales)
    await page.locator('button:has-text("Siguiente")').click();
    
    // Try to toggle "Kit Audiovisual Completo (+$20.000)"
    await page.locator('text=Kit Audiovisual Completo').click();
    
    // Expected total: $50.000 (Calculated dynamically)
    // This is expected to FAIL because step 2 selection is broken and doesn't change state/price.
    await expect(totalPayText).toContainText('$50.000');
  });

  test('test_journey_news_navigation_and_details: news list and detailed page navigation', async ({ page }) => {
    await page.goto('/noticias');
    
    // Find the first news article card and select it
    const articleLink = page.locator('main.min-h-screen a[href^="/noticias/"]').first();
    await expect(articleLink).toBeVisible();
    
    const href = await articleLink.getAttribute('href');
    const decodedHref = decodeURIComponent(href || '');
    
    // Click the article link
    await articleLink.click();
    
    // Wait for URL to match either encoded or decoded version
    await page.waitForURL(url => url.pathname === decodedHref || url.pathname === href);
    
    // Details page contains the main header title
    const articleTitle = page.locator('h1');
    await expect(articleTitle).toBeVisible();
    
    // Back link is visible
    const backBtn = page.locator('text=Volver a noticias');
    await expect(backBtn).toBeVisible();
  });
});
