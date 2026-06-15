---

## Flow-00: Menu Browse & Filter

**User Stories:** US-1.1, US-1.2, US-1.3, US-1.4, US-1.5
**Journeys:** JRN-01.1 (stages 1–3), JRN-01.2 (stage 1), JRN-02.1 (stages 1–2), JRN-03.1 (stages 1–5)
**Entry:** User navigates to `/` (app load)
**Exit:** User clicks "Customize" → opens Flow-01 | User clicks "Add to Cart" → item added, toast shown

```
[App Load: GET /api/menu]
         │
         ▼
  [Skeleton: 8 card placeholders]
         │
    ┌────┴────┐
   API       API
  Success   Failure
    │           │
    ▼           ▼
[Menu Grid]  [Error State]
[Filter Bar]  "Could not load the menu."
[Search]      [Retry] → re-invoke fetchMenu()
    │
    ├── User types in search
    │       │ 200ms debounce
    │       ▼
    │   [Filter: name/description match]
    │
    ├── User clicks category pill
    │       │ immediate, client-side
    │       ▼
    │   [Filter: category match]
    │
    ├── Both filters active → AND logic
    │
    ├── Results found?
    │   ├── YES → Render filtered card grid
    │   └── NO  → [Empty State]
    │              "No drinks match your search"
    │              [Clear Filters] → reset both
    │
    ├── User clicks [Customize] on card
    │       └──▶ Flow-01 (Customization Modal)
    │
    └── User clicks [Add to Cart] on card
            └──▶ cartStore.addItem() (defaults)
                 Toast: "[Drink] added to cart"
                 Cart badge pops (scale keyframe)
```

### Steps Detail

**Step 1 — App Load & Skeleton**
- `GET /api/menu` fires on mount
- 8 skeleton cards render immediately in grid layout
- Skeleton: `bg-#1C1C1C` pulsing animation, same dimensions as real cards
- No content shift when real cards appear (same grid slots)

**Step 2 — Menu Grid Renders**
- Items sorted by `sortOrder` ASC
- Cards animate in: staggered `fadeIn + slideUp`, 200ms per card, 50ms stagger
- Category filter bar renders pills derived from API data (not hardcoded)
- "All" pill is always first, active by default (amber accent, selected style)

**Step 3 — Category Filter**
- Single-select: clicking a pill activates it; clicking active pill resets to "All"
- Filter is client-side (no API call)
- Card grid re-animates via `AnimatePresence mode="popLayout"`: exiting cards fade out, entering cards slide in
- Active pill: `border-accent, box-shadow: 0 0 0 1px rgba(200,146,42,0.25), text-#F5F0E8`
- Inactive pill: `border-#2A2A2A, text-#9A9080`

**Step 4 — Keyword Search**
- Search input at top of page, placeholder: "Search drinks…"
- Filters by `name` AND `description`, case-insensitive substring match
- 200ms debounce on keystrokes
- Combined with category filter using AND logic
- Clearing the field restores prior category-filtered view immediately

**Step 5 — Empty State**
- Shown when both filter + search yield zero results
- If API returns empty array: "No drinks available yet." (no Clear Filters button)
- If filter/search eliminates all: "No drinks match your search." + [Clear Filters]
- [Clear Filters] resets `activeCategory = 'All'` and `searchQuery = ''`

**Step 6 — Error State**
- Replaces skeleton entirely (no skeleton shown alongside error)
- Shows: "Could not load the menu. Please try again." + [Retry] button
- [Retry] re-invokes `fetchMenu()`, shows skeleton again during in-flight request

---
