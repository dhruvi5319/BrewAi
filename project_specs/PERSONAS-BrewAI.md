# Personas Document
# BrewAI — Specialty Coffee Shop Web Application

**Product Name:** BrewAI  
**Version:** 1.0  
**Date:** 2026-06-15  
**Related PRD:** PRD-BrewAI.md  
**Status:** Active

---

## Table of Contents

1. [Persona Summary](#1-persona-summary)
2. [PER-01: The Specialty Coffee Enthusiast](#2-per-01-the-specialty-coffee-enthusiast)
3. [PER-02: The Busy Commuter](#3-per-02-the-busy-commuter)
4. [PER-03: The Occasional Treat Seeker](#4-per-03-the-occasional-treat-seeker)
5. [Persona Relationships](#5-persona-relationships)
6. [Feature-Persona Matrix](#6-feature-persona-matrix)

---

## 1. Persona Summary

| PER-ID | Name | Role | Primary Goal |
|--------|------|------|--------------|
| PER-01 | Marcus Reyes | Specialty Coffee Enthusiast | Dial in a precise, custom drink order without verbally negotiating every detail at the counter |
| PER-02 | Priya Nair | Busy Morning Commuter | Find, configure, and confirm a familiar order as fast as possible before her train |
| PER-03 | Jordan Ellis | Occasional Treat Seeker | Discover something new, understand what they're ordering, and feel good about the splurge |

---

## 2. PER-01: The Specialty Coffee Enthusiast

**Identity:** Marcus Reyes — Specialty Coffee Enthusiast

---

**Role & Context:**

Marcus is a 28-year-old graphic designer who treats specialty coffee as a craft hobby. He follows roasters on social media, owns a home grinder, and reads tasting notes the way others read wine labels. When he walks into a coffee shop, he already knows exactly what he wants — a double ristretto with oat milk and a Himalayan-salt caramel shot, served iced — and he's quietly frustrated every time he has to spell it out verbally while a queue forms behind him. Marcus visits specialty shops 4–5 times a week, usually on a laptop or his iPhone 14 Pro. He appreciates visual design and notices immediately when a UI feels cheap or generic. He is the user most likely to explore every customization option the app offers, and most likely to abandon an app that makes him feel like his preferences don't matter.

**Goals:**
- Configure a fully custom drink — milk type, temperature, shot count, and add-ons — without compromising any option (F2)
- Browse the menu by category to zero in on espresso-based drinks quickly (F1)
- Trust that what he builds in the customization modal is exactly what gets prepared — no guesswork (F2, F4)
- Experience a UI that feels as premium as the coffee itself — dark, warm, polished (F0, F6)

**Pain Points:**
- Verbal customization at the counter leads to preparation errors ("I said oat, not almond")
- Most coffee shop apps expose only size and temperature — no shot count, no milk, no add-ons
- Low-contrast, visually generic interfaces feel inconsistent with premium coffee culture
- Category filters are often absent, forcing him to scroll through a wall of drinks to find espresso options

**Technical Expertise:** High — daily smartphone and laptop user, comfortable with web apps, quick to explore UI affordances without hand-holding

**Top Tasks:**
1. Filter menu to the Espresso category and scan available drinks (daily, critical)
2. Open the customization modal and configure milk type, shot count, temperature, and add-ons precisely (daily, critical)
3. Review cart to confirm all customizations are captured correctly before placing (daily, high)
4. Place order and receive confirmation number to reference at pick-up (daily, high)
5. Search by keyword when looking for a specific roast or seasonal offering (several times/week, medium)

**Success Criteria:**
- Can fully configure a custom drink in under 60 seconds from opening the customization modal
- Every selected customization (milk, shots, extras) is visible in the cart line item summary
- Cart-to-confirmation flow completes in under 3 taps/clicks from a pre-built cart
- Zero layout or visual glitches at his viewport (1280px+ desktop, 390px mobile)

---

## 3. PER-02: The Busy Morning Commuter

**Identity:** Priya Nair — Busy Morning Commuter

---

**Role & Context:**

Priya is a 34-year-old product manager who stops at the same coffee shop three mornings a week on her way to the office. She always orders the same thing — a large iced oat latte with an extra shot — and her relationship with the ordering experience is purely transactional: she wants to confirm her order, get her number, and walk in to pick it up without waiting in line. She uses her Android phone exclusively in transit, often one-handed while the other grips a tote bag. She has 4 minutes between leaving her apartment and reaching the shop, and if an interface costs her more than that she simply joins the counter queue. Priya is not here to discover new drinks; she is here to execute a known order efficiently. She is deeply sensitive to mobile UX quality — slow taps, misaligned touch targets, and modal scroll jank will lose her immediately.

**Goals:**
- Complete an order on mobile in under 2 minutes, start to finish (F1, F2, F3, F4, F5)
- Reach the category and drink she always orders without extra steps (F1)
- Review and confirm her standard customization quickly with minimal taps (F2, F3)
- Get a clear order confirmation she can reference at pick-up (F4)

**Pain Points:**
- Poor mobile experiences with tiny tap targets break one-handed ordering flow
- Slow page loads on 4G during her commute cost her the window she has
- Generic coffee shop sites require account creation just to place a simple order
- Cart management on most sites resets on navigation, forcing her to start over
- Horizontal scroll or layout overflow at 390px is an immediate exit trigger

**Technical Expertise:** Intermediate — power smartphone user, expects native-app-quality responsiveness from web experiences; no tolerance for friction or slow feedback

**Top Tasks:**
1. Load the menu and navigate to the Espresso/Cold Brew category immediately (every visit, critical)
2. Open the customization modal, confirm size and milk type quickly, add to cart (every visit, critical)
3. Verify the cart shows the right item and tap "Place Order" (every visit, critical)
4. Read the confirmation screen and pocket her phone (every visit, high)
5. Occasionally clear the cart and start over if she adds the wrong item (infrequent, medium)

**Success Criteria:**
- Menu page renders and is interactive in under 2.5 seconds on a mid-tier Android over 4G
- All tap targets are ≥ 44×44px; no missed taps on the quantity stepper or "Add to Cart"
- Cart state survives navigation back to the menu (within-session persistence)
- Order confirmation screen loads without error on first submission attempt
- No horizontal overflow or clipped content at 390px viewport width

---

## 4. PER-03: The Occasional Treat Seeker

**Identity:** Jordan Ellis — Occasional Treat Seeker

---

**Role & Context:**

Jordan is a 22-year-old college student who treats specialty coffee as an occasional splurge rather than a daily ritual. They come in on weekend afternoons or after a big exam, often with a friend, and they genuinely enjoy browsing — reading descriptions, noticing flavour notes, debating between a seasonal drink and a classic cold brew. Jordan doesn't know the difference between a ristretto and a lungo, but they want to. They're curious about the menu and appreciate a UI that explains what something is before they commit. Jordan uses a mix of devices — iPhone at the shop, MacBook at home — and they are comfortable with modern web apps but not forgiving of confusing flows. They are the user most likely to abandon mid-customization if the modal is overwhelming or unclear. They are also the user most likely to return if the experience felt delightful.

**Goals:**
- Discover appealing drinks through clear descriptions and visually rich menu cards (F1)
- Understand customization options without jargon — what does "shot count" mean for this drink? (F2)
- See the live price update as they add extras, so the splurge feels intentional and controlled (F2)
- Complete the order and feel confident they got what they wanted (F3, F4)
- Experience the brand aesthetic — the design should feel as premium as the price tag suggests (F0, F6)

**Pain Points:**
- Menus without descriptions leave them unable to distinguish between similar drinks
- Customization modals that show irrelevant options (e.g., shot count on a tea) feel confusing
- No real-time price feedback makes adding extras feel risky or opaque
- Generic, low-contrast UIs undermine the sense that the coffee is worth what they're paying
- Empty states with no guidance leave them unsure whether to search differently or give up

**Technical Expertise:** Intermediate — comfortable with consumer web and mobile apps; expects intuitive, self-explanatory flows; reads labels and descriptions before tapping

**Top Tasks:**
1. Browse the full menu grid and read drink descriptions to find something appealing (each visit, critical)
2. Use category filters or keyword search to narrow choices when undecided (most visits, high)
3. Open the customization modal, read through options, and make intentional selections (each visit, high)
4. Watch the live price update to decide whether to add extras (each visit, medium)
5. Place the order and show the confirmation screen to a friend as social proof (occasional, medium)

**Success Criteria:**
- Every menu card displays a meaningful, readable description — never just a drink name
- Customization modal shows only options relevant to the selected drink type (no shot count on tea)
- Price delta is visible and updates in real time as each option is selected
- Empty search/filter state includes a helpful prompt (e.g., "Try 'cold brew' or browse All")
- Order confirmation screen feels conclusive — order number, itemized summary, and ready-time estimate all visible without scrolling on a 390px viewport

---

## 5. Persona Relationships

| Interaction | PER-01 Marcus | PER-02 Priya | PER-03 Jordan |
|-------------|--------------|--------------|---------------|
| **PER-01 Marcus** | — | Parallel users; Marcus may be ahead of Priya in the pick-up queue; both benefit from order accuracy | Marcus's precise customization patterns surface which options matter most; Jordan benefits from a well-designed modal Marcus pressure-tests |
| **PER-02 Priya** | Priya values speed; Marcus values depth — both require a zero-friction customization path | — | Priya's efficiency demands raise the mobile baseline that Jordan also enjoys |
| **PER-03 Jordan** | Jordan's discovery behaviour surfaces menu description quality that Marcus also reads for tasting notes | Jordan's slower, exploratory pace doesn't block Priya — they're on separate sessions | — |

**Key interaction insight:** All three personas share the same guest ordering flow (browse → customize → cart → confirm). They differ in *pace*, *depth of customization*, and *discovery intent* — not in the flow itself. Designing the customization modal (F2) and menu cards (F1) to serve Marcus's depth and Jordan's clarity will naturally satisfy Priya's need for speed.

---

## 6. Feature-Persona Matrix

| Feature | Description | PER-01 Marcus | PER-02 Priya | PER-03 Jordan |
|---------|-------------|:-------------:|:------------:|:-------------:|
| **F0** | Design System & Component Foundation | Secondary | Secondary | Primary |
| **F1** | Menu Browsing & Category Filtering | Primary | Primary | Primary |
| **F2** | Drink Customization Modal | Primary | Primary | Primary |
| **F3** | Cart Management | Primary | Primary | Secondary |
| **F4** | Order Placement & Confirmation | Primary | Primary | Primary |
| **F5** | Responsive Layout & Navigation | Secondary | Primary | Secondary |
| **F6** | Animated Interactions & Micro-Animations | Primary | Secondary | Primary |
| **F7** | REST API & Data Persistence | Secondary | Secondary | Secondary |

**Legend:** Primary = core to this persona's success criteria | Secondary = used but not the defining experience | — = not applicable

### Matrix Notes

- **F0 (Design System):** Jordan is most affected by visual quality signals — a generic or low-contrast UI undermines their willingness to spend. Marcus notices it too, but his primary value is customization depth. Priya cares least about aesthetics; she cares about speed.
- **F1 (Menu Browsing):** All three personas depend on this equally — it's the entry point for every session.
- **F2 (Customization Modal):** The highest-stakes feature across all personas. Marcus needs maximum option depth. Priya needs minimum taps to reach her defaults. Jordan needs clarity and live price feedback. All three definitions of success must be satisfied simultaneously.
- **F5 (Responsive Layout):** Priya is the canary — if the mobile layout breaks, she exits. Marcus and Jordan also benefit but have more tolerant fallback behaviours.
- **F6 (Micro-Animations):** Marcus and Jordan perceive and value polished transitions. Priya tolerates them only if they add no perceived latency (150–200ms cap is essential for her).
- **F7 (REST API):** All personas depend on it implicitly — it enables F1 and F4 — but none interact with it directly. Marked Secondary as an infrastructure dependency, not a UX touchpoint.

---

*Document generated: 2026-06-15 | BrewAI v1.0 PERSONAS | Derived from: PRD-BrewAI.md § 2.2 Target Users*
