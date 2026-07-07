# Playwright E2E Test Suite - Readiness Report

This report summarizes the E2E test commands, scope, tiers coverage, and checklist.

---

## 1. E2E Execution Command
To execute the tests locally from the `trekan_nextjs/` directory:
```bash
npx playwright test
```

To run a specific test file (e.g., Hero checks):
```bash
npx playwright test tests/hero.spec.ts
```

To open the interactive Playwright UI:
```bash
npx playwright test --ui
```

---

## 2. Test Tiers Count
The test suite consists of **22 test scenarios** mapped across **4 Tiers**:
* **Tier 1 (Happy-Path Features):** 11 tests
* **Tier 2 (Boundaries & Validations):** 7 tests
* **Tier 3 (Combinations & Responsive Triggers):** 2 tests
* **Tier 4 (Real-world User Journeys):** 2 tests

*Note: Two tests related to Step 2 of the Booking Calculator (toggling add-ons to increase total price) are expected to fail until the UI component state handles click/change events.*

---

## 3. Coverage Checklist

### Route Coverage
- [x] Homepage (`/`)
- [x] Admission (`/admision`)
- [x] Booking / Salon Rental (`/arriendo-salon`)
- [x] Resources Directory (`/recursos`)
- [x] Resources Directory Alternative (`/recursos-waldorf-chile`)
- [x] News List (`/noticias`)
- [x] News Detail (`/noticias/[slug]`)

### Feature Coverage Checklist
- [x] **Hero Section Video Background:** Presence validation.
- [x] **Hero Atmospheric Audio control:** Mute/unmute interaction check.
- [x] **Custom Kinetic Cursor:** Presence verification in DOM.
- [x] **AI Chatbot Toggle:** Window open, lead input visibility, and close button check.
- [x] **Floating WhatsApp Trigger:** Open/close card and wa.me redirect verification.
- [x] **Masonry Layout:** `.columns-1` columns rendering and `break-inside: avoid` check on Resources page.
- [x] **Contact vCard Download:** download triggers correctly (in Homepage footer).
- [x] **Gallery Lightbox Interaction:** Opening image, keyboard ArrowRight next-slide, and closing lightbox.
- [x] **Admission Field Validation:** `parentName` and `childrenAges` require non-empty strings.
- [x] **Booking Calendar Limits:** Block past dates by asserting `min` input attribute is set to `today`.
- [x] **Booking Capacity Check:** Display capacity warning for up to 20 people.
- [x] **Mobile Menu Navigation:** Viewport resizing, toggle state check.
- [x] **Multi-Page Journeys:** Home -> FAQ expand -> Admission Navigation -> WhatsApp API Submit redirection.
- [x] **Dynamic Quote Journey:** Calculating booking cost based on hour selections.
- [x] **News Slug details routing:** Navigating from list to decoded detailed view.
