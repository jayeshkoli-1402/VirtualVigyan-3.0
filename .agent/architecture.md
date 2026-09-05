# VirtualVigyan — Architecture

## High-Level Structure

The platform is a static client-side React SPA with two co-existing architectures:
1. **Legacy Hardcoded Experiments** (Titration, Conservation) — Kept untouched for backwards compatibility.
2. **Generic Experiment Engine** (⚡ New Architecture) — Built to scale to 40+ NCERT/CBSE experiments with zero new React component code per experiment.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Static SPA (React 19 + Vite 8)                          │
│                                                                                        │
│   index.html → main.tsx → App.tsx (Root Router + Experiment Switcher)                  │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                              Experiment Selector                               │   │
│   │   • Legacy Experiments: Titration (#1), Conservation (#2)                      │   │
│   │   • ⚡ New Engine Experiments: Zinc + Acid, + 39 upcoming curriculum configs   │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
│                                           │                                            │
│            ┌──────────────────────────────┴──────────────────────────────┐             │
│            ▼                                                             ▼             │
│   [Legacy Experiments]                                      [GenericLab Engine]        │
│   • Titration (custom LabBench, custom state)               • GenericLab.tsx           │
│   • Conservation (ConservationLabBench, custom state)         ├── GenericToolbox.tsx   │
│                                                               ├── GenericBench.tsx     │
│                                                               ├── GenericInstructions  │
│                                                               ├── GenericCalculation   │
│                                                               └── GenericResults.tsx   │
│                                                                          │             │
│                                                                          ▼             │
│                                                              ┌──────────────────────┐  │
│                                                              │ Experiment Registry  │  │
│                                                              │ (src/experiments/)   │  │
│                                                              └──────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## The Generic Experiment Engine

The engine lives in `src/engine/`, `src/apparatus/`, `src/components/GenericLab/`, and `src/experiments/`.

### 1. Engine Core (`src/engine/`)

| File | Purpose |
|------|---------|
| `experimentConfig.ts` | **Type schema** defining apparatus, drop zones, steps, interactions, effects, chemistry rules, scoring rubrics, and initial state. |
| `experimentRunner.ts` | **Generic state machine & reducer factory**. Implements `createExperiment(config)` which yields `[reducer, initialState]` dynamically without boilerplate. Handles drops, clicks, effects, animations, and step progression. |
| `chemistryLib.ts` | **Pure chemistry function library**. Includes color models (phenolphthalein, litmus, methyl orange, universal indicator, precipitate shades) and calculation compute functions. |
| `scoringEngine.ts` | Evaluates student answers against formula tolerances and computes rubric breakdown scores (0–100). |
| `validationEngine.ts` | Evaluates prerequisite conditions and guard rules before allowing apparatus drops or clicks. |

### 2. Apparatus SVG Library (`src/apparatus/`)

Central registry mapping component string names to high-quality responsive SVG components accepting standardized `ApparatusProps`:

- `ConicalFlask`
- `Beaker`
- `TestTube` — Features volume graduation ticks, borosilicate glass specular streaks, curved liquid meniscus, metallic zinc pieces, animated rising bubbles (effervescence), vapor wisps, and POP flame reaction burst.
- `BuretteSVG`
- `PipetteSVG`
- `BunsenBurner`
- `DropperBottle`
- `ReagentBottle`
- `RetortStand`
- `DigitalBalanceSVG`
- `RubberCork`
- `Thermometer`
- `WireGauze`
- `Tripod`
- `EvaporatingDish`
- `WatchGlass`
- `GlassRod`
- `TestTubeStand` — 2-tier realistic wooden test tube rack with beveled holes, recessed bottom cups, upright joinery posts, and drying pegs.

### 3. Generic Lab UI (`src/components/GenericLab/`)

Renders any experiment purely from its `ExperimentConfig`:
- `GenericLab.tsx`: Main orchestrator with `@dnd-kit/core` context, responsive 3-panel layout, and view router (Lab Bench ↔ Calculations ↔ Results).
- `GenericBench.tsx`: 3D-styled laboratory workbench with reflection plane, front bevel edge, cabinet apron, drop zones, apparatus rendering, and active reaction observation banners.
- `GenericToolbox.tsx`: Collapsible left drawer showing available reagents and apparatus with icons.
- `GenericInstructions.tsx`: Step instructions, dynamic callouts, step checklist progress, mistake toast alerts, and manual advance buttons.
- `GenericCalculation.tsx`: Config-driven calculation questions with input fields, units, and instant answer validation.
- `GenericResults.tsx`: Score breakdown cards, animated count-up gauge, feedback, and return-to-selector button.

### 4. Experiment Registry & Curriculum Folders (`src/experiments/`)

- `index.ts`: Central aggregator exporting `getAllExperiments()`, `getExperimentById(id)`, and `getExperimentsByClass()`.
- `zinc-acid-reaction.ts`: NCERT Class 10 reference configuration.
- `fy-dbatu/`: Dedicated module for Dr. Babasaheb Ambedkar Technological University (DBATU) F.Y. B.Tech Engineering Chemistry practicals:
  - `viscosity-ostwald.ts`: Exp 1 — Viscosity by Ostwald's Viscometer
  - `ph-metric-titration.ts`: Exp 3 — pH-Metric Titration (HCl vs NaOH)
  - `conductometric-titration.ts`: Exp 4 — Conductometric Titration of Strong Acid & Base
  - `chloride-mohr-method.ts`: Exp 5 — Chloride Content by Mohr's Method
  - `water-acidity.ts`: Exp 6 — Acidity of Water Sample (Mineral & Total)
  - `water-alkalinity.ts`: Exp 7 — Alkalinity of Water Sample (P & M)
  - `acid-value-oil.ts`: Exp 8 — Acid Value of Vegetable Oil
  - `dissolved-oxygen-winkler.ts`: Exp 9 — Dissolved Oxygen by Winkler's Method
  - `water-hardness-edta.ts`: Exp 10 — Water Hardness by EDTA Chelation
  - `index.ts`: Aggregator exporting `dbatuExperiments`

---

## ⚡ The "Fix Once, Fix All" Architecture Principle

VirtualVigyan follows a strict **Separation of Concerns: Data vs. Engine**:

1. **Experiments are Pure Declarative Data:** Each experiment config file contains ZERO React components, ZERO DOM manipulation, and ZERO event handlers. It is purely an `ExperimentConfig` data specification.
2. **Engine is Centralized:** All drag-and-drop mechanics, drop detection, validation guardrails, visual animations, button-advance step management, calculation input verification, and scoring gauge UI are centralized in:
   - `src/components/GenericLab/` (`GenericLab.tsx`, `GenericBench.tsx`, `GenericToolbox.tsx`, `GenericInstructions.tsx`, `GenericCalculation.tsx`, `GenericResults.tsx`)
   - `src/engine/` (`experimentRunner.ts`, `scoringEngine.ts`, `validationEngine.ts`, `chemistryLib.ts`)
   - `src/apparatus/` (`index.tsx`)
3. **Automatic Global Bug Fixes:**
   - **NEVER** write experiment-specific UI workarounds or hack individual experiment configs when fixing behavior bugs.
   - If a bug occurs (e.g. drop target sensitivity, step skip guard, liquid visibility, timer freezing, or calculation grading tolerance), **FIX IT IN THE GENERIC ENGINE**.
   - Because all experiments execute through `GenericLab` and `experimentRunner.ts`, fixing the bug once in the engine **AUTOMATICALLY FIXES ALL 40+ EXPERIMENTS SIMULTANEOUSLY** with zero code duplication!

---

## Dark Theme Architecture

The platform supports native dynamic theming (Dark / Light mode):
- **Tokens:** CSS custom properties defined in `src/index.css` under `:root` and `:root.dark, [data-theme="dark"]`.
- **Theme Persistence:** Managed in `App.tsx` via `localStorage.getItem('vv_theme')` with instant attribute switching on `document.documentElement`.
- **Toggle Control:** Persistent theme button (`🌙 Dark` / `☀️ Light`) in the main navigation header.
- **Components:** All UI components reference CSS variables (`var(--bg-card)`, `var(--text-primary)`, `var(--border-subtle)`) instead of hardcoded hex values.

---

## How to Add a New Experiment (Standard Workflow)

To create a new experiment from user data:

1. **Determine Curriculum Location:**
   - If DBATU F.Y. B.Tech: place in `src/experiments/fy-dbatu/<experiment-id>.ts`.
   - If NCERT Class 9–12: place in `src/experiments/<experiment-id>.ts`.
2. **Create config file** implementing `ExperimentConfig`:
   - Follow [.agent/experiment-template.md](file:///x:/TECH/Projects/virtualvigyan%202.0/.agent/experiment-template.md).
   - Use `advanceMode: 'button'` for observation steps.
   - Use `calculationCorrect` evaluator items in `scoring`.
3. **Register in `index.ts`:**
   - Export from local folder index and include in `experiments` array.
4. **Done!** It instantly appears in the selector and runs seamlessly in both Dark and Light modes.

