# VirtualVigyan 3.0 — Gemini & Agent Instructions

> **MANDATORY DIRECTIVE:**
> **BEFORE PROPOSING, PLANNING, OR MODIFYING ANY CODE IN THIS REPOSITORY, YOU MUST FIRST INSPECT AND FOLLOW THE GUIDELINES IN THE `.agent/` DIRECTORY.**

---

## 🧭 Mandatory Inspection Order

1. **[`.agent/conventions.md`](file:///.agent/conventions.md)** — Coding style, state machine patterns, design tokens, scoring rubrics, and the **Zero-Invisibility Mandate** (progressive enhancement, scroll reveal dual-class safety).
2. **[`.agent/known-issues.md`](file:///.agent/known-issues.md)** — Catalog of bugs, limitations, and past fixes (Issue #26 landing page collapse, Issue #23 burette guard, Issue #24 apparatus collision fixes, etc.).
3. **[`.agent/architecture.md`](file:///.agent/architecture.md)** — Architectural design of the `GenericLab` runner, apparatus system, and reaction engine.
4. **[`.agent/decisions.md`](file:///.agent/decisions.md)** — Architecture Decision Records (ADRs).
5. **[`.agent/experiment-template.md`](file:///.agent/experiment-template.md)** — Ingestion pipeline and schema for new experiments.

---

## ⚠️ Critical Rules

1. **Zero-Invisibility Mandate (UI & Scroll Animations):**
   - Never hide content permanently with `opacity: 0` without dual CSS selectors (`.visible` and `.active`) and an automatic fallback timeout.
2. **"Fix Once, Fix All" Rule:**
   - Mechanical fixes (bench placement, glassware rendering, timers, stopcocks, calculation forms) must be made in `src/components/GenericLab/` or `src/engine/`, NOT repeated across individual experiment files.
3. **Build & Lint Cleanliness:**
   - Always run `npm run build` to confirm 0 compilation errors before marking any task complete.
