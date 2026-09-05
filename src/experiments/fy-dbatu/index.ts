/**
 * ═══════════════════════════════════════════════════════════════════
 *  Dr. Babasaheb Ambedkar Technological University (DBATU)
 *  F.Y. B.Tech — Engineering Chemistry Laboratory Practicals
 * ═══════════════════════════════════════════════════════════════════
 */

import type { ExperimentConfig } from '../../engine/experimentConfig';

import { viscosityOstwald } from './viscosity-ostwald';
import { phMetricTitration } from './ph-metric-titration';
import { conductometricTitration } from './conductometric-titration';
import { chlorideMohrMethod } from './chloride-mohr-method';
import { waterAcidity } from './water-acidity';
import { waterAlkalinity } from './water-alkalinity';
import { acidValueOil } from './acid-value-oil';
import { dissolvedOxygenWinkler } from './dissolved-oxygen-winkler';
import { waterHardnessEdta } from './water-hardness-edta';

export const dbatuExperiments: ExperimentConfig[] = [
  viscosityOstwald,
  phMetricTitration,
  conductometricTitration,
  chlorideMohrMethod,
  waterAcidity,
  waterAlkalinity,
  acidValueOil,
  dissolvedOxygenWinkler,
  waterHardnessEdta,
];

export {
  viscosityOstwald,
  phMetricTitration,
  conductometricTitration,
  chlorideMohrMethod,
  waterAcidity,
  waterAlkalinity,
  acidValueOil,
  dissolvedOxygenWinkler,
  waterHardnessEdta,
};
