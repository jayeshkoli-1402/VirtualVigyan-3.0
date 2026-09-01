// ── Step definitions (erasableSyntaxOnly compliant) ──
export const Step = {
  SELECT: 'SELECT',
  SETUP_STAND: 'SETUP_STAND',
  MEASURE_ACID: 'MEASURE_ACID',
  FILL_BURETTE: 'FILL_BURETTE',
  ADD_INDICATOR: 'ADD_INDICATOR',
  TITRATING: 'TITRATING',
  ENDPOINT_MARKED: 'ENDPOINT_MARKED',
  CALCULATION: 'CALCULATION',
  RESULTS: 'RESULTS',
} as const;

export type Step = (typeof Step)[keyof typeof Step];

export const STEP_LABELS: Record<Step, string> = {
  [Step.SELECT]: 'Select Experiment',
  [Step.SETUP_STAND]: 'Set Up Stand',
  [Step.MEASURE_ACID]: 'Measure Acid',
  [Step.FILL_BURETTE]: 'Fill Burette',
  [Step.ADD_INDICATOR]: 'Add Indicator',
  [Step.TITRATING]: 'Titrate',
  [Step.ENDPOINT_MARKED]: 'Endpoint Marked',
  [Step.CALCULATION]: 'Calculate',
  [Step.RESULTS]: 'Results',
};

export const STEP_INSTRUCTIONS: Record<Step, string> = {
  [Step.SELECT]: 'Select the Acid-Base Titration experiment to begin.',
  [Step.SETUP_STAND]: 'Drag the burette onto the clamp and the conical flask onto the base of the retort stand.',
  [Step.MEASURE_ACID]: 'Drag the HCl Stock bottle onto the lab bench first. Then drag the pipette onto the HCl bottle to draw acid.',
  [Step.FILL_BURETTE]: 'Drag the NaOH reagent bottle onto the top of the mounted burette to fill it.',
  [Step.ADD_INDICATOR]: 'Drag the indicator dropper bottle onto the flask to add phenolphthalein.',
  [Step.TITRATING]: 'Rotate the tap valve handle (click or drag) to open the burette tap and adjust titration flow.',
  [Step.ENDPOINT_MARKED]: 'You have marked the endpoint. Click "Proceed to Calculation" to complete your calculation.',
  [Step.CALCULATION]: 'Use your recorded endpoint volume to calculate the unknown HCl concentration.',
  [Step.RESULTS]: 'Review your score and feedback.',
};

/**
 * Returns dynamic instruction text depending on sub-steps (e.g. placing HCl first).
 */
export function getStepInstruction(state: TitrationState): string {
  if (state.step === Step.MEASURE_ACID) {
    if (!state.hclPlaced) {
      return 'Drag the HCl Stock bottle from the toolbox onto the lab bench first.';
    }
    if (!state.pipetteFilled) {
      return 'Drag the Pipette onto the placed HCl Stock bottle to draw 25 mL acid.';
    }
    if (!state.acidMeasured) {
      return 'Drag the filled Pipette onto the Conical Flask to dispense 25 mL HCl.';
    }
  }
  return STEP_INSTRUCTIONS[state.step];
}

export const STEP_ORDER: Step[] = [
  Step.SELECT,
  Step.SETUP_STAND,
  Step.MEASURE_ACID,
  Step.FILL_BURETTE,
  Step.ADD_INDICATOR,
  Step.TITRATING,
  Step.ENDPOINT_MARKED,
  Step.CALCULATION,
  Step.RESULTS,
];

// ── State shape ──
export type TitrationState = {
  step: Step;
  // Apparatus placement
  buretteMounted: boolean;
  flaskPlaced: boolean;
  hclPlaced: boolean;
  // Pipette
  pipetteFilled: boolean;
  acidMeasured: boolean;
  // Burette
  buretteFilled: boolean;
  // Titration
  hasIndicator: boolean;
  volumeAdded: number;
  stopcockOpen: number; // 0–1 (closed to fully open)
  endpointMarkedAt: number | null;
  // Results
  studentConcentration: number | null;
  calculationCorrect: boolean | null;
  score: number | null;
  // Animation
  isDropAnimating: boolean;
  isPipetteFilling: boolean;
  isPipetteDispensing: boolean;
  isPouring: boolean;
  // Mistakes
  mistakes: string[];
};

export const initialState: TitrationState = {
  step: Step.SELECT,
  buretteMounted: false,
  flaskPlaced: false,
  hclPlaced: false,
  pipetteFilled: false,
  acidMeasured: false,
  buretteFilled: false,
  hasIndicator: false,
  volumeAdded: 0,
  stopcockOpen: 0,
  endpointMarkedAt: null,
  studentConcentration: null,
  calculationCorrect: null,
  score: null,
  isDropAnimating: false,
  isPipetteFilling: false,
  isPipetteDispensing: false,
  isPouring: false,
  mistakes: [],
};

// ── Draggable item IDs ──
export const DRAG_ITEMS = {
  BURETTE: 'burette',
  FLASK: 'flask',
  PIPETTE: 'pipette',
  INDICATOR: 'indicator',
  NAOH_BOTTLE: 'naoh-bottle',
  HCL_BOTTLE: 'hcl-bottle',
} as const;

// ── Drop zone IDs ──
export const DROP_ZONES = {
  CLAMP: 'stand-clamp-zone',
  BASE: 'stand-base-zone',
  HCL_BENCH_ZONE: 'hcl-bench-zone',
  FLASK_ZONE: 'flask-zone',
  BURETTE_TOP: 'burette-top-zone',
  HCL_BOTTLE_ZONE: 'hcl-bottle-zone',
} as const;

// ── Valid drop mappings ──
export const VALID_DROPS: Record<string, string[]> = {
  [DROP_ZONES.CLAMP]: [DRAG_ITEMS.BURETTE],
  [DROP_ZONES.BASE]: [DRAG_ITEMS.FLASK],
  [DROP_ZONES.HCL_BENCH_ZONE]: [DRAG_ITEMS.HCL_BOTTLE],
  [DROP_ZONES.HCL_BOTTLE_ZONE]: [DRAG_ITEMS.PIPETTE],
  [DROP_ZONES.FLASK_ZONE]: [DRAG_ITEMS.PIPETTE, DRAG_ITEMS.INDICATOR],
  [DROP_ZONES.BURETTE_TOP]: [DRAG_ITEMS.NAOH_BOTTLE],
};

// ── Actions ──
export type TitrationAction =
  | { type: 'START_EXPERIMENT' }
  | { type: 'MOUNT_BURETTE' }
  | { type: 'PLACE_FLASK' }
  | { type: 'PLACE_HCL' }
  | { type: 'FILL_PIPETTE_START' }
  | { type: 'FILL_PIPETTE_END' }
  | { type: 'DISPENSE_PIPETTE_START' }
  | { type: 'DISPENSE_PIPETTE_END' }
  | { type: 'FILL_BURETTE_START' }
  | { type: 'FILL_BURETTE_END' }
  | { type: 'ADD_INDICATOR' }
  | { type: 'SET_STOPCOCK'; payload: { open: number } }
  | { type: 'TICK_FLOW'; payload: { deltaMs: number } }
  | { type: 'MARK_ENDPOINT' }
  | { type: 'PROCEED_TO_CALCULATION' }
  | { type: 'SUBMIT_CALCULATION'; payload: { concentration: number; correct: boolean } }
  | { type: 'COMPUTE_SCORE'; payload: { score: number } }
  | { type: 'ADD_MISTAKE'; payload: { message: string } }
  | { type: 'RESET' };

// Flow rate: mL per second at 100% open
const MAX_FLOW_RATE = 0.5;

// ── Reducer ──
export function titrationReducer(
  state: TitrationState,
  action: TitrationAction
): TitrationState {
  switch (action.type) {
    case 'START_EXPERIMENT':
      return { ...state, step: Step.SETUP_STAND };

    case 'MOUNT_BURETTE': {
      const newState = { ...state, buretteMounted: true };
      if (newState.buretteMounted && newState.flaskPlaced) {
        return { ...newState, step: Step.MEASURE_ACID };
      }
      return newState;
    }

    case 'PLACE_FLASK': {
      const newState = { ...state, flaskPlaced: true };
      if (newState.buretteMounted && newState.flaskPlaced) {
        return { ...newState, step: Step.MEASURE_ACID };
      }
      return newState;
    }

    case 'PLACE_HCL':
      return { ...state, hclPlaced: true };

    case 'FILL_PIPETTE_START':
      return { ...state, isPipetteFilling: true };

    case 'FILL_PIPETTE_END':
      return { ...state, isPipetteFilling: false, pipetteFilled: true };

    case 'DISPENSE_PIPETTE_START':
      return { ...state, isPipetteDispensing: true };

    case 'DISPENSE_PIPETTE_END':
      return {
        ...state,
        isPipetteDispensing: false,
        pipetteFilled: false,
        acidMeasured: true,
        step: Step.FILL_BURETTE,
      };

    case 'FILL_BURETTE_START':
      return { ...state, isPouring: true };

    case 'FILL_BURETTE_END':
      return {
        ...state,
        isPouring: false,
        buretteFilled: true,
        step: Step.ADD_INDICATOR,
      };

    case 'ADD_INDICATOR':
      return {
        ...state,
        hasIndicator: true,
        step: Step.TITRATING,
      };

    case 'SET_STOPCOCK':
      return { ...state, stopcockOpen: Math.max(0, Math.min(1, action.payload.open)) };

    case 'TICK_FLOW': {
      if (state.stopcockOpen <= 0) return state;
      const deltaSeconds = action.payload.deltaMs / 1000;
      const flowAmount = state.stopcockOpen * MAX_FLOW_RATE * deltaSeconds;
      const newVolume = Math.round((state.volumeAdded + flowAmount) * 1000) / 1000;
      return {
        ...state,
        volumeAdded: newVolume,
        isDropAnimating: state.stopcockOpen > 0,
      };
    }

    case 'MARK_ENDPOINT':
      return {
        ...state,
        endpointMarkedAt: state.volumeAdded,
        stopcockOpen: 0,
        isDropAnimating: false,
        step: Step.ENDPOINT_MARKED,
      };

    case 'PROCEED_TO_CALCULATION':
      return { ...state, step: Step.CALCULATION };

    case 'SUBMIT_CALCULATION':
      return {
        ...state,
        studentConcentration: action.payload.concentration,
        calculationCorrect: action.payload.correct,
        step: Step.RESULTS,
      };

    case 'COMPUTE_SCORE':
      return { ...state, score: action.payload.score };

    case 'ADD_MISTAKE':
      return {
        ...state,
        mistakes: [...state.mistakes, action.payload.message],
      };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}
