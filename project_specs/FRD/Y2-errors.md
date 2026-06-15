---

## Cross-Feature Error Catalog

**File:** `Y2-errors.md`  
**Scope:** All BrewAI v1 features (F00–F07)

---

### Overview

This catalog lists every named error code used across the application. Error codes are:
- **SCREAMING_SNAKE_CASE** strings
- Returned in the API envelope as `error.code` for server-side errors
- Used as internal identifiers for client-side error states
- Never exposed as raw exception messages; all user-facing messages are explicitly defined below

---

### API Error Codes (Server-Side)

These are returned in `{ error: { code, message, field? }, status }` from Express endpoints.

| Code | HTTP Status | Endpoint(s) | Description | User-Facing Message |
|------|-------------|-------------|-------------|---------------------|
| `INVALID_ID` | 400 | `GET /api/menu/:id`, `GET /api/orders/:id` | Route parameter `id` is not a positive integer | "Invalid request. Please try again." |
| `ITEM_NOT_FOUND` | 404 | `GET /api/menu/:id` | No menu item exists with given ID, or item is unavailable | "This item is no longer available." |
| `EMPTY_ORDER` | 400 | `POST /api/orders` | `items` array is empty or missing | "Your order is empty." |
| `INVALID_PAYLOAD` | 400 | `POST /api/orders` | One or more required fields are missing or fail validation | "Invalid order data: {field}" |
| `ORDER_NOT_FOUND` | 404 | `GET /api/orders/:id` | No order exists with given ID | "Order not found." |
| `DB_READ_ERROR` | 500 | `GET /api/menu`, `GET /api/menu/:id`, `GET /api/orders/:id` | SQLite read failed (e.g., locked, corrupt) | "Could not retrieve data. Please try again." |
| `DB_WRITE_ERROR` | 500 | `POST /api/orders` | SQLite write failed; transaction rolled back | "Could not save your order. Please try again." |
| `NOT_FOUND` | 404 | All unmatched routes | No route matched the request path | "Endpoint not found." |
| `INTERNAL_ERROR` | 500 | Any endpoint (catch-all) | Unexpected server error caught by global error middleware | "Something went wrong. Please try again." |

---

### Client-Side Error States

These error states are handled entirely in the frontend and do not involve API error codes.

| Error ID | Feature | Trigger | User-Facing Message | Recovery Action |
|----------|---------|---------|---------------------|-----------------|
| `MENU_FETCH_FAILED` | F01 | `GET /api/menu` network failure or 5xx | "Could not load the menu. Please check your connection." | "Retry" button re-fetches menu |
| `ITEM_OPTIONS_LOAD_FAILED` | F02 | `GET /api/menu/:id` failure in customization modal | "Could not load customization options. Please try again." | "Retry" button in modal |
| `CART_ADD_FAILED` | F02, F03 | `cartStore.addItem()` throws unexpectedly | "Could not add item to cart. Please try again." | Toast auto-dismisses; user can retry manually |
| `CART_EMPTY_SUBMIT` | F04 | "Place Order" clicked with empty cart (defensive) | (Button is disabled — message not shown) | N/A — button disabled |
| `ORDER_SUBMIT_NETWORK` | F04 | `POST /api/orders` network failure | "Could not reach the server. Check your connection and try again." | "Try Again" button re-submits |
| `ORDER_SUBMIT_FAILED` | F04 | `POST /api/orders` returns 4xx or 5xx | "Something went wrong placing your order. Please try again." | "Try Again" button re-submits |
| `CHAR_LIMIT_EXCEEDED` | F02 | User types beyond 200-char special instructions limit | "200 characters maximum" (inline below textarea) | Input is blocked at limit |
| `INVALID_QUANTITY` | F02, F03 | Quantity stepper reaches limit boundary | (Stepper button is disabled — no message needed) | Button visually disabled |

---

### Error Display Patterns

| Pattern | When Used | Example |
|---------|-----------|---------|
| **Full-page error state** | Menu fetch failure on initial load | Error illustration + message + "Retry" button replaces the card grid |
| **Inline error** | Order submission failure in cart | Error message shown directly below the "Place Order" button |
| **Toast** | Transient add-to-cart errors | Slides in from bottom-right; auto-dismisses in 3 seconds |
| **Disabled button** | Empty cart, quantity at limit | Visual affordance only; no error message needed |
| **Inline field error** | Textarea character limit | Red counter text appears beneath the textarea |
| **Modal error state** | Options load failure in customization modal | Skeleton loaders remain; error message + Retry shown inside modal |

---

### Error Logging

- All server-side errors caught by global error middleware are logged to `console.error` with the full stack trace.
- Client-side fetch errors are logged to `console.error` with the error object.
- No external error reporting service is integrated in v1 (Sentry, Datadog, etc. deferred).

---

### Non-Error Behavior (Zero States)

These are not errors — they are expected empty-data conditions:

| Condition | Feature | Display |
|-----------|---------|---------|
| Menu items filtered to zero results | F01 | Empty state: "No drinks match your search" + "Clear filters" link |
| Fresh database (no menu items) | F01 | Empty state: "No drinks available yet" (should not occur after seed) |
| Cart is empty | F03 | Empty cart state: "Your cart is empty" + "Browse Menu" link |
| Order history retrieval returns 404 | F04 | Redirect to menu page with a toast: "Order not found" |

---
