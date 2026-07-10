import { test, expect } from '@playwright/test';

test.describe('Asymmetric Masonry Grid Layout (Tier 1)', () => {
  test('test_recursos_masonry_exists: columns layout should be present on recursos', async ({ page }) => {
    await page.goto('/recursos');
    // The masonry container uses "columns-1 md:columns-2 lg:columns-3"
    const grid = page.locator('.columns-1');
    await expect(grid).toBeVisible();
    
    // Check that we have multiple directory category cards
    const cards = grid.locator('> div');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('test_recursos_break_inside: cards should prevent breaking inside columns', async ({ page }) => {
    await page.goto('/recursos');
    const card = page.locator('div.break-inside-avoid').first();
    await expect(card).toBeVisible();
    
    const breakInside = await card.evaluate(el => window.getComputedStyle(el).breakInside || window.getComputedStyle(el).getPropertyValue('break-inside'));
    expect(breakInside).toBe('avoid');
  });
});

test.describe('Masonry Gallery & Lightbox (Tier 2)', () => {
  test('test_gallery_lightbox_interaction: click gallery image opens lightbox and keyboard navigate', async ({ page }) => {
    await page.goto('/');
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    const gallerySection = page.locator('#galeria');
    await expect(gallerySection).toBeVisible();

    // Click the clickable container wrapper (div.group) instead of the image because it is overlaid
    const firstItem = gallerySection.locator('div.group').first();
    await page.evaluate(() => {
      const el = document.getElementById('galeria');
      if (el) el.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(2000);
    await firstItem.click({ force: true });
    await page.evaluate(() => {
      const el = document.querySelector('#galeria div.group') as HTMLElement;
      if (el) el.click();
    });

    // Lightbox should be open
    const lightbox = page.locator('button[aria-label="Cerrar"]').locator('..');
    await expect(lightbox).toBeVisible();

    // Click right arrow button or keyboard arrow to navigate
    const initialImgSrc = await lightbox.locator('img').getAttribute('src');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);

    const nextImgSrc = await lightbox.locator('img').getAttribute('src');
    expect(nextImgSrc).not.toBe(initialImgSrc);

    // Close lightbox
    await page.locator('button[aria-label="Cerrar"]').click();
    await expect(lightbox).not.toBeVisible();
  });
});
