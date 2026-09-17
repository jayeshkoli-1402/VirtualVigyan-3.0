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
    {
      id: 'measuring-cylinder',
      component: 'MeasuringCylinder',
      label: '100 mL Measuring Cylinder',
      icon: '📏',
      initialProps: { width: 68, height: 185, maxVolume: 100 },
    },
    {
      id: 'digital-balance',
      component: 'DigitalBalance',
      label: 'Digital Analytical Balance',
      icon: '⚖️',
      initialProps: { width: 145, height: 105, massGrams: 0.106, label: '0.106 g' },
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
      accepts: ['water-sample', 'phenolphthalein', 'methyl-orange'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the titration flask.',
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
        component: 'DigitalBalance',
        position: { x: 80, y: 72 },
        scale: 0.95,
        props: { label: 'Analytical Balance' },
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
      instruction: 'Add 1–2 drops phenolphthalein (turns pink). Click the right wing of the burette cork to titrate drop-by-drop with N/50 H₂SO₄ until pink disappears at A = 4.2 mL. Click Continue when observed.',
      requiredActions: ['titrate-p'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'methyl-orange-titration',
      label: '6. Methyl Orange Endpoint (M)',
      instruction: 'Add 2–3 drops methyl orange (turns yellow). Open/rotate the burette cork to continue titration with H₂SO₄ until yellow changes to light pink at total titre A+B = 12.8 mL.',
      requiredActions: ['titrate-m'],
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
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.50 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(236, 72, 153, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Alkaline Water + Phenol (Pink)' },
      ],
      completesAction: 'add-sample',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-titrate-p',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'sampleAdded', equals: true }],
      blockMessage: 'Add the 100 mL water sample first.',
      effects: [
        { type: 'setFlag', key: 'pEndpointReached', value: true },
        { type: 'setVariable', key: 'volumeA', value: 4.2 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.56 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'P Endpoint: Colorless (A = 4.2 mL)' },
      ],
      completesAction: 'titrate-p',
      animation: { type: 'titrate', durationMs: 2200, animatingFlag: 'isTitrating' },
    },
    {
      id: 'inter-titrate-m',
      trigger: { type: 'drop', source: 'methyl-orange', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'pEndpointReached', equals: true }],
      blockMessage: 'Reach the phenolphthalein (P) endpoint first.',
      effects: [
        { type: 'setFlag', key: 'mEndpointReached', value: true },
        { type: 'setVariable', key: 'volumeB', value: 8.6 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.68 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(251, 146, 60, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'M Endpoint: Light Pink (A+B = 12.8 mL)' },
      ],
      completesAction: 'titrate-m',
      animation: { type: 'drip', durationMs: 2200, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'OH⁻ + H⁺ → H₂O | CO₃²⁻ + H⁺ → HCO₃⁻ | HCO₃⁻ + H⁺ → H₂CO₃',
    constants: {
      normalityH2SO4: 0.02,
      sampleVolume: 100.0,
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
    pAlkalinity: 0,
    mAlkalinity: 0,
    stopcockOpen: 0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    flaskPlaced: false,
    sampleAdded: false,
    pEndpointReached: false,
    mEndpointReached: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Alkalinity Calculation',
    instruction: 'P = (A × N × 50 × 1000) / V | M = ((A+B) × N × 50 × 1000) / V',
    fields: [
      {
        id: 'volumeA',
        label: 'Phenolphthalein Titre Volume (A in mL)',
        unit: 'mL',
        expectedValue: 4.2,
        tolerance: 0.2,
      },
      {
        id: 'volumeB',
        label: 'Methyl Orange Additional Titre (B in mL)',
        unit: 'mL',
        expectedValue: 8.6,
        tolerance: 0.2,
      },
      {
        id: 'pAlkalinity',
        label: 'Phenolphthalein Alkalinity P (ppm CaCO₃ eq.)',
        unit: 'ppm',
        expectedValue: 42.0,
        tolerance: 2.0,
      },
      {
        id: 'mAlkalinity',
        label: 'Total Alkalinity M (ppm CaCO₃ eq.)',
        unit: 'ppm',
        expectedValue: 128.0,
        tolerance: 5.0,
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
