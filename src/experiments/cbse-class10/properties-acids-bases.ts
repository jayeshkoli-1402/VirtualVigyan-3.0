/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Properties of Acids and Bases (HCl and NaOH)
 *  CBSE Class 10 Science — Acids, Bases and Salts (Exp 10.2)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Compare dilute HCl and dilute NaOH by their action on:
 *  1. Litmus (Blue & Red)
 *  2. Zinc metal (H₂ evolution: Pop sound with burning splinter)
 *  3. Solid sodium carbonate (CO₂ evolution with HCl: Lime water milky; No reaction with NaOH)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const propertiesAcidsBases: ExperimentConfig = {
  id: 'properties-acids-bases',
  title: 'Properties of Acids and Bases (HCl and NaOH)',
  subtitle: 'Reaction with Litmus, Zinc Metal and Sodium Carbonate',
  description:
    'Compare dilute HCl and dilute NaOH by observing their action on litmus indicators, zinc metal (hydrogen pop test), and solid sodium carbonate (carbon dioxide lime water test).',
  class: 10,
  subject: 'Chemistry',
  chapter: 'Acids, Bases and Salts',
  difficulty: 'easy',
  themeColor: '#ea580c',
  icon: '⚗️',
  estimatedMinutes: 25,
  underDevelopment: true,
  adminOnly: true,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'tube-hcl',
      component: 'TestTube',
      label: 'Tube A: Dilute HCl (3 mL)',
      icon: '🧪',
      initialProps: { width: 42, height: 150, liquidLevel: 0.4, liquidColor: 'rgba(238, 242, 255, 0.7)', label: 'Tube A (HCl)' },
    },
    {
      id: 'tube-naoh',
      component: 'TestTube',
      label: 'Tube B: Dilute NaOH (3 mL)',
      icon: '🧪',
      initialProps: { width: 42, height: 150, liquidLevel: 0.4, liquidColor: 'rgba(245, 243, 255, 0.75)', label: 'Tube B (NaOH)' },
    },
    {
      id: 'tube-limewater',
      component: 'TestTube',
      label: 'Fresh Lime Water Tube',
      icon: '🥛',
      initialProps: { width: 38, height: 140, liquidLevel: 0.5, liquidColor: 'rgba(241, 245, 249, 0.8)', label: 'Lime Water' },
    },
    {
      id: 'blue-litmus',
      component: 'ReagentBottle',
      label: 'Blue Litmus Solution',
      icon: '💧',
      initialProps: { liquidColor: '#2563eb', label: 'Blue Litmus' },
    },
    {
      id: 'red-litmus',
      component: 'ReagentBottle',
      label: 'Red Litmus Solution',
      icon: '💧',
      initialProps: { liquidColor: '#dc2626', label: 'Red Litmus' },
    },
    {
      id: 'zinc-granules',
      component: 'ReagentBottle',
      label: 'Zinc Granules',
      icon: '🪨',
      initialProps: { liquidColor: '#64748b', label: 'Zn Granules' },
    },
    {
      id: 'na2co3-powder',
      component: 'ReagentBottle',
      label: 'Solid Sodium Carbonate (Na₂CO₃)',
      icon: '🧂',
      initialProps: { liquidColor: '#f8fafc', label: 'Na₂CO₃ Powder' },
    },
    {
      id: 'burning-splinter',
      component: 'Matchstick',
      label: 'Burning Splinter',
      icon: '🔥',
      initialProps: { isLit: true, label: 'Burning Splinter' },
    },
    {
      id: 'bunsen-burner',
      component: 'BunsenBurner',
      label: 'Bunsen Burner (Gentle Warming)',
      icon: '🔥',
      initialProps: { width: 80, height: 125, isLit: true },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stand-hcl-zone',
      label: 'Tube A Stand Position (HCl)',
      accepts: ['tube-hcl'],
      position: { x: 26, y: 60 },
      size: { width: 14, height: 30 },
      rejectMessage: 'Place Tube A on the left stand position.',
    },
    {
      id: 'stand-naoh-zone',
      label: 'Tube B Stand Position (NaOH)',
      accepts: ['tube-naoh'],
      position: { x: 50, y: 60 },
      size: { width: 14, height: 30 },
      rejectMessage: 'Place Tube B on the middle stand position.',
    },
    {
      id: 'stand-limewater-zone',
      label: 'Lime Water Tube Position',
      accepts: ['tube-limewater'],
      position: { x: 74, y: 60 },
      size: { width: 14, height: 30 },
      rejectMessage: 'Place the Lime Water tube on the right stand position.',
    },
    {
      id: 'tube-hcl-mouth',
      label: 'Into Tube A (HCl)',
      accepts: ['blue-litmus', 'red-litmus', 'zinc-granules', 'na2co3-powder', 'burning-splinter'],
      position: { x: 26, y: 46 },
      size: { width: 14, height: 18 },
      rejectMessage: 'Drop reagent or testing tool into Tube A (HCl).',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'tube-hcl' },
    },
    {
      id: 'tube-naoh-mouth',
      label: 'Into Tube B (NaOH)',
      accepts: ['blue-litmus', 'red-litmus', 'zinc-granules', 'na2co3-powder', 'burning-splinter', 'bunsen-burner'],
      position: { x: 50, y: 46 },
      size: { width: 14, height: 18 },
      rejectMessage: 'Drop reagent or testing tool into Tube B (NaOH).',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'tube-naoh' },
    },
  ],

  bench: {
    backgroundElements: [
      {
        component: 'TestTubeStand',
        position: { x: 50, y: 68 },
        scale: 1.3,
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-tubes',
      label: '1. Setup Test Tubes in Stand',
      instruction: 'Place Tube A (dilute HCl), Tube B (dilute NaOH), and the Lime Water tube in the test tube stand.',
      requiredActions: ['place-hcl', 'place-naoh', 'place-limewater'],
      type: 'lab',
    },
    {
      id: 'test-litmus',
      label: '2. Litmus Indicator Action',
      instruction:
        'Test Tube A (HCl) with Blue Litmus: observe turning Red. Test Tube B (NaOH) with Red Litmus: observe turning Blue.',
      requiredActions: ['test-litmus-hcl', 'test-litmus-naoh'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-zinc',
      label: '3. Reaction with Zinc Metal & Pop Sound Test',
      instruction:
        'Add Zinc granules to Tube A (HCl): observe brisk H₂ bubbles. Bring the burning splinter to the mouth: listen for the squeaky "pop" sound! Then add Zinc to Tube B (NaOH) and warm gently to observe H₂ evolution.',
      requiredActions: ['zinc-added-hcl', 'splinter-tested-hcl', 'zinc-added-naoh'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-carbonate',
      label: '4. Action on Solid Sodium Carbonate',
      instruction:
        'Add solid Na₂CO₃ to Tube A (HCl): observe brisk effervescence of CO₂ gas turning lime water milky! Then add solid Na₂CO₃ to Tube B (NaOH): observe no reaction.',
      requiredActions: ['na2co3-added-hcl', 'na2co3-added-naoh'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '5. Observation Table & Conclusions',
      instruction:
        'Record the observed outcomes for Litmus, Zinc metal, and Sodium Carbonate for both acids and bases.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '6. Lab Evaluation & Score',
      instruction: 'Review your laboratory scores, reactions, and viva voce quiz performance.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'act-place-hcl',
      trigger: { type: 'drop', source: 'tube-hcl', target: 'stand-hcl-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-hcl', zoneId: 'stand-hcl-zone' },
        { type: 'setFlag', key: 'hclPlaced', value: true },
      ],
      completesAction: 'place-hcl',
    },
    {
      id: 'act-place-naoh',
      trigger: { type: 'drop', source: 'tube-naoh', target: 'stand-naoh-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-naoh', zoneId: 'stand-naoh-zone' },
        { type: 'setFlag', key: 'naohPlaced', value: true },
      ],
      completesAction: 'place-naoh',
    },
    {
      id: 'act-place-limewater',
      trigger: { type: 'drop', source: 'tube-limewater', target: 'stand-limewater-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-limewater', zoneId: 'stand-limewater-zone' },
        { type: 'setFlag', key: 'limewaterPlaced', value: true },
      ],
      completesAction: 'place-limewater',
    },
    // Litmus Tests
    {
      id: 'act-test-litmus-hcl',
      trigger: { type: 'drop', source: 'blue-litmus', target: 'tube-hcl-mouth' },
      effects: [
        { type: 'setFlag', key: 'litmusTestedHCl', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-hcl', prop: 'liquidColor', value: 'rgba(239, 68, 68, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'tube-hcl', prop: 'label', value: 'HCl: Blue Litmus turned RED' },
      ],
      completesAction: 'test-litmus-hcl',
      animation: { type: 'color-change', durationMs: 2000, animatingFlag: 'isLitmusHCl' },
    },
    {
      id: 'act-test-litmus-naoh',
      trigger: { type: 'drop', source: 'red-litmus', target: 'tube-naoh-mouth' },
      effects: [
        { type: 'setFlag', key: 'litmusTestedNaOH', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-naoh', prop: 'liquidColor', value: 'rgba(37, 99, 235, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'tube-naoh', prop: 'label', value: 'NaOH: Red Litmus turned BLUE' },
      ],
      completesAction: 'test-litmus-naoh',
      animation: { type: 'color-change', durationMs: 2000, animatingFlag: 'isLitmusNaOH' },
    },
    // Zinc Tests
    {
      id: 'act-zinc-hcl',
      trigger: { type: 'drop', source: 'zinc-granules', target: 'tube-hcl-mouth' },
      effects: [
        { type: 'setFlag', key: 'zincInHCl', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-hcl', prop: 'label', value: 'Zn + 2HCl → ZnCl₂ + H₂↑ (Brisk Bubbles)' },
      ],
      completesAction: 'zinc-added-hcl',
      animation: { type: 'bubble', durationMs: 3000, animatingFlag: 'isBubblingH2' },
    },
    {
      id: 'act-splinter-hcl',
      trigger: { type: 'drop', source: 'burning-splinter', target: 'tube-hcl-mouth' },
      conditions: [{ type: 'flag', key: 'zincInHCl', equals: true }],
      blockMessage: 'Add Zinc granules to Tube A first to produce hydrogen gas.',
      effects: [
        { type: 'setFlag', key: 'splinterTestedHCl', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-hcl', prop: 'label', value: '💥 POP! Hydrogen burned with squeaky pop sound' },
      ],
      completesAction: 'splinter-tested-hcl',
      animation: { type: 'color-change', durationMs: 1500, animatingFlag: 'isPoppingH2' },
    },
    {
      id: 'act-zinc-naoh',
      trigger: { type: 'drop', source: 'zinc-granules', target: 'tube-naoh-mouth' },
      effects: [
        { type: 'setFlag', key: 'zincInNaOH', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-naoh', prop: 'label', value: 'Zn + 2NaOH → Na₂ZnO₂ + H₂↑ (Warm/Bubbling)' },
      ],
      completesAction: 'zinc-added-naoh',
      animation: { type: 'bubble', durationMs: 3000, animatingFlag: 'isBubblingNa2ZnO2' },
    },
    // Na2CO3 Tests
    {
      id: 'act-na2co3-hcl',
      trigger: { type: 'drop', source: 'na2co3-powder', target: 'tube-hcl-mouth' },
      effects: [
        { type: 'setFlag', key: 'na2co3InHCl', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-hcl', prop: 'label', value: 'Na₂CO₃ + 2HCl → CO₂↑ (Brisk Effervescence)' },
        { type: 'setApparatusProp', apparatusId: 'tube-limewater', prop: 'liquidColor', value: 'rgba(255, 255, 255, 0.95)' },
        { type: 'setApparatusProp', apparatusId: 'tube-limewater', prop: 'label', value: 'Lime Water: Turned MILKY (CaCO₃↓)' },
      ],
      completesAction: 'na2co3-added-hcl',
      animation: { type: 'bubble', durationMs: 3500, animatingFlag: 'isEffervescingCO2' },
    },
    {
      id: 'act-na2co3-naoh',
      trigger: { type: 'drop', source: 'na2co3-powder', target: 'tube-naoh-mouth' },
      effects: [
        { type: 'setFlag', key: 'na2co3InNaOH', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-naoh', prop: 'label', value: 'Na₂CO₃ + NaOH: No Reaction (Base + Carbonate)' },
      ],
      completesAction: 'na2co3-added-naoh',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isNoReaction' },
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'Zn + 2HCl -> ZnCl2 + H2; Zn + 2NaOH -> Na2ZnO2 + H2; Na2CO3 + 2HCl -> 2NaCl + H2O + CO2',
    reactionType: 'Acid and Base Characteristic Reactions',
    constants: {},
  },

  // ── Calculation / Observation Form ──
  calculation: {
    title: 'Acids and Bases Comparative Matrix',
    instruction:
      'Enter the numeric code for each observed property: Litmus (1=Red, 2=Blue), Gas evolved with Zinc (1=Hydrogen/Pop, 2=No Gas), Reaction with Na₂CO₃ (1=CO₂/Lime Water Milky, 2=No Reaction).',
    fields: [
      {
        id: 'litmus_hcl',
        label: 'Action of Litmus on HCl (1=Turns Red, 2=Turns Blue)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'litmus_naoh',
        label: 'Action of Litmus on NaOH (1=Turns Red, 2=Turns Blue)',
        unit: '',
        expectedValue: 2,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'gas_zn_hcl',
        label: 'Gas evolved with Zinc + HCl (1=H₂ / Pop sound, 2=None)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'gas_zn_naoh',
        label: 'Gas evolved with Zinc + NaOH on warming (1=H₂ / Pop sound, 2=None)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'reaction_carbonate_hcl',
        label: 'Reaction of Solid Na₂CO₃ with HCl (1=CO₂ / Lime water milky, 2=No reaction)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'reaction_carbonate_naoh',
        label: 'Reaction of Solid Na₂CO₃ with NaOH (1=CO₂ / Lime water milky, 2=No reaction)',
        unit: '',
        expectedValue: 2,
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
        question: 'Which gas is responsible for turning freshly prepared lime water milky?',
        options: ['Hydrogen gas', 'Carbon dioxide gas', 'Oxygen gas', 'Nitrogen gas'],
        correctIndex: 1,
        explanation: 'CO₂ reacts with aqueous Ca(OH)₂ (lime water) to form an insoluble white precipitate of calcium carbonate: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O.',
      },
      {
        id: 'q2',
        question: 'What color change occurs when blue litmus solution is added to dilute hydrochloric acid?',
        options: ['Stays blue', 'Turns red', 'Turns colorless', 'Turns yellow-green'],
        correctIndex: 1,
        explanation: 'Acids have excess H⁺ ions and turn blue litmus red.',
      },
      {
        id: 'q3',
        question: 'How is hydrogen gas confirmatively tested in the laboratory?',
        options: [
          'It relights a glowing wooden splinter',
          'It burns with a squeaky pop sound near a burning splinter',
          'It turns lime water milky white',
          'It bleaches moist litmus paper',
        ],
        correctIndex: 1,
        explanation: 'Hydrogen is a highly combustible gas that burns with a characteristic squeaky "pop" sound when ignited in air.',
      },
      {
        id: 'q4',
        question: 'Which of the following substances does sodium hydroxide (NaOH) NOT react with under normal conditions?',
        options: ['Red litmus paper', 'Solid sodium carbonate (Na₂CO₃)', 'Zinc granules on warming', 'Phenolphthalein indicator'],
        correctIndex: 1,
        explanation: 'Sodium hydroxide is a base and does not react with metal carbonates like Na₂CO₃ because carbonates only decompose/react with acids to liberate CO₂.',
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
          { label: 'Tube A (HCl) placed in stand', points: 7, flag: 'hclPlaced' },
          { label: 'Tube B (NaOH) placed in stand', points: 7, flag: 'naohPlaced' },
          { label: 'Lime water tube placed in stand', points: 6, flag: 'limewaterPlaced' },
        ],
      },
    },
    {
      name: 'Performing Tests Correctly (Litmus, Zn Pop, CO₂ Lime Water)',
      maxPoints: 40,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Litmus tested on HCl (turns red)', points: 8, flag: 'litmusTestedHCl' },
          { label: 'Litmus tested on NaOH (turns blue)', points: 8, flag: 'litmusTestedNaOH' },
          { label: 'Zinc added to HCl & pop sound tested', points: 8, flag: 'splinterTestedHCl' },
          { label: 'Zinc added to NaOH and warmed', points: 8, flag: 'zincInNaOH' },
          { label: 'Na₂CO₃ added to HCl & lime water turned milky', points: 8, flag: 'na2co3InHCl' },
        ],
      },
    },
    {
      name: 'Observation Table and Conclusions',
      maxPoints: 25,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Litmus tests recorded correctly', points: 8, calcFieldId: 'litmus_hcl', expectedValue: 1, tolerance: 0.1 },
          { label: 'Zinc H₂ reactions identified', points: 9, calcFieldId: 'gas_zn_hcl', expectedValue: 1, tolerance: 0.1 },
          { label: 'Carbonate reactions identified', points: 8, calcFieldId: 'reaction_carbonate_naoh', expectedValue: 2, tolerance: 0.1 },
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
      id: 'splinter-without-zinc',
      trigger: 'drop:burning-splinter→tube-hcl-mouth',
      condition: { type: 'flag', key: 'zincInHCl', equals: false },
      message: 'Add zinc granules into the acid first to evolve hydrogen gas before testing with a burning splinter.',
      blocking: true,
    },
  ],
};
