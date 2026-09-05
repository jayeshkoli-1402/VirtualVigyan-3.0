/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Config-Driven Validation Engine
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Evaluates validation rules from experiment configs against
 *  the current state. Returns blocking/warning results.
 *
 *  All mistake detection is DETERMINISTIC and RULE-BASED.
 *  Never label this as "AI" or "ML" — it's explicit threshold checks.
 * ═══════════════════════════════════════════════════════════════════
 */

import type {
  ExperimentConfig,
  ExperimentState,
  ValidationRuleConfig,
} from './experimentConfig';
import { evaluateCondition } from './experimentRunner';

// ── Validation Result ────────────────────────────────────────────

export type ValidationResult = {
  ruleId: string;
  allowed: boolean;
  message: string;
};

// ── Validate a Trigger ───────────────────────────────────────────

/**
 * Run all validation rules matching a given trigger against the current state.
 *
 * @param config - Experiment config containing validation rules
 * @param state - Current experiment state
 * @param trigger - Trigger string to match (e.g., 'drop:burette→clamp-zone', 'action:markEndpoint')
 * @returns Array of validation results (empty if all rules pass)
 */
export function validateTrigger(
  config: ExperimentConfig,
  state: ExperimentState,
  trigger: string,
): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const rule of config.validation) {
    // Match trigger — support exact match and wildcard patterns
    if (!matchesTrigger(rule.trigger, trigger)) continue;

    // Evaluate the rule's condition — if TRUE, the mistake has occurred
    const conditionMet = evaluateCondition(rule.condition, state);
    if (!conditionMet) continue;

    results.push({
      ruleId: rule.id,
      allowed: !rule.blocking,
      message: rule.message,
    });
  }

  return results;
}

/**
 * Check if a rule's trigger pattern matches the current trigger.
 *
 * Supported patterns:
 * - Exact match: 'action:markEndpoint' matches 'action:markEndpoint'
 * - Wildcard: 'drop:*' matches any drop trigger
 * - 'always' matches every trigger
 */
function matchesTrigger(pattern: string, trigger: string): boolean {
  if (pattern === 'always') return true;
  if (pattern === trigger) return true;

  // Wildcard: 'drop:*' matches 'drop:burette→clamp-zone'
  if (pattern.endsWith(':*')) {
    const prefix = pattern.slice(0, -1); // 'drop:'
    return trigger.startsWith(prefix);
  }

  return false;
}


// ── Validate Drop ────────────────────────────────────────────────

/**
 * Convenience: validate a drag-and-drop action.
 *
 * Checks:
 * 1. Is the item accepted by the target zone? (from config.dropZones)
 * 2. Do any validation rules block this drop?
 *
 * Returns the first blocking result, or null if the drop is allowed.
 */
export function validateDrop(
  config: ExperimentConfig,
  state: ExperimentState,
  itemId: string,
  zoneId: string,
): ValidationResult | null {
  // 1. Check zone acceptance
  const zone = config.dropZones.find(z => z.id === zoneId);
  if (!zone) {
    return {
      ruleId: '_unknown_zone',
      allowed: false,
      message: "That's not a valid drop zone.",
    };
  }

  if (!zone.accepts.includes(itemId)) {
    return {
      ruleId: '_wrong_item',
      allowed: false,
      message: zone.rejectMessage ?? `That item doesn't belong there.`,
    };
  }

  // 2. Check validation rules
  const trigger = `drop:${itemId}→${zoneId}`;
  const results = validateTrigger(config, state, trigger);

  // Return first blocking result
  const blocking = results.find(r => !r.allowed);
  if (blocking) return blocking;

  // Return first warning (non-blocking)
  const warning = results.find(r => r.allowed && r.message);
  if (warning) return warning;

  return null;
}


// ── Validate Action ──────────────────────────────────────────────

/**
 * Convenience: validate a named action (e.g., 'markEndpoint', 'submitCalculation').
 */
export function validateAction(
  config: ExperimentConfig,
  state: ExperimentState,
  actionId: string,
): ValidationResult | null {
  const trigger = `action:${actionId}`;
  const results = validateTrigger(config, state, trigger);

  const blocking = results.find(r => !r.allowed);
  if (blocking) return blocking;

  const warning = results.find(r => r.allowed && r.message);
  return warning ?? null;
}


// ── Validate Step Entry ──────────────────────────────────────────

/**
 * Check validation rules when entering a new step.
 */
export function validateStepEntry(
  config: ExperimentConfig,
  state: ExperimentState,
  stepId: string,
): ValidationResult[] {
  const trigger = `step:${stepId}`;
  return validateTrigger(config, state, trigger);
}


// ── Get All Active Warnings ──────────────────────────────────────

/**
 * Check all 'always' rules to get current warnings/messages.
 * Useful for persistent UI indicators (e.g., "stopcock is locked").
 */
export function getActiveWarnings(
  config: ExperimentConfig,
  state: ExperimentState,
): ValidationResult[] {
  return validateTrigger(config, state, '_always_check');
}


// ── Build Validation Summary ─────────────────────────────────────

/**
 * Generate a summary of all validation rules for debugging/display.
 */
export function describeValidationRules(
  config: ExperimentConfig,
): Array<{ id: string; trigger: string; message: string; blocking: boolean }> {
  return config.validation.map((rule: ValidationRuleConfig) => ({
    id: rule.id,
    trigger: rule.trigger,
    message: rule.message,
    blocking: rule.blocking,
  }));
}
