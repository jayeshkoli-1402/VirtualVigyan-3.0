/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — CBSE Class 9 Science Practicals (Stage 1)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';
import { trueSolutionColloidSuspension } from './true-solution-colloid-suspension';
import { mixtureCompoundIronSulphur } from './mixture-compound-iron-sulphur';
import { physicalChemicalChanges } from './physical-chemical-changes';
import { conservationOfMass } from './conservation-of-mass';
import { meltingIceBoilingWater } from './melting-ice-boiling-water';

export const cbseClass9Experiments: ExperimentConfig[] = [
  trueSolutionColloidSuspension,
  mixtureCompoundIronSulphur,
  physicalChemicalChanges,
  conservationOfMass,
  meltingIceBoilingWater,
];

export {
  trueSolutionColloidSuspension,
  mixtureCompoundIronSulphur,
  physicalChemicalChanges,
  conservationOfMass,
  meltingIceBoilingWater,
};
