# UX Mockup — BrewAI
# Specialty Coffee Shop Web Application

**Project:** BrewAI
**Generated:** 2026-06-15
**Based on:** UserStories-BrewAI.md, PRD-BrewAI.md, FRD-BrewAI.md, JOURNEYS-BrewAI.md
**Stories covered:** US-0.1 – US-7.4 (36 stories, P0 + P1)

---

## Overview

BrewAI's UX is a single-page ordering flow: **Browse → Customize → Cart → Confirm**. The design language is dark, warm, and premium — every surface reinforces that the product is specialty coffee, not fast food. Interactions are fast (150–200ms), information is always where users expect it, and the system never surprises with price changes or data loss.

The experience is guest-only: no login gate, no payment step. The entire loop completes in under 2 minutes on mobile.

---

## Design System Reference

### Color Tokens

| Token | Value | Role |
|-------|-------|------|
| Canvas | `#0A0A0A` | Page/body background |
| Surface | `#141414` | Cards, panels |
| Surface Raised | `#1C1C1C` | Modals, inputs, dropdowns |
| Border Subtle | `#2A2A2A` | Default borders |
| Border Hover | `#3A3A3A` | Hover borders |
| Accent | `#C8922A` | CTAs, selected states, focus rings, price |
| Accent Hover | `#E0A83C` | Accent hover state |
| Text Primary | `#F5F0E8` | Main readable text |
| Text Secondary | `#9A9080` | Descriptions, labels |
| Text Tertiary | `#5A5248` | Placeholders, disabled |
| Success | `#4CAF50` | Confirmation icon, success states |
| Error | `#E57373` | Error messages, validation |

### Border Radii

| Context | Value |
|---------|-------|
| Inputs, selects, badges | 6px |
| Cards, cart items, modals | 12px |
| Category pills, tags | 20px |

### Typography Scale

| Size | Use |
|------|-----|
| 11px | Tertiary labels, counters |
| 13px | Secondary text, badges |
| 14px | Body text, descriptions, buttons |
| 16px | Card prices, sub-headings |
| 20px | Section headings, modal drink name |
| 28px | Order reference, page headings |
| 40px | Hero / confirmation success heading |

**Max font-weight: 600 (semibold)**
- Headings / drink names: **Playfair Display**
- Body / labels / buttons: **Inter**

### Interaction Tokens

| Property | Value |
|----------|-------|
| Color/border transition | 150ms ease |
| Transform transition | 200ms ease |
| Focus ring | 2px solid `#C8922A`, 2px offset |
| Button active scale | 0.97 |
| Toast auto-dismiss | 3 seconds |
| Search debounce | 200ms |

### Elevation / State Styles

| State | Style |
|-------|-------|
| Default card | `bg-#141414 border-1px-#2A2A2A radius-12px` |
| Hover card | `bg-#1C1C1C border-#3A3A3A` |
| Active/selected | `border-#C8922A box-shadow: 0 0 0 1px rgba(200,146,42,0.25)` |
| Focus ring | `outline: 2px solid #C8922A; outline-offset: 2px` |
| Disabled | `opacity-40 cursor-not-allowed` |
| Loading | Spinner (`text-accent`) + `opacity-70` |

---

## Screen Inventory

| Screen | Route | Primary Story |
|--------|-------|---------------|
| Menu Page | `/` | US-1.1 |
| Customization Modal | (overlay on `/`) | US-2.1 |
| Cart Drawer | (overlay, any route) | US-3.1 |
| Order Confirmation | `/confirmation` | US-4.2 |

---

## Flow Inventory

| Flow ID | Name | Entry | Exit |
|---------|------|-------|------|
| Flow-00 | Menu Browse & Filter | App load (`/`) | "Customize" or "Add to Cart" click |
| Flow-01 | Drink Customization | "Customize" CTA on card | Cart updated, modal closed |
| Flow-02 | Cart Management | Cart icon tap | "Place Order" or drawer closed |
| Flow-03 | Order Placement & Confirmation | "Place Order" button | "Start a New Order" → `/` |

---

## UX Principles (derived from Journeys)

1. **Speed is a feature.** Priya has 2 minutes. Every interaction must be instantaneous or show progress immediately.
2. **Trust through transparency.** Marcus needs to see every customization echoed back. The cart line item summary is the trust contract.
3. **Delight through premium aesthetics.** Jordan uses visual quality as a proxy for coffee quality. Dark canvas + amber + Playfair Display earns the order before a word is read.
4. **No data loss, ever.** Cart state survives navigation. A failed order never clears the cart.
5. **Contextual options only.** Shot count only on espresso. Temperature only where applicable. Never expose a control that doesn't apply.
6. **Real-time price = no surprises.** Every option change recalculates the total within 100ms. Transparency earns trust.

---
---

## Flow-00: Menu Browse & Filter

**User Stories:** US-1.1, US-1.2, US-1.3, US-1.4, US-1.5
**Journeys:** JRN-01.1 (stages 1–3), JRN-01.2 (stage 1), JRN-02.1 (stages 1–2), JRN-03.1 (stages 1–5)
**Entry:** User navigates to `/` (app load)
**Exit:** User clicks "Customize" → opens Flow-01 | User clicks "Add to Cart" → item added, toast shown

```
[App Load: GET /api/menu]
         │
         ▼
  [Skeleton: 8 card placeholders]
         │
    ┌────┴────┐
   API       API
  Success   Failure
    │           │
    ▼           ▼
[Menu Grid]  [Error State]
[Filter Bar]  "Could not load the menu."
[Search]      [Retry] → re-invoke fetchMenu()
    │
    ├── User types in search
    │       │ 200ms debounce
    │       ▼
    │   [Filter: name/description match]
    │
    ├── User clicks category pill
    │       │ immediate, client-side
    │       ▼
    │   [Filter: category match]
    │
    ├── Both filters active → AND logic
    │
    ├── Results found?
    │   ├── YES → Render filtered card grid
    │   └── NO  → [Empty State]
    │              "No drinks match your search"
    │              [Clear Filters] → reset both
    │
    ├── User clicks [Customize] on card
    │       └──▶ Flow-01 (Customization Modal)
    │
    └── User clicks [Add to Cart] on card
            └──▶ cartStore.addItem() (defaults)
                 Toast: "[Drink] added to cart"
                 Cart badge pops (scale keyframe)
```

### Steps Detail

**Step 1 — App Load & Skeleton**
- `GET /api/menu` fires on mount
- 8 skeleton cards render immediately in grid layout
- Skeleton: `bg-#1C1C1C` pulsing animation, same dimensions as real cards
- No content shift when real cards appear (same grid slots)

**Step 2 — Menu Grid Renders**
- Items sorted by `sortOrder` ASC
- Cards animate in: staggered `fadeIn + slideUp`, 200ms per card, 50ms stagger
- Category filter bar renders pills derived from API data (not hardcoded)
- "All" pill is always first, active by default (amber accent, selected style)

**Step 3 — Category Filter**
- Single-select: clicking a pill activates it; clicking active pill resets to "All"
- Filter is client-side (no API call)
- Card grid re-animates via `AnimatePresence mode="popLayout"`: exiting cards fade out, entering cards slide in
- Active pill: `border-accent, box-shadow: 0 0 0 1px rgba(200,146,42,0.25), text-#F5F0E8`
- Inactive pill: `border-#2A2A2A, text-#9A9080`

**Step 4 — Keyword Search**
- Search input at top of page, placeholder: "Search drinks…"
- Filters by `name` AND `description`, case-insensitive substring match
- 200ms debounce on keystrokes
- Combined with category filter using AND logic
- Clearing the field restores prior category-filtered view immediately

**Step 5 — Empty State**
- Shown when both filter + search yield zero results
- If API returns empty array: "No drinks available yet." (no Clear Filters button)
- If filter/search eliminates all: "No drinks match your search." + [Clear Filters]
- [Clear Filters] resets `activeCategory = 'All'` and `searchQuery = ''`

**Step 6 — Error State**
- Replaces skeleton entirely (no skeleton shown alongside error)
- Shows: "Could not load the menu. Please try again." + [Retry] button
- [Retry] re-invokes `fetchMenu()`, shows skeleton again during in-flight request

---
---

## Flow-01: Drink Customization

**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5, US-2.6
**Journeys:** JRN-01.1 (stage 4), JRN-01.2 (stage 3), JRN-02.1 (stage 3), JRN-03.2 (stages 1–4)
**Entry:** User clicks "Customize" on a product card
**Exit:** "Add to Cart" clicked → item in cart, modal closed, toast shown | Escape/backdrop/× clicked → modal closed, no cart change

```
[User clicks "Customize" on card]
         │
         ▼
[Modal opens: scaleIn + fadeIn, 200ms]
[Focus traps inside modal]
         │
         ▼
[Load item options]
    ├── From Zustand cache (instant)
    └── GET /api/menu/:id (if not cached)
              │
         ┌────┴────┐
       Success   Failure
         │           │
         ▼           ▼
   [Render        [Skeleton loaders
    controls]      for option sections]
                  [Retry] + "Add to Cart" disabled
         │
    Default selections applied:
    • Size: Medium (or first available)
    • Shots: Double (espresso only)
    • Qty: 1, no addons, no instructions
         │
         ├── User changes Size
         │       └── price recalculates (<100ms)
         │
         ├── User changes Milk
         │       └── (no price change in v1)
         │
         ├── User changes Temperature
         │       └── (no price change in v1)
         │
         ├── User changes Shot Count
         │       └── espresso only; (no price change)
         │
         ├── User toggles Add-on chip
         │       └── price recalculates (<100ms)
         │
         ├── User types Special Instructions
         │       └── character counter updates live
         │           ≤10 remaining → counter turns #E57373
         │
         ├── User adjusts Quantity stepper
         │       └── total = per-item × qty recalculates
         │
         ▼
[User clicks "Add to Cart"]
         │
    Validate size selected (always true by default)
         │
         ▼
    cartStore.addItem(CartItem)
    Modal closes: reverse scaleOut + fadeOut (150ms)
    Focus returns to triggering "Customize" button
    Toast: "[Drink Name] added to cart" (bottom-right)
    Cart badge pops: scale [1→1.3→1] over 300ms

[Alternative exits]
    Escape keydown  ──┐
    Backdrop click  ──┤──▶ Modal closes (150ms exit animation)
    × close button  ──┘    Focus returns to trigger, no cart change
```

### Steps Detail

**Step 1 — Modal Open**
- Backdrop: `bg-#0A0A0A/80 backdrop-blur-sm`, fades in 150ms
- Modal container: `bg-#1C1C1C`, `border-radius: 12px`
- Desktop: centered dialog, `max-width: 600px`
- Mobile: bottom sheet, `fixed bottom-0 left-0 right-0 max-height: 90vh rounded-t-[20px]`
- Animation: `scale(0.95) → scale(1)` + `opacity: 0 → 1`, 200ms easeOut

**Step 2 — Modal Header**
- Drink name: Playfair Display, 20px, `#F5F0E8`
- Base price: Inter, 16px, `#C8922A`
- "×" close button: top-right, 44×44px tap target, `aria-label="Close customization dialog"`

**Step 3 — Size Selector**
- Radio-style pill group (fieldset + legend)
- Each pill: label + price delta (`"Small −$0.50"`, `"Medium $0.00"`, `"Large +$0.75"`)
- Selected pill: `border-#C8922A, box-shadow: 0 0 0 1px rgba(200,146,42,0.25)`
- Default: Medium (or first option)

**Step 4 — Milk Selector**
- Radio-style pill group (fieldset + legend)
- Options from `item.options.milks` — if empty array, section is hidden entirely
- No price impact in v1

**Step 5 — Temperature Selector**
- Radio-style pill group (fieldset + legend)
- Options from `item.options.temperatures`
- If only one temperature: shown as static read-only label (not a selector)
- No price impact in v1

**Step 6 — Shot Count Selector**
- Radio-style pill group (fieldset + legend)
- Shown ONLY when `drink_type === 'espresso'`
- Options: Single, Double, Triple
- Default: Double
- No price impact in v1

**Step 7 — Add-ons / Extras**
- Multi-select chip group (checkboxes styled as toggle chips)
- Each chip: `"[Label] +$X.XX"`
- Selected chip: amber border + shadow (active/selected style)
- Section hidden if `item.options.extras` is empty array
- Price recalculates on each toggle

**Step 8 — Special Instructions**
- Textarea, `border-radius: 6px`, `bg-#1C1C1C`
- Placeholder: "Any special requests? (e.g. no foam, extra hot)"
- Character counter: `"N/200"` below textarea, 11px, `#9A9080`
- When ≤10 remaining: counter color → `#E57373`
- Input blocked at 200 chars
- Not shown in cart summary string (barista communication only)

**Step 9 — Quantity Stepper**
- [−] [count] [+] layout
- Range: 1–10; default 1
- [−] disabled at qty=1; [+] disabled at qty=10
- Both buttons: 44×44px min tap target
- `aria-label="Decrease quantity"` / `aria-label="Increase quantity"`

**Step 10 — Modal Footer (Price + Add to Cart)**
- Per-item price: `$X.XX`, 16px, `#C8922A`
- Total price: `$X.XX × qty = $X.XX`, 16px, `#F5F0E8`
- "Add to Cart" button: `variant="primary"`, full-width in modal footer
- Never disabled by default selections (size always pre-selected)

---
---

## Flow-02: Cart Management

**User Stories:** US-3.1, US-3.2, US-3.3, US-3.4, US-3.5
**Journeys:** JRN-01.1 (stage 5), JRN-02.1 (stage 4), JRN-02.2 (all stages), JRN-03.2 (stage 4)
**Entry:** User taps cart icon in navigation bar
**Exit:** "Place Order" → Flow-03 | Drawer closed (Escape/×/overlay click) → back to menu

```
[User taps cart icon in nav]
         │
         ▼
[Cart drawer animates in]
  Desktop: slides in from right, 200ms easeOut
  Mobile: slides up from bottom, 200ms easeOut
  Backdrop overlay dims main content
         │
    ┌────┴────┐
  Empty     Has Items
    │           │
    ▼           ▼
[Empty State]  [Line Item List]
"Your cart     Each item:
 is empty"     • Drink name
[Browse Menu]  • Customization summary
               • Unit price
               • Quantity stepper
               • Remove (×) button
               │
               ├── User taps [+] on line item
               │       quantity + 1 (max 10)
               │       subtotal updates immediately
               │
               ├── User taps [−] on line item
               │       ├── qty > 1: decrement
               │       └── qty = 1: remove item
               │               └── fade+slide exit 150ms
               │
               ├── User taps [×] on line item
               │       remove immediately (no confirm)
               │       item animates out: fade+slide-left 150ms
               │       if last item → Empty State shown
               │
               ├── User taps [Clear Cart]
               │       ▼
               │   [Confirmation prompt]
               │   "Remove all items from your cart?"
               │   [Cancel]     [Clear All]
               │      │              │
               │   dismiss        cartStore.clearCart()
               │   (no change)   → Empty State shown
               │
               ▼
         [Cart Footer]
         Subtotal: $XX.XX
         [Place Order] ── enabled only if items > 0
                │
                └──▶ Flow-03 (Order Placement)
```

### Steps Detail

**Step 1 — Cart Drawer Open**
- Desktop (`md+`): slide-over panel, `fixed right-0 top-0 bottom-0 width: 400px`
- Mobile (`< md`): full-screen, `fixed inset-0`
- Backdrop: `bg-#0A0A0A/50`, clicks backdrop to close
- Visible "×" close button: top-right corner, 44×44px
- `role="dialog"`, `aria-modal="true"`, `aria-label="Your cart"`
- Focus moves to first interactive element on open
- `AnimatePresence` wraps drawer for exit animation

**Step 2 — Cart Header**
- "Your Cart" heading: Inter, 16px semibold, `#F5F0E8`
- Total item count: `(N items)`, Inter 13px, `#9A9080`
- [Clear Cart] button: positioned in header, NOT near "Place Order"
  - `variant="ghost"`, `text-#E57373`, `aria-label="Clear all items from cart"`

**Step 3 — Line Item Row**
```
┌────────────────────────────────────────────┐
│ Drink Name                      $X.XX  [×] │
│ Large · Oat · Iced · Vanilla Syrup          │
│           [−]  [2]  [+]                     │
└────────────────────────────────────────────┘
```
- Drink name: Inter, 14px semibold, `#F5F0E8`
- Customization summary: Inter, 13px, `#9A9080` (full text, no truncation)
- Unit price: Inter, 14px, `#C8922A`
- Remove "×": `aria-label="Remove [Drink Name] from cart"`, 44×44px
- Quantity stepper:
  - `aria-label="Increase quantity for [Drink Name]"` / `"Decrease quantity for [Drink Name]"`
  - [−] disabled at qty=1 (decrement removes item)
  - [+] disabled at qty=10

**Step 4 — Subtotal Footer**
- Divider: `border-top: 1px solid #2A2A2A`
- "Subtotal": Inter, 13px, `#9A9080`
- Amount: Inter, 20px semibold, `#F5F0E8`, formatted `$XX.XX`
- "Place Order" button: `variant="primary"`, full-width
  - Disabled (`aria-disabled="true"`, greyed) when cart empty
  - Enabled only when `items.length > 0`

**Step 5 — Empty Cart State**
```
┌────────────────────────────────────────────┐
│                                            │
│         [ShoppingCart icon, muted]         │
│                                            │
│           Your cart is empty               │  ← 16px, #9A9080
│                                            │
│           [Browse Menu]                    │  ← primary button
│                                            │
└────────────────────────────────────────────┘
```
- Cart badge: hidden (or shows 0, badge hidden) when empty
- "Browse Menu": closes drawer, navigates to `/`
- "Place Order" in footer: `aria-disabled="true"`, visually muted

**Step 6 — Clear Cart Confirmation**
- Confirmation uses inline prompt within drawer (not a full modal)
- Prompt appears below [Clear Cart] button
- "Remove all items from your cart?"
- [Cancel] `variant="ghost"` | [Clear All] `variant="danger"`
- [Cancel] dismisses prompt, no change
- [Clear All] calls `cartStore.clearCart()`, prompt closes, empty state shown

---
---

## Flow-03: Order Placement & Confirmation

**User Stories:** US-4.1, US-4.2, US-4.3, US-4.4
**Journeys:** JRN-01.1 (stage 5), JRN-02.1 (stages 4–5), JRN-03.2 (stage 5)
**Entry:** User clicks "Place Order" in cart drawer footer
**Exit:** "Start a New Order" → `/` (menu page, cart already cleared)

```
[User clicks "Place Order"]
         │
    Guard: cart non-empty?
    ├── NO  → button is disabled; no action
    └── YES → continue
         │
         ▼
[Button enters loading state]
  Text: "Placing order…"
  Spinner shown, button disabled
  Prevents double-submission
         │
         ▼
[POST /api/orders with OrderPayload]
         │
    ┌────┴────┐
  HTTP 201  Error (4xx/5xx/network)
    │              │
    ▼              ▼
[Success flow]  [Error state]
cartStore       Loading state cleared
.clearCart()    Button re-enabled
Cart drawer     Inline error message
closes          below "Place Order"
Router → /      "[Error message]"
confirmation    [Try Again] button
                Cart preserved intact
    │
    ▼
[Confirmation Screen renders]
Focus moves to main heading (autofocus)
role="status" live region announces success
    │
    ▼
User reads:
  ✓ Order Placed!
  BRW-NNNNN
  Ready in 15–20 minutes
  [Itemized summary]
  Subtotal: $XX.XX
    │
    ▼
User clicks [Start a New Order]
    │
    ▼
Navigate to / (menu page)
Cart already empty from step above
Menu loads from cache or re-fetches
```

### Steps Detail

**Step 1 — "Place Order" Button States**

| State | Appearance | Behavior |
|-------|-----------|----------|
| Disabled (empty cart) | `opacity-40`, muted, `aria-disabled="true"` | Click has no effect |
| Enabled | `bg-#C8922A text-#0A0A0A`, full-width | Click submits order |
| Loading | Spinner + "Placing order…", `disabled` | No further clicks accepted |
| Error recovery | Re-enabled, error message visible below | [Try Again] re-submits same payload |

**Step 2 — Error Messages**

| Scenario | Message |
|----------|---------|
| Network failure | "Could not reach the server. Check your connection and try again." |
| Server error (5xx) | "Something went wrong placing your order. Please try again." |
| Empty cart (defensive) | "Your cart is empty." |
| Invalid payload | "Invalid order data. Please refresh and try again." |

- Error displayed inline, below "Place Order" button
- `text-#E57373`, Inter, 13px
- [Try Again] button re-submits without requiring user changes
- Cart contents fully preserved on any error

**Step 3 — Confirmation Screen Layout**

```
┌─────────────────────────────────────────────┐
│           ✓  Order Placed!                  │ ← CheckCircle2 icon (#4CAF50)
│                                             │   Playfair Display, 40px
│         Your order reference:               │ ← Inter, 13px, #9A9080
│           BRW-00042                         │ ← Playfair Display, 28px, #C8922A
│                                             │
│    Ready in approximately 15–20 minutes     │ ← Inter, 14px, #9A9080
│─────────────────────────────────────────────│
│  Order Summary                              │ ← Inter, 16px semibold, #F5F0E8
│─────────────────────────────────────────────│
│  • Large Oat Latte × 2          $12.50      │
│    Large · Oat · Iced                       │
│                                             │
│  • Vanilla Cold Brew × 1        $5.75       │
│    Large · Iced · Vanilla Syrup             │
│─────────────────────────────────────────────│
│  Subtotal                       $18.25      │ ← 16px semibold
│                                             │
│       [ Start a New Order ]                 │ ← primary button, full-width on mobile
└─────────────────────────────────────────────┘
```

**Step 4 — Confirmation Screen Accessibility**
- Main heading receives `autofocus` on navigation (screen reader announces success)
- `role="status"` live region wraps confirmation message for screen reader announcement
- Success icon: `aria-hidden="true"` (decorative)
- "Start a New Order": `aria-label="Start a new order and return to menu"`

**Step 5 — Above-Fold Requirement (390px mobile)**
- Order reference number, estimated ready time, and success heading must be visible without scrolling at 390px viewport
- Font sizes calibrated: order reference at 28px Playfair Display is large enough to read at arm's length
- Itemized summary scrollable below the fold if many items; critical info (ref + ready time) always above

**Step 6 — "Start a New Order" Action**
- `variant="primary"`, full-width on mobile, auto-width centered on desktop
- Navigates to `/`
- Cart already cleared from successful submission (step above)
- Menu loads from Zustand cache if available; re-fetches if stale (skeleton shown briefly)

---
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
---

## Interaction Patterns

**User Stories:** US-0.3, US-0.4, US-6.1, US-6.2, US-6.3, US-6.4

---

### Pattern: Toast Notification

**When to use:** Confirmation that a cart action succeeded (item added, added with defaults)
**User Story:** US-6.3
**Journey:** JRN-02.1 (stage 3), JRN-03.2 (stage 4)

**Behavior:**
- Slides in from `bottom-right` on desktop; `bottom-center` on mobile
- Position: `fixed bottom-4 right-4` (desktop) | `fixed bottom-4 left-4 right-4` (mobile)
- Auto-dismisses after **3 seconds** with a `fadeOut` exit animation (150ms)
- Maximum **3 toasts visible simultaneously**; oldest removed when a 4th is added
- Toasts stack vertically with `8px` gap between them (newest on top)

**Visual spec:**
```
┌──────────────────────────────────────────┐
│  ✓  Iced Oat Latte added to cart         │
│     Inter 14px, #F5F0E8                  │
└──────────────────────────────────────────┘
bg: #1C1C1C, border: 1px solid #2A2A2A, radius: 12px
padding: 12px 16px
icon: Lucide CheckCircle, 16px, #4CAF50
text: "[Drink Name] added to cart"
```

**Animation (Framer Motion):**
- Enter: `y: 20px → 0, opacity: 0 → 1`, 200ms easeOut
- Exit: `opacity: 1 → 0`, 150ms ease
- Respects `useReducedMotion()` — appears/disappears instantly when reduced motion is on

---

### Pattern: Cart Badge Pop

**When to use:** Any time `cartStore.totalCount` changes (item added, removed, quantity changed)
**User Story:** US-6.3
**Journey:** JRN-03.2 (stage 4)

**Behavior:**
- Badge animates: `scale([1, 1.3, 1])` keyframe over **300ms**
- Applied via Framer Motion `animate` prop responding to `totalCount` change
- Badge hides completely when `totalCount === 0`
- Badge appears (fade in) when count goes from 0 → 1

**Visual spec:**
```
  [🛒]
   ●3   ← bg: #C8922A, text: #0A0A0A, radius: 20px
         Inter 11px semibold, min-width: 20px, height: 20px
         centered over icon, top-right offset
```

---

### Pattern: Skeleton Loading

**When to use:** While `GET /api/menu` is in-flight on page load
**User Story:** US-1.1, US-1.5

**Behavior:**
- Renders **8 skeleton cards** in the same grid layout as real cards (1/2/3/4 columns by breakpoint)
- No layout shift when real data arrives — grid slots identical
- Skeleton blocks use `bg: #1C1C1C` with a pulsing opacity animation (CSS `animate-pulse`)
- Replaced entirely by error state on failure — never shown alongside error message

**Per-skeleton structure:**
```
┌────────────────────────────────┐
│  ████████                      │  ← badge: 60px × 20px
│  ████████████████████          │  ← name: 80% width × 20px
│  █████████████████████████     │  ← desc line 1: 100% × 14px
│  ████████████████              │  ← desc line 2: 60% × 14px
│  ██████       ██████████       │  ← price + CTA: 60px + 100px
└────────────────────────────────┘
All blocks: bg-#1C1C1C, radius-6px, animate-pulse
```

---

### Pattern: Animated Card Filter (AnimatePresence)

**When to use:** Category filter changes or search query updates
**User Story:** US-1.2, US-6.1
**Journey:** JRN-03.1 (stage 3)

**Behavior:**
- Framer Motion `AnimatePresence mode="popLayout"` wraps the card grid
- Cards leaving the view: `opacity: 1 → 0, y: 0 → -8px`, 150ms ease
- Cards entering the view: stagger `fadeIn + slideUp`, 200ms per card, 50ms stagger
- For large grids (30+ cards), last card begins animation within 1.5s of first
- All using shared `cardVariants` and `staggerContainer` from `src/lib/motion.ts`
- Respects `useReducedMotion()` — no animation when reduced motion is on

---

### Pattern: Focus Management (Modal & Drawer)

**When to use:** Any time a modal or drawer opens or closes
**User Stories:** US-0.4, US-2.1, US-3.1

**Behavior — on open:**
- Focus moves to the first interactive element inside the overlay (modal close button or first form field)
- `Tab` key cycles through all interactive elements within the overlay only (focus trap)
- `Shift+Tab` cycles backwards

**Behavior — on close:**
- Focus returns to the element that triggered the overlay
  - Modal: returns to the "Customize" button that opened it
  - Cart drawer: returns to the cart icon in the navigation bar

**Implementation notes:**
- `Modal` primitive handles trap via `focus-trap-react` or equivalent
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` bound to modal title
- Escape key always closes: `onKeyDown` listener on the overlay container

---

### Pattern: Inline Error with Retry

**When to use:** API call fails (menu load, option load, order submission)
**User Stories:** US-1.5, US-4.3

**Behavior:**
- Replaces the loading state entirely (no skeleton shown alongside error)
- Shows human-readable message + Retry button
- Retry re-invokes the same fetch action, restoring loading state
- Cart contents always preserved on order submission error

**Visual spec:**
```
┌──────────────────────────────────────────────┐
│  ⚠  Could not load the menu.                 │
│     Please try again.                         │
│     Inter 14px, #E57373                       │
│                                               │
│     [ Retry ]  ← secondary button            │
└──────────────────────────────────────────────┘
```

Error messages by context:
| Context | Message |
|---------|---------|
| Menu load failure | "Could not load the menu. Please try again." |
| Option load failure | "Could not load customization options. Please try again." |
| Network failure (order) | "Could not reach the server. Check your connection and try again." |
| Server error (order) | "Something went wrong placing your order. Please try again." |

---

### Pattern: Quantity Stepper

**When to use:** In-modal quantity control (Flow-01) and in-cart quantity control (Flow-02)
**User Stories:** US-2.6, US-3.2

**Behavior:**
- `[−]  [N]  [+]` layout
- Range: **1–10**; default: 1
- Decrement at qty=1 in cart: **removes the item** (no confirmation)
- Decrement at qty=1 in modal: button is **disabled** (cannot go below 1 in modal)
- Increment at qty=10: button is disabled
- Both buttons: min `44×44px` tap target
- ARIA labels are contextual:
  - Modal: `aria-label="Decrease quantity"` / `aria-label="Increase quantity"`
  - Cart: `aria-label="Decrease quantity for [Drink Name]"` / `aria-label="Increase quantity for [Drink Name]"`

```
Each button: 44×44px, bg-#141414, border-1px-#2A2A2A, radius-6px
Disabled: opacity-40, cursor-not-allowed
Count: Inter 14px semibold, #F5F0E8, min-width: 24px, text-center
```

---

### Pattern: Confirmation Prompt (Inline)

**When to use:** "Clear Cart" action — destructive operation requiring confirmation
**User Story:** US-3.4

**Behavior:**
- Appears inline within the cart drawer (NOT as a separate modal)
- Displays below the "Clear Cart" button in the cart header area
- Two buttons: `[Cancel]` (ghost) and `[Clear All]` (danger)
- `[Cancel]` dismisses prompt with no change
- `[Clear All]` calls `cartStore.clearCart()` and shows empty state

```
┌────────────────────────────────────┐
│ Remove all items from your cart?   │
│                                    │
│   [Cancel]         [Clear All]     │
│   ghost, #9A9080   danger, #E57373 │
└────────────────────────────────────┘
```

---

### Pattern: Reduced Motion Guard

**When to use:** Applied globally to all animated components
**User Story:** US-6.4

**Behavior:**
- Every animated component calls `useReducedMotion()` from `framer-motion`
- When `true`: `initial={false}`, no exit animations — elements appear/disappear instantly
- CSS `prefers-reduced-motion: reduce` query also disables any CSS-only transitions
- Functional behavior unchanged — all interactivity works identically without motion
- Applies to: menu cards, modal, cart drawer, toast, cart badge, page transitions, button scale

---

### Pattern: Button Active Scale

**When to use:** All `Button` primitive renders
**User Story:** US-0.3, US-6.2

**Behavior:**
- `whileTap={{ scale: 0.97 }}` on all Button primitives via Framer Motion
- Duration: ~100ms, snappy feel
- Skipped when `useReducedMotion()` returns `true`

---

### Pattern: Empty State

**When to use:** No menu items match current filter/search; cart is empty
**User Stories:** US-1.4, US-3.5

| Context | Illustration | Message | Action |
|---------|-------------|---------|--------|
| Menu — filter/search empty | Coffee cup icon, muted | "No drinks match your search." | [Clear Filters] ghost button |
| Menu — API returns empty | Coffee cup icon, muted | "No drinks available yet." | *(none)* |
| Cart empty | Lucide `ShoppingCart` 48px, `#5A5248` | "Your cart is empty." | [Browse Menu] secondary button |

All empty states:
- Centered vertically in their container
- Icon: tertiary color `#5A5248`, 48px
- Message: Inter 16px, `#9A9080`
- Action button (where applicable): appropriate variant

---
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
