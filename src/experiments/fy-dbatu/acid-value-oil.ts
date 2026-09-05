/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Acid Value of Vegetable Oil
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  R-COOH + KOH → R-COOK + H₂O
 *  Acid Value = (V · 5.6) / W (mg KOH / g oil)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const acidValueOil: ExperimentConfig = {
  id: 'acid-value-oil',
  title: 'Acid Value of Vegetable Oil',
  subtitle: 'Acid Value = (V · 5.6) / W (mg KOH/g oil)',
  description:
    'Determine the degree of rancidity and free fatty acid content in vegetable oil by titration against 0.1 N KOH in warm neutral alcohol.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'easy',
  themeColor: '#eab308',
  icon: '🌻',
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
      id: 'water-bath',
      component: 'WaterBath',
      label: 'Water Bath (Warm Reflux)',
      icon: '♨️',
      initialProps: { width: 150, height: 110 },
    },
    {
      id: 'burette',
      component: 'Burette',
      label: 'Burette (0.1 N KOH)',
      icon: '📏',
      initialProps: { liquidLevel: 0.9, liquidColor: 'rgba(56, 189, 248, 0.5)' },
    },
    {
      id: 'oil-sample',
      component: 'ReagentBottle',
      label: '5.0 g Vegetable Oil',
      icon: '🫒',
      initialProps: { liquidColor: 'rgba(234, 179, 8, 0.85)', label: 'Oil Sample' },
    },
    {
      id: 'neutral-alcohol',
      component: 'ReagentBottle',
      label: 'Neutral Ethanol (50 mL)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.5)', label: 'Neutral EtOH' },
    },
    {
      id: 'phenolphthalein',
      component: 'Dropper',
      label: 'Phenolphthalein Indicator',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(255, 255, 255, 0.7)', label: 'Phenol' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'bench-flask-zone',
      label: 'Place Flask on Workbench',
      accepts: ['conical-flask'],
      position: { x: 50, y: 62 },
      size: { width: 24, height: 32 },
      rejectMessage: 'Place the conical flask on the lab bench.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask',
      accepts: ['oil-sample', 'neutral-alcohol', 'phenolphthalein', 'burette'],
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
      instruction: 'Place the clean conical flask on the laboratory bench.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'weigh-oil',
      label: '2. Add 5.0 g Oil Sample',
      instruction: 'Weigh and transfer 5.0 g of vegetable oil sample into the flask.',
      requiredActions: ['add-oil'],
      type: 'lab',
    },
    {
      id: 'add-alcohol',
      label: '3. Add 50 mL Neutral Alcohol',
      instruction: 'Add 50 mL neutral ethyl alcohol to dissolve free fatty acids.',
      requiredActions: ['add-alcohol'],
      type: 'lab',
    },
    {
      id: 'warm-and-cool',
      label: '4. Heat & Cool',
      instruction: 'Warm flask on water bath to dissolve all fatty acids, then cool to room temperature. Click Continue when ready.',
      requiredActions: [],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'titrate-koh',
      label: '5. Titrate with 0.1 N KOH',
      instruction: 'Add 2 drops phenolphthalein. Titrate rapidly with 0.1 N KOH until faint permanent pink persists at V = 3.5 mL.',
      requiredActions: ['titrate-koh'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '6. Calculations & Viva',
      instruction: 'Calculate the acid value of the oil sample in mg KOH / g oil.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '7. Score Breakdown',
      instruction: 'Review your laboratory precision and scoring evaluation.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'inter-place-flask',
      trigger: { type: 'drop', source: 'conical-flask', target: 'bench-flask-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'conical-flask', zoneId: 'bench-flask-zone' },
        { type: 'setFlag', key: 'flaskPlaced', value: true },
      ],
      completesAction: 'place-flask',
    },
    {
      id: 'inter-add-oil',
      trigger: { type: 'drop', source: 'oil-sample', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'flaskPlaced', equals: true }],
      blockMessage: 'Place the flask on the bench first.',
      effects: [
        { type: 'setFlag', key: 'oilWeighed', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.25 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(234, 179, 8, 0.85)' },
      ],
      completesAction: 'add-oil',
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-add-alcohol',
      trigger: { type: 'drop', source: 'neutral-alcohol', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'oilWeighed', equals: true }],
      blockMessage: 'Add the 5.0 g oil sample first.',
      effects: [
        { type: 'setFlag', key: 'alcoholAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.55 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(253, 224, 71, 0.7)' },
      ],
      completesAction: 'add-alcohol',
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-titrate-koh',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'alcoholAdded', equals: true }],
      blockMessage: 'Dissolve oil in neutral alcohol before titrating.',
      effects: [
        { type: 'setFlag', key: 'endpointPink', value: true },
        { type: 'setVariable', key: 'kohVolume', value: 3.5 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(244, 114, 182, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Faint Pink Endpoint (3.5 mL)' },
      ],
      completesAction: 'titrate-koh',
      animation: { type: 'color-change', durationMs: 1000, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: 'R-COOH + KOH → R-COOK + H₂O',
    reactionType: 'Fatty Acid Neutralization (Acid Value)',
    constants: {
      kohNormality: 0.1,
      factor: 5.6,       // 0.1 N * 56.1 mg/mmol
      oilMass: 5.0,      // g
    },
    formulas: {
      acidValueFormula: {
        label: 'Acid Value of Oil (mg KOH / g)',
        displayFormula: 'Acid Value = (V · 5.6) / W = (3.5 · 5.6) / 5.0',
        computeFn: 'acidValueOfOil',
        inputs: ['kohVolume', 'oilMass'],
        unit: 'mg KOH/g',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: 'Acid Value Calculations',
    instruction: 'From the titration reading (V = 3.5 mL of 0.1 N KOH, mass of oil W = 5.0 g):',
    fields: [
      {
        id: 'acidValueResult',
        label: '1. Acid Value of the oil: Acid Value = (V × 5.6) / W  [Given V = 3.5 mL, W = 5.0 g]',
        placeholder: 'e.g. 3.92',
        unit: 'mg KOH/g',
        expectedFormulaName: 'acidValueOfOil',
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'acidValueDefinition',
        label: '2. Acid value is defined as the milligrams of KOH required to neutralize free acid in how many grams of oil?',
        placeholder: 'e.g. 1',
        unit: 'g',
        expectedValue: 1.0,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric ──
  scoring: [
    {
      name: 'Sample Weighing & Flask Setup',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'oilWeighed', truePoints: 20 },
    },
    {
      name: 'Neutral Alcohol Addition',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'alcoholAdded', truePoints: 20 },
    },
    {
      name: 'Faint Pink Endpoint Titration',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'endpointPink', truePoints: 20 },
    },
    {
      name: 'Acid Value Calculation',
      maxPoints: 25,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'acidValueResult',
        correctPoints: 25,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Definition & Theory Viva',
      maxPoints: 15,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'acidValueDefinition',
        correctPoints: 15,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'no-alcohol',
      trigger: 'drop:burette→flask-mouth-zone',
      condition: { type: 'flag', key: 'alcoholAdded', equals: false },
      message: 'Add neutral ethyl alcohol to dissolve fatty acids before titrating.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    kohVolume: 3.5,
    oilMass: 5.0,
  },
  initialFlags: {
    flaskPlaced: false,
    oilWeighed: false,
    alcoholAdded: false,
    endpointPink: false,
  },
};
