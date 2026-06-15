# User Stories
# BrewAI — Specialty Coffee Shop Web Application

**Version:** 1.0
**Date:** 2026-06-15
**Project Acronym:** BrewAI
**Status:** Active
**Generated from:** PRD-BrewAI.md v1.0, FRD-BrewAI.md v1.0, PERSONAS-BrewAI.md v1.0

---

## Personas

| Persona | Name | Role | Primary Goal |
|---------|------|------|--------------|
| PER-01 | Marcus Reyes | Specialty Coffee Enthusiast | Dial in a precise, custom drink without verbal negotiation |
| PER-02 | Priya Nair | Busy Morning Commuter | Complete a familiar order in under 2 minutes on mobile |
| PER-03 | Jordan Ellis | Occasional Treat Seeker | Discover and understand something new; feel good about the splurge |

---

## Priority Definitions

| Priority | Label | Meaning |
|----------|-------|---------|
| **P0** | Critical (MVP) | Must be complete before v1 ships — core ordering loop depends on it |
| **P1** | High | Required for production quality — implemented alongside P0, not deferred |
| **P2** | Medium | Enhances experience; can be deferred to a future sprint |
| **P3** | Low | Nice-to-have; deferred post-v1 |

---

## Table of Contents

1. [Epic 0: Design System & Component Foundation (F0)](#epic-0-design-system--component-foundation-f0)
2. [Epic 1: Menu Browsing & Category Filtering (F1)](#epic-1-menu-browsing--category-filtering-f1)
3. [Epic 2: Drink Customization Modal (F2)](#epic-2-drink-customization-modal-f2)
4. [Epic 3: Cart Management (F3)](#epic-3-cart-management-f3)
5. [Epic 4: Order Placement & Confirmation (F4)](#epic-4-order-placement--confirmation-f4)
6. [Epic 5: Responsive Layout & Navigation (F5)](#epic-5-responsive-layout--navigation-f5)
7. [Epic 6: Animated Interactions & Micro-Animations (F6)](#epic-6-animated-interactions--micro-animations-f6)
8. [Epic 7: REST API & Data Persistence (F7)](#epic-7-rest-api--data-persistence-f7)
9. [Story Index](#story-index)

---

## Epic 0: Design System & Component Foundation (F0)

> The foundational visual and interactive language that all other features consume. Every color token, typography scale, border radius, and animation duration is defined once here and referenced everywhere. No feature may hardcode values outside this system.

---

### US-0.1: Consistent Design Tokens Across the App
**As a** Marcus Reyes (coffee enthusiast), **I want to** experience a visually consistent UI with a dark, warm-amber aesthetic throughout, **so that** the digital interface feels as premium as the specialty coffee it represents.

**Acceptance Criteria:**
- [ ] The HTML/body background is set to `#0A0A0A` (Canvas) globally — no page shows a white or grey background
- [ ] All interactive CTAs, focus rings, and highlights use the amber accent color `#C8922A`
- [ ] Card and panel backgrounds use `#141414` (Surface); elevated elements (modals, dropdowns) use `#1C1C1C` (Surface Raised)
- [ ] No raw hex color values appear in `.tsx` or `.ts` files outside `tailwind.config.ts` and `src/index.css`
- [ ] All border radii follow the design system: inputs `6px`, cards `12px`, pills `20px`
- [ ] Primary readable text uses `#F5F0E8` at sufficient contrast (≥ 4.5:1) against surface backgrounds

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Bundled Fonts Load Without CDN
**As a** Priya Nair (busy commuter), **I want to** see the app's typography render correctly even on a restricted network, **so that** the interface is readable and usable when I'm ordering during my commute.

**Acceptance Criteria:**
- [ ] Inter (body font) and Playfair Display (heading font) load from the same origin as the app — no Google Fonts CDN request is made at runtime
- [ ] Fonts are declared via `@font-face` in `src/index.css` pointing to `/assets/fonts/*.woff2` files bundled in the build
- [ ] Express serves `/assets/fonts/` as a static directory; fonts load over HTTP from `localhost:3000`
- [ ] On a network with all external CDN requests blocked, the correct fonts still render (system font is not used)
- [ ] Drink names render in Playfair Display; body text, labels, and buttons render in Inter

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: Reusable Primitive Components Available to All Features
**As a** developer building any feature (F1–F7), **I want to** import typed, design-system-consistent primitive components, **so that** I can build UI without reimplementing buttons, inputs, or modals from scratch.

**Acceptance Criteria:**
- [ ] The following primitive components are exported from `src/components/ui/index.ts`: `Button`, `Badge`, `Card`, `Input`, `Select`, `Modal`, `Spinner`
- [ ] `Button` supports variants `primary`, `secondary`, `ghost`, `danger` and sizes `sm`, `md`, `lg`; min-height is `44px` on all sizes
- [ ] `Button` with `loading={true}` renders a `Spinner` and disables interaction
- [ ] `Modal` closes on Escape keydown and backdrop click; focus is trapped inside while open; focus returns to the trigger element on close
- [ ] All primitive components are explicitly typed (TypeScript strict mode; no `any` types)
- [ ] Each icon-only button variant requires or provides a default `aria-label` prop

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: Keyboard Focus Rings for Accessibility
**As a** Jordan Ellis (occasional treat seeker), **I want to** navigate the app entirely by keyboard when I choose to, **so that** the ordering flow is accessible and I don't have to reach for the mouse.

**Acceptance Criteria:**
- [ ] All interactive elements (buttons, inputs, links, selectors) display a `2px solid #C8922A` focus ring when focused via keyboard (`focus-visible`)
- [ ] Focus rings are applied globally via Tailwind `focus-visible:ring-2 focus-visible:ring-accent` in component defaults — not manually on each element
- [ ] Focus rings do not appear on mouse click (only on keyboard navigation — uses `:focus-visible`, not `:focus`)
- [ ] All color contrasts for text elements meet WCAG AA (≥ 4.5:1 for body text)
- [ ] A keyboard-only session can navigate from the menu to a product card CTA and back without losing focus position

**Priority:** P0 | **Feature Ref:** F0

---

## Epic 1: Menu Browsing & Category Filtering (F1)

> The primary customer-facing surface. Customers can see the full drinks menu, filter by category, and search by keyword — all in a fast, visually rich, brand-consistent experience.

---

### US-1.1: View the Full Menu on Page Load
**As a** Jordan Ellis (occasional treat seeker), **I want to** see all available drinks displayed as rich product cards when I open the app, **so that** I can browse and discover something I want to order.

**Acceptance Criteria:**
- [ ] The menu page (`/`) fetches all items from `GET /api/menu` on mount and renders them as a responsive card grid
- [ ] Each product card displays: drink name (Playfair Display), short description (2-line clamp), price formatted as `$X.XX` in amber accent, category badge, and a CTA button
- [ ] Cards with `hasCustomizations: true` show a "Customize" CTA; cards with `hasCustomizations: false` show an "Add to Cart" CTA
- [ ] Items with `available: false` are not shown on the menu
- [ ] While the API call is in-flight, 8 skeleton card placeholders are displayed in the grid layout
- [ ] Cards animate in with a staggered `fadeIn` + `slideUp` on initial render

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: Filter Menu by Category
**As a** Marcus Reyes (coffee enthusiast), **I want to** filter the menu to show only Espresso drinks, **so that** I can quickly scan the espresso options without scrolling through teas and cold brews.

**Acceptance Criteria:**
- [ ] A category filter bar renders one pill-shaped toggle per unique category (derived from API data — not hardcoded) plus an "All" pill that is active by default
- [ ] Clicking a category pill filters the displayed cards to show only items in that category; the selected pill is visually highlighted with the accent color
- [ ] Only one category filter can be active at a time (single-select); clicking the same pill again resets to "All"
- [ ] The "All" pill is always rendered first, regardless of alphabetical sort of other categories
- [ ] Category filter changes take effect immediately (no loading state needed for client-side filtering)
- [ ] On mobile, the category filter bar scrolls horizontally without causing page-level horizontal scroll

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: Search Menu by Keyword
**As a** Marcus Reyes (coffee enthusiast), **I want to** type a keyword like "oat" or "ristretto" to find specific drinks, **so that** I can zero in on exactly what I'm looking for without scrolling.

**Acceptance Criteria:**
- [ ] A search input is displayed at the top of the menu page with a visible placeholder (e.g., "Search drinks…")
- [ ] Typing in the search input filters the menu cards in real time, matching against both `name` and `description` fields (case-insensitive, substring match)
- [ ] Search filtering is debounced at 200ms to avoid excessive re-renders on rapid keystrokes
- [ ] Category filter and search query are applied together (AND logic): only items matching both the active category and the search query are shown
- [ ] Clearing the search input restores the previous category-filtered view immediately

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.4: See a Helpful Empty State When No Results Match
**As a** Jordan Ellis (occasional treat seeker), **I want to** see a helpful message and a way to reset when my search or filter returns nothing, **so that** I'm not left staring at a blank page wondering if the menu is broken.

**Acceptance Criteria:**
- [ ] When the combined filter + search yields zero items, an empty state view is shown in place of the card grid
- [ ] The empty state includes a descriptive message (e.g., "No drinks match your search") and a "Clear filters" action
- [ ] Clicking "Clear filters" resets both `activeCategory` to `'All'` and `searchQuery` to `''`, restoring the full menu
- [ ] The empty state is visually distinct from the loading skeleton (no skeleton placeholders shown during empty state)
- [ ] If the API returns an empty array (no seeded items), a separate "No drinks available yet" message is shown without the "Clear filters" action

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.5: Recover from a Menu Load Failure
**As a** Priya Nair (busy commuter), **I want to** see an error message with a retry option if the menu fails to load, **so that** I can try again without refreshing the entire page and losing my progress.

**Acceptance Criteria:**
- [ ] If `GET /api/menu` fails (network error or 5xx), the skeleton grid is replaced by an inline error message
- [ ] The error state shows a human-readable message ("Could not load the menu. Please try again.") and a "Retry" button
- [ ] Clicking "Retry" re-invokes `fetchMenu()` and shows the skeleton loading state again while the request is in-flight
- [ ] The error state does not show skeleton cards — only the error message and retry button

**Priority:** P0 | **Feature Ref:** F1

---

## Epic 2: Drink Customization Modal (F2)

> When a customer selects a drink, a modal opens with all relevant customization controls. Options are driven by menu data — only controls applicable to the selected drink type are rendered. Real-time price updates keep the customer informed.

---

### US-2.1: Open the Customization Modal for a Drink
**As a** Marcus Reyes (coffee enthusiast), **I want to** tap "Customize" on a drink card and have a modal open with all customization options, **so that** I can configure my order precisely without navigating away from the menu.

**Acceptance Criteria:**
- [ ] Clicking "Customize" on a product card opens a modal dialog for that specific drink
- [ ] The modal displays the drink name, base price, and all applicable customization controls (size, milk, temperature, shot count, add-ons, special instructions)
- [ ] The modal animates in with a `scaleIn` + `fadeIn` effect (200ms); it animates out with the reverse on close
- [ ] The modal has a visible "×" close button, and can also be closed by pressing Escape or clicking the backdrop
- [ ] Focus is trapped inside the modal while it is open; pressing Tab cycles through interactive elements within the modal
- [ ] When the modal closes, focus returns to the "Customize" button that triggered it

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Select Size and See Price Update in Real Time
**As a** Jordan Ellis (occasional treat seeker), **I want to** see the price update immediately when I change the drink size, **so that** I know exactly what I'm committing to before I add it to my cart.

**Acceptance Criteria:**
- [ ] Size options (Small, Medium, Large) are displayed as a radio-style selector with the price delta shown next to each option (e.g., "Small −$0.50", "Medium $0.00", "Large +$0.75")
- [ ] Selecting a size immediately updates the displayed total price using the formula: `(base_price + size_delta) + sum(selected addon prices)` × quantity
- [ ] Medium is the default selected size when the modal opens (or the first size in the list if Medium is not available)
- [ ] The per-item price and the total price (per-item × quantity) are both displayed in the modal footer
- [ ] The "Add to Cart" button is not disabled by size selection alone (a default is always pre-selected)

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Customize Milk Type, Temperature, and Shot Count
**As a** Marcus Reyes (coffee enthusiast), **I want to** set my milk type to oat, temperature to iced, and shot count to double, **so that** exactly what I build in the modal is what gets prepared — no verbal corrections needed.

**Acceptance Criteria:**
- [ ] Milk type selector shows only the milk options defined for the selected drink (Whole, Oat, Almond, Coconut, Skim, None); if `milks` is an empty array, the selector is not rendered
- [ ] Temperature selector shows Hot, Iced, and/or Blended only for the options the drink supports; if only one temperature is available, it is shown as a static read-only label (not a selector)
- [ ] Shot count selector (Single, Double, Triple) is shown **only** for drinks with `drink_type = 'espresso'`; it is completely absent for cold brews, pour-overs, and teas
- [ ] "Double" is the default shot count for espresso drinks
- [ ] All selectors use `<fieldset>` + `<legend>` grouping for accessibility; each option is keyboard-navigable
- [ ] The selected customizations are reflected in the cart item summary when added (e.g., "Large · Oat · Iced · Double")

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.4: Add Extras and See Total Price Update
**As a** Jordan Ellis (occasional treat seeker), **I want to** select add-ons like Vanilla Syrup and see the price increment immediately, **so that** my splurge feels intentional and I'm never surprised by the total.

**Acceptance Criteria:**
- [ ] Add-ons are displayed as a multi-select chip/checkbox group; each chip shows the add-on label and its price (e.g., "Vanilla Syrup +$0.75")
- [ ] Selecting an add-on immediately adds its price to the displayed total; deselecting removes it
- [ ] Multiple add-ons can be selected simultaneously (no single-select restriction)
- [ ] Selecting an already-selected add-on chip toggles it off
- [ ] The add-ons section is only shown if the drink has at least one extra defined in its `options.extras` array; if `extras` is empty, the section is not rendered
- [ ] Total price formula: `(base_price + size_delta + sum(addon prices)) × quantity` — both per-item and total are shown

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.5: Add a Special Instructions Note
**As a** Marcus Reyes (coffee enthusiast), **I want to** add a free-text note like "no foam, extra hot" to my order, **so that** edge-case preferences I can't configure via standard options still get communicated to the barista.

**Acceptance Criteria:**
- [ ] The modal includes a "Special instructions" textarea with a visible character limit of 200
- [ ] A live character counter is displayed below the textarea (e.g., "45/200")
- [ ] When ≤ 10 characters remain, the counter turns red (error color `#EF4444`)
- [ ] The textarea blocks additional input once the 200-character limit is reached
- [ ] Special instructions are included in the `CartItem.customizations.specialInstructions` field when added to cart
- [ ] Special instructions are visible in the submitted order payload; they are not shown in the cart line-item summary string (summary shows size/milk/temp/shots/addons only)

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.6: Set Quantity and Add to Cart
**As a** Priya Nair (busy commuter), **I want to** set my quantity to 1 and tap "Add to Cart" in as few taps as possible, **so that** I can complete my order before my train arrives.

**Acceptance Criteria:**
- [ ] A quantity stepper (decrement / count display / increment) is shown in the modal with a range of 1–10; default is 1
- [ ] The decrement button is disabled when quantity is 1; the increment button is disabled when quantity is 10
- [ ] Both stepper buttons have ARIA labels: `aria-label="Decrease quantity"` and `aria-label="Increase quantity"`
- [ ] Clicking "Add to Cart" validates that a size is selected (always true by default), builds the `CartItem` object, dispatches `cartStore.addItem()`, closes the modal with its exit animation, and shows a toast: "[Drink Name] added to cart"
- [ ] Total price in the modal footer updates as quantity changes
- [ ] After a successful "Add to Cart" action, the cart badge count in the navigation bar increments to reflect the new total

**Priority:** P0 | **Feature Ref:** F2

---

## Epic 3: Cart Management (F3)

> A persistent in-session cart accessible from any page via the navigation bar. Customers can review, adjust, and remove items before placing their order.

---

### US-3.1: View the Cart and Its Items
**As a** Marcus Reyes (coffee enthusiast), **I want to** open the cart and see every item I've added with its full customization summary, **so that** I can verify my order is correct before placing it.

**Acceptance Criteria:**
- [ ] The navigation bar shows a cart icon (Lucide `ShoppingCart`) with a badge displaying the total item count (sum of all quantities)
- [ ] Clicking the cart icon opens a cart drawer that slides in from the right on desktop, or slides up from the bottom on mobile
- [ ] Each cart line item displays: drink name, customization summary string (e.g., "Large · Oat · Iced · Vanilla Syrup"), unit price, quantity stepper, and a remove button
- [ ] The cart drawer shows a running subtotal in the footer formatted as `$XX.XX` (2 decimal places, USD)
- [ ] Cart state persists across route changes within the same browser session (navigating from cart back to menu does not clear items)
- [ ] Cart state is NOT persisted across page refreshes (session-only; this is expected behavior)

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: Adjust Item Quantity in the Cart
**As a** Priya Nair (busy commuter), **I want to** quickly change the quantity of an item in my cart, **so that** I can correct a mistake without removing and re-adding the item.

**Acceptance Criteria:**
- [ ] Each cart line item includes a quantity stepper with decrement (−) and increment (+) buttons
- [ ] The increment button is disabled when the item quantity reaches 10
- [ ] Decrementing when `quantity === 1` removes the item from the cart entirely (no separate confirmation needed for this action)
- [ ] The subtotal in the cart footer updates immediately after every quantity change
- [ ] Stepper buttons have ARIA labels: `aria-label="Increase quantity for [Drink Name]"` and `aria-label="Decrease quantity for [Drink Name]"`

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: Remove an Item from the Cart
**As a** Priya Nair (busy commuter), **I want to** remove a wrong item from my cart with a single tap, **so that** I can fix a mistake quickly without clearing the entire cart.

**Acceptance Criteria:**
- [ ] Each cart line item has a "×" or trash icon button that removes the item immediately (no confirmation dialog for single-item removal)
- [ ] The remove button has `aria-label="Remove [Drink Name] from cart"`
- [ ] The removed item animates out of the list (fade + slide-left, 150ms)
- [ ] If removing the item makes the cart empty, the empty cart state is shown immediately
- [ ] The cart badge count and subtotal update immediately after removal

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.4: Clear All Items from the Cart
**As a** Priya Nair (busy commuter), **I want to** clear my entire cart and start over when I've added the wrong things, **so that** I can restart quickly without removing items one by one.

**Acceptance Criteria:**
- [ ] A "Clear Cart" button is visible in the cart drawer (not in the cart footer — positioned separately to avoid accidental taps near the subtotal)
- [ ] Clicking "Clear Cart" shows a confirmation prompt: "Remove all items from your cart?" with "Cancel" and "Clear All" buttons
- [ ] Clicking "Clear All" calls `cartStore.clearCart()`, removes all items, and shows the empty cart state
- [ ] Clicking "Cancel" dismisses the confirmation prompt without making any changes to the cart
- [ ] "Clear Cart" button has `aria-label="Clear all items from cart"`

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.5: View an Empty Cart State with a Path Back to the Menu
**As a** Jordan Ellis (occasional treat seeker), **I want to** see a helpful prompt when my cart is empty, **so that** I know where to go to start adding items.

**Acceptance Criteria:**
- [ ] When the cart has no items, the cart drawer shows an empty state view instead of a line-item list
- [ ] The empty state includes a brief message (e.g., "Your cart is empty") and a "Browse Menu" link or button that closes the cart drawer and navigates to the menu page
- [ ] The "Place Order" button in the cart footer is disabled (visually muted and `aria-disabled="true"`) when the cart is empty
- [ ] The cart badge in the navigation bar shows no count (or the badge is hidden) when the cart is empty

**Priority:** P0 | **Feature Ref:** F3

---

## Epic 4: Order Placement & Confirmation (F4)

> The final step in the ordering loop. The customer reviews their cart, places the order with a single action, and receives a confirmation screen with a unique order reference number.

---

### US-4.1: Place an Order from the Cart
**As a** Priya Nair (busy commuter), **I want to** tap "Place Order" once from the cart and have my order submitted immediately, **so that** I can confirm my order before I reach the shop without any unnecessary steps.

**Acceptance Criteria:**
- [ ] The cart drawer footer contains a "Place Order" button that is enabled only when the cart has at least one item
- [ ] Clicking "Place Order" enters a loading state: the button shows a spinner and the text "Placing order…", and is disabled to prevent double submission
- [ ] The order payload (all cart items, customizations, and subtotal) is submitted via `POST /api/orders`
- [ ] On HTTP 201 success: the cart is cleared, the cart drawer closes, and the customer is navigated to the confirmation screen
- [ ] On success, the order is persisted in SQLite and retrievable via `GET /api/orders/:id`

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.2: See a Clear Order Confirmation Screen
**As a** Marcus Reyes (coffee enthusiast), **I want to** see a confirmation screen with my order reference number and an itemized summary, **so that** I can reference it at the pick-up counter with confidence.

**Acceptance Criteria:**
- [ ] The confirmation screen displays a success icon (Lucide `CheckCircle2` in success green), the heading "Order Placed!", and the order reference number in `BRW-NNNNN` format (Playfair Display, amber accent)
- [ ] The confirmation screen shows an itemized order summary: each drink name, customization summary, quantity, and line-item price
- [ ] The subtotal is displayed at the bottom of the itemized list
- [ ] A static estimated ready time of "15–20 minutes" is shown (Inter, muted color)
- [ ] On a 390px mobile viewport, all key information (order reference, item summary, estimated time) is visible without scrolling
- [ ] The confirmation screen's main heading receives focus on navigation (for screen reader announcement)

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.3: Handle Order Submission Errors Gracefully
**As a** Priya Nair (busy commuter), **I want to** see a clear error message with a retry option if my order fails to submit, **so that** I don't lose my cart and can try again without starting over.

**Acceptance Criteria:**
- [ ] If `POST /api/orders` returns a 4xx/5xx or a network error, the loading state is cleared and the "Place Order" button is re-enabled
- [ ] An inline error message is shown below the "Place Order" button with a human-readable description and a "Try Again" button
- [ ] Error messages match the error catalog: network failure → "Could not reach the server. Check your connection and try again."; server error → "Something went wrong placing your order. Please try again."
- [ ] The cart contents are fully preserved after a failed submission — no items are removed
- [ ] Clicking "Try Again" re-submits the same `OrderPayload` without requiring any user changes

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.4: Start a New Order After Confirmation
**As a** Jordan Ellis (occasional treat seeker), **I want to** tap "Start a New Order" on the confirmation screen and be taken back to a fresh menu, **so that** I can order again for a friend or explore other drinks.

**Acceptance Criteria:**
- [ ] The confirmation screen has a "Start a New Order" primary button (full-width on mobile)
- [ ] The button has `aria-label="Start a new order and return to menu"`
- [ ] Clicking the button navigates to the menu page (`/`); the cart is already cleared from the successful submission step
- [ ] The menu page reloads from the Zustand store cache or re-fetches if cache is stale — the customer does not see a blank/loading state longer than the standard fetch spinner

**Priority:** P0 | **Feature Ref:** F4

---

## Epic 5: Responsive Layout & Navigation (F5)

> The app is fully functional and polished across all viewports from 320px to 1920px. Navigation adapts between a compact mobile header and a full desktop top bar. All tap targets meet accessibility minimums.

---

### US-5.1: Navigate the App on Mobile with a Compact Header
**As a** Priya Nair (busy commuter), **I want to** see a compact, one-handed-friendly navigation header on my Android phone, **so that** I can access the menu and cart without fighting a desktop-style nav.

**Acceptance Criteria:**
- [ ] Below `768px` (< `md` breakpoint), a compact header is shown with the BrewAI logo (left) and the cart icon with badge (right); no nav links are shown in this header
- [ ] The logo is never clipped or overflowed on a 320px viewport; max logo width on mobile is `120px`
- [ ] The cart icon in the compact header is always accessible; tapping it opens the full-screen cart drawer
- [ ] At `768px+` (`md` breakpoint and above), the full top navigation bar is shown with logo, navigation links, and cart icon
- [ ] Both navigation variants reference the same `cartStore.totalCount` for the badge — the count is always consistent

**Priority:** P1 | **Feature Ref:** F5

---

### US-5.2: Browse the Menu in a Responsive Grid
**As a** Jordan Ellis (occasional treat seeker), **I want to** browse drink cards in a layout that fills my screen well whether I'm on my phone or laptop, **so that** I can see enough cards at a glance to make comparisons.

**Acceptance Criteria:**
- [ ] The menu grid uses: 1 column at < `sm` (320px–639px), 2 columns at `sm`–`lg` (640px–1023px), 3 columns at `lg`–`2xl` (1024px–1535px), 4 columns at `2xl+` (1536px+)
- [ ] On a 320px viewport, the single-column layout uses full container width with 16px horizontal padding; no content is clipped
- [ ] No horizontal scroll appears at any supported viewport width (320px–1920px)
- [ ] `overflow-x: hidden` is set on `<body>` and `<html>`; all containers use relative/percentage widths or `max-w-screen-*` constraints

**Priority:** P1 | **Feature Ref:** F5

---

### US-5.3: Use the Cart as a Full-Screen Overlay on Mobile
**As a** Priya Nair (busy commuter), **I want to** have the cart take up the full screen on my phone so I can read all item details clearly, **so that** I can review my order one-handed without squinting at a tiny side panel.

**Acceptance Criteria:**
- [ ] Below `768px` (< `md`), the cart drawer uses `fixed inset-0` (100vw × 100vh); a visible close button is present in the top-right corner
- [ ] At `768px+` (`md+`), the cart drawer is a slide-over panel fixed to the right edge, `400px` wide, with a backdrop covering the remaining viewport
- [ ] The cart drawer slide-in direction matches the viewport: slides up from the bottom on mobile, slides in from the right on desktop
- [ ] The customization modal uses a bottom-sheet style (`fixed bottom-0 left-0 right-0 max-h-[90vh] rounded-t-[20px]`) on mobile; a centered dialog (`max-w-[600px]`) on desktop

**Priority:** P1 | **Feature Ref:** F5

---

### US-5.4: Hit Touch Targets Accurately on Mobile
**As a** Priya Nair (busy commuter), **I want to** tap buttons and controls accurately on my Android phone one-handed, **so that** I don't accidentally hit the wrong button and waste time correcting mistakes.

**Acceptance Criteria:**
- [ ] All interactive elements (buttons, links, quantity steppers, category pills, close buttons) have a minimum tap target of `44×44px` on mobile viewports
- [ ] The `Button` primitive enforces `min-height: 44px` on all size variants via Tailwind utilities
- [ ] Quantity stepper buttons (both in the modal and in the cart) meet the 44×44px minimum
- [ ] Category filter pills meet the 44×44px minimum height or are padded to ensure comfortable touch area
- [ ] A usability check at 390px viewport confirms no accidental mis-taps on adjacent interactive elements

**Priority:** P1 | **Feature Ref:** F5

---

## Epic 6: Animated Interactions & Micro-Animations (F6)

> All meaningful UI state changes are animated with Framer Motion — purposeful, fast (150–200ms), and respectful of user accessibility preferences. Animations create a premium feel without adding perceived latency.

---

### US-6.1: Experience Smooth Card Entrance Animations on the Menu
**As a** Marcus Reyes (coffee enthusiast), **I want to** see menu cards animate in elegantly on page load, **so that** the app feels polished and intentional rather than a static dump of content.

**Acceptance Criteria:**
- [ ] On initial menu render, cards animate in with a staggered `fadeIn` + `slideUp` effect (200ms per card, 50ms stagger delay between cards)
- [ ] When the category filter changes, cards that leave animate out and new cards animate in via `AnimatePresence mode="popLayout"`
- [ ] When search results change, the same enter/exit animations apply to appearing and disappearing cards
- [ ] For grids with 30+ cards, the last card begins its entrance animation within 1.5 seconds of the first
- [ ] All card animations use the shared `cardVariants` and `staggerContainer` from `src/lib/motion.ts`

**Priority:** P1 | **Feature Ref:** F6

---

### US-6.2: See Smooth Modal and Drawer Transitions
**As a** Jordan Ellis (occasional treat seeker), **I want to** have the customization modal and cart drawer open and close with smooth transitions, **so that** the experience feels premium and not jarring.

**Acceptance Criteria:**
- [ ] The customization modal opens with `scaleIn` + `fadeIn` (200ms, easeOut) and closes with the reverse exit animation (150ms)
- [ ] The modal backdrop fades in at 150ms on open and fades out on close; the backdrop is blurred (`backdrop-blur-sm`)
- [ ] The cart drawer slides in from the right on desktop (200ms, easeOut) and slides up from the bottom on mobile (200ms, easeOut); reverse on close
- [ ] `AnimatePresence` wraps both the modal and the cart drawer so exit animations play before elements unmount
- [ ] Button press (all `Button` primitives) triggers a subtle scale-down (`scale: 0.97`) via `whileTap` (100ms, snappy)

**Priority:** P1 | **Feature Ref:** F6

---

### US-6.3: Get Feedback Toasts When Items Are Added to Cart
**As a** Priya Nair (busy commuter), **I want to** see a brief notification when an item is added to my cart, **so that** I get immediate confirmation without having to open the cart drawer to verify.

**Acceptance Criteria:**
- [ ] After a successful "Add to Cart" action, a toast notification slides in from the bottom-right corner with the message "[Drink Name] added to cart"
- [ ] The toast auto-dismisses after 3 seconds with a fade-out exit animation (150ms)
- [ ] A maximum of 3 toasts are visible simultaneously; the oldest toast is removed when a 4th is added
- [ ] Toasts stack vertically at `fixed bottom-4 right-4` with `2px` gap between them
- [ ] The cart badge count "pops" (scale keyframe `[1, 1.3, 1]` over 300ms) whenever `totalCount` changes

**Priority:** P1 | **Feature Ref:** F6

---

### US-6.4: Have Animations Disabled When Reduced Motion Is Preferred
**As a** any user who has enabled "Reduce Motion" in their OS settings, **I want to** use the app without any animations, **so that** I'm not affected by motion that could cause discomfort or distraction.

**Acceptance Criteria:**
- [ ] All animated components check `useReducedMotion()` from `framer-motion` on render
- [ ] When `useReducedMotion()` returns `true`, all `motion.*` components render with `initial={false}` and no exit animations — elements appear and disappear instantly
- [ ] The `prefers-reduced-motion: reduce` CSS media query is also respected for any CSS-only transitions
- [ ] No animation exception exists — every animated component (menu cards, modal, drawer, toast, badge, page transitions) must obey the reduced-motion guard
- [ ] Reduced motion mode does not break any functional behavior; the app remains fully usable

**Priority:** P1 | **Feature Ref:** F6

---

## Epic 7: REST API & Data Persistence (F7)

> The Node.js + Express backend that serves menu data and persists orders to SQLite. The database auto-initializes and seeds itself on first run. The server binds to `0.0.0.0:3000` for sandbox compatibility.

---

### US-7.1: Load Menu Data from the API on App Start
**As a** Priya Nair (busy commuter), **I want to** see the menu load quickly with real drink data, **so that** I can start browsing and placing my order without waiting for a slow or unreliable data source.

**Acceptance Criteria:**
- [ ] `GET /api/menu` returns all available menu items (with `available = 1`) in the JSON envelope: `{ data: MenuItem[], error: null, status: 200 }`
- [ ] Each menu item includes: `id`, `name`, `description`, `basePrice`, `category`, `drinkType`, `hasCustomizations`, `available`, `sortOrder`, `options` (parsed from `options_json`), `createdAt`
- [ ] `GET /api/menu/categories` returns a sorted array of distinct category strings: `{ data: string[], error: null, status: 200 }`
- [ ] `GET /api/menu/:id` returns a single item with full options; returns `{ error: { code: 'ITEM_NOT_FOUND' }, status: 404 }` if the item doesn't exist or is unavailable
- [ ] On server cold start with an empty database, the seed script inserts 20–30 menu items across categories: Espresso, Cold Brew, Pour-Over, Tea, Seasonal — all items are immediately available via the API

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.2: Persist an Order to the Database
**As a** Marcus Reyes (coffee enthusiast), **I want to** know that my order is saved server-side when I place it, **so that** the barista can receive it and prepare it accurately.

**Acceptance Criteria:**
- [ ] `POST /api/orders` accepts the `OrderPayload` (items, subtotal, notes), persists the order atomically in a SQLite transaction, and returns HTTP 201 with `{ data: { orderId, orderReference, createdAt, items, subtotal }, error: null, status: 201 }`
- [ ] The `orderReference` is formatted as `BRW-{zero-padded orderId to 5 digits}` (e.g., `BRW-00042`)
- [ ] All line item customizations (size, milk, temperature, shots, addons, specialInstructions) are stored in `order_items.customizations_json`
- [ ] If the transaction fails (disk error, locked DB), the transaction is rolled back and the API returns `{ error: { code: 'DB_WRITE_ERROR' }, status: 500 }` — no partial order is persisted
- [ ] A placed order is immediately retrievable via `GET /api/orders/:id` and returns the full order with line items

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.3: Server Starts Automatically Without Manual Setup
**As a** developer deploying the app in a Docker sandbox, **I want to** run `npm start` and have the server come up with the database schema and seed data already in place, **so that** the app is fully functional immediately on cold start with no manual setup steps.

**Acceptance Criteria:**
- [ ] On server startup, `initDatabase()` runs synchronously before the server begins accepting requests; it creates the `menu_items`, `orders`, and `order_items` tables using `CREATE TABLE IF NOT EXISTS`
- [ ] If `menu_items` has zero rows after initialization, the seed script runs immediately and inserts 20–30 menu items
- [ ] The server binds to `0.0.0.0:3000` (not `127.0.0.1`) so it is accessible from outside the Docker container
- [ ] The console outputs `BrewAI server running on http://0.0.0.0:3000` when ready
- [ ] A subsequent restart with an existing database file does not re-run the seed script (seed runs only when `COUNT(*) = 0`)
- [ ] All npm dependencies install cleanly via `registry.npmjs.org`; no binary downloads via `curl`/`wget`; Docker base image is `node:20-bookworm-slim` (not Alpine)

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.4: API Validates Inputs and Returns Structured Errors
**As a** developer consuming the API (and transitively, as any user whose request might fail validation), **I want to** receive structured, descriptive error responses, **so that** the frontend can show the right error message and the system remains secure.

**Acceptance Criteria:**
- [ ] All API responses use the envelope: `{ data: <payload>|null, error: <ErrorObject>|null, status: <httpCode> }`
- [ ] `POST /api/orders` with an empty or missing `items` array returns `{ error: { code: 'EMPTY_ORDER' }, status: 400 }`
- [ ] `POST /api/orders` with a missing required field returns `{ error: { code: 'INVALID_PAYLOAD', field: '<fieldName>' }, status: 400 }`
- [ ] Route parameters (`id`) that are not positive integers return `{ error: { code: 'INVALID_ID' }, status: 400 }`
- [ ] All SQL queries use parameterized statements (`db.prepare('... WHERE id = ?').get(id)`) — no string interpolation in SQL; API inputs are never directly concatenated into queries
- [ ] An unmatched route returns `{ error: { code: 'NOT_FOUND', message: 'Route not found' }, status: 404 }`

**Priority:** P0 | **Feature Ref:** F7

---

## Story Index

| Story ID | Title | Persona(s) | Priority | Feature Ref |
|----------|-------|------------|----------|-------------|
| US-0.1 | Consistent Design Tokens Across the App | Marcus, Jordan | P0 | F0 |
| US-0.2 | Bundled Fonts Load Without CDN | Priya | P0 | F0 |
| US-0.3 | Reusable Primitive Components Available to All Features | Dev | P0 | F0 |
| US-0.4 | Keyboard Focus Rings for Accessibility | Jordan | P0 | F0 |
| US-1.1 | View the Full Menu on Page Load | Jordan | P0 | F1 |
| US-1.2 | Filter Menu by Category | Marcus | P0 | F1 |
| US-1.3 | Search Menu by Keyword | Marcus | P0 | F1 |
| US-1.4 | See a Helpful Empty State When No Results Match | Jordan | P0 | F1 |
| US-1.5 | Recover from a Menu Load Failure | Priya | P0 | F1 |
| US-2.1 | Open the Customization Modal for a Drink | Marcus | P0 | F2 |
| US-2.2 | Select Size and See Price Update in Real Time | Jordan | P0 | F2 |
| US-2.3 | Customize Milk Type, Temperature, and Shot Count | Marcus | P0 | F2 |
| US-2.4 | Add Extras and See Total Price Update | Jordan | P0 | F2 |
| US-2.5 | Add a Special Instructions Note | Marcus | P0 | F2 |
| US-2.6 | Set Quantity and Add to Cart | Priya | P0 | F2 |
| US-3.1 | View the Cart and Its Items | Marcus | P0 | F3 |
| US-3.2 | Adjust Item Quantity in the Cart | Priya | P0 | F3 |
| US-3.3 | Remove an Item from the Cart | Priya | P0 | F3 |
| US-3.4 | Clear All Items from the Cart | Priya | P0 | F3 |
| US-3.5 | View an Empty Cart State with a Path Back to the Menu | Jordan | P0 | F3 |
| US-4.1 | Place an Order from the Cart | Priya | P0 | F4 |
| US-4.2 | See a Clear Order Confirmation Screen | Marcus | P0 | F4 |
| US-4.3 | Handle Order Submission Errors Gracefully | Priya | P0 | F4 |
| US-4.4 | Start a New Order After Confirmation | Jordan | P0 | F4 |
| US-5.1 | Navigate the App on Mobile with a Compact Header | Priya | P1 | F5 |
| US-5.2 | Browse the Menu in a Responsive Grid | Jordan | P1 | F5 |
| US-5.3 | Use the Cart as a Full-Screen Overlay on Mobile | Priya | P1 | F5 |
| US-5.4 | Hit Touch Targets Accurately on Mobile | Priya | P1 | F5 |
| US-6.1 | Experience Smooth Card Entrance Animations on the Menu | Marcus | P1 | F6 |
| US-6.2 | See Smooth Modal and Drawer Transitions | Jordan | P1 | F6 |
| US-6.3 | Get Feedback Toasts When Items Are Added to Cart | Priya | P1 | F6 |
| US-6.4 | Have Animations Disabled When Reduced Motion Is Preferred | All users | P1 | F6 |
| US-7.1 | Load Menu Data from the API on App Start | Priya | P0 | F7 |
| US-7.2 | Persist an Order to the Database | Marcus | P0 | F7 |
| US-7.3 | Server Starts Automatically Without Manual Setup | Dev | P0 | F7 |
| US-7.4 | API Validates Inputs and Returns Structured Errors | Dev | P0 | F7 |

---

### Priority Breakdown

| Priority | Count | Story IDs |
|----------|-------|-----------|
| P0 — Critical (MVP) | 28 | US-0.1–0.4, US-1.1–1.5, US-2.1–2.6, US-3.1–3.5, US-4.1–4.4, US-7.1–7.4 |
| P1 — High | 8 | US-5.1–5.4, US-6.1–6.4 |
| P2 — Medium | 0 | — |
| P3 — Low | 0 | — |

> All P0 stories must pass acceptance criteria before v1 is considered shippable. P1 stories are required for production quality and are implemented alongside P0 stories.

---

*Document generated: 2026-06-15 | BrewAI v1.0 UserStories | Derived from: PRD-BrewAI.md, FRD-BrewAI.md, PERSONAS-BrewAI.md*
