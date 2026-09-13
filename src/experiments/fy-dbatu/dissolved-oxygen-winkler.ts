/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Determination of Dissolved Oxygen (Winkler's Method)
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Iodometric fixation:
 *  Mn²⁺ + 2OH⁻ → Mn(OH)₂
 *  2Mn(OH)₂ + O₂ → 2MnO(OH)₂↓ (brown precipitate)
 *  MnO(OH)₂ + 2I⁻ + 4H⁺ → Mn²⁺ + I₂ + 3H₂O
 *  I₂ + 2S₂O₃²⁻ → S₄O₆²⁻ + 2I⁻ (Starch: Deep Blue → Colorless)
 *
 *  DO = 0.8 · V₂ ppm
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const dissolvedOxygenWinkler: ExperimentConfig = {
  id: 'dissolved-oxygen-winkler',
  title: "Dissolved Oxygen by Winkler's Method",
  subtitle: 'DO = 0.8 · V₂ ppm (Iodometric Titration)',
  description:
    'Determine the concentration of dissolved oxygen (DO) in a water sample by chemical fixation with MnSO₄/alkaline KI and iodometric starch titration.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'hard',
  themeColor: '#0284c7',
  icon: '🌊',
  estimatedMinutes: 24,

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
      id: 'thiosulphate-titrant',
      component: 'ReagentBottle',
      label: 'N/50 Na₂S₂O₃ Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.7)', label: 'N/50 Na₂S₂O₃' },
    },
    {
      id: 'bod-bottle',
      component: 'BODBottle',
      label: '300 mL BOD Bottle',
      icon: '🍾',
      initialProps: { liquidLevel: 0, width: 110, height: 175 },
    },
    {
      id: 'conical-flask',
      component: 'ConicalFlask',
      label: '250 mL Titration Flask',
      icon: '⚗️',
      initialProps: { liquidLevel: 0, width: 120, height: 140 },
    },
    {
      id: 'water-sample',
      component: 'ReagentBottle',
      label: 'Water Sample (250 mL)',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.45)', label: 'River H₂O' },
    },
    {
      id: 'mnso4-reagent',
      component: 'Dropper',
      label: '2 mL MnSO₄ Solution',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(244, 114, 182, 0.65)', label: 'MnSO₄' },
    },
    {
      id: 'alkaline-ki',
      component: 'Dropper',
      label: '2 mL Alkaline KI',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(253, 224, 71, 0.85)', label: 'Alk. KI' },
    },
    {
      id: 'conc-h2so4',
      component: 'Dropper',
      label: 'Conc. H₂SO₄ (Acidifier)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.7)', label: 'H₂SO₄' },
    },
    {
      id: 'starch-indicator',
      component: 'Dropper',
      label: 'Starch Indicator',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(30, 58, 138, 0.9)', label: 'Starch' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'clamp-zone',
      label: 'Clamp Burette on Retort Stand',
      accepts: ['burette'],
      position: { x: 65, y: 32 },
      size: { width: 22, height: 44 },
      rejectMessage: 'Mount the 50 mL burette onto the retort stand clamp.',
    },
    {
      id: 'burette-top-zone',
      label: 'Fill Burette with N/50 Na₂S₂O₃',
      accepts: ['thiosulphate-titrant'],
      position: { x: 65, y: 14 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour N/50 Na₂S₂O₃ titrant into the top of the burette.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'burette' },
    },
    {
      id: 'bod-bench-zone',
      label: 'Place BOD Bottle on Bench',
      accepts: ['bod-bottle'],
      position: { x: 32, y: 58 },
      size: { width: 22, height: 38 },
      rejectMessage: 'Place the BOD bottle on the lab bench.',
    },
    {
      id: 'bod-mouth-zone',
      label: 'Into BOD Bottle',
      accepts: ['water-sample', 'mnso4-reagent', 'alkaline-ki', 'conc-h2so4'],
      position: { x: 32, y: 44 },
      size: { width: 16, height: 26 },
      rejectMessage: 'Add reagent into the BOD bottle below surface.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'bod-bottle' },
    },
    {
      id: 'flask-bench-zone',
      label: 'Place Titration Flask',
      accepts: ['conical-flask'],
      position: { x: 65, y: 64 },
      size: { width: 22, height: 34 },
      rejectMessage: 'Place the conical flask under the burette stand.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Titration Flask',
      accepts: ['starch-indicator'],
      position: { x: 65, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add indicator into the conical flask.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      {
        component: 'RetortStand',
        position: { x: 65, y: 38 },
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
      label: '2. Fill Burette with Thiosulphate',
      instruction: 'Drag the N/50 Na₂S₂O₃ bottle to the top of the burette to fill it up to the 0.0 mL mark.',
      requiredActions: ['fill-burette'],
      type: 'lab',
    },
    {
      id: 'setup',
      label: '3. Place BOD Bottle',
      instruction: 'Place the 300 mL BOD incubation bottle on the laboratory bench.',
      requiredActions: ['place-bod'],
      type: 'lab',
    },
    {
      id: 'fill-sample',
      label: '4. Fill 250 mL Sample (No Bubbles)',
      instruction: 'Carefully fill 250 mL water sample into the BOD bottle. Avoid trapping any air bubbles.',
      requiredActions: ['fill-sample'],
      type: 'lab',
    },
    {
      id: 'oxygen-fixation',
      label: '5. Add MnSO₄ & Alkaline KI',
      instruction: 'Add 2 mL MnSO₄ and 2 mL alkaline KI. Stopper and shake. A brown precipitate of basic manganic oxide forms.',
      requiredActions: ['fix-oxygen'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'acidification',
      label: '6. Acidify with Conc. H₂SO₄',
      instruction: 'Add 2 mL concentrated H₂SO₄. The brown precipitate dissolves completely, liberating free golden-brown iodine.',
      requiredActions: ['acidify'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'transfer-titrate',
      label: '7. Transfer & Titrate with Thiosulphate',
      instruction: 'Place the conical flask under the burette. Transfer 100 mL of liberated I₂ solution. Click the right wing of the burette cork to titrate drop-by-drop with N/50 Na₂S₂O₃ until pale straw yellow. Add starch (deep blue) and continue to colorless endpoint at V₂ = 7.8 mL.',
      requiredActions: ['titrate-iodine'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '8. Calculations & Viva',
      instruction: 'Calculate the dissolved oxygen (DO) concentration in ppm (mg/L).',
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
      trigger: { type: 'drop', source: 'thiosulphate-titrant', target: 'burette-top-zone' },
      conditions: [{ type: 'flag', key: 'burettePlaced', equals: true }],
      blockMessage: 'Clamp the burette on the retort stand before filling it.',
      effects: [
        { type: 'setFlag', key: 'buretteFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidLevel', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: 'N/50 Na₂S₂O₃ Burette' },
      ],
      completesAction: 'fill-burette',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-place-bod',
      trigger: { type: 'drop', source: 'bod-bottle', target: 'bod-bench-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'bod-bottle', zoneId: 'bod-bench-zone' },
        { type: 'setFlag', key: 'bodPlaced', value: true },
      ],
      completesAction: 'place-bod',
    },
    {
      id: 'inter-fill-sample',
      trigger: { type: 'drop', source: 'water-sample', target: 'bod-mouth-zone' },
      conditions: [{ type: 'flag', key: 'bodPlaced', equals: true }],
      blockMessage: 'Place the BOD bottle on the workbench first.',
      effects: [
        { type: 'setFlag', key: 'sampleFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidLevel', value: 0.85 },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'label', value: '250 mL Sample (Bubble-Free)' },
      ],
      completesAction: 'fill-sample',
      animation: { type: 'pour', durationMs: 2200, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-fix-oxygen',
      trigger: { type: 'drop', source: 'alkaline-ki', target: 'bod-mouth-zone' },
      conditions: [{ type: 'flag', key: 'sampleFilled', equals: true }],
      blockMessage: 'Fill the water sample into the BOD bottle first.',
      effects: [
        { type: 'setFlag', key: 'oxygenFixed', value: true },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidLevel', value: 0.90 },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidColor', value: 'rgba(180, 83, 9, 0.92)' },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'label', value: 'Brown Precipitate [MnO(OH)₂]' },
      ],
      completesAction: 'fix-oxygen',
      animation: { type: 'drip', durationMs: 2200, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-acidify',
      trigger: { type: 'drop', source: 'conc-h2so4', target: 'bod-mouth-zone' },
      conditions: [{ type: 'flag', key: 'oxygenFixed', equals: true }],
      blockMessage: 'Add MnSO₄ and alkaline KI before acidifying.',
      effects: [
        { type: 'setFlag', key: 'acidified', value: true },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidLevel', value: 0.94 },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidColor', value: 'rgba(217, 119, 6, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'label', value: 'Clear Golden-Brown (Liberated I₂)' },
      ],
      completesAction: 'acidify',
      animation: { type: 'drip', durationMs: 2000, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-place-flask',
      trigger: { type: 'drop', source: 'conical-flask', target: 'flask-bench-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'conical-flask', zoneId: 'flask-bench-zone' },
        { type: 'setFlag', key: 'flaskPlaced', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.45 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(217, 119, 6, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '100 mL Liberated I₂ Aliquot' },
      ],
      completesAction: 'place-flask',
    },
    {
      id: 'inter-add-starch',
      trigger: { type: 'drop', source: 'starch-indicator', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'flaskPlaced', equals: true }],
      blockMessage: 'Place the titration flask beneath the burette first.',
      effects: [
        { type: 'setFlag', key: 'starchAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.50 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(30, 58, 138, 0.95)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Deep Blue [I₂-Starch Complex]' },
      ],
      completesAction: 'add-starch',
      animation: { type: 'drip', durationMs: 2000, animatingFlag: 'isAddingIndicator' },
    },
    {
      id: 'inter-titrate-do',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'flaskPlaced', equals: true }],
      blockMessage: 'Transfer the acidified I₂ solution into the conical flask first.',
      effects: [
        { type: 'setFlag', key: 'endpointColorless', value: true },
        { type: 'setVariable', key: 'thiosulphateVolume', value: 7.8 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.62 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Colorless Endpoint (V₂ = 7.8 mL)' },
      ],
      completesAction: 'titrate-iodine',
      animation: { type: 'titrate', durationMs: 2400, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: '2Mn(OH)₂ + O₂ → 2MnO(OH)₂ | I₂ + 2S₂O₃²⁻ → S₄O₆²⁻ + 2I⁻',
    constants: {
      thiosulphateNormality: 0.02,
      sampleAliquot: 100.0,
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
      name: 'Oxygen Fixation & Acidification',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'acidified', truePoints: 25 },
    },
    {
      name: 'Iodometric Endpoint (Colorless)',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'endpointColorless', truePoints: 25 },
    },
    {
      name: 'Dissolved Oxygen Calculation',
      maxPoints: 30,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'dissolvedOxygen',
        correctPoints: 30,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'fill-before-clamp',
      trigger: 'drop:thiosulphate-titrant→burette-top-zone',
      condition: { type: 'flag', key: 'burettePlaced', equals: false },
      message: 'Clamp the burette on the retort stand before filling it with Na₂S₂O₃.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    thiosulphateNormality: 0.02,
    thiosulphateVolume: 0,
    sampleAliquot: 100,
    dissolvedOxygen: 0,
    stopcockOpen: 0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    bodPlaced: false,
    sampleFilled: false,
    oxygenFixed: false,
    acidified: false,
    flaskPlaced: false,
    starchAdded: false,
    endpointColorless: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Dissolved Oxygen Calculation',
    instruction: 'DO (mg/L or ppm) = (V × N × 8 × 1000) / V_sample = (V₂ × 0.02 × 8000) / 100 = 0.8 × V₂',
    fields: [
      {
        id: 'thiosulphateVolume',
        label: 'Titre of N/50 Na₂S₂O₃ (V₂ in mL)',
        unit: 'mL',
        expectedValue: 7.8,
        tolerance: 0.2,
      },
      {
        id: 'dissolvedOxygen',
        label: 'Dissolved Oxygen Concentration (ppm or mg/L)',
        unit: 'mg/L',
        expectedValue: 6.24,
        tolerance: 0.2,
      },
    ],
  },

  // ── Viva Questions ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: "What is the primary role of MnSO₄ in Winkler's DO determination method?",
        options: [
          'Mn²⁺ is oxidized by dissolved O₂ in alkaline medium to Mn⁴⁺ basic oxide, chemically fixing unstable dissolved oxygen.',
          'It acts as a primary standard reducing agent.',
          'It changes color from red to blue at the endpoint.',
          'It prevents iron and chloride interference.',
        ],
        correctIndex: 0,
        explanation:
          'Under alkaline conditions, Mn(OH)₂ rapidly reacts with dissolved oxygen to form brown insoluble MnO(OH)₂ (manganic basic oxide), preventing loss of gaseous oxygen.',
      },
      {
        id: 'q2',
        question: 'Why should starch indicator only be added near the end of iodometric titration (when color is pale yellow)?',
        options: [
          'At high I₂ concentration, starch forms an irreversibly adsorbed, slow-reacting blue complex that releases iodine sluggishly, leading to titration error.',
          'Starch decomposes quickly in acidic solution.',
          'Starch precipitates out of solution in water.',
          'Starch reacts directly with sodium thiosulphate.',
        ],
        correctIndex: 0,
        explanation:
          'Starch binds tightly to high concentrations of I₂, making the complex decompose very slowly upon addition of thiosulphate. Adding it near the end ensures a sharp, reversible endpoint.',
      },
      {
        id: 'q3',
        question: 'What is the healthy ecological range of Dissolved Oxygen (DO) in natural river waters supporting aquatic life?',
        options: [
          '4.0 to 8.0 mg/L (ppm).',
          '0.5 to 1.5 mg/L.',
          '20.0 to 35.0 mg/L.',
          '0.0 to 0.5 mg/L.',
        ],
        correctIndex: 0,
        explanation:
          'Good quality natural surface water typically contains 6.0–8.5 mg/L DO. Values below 4.0 mg/L cause severe fish mortality and indicate high organic pollution.',
      },
    ],
  },
};
