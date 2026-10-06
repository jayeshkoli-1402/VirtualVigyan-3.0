/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — CBSE Class 10 Science Practicals (Stage 2 of 4)
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';
import { phCommonSamples } from './ph-common-samples';
import { propertiesAcidsBases } from './properties-acids-bases';
import { typesOfReactions } from './types-of-reactions';
import { reactivityOfMetals } from './reactivity-of-metals';
import { propertiesAceticAcid } from './properties-acetic-acid';
import { soapCleaningAction } from './soap-cleaning-action';

export const cbseClass10Experiments: ExperimentConfig[] = [
  phCommonSamples,
  propertiesAcidsBases,
  typesOfReactions,
  reactivityOfMetals,
  propertiesAceticAcid,
  soapCleaningAction,
];

export {
  phCommonSamples,
  propertiesAcidsBases,
  typesOfReactions,
  reactivityOfMetals,
  propertiesAceticAcid,
  soapCleaningAction,
};
