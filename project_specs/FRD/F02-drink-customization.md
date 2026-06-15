---

## F02: Drink Customization Modal

**Priority:** P0  
**Depends on:** F00 (Design System), F01 (Menu Browsing — provides item data)  
**Required by:** F03 (Cart Management — receives customized cart items)

---

### Description

When a customer taps "Customize" on a menu item card, a modal dialog opens presenting all customization controls relevant to that specific drink type. Options (size, milk, temperature, shot count, extras) are driven by the item's `customization_options` data from SQLite — so drinks that don't support espresso shots won't show the shot selector. The customer selects their preferences, sees the price update in real time, sets a quantity, and clicks "Add to Cart". The modal is fully keyboard-accessible, closes on Escape or backdrop click, and animates in/out with Framer Motion.

---

### Terminology

- **Size Delta:** The price adjustment (positive or negative, relative to base price) associated with a particular size selection. Example: Small = −$0.50, Medium = $0.00, Large = +$0.75.
- **Add-on:** An optional extra item the customer can select on top of their drink (e.g., vanilla syrup, whipped cream). Each add-on has a fixed price increment.
- **Multi-select:** The add-ons control allows zero or more selections simultaneously (checkboxes or toggle chips).
- **Special Instructions:** A free-text textarea for any additional requests (e.g., "extra hot", "no foam"). Max 200 characters.
- **Real-time Price:** The running total displayed in the modal that updates immediately as any option changes: `(base_price + size_delta + sum(add-on prices)) × quantity`.
- **Quantity Stepper:** A paired decrement/increment control that adjusts item quantity from 1 to 10.
- **hasCustomizations flag:** A boolean on the `menu_items` table. `true` if the item has at least one customizable dimension beyond quantity alone.

---

### Sub-Features

- **F02.1 — Modal Open/Close:** Modal opens when "Customize" is clicked on a product card; closes on Escape, backdrop click, or the explicit "×" close button.
- **F02.2 — Size Selection:** Radio-style selector for Small / Medium / Large with price delta shown alongside each option.
- **F02.3 — Milk Type Selection:** Radio-style selector for milk options applicable to this drink (Whole, Oat, Almond, Coconut, Skim, None).
- **F02.4 — Temperature Selection:** Radio-style selector for Hot / Iced / Blended where the drink supports it.
- **F02.5 — Shot Count Selection:** Radio-style selector for Single / Double / Triple, shown only for espresso-based drinks (`drink_type = 'espresso'`).
- **F02.6 — Add-ons / Extras:** Multi-select chip/checkbox group for optional add-ons. Each chip shows the add-on name and price.
- **F02.7 — Special Instructions:** Textarea with 200-character limit and live character counter.
- **F02.8 — Real-time Price Display:** Dynamic total that recalculates on every option change.
- **F02.9 — Quantity Stepper:** Increment/decrement control (1–10) with ARIA labels.
- **F02.10 — Add to Cart Action:** Validates all required selections, adds item to Zustand cart store, closes modal, shows toast.

---

### Process

1. User clicks "Customize" on a product card in F01.
2. `selectedItem` is set in component state (or passed as prop); modal `isOpen` becomes `true`.
3. Modal animates in (`scaleIn` + `fadeIn`; see F06).
4. Modal fetches item customization options from `GET /api/menu/:id` (or uses cached data from Zustand `menuStore` if already loaded).
5. Default selections are applied: smallest size (or "Medium" if available), first milk option, first temperature, "Double" shots for espresso, no add-ons, no special instructions, quantity = 1.
6. Real-time price initializes to `base_price + default_size_delta`.
7. User selects a size → `selectedSize` updates → real-time price recalculates.
8. User selects a milk type → `selectedMilk` updates (no price impact in v1).
9. User selects a temperature → `selectedTemperature` updates (no price impact in v1).
10. User selects shot count (espresso drinks only) → `selectedShots` updates (no price impact in v1).
11. User toggles an add-on chip → add-on added to or removed from `selectedAddons[]` → price recalculates.
12. User types in special instructions → `specialInstructions` updates with character count displayed.
13. User adjusts quantity stepper → `quantity` updates (range 1–10) → price recalculates.
14. User clicks "Add to Cart":
    a. Validate all required selections present (size is required; all others optional per item config).
    b. Build `CartItem` object (see F03 §State Shape).
    c. Dispatch `cartStore.addItem(cartItem)`.
    d. Modal closes with exit animation.
    e. Toast notification: "Item added to cart" (see F06 §Toast Animation).
15. User presses Escape or clicks backdrop → modal closes with exit animation; no cart change.
16. User clicks "×" close button → same as Escape.

---

### Inputs

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `selectedSize` | `string` | Yes | One of the sizes defined in `item.options.sizes` |
| `selectedMilk` | `string` | No | One of `['Whole', 'Oat', 'Almond', 'Coconut', 'Skim', 'None']` per item config |
| `selectedTemperature` | `string` | No | One of `['Hot', 'Iced', 'Blended']` per item config |
| `selectedShots` | `string` | No | One of `['Single', 'Double', 'Triple']`; only for `drink_type = 'espresso'` |
| `selectedAddons` | `string[]` | No | Subset of item's `extras` list; default `[]` |
| `specialInstructions` | `string` | No | Max 200 characters; default `''` |
| `quantity` | `integer` | Yes | Range 1–10; default `1` |

---

### Outputs

- A `CartItem` object added to Zustand `cartStore` (see F03 §State Shape)
- Modal closed with exit animation
- Toast: "Item added to cart" with item name

---

### Real-time Price Formula

```
displayPrice = (base_price + size_delta) + sum(selected_addons[i].price)
totalPrice   = displayPrice × quantity
```

Both `displayPrice` (per-item) and `totalPrice` (quantity × per-item) are shown in the modal footer.

---

### Customization Options Data Shape (from API)

```typescript
interface ItemOptions {
  sizes: { label: string; delta: number }[];       // e.g., [{label:'Small', delta:-0.50}, ...]
  milks: string[];                                  // e.g., ['Whole','Oat','Almond','Coconut','Skim','None']
  temperatures: string[];                           // e.g., ['Hot','Iced','Blended']
  shots: string[] | null;                           // null if not espresso-based
  extras: { label: string; price: number }[];       // e.g., [{label:'Vanilla Syrup', price:0.75}]
}
```

This data is embedded in the `GET /api/menu/:id` response inside the `options` field, stored as JSON in `menu_items.options_json`.

---

### Validation

- `selectedSize` must be one of the item's defined sizes; "Add to Cart" button is disabled until a size is selected (size defaults to the first option so the button is never blocked by this in practice).
- `quantity` must be an integer in the range [1, 10]; the stepper prevents values outside this range.
- `specialInstructions` length must not exceed 200 characters; the textarea blocks additional input at the limit and shows a counter in red when ≤ 10 characters remain.
- At least one option must differ from defaults for the modal to show a meaningful customization — but no validation blocks "Add to Cart" on this; it is purely informational.
- If `item.options.shots` is `null`, the shot selector section is not rendered.
- If `item.options.milks` is an empty array, the milk selector section is not rendered.
- If `item.options.temperatures` has only one value, it is shown as a static read-only label, not a selector.
- Add-on selection is always multi-select; selecting an already-selected add-on deselects it.

---

### Error States

| Scenario | Behavior | User-Facing Message |
|----------|----------|---------------------|
| `GET /api/menu/:id` fails to load options | Modal shows with skeleton loaders for option sections; "Add to Cart" button disabled | "Could not load customization options. Please try again." with Retry button |
| `cartStore.addItem` throws (quota/storage error) | Toast error | "Could not add item to cart. Please try again." |
| User enters >200 chars in special instructions | Input capped; counter turns red | "200 characters maximum" |
| Modal opened with undefined item | Modal does not open; console error logged | (no user-facing message — defensive guard) |

---

### Accessibility

- Modal uses `role="dialog"` and `aria-modal="true"`
- Modal title bound to `aria-labelledby`
- Focus is trapped inside the modal while open (Tab cycles through interactive elements)
- Focus returns to the triggering "Customize" button when modal closes
- Quantity stepper buttons have `aria-label="Increase quantity"` / `aria-label="Decrease quantity"`
- Close button has `aria-label="Close customization dialog"`
- All radio-style selectors use `<fieldset>` + `<legend>` grouping

---

### API Surface (this feature)

- `GET /api/menu/:id` — fetch single item with full options; see `Y1-api.md §GET /api/menu/:id`

---

### Schema Surface (this feature)

- Reads `menu_items.options_json` — see `Y0-schema.md §menu_items`

---
