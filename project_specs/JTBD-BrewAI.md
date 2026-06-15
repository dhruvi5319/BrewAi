# Jobs-to-Be-Done Document
# BrewAI — Specialty Coffee Shop Web Application

| Field | Value |
|---|---|
| **Product Name** | BrewAI |
| **Version** | 1.0 |
| **Date** | 2026-06-15 |
| **Related Personas** | PERSONAS-BrewAI.md (PER-01, PER-02, PER-03) |
| **Related PRD** | PRD-BrewAI.md |
| **Status** | Active |

---

## Table of Contents

1. [JTBD Summary Table](#1-jtbd-summary-table)
2. [PER-01: Marcus Reyes — Specialty Coffee Enthusiast](#2-per-01-marcus-reyes--specialty-coffee-enthusiast)
3. [PER-02: Priya Nair — Busy Morning Commuter](#3-per-02-priya-nair--busy-morning-commuter)
4. [PER-03: Jordan Ellis — Occasional Treat Seeker](#4-per-03-jordan-ellis--occasional-treat-seeker)
5. [Outcome-to-Feature Traceability](#5-outcome-to-feature-traceability)
6. [NaC Preview](#6-nac-preview)

---

## 1. JTBD Summary Table

| JTBD-ID | Persona | Job Statement (abbreviated) | Priority |
|---|---|---|---|
| JTBD-01.1 | PER-01 Marcus | Precisely configure a complex custom drink without verbal negotiation | P0 |
| JTBD-01.2 | PER-01 Marcus | Navigate to espresso drinks quickly and verify the menu reflects craft quality | P0 |
| JTBD-01.3 | PER-01 Marcus | Confirm every customization is captured before placing, with zero ambiguity | P0 |
| JTBD-02.1 | PER-02 Priya | Execute a familiar order end-to-end on mobile in under 2 minutes | P0 |
| JTBD-02.2 | PER-02 Priya | Recover from a mis-add without losing order progress or restarting | P1 |
| JTBD-02.3 | PER-02 Priya | Receive a clear pick-up reference she can read at a glance while in transit | P0 |
| JTBD-03.1 | PER-03 Jordan | Discover and evaluate unfamiliar drinks with enough context to choose confidently | P0 |
| JTBD-03.2 | PER-03 Jordan | Understand the cost of extras in real time so the splurge feels intentional | P0 |
| JTBD-03.3 | PER-03 Jordan | Complete the order and feel the confirmation matches the premium experience promised | P1 |

---

## 2. PER-01: Marcus Reyes — Specialty Coffee Enthusiast

### JTBD-01.1: Precise Custom Drink Configuration

**Job Statement:**
When I open the customization modal for an espresso drink, I want to set every attribute — milk type, shot count, temperature, and add-ons — without any option being hidden or greyed out, so I can be confident my exact drink is what gets prepared.

**Current Alternatives:**
- States the full order verbally at the counter, risking mishearing ("I said oat, not almond")
- Uses basic apps that expose only size and temperature, then supplements verbally for the rest
- Writes the order in a notes app and reads it out to the barista

**Hiring Criteria:**
- All relevant customization fields (milk, shot count, temperature, extras, special instructions) are present and interactable in a single modal
- Shot count controls are visible only on espresso-based drinks — no irrelevant clutter
- Each selected option is reflected visually in the modal before Add to Cart is tapped
- Full customization completes in under 60 seconds from modal open

**Success Measure:** Marcus can configure a double ristretto with oat milk, iced, and a caramel add-on in under 60 seconds from opening the modal, with all five selections visible before submitting.

**Related Features:** F2, F0
**Priority:** P0

---

### JTBD-01.2: Fast Category-First Menu Navigation

**Job Statement:**
When I arrive at the menu page, I want to filter directly to Espresso drinks and scan the available options without scrolling through unrelated categories, so I can zero in on my drink type and evaluate the roast or seasonal variation on offer.

**Current Alternatives:**
- Scrolls through a wall of drinks across all categories to find espresso options
- Asks a barista to list today's espresso offerings verbally
- Relies on memory of prior visits rather than checking the current menu

**Hiring Criteria:**
- Category filter pills (Espresso, Cold Brew, Tea, Seasonal) are visible and tappable without scrolling on load
- Filtering to Espresso instantly hides non-espresso items with no page reload
- Each drink card includes the name, a meaningful description, and price — no generic placeholder text
- UI visual quality (dark palette, amber accents, Playfair Display headings) signals premium craft

**Success Measure:** Marcus reaches the filtered Espresso view and identifies his target drink within 15 seconds of the menu page loading.

**Related Features:** F1, F0, F6
**Priority:** P0

---

### JTBD-01.3: Pre-Submission Customization Verification

**Job Statement:**
When I review my cart before placing an order, I want to see every customization I selected — milk type, shot count, temperature, add-ons — displayed on the cart line item, so I can catch any discrepancy before the order leaves my hands.

**Current Alternatives:**
- Relies on verbal confirmation with the barista at the counter ("You said oat milk, double shot?")
- Checks the receipt after order is placed and hopes corrections can still be made
- Re-opens the customization modal on a standard app that doesn't carry the summary through to the cart

**Hiring Criteria:**
- Cart line item shows a human-readable customization summary (e.g., "Oat · Double · Iced · Caramel")
- All selected extras and special instructions are listed, not truncated
- Cart-to-confirmation flow requires no more than 3 taps from a pre-built cart
- No customization data is lost when navigating back to the menu from the cart

**Success Measure:** Marcus can visually verify all five customization selections on a cart line item in under 10 seconds and proceed to confirmation in ≤ 3 taps.

**Related Features:** F3, F4, F2
**Priority:** P0

---

## 3. PER-02: Priya Nair — Busy Morning Commuter

### JTBD-02.1: End-to-End Mobile Order in Under 2 Minutes

**Job Statement:**
When I have 4 minutes between leaving my apartment and reaching the shop, I want to load the menu, find my usual drink, confirm my standard customization, and place the order — all one-handed on my Android — so I can walk in to pick it up without waiting in the counter queue.

**Current Alternatives:**
- Joins the counter queue because the shop's web experience loses her before completion
- Pre-orders using a competing app that requires account creation (friction she tolerates only for regulars)
- Texts a friend already at the shop to order for her when mobile UX fails

**Hiring Criteria:**
- Menu page is interactive in under 2.5 seconds on a mid-tier Android over 4G
- All tap targets (category pills, Add to Cart, quantity stepper, Place Order) are ≥ 44×44px
- Guest ordering — no account creation, no sign-in gate anywhere in the flow
- End-to-end flow (menu → customize → cart → confirm) reachable in under 2 minutes
- No horizontal overflow or clipped content at 390px viewport width

**Success Measure:** Priya completes the full ordering flow — menu load to confirmation screen — in under 120 seconds on a mid-tier Android phone at 4G speed.

**Related Features:** F1, F2, F3, F4, F5
**Priority:** P0

---

### JTBD-02.2: Cart Recovery Without Starting Over

**Job Statement:**
When I accidentally add the wrong item or navigate back to the menu to double-check something, I want my cart to remain exactly as I left it, so I can correct the mistake and continue without rebuilding the order from scratch.

**Current Alternatives:**
- Accepts the wrong item and adjusts the order verbally at the counter
- Starts the entire flow over, costing her the 2-minute window
- Avoids navigating away from the cart for fear of losing her order

**Hiring Criteria:**
- Cart state persists across route changes within the session (menu → cart → menu does not clear the cart)
- Individual items can be removed from the cart without clearing the whole order
- "Clear Cart" requires an explicit confirmation prompt to prevent accidental resets
- Cart item count badge updates immediately when items are added or removed

**Success Measure:** Priya can navigate from cart back to the menu and return to find her cart unchanged, then remove one incorrect item and proceed to checkout — all in under 30 additional seconds.

**Related Features:** F3, F5
**Priority:** P1

---

### JTBD-02.3: Glanceable Pick-Up Reference on Confirmation

**Job Statement:**
When my order is placed and I'm pocketing my phone mid-commute, I want to see a clear order number and ready-time estimate on the confirmation screen without scrolling, so I can reference it at the counter without having to unlock my phone and dig through the app.

**Current Alternatives:**
- Screenshots the confirmation page immediately before pocketing her phone
- Memorizes the order number (unreliable under commute conditions)
- Asks the barista to look it up by name (requires verbal interaction she's trying to avoid)

**Hiring Criteria:**
- Order reference number is displayed in large, high-contrast type above the fold at 390px
- Estimated ready time ("15–20 minutes") is visible on the same screen without scrolling
- Itemized order summary is present so she can verify correctness at a glance
- Confirmation screen loads without error on first submission attempt (no retry needed)

**Success Measure:** Priya can read her order number and ready-time estimate from the confirmation screen without scrolling on a 390px viewport, within 3 seconds of the screen loading.

**Related Features:** F4, F5
**Priority:** P0

---

## 4. PER-03: Jordan Ellis — Occasional Treat Seeker

### JTBD-03.1: Informed Discovery of an Unfamiliar Drink

**Job Statement:**
When I open the menu without a specific drink in mind, I want to read meaningful descriptions and browse by category or keyword until something sounds genuinely appealing, so I can make an intentional choice rather than defaulting to the first recognisable name.

**Current Alternatives:**
- Asks the barista to describe the difference between two similar drinks (creates counter-queue pressure)
- Orders whatever a friend recommends rather than choosing independently
- Defaults to a familiar chain order rather than risk a specialty drink they can't decipher

**Hiring Criteria:**
- Every menu card displays a readable, flavour-forward description — not just the drink name and price
- Category filter pills let Jordan narrow to Cold Brew, Seasonal, or Tea without any text search
- Keyword search filters by name and description in real time with no page reload
- Empty search/filter state shows a helpful prompt (e.g., "Try 'cold brew' or browse All") rather than a blank screen
- Card visual presentation (image or colour treatment, Playfair Display name) signals premium quality

**Success Measure:** Jordan identifies at least one drink they want to try within 90 seconds of landing on the menu page, using only category filters and card descriptions — without asking anyone for help.

**Related Features:** F1, F0, F6
**Priority:** P0

---

### JTBD-03.2: Real-Time Price Awareness During Customization

**Job Statement:**
When I open the customization modal and start adding extras, I want to see the total price update instantly with each selection, so I can make deliberate add-on choices and feel in control of how much the order costs before I commit.

**Current Alternatives:**
- Adds extras without knowing the cost, then feels surprised or guilty at the till
- Asks the barista to quote the total before finalising (slows down the interaction)
- Avoids adding any extras because the cost is opaque

**Hiring Criteria:**
- Total price (base + size delta + all selected extras) is displayed prominently in the modal and updates within 100ms of each selection
- Price delta per extra is shown alongside each add-on option (e.g., "+ $0.75")
- Shot count control is absent or hidden for non-espresso drinks — no confusing irrelevant options
- Customization modal is readable and navigable without prior coffee knowledge (no unexplained jargon)

**Success Measure:** Jordan adds 2 extras to a seasonal drink and correctly anticipates the final price (within $0.01) before tapping Add to Cart, having read only the in-modal price display.

**Related Features:** F2, F0
**Priority:** P0

---

### JTBD-03.3: A Confirmation That Feels Worth the Splurge

**Job Statement:**
When I place my order after deliberating over the menu, I want the confirmation screen to feel polished and complete — showing my order number, a summary of what I ordered, and an estimated wait — so I can feel confident and even a little proud of the choice, and share it with the friend I'm sitting with.

**Current Alternatives:**
- Receives a plain-text receipt or no visual confirmation beyond a generic "Order placed" toast
- Asks the barista to confirm the order was received correctly at the counter
- Screenshots a competitor app's more polished confirmation to share with friends

**Hiring Criteria:**
- Confirmation screen shows order number, itemised summary (drink name + selected customizations), and estimated ready time — all without scrolling on 390px
- Visual design of the confirmation screen matches the brand (dark background, amber accents, Playfair Display for the order number)
- A "New Order" CTA is clearly labelled and returns to the menu cleanly
- Confirmation state is conclusive — no ambiguity about whether the order was received

**Success Measure:** Jordan can show the confirmation screen to a friend and both can read the drink name, customization summary, and order number without Jordan needing to scroll or explain anything.

**Related Features:** F4, F0, F6
**Priority:** P1

---

## 5. Outcome-to-Feature Traceability

| JTBD-ID | Related Feature(s) | Expected Outcome |
|---|---|---|
| JTBD-01.1 | F2 (Customization Modal), F0 (Design System) | All drink attributes configurable in one modal; no verbal supplement needed |
| JTBD-01.2 | F1 (Menu Browsing), F0 (Design System), F6 (Animations) | Espresso category reachable in ≤ 15 seconds; UI signals craft quality |
| JTBD-01.3 | F3 (Cart Management), F4 (Order Confirmation), F2 (Customization) | Full customization summary visible on cart line item; ≤ 3 taps to confirm |
| JTBD-02.1 | F1, F2, F3, F4, F5 (Responsive Layout) | Full ordering flow completes in < 120 seconds on mobile; guest-only |
| JTBD-02.2 | F3 (Cart Management), F5 (Responsive Layout) | Cart survives navigation; items removable individually; clear requires confirm |
| JTBD-02.3 | F4 (Order Confirmation), F5 (Responsive Layout) | Order number + ready time above the fold at 390px on first load |
| JTBD-03.1 | F1 (Menu Browsing), F0 (Design System), F6 (Animations) | Every card has description; empty states guided; filtering is real-time |
| JTBD-03.2 | F2 (Customization Modal), F0 (Design System) | Live price updates < 100ms; per-extra deltas shown; no irrelevant controls |
| JTBD-03.3 | F4 (Order Confirmation), F0 (Design System), F6 (Animations) | Conclusive, on-brand confirmation; itemised summary without scroll at 390px |

**Coverage check:** F0 ✓ · F1 ✓ · F2 ✓ · F3 ✓ · F4 ✓ · F5 ✓ · F6 ✓ · F7 (implicit in F1/F4 via API dependency) ✓

---

## 6. NaC Preview

Candidate Natural Acceptance Criteria derived from each job's success measure. These will be refined into full NaC statements in the STORY-MAP phase.

| JTBD-ID | Outcome (from Success Measure) | Candidate NaC |
|---|---|---|
| JTBD-01.1 | All 5 customizations set in < 60 seconds | Given the customization modal is open for a double ristretto, when the user sets milk=Oat, shots=Double, temp=Iced, and adds Caramel, then all five selections are reflected in the modal and the Add to Cart button is enabled — all within 60 seconds of modal open. |
| JTBD-01.2 | Espresso category visible and filtered in ≤ 15 seconds | Given the menu page loads, when the user taps the Espresso filter pill, then only espresso-based drinks are displayed and all non-espresso cards are hidden — within 15 seconds of page load. |
| JTBD-01.3 | Full customization summary on cart line item; ≤ 3 taps to confirm | Given a customized item is in the cart, then the cart line item displays milk type, shot count, temperature, and all add-ons in a readable summary, and the order can be placed in ≤ 3 taps from the cart view. |
| JTBD-02.1 | Full flow completes in < 120 seconds on 4G mobile | Given a mid-tier Android on 4G, when a guest user navigates from menu load to order confirmation, then the flow completes in < 120 seconds with no account creation prompt at any step. |
| JTBD-02.2 | Cart unchanged after back-navigation; item removable | Given an item is in the cart, when the user navigates back to the menu and returns to the cart, then the cart contents are identical to before navigation, and a single item can be removed without clearing the rest. |
| JTBD-02.3 | Order number + ready time above fold at 390px | Given a successful order submission on a 390px viewport, then the order reference number and "15–20 minutes" ready time are both visible without scrolling on the confirmation screen. |
| JTBD-03.1 | Target drink identified in ≤ 90 seconds via browse alone | Given the menu page loads with no search pre-filled, when the user taps a category filter and reads card descriptions, then a drink is identifiable using only card content — no barista or external lookup required — within 90 seconds. |
| JTBD-03.2 | Final price predictable from in-modal display before Add to Cart | Given the customization modal is open, when the user selects a size and 2 add-ons, then the displayed total matches the sum of base price + size delta + add-on prices, updating within 100ms of each selection. |
| JTBD-03.3 | Order number + itemised summary readable at 390px without scroll | Given the confirmation screen renders after a successful order, then the order number, drink name, customization summary, and estimated ready time are all visible on a 390px viewport without vertical scrolling. |

---

*Document generated: 2026-06-15 | BrewAI v1.0 JTBD | Derived from: PERSONAS-BrewAI.md + PRD-BrewAI.md*
