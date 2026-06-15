# Technical Architecture Document
# BrewAI — Specialty Coffee Shop Web Application

**Version:** 1.0
**Date:** 2026-06-15
**Project Acronym:** BrewAI
**Status:** Active
**Generated from:** PRD-BrewAI.md v1.0 + FRD-BrewAI.md v1.0

---

## 1. Architectural Overview

### 1.1 Architecture Pattern

BrewAI is a **Single-Page Application (SPA) with an embedded REST API backend**. The frontend is a React 18 + TypeScript application built by Vite and served as a static bundle directly from the same Express server that provides the API. There is no separate frontend deployment target — in production, a single Node.js process on port 3000 handles everything.

This monolithic-server SPA pattern was chosen because:
- The sandbox requires a single port (`0.0.0.0:3000`) and no external infrastructure.
- SQLite via `better-sqlite3` eliminates any database server dependency.
- The guest-only scope (no auth, no realtime) does not require a decoupled service architecture.
- Cold-start simplicity: `npm install && npm run build && node server.js` — no orchestration.

### 1.2 Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│  Browser (Chrome 120+ / Firefox 120+ / Safari 17+ / Edge 120+)    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  React 18 SPA (TypeScript + Vite bundle)                     │  │
│  │                                                              │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────────────┐  │  │
│  │  │  Zustand   │  │  React      │  │  Framer Motion       │  │  │
│  │  │  cartStore │  │  Router v6  │  │  Animation Layer     │  │  │
│  │  │  menuStore │  │             │  │                      │  │  │
│  │  └────────────┘  └─────────────┘  └──────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐   │  │
│  │  │  Pages   │  │  UI          │  │  Lib                │   │  │
│  │  │  /menu   │  │  Components  │  │  motion.ts          │   │  │
│  │  │  /confirm│  │  (Primitives)│  │  api.ts (fetch)     │   │  │
│  │  └──────────┘  └──────────────┘  └─────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                         │ HTTP /api/*                              │
└─────────────────────────┼──────────────────────────────────────────┘
                          │
                          ▼ port 3000 (0.0.0.0)
┌────────────────────────────────────────────────────────────────────┐
│  Node.js 20 + Express 4 (server.ts → compiled to server.js)       │
│                                                                    │
│  Middleware Chain:                                                 │
│  cors() → express.json() → routes → static(dist/) → errorHandler  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Route Handlers                                            │   │
│  │  GET  /api/menu             → menuRouter.getAll()          │   │
│  │  GET  /api/menu/categories  → menuRouter.getCategories()   │   │
│  │  GET  /api/menu/:id         → menuRouter.getById()         │   │
│  │  POST /api/orders           → orderRouter.create()         │   │
│  │  GET  /api/orders/:id       → orderRouter.getById()        │   │
│  │  GET  /*                    → dist/index.html (SPA)        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                         │                                         │
│                         ▼                                         │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Database Layer (better-sqlite3 — synchronous)             │   │
│  │                                                            │   │
│  │  initDatabase()  →  CREATE TABLE IF NOT EXISTS             │   │
│  │                  →  seedMenu() (if menu_items count = 0)   │   │
│  │                                                            │   │
│  │  Tables: menu_items · orders · order_items                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                         │                                         │
│                         ▼                                         │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  SQLite file: ./data/brewai.db                             │   │
│  │  WAL mode · Foreign keys ON                                │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

### 1.3 Deployment Topology

```
┌─────────────────────────────────────────────────────────┐
│  Docker Container (node:20-bookworm-slim)                │
│                                                         │
│  /app/                                                  │
│  ├── dist/              ← Vite production build         │
│  │   ├── index.html                                     │
│  │   └── assets/        ← JS, CSS, fonts (woff2)        │
│  ├── data/              ← SQLite database dir           │
│  │   └── brewai.db                                      │
│  ├── server.js          ← Compiled Express server       │
│  └── package.json                                       │
│                                                         │
│  EXPOSE 3000                                            │
│  CMD ["node", "server.js"]                              │
│                                                         │
│  0.0.0.0:3000 ──────────────────────────► preview URL  │
└─────────────────────────────────────────────────────────┘
```

**Start sequence (cold start, zero manual steps):**
1. `npm ci` — install all dependencies (npm registry only)
2. `npm run build` — Vite compiles frontend to `dist/`; TypeScript compiles server to `dist-server/` or root
3. `node server.js` — Express starts; `initDatabase()` runs synchronously; schema created + seed inserted if needed; server binds `0.0.0.0:3000`

### 1.4 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Deployment model | Monolith (SPA + API in one Express process) | Single port requirement; no infra complexity |
| Database | SQLite via better-sqlite3 (synchronous) | Zero external infra; embedded; sufficient throughput for coffee shop scale |
| State management | Zustand | Lightweight; cart and menu state are simple; avoids Redux boilerplate |
| Build tool | Vite 5 | Fastest dev iteration; native ESM; clean SPA output |
| Font delivery | `@fontsource/*` npm packages | Bundled into `dist/assets/` by Vite; no CDN fetch at runtime |
| Container base | `node:20-bookworm-slim` (Debian 12) | Only Debian/Ubuntu base images on sandbox allowlist; never Alpine |
| Auth | None (v1) | Guest-only ordering; removes auth surface entirely |
| Payments | None (v1) | UI-complete only; reduces scope and compliance burden |

---
