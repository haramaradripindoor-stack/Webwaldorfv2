# Project: Waldorf (Trekan) Web Optimization

## Architecture
The project is built using Next.js 14 (App Router) with Tailwind CSS, Framer Motion, GSAP, and Lenis Scroll. It connects to Supabase as a backend (for resources, data storage) and Vercel for hosting.

## Code Layout
- `/trekan_nextjs/app`: Next.js App Router pages, layouts, and route handlers.
- `/trekan_nextjs/components`: Shared React components (UI elements, Layouts, Animation shells).
- `/trekan_nextjs/lib`: External integrations (Supabase clients, utility functions).
- `/trekan_nextjs/public`: Static assets (images, fonts, sitemap, robots.txt).
- `/trekan_nextjs/tests`: Playwright end-to-end tests.
- `/trekan_nextjs/types`: TypeScript typings.
- `/trekan_nextjs/utils`: Helper functions and scripts.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Exploration & Audit | Deep source audit for hydration mismatches, layout shifts, SEO gaps, responsive bugs, and Awwwards styling opportunities. | None | DONE |
| M2 | E2E Test Suite | Design comprehensive E2E tests covering 4 tiers (Feature coverage, boundaries, combinations, workloads) in Playwright. | None | DONE |
| M3 | Hydration & Performance Optimizations | Fix typescript compilation error in `ActividadesClient.tsx`, database schema mapping mismatch in `ActividadesSection.tsx`, date hydration mismatches in `CotizadorSalon.tsx` and `NewsSection.tsx`, enable Next.js image optimizations, optimize preloaded videos, delete duplicate route `/recursos-waldorf-chile`. | M1, M2 | DONE |
| M4 | Awwwards UX/UI & Motion Hardening | Fix Cotizador Step 2 selections, fix visual contrast in `AdmisionForm.tsx`, sync Lenis scroll ticker with GSAP, fix custom cursor visibility & double cursor, correct nested button/anchor tags in Hero, render `AIChatWidget` in layout, add missing sitemap/robots.txt, and export dynamic/custom metadata for client/server subpages. Render Navbar/Footer on `/actividades`. | M1, M3 | DONE |
| M5 | Final Validation & Build Audit | Build project with `npm run build` and run Challenger and Forensic Auditor checks. | M2, M3, M4 | DONE |

## Interface Contracts
### Client components ↔ Supabase Database
- Client requests resources dynamic or static from Supabase tables (`recursos`, `actividades`, `noticias`).
- Robust fallbacks must be in place in case of network failure or schema changes.
