import type { ExperimentConfig } from '../../engine/experimentConfig';

export const acidValueOil: ExperimentConfig = {
  id: 'fy-chem-acid-value-oil',
  title: 'Acid Value of Vegetable Oil',
  subtitle: 'RCOOH + KOH → RCOOK + H₂O',
  description:
    'Determine the acid value and percentage of free fatty acids (FFA) in a commercial vegetable oil sample by direct alkali titration with standard 0.1 N KOH solution using phenolphthalein indicator.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'medium',
  themeColor: '#eab308',
  icon: '🫒',
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
      id: 'koh-titrant',
      component: 'ReagentBottle',
      label: '0.1 N Standard KOH Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.7)', label: '0.1 N KOH' },
    },
    {
      id: 'conical-flask',
      component: 'ConicalFlask',
      label: '250 mL Conical Flask',
      icon: '⚗️',
      initialProps: { liquidLevel: 0, width: 130, height: 150 },
    },
    {
      id: 'oil-sample',
      component: 'ReagentBottle',
      label: '5.0 g Vegetable Oil Sample',
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
    {
      id: 'water-bath',
      component: 'WaterBath',
      label: 'Water Bath (Warm Reflux)',
      icon: '♨️',
      initialProps: { width: 150, height: 110 },
    },
    {
      id: 'digital-balance',
      component: 'DigitalBalance',
      label: 'Digital Analytical Balance',
      icon: '⚖️',
      initialProps: { width: 145, height: 105, massGrams: 5.00, label: '5.000 g' },
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
      label: 'Fill Burette with 0.1 N KOH',
      accepts: ['koh-titrant'],
      position: { x: 50, y: 14 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour 0.1 N KOH titrant into the top of the burette.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'burette' },
    },
    {
      id: 'bench-flask-zone',
      label: 'Place Flask on Workbench',
      accepts: ['conical-flask'],
      position: { x: 50, y: 64 },
      size: { width: 24, height: 32 },
      rejectMessage: 'Place the conical flask on the lab bench beneath the burette.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask',
      accepts: ['oil-sample', 'neutral-alcohol', 'phenolphthalein'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add sample and reagents into the conical flask.',
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
      label: '2. Fill Burette with 0.1 N KOH',
      instruction: 'Drag the 0.1 N Standard KOH bottle to the top of the burette to fill it up to the 0.0 mL mark.',
      requiredActions: ['fill-burette'],
      type: 'lab',
    },
    {
      id: 'place-flask',
      label: '3. Place Flask',
      instruction: 'Place the clean conical flask on the laboratory bench beneath the clamped burette.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'weigh-oil',
      label: '4. Add 5.0 g Oil Sample',
      instruction: 'Weigh and transfer 5.0 g of vegetable oil sample into the conical flask.',
      requiredActions: ['add-oil'],
      type: 'lab',
    },
    {
      id: 'add-alcohol',
      label: '5. Add 50 mL Neutral Alcohol',
      instruction: 'Add 50 mL neutral ethyl alcohol to dissolve free fatty acids.',
      requiredActions: ['add-alcohol'],
      type: 'lab',
    },
    {
      id: 'warm-and-cool',
      label: '6. Heat & Cool',
      instruction: 'Warm flask on water bath to dissolve all fatty acids, then cool to room temperature. Click Continue when ready.',
      requiredActions: [],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'titrate-koh',
      label: '7. Titrate with 0.1 N KOH',
      instruction: 'Add 2 drops phenolphthalein. Click the right wing of the burette cork to titrate drop-by-drop with 0.1 N KOH until faint permanent pink persists at V = 3.5 mL.',
      requiredActions: ['titrate-koh'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '8. Calculations & Viva',
      instruction: 'Calculate the acid value of the oil sample in mg KOH / g oil.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '9. Score Breakdown',
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
      trigger: { type: 'drop', source: 'koh-titrant', target: 'burette-top-zone' },
      conditions: [{ type: 'flag', key: 'burettePlaced', equals: true }],
      blockMessage: 'Clamp the burette on the retort stand before filling it.',
      effects: [
        { type: 'setFlag', key: 'buretteFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidLevel', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: '0.1 N KOH Burette' },
      ],
      completesAction: 'fill-burette',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
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
        { type: 'setFlag', key: 'oilAdded', value: true },
        { type: 'setFlag', key: 'oilWeighed', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.18 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(234, 179, 8, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '5.0 g Oil' },
      ],
      completesAction: 'add-oil',
      animation: { type: 'pour', durationMs: 1800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-add-alcohol',
      trigger: { type: 'drop', source: 'neutral-alcohol', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'oilWeighed', equals: true }],
      blockMessage: 'Add the 5.0 g oil sample first.',
      effects: [
        { type: 'setFlag', key: 'alcoholAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.58 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(245, 158, 11, 0.72)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Oil + 50 mL Neutral EtOH' },
      ],
      completesAction: 'add-alcohol',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-add-indicator',
      trigger: { type: 'drop', source: 'phenolphthalein', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'alcoholAdded', equals: true }],
      blockMessage: 'Add neutral alcohol before adding indicator.',
      effects: [
        { type: 'setFlag', key: 'indicatorAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.60 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(245, 158, 11, 0.72)' },
      ],
      animation: { type: 'drip', durationMs: 2000, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-koh',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'alcoholAdded', equals: true }],
      blockMessage: 'Dissolve oil in neutral alcohol before titrating.',
      effects: [
        { type: 'setFlag', key: 'endpointPink', value: true },
        { type: 'setFlag', key: 'titrationDone', value: true },
        { type: 'setVariable', key: 'kohVolume', value: 3.5 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.68 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(244, 114, 182, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Faint Pink Endpoint (3.5 mL KOH)' },
      ],
      completesAction: 'titrate-koh',
      animation: { type: 'titrate', durationMs: 2400, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'RCOOH + KOH -> RCOOK + H2O',
    constants: {
      molecularWeightKOH: 56.1,
      oilWeight: 5.0,
      kohNormality: 0.1,
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
      name: 'Sample Preparation',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'indicatorAdded', truePoints: 20 },
    },
    {
      name: 'Titration Endpoint Accuracy',
      maxPoints: 30,
      evaluator: { type: 'booleanCheck', flag: 'endpointPink', truePoints: 30 },
    },
    {
      name: 'Acid Value Calculation',
      maxPoints: 30,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'acidValue',
        correctPoints: 30,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'fill-before-clamp',
      trigger: 'drop:koh-titrant→burette-top-zone',
      condition: { type: 'flag', key: 'burettePlaced', equals: false },
      message: 'Clamp the burette on the retort stand before filling it with KOH.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    oilWeight: 5.0,
    kohNormality: 0.1,
    kohVolume: 0,
    acidValue: 0,
    freeFattyAcid: 0,
    stopcockOpen: 0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    flaskPlaced: false,
    oilAdded: false,
    oilWeighed: false,
    alcoholAdded: false,
    indicatorAdded: false,
    endpointPink: false,
    titrationDone: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Acid Value Calculation',
    instruction: 'Acid Value = (V × N × 56.1) / W mg KOH/g',
    fields: [
      {
        id: 'kohVolume',
        label: 'Burette Reading of 0.1 N KOH (V in mL)',
        unit: 'mL',
        expectedValue: 3.5,
        tolerance: 0.1,
      },
      {
        id: 'acidValue',
        label: 'Calculated Acid Value (mg KOH / g oil)',
        unit: 'mg KOH/g',
        expectedValue: 3.927,
        tolerance: 0.1,
      },
      {
        id: 'freeFattyAcid',
        label: '% Free Fatty Acids (% FFA as Oleic Acid)',
        unit: '%',
        expectedValue: 1.97,
        tolerance: 0.1,
      },
    ],
  },

  // ── Viva Questions ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'What is the definition of Acid Value of an oil or fat?',
        options: [
          'Milligrams of KOH required to neutralize free fatty acids in 1.0 g of oil/fat.',
          'Grams of iodine absorbed by 100 g of oil.',
          'Milligrams of KOH required to saponify 1.0 g of fat.',
          'Volume of alkali required to neutralize volatile fatty acids.',
        ],
        correctIndex: 0,
        explanation:
          'Acid value is defined as the number of milligrams of potassium hydroxide (KOH) required to neutralize the free fatty acids present in 1 gram of oil or fat.',
      },
      {
        id: 'q2',
        question: 'Why is neutral alcohol added to the oil sample before titration?',
        options: [
          'To dissolve the oil and free fatty acids in a non-interfering, neutral solvent medium.',
          'To increase the saponification rate of triglycerides.',
          'To bleach the natural yellow color of vegetable oil.',
          'To act as an internal chemical indicator.',
        ],
        correctIndex: 0,
        explanation:
          'Oils are insoluble in pure water. Neutral ethanol dissolves the oil and extracts the free fatty acids for clean, rapid neutralization with KOH without altering pH.',
      },
      {
        id: 'q3',
        question: 'What is the indicator used in the acid value determination and what is the endpoint color?',
        options: [
          'Phenolphthalein indicator; Colorless to faint permanent pink (persisting for 15-30 seconds).',
          'Methyl Orange; Red to golden yellow.',
          'Starch indicator; Deep blue to colorless.',
          'Eriochrome Black T; Wine red to steel blue.',
        ],
        correctIndex: 0,
        explanation:
          'Phenolphthalein is used as the indicator. In acidic/neutral oil-alcohol solution it is colorless, and at the endpoint (excess trace KOH) it turns faint permanent pink.',
      },
      {
        id: 'q4',
        question: 'What does a high acid value in commercial edible vegetable oil indicate?',
        options: [
          'High rancidity and extensive hydrolytic deterioration into free fatty acids during storage.',
          'High purity and premium quality of the fresh oil.',
          'Low degree of unsaturation and high stability.',
          'High vitamin E content.',
        ],
        correctIndex: 0,
        explanation:
          'A high acid value indicates that the oil has undergone significant hydrolytic breakdown of triglycerides by moisture and lipases into free fatty acids, indicating rancidity and poor freshness.',
      },
    ],
  },
};
