/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Determination of Dissolved Oxygen (Winkler's Method)
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Iodometric fixation:
 *  Mn²⁺ + 2OH⁻ → Mn(OH)₂
 *  2Mn(OH)₂ + O₂ → 2MnO(OH)₂↓ (brown precipitate)
 *  MnO(OH)₂ + 2I⁻ + 4H⁺ → Mn²⁺ + I₂ + 3H₂O
 *  I₂ + 2S₂O₃²⁻ → S₄O₆²⁻ + 2I⁻ (Starch: Deep Blue → Colorless)
 *
 *  DO = 0.8 · V₂ ppm
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const dissolvedOxygenWinkler: ExperimentConfig = {
  id: 'dissolved-oxygen-winkler',
  title: "Dissolved Oxygen by Winkler's Method",
  subtitle: 'DO = 0.8 · V₂ ppm (Iodometric Titration)',
  description:
    'Determine the concentration of dissolved oxygen (DO) in a water sample by chemical fixation with MnSO₄/alkaline KI and iodometric starch titration.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'hard',
  themeColor: '#0284c7',
  icon: '🌊',
  estimatedMinutes: 24,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'bod-bottle',
      component: 'BODBottle',
      label: '300 mL BOD Bottle',
      icon: '🍾',
      initialProps: { liquidLevel: 0, width: 110, height: 175 },
    },
    {
      id: 'conical-flask',
      component: 'ConicalFlask',
      label: '250 mL Titration Flask',
      icon: '⚗️',
      initialProps: { liquidLevel: 0, width: 120, height: 140 },
    },
    {
      id: 'burette',
      component: 'Burette',
      label: 'Burette (N/50 Na₂S₂O₃)',
      icon: '📏',
      initialProps: { liquidLevel: 0.95, liquidColor: 'rgba(224, 242, 254, 0.4)' },
    },
    {
      id: 'water-sample',
      component: 'ReagentBottle',
      label: 'Water Sample (250 mL)',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.45)', label: 'River H₂O' },
    },
    {
      id: 'mnso4-reagent',
      component: 'Dropper',
      label: '2 mL MnSO₄ Solution',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(244, 114, 182, 0.65)', label: 'MnSO₄' },
    },
    {
      id: 'alkaline-ki',
      component: 'Dropper',
      label: '2 mL Alkaline KI',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(253, 224, 71, 0.85)', label: 'Alk. KI' },
    },
    {
      id: 'conc-h2so4',
      component: 'Dropper',
      label: 'Conc. H₂SO₄ (Acidifier)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.7)', label: 'H₂SO₄' },
    },
    {
      id: 'starch-indicator',
      component: 'Dropper',
      label: 'Starch Indicator',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(30, 58, 138, 0.9)', label: 'Starch' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'bod-bench-zone',
      label: 'Place BOD Bottle on Bench',
      accepts: ['bod-bottle'],
      position: { x: 38, y: 58 },
      size: { width: 22, height: 38 },
      rejectMessage: 'Place the BOD bottle on the lab bench.',
    },
    {
      id: 'bod-mouth-zone',
      label: 'Into BOD Bottle',
      accepts: ['water-sample', 'mnso4-reagent', 'alkaline-ki', 'conc-h2so4'],
      position: { x: 38, y: 44 },
      size: { width: 16, height: 26 },
      rejectMessage: 'Add reagent into the BOD bottle below surface.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'bod-bottle' },
    },
    {
      id: 'flask-bench-zone',
      label: 'Place Titration Flask',
      accepts: ['conical-flask'],
      position: { x: 65, y: 62 },
      size: { width: 22, height: 34 },
      rejectMessage: 'Place the conical flask under the burette stand.',
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Titration Flask',
      accepts: ['starch-indicator', 'burette'],
      position: { x: 65, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add indicator or titrate into the conical flask.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      { component: 'RetortStand', position: { x: 65, y: 45 }, scale: 1.1 },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup',
      label: '1. Place BOD Bottle',
      instruction: 'Place the 300 mL BOD incubation bottle on the laboratory bench.',
      requiredActions: ['place-bod'],
      type: 'lab',
    },
    {
      id: 'fill-sample',
      label: '2. Fill 250 mL Sample (No Bubbles)',
      instruction: 'Carefully fill 250 mL water sample into the BOD bottle. Avoid trapping any air bubbles.',
      requiredActions: ['fill-sample'],
      type: 'lab',
    },
    {
      id: 'oxygen-fixation',
      label: '3. Add MnSO₄ & Alkaline KI',
      instruction: 'Add 2 mL MnSO₄ and 2 mL alkaline KI. Stopper and shake. A brown precipitate of basic manganic oxide forms.',
      requiredActions: ['fix-oxygen'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'acidify-iodine',
      label: '4. Acidify to Liberate I₂',
      instruction: 'Add 2 mL conc. H₂SO₄. Precipitate dissolves, releasing free iodine with a deep golden-brown color. Click Continue.',
      requiredActions: ['liberate-iodine'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'titrate-to-yellow',
      label: '5. Transfer & Titrate to Pale Yellow',
      instruction: 'Place conical flask on right. Titrate iodine solution with N/50 thiosulphate until it turns pale straw-yellow.',
      requiredActions: ['titrate-yellow'],
      type: 'lab',
    },
    {
      id: 'starch-endpoint',
      label: '6. Add Starch & Complete Titration',
      instruction: 'Add starch indicator (turns deep midnight blue). Titrate dropwise until blue disappears at V₂ = 6.5 mL.',
      requiredActions: ['starch-endpoint'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '7. Calculations & Viva',
      instruction: 'Calculate the dissolved oxygen content (ppm) and answer conceptual questions.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '8. Score Breakdown',
      instruction: 'Review your laboratory precision and scoring evaluation.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'inter-place-bod',
      trigger: { type: 'drop', source: 'bod-bottle', target: 'bod-bench-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'bod-bottle', zoneId: 'bod-bench-zone' },
        { type: 'setFlag', key: 'bodPlaced', value: true },
      ],
      completesAction: 'place-bod',
    },
    {
      id: 'inter-fill-sample',
      trigger: { type: 'drop', source: 'water-sample', target: 'bod-mouth-zone' },
      conditions: [{ type: 'flag', key: 'bodPlaced', equals: true }],
      blockMessage: 'Place the BOD bottle on the bench first.',
      effects: [
        { type: 'setFlag', key: 'sampleFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidLevel', value: 0.85 },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
      ],
      completesAction: 'fill-sample',
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-fix-oxygen',
      trigger: { type: 'drop', source: 'alkaline-ki', target: 'bod-mouth-zone' },
      conditions: [{ type: 'flag', key: 'sampleFilled', equals: true }],
      blockMessage: 'Fill the BOD bottle with water sample first.',
      effects: [
        { type: 'setFlag', key: 'brownPrecipitateFormed', value: true },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidColor', value: 'rgba(180, 83, 9, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'label', value: 'Brown MnO(OH)₂ Precipitate' },
      ],
      completesAction: 'fix-oxygen',
      animation: { type: 'color-change', durationMs: 1000, animatingFlag: 'isFixing' },
    },
    {
      id: 'inter-liberate-iodine',
      trigger: { type: 'drop', source: 'conc-h2so4', target: 'bod-mouth-zone' },
      conditions: [{ type: 'flag', key: 'brownPrecipitateFormed', equals: true }],
      blockMessage: 'Add MnSO₄ and alkaline KI to precipitate basic oxide first.',
      effects: [
        { type: 'setFlag', key: 'iodineLiberated', value: true },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'liquidColor', value: 'rgba(120, 53, 15, 0.92)' },
        { type: 'setApparatusProp', apparatusId: 'bod-bottle', prop: 'label', value: 'Golden-Brown I₂ Solution' },
      ],
      completesAction: 'liberate-iodine',
      animation: { type: 'color-change', durationMs: 1000, animatingFlag: 'isDissolving' },
    },
    {
      id: 'inter-place-flask',
      trigger: { type: 'drop', source: 'conical-flask', target: 'flask-bench-zone' },
      conditions: [{ type: 'flag', key: 'iodineLiberated', equals: true }],
      effects: [
        { type: 'placeApparatus', apparatusId: 'conical-flask', zoneId: 'flask-bench-zone' },
        { type: 'setFlag', key: 'flaskReady', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.45 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(253, 224, 71, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Pale Straw-Yellow I₂' },
      ],
      completesAction: 'titrate-yellow',
    },
    {
      id: 'inter-starch-end',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'flaskReady', equals: true }],
      blockMessage: 'Transfer aliquot to titration flask first.',
      effects: [
        { type: 'setFlag', key: 'iodineTitrated', value: true },
        { type: 'setVariable', key: 'thiosulphateVolume', value: 6.5 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.65 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.25)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Colorless Endpoint (V₂ = 6.5 mL)' },
      ],
      completesAction: 'starch-endpoint',
      animation: { type: 'color-change', durationMs: 1200, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: '2Mn(OH)₂ + O₂ → 2MnO(OH)₂ ; MnO(OH)₂ + 2I⁻ + 4H⁺ → Mn²⁺ + I₂ + 3H₂O ; I₂ + 2S₂O₃²⁻ → S₄O₆²⁻ + 2I⁻',
    reactionType: "Winkler Iodometric Fixation & Titration",
    constants: {
      factor: 0.8,              // (8 * 1000 * N) / V_sample for 100 mL aliquot of N/50 thiosulphate
      thiosulphateVolume: 6.5,  // mL
    },
    formulas: {
      dissolvedOxygen: {
        label: 'Dissolved Oxygen DO (ppm or mg/L)',
        displayFormula: 'DO = 0.8 · V₂ = 0.8 · 6.5',
        computeFn: 'dissolvedOxygenWinkler',
        inputs: ['thiosulphateVolume'],
        unit: 'ppm',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: "Dissolved Oxygen (DO) Calculations",
    instruction: "From the sodium thiosulphate titre reading (V₂ = 6.5 mL of N/50 thiosulphate):",
    fields: [
      {
        id: 'doResult',
        label: '1. Dissolved Oxygen content in water: DO = 0.8 × V₂ (ppm)  [Given V₂ = 6.5 mL]',
        placeholder: 'e.g. 5.20',
        unit: 'ppm',
        expectedFormulaName: 'dissolvedOxygenWinkler',
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'airBubbleEffect',
        label: '2. How does an air bubble trapped in the BOD bottle affect the measured DO? (Enter 1 for Artificially Increases, 2 for Decreases)',
        placeholder: 'Enter 1 or 2',
        unit: 'Effect',
        expectedValue: 1.0,
        tolerance: 0,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric ──
  scoring: [
    {
      name: 'Bubble-Free Filling & Fixation',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'sampleFilled', truePoints: 20 },
    },
    {
      name: 'Brown Precipitate Formation',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'brownPrecipitateFormed', truePoints: 20 },
    },
    {
      name: 'Starch-Iodine Colorless Endpoint',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'iodineTitrated', truePoints: 20 },
    },
    {
      name: 'Dissolved Oxygen Calculation (ppm)',
      maxPoints: 25,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'doResult',
        correctPoints: 25,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Air Bubble Error & Viva Theory',
      maxPoints: 15,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'airBubbleEffect',
        correctPoints: 15,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'fix-without-filling',
      trigger: 'drop:alkaline-ki→bod-mouth-zone',
      condition: { type: 'flag', key: 'sampleFilled', equals: false },
      message: 'Fill the BOD bottle with water sample before adding reagents.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    thiosulphateVolume: 6.5,
  },
  initialFlags: {
    bodPlaced: false,
    sampleFilled: false,
    brownPrecipitateFormed: false,
    iodineLiberated: false,
    flaskReady: false,
    iodineTitrated: false,
  },
};
