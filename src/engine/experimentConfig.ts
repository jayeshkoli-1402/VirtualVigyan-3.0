/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Experiment Config Schema
 * ═══════════════════════════════════════════════════════════════════
 *
 *  This file defines the type contract for data-driven experiments.
 *  Each experiment is a single ExperimentConfig object — the engine
 *  reads it and renders a fully interactive, scored chemistry lab.
 *
 *  Design principles:
 *  - Configs are DECLARATIVE — they describe WHAT, not HOW
 *  - The engine handles all DnD wiring, animation, state management
 *  - No React/DOM code in configs — pure data
 *  - Type-safe: config errors caught at compile time
 * ═══════════════════════════════════════════════════════════════════
 */

import type { VesselMixture, ChemicalAddition } from './stoichiometrySolver';

// ── Top-Level Experiment Config ──────────────────────────────────

export type ExperimentConfig = {
  /** Unique slug identifier (e.g., 'acid-base-titration') */
  id: string;

  /** Display title (e.g., 'Acid-Base Titration') */
  title: string;

  /** Short subtitle (e.g., 'HCl + NaOH Neutralization') */
  subtitle?: string;

  /** 1-2 sentence description for the experiment selector card */
  description: string;

  /** NCERT/CBSE class level or academic degree (e.g. 10, 'F.Y. B.Tech') */
  class: number | string;

  /** Subject area */
  subject: 'Chemistry' | 'Physics' | 'Biology';

  /** Chapter or topic reference */
  chapter: string;

  /** Difficulty for UI badge */
  difficulty: 'easy' | 'medium' | 'hard';

  /** Theme color (CSS value) for header and accents */
  themeColor: string;

  /** Icon emoji for experiment selector card */
  icon: string;

  /** Estimated time in minutes */
  estimatedMinutes?: number;

  // ── Lab Configuration ──

  /** Apparatus available in the toolbox */
  apparatus: ApparatusConfig[];

  /** Drop zones on the lab bench */
  dropZones: DropZoneConfig[];

  /** Bench layout configuration */
  bench: BenchConfig;

  // ── Experiment Flow ──

  /** Ordered step flow — the student progresses through these */
  steps: StepConfig[];

  /** Interaction definitions — what happens when items are dropped/clicked */
  interactions: InteractionConfig[];

  // ── Chemistry & Calculations ──

  /** Chemistry constants, reaction info, and function references */
  chemistry: ChemistryConfig;

  /** Calculation form shown after experiment actions are complete */
  calculation?: CalculationConfig;

  /** Viva questions for post-lab testing */
  viva?: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }>;
  };

  // ── Grading ──

  /** Scoring rubric */
  scoring: ScoringCategory[];

  /** Validation rules for mistake detection */
  validation: ValidationRuleConfig[];

  /** Continuous updates (e.g., timers, flow animations) applied on every TICK */
  continuousUpdates?: ContinuousUpdateConfig[];

  // ── Initial State ──

  /** Initial numeric variables (e.g., { volumeAdded: 0, temperature: 25 }) */
  initialVariables?: Record<string, number>;

  /** Initial boolean flags (e.g., { hasIndicator: false, isSealed: false }) */
  initialFlags?: Record<string, boolean>;

  /**
   * Optional factory for generating randomized initial values
   * (e.g., conservation experiment generates random M1/M2).
   * Called on START_EXPERIMENT and RESET.
   */
  generateInitialValues?: () => Record<string, number>;
};


// ── Apparatus ────────────────────────────────────────────────────

export type ApparatusConfig = {
  /** Unique ID within this experiment (e.g., 'burette', 'flask') */
  id: string;

  /**
   * Component name from the apparatus registry
   * (e.g., 'Burette', 'ConicalFlask', 'Pipette')
   */
  component: string;

  /** Display label in the toolbox (e.g., 'Burette (50 mL)') */
  label: string;

  /** Emoji icon for the toolbox card */
  icon: string;

  /** Which steps this apparatus is relevant to (dims when not relevant) */
  activeInSteps?: string[];

  /** If true, this apparatus starts already placed (not in toolbox) */
  prePlaced?: boolean;

  /** Initial props to pass to the SVG component */
  initialProps?: Record<string, unknown>;
};


// ── Drop Zones ───────────────────────────────────────────────────

export type DropZoneConfig = {
  /** Unique ID (e.g., 'clamp-zone', 'flask-zone') */
  id: string;

  /** Display label (shown on hover or when highlighted) */
  label: string;

  /** Which apparatus IDs this zone accepts */
  accepts: string[];

  /** Position on the bench as percentage (0-100) of bench dimensions */
  position: { x: number; y: number };

  /** Size as percentage of bench dimensions */
  size: { width: number; height: number };

  /** Rejection message when wrong item is dropped here */
  rejectMessage?: string;

  /**
   * Condition under which this zone is active/visible.
   * If omitted, zone is always active.
   */
  visibleWhen?: ConditionConfig;

  /** Visual shape hint */
  shape?: 'rect' | 'circle';
};


// ── Bench Layout ─────────────────────────────────────────────────

export type BenchConfig = {
  /**
   * Background elements always visible on the bench
   * (e.g., retort stand, bench surface, wire gauze)
   */
  backgroundElements?: BenchElement[];

  /** Aspect ratio of the bench area (default: 4/3) */
  aspectRatio?: number;
};

export type BenchElement = {
  /** Component name from apparatus registry (rendered as static, non-interactive) */
  component: string;
  /** Position as percentage */
  position: { x: number; y: number };
  /** Scale factor (default: 1) */
  scale?: number;
  /** Additional props */
  props?: Record<string, unknown>;
};


// ── Steps ────────────────────────────────────────────────────────

export type StepConfig = {
  /** Unique step ID (e.g., 'setup-stand', 'measure-acid') */
  id: string;

  /** Display label for the progress indicator and checklist */
  label: string;

  /** Default instruction text shown in the instructions panel */
  instruction: string;

  /**
   * Dynamic instruction overrides based on state.
   * Checked in order — first matching condition wins.
   */
  dynamicInstructions?: Array<{
    condition: ConditionConfig;
    instruction: string;
  }>;

  /**
   * Action IDs that must ALL be completed to advance to the next step.
   * These reference `InteractionConfig.completesAction` values.
   */
  requiredActions: string[];

  /**
   * If 'auto', step advances automatically when all requiredActions are done.
   * If 'button', a "Continue" button appears for the student to click.
   * Default: 'auto'
   */
  advanceMode?: 'auto' | 'button';

  /** Optional: special step type for built-in screens */
  type?: 'lab' | 'calculation' | 'results';
};


// ── Interactions ─────────────────────────────────────────────────

export type InteractionConfig = {
  /** Unique ID for this interaction */
  id: string;

  /** What triggers this interaction */
  trigger: InteractionTrigger;

  /**
   * Conditions that must be true for this interaction to be allowed.
   * If not met, the interaction is blocked with `blockMessage`.
   */
  conditions?: ConditionConfig[];

  /** Message shown when conditions aren't met */
  blockMessage?: string;

  /**
   * Guard: if this condition is TRUE, the interaction is rejected.
   * Use for "already done" checks (e.g., pipette already filled).
   */
  guard?: {
    condition: ConditionConfig;
    message: string;
  };

  /** State changes to apply when this interaction fires */
  effects: InteractionEffect[];

  /**
   * Action ID that this interaction completes.
   * Referenced by `StepConfig.requiredActions`.
   */
  completesAction?: string;

  /** Animation to play */
  animation?: AnimationConfig;
};

export type InteractionTrigger =
  | { type: 'drop'; source: string; target: string }
  | { type: 'click'; elementId: string }
  | { type: 'stopcock'; apparatusId: string }
  | { type: 'continuous'; intervalMs: number };

export type InteractionEffect =
  | { type: 'setFlag'; key: string; value: boolean }
  | { type: 'setVariable'; key: string; value: number }
  | { type: 'incrementVariable'; key: string; amount: number }
  | { type: 'placeApparatus'; apparatusId: string; zoneId: string }
  | { type: 'setApparatusProp'; apparatusId: string; prop: string; value: unknown }
  | { type: 'addMistake'; message: string }
  | { type: 'advanceStep' }
  | { type: 'custom'; fn: string; args?: Record<string, unknown> };

export type AnimationConfig = {
  /** Animation type from the built-in library */
  type: 'pour' | 'fill' | 'dispense' | 'drip' | 'titrate' | 'suction' | 'mix' | 'heat' | 'bubble' | 'precipitate' | 'color-change' | 'settle';

  /** Duration in milliseconds */
  durationMs: number;

  /**
   * Flag key set to true during animation, false after.
   * Used to show/disable UI elements during animations.
   */
  animatingFlag?: string;

  /** If true, effects are applied AFTER animation completes (not immediately) */
  effectsAfterAnimation?: boolean;
};


// ── Conditions ───────────────────────────────────────────────────

/**
 * Conditions are used for step gating, interaction guards, and dynamic UI.
 * They evaluate against the current ExperimentState.
 */
export type ConditionConfig =
  | { type: 'flag'; key: string; equals: boolean }
  | { type: 'variable'; key: string; op: '==' | '!=' | '<' | '>' | '<=' | '>='; value: number }
  | { type: 'apparatusPlaced'; apparatusId: string }
  | { type: 'actionCompleted'; actionId: string }
  | { type: 'stepReached'; stepId: string }
  | { type: 'and'; conditions: ConditionConfig[] }
  | { type: 'or'; conditions: ConditionConfig[] }
  | { type: 'not'; condition: ConditionConfig };


// ── Chemistry ────────────────────────────────────────────────────

export type ChemistryConfig = {
  /** Balanced reaction equation (display string) */
  reaction: string;

  /** Reaction type description */
  reactionType?: string;

  /** Named constants available in formulas and scoring */
  constants: Record<string, number>;

  /**
   * Color model function name from chemistryLib.
   * The engine calls this with (state.variables, state.flags) to get
   * the current flask/solution color.
   */
  colorModel?: string;

  /** Arguments passed to the color model function alongside state */
  colorModelArgs?: Record<string, unknown>;

  /**
   * Named formulas for calculations.
   * Key = formula name, Value = a function ref in chemistryLib or inline expression.
   */
  formulas?: Record<string, FormulaConfig>;
};

export type FormulaConfig = {
  /** Display label (e.g., 'Unknown HCl concentration') */
  label: string;

  /** LaTeX or plain-text formula for display */
  displayFormula: string;

  /**
   * Function name from chemistryLib that computes the expected value.
   * Receives (variables: Record<string, number>) as argument.
   */
  computeFn: string;

  /** Variable keys that are inputs to the formula */
  inputs: string[];

  /** Unit string (e.g., 'M', 'g', 'mL') */
  unit: string;
};


// ── Calculation ──────────────────────────────────────────────────

export type CalculationFormulaItem = {
  /** Optional title or section header for this formula */
  label?: string;

  /** Result symbol, e.g. 'P' or 'M' */
  symbol: string;

  /** Numerator of the fraction expression */
  numerator: string;

  /** Denominator of the fraction expression */
  denominator: string;

  /** Unit label, e.g. 'ppm CaCO₃ eq.' */
  unit?: string;

  /** Helpful notes explaining variables in the formula */
  notes?: string;
};

export type CalculationConfig = {
  /** Title shown above the calculation form */
  title: string;

  /** Instructional text */
  instruction: string;

  /** Optional structured mathematical formulas with fraction typography */
  formulas?: CalculationFormulaItem[];

  /** Input fields for the student to fill */
  fields: CalculationField[];

  /** Optional list of variable keys to display in Recorded Values without revealing their numeric values */
  hideRecordedValueKeys?: string[];
};

export type CalculationField = {
  /** Field ID (maps to state variable for the student's answer) */
  id: string;

  /** Display label */
  label: string;

  /** Placeholder text */
  placeholder?: string;

  /** Optional short instruction or formula explaining how to find this value */
  helperText?: string;

  /** Optional example showing how to compute or determine this value */
  helperExample?: string;

  /** Unit label shown after the input */
  unit: string;

  /**
   * Formula name from chemistry.formulas that computes the expected value.
   * Used for dynamic validation.
   */
  expectedFormulaName?: string;

  /** Directly specified expected numerical value (e.g. for constants or viva questions) */
  expectedValue?: number;

  /** Tolerance for correctness check (proportion, e.g., 0.1 = ±10%) */
  tolerance: number;

  /** Type of tolerance: 'relative' (percentage of expected) or 'absolute' */
  toleranceType?: 'relative' | 'absolute';

  /** Minimum accepted value for range validation */
  minAccepted?: number;

  /** Maximum accepted value for range validation */
  maxAccepted?: number;

  /** Display label for expected range, e.g. "4.2–4.5 mL" */
  expectedRangeLabel?: string;
};


// ── Scoring ──────────────────────────────────────────────────────

export type ScoringCategory = {
  /** Display name (e.g., 'Endpoint Accuracy') */
  name: string;

  /** Maximum points for this category */
  maxPoints: number;

  /** Evaluator type and configuration */
  evaluator: ScoringEvaluator;
};

export type ScoringEvaluator =
  | {
      type: 'thresholdCheck';
      /** Variable key to check */
      variable: string;
      /** Thresholds: checked in order, first matching range gets points */
      thresholds: Array<{
        /** Condition on the variable */
        condition: 'lte' | 'gte' | 'between' | 'eq';
        value: number;
        upperValue?: number;
        /** Points awarded if this threshold matches */
        points: number;
      }>;
    }
  | {
      type: 'booleanCheck';
      /** Flag key to check */
      flag: string;
      /** Points if flag is true */
      truePoints: number;
      /** Points if flag is false (default: 0) */
      falsePoints?: number;
    }
  | {
      type: 'accuracyCheck';
      /** Variable key with the student's value */
      studentVariable: string;
      /** Variable key or constant with the expected value */
      expectedVariable: string;
      /** Tiered accuracy scoring */
      tiers: Array<{
        /** Max absolute deviation for this tier */
        maxDeviation: number;
        points: number;
      }>;
    }
  | {
      type: 'mistakeCount';
      /** Points if zero mistakes */
      zeroMistakePoints: number;
      /** Points per mistake range */
      ranges?: Array<{
        maxMistakes: number;
        points: number;
      }>;
    }
  | {
      type: 'calculationCorrect';
      /** Calculation field ID to check */
      fieldId: string;
      /** Points if correct */
      correctPoints: number;
      /** Points if incorrect (default: 0) */
      incorrectPoints?: number;
      /** Calculate marks proportionally based on proximity to actual standard answer */
      proportional?: boolean;
      /** Fixed known theoretical answer */
      actualStandard?: number;
    }
  | {
      type: 'custom';
      /** Function name from a custom evaluators registry */
      fn: string;
    };


// ── Validation / Mistake Detection ──────────────────────────────

export type ValidationRuleConfig = {
  /** Unique rule ID */
  id: string;

  /**
   * When this rule is checked:
   * - 'drop:X→Y': checked when item X is dropped on zone Y
   * - 'action:actionId': checked when an action fires
   * - 'step:stepId': checked when entering a step
   * - 'always': checked on every state change
   */
  trigger: string;

  /** Condition that must be TRUE for the rule to fire (i.e., the mistake condition) */
  condition: ConditionConfig;

  /** Message shown to the student */
  message: string;

  /**
   * If true, the triggering action is blocked.
   * If false, the action proceeds but the message is shown as a warning.
   */
  blocking: boolean;
};

// ── Continuous Updates ──────────────────────────────────────────

export type ContinuousUpdateConfig = {
  /** Condition that must be true for this update to apply */
  condition: ConditionConfig;

  /**
   * Variables to increment on each tick.
   * Value is 'amount per second'.
   */
  increments?: Record<string, number>;

  /**
   * Actions to fire when a condition is met during a tick
   */
  onConditionMet?: Array<{
    condition: ConditionConfig;
    effects: InteractionEffect[];
  }>;

  /**
   * Variables to update via custom logic on each tick.
   */
  customFn?: string;
};


// ── Experiment State (runtime) ──────────────────────────────────

/**
 * Generic experiment state produced by the engine at runtime.
 * This is what the reducer manages — NOT part of the config.
 */
export type ExperimentState = {
  /** Current step index */
  currentStepIndex: number;

  /** Current step ID (derived from config.steps[currentStepIndex].id) */
  currentStepId: string;

  /** Set of apparatus IDs that have been placed on the bench */
  placedApparatus: Record<string, string>; // apparatusId → zoneId

  /** Set of completed action IDs */
  completedActions: string[];

  /** Numeric state variables */
  variables: Record<string, number>;

  /** Boolean state flags */
  flags: Record<string, boolean>;

  /** Animation flags (true while animating) */
  animations: Record<string, boolean>;

  /** Dynamic apparatus props (component-specific state) */
  apparatusProps: Record<string, Record<string, unknown>>;

  /** Accumulated mistake messages */
  mistakes: string[];

  /** Student's calculation answers */
  studentAnswers: Record<string, number>;

  /** Final score (null until computed) */
  score: number | null;

  /** Score breakdown by category */
  scoreBreakdown: Array<{ name: string; points: number; maxPoints: number }> | null;

  /** Whether the experiment is finished */
  finished: boolean;

  /** Universal vessel mixtures keyed by apparatus ID */
  vesselMixtures?: Record<string, VesselMixture>;

  /** ID of vessel currently being inspected in the Chemical Inspector Modal */
  activeVesselInspectionId?: string | null;

  /** ID of the interaction currently playing an animation */
  activeAnimationInteractionId?: string | null;

  /** Active dynamic fluid animation metadata (direct target and source for pouring/dripping) */
  activeAnimation?: {
    type: string;
    sourceApparatusId?: string | null;
    targetZoneId?: string | null;
    color?: string | null;
  } | null;
};


// ── Engine Actions (runtime) ─────────────────────────────────────

export type ExperimentAction =
  | { type: 'START_EXPERIMENT' }
  | { type: 'DROP_ITEM'; payload: { itemId: string; zoneId: string } }
  | { type: 'CLICK_ELEMENT'; payload: { elementId: string } }
  | { type: 'SET_STOPCOCK'; payload: { apparatusId: string; openAmount: number } }
  | { type: 'ADD_SINGLE_DROP'; payload?: { apparatusId?: string; dropVolumeMl?: number } }
  | { type: 'TICK_FLOW'; payload: { deltaMs: number } }
  | { type: 'TICK'; payload: { deltaMs: number } }
  | { type: 'ADVANCE_STEP' }
  | { type: 'SUBMIT_CALCULATION'; payload: { answers: Record<string, number> } }
  | { type: 'ANIMATION_COMPLETE'; payload: { animationFlag: string; interactionId: string } }
  | { type: 'ADD_MISTAKE'; payload: { message: string } }
  | { type: 'INSPECT_VESSEL'; payload: { vesselId: string | null } }
  | { type: 'MIX_CHEMICAL'; payload: { vesselId: string; addition: ChemicalAddition } }
  | { type: 'RESET' };
