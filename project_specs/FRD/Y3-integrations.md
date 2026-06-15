---

## Integration Points

**File:** `Y3-integrations.md`  
**Scope:** All external dependencies and integration contracts for BrewAI v1

---

### Overview

BrewAI v1 has intentionally minimal external dependencies. There are no third-party API calls, no payment gateways, no authentication providers, and no CDN runtime fetches. All integrations are package-level (npm) or tooling-level (build, Docker). This section documents every external dependency and the constraints governing its use.

---

### npm Package Dependencies (Frontend)

| Package | Version Constraint | Purpose | Sandbox Note |
|---------|-------------------|---------|--------------|
| `react` | `^18.x` | UI component framework | — |
| `react-dom` | `^18.x` | React DOM renderer | — |
| `typescript` | `^5.x` | Type safety | — |
| `vite` | `^5.x` | Build tool and dev server | — |
| `@vitejs/plugin-react` | `^4.x` | React fast-refresh for Vite | — |
| `tailwindcss` | `^3.x` | Utility-first CSS | v3 only — not v4 |
| `autoprefixer` | `^10.x` | PostCSS vendor prefixing | — |
| `postcss` | `^8.x` | CSS processing pipeline | — |
| `zustand` | `^4.x` | Client-side state management | — |
| `framer-motion` | `^11.x` | UI animation library | Dynamic import recommended to keep initial chunk small |
| `lucide-react` | `^0.x` | Icon set (tree-shakeable) | Import individual icons, not the full package |
| `@fontsource/inter` | `^5.x` | Bundled Inter font (woff2) | Replaces Google Fonts CDN |
| `@fontsource/playfair-display` | `^5.x` | Bundled Playfair Display font (woff2) | Replaces Google Fonts CDN |

**Font Bundling Contract:**
- `@fontsource/inter` and `@fontsource/playfair-display` are imported in `src/index.css` or `src/main.tsx`.
- These packages include pre-converted `.woff2` files that Vite bundles into `dist/assets/`.
- No `@import url('https://fonts.googleapis.com/...')` is ever added to any CSS file.
- Alternative: self-host `.woff2` files under `public/assets/fonts/` if `@fontsource` packages introduce issues.

---

### npm Package Dependencies (Backend)

| Package | Version Constraint | Purpose | Sandbox Note |
|---------|-------------------|---------|--------------|
| `express` | `^4.x` | HTTP server framework | — |
| `better-sqlite3` | `^9.x` | Synchronous SQLite driver | Requires native binary; see note below |
| `cors` | `^2.x` | CORS middleware | — |
| `@types/express` | `^4.x` | Express TypeScript types | devDependency |
| `@types/better-sqlite3` | `^7.x` | better-sqlite3 TypeScript types | devDependency |
| `@types/cors` | `^2.x` | cors TypeScript types | devDependency |
| `tsx` | `^4.x` | TypeScript execution for dev | devDependency; not in production |
| `ts-node` | `^10.x` | Alternative TS executor | devDependency; either tsx or ts-node |

**`better-sqlite3` Binary Compatibility Contract:**
- Must be pinned to a version that ships pre-built binaries for **Node.js 20 on Debian** (`node:20-bookworm-slim`).
- If pre-built binaries are unavailable, the `Dockerfile` must run `npm rebuild better-sqlite3 --build-from-source` after `npm install`. The Debian base image includes the necessary build tools (python3, make, gcc) or they can be installed via `apt-get`.
- **Never use `node:20-alpine`** — the Alpine base is not on the sandbox allowlist and lacks compatible build tools.

---

### Build Tool Integration

| Tool | Config File | Contract |
|------|-------------|---------|
| Vite | `vite.config.ts` | Build target: `src/main.tsx`; output: `dist/`; dev port: `5173`; API proxy: `/api → http://localhost:3000` in dev mode |
| TypeScript | `tsconfig.json` | Strict mode: `true`; no `any` in production code; path aliases configured via `vite.config.ts` |
| Tailwind CSS | `tailwind.config.ts` | Content glob: `['./index.html', './src/**/*.{ts,tsx}']`; theme extended with design tokens (see `00-header.md §Design System Tokens`) |
| PostCSS | `postcss.config.js` | Plugins: `tailwindcss`, `autoprefixer` |

**Vite Dev Proxy Contract:**
In development, Vite proxies `/api/*` requests to `http://localhost:3000/api/*` so the frontend dev server (port 5173) and the Express backend (port 3000) work together without CORS issues:

```typescript
// vite.config.ts (development only)
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
},
```

In production, both frontend and backend are served from Express on port 3000:
- `GET /api/*` → Express API handlers
- All other routes → `dist/index.html` (SPA fallback)

---

### Docker / Container Integration

| Item | Contract |
|------|---------|
| Base image | `node:20-bookworm-slim` (Debian 12) — never Alpine |
| Port | `EXPOSE 3000`; app binds `0.0.0.0:3000` |
| Build command | `npm run build` (Vite production build) |
| Start command | `node dist-server/server.js` or `node server.js` |
| SQLite file | Stored at `./data/brewai.db` inside container; mountable as a named volume for persistence |
| Font assets | Bundled into `dist/assets/` by Vite; served statically by Express |
| npm registry | `https://registry.npmjs.org` (default); no custom registry |
| No curl/wget | All dependencies resolved via `npm install`; no binary download scripts |

**Dockerfile Checklist:**
1. `FROM node:20-bookworm-slim`
2. `WORKDIR /app`
3. `COPY package*.json ./`
4. `RUN npm ci --omit=dev` (or `npm install` if devDeps needed for build)
5. `RUN npm run build` (Vite build)
6. If `better-sqlite3` native compile needed: `RUN apt-get update && apt-get install -y python3 make g++ && npm rebuild better-sqlite3`
7. `EXPOSE 3000`
8. `CMD ["node", "server.js"]`

---

### External Services (None in v1)

BrewAI v1 has **zero** external service integrations:

| Service Type | Status | Reason |
|-------------|--------|--------|
| Payment gateway | Not integrated | Out of scope for v1 |
| Email / SMS | Not integrated | Order confirmation is UI-only |
| Analytics | Not integrated | No user data collection |
| Error monitoring | Not integrated | Console logging only in v1 |
| Authentication provider | Not integrated | Guest-only ordering |
| CDN | Not integrated | All assets bundled locally |
| External database | Not integrated | SQLite embedded in container |

---

### Sandbox Network Allowlist

All runtime network activity is restricted to:

| Host | Protocol | Purpose |
|------|----------|---------|
| `0.0.0.0:3000` (self) | HTTP | Application server |
| `localhost:3000` (self) | HTTP | API calls from frontend in production |
| `registry.npmjs.org` | HTTPS | npm package installation (build time only) |

No other outbound connections are made or expected at runtime.

---
