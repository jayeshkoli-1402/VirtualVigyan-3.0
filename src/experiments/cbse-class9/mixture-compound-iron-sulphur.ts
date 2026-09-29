/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Mixture and Compound (Iron Filings and Sulphur)
 *  CBSE Class 9 Science — Is Matter Around Us Pure?
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Fe + S → FeS (Exothermic synthesis on heating)
 *  Mixture: Retains magnetic Fe, S dissolves in CS₂, gives H₂ with HCl
 *  Compound (FeS): Non-magnetic, insoluble in CS₂, gives foul H₂S with HCl
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const mixtureCompoundIronSulphur: ExperimentConfig = {
  id: 'mixture-compound-iron-sulphur',
  title: 'Mixture and Compound (Iron and Sulphur)',
  subtitle: 'Fe + S: Magnetism, CS₂ Solubility & Dilute HCl Reaction',
  description:
    'Prepare a physical mixture and a chemical compound (FeS) from iron filings and sulphur powder. Distinguish them using a magnet, carbon disulphide solubility, and reaction with dilute hydrochloric acid.',
  class: 9,
  subject: 'Chemistry',
  chapter: 'Matter: Is Matter Around Us Pure?',
  difficulty: 'medium',
  themeColor: '#b45309',
  icon: '🧲',
  estimatedMinutes: 35,
  underDevelopment: true,
  adminOnly: true,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'watch-glass',
      component: 'WatchGlass',
      label: 'Watch Glass (for Mixing)',
      icon: '⚪',
      initialProps: { width: 120, height: 45, label: 'Watch Glass' },
    },
    {
      id: 'boiling-tube',
      component: 'TestTube',
      label: 'Hard Glass Boiling Tube',
      icon: '🧪',
      initialProps: { width: 45, height: 160, liquidLevel: 0, label: 'Boiling Tube' },
    },
    {
      id: 'iron-bottle',
      component: 'ReagentBottle',
      label: 'Iron Filings (7 g)',
      icon: '⚙️',
      initialProps: { liquidColor: '#334155', label: 'Fe Filings (7 g)' },
    },
    {
      id: 'sulphur-bottle',
      component: 'ReagentBottle',
      label: 'Sulphur Powder (4 g)',
      icon: '🟡',
      initialProps: { liquidColor: '#facc15', label: 'Sulphur (4 g)' },
    },
    {
      id: 'bar-magnet',
      component: 'Matchstick',
      label: 'Strong Bar Magnet',
      icon: '🧲',
      initialProps: { isLit: false, label: 'Bar Magnet' },
    },
    {
      id: 'bunsen-burner',
      component: 'BunsenBurner',
      label: 'Bunsen Burner Flame',
      icon: '🔥',
      initialProps: { width: 85, height: 125, isLit: true },
    },
    {
      id: 'dil-hcl-bottle',
      component: 'ReagentBottle',
      label: 'Dilute HCl (2 M)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.45)', label: 'Dil. HCl' },
    },
    {
      id: 'digital-balance',
      component: 'DigitalBalance',
      label: 'Digital Balance',
      icon: '⚖️',
      initialProps: { width: 140, height: 95, massGrams: 0.00, label: '0.00 g' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'balance-zone',
      label: 'Place Watch Glass on Balance',
      accepts: ['watch-glass'],
      position: { x: 30, y: 65 },
      size: { width: 22, height: 26 },
      rejectMessage: 'Place the watch glass on the balance to weigh reagents.',
    },
    {
      id: 'burner-zone',
      label: 'Over Bunsen Burner',
      accepts: ['boiling-tube'],
      position: { x: 70, y: 55 },
      size: { width: 20, height: 35 },
      rejectMessage: 'Clamp the boiling tube over the burner flame.',
    },
    {
      id: 'watch-glass-mouth',
      label: 'Onto Watch Glass',
      accepts: ['iron-bottle', 'sulphur-bottle', 'bar-magnet'],
      position: { x: 30, y: 52 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Add reagents or test with magnet on the watch glass.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'watch-glass' },
    },
    {
      id: 'tube-mouth',
      label: 'Into Boiling Tube',
      accepts: ['dil-hcl-bottle', 'bar-magnet'],
      position: { x: 70, y: 40 },
      size: { width: 16, height: 22 },
      rejectMessage: 'Add acid or test with magnet in the boiling tube.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'boiling-tube' },
    },
  ],

  bench: {
    backgroundElements: [],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-apparatus',
      label: 'Setup Equipment',
      instruction: 'Place the watch glass on the balance and mount the boiling tube above the burner.',
      requiredActions: ['place-watch-glass', 'place-boiling-tube'],
      type: 'lab',
    },
    {
      id: 'weigh-mix',
      label: 'Weigh & Mix Fe and S',
      instruction: 'Add 7 g Iron Filings and 4 g Sulphur Powder onto the watch glass to form a physical mixture.',
      requiredActions: ['added-iron', 'added-sulphur'],
      type: 'lab',
    },
    {
      id: 'test-magnet-mix',
      label: 'Magnetic Test on Mixture',
      instruction: 'Bring the bar magnet near the watch glass. Observe that iron filings cling to the magnet, proving physical retention of properties.',
      requiredActions: ['tested-magnet-mixture'],
      type: 'lab',
    },
    {
      id: 'synthesize-compound',
      label: 'Heat to Synthesize FeS',
      instruction: 'Heat the mixture strongly in the boiling tube over the Bunsen flame until it glows red, synthesizing iron sulphide (FeS). Click "Observation Complete" when cooled.',
      requiredActions: ['synthesized-compound'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-compound-properties',
      label: 'Test FeS Compound',
      instruction: 'Bring the magnet near the black FeS compound (non-magnetic), then add dilute HCl to detect pungent H₂S rotten-egg gas.',
      requiredActions: ['tested-magnet-compound', 'added-hcl-compound'],
      type: 'lab',
    },
    {
      id: 'calculation',
      label: 'Analysis & Mass Ratio',
      instruction: 'Enter observations and verify the Law of Constant Proportions for FeS synthesis.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: 'Evaluation & Score',
      instruction: 'Review your laboratory accuracy score and viva assessment.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'place-glass',
      trigger: { type: 'drop', source: 'watch-glass', target: 'balance-zone' },
      effects: [{ type: 'placeApparatus', apparatusId: 'watch-glass', zoneId: 'balance-zone' }],
      completesAction: 'place-watch-glass',
    },
    {
      id: 'place-tube',
      trigger: { type: 'drop', source: 'boiling-tube', target: 'burner-zone' },
      effects: [{ type: 'placeApparatus', apparatusId: 'boiling-tube', zoneId: 'burner-zone' }],
      completesAction: 'place-boiling-tube',
    },
    {
      id: 'add-iron',
      trigger: { type: 'drop', source: 'iron-bottle', target: 'watch-glass-mouth' },
      guard: {
        condition: { type: 'flag', key: 'hasIron', equals: true },
        message: 'Iron filings already added.',
      },
      effects: [
        { type: 'setFlag', key: 'hasIron', value: true },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 7.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: '7.00 g' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: 'Fe Filings (7 g)' },
      ],
      completesAction: 'added-iron',
    },
    {
      id: 'add-sulphur',
      trigger: { type: 'drop', source: 'sulphur-bottle', target: 'watch-glass-mouth' },
      conditions: [{ type: 'flag', key: 'hasIron', equals: true }],
      blockMessage: 'Add iron filings first before adding sulphur.',
      effects: [
        { type: 'setFlag', key: 'hasSulphur', value: true },
        { type: 'setFlag', key: 'mixtureReady', value: true },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: '11.00 g' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: 'Fe + S Mixture (Greyish-Yellow)' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'liquidColor', value: '#ca8a04' },
      ],
      completesAction: 'added-sulphur',
    },
    {
      id: 'test-magnet-mix-act',
      trigger: { type: 'drop', source: 'bar-magnet', target: 'watch-glass-mouth' },
      conditions: [{ type: 'flag', key: 'mixtureReady', equals: true }],
      blockMessage: 'Prepare the mixture first.',
      effects: [
        { type: 'setFlag', key: 'magnetTestedMix', value: true },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: '🧲 Fe attracts to magnet! S remains behind.' },
      ],
      completesAction: 'tested-magnet-mixture',
    },
    {
      id: 'synthesize-heat-btn',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [{ type: 'flag', key: 'mixtureReady', equals: true }],
      effects: [
        { type: 'setFlag', key: 'compoundSynthesized', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'liquidColor', value: '#18181b' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'FeS (Black Solid Mass formed)' },
      ],
      completesAction: 'synthesized-compound',
    },
    {
      id: 'test-magnet-compound-act',
      trigger: { type: 'drop', source: 'bar-magnet', target: 'tube-mouth' },
      conditions: [{ type: 'flag', key: 'compoundSynthesized', equals: true }],
      blockMessage: 'Synthesize the FeS compound first.',
      effects: [
        { type: 'setFlag', key: 'magnetTestedCompound', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'FeS: Non-Magnetic! Fe lost magnetic identity.' },
      ],
      completesAction: 'tested-magnet-compound',
    },
    {
      id: 'add-hcl-compound-act',
      trigger: { type: 'drop', source: 'dil-hcl-bottle', target: 'tube-mouth' },
      conditions: [{ type: 'flag', key: 'compoundSynthesized', equals: true }],
      blockMessage: 'Synthesize the FeS compound first.',
      effects: [
        { type: 'setFlag', key: 'hclAddedCompound', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'liquidLevel', value: 0.6 },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'isReacting', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'FeS + 2HCl → FeCl₂ + H₂S↑ (Rotten-Egg Odour!)' },
      ],
      completesAction: 'added-hcl-compound',
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'Fe(s) + S(s) -> FeS(s); FeS + 2HCl -> FeCl2 + H2S^',
    reactionType: 'Synthesis & Acid Reaction',
    constants: {
      massFe: 7.0,
      massS: 4.0,
    },
  },

  // ── Calculation / Observation Form ──
  calculation: {
    title: 'Mixture vs Compound Observations',
    instruction:
      'Enter the masses of reactants used to synthesize Iron Sulphide (FeS) and calculate the mass ratio Fe : S.\n' +
      'Mass Ratio = mass(Fe) / mass(S) = 7.0 / 4.0 = 1.75',
    fields: [
      {
        id: 'massFe',
        label: 'Mass of Iron Filings used (g)',
        unit: 'g',
        expectedValue: 7.0,
        tolerance: 0.2,
        toleranceType: 'absolute',
      },
      {
        id: 'massS',
        label: 'Mass of Sulphur Powder used (g)',
        unit: 'g',
        expectedValue: 4.0,
        tolerance: 0.2,
        toleranceType: 'absolute',
      },
      {
        id: 'massRatio',
        label: 'Observed Mass Ratio (Fe / S)',
        unit: '',
        expectedValue: 1.75,
        tolerance: 0.05,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Viva ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'What is the black solid formed upon heating iron filings with sulphur?',
        options: ['Iron oxide (Fe₂O₃)', 'Iron sulphide (FeS)', 'Sulphur dioxide (SO₂)', 'Iron chloride (FeCl₂)'],
        correctIndex: 1,
        explanation: 'Iron and sulphur combine chemically in a 7:4 mass ratio on heating to give iron(II) sulphide (FeS).',
      },
      {
        id: 'q2',
        question: 'Which sample is attracted by a permanent magnet?',
        options: ['The compound (FeS)', 'The physical mixture', 'Both equally', 'Neither sample'],
        correctIndex: 1,
        explanation: 'In the physical mixture, iron particles retain their elemental ferromagnetic properties. In FeS, iron is chemically bonded and non-magnetic.',
      },
      {
        id: 'q3',
        question: 'Which gas is released when dilute hydrochloric acid is added to the synthesized iron sulphide?',
        options: ['Hydrogen gas (H₂)', 'Sulphur dioxide (SO₂)', 'Hydrogen sulphide gas (H₂S)', 'Chlorine gas (Cl₂)'],
        correctIndex: 2,
        explanation: 'FeS + 2HCl → FeCl₂ + H₂S↑. Hydrogen sulphide gas has a characteristic foul rotten-egg odour.',
      },
      {
        id: 'q4',
        question: 'Why is carbon disulphide (CS₂) used to test the mixture?',
        options: ['It dissolves sulphur from the mixture, leaving iron behind', 'It dissolves iron metal', 'It acts as an oxidation catalyst', 'It neutralizes excess acid'],
        correctIndex: 0,
        explanation: 'Free elemental sulphur is soluble in carbon disulphide (CS₂). In FeS, sulphur is chemically bonded and insoluble.',
      },
    ],
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Apparatus Setup & Weighing',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'hasIron', truePoints: 20 },
    },
    {
      name: 'Synthesis & Reaction',
      maxPoints: 40,
      evaluator: { type: 'booleanCheck', flag: 'compoundSynthesized', truePoints: 40 },
    },
    {
      name: 'Magnetism & HCl Tests',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'hclAddedCompound', truePoints: 25 },
    },
    {
      name: 'Viva Voce Evaluation',
      maxPoints: 15,
      evaluator: { type: 'booleanCheck', flag: 'magnetTestedCompound', truePoints: 15 },
    },
  ],
  validation: [],
};
