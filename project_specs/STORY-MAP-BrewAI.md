# Story Map
# BrewAI — Specialty Coffee Shop Web Application

| Field | Value |
|---|---|
| **Product Name** | BrewAI |
| **Version** | 1.0 |
| **Date** | 2026-06-15 |
| **Related Personas** | PERSONAS-BrewAI.md (PER-01, PER-02, PER-03) |
| **Related JTBD** | JTBD-BrewAI.md |
| **Related Journeys** | JOURNEYS-BrewAI.md |
| **Related User Stories** | UserStories-BrewAI.md |
| **Related PRD** | PRD-BrewAI.md |
| **Status** | Active |

---

## Overview

This Story Map organises all 36 BrewAI user stories into a two-dimensional grid:

- **X-axis (columns):** Journey stages derived from JOURNEYS-BrewAI.md — the shared backbone all three personas traverse
- **Y-axis (rows):** Activities and stories within each stage, grouped by Epic (F0–F7)
- **NaC column:** Natural Acceptance Criteria — testable criteria derived from the intersection of a JTBD outcome, a journey stage, and the specific story being mapped
- **Release column:** Increment assignment (R1 = MVP/P0 core loop, R2 = MVP/P0 complete, R3 = Production polish/P1)

### NaC Concept

NaC (Natural Acceptance Criteria) bridges *why* a story matters (JTBD outcome) to *what* confirms it works (testable criterion). Every NaC in this document is derived from a specific JTBD outcome applied to the journey stage context — none are invented.

**Derivation format:** `JTBD-XX.Y [outcome] → [journey stage context] → testable criterion`

### Story Map ID Convention

Map entries use: `SM-{Epic}.{NN}` (e.g., SM-0.1 = Epic 0 first entry, SM-1.1 = Epic 1 first entry)

### Shared Journey Backbone

All three personas traverse the same core guest ordering flow. Journey stages (column headers) are derived from the cross-journey pattern:

| Stage | Description | Key Journeys |
|---|---|---|
| **S0: Foundation** | Design system + API — invisible infrastructure enabling every other stage | All |
| **S1: Land & Orient** | User arrives at the menu page; first impression and visual quality | JRN-01.1, JRN-01.2, JRN-02.1, JRN-03.1 |
| **S2: Browse & Filter** | User scans menu, applies category filter or keyword search | JRN-01.1, JRN-01.2, JRN-02.1, JRN-03.1 |
| **S3: Select & Customize** | User opens customization modal, configures drink attributes | JRN-01.1, JRN-01.2, JRN-02.1, JRN-02.2, JRN-03.1, JRN-03.2 |
| **S4: Cart & Recovery** | User reviews cart, adjusts, corrects mistakes | JRN-01.1, JRN-02.1, JRN-02.2, JRN-03.2 |
| **S5: Place & Confirm** | User places order; confirmation screen appears | JRN-01.1, JRN-02.1, JRN-03.2 |
| **S6: Polish & Access** | Responsive layout, animations, accessibility overlays — quality layer | All |

---
---

## Story Map Matrix

> **Reading the table:** Each row is one user story. Columns represent the journey stage the story primarily serves. NaC is derived from JTBD → stage → story. Release is R1 (MVP core), R2 (MVP complete), or R3 (production polish).

### Epic 0 — Design System & Component Foundation (F0)

Stories in Epic 0 are foundational infrastructure. They primarily serve **S0: Foundation** — they enable every other stage but have no direct journey stage of their own. They are mapped to S0 and marked with the personas they most directly benefit.

| SM-ID | Story | Persona(s) | Stage | NaC | Rel |
|---|---|---|---|---|---|
| SM-0.1 | US-0.1: Consistent Design Tokens | PER-01, PER-03 | S0: Foundation | JTBD-01.2 / JTBD-03.1 → Land & Orient: When the menu page renders, the dark canvas (#0A0A0A), amber accent (#C8922A), and Playfair Display headings are all visible with ≥ 4.5:1 text contrast — no white/grey background anywhere. | R1 |
| SM-0.2 | US-0.2: Bundled Fonts Load Without CDN | PER-02 | S0: Foundation | JTBD-02.1 → Land & Orient: On a network with CDN blocked, Inter and Playfair Display still render correctly — no system-font fallback is shown. | R1 |
| SM-0.3 | US-0.3: Reusable Primitive Components | Dev | S0: Foundation | JTBD-01.1 / JTBD-02.1 → Select & Customize: Button, Modal, Input, and Spinner components are importable from `src/components/ui/index.ts`; all have min-height 44px and strict TypeScript types. | R1 |
| SM-0.4 | US-0.4: Keyboard Focus Rings | PER-03 | S0: Foundation | JTBD-03.1 → Browse & Filter: A keyboard-only session can navigate from the menu page to a product card CTA and back without losing focus — amber 2px focus ring is visible on every focused element. | R1 |

---

### Epic 1 — Menu Browsing & Category Filtering (F1)

Stories in Epic 1 serve **S1: Land & Orient** and **S2: Browse & Filter**.

| SM-ID | Story | Persona(s) | Stage | NaC | Rel |
|---|---|---|---|---|---|
| SM-1.1 | US-1.1: View the Full Menu on Page Load | PER-03 (Jordan) | S1: Land & Orient | JTBD-03.1 → Land & Orient: Every menu card displays a readable, flavour-forward description and the correct price; 8 skeleton placeholders appear while the API call is in-flight; cards animate in with staggered fadeIn + slideUp. | R1 |
| SM-1.2 | US-1.2: Filter Menu by Category | PER-01 (Marcus) | S2: Browse & Filter | JTBD-01.2 → Browse & Filter: Tapping the Espresso filter pill shows only espresso-based drinks with no page reload, within 15 seconds of page load; the active pill is highlighted in amber. | R1 |
| SM-1.3 | US-1.3: Search Menu by Keyword | PER-01 (Marcus) | S2: Browse & Filter | JTBD-01.2 → Browse & Filter: Typing "Kenya" in the search input filters cards in real time (debounced 200ms, no reload) matching name and description — the Kenya Seasonal Espresso card appears without any page navigation. | R1 |
| SM-1.4 | US-1.4: Helpful Empty State | PER-03 (Jordan) | S2: Browse & Filter | JTBD-03.1 → Browse & Filter: When no cards match the active filter + search, an empty state with "No drinks match your search. Try 'cold brew' or browse All." and a "Clear filters" CTA is displayed — no blank screen, no skeleton cards. | R1 |
| SM-1.5 | US-1.5: Recover from Menu Load Failure | PER-02 (Priya) | S1: Land & Orient | JTBD-02.1 → Land & Orient: If GET /api/menu returns a 5xx, the skeleton is replaced by a human-readable error message and a "Retry" button — no manual page refresh required. | R1 |

---

### Epic 2 — Drink Customization Modal (F2)

Stories in Epic 2 serve **S3: Select & Customize**.

| SM-ID | Story | Persona(s) | Stage | NaC | Rel |
|---|---|---|---|---|---|
| SM-2.1 | US-2.1: Open Customization Modal | PER-01 (Marcus) | S3: Select & Customize | JTBD-01.1 → Select & Customize: Tapping "Customize" opens a modal with all applicable controls (size, milk, temp, shots, add-ons) in a single view; modal animates in with scaleIn + fadeIn (200ms); focus is trapped inside. | R1 |
| SM-2.2 | US-2.2: Select Size and See Price Update | PER-03 (Jordan) | S3: Select & Customize | JTBD-03.2 → Select & Customize: Selecting a size immediately updates the displayed total price (base + size delta + addons) — update is visible within 100ms; both per-item and total prices are shown. | R1 |
| SM-2.3 | US-2.3: Customize Milk, Temp, Shot Count | PER-01 (Marcus) | S3: Select & Customize | JTBD-01.1 → Select & Customize: For an espresso drink, milk selector, temperature selector, and shot count (Single/Double/Triple) are all interactable in one modal; shot count is completely absent for non-espresso drinks. | R1 |
| SM-2.4 | US-2.4: Add Extras and See Total Price Update | PER-03 (Jordan) | S3: Select & Customize | JTBD-03.2 → Select & Customize: Tapping "Vanilla Syrup (+$0.75)" updates the total from $6.50 to $7.25 within 100ms; per-extra price delta is shown inline next to each add-on chip. | R1 |
| SM-2.5 | US-2.5: Add Special Instructions | PER-01 (Marcus) | S3: Select & Customize | JTBD-01.1 → Select & Customize: The "Special instructions" textarea is present with a 200-char limit and live counter; the entered text appears in the CartItem.customizations.specialInstructions field when added to cart. | R1 |
| SM-2.6 | US-2.6: Set Quantity and Add to Cart | PER-02 (Priya) | S3: Select & Customize | JTBD-02.1 → Select & Customize: Tapping "Add to Cart" with quantity=1 closes the modal with exit animation, shows a toast "[Drink Name] added to cart," and increments the cart badge — all within Priya's 2-minute ordering window. | R1 |

---

### Epic 3 — Cart Management (F3)

Stories in Epic 3 serve **S4: Cart & Recovery**.

| SM-ID | Story | Persona(s) | Stage | NaC | Rel |
|---|---|---|---|---|---|
| SM-3.1 | US-3.1: View the Cart and Its Items | PER-01 (Marcus) | S4: Cart & Recovery | JTBD-01.3 → Cart & Recovery: The cart line item shows a human-readable customization summary (e.g., "Large · Oat · Iced · Double · Caramel"); all selected extras are listed, not truncated; cart state survives navigation to menu and back. | R1 |
| SM-3.2 | US-3.2: Adjust Item Quantity in the Cart | PER-02 (Priya) | S4: Cart & Recovery | JTBD-02.2 → Cart & Recovery: Tapping the increment/decrement stepper immediately updates the subtotal in the cart footer; decrementing to 0 removes the line item; cart badge count updates immediately. | R1 |
| SM-3.3 | US-3.3: Remove an Item from the Cart | PER-02 (Priya) | S4: Cart & Recovery | JTBD-02.2 → Cart & Recovery: The "×" remove button on a single line item removes only that item (not the whole cart) immediately with a fade + slide-left animation; cart badge drops by exactly that item's quantity. | R1 |
| SM-3.4 | US-3.4: Clear All Items from the Cart | PER-02 (Priya) | S4: Cart & Recovery | JTBD-02.2 → Cart & Recovery: "Clear Cart" shows a confirmation prompt ("Remove all items from your cart?"); clicking "Cancel" leaves cart unchanged; clicking "Clear All" empties the cart and shows the empty state. | R1 |
| SM-3.5 | US-3.5: Empty Cart State | PER-03 (Jordan) | S4: Cart & Recovery | JTBD-03.3 → Cart & Recovery: When the cart is empty, the drawer shows "Your cart is empty" and a "Browse Menu" CTA; the "Place Order" button is visually disabled and aria-disabled="true". | R1 |

---

### Epic 4 — Order Placement & Confirmation (F4)

Stories in Epic 4 serve **S5: Place & Confirm**.

| SM-ID | Story | Persona(s) | Stage | NaC | Rel |
|---|---|---|---|---|---|
| SM-4.1 | US-4.1: Place an Order from the Cart | PER-02 (Priya) | S5: Place & Confirm | JTBD-02.1 → Place & Confirm: Tapping "Place Order" submits POST /api/orders with a loading spinner + disabled state; on HTTP 201, cart is cleared and the confirmation screen appears — all without account creation at any step. | R1 |
| SM-4.2 | US-4.2: Clear Order Confirmation Screen | PER-01 (Marcus) | S5: Place & Confirm | JTBD-01.3 / JTBD-02.3 / JTBD-03.3 → Place & Confirm: On a 390px viewport, order reference (BRW-NNNNN in Playfair Display amber), itemised summary, and "15–20 minutes" ready time are all visible without scrolling. | R1 |
| SM-4.3 | US-4.3: Handle Order Submission Errors | PER-02 (Priya) | S5: Place & Confirm | JTBD-02.1 → Place & Confirm: If POST /api/orders fails, the loading state clears, the "Place Order" button re-enables, cart contents are fully preserved, and an inline error with "Try Again" is shown. | R1 |
| SM-4.4 | US-4.4: Start a New Order | PER-03 (Jordan) | S5: Place & Confirm | JTBD-03.3 → Place & Confirm: The "Start a New Order" button on the confirmation screen navigates to the menu page with the cart already cleared; the menu does not show a blank state for longer than the standard fetch spinner. | R1 |

---

### Epic 5 — Responsive Layout & Navigation (F5)

Stories in Epic 5 serve **S6: Polish & Access** — they overlay quality improvements across all stages.

| SM-ID | Story | Persona(s) | Stage | NaC | Rel |
|---|---|---|---|---|---|
| SM-5.1 | US-5.1: Mobile Compact Header | PER-02 (Priya) | S6: Polish & Access | JTBD-02.1 → Land & Orient: Below 768px, a compact header with logo (left) and cart icon with badge (right) is shown; the cart icon is always accessible; no nav links clutter the header. | R2 |
| SM-5.2 | US-5.2: Responsive Menu Grid | PER-03 (Jordan) | S6: Polish & Access | JTBD-03.1 → Browse & Filter: The menu grid uses 1 column at <640px, 2 at 640-1023px, 3 at 1024-1535px, 4 at 1536px+; no horizontal scroll appears at any viewport width from 320px to 1920px. | R2 |
| SM-5.3 | US-5.3: Full-Screen Cart on Mobile | PER-02 (Priya) | S6: Polish & Access | JTBD-02.1 / JTBD-02.2 → Cart & Recovery: Below 768px, the cart drawer uses fixed inset-0 (100vw × 100vh); the customization modal uses bottom-sheet style (fixed bottom-0, max-h-[90vh]). | R2 |
| SM-5.4 | US-5.4: Touch Targets on Mobile | PER-02 (Priya) | S6: Polish & Access | JTBD-02.1 → Select & Customize: All interactive elements — category pills, card CTAs, modal controls, cart steppers, "Place Order" — have a minimum tap target of 44×44px on 390px viewport; no accidental mis-taps on adjacent elements. | R2 |

---

### Epic 6 — Animated Interactions & Micro-Animations (F6)

Stories in Epic 6 serve **S6: Polish & Access** — animations layer over all stages.

| SM-ID | Story | Persona(s) | Stage | NaC | Rel |
|---|---|---|---|---|---|
| SM-6.1 | US-6.1: Card Entrance Animations | PER-01 (Marcus) | S6: Polish & Access | JTBD-01.2 / JTBD-03.1 → Land & Orient: On initial menu render, cards animate in with staggered fadeIn + slideUp (200ms/card, 50ms stagger); when category filter changes, leaving cards animate out and new cards animate in. | R2 |
| SM-6.2 | US-6.2: Modal and Drawer Transitions | PER-03 (Jordan) | S6: Polish & Access | JTBD-03.2 / JTBD-03.3 → Select & Customize / Place & Confirm: The customization modal opens with scaleIn + fadeIn (200ms); the cart drawer slides in from right on desktop and up from bottom on mobile; exit animations play before unmount. | R2 |
| SM-6.3 | US-6.3: Feedback Toasts on Add to Cart | PER-02 (Priya) | S6: Polish & Access | JTBD-02.1 → Select & Customize: After "Add to Cart," a toast slides in from bottom-right with "[Drink Name] added to cart" and auto-dismisses after 3 seconds; the cart badge pops (scale 1→1.3→1 over 300ms). | R2 |
| SM-6.4 | US-6.4: Reduced Motion Support | All | S6: Polish & Access | JTBD-02.1 → All stages: When prefers-reduced-motion is set, all animated components render without motion (elements appear/disappear instantly); all functional behaviors remain fully intact. | R2 |

---

### Epic 7 — REST API & Data Persistence (F7)

Stories in Epic 7 serve **S0: Foundation** — the API enables Land & Orient (menu load) and Place & Confirm (order submission).

| SM-ID | Story | Persona(s) | Stage | NaC | Rel |
|---|---|---|---|---|---|
| SM-7.1 | US-7.1: Load Menu Data from API | PER-02 (Priya) | S0: Foundation → S1 | JTBD-02.1 → Land & Orient: GET /api/menu returns all available items with descriptions, prices, categories, and options; the menu page is interactive in under 2.5 seconds on 4G with the seeded data. | R1 |
| SM-7.2 | US-7.2: Persist an Order to Database | PER-01 (Marcus) | S0: Foundation → S5 | JTBD-01.3 → Place & Confirm: POST /api/orders persists the full order atomically; returns HTTP 201 with orderId in BRW-NNNNN format; a failed transaction is fully rolled back with no partial order. | R1 |
| SM-7.3 | US-7.3: Server Starts Without Manual Setup | Dev | S0: Foundation | JTBD-02.1 → Land & Orient: Running `npm start` on a cold Debian Docker container brings up the server with schema and 20-30 seed items ready; no manual setup steps; console outputs `BrewAI server running on http://0.0.0.0:3000`. | R1 |
| SM-7.4 | US-7.4: API Validates Inputs and Returns Structured Errors | Dev | S0: Foundation | JTBD-02.1 → Place & Confirm: POST /api/orders with an empty items array returns { error: { code: 'EMPTY_ORDER' }, status: 400 }; all SQL queries use parameterized statements — no string interpolation. | R1 |

---
---

## NaC Derivation Table

Full traceability chain: JTBD outcome → journey stage → Natural Acceptance Criterion → story.

| JTBD-ID | Outcome (from Success Measure) | Journey Stage | NaC (Testable Criterion) | Story(ies) |
|---|---|---|---|---|
| JTBD-01.1 | All 5 customizations configurable in single modal in < 60s | S3: Select & Customize (JRN-01.1 Stage 4) | Given the customization modal is open for an espresso drink, when the user sets milk=Oat, shots=Double, temp=Iced, size=Medium, and adds Caramel, then all five selections are reflected in the modal and "Add to Cart" is enabled — within 60 seconds of modal open. | US-2.1, US-2.3, US-2.5 |
| JTBD-01.2 | Espresso category visible and filtered in ≤ 15 seconds | S2: Browse & Filter (JRN-01.1 Stage 2, JRN-01.2 Stage 1) | Given the menu page loads, when the user taps the Espresso filter pill (or types a keyword), then only matching drinks are displayed with no page reload — within 15 seconds of page load; real-time results update as keystrokes occur. | US-1.2, US-1.3 |
| JTBD-01.2 | UI visual quality signals craft on first load | S1: Land & Orient (JRN-01.1 Stage 1, JRN-01.2 Stage 2) | Given the menu page renders, the dark canvas, amber headings (Playfair Display), and drink descriptions are visible; no white background, no placeholder text on any card. | US-0.1, US-1.1 |
| JTBD-01.3 | Full customization summary on cart line item; ≤ 3 taps to confirm | S4: Cart & Recovery (JRN-01.1 Stage 5) | Given a customized item is in the cart, then the cart line item displays milk type, shot count, temperature, and all add-ons in a readable summary (e.g., "Large · Oat · Iced · Double · Caramel"); order placeable in ≤ 3 taps from cart view. | US-3.1, US-4.1, US-4.2 |
| JTBD-01.3 | No customization data lost navigating back to menu | S4: Cart & Recovery (JRN-01.1 Stage 5, JRN-01.2 Stage 4) | Given a customized item is in the cart, when the user navigates back to the menu and returns, cart contents are identical to before navigation — no data loss. | US-3.1 |
| JTBD-02.1 | Full flow completes in < 120s on 4G mobile; guest-only | S1–S5 (JRN-02.1 all stages) | Given a mid-tier Android on 4G, when a guest user navigates from menu load (interactive < 2.5s) to order confirmation, the flow completes in < 120 seconds with no account creation prompt at any step. | US-7.1, US-1.1, US-1.2, US-2.6, US-3.1, US-4.1 |
| JTBD-02.1 | All tap targets ≥ 44×44px on mobile | S3: Select & Customize / S6: Polish (JRN-02.1 Stage 2–4) | Given a 390px mobile viewport, all interactive elements — category pills, card CTAs, modal controls, cart steppers, "Place Order" — have a minimum tap target of 44×44px; a usability check confirms no accidental mis-taps. | US-5.4, US-0.3 |
| JTBD-02.2 | Cart unchanged after back-navigation; item removable individually | S4: Cart & Recovery (JRN-02.2 Stages 2 + 4) | Given an item is in the cart, when the user navigates back to the menu and returns, cart contents are identical; a single item can be removed via its "×" button without clearing the rest; cart badge drops by exactly that item's count. | US-3.1, US-3.3, US-3.4 |
| JTBD-02.3 | Order number + ready time above fold at 390px | S5: Place & Confirm (JRN-02.1 Stage 5) | Given a successful order submission on a 390px viewport, the order reference number (BRW-NNNNN) and "15–20 minutes" ready time are both visible without scrolling on the confirmation screen, within 3 seconds of screen load. | US-4.2 |
| JTBD-03.1 | Target drink identified in ≤ 90s via browse alone | S1–S2: Land & Browse (JRN-03.1 Stages 1–5) | Given the menu page loads with no search pre-filled, when the user taps a category filter and reads card descriptions, a drink is identifiable using only card content — no barista input — within 90 seconds of page load. | US-1.1, US-1.2, US-1.4 |
| JTBD-03.1 | Empty search/filter state shows helpful prompt | S2: Browse & Filter (JRN-03.1 Stage 3) | Given the user applies a filter or search that returns zero results, an empty state with the message "No drinks match your search. Try 'cold brew' or browse All." and a "Clear filters" action is shown — no blank screen, no skeleton cards. | US-1.4 |
| JTBD-03.2 | Final price predictable from in-modal display before Add to Cart | S3: Select & Customize (JRN-03.2 Stages 2–3) | Given the customization modal is open, when the user selects a size and 2 add-ons, the displayed total matches base price + size delta + add-on sum, updating within 100ms of each selection; per-extra delta is shown inline. | US-2.2, US-2.4 |
| JTBD-03.2 | No irrelevant controls in modal (shot count absent on non-espresso) | S3: Select & Customize (JRN-03.2 Stage 1) | Given the customization modal is open for a non-espresso drink (e.g., Hibiscus Cold Brew), the shot count selector is completely absent — only relevant controls are rendered. | US-2.3 |
| JTBD-03.3 | Order number + itemised summary readable at 390px without scroll | S5: Place & Confirm (JRN-03.2 Stage 5) | Given the confirmation screen renders after a successful order, the order number, drink name, customization summary, and estimated ready time are all visible on a 390px viewport without vertical scrolling; "Start a New Order" CTA is clearly labelled. | US-4.2, US-4.4 |
| JTBD-03.3 | Confirmation screen matches brand aesthetics | S5: Place & Confirm (JRN-03.2 Stage 5) | Given the confirmation screen renders, it shows dark background, amber order number in Playfair Display, success icon, and "Start a New Order" CTA — the design matches the premium brand experience established on the menu page. | US-4.2, US-0.1 |

---
---

## Release Planning

---

### R1: MVP Core — "The Complete Guest Ordering Loop"

**Theme:** A guest user can browse the full menu, customize a drink, manage a cart, and place an order — end-to-end — on any device.

**Rationale:** R1 contains every P0 story required to complete at least one full journey (JRN-02.1: Sub-2-Minute Mobile Order) from menu load to confirmation screen. All critical JTBD outcomes (JTBD-01.1, JTBD-01.2, JTBD-01.3, JTBD-02.1, JTBD-02.3, JTBD-03.1, JTBD-03.2) have at least one story in R1. Backend stories (F7) are in R1 because the frontend cannot function without them.

**Stories (28 stories — all P0):**

| SM-ID | Story | Feature | Personas Served |
|---|---|---|---|
| SM-0.1 | US-0.1: Consistent Design Tokens | F0 | PER-01, PER-03 |
| SM-0.2 | US-0.2: Bundled Fonts Load Without CDN | F0 | PER-02 |
| SM-0.3 | US-0.3: Reusable Primitive Components | F0 | All (Dev) |
| SM-0.4 | US-0.4: Keyboard Focus Rings | F0 | PER-03 |
| SM-1.1 | US-1.1: View Full Menu on Page Load | F1 | All |
| SM-1.2 | US-1.2: Filter Menu by Category | F1 | PER-01, PER-02 |
| SM-1.3 | US-1.3: Search Menu by Keyword | F1 | PER-01, PER-03 |
| SM-1.4 | US-1.4: Helpful Empty State | F1 | PER-03 |
| SM-1.5 | US-1.5: Recover from Menu Load Failure | F1 | PER-02 |
| SM-2.1 | US-2.1: Open Customization Modal | F2 | PER-01 |
| SM-2.2 | US-2.2: Select Size + Live Price Update | F2 | PER-03 |
| SM-2.3 | US-2.3: Milk, Temp, Shot Count | F2 | PER-01 |
| SM-2.4 | US-2.4: Add Extras + Total Price Update | F2 | PER-03 |
| SM-2.5 | US-2.5: Special Instructions | F2 | PER-01 |
| SM-2.6 | US-2.6: Set Quantity and Add to Cart | F2 | PER-02 |
| SM-3.1 | US-3.1: View Cart and Items | F3 | PER-01 |
| SM-3.2 | US-3.2: Adjust Item Quantity in Cart | F3 | PER-02 |
| SM-3.3 | US-3.3: Remove Item from Cart | F3 | PER-02 |
| SM-3.4 | US-3.4: Clear All Items from Cart | F3 | PER-02 |
| SM-3.5 | US-3.5: Empty Cart State | F3 | PER-03 |
| SM-4.1 | US-4.1: Place an Order from Cart | F4 | PER-02 |
| SM-4.2 | US-4.2: Clear Order Confirmation Screen | F4 | All |
| SM-4.3 | US-4.3: Handle Order Submission Errors | F4 | PER-02 |
| SM-4.4 | US-4.4: Start a New Order | F4 | PER-03 |
| SM-7.1 | US-7.1: Load Menu Data from API | F7 | All |
| SM-7.2 | US-7.2: Persist Order to Database | F7 | PER-01 |
| SM-7.3 | US-7.3: Server Starts Without Manual Setup | F7 | Dev |
| SM-7.4 | US-7.4: API Validates Inputs + Structured Errors | F7 | Dev |

**Personas served:** PER-01 (Marcus), PER-02 (Priya), PER-03 (Jordan) — all three complete at least one full journey.

**JTBD addressed in R1:**
- JTBD-01.1 ✓ (US-2.1, US-2.3, US-2.5)
- JTBD-01.2 ✓ (US-1.1, US-1.2, US-1.3)
- JTBD-01.3 ✓ (US-3.1, US-4.1, US-4.2)
- JTBD-02.1 ✓ (US-7.1, US-1.1, US-1.2, US-2.6, US-3.1, US-4.1)
- JTBD-02.2 ✓ partial (US-3.1, US-3.3, US-3.4 — cart state persistence, remove item)
- JTBD-02.3 ✓ (US-4.2)
- JTBD-03.1 ✓ (US-1.1, US-1.2, US-1.4)
- JTBD-03.2 ✓ (US-2.2, US-2.4)
- JTBD-03.3 ✓ partial (US-4.2 — functional; branded aesthetics pending F6)

**Journeys completable after R1:**
- JRN-01.1: Precision Custom Order ✓ (all 5 stages covered)
- JRN-01.2: Seasonal Drink Discovery ✓ (all 4 stages covered)
- JRN-02.1: Sub-2-Minute Mobile Order ✓ (all 5 stages covered — layout quality in R2)
- JRN-02.2: Cart Recovery After Mis-Add ✓ (all 4 stages covered)
- JRN-03.1: Weekend Menu Discovery ✓ (all 5 stages covered)
- JRN-03.2: Add-On Exploration & Price-Aware Customization ✓ (all 5 stages covered)

---
---

### R2: Production Polish — "Responsive Quality & Premium Animations"

**Theme:** The ordering loop from R1 becomes a production-quality experience — mobile-optimized layouts, polished transitions, and accessibility refinements that convert the app from functional to delightful.

**Rationale:** R2 contains all P1 stories (F5 and F6). These are required for production quality and are implemented alongside R1, not deferred past v1. They address the journey cross-patterns CP-01 through CP-06 identified in JOURNEYS-BrewAI.md. R2 stories do not add new flows — they elevate the quality of R1 flows.

**Stories (8 stories — all P1):**

| SM-ID | Story | Feature | Personas Served |
|---|---|---|---|
| SM-5.1 | US-5.1: Mobile Compact Header | F5 | PER-02 (primary), all |
| SM-5.2 | US-5.2: Responsive Menu Grid | F5 | PER-03 (primary), all |
| SM-5.3 | US-5.3: Full-Screen Cart on Mobile | F5 | PER-02 (primary), all |
| SM-5.4 | US-5.4: Touch Targets on Mobile | F5 | PER-02 (primary), PER-03 |
| SM-6.1 | US-6.1: Card Entrance Animations | F6 | PER-01 (primary), PER-03 |
| SM-6.2 | US-6.2: Modal and Drawer Transitions | F6 | PER-03 (primary), PER-01 |
| SM-6.3 | US-6.3: Feedback Toasts on Add to Cart | F6 | PER-02 (primary), all |
| SM-6.4 | US-6.4: Reduced Motion Support | F6 | All users |

**Personas served:** All three personas benefit; PER-02 (Priya) is the primary canary for F5 quality; PER-01 (Marcus) and PER-03 (Jordan) are primary beneficiaries of F6 animations.

**JTBD further addressed in R2:**
- JTBD-02.1 ✓ complete (US-5.1, US-5.3, US-5.4 close the mobile performance gap)
- JTBD-01.2 ✓ complete (US-6.1 — premium UI signals craft quality with staggered animations)
- JTBD-03.1 ✓ complete (US-6.1 — staggered card entrance, US-5.2 — responsive grid reduces overwhelm)
- JTBD-03.2 ✓ complete (US-6.2 — modal transitions confirm premium feel)
- JTBD-03.3 ✓ complete (US-6.2 — confirmation entrance animation; on-brand visual experience)

**Cross-journey patterns closed in R2:**
- CP-02 (Instant Category Filtering) — US-5.2 + US-6.1 ensure animations don't block filter speed
- CP-03 (Mobile Touch Target Adequacy) — US-5.4 enforces 44×44px across all controls
- CP-05 (Premium Aesthetic Signalling) — US-6.1, US-6.2 deliver the delight moments
- CP-06 (Confirmation Screen Above-Fold) — US-5.3 ensures full-screen cart + confirmation layout on mobile

**v1 Shippable Gate:** R1 + R2 together constitute the full v1 release. No story is deferred beyond R2.

---
---

## Coverage Analysis

---

### Persona Coverage by Release

| Persona | R1 Stories | R2 Stories | Primary JTBD Met in R1 | All JTBD Met After R2 |
|---|---|---|---|---|
| PER-01 Marcus | SM-0.1, SM-1.2, SM-1.3, SM-2.1, SM-2.3, SM-2.5, SM-3.1, SM-4.2, SM-7.2 | SM-6.1, SM-6.2 | JTBD-01.1 ✓, JTBD-01.2 ✓, JTBD-01.3 ✓ | All 3 JTBD fully met ✓ |
| PER-02 Priya | SM-0.2, SM-1.5, SM-2.6, SM-3.2, SM-3.3, SM-3.4, SM-4.1, SM-4.3, SM-7.1 | SM-5.1, SM-5.3, SM-5.4, SM-6.3 | JTBD-02.1 ✓, JTBD-02.2 ✓, JTBD-02.3 ✓ | All 3 JTBD fully met ✓ |
| PER-03 Jordan | SM-0.4, SM-1.1, SM-1.4, SM-2.2, SM-2.4, SM-3.5, SM-4.4 | SM-5.2, SM-6.2, SM-6.4 | JTBD-03.1 ✓, JTBD-03.2 ✓, JTBD-03.3 ✓ | All 3 JTBD fully met ✓ |
| All Personas | SM-1.1, SM-3.1, SM-4.2, SM-7.1, SM-7.3, SM-7.4 | SM-6.4 | Shared journey baseline ✓ | — |

**No persona is left unserved by R1.** Every persona can complete their primary journey with R1 stories alone. R2 elevates the quality of those journeys to production grade.

---

### JTBD Coverage by Release

| JTBD-ID | Persona | Priority | First Addressed | Fully Met | Stories |
|---|---|---|---|---|---|
| JTBD-01.1 | PER-01 | P0 | R1 | R1 | US-2.1, US-2.3, US-2.5 |
| JTBD-01.2 | PER-01 | P0 | R1 | R2 | US-1.1, US-1.2, US-1.3 (R1) + US-6.1 (R2) |
| JTBD-01.3 | PER-01 | P0 | R1 | R1 | US-3.1, US-4.1, US-4.2 |
| JTBD-02.1 | PER-02 | P0 | R1 | R2 | US-1.1, US-1.2, US-2.6, US-3.1, US-4.1, US-7.1 (R1) + US-5.1, US-5.3, US-5.4, US-6.3 (R2) |
| JTBD-02.2 | PER-02 | P1 | R1 | R1 | US-3.1, US-3.3, US-3.4 |
| JTBD-02.3 | PER-02 | P0 | R1 | R1 | US-4.2 |
| JTBD-03.1 | PER-03 | P0 | R1 | R2 | US-1.1, US-1.2, US-1.4 (R1) + US-5.2, US-6.1 (R2) |
| JTBD-03.2 | PER-03 | P0 | R1 | R2 | US-2.2, US-2.4 (R1) + US-6.2 (R2) |
| JTBD-03.3 | PER-03 | P1 | R1 | R2 | US-4.2, US-4.4 (R1) + US-6.2, US-0.1 (R2) |

**JTBD without any story coverage:** None. All 9 JTBD outcomes have at least one story mapped.

---

### Journey Stage Coverage

| Stage | Stories Mapped | Coverage Status |
|---|---|---|
| S0: Foundation | US-0.1–0.4, US-7.1–7.4 | ✓ Full |
| S1: Land & Orient | US-0.1, US-0.2, US-1.1, US-1.5 | ✓ Full |
| S2: Browse & Filter | US-1.2, US-1.3, US-1.4, US-5.2, US-6.1 | ✓ Full |
| S3: Select & Customize | US-2.1–2.6, US-5.4 | ✓ Full |
| S4: Cart & Recovery | US-3.1–3.5, US-5.3 | ✓ Full |
| S5: Place & Confirm | US-4.1–4.4, US-7.2, US-7.4 | ✓ Full |
| S6: Polish & Access | US-5.1–5.4, US-6.1–6.4 | ✓ Full |

**Journey stages without coverage:** None.

---

### Gap Analysis

#### JTBD Gaps
- **No JTBD without stories.** All 9 outcomes (JTBD-01.1 through JTBD-03.3) are addressed by at least one story.
- **Note:** JTBD-01.2 "UI visual quality signals craft" and JTBD-03.1 "discover drink in ≤ 90s" are partially met in R1 but reach full NaC satisfaction only after R2 animations (US-6.1) and responsive grid (US-5.2) are complete. This is acceptable — functional discovery works in R1; premium discovery polish is R2.

#### Journey Stages Without Coverage
- **None.** All 7 stages have mapped stories.

#### Orphan Stories (not mapped to any journey stage)
- **None.** All 36 user stories (US-0.1 through US-7.4) appear in the Story Map Matrix. US-7.3 and US-7.4 are backend infrastructure stories mapped to S0: Foundation — they have no direct journey stage but are required for all journeys to function.

#### Cross-Journey Patterns Not Yet Fully Addressed
- **CP-01 (Customization Summary Completeness):** Addressed by US-3.1 (full line-item summary) in R1. ✓
- **CP-02 (Instant Category Filtering):** Addressed by US-1.2 (client-side filter) in R1; animation polish in R2. ✓
- **CP-03 (Mobile Touch Target Adequacy):** Addressed by US-5.4 in R2. ⚠️ *Risk: If R2 is delayed, Priya's flow may have touch friction — US-5.4 should be treated as a co-dependency of R1 delivery for mobile.*
- **CP-04 (No Account Gate):** Addressed by US-4.1 (no auth check in order placement) and US-7.4 (no auth middleware) in R1. ✓
- **CP-05 (Premium Aesthetic Signalling):** Addressed by US-0.1 (design tokens) in R1; staggered animations in R2. ✓ partial in R1.
- **CP-06 (Confirmation Screen Above-Fold):** Addressed by US-4.2 (390px layout requirement in AC) in R1; full-screen mobile layout in R2. ✓ partial in R1.

**Recommendation:** CP-03 (US-5.4) and US-5.3 (full-screen mobile cart/modal) should be treated as practical R1 dependencies even though they carry P1 priority — Priya's entire JTBD-02.1 success measure depends on touch target accuracy.

---
---

## NaC-to-Acceptance Criteria Mapping

This table verifies that each NaC statement is aligned with (not contradicting) the acceptance criteria written in UserStories-BrewAI.md. The NaC refines the JTBD outcome into a testable scenario; the AC spells out the specific implementation behaviour.

| SM-ID | Story | NaC (Abbreviated) | Key Acceptance Criteria Cross-Check | Alignment |
|---|---|---|---|---|
| SM-0.1 | US-0.1: Design Tokens | Dark canvas visible; amber accent on all CTAs; ≥ 4.5:1 contrast | AC: HTML/body bg = #0A0A0A; CTAs use #C8922A; primary text #F5F0E8 ≥ 4.5:1 contrast | ✓ Aligned |
| SM-0.2 | US-0.2: Bundled Fonts | Fonts render on CDN-blocked network | AC: No Google Fonts CDN request at runtime; @font-face points to /assets/fonts/*.woff2 | ✓ Aligned |
| SM-0.3 | US-0.3: Primitive Components | Button, Modal, Input importable; min-height 44px; strict types | AC: Exported from src/components/ui/index.ts; Button min-height 44px all sizes; no `any` types | ✓ Aligned |
| SM-0.4 | US-0.4: Focus Rings | Keyboard nav from menu to CTA and back without losing focus; amber ring visible | AC: 2px solid #C8922A on focus-visible; all interactive elements keyboard-navigable | ✓ Aligned |
| SM-1.1 | US-1.1: Full Menu Load | Every card has description + price; 8 skeletons while loading; cards animate in | AC: Card shows name, 2-line description, $X.XX price, category badge, CTA; 8 skeleton placeholders; staggered fadeIn + slideUp | ✓ Aligned |
| SM-1.2 | US-1.2: Category Filter | Espresso filter shows only espresso drinks, no reload, within 15s | AC: Filter takes effect immediately (client-side); active pill highlighted accent; no loading state needed | ✓ Aligned |
| SM-1.3 | US-1.3: Keyword Search | "Kenya" filters cards in real time matching name + description | AC: Filters name and description; 200ms debounce; no page reload; AND logic with category filter | ✓ Aligned |
| SM-1.4 | US-1.4: Empty State | Empty state shown with message "No drinks match your search. Try 'cold brew' or browse All." + "Clear filters" when no results | AC: Descriptive message + "Clear filters" action; clicking resets category to 'All' and search to ''; no skeleton shown | ✓ Aligned |
| SM-1.5 | US-1.5: Load Failure | Error message + "Retry" replaces skeleton on 5xx | AC: Human-readable error + "Retry" button; Retry re-invokes fetchMenu(); no skeleton during error state | ✓ Aligned |
| SM-2.1 | US-2.1: Open Modal | Modal with all controls opens on "Customize" tap; scaleIn + fadeIn 200ms; focus trapped | AC: Modal shows drink name, base price, all applicable controls; scaleIn + fadeIn (200ms); Tab cycles within modal; Escape closes | ✓ Aligned |
| SM-2.2 | US-2.2: Size + Price | Size selection updates total within 100ms; per-item and total both shown | AC: Size radio shows price delta (e.g., "Large +$0.75"); total updates as (base + size delta + addons) × qty; both prices in footer | ✓ Aligned |
| SM-2.3 | US-2.3: Milk/Temp/Shots | Shot count present for espresso, absent for non-espresso; Double default | AC: Shot count selector shown only for drinkType='espresso'; Double is default; fieldset+legend grouping | ✓ Aligned |
| SM-2.4 | US-2.4: Add Extras | Vanilla Syrup toggles price delta inline within 100ms | AC: Each chip shows label + price ("+$0.75"); selecting adds to total, deselecting removes; multiple simultaneous selections | ✓ Aligned |
| SM-2.5 | US-2.5: Special Instructions | Textarea present with 200-char limit + live counter | AC: Textarea with 200-char limit; live counter below; counter turns red at ≤10 chars remaining; included in CartItem | ✓ Aligned |
| SM-2.6 | US-2.6: Add to Cart | "Add to Cart" closes modal, shows toast, increments badge within ordering window | AC: Builds CartItem, dispatches cartStore.addItem(), closes modal with exit animation, shows "[Drink Name] added to cart" toast, badge increments | ✓ Aligned |
| SM-3.1 | US-3.1: View Cart | Line item shows full customization summary; cart state survives navigation | AC: Line item shows "Large · Oat · Iced · Vanilla Syrup"; cart persists across route changes (session-only) | ✓ Aligned |
| SM-3.2 | US-3.2: Adjust Quantity | Stepper updates subtotal immediately; decrement to 0 removes item | AC: Subtotal updates immediately; decrement at qty=1 removes item; badge updates | ✓ Aligned |
| SM-3.3 | US-3.3: Remove Item | "×" removes only that item; badge drops by item quantity; fade + slide-left animation | AC: Immediate removal (no confirmation for single item); fade + slide-left 150ms; badge and subtotal update | ✓ Aligned |
| SM-3.4 | US-3.4: Clear Cart | Confirmation prompt prevents accidental clear; "Cancel" leaves cart unchanged | AC: Confirmation prompt "Remove all items from your cart?" with Cancel / Clear All; Cancel = no change; Clear All = empty state | ✓ Aligned |
| SM-3.5 | US-3.5: Empty Cart State | "Your cart is empty" shown; "Place Order" disabled; "Browse Menu" CTA | AC: Empty state with message + "Browse Menu" link; "Place Order" disabled + aria-disabled="true"; badge hidden | ✓ Aligned |
| SM-4.1 | US-4.1: Place Order | POST /api/orders with spinner; on 201, cart cleared, navigate to confirmation; no auth | AC: Loading state (spinner + disabled); POST /api/orders; on 201, cart cleared, navigate to confirmation screen | ✓ Aligned |
| SM-4.2 | US-4.2: Confirmation Screen | Order ref, itemised summary, ready time all visible at 390px without scroll | AC: BRW-NNNNN in Playfair Display amber; itemised summary; "15–20 minutes"; all visible at 390px without scroll | ✓ Aligned |
| SM-4.3 | US-4.3: Order Error | Failed POST re-enables button; cart preserved; inline error + "Try Again" | AC: Loading state cleared; button re-enabled; inline error with "Try Again"; cart contents fully preserved | ✓ Aligned |
| SM-4.4 | US-4.4: New Order | "Start a New Order" navigates to menu with cart cleared | AC: Full-width button; navigates to /; cart already cleared from successful submission step | ✓ Aligned |
| SM-5.1 | US-5.1: Mobile Header | Below 768px: compact header with logo + cart icon only | AC: <768px shows logo (left) + cart icon (right); no nav links; both breakpoints use same cartStore.totalCount | ✓ Aligned |
| SM-5.2 | US-5.2: Responsive Grid | 1-2-3-4 column breakpoints; no horizontal scroll at any viewport | AC: 1 col <640px, 2 col 640-1023px, 3 col 1024-1535px, 4 col 1536px+; overflow-x hidden | ✓ Aligned |
| SM-5.3 | US-5.3: Full-Screen Cart Mobile | Cart = fixed inset-0 on mobile; modal = bottom-sheet on mobile | AC: <768px cart uses fixed inset-0; modal uses fixed bottom-0 max-h-[90vh] rounded-t-[20px] on mobile | ✓ Aligned |
| SM-5.4 | US-5.4: Touch Targets | All interactive elements ≥ 44×44px on 390px; no accidental mis-taps | AC: All buttons/links/steppers/pills min 44×44px; Button primitive enforces min-height 44px; usability check at 390px | ✓ Aligned |
| SM-6.1 | US-6.1: Card Entrance Animations | Staggered fadeIn + slideUp 200ms/card, 50ms stagger; filter triggers enter/exit | AC: 200ms per card, 50ms stagger; AnimatePresence mode="popLayout" for filter changes; shared cardVariants | ✓ Aligned |
| SM-6.2 | US-6.2: Modal + Drawer Transitions | Modal scaleIn + fadeIn 200ms; drawer slides in 200ms; exit plays before unmount | AC: Modal opens scaleIn+fadeIn (200ms, easeOut); backdrop blur; cart drawer slides right desktop / up mobile (200ms); AnimatePresence wraps both | ✓ Aligned |
| SM-6.3 | US-6.3: Feedback Toasts | Toast slides in bottom-right; auto-dismisses 3s; badge pops 1→1.3→1 | AC: "[Drink Name] added to cart" toast bottom-right; 3s auto-dismiss; max 3 simultaneous; badge scale pop 300ms | ✓ Aligned |
| SM-6.4 | US-6.4: Reduced Motion | All animations disabled when prefers-reduced-motion set; no functional breakage | AC: useReducedMotion() guards all motion components; initial={false}, no exit animations; prefers-reduced-motion CSS media query also respected | ✓ Aligned |
| SM-7.1 | US-7.1: Load Menu Data | GET /api/menu returns all available items with descriptions and options; page interactive <2.5s | AC: JSON envelope { data: MenuItem[], status: 200 }; includes all fields; 20-30 items seeded on cold start | ✓ Aligned |
| SM-7.2 | US-7.2: Persist Order | POST /api/orders returns 201 with BRW-NNNNN; failed transaction fully rolled back | AC: HTTP 201 with orderId, orderReference BRW-NNNNN format; SQLite transaction; rollback on failure with 500 | ✓ Aligned |
| SM-7.3 | US-7.3: Server Auto-Start | `npm start` on cold Debian Docker = schema + seed ready; console output | AC: initDatabase() before requests; seed runs only when COUNT=0; binds 0.0.0.0:3000; outputs `BrewAI server running on http://0.0.0.0:3000` | ✓ Aligned |
| SM-7.4 | US-7.4: API Validation + Errors | Empty items = 400 EMPTY_ORDER; parameterized queries only | AC: Structured error envelope; EMPTY_ORDER, INVALID_PAYLOAD, INVALID_ID codes; no SQL string interpolation | ✓ Aligned |

**Alignment summary:** All 36 NaC statements are fully aligned with their corresponding acceptance criteria. No contradictions found. NaC statements add the JTBD-grounded outcome context ("why it matters") that the AC alone does not capture.

---

## Self-Validation Checklist

- [x] Every UserStory (US-0.1 through US-7.4) appears in the Story Map Matrix — 36/36 stories mapped
- [x] Every mapped story has a NaC derived from a specific JTBD outcome
- [x] NaC Derivation Table has full traceability chains (JTBD-ID → Stage → NaC → Story)
- [x] Release planning groups are defined (R1: 28 stories, R2: 8 stories)
- [x] Coverage analysis identifies no gaps and no orphan stories
- [x] NaC-to-Acceptance Criteria mapping verifies alignment for all 36 stories
- [x] No orphan stories — all 36 stories mapped to a journey stage
- [x] Each release enables at least one complete journey (R1 = all 6 journeys completable)
- [x] All 9 JTBD outcomes addressed in at least one story
- [x] All 3 personas served by R1

---

*Document generated: 2026-06-15 | BrewAI v1.0 STORY-MAP | Derived from: PERSONAS-BrewAI.md + JTBD-BrewAI.md + JOURNEYS-BrewAI.md + UserStories-BrewAI.md + PRD-BrewAI.md*
