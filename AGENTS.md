# VirtualVigyan 3.0 — AI Agent Instructions & Contributor Protocol

> **CRITICAL MANDATE FOR ALL AI AGENTS & CONTRIBUTORS:**
> **BEFORE PROPOSING, PLANNING, OR MODIFYING ANY CODE IN THIS REPOSITORY, YOU MUST FIRST READ AND FOLLOW THE GUIDELINES IN THE `.agent/` DIRECTORY.**
>
> Failure to read `.agent/` first causes preventable regressions (such as blanking out UI sections, broken state machines, or duplicated experiment logic).

---

## 🧭 Step 1: Mandatory Reading Order in `.agent/`

Before starting any task, read these documents located in the [`.agent/`](file:///.agent/) directory:

1. **[`.agent/conventions.md`](file:///.agent/conventions.md)**  
   - Code style, naming conventions, directory structure, commit formatting (`type(scope): description`).
   - **UI & Scroll-Animation Safety Rules (The Zero-Invisibility Mandate)**: Rules on dual-class synchronization (`.visible` + `.active`), progressive fallbacks, and preventing collapsed/invisible DOM sections.
   - **"Fix Once, Fix All" Rule**: Engine and bench improvements MUST be applied centrally in `src/components/GenericLab/` or `src/engine/`, never duplicated across individual experiment configs.
   - State machine, scoring rubric, and apparatus conventions.

2. **[`.agent/known-issues.md`](file:///.agent/known-issues.md)**  
   - Catalog of known bugs, architectural limitations, and past resolved issues (e.g. Issue #26 Landing Page Visibility Collapse, Issue #23 Burette Filling Guard, Issue #24 Apparatus Collision Fixes).
   - Check this file FIRST when diagnosing unexpected behavior to avoid repeating solved mistakes.

3. **[`.agent/architecture.md`](file:///.agent/architecture.md)**  
   - Comprehensive technical architecture: `GenericLab` runner, DnD interaction layer (`@dnd-kit`), SVG apparatus library, and deterministic stoichiometry/reaction engine.

4. **[`.agent/decisions.md`](file:///.agent/decisions.md)**  
   - Architectural Decision Records (ADRs) detailing why specific libraries and architectural patterns were chosen.

5. **[`.agent/experiment-template.md`](file:///.agent/experiment-template.md)**  
   - Required schema, step lifecycle, and rubric rules when adding new NCERT (school) or DBATU (university) experiments.

6. **[`.agent/context.md`](file:///.agent/context.md)** & **[`.agent/roadmap.md`](file:///.agent/roadmap.md)**  
   - Project mission, pedagogical objectives, and upcoming milestones.

---

## ⚠️ Core Architectural Principles

### 1. The Zero-Invisibility Mandate (Never Hide Content Permanently)
- Any CSS transition or scroll-reveal animation (e.g. `.ln-reveal`) MUST have dual selectors in CSS:
  ```css
  .ln-reveal.visible,
  .ln-reveal.active {
    opacity: 1;
    transform: translateY(0);
  }
  ```
- Every JavaScript `IntersectionObserver` controlling element visibility MUST:
  - Add BOTH `.visible` and `.active` to `classList`.
  - Check for `IntersectionObserver` support and gracefully fallback immediately.
  - Include a safety fallback timer (`setTimeout` 1000ms–1500ms) ensuring elements are revealed even during fast scrolling, print export, or delayed observer ticks.
  - Include `@media (prefers-reduced-motion: reduce)` and `@media print` resetting `opacity: 1; transform: none;`.

### 2. The "Fix Once, Fix All" Rule
- When improving interaction mechanics (e.g. liquid level indicators, burette stopcocks, observation popups, tooltips, drag hitboxes, calculation grading), **DO NOT patch individual experiment files**.
- Apply fixes centrally to `src/components/GenericLab/` or `src/engine/`. All experiments execute through `GenericLab`, ensuring all 10+ experiments automatically benefit from the fix.

### 3. Separation of Concerns
- **`src/engine/`**: Pure TypeScript logic, state machines, stoichiometry, reaction databases, and chemistry formulas. **NO React, NO DOM, NO JSX**.
- **`src/apparatus/`**: Standardized, clean SVG visual components with high visual contrast in both Light and Dark modes.
- **`src/components/GenericLab/`**: Workbench canvas, apparatus placement, drag-and-drop zones, stopcock interaction, and action runners.
- **`src/components/landing/`**: The public landing page. Scoped with `.ln-` CSS classes, responsive across mobile/desktop, supporting both Light and Dark themes.

### 4. Build & Visual Verification
- Before finishing any task, run `npm run build` to ensure 0 TypeScript or Vite build errors.
- Visually verify modified components across both Light and Dark themes.
