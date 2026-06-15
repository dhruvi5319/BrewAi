---

## Screen-01: Drink Customization Modal

**Trigger:** "Customize" CTA on product card
**Purpose:** Configure all drink options before adding to cart; see real-time price
**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5, US-2.6, US-5.3

---

### Desktop Layout (≥ 768px) — Centered Dialog

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  BACKDROP: bg-#0A0A0A/80, backdrop-blur-sm
│  ┌──────────────────────────────────────────────┐   │
   │ MODAL  bg:#1C1C1C  radius:12px  max-w:600px  │
│  │ border:1px solid #2A2A2A                     │   │
   ├──────────────────────────────────────────────┤
│  │ HEADER                              [×]      │   │
   │  Iced Oat Latte        Base: $5.50           │
│  │  Playfair 20px         Inter 16px #C8922A    │   │
   ├──────────────────────────────────────────────┤
│  │ SCROLL BODY                                  │   │
   │                                              │
│  │  Size                          (fieldset)    │   │
   │  [Small −$0.50] [Medium $0.00●] [Large +$0.75]
│  │                                              │   │
   │  Milk Type                     (fieldset)    │
│  │  [Whole] [Oat●] [Almond] [Coconut] [Skim]   │   │
   │  [None]                                      │
│  │                                              │   │
   │  Temperature                   (fieldset)    │
│  │  [Hot] [Iced●] [Blended]                     │   │
   │                                              │
│  │  Shot Count ← espresso only    (fieldset)    │   │
   │  [Single] [Double●] [Triple]                 │
│  │                                              │   │
   │  Extras (multi-select)                       │
│  │  [Vanilla Syrup +$0.75] [Caramel +$0.60]    │   │
   │  [Hazelnut +$0.60] [Whipped Cream +$0.50]   │
│  │  [Extra Shot +$1.00]                         │   │
   │                                              │
│  │  Special Instructions                        │   │
   │  ┌──────────────────────────────────────┐   │
│  │  │ Any special requests? (e.g. no foam) │   │   │
   │  └──────────────────────────────────────┘   │
│  │                                  45/200      │   │
   ├──────────────────────────────────────────────┤
│  │ FOOTER                                       │   │
   │  Per item: $6.25     Total: $12.50           │
│  │  [−] [2] [+]         [Add to Cart]           │   │
   │  ← qty stepper       ← primary, full-width   │
│  └──────────────────────────────────────────────┘   │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### Mobile Layout (< 768px) — Bottom Sheet

```
┌───────────────────────────┐
│ BACKDROP (dimmed)         │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│
│ BOTTOM SHEET              │
│ fixed bottom-0 left-0     │
│ right-0 max-h-[90vh]      │
│ rounded-t-[20px]          │
│ bg:#1C1C1C                │
├───────────────────────────┤
│ HEADER              [×]  │
│ Iced Oat Latte  $5.50    │
├───────────────────────────┤
│ (scrollable body)         │
│  Size                     │
│  [Sm] [Md●] [Lg]         │
│                           │
│  Milk Type                │
│  [Whole][Oat●][Almond]   │
│  [Coconut][Skim][None]   │
│                           │
│  Temperature              │
│  [Hot][Iced●][Blended]   │
│                           │
│  Shot Count               │
│  [Single][Double●][Triple]│
│                           │
│  Extras                   │
│  [Vanilla +$0.75]         │
│  [Caramel +$0.60]         │
│  [Whipped +$0.50]         │
│                           │
│  Special Instructions     │
│  ┌─────────────────────┐ │
│  │ Any special reqs?   │ │
│  └─────────────────────┘ │
│                  45/200   │
├───────────────────────────┤
│ FOOTER (sticky)           │
│ $6.25    Total: $12.50    │
│ [−][2][+] [Add to Cart]   │
└───────────────────────────┘
```

---

### Information Hierarchy

| Priority | Content | Placement | Style |
|----------|---------|-----------|-------|
| Primary | Drink name | Modal header | Playfair Display 20px `#F5F0E8` |
| Primary | Total price | Footer, right of stepper | Inter 16px semibold `#C8922A` |
| Primary | "Add to Cart" | Footer, primary CTA | `variant="primary"` |
| Secondary | Base / per-item price | Header / footer | Inter 14px `#9A9080` |
| Secondary | Option selectors | Scrollable body | Fieldset groups, pill radios |
| Secondary | Add-on chips | Body, below selectors | Multi-select chips w/ price delta |
| Secondary | Quantity stepper | Footer left | [−][N][+], 44px targets |
| Tertiary | Character counter | Below textarea | 11px `#9A9080` → `#E57373` at ≤10 |
| Tertiary | Price deltas on size options | Size selector | Inter 13px `#9A9080` |

---

### States

| State | Appearance | User Feedback |
|-------|-----------|---------------|
| Default / open | Full controls visible, defaults pre-selected | Price shows with defaults |
| Option loading | Skeleton loaders for option sections | "Add to Cart" disabled |
| Option load error | Error message in body | "Could not load options. [Retry]" |
| Size selected | Amber border + shadow on selection | Price updates immediately |
| Add-on selected | Amber border + shadow on chip | Total updates immediately |
| Add-on deselected | Default chip style | Total decrements |
| Qty at minimum (1) | [−] button disabled | No visual change to price |
| Qty at maximum (10) | [+] button disabled | No visual change to price |
| Instructions at limit | Counter red, input blocked | `#E57373` counter, no new chars |
| Loading (add) | Not applicable (instant) | — |

---

### Selector Components

**Radio Pill Group (size, milk, temperature, shots)**
```
Fieldset legend: Inter 13px semibold #9A9080 uppercase tracking-wide
Pill: padding 8px 16px, radius 20px, min-height 44px
  Default: bg-#141414, border-1px-#2A2A2A, text-#9A9080
  Hover:   bg-#1C1C1C, border-#3A3A3A, text-#F5F0E8
  Selected: border-#C8922A, box-shadow: 0 0 0 1px rgba(200,146,42,0.25),
            text-#F5F0E8, bg-#141414
```

**Add-on Multi-select Chip**
```
Chip: padding 8px 16px, radius 20px, min-height 44px
  Default: bg-#141414, border-1px-#2A2A2A, text-#9A9080
  Hover:   bg-#1C1C1C, border-#3A3A3A
  Selected: border-#C8922A, box-shadow: 0 0 0 1px rgba(200,146,42,0.25),
            text-#F5F0E8
  Label format: "[Name] +$X.XX"
```

**Quantity Stepper**
```
[−]  [N]  [+]
 └────┘    └──── Inter 14px semibold, #F5F0E8
Each button: 44×44px, bg-#141414, border-1px-#2A2A2A, radius-6px
Disabled state: opacity-40, cursor-not-allowed
```

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "×" close button | Icon button | Closes modal, no cart change |
| Size pill | Radio button | Selects size, recalculates price |
| Milk pill | Radio button | Selects milk (no price change) |
| Temperature pill | Radio button | Selects temp (no price change) |
| Shot count pill | Radio button | Selects shots (espresso only) |
| Add-on chip | Toggle chip | Multi-select; toggles on/off |
| Instructions textarea | Text input | Live char counter |
| [−] stepper | Icon button | Decrease qty (min 1) |
| [+] stepper | Icon button | Increase qty (max 10) |
| "Add to Cart" | Primary button | Validates, adds to cart, closes |
| Backdrop | Overlay | Clicks to close modal |

---

### Conditional Rendering Rules

| Section | Condition to Show |
|---------|------------------|
| Milk selector | `item.options.milks.length > 0` |
| Temperature (selector) | `item.options.temperatures.length > 1` |
| Temperature (read-only label) | `item.options.temperatures.length === 1` |
| Shot count selector | `item.drink_type === 'espresso'` |
| Add-ons section | `item.options.extras.length > 0` |

These rules ensure contextual options only — never expose irrelevant controls.

---
