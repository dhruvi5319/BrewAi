---

## Responsive Considerations

**User Stories:** US-5.1, US-5.2, US-5.3, US-5.4
**Journeys:** JRN-02.1 (all stages), JRN-02.2, JRN-03.1

---

### Breakpoint System

| Breakpoint | Width | Tailwind | Layout mode |
|------------|-------|----------|-------------|
| Mobile | 320px – 639px | `< sm` | 1-column grid, compact header, full-screen overlays |
| Tablet | 640px – 767px | `sm` | 2-column grid, compact header |
| Tablet+ | 768px – 1023px | `md` | 2-column grid, full top nav, slide-over cart |
| Desktop | 1024px – 1535px | `lg` | 3-column grid, full top nav |
| Large desktop | 1536px+ | `2xl` | 4-column grid, full top nav |

**Minimum supported width:** 320px  
**Maximum designed for:** 1920px  
**No horizontal scroll** at any viewport — `overflow-x: hidden` on `<html>` and `<body>`

---

### Navigation Bar

#### Desktop (≥ 768px / `md+`) — Full Top Bar

```
┌─────────────────────────────────────────────────────────────────┐
│  bg: #141414  border-bottom: 1px solid #2A2A2A  height: 64px   │
│  BrewAI          [Menu]  [About]          [🛒 Cart (3)]         │
│  Playfair 20px   Inter 14px #9A9080       Lucide ShoppingCart   │
│  #C8922A         hover: #F5F0E8           badge pill #C8922A    │
└─────────────────────────────────────────────────────────────────┘
```

- Logo: Playfair Display, 20px, `#C8922A`; links to `/`
- Nav links: Inter 14px, `#9A9080`; hover → `#F5F0E8`, 150ms transition
- Cart icon: Lucide `ShoppingCart`, 24px; badge shown when `totalCount > 0`
- Sticky at top: `position: sticky; top: 0; z-index: 50`

#### Mobile (< 768px / `< md`) — Compact Header

```
┌───────────────────────────┐
│ bg: #141414  height: 56px │
│ border-bottom: 1px #2A2A2A│
│ BrewAI Logo    [🛒 (3)]   │
│ Playfair 16px  ShoppingCart│
│ max-width: 120px  badge   │
└───────────────────────────┘
```

- Logo max-width: `120px` — never clips at 320px
- Cart icon is the only navigation element on mobile
- No nav links in compact header (not needed for v1 guest-only flow)
- Both variants read from same `cartStore.totalCount` — badge always consistent

---

### Menu Grid Columns

| Viewport width | Columns | Tailwind class |
|----------------|---------|----------------|
| 320px – 639px (`< sm`) | 1 | `grid-cols-1` |
| 640px – 1023px (`sm` to `< lg`) | 2 | `sm:grid-cols-2` |
| 1024px – 1535px (`lg` to `< 2xl`) | 3 | `lg:grid-cols-3` |
| 1536px+ (`2xl+`) | 4 | `2xl:grid-cols-4` |

- Gap: `16px` on mobile, `24px` on desktop
- Container: `max-w-screen-xl`, `mx-auto`, `px-4` (mobile) `px-6` (desktop)
- Single-column at 320px: full container width, 16px horizontal padding; no clipping

---

### Cart Drawer

#### Desktop (≥ 768px) — Slide-Over Panel

```
Main content (dimmed)  │  Cart Drawer
                       │  fixed right-0 top-0 bottom-0
                       │  width: 400px
                       │  bg: #141414
                       │  border-left: 1px solid #2A2A2A
                       │  slides in from right, 200ms easeOut
                       │  slides out to right on close
```

- Backdrop: `bg-#0A0A0A/50`, covers remaining viewport
- Clicking backdrop closes the drawer

#### Mobile (< 768px) — Full-Screen Overlay

```
┌───────────────────────────┐
│ CART DRAWER               │
│ fixed inset-0             │
│ 100vw × 100vh             │
│ bg: #141414               │
│ slides up from bottom     │
│ 200ms easeOut             │
└───────────────────────────┘
```

- Slides up from bottom, closes by sliding back down
- "×" close button always visible in top-right corner: 44×44px tap target
- Entire content scrollable within the full-screen overlay

---

### Customization Modal

#### Desktop (≥ 768px) — Centered Dialog

```
Backdrop (blurred)
  ┌──────────────────────┐
  │  Centered dialog     │
  │  max-width: 600px    │
  │  max-height: 90vh    │
  │  scrollable body     │
  └──────────────────────┘
```

- Modal body scrollable if content exceeds viewport height
- Footer (price + "Add to Cart") is sticky at bottom of modal

#### Mobile (< 768px) — Bottom Sheet

```
┌───────────────────────────┐
│ BACKDROP (dimmed)         │
├───────────────────────────┤  ← slides up from bottom
│ BOTTOM SHEET              │
│ fixed bottom-0 left-0     │
│ right-0                   │
│ max-height: 90vh          │
│ rounded-t-[20px]          │
│ bg: #1C1C1C               │
│ overflow-y: auto          │
└───────────────────────────┘
```

- Handle bar visual hint at top of sheet (optional but recommended)
- Footer sticky within the sheet: `position: sticky; bottom: 0`

---

### Touch Targets (Mobile — US-5.4)

All interactive elements must meet **44×44px minimum** on mobile viewports.

| Element | Min size | Notes |
|---------|----------|-------|
| `Button` primitive (all sizes) | 44px height | Enforced via `min-height: 44px` in component |
| Category filter pills | 44px height | Via padding; `py-3` minimum |
| Product card "Customize" / "Add to Cart" | 44px height | `size="sm"` variant still meets 44px |
| Modal close "×" button | 44×44px | Tap area, icon centered |
| Cart icon in nav | 44×44px | Tap area, icon centered |
| Quantity stepper [−] and [+] | 44×44px each | In-modal and in-cart |
| Remove "×" on cart line item | 44×44px | Tap area, icon centered |
| "Place Order" button (cart footer) | 44px height, full-width | Easiest to tap; high value |
| "Start a New Order" (confirmation) | 44px height, full-width mobile | High value; last tap |

---

### Category Filter Bar — Horizontal Scroll (Mobile)

```
┌───────────────────────────────────────────────────────┐
│  [All●]  [Espresso]  [Cold Brew]  [Pour-Over]  →→→    │
│  ← scroll to see more →                               │
└───────────────────────────────────────────────────────┘
```

- Container: `overflow-x: auto`, `scrollbar-width: none` (hidden scrollbar)
- Pills: `flex-shrink: 0` (don't wrap or compress)
- Does NOT trigger page-level horizontal scroll
- `<html>` and `<body>` have `overflow-x: hidden` as a safety net

---

### Confirmation Screen (390px Mobile — Above-Fold)

The confirmation screen must show all critical info above the fold at 390px viewport height (~ 700–750px CSS pixels on typical mobile devices).

**Above-fold zone (top ~600px at 390px width):**

| Content | Must be above fold | Notes |
|---------|-------------------|-------|
| Success icon | ✅ Yes | 40–48px, centered |
| "Order Placed!" heading | ✅ Yes | 28px Playfair Display on mobile |
| "Your order reference:" label | ✅ Yes | 13px Inter |
| `BRW-NNNNN` reference number | ✅ Yes | 28px Playfair Display, `#C8922A` |
| Estimated ready time | ✅ Yes | 14px Inter |
| Order summary / itemized list | ❌ Below fold acceptable | Scrollable |
| "Start a New Order" button | ❌ Below fold acceptable | Reachable via scroll |

Font size tuned for 390px: heading 28px (not 40px as on desktop) to fit without scrolling.

---

### Scroll Behavior

- **Category filter bar:** horizontal scroll on mobile (never wraps)
- **Modal body:** vertical scroll within max-height container; footer sticky
- **Cart drawer body:** vertical scroll within full-screen / panel; footer sticky
- **Menu grid:** standard page scroll
- **Confirmation screen:** page scroll for itemized list; critical info above fold
- **No horizontal scroll** at any screen width (320px – 1920px)

---
