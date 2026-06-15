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
