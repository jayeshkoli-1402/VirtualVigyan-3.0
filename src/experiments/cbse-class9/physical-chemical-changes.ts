/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Physical and Chemical Changes
 *  CBSE Class 9 Science — Is Matter Around Us Pure?
 * ═══════════════════════════════════════════════════════════════════
 *
 *  (a) Fe + CuSO₄ → FeSO₄ + Cu (Chemical: displacement)
 *  (b) 2Mg + O₂ → 2MgO (Chemical: combustion, dazzling white flame)
 *  (c) Zn + H₂SO₄ → ZnSO₄ + H₂↑ (Chemical: single displacement, effervescence)
 *  (d) CuSO₄·5H₂O ⇌ CuSO₄ + 5H₂O (Chemical: reversible dehydration/hydration)
 *  (e) NH₄Cl(s) ⇌ NH₄Cl(g) (Physical: sublimation, phase change)
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
      id: 'tube-a',
      component: 'TestTube',
      label: 'Reaction Test Tube A',
      icon: '🧪',
      initialProps: { width: 45, height: 160, liquidLevel: 0, label: 'Tube A' },
    },
    {
      id: 'tube-b',
      component: 'TestTube',
      label: 'Reaction Test Tube B',
      icon: '🧪',
      initialProps: { width: 45, height: 160, liquidLevel: 0, label: 'Tube B' },
    },
    {
      id: 'china-dish',
      component: 'EvaporatingDish',
      label: 'China Dish (Heating & Sublimation)',
      icon: '🥣',
      initialProps: { width: 110, height: 50, label: 'China Dish' },
    },
    {
      id: 'bunsen-burner',
      component: 'BunsenBurner',
      label: 'Bunsen Burner Flame',
      icon: '🔥',
      initialProps: { width: 85, height: 125, isLit: true },
    },
    {
      id: 'cuso4-bottle',
      component: 'ReagentBottle',
      label: '5% Copper Sulphate Solution (Blue)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(37, 99, 235, 0.85)', label: 'CuSO₄ Sol' },
    },
    {
      id: 'iron-nail',
      component: 'ReagentBottle',
      label: 'Clean Iron Nail',
      icon: '📌',
      initialProps: { liquidColor: '#64748b', label: 'Fe Nail' },
    },
    {
      id: 'mg-ribbon',
      component: 'Matchstick',
      label: 'Clean Magnesium Ribbon',
      icon: '✨',
      initialProps: { isLit: false, label: 'Mg Ribbon' },
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
      id: 'cuso4-crystals',
      component: 'ReagentBottle',
      label: 'CuSO₄·5H₂O Crystals (Blue)',
      icon: '🔷',
      initialProps: { liquidColor: 'rgba(30, 64, 175, 0.9)', label: 'CuSO₄·5H₂O' },
    },
    {
      id: 'water-dropper',
      component: 'Dropper',
      label: 'Distilled Water Dropper',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.65)', label: 'H₂O Dropper' },
    },
    {
      id: 'nh4cl-bottle',
      component: 'ReagentBottle',
      label: 'Ammonium Chloride (NH₄Cl)',
      icon: '🧂',
      initialProps: { liquidColor: '#f1f5f9', label: 'NH₄Cl Powder' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stand-tube-a-zone',
      label: 'Place Test Tube A on Stand',
      accepts: ['tube-a'],
      position: { x: 20, y: 65 },
      size: { width: 16, height: 35 },
      rejectMessage: 'Place Test Tube A on the left rack position.',
    },
    {
      id: 'stand-tube-b-zone',
      label: 'Place Test Tube B on Stand',
      accepts: ['tube-b'],
      position: { x: 42, y: 65 },
      size: { width: 16, height: 35 },
      rejectMessage: 'Place Test Tube B on the middle rack position.',
    },
    {
      id: 'burner-dish-zone',
      label: 'Place China Dish over Burner',
      accepts: ['china-dish'],
      position: { x: 74, y: 55 },
      size: { width: 22, height: 26 },
      rejectMessage: 'Place China dish over the Bunsen burner flame.',
    },
    {
      id: 'tube-mouth-a',
      label: 'Into Test Tube A',
      accepts: ['cuso4-bottle', 'iron-nail'],
      position: { x: 20, y: 48 },
      size: { width: 16, height: 22 },
      rejectMessage: 'Add CuSO₄ solution or Iron nail into Test Tube A.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'tube-a' },
    },
    {
      id: 'tube-mouth-b',
      label: 'Into Test Tube B',
      accepts: ['zinc-granules', 'dil-h2so4-bottle'],
      position: { x: 42, y: 48 },
      size: { width: 16, height: 22 },
      rejectMessage: 'Add Zinc granules and Dilute H₂SO₄ into Test Tube B.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'tube-b' },
    },
    {
      id: 'dish-zone',
      label: 'Into China Dish',
      accepts: ['mg-ribbon', 'cuso4-crystals', 'water-dropper', 'nh4cl-bottle'],
      position: { x: 74, y: 45 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Place test substance into the China dish.',
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
      label: 'Setup Laboratory Apparatus',
      instruction: 'Place Test Tube A and Test Tube B on the stands, and place the China dish over the Bunsen burner.',
      requiredActions: ['place-tube-a', 'place-tube-b', 'place-dish'],
      type: 'lab',
    },
    {
      id: 'test-displacement',
      label: '1. Fe + CuSO₄ Reaction',
      instruction: 'Add blue 5% CuSO₄ solution to Test Tube A, then immerse the clean iron nail. Observe the displacement reaction: solution colour turns pale green (FeSO₄) and a reddish-brown copper coating forms on the nail (Chemical Change).',
      requiredActions: ['added-cuso4', 'dipped-nail'],
      type: 'lab',
    },
    {
      id: 'test-magnesium',
      label: '2. Burning Magnesium',
      instruction: 'Drag the clean Magnesium ribbon into the China dish over the burner flame. Observe the dazzling white flame and formation of white magnesium oxide (MgO) ash (Chemical Change).',
      requiredActions: ['burned-mg'],
      type: 'lab',
    },
    {
      id: 'test-zinc-acid',
      label: '3. Zinc + Dilute H₂SO₄',
      instruction: 'Add Zinc granules to Test Tube B, then add Dilute H₂SO₄ acid. Observe brisk effervescence releasing Hydrogen gas (H₂↑) and forming Zinc Sulphate solution (Chemical Change).',
      requiredActions: ['added-zinc', 'added-h2so4'],
      type: 'lab',
    },
    {
      id: 'test-cuso4-heating',
      label: '4. Heating CuSO₄ Crystals',
      instruction: 'Add blue hydrated CuSO₄·5H₂O crystals to the heated China dish. Observe loss of water of crystallisation forming white anhydrous CuSO₄ powder. Then add drops of water from the dropper to restore the blue color.',
      requiredActions: ['added-cuso4-crystals', 'rehydrated-cuso4'],
      type: 'lab',
    },
    {
      id: 'test-sublimation',
      label: '5. Sublimation of NH₄Cl',
      instruction: 'Add Ammonium Chloride (NH₄Cl) powder to the China dish. Observe white vapours forming directly from solid without melting, condensing back to pure NH₄Cl solid on cooler surfaces (Physical Change).',
      requiredActions: ['added-nh4cl'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: 'Classification of Changes Matrix',
      instruction: 'Classify each transformation as Chemical Change (Enter 1) or Physical Change (Enter 2) based on whether new substances are formed.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: 'Evaluation & Score',
      instruction: 'Review your laboratory transformation observations, classification accuracy, and viva voce assessment.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'place-tube-a-act',
      trigger: { type: 'drop', source: 'tube-a', target: 'stand-tube-a-zone' },
      effects: [{ type: 'placeApparatus', apparatusId: 'tube-a', zoneId: 'stand-tube-a-zone' }],
      completesAction: 'place-tube-a',
    },
    {
      id: 'place-tube-b-act',
      trigger: { type: 'drop', source: 'tube-b', target: 'stand-tube-b-zone' },
      effects: [{ type: 'placeApparatus', apparatusId: 'tube-b', zoneId: 'stand-tube-b-zone' }],
      completesAction: 'place-tube-b',
    },
    {
      id: 'place-dish-act',
      trigger: { type: 'drop', source: 'china-dish', target: 'burner-dish-zone' },
      effects: [{ type: 'placeApparatus', apparatusId: 'china-dish', zoneId: 'burner-dish-zone' }],
      completesAction: 'place-dish',
    },
    {
      id: 'add-cuso4-act',
      trigger: { type: 'drop', source: 'cuso4-bottle', target: 'tube-mouth-a' },
      effects: [
        { type: 'setFlag', key: 'hasCuSO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-a', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'tube-a', prop: 'liquidColor', value: 'rgba(37, 99, 235, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'tube-a', prop: 'label', value: 'CuSO₄ Solution (Blue)' },
      ],
      completesAction: 'added-cuso4',
    },
    {
      id: 'dip-nail-act',
      trigger: { type: 'drop', source: 'iron-nail', target: 'tube-mouth-a' },
      conditions: [{ type: 'flag', key: 'hasCuSO4', equals: true }],
      blockMessage: 'Add CuSO₄ solution to Test Tube A first.',
      effects: [
        { type: 'setFlag', key: 'nailDipped', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-a', prop: 'liquidColor', value: 'rgba(74, 222, 128, 0.65)' },
        { type: 'setApparatusProp', apparatusId: 'tube-a', prop: 'label', value: 'FeSO₄ (Pale Green) + Reddish Cu on Nail' },
      ],
      completesAction: 'dipped-nail',
    },
    {
      id: 'burn-mg-act',
      trigger: { type: 'drop', source: 'mg-ribbon', target: 'dish-zone' },
      effects: [
        { type: 'setFlag', key: 'mgBurned', value: true },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'label', value: '✨ Dazzling White Flame → White MgO Ash (Chemical)' },
      ],
      completesAction: 'burned-mg',
    },
    {
      id: 'add-zinc-act',
      trigger: { type: 'drop', source: 'zinc-granules', target: 'tube-mouth-b' },
      effects: [
        { type: 'setFlag', key: 'zincAddedB', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'hasZinc', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'label', value: 'Zinc Granules in Tube B' },
      ],
      completesAction: 'added-zinc',
    },
    {
      id: 'add-h2so4-act',
      trigger: { type: 'drop', source: 'dil-h2so4-bottle', target: 'tube-mouth-b' },
      conditions: [{ type: 'flag', key: 'zincAddedB', equals: true }],
      blockMessage: 'Add zinc granules to Test Tube B first.',
      effects: [
        { type: 'setFlag', key: 'zincReacted', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'liquidLevel', value: 0.55 },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.55)' },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'isReacting', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'effervescenceRate', value: 1 },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'label', value: 'ZnSO₄ + H₂↑ Gas Effervescence (Chemical)' },
      ],
      completesAction: 'added-h2so4',
    },
    {
      id: 'add-cuso4-crystals-act',
      trigger: { type: 'drop', source: 'cuso4-crystals', target: 'dish-zone' },
      effects: [
        { type: 'setFlag', key: 'cuso4Heated', value: true },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'liquidLevel', value: 0.3 },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'liquidColor', value: '#f1f5f9' },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'label', value: 'CuSO₄·5H₂O heated → White Anhydrous CuSO₄ + Steam' },
      ],
      completesAction: 'added-cuso4-crystals',
    },
    {
      id: 'rehydrate-cuso4-act',
      trigger: { type: 'drop', source: 'water-dropper', target: 'dish-zone' },
      conditions: [{ type: 'flag', key: 'cuso4Heated', equals: true }],
      blockMessage: 'Heat the CuSO₄ crystals in China dish first before rehydrating.',
      effects: [
        { type: 'setFlag', key: 'cuso4Rehydrated', value: true },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'liquidColor', value: 'rgba(37, 99, 235, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'label', value: 'Water added → Restored Hydrated Blue CuSO₄ (Chemical)' },
      ],
      completesAction: 'rehydrated-cuso4',
    },
    {
      id: 'sublime-nh4cl-act',
      trigger: { type: 'drop', source: 'nh4cl-bottle', target: 'dish-zone' },
      effects: [
        { type: 'setFlag', key: 'nh4clSublimed', value: true },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'liquidColor', value: 'rgba(241, 245, 249, 0.95)' },
        { type: 'setApparatusProp', apparatusId: 'china-dish', prop: 'label', value: 'NH₄Cl Sublimed! Direct Solid ⇌ Vapour phase change (Physical)' },
      ],
      completesAction: 'added-nh4cl',
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction:
      'Fe + CuSO4 -> FeSO4 + Cu; 2Mg + O2 -> 2MgO; Zn + H2SO4 -> ZnSO4 + H2↑; CuSO4.5H2O <=> CuSO4 + 5H2O; NH4Cl(s) <=> NH4Cl(g)',
    reactionType: 'Displacement, Combustion, Gas Evolution, Dehydration & Sublimation',
    constants: {},
  },

  // ── Calculation / Classification Matrix Form ──
  calculation: {
    title: 'Classification of Changes Matrix',
    instruction:
      'Classify each transformation as Chemical Change (Enter 1) or Physical Change (Enter 2) based on whether new substances with different chemical properties are formed.',
    fields: [
      {
        id: 'changeA',
        label: '1. Iron nail + CuSO₄ solution (1=Chemical, 2=Physical)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'changeB',
        label: '2. Burning Magnesium ribbon in air (1=Chemical, 2=Physical)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'changeC',
        label: '3. Zinc granules + Dilute H₂SO₄ (1=Chemical, 2=Physical)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'changeD',
        label: '4. Heating Hydrated CuSO₄ Crystals (1=Chemical, 2=Physical)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'changeE',
        label: '5. Sublimation of Ammonium Chloride (1=Chemical, 2=Physical)',
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
        question: 'Why does the blue colour of CuSO₄ solution fade to pale green when an iron nail is immersed in it?',
        options: [
          'Iron metal dissolves physical colour',
          'Iron displaces copper from CuSO₄, forming pale green FeSO₄',
          'Copper transforms directly into iron',
          'It is purely a reversible physical change',
        ],
        correctIndex: 1,
        explanation:
          'Iron is more reactive than copper in the activity series. It undergoes single displacement: Fe + CuSO₄ → FeSO₄ (pale green) + Cu (red-brown deposit on nail).',
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
        explanation:
          'Sublimation involves only a reversible change of state from solid to vapour (NH₄Cl(s) ⇌ NH₄Cl(g)) without chemical bond cleavage or new chemical substance formation.',
      },
      {
        id: 'q3',
        question: 'What flammable gas is liberated when zinc granules react with dilute sulphuric acid?',
        options: [
          'Oxygen gas',
          'Carbon dioxide',
          'Hydrogen gas (burns with a characteristic pop sound)',
          'Sulphur dioxide',
        ],
        correctIndex: 2,
        explanation:
          'Zn + H₂SO₄ → ZnSO₄ + H₂↑. Hydrogen gas burns with a characteristic pop sound when tested with a burning splinter.',
      },
      {
        id: 'q4',
        question: 'What is the colour of anhydrous copper sulphate formed upon heating hydrated crystals?',
        options: ['Deep blue', 'Pure white', 'Emerald green', 'Jet black'],
        correctIndex: 1,
        explanation:
          'Heating blue CuSO₄·5H₂O expels water of crystallisation, forming white anhydrous CuSO₄ powder. Adding water restores the hydrated blue colour.',
      },
    ],
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Apparatus Setup & Placement',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'hasCuSO4', truePoints: 20 },
    },
    {
      name: 'Chemical Displacement (Fe + CuSO₄)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'nailDipped', truePoints: 20 },
    },
    {
      name: 'Combustion Reaction (Mg Ribbon)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'mgBurned', truePoints: 20 },
    },
    {
      name: 'Gas Evolution (Zn + H₂SO₄)',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'zincReacted', truePoints: 20 },
    },
    {
      name: 'Dehydration & Sublimation Tests',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'nh4clSublimed', truePoints: 20 },
    },
  ],
  validation: [],
};
