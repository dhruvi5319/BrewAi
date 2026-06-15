# BrewAI

## What This Is

BrewAI is a modern specialty coffee shop web application where customers can browse a curated menu, customize their drinks with precision, manage a cart, and place orders — all within a beautiful, fast, polished interface. There are no AI features; the name reflects the brand identity, not the technology. The application is built for production-quality delivery with a dark, warm-amber design system that evokes premium specialty coffee culture.

## Core Value

A customer can browse the full menu, customize their drink exactly how they want it, and place an order — seamlessly, beautifully, on any device.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Full menu browsing experience with category filtering and search
- [ ] Drink customization (size, milk, extras, temperature, shots)
- [ ] Cart management (add, remove, update quantities, clear)
- [ ] Order placement with order summary and confirmation
- [ ] Responsive UI across mobile and desktop viewports
- [ ] Animated, polished interactions (Framer Motion)
- [ ] SQLite-backed menu and order persistence (better-sqlite3)
- [ ] Node.js + Express REST API backend
- [ ] React 18 + TypeScript + Vite frontend
- [ ] Zustand state management for cart and order state
- [ ] Design system: dark canvas (#0A0A0A), warm amber accent (#C8922A), Inter + Playfair Display typography
- [ ] Sandbox/preview compatible: Debian/Ubuntu Docker base, 0.0.0.0 binding, port 3000

### Out of Scope

- AI/ML features — name is brand identity only, not functionality
- User authentication / accounts — v1 is guest-only ordering
- Payment processing — order placement is UI-complete only (no payment gateway)
- Real-time order tracking — deferred; v1 shows confirmation screen
- Admin/CMS panel — menu managed via SQLite seed data
- Mobile native app — web-first, responsive design serves all devices

## Context

- **Stack decision:** React 18 + TypeScript + Vite chosen for fast DX and modern React patterns; Tailwind CSS v3 for utility-first styling aligned to the custom design system; Zustand for lightweight cart state without Redux overhead; better-sqlite3 for zero-config embedded persistence in the sandbox environment.
- **Design philosophy:** Dark, premium aesthetic (#0A0A0A canvas, #C8922A amber accent) evoking a high-end specialty coffee experience. Playfair Display for display headings, Inter for body text. All interactions have 150–200ms transitions. Cards use 12px border-radius, inputs 6px. Focus rings are 2px solid amber.
- **Sandbox constraints:** Build and preview run in a restricted sandbox — outbound network is TLS-SNI allowlisted. All packages must come from npm (registry.npmjs.org), apt (Debian/Ubuntu), or allowlisted registries. No `curl`/`wget` binary fetches. Docker images must be Debian/Ubuntu-based (e.g., `node:20-bookworm-slim`) — never Alpine. App must bind to `0.0.0.0:3000`.
- **No external font CDN at runtime:** Google Fonts or any CDN fetch may be blocked at preview time. Fonts should be bundled or served locally.

## Constraints

- **Tech Stack**: React 18 + TypeScript + Vite / Tailwind CSS v3 / Zustand / Node.js + Express / SQLite (better-sqlite3) / Lucide React / Framer Motion — fixed, no substitutions
- **Fonts**: Inter + Playfair Display — must be bundled (not CDN-fetched at runtime)
- **Docker**: Debian/Ubuntu base images only (`node:20-bookworm-slim`); no Alpine; bind `0.0.0.0:3000`
- **Network**: No runtime fetches from non-allowlisted hosts; all dependencies via npm/apt
- **Scope**: No auth, no payments, no AI — guest ordering flow only for v1
- **Design System**: Color palette, typography, radii, transitions defined above are fixed brand standards

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SQLite via better-sqlite3 (not PostgreSQL) | Zero infrastructure dependencies; sandbox-friendly; sufficient for menu + order data | — Pending |
| Zustand over Redux/Context | Lightweight, minimal boilerplate; cart state is simple enough that Redux is overkill | — Pending |
| Vite over CRA/Next.js | Fastest dev build, pure SPA is sufficient (no SSR needed for a coffee shop menu) | — Pending |
| Tailwind CSS v3 (not CSS Modules) | Design system with custom tokens maps naturally to Tailwind config; utility classes match design system precisely | — Pending |
| Docker Debian/Ubuntu base only | Alpine's package CDN not on sandbox allowlist; apt required for any OS deps | — Pending |
| Fonts bundled locally | Google Fonts CDN may be blocked in sandbox preview environment | — Pending |
| Guest-only ordering for v1 | Minimizes scope, removes auth complexity; validates core ordering flow first | — Pending |

---
*Last updated: 2026-06-15 after initialization*
