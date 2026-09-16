/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Stoichiometry & Multi-Chemical Reaction Engine
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Computes exact chemical consequences of arbitrary reagent mixing:
 *  - Limiting reagent & excess reactant tracking
 *  - Product yields & molar concentrations
 *  - Enthalpy change (ΔH) & real vessel temperature surge (ΔT)
 *  - Dynamic pH calculation (Strong/Weak Acid-Base & Buffers)
 *  - Insoluble precipitate mass & optical opacity
 *  - Gas effervescence rates & bubbling mechanics
 *  - Live scientific explanations for student feedback
 * ═══════════════════════════════════════════════════════════════════
 */

import { getChemicalSpecies } from './chemicalDatabase';
import { REACTION_RULES } from './reactionMatrix';

export interface ReactionEventLog {
  id: string;
  timestamp: number;
  reactionName: string;
  equation: string;
  limitingReagent: string;
  limitingMoles: number;
  excessReagents: { name: string; remainingMoles: number }[];
  productsFormed: { name: string; moles: number; grams?: number }[];
  deltaT: number;
  precipitateFormedGrams?: number;
  precipitateName?: string;
  gasEvolvedMl?: number;
  gasName?: string;
  hazard?: string;
  explanation: string;
}

export interface VesselMixture {
  vesselId: string;
  volumeMl: number;
  temperatureC: number;
  pH: number;
  moles: Record<string, number>; // substanceId -> moles
  precipitateGrams: Record<string, number>; // substanceId -> grams
  recentEvents: ReactionEventLog[];
  dominantColor: string;
  opacity: number;
  effervescenceRate: number; // 0.0 (still) to 1.0 (vigorous bubbling)
  effervescenceGas?: string;
  activeHazards: string[];
}

export interface ChemicalAddition {
  substanceId: string;
  volumeMl?: number;
  molarity?: number;
  massGrams?: number;
  temperatureC?: number;
}

/** Create an empty or fresh vessel mixture */
export function createEmptyMixture(vesselId: string, initialVolumeMl = 0): VesselMixture {
  return {
    vesselId,
    volumeMl: initialVolumeMl,
    temperatureC: 25.0,
    pH: 7.0,
    moles: initialVolumeMl > 0 ? { h2o: (initialVolumeMl * 1.0) / 18.015 } : {},
    precipitateGrams: {},
    recentEvents: [],
    dominantColor: 'rgba(230, 244, 255, 0.45)',
    opacity: initialVolumeMl > 0 ? 0.35 : 0.0,
    effervescenceRate: 0,
    activeHazards: [],
  };
}

/** Calculate the pH of an aqueous solution based on dissolved species */
export function computeMixturePH(
  moles: Record<string, number>,
  volumeMl: number,
): number {
  if (volumeMl <= 0.5) return 7.0;
  const volumeL = volumeMl / 1000;

  // Strong acids (mol H+)
  const hclMoles = moles['hcl'] ?? 0;
  const h2so4Moles = (moles['h2so4'] ?? 0) * 2;
  const hno3Moles = moles['hno3'] ?? 0;
  const totalAcidMoles = hclMoles + h2so4Moles + hno3Moles;

  // Strong bases (mol OH-)
  const naohMoles = moles['naoh'] ?? 0;
  const kohMoles = moles['koh'] ?? 0;
  const caoh2Moles = (moles['ca_oh2'] ?? 0) * 2;
  const totalBaseMoles = naohMoles + kohMoles + caoh2Moles;

  // Weak acid / salt buffers (Acetic acid / Acetate)
  const haMoles = moles['ch3cooh'] ?? 0;
  const aMoles = moles['ch3coona'] ?? 0;
  if (haMoles > 1e-6 && aMoles > 1e-6 && totalAcidMoles < 1e-6 && totalBaseMoles < 1e-6) {
    // Henderson-Hasselbalch: pH = pKa + log([A-]/[HA])
    const pKa = 4.76;
    const ratio = Math.max(0.01, Math.min(100, aMoles / haMoles));
    return Math.round((pKa + Math.log10(ratio)) * 100) / 100;
  }

  // Carbonate basicity
  const na2co3Moles = moles['na2co3'] ?? 0;
  const nahco3Moles = moles['nahco3'] ?? 0;

  const netAcid = totalAcidMoles - totalBaseMoles;

  if (netAcid > 1e-6) {
    // Acidic solution
    const hConcentration = netAcid / volumeL;
    const ph = -Math.log10(hConcentration);
    return Math.max(0.1, Math.min(6.95, Math.round(ph * 100) / 100));
  } else if (netAcid < -1e-6) {
    // Basic solution
    const ohConcentration = Math.abs(netAcid) / volumeL;
    const pOH = -Math.log10(ohConcentration);
    const ph = 14.0 - pOH;
    return Math.max(7.05, Math.min(13.9, Math.round(ph * 100) / 100));
  } else if (na2co3Moles > 1e-6) {
    // Hydrolysis of carbonate
    return 11.2;
  } else if (nahco3Moles > 1e-6) {
    return 8.3;
  } else if (haMoles > 1e-6) {
    // Pure weak acid: [H+] = sqrt(Ka * C)
    const c = haMoles / volumeL;
    const ka = 1.75e-5;
    const h = Math.sqrt(ka * c);
    return Math.max(2.0, Math.min(6.5, Math.round(-Math.log10(h) * 100) / 100));
  }

  return 7.0;
}

/** Compute visual liquid color and opacity based on ions, indicators, and precipitates */
export function computeMixtureAppearance(
  moles: Record<string, number>,
  precipitateGrams: Record<string, number>,
  pH: number,
  volumeMl: number,
): { color: string; opacity: number } {
  if (volumeMl <= 0.5) {
    return { color: 'transparent', opacity: 0 };
  }

  let baseR = 230;
  let baseG = 244;
  let baseB = 255;
  let baseA = 0.45;

  // 1. Check Indicators first
  const phenolphthaleinMoles = moles['phenolphthalein'] ?? 0;
  const methylOrangeMoles = moles['methyl_orange'] ?? 0;
  const ebtMoles = moles['eriochrome_black_t'] ?? 0;
  const starchMoles = moles['starch'] ?? 0;

  if (phenolphthaleinMoles > 1e-7) {
    if (pH >= 8.3) {
      // Vivid magenta/pink
      baseR = 236;
      baseG = 72;
      baseB = 153;
      baseA = 0.85;
    } else {
      // Colorless in acid
      baseR = 240;
      baseG = 249;
      baseB = 255;
      baseA = 0.40;
    }
  } else if (methylOrangeMoles > 1e-7) {
    if (pH < 3.1) {
      // Red
      baseR = 239;
      baseG = 68;
      baseB = 68;
      baseA = 0.85;
    } else if (pH > 4.4) {
      // Yellow
      baseR = 234;
      baseG = 179;
      baseB = 8;
      baseA = 0.85;
    } else {
      // Orange
      baseR = 249;
      baseG = 115;
      baseB = 22;
      baseA = 0.85;
    }
  } else if (ebtMoles > 1e-7) {
    // EBT: wine red with Ca2+/Mg2+, steel-blue with excess EDTA
    const edtaMoles = moles['edta'] ?? 0;
    if (edtaMoles > 1e-6) {
      baseR = 37;
      baseG = 99;
      baseB = 235; // Steel-blue
      baseA = 0.80;
    } else {
      baseR = 159;
      baseG = 18;
      baseB = 57; // Wine-red
      baseA = 0.85;
    }
  } else if (starchMoles > 1e-7 && (moles['iodine'] ?? 0) > 1e-7) {
    // Blue-black starch iodine complex
    baseR = 15;
    baseG = 23;
    baseB = 42;
    baseA = 0.95;
  } else {
    // 2. Transition metal / Colored salt checks
    const cuso4Moles = moles['cuso4'] ?? 0;
    const kmno4Moles = moles['kmno4'] ?? 0;
    const k2cr2o7Moles = moles['k2cr2o7'] ?? 0;
    const fecl3Moles = moles['fecl3'] ?? 0;
    const feso4Moles = moles['feso4'] ?? 0;

    if (kmno4Moles > 1e-7) {
      baseR = 126;
      baseG = 34;
      baseB = 206; // Vivid violet/purple
      baseA = 0.90;
    } else if (k2cr2o7Moles > 1e-7) {
      baseR = 234;
      baseG = 88;
      baseB = 12; // Orange
      baseA = 0.88;
    } else if (cuso4Moles > 1e-7) {
      baseR = 14;
      baseG = 165;
      baseB = 233; // Vivid cyan-blue
      baseA = 0.78;
    } else if (fecl3Moles > 1e-7) {
      baseR = 180;
      baseG = 83;
      baseB = 9; // Amber-brown
      baseA = 0.75;
    } else if (feso4Moles > 1e-7) {
      baseR = 134;
      baseG = 239;
      baseB = 172; // Pale green
      baseA = 0.60;
    }
  }

  // 3. Precipitate contributions to turbidity & opacity
  const totalPptGrams = Object.values(precipitateGrams).reduce((a, b) => a + b, 0);
  if (totalPptGrams > 0.01) {
    // Determine dominant precipitate color
    if ((precipitateGrams['pbi2'] ?? 0) > 0.01) {
      // Golden yellow PbI2
      baseR = 234;
      baseG = 179;
      baseB = 8;
    } else if ((precipitateGrams['cu_oh2'] ?? 0) > 0.01) {
      // Sky blue Cu(OH)2
      baseR = 56;
      baseG = 189;
      baseB = 248;
    } else if ((precipitateGrams['fe_oh3'] ?? 0) > 0.01) {
      // Reddish brown rust
      baseR = 185;
      baseG = 28;
      baseB = 28;
    } else if ((precipitateGrams['fe_oh2'] ?? 0) > 0.01) {
      // Dirty green
      baseR = 74;
      baseG = 222;
      baseB = 128;
    } else if ((precipitateGrams['s_solid'] ?? 0) > 0.01) {
      // Pale yellow colloidal sulfur
      baseR = 253;
      baseG = 224;
      baseB = 71;
    } else {
      // Chalky / curdy white (BaSO4, AgCl, CaCO3, etc.)
      baseR = 245;
      baseG = 245;
      baseB = 245;
    }
    // High opacity due to suspended particles
    baseA = Math.min(0.96, 0.45 + Math.min(0.50, totalPptGrams * 0.4));
  }

  return {
    color: `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA.toFixed(2)})`,
    opacity: baseA,
  };
}

/**
 * Universal Mixing & Stoichiometric Solver Function
 *
 * Adds any chemical species to an existing vessel mixture, solves all limiting reagents,
 * updates reaction enthalpies & temperatures, precipitates, and gas evolution rates.
 */
export function mixChemicals(
  current: VesselMixture,
  addition: ChemicalAddition,
): VesselMixture {
  const species = getChemicalSpecies(addition.substanceId);
  if (!species) {
    // Unrecognized substance: just return current
    return current;
  }

  // 1. Calculate incoming moles & volume
  let addedMoles = 0;
  let addedVolumeMl = addition.volumeMl ?? 0;

  if (addition.massGrams !== undefined && addition.massGrams > 0) {
    addedMoles = addition.massGrams / species.molarMass;
    if (addedVolumeMl === 0) {
      addedVolumeMl = addition.massGrams / species.density;
    }
  } else if (addedVolumeMl > 0) {
    const concentration =
      addition.molarity ?? species.commonConcentrationM ?? (species.type === 'water' ? 55.5 : 0.1);
    addedMoles = (addedVolumeMl / 1000) * concentration;
  } else {
    // Default 1 drop (~0.05 mL) or standard unit
    addedVolumeMl = 1.0;
    const concentration = species.commonConcentrationM ?? 0.1;
    addedMoles = (addedVolumeMl / 1000) * concentration;
  }

  const updatedMoles = { ...current.moles };
  updatedMoles[species.id] = (updatedMoles[species.id] ?? 0) + addedMoles;

  let totalVolumeMl = current.volumeMl + addedVolumeMl;
  let totalTempC = current.temperatureC;
  const updatedPpt = { ...current.precipitateGrams };
  const eventLogs: ReactionEventLog[] = [...current.recentEvents];
  let effervescenceRate = 0;
  let effervescenceGas: string | undefined = undefined;
  const activeHazards: string[] = [...species.hazards];

  // 2. Iterative Reaction Resolution Loop
  let reactionOccurred = true;
  let passes = 0;

  while (reactionOccurred && passes < 6) {
    reactionOccurred = false;
    passes++;

    for (const rule of REACTION_RULES) {
      // Check if all reactants are available
      let canReact = true;
      let minExtent = Infinity;
      let limitingReactantId = '';

      for (const r of rule.reactants) {
        const available = updatedMoles[r.substanceId] ?? 0;
        if (available < 1e-7) {
          canReact = false;
          break;
        }
        const extent = available / r.coeff;
        if (extent < minExtent) {
          minExtent = extent;
          limitingReactantId = r.substanceId;
        }
      }

      if (canReact && minExtent > 1e-7) {
        // Execute this reaction to completion of limiting reagent
        reactionOccurred = true;
        const xi = minExtent; // Extent of reaction (moles)

        // Deduct reactants
        const reactantsUsed: { name: string; moles: number }[] = [];
        for (const r of rule.reactants) {
          const used = r.coeff * xi;
          updatedMoles[r.substanceId] = Math.max(0, (updatedMoles[r.substanceId] ?? 0) - used);
          const rSpec = getChemicalSpecies(r.substanceId);
          reactantsUsed.push({ name: rSpec?.name ?? r.substanceId, moles: used });
        }

        // Add products
        const productsFormed: { name: string; moles: number; grams?: number }[] = [];
        for (const p of rule.products) {
          const formed = p.coeff * xi;
          const pSpec = getChemicalSpecies(p.substanceId);
          const pName = pSpec?.name ?? p.substanceId;

          if (rule.precipitateSubstanceId === p.substanceId) {
            // Forms insoluble solid precipitate
            const massG = formed * (pSpec?.molarMass ?? 100);
            updatedPpt[p.substanceId] = (updatedPpt[p.substanceId] ?? 0) + massG;
            productsFormed.push({ name: pName, moles: formed, grams: massG });
          } else if (rule.gasSubstanceId === p.substanceId) {
            // Gas evolved
            effervescenceRate = Math.min(1.0, effervescenceRate + Math.min(1.0, formed * 50));
            effervescenceGas = rule.gasName ?? pName;
            productsFormed.push({ name: pName, moles: formed });
          } else {
            // Stays dissolved
            updatedMoles[p.substanceId] = (updatedMoles[p.substanceId] ?? 0) + formed;
            productsFormed.push({ name: pName, moles: formed });
          }
        }

        // Thermodynamics: Enthalpy & Temperature Change
        // q = -xi * deltaH * 1000 (J)
        const qJoules = -xi * rule.deltaH * 1000;
        const totalMassGrams = Math.max(10, totalVolumeMl * 1.0);
        const specificHeat = 4.184; // J/(g·°C)
        const deltaT = qJoules / (totalMassGrams * specificHeat);
        totalTempC = Math.max(15, Math.min(100, totalTempC + deltaT));

        // Excess Reagents
        const excessReagents: { name: string; remainingMoles: number }[] = [];
        for (const r of rule.reactants) {
          if (r.substanceId !== limitingReactantId) {
            const rem = updatedMoles[r.substanceId] ?? 0;
            if (rem > 1e-6) {
              const rSpec = getChemicalSpecies(r.substanceId);
              excessReagents.push({ name: rSpec?.name ?? r.substanceId, remainingMoles: rem });
            }
          }
        }

        const limitingSpec = getChemicalSpecies(limitingReactantId);
        const limitingName = limitingSpec?.name ?? limitingReactantId;

        // Build Explanation
        const explanation = rule.explanation({
          equation: rule.equation,
          reactantsUsed,
          productsFormed,
          limitingReagentName: limitingName,
          excessReagents,
          deltaT,
        });

        if (rule.hazardWarning) {
          activeHazards.push(rule.hazardWarning);
        }

        const eventLog: ReactionEventLog = {
          id: `${rule.id}-${Date.now()}-${passes}`,
          timestamp: Date.now(),
          reactionName: rule.name,
          equation: rule.equation,
          limitingReagent: limitingName,
          limitingMoles: xi,
          excessReagents,
          productsFormed,
          deltaT,
          precipitateFormedGrams: rule.precipitateSubstanceId
            ? productsFormed.find((p) => p.grams !== undefined)?.grams
            : undefined,
          precipitateName: rule.precipitateSubstanceId
            ? getChemicalSpecies(rule.precipitateSubstanceId)?.name
            : undefined,
          gasEvolvedMl: rule.gasSubstanceId ? xi * 24450 : undefined,
          gasName: rule.gasName,
          hazard: rule.hazardWarning,
          explanation,
        };

        eventLogs.unshift(eventLog);
      }
    }
  }

  // 3. Compute final pH
  const pH = computeMixturePH(updatedMoles, totalVolumeMl);

  // 4. Compute final visual appearance
  const appearance = computeMixtureAppearance(updatedMoles, updatedPpt, pH, totalVolumeMl);

  return {
    vesselId: current.vesselId,
    volumeMl: Math.round(totalVolumeMl * 10) / 10,
    temperatureC: Math.round(totalTempC * 10) / 10,
    pH,
    moles: updatedMoles,
    precipitateGrams: updatedPpt,
    recentEvents: eventLogs.slice(0, 10), // keep latest 10 events
    dominantColor: appearance.color,
    opacity: appearance.opacity,
    effervescenceRate,
    effervescenceGas,
    activeHazards: Array.from(new Set(activeHazards)),
  };
}
