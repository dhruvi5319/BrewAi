---
phase: 05-polish
plan: "03"
subsystem: ui
tags: [framer-motion, animations, stagger, playwright, e2e, responsive, reduced-motion]

# Dependency graph
requires:
  - phase: 05-polish
    provides: "05-01: responsive Navigation + menu grid; 05-02: CartDrawer/Modal/Badge animations"
  - phase: 05-polish
    provides: "src/lib/motion.ts with staggerContainer, cardVariants, pageVariants, useReducedMotion"

provides:
  - ProductCard wrapped in motion.div with cardVariants (stagger child variant, no own initial/animate)
  - MenuPage grid wrapped in motion.div with staggerContainer + AnimatePresence mode="popLayout"
  - key={activeCategory+searchQuery} on stagger container triggers re-animation on filter change
  - Playwright e2e test suite at e2e/polish.spec.ts covering 390/768/1280px viewports and reduced-motion
  - CategoryFilter pills verified with transition-colors duration-150 ease-in-out (F6-02)
  - App.tsx AnimatePresence + pageVariants verified for route transitions (F6-07)
  - useReducedMotion() guards across 16+ components disabling all animations globally (F6-08)

affects:
  - verify-phase (e2e/polish.spec.ts runs in verifier)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "staggerContainer parent + cardVariants child pattern: parent manages initial/animate, children inherit via variants prop"
    - "key={activeCategory+searchQuery} on AnimatePresence child forces grid remount on filter change, triggering re-stagger"
    - "AnimatePresence mode='popLayout' at grid level for smooth reflow during card enter/exit"
    - "useReducedMotion() returns true → variants={} + initial={false}: fully disables Framer Motion without conditional rendering"

key-files:
  created:
    - e2e/polish.spec.ts
  modified:
    - src/components/menu/ProductCard.tsx
    - src/pages/MenuPage.tsx

key-decisions:
  - "Animation code (ProductCard motion.div, MenuPage staggerContainer, AnimatePresence) was already committed in earlier plans — Task 1 verified all contracts and wrote the e2e deliverable"
  - "E2E Playwright tests written as deliverables; execution deferred to verify phase per test execution boundary"
  - "cardVariants on ProductCard has no initial/animate — inherited from staggerContainer parent for correct stagger timing"
  - "AnimatePresence mode='popLayout' at grid level (not card level) for smooth filter-change reflow"

patterns-established:
  - "Pattern: stagger parent variant propagation — child motion.div uses variants only, parent owns initial/animate"
  - "Pattern: key-based remount for re-stagger on data change — key={filter+query} on the stagger container"

# Metrics
duration: 6min
completed: 2026-07-01
---

# Phase 5 Plan 03: Menu Card Stagger + E2E Tests Summary

**Menu card stagger animation (staggerContainer + cardVariants + AnimatePresence popLayout) verified in MenuPage and ProductCard, plus Playwright e2e tests at 390/768/1280px viewports and reduced-motion coverage**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-01T13:35:12Z
- **Completed:** 2026-07-01T13:41:29Z
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 1 created (e2e/polish.spec.ts); 2 verified-in-place (ProductCard.tsx, MenuPage.tsx)

## Accomplishments

- Verified all stagger animation contracts: `ProductCard` wrapped in `motion.div` with `cardVariants` (no own `initial/animate` — inherited from parent), `MenuPage` grid wrapped in `motion.div` with `staggerContainer`, `AnimatePresence mode="popLayout"` at grid level, `key={activeCategory + searchQuery}` triggers re-stagger on filter change
- Verified `CategoryFilter` pills have `transition-colors duration-150 ease-in-out` (F6-02, CSS-only)
- Verified `App.tsx` has `AnimatePresence + pageVariants` for route transitions (F6-07)
- Verified `useReducedMotion()` guards in 16 components/pages (F6-08 satisfied globally)
- Written `e2e/polish.spec.ts`: 11 Playwright tests covering 390px single-col + no-scroll + compact nav, 768px 2-col grid + desktop nav, 1280px 3-col grid + no-scroll + desktop nav, reduced-motion disables animations, stagger completes after load and filter change, 44px touch targets
- Human visual verification passed: all 8 viewport/animation behaviors approved

## Task Commits

Each task was committed atomically:

1. **Task 1: Stagger animation verified + e2e/polish.spec.ts written** - `038cef6` (feat)
2. **Task 2: Human-verify checkpoint** - approved (no code commit — visual verification only)

**Plan metadata:** (docs commit below)

_Note: Animation code (ProductCard motion.div, MenuPage staggerContainer/AnimatePresence) was already committed by prior plans in this phase. Task 1 verified all contracts and delivered the e2e test artifact._

## Files Created/Modified

- `e2e/polish.spec.ts` — 11 Playwright e2e tests: viewport responsive layout (390/768/1280px), reduced-motion guard, stagger animation, touch targets
- `src/components/menu/ProductCard.tsx` — Already had `motion.div` with `cardVariants` + `useReducedMotion()` (verified in Task 1)
- `src/pages/MenuPage.tsx` — Already had `staggerContainer`, `AnimatePresence mode="popLayout"`, `key={activeCategory+searchQuery}`, `useReducedMotion()` (verified in Task 1)

## Decisions Made

- **Animation code was already in place:** Both `ProductCard.tsx` and `MenuPage.tsx` had the stagger animation implementation committed by prior plans. Task 1 ran all verification checks to confirm contracts, then focused on the e2e test deliverable.
- **E2E tests written, not run:** Per the test execution boundary, Playwright tests are the verifier's responsibility. Tests written as deliverables; execution deferred to verify phase.
- **cardVariants without own initial/animate:** ProductCard's `motion.div` uses `variants` only — `initial`/`animate` are inherited from the `staggerContainer` parent. This is the correct Framer Motion stagger pattern.

## Deviations from Plan

None — plan executed exactly as written. Animation code was already present from prior plans; Task 1 verified all contracts and added the e2e artifact. Human visual verification passed in Task 2.

## Issues Encountered

None — all TypeScript checks passed cleanly, all verification checks confirmed contracts in place, human visual verification approved.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 5 (polish) is **complete** — all 3 plans executed and verified
- All must_haves satisfied:
  - ✅ Menu cards stagger-animate in on initial load (staggerContainer + cardVariants)
  - ✅ AnimatePresence mode='popLayout' handles card enter/exit on filter change
  - ✅ CategoryFilter pills have 150ms CSS transition (transition-colors duration-150 ease-in-out)
  - ✅ App page transitions use AnimatePresence + pageVariants
  - ✅ prefers-reduced-motion disables ALL Framer Motion animations globally (16 components)
  - ✅ Playwright tests written at 390/768/1280px viewports and reduced-motion
  - ✅ Human visual verification approved
- Ready for: verify phase (`/pivota_spec-verify-work 05`) or Phase 6 planning

---
*Phase: 05-polish*
*Completed: 2026-07-01*
