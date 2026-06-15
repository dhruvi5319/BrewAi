---
phase: 01-foundation
plan: "02"
subsystem: api
tags: [express, sqlite, better-sqlite3, rest-api, typescript, nodejs]

# Dependency graph
requires:
  - phase: 01-foundation plan 01
    provides: package.json with better-sqlite3, express, cors; tsconfig.server.json
provides:
  - Express REST API server binding 0.0.0.0:3000
  - SQLite database layer with auto-init and 21-item seed
  - 5 API endpoints: GET /api/menu, GET /api/menu/categories, GET /api/menu/:id, POST /api/orders, GET /api/orders/:id
  - Typed JSON envelope responses { data, error, status }
  - server/types/api.ts shared TypeScript interfaces
affects:
  - phase-02-menu-browsing (depends on GET /api/menu)
  - phase-03-customization (depends on POST /api/orders)
  - all frontend phases (shared ApiResponse type contract)

# Tech tracking
tech-stack:
  added: [better-sqlite3 singleton with WAL mode, Express Router with cors() middleware]
  patterns:
    - "JSON envelope: all responses use { data: T | null, error: ApiError | null, status: number }"
    - "ESM imports: NodeNext module resolution with .js extensions on relative imports"
    - "DB singleton: exported db instance + initDatabase() called before app.listen()"
    - "Idempotent seed: seedMenu() checks COUNT(*) before inserting"
    - "Atomic order creation: db.transaction() for multi-table insert"

key-files:
  created:
    - server.ts
    - server/db/database.ts
    - server/db/schema.ts
    - server/db/seed.ts
    - server/routes/menu.ts
    - server/routes/orders.ts
    - server/middleware/errorHandler.ts
    - server/types/api.ts
  modified:
    - tsconfig.server.json (CommonJS → NodeNext/ESM)
    - .gitignore (added server/**/*.js)

key-decisions:
  - "tsconfig.server.json changed to NodeNext/ESM because package.json has type:module — CommonJS output caused ReferenceError at runtime"
  - "BRW-NNNNN order reference uses padStart(5,'0') with no truncation for orderId > 99999"
  - "GET /api/menu/categories registered before GET /api/menu/:id to prevent 'categories' being treated as an :id param"
  - "No helmet() — no X-Frame-Options or frame-ancestors headers to allow iframe embedding"

patterns-established:
  - "API envelope: { data, error, status } on every response"
  - "Error codes: ITEM_NOT_FOUND, ORDER_NOT_FOUND, INVALID_ID, EMPTY_ORDER, INVALID_PAYLOAD, DB_READ_ERROR, DB_WRITE_ERROR, INTERNAL_ERROR"
  - "snake_case DB columns mapped to camelCase in API layer (base_price → basePrice)"

# Metrics
duration: 4min
completed: 2026-06-15
---

# Phase 1 Plan 02: Express + SQLite Backend Summary

**Express server with SQLite auto-init, 21-item seed across 5 categories, and 5 REST endpoints serving typed { data, error, status } JSON envelopes on 0.0.0.0:3000**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-15T20:22:37Z
- **Completed:** 2026-06-15T20:27:07Z
- **Tasks:** 3
- **Files modified:** 10 (8 created, 2 modified)

## Accomplishments

- SQLite database layer with WAL mode, auto-init on cold start, and idempotent 21-item seed
- 5 REST API endpoints with full validation, typed responses, and atomic order transactions
- Express server bound to 0.0.0.0:3000 with no X-Frame-Options headers (iframe-safe)
- All responses use typed `{ data, error, status }` JSON envelope contract

## Task Commits

Each task was committed atomically:

1. **Task 1: Database layer (types, schema, seed)** - `86fe1a5` (feat)
2. **Task 2: Express server and route handlers** - `1e217c9` (feat)
3. **Task 3: ESM fix (blocking issue)** - `1eae2c1` (fix)
4. **Task 3: Integration smoke test + gitignore** - `b113797` (chore)

**Plan metadata:** pending (docs commit)

## Files Created/Modified

- `server.ts` - Express entry point; cors → json → /api/menu → /api/orders → static → SPA → errorHandler; binds 0.0.0.0:3000
- `server/db/database.ts` - better-sqlite3 singleton with WAL mode and foreign_keys; exports db + initDatabase()
- `server/db/schema.ts` - CREATE TABLE IF NOT EXISTS DDL for menu_items, orders, order_items with indexes
- `server/db/seed.ts` - 21 seed items: 6 Espresso, 4 Cold Brew, 4 Pour-Over, 4 Tea, 3 Seasonal
- `server/routes/menu.ts` - GET /api/menu, GET /api/menu/categories (before :id), GET /api/menu/:id
- `server/routes/orders.ts` - POST /api/orders with validation + db.transaction(); GET /api/orders/:id
- `server/middleware/errorHandler.ts` - Global Express error handler returning JSON envelope
- `server/types/api.ts` - ApiResponse, ApiError, MenuItem, OrderPayload, OrderResponse interfaces
- `tsconfig.server.json` - Updated CommonJS → NodeNext/ESM (deviation fix)
- `.gitignore` - Added server/**/*.js to ignore compiled output

## Decisions Made

- **NodeNext ESM over CommonJS**: tsconfig.server.json originally used CommonJS, but `package.json` has `"type": "module"`. At runtime Node.js treated the compiled `.js` output as ESM, causing `exports is not defined`. Fixed by switching to `NodeNext` module system with `.js` extensions on imports.
- **No helmet()**: Plan explicitly prohibits X-Frame-Options and frame-ancestors headers for iframe embedding compatibility.
- **Categories before :id route**: Express Router requires `/categories` to be registered before `/:id` to prevent "categories" being matched as an ID parameter.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed CommonJS vs ESM module conflict**
- **Found during:** Task 3 (integration smoke test)
- **Issue:** `tsconfig.server.json` compiled with `module: CommonJS`, generating `exports.xxx = ...` syntax. But `package.json` has `"type": "module"`, causing Node.js to treat all `.js` files as ESM, resulting in `ReferenceError: exports is not defined in ES module scope`
- **Fix:** Changed tsconfig.server.json to `module: "NodeNext"`, `moduleResolution: "NodeNext"`, `target: "ES2022"`. Added `.js` extensions to all relative imports in server files. Added `fileURLToPath` for ESM-compatible `__dirname`.
- **Files modified:** `tsconfig.server.json`, `server.ts`, `server/db/database.ts`, `server/routes/menu.ts`, `server/routes/orders.ts`
- **Verification:** `node server.js` starts successfully; all 5 endpoint tests pass
- **Committed in:** `1eae2c1` (fix commit between Task 2 and Task 3 completion)

---

**Total deviations:** 1 auto-fixed (Rule 3 - Blocking)
**Impact on plan:** Essential fix — without it the server could not start. No scope creep. The tsconfig change is consistent with the project's ESM-first setup.

## Issues Encountered

None beyond the ESM fix documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Backend API is production-complete with all 5 endpoints
- SQLite auto-initializes on first boot; idempotent seed prevents duplicates
- `GET /api/menu` returns 21 items with parsed options objects — ready for Phase 2 (Menu Browsing)
- `POST /api/orders` persists atomically — ready for Phase 3+ (Order Placement)
- Type contracts in `server/types/api.ts` exportable for frontend type sharing

---
*Phase: 01-foundation*
*Completed: 2026-06-15*

## Self-Check

### Files Exist
- [x] `server.ts` ✓
- [x] `server/db/database.ts` ✓
- [x] `server/db/schema.ts` ✓
- [x] `server/db/seed.ts` ✓
- [x] `server/routes/menu.ts` ✓
- [x] `server/routes/orders.ts` ✓
- [x] `server/middleware/errorHandler.ts` ✓
- [x] `server/types/api.ts` ✓

### Commits Exist
- [x] `86fe1a5` - feat(01-02): database layer ✓
- [x] `1e217c9` - feat(01-02): Express server ✓
- [x] `1eae2c1` - fix(01-02): ESM module fix ✓
- [x] `b113797` - chore(01-02): integration smoke test ✓

## Self-Check: PASSED
