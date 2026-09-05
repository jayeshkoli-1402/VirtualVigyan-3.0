/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Config-Driven Scoring Engine
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Evaluates scoring rubrics from experiment configs against
 *  the final experiment state. Returns score breakdown + total.
 *
 *  All scoring is DETERMINISTIC and RULE-BASED.
 * ═══════════════════════════════════════════════════════════════════
 */

import type {
  ExperimentConfig,
  ExperimentState,
  ScoringCategory,
  ScoringEvaluator,
  CalculationField,
} from './experimentConfig';
import { computeFormula } from './chemistryLib';


// ── Score Result ─────────────────────────────────────────────────

export type ScoreResult = {
  /** Total score (sum of all categories, capped at 100) */
  totalScore: number;

  /** Max possible score */
  maxScore: number;

  /** Breakdown by category */
  breakdown: CategoryResult[];

  /** Overall grade label */
  grade: 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Practice';

  /** Overall feedback message */
  feedback: string;
};

export type CategoryResult = {
  /** Category name */
  name: string;

  /** Points awarded */
  points: number;

  /** Maximum points */
  maxPoints: number;

  /** Explanation of how points were calculated */
  explanation: string;
};


// ── Score Computation ────────────────────────────────────────────

/**
 * Compute the full score for an experiment from its config and final state.
 */
export function computeScore(
  config: ExperimentConfig,
  state: ExperimentState,
): ScoreResult {
  const breakdown: CategoryResult[] = config.scoring.map(category =>
    evaluateCategory(category, state, config)
  );

  const totalScore = Math.min(
    100,
    breakdown.reduce((sum, c) => sum + c.points, 0)
  );
  const maxScore = breakdown.reduce((sum, c) => sum + c.maxPoints, 0);

  const grade = getGrade(totalScore);
  const feedback = generateFeedback(totalScore, breakdown);

  return { totalScore, maxScore, breakdown, grade, feedback };
}


// ── Category Evaluation ──────────────────────────────────────────

function evaluateCategory(
  category: ScoringCategory,
  state: ExperimentState,
  config: ExperimentConfig,
): CategoryResult {
  const { points, explanation } = evaluateSingle(category.evaluator, state, config);
  const clampedPoints = Math.min(category.maxPoints, Math.max(0, points));

  return {
    name: category.name,
    points: clampedPoints,
    maxPoints: category.maxPoints,
    explanation,
  };
}

function evaluateSingle(
  evaluator: ScoringEvaluator,
  state: ExperimentState,
  config: ExperimentConfig,
): { points: number; explanation: string } {

  switch (evaluator.type) {

    // ── Threshold Check ──
    case 'thresholdCheck': {
      const value = state.variables[evaluator.variable] ?? 0;
      for (const threshold of evaluator.thresholds) {
        let matches = false;
        switch (threshold.condition) {
          case 'lte': matches = value <= threshold.value; break;
          case 'gte': matches = value >= threshold.value; break;
          case 'eq':  matches = value === threshold.value; break;
          case 'between':
            matches = value >= threshold.value && value <= (threshold.upperValue ?? threshold.value);
            break;
        }
        if (matches) {
          return {
            points: threshold.points,
            explanation: `${evaluator.variable} = ${value.toFixed(2)} → ${threshold.points} points`,
          };
        }
      }
      return { points: 0, explanation: `${evaluator.variable} = ${value.toFixed(2)} → no threshold matched` };
    }

    // ── Boolean Check ──
    case 'booleanCheck': {
      const flagValue = state.flags[evaluator.flag] ?? false;
      const pts = flagValue ? evaluator.truePoints : (evaluator.falsePoints ?? 0);
      return {
        points: pts,
        explanation: flagValue
          ? `${evaluator.flag} ✓ → ${pts} points`
          : `${evaluator.flag} ✗ → ${pts} points`,
      };
    }

    // ── Accuracy Check ──
    case 'accuracyCheck': {
      const studentVal = state.variables[evaluator.studentVariable] ?? 0;
      const expectedVal = state.variables[evaluator.expectedVariable] ?? 0;
      const deviation = Math.abs(studentVal - expectedVal);

      // Check tiers (should be sorted by maxDeviation ascending)
      const sortedTiers = [...evaluator.tiers].sort((a, b) => a.maxDeviation - b.maxDeviation);
      for (const tier of sortedTiers) {
        if (deviation <= tier.maxDeviation) {
          return {
            points: tier.points,
            explanation: `Deviation = ${deviation.toFixed(2)} (within ±${tier.maxDeviation}) → ${tier.points} points`,
          };
        }
      }

      // Beyond all tiers
      const lastTier = sortedTiers[sortedTiers.length - 1];
      return {
        points: 0,
        explanation: `Deviation = ${deviation.toFixed(2)} (beyond ±${lastTier?.maxDeviation ?? 0}) → 0 points`,
      };
    }

    // ── Mistake Count ──
    case 'mistakeCount': {
      const count = state.mistakes.length;
      if (count === 0) {
        return {
          points: evaluator.zeroMistakePoints,
          explanation: `No mistakes → ${evaluator.zeroMistakePoints} points`,
        };
      }
      if (evaluator.ranges) {
        const sortedRanges = [...evaluator.ranges].sort((a, b) => a.maxMistakes - b.maxMistakes);
        for (const range of sortedRanges) {
          if (count <= range.maxMistakes) {
            return {
              points: range.points,
              explanation: `${count} mistake(s) (within ${range.maxMistakes}) → ${range.points} points`,
            };
          }
        }
      }
      return { points: 0, explanation: `${count} mistake(s) → 0 points` };
    }

    // ── Calculation Correct ──
    case 'calculationCorrect': {
      const field = config.calculation?.fields.find(
        (f: CalculationField) => f.id === evaluator.fieldId
      );
      if (!field) {
        return { points: 0, explanation: 'Calculation field not found' };
      }

      const studentAnswer = state.studentAnswers[field.id] ?? 0;
      const expectedValue =
        field.expectedValue !== undefined
          ? field.expectedValue
          : computeFormula(field.expectedFormulaName ?? '', state.variables);

      const tolerance = field.toleranceType === 'absolute'
        ? field.tolerance
        : expectedValue * field.tolerance;

      const correct = Math.abs(studentAnswer - expectedValue) <= Math.abs(tolerance);
      const pts = correct ? evaluator.correctPoints : (evaluator.incorrectPoints ?? 0);

      return {
        points: pts,
        explanation: correct
          ? `Calculation correct (${studentAnswer.toFixed(4)} ≈ ${expectedValue.toFixed(4)}) → ${pts} points`
          : `Calculation incorrect (${studentAnswer.toFixed(4)} vs expected ${expectedValue.toFixed(4)}) → ${pts} points`,
      };
    }

    // ── Custom ──
    case 'custom':
      // Custom evaluators can be registered externally
      return { points: 0, explanation: `Custom evaluator: ${evaluator.fn}` };

    default:
      return { points: 0, explanation: 'Unknown evaluator type' };
  }
}


// ── Grading ──────────────────────────────────────────────────────

function getGrade(totalScore: number): ScoreResult['grade'] {
  if (totalScore >= 85) return 'Excellent';
  if (totalScore >= 65) return 'Good';
  if (totalScore >= 45) return 'Satisfactory';
  return 'Needs Practice';
}

function generateFeedback(totalScore: number, breakdown: CategoryResult[]): string {
  if (totalScore >= 85) {
    return 'Outstanding work! You demonstrated excellent lab technique and understanding of the experiment.';
  }
  if (totalScore >= 65) {
    const weakAreas = breakdown
      .filter(c => c.points < c.maxPoints * 0.5)
      .map(c => c.name);
    if (weakAreas.length > 0) {
      return `Good job overall! Consider reviewing: ${weakAreas.join(', ')}.`;
    }
    return 'Good work! A few areas could use more practice.';
  }
  if (totalScore >= 45) {
    return 'Satisfactory effort. Review the experiment procedure and try again to improve your score.';
  }
  return 'Keep practicing! Review each step carefully and pay attention to the observations.';
}


// ── Calculation Validation ───────────────────────────────────────

/**
 * Validate all calculation fields and return results.
 * Called when the student submits the calculation form.
 */
export function validateCalculation(
  config: ExperimentConfig,
  state: ExperimentState,
  studentAnswers: Record<string, number>,
): Array<{
  fieldId: string;
  correct: boolean;
  studentAnswer: number;
  expectedValue: number;
  workedFormula: string;
}> {
  if (!config.calculation) return [];

  return config.calculation.fields.map((field: CalculationField) => {
    const studentAnswer = studentAnswers[field.id] ?? 0;
    const expectedValue =
      field.expectedValue !== undefined
        ? field.expectedValue
        : computeFormula(field.expectedFormulaName ?? '', state.variables);
    const formula = field.expectedFormulaName
      ? config.chemistry.formulas?.[field.expectedFormulaName]
      : undefined;

    const tolerance = field.toleranceType === 'absolute'
      ? field.tolerance
      : expectedValue * field.tolerance;

    const correct = Math.abs(studentAnswer - expectedValue) <= Math.abs(tolerance);

    const workedFormula = formula
      ? `${formula.label}\n${formula.displayFormula}\n= ${expectedValue.toFixed(4)} ${formula.unit}`
      : `Expected: ${expectedValue.toFixed(4)} ${field.unit}`;

    return {
      fieldId: field.id,
      correct,
      studentAnswer,
      expectedValue,
      workedFormula,
    };
  });
}
