/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Experiment Registry
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../engine/experimentConfig';

// ── Import experiment configs ──
import { zincAcidReaction } from './zinc-acid-reaction';
import { dbatuExperiments } from './fy-dbatu';
import { cbseClass9Experiments } from './cbse-class9';
import { cbseClass10Experiments } from './cbse-class10';

// ── Registry ─────────────────────────────────────────────────────

const experiments: ExperimentConfig[] = [
  zincAcidReaction,
  ...dbatuExperiments,
  ...cbseClass9Experiments,
  ...cbseClass10Experiments,
];

/**
 * Get all registered experiment configs.
 */
export function getAllExperiments(): ExperimentConfig[] {
  return experiments;
}

/**
 * Get a specific experiment config by ID.
 */
export function getExperimentById(id: string): ExperimentConfig | undefined {
  return experiments.find(e => e.id === id);
}

/**
 * Get experiments grouped by class.
 */
export function getExperimentsByClass(): Record<string | number, ExperimentConfig[]> {
  const grouped: Record<string | number, ExperimentConfig[]> = {};
  for (const exp of experiments) {
    const key = exp.class;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(exp);
  }
  return grouped;
}
