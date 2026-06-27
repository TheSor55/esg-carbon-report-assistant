import type { ActivityRecord, EmissionFactor } from './types';

function escapeCsv(value: unknown): string {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return '"' + text.replaceAll('"', '""') + '"';
  }
  return text;
}

export function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [headers.join(','), ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(','))].join('\n');
}

export function activityDataCsv(activities: ActivityRecord[]): string {
  return toCsv(activities.map((activity) => ({
    reportingPeriod: activity.reportingPeriod,
    month: activity.month,
    siteId: activity.siteId,
    departmentId: activity.departmentId,
    activityType: activity.activityType,
    scope: activity.scope,
    category: activity.category,
    quantity: activity.quantity,
    unit: activity.unit,
    dataSource: activity.dataSource,
    evidenceFileReference: activity.evidenceFileReference || '',
    responsiblePerson: activity.responsiblePerson,
    dataQualityRating: activity.dataQualityRating,
    emissionFactorId: activity.emissionFactorId,
    remark: activity.remark || ''
  })));
}

export function emissionFactorsCsv(factors: EmissionFactor[]): string {
  return toCsv(factors.map((factor) => ({
    factorCode: factor.factorCode,
    factorName: factor.factorName,
    activityType: factor.activityType,
    gasType: factor.gasType,
    unit: factor.unit,
    kgCO2ePerUnit: factor.kgCO2ePerUnit,
    source: factor.source,
    sourceYear: factor.sourceYear,
    version: factor.version,
    effectiveDate: factor.effectiveDate,
    expiryDate: factor.expiryDate || '',
    countryRegion: factor.countryRegion,
    referenceNote: factor.referenceNote,
    isActive: factor.isActive
  })));
}

export function evidenceRegisterCsv(activities: ActivityRecord[]): string {
  return toCsv(activities.map((activity) => ({
    activityId: activity.id,
    activityType: activity.activityType,
    siteId: activity.siteId,
    evidenceFileReference: activity.evidenceFileReference || 'Missing',
    dataSource: activity.dataSource,
    responsiblePerson: activity.responsiblePerson,
    status: activity.evidenceFileReference ? 'Ready' : 'Missing'
  })));
}
