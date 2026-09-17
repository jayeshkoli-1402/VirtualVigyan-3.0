/**
 * Automated Verification Script for Stoichiometry & Multi-Chemical Engine
 */

import { mixChemicals, createEmptyMixture } from '../src/engine/stoichiometrySolver.ts';
import { CHEMICAL_DATABASE } from '../src/engine/chemicalDatabase.ts';
import { REACTION_RULES } from '../src/engine/reactionMatrix.ts';

console.log('🧪 Starting VirtualVigyan Stoichiometry Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// ── Test 1: Chemical Database Integrity ──
console.log('--- Test Suite 1: Chemical Species Database ---');
assert(Object.keys(CHEMICAL_DATABASE).length >= 35, `Database has ${Object.keys(CHEMICAL_DATABASE).length} species (expected >= 35)`);
assert(CHEMICAL_DATABASE['hcl'] !== undefined, 'HCl species present');
assert(CHEMICAL_DATABASE['naoh'] !== undefined, 'NaOH species present');
assert(CHEMICAL_DATABASE['baso4'] !== undefined, 'BaSO4 precipitate present');
assert(CHEMICAL_DATABASE['pbi2'] !== undefined, 'PbI2 Golden Rain present');
assert(CHEMICAL_DATABASE['h2'] !== undefined, 'Hydrogen gas present');

// ── Test 2: Reaction Rules Matrix ──
console.log('\n--- Test Suite 2: Reaction Matrix Rules ---');
assert(REACTION_RULES.length >= 10, `Matrix has ${REACTION_RULES.length} reaction rules (expected >= 10)`);
const neutralizationRule = REACTION_RULES.find(r => r.id === 'hcl_naoh_neutralization');
assert(neutralizationRule !== undefined, 'HCl + NaOH neutralization rule exists');
assert(neutralizationRule.deltaH === -57.3, 'Neutralization enthalpy is -57.3 kJ/mol');

// ── Test 3: Acid-Base Limiting Reagent (Equal Moles) ──
console.log('\n--- Test Suite 3: HCl + NaOH Equivalence Point ---');
let vessel = createEmptyMixture('conical-flask', 20); // 20 mL water
// Add 10 mL of 0.1 M HCl (1.0 mmol)
vessel = mixChemicals(vessel, { substanceId: 'hcl', volumeMl: 10, molarity: 0.1 });
assert(Math.abs(vessel.pH - 1.48) < 0.1, `pH after 1 mmol HCl is acidic (pH = ${vessel.pH})`);

// Add 10 mL of 0.1 M NaOH (1.0 mmol)
vessel = mixChemicals(vessel, { substanceId: 'naoh', volumeMl: 10, molarity: 0.1 });
assert(vessel.recentEvents.length > 0, 'Reaction occurred');
const lastEvent = vessel.recentEvents[0];
assert(lastEvent.reactionName.includes('Neutralization'), 'Neutralization event logged');
assert(lastEvent.deltaT > 0, `Temperature rise ΔT = +${lastEvent.deltaT.toFixed(2)}°C`);
assert(Math.abs(vessel.pH - 7.0) < 0.2, `Equivalence point pH ~ 7.0 (pH = ${vessel.pH})`);
assert(vessel.moles['hcl'] < 1e-6, 'HCl completely neutralized');
assert(vessel.moles['naoh'] < 1e-6, 'NaOH completely consumed');
assert((vessel.moles['nacl'] ?? 0) > 0.0009, '1 mmol NaCl formed');

// ── Test 4: Excess Reagent Calculation ──
console.log('\n--- Test Suite 4: Excess Reagent & pH Tracking ---');
// Add additional 10 mL of 0.1 M NaOH in excess (1.0 mmol excess)
vessel = mixChemicals(vessel, { substanceId: 'naoh', volumeMl: 10, molarity: 0.1 });
assert(vessel.pH > 11.0, `Solution becomes strongly alkaline with excess base (pH = ${vessel.pH})`);
assert((vessel.moles['naoh'] ?? 0) > 0.0009, 'Excess NaOH tracked in moles');

// ── Test 5: Insoluble Precipitate Formation (BaCl2 + Na2SO4) ──
console.log('\n--- Test Suite 5: Double Displacement & Precipitation (BaSO4) ---');
let pptVessel = createEmptyMixture('test-tube-1', 10);
// Add 10 mL 0.1 M BaCl2 (1 mmol)
pptVessel = mixChemicals(pptVessel, { substanceId: 'bacl2', volumeMl: 10, molarity: 0.1 });
// Add 10 mL 0.1 M Na2SO4 (1 mmol)
pptVessel = mixChemicals(pptVessel, { substanceId: 'na2so4', volumeMl: 10, molarity: 0.1 });

assert(pptVessel.recentEvents.length > 0, 'Precipitation reaction fired');
const baso4Grams = pptVessel.precipitateGrams['baso4'] ?? 0;
// 1 mmol of BaSO4 (233.39 g/mol) = ~0.233 g
assert(Math.abs(baso4Grams - 0.233) < 0.02, `Formed ~0.233 g BaSO4 precipitate (actual: ${baso4Grams.toFixed(3)} g)`);
assert(pptVessel.opacity > 0.5, `Precipitate increased liquid opacity (opacity = ${pptVessel.opacity})`);

// ── Test 6: Single Displacement & Gas Evolution (Zn + HCl) ──
console.log('\n--- Test Suite 6: Single Displacement & Hydrogen Gas Evolution ---');
let gasVessel = createEmptyMixture('beaker-1', 20);
// Add 25 mL 0.2 M HCl (5 mmol)
gasVessel = mixChemicals(gasVessel, { substanceId: 'hcl', volumeMl: 25, molarity: 0.2 });
// Add 0.1 g Zinc metal (~1.53 mmol Zn)
gasVessel = mixChemicals(gasVessel, { substanceId: 'zn', massGrams: 0.1 });

assert(gasVessel.recentEvents.length > 0, 'Zinc displacement reaction fired');
const gasEvent = gasVessel.recentEvents[0];
assert(gasEvent.limitingReagent.includes('Zinc'), `Zinc was the limiting reagent (${gasEvent.limitingReagent})`);
assert(gasEvent.gasEvolvedMl !== undefined && gasEvent.gasEvolvedMl > 20, `H2 gas evolved (~${gasEvent.gasEvolvedMl?.toFixed(1)} mL)`);
assert(gasVessel.effervescenceRate > 0, `Effervescence rate active (${gasVessel.effervescenceRate.toFixed(2)})`);
assert(gasVessel.temperatureC > 25.0, `Exothermic temperature surge (T = ${gasVessel.temperatureC}°C)`);

// ── Test 7: Golden Rain (Pb(NO3)2 + 2 KI -> PbI2) ──
console.log('\n--- Test Suite 7: Golden Rain Reaction (PbI2) ---');
let goldenVessel = createEmptyMixture('flask', 20);
// Add 10 mL 0.1 M Pb(NO3)2 (1.0 mmol)
goldenVessel = mixChemicals(goldenVessel, { substanceId: 'pb_no3_2', volumeMl: 10, molarity: 0.1 });
// Add 20 mL 0.1 M KI (2.0 mmol)
goldenVessel = mixChemicals(goldenVessel, { substanceId: 'ki', volumeMl: 20, molarity: 0.1 });

const pbi2G = goldenVessel.precipitateGrams['pbi2'] ?? 0;
// 1 mmol PbI2 = 0.461 g
assert(Math.abs(pbi2G - 0.461) < 0.05, `Golden rain PbI2 precipitate formed (${pbi2G.toFixed(3)} g)`);
assert(goldenVessel.dominantColor.includes('234, 179, 8'), `Color turned golden yellow (${goldenVessel.dominantColor})`);

console.log(`\n=============================================`);
console.log(`✨ Suite Complete: ${passedTests} / ${totalTests} assertions PASSED!`);
console.log(`=============================================\n`);
