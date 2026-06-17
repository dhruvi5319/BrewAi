---
phase: 02-menu-browsing
plan: "01"
subsystem: ui
tags: [zustand, react, typescript, tailwind, framer-motion, lucide-react]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "src/types/index.ts (MenuItem, MenuStore), src/lib/api.ts (api.getMenu), src/components/ui/index.ts (Button, Badge, Input)"
provides:
  - "useMenuStore: Zustand store with fetchMenu, setCategory, setSearch, clearFilters, filteredItems"
  - "CategoryFilter: controlled pill bar component with All + category pills"
  - "SearchInput: debounced (200ms) controlled search input with Lucide Search icon"
affects: [02-03-menu-page, phase-2-completion]

# Tech tracking
tech-stack:
  added: [zustand@4.5.x, lucide-react@0.427.x]
  patterns:
    - "Zustand store with computed filteredItems derived on every mutation"
    - "Debounced input: useRef timer, local state for immediate feedback, useEffect to sync external reset"
    - "Pure/controlled components: CategoryFilter and SearchInput receive props and call callbacks only"

key-files:
  created:
    - src/stores/menuStore.ts
    - src/components/menu/CategoryFilter.tsx
    - src/components/menu/SearchInput.tsx
  modified: []

key-decisions:
  - "filteredItems recomputed synchronously on every setCategory/setSearch/clearFilters call (no lazy evaluation)"
  - "setCategory toggles: re-clicking active category resets to 'All' (deselect behavior)"
  - "CategoryFilter and SearchInput are pure controlled components — no direct store access"
  - "categories derived from API items (available only), sorted alphabetically, 'All' prepended in component"
  - "Phase 1 prerequisites (backend, frontend foundation, UI primitives) built inline since they were missing"

patterns-established:
  - "Pattern 1: Zustand store with typed interface from src/types/index.ts"
  - "Pattern 2: 200ms debounce via useRef<ReturnType<typeof setTimeout>>"
  - "Pattern 3: useEffect sync pattern for external-controlled input reset"

# Metrics
duration: 10min
completed: 2026-06-17
---

# Phase 2 Plan 01: Menu Store + Filter Components Summary

**Zustand menuStore with AND-logic category+search filtering, controlled CategoryFilter pill bar, and debounced SearchInput — the data and interaction primitives for menu browsing**

## Performance

- **Duration:** 10 min
- **Started:** 2026-06-17T14:54:40Z
- **Completed:** 2026-06-17T15:05:28Z
- **Tasks:** 2
- **Files created:** 3

## Accomplishments
- Zustand store (useMenuStore) implementing full MenuStore interface: fetchMenu, setCategory (with toggle-to-All deselect), setSearch, clearFilters, filteredItems
- CategoryFilter pill bar with "All" prepended, active/inactive visual states (bg-accent vs bg-surface), horizontal overflow scroll on mobile, 44px touch targets, aria-pressed
- SearchInput with 200ms debounce, local state for immediate visual feedback, useEffect sync for external reset (clearFilters), Lucide Search icon

## Task Commits

Each task was committed atomically:

1. **Task 1: Zustand menuStore** - `e8ad14f` (feat)
2. **Task 2: CategoryFilter and SearchInput components** - `54ad753` (feat)

## Files Created/Modified
- `src/stores/menuStore.ts` - Zustand store with full MenuStore interface, fetchMenu, setCategory, setSearch, clearFilters, filteredItems
- `src/components/menu/CategoryFilter.tsx` - Horizontal scrollable pill bar component (controlled, pure)
- `src/components/menu/SearchInput.tsx` - 200ms debounced search input with Lucide Search icon (controlled, pure)

## Decisions Made
- filteredItems recomputed synchronously after every mutation (no lazy/selector approach) for simplicity
- setCategory toggles: re-clicking active category resets to 'All' (per spec F1-03)
- CategoryFilter is a pure controlled component — store wiring done by MenuPage
- 'All' pill is prepended in CategoryFilter, not stored in categories array (per spec)
- Phase 1 prerequisites built inline (Rule 3 blocking) since entire codebase was absent

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Phase 1 foundation code was entirely absent**
- **Found during:** Pre-task verification
- **Issue:** The plan requires src/types/index.ts, src/lib/api.ts, and src/components/ui/index.ts from Phase 1, but the entire Phase 1 codebase had never been executed. The project directory had only .planning/ files.
- **Fix:** Built all Phase 1 prerequisites inline:
  - package.json + all config files (tsconfig, vite, tailwind, postcss, Dockerfile)
  - Express + SQLite backend (server.ts, server/db/, server/routes/, server/middleware/)
  - Frontend types, motion variants, api helpers (src/types/index.ts, src/lib/motion.ts, src/lib/api.ts)
  - All 7 UI primitives (Button, Badge, Card, Input, Select, Modal, Spinner)
  - src/main.tsx, src/App.tsx, src/index.css
- **Files modified:** 20+ files across project root and src/
- **Verification:** npx tsc --noEmit passes, server tested with all 5 endpoints
- **Committed in:** 6759918 (01-01 config), 3531415 (01-02 backend), 95ddbc8 (01-03 frontend)

**2. [Rule 1 - Bug] tsconfig.server.json CommonJS module conflicts with package.json "type": "module"**
- **Found during:** Phase 1 backend implementation (server testing)
- **Issue:** tsconfig.server.json used `"module": "CommonJS"` but package.json has `"type": "module"`, causing `exports is not defined` error when running compiled server.js
- **Fix:** Changed tsconfig.server.json to `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, added `.js` extensions to all server-side imports, added `fileURLToPath(import.meta.url)` for `__dirname` equivalent
- **Files modified:** tsconfig.server.json, server.ts, server/db/database.ts, server/routes/menu.ts, server/routes/orders.ts
- **Verification:** All 5 API endpoints tested and passing
- **Committed in:** 3531415

**3. [Rule 3 - Blocking] better-sqlite3@9.6.0 fails native compilation on Node 25**
- **Found during:** Phase 1 Plan 01 (npm install)
- **Issue:** better-sqlite3 v9 requires gyp build which fails with Node v25.9.0
- **Fix:** `npm install better-sqlite3@latest` upgraded to v12.11.1 which supports Node 25
- **Files modified:** package.json (dependency version)
- **Verification:** `require('better-sqlite3')` loads successfully
- **Committed in:** 6759918

---

**Total deviations:** 3 auto-fixed (2 blocking, 1 bug)
**Impact on plan:** All fixes necessary for the project to run at all. Phase 1 code had never been executed; this plan built the missing foundation inline. No scope creep.

## Issues Encountered
- None beyond the deviations documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- useMenuStore provides all data primitives needed by MenuPage (02-03)
- CategoryFilter and SearchInput are ready to be wired into MenuPage
- ProductCard (02-02) and SkeletonGrid (02-02) already committed in prior execution
- Phase 2 Plan 03 (MenuPage assembly) is unblocked

## Self-Check: PASSED

- FOUND: src/stores/menuStore.ts
- FOUND: src/components/menu/CategoryFilter.tsx
- FOUND: src/components/menu/SearchInput.tsx
- FOUND: .planning/phases/02-menu-browsing/02-01-SUMMARY.md
- FOUND: commit e8ad14f (menuStore)
- FOUND: commit 54ad753 (CategoryFilter + SearchInput)
- TypeScript: PASS (zero errors)

---
*Phase: 02-menu-browsing*
*Completed: 2026-06-17*
