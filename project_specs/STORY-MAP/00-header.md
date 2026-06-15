# Story Map
# BrewAI — Specialty Coffee Shop Web Application

| Field | Value |
|---|---|
| **Product Name** | BrewAI |
| **Version** | 1.0 |
| **Date** | 2026-06-15 |
| **Related Personas** | PERSONAS-BrewAI.md (PER-01, PER-02, PER-03) |
| **Related JTBD** | JTBD-BrewAI.md |
| **Related Journeys** | JOURNEYS-BrewAI.md |
| **Related User Stories** | UserStories-BrewAI.md |
| **Related PRD** | PRD-BrewAI.md |
| **Status** | Active |

---

## Overview

This Story Map organises all 36 BrewAI user stories into a two-dimensional grid:

- **X-axis (columns):** Journey stages derived from JOURNEYS-BrewAI.md — the shared backbone all three personas traverse
- **Y-axis (rows):** Activities and stories within each stage, grouped by Epic (F0–F7)
- **NaC column:** Natural Acceptance Criteria — testable criteria derived from the intersection of a JTBD outcome, a journey stage, and the specific story being mapped
- **Release column:** Increment assignment (R1 = MVP/P0 core loop, R2 = MVP/P0 complete, R3 = Production polish/P1)

### NaC Concept

NaC (Natural Acceptance Criteria) bridges *why* a story matters (JTBD outcome) to *what* confirms it works (testable criterion). Every NaC in this document is derived from a specific JTBD outcome applied to the journey stage context — none are invented.

**Derivation format:** `JTBD-XX.Y [outcome] → [journey stage context] → testable criterion`

### Story Map ID Convention

Map entries use: `SM-{Epic}.{NN}` (e.g., SM-0.1 = Epic 0 first entry, SM-1.1 = Epic 1 first entry)

### Shared Journey Backbone

All three personas traverse the same core guest ordering flow. Journey stages (column headers) are derived from the cross-journey pattern:

| Stage | Description | Key Journeys |
|---|---|---|
| **S0: Foundation** | Design system + API — invisible infrastructure enabling every other stage | All |
| **S1: Land & Orient** | User arrives at the menu page; first impression and visual quality | JRN-01.1, JRN-01.2, JRN-02.1, JRN-03.1 |
| **S2: Browse & Filter** | User scans menu, applies category filter or keyword search | JRN-01.1, JRN-01.2, JRN-02.1, JRN-03.1 |
| **S3: Select & Customize** | User opens customization modal, configures drink attributes | JRN-01.1, JRN-01.2, JRN-02.1, JRN-02.2, JRN-03.1, JRN-03.2 |
| **S4: Cart & Recovery** | User reviews cart, adjusts, corrects mistakes | JRN-01.1, JRN-02.1, JRN-02.2, JRN-03.2 |
| **S5: Place & Confirm** | User places order; confirmation screen appears | JRN-01.1, JRN-02.1, JRN-03.2 |
| **S6: Polish & Access** | Responsive layout, animations, accessibility overlays — quality layer | All |

---
