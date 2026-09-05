/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Determination of Alkalinity of Water
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Alkalinity due to OH⁻, CO₃²⁻, and HCO₃⁻:
 *  Phenolphthalein alkalinity P = 10 · A ppm
 *  Total alkalinity M = 10 · (A + B) ppm
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const waterAlkalinity: ExperimentConfig = {
  id: 'water-alkalinity',
  title: 'Determination of Alkalinity of Water',
  subtitle: 'P = 10A ppm & M = 10(A+B) ppm (OH⁻, CO₃²⁻, HCO₃⁻)',
  description:
    'Determine the phenolphthalein (P) and total methyl orange (M) alkalinity in water using N/50 H₂SO₄ to identify hydroxide, carbonate, and bicarbonate ions.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'hard',
  themeColor: '#8b5cf6',
  icon: '🧪',
  estimatedMinutes: 20,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'conical-flask',
      component: 'ConicalFlask',
      label: '250 mL Conical Flask',
      icon: '⚗️',
      initialProps: { liquidLevel: 0, width: 130, height: 150 },
    },
    {
      id: 'burette',
      component: 'Burette',
      label: 'Burette (N/50 H₂SO₄)',
      icon: '📏',
      initialProps: { liquidLevel: 0.95, liquidColor: 'rgba(56, 189, 248, 0.5)' },
    },
    {
      id: 'water-sample',
      component: 'ReagentBottle',
      label: '100 mL Water Sample',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.45)', label: 'Alkaline H₂O' },
    },
    {
      id: 'phenolphthalein',
      component: 'Dropper',
      label: 'Phenolphthalein Indicator',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(255, 255, 255, 0.7)', label: 'Phenol' },
    },
    {
      id: 'methyl-orange',
      component: 'Dropper',
      label: 'Methyl Orange Indicator',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(249, 115, 22, 0.95)', label: 'MO' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'flask-bench-zone',
      label: 'Place Flask under Burette',
      accepts: ['conical-flask'],
      position: { x: 50, y: 62 },
      size: { width: 24, height: 32 },
      rejectMessage: 'Place the conical flask on the titration workbench.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask',
      accepts: ['water-sample', 'phenolphthalein', 'methyl-orange', 'burette'],
      position: { x: 50, y: 48 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the titration flask.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      { component: 'RetortStand', position: { x: 50, y: 45 }, scale: 1.1 },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup',
      label: '1. Place Flask',
      instruction: 'Place the clean 250 mL conical flask under the burette.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'add-sample',
      label: '2. Add 100 mL Water Sample',
      instruction: 'Pipette 100 mL of the alkaline water sample into the conical flask.',
      requiredActions: ['add-sample'],
      type: 'lab',
    },
    {
      id: 'phenolphthalein-titration',
      label: '3. Phenolphthalein Endpoint (P)',
      instruction: 'Add 1–2 drops phenolphthalein (turns pink). Titrate with N/50 H₂SO₄ until pink disappears at A = 4.2 mL. Click Continue when observed.',
      requiredActions: ['titrate-p'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'methyl-orange-titration',
      label: '4. Methyl Orange Endpoint (M)',
      instruction: 'Add 2–3 drops methyl orange (turns yellow). Continue titration until yellow changes to light pink at total titre A+B = 12.8 mL.',
      requiredActions: ['titrate-m'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '5. Calculations & Ions',
      instruction: 'Calculate P and M alkalinity in ppm (CaCO₃ equivalent) and determine the dominant ionic species.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '6. Score Breakdown',
      instruction: 'Review your laboratory precision and scoring breakdown.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'inter-place-flask',
      trigger: { type: 'drop', source: 'conical-flask', target: 'flask-bench-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'conical-flask', zoneId: 'flask-bench-zone' },
        { type: 'setFlag', key: 'flaskPlaced', value: true },
      ],
      completesAction: 'place-flask',
    },
    {
      id: 'inter-add-sample',
      trigger: { type: 'drop', source: 'water-sample', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'flaskPlaced', equals: true }],
      blockMessage: 'Place the flask on the bench first.',
      effects: [
        { type: 'setFlag', key: 'sampleAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
      ],
      completesAction: 'add-sample',
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-titrate-p',
      trigger: { type: 'drop', source: 'phenolphthalein', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'sampleAdded', equals: true }],
      blockMessage: 'Add the 100 mL water sample first.',
      effects: [
        { type: 'setFlag', key: 'pEndpointReached', value: true },
        { type: 'setVariable', key: 'volumeA', value: 4.2 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.4)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'P Endpoint: Colorless (A = 4.2 mL)' },
      ],
      completesAction: 'titrate-p',
      animation: { type: 'color-change', durationMs: 1000, animatingFlag: 'isTitrating' },
    },
    {
      id: 'inter-titrate-m',
      trigger: { type: 'drop', source: 'methyl-orange', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'pEndpointReached', equals: true }],
      blockMessage: 'Complete the phenolphthalein endpoint (P) first.',
      effects: [
        { type: 'setFlag', key: 'mEndpointReached', value: true },
        { type: 'setVariable', key: 'volumeB', value: 8.6 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(244, 114, 182, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'M Endpoint: Pink (A+B = 12.8 mL)' },
      ],
      completesAction: 'titrate-m',
      animation: { type: 'color-change', durationMs: 1000, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: 'OH⁻ + H⁺ → H₂O ; CO₃²⁻ + H⁺ → HCO₃⁻ (P end) ; HCO₃⁻ + H⁺ → H₂O + CO₂ (M end)',
    reactionType: 'Sequential Neutralization Volumetry',
    constants: {
      acidNormality: 0.02, // N/50 H2SO4
      sampleVolume: 100,    // mL
    },
    formulas: {
      phenolphthaleinAlkalinity: {
        label: 'Phenolphthalein Alkalinity P (ppm)',
        displayFormula: 'P = 10 · A = 10 · 4.2',
        computeFn: 'waterAlkalinityP',
        inputs: ['volumeA'],
        unit: 'ppm',
      },
      totalAlkalinity: {
        label: 'Total Alkalinity M (ppm)',
        displayFormula: 'M = 10 · (A + B) = 10 · (4.2 + 8.6)',
        computeFn: 'waterAlkalinityM',
        inputs: ['volumeA', 'volumeB'],
        unit: 'ppm',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: 'Water Alkalinity Calculations',
    instruction: 'From the burette readings (A = 4.2 mL for P, additional B = 8.6 mL for M, total = 12.8 mL):',
    fields: [
      {
        id: 'alkalinityP',
        label: '1. Phenolphthalein Alkalinity P (ppm): P = 10 × A  [Given A = 4.2 mL]',
        placeholder: 'e.g. 42.0',
        unit: 'ppm',
        expectedFormulaName: 'waterAlkalinityP',
        tolerance: 0.5,
        toleranceType: 'absolute',
      },
      {
        id: 'alkalinityM',
        label: '2. Total Alkalinity M (ppm): M = 10 × (A + B)  [Given A = 4.2 mL, B = 8.6 mL]',
        placeholder: 'e.g. 128.0',
        unit: 'ppm',
        expectedFormulaName: 'waterAlkalinityM',
        tolerance: 1.0,
        toleranceType: 'absolute',
      },
      {
        id: 'relationPM',
        label: '3. What condition does this sample satisfy? (Enter 1 for P < 1/2 M, 2 for P = 1/2 M, 3 for P > 1/2 M)',
        placeholder: 'e.g. 1',
        unit: 'Relation',
        expectedValue: 1, // P (42) < 0.5*M (64)
        tolerance: 0,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric ──
  scoring: [
    {
      name: 'Sample Prep & Stand Setup',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'sampleAdded', truePoints: 20 },
    },
    {
      name: 'Phenolphthalein Titre (A)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'pEndpointReached', truePoints: 20 },
    },
    {
      name: 'Methyl Orange Titre (M)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'mEndpointReached', truePoints: 20 },
    },
    {
      name: 'P & M Alkalinity Calculations',
      maxPoints: 25,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'alkalinityM',
        correctPoints: 25,
        incorrectPoints: 0,
      },
    },
    {
      name: 'P/M Relationship & Ion Analysis',
      maxPoints: 15,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'relationPM',
        correctPoints: 15,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'order-violation',
      trigger: 'drop:methyl-orange→flask-mouth-zone',
      condition: { type: 'flag', key: 'pEndpointReached', equals: false },
      message: 'Always perform the phenolphthalein titration (P) before adding methyl orange.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    volumeA: 4.2,
    volumeB: 8.6,
  },
  initialFlags: {
    flaskPlaced: false,
    sampleAdded: false,
    pEndpointReached: false,
    mEndpointReached: false,
  },
};
