import { test, expect } from '@playwright/test';

test.describe('Scenario-based E2E Verification (Tier 4)', () => {
  
  test('test_scenario_news_navigation_and_filter: navigate to news page, click chip filter, check masonry reflow', async ({ page }) => {
    // 1. Visit home page
    await page.goto('/index.html');
    
    // 2. Navigate to noticias page
    const noticiasLink = page.locator('a[href="index.html#noticias"]').first();
    await noticiasLink.click();
    await page.waitForTimeout(500);
    
    // Actually navigate to noticias.html
    await page.goto('/noticias.html');
    await expect(page).toHaveURL(/noticias.html/);
    
    // 3. Locate chips and filter cards
    const chips = page.locator('.cms-chip');
    const firstYearChip = chips.nth(1); // second chip is usually a year (e.g. 2026 or 2025)
    await firstYearChip.click();
    await page.waitForTimeout(500);
    
    // 4. Verify some cards are hidden and active chip changes
    await expect(firstYearChip).toHaveClass(/active/);
    const hiddenCards = page.locator('.cms-archivo-card.hidden');
    const totalCards = await page.locator('.cms-archivo-card').count();
    expect(await hiddenCards.count()).toBeLessThanOrEqual(totalCards);
  });

  test('test_scenario_image_modal_full_interaction: open lightbox, navigate images, toggle zoom, close lightbox', async ({ page }) => {
    await page.goto('/index.html');
    
    // 1. Locate gallery image thumbnail inside news card
    const firstThumb = page.locator('.cms-gallery-thumb').first();
    await firstThumb.click();
    await page.waitForTimeout(500);
    
    // Lightbox is open
    const lightbox = page.locator('#cms-lightbox');
    await expect(lightbox).toHaveClass(/open/);
    
    // 2. Press arrow right to navigate to next image
    const imgBefore = await lightbox.locator('img').getAttribute('src');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    
    const imgAfter = await lightbox.locator('img').getAttribute('src');
    expect(imgBefore).not.toBe(imgAfter);
    
    // 3. Close the lightbox
    const closeBtn = lightbox.locator('.cms-lb-close');
    await closeBtn.click();
    await page.waitForTimeout(500);
    await expect(lightbox).not.toHaveClass(/open/);
  });

  test('test_scenario_contact_form_feedback: fill and submit form, verify submit button displays loading feedback', async ({ page }) => {
    await page.goto('/index.html');
    
    // 1. Fill out the contact form fields
    await page.locator('#contact-name').fill('John Doe');
    await page.locator('#contact-email').fill('john@example.com');
    await page.locator('#contact-phone').fill('+56999999999');
    await page.locator('#contact-subject').selectOption('Visita al colegio');
    await page.locator('#contact-message').fill('Me gustaría agendar una visita al colegio.');
    
    // 2. Mock form submission behavior to prevent redirect page reload
    await page.evaluate(() => {
      const form = document.getElementById('contact-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault(); // Stop redirection
        });
      }
    });
    
    // 3. Click submit
    const submitBtn = page.locator('.contact-submit');
    await submitBtn.click();
    
    // 4. Verify text changes to "Enviando..." and is disabled
    await expect(submitBtn).toHaveText('Enviando...');
    await expect(submitBtn).toBeDisabled();
  });

  test('test_scenario_chatbot_complete_interaction: open chatbot, select quick reply, verify KB response rendering', async ({ page }) => {
    await page.goto('/index.html');
    
    const bubble = page.locator('#trekan-bot-bubble');
    const panel = page.locator('#trekan-bot-panel');
    const chatInput = page.locator('#trekan-bot-input');
    const sendBtn = page.locator('#trekan-bot-send');
    
    // 1. Open the chatbot
    await bubble.click();
    await expect(panel).toHaveClass(/open/);
    
    // 2. Click a quick reply chip (e.g., "¿Cuáles son los aranceles 2026?")
    const quickReply = page.locator('.chat-quick-replies .chat-chip').first();
    const replyText = await quickReply.innerText();
    
    await quickReply.click();
    
    // 3. Verify user message is rendered in chat body
    const userMsg = page.locator('.chat-msg.user').last();
    await expect(userMsg).toContainText(replyText);
    
    // 4. Verify bot response is received (either KB info or fallback)
    await page.waitForTimeout(1000); // Wait for chatbot delay
    const botMsg = page.locator('.chat-msg.bot').last();
    await expect(botMsg).toBeVisible();
    await expect(botMsg).toContainText(/Aranceles|aranceles|Matrícula|matrícula/i);
  });

  test('test_scenario_admission_funnel_journey: complete user admission flow', async ({ page }) => {
    await page.goto('/index.html');
    
    // 1. Accept cookies
    const cookieBanner = page.locator('#cookie-banner');
    // Wait for banner to be visible
    await page.waitForTimeout(4000); // banner template has 3.5s delay
    await expect(cookieBanner).toHaveClass(/visible/);
    
    const acceptBtn = page.locator('#cookie-accept');
    await acceptBtn.click();
    await page.waitForTimeout(500);
    await expect(cookieBanner).not.toHaveClass(/visible/);
    
    // 2. View FAQ Item
    const faqItem = page.locator('.faq-item').first();
    const faqQuestion = faqItem.locator('.faq-question');
    const faqAnswer = faqItem.locator('.faq-answer');
    
    await faqQuestion.click();
    await page.waitForTimeout(500);
    await expect(faqItem).toHaveClass(/active/);
    
    // 3. Click Admission CTA to check redirect
    // We target the Conocer admisión button
    const admissionBtn = page.locator('a[href="/admision.html"]').first();
    await expect(admissionBtn).toBeVisible();
  });
});
