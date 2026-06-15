# Functional Requirements Document
# BrewAI — Specialty Coffee Shop Web Application

**Version:** 1.0  
**Date:** 2026-06-15  
**Project Acronym:** BrewAI  
**Status:** Active  
**Generated from:** PRD-BrewAI.md v1.0  

---

## Scope

This document specifies the complete functional requirements for BrewAI v1 — a guest-only specialty coffee ordering web application. It covers every feature from F0 through F7 as defined in the PRD, with detailed inputs, outputs, validation rules, error states, API surface, and database schema. The target audience is developers implementing the application; every behaviour described here is unambiguous and directly implementable.

No authentication, no payment processing, and no AI/ML features are in scope for v1.

---

## Conventions

- **Feature IDs** follow the PRD: F0–F7. Each feature has a dedicated chunk file (`F00-*.md` … `F07-*.md`).
- **Cross-feature artifacts** live in separate files: `Y0-schema.md` (DDL), `Y1-api.md` (API catalog), `Y2-errors.md` (error catalog), `Y3-integrations.md` (integration points).
- **API format:** All responses use the envelope `{ "data": <payload>, "error": null|<ErrorObject>, "status": <httpCode> }`.
- **Field notation:** `fieldName` (type, required|optional, constraints). Example: `quantity` (integer, required, 1–10).
- **Error codes** are SCREAMING_SNAKE_CASE strings returned in `error.code`.
- **Cross-references** use `see F03 §Process` or `see Y1-api.md §Orders`.
- **Zero-padded IDs:** Feature chunks use two-digit padding (`F00`, `F01`, … `F07`) to guarantee correct lexicographic sort order.
- **Priority:** P0 = MVP-critical; P1 = production-quality required; all features in this doc are implemented in v1.

---

## Table of Contents

| Section | File | Description |
|---------|------|-------------|
| Header & Conventions | `00-header.md` | This file |
| F0: Design System | `F00-design-system.md` | Component foundation, tokens, fonts |
| F1: Menu Browsing | `F01-menu-browsing.md` | Menu grid, category filter, search |
| F2: Drink Customization | `F02-drink-customization.md` | Customization modal, options, pricing |
| F3: Cart Management | `F03-cart-management.md` | Cart drawer, quantities, subtotal |
| F4: Order Placement | `F04-order-placement.md` | Order submission, confirmation screen |
| F5: Responsive Layout | `F05-responsive-layout.md` | Navigation, breakpoints, touch targets |
| F6: Animations | `F06-animations.md` | Framer Motion variants, reduced-motion |
| F7: REST API | `F07-rest-api.md` | Express endpoints, SQLite persistence |
| Database Schema | `Y0-schema.md` | Full SQLite DDL |
| API Catalog | `Y1-api.md` | REST endpoints with request/response schemas |
| Error Catalog | `Y2-errors.md` | Cross-feature error codes and HTTP statuses |
| Integration Points | `Y3-integrations.md` | External dependency contracts |

---

## Cross-Cutting Terminology

| Term | Definition |
|------|-----------|
| **Canvas** | Page background color `#0A0A0A` |
| **Surface** | Card/panel background color `#141414` |
| **Surface Raised** | Elevated element background `#1C1C1C` (modals, dropdowns) |
| **Accent** | Primary interactive color `#C8922A` (amber) |
| **Text Primary** | Main readable text color `#F5F0E8` |
| **Menu Item** | A single drink product in the SQLite menu table |
| **Cart Item** | A menu item placed in the Zustand cart with selected customizations |
| **Line Item** | An ordered item in a submitted order record |
| **Order** | A persisted record in SQLite created when the customer places their cart |
| **Order Reference** | Human-readable unique ID shown on confirmation screen (e.g., `BRW-00042`) |
| **Customization** | The set of options (size, milk, temperature, shots, extras, note) applied to a cart item |
| **Session** | Browser tab lifetime — cart state is in-memory (Zustand) and does not survive page refresh |
| **Seed Data** | Initial 20–30 menu items inserted into SQLite when the database is freshly initialized |
| **Envelope** | Standard JSON response shape: `{ data, error, status }` |
| **Toast** | Transient notification that auto-dismisses after ~3 seconds |
| **Drawer** | Slide-in panel (cart, mobile menu) that overlays the main content |
| **P0** | MVP-critical priority — must be complete before v1 ships |
| **P1** | Production-quality priority — implemented alongside P0, not deferred |

---

## Design System Tokens (Cross-Feature Reference)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-canvas` | `#0A0A0A` | `<html>` and `<body>` background |
| `--color-surface` | `#141414` | Cards, panels |
| `--color-surface-raised` | `#1C1C1C` | Modals, dropdowns, elevated sheets |
| `--color-accent` | `#C8922A` | CTAs, focus rings, selected states |
| `--color-text-primary` | `#F5F0E8` | All readable text |
| `--color-text-muted` | `#9CA3AF` | Secondary/helper text |
| `--color-border` | `#2A2A2A` | Card and input borders |
| `--color-error` | `#EF4444` | Error messages and icons |
| `--color-success` | `#22C55E` | Success states |
| `--radius-input` | `6px` | Text inputs, selects |
| `--radius-card` | `12px` | Product cards, cart items |
| `--radius-pill` | `20px` | Category filter buttons, tags |
| `--font-display` | Playfair Display | Drink names, display headings |
| `--font-body` | Inter | Body text, labels, buttons |
| `--transition-default` | `150ms ease-in-out` | All interactive state transitions |
| `--transition-motion` | `200ms ease-out` | Framer Motion entrance/exit |
| `--focus-ring` | `2px solid #C8922A` | Keyboard focus indicator |

---
