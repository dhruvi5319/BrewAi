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
