# VirtualVigyan — Known Issues & Limitations

## 🔴 Bugs

*No active bugs! All previously reported bugs have been verified and resolved.*

---

## 🟡 Limitations (by design — not bugs)

### 1. No state persistence
State lives entirely in React. Refreshing the page resets the experiment to the beginning. There is no `localStorage` save/restore. This is intentional for the demo phase.

### 2. No keyboard accessibility for stopcock
The stopcock is operated by mouse drag / touch. There is no keyboard fallback (e.g., arrow keys to open/close). `@dnd-kit` provides some keyboard support but it hasn't been configured for the stopcock's rotational interaction.

### 3. Hardcoded chemistry values in legacy titration
Legacy titration constants (HCl concentration, NaOH molarity, equivalence volume) are hardcoded in `chemistryRules.ts`. (Note: all new experiments use `ExperimentConfig` data schemas).

### 4. Spec calls for drag-to-open stopcock, implementation uses rotation
The original spec describes the stopcock as *"a small draggable lever/knob — dragging it open"*, mapping drag distance to open-percentage. The implementation uses a **rotatable tap valve** where click/drag rotates the handle. Functionally equivalent, but the interaction metaphor differs from the spec's description.

### 5. Mobile layout is responsive but not optimized
The three-panel grid switches to single-column below 900px, but:
- Panel ordering (bench first, toolbox second, instructions third) hasn't been user-tested on real tablets.
- Collapsed panel states (52px width) on mobile may be confusing.
- No explicit handling for landscape vs. portrait orientation.

---

## 🟢 Previously Discovered & Fixed

### 11. Cloudflare Worker infinite redirect loop (FIXED)
**Commit:** `d4a1357`  
**Was:** `_redirects` file caused an infinite redirect loop on Cloudflare Workers.  
**Fix:** Removed `_redirects` and used `wrangler.jsonc` with `"not_found_handling": "single-page-application"` instead.

### 12. Render.com missing `serve` package (FIXED)
**Commit:** `5c80820`  
**Was:** `npm start` failed because `serve` wasn't installed in production.  
**Fix:** Added `serve` to `dependencies` (not `devDependencies`) and added `render.yaml` blueprint.

### 13. Cloudflare asset binding error (FIXED)
**Commit:** `cc63649`  
**Was:** Worker config had an unnecessary asset binding that Cloudflare rejected.  
**Fix:** Removed the binding — assets-only Workers don't need it.

### 14. Step premature auto-advance skipping visual reactions (FIXED)
**Was:** In `checkStepAdvancement`, steps with all required actions completed would auto-advance immediately to the next step. If an action involved dropping a matchstick to test gas or pouring acid, the experiment jumped straight to calculations/results before the user could see the flame burst or reaction effervescence.
**Fix:** Steps involving observation or reaction effects must specify `advanceMode: 'button'`. The engine then holds the state, renders the visual reaction (effervescence bubbles, flame pop burst), and presents a prominent "Continue to Next Step →" button in both the instructions panel and on the bench banner.

### 15. Near-invisible transparent liquids on standard displays (FIXED)
**Was:** Aqueous solutions (H₂SO₄, water) configured with faint white/clear RGBA values (`rgba(224, 242, 254, 0.35)`) were almost invisible on regular monitors.
**Fix:** Replaced with a vivid translucent scientific cyan-blue tint (`rgba(56, 189, 248, 0.6)`) complete with curved meniscus ellipse, specular highlights, and surface sheen.

### 16. Undersized apparatus and missing bench surface (FIXED)
**Was:** Apparatus was rendered with miniature dimensions (40x120px tube, 100x60px stand), leaving 80% of the canvas empty. The bench only had a faint 2px line for the table.
**Fix:** Scaled apparatus (76x230px tube, 240x150px wooden rack) and built a realistic 3D perspective laboratory workbench with tabletop depth, front edge bevel highlight, and cabinet apron.

### 17. Step premature advance and skipping required actions (FIXED)
**Was:** `ADVANCE_STEP` in the engine reducer called `advanceToNextStep` unconditionally without verifying `currentStep.requiredActions`. Additionally, `GenericInstructions` showed the manual continue button on button-advance steps even before the student performed the step's drag actions (e.g., advancing before testing the gas with the matchstick).
**Fix:** 
1. `ADVANCE_STEP` in `experimentRunner.ts` strictly validates that all `currentStep.requiredActions` exist in `state.completedActions`. If any action is missing, it refuses to advance and sets a clear mistake message.
2. `GenericInstructions` only renders the advance button when `(!hasActions || stepActionsCompleted)` is true.
3. Steps requiring physical actions have explicit `requiredActions` (e.g. `['test-gas']`), while passive visual observation steps have `requiredActions: []`.

### 18. Calculation unverified free 100/100 score and instant jump to results (FIXED)
**Was:**
1. In `GenericCalculation`, clicking "Submit Calculation" dispatched `SUBMIT_CALCULATION` which called `checkStepAdvancement`. Because the calculation step had no required action, it instantly jumped to `results`, hiding the green/red answer verification and worked formulas.
2. The scoring rubric in `zinc-acid-reaction.ts` only evaluated boolean setup and observation flags—it lacked `calculationCorrect` evaluators. Thus, even with wrong or empty calculations, the student was awarded 100/100 points!
**Fix:**
1. `SUBMIT_CALCULATION` now saves answers and marks `'calculation-submitted'`, but does NOT auto-advance. The student stays on `GenericCalculation` to review clear "✓ Correct" or "✗ Incorrect" badges with step-by-step worked formulas, then clicks `"View Final Score & Results →"`.
2. Scoring rubrics must include `calculationCorrect` evaluators (worth 40% of total score). Incorrect calculations correctly penalize the student's score.

### 19. Burette liquid pre-filled before dispensing titrant (FIXED)
**Was:** In `src/apparatus/index.tsx`, `BuretteSVG` and `BuretteStand` evaluated `effectiveLevel` from `hasVolumeVar` or variable existence. Because titration experiments initialize variables such as `naohVolume: 0`, `buretteReading: 0`, or `volumeAdded: 0`, the level evaluated to `(50 - 0) / 50 = 1.0` (100% full), causing the burette to render full of liquid immediately upon mounting or dragging, before the student completed the "Fill Burette" step.
**Fix:** Updated `BuretteSVG` and `BuretteStand` in `src/apparatus/index.tsx` so that `isBuretteFilled` strictly requires `flags?.buretteFilled === true` (or `extraProps?.buretteFilled === true` / `flags?.['burette-filled'] === true`). When `flags.buretteFilled` is false or not yet set, `effectiveLevel` is strictly 0. Pre-seeded `state.apparatusProps` in `experimentRunner.ts` and `GenericBench.tsx` from `config.apparatus[].initialProps` so apparatus initial properties (such as `liquidLevel: 0`) are preserved across all 8 titration experiments and legacy labs.

### 20. Apparatus shrinking during Shake / Swirl animation (FIXED)
**Was:** In `src/components/GenericLab/GenericBench.tsx`, `@keyframes apparatusSwirl` was applied directly to the outer positioned apparatus container. Because the keyframes specified `transform: translate(...) rotate(...)` without `scale(${benchScale})`, CSS animation replaced the inline 1.7x scale factor with default 1.0x, shrinking the glassware by ~42% while shaking.
**Fix:** Removed keyframe animation from the outer scaled container. Wrapped the apparatus `<Component />` inside an inner wrapper with `@keyframes innerApparatusSwirl` using rotational and translate motion around its base (`transformOrigin: '50% 88%'`), preserving 100% of the outer container's scale.

### 21. Main experiment playground canvas remaining stark white in Dark Mode (FIXED)
**Was:** In `GenericBench.tsx`, the workbench canvas background was hardcoded to `radial-gradient(ellipse at 50% 30%, #ffffff 0%, #f1f5f9 60%, #e2e8f0 100%)`. In Dark Mode, this left a glaring white bench surface contrasting harshly with the dark header and panels.
**Fix:** Replaced hardcoded `#ffffff` with CSS custom properties `radial-gradient(ellipse at 50% 30%, var(--bg-card) 0%, var(--bg-inset) 60%, var(--bg-secondary) 100%)`, smoothly adapting between Light Mode (clean bright lab bench) and Dark Mode (deep navy/slate workbench atmosphere).

### 22. Retort stand appearance & DBATU categorization (CALIBRATED)
**Was:** `RetortStand` SVG had hardcoded `opacity: 0.38` and `GenericBench.tsx` applied `opacity: 0.35`, resulting in `0.38 * 0.35 = 0.13` (13% opacity). DBATU experiments were also misclassified under Class 11 & Class 12 in the experiment selector and curriculum views.
**Fix:** Restored full vector rendering in `RetortStand` SVG and calibrated bench background opacity to `0.42` with soft ambient drop shadow (`drop-shadow(0 3px 6px rgba(0,0,0,0.18))`). This keeps the retort stand visible as a realistic metallic background fixture without overpowering or distracting from the active, interactive glassware and liquid levels. Categorized all 9 DBATU engineering practicals under `F.Y. B.Tech (DBATU)` with dedicated filter pill.

### 23. Burette stopcock operable and liquid dripping without adding liquid first (FIXED)
**Was:** When dragging a 50 mL burette to the retort stand in titration experiments, the interactive cork handle displayed "↻ Click Right to Open / Slow Drop (20%)" and allowed students to click or rotate the stopcock before adding any titrant liquid. When opened:
1. `BuretteSVG` and `BuretteStand` evaluated `isTitrating` purely on `stopcockOpen > 0`, triggering dynamic liquid droplet / jet animations from the tip of a completely empty burette.
2. `GenericBench.tsx` and `experimentRunner.ts` ran `TICK_FLOW` intervals whenever `stopcockOpen > 0` without checking `flags.buretteFilled`, automatically incrementing `volumeAdded` and titration variables (`buretteReading`, `kohVolume`, `stdEdtaVolume`, etc.).
3. The floating live volume readout badge displayed reading values (e.g., `11.4 mL`) next to an empty burette.
**Fix:** Multi-layered defense implemented across apparatus, reducer, and bench components:
1. **`src/apparatus/index.tsx` (`BuretteSVG` & `BuretteStand`):**
   - Strictly gate `stopcockOpen = isBuretteFilled ? (...) : 0` and `isTitrating = Boolean(isBuretteFilled && effectiveLevel > 0 && stopcockOpen > 0)`.
   - Replaced "Click to Open" badge with an amber warning badge (`⚠️ Burette is Empty / Fill before opening`) when `!isBuretteFilled`. Clicking or dragging the cork when empty flashes `⚠️ Fill Titrant First!` and blocks opening.
   - Gated the floating live volume readout badge with `isBuretteFilled && hasVolumeVar`, hiding it until the burette is filled.
   - Liquid flow droplets and jet stream only render when `isTitrating` (`isBuretteFilled && effectiveLevel > 0`).
2. **`src/engine/experimentRunner.ts`:**
   - `SET_STOPCOCK` clamps `openAmount` to 0 if `state.flags.buretteFilled === false` or `state.flags['burette-filled'] === false`.
   - `TICK_FLOW` refuses to advance volume and resets `stopcockOpen: 0, isDropAnimating: false` if `state.flags.buretteFilled === false`. Automatically stops flow when burette reaches capacity (50 mL).
3. **`src/components/GenericLab/GenericBench.tsx`:**
   - Blocks `burette_stopcock_change` events if `flags.buretteFilled === false`.
   - Flow effect checks `isBuretteFilled !== false` before scheduling `TICK_FLOW` intervals or drop interaction completions.

### 24. Apparatus titles, drop zone labels, and banners merging and colliding with instruments (FIXED)
**Was:** Multiple text and title elements collided directly with the visual apparatus on the lab bench:
1. Drop zone text labels (`zone.label` in `DropZone`) were centered inside drop boxes directly overlapping background hardware.
2. Internal SVG labels in glassware and reaction vessels were printed at the very base or body of the SVG, colliding with liquid and stirrer plates.
3. The burette label plaque sat directly over the top mouth opening of the burette tube.
4. The burette stopcock guidance badges collided directly with the conical flask rim below the burette tip.
5. Observation and POP sound banners directly overlapped the top of center instruments.
6. `StopcockUI` was hardcoded at center screen, colliding with glassware.
**Fix:**
1. **Drop Zones (`GenericBench.tsx`):** Unplaced drop zone labels now render as high-contrast floating pill badges (`📍 {zone.label}`) positioned in clean empty space outside the instrument bounding box with an opaque white card background, subtle blue border, and shadow.
2. **Placed Apparatus Titles (`GenericBench.tsx`):** Placed bench apparatus receive `label={undefined}` to suppress internal SVG text collisions. A clean dedicated title pill badge is rendered in empty space below the instrument (`top: 100%, translateY: 4px`).
3. **Burette Stand & SVG (`src/apparatus/index.tsx`):**
   - Top label plaque moved to empty space to the right of the tube (`translate(buretteX + 28, 14)`).
   - Stopcock guide badges moved to clean empty space to the right of the burette tube (`translate(buretteX + 26, tubeBottom - 12)`).
4. **Bench Banners (`GenericBench.tsx`):** Repositioned to top-left empty space (`top: 14, left: 14`).
5. **Stopcock UI (`GenericBench.tsx`):** Docked cleanly in bottom-right empty space (`bottom: 16, right: 16`).

### 25. Universal Multi-Chemical Reaction & Stoichiometry Engine (IMPLEMENTED)
**Was:** Engine was purely state-machine driven and could not solve arbitrary multi-reagent chemical equilibria.
**Fix:** Built complete client-side deterministic reaction and stoichiometry solver in `src/engine/chemicalDatabase.ts`, `src/engine/reactionMatrix.ts`, and `src/engine/stoichiometrySolver.ts` with live Chemical Inspector Modal and 29 automated test assertions.

### 26. Landing Page Scroll-Reveal Class Mismatch and Visibility Collapse (FIXED)
**Was:** IntersectionObserver added `.active` while CSS only targeted `.ln-reveal.visible`, trapping 80% of landing page elements at `opacity: 0`.
**Fix:** Implemented Dual-Class CSS synchronization (`.ln-reveal.visible, .ln-reveal.active`), progressive fallback timer (`setTimeout` 1000ms), and pre-check for IntersectionObserver support.

### 27. Endpoint interception via document-level click capture (FIXED)
**Was:** In `App.tsx`, a capture-phase `document.addEventListener('click')` intercepted any click on elements with `id === 'btn-mark-endpoint'`. This broke React unidirectional data flow and interfered with other experiments sharing the button ID.
**Fix:** Added direct `onMarkEndpoint` callback prop to `LabBenchProps` in `src/components/LabBench.tsx`. `App.tsx` now passes `onMarkEndpoint={handleMarkEndpoint}` directly to `<LabBench />`, completely removing the document-level event listener.

### 28. Conservation simulated masses regenerated redundantly in module scope (FIXED)
**Was:** `generateSimulatedMasses()` ran at top-level module evaluation in `conservationState.ts` and was immediately overwritten and discarded on first experiment start or reset.
**Fix:** Initialized `conservationInitialState` with static default masses (`125.40 g`) and removed the top-level random call. Fresh randomized masses are cleanly generated strictly upon dispatching `START_EXPERIMENT` or `RESET`.

### 29. Mutable state assignment in `conservationReducer` (FIXED)
**Was:** `case 'PLACE_ON_BALANCE'` assigned `let nextState = { ...state }` and mutated `nextState.initialMass = ...`, violating immutability conventions.
**Fix:** Refactored into a pure functional immutable return expression using `const` and spread syntax.

### 30. Color description range calibration (FIXED)
**Was:** `getColorDescription()` in `src/engine/chemistryRules.ts` labeled volumes up to 26 mL as `"Pale persistent pink (Endpoint)"`, when equivalence actually occurs at 25 mL.
**Fix:** Calibrated thresholds to match visual rendering in `getFlaskColor()`: `< 24.8 mL` = transient faint pink, `25.0 ± 0.1 mL` = persistent pale pink (Endpoint), `<= 26.0 mL` = pink deepening to magenta (Overshot), and `> 26.0 mL` = deep magenta (Overshot). Exported `COLOR_CHANGE_START_ML`, `ENDPOINT_ML`, and `OVERSHOOT_ML`.

### 31. OxLint React Ref access during render in `src/apparatus/index.tsx` (FIXED)
**Was:** `BuretteStand` and `BuretteSVG` accessed `isPointerDownRef.current` directly in their SVG `<g>` inline style transitions during render, violating React render purity and skipping React compiler optimizations.
**Fix:** Introduced `isDraggingValve` React state set during `handlePointerDown` / `handlePointerUp`, completely eliminating ref access during render.

### 32. Engine Automated Unit Test Suite (IMPLEMENTED)
**Was:** Zero automated tests existed for core engine state machines and chemistry validation functions.
**Fix:** Created `scripts/test_engine.ts` testing `chemistryRules`, `validationEngine`, `titrationReducer`, and `conservationReducer` (16 test assertions). Added `"test"` command to `package.json` executing both `test_engine.ts` and `test_stoichiometry.mjs` (45 / 45 passing assertions).
