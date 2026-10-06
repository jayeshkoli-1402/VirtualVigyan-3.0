/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Finding the pH of Common Samples
 *  CBSE Class 10 Science — Acids, Bases and Salts (Exp 10.1)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Determine the approximate pH of:
 *  1. Dilute HCl (pH ≈ 1-2, Red)
 *  2. Lemon Juice (pH ≈ 2-3, Red-Orange)
 *  3. Dilute Ethanoic Acid (CH₃COOH) (pH ≈ 3-4, Orange-Red)
 *  4. Distilled Water (pH ≈ 7, Green)
 *  5. Dilute Sodium Hydrogen Carbonate (NaHCO₃) (pH ≈ 8-9, Blue-Green)
 *  6. Dilute NaOH (pH ≈ 13-14, Dark Violet)
 *
 *  Classify each as acidic (pH < 7), neutral (pH = 7) or basic (pH > 7).
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const phCommonSamples: ExperimentConfig = {
  id: 'ph-common-samples',
  title: 'Finding the pH of Common Samples',
  subtitle: 'pH Scale: Acids, Bases and Neutral Samples',
  description:
    'Determine the approximate pH of dilute HCl, dilute NaOH, dilute ethanoic acid, lemon juice, distilled water and dilute NaHCO₃ using pH paper, and classify each sample.',
  class: 10,
  subject: 'Chemistry',
  chapter: 'Acids, Bases and Salts',
  difficulty: 'easy',
  themeColor: '#0284c7',
  icon: '🧪',
  estimatedMinutes: 20,
  underDevelopment: true,
  adminOnly: true,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'test-tube-stand',
      component: 'TestTubeStand',
      label: 'Test Tube Stand',
      icon: '🧪',
      initialProps: { width: 180, height: 95 },
    },
    {
      id: 'white-tile',
      component: 'WatchGlass',
      label: 'White Tile with pH Paper Strips',
      icon: '📄',
      initialProps: { width: 130, height: 65, label: 'pH Paper Tile' },
    },
    {
      id: 'glass-rod',
      component: 'GlassRod',
      label: 'Clean Glass Stirring Rod',
      icon: '🥢',
      initialProps: { width: 14, height: 160 },
    },
    {
      id: 'tube-hcl',
      component: 'TestTube',
      label: 'Sample 1: Dilute HCl',
      icon: '🧪',
      initialProps: { width: 36, height: 140, liquidLevel: 0.5, liquidColor: 'rgba(238, 242, 255, 0.7)', label: 'dil. HCl' },
    },
    {
      id: 'tube-lemon',
      component: 'TestTube',
      label: 'Sample 2: Lemon Juice',
      icon: '🍋',
      initialProps: { width: 36, height: 140, liquidLevel: 0.5, liquidColor: 'rgba(254, 240, 138, 0.85)', label: 'Lemon' },
    },
    {
      id: 'tube-ch3cooh',
      component: 'TestTube',
      label: 'Sample 3: Dil. Ethanoic Acid',
      icon: '🧪',
      initialProps: { width: 36, height: 140, liquidLevel: 0.5, liquidColor: 'rgba(241, 245, 249, 0.7)', label: 'CH₃COOH' },
    },
    {
      id: 'tube-water',
      component: 'TestTube',
      label: 'Sample 4: Distilled Water',
      icon: '💧',
      initialProps: { width: 36, height: 140, liquidLevel: 0.5, liquidColor: 'rgba(224, 242, 254, 0.7)', label: 'H₂O' },
    },
    {
      id: 'tube-nahco3',
      component: 'TestTube',
      label: 'Sample 5: Dil. NaHCO₃ Solution',
      icon: '🧪',
      initialProps: { width: 36, height: 140, liquidLevel: 0.5, liquidColor: 'rgba(240, 253, 250, 0.75)', label: 'NaHCO₃' },
    },
    {
      id: 'tube-naoh',
      component: 'TestTube',
      label: 'Sample 6: Dilute NaOH',
      icon: '🧪',
      initialProps: { width: 36, height: 140, liquidLevel: 0.5, liquidColor: 'rgba(245, 243, 255, 0.75)', label: 'dil. NaOH' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stand-zone',
      label: 'Place Stand on Bench',
      accepts: ['test-tube-stand'],
      position: { x: 30, y: 65 },
      size: { width: 28, height: 26 },
      rejectMessage: 'Place the test tube stand on the left bench area.',
    },
    {
      id: 'tile-zone',
      label: 'Place pH Tile on Bench',
      accepts: ['white-tile', 'glass-rod', 'tube-hcl', 'tube-lemon', 'tube-ch3cooh', 'tube-water', 'tube-nahco3', 'tube-naoh'],
      position: { x: 72, y: 65 },
      size: { width: 24, height: 26 },
      rejectMessage: 'Place the white tile with pH paper strips on the right bench area.',
    },
    {
      id: 'stand-slot-1',
      label: 'Stand Slot 1 (HCl)',
      accepts: ['tube-hcl'],
      position: { x: 20, y: 50 },
      size: { width: 10, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
    },
    {
      id: 'stand-slot-2',
      label: 'Stand Slot 2 (Lemon)',
      accepts: ['tube-lemon'],
      position: { x: 26, y: 50 },
      size: { width: 10, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
    },
    {
      id: 'stand-slot-3',
      label: 'Stand Slot 3 (Ethanoic Acid)',
      accepts: ['tube-ch3cooh'],
      position: { x: 32, y: 50 },
      size: { width: 10, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
    },
    {
      id: 'stand-slot-4',
      label: 'Stand Slot 4 (Water)',
      accepts: ['tube-water'],
      position: { x: 38, y: 50 },
      size: { width: 10, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
    },
    {
      id: 'stand-slot-5',
      label: 'Stand Slot 5 (NaHCO₃)',
      accepts: ['tube-nahco3'],
      position: { x: 44, y: 50 },
      size: { width: 10, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
    },
    {
      id: 'stand-slot-6',
      label: 'Stand Slot 6 (NaOH)',
      accepts: ['tube-naoh'],
      position: { x: 50, y: 50 },
      size: { width: 10, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
    },
  ],

  bench: {
    backgroundElements: [],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-apparatus',
      label: '1. Setup Stand & White Tile',
      instruction:
        'Place the test tube stand on the bench, place all 6 sample tubes in their stand slots, and position the white tile with pH paper strips on the bench.',
      requiredActions: ['place-stand', 'place-tile', 'place-tube-hcl', 'place-tube-lemon', 'place-tube-ch3cooh', 'place-tube-water', 'place-tube-nahco3', 'place-tube-naoh'],
      type: 'lab',
    },
    {
      id: 'test-acidic-samples',
      label: '2. Test Acidic Samples (HCl, Lemon, CH₃COOH)',
      instruction:
        'Dip the glass rod into Sample 1 (dilute HCl), then touch the pH paper on the white tile. Repeat with Sample 2 (Lemon Juice) and Sample 3 (Dilute Ethanoic Acid). Observe the color changes.',
      requiredActions: ['test-hcl', 'test-lemon', 'test-ch3cooh'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-neutral-basic-samples',
      label: '3. Test Water, NaHCO₃ & NaOH',
      instruction:
        'Clean the rod, then test Sample 4 (Distilled Water), Sample 5 (Dilute NaHCO₃) and Sample 6 (Dilute NaOH) on the pH paper. Observe green, blue-green, and dark violet colors.',
      requiredActions: ['test-water', 'test-nahco3', 'test-naoh'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '4. Observation & Classification Matrix',
      instruction:
        'Record the determined pH for each sample and classify each as Acidic (1), Neutral (2), or Basic (3).',
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
      id: 'act-place-stand',
      trigger: { type: 'drop', source: 'test-tube-stand', target: 'stand-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'test-tube-stand', zoneId: 'stand-zone' },
        { type: 'setFlag', key: 'standPlaced', value: true },
      ],
      completesAction: 'place-stand',
    },
    {
      id: 'act-place-tile',
      trigger: { type: 'drop', source: 'white-tile', target: 'tile-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'white-tile', zoneId: 'tile-zone' },
        { type: 'setFlag', key: 'tilePlaced', value: true },
      ],
      completesAction: 'place-tile',
    },
    {
      id: 'act-place-hcl',
      trigger: { type: 'drop', source: 'tube-hcl', target: 'stand-slot-1' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-hcl', zoneId: 'stand-slot-1' },
        { type: 'setFlag', key: 'hclPlaced', value: true },
      ],
      completesAction: 'place-tube-hcl',
    },
    {
      id: 'act-place-lemon',
      trigger: { type: 'drop', source: 'tube-lemon', target: 'stand-slot-2' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-lemon', zoneId: 'stand-slot-2' },
        { type: 'setFlag', key: 'lemonPlaced', value: true },
      ],
      completesAction: 'place-tube-lemon',
    },
    {
      id: 'act-place-ch3cooh',
      trigger: { type: 'drop', source: 'tube-ch3cooh', target: 'stand-slot-3' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-ch3cooh', zoneId: 'stand-slot-3' },
        { type: 'setFlag', key: 'ch3coohPlaced', value: true },
      ],
      completesAction: 'place-tube-ch3cooh',
    },
    {
      id: 'act-place-water',
      trigger: { type: 'drop', source: 'tube-water', target: 'stand-slot-4' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-water', zoneId: 'stand-slot-4' },
        { type: 'setFlag', key: 'waterPlaced', value: true },
      ],
      completesAction: 'place-tube-water',
    },
    {
      id: 'act-place-nahco3',
      trigger: { type: 'drop', source: 'tube-nahco3', target: 'stand-slot-5' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-nahco3', zoneId: 'stand-slot-5' },
        { type: 'setFlag', key: 'nahco3Placed', value: true },
      ],
      completesAction: 'place-tube-nahco3',
    },
    {
      id: 'act-place-naoh',
      trigger: { type: 'drop', source: 'tube-naoh', target: 'stand-slot-6' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-naoh', zoneId: 'stand-slot-6' },
        { type: 'setFlag', key: 'naohPlaced', value: true },
      ],
      completesAction: 'place-tube-naoh',
    },
    // Testing on pH tile
    {
      id: 'act-test-hcl',
      trigger: { type: 'drop', source: 'tube-hcl', target: 'tile-zone' },
      conditions: [{ type: 'flag', key: 'tilePlaced', equals: true }],
      blockMessage: 'Place the white tile with pH paper strips on the bench first.',
      effects: [
        { type: 'setFlag', key: 'testedHCl', value: true },
        { type: 'setApparatusProp', apparatusId: 'white-tile', prop: 'label', value: 'HCl spot: Red (pH ≈ 1)' },
      ],
      completesAction: 'test-hcl',
      animation: { type: 'color-change', durationMs: 1500, animatingFlag: 'isTestingHcl' },
    },
    {
      id: 'act-test-lemon',
      trigger: { type: 'drop', source: 'tube-lemon', target: 'tile-zone' },
      conditions: [{ type: 'flag', key: 'tilePlaced', equals: true }],
      blockMessage: 'Place the white tile with pH paper strips on the bench first.',
      effects: [
        { type: 'setFlag', key: 'testedLemon', value: true },
        { type: 'setApparatusProp', apparatusId: 'white-tile', prop: 'label', value: 'Lemon spot: Red-Orange (pH ≈ 2.5)' },
      ],
      completesAction: 'test-lemon',
      animation: { type: 'color-change', durationMs: 1500, animatingFlag: 'isTestingLemon' },
    },
    {
      id: 'act-test-ch3cooh',
      trigger: { type: 'drop', source: 'tube-ch3cooh', target: 'tile-zone' },
      conditions: [{ type: 'flag', key: 'tilePlaced', equals: true }],
      blockMessage: 'Place the white tile with pH paper strips on the bench first.',
      effects: [
        { type: 'setFlag', key: 'testedCH3COOH', value: true },
        { type: 'setApparatusProp', apparatusId: 'white-tile', prop: 'label', value: 'CH₃COOH spot: Orange-Red (pH ≈ 3.5)' },
      ],
      completesAction: 'test-ch3cooh',
      animation: { type: 'color-change', durationMs: 1500, animatingFlag: 'isTestingCH3COOH' },
    },
    {
      id: 'act-test-water',
      trigger: { type: 'drop', source: 'tube-water', target: 'tile-zone' },
      conditions: [{ type: 'flag', key: 'tilePlaced', equals: true }],
      blockMessage: 'Place the white tile with pH paper strips on the bench first.',
      effects: [
        { type: 'setFlag', key: 'testedWater', value: true },
        { type: 'setApparatusProp', apparatusId: 'white-tile', prop: 'label', value: 'Water spot: Green (pH ≈ 7)' },
      ],
      completesAction: 'test-water',
      animation: { type: 'color-change', durationMs: 1500, animatingFlag: 'isTestingWater' },
    },
    {
      id: 'act-test-nahco3',
      trigger: { type: 'drop', source: 'tube-nahco3', target: 'tile-zone' },
      conditions: [{ type: 'flag', key: 'tilePlaced', equals: true }],
      blockMessage: 'Place the white tile with pH paper strips on the bench first.',
      effects: [
        { type: 'setFlag', key: 'testedNaHCO3', value: true },
        { type: 'setApparatusProp', apparatusId: 'white-tile', prop: 'label', value: 'NaHCO₃ spot: Blue-Green (pH ≈ 8.5)' },
      ],
      completesAction: 'test-nahco3',
      animation: { type: 'color-change', durationMs: 1500, animatingFlag: 'isTestingNaHCO3' },
    },
    {
      id: 'act-test-naoh',
      trigger: { type: 'drop', source: 'tube-naoh', target: 'tile-zone' },
      conditions: [{ type: 'flag', key: 'tilePlaced', equals: true }],
      blockMessage: 'Place the white tile with pH paper strips on the bench first.',
      effects: [
        { type: 'setFlag', key: 'testedNaOH', value: true },
        { type: 'setApparatusProp', apparatusId: 'white-tile', prop: 'label', value: 'NaOH spot: Dark Violet (pH ≈ 13)' },
      ],
      completesAction: 'test-naoh',
      animation: { type: 'color-change', durationMs: 1500, animatingFlag: 'isTestingNaOH' },
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'pH = -log₁₀[H⁺]',
    reactionType: 'pH Measurement & Classification',
    constants: {
      pH_HCl: 1.0,
      pH_Lemon: 2.5,
      pH_CH3COOH: 3.5,
      pH_Water: 7.0,
      pH_NaHCO3: 8.5,
      pH_NaOH: 13.0,
    },
  },

  // ── Calculation / Observation Form ──
  calculation: {
    title: 'pH Readings and Acid-Base Classification',
    instruction:
      'Enter the approximate pH observed for each sample, and its Nature: 1 = Acidic (pH < 7), 2 = Neutral (pH = 7), 3 = Basic (pH > 7).',
    fields: [
      {
        id: 'ph_hcl',
        label: 'Approximate pH of Dilute HCl',
        unit: 'pH',
        expectedValue: 1.0,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Strong acid; turns pH paper red (pH ≈ 1)',
      },
      {
        id: 'nature_hcl',
        label: 'Nature of Dilute HCl (1=Acidic, 2=Neutral, 3=Basic)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_lemon',
        label: 'Approximate pH of Lemon Juice',
        unit: 'pH',
        expectedValue: 2.5,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Citric acid; turns pH paper red-orange (pH ≈ 2 to 3)',
      },
      {
        id: 'nature_lemon',
        label: 'Nature of Lemon Juice (1=Acidic, 2=Neutral, 3=Basic)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_ch3cooh',
        label: 'Approximate pH of Dilute Ethanoic Acid',
        unit: 'pH',
        expectedValue: 3.5,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Weak carboxylic acid; turns pH paper orange-red (pH ≈ 3 to 4)',
      },
      {
        id: 'nature_ch3cooh',
        label: 'Nature of Ethanoic Acid (1=Acidic, 2=Neutral, 3=Basic)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_water',
        label: 'Approximate pH of Distilled Water',
        unit: 'pH',
        expectedValue: 7.0,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Neutral pure water; turns pH paper green-yellow (pH ≈ 7)',
      },
      {
        id: 'nature_water',
        label: 'Nature of Distilled Water (1=Acidic, 2=Neutral, 3=Basic)',
        unit: '',
        expectedValue: 2,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_nahco3',
        label: 'Approximate pH of Dilute NaHCO₃',
        unit: 'pH',
        expectedValue: 8.5,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Bicarbonate salt solution; turns pH paper light blue-green (pH ≈ 8 to 9)',
      },
      {
        id: 'nature_nahco3',
        label: 'Nature of NaHCO₃ Solution (1=Acidic, 2=Neutral, 3=Basic)',
        unit: '',
        expectedValue: 3,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_naoh',
        label: 'Approximate pH of Dilute NaOH',
        unit: 'pH',
        expectedValue: 13.0,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Strong base; turns pH paper dark blue / violet (pH ≈ 13 to 14)',
      },
      {
        id: 'nature_naoh',
        label: 'Nature of Dilute NaOH (1=Acidic, 2=Neutral, 3=Basic)',
        unit: '',
        expectedValue: 3,
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
        question: 'What does pH primarily measure?',
        options: [
          'Concentration of hydroxide ions only',
          'Hydrogen ion concentration',
          'Temperature of the solution',
          'Density and viscosity',
        ],
        correctIndex: 1,
        explanation: 'pH is defined as pH = −log₁₀[H⁺]; a lower pH represents a higher concentration of hydrogen ions.',
      },
      {
        id: 'q2',
        question: 'Which of the tested common samples has the lowest pH value?',
        options: [
          'Distilled water',
          'Dilute sodium hydroxide',
          'Dilute hydrochloric acid',
          'Dilute sodium hydrogen carbonate',
        ],
        correctIndex: 2,
        explanation: 'Hydrochloric acid (HCl) is a strong mineral acid that completely dissociates, yielding a pH close to 1.',
      },
      {
        id: 'q3',
        question: 'Why is dilute ethanoic acid less acidic than dilute HCl of the same molar concentration?',
        options: [
          'It is a weak organic acid and ionises only partially',
          'It contains more free H⁺ ions',
          'It is actually an amphoteric base',
          'It is completely neutral in aqueous solution',
        ],
        correctIndex: 0,
        explanation: 'Ethanoic acid (CH₃COOH) is a weak acid. In aqueous solution, only a small fraction of molecules dissociate into H⁺ and CH₃COO⁻ ions.',
      },
      {
        id: 'q4',
        question: 'An aqueous solution of sodium hydrogen carbonate (NaHCO₃) is:',
        options: [
          'Strongly acidic',
          'Completely neutral',
          'Weakly basic',
          'Strongly basic',
        ],
        correctIndex: 2,
        explanation: 'NaHCO₃ is a salt of a strong base (NaOH) and a weak acid (H₂CO₃). Anionic hydrolysis of HCO₃⁻ creates excess OH⁻ ions, giving a pH around 8 to 9.',
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
          { label: 'Test tube stand placed on bench', points: 4, flag: 'standPlaced' },
          { label: 'pH paper tile placed on bench', points: 4, flag: 'tilePlaced' },
          { label: 'Acidic samples (HCl, Lemon, CH₃COOH) placed in stand', points: 6, action: 'place-tube-hcl' },
          { label: 'Neutral & basic samples (Water, NaHCO₃, NaOH) placed in stand', points: 6, action: 'place-tube-naoh' },
        ],
      },
    },
    {
      name: 'Correct Testing Technique',
      maxPoints: 40,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Sample 1 (dil. HCl) tested on pH paper', points: 7, flag: 'testedHCl' },
          { label: 'Sample 2 (Lemon juice) tested on pH paper', points: 7, flag: 'testedLemon' },
          { label: 'Sample 3 (Ethanoic acid) tested on pH paper', points: 7, flag: 'testedCH3COOH' },
          { label: 'Sample 4 (Distilled water) tested on pH paper', points: 6, flag: 'testedWater' },
          { label: 'Sample 5 (Dilute NaHCO₃) tested on pH paper', points: 6, flag: 'testedNaHCO3' },
          { label: 'Sample 6 (Dilute NaOH) tested on pH paper', points: 7, flag: 'testedNaOH' },
        ],
      },
    },
    {
      name: 'pH Values & Classification Accuracy',
      maxPoints: 25,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'HCl pH ≈ 1 ± 1 & classified Acidic', points: 5, calcFieldId: 'nature_hcl', expectedValue: 1, tolerance: 0.1 },
          { label: 'Lemon juice pH ≈ 2-3 & classified Acidic', points: 4, calcFieldId: 'nature_lemon', expectedValue: 1, tolerance: 0.1 },
          { label: 'Ethanoic acid pH ≈ 3-4 & classified Acidic', points: 4, calcFieldId: 'nature_ch3cooh', expectedValue: 1, tolerance: 0.1 },
          { label: 'Water pH ≈ 7 & classified Neutral', points: 4, calcFieldId: 'nature_water', expectedValue: 2, tolerance: 0.1 },
          { label: 'NaHCO₃ pH ≈ 8-9 & classified Basic', points: 4, calcFieldId: 'nature_nahco3', expectedValue: 3, tolerance: 0.1 },
          { label: 'NaOH pH ≈ 13-14 & classified Basic', points: 4, calcFieldId: 'nature_naoh', expectedValue: 3, tolerance: 0.1 },
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
      id: 'test-without-tile',
      trigger: 'drop:tube-hcl→tile-zone',
      condition: { type: 'flag', key: 'tilePlaced', equals: false },
      message: 'Place the white tile with pH paper strips on the bench first before testing samples.',
      blocking: true,
    },
  ],
};
