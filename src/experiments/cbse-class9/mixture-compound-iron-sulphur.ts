/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Mixture and Compound (Iron Filings and Sulphur)
 *  CBSE Class 9 Science — Is Matter Around Us Pure?
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Fe + S → FeS (Exothermic synthesis on heating)
 *  Mixture (Fe + S): Retains magnetic Fe, S dissolves in CS₂
 *  Compound (FeS): Non-magnetic, insoluble in CS₂
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const mixtureCompoundIronSulphur: ExperimentConfig = {
  id: 'mixture-compound-iron-sulphur',
  title: 'Mixture and Compound (Iron and Sulphur)',
  subtitle: 'Fe + S: Physical Mixture vs Chemical Compound (FeS)',
  description:
    'Prepare a physical mixture and a chemical compound (FeS) from iron filings and sulphur powder. Compare and distinguish their appearance, behavior towards a magnet, and solubility in carbon disulphide (CS₂) solvent.',
  class: 9,
  subject: 'Chemistry',
  chapter: 'Matter: Is Matter Around Us Pure?',
  difficulty: 'medium',
  themeColor: '#b45309',
  icon: '🧲',
  estimatedMinutes: 35,
  underDevelopment: false,
  adminOnly: false,
  hidePlacedApparatusLabels: true,

  // ── Apparatus ──
  apparatus: [
    {
      id: 'digital-balance',
      component: 'DigitalBalance',
      label: 'Digital Balance',
      icon: '⚖️',
      initialProps: { width: 140, height: 85, reading: 0.00, massGrams: 0.00 },
    },
    {
      id: 'watch-glass',
      component: 'WatchGlass',
      label: 'Watch Glass',
      icon: '⚪',
      initialProps: { width: 126, height: 44 },
    },
    {
      id: 'bunsen-burner',
      component: 'BunsenBurner',
      label: 'Bunsen Burner',
      icon: '🔥',
      initialProps: { width: 75, height: 110, isLit: false },
    },
    {
      id: 'boiling-tube',
      component: 'TestTube',
      label: 'Hard Glass Boiling Tube',
      icon: '🧪',
      initialProps: { width: 180, height: 280, liquidLevel: 0, clampSupport: true },
    },
    {
      id: 'iron-bottle',
      component: 'ReagentBottle',
      label: 'Iron Filings (7 g)',
      icon: '🫙',
      initialProps: { liquidColor: '#334155', label: 'Fe Filings (7 g)' },
    },
    {
      id: 'sulphur-bottle',
      component: 'ReagentBottle',
      label: 'Sulphur Powder (4 g)',
      icon: '🫙',
      initialProps: { liquidColor: '#facc15', label: 'Sulphur (4 g)' },
    },
    {
      id: 'bar-magnet',
      component: 'HorseshoeMagnet',
      label: 'Horseshoe Magnet',
      icon: '🧲',
      initialProps: { width: 120, height: 140, label: 'Horseshoe Magnet' },
    },
    {
      id: 'lab-bar-magnet',
      component: 'HorseshoeMagnet',
      label: 'Horseshoe Magnet',
      icon: '🧲',
      prePlaced: true,
      initialProps: { width: 120, height: 140, label: 'Horseshoe Magnet' },
    },
    {
      id: 'cs2-test-tube',
      component: 'TestTube',
      label: 'Test Tube (Solvent Test)',
      icon: '🧪',
      hideWhenInactive: true,
      activeInSteps: ['test-cs2-mix', 'test-fes-cs2'],
      initialProps: { width: 76, height: 230, liquidLevel: 0 },
    },
    {
      id: 'spatula',
      component: 'Spatula',
      label: 'Lab Spatula',
      icon: '🥄',
      hideWhenInactive: true,
      activeInSteps: ['test-cs2-mix', 'synthesize-compound', 'test-fes-cs2'],
      initialProps: { width: 50, height: 90, label: 'Lab Spatula' },
    },
    {
      id: 'cs2-bottle',
      component: 'ReagentBottle',
      label: 'Carbon Disulphide (CS₂)',
      icon: '🧴',
      hideWhenInactive: true,
      activeInSteps: ['test-cs2-mix', 'test-fes-cs2'],
      initialProps: { liquidColor: 'rgba(254, 240, 138, 0.45)', label: 'CS₂ Solvent' },
    },
    {
      id: 'rubber-cork',
      component: 'RubberCork',
      label: 'Rubber Stopper',
      icon: '🟤',
      hideWhenInactive: true,
      activeInSteps: ['test-cs2-mix', 'test-fes-cs2'],
      initialProps: { width: 40, height: 30, label: 'Rubber Stopper' },
    },
    {
      id: 'mortar',
      component: 'Mortar',
      label: 'Mortar',
      icon: '🥣',
      hideWhenInactive: true,
      activeInSteps: ['crush-fes', 'observe-fes', 'test-fes-magnet', 'test-fes-cs2'],
      initialProps: { width: 90, height: 55, label: 'Mortar' },
    },
    {
      id: 'pestle',
      component: 'Pestle',
      label: 'Pestle',
      icon: '🔨',
      hideWhenInactive: true,
      activeInSteps: ['crush-fes'],
      initialProps: { width: 30, height: 70, label: 'Pestle' },
    },
    {
      id: 'magnifying-glass',
      component: 'MagnifyingGlass',
      label: 'Magnifying Glass',
      icon: '🔍',
      hideWhenInactive: true,
      activeInSteps: ['observe-fes'],
      initialProps: { width: 65, height: 85, label: 'Magnifier' },
    },
    {
      id: 'tripod-stand',
      component: 'Tripod',
      label: 'Tripod Stand',
      icon: '🪜',
      initialProps: { width: 80, height: 80 },
    },
    {
      id: 'wire-gauze',
      component: 'WireGauze',
      label: 'Wire Gauze',
      icon: '▦',
      initialProps: { width: 80, height: 20 },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'balance-zone',
      label: 'Digital Balance Station',
      accepts: ['digital-balance'],
      position: { x: 28, y: 72 },
      size: { width: 22, height: 20 },
      rejectMessage: 'Place the Digital Balance on the left side of the workbench.',
      visibleWhen: {
        type: 'not',
        condition: { type: 'apparatusPlaced', apparatusId: 'digital-balance' },
      },
    },
    {
      id: 'watch-glass-zone',
      label: 'Place Watch Glass on Balance',
      accepts: ['watch-glass'],
      position: { x: 28, y: 63.0 },
      size: { width: 18, height: 10 },
      rejectMessage: 'Place the Watch Glass directly onto the balance weighing pan.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'digital-balance' },
          { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'watch-glass' } },
        ],
      },
    },
    {
      id: 'burner-zone',
      label: 'Bunsen Burner Station',
      accepts: ['bunsen-burner'],
      position: { x: 74, y: 66 },
      size: { width: 14, height: 18 },
      rejectMessage: 'Place the Bunsen Burner on the right side of the workbench.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'watch-glass' },
          { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'bunsen-burner' } },
        ],
      },
    },
    {
      id: 'boiling-tube-zone',
      label: 'Mount Boiling Tube over Burner',
      accepts: ['boiling-tube'],
      position: { x: 72, y: 52 },
      size: { width: 22, height: 30 },
      rejectMessage: 'Mount the boiling tube securely over the Bunsen burner flame.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'bunsen-burner' },
          { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'boiling-tube' } },
        ],
      },
    },
    {
      id: 'watch-glass-mouth',
      label: 'Onto Watch Glass',
      accepts: ['iron-bottle', 'sulphur-bottle', 'bar-magnet', 'lab-bar-magnet', 'spatula'],
      position: { x: 28, y: 58.0 },
      size: { width: 26, height: 24 },
      rejectMessage: 'Add reagents or test with magnet on the watch glass.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'watch-glass' },
          { type: 'apparatusPlaced', apparatusId: 'boiling-tube' },
        ],
      },
    },
    {
      id: 'cs2-tube-zone',
      label: 'Place Test Tube on Bench',
      accepts: ['cs2-test-tube'],
      position: { x: 50, y: 64 },
      size: { width: 14, height: 26 },
      rejectMessage: 'Place the test tube on the center of the workbench for the CS₂ test.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'flag', key: 'mixtureRestored', equals: true },
          { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'cs2-test-tube' } },
        ],
      },
    },
    {
      id: 'cs2-tube-mouth',
      label: 'Into Test Tube',
      accepts: ['spatula', 'cs2-bottle', 'rubber-cork'],
      position: { x: 50, y: 55 },
      size: { width: 14, height: 20 },
      rejectMessage: 'Transfer sample, add CS₂ solvent, or cork the test tube.',
      visibleWhen: {
        type: 'apparatusPlaced',
        apparatusId: 'cs2-test-tube',
      },
    },
    {
      id: 'tube-mouth',
      label: 'Into Boiling Tube',
      accepts: ['watch-glass', 'spatula', 'bar-magnet', 'lab-bar-magnet'],
      position: { x: 71, y: 35 },
      size: { width: 14, height: 16 },
      rejectMessage: 'Transfer Part B mixture into the boiling tube.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'apparatusPlaced', apparatusId: 'boiling-tube' },
          { type: 'apparatusPlaced', apparatusId: 'watch-glass' },
        ],
      },
    },
    {
      id: 'mortar-zone',
      label: 'Place Mortar on Bench',
      accepts: ['mortar'],
      position: { x: 90, y: 72 },
      size: { width: 18, height: 18 },
      rejectMessage: 'Place the Mortar on the right side of the workbench to crush the synthesized FeS solid.',
      visibleWhen: {
        type: 'and',
        conditions: [
          { type: 'flag', key: 'feSCooled', equals: true },
          { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'mortar' } },
        ],
      },
    },
    {
      id: 'mortar-mouth',
      label: 'Into Mortar',
      accepts: ['boiling-tube', 'pestle', 'bar-magnet', 'lab-bar-magnet', 'spatula', 'magnifying-glass'],
      position: { x: 90, y: 66 },
      size: { width: 18, height: 18 },
      rejectMessage: 'Transfer FeS solid, grind with pestle, test with magnet, or scoop sample from mortar.',
      visibleWhen: {
        type: 'apparatusPlaced',
        apparatusId: 'mortar',
      },
    },
  ],

  bench: {
    backgroundElements: [],
  },

  // ── Steps ──
  steps: [
    {
      id: 'setup-apparatus',
      label: 'Setup Laboratory Equipment',
      instruction:
        'Assemble the laboratory apparatus sequentially: place the Digital Balance on the bench, place the Watch Glass on the balance pan, position the Bunsen Burner, and mount the Boiling Tube above the flame.',
      dynamicInstructions: [
        {
          condition: { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'digital-balance' } },
          instruction: 'Step 1: Drag the Digital Balance from the toolbox onto the left side of the workbench.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'apparatusPlaced', apparatusId: 'digital-balance' },
              { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'watch-glass' } },
            ],
          },
          instruction: 'Step 2: Place the Watch Glass directly onto the weighing platform of the Digital Balance.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'apparatusPlaced', apparatusId: 'watch-glass' },
              { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'bunsen-burner' } },
            ],
          },
          instruction: 'Step 3: Drag the Bunsen Burner from the toolbox onto the right side of the workbench.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'apparatusPlaced', apparatusId: 'bunsen-burner' },
              { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'boiling-tube' } },
            ],
          },
          instruction: 'Step 4: Mount the Hard Glass Boiling Tube securely above the Bunsen Burner.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'apparatusPlaced', apparatusId: 'digital-balance' },
              { type: 'apparatusPlaced', apparatusId: 'watch-glass' },
              { type: 'apparatusPlaced', apparatusId: 'bunsen-burner' },
              { type: 'apparatusPlaced', apparatusId: 'boiling-tube' },
            ],
          },
          instruction: '✓ Laboratory apparatus successfully assembled! Setup is complete.',
        },
      ],
      requiredActions: ['place-balance', 'place-watch-glass', 'place-burner', 'place-boiling-tube'],
      type: 'lab',
    },
    {
      id: 'weigh-mix',
      label: 'Prepare Physical Mixture (Fe + S)',
      instruction:
        'Prepare a physical mixture of Iron and Sulphur: add 7.00 g of Iron Filings and 4.00 g of Sulphur Powder onto the Watch Glass.',
      dynamicInstructions: [
        {
          condition: { type: 'not', condition: { type: 'flag', key: 'hasIron', equals: true } },
          instruction: 'Step 1: Drag the Iron Filings (7 g) from the toolbox onto the Watch Glass on the digital balance.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'hasIron', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'hasSulphur', equals: true } },
            ],
          },
          instruction: 'Step 2: Iron filings added (Balance: 7.00 g). Now drag the Sulphur Powder (4 g) onto the same Watch Glass.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'hasIron', equals: true },
              { type: 'flag', key: 'hasSulphur', equals: true },
            ],
          },
          instruction: '✓ Physical mixture prepared! (Balance: 11.00 g). Notice the intermixed grey iron and yellow sulphur grains.',
        },
      ],
      requiredActions: ['added-iron', 'added-sulphur'],
      type: 'lab',
    },
    {
      id: 'test-magnet-mix',
      label: 'Magnetic Separation & Return Test (Fe + S)',
      instruction:
        'Bring the Horseshoe Magnet over the watch glass containing the Fe + S mixture to separate the iron filings. Then, return the iron filings to restore the physical mixture.',
      dynamicInstructions: [
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'not', condition: { type: 'flag', key: 'magnetSeparationComplete', equals: true } },
              { type: 'not', condition: { type: 'flag', key: 'mixtureRestored', equals: true } },
            ],
          },
          instruction: 'Step 1: Drag the Horseshoe Magnet from the toolbox over the Watch Glass to test magnetic separation.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'magnetSeparationComplete', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'mixtureRestored', equals: true } },
            ],
          },
          instruction: 'Step 2: Iron filings separated on magnet poles! Click "↩ Release Iron" near the magnet to return the iron filings to the mixture.',
        },
        {
          condition: { type: 'flag', key: 'mixtureRestored', equals: true },
          instruction: '✓ Iron filings returned and physical mixture restored! (Balance: 11.00 g). Click "Proceed" to continue.',
        },
      ],
      requiredActions: ['tested-magnet-mixture', 'released-iron-mixture'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-cs2-mix',
      label: 'CS₂ Solvent Solubility Test (Fe + S)',
      instruction:
        'Test the solubility of the Fe + S mixture in carbon disulphide (CS₂). Transfer a sample into a test tube, add CS₂, cork, shake, and allow to settle.',
      dynamicInstructions: [
        {
          condition: { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'cs2-test-tube' } },
          instruction: 'Step 1: Drag the Test Tube from the toolbox onto the center of the workbench.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'apparatusPlaced', apparatusId: 'cs2-test-tube' },
              { type: 'not', condition: { type: 'flag', key: 'spatulaHasSample', equals: true } },
              { type: 'not', condition: { type: 'flag', key: 'cs2SamplePrepared', equals: true } },
            ],
          },
          instruction: 'Step 2: Drag the Lab Spatula to the Watch Glass to take a small pinch/sample of the restored Fe + S mixture.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'spatulaHasSample', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'cs2SamplePrepared', equals: true } },
            ],
          },
          instruction: 'Step 3: Drag the Spatula over the Test Tube to transfer the Fe + S sample into the tube.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'cs2SamplePrepared', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'cs2Added', equals: true } },
            ],
          },
          instruction: 'Step 4: Drag the Carbon Disulphide (CS₂) bottle over the Test Tube to add 3 mL of solvent.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'cs2Added', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'cs2Corked', equals: true } },
            ],
          },
          instruction: 'Step 5: Drag the Rubber Stopper over the Test Tube to cork it securely before shaking.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'cs2Corked', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'cs2Shaken', equals: true } },
            ],
          },
          instruction: 'Step 6: Click "Shake Tube" to thoroughly agitate the corked mixture and dissolve soluble components.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'cs2Shaken', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'cs2Settled', equals: true } },
            ],
          },
          instruction: 'Step 7: Click "Allow to Settle" to observe the separation of dissolved and insoluble components.',
        },
        {
          condition: { type: 'flag', key: 'cs2Settled', equals: true },
          instruction: '✓ Observation Complete: Sulphur has dissolved into the CS₂ solvent forming a clear yellow solution, while insoluble dark Iron filings have settled to the bottom! Click "Proceed" to continue.',
        },
      ],
      requiredActions: [
        'placed-cs2-tube',
        'prepared-cs2-sample',
        'added-cs2',
        'corked-cs2-tube',
        'shook-cs2-tube',
        'settled-cs2-tube',
      ],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'synthesize-compound',
      label: 'Preparation & Heating of Part B (Fe + S → FeS)',
      instruction:
        'Transfer Part B (Fe + S mixture) into the hard-glass boiling tube. Heat strongly over the Bunsen flame until the exothermic reaction produces a dark red glow, forming black Iron(II) Sulfide (FeS). Remove from heat and allow to cool completely.',
      dynamicInstructions: [
        {
          condition: {
            type: 'not',
            condition: { type: 'flag', key: 'partBPrepared', equals: true },
          },
          instruction:
            'Step 1: Transfer Part B (the remaining Fe + S mixture from the watch glass) into the hard-glass boiling tube mounted above the Bunsen burner.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'partBPrepared', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'heatingStarted', equals: true } },
            ],
          },
          instruction:
            'Step 2: Part B is loaded in the boiling tube. Click "🔥 Start Heating" to ignite the Bunsen burner flame.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'heatingStarted', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'reactionGlowing', equals: true } },
            ],
          },
          instruction:
            'Step 3: Burner lit! Click "🔥 Heat Strongly" to heat strongly until an exothermic red-hot glow spreads through the mixture (Fe + S → FeS).',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'reactionGlowing', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'feSFormed', equals: true } },
            ],
          },
          instruction:
            'Step 4: Reaction glowing red-hot! Click "⚡ Form FeS" as the elements combine chemically into uniform black Iron(II) Sulfide.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'feSFormed', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'removedFromHeat', equals: true } },
            ],
          },
          instruction:
            'Step 5: Black FeS solid formed! Click "❄️ Remove from Heat" to extinguish the Bunsen burner flame.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'removedFromHeat', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'feSCooled', equals: true } },
            ],
          },
          instruction:
            'Step 6: Burner turned off. Click "⏳ Allow to Cool" to let the FeS solid cool completely before proceeding.',
        },
        {
          condition: { type: 'flag', key: 'feSCooled', equals: true },
          instruction:
            '✓ FeS synthesis and cooling complete! Notice the uniform black Iron(II) Sulfide solid inside the boiling tube. Click "Proceed" to grind the solid.',
        },
      ],
      requiredActions: ['synthesized-compound'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'crush-fes',
      label: 'Crush & Grind FeS Solid',
      instruction:
        'Transfer the cooled black Iron(II) Sulfide solid from the boiling tube into the Mortar. Grind it thoroughly using the Pestle into a fine black powder.',
      dynamicInstructions: [
        {
          condition: { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'mortar' } },
          instruction: 'Step 1: Drag the Mortar from the toolbox onto the center of the workbench.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'apparatusPlaced', apparatusId: 'mortar' },
              { type: 'not', condition: { type: 'flag', key: 'feSInMortar', equals: true } },
              { type: 'not', condition: { type: 'flag', key: 'feSPowderReady', equals: true } },
            ],
          },
          instruction: 'Step 2: Drag the Boiling Tube over the Mortar to transfer the cooled black FeS solid chunk into the mortar.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'feSInMortar', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'feSPowderReady', equals: true } },
            ],
          },
          instruction: 'Step 3: Drag the Pestle over the Mortar (or click "Crush / Grind FeS") to grind the solid into a fine black powder.',
        },
        {
          condition: { type: 'flag', key: 'feSPowderReady', equals: true },
          instruction: '✓ FeS solid successfully ground into fine black powder! Click "Proceed" to record visual observations.',
        },
      ],
      requiredActions: ['crushed-fes'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'observe-fes',
      label: 'Visual Observation of FeS Powder',
      instruction:
        'Observe the physical appearance and homogeneity of the prepared FeS powder. Notice that it forms a uniform, homogeneous black material with no separate iron or sulphur grains.',
      dynamicInstructions: [
        {
          condition: { type: 'not', condition: { type: 'flag', key: 'feSObserved', equals: true } },
          instruction: 'Step 1: Inspect the FeS powder closely. Click "👁️ Record Visual Observation" to confirm its homogeneous black appearance.',
        },
        {
          condition: { type: 'flag', key: 'feSObserved', equals: true },
          instruction: '✓ Observation Recorded: FeS is a uniform, homogeneous black chemical compound (unlike the heterogeneous Fe + S mixture). Click "Proceed" for the magnet test.',
        },
      ],
      requiredActions: ['observed-fes-appearance'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-fes-magnet',
      label: 'FeS Magnetism Test',
      instruction:
        'Bring the Horseshoe Magnet over the FeS powder in the mortar to test whether it retains magnetic attraction.',
      dynamicInstructions: [
        {
          condition: { type: 'not', condition: { type: 'flag', key: 'feSMagnetTested', equals: true } },
          instruction: 'Step 1: Drag the Horseshoe Magnet over the Mortar containing FeS powder to test magnetic attraction.',
        },
        {
          condition: { type: 'flag', key: 'feSMagnetTested', equals: true },
          instruction: '✓ Observation Recorded: The black FeS powder is NOT attracted by the magnet! Iron has chemically bonded with sulphur and lost its magnetic property. Click "Proceed" for the CS₂ solubility test.',
        },
      ],
      requiredActions: ['tested-fes-magnet'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'test-fes-cs2',
      label: 'FeS CS₂ Solvent Solubility Test',
      instruction:
        'Test the solubility of FeS powder in carbon disulphide (CS₂). Transfer a pinch of FeS into a test tube, add CS₂, cork, shake, and allow to settle.',
      dynamicInstructions: [
        {
          condition: { type: 'not', condition: { type: 'apparatusPlaced', apparatusId: 'cs2-test-tube' } },
          instruction: 'Step 1: Place the Test Tube on the workbench for the FeS solubility test.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'apparatusPlaced', apparatusId: 'cs2-test-tube' },
              { type: 'not', condition: { type: 'flag', key: 'spatulaHasFeSSample', equals: true } },
              { type: 'not', condition: { type: 'flag', key: 'feSCS2SamplePrepared', equals: true } },
            ],
          },
          instruction: 'Step 2: Drag the Lab Spatula over the Mortar to take a pinch of black FeS powder.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'spatulaHasFeSSample', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'feSCS2SamplePrepared', equals: true } },
            ],
          },
          instruction: 'Step 3: Drag the Spatula over the Test Tube to transfer the FeS sample.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'feSCS2SamplePrepared', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'feSCS2Added', equals: true } },
            ],
          },
          instruction: 'Step 4: Drag the Carbon Disulphide (CS₂) bottle over the Test Tube to add 3 mL of solvent.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'feSCS2Added', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'feSCS2Corked', equals: true } },
            ],
          },
          instruction: 'Step 5: Drag the Rubber Stopper over the Test Tube to cork it securely.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'feSCS2Corked', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'feSCS2Shaken', equals: true } },
            ],
          },
          instruction: 'Step 6: Click "Shake Tube" to thoroughly agitate the corked FeS in CS₂ solvent.',
        },
        {
          condition: {
            type: 'and',
            conditions: [
              { type: 'flag', key: 'feSCS2Shaken', equals: true },
              { type: 'not', condition: { type: 'flag', key: 'feSCS2Settled', equals: true } },
            ],
          },
          instruction: 'Step 7: Click "Allow to Settle" to observe solubility of FeS in CS₂.',
        },
        {
          condition: { type: 'flag', key: 'feSCS2Settled', equals: true },
          instruction: '✓ Observation Recorded: FeS is completely INSOLUBLE in CS₂! The solvent remains clear and colorless (no yellow sulfur dissolves), and black FeS settles to the bottom unchanged. Click "Proceed" for the final comparative analysis.',
        },
      ],
      requiredActions: ['tested-fes-cs2'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: 'Comparative Analysis: Mixture vs Compound',
      instruction:
        'Compare the observed properties of the physical mixture (Fe + S) vs the chemical compound (FeS), and verify the mass ratio Fe : S.',
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
      id: 'place-balance',
      trigger: { type: 'drop', source: 'digital-balance', target: 'balance-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'digital-balance', zoneId: 'balance-zone' },
        { type: 'setFlag', key: 'balancePlaced', value: true },
      ],
      completesAction: 'place-balance',
    },
    {
      id: 'place-watch-glass',
      trigger: { type: 'drop', source: 'watch-glass', target: 'watch-glass-zone' },
      conditions: [{ type: 'apparatusPlaced', apparatusId: 'digital-balance' }],
      blockMessage: 'Place the Digital Balance on the bench first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'watch-glass', zoneId: 'watch-glass-zone' },
        { type: 'setFlag', key: 'watchGlassPlaced', value: true },
      ],
      completesAction: 'place-watch-glass',
    },
    {
      id: 'place-burner',
      trigger: { type: 'drop', source: 'bunsen-burner', target: 'burner-zone' },
      conditions: [{ type: 'apparatusPlaced', apparatusId: 'watch-glass' }],
      blockMessage: 'Place the Watch Glass on the balance first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'bunsen-burner', zoneId: 'burner-zone' },
        { type: 'setFlag', key: 'burnerPlaced', value: true },
        { type: 'setApparatusProp', apparatusId: 'bunsen-burner', prop: 'isLit', value: false },
      ],
      completesAction: 'place-burner',
    },
    {
      id: 'place-boiling-tube',
      trigger: { type: 'drop', source: 'boiling-tube', target: 'boiling-tube-zone' },
      conditions: [{ type: 'apparatusPlaced', apparatusId: 'bunsen-burner' }],
      blockMessage: 'Place the Bunsen Burner on the bench first.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'boiling-tube', zoneId: 'boiling-tube-zone' },
        { type: 'setFlag', key: 'boilingTubePlaced', value: true },
        { type: 'setFlag', key: 'setupComplete', value: true },
      ],
      completesAction: 'place-boiling-tube',
    },
    {
      id: 'add-iron',
      trigger: { type: 'drop', source: 'iron-bottle', target: 'watch-glass-mouth' },
      conditions: [
        { type: 'apparatusPlaced', apparatusId: 'watch-glass' },
        { type: 'apparatusPlaced', apparatusId: 'boiling-tube' },
      ],
      blockMessage: 'Complete the laboratory apparatus setup before weighing reagents.',
      guard: {
        condition: { type: 'flag', key: 'hasIron', equals: true },
        message: 'Iron filings (7.00 g) have already been weighed onto the watch glass.',
      },
      animation: {
        type: 'settle',
        durationMs: 500,
        animatingFlag: 'isAddingIron',
      },
      effects: [
        { type: 'setFlag', key: 'hasIron', value: true },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'reading', value: 7.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 7.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'mass', value: 7.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: '7.00 g' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderType', value: 'iron' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderLevel', value: 0.45 },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: 'Fe Filings (7.00 g)' },
      ],
      completesAction: 'added-iron',
    },
    {
      id: 'add-sulphur',
      trigger: { type: 'drop', source: 'sulphur-bottle', target: 'watch-glass-mouth' },
      conditions: [{ type: 'flag', key: 'hasIron', equals: true }],
      blockMessage: 'Weigh 7.00 g of Iron Filings on the watch glass first before adding Sulphur.',
      guard: {
        condition: { type: 'flag', key: 'hasSulphur', equals: true },
        message: 'Sulphur powder (4.00 g) has already been added to the watch glass.',
      },
      animation: {
        type: 'settle',
        durationMs: 500,
        animatingFlag: 'isAddingSulphur',
      },
      effects: [
        { type: 'setFlag', key: 'hasSulphur', value: true },
        { type: 'setFlag', key: 'mixtureReady', value: true },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'reading', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'mass', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: '11.00 g' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderType', value: 'mixture' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderLevel', value: 0.75 },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: 'Fe + S Mixture (11.00 g)' },
      ],
      completesAction: 'added-sulphur',
    },
    {
      id: 'test-magnet-mix-act',
      trigger: { type: 'drop', source: 'bar-magnet', target: 'watch-glass-mouth' },
      conditions: [
        { type: 'flag', key: 'hasIron', equals: true },
        { type: 'flag', key: 'hasSulphur', equals: true },
        { type: 'flag', key: 'mixtureReady', equals: true },
      ],
      blockMessage: 'Prepare the physical mixture of Iron and Sulphur first before testing with the magnet.',
      guard: {
        condition: {
          type: 'or',
          conditions: [
            { type: 'flag', key: 'magnetSeparationComplete', equals: true },
            { type: 'flag', key: 'mixtureRestored', equals: true },
          ],
        },
        message: 'The magnet is already holding the separated iron filings in the laboratory. Click "↩ Release Iron" to return them.',
      },
      animation: {
        type: 'settle',
        durationMs: 3000,
        animatingFlag: 'isSeparatingMagnet',
      },
      effects: [
        { type: 'setFlag', key: 'magnetSeparationComplete', value: true },
        { type: 'setFlag', key: 'magnetTestedMix', value: true },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderType', value: 'sulphur' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderLevel', value: 0.40 },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasIronSeparated', value: true },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: 'Sulphur (Yellow Powder remains)' },
        { type: 'setApparatusProp', apparatusId: 'bar-magnet', prop: 'hasAttractedIron', value: true },
        { type: 'setApparatusProp', apparatusId: 'bar-magnet', prop: 'label', value: 'Magnet with Attracted Fe Filings' },
      ],
      completesAction: 'tested-magnet-mixture',
    },
    {
      id: 'release-iron-mix-act',
      trigger: { type: 'click', elementId: 'release-iron-btn' },
      conditions: [
        { type: 'not', condition: { type: 'flag', key: 'mixtureRestored', equals: true } },
      ],
      blockMessage: 'Perform the magnet separation first before returning iron filings.',
      guard: {
        condition: { type: 'flag', key: 'mixtureRestored', equals: true },
        message: 'Iron filings have already been returned to the watch glass.',
      },
      animation: {
        type: 'settle',
        durationMs: 1200,
        animatingFlag: 'isReleasingIron',
      },
      effects: [
        { type: 'setFlag', key: 'mixtureRestored', value: true },
        { type: 'setFlag', key: 'magnetSeparationComplete', value: false },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'reading', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'mass', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: '11.00 g' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderType', value: 'mixture' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderLevel', value: 0.75 },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasIronSeparated', value: false },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: 'Fe + S Mixture (11.00 g Restored)' },
        { type: 'setApparatusProp', apparatusId: 'bar-magnet', prop: 'hasAttractedIron', value: false },
        { type: 'setApparatusProp', apparatusId: 'bar-magnet', prop: 'label', value: 'Horseshoe Magnet' },
      ],
      completesAction: 'released-iron-mixture',
    },
    {
      id: 'release-iron-mix-fallback',
      trigger: { type: 'click', elementId: 'return-iron-btn' },
      conditions: [
        { type: 'not', condition: { type: 'flag', key: 'mixtureRestored', equals: true } },
      ],
      animation: {
        type: 'settle',
        durationMs: 1200,
        animatingFlag: 'isReleasingIron',
      },
      effects: [
        { type: 'setFlag', key: 'mixtureRestored', value: true },
        { type: 'setFlag', key: 'magnetSeparationComplete', value: false },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'reading', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'mass', value: 11.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: '11.00 g' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderType', value: 'mixture' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'powderLevel', value: 0.75 },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasIronSeparated', value: false },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: 'Fe + S Mixture (11.00 g Restored)' },
        { type: 'setApparatusProp', apparatusId: 'bar-magnet', prop: 'hasAttractedIron', value: false },
        { type: 'setApparatusProp', apparatusId: 'bar-magnet', prop: 'label', value: 'Horseshoe Magnet' },
      ],
      completesAction: 'released-iron-mixture',
    },
    {
      id: 'place-cs2-tube',
      trigger: { type: 'drop', source: 'cs2-test-tube', target: 'cs2-tube-zone' },
      conditions: [{ type: 'flag', key: 'mixtureRestored', equals: true }],
      blockMessage: 'Restore the Fe + S physical mixture first before setting up the CS₂ test.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'cs2-test-tube', zoneId: 'cs2-tube-zone' },
        { type: 'setFlag', key: 'cs2TubePlaced', value: true },
        { type: 'setFlag', key: 'cs2TestStarted', value: true },
      ],
      completesAction: 'placed-cs2-tube',
    },
    {
      id: 'scoop-cs2-sample',
      trigger: { type: 'drop', source: 'spatula', target: 'watch-glass-mouth' },
      conditions: [
        { type: 'flag', key: 'mixtureRestored', equals: true },
        { type: 'apparatusPlaced', apparatusId: 'cs2-test-tube' },
      ],
      blockMessage: 'Place the test tube on the workbench first before scooping the Fe + S sample.',
      guard: {
        condition: {
          type: 'or',
          conditions: [
            { type: 'flag', key: 'spatulaHasSample', equals: true },
            { type: 'flag', key: 'cs2SamplePrepared', equals: true },
          ],
        },
        message: 'A sample of the Fe + S mixture has already been scooped. Transfer it into the test tube.',
      },
      animation: {
        type: 'settle',
        durationMs: 500,
        animatingFlag: 'isScoopingSample',
      },
      effects: [
        { type: 'setFlag', key: 'spatulaHasSample', value: true },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'hasSample', value: true },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'label', value: 'Spatula (with Fe + S sample)' },
      ],
      completesAction: 'scooped-cs2-sample',
    },
    {
      id: 'transfer-cs2-sample',
      trigger: { type: 'drop', source: 'spatula', target: 'cs2-tube-mouth' },
      conditions: [{ type: 'flag', key: 'spatulaHasSample', equals: true }],
      blockMessage: 'Drag the spatula to the watch glass to scoop a pinch of the Fe + S mixture first.',
      guard: {
        condition: { type: 'flag', key: 'cs2SamplePrepared', equals: true },
        message: 'The Fe + S sample has already been transferred into the test tube.',
      },
      animation: {
        type: 'settle',
        durationMs: 600,
        animatingFlag: 'isTransferringSample',
      },
      effects: [
        { type: 'setFlag', key: 'cs2SamplePrepared', value: true },
        { type: 'setFlag', key: 'spatulaHasSample', value: false },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'hasSample', value: false },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'label', value: 'Lab Spatula' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'powderType', value: 'mixture' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'Test Tube (Fe + S sample)' },
      ],
      completesAction: 'prepared-cs2-sample',
    },
    {
      id: 'add-cs2-act',
      trigger: { type: 'drop', source: 'cs2-bottle', target: 'cs2-tube-mouth' },
      conditions: [{ type: 'flag', key: 'cs2SamplePrepared', equals: true }],
      blockMessage: 'Prepare and transfer a sample of the Fe + S mixture into the test tube first before adding CS₂.',
      guard: {
        condition: { type: 'flag', key: 'cs2Added', equals: true },
        message: 'CS₂ solvent (3 mL) has already been added to the test tube.',
      },
      animation: {
        type: 'pour',
        durationMs: 800,
        animatingFlag: 'isAddingCS2Reagent',
      },
      effects: [
        { type: 'setFlag', key: 'cs2Added', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidColor', value: 'rgba(254, 240, 138, 0.30)' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'Test Tube (Fe + S in CS₂)' },
      ],
      completesAction: 'added-cs2',
    },
    {
      id: 'cork-cs2-tube-act',
      trigger: { type: 'drop', source: 'rubber-cork', target: 'cs2-tube-mouth' },
      conditions: [{ type: 'flag', key: 'cs2Added', equals: true }],
      blockMessage: 'Add CS₂ solvent to the test tube first before corking.',
      guard: {
        condition: { type: 'flag', key: 'cs2Corked', equals: true },
        message: 'The test tube is already securely corked.',
      },
      effects: [
        { type: 'setFlag', key: 'cs2Corked', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasCork', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isCorked', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'Test Tube (Corked with CS₂ & Fe+S)' },
      ],
      completesAction: 'corked-cs2-tube',
    },
    {
      id: 'shake-cs2-tube-act',
      trigger: { type: 'click', elementId: 'shake-cs2-tube' },
      conditions: [
        { type: 'flag', key: 'cs2Corked', equals: true },
        { type: 'not', condition: { type: 'flag', key: 'feSCooled', equals: true } },
      ],
      blockMessage: 'Securely cork the test tube before shaking to prevent hazardous solvent spills.',
      guard: {
        condition: { type: 'flag', key: 'cs2Shaken', equals: true },
        message: 'The test tube has already been thoroughly shaken.',
      },
      animation: {
        type: 'settle',
        durationMs: 2000,
        animatingFlag: 'isShakingCS2Tube',
      },
      effects: [
        { type: 'setFlag', key: 'cs2Shaken', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isShaken', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidColor', value: 'rgba(234, 179, 8, 0.65)' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'Test Tube (Shaken mixture in CS₂)' },
      ],
      completesAction: 'shook-cs2-tube',
    },
    {
      id: 'settle-cs2-tube-act',
      trigger: { type: 'click', elementId: 'settle-cs2-tube' },
      conditions: [
        { type: 'flag', key: 'cs2Shaken', equals: true },
        { type: 'not', condition: { type: 'flag', key: 'feSCooled', equals: true } },
      ],
      blockMessage: 'Shake the corked test tube first before allowing it to settle.',
      guard: {
        condition: { type: 'flag', key: 'cs2Settled', equals: true },
        message: 'The mixture has already settled.',
      },
      animation: {
        type: 'settle',
        durationMs: 1500,
        animatingFlag: 'isSettlingCS2Tube',
      },
      effects: [
        { type: 'setFlag', key: 'cs2Settled', value: true },
        { type: 'setFlag', key: 'cs2TestComplete', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasSediment', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidColor', value: '#eab308' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'sedimentColor', value: '#0f172a' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'S dissolved in CS₂ (yellow) + Fe settled (dark solid)' },
      ],
      completesAction: 'settled-cs2-tube',
    },
    {
      id: 'scoop-part-b-act',
      trigger: { type: 'drop', source: 'spatula', target: 'watch-glass-mouth' },
      conditions: [
        { type: 'flag', key: 'cs2Settled', equals: true },
        { type: 'not', condition: { type: 'flag', key: 'partBPrepared', equals: true } },
      ],
      blockMessage: 'Complete and settle the CS₂ solubility test first before preparing Part B.',
      guard: {
        condition: {
          type: 'or',
          conditions: [
            { type: 'flag', key: 'spatulaHasPartB', equals: true },
            { type: 'flag', key: 'partBPrepared', equals: true },
          ],
        },
        message: 'Part B (Fe + S mixture) is already on the spatula. Transfer it into the boiling tube.',
      },
      animation: {
        type: 'settle',
        durationMs: 500,
        animatingFlag: 'isScoopingPartB',
      },
      effects: [
        { type: 'setFlag', key: 'spatulaHasPartB', value: true },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'hasSample', value: true },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'label', value: 'Spatula (with Part B: Fe + S)' },
      ],
      completesAction: 'scooped-part-b',
    },
    {
      id: 'transfer-part-b-spatula-act',
      trigger: { type: 'drop', source: 'spatula', target: 'tube-mouth' },
      conditions: [{ type: 'flag', key: 'spatulaHasPartB', equals: true }],
      blockMessage: 'Scoop Part B (Fe + S mixture) from the watch glass using the spatula first.',
      guard: {
        condition: { type: 'flag', key: 'partBPrepared', equals: true },
        message: 'Part B mixture has already been transferred to the boiling tube.',
      },
      animation: {
        type: 'settle',
        durationMs: 600,
        animatingFlag: 'isTransferringPartB',
      },
      effects: [
        { type: 'setFlag', key: 'partBPrepared', value: true },
        { type: 'setFlag', key: 'spatulaHasPartB', value: false },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'hasSample', value: false },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'label', value: 'Lab Spatula' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'powderType', value: 'mixture' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'Boiling Tube (with Part B: Fe + S)' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasPowder', value: false },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: 'Watch Glass (Empty)' },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'reading', value: 0.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 0.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'mass', value: 0.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: '0.00 g' },
      ],
      completesAction: 'transferred-part-b',
    },
    {
      id: 'transfer-part-b-watch-glass-act',
      trigger: { type: 'drop', source: 'watch-glass', target: 'tube-mouth' },
      conditions: [{ type: 'flag', key: 'cs2Settled', equals: true }],
      blockMessage: 'Complete and settle the CS₂ solubility test first before preparing Part B.',
      guard: {
        condition: { type: 'flag', key: 'partBPrepared', equals: true },
        message: 'Part B mixture has already been transferred to the boiling tube.',
      },
      animation: {
        type: 'settle',
        durationMs: 700,
        animatingFlag: 'isTransferringPartB',
      },
      effects: [
        { type: 'setFlag', key: 'partBPrepared', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'powderType', value: 'mixture' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'Boiling Tube (with Part B: Fe + S)' },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'hasPowder', value: false },
        { type: 'setApparatusProp', apparatusId: 'watch-glass', prop: 'label', value: 'Watch Glass (Empty)' },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'reading', value: 0.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'massGrams', value: 0.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'mass', value: 0.00 },
        { type: 'setApparatusProp', apparatusId: 'digital-balance', prop: 'label', value: '0.00 g' },
      ],
      completesAction: 'transferred-part-b',
    },
    {
      id: 'start-heating-act',
      trigger: { type: 'click', elementId: 'start-heating-btn' },
      conditions: [{ type: 'flag', key: 'partBPrepared', equals: true }],
      blockMessage: 'Transfer Part B (Fe + S mixture) into the boiling tube first before starting heating.',
      guard: {
        condition: { type: 'flag', key: 'heatingStarted', equals: true },
        message: 'Heating has already started.',
      },
      animation: {
        type: 'heat',
        durationMs: 800,
        animatingFlag: 'isStartingHeat',
      },
      effects: [
        { type: 'setFlag', key: 'heatingStarted', value: true },
        { type: 'setFlag', key: 'burnerLit', value: true },
        { type: 'setApparatusProp', apparatusId: 'bunsen-burner', prop: 'isLit', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'powderType', value: 'mixture' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'Boiling Tube (Heating Fe + S Mixture...)' },
      ],
      completesAction: 'started-heating',
    },
    {
      id: 'observe-glow-act',
      trigger: { type: 'click', elementId: 'observe-glow-btn' },
      conditions: [{ type: 'flag', key: 'heatingStarted', equals: true }],
      blockMessage: 'Start heating over the Bunsen burner flame first.',
      guard: {
        condition: { type: 'flag', key: 'reactionGlowing', equals: true },
        message: 'The exothermic reaction is already glowing red-hot.',
      },
      animation: {
        type: 'settle',
        durationMs: 1500,
        animatingFlag: 'isExothermicGlowing',
      },
      effects: [
        { type: 'setFlag', key: 'reactionGlowing', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'powderType', value: 'glowing' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'Exothermic Reaction: Glowing Red-Hot (Fe + S → FeS)' },
      ],
      completesAction: 'observed-glow',
    },
    {
      id: 'form-fes-act',
      trigger: { type: 'click', elementId: 'form-fes-btn' },
      conditions: [{ type: 'flag', key: 'reactionGlowing', equals: true }],
      blockMessage: 'Heat strongly until the exothermic red glow spreads through the mixture.',
      guard: {
        condition: { type: 'flag', key: 'feSFormed', equals: true },
        message: 'Iron(II) Sulfide (FeS) has already formed.',
      },
      animation: {
        type: 'settle',
        durationMs: 1200,
        animatingFlag: 'isFormingFeS',
      },
      effects: [
        { type: 'setFlag', key: 'feSFormed', value: true },
        { type: 'setFlag', key: 'compoundSynthesized', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'powderType', value: 'fes' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'liquidColor', value: '#18181b' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'FeS (Hot Black Solid Mass formed)' },
      ],
      completesAction: 'formed-fes',
    },
    {
      id: 'remove-heat-act',
      trigger: { type: 'click', elementId: 'remove-heat-btn' },
      conditions: [{ type: 'flag', key: 'feSFormed', equals: true }],
      blockMessage: 'Allow the exothermic reaction to complete and form FeS before removing from heat.',
      guard: {
        condition: { type: 'flag', key: 'removedFromHeat', equals: true },
        message: 'The boiling tube has already been removed from heat.',
      },
      effects: [
        { type: 'setFlag', key: 'removedFromHeat', value: true },
        { type: 'setFlag', key: 'burnerLit', value: false },
        { type: 'setApparatusProp', apparatusId: 'bunsen-burner', prop: 'isLit', value: false },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'Boiling Tube (FeS cooling...)' },
      ],
      completesAction: 'removed-from-heat',
    },
    {
      id: 'complete-cooling-act',
      trigger: { type: 'click', elementId: 'complete-cooling-btn' },
      conditions: [
        { type: 'flag', key: 'removedFromHeat', equals: true },
        { type: 'not', condition: { type: 'flag', key: 'burnerLit', equals: true } },
      ],
      blockMessage: 'Extinguish the Bunsen burner flame and remove from heat before cooling.',
      guard: {
        condition: { type: 'flag', key: 'feSCooled', equals: true },
        message: 'The FeS compound has already cooled completely.',
      },
      animation: {
        type: 'settle',
        durationMs: 1200,
        animatingFlag: 'isCoolingFeS',
      },
      effects: [
        { type: 'setFlag', key: 'feSCooled', value: true },
        { type: 'setFlag', key: 'compoundSynthesized', value: true },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'powderType', value: 'fes' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'liquidColor', value: '#18181b' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'FeS Compound (Cooled Black Solid)' },
      ],
      completesAction: 'synthesized-compound',
    },
    {
      id: 'synthesize-advance-fallback',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [{ type: 'flag', key: 'feSCooled', equals: true }],
      blockMessage: 'Complete the heating and cooling of FeS first before advancing.',
      effects: [
        { type: 'setFlag', key: 'feSCooled', value: true },
        { type: 'setFlag', key: 'compoundSynthesized', value: true },
      ],
      completesAction: 'synthesized-compound',
    },
    {
      id: 'place-mortar-act',
      trigger: { type: 'drop', source: 'mortar', target: 'mortar-zone' },
      conditions: [{ type: 'flag', key: 'feSCooled', equals: true }],
      blockMessage: 'Cool the synthesized FeS solid completely first before setting up the mortar.',
      effects: [
        { type: 'placeApparatus', apparatusId: 'mortar', zoneId: 'mortar-zone' },
        { type: 'setFlag', key: 'mortarPlaced', value: true },
      ],
      completesAction: 'placed-mortar',
    },
    {
      id: 'transfer-fes-to-mortar-act',
      trigger: { type: 'drop', source: 'boiling-tube', target: 'mortar-mouth' },
      conditions: [{ type: 'flag', key: 'feSCooled', equals: true }],
      blockMessage: 'Allow FeS to cool completely before transferring to the mortar.',
      guard: {
        condition: {
          type: 'or',
          conditions: [
            { type: 'flag', key: 'feSInMortar', equals: true },
            { type: 'flag', key: 'feSPowderReady', equals: true },
          ],
        },
        message: 'FeS solid has already been transferred to the mortar.',
      },
      animation: {
        type: 'settle',
        durationMs: 800,
        animatingFlag: 'isTransferringFeSToMortar',
      },
      effects: [
        { type: 'setFlag', key: 'feSInMortar', value: true },
        { type: 'setFlag', key: 'feSTransferredToMortar', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'hasSolid', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'Mortar (with Black FeS Solid)' },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'hasPowder', value: false },
        { type: 'setApparatusProp', apparatusId: 'boiling-tube', prop: 'label', value: 'Hard Glass Boiling Tube (Empty)' },
      ],
      completesAction: 'transferred-fes-to-mortar',
    },
    {
      id: 'crush-fes-pestle-act',
      trigger: { type: 'drop', source: 'pestle', target: 'mortar-mouth' },
      conditions: [
        {
          type: 'or',
          conditions: [
            { type: 'flag', key: 'feSInMortar', equals: true },
            { type: 'flag', key: 'feSCooled', equals: true },
          ],
        },
      ],
      blockMessage: 'Transfer the black FeS solid into the mortar first before crushing.',
      guard: {
        condition: { type: 'flag', key: 'feSPowderReady', equals: true },
        message: 'The FeS solid has already been finely ground into powder.',
      },
      animation: {
        type: 'settle',
        durationMs: 1800,
        animatingFlag: 'isCrushingFeS',
      },
      effects: [
        { type: 'setFlag', key: 'feSPowderReady', value: true },
        { type: 'setFlag', key: 'feSInMortar', value: false },
        { type: 'setFlag', key: 'cs2Settled', value: false },
        { type: 'setFlag', key: 'cs2Corked', value: false },
        { type: 'setFlag', key: 'cs2Shaken', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasCork', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isCorked', value: false },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'hasSolid', value: false },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'powderType', value: 'fes' },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'Mortar (FeS Fine Black Powder)' },
        { type: 'setApparatusProp', apparatusId: 'pestle', prop: 'label', value: 'Pestle' },
      ],
      completesAction: 'crushed-fes',
    },
    {
      id: 'crush-fes-btn-act',
      trigger: { type: 'click', elementId: 'crush-fes-btn' },
      conditions: [
        {
          type: 'or',
          conditions: [
            { type: 'flag', key: 'feSInMortar', equals: true },
            { type: 'flag', key: 'feSCooled', equals: true },
          ],
        },
      ],
      blockMessage: 'Transfer the black FeS solid into the mortar first before crushing.',
      guard: {
        condition: { type: 'flag', key: 'feSPowderReady', equals: true },
        message: 'The FeS solid has already been finely ground into powder.',
      },
      animation: {
        type: 'settle',
        durationMs: 1800,
        animatingFlag: 'isCrushingFeS',
      },
      effects: [
        { type: 'setFlag', key: 'feSPowderReady', value: true },
        { type: 'setFlag', key: 'feSInMortar', value: false },
        { type: 'setFlag', key: 'cs2Settled', value: false },
        { type: 'setFlag', key: 'cs2Corked', value: false },
        { type: 'setFlag', key: 'cs2Shaken', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasCork', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isCorked', value: false },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'hasSolid', value: false },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'powderType', value: 'fes' },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'Mortar (FeS Fine Black Powder)' },
        { type: 'setApparatusProp', apparatusId: 'pestle', prop: 'label', value: 'Pestle' },
      ],
      completesAction: 'crushed-fes',
    },
    {
      id: 'observe-fes-act',
      trigger: { type: 'click', elementId: 'observe-fes-btn' },
      conditions: [{ type: 'flag', key: 'feSPowderReady', equals: true }],
      blockMessage: 'Crush the FeS solid into fine powder first before observing appearance.',
      guard: {
        condition: { type: 'flag', key: 'feSObserved', equals: true },
        message: 'Visual observation of FeS powder has already been recorded.',
      },
      effects: [
        { type: 'setFlag', key: 'feSObserved', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'FeS: Homogeneous Black Powder (Uniform Compound)' },
      ],
      completesAction: 'observed-fes-appearance',
    },
    {
      id: 'observe-fes-inspect-btn-act',
      trigger: { type: 'click', elementId: 'inspect-btn' },
      conditions: [{ type: 'flag', key: 'feSPowderReady', equals: true }],
      effects: [
        { type: 'setFlag', key: 'feSObserved', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'FeS: Homogeneous Black Powder (Uniform Compound)' },
      ],
      completesAction: 'observed-fes-appearance',
    },
    {
      id: 'observe-fes-inspect-reaction-btn-act',
      trigger: { type: 'click', elementId: 'btn-inspect-reaction' },
      conditions: [{ type: 'flag', key: 'feSPowderReady', equals: true }],
      effects: [
        { type: 'setFlag', key: 'feSObserved', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'FeS: Homogeneous Black Powder (Uniform Compound)' },
      ],
      completesAction: 'observed-fes-appearance',
    },
    {
      id: 'observe-fes-magnifier-act',
      trigger: { type: 'drop', source: 'magnifying-glass', target: 'mortar-mouth' },
      conditions: [{ type: 'flag', key: 'feSPowderReady', equals: true }],
      animation: {
        type: 'settle',
        durationMs: 1000,
        animatingFlag: 'isInspectingFeS',
      },
      effects: [
        { type: 'setFlag', key: 'feSObserved', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'FeS: Homogeneous Black Powder (Uniform Compound)' },
      ],
      completesAction: 'observed-fes-appearance',
    },
    {
      id: 'observe-fes-mortar-click-act',
      trigger: { type: 'click', elementId: 'mortar' },
      conditions: [{ type: 'flag', key: 'feSPowderReady', equals: true }],
      effects: [
        { type: 'setFlag', key: 'feSObserved', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'FeS: Homogeneous Black Powder (Uniform Compound)' },
      ],
      completesAction: 'observed-fes-appearance',
    },
    {
      id: 'observe-fes-advance-fallback',
      trigger: { type: 'click', elementId: 'advance-step' },
      conditions: [{ type: 'flag', key: 'feSPowderReady', equals: true }],
      effects: [
        { type: 'setFlag', key: 'feSObserved', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'FeS: Homogeneous Black Powder (Uniform Compound)' },
      ],
      completesAction: 'observed-fes-appearance',
    },
    {
      id: 'test-fes-magnet-act',
      trigger: { type: 'drop', source: 'bar-magnet', target: 'mortar-mouth' },
      conditions: [{ type: 'flag', key: 'feSPowderReady', equals: true }],
      blockMessage: 'Grind FeS into fine powder and observe its appearance first.',
      guard: {
        condition: { type: 'flag', key: 'feSMagnetTested', equals: true },
        message: 'The magnetism test on FeS powder has already been performed.',
      },
      animation: {
        type: 'settle',
        durationMs: 1500,
        animatingFlag: 'isTestingFeSMagnet',
      },
      effects: [
        { type: 'setFlag', key: 'feSMagnetTested', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'FeS: Non-Magnetic! No attraction to magnet.' },
        { type: 'setApparatusProp', apparatusId: 'bar-magnet', prop: 'hasAttractedIron', value: false },
        { type: 'setApparatusProp', apparatusId: 'bar-magnet', prop: 'label', value: 'Horseshoe Magnet (FeS is Non-Magnetic)' },
      ],
      completesAction: 'tested-fes-magnet',
    },
    {
      id: 'test-fes-lab-magnet-fallback',
      trigger: { type: 'drop', source: 'lab-bar-magnet', target: 'mortar-mouth' },
      conditions: [{ type: 'flag', key: 'feSPowderReady', equals: true }],
      animation: {
        type: 'settle',
        durationMs: 1500,
        animatingFlag: 'isTestingFeSMagnet',
      },
      effects: [
        { type: 'setFlag', key: 'feSMagnetTested', value: true },
        { type: 'setApparatusProp', apparatusId: 'mortar', prop: 'label', value: 'FeS: Non-Magnetic! No attraction to magnet.' },
      ],
      completesAction: 'tested-fes-magnet',
    },
    {
      id: 'place-cs2-tube-fes',
      trigger: { type: 'drop', source: 'cs2-test-tube', target: 'cs2-tube-zone' },
      conditions: [{ type: 'flag', key: 'feSMagnetTested', equals: true }],
      effects: [
        { type: 'placeApparatus', apparatusId: 'cs2-test-tube', zoneId: 'cs2-tube-zone' },
        { type: 'setFlag', key: 'cs2TubePlaced', value: true },
        { type: 'setFlag', key: 'cs2Corked', value: false },
        { type: 'setFlag', key: 'cs2Shaken', value: false },
        { type: 'setFlag', key: 'cs2Settled', value: false },
        { type: 'setFlag', key: 'feSCS2Corked', value: false },
        { type: 'setFlag', key: 'feSCS2Shaken', value: false },
        { type: 'setFlag', key: 'feSCS2Settled', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasCork', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isCorked', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasSediment', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isShaken', value: false },
      ],
      completesAction: 'placed-cs2-tube-fes',
    },
    {
      id: 'scoop-fes-sample-act',
      trigger: { type: 'drop', source: 'spatula', target: 'mortar-mouth' },
      conditions: [{ type: 'flag', key: 'feSMagnetTested', equals: true }],
      blockMessage: 'Complete the FeS magnet test first before performing the CS₂ solubility test.',
      guard: {
        condition: {
          type: 'or',
          conditions: [
            { type: 'flag', key: 'spatulaHasFeSSample', equals: true },
            { type: 'flag', key: 'feSCS2SamplePrepared', equals: true },
          ],
        },
        message: 'A sample of FeS powder is already scooped. Transfer it into the test tube.',
      },
      animation: {
        type: 'settle',
        durationMs: 500,
        animatingFlag: 'isScoopingFeSSample',
      },
      effects: [
        { type: 'setFlag', key: 'spatulaHasFeSSample', value: true },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'hasSample', value: true },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'label', value: 'Spatula (with FeS powder)' },
      ],
      completesAction: 'scooped-fes-sample',
    },
    {
      id: 'transfer-fes-sample-act',
      trigger: { type: 'drop', source: 'spatula', target: 'cs2-tube-mouth' },
      conditions: [{ type: 'flag', key: 'spatulaHasFeSSample', equals: true }],
      blockMessage: 'Scoop a pinch of FeS powder from the mortar using the spatula first.',
      guard: {
        condition: { type: 'flag', key: 'feSCS2SamplePrepared', equals: true },
        message: 'The FeS sample has already been placed in the test tube.',
      },
      animation: {
        type: 'settle',
        durationMs: 600,
        animatingFlag: 'isTransferringFeSSample',
      },
      effects: [
        { type: 'setFlag', key: 'feSCS2SamplePrepared', value: true },
        { type: 'setFlag', key: 'spatulaHasFeSSample', value: false },
        { type: 'setFlag', key: 'cs2Corked', value: false },
        { type: 'setFlag', key: 'cs2Shaken', value: false },
        { type: 'setFlag', key: 'cs2Settled', value: false },
        { type: 'setFlag', key: 'feSCS2Corked', value: false },
        { type: 'setFlag', key: 'feSCS2Shaken', value: false },
        { type: 'setFlag', key: 'feSCS2Settled', value: false },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'hasSample', value: false },
        { type: 'setApparatusProp', apparatusId: 'spatula', prop: 'label', value: 'Lab Spatula' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasPowder', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasSediment', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'powderType', value: 'fes' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidLevel', value: 0 },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasCork', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isCorked', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isShaken', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'Test Tube (FeS sample)' },
      ],
      completesAction: 'prepared-fes-cs2-sample',
    },
    {
      id: 'add-cs2-fes-act',
      trigger: { type: 'drop', source: 'cs2-bottle', target: 'cs2-tube-mouth' },
      conditions: [{ type: 'flag', key: 'feSCS2SamplePrepared', equals: true }],
      blockMessage: 'Transfer a pinch of FeS powder into the test tube first before adding CS₂.',
      guard: {
        condition: { type: 'flag', key: 'feSCS2Added', equals: true },
        message: 'CS₂ solvent has already been added to the FeS sample.',
      },
      animation: {
        type: 'pour',
        durationMs: 800,
        animatingFlag: 'isAddingCS2ToFeS',
      },
      effects: [
        { type: 'setFlag', key: 'feSCS2Added', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasCork', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isCorked', value: false },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidColor', value: 'rgba(241, 245, 249, 0.35)' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'Test Tube (FeS in CS₂ solvent)' },
      ],
      completesAction: 'added-cs2-fes',
    },
    {
      id: 'cork-cs2-fes-act',
      trigger: { type: 'drop', source: 'rubber-cork', target: 'cs2-tube-mouth' },
      conditions: [{ type: 'flag', key: 'feSCS2Added', equals: true }],
      blockMessage: 'Add CS₂ solvent into the test tube first before corking.',
      guard: {
        condition: { type: 'flag', key: 'feSCS2Corked', equals: true },
        message: 'The test tube is already securely corked.',
      },
      effects: [
        { type: 'setFlag', key: 'feSCS2Corked', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasCork', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isCorked', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'Test Tube (Corked with CS₂ & FeS)' },
      ],
      completesAction: 'corked-cs2-fes',
    },
    {
      id: 'shake-cs2-fes-act',
      trigger: { type: 'click', elementId: 'shake-cs2-tube' },
      conditions: [{ type: 'flag', key: 'feSCS2Corked', equals: true }],
      blockMessage: 'Securely cork the test tube before shaking.',
      guard: {
        condition: { type: 'flag', key: 'feSCS2Shaken', equals: true },
        message: 'The test tube has already been thoroughly shaken.',
      },
      animation: {
        type: 'settle',
        durationMs: 2000,
        animatingFlag: 'isShakingCS2Tube',
      },
      effects: [
        { type: 'setFlag', key: 'feSCS2Shaken', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'isShaken', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidColor', value: 'rgba(226, 232, 240, 0.45)' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'Test Tube (Shaken FeS in CS₂)' },
      ],
      completesAction: 'shook-cs2-fes',
    },
    {
      id: 'settle-cs2-fes-act',
      trigger: { type: 'click', elementId: 'settle-cs2-tube' },
      conditions: [{ type: 'flag', key: 'feSCS2Shaken', equals: true }],
      blockMessage: 'Shake the corked test tube first before allowing it to settle.',
      guard: {
        condition: { type: 'flag', key: 'feSCS2Settled', equals: true },
        message: 'The FeS in CS₂ has already settled.',
      },
      animation: {
        type: 'settle',
        durationMs: 1500,
        animatingFlag: 'isSettlingCS2Tube',
      },
      effects: [
        { type: 'setFlag', key: 'feSCS2Settled', value: true },
        { type: 'setFlag', key: 'feSCS2TestComplete', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'hasSediment', value: true },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'powderType', value: 'fes' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidLevel', value: 0.35 },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'liquidColor', value: 'rgba(248, 250, 252, 0.2)' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'sedimentColor', value: '#09090b' },
        { type: 'setApparatusProp', apparatusId: 'cs2-test-tube', prop: 'label', value: 'FeS is Insoluble in CS₂! Clear solvent + Black FeS settled' },
      ],
      completesAction: 'tested-fes-cs2',
    },
  ],

  // ── Chemistry ──
  chemistry: {
    reaction: 'Fe(s) + S(s) -> FeS(s) (Exothermic Synthesis)',
    reactionType: 'Synthesis of Chemical Compound',
    constants: {
      massFe: 7.0,
      massS: 4.0,
    },
  },

  // ── Calculation / Observation Assessment Form ──
  calculation: {
    title: 'Mixture vs Compound: Observation & Quantitative Assessment',
    instruction:
      'Enter the recorded reactant masses, compute the mass ratio, and complete the observation-based assessment questions below based on your practical findings.',
    fields: [
      // ── SECTION 1: RECORDED VALUES ──
      {
        id: 'massFe',
        section: 'Section 1 — Recorded Values',
        label: 'Mass of Iron Filings used (g)',
        placeholder: 'Enter recorded mass of Fe (e.g. 7.0)',
        unit: 'g',
        expectedValue: 7.0,
        tolerance: 0.05,
        toleranceType: 'absolute',
      },
      {
        id: 'massS',
        label: 'Mass of Sulphur Powder used (g)',
        placeholder: 'Enter recorded mass of S (e.g. 4.0)',
        unit: 'g',
        expectedValue: 4.0,
        tolerance: 0.05,
        toleranceType: 'absolute',
      },

      // ── SECTION 2: YOUR CALCULATION ──
      {
        id: 'massRatioSetup',
        section: 'Section 2 — Your Calculation',
        label: 'Correct Ratio Setup: mass(Fe) / mass(S) quotient setup',
        placeholder: 'Enter quotient setup (7.0 / 4.0)',
        unit: '',
        expectedValue: 1.75,
        tolerance: 0.01,
        toleranceType: 'absolute',
        helperText: 'Mass Ratio Setup = mass(Fe) / mass(S)',
      },
      {
        id: 'massRatio',
        label: 'Observed Mass Ratio (Fe / S)',
        placeholder: 'Enter final calculated mass ratio (e.g. 1.75)',
        unit: '',
        expectedValue: 1.75,
        tolerance: 0.01,
        toleranceType: 'absolute',
        helperText: 'Calculated value of 7.0 / 4.0 (accepts 1.75, 1.750, 1.7500)',
      },

      // ── SECTION 3: OBSERVATION-BASED MCQS ──
      {
        id: 'mcq1',
        section: 'Section 3 — Observation-Based MCQs',
        label: 'MCQ 1 — What did you observe for the original iron + sulfur mixture?',
        unit: '',
        expectedValue: 2,
        tolerance: 0,
        options: [
          'A. A completely uniform black solid',
          'B. A heterogeneous mixture in which iron and sulfur could be distinguished',
          'C. A clear colorless liquid',
          'D. A uniform yellow solution',
        ],
      },
      {
        id: 'mcq2',
        label: 'MCQ 2 — What happened when the bar magnet was moved over the original Fe + S mixture?',
        unit: '',
        expectedValue: 2,
        tolerance: 0,
        options: [
          'A. The sulfur was attracted to the magnet',
          'B. Iron filings were attracted/separated by the magnet',
          'C. Both substances dissolved',
          'D. Nothing happened to the mixture',
        ],
      },
      {
        id: 'mcq3',
        label: 'MCQ 3 — After adding CS₂ to the Fe + S mixture and allowing it to separate, what was observed?',
        unit: '',
        expectedValue: 1,
        tolerance: 0,
        options: [
          'A. Sulfur dissolved while iron remained as solid material',
          'B. Iron dissolved while sulfur remained',
          'C. Both substances dissolved completely',
          'D. Neither substance remained visible',
        ],
      },
      {
        id: 'mcq4',
        label: 'MCQ 4 — What was observed after strongly heating the Fe + S mixture?',
        unit: '',
        expectedValue: 2,
        tolerance: 0,
        options: [
          'A. The mixture remained unchanged',
          'B. A reaction occurred and a dark/black FeS solid formed',
          'C. The sulfur became a clear liquid',
          'D. The iron disappeared without forming a product',
        ],
      },
      {
        id: 'mcq5',
        label: 'MCQ 5 — What did you observe when the bar magnet was applied to the FeS product?',
        unit: '',
        expectedValue: 3,
        tolerance: 0,
        options: [
          'A. Iron filings separated from sulfur again',
          'B. The FeS behaved like the original iron-containing mixture and separated',
          'C. The black FeS remained as the compound rather than separating into iron and sulfur',
          'D. The FeS dissolved immediately',
        ],
      },
    ],
  },

  // ── Viva ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'What is the black solid formed upon strongly heating iron filings with sulphur?',
        options: ['Iron oxide (Fe₂O₃)', 'Iron(II) sulphide (FeS)', 'Sulphur dioxide (SO₂)', 'Iron chloride (FeCl₂)'],
        correctIndex: 1,
        explanation: 'Iron and sulphur combine chemically upon strong heating in a 7:4 mass ratio to give iron(II) sulphide (FeS).',
      },
      {
        id: 'q2',
        question: 'Which sample is attracted by a permanent magnet?',
        options: ['The chemical compound (FeS)', 'The physical mixture of Fe + S', 'Both equally', 'Neither sample'],
        correctIndex: 1,
        explanation: 'In the physical mixture, iron particles retain their elemental ferromagnetic properties. In FeS, iron is chemically bonded and non-magnetic.',
      },
      {
        id: 'q3',
        question: 'How does the chemical compound (FeS) behave in carbon disulphide (CS₂) solvent compared to elemental sulphur?',
        options: ['Both are completely soluble', 'FeS is insoluble, whereas elemental sulphur dissolves', 'FeS dissolves and elemental sulphur is insoluble', 'Neither sample is soluble in CS₂'],
        correctIndex: 1,
        explanation: 'In the physical mixture, free elemental sulphur easily dissolves in CS₂. In the compound FeS, iron and sulphur are chemically combined and insoluble in CS₂.',
      },
      {
        id: 'q4',
        question: 'Why does the Fe + S mixture exhibit properties of both constituents whereas FeS does not?',
        options: ['Mixtures retain individual constituent properties, while compounds acquire entirely new properties', 'Compounds are always gases', 'Constituents in a mixture are chemically bonded', 'Heat destroys the elemental mass in a compound'],
        correctIndex: 0,
        explanation: 'In a mixture, substances are physically mixed without chemical bonding, so they retain their original properties. In a compound, a new substance with unique chemical bonds and properties is formed.',
      },
    ],
  },

  // ── Scoring Rubrics (Authoritative 9 Marks Total) ──
  scoring: [
    {
      name: 'Section 1: Recorded Mass of Iron Filings (7.0 g)',
      maxPoints: 1,
      evaluator: { type: 'calculationCorrect', fieldId: 'massFe', correctPoints: 1, incorrectPoints: 0 },
    },
    {
      name: 'Section 1: Recorded Mass of Sulphur Powder (4.0 g)',
      maxPoints: 1,
      evaluator: { type: 'calculationCorrect', fieldId: 'massS', correctPoints: 1, incorrectPoints: 0 },
    },
    {
      name: 'Section 2: Correct Ratio Setup (Fe / S)',
      maxPoints: 1,
      evaluator: { type: 'calculationCorrect', fieldId: 'massRatioSetup', correctPoints: 1, incorrectPoints: 0 },
    },
    {
      name: 'Section 2: Final Calculated Mass Ratio (1.75)',
      maxPoints: 1,
      evaluator: { type: 'calculationCorrect', fieldId: 'massRatio', correctPoints: 1, incorrectPoints: 0 },
    },
    {
      name: 'MCQ 1: Appearance of Fe + S Mixture',
      maxPoints: 1,
      evaluator: { type: 'calculationCorrect', fieldId: 'mcq1', correctPoints: 1, incorrectPoints: 0 },
    },
    {
      name: 'MCQ 2: Magnet Test of Fe + S Mixture',
      maxPoints: 1,
      evaluator: { type: 'calculationCorrect', fieldId: 'mcq2', correctPoints: 1, incorrectPoints: 0 },
    },
    {
      name: 'MCQ 3: CS₂ Solubility Test of Mixture',
      maxPoints: 1,
      evaluator: { type: 'calculationCorrect', fieldId: 'mcq3', correctPoints: 1, incorrectPoints: 0 },
    },
    {
      name: 'MCQ 4: Effect of Heating (FeS Formation)',
      maxPoints: 1,
      evaluator: { type: 'calculationCorrect', fieldId: 'mcq4', correctPoints: 1, incorrectPoints: 0 },
    },
    {
      name: 'MCQ 5: Magnet Behavior of FeS Product',
      maxPoints: 1,
      evaluator: { type: 'calculationCorrect', fieldId: 'mcq5', correctPoints: 1, incorrectPoints: 0 },
    },
  ],

  initialFlags: {
    burnerLit: false,
    hasIron: false,
    hasSulphur: false,
    mixtureReady: false,
    magnetSeparationComplete: false,
    mixtureRestored: false,
    cs2TubePlaced: false,
    cs2TestStarted: false,
    spatulaHasSample: false,
    cs2SamplePrepared: false,
    cs2Added: false,
    cs2Corked: false,
    cs2Shaken: false,
    cs2Settled: false,
    cs2TestComplete: false,
    partBPrepared: false,
    spatulaHasPartB: false,
    heatingStarted: false,
    reactionGlowing: false,
    feSFormed: false,
    compoundSynthesized: false,
    removedFromHeat: false,
    feSCooled: false,
    mortarPlaced: false,
    feSTransferredToMortar: false,
    feSInMortar: false,
    feSPowderReady: false,
    feSObserved: false,
    feSMagnetTested: false,
    spatulaHasFeSSample: false,
    feSCS2SamplePrepared: false,
    feSCS2Added: false,
    feSCS2Corked: false,
    feSCS2Shaken: false,
    feSCS2Settled: false,
    feSCS2TestComplete: false,
  },

  validation: [
    {
      id: 'sulphur-before-iron',
      trigger: 'drop:sulphur-bottle→watch-glass-mouth',
      condition: { type: 'not', condition: { type: 'flag', key: 'hasIron', equals: true } },
      message: 'Weigh 7.00 g of Iron Filings on the watch glass first before adding Sulphur.',
      blocking: true,
    },
    {
      id: 'iron-duplicate',
      trigger: 'drop:iron-bottle→watch-glass-mouth',
      condition: { type: 'flag', key: 'hasIron', equals: true },
      message: 'Iron filings (7.00 g) have already been weighed onto the watch glass.',
      blocking: true,
    },
    {
      id: 'sulphur-duplicate',
      trigger: 'drop:sulphur-bottle→watch-glass-mouth',
      condition: { type: 'flag', key: 'hasSulphur', equals: true },
      message: 'Sulphur powder (4.00 g) has already been added to the watch glass.',
      blocking: true,
    },
    {
      id: 'cs2-on-watch-glass',
      trigger: 'drop:cs2-bottle→watch-glass-mouth',
      condition: { type: 'flag', key: 'mixtureReady', equals: true },
      message: 'Safety Rule: Carbon disulphide (CS₂) is volatile and toxic. Add it only into the designated test tube, not the open watch glass.',
      blocking: true,
    },
    {
      id: 'heat-before-part-b',
      trigger: 'click:start-heating-btn',
      condition: { type: 'not', condition: { type: 'flag', key: 'partBPrepared', equals: true } },
      message: 'Transfer Part B (Fe + S mixture) into the boiling tube before starting heating.',
      blocking: true,
    },
    {
      id: 'test-before-cooling',
      trigger: 'drop:bar-magnet→tube-mouth',
      condition: { type: 'not', condition: { type: 'flag', key: 'feSCooled', equals: true } },
      message: 'Allow the synthesized Iron(II) Sulfide (FeS) to cool completely before proceeding.',
      blocking: true,
    },
    {
      id: 'crush-before-cooling',
      trigger: 'drop:pestle→mortar-mouth',
      condition: { type: 'not', condition: { type: 'flag', key: 'feSCooled', equals: true } },
      message: 'Wait for FeS to cool completely before crushing.',
      blocking: true,
    },
  ],
};
