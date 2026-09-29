/**
 * ═══════════════════════════════════════════════════════════════════
 *  VirtualVigyan — Reaction Matrix & Stoichiometric Rule Base
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Encodes chemical interaction patterns, thermodynamic enthalpies,
 *  precipitate colors, gas evolution dynamics, and hazard warnings.
 * ═══════════════════════════════════════════════════════════════════
 */

export type ReactionCategory =
  | 'neutralization'
  | 'precipitation'
  | 'displacement'
  | 'gas_evolution'
  | 'redox'
  | 'complexation'
  | 'thermal_hazard';

export interface StoichiometricComponent {
  substanceId: string;
  coeff: number;
}

export interface ReactionExplanationContext {
  equation: string;
  reactantsUsed: { name: string; moles: number }[];
  productsFormed: { name: string; moles: number; grams?: number }[];
  limitingReagentName: string;
  excessReagents: { name: string; remainingMoles: number }[];
  deltaT: number;
}

export interface ReactionRule {
  id: string;
  name: string;
  equation: string;
  category: ReactionCategory;
  reactants: StoichiometricComponent[];
  products: StoichiometricComponent[];
  deltaH: number; // kJ per mole of reaction (exothermic < 0, endothermic > 0)
  precipitateSubstanceId?: string;
  gasSubstanceId?: string;
  gasName?: string;
  colorShift?: string;
  hazardWarning?: string;
  explanation: (ctx: ReactionExplanationContext) => string;
}

export const REACTION_RULES: ReactionRule[] = [
  // ── Acid-Base Neutralization Reactions ──
  {
    id: 'hcl_naoh_neutralization',
    name: 'Hydrochloric Acid & Sodium Hydroxide Neutralization',
    equation: 'HCl + NaOH → NaCl + H₂O',
    category: 'neutralization',
    reactants: [
      { substanceId: 'hcl', coeff: 1 },
      { substanceId: 'naoh', coeff: 1 },
    ],
    products: [
      { substanceId: 'nacl', coeff: 1 },
      { substanceId: 'h2o', coeff: 1 },
    ],
    deltaH: -57.3, // standard strong acid-strong base enthalpy (kJ/mol)
    explanation: (ctx) => {
      const excessText =
        ctx.excessReagents.length > 0
          ? ` Since ${ctx.excessReagents[0].name} was added in excess (${(ctx.excessReagents[0].remainingMoles * 1000).toFixed(2)} mmol unreacted), the solution remains ${ctx.excessReagents[0].name.includes('Acid') ? 'acidic' : 'alkaline'}.`
          : ' Both reagents reacted in exact 1:1 stoichiometric equivalence, reaching the neutral equivalence point (pH ~ 7.00).';
      return `Neutralization occurred between HCl and NaOH yielding dissolved table salt (NaCl) and water. The reaction is exothermic (ΔH = -57.3 kJ/mol), warming the vessel by +${ctx.deltaT.toFixed(1)}°C.${excessText}`;
    },
  },
  {
    id: 'h2so4_naoh_neutralization',
    name: 'Sulfuric Acid & Sodium Hydroxide Neutralization',
    equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
    category: 'neutralization',
    reactants: [
      { substanceId: 'h2so4', coeff: 1 },
      { substanceId: 'naoh', coeff: 2 },
    ],
    products: [
      { substanceId: 'na2so4', coeff: 1 },
      { substanceId: 'h2o', coeff: 2 },
    ],
    deltaH: -114.6,
    explanation: (ctx) => {
      const excess = ctx.excessReagents[0]
        ? ` ${ctx.excessReagents[0].name} remains in excess (${(ctx.excessReagents[0].remainingMoles * 1000).toFixed(2)} mmol left).`
        : ' Perfect 1:2 stoichiometric equivalence achieved.';
      return `Diprotic sulfuric acid was neutralized by 2 equivalents of sodium hydroxide, releasing significant heat (ΔT = +${ctx.deltaT.toFixed(1)}°C).${excess}`;
    },
  },
  {
    id: 'ch3cooh_naoh_neutralization',
    name: 'Acetic Acid & Sodium Hydroxide Neutralization',
    equation: 'CH₃COOH + NaOH → CH₃COONa + H₂O',
    category: 'neutralization',
    reactants: [
      { substanceId: 'ch3cooh', coeff: 1 },
      { substanceId: 'naoh', coeff: 1 },
    ],
    products: [
      { substanceId: 'ch3coona', coeff: 1 },
      { substanceId: 'h2o', coeff: 1 },
    ],
    deltaH: -55.8,
    explanation: (ctx) => {
      return `Weak acetic acid was neutralized by NaOH forming sodium acetate buffer/salt. Vessel warmed by +${ctx.deltaT.toFixed(1)}°C. Limiting reagent was ${ctx.limitingReagentName}.`;
    },
  },
  {
    id: 'oxalic_acid_naoh_neutralization',
    name: 'Oxalic Acid & Sodium Hydroxide Standardization',
    equation: 'H₂C₂O₄ + 2NaOH → Na₂C₂O₄ + 2H₂O',
    category: 'neutralization',
    reactants: [
      { substanceId: 'oxalic_acid', coeff: 1 },
      { substanceId: 'naoh', coeff: 2 },
    ],
    products: [
      { substanceId: 'h2o', coeff: 2 },
    ],
    deltaH: -110.0,
    explanation: (ctx) => {
      return `Standardization reaction: 1 mole of dibasic oxalic acid consumed 2 moles of sodium hydroxide. Vessel ΔT = +${ctx.deltaT.toFixed(1)}°C. ${ctx.limitingReagentName} was completely consumed.`;
    },
  },

  // ── Carbonates & Gas Evolution Reactions ──
  {
    id: 'na2co3_hcl_effervescence',
    name: 'Sodium Carbonate & Hydrochloric Acid (CO₂ Evolution)',
    equation: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂(g)↑',
    category: 'gas_evolution',
    reactants: [
      { substanceId: 'na2co3', coeff: 1 },
      { substanceId: 'hcl', coeff: 2 },
    ],
    products: [
      { substanceId: 'nacl', coeff: 2 },
      { substanceId: 'h2o', coeff: 1 },
      { substanceId: 'co2', coeff: 1 },
    ],
    deltaH: -28.0,
    gasSubstanceId: 'co2',
    gasName: 'Carbon Dioxide Gas',
    explanation: (ctx) => {
      const co2M = ctx.productsFormed.find(p => p.name.includes('Carbon Dioxide') || p.name.includes('CO₂'))?.moles ?? 0;
      const co2Ml = (co2M * 24450).toFixed(1); // Standard molar gas volume at 25°C
      return `Brisk effervescence! Hydrochloric acid reacted rapidly with sodium carbonate, producing ~${co2Ml} mL of carbon dioxide gas bubbles (CO₂↑). Limiting reagent was ${ctx.limitingReagentName}.`;
    },
  },
  {
    id: 'nahco3_hcl_effervescence',
    name: 'Sodium Bicarbonate & Hydrochloric Acid (CO₂ Foaming)',
    equation: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂(g)↑',
    category: 'gas_evolution',
    reactants: [
      { substanceId: 'nahco3', coeff: 1 },
      { substanceId: 'hcl', coeff: 1 },
    ],
    products: [
      { substanceId: 'nacl', coeff: 1 },
      { substanceId: 'h2o', coeff: 1 },
      { substanceId: 'co2', coeff: 1 },
    ],
    deltaH: -14.2,
    gasSubstanceId: 'co2',
    gasName: 'Carbon Dioxide Gas',
    explanation: (_ctx) => {
      return `Vigorous foaming reaction! Baking soda (NaHCO₃) met acid, releasing rapid carbon dioxide gas bubbles that fizzed vigorously.`;
    },
  },
  {
    id: 'na2co3_h2so4_effervescence',
    name: 'Sodium Carbonate & Dilute Sulfuric Acid (CO₂ Evolution)',
    equation: 'Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂(g)↑',
    category: 'gas_evolution',
    reactants: [
      { substanceId: 'na2co3', coeff: 1 },
      { substanceId: 'h2so4', coeff: 1 },
    ],
    products: [
      { substanceId: 'na2so4', coeff: 1 },
      { substanceId: 'h2o', coeff: 1 },
      { substanceId: 'co2', coeff: 1 },
    ],
    deltaH: -28.0,
    gasSubstanceId: 'co2',
    gasName: 'Carbon Dioxide Gas',
    explanation: (ctx) => {
      const co2M = ctx.productsFormed.find(p => p.name.includes('Carbon Dioxide') || p.name.includes('CO₂'))?.moles ?? 0;
      const co2Ml = (co2M * 24450).toFixed(1);
      return `Brisk effervescence! Dilute sulfuric acid reacted with sodium carbonate, producing ~${co2Ml} mL of carbon dioxide gas bubbles (CO₂↑).`;
    },
  },
  {
    id: 'nahco3_h2so4_effervescence',
    name: 'Sodium Bicarbonate & Dilute Sulfuric Acid (CO₂ Foaming)',
    equation: '2NaHCO₃ + H₂SO₄ → Na₂SO₄ + 2H₂O + 2CO₂(g)↑',
    category: 'gas_evolution',
    reactants: [
      { substanceId: 'nahco3', coeff: 2 },
      { substanceId: 'h2so4', coeff: 1 },
    ],
    products: [
      { substanceId: 'na2so4', coeff: 1 },
      { substanceId: 'h2o', coeff: 2 },
      { substanceId: 'co2', coeff: 2 },
    ],
    deltaH: -28.4,
    gasSubstanceId: 'co2',
    gasName: 'Carbon Dioxide Gas',
    explanation: (ctx) => {
      const co2M = ctx.productsFormed.find(p => p.name.includes('Carbon Dioxide') || p.name.includes('CO₂'))?.moles ?? 0;
      const co2Ml = (co2M * 24450).toFixed(1);
      return `Vigorous foaming reaction! Baking soda (NaHCO₃) reacted with sulfuric acid, liberating ~${co2Ml} mL of CO₂ gas bubbles.`;
    },
  },
  {
    id: 'caco3_hcl_effervescence',
    name: 'Calcium Carbonate & Hydrochloric Acid (CO₂ Evolution)',
    equation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂(g)↑',
    category: 'gas_evolution',
    reactants: [
      { substanceId: 'caco3', coeff: 1 },
      { substanceId: 'hcl', coeff: 2 },
    ],
    products: [
      { substanceId: 'cacl2', coeff: 1 },
      { substanceId: 'h2o', coeff: 1 },
      { substanceId: 'co2', coeff: 1 },
    ],
    deltaH: -15.0,
    gasSubstanceId: 'co2',
    gasName: 'Carbon Dioxide Gas',
    explanation: (ctx) => {
      const co2M = ctx.productsFormed.find(p => p.name.includes('Carbon Dioxide') || p.name.includes('CO₂'))?.moles ?? 0;
      const co2Ml = (co2M * 24450).toFixed(1);
      return `Calcium carbonate reacted with HCl with active effervescence, producing ~${co2Ml} mL of carbon dioxide gas bubbles (CO₂↑).`;
    },
  },
  {
    id: 'caco3_h2so4_effervescence',
    name: 'Calcium Carbonate & Sulfuric Acid (CO₂ & CaSO₄ Precipitate)',
    equation: 'CaCO₃ + H₂SO₄ → CaSO₄(s)↓ + H₂O + CO₂(g)↑',
    category: 'gas_evolution',
    reactants: [
      { substanceId: 'caco3', coeff: 1 },
      { substanceId: 'h2so4', coeff: 1 },
    ],
    products: [
      { substanceId: 'caso4', coeff: 1 },
      { substanceId: 'h2o', coeff: 1 },
      { substanceId: 'co2', coeff: 1 },
    ],
    deltaH: -15.0,
    precipitateSubstanceId: 'caso4',
    gasSubstanceId: 'co2',
    gasName: 'Carbon Dioxide Gas',
    explanation: (_ctx) => {
      return `Reaction formed white CaSO₄ precipitate with brisk evolution of CO₂ gas bubbles.`;
    },
  },
  {
    id: 'nahco3_ch3cooh_effervescence',
    name: 'Baking Soda & Acetic Acid / Vinegar (CO₂ Foaming)',
    equation: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂(g)↑',
    category: 'gas_evolution',
    reactants: [
      { substanceId: 'nahco3', coeff: 1 },
      { substanceId: 'ch3cooh', coeff: 1 },
    ],
    products: [
      { substanceId: 'ch3coona', coeff: 1 },
      { substanceId: 'h2o', coeff: 1 },
      { substanceId: 'co2', coeff: 1 },
    ],
    deltaH: -12.5,
    gasSubstanceId: 'co2',
    gasName: 'Carbon Dioxide Gas',
    explanation: (ctx) => {
      const co2M = ctx.productsFormed.find(p => p.name.includes('Carbon Dioxide') || p.name.includes('CO₂'))?.moles ?? 0;
      const co2Ml = (co2M * 24450).toFixed(1);
      return `Rapid foaming effervescence! Baking soda reacted with acetic acid to generate ~${co2Ml} mL of carbon dioxide gas (CO₂↑).`;
    },
  },

  // ── Single Displacement Reactions (Metals with Acids & Salts) ──
  {
    id: 'zn_hcl_displacement',
    name: 'Zinc Metal in Hydrochloric Acid (Hydrogen Evolution)',
    equation: 'Zn(s) + 2HCl → ZnCl₂ + H₂(g)↑',
    category: 'displacement',
    reactants: [
      { substanceId: 'zn', coeff: 1 },
      { substanceId: 'hcl', coeff: 2 },
    ],
    products: [
      { substanceId: 'zncl2', coeff: 1 },
      { substanceId: 'h2', coeff: 1 },
    ],
    deltaH: -153.9,
    gasSubstanceId: 'h2',
    gasName: 'Hydrogen Gas',
    hazardWarning: 'Hydrogen gas is highly flammable! Keep away from open flames.',
    explanation: (ctx) => {
      const h2M = ctx.productsFormed.find(p => p.name.includes('Hydrogen') || p.name.includes('H₂'))?.moles ?? 0;
      const h2Ml = (h2M * 24450).toFixed(1);
      const excess = ctx.excessReagents[0]
        ? ` ${ctx.excessReagents[0].name} remains in excess.`
        : '';
      return `Single displacement occurred: Zinc metal was oxidized by hydrogen ions, dissolving into clear ZnCl₂ and generating ~${h2Ml} mL of flammable hydrogen gas (H₂↑) with energetic fizzing. Exothermic warming: +${ctx.deltaT.toFixed(1)}°C.${excess}`;
    },
  },
  {
    id: 'zn_h2so4_displacement',
    name: 'Zinc Metal in Dilute Sulfuric Acid (Hydrogen Evolution)',
    equation: 'Zn(s) + H₂SO₄ → ZnSO₄ + H₂(g)↑',
    category: 'displacement',
    reactants: [
      { substanceId: 'zn', coeff: 1 },
      { substanceId: 'h2so4', coeff: 1 },
    ],
    products: [
      { substanceId: 'znso4', coeff: 1 },
      { substanceId: 'h2', coeff: 1 },
    ],
    deltaH: -153.9,
    gasSubstanceId: 'h2',
    gasName: 'Hydrogen Gas',
    hazardWarning: 'Hydrogen gas is highly flammable! Keep away from open flames.',
    explanation: (ctx) => {
      const h2M = ctx.productsFormed.find(p => p.name.includes('Hydrogen') || p.name.includes('H₂'))?.moles ?? 0;
      const h2Ml = (h2M * 24450).toFixed(1);
      const excess = ctx.excessReagents[0]
        ? ` ${ctx.excessReagents[0].name} remains in excess.`
        : '';
      return `Single displacement occurred: Zinc metal reacted with dilute sulfuric acid, dissolving into clear ZnSO₄ solution and liberating ~${h2Ml} mL of flammable hydrogen gas (H₂↑) with vigorous effervescence. Exothermic warming: +${ctx.deltaT.toFixed(1)}°C.${excess}`;
    },
  },
  {
    id: 'mg_hcl_displacement',
    name: 'Magnesium Ribbon in Hydrochloric Acid (Violent Fizzing)',
    equation: 'Mg(s) + 2HCl → MgCl₂ + H₂(g)↑',
    category: 'displacement',
    reactants: [
      { substanceId: 'mg', coeff: 1 },
      { substanceId: 'hcl', coeff: 2 },
    ],
    products: [
      { substanceId: 'mgcl2', coeff: 1 },
      { substanceId: 'h2', coeff: 1 },
    ],
    deltaH: -467.0,
    gasSubstanceId: 'h2',
    gasName: 'Hydrogen Gas',
    hazardWarning: 'Extremely vigorous reaction with intense heat and rapid hydrogen gas burst!',
    explanation: (ctx) => {
      return `Violent exothermic reaction! Magnesium rapidly dissolved in HCl, releasing intense bursts of H₂ gas bubbles and surging vessel temperature by +${ctx.deltaT.toFixed(1)}°C!`;
    },
  },
  {
    id: 'mg_h2so4_displacement',
    name: 'Magnesium Ribbon in Dilute Sulfuric Acid (Violent Fizzing)',
    equation: 'Mg(s) + H₂SO₄ → MgSO₄ + H₂(g)↑',
    category: 'displacement',
    reactants: [
      { substanceId: 'mg', coeff: 1 },
      { substanceId: 'h2so4', coeff: 1 },
    ],
    products: [
      { substanceId: 'mgso4', coeff: 1 },
      { substanceId: 'h2', coeff: 1 },
    ],
    deltaH: -467.0,
    gasSubstanceId: 'h2',
    gasName: 'Hydrogen Gas',
    hazardWarning: 'Extremely vigorous reaction with intense heat and rapid hydrogen gas burst!',
    explanation: (ctx) => {
      const h2M = ctx.productsFormed.find(p => p.name.includes('Hydrogen') || p.name.includes('H₂'))?.moles ?? 0;
      const h2Ml = (h2M * 24450).toFixed(1);
      return `Violent exothermic reaction! Magnesium rapidly reacted with dilute sulfuric acid, generating ~${h2Ml} mL of hydrogen gas (H₂↑) and heating the solution by +${ctx.deltaT.toFixed(1)}°C!`;
    },
  },
  {
    id: 'fe_hcl_displacement',
    name: 'Iron Metal in Hydrochloric Acid (Hydrogen Evolution)',
    equation: 'Fe(s) + 2HCl → FeCl₂ + H₂(g)↑',
    category: 'displacement',
    reactants: [
      { substanceId: 'fe', coeff: 1 },
      { substanceId: 'hcl', coeff: 2 },
    ],
    products: [
      { substanceId: 'fecl2', coeff: 1 },
      { substanceId: 'h2', coeff: 1 },
    ],
    deltaH: -87.9,
    gasSubstanceId: 'h2',
    gasName: 'Hydrogen Gas',
    hazardWarning: 'Hydrogen gas is flammable. Avoid open flames.',
    explanation: (ctx) => {
      const h2M = ctx.productsFormed.find(p => p.name.includes('Hydrogen') || p.name.includes('H₂'))?.moles ?? 0;
      const h2Ml = (h2M * 24450).toFixed(1);
      return `Iron metal slowly dissolved in hydrochloric acid forming pale green FeCl₂ and evolving ~${h2Ml} mL of hydrogen gas (H₂↑).`;
    },
  },
  {
    id: 'fe_h2so4_displacement',
    name: 'Iron Metal in Dilute Sulfuric Acid (Hydrogen Evolution)',
    equation: 'Fe(s) + H₂SO₄ → FeSO₄ + H₂(g)↑',
    category: 'displacement',
    reactants: [
      { substanceId: 'fe', coeff: 1 },
      { substanceId: 'h2so4', coeff: 1 },
    ],
    products: [
      { substanceId: 'feso4', coeff: 1 },
      { substanceId: 'h2', coeff: 1 },
    ],
    deltaH: -87.9,
    gasSubstanceId: 'h2',
    gasName: 'Hydrogen Gas',
    hazardWarning: 'Hydrogen gas is flammable. Avoid open flames.',
    explanation: (ctx) => {
      const h2M = ctx.productsFormed.find(p => p.name.includes('Hydrogen') || p.name.includes('H₂'))?.moles ?? 0;
      const h2Ml = (h2M * 24450).toFixed(1);
      return `Iron reacted with dilute sulfuric acid, forming green FeSO₄ and releasing ~${h2Ml} mL of hydrogen gas (H₂↑).`;
    },
  },
  {
    id: 'al_hcl_displacement',
    name: 'Aluminium Metal in Hydrochloric Acid (Hydrogen Evolution)',
    equation: '2Al(s) + 6HCl → 2AlCl₃ + 3H₂(g)↑',
    category: 'displacement',
    reactants: [
      { substanceId: 'al', coeff: 2 },
      { substanceId: 'hcl', coeff: 6 },
    ],
    products: [
      { substanceId: 'alcl3', coeff: 2 },
      { substanceId: 'h2', coeff: 3 },
    ],
    deltaH: -1004.0,
    gasSubstanceId: 'h2',
    gasName: 'Hydrogen Gas',
    hazardWarning: 'Vigorous bubbling and exothermic heat upon breakdown of oxide layer!',
    explanation: (ctx) => {
      const h2M = ctx.productsFormed.find(p => p.name.includes('Hydrogen') || p.name.includes('H₂'))?.moles ?? 0;
      const h2Ml = (h2M * 24450).toFixed(1);
      return `Aluminium reacted vigorously with HCl, generating ~${h2Ml} mL of hydrogen gas (H₂↑) with strong bubbling.`;
    },
  },
  {
    id: 'al_h2so4_displacement',
    name: 'Aluminium Metal in Dilute Sulfuric Acid (Hydrogen Evolution)',
    equation: '2Al(s) + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂(g)↑',
    category: 'displacement',
    reactants: [
      { substanceId: 'al', coeff: 2 },
      { substanceId: 'h2so4', coeff: 3 },
    ],
    products: [
      { substanceId: 'al2so43', coeff: 1 },
      { substanceId: 'h2', coeff: 3 },
    ],
    deltaH: -1004.0,
    gasSubstanceId: 'h2',
    gasName: 'Hydrogen Gas',
    hazardWarning: 'Vigorous bubbling and exothermic heat!',
    explanation: (ctx) => {
      const h2M = ctx.productsFormed.find(p => p.name.includes('Hydrogen') || p.name.includes('H₂'))?.moles ?? 0;
      const h2Ml = (h2M * 24450).toFixed(1);
      return `Aluminium dissolved in dilute sulfuric acid, releasing ~${h2Ml} mL of hydrogen gas (H₂↑).`;
    },
  },
  {
    id: 'zn_cuso4_displacement',
    name: 'Zinc Metal in Copper(II) Sulfate Solution',
    equation: 'Zn(s) + CuSO₄ → ZnSO₄ + Cu(s)↓',
    category: 'displacement',
    reactants: [
      { substanceId: 'zn', coeff: 1 },
      { substanceId: 'cuso4', coeff: 1 },
    ],
    products: [
      { substanceId: 'znso4', coeff: 1 },
      { substanceId: 'cu', coeff: 1 },
    ],
    deltaH: -218.7,
    precipitateSubstanceId: 'cu',
    colorShift: 'Fading cyan-blue to colorless with reddish-brown copper deposit',
    explanation: (ctx) => {
      const cuGrams = ctx.productsFormed.find(p => p.name.includes('Copper') || p.name.includes('Cu'))?.grams ?? 0;
      return `Redox displacement: Zinc displaced copper from solution. Spongy reddish-brown copper metal (~${cuGrams.toFixed(2)} g) deposited on the zinc, while the brilliant blue color of CuSO₄ faded as colorless ZnSO₄ formed. Vessel warmed by +${ctx.deltaT.toFixed(1)}°C.`;
    },
  },
  {
    id: 'fe_cuso4_displacement',
    name: 'Iron Metal in Copper(II) Sulfate Solution',
    equation: 'Fe(s) + CuSO₄ → FeSO₄ + Cu(s)↓',
    category: 'displacement',
    reactants: [
      { substanceId: 'fe', coeff: 1 },
      { substanceId: 'cuso4', coeff: 1 },
    ],
    products: [
      { substanceId: 'feso4', coeff: 1 },
      { substanceId: 'cu', coeff: 1 },
    ],
    deltaH: -152.0,
    precipitateSubstanceId: 'cu',
    colorShift: 'Cyan-blue turning pale green with reddish-brown copper coating',
    explanation: (_ctx) => {
      return `Iron nails displaced copper: A reddish-brown coating of copper metal formed on the iron surface, and the solution gradually shifted from sky-blue to pale green iron(II) sulfate (FeSO₄).`;
    },
  },

  // ── Precipitation & Double Displacement Reactions ──
  {
    id: 'bacl2_na2so4_precipitation',
    name: 'Barium Chloride & Sodium Sulfate Precipitation',
    equation: 'BaCl₂ + Na₂SO₄ → BaSO₄(s)↓ + 2NaCl',
    category: 'precipitation',
    reactants: [
      { substanceId: 'bacl2', coeff: 1 },
      { substanceId: 'na2so4', coeff: 1 },
    ],
    products: [
      { substanceId: 'baso4', coeff: 1 },
      { substanceId: 'nacl', coeff: 2 },
    ],
    deltaH: -24.5,
    precipitateSubstanceId: 'baso4',
    colorShift: 'Instant dense chalky-white precipitation',
    explanation: (ctx) => {
      const pptGrams = ctx.productsFormed.find(p => p.name.includes('Barium Sulfate'))?.grams ?? 0;
      const excess = ctx.excessReagents[0]
        ? ` ${ctx.excessReagents[0].name} remains dissolved in the supernatant.`
        : ' Both barium and sulfate ions were completely precipitated.';
      return `Double displacement occurred instantaneously: Ba²⁺ and SO₄²⁻ ions bonded to form ${pptGrams.toFixed(2)} g of insoluble, dense chalky-white barium sulfate (BaSO₄↓).${excess}`;
    },
  },
  {
    id: 'agno3_nacl_precipitation',
    name: 'Silver Nitrate & Sodium Chloride (Curdy AgCl Precipitate)',
    equation: 'AgNO₃ + NaCl → AgCl(s)↓ + NaNO₃',
    category: 'precipitation',
    reactants: [
      { substanceId: 'agno3', coeff: 1 },
      { substanceId: 'nacl', coeff: 1 },
    ],
    products: [
      { substanceId: 'agcl', coeff: 1 },
      { substanceId: 'nano3', coeff: 1 },
    ],
    deltaH: -65.5,
    precipitateSubstanceId: 'agcl',
    colorShift: 'Curdy white precipitate',
    explanation: (ctx) => {
      const agclG = ctx.productsFormed.find(p => p.name.includes('Silver Chloride'))?.grams ?? 0;
      return `Chloride test positive: Mixing silver nitrate with sodium chloride immediately produced ${agclG.toFixed(2)} g of curdy white silver chloride precipitate (AgCl↓), confirming the presence of chloride ions.`;
    },
  },
  {
    id: 'pb_no3_2_ki_precipitation',
    name: 'Lead Nitrate & Potassium Iodide (Golden Rain PbI₂)',
    equation: 'Pb(NO₃)₂ + 2KI → PbI₂(s)↓ + 2KNO₃',
    category: 'precipitation',
    reactants: [
      { substanceId: 'pb_no3_2', coeff: 1 },
      { substanceId: 'ki', coeff: 2 },
    ],
    products: [
      { substanceId: 'pbi2', coeff: 1 },
      { substanceId: 'kno3', coeff: 2 },
    ],
    deltaH: -61.2,
    precipitateSubstanceId: 'pbi2',
    colorShift: 'Dazzling golden yellow precipitate',
    explanation: (ctx) => {
      const pbi2G = ctx.productsFormed.find(p => p.name.includes('Lead') || p.name.includes('PbI₂'))?.grams ?? 0;
      return `Spectacular "Golden Rain" reaction: Colorless lead nitrate and potassium iodide reacted to yield ${pbi2G.toFixed(2)} g of dazzling, bright golden-yellow lead(II) iodide crystals (PbI₂↓).`;
    },
  },
  {
    id: 'cuso4_naoh_precipitation',
    name: 'Copper(II) Sulfate & Sodium Hydroxide Precipitation',
    equation: 'CuSO₄ + 2NaOH → Cu(OH)₂(s)↓ + Na₂SO₄',
    category: 'precipitation',
    reactants: [
      { substanceId: 'cuso4', coeff: 1 },
      { substanceId: 'naoh', coeff: 2 },
    ],
    products: [
      { substanceId: 'cu_oh2', coeff: 1 },
      { substanceId: 'na2so4', coeff: 1 },
    ],
    deltaH: -54.0,
    precipitateSubstanceId: 'cu_oh2',
    colorShift: 'Sky-blue gelatinous precipitate',
    explanation: (ctx) => {
      const cuoh2G = ctx.productsFormed.find(p => p.name.includes('Copper(II) Hydroxide'))?.grams ?? 0;
      return `Alkaline precipitation: Adding caustic soda to copper sulfate precipitated ${cuoh2G.toFixed(2)} g of pale blue gelatinous copper(II) hydroxide Cu(OH)₂↓.`;
    },
  },
  {
    id: 'fecl3_naoh_precipitation',
    name: 'Iron(III) Chloride & Sodium Hydroxide (Rust Precipitate)',
    equation: 'FeCl₃ + 3NaOH → Fe(OH)₃(s)↓ + 3NaCl',
    category: 'precipitation',
    reactants: [
      { substanceId: 'fecl3', coeff: 1 },
      { substanceId: 'naoh', coeff: 3 },
    ],
    products: [
      { substanceId: 'fe_oh3', coeff: 1 },
      { substanceId: 'nacl', coeff: 3 },
    ],
    deltaH: -86.0,
    precipitateSubstanceId: 'fe_oh3',
    colorShift: 'Reddish-brown foxy rust precipitate',
    explanation: (ctx) => {
      const feoh3G = ctx.productsFormed.find(p => p.name.includes('Iron(III) Hydroxide'))?.grams ?? 0;
      return `Hydroxide precipitation: Ferric ions reacted with hydroxide yielding ${feoh3G.toFixed(2)} g of reddish-brown rust-like Fe(OH)₃↓ precipitate.`;
    },
  },

  // ── Limewater Carbon Dioxide Confirmation Test ──
  {
    id: 'ca_oh2_co2_limewater_test',
    name: 'Limewater Carbon Dioxide Confirmation',
    equation: 'Ca(OH)₂ + CO₂ → CaCO₃(s)↓ + H₂O',
    category: 'gas_evolution',
    reactants: [
      { substanceId: 'ca_oh2', coeff: 1 },
      { substanceId: 'co2', coeff: 1 },
    ],
    products: [
      { substanceId: 'caco3', coeff: 1 },
      { substanceId: 'h2o', coeff: 1 },
    ],
    deltaH: -113.0,
    precipitateSubstanceId: 'caco3',
    colorShift: 'Clear limewater turns milky white',
    explanation: (_ctx) => {
      return `Classic Limewater Test: Carbon dioxide gas bubbled through calcium hydroxide solution, forming a suspension of fine white calcium carbonate (CaCO₃↓) that made the liquid cloudy milky white.`;
    },
  },

  // ── Thiosulfate Acid Decomposition (Colloidal Turbidity Clock) ──
  {
    id: 'na2s2o3_hcl_decomposition',
    name: 'Sodium Thiosulfate & Hydrochloric Acid Turbidity Reaction',
    equation: 'Na₂S₂O₃ + 2HCl → 2NaCl + H₂O + SO₂(g)↑ + S(s)↓',
    category: 'precipitation',
    reactants: [
      { substanceId: 'na2s2o3', coeff: 1 },
      { substanceId: 'hcl', coeff: 2 },
    ],
    products: [
      { substanceId: 'nacl', coeff: 2 },
      { substanceId: 'h2o', coeff: 1 },
      { substanceId: 'so2', coeff: 1 },
      { substanceId: 's_solid', coeff: 1 },
    ],
    deltaH: -42.0,
    precipitateSubstanceId: 's_solid',
    gasSubstanceId: 'so2',
    gasName: 'Sulfur Dioxide Gas',
    colorShift: 'Gradually turns turbid yellow-white colloidal milk',
    hazardWarning: 'Produces choking sulfur dioxide gas (SO₂). Ensure good ventilation.',
    explanation: (_ctx) => {
      return `Chemical kinetics / Turbidity reaction: Thiosulfate decomposed in acid to liberate finely dispersed colloidal sulfur (S↓), clouding the solution to opaque milky-yellow while releasing pungent SO₂ gas.`;
    },
  },
  {
    id: 'na2s2o3_h2so4_decomposition',
    name: 'Sodium Thiosulfate & Sulfuric Acid Turbidity Reaction',
    equation: 'Na₂S₂O₃ + H₂SO₄ → Na₂SO₄ + H₂O + SO₂(g)↑ + S(s)↓',
    category: 'precipitation',
    reactants: [
      { substanceId: 'na2s2o3', coeff: 1 },
      { substanceId: 'h2so4', coeff: 1 },
    ],
    products: [
      { substanceId: 'na2so4', coeff: 1 },
      { substanceId: 'h2o', coeff: 1 },
      { substanceId: 'so2', coeff: 1 },
      { substanceId: 's_solid', coeff: 1 },
    ],
    deltaH: -42.0,
    precipitateSubstanceId: 's_solid',
    gasSubstanceId: 'so2',
    gasName: 'Sulfur Dioxide Gas',
    colorShift: 'Gradually turns turbid yellow-white colloidal milk',
    hazardWarning: 'Produces choking sulfur dioxide gas (SO₂). Ensure good ventilation.',
    explanation: (_ctx) => {
      return `Thiosulfate decomposed in dilute sulfuric acid, releasing sulfur dioxide gas (SO₂↑) and forming milky-yellow colloidal sulfur precipitate.`;
    },
  },
];
