---

### R2: Production Polish — "Responsive Quality & Premium Animations"

**Theme:** The ordering loop from R1 becomes a production-quality experience — mobile-optimized layouts, polished transitions, and accessibility refinements that convert the app from functional to delightful.

**Rationale:** R2 contains all P1 stories (F5 and F6). These are required for production quality and are implemented alongside R1, not deferred past v1. They address the journey cross-patterns CP-01 through CP-06 identified in JOURNEYS-BrewAI.md. R2 stories do not add new flows — they elevate the quality of R1 flows.

**Stories (8 stories — all P1):**

| SM-ID | Story | Feature | Personas Served |
|---|---|---|---|
| SM-5.1 | US-5.1: Mobile Compact Header | F5 | PER-02 (primary), all |
| SM-5.2 | US-5.2: Responsive Menu Grid | F5 | PER-03 (primary), all |
| SM-5.3 | US-5.3: Full-Screen Cart on Mobile | F5 | PER-02 (primary), all |
| SM-5.4 | US-5.4: Touch Targets on Mobile | F5 | PER-02 (primary), PER-03 |
| SM-6.1 | US-6.1: Card Entrance Animations | F6 | PER-01 (primary), PER-03 |
| SM-6.2 | US-6.2: Modal and Drawer Transitions | F6 | PER-03 (primary), PER-01 |
| SM-6.3 | US-6.3: Feedback Toasts on Add to Cart | F6 | PER-02 (primary), all |
| SM-6.4 | US-6.4: Reduced Motion Support | F6 | All users |

**Personas served:** All three personas benefit; PER-02 (Priya) is the primary canary for F5 quality; PER-01 (Marcus) and PER-03 (Jordan) are primary beneficiaries of F6 animations.

**JTBD further addressed in R2:**
- JTBD-02.1 ✓ complete (US-5.1, US-5.3, US-5.4 close the mobile performance gap)
- JTBD-01.2 ✓ complete (US-6.1 — premium UI signals craft quality with staggered animations)
- JTBD-03.1 ✓ complete (US-6.1 — staggered card entrance, US-5.2 — responsive grid reduces overwhelm)
- JTBD-03.2 ✓ complete (US-6.2 — modal transitions confirm premium feel)
- JTBD-03.3 ✓ complete (US-6.2 — confirmation entrance animation; on-brand visual experience)

**Cross-journey patterns closed in R2:**
- CP-02 (Instant Category Filtering) — US-5.2 + US-6.1 ensure animations don't block filter speed
- CP-03 (Mobile Touch Target Adequacy) — US-5.4 enforces 44×44px across all controls
- CP-05 (Premium Aesthetic Signalling) — US-6.1, US-6.2 deliver the delight moments
- CP-06 (Confirmation Screen Above-Fold) — US-5.3 ensures full-screen cart + confirmation layout on mobile

**v1 Shippable Gate:** R1 + R2 together constitute the full v1 release. No story is deferred beyond R2.

---
