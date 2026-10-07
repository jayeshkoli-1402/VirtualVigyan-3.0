/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Physical and Chemical Changes
 *  CBSE Class 9 Science — Is Matter Around Us Pure?
 * ═══════════════════════════════════════════════════════════════════
 *
 *  (a) Fe + CuSO₄ → FeSO₄ + Cu (Chemical: displacement)
 *  (b) 2Mg + O₂ → 2MgO (Chemical: combustion, dazzling flame)
 *  (c) Zn + H₂SO₄ → ZnSO₄ + H₂↑ (Chemical: single displacement)
 *  (d) CuSO₄·5H₂O → CuSO₄ + 5H₂O (Chemical: dehydration/hydration)
 *  (e) NH₄Cl(s) ⇌ NH₄Cl(g) (Physical: sublimation, state change)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const physicalChemicalChanges: ExperimentConfig = {
  id: 'physical-chemical-changes',
  title: 'Physical and Chemical Changes',
  subtitle: 'Performing 5 Core Transformations & Classifying Nature',
  description:
    'Perform five distinct changes: Iron nail in copper sulphate, burning magnesium ribbon, zinc with dilute sulphuric acid, heating hydrated copper sulphate, and sublimation of ammonium chloride. Classify each as physical or chemical.',
  class: 9,
  subject: 'Chemistry',
  chapter: 'Matter: Is Matter Around Us Pure?',
  difficulty: 'easy',
  themeColor: '#059669',
  icon: '⚡',
  estimatedMinutes: 30,
  underDevelopment: false,
  adminOnly: false,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'tube-displacement',
      component: 'TestTube',
      label: 'Reaction Test Tube A',
      icon: '🧪',
      initialProps: { width: 45, height: 160, liquidLevel: 0, label: 'Tube A' },
    },
    {
      id: 'china-dish',
      component: 'EvaporatingDish',
      label: 'China Dish (Sublimation & Heating)',
      icon: '🥣',
      initialProps: { width: 110, height: 50, label: 'China Dish' },
    },
    {
      id: 'iron-nail',
      component: 'IronNail',
      label: 'Clean Iron Nail',
      icon: '📌',
      initialProps: { width: 28, height: 110, label: 'Fe Nail' },
    },
    {
      id: 'cuso4-bottle',
      component: 'ReagentBottle',
      label: '5% Copper Sulphate Solution (Blue)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(37, 99, 235, 0.85)', label: 'CuSO₄ Sol' },
    },
    {
      id: 'mg-ribbon',
      component: 'MagnesiumRibbon',
      label: 'Clean Magnesium Ribbon',
      icon: '✨',
      initialProps: { width: 55, height: 130, label: 'Mg Ribbon' },
    },
    {
      id: 'zinc-granules',
      component: 'ReagentBottle',
      label: 'Zinc Granules',
      icon: '🪨',
      initialProps: { liquidColor: '#64748b', label: 'Zinc Granules' },
    },
    {
      id: 'dil-h2so4-bottle',
      component: 'ReagentBottle',
      label: 'Dilute H₂SO₄ Acid',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.55)', label: 'Dil. H₂SO₄' },
    },
    {
      id: 'nh4cl-bottle',
      component: 'ReagentBottle',
      label: 'Ammonium Chloride (NH₄Cl)',
      icon: '🧂',
      initialProps: { liquidColor: '#f1f5f9', label: 'NH₄Cl Powder' },
    },
    {
      id: 'bunsen-burner',
      component: 'BunsenBurner',
      label: 'Bunsen Burner Flame',
      icon: '🔥',
      initialProps: { width: 75, height: 125, isLit: false },
    },
    {
      id: 'tripod-stand',
      component: 'Tripod',
      label: 'Tripod Stand & Wire Gauze',
      icon: '📐',
      initialProps: { width: 110, height: 115, label: 'Tripod & Wire Gauze' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stand-tube-zone',
      label: 'Place Test Tube in Stand',
      accepts: ['tube-displacement'],
      position: { x: 28, y: 56 },
      size: { width: 18, height: 32 },
      rejectMessage: 'Place the test tube in the stand on the left.',
    },
    {
      id: 'burner-stand-zone',
      label: 'Place Bunsen Burner on Table',
      accepts: ['bunsen-burner'],
      position: { x: 72, y: 63 },
      size: { width: 20, height: 26 },
      rejectMessage: 'Place the Bunsen burner on the table at the heating station.',
    },
    {
      id: 'burner-tripod-zone',
      label: 'Place Tripod Stand over Burner',
      accepts: ['tripod-stand'],
      position: { x: 72, y: 56 },
      size: { width: 22, height: 28 },
      rejectMessage: 'Place the Bunsen burner on the table first before positioning the tripod stand.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'bunsen-burner' },
    },
    {
      id: 'burner-dish-zone',
      label: 'Mount China Dish on Tripod Stand',
      accepts: ['china-dish'],
      position: { x: 72, y: 43 },
      size: { width: 22, height: 20 },
      rejectMessage: 'Place the Bunsen burner and Tripod stand on the heating station first before mounting the China dish.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'tripod-stand' },
    },
    {
      id: 'tube-mouth',
      label: 'Into Test Tube',
      accepts: ['cuso4-bottle', 'iron-nail', 'zinc-granules', 'dil-h2so4-bottle'],
      position: { x: 28, y: 44 },
      size: { width: 16, height: 20 },
      rejectMessage: 'Add reagents into test tube mouth.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'tube-displacement' },
    },
    {
      id: 'dish-mouth',
      label: 'Into China Dish',
      accepts: ['mg-ribbon', 'nh4cl-bottle'],
      position: { x: 72, y: 39 },
      size: { width: 18, height: 18 },
      rejectMessage: 'Place test substance into China dish.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'china-dish' },
    },
  ],

  bench: {
    backgroundElements: [
      {
        component: 'TestTubeStand',
        position: { x: 28, y: 64 },
        scale: 1.0,
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-lab',
      label: 'Setup Apparatus',
      instruction: 'Place the test tube in the stand, position the Bunsen burner on the table, place the Tripod stand over the burner, then mount the China dish on the tripod.',
      requiredActions: ['place-tube', 'place-burner', 'place-tripod', 'place-dish'],
      type: 'lab',
    },
    {
      id: 'test-displacement',
      label: '1. Fe + CuSO₄ Reaction',
      instruction: 'Add blue CuSO₄ solution to the test tube, then dip the iron nail. Observe the displacement reaction: solution turns pale green (FeSO₄) and a reddish-brown copper layer deposits on the nail (Chemical Change).',
      requiredActions: ['added-cuso4', 'dipped-nail'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-magnesium',
      label: '2. Burning Magnesium',
      instruction: 'Bring the magnesium ribbon over the burner. Observe the dazzling white flame producing white ash of MgO (Chemical Change).',
      requiredActions: ['burned-mg'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-sublimation',
      label: '3. Sublimation of NH₄Cl',
      instruction: 'Add ammonium chloride to the heated China dish. Observe white vapours forming without melting, condensing back to pure NH₄Cl solid on cooler surfaces (Physical Change).',
      requiredActions: ['added-nh4cl'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: 'Classification of Changes',
      instruction: 'Classify each transformation as Physical or Chemical change based on whether new substances are formed.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: 'Evaluation & Score',
      instruction: 'Review your laboratory observations and viva results.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'place-tube-act',
      trigger: { type: 'drop', source: 'tube-displacement', target: 'stand-tube-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-displacement', zoneId: 'stand-tube-zone' },
        { type: 'setFlag', key: 'tubePlaced', value: true },
      ],
      completesAction: 'place-tube',
    },
    {
      id: 'place-burner-act',
      trigger: { type: 'drop', source: 'bunsen-burner', target: 'burner-stand-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'bunsen-burner', zoneId: 'burner-stand-zone' },
        { type: 'setFlag', key: 'burnerPlaced', value: true },
      ],
      completesAction: 'place-burner',
    },
    {
      id: 'place-tripod-act',
      trigger: { type: 'drop', source: 'tripod-stand', target: 'burner-tripod-zone' },
      conditions: [{ type: 'apparatusPlaced', apparatusId: 'bunsen-burner' }],
      blockMessage: 'Place the Bunsen burner on the table first before positioning the tripod stand.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'tripod-stand', zoneId: 'burner-tripod-zone' },
        { type: 'setFlag', key: 'tripodPlaced', value: true },
      ],
      completesAction: 'place-tripod',
    },
    {
      id: 'place-dish-act',
      trigger: { type: 'drop', source: 'china-dish', target: 'burner-dish-zone' },
      conditions: [{ type: 'apparatusPlaced', apparatusId: 'tripod-stand' }],
      blockMessage: 'Place the Bunsen burner and Tripod stand on the heating station first before mounting the China dish.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'china-dish', zoneId: 'burner-dish-zone' },
        { type: 'setFlag', key: 'dishPlaced', value: true },
      ],
      completesAction: 'place-dish',
    },
    {
      id: 'ignite-burner-act',
      trigger: { type: 'click', elementId: 'ignite-burner' },
      effects: [
        { type: 'setFlag', key: 'burnerLit', value: true },
        { type: 'setApparatusProp', apparatusId: 'bunsen-burner', prop: 'isLit', value: true },
      ],
    },
    {
      id: 'stop-burner-act',
      trigger: { type: 'click', elementId: 'stop-burner' },
      effects: [
        { type: 'setFlag', key: 'burnerLit', value: false },
        { type: 'setApparatusProp', apparatusId: 'bunsen-burner', prop: 'isLit', value: false },
      ],
    },
    {
      id: 'add-cuso4-act',
      trigger: { type: 'drop', source: 'cuso4-bottle', target: 'tube-mouth' },
      effects: [
        { type: 'setFlag', key: 'hasCuSO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'liquidLevel', value: 0.52 },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'liquidColor', value: 'rgba(30, 64, 175, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'label', value: 'CuSO₄ Solution (Blue)' },
      ],
      completesAction: 'added-cuso4',
      animation: {
        type: 'pour',
        durationMs: 2200,
        animatingFlag: 'isPouringCuSO4',
      },
    },
    {
      id: 'dip-nail-act',
      trigger: { type: 'drop', source: 'iron-nail', target: 'tube-mouth' },
      conditions: [{ type: 'flag', key: 'hasCuSO4', equals: true }],
      blockMessage: 'Add CuSO₄ solution to the test tube first.',
      guard: {
        condition: { type: 'flag', key: 'nailDipped', equals: true },
        message: 'The iron nail has already been immersed in the copper sulphate solution.',
      },
      effects: [
        { type: 'setFlag', key: 'nailDipped', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'hasIronNail', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'liquidColor', value: 'rgba(134, 239, 172, 0.75)' },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'label', value: 'FeSO₄ (Pale Green) + Reddish Cu on Nail' },
      ],
      completesAction: 'dipped-nail',
      animation: {
        type: 'color-change',
        durationMs: 4000,
        animatingFlag: 'isDisplacing',
      },
    },
    {
      id: 'burn-mg-act',
      trigger: { type: 'drop', source: 'mg-ribbon', target: 'dish-mouth' },
      guard: {
        condition: { type: 'flag', key: 'burnerLit', equals: false },
        message: 'Click the Bunsen burner to ignite the flame before heating.',
      },
      effects: [
        { type: 'setFlag', key: 'mgBurned', value: true },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'label', value: '✨ Dazzling White Flame → White MgO Ash' },
      ],
      completesAction: 'burned-mg',
      animation: {
        type: 'color-change',
        durationMs: 3500,
        animatingFlag: 'isBurningMg',
      },
    },
    {
      id: 'sublime-nh4cl-act',
      trigger: { type: 'drop', source: 'nh4cl-bottle', target: 'dish-mouth' },
      guard: {
        condition: { type: 'flag', key: 'burnerLit', equals: false },
        message: 'Click the Bunsen burner to ignite the flame before heating.',
      },
      effects: [
        { type: 'setFlag', key: 'nh4clSublimed', value: true },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'label', value: 'NH₄Cl Sublimed! White crystalline solid deposits (Physical)' },
      ],
      completesAction: 'added-nh4cl',
      animation: {
        type: 'color-change',
        durationMs: 4500,
        animatingFlag: 'isSubliming',
      },
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'Fe + CuSO4 -> FeSO4 + Cu; 2Mg + O2 -> 2MgO; NH4Cl(s) <=> NH4Cl(g)',
    reactionType: 'Displacement, Combustion, and Sublimation',
    constants: {},
  },

  // ── Calculation / Observation Form ──
  calculation: {
    title: 'Classification of Physical & Chemical Changes',
    sectionTitle: 'CLASSIFICATION & ANALYSIS',
    recordedValuesTitle: 'OBSERVATIONS RECORDED',
    instruction:
      'Classify each transformation as Chemical (1) or Physical (2) based on whether a new substance is formed.',
    recordedValues: [
      {
        label: 'Fe + CuSO₄ Reaction',
        value: 'Solution turned pale green; reddish-brown Cu deposited on iron nail',
      },
      {
        label: 'Burning Magnesium Ribbon',
        value: 'Dazzling white flame observed; white powder/ash of MgO formed',
      },
      {
        label: 'Zn + Dilute H₂SO₄ Reaction',
        value: 'Effervescence observed; colourless H₂ gas liberated',
      },
      {
        label: 'Sublimation of NH₄Cl',
        value: 'Dense white vapours formed directly; solid deposited on cooler surface',
      },
    ],
    fields: [
      {
        id: 'changeA',
        label: '1. Fe + CuSO₄ → FeSO₄ + Cu',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
        options: ['1 — Chemical Change', '2 — Physical Change'],
        explanation:
          'Iron displaces copper forming pale green FeSO₄ and a reddish-brown copper deposit. Since a new substance is formed with different chemical properties, it is a Chemical Change.',
      },
      {
        id: 'changeB',
        label: '2. Burning Magnesium Ribbon',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
        options: ['1 — Chemical Change', '2 — Physical Change'],
        explanation:
          'Magnesium reacts with atmospheric oxygen to form magnesium oxide (MgO) ash with emission of intense white light. It is an irreversible Chemical Change.',
      },
      {
        id: 'changeC',
        label: '3. Zn + Dilute H₂SO₄',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
        options: ['1 — Chemical Change', '2 — Physical Change'],
        explanation:
          'Zinc reacts with dilute sulphuric acid to produce zinc sulphate (ZnSO₄) and liberate flammable hydrogen gas (H₂). A new substance is formed, so it is a Chemical Change.',
      },
      {
        id: 'changeD',
        label: '4. Sublimation of NH₄Cl',
        unit: '',
        expectedValue: 2,
        tolerance: 0.1,
        toleranceType: 'absolute',
        options: ['1 — Chemical Change', '2 — Physical Change'],
        explanation:
          'Solid ammonium chloride converts directly to vapour upon heating and re-condenses without changing chemical composition (NH₄Cl(s) ⇌ NH₄Cl(g)). It is a Physical Change.',
      },
    ],
  },

  // ── Viva ──
  viva: {
    title: 'Viva Voce — Conceptual Examination',
    questions: [
      {
        id: 'q1',
        question: 'Why does the blue colour of CuSO₄ solution fade to pale green when an iron nail is immersed in it?',
        options: [
          'Iron displaces copper from CuSO₄, forming pale green FeSO₄',
          'Iron metal dissolves physical colour',
          'Copper transforms directly into iron',
          'It is purely a reversible physical change',
        ],
        correctIndex: 0,
        explanation: 'Iron is more electropositive (reactive) than copper. It undergoes single displacement: Fe + CuSO₄ → FeSO₄ (pale green) + Cu (reddish-brown deposit).',
      },
      {
        id: 'q2',
        question: 'Which of the following observations confirms that burning of magnesium ribbon is a chemical change?',
        options: [
          'The magnesium ribbon becomes hot and melts',
          'A new substance (white magnesium oxide ash) with different properties is formed',
          'The ribbon changes shape reversibly',
          'Only physical state change occurs',
        ],
        correctIndex: 1,
        explanation: 'Burning magnesium combines chemically with oxygen to produce magnesium oxide (2Mg + O₂ → 2MgO), which has completely different chemical properties from magnesium metal.',
      },
      {
        id: 'q3',
        question: 'What flammable gas is liberated when zinc granules react with dilute sulphuric acid?',
        options: [
          'Oxygen gas (O₂)',
          'Carbon dioxide gas (CO₂)',
          'Hydrogen gas (H₂) which burns with a pop sound',
          'Sulphur dioxide gas (SO₂)',
        ],
        correctIndex: 2,
        explanation: 'Zn + Dilute H₂SO₄ → ZnSO₄ + H₂↑. Hydrogen gas burns with a characteristic pop sound when tested with a burning splinter.',
      },
      {
        id: 'q4',
        question: 'Why is the sublimation of ammonium chloride classified as a physical change?',
        options: [
          'A new chemical bond is permanently formed',
          'It requires no heat energy',
          'It changes state from solid to gas and vice versa without altering chemical composition',
          'It is an irreversible chemical oxidation',
        ],
        correctIndex: 2,
        explanation: 'NH₄Cl sublimes directly from solid to vapour upon heating and condenses back as pure NH₄Cl upon cooling without altering its chemical identity (NH₄Cl(s) ⇌ NH₄Cl(g)).',
      },
      {
        id: 'q5',
        question: 'When dilute sulphuric acid is added to zinc granules, what type of chemical reaction takes place?',
        options: [
          'Combination reaction',
          'Decomposition reaction',
          'Single displacement reaction',
          'Double displacement reaction',
        ],
        correctIndex: 2,
        explanation: 'Zinc displaces hydrogen from dilute sulphuric acid (Zn + H₂SO₄ → ZnSO₄ + H₂), which is a single displacement (redox) reaction.',
      },
    ],
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Lab Procedure & Correct Actions',
      maxPoints: 40,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Reaction test tube placed in stand', points: 5, action: 'place-tube' },
          { label: 'Bunsen burner positioned on table', points: 5, flag: 'burnerPlaced' },
          { label: 'Tripod stand & wire gauze mounted over burner', points: 5, flag: 'tripodPlaced' },
          { label: 'China dish mounted securely on tripod stand', points: 5, flag: 'dishPlaced' },
          { label: 'Blue CuSO₄ solution added to test tube', points: 10, flag: 'hasCuSO4' },
          { label: 'Bunsen burner flame lit before heating', points: 10, flag: 'burnerLit' },
        ],
      },
    },
    {
      name: 'Observations Recorded',
      maxPoints: 15,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Iron nail dipped & copper displacement observed', points: 5, flag: 'nailDipped' },
          { label: 'Magnesium ribbon burned (dazzling white flame & MgO ash)', points: 5, flag: 'mgBurned' },
          { label: 'Ammonium chloride heated & sublimed (Physical change)', points: 5, flag: 'nh4clSublimed' },
        ],
      },
    },
    {
      name: 'Classification & Analysis',
      maxPoints: 20,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Fe + CuSO₄ classified as Chemical Change', points: 5, calcFieldId: 'changeA', expectedValue: 1 },
          { label: 'Burning Magnesium Ribbon classified as Chemical Change', points: 5, calcFieldId: 'changeB', expectedValue: 1 },
          { label: 'Zn + Dilute H₂SO₄ classified as Chemical Change', points: 5, calcFieldId: 'changeC', expectedValue: 1 },
          { label: 'Sublimation of NH₄Cl classified as Physical Change', points: 5, calcFieldId: 'changeD', expectedValue: 2 },
        ],
      },
    },
    {
      name: 'Viva Voce — Conceptual Examination',
      maxPoints: 25,
      evaluator: { type: 'vivaQuiz' },
    },
  ],
  validation: [
    {
      id: 'tripod-before-burner',
      trigger: 'drop:tripod-stand→burner-tripod-zone',
      condition: { type: 'flag', key: 'burnerPlaced', equals: false },
      message: 'Safety rule: Place the Bunsen burner on the table first before positioning the tripod stand.',
      blocking: true,
    },
    {
      id: 'dish-before-tripod',
      trigger: 'drop:china-dish→burner-dish-zone',
      condition: { type: 'flag', key: 'tripodPlaced', equals: false },
      message: 'Safety rule: Place the Bunsen burner and Tripod stand on the heating station first before mounting the China dish.',
      blocking: true,
    },
    {
      id: 'burner-lit-before-mg',
      trigger: 'drop:mg-ribbon→dish-mouth',
      condition: { type: 'flag', key: 'burnerLit', equals: false },
      message: 'Click the Bunsen burner to ignite the flame before heating.',
      blocking: true,
    },
    {
      id: 'burner-lit-before-nh4cl',
      trigger: 'drop:nh4cl-bottle→dish-mouth',
      condition: { type: 'flag', key: 'burnerLit', equals: false },
      message: 'Click the Bunsen burner to ignite the flame before heating.',
      blocking: true,
    },
  ],
};
