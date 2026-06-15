---

## F03: Cart Management

**Priority:** P0  
**Depends on:** F00 (Design System), F02 (Drink Customization — produces cart items)  
**Required by:** F04 (Order Placement — consumes cart state)

---

### Description

The cart is a persistent in-session store (Zustand) that accumulates the items a customer has customized and intends to order. It is accessible from any page via the cart icon in the navigation bar. The cart drawer (slide-over panel on desktop, full-screen on mobile) lists all items with their customization summaries, allows quantity adjustments and item removal, displays the running subtotal, and provides the "Place Order" action that leads to F04.

---

### Terminology

- **Cart Item:** A single entry in the cart representing one menu item with a specific set of customizations. A customer can add the same drink twice with different customizations — each is a distinct `CartItem` with a unique `cartItemId`.
- **Cart Item ID:** A client-generated UUID (`crypto.randomUUID()`) assigned when an item is added to the cart; used to target updates and removals.
- **Customization Summary:** A compact human-readable string summarizing the selected options, displayed under the drink name in the cart (e.g., "Large · Oat · Iced · Vanilla Syrup").
- **Subtotal:** Sum of `(unit_price × quantity)` for all cart items. No tax, service fee, or tip in v1.
- **Clear Cart:** Removes all items from the cart simultaneously; requires a confirmation prompt before executing.
- **Empty Cart State:** The view shown when the cart has no items; includes a CTA linking back to the menu page.

---

### Sub-Features

- **F03.1 — Cart Icon Badge:** Navigation bar icon (Lucide `ShoppingCart`) with an animated count badge showing total item count (sum of all quantities).
- **F03.2 — Cart Drawer:** A slide-in panel opened by clicking the cart icon; lists all cart items.
- **F03.3 — Cart Line Item:** Each item row showing drink name, customization summary, unit price, quantity stepper, and remove button.
- **F03.4 — Quantity Stepper (in-cart):** Increment/decrement for each line item. Decrementing to 0 removes the item.
- **F03.5 — Remove Item:** An explicit "×" or trash icon button per line item that removes it regardless of quantity.
- **F03.6 — Subtotal Display:** Live-calculated subtotal in the cart footer, formatted `$XX.XX`.
- **F03.7 — Clear Cart:** A "Clear Cart" text button that triggers a confirmation modal/prompt before removing all items.
- **F03.8 — Empty Cart State:** Shown when cart has no items; includes "Browse Menu" link.
- **F03.9 — Place Order CTA:** "Place Order" button in the cart footer; disabled when cart is empty; triggers F04.

---

### Process

**Adding an Item (from F02 or direct "Add to Cart"):**
1. F02 dispatches `cartStore.addItem(cartItem)` with a fully formed `CartItem` object.
2. Zustand store appends the item to `items[]` array (or merges if identical customizations — see Merge Rule below).
3. Cart badge count updates with a pop animation (see F06 §Cart Badge Animation).
4. Toast notification slides in: "[Drink Name] added to cart" (3-second auto-dismiss).

**Cart Merge Rule:** Two items are considered identical and merged if they share the same `menuItemId`, `size`, `milk`, `temperature`, `shots`, `addons` (same set, order-insensitive), and `specialInstructions`. If identical, the existing item's `quantity` is incremented by the new item's `quantity` (capped at 10). If not identical, a new `CartItem` entry is added.

**Viewing the Cart:**
1. User clicks cart icon in navigation bar.
2. Cart drawer animates in (slide from right on desktop, slide up on mobile; see F06).
3. Drawer renders all `CartItem` entries; if empty, renders empty state.
4. Cart overlay (`bg-canvas/50`) dims the main content behind the drawer.
5. User can close drawer by clicking the "×" button, pressing Escape, or clicking the overlay.

**Adjusting Quantity:**
1. User clicks "+" → `cartStore.updateQuantity(cartItemId, currentQty + 1)`.
2. Validated to max 10; button disabled at 10.
3. User clicks "−" → if `currentQty > 1`, decrement; if `currentQty === 1`, call `cartStore.removeItem(cartItemId)`.

**Removing an Item:**
1. User clicks "×" / trash button on a line item.
2. `cartStore.removeItem(cartItemId)` called immediately (no confirmation for single item).
3. Item animates out of the list (fade + slide; see F06).
4. If cart becomes empty, empty state is shown.

**Clearing the Cart:**
1. User clicks "Clear Cart".
2. Confirmation prompt: "Remove all items from your cart?" with "Cancel" and "Clear All" buttons.
3. On "Clear All" → `cartStore.clearCart()` → all items removed; empty state shown.
4. On "Cancel" → prompt dismissed; no change.

**Subtotal Calculation:**
- Recalculates on every store mutation.
- Formula: `subtotal = items.reduce((sum, item) => sum + item.unitPrice × item.quantity, 0)`.
- Displayed as `$XX.XX` (always 2 decimal places, USD).

---

### Inputs

| Action | Input | Constraints |
|--------|-------|-------------|
| Add Item | `CartItem` object from F02 | All fields required; see CartItem shape below |
| Update Quantity | `cartItemId` (UUID), `quantity` (integer) | 1–10 |
| Remove Item | `cartItemId` (UUID) | Must exist in cart |
| Clear Cart | User confirmation | No data input beyond confirmation |

---

### Outputs

- Updated `items[]` array in Zustand `cartStore`
- Updated `totalCount` (sum of all quantities)
- Updated `subtotal` (derived from items)
- Cart badge count reflected in navigation
- Toast notification on item added

---

### State Shape (Zustand `cartStore`)

```typescript
interface CartItem {
  cartItemId: string;          // crypto.randomUUID()
  menuItemId: number;          // References menu_items.id
  name: string;                // Drink name (denormalized for display)
  unitPrice: number;           // Price per unit including size delta + addons
  quantity: number;            // 1–10
  customizations: {
    size: string;
    milk: string | null;
    temperature: string | null;
    shots: string | null;
    addons: string[];          // Array of add-on labels
    specialInstructions: string;
  };
}

interface CartStore {
  items: CartItem[];
  totalCount: number;          // Derived: sum of item.quantity
  subtotal: number;            // Derived: sum of item.unitPrice × item.quantity
  isOpen: boolean;             // Whether cart drawer is visible
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}
```

---

### Customization Summary Format

The summary string is derived from selected customizations:

```
[Size] · [Milk] · [Temperature] · [Shots] · [Addon1], [Addon2]
```

Rules:
- Fields with `null` or empty value are omitted from the summary string.
- Add-ons are joined with `, ` (comma-space).
- Special instructions are not shown in the summary string (full display in a tooltip or expanded view is out of scope for v1).
- Example: `"Large · Oat · Iced · Vanilla Syrup, Caramel"`

---

### Validation

- `quantity` is always an integer in [1, 10]; the stepper enforces this; the Zustand action clamps if called programmatically.
- `cartItemId` must be a valid UUID string; items with missing/undefined `cartItemId` are rejected with a console error.
- `unitPrice` must be a positive number > 0.
- `subtotal` must be ≥ 0 at all times (enforced by derivation — items array can only contain positive-price items).
- Cart state is NOT persisted to `localStorage` or `sessionStorage` in v1; it is lost on page refresh. This is a known, accepted constraint.
- "Place Order" button in the cart footer is disabled (and visually muted) when `items.length === 0`.

---

### Error States

| Scenario | Behavior | User-Facing Message |
|----------|----------|---------------------|
| `addItem` called with invalid/incomplete `CartItem` | Item rejected; console error logged | Toast: "Could not add item. Please try again." |
| `updateQuantity` called with out-of-range value | Value clamped to [1, 10]; no error shown | (silent correction) |
| `removeItem` called with unknown `cartItemId` | No-op; console warning logged | (no user-facing message) |
| Cart is empty on "Place Order" click | Button is disabled; click has no effect | Button appears greyed out (no message needed — visual affordance) |

---

### Accessibility

- Cart icon button: `aria-label="Open cart, N items"` where N is `totalCount`
- Cart drawer: `role="dialog"`, `aria-modal="true"`, `aria-label="Your cart"`
- Quantity stepper buttons: `aria-label="Increase quantity for [Drink Name]"` / `aria-label="Decrease quantity for [Drink Name]"`
- Remove button: `aria-label="Remove [Drink Name] from cart"`
- "Clear Cart" button: `aria-label="Clear all items from cart"`
- Focus management: when drawer opens, focus moves to the first interactive element; when it closes, focus returns to the cart icon

---

### API Surface (this feature)

None — cart is client-side only. Order submission is handled by F04.

---

### Schema Surface (this feature)

None — cart state is in-memory (Zustand). Order persistence is handled by F04/F07.

---
