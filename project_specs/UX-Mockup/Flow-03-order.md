---

## Flow-03: Order Placement & Confirmation

**User Stories:** US-4.1, US-4.2, US-4.3, US-4.4
**Journeys:** JRN-01.1 (stage 5), JRN-02.1 (stages 4–5), JRN-03.2 (stage 5)
**Entry:** User clicks "Place Order" in cart drawer footer
**Exit:** "Start a New Order" → `/` (menu page, cart already cleared)

```
[User clicks "Place Order"]
         │
    Guard: cart non-empty?
    ├── NO  → button is disabled; no action
    └── YES → continue
         │
         ▼
[Button enters loading state]
  Text: "Placing order…"
  Spinner shown, button disabled
  Prevents double-submission
         │
         ▼
[POST /api/orders with OrderPayload]
         │
    ┌────┴────┐
  HTTP 201  Error (4xx/5xx/network)
    │              │
    ▼              ▼
[Success flow]  [Error state]
cartStore       Loading state cleared
.clearCart()    Button re-enabled
Cart drawer     Inline error message
closes          below "Place Order"
Router → /      "[Error message]"
confirmation    [Try Again] button
                Cart preserved intact
    │
    ▼
[Confirmation Screen renders]
Focus moves to main heading (autofocus)
role="status" live region announces success
    │
    ▼
User reads:
  ✓ Order Placed!
  BRW-NNNNN
  Ready in 15–20 minutes
  [Itemized summary]
  Subtotal: $XX.XX
    │
    ▼
User clicks [Start a New Order]
    │
    ▼
Navigate to / (menu page)
Cart already empty from step above
Menu loads from cache or re-fetches
```

### Steps Detail

**Step 1 — "Place Order" Button States**

| State | Appearance | Behavior |
|-------|-----------|----------|
| Disabled (empty cart) | `opacity-40`, muted, `aria-disabled="true"` | Click has no effect |
| Enabled | `bg-#C8922A text-#0A0A0A`, full-width | Click submits order |
| Loading | Spinner + "Placing order…", `disabled` | No further clicks accepted |
| Error recovery | Re-enabled, error message visible below | [Try Again] re-submits same payload |

**Step 2 — Error Messages**

| Scenario | Message |
|----------|---------|
| Network failure | "Could not reach the server. Check your connection and try again." |
| Server error (5xx) | "Something went wrong placing your order. Please try again." |
| Empty cart (defensive) | "Your cart is empty." |
| Invalid payload | "Invalid order data. Please refresh and try again." |

- Error displayed inline, below "Place Order" button
- `text-#E57373`, Inter, 13px
- [Try Again] button re-submits without requiring user changes
- Cart contents fully preserved on any error

**Step 3 — Confirmation Screen Layout**

```
┌─────────────────────────────────────────────┐
│           ✓  Order Placed!                  │ ← CheckCircle2 icon (#4CAF50)
│                                             │   Playfair Display, 40px
│         Your order reference:               │ ← Inter, 13px, #9A9080
│           BRW-00042                         │ ← Playfair Display, 28px, #C8922A
│                                             │
│    Ready in approximately 15–20 minutes     │ ← Inter, 14px, #9A9080
│─────────────────────────────────────────────│
│  Order Summary                              │ ← Inter, 16px semibold, #F5F0E8
│─────────────────────────────────────────────│
│  • Large Oat Latte × 2          $12.50      │
│    Large · Oat · Iced                       │
│                                             │
│  • Vanilla Cold Brew × 1        $5.75       │
│    Large · Iced · Vanilla Syrup             │
│─────────────────────────────────────────────│
│  Subtotal                       $18.25      │ ← 16px semibold
│                                             │
│       [ Start a New Order ]                 │ ← primary button, full-width on mobile
└─────────────────────────────────────────────┘
```

**Step 4 — Confirmation Screen Accessibility**
- Main heading receives `autofocus` on navigation (screen reader announces success)
- `role="status"` live region wraps confirmation message for screen reader announcement
- Success icon: `aria-hidden="true"` (decorative)
- "Start a New Order": `aria-label="Start a new order and return to menu"`

**Step 5 — Above-Fold Requirement (390px mobile)**
- Order reference number, estimated ready time, and success heading must be visible without scrolling at 390px viewport
- Font sizes calibrated: order reference at 28px Playfair Display is large enough to read at arm's length
- Itemized summary scrollable below the fold if many items; critical info (ref + ready time) always above

**Step 6 — "Start a New Order" Action**
- `variant="primary"`, full-width on mobile, auto-width centered on desktop
- Navigates to `/`
- Cart already cleared from successful submission (step above)
- Menu loads from Zustand cache if available; re-fetches if stale (skeleton shown briefly)

---
