# User Journey Maps
# BrewAI — Specialty Coffee Shop Web Application

| Field | Value |
|---|---|
| **Product Name** | BrewAI |
| **Version** | 1.0 |
| **Date** | 2026-06-15 |
| **Related Personas** | PERSONAS-BrewAI.md (PER-01, PER-02, PER-03) |
| **Related JTBD** | JTBD-BrewAI.md |
| **Related PRD** | PRD-BrewAI.md |
| **Status** | Active |

---

## Table of Contents

1. [Journey Index](#1-journey-index)
2. [PER-01: Marcus Reyes — Specialty Coffee Enthusiast](#2-per-01-marcus-reyes--specialty-coffee-enthusiast)
   - [JRN-01.1: Precision Custom Order (Desktop)](#jrn-011-precision-custom-order-desktop)
   - [JRN-01.2: Seasonal Drink Discovery & Keyword Search](#jrn-012-seasonal-drink-discovery--keyword-search)
3. [PER-02: Priya Nair — Busy Morning Commuter](#3-per-02-priya-nair--busy-morning-commuter)
   - [JRN-02.1: Sub-2-Minute Mobile Order](#jrn-021-sub-2-minute-mobile-order)
   - [JRN-02.2: Cart Recovery After Mis-Add](#jrn-022-cart-recovery-after-mis-add)
4. [PER-03: Jordan Ellis — Occasional Treat Seeker](#4-per-03-jordan-ellis--occasional-treat-seeker)
   - [JRN-03.1: Weekend Menu Discovery & Intentional Choice](#jrn-031-weekend-menu-discovery--intentional-choice)
   - [JRN-03.2: Add-On Exploration & Price-Aware Customization](#jrn-032-add-on-exploration--price-aware-customization)
5. [Cross-Journey Patterns](#5-cross-journey-patterns)
6. [Journey-to-JTBD Traceability](#6-journey-to-jtbd-traceability)

---

## 1. Journey Index

| JRN-ID | Persona | Scenario | Key JTBD(s) | Stages |
|--------|---------|----------|-------------|--------|
| JRN-01.1 | PER-01 Marcus | Configures a complex custom espresso drink on desktop | JTBD-01.1, JTBD-01.3 | 5 |
| JRN-01.2 | PER-01 Marcus | Searches for a seasonal roast and discovers a new espresso option | JTBD-01.2 | 4 |
| JRN-02.1 | PER-02 Priya | Places a familiar order end-to-end on mobile in under 2 minutes | JTBD-02.1, JTBD-02.3 | 5 |
| JRN-02.2 | PER-02 Priya | Corrects a mis-added item and resumes checkout without restarting | JTBD-02.2 | 4 |
| JRN-03.1 | PER-03 Jordan | Browses an unfamiliar menu and makes a confident drink choice | JTBD-03.1 | 5 |
| JRN-03.2 | PER-03 Jordan | Opens the customization modal, adds extras, and tracks the live price | JTBD-03.2, JTBD-03.3 | 5 |

---

## 2. PER-01: Marcus Reyes — Specialty Coffee Enthusiast

---

### JRN-01.1: Precision Custom Order (Desktop)

**Persona:** PER-01 (Marcus Reyes)

**Scenario:** Marcus is working from a coffee shop mid-morning. He opens BrewAI on his 1280px laptop, filters straight to Espresso, opens the customization modal for a double ristretto, and dials in his exact specification — oat milk, iced, caramel add-on — before reviewing the cart summary and confirming the order.

**Related Jobs:** JTBD-01.1, JTBD-01.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Land** | Types the BrewAI URL and sees the menu page load with the dark canvas and amber headings | Menu page (F0, F1, F7) | "Good — no login prompt. Let me find Espresso." | Neutral, cautiously optimistic | Has been burned by generic coffee-shop sites before; scans for quality signals | Staggered card entrance animation and Playfair Display headings immediately signal premium quality |
| **2. Filter** | Clicks the "Espresso" category pill in the filter bar | Category filter (F1) | "These should disappear fast — if there's a page reload I'm done." | Focused, testing the interface | Generic apps reload the page; he's used to that frustrating lag | Instant client-side filter (no reload) with smooth card re-arrangement confirms the app is worth his trust |
| **3. Select** | Scans the espresso grid, reads the tasting note on "Double Ristretto Reserve," clicks "Customize" | Menu card (F1), Customize CTA | "Does this card actually describe the roast or is it just a name? Good — there's a flavour note." | Engaged, slightly excited | Most apps show only a drink name and a price; the description is what distinguishes craft from commodity | Rich card copy (Playfair name + flavour-forward description) earns the click; modal scale-in animation reinforces premium feel |
| **4. Customize** | Opens modal; sets milk = Oat, shot count = Double, temp = Iced; adds Caramel extra; sees price update | Customization modal (F2, F0) | "Shot count is here — finally. I need to see all five selections before I tap Add to Cart." | Determined, detail-oriented | If any field is hidden or greyed out, the whole exercise fails and he'll just order verbally | All five fields visible and interactable in one view; selections highlighted visually before submission; real-time price update keeps the total honest |
| **5. Verify & Confirm** | Navigates to cart; reads the line item summary; taps "Place Order" in ≤ 3 taps | Cart (F3), Order confirmation (F4) | "Oat · Double · Iced · Caramel — yes, all five are there. I'm not going to get almond milk this time." | Relieved, confident | Any app that truncates the customization summary forces him to guess; guessing means a wrong drink | Full human-readable customization tag on the cart line item; one-tap "Place Order" from cart; clear order number on confirmation |

#### Key Moments

- **Decision Point (Stage 2 — Filter):** If the filter triggers a page reload, Marcus closes the tab. The instant client-side filter is make-or-break.
- **Decision Point (Stage 4 — Customize):** If shot count or milk type is absent from the modal, he abandons to the counter. Full option coverage is non-negotiable.
- **Risk of Abandonment (Stage 5 — Verify):** If the cart shows only "Double Ristretto Reserve — $5.50" with no customization summary, his confidence collapses. He needs to see all five attributes before confirming.
- **Delight Opportunity (Stage 4 — Customize):** Watching the price tick up as he adds the caramel extra feels honest and transparent — the first ordering flow that has ever made him feel in control.
- **Delight Opportunity (Stage 5 — Confirm):** Seeing "Oat · Double · Iced · Caramel" on the cart line item is the specific moment that converts him into a returning user.

#### Success Outcome

Marcus configures all five customizations in under 60 seconds from modal open, sees them reflected verbatim on the cart line item, and confirms in ≤ 3 taps — eliminating verbal negotiation and preparation errors (JTBD-01.1 + JTBD-01.3 success measures).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Land | F0 (Design System), F1 (Menu Page), F7 (API — menu data) |
| Filter | F1 (Category Filter Pills), F6 (Animated card filter) |
| Select | F1 (Menu Cards), F6 (Modal entrance animation) |
| Customize | F2 (Customization Modal), F0 (Design tokens), F6 (Micro-animations) |
| Verify & Confirm | F3 (Cart — line item summary), F4 (Order Placement & Confirmation), F7 (POST /api/orders) |

---

### JRN-01.2: Seasonal Drink Discovery & Keyword Search

**Persona:** PER-01 (Marcus Reyes)

**Scenario:** Marcus heard about a new Kenyan single-origin espresso at this shop. He opens BrewAI, uses the keyword search to look for "Kenya," finds it listed as a seasonal offering, reads the tasting notes, and opens the customization modal to confirm it supports shot-count control before adding it to his cart.

**Related Jobs:** JTBD-01.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Land & Search** | Types "Kenya" into the keyword search field on the menu page | Menu page search (F1) | "Either it's there and it'll appear, or I'll need to ask. Let's see." | Curious, slightly sceptical | If search requires a page reload or returns no guidance on empty, he loses confidence fast | Real-time filtering by name and description; results update as he types; no page reload |
| **2. Identify** | Sees the "Kenya Seasonal Espresso" card appear under the Seasonal category; reads the description | Menu card (F1, F0) | "Citrus and blackcurrant — that's the one. Let me check it's available as espresso." | Excited, confirmed | Generic cards with no description make it impossible to distinguish this from a commodity drip | Flavour-forward card copy confirms this is a craft offering worth the customization investment |
| **3. Explore Modal** | Clicks "Customize," opens the modal; verifies that shot count (Double) is available for this drink | Customization modal (F2) | "Good — it's espresso-based, shot count should be here. Yes, it is." | Relieved, confident | Apps that show shot count only on certain drinks without signalling which ones create confusion | Shot count visible and enabled for espresso-based drinks; grayed out or absent for non-espresso (contextual option exposure) |
| **4. Add & Proceed** | Sets milk = Oat, shot = Double, adds to cart, reviews the cart line item | Cart (F3), Customization modal (F2) | "Oat · Double on the seasonal — nice. I'll pick this up in 20 minutes." | Satisfied, efficient | If the customization summary doesn't appear on the cart line item he second-guesses the order | Full customization summary on cart line item; order number and ready-time estimate on confirmation |

#### Key Moments

- **Decision Point (Stage 1 — Search):** Empty search state with no helpful prompt ("Try 'cold brew' or browse All") causes abandonment. A guided empty state keeps him in the app.
- **Delight Opportunity (Stage 2 — Identify):** Finding the drink through search and confirming it via a rich tasting note feels like the app *knows* him.
- **Risk of Abandonment (Stage 3 — Modal):** If shot count is absent on this drink (incorrectly treated as non-espresso), Marcus loses trust in the system's accuracy and reverts to the counter.

#### Success Outcome

Marcus locates the Kenya Seasonal Espresso within 15 seconds of the menu page loading using keyword search, confirms shot count is available, and adds his customized order to cart — validating that the menu is complete and the customization modal is contextually accurate (JTBD-01.2 success measure).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Land & Search | F1 (Keyword Search — real-time filter), F7 (menu data API) |
| Identify | F1 (Menu Cards — description, category), F0 (Design System — Playfair Display) |
| Explore Modal | F2 (Customization Modal — contextual shot count), F0 (Design tokens) |
| Add & Proceed | F2 (Add to Cart), F3 (Cart line item), F4 (Confirmation) |

---

## 3. PER-02: Priya Nair — Busy Morning Commuter

---

### JRN-02.1: Sub-2-Minute Mobile Order

**Persona:** PER-02 (Priya Nair)

**Scenario:** It's 8:14 AM. Priya has 4 minutes before her train. She opens BrewAI on her Android (390px viewport, 4G), navigates to Espresso, taps the iced oat latte, confirms her standard extra shot, adds to cart, and places the order — pocketing her phone as the confirmation number appears above the fold.

**Related Jobs:** JTBD-02.1, JTBD-02.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Load** | Opens BrewAI in her Android browser while walking to the subway; waits for the menu to render | Menu page (F1, F5, F7) | "Please load. Please load. I do not have time for a spinner." | Tense, time-pressured | If the page doesn't reach interactive in 2.5 seconds she's already calculating whether the queue will be faster | Sub-2.5s interactive load on 4G; immediate skeleton/loading state so she knows the page is coming |
| **2. Navigate** | Taps "Espresso" filter pill with her thumb; category filters are horizontally scrollable | Category filter (F1, F5) | "Espresso is first in the list — good. One tap and I should see my drink." | Focused, moving fast | Tiny filter pills or a misaligned touch target at 390px = missed tap = wasted second = frustration spike | 44×44px minimum touch targets; horizontally scrollable filter bar; active pill highlighted in amber |
| **3. Customize** | Taps her usual drink card; opens modal; verifies milk = Oat, size = Large, adds extra shot; taps "Add to Cart" | Customization modal (F2, F5) | "Is 'Extra shot' in the extras list? Yes. Oat, Large, Extra shot — that's it." | Efficient, slightly anxious | A modal that doesn't scroll smoothly one-handed or has tiny stepper buttons will cost her a tap and break her rhythm | Full-screen modal on mobile; large tap targets on all controls; modal scroll is smooth; options pre-set to her last known pattern if future personalization is added |
| **4. Place Order** | Opens cart, confirms one line item, taps "Place Order" | Cart (F3, F5), Order placement (F4) | "One item, correct. One tap to confirm. I'm doing this." | Determined | Cart that renders slowly or has a tiny "Place Order" button forces a re-tap; if the cart resets she starts over | Persistent cart state; "Place Order" button is full-width at 390px; loading spinner + disabled state gives confidence submission is happening |
| **5. Confirm & Pocket** | Sees the confirmation screen; reads order number and "15–20 minutes" above the fold; locks her phone | Confirmation screen (F4, F5, F0) | "Order #0047. Fifteen minutes. Perfect." | Relieved, done | Order number in small type or below the fold means she has to scroll one-handed to read it | Large high-contrast order number above the fold; ready-time estimate on the same line; itemized summary beneath; "New Order" CTA cleanly labelled |

#### Key Moments

- **Decision Point (Stage 1 — Load):** If interactive load exceeds 2.5 seconds on 4G, Priya closes the browser and joins the counter queue. There is no second chance.
- **Risk of Abandonment (Stage 3 — Customize):** Any modal scroll jank, missed tap on the quantity stepper, or horizontal overflow at 390px ends the session.
- **Risk of Abandonment (Stage 4 — Place Order):** If cart state was lost when she navigated through the modal, she has to start over — she won't. She exits.
- **Delight Opportunity (Stage 5 — Confirm):** The order number appearing large and legible without scrolling is the precise moment the app earns her next visit.

#### Success Outcome

Priya completes the full flow — menu load to confirmation number on screen — in under 120 seconds on a mid-tier Android over 4G, with no account prompt at any step (JTBD-02.1 + JTBD-02.3 success measures).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Load | F1 (Menu Page), F5 (Responsive Layout), F7 (GET /api/menu — performance) |
| Navigate | F1 (Category Filter Pills), F5 (Touch targets, horizontal scroll) |
| Customize | F2 (Customization Modal — mobile layout), F5 (Full-screen modal on mobile) |
| Place Order | F3 (Cart — persistent state), F4 (Place Order CTA), F5 (Full-width button) |
| Confirm & Pocket | F4 (Confirmation screen — order number above fold), F5 (390px layout), F0 (Design tokens — contrast) |

---

### JRN-02.2: Cart Recovery After Mis-Add

**Persona:** PER-02 (Priya Nair)

**Scenario:** Priya adds an Iced Americano instead of her usual Iced Oat Latte. She notices in the cart, navigates back to the menu to find the correct drink, returns to the cart — which still holds the Americano — removes it, adds the correct item, and proceeds to checkout without losing time to a full restart.

**Related Jobs:** JTBD-02.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Spot the Mistake** | Opens the cart drawer; reads the line item "Iced Americano — Oat · Large"; realizes she added the wrong drink | Cart (F3, F5) | "That's not my latte. I tapped the wrong card." | Momentarily annoyed, calculating options | On most sites, going back to the menu to fix this clears the cart entirely — making her start over | Cart is visible and accessible from any page via the nav badge; mistake is immediately readable on the line item summary |
| **2. Navigate Back** | Taps the back button or the menu nav link; returns to the menu page | Navigation (F5), Menu (F1) | "If this clears my cart I'm going to have to start over and I'm losing my window." | Anxious | Most shop sites reset cart state on navigation — this is her biggest fear | Zustand cart state persists across route changes; cart badge count stays unchanged after navigation |
| **3. Add Correct Item** | Finds the Iced Oat Latte, opens the modal, configures correctly, taps "Add to Cart" | Menu card (F1), Customization modal (F2) | "OK, the Americano is still there. Now I'll add the latte — then remove the mistake." | Focused, relieved that the cart survived | If the correct configuration isn't quick to set up, she's burning through her time window | Fast modal open; Oat and Large pre-selectable; "Add to Cart" lands cleanly |
| **4. Remove & Confirm** | Returns to cart; taps the remove button on the Americano; confirms with the prompt; taps "Place Order" | Cart (F3), Order placement (F4) | "Remove the Americano — 'Are you sure?' — yes. One item. Place Order. Done." | Relieved, slightly proud of the recovery | If remove requires multiple awkward taps, or if "Clear Cart" fires accidentally without a confirm prompt, she loses more time or the whole cart | Individual item remove button (not just "Clear Cart"); confirm prompt for destructive actions; cart badge updates immediately on removal |

#### Key Moments

- **Critical Moment (Stage 2 — Navigate Back):** This is the single highest-stakes moment in the recovery flow. Cart persistence is the feature that determines whether Priya loses 30 seconds or 2 minutes.
- **Risk of Abandonment (Stage 4 — Remove):** If "Remove" and "Clear Cart" are visually similar or the confirmation prompt is slow to appear, she may accidentally wipe the whole cart. That ends the session.
- **Delight Opportunity (Stage 4 — Remove):** Seeing the cart badge count drop by exactly one (not reset to zero) is the feedback that makes the recovery feel clean and controlled.

#### Success Outcome

Priya navigates from cart back to the menu and returns to find her cart unchanged, removes the incorrect item, and proceeds to checkout — all within 30 additional seconds — without losing any order data (JTBD-02.2 success measure).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Spot the Mistake | F3 (Cart — line item with customization summary), F5 (Cart drawer mobile layout) |
| Navigate Back | F5 (Navigation — persistent across routes), F3 (Zustand cart persistence) |
| Add Correct Item | F1 (Menu Card), F2 (Customization Modal), F3 (Add to Cart) |
| Remove & Confirm | F3 (Remove item — individual, confirm prompt), F4 (Place Order) |

---

## 4. PER-03: Jordan Ellis — Occasional Treat Seeker

---

### JRN-03.1: Weekend Menu Discovery & Intentional Choice

**Persona:** PER-03 (Jordan Ellis)

**Scenario:** Jordan arrives at the coffee shop on a Saturday afternoon with a friend. They open BrewAI on their iPhone, browse the full menu without a specific drink in mind, use the category filters to narrow to "Seasonal," read several descriptions, and land on a choice they feel genuinely excited about — all without asking anyone for help.

**Related Jobs:** JTBD-03.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Land & Orient** | Opens BrewAI; sees the dark canvas and the full menu grid with staggered card entrance | Menu page (F0, F1, F6) | "Oh, this looks actually nice. Let me see what they have." | Pleasantly surprised, curious | Generic white-background coffee sites feel inconsistent with paying $7 for a specialty drink | Dark premium aesthetic with staggered card fade-in communicates quality before a single word is read |
| **2. Browse All** | Scrolls through the full grid; reads several drink names and descriptions | Menu cards (F1, F0) | "What even is a 'Kenya Anaerobic'? I need to read the description before I decide." | Curious, slightly overwhelmed | Menus with only drink names and prices offer no basis for choice — Jordan defaults to the one recognisable name | Every card has a readable, flavour-forward description; Playfair Display drink name + Inter description copy creates a visual hierarchy that invites reading |
| **3. Filter to Seasonal** | Taps the "Seasonal" category pill; grid updates instantly to show 4 seasonal offerings | Category filter (F1, F6) | "There are only four seasonal drinks? That makes this easier. Let me read them." | Focused, relieved | No filter = scrolling through 20+ drinks with no way to narrow; overwhelm leads to defaulting to something safe | Instant filter with animated card re-arrangement; small curated set is less intimidating than the full menu |
| **4. Read & Evaluate** | Reads two seasonal cards carefully; compares "Hibiscus Cold Brew" and "Mango Chilli Espresso" descriptions | Menu cards (F1) | "Hibiscus sounds refreshing. But the mango chilli sounds interesting. Which one is more of a treat?" | Engaged, deliberating | No description = no choice basis = counter question = pressure = defaults to safe option | Rich, distinctive descriptions give Jordan something to compare; the card design makes each option feel curated |
| **5. Choose & Tap** | Decides on "Mango Chilli Espresso"; taps "Customize" | Menu card CTA (F1), Modal entrance (F2, F6) | "OK, Mango Chilli. I'm doing this. Let me see if I can add something to it." | Excited, slightly nervous | If the customization modal is immediately overwhelming or full of unexplained jargon, this excitement turns to doubt | Modal scale-in animation; clean option layout; jargon-free labels (no "ristretto" without explanation); visible base price at the top |

#### Key Moments

- **Decision Point (Stage 3 — Filter):** If the "Seasonal" pill is buried or requires scrolling to find, Jordan defaults to browsing everything — much higher chance of overwhelm and a safe default choice.
- **Risk of Abandonment (Stage 4 — Read):** If card descriptions are generic ("A delicious espresso drink") or absent, Jordan has no differentiation basis and asks the barista — moving the interaction off the app entirely.
- **Delight Opportunity (Stage 1 — Land):** The dark premium aesthetic with staggered card entrance animation is the first signal that BrewAI is different from a generic ordering form. This impression shapes the entire session.
- **Delight Opportunity (Stage 5 — Choose):** The moment Jordan taps "Customize" on an unfamiliar drink and feels confident about it — that's the experience worth building.

#### Success Outcome

Jordan identifies a drink they genuinely want to try within 90 seconds of landing on the menu page, using only category filters and card descriptions — without asking the barista or their friend for guidance (JTBD-03.1 success measure).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Land & Orient | F0 (Design System — dark canvas, amber), F1 (Menu Grid), F6 (Staggered card entrance) |
| Browse All | F1 (Menu Cards — name + description + price), F0 (Typography hierarchy) |
| Filter to Seasonal | F1 (Category Filter Pills), F6 (Animated re-arrangement) |
| Read & Evaluate | F1 (Card descriptions — rich, flavour-forward copy), F0 (Visual design) |
| Choose & Tap | F1 (Card CTA), F2 (Modal entrance), F6 (Scale-in animation) |

---

### JRN-03.2: Add-On Exploration & Price-Aware Customization

**Persona:** PER-03 (Jordan Ellis)

**Scenario:** Jordan has chosen the Mango Chilli Espresso. They open the customization modal and explore add-ons — debating whether to add Vanilla syrup and Whipped cream. They watch the price update in real time with each selection, decide they're comfortable with the total, and complete the order. The confirmation screen looks good enough to show their friend.

**Related Jobs:** JTBD-03.2, JTBD-03.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Enter Modal** | Customization modal opens with a scale-in animation; Jordan sees the base price, size options, and add-on list | Customization modal (F2, F6, F0) | "OK — Medium is fine. What can I add? I see the price at the top: $6.50." | Curious, slightly cautious about spending | Overwhelming modals with unexplained options (shot count on a tea, temperature options with no context) cause immediate confusion | Clean modal layout; drink name and base price prominent at the top; only relevant options for this drink type; no unexplained jargon |
| **2. Explore Add-Ons** | Reads the extras list; taps "Vanilla syrup (+$0.75)"; watches the total tick from $6.50 to $7.25 | Customization modal — extras (F2, F0) | "$7.25 — that's fine. What does whipped cream do to the price?" | Engaged, experimenting | No per-extra price delta means every selection is a financial unknown; Jordan avoids adding things rather than risk surprise | Per-extra delta shown inline ("+$0.75"); total updates within 100ms of each selection; price feedback makes exploration feel safe |
| **3. Decide on Extras** | Taps "Whipped cream (+$0.50)"; total updates to $7.75; decides that's the limit | Customization modal — extras (F2) | "$7.75. OK, that's my treat budget. I'm going with vanilla and whipped cream." | Intentional, in control | Without real-time total, Jordan either guesses or asks the barista — both undermine the digital ordering experience | Real-time price display converts an anxiety into a confident decision; the transparency earns trust |
| **4. Add to Cart & Review** | Taps "Add to Cart"; cart badge pops with count badge; opens cart; reads the line item summary | Cart (F3, F6) | "Mango Chilli Espresso · Vanilla syrup · Whipped cream — $7.75. Yes, that's it." | Satisfied, ready | Cart line item that truncates customization ("+ 2 extras") leaves Jordan unsure what was captured | Full customization summary on line item; animated cart badge pop gives immediate feedback that the add was registered |
| **5. Place Order & Show Friend** | Taps "Place Order"; confirmation screen appears; shows it to their friend | Order confirmation (F4, F0, F6) | "Look — order #0052, Mango Chilli Espresso with Vanilla and Whipped cream. 15–20 minutes." | Proud, delighted | A plain-text "Order received" toast with no order number or summary feels anticlimactic and makes Jordan question whether it worked | Branded confirmation screen (dark background, amber order number in Playfair Display, itemised summary, ready time); conclusive and shareable |

#### Key Moments

- **Critical Moment (Stage 2 — Explore):** The first time Jordan taps an add-on and sees the price update instantly is the defining interaction. It converts the act of adding extras from anxiety into play.
- **Decision Point (Stage 3 — Decide):** The real-time total is the mechanism by which Jordan decides their limit. Without it, they either skip all extras or feel surprised at an imaginary till.
- **Risk of Abandonment (Stage 1 — Enter Modal):** If the modal surfaces options irrelevant to this drink type (e.g., "Shot count" on a blended espresso with mango) or uses unexplained jargon, Jordan's excitement turns to confusion and they close the modal.
- **Delight Opportunity (Stage 5 — Confirm):** Showing the confirmation screen to a friend is a social act. The amber order number in Playfair Display on a dark background is the visual that makes this feel like a premium purchase, not a fast-food transaction.

#### Success Outcome

Jordan adds 2 extras and correctly anticipates the final price ($7.75) from the in-modal display before tapping Add to Cart; the confirmation screen shows the drink name, customization summary, and order number in a design that matches the premium experience promised by the brand (JTBD-03.2 + JTBD-03.3 success measures).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Enter Modal | F2 (Customization Modal — contextual options), F6 (Scale-in animation), F0 (Design tokens — typography, contrast) |
| Explore Add-Ons | F2 (Extras list — per-extra price delta, real-time total), F0 (Price display prominence) |
| Decide on Extras | F2 (Real-time price calculation < 100ms), F0 (Total display) |
| Add to Cart & Review | F3 (Cart — line item summary), F6 (Badge pop animation) |
| Place Order & Show Friend | F4 (Confirmation screen — branded, itemised, above-fold at 390px), F0 (Dark canvas, amber Playfair order number), F6 (Confirmation entrance animation) |

---

## 5. Cross-Journey Patterns

### CP-01: Customization Summary Completeness (All Personas)

All three personas depend on the cart line item showing a complete, human-readable customization summary. Marcus needs it for accuracy verification, Priya needs it for speed-checking at a glance, and Jordan needs it to feel confident they got what they chose. A truncated or absent summary is a failure for all three.

**Implicated feature:** F3 (Cart — line item display)  
**Risk level:** High — a single design decision (truncate vs. full text) affects all three personas' success criteria.

### CP-02: Instant Category Filtering (Marcus + Priya + Jordan)

All three personas use category filter pills as their primary navigation tool. Marcus needs instant filtering because a reload signals a low-quality experience. Priya needs it because a 1-second delay costs her the time window. Jordan needs it to narrow an otherwise overwhelming menu. Client-side instant filter is not a delight feature — it is table stakes.

**Implicated feature:** F1 (Category Filter — no-reload, animated)  
**Risk level:** High — any server-round-trip on filter breaks the flow for all three.

### CP-03: Mobile Touch Target Adequacy (Priya + Jordan)

Priya's 44×44px requirement is the strictest constraint, and it also determines whether Jordan can reliably tap add-on checkboxes in the customization modal. Both personas use the app on mobile viewports (390px), both in one-handed contexts. The touch target standard must be applied consistently across every interactive element — category pills, card CTAs, modal controls, cart steppers, and the "Place Order" button.

**Implicated feature:** F5 (Responsive Layout — touch targets), F2 (Modal controls), F3 (Cart steppers)  
**Risk level:** High — failure on any single control creates friction that compounds across the flow.

### CP-04: No Account Gate (All Personas)

Marcus, Priya, and Jordan are all guest users. Any sign-in prompt — even optional — would break Priya's 2-minute window, frustrate Marcus who just wants to order, and make Jordan feel like they're being asked to commit to a relationship before they've tasted the coffee. Guest-only ordering is a foundational constraint that must be upheld unconditionally.

**Implicated feature:** F4 (Order Placement — no auth check), F7 (API — no auth middleware)  
**Risk level:** Critical — any auth surface is an immediate blocker for all three personas.

### CP-05: Premium Aesthetic Signalling (Marcus + Jordan)

Marcus notices immediately when a UI feels cheap. Jordan uses visual quality as a proxy for whether the coffee is worth the price. Both are affected by the first 2 seconds of the menu page render — the dark canvas, amber accents, and Playfair Display headings either confirm premium quality or undermine it. Priya is less affected aesthetically but benefits from the design's clarity and contrast.

**Implicated features:** F0 (Design System tokens), F6 (Staggered card entrance animation)  
**Risk level:** Medium — visual quality is harder to quantify but directly affects purchase confidence for two of three primary personas.

### CP-06: Confirmation Screen Above-Fold (Priya + Jordan)

Priya needs the order number and ready time without scrolling because she's pocketing her phone. Jordan needs the itemised summary and order number on the same screen to show a friend. Both requirements converge on the same constraint: all critical confirmation information must be above the fold at 390px — no scrolling required. The single confirmation screen design must satisfy both.

**Implicated feature:** F4 (Confirmation screen — layout at 390px), F0 (Typography — large order number), F5 (Responsive layout)  
**Risk level:** High — a single layout decision determines success for two personas' primary JTBD outcomes.

---

## 6. Journey-to-JTBD Traceability

| JRN-ID | Stage | JTBD-ID | Expected Outcome |
|--------|-------|---------|-----------------|
| JRN-01.1 | 2. Filter | JTBD-01.2 | Espresso filter applied instantly; only espresso drinks visible within 15 seconds of page load |
| JRN-01.1 | 3. Select | JTBD-01.2 | Menu card includes meaningful description; visual quality signals craft; Marcus clicks with confidence |
| JRN-01.1 | 4. Customize | JTBD-01.1 | All five attributes (milk, shots, temp, extras, special instructions) configurable in one modal in < 60 seconds |
| JRN-01.1 | 5. Verify & Confirm | JTBD-01.3 | Full customization summary on cart line item; order confirmed in ≤ 3 taps from cart |
| JRN-01.2 | 1. Land & Search | JTBD-01.2 | Keyword search filters in real time; empty state provides helpful guidance |
| JRN-01.2 | 2. Identify | JTBD-01.2 | Drink card description confirms roast identity without barista input |
| JRN-01.2 | 3. Explore Modal | JTBD-01.1 | Shot count visible and enabled for espresso-based seasonal drink; absent for non-espresso |
| JRN-01.2 | 4. Add & Proceed | JTBD-01.3 | Customization summary persists to cart line item |
| JRN-02.1 | 1. Load | JTBD-02.1 | Menu page interactive in < 2.5 seconds on 4G Android |
| JRN-02.1 | 2. Navigate | JTBD-02.1 | Category pill tappable with one thumb; ≥ 44×44px; no missed taps |
| JRN-02.1 | 3. Customize | JTBD-02.1 | Full-screen modal on mobile; all controls ≥ 44×44px; no scroll jank |
| JRN-02.1 | 4. Place Order | JTBD-02.1 | Cart state persists; Place Order CTA full-width at 390px; submission completes without error |
| JRN-02.1 | 5. Confirm & Pocket | JTBD-02.3 | Order number and ready time above fold at 390px; readable within 3 seconds of screen load |
| JRN-02.2 | 1. Spot the Mistake | JTBD-02.2 | Cart line item shows full customization; mistake is immediately identifiable |
| JRN-02.2 | 2. Navigate Back | JTBD-02.2 | Cart state unchanged after navigating to menu and back; Zustand persists across route changes |
| JRN-02.2 | 3. Add Correct Item | JTBD-02.2 | New item added to cart alongside existing item; both line items visible |
| JRN-02.2 | 4. Remove & Confirm | JTBD-02.2 | Individual item remove button present; confirmation prompt prevents accidental clear; cart badge updates immediately |
| JRN-03.1 | 1. Land & Orient | JTBD-03.1 | Dark premium UI + staggered card entrance animation signals brand quality within first 2 seconds |
| JRN-03.1 | 2. Browse All | JTBD-03.1 | Every card has a readable, flavour-forward description; Jordan can distinguish drinks without barista input |
| JRN-03.1 | 3. Filter to Seasonal | JTBD-03.1 | Seasonal filter applies instantly; curated subset reduces decision overwhelm |
| JRN-03.1 | 4. Read & Evaluate | JTBD-03.1 | Card descriptions are distinctive enough to support a comparison choice |
| JRN-03.1 | 5. Choose & Tap | JTBD-03.1 | Jordan taps "Customize" on an unfamiliar drink with confidence; target drink identified in ≤ 90 seconds |
| JRN-03.2 | 1. Enter Modal | JTBD-03.2 | Modal shows only options relevant to selected drink type; base price prominent; no jargon |
| JRN-03.2 | 2. Explore Add-Ons | JTBD-03.2 | Per-extra price delta shown inline; total updates within 100ms of each selection |
| JRN-03.2 | 3. Decide on Extras | JTBD-03.2 | Jordan correctly anticipates final price from in-modal display before tapping Add to Cart |
| JRN-03.2 | 4. Add to Cart & Review | JTBD-03.2 | Full customization summary on cart line item; cart badge pop confirms successful add |
| JRN-03.2 | 5. Place Order & Show Friend | JTBD-03.3 | Branded confirmation screen: order number, itemised summary, ready time — all above fold at 390px; visually shareable |

---

*Document generated: 2026-06-15 | BrewAI v1.0 JOURNEYS | Derived from: PERSONAS-BrewAI.md + JTBD-BrewAI.md + PRD-BrewAI.md*
