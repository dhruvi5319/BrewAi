---

## F05: Responsive Layout & Navigation

**Priority:** P1  
**Depends on:** F00 (Design System)  
**Required by:** F01, F02, F03, F04 (all features consume the layout)

---

### Description

The application must be fully functional and visually polished across every viewport from 320px (smallest modern mobile) to 1920px (large desktop). Navigation provides consistent access to the menu and cart at all screen sizes, adapting its presentation: a horizontal top bar on desktop and a compact header on mobile. Menu grids reflow across breakpoints, cart drawers shift from full-screen overlays to slide-over panels, and every tap target meets the 44×44px minimum. No horizontal scroll appears at any supported width.

---

### Terminology

- **Breakpoint:** A CSS min-width threshold at which the layout shifts. BrewAI uses Tailwind's default breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).
- **Viewport Width Range:** Minimum supported: 320px. Maximum designed for: 1920px.
- **Top Bar:** The fixed navigation bar shown at `md` and above; contains logo, nav links, and cart icon.
- **Compact Header:** The simplified navigation bar shown below `md`; contains logo and cart icon only (no nav links); category filters are placed below the header in a horizontal scroll strip.
- **Touch Target:** Any interactive element; minimum 44×44px on mobile per WCAG 2.5.5.
- **Horizontal Scroll Strip:** A single-row scrollable container for category filter pills on mobile; scrolls horizontally without page-level overflow.

---

### Sub-Features

- **F05.1 — Top Navigation Bar (Desktop):** Full-width fixed header at `md+` with logo (left), navigation links (center or right), and cart icon with badge (right).
- **F05.2 — Compact Header (Mobile):** Fixed header at `< md` with logo (left) and cart icon (right); no nav links.
- **F05.3 — Category Filter Scroll Strip (Mobile):** Below the compact header, category pills scroll horizontally with `overflow-x: auto; scrollbar-width: none` to hide the scrollbar.
- **F05.4 — Responsive Menu Grid:** 1 column at `< sm`, 2 columns at `sm–lg`, 3 columns at `lg–xl`, 4 columns at `2xl+`.
- **F05.5 — Cart Drawer Adaptation:** Drawer is full-screen (100vw × 100vh) on `< md`; slide-over (fixed right, 400px wide) on `md+`.
- **F05.6 — Customization Modal Adaptation:** Modal is bottom-sheet style (full-width, 90vh max) on `< md`; centered dialog (max-width 600px) on `md+`.
- **F05.7 — Touch Target Enforcement:** All buttons, links, and interactive elements have `min-height: 44px; min-width: 44px` enforced via Tailwind utilities or CSS.
- **F05.8 — No Horizontal Overflow:** `overflow-x: hidden` on `<body>` and `<html>`; all content containers use `max-w-screen-*` or percentage widths; no fixed-pixel widths that could overflow at 320px.

---

### Process

**Navigation Rendering:**
1. On mount, the `Navigation` component renders once — Tailwind responsive utilities control the visible variant.
2. The top bar is hidden below `md` (`hidden md:flex`); the compact header is hidden at `md+` (`flex md:hidden`).
3. The cart icon is rendered in both layouts; it references the same `cartStore.totalCount` for the badge.

**Category Filter on Mobile:**
1. Below `md`, the category filter bar renders inside a `div` with `overflow-x-auto` and `flex` layout.
2. Pills do not wrap — they scroll horizontally as a single row.
3. The "All" pill is always first; active pill is scrolled into view on selection (`scrollIntoView({ behavior: 'smooth', inline: 'nearest' })`).

**Menu Grid Reflow:**
1. The menu grid container uses Tailwind responsive grid classes: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`.
2. Card images (or illustration placeholders) scale fluidly with `w-full aspect-video object-cover`.
3. On 320px viewport, the single-column layout uses full container width with 16px horizontal padding.

**Cart Drawer Adaptation:**
1. Below `md`, cart drawer uses `fixed inset-0` (full screen); a close button is required in the top-right.
2. At `md+`, cart drawer uses `fixed right-0 top-0 h-full w-[400px]`; backdrop covers remaining viewport.
3. The transition animation differs (see F06 §Cart Drawer Animation).

**Customization Modal Adaptation:**
1. Below `md`, modal uses `fixed bottom-0 left-0 right-0 max-h-[90vh]` with `rounded-t-[20px]` for the bottom-sheet style.
2. At `md+`, modal uses `fixed inset-0 flex items-center justify-center` with a centered content box `max-w-[600px] w-full mx-4`.

---

### Inputs

- Viewport width (browser-native, read via Tailwind responsive classes — no JS `window.innerWidth` polling needed)
- `cartStore.totalCount` — for badge rendering in both navigation variants
- User interactions — scroll, click, touch

---

### Outputs

- Correct layout variant rendered for the current viewport width
- No horizontal scroll at any supported width
- All interactive elements meet 44×44px touch target minimum

---

### Breakpoint Behavior Summary

| Viewport | Grid Cols | Navigation | Cart Drawer | Customization Modal |
|----------|-----------|------------|-------------|---------------------|
| 320px–639px (`< sm`) | 1 | Compact header | Full-screen | Bottom sheet |
| 640px–767px (`sm`) | 2 | Compact header | Full-screen | Bottom sheet |
| 768px–1023px (`md`) | 2 | Top bar | Slide-over 400px | Centered dialog |
| 1024px–1279px (`lg`) | 3 | Top bar | Slide-over 400px | Centered dialog |
| 1280px–1535px (`xl`) | 3 | Top bar | Slide-over 400px | Centered dialog |
| 1536px+ (`2xl`) | 4 | Top bar | Slide-over 400px | Centered dialog |

---

### Validation

- No `width`, `min-width`, or `left`/`right` values hardcoded in pixels that would cause overflow at 320px viewport width.
- The category filter strip must not create page-level horizontal scroll; it uses `overflow-x-auto` scoped to its own container.
- Cart badge count must be visible in both the compact header and the top bar at all times.
- Logo must be visible and not clipped at 320px viewport width; max logo width: `120px` on mobile.
- All text in the top bar must not overflow at 1920px width; content must remain within `max-w-screen-xl` (1280px) centered container.
- Framer Motion animation variants must differ per viewport size (see F06) — no shared fixed-direction animations that break on layout shift.

---

### Error States

| Scenario | Behavior | User-Facing Message |
|----------|----------|---------------------|
| Viewport < 320px | Layout may degrade; not a supported width | (no message — out of supported range) |
| Viewport > 1920px | Layout works but is not specifically optimized | Content remains centered within max-width |
| JavaScript disabled | Tailwind responsive classes still apply; layout is correct | React won't render — outside scope |

---

### API Surface (this feature)

None — layout and navigation are frontend-only.

---

### Schema Surface (this feature)

None.

---
