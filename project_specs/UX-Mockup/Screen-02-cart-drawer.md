---

## Screen-02: Cart Drawer

**Trigger:** Cart icon tap in navigation bar
**Purpose:** Review, adjust, and proceed to order from the accumulated cart
**User Stories:** US-3.1, US-3.2, US-3.3, US-3.4, US-3.5, US-5.3

---

### Desktop Layout (≥ 768px) — Slide-Over Panel

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
 BACKDROP: bg-#0A0A0A/50, click to close
│  ┌──────────────────────────────────────────────────────────┐  │
   │         CART DRAWER  right-0, width:400px                │
│  │         bg:#141414  border-left:1px-#2A2A2A  full-height│  │
   ├──────────────────────────────────────────────────────────┤
│  │ HEADER                                          [×]      │  │
   │  Your Cart (3 items)              [Clear Cart]           │
│  │  Inter 16px semibold #F5F0E8      ghost, text-#E57373    │  │
   ├──────────────────────────────────────────────────────────┤
│  │ ITEM LIST (scrollable)                                    │  │
   │  ┌──────────────────────────────────────────────────┐   │
│  │  │ Iced Oat Latte                  $6.25       [×]  │   │  │
   │  │ Large · Oat · Iced · Vanilla Syrup                │   │
│  │  │                      [−]  [2]  [+]               │   │  │
   │  └──────────────────────────────────────────────────┘   │
│  │  ┌──────────────────────────────────────────────────┐   │  │
   │  │ Kenya Seasonal Espresso         $5.50       [×]  │   │
│  │  │ Medium · Oat · Double                             │   │  │
   │  │                      [−]  [1]  [+]               │   │
│  │  └──────────────────────────────────────────────────┘   │  │
   │                                                          │
│  ├──────────────────────────────────────────────────────────┤  │
   │ FOOTER (sticky)                                          │
│  │  Subtotal              $18.25                            │  │
   │  Inter 13px #9A9080    Inter 20px semibold #F5F0E8       │
│  │  ────────────────────────────────────────────────────    │  │
   │  [         Place Order         ]  ← primary, full-width  │
│  └──────────────────────────────────────────────────────────┘  │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

### Mobile Layout (< 768px) — Full-Screen Overlay

```
┌───────────────────────────┐
│ CART DRAWER               │
│ fixed inset-0             │
│ bg:#141414                │
├───────────────────────────┤
│ HEADER                [×]│
│ Your Cart (3 items)       │
│         [Clear Cart]      │
├───────────────────────────┤
│ ITEM LIST (scrollable)    │
│ ┌─────────────────────┐  │
│ │ Iced Oat Latte  $6.25│ │
│ │ Large · Oat · Iced  │  │
│ │ · Vanilla Syrup     │  │
│ │         [−][2][+] [×]│ │
│ └─────────────────────┘  │
│ ┌─────────────────────┐  │
│ │ Kenya Seasonal $5.50 │  │
│ │ Medium · Oat · Double│ │
│ │         [−][1][+] [×]│ │
│ └─────────────────────┘  │
├───────────────────────────┤
│ FOOTER (sticky)           │
│ Subtotal       $18.25     │
│ [    Place Order    ]     │ ← full-width, 44px+
└───────────────────────────┘
```

---

### Empty Cart State

```
┌──────────────────────────────────────────┐
│ HEADER                         [×]       │
│  Your Cart                               │
├──────────────────────────────────────────┤
│                                          │
│                                          │
│         [ShoppingCart icon]              │
│          Lucide, 48px, #5A5248           │
│                                          │
│         Your cart is empty               │
│         Inter 16px, #9A9080             │
│                                          │
│         [ Browse Menu ]                  │
│         secondary button                 │
│                                          │
├──────────────────────────────────────────┤
│ FOOTER                                   │
│  [ Place Order ]  ← disabled, muted      │
└──────────────────────────────────────────┘
```

---

### Cart Line Item Detail

```
┌─────────────────────────────────────────────────┐
│  Iced Oat Latte                 $6.25      [×]  │
│  Large · Oat · Iced · Vanilla Syrup             │
│                          [−]   [2]   [+]        │
└─────────────────────────────────────────────────┘
```

- Drink name: Inter 14px semibold, `#F5F0E8`
- Customization summary: Inter 13px, `#9A9080`, full text (no truncation)
  - Format: `[Size] · [Milk] · [Temp] · [Shots] · [Addon1], [Addon2]`
  - Null/empty fields omitted
- Unit price: Inter 14px semibold, `#C8922A`
- Remove [×]: Lucide X icon, 44×44px tap target, `text-#5A5248` → hover `text-#E57373`
  - `aria-label="Remove [Drink Name] from cart"`
- Quantity stepper:
  - Each button: 44×44px
  - Count display: Inter 14px, `#F5F0E8`, min-width to prevent layout jump
  - `aria-label="Increase quantity for [Drink Name]"` / `"Decrease quantity for [Drink Name]"`
  - [−] at qty=1: still visible but decrement removes item (no disabled state needed — behavior is remove)
  - [+] at qty=10: `disabled`, `opacity-40`
- Item card: `bg-#141414`, `border: 1px solid #2A2A2A`, `border-radius: 12px`, `padding: 16px`

---

### Clear Cart Confirmation (Inline Prompt)

```
┌──────────────────────────────────────────────┐
│ [Clear Cart] ← tapped                        │
│ ┌────────────────────────────────────────┐   │
│ │ Remove all items from your cart?       │   │
│ │                                        │   │
│ │   [Cancel]        [Clear All]          │   │
│ │   ghost btn       danger btn           │   │
│ └────────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```
- Appears inline in cart header area, below "Clear Cart" button
- NOT a separate modal (avoids stacked modals complexity)
- [Cancel]: `variant="ghost"`, dismisses prompt, no change
- [Clear All]: `variant="danger"`, calls `cartStore.clearCart()`, empty state shown

---

### Navigation Bar — Cart Badge

```
  Desktop Nav:                Mobile Header:
  [...nav links...]           BrewAI         [🛒]
  [🛒]   ← ShoppingCart      (badge only when count > 0)
   ●3    ← badge: #C8922A pill
          Inter 11px semibold
          bg: #C8922A, text: #0A0A0A
          radius: 20px (pill)
```

- Badge shows when `totalCount > 0`; hidden when `totalCount === 0`
- Badge count = sum of all `item.quantity` values
- On count change: `scale([1, 1.3, 1])` keyframe over 300ms
- `aria-label="Open cart, N items"` on cart icon button

---

### Information Hierarchy

| Priority | Content | Placement | Style |
|----------|---------|-----------|-------|
| Primary | Drink names | Line items, top-left | Inter 14px semibold `#F5F0E8` |
| Primary | Subtotal | Footer, right | Inter 20px semibold `#F5F0E8` |
| Primary | "Place Order" CTA | Footer, full-width | Primary variant |
| Secondary | Customization summaries | Below drink name | Inter 13px `#9A9080` |
| Secondary | Unit prices | Line items, top-right | Inter 14px `#C8922A` |
| Secondary | Quantity steppers | Line items, bottom | 44px buttons |
| Tertiary | "Clear Cart" | Header area | Ghost, text-error color |
| Tertiary | "Subtotal" label | Footer, left | Inter 13px `#9A9080` |

---

### States

| State | Appearance | User Feedback |
|-------|-----------|---------------|
| Cart has items | Line item list | Full list visible, scrollable |
| Cart empty | Empty state view | Icon + message + [Browse Menu] |
| Item being removed | Fade + slide-left 150ms | Smooth exit animation |
| Subtotal updating | Instant recalculation | Number updates in-place |
| "Place Order" disabled | `opacity-40`, `aria-disabled` | Greyed out, unclickable |
| Clear Cart confirm | Inline prompt visible | Two action buttons |

---
