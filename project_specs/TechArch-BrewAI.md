# Technical Architecture Document
# BrewAI — Specialty Coffee Shop Web Application

**Version:** 1.0
**Date:** 2026-06-15
**Project Acronym:** BrewAI
**Status:** Active
**Generated from:** PRD-BrewAI.md v1.0 + FRD-BrewAI.md v1.0

---

## 1. Architectural Overview

### 1.1 Architecture Pattern

BrewAI is a **Single-Page Application (SPA) with an embedded REST API backend**. The frontend is a React 18 + TypeScript application built by Vite and served as a static bundle directly from the same Express server that provides the API. There is no separate frontend deployment target — in production, a single Node.js process on port 3000 handles everything.

This monolithic-server SPA pattern was chosen because:
- The sandbox requires a single port (`0.0.0.0:3000`) and no external infrastructure.
- SQLite via `better-sqlite3` eliminates any database server dependency.
- The guest-only scope (no auth, no realtime) does not require a decoupled service architecture.
- Cold-start simplicity: `npm install && npm run build && node server.js` — no orchestration.

### 1.2 Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│  Browser (Chrome 120+ / Firefox 120+ / Safari 17+ / Edge 120+)    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  React 18 SPA (TypeScript + Vite bundle)                     │  │
│  │                                                              │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────────────┐  │  │
│  │  │  Zustand   │  │  React      │  │  Framer Motion       │  │  │
│  │  │  cartStore │  │  Router v6  │  │  Animation Layer     │  │  │
│  │  │  menuStore │  │             │  │                      │  │  │
│  │  └────────────┘  └─────────────┘  └──────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐   │  │
│  │  │  Pages   │  │  UI          │  │  Lib                │   │  │
│  │  │  /menu   │  │  Components  │  │  motion.ts          │   │  │
│  │  │  /confirm│  │  (Primitives)│  │  api.ts (fetch)     │   │  │
│  │  └──────────┘  └──────────────┘  └─────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                         │ HTTP /api/*                              │
└─────────────────────────┼──────────────────────────────────────────┘
                          │
                          ▼ port 3000 (0.0.0.0)
┌────────────────────────────────────────────────────────────────────┐
│  Node.js 20 + Express 4 (server.ts → compiled to server.js)       │
│                                                                    │
│  Middleware Chain:                                                 │
│  cors() → express.json() → routes → static(dist/) → errorHandler  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Route Handlers                                            │   │
│  │  GET  /api/menu             → menuRouter.getAll()          │   │
│  │  GET  /api/menu/categories  → menuRouter.getCategories()   │   │
│  │  GET  /api/menu/:id         → menuRouter.getById()         │   │
│  │  POST /api/orders           → orderRouter.create()         │   │
│  │  GET  /api/orders/:id       → orderRouter.getById()        │   │
│  │  GET  /*                    → dist/index.html (SPA)        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                         │                                         │
│                         ▼                                         │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Database Layer (better-sqlite3 — synchronous)             │   │
│  │                                                            │   │
│  │  initDatabase()  →  CREATE TABLE IF NOT EXISTS             │   │
│  │                  →  seedMenu() (if menu_items count = 0)   │   │
│  │                                                            │   │
│  │  Tables: menu_items · orders · order_items                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                         │                                         │
│                         ▼                                         │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  SQLite file: ./data/brewai.db                             │   │
│  │  WAL mode · Foreign keys ON                                │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

### 1.3 Deployment Topology

```
┌─────────────────────────────────────────────────────────┐
│  Docker Container (node:20-bookworm-slim)                │
│                                                         │
│  /app/                                                  │
│  ├── dist/              ← Vite production build         │
│  │   ├── index.html                                     │
│  │   └── assets/        ← JS, CSS, fonts (woff2)        │
│  ├── data/              ← SQLite database dir           │
│  │   └── brewai.db                                      │
│  ├── server.js          ← Compiled Express server       │
│  └── package.json                                       │
│                                                         │
│  EXPOSE 3000                                            │
│  CMD ["node", "server.js"]                              │
│                                                         │
│  0.0.0.0:3000 ──────────────────────────► preview URL  │
└─────────────────────────────────────────────────────────┘
```

**Start sequence (cold start, zero manual steps):**
1. `npm ci` — install all dependencies (npm registry only)
2. `npm run build` — Vite compiles frontend to `dist/`; TypeScript compiles server to `dist-server/` or root
3. `node server.js` — Express starts; `initDatabase()` runs synchronously; schema created + seed inserted if needed; server binds `0.0.0.0:3000`

### 1.4 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Deployment model | Monolith (SPA + API in one Express process) | Single port requirement; no infra complexity |
| Database | SQLite via better-sqlite3 (synchronous) | Zero external infra; embedded; sufficient throughput for coffee shop scale |
| State management | Zustand | Lightweight; cart and menu state are simple; avoids Redux boilerplate |
| Build tool | Vite 5 | Fastest dev iteration; native ESM; clean SPA output |
| Font delivery | `@fontsource/*` npm packages | Bundled into `dist/assets/` by Vite; no CDN fetch at runtime |
| Container base | `node:20-bookworm-slim` (Debian 12) | Only Debian/Ubuntu base images on sandbox allowlist; never Alpine |
| Auth | None (v1) | Guest-only ordering; removes auth surface entirely |
| Payments | None (v1) | UI-complete only; reduces scope and compliance burden |

---
---

## 2. Component Architecture

### 2.1 Backend Components

```
server/
├── server.ts              ← Express app entry point; binds 0.0.0.0:3000
├── db/
│   ├── database.ts        ← better-sqlite3 connection singleton; initDatabase()
│   ├── schema.ts          ← CREATE TABLE IF NOT EXISTS DDL strings
│   └── seed.ts            ← seedMenu() — inserts 20–30 items if table is empty
├── routes/
│   ├── menu.ts            ← GET /api/menu, GET /api/menu/categories, GET /api/menu/:id
│   └── orders.ts          ← POST /api/orders, GET /api/orders/:id
├── middleware/
│   └── errorHandler.ts    ← Global Express error middleware; returns JSON envelope
└── types/
    └── api.ts             ← Shared server-side TypeScript interfaces
```

**`server.ts` responsibilities:**
- Instantiate Express app
- Apply middleware chain: `cors()` → `express.json()` → API routers → `express.static('dist')` → SPA fallback → `errorHandler`
- Call `initDatabase()` synchronously before `app.listen()`
- Bind to `process.env.PORT` (default `3000`) on `process.env.HOST` (default `0.0.0.0`)
- Log: `BrewAI server running on http://0.0.0.0:3000`

**`db/database.ts` responsibilities:**
- Open SQLite connection at `DB_PATH` (default `./data/brewai.db`)
- Set `PRAGMA journal_mode = WAL` and `PRAGMA foreign_keys = ON`
- Export the `Database` instance as a singleton
- Export `initDatabase()` — runs schema + seed on first boot

**`routes/menu.ts` responsibilities:**
- `GET /api/menu` — query all `available = 1` items; parse `options_json`; map snake_case → camelCase; return envelope
- `GET /api/menu/categories` — distinct categories from available items
- `GET /api/menu/:id` — validate ID; query single item; 404 if not found; parse options

**`routes/orders.ts` responsibilities:**
- `POST /api/orders` — validate payload; open transaction; insert `orders` row; insert `order_items` rows; commit; build `orderReference`; return 201
- `GET /api/orders/:id` — validate ID; join `orders` + `order_items`; parse `customizations_json`; return assembled order

**`middleware/errorHandler.ts` responsibilities:**
- Catch any unhandled Express error
- Log full stack trace to `console.error`
- Return `{ data: null, error: { code: 'INTERNAL_ERROR', message }, status: 500 }`

---

### 2.2 Frontend Component Architecture

```
src/
├── main.tsx               ← React root; BrowserRouter; ToastProvider; font imports
├── index.css              ← @font-face declarations; Tailwind base/components/utilities
├── App.tsx                ← Route definitions; AnimatePresence for page transitions
│
├── pages/
│   ├── MenuPage.tsx       ← F01: Menu grid, category filter, search
│   └── ConfirmationPage.tsx ← F04: Order confirmation display
│
├── components/
│   ├── ui/                ← F00: Design system primitives
│   │   ├── index.ts       ← Re-export barrel
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   └── Spinner.tsx
│   │
│   ├── layout/
│   │   ├── Navigation.tsx ← F05: Responsive top bar + compact header
│   │   └── Layout.tsx     ← Page wrapper with Navigation + ToastStack
│   │
│   ├── menu/
│   │   ├── ProductCard.tsx      ← F01: Single menu item card
│   │   ├── CategoryFilter.tsx   ← F01: Pill filter bar
│   │   ├── SearchInput.tsx      ← F01: Debounced search
│   │   └── SkeletonGrid.tsx     ← F01: Loading skeleton cards
│   │
│   ├── customization/
│   │   └── CustomizationModal.tsx ← F02: Full customization modal
│   │
│   ├── cart/
│   │   ├── CartDrawer.tsx       ← F03: Slide-in cart panel
│   │   ├── CartItem.tsx         ← F03: Single cart line item
│   │   └── CartBadge.tsx        ← F03: Animated item count badge
│   │
│   └── toast/
│       ├── ToastProvider.tsx    ← F06: Toast context + stack manager
│       └── Toast.tsx            ← F06: Individual toast notification
│
├── stores/
│   ├── menuStore.ts       ← Zustand: menu items, categories, filter, search state
│   └── cartStore.ts       ← Zustand: cart items, subtotal, drawer open state
│
├── lib/
│   ├── motion.ts          ← F06: All shared Framer Motion variants
│   └── api.ts             ← Typed fetch helpers for all API endpoints
│
└── types/
    └── index.ts           ← Shared TypeScript interfaces (MenuItem, CartItem, etc.)
```

### 2.3 Component Responsibilities

| Component | Feature | Key Responsibility |
|-----------|---------|-------------------|
| `MenuPage` | F01 | Orchestrates menu fetch, filter, search; renders `CategoryFilter` + `ProductCard` grid |
| `ProductCard` | F01 | Displays drink card; fires "Customize" or "Add to Cart"; wrapped in `motion.div` with `cardVariants` |
| `CategoryFilter` | F01 | Renders category pills; calls `menuStore.setCategory()`; horizontal scroll on mobile |
| `SearchInput` | F01 | Controlled input with 200ms debounce; calls `menuStore.setSearch()` |
| `CustomizationModal` | F02 | Full customization UI; real-time price; dispatches `cartStore.addItem()` on confirm |
| `CartDrawer` | F03 | Animated slide-in panel; lists `CartItem` components; shows subtotal + "Place Order" |
| `CartItem` | F03 | Line item with quantity stepper, remove button, customization summary |
| `Navigation` | F05 | Responsive header; conditionally renders top bar (md+) or compact header (<md) |
| `ToastProvider` | F06 | Context + state for active toasts; renders `<Toast>` stack at `fixed bottom-4 right-4` |
| `ConfirmationPage` | F04 | Renders order reference, itemized summary, "Start a New Order" CTA |
| `Button` | F00 | `motion.button` with `whileTap={{ scale: 0.97 }}`; all variants; min-height 44px |
| `Modal` | F00 | `role="dialog"`, `aria-modal`, focus trap, Escape handler |

### 2.4 State Flow Diagram

```
  [MenuPage loads]
       │
       ▼
  menuStore.fetchMenu()
       │
       ├─► GET /api/menu ──► [items stored in menuStore]
       │                            │
       │                    [filteredItems derived]
       │                            │
       ▼                            ▼
  [ProductCard grid renders]   [CategoryFilter renders]
       │
       ├── "Customize" click ──► [CustomizationModal opens]
       │                              │
       │                         "Add to Cart"
       │                              │
       └── "Add to Cart" ────────────► cartStore.addItem()
                                            │
                                     [CartBadge updates]
                                     [Toast fires]
                                            │
                                    [CartDrawer open]
                                            │
                                     "Place Order"
                                            │
                                   POST /api/orders
                                            │
                                  [cartStore.clearCart()]
                                            │
                                  [Navigate /confirmation]
```

---
---

## 3. Data Model

### 3.1 Entity Relationship Diagram

```
┌──────────────────────────────────┐
│          menu_items              │
├──────────────────────────────────┤
│ id               INTEGER PK AUTO │
│ name             TEXT NOT NULL   │
│ description      TEXT            │
│ base_price       REAL NOT NULL   │
│ category         TEXT NOT NULL   │◄─── "Espresso" | "Cold Brew" |
│ drink_type       TEXT NOT NULL   │     "Pour-Over" | "Tea" | "Seasonal"
│ has_customizations INTEGER       │
│ available        INTEGER         │
│ sort_order       INTEGER         │
│ options_json     TEXT (JSON)     │
│ created_at       TEXT            │
└──────────────────────────────────┘
           (no FK — reference only)
                    ◄───────────────────────────────────────
                                                           │
┌──────────────────────────────────┐        ┌─────────────────────────────────────┐
│            orders                │        │            order_items               │
├──────────────────────────────────┤        ├─────────────────────────────────────┤
│ id          INTEGER PK AUTO      │◄───────│ id               INTEGER PK AUTO     │
│ subtotal    REAL NOT NULL        │  1:N   │ order_id         INTEGER FK→orders   │
│ notes       TEXT                 │        │ menu_item_id     INTEGER (ref only)  │
│ status      TEXT DEFAULT received│        │ name             TEXT (denormalized) │
│ created_at  TEXT                 │        │ unit_price       REAL NOT NULL       │
└──────────────────────────────────┘        │ quantity         INTEGER 1–10        │
                                            │ customizations_json TEXT (JSON)      │
                                            │ created_at       TEXT                │
                                            └─────────────────────────────────────┘

Relationships:
  orders (1) ──────────── order_items (N)   ON DELETE CASCADE
  menu_items ··· order_items                 reference only (no enforced FK)
```

**Design rationale for `menu_item_id` not being a FK:**
Menu items may be archived or deleted in future versions. Order history must remain complete and immutable. `name` and `unit_price` are denormalized at order time to preserve the state of the order even if the underlying menu item changes.

---

### 3.2 Full SQLite DDL

```sql
-- ============================================================
-- BrewAI SQLite Schema — v1.0
-- Executed by initDatabase() on server start
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- Table: menu_items
-- Stores the drink catalog (read-only at runtime; seeded on init)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_items (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    name                TEXT    NOT NULL,
    description         TEXT    NOT NULL DEFAULT '',
    base_price          REAL    NOT NULL CHECK (base_price > 0),
    category            TEXT    NOT NULL,
    -- Category values (display strings): 'Espresso' | 'Cold Brew' | 'Pour-Over' | 'Tea' | 'Seasonal'
    drink_type          TEXT    NOT NULL DEFAULT 'other',
    -- Enum: 'espresso' | 'cold_brew' | 'pour_over' | 'tea' | 'seasonal' | 'other'
    -- Only 'espresso' drink_type renders the shot count selector in the customization modal.
    has_customizations  INTEGER NOT NULL DEFAULT 1
                                CHECK (has_customizations IN (0, 1)),
    -- 1 = renders "Customize" CTA on product card
    -- 0 = renders "Add to Cart" CTA (added with default options)
    available           INTEGER NOT NULL DEFAULT 1
                                CHECK (available IN (0, 1)),
    -- 0 = hidden from GET /api/menu; 1 = visible
    sort_order          INTEGER NOT NULL DEFAULT 0,
    -- Ascending within each category; lower = displayed first
    options_json        TEXT    NOT NULL DEFAULT '{}',
    -- Serialized JSON. Parsed in application code. Shape:
    -- {
    --   "sizes":        [{ "label": "Small",  "delta": -0.50 },
    --                    { "label": "Medium", "delta":  0.00 },
    --                    { "label": "Large",  "delta":  0.75 }],
    --   "milks":        ["Whole", "Oat", "Almond", "Coconut", "Skim", "None"],
    --   "temperatures": ["Hot", "Iced", "Blended"],
    --   "shots":        ["Single", "Double", "Triple"],  -- null for non-espresso
    --   "extras":       [{ "label": "Vanilla Syrup", "price": 0.75 }, ...]
    -- }
    created_at          TEXT    NOT NULL
                                DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category  ON menu_items (category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (available);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort      ON menu_items (category, sort_order, name);

-- ------------------------------------------------------------
-- Table: orders
-- One row per placed order. Append-only in v1.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    subtotal    REAL    NOT NULL CHECK (subtotal > 0),
    -- Sum of (unit_price × quantity) for all line items; no tax/tip in v1
    notes       TEXT    NOT NULL DEFAULT '',
    -- Optional order-level note; max 500 chars enforced in API layer
    status      TEXT    NOT NULL DEFAULT 'received',
    -- Status enum: 'received' (only value in v1)
    -- Future: 'preparing' | 'ready' | 'completed'
    created_at  TEXT    NOT NULL
                        DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);

-- ------------------------------------------------------------
-- Table: order_items
-- One row per line item within an order.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id            INTEGER NOT NULL
                                REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id        INTEGER NOT NULL,
    -- Intentionally NOT a foreign key to menu_items.
    -- Preserves order history if menu items are later archived/deleted.
    name                TEXT    NOT NULL,
    -- Denormalized drink name at time of order (immutable record)
    unit_price          REAL    NOT NULL CHECK (unit_price > 0),
    -- Price per unit including size delta + add-on prices at time of order
    quantity            INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 10),
    customizations_json TEXT    NOT NULL DEFAULT '{}',
    -- Serialized JSON snapshot of customer selections. Shape:
    -- {
    --   "size":                "Large",
    --   "milk":                "Oat",          -- null if not applicable
    --   "temperature":         "Iced",         -- null if not applicable
    --   "shots":               "Double",       -- null if not espresso
    --   "addons":              ["Vanilla Syrup", "Caramel"],
    --   "specialInstructions": "Extra hot please"
    -- }
    created_at          TEXT    NOT NULL
                                DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
```

---

### 3.3 options_json Canonical Shapes (per drink_type)

These JSON objects are stored verbatim in `menu_items.options_json` and parsed by the API before returning to the client.

**Espresso (`drink_type = 'espresso'`):**
```json
{
  "sizes": [
    { "label": "Small",  "delta": -0.50 },
    { "label": "Medium", "delta":  0.00 },
    { "label": "Large",  "delta":  0.75 }
  ],
  "milks": ["Whole", "Oat", "Almond", "Coconut", "Skim", "None"],
  "temperatures": ["Hot", "Iced"],
  "shots": ["Single", "Double", "Triple"],
  "extras": [
    { "label": "Vanilla Syrup", "price": 0.75 },
    { "label": "Caramel",       "price": 0.75 },
    { "label": "Hazelnut",      "price": 0.75 },
    { "label": "Extra Shot",    "price": 1.00 },
    { "label": "Whipped Cream", "price": 0.50 }
  ]
}
```

**Cold Brew (`drink_type = 'cold_brew'`):**
```json
{
  "sizes": [
    { "label": "Small",  "delta": -0.50 },
    { "label": "Medium", "delta":  0.00 },
    { "label": "Large",  "delta":  0.75 }
  ],
  "milks": ["None", "Oat", "Whole", "Almond"],
  "temperatures": ["Iced"],
  "shots": null,
  "extras": [
    { "label": "Vanilla Syrup", "price": 0.75 },
    { "label": "Caramel",       "price": 0.75 },
    { "label": "Whipped Cream", "price": 0.50 }
  ]
}
```

**Pour-Over (`drink_type = 'pour_over'`):**
```json
{
  "sizes": [
    { "label": "8oz",  "delta": 0.00 },
    { "label": "12oz", "delta": 0.50 }
  ],
  "milks": [],
  "temperatures": ["Hot"],
  "shots": null,
  "extras": []
}
```

**Tea (`drink_type = 'tea'`):**
```json
{
  "sizes": [
    { "label": "Small",  "delta": -0.50 },
    { "label": "Medium", "delta":  0.00 },
    { "label": "Large",  "delta":  0.75 }
  ],
  "milks": ["Oat", "Whole", "Almond", "Coconut", "None"],
  "temperatures": ["Hot", "Iced"],
  "shots": null,
  "extras": [
    { "label": "Vanilla Syrup", "price": 0.75 },
    { "label": "Extra Honey",   "price": 0.50 }
  ]
}
```

---

### 3.4 Seed Data Overview

| Category | Items | drink_type | has_customizations |
|----------|-------|-----------|-------------------|
| Espresso | 6 | `espresso` | 1 |
| Cold Brew | 4 | `cold_brew` | 1 |
| Pour-Over | 4 | `pour_over` | 0 |
| Tea | 4 | `tea` | 1 |
| Seasonal | 3 | `espresso` / `cold_brew` | 1 |
| **Total** | **21** | — | — |

Pour-Over items have `has_customizations = 0` because they have no milk or shot options — they are served as-is with only a size choice (8oz / 12oz), so the "Add to Cart" CTA is appropriate.

---
---

## 4. API Design

### 4.1 API Conventions

- **Base URL:** `http://0.0.0.0:3000` (production); `http://localhost:3000` (development)
- **Envelope:** Every response uses `{ data: T | null, error: ApiError | null, status: number }`
- **Content-Type:** Always `application/json`
- **Authentication:** None — all endpoints are public (guest-only v1)
- **Parameterized queries:** All SQLite queries use `db.prepare('...WHERE id = ?').get(id)` — no string interpolation
- **camelCase responses:** DB column names (`base_price`, `has_customizations`) are mapped to camelCase (`basePrice`, `hasCustomizations`) before responding

---

### 4.2 TypeScript Interfaces

```typescript
// ============================================================
// Shared API Types — src/types/index.ts (frontend)
//                    server/types/api.ts (backend)
// ============================================================

// ─── Common Envelope ─────────────────────────────────────────

interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

interface ApiError {
  code: string;       // SCREAMING_SNAKE_CASE
  message: string;    // Human-readable
  field?: string;     // Named field on validation errors
}

// ─── Menu Types ──────────────────────────────────────────────

interface SizeOption {
  label: string;      // "Small" | "Medium" | "Large" | "8oz" | "12oz"
  delta: number;      // Price adjustment relative to base_price (can be negative)
}

interface ExtraOption {
  label: string;      // "Vanilla Syrup" | "Caramel" | etc.
  price: number;      // Add-on price (always positive)
}

interface ItemOptions {
  sizes:        SizeOption[];       // Always at least one size
  milks:        string[];           // [] if no milk options (e.g. pour-over)
  temperatures: string[];           // ["Hot"] | ["Iced"] | ["Hot", "Iced"] | ["Hot", "Iced", "Blended"]
  shots:        string[] | null;    // ["Single","Double","Triple"] for espresso; null otherwise
  extras:       ExtraOption[];      // [] if no add-ons
}

interface MenuItem {
  id:                 number;
  name:               string;
  description:        string;
  basePrice:          number;
  category:           string;       // "Espresso" | "Cold Brew" | "Pour-Over" | "Tea" | "Seasonal"
  drinkType:          string;       // "espresso" | "cold_brew" | "pour_over" | "tea" | "seasonal" | "other"
  hasCustomizations:  boolean;      // true → "Customize" CTA; false → "Add to Cart" CTA
  available:          boolean;
  sortOrder:          number;
  options:            ItemOptions;
  createdAt:          string;       // ISO 8601
}

// ─── Cart Types (client-side only) ───────────────────────────

interface CartItemCustomizations {
  size:                 string;
  milk:                 string | null;
  temperature:          string | null;
  shots:                string | null;
  addons:               string[];
  specialInstructions:  string;
}

interface CartItem {
  cartItemId:     string;           // crypto.randomUUID()
  menuItemId:     number;
  name:           string;           // Denormalized for display
  unitPrice:      number;           // base_price + size_delta + sum(addon prices)
  quantity:       number;           // 1–10
  customizations: CartItemCustomizations;
}

interface CartStore {
  items:        CartItem[];
  totalCount:   number;             // Derived: sum of item.quantity
  subtotal:     number;             // Derived: sum of item.unitPrice × item.quantity
  isOpen:       boolean;
  addItem:      (item: CartItem) => void;
  removeItem:   (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart:    () => void;
  openCart:     () => void;
  closeCart:    () => void;
}

// ─── Menu Store (client-side only) ───────────────────────────

interface MenuStore {
  items:          MenuItem[];
  categories:     string[];         // Derived from items; unique; "All" added by component
  loading:        boolean;
  error:          string | null;
  activeCategory: string;           // 'All' or a category name
  searchQuery:    string;
  filteredItems:  MenuItem[];       // Derived: items filtered by activeCategory + searchQuery
  fetchMenu:      () => Promise<void>;
  setCategory:    (category: string) => void;
  setSearch:      (query: string) => void;
  clearFilters:   () => void;
}

// ─── Order Types ─────────────────────────────────────────────

interface OrderLineItemCustomizations {
  size:                 string;
  milk:                 string | null;
  temperature:          string | null;
  shots:                string | null;
  addons:               string[];
  specialInstructions:  string;
}

interface OrderLineItem {
  menuItemId:     number;
  name:           string;
  unitPrice:      number;
  quantity:       number;
  customizations: OrderLineItemCustomizations;
}

// POST /api/orders — request body
interface OrderPayload {
  items:    OrderLineItem[];
  subtotal: number;
  notes:    string;           // Empty string if no order-level note
}

// POST /api/orders & GET /api/orders/:id — response data payload
interface OrderResponse {
  orderId:         number;
  orderReference:  string;    // "BRW-00042" format
  createdAt:       string;    // ISO 8601
  subtotal:        number;
  status:          string;    // "received" in v1
  notes?:          string;    // Present in GET /api/orders/:id
  items:           OrderResponseItem[];
}

interface OrderResponseItem {
  id:             number;     // order_items.id
  menuItemId:     number;
  name:           string;
  unitPrice:      number;
  quantity:       number;
  customizations: OrderLineItemCustomizations;
}
```

---

### 4.3 Endpoint Reference

#### GET /api/menu

Returns all available menu items sorted by category and sort_order. The `options_json` TEXT column is parsed and returned as a structured `options` object.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/api/menu` |
| Auth | None |
| Query params | None |
| Request body | None |
| Success status | `200 OK` |

**Response `data` type:** `MenuItem[]`

**Error responses:**

| Condition | Status | `error.code` |
|-----------|--------|-------------|
| SQLite read failure | 500 | `DB_READ_ERROR` |

**SQL:**
```sql
SELECT * FROM menu_items
WHERE available = 1
ORDER BY category, sort_order, name;
```

---

#### GET /api/menu/categories

Returns the sorted list of distinct category names for available items.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/api/menu/categories` |
| Auth | None |
| Success status | `200 OK` |

**Response `data` type:** `string[]`

**Example response:**
```json
{ "data": ["Cold Brew", "Espresso", "Pour-Over", "Seasonal", "Tea"], "error": null, "status": 200 }
```

**SQL:**
```sql
SELECT DISTINCT category FROM menu_items
WHERE available = 1
ORDER BY category;
```

---

#### GET /api/menu/:id

Returns a single menu item with full parsed options. Returns 404 if the item does not exist or is unavailable.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/api/menu/:id` |
| Path param | `id` — positive integer |
| Auth | None |
| Success status | `200 OK` |

**Response `data` type:** `MenuItem`

**Error responses:**

| Condition | Status | `error.code` |
|-----------|--------|-------------|
| `id` not a positive integer | 400 | `INVALID_ID` |
| Item not found or unavailable | 404 | `ITEM_NOT_FOUND` |
| SQLite read failure | 500 | `DB_READ_ERROR` |

**SQL:**
```sql
SELECT * FROM menu_items WHERE id = ? AND available = 1;
```

---

#### POST /api/orders

Validates and persists a new order atomically. Inserts one `orders` row and N `order_items` rows in a single SQLite transaction. Returns 201 with the created order including its generated reference number.

| Property | Value |
|----------|-------|
| Method | `POST` |
| Path | `/api/orders` |
| Content-Type | `application/json` |
| Auth | None |
| Success status | `201 Created` |

**Request body type:** `OrderPayload`

**Request body validation:**

| Field | Rule |
|-------|------|
| `items` | Required; non-empty array; max 50 items |
| `items[].menuItemId` | Required; integer > 0 |
| `items[].name` | Required; 1–200 chars |
| `items[].unitPrice` | Required; number > 0; rounded to 2dp server-side |
| `items[].quantity` | Required; integer 1–10 |
| `items[].customizations` | Required object |
| `items[].customizations.size` | Required; 1–50 chars |
| `items[].customizations.milk` | Optional; string or null; max 50 chars |
| `items[].customizations.temperature` | Optional; string or null; max 50 chars |
| `items[].customizations.shots` | Optional; string or null; max 20 chars |
| `items[].customizations.addons` | Optional; string[]; max 10 items; each max 100 chars |
| `items[].customizations.specialInstructions` | Optional; max 200 chars (truncated server-side) |
| `subtotal` | Required; number > 0 |
| `notes` | Optional; max 500 chars (truncated server-side); empty string accepted |

**Response `data` type:** `OrderResponse`

**Order reference construction:**
```typescript
const orderReference = `BRW-${String(orderId).padStart(5, '0')}`;
// orderId=42  → "BRW-00042"
// orderId=100000 → "BRW-100000" (no truncation when > 99999)
```

**Error responses:**

| Condition | Status | `error.code` |
|-----------|--------|-------------|
| `items` is empty or missing | 400 | `EMPTY_ORDER` |
| Required field missing or invalid | 400 | `INVALID_PAYLOAD` |
| SQLite transaction error | 500 | `DB_WRITE_ERROR` |

**SQL (within transaction):**
```sql
-- Step 1: Insert order
INSERT INTO orders (subtotal, notes) VALUES (?, ?);
-- → lastInsertRowid = orderId

-- Step 2: Insert each line item
INSERT INTO order_items
  (order_id, menu_item_id, name, unit_price, quantity, customizations_json)
VALUES (?, ?, ?, ?, ?, ?);
-- customizations_json = JSON.stringify(item.customizations)
```

---

#### GET /api/orders/:id

Retrieves a stored order by its database ID. Joins `orders` with `order_items` and parses `customizations_json`.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/api/orders/:id` |
| Path param | `id` — positive integer |
| Auth | None |
| Success status | `200 OK` |

**Response `data` type:** `OrderResponse` (includes `notes`)

**Error responses:**

| Condition | Status | `error.code` |
|-----------|--------|-------------|
| `id` not a positive integer | 400 | `INVALID_ID` |
| Order not found | 404 | `ORDER_NOT_FOUND` |
| SQLite read failure | 500 | `DB_READ_ERROR` |

**SQL:**
```sql
SELECT * FROM orders WHERE id = ?;
SELECT * FROM order_items WHERE order_id = ? ORDER BY id;
-- Parse customizations_json on each order_item row
```

---

### 4.4 API Error Code Reference

| Code | HTTP | Endpoint(s) | Description |
|------|------|-------------|-------------|
| `INVALID_ID` | 400 | `GET /api/menu/:id`, `GET /api/orders/:id` | Route param is not a positive integer |
| `ITEM_NOT_FOUND` | 404 | `GET /api/menu/:id` | Item not found or unavailable |
| `EMPTY_ORDER` | 400 | `POST /api/orders` | `items` array is empty or missing |
| `INVALID_PAYLOAD` | 400 | `POST /api/orders` | Required field missing or fails validation |
| `ORDER_NOT_FOUND` | 404 | `GET /api/orders/:id` | Order not found |
| `DB_READ_ERROR` | 500 | `GET /api/menu*`, `GET /api/orders/:id` | SQLite read failure |
| `DB_WRITE_ERROR` | 500 | `POST /api/orders` | SQLite write failure; transaction rolled back |
| `NOT_FOUND` | 404 | Any unmatched route | No route matched |
| `INTERNAL_ERROR` | 500 | Any endpoint | Unhandled server error |

---

### 4.5 API Fetch Helper (Frontend)

```typescript
// src/lib/api.ts

const BASE_URL = '/api';  // Relative — works in both dev (proxied) and prod (same origin)

async function apiFetch<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    ...options,
  });
  return res.json() as Promise<ApiResponse<T>>;
}

export const api = {
  getMenu:        ()              => apiFetch<MenuItem[]>('/menu'),
  getCategories:  ()              => apiFetch<string[]>('/menu/categories'),
  getMenuItem:    (id: number)    => apiFetch<MenuItem>(`/menu/${id}`),
  createOrder:    (payload: OrderPayload) =>
                    apiFetch<OrderResponse>('/orders', {
                      method: 'POST',
                      body: JSON.stringify(payload),
                    }),
  getOrder:       (id: number)    => apiFetch<OrderResponse>(`/orders/${id}`),
};
```

---
---

## 5. Security Architecture

### 5.1 Overview

BrewAI v1 is a guest-only ordering application with no user accounts, no authentication, and no payment data. The security surface is intentionally minimal. The primary concerns are input validation, SQL injection prevention, and ensuring no sensitive runtime data is exposed.

### 5.2 Authentication & Authorization

| Property | Value |
|----------|-------|
| Authentication | None — all endpoints are publicly accessible |
| Authorization | None — no roles, no permissions |
| Sessions | None — no cookies, no session tokens |
| User data collected | None — no PII stored |

All API endpoints are read/write-public. This is acceptable for v1 because:
- The only writable endpoint (`POST /api/orders`) accepts anonymous order submissions, which is the intended user flow.
- There is no admin surface, payment data, or user credentials to protect.
- The application is scoped to a preview/sandbox environment in v1.

### 5.3 Input Validation & Injection Prevention

**SQL Injection:** Prevented by using `better-sqlite3` parameterized prepared statements exclusively. No SQL query in the application uses string interpolation or template literals to include user input. Every user-supplied value is passed as a `?` parameter:

```typescript
// Safe — parameterized
const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);

// Never — string interpolation (forbidden)
// const item = db.query(`SELECT * FROM menu_items WHERE id = ${id}`); ← NEVER
```

**Request Body Validation (`POST /api/orders`):** Validated field-by-field before any database write:

| Validation | Implementation |
|-----------|----------------|
| `items` is non-empty array | `Array.isArray(items) && items.length > 0` |
| `menuItemId` is positive integer | `Number.isInteger(v) && v > 0` |
| `unitPrice` is positive number | `typeof v === 'number' && v > 0` |
| `unitPrice` precision | `Math.round(v * 100) / 100` (rounded to 2dp before write) |
| `quantity` in range | `Number.isInteger(v) && v >= 1 && v <= 10` |
| `name` length | `typeof v === 'string' && v.length >= 1 && v.length <= 200` |
| `customizations.size` | `typeof v === 'string' && v.length >= 1 && v.length <= 50` |
| `specialInstructions` | Truncated to 200 chars server-side if longer |
| `notes` | Truncated to 500 chars server-side if longer |

**Route Parameter Validation:** All `:id` parameters are validated before querying:
```typescript
const id = parseInt(req.params.id, 10);
if (!Number.isInteger(id) || id <= 0) {
  return res.status(400).json({ data: null, error: { code: 'INVALID_ID', message: 'Invalid ID' }, status: 400 });
}
```

### 5.4 CORS Configuration

```typescript
// Development: allow Vite dev server on localhost:5173
cors({ origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173' })

// Production: same-origin requests only (Express serves both frontend and API)
// CORS header is omitted; browsers enforce same-origin policy
```

In production, the Express app serves the Vite-compiled `dist/` folder as static files on the same origin (`http://0.0.0.0:3000`). All `/api/*` requests are same-origin — no CORS header is needed or set.

### 5.5 Data Protection

| Data Type | Handling |
|-----------|----------|
| User PII | Not collected — no names, emails, or user accounts stored |
| Payment data | Not collected — no payment surface in v1 |
| Order data | Stored in SQLite with denormalized item name and customizations; no user identity linked |
| Cookies | None set — no session or tracking cookies |
| Local storage | None written — cart state is Zustand in-memory only (lost on refresh by design) |

### 5.6 Content Security

- **No inline scripts:** Vite builds produce hashed asset filenames; no `eval()` or `new Function()` used
- **TypeScript strict mode:** `"strict": true` in `tsconfig.json`; no `any` types in production code; reduces class of runtime type errors
- **No `dangerouslySetInnerHTML`:** All content rendered via React JSX; no direct HTML injection
- **SQLite file permissions:** The `data/` directory and `brewai.db` file are created at server start; should have `600` or `640` permissions in production

### 5.7 Dependency Security

- All packages sourced from `registry.npmjs.org` only
- No binary downloads via `curl` or `wget` at any stage (Dockerfile or runtime)
- `better-sqlite3` uses pre-built binaries for Node 20 on Debian; if unavailable, compiled from source using apt-installed build tools — no external binary fetch
- No runtime CDN fetches; all assets (fonts, JS, CSS) are bundled into `dist/` at build time

### 5.8 Error Handling & Information Disclosure

- **Server errors:** Full stack traces are logged to `console.error` only (server-side). The API response returns only `{ code, message }` — no stack trace is included in the JSON response.
- **User-facing messages:** Generic and non-revealing (e.g., "Could not save your order. Please try again." — not "SQLITE_CONSTRAINT error on column subtotal")
- **404 on unknown routes:** Returns a consistent JSON 404 envelope, not the default Express HTML error page

```typescript
// Global error handler — never exposes internals
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    data: null,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
    status: 500,
  });
});
```

---
---

## 6. Technology Stack

### 6.1 Full Stack Reference

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | `^18.x` | Component-driven UI with concurrent features |
| **Language** | TypeScript | `^5.x` | Type safety; strict mode enabled |
| **Build Tool** | Vite | `^5.x` | Fast dev server, optimized production bundle, ESM output |
| **Vite Plugin** | @vitejs/plugin-react | `^4.x` | React Fast Refresh in development |
| **CSS Framework** | Tailwind CSS | `^3.x` (v3 only, not v4) | Utility-first CSS; custom design tokens in `tailwind.config.ts` |
| **CSS Processing** | PostCSS + Autoprefixer | `^8.x` / `^10.x` | CSS pipeline; vendor prefixes |
| **State Management** | Zustand | `^4.x` | Lightweight cart and menu state without Redux overhead |
| **Animation** | Framer Motion | `^11.x` | Declarative animations; `AnimatePresence`; `useReducedMotion` |
| **Icons** | Lucide React | `^0.x` | Tree-shakeable SVG icon set |
| **Routing** | React Router | `^6.x` | SPA client-side routing |
| **Font (body)** | @fontsource/inter | `^5.x` | Bundled Inter font (woff2); no CDN fetch |
| **Font (display)** | @fontsource/playfair-display | `^5.x` | Bundled Playfair Display (woff2); no CDN fetch |
| **Backend Runtime** | Node.js | `20.x` (LTS) | Server runtime; required for `bookworm-slim` image |
| **Backend Framework** | Express | `^4.x` | REST API + static file serving |
| **Database Driver** | better-sqlite3 | `^9.x` | Synchronous SQLite; no async/callback overhead |
| **CORS Middleware** | cors | `^2.x` | CORS headers in development mode |
| **TS Execution (dev)** | tsx | `^4.x` | Run TypeScript directly without compile step in dev |
| **Container Image** | node:20-bookworm-slim | — | Debian 12 slim; sandbox-compatible; never Alpine |

### 6.2 Design System Tokens (Tailwind Configuration)

All tokens are defined in `tailwind.config.ts` under `theme.extend`. No color hex values appear in `.tsx` or `.ts` files outside this config and `src/index.css`.

```typescript
// tailwind.config.ts (theme.extend section)
colors: {
  canvas:         '#0A0A0A',   // Page background (<html>, <body>)
  surface:        '#141414',   // Card and panel backgrounds
  'surface-raised': '#1C1C1C', // Modals, dropdowns, elevated elements
  accent:         '#C8922A',   // Primary CTA, focus rings, highlights
  'accent-hover': '#E0A83C',   // Accent hover state
  primary:        '#F5F0E8',   // Body and heading text
  secondary:      '#9A9080',   // Secondary / helper text
  tertiary:       '#5A5248',   // Tertiary text, placeholders
  border:         '#2A2A2A',   // Subtle border (cards, inputs)
  'border-hover': '#3A3A3A',   // Border hover state
  success:        '#4CAF50',   // Success states and icons
  error:          '#E57373',   // Error states and icons
},
fontFamily: {
  display: ['Playfair Display', 'Georgia', 'serif'],
  body:    ['Inter', 'system-ui', 'sans-serif'],
},
borderRadius: {
  input: '6px',
  card:  '12px',
  pill:  '20px',
},
```

### 6.3 Font Bundling Strategy

Fonts are sourced from `@fontsource/*` npm packages, which ship pre-converted `.woff2` files. Vite processes these at build time and emits them into `dist/assets/`. No Google Fonts CDN URL is ever referenced.

```typescript
// src/main.tsx — font imports (processed by Vite)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
```

If `@fontsource` packages cause issues, the fallback is to place `.woff2` files in `public/assets/fonts/` and declare `@font-face` rules in `src/index.css`:

```css
/* src/index.css (fallback approach) */
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### 6.4 Build Configuration

**`vite.config.ts`:**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,   // Omit in production for smaller bundle
  },
});
```

**`tailwind.config.ts`:**
```typescript
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { /* design tokens above */ } },
  plugins: [],
};
```

**`tsconfig.json` (key settings):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  }
}
```

### 6.5 npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `concurrently "tsx server.ts" "vite"` | Dev: Express on 3000 + Vite on 5173 |
| `build` | `tsc -p tsconfig.server.json && vite build` | Compile server + build frontend |
| `start` | `node server.js` | Production: start Express (serves dist/) |
| `preview` | `vite preview` | Preview Vite build only (dev tool) |

### 6.6 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Express server port |
| `HOST` | `0.0.0.0` | Express bind address (required for sandbox) |
| `DB_PATH` | `./data/brewai.db` | SQLite database file path |
| `NODE_ENV` | `development` | Controls CORS and static file behavior |

---
---

## 7. Integration Points

### 7.1 Overview

BrewAI v1 is intentionally self-contained. There are **zero external service integrations** at runtime. All dependencies are resolved at build time via npm and bundled into the application. The integration surface consists only of internal boundaries between the frontend, backend, and database layers.

### 7.2 Internal Integration: Frontend ↔ Backend

| Integration Point | Contract |
|------------------|---------|
| Protocol | HTTP/1.1 over localhost (same container) |
| Data format | JSON — `{ data, error, status }` envelope on every response |
| Base path | `/api` — prefixed on all API routes |
| Error handling | Frontend checks `response.error !== null` before using `response.data` |
| Dev proxy | Vite proxies `/api/*` → `http://localhost:3000/api/*` to avoid CORS in development |
| Production | Same origin; no proxy needed; Express handles both `/api/*` and static files |

**Frontend fetch pattern:**
```typescript
const response = await api.getMenu();
if (response.error) {
  // Handle error using response.error.code
} else {
  // Use response.data safely
}
```

### 7.3 Internal Integration: Backend ↔ SQLite

| Integration Point | Contract |
|------------------|---------|
| Driver | `better-sqlite3` — fully synchronous (no Promises, no callbacks) |
| Connection | Singleton `Database` instance opened once at startup |
| WAL mode | `PRAGMA journal_mode = WAL` — improves concurrent read throughput |
| Foreign keys | `PRAGMA foreign_keys = ON` — enforces `order_items.order_id → orders.id` |
| Transactions | `POST /api/orders` uses `db.transaction(fn)()` for atomic multi-row insert |
| Query style | Prepared statements only; all user values passed as `?` parameters |
| JSON columns | `options_json` and `customizations_json` are TEXT; parsed with `JSON.parse()` in application code |
| Auto-init | `initDatabase()` called synchronously before `app.listen()` — schema always ready before first request |

### 7.4 npm Package Dependencies

**Frontend packages:**

| Package | Version | Role | Constraint |
|---------|---------|------|-----------|
| `react` | `^18.x` | UI framework | — |
| `react-dom` | `^18.x` | DOM renderer | — |
| `react-router-dom` | `^6.x` | Client-side routing | — |
| `zustand` | `^4.x` | State management | — |
| `framer-motion` | `^11.x` | Animations | Dynamic import recommended for initial chunk |
| `lucide-react` | `^0.x` | Icons | Import individual icons only (tree-shakeable) |
| `@fontsource/inter` | `^5.x` | Bundled Inter font | No CDN; woff2 bundled by Vite |
| `@fontsource/playfair-display` | `^5.x` | Bundled Playfair Display | No CDN; woff2 bundled by Vite |
| `tailwindcss` | `^3.x` | CSS framework | v3 ONLY — not v4 |
| `autoprefixer` | `^10.x` | PostCSS plugin | — |
| `postcss` | `^8.x` | CSS processing | — |
| `typescript` | `^5.x` | Type checking | devDependency |
| `vite` | `^5.x` | Build tool | devDependency |
| `@vitejs/plugin-react` | `^4.x` | Vite React plugin | devDependency |

**Backend packages:**

| Package | Version | Role | Constraint |
|---------|---------|------|-----------|
| `express` | `^4.x` | HTTP framework | — |
| `better-sqlite3` | `^9.x` | SQLite driver | Requires native binary; Debian build tools available if compile needed |
| `cors` | `^2.x` | CORS middleware | — |
| `tsx` | `^4.x` | TS execution in dev | devDependency |
| `@types/express` | `^4.x` | Express types | devDependency |
| `@types/better-sqlite3` | `^7.x` | better-sqlite3 types | devDependency |
| `@types/cors` | `^2.x` | cors types | devDependency |
| `@types/node` | `^20.x` | Node.js types | devDependency |

### 7.5 Container Integration (Docker)

```dockerfile
FROM node:20-bookworm-slim
# NEVER Alpine — Alpine is not on the sandbox allowlist

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
# Produces: dist/ (Vite frontend) + server.js (compiled Express)

# If better-sqlite3 needs native compilation (fallback only):
# RUN apt-get update && apt-get install -y python3 make g++ \
#     && npm rebuild better-sqlite3 --build-from-source \
#     && apt-get clean

EXPOSE 3000
# Must bind to 0.0.0.0 for sandbox port exposure

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV DB_PATH=./data/brewai.db

# SQLite database directory (mountable as named volume for persistence)
RUN mkdir -p /app/data

CMD ["node", "server.js"]
```

**Container checklist:**

| Item | Requirement | Status |
|------|-------------|--------|
| Base image | `node:20-bookworm-slim` (Debian 12) | Required |
| Port binding | `0.0.0.0:3000` | Required |
| Font assets | Bundled into `dist/assets/` by Vite at build time | Required |
| Database | Auto-initialized and seeded on cold start | Required |
| npm only | All packages from `registry.npmjs.org`; no `curl`/`wget` fetches | Required |
| Alpine | Never — not on sandbox allowlist | Forbidden |

### 7.6 External Services (None in v1)

| Service Type | Status | Notes |
|-------------|--------|-------|
| Payment gateway | Not integrated | Out of scope v1 |
| Authentication provider | Not integrated | Guest-only ordering |
| Email / SMS | Not integrated | Confirmation is UI-only |
| Analytics | Not integrated | No user data collection |
| Error monitoring | Not integrated | Console logging only |
| CDN | Not integrated | All assets bundled locally |
| External database | Not integrated | SQLite embedded in container |
| Google Fonts | Not integrated at runtime | Replaced by `@fontsource/*` npm packages |

### 7.7 Sandbox Network Allowlist

All runtime network activity is restricted to:

| Host | Protocol | Purpose |
|------|----------|---------|
| `0.0.0.0:3000` (self) | HTTP | Application server |
| `localhost:3000` (self) | HTTP | API calls from browser in production |
| `registry.npmjs.org` | HTTPS | npm package installation (build time only) |
| `deb.debian.org` | HTTPS | apt packages if native build needed (build time only) |

No other outbound connections are made or expected at runtime.

---

## Appendix: Non-Functional Requirements Coverage

| Requirement | Architecture Mechanism |
|-------------|----------------------|
| LCP < 2.5s | Vite code splitting; `@fontsource` bundled fonts; no CDN; Tailwind CSS purge |
| CLS < 0.1 | Fixed card dimensions; `min-height` on cards; no layout-shifting fonts (bundled woff2) |
| Keyboard accessible | `role="dialog"` + focus trap in Modal; `aria-label` on all icon buttons; `focus-visible:ring-2` via Tailwind |
| prefers-reduced-motion | `useReducedMotion()` checked in every animated component; all Framer Motion animations disabled when set |
| No horizontal overflow | `overflow-x: hidden` on body; Tailwind responsive breakpoints; `max-w-screen-*` containers |
| Touch targets 44×44px | `min-height: 44px` on all Button variants; enforced via Tailwind utilities |
| Sandbox cold start | `initDatabase()` before `app.listen()`; seed script on empty DB; no manual steps |
| TypeScript strict | `"strict": true` in `tsconfig.json`; no `any` in production code |
| SQLite reliability | `better-sqlite3` synchronous API; no partial writes; WAL journal mode |
| Font no-CDN | `@fontsource/*` packages; woff2 in `dist/assets/`; zero CDN fetches |
| Debian container | `node:20-bookworm-slim` base; never Alpine |

---

*Document end — TechArch-BrewAI.md v1.0 | Generated: 2026-06-15*
