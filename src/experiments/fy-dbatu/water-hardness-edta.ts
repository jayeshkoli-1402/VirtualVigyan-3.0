/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Determination of Hardness of Water by EDTA Method
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Complexometric titration:
 *  Ca²⁺/Mg²⁺ + EBT → [M-EBT] (Wine Red)
 *  [M-EBT] + EDTA → [M-EDTA] + Free EBT (Sky Blue at endpoint)
 *
 *  Total Hardness = (V₂ / V₁) · 1000 ppm CaCO₃ equivalent
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const waterHardnessEdta: ExperimentConfig = {
  id: 'water-hardness-edta',
  title: 'Water Hardness by EDTA Method',
  subtitle: 'Total Hardness = (V₂/V₁) · 1000 ppm (EBT: Wine Red → Sky Blue)',
  description:
    'Determine the total hardness of a water sample in ppm of CaCO₃ equivalent using complexometric titration against standard 0.01 M EDTA with Eriochrome Black T indicator at pH 10.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'medium',
  themeColor: '#059669',
  icon: '🪨',
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
      label: '50 mL Burette (0.01 M EDTA)',
      icon: '📏',
      initialProps: { liquidLevel: 0.95, liquidColor: 'rgba(224, 242, 254, 0.4)' },
    },
    {
      id: 'std-cacl2',
      component: 'ReagentBottle',
      label: 'Standard CaCl₂ (50 mL)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.45)', label: 'Std CaCl₂' },
    },
    {
      id: 'buffer-ph10',
      component: 'Dropper',
      label: 'pH 10 Buffer (NH₄OH/NH₄Cl)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.6)', label: 'pH 10 Buf' },
    },
    {
      id: 'ebt-indicator',
      component: 'Dropper',
      label: 'Eriochrome Black T (EBT)',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(159, 18, 57, 0.95)', label: 'EBT' },
    },
    {
      id: 'hard-water-sample',
      component: 'ReagentBottle',
      label: '50 mL Hard Water Sample',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.5)', label: 'Sample' },
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
      rejectMessage: 'Place the conical flask under the burette stand.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask',
      accepts: ['std-cacl2', 'buffer-ph10', 'ebt-indicator', 'hard-water-sample', 'burette'],
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
      instruction: 'Place the clean conical flask on the titration workbench.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'standardization-prep',
      label: '2. Prepare Standard Solution',
      instruction: 'Add 50 mL standard CaCl₂ solution, 10 mL pH 10 buffer, and 4 drops EBT indicator. The solution turns wine red.',
      requiredActions: ['prep-standard'],
      type: 'lab',
    },
    {
      id: 'standardization-titration',
      label: '3. Standardize EDTA (V₁)',
      instruction: 'Titrate with EDTA until wine red changes sharply to sky blue at V₁ = 20.0 mL. Click Continue when observed.',
      requiredActions: ['titrate-v1'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'sample-titration',
      label: '4. Titrate Water Sample (V₂)',
      instruction: 'Repeat with 50 mL water sample + pH 10 buffer + EBT. Titrate to sky blue at V₂ = 15.0 mL. Click Continue.',
      requiredActions: ['titrate-v2'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '5. Calculations & Viva',
      instruction: 'Calculate the total hardness of the water sample in ppm of CaCO₃ equivalent.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '6. Score Breakdown',
      instruction: 'Review your laboratory precision and scoring evaluation.',
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
      id: 'inter-prep-std',
      trigger: { type: 'drop', source: 'ebt-indicator', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'flaskPlaced', equals: true }],
      blockMessage: 'Place the conical flask on the bench first.',
      effects: [
        { type: 'setFlag', key: 'stdWineRed', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(159, 18, 57, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Wine Red [Ca-EBT]' },
      ],
      completesAction: 'prep-standard',
      animation: { type: 'color-change', durationMs: 800, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-v1',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'stdWineRed', equals: true }],
      blockMessage: 'Add standard solution and EBT indicator first.',
      effects: [
        { type: 'setFlag', key: 'v1EndpointBlue', value: true },
        { type: 'setVariable', key: 'stdEdtaVolume', value: 20.0 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sky Blue Endpoint (V₁ = 20.0 mL)' },
      ],
      completesAction: 'titrate-v1',
      animation: { type: 'color-change', durationMs: 1100, animatingFlag: 'isTitrating' },
    },
    {
      id: 'inter-titrate-v2',
      trigger: { type: 'drop', source: 'hard-water-sample', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'v1EndpointBlue', equals: true }],
      blockMessage: 'Complete EDTA standardization (V₁) first.',
      effects: [
        { type: 'setFlag', key: 'v2EndpointBlue', value: true },
        { type: 'setVariable', key: 'sampleEdtaVolume', value: 15.0 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sky Blue Endpoint (V₂ = 15.0 mL)' },
      ],
      completesAction: 'titrate-v2',
      animation: { type: 'color-change', durationMs: 1100, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: 'Ca²⁺/Mg²⁺ + EBT → [M-EBT] (Wine Red) ; [M-EBT] + EDTA → [M-EDTA] + Free EBT (Sky Blue)',
    reactionType: 'Complexometric Titration (EDTA Chelation)',
    constants: {
      stdEdtaVolume: 20.0,
      sampleEdtaVolume: 15.0,
      factor: 1000,
    },
    formulas: {
      hardnessCalculation: {
        label: 'Total Hardness (ppm CaCO₃ equivalent)',
        displayFormula: 'Total Hardness = (V₂ / V₁) · 1000 = (15.0 / 20.0) · 1000',
        computeFn: 'waterHardnessEdta',
        inputs: ['sampleEdtaVolume', 'stdEdtaVolume'],
        unit: 'ppm',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: 'Water Hardness Calculations',
    instruction: 'From the titration volumes (V₁ = 20.0 mL for Standard CaCl₂, V₂ = 15.0 mL for Water Sample):',
    fields: [
      {
        id: 'totalHardnessPpm',
        label: '1. Total Hardness (ppm CaCO₃ equivalent): Hardness = (V₂ / V₁) × 1000  [Given V₁ = 20.0 mL, V₂ = 15.0 mL]',
        placeholder: 'e.g. 750.0',
        unit: 'ppm',
        expectedFormulaName: 'waterHardnessEdta',
        tolerance: 2.0,
        toleranceType: 'absolute',
      },
      {
        id: 'colorTransition',
        label: '2. What is the color change at the equivalence point? (Enter 1 for Wine Red → Sky Blue, 2 for Sky Blue → Wine Red)',
        placeholder: 'Enter 1 or 2',
        unit: 'Transition',
        expectedValue: 1.0,
        tolerance: 0,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric ──
  scoring: [
    {
      name: 'Standardization Preparation & pH 10 Buffer',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'stdWineRed', truePoints: 20 },
    },
    {
      name: 'EDTA Standardization Titre (V₁)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'v1EndpointBlue', truePoints: 20 },
    },
    {
      name: 'Water Sample Titre (V₂)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'v2EndpointBlue', truePoints: 20 },
    },
    {
      name: 'Total Hardness Calculation (ppm)',
      maxPoints: 25,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'totalHardnessPpm',
        correctPoints: 25,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Indicator Complexation Viva',
      maxPoints: 15,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'colorTransition',
        correctPoints: 15,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'skip-ebt',
      trigger: 'drop:burette→flask-mouth-zone',
      condition: { type: 'flag', key: 'stdWineRed', equals: false },
      message: 'Add standard CaCl₂, pH 10 buffer, and EBT indicator before titrating.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    stdEdtaVolume: 20.0,
    sampleEdtaVolume: 15.0,
  },
  initialFlags: {
    flaskPlaced: false,
    stdWineRed: false,
    v1EndpointBlue: false,
    v2EndpointBlue: false,
  },
};
