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
