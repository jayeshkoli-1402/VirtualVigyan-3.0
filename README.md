npm run dev


# VirtualVigyan — Titration Demo

An interactive 2D acid-base titration simulator built with React, TypeScript, and Vite.

## What This Is

A scoped MVP demonstrating one complete chemistry experiment end-to-end:

- **Experiment:** Acid-base titration — unknown HCl (flask) titrated with known NaOH (burette) using phenolphthalein indicator
- **Interaction:** Dropwise titration with real-time flask color change, endpoint marking, and concentration calculation
- **Feedback:** Deterministic rule-based mistake detection and scoring (not AI/ML)

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## How It Works

### Experiment Flow

1. **Select Experiment** — Choose the acid-base titration
2. **Set Up Apparatus** — Review the burette (NaOH 0.1 M) and flask (25 mL HCl, unknown concentration)
3. **Add Indicator** — Add phenolphthalein to the flask
4. **Titrate** — Click "Add Drop" (+0.1 mL each) and watch the flask color change
5. **Mark Endpoint** — Click when the first persistent pale pink appears
6. **Calculate** — Compute the unknown HCl concentration from your recorded volume
7. **Results** — See your score breakdown and detailed feedback

### Chemistry Rules (hardcoded for this demo)

| Parameter | Value |
|---|---|
| HCl Volume | 25 mL |
| HCl Concentration (hidden) | 0.1 M |
| NaOH Concentration (known) | 0.1 M |
| Equivalence Point | 25 mL NaOH |
| Drop Size | 0.1 mL |

### Color Behavior

- **0–22.5 mL:** Colorless (acidic solution)
- **22.5–25 mL:** Faint pink fading in (approaching equivalence)
- **~25 mL:** Pale persistent pink (correct endpoint)
- **>26 mL:** Deep magenta (overshot)

### Mistake Detection (Rule-Based)

All mistake detection uses deterministic threshold checks:

- Marking endpoint before any visible color change → blocked with guidance message
- Marking after deep overshoot (>27 mL) → allowed but flagged with explanation
- Attempting to titrate without indicator → blocked with prompt
- Calculation error >10% from student's own recorded volume → shows worked formula

### Scoring (out of 100)

| Category | Criteria | Points |
|---|---|---|
| Endpoint Accuracy | ±0.5 mL | 40 |
| | ±1.5 mL | 25 |
| | Beyond ±1.5 mL | 10 |
| Calculation | Correct (±10%) | 40 |
| | Incorrect | 10 |
| Indicator Added | Before titrating | 10 |
| No Overshoot | Endpoint ≤27 mL | 10 |

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8**
- **2D SVG** for the lab scene (burette, flask, liquid levels, color change)
- **Tailwind CSS v4** for styling
- **State:** `useReducer` — no external state library needed
- **Persistence:** None (browser state only)

## Design Decisions

- **2D by design:** The interaction model (burette, flask, color change, endpoint detection) works fully in 2D. 3D visualization is future scope, not a placeholder.
- **No backend:** Single-page app, deployable as a static site to Vercel/Netlify.
- **No AI/ML:** All validation and scoring is deterministic rule-based logic.

## Build for Production

```bash
npm run build
```

Output goes to `dist/` — deploy to any static hosting.

## What Would Be Needed for a Second Experiment

1. Extract the experiment-specific constants and rules into a config/plugin pattern
2. Add an experiment selector on the SELECT screen
3. Create new chemistry rules (constants, color functions, validation thresholds) for the new experiment
4. Potentially add new SVG components for different apparatus
5. The state machine and scoring framework are already generic enough to support multiple experiments
