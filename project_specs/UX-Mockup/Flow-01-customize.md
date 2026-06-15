---

## Flow-01: Drink Customization

**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5, US-2.6
**Journeys:** JRN-01.1 (stage 4), JRN-01.2 (stage 3), JRN-02.1 (stage 3), JRN-03.2 (stages 1–4)
**Entry:** User clicks "Customize" on a product card
**Exit:** "Add to Cart" clicked → item in cart, modal closed, toast shown | Escape/backdrop/× clicked → modal closed, no cart change

```
[User clicks "Customize" on card]
         │
         ▼
[Modal opens: scaleIn + fadeIn, 200ms]
[Focus traps inside modal]
         │
         ▼
[Load item options]
    ├── From Zustand cache (instant)
    └── GET /api/menu/:id (if not cached)
              │
         ┌────┴────┐
       Success   Failure
         │           │
         ▼           ▼
   [Render        [Skeleton loaders
    controls]      for option sections]
                  [Retry] + "Add to Cart" disabled
         │
    Default selections applied:
    • Size: Medium (or first available)
    • Shots: Double (espresso only)
    • Qty: 1, no addons, no instructions
         │
         ├── User changes Size
         │       └── price recalculates (<100ms)
         │
         ├── User changes Milk
         │       └── (no price change in v1)
         │
         ├── User changes Temperature
         │       └── (no price change in v1)
         │
         ├── User changes Shot Count
         │       └── espresso only; (no price change)
         │
         ├── User toggles Add-on chip
         │       └── price recalculates (<100ms)
         │
         ├── User types Special Instructions
         │       └── character counter updates live
         │           ≤10 remaining → counter turns #E57373
         │
         ├── User adjusts Quantity stepper
         │       └── total = per-item × qty recalculates
         │
         ▼
[User clicks "Add to Cart"]
         │
    Validate size selected (always true by default)
         │
         ▼
    cartStore.addItem(CartItem)
    Modal closes: reverse scaleOut + fadeOut (150ms)
    Focus returns to triggering "Customize" button
    Toast: "[Drink Name] added to cart" (bottom-right)
    Cart badge pops: scale [1→1.3→1] over 300ms

[Alternative exits]
    Escape keydown  ──┐
    Backdrop click  ──┤──▶ Modal closes (150ms exit animation)
    × close button  ──┘    Focus returns to trigger, no cart change
```

### Steps Detail

**Step 1 — Modal Open**
- Backdrop: `bg-#0A0A0A/80 backdrop-blur-sm`, fades in 150ms
- Modal container: `bg-#1C1C1C`, `border-radius: 12px`
- Desktop: centered dialog, `max-width: 600px`
- Mobile: bottom sheet, `fixed bottom-0 left-0 right-0 max-height: 90vh rounded-t-[20px]`
- Animation: `scale(0.95) → scale(1)` + `opacity: 0 → 1`, 200ms easeOut

**Step 2 — Modal Header**
- Drink name: Playfair Display, 20px, `#F5F0E8`
- Base price: Inter, 16px, `#C8922A`
- "×" close button: top-right, 44×44px tap target, `aria-label="Close customization dialog"`

**Step 3 — Size Selector**
- Radio-style pill group (fieldset + legend)
- Each pill: label + price delta (`"Small −$0.50"`, `"Medium $0.00"`, `"Large +$0.75"`)
- Selected pill: `border-#C8922A, box-shadow: 0 0 0 1px rgba(200,146,42,0.25)`
- Default: Medium (or first option)

**Step 4 — Milk Selector**
- Radio-style pill group (fieldset + legend)
- Options from `item.options.milks` — if empty array, section is hidden entirely
- No price impact in v1

**Step 5 — Temperature Selector**
- Radio-style pill group (fieldset + legend)
- Options from `item.options.temperatures`
- If only one temperature: shown as static read-only label (not a selector)
- No price impact in v1

**Step 6 — Shot Count Selector**
- Radio-style pill group (fieldset + legend)
- Shown ONLY when `drink_type === 'espresso'`
- Options: Single, Double, Triple
- Default: Double
- No price impact in v1

**Step 7 — Add-ons / Extras**
- Multi-select chip group (checkboxes styled as toggle chips)
- Each chip: `"[Label] +$X.XX"`
- Selected chip: amber border + shadow (active/selected style)
- Section hidden if `item.options.extras` is empty array
- Price recalculates on each toggle

**Step 8 — Special Instructions**
- Textarea, `border-radius: 6px`, `bg-#1C1C1C`
- Placeholder: "Any special requests? (e.g. no foam, extra hot)"
- Character counter: `"N/200"` below textarea, 11px, `#9A9080`
- When ≤10 remaining: counter color → `#E57373`
- Input blocked at 200 chars
- Not shown in cart summary string (barista communication only)

**Step 9 — Quantity Stepper**
- [−] [count] [+] layout
- Range: 1–10; default 1
- [−] disabled at qty=1; [+] disabled at qty=10
- Both buttons: 44×44px min tap target
- `aria-label="Decrease quantity"` / `aria-label="Increase quantity"`

**Step 10 — Modal Footer (Price + Add to Cart)**
- Per-item price: `$X.XX`, 16px, `#C8922A`
- Total price: `$X.XX × qty = $X.XX`, 16px, `#F5F0E8`
- "Add to Cart" button: `variant="primary"`, full-width in modal footer
- Never disabled by default selections (size always pre-selected)

---
