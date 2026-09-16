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
      initialProps: { width: 145, height: 105, massGrams: 0.08, label: '0.080 g' },
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
      label: 'Into Conical Flask',
      accepts: ['water-sample', 'thiosulphate', 'methyl-orange', 'phenolphthalein'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the conical flask.',
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
      requiredActions: ['add-water-sample'],
      type: 'lab',
    },
    {
      id: 'part-a-titration',
      label: '5. Part A — Methyl Orange Acidity',
      instruction: 'Add methyl orange (turns red). Click the right wing of the burette cork to titrate drop-by-drop with N/50 NaOH until red turns to yellow at Y = 2.4 mL. Click Continue when observed.',
      requiredActions: ['titrate-methyl-orange'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'part-b-titration',
      label: '6. Part B — Total Acidity',
      instruction: 'Add phenolphthalein. Open/rotate the burette cork to titrate with N/50 NaOH until faint pink persists for 30 seconds at Z = 5.4 mL. Click Continue when observed.',
      requiredActions: ['titrate-phenolphthalein'],
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
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.45 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '100 mL Acidic Water Sample' },
      ],
      completesAction: 'add-water-sample',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-titrate-mo',
      trigger: { type: 'drop', source: 'methyl-orange', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'waterAdded', equals: true }],
      blockMessage: 'Add the 100 mL water sample first.',
      effects: [
        { type: 'setFlag', key: 'moEndpointReached', value: true },
        { type: 'setVariable', key: 'volumeY', value: 2.4 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.52 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(234, 179, 8, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'MO Endpoint: Yellow (Y = 2.4 mL)' },
      ],
      completesAction: 'titrate-methyl-orange',
      animation: { type: 'drip', durationMs: 2000, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-phenol',
      trigger: { type: 'drop', source: 'phenolphthalein', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'moEndpointReached', equals: true }],
      blockMessage: 'Complete the Methyl Orange mineral acidity titration (Part A) first.',
      effects: [
        { type: 'setFlag', key: 'phenolEndpointReached', value: true },
        { type: 'setVariable', key: 'volumeZ', value: 5.4 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.65 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(244, 114, 182, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Total Acidity: Faint Pink (Z = 5.4 mL)' },
      ],
      completesAction: 'titrate-phenolphthalein',
      animation: { type: 'drip', durationMs: 2000, animatingFlag: 'isAddingIndicator' },
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'H⁺ + OH⁻ → H₂O | H₂CO₃ + OH⁻ → HCO₃⁻ + H₂O',
    constants: {
      normalityNaOH: 0.02,
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
      name: 'Acidity Calculations',
      maxPoints: 30,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'totalAcidity',
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
    volumeY: 0,
    volumeZ: 0,
    normalityNaOH: 0.02,
    sampleVolume: 100,
    mineralAcidity: 0,
    totalAcidity: 0,
    stopcockOpen: 0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    flaskPlaced: false,
    waterAdded: false,
    moEndpointReached: false,
    phenolEndpointReached: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Water Acidity Calculation',
    instruction: 'Acidity (ppm CaCO₃ eq.) = (V × N × 50 × 1000) / V_sample = V × 10 ppm',
    fields: [
      {
        id: 'volumeY',
        label: 'Methyl Orange Titre (Y in mL)',
        unit: 'mL',
        expectedValue: 2.4,
        tolerance: 0.2,
      },
      {
        id: 'volumeZ',
        label: 'Phenolphthalein Titre (Z in mL)',
        unit: 'mL',
        expectedValue: 5.4,
        tolerance: 0.2,
      },
      {
        id: 'mineralAcidity',
        label: 'Mineral Acidity (ppm CaCO₃ eq.)',
        unit: 'ppm',
        expectedValue: 24.0,
        tolerance: 2.0,
      },
      {
        id: 'totalAcidity',
        label: 'Total Acidity (ppm CaCO₃ eq.)',
        unit: 'ppm',
        expectedValue: 54.0,
        tolerance: 3.0,
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
