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

export type TechniquePenalty = {
  reason: string;
  pointsLost: number;
};

export type ScoreResult = {
  /** Total score (sum of all categories, minus penalties, clamped 0 to 100) */
  totalScore: number;

  /** Max possible score */
  maxScore: number;

  /** Breakdown by category */
  breakdown: CategoryResult[];

  /** Technique penalties applied (e.g. fast flow over-titration, lack of swirling) */
  penalties?: TechniquePenalty[];

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

  // Evaluate real-world laboratory technique penalties:
  const penalties: TechniquePenalty[] = [];

  const isOvershot = Boolean(state.flags['titrationOvershot']);
  const isUnswirled = Boolean(state.flags['titratedWithoutSwirling']);
  const overshootMl = (state.variables['titrationOvershootMl'] as number) || 0;

  if (isOvershot) {
    penalties.push({
      reason: `Over-titration penalty: Added titrant too fast without dropwise control near endpoint (+${(overshootMl || 0.25).toFixed(2)} mL overshoot)`,
      pointsLost: 10,
    });
  }

  if (isUnswirled) {
    penalties.push({
      reason: 'Titration technique penalty: Dispensed titrant without continuously swirling the conical flask',
      pointsLost: 10,
    });
  }

  // Check state.mistakes for any other logged technique or procedural infractions
  if (state.mistakes && state.mistakes.length > 0) {
    const uniqueMistakes = [...new Set(state.mistakes)];
    for (const m of uniqueMistakes) {
      const lower = m.toLowerCase();
      if ((lower.includes('overshot') || lower.includes('rapid titrant') || lower.includes('over-titrat')) &&
          !penalties.some(p => p.reason.toLowerCase().includes('over-titration'))) {
        penalties.push({ reason: m, pointsLost: 10 });
      } else if (lower.includes('swirling') && !penalties.some(p => p.reason.toLowerCase().includes('swirling'))) {
        penalties.push({ reason: m, pointsLost: 10 });
      } else if (lower.includes('before stirring') || lower.includes('add water first') || lower.includes('before adding') || lower.includes('out of order') || lower.includes('sequence')) {
        penalties.push({ reason: `Procedural sequence violation: ${m}`, pointsLost: 5 });
      }
    }
  }

  const totalPenalties = penalties.reduce((sum, p) => sum + p.pointsLost, 0);
  const rawScore = breakdown.reduce((sum, c) => sum + c.points, 0);
  const totalScore = Math.max(0, Math.min(100, rawScore - totalPenalties));
  const maxScore = breakdown.reduce((sum, c) => sum + c.maxPoints, 0);

  if (penalties.length > 0) {
    breakdown.push({
      name: 'Practical Technique & Procedure Compliance',
      points: -totalPenalties,
      maxPoints: 0,
      explanation: `⚠️ Technique Penalties Applied (-${totalPenalties} marks): ${penalties.map(p => `${p.reason} (-${p.pointsLost} pts)`).join('; ')}`,
    });
  }

  const grade = getGrade(totalScore);
  let feedback = generateFeedback(totalScore, breakdown);
  if (penalties.length > 0) {
    feedback += ` Note: ${totalPenalties} marks were deducted for procedure sequence and mixing technique errors.`;
  }

  return { totalScore, maxScore, breakdown, penalties, grade, feedback };
}


// ── Category Evaluation ──────────────────────────────────────────

function evaluateCategory(
  category: ScoringCategory,
  state: ExperimentState,
  config: ExperimentConfig,
): CategoryResult {
  const { points, explanation } = evaluateSingle(category.evaluator, state, config, category.maxPoints);
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
  categoryMaxPoints?: number,
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

      const hasAnswer = field.id in state.studentAnswers && state.studentAnswers[field.id] !== undefined;
      if (!hasAnswer) {
        return {
          points: 0,
          explanation: `Field '${field.label || field.id}' left unanswered → 0 points`,
        };
      }

      const studentAnswer = state.studentAnswers[field.id];
      let correct = false;
      const effectiveVariables = {
        ...state.variables,
        ...state.studentAnswers,
      };

      if (field.minAccepted !== undefined && field.maxAccepted !== undefined) {
        const inRange = studentAnswer >= field.minAccepted - 1e-4 && studentAnswer <= field.maxAccepted + 1e-4;
        if (field.expectedFormulaName) {
          const formulaVal = computeFormula(field.expectedFormulaName, effectiveVariables);
          const tol = field.toleranceType === 'absolute'
            ? field.tolerance
            : formulaVal * field.tolerance;
          correct = inRange && Math.abs(studentAnswer - formulaVal) <= Math.abs(tol) + 1e-4;
        } else {
          correct = inRange;
        }

        const pts = correct ? evaluator.correctPoints : (evaluator.incorrectPoints ?? 0);
        const rangeLabel = field.expectedRangeLabel ?? `${field.minAccepted}–${field.maxAccepted} ${field.unit}`;
        return {
          points: pts,
          explanation: correct
            ? `Calculation correct (within acceptable range: ${rangeLabel}) → ${pts} points`
            : `Calculation incorrect (${studentAnswer} outside acceptable range: ${rangeLabel}) → ${pts} points`,
        };
      }

      const targetAnswer =
        evaluator.actualStandard !== undefined
          ? evaluator.actualStandard
          : (field.expectedValue !== undefined
              ? field.expectedValue
              : computeFormula(field.expectedFormulaName ?? '', state.variables));

      const deviation = Math.abs(studentAnswer - targetAnswer);
      const tolerance = field.toleranceType === 'absolute'
        ? field.tolerance
        : targetAnswer * field.tolerance;

      if (evaluator.proportional) {
        const errorFraction = targetAnswer !== 0 ? deviation / Math.abs(targetAnswer) : deviation;
        let scoreRatio = 0.0;
        if (errorFraction <= 0.02) scoreRatio = 1.0;
        else if (errorFraction <= 0.05) scoreRatio = 0.90;
        else if (errorFraction <= 0.10) scoreRatio = 0.75;
        else if (errorFraction <= 0.20) scoreRatio = 0.50;
        else if (errorFraction <= 0.35) scoreRatio = 0.25;
        else scoreRatio = 0.0;

        const pts = Math.round(scoreRatio * evaluator.correctPoints * 10) / 10;
        const accuracyPct = Math.max(0, Math.min(100, Math.round((1 - errorFraction) * 1000) / 10));
        return {
          points: pts,
          explanation: `Entered: ${studentAnswer} | Actual: ${targetAnswer} (Accuracy: ${accuracyPct}%, Error: ${(errorFraction * 100).toFixed(1)}%) → ${pts}/${evaluator.correctPoints} pts awarded`,
        };
      }

      correct = deviation <= Math.abs(tolerance);
      const pts = correct ? evaluator.correctPoints : (evaluator.incorrectPoints ?? 0);

      return {
        points: pts,
        explanation: correct
          ? `Calculation correct (${studentAnswer} ≈ expected ${targetAnswer}) → ${pts} points`
          : `Calculation incorrect (${studentAnswer} vs expected ${targetAnswer}) → ${pts} points`,
      };
    }

    // ── Multi-Check Additive Criteria ──
    case 'multiCheck': {
      let earned = 0;
      const notes: string[] = [];

      for (const check of evaluator.checks) {
        let ok = false;
        if (check.flag !== undefined) {
          ok = Boolean(state.flags[check.flag]);
        } else if (check.action !== undefined) {
          ok = state.completedActions.includes(check.action);
        } else if (check.calcFieldId !== undefined) {
          const studentVal = state.studentAnswers[check.calcFieldId];
          if (studentVal !== undefined && check.expectedValue !== undefined) {
            const tol = check.tolerance ?? 0.1;
            ok = Math.abs(studentVal - check.expectedValue) <= tol;
          }
        }

        if (ok) {
          earned += check.points;
          notes.push(`${check.label} ✓ (+${check.points})`);
        } else {
          notes.push(`${check.label} ✗ (0)`);
        }
      }

      return {
        points: earned,
        explanation: notes.join(' • '),
      };
    }

    // ── Viva Voce Oral / Conceptual Quiz ──
    case 'vivaQuiz': {
      if (!config.viva?.questions || config.viva.questions.length === 0) {
        return { points: 0, explanation: 'No viva voce questions configured for this experiment' };
      }
      const questions = config.viva.questions;
      let correctCount = 0;
      const questionBadges: string[] = [];

      questions.forEach((q, idx) => {
        const studentPick = state.studentAnswers[`viva_${q.id}`];
        const isCorrect = studentPick !== undefined && studentPick === q.correctIndex;
        if (isCorrect) {
          correctCount++;
          questionBadges.push(`Q${idx + 1} ✓`);
        } else {
          questionBadges.push(`Q${idx + 1} ✗`);
        }
      });

      const totalQuestions = questions.length;
      const maxPts = categoryMaxPoints ?? 15;
      const earned = Math.round((correctCount / totalQuestions) * maxPts * 10) / 10;
      const pct = Math.round((correctCount / totalQuestions) * 100);

      return {
        points: earned,
        explanation: `Viva Voce: ${correctCount}/${totalQuestions} answered correctly (${pct}%) [${questionBadges.join(' • ')}] → ${earned}/${maxPts} marks`,
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

  const effectiveVariables = {
    ...state.variables,
    ...studentAnswers,
  };

  return config.calculation.fields.map((field: CalculationField) => {
    const studentAnswer = studentAnswers[field.id] ?? 0;
    const formula = field.expectedFormulaName
      ? config.chemistry.formulas?.[field.expectedFormulaName]
      : undefined;

    let expectedValue = field.expectedValue ?? 0;
    if (field.expectedFormulaName) {
      expectedValue = computeFormula(field.expectedFormulaName, effectiveVariables);
    } else if (field.expectedValue !== undefined) {
      expectedValue = field.expectedValue;
    }

    let correct = false;

    if (field.minAccepted !== undefined && field.maxAccepted !== undefined) {
      const inRange = studentAnswer >= field.minAccepted - 1e-4 && studentAnswer <= field.maxAccepted + 1e-4;
      if (field.expectedFormulaName) {
        const tol = field.toleranceType === 'absolute'
          ? field.tolerance
          : expectedValue * field.tolerance;
        const matchesCalculation = Math.abs(studentAnswer - expectedValue) <= Math.abs(tol) + 1e-4;
        correct = inRange && matchesCalculation;
      } else {
        correct = inRange;
      }
    } else {
      const tolerance = field.toleranceType === 'absolute'
        ? field.tolerance
        : expectedValue * field.tolerance;
      correct = Math.abs(studentAnswer - expectedValue) <= Math.abs(tolerance);
    }

    let workedFormula = '';
    if (field.expectedRangeLabel) {
      if (formula) {
        workedFormula = `${formula.label}\n${formula.displayFormula}\nExpected acceptable range: ${field.expectedRangeLabel}`;
      } else {
        workedFormula = `Expected acceptable range: ${field.expectedRangeLabel}`;
      }
    } else if (formula) {
      workedFormula = `${formula.label}\n${formula.displayFormula}\n= ${expectedValue.toFixed(4)} ${formula.unit}`;
    } else {
      workedFormula = `Expected: ${expectedValue.toFixed(4)} ${field.unit}`;
    }

    return {
      fieldId: field.id,
      correct,
      studentAnswer,
      expectedValue,
      workedFormula,
    };
  });
}
