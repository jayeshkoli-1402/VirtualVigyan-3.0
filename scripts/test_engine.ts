import assert from 'node:assert';
import {
  getFlaskColor,
  getColorDescription,
  calculateExpectedConcentration,
  ENDPOINT_ML,
  OVERSHOOT_ML,
} from '../src/engine/chemistryRules';
import {
  canDropOnZone,
  canMarkEndpoint,
  canOperateStopcock,
  canDrawPipette,
  canDispensePipette,
} from '../src/engine/validation';
import {
  titrationReducer,
  initialState as titrationInitialState,
  Step as TitrationStep,
} from '../src/engine/titrationState';
import {
  conservationReducer,
  conservationInitialState,
  ConservationStep,
} from '../src/engine/conservationState';
import {
  canSuspendTube,
  canSealFlask,
  canPlaceOnBalance,
  canMixReactants,
  canWeighFinal,
  computeScore,
} from '../src/engine/conservationValidation';
import {
  calculateLiveMass,
  getObservationDescription,
} from '../src/engine/conservationRules';

console.log('🧪 Starting VirtualVigyan Engine Unit Tests...\n');

let passCount = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ── 1. Chemistry Rules ──
console.log('--- Test Suite 1: Chemistry Rules & Colors ---');
test('getFlaskColor returns colorless when indicator is missing', () => {
  const color = getFlaskColor(ENDPOINT_ML, false);
  assert.strictEqual(color, 'rgba(224, 242, 254, 0.35)');
});

test('getColorDescription identifies acidic solution', () => {
  const desc = getColorDescription(10, true);
  assert.strictEqual(desc, 'Colorless acidic solution');
});

test('getColorDescription identifies exact endpoint', () => {
  const desc = getColorDescription(ENDPOINT_ML, true);
  assert.strictEqual(desc, 'Pale persistent pink (Endpoint)');
});

test('getColorDescription identifies overshot solution', () => {
  const desc = getColorDescription(OVERSHOOT_ML, true);
  assert.strictEqual(desc, 'Pink deepening to magenta (Overshot)');
  const deepDesc = getColorDescription(30, true);
  assert.strictEqual(deepDesc, 'Deep magenta (Overshot)');
});

test('calculateExpectedConcentration calculates correct Molarity', () => {
  // 25 mL of 0.1 M NaOH with 25 mL HCl -> 0.1 M
  const m = calculateExpectedConcentration(25);
  assert.strictEqual(Math.round(m * 100) / 100, 0.1);
});

// ── 2. Validation Engine ──
console.log('\n--- Test Suite 2: Validation Engine Guard Rules ---');
test('canDropOnZone validates item compatibility', () => {
  const valid = canDropOnZone('burette', 'stand-clamp-zone');
  assert.strictEqual(valid.allowed, true);

  const invalid = canDropOnZone('flask', 'stand-clamp-zone');
  assert.strictEqual(invalid.allowed, false);
  assert.ok(invalid.message !== null);
});

test('canDrawPipette requires HCl placed', () => {
  assert.strictEqual(canDrawPipette(false).allowed, false);
  assert.strictEqual(canDrawPipette(true).allowed, true);
});

test('canDispensePipette requires filled pipette', () => {
  assert.strictEqual(canDispensePipette(false).allowed, false);
  assert.strictEqual(canDispensePipette(true).allowed, true);
});

test('canMarkEndpoint blocks before color change', () => {
  const res = canMarkEndpoint(10);
  assert.strictEqual(res.allowed, false);
});

test('canMarkEndpoint allows at endpoint and warns on overshoot', () => {
  const atEndpoint = canMarkEndpoint(ENDPOINT_ML);
  assert.strictEqual(atEndpoint.allowed, true);
  assert.strictEqual(atEndpoint.message, null);

  const overshot = canMarkEndpoint(28);
  assert.strictEqual(overshot.allowed, true);
  assert.ok(overshot.message?.includes('overshot'));
});

test('canOperateStopcock requires all pre-conditions', () => {
  const incompleteState = { ...titrationInitialState };
  assert.strictEqual(canOperateStopcock(incompleteState).allowed, false);

  const completeState = {
    ...titrationInitialState,
    buretteMounted: true,
    buretteFilled: true,
    flaskPlaced: true,
    acidMeasured: true,
    hasIndicator: true,
  };
  assert.strictEqual(canOperateStopcock(completeState).allowed, true);
});

// ── 3. Titration State Machine ──
console.log('\n--- Test Suite 3: Titration Reducer State Machine ---');
test('titrationReducer progresses through initial steps', () => {
  let state = titrationInitialState;
  assert.strictEqual(state.step, TitrationStep.SELECT);

  state = titrationReducer(state, { type: 'START_EXPERIMENT' });
  assert.strictEqual(state.step, TitrationStep.SETUP_STAND);

  state = titrationReducer(state, { type: 'MOUNT_BURETTE' });
  assert.strictEqual(state.buretteMounted, true);
  assert.strictEqual(state.step, TitrationStep.SETUP_STAND);

  state = titrationReducer(state, { type: 'PLACE_FLASK' });
  assert.strictEqual(state.flaskPlaced, true);
  assert.strictEqual(state.step, TitrationStep.MEASURE_ACID);

  state = titrationReducer(state, { type: 'PLACE_HCL' });
  assert.strictEqual(state.hclPlaced, true);
});

// ── 4. Conservation State Machine ──
console.log('\n--- Test Suite 4: Conservation Reducer & Immutability ---');
test('conservationInitialState has default static masses', () => {
  assert.strictEqual(conservationInitialState.simulatedM1, 125.40);
  assert.strictEqual(conservationInitialState.simulatedM2, 125.40);
});

test('START_EXPERIMENT generates realistic varied masses', () => {
  const state = conservationReducer(conservationInitialState, { type: 'START_EXPERIMENT' });
  assert.strictEqual(state.step, ConservationStep.SETUP_FLASK);
  assert.ok(state.simulatedM1 >= 124.0 && state.simulatedM1 <= 127.0);
  assert.ok(Math.abs(state.simulatedM1 - state.simulatedM2) < 0.05);
});

test('PLACE_ON_BALANCE transitions state immutably', () => {
  const state = {
    ...conservationInitialState,
    step: ConservationStep.WEIGH_INITIAL,
    flaskSealed: true,
    simulatedM1: 125.32,
    simulatedM2: 125.33,
  };
  const next = conservationReducer(state, { type: 'PLACE_ON_BALANCE' });
  assert.notStrictEqual(state, next);
  assert.strictEqual(next.flaskOnBalance, true);
  assert.strictEqual(next.initialMass, 125.32);
  assert.strictEqual(next.step, ConservationStep.MIX_REACTANTS);
});

test('RESET resets to initial state with fresh masses', () => {
  const activeState = {
    ...conservationInitialState,
    step: ConservationStep.RESULTS,
    flaskPlaced: true,
  };
  const reset = conservationReducer(activeState, { type: 'RESET' });
  assert.strictEqual(reset.step, ConservationStep.SELECT);
  assert.strictEqual(reset.flaskPlaced, false);
  assert.ok(reset.simulatedM1 > 0);
});

// ── 5. CBSE Class 9 Conservation of Mass Specific Validation & Rules ──
console.log('\n--- Test Suite 5: Conservation of Mass Guard Rules & Full Sequence ---');

test('Guard Rule: canSuspendTube requires Na2SO4 and filled BaCl2 tube', () => {
  let state = { ...conservationInitialState, flaskPlaced: true };
  assert.strictEqual(canSuspendTube(state).allowed, false);
  assert.strictEqual(canSuspendTube(state).message, 'Pour Na₂SO₄ solution into the flask first before suspending the tube.');

  state = { ...state, na2so4Poured: true, tubeFilled: false };
  assert.strictEqual(canSuspendTube(state).allowed, false);
  assert.strictEqual(canSuspendTube(state).message, 'Fill the Ignition Tube with BaCl₂ solution first before placing it in the flask.');

  state = { ...state, tubeFilled: true };
  assert.strictEqual(canSuspendTube(state).allowed, true);
});

test('Guard Rule: canSealFlask requires tube suspended inside flask', () => {
  let state = { ...conservationInitialState, flaskPlaced: true, na2so4Poured: true, tubeFilled: true, tubeSuspended: false };
  assert.strictEqual(canSealFlask(state).allowed, false);
  assert.strictEqual(canSealFlask(state).message, 'Place the test tube inside the flask without allowing the solutions to mix.');

  state = { ...state, tubeSuspended: true };
  assert.strictEqual(canSealFlask(state).allowed, true);
});

test('Guard Rule: canPlaceOnBalance blocks premature weighing before sealed assembly', () => {
  let state = { ...conservationInitialState };
  assert.strictEqual(canPlaceOnBalance(state).allowed, false);

  state = { ...state, flaskPlaced: true };
  assert.strictEqual(canPlaceOnBalance(state).allowed, false);
  assert.strictEqual(canPlaceOnBalance(state).message, 'Pour the Na₂SO₄ solution into the flask before weighing.');

  state = { ...state, na2so4Poured: true, tubeFilled: true, tubeSuspended: false };
  assert.strictEqual(canPlaceOnBalance(state).allowed, false);
  assert.strictEqual(canPlaceOnBalance(state).message, 'Place the test tube inside the flask without allowing the solutions to mix.');

  state = { ...state, tubeSuspended: true, flaskSealed: false };
  assert.strictEqual(canPlaceOnBalance(state).allowed, false);
  assert.strictEqual(canPlaceOnBalance(state).message, 'Seal the flask with the Rubber Cork before recording M₁. The system must be closed to verify mass conservation.');

  state = { ...state, flaskSealed: true };
  assert.strictEqual(canPlaceOnBalance(state).allowed, true);
});

test('Guard Rule: canMixReactants prevents mixing before initial weighing or while on balance', () => {
  // Sealed but not weighed
  let state = {
    ...conservationInitialState,
    flaskPlaced: true,
    na2so4Poured: true,
    tubeFilled: true,
    tubeSuspended: true,
    flaskSealed: true,
    initialMass: null,
  };
  assert.strictEqual(canMixReactants(state).allowed, false);
  assert.strictEqual(canMixReactants(state).message, 'Record the initial mass before mixing the solutions.');

  // Initial mass recorded, but flask is on balance
  state = { ...state, initialMass: 125.42, flaskOnBalance: true };
  assert.strictEqual(canMixReactants(state).allowed, false);
  assert.strictEqual(canMixReactants(state).message, 'Move the flask off the balance pan to the bench before mixing the reactants.');

  // Flask moved to bench
  state = { ...state, flaskOnBalance: false };
  assert.strictEqual(canMixReactants(state).allowed, true);
});

test('Guard Rule: canWeighFinal blocks premature final weighing before reaction and observation', () => {
  let state = {
    ...conservationInitialState,
    flaskPlaced: true,
    na2so4Poured: true,
    tubeFilled: true,
    tubeSuspended: true,
    flaskSealed: true,
    initialMass: 125.42,
    reactantsMixed: false,
    hasObserved: false,
  };
  assert.strictEqual(canWeighFinal(state).allowed, false);
  assert.strictEqual(canWeighFinal(state).message, 'Complete the reaction before taking the final mass.');

  state = { ...state, reactantsMixed: true, hasObserved: false };
  assert.strictEqual(canWeighFinal(state).allowed, false);
  assert.strictEqual(canWeighFinal(state).message, 'Observe the white precipitate formation before taking the final mass reading.');

  state = { ...state, hasObserved: true };
  assert.strictEqual(canWeighFinal(state).allowed, true);
});

test('Observation Description returns scientific BaSO4 precipitate message', () => {
  const empty = getObservationDescription(false, false, false);
  assert.strictEqual(empty, 'Empty flask');

  const reacting = getObservationDescription(false, true, true);
  assert.strictEqual(reacting, 'Reactants are mixing...');

  const formed = getObservationDescription(true, true, false);
  assert.strictEqual(formed, 'A white precipitate of barium sulphate is formed when barium chloride reacts with sodium sulphate.');
});

test('Full Verified Experiment Sequence from Start to Completion', () => {
  // 1. Start experiment
  let state = conservationReducer(conservationInitialState, { type: 'START_EXPERIMENT' });
  assert.strictEqual(state.step, ConservationStep.SETUP_FLASK);

  // 2. Place flask on bench
  state = conservationReducer(state, { type: 'PLACE_FLASK' });
  assert.strictEqual(state.flaskPlaced, true);

  // 3. Pour Na2SO4 into flask
  state = conservationReducer(state, { type: 'POUR_NA2SO4_START' });
  state = conservationReducer(state, { type: 'POUR_NA2SO4_END' });
  assert.strictEqual(state.na2so4Poured, true);
  assert.strictEqual(state.step, ConservationStep.PLACE_TUBE_ON_STAND);

  // 4. Place Ignition Tube on Stand
  state = conservationReducer(state, { type: 'PLACE_TUBE_ON_STAND' });
  assert.strictEqual(state.tubePlacedOnStand, true);
  assert.strictEqual(state.step, ConservationStep.FILL_TUBE);

  // 5. Fill tube with BaCl2
  state = conservationReducer(state, { type: 'FILL_TUBE_START' });
  state = conservationReducer(state, { type: 'FILL_TUBE_END' });
  assert.strictEqual(state.tubeFilled, true);
  assert.strictEqual(state.step, ConservationStep.SUSPEND_TUBE);

  // 6. Suspend tube inside flask
  assert.strictEqual(canSuspendTube(state).allowed, true);
  state = conservationReducer(state, { type: 'SUSPEND_TUBE' });
  assert.strictEqual(state.tubeSuspended, true);
  assert.strictEqual(state.step, ConservationStep.SEAL_FLASK);

  // 7. Seal flask with cork
  assert.strictEqual(canSealFlask(state).allowed, true);
  state = conservationReducer(state, { type: 'SEAL_FLASK' });
  assert.strictEqual(state.flaskSealed, true);
  assert.strictEqual(state.step, ConservationStep.WEIGH_INITIAL);

  // 8. Weigh complete closed system (M1)
  assert.strictEqual(canPlaceOnBalance(state).allowed, true);
  state = conservationReducer(state, { type: 'PLACE_ON_BALANCE' });
  assert.ok(state.initialMass !== null && state.initialMass > 124.0);
  assert.strictEqual(state.step, ConservationStep.MIX_REACTANTS);

  // 9. Remove flask from balance to bench
  state = conservationReducer(state, { type: 'REMOVE_FROM_BALANCE' });
  assert.strictEqual(state.flaskOnBalance, false);

  // 10. Mix reactants
  assert.strictEqual(canMixReactants(state).allowed, true);
  state = conservationReducer(state, { type: 'MIX_REACTANTS_START' });
  assert.strictEqual(state.isMixing, true);
  state = conservationReducer(state, { type: 'MIX_REACTANTS_END' });
  assert.strictEqual(state.reactantsMixed, true);
  assert.strictEqual(state.precipitateFormed, true);
  assert.strictEqual(state.step, ConservationStep.OBSERVE);

  // 11. Observe white precipitate
  state = conservationReducer(state, { type: 'FINISH_OBSERVE' });
  assert.strictEqual(state.hasObserved, true);
  assert.strictEqual(state.step, ConservationStep.WEIGH_FINAL);

  // 12. Weigh complete closed system again (M2)
  assert.strictEqual(canPlaceOnBalance(state).allowed, true);
  state = conservationReducer(state, { type: 'PLACE_ON_BALANCE' });
  assert.ok(state.finalMass !== null && state.finalMass > 124.0);
  // Verify mass conservation within balance precision
  const deltaM = Math.abs(state.finalMass - state.initialMass!);
  assert.ok(deltaM <= 0.02, `ΔM ${deltaM} must be within ±0.02 g balance precision`);

  // 13. Proceed to calculation
  state = conservationReducer(state, { type: 'PROCEED_TO_CALCULATION' });
  assert.strictEqual(state.step, ConservationStep.CALCULATION);

  // 14. Submit student calculation
  const devPercent = (deltaM / state.initialMass!) * 100;
  state = conservationReducer(state, {
    type: 'SUBMIT_CALCULATION',
    payload: { deltaM: Math.round(deltaM * 100) / 100, deviationPercent: Math.round(devPercent * 1000) / 1000, correct: true },
  });
  assert.strictEqual(state.step, ConservationStep.RESULTS);

  // 15. Check score computation
  const score = computeScore(state);
  assert.strictEqual(score, 100, 'Flawless procedure should achieve score 100');
});

// ── 6. Canonical Conservation-of-Mass Consolidation & Translations ──
console.log('\n--- Test Suite 6: Canonical Conservation-of-Mass Consolidation ---');
test('getExperimentById returns canonical conservation-of-mass with correct metadata', async () => {
  const { getExperimentById } = await import('../src/experiments');
  const exp = getExperimentById('conservation-of-mass');
  assert.ok(exp, 'conservation-of-mass must exist in experiment registry');
  assert.strictEqual(exp.id, 'conservation-of-mass');
  assert.strictEqual(exp.title, 'Law of Conservation of Mass');
  assert.strictEqual(exp.class, 9);
  assert.strictEqual(exp.themeColor, '#059669');
  assert.strictEqual(Boolean(exp.underDevelopment), false, 'Canonical experiment must not be underDevelopment');
  assert.strictEqual(Boolean(exp.adminOnly), false, 'Canonical experiment must not be adminOnly');
});

test('EXPERIMENT_TRANSLATIONS has comprehensive en, hi, mr entries for conservation-of-mass', async () => {
  const { EXPERIMENT_TRANSLATIONS } = await import('../src/i18n/experimentTranslations');
  const trans = EXPERIMENT_TRANSLATIONS['conservation-of-mass'];
  assert.ok(trans, 'conservation-of-mass must exist in EXPERIMENT_TRANSLATIONS');
  for (const lang of ['en', 'hi', 'mr'] as const) {
    const l = trans[lang];
    assert.ok(l, `Translation for ${lang} must exist`);
    assert.ok(l.title, `Title for ${lang} must exist`);
    assert.ok(l.steps['SETUP_FLASK'], `SETUP_FLASK for ${lang} must exist`);
    assert.ok(l.steps['WEIGH_INITIAL'], `WEIGH_INITIAL for ${lang} must exist`);
    assert.ok(l.steps['MIX_REACTANTS'], `MIX_REACTANTS for ${lang} must exist`);
    assert.ok(l.steps['WEIGH_FINAL'], `WEIGH_FINAL for ${lang} must exist`);
    assert.ok(l.steps['CALCULATION'], `CALCULATION for ${lang} must exist`);
  }
});

// ── 7. Conservation Results & Lab Report Generator Verification ──
console.log('\n--- Test Suite 7: Conservation Results & Lab Report Generation ---');
test('buildConservationReportData generates complete structured academic report', async () => {
  const { buildConservationReportData } = await import('../src/services/reportService');
  const mockState = {
    ...conservationInitialState,
    step: ConservationStep.RESULTS,
    flaskPlaced: true,
    na2so4Poured: true,
    tubeFilled: true,
    tubeSuspended: true,
    flaskSealed: true,
    initialMass: 125.40,
    reactantsMixed: true,
    hasObserved: true,
    precipitateFormed: true,
    finalMass: 125.40,
    studentDeltaM: 0.00,
    studentDeviationPercent: 0.00,
    mistakes: [],
    score: 100,
  };

  const mockUser = {
    id: 'student-123',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    role: 'student' as const,
    grade: 'Class 9',
    rollNumber: 'MH9-2026-042',
  };

  const report = buildConservationReportData(
    mockState as any,
    mockUser,
    'en',
    (key: string, fallback?: any) => (typeof fallback === 'string' ? fallback : key),
    (s: any) => s || ''
  );

  assert.ok(report, 'Report data must be generated');
  assert.strictEqual(report.student.name, 'Ananya Sharma');
  assert.strictEqual(report.student.rollNo, 'MH9-2026-042');
  assert.strictEqual(report.student.className, 'Class 9');
  assert.strictEqual(report.score, 100);
  assert.strictEqual(report.maxScore, 100);
  assert.strictEqual(report.grade, 'Excellent');
  assert.ok(report.apparatus.length >= 5, 'Apparatus list must contain all items');
  assert.ok(report.chemicals.length >= 2, 'Chemicals list must contain BaCl2 and Na2SO4');
  assert.ok(report.observations.some(o => o.label.includes('Initial Mass') && o.value === '125.40'));
  assert.ok(report.observations.some(o => o.label.includes('Final Mass') && o.value === '125.40'));
  assert.ok(report.calculations.length >= 2, 'Calculations must include Delta M and Deviation %');
  assert.ok(report.rubricBreakdown.length === 7, 'Rubric must contain 7 categories');
  assert.strictEqual(report.rubricBreakdown.reduce((sum, r) => sum + r.points, 0), 100);
  assert.ok(report.filename.includes('VirtualVigyan_Lab_Report_Law_of_Conservation_of_Mass'));
});

test('evaluateCalculation validates accurate vs erroneous mass difference calculations', async () => {
  const { evaluateCalculation } = await import('../src/engine/conservationValidation');
  
  const perfect = evaluateCalculation(0.00, 0.00, 0.00, 0.00);
  assert.strictEqual(perfect.accuracy, 'excellent');
  
  const good = evaluateCalculation(0.01, 0.00, 0.01, 0.00);
  assert.strictEqual(good.accuracy, 'good');

  const needsPractice = evaluateCalculation(0.50, 0.00, 0.40, 0.00);
  assert.strictEqual(needsPractice.accuracy, 'needs_practice');
});

console.log(`\n=============================================`);
console.log(`✨ All ${passCount} Engine Tests Passed Successfully!`);
console.log(`=============================================\n`);

