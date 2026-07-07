# E2E Test Infrastructure - Colegio Waldorf Trekan

This document outlines the testing philosophy, architecture, feature inventory, and test scenarios designed for the Waldorf Trekan Next.js project.

---

## 1. Testing Philosophy
Our E2E testing strategy is built upon the **Integrity Mandate (Zero-Cheat Policy)**:
* **Genuine Interactions:** Every test performs real browser interactions (clicks, fills, keyboard presses, window/API mocks).
* **State and Behavior:** Verification relies on the actual visual state, DOM attributes, and calculated variables, rather than hardcoded mock outputs.
* **Intended Failures:** We do not fake success for known bugs. For instance, the Booking Calculator's Step 2 does not have active event handlers to update the total price in state; thus, Tier 3 and Tier 4 calculator tests are *expected to fail* until the feature is fixed.

---

## 2. Test Architecture
* **Runner:** Playwright Test.
* **Workspace:** `trekan_nextjs/`
* **Port / baseURL:** `http://127.0.0.1:3000` (IPv4 loopback to avoid Windows IPv6 localhost lookup resolution delays).
* **WebServer Integration:** Configured to reuse the development server (`npm run dev`) or spin it up automatically.
* **Project Defaults:** Configured with `chromium` for optimal performance and reliable execution under Windows.
* **Execution Mode:** Serial execution (`fullyParallel: false` with 1 worker) to prevent database locks and ensure UI transaction stability.

---

## 3. Feature Inventory & Routes Checked
The test suite covers all primary customer-facing routes:
1. **Homepage (`/`)**
   * Background Video backdrop verification.
   * Kinetic cursor interaction & custom cursor presence.
   * Audio controller ("Atmósfera" toggle mute state).
   * Floating WhatsApp widget (loading, open, close, and validation of phone number redirect link).
   * AI Chatbot toggle (opening lead form, verifying closed state).
   * Asymmetric Gallery & Lightbox keyboard navigation (ArrowRight and Escape transitions).
2. **Admission (`/admision`)**
   * Happy-path contact form inputs.
   * Field validation constraints (required fields `parentName`, `childrenAges`).
   * FAQ accordion selection.
3. **Booking/Salon Rental (`/arriendo-salon`)**
   * Interacting with the Booking date-time calculator.
   * Boundary checks: Past date blocker (the `min` attribute set dynamically to `today`).
   * Capacity limits text displays.
   * Dynamic quote combination math (base hour price vs. Step 2 add-on services like Kit Audiovisual).
4. **Resources Directory (`/recursos` & `/recursos-waldorf-chile`)**
   * Masonry columns layout existence.
   * CSS Column break boundaries prevent truncation (`break-inside: avoid`).
   * Contact details download verification (vCard).
5. **News & Blog (`/noticias` & `/noticias/[slug]`)**
   * News list page loading.
   * Detail page transition (decoding slug routing).
   * Back button visibility.

---

## 4. Four-Tier Scenario Inventory

### Tier 1: Happy-Path Features
* **Booking Selector Loading:** Ensures the date and time inputs exist and are fillable.
* **Admission Form Inputs:** Fills out the parent contact data.
* **News page & categories:** Confirms articles are rendered from Supabase / Markdown fallback.
* **Custom Cursor Presence:** Confirms target DOM elements for custom cursor style exist.
* **Chatbot Toggle:** Toggles chatbot modal open and close.
* **Recursos Page Layout:** Confirms directory structures and links.

### Tier 2: Boundaries
* **Admission Fields Validation:** Confirms `required` constraints are set on `parentName` and `childrenAges`.
* **Past Date Block in Calendar:** Validates that `min` date attribute on the HTML date input matches `today` to prevent booking in the past.
* **Guest Limits in Booking:** Verifies page shows the maximum capacity limit ("hasta 20 personas").

### Tier 3: Combinations
* **Booking Calculator Add-on Services:** Selects date-time range and toggles extra services (e.g. Kit Audiovisual Completo) in Step 2 to assert they increment the total price. *(Expected to fail due to missing event handlers in the UI).*
* **Navbar Mobile Menu Toggle:** Simulates viewport resizing (375x667) and verifies mobile navigation visibility toggling.

### Tier 4: Real-world User Journeys
* **Journey 1: Home to FAQ to Admission Submit:** Opens homepage, clicks FAQ dropdowns, navigates to `/admision`, fills parent name, age of children, and preferred day, clicks submit, and confirms dynamic wa.me redirect URL is formatted correctly.
* **Journey 2: Booking with Dynamic Quote Validation:** Selects date/time for 3 hours, navigates to Step 2, selects Kit Audiovisual, and asserts the total price reflects `$50.000` ($30k base + $20k kit). *(Expected to fail).*
* **Journey 3: News Navigation and Details:** Goes to `/noticias`, selects the first article card, navigates to detail slug, and verifies the article markdown content and back link are rendered.
