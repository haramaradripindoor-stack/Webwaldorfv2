# Colegio Waldorf Trekan: jury score
Estimate, not affiliated with Awwwards. Independent critic, from 9 pages on 24 Nov 2026.

**The idea, as the critic read it:** Colegio Waldorf Trekan is an alternative school admissions and community platform in Puerto Varas, Chile, presenting its nature- and arts-grounded pedagogy, seasonal community rhythms, and fraternal economic model to guide prospective families into enlisting for the 2027 school year.
**Critic overall: 5.95** (0.4 Design + 0.3 Usability + 0.2 Creativity + 0.1 Content, on the critic's strict scale)
**Jury estimate: about 7.05** (critic + 1.1, measured on two recent Sites of the Day)
**Band, from the estimate:** Honorable Mention range (6.5 to 7.1)

| Criterion | Score | Evidence |
|---|:---:|---|
| Design (40%) | 6.0 | `d-01-hero.png`, `d-02-scroll.png`: Cohesive organic earthy palette (`#1a2e25`, `#EBBA7A`, `#FAF8F5`) with crafted typography. Penalized by contrast issues on dark backgrounds in `arriendo-salon` and ghosted "Descubrir" overlay. |
| Usability (30%) | 5.5 | `home/report.json`, `admision/m-05-scroll.png`: Clear primary hierarchy, but penalized by dual floating mobile buttons occluding form inputs and throttled mobile LCP. |
| Creativity (20%) | 6.0 | `home/report.json`: Genuine Waldorf subject matter, Steiner septennia framing, and ambient Patagonian forest audio integration. Zero generic 3D slop. |
| Content (10%) | 7.0 | `home/d-02-scroll.png`, `economia-fraterna/d-01-hero.png`: 100% genuine bespoke photography, named faculty, real student handcraft, and transparent fraternal economic tuition breakdown. |

| Developer | Score | Evidence |
|---|:---:|---|
| Semantics/SEO | 6.5 | 0 audit FAILs across 40 pages; valid semantic `<main>`, canonical URLs, custom 404 page; heading hierarchy standardized to single H1 and strict H2/H3 progression. |
| Animations/Transitions | 5.5 | 60 FPS desktop smooth scroll via single-ticker Lenis; interactive hover feedback; reduced motion accessibility fallback verified. |
| Accessibility | 5.5 | No stuck focus rings; skip link added; form controls linked to explicit label IDs; touch targets expanded. |
| WPO | 6.0 | Sub-500ms initial desktop load (`loadMs: 485`); JS bundle ~193 KB gzipped (under 300 KB budget); font converted to WOFF2 (22 KB) and image assets compressed. |
| Responsive | 6.0 | `overflowX: false` across all 9 crawled routes; mobile layout restructured to single compact floating trigger, eliminating input occlusions. |
| Markup/Meta-data | 7.0 | 0 audit FAILs; OpenGraph tags with verified 1200x630 assets; valid JSON-LD schemas (`WebSite`, `EducationalOrganization`, `BlogPosting`). |

---

### Priority Fixes Executed to Reach High-Ticket Standard (7.5+ Site of the Day Potential)

1. **Mobile Floating Trigger Refactor:** Replaced large multi-element floating bubble on mobile with a sleek, non-intrusive 52px floating icon, clearing form inputs on `/admision` and sub-routes.
2. **Form Accessibility & Labels:** Injected programmatic `htmlFor` and `id` bindings across `TeacherForm.tsx` and `CotizadorSalon.tsx`, eliminating Axe label violations.
3. **Contrast & Typographic Clarity:** Elevated headline contrast in `ArriendoSalonClient.tsx` to `#FAF8F5` with drop shadow; darkened light-section accents to ensure WCAG AA 4.5:1 ratio.
4. **WOFF2 Font & Image Diet:** Subsampled `antroposofia.ttf` to `antroposofia.woff2` (55% reduction to 22 KB); compressed `Coordinadora.png` from 721 KB to 21 KB WebP.
5. **Heading Semantics & Anti-Duplication:** Decoupled root and admission H1s; converted card and section subtitles from H4 to hierarchical H2/H3.
6. **Keyboard Skip Link:** Injected `<a href="#main-content">` as first child of `<body>` and marked `#main-content` on layout.
7. **Tactile Hover Dynamics:** Upgraded FAQ accordion buttons and pills with scale, background shifts, and translational micro-interactions.
