/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Determination of Chloride by Mohr's Method
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Precipitation titration:
 *  Ag⁺ + Cl⁻ → AgCl↓ (white precipitate)
 *  2Ag⁺ + CrO₄²⁻ → Ag₂CrO₄↓ (brick-red precipitate at endpoint)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const chlorideMohrMethod: ExperimentConfig = {
  id: 'chloride-mohr-method',
  title: "Chloride Content by Mohr's Method",
  subtitle: 'Ag⁺ + Cl⁻ → AgCl↓ (white) → Ag₂CrO₄↓ (brick-red)',
  description:
    'Estimate chloride ion concentration in a water sample by argentometric precipitation titration using potassium chromate indicator.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'medium',
  themeColor: '#e11d48',
  icon: '🧂',
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
      id: 'burette-stand',
      component: 'Burette',
      label: 'Burette (0.02 N AgNO₃)',
      icon: '📏',
      initialProps: { liquidLevel: 0.9, liquidColor: 'rgba(224, 242, 254, 0.4)' },
    },
    {
      id: 'nacl-standard',
      component: 'ReagentBottle',
      label: '0.02 N NaCl Standard',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.4)', label: 'Std NaCl' },
    },
    {
      id: 'k2cro4-indicator',
      component: 'Dropper',
      label: '5% K₂CrO₄ Indicator',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(250, 204, 21, 0.95)', label: 'K₂CrO₄' },
    },
    {
      id: 'water-sample',
      component: 'ReagentBottle',
      label: 'Water Sample (Chloride)',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.5)', label: 'Sample' },
    },
    {
      id: 'na2co3-buffer',
      component: 'ReagentBottle',
      label: 'Chloride-free Na₂CO₃',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(255, 255, 255, 0.6)', label: 'Na₂CO₃' },
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
      rejectMessage: 'Place the conical flask under the burette tip.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask',
      accepts: ['nacl-standard', 'k2cro4-indicator', 'water-sample', 'na2co3-buffer', 'burette-stand'],
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
      id: 'setup-flask',
      label: '1. Place Flask',
      instruction: 'Place the clean 250 mL conical flask beneath the burette stand.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'pipette-sample',
      label: '2. Add 10 mL Water Sample',
      instruction: 'Pipette 10 mL of the water sample into the flask. Add a pinch of chloride-free Na₂CO₃.',
      requiredActions: ['add-sample'],
      type: 'lab',
    },
    {
      id: 'add-chromate',
      label: '3. Add K₂CrO₄ Indicator',
      instruction: 'Add 3–4 drops of 5% potassium chromate indicator. Note the bright yellow color.',
      requiredActions: ['add-indicator'],
      type: 'lab',
    },
    {
      id: 'titrate-ag',
      label: '4. Titrate with AgNO₃',
      instruction: 'Titrate with 0.02 N AgNO₃. Curdy white AgCl forms first. Stop when a permanent brick-red Ag₂CrO₄ precipitate appears at 8.2 mL.',
      requiredActions: ['titrate-ag'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '5. Calculations & Viva',
      instruction: 'Calculate the chloride content in mg/L (ppm) using the burette reading (8.2 mL of 0.02 N AgNO₃).',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '6. Score & Evaluation',
      instruction: 'Review your precipitation titration accuracy and answers.',
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
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
      ],
      completesAction: 'add-sample',
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-add-chromate',
      trigger: { type: 'drop', source: 'k2cro4-indicator', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'sampleAdded', equals: true }],
      blockMessage: 'Add the chloride water sample to the flask before adding indicator.',
      effects: [
        { type: 'setFlag', key: 'chromateAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(250, 204, 21, 0.85)' },
      ],
      completesAction: 'add-indicator',
      animation: { type: 'color-change', durationMs: 600, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-ag',
      trigger: { type: 'drop', source: 'burette-stand', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'chromateAdded', equals: true }],
      blockMessage: 'Add K₂CrO₄ indicator before starting the AgNO₃ titration.',
      effects: [
        { type: 'setFlag', key: 'brickRedFormed', value: true },
        { type: 'setVariable', key: 'buretteReading', value: 8.2 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.55 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(185, 28, 28, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Brick-Red Ag₂CrO₄ Endpoint' },
      ],
      completesAction: 'titrate-ag',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: 'Ag⁺ + Cl⁻ → AgCl↓ (white), 2Ag⁺ + CrO₄²⁻ → Ag₂CrO₄↓ (brick red)',
    reactionType: "Precipitation Titration (Mohr's Argentometry)",
    constants: {
      normalityAgNO3: 0.02,
      sampleVolume: 10.0,
      chlorideEqWt: 35.5,
    },
    formulas: {
      chlorideContent: {
        label: 'Chloride Concentration (mg/L or ppm)',
        displayFormula: 'Chloride = (N_AgNO₃ · V · 35.5 · 1000) / V_sample = (0.02 · 8.2 · 35.5 · 1000) / 10',
        computeFn: 'chlorideMohr',
        inputs: ['normalityAgNO3', 'buretteReading', 'sampleVolume'],
        unit: 'mg/L',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: 'Mohr Titration Chloride Calculations',
    instruction: 'From the concordant titre reading (V = 8.2 mL of 0.02 N AgNO₃ for 10.0 mL water sample):',
    fields: [
      {
        id: 'chloridePpm',
        label: '1. Chloride concentration in water (mg/L): Chloride = (N·V·35.5·1000)/V_sample [N=0.02, V=8.2 mL, V_sample=10 mL]',
        placeholder: 'e.g. 582.2',
        unit: 'mg/L',
        expectedFormulaName: 'chlorideMohr',
        tolerance: 5.0,
        toleranceType: 'absolute',
      },
      {
        id: 'precipitateOrder',
        label: '2. Which precipitate forms first during titration due to lower solubility product (Ksp)?',
        placeholder: 'Enter AgCl or Ag2CrO4',
        unit: 'Precipitate',
        expectedValue: 1, // mapped conceptual check
        tolerance: 1,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric ──
  scoring: [
    {
      name: 'Apparatus & Reagent Prep',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'flaskPlaced', truePoints: 20 },
    },
    {
      name: 'Indicator Addition (Yellow K₂CrO₄)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'chromateAdded', truePoints: 20 },
    },
    {
      name: 'Brick-Red Endpoint Precision',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'brickRedFormed', truePoints: 20 },
    },
    {
      name: 'Chloride Concentration (mg/L)',
      maxPoints: 25,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'chloridePpm',
        correctPoints: 25,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Precipitation Principle Viva',
      maxPoints: 15,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'precipitateOrder',
        correctPoints: 15,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'titrate-without-indicator',
      trigger: 'drop:burette-stand→flask-mouth-zone',
      condition: { type: 'flag', key: 'chromateAdded', equals: false },
      message: 'Add K₂CrO₄ indicator to detect the precipitation endpoint.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    normalityAgNO3: 0.02,
    buretteReading: 8.2,
    sampleVolume: 10.0,
  },
  initialFlags: {
    flaskPlaced: false,
    sampleAdded: false,
    chromateAdded: false,
    brickRedFormed: false,
  },
};
