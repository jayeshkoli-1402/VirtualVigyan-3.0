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
      id: 'burette',
      component: 'Burette',
      label: '50 mL Calibrated Burette',
      icon: '🧪',
      initialProps: { liquidLevel: 0, width: 90, height: 280, label: '50 mL Burette' },
    },
    {
      id: 'naoh-titrant',
      component: 'ReagentBottle',
      label: '0.1 M NaOH Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.7)', label: '0.1 M NaOH' },
    },
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
      id: 'wash-bottle',
      component: 'Dropper',
      label: 'Wash Bottle (Distilled H₂O)',
      icon: '💧',
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'clamp-zone',
      label: 'Clamp Burette on Retort Stand',
      accepts: ['burette'],
      position: { x: 50, y: 30 },
      size: { width: 22, height: 44 },
      rejectMessage: 'Mount the 50 mL burette onto the retort stand clamp.',
    },
    {
      id: 'burette-top-zone',
      label: 'Fill Burette with 0.1 M NaOH',
      accepts: ['naoh-titrant'],
      position: { x: 50, y: 12 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour 0.1 M NaOH titrant into the top of the burette.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'burette' },
    },
    {
      id: 'stirrer-plate-zone',
      label: 'Place Beaker on Stirrer',
      accepts: ['beaker'],
      position: { x: 50, y: 62 },
      size: { width: 24, height: 35 },
      rejectMessage: 'Place the reaction beaker onto the magnetic stirrer plate beneath the burette.',
    },
    {
      id: 'beaker-zone',
      label: 'Into Reaction Beaker',
      accepts: ['hcl-sample', 'buffer-4', 'buffer-9', 'wash-bottle'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the reaction beaker.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'beaker' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      {
        component: 'RetortStand',
        position: { x: 50, y: 38 },
        scale: 1.0,
        props: { label: 'Retort Stand' },
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-stand',
      label: '1. Mount Burette',
      instruction: 'Drag the 50 mL Burette from the toolbox and clamp it onto the retort stand.',
      requiredActions: ['place-burette'],
      type: 'lab',
    },
    {
      id: 'fill-burette',
      label: '2. Fill Burette with NaOH',
      instruction: 'Drag the 0.1 M NaOH bottle to the top of the burette to fill it up to the 0.0 mL mark.',
      requiredActions: ['fill-burette'],
      type: 'lab',
    },
    {
      id: 'setup-beaker',
      label: '3. Setup Stirrer & Beaker',
      instruction: 'Drag the 100 mL reaction beaker onto the magnetic stirrer plate beneath the burette.',
      requiredActions: ['place-beaker'],
      type: 'lab',
    },
    {
      id: 'calibrate-4',
      label: '4. Calibrate pH 4 Buffer',
      instruction: 'Add pH 4.00 buffer to standardize the glass electrode. Check pH meter display.',
      requiredActions: ['cal-4'],
      type: 'lab',
    },
    {
      id: 'calibrate-9',
      label: '5. Calibrate pH 9.2 Buffer',
      instruction: 'Rinse with distilled water and calibrate at pH 9.20. The instrument is now standardized.',
      requiredActions: ['cal-9'],
      type: 'lab',
    },
    {
      id: 'add-hcl',
      label: '6. Add 20 mL HCl Sample',
      instruction: 'Add 20 mL unknown HCl into the clean beaker on the stirrer. Note initial acidic pH.',
      requiredActions: ['add-hcl'],
      type: 'lab',
    },
    {
      id: 'titrate-naoh',
      label: '7. Titrate with 0.1 M NaOH',
      instruction: 'Click the right wing of the burette cork to titrate with 0.1 M NaOH while stirring. Observe the sharp pH jump from ~3.5 to ~10.5 at the 20.0 mL equivalence point.',
      requiredActions: ['titrate-naoh'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '8. Calculations & Viva',
      instruction: 'Calculate the normality and concentration strength of the unknown HCl solution.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '9. Score Breakdown',
      instruction: 'Review your potentiometric titration precision and answers.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'inter-place-burette',
      trigger: { type: 'drop', source: 'burette', target: 'clamp-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'burette', zoneId: 'clamp-zone' },
        { type: 'setFlag', key: 'burettePlaced', value: true },
      ],
      completesAction: 'place-burette',
    },
    {
      id: 'inter-fill-burette',
      trigger: { type: 'drop', source: 'naoh-titrant', target: 'burette-top-zone' },
      conditions: [{ type: 'flag', key: 'burettePlaced', equals: true }],
      blockMessage: 'Clamp the burette on the retort stand before filling it.',
      effects: [
        { type: 'setFlag', key: 'buretteFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidLevel', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: '0.1 M NaOH Burette' },
      ],
      completesAction: 'fill-burette',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-place-beaker',
      trigger: { type: 'drop', source: 'beaker', target: 'stirrer-plate-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'beaker', zoneId: 'stirrer-plate-zone' },
        { type: 'setFlag', key: 'beakerPlaced', value: true },
      ],
      completesAction: 'place-beaker',
    },
    {
      id: 'inter-cal-4',
      trigger: { type: 'drop', source: 'buffer-4', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'beakerPlaced', equals: true }],
      blockMessage: 'Place the reaction beaker on the magnetic stirrer first.',
      effects: [
        { type: 'setFlag', key: 'calibrated4', value: true },
        { type: 'setVariable', key: 'phReading', value: 4.0 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(244, 63, 94, 0.65)' },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'label', value: 'pH 4.00 Buffer' },
      ],
      completesAction: 'cal-4',
      animation: { type: 'pour', durationMs: 1800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-cal-9',
      trigger: { type: 'drop', source: 'buffer-9', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'calibrated4', equals: true }],
      blockMessage: 'Calibrate at pH 4.00 first.',
      effects: [
        { type: 'setFlag', key: 'calibrated9', value: true },
        { type: 'setVariable', key: 'phReading', value: 9.2 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(59, 130, 246, 0.65)' },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'label', value: 'pH 9.20 Buffer' },
      ],
      completesAction: 'cal-9',
      animation: { type: 'pour', durationMs: 1800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-add-hcl',
      trigger: { type: 'drop', source: 'hcl-sample', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'calibrated9', equals: true }],
      blockMessage: 'Complete two-point meter calibration first.',
      effects: [
        { type: 'setFlag', key: 'hclAdded', value: true },
        { type: 'setVariable', key: 'phReading', value: 1.85 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.45 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.55)' },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'label', value: '20 mL Unknown HCl' },
      ],
      completesAction: 'add-hcl',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-titrate-ph',
      trigger: { type: 'drop', source: 'burette', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'hclAdded', equals: true }],
      blockMessage: 'Add 20 mL HCl sample into the beaker first.',
      effects: [
        { type: 'setFlag', key: 'titrationComplete', value: true },
        { type: 'setVariable', key: 'naohVolume', value: 20.0 },
        { type: 'setVariable', key: 'phReading', value: 7.0 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.70 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.35)' },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'label', value: 'Neutralized NaCl (pH 7.0, 20.0 mL NaOH)' },
      ],
      completesAction: 'titrate-naoh',
      animation: { type: 'titrate', durationMs: 2400, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Continuous Dynamics Updates ──
  continuousUpdates: [
    {
      condition: { type: 'flag', key: 'isTitrating', equals: true },
      increments: {
        naohVolume: 2.0,
      },
      onConditionMet: [
        {
          condition: { type: 'variable', key: 'naohVolume', op: '>=', value: 20.0 },
          effects: [
            { type: 'setVariable', key: 'naohVolume', value: 20.0 },
            { type: 'setVariable', key: 'phReading', value: 11.2 },
          ],
        },
      ],
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'HCl + NaOH → NaCl + H₂O',
    constants: {
      naohMolarity: 0.1,
      hclVolume: 20.0,
    },
    colorModel: 'custom',
    colorModelArgs: {
      default: 'transparent',
    },
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Burette Setup & Filling',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'buretteFilled', truePoints: 20 },
    },
    {
      name: 'pH Meter Calibration',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'calibrated9', truePoints: 25 },
    },
    {
      name: 'Inflection Endpoint Detection',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'titrationComplete', truePoints: 25 },
    },
    {
      name: 'Normality & Strength Calculation',
      maxPoints: 30,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'hclNormality',
        correctPoints: 30,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'fill-before-clamp',
      trigger: 'drop:naoh-titrant→burette-top-zone',
      condition: { type: 'flag', key: 'burettePlaced', equals: false },
      message: 'Clamp the burette on the retort stand before filling it with NaOH.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    phReading: 7.0,
    naohVolume: 0,
    hclVolume: 20,
    naohMolarity: 0.1,
    hclNormality: 0,
    hclStrength: 0,
    stopcockOpen: 0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    beakerPlaced: false,
    calibrated4: false,
    calibrated9: false,
    hclAdded: false,
    titrationComplete: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'pH-Metric Titration Calculation',
    instruction: 'N₁V₁ = N₂V₂ → N_HCl = (V_NaOH × N_NaOH) / V_HCl | Strength = N × 36.46 g/L',
    fields: [
      {
        id: 'hclVolume',
        label: 'Volume of Unknown HCl Pipetted (V₁ in mL)',
        unit: 'mL',
        expectedValue: 20.0,
        tolerance: 0.1,
      },
      {
        id: 'naohVolume',
        label: 'Equivalence Volume from Inflection (V₂ in mL)',
        unit: 'mL',
        expectedValue: 20.0,
        tolerance: 0.2,
      },
      {
        id: 'hclNormality',
        label: 'Calculated Normality of HCl (N)',
        unit: 'N',
        expectedValue: 0.1,
        tolerance: 0.01,
      },
      {
        id: 'hclStrength',
        label: 'Strength of HCl (g/L)',
        unit: 'g/L',
        expectedValue: 3.646,
        tolerance: 0.1,
      },
    ],
  },

  // ── Viva Questions ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'Why does the glass electrode produce a potential proportional to pH?',
        options: [
          'An ion-exchange equilibrium develops across the thin hydrated glass membrane between internal and external H⁺ ions, governed by the Nernst equation.',
          'Electrons pass directly through the glass membrane.',
          'The glass dissolves in acid.',
          'Hydrogen gas is generated inside the bulb.',
        ],
        correctIndex: 0,
        explanation:
          'A hydrated gel layer on the glass membrane exchanges sodium ions for H⁺ ions. The resulting phase boundary potential follows Nernst behavior: E = E° - 0.0591 pH at 25°C.',
      },
      {
        id: 'q2',
        question: 'Why is potentiometric/pH-metric titration preferred over indicator titration for turbid or colored solutions?',
        options: [
          'It relies on electrochemical potential measurement rather than human optical perception of color changes.',
          'It requires no standardization.',
          'It works without electricity.',
          'It is faster than regular titration.',
        ],
        correctIndex: 0,
        explanation:
          'In colored, turbid, or opaque solutions, visual indicator transitions cannot be seen clearly. Potentiometric electrodes measure voltage changes accurately regardless of optical clarity.',
      },
    ],
  },
};
