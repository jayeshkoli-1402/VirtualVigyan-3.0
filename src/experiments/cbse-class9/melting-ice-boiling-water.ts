/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Melting Point of Ice and Boiling Point of Water
 *  CBSE Class 9 Science — Matter in Our Surroundings
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Phase Transitions:
 *  1. H₂O(s) ⇌ H₂O(l) at 0 °C (273 K) — Latent heat of fusion
 *  2. H₂O(l) ⇌ H₂O(g) at 100 °C (373 K) — Latent heat of vaporization
 *  Temperature remains constant during phase change.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const meltingIceBoilingWater: ExperimentConfig = {
  id: 'melting-ice-boiling-water',
  title: 'Melting Point of Ice & Boiling Point of Water',
  subtitle: 'Temperature vs Time Phase Transition & Latent Heat Plateaus',
  description:
    'Measure the temperature at which ice melts and water boils. Observe the constant temperature plateaus during phase changes caused by latent heat of fusion (0 °C) and latent heat of vaporization (100 °C).',
  class: 9,
  subject: 'Chemistry',
  chapter: 'Matter in Our Surroundings',
  difficulty: 'easy',
  themeColor: '#0ea5e9',
  icon: '🧊',
  estimatedMinutes: 30,
  underDevelopment: true,
  adminOnly: true,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'beaker-water',
      component: 'Beaker',
      label: '250 mL Pyrex Beaker',
      icon: '🥛',
      initialProps: { width: 120, height: 145, liquidLevel: 0, label: '250 mL Beaker' },
    },
    {
      id: 'crushed-ice-bottle',
      component: 'ReagentBottle',
      label: 'Crushed Ice (100 g)',
      icon: '🧊',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.95)', label: 'Crushed Ice' },
    },
    {
      id: 'thermometer',
      component: 'Thermometer',
      label: 'Lab Thermometer (-10 to 110 °C)',
      icon: '🌡️',
      initialProps: { width: 35, height: 160, temperature: 25 },
    },
    {
      id: 'bunsen-burner',
      component: 'BunsenBurner',
      label: 'Bunsen Burner Flame',
      icon: '🔥',
      initialProps: { width: 85, height: 125, isLit: true },
    },
    {
      id: 'glass-rod',
      component: 'GlassRod',
      label: 'Glass Stirrer',
      icon: '🥢',
      initialProps: { width: 14, height: 160 },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'burner-top-zone',
      label: 'Over Burner on Tripod Stand',
      accepts: ['beaker-water'],
      position: { x: 50, y: 62 },
      size: { width: 22, height: 28 },
      rejectMessage: 'Place the beaker over the tripod stand above the burner.',
    },
    {
      id: 'beaker-mouth-zone',
      label: 'Into Beaker',
      accepts: ['crushed-ice-bottle', 'thermometer', 'glass-rod'],
      position: { x: 50, y: 48 },
      size: { width: 18, height: 22 },
      rejectMessage: 'Add ice or insert thermometer into beaker.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'beaker-water' },
    },
  ],

  bench: {
    backgroundElements: [],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-apparatus',
      label: 'Setup Beaker & Thermometer',
      instruction: 'Place the beaker over the burner and clamp the thermometer inside without touching the beaker bottom.',
      requiredActions: ['place-beaker', 'insert-thermometer'],
      type: 'lab',
    },
    {
      id: 'add-ice',
      label: 'Add Crushed Ice',
      instruction: 'Add crushed ice into the beaker. Observe the thermometer drop and stabilize at 0 °C.',
      requiredActions: ['added-ice'],
      type: 'lab',
    },
    {
      id: 'melt-ice',
      label: 'Observe Melting Plateau (0 °C)',
      instruction: 'Heat gently while stirring. Notice the temperature remains constant at 0 °C (latent heat of fusion) until all ice melts.',
      requiredActions: ['ice-melted'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'heat-to-boil',
      label: 'Boil & Observe Plateau (100 °C)',
      instruction: 'Continue heating liquid water. Observe temperature rise to 100 °C where vigorous boiling begins and temperature stabilizes.',
      requiredActions: ['water-boiled'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: 'Report Transitions & Kelvin Conversion',
      instruction: 'Enter observed melting and boiling points in Celsius and convert to Kelvin: T(K) = T(°C) + 273.',
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
      id: 'place-beaker-act',
      trigger: { type: 'drop', source: 'beaker-water', target: 'burner-top-zone' },
      effects: [{ type: 'placeApparatus', apparatusId: 'beaker-water', zoneId: 'burner-top-zone' }],
      completesAction: 'place-beaker',
    },
    {
      id: 'insert-thermometer-act',
      trigger: { type: 'drop', source: 'thermometer', target: 'beaker-mouth-zone' },
      effects: [
        { type: 'setFlag', key: 'thermometerInserted', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Beaker with Clamped Thermometer' },
      ],
      completesAction: 'insert-thermometer',
    },
    {
      id: 'add-ice-act',
      trigger: { type: 'drop', source: 'crushed-ice-bottle', target: 'beaker-mouth-zone' },
      conditions: [{ type: 'flag', key: 'thermometerInserted', equals: true }],
      blockMessage: 'Insert the thermometer first.',
      effects: [
        { type: 'setFlag', key: 'iceAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidLevel', value: 0.45 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.85)' },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'temperature', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Crushed Ice (T = 0.0 °C)' },
      ],
      completesAction: 'added-ice',
    },
    {
      id: 'melt-ice-btn',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [{ type: 'flag', key: 'iceAdded', equals: true }],
      effects: [
        { type: 'setFlag', key: 'iceMelted', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Melted Water (0 °C Latent Heat of Fusion Plateau)' },
      ],
      completesAction: 'ice-melted',
    },
    {
      id: 'boil-water-btn',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [{ type: 'flag', key: 'iceMelted', equals: true }],
      effects: [
        { type: 'setFlag', key: 'waterBoiled', value: true },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'temperature', value: 100 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'isReacting', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Vigorous Boiling at 100 °C (Steam bubbles, Latent Heat)' },
      ],
      completesAction: 'water-boiled',
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'H2O(s) <=> H2O(l) at 0 C (273 K); H2O(l) -> H2O(g) at 100 C (373 K)',
    reactionType: 'Phase Transition / Latent Heat',
    constants: {
      meltingPointC: 0.0,
      boilingPointC: 100.0,
      meltingPointK: 273.15,
      boilingPointK: 373.15,
    },
  },

  // ── Calculation ──
  calculation: {
    title: 'Phase Change Temperatures & Kelvin Scale',
    instruction:
      'Enter the measured melting point of ice and boiling point of water in Celsius, and convert to Kelvin: T(K) = T(°C) + 273.',
    fields: [
      {
        id: 'meltingC',
        label: 'Melting Point of Ice (°C)',
        unit: '°C',
        expectedValue: 0,
        tolerance: 1.0,
        toleranceType: 'absolute',
      },
      {
        id: 'boilingC',
        label: 'Boiling Point of Water (°C)',
        unit: '°C',
        expectedValue: 100,
        tolerance: 1.0,
        toleranceType: 'absolute',
      },
      {
        id: 'meltingK',
        label: 'Melting Point of Ice (K)',
        unit: 'K',
        expectedValue: 273,
        tolerance: 1.0,
        toleranceType: 'absolute',
      },
      {
        id: 'boilingK',
        label: 'Boiling Point of Water (K)',
        unit: 'K',
        expectedValue: 373,
        tolerance: 1.0,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Viva ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'Why does the temperature of ice remain constant at 0 °C while it is melting?',
        options: [
          'The thermometer ceases to function during phase transition',
          'Supplied heat is absorbed as latent heat of fusion to break intermolecular hydrogen bonds',
          'Ice stops absorbing heat energy from the flame',
          'The burner flame is too weak to heat ice',
        ],
        correctIndex: 1,
        explanation: 'During melting, heat energy is utilized as latent heat of fusion to overcome crystal lattice forces without increasing the kinetic energy (temperature) of the molecules.',
      },
      {
        id: 'q2',
        question: 'What is the standard boiling point of pure water in the absolute Kelvin temperature scale?',
        options: ['273 K', '100 K', '373 K', '173 K'],
        correctIndex: 2,
        explanation: 'T(K) = T(°C) + 273. For boiling water at 100 °C: 100 + 273 = 373 K.',
      },
      {
        id: 'q3',
        question: 'During temperature measurement, why should the thermometer bulb NOT touch the bottom or walls of the beaker?',
        options: [
          'The liquid will freeze onto the thermometer',
          'The beaker bottom receives direct heat from the flame and would give an erroneously high temperature',
          'The glass rod needs space to stir',
          'Mercury expands too fast in contact with Pyrex glass',
        ],
        correctIndex: 1,
        explanation: 'The glass bottom of the beaker is in direct contact with the flame/wire gauze and is hotter than the bulk liquid, causing a false high temperature reading.',
      },
    ],
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Apparatus Setup & Thermometer Placement',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'thermometerInserted', truePoints: 20 },
    },
    {
      name: 'Melting Plateau Observation (0 °C)',
      maxPoints: 40,
      evaluator: { type: 'booleanCheck', flag: 'iceMelted', truePoints: 40 },
    },
    {
      name: 'Boiling Plateau Observation (100 °C)',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'waterBoiled', truePoints: 25 },
    },
    {
      name: 'Viva Voce Evaluation',
      maxPoints: 15,
      evaluator: { type: 'booleanCheck', flag: 'iceAdded', truePoints: 15 },
    },
  ],
  validation: [],
};
