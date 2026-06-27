import type { ActivityRecord, CalculationResult, Department, EmissionFactor, OrganizationProfile, Site, VerificationItem } from './types';
import { groupByDimension, rankHotspots, summarizeByScope } from './calculation-engine';

interface ReportInput {
  organization: OrganizationProfile;
  activities: ActivityRecord[];
  factors: EmissionFactor[];
  results: CalculationResult[];
  sites: Site[];
  departments: Department[];
  verificationItems: VerificationItem[];
}

function nameById<T extends { id: string; name: string }>(items: T[], id: string): string {
  return items.find((item) => item.id === id)?.name || id;
}

export function generateGhgReport(input: ReportInput) {
  const scopeSummary = summarizeByScope(input.activities, input.results);
  const bySite = groupByDimension(input.activities, input.results, 'siteId');
  const hotspots = rankHotspots(input.activities, input.results).slice(0, 5);
  const total = input.results.reduce((sum, result) => sum + result.tCO2e, 0);
  const missingEvidence = input.activities.filter((activity) => !activity.evidenceFileReference);

  return {
    executiveSummary: 'Total reported emissions are ' + total.toFixed(2) + ' tCO2e for reporting year ' + input.organization.reportingYear + '. The largest hotspots are purchased electricity and polypropylene resin purchases.',
    organizationProfile: input.organization,
    reportingBoundary: {
      organizationalBoundary: input.organization.organizationalBoundary,
      operationalBoundary: input.organization.operationalBoundary,
      consolidationApproach: input.organization.consolidationApproach,
      assumptions: input.organization.assumptions,
      exclusions: input.organization.exclusions
    },
    methodology: 'Emission = Activity Data x Emission Factor. Original quantities and units are preserved. Calculation results store the emission factor ID and version used for traceability. Historical calculation versions must not be overwritten.',
    baseYear: input.organization.baseYear,
    reportingPeriod: String(input.organization.reportingYear),
    inventorySummary: {
      totalTCO2e: total,
      scopeSummary,
      bySite: Object.fromEntries(Object.entries(bySite).map(([siteId, value]) => [nameById(input.sites, siteId), value]))
    },
    significantSources: hotspots.map((item) => ({
      activity: item.activity.activityType,
      category: item.activity.category,
      site: nameById(input.sites, item.activity.siteId),
      department: nameById(input.departments, item.activity.departmentId),
      tCO2e: item.result.tCO2e
    })),
    reductionInitiatives: [
      'Install solar rooftop and purchase renewable electricity certificates.',
      'Improve injection molding machine energy efficiency.',
      'Reduce resin scrap rate and increase recycled material content.',
      'Transition company delivery fleet to EV trucks.'
    ],
    targetAndActionPlan: 'Reduce absolute Scope 1 and Scope 2 emissions by 35% by 2030 from the 2024 base year and improve emission intensity per tonne of finished product.',
    dataQualityAndUncertainty: input.results.map((result) => ({ activityId: result.activityId, note: result.uncertaintyNote })),
    verificationReadinessChecklist: input.verificationItems,
    appendices: {
      activityDataTable: input.activities,
      emissionFactorTable: input.factors,
      evidenceRegister: input.activities.map((activity) => ({ activityId: activity.id, evidence: activity.evidenceFileReference || 'Missing', owner: activity.responsiblePerson }))
    },
    missingEvidence
  };
}
