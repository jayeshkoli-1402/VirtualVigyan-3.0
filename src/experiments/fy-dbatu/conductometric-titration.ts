/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Conductometric Titration of Strong Acid & Strong Base
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  H⁺ + Cl⁻ + Na⁺ + OH⁻ → H₂O + Na⁺ + Cl⁻
 *  V-shaped conductance curve: high-mobility H⁺ replaced by Na⁺,
 *  followed by post-equivalence excess OH⁻.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const conductometricTitration: ExperimentConfig = {
  id: 'conductometric-titration',
  title: 'Conductometric Titration (HCl vs NaOH)',
  subtitle: 'H⁺ + Cl⁻ + Na⁺ + OH⁻ → H₂O + Na⁺ + Cl⁻',
  description:
    'Monitor electrical conductance changes during neutralization of a strong acid with a strong base to construct a conductometric V-curve and determine the equivalence point.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'hard',
  themeColor: '#3b82f6',
  icon: '📉',
  estimatedMinutes: 22,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'conductivity-bridge',
      component: 'ConductivityBridge',
      label: 'Digital Conductivity Bridge',
      icon: '⚡',
      initialProps: { width: 170, height: 140 },
    },
    {
      id: 'water-bath',
      component: 'WaterBath',
      label: 'Water Bath (Equilibration)',
      icon: '♨️',
      initialProps: { width: 160, height: 120 },
    },
    {
      id: 'beaker',
      component: 'Beaker',
      label: '100 mL Conductivity Vessel',
      icon: '🥛',
      initialProps: { liquidLevel: 0, width: 110, height: 130 },
    },
    {
      id: 'micro-burette',
      component: 'Burette',
      label: 'Micro-Burette (0.1 N NaOH)',
      icon: '📏',
      initialProps: { liquidLevel: 0.9, liquidColor: 'rgba(56, 189, 248, 0.65)' },
    },
    {
      id: 'hcl-sample',
      component: 'ReagentBottle',
      label: '10 mL Unknown HCl',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.55)', label: 'HCl' },
    },
    {
      id: 'cond-water',
      component: 'ReagentBottle',
      label: 'Conductivity Water (40 mL)',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.35)', label: 'Pure H₂O' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'bath-zone',
      label: 'Place Vessel in Water Bath',
      accepts: ['beaker'],
      position: { x: 50, y: 56 },
      size: { width: 24, height: 35 },
      rejectMessage: 'Immerse the conductivity beaker into the thermostatic water bath.',
    },
    {
      id: 'beaker-zone',
      label: 'Into Conductivity Vessel',
      accepts: ['hcl-sample', 'cond-water', 'micro-burette'],
      position: { x: 50, y: 44 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the conductivity beaker.',
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
      id: 'setup-vessel',
      label: '1. Equilibrate Vessel',
      instruction: 'Drag the conductivity beaker into the water bath to ensure temperature equilibration at 25°C.',
      requiredActions: ['place-vessel'],
      type: 'lab',
    },
    {
      id: 'add-acid-water',
      label: '2. Add Acid & Pure Water',
      instruction: 'Add 10 mL HCl sample followed by 40 mL conductivity water into the beaker.',
      requiredActions: ['add-diluted-acid'],
      type: 'lab',
    },
    {
      id: 'initial-conductance',
      label: '3. Record Initial Conductance',
      instruction: 'Conductivity cell is immersed. Observe high initial conductance (~8.40 mS/cm) due to highly mobile H⁺ ions.',
      requiredActions: [],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'titrate-naoh',
      label: '4. Add NaOH Incrementally',
      instruction: 'Add NaOH in small increments. Conductance steadily decreases to a minimum (2.10 mS/cm) at 10.0 mL, then increases sharply.',
      requiredActions: ['titrate-alkali'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '5. Calculations & Graph',
      instruction: 'Calculate the normality and concentration of HCl from the V-curve minimum intersection point.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '6. Final Score & Viva',
      instruction: 'Review your laboratory performance and scoring evaluation.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'inter-place-vessel',
      trigger: { type: 'drop', source: 'beaker', target: 'bath-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'beaker', zoneId: 'bath-zone' },
        { type: 'setFlag', key: 'vesselPlaced', value: true },
      ],
      completesAction: 'place-vessel',
    },
    {
      id: 'inter-add-acid-water',
      trigger: { type: 'drop', source: 'hcl-sample', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'vesselPlaced', equals: true }],
      blockMessage: 'Place the vessel in the water bath first.',
      effects: [
        { type: 'setFlag', key: 'acidDiluted', value: true },
        { type: 'setVariable', key: 'conductance', value: 8.40 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.55 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.6)' },
        { type: 'setApparatusProp', apparatusId: 'conductivity-bridge', prop: 'variables', value: { conductance: 8.40 } },
      ],
      completesAction: 'add-diluted-acid',
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-titrate-alkali',
      trigger: { type: 'drop', source: 'micro-burette', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'acidDiluted', equals: true }],
      blockMessage: 'Add diluted acid to the conductivity vessel first.',
      effects: [
        { type: 'setFlag', key: 'titrationDone', value: true },
        { type: 'setVariable', key: 'conductance', value: 2.10 },
        { type: 'setVariable', key: 'vEquivalence', value: 10.0 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.75 },
        { type: 'setApparatusProp', apparatusId: 'conductivity-bridge', prop: 'variables', value: { conductance: 2.10 } },
      ],
      completesAction: 'titrate-alkali',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: 'H⁺ + Cl⁻ + Na⁺ + OH⁻ → H₂O + Na⁺ + Cl⁻',
    reactionType: 'Conductometric Titration (Ionic Mobility)',
    constants: {
      vHCl: 10.0,            // mL
      normalityNaOH: 0.1,    // N
      vEquivalence: 10.0,    // mL
      hclMolarMass: 36.5,    // g/mol
    },
    formulas: {
      hclNormality: {
        label: 'Normality of HCl (N₁)',
        displayFormula: 'N₁ = (N₂ · V₂) / V₁ = (0.1 · 10.0) / 10.0',
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
    title: 'Conductometric Calculations & Ionic Mobility',
    instruction: 'From the V-curve intersection minimum (V₂ = 10.0 mL of 0.1 N NaOH for 10.0 mL HCl):',
    fields: [
      {
        id: 'normalityValue',
        label: '1. Normality of unknown HCl: N₁ = (N₂ · V₂) / V₁  [V₁=10.0 mL, N₂=0.1 N, V₂=10.0 mL]',
        placeholder: 'e.g. 0.1',
        unit: 'N',
        expectedValue: 0.1,
        tolerance: 0.01,
        toleranceType: 'absolute',
      },
      {
        id: 'strengthValue',
        label: '2. Strength of HCl in g/L: Strength = N₁ × 36.5 g/L',
        placeholder: 'e.g. 3.65',
        unit: 'g/L',
        expectedFormulaName: 'hclStrength',
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'conductanceMinimum',
        label: '3. What was the measured conductance at the equivalence point minimum (in mS/cm)?',
        placeholder: 'e.g. 2.10',
        unit: 'mS/cm',
        expectedValue: 2.10,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric ──
  scoring: [
    {
      name: 'Vessel Setup & Bath Equilibration',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'vesselPlaced', truePoints: 20 },
    },
    {
      name: 'Conductivity Cell & Dilution',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'acidDiluted', truePoints: 20 },
    },
    {
      name: 'V-Curve Extrapolation Endpoint',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'titrationDone', truePoints: 20 },
    },
    {
      name: 'Normality Calculation',
      maxPoints: 20,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'normalityValue',
        correctPoints: 20,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Strength & Conductance Minimum',
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
      id: 'titrate-without-acid',
      trigger: 'drop:micro-burette→beaker-zone',
      condition: { type: 'flag', key: 'acidDiluted', equals: false },
      message: 'Prepare and dilute the acid solution before adding alkali.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    conductance: 8.40,
    normality: 0.1,
    titrantMolarity: 0.1,
    volumeAdded: 10.0,
    analyteVolume: 10.0,
    vEquivalence: 10.0,
  },
  initialFlags: {
    vesselPlaced: false,
    acidDiluted: false,
    titrationDone: false,
  },
};
