/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Types of Chemical Reactions
 *  CBSE Class 10 Science — Chemical Reactions and Equations (Exp 10.3)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Carry out four fundamental reactions:
 *  (a) CaO + H₂O → Ca(OH)₂ + Heat (Combination, Exothermic)
 *  (b) 2FeSO₄·7H₂O → Fe₂O₃ + SO₂↑ + SO₃↑ + 14H₂O (Thermal Decomposition)
 *  (c) Fe + CuSO₄ → FeSO₄ + Cu (Displacement)
 *  (d) Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl (Double Displacement / Precipitation)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const typesOfReactions: ExperimentConfig = {
  id: 'types-of-reactions',
  title: 'Types of Chemical Reactions',
  subtitle: 'Combination, Decomposition, Displacement & Double Displacement',
  description:
    'Perform four classic chemical transformations: slaking of quicklime, thermal breakdown of ferrous sulphate, displacement of copper by iron, and precipitation of barium sulphate. Classify each reaction type.',
  class: 10,
  subject: 'Chemistry',
  chapter: 'Chemical Reactions and Equations',
  difficulty: 'medium',
  themeColor: '#059669',
  icon: '🔥',
  estimatedMinutes: 35,
  underDevelopment: true,
  adminOnly: true,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'beaker-cao',
      component: 'Beaker',
      label: 'Reaction Beaker (Combination)',
      icon: '🥛',
      initialProps: { width: 95, height: 120, liquidLevel: 0, label: 'Beaker (CaO)' },
    },
    {
      id: 'boiling-tube',
      component: 'TestTube',
      label: 'Hard Glass Boiling Tube',
      icon: '🧪',
      initialProps: { width: 44, height: 160, liquidLevel: 0, label: 'Boiling Tube' },
    },
    {
      id: 'tube-displacement',
      component: 'TestTube',
      label: 'Test Tube (Displacement)',
      icon: '🧪',
      initialProps: { width: 40, height: 145, liquidLevel: 0, label: 'Tube (Fe+CuSO₄)' },
    },
    {
      id: 'tube-double-disp',
      component: 'TestTube',
      label: 'Test Tube (Double Displacement)',
      icon: '🧪',
      initialProps: { width: 40, height: 145, liquidLevel: 0, label: 'Tube (Precipitation)' },
    },
    {
      id: 'cao-bottle',
      component: 'ReagentBottle',
      label: 'Quicklime Lumps (CaO)',
      icon: '🪨',
      initialProps: { liquidColor: '#f1f5f9', label: 'CaO (Quicklime)' },
    },
    {
      id: 'water-bottle',
      component: 'ReagentBottle',
      label: 'Distilled Water',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.75)', label: 'Distilled H₂O' },
    },
    {
      id: 'feso4-crystals',
      component: 'ReagentBottle',
      label: 'Ferrous Sulphate (FeSO₄·7H₂O Crystals)',
      icon: '🟢',
      initialProps: { liquidColor: '#86efac', label: 'FeSO₄ Crystals (Green)' },
    },
    {
      id: 'cuso4-bottle',
      component: 'ReagentBottle',
      label: '5% Copper Sulphate Solution (CuSO₄)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(37, 99, 235, 0.85)', label: 'CuSO₄ Sol (Blue)' },
    },
    {
      id: 'iron-nail',
      component: 'IronNail',
      label: 'Clean Iron Nail (Fe)',
      icon: '📌',
      initialProps: { width: 28, height: 110, label: 'Clean Fe Nail' },
    },
    {
      id: 'na2so4-bottle',
      component: 'ReagentBottle',
      label: 'Sodium Sulphate Sol. (Na₂SO₄)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(241, 245, 249, 0.7)', label: 'Na₂SO₄ Sol' },
    },
    {
      id: 'bacl2-bottle',
      component: 'ReagentBottle',
      label: 'Barium Chloride Sol. (BaCl₂)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(241, 245, 249, 0.7)', label: 'BaCl₂ Sol' },
    },
    {
      id: 'bunsen-burner',
      component: 'BunsenBurner',
      label: 'Bunsen Burner Flame',
      icon: '🔥',
      initialProps: { width: 80, height: 125, isLit: true },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'beaker-zone',
      label: 'Place Beaker on Left Bench',
      accepts: ['beaker-cao', 'cao-bottle', 'water-bottle'],
      position: { x: 18, y: 64 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Place the reaction beaker on the left bench position.',
    },
    {
      id: 'burner-zone',
      label: 'Place Burner on Center Bench',
      accepts: ['bunsen-burner'],
      position: { x: 42, y: 64 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Place the Bunsen burner at the center heating station.',
    },
    {
      id: 'boiling-tube-zone',
      label: 'Hold Boiling Tube over Burner',
      accepts: ['boiling-tube', 'feso4-crystals'],
      position: { x: 42, y: 46 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Mount the boiling tube over the burner.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'bunsen-burner' },
    },
    {
      id: 'displacement-tube-zone',
      label: 'Place Displacement Tube in Stand',
      accepts: ['tube-displacement', 'cuso4-bottle', 'iron-nail'],
      position: { x: 68, y: 60 },
      size: { width: 14, height: 28 },
      rejectMessage: 'Place the displacement test tube in the stand.',
    },
    {
      id: 'doubledisp-tube-zone',
      label: 'Place Precipitation Tube in Stand',
      accepts: ['tube-double-disp', 'na2so4-bottle', 'bacl2-bottle'],
      position: { x: 86, y: 60 },
      size: { width: 14, height: 28 },
      rejectMessage: 'Place the precipitation test tube in the stand.',
    },
  ],

  bench: {
    backgroundElements: [
      {
        component: 'TestTubeStand',
        position: { x: 77, y: 68 },
        scale: 1.1,
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-apparatus',
      label: '1. Setup Workstation',
      instruction:
        'Place the Beaker on the left, the Bunsen burner in the center, and the two test tubes into the stand on the right.',
      requiredActions: ['place-beaker', 'place-burner', 'place-tube-disp', 'place-tube-doubledisp'],
      type: 'lab',
    },
    {
      id: 'reaction-combination',
      label: '2. Reaction 1: Combination (CaO + H₂O)',
      instruction:
        'Add quicklime (CaO) to the beaker, then pour water. Observe vigorous hissing, large heat release (exothermic), and formation of slaked lime Ca(OH)₂ suspension.',
      requiredActions: ['add-cao', 'add-water-cao'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'reaction-decomposition',
      label: '3. Reaction 2: Thermal Decomposition (FeSO₄)',
      instruction:
        'Mount the boiling tube over the burner, add green FeSO₄ crystals, and heat strongly. Observe water vapour leaving, color turning reddish-brown (Fe₂O₃), and pungent fumes of SO₂/SO₃ gas.',
      requiredActions: ['place-boiling-tube', 'add-feso4'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'reaction-displacement',
      label: '4. Reaction 3: Displacement (Fe + CuSO₄)',
      instruction:
        'Add blue CuSO₄ solution to the displacement tube, then drop in the clean iron nail. Observe solution turn pale green (FeSO₄) and reddish-brown copper deposit on the nail.',
      requiredActions: ['add-cuso4', 'add-iron-nail'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'reaction-doubledisplacement',
      label: '5. Reaction 4: Double Displacement (Na₂SO₄ + BaCl₂)',
      instruction:
        'Add Na₂SO₄ solution to the precipitation tube, then add BaCl₂ solution. Observe the instantaneous formation of an insoluble white precipitate of BaSO₄.',
      requiredActions: ['add-na2so4', 'add-bacl2'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '6. Classification & Observation Matrix',
      instruction:
        'Classify each carried out reaction as: 1 = Combination, 2 = Decomposition, 3 = Displacement, 4 = Double Displacement.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '7. Lab Evaluation & Score',
      instruction: 'Review your laboratory scores, observations, and viva voce quiz performance.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'act-place-beaker',
      trigger: { type: 'drop', source: 'beaker-cao', target: 'beaker-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'beaker-cao', zoneId: 'beaker-zone' },
        { type: 'setFlag', key: 'beakerPlaced', value: true },
      ],
      completesAction: 'place-beaker',
    },
    {
      id: 'act-place-burner',
      trigger: { type: 'drop', source: 'bunsen-burner', target: 'burner-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'bunsen-burner', zoneId: 'burner-zone' },
        { type: 'setFlag', key: 'burnerPlaced', value: true },
      ],
      completesAction: 'place-burner',
    },
    {
      id: 'act-place-tube-disp',
      trigger: { type: 'drop', source: 'tube-displacement', target: 'displacement-tube-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-displacement', zoneId: 'displacement-tube-zone' },
        { type: 'setFlag', key: 'tubeDispPlaced', value: true },
      ],
      completesAction: 'place-tube-disp',
    },
    {
      id: 'act-place-tube-doubledisp',
      trigger: { type: 'drop', source: 'tube-double-disp', target: 'doubledisp-tube-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-double-disp', zoneId: 'doubledisp-tube-zone' },
        { type: 'setFlag', key: 'tubeDoubleDispPlaced', value: true },
      ],
      completesAction: 'place-tube-doubledisp',
    },
    {
      id: 'act-place-boiling-tube',
      trigger: { type: 'drop', source: 'boiling-tube', target: 'boiling-tube-zone' },
      conditions: [{ type: 'apparatusPlaced', apparatusId: 'bunsen-burner' }],
      blockMessage: 'Place the Bunsen burner at the heating station first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'boiling-tube', zoneId: 'boiling-tube-zone' },
        { type: 'setFlag', key: 'boilingTubePlaced', value: true },
      ],
      completesAction: 'place-boiling-tube',
    },

    // 1. CaO + H2O
    {
      id: 'act-add-cao',
      trigger: { type: 'drop', source: 'cao-bottle', target: 'beaker-zone' },
      effects: [
        { type: 'setFlag', key: 'hasCaO', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-cao', prop: 'label', value: 'Quicklime (CaO) added' },
      ],
      completesAction: 'add-cao',
    },
    {
      id: 'act-add-water-cao',
      trigger: { type: 'drop', source: 'water-bottle', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'hasCaO', equals: true }],
      blockMessage: 'Add quicklime lumps (CaO) into the beaker first.',
      effects: [
        { type: 'setFlag', key: 'slakedLimeFormed', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-cao', prop: 'liquidLevel', value: 0.6 },
        { type: 'setApparatusProp', apparatusId: 'beaker-cao', prop: 'liquidColor', value: 'rgba(241, 245, 249, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-cao', prop: 'label', value: 'CaO + H₂O → Ca(OH)₂ (Slaked Lime + Heat!)' },
      ],
      completesAction: 'add-water-cao',
      animation: { type: 'bubble', durationMs: 3000, animatingFlag: 'isHissingCaO' },
    },

    // 2. FeSO4 heating
    {
      id: 'act-add-feso4',
      trigger: { type: 'drop', source: 'feso4-crystals', target: 'boiling-tube-zone' },
      effects: [
        { type: 'setFlag', key: 'feso4Decomposed', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'liquidColor', value: '#78350f' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'Fe₂O₃ (Red-Brown Residue) + SO₂/SO₃ Fumes' },
      ],
      completesAction: 'add-feso4',
      animation: { type: 'color-change', durationMs: 4000, animatingFlag: 'isHeatingFeSO4' },
    },

    // 3. Fe + CuSO4
    {
      id: 'act-add-cuso4',
      trigger: { type: 'drop', source: 'cuso4-bottle', target: 'displacement-tube-zone' },
      effects: [
        { type: 'setFlag', key: 'hasCuSO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'liquidColor', value: 'rgba(37, 99, 235, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'label', value: 'CuSO₄ Solution (Blue)' },
      ],
      completesAction: 'add-cuso4',
    },
    {
      id: 'act-add-iron-nail',
      trigger: { type: 'drop', source: 'iron-nail', target: 'displacement-tube-zone' },
      conditions: [{ type: 'flag', key: 'hasCuSO4', equals: true }],
      blockMessage: 'Add CuSO₄ solution into the test tube first.',
      effects: [
        { type: 'setFlag', key: 'ironDisplacedCu', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'liquidColor', value: 'rgba(134, 239, 172, 0.75)' },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'label', value: 'FeSO₄ (Pale Green) + Reddish Cu on Nail' },
      ],
      completesAction: 'add-iron-nail',
      animation: { type: 'color-change', durationMs: 3500, animatingFlag: 'isDisplacingCu' },
    },

    // 4. Na2SO4 + BaCl2
    {
      id: 'act-add-na2so4',
      trigger: { type: 'drop', source: 'na2so4-bottle', target: 'doubledisp-tube-zone' },
      effects: [
        { type: 'setFlag', key: 'hasNa2SO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-double-disp', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'tube-double-disp', prop: 'liquidColor', value: 'rgba(241, 245, 249, 0.65)' },
        { type: 'setApparatusProp', apparatusId: 'tube-double-disp', prop: 'label', value: 'Na₂SO₄ Solution (Clear)' },
      ],
      completesAction: 'add-na2so4',
    },
    {
      id: 'act-add-bacl2',
      trigger: { type: 'drop', source: 'bacl2-bottle', target: 'doubledisp-tube-zone' },
      conditions: [{ type: 'flag', key: 'hasNa2SO4', equals: true }],
      blockMessage: 'Add Na₂SO₄ solution into the precipitation tube first.',
      effects: [
        { type: 'setFlag', key: 'baSO4Precipitated', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-double-disp', prop: 'liquidLevel', value: 0.6 },
        { type: 'setApparatusProp', apparatusId: 'tube-double-disp', prop: 'liquidColor', value: 'rgba(255, 255, 255, 0.95)' },
        { type: 'setApparatusProp', apparatusId: 'tube-double-disp', prop: 'label', value: 'BaSO₄↓ (White Precipitate) in NaCl Sol.' },
      ],
      completesAction: 'add-bacl2',
      animation: { type: 'precipitate', durationMs: 2500, animatingFlag: 'isPrecipitatingBaSO4' },
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'CaO + H2O -> Ca(OH)2; 2FeSO4 -> Fe2O3 + SO2 + SO3; Fe + CuSO4 -> FeSO4 + Cu; Na2SO4 + BaCl2 -> BaSO4 + 2NaCl',
    reactionType: 'Combination, Decomposition, Displacement, Double Displacement',
    constants: {},
  },

  // ── Calculation / Observation Form ──
  calculation: {
    title: 'Reaction Classification Matrix',
    instruction:
      'Classify each carried out reaction by entering: 1 = Combination, 2 = Decomposition, 3 = Displacement, 4 = Double Displacement.',
    fields: [
      {
        id: 'class_cao',
        label: 'Reaction (a) CaO + H₂O → Ca(OH)₂ + Heat',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'class_feso4',
        label: 'Reaction (b) 2FeSO₄·7H₂O → Fe₂O₃ + SO₂ + SO₃ + 14H₂O (on heating)',
        unit: '',
        expectedValue: 2,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'class_fe_cuso4',
        label: 'Reaction (c) Fe + CuSO₄ → FeSO₄ + Cu',
        unit: '',
        expectedValue: 3,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'class_precipitate',
        label: 'Reaction (d) Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl',
        unit: '',
        expectedValue: 4,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Viva Voce ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'What fundamental type of chemical reaction is represented by CaO + H₂O → Ca(OH)₂?',
        options: ['Decomposition reaction', 'Combination reaction', 'Displacement reaction', 'Double displacement reaction'],
        correctIndex: 1,
        explanation: 'Two distinct reactants (quicklime CaO and water H₂O) combine together to form a single chemical compound (slaked lime Ca(OH)₂), releasing substantial thermal energy.',
      },
      {
        id: 'q2',
        question: 'What is the characteristic color of the solid ferric oxide (Fe₂O₃) residue left after heating ferrous sulphate crystals?',
        options: ['Pure snow white', 'Deep Prussian blue', 'Reddish-brown', 'Jet black'],
        correctIndex: 2,
        explanation: 'Thermal decomposition converts pale green FeSO₄·7H₂O into anhydrous FeSO₄, and upon further strong heating into reddish-brown ferric oxide (Fe₂O₃) with evolution of choking SO₂ and SO₃ gases.',
      },
      {
        id: 'q3',
        question: 'Why does the characteristic blue color of CuSO₄ solution fade when an iron nail is immersed in it?',
        options: [
          'Iron reacts chemically with water solvent',
          'Iron displaces Cu²⁺ ions to form Fe²⁺ ions, which impart a pale green color',
          'Copper metal evaporates into the surrounding air',
          'The solution becomes physically diluted',
        ],
        correctIndex: 1,
        explanation: 'Iron is situated above copper in the electrochemical reactivity series. It reduces Cu²⁺ to elemental copper (reddish coating) while forming soluble ferrous sulphate (FeSO₄, pale green).',
      },
      {
        id: 'q4',
        question: 'The instantaneous reaction between aqueous sodium sulphate and barium chloride is classified as:',
        options: [
          'Redox reaction only',
          'Double displacement (precipitation) reaction',
          'Thermal decomposition reaction',
          'Synthesis combination reaction',
        ],
        correctIndex: 1,
        explanation: 'Ba²⁺ and SO₄²⁻ ions exchange mutual counter-ions to precipitate insoluble barium sulphate (BaSO₄↓), leaving soluble NaCl in solution.',
      },
    ],
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Apparatus & Reagent Setup',
      maxPoints: 20,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Beaker positioned on left bench', points: 5, flag: 'beakerPlaced' },
          { label: 'Bunsen burner placed at heating station', points: 5, flag: 'burnerPlaced' },
          { label: 'Displacement test tube placed in stand', points: 5, flag: 'tubeDispPlaced' },
          { label: 'Precipitation test tube placed in stand', points: 5, flag: 'tubeDoubleDispPlaced' },
        ],
      },
    },
    {
      name: 'Performing All Four Reactions Safely',
      maxPoints: 40,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Slaking of quicklime (CaO + H₂O) observed', points: 10, flag: 'slakedLimeFormed' },
          { label: 'Thermal decomposition of FeSO₄ observed', points: 10, flag: 'feso4Decomposed' },
          { label: 'Displacement of copper by iron nail observed', points: 10, flag: 'ironDisplacedCu' },
          { label: 'Precipitation of BaSO₄ observed', points: 10, flag: 'baSO4Precipitated' },
        ],
      },
    },
    {
      name: 'Observation & Reaction Classification Accuracy',
      maxPoints: 25,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'CaO + H₂O classified as Combination (1)', points: 6, calcFieldId: 'class_cao', expectedValue: 1, tolerance: 0.1 },
          { label: 'FeSO₄ heating classified as Decomposition (2)', points: 6, calcFieldId: 'class_feso4', expectedValue: 2, tolerance: 0.1 },
          { label: 'Fe + CuSO₄ classified as Displacement (3)', points: 6, calcFieldId: 'class_fe_cuso4', expectedValue: 3, tolerance: 0.1 },
          { label: 'Na₂SO₄ + BaCl₂ classified as Double Displacement (4)', points: 7, calcFieldId: 'class_precipitate', expectedValue: 4, tolerance: 0.1 },
        ],
      },
    },
    {
      name: 'Viva Voce Examination',
      maxPoints: 15,
      evaluator: { type: 'vivaQuiz' },
    },
  ],

  // ── Validation Rules ──
  validation: [
    {
      id: 'water-before-cao',
      trigger: 'drop:water-bottle→beaker-zone',
      condition: { type: 'flag', key: 'hasCaO', equals: false },
      message: 'Place quicklime (CaO) into the beaker first before adding water.',
      blocking: true,
    },
  ],
};
