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
      id: 'burette',
      component: 'Burette',
      label: '50 mL Calibrated Burette',
      icon: '🧪',
      initialProps: { liquidLevel: 0, width: 90, height: 280, label: '50 mL Burette' },
    },
    {
      id: 'naoh-titrant',
      component: 'ReagentBottle',
      label: '0.02 N NaOH Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.7)', label: '0.02 N NaOH' },
    },
    {
      id: 'conical-flask',
      component: 'ConicalFlask',
      label: '250 mL Conical Flask',
      icon: '⚗️',
      initialProps: { liquidLevel: 0, width: 130, height: 150 },
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
      id: 'clamp-zone',
      label: 'Clamp Burette on Retort Stand',
      accepts: ['burette'],
      position: { x: 50, y: 32 },
      size: { width: 22, height: 44 },
      rejectMessage: 'Mount the 50 mL burette onto the retort stand clamp.',
    },
    {
      id: 'burette-top-zone',
      label: 'Fill Burette with 0.02 N NaOH',
      accepts: ['naoh-titrant'],
      position: { x: 50, y: 14 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour 0.02 N NaOH titrant into the top of the burette.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'burette' },
    },
    {
      id: 'flask-bench-zone',
      label: 'Place Flask under Burette',
      accepts: ['conical-flask'],
      position: { x: 50, y: 64 },
      size: { width: 24, height: 32 },
      rejectMessage: 'Place the flask under the burette stand.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask (Part A)',
      accepts: ['water-sample', 'thiosulphate', 'methyl-orange', 'phenolphthalein', 'burette'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the conical flask.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
          { type: 'flag', key: 'moEndpointReached', equals: false },
        ],
      },
    },
    {
      id: 'flask-sample-zone',
      label: 'Into Conical Flask (Part B)',
      accepts: ['phenolphthalein', 'burette'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the titration flask.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
          { type: 'flag', key: 'moEndpointReached', equals: true },
        ],
      },
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
      instruction: 'Drag the 0.02 N NaOH bottle to the top of the burette to fill it up to the 0.0 mL mark.',
      requiredActions: ['fill-burette'],
      type: 'lab',
    },
    {
      id: 'setup-flask',
      label: '3. Place Flask',
      instruction: 'Place the clean conical flask beneath the clamped burette.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'sample-prep',
      label: '4. Add 100 mL Water & Dechlorinate',
      instruction: 'Add 100 mL water sample and add 1 drop N/10 Na₂S₂O₃ to destroy residual chlorine.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'sampleDechlorinated', equals: true },
          instruction: '✓ Sample dechlorinated! Residual chlorine neutralized.',
        },
        {
          condition: { type: 'flag', key: 'waterAdded', equals: true },
          instruction: '✓ Water sample added. Now add 1 drop N/10 Na₂S₂O₃ into the conical flask.',
        },
      ],
      requiredActions: ['add-water-sample', 'dechlorinate-sample'],
      type: 'lab',
    },
    {
      id: 'part-a-titration',
      label: '5. Part A — Methyl Orange Acidity',
      instruction: 'Add 2–3 drops methyl orange (turns red). Open/rotate the burette cork to titrate drop-by-drop with N/50 NaOH until red turns to canary yellow at Y ≈ 2.4 mL. Close the stopcock and click Continue when observed.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'moEndpointReached', equals: true },
          instruction: '✓ Part A endpoint reached! Solution turned canary yellow (Y ≈ 2.4 mL). Close the burette stopcock manually and click Continue.',
        },
        {
          condition: { type: 'flag', key: 'methylOrangeAdded', equals: true },
          instruction: '✓ Methyl orange added! Solution turned red. Open/rotate the burette cork to titrate with N/50 NaOH until canary yellow (Y ≈ 2.4 mL).',
        },
      ],
      requiredActions: ['add-methyl-orange', 'titrate-methyl-orange'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'part-b-titration',
      label: '6. Part B — Total Acidity',
      instruction: 'Add 2–3 drops phenolphthalein into the same yellow flask (remains yellow). Open/rotate the burette cork to continue titrating with N/50 NaOH until faint pink persists at total Z ≈ 5.4 mL. Close the stopcock and click Continue when observed.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'phenolEndpointReached', equals: true },
          instruction: '✓ Total acidity endpoint reached! Solution turned faint pink (Total Z ≈ 5.4 mL). Close the burette stopcock manually and click Continue.',
        },
        {
          condition: { type: 'flag', key: 'phenolphthaleinAdded', equals: true },
          instruction: '✓ Phenolphthalein added! Solution remains yellow. Open/rotate the burette cork to continue titrating with N/50 NaOH until faint pink (Total Z ≈ 5.4 mL).',
        },
      ],
      requiredActions: ['add-phenolphthalein', 'titrate-phenolphthalein'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '7. Calculations & Viva',
      instruction: 'Calculate methyl orange acidity and total phenolphthalein acidity in ppm (mg/L CaCO₃ equivalent).',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '8. Score Breakdown',
      instruction: 'Review your laboratory accuracy and answers.',
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
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: '0.02 N NaOH Burette' },
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
      id: 'inter-add-water',
      trigger: { type: 'drop', source: 'water-sample', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'flaskPlaced', equals: true }],
      blockMessage: 'Place the flask under the burette first.',
      effects: [
        { type: 'setFlag', key: 'waterAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.50 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '100 mL Acidic Water Sample' },
      ],
      completesAction: 'add-water-sample',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-dechlorinate-sample',
      trigger: { type: 'drop', source: 'thiosulphate', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'waterAdded', equals: true }],
      blockMessage: 'Add the 100 mL water sample into the conical flask before adding sodium thiosulphate.',
      guard: {
        condition: { type: 'flag', key: 'sampleDechlorinated', equals: true },
        message: 'Sodium thiosulphate dechlorinator has already been added to the sample.',
      },
      effects: [
        { type: 'setFlag', key: 'sampleDechlorinated', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.50 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '100 mL Dechlorinated Water Sample' },
      ],
      completesAction: 'dechlorinate-sample',
      animation: { type: 'drip', durationMs: 1500, animatingFlag: 'isAddingReagent' },
    },
    {
      id: 'inter-add-methyl-orange',
      trigger: { type: 'drop', source: 'methyl-orange', target: 'flask-mouth-zone' },
      conditions: [
        { type: 'flag', key: 'waterAdded', equals: true },
        { type: 'flag', key: 'sampleDechlorinated', equals: true },
      ],
      blockMessage: 'Add the 100 mL water sample and dechlorinate with Na₂S₂O₃ first.',
      guard: {
        condition: { type: 'flag', key: 'methylOrangeAdded', equals: true },
        message: 'Methyl orange indicator has already been added.',
      },
      effects: [
        { type: 'setFlag', key: 'methylOrangeAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.50 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(239, 68, 68, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Acidic Water + Methyl Orange (Red)' },
      ],
      completesAction: 'add-methyl-orange',
      animation: { type: 'drip', durationMs: 1800, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-mo',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [
        { type: 'flag', key: 'methylOrangeAdded', equals: true },
        { type: 'variable', key: 'volumeY', op: '>=', value: 2.4 },
      ],
      blockMessage: 'Add methyl orange and titrate with N/50 NaOH until the red color turns canary yellow (Y ≈ 2.4 mL).',
      guard: {
        condition: { type: 'flag', key: 'moEndpointReached', equals: true },
        message: 'Methyl orange endpoint is already reached.',
      },
      effects: [
        { type: 'setFlag', key: 'moEndpointReached', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.52 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(234, 179, 8, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'MO Endpoint: Canary Yellow (Y ≈ 2.4 mL)' },
      ],
      completesAction: 'titrate-methyl-orange',
      animation: { type: 'titrate', durationMs: 2200, animatingFlag: 'isTitrating' },
    },
    {
      id: 'inter-add-phenolphthalein',
      trigger: { type: 'drop', source: 'phenolphthalein', target: 'flask-sample-zone' },
      conditions: [{ type: 'flag', key: 'moEndpointReached', equals: true }],
      blockMessage: 'Complete the Methyl Orange mineral acidity titration (Part A) first.',
      guard: {
        condition: { type: 'flag', key: 'phenolphthaleinAdded', equals: true },
        message: 'Phenolphthalein indicator has already been added.',
      },
      effects: [
        { type: 'setFlag', key: 'phenolphthaleinAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.52 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(234, 179, 8, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Water Sample + Phenolphthalein (Yellow)' },
      ],
      completesAction: 'add-phenolphthalein',
      animation: { type: 'drip', durationMs: 1800, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-phenol',
      trigger: { type: 'drop', source: 'burette', target: 'flask-sample-zone' },
      conditions: [
        { type: 'flag', key: 'phenolphthaleinAdded', equals: true },
        { type: 'variable', key: 'volumeZ', op: '>=', value: 5.4 },
      ],
      blockMessage: 'Add phenolphthalein and continue titrating with N/50 NaOH until the yellow color turns faint pink (Z ≈ 5.4 mL).',
      guard: {
        condition: { type: 'flag', key: 'phenolEndpointReached', equals: true },
        message: 'Total acidity endpoint is already reached.',
      },
      effects: [
        { type: 'setFlag', key: 'phenolEndpointReached', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.56 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(244, 114, 182, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Total Acidity Endpoint: Faint Pink (Z ≈ 5.4 mL)' },
      ],
      completesAction: 'titrate-phenolphthalein',
      animation: { type: 'titrate', durationMs: 2200, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'H⁺ + OH⁻ → H₂O | H₂CO₃ + OH⁻ → HCO₃⁻ + H₂O',
    constants: {
      normalityNaOH: 0.02,
      sampleVolume: 100.0,
    },
    formulas: {
      waterAcidityMineral: {
        label: 'Mineral Acidity (Methyl Orange Acidity)',
        displayFormula: 'Mineral Acidity = (Y × N × 50 × 1000) / V',
        computeFn: 'waterAcidityMineral',
        inputs: ['volumeY', 'normalityNaOH', 'sampleVolume'],
        unit: 'ppm CaCO₃ eq.',
      },
      waterAcidityTotal: {
        label: 'Total Acidity (Phenolphthalein Acidity)',
        displayFormula: 'Total Acidity = (Z × N × 50 × 1000) / V',
        computeFn: 'waterAcidityTotal',
        inputs: ['volumeZ', 'normalityNaOH', 'sampleVolume'],
        unit: 'ppm CaCO₃ eq.',
      },
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
      name: 'Methyl Orange Acidity (Part A)',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'moEndpointReached', truePoints: 25 },
    },
    {
      name: 'Phenolphthalein Acidity (Part B)',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'phenolEndpointReached', truePoints: 25 },
    },
    {
      name: 'Methyl Orange Titre (Y)',
      maxPoints: 5,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'volumeY',
        correctPoints: 5,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Phenolphthalein Titre (Z)',
      maxPoints: 5,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'volumeZ',
        correctPoints: 5,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Mineral Acidity Calculation',
      maxPoints: 10,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'mineralAcidity',
        correctPoints: 10,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Total Acidity Calculation',
      maxPoints: 10,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'totalAcidity',
        correctPoints: 10,
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
    volumeAdded: 0,
    volumeY: 0,
    volumeZ: 0,
    normalityNaOH: 0.02,
    sampleVolume: 100,
    stopcockOpen: 0,
    maxFlowRate: 1.0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    flaskPlaced: false,
    waterAdded: false,
    sampleDechlorinated: false,
    methylOrangeAdded: false,
    moEndpointReached: false,
    phenolphthaleinAdded: false,
    phenolEndpointReached: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Water Acidity Calculation',
    instruction: 'Calculate Mineral Acidity and Total Acidity in ppm CaCO₃ equivalent from your titre readings.',
    hideRecordedValueKeys: ['volumeY', 'volumeZ', 'volumeAdded'],
    formulas: [
      {
        label: '1. Mineral Acidity (Methyl Orange Acidity)',
        symbol: 'Mineral Acidity',
        numerator: 'Y × N × 50 × 1000',
        denominator: 'V',
        unit: 'ppm CaCO₃ eq.',
        notes: 'where Y = Methyl Orange titre (mL), N = Normality of NaOH (0.02 N), V = Water sample volume (100 mL). Formula simplifies to: Mineral Acidity = Y × 10 ppm.',
      },
      {
        label: '2. Total Acidity (Phenolphthalein Acidity)',
        symbol: 'Total Acidity',
        numerator: 'Z × N × 50 × 1000',
        denominator: 'V',
        unit: 'ppm CaCO₃ eq.',
        notes: 'where Z = Total Phenolphthalein titre (mL), N = Normality of NaOH (0.02 N), V = Water sample volume (100 mL). Formula simplifies to: Total Acidity = Z × 10 ppm.',
      },
    ],
    fields: [
      {
        id: 'volumeY',
        label: 'Methyl Orange Titre Volume (Y in mL)',
        placeholder: 'Enter titre volume Y from Part A (2.2–2.6 mL)',
        helperText: 'Titre volume of 0.02 N NaOH required to reach canary yellow endpoint (Part A)',
        unit: 'mL',
        expectedValue: 2.4,
        tolerance: 0.2,
        toleranceType: 'absolute',
        minAccepted: 2.2,
        maxAccepted: 2.6,
        expectedRangeLabel: '2.2–2.6 mL',
      },
      {
        id: 'volumeZ',
        label: 'Phenolphthalein Total Titre Volume (Z in mL)',
        placeholder: 'Enter total titre volume Z from Part B (5.2–5.8 mL)',
        helperText: 'Total burette reading of 0.02 N NaOH from start to faint pink endpoint (Part B)',
        unit: 'mL',
        expectedValue: 5.5,
        tolerance: 0.3,
        toleranceType: 'absolute',
        minAccepted: 5.2,
        maxAccepted: 5.8,
        expectedRangeLabel: '5.2–5.8 mL',
      },
      {
        id: 'mineralAcidity',
        label: 'Mineral Acidity (ppm CaCO₃ eq.)',
        placeholder: 'Calculate Mineral Acidity = Y × 10',
        helperText: 'Mineral Acidity = Y × 10 ppm',
        helperExample: 'Example: if Y = 2.4 mL, Mineral Acidity = 2.4 × 10 = 24.0 ppm.',
        unit: 'ppm',
        expectedFormulaName: 'waterAcidityMineral',
        expectedValue: 24.0,
        tolerance: 2.0,
        toleranceType: 'absolute',
        minAccepted: 22.0,
        maxAccepted: 26.0,
        expectedRangeLabel: '22–26 ppm',
      },
      {
        id: 'totalAcidity',
        label: 'Total Acidity (ppm CaCO₃ eq.)',
        placeholder: 'Calculate Total Acidity = Z × 10',
        helperText: 'Total Acidity = Z × 10 ppm',
        helperExample: 'Example: if Z = 5.5 mL, Total Acidity = 5.5 × 10 = 55.0 ppm.',
        unit: 'ppm',
        expectedFormulaName: 'waterAcidityTotal',
        expectedValue: 55.0,
        tolerance: 3.0,
        toleranceType: 'absolute',
        minAccepted: 52.0,
        maxAccepted: 58.0,
        expectedRangeLabel: '52–58 ppm',
      },
    ],
  },

  // ── Viva Questions ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'What is the chemical difference between mineral acidity and total acidity in water?',
        options: [
          'Mineral acidity is due to strong mineral acids (HCl, H₂SO₄, pH < 4.5); Total acidity also includes weak acids like dissolved CO₂ and carbonic acid (pH up to 8.3).',
          'Mineral acidity is caused by calcium ions, total acidity by magnesium ions.',
          'Mineral acidity is measured with starch, total acidity with phenolphthalein.',
          'Mineral acidity only exists above boiling temperature.',
        ],
        correctIndex: 0,
        explanation:
          'Mineral acids ionize completely and are titrated up to pH 4.5 (methyl orange endpoint). Weak acids like carbonic acid (H₂CO₃) require titration up to pH 8.3 (phenolphthalein endpoint).',
      },
      {
        id: 'q2',
        question: 'Why is sodium thiosulphate (Na₂S₂O₃) added to the water sample before acidity titration?',
        options: [
          'To neutralize residual free chlorine bleach which would otherwise destroy and decolorize the organic indicators.',
          'To increase the ionic strength and electrical conductivity.',
          'To precipitate iron and aluminium ions.',
          'To buffer the solution at pH 7.0.',
        ],
        correctIndex: 0,
        explanation:
          'Residual free chlorine present in treated tap water acts as a strong oxidizer that bleaches azo and phthalein indicators, preventing accurate visual endpoint detection.',
      },
      {
        id: 'q3',
        question: 'Why is environmental water acidity hazardous in industrial and municipal applications?',
        options: [
          'It causes severe metal corrosion of underground pipes, pumps, and boiler tubes, and dissolves toxic heavy metals.',
          'It increases water turbidity and makes it smell like sulfur.',
          'It precipitates soap into curd.',
          'It accelerates algae growth.',
        ],
        correctIndex: 0,
        explanation:
          'Acidic water aggressively corrodes plumbing fixtures and boiler systems, leaching harmful lead, copper, and iron into distribution networks.',
      },
    ],
  },
};
