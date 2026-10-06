/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Finding the pH of Common Samples
 *  CBSE Class 10 Science — Acids, Bases and Salts (Exp 10.1)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Determine the approximate pH of:
 *  1. Dilute HCl (Sample A: pH ≈ 1-2, Red)
 *  2. Lemon Juice (Sample B: pH ≈ 2-3, Red-Orange)
 *  3. Dilute Ethanoic Acid / CH₃COOH (Sample C: pH ≈ 3-4, Orange)
 *  4. Distilled Water (Sample D: pH ≈ 7, Green)
 *  5. Dilute Sodium Hydrogen Carbonate / NaHCO₃ (Sample E: pH ≈ 8-9, Blue-Green)
 *  6. Dilute NaOH (Sample F: pH ≈ 13-14, Dark Violet)
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
    'Determine the approximate pH of dilute HCl, lemon juice, dilute ethanoic acid, distilled water, dilute NaHCO₃ and dilute NaOH using pH paper on a white glazed tile, and classify each sample as acidic, neutral, or basic.',
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
      initialProps: { width: 220, height: 110 },
    },
    {
      id: 'tube-a',
      component: 'TestTube',
      label: 'Clean Test Tube A',
      icon: '🧪',
      initialProps: { width: 34, height: 130, liquidLevel: 0, label: 'Tube A' },
    },
    {
      id: 'tube-b',
      component: 'TestTube',
      label: 'Clean Test Tube B',
      icon: '🧪',
      initialProps: { width: 34, height: 130, liquidLevel: 0, label: 'Tube B' },
    },
    {
      id: 'tube-c',
      component: 'TestTube',
      label: 'Clean Test Tube C',
      icon: '🧪',
      initialProps: { width: 34, height: 130, liquidLevel: 0, label: 'Tube C' },
    },
    {
      id: 'tube-d',
      component: 'TestTube',
      label: 'Clean Test Tube D',
      icon: '🧪',
      initialProps: { width: 34, height: 130, liquidLevel: 0, label: 'Tube D' },
    },
    {
      id: 'tube-e',
      component: 'TestTube',
      label: 'Clean Test Tube E',
      icon: '🧪',
      initialProps: { width: 34, height: 130, liquidLevel: 0, label: 'Tube E' },
    },
    {
      id: 'tube-f',
      component: 'TestTube',
      label: 'Clean Test Tube F',
      icon: '🧪',
      initialProps: { width: 34, height: 130, liquidLevel: 0, label: 'Tube F' },
    },
    {
      id: 'bottle-hcl',
      component: 'ReagentBottle',
      label: 'Sample 1: Dilute HCl',
      icon: '🧴',
      initialProps: { width: 44, height: 75, liquidLevel: 0.8, liquidColor: 'rgba(238, 242, 255, 0.75)', label: 'dil. HCl (A)' },
    },
    {
      id: 'bottle-lemon',
      component: 'ReagentBottle',
      label: 'Sample 2: Lemon Juice',
      icon: '🍋',
      initialProps: { width: 44, height: 75, liquidLevel: 0.8, liquidColor: 'rgba(254, 240, 138, 0.85)', label: 'Lemon (B)' },
    },
    {
      id: 'bottle-ch3cooh',
      component: 'ReagentBottle',
      label: 'Sample 3: Dil. Ethanoic Acid',
      icon: '🧴',
      initialProps: { width: 44, height: 75, liquidLevel: 0.8, liquidColor: 'rgba(241, 245, 249, 0.75)', label: 'CH₃COOH (C)' },
    },
    {
      id: 'bottle-water',
      component: 'ReagentBottle',
      label: 'Sample 4: Distilled Water',
      icon: '💧',
      initialProps: { width: 44, height: 75, liquidLevel: 0.8, liquidColor: 'rgba(224, 242, 254, 0.75)', label: 'Dist. H₂O (D)' },
    },
    {
      id: 'bottle-nahco3',
      component: 'ReagentBottle',
      label: 'Sample 5: Dil. NaHCO₃ Soln',
      icon: '🧴',
      initialProps: { width: 44, height: 75, liquidLevel: 0.8, liquidColor: 'rgba(240, 253, 250, 0.75)', label: 'NaHCO₃ (E)' },
    },
    {
      id: 'bottle-naoh',
      component: 'ReagentBottle',
      label: 'Sample 6: Dilute NaOH',
      icon: '🧴',
      initialProps: { width: 44, height: 75, liquidLevel: 0.8, liquidColor: 'rgba(245, 243, 255, 0.75)', label: 'dil. NaOH (F)' },
    },
    {
      id: 'white-tile',
      component: 'WhiteTile',
      label: 'White Tile with pH Paper Strips',
      icon: '📄',
      initialProps: { width: 260, height: 125, label: 'pH Paper Tile (Strips A–F)' },
    },
    {
      id: 'glass-rod',
      component: 'GlassRod',
      label: 'Clean Glass Stirring Rod',
      icon: '🥢',
      initialProps: { width: 14, height: 160 },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stand-zone',
      label: 'Place Stand on Bench',
      accepts: ['test-tube-stand'],
      position: { x: 28, y: 68 },
      size: { width: 28, height: 26 },
      rejectMessage: 'Place the test tube stand on the left bench area.',
    },
    {
      id: 'stand-slot-a',
      label: 'Stand Position A (HCl)',
      accepts: ['tube-a', 'bottle-hcl', 'glass-rod'],
      position: { x: 16, y: 52 },
      size: { width: 8, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
      rejectMessage: 'Place Tube A or add Dilute HCl into Test Tube A.',
    },
    {
      id: 'stand-slot-b',
      label: 'Stand Position B (Lemon)',
      accepts: ['tube-b', 'bottle-lemon', 'glass-rod'],
      position: { x: 21, y: 52 },
      size: { width: 8, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
      rejectMessage: 'Place Tube B or add Lemon Juice into Test Tube B.',
    },
    {
      id: 'stand-slot-c',
      label: 'Stand Position C (CH₃COOH)',
      accepts: ['tube-c', 'bottle-ch3cooh', 'glass-rod'],
      position: { x: 26, y: 52 },
      size: { width: 8, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
      rejectMessage: 'Place Tube C or add Dilute Ethanoic Acid into Test Tube C.',
    },
    {
      id: 'stand-slot-d',
      label: 'Stand Position D (Water)',
      accepts: ['tube-d', 'bottle-water', 'glass-rod'],
      position: { x: 31, y: 52 },
      size: { width: 8, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
      rejectMessage: 'Place Tube D or add Distilled Water into Test Tube D.',
    },
    {
      id: 'stand-slot-e',
      label: 'Stand Position E (NaHCO₃)',
      accepts: ['tube-e', 'bottle-nahco3', 'glass-rod'],
      position: { x: 36, y: 52 },
      size: { width: 8, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
      rejectMessage: 'Place Tube E or add Dilute NaHCO₃ into Test Tube E.',
    },
    {
      id: 'stand-slot-f',
      label: 'Stand Position F (NaOH)',
      accepts: ['tube-f', 'bottle-naoh', 'glass-rod'],
      position: { x: 41, y: 52 },
      size: { width: 8, height: 28 },
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'test-tube-stand' },
      rejectMessage: 'Place Tube F or add Dilute NaOH into Test Tube F.',
    },
    {
      id: 'tile-zone',
      label: 'Place White Tile on Bench',
      accepts: [
        'white-tile',
        'glass-rod',
        'tube-a',
        'tube-b',
        'tube-c',
        'tube-d',
        'tube-e',
        'tube-f',
      ],
      position: { x: 74, y: 68 },
      size: { width: 28, height: 26 },
      rejectMessage: 'Place the white glazed tile with pH paper strips on the right bench area.',
    },
  ],

  bench: {
    backgroundElements: [
      {
        component: 'PHColorChart',
        position: { x: 74, y: 22 },
        scale: 0.95,
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-stand-tubes',
      label: '1. Arrange Stand & Place Test Tubes A–F',
      instruction:
        'Place the test tube stand on the bench, then place all 6 clean test tubes into their corresponding positions labelled A, B, C, D, E, and F.',
      requiredActions: [
        'place-stand',
        'place-tube-a',
        'place-tube-b',
        'place-tube-c',
        'place-tube-d',
        'place-tube-e',
        'place-tube-f',
      ],
      type: 'lab',
    },
    {
      id: 'add-samples',
      label: '2. Add 2 mL Sample Solutions into Tubes A–F',
      instruction:
        'Add ~2 mL of each sample solution from its reagent bottle into its correctly labelled test tube (A: Dil. HCl, B: Lemon Juice, C: Dil. Ethanoic Acid, D: Distilled Water, E: Dil. NaHCO₃, F: Dil. NaOH).',
      requiredActions: [
        'fill-tube-a',
        'fill-tube-b',
        'fill-tube-c',
        'fill-tube-d',
        'fill-tube-e',
        'fill-tube-f',
      ],
      type: 'lab',
    },
    {
      id: 'prepare-tile',
      label: '3. Prepare White Glazed Tile with pH Paper',
      instruction:
        'Place the clean white glazed porcelain tile with 6 dry pH paper strips (strips A, B, C, D, E, and F) on the right bench area.',
      requiredActions: ['place-tile'],
      type: 'lab',
    },
    {
      id: 'test-samples-ph',
      label: '4. Transfer Samples to pH Paper Strips A–F',
      instruction:
        'Transfer 1–2 drops of each sample solution onto its corresponding pH paper strip on the white tile (Tube A → Strip A, Tube B → Strip B, Tube C → Strip C, Tube D → Strip D, Tube E → Strip E, Tube F → Strip F). Observe the instant color development.',
      requiredActions: [
        'test-a',
        'test-b',
        'test-c',
        'test-d',
        'test-e',
        'test-f',
      ],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '5. Observation & Acid-Base Classification Matrix',
      instruction:
        'Compare the developed color on each pH strip with the Standard pH Color Reference Chart. Record the approximate pH and classify each solution as Acidic (1), Neutral (2), or Basic (3).',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '6. Lab Evaluation & Viva Voce Quiz',
      instruction: 'Review your laboratory accuracy, scoring breakdown, and viva voce quiz performance.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    // Step 1: Placing stand and tubes
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
      id: 'act-place-tube-a',
      trigger: { type: 'drop', source: 'tube-a', target: 'stand-slot-a' },
      conditions: [{ type: 'flag', key: 'standPlaced', equals: true }],
      blockMessage: 'Place the test tube stand on the bench first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-a', zoneId: 'stand-slot-a' },
        { type: 'setFlag', key: 'tubeAPlaced', value: true },
      ],
      completesAction: 'place-tube-a',
    },
    {
      id: 'act-place-tube-b',
      trigger: { type: 'drop', source: 'tube-b', target: 'stand-slot-b' },
      conditions: [{ type: 'flag', key: 'standPlaced', equals: true }],
      blockMessage: 'Place the test tube stand on the bench first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-b', zoneId: 'stand-slot-b' },
        { type: 'setFlag', key: 'tubeBPlaced', value: true },
      ],
      completesAction: 'place-tube-b',
    },
    {
      id: 'act-place-tube-c',
      trigger: { type: 'drop', source: 'tube-c', target: 'stand-slot-c' },
      conditions: [{ type: 'flag', key: 'standPlaced', equals: true }],
      blockMessage: 'Place the test tube stand on the bench first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-c', zoneId: 'stand-slot-c' },
        { type: 'setFlag', key: 'tubeCPlaced', value: true },
      ],
      completesAction: 'place-tube-c',
    },
    {
      id: 'act-place-tube-d',
      trigger: { type: 'drop', source: 'tube-d', target: 'stand-slot-d' },
      conditions: [{ type: 'flag', key: 'standPlaced', equals: true }],
      blockMessage: 'Place the test tube stand on the bench first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-d', zoneId: 'stand-slot-d' },
        { type: 'setFlag', key: 'tubeDPlaced', value: true },
      ],
      completesAction: 'place-tube-d',
    },
    {
      id: 'act-place-tube-e',
      trigger: { type: 'drop', source: 'tube-e', target: 'stand-slot-e' },
      conditions: [{ type: 'flag', key: 'standPlaced', equals: true }],
      blockMessage: 'Place the test tube stand on the bench first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-e', zoneId: 'stand-slot-e' },
        { type: 'setFlag', key: 'tubeEPlaced', value: true },
      ],
      completesAction: 'place-tube-e',
    },
    {
      id: 'act-place-tube-f',
      trigger: { type: 'drop', source: 'tube-f', target: 'stand-slot-f' },
      conditions: [{ type: 'flag', key: 'standPlaced', equals: true }],
      blockMessage: 'Place the test tube stand on the bench first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'tube-f', zoneId: 'stand-slot-f' },
        { type: 'setFlag', key: 'tubeFPlaced', value: true },
      ],
      completesAction: 'place-tube-f',
    },

    // Step 2: Adding ~2 mL of each sample solution into Tubes A-F
    {
      id: 'act-fill-a',
      trigger: { type: 'drop', source: 'bottle-hcl', target: 'stand-slot-a' },
      conditions: [{ type: 'flag', key: 'tubeAPlaced', equals: true }],
      blockMessage: 'Position Test Tube A in the stand before adding Dilute HCl.',
      effects: [
        { type: 'setFlag', key: 'filledA', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-a', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'tube-a', prop: 'liquidColor', value: 'rgba(238, 242, 255, 0.75)' },
        { type: 'setApparatusProp', apparatusId: 'tube-a', prop: 'label', value: 'A: dil. HCl' },
      ],
      completesAction: 'fill-tube-a',
      animation: { type: 'pour', durationMs: 1200 },
    },
    {
      id: 'act-fill-b',
      trigger: { type: 'drop', source: 'bottle-lemon', target: 'stand-slot-b' },
      conditions: [{ type: 'flag', key: 'tubeBPlaced', equals: true }],
      blockMessage: 'Position Test Tube B in the stand before adding Lemon Juice.',
      effects: [
        { type: 'setFlag', key: 'filledB', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'liquidColor', value: 'rgba(254, 240, 138, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'tube-b', prop: 'label', value: 'B: Lemon Juice' },
      ],
      completesAction: 'fill-tube-b',
      animation: { type: 'pour', durationMs: 1200 },
    },
    {
      id: 'act-fill-c',
      trigger: { type: 'drop', source: 'bottle-ch3cooh', target: 'stand-slot-c' },
      conditions: [{ type: 'flag', key: 'tubeCPlaced', equals: true }],
      blockMessage: 'Position Test Tube C in the stand before adding Dilute Ethanoic Acid.',
      effects: [
        { type: 'setFlag', key: 'filledC', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-c', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'tube-c', prop: 'liquidColor', value: 'rgba(241, 245, 249, 0.75)' },
        { type: 'setApparatusProp', apparatusId: 'tube-c', prop: 'label', value: 'C: CH₃COOH' },
      ],
      completesAction: 'fill-tube-c',
      animation: { type: 'pour', durationMs: 1200 },
    },
    {
      id: 'act-fill-d',
      trigger: { type: 'drop', source: 'bottle-water', target: 'stand-slot-d' },
      conditions: [{ type: 'flag', key: 'tubeDPlaced', equals: true }],
      blockMessage: 'Position Test Tube D in the stand before adding Distilled Water.',
      effects: [
        { type: 'setFlag', key: 'filledD', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-d', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'tube-d', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.75)' },
        { type: 'setApparatusProp', apparatusId: 'tube-d', prop: 'label', value: 'D: Dist. Water' },
      ],
      completesAction: 'fill-tube-d',
      animation: { type: 'pour', durationMs: 1200 },
    },
    {
      id: 'act-fill-e',
      trigger: { type: 'drop', source: 'bottle-nahco3', target: 'stand-slot-e' },
      conditions: [{ type: 'flag', key: 'tubeEPlaced', equals: true }],
      blockMessage: 'Position Test Tube E in the stand before adding Dilute NaHCO₃ Solution.',
      effects: [
        { type: 'setFlag', key: 'filledE', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-e', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'tube-e', prop: 'liquidColor', value: 'rgba(240, 253, 250, 0.75)' },
        { type: 'setApparatusProp', apparatusId: 'tube-e', prop: 'label', value: 'E: NaHCO₃' },
      ],
      completesAction: 'fill-tube-e',
      animation: { type: 'pour', durationMs: 1200 },
    },
    {
      id: 'act-fill-f',
      trigger: { type: 'drop', source: 'bottle-naoh', target: 'stand-slot-f' },
      conditions: [{ type: 'flag', key: 'tubeFPlaced', equals: true }],
      blockMessage: 'Position Test Tube F in the stand before adding Dilute NaOH.',
      effects: [
        { type: 'setFlag', key: 'filledF', value: true },
        { type: 'setApparatusProp', apparatusId: 'tube-f', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'tube-f', prop: 'liquidColor', value: 'rgba(245, 243, 255, 0.75)' },
        { type: 'setApparatusProp', apparatusId: 'tube-f', prop: 'label', value: 'F: dil. NaOH' },
      ],
      completesAction: 'fill-tube-f',
      animation: { type: 'pour', durationMs: 1200 },
    },

    // Step 3: Preparing white tile with pH paper strips
    {
      id: 'act-place-tile',
      trigger: { type: 'drop', source: 'white-tile', target: 'tile-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'white-tile', zoneId: 'tile-zone' },
        { type: 'setFlag', key: 'tilePlaced', value: true },
      ],
      completesAction: 'place-tile',
    },

    // Step 4: Transferring samples to pH paper strips on the white tile
    {
      id: 'act-test-a',
      trigger: { type: 'drop', source: 'tube-a', target: 'tile-zone' },
      conditions: [
        { type: 'flag', key: 'tilePlaced', equals: true },
        { type: 'flag', key: 'filledA', equals: true },
      ],
      blockMessage: 'Ensure Tube A contains Dilute HCl and the White Tile is on the bench.',
      effects: [
        { type: 'setFlag', key: 'testedA', value: true },
        { type: 'setFlag', key: 'testedHCl', value: true },
      ],
      completesAction: 'test-a',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTestingA' },
    },
    {
      id: 'act-test-b',
      trigger: { type: 'drop', source: 'tube-b', target: 'tile-zone' },
      conditions: [
        { type: 'flag', key: 'tilePlaced', equals: true },
        { type: 'flag', key: 'filledB', equals: true },
      ],
      blockMessage: 'Ensure Tube B contains Lemon Juice and the White Tile is on the bench.',
      effects: [
        { type: 'setFlag', key: 'testedB', value: true },
        { type: 'setFlag', key: 'testedLemon', value: true },
      ],
      completesAction: 'test-b',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTestingB' },
    },
    {
      id: 'act-test-c',
      trigger: { type: 'drop', source: 'tube-c', target: 'tile-zone' },
      conditions: [
        { type: 'flag', key: 'tilePlaced', equals: true },
        { type: 'flag', key: 'filledC', equals: true },
      ],
      blockMessage: 'Ensure Tube C contains Dilute Ethanoic Acid and the White Tile is on the bench.',
      effects: [
        { type: 'setFlag', key: 'testedC', value: true },
        { type: 'setFlag', key: 'testedCH3COOH', value: true },
      ],
      completesAction: 'test-c',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTestingC' },
    },
    {
      id: 'act-test-d',
      trigger: { type: 'drop', source: 'tube-d', target: 'tile-zone' },
      conditions: [
        { type: 'flag', key: 'tilePlaced', equals: true },
        { type: 'flag', key: 'filledD', equals: true },
      ],
      blockMessage: 'Ensure Tube D contains Distilled Water and the White Tile is on the bench.',
      effects: [
        { type: 'setFlag', key: 'testedD', value: true },
        { type: 'setFlag', key: 'testedWater', value: true },
      ],
      completesAction: 'test-d',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTestingD' },
    },
    {
      id: 'act-test-e',
      trigger: { type: 'drop', source: 'tube-e', target: 'tile-zone' },
      conditions: [
        { type: 'flag', key: 'tilePlaced', equals: true },
        { type: 'flag', key: 'filledE', equals: true },
      ],
      blockMessage: 'Ensure Tube E contains Dilute NaHCO₃ Solution and the White Tile is on the bench.',
      effects: [
        { type: 'setFlag', key: 'testedE', value: true },
        { type: 'setFlag', key: 'testedNaHCO3', value: true },
      ],
      completesAction: 'test-e',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTestingE' },
    },
    {
      id: 'act-test-f',
      trigger: { type: 'drop', source: 'tube-f', target: 'tile-zone' },
      conditions: [
        { type: 'flag', key: 'tilePlaced', equals: true },
        { type: 'flag', key: 'filledF', equals: true },
      ],
      blockMessage: 'Ensure Tube F contains Dilute NaOH and the White Tile is on the bench.',
      effects: [
        { type: 'setFlag', key: 'testedF', value: true },
        { type: 'setFlag', key: 'testedNaOH', value: true },
      ],
      completesAction: 'test-f',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTestingF' },
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
      'Enter the observed pH value from the color chart for each sample, and classify its Nature: 1 = Acidic (pH < 7), 2 = Neutral (pH = 7), 3 = Basic (pH > 7).',
    fields: [
      {
        id: 'ph_hcl',
        label: 'Approximate pH of Dilute HCl (Sample A)',
        unit: 'pH',
        expectedValue: 1.0,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Strong mineral acid; turns pH paper red (pH ≈ 1)',
      },
      {
        id: 'nature_hcl',
        label: 'Nature of Dilute HCl (1 = Acidic, 2 = Neutral, 3 = Basic)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_lemon',
        label: 'Approximate pH of Lemon Juice (Sample B)',
        unit: 'pH',
        expectedValue: 2.5,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Contains citric acid; turns pH paper red-orange (pH ≈ 2 to 3)',
      },
      {
        id: 'nature_lemon',
        label: 'Nature of Lemon Juice (1 = Acidic, 2 = Neutral, 3 = Basic)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_ch3cooh',
        label: 'Approximate pH of Dilute Ethanoic Acid (Sample C)',
        unit: 'pH',
        expectedValue: 3.5,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Weak organic acid; turns pH paper orange (pH ≈ 3 to 4)',
      },
      {
        id: 'nature_ch3cooh',
        label: 'Nature of Ethanoic Acid (1 = Acidic, 2 = Neutral, 3 = Basic)',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_water',
        label: 'Approximate pH of Distilled Water (Sample D)',
        unit: 'pH',
        expectedValue: 7.0,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Pure neutral liquid; turns pH paper green (pH ≈ 7)',
      },
      {
        id: 'nature_water',
        label: 'Nature of Distilled Water (1 = Acidic, 2 = Neutral, 3 = Basic)',
        unit: '',
        expectedValue: 2,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_nahco3',
        label: 'Approximate pH of Dilute NaHCO₃ Solution (Sample E)',
        unit: 'pH',
        expectedValue: 8.5,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Mild basic salt solution; turns pH paper blue-green (pH ≈ 8 to 9)',
      },
      {
        id: 'nature_nahco3',
        label: 'Nature of NaHCO₃ Solution (1 = Acidic, 2 = Neutral, 3 = Basic)',
        unit: '',
        expectedValue: 3,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'ph_naoh',
        label: 'Approximate pH of Dilute NaOH (Sample F)',
        unit: 'pH',
        expectedValue: 13.0,
        tolerance: 1.0,
        toleranceType: 'absolute',
        helperText: 'Strong alkali; turns pH paper dark violet (pH ≈ 13 to 14)',
      },
      {
        id: 'nature_naoh',
        label: 'Nature of Dilute NaOH (1 = Acidic, 2 = Neutral, 3 = Basic)',
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
        question: 'What does pH value primarily represent in an aqueous solution?',
        options: [
          'Concentration of hydroxide ions only',
          'Negative logarithm of hydrogen ion concentration [-log₁₀[H⁺]]',
          'Boiling point elevation of the solution',
          'Molar mass of the solute',
        ],
        correctIndex: 1,
        explanation: 'pH is defined as pH = −log₁₀[H⁺]. A lower numerical pH indicates a higher concentration of hydronium [H⁺/H₃O⁺] ions.',
      },
      {
        id: 'q2',
        question: 'Which of the six tested samples exhibits the lowest pH value (strongest acid)?',
        options: [
          'Distilled water',
          'Lemon juice',
          'Dilute hydrochloric acid (HCl)',
          'Dilute ethanoic acid (CH₃COOH)',
        ],
        correctIndex: 2,
        explanation: 'Dilute HCl is a strong mineral acid that completely dissociates in water, giving a pH around 1.0.',
      },
      {
        id: 'q3',
        question: 'Why does dilute ethanoic acid (CH₃COOH) have a higher pH than dilute HCl of equal molarity?',
        options: [
          'Ethanoic acid is a weak acid that ionises only partially in aqueous solution',
          'Ethanoic acid produces more H⁺ ions per litre than HCl',
          'Ethanoic acid is an inorganic salt',
          'Ethanoic acid is completely neutral',
        ],
        correctIndex: 0,
        explanation: 'Ethanoic acid is a weak organic acid with incomplete dissociation, producing fewer H⁺ ions and hence a higher pH (≈ 3.5) compared to HCl (≈ 1.0).',
      },
      {
        id: 'q4',
        question: 'What is the nature of an aqueous solution of sodium hydrogen carbonate (NaHCO₃)?',
        options: [
          'Strongly acidic (pH ≈ 1)',
          'Weakly acidic (pH ≈ 4)',
          'Neutral (pH = 7)',
          'Weakly basic (pH ≈ 8.5)',
        ],
        correctIndex: 3,
        explanation: 'NaHCO₃ is a salt formed from a strong base (NaOH) and a weak acid (H₂CO₃). Anionic hydrolysis produces excess OH⁻ ions, rendering it weakly basic.',
      },
    ],
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Apparatus Setup & Test Tube Placement',
      maxPoints: 20,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Test tube stand placed on bench', points: 4, flag: 'standPlaced' },
          { label: 'Tubes A, B, C placed in stand', points: 8, action: 'place-tube-c' },
          { label: 'Tubes D, E, F placed in stand', points: 8, action: 'place-tube-f' },
        ],
      },
    },
    {
      name: 'Sample Preparation & White Tile Setup',
      maxPoints: 20,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Sample solutions added to Tubes A–C', points: 7, action: 'fill-tube-c' },
          { label: 'Sample solutions added to Tubes D–F', points: 7, action: 'fill-tube-f' },
          { label: 'White glazed tile with pH strips positioned', points: 6, flag: 'tilePlaced' },
        ],
      },
    },
    {
      name: 'pH Paper Testing & Color Development',
      maxPoints: 30,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Sample A (HCl) tested on Strip A (Red)', points: 5, flag: 'testedA' },
          { label: 'Sample B (Lemon) tested on Strip B (Orange-Red)', points: 5, flag: 'testedB' },
          { label: 'Sample C (CH₃COOH) tested on Strip C (Orange)', points: 5, flag: 'testedC' },
          { label: 'Sample D (Water) tested on Strip D (Green)', points: 5, flag: 'testedD' },
          { label: 'Sample E (NaHCO₃) tested on Strip E (Blue-Green)', points: 5, flag: 'testedE' },
          { label: 'Sample F (NaOH) tested on Strip F (Dark Violet)', points: 5, flag: 'testedF' },
        ],
      },
    },
    {
      name: 'Observations & Classification Accuracy',
      maxPoints: 20,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Dilute HCl pH ≈ 1 ± 1 & classified Acidic', points: 4, calcFieldId: 'nature_hcl', expectedValue: 1, tolerance: 0.1 },
          { label: 'Lemon juice pH ≈ 2.5 ± 1 & classified Acidic', points: 3, calcFieldId: 'nature_lemon', expectedValue: 1, tolerance: 0.1 },
          { label: 'Ethanoic acid pH ≈ 3.5 ± 1 & classified Acidic', points: 3, calcFieldId: 'nature_ch3cooh', expectedValue: 1, tolerance: 0.1 },
          { label: 'Distilled water pH ≈ 7 ± 1 & classified Neutral', points: 3, calcFieldId: 'nature_water', expectedValue: 2, tolerance: 0.1 },
          { label: 'Dilute NaHCO₃ pH ≈ 8.5 ± 1 & classified Basic', points: 3, calcFieldId: 'nature_nahco3', expectedValue: 3, tolerance: 0.1 },
          { label: 'Dilute NaOH pH ≈ 13 ± 1 & classified Basic', points: 4, calcFieldId: 'nature_naoh', expectedValue: 3, tolerance: 0.1 },
        ],
      },
    },
    {
      name: 'Viva Voce Examination',
      maxPoints: 10,
      evaluator: { type: 'vivaQuiz' },
    },
  ],

  // ── Validation Rules ──
  validation: [
    {
      id: 'add-sample-without-tube-a',
      trigger: 'drop:bottle-hcl→stand-slot-a',
      condition: { type: 'flag', key: 'tubeAPlaced', equals: false },
      message: 'Place Test Tube A in the stand before adding Dilute HCl.',
      blocking: true,
    },
    {
      id: 'add-sample-without-tube-b',
      trigger: 'drop:bottle-lemon→stand-slot-b',
      condition: { type: 'flag', key: 'tubeBPlaced', equals: false },
      message: 'Place Test Tube B in the stand before adding Lemon Juice.',
      blocking: true,
    },
    {
      id: 'add-sample-without-tube-c',
      trigger: 'drop:bottle-ch3cooh→stand-slot-c',
      condition: { type: 'flag', key: 'tubeCPlaced', equals: false },
      message: 'Place Test Tube C in the stand before adding Dilute Ethanoic Acid.',
      blocking: true,
    },
    {
      id: 'add-sample-without-tube-d',
      trigger: 'drop:bottle-water→stand-slot-d',
      condition: { type: 'flag', key: 'tubeDPlaced', equals: false },
      message: 'Place Test Tube D in the stand before adding Distilled Water.',
      blocking: true,
    },
    {
      id: 'add-sample-without-tube-e',
      trigger: 'drop:bottle-nahco3→stand-slot-e',
      condition: { type: 'flag', key: 'tubeEPlaced', equals: false },
      message: 'Place Test Tube E in the stand before adding Dilute NaHCO₃.',
      blocking: true,
    },
    {
      id: 'add-sample-without-tube-f',
      trigger: 'drop:bottle-naoh→stand-slot-f',
      condition: { type: 'flag', key: 'tubeFPlaced', equals: false },
      message: 'Place Test Tube F in the stand before adding Dilute NaOH.',
      blocking: true,
    },
    {
      id: 'test-without-tile',
      trigger: 'drop:tube-a→tile-zone',
      condition: { type: 'flag', key: 'tilePlaced', equals: false },
      message: 'Place the white glazed tile with pH paper strips on the bench first before testing samples.',
      blocking: true,
    },
  ],
};
