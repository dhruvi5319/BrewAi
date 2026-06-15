---

## 6. Technology Stack

### 6.1 Full Stack Reference

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | `^18.x` | Component-driven UI with concurrent features |
| **Language** | TypeScript | `^5.x` | Type safety; strict mode enabled |
| **Build Tool** | Vite | `^5.x` | Fast dev server, optimized production bundle, ESM output |
| **Vite Plugin** | @vitejs/plugin-react | `^4.x` | React Fast Refresh in development |
| **CSS Framework** | Tailwind CSS | `^3.x` (v3 only, not v4) | Utility-first CSS; custom design tokens in `tailwind.config.ts` |
| **CSS Processing** | PostCSS + Autoprefixer | `^8.x` / `^10.x` | CSS pipeline; vendor prefixes |
| **State Management** | Zustand | `^4.x` | Lightweight cart and menu state without Redux overhead |
| **Animation** | Framer Motion | `^11.x` | Declarative animations; `AnimatePresence`; `useReducedMotion` |
| **Icons** | Lucide React | `^0.x` | Tree-shakeable SVG icon set |
| **Routing** | React Router | `^6.x` | SPA client-side routing |
| **Font (body)** | @fontsource/inter | `^5.x` | Bundled Inter font (woff2); no CDN fetch |
| **Font (display)** | @fontsource/playfair-display | `^5.x` | Bundled Playfair Display (woff2); no CDN fetch |
| **Backend Runtime** | Node.js | `20.x` (LTS) | Server runtime; required for `bookworm-slim` image |
| **Backend Framework** | Express | `^4.x` | REST API + static file serving |
| **Database Driver** | better-sqlite3 | `^9.x` | Synchronous SQLite; no async/callback overhead |
| **CORS Middleware** | cors | `^2.x` | CORS headers in development mode |
| **TS Execution (dev)** | tsx | `^4.x` | Run TypeScript directly without compile step in dev |
| **Container Image** | node:20-bookworm-slim | — | Debian 12 slim; sandbox-compatible; never Alpine |

### 6.2 Design System Tokens (Tailwind Configuration)

All tokens are defined in `tailwind.config.ts` under `theme.extend`. No color hex values appear in `.tsx` or `.ts` files outside this config and `src/index.css`.

```typescript
// tailwind.config.ts (theme.extend section)
colors: {
  canvas:         '#0A0A0A',   // Page background (<html>, <body>)
  surface:        '#141414',   // Card and panel backgrounds
  'surface-raised': '#1C1C1C', // Modals, dropdowns, elevated elements
  accent:         '#C8922A',   // Primary CTA, focus rings, highlights
  'accent-hover': '#E0A83C',   // Accent hover state
  primary:        '#F5F0E8',   // Body and heading text
  secondary:      '#9A9080',   // Secondary / helper text
  tertiary:       '#5A5248',   // Tertiary text, placeholders
  border:         '#2A2A2A',   // Subtle border (cards, inputs)
  'border-hover': '#3A3A3A',   // Border hover state
  success:        '#4CAF50',   // Success states and icons
  error:          '#E57373',   // Error states and icons
},
fontFamily: {
  display: ['Playfair Display', 'Georgia', 'serif'],
  body:    ['Inter', 'system-ui', 'sans-serif'],
},
borderRadius: {
  input: '6px',
  card:  '12px',
  pill:  '20px',
},
```

### 6.3 Font Bundling Strategy

Fonts are sourced from `@fontsource/*` npm packages, which ship pre-converted `.woff2` files. Vite processes these at build time and emits them into `dist/assets/`. No Google Fonts CDN URL is ever referenced.

```typescript
// src/main.tsx — font imports (processed by Vite)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
```

If `@fontsource` packages cause issues, the fallback is to place `.woff2` files in `public/assets/fonts/` and declare `@font-face` rules in `src/index.css`:

```css
/* src/index.css (fallback approach) */
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### 6.4 Build Configuration

**`vite.config.ts`:**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,   // Omit in production for smaller bundle
  },
});
```

**`tailwind.config.ts`:**
```typescript
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { /* design tokens above */ } },
  plugins: [],
};
```

**`tsconfig.json` (key settings):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  }
}
```

### 6.5 npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `concurrently "tsx server.ts" "vite"` | Dev: Express on 3000 + Vite on 5173 |
| `build` | `tsc -p tsconfig.server.json && vite build` | Compile server + build frontend |
| `start` | `node server.js` | Production: start Express (serves dist/) |
| `preview` | `vite preview` | Preview Vite build only (dev tool) |

### 6.6 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Express server port |
| `HOST` | `0.0.0.0` | Express bind address (required for sandbox) |
| `DB_PATH` | `./data/brewai.db` | SQLite database file path |
| `NODE_ENV` | `development` | Controls CORS and static file behavior |

---
