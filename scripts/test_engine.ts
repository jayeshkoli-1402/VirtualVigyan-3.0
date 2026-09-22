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

console.log(`\n=============================================`);
console.log(`✨ All ${passCount} Engine Tests Passed Successfully!`);
console.log(`=============================================\n`);
