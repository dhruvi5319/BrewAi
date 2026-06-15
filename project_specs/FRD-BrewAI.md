# Functional Requirements Document
# BrewAI — Specialty Coffee Shop Web Application

**Version:** 1.0  
**Date:** 2026-06-15  
**Project Acronym:** BrewAI  
**Status:** Active  
**Generated from:** PRD-BrewAI.md v1.0  

---

## Scope

This document specifies the complete functional requirements for BrewAI v1 — a guest-only specialty coffee ordering web application. It covers every feature from F0 through F7 as defined in the PRD, with detailed inputs, outputs, validation rules, error states, API surface, and database schema. The target audience is developers implementing the application; every behaviour described here is unambiguous and directly implementable.

No authentication, no payment processing, and no AI/ML features are in scope for v1.

---

## Conventions

- **Feature IDs** follow the PRD: F0–F7. Each feature has a dedicated chunk file (`F00-*.md` … `F07-*.md`).
- **Cross-feature artifacts** live in separate files: `Y0-schema.md` (DDL), `Y1-api.md` (API catalog), `Y2-errors.md` (error catalog), `Y3-integrations.md` (integration points).
- **API format:** All responses use the envelope `{ "data": <payload>, "error": null|<ErrorObject>, "status": <httpCode> }`.
- **Field notation:** `fieldName` (type, required|optional, constraints). Example: `quantity` (integer, required, 1–10).
- **Error codes** are SCREAMING_SNAKE_CASE strings returned in `error.code`.
- **Cross-references** use `see F03 §Process` or `see Y1-api.md §Orders`.
- **Zero-padded IDs:** Feature chunks use two-digit padding (`F00`, `F01`, … `F07`) to guarantee correct lexicographic sort order.
- **Priority:** P0 = MVP-critical; P1 = production-quality required; all features in this doc are implemented in v1.

---

## Table of Contents

| Section | File | Description |
|---------|------|-------------|
| Header & Conventions | `00-header.md` | This file |
| F0: Design System | `F00-design-system.md` | Component foundation, tokens, fonts |
| F1: Menu Browsing | `F01-menu-browsing.md` | Menu grid, category filter, search |
| F2: Drink Customization | `F02-drink-customization.md` | Customization modal, options, pricing |
| F3: Cart Management | `F03-cart-management.md` | Cart drawer, quantities, subtotal |
| F4: Order Placement | `F04-order-placement.md` | Order submission, confirmation screen |
| F5: Responsive Layout | `F05-responsive-layout.md` | Navigation, breakpoints, touch targets |
| F6: Animations | `F06-animations.md` | Framer Motion variants, reduced-motion |
| F7: REST API | `F07-rest-api.md` | Express endpoints, SQLite persistence |
| Database Schema | `Y0-schema.md` | Full SQLite DDL |
| API Catalog | `Y1-api.md` | REST endpoints with request/response schemas |
| Error Catalog | `Y2-errors.md` | Cross-feature error codes and HTTP statuses |
| Integration Points | `Y3-integrations.md` | External dependency contracts |

---

## Cross-Cutting Terminology

| Term | Definition |
|------|-----------|
| **Canvas** | Page background color `#0A0A0A` |
| **Surface** | Card/panel background color `#141414` |
| **Surface Raised** | Elevated element background `#1C1C1C` (modals, dropdowns) |
| **Accent** | Primary interactive color `#C8922A` (amber) |
| **Text Primary** | Main readable text color `#F5F0E8` |
| **Menu Item** | A single drink product in the SQLite menu table |
| **Cart Item** | A menu item placed in the Zustand cart with selected customizations |
| **Line Item** | An ordered item in a submitted order record |
| **Order** | A persisted record in SQLite created when the customer places their cart |
| **Order Reference** | Human-readable unique ID shown on confirmation screen (e.g., `BRW-00042`) |
| **Customization** | The set of options (size, milk, temperature, shots, extras, note) applied to a cart item |
| **Session** | Browser tab lifetime — cart state is in-memory (Zustand) and does not survive page refresh |
| **Seed Data** | Initial 20–30 menu items inserted into SQLite when the database is freshly initialized |
| **Envelope** | Standard JSON response shape: `{ data, error, status }` |
| **Toast** | Transient notification that auto-dismisses after ~3 seconds |
| **Drawer** | Slide-in panel (cart, mobile menu) that overlays the main content |
| **P0** | MVP-critical priority — must be complete before v1 ships |
| **P1** | Production-quality priority — implemented alongside P0, not deferred |

---

## Design System Tokens (Cross-Feature Reference)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-canvas` | `#0A0A0A` | `<html>` and `<body>` background |
| `--color-surface` | `#141414` | Cards, panels |
| `--color-surface-raised` | `#1C1C1C` | Modals, dropdowns, elevated sheets |
| `--color-accent` | `#C8922A` | CTAs, focus rings, selected states |
| `--color-text-primary` | `#F5F0E8` | All readable text |
| `--color-text-muted` | `#9CA3AF` | Secondary/helper text |
| `--color-border` | `#2A2A2A` | Card and input borders |
| `--color-error` | `#EF4444` | Error messages and icons |
| `--color-success` | `#22C55E` | Success states |
| `--radius-input` | `6px` | Text inputs, selects |
| `--radius-card` | `12px` | Product cards, cart items |
| `--radius-pill` | `20px` | Category filter buttons, tags |
| `--font-display` | Playfair Display | Drink names, display headings |
| `--font-body` | Inter | Body text, labels, buttons |
| `--transition-default` | `150ms ease-in-out` | All interactive state transitions |
| `--transition-motion` | `200ms ease-out` | Framer Motion entrance/exit |
| `--focus-ring` | `2px solid #C8922A` | Keyboard focus indicator |

---
---

## F00: Design System & Component Foundation

**Priority:** P0  
**Depends on:** None  
**Required by:** F01, F02, F03, F04, F05, F06

---

### Description

The design system is the shared visual and interactive language that all other features consume. It defines every color token, typography scale, spacing unit, border radius, and animation duration exactly once — in `tailwind.config.ts` and a small set of primitive React components. All downstream features reference these primitives exclusively; no feature file may hardcode a color value, font family, or radius outside the Tailwind config. Inter and Playfair Display fonts are bundled as local static assets so they are never fetched from an external CDN at runtime.

---

### Terminology

- **Design Token:** A named variable (color, spacing, radius, font) that maps a semantic name to a concrete value. Tokens are defined in `tailwind.config.ts` under `theme.extend`.
- **Primitive Component:** A thin, styled wrapper around an HTML element (`Button`, `Input`, `Badge`, `Card`, `Modal`, `Spinner`, `Select`) that enforces the design system and exposes a typed props API.
- **Variant:** A named style permutation of a primitive component (e.g., `Button` variants: `primary`, `secondary`, `ghost`, `danger`).
- **Motion Variant:** A Framer Motion `variants` object defining `initial`, `animate`, and `exit` states for a shared animation (e.g., `fadeIn`, `slideUp`, `scaleIn`).
- **Focus Ring:** The 2px solid amber outline (`#C8922A`) applied on `:focus-visible` to all interactive elements for keyboard accessibility.

---

### Sub-Features

- **F00.1 — Tailwind Config Extension:** All design tokens defined in `tailwind.config.ts`; no hardcoded values outside this file.
- **F00.2 — Font Bundling:** Inter and Playfair Display served from the Express static `/assets/fonts/` path; declared in a global CSS `@font-face` block.
- **F00.3 — Primitive Components:** `Button`, `Badge`, `Card`, `Input`, `Select`, `Modal`, `Spinner` implemented as typed React components.
- **F00.4 — Global Base Styles:** `<html>` and `<body>` set to `background: #0A0A0A`; default font `Inter`; `box-sizing: border-box`; smooth scroll.
- **F00.5 — Shared Motion Variants:** Framer Motion `variants` objects exported from a single `src/lib/motion.ts` file for use across all features.
- **F00.6 — Focus Ring Global Style:** Tailwind `ring` utilities configured; all interactive elements receive `focus-visible:ring-2 focus-visible:ring-accent` via component defaults.

---

### Process

1. At build time, Vite processes `tailwind.config.ts`; all custom tokens become available as Tailwind utility classes (e.g., `bg-canvas`, `text-primary`, `border-accent`).
2. The global CSS file (`src/index.css`) declares `@font-face` rules pointing to `/assets/fonts/inter-*.woff2` and `/assets/fonts/playfair-*.woff2`.
3. Express serves `/assets/fonts/` as a static directory so fonts load over HTTP from the same origin.
4. On first render, React initializes the component tree using only design-system primitives — no raw `<div style={{...}}>` with hardcoded values.
5. Any interactive element rendered by a primitive automatically receives the focus ring via the shared `className` prop defaults.
6. Any animated element imports its `variants` from `src/lib/motion.ts` and wraps content in a `motion.*` component.

---

### Inputs

- `tailwind.config.ts` — defines all color, font, radius, and spacing tokens
- Font files (`.woff2`) — placed in `public/assets/fonts/` and copied to `dist/assets/fonts/` by Vite
- Component prop types — each primitive exports a TypeScript `interface` defining its accepted props

---

### Outputs

- Extended Tailwind utility classes available globally across all TSX files
- Bundled font files served at `/assets/fonts/*.woff2`
- Typed primitive component exports from `src/components/ui/index.ts`
- Shared motion variants exported from `src/lib/motion.ts`

---

### Primitive Component Specifications

#### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and padding |
| `disabled` | `boolean` | `false` | Disables interaction; applies opacity |
| `loading` | `boolean` | `false` | Shows `Spinner`; disables interaction |
| `onClick` | `() => void` | — | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `className` | `string` | `''` | Additional Tailwind classes |
| `children` | `ReactNode` | — | Button label/content |

- `primary`: `bg-accent text-canvas font-semibold hover:bg-amber-600 active:scale-[0.97]`
- `secondary`: `bg-surface-raised text-primary border border-border hover:border-accent`
- `ghost`: `bg-transparent text-muted hover:text-primary`
- `danger`: `bg-error/10 text-error border border-error/30 hover:bg-error/20`
- Min height: `44px` on all sizes (touch target compliance)

#### Badge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'accent' \| 'muted' \| 'success' \| 'error'` | `'accent'` | Color variant |
| `children` | `ReactNode` | — | Badge label |

- Border radius: `20px` (pill)
- Font: Inter, 12px, semibold

#### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional Tailwind classes |
| `onClick` | `() => void` | optional | Makes card interactive (adds hover state) |
| `children` | `ReactNode` | — | Card content |

- Background: `#141414`; border: `1px solid #2A2A2A`; border-radius: `12px`; padding: `16px`

#### Input

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Visible label above input |
| `error` | `string` | — | Validation error message below input |
| `placeholder` | `string` | — | Placeholder text |
| `value` | `string` | — | Controlled value |
| `onChange` | `(e) => void` | — | Change handler |
| `maxLength` | `number` | — | Character limit |
| `type` | `string` | `'text'` | HTML input type |

- Border-radius: `6px`; border: `1px solid #2A2A2A`; background: `#141414`; text: `#F5F0E8`
- Focus: `ring-2 ring-accent`; error: `border-error`

#### Select

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Visible label |
| `options` | `{ value: string; label: string }[]` | — | Options list |
| `value` | `string` | — | Selected value |
| `onChange` | `(value: string) => void` | — | Change handler |

#### Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Called on Escape or backdrop click |
| `title` | `string` | — | Modal heading |
| `children` | `ReactNode` | — | Modal body content |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Max-width variant |

- Backdrop: `bg-canvas/80 backdrop-blur-sm`; modal: `bg-surface-raised rounded-[12px]`
- `Escape` keydown calls `onClose`; backdrop click calls `onClose`
- Focus trapped inside modal while open

#### Spinner

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Icon size |
| `className` | `string` | `''` | Additional classes |

- Renders an animated SVG ring using `animate-spin`; color `text-accent`

---

### Validation

- No raw color hex values (`#...`) in `.tsx` or `.ts` files outside `tailwind.config.ts` and `src/index.css`
- All font references use the Tailwind font-family utility (`font-display`, `font-body`), never inline `fontFamily` style props
- TypeScript strict mode is enabled (`"strict": true` in `tsconfig.json`); all component props are explicitly typed
- No `any` type in production code (enforced via TSConfig; `@ts-expect-error` only as last resort with comment)
- Each primitive component has a default `aria-label` or expects one via props for icon-only variants

---

### Error States

| Scenario | Behavior | User-Facing Message |
|----------|----------|---------------------|
| Font files missing from `/assets/fonts/` | Browser falls back to system sans-serif; no hard error | (silent fallback — no user message) |
| Component rendered without required prop | TypeScript compile error prevents build | Build fails with type error |
| Tailwind class purged in production | Element renders unstyled | (visual regression — caught by visual testing) |

---

### API Surface (this feature)

None — F00 is a frontend-only concern. No API endpoints.

---

### Schema Surface (this feature)

None — F00 does not interact with the database.

---
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
- At most one category filter is active at a time (single-select). Clicking the currently active category pill a second time resets the filter to "All".
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
| Filter + search yields no results | 200 (filtered to empty) | — | Empty state with "No drinks match your search. Try 'cold brew' or browse All." + "Clear filters" button |

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
---

## F02: Drink Customization Modal

**Priority:** P0  
**Depends on:** F00 (Design System), F01 (Menu Browsing — provides item data)  
**Required by:** F03 (Cart Management — receives customized cart items)

---

### Description

When a customer taps "Customize" on a menu item card, a modal dialog opens presenting all customization controls relevant to that specific drink type. Options (size, milk, temperature, shot count, extras) are driven by the item's `customization_options` data from SQLite — so drinks that don't support espresso shots won't show the shot selector. The customer selects their preferences, sees the price update in real time, sets a quantity, and clicks "Add to Cart". The modal is fully keyboard-accessible, closes on Escape or backdrop click, and animates in/out with Framer Motion.

---

### Terminology

- **Size Delta:** The price adjustment (positive or negative, relative to base price) associated with a particular size selection. Example: Small = −$0.50, Medium = $0.00, Large = +$0.75.
- **Add-on:** An optional extra item the customer can select on top of their drink (e.g., vanilla syrup, whipped cream). Each add-on has a fixed price increment.
- **Multi-select:** The add-ons control allows zero or more selections simultaneously (checkboxes or toggle chips).
- **Special Instructions:** A free-text textarea for any additional requests (e.g., "extra hot", "no foam"). Max 200 characters.
- **Real-time Price:** The running total displayed in the modal that updates immediately as any option changes: `(base_price + size_delta + sum(add-on prices)) × quantity`.
- **Quantity Stepper:** A paired decrement/increment control that adjusts item quantity from 1 to 10.
- **hasCustomizations flag:** A boolean on the `menu_items` table. `true` if the item has at least one customizable dimension beyond quantity alone.

---

### Sub-Features

- **F02.1 — Modal Open/Close:** Modal opens when "Customize" is clicked on a product card; closes on Escape, backdrop click, or the explicit "×" close button.
- **F02.2 — Size Selection:** Radio-style selector for Small / Medium / Large with price delta shown alongside each option.
- **F02.3 — Milk Type Selection:** Radio-style selector for milk options applicable to this drink (Whole, Oat, Almond, Coconut, Skim, None).
- **F02.4 — Temperature Selection:** Radio-style selector for Hot / Iced / Blended where the drink supports it.
- **F02.5 — Shot Count Selection:** Radio-style selector for Single / Double / Triple, shown only for espresso-based drinks (`drink_type = 'espresso'`).
- **F02.6 — Add-ons / Extras:** Multi-select chip/checkbox group for optional add-ons. Each chip shows the add-on name and price.
- **F02.7 — Special Instructions:** Textarea with 200-character limit and live character counter.
- **F02.8 — Real-time Price Display:** Dynamic total that recalculates on every option change.
- **F02.9 — Quantity Stepper:** Increment/decrement control (1–10) with ARIA labels.
- **F02.10 — Add to Cart Action:** Validates all required selections, adds item to Zustand cart store, closes modal, shows toast.

---

### Process

1. User clicks "Customize" on a product card in F01.
2. `selectedItem` is set in component state (or passed as prop); modal `isOpen` becomes `true`.
3. Modal animates in (`scaleIn` + `fadeIn`; see F06).
4. Modal fetches item customization options from `GET /api/menu/:id` (or uses cached data from Zustand `menuStore` if already loaded).
5. Default selections are applied: "Medium" size if available in the item's sizes list, otherwise the first size in the list; first milk option; first temperature; "Double" shots for espresso; no add-ons; no special instructions; quantity = 1.
6. Real-time price initializes to `base_price + default_size_delta`.
7. User selects a size → `selectedSize` updates → real-time price recalculates.
8. User selects a milk type → `selectedMilk` updates (no price impact in v1).
9. User selects a temperature → `selectedTemperature` updates (no price impact in v1).
10. User selects shot count (espresso drinks only) → `selectedShots` updates (no price impact in v1).
11. User toggles an add-on chip → add-on added to or removed from `selectedAddons[]` → price recalculates.
12. User types in special instructions → `specialInstructions` updates with character count displayed.
13. User adjusts quantity stepper → `quantity` updates (range 1–10) → price recalculates.
14. User clicks "Add to Cart":
    a. Validate all required selections present (size is required; all others optional per item config).
    b. Build `CartItem` object (see F03 §State Shape).
    c. Dispatch `cartStore.addItem(cartItem)`.
    d. Modal closes with exit animation.
    e. Toast notification: "Item added to cart" (see F06 §Toast Animation).
15. User presses Escape or clicks backdrop → modal closes with exit animation; no cart change.
16. User clicks "×" close button → same as Escape.

---

### Inputs

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `selectedSize` | `string` | Yes | One of the sizes defined in `item.options.sizes` |
| `selectedMilk` | `string` | No | One of `['Whole', 'Oat', 'Almond', 'Coconut', 'Skim', 'None']` per item config |
| `selectedTemperature` | `string` | No | One of `['Hot', 'Iced', 'Blended']` per item config |
| `selectedShots` | `string` | No | One of `['Single', 'Double', 'Triple']`; only for `drink_type = 'espresso'` |
| `selectedAddons` | `string[]` | No | Subset of item's `extras` list; default `[]` |
| `specialInstructions` | `string` | No | Max 200 characters; default `''` |
| `quantity` | `integer` | Yes | Range 1–10; default `1` |

---

### Outputs

- A `CartItem` object added to Zustand `cartStore` (see F03 §State Shape)
- Modal closed with exit animation
- Toast: "Item added to cart" with item name

---

### Real-time Price Formula

```
displayPrice = (base_price + size_delta) + sum(selected_addons[i].price)
totalPrice   = displayPrice × quantity
```

Both `displayPrice` (per-item) and `totalPrice` (quantity × per-item) are shown in the modal footer.

---

### Customization Options Data Shape (from API)

```typescript
interface ItemOptions {
  sizes: { label: string; delta: number }[];       // e.g., [{label:'Small', delta:-0.50}, ...]
  milks: string[];                                  // e.g., ['Whole','Oat','Almond','Coconut','Skim','None']
  temperatures: string[];                           // e.g., ['Hot','Iced','Blended']
  shots: string[] | null;                           // null if not espresso-based
  extras: { label: string; price: number }[];       // e.g., [{label:'Vanilla Syrup', price:0.75}]
}
```

This data is embedded in the `GET /api/menu/:id` response inside the `options` field, stored as JSON in `menu_items.options_json`.

---

### Validation

- `selectedSize` must be one of the item's defined sizes; "Add to Cart" button is disabled until a size is selected (size defaults to the first option so the button is never blocked by this in practice).
- `quantity` must be an integer in the range [1, 10]; the stepper prevents values outside this range.
- `specialInstructions` length must not exceed 200 characters; the textarea blocks additional input at the limit and shows a counter in red when ≤ 10 characters remain.
- At least one option must differ from defaults for the modal to show a meaningful customization — but no validation blocks "Add to Cart" on this; it is purely informational.
- If `item.options.shots` is `null`, the shot selector section is not rendered.
- If `item.options.milks` is an empty array, the milk selector section is not rendered.
- If `item.options.temperatures` has only one value, it is shown as a static read-only label, not a selector.
- Add-on selection is always multi-select; selecting an already-selected add-on deselects it.

---

### Error States

| Scenario | Behavior | User-Facing Message |
|----------|----------|---------------------|
| `GET /api/menu/:id` fails to load options | Modal shows with skeleton loaders for option sections; "Add to Cart" button disabled | "Could not load customization options. Please try again." with Retry button |
| `cartStore.addItem` throws (quota/storage error) | Toast error | "Could not add item to cart. Please try again." |
| User enters >200 chars in special instructions | Input capped; counter turns red | "200 characters maximum" |
| Modal opened with undefined item | Modal does not open; console error logged | (no user-facing message — defensive guard) |

---

### Accessibility

- Modal uses `role="dialog"` and `aria-modal="true"`
- Modal title bound to `aria-labelledby`
- Focus is trapped inside the modal while open (Tab cycles through interactive elements)
- Focus returns to the triggering "Customize" button when modal closes
- Quantity stepper buttons have `aria-label="Increase quantity"` / `aria-label="Decrease quantity"`
- Close button has `aria-label="Close customization dialog"`
- All radio-style selectors use `<fieldset>` + `<legend>` grouping

---

### API Surface (this feature)

- `GET /api/menu/:id` — fetch single item with full options; see `Y1-api.md §GET /api/menu/:id`

---

### Schema Surface (this feature)

- Reads `menu_items.options_json` — see `Y0-schema.md §menu_items`

---
---

## F03: Cart Management

**Priority:** P0  
**Depends on:** F00 (Design System), F02 (Drink Customization — produces cart items)  
**Required by:** F04 (Order Placement — consumes cart state)

---

### Description

The cart is a persistent in-session store (Zustand) that accumulates the items a customer has customized and intends to order. It is accessible from any page via the cart icon in the navigation bar. The cart drawer (slide-over panel on desktop, full-screen on mobile) lists all items with their customization summaries, allows quantity adjustments and item removal, displays the running subtotal, and provides the "Place Order" action that leads to F04.

---

### Terminology

- **Cart Item:** A single entry in the cart representing one menu item with a specific set of customizations. A customer can add the same drink twice with different customizations — each is a distinct `CartItem` with a unique `cartItemId`.
- **Cart Item ID:** A client-generated UUID (`crypto.randomUUID()`) assigned when an item is added to the cart; used to target updates and removals.
- **Customization Summary:** A compact human-readable string summarizing the selected options, displayed under the drink name in the cart (e.g., "Large · Oat · Iced · Vanilla Syrup").
- **Subtotal:** Sum of `(unit_price × quantity)` for all cart items. No tax, service fee, or tip in v1.
- **Clear Cart:** Removes all items from the cart simultaneously; requires a confirmation prompt before executing.
- **Empty Cart State:** The view shown when the cart has no items; includes a CTA linking back to the menu page.

---

### Sub-Features

- **F03.1 — Cart Icon Badge:** Navigation bar icon (Lucide `ShoppingCart`) with an animated count badge showing total item count (sum of all quantities).
- **F03.2 — Cart Drawer:** A slide-in panel opened by clicking the cart icon; lists all cart items.
- **F03.3 — Cart Line Item:** Each item row showing drink name, customization summary, unit price, quantity stepper, and remove button.
- **F03.4 — Quantity Stepper (in-cart):** Increment/decrement for each line item. Decrementing to 0 removes the item.
- **F03.5 — Remove Item:** An explicit "×" or trash icon button per line item that removes it regardless of quantity.
- **F03.6 — Subtotal Display:** Live-calculated subtotal in the cart footer, formatted `$XX.XX`.
- **F03.7 — Clear Cart:** A "Clear Cart" text button that triggers a confirmation modal/prompt before removing all items.
- **F03.8 — Empty Cart State:** Shown when cart has no items; includes "Browse Menu" link.
- **F03.9 — Place Order CTA:** "Place Order" button in the cart footer; disabled when cart is empty; triggers F04.

---

### Process

**Adding an Item (from F02 or direct "Add to Cart"):**
1. F02 dispatches `cartStore.addItem(cartItem)` with a fully formed `CartItem` object.
2. Zustand store appends the item to `items[]` array (or merges if identical customizations — see Merge Rule below).
3. Cart badge count updates with a pop animation (see F06 §Cart Badge Animation).
4. Toast notification slides in: "[Drink Name] added to cart" (3-second auto-dismiss).

**Cart Merge Rule:** Two items are considered identical and merged if they share the same `menuItemId`, `size`, `milk`, `temperature`, `shots`, `addons` (same set, order-insensitive), and `specialInstructions`. If identical, the existing item's `quantity` is incremented by the new item's `quantity` (capped at 10). If not identical, a new `CartItem` entry is added.

**Viewing the Cart:**
1. User clicks cart icon in navigation bar.
2. Cart drawer animates in (slide from right on desktop, slide up on mobile; see F06).
3. Drawer renders all `CartItem` entries; if empty, renders empty state.
4. Cart overlay (`bg-canvas/50`) dims the main content behind the drawer.
5. User can close drawer by clicking the "×" button, pressing Escape, or clicking the backdrop overlay. On mobile (`< md`), the drawer uses `fixed inset-0` (full-screen) so there is no visible backdrop area — close is available via the "×" button and Escape key only.

**Adjusting Quantity:**
1. User clicks "+" → `cartStore.updateQuantity(cartItemId, currentQty + 1)`.
2. Validated to max 10; button disabled at 10.
3. User clicks "−" → if `currentQty > 1`, decrement; if `currentQty === 1`, call `cartStore.removeItem(cartItemId)`.

**Removing an Item:**
1. User clicks "×" / trash button on a line item.
2. `cartStore.removeItem(cartItemId)` called immediately (no confirmation for single item).
3. Item animates out of the list (fade + slide; see F06).
4. If cart becomes empty, empty state is shown.

**Clearing the Cart:**
1. User clicks "Clear Cart".
2. Confirmation prompt: "Remove all items from your cart?" with "Cancel" and "Clear All" buttons.
3. On "Clear All" → `cartStore.clearCart()` → all items removed; empty state shown.
4. On "Cancel" → prompt dismissed; no change.

**Subtotal Calculation:**
- Recalculates on every store mutation.
- Formula: `subtotal = items.reduce((sum, item) => sum + item.unitPrice × item.quantity, 0)`.
- Displayed as `$XX.XX` (always 2 decimal places, USD).

---

### Inputs

| Action | Input | Constraints |
|--------|-------|-------------|
| Add Item | `CartItem` object from F02 | All fields required; see CartItem shape below |
| Update Quantity | `cartItemId` (UUID), `quantity` (integer) | 1–10 |
| Remove Item | `cartItemId` (UUID) | Must exist in cart |
| Clear Cart | User confirmation | No data input beyond confirmation |

---

### Outputs

- Updated `items[]` array in Zustand `cartStore`
- Updated `totalCount` (sum of all quantities)
- Updated `subtotal` (derived from items)
- Cart badge count reflected in navigation
- Toast notification on item added

---

### State Shape (Zustand `cartStore`)

```typescript
interface CartItem {
  cartItemId: string;          // crypto.randomUUID()
  menuItemId: number;          // References menu_items.id
  name: string;                // Drink name (denormalized for display)
  unitPrice: number;           // Price per unit including size delta + addons
  quantity: number;            // 1–10
  customizations: {
    size: string;
    milk: string | null;
    temperature: string | null;
    shots: string | null;
    addons: string[];          // Array of add-on labels
    specialInstructions: string;
  };
}

interface CartStore {
  items: CartItem[];
  totalCount: number;          // Derived: sum of item.quantity
  subtotal: number;            // Derived: sum of item.unitPrice × item.quantity
  isOpen: boolean;             // Whether cart drawer is visible
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}
```

---

### Customization Summary Format

The summary string is derived from selected customizations:

```
[Size] · [Milk] · [Temperature] · [Shots] · [Addon1], [Addon2]
```

Rules:
- Fields with `null` or empty value are omitted from the summary string.
- Add-ons are joined with `, ` (comma-space).
- Special instructions are not shown in the summary string (full display in a tooltip or expanded view is out of scope for v1).
- Example: `"Large · Oat · Iced · Vanilla Syrup, Caramel"`

---

### Validation

- `quantity` is always an integer in [1, 10]; the stepper enforces this; the Zustand action clamps if called programmatically.
- `cartItemId` must be a valid UUID string; items with missing/undefined `cartItemId` are rejected with a console error.
- `unitPrice` must be a positive number > 0.
- `subtotal` must be ≥ 0 at all times (enforced by derivation — items array can only contain positive-price items).
- Cart state is NOT persisted to `localStorage` or `sessionStorage` in v1; it is lost on page refresh. This is a known, accepted constraint.
- "Place Order" button in the cart footer is disabled (and visually muted) when `items.length === 0`.

---

### Error States

| Scenario | Behavior | User-Facing Message |
|----------|----------|---------------------|
| `addItem` called with invalid/incomplete `CartItem` | Item rejected; console error logged | Toast: "Could not add item. Please try again." |
| `updateQuantity` called with out-of-range value | Value clamped to [1, 10]; no error shown | (silent correction) |
| `removeItem` called with unknown `cartItemId` | No-op; console warning logged | (no user-facing message) |
| Cart is empty on "Place Order" click | Button is disabled; click has no effect | Button appears greyed out (no message needed — visual affordance) |

---

### Accessibility

- Cart icon button: `aria-label="Open cart, N items"` where N is `totalCount`
- Cart drawer: `role="dialog"`, `aria-modal="true"`, `aria-label="Your cart"`
- Quantity stepper buttons: `aria-label="Increase quantity for [Drink Name]"` / `aria-label="Decrease quantity for [Drink Name]"`
- Remove button: `aria-label="Remove [Drink Name] from cart"`
- "Clear Cart" button: `aria-label="Clear all items from cart"`
- Focus management: when drawer opens, focus moves to the first interactive element; when it closes, focus returns to the cart icon

---

### API Surface (this feature)

None — cart is client-side only. Order submission is handled by F04.

---

### Schema Surface (this feature)

None — cart state is in-memory (Zustand). Order persistence is handled by F04/F07.

---
---

## F04: Order Placement & Confirmation

**Priority:** P0  
**Depends on:** F00 (Design System), F03 (Cart Management — provides items), F07 (REST API — persists order)  
**Required by:** None (terminal step in the ordering flow)

---

### Description

Order placement is the final step in the core ordering loop. The customer reviews their full cart, clicks "Place Order", and the application submits the order to the Express backend via `POST /api/orders`. Upon a successful response, the cart is cleared and the customer is navigated to an order confirmation screen displaying a human-readable order reference number, an itemized summary, and an estimated ready time of "15–20 minutes". No payment is collected; the confirmation represents intent to pick up. If submission fails, an inline error with a retry option is shown without losing the cart.

---

### Terminology

- **Order Reference:** A human-readable, zero-padded order identifier displayed to the customer, formatted `BRW-NNNNN` (e.g., `BRW-00042`). Derived from the database `orders.id` field.
- **Order Payload:** The JSON body sent to `POST /api/orders` containing the serialized cart items and metadata.
- **Confirmation Screen:** The full-page (or routed) view shown after a successful order submission, replacing the cart view.
- **Estimated Ready Time:** A static string `"15–20 minutes"` displayed on the confirmation screen; not computed dynamically in v1.
- **New Order CTA:** A button on the confirmation screen that clears the cart and navigates back to the menu.

---

### Sub-Features

- **F04.1 — Place Order Button:** "Place Order" button in the cart drawer footer; disabled when cart is empty.
- **F04.2 — Submission Loading State:** Spinner replaces button text during API call; button disabled.
- **F04.3 — API Order Submission:** Serializes cart items into `OrderPayload` and POSTs to `/api/orders`.
- **F04.4 — Success Flow:** Clears cart, navigates to confirmation screen, displays order reference and summary.
- **F04.5 — Error Flow:** Inline error message with retry option; cart preserved.
- **F04.6 — Confirmation Screen:** Displays order reference, itemized list, estimated time, and "New Order" CTA.

---

### Process

1. Customer reviews cart in F03 drawer; clicks "Place Order".
2. System validates cart is non-empty (button is disabled if empty; no API call made).
3. Button enters loading state: spinner shown, button text replaced with "Placing order…", button disabled.
4. System builds `OrderPayload` from current `cartStore.items` (see Payload Shape below).
5. System calls `POST /api/orders` with `OrderPayload` as request body.
6. **On success (HTTP 201):**
   a. `cartStore.clearCart()` — removes all items from Zustand store.
   b. Cart drawer closes.
   c. Router navigates to `/confirmation` (or renders confirmation view inline, replacing cart).
   d. Confirmation screen renders with data from the API response: `order_reference`, itemized summary, timestamp.
7. **On API error (HTTP 4xx / 5xx / network failure):**
   a. Loading state cleared; button re-enabled.
   b. Inline error message rendered below the "Place Order" button.
   c. Cart remains unchanged (items not lost).
   d. "Try Again" button visible — re-invokes step 4 without any other change.
8. Customer views confirmation screen.
9. Customer clicks "New Order":
   a. Navigates to `/` (menu page).
   b. Cart already cleared in step 6a; menu reloads from cache or re-fetches.

---

### Order Payload Shape

```typescript
interface OrderPayload {
  items: OrderLineItem[];
  subtotal: number;              // Total before any fees (no tax in v1)
  notes: string;                 // Optional order-level note (empty string if none)
}

interface OrderLineItem {
  menuItemId: number;
  name: string;                  // Denormalized drink name
  unitPrice: number;
  quantity: number;
  customizations: {
    size: string;
    milk: string | null;
    temperature: string | null;
    shots: string | null;
    addons: string[];
    specialInstructions: string;
  };
}
```

---

### API Response Shape (success)

```typescript
// HTTP 201 Created
{
  data: {
    orderId: number;             // Database primary key
    orderReference: string;      // "BRW-00042" format
    createdAt: string;           // ISO 8601 timestamp
    items: OrderLineItem[];      // Echo of submitted line items
    subtotal: number;
  },
  error: null,
  status: 201
}
```

---

### Confirmation Screen Layout

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓  Order Placed!

  Your order reference:
  BRW-00042

  Ready in approximately 15–20 minutes

  ─────────────────────────────────────
  Order Summary
  ─────────────────────────────────────
  • Large Oat Latte × 2          $12.50
    Large · Oat · Iced
  • Vanilla Cold Brew × 1        $5.75
    Large · Iced · Vanilla Syrup
  ─────────────────────────────────────
  Subtotal                       $18.25

       [ Start a New Order ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- Confirmation icon: Lucide `CheckCircle2` in `text-success` color
- Order reference: Playfair Display, 28px, `text-accent`
- Estimated time: Inter, 14px, `text-muted`
- "Start a New Order" button: `variant="primary"`, full-width on mobile

---

### Inputs

| Field | Type | Source | Constraints |
|-------|------|--------|-------------|
| `items` | `OrderLineItem[]` | `cartStore.items` | Non-empty array; each item validated (see F03) |
| `subtotal` | `number` | `cartStore.subtotal` | > 0 |
| `notes` | `string` | Always `""` in v1 — no UI collects an order-level note; the field is included in the payload schema for future extensibility | Max 500 chars; always sent as empty string from the client in v1 |

---

### Outputs

- HTTP `POST /api/orders` request with `OrderPayload`
- On success: `orderId`, `orderReference`, `createdAt` from API response
- Cart cleared (`cartStore.clearCart()`)
- Navigation to confirmation screen
- Confirmation screen rendered with order details

---

### Validation

- "Place Order" button is disabled (not just visually styled) when `cartStore.items.length === 0`.
- `OrderPayload.items` must be non-empty; if somehow empty, client shows an error without calling the API.
- `subtotal` must be > 0; derived from cart so this is guaranteed if items are present.
- `orderReference` format validation (client-side display only): must match `/^BRW-\d{5}$/`; if not matching, display raw `orderId` as fallback.
- On confirmation screen, `orderId` is stored in component state (or URL param `/confirmation?ref=BRW-00042`) for display; no Zustand persistence needed.

---

### Order Reference Format

`orderReference` is constructed server-side:

```
BRW-{zero-padded orderId to 5 digits}
```

Examples: `BRW-00001`, `BRW-00042`, `BRW-10000`.

If `orderId > 99999`, the reference becomes `BRW-{orderId}` without padding (no truncation).

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Behavior |
|----------|-------------|------------|----------------------|
| Network failure (no response) | — | `ORDER_NETWORK_ERROR` | "Could not reach the server. Check your connection and try again." + Retry |
| Server error | 500 | `INTERNAL_ERROR` | "Something went wrong placing your order. Please try again." + Retry |
| Empty cart submitted (defensive) | 400 | `EMPTY_ORDER` | "Your cart is empty." (client prevents this; shown only if guard bypassed) |
| Invalid payload | 400 | `INVALID_PAYLOAD` | "Invalid order data. Please refresh and try again." |
| Duplicate submission (double-click) | 201 (idempotent) or 409 | — | Button disabled during in-flight request; double submission prevented by loading state |

---

### Accessibility

- "Place Order" button: `aria-disabled="true"` when cart is empty (not `disabled` attribute alone, to allow focus for screen readers)
- Loading state: `aria-busy="true"` on the button during submission
- Confirmation screen: focus moves to the confirmation heading on navigation (`autofocus` on the main heading)
- "Start a New Order" button: `aria-label="Start a new order and return to menu"`
- Success icon: `aria-hidden="true"` (decorative); success state announced via `role="status"` live region

---

### API Surface (this feature)

- `POST /api/orders` — submit new order; see `Y1-api.md §POST /api/orders`
- `GET /api/orders/:id` — retrieve order by ID (for future extensibility; displayed on confirmation screen); see `Y1-api.md §GET /api/orders/:id`

---

### Schema Surface (this feature)

- Writes to `orders` table and `order_items` table — see `Y0-schema.md §orders` and `Y0-schema.md §order_items`

---
---

## F05: Responsive Layout & Navigation

**Priority:** P1  
**Depends on:** F00 (Design System)  
**Required by:** F01, F02, F03, F04 (all features consume the layout)

---

### Description

The application must be fully functional and visually polished across every viewport from 320px (smallest modern mobile) to 1920px (large desktop). Navigation provides consistent access to the menu and cart at all screen sizes, adapting its presentation: a horizontal top bar on desktop and a compact header on mobile. Menu grids reflow across breakpoints, cart drawers shift from full-screen overlays to slide-over panels, and every tap target meets the 44×44px minimum. No horizontal scroll appears at any supported width.

---

### Terminology

- **Breakpoint:** A CSS min-width threshold at which the layout shifts. BrewAI uses Tailwind's default breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).
- **Viewport Width Range:** Minimum supported: 320px. Maximum designed for: 1920px.
- **Top Bar:** The fixed navigation bar shown at `md` and above; contains logo, nav links, and cart icon.
- **Compact Header:** The simplified navigation bar shown below `md`; contains logo and cart icon only (no nav links); category filters are placed below the header in a horizontal scroll strip.
- **Touch Target:** Any interactive element; minimum 44×44px on mobile per WCAG 2.5.5.
- **Horizontal Scroll Strip:** A single-row scrollable container for category filter pills on mobile; scrolls horizontally without page-level overflow.

---

### Sub-Features

- **F05.1 — Top Navigation Bar (Desktop):** Full-width fixed header at `md+` with logo (left), navigation links (center or right), and cart icon with badge (right).
- **F05.2 — Compact Header (Mobile):** Fixed header at `< md` with logo (left) and cart icon (right); no nav links.
- **F05.3 — Category Filter Scroll Strip (Mobile):** Below the compact header, category pills scroll horizontally with `overflow-x: auto; scrollbar-width: none` to hide the scrollbar.
- **F05.4 — Responsive Menu Grid:** 1 column at `< sm`, 2 columns at `sm–lg`, 3 columns at `lg–xl`, 4 columns at `2xl+`.
- **F05.5 — Cart Drawer Adaptation:** Drawer is full-screen (100vw × 100vh) on `< md`; slide-over (fixed right, 400px wide) on `md+`.
- **F05.6 — Customization Modal Adaptation:** Modal is bottom-sheet style (full-width, 90vh max) on `< md`; centered dialog (max-width 600px) on `md+`.
- **F05.7 — Touch Target Enforcement:** All buttons, links, and interactive elements have `min-height: 44px; min-width: 44px` enforced via Tailwind utilities or CSS.
- **F05.8 — No Horizontal Overflow:** `overflow-x: hidden` on `<body>` and `<html>`; all content containers use `max-w-screen-*` or percentage widths; no fixed-pixel widths that could overflow at 320px.

---

### Process

**Navigation Rendering:**
1. On mount, the `Navigation` component renders once — Tailwind responsive utilities control the visible variant.
2. The top bar is hidden below `md` (`hidden md:flex`); the compact header is hidden at `md+` (`flex md:hidden`).
3. The cart icon is rendered in both layouts; it references the same `cartStore.totalCount` for the badge.

**Category Filter on Mobile:**
1. Below `md`, the category filter bar renders inside a `div` with `overflow-x-auto` and `flex` layout.
2. Pills do not wrap — they scroll horizontally as a single row.
3. The "All" pill is always first; active pill is scrolled into view on selection (`scrollIntoView({ behavior: 'smooth', inline: 'nearest' })`).

**Menu Grid Reflow:**
1. The menu grid container uses Tailwind responsive grid classes: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`.
2. Card images (or illustration placeholders) scale fluidly with `w-full aspect-video object-cover`.
3. On 320px viewport, the single-column layout uses full container width with 16px horizontal padding.

**Cart Drawer Adaptation:**
1. Below `md`, cart drawer uses `fixed inset-0` (full screen); a close button is required in the top-right.
2. At `md+`, cart drawer uses `fixed right-0 top-0 h-full w-[400px]`; backdrop covers remaining viewport.
3. The transition animation differs (see F06 §Cart Drawer Animation).

**Customization Modal Adaptation:**
1. Below `md`, modal uses `fixed bottom-0 left-0 right-0 max-h-[90vh]` with `rounded-t-[20px]` for the bottom-sheet style.
2. At `md+`, modal uses `fixed inset-0 flex items-center justify-center` with a centered content box `max-w-[600px] w-full mx-4`.

---

### Inputs

- Viewport width (browser-native, read via Tailwind responsive classes — no JS `window.innerWidth` polling needed)
- `cartStore.totalCount` — for badge rendering in both navigation variants
- User interactions — scroll, click, touch

---

### Outputs

- Correct layout variant rendered for the current viewport width
- No horizontal scroll at any supported width
- All interactive elements meet 44×44px touch target minimum

---

### Breakpoint Behavior Summary

| Viewport | Grid Cols | Navigation | Cart Drawer | Customization Modal |
|----------|-----------|------------|-------------|---------------------|
| 320px–639px (`< sm`) | 1 | Compact header | Full-screen | Bottom sheet |
| 640px–767px (`sm`) | 2 | Compact header | Full-screen | Bottom sheet |
| 768px–1023px (`md`) | 2 | Top bar | Slide-over 400px | Centered dialog |
| 1024px–1279px (`lg`) | 3 | Top bar | Slide-over 400px | Centered dialog |
| 1280px–1535px (`xl`) | 3 | Top bar | Slide-over 400px | Centered dialog |
| 1536px+ (`2xl`) | 4 | Top bar | Slide-over 400px | Centered dialog |

---

### Validation

- No `width`, `min-width`, or `left`/`right` values hardcoded in pixels that would cause overflow at 320px viewport width.
- The category filter strip must not create page-level horizontal scroll; it uses `overflow-x-auto` scoped to its own container.
- Cart badge count must be visible in both the compact header and the top bar at all times.
- Logo must be visible and not clipped at 320px viewport width; max logo width: `120px` on mobile.
- All text in the top bar must not overflow at 1920px width; content must remain within `max-w-screen-xl` (1280px) centered container.
- Framer Motion animation variants must differ per viewport size (see F06) — no shared fixed-direction animations that break on layout shift.

---

### Error States

| Scenario | Behavior | User-Facing Message |
|----------|----------|---------------------|
| Viewport < 320px | Layout may degrade; not a supported width | (no message — out of supported range) |
| Viewport > 1920px | Layout works but is not specifically optimized | Content remains centered within max-width |
| JavaScript disabled | Tailwind responsive classes still apply; layout is correct | React won't render — outside scope |

---

### API Surface (this feature)

None — layout and navigation are frontend-only.

---

### Schema Surface (this feature)

None.

---
---

## F06: Animated Interactions & Micro-Animations

**Priority:** P1  
**Depends on:** F00 (Design System — provides motion variant definitions)  
**Required by:** F01, F02, F03, F04, F05 (all features consume animations)

---

### Description

All meaningful UI state changes are animated using Framer Motion, creating a polished, premium feel consistent with the BrewAI brand. Animations are purposeful, fast (150–200ms), and provide visual feedback without adding perceived latency. All animations unconditionally respect the `prefers-reduced-motion` OS/browser setting — when reduced motion is preferred, all animations are disabled and elements appear instantly. Shared `variants` objects are defined once in `src/lib/motion.ts` and imported by all feature components.

---

### Terminology

- **Motion Variant:** A Framer Motion `variants` object with named states (`initial`, `animate`, `exit`). Defined in `src/lib/motion.ts`.
- **Stagger:** A parent Framer Motion container that introduces a sequential delay (`staggerChildren`) between child element animations, creating a cascading entrance effect.
- **prefers-reduced-motion:** A CSS media query (`@media (prefers-reduced-motion: reduce)`) and corresponding Framer Motion hook (`useReducedMotion()`) that signals the user prefers less animation.
- **Transition:** The Framer Motion `transition` object specifying `duration`, `ease`, and `delay` for a given animation.
- **Toast:** A transient notification that slides into view from the bottom-right corner and auto-dismisses after 3 seconds.

---

### Sub-Features

- **F06.1 — Shared Motion Variants File:** `src/lib/motion.ts` exports all named variants.
- **F06.2 — Reduced Motion Guard:** All `motion.*` components check `useReducedMotion()` and set `initial={false}` / no exit animations when true.
- **F06.3 — Menu Card Entrance:** Stagger fade-in + slide-up for the product card grid on initial load.
- **F06.4 — Customization Modal Animation:** Scale-in + fade-in on open; reverse on close.
- **F06.5 — Cart Drawer Animation:** Slide from right (desktop) or slide up (mobile) on open; reverse on close.
- **F06.6 — Cart Badge Pop:** Scale pulse animation when `totalCount` changes.
- **F06.7 — Button Press Feedback:** Active scale-down on button press.
- **F06.8 — Page Transitions:** Fade between route changes.
- **F06.9 — Toast Notification:** Slide-in from bottom-right on "Item added to cart"; auto-dismiss fade-out.
- **F06.10 — Cart Item Removal:** Fade-out + slide-left when an item is removed from the cart list.

---

### Shared Motion Variants (`src/lib/motion.ts`)

```typescript
import { Variants } from 'framer-motion';

// Card fade-in + slide-up (used by menu grid children)
export const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

// Stagger container (used as parent of menu card grid)
export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.05 } },
};

// Modal scale-in + fade (used by customization modal)
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1,   transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

// Modal backdrop fade
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

// Cart drawer slide-in from right (desktop)
export const drawerRightVariants: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { x: '100%', transition: { duration: 0.15 } },
};

// Cart drawer slide-up from bottom (mobile)
export const drawerUpVariants: Variants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { y: '100%', transition: { duration: 0.15 } },
};

// Toast slide-in from bottom-right
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 40, x: 0 },
  animate: { opacity: 1, y: 0,  x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: 20,        transition: { duration: 0.15 } },
};

// Cart item removal (fade-out + slide-left)
export const cartItemExitVariants: Variants = {
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

// Page transition (fade)
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};
```

---

### Process

**Reduced Motion Guard:**
1. Each animated component imports `useReducedMotion` from `framer-motion`.
2. If `useReducedMotion()` returns `true`, the component renders with `initial={false}` and omits `exit` variants.
3. Elements appear and disappear instantly with no animation.

**Menu Card Entrance:**
1. `motion.div` with `staggerContainer` wraps the card grid; `initial="initial" animate="animate"`.
2. Each product card is a `motion.div` with `cardVariants`.
3. On filter change or search change, `AnimatePresence` with `mode="popLayout"` handles card reordering/removal.
4. Cards added to the grid animate in; removed cards animate out via `exit`.

**Customization Modal Animation:**
1. `AnimatePresence` wraps the modal; `isOpen` controls presence.
2. Backdrop uses `backdropVariants`; modal content uses `modalVariants`.
3. On Escape or close, `isOpen` → `false`; `AnimatePresence` runs exit animations before unmounting.

**Cart Drawer Animation:**
1. Viewport width determines which variant is used (see F05 §Cart Drawer Adaptation).
2. Below `md`: `drawerUpVariants`; at `md+`: `drawerRightVariants`.
3. `AnimatePresence` wraps the drawer; `cartStore.isOpen` controls presence.

**Cart Badge Pop:**
1. `totalCount` change is detected via `useEffect` watching `cartStore.totalCount`.
2. On change, a brief `scale` keyframe animation fires on the badge element: `[1, 1.3, 1]` over 300ms.
3. Implemented via Framer Motion `animate` prop with keyframe array, or via CSS `@keyframes` triggered by class toggle.

**Button Press Feedback:**
1. All `Button` primitives (F00) use `whileTap={{ scale: 0.97 }}` on the `motion.button` wrapper.
2. Duration: `100ms` (snappier than standard transitions for tactile feel).

**Toast Notification:**
1. A `ToastProvider` component at the root level maintains a list of active toasts (max 3 visible simultaneously).
2. `addToast(message, type)` is called by feature components (e.g., after `cartStore.addItem`).
3. Each toast animates in via `toastVariants`.
4. After 3 seconds, the toast automatically calls its removal function → exit animation plays → unmounts.
5. Toasts stack vertically in the bottom-right corner (`fixed bottom-4 right-4 flex flex-col gap-2`).

**Page Transitions:**
1. React Router `<Routes>` is wrapped with `AnimatePresence mode="wait"`.
2. Each route's top-level component is wrapped in `motion.div` with `pageVariants`.
3. `mode="wait"` ensures the exiting page fully fades out before the entering page fades in.

---

### Inputs

- `useReducedMotion()` — boolean from browser preference
- Component mount/unmount lifecycle — triggers `AnimatePresence`
- `cartStore.totalCount` — triggers badge pop
- `addToast(message, type)` call — triggers toast

---

### Outputs

- Animated entrance/exit of menu cards, modals, drawers, toasts, cart items
- Badge pop on count change
- Page fade transitions
- Instant appearance/disappearance when `prefers-reduced-motion` is set

---

### Animation Timing Reference

| Animation | Duration | Easing | Variant Name |
|-----------|----------|--------|--------------|
| Card entrance | 200ms | easeOut | `cardVariants` |
| Stagger delay between cards | 50ms | — | `staggerContainer` |
| Modal open | 200ms | easeOut | `modalVariants` |
| Modal close | 150ms | default | `modalVariants.exit` |
| Backdrop fade | 150ms | default | `backdropVariants` |
| Cart drawer open | 200ms | easeOut | `drawerRightVariants` / `drawerUpVariants` |
| Cart drawer close | 150ms | default | exit state |
| Toast slide-in | 200ms | easeOut | `toastVariants` |
| Toast fade-out | 150ms | default | `toastVariants.exit` |
| Cart item removal | 150ms | default | `cartItemExitVariants` |
| Page fade | 200ms | default | `pageVariants` |
| Badge pop | 300ms | spring | keyframe `[1, 1.3, 1]` |
| Button press | 100ms | default | `whileTap` |

---

### Validation

- `useReducedMotion()` is checked in every animated component — no animation plays when it returns `true`.
- All durations are in the range 100ms–300ms; no animation exceeds 300ms.
- `AnimatePresence` is used anywhere elements conditionally mount/unmount to ensure exit animations play.
- The stagger delay (`staggerChildren: 0.05`) is capped so that for grids with 30+ cards, the last card starts animating within 1.5 seconds of the first.
- Toast max-visible count is 3; older toasts are removed when a 4th is added.
- Button `whileTap` scale never goes below 0.95.

---

### Error States

| Scenario | Behavior |
|----------|----------|
| `framer-motion` not installed or import error | React render error; app fails to render — this is a build-time error caught by TypeScript |
| `useReducedMotion()` unavailable (SSR context) | Default to no animation (safe fallback) |
| Animation variant key not found | Framer Motion silently ignores missing variants; element renders unanimated |

---

### API Surface (this feature)

None.

---

### Schema Surface (this feature)

None.

---
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
- `has_customizations` = 0 for items like pour-overs that offer only size selection (no milk, temperature variation, shots, or extras worth surfacing in a modal). These items show an "Add to Cart" CTA that adds with the default (first) size and no other customizations applied. If a future pour-over item warrants a size-selection modal, set `has_customizations = 1`.

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
---

## REST API Catalog

**File:** `Y1-api.md`  
**Owned by:** F07 (REST API & Data Persistence)  
**Consumed by:** F01 (menu), F04 (orders)

---

### Base URL

- **Development:** `http://localhost:3000`
- **Production:** Same origin as the frontend (Express serves both at `http://0.0.0.0:3000`)

### Common Response Envelope

Every endpoint returns this top-level shape:

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

interface ApiError {
  code: string;       // SCREAMING_SNAKE_CASE error identifier
  message: string;    // Human-readable description
  field?: string;     // Present on validation errors; names the offending field
}
```

### Common HTTP Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

---

## Endpoints

---

### GET /api/menu

Returns all available menu items sorted by category and sort_order.

**Request**

```
GET /api/menu
```

No query parameters, no request body.

**Response 200 OK**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Flat White",
      "description": "Velvety microfoam over a double ristretto. The barista's choice.",
      "basePrice": 5.50,
      "category": "Espresso",
      "drinkType": "espresso",
      "hasCustomizations": true,
      "available": true,
      "sortOrder": 10,
      "options": {
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
      },
      "createdAt": "2026-06-15T00:00:00.000Z"
    }
    // ... 19–29 more items
  ],
  "error": null,
  "status": 200
}
```

**Response field mapping (DB column → JSON key):**

| DB Column | JSON Key |
|-----------|----------|
| `id` | `id` |
| `name` | `name` |
| `description` | `description` |
| `base_price` | `basePrice` |
| `category` | `category` |
| `drink_type` | `drinkType` |
| `has_customizations` | `hasCustomizations` (boolean) |
| `available` | `available` (boolean) |
| `sort_order` | `sortOrder` |
| `options_json` (parsed) | `options` |
| `created_at` | `createdAt` |

**Error Responses:**

| Condition | Status | Error Code |
|-----------|--------|------------|
| Database read error | 500 | `DB_READ_ERROR` |

---

### GET /api/menu/categories

Returns the list of distinct category names for available items, sorted alphabetically.

**Request**

```
GET /api/menu/categories
```

No query parameters, no request body.

**Response 200 OK**

```json
{
  "data": ["Cold Brew", "Espresso", "Pour-Over", "Seasonal", "Tea"],
  "error": null,
  "status": 200
}
```

**Error Responses:**

| Condition | Status | Error Code |
|-----------|--------|------------|
| Database read error | 500 | `DB_READ_ERROR` |

---

### GET /api/menu/:id

Returns a single menu item by its database ID, with full customization options.

**Request**

```
GET /api/menu/3
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | positive integer | Menu item database ID |

**Response 200 OK**

```json
{
  "data": {
    "id": 3,
    "name": "Oat Milk Latte",
    "description": "Silky oat milk and a double shot. Our most-ordered drink.",
    "basePrice": 6.00,
    "category": "Espresso",
    "drinkType": "espresso",
    "hasCustomizations": true,
    "available": true,
    "sortOrder": 30,
    "options": {
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
    },
    "createdAt": "2026-06-15T00:00:00.000Z"
  },
  "error": null,
  "status": 200
}
```

**Error Responses:**

| Condition | Status | Error Code |
|-----------|--------|------------|
| `id` is not a positive integer | 400 | `INVALID_ID` |
| Item not found or `available = 0` | 404 | `ITEM_NOT_FOUND` |
| Database read error | 500 | `DB_READ_ERROR` |

---

### POST /api/orders

Submits a new order. Persists the order and all line items atomically in a single SQLite transaction. Returns the created order with its reference number.

**Request**

```
POST /api/orders
Content-Type: application/json
```

**Request Body:**

```json
{
  "items": [
    {
      "menuItemId": 3,
      "name": "Oat Milk Latte",
      "unitPrice": 6.75,
      "quantity": 2,
      "customizations": {
        "size": "Large",
        "milk": "Oat",
        "temperature": "Iced",
        "shots": "Double",
        "addons": ["Vanilla Syrup"],
        "specialInstructions": "Extra hot please"
      }
    },
    {
      "menuItemId": 7,
      "name": "Nitro Cold Brew",
      "unitPrice": 5.75,
      "quantity": 1,
      "customizations": {
        "size": "Medium",
        "milk": "None",
        "temperature": "Iced",
        "shots": null,
        "addons": [],
        "specialInstructions": ""
      }
    }
  ],
  "subtotal": 19.25,
  "notes": ""
}
```

**Request Body Field Validation:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `items` | array | Yes | Non-empty; max 50 line items |
| `items[].menuItemId` | integer | Yes | > 0 |
| `items[].name` | string | Yes | 1–200 chars |
| `items[].unitPrice` | number | Yes | > 0; rounded to 2dp |
| `items[].quantity` | integer | Yes | 1–10 |
| `items[].customizations` | object | Yes | Must be present |
| `items[].customizations.size` | string | Yes | 1–50 chars |
| `items[].customizations.milk` | string\|null | No | Max 50 chars |
| `items[].customizations.temperature` | string\|null | No | Max 50 chars |
| `items[].customizations.shots` | string\|null | No | Max 20 chars |
| `items[].customizations.addons` | string[] | No | Max 10 items; each max 100 chars |
| `items[].customizations.specialInstructions` | string | No | Max 200 chars |
| `subtotal` | number | Yes | > 0 |
| `notes` | string | No | Max 500 chars; empty string accepted |

**Response 201 Created**

```json
{
  "data": {
    "orderId": 42,
    "orderReference": "BRW-00042",
    "createdAt": "2026-06-15T14:32:00.000Z",
    "subtotal": 19.25,
    "status": "received",
    "items": [
      {
        "id": 83,
        "menuItemId": 3,
        "name": "Oat Milk Latte",
        "unitPrice": 6.75,
        "quantity": 2,
        "customizations": {
          "size": "Large",
          "milk": "Oat",
          "temperature": "Iced",
          "shots": "Double",
          "addons": ["Vanilla Syrup"],
          "specialInstructions": "Extra hot please"
        }
      },
      {
        "id": 84,
        "menuItemId": 7,
        "name": "Nitro Cold Brew",
        "unitPrice": 5.75,
        "quantity": 1,
        "customizations": {
          "size": "Medium",
          "milk": "None",
          "temperature": "Iced",
          "shots": null,
          "addons": [],
          "specialInstructions": ""
        }
      }
    ]
  },
  "error": null,
  "status": 201
}
```

**Error Responses:**

| Condition | Status | Error Code | Notes |
|-----------|--------|------------|-------|
| `items` is empty or missing | 400 | `EMPTY_ORDER` | — |
| Required field missing | 400 | `INVALID_PAYLOAD` | `field` key names the missing field |
| Field fails validation | 400 | `INVALID_PAYLOAD` | `field` key names the invalid field |
| SQLite transaction error | 500 | `DB_WRITE_ERROR` | Transaction is rolled back |

---

### GET /api/orders/:id

Retrieves a stored order by its database ID. Intended for the confirmation screen and future extensibility.

**Request**

```
GET /api/orders/42
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | positive integer | Order database ID |

**Response 200 OK**

```json
{
  "data": {
    "orderId": 42,
    "orderReference": "BRW-00042",
    "createdAt": "2026-06-15T14:32:00.000Z",
    "subtotal": 19.25,
    "status": "received",
    "notes": "",
    "items": [
      {
        "id": 83,
        "menuItemId": 3,
        "name": "Oat Milk Latte",
        "unitPrice": 6.75,
        "quantity": 2,
        "customizations": {
          "size": "Large",
          "milk": "Oat",
          "temperature": "Iced",
          "shots": "Double",
          "addons": ["Vanilla Syrup"],
          "specialInstructions": "Extra hot please"
        }
      }
    ]
  },
  "error": null,
  "status": 200
}
```

**Error Responses:**

| Condition | Status | Error Code |
|-----------|--------|------------|
| `id` is not a positive integer | 400 | `INVALID_ID` |
| Order not found | 404 | `ORDER_NOT_FOUND` |
| Database read error | 500 | `DB_READ_ERROR` |

---

### Endpoint Summary

| Method | Path | Feature | Purpose | Auth Required |
|--------|------|---------|---------|---------------|
| `GET` | `/api/menu` | F01, F07 | Fetch full menu | None |
| `GET` | `/api/menu/categories` | F01, F07 | Fetch category list | None |
| `GET` | `/api/menu/:id` | F02, F07 | Fetch single item | None |
| `POST` | `/api/orders` | F04, F07 | Create new order | None |
| `GET` | `/api/orders/:id` | F04, F07 | Retrieve order | None |

---
---

## Cross-Feature Error Catalog

**File:** `Y2-errors.md`  
**Scope:** All BrewAI v1 features (F00–F07)

---

### Overview

This catalog lists every named error code used across the application. Error codes are:
- **SCREAMING_SNAKE_CASE** strings
- Returned in the API envelope as `error.code` for server-side errors
- Used as internal identifiers for client-side error states
- Never exposed as raw exception messages; all user-facing messages are explicitly defined below

---

### API Error Codes (Server-Side)

These are returned in `{ error: { code, message, field? }, status }` from Express endpoints.

| Code | HTTP Status | Endpoint(s) | Description | User-Facing Message |
|------|-------------|-------------|-------------|---------------------|
| `INVALID_ID` | 400 | `GET /api/menu/:id`, `GET /api/orders/:id` | Route parameter `id` is not a positive integer | "Invalid request. Please try again." |
| `ITEM_NOT_FOUND` | 404 | `GET /api/menu/:id` | No menu item exists with given ID, or item is unavailable | "This item is no longer available." |
| `EMPTY_ORDER` | 400 | `POST /api/orders` | `items` array is empty or missing | "Your order is empty." |
| `INVALID_PAYLOAD` | 400 | `POST /api/orders` | One or more required fields are missing or fail validation | "Invalid order data: {field}" |
| `ORDER_NOT_FOUND` | 404 | `GET /api/orders/:id` | No order exists with given ID | "Order not found." |
| `DB_READ_ERROR` | 500 | `GET /api/menu`, `GET /api/menu/:id`, `GET /api/orders/:id` | SQLite read failed (e.g., locked, corrupt) | "Could not retrieve data. Please try again." |
| `DB_WRITE_ERROR` | 500 | `POST /api/orders` | SQLite write failed; transaction rolled back | "Could not save your order. Please try again." |
| `NOT_FOUND` | 404 | All unmatched routes | No route matched the request path | "Endpoint not found." |
| `INTERNAL_ERROR` | 500 | Any endpoint (catch-all) | Unexpected server error caught by global error middleware | "Something went wrong. Please try again." |

---

### Client-Side Error States

These error states are handled entirely in the frontend and do not involve API error codes.

| Error ID | Feature | Trigger | User-Facing Message | Recovery Action |
|----------|---------|---------|---------------------|-----------------|
| `MENU_FETCH_FAILED` | F01 | `GET /api/menu` network failure or 5xx (maps to server-side `DB_READ_ERROR` or network error) | "Could not load the menu. Please check your connection." | "Retry" button re-fetches menu |
| `ITEM_OPTIONS_LOAD_FAILED` | F02 | `GET /api/menu/:id` failure in customization modal | "Could not load customization options. Please try again." | "Retry" button in modal |
| `CART_ADD_FAILED` | F02, F03 | `cartStore.addItem()` throws unexpectedly | "Could not add item to cart. Please try again." | Toast auto-dismisses; user can retry manually |
| `CART_EMPTY_SUBMIT` | F04 | "Place Order" clicked with empty cart (defensive) | (Button is disabled — message not shown) | N/A — button disabled |
| `ORDER_SUBMIT_NETWORK` | F04 | `POST /api/orders` network failure | "Could not reach the server. Check your connection and try again." | "Try Again" button re-submits |
| `ORDER_SUBMIT_FAILED` | F04 | `POST /api/orders` returns 4xx or 5xx | "Something went wrong placing your order. Please try again." | "Try Again" button re-submits |
| `CHAR_LIMIT_EXCEEDED` | F02 | User types beyond 200-char special instructions limit | "200 characters maximum" (inline below textarea) | Input is blocked at limit |
| `INVALID_QUANTITY` | F02, F03 | Quantity stepper reaches limit boundary | (Stepper button is disabled — no message needed) | Button visually disabled |

---

### Error Display Patterns

| Pattern | When Used | Example |
|---------|-----------|---------|
| **Full-page error state** | Menu fetch failure on initial load | Error illustration + message + "Retry" button replaces the card grid |
| **Inline error** | Order submission failure in cart | Error message shown directly below the "Place Order" button |
| **Toast** | Transient add-to-cart errors | Slides in from bottom-right; auto-dismisses in 3 seconds |
| **Disabled button** | Empty cart, quantity at limit | Visual affordance only; no error message needed |
| **Inline field error** | Textarea character limit | Red counter text appears beneath the textarea |
| **Modal error state** | Options load failure in customization modal | Skeleton loaders remain; error message + Retry shown inside modal |

---

### Error Logging

- All server-side errors caught by global error middleware are logged to `console.error` with the full stack trace.
- Client-side fetch errors are logged to `console.error` with the error object.
- No external error reporting service is integrated in v1 (Sentry, Datadog, etc. deferred).

---

### Non-Error Behavior (Zero States)

These are not errors — they are expected empty-data conditions:

| Condition | Feature | Display |
|-----------|---------|---------|
| Menu items filtered to zero results | F01 | Empty state: "No drinks match your search. Try 'cold brew' or browse All." + "Clear filters" link |
| Fresh database (no menu items) | F01 | Empty state: "No drinks available yet" (should not occur after seed) |
| Cart is empty | F03 | Empty cart state: "Your cart is empty" + "Browse Menu" link |
| Order history retrieval returns 404 | F04 | Redirect to menu page with a toast: "Order not found" |

---
---

## Integration Points

**File:** `Y3-integrations.md`  
**Scope:** All external dependencies and integration contracts for BrewAI v1

---

### Overview

BrewAI v1 has intentionally minimal external dependencies. There are no third-party API calls, no payment gateways, no authentication providers, and no CDN runtime fetches. All integrations are package-level (npm) or tooling-level (build, Docker). This section documents every external dependency and the constraints governing its use.

---

### npm Package Dependencies (Frontend)

| Package | Version Constraint | Purpose | Sandbox Note |
|---------|-------------------|---------|--------------|
| `react` | `^18.x` | UI component framework | — |
| `react-dom` | `^18.x` | React DOM renderer | — |
| `typescript` | `^5.x` | Type safety | — |
| `vite` | `^5.x` | Build tool and dev server | — |
| `@vitejs/plugin-react` | `^4.x` | React fast-refresh for Vite | — |
| `tailwindcss` | `^3.x` | Utility-first CSS | v3 only — not v4 |
| `autoprefixer` | `^10.x` | PostCSS vendor prefixing | — |
| `postcss` | `^8.x` | CSS processing pipeline | — |
| `zustand` | `^4.x` | Client-side state management | — |
| `framer-motion` | `^11.x` | UI animation library | Dynamic import recommended to keep initial chunk small |
| `lucide-react` | `^0.x` | Icon set (tree-shakeable) | Import individual icons, not the full package |
| `@fontsource/inter` | `^5.x` | Bundled Inter font (woff2) | Replaces Google Fonts CDN |
| `@fontsource/playfair-display` | `^5.x` | Bundled Playfair Display font (woff2) | Replaces Google Fonts CDN |

**Font Bundling Contract:**
- `@fontsource/inter` and `@fontsource/playfair-display` are imported in `src/index.css` or `src/main.tsx`.
- These packages include pre-converted `.woff2` files that Vite bundles into `dist/assets/`.
- No `@import url('https://fonts.googleapis.com/...')` is ever added to any CSS file.
- Alternative: self-host `.woff2` files under `public/assets/fonts/` if `@fontsource` packages introduce issues.

---

### npm Package Dependencies (Backend)

| Package | Version Constraint | Purpose | Sandbox Note |
|---------|-------------------|---------|--------------|
| `express` | `^4.x` | HTTP server framework | — |
| `better-sqlite3` | `^9.x` | Synchronous SQLite driver | Requires native binary; see note below |
| `cors` | `^2.x` | CORS middleware | — |
| `@types/express` | `^4.x` | Express TypeScript types | devDependency |
| `@types/better-sqlite3` | `^7.x` | better-sqlite3 TypeScript types | devDependency |
| `@types/cors` | `^2.x` | cors TypeScript types | devDependency |
| `tsx` | `^4.x` | TypeScript execution for dev | devDependency; not in production |
| `ts-node` | `^10.x` | Alternative TS executor | devDependency; either tsx or ts-node |

**`better-sqlite3` Binary Compatibility Contract:**
- Must be pinned to a version that ships pre-built binaries for **Node.js 20 on Debian** (`node:20-bookworm-slim`).
- If pre-built binaries are unavailable, the `Dockerfile` must run `npm rebuild better-sqlite3 --build-from-source` after `npm install`. The Debian base image includes the necessary build tools (python3, make, gcc) or they can be installed via `apt-get`.
- **Never use `node:20-alpine`** — the Alpine base is not on the sandbox allowlist and lacks compatible build tools.

---

### Build Tool Integration

| Tool | Config File | Contract |
|------|-------------|---------|
| Vite | `vite.config.ts` | Build target: `src/main.tsx`; output: `dist/`; dev port: `5173`; API proxy: `/api → http://localhost:3000` in dev mode |
| TypeScript | `tsconfig.json` | Strict mode: `true`; no `any` in production code; path aliases configured via `vite.config.ts` |
| Tailwind CSS | `tailwind.config.ts` | Content glob: `['./index.html', './src/**/*.{ts,tsx}']`; theme extended with design tokens (see `00-header.md §Design System Tokens`) |
| PostCSS | `postcss.config.js` | Plugins: `tailwindcss`, `autoprefixer` |

**Vite Dev Proxy Contract:**
In development, Vite proxies `/api/*` requests to `http://localhost:3000/api/*` so the frontend dev server (port 5173) and the Express backend (port 3000) work together without CORS issues:

```typescript
// vite.config.ts (development only)
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
},
```

In production, both frontend and backend are served from Express on port 3000:
- `GET /api/*` → Express API handlers
- All other routes → `dist/index.html` (SPA fallback)

---

### Docker / Container Integration

| Item | Contract |
|------|---------|
| Base image | `node:20-bookworm-slim` (Debian 12) — never Alpine |
| Port | `EXPOSE 3000`; app binds `0.0.0.0:3000` |
| Build command | `npm run build` (Vite production build) |
| Start command | `node dist-server/server.js` or `node server.js` |
| SQLite file | Stored at `./data/brewai.db` inside container; mountable as a named volume for persistence |
| Font assets | Bundled into `dist/assets/` by Vite; served statically by Express |
| npm registry | `https://registry.npmjs.org` (default); no custom registry |
| No curl/wget | All dependencies resolved via `npm install`; no binary download scripts |

**Dockerfile Checklist:**
1. `FROM node:20-bookworm-slim`
2. `WORKDIR /app`
3. `COPY package*.json ./`
4. `RUN npm ci --omit=dev` (or `npm install` if devDeps needed for build)
5. `RUN npm run build` (Vite build)
6. If `better-sqlite3` native compile needed: `RUN apt-get update && apt-get install -y python3 make g++ && npm rebuild better-sqlite3`
7. `EXPOSE 3000`
8. `CMD ["node", "server.js"]`

---

### External Services (None in v1)

BrewAI v1 has **zero** external service integrations:

| Service Type | Status | Reason |
|-------------|--------|--------|
| Payment gateway | Not integrated | Out of scope for v1 |
| Email / SMS | Not integrated | Order confirmation is UI-only |
| Analytics | Not integrated | No user data collection |
| Error monitoring | Not integrated | Console logging only in v1 |
| Authentication provider | Not integrated | Guest-only ordering |
| CDN | Not integrated | All assets bundled locally |
| External database | Not integrated | SQLite embedded in container |

---

### Sandbox Network Allowlist

All runtime network activity is restricted to:

| Host | Protocol | Purpose |
|------|----------|---------|
| `0.0.0.0:3000` (self) | HTTP | Application server |
| `localhost:3000` (self) | HTTP | API calls from frontend in production |
| `registry.npmjs.org` | HTTPS | npm package installation (build time only) |

No other outbound connections are made or expected at runtime.

---
