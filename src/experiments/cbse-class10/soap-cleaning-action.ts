/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Comparative Cleaning Capacity of Soap
 *  CBSE Class 10 Science — Carbon and its Compounds (Exp 10.6)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Compare lather formation and scum in distilled (soft) vs hard water:
 *  - Soft Water: Lathers easily with 3–5 drops of soap; no scum.
 *  - Hard Water: Reacts with Ca²⁺/Mg²⁺ to precipitate white curdy scum:
 *    2C₁₇H₃₅COONa + Ca²⁺ → (C₁₇H₃₅COO)₂Ca↓ + 2Na⁺
 *    Requires 15–25 drops before stable lather is achieved.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const soapCleaningAction: ExperimentConfig = {
  id: 'soap-cleaning-action',
  title: 'Cleaning Action of Soap in Soft and Hard Water',
  subtitle: 'Lather Formation and Scum in Distilled vs Hard Water',
  description:
    'Compare the cleaning efficiency and lathering ability of soap in soft (distilled) water versus hard water containing calcium ions. Quantify lather stability and observe curdy scum formation.',
  class: 10,
  subject: 'Chemistry',
  chapter: 'Carbon and its Compounds',
  difficulty: 'easy',
  themeColor: '#06b6d4',
  icon: '🧼',
  estimatedMinutes: 25,
  underDevelopment: true,
  adminOnly: true,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'tube-soft',
      component: 'TestTube',
      label: 'Tube A: Soft Water (10 mL)',
      icon: '🧪',
      initialProps: { width: 44, height: 160, liquidLevel: 0.45, liquidColor: 'rgba(224, 242, 254, 0.7)', label: 'Tube A (Soft H₂O)' },
    },
    {
      id: 'tube-hard',
      component: 'TestTube',
      label: 'Tube B: Hard Water (10 mL CaCl₂)',
      icon: '🧪',
      initialProps: { width: 44, height: 160, liquidLevel: 0.45, liquidColor: 'rgba(241, 245, 249, 0.75)', label: 'Tube B (Hard H₂O)' },
    },
    {
      id: 'soap-dropper',
      component: 'Dropper',
      label: '1% Soap Solution (Dropper)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.65)', label: 'Soap Sol.' },
    },
    {
      id: 'rubber-cork',
      component: 'RubberCork',
      label: 'Rubber Stopper (for Vigorous Shaking)',
      icon: '🔘',
      initialProps: { width: 40, height: 35 },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stand-slot-soft',
      label: 'Tube A Stand Position (Soft)',
      accepts: ['tube-soft', 'soap-dropper', 'rubber-cork'],
      position: { x: 34, y: 60 },
      size: { width: 16, height: 32 },
      rejectMessage: 'Place Tube A on the left stand position.',
    },
    {
      id: 'stand-slot-hard',
      label: 'Tube B Stand Position (Hard)',
      accepts: ['tube-hard', 'soap-dropper', 'rubber-cork'],
      position: { x: 62, y: 60 },
      size: { width: 16, height: 32 },
      rejectMessage: 'Place Tube B on the right stand position.',
    },
  ],

  bench: {
    backgroundElements: [
      {
        component: 'TestTubeStand',
        position: { x: 48, y: 68 },
        scale: 1.3,
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-tubes',
      label: '1. Setup Test Tubes in Stand',
      instruction: 'Place Tube A (10 mL Distilled Soft Water) and Tube B (10 mL Hard Water) into the test tube stand.',
      requiredActions: ['place-tube-soft', 'place-tube-hard'],
      type: 'lab',
    },
    {
      id: 'test-soft-water',
      label: '2. Soap in Soft Water (Tube A)',
      instruction:
        'Add 4 drops of soap solution to Tube A, stopper with rubber cork, and shake for 1 minute. Observe abundant, thick lather (foam) forming easily without any scum.',
      requiredActions: ['add-soap-soft', 'shake-tube-soft'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-hard-water',
      label: '3. Soap in Hard Water (Tube B)',
      instruction:
        'Add soap solution to Tube B and shake. Notice a white curdy precipitate (scum) forms with little lather. Continue adding soap dropwise until a stable lather forms for 30 seconds (about 20 drops total).',
      requiredActions: ['add-soap-hard', 'titrate-soap-hard'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '4. Drop Count Comparison & Calculations',
      instruction:
        'Record the drops of soap needed for stable lather in soft vs hard water and calculate extra soap wasted.',
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
      id: 'act-place-tube-soft',
      trigger: { type: 'drop', source: 'tube-soft', target: 'stand-slot-soft' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-soft', zoneId: 'stand-slot-soft' },
        { type: 'setFlag', key: 'tubeSoftPlaced', value: true },
      ],
      completesAction: 'place-tube-soft',
    },
    {
      id: 'act-place-tube-hard',
      trigger: { type: 'drop', source: 'tube-hard', target: 'stand-slot-hard' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-hard', zoneId: 'stand-slot-hard' },
        { type: 'setFlag', key: 'tubeHardPlaced', value: true },
      ],
      completesAction: 'place-tube-hard',
    },

    // Soft water testing
    {
      id: 'act-add-soap-soft',
      trigger: { type: 'drop', source: 'soap-dropper', target: 'stand-slot-soft' },
      effects: [
        { type: 'setFlag', key: 'soapAddedSoft', value: true },
        { type: 'setVariable', key: 'dropsSoft', value: 4 },
        { type: 'setApparatusProp', apparatusId: 'tube-soft', prop: 'label', value: '4 drops soap added' },
      ],
      completesAction: 'add-soap-soft',
      animation: { type: 'dispense', durationMs: 1500, animatingFlag: 'isDispensingSoft' },
    },
    {
      id: 'act-shake-soft',
      trigger: { type: 'drop', source: 'rubber-cork', target: 'stand-slot-soft' },
      conditions: [{ type: 'flag', key: 'soapAddedSoft', equals: true }],
      blockMessage: 'Add soap solution into Tube A first before shaking.',
      effects: [
        { type: 'setFlag', key: 'shakenSoft', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-soft', prop: 'liquidLevel', value: 0.8 },
        { type: 'setApparatusProp', apparatusId: 'tube-soft', prop: 'liquidColor', value: 'rgba(240, 249, 255, 0.95)' },
        { type: 'setApparatusProp', apparatusId: 'tube-soft', prop: 'label', value: '🫧 Thick, Stable Foam Formed! (No Scum)' },
      ],
      completesAction: 'shake-tube-soft',
      animation: { type: 'stir', durationMs: 3000, animatingFlag: 'isShakingSoft' },
    },

    // Hard water testing
    {
      id: 'act-add-soap-hard',
      trigger: { type: 'drop', source: 'soap-dropper', target: 'stand-slot-hard' },
      effects: [
        { type: 'setFlag', key: 'scumObserved', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-hard', prop: 'liquidColor', value: 'rgba(255, 255, 255, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'tube-hard', prop: 'label', value: 'Curdy Scum Precipitants Formed (No Lather)' },
      ],
      completesAction: 'add-soap-hard',
      animation: { type: 'precipitate', durationMs: 2000, animatingFlag: 'isPrecipitatingScum' },
    },
    {
      id: 'act-shake-hard',
      trigger: { type: 'drop', source: 'rubber-cork', target: 'stand-slot-hard' },
      conditions: [{ type: 'flag', key: 'scumObserved', equals: true }],
      blockMessage: 'Add soap solution into Tube B first.',
      effects: [
        { type: 'setFlag', key: 'stableLatherHard', value: true },
        { type: 'setVariable', key: 'dropsHard', value: 20 },
        { type: 'setApparatusProp', apparatusId: 'tube-hard', prop: 'liquidLevel', value: 0.75 },
        { type: 'setApparatusProp', apparatusId: 'tube-hard', prop: 'label', value: '20 drops added: Persistent Lather achieved!' },
      ],
      completesAction: 'titrate-soap-hard',
      animation: { type: 'stir', durationMs: 3500, animatingFlag: 'isShakingHard' },
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: '2C17H35COONa + Ca(2+) -> (C17H35COO)2Ca (scum) + 2Na(+)',
    reactionType: 'Precipitation of Insoluble Calcium Stearate Scum',
    constants: {
      dropsSoft: 4,
      dropsHard: 20,
    },
  },

  // ── Calculation / Observation Form ──
  calculation: {
    title: 'Soap Consumption and Lather Formation Analysis',
    instruction:
      'Enter the recorded soap drops required to produce a stable 30-second lather, and compute the wasted soap.',
    fields: [
      {
        id: 'drops_soft',
        label: 'Drops of soap solution needed in Soft Water (Tube A)',
        unit: 'drops',
        expectedValue: 4,
        tolerance: 2,
        toleranceType: 'absolute',
        helperText: 'Soft water forms lather readily (3 to 5 drops)',
      },
      {
        id: 'drops_hard',
        label: 'Drops of soap solution needed in Hard Water (Tube B)',
        unit: 'drops',
        expectedValue: 20,
        tolerance: 5,
        toleranceType: 'absolute',
        helperText: 'Hard water precipitates scum first (15 to 25 drops)',
      },
      {
        id: 'soap_wasted',
        label: 'Extra soap wasted (drops in Hard Water − drops in Soft Water)',
        unit: 'drops',
        expectedValue: 16,
        tolerance: 5,
        toleranceType: 'absolute',
        helperText: 'Formula: drops(Hard) − drops(Soft)',
      },
      {
        id: 'scum_formed',
        label: 'Did curdy scum form in Hard Water? (1 = Yes, 2 = No)',
        unit: '',
        expectedValue: 1,
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
        question: 'Why does soap fail to lather readily in hard water?',
        options: [
          'Hard water is chemically acidic',
          'Ca²⁺ and Mg²⁺ ions react with soap to form an insoluble curdy precipitate (scum)',
          'Soap dissolves too rapidly in hard water',
          'Hard water is too warm',
        ],
        correctIndex: 1,
        explanation: 'Soap consists of sodium or potassium salts of long-chain fatty acids (e.g. sodium stearate). When added to hard water, Ca²⁺/Mg²⁺ ions precipitate insoluble calcium/magnesium stearate (scum), exhausting soap until all hardness ions are precipitated.',
      },
      {
        id: 'q2',
        question: 'Which ions are predominantly responsible for the hardness of water?',
        options: [
          'Na⁺ and K⁺',
          'Ca²⁺ and Mg²⁺',
          'Cl⁻ and NO₃⁻',
          'H⁺ and OH⁻',
        ],
        correctIndex: 1,
        explanation: 'Dissolved hydrogencarbonates, chlorides, and sulphates of calcium (Ca²⁺) and magnesium (Mg²⁺) cause hardness in water.',
      },
      {
        id: 'q3',
        question: 'What is the chemical nature of "scum" produced when soap is added to hard water?',
        options: [
          'A light foam of trapped air bubbles',
          'An insoluble precipitate of calcium or magnesium salts of fatty acids',
          'Suspended dirt washed from garments',
          'Recrystallized pure sodium soap crystals',
        ],
        correctIndex: 1,
        explanation: 'Scum is insoluble (C₁₇H₃₅COO)₂Ca or (C₁₇H₃₅COO)₂Mg that floats on water as a curdy, sticky white residue.',
      },
      {
        id: 'q4',
        question: 'What primary advantage do synthetic detergents possess over traditional soaps when used in hard water?',
        options: [
          'They form larger amounts of scum',
          'Their calcium and magnesium salts are water-soluble, so they lather even in hard water',
          'They are strongly acidic in nature',
          'They are cheaper to purchase only',
        ],
        correctIndex: 1,
        explanation: 'Synthetic detergents are typically sodium salts of alkyl sulphates or alkyl benzene sulphonates. Their calcium and magnesium salts are soluble in water, so they clean effectively without forming scum.',
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
          { label: 'Tube A (Soft water) placed in stand', points: 10, flag: 'tubeSoftPlaced' },
          { label: 'Tube B (Hard water) placed in stand', points: 10, flag: 'tubeHardPlaced' },
        ],
      },
    },
    {
      name: 'Correct Shaking, Dropwise Addition and Timing',
      maxPoints: 40,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Soap added to Tube A (soft water)', points: 10, flag: 'soapAddedSoft' },
          { label: 'Tube A shaken & thick lather observed', points: 10, flag: 'shakenSoft' },
          { label: 'Soap added to Tube B & curdy scum observed', points: 10, flag: 'scumObserved' },
          { label: 'Tube B titrated until stable lather achieved', points: 10, flag: 'stableLatherHard' },
        ],
      },
    },
    {
      name: 'Drop Counts, Comparison and Conclusion Accuracy',
      maxPoints: 25,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Soft water drops within expected range (3–5)', points: 8, calcFieldId: 'drops_soft', expectedValue: 4, tolerance: 2 },
          { label: 'Hard water drops significantly higher (15–25)', points: 9, calcFieldId: 'drops_hard', expectedValue: 20, tolerance: 5 },
          { label: 'Curdy scum formation verified (Yes)', points: 8, calcFieldId: 'scum_formed', expectedValue: 1, tolerance: 0.1 },
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
