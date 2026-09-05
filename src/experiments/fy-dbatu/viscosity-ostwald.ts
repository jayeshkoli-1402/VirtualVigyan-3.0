/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Determination of Viscosity by Ostwald's Viscometer
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Formula: η_A = (t_A * d_A) / (t_W * d_W) * η_W
 *  Reports viscosity in poise.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const viscosityOstwald: ExperimentConfig = {
  id: 'viscosity-ostwald',
  title: "Determination of Viscosity by Ostwald's Viscometer",
  subtitle: 'η_A = (t_A · d_A) / (t_W · d_W) · η_W',
  description:
    "Measure the flow time of a test liquid and water through Ostwald's capillary viscometer to determine its coefficient of viscosity in poise.",
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'medium',
  themeColor: '#0ea5e9',
  icon: '⏱️',
  estimatedMinutes: 18,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'viscometer',
      component: 'OstwaldViscometer',
      label: "Ostwald's Viscometer",
      icon: '🧪',
      initialProps: {
        liquidLevel: 0,
        liquidColor: 'rgba(56, 189, 248, 0.65)',
        width: 140,
        height: 250,
      },
    },
    {
      id: 'stopwatch',
      component: 'Stopwatch',
      label: 'Digital Stopwatch',
      icon: '⏱️',
      initialProps: { width: 110, height: 120 },
    },
    {
      id: 'chromic-acid',
      component: 'ReagentBottle',
      label: 'Chromic Acid',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(234, 88, 12, 0.85)', label: 'Chromic Acid' },
    },
    {
      id: 'acetone',
      component: 'ReagentBottle',
      label: 'Acetone (Rinse)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.5)', label: 'Acetone' },
    },
    {
      id: 'liquid-sample',
      component: 'ReagentBottle',
      label: 'Liquid Sample A',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(14, 165, 233, 0.75)', label: 'Sample A' },
    },
    {
      id: 'distilled-water',
      component: 'ReagentBottle',
      label: 'Distilled Water',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.45)', label: 'Water' },
    },
    {
      id: 'suction-bulb',
      component: 'Dropper',
      label: 'Suction Bulb & Tube',
      icon: '🎈',
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'stand-clamp-zone',
      label: 'Clamp onto Retort Stand',
      accepts: ['viscometer'],
      position: { x: 50, y: 50 },
      size: { width: 26, height: 50 },
      rejectMessage: 'Clamp the viscometer securely on the stand.',
    },
    {
      id: 'visco-broad-end',
      label: 'Into Broad Limb (Bulb B)',
      accepts: ['chromic-acid', 'acetone', 'liquid-sample', 'distilled-water'],
      position: { x: 44, y: 35 },
      size: { width: 14, height: 22 },
      rejectMessage: 'Pour liquid into the broad arm of the viscometer.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'viscometer' },
    },
    {
      id: 'visco-capillary-end',
      label: 'Suction Tube on Capillary Limb',
      accepts: ['suction-bulb'],
      position: { x: 56, y: 32 },
      size: { width: 14, height: 22 },
      rejectMessage: 'Attach suction tube to the narrow capillary arm.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'viscometer' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      { component: 'RetortStand', position: { x: 50, y: 55 }, scale: 1.15 },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'mount',
      label: '1. Mount Viscometer',
      instruction: 'Drag the Ostwald viscometer onto the retort stand and ensure it is mounted vertically.',
      requiredActions: ['mount-viscometer'],
      type: 'lab',
    },
    {
      id: 'clean',
      label: '2. Clean & Dry',
      instruction: 'Clean the viscometer with chromic acid, rinse with acetone, and dry completely.',
      requiredActions: ['rinse-acetone'],
      type: 'lab',
    },
    {
      id: 'add-sample',
      label: '3. Add Sample Liquid',
      instruction: 'Introduce the given liquid sample into the broad limb of the viscometer.',
      requiredActions: ['add-sample'],
      type: 'lab',
    },
    {
      id: 'suck-upper',
      label: '4. Raise Above Upper Mark',
      instruction: 'Attach the suction tube to the capillary limb to suck the liquid above upper mark C.',
      requiredActions: ['suck-liquid'],
      type: 'lab',
    },
    {
      id: 'flow-timing',
      label: '5. Time Flow to Lower Mark',
      instruction: 'Release liquid. When it reaches upper mark C, stopwatch starts; record flow time down to lower mark D.',
      requiredActions: ['time-sample'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'water-reference',
      label: '6. Determine Water Flow Time',
      instruction: 'Repeat the procedure using distilled water to determine standard flow time t_W. Click Continue when observed.',
      requiredActions: ['add-water'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '7. Calculations & Viva',
      instruction: "Calculate the viscosity coefficient of Liquid A using Ostwald's relative viscosity formula.",
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '8. Evaluation Results',
      instruction: 'Review your laboratory precision and viva performance.',
      requiredActions: [],
      type: 'results',
    },
  ],

  // ── Interactions ──
  interactions: [
    {
      id: 'inter-mount',
      trigger: { type: 'drop', source: 'viscometer', target: 'stand-clamp-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'viscometer', zoneId: 'stand-clamp-zone' },
        { type: 'setFlag', key: 'isMounted', value: true },
      ],
      completesAction: 'mount-viscometer',
    },
    {
      id: 'inter-clean-chromic',
      trigger: { type: 'drop', source: 'chromic-acid', target: 'visco-broad-end' },
      conditions: [{ type: 'flag', key: 'isMounted', equals: true }],
      blockMessage: 'Mount the viscometer vertically on the stand first.',
      effects: [
        { type: 'setFlag', key: 'cleanedChromic', value: true },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0.3 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidColor', value: 'rgba(234, 88, 12, 0.4)' },
      ],
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-rinse-acetone',
      trigger: { type: 'drop', source: 'acetone', target: 'visco-broad-end' },
      conditions: [{ type: 'flag', key: 'cleanedChromic', equals: true }],
      blockMessage: 'Wash with chromic acid first to remove organic grease.',
      effects: [
        { type: 'setFlag', key: 'isCleanedAndDry', value: true },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'label', value: 'Clean & Dry Viscometer' },
      ],
      completesAction: 'rinse-acetone',
      animation: { type: 'pour', durationMs: 800, animatingFlag: 'isRinsing' },
    },
    {
      id: 'inter-add-sample',
      trigger: { type: 'drop', source: 'liquid-sample', target: 'visco-broad-end' },
      conditions: [{ type: 'flag', key: 'isCleanedAndDry', equals: true }],
      blockMessage: 'Clean and dry the viscometer with acetone before adding test sample.',
      effects: [
        { type: 'setFlag', key: 'sampleIntroduced', value: true },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0.6 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidColor', value: 'rgba(14, 165, 233, 0.75)' },
      ],
      completesAction: 'add-sample',
      animation: { type: 'pour', durationMs: 900, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-suck-liquid',
      trigger: { type: 'drop', source: 'suction-bulb', target: 'visco-capillary-end' },
      conditions: [{ type: 'flag', key: 'sampleIntroduced', equals: true }],
      blockMessage: 'Introduce the liquid sample into the broad arm first.',
      effects: [
        { type: 'setFlag', key: 'suckedAboveMark', value: true },
        { type: 'setVariable', key: 'flowProgress', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0.95 },
      ],
      completesAction: 'suck-liquid',
      animation: { type: 'color-change', durationMs: 800, animatingFlag: 'isSucking' },
    },
    {
      id: 'inter-start-stopwatch',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [{ type: 'flag', key: 'suckedAboveMark', equals: true }],
      effects: [
        { type: 'setFlag', key: 'timerRunning', value: false },
        { type: 'setFlag', key: 'sampleTimed', value: true },
        { type: 'setVariable', key: 'timerSeconds', value: 24.5 },
        { type: 'setVariable', key: 'flowTimeSample', value: 24.5 },
        { type: 'setVariable', key: 'flowProgress', value: 1.0 },
      ],
      completesAction: 'time-sample',
    },
    {
      id: 'inter-add-water',
      trigger: { type: 'drop', source: 'distilled-water', target: 'visco-broad-end' },
      conditions: [{ type: 'flag', key: 'sampleTimed', equals: true }],
      blockMessage: 'Finish liquid sample timing first.',
      effects: [
        { type: 'setFlag', key: 'waterTimed', value: true },
        { type: 'setVariable', key: 'timerSeconds', value: 18.2 },
        { type: 'setVariable', key: 'flowTimeWater', value: 18.2 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
      ],
      completesAction: 'add-water',
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: 'Capillary fluid flow governed by Poiseuille’s Law: η = (π P r⁴ t) / (8 V L)',
    reactionType: 'Viscometry / Fluid Mechanics',
    constants: {
      densityWater: 1.0,          // g/cm³
      densitySample: 0.79,        // g/cm³ (e.g. ethanol / acetone mixture)
      viscosityWater: 0.0089,     // poise at 25°C
    },
    formulas: {
      viscositySample: {
        label: 'Viscosity of Liquid A',
        displayFormula: 'η_A = (t_A · d_A) / (t_W · d_W) · η_W = (24.5 · 0.79) / (18.2 · 1.0) · 0.0089',
        computeFn: 'viscosityOstwald',
        inputs: ['flowTimeSample', 'densitySample', 'flowTimeWater', 'densityWater', 'viscosityWater'],
        unit: 'poise',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: "Ostwald Viscometer Observations & Calculations",
    instruction: "Calculate the viscosity of Liquid A using your recorded flow times:",
    fields: [
      {
        id: 'viscosityValue',
        label: "1. Coefficient of Viscosity η_A (in poise): η_A = (t_A·d_A)/(t_W·d_W)·η_W  [Given: t_A=24.5s, d_A=0.79, t_W=18.2s, d_W=1.0, η_W=0.0089 P]",
        placeholder: 'e.g. 0.00946',
        unit: 'poise',
        expectedFormulaName: 'viscosityOstwald',
        tolerance: 0.0005,
        toleranceType: 'absolute',
      },
      {
        id: 'unitQuestion',
        label: "2. What is 1 Poise in SI units (Pa·s)? (Enter numerical value: 1 Poise = ___ Pa·s)",
        placeholder: 'e.g. 0.1',
        unit: 'Pa·s',
        expectedValue: 0.1,
        tolerance: 0.01,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Scoring Rubric ──
  scoring: [
    {
      name: 'Mounting & Alignment',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'isMounted', truePoints: 20 },
    },
    {
      name: 'Apparatus Cleaning & Drying',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'isCleanedAndDry', truePoints: 20 },
    },
    {
      name: 'Flow Measurement Precision',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'waterTimed', truePoints: 20 },
    },
    {
      name: 'Viscosity Calculation (η_A)',
      maxPoints: 25,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'viscosityValue',
        correctPoints: 25,
        incorrectPoints: 0,
      },
    },
    {
      name: 'Units & Physical Constants Viva',
      maxPoints: 15,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'unitQuestion',
        correctPoints: 15,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'tilt-warning',
      trigger: 'drop:viscometer→stand-clamp-zone',
      condition: { type: 'flag', key: 'isMounted', equals: false },
      message: 'Keep the viscometer strictly vertical to avoid capillary pressure error.',
      blocking: false,
    },
    {
      id: 'timing-before-suck',
      trigger: 'drop:suction-bulb→visco-capillary-end',
      condition: { type: 'flag', key: 'sampleIntroduced', equals: false },
      message: 'Add the test liquid to the broad limb before attempting suction.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    flowTimeSample: 24.5,
    densitySample: 0.79,
    flowTimeWater: 18.2,
    densityWater: 1.0,
    viscosityWater: 0.0089,
    timerSeconds: 0,
    flowProgress: 0,
  },
  initialFlags: {
    isMounted: false,
    cleanedChromic: false,
    isCleanedAndDry: false,
    sampleIntroduced: false,
    suckedAboveMark: false,
    sampleTimed: false,
    waterTimed: false,
    timerRunning: false,
  },
};
