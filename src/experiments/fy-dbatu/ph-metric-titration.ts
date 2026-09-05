/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: pH-Metric Titration (Acid-Base Neutralization)
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  HCl + NaOH → NaCl + H₂O
 *  Determines endpoint from the sharp inflection of the pH vs Volume curve.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const phMetricTitration: ExperimentConfig = {
  id: 'ph-metric-titration',
  title: 'pH-Metric Titration (Acid-Base)',
  subtitle: 'HCl + NaOH → NaCl + H₂O',
  description:
    'Standardize a digital pH meter with standard buffers and determine the normality and strength of an HCl solution from the sharp potentiometric inflection point.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'medium',
  themeColor: '#10b981',
  icon: '⚡',
  estimatedMinutes: 20,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'ph-meter',
      component: 'PHMeter',
      label: 'Digital pH Meter',
      icon: '📟',
      initialProps: { width: 170, height: 140 },
    },
    {
      id: 'stirrer',
      component: 'MagneticStirrer',
      label: 'Magnetic Stirrer',
      icon: '🔄',
      initialProps: { width: 140, height: 95 },
    },
    {
      id: 'beaker',
      component: 'Beaker',
      label: '100 mL Reaction Beaker',
      icon: '🥛',
      initialProps: { liquidLevel: 0, width: 120, height: 130 },
    },
    {
      id: 'burette',
      component: 'Burette',
      label: '50 mL Burette',
      icon: '📏',
      initialProps: { liquidLevel: 0.95, liquidColor: 'rgba(56, 189, 248, 0.65)' },
    },
    {
      id: 'buffer-4',
      component: 'ReagentBottle',
      label: 'pH 4.00 Buffer',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(244, 63, 94, 0.65)', label: 'pH 4.0' },
    },
    {
      id: 'buffer-9',
      component: 'ReagentBottle',
      label: 'pH 9.20 Buffer',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(59, 130, 246, 0.65)', label: 'pH 9.2' },
    },
    {
      id: 'hcl-sample',
      component: 'ReagentBottle',
      label: 'Unknown HCl Sample',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.55)', label: 'HCl Sample' },
    },
    {
      id: 'naoh-titrant',
      component: 'ReagentBottle',
      label: '0.1 M NaOH Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.5)', label: '0.1 M NaOH' },
    },
    {
      id: 'wash-bottle',
      component: 'Dropper',
      label: 'Wash Bottle (Distilled H₂O)',
      icon: '💧',
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stirrer-plate-zone',
      label: 'Place Beaker on Stirrer',
      accepts: ['beaker'],
      position: { x: 50, y: 56 },
      size: { width: 24, height: 35 },
      rejectMessage: 'Place the reaction beaker onto the magnetic stirrer plate.',
    },
    {
      id: 'beaker-zone',
      label: 'Into Reaction Beaker',
      accepts: ['hcl-sample', 'buffer-4', 'buffer-9', 'wash-bottle', 'naoh-titrant'],
      position: { x: 50, y: 46 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the reaction beaker.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'beaker' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      { component: 'RetortStand', position: { x: 50, y: 38 }, scale: 1.0 },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-beaker',
      label: '1. Setup Stirrer & Beaker',
      instruction: 'Drag the 100 mL reaction beaker onto the magnetic stirrer plate.',
      requiredActions: ['place-beaker'],
      type: 'lab',
    },
    {
      id: 'calibrate-4',
      label: '2. Calibrate pH 4 Buffer',
      instruction: 'Add pH 4.00 buffer to standardize the glass electrode. Check pH meter display.',
      requiredActions: ['cal-4'],
      type: 'lab',
    },
    {
      id: 'calibrate-9',
      label: '3. Calibrate pH 9.2 Buffer',
      instruction: 'Rinse with distilled water and calibrate at pH 9.20. The instrument is now standardized.',
      requiredActions: ['cal-9'],
      type: 'lab',
    },
    {
      id: 'add-hcl',
      label: '4. Add 20 mL HCl Sample',
      instruction: 'Add 20 mL unknown HCl into the clean beaker on the stirrer. Note initial acidic pH.',
      requiredActions: ['add-hcl'],
      type: 'lab',
    },
    {
      id: 'titrate-naoh',
      label: '5. Titrate with 0.1 M NaOH',
      instruction: 'Add 0.1 M NaOH in 0.5 mL increments while stirring. Observe the sharp pH jump from ~3.5 to ~10.5 at the 20.0 mL equivalence point.',
      requiredActions: ['titrate-naoh'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '6. Calculations & Viva',
      instruction: 'Calculate the normality and concentration strength of the unknown HCl solution.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '7. Score Breakdown',
      instruction: 'Review your laboratory precision and scoring breakdown.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'inter-place-beaker',
      trigger: { type: 'drop', source: 'beaker', target: 'stirrer-plate-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'beaker', zoneId: 'stirrer-plate-zone' },
        { type: 'setFlag', key: 'beakerPlaced', value: true },
        { type: 'setApparatusProp', apparatusId: 'stirrer', prop: 'flags', value: { stirring: true } },
      ],
      completesAction: 'place-beaker',
    },
    {
      id: 'inter-cal-4',
      trigger: { type: 'drop', source: 'buffer-4', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'beakerPlaced', equals: true }],
      blockMessage: 'Place the beaker on the stirrer first.',
      effects: [
        { type: 'setFlag', key: 'calibrated4', value: true },
        { type: 'setVariable', key: 'pH', value: 4.0 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(244, 63, 94, 0.6)' },
        { type: 'setApparatusProp', apparatusId: 'ph-meter', prop: 'variables', value: { pH: 4.0 } },
      ],
      completesAction: 'cal-4',
      animation: { type: 'pour', durationMs: 700, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-cal-9',
      trigger: { type: 'drop', source: 'buffer-9', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'calibrated4', equals: true }],
      blockMessage: 'Calibrate with pH 4 buffer first.',
      effects: [
        { type: 'setFlag', key: 'calibrated9', value: true },
        { type: 'setVariable', key: 'pH', value: 9.2 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(59, 130, 246, 0.6)' },
        { type: 'setApparatusProp', apparatusId: 'ph-meter', prop: 'variables', value: { pH: 9.2 } },
        { type: 'setApparatusProp', apparatusId: 'ph-meter', prop: 'flags', value: { calibrated: true } },
      ],
      completesAction: 'cal-9',
      animation: { type: 'pour', durationMs: 700, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-add-hcl',
      trigger: { type: 'drop', source: 'hcl-sample', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'calibrated9', equals: true }],
      blockMessage: 'Complete calibration with both pH 4 and pH 9 buffers first.',
      effects: [
        { type: 'setFlag', key: 'hclAdded', value: true },
        { type: 'setVariable', key: 'pH', value: 1.25 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.45 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.55)' },
        { type: 'setApparatusProp', apparatusId: 'ph-meter', prop: 'variables', value: { pH: 1.25 } },
      ],
      completesAction: 'add-hcl',
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-titrate-naoh',
      trigger: { type: 'drop', source: 'naoh-titrant', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'hclAdded', equals: true }],
      blockMessage: 'Add HCl sample to the beaker first.',
      effects: [
        { type: 'setFlag', key: 'endpointReached', value: true },
        { type: 'setVariable', key: 'pH', value: 7.00 },
        { type: 'setVariable', key: 'vEquivalence', value: 20.0 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.75 },
        { type: 'setApparatusProp', apparatusId: 'ph-meter', prop: 'variables', value: { pH: 7.00 } },
      ],
      completesAction: 'titrate-naoh',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: 'HCl + NaOH → NaCl + H₂O',
    reactionType: 'Potentiometric Acid-Base Titration',
    constants: {
      vHCl: 20.0,            // mL
      normalityNaOH: 0.1,    // N
      vEquivalence: 20.0,    // mL
      hclMolarMass: 36.5,    // g/mol
    },
    formulas: {
      hclNormality: {
        label: 'Normality of HCl (N₁)',
        displayFormula: 'N₁ = (N₂ · V₂) / V₁ = (0.1 · 20.0) / 20.0',
        computeFn: 'titrationConcentration',
        inputs: ['titrantMolarity', 'volumeAdded', 'analyteVolume'],
        unit: 'N',
      },
      hclStrength: {
        label: 'Strength of HCl (g/L)',
        displayFormula: 'Strength = N₁ · Equivalent Weight = 0.1 · 36.5',
        computeFn: 'hclStrength',
        inputs: ['normality'],
        unit: 'g/L',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: 'pH-Metric Titration Calculations',
    instruction: 'From the potentiometric curve inflection point (V₂ = 20.0 mL of 0.1 M NaOH for 20.0 mL HCl):',
    fields: [
      {
        id: 'normalityValue',
        label: '1. Normality of unknown HCl (in N): N₁ = (N₂ · V₂) / V₁',
        placeholder: 'e.g. 0.1',
        unit: 'N',
        expectedValue: 0.1,
        tolerance: 0.01,
        toleranceType: 'absolute',
      },
      {
        id: 'strengthValue',
        label: '2. Strength of HCl solution in g/L: Strength = N₁ × 36.5 g/L',
        placeholder: 'e.g. 3.65',
        unit: 'g/L',
        expectedFormulaName: 'hclStrength',
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'neutralPH',
        label: '3. What is the pH at the neutral equivalence point of a strong acid + strong base at 25°C?',
        placeholder: 'e.g. 7',
        unit: 'pH',
        expectedValue: 7.0,
        tolerance: 0.2,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric ──
  scoring: [
    {
      name: 'Stirrer & Electrode Setup',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'beakerPlaced', truePoints: 20 },
    },
    {
      name: 'Dual-Point pH Standardization',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'calibrated9', truePoints: 20 },
    },
    {
      name: 'Potentiometric Titration Endpoint',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'endpointReached', truePoints: 20 },
    },
    {
      name: 'HCl Normality Calculation',
      maxPoints: 20,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'normalityValue',
        correctPoints: 20,
        incorrectPoints: 0,
      },
    },
    {
      name: 'HCl Strength & Equivalence Theory',
      maxPoints: 20,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'strengthValue',
        correctPoints: 20,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'titrate-without-cal',
      trigger: 'drop:naoh-titrant→beaker-zone',
      condition: { type: 'flag', key: 'calibrated9', equals: false },
      message: 'Standardize the pH meter with both pH 4 and pH 9 buffers before titrating.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    pH: 7.0,
    temperature: 25.0,
    normality: 0.1,
    titrantMolarity: 0.1,
    volumeAdded: 20.0,
    analyteVolume: 20.0,
    vEquivalence: 20.0,
  },
  initialFlags: {
    beakerPlaced: false,
    calibrated4: false,
    calibrated9: false,
    hclAdded: false,
    endpointReached: false,
  },
};
