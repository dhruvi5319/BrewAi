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
