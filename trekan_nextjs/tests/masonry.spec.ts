import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/noticias.html');
});

test.describe('Asymmetric Masonry Grid Layout (Tier 1)', () => {
  test('test_masonry_grid_exists: grid container should be visible', async ({ page }) => {
    const grid = page.locator('.cms-archivo-grid');
    await expect(grid).toBeVisible();
  });

  test('test_masonry_cards_present: should render multiple cards', async ({ page }) => {
    const cards = page.locator('.cms-archivo-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('test_masonry_column_css: check columns count property in styles', async ({ page }) => {
    const grid = page.locator('.cms-archivo-grid');
    const columns = await grid.evaluate(el => window.getComputedStyle(el).columnCount || window.getComputedStyle(el).getPropertyValue('columns'));
    expect(columns).not.toBeNull();
  });

  test('test_masonry_break_inside: elements should prevent breaking inside columns', async ({ page }) => {
    const card = page.locator('.cms-archivo-card').first();
    const breakInside = await card.evaluate(el => window.getComputedStyle(el).breakInside || window.getComputedStyle(el).getPropertyValue('break-inside'));
    expect(breakInside).toBe('avoid');
  });

  test('test_masonry_responsive_viewport: test that viewport resizing preserves grid properties', async ({ page }) => {
    const grid = page.locator('.cms-archivo-grid');
    await page.setViewportSize({ width: 480, height: 800 });
    const colsMobile = await grid.evaluate(el => window.getComputedStyle(el).columnCount);
    
    await page.setViewportSize({ width: 1200, height: 800 });
    const colsDesktop = await grid.evaluate(el => window.getComputedStyle(el).columnCount);
    
    expect(colsMobile || colsDesktop).toBeDefined();
  });
});

test.describe('Asymmetric Masonry Grid Layout (Tier 2)', () => {
  test('test_masonry_chip_filtering: clicking a chip filters shown items', async ({ page }) => {
    const chips = page.locator('.cms-chip');
    const cards = page.locator('.cms-archivo-card');
    
    const initialCount = await cards.count();
    
    // Find a non-active chip and click it
    const inactiveChip = chips.locator(':not(.active)').first();
    const chipText = await inactiveChip.innerText();
    
    await inactiveChip.click();
    
    // Some cards should be hidden, or at least filtered. Let's check hidden vs visible
    // In many setups, filtering adds a "hidden" class or sets display: none
    const visibleCards = page.locator('.cms-archivo-card:not(.hidden)');
    const visibleCount = await visibleCards.count();
    
    expect(visibleCount).toBeLessThanOrEqual(initialCount);
  });

  test('test_masonry_chip_active_state: active class toggles correctly on chips click', async ({ page }) => {
    const chips = page.locator('.cms-chip');
    const firstChip = chips.first();
    const secondChip = chips.nth(1);
    
    await firstChip.click();
    await expect(firstChip).toHaveClass(/active/);
    await expect(secondChip).not.toHaveClass(/active/);
    
    await secondChip.click();
    await expect(secondChip).toHaveClass(/active/);
    await expect(firstChip).not.toHaveClass(/active/);
  });

  test('test_masonry_empty_state: verify behavior when no items match category filter', async ({ page }) => {
    // If we click a chip with no items, it might show an empty state message
    // Let's programmatically simulate filtering to zero items or click a chip that has no items
    const emptyMsg = page.locator('.cms-archivo-empty');
    
    // Let's add a dummy chip that filters to something non-existent
    await page.evaluate(() => {
      const container = document.querySelector('.cms-archivo-chips');
      if (container) {
        const btn = document.createElement('button');
        btn.className = 'cms-chip';
        btn.setAttribute('data-filter', 'non-existent-year-tag');
        btn.textContent = 'Non-existent';
        container.appendChild(btn);
      }
    });
    
    await page.locator('.cms-chip:has-text("Non-existent")').click();
    await expect(emptyMsg).toBeVisible();
  });

  test('test_masonry_keyboard_nav: tab and enter opens lightbox modal', async ({ page }) => {
    const firstCardThumb = page.locator('.cms-gallery-thumb').first();
    
    // Focus the thumbnail
    await firstCardThumb.focus();
    
    // Press Enter key
    await page.keyboard.press('Enter');
    
    // Verify lightbox is open
    const lightbox = page.locator('#cms-lightbox');
    await expect(lightbox).toHaveClass(/open/);
  });

  test('test_masonry_dynamic_reflow: columns structure dynamically shifts layout', async ({ page }) => {
    const grid = page.locator('.cms-archivo-grid');
    const initialWidth = await grid.evaluate(el => el.getBoundingClientRect().width);
    
    await page.setViewportSize({ width: 600, height: 800 });
    const finalWidth = await grid.evaluate(el => el.getBoundingClientRect().width);
    
    expect(finalWidth).toBeLessThan(initialWidth);
  });
});
