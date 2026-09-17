/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Determination of Chloride by Mohr's Method
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Precipitation titration:
 *  Ag⁺ + Cl⁻ → AgCl↓ (white precipitate)
 *  2Ag⁺ + CrO₄²⁻ → Ag₂CrO₄↓ (brick-red precipitate at endpoint)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const chlorideMohrMethod: ExperimentConfig = {
  id: 'chloride-mohr-method',
  title: "Chloride Content by Mohr's Method",
  subtitle: 'Ag⁺ + Cl⁻ → AgCl↓ (white) → Ag₂CrO₄↓ (brick-red)',
  description:
    'Estimate chloride ion concentration in a water sample by argentometric precipitation titration using potassium chromate indicator.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'medium',
  themeColor: '#e11d48',
  icon: '🧂',
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
      id: 'agno3-titrant',
      component: 'ReagentBottle',
      label: '0.02 N AgNO₃ Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.7)', label: '0.02 N AgNO₃' },
    },
    {
      id: 'conical-flask',
      component: 'ConicalFlask',
      label: '250 mL Conical Flask',
      icon: '⚗️',
      initialProps: { liquidLevel: 0, width: 130, height: 150 },
    },
    {
      id: 'nacl-standard',
      component: 'ReagentBottle',
      label: '0.02 N NaCl Standard',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.4)', label: 'Std NaCl' },
    },
    {
      id: 'k2cro4-indicator',
      component: 'Dropper',
      label: '5% K₂CrO₄ Indicator',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(250, 204, 21, 0.95)', label: 'K₂CrO₄' },
    },
    {
      id: 'water-sample',
      component: 'ReagentBottle',
      label: 'Water Sample (Chloride)',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.5)', label: 'Sample' },
    },
    {
      id: 'na2co3-buffer',
      component: 'ReagentBottle',
      label: 'Chloride-free Na₂CO₃',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(255, 255, 255, 0.6)', label: 'Na₂CO₃' },
    },
    {
      id: 'measuring-cylinder',
      component: 'MeasuringCylinder',
      label: '50 mL Measuring Cylinder',
      icon: '📏',
      initialProps: { width: 65, height: 175, maxVolume: 50 },
    },
    {
      id: 'digital-balance',
      component: 'DigitalBalance',
      label: 'Digital Analytical Balance',
      icon: '⚖️',
      initialProps: { width: 145, height: 105, massGrams: 0.117, label: '0.117 g' },
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
      label: 'Fill Burette with 0.02 N AgNO₃',
      accepts: ['agno3-titrant'],
      position: { x: 50, y: 14 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour 0.02 N AgNO₃ titrant into the top of the burette.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'burette' },
    },
    {
      id: 'flask-bench-zone',
      label: 'Place Flask under Burette',
      accepts: ['conical-flask'],
      position: { x: 50, y: 64 },
      size: { width: 24, height: 32 },
      rejectMessage: 'Place the conical flask under the burette tip.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask',
      accepts: ['nacl-standard', 'k2cro4-indicator', 'water-sample', 'na2co3-buffer'],
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
      label: '2. Fill Burette with AgNO₃',
      instruction: 'Drag the 0.02 N AgNO₃ bottle to the top of the burette to fill it up to the 0.0 mL mark.',
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
      id: 'pipette-sample',
      label: '4. Add 10 mL Water Sample',
      instruction: 'Pipette 10 mL of the water sample into the flask. Add a pinch of chloride-free Na₂CO₃.',
      requiredActions: ['add-sample'],
      type: 'lab',
    },
    {
      id: 'add-chromate',
      label: '5. Add K₂CrO₄ Indicator',
      instruction: 'Add 3–4 drops of 5% potassium chromate indicator. Note the bright yellow color.',
      requiredActions: ['add-indicator'],
      type: 'lab',
    },
    {
      id: 'titrate-ag',
      label: '6. Titrate with AgNO₃',
      instruction: 'Click the right wing of the burette cork to titrate drop-by-drop with 0.02 N AgNO₃. Stop when a permanent brick-red Ag₂CrO₄ precipitate appears at 8.2 mL.',
      requiredActions: ['titrate-ag'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '7. Calculations & Viva',
      instruction: 'Calculate the chloride content in mg/L (ppm) using the burette reading (8.2 mL of 0.02 N AgNO₃).',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '8. Score & Evaluation',
      instruction: 'Review your precipitation titration accuracy and answers.',
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
      trigger: { type: 'drop', source: 'agno3-titrant', target: 'burette-top-zone' },
      conditions: [{ type: 'flag', key: 'burettePlaced', equals: true }],
      blockMessage: 'Clamp the burette on the retort stand before filling it.',
      effects: [
        { type: 'setFlag', key: 'buretteFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidLevel', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: '0.02 N AgNO₃ Burette' },
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
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '10 mL Water Sample' },
      ],
      completesAction: 'add-sample',
      animation: { type: 'pour', durationMs: 1800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-add-chromate',
      trigger: { type: 'drop', source: 'k2cro4-indicator', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'sampleAdded', equals: true }],
      blockMessage: 'Add the water sample first.',
      effects: [
        { type: 'setFlag', key: 'indicatorAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.40 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(250, 204, 21, 0.95)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sample + K₂CrO₄ (Bright Yellow)' },
      ],
      completesAction: 'add-indicator',
      animation: { type: 'drip', durationMs: 2000, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-ag',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'indicatorAdded', equals: true }],
      blockMessage: 'Add K₂CrO₄ indicator before starting titration.',
      effects: [
        { type: 'setFlag', key: 'endpointBrickRed', value: true },
        { type: 'setVariable', key: 'buretteReading', value: 8.2 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.55 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(185, 28, 28, 0.92)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Brick Red Ag₂CrO₄ Endpoint (8.2 mL)' },
      ],
      completesAction: 'titrate-ag',
      animation: { type: 'titrate', durationMs: 2400, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'Ag⁺ + Cl⁻ → AgCl↓ | 2Ag⁺ + CrO₄²⁻ → Ag₂CrO₄↓',
    constants: {
      sampleVolume: 10.0,
      normalityAgNO3: 0.02,
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
      name: 'Sample & Indicator Addition',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'indicatorAdded', truePoints: 20 },
    },
    {
      name: 'Brick-Red Endpoint Detection',
      maxPoints: 30,
      evaluator: { type: 'booleanCheck', flag: 'endpointBrickRed', truePoints: 30 },
    },
    {
      name: 'Chloride Concentration Calculation',
      maxPoints: 30,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'chlorideContent',
        correctPoints: 30,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'fill-before-clamp',
      trigger: 'drop:agno3-titrant→burette-top-zone',
      condition: { type: 'flag', key: 'burettePlaced', equals: false },
      message: 'Clamp the burette on the retort stand before filling it with AgNO₃.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    sampleVolume: 10,
    normalityAgNO3: 0.02,
    buretteReading: 0,
    chlorideContent: 0,
    stopcockOpen: 0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    flaskPlaced: false,
    sampleAdded: false,
    indicatorAdded: false,
    endpointBrickRed: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Chloride Content Calculation',
    instruction: 'Chloride (mg/L) = (V × N × 35.45 × 1000) / V_sample',
    fields: [
      {
        id: 'sampleVolume',
        label: 'Volume of Water Sample (V_sample in mL)',
        unit: 'mL',
        expectedValue: 10.0,
        tolerance: 0.1,
      },
      {
        id: 'normalityAgNO3',
        label: 'Normality of AgNO₃ (N)',
        unit: 'N',
        expectedValue: 0.02,
        tolerance: 0.01,
      },
      {
        id: 'buretteReading',
        label: 'Titre of 0.02 N AgNO₃ (V in mL)',
        unit: 'mL',
        expectedValue: 8.2,
        tolerance: 0.2,
      },
      {
        id: 'chlorideContent',
        label: 'Chloride Ion Concentration (mg/L or ppm)',
        unit: 'mg/L',
        expectedValue: 581.38,
        tolerance: 15.0,
      },
    ],
  },

  // ── Viva Questions ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: "Why must Mohr's argentometric titration be carried out strictly in the neutral pH range (6.5–8.5)?",
        options: [
          'In acidic medium, CrO₄²⁻ converts to Cr₂O₇²⁻ which fails to form Ag₂CrO₄; In alkaline medium, Ag⁺ precipitates as AgOH/Ag₂O.',
          'Silver chloride dissolves in neutral pH.',
          'Potassium chromate decomposes in air.',
          'To prevent hydrogen gas bubbles from escaping.',
        ],
        correctIndex: 0,
        explanation:
          'At pH < 6.5, chromate forms dichromate (Cr₂O₇²⁻), which does not precipitate silver at low concentrations. At pH > 8.5, silver precipitates as brown silver hydroxide/oxide (Ag₂O).',
      },
      {
        id: 'q2',
        question: 'Why does white AgCl precipitate before brick-red Ag₂CrO₄ even though Ag₂CrO₄ has a lower Ksp?',
        options: [
          'AgCl has a lower molar solubility (1.33 × 10⁻⁵ M) than Ag₂CrO₄ (6.5 × 10⁻⁵ M).',
          'Chloride ions are smaller in size than silver ions.',
          'Chromate ions carry a 2- charge.',
          'AgCl is a colored complex.',
        ],
        correctIndex: 0,
        explanation:
          'Precipitation order is dictated by molar solubility. Because AgCl has lower molar solubility than Ag₂CrO₄, AgCl precipitates first until virtually all Cl⁻ is consumed.',
      },
    ],
  },
};
