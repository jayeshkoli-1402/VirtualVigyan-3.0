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
  underDevelopment: false,
  adminOnly: false,

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
      id: 'thermometer',
      component: 'Thermometer',
      label: 'Lab Thermometer (-10 to 110 °C)',
      icon: '🌡️',
      initialProps: { width: 45, height: 175, temperature: 25 },
    },
    {
      id: 'crushed-ice-bottle',
      component: 'ReagentBottle',
      label: 'Crushed Ice (100 g)',
      icon: '🧊',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.95)', label: 'Crushed Ice' },
    },
    {
      id: 'glass-rod',
      component: 'GlassRod',
      label: 'Glass Stirrer',
      icon: '🥢',
      initialProps: { width: 14, height: 160 },
    },
    {
      id: 'bunsen-burner',
      component: 'BunsenBurner',
      label: 'Bunsen Burner Flame',
      icon: '🔥',
      prePlaced: true,
      initialProps: { width: 85, height: 125, isLit: true },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'burner-top-zone',
      label: 'Over Burner on Tripod Stand',
      accepts: ['beaker-water', 'thermometer', 'crushed-ice-bottle', 'glass-rod'],
      position: { x: 50, y: 56 },
      size: { width: 22, height: 28 },
      rejectMessage: 'Place the beaker over the tripod stand above the burner.',
    },
    {
      id: 'thermometer-clamp-zone',
      label: 'Clamp Thermometer into Beaker',
      accepts: ['thermometer', 'crushed-ice-bottle', 'glass-rod'],
      position: { x: 50, y: 44 },
      size: { width: 22, height: 26 },
      rejectMessage: 'Clamp the thermometer inside the beaker from the stand.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'beaker-water' },
    },
    {
      id: 'beaker-mouth-zone',
      label: 'Into Beaker',
      accepts: ['crushed-ice-bottle', 'thermometer', 'glass-rod'],
      position: { x: 50, y: 48 },
      size: { width: 20, height: 24 },
      rejectMessage: 'Add ice or stir with glass rod.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'beaker-water' },
    },
  ],

  bench: {
    backgroundElements: [
      {
        component: 'RetortStand',
        position: { x: 36, y: 49 },
        scale: 1.15,
        props: { label: 'Retort Stand & Clamp', hideLowerClamp: true, hideUpperClamp: true, opacity: 0.85 },
      },
      {
        component: 'BunsenBurner',
        position: { x: 50, y: 76 },
        scale: 0.95,
        props: { label: 'Bunsen Burner Flame', isLit: true },
      },
      {
        component: 'Tripod',
        position: { x: 50, y: 68 },
        scale: 1.05,
        props: { label: 'Tripod Stand & Wire Gauze', opacity: 0.8 },
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-apparatus',
      label: 'Setup Beaker & Thermometer',
      instruction: 'Place the beaker over the burner on the tripod stand and clamp the thermometer inside without touching the beaker bottom.',
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
      instruction: 'Heat gently while stirring. Notice the temperature remains constant at 0 °C (latent heat of fusion) until all ice melts. Click "Continue" after observing.',
      requiredActions: [],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'heat-to-boil',
      label: 'Boil & Observe Plateau (100 °C)',
      instruction: 'Continue heating liquid water. Observe temperature rise to 100 °C where vigorous boiling begins and temperature stabilizes. Click "Continue" after observing.',
      requiredActions: [],
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
      id: 'clamp-thermometer-tripod-act',
      trigger: { type: 'drop', source: 'thermometer', target: 'burner-top-zone' },
      conditions: [{ type: 'apparatusPlaced', apparatusId: 'beaker-water' }],
      effects: [
        { type: 'placeApparatus', apparatusId: 'thermometer', zoneId: 'thermometer-clamp-zone' },
        { type: 'setFlag', key: 'thermometerInserted', value: true },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'isClamped', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Beaker with Clamped Thermometer' },
      ],
      completesAction: 'insert-thermometer',
    },
    {
      id: 'clamp-thermometer-direct-act',
      trigger: { type: 'drop', source: 'thermometer', target: 'thermometer-clamp-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'thermometer', zoneId: 'thermometer-clamp-zone' },
        { type: 'setFlag', key: 'thermometerInserted', value: true },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'isClamped', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Beaker with Clamped Thermometer' },
      ],
      completesAction: 'insert-thermometer',
    },
    {
      id: 'insert-thermometer-mouth-act',
      trigger: { type: 'drop', source: 'thermometer', target: 'beaker-mouth-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'thermometer', zoneId: 'thermometer-clamp-zone' },
        { type: 'setFlag', key: 'thermometerInserted', value: true },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'isClamped', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Beaker with Clamped Thermometer' },
      ],
      completesAction: 'insert-thermometer',
    },
    {
      id: 'add-ice-act',
      trigger: { type: 'drop', source: 'crushed-ice-bottle', target: 'beaker-mouth-zone' },
      conditions: [{ type: 'flag', key: 'thermometerInserted', equals: true }],
      blockMessage: 'Clamp the thermometer inside the beaker first before adding ice.',
      effects: [
        { type: 'setFlag', key: 'iceAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidLevel', value: 0.50 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'temperature', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Crushed Ice (T = 0.0 °C)' },
      ],
      completesAction: 'added-ice',
    },
    {
      id: 'add-ice-clamp-zone-act',
      trigger: { type: 'drop', source: 'crushed-ice-bottle', target: 'thermometer-clamp-zone' },
      conditions: [{ type: 'flag', key: 'thermometerInserted', equals: true }],
      blockMessage: 'Clamp the thermometer inside the beaker first before adding ice.',
      effects: [
        { type: 'setFlag', key: 'iceAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidLevel', value: 0.50 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'temperature', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Crushed Ice (T = 0.0 °C)' },
      ],
      completesAction: 'added-ice',
    },
    {
      id: 'add-ice-tripod-act',
      trigger: { type: 'drop', source: 'crushed-ice-bottle', target: 'burner-top-zone' },
      conditions: [{ type: 'flag', key: 'thermometerInserted', equals: true }],
      blockMessage: 'Clamp the thermometer inside the beaker first before adding ice.',
      effects: [
        { type: 'setFlag', key: 'iceAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidLevel', value: 0.50 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.88)' },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'temperature', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Crushed Ice (T = 0.0 °C)' },
      ],
      completesAction: 'added-ice',
    },
    {
      id: 'stir-ice-mouth-act',
      trigger: { type: 'drop', source: 'glass-rod', target: 'beaker-mouth-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'glass-rod', zoneId: 'beaker-mouth-zone' },
        { type: 'setFlag', key: 'glassRodUsed', value: true },
        { type: 'setFlag', key: 'stirring', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'isStirring', value: true },
      ],
    },
    {
      id: 'stir-ice-clamp-act',
      trigger: { type: 'drop', source: 'glass-rod', target: 'thermometer-clamp-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'glass-rod', zoneId: 'beaker-mouth-zone' },
        { type: 'setFlag', key: 'glassRodUsed', value: true },
        { type: 'setFlag', key: 'stirring', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'isStirring', value: true },
      ],
    },
    {
      id: 'stir-ice-tripod-act',
      trigger: { type: 'drop', source: 'glass-rod', target: 'burner-top-zone' },
      conditions: [{ type: 'apparatusPlaced', apparatusId: 'beaker-water' }],
      effects: [
        { type: 'placeApparatus', apparatusId: 'glass-rod', zoneId: 'beaker-mouth-zone' },
        { type: 'setFlag', key: 'glassRodUsed', value: true },
        { type: 'setFlag', key: 'stirring', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'isStirring', value: true },
      ],
    },
    {
      id: 'melt-ice-btn',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [
        { type: 'flag', key: 'iceAdded', equals: true },
        { type: 'flag', key: 'iceMelted', equals: false },
      ],
      effects: [
        { type: 'setFlag', key: 'iceMelted', value: true },
        { type: 'setVariable', key: 'iceMeltProgress', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Melted Liquid Water (0.0 °C Latent Heat Plateau)' },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'temperature', value: 0 },
      ],
      completesAction: 'ice-melted',
    },
    {
      id: 'boil-water-btn',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [
        { type: 'flag', key: 'iceMelted', equals: true },
        { type: 'flag', key: 'waterBoiled', equals: false },
      ],
      effects: [
        { type: 'setFlag', key: 'waterBoiled', value: true },
        { type: 'setVariable', key: 'temperature', value: 100.0 },
        { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'temperature', value: 100 },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'isReacting', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'gasEvolving', value: true },
        { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Vigorous Boiling at 100.0 °C (Steam bubbles, Latent Heat)' },
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
      evaluator: { type: 'vivaQuiz' },
    },
  ],
  validation: [],

  // ── Continuous Updates (100ms TICK engine loop) ──
  continuousUpdates: [
    {
      // Melting ice plateau: ice melts into water at constant 0.0 °C (latent heat of fusion)
      condition: {
        type: 'and',
        conditions: [
          { type: 'flag', key: 'iceAdded', equals: true },
          { type: 'flag', key: 'iceMelted', equals: false },
          { type: 'variable', key: 'iceMeltProgress', op: '<', value: 1.0 },
        ],
      },
      increments: {
        iceMeltProgress: 0.12, // Melts in ~8 seconds
      },
      onConditionMet: [
        {
          condition: {
            type: 'variable',
            key: 'iceMeltProgress',
            op: '>=',
            value: 1.0,
          },
          effects: [
            { type: 'setFlag', key: 'iceMelted', value: true },
            { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
            { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Melted Liquid Water (0.0 °C Latent Heat Plateau)' },
            { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'temperature', value: 0 },
          ],
          completesAction: 'ice-melted',
        },
      ],
    },
    {
      // Active stirring with glass rod accelerates ice melting rate
      condition: {
        type: 'and',
        conditions: [
          { type: 'flag', key: 'iceAdded', equals: true },
          { type: 'flag', key: 'iceMelted', equals: false },
          { type: 'flag', key: 'glassRodUsed', equals: true },
          { type: 'variable', key: 'iceMeltProgress', op: '<', value: 1.0 },
        ],
      },
      increments: {
        iceMeltProgress: 0.15,
      },
    },
    {
      // Heating liquid water towards 100 °C boiling point
      condition: {
        type: 'and',
        conditions: [
          { type: 'flag', key: 'iceMelted', equals: true },
          { type: 'flag', key: 'waterBoiled', equals: false },
          { type: 'variable', key: 'temperature', op: '<', value: 100.0 },
        ],
      },
      increments: {
        temperature: 9.5, // Climbs smoothly to 100 °C in ~10 seconds
      },
      onConditionMet: [
        {
          condition: {
            type: 'variable',
            key: 'temperature',
            op: '>=',
            value: 100.0,
          },
          effects: [
            { type: 'setFlag', key: 'waterBoiled', value: true },
            { type: 'setApparatusProp', apparatusId: 'thermometer', prop: 'temperature', value: 100 },
            { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'isReacting', value: true },
            { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'gasEvolving', value: true },
            { type: 'setApparatusProp', apparatusId: 'beaker-water', prop: 'label', value: 'Vigorous Boiling at 100.0 °C (Steam bubbles, Latent Heat)' },
          ],
          completesAction: 'water-boiled',
        },
      ],
    },
  ],

  // ── Initial State ──
  initialVariables: {
    iceMeltProgress: 0,
    temperature: 0,
  },
  initialFlags: {
    thermometerInserted: false,
    iceAdded: false,
    glassRodUsed: false,
    stirring: false,
    iceMelted: false,
    waterBoiled: false,
  },
};
