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
      id: 'burette',
      component: 'Burette',
      label: '50 mL Calibrated Burette',
      icon: '🧪',
      initialProps: { liquidLevel: 0, width: 90, height: 280, label: '50 mL Burette' },
    },
    {
      id: 'h2so4-titrant',
      component: 'ReagentBottle',
      label: '0.02 N H₂SO₄ Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.7)', label: '0.02 N H₂SO₄' },
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
      id: 'clamp-zone',
      label: 'Clamp Burette on Retort Stand',
      accepts: ['burette'],
      position: { x: 50, y: 32 },
      size: { width: 22, height: 44 },
      rejectMessage: 'Mount the 50 mL burette onto the retort stand clamp.',
    },
    {
      id: 'burette-top-zone',
      label: 'Fill Burette with 0.02 N H₂SO₄',
      accepts: ['h2so4-titrant'],
      position: { x: 50, y: 14 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour 0.02 N H₂SO₄ titrant into the top of the burette.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'burette' },
          { type: 'flag', key: 'buretteFilled', equals: false },
        ],
      },
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
      label: 'Into Conical Flask (P Stage)',
      accepts: ['water-sample', 'phenolphthalein', 'burette'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the titration flask.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
          { type: 'flag', key: 'pEndpointReached', equals: false },
        ],
      },
    },
    {
      id: 'flask-sample-zone',
      label: 'Into Conical Flask (M Stage)',
      accepts: ['methyl-orange', 'burette'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the titration flask.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
          { type: 'flag', key: 'pEndpointReached', equals: true },
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
      label: '2. Fill Burette with H₂SO₄',
      instruction: 'Drag the 0.02 N H₂SO₄ bottle to the top of the burette to fill it up to the 0.0 mL mark.',
      requiredActions: ['fill-burette'],
      type: 'lab',
    },
    {
      id: 'setup-flask',
      label: '3. Place Flask',
      instruction: 'Place the clean 250 mL conical flask beneath the clamped burette.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'add-sample',
      label: '4. Add 100 mL Water Sample',
      instruction: 'Pipette 100 mL of the alkaline water sample into the conical flask.',
      requiredActions: ['add-sample'],
      type: 'lab',
    },
    {
      id: 'phenolphthalein-titration',
      label: '5. Phenolphthalein Endpoint (P)',
      instruction: 'Add 1–2 drops phenolphthalein (turns pink). Start shaking / swirling the flask before titration, then open the burette cork to titrate drop-by-drop with N/50 H₂SO₄ until pink disappears at A ≈ 4.2 mL. Close the stopcock and click Continue when observed.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'pEndpointReached', equals: true },
          instruction: '✓ P endpoint reached! Solution turned colorless (A ≈ 4.2 mL). Close the burette stopcock manually and click Continue.',
        },
        {
          condition: { type: 'flag', key: 'phenolphthaleinAdded', equals: true },
          instruction: '✓ Phenolphthalein added! Solution turned pink. Start shaking / swirling the flask before titration, then open/rotate the burette cork to titrate drop-by-drop with N/50 H₂SO₄ until pink disappears (A ≈ 4.2 mL).',
        },
      ],
      requiredActions: ['add-phenolphthalein', 'titrate-p'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'methyl-orange-titration',
      label: '6. Methyl Orange Endpoint (M)',
      instruction: 'Add 2–3 drops methyl orange into the same flask (turns yellow). Start shaking / swirling the flask before titration, then open/rotate the burette cork to continue titration with H₂SO₄ until yellow changes to light pink at total titre A + B ≈ 12.8 mL (B ≈ 8.6 mL). Close the stopcock and click Continue when observed.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'mEndpointReached', equals: true },
          instruction: '✓ Methyl Orange endpoint reached! Solution turned light pink (B ≈ 8.6 mL, Total ≈ 12.8 mL). Close the burette stopcock manually and click Continue.',
        },
        {
          condition: { type: 'flag', key: 'methylOrangeAdded', equals: true },
          instruction: '✓ Methyl orange added! Solution turned yellow. Start shaking / swirling the flask before titration, then open/rotate the burette cork to continue titrating with H₂SO₄ until light pink (B ≈ 8.6 mL, Total ≈ 12.8 mL).',
        },
      ],
      requiredActions: ['add-methyl-orange', 'titrate-m'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '7. Calculations & Ions',
      instruction: 'Calculate P and M alkalinity in ppm (CaCO₃ equivalent) and determine the dominant ionic species.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '8. Score Breakdown',
      instruction: 'Review your laboratory precision and scoring breakdown.',
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
      trigger: { type: 'drop', source: 'h2so4-titrant', target: 'burette-top-zone' },
      conditions: [{ type: 'flag', key: 'burettePlaced', equals: true }],
      blockMessage: 'Clamp the burette on the retort stand before filling it.',
      effects: [
        { type: 'setFlag', key: 'buretteFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidLevel', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: '0.02 N H₂SO₄ Burette' },
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
      id: 'inter-add-sample',
      trigger: { type: 'drop', source: 'water-sample', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'flaskPlaced', equals: true }],
      blockMessage: 'Place the flask on the bench first.',
      effects: [
        { type: 'setFlag', key: 'sampleAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.60 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '100 mL Alkaline Water Sample' },
      ],
      completesAction: 'add-sample',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-add-phenolphthalein',
      trigger: { type: 'drop', source: 'phenolphthalein', target: 'flask-mouth-zone' },
      conditions: [
        { type: 'flag', key: 'flaskPlaced', equals: true },
        { type: 'flag', key: 'sampleAdded', equals: true },
      ],
      blockMessage: 'Add the 100 mL alkaline water sample before adding phenolphthalein indicator.',
      effects: [
        { type: 'setFlag', key: 'phenolphthaleinAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.60 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(236, 72, 153, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Alkaline Water + Phenolphthalein (Pink)' },
      ],
      completesAction: 'add-phenolphthalein',
      animation: { type: 'drip', durationMs: 1800, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-p',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [
        { type: 'flag', key: 'phenolphthaleinAdded', equals: true },
        { type: 'variable', key: 'volumeA', op: '>=', value: 4.2 },
      ],
      blockMessage: 'Add phenolphthalein and titrate with H₂SO₄ until the pink color turns colorless (A ≈ 4.2 mL).',
      guard: {
        condition: { type: 'flag', key: 'pEndpointReached', equals: true },
        message: 'Phenolphthalein endpoint is already reached.',
      },
      effects: [
        { type: 'setFlag', key: 'pEndpointReached', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.60 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'P Endpoint: Colorless (A ≈ 4.2 mL)' },
      ],
      completesAction: 'titrate-p',
      animation: { type: 'titrate', durationMs: 2200, animatingFlag: 'isTitrating' },
    },
    {
      id: 'inter-add-methyl-orange',
      trigger: { type: 'drop', source: 'methyl-orange', target: 'flask-sample-zone' },
      conditions: [
        { type: 'flag', key: 'pEndpointReached', equals: true },
      ],
      blockMessage: 'Reach the phenolphthalein (P) endpoint before adding methyl orange indicator.',
      guard: {
        condition: { type: 'flag', key: 'methylOrangeAdded', equals: true },
        message: 'Methyl orange indicator has already been added to the flask.',
      },
      effects: [
        { type: 'setFlag', key: 'methylOrangeAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.60 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(234, 179, 8, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Alkaline Water + Methyl Orange (Yellow)' },
      ],
      completesAction: 'add-methyl-orange',
      animation: { type: 'drip', durationMs: 1800, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-m',
      trigger: { type: 'drop', source: 'burette', target: 'flask-sample-zone' },
      conditions: [
        { type: 'flag', key: 'methylOrangeAdded', equals: true },
        { type: 'variable', key: 'volumeA + volumeB', op: '>=', value: 12.8 },
      ],
      blockMessage: 'Add methyl orange and titrate with H₂SO₄ until the yellow color turns light pink (Total ≈ 12.8 mL).',
      guard: {
        condition: { type: 'flag', key: 'mEndpointReached', equals: true },
        message: 'Methyl orange endpoint is already reached.',
      },
      effects: [
        { type: 'setFlag', key: 'mEndpointReached', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.68 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(244, 114, 182, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'M Endpoint: Light Pink (B ≈ 8.6 mL, Total ≈ 12.8 mL)' },
      ],
      completesAction: 'titrate-m',
      animation: { type: 'titrate', durationMs: 2200, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'OH⁻ + H⁺ → H₂O | CO₃²⁻ + H⁺ → HCO₃⁻ | HCO₃⁻ + H⁺ → H₂CO₃',
    constants: {
      normalityH2SO4: 0.02,
      sampleVolume: 100.0,
    },
    formulas: {
      waterAlkalinityP: {
        label: 'Phenolphthalein Alkalinity (P)',
        displayFormula: 'P = (A × N × 50 × 1000) / V',
        computeFn: 'waterAlkalinityP',
        inputs: ['volumeA', 'normalityH2SO4', 'sampleVolume'],
        unit: 'ppm CaCO₃ eq.',
      },
      waterAlkalinityM: {
        label: 'Total Alkalinity (M)',
        displayFormula: 'M = ((A + B) × N × 50 × 1000) / V',
        computeFn: 'waterAlkalinityM',
        inputs: ['volumeA', 'volumeB', 'normalityH2SO4', 'sampleVolume'],
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
      name: 'P-Endpoint Detection',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'pEndpointReached', truePoints: 25 },
    },
    {
      name: 'M-Endpoint Detection',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'mEndpointReached', truePoints: 25 },
    },
    {
      name: 'Alkalinity Calculation',
      maxPoints: 30,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'pAlkalinity',
        correctPoints: 30,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'fill-before-clamp',
      trigger: 'drop:h2so4-titrant→burette-top-zone',
      condition: { type: 'flag', key: 'burettePlaced', equals: false },
      message: 'Clamp the burette on the retort stand before filling it with H₂SO₄.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    volumeA: 0,
    volumeB: 0,
    normalityH2SO4: 0.02,
    sampleVolume: 100,
    stopcockOpen: 0,
    maxFlowRate: 1.0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    flaskPlaced: false,
    sampleAdded: false,
    phenolphthaleinAdded: false,
    pEndpointReached: false,
    methylOrangeAdded: false,
    mEndpointReached: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Alkalinity Calculation',
    instruction: 'Calculate Phenolphthalein Alkalinity (P) and Total Alkalinity (M) in ppm CaCO₃ equivalent from your titre readings.',
    hideRecordedValueKeys: ['volumeA', 'volumeB'],
    formulas: [
      {
        label: '1. Phenolphthalein Alkalinity (P)',
        symbol: 'P',
        numerator: 'A × N × 50 × 1000',
        denominator: 'V',
        unit: 'ppm CaCO₃ eq.',
        notes: 'where A = Phenolphthalein titre (mL), N = Normality of H₂SO₄ (0.02 N), V = Water sample volume (100 mL)',
      },
      {
        label: '2. Total Alkalinity (M)',
        symbol: 'M',
        numerator: '(A + B) × N × 50 × 1000',
        denominator: 'V',
        unit: 'ppm CaCO₃ eq.',
        notes: 'where A = P titre (mL), B = Additional Methyl Orange titre (mL), N = 0.02 N, V = 100 mL',
      },
    ],
    fields: [
      {
        id: 'volumeA',
        label: 'Phenolphthalein Titre Volume (A in mL)',
        placeholder: 'Enter A (acceptable: 4.2 – 4.5 mL)',
        unit: 'mL',
        expectedValue: 4.35,
        tolerance: 0.15,
        toleranceType: 'absolute',
        minAccepted: 4.2,
        maxAccepted: 4.5,
        expectedRangeLabel: '4.2–4.5 mL',
      },
      {
        id: 'volumeB',
        label: 'Methyl Orange Additional Titre (B in mL)',
        placeholder: 'Enter B (8.5–9.5 mL)',
        helperText: 'B = M endpoint burette reading − A',
        helperExample: 'Example: if M endpoint = 13.0 mL and A = 4.2 mL, then B = 13.0 − 4.2 = 8.8 mL.',
        unit: 'mL',
        expectedValue: 9.0,
        tolerance: 0.5,
        toleranceType: 'absolute',
        minAccepted: 8.5,
        maxAccepted: 9.5,
        expectedRangeLabel: '8.5–9.5 mL',
      },
      {
        id: 'pAlkalinity',
        label: 'Phenolphthalein Alkalinity P (ppm CaCO₃ eq.)',
        placeholder: 'Calculate P from A (acceptable: 42–45 ppm)',
        unit: 'ppm',
        expectedFormulaName: 'waterAlkalinityP',
        expectedValue: 43.5,
        tolerance: 0.5,
        toleranceType: 'absolute',
        minAccepted: 42.0,
        maxAccepted: 45.0,
        expectedRangeLabel: '42–45 ppm',
      },
      {
        id: 'mAlkalinity',
        label: 'Total Alkalinity M (ppm CaCO₃ eq.)',
        placeholder: 'Calculate M from A + B (acceptable: 127–140 ppm)',
        unit: 'ppm',
        expectedFormulaName: 'waterAlkalinityM',
        expectedValue: 133.5,
        tolerance: 6.5,
        toleranceType: 'absolute',
        minAccepted: 127.0,
        maxAccepted: 140.0,
        expectedRangeLabel: '127–140 ppm',
      },
    ],
  },

  // ── Viva Questions ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'Which ions contribute to alkalinity in natural and industrial water supplies?',
        options: [
          'Hydroxide (OH⁻), Carbonate (CO₃²⁻), and Bicarbonate (HCO₃⁻).',
          'Chloride (Cl⁻), Nitrate (NO₃⁻), and Sulphate (SO₄²⁻).',
          'Calcium (Ca²⁺) and Magnesium (Mg²⁺).',
          'Sodium (Na⁺) and Potassium (K⁺).',
        ],
        correctIndex: 0,
        explanation:
          'Water alkalinity is primarily caused by hydroxide (OH⁻), carbonate (CO₃²⁻), and bicarbonate (HCO₃⁻) anions, which neutralize acid.',
      },
      {
        id: 'q2',
        question: 'Why can hydroxide (OH⁻) and bicarbonate (HCO₃⁻) ions NEVER coexist together in water in appreciable amounts?',
        options: [
          'They react instantly together: OH⁻ + HCO₃⁻ → CO₃²⁻ + H₂O.',
          'They precipitate each other out as insoluble salts.',
          'They repel each other electrostatically.',
          'They decompose into hydrogen gas.',
        ],
        correctIndex: 0,
        explanation:
          'Hydroxide and bicarbonate cannot coexist because OH⁻ rapidly strips a proton from HCO₃⁻ to form carbonate (CO₃²⁻) and water.',
      },
      {
        id: 'q3',
        question: 'When P < 1/2 M, which alkaline species are present in the water?',
        options: [
          'Carbonate (CO₃²⁻ = 2P) and Bicarbonate (HCO₃⁻ = M - 2P).',
          'Hydroxide (OH⁻) only.',
          'Carbonate (CO₃²⁻) only.',
          'Hydroxide (OH⁻) and Carbonate (CO₃²⁻).',
        ],
        correctIndex: 0,
        explanation:
          'When P < 1/2 M, all the hydroxide is absent, carbonate alkalinity is 2P, and the remaining alkalinity (M - 2P) is due to bicarbonate.',
      },
      {
        id: 'q4',
        question: 'Why is standard N/50 (0.02 N) H₂SO₄ preferred for water alkalinity titration?',
        options: [
          '1 mL of 0.02 N acid exactly neutralizes 1.0 mg of CaCO₃ equivalent.',
          'It is a non-volatile, stable primary standard solution.',
          'It acts as its own internal indicator.',
          'It boils at a higher temperature than HCl.',
        ],
        correctIndex: 0,
        explanation:
          '1 mL of 0.02 N acid contains 0.02 meq, which corresponds to 0.02 × 50 mg = 1.0 mg of CaCO₃ equivalent, simplifying ppm calculations to direct multiplication by 10.',
      },
    ],
  },
};
