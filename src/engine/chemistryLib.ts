/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Chemistry Function Library
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Reusable chemistry functions referenced by experiment configs.
 *  Configs reference these by name (string), the engine looks them up
 *  at runtime from the registries exported below.
 *
 *  All functions are PURE — no side effects, no DOM, no React.
 * ═══════════════════════════════════════════════════════════════════
 */

// ── Color Model Functions ────────────────────────────────────────
//
// Each color model takes (variables, flags, args) and returns a CSS color string.
// Configs reference these by name via `chemistry.colorModel`.

export type ColorModelFn = (
  variables: Record<string, number>,
  flags: Record<string, boolean>,
  args?: Record<string, unknown>
) => string;

/**
 * Phenolphthalein indicator color model.
 * Expects variables: { volumeAdded }
 * Expects flags: { hasIndicator }
 * Expects args: { equivalenceVolume, overshootVolume? }
 */
function phenolphthalein(
  variables: Record<string, number>,
  flags: Record<string, boolean>,
  args?: Record<string, unknown>
): string {
  const volume = variables['volumeAdded'] ?? 0;
  const hasIndicator = flags['hasIndicator'] ?? false;
  const equivalence = (args?.['equivalenceVolume'] as number) ?? 25;
  const overshoot = (args?.['overshootVolume'] as number) ?? (equivalence + 1);
  const changeStart = equivalence * 0.9;

  if (!hasIndicator || volume < changeStart) {
    return 'rgba(224, 242, 254, 0.35)';
  }

  if (volume <= equivalence) {
    const t = (volume - changeStart) / (equivalence - changeStart);
    const lightness = 95 - t * 13;
    const opacity = 0.35 + t * 0.4;
    return `hsla(335, 85%, ${lightness}%, ${opacity})`;
  }

  if (volume <= overshoot) {
    const t = (volume - equivalence) / (overshoot - equivalence);
    const lightness = 82 - t * 35;
    const opacity = 0.75 + t * 0.25;
    return `hsla(330, 95%, ${lightness}%, ${opacity})`;
  }

  return 'hsla(330, 95%, 45%, 0.95)';
}

/**
 * Litmus indicator color model.
 * Expects variables: { pH }
 * Returns red (acidic), purple (neutral), blue (basic).
 */
function litmus(
  variables: Record<string, number>,
  _flags: Record<string, boolean>,
): string {
  const pH = variables['pH'] ?? 7;

  if (pH < 4.5) return 'hsla(0, 80%, 55%, 0.85)';      // red
  if (pH < 6.5) return 'hsla(0, 60%, 65%, 0.7)';        // pinkish-red
  if (pH <= 8.0) return 'hsla(270, 40%, 55%, 0.75)';     // purple
  if (pH <= 10) return 'hsla(240, 60%, 55%, 0.8)';       // blue-ish
  return 'hsla(230, 70%, 50%, 0.85)';                     // deep blue
}

/**
 * Methyl orange indicator color model.
 * Red below pH 3.1, orange at 3.1-4.4, yellow above 4.4.
 */
function methylOrange(
  variables: Record<string, number>,
  _flags: Record<string, boolean>,
): string {
  const pH = variables['pH'] ?? 7;

  if (pH < 3.1) return 'hsla(0, 85%, 50%, 0.85)';       // red
  if (pH < 4.4) {
    const t = (pH - 3.1) / (4.4 - 3.1);
    const hue = t * 30;
    return `hsla(${hue}, 90%, 55%, 0.8)`;                 // red → orange
  }
  return 'hsla(45, 95%, 55%, 0.8)';                       // yellow
}

/**
 * Universal indicator color model — full pH spectrum.
 */
function universalIndicator(
  variables: Record<string, number>,
  _flags: Record<string, boolean>,
): string {
  const pH = variables['pH'] ?? 7;
  const clampedpH = Math.max(0, Math.min(14, pH));

  // Maps pH 0-14 to a smooth hue gradient: red(0) → orange(3) → yellow(5) → green(7) → blue(10) → indigo(12) → violet(14)
  const hueMap: [number, number][] = [
    [0, 0], [2, 15], [4, 45], [6, 90], [7, 120],
    [8, 180], [10, 230], [12, 260], [14, 280],
  ];

  let hue = 0;
  for (let i = 0; i < hueMap.length - 1; i++) {
    const [pH1, h1] = hueMap[i];
    const [pH2, h2] = hueMap[i + 1];
    if (clampedpH >= pH1 && clampedpH <= pH2) {
      const t = (clampedpH - pH1) / (pH2 - pH1);
      hue = h1 + t * (h2 - h1);
      break;
    }
  }

  return `hsla(${Math.round(hue)}, 80%, 50%, 0.85)`;
}

/**
 * Colorless aqueous solution (no indicator present or pre-reaction).
 */
function colorless(): string {
  return 'rgba(224, 242, 254, 0.35)';
}

/**
 * Precipitate color model.
 * Expects args: { precipitateType } — maps to known precipitate colors.
 * Expects flags: { precipitateFormed, isMixing }
 */
function precipitate(
  _variables: Record<string, number>,
  flags: Record<string, boolean>,
  args?: Record<string, unknown>,
): string {
  const formed = flags['precipitateFormed'] ?? false;
  const mixing = flags['isMixing'] ?? false;
  const precipType = (args?.['precipitateType'] as string) ?? 'white';

  if (mixing) return 'rgba(230, 230, 230, 0.85)';
  if (!formed) return 'rgba(224, 242, 254, 0.35)';

  const precipitateColors: Record<string, string> = {
    white: 'rgba(240, 240, 245, 0.92)',         // BaSO₄, AgCl, PbSO₄
    yellow: 'hsla(48, 90%, 65%, 0.85)',          // PbI₂, As₂S₃
    green: 'hsla(140, 60%, 50%, 0.8)',           // Fe(OH)₂, Cu₂(OH)₂CO₃
    blue: 'hsla(210, 70%, 55%, 0.8)',            // Cu(OH)₂
    brown: 'hsla(25, 60%, 40%, 0.85)',           // Fe(OH)₃
    red: 'hsla(5, 75%, 45%, 0.85)',              // Fe₂O₃, Cu₂O
    black: 'hsla(0, 0%, 20%, 0.9)',              // CuS, PbS, FeS
    orange: 'hsla(25, 85%, 55%, 0.85)',          // Sb₂S₃
  };

  return precipitateColors[precipType] ?? precipitateColors['white'];
}


/**
 * Eriochrome Black T (EBT) indicator color model for EDTA hardness titration.
 * Wine red in presence of free Ca²⁺/Mg²⁺ (pre-endpoint),
 * turning sky-blue at EDTA complexation equivalence.
 */
function ebtIndicator(
  _variables: Record<string, number>,
  flags: Record<string, boolean>,
): string {
  const atEndpoint = flags['edtaEndpoint'] ?? false;
  if (atEndpoint) {
    return 'rgba(56, 189, 248, 0.9)'; // Sky blue
  }
  return 'rgba(159, 18, 57, 0.88)'; // Wine red
}

/**
 * Starch-Iodine indicator for iodometric titrations (Winkler DO).
 * Deep intense blue-black when I₂ is present, turning crystal clear / colorless at endpoint.
 */
function starchIodine(
  _variables: Record<string, number>,
  flags: Record<string, boolean>,
): string {
  const titrated = flags['iodineTitrated'] ?? false;
  if (titrated) {
    return 'rgba(56, 189, 248, 0.25)'; // Clear / colorless
  }
  return 'rgba(30, 58, 138, 0.92)'; // Deep midnight blue complex
}

/**
 * Potassium Chromate indicator (Mohr's chloride method).
 * Bright yellow in NaCl solution, forming brick-red Ag₂CrO₄ precipitate at endpoint.
 */
function potassiumChromate(
  _variables: Record<string, number>,
  flags: Record<string, boolean>,
): string {
  const atEndpoint = flags['brickRedFormed'] ?? false;
  if (atEndpoint) {
    return 'rgba(185, 28, 28, 0.9)'; // Brick-red Ag₂CrO₄
  }
  return 'rgba(250, 204, 21, 0.85)'; // Yellow K₂CrO₄
}

/**
 * Oil Acid Value color model:
 * Golden yellow oil -> lighter amber with neutral alcohol -> faint permanent pink at 0.1 N KOH endpoint.
 */
function oilAcidValue(
  _variables: Record<string, number>,
  flags: Record<string, boolean>,
): string {
  if (flags['titrationDone']) {
    return 'rgba(244, 114, 182, 0.88)'; // Faint persistent rose pink endpoint
  }
  if (flags['alcoholAdded']) {
    return 'rgba(245, 158, 11, 0.72)'; // Warm translucent amber blend
  }
  if (flags['oilAdded']) {
    return 'rgba(234, 179, 8, 0.88)'; // Golden vegetable oil
  }
  return 'rgba(224, 242, 254, 0.35)';
}

// ── Color Model Registry ─────────────────────────────────────────

export const COLOR_MODELS: Record<string, ColorModelFn> = {
  phenolphthalein,
  litmus,
  methylOrange,
  universalIndicator,
  colorless,
  precipitate,
  ebtIndicator,
  starchIodine,
  potassiumChromate,
  oilAcidValue,
};


// ── Computation Functions ────────────────────────────────────────
//
// Referenced by FormulaConfig.computeFn in experiment configs.
// Each receives the full variables map and returns a number.

export type ComputeFn = (variables: Record<string, number>) => number;

/** C_unknown = (V_titrant × M_titrant) / V_analyte */
function titrationConcentration(variables: Record<string, number>): number {
  const vTitrant = variables['endpointVolume'] ?? variables['volumeAdded'] ?? 0;
  const mTitrant = variables['titrantMolarity'] ?? 0.1;
  const vAnalyte = variables['analyteVolume'] ?? 25;
  if (vAnalyte === 0) return 0;
  return (vTitrant * mTitrant) / vAnalyte;
}

/** ΔM = |M₂ - M₁| */
function deltaMass(variables: Record<string, number>): number {
  const m1 = variables['initialMass'] ?? 0;
  const m2 = variables['finalMass'] ?? 0;
  return Math.abs(m2 - m1);
}

/** Deviation % = (|M₂ - M₁| / M₁) × 100 */
function deviationPercent(variables: Record<string, number>): number {
  const m1 = variables['initialMass'] ?? 0;
  const m2 = variables['finalMass'] ?? 0;
  if (m1 === 0) return 0;
  return (Math.abs(m2 - m1) / m1) * 100;
}

/** Moles = mass / molar_mass */
function molesFromMass(variables: Record<string, number>): number {
  const mass = variables['sampleMass'] ?? 0;
  const molarMass = variables['molarMass'] ?? 1;
  if (molarMass === 0) return 0;
  return mass / molarMass;
}

/** Molarity = moles / volume_in_L */
function molarityFromMoles(variables: Record<string, number>): number {
  const moles = variables['moles'] ?? 0;
  const volumeL = (variables['solutionVolume'] ?? 1000) / 1000;
  if (volumeL === 0) return 0;
  return moles / volumeL;
}

/** Dilution: C₁V₁ = C₂V₂ → C₂ = (C₁ × V₁) / V₂ */
function dilutionConcentration(variables: Record<string, number>): number {
  const c1 = variables['initialConcentration'] ?? 0;
  const v1 = variables['initialVolume'] ?? 0;
  const v2 = variables['finalVolume'] ?? 1;
  if (v2 === 0) return 0;
  return (c1 * v1) / v2;
}

/** Ideal gas volume: V = nRT/P (returns in liters) */
function idealGasVolume(variables: Record<string, number>): number {
  const moles = variables['gasMoles'] ?? 0;
  const tempK = (variables['temperature'] ?? 25) + 273.15;
  const pressureAtm = variables['pressure'] ?? 1;
  const R = 0.08206; // L·atm/(mol·K)
  if (pressureAtm === 0) return 0;
  return (moles * R * tempK) / pressureAtm;
}

/** Percent yield = (actual / theoretical) × 100 */
function percentYield(variables: Record<string, number>): number {
  const actual = variables['actualYield'] ?? 0;
  const theoretical = variables['theoreticalYield'] ?? 1;
  if (theoretical === 0) return 0;
  return (actual / theoretical) * 100;
}

/** Mass of solution from density × volume */
function massFromDensityVolume(variables: Record<string, number>): number {
  const density = variables['density'] ?? 1;
  const volume = variables['volume'] ?? 0;
  return density * volume;
}

/** pH from H⁺ concentration: pH = -log₁₀([H⁺]) */
function phFromConcentration(variables: Record<string, number>): number {
  const hConc = variables['hConcentration'] ?? 1e-7;
  if (hConc <= 0) return 7;
  return -Math.log10(hConc);
}

/**
 * Strong Acid + Strong Base Titration Curve
 * Computes pH based on volume of titrant added.
 * Expects variables: { volumeAdded, analyteVolume, titrantMolarity, analyteMolarity }
 */
function phTitrationCurve(variables: Record<string, number>): number {
  const vAdded = variables['volumeAdded'] ?? 0;
  const vAnalyte = variables['analyteVolume'] ?? 20;
  const mTitrant = variables['titrantMolarity'] ?? 0.1;
  const mAnalyte = variables['analyteMolarity'] ?? 0.1;

  const nInitialH = (vAnalyte * mAnalyte) / 1000;
  const nAddedOH = (vAdded * mTitrant) / 1000;
  const totalVolume = (vAnalyte + vAdded) / 1000;

  if (nAddedOH < nInitialH) {
    // Before equivalence
    const hConc = (nInitialH - nAddedOH) / totalVolume;
    return -Math.log10(Math.max(1e-12, hConc));
  } else if (Math.abs(nAddedOH - nInitialH) < 1e-9) {
    // Equivalence point
    return 7.0;
  } else {
    // After equivalence
    const ohConc = (nAddedOH - nInitialH) / totalVolume;
    const pOH = -Math.log10(Math.max(1e-12, ohConc));
    return 14 - pOH;
  }
}

/**
 * Conductometric Titration Curve (Strong Acid + Strong Base)
 * G = Σ (c_i * λ_i) / 1000  (mS/cm approximation)
 * λ_H = 350, λ_OH = 199, λ_Na = 50, λ_Cl = 76
 */
function conductometricCurve(variables: Record<string, number>): number {
  const vAdded = variables['volumeAdded'] ?? 0;
  const vAnalyte = variables['analyteVolume'] ?? 10;
  const mTitrant = variables['titrantMolarity'] ?? 0.1;
  const mAnalyte = variables['analyteMolarity'] ?? 0.1;
  const vH2O = variables['waterVolume'] ?? 40; // dilution water

  const totalVolML = vAnalyte + vAdded + vH2O;
  const totalVolL = totalVolML / 1000;

  const nInitialH = (vAnalyte * mAnalyte) / 1000;
  const nInitialCl = nInitialH;
  const nAddedNa = (vAdded * mTitrant) / 1000;
  const nAddedOH = nAddedNa;

  let g = 0;
  // Cl- is always present
  g += (nInitialCl / totalVolL) * 76.3;
  // Na+ is always present from titrant
  g += (nAddedNa / totalVolL) * 50.1;

  if (nAddedOH < nInitialH) {
    // Before equivalence: H+ remaining
    g += ((nInitialH - nAddedOH) / totalVolL) * 349.8;
  } else {
    // After equivalence: OH- excess
    g += ((nAddedOH - nInitialH) / totalVolL) * 198.3;
  }

  // Adjust scale to match target mS/cm ranges (approx factor)
  return Math.round(g * 0.1 * 100) / 100;
}

/** Molar mass of Hydrogen gas H2 (2.016 g/mol) */
function hydrogenMolarMass(variables?: Record<string, number>): number {
  return variables?.['h2MolarMass'] ?? 2.016;
}

/** Viscosity by Ostwald's Viscometer: eta_A = (t_A * d_A) / (t_W * d_W) * eta_W (poise) */
function viscosityOstwald(variables: Record<string, number>): number {
  const tA = variables['flowTimeSample'] ?? 0;
  const dA = variables['densitySample'] ?? 0.79;
  const tW = variables['flowTimeWater'] ?? 0;
  const dW = variables['densityWater'] ?? 0.997;
  const etaW = variables['viscosityWater'] ?? 0.0089; // poise for water at 25°C

  // If required measured flow times or physical parameters are missing / not yet measured, return NaN
  if (tA <= 0 || tW <= 0 || dA <= 0 || dW <= 0 || etaW <= 0) {
    return NaN;
  }

  return ((tA * dA) / (tW * dW)) * etaW;
}

/** HCl Strength (g/L) = Normality * 36.5 */
function hclStrength(variables: Record<string, number>): number {
  const n = variables['normality'] ?? 0.1;
  return n * 36.5;
}

/** Chloride content (mg/L or ppm) = (N_AgNO3 * V * 35.5 * 1000) / V_sample */
function chlorideMohr(variables: Record<string, number>): number {
  const nAg = variables['normalityAgNO3'] ?? 0.02;
  const v = variables['buretteReading'] ?? 8.2;
  const vSample = variables['sampleVolume'] ?? 10;
  if (vSample === 0) return 0;
  return (nAg * v * 35.5 * 1000) / vSample;
}

/** Mineral Acidity (ppm) = 10 * Y */
function waterAcidityMineral(variables: Record<string, number>): number {
  const y = variables['volumeY'] ?? 2.4;
  return 10 * y;
}

/** Total Acidity (ppm) = 10 * Z */
function waterAcidityTotal(variables: Record<string, number>): number {
  const z = variables['volumeZ'] ?? 5.5;
  return 10 * z;
}

/** Acidity (ppm) = volumeAdded * 10 */
function waterAcidity(variables: Record<string, number>): number {
  const v = variables['volumeZ'] ?? variables['volumeY'] ?? variables['naohVolume'] ?? variables['volumeAdded'] ?? 5.5;
  return v * 10;
}

/** Alkalinity P (ppm) = 10 * A */
function waterAlkalinityP(variables: Record<string, number>): number {
  const a = variables['volumeA'] ?? 4.2;
  return 10 * a;
}

/** Alkalinity Total M (ppm) = 10 * (A + B) */
function waterAlkalinityM(variables: Record<string, number>): number {
  const a = variables['volumeA'] ?? 4.2;
  const b = variables['volumeB'] ?? 8.6;
  return 10 * (a + b);
}

/** Acid value of oil (mg KOH/g oil) = (V * 5.6) / W */
function acidValueOfOil(variables: Record<string, number>): number {
  const v = variables['kohVolume'] ?? 3.5;
  const w = variables['oilMass'] ?? 5.0;
  if (w === 0) return 0;
  return (v * 5.6) / w;
}

/** Dissolved Oxygen DO (ppm) = 0.8 * V2 */
function dissolvedOxygenWinkler(variables: Record<string, number>): number {
  const v2 = variables['thiosulphateVolume'] ?? 6.5;
  return 0.8 * v2;
}

/** Total Hardness of water (ppm) = (V2 / V1) * 1000 */
function waterHardnessEdta(variables: Record<string, number>): number {
  const v1 = variables['stdEdtaVolume'] ?? 20.0;
  const v2 = variables['sampleEdtaVolume'] ?? 15.0;
  if (v1 === 0) return 0;
  return (v2 / v1) * 1000;
}

// ── Compute Function Registry ────────────────────────────────────

export const COMPUTE_FUNCTIONS: Record<string, ComputeFn> = {
  titrationConcentration,
  deltaMass,
  deviationPercent,
  molesFromMass,
  molarityFromMoles,
  dilutionConcentration,
  idealGasVolume,
  percentYield,
  massFromDensityVolume,
  phFromConcentration,
  phTitrationCurve,
  conductometricCurve,
  hydrogenMolarMass,
  viscosityOstwald,
  hclStrength,
  chlorideMohr,
  waterAcidity,
  waterAcidityMineral,
  waterAcidityTotal,
  waterAlkalinityP,
  waterAlkalinityM,
  acidValueOfOil,
  dissolvedOxygenWinkler,
  waterHardnessEdta,
};



// ── Utility Functions ────────────────────────────────────────────

/**
 * Get the color of a solution given an experiment config and current state.
 */
export function getSolutionColor(
  colorModelName: string | undefined,
  variables: Record<string, number>,
  flags: Record<string, boolean>,
  colorModelArgs?: Record<string, unknown>,
): string {
  if (!colorModelName) return colorless();
  const fn = COLOR_MODELS[colorModelName];
  if (!fn) {
    console.warn(`[chemistryLib] Unknown color model: "${colorModelName}"`);
    return colorless();
  }
  return fn(variables, flags, colorModelArgs);
}

/**
 * Compute a named formula's expected value.
 */
export function computeFormula(
  formulaFnName: string,
  variables: Record<string, number>,
): number {
  const fn = COMPUTE_FUNCTIONS[formulaFnName];
  if (!fn) {
    console.warn(`[chemistryLib] Unknown compute function: "${formulaFnName}"`);
    return 0;
  }
  return fn(variables);
}

/**
 * Generate a human-readable worked formula string.
 */
export function generateWorkedFormula(
  label: string,
  displayFormula: string,
  variables: Record<string, number>,
  inputs: string[],
  result: number,
  unit: string,
): string {
  let worked = `${label}\n${displayFormula}\n`;
  worked += `Substituting: ${inputs.map(k => `${k} = ${(variables[k] ?? 0).toFixed(2)}`).join(', ')}\n`;
  worked += `= ${result.toFixed(4)} ${unit}`;
  return worked;
}

/**
 * Calculate reaction progress (0 to 1+) for titration-style experiments.
 * Returns 0 at start, 1 at equivalence, >1 past equivalence.
 */
export function reactionProgress(
  volumeAdded: number,
  equivalenceVolume: number,
): number {
  if (equivalenceVolume <= 0) return 0;
  return volumeAdded / equivalenceVolume;
}

/**
 * Generate realistic mass values with measurement noise.
 * Used by conservation-type experiments.
 */
export function generateMassWithNoise(
  baseMass: number,
  noiseRange: number = 0.5,
): number {
  const noise = (Math.random() - 0.5) * noiseRange;
  return Math.round((baseMass + noise) * 100) / 100;
}

/**
 * Calculate mass of multiple components.
 */
export function calculateTotalMass(
  components: Array<{ mass: number; present: boolean }>,
): number {
  const total = components
    .filter(c => c.present)
    .reduce((sum, c) => sum + c.mass, 0);
  return Math.round(total * 100) / 100;
}
