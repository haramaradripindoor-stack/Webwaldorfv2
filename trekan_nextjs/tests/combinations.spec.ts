import { test, expect } from '@playwright/test';

test.describe('Combinations & Integration (Tier 3)', () => {
  
  test('test_booking_calculator_combination: selecting add-on services in step 2 should increase total price', async ({ page }) => {
    await page.goto('/arriendo-salon');
    await page.waitForTimeout(1000); // Hydration safety
    
    // Set a date and time for 2 hours (2 * $10,000 = $20,000 base cost)
    const todayStr = new Date().toISOString().split('T')[0];
    await page.locator('input[type="date"]').fill(todayStr);
    await page.locator('input[type="time"]').nth(0).fill('09:00');
    await page.locator('input[type="time"]').nth(1).fill('11:00');
    
    // Wait for the total to update
    await page.waitForTimeout(500);
    
    // Go to step 2 (Servicios adicionales)
    await page.locator('button:has-text("Siguiente")').click();
    
    // Try to toggle "Kit Audiovisual Completo (+$20.000)"
    await page.locator('text=Kit Audiovisual Completo').click();
    
    // Check that extra services is $20.000 and total is $40.000
    // This is expected to FAIL because step 2 is broken and has no onClick handlers or checkboxes to update the state!
    const extraServicesVal = page.locator('text=Servicios Extra').locator('..').locator('p').last();
    await expect(extraServicesVal).toContainText('$20.000');
  });

  test('test_navbar_mobile_menu_toggle: open mobile menu and verify layout transitions', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000); // Hydration safety
    
    // Set mobile viewport size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Locate and click mobile menu toggle button
    const toggleBtn = page.locator('nav button.lg\\:hidden');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    
    // Mobile links should now be visible
    const mobileMenu = page.locator('div.lg\\:hidden').last();
    await expect(mobileMenu).toBeVisible();
  });
});
