# UX Mockup — BrewAI
# Specialty Coffee Shop Web Application

**Project:** BrewAI
**Generated:** 2026-06-15
**Based on:** UserStories-BrewAI.md, PRD-BrewAI.md, FRD-BrewAI.md, JOURNEYS-BrewAI.md
**Stories covered:** US-0.1 – US-7.4 (36 stories, P0 + P1)

---

## Overview

BrewAI's UX is a single-page ordering flow: **Browse → Customize → Cart → Confirm**. The design language is dark, warm, and premium — every surface reinforces that the product is specialty coffee, not fast food. Interactions are fast (150–200ms), information is always where users expect it, and the system never surprises with price changes or data loss.

The experience is guest-only: no login gate, no payment step. The entire loop completes in under 2 minutes on mobile.

---

## Design System Reference

### Color Tokens

| Token | Value | Role |
|-------|-------|------|
| Canvas | `#0A0A0A` | Page/body background |
| Surface | `#141414` | Cards, panels |
| Surface Raised | `#1C1C1C` | Modals, inputs, dropdowns |
| Border Subtle | `#2A2A2A` | Default borders |
| Border Hover | `#3A3A3A` | Hover borders |
| Accent | `#C8922A` | CTAs, selected states, focus rings, price |
| Accent Hover | `#E0A83C` | Accent hover state |
| Text Primary | `#F5F0E8` | Main readable text |
| Text Secondary | `#9A9080` | Descriptions, labels |
| Text Tertiary | `#5A5248` | Placeholders, disabled |
| Success | `#4CAF50` | Confirmation icon, success states |
| Error | `#E57373` | Error messages, validation |

### Border Radii

| Context | Value |
|---------|-------|
| Inputs, selects, badges | 6px |
| Cards, cart items, modals | 12px |
| Category pills, tags | 20px |

### Typography Scale

| Size | Use |
|------|-----|
| 11px | Tertiary labels, counters |
| 13px | Secondary text, badges |
| 14px | Body text, descriptions, buttons |
| 16px | Card prices, sub-headings |
| 20px | Section headings, modal drink name |
| 28px | Order reference, page headings |
| 40px | Hero / confirmation success heading |

**Max font-weight: 600 (semibold)**
- Headings / drink names: **Playfair Display**
- Body / labels / buttons: **Inter**

### Interaction Tokens

| Property | Value |
|----------|-------|
| Color/border transition | 150ms ease |
| Transform transition | 200ms ease |
| Focus ring | 2px solid `#C8922A`, 2px offset |
| Button active scale | 0.97 |
| Toast auto-dismiss | 3 seconds |
| Search debounce | 200ms |

### Elevation / State Styles

| State | Style |
|-------|-------|
| Default card | `bg-#141414 border-1px-#2A2A2A radius-12px` |
| Hover card | `bg-#1C1C1C border-#3A3A3A` |
| Active/selected | `border-#C8922A box-shadow: 0 0 0 1px rgba(200,146,42,0.25)` |
| Focus ring | `outline: 2px solid #C8922A; outline-offset: 2px` |
| Disabled | `opacity-40 cursor-not-allowed` |
| Loading | Spinner (`text-accent`) + `opacity-70` |

---

## Screen Inventory

| Screen | Route | Primary Story |
|--------|-------|---------------|
| Menu Page | `/` | US-1.1 |
| Customization Modal | (overlay on `/`) | US-2.1 |
| Cart Drawer | (overlay, any route) | US-3.1 |
| Order Confirmation | `/confirmation` | US-4.2 |

---

## Flow Inventory

| Flow ID | Name | Entry | Exit |
|---------|------|-------|------|
| Flow-00 | Menu Browse & Filter | App load (`/`) | "Customize" or "Add to Cart" click |
| Flow-01 | Drink Customization | "Customize" CTA on card | Cart updated, modal closed |
| Flow-02 | Cart Management | Cart icon tap | "Place Order" or drawer closed |
| Flow-03 | Order Placement & Confirmation | "Place Order" button | "Start a New Order" → `/` |

---

## UX Principles (derived from Journeys)

1. **Speed is a feature.** Priya has 2 minutes. Every interaction must be instantaneous or show progress immediately.
2. **Trust through transparency.** Marcus needs to see every customization echoed back. The cart line item summary is the trust contract.
3. **Delight through premium aesthetics.** Jordan uses visual quality as a proxy for coffee quality. Dark canvas + amber + Playfair Display earns the order before a word is read.
4. **No data loss, ever.** Cart state survives navigation. A failed order never clears the cart.
5. **Contextual options only.** Shot count only on espresso. Temperature only where applicable. Never expose a control that doesn't apply.
6. **Real-time price = no surprises.** Every option change recalculates the total within 100ms. Transparency earns trust.

---
