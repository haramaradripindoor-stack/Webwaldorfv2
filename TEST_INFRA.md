# Playwright E2E Test Suite Infrastructure - Webwaldorfv2

This document outlines the features and the 49 test cases designed to test the frontend interactions and animations of the Colegio Waldorf Trekan website.

## Feature Inventory

1. **Hero Section Animation**
   - Implemented via a custom Javascript slideshow.
   - Supports fade transition, active class manipulation, dot controls, automatic slide intervals (5000ms), paused-on-hover state, swipe gestures, and transitions lock flag (`isAnimating`).

2. **Asymmetric Masonry Layout**
   - Implemented via CSS columns (`columns: 1`, `columns: 2`, `columns: 3`) on `.cms-archivo-grid`.
   - Incorporates `.cms-archivo-card` elements with `break-inside: avoid`.
   - Category filtering (via chips) dynamically updates visibility, with keyboard navigation support on images.

3. **WhatsApp Float Widget**
   - Composed of `#waTrigger`, `#waCard`, overlay, close button, and redirection links.
   - Incorporates a custom attention badge showing/hiding dynamically on intervals.

4. **Smooth Scroll & Navigation**
   - Global sticky navbar (`#navbar`) shrinking on scroll down (`.nav-scrolled`, `.scrolled`) and hiding when scrolling down, revealing when scrolling up.
   - Smooth page scrolling offset calculation to account for navbar height.
   - Back-to-top button (`.back-to-top`) appearing after 300px and scrolling smoothly to top.

---

## E2E Test Case Matrix (49 Cases)

### Tier 1: Unit & Component level checks (20 tests)
#### Hero Section Animation
1. **test_hero_initial_active_slide**: Verify the first slide starts with the `.active` class and opacity 1.
2. **test_hero_slides_present**: Check that at least one `.slide` exists inside the slideshow container.
3. **test_hero_first_dot_active**: Check that the first dot has the `.active` class on initial load.
4. **test_hero_global_api_present**: Verify that the global slideshow functions `changeSlide` and `currentSlide` exist on `window`.
5. **test_hero_container_exists**: Verify the `.slideshow-container` is rendered.

#### Asymmetric Masonry Layout
6. **test_masonry_grid_exists**: Verify `.cms-archivo-grid` exists on `noticias.html`.
7. **test_masonry_cards_present**: Verify that `.cms-archivo-card` elements exist within the grid.
8. **test_masonry_column_css**: Check that the grid container has the CSS column layout structure.
9. **test_masonry_break_inside**: Verify that `.cms-archivo-card` elements have `break-inside: avoid` styling.
10. **test_masonry_responsive_viewport**: Verify different column counts are configured in CSS media queries.

#### WhatsApp Float Widget
11. **test_whatsapp_trigger_rendered**: Verify the float button trigger `#waTrigger` exists.
12. **test_whatsapp_card_rendered**: Verify the card dialog `#waCard` exists.
13. **test_whatsapp_closed_initially**: Verify the card does not have the `.open` class on load.
14. **test_whatsapp_target_links**: Verify the link redirect is formatted with `wa.me` and the correct number.
15. **test_whatsapp_avatar_rendered**: Verify the coordinator's avatar image is present in the card.

#### Smooth Scroll & Sticky Nav
16. **test_scroll_progress_rendered**: Verify the scroll progress indicator `#scroll-progress` is present.
17. **test_sticky_nav_rendered**: Verify the navigation bar `#navbar` is present.
18. **test_back_to_top_present**: Verify the `.back-to-top` button has been appended to the body.
19. **test_nav_anchors_present**: Verify that scroll links (e.g. `a[href^="#"]`) are present.
20. **test_lang_switcher_present**: Verify language dropdown selection is available.

---

### Tier 2: Behavioral & Interactive checks (20 tests)
#### Hero Section Animation
21. **test_hero_next_click**: Clicking the next button changes the active slide.
22. **test_hero_prev_click**: Clicking the previous button changes the active slide.
23. **test_hero_dot_click**: Clicking a dot transitions directly to that specific slide.
24. **test_hero_animation_lock**: Rapid clicks are ignored while `isAnimating` is true.
25. **test_hero_hover_pause**: Hovering over the slideshow stops the auto-slide timer.

#### Asymmetric Masonry Layout
26. **test_masonry_chip_filtering**: Clicking a category chip hides non-matching cards.
27. **test_masonry_chip_active_state**: Clicking a chip adds the active class and removes it from others.
28. **test_masonry_empty_state**: Verify display behavior when no items match selected chip.
29. **test_masonry_keyboard_nav**: Pressing Enter on focused image thumb opens modal.
30. **test_masonry_dynamic_reflow**: Viewport resize adjusts layout and visibility.

#### WhatsApp Float Widget
31. **test_whatsapp_trigger_toggle**: Clicking the trigger toggles `.open` on `#waCard`.
32. **test_whatsapp_close_btn**: Clicking the close button inside `#waCard` hides the card.
33. **test_whatsapp_escape_dismiss**: Pressing Escape hides `#waCard`.
34. **test_whatsapp_outside_dismiss**: Clicking outside the WhatsApp card closes it.
35. **test_whatsapp_attention_badge_timer**: The `wa-badge` fades out after 8 seconds (manipulated clock).

#### Smooth Scroll & Sticky Nav
36. **test_scroll_offset_navigation**: Clicking nav links scrolls the page with correct offset.
37. **test_back_to_top_behavior**: Clicking back-to-top scrolls page smoothly back to top.
38. **test_scroll_progress_update**: Scrolling updates the progress bar width percentage.
39. **test_navbar_hide_scroll_down**: Scrolling down hides the navbar.
40. **test_navbar_show_scroll_up**: Scrolling up reveals the navbar.

---

### Tier 3: Edge-cases and combination checks (4 tests)
41. **test_combo_whatsapp_cookie_banner**: When the cookie banner is visible, the WhatsApp bubble shifts up (`translateY(-80px)`).
42. **test_combo_active_nav_highlighting**: Scrolling to a section highlights its respective link in the nav menu.
43. **test_combo_gallery_scroll_lock**: Opening an image modal applies `overflow: hidden` to document body.
44. **test_combo_mobile_menu_scroll_override**: Scrolling down does not hide the navbar when the mobile menu is active.

---

### Tier 4: Scenario-based verification (5 tests)
45. **test_scenario_news_navigation_and_filter**: Navigate to news archive, filter by year, test masonry alignment.
46. **test_scenario_image_modal_full_interaction**: Open an image lightbox, swipe/arrow navigate, zoom, close.
47. **test_scenario_contact_form_feedback**: Fill out and submit contact form, verify button text updates to "Enviando...".
48. **test_scenario_chatbot_complete_interaction**: Open assistant, choose quick reply, verify local response.
49. **test_scenario_admission_funnel_journey**: A complete user flow accepting cookies, checking pricing, opening whatsapp, and reviewing FAQ items.
