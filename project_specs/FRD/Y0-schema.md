---

## Database Schema (SQLite via better-sqlite3)

**File:** `Y0-schema.md`  
**Owned by:** F07 (REST API & Data Persistence)  
**Used by:** F01 (menu read), F04 (order write), F07 (all)

---

### Overview

BrewAI uses a single SQLite database file at `DB_PATH` (default `./data/brewai.db`). The schema consists of three tables:
- `menu_items` — the drink catalog (read-only at runtime; managed via seed script)
- `orders` — one row per placed order
- `order_items` — one row per line item within an order (foreign key to `orders`)

All tables use `INTEGER PRIMARY KEY` (auto-increment). All timestamps are stored as ISO 8601 TEXT. JSON data (customization options, customizations per order item) is stored as TEXT and parsed in application code.

---

### Auto-Init Behavior

On server startup, the following is run before the server begins accepting requests:

```sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
```

`WAL` mode improves concurrent read performance. Foreign keys are enforced.

If any table is absent, the full `CREATE TABLE IF NOT EXISTS` block is executed. If `menu_items` has zero rows after initialization, the seed script runs immediately.

---

### Table: `menu_items`

Stores the full drink catalog. Records are inserted by the seed script and are read-only at runtime (no user-facing write endpoint for menu items in v1).

```sql
CREATE TABLE IF NOT EXISTS menu_items (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT    NOT NULL,
  description       TEXT    NOT NULL DEFAULT '',
  base_price        REAL    NOT NULL CHECK (base_price > 0),
  category          TEXT    NOT NULL,
  drink_type        TEXT    NOT NULL DEFAULT 'other',
  -- drink_type values: 'espresso' | 'cold_brew' | 'pour_over' | 'tea' | 'seasonal' | 'other'
  -- Only 'espresso' drink_type exposes the shot selector in F02.
  has_customizations INTEGER NOT NULL DEFAULT 1 CHECK (has_customizations IN (0, 1)),
  -- 1 = show "Customize" CTA on card; 0 = show "Add to Cart" directly
  available         INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0, 1)),
  -- 0 = hidden from menu; 1 = visible
  sort_order        INTEGER NOT NULL DEFAULT 0,
  -- Lower values appear first within a category
  options_json      TEXT    NOT NULL DEFAULT '{}',
  -- JSON string. Shape:
  -- {
  --   "sizes": [{ "label": "Small", "delta": -0.50 }, { "label": "Medium", "delta": 0 }, { "label": "Large", "delta": 0.75 }],
  --   "milks": ["Whole", "Oat", "Almond", "Coconut", "Skim", "None"],
  --   "temperatures": ["Hot", "Iced", "Blended"],
  --   "shots": ["Single", "Double", "Triple"],  // null or omitted for non-espresso
  --   "extras": [{ "label": "Vanilla Syrup", "price": 0.75 }, { "label": "Caramel", "price": 0.75 }, ...]
  -- }
  created_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (available);
```

**Column Notes:**
- `base_price` is stored as `REAL` (SQLite float). Application code rounds to 2 decimal places.
- `options_json` stores `null` for `shots` when `drink_type != 'espresso'`.
- `sort_order` controls display sequence within a category (ascending).
- `has_customizations` = 0 for items like a plain batch brew that has no meaningful customization options beyond quantity.

---

### Table: `orders`

One row per submitted order. Orders are append-only (no updates or deletes in v1).

```sql
CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  subtotal    REAL    NOT NULL CHECK (subtotal > 0),
  notes       TEXT    NOT NULL DEFAULT '',
  -- Order-level special note (empty string if none; max 500 chars enforced in API)
  status      TEXT    NOT NULL DEFAULT 'received',
  -- Status values: 'received' only in v1 (future: 'preparing', 'ready', 'completed')
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
```

**Derived Fields (not stored, computed at query time):**
- `order_reference = 'BRW-' || printf('%05d', id)` — formatted in application code, not stored.

---

### Table: `order_items`

One row per line item in an order. Linked to `orders` via foreign key.

```sql
CREATE TABLE IF NOT EXISTS order_items (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id           INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id       INTEGER NOT NULL,
  -- Not a FK to menu_items — menu items may be edited/removed in future versions;
  -- order history must remain complete regardless.
  name               TEXT    NOT NULL,
  -- Denormalized drink name at time of order (preserves history if menu changes)
  unit_price         REAL    NOT NULL CHECK (unit_price > 0),
  -- Price per unit including size delta + add-on prices at time of order
  quantity           INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 10),
  customizations_json TEXT   NOT NULL DEFAULT '{}',
  -- JSON string. Shape:
  -- {
  --   "size": "Large",
  --   "milk": "Oat",
  --   "temperature": "Iced",
  --   "shots": "Double",
  --   "addons": ["Vanilla Syrup"],
  --   "specialInstructions": "Extra hot please"
  -- }
  created_at         TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
```

**Column Notes:**
- `menu_item_id` is stored for reference and analytics but is intentionally not a foreign key, allowing menu items to be archived/deleted without breaking order history.
- `name` and `unit_price` are denormalized at order time for immutable order records.
- `customizations_json` stores the full customization snapshot; each field is nullable within the JSON object.

---

### Seed Data Specification

The seed script runs when `SELECT COUNT(*) FROM menu_items` returns 0. It inserts 20–30 items. Representative sample:

```sql
-- Espresso Category (6 items)
INSERT INTO menu_items (name, description, base_price, category, drink_type, has_customizations, sort_order, options_json) VALUES
('Flat White',      'Velvety microfoam over a double ristretto. The barista''s choice.',     5.50, 'Espresso',  'espresso', 1, 10, '<espresso_options_json>'),
('Cortado',         'Equal parts espresso and warm milk, precision-pulled.',                  4.75, 'Espresso',  'espresso', 1, 20, '<espresso_options_json>'),
('Oat Milk Latte',  'Silky oat milk and a double shot. Our most-ordered drink.',             6.00, 'Espresso',  'espresso', 1, 30, '<espresso_options_json>'),
('Cappuccino',      'Classic dry foam over a rich double shot.',                             5.25, 'Espresso',  'espresso', 1, 40, '<espresso_options_json>'),
('Americano',       'Double shot over hot water. Clean, bold, uncomplicated.',               4.00, 'Espresso',  'espresso', 1, 50, '<espresso_options_json>'),
('Macchiato',       'A double shot with a dollop of stiff foam. Espresso-forward.',          4.50, 'Espresso',  'espresso', 1, 60, '<espresso_options_json>');

-- Cold Brew Category (4 items)
INSERT INTO menu_items (name, description, base_price, category, drink_type, has_customizations, sort_order, options_json) VALUES
('Classic Cold Brew','18-hour steep. Smooth, low-acid, endlessly drinkable.',               5.00, 'Cold Brew', 'cold_brew', 1, 10, '<cold_brew_options_json>'),
('Nitro Cold Brew',  'Cold brew on nitrogen tap. Creamy cascade, no ice needed.',           5.75, 'Cold Brew', 'cold_brew', 1, 20, '<cold_brew_options_json>'),
('Vanilla Cold Brew','Cold brew with house-made vanilla syrup. A crowd favourite.',         5.75, 'Cold Brew', 'cold_brew', 1, 30, '<cold_brew_options_json>'),
('Cold Brew Tonic',  'Cold brew over tonic water with a citrus twist.',                     6.00, 'Cold Brew', 'cold_brew', 1, 40, '<cold_brew_options_json>');

-- Pour-Over Category (4 items)
INSERT INTO menu_items (name, description, base_price, category, drink_type, has_customizations, sort_order, options_json) VALUES
('Ethiopia Yirgacheffe','Bright and floral. Blueberry and jasmine notes. V60 method.',     6.50, 'Pour-Over',  'pour_over', 0, 10, '<pour_over_options_json>'),
('Kenya AA',            'Bold citrus brightness. Full body. Chemex method.',              6.50, 'Pour-Over',  'pour_over', 0, 20, '<pour_over_options_json>'),
('Colombia Huila',      'Brown sugar sweetness, clean finish. All-day drinker.',          6.00, 'Pour-Over',  'pour_over', 0, 30, '<pour_over_options_json>'),
('Guatemala Antigua',   'Dark chocolate and stone fruit. Aeropress preparation.',         6.00, 'Pour-Over',  'pour_over', 0, 40, '<pour_over_options_json>');

-- Tea Category (4 items)
INSERT INTO menu_items (name, description, base_price, category, drink_type, has_customizations, sort_order, options_json) VALUES
('Matcha Latte',   'Ceremonial grade matcha with steamed oat milk. Earthy and vibrant.',  6.00, 'Tea', 'tea', 1, 10, '<tea_options_json>'),
('Hojicha Latte',  'Roasted green tea, low caffeine, warm and comforting.',               5.75, 'Tea', 'tea', 1, 20, '<tea_options_json>'),
('Chai Latte',     'House-spiced masala chai with steamed whole milk.',                   5.50, 'Tea', 'tea', 1, 30, '<tea_options_json>'),
('Earl Grey',      'Classic bergamot black tea. Served hot or iced.',                    4.50, 'Tea', 'tea', 1, 40, '<tea_options_json>');

-- Seasonal Category (3–4 items, rotated by season)
INSERT INTO menu_items (name, description, base_price, category, drink_type, has_customizations, sort_order, options_json) VALUES
('Lavender Honey Latte', 'House lavender syrup, local honey, oat milk.',                 7.00, 'Seasonal', 'espresso', 1, 10, '<espresso_options_json>'),
('Yuzu Cold Brew',       'Cold brew with Japanese yuzu citrus. Bright and floral.',      6.50, 'Seasonal', 'cold_brew', 1, 20, '<cold_brew_options_json>'),
('Cardamom Cortado',     'Double shot with cardamom-infused microfoam.',                 5.75, 'Seasonal', 'espresso', 1, 30, '<espresso_options_json>');
```

**Canonical `options_json` for each drink type:**

```json
// espresso_options_json
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
    { "label": "Vanilla Syrup",  "price": 0.75 },
    { "label": "Caramel",        "price": 0.75 },
    { "label": "Hazelnut",       "price": 0.75 },
    { "label": "Extra Shot",     "price": 1.00 },
    { "label": "Whipped Cream",  "price": 0.50 }
  ]
}

// cold_brew_options_json
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
    { "label": "Vanilla Syrup",  "price": 0.75 },
    { "label": "Caramel",        "price": 0.75 },
    { "label": "Whipped Cream",  "price": 0.50 }
  ]
}

// pour_over_options_json
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

// tea_options_json
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

### Entity Relationship Diagram (Text)

```
menu_items                orders               order_items
─────────────             ─────────            ────────────────────
id (PK)                   id (PK)              id (PK)
name                      subtotal             order_id (FK→orders.id)
description               notes                menu_item_id (no FK)
base_price                status               name
category                  created_at           unit_price
drink_type                                     quantity
has_customizations                             customizations_json
available                                      created_at
sort_order
options_json
created_at
```

`order_items.order_id` → `orders.id` (CASCADE DELETE)  
`order_items.menu_item_id` is a reference only, not enforced by FK.

---
