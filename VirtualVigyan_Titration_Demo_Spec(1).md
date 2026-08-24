# VirtualVigyan — Titration Demo Build Spec

Hand this entire file to your coding agent (Claude Code or similar) inside your project repo.
This is a scoped-down, buildable MVP proving ONE core experiment end-to-end — not the full
platform described in the pitch deck. Goal: a working, demoable prototype, built reliably,
not a sprawling half-finished architecture.

---

## GROUND RULES FOR THE AGENT (read first, follow throughout)

1. **Do not invent chemistry.** Use the exact reaction, color, and calculation rules in the
   "Chemistry Rules" section below verbatim. If something is ambiguous, ask rather than guess.
2. **Do not scope-creep.** No backend, no auth, no database, no multi-experiment library for
   this demo. Local browser state only. If you think something extra would help, note it as
   a suggestion at the end — don't silently build it.
3. **Do not claim things that aren't implemented.** Mistake detection here is deterministic
   rule-based logic, not machine learning — never label it "AI-powered" or "ML-driven" in UI
   copy, comments, or the README. Say what it actually is.
4. **Build sequentially, not in parallel.** Follow the build order at the bottom. Get one
   experiment working end-to-end with placeholder visuals before polishing animation/style.
5. **Every commit should leave the app in a runnable state.** Don't leave half-wired features
   that crash the demo.
6. **At the end, report honestly:** what's done, what's simplified vs. the spec, what's buggy
   or untested, and what you'd need to do next for a second experiment. No silent gaps.

---

## SCOPE

### In scope for this demo
- ONE experiment: **Acid-base titration** — unknown HCl (measured into flask via pipette)
  titrated with known NaOH (from burette), phenolphthalein indicator.
- Full step flow: select experiment → drag apparatus onto the lab bench → measure acid into
  flask with the pipette → fill the burette → add indicator → titrate using the burette
  stopcock → observe real-time color change → mark endpoint → calculate unknown concentration
  → get scored feedback.
- **Drag-and-drop interaction**, not button clicks, for all apparatus handling (see below).
- Deterministic mistake detection (see rules below) — not ML.
- Simple scoring/feedback screen at the end.
- Single-page web app. No login, no accounts.

### Out of scope (do not build)
- Additional experiments, Physics/Biology modules
- Backend server, database, real user accounts, cross-device sync
- Offline PWA/service workers (fine to skip for a demo — note as future work only)
- **3D graphics — this experiment is 2D by design. 3D is future scope, not this build's job.**
- Teacher dashboard, leaderboards, multiplayer

---

## TECH STACK (2D by design — this is the target, not a placeholder for 3D)

- **React + TypeScript + Vite**
- **2D SVG / absolutely-positioned elements** for the lab scene — precise control over liquid
  levels, apparatus positions, and color, and the deliberate choice for this build, not a
  temporary substitute for 3D.
- **Drag-and-drop:** use **`@dnd-kit/core`** (not raw HTML5 drag/drop) — it has proper touch
  support out of the box, which matters since the platform's whole pitch is working on
  basic/touch devices, not just desktop with a mouse.
- **State:** plain React state / `useReducer` — no Redux/Zustand needed for one experiment.
- **Styling:** Tailwind CSS.
- **Persistence:** none required; `localStorage` only if you want the score to survive a
  page reload — not a real backend.
- **Deployment:** static build, deployable to Vercel/Netlify — no server needed.

**Why this differs from the pitch deck's full architecture:** the deck's Three.js + NestJS +
PostgreSQL + Redis + PWA stack describes a longer-term production vision. This build proves
the interaction and validation model in 2D, which is the actual design target for now — 3D is
reframed as future scope, not something being faked. Say this plainly if asked in a demo or
Q&A: *"The current build is 2D by design — it proves the interaction and validation model.
3D visualization is on our roadmap as an enhancement, not a blocker to the core learning
outcome."*

---

## UI LAYOUT — three-panel window

```
┌─────────────────┬───────────────────────────────┬─────────────────┐
│  APPARATUS &     │                                 │   INSTRUCTIONS   │
│  CHEMICALS       │        LAB BENCH                │                  │
│  (left panel,    │   (center — retort stand,       │  (right panel,   │
│  draggable       │   drop zones, mounted           │  current step    │
│  items)          │   apparatus, live liquid)        │  highlighted,    │
│                  │                                 │  checklist of    │
│  - Burette       │                                 │  completed steps)│
│  - Conical flask │                                 │                  │
│  - Pipette       │                                 │                  │
│  - Indicator     │                                 │                  │
│    bottle        │                                 │                  │
│  - NaOH reagent  │                                 │                  │
│    bottle        │                                 │                  │
│  - HCl stock     │                                 │                  │
│    bottle        │                                 │                  │
└─────────────────┴───────────────────────────────┴─────────────────┘
```

- Left panel items are **draggable cards** (icon + label). Only items relevant to the
  student's current step should appear enabled/highlighted; others are visible but dimmed
  (not hidden — hiding teaches nothing, dimming shows sequence without hard-blocking).
- Center bench has explicit **drop zones** (defined rectangles/IDs): stand-clamp-zone
  (accepts burette), stand-base-zone (accepts flask). Dropping the correct item snaps it into
  place with a small settle animation; dropping the wrong item snaps back to the panel with a
  shake and a short inline message.
- Right panel shows the **current instruction** in plain language, plus a checklist of
  completed steps so the student always knows what's next without needing a separate manual.

---

## STEP FLOW (revised for drag-and-drop + realistic tool handling)

`SELECT` → `SETUP_STAND` → `MEASURE_ACID` → `FILL_BURETTE` → `ADD_INDICATOR` → `TITRATING`
→ `ENDPOINT_MARKED` → `CALCULATION` → `RESULTS`

1. **SETUP_STAND** — drag the burette from the left panel onto the stand's clamp zone; drag
   the conical flask onto the base zone beneath it. Both must be placed before proceeding.
2. **MEASURE_ACID** — drag the pipette onto the HCl stock bottle; **press and hold** to
   squeeze the bulb, which animates the pipette filling (fixed-volume pipette — always draws
   exactly 25 mL, matching a real lab pipette, no free-form volume selection needed for this
   demo). Then drag the filled pipette onto the flask and press/hold again to dispense —
   flask fills to 25 mL of HCl.
3. **FILL_BURETTE** — drag the NaOH reagent bottle onto the top of the mounted burette;
   triggers a pour animation, burette fills to its working volume (e.g. 50 mL).
4. **ADD_INDICATOR** — drag the indicator dropper bottle onto the flask; releasing over the
   flask adds 2–3 drops (fixed amount, not variable) — flask liquid appears, colorless.
5. **TITRATING** — the burette's **stopcock becomes interactive** only once burette is
   mounted+filled, flask is placed+measured, and indicator has been added (all prior steps
   complete). Implement the stopcock as a small draggable lever/knob on the burette:
   - Dragging it open (down/sideways, whichever reads more naturally) opens the tap; while
     held open, droplets fall continuously into the flask at a rate proportional to how far
     it's opened (map drag distance to an open-percentage, e.g. 0–100%).
   - While open: burette reading decreases in real time, flask liquid color updates live per
     the color rules below.
   - Releasing the lever (or dragging back to neutral) closes the tap and stops the flow.
   - This should feel like operating a real stopcock, not clicking a button — that's the
     specific interactivity being asked for.
6. **ENDPOINT_MARKED** — a **"Mark Endpoint"** confirm action (this one step is fine as a
   click/button — it represents a judgment call, not a physical manipulation) records the
   burette volume at the moment the student believes the color change is correct and
   permanent.
7. **CALCULATION** — input field for the student's computed unknown concentration, checked
   against the formula using their own recorded volume.
8. **RESULTS** — feedback screen: endpoint accuracy, calculation accuracy, overall score.

---

## CHEMISTRY RULES (exact — do not deviate)

- **Reaction:** HCl + NaOH → NaCl + H₂O (acid-base neutralization).
- **Indicator:** phenolphthalein — colorless in acidic solution, turns pink/magenta above
  roughly pH 8.2–10.
- **Setup (hardcoded for this demo):**
  - Flask receives exactly **25 mL of HCl**, internally **0.1 M** (ground truth, not shown to
    the student — this is what they're meant to determine).
  - Burette contains NaOH at a **known 0.1 M** concentration.
- **Expected equivalence point:** **25 mL of NaOH added** (1:1 mole ratio at these
  concentrations/volumes) — this is the "true" endpoint the app checks student answers
  against.
- **Color behavior as titrant is added (drive this off live burette volume dispensed):**
  - 0–90% of the way to 25 mL: solution stays colorless.
  - 90–100% (22.5–25 mL): faint pink flashes appear and fade — interpolate a light pink that
    increases in visibility as volume approaches 25 mL.
  - At/just past 25 mL: the palest persistent pink is the correct point to mark.
  - Significantly past 25 mL (>26 mL): solution turns an obviously overshot deep magenta.
- **Calculation the student must perform:**
  `Unknown HCl concentration = (Volume NaOH used × Molarity NaOH) / Volume HCl in flask`
  `= (V_NaOH × 0.1) / 25`
  Grade their answer against the formula applied to **their own recorded endpoint volume**,
  not just the ground truth — this rewards correct reasoning even if their hands-on endpoint
  was slightly off.

---

## MISTAKE DETECTION (deterministic rules — implement exactly these, label as rule-based)

- Dragging the wrong apparatus onto a drop zone → reject, snap back, short inline message
  (e.g. *"That doesn't go there — try the burette here."*).
- Trying to operate the stopcock before burette is mounted+filled, flask is placed+measured,
  and indicator is added → stopcock stays visually locked/disabled with a tooltip explaining
  what's still missing.
- Trying to dispense from an empty pipette (dragged to flask without drawing from the acid
  bottle first) → message: *"Draw liquid into the pipette first — drag it to the HCl bottle
  and press to fill."*
- Marking the endpoint before any visible color change → *"No colour change has been observed
  yet — keep titrating until you see a colour shift."*
- Marking the endpoint >2 mL past the true 25 mL (clearly overshot, deep magenta) →
  *"You've overshot the endpoint — try again and stop at the first persistent pale pink."*
- Final concentration answer off by more than 10% (relative to their own recorded volume) →
  show the correct worked formula, don't just mark it wrong silently.

---

## VISUAL STYLE

- Clean, flat 2D scene: retort stand, burette with visible graduated markings and a
  liquid level that updates live, conical flask with color-animated liquid, pipette with a
  visible fill level, labelled reagent bottles.
- Color transitions should animate smoothly, not snap instantly.
- Keep the visual style simple/flat rather than photorealistic — faster to build well, and
  consistent with the "lightweight, works on basic devices" positioning.
- Drag interactions should have clear affordances: hover states on draggable items, a visible
  "ghost" of the item while dragging, and obvious snap/reject feedback on drop.

---

## FOLDER STRUCTURE

```
virtualvigyan-demo/
├── src/
│   ├── components/
│   │   ├── Toolbox.tsx           # left panel — draggable apparatus/chemical cards
│   │   ├── LabBench.tsx          # center — drop zones + mounted apparatus + live liquids
│   │   ├── InstructionsPanel.tsx # right panel — current step + checklist
│   │   ├── Burette.tsx
│   │   ├── StopcockControl.tsx   # draggable lever/knob controlling flow rate
│   │   ├── Flask.tsx
│   │   ├── Pipette.tsx           # draw (press-hold on bottle) + dispense (press-hold on flask)
│   │   ├── CalculationForm.tsx
│   │   └── ResultsScreen.tsx
│   ├── engine/
│   │   ├── titrationState.ts     # state machine: steps, actions, reducer
│   │   ├── chemistryRules.ts     # constants + color interpolation + endpoint math
│   │   └── validation.ts         # mistake-detection rule functions
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── README.md
```

---

## BUILD ORDER (sequential — do not parallelize)

1. Static scene: bench with labelled drop zones, toolbox panel with static (non-draggable
   yet) apparatus cards, instructions panel with placeholder text.
2. Wire up `@dnd-kit/core`: make toolbox items draggable, implement drop-zone acceptance
   logic (correct item snaps in, wrong item rejects) for burette + flask onto the stand.
3. State machine: steps as enum, reducer, transitions gated on the correct prior steps being
   complete.
4. Pipette interaction: drag to HCl bottle, press-hold to fill (animated), drag to flask,
   press-hold to dispense (flask fills to 25 mL).
5. Burette fill: drag NaOH bottle onto mounted burette, pour animation.
6. Indicator: drag dropper bottle onto flask, adds fixed drops, flask shows colorless liquid.
7. Stopcock interaction: implement the drag-to-open lever, wire to continuous drop rate +
   real-time burette reading decrease + real-time flask color interpolation.
8. Endpoint marking, tolerance comparison, calculation input + validation, results screen.
9. Mistake-detection messages wired to every rule above.
10. Polish pass: animation smoothness, drag affordances (ghost/hover/snap/reject feedback).
11. Final QA against the acceptance criteria below.

---

## ACCEPTANCE CRITERIA — do not call this "done" until every box is true

- [ ] Full run completes with zero console errors, entirely via drag-and-drop for apparatus
      handling: setup → measure acid → fill burette → indicator → titrate → mark endpoint →
      calculate → results.
- [ ] Dragging the correct apparatus onto a drop zone snaps it into place; dragging the wrong
      one rejects with visible feedback.
- [ ] Pipette correctly requires draw-before-dispense; dispensing without drawing first is
      blocked with the correct message.
- [ ] Stopcock drag control produces a flow rate proportional to how far it's opened, and
      burette reading + flask color update live while open.
- [ ] Endpoint tolerance logic correctly handles three test cases: marked early (no color
      change yet), marked correctly (~25 mL), and marked late (overshot, >27 mL).
- [ ] Incorrect concentration calculation is flagged with the correct worked formula shown,
      not just marked wrong.
- [ ] Drag-and-drop works with touch input, not just mouse (test on a touch device or browser
      touch emulation) — this matters given the platform's low-end-device positioning.
- [ ] Runs cleanly on a small/low-end laptop or tablet screen without layout breakage.
- [ ] No UI copy, comments, or README text claims AI/ML where the logic is actually
      rule-based deterministic checks.

---

## WHAT TO REPORT BACK WHEN DONE

- Working demo: local dev command to run it, or a deployed link if you set one up.
- Any deviations from this spec and the reason for each.
- Known bugs/limitations, listed honestly — this matters for what gets said in a live judge
  demo or Q&A, so nothing should be quietly hidden.
- What would be needed to add a second experiment, if asked.
