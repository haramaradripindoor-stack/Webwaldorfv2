# Test Infrastructure & Strategy (TEST_INFRA.md)

This document details the E2E testing strategy, configuration, architecture, and feature coverage for the Waldorf Trekan Next.js application.

---

## 1. Test Philosophy

Our testing approach prioritizes **real-world reliability, correct state transitions, and user experience consistency** across all main user journeys of the Colegio Waldorf Trekan website. Given the highly custom aesthetic and interactive design (Awwwards-level cursor, smooth scroll, responsive layout, bento grids, and interactive forms), E2E testing using **Playwright** guarantees that components compile, render, hydrate, and function seamlessly across web browsers.

Our core testing principles are:
- **Behavior-Driven Testing**: We test what the user actually sees and interacts with, rather than internal component states.
- **Dynamic Price and State Validation**: Ensuring the Booking Calculator and Admission Forms accurately compute costs and serialize inputs.
- **Fail-Safe Integrity**: Real data pathways (e.g., booking form submission, lead capture, and language switches) must perform correctly without silent errors.

---

## 2. Test Architecture

The test suite is built on top of **Playwright**, integrated directly into the Next.js workspace:

- **Config Path**: `trekan_nextjs/playwright.config.ts`
- **Specs Path**: `trekan_nextjs/tests/`
- **Target URL (baseURL)**: `http://localhost:3000` (allowing local testing)
- **Local Web Server Integration**: Playwright starts the Next.js development server automatically using `npm run dev` or the production build via `npm run start` on port 3000.
- **Concurrency & Parallelism**: Configured with `fullyParallel: false` and `workers: 1` to prevent port collisons and database concurrency issues during sequential user flow testing.
- **Browser Profile**: Target execution primarily runs on `chromium` configured with desktop viewports.

---

## 3. Feature Inventory

The following application routes and functional zones are covered by our test inventory:

1. **Homepage (`/`)**
   - Sticky navbar presence and styling (`fixed`).
   - Hero video backdrop rendering.
   - Interactive Waldorf atmosphere audio toggle.
   - Custom pointer/cursor dot element attachment in the DOM.
   - Floating WhatsApp button widget + info card display.
   - Floating AI Lead Capture Chatbot toggle.
   - Contact Section vCard (`.vcf`) download trigger.
2. **Admission (`/admision`)**
   - Form field constraints (required inputs, name & child age).
   - Form submission and dynamic redirect to WhatsApp with pre-filled customer message.
3. **Booking Calendar (`/arriendo-salon`)**
   - Space layout and capacity info display.
   - Date picker boundaries (prevents past dates).
   - Step 1: Input date/time validation.
   - Step 2: Interactive additional services toggle (e.g., Kit Audiovisual, Firewood Heating).
   - Step 3: Digital signature, pricing sidebar calculations, and final submission via EmailJS.
4. **Resources (`/recursos`)**
   - Asymmetric masonry layout rendering (columns-1, md:columns-2, lg:columns-3).
   - Card block layout constraints (`break-inside: avoid`).
   - Resource directories and external website links.
5. **News (`/noticias` & `/noticias/[slug]`)**
   - Dynamic news feed loaded from markdown or Supabase.
   - Slug routing, title display, and "back to news" link verification.

---

## 4. Test Scenarios (4-Tier Matrix)

### Tier 1: Happy-Path Features (`hero.spec.ts`, `scroll.spec.ts`, `whatsapp.spec.ts`, `masonry.spec.ts`)
- **Hero elements**: Video is attached, atmosphere audio toggles properly.
- **Language switcher**: `ES`, `DE`, and `EN` buttons are rendered and visible.
- **Chatbot interaction**: Clicking chatbot button opens the form and displays lead inputs.
- **Custom Cursor**: Dot is attached to the DOM with pointer-events disabled.
- **vCard Download**: Clicking the vCard button downloads the correct `.vcf` file.
- **WhatsApp Widget**: Clicking WhatsApp floating icon opens the contact card with coordinate details.
- **Masonry Grid**: Resources page shows masonry columns layout with cards that avoid breaks inside columns.

### Tier 2: Boundary Constraints (`scroll.spec.ts`, `masonry.spec.ts`)
- **Form Validation**: Admission fields (`parentName` and `childrenAges`) must enforce the `required` attribute.
- **Past Date Block**: Booking page date inputs must restrict selection using the `min` attribute set to today.
- **Capacity limits**: Displays "hasta 20 personas" limits.
- **Lightbox Navigation**: Homepage gallery items open lightbox. Arrow keys cycle through images and update the image source dynamically.

### Tier 3: State Combinations (`combinations.spec.ts`)
- **Booking Calculator Add-Ons**: Toggling additional options like "Kit Audiovisual" (+$20,000) updates state and recalculates prices instantly.
- **Responsive Layout Menu**: Resizing the browser viewport to mobile width (375px) shows the mobile menu trigger. Clicking toggles mobile link visibility.

### Tier 4: Real-World User Journeys (`scenarios.spec.ts`)
- **FAQ-to-Admission Flow**: A parent visits the homepage, expands a question in the FAQ accordion, clicks the Navbar dropdown to navigate to the Admission form, fills out the details, and clicks submit, verifying it redirects to the WhatsApp endpoint with the correctly formatted message parameters.
- **Dynamic Booking Quote validation**: A client chooses a 3-hour slot on the booking calendar ($30,000), goes to step 2, checks "Kit Audiovisual" (+$20,000), and validates that the dynamic sidebar recalculates the total price to exactly $50,000.
- **News Navigation & Detail View**: A user enters the news directory, clicks on the first article card, lands on the corresponding detail page with matching title metadata, and verifies the "Volver a noticias" button.
