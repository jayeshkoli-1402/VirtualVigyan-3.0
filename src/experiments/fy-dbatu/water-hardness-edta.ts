/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Determination of Hardness of Water by EDTA Method
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Complexometric titration:
 *  Ca²⁺/Mg²⁺ + EBT → [M-EBT] (Wine Red)
 *  [M-EBT] + EDTA → [M-EDTA] + Free EBT (Sky Blue at endpoint)
 *
 *  Total Hardness = (V₂ / V₁) · 1000 ppm CaCO₃ equivalent
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const waterHardnessEdta: ExperimentConfig = {
  id: 'water-hardness-edta',
  title: 'Water Hardness by EDTA Method',
  subtitle: 'Total Hardness = (V₂/V₁) · 1000 ppm (EBT: Wine Red → Sky Blue)',
  description:
    'Determine the total hardness of a water sample in ppm of CaCO₃ equivalent using complexometric titration against standard 0.01 M EDTA with Eriochrome Black T indicator at pH 10.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'medium',
  themeColor: '#059669',
  icon: '🪨',
  estimatedMinutes: 20,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'burette',
      component: 'Burette',
      label: '50 mL Calibrated Burette',
      icon: '🧪',
      initialProps: { liquidLevel: 0, width: 90, height: 280, label: '50 mL Burette' },
    },
    {
      id: 'edta-titrant',
      component: 'ReagentBottle',
      label: '0.01 M Standard EDTA Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.7)', label: '0.01 M EDTA' },
    },
    {
      id: 'conical-flask',
      component: 'ConicalFlask',
      label: '250 mL Conical Flask',
      icon: '⚗️',
      initialProps: { liquidLevel: 0, width: 130, height: 150 },
    },
    {
      id: 'std-cacl2',
      component: 'ReagentBottle',
      label: 'Standard CaCl₂ (50 mL)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.45)', label: 'Std CaCl₂' },
    },
    {
      id: 'buffer-ph10',
      component: 'Dropper',
      label: 'pH 10 Buffer (NH₄OH/NH₄Cl)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.6)', label: 'pH 10 Buf' },
    },
    {
      id: 'ebt-indicator',
      component: 'Dropper',
      label: 'Eriochrome Black T (EBT)',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(159, 18, 57, 0.95)', label: 'EBT' },
    },
    {
      id: 'hard-water-sample',
      component: 'ReagentBottle',
      label: '50 mL Hard Water Sample',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.5)', label: 'Sample' },
    },
    {
      id: 'wash-bottle',
      component: 'ReagentBottle',
      label: 'Wash Bottle (Distilled Water)',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.85)', label: 'Distilled Water' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'clamp-zone',
      label: 'Clamp Burette on Retort Stand',
      accepts: ['burette'],
      position: { x: 50, y: 32 },
      size: { width: 22, height: 44 },
      rejectMessage: 'Mount the 50 mL burette onto the retort stand clamp.',
    },
    {
      id: 'burette-top-zone',
      label: 'Fill Burette with 0.01 M EDTA',
      accepts: ['edta-titrant'],
      position: { x: 50, y: 14 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour 0.01 M EDTA titrant into the top of the burette.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'burette' },
          { type: 'flag', key: 'v1EndpointBlue', equals: false },
        ],
      },
    },
    {
      id: 'burette-refill-zone',
      label: 'Refill Burette with 0.01 M EDTA',
      accepts: ['edta-titrant'],
      position: { x: 50, y: 14 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour 0.01 M EDTA titrant into the top of the burette to refill to 0.0 mL.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'burette' },
          { type: 'flag', key: 'v1EndpointBlue', equals: true },
        ],
      },
    },
    {
      id: 'flask-bench-zone',
      label: 'Place Flask under Burette',
      accepts: ['conical-flask'],
      position: { x: 50, y: 64 },
      size: { width: 24, height: 32 },
      rejectMessage: 'Place the conical flask on the lab bench beneath the burette.',
      visibleWhen: { type: 'flag', key: 'flaskPlaced', equals: false },
    },
    {
      id: 'flask-mouth-zone',
      label: 'Into Conical Flask (Standardization)',
      accepts: ['std-cacl2', 'buffer-ph10', 'ebt-indicator', 'burette'],
      position: { x: 50, y: 58 },
      size: { width: 24, height: 34 },
      rejectMessage: 'Add reagents into the conical flask.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
          { type: 'flag', key: 'v1EndpointBlue', equals: false },
        ],
      },
    },
    {
      id: 'flask-sample-zone',
      label: 'Into Conical Flask (Water Sample)',
      accepts: ['wash-bottle', 'hard-water-sample', 'buffer-ph10', 'ebt-indicator', 'burette'],
      position: { x: 50, y: 58 },
      size: { width: 24, height: 34 },
      rejectMessage: 'Add reagents into the conical flask.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'conical-flask' },
          { type: 'flag', key: 'v1EndpointBlue', equals: true },
        ],
      },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      {
        component: 'RetortStand',
        position: { x: 50, y: 38 },
        scale: 1.15,
        props: { label: 'Retort Stand' },
      },
    ],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-stand',
      label: '1. Mount Burette',
      instruction: 'Drag the 50 mL Burette from the toolbox and clamp it onto the retort stand.',
      requiredActions: ['place-burette'],
      type: 'lab',
    },
    {
      id: 'fill-burette',
      label: '2. Fill Burette with EDTA',
      instruction: 'Drag the 0.01 M Standard EDTA bottle to the top of the burette to fill it up to the 0.0 mL mark.',
      requiredActions: ['fill-burette'],
      type: 'lab',
    },
    {
      id: 'setup-flask',
      label: '3. Place Flask',
      instruction: 'Place the clean conical flask beneath the burette on the titration workbench.',
      requiredActions: ['place-flask'],
      type: 'lab',
    },
    {
      id: 'standardization-prep',
      label: '4. Prepare Standard Solution',
      instruction: 'Add 50 mL standard CaCl₂ solution to the conical flask, add 10 mL pH 10 buffer, and then add 4 drops of EBT indicator until the solution turns wine red.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'stdWineRed', equals: true },
          instruction: '✓ EBT indicator added! Solution turned wine red [Ca²⁺-EBT complex]. Standardization solution ready.',
        },
        {
          condition: { type: 'flag', key: 'stdBufferAdded', equals: true },
          instruction: '✓ pH 10 Buffer added! Now drag EBT indicator to the conical flask.',
        },
        {
          condition: { type: 'flag', key: 'stdCacl2Added', equals: true },
          instruction: '✓ 50 mL Std CaCl₂ solution added! Now drag pH 10 Buffer to the conical flask.',
        },
      ],
      requiredActions: ['add-std-cacl2', 'add-std-buffer', 'add-std-ebt'],
      type: 'lab',
    },
    {
      id: 'standardization-titration',
      label: '5. Standardize EDTA (V₁)',
      instruction: 'Click the right wing of the burette cork to titrate drop-by-drop with EDTA until wine red changes sharply to sky blue at V₁ = 20.0 mL. Click Continue when observed.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'v1EndpointBlue', equals: true },
          instruction: '✓ Standardization complete! Sky blue endpoint reached at V₁ = 20.0 mL. Click Continue to proceed to Water Sample Titration.',
        },
      ],
      requiredActions: ['titrate-v1'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'sample-titration',
      label: '6. Titrate Water Sample (V₂)',
      instruction: 'Rinse and empty the conical flask with the Wash Bottle, refill the burette with EDTA to 0.0 mL, add 50 mL water sample + pH 10 buffer + EBT, and titrate with EDTA until sky blue at V₂ = 15.0 mL.',
      dynamicInstructions: [
        {
          condition: { type: 'flag', key: 'v2EndpointBlue', equals: true },
          instruction: '✓ Sample Titration complete! Sky blue endpoint reached at V₂ = 15.0 mL. Click Continue to perform Calculations & Viva.',
        },
        {
          condition: { type: 'flag', key: 'sampleWineRed', equals: true },
          instruction: '✓ Water sample turned wine red! Click/rotate the right wing of the burette cork to titrate with EDTA until sky blue (V₂ = 15.0 mL).',
        },
        {
          condition: { type: 'flag', key: 'sampleBufferAdded', equals: true },
          instruction: '✓ pH 10 Buffer added! Now drag EBT indicator into the conical flask.',
        },
        {
          condition: { type: 'flag', key: 'sampleWaterAdded', equals: true },
          instruction: '✓ 50 mL Hard Water sample added! Now drag pH 10 Buffer into the conical flask.',
        },
        {
          condition: { type: 'flag', key: 'buretteRefilled', equals: true },
          instruction: '✓ Burette refilled to 0.0 mL! Now drag the 50 mL Hard Water Sample into the conical flask.',
        },
        {
          condition: { type: 'flag', key: 'flaskCleared', equals: true },
          instruction: '✓ Conical flask rinsed and cleared! Drag the 0.01 M EDTA bottle to the burette top to refill to 0.0 mL mark.',
        },
      ],
      requiredActions: ['clear-flask', 'refill-burette', 'add-sample-water', 'add-sample-buffer', 'add-sample-ebt', 'titrate-v2'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '7. Calculations & Viva',
      instruction: 'Calculate the total hardness of the water sample in ppm of CaCO₃ equivalent.',
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
      id: 'inter-place-burette',
      trigger: { type: 'drop', source: 'burette', target: 'clamp-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'burette', zoneId: 'clamp-zone' },
        { type: 'setFlag', key: 'burettePlaced', value: true },
      ],
      completesAction: 'place-burette',
    },
    {
      id: 'inter-fill-burette',
      trigger: { type: 'drop', source: 'edta-titrant', target: 'burette-top-zone' },
      conditions: [{ type: 'flag', key: 'burettePlaced', equals: true }],
      blockMessage: 'Clamp the burette on the retort stand before filling it.',
      effects: [
        { type: 'setFlag', key: 'buretteFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidLevel', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: '0.01 M EDTA Burette' },
      ],
      completesAction: 'fill-burette',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-place-flask',
      trigger: { type: 'drop', source: 'conical-flask', target: 'flask-bench-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'conical-flask', zoneId: 'flask-bench-zone' },
        { type: 'setFlag', key: 'flaskPlaced', value: true },
      ],
      completesAction: 'place-flask',
    },
    {
      id: 'inter-add-std-cacl2',
      trigger: { type: 'drop', source: 'std-cacl2', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'flaskPlaced', equals: true }],
      blockMessage: 'Place the conical flask on the bench first.',
      guard: {
        condition: { type: 'flag', key: 'stdCacl2Added', equals: true },
        message: 'Standard CaCl₂ solution has already been added to the flask.',
      },
      effects: [
        { type: 'setFlag', key: 'stdCacl2Added', value: true },
        { type: 'placeApparatus', apparatusId: 'std-cacl2', zoneId: 'consumed' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '50 mL Std CaCl₂ Solution' },
      ],
      completesAction: 'add-std-cacl2',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouringCacl2' },
    },
    {
      id: 'inter-add-std-buffer',
      trigger: { type: 'drop', source: 'buffer-ph10', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'stdCacl2Added', equals: true }],
      blockMessage: 'Add the 50 mL standard CaCl₂ solution to the flask first.',
      guard: {
        condition: { type: 'flag', key: 'stdBufferAdded', equals: true },
        message: 'pH 10 buffer has already been added to the flask.',
      },
      effects: [
        { type: 'setFlag', key: 'stdBufferAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.40 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Std CaCl₂ + pH 10 Buffer' },
      ],
      completesAction: 'add-std-buffer',
      animation: { type: 'drip', durationMs: 2000, animatingFlag: 'isAddingBuffer' },
    },
    {
      id: 'inter-add-std-ebt',
      trigger: { type: 'drop', source: 'ebt-indicator', target: 'flask-mouth-zone' },
      conditions: [{ type: 'flag', key: 'stdBufferAdded', equals: true }],
      blockMessage: 'Add pH 10 buffer to the flask before adding EBT indicator.',
      guard: {
        condition: { type: 'flag', key: 'stdWineRed', equals: true },
        message: 'EBT indicator has already been added to the flask.',
      },
      effects: [
        { type: 'setFlag', key: 'stdWineRed', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.44 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(159, 18, 57, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Wine Red [Ca²⁺-EBT Complex]' },
      ],
      completesAction: 'add-std-ebt',
      animation: {
        type: 'drip',
        durationMs: 2000,
        animatingFlag: 'isAddingEbt',
        effectsAfterAnimation: true,
      },
    },
    {
      id: 'inter-titrate-v1',
      trigger: { type: 'drop', source: 'burette', target: 'flask-mouth-zone' },
      conditions: [
        { type: 'flag', key: 'stdWineRed', equals: true },
        { type: 'variable', key: 'stdEdtaVolume', op: '>=', value: 20.0 },
      ],
      blockMessage: 'Click the right wing of the burette stopcock to titrate EDTA drop-by-drop until V₁ = 20.0 mL.',
      effects: [
        { type: 'setFlag', key: 'v1EndpointBlue', value: true },
        { type: 'setVariable', key: 'stdEdtaVolume', value: 20.0 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.60 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(14, 165, 233, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sky Blue Endpoint (V₁ = 20.0 mL)' },
      ],
      completesAction: 'titrate-v1',
      animation: { type: 'titrate', durationMs: 2200, animatingFlag: 'isTitrating' },
    },
    {
      id: 'inter-clear-flask',
      trigger: { type: 'drop', source: 'wash-bottle', target: 'flask-sample-zone' },
      conditions: [{ type: 'flag', key: 'v1EndpointBlue', equals: true }],
      blockMessage: 'Standardize EDTA (V₁) before clearing the flask.',
      guard: {
        condition: { type: 'flag', key: 'flaskCleared', equals: true },
        message: 'The flask has already been rinsed and emptied.',
      },
      effects: [
        { type: 'setFlag', key: 'flaskCleared', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Empty Conical Flask' },
      ],
      completesAction: 'clear-flask',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isClearingFlask' },
    },
    {
      id: 'inter-refill-burette',
      trigger: { type: 'drop', source: 'edta-titrant', target: 'burette-refill-zone' },
      conditions: [{ type: 'flag', key: 'flaskCleared', equals: true }],
      blockMessage: 'Rinse and clear the conical flask before refilling the burette.',
      guard: {
        condition: { type: 'flag', key: 'buretteRefilled', equals: true },
        message: 'Burette is already refilled to 0.0 mL.',
      },
      effects: [
        { type: 'setFlag', key: 'buretteFilled', value: true },
        { type: 'setFlag', key: 'buretteRefilled', value: true },
        { type: 'setVariable', key: 'sampleEdtaVolume', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidLevel', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: '0.01 M EDTA Burette (Refilled)' },
      ],
      completesAction: 'refill-burette',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isRefillingBurette' },
    },
    {
      id: 'inter-add-sample-water',
      trigger: { type: 'drop', source: 'hard-water-sample', target: 'flask-sample-zone' },
      conditions: [{ type: 'flag', key: 'buretteRefilled', equals: true }],
      blockMessage: 'Refill the burette to 0.0 mL before adding the water sample.',
      guard: {
        condition: { type: 'flag', key: 'sampleWaterAdded', equals: true },
        message: 'Hard water sample has already been added.',
      },
      effects: [
        { type: 'setFlag', key: 'sampleWaterAdded', value: true },
        { type: 'placeApparatus', apparatusId: 'hard-water-sample', zoneId: 'consumed' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: '50 mL Hard Water Sample' },
      ],
      completesAction: 'add-sample-water',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouringSampleWater' },
    },
    {
      id: 'inter-add-sample-buffer',
      trigger: { type: 'drop', source: 'buffer-ph10', target: 'flask-sample-zone' },
      conditions: [{ type: 'flag', key: 'sampleWaterAdded', equals: true }],
      blockMessage: 'Add 50 mL hard water sample to the conical flask first.',
      guard: {
        condition: { type: 'flag', key: 'sampleBufferAdded', equals: true },
        message: 'pH 10 buffer has already been added to the water sample.',
      },
      effects: [
        { type: 'setFlag', key: 'sampleBufferAdded', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.40 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sample + pH 10 Buffer' },
      ],
      completesAction: 'add-sample-buffer',
      animation: { type: 'drip', durationMs: 2000, animatingFlag: 'isAddingSampleBuffer' },
    },
    {
      id: 'inter-add-sample-ebt',
      trigger: { type: 'drop', source: 'ebt-indicator', target: 'flask-sample-zone' },
      conditions: [{ type: 'flag', key: 'sampleBufferAdded', equals: true }],
      blockMessage: 'Add pH 10 buffer to the water sample before adding EBT indicator.',
      guard: {
        condition: { type: 'flag', key: 'sampleWineRed', equals: true },
        message: 'EBT indicator has already been added to the water sample.',
      },
      effects: [
        { type: 'setFlag', key: 'sampleWineRed', value: true },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.44 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(159, 18, 57, 0.9)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sample Wine Red [Ca/Mg-EBT Complex]' },
      ],
      completesAction: 'add-sample-ebt',
      animation: {
        type: 'drip',
        durationMs: 2000,
        animatingFlag: 'isAddingSampleEbt',
      },
    },
    {
      id: 'inter-titrate-v2',
      trigger: { type: 'drop', source: 'burette', target: 'flask-sample-zone' },
      conditions: [
        {
          type: 'or',
          conditions: [
            { type: 'flag', key: 'sampleWineRed', equals: true },
            { type: 'actionCompleted', actionId: 'add-sample-ebt' },
          ],
        },
        { type: 'variable', key: 'sampleEdtaVolume', op: '>=', value: 15.0 },
      ],
      blockMessage: 'Click the right wing of the burette stopcock to titrate EDTA drop-by-drop until V₂ = 15.0 mL.',
      effects: [
        { type: 'setFlag', key: 'v2EndpointBlue', value: true },
        { type: 'setVariable', key: 'sampleEdtaVolume', value: 15.0 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidLevel', value: 0.65 },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'liquidColor', value: 'rgba(14, 165, 233, 0.95)' },
        { type: 'setApparatusProp', apparatusId: 'conical-flask', prop: 'label', value: 'Sample Endpoint (V₂ = 15.0 mL)' },
      ],
      completesAction: 'titrate-v2',
      animation: { type: 'titrate', durationMs: 2200, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'Ca²⁺ + EDTA⁴⁻ → [Ca-EDTA]²⁻',
    constants: {
      cacl2Volume: 50.0,
      sampleVolume: 50.0,
    },
    colorModel: 'custom',
    colorModelArgs: {
      default: 'transparent',
    },
  },

  // ── Scoring ──
  scoring: [
    {
      name: 'Burette Setup & Filling',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'buretteFilled', truePoints: 20 },
    },
    {
      name: 'Standardization Endpoint (V₁)',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'v1EndpointBlue', truePoints: 25 },
    },
    {
      name: 'Sample Titration Endpoint (V₂)',
      maxPoints: 25,
      evaluator: { type: 'booleanCheck', flag: 'v2EndpointBlue', truePoints: 25 },
    },
    {
      name: 'Hardness Calculation',
      maxPoints: 30,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'totalHardness',
        correctPoints: 30,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'fill-before-clamp',
      trigger: 'drop:edta-titrant→burette-top-zone',
      condition: { type: 'flag', key: 'burettePlaced', equals: false },
      message: 'Clamp the burette on the retort stand before filling it with EDTA.',
      blocking: true,
    },
    {
      id: 'refill-before-clamp',
      trigger: 'drop:edta-titrant→burette-refill-zone',
      condition: { type: 'flag', key: 'flaskCleared', equals: false },
      message: 'Empty and rinse the conical flask before refilling the burette.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    stdEdtaVolume: 0,
    sampleEdtaVolume: 0,
    cacl2Volume: 50,
    sampleVolume: 50,
    totalHardness: 0,
    stopcockOpen: 0,
    maxFlowRate: 3.0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    flaskPlaced: false,
    stdCacl2Added: false,
    stdBufferAdded: false,
    stdWineRed: false,
    v1EndpointBlue: false,
    flaskCleared: false,
    buretteRefilled: false,
    sampleWaterAdded: false,
    sampleBufferAdded: false,
    sampleWineRed: false,
    v2EndpointBlue: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Total Hardness Calculation',
    instruction: 'Total Hardness = (V₂ / V₁) × 1000 ppm CaCO₃ eq. (Reference: V₁ ≈ 20.0 mL, V₂ ≈ 15.0 mL, Hardness ≈ 750 ppm; realistic experimental values within acceptable ranges are accepted).',
    fields: [
      {
        id: 'stdEdtaVolume',
        label: 'EDTA Vol. for 50 mL Std CaCl₂ (V₁ in mL, reference ≈ 20.0 mL)',
        placeholder: 'Enter V₁ (acceptable: 19.0 – 21.0 mL)',
        unit: 'mL',
        expectedValue: 20.0,
        tolerance: 1.0,
        toleranceType: 'absolute',
      },
      {
        id: 'sampleEdtaVolume',
        label: 'EDTA Vol. for 50 mL Water Sample (V₂ in mL, reference ≈ 15.0 mL)',
        placeholder: 'Enter V₂ (acceptable: 14.0 – 16.0 mL)',
        unit: 'mL',
        expectedValue: 15.0,
        tolerance: 1.0,
        toleranceType: 'absolute',
      },
      {
        id: 'totalHardness',
        label: 'Total Hardness of Water Sample (ppm CaCO₃ eq., reference ≈ 750 ppm)',
        placeholder: 'Enter Total Hardness (acceptable: 700 – 800 ppm)',
        unit: 'ppm',
        expectedValue: 750,
        tolerance: 50,
        toleranceType: 'absolute',
      },
    ],
  },

  // ── Viva Questions ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'Why is an ammoniacal buffer of pH 10 used in EDTA titration?',
        options: [
          'To maintain pH 10 where [Ca-EDTA] and [Mg-EDTA] complexes are stable and EBT indicator functions properly.',
          'To prevent the oxidation of EDTA by atmospheric oxygen.',
          'To precipitate iron and aluminium impurities as hydroxides.',
          'To decrease the solubility of calcium carbonate.',
        ],
        correctIndex: 0,
        explanation:
          'At pH 10, EDTA exists as the active tetra-anion (Y⁴⁻), allowing strong and stable chelate formation with Ca²⁺ and Mg²⁺, while EBT indicator exhibits its distinct blue/wine-red color transition.',
      },
      {
        id: 'q2',
        question: 'Why does the solution turn wine red when EBT indicator is added to hard water?',
        options: [
          'Due to the formation of unstable [Ca-EBT] and [Mg-EBT] coordination complex ions.',
          'Due to the oxidation of EBT by dissolved oxygen.',
          'Because free EBT itself is wine red in alkaline medium.',
          'Due to the formation of calcium carbonate precipitate.',
        ],
        correctIndex: 0,
        explanation:
          'Free EBT is blue at pH 10. When added to hard water containing Ca²⁺ and Mg²⁺, it forms relatively weak [M-EBT] complex ions that are wine red.',
      },
      {
        id: 'q3',
        question: 'What is the color change at the exact equivalence point of EDTA titration?',
        options: [
          'Wine red to sky blue / steel blue.',
          'Colorless to pink.',
          'Yellow to orange.',
          'Deep blue to colorless.',
        ],
        correctIndex: 0,
        explanation:
          'At the equivalence point, EDTA replaces EBT from the [M-EBT] complex to form much stronger [M-EDTA] complexes, releasing free EBT which is pure sky blue.',
      },
      {
        id: 'q4',
        question: 'What is the standard unit used to express water hardness in engineering practice?',
        options: [
          'ppm (parts per million) or mg/L of CaCO₃ equivalent.',
          'Grams per liter of MgSO₄.',
          'Normality of HCl.',
          'Molarity of NaCl.',
        ],
        correctIndex: 0,
        explanation:
          'Hardness is universally expressed in ppm or mg/L of CaCO₃ equivalent because CaCO₃ has a convenient molecular weight of exactly 100 g/mol and equivalent weight of 50.',
      },
    ],
  },
};
