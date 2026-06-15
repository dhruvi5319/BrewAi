---

## F07: REST API & Data Persistence

**Priority:** P0  
**Depends on:** None (backend is independent; frontend depends on this)  
**Required by:** F01 (menu data), F04 (order submission)

---

### Description

A Node.js + Express REST API serves as the backend for BrewAI. It handles menu data retrieval and order persistence using SQLite via the `better-sqlite3` synchronous driver. The database schema is automatically created on server start if tables do not yet exist, and a seed script populates 20–30 specialty coffee menu items across five categories. The server binds to `0.0.0.0:3000` for sandbox compatibility, and all API responses follow a consistent JSON envelope format. CORS is configured to allow the frontend origin during development; in production, both frontend and backend are served from the same Express process on the same port.

---

### Terminology

- **better-sqlite3:** A synchronous Node.js SQLite driver. All reads and writes are blocking/synchronous — no Promises or callbacks. This simplifies error handling and guarantees no partial writes.
- **JSON Envelope:** The standard response shape `{ data, error, status }` used by every endpoint.
- **Auto-Init:** The server-start routine that checks for table existence and runs `CREATE TABLE IF NOT EXISTS` statements to initialize the schema.
- **Seed Script:** A routine run on server start (if the `menu_items` table is empty) that inserts the curated 20–30 drink records.
- **options_json:** A TEXT column in `menu_items` that stores a JSON string representing all customization options for a drink (sizes, milks, temperatures, shots, extras).
- **customizations_json:** A TEXT column in `order_items` that stores the serialized `customizations` object for each ordered item.
- **Order Reference:** Formatted as `BRW-{zero-padded orderId, 5 digits}` (see F04 §Order Reference Format).

---

### Sub-Features

- **F07.1 — Express Server Setup:** Server initialized with `express()`, JSON body parsing, CORS middleware, static file serving, and error handling middleware.
- **F07.2 — SQLite Auto-Init:** On startup, schema is created if tables don't exist; seed data inserted if `menu_items` is empty.
- **F07.3 — `GET /api/menu`:** Returns all available menu items.
- **F07.4 — `GET /api/menu/categories`:** Returns the list of distinct categories.
- **F07.5 — `GET /api/menu/:id`:** Returns a single menu item with full options.
- **F07.6 — `POST /api/orders`:** Validates and persists a new order; returns order reference.
- **F07.7 — `GET /api/orders/:id`:** Returns a stored order by database ID.
- **F07.8 — Static Asset Serving:** Express serves the Vite production build (`dist/`) from `/`; fonts served from `/assets/fonts/`.
- **F07.9 — Error Handling Middleware:** Catches unhandled errors; returns `{ data: null, error: { code, message }, status }`.

---

### Process

**Server Startup:**
1. `server.ts` (or `server.js`) is the entry point: `import express from 'express'`.
2. Middleware chain applied in order: `cors()` → `express.json()` → route handlers → static serving → error handler.
3. `initDatabase()` is called synchronously before the server starts listening:
   a. Opens SQLite file at path defined by `DB_PATH` env var (default: `./data/brewai.db`).
   b. Runs `CREATE TABLE IF NOT EXISTS` for `menu_items`, `orders`, `order_items`.
   c. Checks `SELECT COUNT(*) FROM menu_items`; if 0, runs `seedMenu()`.
4. Server binds: `app.listen(3000, '0.0.0.0', callback)`.
5. Console output: `BrewAI server running on http://0.0.0.0:3000`.

**Request Handling — `GET /api/menu`:**
1. Query: `SELECT * FROM menu_items WHERE available = 1 ORDER BY category, sort_order, name`.
2. For each row, parse `options_json` from TEXT to object.
3. Return `{ data: items[], error: null, status: 200 }`.

**Request Handling — `GET /api/menu/categories`:**
1. Query: `SELECT DISTINCT category FROM menu_items WHERE available = 1 ORDER BY category`.
2. Return `{ data: categories[], error: null, status: 200 }`.

**Request Handling — `GET /api/menu/:id`:**
1. Validate `id` is a positive integer; return 400 if not.
2. Query: `SELECT * FROM menu_items WHERE id = ? AND available = 1`.
3. If not found, return 404.
4. Parse `options_json`; return full item object.

**Request Handling — `POST /api/orders`:**
1. Parse and validate request body (see Validation below).
2. Begin SQLite transaction.
3. Insert into `orders`: `(subtotal, notes, created_at)`.
4. For each line item in `payload.items`, insert into `order_items`: `(order_id, menu_item_id, name, unit_price, quantity, customizations_json)`.
5. Commit transaction.
6. Build `orderReference = 'BRW-' + String(orderId).padStart(5, '0')`.
7. Return `{ data: { orderId, orderReference, createdAt, items, subtotal }, error: null, status: 201 }`.
8. On any error, rollback transaction; return 500.

**Request Handling — `GET /api/orders/:id`:**
1. Validate `id` is a positive integer; return 400 if not.
2. Query `orders` by ID; if not found, return 404.
3. Query `order_items` by `order_id`.
4. For each `order_item`, parse `customizations_json`.
5. Return assembled order object.

---

### Inputs — `POST /api/orders`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `items` | `OrderLineItem[]` | Yes | Non-empty array; each item must have `menuItemId`, `name`, `unitPrice`, `quantity`, `customizations` |
| `items[].menuItemId` | `integer` | Yes | Must be a positive integer (existence in DB not validated in v1) |
| `items[].name` | `string` | Yes | Max 200 chars |
| `items[].unitPrice` | `number` | Yes | > 0; max 2 decimal places enforced by rounding |
| `items[].quantity` | `integer` | Yes | 1–10 |
| `items[].customizations` | `object` | Yes | Must have `size` (string); other fields optional |
| `items[].customizations.size` | `string` | Yes | Max 50 chars |
| `items[].customizations.milk` | `string \| null` | No | Max 50 chars |
| `items[].customizations.temperature` | `string \| null` | No | Max 50 chars |
| `items[].customizations.shots` | `string \| null` | No | Max 20 chars |
| `items[].customizations.addons` | `string[]` | No | Each item max 100 chars; max 10 items |
| `items[].customizations.specialInstructions` | `string` | No | Max 200 chars |
| `subtotal` | `number` | Yes | > 0 |
| `notes` | `string` | No | Max 500 chars; empty string accepted |

---

### Outputs — `POST /api/orders` (201 Created)

```json
{
  "data": {
    "orderId": 42,
    "orderReference": "BRW-00042",
    "createdAt": "2026-06-15T14:32:00.000Z",
    "subtotal": 18.25,
    "items": [
      {
        "menuItemId": 3,
        "name": "Oat Milk Latte",
        "unitPrice": 6.50,
        "quantity": 2,
        "customizations": {
          "size": "Large",
          "milk": "Oat",
          "temperature": "Iced",
          "shots": "Double",
          "addons": ["Vanilla Syrup"],
          "specialInstructions": ""
        }
      }
    ]
  },
  "error": null,
  "status": 201
}
```

---

### Menu Seed Data Categories & Sample Items

| Category | Example Items (3–6 per category) |
|----------|----------------------------------|
| Espresso | Flat White, Cortado, Oat Milk Latte, Cappuccino, Americano, Macchiato |
| Cold Brew | Classic Cold Brew, Nitro Cold Brew, Vanilla Cold Brew, Cold Brew Tonic |
| Pour-Over | Ethiopia Yirgacheffe, Kenya AA, Colombia Huila, Guatemala Antigua |
| Tea | Matcha Latte, Hojicha, Chai Latte, Earl Grey |
| Seasonal | Current seasonal specials (2–4 items; can be a subset of the above with seasonal markup) |

Total: 20–30 items. Each item has: `name`, `description`, `base_price`, `category`, `drink_type`, `available`, `sort_order`, `options_json`, `has_customizations`.

---

### CORS Configuration

```typescript
// Development: allow Vite dev server origin
cors({ origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173' })

// Production: same-origin (Express serves static files; no cross-origin requests needed)
// Set `origin: false` or omit CORS header
```

---

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `HOST` | `0.0.0.0` | Server bind address |
| `DB_PATH` | `./data/brewai.db` | Path to SQLite database file |
| `NODE_ENV` | `development` | Controls CORS and static serving behavior |

---

### Validation (Server-Side)

- All route parameters that should be integers are validated with `parseInt()` + `Number.isInteger()` + `> 0`; invalid values return 400.
- `POST /api/orders` body is validated before any DB write:
  - `items` must be a non-empty array
  - Each item's `unitPrice` is rounded to 2 decimal places
  - `specialInstructions` truncated server-side to 200 chars if longer (should not happen if client validates)
  - `notes` truncated to 500 chars if longer
- All text inputs are passed as parameterized query values — no string interpolation in SQL queries.
- SQLite `better-sqlite3` uses parameterized statements (`db.prepare('... WHERE id = ?').get(id)`) for all queries.

---

### Error States

| Scenario | HTTP Status | Error Code | Response |
|----------|-------------|------------|----------|
| `GET /api/menu/:id` — item not found | 404 | `ITEM_NOT_FOUND` | `{ data: null, error: { code, message }, status: 404 }` |
| `POST /api/orders` — empty items array | 400 | `EMPTY_ORDER` | `{ data: null, error: { code, message }, status: 400 }` |
| `POST /api/orders` — missing required field | 400 | `INVALID_PAYLOAD` | `{ data: null, error: { code, message, field }, status: 400 }` |
| `GET /api/orders/:id` — order not found | 404 | `ORDER_NOT_FOUND` | `{ data: null, error: { code, message }, status: 404 }` |
| Non-integer ID in route param | 400 | `INVALID_ID` | `{ data: null, error: { code, message }, status: 400 }` |
| SQLite write error (disk full, locked) | 500 | `DB_WRITE_ERROR` | `{ data: null, error: { code, message }, status: 500 }` |
| Unhandled route | 404 | `NOT_FOUND` | `{ data: null, error: { code: 'NOT_FOUND', message: 'Route not found' }, status: 404 }` |
| Unhandled server error | 500 | `INTERNAL_ERROR` | `{ data: null, error: { code, message }, status: 500 }` |

---

### API Surface (this feature)

Full spec in `Y1-api.md`. Summary:

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/menu` | Fetch all available items |
| `GET` | `/api/menu/categories` | Fetch distinct categories |
| `GET` | `/api/menu/:id` | Fetch single item with options |
| `POST` | `/api/orders` | Create new order |
| `GET` | `/api/orders/:id` | Retrieve order by ID |

---

### Schema Surface (this feature)

Owns all database tables — see `Y0-schema.md` for full DDL:
- `menu_items`
- `orders`
- `order_items`

---
