/**
 * ═══════════════════════════════════════════════════════════════════
 *  Experiment Config: Conductometric Titration of Strong Acid & Strong Base
 *  F.Y. B.Tech — Engineering Chemistry Practical
 * ═══════════════════════════════════════════════════════════════════
 *
 *  H⁺ + Cl⁻ + Na⁺ + OH⁻ → H₂O + Na⁺ + Cl⁻
 *  V-shaped conductance curve: high-mobility H⁺ replaced by Na⁺,
 *  followed by post-equivalence excess OH⁻.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

export const conductometricTitration: ExperimentConfig = {
  id: 'conductometric-titration',
  title: 'Conductometric Titration (HCl vs NaOH)',
  subtitle: 'H⁺ + Cl⁻ + Na⁺ + OH⁻ → H₂O + Na⁺ + Cl⁻',
  description:
    'Monitor electrical conductance changes during neutralization of a strong acid with a strong base to construct a conductometric V-curve and determine the equivalence point.',
  class: 'F.Y. B.Tech',
  subject: 'Chemistry',
  chapter: 'Engineering Chemistry Practical',
  difficulty: 'hard',
  themeColor: '#3b82f6',
  icon: '📉',
  estimatedMinutes: 22,

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
      id: 'naoh-titrant',
      component: 'ReagentBottle',
      label: '0.1 N NaOH Titrant',
      icon: '🧴',
      initialProps: { liquidColor: 'rgba(224, 242, 254, 0.7)', label: '0.1 N NaOH' },
    },
    {
      id: 'conductivity-bridge',
      component: 'ConductivityBridge',
      label: 'Digital Conductivity Bridge',
      icon: '⚡',
      initialProps: { width: 170, height: 140 },
    },
    {
      id: 'water-bath',
      component: 'WaterBath',
      label: 'Water Bath (Equilibration)',
      icon: '♨️',
      initialProps: { width: 160, height: 120 },
    },
    {
      id: 'beaker',
      component: 'Beaker',
      label: '100 mL Conductivity Vessel',
      icon: '🥛',
      initialProps: { liquidLevel: 0, width: 110, height: 130 },
    },
    {
      id: 'hcl-sample',
      component: 'ReagentBottle',
      label: '10 mL Unknown HCl',
      icon: '🧪',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.55)', label: 'HCl' },
    },
    {
      id: 'cond-water',
      component: 'ReagentBottle',
      label: 'Conductivity Water (40 mL)',
      icon: '💧',
      initialProps: { liquidColor: 'rgba(56, 189, 248, 0.35)', label: 'Pure H₂O' },
    },
  ],

  // ── Drop Zones ──
  dropZones: [
    {
      id: 'clamp-zone',
      label: 'Clamp Burette on Retort Stand',
      accepts: ['burette'],
      position: { x: 50, y: 30 },
      size: { width: 22, height: 44 },
      rejectMessage: 'Mount the 50 mL burette onto the retort stand clamp.',
    },
    {
      id: 'burette-top-zone',
      label: 'Fill Burette with 0.1 N NaOH',
      accepts: ['naoh-titrant'],
      position: { x: 50, y: 12 },
      size: { width: 18, height: 20 },
      rejectMessage: 'Pour 0.1 N NaOH titrant into the top of the burette.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'burette' },
    },
    {
      id: 'bath-zone',
      label: 'Place Vessel in Water Bath',
      accepts: ['beaker'],
      position: { x: 50, y: 62 },
      size: { width: 24, height: 35 },
      rejectMessage: 'Immerse the conductivity beaker into the thermostatic water bath beneath the burette.',
    },
    {
      id: 'beaker-zone',
      label: 'Into Conductivity Vessel',
      accepts: ['hcl-sample', 'cond-water'],
      position: { x: 50, y: 50 },
      size: { width: 18, height: 26 },
      rejectMessage: 'Add reagent into the conductivity beaker.',
      visibleWhen: { type: 'apparatusPlaced', apparatusId: 'beaker' },
    },
  ],

  // ── Bench ──
  bench: {
    backgroundElements: [
      {
        component: 'RetortStand',
        position: { x: 50, y: 38 },
        scale: 1.0,
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
      label: '2. Fill Burette with NaOH',
      instruction: 'Drag the 0.1 N NaOH bottle to the top of the burette to fill it up to the 0.0 mL mark.',
      requiredActions: ['fill-burette'],
      type: 'lab',
    },
    {
      id: 'setup-vessel',
      label: '3. Equilibrate Vessel',
      instruction: 'Drag the conductivity beaker into the water bath to ensure temperature equilibration at 25°C.',
      requiredActions: ['place-vessel'],
      type: 'lab',
    },
    {
      id: 'add-acid-water',
      label: '4. Add Acid & Pure Water',
      instruction: 'Add 10 mL HCl sample followed by 40 mL conductivity water into the beaker.',
      requiredActions: ['add-diluted-acid'],
      type: 'lab',
    },
    {
      id: 'initial-conductance',
      label: '5. Record Initial Conductance',
      instruction: 'Conductivity cell is immersed. Observe high initial conductance (~8.40 mS/cm) due to highly mobile H⁺ ions.',
      requiredActions: [],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'titrate-naoh',
      label: '6. Add NaOH Incrementally',
      instruction: 'Click the right wing of the burette cork to add 0.1 N NaOH drop-by-drop. Conductance steadily decreases to a minimum (2.10 mS/cm) at 10.0 mL, then increases sharply.',
      requiredActions: ['titrate-alkali'],
      advanceMode: 'button',
      type: 'lab',
    },
    {
      id: 'calculation',
      label: '7. Calculations & Graph',
      instruction: 'Calculate the normality and concentration of HCl from the V-curve minimum intersection point.',
      requiredActions: ['calculation-submitted'],
      advanceMode: 'button',
      type: 'calculation',
    },
    {
      id: 'results',
      label: '8. Final Score & Viva',
      instruction: 'Review your laboratory performance and scoring evaluation.',
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
      trigger: { type: 'drop', source: 'naoh-titrant', target: 'burette-top-zone' },
      conditions: [{ type: 'flag', key: 'burettePlaced', equals: true }],
      blockMessage: 'Clamp the burette on the retort stand before filling it.',
      effects: [
        { type: 'setFlag', key: 'buretteFilled', value: true },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidLevel', value: 1.0 },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'liquidColor', value: 'rgba(224, 242, 254, 0.7)' },
        { type: 'setApparatusProp', apparatusId: 'burette', prop: 'label', value: '0.1 N NaOH Burette' },
      ],
      completesAction: 'fill-burette',
      animation: { type: 'pour', durationMs: 2000, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-place-vessel',
      trigger: { type: 'drop', source: 'beaker', target: 'bath-zone' },
      effects: [
        { type: 'placeApparatus', apparatusId: 'beaker', zoneId: 'bath-zone' },
        { type: 'setFlag', key: 'vesselPlaced', value: true },
      ],
      completesAction: 'place-vessel',
    },
    {
      id: 'inter-add-hcl',
      trigger: { type: 'drop', source: 'hcl-sample', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'vesselPlaced', equals: true }],
      blockMessage: 'Place the vessel in the water bath first.',
      effects: [
        { type: 'setFlag', key: 'acidAdded', value: true },
        { type: 'setVariable', key: 'conductance', value: 8.4 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.25 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.55)' },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'label', value: '10 mL HCl Sample' },
      ],
      completesAction: 'add-diluted-acid',
      animation: { type: 'pour', durationMs: 1800, animatingFlag: 'isPouring' },
    },
    {
      id: 'inter-titrate-cond',
      trigger: { type: 'drop', source: 'burette', target: 'beaker-zone' },
      conditions: [{ type: 'flag', key: 'acidAdded', equals: true }],
      blockMessage: 'Add HCl sample before titrating with NaOH.',
      effects: [
        { type: 'setFlag', key: 'vCurveDone', value: true },
        { type: 'setVariable', key: 'naohVolume', value: 10.0 },
        { type: 'setVariable', key: 'conductance', value: 2.1 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidLevel', value: 0.65 },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'liquidColor', value: 'rgba(56, 189, 248, 0.35)' },
        { type: 'setApparatusProp', apparatusId: 'beaker', prop: 'label', value: 'Neutralized (V_min = 10.0 mL NaOH)' },
      ],
      completesAction: 'titrate-alkali',
      animation: { type: 'titrate', durationMs: 2400, animatingFlag: 'isTitrating' },
    },
  ],

  // ── Continuous Dynamics Updates ──
  continuousUpdates: [
    {
      condition: { type: 'flag', key: 'isTitrating', equals: true },
      increments: {
        naohVolume: 1.5,
      },
      onConditionMet: [
        {
          condition: { type: 'variable', key: 'naohVolume', op: '>=', value: 10.0 },
          effects: [
            { type: 'setVariable', key: 'naohVolume', value: 10.0 },
            { type: 'setVariable', key: 'conductance', value: 2.1 },
          ],
        },
      ],
    },
  ],

  // ── Chemistry Model ──
  chemistry: {
    reaction: 'H⁺ + Cl⁻ + Na⁺ + OH⁻ → H₂O + Na⁺ + Cl⁻',
    constants: {
      naohNormality: 0.1,
      hclVolume: 10.0,
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
      name: 'Vessel Equilibration & Prep',
      maxPoints: 20,
      evaluator: { type: 'booleanCheck', flag: 'acidAdded', truePoints: 20 },
    },
    {
      name: 'Conductometric V-Curve Detection',
      maxPoints: 30,
      evaluator: { type: 'booleanCheck', flag: 'vCurveDone', truePoints: 30 },
    },
    {
      name: 'Normality & Strength Calculation',
      maxPoints: 30,
      evaluator: {
        type: 'calculationCorrect',
        fieldId: 'hclNormality',
        correctPoints: 30,
        incorrectPoints: 0,
      },
    },
  ],

  // ── Validation ──
  validation: [
    {
      id: 'fill-before-clamp',
      trigger: 'drop:naoh-titrant→burette-top-zone',
      condition: { type: 'flag', key: 'burettePlaced', equals: false },
      message: 'Clamp the burette on the retort stand before filling it with NaOH.',
      blocking: true,
    },
  ],

  // ── Initial State ──
  initialVariables: {
    conductance: 8.4,
    naohVolume: 0,
    hclVolume: 10,
    naohNormality: 0.1,
    hclNormality: 0,
    hclStrength: 0,
    stopcockOpen: 0,
  },
  initialFlags: {
    burettePlaced: false,
    buretteFilled: false,
    vesselPlaced: false,
    acidAdded: false,
    vCurveDone: false,
  },

  // ── Calculation ──
  calculation: {
    title: 'Conductometric Titration Calculation',
    instruction: 'N₁V₁ = N₂V₂ → N_HCl = (V_NaOH × N_NaOH) / V_HCl | Strength = N × 36.46 g/L',
    fields: [
      {
        id: 'hclVolume',
        label: 'Volume of HCl Pipetted (V₁ in mL)',
        unit: 'mL',
        expectedValue: 10.0,
        tolerance: 0.1,
      },
      {
        id: 'naohNormality',
        label: 'Normality of NaOH Titrant (N₂)',
        unit: 'N',
        expectedValue: 0.1,
        tolerance: 0.01,
      },
      {
        id: 'naohVolume',
        label: 'Equivalence Volume from V-Curve (V₂ in mL)',
        unit: 'mL',
        expectedValue: 10.0,
        tolerance: 0.2,
      },
      {
        id: 'hclNormality',
        label: 'Calculated Normality of Unknown HCl (N)',
        unit: 'N',
        expectedValue: 0.1,
        tolerance: 0.01,
      },
      {
        id: 'hclStrength',
        label: 'Strength of HCl (g/L)',
        unit: 'g/L',
        expectedValue: 3.646,
        tolerance: 0.1,
      },
    ],
  },

  // ── Viva Questions ──
  viva: {
    questions: [
      {
        id: 'q1',
        question: 'Why does electrical conductance initially decrease during titration of strong HCl with strong NaOH?',
        options: [
          'Highly mobile fast H⁺ ions (ionic mobility = 350 S·cm²/mol) are progressively replaced by slower Na⁺ ions (50 S·cm²/mol).',
          'Water becomes non-conductive when salt forms.',
          'The solution becomes colder due to an endothermic reaction.',
          'Hydroxide ions destroy conductivity electrodes.',
        ],
        correctIndex: 0,
        explanation:
          'Protons (H⁺) have exceptionally high Grotthuss mobility. As NaOH is added, H⁺ reacts to form unionized water, and is replaced by slower Na⁺ ions, reducing conductance to a minimum.',
      },
      {
        id: 'q2',
        question: 'Why does conductance increase steeply after the equivalence point is reached?',
        options: [
          'Excess added OH⁻ ions (ionic mobility = 198 S·cm²/mol) accumulate unneutralized in the solution.',
          'The NaCl salt crystallizes out.',
          'The temperature rises above 100°C.',
          'Conductivity cells generate voltage.',
        ],
        correctIndex: 0,
        explanation:
          'Post-equivalence, every drop of NaOH introduces free Na⁺ and highly mobile OH⁻ ions with no acid left to neutralize them, driving a sharp upward conductance slope.',
      },
    ],
  },
};
