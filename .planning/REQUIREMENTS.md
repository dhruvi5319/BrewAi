# Requirements: BrewAI

**Defined:** 2026-06-15
**Core Value:** A customer can browse the full menu, customize their drink exactly how they want it, and place an order — seamlessly, beautifully, on any device.

## v1 Requirements

### Design System & Foundation (F0)

- [ ] **F0-01**: Design token system implemented in Tailwind config (colors, radii, font families, scale)
- [ ] **F0-02**: Playfair Display + Inter fonts bundled locally (no CDN runtime fetch)
- [ ] **F0-03**: Reusable component primitives: Button, Card, Input, Modal, Spinner — all follow design system spec
- [ ] **F0-04**: Focus rings are 2px solid #C8922A with 2px offset on all interactive elements
- [ ] **F0-05**: Framer Motion animation variants defined globally (fade, slide, scale, stagger)
- [ ] **F0-06**: Reduced-motion guard applied globally — `prefers-reduced-motion` disables all transforms/transitions

### Menu Browsing (F1)

- [ ] **F1-01**: User can view full menu grid with category filter bar and "All" default selection
- [ ] **F1-02**: User can filter menu by category (Espresso, Cold Brew, Pour Over, Tea) with instant feedback
- [ ] **F1-03**: User can re-click active category filter to deselect and return to "All"
- [ ] **F1-04**: User can search menu by drink name with debounced input
- [ ] **F1-05**: User sees skeleton loading state while menu items are fetching
- [ ] **F1-06**: User sees empty state with canonical message "No drinks match your search. Try 'cold brew' or browse All." when no results
- [ ] **F1-07**: User sees error state with retry action when menu fails to load
- [ ] **F1-08**: Menu items display name (Playfair Display), description, base price, and category badge

### Drink Customization (F2)

- [ ] **F2-01**: User can open a customization modal for any menu item that has customizations enabled
- [ ] **F2-02**: User can select drink size (Small, Medium, Large where available) — default is Medium if available, else first
- [ ] **F2-03**: User can select milk type (Whole, Oat, Almond, Skim, None)
- [ ] **F2-04**: User can select temperature (Hot, Iced, Blended) where applicable
- [ ] **F2-05**: User can adjust espresso shot count where applicable (not shown for non-espresso drinks)
- [ ] **F2-06**: User can select extras/add-ons with per-item price deltas
- [ ] **F2-07**: User sees real-time price update as they change options
- [ ] **F2-08**: User can adjust quantity (1–10) before adding to cart
- [ ] **F2-09**: User can add customized drink to cart from the modal
- [ ] **F2-10**: Modal closes and cart badge updates after successful add

### Cart Management (F3)

- [ ] **F3-01**: User can view cart as a slide-over drawer (desktop) or full-screen panel (mobile)
- [ ] **F3-02**: User sees each cart line item with drink name, customization summary, quantity, and line total
- [ ] **F3-03**: User can increase or decrease quantity of any cart item
- [ ] **F3-04**: User can remove individual items from cart
- [ ] **F3-05**: User can clear the entire cart
- [ ] **F3-06**: User sees cart subtotal updating in real time as items are modified
- [ ] **F3-07**: User sees empty cart state when cart has no items
- [ ] **F3-08**: Cart state persists within the session (Zustand store; not persisted across browser restarts)
- [ ] **F3-09**: Cart badge on nav shows item count, animates on add

### Order Placement (F4)

- [ ] **F4-01**: User can submit their cart as an order from the cart panel
- [ ] **F4-02**: User sees loading state during order submission
- [ ] **F4-03**: User sees error state with retry option if order submission fails
- [ ] **F4-04**: User sees confirmation screen with order reference number after successful placement
- [ ] **F4-05**: Confirmation screen shows order summary (items, customizations, total)
- [ ] **F4-06**: User can start a new order from the confirmation screen (clears cart, returns to menu)
- [ ] **F4-07**: Order is persisted to SQLite (orders + order_items tables)
- [ ] **F4-08**: Order payload includes: items array, customizations JSON, quantities, unit prices, total

### Responsive Layout (F5)

- [ ] **F5-01**: App is fully usable at 390px (mobile) without horizontal scrolling
- [ ] **F5-02**: Menu grid adapts: 1 column at mobile, 2 at tablet (768px), 3 at desktop (1024px+)
- [ ] **F5-03**: Navigation adapts between mobile hamburger/bottom bar and desktop top nav
- [ ] **F5-04**: All touch targets are minimum 44×44px
- [ ] **F5-05**: Customization modal renders as bottom sheet on mobile, centered dialog on desktop
- [ ] **F5-06**: Cart renders full-screen on mobile, slide-over on desktop
- [ ] **F5-07**: Confirmation order reference is visible above the fold at 390px

### Animations & Interactions (F6)

- [ ] **F6-01**: Menu items stagger-animate into view on load (150ms delay between items)
- [ ] **F6-02**: Category filter transitions have 150ms ease color/border animation
- [ ] **F6-03**: Customization modal animates open/close (200ms ease transform)
- [ ] **F6-04**: Cart drawer slides in/out with 200ms ease transform
- [ ] **F6-05**: Cart badge pops (scale) when item count changes
- [ ] **F6-06**: Add-to-cart button has active state feedback (scale 0.97, 150ms)
- [ ] **F6-07**: Page transitions use fade animation (150ms)
- [ ] **F6-08**: All animations are disabled when `prefers-reduced-motion: reduce` is active

### REST API & Backend (F7)

- [ ] **F7-01**: `GET /api/menu` returns full menu with categories and items
- [ ] **F7-02**: `GET /api/menu/categories` returns distinct category list
- [ ] **F7-03**: `GET /api/menu/:id` returns single item with options JSON
- [ ] **F7-04**: `POST /api/orders` accepts order payload, validates, persists, returns order with reference
- [ ] **F7-05**: `GET /api/orders/:id` returns order with line items
- [ ] **F7-06**: SQLite database auto-initializes on first server start (creates tables + seeds menu data)
- [ ] **F7-07**: API returns typed error responses with codes (e.g., MENU_FETCH_FAILED, VALIDATION_ERROR, ORDER_NOT_FOUND)
- [ ] **F7-08**: Express server binds to 0.0.0.0:3000; Vite dev server proxies `/api` to Express

### Infrastructure & Sandbox (Cross-cutting)

- [ ] **INF-01**: Docker image uses `node:20-bookworm-slim` (Debian) — never Alpine
- [ ] **INF-02**: App starts with a single command and serves on port 3000 bound to 0.0.0.0
- [ ] **INF-03**: All npm dependencies resolvable from registry.npmjs.org (no non-allowlisted CDN fetches)
- [ ] **INF-04**: No `curl`/`wget` binary downloads in Dockerfile or build scripts
- [ ] **INF-05**: Production build output is served by Express static middleware (single container, no separate nginx)
- [ ] **INF-06**: No `X-Frame-Options: DENY` or `frame-ancestors 'none'` headers (preview iframe compatibility)

## v2 Requirements

### User Accounts

- **AUTH-01**: User can create an account with email and password
- **AUTH-02**: User can log in and access order history
- **AUTH-03**: Session persists across browser restarts

### Order Management

- **ORD-01**: User can view their order history
- **ORD-02**: User can reorder a previous order with one click
- **ORD-03**: Real-time order status tracking (queued → preparing → ready)

### Admin / CMS

- **ADM-01**: Admin can add, edit, and remove menu items
- **ADM-02**: Admin can toggle item availability
- **ADM-03**: Admin can view all orders with status management

### Payments

- **PAY-01**: User can pay via card through a payment gateway
- **PAY-02**: User receives email receipt after payment

## Out of Scope

| Feature | Reason |
|---------|--------|
| AI/ML features | Name is brand identity only; no AI functionality in scope |
| User authentication (v1) | Guest-only ordering reduces scope; validates core flow first |
| Payment processing (v1) | Order placement is UI-complete only; no gateway integration |
| Real-time order tracking (v1) | Deferred; confirmation screen is sufficient for v1 validation |
| Admin / CMS panel (v1) | Menu managed via SQLite seed data; no admin UI needed for v1 |
| Native mobile app | Web-first, responsive design serves all devices |
| OAuth / social login | Not applicable for v1 guest ordering |
| Push notifications | No user accounts in v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| F0-01 | Phase 1 — Foundation | Pending |
| F0-02 | Phase 1 — Foundation | Pending |
| F0-03 | Phase 1 — Foundation | Pending |
| F0-04 | Phase 1 — Foundation | Pending |
| F0-05 | Phase 1 — Foundation | Pending |
| F0-06 | Phase 1 — Foundation | Pending |
| F7-01 | Phase 1 — Foundation | Pending |
| F7-02 | Phase 1 — Foundation | Pending |
| F7-03 | Phase 1 — Foundation | Pending |
| F7-04 | Phase 1 — Foundation | Pending |
| F7-05 | Phase 1 — Foundation | Pending |
| F7-06 | Phase 1 — Foundation | Pending |
| F7-07 | Phase 1 — Foundation | Pending |
| F7-08 | Phase 1 — Foundation | Pending |
| INF-01 | Phase 1 — Foundation | Pending |
| INF-02 | Phase 1 — Foundation | Pending |
| INF-03 | Phase 1 — Foundation | Pending |
| INF-04 | Phase 1 — Foundation | Pending |
| INF-05 | Phase 1 — Foundation | Pending |
| INF-06 | Phase 1 — Foundation | Pending |
| F1-01 | Phase 2 — Menu Browsing | Pending |
| F1-02 | Phase 2 — Menu Browsing | Pending |
| F1-03 | Phase 2 — Menu Browsing | Pending |
| F1-04 | Phase 2 — Menu Browsing | Pending |
| F1-05 | Phase 2 — Menu Browsing | Pending |
| F1-06 | Phase 2 — Menu Browsing | Pending |
| F1-07 | Phase 2 — Menu Browsing | Pending |
| F1-08 | Phase 2 — Menu Browsing | Pending |
| F2-01 | Phase 3 — Customization & Cart | Pending |
| F2-02 | Phase 3 — Customization & Cart | Pending |
| F2-03 | Phase 3 — Customization & Cart | Pending |
| F2-04 | Phase 3 — Customization & Cart | Pending |
| F2-05 | Phase 3 — Customization & Cart | Pending |
| F2-06 | Phase 3 — Customization & Cart | Pending |
| F2-07 | Phase 3 — Customization & Cart | Pending |
| F2-08 | Phase 3 — Customization & Cart | Pending |
| F2-09 | Phase 3 — Customization & Cart | Pending |
| F2-10 | Phase 3 — Customization & Cart | Pending |
| F3-01 | Phase 3 — Customization & Cart | Pending |
| F3-02 | Phase 3 — Customization & Cart | Pending |
| F3-03 | Phase 3 — Customization & Cart | Pending |
| F3-04 | Phase 3 — Customization & Cart | Pending |
| F3-05 | Phase 3 — Customization & Cart | Pending |
| F3-06 | Phase 3 — Customization & Cart | Pending |
| F3-07 | Phase 3 — Customization & Cart | Pending |
| F3-08 | Phase 3 — Customization & Cart | Pending |
| F3-09 | Phase 3 — Customization & Cart | Pending |
| F4-01 | Phase 4 — Order Placement | Pending |
| F4-02 | Phase 4 — Order Placement | Pending |
| F4-03 | Phase 4 — Order Placement | Pending |
| F4-04 | Phase 4 — Order Placement | Pending |
| F4-05 | Phase 4 — Order Placement | Pending |
| F4-06 | Phase 4 — Order Placement | Pending |
| F4-07 | Phase 4 — Order Placement | Pending |
| F4-08 | Phase 4 — Order Placement | Pending |
| F5-01 | Phase 5 — Polish | Pending |
| F5-02 | Phase 5 — Polish | Pending |
| F5-03 | Phase 5 — Polish | Pending |
| F5-04 | Phase 5 — Polish | Pending |
| F5-05 | Phase 5 — Polish | Pending |
| F5-06 | Phase 5 — Polish | Pending |
| F5-07 | Phase 5 — Polish | Pending |
| F6-01 | Phase 5 — Polish | Pending |
| F6-02 | Phase 5 — Polish | Pending |
| F6-03 | Phase 5 — Polish | Pending |
| F6-04 | Phase 5 — Polish | Pending |
| F6-05 | Phase 5 — Polish | Pending |
| F6-06 | Phase 5 — Polish | Pending |
| F6-07 | Phase 5 — Polish | Pending |
| F6-08 | Phase 5 — Polish | Pending |

**Coverage:**
- v1 requirements: 70 total (F0×6, F1×8, F2×10, F3×9, F4×8, F5×7, F6×8, F7×8, INF×6)
- Mapped to phases: 70
- Unmapped: 0 ✓

*Note: REQUIREMENTS.md header previously stated 57 total; actual count by enumerated IDs is 70.*

---
*Requirements defined: 2026-06-15*
*Last updated: 2026-06-15 after initial definition*
