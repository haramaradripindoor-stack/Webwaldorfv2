import { test, expect } from '@playwright/test';

test.describe('Navbar & Global Widgets (Tier 1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('test_sticky_nav_rendered: navbar should exist and be fixed', async ({ page }) => {
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
    await expect(navbar).toHaveClass(/fixed/);
  });

  test('test_custom_cursor_present: custom cursor element should be in DOM', async ({ page }) => {
    // CustomCursor component renders a fixed div with z-[9999] and pointer-events-none classes
    const cursorDot = page.locator('div.fixed.pointer-events-none.z-\\[9999\\]');
    await expect(cursorDot).toBeAttached();
  });

  test('test_chatbot_toggle: chatbot widget triggers open/close', async ({ page }) => {
    const openChatBtn = page.locator('button[aria-label="Abrir Chat"]');
    await expect(openChatBtn).toBeVisible();
    
    // Click button to open
    await openChatBtn.click();
    
    // Verify lead capture form is now visible
    const leadFormInput = page.locator('input[placeholder="Tu Nombre"]');
    await expect(leadFormInput).toBeVisible();

    // Click close button inside chat header
    const closeBtn = page.locator('button[aria-label="Cerrar chat"]');
    await closeBtn.click();
    await expect(leadFormInput).not.toBeVisible();
  });

  test('test_lang_switcher_present: verify language selection buttons exist', async ({ page }) => {
    const esBtn = page.getByRole('button', { name: 'ES', exact: true });
    const deBtn = page.getByRole('button', { name: 'DE', exact: true });
    const enBtn = page.getByRole('button', { name: 'EN', exact: true });
    await expect(esBtn).toBeVisible();
    await expect(deBtn).toBeVisible();
    await expect(enBtn).toBeVisible();
  });

  test('test_vcard_download: click vCard button triggers download', async ({ page }) => {
    const vcardBtn = page.locator('button:has-text("Guardar Contacto (vCard)")');
    await expect(vcardBtn).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await vcardBtn.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('colegio_trekan.vcf');
  });
});

test.describe('Boundaries (Tier 2)', () => {
  test('test_admission_fields_validation: parentName and childrenAges are required', async ({ page }) => {
    await page.goto('/admision');
    const parentName = page.locator('input[name="parentName"]');
    const childrenAges = page.locator('input[name="childrenAges"]');
    await expect(parentName).toHaveAttribute('required', '');
    await expect(childrenAges).toHaveAttribute('required', '');
  });

  test('test_past_date_block_in_booking_calendar: date picker blocks past dates', async ({ page }) => {
    await page.goto('/arriendo-salon');
    const dateInput = page.locator('input[type="date"]');
    const todayStr = new Date().toISOString().split('T')[0];
    await expect(dateInput).toHaveAttribute('min', todayStr);
  });

  test('test_guest_limits_in_booking: arriendo-salon displays capacity limit', async ({ page }) => {
    await page.goto('/arriendo-salon');
    const capacityText = page.locator('text=hasta 20 personas');
    await expect(capacityText).toBeVisible();
  });
});
