---

## F04: Order Placement & Confirmation

**Priority:** P0  
**Depends on:** F00 (Design System), F03 (Cart Management — provides items), F07 (REST API — persists order)  
**Required by:** None (terminal step in the ordering flow)

---

### Description

Order placement is the final step in the core ordering loop. The customer reviews their full cart, clicks "Place Order", and the application submits the order to the Express backend via `POST /api/orders`. Upon a successful response, the cart is cleared and the customer is navigated to an order confirmation screen displaying a human-readable order reference number, an itemized summary, and an estimated ready time of "15–20 minutes". No payment is collected; the confirmation represents intent to pick up. If submission fails, an inline error with a retry option is shown without losing the cart.

---

### Terminology

- **Order Reference:** A human-readable, zero-padded order identifier displayed to the customer, formatted `BRW-NNNNN` (e.g., `BRW-00042`). Derived from the database `orders.id` field.
- **Order Payload:** The JSON body sent to `POST /api/orders` containing the serialized cart items and metadata.
- **Confirmation Screen:** The full-page (or routed) view shown after a successful order submission, replacing the cart view.
- **Estimated Ready Time:** A static string `"15–20 minutes"` displayed on the confirmation screen; not computed dynamically in v1.
- **New Order CTA:** A button on the confirmation screen that clears the cart and navigates back to the menu.

---

### Sub-Features

- **F04.1 — Place Order Button:** "Place Order" button in the cart drawer footer; disabled when cart is empty.
- **F04.2 — Submission Loading State:** Spinner replaces button text during API call; button disabled.
- **F04.3 — API Order Submission:** Serializes cart items into `OrderPayload` and POSTs to `/api/orders`.
- **F04.4 — Success Flow:** Clears cart, navigates to confirmation screen, displays order reference and summary.
- **F04.5 — Error Flow:** Inline error message with retry option; cart preserved.
- **F04.6 — Confirmation Screen:** Displays order reference, itemized list, estimated time, and "New Order" CTA.

---

### Process

1. Customer reviews cart in F03 drawer; clicks "Place Order".
2. System validates cart is non-empty (button is disabled if empty; no API call made).
3. Button enters loading state: spinner shown, button text replaced with "Placing order…", button disabled.
4. System builds `OrderPayload` from current `cartStore.items` (see Payload Shape below).
5. System calls `POST /api/orders` with `OrderPayload` as request body.
6. **On success (HTTP 201):**
   a. `cartStore.clearCart()` — removes all items from Zustand store.
   b. Cart drawer closes.
   c. Router navigates to `/confirmation` (or renders confirmation view inline, replacing cart).
   d. Confirmation screen renders with data from the API response: `order_reference`, itemized summary, timestamp.
7. **On API error (HTTP 4xx / 5xx / network failure):**
   a. Loading state cleared; button re-enabled.
   b. Inline error message rendered below the "Place Order" button.
   c. Cart remains unchanged (items not lost).
   d. "Try Again" button visible — re-invokes step 4 without any other change.
8. Customer views confirmation screen.
9. Customer clicks "New Order":
   a. Navigates to `/` (menu page).
   b. Cart already cleared in step 6a; menu reloads from cache or re-fetches.

---

### Order Payload Shape

```typescript
interface OrderPayload {
  items: OrderLineItem[];
  subtotal: number;              // Total before any fees (no tax in v1)
  notes: string;                 // Optional order-level note (empty string if none)
}

interface OrderLineItem {
  menuItemId: number;
  name: string;                  // Denormalized drink name
  unitPrice: number;
  quantity: number;
  customizations: {
    size: string;
    milk: string | null;
    temperature: string | null;
    shots: string | null;
    addons: string[];
    specialInstructions: string;
  };
}
```

---

### API Response Shape (success)

```typescript
// HTTP 201 Created
{
  data: {
    orderId: number;             // Database primary key
    orderReference: string;      // "BRW-00042" format
    createdAt: string;           // ISO 8601 timestamp
    items: OrderLineItem[];      // Echo of submitted line items
    subtotal: number;
  },
  error: null,
  status: 201
}
```

---

### Confirmation Screen Layout

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓  Order Placed!

  Your order reference:
  BRW-00042

  Ready in approximately 15–20 minutes

  ─────────────────────────────────────
  Order Summary
  ─────────────────────────────────────
  • Large Oat Latte × 2          $12.50
    Large · Oat · Iced
  • Vanilla Cold Brew × 1        $5.75
    Large · Iced · Vanilla Syrup
  ─────────────────────────────────────
  Subtotal                       $18.25

       [ Start a New Order ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- Confirmation icon: Lucide `CheckCircle2` in `text-success` color
- Order reference: Playfair Display, 28px, `text-accent`
- Estimated time: Inter, 14px, `text-muted`
- "Start a New Order" button: `variant="primary"`, full-width on mobile

---

### Inputs

| Field | Type | Source | Constraints |
|-------|------|--------|-------------|
| `items` | `OrderLineItem[]` | `cartStore.items` | Non-empty array; each item validated (see F03) |
| `subtotal` | `number` | `cartStore.subtotal` | > 0 |
| `notes` | `string` | Optional order-level field | Max 500 chars; empty string if not provided |

---

### Outputs

- HTTP `POST /api/orders` request with `OrderPayload`
- On success: `orderId`, `orderReference`, `createdAt` from API response
- Cart cleared (`cartStore.clearCart()`)
- Navigation to confirmation screen
- Confirmation screen rendered with order details

---

### Validation

- "Place Order" button is disabled (not just visually styled) when `cartStore.items.length === 0`.
- `OrderPayload.items` must be non-empty; if somehow empty, client shows an error without calling the API.
- `subtotal` must be > 0; derived from cart so this is guaranteed if items are present.
- `orderReference` format validation (client-side display only): must match `/^BRW-\d{5}$/`; if not matching, display raw `orderId` as fallback.
- On confirmation screen, `orderId` is stored in component state (or URL param `/confirmation?ref=BRW-00042`) for display; no Zustand persistence needed.

---

### Order Reference Format

`orderReference` is constructed server-side:

```
BRW-{zero-padded orderId to 5 digits}
```

Examples: `BRW-00001`, `BRW-00042`, `BRW-10000`.

If `orderId > 99999`, the reference becomes `BRW-{orderId}` without padding (no truncation).

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Behavior |
|----------|-------------|------------|----------------------|
| Network failure (no response) | — | `ORDER_NETWORK_ERROR` | "Could not reach the server. Check your connection and try again." + Retry |
| Server error | 500 | `INTERNAL_ERROR` | "Something went wrong placing your order. Please try again." + Retry |
| Empty cart submitted (defensive) | 400 | `EMPTY_ORDER` | "Your cart is empty." (client prevents this; shown only if guard bypassed) |
| Invalid payload | 400 | `INVALID_PAYLOAD` | "Invalid order data. Please refresh and try again." |
| Duplicate submission (double-click) | 201 (idempotent) or 409 | — | Button disabled during in-flight request; double submission prevented by loading state |

---

### Accessibility

- "Place Order" button: `aria-disabled="true"` when cart is empty (not `disabled` attribute alone, to allow focus for screen readers)
- Loading state: `aria-busy="true"` on the button during submission
- Confirmation screen: focus moves to the confirmation heading on navigation (`autofocus` on the main heading)
- "Start a New Order" button: `aria-label="Start a new order and return to menu"`
- Success icon: `aria-hidden="true"` (decorative); success state announced via `role="status"` live region

---

### API Surface (this feature)

- `POST /api/orders` — submit new order; see `Y1-api.md §POST /api/orders`
- `GET /api/orders/:id` — retrieve order by ID (for future extensibility; displayed on confirmation screen); see `Y1-api.md §GET /api/orders/:id`

---

### Schema Surface (this feature)

- Writes to `orders` table and `order_items` table — see `Y0-schema.md §orders` and `Y0-schema.md §order_items`

---
