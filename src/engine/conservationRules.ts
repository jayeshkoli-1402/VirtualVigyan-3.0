import type { ConservationState } from './conservationState';

// ── Chemistry Constants for Conservation of Mass (MH9-CHEM-002) ──

// Reaction: BaCl₂ + Na₂SO₄ → BaSO₄(↓) + 2NaCl
export const REACTION_EQUATION = 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl';
export const REACTION_TYPE = 'Double Displacement (Metathesis)';

// Chemicals
export const BACL2_CONCENTRATION = '5% w/v';
export const NA2SO4_CONCENTRATION = '5% w/v';
export const BACL2_VOLUME_ML = 10;
export const NA2SO4_VOLUME_ML = 10;
export const BACL2_MOLAR_MASS = 244.26; // g/mol (BaCl₂·2H₂O)
export const NA2SO4_MOLAR_MASS = 142.04; // g/mol
export const BASO4_MOLAR_MASS = 233.39; // g/mol

// Mass conservation tolerance
export const MASS_TOLERANCE_G = 0.02; // ΔM should be ≤ 0.02 g
export const DEVIATION_TOLERANCE_PERCENT = 0.05; // Deviation should be ≤ 0.05%

/**
 * Computes realistic live mass reading for whatever is currently resting on the balance pan.
 * Works seamlessly at ANY phase of the experiment.
 */
export function calculateLiveMass(state: ConservationState): number {
  if (!state.flaskOnBalance) return 0.00;

  // If full sealed assembly is formed, use exact simulated M1 (before reaction) or M2 (after reaction)
  if (state.flaskSealed && state.tubeSuspended && state.tubeFilled) {
    return state.reactantsMixed ? state.simulatedM2 : state.simulatedM1;
  }

  // Realistic component masses at partial steps:
  let mass = 100.00; // Empty 100 mL Borosilicate Conical Flask
  if (state.na2so4Poured) mass += 10.30; // 10 mL 5% Na2SO4 solution (density ~1.03 g/mL)
  if (state.tubeSuspended) {
    mass += 5.00; // Borosilicate Ignition Tube (10x75 mm) + cotton thread
    if (state.tubeFilled) mass += 10.10; // 10 mL 5% BaCl2 solution (density ~1.01 g/mL)
  }
  if (state.flaskSealed) mass += 5.00; // Solid airtight rubber cork

  return Math.round(mass * 100) / 100;
}

/**
 * Returns the CSS color string for the flask liquid based on experiment state.
 */
export function getConservationFlaskColor(
  precipitateFormed: boolean,
  na2so4Poured: boolean,
  isMixing: boolean
): string {
  if (!na2so4Poured) {
    return 'transparent';
  }

  if (isMixing) {
    // During mixing animation: transitioning to turbid
    return 'rgba(230, 230, 230, 0.85)';
  }

  if (precipitateFormed) {
    // White turbid precipitate suspended in solution
    return 'rgba(240, 240, 245, 0.92)';
  }

  // Colorless Na₂SO₄ solution before mixing
  return 'rgba(224, 242, 254, 0.35)';
}

/**
 * Returns the color for the ignition tube liquid (BaCl₂ solution).
 */
export function getTubeColor(tubeFilled: boolean): string {
  if (!tubeFilled) return 'transparent';
  return 'rgba(224, 242, 254, 0.35)';
}

/**
 * Returns a human-readable description of the current observation state.
 */
export function getObservationDescription(
  precipitateFormed: boolean,
  na2so4Poured: boolean,
  isMixing: boolean
): string {
  if (!na2so4Poured) return 'Empty flask';
  if (isMixing) return 'Reactants are mixing...';
  if (precipitateFormed) return 'Dense white precipitate of BaSO₄ formed';
  return 'Colorless Na₂SO₄ solution';
}

/**
 * Calculate the expected ΔM from M1 and M2.
 */
export function calculateExpectedDeltaM(m1: number, m2: number): number {
  return Math.abs(m2 - m1);
}

/**
 * Calculate the expected deviation percentage.
 */
export function calculateExpectedDeviation(m1: number, m2: number): number {
  if (m1 === 0) return 0;
  return (Math.abs(m2 - m1) / m1) * 100;
}

/**
 * Validate the student's ΔM calculation against the actual values.
 */
export function validateDeltaM(
  studentDeltaM: number,
  m1: number,
  m2: number
): {
  correct: boolean;
  expected: number;
  workedFormula: string;
} {
  const expected = calculateExpectedDeltaM(m1, m2);
  const tolerance = 0.005;
  const correct = Math.abs(studentDeltaM - expected) <= tolerance;

  const workedFormula = `ΔM = |M₂ - M₁|\n= |${m2.toFixed(2)} g - ${m1.toFixed(2)} g|\n= ${expected.toFixed(2)} g`;

  return { correct, expected, workedFormula };
}

/**
 * Validate the student's deviation percentage calculation.
 */
export function validateDeviationPercent(
  studentDeviation: number,
  m1: number,
  m2: number
): {
  correct: boolean;
  expected: number;
  workedFormula: string;
} {
  const expected = calculateExpectedDeviation(m1, m2);
  const tolerance = 0.02;
  const correct = Math.abs(studentDeviation - expected) <= tolerance;

  const workedFormula = `Deviation % = (|M₂ - M₁| / M₁) × 100\n= (${Math.abs(m2 - m1).toFixed(2)} / ${m1.toFixed(2)}) × 100\n= ${expected.toFixed(4)} %`;

  return { correct, expected, workedFormula };
}
