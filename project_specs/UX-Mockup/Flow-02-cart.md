---

## Flow-02: Cart Management

**User Stories:** US-3.1, US-3.2, US-3.3, US-3.4, US-3.5
**Journeys:** JRN-01.1 (stage 5), JRN-02.1 (stage 4), JRN-02.2 (all stages), JRN-03.2 (stage 4)
**Entry:** User taps cart icon in navigation bar
**Exit:** "Place Order" → Flow-03 | Drawer closed (Escape/×/overlay click) → back to menu

```
[User taps cart icon in nav]
         │
         ▼
[Cart drawer animates in]
  Desktop: slides in from right, 200ms easeOut
  Mobile: slides up from bottom, 200ms easeOut
  Backdrop overlay dims main content
         │
    ┌────┴────┐
  Empty     Has Items
    │           │
    ▼           ▼
[Empty State]  [Line Item List]
"Your cart     Each item:
 is empty"     • Drink name
[Browse Menu]  • Customization summary
               • Unit price
               • Quantity stepper
               • Remove (×) button
               │
               ├── User taps [+] on line item
               │       quantity + 1 (max 10)
               │       subtotal updates immediately
               │
               ├── User taps [−] on line item
               │       ├── qty > 1: decrement
               │       └── qty = 1: remove item
               │               └── fade+slide exit 150ms
               │
               ├── User taps [×] on line item
               │       remove immediately (no confirm)
               │       item animates out: fade+slide-left 150ms
               │       if last item → Empty State shown
               │
               ├── User taps [Clear Cart]
               │       ▼
               │   [Confirmation prompt]
               │   "Remove all items from your cart?"
               │   [Cancel]     [Clear All]
               │      │              │
               │   dismiss        cartStore.clearCart()
               │   (no change)   → Empty State shown
               │
               ▼
         [Cart Footer]
         Subtotal: $XX.XX
         [Place Order] ── enabled only if items > 0
                │
                └──▶ Flow-03 (Order Placement)
```

### Steps Detail

**Step 1 — Cart Drawer Open**
- Desktop (`md+`): slide-over panel, `fixed right-0 top-0 bottom-0 width: 400px`
- Mobile (`< md`): full-screen, `fixed inset-0`
- Backdrop: `bg-#0A0A0A/50`, clicks backdrop to close
- Visible "×" close button: top-right corner, 44×44px
- `role="dialog"`, `aria-modal="true"`, `aria-label="Your cart"`
- Focus moves to first interactive element on open
- `AnimatePresence` wraps drawer for exit animation

**Step 2 — Cart Header**
- "Your Cart" heading: Inter, 16px semibold, `#F5F0E8`
- Total item count: `(N items)`, Inter 13px, `#9A9080`
- [Clear Cart] button: positioned in header, NOT near "Place Order"
  - `variant="ghost"`, `text-#E57373`, `aria-label="Clear all items from cart"`

**Step 3 — Line Item Row**
```
┌────────────────────────────────────────────┐
│ Drink Name                      $X.XX  [×] │
│ Large · Oat · Iced · Vanilla Syrup          │
│           [−]  [2]  [+]                     │
└────────────────────────────────────────────┘
```
- Drink name: Inter, 14px semibold, `#F5F0E8`
- Customization summary: Inter, 13px, `#9A9080` (full text, no truncation)
- Unit price: Inter, 14px, `#C8922A`
- Remove "×": `aria-label="Remove [Drink Name] from cart"`, 44×44px
- Quantity stepper:
  - `aria-label="Increase quantity for [Drink Name]"` / `"Decrease quantity for [Drink Name]"`
  - [−] disabled at qty=1 (decrement removes item)
  - [+] disabled at qty=10

**Step 4 — Subtotal Footer**
- Divider: `border-top: 1px solid #2A2A2A`
- "Subtotal": Inter, 13px, `#9A9080`
- Amount: Inter, 20px semibold, `#F5F0E8`, formatted `$XX.XX`
- "Place Order" button: `variant="primary"`, full-width
  - Disabled (`aria-disabled="true"`, greyed) when cart empty
  - Enabled only when `items.length > 0`

**Step 5 — Empty Cart State**
```
┌────────────────────────────────────────────┐
│                                            │
│         [ShoppingCart icon, muted]         │
│                                            │
│           Your cart is empty               │  ← 16px, #9A9080
│                                            │
│           [Browse Menu]                    │  ← primary button
│                                            │
└────────────────────────────────────────────┘
```
- Cart badge: hidden (or shows 0, badge hidden) when empty
- "Browse Menu": closes drawer, navigates to `/`
- "Place Order" in footer: `aria-disabled="true"`, visually muted

**Step 6 — Clear Cart Confirmation**
- Confirmation uses inline prompt within drawer (not a full modal)
- Prompt appears below [Clear Cart] button
- "Remove all items from your cart?"
- [Cancel] `variant="ghost"` | [Clear All] `variant="danger"`
- [Cancel] dismisses prompt, no change
- [Clear All] calls `cartStore.clearCart()`, prompt closes, empty state shown

---
