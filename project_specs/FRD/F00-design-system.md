---

## F00: Design System & Component Foundation

**Priority:** P0  
**Depends on:** None  
**Required by:** F01, F02, F03, F04, F05, F06

---

### Description

The design system is the shared visual and interactive language that all other features consume. It defines every color token, typography scale, spacing unit, border radius, and animation duration exactly once — in `tailwind.config.ts` and a small set of primitive React components. All downstream features reference these primitives exclusively; no feature file may hardcode a color value, font family, or radius outside the Tailwind config. Inter and Playfair Display fonts are bundled as local static assets so they are never fetched from an external CDN at runtime.

---

### Terminology

- **Design Token:** A named variable (color, spacing, radius, font) that maps a semantic name to a concrete value. Tokens are defined in `tailwind.config.ts` under `theme.extend`.
- **Primitive Component:** A thin, styled wrapper around an HTML element (`Button`, `Input`, `Badge`, `Card`, `Modal`, `Spinner`, `Select`) that enforces the design system and exposes a typed props API.
- **Variant:** A named style permutation of a primitive component (e.g., `Button` variants: `primary`, `secondary`, `ghost`, `danger`).
- **Motion Variant:** A Framer Motion `variants` object defining `initial`, `animate`, and `exit` states for a shared animation (e.g., `fadeIn`, `slideUp`, `scaleIn`).
- **Focus Ring:** The 2px solid amber outline (`#C8922A`) applied on `:focus-visible` to all interactive elements for keyboard accessibility.

---

### Sub-Features

- **F00.1 — Tailwind Config Extension:** All design tokens defined in `tailwind.config.ts`; no hardcoded values outside this file.
- **F00.2 — Font Bundling:** Inter and Playfair Display served from the Express static `/assets/fonts/` path; declared in a global CSS `@font-face` block.
- **F00.3 — Primitive Components:** `Button`, `Badge`, `Card`, `Input`, `Select`, `Modal`, `Spinner` implemented as typed React components.
- **F00.4 — Global Base Styles:** `<html>` and `<body>` set to `background: #0A0A0A`; default font `Inter`; `box-sizing: border-box`; smooth scroll.
- **F00.5 — Shared Motion Variants:** Framer Motion `variants` objects exported from a single `src/lib/motion.ts` file for use across all features.
- **F00.6 — Focus Ring Global Style:** Tailwind `ring` utilities configured; all interactive elements receive `focus-visible:ring-2 focus-visible:ring-accent` via component defaults.

---

### Process

1. At build time, Vite processes `tailwind.config.ts`; all custom tokens become available as Tailwind utility classes (e.g., `bg-canvas`, `text-primary`, `border-accent`).
2. The global CSS file (`src/index.css`) declares `@font-face` rules pointing to `/assets/fonts/inter-*.woff2` and `/assets/fonts/playfair-*.woff2`.
3. Express serves `/assets/fonts/` as a static directory so fonts load over HTTP from the same origin.
4. On first render, React initializes the component tree using only design-system primitives — no raw `<div style={{...}}>` with hardcoded values.
5. Any interactive element rendered by a primitive automatically receives the focus ring via the shared `className` prop defaults.
6. Any animated element imports its `variants` from `src/lib/motion.ts` and wraps content in a `motion.*` component.

---

### Inputs

- `tailwind.config.ts` — defines all color, font, radius, and spacing tokens
- Font files (`.woff2`) — placed in `public/assets/fonts/` and copied to `dist/assets/fonts/` by Vite
- Component prop types — each primitive exports a TypeScript `interface` defining its accepted props

---

### Outputs

- Extended Tailwind utility classes available globally across all TSX files
- Bundled font files served at `/assets/fonts/*.woff2`
- Typed primitive component exports from `src/components/ui/index.ts`
- Shared motion variants exported from `src/lib/motion.ts`

---

### Primitive Component Specifications

#### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and padding |
| `disabled` | `boolean` | `false` | Disables interaction; applies opacity |
| `loading` | `boolean` | `false` | Shows `Spinner`; disables interaction |
| `onClick` | `() => void` | — | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `className` | `string` | `''` | Additional Tailwind classes |
| `children` | `ReactNode` | — | Button label/content |

- `primary`: `bg-accent text-canvas font-semibold hover:bg-amber-600 active:scale-[0.97]`
- `secondary`: `bg-surface-raised text-primary border border-border hover:border-accent`
- `ghost`: `bg-transparent text-muted hover:text-primary`
- `danger`: `bg-error/10 text-error border border-error/30 hover:bg-error/20`
- Min height: `44px` on all sizes (touch target compliance)

#### Badge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'accent' \| 'muted' \| 'success' \| 'error'` | `'accent'` | Color variant |
| `children` | `ReactNode` | — | Badge label |

- Border radius: `20px` (pill)
- Font: Inter, 12px, semibold

#### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional Tailwind classes |
| `onClick` | `() => void` | optional | Makes card interactive (adds hover state) |
| `children` | `ReactNode` | — | Card content |

- Background: `#141414`; border: `1px solid #2A2A2A`; border-radius: `12px`; padding: `16px`

#### Input

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Visible label above input |
| `error` | `string` | — | Validation error message below input |
| `placeholder` | `string` | — | Placeholder text |
| `value` | `string` | — | Controlled value |
| `onChange` | `(e) => void` | — | Change handler |
| `maxLength` | `number` | — | Character limit |
| `type` | `string` | `'text'` | HTML input type |

- Border-radius: `6px`; border: `1px solid #2A2A2A`; background: `#141414`; text: `#F5F0E8`
- Focus: `ring-2 ring-accent`; error: `border-error`

#### Select

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Visible label |
| `options` | `{ value: string; label: string }[]` | — | Options list |
| `value` | `string` | — | Selected value |
| `onChange` | `(value: string) => void` | — | Change handler |

#### Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Called on Escape or backdrop click |
| `title` | `string` | — | Modal heading |
| `children` | `ReactNode` | — | Modal body content |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Max-width variant |

- Backdrop: `bg-canvas/80 backdrop-blur-sm`; modal: `bg-surface-raised rounded-[12px]`
- `Escape` keydown calls `onClose`; backdrop click calls `onClose`
- Focus trapped inside modal while open

#### Spinner

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Icon size |
| `className` | `string` | `''` | Additional classes |

- Renders an animated SVG ring using `animate-spin`; color `text-accent`

---

### Validation

- No raw color hex values (`#...`) in `.tsx` or `.ts` files outside `tailwind.config.ts` and `src/index.css`
- All font references use the Tailwind font-family utility (`font-display`, `font-body`), never inline `fontFamily` style props
- TypeScript strict mode is enabled (`"strict": true` in `tsconfig.json`); all component props are explicitly typed
- No `any` type in production code (enforced via TSConfig; `@ts-expect-error` only as last resort with comment)
- Each primitive component has a default `aria-label` or expects one via props for icon-only variants

---

### Error States

| Scenario | Behavior | User-Facing Message |
|----------|----------|---------------------|
| Font files missing from `/assets/fonts/` | Browser falls back to system sans-serif; no hard error | (silent fallback — no user message) |
| Component rendered without required prop | TypeScript compile error prevents build | Build fails with type error |
| Tailwind class purged in production | Element renders unstyled | (visual regression — caught by visual testing) |

---

### API Surface (this feature)

None — F00 is a frontend-only concern. No API endpoints.

---

### Schema Surface (this feature)

None — F00 does not interact with the database.

---
