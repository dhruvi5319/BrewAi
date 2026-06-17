---
phase: 01-foundation
plan: "04"
subsystem: ui
tags: [react, typescript, tailwind, framer-motion, accessibility, design-system]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Tailwind design tokens (colors, border radii, fonts) from tailwind.config.ts
  - phase: 01-foundation
    provides: motion variants (modalVariants, backdropVariants, useReducedMotion) from src/lib/motion.ts
provides:
  - 7 design system primitive components: Button, Badge, Card, Input, Select, Modal, Spinner
  - Barrel export index.ts re-exporting all 7 components + 8 prop type interfaces
  - Accessible Modal with focus trap, Escape handler, AnimatePresence
  - Touch-target compliant interactive elements (min-h-[44px])
affects: [02-menu, 03-cart, 04-orders, 05-admin]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tailwind-only styling — no raw hex values in component files"
    - "focus-visible:ring-2 focus-visible:ring-accent on all interactive elements"
    - "min-h-[44px] on all interactive form elements for touch target compliance"
    - "Record<NonNullable<Props['variant']>, string> for variant class maps"
    - "AnimatePresence + motion variants for Modal enter/exit animations"
    - "useReducedMotion() disables whileTap and AnimatePresence animations"
    - "getFocusableElements() focus trap pattern for Modal"

key-files:
  created:
    - src/components/ui/Button.tsx
    - src/components/ui/Badge.tsx
    - src/components/ui/Card.tsx
    - src/components/ui/Spinner.tsx
    - src/components/ui/Input.tsx
    - src/components/ui/Select.tsx
    - src/components/ui/Modal.tsx
    - src/components/ui/index.ts
  modified: []

key-decisions:
  - "All interactive elements enforce min-h-[44px] for touch target compliance (44px WCAG guideline)"
  - "useReducedMotion() checked in Button (whileTap) and Modal (AnimatePresence) — animations disabled for users who prefer reduced motion"
  - "Card component supports both static and interactive (onClick) modes — interactive mode adds role=button, tabIndex, onKeyDown, and focus ring"
  - "Modal focus trap implemented with getFocusableElements() querying standard focusable selectors"
  - "Select uses appearance-none to allow custom styling while keeping native dropdown behavior"

patterns-established:
  - "UI primitive pattern: named export function + exported Props interface + Tailwind-only classes"
  - "Variant map pattern: Record<NonNullable<Props['variant']>, string> for type-safe class lookup"
  - "Interactive pattern: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 on all clickable/focusable elements"
  - "Barrel export pattern: src/components/ui/index.ts re-exports all components and their type interfaces"

# Metrics
duration: 2min
completed: 2026-06-15
---

# Phase 1 Plan 04: UI Primitive Components Summary

**7 design system primitives (Button, Badge, Card, Input, Select, Modal, Spinner) built with TypeScript strict mode, amber focus rings on all interactive elements, Framer Motion animations, and WCAG-compliant touch targets**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-15T20:32:28Z
- **Completed:** 2026-06-15T20:34:37Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Button primitive with 4 variants (primary/secondary/ghost/danger), 3 sizes all enforcing min-h-[44px], loading state with embedded Spinner, whileTap scale 0.97 animation (respects prefers-reduced-motion)
- Modal with full accessibility: role="dialog", aria-modal="true", aria-labelledby, Escape keydown handler, focus trap cycling Tab through interactive elements, AnimatePresence with backdropVariants/modalVariants
- All 7 primitives use only Tailwind utility classes — zero raw hex values in any component file
- Barrel index.ts exports 14 named items (7 components + 7 prop type interfaces)
- TypeScript strict mode passes with zero errors across all 8 files

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Button, Badge, Card, Spinner primitives** - `af52d5b` (feat)
2. **Task 2: Create Input, Select, Modal primitives and barrel export** - `82a56ca` (feat)

**Plan metadata:** (see below)

## Files Created/Modified
- `src/components/ui/Button.tsx` — Motion button with 4 variants, 3 sizes, loading/disabled states, whileTap scale, focus ring
- `src/components/ui/Badge.tsx` — Status/category badge with 4 color variants (accent/muted/success/error), rounded-pill
- `src/components/ui/Card.tsx` — Surface container; supports static and interactive (onClick) modes with focus ring and keyboard support
- `src/components/ui/Spinner.tsx` — Animated SVG spinner in 3 sizes, aria-hidden
- `src/components/ui/Input.tsx` — Controlled text input with label, error state, min-h-[44px], focus ring
- `src/components/ui/Select.tsx` — Native select with label, appearance-none, min-h-[44px], focus ring
- `src/components/ui/Modal.tsx` — Accessible dialog with focus trap, Escape handler, backdrop click, AnimatePresence, 3 size variants
- `src/components/ui/index.ts` — Barrel re-export of all 7 components + 7 prop type interfaces (14 exports)

## Decisions Made
- **min-h-[44px] on all sizes:** Button (sm/md/lg), Input, and Select all enforce the 44px minimum touch target height per WCAG 2.5.5 guidelines
- **useReducedMotion integration:** Both Button (whileTap) and Modal (AnimatePresence variants) check `useReducedMotion()` from src/lib/motion.ts and disable animations when preferred
- **Card dual-mode design:** Card supports both a static container mode and an interactive button mode — the interactive mode activates role="button", tabIndex, onKeyDown (Enter/Space), and focus-visible ring
- **Focus trap via DOM query:** Modal uses `getFocusableElements()` querying standard focusable selectors to implement Tab cycling, avoiding third-party focus-trap libraries

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 7 UI primitives are ready for import via `src/components/ui`
- TypeScript strict mode clean — all phases can import without type errors
- Modal, Button, Card, Badge, Spinner are all available for Phase 2 (Menu) feature development
- Focus ring pattern established — all future interactive components should follow the same `focus-visible:ring-2 focus-visible:ring-accent` convention

---
*Phase: 01-foundation*
*Completed: 2026-06-15*

## Self-Check: PASSED

All 8 files exist on disk. Both task commits (af52d5b, 82a56ca) verified in git log.
