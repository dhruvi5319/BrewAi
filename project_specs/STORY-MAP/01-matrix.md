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
| SM-1.4 | US-1.4: Helpful Empty State | PER-03 (Jordan) | S2: Browse & Filter | JTBD-03.1 → Browse & Filter: When no cards match the active filter + search, an empty state with "No drinks match your search" and a "Clear filters" CTA is displayed — no blank screen, no skeleton cards. | R1 |
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
