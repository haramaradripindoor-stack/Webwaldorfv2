# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scroll.spec.ts >> Boundaries (Tier 2) >> test_guest_limits_in_booking: arriendo-salon displays capacity limit
- Location: tests\scroll.spec.ts:74:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=hasta 20 personas')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=hasta 20 personas')
    - waiting for" http://127.0.0.1:3000/arriendo-salon" navigation to finish...
    - navigated to "http://127.0.0.1:3000/arriendo-salon"

```

```yaml
- alert
- dialog "Server Error":
  - navigation:
    - button "previous" [disabled]:
      - img "previous"
    - button "next" [disabled]:
      - img "next"
    - text: 1 of 1 error Next.js (14.2.4) is outdated
    - link "(learn more)":
      - /url: https://nextjs.org/docs/messages/version-staleness
  - heading "Server Error" [level=1]
  - paragraph: "Error: Cannot find module './1682.js' Require stack: - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\.next\\server\\webpack-runtime.js - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\.next\\server\\app\\noticias\\page.js - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\node_modules\\next\\dist\\server\\require.js - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\node_modules\\next\\dist\\server\\load-components.js - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\node_modules\\next\\dist\\build\\utils.js - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\node_modules\\next\\dist\\server\\dev\\hot-middleware.js - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\node_modules\\next\\dist\\server\\dev\\hot-reloader-webpack.js - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\node_modules\\next\\dist\\server\\lib\\router-utils\\setup-dev-bundler.js - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\node_modules\\next\\dist\\server\\lib\\router-server.js - C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\node_modules\\next\\dist\\server\\lib\\start-server.js"
  - text: This error happened while generating the page. Any console logs will be displayed in the terminal window.
  - heading "Call Stack" [level=2]
  - group:
    - img
    - img
    - text: Next.js
  - heading "Be" [level=3]
  - text: file:///C:/Users/FELIP/Documents/GitHub/Webwaldorfv2/trekan_nextjs/node_modules/@tailwindcss/node/dist/index.js (1:1283)
  - group:
    - img
    - img
    - text: Next.js
  - heading "Array.reduce" [level=3]
  - text: <anonymous>
  - group:
    - img
    - img
    - text: Next.js
  - heading "Array.map" [level=3]
  - text: <anonymous>
  - group:
    - img
    - img
    - text: Next.js
  - heading "<unknown>" [level=3]
  - text: file:///C:/Users/FELIP/Documents/GitHub/Webwaldorfv2/trekan_nextjs/.next/server/pages/_document.js (1:340)
  - heading "Object.<anonymous>" [level=3]
  - text: file:///C:/Users/FELIP/Documents/GitHub/Webwaldorfv2/trekan_nextjs/.next/server/pages/_document.js (1:383)
  - group:
    - img
    - img
    - text: Next.js
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navbar & Global Widgets (Tier 1)', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('test_sticky_nav_rendered: navbar should exist and be fixed', async ({ page }) => {
  9  |     const navbar = page.locator('nav');
  10 |     await expect(navbar).toBeVisible();
  11 |     await expect(navbar).toHaveClass(/fixed/);
  12 |   });
  13 | 
  14 |   test('test_custom_cursor_present: custom cursor element should be in DOM', async ({ page }) => {
  15 |     // CustomCursor component renders a fixed div with z-[9999] and pointer-events-none classes
  16 |     const cursorDot = page.locator('div.fixed.pointer-events-none.z-\\[9999\\]');
  17 |     await expect(cursorDot).toBeAttached();
  18 |   });
  19 | 
  20 |   test('test_chatbot_toggle: chatbot widget triggers open/close', async ({ page }) => {
  21 |     const openChatBtn = page.locator('button[aria-label="Abrir Chat"]');
  22 |     await expect(openChatBtn).toBeVisible();
  23 |     
  24 |     // Click button to open
  25 |     await openChatBtn.click();
  26 |     
  27 |     // Verify lead capture form is now visible
  28 |     const leadFormInput = page.locator('input[placeholder="Tu Nombre"]');
  29 |     await expect(leadFormInput).toBeVisible();
  30 | 
  31 |     // Click close button inside chat header
  32 |     const closeBtn = page.locator('button[aria-label="Cerrar chat"]');
  33 |     await closeBtn.click();
  34 |     await expect(leadFormInput).not.toBeVisible();
  35 |   });
  36 | 
  37 |   test('test_lang_switcher_present: verify language selection buttons exist', async ({ page }) => {
  38 |     const esBtn = page.getByRole('button', { name: 'ES', exact: true });
  39 |     const deBtn = page.getByRole('button', { name: 'DE', exact: true });
  40 |     const enBtn = page.getByRole('button', { name: 'EN', exact: true });
  41 |     await expect(esBtn).toBeVisible();
  42 |     await expect(deBtn).toBeVisible();
  43 |     await expect(enBtn).toBeVisible();
  44 |   });
  45 | 
  46 |   test('test_vcard_download: click vCard button triggers download', async ({ page }) => {
  47 |     const vcardBtn = page.locator('button:has-text("Guardar Contacto (vCard)")');
  48 |     await expect(vcardBtn).toBeVisible();
  49 | 
  50 |     const downloadPromise = page.waitForEvent('download');
  51 |     await vcardBtn.click();
  52 |     const download = await downloadPromise;
  53 | 
  54 |     expect(download.suggestedFilename()).toBe('colegio_trekan.vcf');
  55 |   });
  56 | });
  57 | 
  58 | test.describe('Boundaries (Tier 2)', () => {
  59 |   test('test_admission_fields_validation: parentName and childrenAges are required', async ({ page }) => {
  60 |     await page.goto('/admision');
  61 |     const parentName = page.locator('input[name="parentName"]');
  62 |     const childrenAges = page.locator('input[name="childrenAges"]');
  63 |     await expect(parentName).toHaveAttribute('required', '');
  64 |     await expect(childrenAges).toHaveAttribute('required', '');
  65 |   });
  66 | 
  67 |   test('test_past_date_block_in_booking_calendar: date picker blocks past dates', async ({ page }) => {
  68 |     await page.goto('/arriendo-salon');
  69 |     const dateInput = page.locator('input[type="date"]');
  70 |     const todayStr = new Date().toISOString().split('T')[0];
  71 |     await expect(dateInput).toHaveAttribute('min', todayStr);
  72 |   });
  73 | 
  74 |   test('test_guest_limits_in_booking: arriendo-salon displays capacity limit', async ({ page }) => {
  75 |     await page.goto('/arriendo-salon');
  76 |     const capacityText = page.locator('text=hasta 20 personas');
> 77 |     await expect(capacityText).toBeVisible();
     |                                ^ Error: expect(locator).toBeVisible() failed
  78 |   });
  79 | });
  80 | 
```