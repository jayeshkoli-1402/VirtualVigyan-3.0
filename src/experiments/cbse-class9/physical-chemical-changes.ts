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
  underDevelopment: true,
  adminOnly: true,

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
      component: 'Matchstick',
      label: 'Clean Iron Nail',
      icon: '📌',
      initialProps: { isLit: false, label: 'Fe Nail' },
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
      component: 'Matchstick',
      label: 'Clean Magnesium Ribbon',
      icon: '✨',
      initialProps: { isLit: true, label: 'Mg Ribbon' },
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
      initialProps: { width: 85, height: 125, isLit: true },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stand-tube-zone',
      label: 'Place Test Tube on Stand',
      accepts: ['tube-displacement'],
      position: { x: 30, y: 65 },
      size: { width: 18, height: 35 },
      rejectMessage: 'Place the test tube on the left stand.',
    },
    {
      id: 'burner-dish-zone',
      label: 'Place China Dish over Burner',
      accepts: ['china-dish'],
      position: { x: 70, y: 55 },
      size: { width: 22, height: 26 },
      rejectMessage: 'Place China dish over the heating source.',
    },
    {
      id: 'tube-mouth',
      label: 'Into Test Tube',
      accepts: ['cuso4-bottle', 'iron-nail', 'zinc-granules', 'dil-h2so4-bottle'],
      position: { x: 30, y: 48 },
      size: { width: 16, height: 22 },
      rejectMessage: 'Add reagents into test tube mouth.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'tube-displacement' },
    },
    {
      id: 'dish-mouth',
      label: 'Into China Dish',
      accepts: ['mg-ribbon', 'nh4cl-bottle'],
      position: { x: 70, y: 45 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Place test substance into China dish.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'china-dish' },
    },
  ],

  bench: {
    backgroundElements: [],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-lab',
      label: 'Setup Apparatus',
      instruction: 'Place the test tube on the left stand and China dish over the burner.',
      requiredActions: ['place-tube', 'place-dish'],
      type: 'lab',
    },
    {
      id: 'test-displacement',
      label: '1. Fe + CuSO₄ Reaction',
      instruction: 'Add blue CuSO₄ solution to the test tube, then dip the iron nail. Observe the nail getting a reddish copper coating and solution turning pale green.',
      requiredActions: ['added-cuso4', 'dipped-nail'],
      type: 'lab',
    },
    {
      id: 'test-magnesium',
      label: '2. Burning Magnesium',
      instruction: 'Bring the magnesium ribbon over the burner. Observe the dazzling white flame producing white ash of MgO.',
      requiredActions: ['burned-mg'],
      type: 'lab',
    },
    {
      id: 'test-sublimation',
      label: '3. Sublimation of NH₄Cl',
      instruction: 'Add ammonium chloride to the heated China dish. Observe white vapours forming without melting, condensing back to pure NH₄Cl solid on cooler surfaces (Physical Change).',
      requiredActions: ['added-nh4cl'],
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
      effects: [{ type: 'placeApparatus', apparatusId: 'tube-displacement', zoneId: 'stand-tube-zone' }],
      completesAction: 'place-tube',
    },
    {
      id: 'place-dish-act',
      trigger: { type: 'drop', source: 'china-dish', target: 'burner-dish-zone' },
      effects: [{ type: 'placeApparatus', apparatusId: 'china-dish', zoneId: 'burner-dish-zone' }],
      completesAction: 'place-dish',
    },
    {
      id: 'add-cuso4-act',
      trigger: { type: 'drop', source: 'cuso4-bottle', target: 'tube-mouth' },
      effects: [
        { type: 'setFlag', key: 'hasCuSO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'liquidColor', value: 'rgba(37, 99, 235, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'label', value: 'CuSO₄ Solution (Blue)' },
      ],
      completesAction: 'added-cuso4',
    },
    {
      id: 'dip-nail-act',
      trigger: { type: 'drop', source: 'iron-nail', target: 'tube-mouth' },
      conditions: [{ type: 'flag', key: 'hasCuSO4', equals: true }],
      blockMessage: 'Add CuSO₄ solution to the test tube first.',
      effects: [
        { type: 'setFlag', key: 'nailDipped', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'liquidColor', value: 'rgba(74, 222, 128, 0.65)' },
        { type: 'setApparatusProp', apparatusId: 'tube-displacement', prop: 'label', value: 'FeSO₄ (Pale Green) + Reddish Cu on Nail' },
      ],
      completesAction: 'dipped-nail',
    },
    {
      id: 'burn-mg-act',
      trigger: { type: 'drop', source: 'mg-ribbon', target: 'dish-mouth' },
      effects: [
        { type: 'setFlag', key: 'mgBurned', value: true },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'label', value: '✨ Dazzling White Flame → White MgO Ash' },
      ],
      completesAction: 'burned-mg',
    },
    {
      id: 'sublime-nh4cl-act',
      trigger: { type: 'drop', source: 'nh4cl-bottle', target: 'dish-mouth' },
      effects: [
        { type: 'setFlag', key: 'nh4clSublimed', value: true },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'label', value: 'NH₄Cl Sublimed! White crystalline solid deposits (Physical)' },
      ],
      completesAction: 'added-nh4cl',
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
    title: 'Classification of Changes Matrix',
    instruction:
      'Classify each transformation as Chemical (Enter 1) or Physical (Enter 2) based on whether a new substance is formed.',
    fields: [
      {
        id: 'changeA',
        label: 'Fe + CuSO4: 1=Chemical, 2=Physical',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'changeB',
        label: 'Burning Magnesium Ribbon: 1=Chemical, 2=Physical',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'changeC',
        label: 'Zn + Dilute H2SO4: 1=Chemical, 2=Physical',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'changeD',
        label: 'Sublimation of NH4Cl: 1=Chemical, 2=Physical',
        unit: '',
        expectedValue: 2,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Viva ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'Why does the blue colour of CuSO₄ solution fade to pale green when an iron nail is immersed in it?',
        options: [
          'Iron metal dissolves physical colour',
          'Iron displaces copper from CuSO₄, forming pale green FeSO₄',
          'Copper transforms directly into iron',
          'It is purely a reversible physical change',
        ],
        correctIndex: 1,
        explanation: 'Iron is more electropositive than copper in the reactivity series. It undergoes single displacement: Fe + CuSO₄ → FeSO₄ (pale green) + Cu (red-brown deposit).',
      },
      {
        id: 'q2',
        question: 'Which of the following transformations is strictly a PHYSICAL change?',
        options: [
          'Burning of magnesium ribbon in air',
          'Reaction of zinc granules with dilute sulphuric acid',
          'Sublimation of ammonium chloride upon heating',
          'Displacement of copper by an iron nail',
        ],
        correctIndex: 2,
        explanation: 'Sublimation involves only a change of state from solid to vapour (NH₄Cl(s) ⇌ NH₄Cl(g)) without chemical bond cleavage or new chemical substance formation.',
      },
      {
        id: 'q3',
        question: 'What flammable gas is liberated when zinc granules react with dilute sulphuric acid?',
        options: ['Oxygen gas', 'Carbon dioxide', 'Hydrogen gas (burns with a pop sound)', 'Sulphur dioxide'],
        correctIndex: 2,
        explanation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑. Hydrogen gas burns with a characteristic pop sound when tested with a burning splinter.',
      },
      {
        id: 'q4',
        question: 'What is the colour of anhydrous copper sulphate formed upon heating hydrated crystals?',
        options: ['Deep blue', 'Pure white', 'Emerald green', 'Jet black'],
        correctIndex: 1,
        explanation: 'Heating CuSO₄·5H₂O expels water of crystallisation, forming white anhydrous CuSO₄. Adding water restores the hydrated blue colour.',
      },
    ],
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Apparatus Setup',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'hasCuSO4', truePoints: 20 },
    },
    {
      name: 'Chemical Transformations',
      maxPoints: 40,
      evaluator: { type: 'booleanCheck', flag: 'nailDipped', truePoints: 40 },
    },
    {
      name: 'Sublimation & Heating Tests',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'nh4clSublimed', truePoints: 25 },
    },
    {
      name: 'Viva Voce Evaluation',
      maxPoints: 15,
      evaluator: { type: 'vivaQuiz' },
    },
  ],
  validation: [],
};
