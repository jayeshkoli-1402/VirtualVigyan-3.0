# VirtualVigyan — Roadmap & Current Priorities

## Current Phase: Curriculum Scaling via Experiment Engine (v1.0)

The **Generic Experiment Engine** is built and verified. The platform now supports adding any NCERT/CBSE experiment through pure configuration files with zero React UI coding.

---

## 🔴 Current Priority: Batch Adding the 40 Indian Curriculum Experiments

The engine pipeline is verified with the first engine-powered experiment (*Zinc + Dilute Sulphuric Acid*). The next major goal is to populate the remaining experiments for Classes 9–12 across CBSE/NCERT.

> [!TIP]
> Experiments are provided using the standardized format defined in [experiment-template.md](file:///x:/TECH/Projects/virtualvigyan%202.0/.agent/experiment-template.md). Future agents must refer to this document when converting user experiment data into `ExperimentConfig` objects.


### Class 9 Chemistry Experiments
- [ ] Preparation of True Solution, Suspension, and Colloidal Solution
- [ ] Separation of Components from a Mixture (Sublimation, Filtration)
- [ ] Melting Point of Ice & Boiling Point of Water
- [ ] Verification of the Law of Conservation of Mass *(already has legacy version; can port to engine)*

### Class 10 Chemistry Experiments
- [x] **Reaction of Zinc with Dilute Sulphuric Acid** (`src/experiments/zinc-acid-reaction.ts`) — *Completed & verified with 3D bench, bubbling effervescence, and pop flame test.*
- [ ] Action of Water on Quicklime (Combination Reaction, Exothermic)
- [ ] Action of Heat on Ferrous Sulphate Crystals (Decomposition Reaction)
- [ ] Reaction of Iron Nails in Copper Sulphate Solution (Displacement Reaction)
- [ ] Reaction between Sodium Sulphate and Barium Chloride (Double Displacement)
- [ ] Testing pH of Samples (HCl, NaOH, Ethanoic Acid, Lemon Juice, Water)
- [ ] Reaction of Acids and Bases with Metals and Carbonates
- [ ] Reactivity Series of Metals (Zn, Fe, Cu, Al in various salt solutions)
- [ ] Properties of Acetic Acid / Ethanoic Acid
- [ ] Cleaning Capacity of Soap in Soft and Hard Water

### Class 11 Chemistry Experiments
- [ ] Acid-Base Titration (Oxalic Acid vs KMnO₄ / NaOH vs HCl) *(already has legacy version)*
- [ ] Preparation of Standard Solution of Oxalic Acid
- [ ] Chemical Equilibrium: Shift in equilibrium between ferric and thiocyanate ions
- [ ] Determination of pH using pH meter and universal indicator
- [ ] Purification of Chemical Substances by Crystallization
- [ ] Qualitative Analysis: Detection of Nitrogen, Sulphur, Halogens in organic compounds

### Class 12 Chemistry Experiments
- [ ] Redox Titration: Mohr's Salt vs KMnO₄
- [ ] Surface Chemistry: Preparation of Lyophilic and Lyophobic Sols
- [ ] Chemical Kinetics: Effect of concentration and temperature on reaction rate of Na₂S₂O₃ and HCl
- [ ] Thermochemistry: Enthalpy of neutralization of strong acid with strong base
- [ ] Electrochemistry: Variation of cell potential with concentration (Daniel Cell)
- [ ] Functional Group Identification (Alcohols, Phenols, Aldehydes, Ketones, Carboxylic acids)
- [ ] Preparation of Organic Compounds (Acetanilide, Iodoform)

### F.Y. B.Tech (DBATU Engineering Chemistry Practicals)
- [x] **Exp 1: Determination of Viscosity by Ostwald’s Viscometer** (`src/experiments/fy-dbatu/viscosity-ostwald.ts`)
- [x] **Exp 3: pH-Metric Titration — Acid Base Titration** (`src/experiments/fy-dbatu/ph-metric-titration.ts`)
- [x] **Exp 4: Conductometric Titration of Strong Acid & Base** (`src/experiments/fy-dbatu/conductometric-titration.ts`)
- [x] **Exp 5: Chloride Content by Mohr's Method** (`src/experiments/fy-dbatu/chloride-mohr-method.ts`)
- [x] **Exp 6: Acidity of Water Sample (Mineral & Total)** (`src/experiments/fy-dbatu/water-acidity.ts`)
- [x] **Exp 7: Alkalinity of Water Sample (P & M)** (`src/experiments/fy-dbatu/water-alkalinity.ts`)
- [x] **Exp 8: Acid Value of Vegetable Oil** (`src/experiments/fy-dbatu/acid-value-oil.ts`)
- [x] **Exp 9: Dissolved Oxygen by Winkler's Method** (`src/experiments/fy-dbatu/dissolved-oxygen-winkler.ts`)
- [x] **Exp 10: Hardness of Water by EDTA Method** (`src/experiments/fy-dbatu/water-hardness-edta.ts`)

---

## 🟡 P1 — Engine Polish & Enhancements

- [x] **Platform-wide Dark Theme** — Modern sleek dark lab mode with toggle button and localStorage persistence.
- [x] **Curriculum Categorization** — Selector filtering tabs for All, F.Y. B.Tech (DBATU), and Classes 9–12.
- [x] **3D-styled Laboratory Workbench Table** — Completed with depth reflection plane and cabinet apron.
- [x] **Zoomed-in canvas scaling** — Apparatus sized generously so no canvas space is wasted.
- [x] **Translucent vivid liquid rendering** — Cyan-blue tint with meniscus curve and reflections.
- [x] **Animated effervescence bubbling & POP flame burst** — Dynamic visual reaction effects.
- [x] **Explicit button-advance control** — `advanceMode: 'button'` allows students to observe reactions before manually advancing to calculations.
- [ ] **Sound effects (Optional Web Audio)** — Subtle audio pops on hydrogen test, bubbling audio loop during effervescence.
- [ ] **Score persistence** — LocalStorage caching for student scores.
- [ ] **Touch device fine-tuning** — Sensor testing on low-end Android tablets.

---

## 🟢 P2 — Long-Term Enhancements

- [ ] Multi-subject expansion (Physics, Biology experiments)
- [ ] Bilingual UI (English + Hindi)
- [ ] Experiment replay recording

---

## ⛔ Out of Scope — Do Not Build

- Backend database / server
- User authentication / accounts
- AI/ML-based grading (Strict rule: deterministic rule-based scoring only)
- Three.js / WebGL 3D scene graphs (Strict rule: 2D SVG only)

---

## Recently Completed

- [x] **Generic Experiment Engine Core** (`experimentConfig.ts`, `experimentRunner.ts`, `chemistryLib.ts`, `scoringEngine.ts`, `validationEngine.ts`)
- [x] **18+ SVG Apparatus Library** (`src/apparatus/`)
- [x] **GenericLab 3-Panel Suite** (`GenericLab.tsx`, `GenericBench.tsx`, `GenericToolbox.tsx`, `GenericInstructions.tsx`, `GenericCalculation.tsx`, `GenericResults.tsx`)
- [x] **First Engine Experiment** (`src/experiments/zinc-acid-reaction.ts`)
- [x] **3D Workbench Table Surface, Zoomed-In Layout, Vivid Liquid, and Pop Effect**
- [x] **Experiment Selector integration with ⚡ New Engine badge**
