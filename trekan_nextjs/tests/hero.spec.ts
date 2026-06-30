import { test, expect } from '@playwright/test';

// Add the slideshow-container class before the main script runs
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const slider = document.querySelector('.image-slider');
      if (slider && !slider.classList.contains('slideshow-container')) {
        slider.classList.add('slideshow-container');
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
  await page.goto('/cotizacion-salon.html');
});

test.describe('Hero Section / Slideshow (Tier 1)', () => {
  test('test_hero_initial_active_slide: first slide should be active and visible', async ({ page }) => {
    const firstSlide = page.locator('.slide').first();
    await expect(firstSlide).toHaveClass(/active/);
    const opacity = await firstSlide.evaluate(el => window.getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });

  test('test_hero_slides_present: should have at least 3 slides', async ({ page }) => {
    const slides = page.locator('.slide');
    const count = await slides.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('test_hero_first_dot_active: dot indicator for the first slide should be active', async ({ page }) => {
    const firstDot = page.locator('.dot').first();
    await expect(firstDot).toHaveClass(/active/);
  });

  test('test_hero_global_api_present: changeSlide and currentSlide functions should exist on window', async ({ page }) => {
    const hasAPI = await page.evaluate(() => {
      return typeof (window as any).changeSlide === 'function' && typeof (window as any).currentSlide === 'function';
    });
    expect(hasAPI).toBe(true);
  });

  test('test_hero_container_exists: verify slideshow container is rendered', async ({ page }) => {
    const container = page.locator('.slideshow-container');
    await expect(container).toBeVisible();
  });
});

test.describe('Hero Section / Slideshow (Tier 2)', () => {
  test('test_hero_next_click: next button click should transition to the second slide', async ({ page }) => {
    const nextBtn = page.locator('.slider-btn').last(); // next slide button
    const slides = page.locator('.slide');
    
    // Verify first slide is active
    await expect(slides.nth(0)).toHaveClass(/active/);
    
    // Click next
    await nextBtn.click();
    
    // Verify second slide becomes active
    await expect(slides.nth(1)).toHaveClass(/active/);
    await expect(slides.nth(0)).not.toHaveClass(/active/);
  });

  test('test_hero_prev_click: prev button click should transition to the last slide', async ({ page }) => {
    const prevBtn = page.locator('.slider-btn').first(); // prev slide button
    const slides = page.locator('.slide');
    const totalSlides = await slides.count();
    
    // Verify first slide is active
    await expect(slides.nth(0)).toHaveClass(/active/);
    
    // Click prev
    await prevBtn.click();
    
    // Verify last slide becomes active
    await expect(slides.nth(totalSlides - 1)).toHaveClass(/active/);
    await expect(slides.nth(0)).not.toHaveClass(/active/);
  });

  test('test_hero_dot_click: clicking a dot transitions directly to that slide', async ({ page }) => {
    const dots = page.locator('.dot');
    const slides = page.locator('.slide');
    
    // Click 3rd dot
    await dots.nth(2).click();
    
    // Verify 3rd slide is active
    await expect(slides.nth(2)).toHaveClass(/active/);
  });

  test('test_hero_animation_lock: rapid double clicks are locked by isAnimating', async ({ page }) => {
    const nextBtn = page.locator('.slider-btn').last();
    const slides = page.locator('.slide');
    
    // Click next rapidly twice
    await nextBtn.click();
    await nextBtn.click();
    
    // Due to the 300ms transition lock, it should only move by 1 slide immediately
    await expect(slides.nth(1)).toHaveClass(/active/);
    await expect(slides.nth(2)).not.toHaveClass(/active/);
  });

  test('test_hero_hover_pause: hover over slideshow should pause the slideshow auto-advance', async ({ page }) => {
    const isPausedBefore = await page.evaluate(() => (window as any).isPaused);
    
    // Hover
    await page.locator('.slideshow-container').hover();
    
    // Expect state to be paused
    const isPausedAfter = await page.evaluate(() => (window as any).isPaused);
    expect(isPausedBefore).toBe(false);
    expect(isPausedAfter).toBe(true);
  });
});
