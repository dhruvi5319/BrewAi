---

## 7. Integration Points

### 7.1 Overview

BrewAI v1 is intentionally self-contained. There are **zero external service integrations** at runtime. All dependencies are resolved at build time via npm and bundled into the application. The integration surface consists only of internal boundaries between the frontend, backend, and database layers.

### 7.2 Internal Integration: Frontend ↔ Backend

| Integration Point | Contract |
|------------------|---------|
| Protocol | HTTP/1.1 over localhost (same container) |
| Data format | JSON — `{ data, error, status }` envelope on every response |
| Base path | `/api` — prefixed on all API routes |
| Error handling | Frontend checks `response.error !== null` before using `response.data` |
| Dev proxy | Vite proxies `/api/*` → `http://localhost:3000/api/*` to avoid CORS in development |
| Production | Same origin; no proxy needed; Express handles both `/api/*` and static files |

**Frontend fetch pattern:**
```typescript
const response = await api.getMenu();
if (response.error) {
  // Handle error using response.error.code
} else {
  // Use response.data safely
}
```

### 7.3 Internal Integration: Backend ↔ SQLite

| Integration Point | Contract |
|------------------|---------|
| Driver | `better-sqlite3` — fully synchronous (no Promises, no callbacks) |
| Connection | Singleton `Database` instance opened once at startup |
| WAL mode | `PRAGMA journal_mode = WAL` — improves concurrent read throughput |
| Foreign keys | `PRAGMA foreign_keys = ON` — enforces `order_items.order_id → orders.id` |
| Transactions | `POST /api/orders` uses `db.transaction(fn)()` for atomic multi-row insert |
| Query style | Prepared statements only; all user values passed as `?` parameters |
| JSON columns | `options_json` and `customizations_json` are TEXT; parsed with `JSON.parse()` in application code |
| Auto-init | `initDatabase()` called synchronously before `app.listen()` — schema always ready before first request |

### 7.4 npm Package Dependencies

**Frontend packages:**

| Package | Version | Role | Constraint |
|---------|---------|------|-----------|
| `react` | `^18.x` | UI framework | — |
| `react-dom` | `^18.x` | DOM renderer | — |
| `react-router-dom` | `^6.x` | Client-side routing | — |
| `zustand` | `^4.x` | State management | — |
| `framer-motion` | `^11.x` | Animations | Dynamic import recommended for initial chunk |
| `lucide-react` | `^0.x` | Icons | Import individual icons only (tree-shakeable) |
| `@fontsource/inter` | `^5.x` | Bundled Inter font | No CDN; woff2 bundled by Vite |
| `@fontsource/playfair-display` | `^5.x` | Bundled Playfair Display | No CDN; woff2 bundled by Vite |
| `tailwindcss` | `^3.x` | CSS framework | v3 ONLY — not v4 |
| `autoprefixer` | `^10.x` | PostCSS plugin | — |
| `postcss` | `^8.x` | CSS processing | — |
| `typescript` | `^5.x` | Type checking | devDependency |
| `vite` | `^5.x` | Build tool | devDependency |
| `@vitejs/plugin-react` | `^4.x` | Vite React plugin | devDependency |

**Backend packages:**

| Package | Version | Role | Constraint |
|---------|---------|------|-----------|
| `express` | `^4.x` | HTTP framework | — |
| `better-sqlite3` | `^9.x` | SQLite driver | Requires native binary; Debian build tools available if compile needed |
| `cors` | `^2.x` | CORS middleware | — |
| `tsx` | `^4.x` | TS execution in dev | devDependency |
| `@types/express` | `^4.x` | Express types | devDependency |
| `@types/better-sqlite3` | `^7.x` | better-sqlite3 types | devDependency |
| `@types/cors` | `^2.x` | cors types | devDependency |
| `@types/node` | `^20.x` | Node.js types | devDependency |

### 7.5 Container Integration (Docker)

```dockerfile
FROM node:20-bookworm-slim
# NEVER Alpine — Alpine is not on the sandbox allowlist

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
# Produces: dist/ (Vite frontend) + server.js (compiled Express)

# If better-sqlite3 needs native compilation (fallback only):
# RUN apt-get update && apt-get install -y python3 make g++ \
#     && npm rebuild better-sqlite3 --build-from-source \
#     && apt-get clean

EXPOSE 3000
# Must bind to 0.0.0.0 for sandbox port exposure

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV DB_PATH=./data/brewai.db

# SQLite database directory (mountable as named volume for persistence)
RUN mkdir -p /app/data

CMD ["node", "server.js"]
```

**Container checklist:**

| Item | Requirement | Status |
|------|-------------|--------|
| Base image | `node:20-bookworm-slim` (Debian 12) | Required |
| Port binding | `0.0.0.0:3000` | Required |
| Font assets | Bundled into `dist/assets/` by Vite at build time | Required |
| Database | Auto-initialized and seeded on cold start | Required |
| npm only | All packages from `registry.npmjs.org`; no `curl`/`wget` fetches | Required |
| Alpine | Never — not on sandbox allowlist | Forbidden |

### 7.6 External Services (None in v1)

| Service Type | Status | Notes |
|-------------|--------|-------|
| Payment gateway | Not integrated | Out of scope v1 |
| Authentication provider | Not integrated | Guest-only ordering |
| Email / SMS | Not integrated | Confirmation is UI-only |
| Analytics | Not integrated | No user data collection |
| Error monitoring | Not integrated | Console logging only |
| CDN | Not integrated | All assets bundled locally |
| External database | Not integrated | SQLite embedded in container |
| Google Fonts | Not integrated at runtime | Replaced by `@fontsource/*` npm packages |

### 7.7 Sandbox Network Allowlist

All runtime network activity is restricted to:

| Host | Protocol | Purpose |
|------|----------|---------|
| `0.0.0.0:3000` (self) | HTTP | Application server |
| `localhost:3000` (self) | HTTP | API calls from browser in production |
| `registry.npmjs.org` | HTTPS | npm package installation (build time only) |
| `deb.debian.org` | HTTPS | apt packages if native build needed (build time only) |

No other outbound connections are made or expected at runtime.

---

## Appendix: Non-Functional Requirements Coverage

| Requirement | Architecture Mechanism |
|-------------|----------------------|
| LCP < 2.5s | Vite code splitting; `@fontsource` bundled fonts; no CDN; Tailwind CSS purge |
| CLS < 0.1 | Fixed card dimensions; `min-height` on cards; no layout-shifting fonts (bundled woff2) |
| Keyboard accessible | `role="dialog"` + focus trap in Modal; `aria-label` on all icon buttons; `focus-visible:ring-2` via Tailwind |
| prefers-reduced-motion | `useReducedMotion()` checked in every animated component; all Framer Motion animations disabled when set |
| No horizontal overflow | `overflow-x: hidden` on body; Tailwind responsive breakpoints; `max-w-screen-*` containers |
| Touch targets 44×44px | `min-height: 44px` on all Button variants; enforced via Tailwind utilities |
| Sandbox cold start | `initDatabase()` before `app.listen()`; seed script on empty DB; no manual steps |
| TypeScript strict | `"strict": true` in `tsconfig.json`; no `any` in production code |
| SQLite reliability | `better-sqlite3` synchronous API; no partial writes; WAL journal mode |
| Font no-CDN | `@fontsource/*` packages; woff2 in `dist/assets/`; zero CDN fetches |
| Debian container | `node:20-bookworm-slim` base; never Alpine |

---

*Document end — TechArch-BrewAI.md v1.0 | Generated: 2026-06-15*
