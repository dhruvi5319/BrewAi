---

## F06: Animated Interactions & Micro-Animations

**Priority:** P1  
**Depends on:** F00 (Design System — provides motion variant definitions)  
**Required by:** F01, F02, F03, F04, F05 (all features consume animations)

---

### Description

All meaningful UI state changes are animated using Framer Motion, creating a polished, premium feel consistent with the BrewAI brand. Animations are purposeful, fast (150–200ms), and provide visual feedback without adding perceived latency. All animations unconditionally respect the `prefers-reduced-motion` OS/browser setting — when reduced motion is preferred, all animations are disabled and elements appear instantly. Shared `variants` objects are defined once in `src/lib/motion.ts` and imported by all feature components.

---

### Terminology

- **Motion Variant:** A Framer Motion `variants` object with named states (`initial`, `animate`, `exit`). Defined in `src/lib/motion.ts`.
- **Stagger:** A parent Framer Motion container that introduces a sequential delay (`staggerChildren`) between child element animations, creating a cascading entrance effect.
- **prefers-reduced-motion:** A CSS media query (`@media (prefers-reduced-motion: reduce)`) and corresponding Framer Motion hook (`useReducedMotion()`) that signals the user prefers less animation.
- **Transition:** The Framer Motion `transition` object specifying `duration`, `ease`, and `delay` for a given animation.
- **Toast:** A transient notification that slides into view from the bottom-right corner and auto-dismisses after 3 seconds.

---

### Sub-Features

- **F06.1 — Shared Motion Variants File:** `src/lib/motion.ts` exports all named variants.
- **F06.2 — Reduced Motion Guard:** All `motion.*` components check `useReducedMotion()` and set `initial={false}` / no exit animations when true.
- **F06.3 — Menu Card Entrance:** Stagger fade-in + slide-up for the product card grid on initial load.
- **F06.4 — Customization Modal Animation:** Scale-in + fade-in on open; reverse on close.
- **F06.5 — Cart Drawer Animation:** Slide from right (desktop) or slide up (mobile) on open; reverse on close.
- **F06.6 — Cart Badge Pop:** Scale pulse animation when `totalCount` changes.
- **F06.7 — Button Press Feedback:** Active scale-down on button press.
- **F06.8 — Page Transitions:** Fade between route changes.
- **F06.9 — Toast Notification:** Slide-in from bottom-right on "Item added to cart"; auto-dismiss fade-out.
- **F06.10 — Cart Item Removal:** Fade-out + slide-left when an item is removed from the cart list.

---

### Shared Motion Variants (`src/lib/motion.ts`)

```typescript
import { Variants } from 'framer-motion';

// Card fade-in + slide-up (used by menu grid children)
export const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

// Stagger container (used as parent of menu card grid)
export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.05 } },
};

// Modal scale-in + fade (used by customization modal)
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1,   transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

// Modal backdrop fade
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

// Cart drawer slide-in from right (desktop)
export const drawerRightVariants: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { x: '100%', transition: { duration: 0.15 } },
};

// Cart drawer slide-up from bottom (mobile)
export const drawerUpVariants: Variants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { y: '100%', transition: { duration: 0.15 } },
};

// Toast slide-in from bottom-right
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 40, x: 0 },
  animate: { opacity: 1, y: 0,  x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: 20,        transition: { duration: 0.15 } },
};

// Cart item removal (fade-out + slide-left)
export const cartItemExitVariants: Variants = {
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

// Page transition (fade)
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};
```

---

### Process

**Reduced Motion Guard:**
1. Each animated component imports `useReducedMotion` from `framer-motion`.
2. If `useReducedMotion()` returns `true`, the component renders with `initial={false}` and omits `exit` variants.
3. Elements appear and disappear instantly with no animation.

**Menu Card Entrance:**
1. `motion.div` with `staggerContainer` wraps the card grid; `initial="initial" animate="animate"`.
2. Each product card is a `motion.div` with `cardVariants`.
3. On filter change or search change, `AnimatePresence` with `mode="popLayout"` handles card reordering/removal.
4. Cards added to the grid animate in; removed cards animate out via `exit`.

**Customization Modal Animation:**
1. `AnimatePresence` wraps the modal; `isOpen` controls presence.
2. Backdrop uses `backdropVariants`; modal content uses `modalVariants`.
3. On Escape or close, `isOpen` → `false`; `AnimatePresence` runs exit animations before unmounting.

**Cart Drawer Animation:**
1. Viewport width determines which variant is used (see F05 §Cart Drawer Adaptation).
2. Below `md`: `drawerUpVariants`; at `md+`: `drawerRightVariants`.
3. `AnimatePresence` wraps the drawer; `cartStore.isOpen` controls presence.

**Cart Badge Pop:**
1. `totalCount` change is detected via `useEffect` watching `cartStore.totalCount`.
2. On change, a brief `scale` keyframe animation fires on the badge element: `[1, 1.3, 1]` over 300ms.
3. Implemented via Framer Motion `animate` prop with keyframe array, or via CSS `@keyframes` triggered by class toggle.

**Button Press Feedback:**
1. All `Button` primitives (F00) use `whileTap={{ scale: 0.97 }}` on the `motion.button` wrapper.
2. Duration: `100ms` (snappier than standard transitions for tactile feel).

**Toast Notification:**
1. A `ToastProvider` component at the root level maintains a list of active toasts (max 3 visible simultaneously).
2. `addToast(message, type)` is called by feature components (e.g., after `cartStore.addItem`).
3. Each toast animates in via `toastVariants`.
4. After 3 seconds, the toast automatically calls its removal function → exit animation plays → unmounts.
5. Toasts stack vertically in the bottom-right corner (`fixed bottom-4 right-4 flex flex-col gap-2`).

**Page Transitions:**
1. React Router `<Routes>` is wrapped with `AnimatePresence mode="wait"`.
2. Each route's top-level component is wrapped in `motion.div` with `pageVariants`.
3. `mode="wait"` ensures the exiting page fully fades out before the entering page fades in.

---

### Inputs

- `useReducedMotion()` — boolean from browser preference
- Component mount/unmount lifecycle — triggers `AnimatePresence`
- `cartStore.totalCount` — triggers badge pop
- `addToast(message, type)` call — triggers toast

---

### Outputs

- Animated entrance/exit of menu cards, modals, drawers, toasts, cart items
- Badge pop on count change
- Page fade transitions
- Instant appearance/disappearance when `prefers-reduced-motion` is set

---

### Animation Timing Reference

| Animation | Duration | Easing | Variant Name |
|-----------|----------|--------|--------------|
| Card entrance | 200ms | easeOut | `cardVariants` |
| Stagger delay between cards | 50ms | — | `staggerContainer` |
| Modal open | 200ms | easeOut | `modalVariants` |
| Modal close | 150ms | default | `modalVariants.exit` |
| Backdrop fade | 150ms | default | `backdropVariants` |
| Cart drawer open | 200ms | easeOut | `drawerRightVariants` / `drawerUpVariants` |
| Cart drawer close | 150ms | default | exit state |
| Toast slide-in | 200ms | easeOut | `toastVariants` |
| Toast fade-out | 150ms | default | `toastVariants.exit` |
| Cart item removal | 150ms | default | `cartItemExitVariants` |
| Page fade | 200ms | default | `pageVariants` |
| Badge pop | 300ms | spring | keyframe `[1, 1.3, 1]` |
| Button press | 100ms | default | `whileTap` |

---

### Validation

- `useReducedMotion()` is checked in every animated component — no animation plays when it returns `true`.
- All durations are in the range 100ms–300ms; no animation exceeds 300ms.
- `AnimatePresence` is used anywhere elements conditionally mount/unmount to ensure exit animations play.
- The stagger delay (`staggerChildren: 0.05`) is capped so that for grids with 30+ cards, the last card starts animating within 1.5 seconds of the first.
- Toast max-visible count is 3; older toasts are removed when a 4th is added.
- Button `whileTap` scale never goes below 0.95.

---

### Error States

| Scenario | Behavior |
|----------|----------|
| `framer-motion` not installed or import error | React render error; app fails to render — this is a build-time error caught by TypeScript |
| `useReducedMotion()` unavailable (SSR context) | Default to no animation (safe fallback) |
| Animation variant key not found | Framer Motion silently ignores missing variants; element renders unanimated |

---

### API Surface (this feature)

None.

---

### Schema Surface (this feature)

None.

---
