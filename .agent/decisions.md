# VirtualVigyan — Architectural Decision Records

Settled decisions. Do not re-litigate these unless explicitly asked by the developer.

---

## ADR-001: 2D SVG over 3D (Three.js / WebGL)

**Chose:** 2D SVG + absolutely positioned elements  
**Over:** Three.js, Babylon.js, or any WebGL/3D library  
**Because:**
- The pitch deck mentions Three.js for a future production vision, but the current build intentionally proves the interaction model in 2D first.
- Target devices are low-end tablets and laptops — WebGL support and GPU performance can't be assumed.
- 2D gives precise control over liquid levels, color interpolation, and apparatus positioning without the complexity overhead of a 3D scene graph.
- This is the **design target**, not a compromise. If asked: *"The current build is 2D by design — 3D is on our roadmap as an enhancement, not a blocker."*

**Status:** Final. Do not add 3D libraries unless requested for specialized VR modes.

---

## ADR-002: `@dnd-kit/core` over HTML5 Drag and Drop API

**Chose:** `@dnd-kit/core`  
**Over:** Native HTML5 drag-and-drop, `react-dnd`, `react-beautiful-dnd`  
**Because:**
- HTML5 DnD has terrible touch support — the entire platform pitch depends on working on touch devices.
- `@dnd-kit` provides `TouchSensor` and `PointerSensor` out of the box with configurable activation constraints.
- Lightweight, tree-shakeable, well-maintained, and React-native.
- `react-beautiful-dnd` is deprecated/unmaintained.

**Status:** Final.

---

## ADR-003: `useReducer` per experiment — no external state library

**Chose:** Plain React `useReducer` with one reducer per experiment  
**Over:** Redux, Zustand, Jotai, MobX  
**Because:**
- Each experiment is a self-contained state machine with a linear step flow. There's no cross-experiment shared state, no server sync, no persistence.
- Adding a state library for this is pure overhead — the reducer pattern already gives us action-based transitions, immutable state updates, and easy debugging.
- When/if the app grows to 10+ experiments with shared user state, revisit this — not before.

**Status:** Final for current scope.

---

## ADR-004: No backend — static SPA only

**Chose:** Client-only static SPA  
**Over:** NestJS + PostgreSQL + Redis (pitch deck's production stack)  
**Because:**
- This is a demo/MVP proving the interaction model, not a production platform.
- Zero-server means deploy anywhere: Cloudflare Pages, Render, Vercel, Netlify, GitHub Pages.
- No auth, no user accounts, no cross-device sync needed for the demo.
- Backend is deferred to a future phase when the experiment library grows and needs persistence.

**Status:** Final for demo phase.

---

## ADR-005: Deterministic rule-based validation — not AI/ML

**Chose:** Explicit threshold checks in TypeScript functions  
**Over:** ML models, LLM-based evaluation, "AI-powered" anything  
**Because:**
- The validation logic is a small, finite set of rules (wrong drop zone → reject, endpoint before color change → block, overshoot > 27 mL → warn). These are trivially expressible as if/else checks.
- Calling this "AI-powered" would be misleading and has been explicitly prohibited in the project spec.
- Deterministic = predictable, testable, debuggable, zero runtime cost.
- **HARD RULE:** Never label any validation, scoring, or mistake detection as "AI", "ML", "intelligent", or "smart" in UI copy, comments, README, or any user-facing text.

**Status:** Final. Non-negotiable.

---

## ADR-006: Tailwind CSS v4 (not vanilla CSS or other frameworks)

**Chose:** Tailwind CSS v4 with `@tailwindcss/vite` plugin  
**Over:** Vanilla CSS, CSS Modules, Styled Components, Emotion  
**Because:**
- Utility-first approach speeds up UI iteration.
- v4's Vite plugin provides zero-config integration.
- Design tokens are still defined as CSS custom properties in `index.css` for global consistency.
- Component-level styles use a mix of Tailwind utilities and inline styles (especially for dynamic SVG positioning).

**Status:** Final.

---

## ADR-007: OxLint over ESLint

**Chose:** OxLint  
**Over:** ESLint  
**Because:**
- OxLint is Rust-based — dramatically faster for large codebases.
- Sufficient rule coverage for React hooks (`rules-of-hooks: error`) and component exports.
- ESLint config complexity wasn't justified for this project size.

**Status:** Final.

---

## ADR-008: TypeScript `erasableSyntaxOnly` mode

**Chose:** `erasableSyntaxOnly: true` in tsconfig  
**Over:** Traditional TypeScript with enums, namespaces, parameter properties  
**Because:**
- TypeScript 6 encourages this for forward compatibility and simpler transpilation.
- Enums are replaced with `as const` objects (see `Step` and `ConservationStep`).
- This means: **no `enum` keyword, no `namespace`, no parameter properties.** Use `as const` objects + type inference instead.

**Status:** Final. Do not introduce `enum` or `namespace`.

---

## ADR-009: Per-experiment component isolation

**Chose:** Separate component trees per experiment (`components/conservation/`)  
**Over:** Shared/generic components with experiment-specific props  
**Because:**
- Experiments have fundamentally different apparatus, interactions, and visuals. Trying to genericize a "Flask" component that works for both titration and conservation would create an unmaintainable abstraction.
- Shared logic lives in `src/engine/` (state machines, chemistry rules). UI components are intentionally experiment-specific.
- If patterns emerge across 5+ experiments, extract shared primitives then — not preemptively.

**Status:** Final for current scope.

---

## ADR-010: Dev server on port 5174 with `strictPort`

**Chose:** Hardcoded port 5174  
**Over:** Default 5173 or dynamic port  
**Because:**
- Avoids conflicts with other Vite projects that default to 5173.
- `strictPort: true` ensures the dev server fails fast if the port is occupied, rather than silently picking another port (which breaks bookmarks and muscle memory).

**Status:** Final.

---

## ADR-011: Config-Driven Experiment Engine for Scaling to 40 Experiments

**Chose:** A data-driven generic engine blueprint (`src/engine/experimentConfig.ts`, `GenericLab.tsx`, standardized SVG apparatus library) where each new experiment is defined by a single TypeScript/JSON configuration file (~250 lines).  
**Over:** 
1. *Full Free-Form Sandbox with unconstrained creative freedom:* While appealing conceptually, unconstrained chemical sandboxes result in chaotic physics bugs, lack curriculum-aligned pedagogical steps, cannot deterministically grade student calculations, and consume excessive tokens to debug.
2. *Building 40 bespoke hardcoded React component trees:* Writing 15–20 files and 2,500+ lines of custom React/TypeScript per experiment would require weeks of work, burn millions of tokens on repetitive DnD/state boilerplate, and duplicate bugs across experiments.

**Key Architecture Rules:**
- **Zero React Code for New Experiments:** To create experiment #3 through #40, an agent or developer only creates `src/experiments/<name>.ts` conforming to `ExperimentConfig` and imports it into `src/experiments/index.ts`.
- **Existing Experiments Preserved:** Legacy experiments #1 (Titration) and #2 (Conservation of Mass) are 100% preserved and untouched to maintain backward compatibility.
- **Rich Visuals & Zoomed-in Lab Bench:** Apparatus is scaled up to comfortably fill the screen. The bench features a realistic 3D-styled laboratory countertop, authentic wooden rack apparatus, vivid blue-tinted translucent liquids, dynamic effervescence bubble animations, and visual reaction callouts.
- **Explicit Step Advance Control:** When an experiment step involves observing a reaction or testing a gas, `advanceMode: 'button'` MUST be used so the user can see the reaction effects (flames, bubbles, color changes) and choose when to complete or proceed to questions.

**Status:** Final. This is the foundation for all upcoming curriculum experiments.

---

## ADR-012: Centralized "Fix-Once, Fix-All" Generic Engine Architecture & Curriculum Folders

**Chose:** Centralized engine handling for all interactive state, drag-and-drop mechanics, observation pauses, worked calculation validation, and dark theme support, organized by curriculum folders (`src/experiments/fy-dbatu/` and `src/experiments/`).  
**Over:** Experiment-specific state reducers or individual ad-hoc fixes in separate experiment files.  
**Because:**
- **Zero Maintenance Duplication ("Fix Once, Fix All"):** When any user reports a bug (e.g. drop sensor deadzone, premature step advancement, calculation tolerance precision, liquid contrast, or layout responsiveness), the fix is implemented once in `src/components/GenericLab/` or `src/engine/`. This immediately and automatically fixes all 40+ experiments without touching 40 individual files.
- **Rapid Ingestion:** New experiments can be created directly from natural language specifications in minutes by writing single declarative config files.
- **Curriculum Organization:** University-level engineering chemistry practicals (such as DBATU F.Y. B.Tech) reside in `src/experiments/fy-dbatu/`, distinct from secondary school NCERT Class 9–12 practicals, while both leverage the exact same unified simulation engine.

**Status:** Final.

---

## ADR-013: 3D Virtual Reality Lab Architecture (WebXR & Google Cardboard Phone VR)

**Chose:** Three.js-powered 3D laboratory environment supporting dual execution pathways (Desktop 3D, Phone VR Cardboard stereoscopy with gyroscope head tracking & gaze-dwell, and 6-DOF WebXR motion controllers), added additively without modifying existing 2D experiments.  
**Over:** Rewriting existing 2D experiments or depending solely on dedicated WebXR headsets (Quest/Pico).  
**Because:**
- **Accessibility for Indian Students:** Many students access virtual labs using mobile smartphones and budget phone headsets like Google Cardboard. Providing stereoscopic dual-viewport rendering with mobile gyroscope orientation and gaze-dwell reticles enables true VR experiences without requiring costly standalone headsets.
- **Motion Controller Parity:** WebXR `immersive-vr` session support with 6-DOF controller tracking, raycasting pointers, and haptic actuator vibrations ensures cutting-edge immersion when accessed via high-end VR headsets.
- **Non-Destructive Additive Design:** The legacy 2D Conservation of Mass lab and all engine experiments remain 100% untouched and functional, accessible alongside the new 3D VR mode.

**Status:** Final.



