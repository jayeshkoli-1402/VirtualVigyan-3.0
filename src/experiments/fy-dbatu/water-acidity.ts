/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Determination of Acidity of Water Sample
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Part A: Methyl Orange Acidity (Mineral Acidity at pH 4.5): Y × 10 ppm
 *  Part B: Phenolphthalein Acidity (Total Acidity at pH 8.3): Z × 10 ppm
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const waterAcidity: ExperimentConfig = {
  id: 'water-acidity',
  title: 'Acidity of Water Sample',
  subtitle: 'Mineral (pH 4.5) & Total Acidity (pH 8.3)',
  description:
    'Differentiate mineral acidity and total carbon dioxide acidity in water by sequential neutralization with N/50 NaOH using methyl orange and phenolphthalein indicators.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'medium',
  themeColor: '#f97316',
  icon: '🚰',
  estimatedMinutes: 18,

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
      label: 'Burette (N/50 NaOH)',
      icon: '📏',
      initialProps: { liquidLevel: 0.95, liquidColor: 'rgba(56, 189, 248, 0.5)' },
    },
    {
      id: 'water-sample',
      component: 'ReagentBottle',
      label: '100 mL Water Sample',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.45)', label: 'Sample' },
    },
    {
      id: 'thiosulphate',
      component: 'Dropper',
      label: 'N/10 Na₂S₂O₃ (Dechlorinator)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.5)', label: 'Na₂S₂O₃' },
    },
    {
      id: 'methyl-orange',
      component: 'Dropper',
      label: 'Methyl Orange Indicator',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(249, 115, 22, 0.95)', label: 'Methyl Orange' },
    },
    {
      id: 'phenolphthalein',
      component: 'Dropper',
      label: 'Phenolphthalein Indicator',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(255, 255, 255, 0.7)', label: 'Phenolphthalein' },
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
      rejectMessage: 'Place the flask under the burette stand.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask',
      accepts: ['water-sample', 'thiosulphate', 'methyl-orange', 'phenolphthalein', 'burette'],
      position: { x: 50, y: 48 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the conical flask.',
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
      instruction: 'Place the clean conical flask on the titration bench.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'sample-prep',
      label: '2. Add 100 mL Water & Dechlorinate',
      instruction: 'Add 100 mL water sample and add 1 drop N/10 Na₂S₂O₃ to destroy residual chlorine.',
      requiredActions: ['add-water-sample'],
      type: 'lab',
    },
    {
      id: 'part-a-titration',
      label: '3. Part A — Methyl Orange Acidity',
      instruction: 'Add methyl orange (turns red). Titrate with N/50 NaOH until red turns to yellow at Y = 2.4 mL. Click Continue when observed.',
      requiredActions: ['titrate-methyl-orange'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'part-b-titration',
      label: '4. Part B — Total Acidity',
      instruction: 'Add phenolphthalein. Titrate with N/50 NaOH until faint pink persists for 30 seconds at Z = 5.4 mL. Click Continue when observed.',
      requiredActions: ['titrate-phenolphthalein'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '5. Calculations & Viva',
      instruction: 'Calculate methyl orange acidity and total phenolphthalein acidity in ppm (mg/L CaCO₃ equivalent).',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '6. Score Breakdown',
      instruction: 'Review your laboratory accuracy and answers.',
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
      blockMessage: 'Place the flask under the burette first.',
      effects: [
        { type: 'setFlag', key: 'sampleAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
      ],
      completesAction: 'add-water-sample',
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-titrate-mo',
      trigger: { type: 'drop', source: 'methyl-orange', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'sampleAdded', equals: true }],
      blockMessage: 'Add the 100 mL water sample first.',
      effects: [
        { type: 'setFlag', key: 'moEndpointReached', value: true },
        { type: 'setVariable', key: 'volumeY', value: 2.4 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(250, 204, 21, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'MO End: Yellow (Y = 2.4 mL)' },
      ],
      completesAction: 'titrate-methyl-orange',
      animation: { type: 'color-change', durationMs: 1000, animatingFlag: 'isTitrating' },
    },
    {
      id: 'inter-titrate-ph',
      trigger: { type: 'drop', source: 'phenolphthalein', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'moEndpointReached', equals: true }],
      blockMessage: 'Complete Part A methyl orange titration first.',
      effects: [
        { type: 'setFlag', key: 'phEndpointReached', value: true },
        { type: 'setVariable', key: 'volumeZ', value: 5.4 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(244, 114, 182, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Total End: Persistent Pink (Z = 5.4 mL)' },
      ],
      completesAction: 'titrate-phenolphthalein',
      animation: { type: 'color-change', durationMs: 1000, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: 'Mineral Acids / H₂CO₃ + NaOH → Na-salts + H₂O',
    reactionType: 'Acid-Base Differential Neutralization',
    constants: {
      naohNormality: 0.02, // N/50
      sampleVolume: 100,   // mL
    },
    formulas: {
      moAcidity: {
        label: 'Methyl Orange Acidity (ppm)',
        displayFormula: 'MO Acidity = Y · 10 = 2.4 · 10',
        computeFn: 'waterAcidity',
        inputs: ['volumeY'],
        unit: 'ppm',
      },
      phAcidity: {
        label: 'Phenolphthalein Total Acidity (ppm)',
        displayFormula: 'Total Acidity = Z · 10 = 5.4 · 10',
        computeFn: 'waterAcidity',
        inputs: ['volumeZ'],
        unit: 'ppm',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: 'Water Acidity Calculations',
    instruction: 'From the burette readings (Y = 2.4 mL for Methyl Orange, Z = 5.4 mL for Phenolphthalein):',
    fields: [
      {
        id: 'mineralAcidity',
        label: '1. Methyl Orange / Mineral Acidity (ppm): Acidity = Y × 10  [Given Y = 2.4 mL]',
        placeholder: 'e.g. 24.0',
        unit: 'ppm',
        expectedValue: 24.0,
        tolerance: 0.5,
        toleranceType: 'absolute',
      },
      {
        id: 'totalAcidity',
        label: '2. Phenolphthalein / Total Acidity (ppm): Acidity = Z × 10  [Given Z = 5.4 mL]',
        placeholder: 'e.g. 54.0',
        unit: 'ppm',
        expectedValue: 54.0,
        tolerance: 0.5,
        toleranceType: 'absolute',
      },
      {
        id: 'phCutoff',
        label: '3. What approximate pH corresponds to the methyl orange endpoint cutoff?',
        placeholder: 'e.g. 4.5',
        unit: 'pH',
        expectedValue: 4.5,
        tolerance: 0.3,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric ──
  scoring: [
    {
      name: 'Apparatus Placement & Dechlorination',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'sampleAdded', truePoints: 20 },
    },
    {
      name: 'Part A Methyl Orange Titration (Y)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'moEndpointReached', truePoints: 20 },
    },
    {
      name: 'Part B Phenolphthalein Titration (Z)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'phEndpointReached', truePoints: 20 },
    },
    {
      name: 'Mineral Acidity Calculation',
      maxPoints: 20,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'mineralAcidity',
        correctPoints: 20,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Total Acidity & pH Theory Viva',
      maxPoints: 20,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'totalAcidity',
        correctPoints: 20,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'skip-sample',
      trigger: 'drop:methyl-orange→flask-mouth-zone',
      condition: { type: 'flag', key: 'sampleAdded', equals: false },
      message: 'Add 100 mL water sample to the conical flask before adding indicator.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    volumeY: 2.4,
    volumeZ: 5.4,
    naohVolume: 5.4,
  },
  initialFlags: {
    flaskPlaced: false,
    sampleAdded: false,
    moEndpointReached: false,
    phEndpointReached: false,
  },
};
