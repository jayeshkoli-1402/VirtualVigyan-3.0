# VirtualVigyan — Experiment Input Specification & Template

This document defines the standardized data format for adding new NCERT/CBSE experiments (Classes 9–12) into the VirtualVigyan Experiment Engine.

---

## How to Provide Experiment Data (Copy-Paste Format)

When adding a batch of experiments (e.g., 7–10 experiments at a time), format each experiment using the template below. You don't need to write any code or JSON—just fill in the natural language details:

```markdown
### Experiment [Number]: [Title]
- **Class:** [9 / 10 / 11 / 12]
- **Chapter:** [e.g. Chemical Reactions and Equations / Acids, Bases and Salts]
- **Difficulty:** [easy / medium / hard]
- **Estimated Time:** [e.g. 10 mins]

#### 1. Apparatus & Reagents Needed
- **On Lab Bench initially:** [e.g., Test Tube Stand, Clean Test Tube]
- **In Toolbox (Reagents / Tools):** [e.g., Dilute Sulfuric Acid bottle, Zinc Granules container, Burning Splinter / Matchstick]

#### 2. Step-by-Step Procedure & Visual Effects
1. **[Step Name]:** [Action to perform, e.g. "Drag Test Tube into rack slot #1"]
   - *Visual feedback:* [e.g. Test tube snaps upright into the rack]
2. **[Step Name]:** [Action, e.g. "Drag Zinc granules into test tube"]
   - *Visual feedback:* [e.g. Metallic grey zinc granules appear at bottom of test tube]
3. **[Step Name]:** [Action, e.g. "Pour 5 mL Dilute H2SO4 into test tube"]
   - *Visual feedback:* [e.g. Liquid level rises with cyan-blue color; vigorous effervescence with rising H2 bubbles begins]
4. **[Step Name (Observation)]:** [Action, e.g. "Observe reaction and effervescence"]
   - *Reaction equation:* Zn + H2SO4 -> ZnSO4 + H2 ^
   - *Advance mode:* [Button — user observes reaction and clicks 'Continue']
5. **[Step Name]:** [Action, e.g. "Bring burning matchstick to test tube mouth"]
   - *Visual feedback:* [e.g. Gas burns with a characteristic '💥 POP!' flame burst]

#### 3. Common Mistakes to Catch (Validation)
- [e.g., "Trying to test for gas before acid is added" -> Warning: "Add dilute acid to zinc first to generate gas!"]
- [e.g., "Adding wrong reagent" -> Warning: "Use dilute H2SO4, not concentrated acid!"]

#### 4. Calculations / Observation Questions (Optional or Required)
- **Question 1:** [e.g. "Calculate the moles of Zinc reacted if 0.65 g Zn is consumed (Atomic mass of Zn = 65.4 g/mol)"]
  - *Formula:* Mass / Molar Mass = 0.65 / 65.4
  - *Expected Answer:* 0.00994 mol (Acceptable tolerance: +/- 0.0005)
  - *Unit:* mol
- **Question 2 (Viva / Conceptual):** [e.g. "Identify the gas released during this displacement reaction"]
  - *Expected Answer:* Hydrogen (H2)

#### 5. Scoring Breakdown (100 Points Total)
- Setup & Procedure: [e.g. 60 pts]
- Calculations & Concept: [e.g. 40 pts]
- Mistake Deduction: [e.g. -10 pts per incorrect action]
```

---

## Concrete Example: Displacement Reaction (Fe + CuSO₄)

Here is how a real experiment submission looks:

```markdown
### Experiment: Action of Iron Nails on Copper Sulphate Solution
- **Class:** 10
- **Chapter:** Chemical Reactions and Equations
- **Difficulty:** easy
- **Estimated Time:** 10 mins

#### 1. Apparatus & Reagents Needed
- **On Lab Bench initially:** Test Tube Stand, Test Tube with 10 mL blue Copper Sulphate solution
- **In Toolbox:** Clean Iron Nail, Sandpaper, Thread/Tongs

#### 2. Step-by-Step Procedure & Visual Effects
1. **Prepare Iron Nail:** Drag sandpaper over iron nail to remove rust/oxide layer.
   - *Visual:* Nail turns shiny silver-grey.
2. **Immerse Nail:** Drag clean iron nail into the test tube containing blue CuSO4.
   - *Visual:* Nail sits immersed in the blue liquid.
3. **Wait & Observe (Reaction):** Observe displacement reaction over 15 minutes.
   - *Visual:* Blue color of CuSO4 gradually fades to light pale green (FeSO4), and reddish-brown copper deposit forms on the surface of the iron nail.
   - *Equation:* Fe (s) + CuSO4 (aq) -> FeSO4 (aq) + Cu (s)
   - *Advance mode:* Button ("Continue to Observation Questions")
4. **Remove Nail:** Drag tongs to remove nail and inspect deposit.
   - *Visual:* Reddish-brown copper layer clearly visible on the nail.

#### 3. Common Mistakes
- Dropping nail without cleaning -> Warning: "Clean the iron nail with sandpaper first to remove the oxide coating!"

#### 4. Questions & Calculations
- **Question 1:** "What type of chemical reaction took place?"
  - Expected: Displacement reaction
- **Question 2:** "Why did the blue solution turn light green?"
  - Expected: Formation of FeSO4 (ferrous sulphate)

#### 5. Scoring
- Proper cleaning & immersion: 50 pts
- Correct observation & removal: 20 pts
- Conceptual questions: 30 pts
```

---

## Agent Instructions for Ingesting Submissions

When the user provides 7–10 experiments in this format:
1. **Create Config Files:** For each experiment, create `src/experiments/<experiment-id>.ts` implementing `ExperimentConfig`.
2. **Check Apparatus Registry:** Match apparatus to `src/apparatus/index.tsx`. If a new SVG apparatus is needed (e.g. Sandpaper, Iron Nail, China Dish), add it to `src/apparatus/index.tsx` and export it in `APPARATUS_REGISTRY`.
3. **Enforce Step & Grading Conventions (from `.agent/conventions.md`):**
   - Observation / reaction steps MUST use `advanceMode: 'button'`.
   - Steps with physical actions MUST have `requiredActions: [...]`.
   - Questions MUST be hooked into `scoring` with `calculationCorrect` evaluator items (worth 30–40% of score).
   - Liquids MUST use vivid translucent colors with meniscus curves (e.g. cyan-blue, copper-sulfate blue `#0284c7`, pale green ferrous sulfate `#86efac`).
4. **Register in Index:** Import and add each new experiment to `experiments` in `src/experiments/index.ts`.
5. **Update `.agent/roadmap.md`:** Check off the newly implemented experiments.
