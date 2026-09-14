# VirtualVigyan — Known Issues & Limitations

## 🔴 Bugs

### 1. Endpoint interception via document-level click capture
**File:** [App.tsx](file:///x:/TECH/Projects/virtualvigyan%202.0/src/App.tsx#L160-L181)  
**Issue:** The "Mark Endpoint" button click is intercepted in the **capture phase** of a document-level event listener (lines 160–181). This is a fragile pattern — it relies on matching `target.id === 'btn-mark-endpoint'` and intercepting before LabBench's own handler fires. If another element with the same ID is added, or if event propagation changes, this breaks silently.  
**Impact:** Medium. Works today, but is a maintenance risk.  
**Workaround:** None needed currently — just don't add duplicate IDs.

### 2. Conservation simulated masses regenerate on every reducer call to RESET
**File:** [conservationState.ts](file:///x:/TECH/Projects/virtualvigyan%202.0/src/engine/conservationState.ts#L113-L121)  
**Issue:** `generateSimulatedMasses()` is called in the module's top-level scope for `defaultMasses`, AND again inside `START_EXPERIMENT` and `RESET` actions. The top-level call creates masses that are immediately thrown away on first experiment start.  
**Impact:** Low. Cosmetic waste — no user-visible bug.

### 3. `let` used instead of `const` in conservation reducer
**File:** [conservationState.ts](file:///x:/TECH/Projects/virtualvigyan%202.0/src/engine/conservationState.ts#L270)  
**Issue:** `let nextState = { ...state, flaskOnBalance: true }` in `PLACE_ON_BALANCE` — `nextState` is reassigned conditionally, so `let` is technically correct, but the mutation pattern (assigning `nextState.initialMass = ...`) breaks the immutability convention used everywhere else.  
**Impact:** Low. Works in practice because the spread already created a new object, but it's inconsistent with the rest of the codebase.

---

## 🟡 Limitations (by design — not bugs)

### 4. No state persistence
State lives entirely in React. Refreshing the page resets the experiment to the beginning. There is no `localStorage` save/restore. This is intentional for the demo phase.

### 5. No keyboard accessibility for stopcock
The stopcock is operated by mouse drag / touch. There is no keyboard fallback (e.g., arrow keys to open/close). `@dnd-kit` provides some keyboard support but it hasn't been configured for the stopcock's rotational interaction.

### 6. Hardcoded chemistry values
All chemistry constants (HCl concentration, NaOH molarity, equivalence volume, color thresholds) are hardcoded in `chemistryRules.ts` and `conservationRules.ts`. There is no experiment configuration file or parameterization system yet. Adding a second variant of the same experiment type (e.g., different molarity titration) requires code changes, not config changes.

### 7. Color description function is slightly wrong
**File:** [chemistryRules.ts](file:///x:/TECH/Projects/virtualvigyan%202.0/src/engine/chemistryRules.ts#L53-L59)  
`getColorDescription()` returns `'Pale persistent pink (Endpoint)'` for `volumeAdded <= OVERSHOOT_ML` (26 mL), but the actual endpoint is at 25 mL. The 25–26 mL range should arguably say "Pink deepening to magenta" to match `getFlaskColor()`'s visual behavior. Not user-facing in a critical way, but could confuse agents reading the code.

### 8. Spec calls for drag-to-open stopcock, implementation uses rotation
The original spec describes the stopcock as *"a small draggable lever/knob — dragging it open"*, mapping drag distance to open-percentage. The implementation uses a **rotatable tap valve** where click/drag rotates the handle. Functionally equivalent, but the interaction metaphor differs from the spec's description.

### 9. Mobile layout is responsive but not optimized
The three-panel grid switches to single-column below 900px, but:
- Panel ordering (bench first, toolbox second, instructions third) hasn't been user-tested on real tablets.
- Collapsed panel states (52px width) on mobile may be confusing.
- No explicit handling for landscape vs. portrait orientation.

### 10. No unit tests
There are zero automated tests. All validation was done manually. The `engine/` modules (pure functions, reducers) are excellent candidates for unit testing but none exist.

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

### 22. Retort stand faded ghost appearance & DBATU categorization (FIXED)
**Was:** `RetortStand` SVG had hardcoded `opacity: 0.38` and `GenericBench.tsx` applied `opacity: 0.35`, resulting in `0.38 * 0.35 = 0.13` (13% opacity). DBATU experiments were also misclassified under Class 11 & Class 12 in the experiment selector and curriculum views.
**Fix:** Restored full `opacity: 1.0` in `RetortStand` SVG with sharp metallic gradients and cast-iron base with realistic drop shadow (`opacity: 0.95`, `filter: drop-shadow(0 6px 10px rgba(0,0,0,0.35))`). Categorized all 9 DBATU engineering practicals under `F.Y. B.Tech (DBATU)` with dedicated filter pill.



