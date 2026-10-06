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
  [Step.SELECT]: 'This experiment determines the concentration of HCl by titrating it against standard NaOH solution.',
  [Step.SETUP_STAND]: 'Place the retort stand, place the conical flask, mount the 50 mL burette vertically above the flask, and place the required reagent bottles safely on the bench before using them.',
  [Step.MEASURE_ACID]: 'Use the 25 mL volumetric pipette to accurately measure 25.0 mL of HCl stock solution and transfer it into the conical flask.',
  [Step.FILL_BURETTE]: 'Fill the burette with the standard 0.100 M NaOH solution to the 0.00 mL mark. NaOH is the titrant being delivered from the burette.',
  [Step.ADD_INDICATOR]: 'Drag the phenolphthalein indicator bottle from the toolbox onto the conical flask to add 2 drops. The acidic solution remains colourless.',
  [Step.TITRATING]: 'Open the burette stopcock slowly and add NaOH to the HCl solution while swirling the flask continuously. Observe the solution carefully as you approach the endpoint.',
  [Step.ENDPOINT_MARKED]: 'Endpoint recorded! You observed the persistent pale-pink colour. Click "Proceed to Calculation" to calculate the unknown HCl concentration.',
  [Step.CALCULATION]: 'Apply the neutralization formula (M₁V₁ = M₂V₂) using your recorded NaOH volume to calculate the HCl concentration.',
  [Step.RESULTS]: 'Review your score, stoichiometry accuracy, and the complete chemistry findings summary.',
};

/**
 * Returns dynamic instruction text depending on sub-steps.
 */
export function getStepInstruction(state: TitrationState): string {
  if (state.step === Step.SETUP_STAND) {
    if (!state.standPlaced) {
      return 'Place the retort stand on the laboratory bench.';
    }
    if (!state.flaskPlaced) {
      return 'Place the conical flask on the retort stand base beneath the burette position.';
    }
    if (!state.buretteMounted) {
      return 'Mount the 50 mL burette vertically onto the retort stand clamp.';
    }
  }
  if (state.step === Step.MEASURE_ACID) {
    if (!state.hclPlaced) {
      return 'Drag the HCl Stock bottle from the toolbox onto the lab bench first.';
    }
    if (!state.pipetteFilled) {
      return 'Use the 25 mL pipette to measure 25.0 mL of HCl accurately from the stock bottle.';
    }
    if (!state.acidMeasured) {
      return 'Transfer the measured 25.0 mL HCl aliquot from the pipette into the conical flask.';
    }
  }
  if (state.step === Step.FILL_BURETTE) {
    return 'Drag the 0.100 M NaOH bottle to the top of the burette to fill it up to the 0.00 mL mark (NaOH is the titrant).';
  }
  if (state.step === Step.ADD_INDICATOR) {
    return 'Drag the phenolphthalein indicator bottle from the toolbox onto the conical flask to add 2 drops. The acidic solution remains colourless.';
  }
  if (state.step === Step.TITRATING) {
    if (state.volumeAdded < 22.0) {
      return 'Add NaOH steadily while swirling the flask continuously. The solution remains colourless while acid is in excess.';
    }
    if (state.volumeAdded < 24.8) {
      return 'Slow the addition and add NaOH dropwise as you approach the endpoint. Swirl after each drop!';
    }
    if (state.volumeAdded <= 25.4) {
      return 'Endpoint reached! Stop immediately when a persistent pale-pink colour remains after swirling. Click "Mark Endpoint".';
    }
    return 'Warning: Solution is deep pink (overshot endpoint). Close the stopcock valve and mark the endpoint to record your volume.';
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
  standPlaced: boolean;
  buretteMounted: boolean;
  flaskPlaced: boolean;
  hclPlaced: boolean;
  naohPlaced: boolean;
  indicatorPlaced: boolean;
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
  isAddingIndicator: boolean;
  // Mistakes
  mistakes: string[];
};

export const initialState: TitrationState = {
  step: Step.SELECT,
  standPlaced: false,
  buretteMounted: false,
  flaskPlaced: false,
  hclPlaced: false,
  naohPlaced: false,
  indicatorPlaced: false,
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
  isAddingIndicator: false,
  mistakes: [],
};

// ── Draggable item IDs ──
export const DRAG_ITEMS = {
  RETORT_STAND: 'retort-stand',
  BURETTE: 'burette',
  FLASK: 'flask',
  PIPETTE: 'pipette',
  INDICATOR: 'indicator',
  NAOH_BOTTLE: 'naoh-bottle',
  HCL_BOTTLE: 'hcl-bottle',
} as const;

// ── Drop zone IDs ──
export const DROP_ZONES = {
  STAND: 'stand-zone',
  CLAMP: 'stand-clamp-zone',
  BASE: 'stand-base-zone',
  HCL_BENCH_ZONE: 'hcl-bench-zone',
  FLASK_ZONE: 'flask-zone',
  BURETTE_TOP: 'burette-top-zone',
  HCL_BOTTLE_ZONE: 'hcl-bottle-zone',
} as const;

// ── Valid drop mappings ──
export const VALID_DROPS: Record<string, string[]> = {
  [DROP_ZONES.STAND]: [DRAG_ITEMS.RETORT_STAND],
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
  | { type: 'PLACE_STAND' }
  | { type: 'MOUNT_BURETTE' }
  | { type: 'PLACE_FLASK' }
  | { type: 'PLACE_HCL' }
  | { type: 'PLACE_NAOH' }
  | { type: 'PLACE_INDICATOR' }
  | { type: 'FILL_PIPETTE_START' }
  | { type: 'FILL_PIPETTE_END' }
  | { type: 'DISPENSE_PIPETTE_START' }
  | { type: 'DISPENSE_PIPETTE_END' }
  | { type: 'FILL_BURETTE_START' }
  | { type: 'FILL_BURETTE_END' }
  | { type: 'ADD_INDICATOR_START' }
  | { type: 'ADD_INDICATOR_END' }
  | { type: 'ADD_INDICATOR' }
  | { type: 'SET_STOPCOCK'; payload: { open: number } }
  | { type: 'TICK_FLOW'; payload: { deltaMs: number } }
  | { type: 'MARK_ENDPOINT' }
  | { type: 'PROCEED_TO_CALCULATION' }
  | { type: 'SUBMIT_CALCULATION'; payload: { concentration: number; correct: boolean } }
  | { type: 'COMPUTE_SCORE'; payload: { score: number } }
  | { type: 'ADD_MISTAKE'; payload: { message: string } }
  | { type: 'RESET' };

export function isTitrationAnimating(state: TitrationState): boolean {
  return (
    state.isPipetteFilling ||
    state.isPipetteDispensing ||
    state.isPouring ||
    state.isAddingIndicator
  );
}

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

    case 'PLACE_STAND': {
      const newState = { ...state, standPlaced: true };
      if (newState.standPlaced && newState.buretteMounted && newState.flaskPlaced) {
        return { ...newState, step: Step.MEASURE_ACID };
      }
      return newState;
    }

    case 'MOUNT_BURETTE': {
      const newState = { ...state, buretteMounted: true, standPlaced: true };
      if (newState.standPlaced && newState.buretteMounted && newState.flaskPlaced) {
        return { ...newState, step: Step.MEASURE_ACID };
      }
      return newState;
    }

    case 'PLACE_FLASK': {
      const newState = { ...state, flaskPlaced: true };
      if (newState.standPlaced && newState.buretteMounted && newState.flaskPlaced) {
        return { ...newState, step: Step.MEASURE_ACID };
      }
      return newState;
    }

    case 'PLACE_HCL':
      return { ...state, hclPlaced: true };

    case 'PLACE_INDICATOR':
      return { ...state, indicatorPlaced: true };

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

    case 'ADD_INDICATOR_START':
      return { ...state, isAddingIndicator: true };

    case 'ADD_INDICATOR_END':
      return {
        ...state,
        isAddingIndicator: false,
        hasIndicator: true,
        step: Step.TITRATING,
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
      const calculatedVolume = Math.round((state.volumeAdded + flowAmount) * 1000) / 1000;
      const newVolume = Math.min(50, calculatedVolume);
      const isFull = newVolume >= 50;
      return {
        ...state,
        volumeAdded: newVolume,
        stopcockOpen: isFull ? 0 : state.stopcockOpen,
        isDropAnimating: isFull ? false : state.stopcockOpen > 0,
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
