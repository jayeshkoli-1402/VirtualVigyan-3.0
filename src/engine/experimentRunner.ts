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

  // Glassware, hardware and measurement apparatus are NOT chemical additions
  if (
    norm === 'viscometer' ||
    norm === 'pycnometer' ||
    norm === 'burette' ||
    norm === 'conical-flask' ||
    norm === 'flask' ||
    norm === 'beaker' ||
    norm === 'test-tube' ||
    norm === 'bod-bottle' ||
    norm === 'measuring-cylinder' ||
    norm.includes('stand') ||
    norm.includes('clamp') ||
    norm.includes('balance') ||
    norm.includes('thermometer') ||
    norm.includes('stopwatch') ||
    norm.includes('bath') ||
    norm.includes('burner') ||
    norm.includes('suction') ||
    norm.includes('bulb') ||
    norm.includes('matchstick')
  ) {
    return null;
  }

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
  if (norm.includes('phenolphthalein') || (norm.includes('indicator') && !norm.includes('methyl') && !norm.includes('ebt') && !norm.includes('starch'))) {
    return { substanceId: 'phenolphthalein', volumeMl: 0.1, molarity: 0.005 };
  }
  if (norm.includes('methyl') || norm.includes('methyl-orange')) {
    return { substanceId: 'methyl_orange', volumeMl: 0.1, molarity: 0.005 };
  }
  if (norm.includes('ebt') || norm.includes('eriochrome')) {
    return { substanceId: 'eriochrome_black_t', volumeMl: 0.1, molarity: 0.002 };
  }
  if (norm.includes('starch')) {
    return { substanceId: 'starch', volumeMl: 1.0, molarity: 0.01 };
  }
  if (norm.includes('k2cro4') || norm.includes('chromate')) {
    return { substanceId: 'k2cro4', volumeMl: 1.0, molarity: 0.05 };
  }
  if (norm.includes('buffer') || norm.includes('nh4cl')) {
    return { substanceId: 'buffer_ph10', volumeMl: 2.0, molarity: 1.0 };
  }
  if (norm.includes('edta')) {
    return { substanceId: 'edta', volumeMl: 5.0, molarity: 0.01 };
  }

  // Solvents & Real Lab Samples
  if (norm.includes('oil')) {
    return { substanceId: 'oil_sample', volumeMl: 10 };
  }
  if (norm.includes('alcohol') || norm.includes('ethanol')) {
    return { substanceId: 'neutral_alcohol', volumeMl: 25 };
  }
  if (norm.includes('acetone') || norm.includes('rinse')) {
    return { substanceId: 'acetone', volumeMl: 15 };
  }
  if (norm.includes('chromic')) {
    return { substanceId: 'chromic_acid', volumeMl: 15 };
  }
  if (norm.includes('mnso4') || norm.includes('manganous')) {
    return { substanceId: 'mnso4', volumeMl: 2, molarity: 0.2 };
  }
  if (norm.includes('alkali-iodide') || norm.includes('azide')) {
    return { substanceId: 'ki', volumeMl: 2, molarity: 0.2 };
  }
  if (norm.includes('liquid-sample') || (norm.includes('sample') && norm.includes('visco'))) {
    return { substanceId: 'liquid_sample_a', volumeMl: 15 };
  }
  if (norm.includes('cacl2') || norm.includes('hard-water') || norm.includes('std-cacl2')) {
    return { substanceId: 'cacl2', volumeMl: 25, molarity: 0.01 };
  }
  if (norm.includes('water') || norm.includes('distilled') || norm === 'h2o' || norm.includes('cond-water')) {
    return { substanceId: 'h2o', volumeMl: 25 };
  }
  if (norm.includes('sample')) {
    return { substanceId: 'h2o', volumeMl: 25 };
  }

  return null;
}

/** Canonical list of chemical reaction and measurement vessels */
export const REACTION_VESSEL_COMPONENTS = [
  'ConicalFlask',
  'Beaker',
  'BODBottle',
  'TestTube',
  'VolumetricFlask',
  'MeasuringCylinder',
  'OstwaldViscometer',
  'Viscometer',
  'SpecificGravityBottle',
  'SeparatingFunnel',
  'Calorimeter',
];

/** Helper to identify the active chemical titrant being dispensed from the burette */
export function detectBuretteTitrant(
  config: ExperimentConfig,
  state?: ExperimentState,
): { substanceId: string; molarity: number } {
  const expId = config.id.toLowerCase();
  if (expId.includes('edta') || expId.includes('hardness')) {
    return { substanceId: 'edta', molarity: (state?.variables['edtaMolarity'] as number) ?? 0.01 };
  }
  if (expId.includes('alkalinity')) {
    const norm = state?.variables['normalityAcid'] ? (state.variables['normalityAcid'] as number) / 2 : 0.01;
    return { substanceId: 'h2so4', molarity: norm };
  }
  if (expId.includes('acidity')) {
    return { substanceId: 'naoh', molarity: (state?.variables['normalityBase'] as number) ?? 0.02 };
  }
  if (expId.includes('chloride') || expId.includes('mohr')) {
    return { substanceId: 'agno3', molarity: (state?.variables['normalityAgNO3'] as number) ?? 0.02 };
  }
  if (expId.includes('winkler') || expId.includes('oxygen') || expId.includes('dissolved')) {
    return { substanceId: 'na2s2o3', molarity: (state?.variables['thiosulphateNormality'] as number) ?? 0.025 };
  }
  if (expId.includes('acid-value') || expId.includes('oil')) {
    return { substanceId: 'koh', molarity: (state?.variables['normalityKOH'] as number) ?? 0.1 };
  }
  if (expId.includes('ph-metric') || expId.includes('conductometric')) {
    return { substanceId: 'naoh', molarity: (state?.variables['molarityNaOH'] as number) ?? 0.1 };
  }
  return { substanceId: 'naoh', molarity: 0.1 };
}

/** Helper to locate which vessel an item is dropped into */
export function findTargetVesselId(
  zoneId: string,
  config: ExperimentConfig,
  state: ExperimentState,
): string | null {
  const zLower = zoneId.toLowerCase();

  // If the zone is explicitly for mounting hardware, clamps, balance or heating, it is NOT a vessel addition zone
  if (
    zLower.includes('clamp') ||
    zLower.includes('stand') ||
    zLower.includes('balance') ||
    zLower.includes('bath') ||
    zLower.includes('burner')
  ) {
    return null;
  }

  // 1. Precise keyword matching in zoneId against apparatus IDs and components
  for (const app of config.apparatus) {
    if (!REACTION_VESSEL_COMPONENTS.includes(app.component)) continue;
    const appId = app.id.toLowerCase();
    const appComp = app.component.toLowerCase();

    if (
      (zLower.includes('beaker') && (appId.includes('beaker') || appComp.includes('beaker'))) ||
      ((zLower.includes('flask') || zLower.includes('conical')) && (appId.includes('flask') || appComp.includes('flask'))) ||
      (zLower.includes('visco') && (appId.includes('visco') || appComp.includes('visco'))) ||
      (zLower.includes('tube') && (appId.includes('tube') || appComp.includes('tube'))) ||
      (zLower.includes('bottle') && (appId.includes('bottle') || appComp.includes('bottle'))) ||
      (zLower.includes('cylinder') && (appId.includes('cylinder') || appComp.includes('cylinder')))
    ) {
      return app.id;
    }
  }

  // 2. Check if zoneId directly matches a placed vessel
  for (const [appId, placedZone] of Object.entries(state.placedApparatus)) {
    if (placedZone === zoneId) {
      const app = config.apparatus.find(a => a.id === appId);
      if (app && REACTION_VESSEL_COMPONENTS.includes(app.component)) {
        return appId;
      }
    }
  }

  // 3. If zone explicitly specifies a vessel mouth or opening, match with active placed vessel
  if (zLower.includes('mouth') || zLower.includes('limb') || zLower.includes('opening')) {
    for (const preferred of REACTION_VESSEL_COMPONENTS) {
      for (const appId of Object.keys(state.placedApparatus)) {
        const app = config.apparatus.find(a => a.id === appId);
        if (app && app.component === preferred) {
          return appId;
        }
      }
    }
  }

  return null;
}

/** Calculate visual liquid level (0.0 to 0.95) based on physical volume and vessel type */
export function calculateVesselLevel(volumeMl: number, component?: string): number {
  if (volumeMl <= 0) return 0;
  let maxCap = 100;
  if (component === 'TestTube') maxCap = 25;
  else if (component === 'Beaker') maxCap = 100;
  else if (component === 'ConicalFlask') maxCap = 150;
  else if (component === 'MeasuringCylinder') maxCap = 100;
  else if (component === 'BODBottle') maxCap = 300;
  else if (component === 'VolumetricFlask') maxCap = 100;
  else if (component === 'Viscometer' || component === 'OstwaldViscometer') maxCap = 25;
  return Math.min(0.95, Math.max(0.18, Math.round((volumeMl / maxCap) * 100) / 100));
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

        // If liquidLevel is reset to 0 (vessel cleaned, drained, or emptied), reset its mixture volume to 0 mL
        if (effect.prop === 'liquidLevel' && effect.value === 0) {
          if (newState.vesselMixtures?.[effect.apparatusId]) {
            newState = {
              ...newState,
              vesselMixtures: {
                ...newState.vesselMixtures,
                [effect.apparatusId]: createEmptyMixture(effect.apparatusId, 0),
              },
            };
          }
        }
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
  for (const app of config.apparatus) {
    if (app.initialProps) {
      initialApparatusProps[app.id] = { ...app.initialProps };
    }
    if (REACTION_VESSEL_COMPONENTS.includes(app.component)) {
      const initLevel = (app.initialProps?.liquidLevel as number) ?? 0;
      const initVol = initLevel > 0
        ? ((app.initialProps?.liquidVolume as number) ?? (app.initialProps?.volume as number) ?? Math.round(initLevel * 100))
        : ((app.initialProps?.liquidVolume as number) ?? 0);
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
    activeAnimationInteractionId: null,
    activeAnimation: null,
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

            const appSpec = config.apparatus.find(a => a.id === targetVessel);
            const newLevel = calculateVesselLevel(updatedMix.volumeMl, appSpec?.component);

            const latestEvent = updatedMix.recentEvents[0];
            const reactionMsg = latestEvent
              ? `🧪 Reaction: ${latestEvent.equation} (ΔT: +${latestEvent.deltaT.toFixed(1)}°C)`
              : `Added ${chemAddition.substanceId.toUpperCase()} to ${targetVessel}.`;

            const isDropper = itemId.includes('dropper') || itemId.includes('indicator');

            return {
              ...state,
              vesselMixtures: mixtures,
              animations: { ...state.animations, isPouring: true },
              activeAnimationInteractionId: null,
              activeAnimation: {
                type: isDropper ? 'drip' : 'pour',
                sourceApparatusId: itemId,
                targetZoneId: zoneId,
                color: updatedMix.dominantColor,
              },
              apparatusProps: {
                ...state.apparatusProps,
                [targetVessel]: {
                  ...(state.apparatusProps[targetVessel] ?? {}),
                  liquidColor: updatedMix.dominantColor,
                  liquidLevel: newLevel,
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

        // Determine exact animation type and targets for FluidDynamicsLayer
        const animType = interaction.animation?.type ?? (itemId.includes('dropper') || itemId.includes('indicator') ? 'drip' : 'pour');
        const activeAnimObj = {
          type: animType,
          sourceApparatusId: interaction.trigger.type === 'drop' ? interaction.trigger.source : itemId,
          targetZoneId: interaction.trigger.type === 'drop' ? interaction.trigger.target : zoneId,
        };

        // Apply effects
        let newState: ExperimentState;

        if (interaction.animation?.effectsAfterAnimation) {
          // Start animation only — effects applied on ANIMATION_COMPLETE
          const animFlag = interaction.animation.animatingFlag ?? `_anim_${interaction.id}`;
          newState = {
            ...state,
            animations: { ...state.animations, [animFlag]: true },
            activeAnimationInteractionId: interaction.id,
            activeAnimation: activeAnimObj,
          };
        } else {
          // Apply effects immediately
          newState = applyEffects(state, interaction.effects);

          // Start animation if defined (but effects already applied)
          const animFlag = interaction.animation?.animatingFlag ?? (interaction.animation ? `_anim_${interaction.id}` : null);
          if (animFlag) {
            newState = {
              ...newState,
              animations: { ...newState.animations, [animFlag]: true },
              activeAnimationInteractionId: interaction.id,
              activeAnimation: activeAnimObj,
            };
          }
        }

        // Apply stoichiometry reaction solver and ensure liquid level is visibly updated for all experiments
        const chemAddition = detectChemicalAddition(itemId, config, state);
        const targetVessel = findTargetVesselId(zoneId, config, state);

        const emptiesVessel = interaction.effects?.some(
          e => e.type === 'setApparatusProp' && e.apparatusId === targetVessel && e.prop === 'liquidLevel' && e.value === 0
        );

        if (!emptiesVessel && chemAddition && targetVessel && itemId !== targetVessel) {
          const mixtures = { ...(newState.vesselMixtures ?? {}) };
          const currentMix = mixtures[targetVessel] ?? createEmptyMixture(targetVessel, 0);
          const updatedMix = mixChemicals(currentMix, chemAddition);
          mixtures[targetVessel] = updatedMix;

          const appSpec = config.apparatus.find(a => a.id === targetVessel);
          const newLevel = calculateVesselLevel(updatedMix.volumeMl, appSpec?.component);

          // Check if interaction effects explicitly specify liquidLevel or liquidColor
          const explicitLevel = interaction.effects?.find(
            (e): e is Extract<InteractionEffect, { type: 'setApparatusProp' }> =>
              e.type === 'setApparatusProp' && e.apparatusId === targetVessel && e.prop === 'liquidLevel'
          );
          const explicitColor = interaction.effects?.find(
            (e): e is Extract<InteractionEffect, { type: 'setApparatusProp' }> =>
              e.type === 'setApparatusProp' && e.apparatusId === targetVessel && e.prop === 'liquidColor'
          );

          const finalLevel = explicitLevel ? (explicitLevel.value as number) : newLevel;
          const finalColor = explicitColor ? (explicitColor.value as string) : updatedMix.dominantColor;

          newState = {
            ...newState,
            vesselMixtures: mixtures,
            apparatusProps: {
              ...newState.apparatusProps,
              [targetVessel]: {
                ...(newState.apparatusProps[targetVessel] ?? {}),
                liquidColor: finalColor,
                liquidLevel: finalLevel,
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
        const hasBurette = Boolean(
          config.apparatus.some(a => a.component === 'Burette') ||
          config.bench.backgroundElements?.some(b => b.component === 'Burette' || b.component === 'BuretteStand') ||
          Object.keys(state.placedApparatus).some(id => id.includes('burette')) ||
          config.steps.some(s => s.id === 'titrating' || s.id.includes('titrat'))
        );
        if (!hasBurette) return state;

        const isBuretteFilled = Boolean(
          hasBurette && (
            state.flags.buretteFilled === true ||
            state.flags['burette-filled'] === true ||
            ((state.apparatusProps['burette']?.liquidLevel as number ?? 0) > 0)
          ) &&
          state.flags.buretteFilled !== false &&
          state.flags['burette-filled'] !== false
        );

        if (!isBuretteFilled && action.payload.openAmount > 0) {
          return {
            ...state,
            variables: { ...state.variables, stopcockOpen: 0 },
            mistakes: [...state.mistakes, 'Burette is empty! Fill the burette with solution before opening the stopcock.'],
          };
        }

        const openAmount = isBuretteFilled ? Math.max(0, Math.min(1, action.payload.openAmount)) : 0;
        return {
          ...state,
          variables: { ...state.variables, stopcockOpen: openAmount },
        };
      }

      case 'TICK_FLOW': {
        const hasBurette = Boolean(
          config.apparatus.some(a => a.component === 'Burette') ||
          config.bench.backgroundElements?.some(b => b.component === 'Burette' || b.component === 'BuretteStand') ||
          Object.keys(state.placedApparatus).some(id => id.includes('burette')) ||
          config.steps.some(s => s.id === 'titrating' || s.id.includes('titrat'))
        );
        if (!hasBurette) return state;

        const stopcockOpen = state.variables['stopcockOpen'] ?? 0;
        if (stopcockOpen <= 0) return state;

        // Check if burette is filled! Strictly check filled status (default to FALSE)
        const isBuretteFilled = Boolean(
          hasBurette && (
            state.flags.buretteFilled === true ||
            state.flags['burette-filled'] === true ||
            ((state.apparatusProps['burette']?.liquidLevel as number ?? 0) > 0)
          ) &&
          state.flags.buretteFilled !== false &&
          state.flags['burette-filled'] !== false
        );

        if (!isBuretteFilled) {
          return {
            ...state,
            variables: { ...state.variables, stopcockOpen: 0 },
            flags: { ...state.flags, isDropAnimating: false },
          };
        }

        const maxFlowRate = state.variables['maxFlowRate'] ?? 0.08; // mL/s default (calibrated for slow, focused, high-precision titration)
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

        const newVolume = Math.round((currentVolume + flowAmount) * 1000) / 1000;
        newVariables['volumeAdded'] = newVolume;

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

        // Dynamically update receiving vessel's liquid level & burette's level!
        const buretteLevel = Math.max(0, Math.min(1.0, (50 - newVolume) / 50));
        const apparatusProps = { ...state.apparatusProps };
        apparatusProps['burette'] = {
          ...(apparatusProps['burette'] ?? {}),
          liquidLevel: buretteLevel,
        };

        const receivingVesselId =
          findTargetVesselId('flask-mouth-zone', config, state) ??
          findTargetVesselId('beaker-mouth-zone', config, state) ??
          config.apparatus.find(a => ['ConicalFlask', 'Beaker'].includes(a.component))?.id ??
          'flask';

        const mixtures = { ...(state.vesselMixtures ?? {}) };
        if (receivingVesselId) {
          const titrant = detectBuretteTitrant(config, state);
          const currentMix = mixtures[receivingVesselId] ?? createEmptyMixture(receivingVesselId, 0);
          const updatedMix = mixChemicals(currentMix, {
            substanceId: titrant.substanceId,
            volumeMl: flowAmount,
            molarity: titrant.molarity,
          });
          mixtures[receivingVesselId] = updatedMix;
        }

        return {
          ...state,
          variables: newVariables,
          apparatusProps,
          vesselMixtures: mixtures,
          flags: { ...state.flags, isDropAnimating: stopcockOpen > 0 },
        };
      }

      // ── Single Discrete Drop Addition (+0.05 mL) ──
      case 'ADD_SINGLE_DROP': {
        const hasBurette = Boolean(
          config.apparatus.some(a => a.component === 'Burette') ||
          config.bench.backgroundElements?.some(b => b.component === 'Burette' || b.component === 'BuretteStand') ||
          Object.keys(state.placedApparatus).some(id => id.includes('burette')) ||
          config.steps.some(s => s.id === 'titrating' || s.id.includes('titrat'))
        );
        if (!hasBurette) return state;

        const isBuretteFilled = Boolean(
          hasBurette && (
            state.flags.buretteFilled === true ||
            state.flags['burette-filled'] === true ||
            ((state.apparatusProps['burette']?.liquidLevel as number ?? 0) > 0)
          ) &&
          state.flags.buretteFilled !== false &&
          state.flags['burette-filled'] !== false
        );

        if (!isBuretteFilled) {
          return {
            ...state,
            mistakes: [...state.mistakes, 'Burette is empty! Fill the burette before dispensing drops.'],
          };
        }

        const dropVol = action.payload?.dropVolumeMl ?? 0.05; // 0.05 mL standard analytical drop
        const newVariables = { ...state.variables };
        const currentVolume = newVariables['volumeAdded'] ?? 0;
        if (currentVolume >= 50) return state;

        const newVolume = Math.round((currentVolume + dropVol) * 1000) / 1000;
        newVariables['volumeAdded'] = newVolume;

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
            newVariables[key] = Math.round(((newVariables[key] as number) + dropVol) * 1000) / 1000;
          }
        }

        const buretteLevel = Math.max(0, Math.min(1.0, (50 - newVolume) / 50));
        const apparatusProps = { ...state.apparatusProps };
        apparatusProps['burette'] = {
          ...(apparatusProps['burette'] ?? {}),
          liquidLevel: buretteLevel,
        };

        const receivingVesselId =
          findTargetVesselId('flask-mouth-zone', config, state) ??
          findTargetVesselId('beaker-mouth-zone', config, state) ??
          config.apparatus.find(a => ['ConicalFlask', 'Beaker'].includes(a.component))?.id ??
          'flask';

        if (receivingVesselId && apparatusProps[receivingVesselId]) {
          const currentVesselLevel = (apparatusProps[receivingVesselId].liquidLevel as number) ?? 0.35;
          apparatusProps[receivingVesselId] = {
            ...apparatusProps[receivingVesselId],
            liquidLevel: Math.min(0.95, Math.round((currentVesselLevel + (dropVol / 80)) * 1000) / 1000),
          };
        }

        const mixtures = { ...(state.vesselMixtures ?? {}) };
        if (receivingVesselId) {
          const titrant = detectBuretteTitrant(config, state);
          const currentMix = mixtures[receivingVesselId] ?? createEmptyMixture(receivingVesselId, 0);
          const updatedMix = mixChemicals(currentMix, {
            substanceId: titrant.substanceId,
            volumeMl: dropVol,
            molarity: titrant.molarity,
          });
          mixtures[receivingVesselId] = updatedMix;
        }

        return {
          ...state,
          variables: newVariables,
          apparatusProps,
          vesselMixtures: mixtures,
          flags: { ...state.flags, isDropAnimating: true },
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

        // Clear animation flag and active animation metadata
        let newState: ExperimentState = {
          ...state,
          animations: { ...state.animations, [animationFlag]: false },
          activeAnimationInteractionId:
            state.activeAnimationInteractionId === interactionId ? null : state.activeAnimationInteractionId,
          activeAnimation: null,
        };

        // Find the interaction and apply deferred effects only if they were deferred
        const interaction = config.interactions.find(i => i.id === interactionId);
        if (interaction) {
          if (interaction.animation?.effectsAfterAnimation) {
            newState = applyEffects(newState, interaction.effects);

            if (interaction.trigger.type === 'drop') {
              const chemAddition = detectChemicalAddition(interaction.trigger.source, config, newState);
              const targetVessel = findTargetVesselId(interaction.trigger.target, config, newState);
              if (chemAddition && targetVessel) {
                const mixtures = { ...(newState.vesselMixtures ?? {}) };
                const currentMix = mixtures[targetVessel] ?? createEmptyMixture(targetVessel, 0);
                const updatedMix = mixChemicals(currentMix, chemAddition);
                mixtures[targetVessel] = updatedMix;

                const appSpec = config.apparatus.find(a => a.id === targetVessel);
                const newLevel = calculateVesselLevel(updatedMix.volumeMl, appSpec?.component);

                const explicitLevel = interaction.effects?.find(
                  (e): e is Extract<InteractionEffect, { type: 'setApparatusProp' }> =>
                    e.type === 'setApparatusProp' && e.apparatusId === targetVessel && e.prop === 'liquidLevel'
                );
                const explicitColor = interaction.effects?.find(
                  (e): e is Extract<InteractionEffect, { type: 'setApparatusProp' }> =>
                    e.type === 'setApparatusProp' && e.apparatusId === targetVessel && e.prop === 'liquidColor'
                );

                const finalLevel = explicitLevel ? (explicitLevel.value as number) : newLevel;
                const finalColor = explicitColor ? (explicitColor.value as string) : updatedMix.dominantColor;

                newState = {
                  ...newState,
                  vesselMixtures: mixtures,
                  apparatusProps: {
                    ...newState.apparatusProps,
                    [targetVessel]: {
                      ...(newState.apparatusProps[targetVessel] ?? {}),
                      liquidColor: finalColor,
                      liquidLevel: finalLevel,
                      temperature: updatedMix.temperatureC,
                      pH: updatedMix.pH,
                      effervescenceRate: updatedMix.effervescenceRate,
                    },
                  },
                };
              }
            }
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

        const appSpec = config.apparatus.find(a => a.id === vesselId);
        const newLevel = calculateVesselLevel(updatedMix.volumeMl, appSpec?.component);

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
              liquidLevel: newLevel,
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
