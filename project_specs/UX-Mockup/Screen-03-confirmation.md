---

## Screen-03: Order Confirmation

**Route:** `/confirmation`
**Purpose:** Deliver a clear, branded receipt after successful order submission; all critical info visible above the fold on mobile
**User Stories:** US-4.2, US-4.4, US-5.1, US-6.2

---

### Desktop Layout (≥ 768px) — Centered Card

```
┌─────────────────────────────────────────────────────────────────┐
│                       bg: #0A0A0A                               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  CONFIRMATION CARD   bg:#141414  radius:12px  max-w:560px │  │
│  │  border:1px solid #2A2A2A  padding:40px                   │  │
│  │                                                           │  │
│  │          ✓                                                │  │
│  │    CheckCircle2 icon, 48px, #4CAF50                       │  │
│  │    aria-hidden="true"                                     │  │
│  │                                                           │  │
│  │        Order Placed!                                      │  │
│  │    Playfair Display, 40px, #F5F0E8                        │  │
│  │    [autofocus on mount; role="status" live region]        │  │
│  │                                                           │  │
│  │    Your order reference:                                  │  │
│  │    Inter, 13px, #9A9080                                   │  │
│  │                                                           │  │
│  │          BRW-00042                                        │  │
│  │    Playfair Display, 28px, #C8922A                        │  │
│  │                                                           │  │
│  │    Ready in approximately 15–20 minutes                   │  │
│  │    Inter, 14px, #9A9080                                   │  │
│  │                                                           │  │
│  │  ─────────────────────────────────────────────────────    │  │
│  │  Order Summary                                            │  │
│  │  Inter, 16px semibold, #F5F0E8                            │  │
│  │  ─────────────────────────────────────────────────────    │  │
│  │                                                           │  │
│  │  • Large Oat Latte × 2                    $12.50          │  │
│  │    Large · Oat · Iced                                     │  │
│  │                                                           │  │
│  │  • Vanilla Cold Brew × 1                   $5.75          │  │
│  │    Large · Iced · Vanilla Syrup                           │  │
│  │                                                           │  │
│  │  ─────────────────────────────────────────────────────    │  │
│  │  Subtotal                                 $18.25          │  │
│  │  Inter, 16px semibold, #F5F0E8                            │  │
│  │                                                           │  │
│  │        [ Start a New Order ]                              │  │
│  │        primary btn, auto-width, centered                  │  │
│  │        aria-label="Start a new order and return to menu"  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px, 390px reference) — Full Page, Above-Fold First

```
┌───────────────────────────┐  ← 390px wide
│ bg: #0A0A0A               │
│                           │
│ COMPACT HEADER            │  ← no cart badge (cart cleared)
│  BrewAI Logo              │
│                           │
│ ┌─────────────────────┐   │  ← confirmation card
│ │ bg:#141414          │   │    radius:12px, mx:16px, padding:24px
│ │                     │   │
│ │   ✓  CheckCircle2   │   │  ← 40px icon, #4CAF50
│ │                     │   │
│ │   Order Placed!     │   │  ← Playfair Display, 28px, #F5F0E8
│ │   (autofocus)       │   │    (smaller on mobile to fit)
│ │                     │   │
│ │ Your order ref:     │   │  ← Inter 13px, #9A9080
│ │   BRW-00042         │   │  ← Playfair Display, 28px, #C8922A
│ │                     │   │
│ │ Ready in ~15–20 min │   │  ← Inter 14px, #9A9080
│ │                     │   │  ╌╌╌ FOLD LINE at 390px ╌╌╌
│ │ ─────────────────── │   │
│ │ Order Summary       │   │  ← scrollable below fold
│ │ ─────────────────── │   │
│ │ • Oat Latte ×2      │   │
│ │   Large · Oat · Iced│   │
│ │              $12.50 │   │
│ │                     │   │
│ │ • Cold Brew ×1      │   │
│ │   Large · Iced ...  │   │
│ │               $5.75 │   │
│ │ ─────────────────── │   │
│ │ Subtotal   $18.25   │   │
│ │                     │   │
│ │ [ Start a New Order ]│  │  ← primary, full-width
│ └─────────────────────┘   │
│                           │
└───────────────────────────┘
```

**Above-fold guarantee (390px):** The success icon, "Order Placed!" heading, order reference (`BRW-NNNNN`), and estimated ready time are all visible without scrolling. The itemized summary is below the fold (acceptable — reference number is the critical info for pickup).

---

### Information Hierarchy

| Priority | Content | Placement | Style |
|----------|---------|-----------|-------|
| Primary | "Order Placed!" heading | Card top, post-icon | Playfair Display 40px (desktop) / 28px (mobile) `#F5F0E8` |
| Primary | Order reference (`BRW-NNNNN`) | Below heading | Playfair Display 28px `#C8922A` |
| Primary | Estimated ready time | Below reference | Inter 14px `#9A9080` |
| Secondary | Order summary section | Below divider | Inter 16px semibold header |
| Secondary | Line items (name + summary + price) | Summary list | Inter 14px `#F5F0E8` / `#9A9080` / `#C8922A` |
| Secondary | Subtotal | Below item list | Inter 16px semibold `#F5F0E8` |
| Tertiary | "Start a New Order" CTA | Card bottom | Primary button, full-width mobile |
| Tertiary | Success icon | Card top | Lucide `CheckCircle2` 48px `#4CAF50`, decorative |

---

### States

| State | Appearance | User Feedback |
|-------|-----------|---------------|
| Success (default) | Full confirmation card with reference | Order reference readable immediately |
| Entering screen | Fade-in entrance animation 200ms | Smooth transition from cart |
| "Start a New Order" hover | Button accent hover `#E0A83C` | 150ms color transition |
| "Start a New Order" click | Navigate to `/`, cart empty | Menu page loads from cache |

---

### Order Line Item Format (Summary Section)

```
┌──────────────────────────────────────────┐
│ • Iced Oat Latte × 2              $12.50 │
│   Large · Oat · Iced                     │
└──────────────────────────────────────────┘
```

- Bullet + drink name: Inter 14px semibold, `#F5F0E8`
- Quantity `× N`: Inter 14px, `#9A9080`
- Line price: Inter 14px semibold, `#C8922A`, right-aligned
- Customization summary: Inter 13px, `#9A9080`, indented, below name
- Divider: `border-top: 1px solid #2A2A2A`

---

### Accessibility

- Main heading receives `autofocus` on route navigation (announces success to screen readers)
- `role="status"` live region wraps the confirmation message block
- Success icon: `aria-hidden="true"` (decorative — content conveyed by heading text)
- "Start a New Order" button: `aria-label="Start a new order and return to menu"`
- Order reference uses `Playfair Display` visually but has no special ARIA; screen readers read `BRW-00042` as a string
- Page title: `"Order Confirmed — BrewAI"` (updates `<title>` on navigation)

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Start a New Order" | Primary button | Navigates to `/`; cart already cleared |
| Page (on load) | — | `autofocus` on heading; `role="status"` announces success |

---
