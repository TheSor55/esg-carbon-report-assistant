import type { Prisma } from '@prisma/client';
import { calculateActivityEmission } from './calculation-engine';
import type { ActivityRecord, EmissionFactor } from './types';
import { recordChange } from './audit-log';

type Tx = Prisma.TransactionClient;

export async function persistActivityCalculation(tx: Tx, activityId: string, changedBy = 'system') {
  const dbActivity = await tx.activityData.findUnique({
    where: { id: activityId },
    include: {
      reportingPeriod: true,
      emissionFactor: true
    }
  });

  if (!dbActivity) return;

  const activity: ActivityRecord = {
    id: dbActivity.id,
    reportingPeriod: dbActivity.reportingPeriod.label,
    month: dbActivity.activityMonth,
    siteId: dbActivity.siteId,
    departmentId: dbActivity.departmentId,
    activityType: dbActivity.activityType,
    scope: dbActivity.scope === 'SCOPE_1' ? 'Scope 1' : dbActivity.scope === 'SCOPE_2' ? 'Scope 2' : 'Scope 3',
    category: dbActivity.category,
    quantity: Number(dbActivity.originalQuantity),
    unit: dbActivity.originalUnit,
    dataSource: dbActivity.dataSource,
    evidenceFileReference: dbActivity.evidenceFileRef ?? undefined,
    responsiblePerson: dbActivity.responsiblePerson,
    remark: dbActivity.remark ?? undefined,
    dataQualityRating: dbActivity.dataQualityRating === 'HIGH' ? 'High' : dbActivity.dataQualityRating === 'MEDIUM' ? 'Medium' : dbActivity.dataQualityRating === 'LOW' ? 'Low' : 'Estimated',
    emissionFactorId: dbActivity.emissionFactorId
  };

  const factor: EmissionFactor = {
    id: dbActivity.emissionFactor.id,
    factorCode: dbActivity.emissionFactor.factorCode,
    factorName: dbActivity.emissionFactor.factorName,
    activityType: dbActivity.emissionFactor.activityType,
    gasType: dbActivity.emissionFactor.gasType,
    unit: dbActivity.emissionFactor.unit,
    kgCO2ePerUnit: Number(dbActivity.emissionFactor.kgCO2ePerUnit),
    source: dbActivity.emissionFactor.source,
    sourceYear: dbActivity.emissionFactor.sourceYear,
    version: dbActivity.emissionFactor.version,
    effectiveDate: dbActivity.emissionFactor.effectiveDate.toISOString().slice(0, 10),
    expiryDate: dbActivity.emissionFactor.expiryDate?.toISOString().slice(0, 10),
    countryRegion: dbActivity.emissionFactor.countryRegion,
    referenceNote: dbActivity.emissionFactor.referenceNote ?? '',
    isActive: dbActivity.emissionFactor.isActive
  };

  const result = calculateActivityEmission(activity, factor);
  const latestRun = await tx.calculationRun.findFirst({
    where: { reportingPeriodId: dbActivity.reportingPeriodId },
    orderBy: { version: 'desc' }
  });

  const run = await tx.calculationRun.create({
    data: {
      reportingPeriodId: dbActivity.reportingPeriodId,
      version: (latestRun?.version ?? 0) + 1,
      methodology: 'Activity Data x Emission Factor',
      status: 'Calculated',
      createdBy: changedBy
    }
  });

  await tx.calculationResult.create({
    data: {
      calculationRunId: run.id,
      activityDataId: dbActivity.id,
      emissionFactorId: dbActivity.emissionFactorId,
      emissionFactorVersion: dbActivity.emissionFactor.version,
      quantityUsed: result.quantityUsed,
      unitUsed: result.unitUsed,
      kgCO2e: result.kgCO2e,
      tCO2e: result.tCO2e,
      uncertaintyNote: result.uncertaintyNote,
      calculationFormula: result.formula
    }
  });

  await recordChange({
    entityType: 'CalculationResult',
    entityId: dbActivity.id,
    action: 'RECALCULATE',
    description: `Calculation run version ${run.version} created for activity ${dbActivity.id}.`,
    changedBy
  }, tx);
}
