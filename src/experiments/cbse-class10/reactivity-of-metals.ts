/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Action of Metals on Salt Solutions & Reactivity
 *  CBSE Class 10 Science — Metals and Non-metals (Exp 10.4)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Observe the action of Zn, Fe, Cu, and Al on solutions of:
 *  - ZnSO₄ (Colourless)
 *  - FeSO₄ (Pale green)
 *  - CuSO₄ (Blue)
 *  - Al₂(SO₄)₃ (Colourless)
 *
 *  Establish the reactivity series: Al > Zn > Fe > Cu
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const reactivityOfMetals: ExperimentConfig = {
  id: 'reactivity-of-metals',
  title: 'Action of Metals on Salt Solutions and the Reactivity Series',
  subtitle: 'Zn, Fe, Cu and Al in ZnSO₄, FeSO₄, CuSO₄ and Al₂(SO₄)₃',
  description:
    'Test the displacement tendencies of Aluminium, Zinc, Iron, and Copper across four sulphate salt solutions. Observe metal deposition and solution decolorization to deduce the reactivity series.',
  class: 10,
  subject: 'Chemistry',
  chapter: 'Metals and Non-metals',
  difficulty: 'medium',
  themeColor: '#d97706',
  icon: '⛓️',
  estimatedMinutes: 30,
  underDevelopment: true,
  adminOnly: true,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'tube-znso4',
      component: 'TestTube',
      label: 'Tube 1: ZnSO₄ Solution',
      icon: '🧪',
      initialProps: { width: 38, height: 145, liquidLevel: 0.5, liquidColor: 'rgba(241, 245, 249, 0.7)', label: 'ZnSO₄' },
    },
    {
      id: 'tube-feso4',
      component: 'TestTube',
      label: 'Tube 2: FeSO₄ Solution (Pale Green)',
      icon: '🧪',
      initialProps: { width: 38, height: 145, liquidLevel: 0.5, liquidColor: 'rgba(187, 247, 208, 0.75)', label: 'FeSO₄' },
    },
    {
      id: 'tube-cuso4',
      component: 'TestTube',
      label: 'Tube 3: CuSO₄ Solution (Blue)',
      icon: '🧪',
      initialProps: { width: 38, height: 145, liquidLevel: 0.5, liquidColor: 'rgba(37, 99, 235, 0.85)', label: 'CuSO₄' },
    },
    {
      id: 'tube-also4',
      component: 'TestTube',
      label: 'Tube 4: Al₂(SO₄)₃ Solution',
      icon: '🧪',
      initialProps: { width: 38, height: 145, liquidLevel: 0.5, liquidColor: 'rgba(241, 245, 249, 0.7)', label: 'Al₂(SO₄)₃' },
    },
    {
      id: 'metal-cu',
      component: 'Matchstick',
      label: 'Clean Copper Strip (Cu)',
      icon: '🟤',
      initialProps: { label: 'Cu Strip' },
    },
    {
      id: 'metal-fe',
      component: 'IronNail',
      label: 'Clean Iron Nail (Fe)',
      icon: '📌',
      initialProps: { width: 28, height: 110, label: 'Fe Nail' },
    },
    {
      id: 'metal-zn',
      component: 'ReagentBottle',
      label: 'Clean Zinc Strip (Zn)',
      icon: '🔘',
      initialProps: { liquidColor: '#94a3b8', label: 'Zn Strip' },
    },
    {
      id: 'metal-al',
      component: 'ReagentBottle',
      label: 'Clean Aluminium Strip (Al)',
      icon: '⚪',
      initialProps: { liquidColor: '#cbd5e1', label: 'Al Strip' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'rack-slot-1',
      label: 'Rack Slot 1 (ZnSO₄)',
      accepts: ['tube-znso4', 'metal-al', 'metal-cu', 'metal-fe'],
      position: { x: 22, y: 60 },
      size: { width: 14, height: 28 },
      rejectMessage: 'Place Tube 1 (ZnSO₄) in Slot 1.',
    },
    {
      id: 'rack-slot-2',
      label: 'Rack Slot 2 (FeSO₄)',
      accepts: ['tube-feso4', 'metal-al', 'metal-zn', 'metal-cu'],
      position: { x: 40, y: 60 },
      size: { width: 14, height: 28 },
      rejectMessage: 'Place Tube 2 (FeSO₄) in Slot 2.',
    },
    {
      id: 'rack-slot-3',
      label: 'Rack Slot 3 (CuSO₄)',
      accepts: ['tube-cuso4', 'metal-al', 'metal-zn', 'metal-fe'],
      position: { x: 58, y: 60 },
      size: { width: 14, height: 28 },
      rejectMessage: 'Place Tube 3 (CuSO₄) in Slot 3.',
    },
    {
      id: 'rack-slot-4',
      label: 'Rack Slot 4 (Al₂(SO₄)₃)',
      accepts: ['tube-also4', 'metal-zn', 'metal-fe', 'metal-cu'],
      position: { x: 76, y: 60 },
      size: { width: 14, height: 28 },
      rejectMessage: 'Place Tube 4 (Al₂(SO₄)₃) in Slot 4.',
    },
  ],

  bench: {
    backgroundElements: [
      {
        component: 'TestTubeStand',
        position: { x: 49, y: 68 },
        scale: 1.35,
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-stand',
      label: '1. Arrange Salt Solutions in Rack',
      instruction:
        'Place the four salt solution test tubes in the rack: Tube 1 (ZnSO₄), Tube 2 (FeSO₄), Tube 3 (CuSO₄), and Tube 4 (Al₂(SO₄)₃).',
      requiredActions: ['place-znso4', 'place-feso4', 'place-cuso4', 'place-also4'],
      type: 'lab',
    },
    {
      id: 'test-copper-iron',
      label: '2. Test Copper & Iron Displacements',
      instruction:
        'Add Copper (Cu) to ZnSO₄: observe no reaction. Add Iron (Fe) to blue CuSO₄: observe iron displaces copper forming pale green FeSO₄ and reddish copper deposit.',
      requiredActions: ['test-cu-in-znso4', 'test-fe-in-cuso4'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-zinc-aluminium',
      label: '3. Test Zinc & Aluminium Displacements',
      instruction:
        'Add Zinc (Zn) to FeSO₄: observe displacement of iron. Add Aluminium (Al) to ZnSO₄: observe Al vigorously displaces zinc metal. Al displaces all three other metals.',
      requiredActions: ['test-zn-in-feso4', 'test-al-in-znso4'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '4. Reactivity Matrix & Order Ranking',
      instruction:
        'Complete the displacement table (1 = Reaction / Displacement occurs, 0 = No reaction) and deduce the decreasing order of reactivity.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '5. Lab Evaluation & Score',
      instruction: 'Review your laboratory scores, observations, and viva voce quiz performance.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'act-place-znso4',
      trigger: { type: 'drop', source: 'tube-znso4', target: 'rack-slot-1' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-znso4', zoneId: 'rack-slot-1' },
        { type: 'setFlag', key: 'znso4Placed', value: true },
      ],
      completesAction: 'place-znso4',
    },
    {
      id: 'act-place-feso4',
      trigger: { type: 'drop', source: 'tube-feso4', target: 'rack-slot-2' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-feso4', zoneId: 'rack-slot-2' },
        { type: 'setFlag', key: 'feso4Placed', value: true },
      ],
      completesAction: 'place-feso4',
    },
    {
      id: 'act-place-cuso4',
      trigger: { type: 'drop', source: 'tube-cuso4', target: 'rack-slot-3' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-cuso4', zoneId: 'rack-slot-3' },
        { type: 'setFlag', key: 'cuso4Placed', value: true },
      ],
      completesAction: 'place-cuso4',
    },
    {
      id: 'act-place-also4',
      trigger: { type: 'drop', source: 'tube-also4', target: 'rack-slot-4' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-also4', zoneId: 'rack-slot-4' },
        { type: 'setFlag', key: 'also4Placed', value: true },
      ],
      completesAction: 'place-also4',
    },

    // Testing Cu in ZnSO4
    {
      id: 'act-cu-in-znso4',
      trigger: { type: 'drop', source: 'metal-cu', target: 'rack-slot-1' },
      effects: [
        { type: 'setFlag', key: 'cuTestedInZnSO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-znso4', prop: 'label', value: 'Cu in ZnSO₄: No Reaction (Cu is least reactive)' },
      ],
      completesAction: 'test-cu-in-znso4',
      animation: { type: 'color-change', durationMs: 1500, animatingFlag: 'isTestingCuZn' },
    },

    // Testing Fe in CuSO4
    {
      id: 'act-fe-in-cuso4',
      trigger: { type: 'drop', source: 'metal-fe', target: 'rack-slot-3' },
      effects: [
        { type: 'setFlag', key: 'feTestedInCuSO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-cuso4', prop: 'liquidColor', value: 'rgba(187, 247, 208, 0.8)' },
        { type: 'setApparatusProp', apparatusId: 'tube-cuso4', prop: 'label', value: 'Fe + CuSO₄ → FeSO₄ (Pale Green) + Red Cu deposit' },
      ],
      completesAction: 'test-fe-in-cuso4',
      animation: { type: 'color-change', durationMs: 3000, animatingFlag: 'isFeDisplacingCu' },
    },

    // Testing Zn in FeSO4
    {
      id: 'act-zn-in-feso4',
      trigger: { type: 'drop', source: 'metal-zn', target: 'rack-slot-2' },
      effects: [
        { type: 'setFlag', key: 'znTestedInFeSO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-feso4', prop: 'liquidColor', value: 'rgba(241, 245, 249, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'tube-feso4', prop: 'label', value: 'Zn + FeSO₄ → ZnSO₄ (Colorless) + Grey Fe deposit' },
      ],
      completesAction: 'test-zn-in-feso4',
      animation: { type: 'color-change', durationMs: 3000, animatingFlag: 'isZnDisplacingFe' },
    },

    // Testing Al in ZnSO4
    {
      id: 'act-al-in-znso4',
      trigger: { type: 'drop', source: 'metal-al', target: 'rack-slot-1' },
      effects: [
        { type: 'setFlag', key: 'alTestedInZnSO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-znso4', prop: 'label', value: '2Al + 3ZnSO₄ → Al₂(SO₄)₃ + 3Zn (Active displacement!)' },
      ],
      completesAction: 'test-al-in-znso4',
      animation: { type: 'color-change', durationMs: 3000, animatingFlag: 'isAlDisplacingZn' },
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: '2Al + 3ZnSO4 -> Al2(SO4)3 + 3Zn; Zn + FeSO4 -> ZnSO4 + Fe; Fe + CuSO4 -> FeSO4 + Cu',
    reactionType: 'Metal Single Displacement & Electrochemical Reactivity Series',
    constants: {},
  },

  // ── Calculation / Observation Form ──
  calculation: {
    title: 'Displacement Matrix & Reactivity Ranking',
    instruction:
      'Indicate whether displacement occurs (1 = Reaction / Displacement, 0 = No reaction), and identify the most and least reactive metals.',
    fields: [
      {
        id: 'disp_zn_cuso4',
        label: 'Zn + CuSO₄: (1=Reaction, 0=No Reaction)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'disp_fe_cuso4',
        label: 'Fe + CuSO₄: (1=Reaction, 0=No Reaction)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'disp_cu_feso4',
        label: 'Cu + FeSO₄: (1=Reaction, 0=No Reaction)',
        unit: '',
        expectedValue: 0,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'disp_fe_znso4',
        label: 'Fe + ZnSO₄: (1=Reaction, 0=No Reaction)',
        unit: '',
        expectedValue: 0,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'disp_al_znso4',
        label: 'Al + ZnSO₄: (1=Reaction, 0=No Reaction)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'most_reactive_metal',
        label: 'Most Reactive Metal (1=Al, 2=Zn, 3=Fe, 4=Cu)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
        helperText: 'Al displaces Zn, Fe, and Cu',
      },
      {
        id: 'least_reactive_metal',
        label: 'Least Reactive Metal (1=Al, 2=Zn, 3=Fe, 4=Cu)',
        unit: '',
        expectedValue: 4,
        tolerance: 0.1,
        toleranceType: 'absolute',
        helperText: 'Cu displaces none of the other three metals',
      },
    ],
  },

  // ── Viva Voce ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'Which of the tested metals is the MOST reactive based on your observations?',
        options: ['Copper (Cu)', 'Iron (Fe)', 'Zinc (Zn)', 'Aluminium (Al)'],
        correctIndex: 3,
        explanation: 'Aluminium displaces Zinc, Iron, and Copper from their respective sulphate salt solutions because it has the highest oxidation potential among the four.',
      },
      {
        id: 'q2',
        question: 'Which metal does not displace ANY other metal from its salt solution in this experiment?',
        options: ['Copper', 'Zinc', 'Iron', 'Aluminium'],
        correctIndex: 0,
        explanation: 'Copper lies lowest in the reactivity series among the four, hence it cannot displace Zn²⁺, Fe²⁺, or Al³⁺.',
      },
      {
        id: 'q3',
        question: 'Why should metal strips (especially aluminium) be cleaned thoroughly with sandpaper before the experiment?',
        options: [
          'To make them look shinier only',
          'To remove the inert surface oxide layer that impedes direct contact with the solution',
          'To reduce their physical mass',
          'To induce magnetic attraction',
        ],
        correctIndex: 1,
        explanation: 'Metals like aluminium rapidly form a protective, inert oxide film (Al₂O₃) in air which blocks contact with salt solutions until abraded off.',
      },
      {
        id: 'q4',
        question: 'What colored precipitate / coating is formed on the zinc strip when it is immersed in CuSO₄ solution?',
        options: ['Silvery white aluminium', 'Reddish-brown copper', 'Pale green ferrous sulphate', 'Dark black carbon'],
        correctIndex: 1,
        explanation: 'Zn + CuSO₄ → ZnSO₄ + Cu. Displaced copper metal deposits as a reddish-brown coating on the surface of the zinc strip.',
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
          { label: 'ZnSO₄ tube placed in rack', points: 5, flag: 'znso4Placed' },
          { label: 'FeSO₄ tube placed in rack', points: 5, flag: 'feso4Placed' },
          { label: 'CuSO₄ tube placed in rack', points: 5, flag: 'cuso4Placed' },
          { label: 'Al₂(SO₄)₃ tube placed in rack', points: 5, flag: 'also4Placed' },
        ],
      },
    },
    {
      name: 'Testing Displacements & Timed Observations',
      maxPoints: 40,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Cu tested in ZnSO₄ (no reaction observed)', points: 10, flag: 'cuTestedInZnSO4' },
          { label: 'Fe tested in CuSO₄ (copper displaced)', points: 10, flag: 'feTestedInCuSO4' },
          { label: 'Zn tested in FeSO₄ (iron displaced)', points: 10, flag: 'znTestedInFeSO4' },
          { label: 'Al tested in ZnSO₄ (zinc displaced)', points: 10, flag: 'alTestedInZnSO4' },
        ],
      },
    },
    {
      name: 'Reactivity Table & Ranking Accuracy',
      maxPoints: 25,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Fe + CuSO₄ reaction identified', points: 6, calcFieldId: 'disp_fe_cuso4', expectedValue: 1, tolerance: 0.1 },
          { label: 'Cu + FeSO₄ non-reaction identified', points: 6, calcFieldId: 'disp_cu_feso4', expectedValue: 0, tolerance: 0.1 },
          { label: 'Most reactive metal identified as Al', points: 7, calcFieldId: 'most_reactive_metal', expectedValue: 1, tolerance: 0.1 },
          { label: 'Least reactive metal identified as Cu', points: 6, calcFieldId: 'least_reactive_metal', expectedValue: 4, tolerance: 0.1 },
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
  validation: [],
};
