/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: True Solution, Suspension and Colloid
 *  CBSE Class 9 Science — Is Matter Around Us Pure?
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Classification of mixtures by:
 *  1. Transparency (Clear vs Translucent vs Opaque)
 *  2. Filtration (Passes through vs Leaves residue)
 *  3. Stability (No settling vs Settles under gravity)
 *  4. Tyndall Effect (Light beam path scattering in colloids)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const trueSolutionColloidSuspension: ExperimentConfig = {
  id: 'true-solution-colloid-suspension',
  title: 'True Solution, Suspension and Colloid',
  subtitle: 'Classification by Transparency, Filtration & Tyndall Effect',
  description:
    'Prepare mixtures of common salt, soil, and starch in water. Observe transparency, stability on standing, filtration residue, and the Tyndall effect to classify them into true solution, suspension, and colloidal solution.',
  class: 9,
  subject: 'Chemistry',
  chapter: 'Matter: Is Matter Around Us Pure?',
  difficulty: 'easy',
  themeColor: '#0284c7',
  icon: '🧪',
  estimatedMinutes: 25,
  underDevelopment: false,
  adminOnly: false,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'beaker-solution',
      component: 'Beaker',
      label: 'Beaker A (True Solution Test)',
      icon: '🥛',
      initialProps: { width: 110, height: 135, liquidLevel: 0, label: 'Beaker A' },
    },
    {
      id: 'beaker-suspension',
      component: 'Beaker',
      label: 'Beaker B (Suspension Test)',
      icon: '🥛',
      initialProps: { width: 110, height: 135, liquidLevel: 0, label: 'Beaker B' },
    },
    {
      id: 'beaker-colloid',
      component: 'Beaker',
      label: 'Beaker C (Colloid Test)',
      icon: '🥛',
      initialProps: { width: 110, height: 135, liquidLevel: 0, label: 'Beaker C' },
    },
    {
      id: 'water-bottle',
      component: 'ReagentBottle',
      label: 'Distilled Water (Wash Bottle)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.75)', label: 'Distilled H₂O' },
    },
    {
      id: 'salt-bottle',
      component: 'ReagentBottle',
      label: 'Common Salt (NaCl, 1 g)',
      icon: '🧂',
      initialProps: { liquidColor: '#f8fafc', label: 'NaCl Salt' },
    },
    {
      id: 'soil-bottle',
      component: 'ReagentBottle',
      label: 'Garden Soil Powder (1 g)',
      icon: '🪨',
      initialProps: { liquidColor: '#78350f', label: 'Soil Powder' },
    },
    {
      id: 'starch-bottle',
      component: 'ReagentBottle',
      label: 'Starch Solution / Paste (1 g)',
      icon: '🥣',
      initialProps: { liquidColor: 'rgba(241, 245, 249, 0.85)', label: 'Starch Paste' },
    },
    {
      id: 'glass-rod',
      component: 'GlassRod',
      label: 'Glass Stirring Rod',
      icon: '🥢',
      initialProps: { width: 14, height: 160 },
    },
    {
      id: 'torch-light',
      component: 'LaserPointer',
      label: 'Laser Pointer (650 nm Red Diode)',
      icon: '🔦',
      initialProps: { isLit: true, isOn: true, label: '650 nm Red Laser' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'bench-zone-a',
      label: 'Beaker A (True Solution)',
      accepts: ['beaker-solution', 'water-bottle', 'salt-bottle', 'glass-rod', 'torch-light'],
      position: { x: 25, y: 65 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Place Beaker A on the left position for True Solution.',
      visibleWhen: { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'beaker-solution' } },
    },
    {
      id: 'bench-zone-b',
      label: 'Beaker B (Suspension)',
      accepts: ['beaker-suspension', 'water-bottle', 'soil-bottle', 'glass-rod', 'torch-light'],
      position: { x: 50, y: 65 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Place Beaker B on the center position for Suspension.',
      visibleWhen: { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'beaker-suspension' } },
    },
    {
      id: 'bench-zone-c',
      label: 'Beaker C (Colloid)',
      accepts: ['beaker-colloid', 'water-bottle', 'starch-bottle', 'glass-rod', 'torch-light'],
      position: { x: 75, y: 65 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Place Beaker C on the right position for Colloid.',
      visibleWhen: { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'beaker-colloid' } },
    },
    {
      id: 'beaker-a-mouth',
      label: 'Beaker A (True Solution)',
      accepts: ['water-bottle', 'salt-bottle', 'glass-rod', 'torch-light'],
      position: { x: 25, y: 62 },
      size: { width: 18, height: 28 },
      rejectMessage: 'Add reagents or test Beaker A.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'beaker-solution' },
    },
    {
      id: 'beaker-b-mouth',
      label: 'Beaker B (Suspension)',
      accepts: ['water-bottle', 'soil-bottle', 'glass-rod', 'torch-light'],
      position: { x: 50, y: 62 },
      size: { width: 18, height: 28 },
      rejectMessage: 'Add reagents or test Beaker B.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'beaker-suspension' },
    },
    {
      id: 'beaker-c-mouth',
      label: 'Beaker C (Colloid)',
      accepts: ['water-bottle', 'starch-bottle', 'glass-rod', 'torch-light'],
      position: { x: 75, y: 62 },
      size: { width: 18, height: 28 },
      rejectMessage: 'Add reagents or test Beaker C.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'beaker-colloid' },
    },
  ],

  // ── Bench Layout ──
  bench: {
    backgroundElements: [],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-beakers',
      label: 'Place Beakers',
      instruction: 'Drag Beakers A, B, and C onto their designated positions on the lab bench: Beaker A (left), Beaker B (center), and Beaker C (right).',
      requiredActions: ['place-beaker-a', 'place-beaker-b', 'place-beaker-c'],
      type: 'lab',
    },
    {
      id: 'add-water',
      label: 'Add Distilled Water',
      instruction: 'Pour 50 mL distilled water into each of Beakers A, B, and C.',
      requiredActions: ['water-added-a', 'water-added-b', 'water-added-c'],
      type: 'lab',
    },
    {
      id: 'add-solutes',
      label: 'Add Solutes & Stir',
      instruction: 'Add Salt to Beaker A, Soil to Beaker B, and Starch to Beaker C. Then stir each beaker with the glass rod.',
      requiredActions: ['solute-added-a', 'solute-added-b', 'solute-added-c', 'stirred-a', 'stirred-b', 'stirred-c'],
      type: 'lab',
    },
    {
      id: 'observe-stability',
      label: 'Observe Stability & Settling',
      instruction: 'Observe the three mixtures left undisturbed. Beaker B (soil suspension) gradually settles at the bottom forming mud sediment, while A (true solution) and C (colloid) remain uniform and stable.',
      requiredActions: [],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-tyndall',
      label: 'Tyndall Effect Test',
      instruction: 'Aim the 650 nm laser beam at Beakers A, B, and C to observe the Tyndall Effect. Take your time to compare how light behaves in a True Solution (<1 nm), Suspension (>1000 nm), and Colloid (1–1000 nm). Click "Proceed to Analysis" when you have finished observing.',
      requiredActions: ['tested-tyndall-a', 'tested-tyndall-b', 'tested-tyndall-c'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: 'Classification & Analysis',
      instruction: 'Classify the mixtures based on transparency, stability, filtration, and Tyndall effect observations.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: 'Results & Marks',
      instruction: 'Review your laboratory performance and viva evaluation.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    // Placement
    {
      id: 'place-a',
      trigger: { type: 'drop', source: 'beaker-solution', target: 'bench-zone-a' },
      effects: [{ type: 'placeApparatus', apparatusId: 'beaker-solution', zoneId: 'bench-zone-a' }],
      completesAction: 'place-beaker-a',
    },
    {
      id: 'place-b',
      trigger: { type: 'drop', source: 'beaker-suspension', target: 'bench-zone-b' },
      effects: [{ type: 'placeApparatus', apparatusId: 'beaker-suspension', zoneId: 'bench-zone-b' }],
      completesAction: 'place-beaker-b',
    },
    {
      id: 'place-c',
      trigger: { type: 'drop', source: 'beaker-colloid', target: 'bench-zone-c' },
      effects: [{ type: 'placeApparatus', apparatusId: 'beaker-colloid', zoneId: 'bench-zone-c' }],
      completesAction: 'place-beaker-c',
    },

    // Water additions
    {
      id: 'water-to-a',
      trigger: { type: 'drop', source: 'water-bottle', target: 'beaker-a-mouth' },
      guard: {
        condition: { type: 'flag', key: 'hasWaterA', equals: true },
        message: 'Beaker A already has water.',
      },
      effects: [
        { type: 'setFlag', key: 'hasWaterA', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
      ],
      completesAction: 'water-added-a',
    },
    {
      id: 'water-to-b',
      trigger: { type: 'drop', source: 'water-bottle', target: 'beaker-b-mouth' },
      guard: {
        condition: { type: 'flag', key: 'hasWaterB', equals: true },
        message: 'Beaker B already has water.',
      },
      effects: [
        { type: 'setFlag', key: 'hasWaterB', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
      ],
      completesAction: 'water-added-b',
    },
    {
      id: 'water-to-c',
      trigger: { type: 'drop', source: 'water-bottle', target: 'beaker-c-mouth' },
      guard: {
        condition: { type: 'flag', key: 'hasWaterC', equals: true },
        message: 'Beaker C already has water.',
      },
      effects: [
        { type: 'setFlag', key: 'hasWaterC', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'liquidLevel', value: 0.5 },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
      ],
      completesAction: 'water-added-c',
    },

    // Solute additions
    {
      id: 'add-salt',
      trigger: { type: 'drop', source: 'salt-bottle', target: 'beaker-a-mouth' },
      conditions: [{ type: 'flag', key: 'hasWaterA', equals: true }],
      blockMessage: 'Add water to Beaker A first.',
      effects: [
        { type: 'setFlag', key: 'hasSalt', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'hasSaltCrystals', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'label', value: 'Beaker A: Salt Added (Undissolved)' },
      ],
      completesAction: 'solute-added-a',
    },
    {
      id: 'add-soil',
      trigger: { type: 'drop', source: 'soil-bottle', target: 'beaker-b-mouth' },
      conditions: [{ type: 'flag', key: 'hasWaterB', equals: true }],
      blockMessage: 'Add water to Beaker B first.',
      effects: [
        { type: 'setFlag', key: 'hasSoil', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'hasSoilGrains', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'hasSuspension', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'liquidColor', value: 'rgba(215, 230, 245, 0.55)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'label', value: 'Beaker B: Soil Added (Soil at Bottom, Unstirred)' },
      ],
      completesAction: 'solute-added-b',
    },
    {
      id: 'add-starch',
      trigger: { type: 'drop', source: 'starch-bottle', target: 'beaker-c-mouth' },
      conditions: [{ type: 'flag', key: 'hasWaterC', equals: true }],
      blockMessage: 'Add water to Beaker C first.',
      effects: [
        { type: 'setFlag', key: 'hasStarch', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'hasStarchPaste', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'isColloid', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'label', value: 'Beaker C: Starch Added (Paste at Bottom, Unstirred)' },
      ],
      completesAction: 'solute-added-c',
    },

    // Stirring (can stir Beaker A, B, or C with the glass rod)
    {
      id: 'stir-beaker-a',
      trigger: { type: 'drop', source: 'glass-rod', target: 'beaker-a-mouth' },
      conditions: [{ type: 'flag', key: 'hasSalt', equals: true }],
      blockMessage: 'Add salt to Beaker A before stirring.',
      animation: {
        type: 'stir',
        durationMs: 2200,
        animatingFlag: 'isStirring',
        effectsAfterAnimation: true,
      },
      effects: [
        { type: 'setFlag', key: 'stirredA', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'hasSaltCrystals', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'liquidColor', value: 'rgba(230, 244, 255, 0.28)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'label', value: 'Beaker A: True Solution (Clear & Transparent)' },
      ],
      completesAction: 'stirred-a',
    },
    {
      id: 'stir-beaker-b',
      trigger: { type: 'drop', source: 'glass-rod', target: 'beaker-b-mouth' },
      conditions: [{ type: 'flag', key: 'hasSoil', equals: true }],
      blockMessage: 'Add soil to Beaker B before stirring.',
      animation: {
        type: 'stir',
        durationMs: 2200,
        animatingFlag: 'isStirring',
        effectsAfterAnimation: true,
      },
      effects: [
        { type: 'setFlag', key: 'stirredB', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'hasSoilGrains', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'hasSuspension', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'liquidColor', value: 'rgba(105, 55, 15, 0.90)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'label', value: 'Beaker B: Soil Suspension (Cloudy & Opaque)' },
      ],
      completesAction: 'stirred-b',
    },
    {
      id: 'stir-beaker-c',
      trigger: { type: 'drop', source: 'glass-rod', target: 'beaker-c-mouth' },
      conditions: [{ type: 'flag', key: 'hasStarch', equals: true }],
      blockMessage: 'Add starch to Beaker C before stirring.',
      animation: {
        type: 'stir',
        durationMs: 2200,
        animatingFlag: 'isStirring',
        effectsAfterAnimation: true,
      },
      effects: [
        { type: 'setFlag', key: 'stirredC', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'hasStarchPaste', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'isColloid', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'liquidColor', value: 'rgba(240, 246, 255, 0.82)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'label', value: 'Beaker C: Starch Colloid (Translucent & Milky)' },
      ],
      completesAction: 'stirred-c',
    },

    // Stability observation: Let stand undisturbed (5 mins) to observe settling
    {
      id: 'observe-stability-settling',
      trigger: { type: 'click', elementId: 'observe-settling' },
      effects: [
        { type: 'setFlag', key: 'stabilityObserved', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'hasSediment', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'hasSuspension', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'liquidColor', value: 'rgba(180, 145, 80, 0.48)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'label', value: 'Beaker B: Mud Settled at Bottom (Unstable)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'label', value: 'Beaker A: Uniformly Clear (Stable)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'label', value: 'Beaker C: Uniformly Milky (Stable)' },
      ],
      completesAction: 'observed-stability',
    },
    {
      id: 'observe-stability-btn',
      trigger: { type: 'click', elementId: 'advance-step' },
      effects: [
        { type: 'setFlag', key: 'stabilityObserved', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'hasSediment', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'hasSuspension', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'liquidColor', value: 'rgba(180, 145, 80, 0.48)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'label', value: 'Beaker B: Mud Settled at Bottom (Unstable)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'label', value: 'Beaker A: Uniformly Clear (Stable)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'label', value: 'Beaker C: Uniformly Milky (Stable)' },
      ],
      completesAction: 'observed-stability',
    },

    // Tyndall Effect tests
    {
      id: 'tyndall-a',
      trigger: { type: 'drop', source: 'torch-light', target: 'beaker-a-mouth' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedA', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: true },
        { type: 'setFlag', key: 'tyndallTargetB', value: false },
        { type: 'setFlag', key: 'tyndallTargetC', value: false },
        { type: 'setFlag', key: 'tyndallTargetAll', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'tyndallBeam', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'tyndallPassed', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'label', value: 'Beaker A: Path Invisible (True Solution)' },
      ],
      completesAction: 'tested-tyndall-a',
    },
    {
      id: 'tyndall-a-fallback',
      trigger: { type: 'drop', source: 'torch-light', target: 'bench-zone-a' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedA', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: true },
        { type: 'setFlag', key: 'tyndallTargetB', value: false },
        { type: 'setFlag', key: 'tyndallTargetC', value: false },
        { type: 'setFlag', key: 'tyndallTargetAll', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'tyndallBeam', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'tyndallPassed', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'label', value: 'Beaker A: Path Invisible (True Solution)' },
      ],
      completesAction: 'tested-tyndall-a',
    },
    {
      id: 'tyndall-b',
      trigger: { type: 'drop', source: 'torch-light', target: 'beaker-b-mouth' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedB', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: false },
        { type: 'setFlag', key: 'tyndallTargetB', value: true },
        { type: 'setFlag', key: 'tyndallTargetC', value: false },
        { type: 'setFlag', key: 'tyndallTargetAll', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'tyndallBlocked', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'label', value: 'Beaker B: Beam Blocked by Coarse Mud (Suspension)' },
      ],
      completesAction: 'tested-tyndall-b',
    },
    {
      id: 'tyndall-b-fallback',
      trigger: { type: 'drop', source: 'torch-light', target: 'bench-zone-b' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedB', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: false },
        { type: 'setFlag', key: 'tyndallTargetB', value: true },
        { type: 'setFlag', key: 'tyndallTargetC', value: false },
        { type: 'setFlag', key: 'tyndallTargetAll', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'tyndallBlocked', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'label', value: 'Beaker B: Beam Blocked by Coarse Mud (Suspension)' },
      ],
      completesAction: 'tested-tyndall-b',
    },
    {
      id: 'tyndall-c',
      trigger: { type: 'drop', source: 'torch-light', target: 'beaker-c-mouth' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedC', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: false },
        { type: 'setFlag', key: 'tyndallTargetB', value: false },
        { type: 'setFlag', key: 'tyndallTargetC', value: true },
        { type: 'setFlag', key: 'tyndallTargetAll', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'tyndallBeam', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'label', value: 'Beaker C: ✨ Brilliant Tyndall Beam Scattered (Colloid)' },
      ],
      completesAction: 'tested-tyndall-c',
    },
    {
      id: 'tyndall-c-fallback',
      trigger: { type: 'drop', source: 'torch-light', target: 'bench-zone-c' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedC', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: false },
        { type: 'setFlag', key: 'tyndallTargetB', value: false },
        { type: 'setFlag', key: 'tyndallTargetC', value: true },
        { type: 'setFlag', key: 'tyndallTargetAll', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'tyndallBeam', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'label', value: 'Beaker C: ✨ Brilliant Tyndall Beam Scattered (Colloid)' },
      ],
      completesAction: 'tested-tyndall-c',
    },

    // Interactive Button Triggers for Precision Observation
    {
      id: 'click-tyndall-btn-a',
      trigger: { type: 'click', elementId: 'btn-tyndall-a' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedA', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: true },
        { type: 'setFlag', key: 'tyndallTargetB', value: false },
        { type: 'setFlag', key: 'tyndallTargetC', value: false },
        { type: 'setFlag', key: 'tyndallTargetAll', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'tyndallBeam', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'tyndallPassed', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'label', value: 'Beaker A: Path Invisible (True Solution)' },
      ],
      completesAction: 'tested-tyndall-a',
    },
    {
      id: 'click-tyndall-btn-b',
      trigger: { type: 'click', elementId: 'btn-tyndall-b' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedB', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: false },
        { type: 'setFlag', key: 'tyndallTargetB', value: true },
        { type: 'setFlag', key: 'tyndallTargetC', value: false },
        { type: 'setFlag', key: 'tyndallTargetAll', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'tyndallBlocked', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'label', value: 'Beaker B: Beam Blocked by Coarse Mud (Suspension)' },
      ],
      completesAction: 'tested-tyndall-b',
    },
    {
      id: 'click-tyndall-btn-c',
      trigger: { type: 'click', elementId: 'btn-tyndall-c' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedC', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: false },
        { type: 'setFlag', key: 'tyndallTargetB', value: false },
        { type: 'setFlag', key: 'tyndallTargetC', value: true },
        { type: 'setFlag', key: 'tyndallTargetAll', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'tyndallBeam', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'label', value: 'Beaker C: ✨ Brilliant Tyndall Beam Scattered (Colloid)' },
      ],
      completesAction: 'tested-tyndall-c',
    },
    {
      id: 'click-tyndall-btn-all',
      trigger: { type: 'click', elementId: 'btn-tyndall-all' },
      effects: [
        { type: 'setFlag', key: 'tyndallTestedA', value: true },
        { type: 'setFlag', key: 'tyndallTestedB', value: true },
        { type: 'setFlag', key: 'tyndallTestedC', value: true },
        { type: 'setFlag', key: 'tyndallTargetA', value: false },
        { type: 'setFlag', key: 'tyndallTargetB', value: false },
        { type: 'setFlag', key: 'tyndallTargetC', value: false },
        { type: 'setFlag', key: 'tyndallTargetAll', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'tyndallBeam', value: false },
        { type: 'setApparatusProp', apparatusId: 'beaker-solution', prop: 'tyndallPassed', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-suspension', prop: 'tyndallBlocked', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-colloid', prop: 'tyndallBeam', value: true },
      ],
      completesAction: 'tested-tyndall-a',
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'Physical Dispersion: True Solution (<1 nm), Colloid (1-1000 nm), Suspension (>1000 nm)',
    reactionType: 'Physical Dispersion',
    constants: {
      waterVolume: 50,
    },
  },

  // ── Calculation / Observation Form ──
  calculation: {
    title: 'Mixture Classification & Observations',
    instruction:
      'Classify mixtures based on particle size: True solution (<1 nm), Colloid (1-1000 nm), Suspension (>1000 nm).\n' +
      'Enter 1 for True Solution, 2 for Colloid, 3 for Suspension.',
    fields: [
      {
        id: 'sampleA',
        label: 'Beaker A (Salt in Water): 1=True Sol, 2=Colloid, 3=Suspension',
        unit: '',
        expectedValue: 1,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'sampleB',
        label: 'Beaker B (Soil in Water): 1=True Sol, 2=Colloid, 3=Suspension',
        unit: '',
        expectedValue: 3,
        tolerance: 0.1,
        toleranceType: 'absolute',
      },
      {
        id: 'sampleC',
        label: 'Beaker C (Starch in Water): 1=True Sol, 2=Colloid, 3=Suspension',
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
        id: 'viva-q1',
        question: 'Which mixture clearly exhibits the Tyndall effect?',
        options: ['Salt in water', 'Starch in water', 'Sugar in water', 'Alum in water'],
        correctIndex: 1,
        explanation: 'Colloid particles (1 to 1000 nm) are sufficiently large to scatter a beam of light, illuminating its path.',
      },
      {
        id: 'viva-q2',
        question: 'What happens when chalk powder or soil in water is left undisturbed for 5 minutes?',
        options: ['Stays uniformly dispersed', 'Forms a true solution', 'Particles settle at the bottom under gravity', 'Turns clear transparent'],
        correctIndex: 2,
        explanation: 'Suspension particles are larger than 1000 nm and gradually settle at the bottom under gravity due to density difference.',
      },
      {
        id: 'viva-q3',
        question: 'Which of these passes completely through filter paper but still scatters a beam of light?',
        options: ['Suspension', 'Colloid', 'True solution', 'Fine sand in water'],
        correctIndex: 1,
        explanation: 'Colloidal particles pass through conventional laboratory filter paper pores but are large enough to scatter visible light.',
      },
      {
        id: 'viva-q4',
        question: 'A true solution is characterized as:',
        options: ['Heterogeneous and opaque', 'Homogeneous and transparent', 'Heterogeneous and translucent', 'Unstable on standing'],
        correctIndex: 1,
        explanation: 'Solute particles in a true solution are below 1 nm, forming a single homogeneous, clear transparent, and stable phase.',
      },
    ],
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Glassware & Water Preparation',
      maxPoints: 15,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Beaker A: 50 mL water added', points: 5, flag: 'hasWaterA' },
          { label: 'Beaker B: 50 mL water added', points: 5, flag: 'hasWaterB' },
          { label: 'Beaker C: 50 mL water added', points: 5, flag: 'hasWaterC' },
        ],
      },
    },
    {
      name: 'Mixture Preparation & Proper Stirring Technique',
      maxPoints: 30,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Salt added to Beaker A', points: 3, flag: 'hasSalt' },
          { label: 'Beaker A stirred with glass rod', points: 5, flag: 'stirredA' },
          { label: 'Soil added to Beaker B', points: 3, flag: 'hasSoil' },
          { label: 'Beaker B stirred with glass rod', points: 5, flag: 'stirredB' },
          { label: 'Starch paste added to Beaker C', points: 3, flag: 'hasStarch' },
          { label: 'Beaker C stirred with glass rod', points: 5, flag: 'stirredC' },
          { label: 'Stability & sedimentation observed after rest', points: 6, flag: 'stabilityObserved' },
        ],
      },
    },
    {
      name: 'Tyndall Scattering Optical Examination (All 3 Beakers)',
      maxPoints: 20,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Beaker A optical test (Invisible path / true solution)', points: 6, flag: 'tyndallTestedA' },
          { label: 'Beaker B optical test (Total beam extinction / coarse suspension)', points: 7, flag: 'tyndallTestedB' },
          { label: 'Beaker C optical test (Tyndall scattering cone / colloid)', points: 7, flag: 'tyndallTestedC' },
        ],
      },
    },
    {
      name: 'Mixture Classification & Observation Table',
      maxPoints: 20,
      evaluator: {
        type: 'multiCheck',
        checks: [
          { label: 'Sample A classified as True Solution (1)', points: 6, calcFieldId: 'sampleA', expectedValue: 1, tolerance: 0.1 },
          { label: 'Sample B classified as Suspension (3)', points: 7, calcFieldId: 'sampleB', expectedValue: 3, tolerance: 0.1 },
          { label: 'Sample C classified as Colloid (2)', points: 7, calcFieldId: 'sampleC', expectedValue: 2, tolerance: 0.1 },
        ],
      },
    },
    {
      name: 'Viva Voce Conceptual Examination',
      maxPoints: 15,
      evaluator: {
        type: 'vivaQuiz',
      },
    },
  ],
  validation: [],
};
