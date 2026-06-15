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
