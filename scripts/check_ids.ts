import { ALL_EXPERIMENTS } from '../src/components/ExperimentSelector';
import { getExperimentById } from '../src/experiments';

console.log('Checking all experiment IDs in ExperimentSelector:');
let missingCount = 0;
for (const item of ALL_EXPERIMENTS) {
  if (item.type === 'generic') {
    const config = getExperimentById(item.id);
    if (!config) {
      console.log('❌ MISMATCH / MISSING: ' + item.id + ' (' + item.title + ')');
      missingCount++;
    } else {
      console.log('✅ Found: ' + item.id + ' -> ' + config.id);
    }
  }
}
if (missingCount > 0) {
  console.log(`\n⚠️ Found ${missingCount} missing / mismatched experiment(s)!`);
} else {
  console.log('\n✨ All experiment IDs matched perfectly!');
}
