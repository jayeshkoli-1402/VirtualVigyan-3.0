/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Reaction of Zinc with Dilute Sulphuric Acid
 *  NCERT Class 10 — Chemical Reactions and Equations
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Zn + H₂SO₄ → ZnSO₄ + H₂↑
 *  Single displacement reaction. Hydrogen gas is evolved.
 *
 *  This experiment uses the NEW data-driven engine architecture.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../engine/experimentConfig';

export const zincAcidReaction: ExperimentConfig = {
  id: 'zinc-acid-reaction',
  title: 'Zinc + Dilute Sulphuric Acid',
  subtitle: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑',
  description:
    'Observe the reaction of zinc granules with dilute sulphuric acid. Identify the gas evolved by testing with a burning matchstick.',
  class: 10,
  subject: 'Chemistry',
  chapter: 'Chemical Reactions and Equations',
  difficulty: 'easy',
  themeColor: '#d97706',
  icon: '⚡',
  estimatedMinutes: 8,

  // ── Apparatus ──
  apparatus: [
    { id: 'test-tube', component: 'TestTube', label: 'Test Tube', icon: '🧪' },
    { id: 'zinc', component: 'ReagentBottle', label: 'Zinc Granules', icon: '🪨',
      initialProps: { liquidColor: '#64748b', label: 'Zn' } },
    { id: 'h2so4-bottle', component: 'ReagentBottle', label: 'Dilute H₂SO₄', icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.65)', label: 'Dil. H₂SO₄' } },
    { id: 'matchstick', component: 'Matchstick', label: 'Burning Matchstick', icon: '🔥' },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'tube-stand-zone',
      label: 'Place on Test Tube Stand',
      accepts: ['test-tube'],
      position: { x: 50, y: 56 },
      size: { width: 22, height: 44 },
      rejectMessage: 'Only the test tube goes on the stand.',
    },
    {
      id: 'tube-zone',
      label: 'Into Test Tube',
      accepts: ['zinc', 'h2so4-bottle', 'matchstick'],
      position: { x: 50, y: 38 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Drop the reagent into the test tube mouth.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      { component: 'TestTubeStand', position: { x: 50, y: 66 }, scale: 1.0 },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup',
      label: 'Set Up',
      instruction: 'Drag the test tube onto the test tube stand.',
      requiredActions: ['place-test-tube'],
      type: 'lab',
    },
    {
      id: 'add-zinc',
      label: 'Add Zinc',
      instruction: 'Drag the zinc granules into the test tube.',
      requiredActions: ['add-zinc'],
      type: 'lab',
    },
    {
      id: 'add-acid',
      label: 'Add Acid',
      instruction: 'Drag the dilute H₂SO₄ bottle onto the test tube to pour acid.',
      requiredActions: ['pour-acid'],
      type: 'lab',
    },
    {
      id: 'observe',
      label: 'Observe Reaction',
      instruction: 'Observe the vigorous bubbling as hydrogen gas is evolved. The zinc dissolves forming ZnSO₄ solution. Click "Continue" when you have observed.',
      requiredActions: [],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-gas',
      label: 'Test the Gas',
      instruction: 'Drag the burning matchstick near the mouth of the test tube to test the gas.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'popSoundHeard', equals: true },
          instruction: '💥 POP sound observed! Hydrogen gas burns with a characteristic pop sound. Click "Proceed to Questions" to finish the lab observations.',
        },
      ],
      requiredActions: ['test-gas'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: 'Questions & Calculations',
      instruction: 'Answer the questions and calculations based on your observations.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: 'Results & Score',
      instruction: 'Review your detailed score breakdown.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    // Place test tube on stand
    {
      id: 'interaction-place-tube',
      trigger: { type: 'drop', source: 'test-tube', target: 'tube-stand-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'test-tube', zoneId: 'tube-stand-zone' },
      ],
      completesAction: 'place-test-tube',
    },
    // Add zinc granules to test tube
    {
      id: 'interaction-add-zinc',
      trigger: { type: 'drop', source: 'zinc', target: 'tube-zone' },
      conditions: [
        { type: 'apparatusPlaced', apparatusId: 'test-tube' },
      ],
      blockMessage: 'Place the test tube on the stand first.',
      guard: {
        condition: { type: 'flag', key: 'zincAdded', equals: true },
        message: 'Zinc granules are already in the test tube.',
      },
      effects: [
        { type: 'setFlag', key: 'zincAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'test-tube', prop: 'hasZinc', value: true },
      ],
      completesAction: 'add-zinc',
      animation: {
        type: 'pour',
        durationMs: 800,
        animatingFlag: 'isAddingZinc',
      },
    },
    // Pour acid into test tube
    {
      id: 'interaction-pour-acid',
      trigger: { type: 'drop', source: 'h2so4-bottle', target: 'tube-zone' },
      conditions: [
        { type: 'flag', key: 'zincAdded', equals: true },
      ],
      blockMessage: 'Add zinc granules to the test tube first before adding acid.',
      guard: {
        condition: { type: 'flag', key: 'acidAdded', equals: true },
        message: 'Acid has already been added.',
      },
      effects: [
        { type: 'setFlag', key: 'acidAdded', value: true },
        { type: 'setFlag', key: 'reactionStarted', value: true },
        { type: 'setFlag', key: 'gasEvolving', value: true },
        { type: 'setApparatusProp', apparatusId: 'test-tube', prop: 'liquidLevel', value: 0.58 },
        { type: 'setApparatusProp', apparatusId: 'test-tube', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.65)' },
        { type: 'setApparatusProp', apparatusId: 'test-tube', prop: 'isReacting', value: true },
      ],
      completesAction: 'pour-acid',
      animation: {
        type: 'pour',
        durationMs: 1200,
        animatingFlag: 'isPouringAcid',
        effectsAfterAnimation: true,
      },
    },
    // Observation step — completed by clicking "Continue" button
    {
      id: 'interaction-observe',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [
        { type: 'flag', key: 'reactionStarted', equals: true },
      ],
      effects: [
        { type: 'setFlag', key: 'observationDone', value: true },
      ],
      completesAction: 'observation-done',
    },
    // Test gas with matchstick
    {
      id: 'interaction-test-gas',
      trigger: { type: 'drop', source: 'matchstick', target: 'tube-zone' },
      conditions: [
        { type: 'flag', key: 'gasEvolving', equals: true },
      ],
      blockMessage: 'The reaction must be producing gas before you can test it.',
      effects: [
        { type: 'setFlag', key: 'gasTested', value: true },
        { type: 'setFlag', key: 'popSoundHeard', value: true },
        { type: 'setApparatusProp', apparatusId: 'test-tube', prop: 'popEffect', value: true },
        { type: 'setVariable', key: '_gasIdentified', value: 1 },
      ],
      completesAction: 'test-gas',
      animation: {
        type: 'color-change',
        durationMs: 600,
        animatingFlag: 'isTestingGas',
      },
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑',
    reactionType: 'Single Displacement',
    constants: {
      zincMass: 0.5,        // grams
      acidVolume: 10,       // mL
      acidMolarity: 1.0,    // M (dilute, in excess over Zn)
    },
    formulas: {
      molesFromMass: {
        label: 'Moles of H₂ evolved',
        displayFormula: 'n(H₂) = n(Zn) = mass(Zn) / M(Zn) = 0.5 / 65.38',
        computeFn: 'molesFromMass',
        inputs: ['sampleMass', 'molarMass'],
        unit: 'mol',
      },
      hydrogenMolarMass: {
        label: 'Molar Mass of Hydrogen Gas (H₂)',
        displayFormula: 'M(H₂) = 2 × 1.008 g/mol',
        computeFn: 'hydrogenMolarMass',
        inputs: [],
        unit: 'g/mol',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: 'Reaction Questions & Calculations',
    instruction:
      'From your lab observations, Zinc reacted with dilute Sulphuric Acid according to:\n' +
      'Zn (s) + H₂SO₄ (aq) → ZnSO₄ (aq) + H₂ (g)↑\n\n' +
      'The balanced equation shows a 1:1 mole ratio between Zn and H₂.\n' +
      'Since the acid is present in excess, the theoretical moles of H₂ produced equal the moles of Zn consumed:\n\n' +
      'n(H₂) = n(Zn) = mass(Zn) / M(Zn)',
    fields: [
      {
        id: 'molesProduced',
        label: '1. Calculate the theoretical moles of H₂ gas produced: n(H₂) = 0.50 g / 65.38 g/mol. Enter the calculated value:',
        placeholder: 'Enter calculated moles',
        unit: 'mol',
        expectedFormulaName: 'molesFromMass',
        tolerance: 0.001,
        toleranceType: 'absolute',
      },
      {
        id: 'gasMolarMass',
        label: '2. Calculate the molar mass of Hydrogen gas (H₂): M(H₂) = 2 × 1.008 g/mol. Enter the calculated value:',
        placeholder: 'Enter molar mass',
        unit: 'g/mol',
        expectedFormulaName: 'hydrogenMolarMass',
        tolerance: 0.02,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric (Total = 100 points) ──
  scoring: [
    {
      name: 'Apparatus Placement',
      maxPoints: 20,
      evaluator: {
        type: 'booleanCheck',
        flag: 'zincAdded',
        truePoints: 20,
      },
    },
    {
      name: 'Reaction Observation',
      maxPoints: 20,
      evaluator: {
        type: 'booleanCheck',
        flag: 'reactionStarted',
        truePoints: 20,
      },
    },
    {
      name: 'Gas Pop Test',
      maxPoints: 20,
      evaluator: {
        type: 'booleanCheck',
        flag: 'popSoundHeard',
        truePoints: 20,
      },
    },
    {
      name: 'Moles Calculation',
      maxPoints: 20,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'molesProduced',
        correctPoints: 20,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Gas Molar Mass',
      maxPoints: 20,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'gasMolarMass',
        correctPoints: 20,
        incorrectPoints: 0,
      },
    },
  ],


  // ── Validation ──
  validation: [
    {
      id: 'acid-before-zinc',
      trigger: 'drop:h2so4-bottle→tube-zone',
      condition: { type: 'flag', key: 'zincAdded', equals: false },
      message: 'Add zinc granules to the test tube first, then pour the acid.',
      blocking: true,
    },
    {
      id: 'matchstick-before-reaction',
      trigger: 'drop:matchstick→tube-zone',
      condition: { type: 'flag', key: 'reactionStarted', equals: false },
      message: 'Start the reaction first — add zinc and acid before testing the gas.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    sampleMass: 0.5,
    molarMass: 65.38,
    acidVolume: 10,
    acidMolarity: 1.0,
  },
  initialFlags: {
    zincAdded: false,
    acidAdded: false,
    reactionStarted: false,
    gasEvolving: false,
    gasTested: false,
    popSoundHeard: false,
    observationDone: false,
  },
};
