# VirtualVigyan — Project Context

## What It Is

VirtualVigyan is an **interactive 2D virtual chemistry lab platform** designed for Indian school curriculum (NCERT/CBSE Classes 9–12). It lets students perform authentic chemistry experiments through drag-and-drop interactions in a web browser. It is a single-page app — no backend, no accounts, no server.

Students drag laboratory apparatus onto a realistic 3D-styled lab bench, interact with chemicals and valves, observe reactions (color changes, effervescence/bubbling, gas evolutions, precipitate formation), answer calculation questions, and receive deterministic, rule-based scores at the end.

**This is NOT a video player, not a simple quiz, and not an AI simulator.** All mistake detection, chemical state changes, and grading are deterministic and rule-based.

## Who It's For

- **Primary:** Indian secondary and higher secondary school students (Classes 9–12) who lack access to physical chemistry labs.
- **Device Target:** Low-to-mid range laptops and tablets — touch support is mandatory. Designed to run smoothly over low-end devices in any modern browser.
- **Secondary:** Teachers who want demonstrable, interactive experiments for classroom teaching.

---

## The Big Picture: Scaling to 40 Curriculum Experiments

To deliver **40 Indian curriculum experiments** rapidly without burning tokens or repeating boilerplate bug fixes every session:
1. We built a **Data-Driven Generic Experiment Engine** (Blueprinted Engine Architecture).
2. The engine handles all drag-and-drop mechanics (`@dnd-kit/core`), state reducers, step progression, validation, SVG apparatus rendering, calculation evaluation, and scoring.
3. Adding a new experiment does **NOT** require writing React components or state machines. It only requires writing a **single TypeScript/JSON configuration file** (~200–300 lines) describing:
   - Metadata (class, chapter, difficulty, estimated time)
   - Apparatus list
   - Drop zones on the bench
   - Step sequence & instructions
   - Drag/click interactions & chemical effects
   - Reaction formulas & calculation questions
   - Scoring rubrics

---

## Current Shipped Experiments

### 1. Acid-Base Titration (Legacy Hardcoded Architecture)
- HCl + NaOH → NaCl + H₂O volumetric titration with phenolphthalein indicator.
- Burette clamp setup, pipette dispensing, rotatable stopcock valve with continuous flow simulation, endpoint marking, molarity calculation, scoring.

### 2. Conservation of Mass (Legacy Hardcoded Architecture)
- BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl in a sealed conical flask.
- Digital balance with live mass readout, ignition tube suspension, flask sealing, inversion mixing, molecular reaction chain animation, chemical safety modal.

### 3. Zinc + Dilute Sulphuric Acid (NEW Engine Architecture ⚡)
- Zn + H₂SO₄ → ZnSO₄ + H₂↑ (NCERT Class 10: Chemical Reactions and Equations).
- The very first experiment running 100% on the new Data-Driven Engine (`src/experiments/zinc-acid-reaction.ts`).
- Features:
  - Realistic 3D laboratory workbench countertop with reflection plane and apron.
  - Authentic 2-tier wooden test tube rack with beveled holes and drying pegs.
  - Large borosilicate test tube with volume graduation markings.
  - Metallic zinc granules at the tube bottom.
  - Translucent cyan-blue liquid with meniscus curve and surface sheen.
  - Vigorous effervescence bubbling animation (rising gas bubbles, surface fizz, vapor wisps).
  - Gas testing with burning matchstick and flame "💥 POP!" burst effect.
  - Calculation and rule-based rubric scoring.

---

## What It Is NOT

- **Not AI/ML.** All reactions, mistake handling, and scoring are deterministic rule-based logic. Never describe the platform as "AI-powered".
- **Not 3D WebGL.** Built using SVG and CSS animations for instant load times, zero GPU requirements, and flawless touch-device compatibility.
- **Not a backend app.** 100% client-side static application deployable to Cloudflare Pages or Render.
