---

## 5. Security Architecture

### 5.1 Overview

BrewAI v1 is a guest-only ordering application with no user accounts, no authentication, and no payment data. The security surface is intentionally minimal. The primary concerns are input validation, SQL injection prevention, and ensuring no sensitive runtime data is exposed.

### 5.2 Authentication & Authorization

| Property | Value |
|----------|-------|
| Authentication | None — all endpoints are publicly accessible |
| Authorization | None — no roles, no permissions |
| Sessions | None — no cookies, no session tokens |
| User data collected | None — no PII stored |

All API endpoints are read/write-public. This is acceptable for v1 because:
- The only writable endpoint (`POST /api/orders`) accepts anonymous order submissions, which is the intended user flow.
- There is no admin surface, payment data, or user credentials to protect.
- The application is scoped to a preview/sandbox environment in v1.

### 5.3 Input Validation & Injection Prevention

**SQL Injection:** Prevented by using `better-sqlite3` parameterized prepared statements exclusively. No SQL query in the application uses string interpolation or template literals to include user input. Every user-supplied value is passed as a `?` parameter:

```typescript
// Safe — parameterized
const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);

// Never — string interpolation (forbidden)
// const item = db.query(`SELECT * FROM menu_items WHERE id = ${id}`); ← NEVER
```

**Request Body Validation (`POST /api/orders`):** Validated field-by-field before any database write:

| Validation | Implementation |
|-----------|----------------|
| `items` is non-empty array | `Array.isArray(items) && items.length > 0` |
| `menuItemId` is positive integer | `Number.isInteger(v) && v > 0` |
| `unitPrice` is positive number | `typeof v === 'number' && v > 0` |
| `unitPrice` precision | `Math.round(v * 100) / 100` (rounded to 2dp before write) |
| `quantity` in range | `Number.isInteger(v) && v >= 1 && v <= 10` |
| `name` length | `typeof v === 'string' && v.length >= 1 && v.length <= 200` |
| `customizations.size` | `typeof v === 'string' && v.length >= 1 && v.length <= 50` |
| `specialInstructions` | Truncated to 200 chars server-side if longer |
| `notes` | Truncated to 500 chars server-side if longer |

**Route Parameter Validation:** All `:id` parameters are validated before querying:
```typescript
const id = parseInt(req.params.id, 10);
if (!Number.isInteger(id) || id <= 0) {
  return res.status(400).json({ data: null, error: { code: 'INVALID_ID', message: 'Invalid ID' }, status: 400 });
}
```

### 5.4 CORS Configuration

```typescript
// Development: allow Vite dev server on localhost:5173
cors({ origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173' })

// Production: same-origin requests only (Express serves both frontend and API)
// CORS header is omitted; browsers enforce same-origin policy
```

In production, the Express app serves the Vite-compiled `dist/` folder as static files on the same origin (`http://0.0.0.0:3000`). All `/api/*` requests are same-origin — no CORS header is needed or set.

### 5.5 Data Protection

| Data Type | Handling |
|-----------|----------|
| User PII | Not collected — no names, emails, or user accounts stored |
| Payment data | Not collected — no payment surface in v1 |
| Order data | Stored in SQLite with denormalized item name and customizations; no user identity linked |
| Cookies | None set — no session or tracking cookies |
| Local storage | None written — cart state is Zustand in-memory only (lost on refresh by design) |

### 5.6 Content Security

- **No inline scripts:** Vite builds produce hashed asset filenames; no `eval()` or `new Function()` used
- **TypeScript strict mode:** `"strict": true` in `tsconfig.json`; no `any` types in production code; reduces class of runtime type errors
- **No `dangerouslySetInnerHTML`:** All content rendered via React JSX; no direct HTML injection
- **SQLite file permissions:** The `data/` directory and `brewai.db` file are created at server start; should have `600` or `640` permissions in production

### 5.7 Dependency Security

- All packages sourced from `registry.npmjs.org` only
- No binary downloads via `curl` or `wget` at any stage (Dockerfile or runtime)
- `better-sqlite3` uses pre-built binaries for Node 20 on Debian; if unavailable, compiled from source using apt-installed build tools — no external binary fetch
- No runtime CDN fetches; all assets (fonts, JS, CSS) are bundled into `dist/` at build time

### 5.8 Error Handling & Information Disclosure

- **Server errors:** Full stack traces are logged to `console.error` only (server-side). The API response returns only `{ code, message }` — no stack trace is included in the JSON response.
- **User-facing messages:** Generic and non-revealing (e.g., "Could not save your order. Please try again." — not "SQLITE_CONSTRAINT error on column subtotal")
- **404 on unknown routes:** Returns a consistent JSON 404 envelope, not the default Express HTML error page

```typescript
// Global error handler — never exposes internals
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    data: null,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
    status: 500,
  });
});
```

---
