# E2E Test Suite Status (TEST_READY.md)

This document provides a quick overview of the current status, runner command, and test coverage checklist for the Waldorf Trekan E2E test suite.

---

## 1. Playwright E2E Runner Command

All tests should be run from within the `trekan_nextjs/` folder. Use the following command:

```bash
# Navigate to the Next.js app directory
cd trekan_nextjs

# Run the full Playwright test suite
npx playwright test
```

*Note: The test runner will automatically build or launch the Next.js development server on port 3000 as configured in `playwright.config.ts`.*

---

## 2. Test Tiers Count

The test suite covers **4 Tiers** of verification:

1. **Tier 1: Happy-path features** (Navbar components, hero, audio controllers, custom cursor, WhatsApp and chatbot widgets, resources cards, and vCard download).
2. **Tier 2: Boundary limits** (Admission required field inputs, past-date calendar selection blocks, capacity description, and gallery lightbox keyboard transitions).
3. **Tier 3: Combinations** (Booking calculator add-on services price updates, mobile browser layout and viewport menu toggles).
4. **Tier 4: Real-world user journeys** (FAQ-to-Admission navigation & submission flow, dynamic booking quote validation, and news catalog to detailed article reading flow).

---

## 3. Coverage Checklist

- [x] **Homepage (`/`)**
  - [x] Navbar rendered fixed in viewport.
  - [x] Hero video and audio atmosphere control.
  - [x] Custom cursor dot attachment.
  - [x] Chatbot toggle & input fields.
  - [x] WhatsApp contact badge triggers and link parameters.
  - [x] vCard contact download file verification.
  - [x] Lightbox keyboard navigation (ArrowRight/ArrowLeft/Close).
- [x] **Admission (`/admision`)**
  - [x] Enforces `required` validation on parents and age fields.
  - [x] Correct serialization and redirection parameters to WA.
- [x] **Booking Calendar (`/arriendo-salon`)**
  - [x] Renders capacity limits text.
  - [x] Prevents booking past dates (min date is today).
  - [x] Dynamic quotation recalculation when toggling additional services (Kit Audiovisual / Calefacción).
- [x] **Resources (`/recursos`)**
  - [x] Masonry columns-1 container is visible.
  - [x] Directory items avoid break-inside layout issues.
- [x] **News Feed (`/noticias`)**
  - [x] Lists markdown/Supabase articles.
  - [x] Click links navigate to correct slug-based URLs.
- [x] **News Details (`/noticias/[slug]`)**
  - [x] Renders page header title.
  - [x] Display back button to main news.
