---

## Screen-00: Menu Page

**Route:** `/`
**Purpose:** Primary browsing surface — discover, filter, search, and select drinks
**User Stories:** US-1.1, US-1.2, US-1.3, US-1.4, US-1.5, US-5.1, US-5.2, US-6.1

---

### Desktop Layout (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVIGATION BAR                                              bg: #141414      │
│  BrewAI    [Menu]  [About]                     [🛒 Cart (3)]                │
│  Playfair  Inter 14px                          Lucide ShoppingCart           │
│  Display   #9A9080                             badge: #C8922A pill           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                             bg: #0A0A0A      │
│  SEARCH BAR                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  🔍  Search drinks…                                                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  CATEGORY FILTER BAR                                                         │
│  [All ●] [Espresso] [Cold Brew] [Pour-Over] [Tea] [Seasonal]               │
│  pills: 20px radius, 44px min-height                                         │
│                                                                              │
│  MENU GRID — 3 columns at lg (1024–1535px), 4 at 2xl (1536px+)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │ [Espresso]   │  │ [Cold Brew]  │  │ [Seasonal]   │  ← category badges    │
│  │              │  │              │  │              │                        │
│  │ Drink Name   │  │ Drink Name   │  │ Drink Name   │  ← Playfair Display   │
│  │ Description  │  │ Description  │  │ Description  │  ← Inter 14px 2-line  │
│  │ text here in │  │ text here in │  │ text here in │     clamp, #9A9080    │
│  │ two lines max│  │ two lines max│  │ two lines max│                        │
│  │              │  │              │  │              │                        │
│  │ $4.50  [CTA] │  │ $5.75  [CTA] │  │ $6.50  [CTA] │  ← price: #C8922A   │
│  └──────────────┘  └──────────────┘  └──────────────┘     CTA: primary btn  │
│                                                                              │
│  [Card] [Card] [Card]                                                        │
│  [Card] [Card] [Card]                                                        │
│  ...                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px, 390px reference)

```
┌───────────────────────────┐
│ COMPACT HEADER  bg:#141414│
│  BrewAI Logo   [🛒 (3)]   │
│  max-width:120px  badge   │
├───────────────────────────┤
│               bg: #0A0A0A │
│  ┌──────────────────────┐ │
│  │ 🔍 Search drinks…    │ │
│  └──────────────────────┘ │
│                           │
│  CATEGORY FILTER — h-scroll
│  [All●][Espresso][Cold...] → scroll
│  no page-level h-scroll   │
│                           │
│  MENU GRID — 1 column     │
│  ┌──────────────────────┐ │
│  │ [Espresso]           │ │
│  │ Drink Name           │ │ ← Playfair Display
│  │ Description text in  │ │ ← Inter 14px, 2-line
│  │ two lines max here   │ │    clamp, #9A9080
│  │                      │ │
│  │ $4.50       [CTA]    │ │ ← #C8922A / primary btn
│  └──────────────────────┘ │
│                           │
│  ┌──────────────────────┐ │
│  │ [Cold Brew]          │ │
│  │ ...                  │ │
│  └──────────────────────┘ │
│                           │
└───────────────────────────┘
```

---

### Product Card

```
┌────────────────────────────────┐
│  [Category Badge]              │  ← Badge: Inter 11px semibold
│                                │    bg: #C8922A/15, text: #C8922A
│  Drink Name Here               │  ← Playfair Display, 18px, #F5F0E8
│  Description up to two lines   │  ← Inter, 14px, #9A9080, line-clamp-2
│  of text clamped right here    │
│                                │
│  $4.50                [CTA]   │  ← price: Inter 16px semibold #C8922A
└────────────────────────────────┘
```

Card spec:
- `bg: #141414`, `border: 1px solid #2A2A2A`, `border-radius: 12px`, `padding: 16px`
- Min-height: 160px
- Hover: `bg: #1C1C1C`, `border-color: #3A3A3A`, transition 150ms
- CTA: "Customize" if `hasCustomizations: true`; "Add to Cart" if `hasCustomizations: false`
- CTA button: `variant="primary"`, `size="sm"`

---

### Information Hierarchy

| Priority | Content | Placement | Style |
|----------|---------|-----------|-------|
| Primary | Drink name | Card top, after badge | Playfair Display 18px `#F5F0E8` |
| Primary | Price | Card bottom-left | Inter 16px semibold `#C8922A` |
| Primary | CTA button | Card bottom-right | Primary variant, accent bg |
| Secondary | Category badge | Card top-left | Badge component, accent tint |
| Secondary | Description | Below name | Inter 14px `#9A9080` 2-line clamp |
| Tertiary | Filter bar | Below search | Pill buttons, 44px min-height |
| Tertiary | Search input | Below nav | Full-width, placeholder text |

---

### States

| State | Appearance | User Feedback |
|-------|-----------|---------------|
| Loading | 8 skeleton cards, pulsing `#1C1C1C` | Immediate (no spinner) |
| Default | Card grid, all items | Full menu visible |
| Category filtered | Filtered card grid; active pill amber | Instant re-render, animated |
| Search filtered | Filtered card grid | 200ms debounce, then updates |
| Empty (filter/search) | Empty state illustration + message | "No drinks match your search" + [Clear Filters] |
| Empty (no API data) | Empty state, different message | "No drinks available yet." (no Clear Filters) |
| Error | Error message + [Retry] | "Could not load the menu. Please try again." |

---

### Loading Skeleton Card

```
┌────────────────────────────────┐
│  ████████                      │  ← badge skeleton, 60px wide
│                                │
│  ████████████████████          │  ← name skeleton, 80% width
│  █████████████████████████     │  ← desc line 1, full width
│  ████████████████              │  ← desc line 2, 60% width
│                                │
│  ██████       ██████████       │  ← price + CTA skeletons
└────────────────────────────────┘
```

- All skeleton blocks: `bg: #1C1C1C`, `border-radius: 6px`, pulsing opacity animation
- Grid layout identical to real cards (no layout shift on data arrival)

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Search input | Text input | Debounced 200ms filter; clears with × |
| Category pill (inactive) | Toggle button | Click → activates, filters grid |
| Category pill (active) | Toggle button (selected) | Click → deactivates, resets to "All" |
| Product card "Customize" | Primary button | Opens customization modal (Flow-01) |
| Product card "Add to Cart" | Primary button | Adds with defaults, shows toast |
| Cart icon + badge | Icon button | Opens cart drawer (Flow-02) |
| [Retry] (error state) | Secondary button | Re-invokes fetchMenu() |
| [Clear Filters] (empty state) | Ghost button | Resets category + search |

---
