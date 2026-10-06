import { cbseClass10Experiments } from '../src/experiments/cbse-class10';
import { getExperimentById } from '../src/experiments';

console.log('Testing Class 10 Experiments Registration...');
for (const exp of cbseClass10Experiments) {
  const loaded = getExperimentById(exp.id);
  if (!loaded) throw new Error('Failed to find ' + exp.id);
  if (!loaded.underDevelopment) throw new Error(exp.id + ' not marked underDevelopment');
  if (!loaded.adminOnly) throw new Error(exp.id + ' not marked adminOnly');
  const totalPoints = loaded.scoring.reduce((sum, s) => sum + s.maxPoints, 0);
  console.log(`  ✅ ${loaded.id} (${loaded.title}): total points = ${totalPoints}, viva questions = ${loaded.viva?.questions?.length || 0}`);
  if (totalPoints !== 100) throw new Error(exp.id + ' scoring does not sum to 100 points');
}
console.log('✨ All 6 CBSE Class 10 experiments verified successfully!');
