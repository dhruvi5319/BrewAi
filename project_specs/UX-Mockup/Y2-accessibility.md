---

## Accessibility Notes

**User Stories:** US-0.1, US-0.3, US-0.4, US-6.4
**Journeys:** All (cross-cutting concern)
**Standard:** WCAG 2.1 AA minimum

---

### Color Contrast

All text must meet WCAG AA: ≥ 4.5:1 for body text, ≥ 3:1 for large text (18px+ or 14px+ bold).

| Text color | Background | Ratio | Use | Passes? |
|------------|-----------|-------|-----|---------|
| `#F5F0E8` (Text Primary) | `#0A0A0A` (Canvas) | ~17:1 | Headings on page background | ✅ AA |
| `#F5F0E8` (Text Primary) | `#141414` (Surface) | ~15:1 | Body on cards | ✅ AA |
| `#F5F0E8` (Text Primary) | `#1C1C1C` (Surface Raised) | ~13:1 | Modal body text | ✅ AA |
| `#C8922A` (Accent) | `#0A0A0A` (Canvas) | ~5.7:1 | Prices on page bg | ✅ AA |
| `#C8922A` (Accent) | `#141414` (Surface) | ~5.1:1 | Prices on cards | ✅ AA |
| `#9A9080` (Text Secondary) | `#141414` (Surface) | ~4.6:1 | Descriptions on cards | ✅ AA |
| `#9A9080` (Text Secondary) | `#1C1C1C` (Surface Raised) | ~4.1:1 | Modal helper text | ⚠️ Borderline — monitor |
| `#0A0A0A` (Canvas) | `#C8922A` (Accent) | ~5.7:1 | Button text on amber | ✅ AA |
| `#E57373` (Error) | `#141414` (Surface) | ~4.6:1 | Error messages | ✅ AA |
| `#4CAF50` (Success) | `#0A0A0A` (Canvas) | ~5.2:1 | Confirmation icon | ✅ AA |
| `#5A5248` (Text Tertiary) | `#141414` (Surface) | ~2.1:1 | Placeholders, decorative | ℹ️ Decorative only |

> **Note on `#9A9080` on `#1C1C1C`:** Borderline at ~4.1:1. For body text use cases, bump to `#A09888` if needed. For decorative/helper labels it is acceptable.

---

### Focus Rings

**Rule:** All interactive elements show a `2px solid #C8922A` focus ring on keyboard navigation (`:focus-visible`), **not** on mouse click.

Implementation:
- Applied globally via Tailwind: `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`
- `ring-offset` background matches the element's container color
- **Never** `:focus` alone (would show ring on mouse click — avoid)
- Applied automatically via `Button`, `Input`, `Select`, and any `<button>` / `<a>` in the component library

```css
/* Applied via Tailwind utility on all interactive primitives */
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-[#C8922A]
focus-visible:ring-offset-2
focus-visible:ring-offset-[container-bg]
```

---

### Keyboard Navigation

#### Menu Page

| Action | Key |
|--------|-----|
| Tab through category pills | `Tab` / `Shift+Tab` |
| Activate/deactivate pill | `Enter` or `Space` |
| Tab to search input | `Tab` |
| Navigate card CTAs | `Tab` / `Shift+Tab` |
| Activate "Customize" | `Enter` |
| Activate "Add to Cart" | `Enter` |
| Open cart | `Tab` to cart icon → `Enter` |

#### Customization Modal

| Action | Key |
|--------|-----|
| Close modal | `Escape` |
| Navigate controls | `Tab` / `Shift+Tab` (focus trapped inside modal) |
| Select radio pill | Arrow keys within `<fieldset>` group |
| Toggle add-on chip | `Enter` or `Space` |
| Adjust quantity | `Tab` to [−] or [+] → `Enter` |
| Submit | `Tab` to "Add to Cart" → `Enter` |
| Focus on close | Returns to "Customize" button that opened modal |

#### Cart Drawer

| Action | Key |
|--------|-----|
| Close drawer | `Escape` |
| Navigate items | `Tab` / `Shift+Tab` (focus trapped inside drawer) |
| Remove item | `Tab` to [×] → `Enter` |
| Adjust quantity | `Tab` to [−] or [+] → `Enter` |
| Clear cart | `Tab` to [Clear Cart] → `Enter` → `Tab` to [Clear All] → `Enter` |
| Place order | `Tab` to [Place Order] → `Enter` |
| Focus on close | Returns to cart icon in navigation |

#### Confirmation Screen

| Action | Key |
|--------|-----|
| Focus on arrival | Auto-focus on "Order Placed!" heading |
| Start new order | `Tab` to button → `Enter` |

---

### ARIA Labels Reference

| Element | ARIA attribute | Value |
|---------|---------------|-------|
| Cart icon button | `aria-label` | `"Open cart, N items"` (N = totalCount) |
| Cart drawer | `role`, `aria-modal`, `aria-label` | `"dialog"`, `"true"`, `"Your cart"` |
| Modal | `role`, `aria-modal`, `aria-labelledby` | `"dialog"`, `"true"`, `[id of title]` |
| Modal close button | `aria-label` | `"Close customization dialog"` |
| Qty decrement (modal) | `aria-label` | `"Decrease quantity"` |
| Qty increment (modal) | `aria-label` | `"Increase quantity"` |
| Qty decrement (cart) | `aria-label` | `"Decrease quantity for [Drink Name]"` |
| Qty increment (cart) | `aria-label` | `"Increase quantity for [Drink Name]"` |
| Remove item button (cart) | `aria-label` | `"Remove [Drink Name] from cart"` |
| "Clear Cart" button | `aria-label` | `"Clear all items from cart"` |
| "Place Order" (disabled) | `aria-disabled` | `"true"` (not HTML `disabled` alone — allows focus for screen readers) |
| "Place Order" (loading) | `aria-busy` | `"true"` |
| "Start a New Order" | `aria-label` | `"Start a new order and return to menu"` |
| Success icon | `aria-hidden` | `"true"` (decorative) |
| Confirmation block | `role` | `"status"` (live region for screen reader announcement) |
| Size fieldset | `<legend>` | `"Size"` |
| Milk fieldset | `<legend>` | `"Milk type"` |
| Temperature fieldset | `<legend>` | `"Temperature"` |
| Shot count fieldset | `<legend>` | `"Shot count"` |
| Add-ons group | `<legend>` | `"Extras"` |

---

### Screen Reader Considerations

- **Menu card descriptions:** Full description available in the card; 2-line clamp is CSS-only and doesn't truncate the DOM text (screen readers read the full description).
- **Category filter pills:** Communicate selected state via `aria-pressed="true"` / `"false"` on toggle buttons.
- **Skeleton cards:** Marked `aria-hidden="true"` (decorative loading placeholders — not meaningful to screen readers). A `role="status"` region announces "Loading menu…" while fetch is in-flight.
- **Toast notifications:** Rendered in a `role="status"` or `role="alert"` live region so screen readers announce additions without requiring focus.
- **Price updates in modal:** The price display region has `aria-live="polite"` so updates are announced without interrupting the user.
- **Customization summary in cart:** Full text (not truncated) — screen readers announce the complete customization string.
- **Order confirmation:** `autofocus` on the heading ensures the screen reader announces the success immediately on navigation.

---

### Reduced Motion

All animations in the app are gated behind `useReducedMotion()` (Framer Motion):

| Animation | Reduced motion behavior |
|-----------|------------------------|
| Menu card stagger entrance | Elements appear instantly |
| Category filter card re-arrangement | Instant swap, no transition |
| Modal open/close | No scale/fade; modal appears/disappears instantly |
| Cart drawer slide | No slide; drawer appears/disappears instantly |
| Toast slide-in/fade-out | Toast appears/disappears instantly |
| Cart badge pop | No scale keyframe; count updates in place |
| Button active scale | No scale-down on tap |
| Page transitions | Instant (no fade) |

CSS `prefers-reduced-motion: reduce` media query also applied to any CSS-only transitions:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

### Semantic HTML Requirements

| Element | Semantic tag | Notes |
|---------|-------------|-------|
| Navigation bar | `<nav>` | With `aria-label="Main navigation"` |
| Menu grid | `<main>` + `<ul>` / `<li>` | Grid as a list of products |
| Product card | `<li>` + `<article>` | Semantic item container |
| Filter bar | `<nav aria-label="Category filters">` + `<ul>` | Landmark for filter controls |
| Modal | `<dialog>` or `<div role="dialog">` | With `aria-modal="true"` |
| Customization fieldsets | `<fieldset>` + `<legend>` | Groups related radio/checkbox inputs |
| Cart drawer | `<aside role="dialog">` | Landmark with dialog semantics |
| Confirmation heading | `<h1>` | Main page heading, receives autofocus |
| Order summary list | `<ul>` + `<li>` | Semantic list of order items |
| Page title | `<title>` | Updates on route change: `"BrewAI — Specialty Coffee"` / `"Order Confirmed — BrewAI"` |

---
