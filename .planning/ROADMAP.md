# Roadmap: BrewAI

## Overview

BrewAI delivers a complete specialty coffee ordering experience in five phases that mirror the natural dependency chain of the application: first build the foundation (design system + backend infrastructure), then layer the customer-facing features in the order a customer would encounter them (browse menu → customize drink → manage cart → place order), and finally polish the experience to production quality (responsiveness + animation). Every phase ends with something verifiable by a human using the application.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Design system, backend API, SQLite schema, and sandbox infrastructure — everything else builds on this
- [ ] **Phase 2: Menu Browsing** - Full menu page with category filtering, search, loading/error/empty states, and product cards
- [ ] **Phase 3: Customization & Cart** - Drink customization modal and cart management — the core ordering interaction loop
- [ ] **Phase 4: Order Placement** - Order submission, persistence, and confirmation screen — completing the ordering flow
- [ ] **Phase 5: Polish** - Responsive layout, animations, and micro-interactions — seamlessly, beautifully, on any device

## Phase Details

### Phase 1: Foundation
**Status**: executing
**Goal**: The project boots, serves, and is ready for feature development — design tokens, component primitives, backend API, SQLite persistence, and sandbox configuration are all in place
**Depends on**: Nothing (first phase)
**Requirements**: F0-01, F0-02, F0-03, F0-04, F0-05, F0-06, F7-01, F7-02, F7-03, F7-04, F7-05, F7-06, F7-07, F7-08, INF-01, INF-02, INF-03, INF-04, INF-05, INF-06
**Success Criteria** (what must be TRUE):
  1. Running `npm run build && node server.js` starts the app on `0.0.0.0:3000` with no errors and auto-initialized SQLite data
  2. `GET /api/menu` returns 20+ seeded drink items with parsed options JSON
  3. `POST /api/orders` accepts a valid payload and returns a `BRW-NNNNN` order reference with HTTP 201
  4. All design system primitives (Button, Card, Input, Modal, Spinner) render correctly with amber focus rings and correct colors
  5. Inter and Playfair Display fonts load from local assets — no CDN fetch at runtime
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md — Project scaffold: package.json, tsconfig files, vite/tailwind/postcss config, index.html, Dockerfile
- [ ] 01-02-PLAN.md — Express backend: server.ts, SQLite schema + 21-item seed, all 5 API endpoints (Wave 2, parallel with 01-03)
- [ ] 01-03-PLAN.md — Frontend foundation: shared TypeScript types, Framer Motion variants, API fetch helpers, global CSS + font imports, React root + App router (Wave 2, parallel with 01-02)
- [ ] 01-04-PLAN.md — UI Primitives: Button, Badge, Card, Input, Select, Modal, Spinner + barrel export (Wave 3, depends on 01-02 + 01-03)

### Phase 2: Menu Browsing
**Goal**: A customer can discover and browse the full drink menu — filtering by category, searching by keyword, and seeing every drink with its name, description, price, and action CTA
**Depends on**: Phase 1
**Requirements**: F1-01, F1-02, F1-03, F1-04, F1-05, F1-06, F1-07, F1-08
**Success Criteria** (what must be TRUE):
  1. User sees the full menu grid on page load with all seeded drinks displayed
  2. User can click a category pill (Espresso, Cold Brew, etc.) and only see drinks in that category; clicking the same pill again returns to "All"
  3. User can type in the search box and see filtered results update within 200ms debounce
  4. User sees 8 skeleton cards while menu is loading, an error message with "Retry" if the API fails, and the message "No drinks match your search. Try 'cold brew' or browse All." when search/filter yields nothing
  5. Each product card shows the drink name in Playfair Display, description, price in amber, category badge, and either "Customize" or "Add to Cart" CTA
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Zustand menuStore + CategoryFilter + SearchInput (Wave 1, parallel with 02-02)
- [ ] 02-02-PLAN.md — ProductCard + SkeletonGrid components (Wave 1, parallel with 02-01)
- [ ] 02-03-PLAN.md — MenuPage assembly + Playwright e2e tests (Wave 2, depends on 02-01 + 02-02)

### Phase 3: Customization & Cart
**Goal**: A customer can open a customization modal for any drink, configure all applicable options with real-time price feedback, add it to their cart, and manage cart contents before checking out
**Depends on**: Phase 2
**Requirements**: F2-01, F2-02, F2-03, F2-04, F2-05, F2-06, F2-07, F2-08, F2-09, F2-10, F3-01, F3-02, F3-03, F3-04, F3-05, F3-06, F3-07, F3-08, F3-09
**Success Criteria** (what must be TRUE):
  1. User can open a customization modal for an espresso drink and see size, milk, temperature, shot count, and extras selectors — with the price updating in real time as they change options
  2. User can add a customized drink to the cart; the modal closes, the cart badge increments, and a toast notification confirms the add
  3. User can open the cart drawer and see each item with its customization summary (e.g., "Large · Oat · Iced"), quantity stepper, and line total
  4. User can increase/decrease item quantity, remove individual items, and clear the entire cart (with confirmation)
  5. Cart subtotal updates in real time as items change; cart badge reflects total item count
**Plans**: TBD

### Phase 4: Order Placement
**Goal**: A customer can submit their cart as an order, see a loading state during submission, and land on a confirmation screen showing their order reference number and itemized summary
**Depends on**: Phase 3
**Requirements**: F4-01, F4-02, F4-03, F4-04, F4-05, F4-06, F4-07, F4-08
**Success Criteria** (what must be TRUE):
  1. User can click "Place Order" from the cart and see a loading spinner while the order submits
  2. User sees an order confirmation screen with a "BRW-NNNNN" reference number prominently displayed after successful submission
  3. Confirmation screen shows the full itemized order summary with customizations and the subtotal
  4. User can click "Start a New Order" on the confirmation screen and be returned to the menu with an empty cart
  5. If order submission fails, the user sees an inline error message and a "Try Again" button — their cart is not lost
**Plans**: TBD

### Phase 5: Polish
**Goal**: The entire application is fully usable on any device from 390px mobile to 1920px desktop, with smooth Framer Motion animations on all meaningful UI transitions, and all motion respects `prefers-reduced-motion`
**Depends on**: Phase 4
**Requirements**: F5-01, F5-02, F5-03, F5-04, F5-05, F5-06, F5-07, F6-01, F6-02, F6-03, F6-04, F6-05, F6-06, F6-07, F6-08
**Success Criteria** (what must be TRUE):
  1. The full ordering flow (browse → customize → cart → confirm) works without horizontal scrolling at 390px mobile viewport
  2. Menu grid displays 1 column on mobile, 2 columns at 768px, and 3 columns at 1024px+; cart is full-screen on mobile and a slide-over panel on desktop
  3. Menu cards stagger-animate into view on load; category filter pills animate on click; customization modal and cart drawer animate open/close with 150–200ms transitions
  4. All interactive elements (buttons, steppers, cart icon) have 44×44px minimum touch targets
  5. Setting `prefers-reduced-motion: reduce` in the OS disables all Framer Motion transforms and transitions globally

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/4 | Not started | - |
| 2. Menu Browsing | 0/TBD | Not started | - |
| 3. Customization & Cart | 0/TBD | Not started | - |
| 4. Order Placement | 0/TBD | Not started | - |
| 5. Polish | 0/TBD | Not started | - |

---
*Roadmap created: 2026-06-15*
*Coverage: 70 v1 requirements across 5 phases — 0 orphaned*