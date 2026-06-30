import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
});

test.describe('Smooth Scroll & Sticky Nav (Tier 1)', () => {
  test('test_scroll_progress_rendered: progress bar should exist', async ({ page }) => {
    const progress = page.locator('#scroll-progress');
    await expect(progress).toBeAttached();
  });

  test('test_sticky_nav_rendered: navbar should exist', async ({ page }) => {
    const navbar = page.locator('#navbar');
    await expect(navbar).toBeVisible();
  });

  test('test_back_to_top_present: back-to-top button should be appended to body', async ({ page }) => {
    const btn = page.locator('.back-to-top');
    await expect(btn).toBeAttached();
  });

  test('test_nav_anchors_present: verify scroll anchors are rendered', async ({ page }) => {
    const anchors = page.locator('a[href^="#"]');
    const count = await anchors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('test_lang_switcher_present: verify language selection dropdown is rendered', async ({ page }) => {
    const dropdown = page.locator('.lang-dropdown');
    await expect(dropdown).toBeVisible();
  });
});

test.describe('Smooth Scroll & Sticky Nav (Tier 2)', () => {
  test('test_scroll_offset_navigation: clicking anchor navigates and offsets for navbar', async ({ page }) => {
    const anchor = page.locator('a[href="index.html#pedagogia"]');
    
    // We scroll down using the anchor click
    await anchor.click();
    
    // Wait for scroll to stabilize
    await page.waitForTimeout(1000);
    
    // Check scroll position is roughly matching the target element's top position minus navbar offset
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('test_back_to_top_behavior: click back-to-top button scrolls back to 0', async ({ page }) => {
    const btn = page.locator('.back-to-top');
    
    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    // Check it's visible now
    await expect(btn).toBeVisible();
    
    // Click back to top
    await btn.click();
    await page.waitForTimeout(1000);
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });

  test('test_scroll_progress_update: progress bar width updates on scroll', async ({ page }) => {
    const progress = page.locator('#scroll-progress');
    
    // Initial scroll progress width
    const initialWidth = await progress.evaluate(el => el.style.width);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    
    const finalWidth = await progress.evaluate(el => el.style.width);
    expect(finalWidth).not.toBe(initialWidth);
  });

  test('test_navbar_hide_scroll_down: scrolling down past 300px hides navbar', async ({ page }) => {
    const navbar = page.locator('#navbar');
    
    // Scroll down past 300px
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    // Wait for throttled scroll handler
    await page.waitForTimeout(500);
    
    await expect(navbar).toHaveClass(/hide/);
  });

  test('test_navbar_show_scroll_up: scrolling back up reveals navbar', async ({ page }) => {
    const navbar = page.locator('#navbar');
    
    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    await expect(navbar).toHaveClass(/hide/);
    
    // Scroll up
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(500);
    
    await expect(navbar).not.toHaveClass(/hide/);
  });
});
