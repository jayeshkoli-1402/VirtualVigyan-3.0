/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Generic Experiment State Machine
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Factory function that takes an ExperimentConfig and produces a
 *  React-compatible reducer + initial state. The engine interprets
 *  the config at runtime — no per-experiment code generation needed.
 * ═══════════════════════════════════════════════════════════════════
 */

import type {
  ExperimentConfig,
  ExperimentState,
  ExperimentAction,
  InteractionConfig,
  InteractionEffect,
  ConditionConfig,
} from './experimentConfig';
import { computeFormula } from './chemistryLib';
import {
  mixChemicals,
  createEmptyMixture,
  type VesselMixture,
  type ChemicalAddition,
} from './stoichiometrySolver';

// ── Chemical Reagent Detection Helpers ───────────────────────────

/** Helper to detect if a dropped item or ID represents a chemical reagent addition */
export function detectChemicalAddition(
  itemId: string,
  _config?: ExperimentConfig,
  state?: ExperimentState,
): ChemicalAddition | null {
  const norm = itemId.toLowerCase();

  // Mineral & Organic Acids
  if (norm.includes('hcl')) {
    return { substanceId: 'hcl', volumeMl: 10, molarity: state?.variables['molarityHCl'] ?? 0.1 };
  }
  if (norm.includes('h2so4') || norm.includes('sulfuric')) {
    return { substanceId: 'h2so4', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('hno3') || norm.includes('nitric')) {
    return { substanceId: 'hno3', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('acetic') || norm.includes('ch3cooh')) {
    return { substanceId: 'ch3cooh', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('oxalic')) {
    return { substanceId: 'oxalic_acid', volumeMl: 10, molarity: 0.05 };
  }

  // Bases & Alkalis
  if (norm.includes('naoh') || norm.includes('caustic')) {
    return { substanceId: 'naoh', volumeMl: 10, molarity: state?.variables['molarityNaOH'] ?? 0.1 };
  }
  if (norm.includes('koh')) {
    return { substanceId: 'koh', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('limewater') || norm.includes('ca(oh)2') || norm.includes('ca_oh2')) {
    return { substanceId: 'ca_oh2', volumeMl: 20, molarity: 0.02 };
  }

  // Carbonates & Bicarbonates
  if (norm.includes('na2co3') || (norm.includes('sodium') && norm.includes('carbonate'))) {
    return { substanceId: 'na2co3', volumeMl: 10, molarity: 0.05 };
  }
  if (norm.includes('nahco3') || norm.includes('bicarbonate')) {
    return { substanceId: 'nahco3', volumeMl: 10, molarity: 0.1 };
  }

  // Salts & Analytical Reagents
  if (norm.includes('bacl2') || norm.includes('barium')) {
    return { substanceId: 'bacl2', volumeMl: 10, molarity: state?.variables['m1'] ?? 0.1 };
  }
  if (norm.includes('na2so4') || (norm.includes('sodium') && norm.includes('sulfate'))) {
    return { substanceId: 'na2so4', volumeMl: 10, molarity: state?.variables['m2'] ?? 0.1 };
  }
  if (norm.includes('cuso4') || norm.includes('copper-sulfate') || norm.includes('blue-vitriol')) {
    return { substanceId: 'cuso4', volumeMl: 25, molarity: 0.1 };
  }
  if (norm.includes('feso4') || norm.includes('iron-sulfate')) {
    return { substanceId: 'feso4', volumeMl: 25, molarity: 0.1 };
  }
  if (norm.includes('fecl3') || norm.includes('ferric')) {
    return { substanceId: 'fecl3', volumeMl: 15, molarity: 0.1 };
  }
  if (norm.includes('kmno4') || norm.includes('permanganate')) {
    return { substanceId: 'kmno4', volumeMl: 10, molarity: 0.02 };
  }
  if (norm.includes('agno3') || norm.includes('silver-nitrate')) {
    return { substanceId: 'agno3', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('nacl') || (norm.includes('salt') && !norm.includes('stand'))) {
    return { substanceId: 'nacl', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('ki') || norm.includes('iodide')) {
    return { substanceId: 'ki', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('lead') || norm.includes('pb_no3_2')) {
    return { substanceId: 'pb_no3_2', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('thiosulfate') || norm.includes('na2s2o3')) {
    return { substanceId: 'na2s2o3', volumeMl: 15, molarity: 0.1 };
  }

  // Metals
  if (norm.includes('zinc') || norm === 'zn') {
    return { substanceId: 'zn', massGrams: 2.0 };
  }
  if (norm.includes('copper-turnings') || norm === 'cu' || norm.includes('copper-metal')) {
    return { substanceId: 'cu', massGrams: 2.0 };
  }
  if (norm.includes('iron-nail') || norm.includes('iron-filings') || norm === 'fe') {
    return { substanceId: 'fe', massGrams: 2.5 };
  }
  if (norm.includes('magnesium') || norm === 'mg') {
    return { substanceId: 'mg', massGrams: 0.5 };
  }

  // Indicators & Complexation
  if (norm.includes('phenolphthalein') || (norm.includes('indicator') && !norm.includes('methyl') && !norm.includes('ebt'))) {
    return { substanceId: 'phenolphthalein', volumeMl: 0.1, molarity: 0.005 };
  }
  if (norm.includes('methyl') || norm.includes('methyl-orange')) {
    return { substanceId: 'methyl_orange', volumeMl: 0.1, molarity: 0.005 };
  }
  if (norm.includes('ebt') || norm.includes('eriochrome')) {
    return { substanceId: 'eriochrome_black_t', volumeMl: 0.1, molarity: 0.002 };
  }
  if (norm.includes('buffer') || norm.includes('nh4cl')) {
    return { substanceId: 'buffer_ph10', volumeMl: 2.0, molarity: 1.0 };
  }
  if (norm.includes('edta')) {
    return { substanceId: 'edta', volumeMl: 5.0, molarity: 0.01 };
  }

  // Solvents
  if (norm.includes('water') || norm.includes('distilled') || norm === 'h2o') {
    return { substanceId: 'h2o', volumeMl: 20 };
  }

  return null;
}

/** Helper to locate which vessel an item is dropped into */
export function findTargetVesselId(
  zoneId: string,
  config: ExperimentConfig,
  state: ExperimentState,
): string | null {
  const vesselTypes = ['ConicalFlask', 'Beaker', 'BODBottle', 'TestTube', 'VolumetricFlask', 'MeasuringCylinder'];

  // 1. Check if zoneId directly matches a placed vessel
  for (const [appId, placedZone] of Object.entries(state.placedApparatus)) {
    if (placedZone === zoneId) {
      const app = config.apparatus.find(a => a.id === appId);
      if (app && vesselTypes.includes(app.component)) {
        return appId;
      }
    }
  }

  // 2. Check if any vessel matches the zone name (e.g. 'flask-zone' -> 'flask')
  const cleanZone = zoneId.replace('-zone', '');
  const directMatch = config.apparatus.find(a => a.id === cleanZone || a.id.includes(cleanZone));
  if (directMatch && vesselTypes.includes(directMatch.component)) {
    return directMatch.id;
  }

  // 3. Fallback to first placed vessel on the bench
  for (const appId of Object.keys(state.placedApparatus)) {
    const app = config.apparatus.find(a => a.id === appId);
    if (app && vesselTypes.includes(app.component)) {
      return appId;
    }
  }

  // 4. Default to first vessel defined in config
  const anyVessel = config.apparatus.find(a => vesselTypes.includes(a.component));
  return anyVessel ? anyVessel.id : null;
}


// ── Condition Evaluation ─────────────────────────────────────────

/**
 * Evaluate a condition against the current experiment state.
 * Conditions are declarative (from config) — this function interprets them.
 */
export function evaluateCondition(
  condition: ConditionConfig,
  state: ExperimentState,
): boolean {
  switch (condition.type) {
    case 'flag':
      return (state.flags[condition.key] ?? false) === condition.equals;

    case 'variable': {
      const val = state.variables[condition.key] ?? 0;
      switch (condition.op) {
        case '==': return val === condition.value;
        case '!=': return val !== condition.value;
        case '<':  return val < condition.value;
        case '>':  return val > condition.value;
        case '<=': return val <= condition.value;
        case '>=': return val >= condition.value;
        default:   return false;
      }
    }

    case 'apparatusPlaced':
      return condition.apparatusId in state.placedApparatus;

    case 'actionCompleted':
      return state.completedActions.includes(condition.actionId);

    case 'stepReached': {
      // Compare by step index — stepReached means current step >= target step
      // We don't have access to config here, so we check by ID in completedActions
      // Actually, let's use stepId matching against currentStepId
      return state.currentStepId === condition.stepId ||
        state.completedActions.includes(`_step_${condition.stepId}`);
    }

    case 'and':
      return condition.conditions.every(c => evaluateCondition(c, state));

    case 'or':
      return condition.conditions.some(c => evaluateCondition(c, state));

    case 'not':
      return !evaluateCondition(condition.condition, state);

    default:
      return false;
  }
}


// ── Effect Application ───────────────────────────────────────────

/**
 * Apply a list of interaction effects to the state, returning a new state.
 * Pure function — no mutations.
 */
function applyEffects(
  state: ExperimentState,
  effects: InteractionEffect[],
): ExperimentState {
  let newState = { ...state };

  for (const effect of effects) {
    switch (effect.type) {
      case 'setFlag':
        newState = {
          ...newState,
          flags: { ...newState.flags, [effect.key]: effect.value },
        };
        break;

      case 'setVariable':
        newState = {
          ...newState,
          variables: { ...newState.variables, [effect.key]: effect.value },
        };
        break;

      case 'incrementVariable': {
        const currentVal = newState.variables[effect.key] ?? 0;
        const newVal = Math.round((currentVal + effect.amount) * 1000) / 1000;
        newState = {
          ...newState,
          variables: { ...newState.variables, [effect.key]: newVal },
        };
        break;
      }

      case 'placeApparatus':
        newState = {
          ...newState,
          placedApparatus: { ...newState.placedApparatus, [effect.apparatusId]: effect.zoneId },
        };
        break;

      case 'setApparatusProp':
        newState = {
          ...newState,
          apparatusProps: {
            ...newState.apparatusProps,
            [effect.apparatusId]: {
              ...(newState.apparatusProps[effect.apparatusId] ?? {}),
              [effect.prop]: effect.value,
            },
          },
        };
        break;

      case 'addMistake':
        newState = {
          ...newState,
          mistakes: [...newState.mistakes, effect.message],
        };
        break;

      case 'advanceStep':
        // Handled separately after effects are applied
        break;

      case 'custom':
        // Custom functions are handled by the config's own logic
        // The engine provides a hook for these — see createExperimentReducer
        break;
    }
  }

  return newState;
}


// ── Interaction Matching ─────────────────────────────────────────

/**
 * Find all interactions that match a given trigger.
 */
function findMatchingInteractions(
  config: ExperimentConfig,
  triggerType: string,
  source?: string,
  target?: string,
  elementId?: string,
): InteractionConfig[] {
  return config.interactions.filter(interaction => {
    const t = interaction.trigger;
    switch (t.type) {
      case 'drop':
        return triggerType === 'drop' && t.source === source && t.target === target;
      case 'click':
        return triggerType === 'click' && t.elementId === elementId;
      case 'stopcock':
        return triggerType === 'stopcock' && t.apparatusId === source;
      default:
        return false;
    }
  });
}


// ── Step Advancement ─────────────────────────────────────────────

/**
 * Check if the current step's required actions are all completed,
 * and if so, advance to the next step.
 */
function checkStepAdvancement(
  config: ExperimentConfig,
  state: ExperimentState,
): ExperimentState {
  const currentStep = config.steps[state.currentStepIndex];
  if (!currentStep) return state;

  // Check if all required actions for this step are completed
  const allCompleted = currentStep.requiredActions.every(
    actionId => state.completedActions.includes(actionId)
  );

  if (!allCompleted) return state;

  // Step is complete — advance based on advanceMode
  if (currentStep.advanceMode === 'button') {
    // Don't auto-advance; wait for explicit ADVANCE_STEP action
    return state;
  }

  // Auto-advance to next step
  return advanceToNextStep(config, state);
}

function advanceToNextStep(
  config: ExperimentConfig,
  state: ExperimentState,
): ExperimentState {
  const nextIndex = state.currentStepIndex + 1;

  if (nextIndex >= config.steps.length) {
    // Experiment complete
    return { ...state, finished: true };
  }

  const nextStep = config.steps[nextIndex];
  return {
    ...state,
    currentStepIndex: nextIndex,
    currentStepId: nextStep.id,
    completedActions: [...state.completedActions, `_step_${config.steps[state.currentStepIndex].id}`],
  };
}


// ── Initial State Factory ────────────────────────────────────────

/**
 * Create the initial state for an experiment from its config.
 */
export function createInitialState(config: ExperimentConfig): ExperimentState {
  const generatedValues = config.generateInitialValues?.() ?? {};

  const initialApparatusProps: Record<string, Record<string, unknown>> = {};
  const initialVesselMixtures: Record<string, VesselMixture> = {};
  const vesselComponents = ['ConicalFlask', 'Beaker', 'BODBottle', 'TestTube', 'VolumetricFlask', 'MeasuringCylinder'];

  for (const app of config.apparatus) {
    if (app.initialProps) {
      initialApparatusProps[app.id] = { ...app.initialProps };
    }
    if (vesselComponents.includes(app.component)) {
      const initVol =
        (app.initialProps?.liquidVolume as number) ??
        (app.initialProps?.volume as number) ??
        (config.initialVariables?.['sampleVolume'] ?? 0);
      initialVesselMixtures[app.id] = createEmptyMixture(app.id, initVol);
    }
  }

  return {
    currentStepIndex: 0,
    currentStepId: config.steps[0]?.id ?? '',
    placedApparatus: {},
    completedActions: [],
    variables: { ...config.initialVariables, ...generatedValues },
    flags: { ...config.initialFlags },
    animations: {},
    apparatusProps: initialApparatusProps,
    mistakes: [],
    studentAnswers: {},
    score: null,
    scoreBreakdown: null,
    finished: false,
    vesselMixtures: initialVesselMixtures,
    activeVesselInspectionId: null,
  };
}


// ── Reducer Factory ──────────────────────────────────────────────

/**
 * Create a reducer function for a given experiment config.
 * Returns a standard React-compatible (state, action) => state function.
 */
export function createExperimentReducer(
  config: ExperimentConfig,
): (state: ExperimentState, action: ExperimentAction) => ExperimentState {

  return function experimentReducer(
    state: ExperimentState,
    action: ExperimentAction,
  ): ExperimentState {

    switch (action.type) {

      // ── Start / Reset ──
      case 'START_EXPERIMENT': {
        const initial = createInitialState(config);
        // Skip step 0 if it's a "select" type — jump to step 1
        if (config.steps[0]?.type === 'results' || config.steps.length === 0) {
          return initial;
        }
        return initial;
      }

      case 'RESET':
        return createInitialState(config);

      // ── Drag & Drop ──
      case 'DROP_ITEM': {
        const { itemId, zoneId } = action.payload;

        // Find matching interactions
        const interactions = findMatchingInteractions(config, 'drop', itemId, zoneId);

        if (interactions.length === 0) {
          // Check if student dropped a chemical reagent into a reaction vessel (unscripted experimentation)
          const chemAddition = detectChemicalAddition(itemId, config, state);
          const targetVessel = findTargetVesselId(zoneId, config, state);

          if (chemAddition && targetVessel) {
            const mixtures = { ...(state.vesselMixtures ?? {}) };
            const currentMix = mixtures[targetVessel] ?? createEmptyMixture(targetVessel);
            const updatedMix = mixChemicals(currentMix, chemAddition);
            mixtures[targetVessel] = updatedMix;

            const latestEvent = updatedMix.recentEvents[0];
            const reactionMsg = latestEvent
              ? `🧪 Reaction: ${latestEvent.equation} (ΔT: +${latestEvent.deltaT.toFixed(1)}°C)`
              : `Added ${chemAddition.substanceId.toUpperCase()} to ${targetVessel}.`;

            return {
              ...state,
              vesselMixtures: mixtures,
              apparatusProps: {
                ...state.apparatusProps,
                [targetVessel]: {
                  ...(state.apparatusProps[targetVessel] ?? {}),
                  liquidColor: updatedMix.dominantColor,
                  temperature: updatedMix.temperatureC,
                  pH: updatedMix.pH,
                  effervescenceRate: updatedMix.effervescenceRate,
                },
              },
              mistakes: [...state.mistakes, reactionMsg],
            };
          }

          // No interaction defined for this drop — check if zone accepts this item
          const zone = config.dropZones.find(z => z.id === zoneId);
          if (zone && !zone.accepts.includes(itemId)) {
            // Rejected drop — add mistake message
            const message = zone.rejectMessage ?? "That item doesn't belong there.";
            return { ...state, mistakes: [...state.mistakes, message] };
          }
          return state;
        }

        // Process first matching interaction
        const interaction = interactions[0];

        // Check conditions
        if (interaction.conditions) {
          const allConditionsMet = interaction.conditions.every(
            c => evaluateCondition(c, state)
          );
          if (!allConditionsMet) {
            if (interaction.blockMessage) {
              return {
                ...state,
                mistakes: [...state.mistakes, interaction.blockMessage],
              };
            }
            return state;
          }
        }

        // Check guard (reject if guard condition is TRUE)
        if (interaction.guard) {
          if (evaluateCondition(interaction.guard.condition, state)) {
            return {
              ...state,
              mistakes: [...state.mistakes, interaction.guard.message],
            };
          }
        }

        // Apply effects
        let newState: ExperimentState;

        if (interaction.animation?.effectsAfterAnimation) {
          // Start animation only — effects applied on ANIMATION_COMPLETE
          const animFlag = interaction.animation.animatingFlag ?? `_anim_${interaction.id}`;
          newState = {
            ...state,
            animations: { ...state.animations, [animFlag]: true },
          };
        } else {
          // Apply effects immediately
          newState = applyEffects(state, interaction.effects);

          // Start animation if defined (but effects already applied)
          if (interaction.animation?.animatingFlag) {
            newState = {
              ...newState,
              animations: { ...newState.animations, [interaction.animation.animatingFlag]: true },
            };
          }
        }

        // Apply stoichiometry reaction solver to vessel
        const chemAddition = detectChemicalAddition(itemId, config, state);
        const targetVessel = findTargetVesselId(zoneId, config, state);

        if (chemAddition && targetVessel) {
          const mixtures = { ...(newState.vesselMixtures ?? {}) };
          const currentMix = mixtures[targetVessel] ?? createEmptyMixture(targetVessel);
          const updatedMix = mixChemicals(currentMix, chemAddition);
          mixtures[targetVessel] = updatedMix;

          newState = {
            ...newState,
            vesselMixtures: mixtures,
            apparatusProps: {
              ...newState.apparatusProps,
              [targetVessel]: {
                ...(newState.apparatusProps[targetVessel] ?? {}),
                liquidColor: updatedMix.dominantColor,
                temperature: updatedMix.temperatureC,
                pH: updatedMix.pH,
                effervescenceRate: updatedMix.effervescenceRate,
              },
            },
          };
        }

        // Mark action as completed
        if (interaction.completesAction) {
          newState = {
            ...newState,
            completedActions: [...newState.completedActions, interaction.completesAction],
          };
        }

        // Check step advancement
        newState = checkStepAdvancement(config, newState);

        return newState;
      }

      // ── Click Interaction ──
      case 'CLICK_ELEMENT': {
        const { elementId } = action.payload;
        const interactions = findMatchingInteractions(config, 'click', undefined, undefined, elementId);

        if (interactions.length === 0) return state;

        const interaction = interactions[0];

        // Check conditions
        if (interaction.conditions) {
          const allMet = interaction.conditions.every(c => evaluateCondition(c, state));
          if (!allMet) {
            if (interaction.blockMessage) {
              return { ...state, mistakes: [...state.mistakes, interaction.blockMessage] };
            }
            return state;
          }
        }

        // Check guard
        if (interaction.guard && evaluateCondition(interaction.guard.condition, state)) {
          return { ...state, mistakes: [...state.mistakes, interaction.guard.message] };
        }

        let newState: ExperimentState;

        if (interaction.animation?.effectsAfterAnimation) {
          const animFlag = interaction.animation.animatingFlag ?? `_anim_${interaction.id}`;
          newState = { ...state, animations: { ...state.animations, [animFlag]: true } };
        } else {
          newState = applyEffects(state, interaction.effects);
          if (interaction.animation?.animatingFlag) {
            newState = {
              ...newState,
              animations: { ...newState.animations, [interaction.animation.animatingFlag]: true },
            };
          }
        }

        if (interaction.completesAction) {
          newState = {
            ...newState,
            completedActions: [...newState.completedActions, interaction.completesAction],
          };
        }

        newState = checkStepAdvancement(config, newState);
        return newState;
      }

      // ── Stopcock (Continuous Flow) ──
      case 'SET_STOPCOCK': {
        const isBuretteFilled = state.flags.buretteFilled ?? state.flags['burette-filled'] ?? true;
        const openAmount = isBuretteFilled === false ? 0 : Math.max(0, Math.min(1, action.payload.openAmount));
        return {
          ...state,
          variables: { ...state.variables, stopcockOpen: openAmount },
        };
      }

      case 'TICK_FLOW': {
        const stopcockOpen = state.variables['stopcockOpen'] ?? 0;
        if (stopcockOpen <= 0) return state;

        // Check if burette is filled! If buretteFilled is explicitly false, do not flow liquid
        const isBuretteFilled = state.flags.buretteFilled ?? state.flags['burette-filled'] ?? true;
        if (isBuretteFilled === false) {
          return {
            ...state,
            variables: { ...state.variables, stopcockOpen: 0 },
            flags: { ...state.flags, isDropAnimating: false },
          };
        }

        const maxFlowRate = state.variables['maxFlowRate'] ?? 0.5; // mL/s default
        const deltaSeconds = action.payload.deltaMs / 1000;
        const flowAmount = stopcockOpen * maxFlowRate * deltaSeconds;
        const newVariables = { ...state.variables };
        const currentVolume = newVariables['volumeAdded'] ?? 0;

        // If burette is empty (50 mL capacity reached), stop flowing
        if (currentVolume >= 50) {
          return {
            ...state,
            variables: { ...state.variables, stopcockOpen: 0 },
            flags: { ...state.flags, isDropAnimating: false },
          };
        }

        newVariables['volumeAdded'] = Math.round((currentVolume + flowAmount) * 1000) / 1000;

        // Automatically increment specific experiment titration volume variables if they exist in variables
        const titrationKeys = [
          'kohVolume',
          'stdEdtaVolume',
          'sampleEdtaVolume',
          'volumeA',
          'volumeB',
          'thiosulphateVolume',
          'naohVolume',
          'buretteReading',
        ];
        for (const key of titrationKeys) {
          if (newVariables[key] !== undefined) {
            newVariables[key] = Math.round(((newVariables[key] as number) + flowAmount) * 1000) / 1000;
          }
        }

        return {
          ...state,
          variables: newVariables,
          flags: { ...state.flags, isDropAnimating: stopcockOpen > 0 },
        };
      }

      case 'TICK': {
        const { deltaMs } = action.payload;
        const deltaSeconds = deltaMs / 1000;
        let newState = { ...state };
        let changed = false;

        if (config.continuousUpdates) {
          for (const update of config.continuousUpdates) {
            if (evaluateCondition(update.condition, state)) {
              // Apply increments
              if (update.increments) {
                const newVariables = { ...newState.variables };
                for (const [key, amountPerSec] of Object.entries(update.increments)) {
                  const current = newVariables[key] ?? 0;
                  // Don't increment if already at bounds (optional, but good for progress bars)
                  newVariables[key] = Math.round((current + amountPerSec * deltaSeconds) * 10000) / 10000;
                }
                newState = { ...newState, variables: newVariables };
                changed = true;
              }

              // Check condition met events
              if (update.onConditionMet) {
                for (const event of update.onConditionMet) {
                  if (evaluateCondition(event.condition, newState)) {
                    newState = applyEffects(newState, event.effects);
                    changed = true;
                  }
                }
              }

              // Apply custom function update
              if (update.customFn) {
                const newVal = computeFormula(update.customFn, newState.variables);
                // Map custom function results to specific state variables
                let targetVar: string | null = null;
                if (update.customFn === 'phTitrationCurve') targetVar = 'pH';
                if (update.customFn === 'conductometricCurve') targetVar = 'conductance';

                if (targetVar) {
                  newState = {
                    ...newState,
                    variables: { ...newState.variables, [targetVar]: newVal }
                  };
                  changed = true;

                  // Sync to apparatus props if needed (e.g., pH meter display)
                  if (targetVar === 'pH' && newState.placedApparatus['ph-meter']) {
                    newState = applyEffects(newState, [{
                      type: 'setApparatusProp', apparatusId: 'ph-meter', prop: 'variables', value: { pH: newVal }
                    }]);
                  }
                  if (targetVar === 'conductance' && newState.placedApparatus['conductivity-bridge']) {
                    newState = applyEffects(newState, [{
                      type: 'setApparatusProp', apparatusId: 'conductivity-bridge', prop: 'variables', value: { conductance: newVal }
                    }]);
                  }
                }
              }
            }
          }
        }

        return changed ? newState : state;
      }

      // ── Animation Complete ──
      case 'ANIMATION_COMPLETE': {
        const { animationFlag, interactionId } = action.payload;

        // Clear animation flag
        let newState: ExperimentState = {
          ...state,
          animations: { ...state.animations, [animationFlag]: false },
        };

        // Find the interaction and apply deferred effects only if they were deferred
        const interaction = config.interactions.find(i => i.id === interactionId);
        if (interaction) {
          if (interaction.animation?.effectsAfterAnimation) {
            newState = applyEffects(newState, interaction.effects);
          }

          if (interaction.completesAction &&
              !newState.completedActions.includes(interaction.completesAction)) {
            newState = {
              ...newState,
              completedActions: [...newState.completedActions, interaction.completesAction],
            };
          }

          newState = checkStepAdvancement(config, newState);
        }

        return newState;
      }

      // ── Manual Step Advance ──
      case 'ADVANCE_STEP': {
        const currentStep = config.steps[state.currentStepIndex];
        if (currentStep && currentStep.requiredActions.length > 0) {
          const allCompleted = currentStep.requiredActions.every(
            actionId => state.completedActions.includes(actionId)
          );
          if (!allCompleted) {
            return {
              ...state,
              mistakes: [
                ...state.mistakes,
                `Please complete all step actions before continuing: ${currentStep.instruction}`,
              ],
            };
          }
        }
        return advanceToNextStep(config, state);
      }

      // ── Calculation Submission ──
      case 'SUBMIT_CALCULATION': {
        return {
          ...state,
          studentAnswers: { ...state.studentAnswers, ...action.payload.answers },
          completedActions: [...state.completedActions, 'calculation-submitted'],
        };
      }


      // ── Mistakes ──
      case 'ADD_MISTAKE':
        return {
          ...state,
          mistakes: [...state.mistakes, action.payload.message],
        };

      // ── Chemical Stoichiometry & Inspection ──
      case 'INSPECT_VESSEL':
        return {
          ...state,
          activeVesselInspectionId: action.payload.vesselId,
        };

      case 'MIX_CHEMICAL': {
        const { vesselId, addition } = action.payload;
        const mixtures = { ...(state.vesselMixtures ?? {}) };
        const currentMix = mixtures[vesselId] ?? createEmptyMixture(vesselId);
        const updatedMix = mixChemicals(currentMix, addition);
        mixtures[vesselId] = updatedMix;

        const latestEvent = updatedMix.recentEvents[0];
        const reactionMsg = latestEvent
          ? `🧪 Reaction: ${latestEvent.equation} (ΔT: +${latestEvent.deltaT.toFixed(1)}°C)`
          : `Added ${addition.substanceId.toUpperCase()} to ${vesselId}.`;

        return {
          ...state,
          vesselMixtures: mixtures,
          apparatusProps: {
            ...state.apparatusProps,
            [vesselId]: {
              ...(state.apparatusProps[vesselId] ?? {}),
              liquidColor: updatedMix.dominantColor,
              temperature: updatedMix.temperatureC,
              pH: updatedMix.pH,
              effervescenceRate: updatedMix.effervescenceRate,
            },
          },
          mistakes: latestEvent ? [...state.mistakes, reactionMsg] : state.mistakes,
        };
      }

      default:
        return state;
    }
  };
}


// ── Hook: useExperiment ──────────────────────────────────────────

/**
 * Convenience wrapper for creating an experiment reducer + initial state.
 * Usage in React:
 *
 *   const [state, dispatch] = useReducer(
 *     ...createExperiment(myConfig)
 *   );
 *
 * Returns [reducer, initialState] tuple compatible with useReducer.
 */
export function createExperiment(
  config: ExperimentConfig,
): [
  (state: ExperimentState, action: ExperimentAction) => ExperimentState,
  ExperimentState,
] {
  return [
    createExperimentReducer(config),
    createInitialState(config),
  ];
}
