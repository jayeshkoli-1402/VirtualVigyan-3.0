import { EQUIVALENCE_VOLUME_ML, calculateExpectedConcentration } from './chemistryRules';
import { VALID_DROPS } from './titrationState';
import type { TitrationState } from './titrationState';

/**
 * Deterministic, rule-based mistake detection.
 * These are NOT AI/ML — they are explicit threshold checks.
 */

const COLOR_CHANGE_VISIBLE_ML = 22.5;
const CLEAR_OVERSHOOT_ML = 27;

export type ValidationResult = {
  allowed: boolean;
  message: string | null;
};

/**
 * Rule: Validate whether a dragged item can be dropped on a specific zone.
 */
export function canDropOnZone(itemId: string, zoneId: string): ValidationResult {
  const validItems = VALID_DROPS[zoneId];
  if (!validItems || !validItems.includes(itemId)) {
    // Generate a helpful rejection message based on the zone
    const zoneMessages: Record<string, string> = {
      'stand-clamp-zone': "That doesn't go there — try the burette here.",
      'stand-base-zone': "That doesn't go there — the conical flask goes on the base.",
      'hcl-bench-zone': "Place the HCl Stock bottle here on the bench first.",
      'flask-zone': "Only the pipette or indicator bottle can be used on the flask.",
      'burette-top-zone': "Only the NaOH bottle can be used to fill the burette.",
      'hcl-bottle-zone': "Drag the pipette here to draw acid.",
    };
    return {
      allowed: false,
      message: zoneMessages[zoneId] || "That item doesn't belong there.",
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: HCl bottle must be placed on the bench before pipette can draw acid from it.
 */
export function canDrawPipette(hclPlaced: boolean): ValidationResult {
  if (!hclPlaced) {
    return {
      allowed: false,
      message: 'Place the HCl Stock bottle on the lab bench first before drawing with the pipette.',
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: Check if the stopcock can be operated.
 * All pre-conditions must be met: burette mounted+filled, flask placed+measured, indicator added.
 */
export function canOperateStopcock(state: TitrationState): ValidationResult {
  const missing: string[] = [];
  if (!state.buretteMounted) missing.push('mount the burette');
  if (!state.buretteFilled) missing.push('fill the burette with NaOH');
  if (!state.flaskPlaced) missing.push('place the flask');
  if (!state.acidMeasured) missing.push('measure acid into the flask');
  if (!state.hasIndicator) missing.push('add indicator to the flask');

  if (missing.length > 0) {
    return {
      allowed: false,
      message: `Cannot open the stopcock yet — you still need to: ${missing.join(', ')}.`,
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: Pipette must be filled before dispensing.
 */
export function canDispensePipette(pipetteFilled: boolean): ValidationResult {
  if (!pipetteFilled) {
    return {
      allowed: false,
      message: 'Draw liquid into the pipette first — drag it to the HCl bottle and press to fill.',
    };
  }
  return { allowed: true, message: null };
}

/**
 * Rule: Block "Mark Endpoint" if no visible color change has occurred yet.
 * Rule: Warn if volume is clearly past the correct endpoint (deep magenta).
 */
export function canMarkEndpoint(volumeAdded: number): ValidationResult {
  if (volumeAdded < COLOR_CHANGE_VISIBLE_ML) {
    return {
      allowed: false,
      message:
        'No colour change has been observed yet — keep titrating until you see a colour shift.',
    };
  }

  if (volumeAdded > CLEAR_OVERSHOOT_ML) {
    return {
      allowed: true, // allow marking, but give feedback
      message:
        "You've overshot the endpoint — try again and stop at the first persistent pale pink.",
    };
  }

  return { allowed: true, message: null };
}

/**
 * Evaluate how close the student's marked endpoint is to the true equivalence point.
 */
export type EndpointAccuracy = 'excellent' | 'good' | 'needs_practice';

export function evaluateEndpoint(markedVolume: number): {
  accuracy: EndpointAccuracy;
  deviation: number;
  label: string;
  explanation: string;
} {
  const deviation = Math.abs(markedVolume - EQUIVALENCE_VOLUME_ML);

  if (deviation <= 0.5) {
    return {
      accuracy: 'excellent',
      deviation,
      label: 'Excellent',
      explanation: `Your endpoint (${markedVolume.toFixed(1)} mL) was within ±0.5 mL of the true equivalence point (${EQUIVALENCE_VOLUME_ML} mL). Outstanding precision!`,
    };
  }

  if (deviation <= 1.5) {
    return {
      accuracy: 'good',
      deviation,
      label: 'Good',
      explanation: `Your endpoint (${markedVolume.toFixed(1)} mL) was within ±1.5 mL of the true equivalence point (${EQUIVALENCE_VOLUME_ML} mL). Good observation — with practice, you can narrow this further.`,
    };
  }

  return {
    accuracy: 'needs_practice',
    deviation,
    label: 'Needs Practice',
    explanation: `Your endpoint (${markedVolume.toFixed(1)} mL) was ${deviation.toFixed(1)} mL away from the true equivalence point (${EQUIVALENCE_VOLUME_ML} mL). The correct endpoint is the first persistent pale pink — not the deep color change.`,
  };
}

/**
 * Validate the student's calculated concentration against the value
 * implied by THEIR OWN marked volume (not the ground truth).
 * This rewards correct reasoning even if their hands-on endpoint was off.
 */
export function validateConcentration(
  studentAnswer: number,
  markedVolume: number
): {
  correct: boolean;
  expected: number;
  tolerance: number;
  workedFormula: string;
} {
  const expected = calculateExpectedConcentration(markedVolume);
  const tolerance = expected * 0.1; // ±10%

  const correct = Math.abs(studentAnswer - expected) <= tolerance;

  const workedFormula = `Unknown HCl concentration = (Volume NaOH × Molarity NaOH) / Volume HCl\n= (${markedVolume.toFixed(1)} mL × 0.1 M) / 25 mL\n= ${expected.toFixed(4)} M`;

  return { correct, expected, tolerance, workedFormula };
}
