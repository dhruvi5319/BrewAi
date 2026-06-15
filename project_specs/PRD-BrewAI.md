# Product Requirements Document
# BrewAI — Specialty Coffee Shop Web Application

**Version:** 1.0  
**Date:** 2026-06-15  
**Project Acronym:** BrewAI  
**Status:** Active

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision](#3-product-vision)
4. [Technical Architecture](#4-technical-architecture)
5. [Feature Requirements](#5-feature-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Success Metrics](#7-success-metrics)
8. [Risks & Mitigations](#8-risks--mitigations)
9. [Feature Index](#9-feature-index)

---

## 1. Executive Summary

BrewAI is a modern specialty coffee shop web application that lets customers browse a curated menu, customize their drinks with precision, manage a cart, and place orders — all within a beautiful, fast, polished interface. Built on a dark, warm-amber design system that evokes premium specialty coffee culture, it delivers a production-quality guest ordering experience across all screen sizes. The name "BrewAI" reflects brand identity only; the application contains no AI or machine-learning features.

---

## 2. Problem Statement

Specialty coffee shops often have menus that feel generic, cluttered, or difficult to navigate on mobile devices. Customers who want to customize their order — adjusting milk type, temperature, shot count, or add-ons — are frequently forced to rely on verbal communication at the counter, leading to errors and friction. Existing digital ordering tools tend to be either too simplistic (no customization) or overly complex (requiring accounts, payments, and installations).

**Core pain points:**

- Menu discovery is slow and unfiltered — customers can't quickly find drinks by category or keyword
- Drink customization happens verbally, increasing the risk of order errors
- Cart management on most shop sites is primitive, making it hard to adjust quantities or review an order before placing it
- Poor mobile experiences break the ordering flow on the device most customers actually use
- Generic, low-contrast UIs fail to communicate the premium quality of specialty coffee products

BrewAI solves these problems with a focused, guest-first digital ordering experience: no account creation, no payment entry, just a beautiful menu, expressive customization, and a clean checkout confirmation.

---

## 3. Product Vision

> *A customer can browse the full menu, customize their drink exactly how they want it, and place an order — seamlessly, beautifully, on any device.*

### Strategic Goals

- Deliver a production-quality specialty coffee ordering UI that sets a visual and interaction quality bar comparable to premium consumer apps
- Prove the core guest ordering loop (browse → customize → cart → confirm) end-to-end without auth or payment complexity
- Establish a design system and component library that can be extended in future versions (auth, payments, admin, real-time tracking)
- Maintain full sandbox/preview compatibility from day one: Debian Docker, port 3000, bundled fonts, npm-only dependencies
- Keep the v1 scope deliberately narrow so every implemented feature is polished rather than merely present

### Out of Scope for v1

- AI/ML features (name is brand identity only)
- User authentication or accounts
- Payment processing (order placement is UI-complete only)
- Real-time order tracking (deferred post-confirmation)
- Admin or CMS panel (menu managed via SQLite seed data)
- Native mobile app (responsive web serves all devices)

---

## 4. Technical Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Frontend framework | React 18 + TypeScript | Component-driven UI with type safety |
| Build tool | Vite | Fast dev server and optimized production builds |
| Styling | Tailwind CSS v3 | Utility-first styling mapped to the design system |
| State management | Zustand | Lightweight cart and order state without Redux overhead |
| Animation | Framer Motion | 150–200ms polished micro-interactions |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Typography | Inter + Playfair Display | Bundled locally; no CDN runtime fetch |
| Backend runtime | Node.js 20 + Express | REST API server |
| Database | SQLite via better-sqlite3 | Zero-config embedded persistence for menu and orders |
| Container | Debian/Ubuntu (`node:20-bookworm-slim`) | Sandbox-compatible base image; no Alpine |
| Binding | `0.0.0.0:3000` | Required for sandbox/preview port exposure |

### Design System Tokens

| Token | Value | Usage |
|---|---|---|
| Canvas | `#0A0A0A` | Page background |
| Surface | `#141414` | Card and panel backgrounds |
| Surface raised | `#1C1C1C` | Elevated elements, modals, dropdowns |
| Accent | `#C8922A` | Primary CTA, focus rings, highlights |
| Text primary | `#F5F0E8` | Body and heading text |
| Border radius — inputs | `6px` | Text inputs, selects |
| Border radius — cards | `12px` | Menu cards, cart items |
| Border radius — pills | `20px` | Category filters, tags |
| Heading font | Playfair Display | Display headings, product names |
| Body font | Inter | Body text, labels, buttons |
| Transition | 150–200ms | All interactive state changes |
| Focus ring | 2px solid `#C8922A` | Keyboard accessibility |

---

## 5. Feature Requirements

### F0: Design System & Component Foundation

**Description:** A complete, consistent design system implemented as reusable React components and Tailwind configuration. This is the foundation all other features build on — every color token, typography scale, spacing unit, border radius, and animation duration is defined once and referenced everywhere. Components include buttons, inputs, badges, cards, modals, and loading states.

**Capabilities:**
- Tailwind config extended with all design system color tokens, font families, and border radii
- Inter and Playfair Display fonts bundled as local assets (not fetched from CDN at runtime)
- Reusable primitive components: `Button`, `Badge`, `Card`, `Input`, `Select`, `Modal`, `Spinner`
- Consistent focus ring style (2px solid amber) applied globally via Tailwind `ring` utilities
- Framer Motion variants defined for shared transitions (fade-in, slide-up, scale) at 150–200ms
- Dark canvas base (`#0A0A0A`) set as the HTML/body background

**Priority:** P0 (Critical — all other features depend on this)

---

### F1: Menu Browsing & Category Filtering

**Description:** The primary customer-facing surface: a full menu page displaying all available drinks organized by category, with the ability to filter by category and search by name or keyword. Each menu item card shows the drink name, description, price, and a visually rich presentation consistent with the premium brand aesthetic.

**Capabilities:**
- Full menu displayed as a responsive grid of product cards
- Category filter bar with pill-style toggles (e.g., Espresso, Cold Brew, Tea, Seasonal)
- Keyword search input that filters menu items in real time by name and description
- Each card displays: drink name (Playfair Display), short description, price, and a "Customize" or "Add to Cart" CTA
- Smooth animated card entrance on page load (Framer Motion stagger)
- Empty state when no items match the current filter/search combination
- Menu data served from the Express API, seeded in SQLite at application start

**Priority:** P0 (Critical — core browse loop)

---

### F2: Drink Customization Modal

**Description:** When a customer selects a drink, a modal (or slide-over panel) opens with full customization controls. The customer can adjust all relevant attributes before the item is added to their cart. All options are driven by the menu data stored in SQLite, so different drink types expose only the options that apply to them.

**Capabilities:**
- Size selection: Small / Medium / Large (with price delta displayed per size)
- Milk type selection: Whole, Oat, Almond, Coconut, Skim, None
- Temperature: Hot / Iced / Blended (where applicable per drink type)
- Shot count: Single / Double / Triple (espresso-based drinks only)
- Extras / add-ons: Vanilla syrup, Caramel, Hazelnut, Extra shot, Whipped cream (multi-select)
- Special instructions: free-text field (max 200 characters)
- Real-time price calculation displayed as options are selected
- "Add to Cart" button with quantity stepper (1–10)
- Modal accessible via keyboard; close on Escape or backdrop click
- Framer Motion entrance/exit animation for the modal overlay

**Priority:** P0 (Critical — core customization loop)

---

### F3: Cart Management

**Description:** A persistent cart accessible from any page via a cart icon in the navigation bar. The cart displays all items the customer has added, with the ability to adjust quantities, remove items, and review the running subtotal before placing an order. Cart state is managed in Zustand and persists across page navigations within the session.

**Capabilities:**
- Cart icon in the navigation bar with a badge showing item count
- Cart slide-out drawer (or dedicated cart page) listing all items with their customizations
- Each cart line item displays: drink name, customization summary, unit price, quantity stepper, and remove button
- Quantity stepper adjusts quantity from 1 to 10; removing last unit removes the line item
- Running subtotal calculated and displayed; no tax or tip in v1
- "Clear Cart" button with a confirmation prompt
- Empty cart state with a CTA linking back to the menu
- Cart state stored in Zustand; survives route changes, does not persist across page refresh (session-only)

**Priority:** P0 (Critical — required to complete the ordering flow)

---

### F4: Order Placement & Confirmation

**Description:** From the cart, the customer can review their full order and place it with a single action. The order is submitted to the Express API and persisted in SQLite. Upon success, the customer is presented with an order confirmation screen showing a summary and a unique order reference number. No payment is collected; the confirmation represents intent to pick up.

**Capabilities:**
- "Place Order" button on the cart view, disabled when cart is empty
- Order submission via `POST /api/orders` to the Express backend
- Backend persists order with line items and customizations in SQLite
- Order confirmation screen displays: order reference number, itemized summary, estimated ready time (static: "15–20 minutes"), and a "New Order" CTA that clears the cart and returns to the menu
- Loading state during submission (spinner + disabled button)
- Error state if submission fails (inline error message with retry option)
- Submitted order is retrievable via `GET /api/orders/:id` for future extensibility

**Priority:** P0 (Critical — completes the core ordering loop)

---

### F5: Responsive Layout & Navigation

**Description:** The application is fully responsive across mobile, tablet, and desktop viewports. Navigation provides consistent access to the menu and cart at all screen sizes, adapting its layout (e.g., bottom navigation on mobile, top bar on desktop). All interactive elements meet minimum touch target sizes on mobile.

**Capabilities:**
- Top navigation bar on desktop with logo, nav links, and cart icon
- Mobile-friendly navigation: compact header with cart icon; category filters scroll horizontally
- Menu grid adapts: 1 column on mobile, 2 on tablet, 3–4 on desktop
- Cart drawer is full-screen on mobile, slide-over panel on desktop
- All tap targets are minimum 44×44px on mobile viewports
- Smooth scroll behavior for category anchor links
- No horizontal scroll on any viewport width (320px minimum supported)

**Priority:** P1 (High — required for production quality)

---

### F6: Animated Interactions & Micro-Animations

**Description:** All meaningful UI state changes are animated using Framer Motion, creating a polished, premium feel consistent with the brand. Animations are purposeful and fast (150–200ms) — they provide feedback and delight without adding perceived latency.

**Capabilities:**
- Menu card entrance: staggered fade-in + slide-up on initial render
- Customization modal: scale-in + fade on open; reverse on close
- Cart drawer: slide-in from the right on desktop; slide-up on mobile
- Cart badge: pop/scale animation when item count changes
- Button press: subtle scale-down (0.97) on active state
- Page transitions: fade between route changes
- Toast/snackbar notification: slide-in on "Item added to cart" confirmation
- All animations respect `prefers-reduced-motion` media query (motion disabled when set)

**Priority:** P1 (High — core to brand experience)

---

### F7: REST API & Data Persistence

**Description:** A Node.js + Express REST API serves menu data and accepts order submissions. SQLite (via better-sqlite3) provides embedded persistence with zero external infrastructure. The database is seeded at application start with a curated menu of specialty coffee drinks across multiple categories.

**Capabilities:**
- `GET /api/menu` — returns full menu with items, categories, and customization options
- `GET /api/menu/categories` — returns list of drink categories
- `GET /api/menu/:id` — returns a single menu item with full options
- `POST /api/orders` — accepts and persists a new order; returns order ID and timestamp
- `GET /api/orders/:id` — returns a stored order by ID
- SQLite database auto-initialized on server start (schema migration run if tables absent)
- Seed script populates 20–30 menu items across categories: Espresso, Cold Brew, Pour-Over, Tea, Seasonal
- CORS configured to allow frontend origin in development; same-origin in production build
- API responses follow consistent JSON envelope: `{ data, error, status }`
- Server binds to `0.0.0.0:3000` for sandbox compatibility

**Priority:** P0 (Critical — frontend cannot function without menu data or order submission)

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Initial page load (LCP) under 2.5 seconds on a mid-tier mobile device over 4G |
| Performance | Time-to-interactive under 3.5 seconds; no layout shift (CLS < 0.1) |
| Responsiveness | Fully functional at viewport widths from 320px to 1920px |
| Accessibility | All interactive elements keyboard-navigable; focus rings visible; color contrast ≥ 4.5:1 for body text |
| Accessibility | ARIA labels on icon-only buttons (cart, close, quantity steppers) |
| Accessibility | `prefers-reduced-motion` respected for all Framer Motion animations |
| Reliability | SQLite writes use synchronous better-sqlite3 API; no partial order state |
| Reliability | Server restart does not lose persisted menu or order data (SQLite file persisted to disk) |
| Compatibility | Works in Chrome 120+, Firefox 120+, Safari 17+, Edge 120+ |
| Compatibility | No runtime CDN fetches; all assets (fonts, icons) bundled or served locally |
| Security | No user data collected; no cookies set; no authentication surface |
| Security | API inputs validated and sanitized before SQLite writes |
| Sandbox | App binds to `0.0.0.0:3000`; Docker base image is Debian/Ubuntu (`node:20-bookworm-slim`) |
| Sandbox | All npm dependencies installable from `registry.npmjs.org`; no binary fetches via curl/wget |
| Build | `npm run build` produces a production-ready static bundle served by the Express app |
| Build | TypeScript strict mode enabled; no `any` types in production code |

---

## 7. Success Metrics

The following measurable outcomes define a successful v1 delivery:

**Functional completeness**
- All P0 features (F0–F4, F7) implemented and end-to-end functional: a user can browse, customize, add to cart, and place an order
- Order persisted in SQLite and retrievable via `GET /api/orders/:id` after placement

**Performance**
- Lighthouse Performance score ≥ 85 on mobile simulation (Chrome DevTools)
- LCP ≤ 2.5 seconds; CLS < 0.1; FID / INP < 200ms

**Design fidelity**
- All design system tokens (colors, radii, typography) applied consistently — no hardcoded color values outside the Tailwind config
- No horizontal overflow or layout breakage at 320px, 768px, 1280px, and 1920px viewport widths

**Accessibility**
- All interactive elements reachable and operable via keyboard alone
- No WCAG AA contrast failures on text elements

**Sandbox compatibility**
- Application starts, serves, and accepts orders in a clean Debian Docker container with only `npm install` and `npm start`
- No errors on cold start (schema auto-created, seed data populated)

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Font CDN blocked in sandbox preview | High | High | Bundle Inter and Playfair Display as local npm packages or static assets; never use Google Fonts CDN at runtime |
| Alpine-based Docker image used accidentally | Medium | High | Explicitly specify `node:20-bookworm-slim` in Dockerfile; document constraint in AGENTS.md and README |
| SQLite file lost on container restart | Medium | Medium | Mount SQLite file to a named Docker volume or document that the seed re-runs on fresh start (acceptable for v1) |
| Tailwind purge removes needed classes | Medium | Medium | Use Tailwind's `content` glob to include all `.tsx` and `.ts` files; avoid dynamic class construction |
| better-sqlite3 binary incompatibility | Low | High | Pin better-sqlite3 to a version with pre-built binaries for Node 20 on Debian; run `npm rebuild` in Dockerfile if needed |
| Framer Motion bundle size impacts LCP | Low | Medium | Use dynamic imports for motion components; ensure code-splitting is active in Vite config |
| TypeScript strict mode breaks third-party types | Low | Low | Add targeted `@ts-ignore` only as a last resort; prefer `@types/*` packages or local declaration files |

---

## 9. Feature Index

| ID | Feature Name | Priority | Category | Depends On | Status |
|---|---|---|---|---|---|
| F0 | Design System & Component Foundation | P0 | Foundation | — | Planned |
| F1 | Menu Browsing & Category Filtering | P0 | Core UX | F0, F7 | Planned |
| F2 | Drink Customization Modal | P0 | Core UX | F0, F1 | Planned |
| F3 | Cart Management | P0 | Core UX | F0, F2 | Planned |
| F4 | Order Placement & Confirmation | P0 | Core UX | F0, F3, F7 | Planned |
| F5 | Responsive Layout & Navigation | P1 | UX Quality | F0 | Planned |
| F6 | Animated Interactions & Micro-Animations | P1 | UX Quality | F0 | Planned |
| F7 | REST API & Data Persistence | P0 | Backend | — | Planned |

### Priority Summary

| Priority | Count | Features |
|---|---|---|
| P0 — Critical (MVP) | 6 | F0, F1, F2, F3, F4, F7 |
| P1 — High | 2 | F5, F6 |
| P2 — Medium | 0 | — |
| P3 — Low | 0 | — |

> All P0 features must be complete before v1 is considered shippable. P1 features are required for production quality and should be implemented alongside P0 features, not deferred.

---

*Document generated: 2026-06-15 | BrewAI v1.0 PRD | Next: FRD-BrewAI.md*
