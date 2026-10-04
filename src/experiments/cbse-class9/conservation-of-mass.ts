/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Verification of the Law of Conservation of Mass
 *  CBSE Class 9 Science — Atoms and Molecules
 * ═══════════════════════════════════════════════════════════════════
 *
 *  BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s)↓ + 2NaCl(aq)
 *  Total mass of reactants before mixing (m₁) = Total mass of products after mixing (m₂)
 *  Δm = m₂ - m₁ = 0.00 g (within ±0.02 g balance precision)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const conservationOfMass: ExperimentConfig = {
  id: 'conservation-of-mass',
  title: 'Law of Conservation of Mass',
  subtitle: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl (m₁ = m₂)',
  description:
    'Demonstrate mass conservation during a chemical reaction by reacting barium chloride with sodium sulphate in a sealed conical flask system. Verify that total mass of products equals total mass of reactants.',
  class: 9,
  subject: 'Chemistry',
  chapter: 'Atoms and Molecules',
  difficulty: 'medium',
  themeColor: '#059669',
  icon: '⚖️',
  estimatedMinutes: 30,
  underDevelopment: false,
  adminOnly: false,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'conical-flask',
      component: 'ConicalFlask',
      label: '250 mL Conical Flask with Cork',
      icon: '⚗️',
      initialProps: { width: 130, height: 160, liquidLevel: 0, label: 'Conical Flask' },
    },
    {
      id: 'ignition-tube',
      component: 'TestTube',
      label: 'Small Ignition Tube with Thread',
      icon: '🧪',
      initialProps: { width: 35, height: 110, liquidLevel: 0, label: 'Ignition Tube' },
    },
    {
      id: 'na2so4-bottle',
      component: 'ReagentBottle',
      label: '5% Sodium Sulphate (Na₂SO₄)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.45)', label: 'Na₂SO₄ Sol' },
    },
    {
      id: 'bacl2-bottle',
      component: 'ReagentBottle',
      label: '5% Barium Chloride (BaCl₂)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.45)', label: 'BaCl₂ Sol' },
    },
    {
      id: 'rubber-cork',
      component: 'RubberCork',
      label: 'Airtight Rubber Cork',
      icon: '🪵',
      initialProps: { width: 45, height: 35 },
    },
    {
      id: 'digital-balance',
      component: 'DigitalBalance',
      label: 'Analytical Balance (0.01 g)',
      icon: '⚖️',
      initialProps: { width: 145, height: 100, massGrams: 0.00, label: '0.00 g' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'bench-flask-zone',
      label: 'Bench Workspace',
      accepts: ['conical-flask'],
      position: { x: 30, y: 65 },
      size: { width: 22, height: 30 },
      rejectMessage: 'Place the conical flask on the workbench.',
    },
    {
      id: 'balance-pan-zone',
      label: 'Weighing Pan on Digital Balance',
      accepts: ['conical-flask'],
      position: { x: 70, y: 60 },
      size: { width: 24, height: 32 },
      rejectMessage: 'Place the sealed flask onto the balance weighing pan.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask',
      accepts: ['na2so4-bottle', 'ignition-tube', 'rubber-cork'],
      position: { x: 30, y: 46 },
      size: { width: 18, height: 22 },
      rejectMessage: 'Add reagent or insert ignition tube into flask mouth.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
    },
  ],

  bench: {
    backgroundElements: [],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-flask',
      label: 'Place Flask on Bench',
      instruction: 'Drag the 250 mL conical flask onto the bench workspace.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'add-solutions',
      label: 'Add Na₂SO₄ & Hang BaCl₂',
      instruction: 'Pour 5 mL Na₂SO₄ solution into the flask, then hang the 5 mL BaCl₂ ignition tube inside by thread without mixing.',
      requiredActions: ['added-na2so4', 'hung-bacl2'],
      type: 'lab',
    },
    {
      id: 'seal-flask',
      label: 'Cork Flask Airtight',
      instruction: 'Insert the airtight rubber cork to ensure a strictly closed chemical system.',
      requiredActions: ['sealed-flask'],
      type: 'lab',
    },
    {
      id: 'weigh-m1',
      label: 'Weigh Reactants (m₁)',
      instruction: 'Drag the sealed flask onto the digital balance and note initial mass m₁.',
      requiredActions: ['weighed-m1'],
      type: 'lab',
    },
    {
      id: 'mix-reactants',
      label: 'Tilt & Mix Reactants',
      instruction: 'Tilt and swirl the flask to mix BaCl₂ and Na₂SO₄. Observe the immediate dense white precipitate of BaSO₄ forming.',
      requiredActions: ['mixed-reactants'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'weigh-m2',
      label: 'Weigh Products (m₂)',
      instruction: 'Place the flask back on the balance and note final mass m₂. Notice that m₂ = m₁.',
      requiredActions: ['weighed-m2'],
      type: 'lab',
    },
    {
      id: 'calculation',
      label: 'Mass Balance Verification',
      instruction: 'Enter m₁ and m₂ to calculate Δm and verify the Law of Conservation of Mass.',
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
      id: 'place-flask-act',
      trigger: { type: 'drop', source: 'conical-flask', target: 'bench-flask-zone' },
      effects: [{ type: 'placeApparatus', apparatusId: 'conical-flask', zoneId: 'bench-flask-zone' }],
      completesAction: 'place-flask',
    },
    {
      id: 'add-na2so4-act',
      trigger: { type: 'drop', source: 'na2so4-bottle', target: 'flask-mouth-zone' },
      effects: [
        { type: 'setFlag', key: 'hasNa2SO4', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '5 mL Na₂SO₄ Sol' },
      ],
      completesAction: 'added-na2so4',
    },
    {
      id: 'hang-bacl2-act',
      trigger: { type: 'drop', source: 'ignition-tube', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'hasNa2SO4', equals: true }],
      blockMessage: 'Add Na₂SO₄ solution to the flask first.',
      effects: [
        { type: 'setFlag', key: 'tubeHung', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Na₂SO₄ (flask) + BaCl₂ (suspended tube)' },
      ],
      completesAction: 'hung-bacl2',
    },
    {
      id: 'cork-flask-act',
      trigger: { type: 'drop', source: 'rubber-cork', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'tubeHung', equals: true }],
      blockMessage: 'Suspend the BaCl₂ ignition tube first.',
      effects: [
        { type: 'setFlag', key: 'flaskSealed', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sealed Closed System' },
      ],
      completesAction: 'sealed-flask',
    },
    {
      id: 'weigh-m1-act',
      trigger: { type: 'drop', source: 'conical-flask', target: 'balance-pan-zone' },
      conditions: [{ type: 'flag', key: 'flaskSealed', equals: true }],
      blockMessage: 'Seal the flask with the rubber cork before weighing.',
      guard: {
        condition: { type: 'flag', key: 'm1Recorded', equals: true },
        message: 'Initial mass m₁ already recorded.',
      },
      effects: [
        { type: 'setFlag', key: 'm1Recorded', value: true },
        { type: 'setVariable', key: 'm1', value: 238.45 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 238.45 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: 'm₁ = 238.45 g' },
      ],
      completesAction: 'weighed-m1',
    },
    {
      id: 'mix-reactants-btn',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [{ type: 'flag', key: 'm1Recorded', equals: true }],
      effects: [
        { type: 'setFlag', key: 'reactantsMixed', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: '#ffffff' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'BaSO₄↓ (White Precipitate) + 2NaCl' },
      ],
      completesAction: 'mixed-reactants',
    },
    {
      id: 'weigh-m2-act',
      trigger: { type: 'drop', source: 'conical-flask', target: 'balance-pan-zone' },
      conditions: [{ type: 'flag', key: 'reactantsMixed', equals: true }],
      blockMessage: 'Mix reactants to form precipitate first.',
      effects: [
        { type: 'setFlag', key: 'm2Recorded', value: true },
        { type: 'setVariable', key: 'm2', value: 238.45 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 238.45 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: 'm₂ = 238.45 g (Δm = 0.00 g)' },
      ],
      completesAction: 'weighed-m2',
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'BaCl2(aq) + Na2SO4(aq) -> BaSO4(s)v + 2NaCl(aq)',
    reactionType: 'Precipitation / Double Displacement',
    constants: {
      m1: 238.45,
      m2: 238.45,
      deltaM: 0.0,
    },
  },

  // ── Calculation ──
  calculation: {
    title: 'Mass Balance Verification',
    instruction:
      'Verify mass invariance: Mass of Reactants (m₁) = Mass of Products (m₂).\n' +
      'Calculate mass difference: Δm = m₂ - m₁.',
    fields: [
      {
        id: 'm1',
        label: 'Initial Mass m₁ (Reactants + Flask)',
        unit: 'g',
        expectedValue: 238.45,
        tolerance: 0.05,
        toleranceType: 'absolute',
      },
      {
        id: 'm2',
        label: 'Final Mass m₂ (Products + Flask)',
        unit: 'g',
        expectedValue: 238.45,
        tolerance: 0.05,
        toleranceType: 'absolute',
      },
      {
        id: 'deltaM',
        label: 'Mass Difference Δm = m₂ - m₁',
        unit: 'g',
        expectedValue: 0.00,
        tolerance: 0.02,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Viva ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'Who experimentally formulated the Law of Conservation of Mass?',
        options: ['John Dalton', 'Antoine Lavoisier', 'Joseph Proust', 'Amedeo Avogadro'],
        correctIndex: 1,
        explanation: 'Antoine Lavoisier showed through precise quantitative combustion and precipitation reactions that mass is conserved in chemical reactions.',
      },
      {
        id: 'q2',
        question: 'What is the chemical identity of the white precipitate formed upon mixing?',
        options: ['Barium chloride (BaCl₂)', 'Sodium chloride (NaCl)', 'Barium sulphate (BaSO₄)', 'Sodium sulphate (Na₂SO₄)'],
        correctIndex: 2,
        explanation: 'Ba²⁺ and SO₄²⁻ ions combine to precipitate insoluble white Barium Sulphate (BaSO₄↓).',
      },
      {
        id: 'q3',
        question: 'Why must the conical flask be tightly sealed with a cork before and after mixing?',
        options: [
          'To keep the glassware clean',
          'To prevent any matter, vapours, or gases from entering or escaping the closed system',
          'To accelerate the precipitation reaction rate',
          'To increase the measured gravitational weight',
        ],
        correctIndex: 1,
        explanation: 'A closed system ensures that no matter is exchanged with the surroundings, allowing rigorous verification that mass remains constant.',
      },
      {
        id: 'q4',
        question: 'If a student observes a mass decrease Δm = −4.5 g after reaction, what is the most probable cause?',
        options: [
          'The Law of Conservation of Mass does not apply here',
          'The flask was not corked airtight or was weighed carelessly',
          'The precipitate destroyed mass during bond formation',
          'The reaction did not proceed to completion',
        ],
        correctIndex: 1,
        explanation: 'Mass is invariant in ordinary chemical reactions. Any measurable mass change indicates experimental error, such as vapour escape or inaccurate taring.',
      },
    ],
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Glassware Setup & Sealing',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'flaskSealed', truePoints: 20 },
    },
    {
      name: 'Initial Weighing (m₁)',
      maxPoints: 40,
      evaluator: { type: 'booleanCheck', flag: 'm1Recorded', truePoints: 40 },
    },
    {
      name: 'Reaction & Final Weighing (m₂)',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'm2Recorded', truePoints: 25 },
    },
    {
      name: 'Viva Voce Evaluation',
      maxPoints: 15,
      evaluator: { type: 'booleanCheck', flag: 'reactantsMixed', truePoints: 15 },
    },
  ],
  validation: [],
};
