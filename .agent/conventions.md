# VirtualVigyan — Conventions

## Folder Structure

```
virtualvigyan 2.0/
├── .agent/                    # Agent context docs (this folder)
├── src/
│   ├── components/            # UI components (experiment-specific)
│   │   ├── Toolbox.tsx        # Titration toolbox
│   │   ├── LabBench.tsx       # Titration lab bench
│   │   ├── Flask.tsx          # Titration flask
│   │   ├── ...                # Other titration components
│   │   └── conservation/      # Conservation experiment components (isolated)
│   │       ├── ConservationExperiment.tsx
│   │       ├── ConservationLabBench.tsx
│   │       └── ...
│   ├── engine/                # Pure logic — NO React, NO DOM
│   │   ├── titrationState.ts        # State machine + reducer
│   │   ├── chemistryRules.ts        # Chemistry constants + formulas
│   │   ├── validation.ts            # Mistake detection rules
│   │   ├── conservationState.ts     # Conservation state machine
│   │   ├── conservationRules.ts     # Conservation chemistry
│   │   └── conservationValidation.ts
│   ├── App.tsx                # Root component, DnD context, routing
│   ├── main.tsx               # React DOM entry point
│   └── index.css              # Design tokens + global styles
├── public/                    # Static assets (favicon, etc.)
├── index.html                 # SPA entry HTML
├── package.json
├── vite.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── .oxlintrc.json
├── wrangler.jsonc             # Cloudflare Pages config
└── render.yaml                # Render.com deployment blueprint
```

## Naming Conventions

### Files
- **Components:** `PascalCase.tsx` — e.g., `LabBench.tsx`, `ConservationExperiment.tsx`
- **Engine modules:** `camelCase.ts` — e.g., `titrationState.ts`, `chemistryRules.ts`
- **CSS:** `index.css` (single global file with design tokens)
- **New experiment components:** Create a subfolder under `components/` named after the experiment — e.g., `components/conservation/`

### Code
- **React components:** `PascalCase` — `const LabBench: React.FC = () => {}`
- **State step constants:** `UPPER_SNAKE_CASE` via `as const` objects — `Step.SETUP_STAND`, `ConservationStep.FILL_TUBE`
- **Drag item IDs:** kebab-case strings — `'burette'`, `'cons-ignition-tube'`
- **Drop zone IDs:** kebab-case strings — `'stand-clamp-zone'`, `'cons-flask-zone'`
- **Action types:** `UPPER_SNAKE_CASE` strings — `'MOUNT_BURETTE'`, `'FILL_TUBE_START'`
- **Validation functions:** `can*` prefix — `canMarkEndpoint()`, `canDropOnZone()`, `canOperateStopcock()`
- **CSS custom properties:** `--category-name` — `--accent-teal`, `--shadow-card`, `--radius-md`

### Conservation experiment prefix
All conservation-specific IDs are prefixed with `cons-` to avoid collisions with titration IDs:
- Drag items: `'cons-flask'`, `'cons-ignition-tube'`
- Drop zones: `'cons-bench-zone'`, `'cons-flask-zone'`
- State/types: `ConservationStep`, `ConservationState`, `ConservationAction`

## Commit Message Style

Format: `type(scope): description`

```
feat(conservation): add digital balance with live mass readout
fix(cloudflare): remove asset binding in assets-only Worker configuration
fix(render): install serve production server, update start script
```

**Types:** `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`  
**Scopes:** experiment name (`titration`, `conservation`), infra target (`cloudflare`, `render`), or general (`deploy`, `ui`)

## State Machine Pattern

Every new experiment MUST follow this pattern:

1. **Define steps** as an `as const` object (not `enum`):
   ```ts
   export const MyStep = { STEP_A: 'STEP_A', STEP_B: 'STEP_B' } as const;
   export type MyStep = (typeof MyStep)[keyof typeof MyStep];
   ```

2. **Define state shape** as a TypeScript type with clear groupings:
   ```ts
   export type MyState = {
     step: MyStep;
     // Apparatus placement
     // Measurements
     // Animation flags
     // Results
     // Mistakes
     mistakes: string[];
   };
   ```

3. **Define actions** as a discriminated union type.

4. **Write a pure reducer** — no side effects, no async, no DOM access.

5. **Keep chemistry rules in a separate file** — constants, formulas, color functions.

6. **Keep validation in a separate file** — all `can*` functions return `{ allowed: boolean; message: string | null }`.

## Error Handling Patterns

- **Drag validation:** Return `ValidationResult` objects (`{ allowed, message }`) — never throw.
- **Mistake messages:** Surface as inline toast messages (5-second auto-dismiss). Never use `alert()` or `confirm()`.
- **Animation guards:** Use boolean flags in state (`isPipetteFilling`, `isPouring`, `isMixing`) to prevent double-triggers. Start/end actions bracket animations with `setTimeout`.
- **Reducer default case:** Always return `state` unchanged — never throw from the reducer.

## Styling Patterns

- **Layout:** Inline styles on components (especially for dynamic SVG positioning). Tailwind for static utility classes.
- **Design tokens:** All colors, radii, shadows, and fonts are CSS custom properties in `index.css`. Reference these from inline styles too: `'var(--accent-blue)'`.
- **Responsive:** `window.innerWidth < 900` triggers mobile layout (resize listener in App.tsx). Three-panel grid collapses to single column.
- **Collapsible panels:** Toolbox and Instructions panels support collapsed state (52px width). Toggle buttons in each panel header.
- **Animations:** Define `@keyframes` in `index.css`, apply via `animation` inline style property.

## HTML IDs for Interactive Elements

All buttons and interactive elements MUST have unique `id` attributes for testability:
- `btn-mark-endpoint`
- `btn-back-to-selector`
- `btn-instructions-advance`
- `btn-bench-advance`
- `btn-select-<experiment-id>`
- Drag items use their string IDs from `DRAG_ITEMS` / `CONSERVATION_DRAG_ITEMS` or apparatus IDs in config

---

## Experiment Engine Conventions (For New Experiments)

When creating any new experiment from user submissions:
- Refer to [experiment-template.md](file:///x:/TECH/Projects/virtualvigyan%202.0/.agent/experiment-template.md) for the incoming user data specification and ingestion pipeline.

1. **File Location & Folder Structure:**
   - NCERT / CBSE school experiments: Create in `src/experiments/<kebab-case-name>.ts`.
   - University practicals (DBATU Engineering Chemistry): Create in `src/experiments/fy-dbatu/<kebab-case-name>.ts` and export in `src/experiments/fy-dbatu/index.ts`.
2. **Schema Conformance:** Export a typed object implementing `ExperimentConfig` from `src/engine/experimentConfig`.
3. **The "Fix Once, Fix All" Rule:**
   - NEVER patch individual experiment configs when fixing mechanical bugs (e.g. DnD hitboxes, sensor delay, step skip bug, liquid meniscus appearance, or calculation rounding).
   - ALWAYS apply fixes centrally to `src/components/GenericLab/` or `src/engine/`. Because every experiment runs through `GenericLab`, a single fix in the engine automatically resolves the issue across ALL experiments without duplicating code or maintenance effort.
4. **Apparatus Usage:** Pick components from `src/apparatus/` (e.g. `TestTube`, `Beaker`, `ReagentBottle`, `TestTubeStand`, `OstwaldViscometer`, `PHMeter`, etc.). If a new apparatus is required, implement it as a standardized SVG in `src/apparatus/index.tsx`.
5. **Step Advancement:**
   - Steps requiring observation, color changes, gas evolution, or burning tests MUST specify `advanceMode: 'button'`. This allows the student to see the reaction and click when they are ready to proceed.
   - Normal setup steps (e.g. placing test tube on stand) can use default auto-advance on completing their required action.
   - Steps with physical actions (e.g. matchstick test) MUST list their action in `requiredActions: ['test-gas']`. The continue button will NOT appear until the physical action is completed!
   - Calculation steps MUST set `requiredActions: ['calculation-submitted']` and `advanceMode: 'button'` so students must submit answers and review their verification before proceeding to results.
6. **Calculation Grading & Rubric Scoring:**
   - Every experiment that includes a `calculation` section MUST include `calculationCorrect` evaluator items in `scoring` with appropriate point weightings (30–40% of total score).
   - NEVER award full marks purely for physical drag actions without grading student answers.
   - Always provide formulas in `chemistry.formulas` or `chemistryLib.ts` so `validateCalculation` can compute the exact answer and generate a worked solution.
7. **Visual Clarity & Liquid Contrast:**
   - Never use invisible/pure white liquids (`rgba(255,255,255,...)` or faint `rgba(224,242,254,0.3)`).
   - For transparent/aqueous solutions (acids, salts, water), use a vivid translucent scientific cyan-blue tint (e.g. `rgba(56, 189, 248, 0.6)` or `rgba(14, 165, 233, 0.5)`) with a visible curved meniscus so it looks crisp on all monitors in both Dark and Light themes.
8. **Dark Mode Theme Support:**
   - Never hardcode `#ffffff` or `#000000` for cards, text, or borders in UI components.
   - Use CSS custom property design tokens (`var(--bg-card)`, `var(--bg-primary)`, `var(--text-primary)`, `var(--border-subtle)`).
9. **Registration:** Always export from local folder and append the new config to `experiments` in `src/experiments/index.ts`.



