---

## F01: Menu Browsing & Category Filtering

**Priority:** P0  
**Depends on:** F00 (Design System), F07 (REST API)  
**Required by:** F02 (Customization Modal), F03 (Cart)

---

### Description

The menu page is the primary customer-facing surface and the entry point to the ordering flow. It fetches all drink items from `GET /api/menu`, renders them in a responsive product card grid, and allows customers to filter by category and search by keyword in real time. The page must load and display content quickly, handle empty states gracefully, and present drinks in a visually rich, brand-consistent manner using the design system established in F00.

---

### Terminology

- **Category Filter Bar:** A row of pill-shaped toggle buttons (one per category + "All") that narrows the displayed items to a single category.
- **Active Filter:** The currently selected category; only one filter can be active at a time. "All" is active by default.
- **Search Query:** The text the customer has typed into the search input; filtered live against item `name` and `description`.
- **Product Card:** The visual tile that represents a single menu item — contains the drink name, short description, price, category badge, and CTA button.
- **CTA Button:** The primary action on a product card — "Customize" for espresso-based drinks (opens F02 modal), "Add to Cart" for simple drinks (adds directly with default options).
- **Stagger Animation:** A Framer Motion sequenced entrance where cards animate in one after another with a short delay between each.
- **Empty State:** The zero-results view shown when no items match the combined filter and search query.

---

### Sub-Features

- **F01.1 — Menu Fetch & Display:** On page mount, fetch all items from `GET /api/menu` and render each as a product card.
- **F01.2 — Category Filter Bar:** Render one pill button per category plus "All"; toggling a pill filters the visible items.
- **F01.3 — Keyword Search:** A search input at the top of the menu page that filters items by `name` and `description` fields in real time (debounced at 200ms).
- **F01.4 — Product Card:** The card component showing drink name (Playfair Display), short description (2-line clamp), price (amber accent), category badge, and CTA.
- **F01.5 — Loading State:** Skeleton card grid shown while the menu fetch is in-flight.
- **F01.6 — Empty State:** Message + illustration shown when filter/search combination returns zero items; includes a "Clear filters" action.
- **F01.7 — Card Entrance Animation:** Staggered `fadeIn` + `slideUp` on initial render (see F06 §Motion Variants).

---

### Process

1. User navigates to `/` (home/menu route).
2. React component mounts; Zustand menu store dispatches `fetchMenu()`.
3. `fetchMenu()` calls `GET /api/menu`; loading state is set to `true`.
4. While loading, 8 skeleton cards are displayed in the grid layout.
5. On success, menu items are stored in Zustand `menuStore`; loading state clears.
6. Category filter bar renders one pill per unique category value, plus an "All" pill (default active).
7. Cards animate in using the stagger variant (see F06).
8. User clicks a category pill → `activeCategory` state updates → displayed items re-filtered.
9. User types in the search input → after 200ms debounce, `searchQuery` state updates → displayed items re-filtered.
10. Applied filter = items where: `(activeCategory === 'All' OR item.category === activeCategory) AND (item.name OR item.description includes searchQuery, case-insensitive)`.
11. If filtered result is empty → empty state is shown with a "Clear filters" button that resets both `activeCategory` to `'All'` and `searchQuery` to `''`.
12. User clicks "Customize" on a card → F02 customization modal opens with that item's data.
13. User clicks "Add to Cart" on a card → item added to cart with default options (see F03 §Process); toast notification shown.
14. On `GET /api/menu` failure → error state shown with a "Retry" button that re-invokes `fetchMenu()`.

---

### Inputs

- `GET /api/menu` response — array of menu items (see `Y1-api.md §GET /api/menu`)
- `activeCategory` (string, internal state) — currently selected category name, default `'All'`
- `searchQuery` (string, internal state) — current search text, default `''`
- User interaction — category pill click, search input keystrokes, card CTA click

---

### Outputs

- Rendered menu grid of product cards (filtered by category and search)
- Loading skeleton grid during data fetch
- Empty state view when no items match
- Error state view when API call fails
- F02 modal opened with item data on "Customize" click
- Cart item added on "Add to Cart" click

---

### Validation

- Category pills are derived from the unique `category` values in the fetched menu data — they are never hardcoded in the frontend.
- Search filtering is case-insensitive and matches substrings in both `name` and `description`.
- Search debounce is exactly 200ms to avoid excessive re-renders on rapid keystrokes.
- The "All" pill is always rendered first, regardless of category sort order.
- At most one category filter is active at a time (single-select).
- Product card description is clamped at 2 lines via CSS `line-clamp-2`; full description is accessible in the customization modal.
- Price is always displayed to 2 decimal places with a `$` prefix: `$4.50`.
- If `hasCustomizations` is `true` on a menu item, the CTA reads "Customize"; otherwise it reads "Add to Cart".
- Menu items with `available: false` are not displayed.

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Behavior |
|----------|-------------|------------|----------------------|
| `GET /api/menu` network failure | — (network error) | `MENU_FETCH_FAILED` | Error message + "Retry" button replaces skeleton grid |
| `GET /api/menu` returns 500 | 500 | `INTERNAL_ERROR` | Same as above |
| No items in database (empty seed) | 200 (empty array) | — | Empty state with "No drinks available yet" message |
| Filter + search yields no results | 200 (filtered to empty) | — | Empty state with "No drinks match your search" + "Clear filters" |

---

### State Shape (Zustand `menuStore`)

```typescript
interface MenuStore {
  items: MenuItem[];           // All items from API
  categories: string[];        // Unique categories derived from items
  loading: boolean;            // True during API fetch
  error: string | null;        // Error message if fetch failed
  activeCategory: string;      // 'All' or a category name
  searchQuery: string;         // Current search string
  filteredItems: MenuItem[];   // Derived: items filtered by category + search
  fetchMenu: () => Promise<void>;
  setCategory: (category: string) => void;
  setSearch: (query: string) => void;
  clearFilters: () => void;
}
```

---

### Product Card Layout

```
┌─────────────────────────────┐
│  [Category Badge]           │
│                             │
│  Drink Name                 │  ← Playfair Display, 18px
│  Short description text     │  ← Inter, 14px, 2-line clamp
│  clamped to two lines here  │
│                             │
│  $4.50              [CTA]   │  ← price amber, CTA = primary Button
└─────────────────────────────┘
```

Card dimensions: full-width in grid cell; min-height `160px`.

---

### API Surface (this feature)

- `GET /api/menu` — fetch all available items; see `Y1-api.md §GET /api/menu`
- `GET /api/menu/categories` — fetch category list; see `Y1-api.md §GET /api/menu/categories`

---

### Schema Surface (this feature)

- Reads from `menu_items` table — see `Y0-schema.md §menu_items`
- Reads from (derived) categories via `SELECT DISTINCT category FROM menu_items`

---
