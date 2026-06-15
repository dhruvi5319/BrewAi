# Requirements Traceability Matrix
# BrewAI — Specialty Coffee Shop Web Application

**Version:** 1.0
**Date:** 2026-06-15
**Project Acronym:** BrewAI
**Status:** Active
**Generated from:** PRD-BrewAI.md v1.0, FRD-BrewAI.md v1.0, TechArch-BrewAI.md v1.0, UserStories-BrewAI.md v1.0

---

## Table of Contents

1. [Overview](#1-overview)
2. [Requirements Summary](#2-requirements-summary)
3. [Traceability Matrix](#3-traceability-matrix)
4. [Requirements Detail](#4-requirements-detail)
5. [Test Case Coverage Matrix](#5-test-case-coverage-matrix)
6. [Change Management](#6-change-management)
7. [Approval](#7-approval)

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between all BrewAI v1 requirements and specifications. It ensures every PRD feature maps to functional requirements, every functional requirement maps to architectural specifications, every specification maps to user stories, and every user story maps to testable acceptance criteria.

BrewAI is a guest-only specialty coffee ordering web application. Customers can browse a curated menu, customize drinks with precision, manage a cart, and place orders — all within a dark, warm-amber premium interface. The application contains no AI, authentication, or payment features in v1.

**Traceability Levels Covered:**

This RTM traces requirements across four specification layers. The **PRD layer** defines eight product features (F0–F7) that together deliver the core guest ordering loop. The **FRD layer** expands each PRD feature into detailed functional requirements covering sub-features, process flows, validation rules, state shapes, and error states — organized as F00–F07. The **TechArch layer** specifies the concrete architectural decisions, component structures, data models, API endpoints, and deployment constraints that implement each functional requirement. The **UserStories layer** expresses each capability as persona-driven stories (US-0.1 through US-7.4) with explicit, testable acceptance criteria.

**Scope of this RTM:**

This document covers all v1 deliverables: six P0-critical features (F0, F1, F2, F3, F4, F7), two P1-high-quality features (F5, F6), the complete REST API surface (`GET /api/menu`, `GET /api/menu/categories`, `GET /api/menu/:id`, `POST /api/orders`, `GET /api/orders/:id`), the SQLite data model (`menu_items`, `orders`, `order_items`), the React/TypeScript component architecture, and the sandbox deployment topology. Items explicitly out of scope — authentication, payment processing, AI/ML features, native mobile apps, and an admin/CMS panel — are not traced in this document.

---

## 2. Requirements Summary

### PRD Features

- **F0 — Design System & Component Foundation (P0):** Complete Tailwind design token config, locally bundled fonts (Inter + Playfair Display), and seven typed primitive components (`Button`, `Badge`, `Card`, `Input`, `Select`, `Modal`, `Spinner`). Foundation all other features depend on.
- **F1 — Menu Browsing & Category Filtering (P0):** Responsive card grid fetched from `GET /api/menu`, real-time category pill filtering, 200ms-debounced keyword search, skeleton loading, and empty/error states.
- **F2 — Drink Customization Modal (P0):** Full-screen modal with size/milk/temperature/shot/extras/special-instructions controls driven by per-item `options_json`, real-time price calculation, quantity stepper, and `cartStore.addItem()` dispatch.
- **F3 — Cart Management (P0):** In-session Zustand cart with animated drawer, per-item quantity steppers, subtotal calculation, clear-cart confirmation, and empty-state CTA back to menu.
- **F4 — Order Placement & Confirmation (P0):** `POST /api/orders` submission with loading/error/success states, `BRW-NNNNN` order reference, itemized confirmation screen, and "Start a New Order" CTA.
- **F5 — Responsive Layout & Navigation (P1):** Top-bar navigation on desktop, compact header on mobile, 1–4 column responsive menu grid, full-screen cart on mobile, minimum 44×44px tap targets, no horizontal overflow at 320px.
- **F6 — Animated Interactions & Micro-Animations (P1):** Framer Motion stagger entrance for menu cards, `scaleIn`/`fadeIn` modal transitions, slide-in cart drawer, pop badge animation, toast notifications, button `whileTap` scale, and `useReducedMotion()` guard on all animations.
- **F7 — REST API & Data Persistence (P0):** Node.js + Express server with five REST endpoints, SQLite via `better-sqlite3`, auto-initialization and seeding (20–30 items across five categories), JSON envelope responses, and `0.0.0.0:3000` binding.

### Functional Requirements (FRD Sub-Features)

- **F00 sub-features:** F00.1 Tailwind Config Extension · F00.2 Font Bundling · F00.3 Primitive Components · F00.4 Global Base Styles · F00.5 Shared Motion Variants · F00.6 Focus Ring Global Style
- **F01 sub-features:** F01.1 Menu Fetch & Display · F01.2 Category Filter Bar · F01.3 Keyword Search · F01.4 Product Card · F01.5 Loading State · F01.6 Empty State · F01.7 Card Entrance Animation
- **F02 sub-features:** F02.1 Modal Open/Close · F02.2 Size Selection · F02.3 Milk Type · F02.4 Temperature · F02.5 Shot Count · F02.6 Add-ons/Extras · F02.7 Special Instructions · F02.8 Real-time Price · F02.9 Quantity Stepper · F02.10 Add to Cart Action
- **F03 sub-features:** F03.1 Cart Icon Badge · F03.2 Cart Drawer · F03.3 Cart Line Item · F03.4 Quantity Stepper · F03.5 Remove Item · F03.6 Subtotal Display · F03.7 Clear Cart · F03.8 Empty Cart State · F03.9 Place Order CTA
- **F04 sub-features:** F04.1 Place Order Button · F04.2 Submission Loading State · F04.3 API Order Submission · F04.4 Success Flow · F04.5 Error Flow · F04.6 Confirmation Screen
- **F05 sub-features:** F05.1 Responsive Navigation · F05.2 Responsive Menu Grid · F05.3 Mobile Cart Drawer · F05.4 Touch Targets
- **F06 sub-features:** F06.1 Card Entrance Animation · F06.2 Modal/Drawer Transitions · F06.3 Toast Notifications · F06.4 Reduced-Motion Guard
- **F07 sub-features:** F07.1 `GET /api/menu` · F07.2 `GET /api/menu/categories` · F07.3 `GET /api/menu/:id` · F07.4 `POST /api/orders` · F07.5 `GET /api/orders/:id` · F07.6 Database Auto-Init · F07.7 Seed Script · F07.8 Input Validation

### TechArch Specifications (SPEC IDs)

- **SPEC-001 — SPA + Monolith Pattern:** Single Express process on `0.0.0.0:3000` serving both frontend static files and REST API.
- **SPEC-002 — React 18 + TypeScript + Vite Frontend:** Component-driven UI with strict TypeScript, Vite 5 build, React Router v6, and `AnimatePresence` page transitions.
- **SPEC-003 — Tailwind CSS v3 Design Tokens:** Extended `tailwind.config.ts` with color, font, radius tokens; no hardcoded hex in `.tsx`/`.ts` files.
- **SPEC-004 — Zustand State Management:** `menuStore` and `cartStore` as Zustand stores; in-memory only (no localStorage persistence).
- **SPEC-005 — Framer Motion Animation Layer:** All shared variants in `src/lib/motion.ts`; `useReducedMotion()` guard on every animated component.
- **SPEC-006 — Component Architecture:** Layered folder structure: `pages/`, `components/ui/`, `components/layout/`, `components/menu/`, `components/customization/`, `components/cart/`, `components/toast/`.
- **SPEC-007 — Express 4 + better-sqlite3 Backend:** Synchronous SQLite, WAL mode, FK enforcement, parameterized prepared statements, middleware chain: `cors → express.json → routes → static → errorHandler`.
- **SPEC-008 — SQLite Data Model:** Three tables (`menu_items`, `orders`, `order_items`); `options_json` and `customizations_json` as TEXT columns parsed in application code; `order_items.menu_item_id` intentionally not a FK.
- **SPEC-009 — REST API Endpoints:** Five endpoints with `{ data, error, status }` envelope, camelCase response mapping, parameterized queries, full error code catalog.
- **SPEC-010 — Font Bundling:** `@fontsource/inter` + `@fontsource/playfair-display` npm packages; woff2 emitted to `dist/assets/` by Vite; zero CDN fetch at runtime.
- **SPEC-011 — Security Architecture:** No auth, no PII, no cookies; parameterized SQL only; field-by-field payload validation; generic error messages; no stack traces in API responses.
- **SPEC-012 — Docker Deployment:** `node:20-bookworm-slim` base image; `EXPOSE 3000`; `CMD ["node", "server.js"]`; auto-init DB on cold start; never Alpine.
- **SPEC-013 — Responsive Layout System:** Tailwind breakpoints (`sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px); `overflow-x: hidden` on body; `min-height: 44px` on all Button variants.

### User Stories (36 Total)

- **P0 Stories (28):** US-0.1–0.4, US-1.1–1.5, US-2.1–2.6, US-3.1–3.5, US-4.1–4.4, US-7.1–7.4
- **P1 Stories (8):** US-5.1–5.4, US-6.1–6.4

---

## 3. Traceability Matrix

### 3.1 Primary Traceability Table: PRD → FRD → TechArch → User Stories

| PRD Feature | Priority | FRD Requirements | TechArch Specs | User Stories |
|-------------|----------|-----------------|----------------|--------------|
| **F0: Design System & Component Foundation** | P0 | F00.1 Tailwind Config Extension<br>F00.2 Font Bundling<br>F00.3 Primitive Components<br>F00.4 Global Base Styles<br>F00.5 Shared Motion Variants<br>F00.6 Focus Ring Global Style | SPEC-002, SPEC-003, SPEC-005, SPEC-006, SPEC-010 | US-0.1, US-0.2, US-0.3, US-0.4 |
| **F1: Menu Browsing & Category Filtering** | P0 | F01.1 Menu Fetch & Display<br>F01.2 Category Filter Bar<br>F01.3 Keyword Search<br>F01.4 Product Card<br>F01.5 Loading State<br>F01.6 Empty State<br>F01.7 Card Entrance Animation | SPEC-002, SPEC-004, SPEC-006, SPEC-009 | US-1.1, US-1.2, US-1.3, US-1.4, US-1.5 |
| **F2: Drink Customization Modal** | P0 | F02.1 Modal Open/Close<br>F02.2 Size Selection<br>F02.3 Milk Type Selection<br>F02.4 Temperature Selection<br>F02.5 Shot Count Selection<br>F02.6 Add-ons/Extras<br>F02.7 Special Instructions<br>F02.8 Real-time Price Display<br>F02.9 Quantity Stepper<br>F02.10 Add to Cart Action | SPEC-002, SPEC-004, SPEC-005, SPEC-006, SPEC-008, SPEC-009 | US-2.1, US-2.2, US-2.3, US-2.4, US-2.5, US-2.6 |
| **F3: Cart Management** | P0 | F03.1 Cart Icon Badge<br>F03.2 Cart Drawer<br>F03.3 Cart Line Item<br>F03.4 Quantity Stepper<br>F03.5 Remove Item<br>F03.6 Subtotal Display<br>F03.7 Clear Cart<br>F03.8 Empty Cart State<br>F03.9 Place Order CTA | SPEC-002, SPEC-004, SPEC-005, SPEC-006, SPEC-013 | US-3.1, US-3.2, US-3.3, US-3.4, US-3.5 |
| **F4: Order Placement & Confirmation** | P0 | F04.1 Place Order Button<br>F04.2 Submission Loading State<br>F04.3 API Order Submission<br>F04.4 Success Flow<br>F04.5 Error Flow<br>F04.6 Confirmation Screen | SPEC-002, SPEC-004, SPEC-006, SPEC-007, SPEC-008, SPEC-009 | US-4.1, US-4.2, US-4.3, US-4.4 |
| **F5: Responsive Layout & Navigation** | P1 | F05.1 Responsive Navigation<br>F05.2 Responsive Menu Grid<br>F05.3 Mobile Cart Drawer<br>F05.4 Touch Targets | SPEC-002, SPEC-006, SPEC-013 | US-5.1, US-5.2, US-5.3, US-5.4 |
| **F6: Animated Interactions & Micro-Animations** | P1 | F06.1 Card Entrance Animation<br>F06.2 Modal/Drawer Transitions<br>F06.3 Toast Notifications<br>F06.4 Reduced-Motion Guard | SPEC-002, SPEC-005, SPEC-006 | US-6.1, US-6.2, US-6.3, US-6.4 |
| **F7: REST API & Data Persistence** | P0 | F07.1 GET /api/menu<br>F07.2 GET /api/menu/categories<br>F07.3 GET /api/menu/:id<br>F07.4 POST /api/orders<br>F07.5 GET /api/orders/:id<br>F07.6 Database Auto-Init<br>F07.7 Seed Script<br>F07.8 Input Validation | SPEC-001, SPEC-007, SPEC-008, SPEC-009, SPEC-011, SPEC-012 | US-7.1, US-7.2, US-7.3, US-7.4 |

---

### 3.2 Reverse Traceability: TechArch Specs → PRD Features

| SPEC ID | Specification | PRD Features Served |
|---------|--------------|---------------------|
| SPEC-001 | SPA + Monolith Pattern | F7 |
| SPEC-002 | React 18 + TypeScript + Vite Frontend | F0, F1, F2, F3, F4, F5, F6 |
| SPEC-003 | Tailwind CSS v3 Design Tokens | F0 |
| SPEC-004 | Zustand State Management | F1, F2, F3, F4 |
| SPEC-005 | Framer Motion Animation Layer | F0, F2, F3, F6 |
| SPEC-006 | Component Architecture | F0, F1, F2, F3, F4, F5, F6 |
| SPEC-007 | Express 4 + better-sqlite3 Backend | F4, F7 |
| SPEC-008 | SQLite Data Model | F2, F4, F7 |
| SPEC-009 | REST API Endpoints | F1, F2, F4, F7 |
| SPEC-010 | Font Bundling | F0 |
| SPEC-011 | Security Architecture | F7 |
| SPEC-012 | Docker Deployment | F7 |
| SPEC-013 | Responsive Layout System | F3, F5 |

---

### 3.3 Reverse Traceability: User Stories → PRD Features

| User Story | Title | PRD Feature | Priority |
|------------|-------|-------------|----------|
| US-0.1 | Consistent Design Tokens Across the App | F0 | P0 |
| US-0.2 | Bundled Fonts Load Without CDN | F0 | P0 |
| US-0.3 | Reusable Primitive Components Available to All Features | F0 | P0 |
| US-0.4 | Keyboard Focus Rings for Accessibility | F0 | P0 |
| US-1.1 | View the Full Menu on Page Load | F1 | P0 |
| US-1.2 | Filter Menu by Category | F1 | P0 |
| US-1.3 | Search Menu by Keyword | F1 | P0 |
| US-1.4 | See a Helpful Empty State When No Results Match | F1 | P0 |
| US-1.5 | Recover from a Menu Load Failure | F1 | P0 |
| US-2.1 | Open the Customization Modal for a Drink | F2 | P0 |
| US-2.2 | Select Size and See Price Update in Real Time | F2 | P0 |
| US-2.3 | Customize Milk Type, Temperature, and Shot Count | F2 | P0 |
| US-2.4 | Add Extras and See Total Price Update | F2 | P0 |
| US-2.5 | Add a Special Instructions Note | F2 | P0 |
| US-2.6 | Set Quantity and Add to Cart | F2 | P0 |
| US-3.1 | View the Cart and Its Items | F3 | P0 |
| US-3.2 | Adjust Item Quantity in the Cart | F3 | P0 |
| US-3.3 | Remove an Item from the Cart | F3 | P0 |
| US-3.4 | Clear All Items from the Cart | F3 | P0 |
| US-3.5 | View an Empty Cart State with a Path Back to the Menu | F3 | P0 |
| US-4.1 | Place an Order from the Cart | F4 | P0 |
| US-4.2 | See a Clear Order Confirmation Screen | F4 | P0 |
| US-4.3 | Handle Order Submission Errors Gracefully | F4 | P0 |
| US-4.4 | Start a New Order After Confirmation | F4 | P0 |
| US-5.1 | Navigate the App on Mobile with a Compact Header | F5 | P1 |
| US-5.2 | Browse the Menu in a Responsive Grid | F5 | P1 |
| US-5.3 | Use the Cart as a Full-Screen Overlay on Mobile | F5 | P1 |
| US-5.4 | Hit Touch Targets Accurately on Mobile | F5 | P1 |
| US-6.1 | Experience Smooth Card Entrance Animations on the Menu | F6 | P1 |
| US-6.2 | See Smooth Modal and Drawer Transitions | F6 | P1 |
| US-6.3 | Get Feedback Toasts When Items Are Added to Cart | F6 | P1 |
| US-6.4 | Have Animations Disabled When Reduced Motion Is Preferred | F6 | P1 |
| US-7.1 | Load Menu Data from the API on App Start | F7 | P0 |
| US-7.2 | Persist an Order to the Database | F7 | P0 |
| US-7.3 | Server Starts Automatically Without Manual Setup | F7 | P0 |
| US-7.4 | API Validates Inputs and Returns Structured Errors | F7 | P0 |

---

## 4. Requirements Detail

### F0: Design System & Component Foundation

**PRD Description:** A complete, consistent design system implemented as reusable React components and Tailwind configuration. Foundation that all other features build on.

**FRD Requirements:**

- **F00.1 — Tailwind Config Extension:** All design tokens defined in `tailwind.config.ts` under `theme.extend`; colors (`canvas: #0A0A0A`, `surface: #141414`, `surface-raised: #1C1C1C`, `accent: #C8922A`, `primary: #F5F0E8`), font families (`display: Playfair Display`, `body: Inter`), and border radii (`input: 6px`, `card: 12px`, `pill: 20px`) defined once and referenced everywhere. No raw hex values in `.tsx`/`.ts` files outside config and `src/index.css`.
- **F00.2 — Font Bundling:** Inter and Playfair Display served via `@fontsource/*` npm packages; woff2 files emitted to `dist/assets/` by Vite at build time. Fallback: `@font-face` rules in `src/index.css` pointing to `/assets/fonts/*.woff2`. No Google Fonts CDN request at runtime.
- **F00.3 — Primitive Components:** `Button` (variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`; min-height: `44px`), `Badge`, `Card`, `Input`, `Select`, `Modal` (focus-trapped, Escape/backdrop close), `Spinner` — all exported from `src/components/ui/index.ts` with full TypeScript typing and no `any` types.
- **F00.4 — Global Base Styles:** `<html>` and `<body>` background set to `#0A0A0A`; default font Inter; `box-sizing: border-box`; `overflow-x: hidden`; smooth scroll.
- **F00.5 — Shared Motion Variants:** `fadeIn`, `slideUp`, `scaleIn` Framer Motion variants exported from `src/lib/motion.ts` for use across all features. All animated components check `useReducedMotion()`.
- **F00.6 — Focus Ring Global Style:** `focus-visible:ring-2 focus-visible:ring-accent` applied globally via component defaults; `:focus-visible` only (not `:focus`) so rings do not appear on mouse clicks.

**Linked TechArch Specs:** SPEC-002 (React frontend), SPEC-003 (Tailwind tokens), SPEC-005 (Framer Motion), SPEC-006 (component architecture), SPEC-010 (font bundling)

**Linked User Stories:** US-0.1, US-0.2, US-0.3, US-0.4

---

### F1: Menu Browsing & Category Filtering

**PRD Description:** Primary customer-facing surface — full menu grid with category filtering and keyword search.

**FRD Requirements:**

- **F01.1 — Menu Fetch & Display:** On page mount, `menuStore.fetchMenu()` calls `GET /api/menu`; menu items stored in Zustand `menuStore`; items with `available: false` excluded. 8 skeleton cards shown while loading.
- **F01.2 — Category Filter Bar:** One pill button per unique category derived from API data (not hardcoded) + an "All" pill (always first, active by default). Single-select; clicking active pill resets to "All". Horizontally scrollable on mobile without page-level scroll.
- **F01.3 — Keyword Search:** Debounced at 200ms; case-insensitive substring match on `name` and `description`. Combined AND logic with active category. Clearing input restores category-filtered view.
- **F01.4 — Product Card:** Drink name in Playfair Display, description clamped to 2 lines, price formatted `$X.XX` in amber accent, category badge, CTA: "Customize" if `hasCustomizations: true`, "Add to Cart" if `false`. Min-height `160px`.
- **F01.5 — Loading State:** 8 skeleton card placeholders shown during API fetch; not shown during empty state.
- **F01.6 — Empty State:** Shows when filter + search yields zero items — message: "No drinks match your search. Try 'cold brew' or browse All." + "Clear filters" button. Separate "No drinks available yet" message when API returns empty array (no seed). Error state: "Could not load the menu. Please try again." + "Retry" button.
- **F01.7 — Card Entrance Animation:** Staggered `fadeIn` + `slideUp` on initial render using `cardVariants` and `staggerContainer` from `src/lib/motion.ts`. `AnimatePresence mode="popLayout"` for filter/search changes.

**Linked TechArch Specs:** SPEC-002, SPEC-004 (`menuStore`), SPEC-006 (`MenuPage`, `ProductCard`, `CategoryFilter`, `SearchInput`, `SkeletonGrid`), SPEC-009 (`GET /api/menu`)

**Linked User Stories:** US-1.1, US-1.2, US-1.3, US-1.4, US-1.5

---

### F2: Drink Customization Modal

**PRD Description:** Modal dialog with full customization controls driven by per-item `options_json` data from SQLite.

**FRD Requirements:**

- **F02.1 — Modal Open/Close:** Opens on "Customize" card CTA click; closes on Escape, backdrop click, or "×" button. `role="dialog"`, `aria-modal="true"`, `aria-labelledby` bound to modal title. Focus trapped while open; returns to triggering button on close.
- **F02.2 — Size Selection:** Radio-style selector showing sizes from `item.options.sizes`; price delta displayed per option (e.g., "Small −$0.50"). Default: "Medium" if present, otherwise first in list.
- **F02.3 — Milk Type Selection:** Radio-style selector for milk options from `item.options.milks`. Not rendered if `milks` is empty array. `<fieldset>` + `<legend>` grouping.
- **F02.4 — Temperature Selection:** Radio-style selector for temperatures from `item.options.temperatures`. Rendered as static read-only label if only one option available.
- **F02.5 — Shot Count Selection:** Radio-style selector (Single/Double/Triple) shown only when `drink_type = 'espresso'` (`item.options.shots !== null`). Default: "Double".
- **F02.6 — Add-ons/Extras:** Multi-select chip/checkbox group from `item.options.extras`; each chip shows label + price (e.g., "Vanilla Syrup +$0.75"). Not rendered if `extras` is empty array.
- **F02.7 — Special Instructions:** Textarea with 200-character hard limit; live counter (e.g., "45/200"); counter turns red (`#EF4444`) when ≤ 10 characters remain.
- **F02.8 — Real-time Price Display:** Formula: `displayPrice = (base_price + size_delta) + sum(selected_addons[i].price)`; `totalPrice = displayPrice × quantity`. Both values shown in modal footer.
- **F02.9 — Quantity Stepper:** Range 1–10; default 1. Decrement disabled at 1; increment disabled at 10. `aria-label="Decrease quantity"` / `aria-label="Increase quantity"`.
- **F02.10 — Add to Cart Action:** Validates size selected (always true by default), builds `CartItem` with `crypto.randomUUID()` as `cartItemId`, dispatches `cartStore.addItem()`, closes modal with exit animation, shows toast: "[Drink Name] added to cart".

**Linked TechArch Specs:** SPEC-002, SPEC-004 (`cartStore.addItem`), SPEC-005 (`scaleIn`/`fadeIn` modal animation), SPEC-006 (`CustomizationModal`), SPEC-008 (`options_json`), SPEC-009 (`GET /api/menu/:id`)

**Linked User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5, US-2.6

---

### F3: Cart Management

**PRD Description:** In-session Zustand cart accessible from any page via navigation bar cart icon.

**FRD Requirements:**

- **F03.1 — Cart Icon Badge:** Lucide `ShoppingCart` icon in navigation bar with animated count badge showing `cartStore.totalCount`. Badge hidden when empty. Pop animation on count change (scale `[1, 1.3, 1]` over 300ms).
- **F03.2 — Cart Drawer:** Slide-in panel (right on desktop; up on mobile). `role="dialog"`, `aria-modal="true"`, `aria-label="Your cart"`. Focus moves to first interactive element on open; returns to cart icon on close. Backdrop dims content on desktop.
- **F03.3 — Cart Line Item:** Drink name, customization summary string (e.g., "Large · Oat · Iced · Vanilla Syrup"), unit price, quantity stepper, remove button. Summary omits `null`/empty fields; add-ons joined with ", ".
- **F03.4 — Quantity Stepper (in-cart):** Decrementing to 0 removes the item. Max 10. ARIA labels per drink name.
- **F03.5 — Remove Item:** Trash/"×" icon button; `aria-label="Remove [Drink Name] from cart"`. Immediate removal (no confirmation for single item). Animates out (fade + slide, 150ms).
- **F03.6 — Subtotal Display:** Formula: `subtotal = items.reduce((sum, item) => sum + item.unitPrice × item.quantity, 0)`. Formatted `$XX.XX` (2 decimal places, USD). Recalculates on every mutation.
- **F03.7 — Clear Cart:** "Clear Cart" button shows confirmation prompt: "Remove all items from your cart?" → "Cancel" / "Clear All". Calls `cartStore.clearCart()` on confirm.
- **F03.8 — Empty Cart State:** "Your cart is empty" message + "Browse Menu" link. "Place Order" button is `aria-disabled="true"` when empty.
- **F03.9 — Place Order CTA:** "Place Order" button in cart footer; disabled when `items.length === 0`; triggers F04 order submission.

**Cart Merge Rule:** Items with identical `menuItemId`, `size`, `milk`, `temperature`, `shots`, `addons` (order-insensitive), and `specialInstructions` are merged (quantity incremented, capped at 10).

**Linked TechArch Specs:** SPEC-002, SPEC-004 (`cartStore`), SPEC-005 (cart drawer animation), SPEC-006 (`CartDrawer`, `CartItem`, `CartBadge`), SPEC-013 (full-screen mobile drawer)

**Linked User Stories:** US-3.1, US-3.2, US-3.3, US-3.4, US-3.5

---

### F4: Order Placement & Confirmation

**PRD Description:** `POST /api/orders` submission with order reference, confirmation screen, and new-order CTA.

**FRD Requirements:**

- **F04.1 — Place Order Button:** Disabled (and `aria-disabled="true"`) when `cartStore.items.length === 0`. Triggers submission flow.
- **F04.2 — Submission Loading State:** Spinner + "Placing order…" text replaces button content during API call; `aria-busy="true"`. Button disabled to prevent double-submission.
- **F04.3 — API Order Submission:** Serializes `cartStore.items` into `OrderPayload` (`items`, `subtotal`, `notes: ""`). Posts to `POST /api/orders`.
- **F04.4 — Success Flow:** HTTP 201 → `cartStore.clearCart()` → close cart drawer → navigate to `/confirmation` → render confirmation screen with `orderReference` (`BRW-NNNNN` format), itemized summary, subtotal.
- **F04.5 — Error Flow:** Network/4xx/5xx → clear loading state → re-enable button → show inline error below button with human-readable message + "Try Again" button. Cart preserved.
- **F04.6 — Confirmation Screen:** `CheckCircle2` success icon, "Order Placed!" heading (focus on navigation), `BRW-NNNNN` reference (Playfair Display, amber, 28px), itemized order summary, subtotal, "Ready in approximately 15–20 minutes" (static), "Start a New Order" primary button (`aria-label="Start a new order and return to menu"`).

**Error messages:** network failure → "Could not reach the server. Check your connection and try again."; server error → "Something went wrong placing your order. Please try again."

**Linked TechArch Specs:** SPEC-002, SPEC-004 (`cartStore.clearCart`), SPEC-006 (`ConfirmationPage`), SPEC-007 (Express transaction), SPEC-008 (`orders` + `order_items` tables), SPEC-009 (`POST /api/orders`)

**Linked User Stories:** US-4.1, US-4.2, US-4.3, US-4.4

---

### F5: Responsive Layout & Navigation

**PRD Description:** Fully responsive from 320px to 1920px; navigation adapts between mobile compact header and desktop top bar.

**FRD Requirements:**

- **F05.1 — Responsive Navigation:** Below `md` (768px): compact header with logo (max 120px width) + cart icon only. At `md`+: full top navigation bar with logo, nav links, and cart icon. Both reference same `cartStore.totalCount`.
- **F05.2 — Responsive Menu Grid:** 1 column at < `sm` (320px–639px); 2 columns at `sm`–`lg` (640px–1023px); 3 columns at `lg`–`2xl` (1024px–1535px); 4 columns at `2xl`+ (1536px+). Full container width with 16px horizontal padding at 320px. No horizontal scroll at any viewport.
- **F05.3 — Mobile Cart Drawer:** Below `md`: cart drawer uses `fixed inset-0` (full-screen); close via "×" button or Escape only. At `md`+: 400px wide slide-over panel from right edge with backdrop. Customization modal uses bottom-sheet style (`fixed bottom-0`, `max-h-[90vh]`, `rounded-t-[20px]`) on mobile; centered dialog (`max-w-[600px]`) on desktop.
- **F05.4 — Touch Targets:** All interactive elements minimum 44×44px on mobile. `Button` primitive enforces `min-height: 44px` on all size variants. Quantity steppers (modal + cart), category pills, and close buttons all meet the minimum.

**Linked TechArch Specs:** SPEC-002, SPEC-006 (`Navigation`, `Layout`), SPEC-013 (breakpoints, overflow, touch targets)

**Linked User Stories:** US-5.1, US-5.2, US-5.3, US-5.4

---

### F6: Animated Interactions & Micro-Animations

**PRD Description:** Purposeful Framer Motion animations (150–200ms) with full `useReducedMotion()` compliance.

**FRD Requirements:**

- **F06.1 — Card Entrance Animation:** Staggered `fadeIn` + `slideUp` on initial menu render (200ms per card, 50ms stagger). For grids with 30+ cards, last card begins within 1.5 seconds of first. Same enter/exit animations on filter/search changes via `AnimatePresence mode="popLayout"`. Uses `cardVariants` and `staggerContainer` from `src/lib/motion.ts`.
- **F06.2 — Modal/Drawer Transitions:** Modal opens with `scaleIn` + `fadeIn` (200ms, easeOut); closes with reverse exit (150ms). Backdrop fades 150ms + `backdrop-blur-sm`. Cart drawer slides right (desktop, 200ms) or up (mobile, 200ms); reverse on close. All wrapped in `AnimatePresence` for exit animation before unmount. Button `whileTap={{ scale: 0.97 }}` (100ms, snappy) on all `Button` primitives.
- **F06.3 — Toast Notifications:** "[Drink Name] added to cart" slides in from bottom-right on `cartStore.addItem()`. Auto-dismisses after 3 seconds with 150ms fade-out exit. Max 3 toasts visible simultaneously; oldest removed when 4th added. Stack at `fixed bottom-4 right-4` with 2px gap. Cart badge pop animation: scale `[1, 1.3, 1]` over 300ms on `totalCount` change.
- **F06.4 — Reduced-Motion Guard:** All animated components check `useReducedMotion()` from `framer-motion`. When `true`: `initial={false}`, no exit animations — elements appear/disappear instantly. `prefers-reduced-motion: reduce` CSS media query also respected for CSS-only transitions. No animation is exempt from this guard.

**Linked TechArch Specs:** SPEC-002, SPEC-005 (`src/lib/motion.ts`, `useReducedMotion`), SPEC-006 (`ToastProvider`, `Toast`)

**Linked User Stories:** US-6.1, US-6.2, US-6.3, US-6.4

---

### F7: REST API & Data Persistence

**PRD Description:** Node.js + Express REST API with SQLite persistence, auto-initialization, seeding, and structured error responses.

**FRD Requirements:**

- **F07.1 — GET /api/menu:** Returns all `available = 1` items sorted by `category, sort_order, name`. Parses `options_json`; maps snake_case → camelCase. Response: `{ data: MenuItem[], error: null, status: 200 }`. Error: `DB_READ_ERROR` (500).
- **F07.2 — GET /api/menu/categories:** Returns sorted distinct category strings for available items. Response: `{ data: string[], error: null, status: 200 }`.
- **F07.3 — GET /api/menu/:id:** Validates `id` is positive integer (`INVALID_ID` 400 if not). Returns single `MenuItem` with parsed options. `ITEM_NOT_FOUND` (404) if unavailable or absent.
- **F07.4 — POST /api/orders:** Validates `OrderPayload` field-by-field. Atomic SQLite transaction: insert `orders` row + N `order_items` rows. Returns HTTP 201 with `{ orderId, orderReference: "BRW-NNNNN", createdAt, items, subtotal }`. Transaction rolled back on failure → `DB_WRITE_ERROR` (500). Errors: `EMPTY_ORDER` (400), `INVALID_PAYLOAD` (400).
- **F07.5 — GET /api/orders/:id:** Joins `orders` + `order_items`; parses `customizations_json`. Returns full `OrderResponse`. Errors: `INVALID_ID` (400), `ORDER_NOT_FOUND` (404), `DB_READ_ERROR` (500).
- **F07.6 — Database Auto-Init:** `initDatabase()` runs synchronously before `app.listen()`. Creates `menu_items`, `orders`, `order_items` tables with `CREATE TABLE IF NOT EXISTS`. Sets `PRAGMA journal_mode = WAL` and `PRAGMA foreign_keys = ON`. Server ready log: `BrewAI server running on http://0.0.0.0:3000`.
- **F07.7 — Seed Script:** `seedMenu()` runs immediately after schema creation if `COUNT(*) FROM menu_items = 0`. Inserts 21 items: 6 Espresso, 4 Cold Brew, 4 Pour-Over, 4 Tea, 3 Seasonal. Subsequent restarts with existing data do not re-seed.
- **F07.8 — Input Validation:** All SQL via parameterized prepared statements — no string interpolation. Field-by-field validation on `POST /api/orders` (type checks, range checks, length limits). Generic error messages in responses; full stack traces only to `console.error`.

**Linked TechArch Specs:** SPEC-001 (monolith pattern), SPEC-007 (Express + better-sqlite3), SPEC-008 (data model + DDL), SPEC-009 (endpoint reference), SPEC-011 (security/validation), SPEC-012 (Docker/cold-start)

**Linked User Stories:** US-7.1, US-7.2, US-7.3, US-7.4

---

## 5. Test Case Coverage Matrix

### 5.1 Test Cases by User Story

Each user story's acceptance criteria maps directly to one or more test cases. Test cases are categorized as: **Unit** (component/store logic), **Integration** (API + DB), or **E2E** (full user flow via browser).

| Test ID | User Story | Test Case Description | Type | Expected Result |
|---------|------------|----------------------|------|-----------------|
| TEST-001 | US-0.1 | Verify HTML/body background is `#0A0A0A` on all pages | Unit | Background renders as Canvas color |
| TEST-002 | US-0.1 | Verify no raw hex values in `.tsx`/`.ts` files outside config | Unit | Linting/build passes with zero violations |
| TEST-003 | US-0.1 | Verify all CTAs and focus rings use `#C8922A` accent | Unit | Computed styles match accent token |
| TEST-004 | US-0.2 | Verify Inter and Playfair Display load from same origin (no CDN) | Integration | Network requests contain no `fonts.googleapis.com` calls |
| TEST-005 | US-0.2 | Verify fonts render correctly on network with all CDN blocked | Integration | Font renders in correct family (not system fallback) |
| TEST-006 | US-0.3 | Verify `Button` renders with correct variants and min-height 44px | Unit | Each variant matches design spec; height ≥ 44px |
| TEST-007 | US-0.3 | Verify `Modal` closes on Escape and backdrop click; focus trapped | Unit | Focus does not escape modal; onClose fires correctly |
| TEST-008 | US-0.3 | Verify all primitives exported from `src/components/ui/index.ts` | Unit | Imports resolve without error |
| TEST-009 | US-0.4 | Verify focus ring appears on keyboard navigation (`:focus-visible`) | Unit | `ring-2 ring-accent` class present on keyboard focus |
| TEST-010 | US-0.4 | Verify focus ring absent on mouse click | Unit | No focus ring class on mouse interaction |
| TEST-011 | US-1.1 | Verify menu page fetches `GET /api/menu` on mount and renders cards | Integration | Product cards render with correct data |
| TEST-012 | US-1.1 | Verify 8 skeleton cards shown during loading state | Unit | 8 skeleton elements present while loading=true |
| TEST-013 | US-1.1 | Verify items with `available: false` not rendered | Integration | Unavailable items absent from rendered grid |
| TEST-014 | US-1.2 | Verify category pill renders one per unique category + "All" first | Unit | Pills match unique categories from API; "All" is first |
| TEST-015 | US-1.2 | Verify clicking pill filters cards to matching category only | Unit | Non-matching cards not rendered after filter |
| TEST-016 | US-1.2 | Verify clicking active pill resets to "All" | Unit | All cards shown after re-clicking active pill |
| TEST-017 | US-1.3 | Verify search filters on `name` and `description` (case-insensitive) | Unit | Matching cards shown; non-matching hidden |
| TEST-018 | US-1.3 | Verify search is debounced at 200ms | Unit | `setSearch` called once after 200ms of inactivity |
| TEST-019 | US-1.4 | Verify empty state shown when filter + search yields zero results | Unit | Empty state message rendered; no skeleton or cards |
| TEST-020 | US-1.4 | Verify "Clear filters" resets category and search | Unit | All cards restored after clear |
| TEST-021 | US-1.5 | Verify error state shown when `GET /api/menu` fails | Integration | Error message + Retry button rendered |
| TEST-022 | US-1.5 | Verify "Retry" re-invokes `fetchMenu()` | Integration | Loading state re-enters; new fetch initiated |
| TEST-023 | US-2.1 | Verify modal opens on "Customize" CTA click | Unit | Modal `isOpen` becomes true; dialog renders |
| TEST-024 | US-2.1 | Verify modal closes on Escape, backdrop click, and "×" button | Unit | `onClose` fires on all three triggers |
| TEST-025 | US-2.1 | Verify focus returns to trigger button on modal close | Unit | Document focus moves to triggering CTA button |
| TEST-026 | US-2.2 | Verify size selection updates total price in real time | Unit | Price recalculates: `(base + delta) × qty` |
| TEST-027 | US-2.2 | Verify "Medium" is default selected size when available | Unit | "Medium" radio is pre-selected on modal open |
| TEST-028 | US-2.3 | Verify shot count selector absent for non-espresso drinks | Unit | Shot selector not rendered when `shots === null` |
| TEST-029 | US-2.3 | Verify milk selector absent when `milks` is empty array | Unit | Milk section not rendered for pour-over drinks |
| TEST-030 | US-2.4 | Verify add-on selection increments total price | Unit | Price increases by `addon.price` on chip selection |
| TEST-031 | US-2.5 | Verify textarea blocks input beyond 200 characters | Unit | Character count capped at 200; counter turns red at ≤10 remaining |
| TEST-032 | US-2.6 | Verify quantity stepper range is 1–10; decrement disabled at 1 | Unit | Decrement button disabled at quantity=1; increment at 10 |
| TEST-033 | US-2.6 | Verify "Add to Cart" dispatches `cartStore.addItem()` and shows toast | Unit | Cart item added; toast "[Drink Name] added to cart" appears |
| TEST-034 | US-3.1 | Verify cart drawer shows all added items with customization summary | E2E | All CartItem entries rendered with correct summary string |
| TEST-035 | US-3.1 | Verify cart state persists across route changes within session | E2E | Items remain after navigating from cart to menu and back |
| TEST-036 | US-3.2 | Verify quantity stepper adjusts item quantity and updates subtotal | Unit | Subtotal recalculates on every stepper interaction |
| TEST-037 | US-3.2 | Verify decrement at quantity=1 removes item from cart | Unit | Item removed; cart shrinks by one entry |
| TEST-038 | US-3.3 | Verify "×" button removes item immediately with animation | Unit | Item removed from `cartStore.items`; exit animation plays |
| TEST-039 | US-3.4 | Verify "Clear Cart" shows confirmation prompt | Unit | Confirmation dialog renders on button click |
| TEST-040 | US-3.4 | Verify "Clear All" empties cart; "Cancel" preserves it | Unit | `clearCart()` called only on "Clear All" confirmation |
| TEST-041 | US-3.5 | Verify empty cart state renders with "Browse Menu" link | Unit | Empty state message + link rendered when `items.length === 0` |
| TEST-042 | US-4.1 | Verify "Place Order" button disabled when cart is empty | Unit | Button has `aria-disabled="true"` and no click effect |
| TEST-043 | US-4.1 | Verify order submission via `POST /api/orders` on button click | Integration | HTTP 201 response; `orderId` and `orderReference` returned |
| TEST-044 | US-4.1 | Verify cart cleared and navigation to `/confirmation` on success | E2E | Cart empty after order; confirmation screen visible |
| TEST-045 | US-4.2 | Verify confirmation screen shows `BRW-NNNNN` order reference | E2E | Reference matches `BRW-{padded orderId}` format |
| TEST-046 | US-4.2 | Verify itemized summary and subtotal on confirmation screen | E2E | All ordered items with names, quantities, and prices displayed |
| TEST-047 | US-4.3 | Verify inline error + "Try Again" shown on submission failure | Integration | Error state renders; cart items preserved |
| TEST-048 | US-4.4 | Verify "Start a New Order" navigates to `/` and cart is empty | E2E | Route changes to menu; cart badge shows zero |
| TEST-049 | US-5.1 | Verify compact header (logo + cart icon) below 768px | Unit | Full nav links hidden; compact header elements visible at 767px |
| TEST-050 | US-5.2 | Verify menu grid is 1 column at 320px, 4 columns at 1536px | Unit | Grid columns match breakpoint spec at each viewport |
| TEST-051 | US-5.2 | Verify no horizontal scroll at 320px–1920px viewport | E2E | `document.body.scrollWidth <= window.innerWidth` at all widths |
| TEST-052 | US-5.3 | Verify cart drawer is full-screen (`fixed inset-0`) below 768px | Unit | Cart uses `inset-0` CSS at mobile viewport |
| TEST-053 | US-5.4 | Verify all interactive elements have min 44×44px tap target | Unit | `getBoundingClientRect()` ≥ 44×44px on all buttons/links |
| TEST-054 | US-6.1 | Verify staggered card entrance animation on menu load | Unit | Cards animate in sequence with 50ms stagger delay |
| TEST-055 | US-6.2 | Verify modal `scaleIn + fadeIn` on open; reverse on close | Unit | Framer Motion variants applied; `AnimatePresence` exit fires |
| TEST-056 | US-6.3 | Verify toast appears after "Add to Cart" and auto-dismisses in 3s | Unit | Toast renders; dismissed after 3 seconds |
| TEST-057 | US-6.4 | Verify all animations disabled when `prefers-reduced-motion: reduce` | Unit | `useReducedMotion()` returns true; `initial={false}` on all motion components |
| TEST-058 | US-7.1 | Verify `GET /api/menu` returns all available items with parsed `options` | Integration | Response data is `MenuItem[]`; `options_json` parsed to object |
| TEST-059 | US-7.1 | Verify `GET /api/menu/categories` returns sorted distinct categories | Integration | Returns `["Cold Brew", "Espresso", "Pour-Over", "Seasonal", "Tea"]` |
| TEST-060 | US-7.2 | Verify `POST /api/orders` persists order atomically and returns 201 | Integration | Order row + N item rows in DB; HTTP 201 with `orderReference` |
| TEST-061 | US-7.2 | Verify `GET /api/orders/:id` retrieves placed order with line items | Integration | Response matches submitted `OrderPayload`; all customizations present |
| TEST-062 | US-7.3 | Verify server starts without manual setup: schema created + seeded | Integration | Tables exist + 21 seed rows after cold start `npm start` |
| TEST-063 | US-7.3 | Verify server binds to `0.0.0.0:3000` | Integration | Server accessible from outside container at port 3000 |
| TEST-064 | US-7.4 | Verify `POST /api/orders` with empty items returns `EMPTY_ORDER` (400) | Integration | Error code `EMPTY_ORDER`; status 400 |
| TEST-065 | US-7.4 | Verify all SQL queries use parameterized statements (no interpolation) | Unit | Code review / static analysis confirms no template literal SQL |

---

### 5.2 Coverage Summary by Feature

| Feature | User Stories | Test Cases | Story Coverage | AC Coverage |
|---------|-------------|------------|----------------|-------------|
| F0: Design System | 4 (US-0.1–0.4) | TEST-001–010 | 100% | 100% |
| F1: Menu Browsing | 5 (US-1.1–1.5) | TEST-011–022 | 100% | 100% |
| F2: Customization Modal | 6 (US-2.1–2.6) | TEST-023–033 | 100% | 100% |
| F3: Cart Management | 5 (US-3.1–3.5) | TEST-034–041 | 100% | 100% |
| F4: Order Placement | 4 (US-4.1–4.4) | TEST-042–048 | 100% | 100% |
| F5: Responsive Layout | 4 (US-5.1–5.4) | TEST-049–053 | 100% | 100% |
| F6: Animations | 4 (US-6.1–6.4) | TEST-054–057 | 100% | 100% |
| F7: REST API | 4 (US-7.1–7.4) | TEST-058–065 | 100% | 100% |
| **TOTAL** | **36** | **65** | **100%** | **100%** |

---

### 5.3 Test Type Distribution

| Test Type | Count | Test IDs |
|-----------|-------|----------|
| Unit (component/store) | 45 | TEST-001–010, TEST-012, TEST-014–020, TEST-023–033, TEST-036–042, TEST-049–050, TEST-052–057, TEST-065 |
| Integration (API + DB) | 14 | TEST-004, TEST-005, TEST-011, TEST-013, TEST-021–022, TEST-043, TEST-047, TEST-058–064 |
| End-to-End (full browser flow) | 6 | TEST-034–035, TEST-044–046, TEST-048, TEST-051 |
| **Total** | **65** | — |

---

### 5.4 Non-Functional Requirements Coverage

| NFR Category | Requirement | Test Approach | Test IDs |
|-------------|------------|---------------|----------|
| Performance | LCP < 2.5s; CLS < 0.1; FID < 200ms | Lighthouse mobile simulation | — (Lighthouse audit) |
| Accessibility | WCAG AA contrast (≥ 4.5:1); all elements keyboard-navigable | axe-core / manual keyboard audit | TEST-009, TEST-010, TEST-053 |
| Accessibility | `prefers-reduced-motion` respected | Unit — `useReducedMotion()` guard | TEST-057 |
| Accessibility | ARIA labels on icon-only buttons | Unit — attribute assertions | TEST-007, TEST-032, TEST-042 |
| Responsiveness | Functional at 320px–1920px; no horizontal scroll | E2E viewport tests | TEST-050, TEST-051 |
| Reliability | SQLite WAL mode; no partial order writes | Integration — transaction rollback test | TEST-060 |
| Sandbox | Binds `0.0.0.0:3000`; Debian Docker only; npm-only deps | Integration — cold-start Docker test | TEST-062, TEST-063 |
| Security | No SQL string interpolation; parameterized queries only | Static analysis / code review | TEST-065 |
| Build | TypeScript strict mode; no `any` in production code | Build-time — `tsc --noEmit` passes cleanly | — (CI build gate) |
| Fonts | No CDN fetch at runtime | Network request monitoring | TEST-004, TEST-005 |

---

## 6. Change Management

### 6.1 Change Log

| Change ID | Date | Description | Impact | Raised By | Status |
|-----------|------|-------------|--------|-----------|--------|
| CHG-001 | 2026-06-15 | Initial RTM created from PRD v1.0, FRD v1.0, TechArch v1.0, UserStories v1.0 | Baseline established | Spec Generator | Approved |
| CHG-002 | 2026-06-15 | SPEC-013 added to capture responsive layout system separately from SPEC-006 component architecture | Improved specificity of F5 traceability | RTM Review | Approved |
| CHG-003 | — | — | — | — | — |

### 6.2 Impact Assessment Template

For any future requirement change, assess the following before updating this RTM:

| Impact Area | Questions to Answer |
|-------------|---------------------|
| PRD Feature | Does this change add, remove, or modify a feature (F0–F7)? |
| FRD Requirements | Which sub-features (F00.x–F07.x) are affected? |
| TechArch Specs | Which SPEC-00x architectural decisions need updating? |
| User Stories | Which US-X.X stories and acceptance criteria change or are added? |
| Test Cases | Which TEST-XXX test cases must be added, modified, or deprecated? |
| Dependency chain | Does the change affect any downstream features (e.g., F0 changes affect F1–F7)? |

---

## 7. Approval

### 7.1 Document Approval Sign-Off

| Role | Name | Signature | Date | Status |
|------|------|-----------|------|--------|
| Product Owner | — | | 2026-06-15 | Pending |
| Technical Lead | — | | 2026-06-15 | Pending |
| QA Lead | — | | 2026-06-15 | Pending |
| UX Lead | — | | 2026-06-15 | Pending |

### 7.2 Spec Document Versions Referenced

| Document | Version | Date | Status |
|----------|---------|------|--------|
| PRD-BrewAI.md | 1.0 | 2026-06-15 | Active |
| FRD-BrewAI.md | 1.0 | 2026-06-15 | Active |
| TechArch-BrewAI.md | 1.0 | 2026-06-15 | Active |
| UserStories-BrewAI.md | 1.0 | 2026-06-15 | Active |
| PROJECT.md | — | 2026-06-15 | Active |

### 7.3 RTM Validation Checklist

| Check | Status |
|-------|--------|
| All PRD features (F0–F7) have at least one FRD sub-feature | ✅ Complete |
| All PRD features map to at least one TechArch SPEC | ✅ Complete |
| All PRD features map to at least one User Story | ✅ Complete |
| All User Stories map back to a PRD feature | ✅ Complete |
| All TechArch SPECs map back to at least one PRD feature | ✅ Complete |
| All User Stories have at least one test case | ✅ Complete |
| P0 features (F0, F1, F2, F3, F4, F7) fully traced | ✅ Complete |
| P1 features (F5, F6) fully traced | ✅ Complete |
| Non-functional requirements coverage documented | ✅ Complete |
| Test case count reflects all acceptance criteria | ✅ 65 test cases across 36 user stories |
| No placeholder IDs — all IDs extracted from source docs | ✅ Verified |
| Out-of-scope items excluded (auth, payments, AI, admin) | ✅ Excluded |

---

*Document generated: 2026-06-15 | BrewAI v1.0 RTM | Sources: PRD-BrewAI.md, FRD-BrewAI.md, TechArch-BrewAI.md, UserStories-BrewAI.md*
