import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000); // Hydration safety to prevent clicking before React event handlers attach
});

test.describe('WhatsApp Float Widget (Tier 1)', () => {
  test('test_whatsapp_trigger_rendered: trigger button should exist', async ({ page }) => {
    const trigger = page.locator('button[aria-label="Contactar por WhatsApp"]');
    await expect(trigger).toBeVisible();
  });

  test('test_whatsapp_closed_initially: card should not be open initially', async ({ page }) => {
    const card = page.locator('text=Coordinadora de Admisión');
    await expect(card).not.toBeVisible();
  });
});

test.describe('WhatsApp Float Widget Interactions (Tier 2)', () => {
  test('test_whatsapp_trigger_toggle: clicking the trigger opens and closes the card', async ({ page }) => {
    const trigger = page.locator('button[aria-label="Contactar por WhatsApp"]');
    
    // Toggle open
    await trigger.click();
    const cardHeader = page.locator('text=Coordinadora de Admisión');
    await expect(cardHeader).toBeVisible();
    
    // Check target link exists inside
    const waLink = page.locator('a:has-text("Abrir Chat en WhatsApp")');
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute('href');
    expect(href).toContain('56967765106');

    // Click close button inside card
    const closeBtn = page.locator('button[aria-label="Cerrar chat"]');
    await closeBtn.click();
    await expect(cardHeader).not.toBeVisible();
  });
});
