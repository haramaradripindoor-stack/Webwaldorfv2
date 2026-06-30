import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
});

test.describe('Combinations & Integration (Tier 3)', () => {
  test('test_combo_whatsapp_cookie_banner: WhatsApp trigger shifts up when cookie banner is visible', async ({ page }) => {
    const banner = page.locator('#cookie-banner');
    const trigger = page.locator('#waTrigger');
    
    // Make the cookie banner visible programmatically (or wait, let's verify if the class visible is added)
    await page.evaluate(() => {
      const b = document.getElementById('cookie-banner');
      if (b) b.classList.add('visible');
    });
    
    // Verify style of trigger has transform translateY(-80px)
    const transform = await trigger.evaluate(el => window.getComputedStyle(el).transform);
    // Since transform in getComputedStyle returns matrix(1, 0, 0, 1, 0, -80) for translateY(-80px)
    expect(transform).toContain('matrix');
    expect(transform).toContain('-80');
  });

  test('test_combo_active_nav_highlighting: scrolling highlights current section link', async ({ page }) => {
    const pedagogiaSection = page.locator('#pedagogia');
    const pedagogiaLink = page.locator('a[href="index.html#pedagogia"]').first();
    
    // Scroll pedagogia section into view
    await pedagogiaSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // wait for scroll highlight handler
    
    await expect(pedagogiaLink).toHaveClass(/active/);
  });

  test('test_combo_gallery_scroll_lock: opening image gallery modal locks body scroll', async ({ page }) => {
    const firstImg = page.locator('.news-image img, .news-gallery-item img, .cms-gallery-thumb img').first();
    
    // Click image to open modal
    await firstImg.click();
    await page.waitForTimeout(500);
    
    // Body should have overflow: hidden
    const overflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    expect(overflow).toBe('hidden');
  });

  test('test_combo_mobile_menu_scroll_override: scrolling down does not hide navbar when mobile menu is active', async ({ page }) => {
    const navbar = page.locator('#navbar');
    const menuToggle = page.locator('#mobile-menu');
    const navMenu = page.locator('#nav-menu');
    
    // Open mobile menu
    await menuToggle.click();
    await expect(navMenu).toHaveClass(/active/);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    // Navbar should NOT hide (should not have class 'hide')
    await expect(navbar).not.toHaveClass(/hide/);
  });
});
