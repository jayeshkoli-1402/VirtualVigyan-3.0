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
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.5)', label: 'Acetone (Rinse)' },
    },
    {
      id: 'liquid-sample',
      component: 'ReagentBottle',
      label: 'Liquid Sample A',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(14, 165, 233, 0.75)', label: 'Liquid Sample A' },
    },
    {
      id: 'distilled-water',
      component: 'ReagentBottle',
      label: 'Distilled Water',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.45)', label: 'Distilled Water' },
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
      label: 'Broad Limb',
      accepts: ['chromic-acid', 'acetone', 'liquid-sample', 'distilled-water'],
      position: { x: 46.5, y: 24.5 },
      size: { width: 10, height: 16 },
      rejectMessage: 'Pour liquid into the broad limb of the viscometer.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'viscometer' },
    },
    {
      id: 'visco-capillary-end',
      label: 'Capillary Limb',
      accepts: ['suction-bulb'],
      position: { x: 53.5, y: 24.5 },
      size: { width: 10, height: 16 },
      rejectMessage: 'Attach suction tube to the narrow capillary limb.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'viscometer' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      { component: 'RetortStand', props: { hideLowerClamp: true }, position: { x: 44, y: 52 }, scale: 1.1 },
      { component: 'Stopwatch', position: { x: 78, y: 50 }, scale: 1.05 },
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
      instruction: 'Clean the viscometer with chromic acid, drain it to waste, rinse with acetone, and dry completely.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'isCleanedAndDry', equals: true },
          instruction: '✓ Viscometer thoroughly cleaned and dried with acetone! Proceed to adding test sample.',
        },
        {
          condition: { type: 'flag', key: 'chromicDrained', equals: true },
          instruction: 'Chromic acid drained! Now pour Acetone into the broad limb to rinse and dry completely.',
        },
        {
          condition: { type: 'flag', key: 'cleanedChromic', equals: true },
          instruction: 'Viscometer filled with Chromic Acid. Click "Drain Chromic Acid to Waste" below to empty it.',
        },
      ],
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
      instruction: 'Liquid A is ready above mark C — start the stopwatch to begin timing.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'sampleTimed', equals: true },
          instruction: '✓ Liquid A flow timing complete! Recorded flow time. You can resume dropping, restart from Mark C, or click "Continue to Water Reference".',
        },
        {
          condition: { type: 'flag', key: 'sampleStoppedEarly', equals: true },
          instruction: '⚠️ Liquid has not reached Mark D yet. Resume the flow and continue timing.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'timerRunning', equals: true },
              { type: 'flag', key: 'sampleReachedD', equals: true },
            ],
          },
          instruction: '⏱️ Meniscus reached Mark D! Press "Stop Timing" to record efflux time.',
        },
        {
          condition: { type: 'flag', key: 'timerRunning', equals: true },
          instruction: '⏱️ Flowing from C → D... Press "Stop Timing" once meniscus reaches Mark D.',
        },
      ],
      requiredActions: ['time-sample'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'water-reference',
      label: '6. Clear Viscometer & Measure Water',
      instruction: 'Drain Liquid A, then introduce distilled water and measure its reference efflux time.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'waterTimed', equals: true },
          instruction: '✓ Water flow timing complete! Recorded flow time. You can resume dropping, restart from Mark C, or click "Continue to Calculations".',
        },
        {
          condition: { type: 'flag', key: 'waterStoppedEarly', equals: true },
          instruction: '⚠️ Liquid has not reached Mark D yet. Resume the flow and continue timing.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'timerRunning', equals: true },
              { type: 'flag', key: 'waterReachedD', equals: true },
            ],
          },
          instruction: '⏱️ Water meniscus reached Mark D! Press "Stop Timing" to record efflux time.',
        },
        {
          condition: { type: 'flag', key: 'timerRunning', equals: true },
          instruction: '⏱️ Water flowing from C → D... Press "Stop Timing" once meniscus reaches Mark D.',
        },
        {
          condition: { type: 'flag', key: 'suckedAboveMark', equals: true },
          instruction: 'Water ready above mark C — start the stopwatch to begin timing.',
        },
        {
          condition: { type: 'flag', key: 'waterIntroduced', equals: true },
          instruction: 'Attach suction bulb to capillary limb to draw water above mark C.',
        },
        {
          condition: { type: 'flag', key: 'viscoCleared', equals: true },
          instruction: 'Viscometer cleared! Introduce Distilled Water into the broad limb (Bulb A).',
        },
        {
          condition: { type: 'flag', key: 'viscoCleared', equals: false },
          instruction: 'Drain and clear Liquid A from the viscometer before introducing distilled water.',
        },
      ],
      requiredActions: ['time-water'],
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
        { type: 'setFlag', key: 'viscoMounted', value: true },
        { type: 'setFlag', key: 'isMounted', value: true },
      ],
      completesAction: 'mount-viscometer',
    },
    {
      id: 'inter-clean-chromic',
      trigger: { type: 'drop', source: 'chromic-acid', target: 'visco-broad-end' },
      conditions: [{ type: 'flag', key: 'viscoMounted', equals: true }],
      blockMessage: 'Mount the viscometer vertically on the stand first.',
      effects: [
        { type: 'setFlag', key: 'cleanedChromic', value: true },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidColor', value: 'rgba(234, 88, 12, 0.85)' },
      ],
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouringChromic' },
    },
    {
      id: 'inter-drain-chromic',
      trigger: { type: 'click', elementId: 'drain-chromic' },
      conditions: [{ type: 'flag', key: 'cleanedChromic', equals: true }],
      effects: [
        { type: 'setFlag', key: 'chromicDrained', value: true },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'label', value: "Ostwald's Viscometer (Drained)" },
      ],
    },
    {
      id: 'inter-rinse-acetone',
      trigger: { type: 'drop', source: 'acetone', target: 'visco-broad-end' },
      conditions: [{ type: 'flag', key: 'cleanedChromic', equals: true }],
      blockMessage: 'Wash with chromic acid first to remove organic grease.',
      effects: [
        { type: 'setFlag', key: 'chromicDrained', value: true },
        { type: 'setFlag', key: 'isCleanedAndDry', value: true },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'label', value: "Ostwald's Viscometer" },
      ],
      completesAction: 'rinse-acetone',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isRinsingAcetone' },
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
      animation: { type: 'pour', durationMs: 2200, animatingFlag: 'isPouringSample' },
    },
    {
      id: 'inter-suck-liquid',
      trigger: { type: 'drop', source: 'suction-bulb', target: 'visco-capillary-end' },
      conditions: [
        {
          type: 'or',
          conditions: [
            { type: 'flag', key: 'sampleIntroduced', equals: true },
            { type: 'flag', key: 'waterIntroduced', equals: true },
          ],
        },
      ],
      blockMessage: 'Introduce liquid into the broad limb first.',
      effects: [
        { type: 'setFlag', key: 'suckedAboveMark', value: true },
        { type: 'setFlag', key: 'waterSucked', value: true },
        { type: 'setFlag', key: 'stoppedTooEarly', value: false },
        { type: 'setFlag', key: 'sampleStoppedEarly', value: false },
        { type: 'setFlag', key: 'waterStoppedEarly', value: false },
        { type: 'setFlag', key: 'sampleReachedD', value: false },
        { type: 'setFlag', key: 'waterReachedD', value: false },
        { type: 'setVariable', key: '_flowProgress', value: 0 },
        { type: 'setVariable', key: '_timerSeconds', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0.95 },
      ],
      completesAction: 'suck-liquid',
      animation: { type: 'suction', durationMs: 2400, animatingFlag: 'isSucking', effectsAfterAnimation: true },
    },
    // Start sample flow timing
    {
      id: 'inter-start-sample-flow',
      trigger: { type: 'click', elementId: 'start-sample-flow' },
      conditions: [{ type: 'flag', key: 'suckedAboveMark', equals: true }],
      effects: [
        { type: 'setFlag', key: 'timerRunning', value: true },
        { type: 'setFlag', key: 'sampleStoppedEarly', value: false },
        { type: 'setFlag', key: 'stoppedTooEarly', value: false },
      ],
    },
    // Complete sample flow timing when meniscus has reached Mark D
    {
      id: 'inter-stop-sample-flow',
      trigger: { type: 'click', elementId: 'stop-sample-flow' },
      conditions: [{ type: 'variable', key: '_flowProgress', op: '>=', value: 1.0 }],
      effects: [
        { type: 'setFlag', key: 'timerRunning', value: false },
        { type: 'setFlag', key: 'sampleTimed', value: true },
        { type: 'setFlag', key: 'sampleReachedD', value: true },
        { type: 'setFlag', key: 'sampleStoppedEarly', value: false },
        { type: 'setFlag', key: 'stoppedTooEarly', value: false },
        { type: 'setVariable', key: 'flowTimeSample', value: 24.5 },
      ],
      completesAction: 'time-sample',
    },
    // Early stop for sample when meniscus has not reached Mark D yet
    {
      id: 'inter-stop-sample-early',
      trigger: { type: 'click', elementId: 'stop-sample-flow' },
      conditions: [{ type: 'variable', key: '_flowProgress', op: '<', value: 1.0 }],
      effects: [
        { type: 'setFlag', key: 'timerRunning', value: false },
        { type: 'setFlag', key: 'sampleTimed', value: false },
        { type: 'setFlag', key: 'sampleStoppedEarly', value: true },
        { type: 'setFlag', key: 'stoppedTooEarly', value: true },
      ],
    },
    // Option to retry sample timing if student chooses
    {
      id: 'inter-retry-sample-timing',
      trigger: { type: 'click', elementId: 'retry-sample-flow' },
      effects: [
        { type: 'setFlag', key: 'timerRunning', value: false },
        { type: 'setFlag', key: 'sampleTimed', value: false },
        { type: 'setFlag', key: 'sampleStoppedEarly', value: false },
        { type: 'setFlag', key: 'stoppedTooEarly', value: false },
        { type: 'setFlag', key: 'sampleReachedD', value: false },
        { type: 'setFlag', key: 'suckedAboveMark', value: true },
        { type: 'setVariable', key: '_flowProgress', value: 0 },
        { type: 'setVariable', key: '_timerSeconds', value: 0 },
        { type: 'setVariable', key: 'flowTimeSample', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0.95 },
      ],
    },
    // Drain & Clear Viscometer (Student empties Liquid A before water)
    {
      id: 'inter-drain-viscometer',
      trigger: { type: 'click', elementId: 'drain-viscometer' },
      conditions: [{ type: 'flag', key: 'sampleTimed', equals: true }],
      effects: [
        { type: 'setFlag', key: 'viscoCleared', value: true },
        { type: 'setFlag', key: 'sampleIntroduced', value: false },
        { type: 'setFlag', key: 'suckedAboveMark', value: false },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'label', value: 'Clean & Drained Viscometer' },
        { type: 'setVariable', key: '_flowProgress', value: 0 },
      ],
    },
    {
      id: 'inter-rinse-drain-acetone',
      trigger: { type: 'drop', source: 'acetone', target: 'visco-broad-end' },
      conditions: [{ type: 'flag', key: 'sampleTimed', equals: true }],
      effects: [
        { type: 'setFlag', key: 'viscoCleared', value: true },
        { type: 'setFlag', key: 'sampleIntroduced', value: false },
        { type: 'setFlag', key: 'suckedAboveMark', value: false },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'label', value: 'Clean & Drained Viscometer' },
        { type: 'setVariable', key: '_flowProgress', value: 0 },
      ],
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isRinsingAcetone' },
    },
    // Add distilled water for reference timing
    {
      id: 'inter-add-water',
      trigger: { type: 'drop', source: 'distilled-water', target: 'visco-broad-end' },
      conditions: [
        { type: 'flag', key: 'sampleTimed', equals: true },
        { type: 'flag', key: 'viscoCleared', equals: true },
      ],
      blockMessage: 'Drain and clear Liquid A from the viscometer before introducing distilled water.',
      effects: [
        { type: 'setFlag', key: 'waterReady', value: true },
        { type: 'setFlag', key: 'waterIntroduced', value: true },
        { type: 'setFlag', key: 'sampleIntroduced', value: false },
        { type: 'setFlag', key: 'suckedAboveMark', value: false },
        { type: 'setFlag', key: 'waterSucked', value: false },
        { type: 'setFlag', key: 'stoppedTooEarly', value: false },
        { type: 'setFlag', key: 'waterStoppedEarly', value: false },
        { type: 'setFlag', key: 'waterReachedD', value: false },
        { type: 'setVariable', key: '_flowProgress', value: 0 },
        { type: 'setVariable', key: '_timerSeconds', value: 0 },
        { type: 'setVariable', key: 'flowTimeWater', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0.6 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
      ],
      completesAction: 'add-water',
      animation: { type: 'pour', durationMs: 2200, animatingFlag: 'isPouringWater' },
    },
    // Start water flow timing
    {
      id: 'inter-start-water-flow',
      trigger: { type: 'click', elementId: 'start-water-flow' },
      conditions: [{ type: 'flag', key: 'suckedAboveMark', equals: true }],
      effects: [
        { type: 'setFlag', key: 'timerRunning', value: true },
        { type: 'setFlag', key: 'waterStoppedEarly', value: false },
        { type: 'setFlag', key: 'stoppedTooEarly', value: false },
      ],
    },
    // Complete water flow timing when meniscus has reached Mark D
    {
      id: 'inter-stop-water-flow',
      trigger: { type: 'click', elementId: 'stop-water-flow' },
      conditions: [{ type: 'variable', key: '_flowProgress', op: '>=', value: 1.0 }],
      effects: [
        { type: 'setFlag', key: 'timerRunning', value: false },
        { type: 'setFlag', key: 'waterTimed', value: true },
        { type: 'setFlag', key: 'waterReachedD', value: true },
        { type: 'setFlag', key: 'waterStoppedEarly', value: false },
        { type: 'setFlag', key: 'stoppedTooEarly', value: false },
        { type: 'setVariable', key: 'flowTimeWater', value: 18.2 },
      ],
      completesAction: 'time-water',
    },
    // Early stop when meniscus has not reached Mark D yet
    {
      id: 'inter-stop-water-early',
      trigger: { type: 'click', elementId: 'stop-water-flow' },
      conditions: [{ type: 'variable', key: '_flowProgress', op: '<', value: 1.0 }],
      effects: [
        { type: 'setFlag', key: 'timerRunning', value: false },
        { type: 'setFlag', key: 'waterTimed', value: false },
        { type: 'setFlag', key: 'waterStoppedEarly', value: true },
        { type: 'setFlag', key: 'stoppedTooEarly', value: true },
      ],
    },
    // Option to retry water timing if student chooses
    {
      id: 'inter-retry-water-timing',
      trigger: { type: 'click', elementId: 'retry-water-flow' },
      effects: [
        { type: 'setFlag', key: 'timerRunning', value: false },
        { type: 'setFlag', key: 'waterTimed', value: false },
        { type: 'setFlag', key: 'waterStoppedEarly', value: false },
        { type: 'setFlag', key: 'stoppedTooEarly', value: false },
        { type: 'setFlag', key: 'waterReachedD', value: false },
        { type: 'setFlag', key: 'suckedAboveMark', value: true },
        { type: 'setFlag', key: 'waterSucked', value: true },
        { type: 'setVariable', key: '_flowProgress', value: 0 },
        { type: 'setVariable', key: '_timerSeconds', value: 0 },
        { type: 'setVariable', key: 'flowTimeWater', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'viscometer', prop: 'liquidLevel', value: 0.95 },
      ],
    },
  ],

  // ── Continuous Updates ──
  continuousUpdates: [
    {
      // Timing Liquid Sample A
      condition: {
        type: 'and',
        conditions: [
          { type: 'flag', key: 'timerRunning', equals: true },
          { type: 'flag', key: 'waterReady', equals: false },
        ],
      },
      increments: {
        _timerSeconds: 1,
        flowTimeSample: 1,
        _flowProgress: 1 / 24.5, // flows to mark D in 24.5s
      },
      onConditionMet: [
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'variable', key: '_flowProgress', op: '>=', value: 1.0 },
              { type: 'flag', key: 'sampleReachedD', equals: false },
            ],
          },
          effects: [
            { type: 'setFlag', key: 'sampleReachedD', value: true },
          ],
        },
      ],
    },
    {
      // Timing Distilled Water
      condition: {
        type: 'and',
        conditions: [
          { type: 'flag', key: 'timerRunning', equals: true },
          { type: 'flag', key: 'waterReady', equals: true },
        ],
      },
      increments: {
        _timerSeconds: 1,
        flowTimeWater: 1,
        _flowProgress: 1 / 18.2, // flows to mark D in 18.2s
      },
      onConditionMet: [
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'variable', key: '_flowProgress', op: '>=', value: 1.0 },
              { type: 'flag', key: 'waterReachedD', equals: false },
            ],
          },
          effects: [
            { type: 'setFlag', key: 'waterReachedD', value: true },
          ],
        },
      ],
    },
  ],

  // ── Chemistry & Formulas ──
  chemistry: {
    reaction: 'Capillary fluid flow governed by Poiseuille’s Law: η = (π P r⁴ t) / (8 V L)',
    reactionType: 'Viscometry / Fluid Mechanics',
    constants: {
      densityWater: 0.997,        // g/cm³ at 25°C
      densitySample: 0.79,        // g/cm³
      viscosityWater: 0.0089,     // poise at 25°C
    },
    formulas: {
      viscosityOstwald: {
        label: 'Viscosity of Liquid A',
        displayFormula: 'η_A = (t_A · d_A) / (t_W · d_W) · η_W',
        computeFn: 'viscosityOstwald',
        inputs: ['flowTimeSample', 'densitySample', 'flowTimeWater', 'densityWater', 'viscosityWater'],
        unit: 'poise',
      },
    },
  },

  // ── Calculation ──
  calculation: {
    title: "Ostwald Viscometer Observations & Calculations",
    instruction:
      'According to Poiseuille’s Law, the rate of flow through a capillary tube is inversely proportional to the viscosity of the fluid.\n\n' +
      'By comparing the flow times of Liquid Sample A and Distilled Water through the same viscometer capillary between marks C and D under identical temperature conditions, the viscosity of Liquid Sample A is calculated using the relative viscosity formula below.',
    formulas: [
      {
        symbol: 'η_A',
        numerator: 't_A × d_A',
        denominator: 't_W × d_W',
        bracketed: true,
        multiplier: '× η_W',
        unit: 'poise',
        notes:
          'Where:\n' +
          'η_A = viscosity of Liquid Sample A\n' +
          't_A = flow time of Liquid Sample A\n' +
          'd_A = density of Liquid Sample A\n' +
          't_W = flow time of water\n' +
          'd_W = density of water\n' +
          'η_W = viscosity of water',
      },
    ],
    recordedValues: [
      { key: 'flowTimeSample', label: 'Flow Time — Liquid Sample A (t_A)', unit: 's', decimals: 2 },
      { key: 'densitySample', label: 'Density — Liquid Sample A (d_A)', value: 0.79, unit: 'g/cm³', decimals: 3 },
      { key: 'flowTimeWater', label: 'Flow Time — Water (t_W)', unit: 's', decimals: 2 },
      { key: 'densityWater', label: 'Density — Water (d_W)', value: 0.997, unit: 'g/cm³', decimals: 3 },
      { key: 'viscosityWater', label: 'Viscosity — Water (η_W)', value: 0.0089, unit: 'poise', decimals: 4 },
    ],
    fields: [
      {
        id: 'viscosityValue',
        label: 'Calculate viscosity of Liquid Sample A',
        placeholder: 'Enter calculated viscosity',
        unit: 'poise',
        expectedValue: 0.009493,
        expectedFormulaName: 'viscosityOstwald',
        tolerance: 0.001,
        toleranceType: 'absolute',
      },
      {
        id: 'unitQuestion',
        label: 'Convert viscosity from poise to Pa·s',
        helperText: '1 Poise = ____ Pa·s',
        placeholder: 'Enter conversion factor',
        unit: 'Pa·s',
        expectedValue: 0.1,
        tolerance: 0.02,
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
      name: 'Flow Measurement Completion',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'waterTimed', truePoints: 20 },
    },
    {
      name: 'Viscosity Accuracy (Closeness to Theoretical Standard)',
      maxPoints: 25,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'viscosityValue',
        correctPoints: 25,
        incorrectPoints: 0,
        proportional: true,
        actualStandard: 0.009493, // True standard: (24.5 * 0.79)/(18.2 * 0.997) * 0.0089 = 0.009493 P
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
      condition: {
        type: 'and',
        conditions: [
          { type: 'flag', key: 'sampleIntroduced', equals: false },
          { type: 'flag', key: 'waterIntroduced', equals: false },
        ],
      },
      message: 'Add liquid to the broad limb before attempting suction.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    flowTimeSample: 0,
    densitySample: 0.79,
    flowTimeWater: 0,
    densityWater: 0.997,
    viscosityWater: 0.0089,
    _timerSeconds: 0,
    _flowProgress: 0,
  },
  initialFlags: {
    isMounted: false,
    viscoMounted: false,
    cleanedChromic: false,
    isCleanedAndDry: false,
    sampleIntroduced: false,
    suckedAboveMark: false,
    sampleTimed: false,
    sampleStoppedEarly: false,
    sampleReachedD: false,
    stoppedTooEarly: false,
    viscoCleared: false,
    waterReady: false,
    waterSucked: false,
    waterIntroduced: false,
    waterTimed: false,
    waterStoppedEarly: false,
    waterReachedD: false,
    timerRunning: false,
  },
};
