// ── Step definitions for Conservation of Mass experiment ──
export const ConservationStep = {
  SELECT: 'SELECT',
  SETUP_FLASK: 'SETUP_FLASK',
  PLACE_TUBE_ON_STAND: 'PLACE_TUBE_ON_STAND',
  FILL_TUBE: 'FILL_TUBE',
  SUSPEND_TUBE: 'SUSPEND_TUBE',
  SEAL_FLASK: 'SEAL_FLASK',
  WEIGH_INITIAL: 'WEIGH_INITIAL',
  MIX_REACTANTS: 'MIX_REACTANTS',
  OBSERVE: 'OBSERVE',
  WEIGH_FINAL: 'WEIGH_FINAL',
  CALCULATION: 'CALCULATION',
  RESULTS: 'RESULTS',
} as const;

export type ConservationStep = (typeof ConservationStep)[keyof typeof ConservationStep];

export const CONSERVATION_STEP_LABELS: Record<ConservationStep, string> = {
  [ConservationStep.SELECT]: 'Select Experiment',
  [ConservationStep.SETUP_FLASK]: 'Set Up Flask',
  [ConservationStep.PLACE_TUBE_ON_STAND]: 'Place Tube on Stand',
  [ConservationStep.FILL_TUBE]: 'Fill Ignition Tube',
  [ConservationStep.SUSPEND_TUBE]: 'Suspend Tube in Flask',
  [ConservationStep.SEAL_FLASK]: 'Seal Flask',
  [ConservationStep.WEIGH_INITIAL]: 'Weigh (M₁)',
  [ConservationStep.MIX_REACTANTS]: 'Mix Reactants',
  [ConservationStep.OBSERVE]: 'Observe Precipitate',
  [ConservationStep.WEIGH_FINAL]: 'Weigh (M₂)',
  [ConservationStep.CALCULATION]: 'Calculate',
  [ConservationStep.RESULTS]: 'Results',
};

export const CONSERVATION_STEP_INSTRUCTIONS: Record<ConservationStep, string> = {
  [ConservationStep.SELECT]: 'Select the Conservation of Mass experiment to begin.',
  [ConservationStep.SETUP_FLASK]: 'Place the Conical Flask on the bench, then pour Na₂SO₄ solution into it.',
  [ConservationStep.PLACE_TUBE_ON_STAND]: 'Drag the Ignition Tube from the toolbox onto the Test Tube Stand.',
  [ConservationStep.FILL_TUBE]: 'Drag the BaCl₂ bottle onto the Ignition Tube to fill it with BaCl₂ solution.',
  [ConservationStep.SUSPEND_TUBE]: 'Drag the filled Ignition Tube into the Conical Flask to suspend it inside.',
  [ConservationStep.SEAL_FLASK]: 'Drag the Rubber Cork onto the Conical Flask to seal it airtight.',
  [ConservationStep.WEIGH_INITIAL]: 'Click or drag the sealed flask onto the Digital Balance to record the initial mass M₁.',
  [ConservationStep.MIX_REACTANTS]: 'Click "Invert Flask to Mix" to tilt the flask and mix BaCl₂ with Na₂SO₄.',
  [ConservationStep.OBSERVE]: 'Observe the white precipitate of BaSO₄ forming. Click "Continue" when done.',
  [ConservationStep.WEIGH_FINAL]: 'Click or drag the flask onto the Digital Balance to record the final mass M₂.',
  [ConservationStep.CALCULATION]: 'Use your recorded M₁ and M₂ values to calculate ΔM and Deviation %.',
  [ConservationStep.RESULTS]: 'Review your score and feedback.',
};

/**
 * Returns dynamic instruction text depending on sub-steps.
 */
export function getConservationStepInstruction(state: ConservationState): string {
  if (state.step === ConservationStep.SETUP_FLASK) {
    if (!state.flaskPlaced) {
      return 'Drag the Conical Flask from the toolbox onto the lab bench.';
    }
    if (!state.na2so4Poured) {
      return 'Drag the Na₂SO₄ bottle onto the flask to pour 10 mL of sodium sulfate solution.';
    }
  }
  return CONSERVATION_STEP_INSTRUCTIONS[state.step];
}

export const CONSERVATION_STEP_ORDER: ConservationStep[] = [
  ConservationStep.SELECT,
  ConservationStep.SETUP_FLASK,
  ConservationStep.PLACE_TUBE_ON_STAND,
  ConservationStep.FILL_TUBE,
  ConservationStep.SUSPEND_TUBE,
  ConservationStep.SEAL_FLASK,
  ConservationStep.WEIGH_INITIAL,
  ConservationStep.MIX_REACTANTS,
  ConservationStep.OBSERVE,
  ConservationStep.WEIGH_FINAL,
  ConservationStep.CALCULATION,
  ConservationStep.RESULTS,
];

// ── State shape ──
export type ConservationState = {
  step: ConservationStep;
  // Apparatus placement
  flaskPlaced: boolean;
  na2so4Poured: boolean;
  tubePlacedOnStand: boolean;
  tubeFilled: boolean;
  tubeSuspended: boolean;
  flaskSealed: boolean;
  // Weighing
  initialMass: number | null;  // M1
  finalMass: number | null;    // M2
  flaskOnBalance: boolean;
  // Reaction
  reactantsMixed: boolean;
  precipitateFormed: boolean;
  hasObserved: boolean;
  // Results
  studentDeltaM: number | null;
  studentDeviationPercent: number | null;
  calculationCorrect: boolean | null;
  score: number | null;
  // Animation
  isPouringNa2SO4: boolean;
  isFillingTube: boolean;
  isMixing: boolean;
  // Mistakes
  mistakes: string[];
  // Simulated values
  simulatedM1: number;
  simulatedM2: number;
};

// Generate realistic masses
function generateSimulatedMasses(): { m1: number; m2: number } {
  const m1 = 125.40 + (Math.random() - 0.5) * 1.0; // 124.90 – 125.90 g
  const m2 = m1 + (Math.random() - 0.5) * 0.02;     // within ±0.01 g (balance precision)
  return {
    m1: Math.round(m1 * 100) / 100,
    m2: Math.round(m2 * 100) / 100,
  };
}

const defaultMasses = generateSimulatedMasses();

export const conservationInitialState: ConservationState = {
  step: ConservationStep.SELECT,
  flaskPlaced: false,
  na2so4Poured: false,
  tubePlacedOnStand: false,
  tubeFilled: false,
  tubeSuspended: false,
  flaskSealed: false,
  initialMass: null,
  finalMass: null,
  flaskOnBalance: false,
  reactantsMixed: false,
  precipitateFormed: false,
  hasObserved: false,
  studentDeltaM: null,
  studentDeviationPercent: null,
  calculationCorrect: null,
  score: null,
  isPouringNa2SO4: false,
  isFillingTube: false,
  isMixing: false,
  mistakes: [],
  simulatedM1: defaultMasses.m1,
  simulatedM2: defaultMasses.m2,
};

// ── Draggable item IDs ──
export const CONSERVATION_DRAG_ITEMS = {
  FLASK: 'cons-flask',
  IGNITION_TUBE: 'cons-ignition-tube',
  NA2SO4_BOTTLE: 'cons-na2so4-bottle',
  BACL2_BOTTLE: 'cons-bacl2-bottle',
  RUBBER_CORK: 'cons-rubber-cork',
  MEASURING_CYLINDER: 'cons-measuring-cylinder',
} as const;

// ── Drop zone IDs ──
export const CONSERVATION_DROP_ZONES = {
  BENCH_ZONE: 'cons-bench-zone',
  TUBE_STAND_ZONE: 'cons-tube-stand-zone',
  FLASK_ZONE: 'cons-flask-zone',
  TUBE_FILL_ZONE: 'cons-tube-fill-zone',
  BALANCE_ZONE: 'cons-balance-zone',
} as const;

// ── Valid drop mappings ──
export const CONSERVATION_VALID_DROPS: Record<string, string[]> = {
  [CONSERVATION_DROP_ZONES.BENCH_ZONE]: [CONSERVATION_DRAG_ITEMS.FLASK],
  [CONSERVATION_DROP_ZONES.TUBE_STAND_ZONE]: [CONSERVATION_DRAG_ITEMS.IGNITION_TUBE],
  [CONSERVATION_DROP_ZONES.FLASK_ZONE]: [
    CONSERVATION_DRAG_ITEMS.NA2SO4_BOTTLE,
    CONSERVATION_DRAG_ITEMS.IGNITION_TUBE,
    CONSERVATION_DRAG_ITEMS.RUBBER_CORK,
  ],
  [CONSERVATION_DROP_ZONES.TUBE_FILL_ZONE]: [CONSERVATION_DRAG_ITEMS.BACL2_BOTTLE],
  [CONSERVATION_DROP_ZONES.BALANCE_ZONE]: [CONSERVATION_DRAG_ITEMS.FLASK],
};

// ── Actions ──
export type ConservationAction =
  | { type: 'START_EXPERIMENT' }
  | { type: 'PLACE_FLASK' }
  | { type: 'POUR_NA2SO4_START' }
  | { type: 'POUR_NA2SO4_END' }
  | { type: 'PLACE_TUBE_ON_STAND' }
  | { type: 'FILL_TUBE_START' }
  | { type: 'FILL_TUBE_END' }
  | { type: 'SUSPEND_TUBE' }
  | { type: 'SEAL_FLASK' }
  | { type: 'PLACE_ON_BALANCE' }
  | { type: 'WEIGH_INITIAL' }
  | { type: 'REMOVE_FROM_BALANCE' }
  | { type: 'MIX_REACTANTS_START' }
  | { type: 'MIX_REACTANTS_END' }
  | { type: 'FINISH_OBSERVE' }
  | { type: 'WEIGH_FINAL' }
  | { type: 'PROCEED_TO_CALCULATION' }
  | { type: 'SUBMIT_CALCULATION'; payload: { deltaM: number; deviationPercent: number; correct: boolean } }
  | { type: 'COMPUTE_SCORE'; payload: { score: number } }
  | { type: 'ADD_MISTAKE'; payload: { message: string } }
  | { type: 'RESET' };

// ── Reducer ──
export function conservationReducer(
  state: ConservationState,
  action: ConservationAction
): ConservationState {
  switch (action.type) {
    case 'START_EXPERIMENT': {
      const masses = generateSimulatedMasses();
      return {
        ...conservationInitialState,
        step: ConservationStep.SETUP_FLASK,
        simulatedM1: masses.m1,
        simulatedM2: masses.m2,
      };
    }

    case 'PLACE_FLASK':
      return { ...state, flaskPlaced: true };

    case 'POUR_NA2SO4_START':
      return { ...state, isPouringNa2SO4: true };

    case 'POUR_NA2SO4_END':
      return {
        ...state,
        isPouringNa2SO4: false,
        na2so4Poured: true,
        step: ConservationStep.PLACE_TUBE_ON_STAND,
      };

    case 'PLACE_TUBE_ON_STAND':
      return {
        ...state,
        tubePlacedOnStand: true,
        step: ConservationStep.FILL_TUBE,
      };

    case 'FILL_TUBE_START':
      return { ...state, isFillingTube: true };

    case 'FILL_TUBE_END':
      return {
        ...state,
        isFillingTube: false,
        tubeFilled: true,
        step: ConservationStep.SUSPEND_TUBE,
      };

    case 'SUSPEND_TUBE':
      return {
        ...state,
        tubeSuspended: true,
        step: ConservationStep.SEAL_FLASK,
      };

    case 'SEAL_FLASK':
      return {
        ...state,
        flaskSealed: true,
        step: ConservationStep.WEIGH_INITIAL,
      };

    case 'PLACE_ON_BALANCE': {
      let nextState = { ...state, flaskOnBalance: true };
      if (state.step === ConservationStep.WEIGH_INITIAL && state.flaskSealed) {
        nextState.initialMass = state.simulatedM1;
        nextState.step = ConservationStep.MIX_REACTANTS;
      } else if (state.step === ConservationStep.WEIGH_FINAL && state.hasObserved) {
        nextState.finalMass = state.simulatedM2;
      }
      return nextState;
    }

    case 'WEIGH_INITIAL':
      return {
        ...state,
        initialMass: state.simulatedM1,
        flaskOnBalance: true,
        step: ConservationStep.MIX_REACTANTS,
      };

    case 'REMOVE_FROM_BALANCE':
      return { ...state, flaskOnBalance: false };

    case 'MIX_REACTANTS_START':
      return { ...state, isMixing: true };

    case 'MIX_REACTANTS_END':
      return {
        ...state,
        isMixing: false,
        reactantsMixed: true,
        precipitateFormed: true,
        step: ConservationStep.OBSERVE,
      };

    case 'FINISH_OBSERVE':
      return {
        ...state,
        hasObserved: true,
        step: ConservationStep.WEIGH_FINAL,
      };

    case 'WEIGH_FINAL':
      return {
        ...state,
        finalMass: state.simulatedM2,
        flaskOnBalance: true,
      };

    case 'PROCEED_TO_CALCULATION':
      return { ...state, step: ConservationStep.CALCULATION };

    case 'SUBMIT_CALCULATION':
      return {
        ...state,
        studentDeltaM: action.payload.deltaM,
        studentDeviationPercent: action.payload.deviationPercent,
        calculationCorrect: action.payload.correct,
        step: ConservationStep.RESULTS,
      };

    case 'COMPUTE_SCORE':
      return { ...state, score: action.payload.score };

    case 'ADD_MISTAKE':
      return {
        ...state,
        mistakes: [...state.mistakes, action.payload.message],
      };

    case 'RESET': {
      const masses = generateSimulatedMasses();
      return {
        ...conservationInitialState,
        simulatedM1: masses.m1,
        simulatedM2: masses.m2,
      };
    }

    default:
      return state;
  }
}
