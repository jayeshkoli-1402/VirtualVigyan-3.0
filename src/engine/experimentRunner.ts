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
import { CHEMICAL_DATABASE } from './chemicalDatabase';

// ── Chemical Reagent Detection Helpers ───────────────────────────

/** Helper to detect if a dropped item or ID represents a chemical reagent addition */
export function detectChemicalAddition(
  itemId: string,
  config?: ExperimentConfig,
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
    const molarity = (config?.chemistry?.constants?.acidMolarity as number | undefined) ?? (state?.variables['molarityHCl'] as number | undefined) ?? 0.1;
    const volumeMl = (config?.chemistry?.constants?.acidVolume as number | undefined) ?? 10;
    return { substanceId: 'hcl', volumeMl, molarity };
  }
  if (norm.includes('h2so4') || norm.includes('sulfuric')) {
    const molarity = (config?.chemistry?.constants?.acidMolarity as number | undefined) ?? (state?.variables['molarityH2SO4'] as number | undefined) ?? 0.1;
    const volumeMl = (config?.chemistry?.constants?.acidVolume as number | undefined) ?? 10;
    return { substanceId: 'h2so4', volumeMl, molarity };
  }
  if (norm.includes('hno3') || norm.includes('nitric')) {
    return { substanceId: 'hno3', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('acetic') || norm.includes('ch3cooh') || norm.includes('vinegar')) {
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
  if (norm.includes('na2co3') || (norm.includes('sodium') && norm.includes('carbonate')) || norm.includes('washing-soda')) {
    return { substanceId: 'na2co3', volumeMl: 10, molarity: 0.05 };
  }
  if (norm.includes('nahco3') || norm.includes('bicarbonate') || norm.includes('baking-soda')) {
    return { substanceId: 'nahco3', volumeMl: 10, molarity: 0.1 };
  }
  if (norm.includes('caco3') || norm.includes('marble') || (norm.includes('calcium') && norm.includes('carbonate'))) {
    return { substanceId: 'caco3', massGrams: 2.0 };
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
  if (norm.includes('thiosulfate') || norm.includes('thiosulphate') || norm.includes('na2s2o3')) {
    return { substanceId: 'na2s2o3', volumeMl: 15, molarity: 0.1 };
  }

  // Metals
  if (norm.includes('zinc') || norm === 'zn') {
    const massGrams = (config?.chemistry?.constants?.zincMass as number | undefined) ?? 2.0;
    return { substanceId: 'zn', massGrams };
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
  if (norm.includes('aluminium') || norm.includes('aluminum') || norm === 'al') {
    return { substanceId: 'al', massGrams: 1.0 };
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
    const waterVol = (config?.chemistry?.constants?.waterVolume as number | undefined) ?? 50;
    return { substanceId: 'h2o', volumeMl: waterVol };
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

  // 1. Check if the dropZone explicitly specifies which apparatus it belongs to via visibleWhen
  const targetDropZone = config.dropZones.find(z => z.id === zoneId);
  if (targetDropZone?.visibleWhen?.type === 'apparatusPlaced' && targetDropZone.visibleWhen.apparatusId) {
    return targetDropZone.visibleWhen.apparatusId;
  }

  // 2. Spatial matching: if a reaction vessel is placed directly beneath/at this drop zone (same x coordinate)
  if (targetDropZone) {
    for (const [placedAppId, benchZoneId] of Object.entries(state.placedApparatus)) {
      const benchZone = config.dropZones.find(z => z.id === benchZoneId);
      if (benchZone && Math.abs(benchZone.position.x - targetDropZone.position.x) < 5) {
        const app = config.apparatus.find(a => a.id === placedAppId);
        if (app && REACTION_VESSEL_COMPONENTS.includes(app.component)) {
          return placedAppId;
        }
      }
    }
  }

  // 3. Exact ID substring match (e.g. zoneId contains the full apparatus ID)
  for (const app of config.apparatus) {
    if (!REACTION_VESSEL_COMPONENTS.includes(app.component)) continue;
    const appId = app.id.toLowerCase();
    if (zLower.includes(appId)) {
      return app.id;
    }
  }

  // 4. Letter suffix matching (e.g. 'beaker-a-mouth' -> 'Beaker A' or 'beaker-solution', 'beaker-b' -> 'Beaker B', 'beaker-c' -> 'Beaker C')
  for (const letter of ['a', 'b', 'c', 'd', '1', '2', '3']) {
    if (zLower.includes(`-${letter}-`) || zLower.endsWith(`-${letter}`) || zLower.includes(`_${letter}_`) || zLower.endsWith(`_${letter}`)) {
      for (const app of config.apparatus) {
        if (!REACTION_VESSEL_COMPONENTS.includes(app.component)) continue;
        const appLabel = (app.label || '').toLowerCase();
        const appId = app.id.toLowerCase();
        const initLabel = String(app.initialProps?.label || '').toLowerCase();
        if (
          appLabel.includes(`beaker ${letter}`) ||
          appLabel.includes(`flask ${letter}`) ||
          appLabel.includes(`tube ${letter}`) ||
          initLabel.includes(`beaker ${letter}`) ||
          initLabel.includes(`flask ${letter}`) ||
          initLabel.includes(`tube ${letter}`) ||
          appId.includes(`-${letter}`) ||
          appId.includes(`_${letter}`)
        ) {
          return app.id;
        }
      }
    }
  }

  // 5. Check if zoneId directly matches a placed vessel
  for (const [appId, placedZone] of Object.entries(state.placedApparatus)) {
    if (placedZone === zoneId) {
      const app = config.apparatus.find(a => a.id === appId);
      if (app && REACTION_VESSEL_COMPONENTS.includes(app.component)) {
        return appId;
      }
    }
  }

  // 6. Generic vessel component match if there's a placed vessel of that type
  for (const app of config.apparatus) {
    if (!REACTION_VESSEL_COMPONENTS.includes(app.component)) continue;
    const appComp = app.component.toLowerCase();
    if (zLower.includes(appComp)) {
      const placedMatch = Object.keys(state.placedApparatus).find(id => {
        const a = config.apparatus.find(x => x.id === id);
        return a?.component === app.component;
      });
      if (placedMatch) return placedMatch;
      return app.id;
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
      let val: number;
      if (condition.key.includes('+')) {
        const parts = condition.key.split('+').map(p => p.trim());
        const sum = parts.reduce((acc, p) => acc + (Number(state.variables[p]) || 0), 0);
        val = Math.round(sum * 1000) / 1000;
      } else {
        val = state.variables[condition.key] ?? 0;
      }
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
          flags: {
            ...newState.flags,
            [effect.key]: effect.value,
            ...(effect.key === 'buretteFilled' && effect.value === true
              ? { buretteEmpty: false, 'burette-filled': true }
              : effect.key === 'buretteFilled' && effect.value === false
              ? { buretteEmpty: true, 'burette-filled': false }
              : {}),
          },
          variables: {
            ...newState.variables,
            ...(effect.key === 'buretteFilled' && effect.value === true ? { volumeAdded: 0, stopcockOpen: 0 } : {}),
          },
        };
        break;

      case 'setVariable': {
        const existingVal = newState.variables[effect.key];
        const isTitrationVol = typeof existingVal === 'number' && typeof effect.value === 'number' && [
          'stdEdtaVolume', 'sampleEdtaVolume', 'kohVolume', 'thiosulphateVolume',
          'volumeA', 'volumeB', 'volumeY', 'volumeZ', 'naohVolume', 'buretteReading', 'volumeAdded'
        ].includes(effect.key);

        if (isTitrationVol && existingVal > (effect.value as number) + 0.05) {
          // Preserve the student's actual overshot reading!
          break;
        }

        newState = {
          ...newState,
          variables: { ...newState.variables, [effect.key]: effect.value },
        };
        break;
      }

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
    variables: { ...state.variables, stopcockOpen: 0 },
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

      case 'SET_FLAG':
        return {
          ...state,
          flags: {
            ...state.flags,
            [action.payload.flag]: action.payload.value,
          },
        };

      // ── Drag & Drop ──
      case 'DROP_ITEM': {
        const { itemId, zoneId } = action.payload;

        // Find matching interactions
        const interactions = findMatchingInteractions(config, 'drop', itemId, zoneId);

        if (interactions.length === 0) {
          // Universal burette refill check: If student dropped titrant to refill an empty or depleted burette
          const isBuretteTarget = zoneId === 'burette-top-zone' || zoneId === 'burette-refill-zone' || zoneId === 'burette' || zoneId.includes('burette');
          const isTitrantItem = itemId.includes('titrant') || itemId.includes('edta') || itemId.includes('naoh') || itemId.includes('h2so4') || itemId.includes('koh') || itemId.includes('thiosulphate') || itemId.includes('agno3');
          const buretteNeedsRefill = state.flags.buretteEmpty === true || state.flags.buretteFilled === false || ((state.apparatusProps['burette']?.liquidLevel as number ?? 0) <= 0.05);

          if (isBuretteTarget && isTitrantItem && buretteNeedsRefill) {
            const titrant = detectBuretteTitrant(config, state);
            const titrantColor = CHEMICAL_DATABASE[titrant.substanceId]?.baseColor || 'rgba(56, 189, 248, 0.45)';
            const refillAppProps = { ...state.apparatusProps };
            refillAppProps['burette'] = {
              ...(refillAppProps['burette'] ?? {}),
              liquidLevel: 1.0,
              liquidColor: titrantColor,
              label: `${titrant.substanceId ? titrant.substanceId.toUpperCase() : 'Titrant'} (0.00 mL)`,
            };

            const refilledVars: Record<string, number> = {
              ...state.variables,
              volumeAdded: 0,
              stopcockOpen: 0,
            };

            const titrationKeys = ['stdEdtaVolume', 'sampleEdtaVolume', 'kohVolume', 'thiosulphateVolume', 'volumeA', 'volumeB', 'volumeY', 'volumeZ', 'naohVolume', 'buretteReading'];
            for (const tk of titrationKeys) {
              if (refilledVars[tk] !== undefined && !state.flags['titrationDone'] && !state.flags['v1EndpointBlue']) {
                refilledVars[tk] = 0;
              }
            }

            return {
              ...state,
              variables: refilledVars,
              flags: {
                ...state.flags,
                buretteFilled: true,
                'burette-filled': true,
                buretteEmpty: false,
                isDropAnimating: false,
              },
              apparatusProps: refillAppProps,
              completedActions: [...new Set([...state.completedActions, 'fill-burette', 'refill-burette'])],
              animations: { ...state.animations, isPouring: true },
              activeAnimationInteractionId: null,
              activeAnimation: {
                type: 'pour',
                sourceApparatusId: itemId,
                targetZoneId: zoneId,
                color: titrantColor,
              },
              mistakes: [
                ...state.mistakes,
                '✓ Burette refilled with fresh titrant solution to 0.00 mL mark. Ready for accurate titration.',
              ],
            };
          }

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

        // Process matching interaction whose conditions are satisfied, or fallback to first
        const interaction =
          interactions.find(i => {
            if (i.guard && evaluateCondition(i.guard.condition, state)) return false;
            if (!i.conditions) return true;
            return i.conditions.every(c => evaluateCondition(c, state));
          }) ?? interactions[0];

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

        // Mark action as completed (deferred to ANIMATION_COMPLETE if effects are deferred)
        if (interaction.completesAction && !interaction.animation?.effectsAfterAnimation) {
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

        // Process matching interaction whose conditions are satisfied, or fallback to first
        const interaction =
          interactions.find(i => {
            if (i.guard && evaluateCondition(i.guard.condition, state)) return false;
            if (!i.conditions) return true;
            return i.conditions.every(c => evaluateCondition(c, state));
          }) ?? interactions[0];

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

        if (interaction.completesAction && !interaction.animation?.effectsAfterAnimation) {
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

        const currentBuretteLevel = (state.apparatusProps['burette']?.liquidLevel as number) ?? (state.flags.buretteFilled ? 1.0 : 0);
        const currentVolAdded = (state.variables['volumeAdded'] as number) ?? 0;
        const isBuretteFilled = Boolean(
          hasBurette &&
          currentBuretteLevel > 0.02 &&
          currentVolAdded < 49.9 &&
          state.flags.buretteEmpty !== true &&
          state.flags.buretteFilled !== false &&
          state.flags['burette-filled'] !== false &&
          (state.flags.buretteFilled === true || state.flags['burette-filled'] === true)
        );

        if (!isBuretteFilled && action.payload.openAmount > 0) {
          return {
            ...state,
            variables: { ...state.variables, stopcockOpen: 0 },
            mistakes: [
              ...state.mistakes,
              'Burette is empty! You have drained all titrant solution. Refill the burette to 0.00 mL with titrant before opening the stopcock.',
            ],
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

        const currentBuretteLevel = (state.apparatusProps['burette']?.liquidLevel as number) ?? (state.flags.buretteFilled ? 1.0 : 0);
        const currentVolAdded = (state.variables['volumeAdded'] as number) ?? 0;
        const isBuretteFilled = Boolean(
          hasBurette &&
          currentBuretteLevel > 0.02 &&
          currentVolAdded < 49.9 &&
          state.flags.buretteEmpty !== true &&
          state.flags.buretteFilled !== false &&
          state.flags['burette-filled'] !== false &&
          (state.flags.buretteFilled === true || state.flags['burette-filled'] === true)
        );

        if (!isBuretteFilled) {
          return {
            ...state,
            variables: { ...state.variables, stopcockOpen: 0 },
            flags: { ...state.flags, isDropAnimating: false, buretteFilled: false, 'burette-filled': false, buretteEmpty: true },
          };
        }

        const maxFlowRate = state.variables['maxFlowRate'] ?? 0.08; // mL/s default (calibrated for slow, focused, high-precision titration)
        const deltaSeconds = action.payload.deltaMs / 1000;
        const flowAmount = stopcockOpen * maxFlowRate * deltaSeconds;
        const newVariables = { ...state.variables };
        const currentVolume = newVariables['volumeAdded'] ?? 0;

        const newVolume = Math.round((currentVolume + flowAmount) * 1000) / 1000;
        newVariables['volumeAdded'] = newVolume;

        // Dynamically update receiving vessel's liquid level & burette's level!
        const buretteLevel = Math.max(0, Math.min(1.0, (50 - newVolume) / 50));

        // If burette runs dry (50 mL capacity reached or liquid depleted), stop flowing immediately and require refill!
        if (newVolume >= 50 || buretteLevel <= 0.01) {
          const emptyProps = { ...state.apparatusProps };
          emptyProps['burette'] = {
            ...(emptyProps['burette'] ?? {}),
            liquidLevel: 0,
            label: 'Burette (EMPTY - Refill to 0.00 mL Required)',
          };

          const drainMistakeMsg = 'Burette is completely empty! All titrant solution has been drained. You must refill the burette with titrant to 0.00 mL to take accurate titration readings.';
          const updatedMistakes = state.mistakes.includes(drainMistakeMsg)
            ? state.mistakes
            : [...state.mistakes, drainMistakeMsg];

          // Unset 'fill-burette' from completed actions so student must refill before completing step
          const updatedCompletedActions = state.completedActions.filter(a => a !== 'fill-burette');

          return {
            ...state,
            variables: {
              ...newVariables,
              stopcockOpen: 0,
              volumeAdded: 50,
            },
            flags: {
              ...state.flags,
              buretteFilled: false,
              'burette-filled': false,
              buretteEmpty: true,
              isDropAnimating: false,
            },
            apparatusProps: emptyProps,
            completedActions: updatedCompletedActions,
            mistakes: updatedMistakes,
          };
        }

        // Automatically increment specific experiment titration volume variables if they exist in variables
        const titrationKeys = [
          'kohVolume',
          'stdEdtaVolume',
          'sampleEdtaVolume',
          'volumeA',
          'volumeB',
          'volumeY',
          'volumeZ',
          'thiosulphateVolume',
          'naohVolume',
          'buretteReading',
        ];
        for (const key of titrationKeys) {
          if (newVariables[key] !== undefined) {
            // Guard against advancing subsequent titration variables before their step
            if (key === 'stdEdtaVolume' && state.flags['flaskCleared']) continue;
            if (key === 'sampleEdtaVolume' && (!state.flags['v1EndpointBlue'] || !state.flags['buretteRefilled'])) continue;
            if (key === 'volumeA' && state.flags['methylOrangeAdded']) continue;
            if (key === 'volumeB' && (!state.flags['pEndpointReached'] || !state.flags['methylOrangeAdded'])) continue;
            if (key === 'volumeY' && (!state.flags['methylOrangeAdded'] || state.flags['phenolphthaleinAdded'])) continue;
            if (key === 'volumeZ') {
              if (!state.flags['moEndpointReached'] || !state.flags['phenolphthaleinAdded']) continue;
              if ((newVariables['volumeZ'] as number) === 0) {
                newVariables['volumeZ'] = newVariables['volumeY'] ?? newVariables['volumeAdded'] ?? 0;
              }
            }

            newVariables[key] = Math.round(((newVariables[key] as number) + flowAmount) * 1000) / 1000;
          }
        }

        const apparatusProps = { ...state.apparatusProps };
        apparatusProps['burette'] = {
          ...(apparatusProps['burette'] ?? {}),
          liquidLevel: buretteLevel,
        };

        const receivingVesselId =
          findTargetVesselId('flask-mouth-zone', config, state) ??
          findTargetVesselId('flask-sample-zone', config, state) ??
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

        let newStateResult: ExperimentState = {
          ...state,
          variables: newVariables,
          apparatusProps,
          vesselMixtures: mixtures,
          flags: { ...state.flags, isDropAnimating: stopcockOpen > 0 },
        };

        // Track unswirled titrant addition during flow
        const isCurrentlySwirling = Boolean(newStateResult.flags['swirling'] || newStateResult.flags['stirring']);
        if (stopcockOpen > 0 && !isCurrentlySwirling) {
          const prevUnswirled = (newStateResult.variables['unswirledVolume'] as number) ?? 0;
          const newUnswirled = prevUnswirled + flowAmount;
          newVariables['unswirledVolume'] = newUnswirled;
          if (newUnswirled > 1.2 && !newStateResult.flags['titratedWithoutSwirling']) {
            newStateResult.flags['titratedWithoutSwirling'] = true;
            const swirlPenaltyMsg = 'Titration performed without continuous swirling: Flask was not agitated while dispensing titrant, leading to localized concentration errors.';
            if (!newStateResult.mistakes.includes(swirlPenaltyMsg)) {
              newStateResult.mistakes = [...newStateResult.mistakes, swirlPenaltyMsg];
            }
          }
        }

        // Check if any burette-driven titration interactions (e.g. endpoint color transitions) have their conditions met
        for (const inter of config.interactions) {
          if (
            inter.trigger.type === 'drop' &&
            (inter.trigger.source === 'burette' || inter.trigger.source === 'micro-burette') &&
            inter.completesAction &&
            !newStateResult.completedActions.includes(inter.completesAction)
          ) {
            // Guard: Cannot trigger a titration endpoint if the burette ran out of solution or is empty!
            const buretteHasSolution = (newStateResult.apparatusProps['burette']?.liquidLevel as number ?? 0) > 0.02 &&
              newStateResult.flags.buretteFilled !== false &&
              newStateResult.flags.buretteEmpty !== true;

            if (!buretteHasSolution) {
              continue;
            }

            const conditionsMet = !inter.conditions || inter.conditions.every(c => evaluateCondition(c, newStateResult));
            const guardTriggered = inter.guard && evaluateCondition(inter.guard.condition, newStateResult);
            if (conditionsMet && !guardTriggered) {
              const isFastFlow = stopcockOpen >= 0.75;
              const notSwirled = !newStateResult.flags['swirling'] && !newStateResult.flags['stirring'];

              // Detect overshoot against condition target
              const varCondition = inter.conditions?.find(c => c.type === 'variable' && (c.op === '>=' || c.op === '>'));
              let overshootMl = 0;
              if (varCondition && varCondition.type === 'variable') {
                const actualVal = (newStateResult.variables[varCondition.key] as number) ?? 0;
                const idealVal = varCondition.value;
                if (actualVal > idealVal + 0.08 || isFastFlow) {
                  overshootMl = Math.max(0.15, Math.round((actualVal - idealVal) * 100) / 100);
                }
              }

              newStateResult = applyEffects(newStateResult, inter.effects);
              let updatedMistakes = [...newStateResult.mistakes];
              let updatedFlags = { ...newStateResult.flags };
              let updatedVars = { ...newStateResult.variables };

              if (overshootMl > 0 || isFastFlow) {
                const finalOvershoot = overshootMl || 0.25;
                updatedFlags['titrationOvershot'] = true;
                updatedVars['titrationOvershootMl'] = finalOvershoot;
                const overshootMsg = `Rapid titrant addition (overshot by +${finalOvershoot.toFixed(2)} mL): Burette stopcock was open at high flow without dropwise control, missing the perfect endpoint.`;
                if (!updatedMistakes.includes(overshootMsg)) {
                  updatedMistakes.push(overshootMsg);
                }

                // Visual consequence: solution color shifts to intense over-titrated shade
                if (receivingVesselId && newStateResult.apparatusProps[receivingVesselId]?.liquidColor) {
                  const currCol = String(newStateResult.apparatusProps[receivingVesselId].liquidColor);
                  const isPinkish = currCol.includes('244, 114, 182') || currCol.includes('pink') || currCol.includes('245, 158, 11');
                  const isBluish = currCol.includes('14, 165, 233') || currCol.includes('56, 189, 248') || currCol.includes('blue');

                  const overColor = isPinkish
                    ? 'rgba(190, 24, 93, 0.96)' // Deep over-titrated magenta
                    : isBluish
                      ? 'rgba(91, 33, 182, 0.95)' // Deep over-titrated purple-indigo
                      : currCol;

                  const existingLabel = newStateResult.apparatusProps[receivingVesselId].label || 'Endpoint';
                  newStateResult.apparatusProps[receivingVesselId] = {
                    ...newStateResult.apparatusProps[receivingVesselId],
                    liquidColor: overColor,
                    label: `${existingLabel} (Overshot +${finalOvershoot.toFixed(2)} mL)`,
                  };
                }
              }

              if (notSwirled && !updatedFlags['titratedWithoutSwirling']) {
                updatedFlags['titratedWithoutSwirling'] = true;
                const swirlPenaltyMsg = 'Titration performed without continuous swirling: Flask was not agitated while dispensing titrant, leading to localized concentration errors.';
                if (!updatedMistakes.includes(swirlPenaltyMsg)) {
                  updatedMistakes.push(swirlPenaltyMsg);
                }
              }

              newStateResult = {
                ...newStateResult,
                variables: updatedVars,
                flags: updatedFlags,
                mistakes: updatedMistakes,
                completedActions: [...newStateResult.completedActions, inter.completesAction],
              };
            }
          }
        }

        return newStateResult;
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

        const currentBuretteLevel = (state.apparatusProps['burette']?.liquidLevel as number) ?? (state.flags.buretteFilled ? 1.0 : 0);
        const currentVolAdded = (state.variables['volumeAdded'] as number) ?? 0;
        const isBuretteFilled = Boolean(
          hasBurette &&
          currentBuretteLevel > 0.02 &&
          currentVolAdded < 49.9 &&
          state.flags.buretteEmpty !== true &&
          state.flags.buretteFilled !== false &&
          state.flags['burette-filled'] !== false &&
          (state.flags.buretteFilled === true || state.flags['burette-filled'] === true)
        );

        if (!isBuretteFilled) {
          return {
            ...state,
            mistakes: [...state.mistakes, 'Burette is empty! You have drained all titrant solution. Refill the burette to 0.00 mL with titrant before dispensing drops.'],
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
          'volumeY',
          'volumeZ',
          'thiosulphateVolume',
          'naohVolume',
          'buretteReading',
        ];
        for (const key of titrationKeys) {
          if (newVariables[key] !== undefined) {
            if (key === 'stdEdtaVolume' && state.flags['flaskCleared']) continue;
            if (key === 'sampleEdtaVolume' && (!state.flags['v1EndpointBlue'] || !state.flags['buretteRefilled'])) continue;
            if (key === 'volumeA' && state.flags['methylOrangeAdded']) continue;
            if (key === 'volumeB' && (!state.flags['pEndpointReached'] || !state.flags['methylOrangeAdded'])) continue;
            if (key === 'volumeY' && (!state.flags['methylOrangeAdded'] || state.flags['phenolphthaleinAdded'])) continue;
            if (key === 'volumeZ') {
              if (!state.flags['moEndpointReached'] || !state.flags['phenolphthaleinAdded']) continue;
              if ((newVariables['volumeZ'] as number) === 0) {
                newVariables['volumeZ'] = newVariables['volumeY'] ?? newVariables['volumeAdded'] ?? 0;
              }
            }

            newVariables[key] = Math.round(((newVariables[key] as number) + dropVol) * 1000) / 1000;
          }
        }

        const buretteLevel = Math.max(0, Math.min(1.0, (50 - newVolume) / 50));

        // If burette runs dry on drop addition, stop and require refill!
        if (newVolume >= 50 || buretteLevel <= 0.01) {
          const emptyProps = { ...state.apparatusProps };
          emptyProps['burette'] = {
            ...(emptyProps['burette'] ?? {}),
            liquidLevel: 0,
            label: 'Burette (EMPTY - Refill to 0.00 mL Required)',
          };

          const drainMistakeMsg = 'Burette is completely empty! All titrant solution has been drained. You must refill the burette with titrant to 0.00 mL to take accurate titration readings.';
          const updatedMistakes = state.mistakes.includes(drainMistakeMsg)
            ? state.mistakes
            : [...state.mistakes, drainMistakeMsg];

          const updatedCompletedActions = state.completedActions.filter(a => a !== 'fill-burette');

          return {
            ...state,
            variables: {
              ...newVariables,
              stopcockOpen: 0,
              volumeAdded: 50,
            },
            flags: {
              ...state.flags,
              buretteFilled: false,
              'burette-filled': false,
              buretteEmpty: true,
              isDropAnimating: false,
            },
            apparatusProps: emptyProps,
            completedActions: updatedCompletedActions,
            mistakes: updatedMistakes,
          };
        }

        const apparatusProps = { ...state.apparatusProps };
        apparatusProps['burette'] = {
          ...(apparatusProps['burette'] ?? {}),
          liquidLevel: buretteLevel,
        };

        const receivingVesselId =
          findTargetVesselId('flask-mouth-zone', config, state) ??
          findTargetVesselId('flask-sample-zone', config, state) ??
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

        let newDropStateResult: ExperimentState = {
          ...state,
          variables: newVariables,
          apparatusProps,
          vesselMixtures: mixtures,
          flags: { ...state.flags, isDropAnimating: true },
        };

        // Check if any burette-driven titration interactions (e.g. endpoint color transitions) have their conditions met
        for (const inter of config.interactions) {
          if (
            inter.trigger.type === 'drop' &&
            (inter.trigger.source === 'burette' || inter.trigger.source === 'micro-burette') &&
            inter.completesAction &&
            !newDropStateResult.completedActions.includes(inter.completesAction)
          ) {
            // Guard: Cannot trigger a titration endpoint if the burette ran out of solution or is empty!
            const buretteHasSolution = (newDropStateResult.apparatusProps['burette']?.liquidLevel as number ?? 0) > 0.02 &&
              newDropStateResult.flags.buretteFilled !== false &&
              newDropStateResult.flags.buretteEmpty !== true;

            if (!buretteHasSolution) {
              continue;
            }

            const conditionsMet = !inter.conditions || inter.conditions.every(c => evaluateCondition(c, newDropStateResult));
            const guardTriggered = inter.guard && evaluateCondition(inter.guard.condition, newDropStateResult);
            if (conditionsMet && !guardTriggered) {
              newDropStateResult = applyEffects(newDropStateResult, inter.effects);
              newDropStateResult = {
                ...newDropStateResult,
                completedActions: [...newDropStateResult.completedActions, inter.completesAction],
              };
            }
          }
        }

        return newDropStateResult;
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
                    if (event.completesAction && !newState.completedActions.includes(event.completesAction)) {
                      newState = {
                        ...newState,
                        completedActions: [...newState.completedActions, event.completesAction],
                      };
                    }
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
