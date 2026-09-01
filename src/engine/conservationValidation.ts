import { CONSERVATION_VALID_DROPS } from './conservationState';
import type { ConservationState } from './conservationState';

/**
 * Deterministic, rule-based mistake detection for the Conservation of Mass experiment.
 */

export type ValidationResult = {
  allowed: boolean;
  message: string | null;
};

/**
 * Rule: Validate whether a dragged item can be dropped on a specific zone.
 */
export function canDropOnZone(itemId: string, zoneId: string): ValidationResult {
  const validItems = CONSERVATION_VALID_DROPS[zoneId];
  if (!validItems || !validItems.includes(itemId)) {
    const zoneMessages: Record<string, string> = {
      'cons-bench-zone': "Place the Conical Flask on the lab bench here.",
      'cons-tube-stand-zone': "Place the Ignition Tube on the test tube stand here.",
      'cons-flask-zone': "Only the Na₂SO₄ bottle, Ignition Tube, or Rubber Cork can be used on the flask.",
      'cons-tube-fill-zone': "Drag the BaCl₂ bottle here to fill the ignition tube.",
      'cons-balance-zone': "Place the flask on the digital balance weighing pan.",
    };
    return {
      allowed: false,
      message: zoneMessages[zoneId] || "That item doesn't belong there.",
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: Flask must be on bench before pouring solution into it.
 */
export function canPourIntoFlask(state: ConservationState): ValidationResult {
  if (!state.flaskPlaced) {
    return {
      allowed: false,
      message: 'Place the Conical Flask on the bench first before pouring solutions.',
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: Ignition tube must be filled before suspending it.
 */
export function canSuspendTube(state: ConservationState): ValidationResult {
  if (!state.tubeFilled) {
    return {
      allowed: false,
      message: 'Fill the Ignition Tube with BaCl₂ solution first before placing it in the flask.',
    };
  }
  if (!state.na2so4Poured) {
    return {
      allowed: false,
      message: 'Pour Na₂SO₄ solution into the flask first before suspending the tube.',
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: Flask must have tube suspended before sealing with cork.
 */
export function canSealFlask(state: ConservationState): ValidationResult {
  if (!state.tubeSuspended) {
    return {
      allowed: false,
      message: 'Suspend the filled Ignition Tube inside the flask before sealing.',
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: Flask must be sealed before formal initial weighing.
 */
export function canWeigh(state: ConservationState): ValidationResult {
  if (!state.flaskSealed) {
    return {
      allowed: false,
      message: 'Seal the flask with the Rubber Cork before recording M₁. The system must be closed to verify mass conservation.',
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: SEQUENCE — Cannot mix before recording initial mass M1.
 */
export function canMixReactants(state: ConservationState): ValidationResult {
  if (!state.flaskSealed) {
    return {
      allowed: false,
      message: 'Open System Warning: Flask must be hermetically corked to prevent mass exchange.',
    };
  }
  if (state.initialMass === null) {
    return {
      allowed: false,
      message: 'Record the initial mass (M₁) of the sealed flask before inverting or mixing the solutions.',
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: Cannot weigh final mass before mixing.
 */
export function canWeighFinal(state: ConservationState): ValidationResult {
  if (!state.reactantsMixed) {
    return {
      allowed: false,
      message: 'Mix the reactants by inverting the flask before recording final mass M₂.',
    };
  }
  if (!state.hasObserved) {
    return {
      allowed: false,
      message: 'Observe the white precipitate formation before proceeding to record M₂.',
    };
  }
  return { allowed: true, message: null };
}

/**
 * Evaluate the student's ΔM calculation accuracy.
 */
export type CalculationAccuracy = 'excellent' | 'good' | 'needs_practice';

export function evaluateCalculation(
  studentDeltaM: number,
  expectedDeltaM: number,
  studentDeviation: number,
  expectedDeviation: number
): {
  accuracy: CalculationAccuracy;
  label: string;
  explanation: string;
} {
  const deltaMError = Math.abs(studentDeltaM - expectedDeltaM);
  const deviationError = Math.abs(studentDeviation - expectedDeviation);

  if (deltaMError <= 0.005 && deviationError <= 0.01) {
    return {
      accuracy: 'excellent',
      label: 'Excellent',
      explanation: `Your calculations are precise! ΔM = ${studentDeltaM.toFixed(2)} g (expected: ${expectedDeltaM.toFixed(2)} g). Mass is conserved within experimental tolerance, confirming Lavoisier's Law.`,
    };
  }

  if (deltaMError <= 0.02 && deviationError <= 0.05) {
    return {
      accuracy: 'good',
      label: 'Good',
      explanation: `Your calculations are close. ΔM = ${studentDeltaM.toFixed(2)} g (expected: ${expectedDeltaM.toFixed(2)} g). With practice, you can improve the precision of your arithmetic.`,
    };
  }

  return {
    accuracy: 'needs_practice',
    label: 'Needs Practice',
    explanation: `Your ΔM (${studentDeltaM.toFixed(2)} g) differs from the expected value (${expectedDeltaM.toFixed(2)} g). Review the formula: ΔM = |M₂ - M₁|. The key principle: in a closed system, mass is always conserved.`,
  };
}

/**
 * Compute overall score for the Conservation of Mass experiment.
 */
export function computeScore(state: ConservationState): number {
  let score = 0;
  const expectedDeltaM = state.initialMass !== null && state.finalMass !== null
    ? Math.abs(state.finalMass - state.initialMass)
    : 0;
  const expectedDeviation = state.initialMass !== null && state.finalMass !== null && state.initialMass > 0
    ? (expectedDeltaM / state.initialMass) * 100
    : 0;

  if (state.mistakes.length === 0) {
    score += 20;
  } else if (state.mistakes.length <= 2) {
    score += 10;
  }

  if (state.flaskSealed && state.initialMass !== null) {
    score += 15;
  }

  if (state.initialMass !== null && !state.mistakes.some(m => m.includes('initial mass'))) {
    score += 15;
  }

  if (state.reactantsMixed) {
    score += 10;
  }

  if (state.finalMass !== null) {
    score += 10;
  }

  if (state.studentDeltaM !== null) {
    const deltaMError = Math.abs(state.studentDeltaM - expectedDeltaM);
    if (deltaMError <= 0.005) {
      score += 15;
    } else if (deltaMError <= 0.02) {
      score += 8;
    }
  }

  if (state.studentDeviationPercent !== null) {
    const devError = Math.abs(state.studentDeviationPercent - expectedDeviation);
    if (devError <= 0.02) {
      score += 15;
    } else if (devError <= 0.1) {
      score += 8;
    }
  }

  return Math.min(100, score);
}
