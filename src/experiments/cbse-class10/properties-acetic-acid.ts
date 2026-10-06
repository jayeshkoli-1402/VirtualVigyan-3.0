/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Study of the Properties of Acetic Acid
 *  CBSE Class 10 Science — Carbon and its Compounds (Exp 10.5)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Study the properties of ethanoic acid (acetic acid):
 *  1. Odour (pungent vinegar smell)
 *  2. Solubility in water (completely miscible)
 *  3. Action on litmus (turns blue litmus red)
 *  4. Reaction with NaHCO₃ (brisk effervescence of CO₂; lime water turns milky)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const propertiesAceticAcid: ExperimentConfig = {
  id: 'properties-acetic-acid',
  title: 'Study of the Properties of Acetic Acid',
  subtitle: 'Odour, Solubility, Litmus Test and Reaction with NaHCO₃',
  description:
    'Investigate ethanoic acid (acetic acid) by examining its characteristic vinegar aroma, complete solubility in water, acidic action on blue litmus, and brisk CO₂ effervescence with sodium hydrogen carbonate.',
  class: 10,
  subject: 'Chemistry',
  chapter: 'Carbon and its Compounds',
  difficulty: 'easy',
  themeColor: '#10b981',
  icon: '🌿',
  estimatedMinutes: 20,
  underDevelopment: true,
  adminOnly: true,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'tube-acetic',
      component: 'TestTube',
      label: 'Tube 1: Acetic Acid (CH₃COOH)',
      icon: '🧪',
      initialProps: { width: 40, height: 145, liquidLevel: 0.35, liquidColor: 'rgba(241, 245, 249, 0.7)', label: 'CH₃COOH Sample' },
    },
    {
      id: 'tube-limewater',
      component: 'TestTube',
      label: 'Tube 2: Fresh Lime Water',
      icon: '🥛',
      initialProps: { width: 40, height: 145, liquidLevel: 0.45, liquidColor: 'rgba(241, 245, 249, 0.75)', label: 'Lime Water' },
    },
    {
      id: 'water-bottle',
      component: 'ReagentBottle',
      label: 'Distilled Water',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.75)', label: 'Distilled H₂O' },
    },
    {
      id: 'blue-litmus',
      component: 'WatchGlass',
      label: 'Blue Litmus Paper Strip',
      icon: '🟦',
      initialProps: { width: 90, height: 45, label: 'Blue Litmus' },
    },
    {
      id: 'nahco3-bottle',
      component: 'ReagentBottle',
      label: 'Solid Sodium Hydrogen Carbonate (NaHCO₃)',
      icon: '🧂',
      initialProps: { liquidColor: '#f8fafc', label: 'Solid NaHCO₃' },
    },
    {
      id: 'glass-rod',
      component: 'GlassRod',
      label: 'Glass Rod (for Litmus Test)',
      icon: '🥢',
      initialProps: { width: 14, height: 160 },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stand-slot-1',
      label: 'Tube 1 Stand Position (Acetic Acid)',
      accepts: ['tube-acetic', 'water-bottle', 'nahco3-bottle', 'glass-rod'],
      position: { x: 32, y: 60 },
      size: { width: 16, height: 30 },
      rejectMessage: 'Place Tube 1 in the stand on the left.',
    },
    {
      id: 'stand-slot-2',
      label: 'Tube 2 Stand Position (Lime Water)',
      accepts: ['tube-limewater'],
      position: { x: 55, y: 60 },
      size: { width: 16, height: 30 },
      rejectMessage: 'Place the Lime Water tube in the stand on the right.',
    },
    {
      id: 'bench-litmus-zone',
      label: 'Place Litmus Paper on Bench',
      accepts: ['blue-litmus', 'glass-rod'],
      position: { x: 78, y: 65 },
      size: { width: 18, height: 25 },
      rejectMessage: 'Place the blue litmus paper strip on the bench area.',
    },
  ],

  bench: {
    backgroundElements: [
      {
        component: 'TestTubeStand',
        position: { x: 44, y: 68 },
        scale: 1.25,
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-tubes',
      label: '1. Setup Workstation',
      instruction: 'Place Tube 1 (Acetic Acid) and Tube 2 (Lime Water) into the stand, and place the Blue Litmus Paper on the bench.',
      requiredActions: ['place-tube-acetic', 'place-tube-limewater', 'place-litmus'],
      type: 'lab',
    },
    {
      id: 'test-odour-solubility',
      label: '2. Odour & Water Solubility',
      instruction:
        'Waft the vapours of acetic acid towards the nose (sharp vinegar aroma). Then add distilled water to Tube 1 and shake gently: observe complete miscibility forming a homogeneous solution.',
      requiredActions: ['waft-odour', 'add-water-solubility'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-litmus',
      label: '3. Action on Blue Litmus',
      instruction:
        'Dip the glass rod into the acetic acid in Tube 1, then touch the blue litmus paper. Observe blue litmus instantly turning red.',
      requiredActions: ['dip-rod-litmus'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-nahco3',
      label: '4. Reaction with NaHCO₃ & Lime Water Test',
      instruction:
        'Add a pinch of solid NaHCO₃ into Tube 1: observe brisk effervescence of CO₂ gas! The liberated gas passes into Tube 2 and turns lime water milky white (CaCO₃ precipitate).',
      requiredActions: ['add-nahco3'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '5. Observation Checklist & Deductions',
      instruction:
        'Record the findings for odour, solubility, litmus behavior, and nature of gas liberated with NaHCO₃.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '6. Lab Evaluation & Score',
      instruction: 'Review your laboratory scores, observations, and viva voce quiz performance.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'act-place-tube-acetic',
      trigger: { type: 'drop', source: 'tube-acetic', target: 'stand-slot-1' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-acetic', zoneId: 'stand-slot-1' },
        { type: 'setFlag', key: 'aceticTubePlaced', value: true },
      ],
      completesAction: 'place-tube-acetic',
    },
    {
      id: 'act-place-tube-limewater',
      trigger: { type: 'drop', source: 'tube-limewater', target: 'stand-slot-2' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-limewater', zoneId: 'stand-slot-2' },
        { type: 'setFlag', key: 'limeWaterPlaced', value: true },
      ],
      completesAction: 'place-tube-limewater',
    },
    {
      id: 'act-place-litmus',
      trigger: { type: 'drop', source: 'blue-litmus', target: 'bench-litmus-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'blue-litmus', zoneId: 'bench-litmus-zone' },
        { type: 'setFlag', key: 'litmusPaperPlaced', value: true },
      ],
      completesAction: 'place-litmus',
    },

    // 1. Waft odour
    {
      id: 'act-waft-odour',
      trigger: { type: 'click', elementId: 'tube-acetic' },
      effects: [
        { type: 'setFlag', key: 'odourNoted', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-acetic', prop: 'label', value: '👃 Sharp pungent vinegar-like odour wafted' },
      ],
      completesAction: 'waft-odour',
    },

    // 2. Solubility in water
    {
      id: 'act-water-solubility',
      trigger: { type: 'drop', source: 'water-bottle', target: 'stand-slot-1' },
      effects: [
        { type: 'setFlag', key: 'solubilityConfirmed', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-acetic', prop: 'liquidLevel', value: 0.65 },
        { type: 'setApparatusProp', apparatusId: 'tube-acetic', prop: 'liquidColor', value: 'rgba(238, 242, 255, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'tube-acetic', prop: 'label', value: 'Completely miscible with water (Clear solution)' },
      ],
      completesAction: 'add-water-solubility',
      animation: { type: 'mix', durationMs: 2500, animatingFlag: 'isDissolving' },
    },

    // 3. Litmus test
    {
      id: 'act-litmus-test',
      trigger: { type: 'drop', source: 'glass-rod', target: 'bench-litmus-zone' },
      conditions: [{ type: 'flag', key: 'litmusPaperPlaced', equals: true }],
      blockMessage: 'Place the blue litmus paper on the bench first.',
      effects: [
        { type: 'setFlag', key: 'litmusTurnedRed', value: true },
        { type: 'setApparatusProp', apparatusId: 'blue-litmus', prop: 'label', value: '🟥 Blue litmus turned RED (Acidic nature)' },
      ],
      completesAction: 'dip-rod-litmus',
      animation: { type: 'color-change', durationMs: 1800, animatingFlag: 'isTurningRed' },
    },

    // 4. Reaction with NaHCO3
    {
      id: 'act-nahco3-reaction',
      trigger: { type: 'drop', source: 'nahco3-bottle', target: 'stand-slot-1' },
      effects: [
        { type: 'setFlag', key: 'nahco3Reacted', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-acetic', prop: 'label', value: 'Brisk effervescence of CO₂ gas!' },
        { type: 'setApparatusProp', apparatusId: 'tube-limewater', prop: 'liquidColor', value: 'rgba(255, 255, 255, 0.95)' },
        { type: 'setApparatusProp', apparatusId: 'tube-limewater', prop: 'label', value: 'Lime Water: Turned MILKY (CaCO₃↓)' },
      ],
      completesAction: 'add-nahco3',
      animation: { type: 'bubble', durationMs: 3500, animatingFlag: 'isEffervescingCO2' },
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'CH3COOH + NaHCO3 -> CH3COONa + H2O + CO2; Ca(OH)2 + CO2 -> CaCO3 + H2O',
    reactionType: 'Carboxylic Acid Esterification & Neutralization with Bicarbonate',
    constants: {},
  },

  // ── Calculation / Observation Form ──
  calculation: {
    title: 'Acetic Acid Properties Observation Matrix',
    instruction:
      'Enter the correct numeric response for each observed property of ethanoic acid.',
    fields: [
      {
        id: 'prop_odour',
        label: 'Characteristic Odour: 1 = Vinegar-like, 2 = Rotten eggs, 3 = Ammonia',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'prop_solubility',
        label: 'Solubility in Water: 1 = Completely miscible/soluble, 2 = Insoluble/Two layers',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'prop_litmus',
        label: 'Action on Blue Litmus: 1 = Turns Red, 2 = Remains Blue',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'prop_gas',
        label: 'Gas evolved with NaHCO₃: 1 = CO₂ (turns lime water milky), 2 = H₂ (pops with splinter)',
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
        question: 'What is the characteristic odour of acetic acid very similar to?',
        options: ['Rotten eggs', 'Vinegar', 'Pungent ammonia', 'Camphor'],
        correctIndex: 1,
        explanation: 'Household vinegar is actually a 5–8% dilute aqueous solution of acetic (ethanoic) acid, giving it that familiar sharp, sour smell.',
      },
      {
        id: 'q2',
        question: 'Which gas is released when acetic acid reacts with sodium hydrogen carbonate (NaHCO₃)?',
        options: ['Hydrogen gas', 'Oxygen gas', 'Carbon dioxide gas', 'Nitrogen dioxide'],
        correctIndex: 2,
        explanation: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑. The liberated carbon dioxide gas turns lime water milky white.',
      },
      {
        id: 'q3',
        question: 'What is the functional group present in acetic acid?',
        options: ['Hydroxyl group (−OH)', 'Aldehyde group (−CHO)', 'Carboxyl group (−COOH)', 'Ketone group (−CO−)'],
        correctIndex: 2,
        explanation: 'Acetic acid (CH₃COOH) contains the carboxyl functional group (−COOH), classifying it as a carboxylic acid.',
      },
      {
        id: 'q4',
        question: 'Is acetic acid considered a strong or a weak acid in aqueous medium?',
        options: ['Strong acid', 'Weak acid', 'Neutral substance', 'Strong alkaline base'],
        correctIndex: 1,
        explanation: 'Acetic acid ionises only partially into acetate and hydronium ions in water (CH₃COOH ⇌ CH₃COO⁻ + H⁺), making it a typical weak organic acid.',
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
          { label: 'Tube 1 (Acetic acid) placed in stand', points: 7, flag: 'aceticTubePlaced' },
          { label: 'Tube 2 (Lime water) placed in stand', points: 7, flag: 'limeWaterPlaced' },
          { label: 'Blue litmus paper placed on bench', points: 6, flag: 'litmusPaperPlaced' },
        ],
      },
    },
    {
      name: 'Testing Technique & Observations',
      maxPoints: 40,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Acetic acid odour wafted safely', points: 10, flag: 'odourNoted' },
          { label: 'Water added & miscibility verified', points: 10, flag: 'solubilityConfirmed' },
          { label: 'Blue litmus tested (turned red)', points: 10, flag: 'litmusTurnedRed' },
          { label: 'NaHCO₃ added & lime water turned milky', points: 10, flag: 'nahco3Reacted' },
        ],
      },
    },
    {
      name: 'Observations and Conclusions Accuracy',
      maxPoints: 25,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Vinegar odour recorded (1)', points: 6, calcFieldId: 'prop_odour', expectedValue: 1, tolerance: 0.1 },
          { label: 'Water miscibility recorded (1)', points: 6, calcFieldId: 'prop_solubility', expectedValue: 1, tolerance: 0.1 },
          { label: 'Litmus turn red recorded (1)', points: 6, calcFieldId: 'prop_litmus', expectedValue: 1, tolerance: 0.1 },
          { label: 'CO₂ effervescence recorded (1)', points: 7, calcFieldId: 'prop_gas', expectedValue: 1, tolerance: 0.1 },
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
