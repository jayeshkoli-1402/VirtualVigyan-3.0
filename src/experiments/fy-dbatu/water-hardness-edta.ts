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
      id: 'burette',
      component: 'Burette',
      label: '50 mL Calibrated Burette',
      icon: '🧪',
      initialProps: { liquidLevel: 0, width: 90, height: 280, label: '50 mL Burette' },
    },
    {
      id: 'edta-titrant',
      component: 'ReagentBottle',
      label: '0.01 M Standard EDTA Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.7)', label: '0.01 M EDTA' },
    },
    {
      id: 'conical-flask',
      component: 'ConicalFlask',
      label: '250 mL Conical Flask',
      icon: '⚗️',
      initialProps: { liquidLevel: 0, width: 130, height: 150 },
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
    {
      id: 'measuring-cylinder',
      component: 'MeasuringCylinder',
      label: '50 mL Measuring Cylinder',
      icon: '📏',
      initialProps: { width: 65, height: 175, maxVolume: 50 },
    },
    {
      id: 'bunsen-burner',
      component: 'BunsenBurner',
      label: 'Bunsen Burner (Boil Sample)',
      icon: '🔥',
      initialProps: { width: 85, height: 125, isLit: false },
    },
    {
      id: 'tripod-gauze',
      component: 'Tripod',
      label: 'Tripod Stand & Wire Gauze',
      icon: '📐',
      initialProps: { width: 115, height: 105 },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'clamp-zone',
      label: 'Clamp Burette on Retort Stand',
      accepts: ['burette'],
      position: { x: 50, y: 32 },
      size: { width: 22, height: 44 },
      rejectMessage: 'Mount the 50 mL burette onto the retort stand clamp.',
    },
    {
      id: 'burette-top-zone',
      label: 'Fill Burette with 0.01 M EDTA',
      accepts: ['edta-titrant'],
      position: { x: 50, y: 14 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour 0.01 M EDTA titrant into the top of the burette.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'burette' },
    },
    {
      id: 'flask-bench-zone',
      label: 'Place Flask under Burette',
      accepts: ['conical-flask'],
      position: { x: 50, y: 64 },
      size: { width: 24, height: 32 },
      rejectMessage: 'Place the conical flask on the lab bench beneath the burette.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask',
      accepts: ['std-cacl2', 'buffer-ph10', 'ebt-indicator', 'hard-water-sample'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagents into the conical flask.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      {
        component: 'RetortStand',
        position: { x: 50, y: 38 },
        scale: 1.15,
        props: { label: 'Retort Stand' },
      },
      {
        component: 'Tripod',
        position: { x: 20, y: 72 },
        scale: 0.9,
        props: { label: 'Tripod & Gauze' },
      },
      {
        component: 'BunsenBurner',
        position: { x: 20, y: 78 },
        scale: 0.85,
        props: { label: 'Burner', isLit: false },
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
      label: '2. Fill Burette with EDTA',
      instruction: 'Drag the 0.01 M Standard EDTA bottle to the top of the burette to fill it up to the 0.0 mL mark.',
      requiredActions: ['fill-burette'],
      type: 'lab',
    },
    {
      id: 'setup-flask',
      label: '3. Place Flask',
      instruction: 'Place the clean conical flask beneath the burette on the titration workbench.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'standardization-prep',
      label: '4. Prepare Standard Solution',
      instruction: 'Add 50 mL standard CaCl₂ solution, 10 mL pH 10 buffer, and 4 drops EBT indicator. The solution turns wine red.',
      requiredActions: ['prep-standard'],
      type: 'lab',
    },
    {
      id: 'standardization-titration',
      label: '5. Standardize EDTA (V₁)',
      instruction: 'Click the right wing of the burette cork to titrate drop-by-drop with EDTA until wine red changes sharply to sky blue at V₁ = 20.0 mL. Click Continue when observed.',
      requiredActions: ['titrate-v1'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'sample-titration',
      label: '6. Titrate Water Sample (V₂)',
      instruction: 'Repeat with 50 mL water sample + pH 10 buffer + EBT. Open/rotate the burette cork to titrate with EDTA to sky blue at V₂ = 15.0 mL. Click Continue.',
      requiredActions: ['titrate-v2'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '7. Calculations & Viva',
      instruction: 'Calculate the total hardness of the water sample in ppm of CaCO₃ equivalent.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '8. Score Breakdown',
      instruction: 'Review your laboratory precision and scoring evaluation.',
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
      trigger: { type: 'drop', source: 'edta-titrant', target: 'burette-top-zone' },
      conditions: [{ type: 'flag', key: 'burettePlaced', equals: true }],
      blockMessage: 'Clamp the burette on the retort stand before filling it.',
      effects: [
        { type: 'setFlag', key: 'buretteFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidLevel', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: '0.01 M EDTA Burette' },
      ],
      completesAction: 'fill-burette',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
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
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.44 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(159, 18, 57, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Wine Red [Ca²⁺-EBT Complex]' },
      ],
      completesAction: 'prep-standard',
      animation: { type: 'drip', durationMs: 2000, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-v1',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'stdWineRed', equals: true }],
      blockMessage: 'Add standard solution and EBT indicator first.',
      effects: [
        { type: 'setFlag', key: 'v1EndpointBlue', value: true },
        { type: 'setVariable', key: 'stdEdtaVolume', value: 20.0 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.60 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(14, 165, 233, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sky Blue Endpoint (V₁ = 20.0 mL)' },
      ],
      completesAction: 'titrate-v1',
      animation: { type: 'titrate', durationMs: 2200, animatingFlag: 'isTitrating' },
    },
    {
      id: 'inter-titrate-v2',
      trigger: { type: 'drop', source: 'hard-water-sample', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'v1EndpointBlue', equals: true }],
      blockMessage: 'Complete EDTA standardization (V₁) first.',
      effects: [
        { type: 'setFlag', key: 'v2EndpointBlue', value: true },
        { type: 'setVariable', key: 'sampleEdtaVolume', value: 15.0 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.68 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(14, 165, 233, 0.95)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sample Endpoint (V₂ = 15.0 mL)' },
      ],
      completesAction: 'titrate-v2',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'Ca²⁺ + EDTA⁴⁻ → [Ca-EDTA]²⁻',
    constants: {
      cacl2Volume: 50.0,
      sampleVolume: 50.0,
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
      name: 'Standardization Endpoint (V₁)',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'v1EndpointBlue', truePoints: 25 },
    },
    {
      name: 'Sample Titration Endpoint (V₂)',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'v2EndpointBlue', truePoints: 25 },
    },
    {
      name: 'Hardness Calculation',
      maxPoints: 30,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'totalHardness',
        correctPoints: 30,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'fill-before-clamp',
      trigger: 'drop:edta-titrant→burette-top-zone',
      condition: { type: 'flag', key: 'burettePlaced', equals: false },
      message: 'Clamp the burette on the retort stand before filling it with EDTA.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    stdEdtaVolume: 0,
    sampleEdtaVolume: 0,
    cacl2Volume: 50,
    sampleVolume: 50,
    totalHardness: 0,
    stopcockOpen: 0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    flaskPlaced: false,
    stdWineRed: false,
    v1EndpointBlue: false,
    v2EndpointBlue: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Total Hardness Calculation',
    instruction: 'Total Hardness = (V₂ / V₁) × 1000 ppm CaCO₃ eq.',
    fields: [
      {
        id: 'stdEdtaVolume',
        label: 'EDTA Vol. for 50 mL Std CaCl₂ (V₁ in mL)',
        unit: 'mL',
        expectedValue: 20.0,
        tolerance: 0.2,
      },
      {
        id: 'sampleEdtaVolume',
        label: 'EDTA Vol. for 50 mL Water Sample (V₂ in mL)',
        unit: 'mL',
        expectedValue: 15.0,
        tolerance: 0.2,
      },
      {
        id: 'totalHardness',
        label: 'Total Hardness of Water Sample (ppm CaCO₃ eq.)',
        unit: 'ppm',
        expectedValue: 750,
        tolerance: 10,
      },
    ],
  },

  // ── Viva Questions ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'Why is an ammoniacal buffer of pH 10 used in EDTA titration?',
        options: [
          'To maintain pH 10 where [Ca-EDTA] and [Mg-EDTA] complexes are stable and EBT indicator functions properly.',
          'To prevent the oxidation of EDTA by atmospheric oxygen.',
          'To precipitate iron and aluminium impurities as hydroxides.',
          'To decrease the solubility of calcium carbonate.',
        ],
        correctIndex: 0,
        explanation:
          'At pH 10, EDTA exists as the active tetra-anion (Y⁴⁻), allowing strong and stable chelate formation with Ca²⁺ and Mg²⁺, while EBT indicator exhibits its distinct blue/wine-red color transition.',
      },
      {
        id: 'q2',
        question: 'Why does the solution turn wine red when EBT indicator is added to hard water?',
        options: [
          'Due to the formation of unstable [Ca-EBT] and [Mg-EBT] coordination complex ions.',
          'Due to the oxidation of EBT by dissolved oxygen.',
          'Because free EBT itself is wine red in alkaline medium.',
          'Due to the formation of calcium carbonate precipitate.',
        ],
        correctIndex: 0,
        explanation:
          'Free EBT is blue at pH 10. When added to hard water containing Ca²⁺ and Mg²⁺, it forms relatively weak [M-EBT] complex ions that are wine red.',
      },
      {
        id: 'q3',
        question: 'What is the color change at the exact equivalence point of EDTA titration?',
        options: [
          'Wine red to sky blue / steel blue.',
          'Colorless to pink.',
          'Yellow to orange.',
          'Deep blue to colorless.',
        ],
        correctIndex: 0,
        explanation:
          'At the equivalence point, EDTA replaces EBT from the [M-EBT] complex to form much stronger [M-EDTA] complexes, releasing free EBT which is pure sky blue.',
      },
      {
        id: 'q4',
        question: 'What is the standard unit used to express water hardness in engineering practice?',
        options: [
          'ppm (parts per million) or mg/L of CaCO₃ equivalent.',
          'Grams per liter of MgSO₄.',
          'Normality of HCl.',
          'Molarity of NaCl.',
        ],
        correctIndex: 0,
        explanation:
          'Hardness is universally expressed in ppm or mg/L of CaCO₃ equivalent because CaCO₃ has a convenient molecular weight of exactly 100 g/mol and equivalent weight of 50.',
      },
    ],
  },
};
