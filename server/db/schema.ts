import type Database from 'better-sqlite3';

export function createSchema(db: InstanceType<typeof Database>): void {
  // ============================================================
  // BrewAI SQLite Schema — v1.0
  // ============================================================

  // Table: menu_items
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        name                TEXT    NOT NULL,
        description         TEXT    NOT NULL DEFAULT '',
        base_price          REAL    NOT NULL CHECK (base_price > 0),
        category            TEXT    NOT NULL,
        drink_type          TEXT    NOT NULL DEFAULT 'other',
        has_customizations  INTEGER NOT NULL DEFAULT 1
                                    CHECK (has_customizations IN (0, 1)),
        available           INTEGER NOT NULL DEFAULT 1
                                    CHECK (available IN (0, 1)),
        sort_order          INTEGER NOT NULL DEFAULT 0,
        options_json        TEXT    NOT NULL DEFAULT '{}',
        created_at          TEXT    NOT NULL
                                    DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_menu_items_category  ON menu_items (category);
    CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (available);
    CREATE INDEX IF NOT EXISTS idx_menu_items_sort      ON menu_items (category, sort_order, name);
  `);

  // Table: orders
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        subtotal    REAL    NOT NULL CHECK (subtotal > 0),
        notes       TEXT    NOT NULL DEFAULT '',
        status      TEXT    NOT NULL DEFAULT 'received',
        created_at  TEXT    NOT NULL
                            DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
  `);

  // Table: order_items
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id            INTEGER NOT NULL
                                    REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id        INTEGER NOT NULL,
        name                TEXT    NOT NULL,
        unit_price          REAL    NOT NULL CHECK (unit_price > 0),
        quantity            INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 10),
        customizations_json TEXT    NOT NULL DEFAULT '{}',
        created_at          TEXT    NOT NULL
                                    DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
  `);
}
