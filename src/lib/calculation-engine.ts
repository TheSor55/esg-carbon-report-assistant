import type { ActivityRecord, CalculationResult, EmissionFactor, Scope } from './types';
import { convertUnit } from './unit-conversion';

export function calculateActivityEmission(activity: ActivityRecord, factor: EmissionFactor): CalculationResult {
  if (!factor.isActive) {
    throw new Error('Emission factor ' + factor.id + ' is inactive');
  }

  const factorUnit = factor.unit.replace('kgCO2e/', '');
  const quantityUsed = activity.unit === factorUnit ? activity.quantity : convertUnit(activity.quantity, activity.unit, factorUnit);
  const kgCO2e = quantityUsed * factor.kgCO2ePerUnit;
  const tCO2e = kgCO2e / 1000;

  return {
    activityId: activity.id,
    emissionFactorId: factor.id,
    emissionFactorVersion: factor.version,
    originalQuantity: activity.quantity,
    originalUnit: activity.unit,
    quantityUsed,
    unitUsed: factorUnit,
    kgCO2e,
    tCO2e,
    calculationVersion: 1,
    formula: String(quantityUsed) + ' ' + factorUnit + ' x ' + String(factor.kgCO2ePerUnit) + ' kgCO2e/' + factorUnit,
    uncertaintyNote: activity.dataQualityRating === 'High' ? 'Primary evidence available' : 'Review data quality rating: ' + activity.dataQualityRating
  };
}

export function calculateInventory(activities: ActivityRecord[], factors: EmissionFactor[]): CalculationResult[] {
  const factorMap = new Map(factors.map((factor) => [factor.id, factor]));
  return activities.map((activity) => {
    const factor = factorMap.get(activity.emissionFactorId);
    if (!factor) throw new Error('Missing emission factor for activity ' + activity.id);
    return calculateActivityEmission(activity, factor);
  });
}

export function summarizeByScope(activities: ActivityRecord[], results: CalculationResult[]): Record<Scope, number> {
  const activityMap = new Map(activities.map((activity) => [activity.id, activity]));
  return results.reduce((summary, result) => {
    const activity = activityMap.get(result.activityId);
    if (!activity) return summary;
    summary[activity.scope] += result.tCO2e;
    return summary;
  }, { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 } as Record<Scope, number>);
}

export function groupByDimension(activities: ActivityRecord[], results: CalculationResult[], dimension: 'siteId' | 'departmentId' | 'month' | 'category'): Record<string, number> {
  const activityMap = new Map(activities.map((activity) => [activity.id, activity]));
  return results.reduce((summary, result) => {
    const activity = activityMap.get(result.activityId);
    if (!activity) return summary;
    const key = String(activity[dimension]);
    summary[key] = (summary[key] || 0) + result.tCO2e;
    return summary;
  }, {} as Record<string, number>);
}

export function rankHotspots(activities: ActivityRecord[], results: CalculationResult[]) {
  const activityMap = new Map(activities.map((activity) => [activity.id, activity]));
  return results
    .map((result) => ({ activity: activityMap.get(result.activityId), result }))
    .filter((item): item is { activity: ActivityRecord; result: CalculationResult } => Boolean(item.activity))
    .sort((a, b) => b.result.tCO2e - a.result.tCO2e);
}
