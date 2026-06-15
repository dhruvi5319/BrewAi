---

## NaC-to-Acceptance Criteria Mapping

This table verifies that each NaC statement is aligned with (not contradicting) the acceptance criteria written in UserStories-BrewAI.md. The NaC refines the JTBD outcome into a testable scenario; the AC spells out the specific implementation behaviour.

| SM-ID | Story | NaC (Abbreviated) | Key Acceptance Criteria Cross-Check | Alignment |
|---|---|---|---|---|
| SM-0.1 | US-0.1: Design Tokens | Dark canvas visible; amber accent on all CTAs; ≥ 4.5:1 contrast | AC: HTML/body bg = #0A0A0A; CTAs use #C8922A; primary text #F5F0E8 ≥ 4.5:1 contrast | ✓ Aligned |
| SM-0.2 | US-0.2: Bundled Fonts | Fonts render on CDN-blocked network | AC: No Google Fonts CDN request at runtime; @font-face points to /assets/fonts/*.woff2 | ✓ Aligned |
| SM-0.3 | US-0.3: Primitive Components | Button, Modal, Input importable; min-height 44px; strict types | AC: Exported from src/components/ui/index.ts; Button min-height 44px all sizes; no `any` types | ✓ Aligned |
| SM-0.4 | US-0.4: Focus Rings | Keyboard nav from menu to CTA and back without losing focus; amber ring visible | AC: 2px solid #C8922A on focus-visible; all interactive elements keyboard-navigable | ✓ Aligned |
| SM-1.1 | US-1.1: Full Menu Load | Every card has description + price; 8 skeletons while loading; cards animate in | AC: Card shows name, 2-line description, $X.XX price, category badge, CTA; 8 skeleton placeholders; staggered fadeIn + slideUp | ✓ Aligned |
| SM-1.2 | US-1.2: Category Filter | Espresso filter shows only espresso drinks, no reload, within 15s | AC: Filter takes effect immediately (client-side); active pill highlighted accent; no loading state needed | ✓ Aligned |
| SM-1.3 | US-1.3: Keyword Search | "Kenya" filters cards in real time matching name + description | AC: Filters name and description; 200ms debounce; no page reload; AND logic with category filter | ✓ Aligned |
| SM-1.4 | US-1.4: Empty State | Empty state shown with message + "Clear filters" when no results | AC: Descriptive message + "Clear filters" action; clicking resets category to 'All' and search to ''; no skeleton shown | ✓ Aligned |
| SM-1.5 | US-1.5: Load Failure | Error message + "Retry" replaces skeleton on 5xx | AC: Human-readable error + "Retry" button; Retry re-invokes fetchMenu(); no skeleton during error state | ✓ Aligned |
| SM-2.1 | US-2.1: Open Modal | Modal with all controls opens on "Customize" tap; scaleIn + fadeIn 200ms; focus trapped | AC: Modal shows drink name, base price, all applicable controls; scaleIn + fadeIn (200ms); Tab cycles within modal; Escape closes | ✓ Aligned |
| SM-2.2 | US-2.2: Size + Price | Size selection updates total within 100ms; per-item and total both shown | AC: Size radio shows price delta (e.g., "Large +$0.75"); total updates as (base + size delta + addons) × qty; both prices in footer | ✓ Aligned |
| SM-2.3 | US-2.3: Milk/Temp/Shots | Shot count present for espresso, absent for non-espresso; Double default | AC: Shot count selector shown only for drinkType='espresso'; Double is default; fieldset+legend grouping | ✓ Aligned |
| SM-2.4 | US-2.4: Add Extras | Vanilla Syrup toggles price delta inline within 100ms | AC: Each chip shows label + price ("+$0.75"); selecting adds to total, deselecting removes; multiple simultaneous selections | ✓ Aligned |
| SM-2.5 | US-2.5: Special Instructions | Textarea present with 200-char limit + live counter | AC: Textarea with 200-char limit; live counter below; counter turns red at ≤10 chars remaining; included in CartItem | ✓ Aligned |
| SM-2.6 | US-2.6: Add to Cart | "Add to Cart" closes modal, shows toast, increments badge within ordering window | AC: Builds CartItem, dispatches cartStore.addItem(), closes modal with exit animation, shows "[Drink Name] added to cart" toast, badge increments | ✓ Aligned |
| SM-3.1 | US-3.1: View Cart | Line item shows full customization summary; cart state survives navigation | AC: Line item shows "Large · Oat · Iced · Vanilla Syrup"; cart persists across route changes (session-only) | ✓ Aligned |
| SM-3.2 | US-3.2: Adjust Quantity | Stepper updates subtotal immediately; decrement to 0 removes item | AC: Subtotal updates immediately; decrement at qty=1 removes item; badge updates | ✓ Aligned |
| SM-3.3 | US-3.3: Remove Item | "×" removes only that item; badge drops by item quantity; fade + slide-left animation | AC: Immediate removal (no confirmation for single item); fade + slide-left 150ms; badge and subtotal update | ✓ Aligned |
| SM-3.4 | US-3.4: Clear Cart | Confirmation prompt prevents accidental clear; "Cancel" leaves cart unchanged | AC: Confirmation prompt "Remove all items from your cart?" with Cancel / Clear All; Cancel = no change; Clear All = empty state | ✓ Aligned |
| SM-3.5 | US-3.5: Empty Cart State | "Your cart is empty" shown; "Place Order" disabled; "Browse Menu" CTA | AC: Empty state with message + "Browse Menu" link; "Place Order" disabled + aria-disabled="true"; badge hidden | ✓ Aligned |
| SM-4.1 | US-4.1: Place Order | POST /api/orders with spinner; on 201, cart cleared, navigate to confirmation; no auth | AC: Loading state (spinner + disabled); POST /api/orders; on 201, cart cleared, navigate to confirmation screen | ✓ Aligned |
| SM-4.2 | US-4.2: Confirmation Screen | Order ref, itemised summary, ready time all visible at 390px without scroll | AC: BRW-NNNNN in Playfair Display amber; itemised summary; "15–20 minutes"; all visible at 390px without scroll | ✓ Aligned |
| SM-4.3 | US-4.3: Order Error | Failed POST re-enables button; cart preserved; inline error + "Try Again" | AC: Loading state cleared; button re-enabled; inline error with "Try Again"; cart contents fully preserved | ✓ Aligned |
| SM-4.4 | US-4.4: New Order | "Start a New Order" navigates to menu with cart cleared | AC: Full-width button; navigates to /; cart already cleared from successful submission step | ✓ Aligned |
| SM-5.1 | US-5.1: Mobile Header | Below 768px: compact header with logo + cart icon only | AC: <768px shows logo (left) + cart icon (right); no nav links; both breakpoints use same cartStore.totalCount | ✓ Aligned |
| SM-5.2 | US-5.2: Responsive Grid | 1-2-3-4 column breakpoints; no horizontal scroll at any viewport | AC: 1 col <640px, 2 col 640-1023px, 3 col 1024-1535px, 4 col 1536px+; overflow-x hidden | ✓ Aligned |
| SM-5.3 | US-5.3: Full-Screen Cart Mobile | Cart = fixed inset-0 on mobile; modal = bottom-sheet on mobile | AC: <768px cart uses fixed inset-0; modal uses fixed bottom-0 max-h-[90vh] rounded-t-[20px] on mobile | ✓ Aligned |
| SM-5.4 | US-5.4: Touch Targets | All interactive elements ≥ 44×44px on 390px; no accidental mis-taps | AC: All buttons/links/steppers/pills min 44×44px; Button primitive enforces min-height 44px; usability check at 390px | ✓ Aligned |
| SM-6.1 | US-6.1: Card Entrance Animations | Staggered fadeIn + slideUp 200ms/card, 50ms stagger; filter triggers enter/exit | AC: 200ms per card, 50ms stagger; AnimatePresence mode="popLayout" for filter changes; shared cardVariants | ✓ Aligned |
| SM-6.2 | US-6.2: Modal + Drawer Transitions | Modal scaleIn + fadeIn 200ms; drawer slides in 200ms; exit plays before unmount | AC: Modal opens scaleIn+fadeIn (200ms, easeOut); backdrop blur; cart drawer slides right desktop / up mobile (200ms); AnimatePresence wraps both | ✓ Aligned |
| SM-6.3 | US-6.3: Feedback Toasts | Toast slides in bottom-right; auto-dismisses 3s; badge pops 1→1.3→1 | AC: "[Drink Name] added to cart" toast bottom-right; 3s auto-dismiss; max 3 simultaneous; badge scale pop 300ms | ✓ Aligned |
| SM-6.4 | US-6.4: Reduced Motion | All animations disabled when prefers-reduced-motion set; no functional breakage | AC: useReducedMotion() guards all motion components; initial={false}, no exit animations; prefers-reduced-motion CSS media query also respected | ✓ Aligned |
| SM-7.1 | US-7.1: Load Menu Data | GET /api/menu returns all available items with descriptions and options; page interactive <2.5s | AC: JSON envelope { data: MenuItem[], status: 200 }; includes all fields; 20-30 items seeded on cold start | ✓ Aligned |
| SM-7.2 | US-7.2: Persist Order | POST /api/orders returns 201 with BRW-NNNNN; failed transaction fully rolled back | AC: HTTP 201 with orderId, orderReference BRW-NNNNN format; SQLite transaction; rollback on failure with 500 | ✓ Aligned |
| SM-7.3 | US-7.3: Server Auto-Start | `npm start` on cold Debian Docker = schema + seed ready; console output | AC: initDatabase() before requests; seed runs only when COUNT=0; binds 0.0.0.0:3000; outputs `BrewAI server running on http://0.0.0.0:3000` | ✓ Aligned |
| SM-7.4 | US-7.4: API Validation + Errors | Empty items = 400 EMPTY_ORDER; parameterized queries only | AC: Structured error envelope; EMPTY_ORDER, INVALID_PAYLOAD, INVALID_ID codes; no SQL string interpolation | ✓ Aligned |

**Alignment summary:** All 36 NaC statements are fully aligned with their corresponding acceptance criteria. No contradictions found. NaC statements add the JTBD-grounded outcome context ("why it matters") that the AC alone does not capture.

---

## Self-Validation Checklist

- [x] Every UserStory (US-0.1 through US-7.4) appears in the Story Map Matrix — 36/36 stories mapped
- [x] Every mapped story has a NaC derived from a specific JTBD outcome
- [x] NaC Derivation Table has full traceability chains (JTBD-ID → Stage → NaC → Story)
- [x] Release planning groups are defined (R1: 28 stories, R2: 8 stories)
- [x] Coverage analysis identifies no gaps and no orphan stories
- [x] NaC-to-Acceptance Criteria mapping verifies alignment for all 36 stories
- [x] No orphan stories — all 36 stories mapped to a journey stage
- [x] Each release enables at least one complete journey (R1 = all 6 journeys completable)
- [x] All 9 JTBD outcomes addressed in at least one story
- [x] All 3 personas served by R1

---

*Document generated: 2026-06-15 | BrewAI v1.0 STORY-MAP | Derived from: PERSONAS-BrewAI.md + JTBD-BrewAI.md + JOURNEYS-BrewAI.md + UserStories-BrewAI.md + PRD-BrewAI.md*
