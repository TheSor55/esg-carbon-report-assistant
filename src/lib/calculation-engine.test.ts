import { activities, emissionFactors } from './sample-data';
import { calculateInventory, summarizeByScope } from './calculation-engine';

const results = calculateInventory(activities, emissionFactors);
if (results.length !== activities.length) {
  throw new Error('Expected every activity to produce a result');
}

const scopeSummary = summarizeByScope(activities, results);
if (scopeSummary['Scope 1'] <= 0 || scopeSummary['Scope 2'] <= 0 || scopeSummary['Scope 3'] <= 0) {
  throw new Error('Expected all scopes to have sample emissions');
}

const allReferenceFactors = results.every((result) => result.emissionFactorId && result.emissionFactorVersion);
if (!allReferenceFactors) {
  throw new Error('Every result must preserve factor ID and version');
}

console.log('calculation-engine tests passed');
