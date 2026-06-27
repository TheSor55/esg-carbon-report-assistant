import { PrismaClient, Role, Scope, DataQualityRating, FactorVerificationStatus, RecordStatus } from '@prisma/client';
import { activities, departments, emissionFactors, organization, sites, verificationItems } from '../src/lib/sample-data';

const prisma = new PrismaClient();

function prismaScope(scope: string): Scope {
  if (scope === 'Scope 1') return Scope.SCOPE_1;
  if (scope === 'Scope 2') return Scope.SCOPE_2;
  return Scope.SCOPE_3;
}

function prismaQuality(rating: string): DataQualityRating {
  if (rating === 'High') return DataQualityRating.HIGH;
  if (rating === 'Medium') return DataQualityRating.MEDIUM;
  if (rating === 'Low') return DataQualityRating.LOW;
  return DataQualityRating.ESTIMATED;
}

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: organization.id },
    update: {},
    create: {
      id: organization.id,
      name: organization.name,
      reportingYear: organization.reportingYear,
      baseYear: organization.baseYear,
      organizationalBoundary: organization.organizationalBoundary,
      operationalBoundary: organization.operationalBoundary,
      consolidationApproach: organization.consolidationApproach,
      assumptions: organization.assumptions.join('\n'),
      exclusions: organization.exclusions.join('\n')
    }
  });

  await prisma.user.upsert({ where: { email: 'admin@siamplastic.example' }, update: {}, create: { name: 'ESG Admin', email: 'admin@siamplastic.example', role: Role.ADMIN, organizationId: org.id } });
  await prisma.reportingPeriod.upsert({ where: { id: 'period-fy2026' }, update: {}, create: { id: 'period-fy2026', label: 'FY2026', startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), organizationId: org.id } });

  for (const site of sites) await prisma.site.upsert({ where: { id: site.id }, update: {}, create: { id: site.id, name: site.name, address: site.address, organizationId: org.id } });
  for (const department of departments) await prisma.department.upsert({ where: { id: department.id }, update: {}, create: { id: department.id, name: department.name, organizationId: org.id } });
  for (const factor of emissionFactors) {
    await prisma.emissionFactor.upsert({
      where: { factorCode_version: { factorCode: factor.factorCode, version: factor.version } },
      update: {},
      create: { ...factor, verificationStatus: FactorVerificationStatus.DEMO, effectiveDate: new Date(factor.effectiveDate), expiryDate: factor.expiryDate ? new Date(factor.expiryDate) : null }
    });
  }
  for (const activity of activities) {
    await prisma.activityData.upsert({
      where: { id: activity.id },
      update: {},
      create: {
        id: activity.id,
        reportingPeriodId: 'period-fy2026',
        activityMonth: activity.month,
        siteId: activity.siteId,
        departmentId: activity.departmentId,
        activityType: activity.activityType,
        scope: prismaScope(activity.scope),
        category: activity.category,
        originalQuantity: activity.quantity,
        originalUnit: activity.unit,
        dataSource: activity.dataSource,
        evidenceFileRef: activity.evidenceFileReference,
        responsiblePerson: activity.responsiblePerson,
        remark: activity.remark,
        dataQualityRating: prismaQuality(activity.dataQualityRating),
        status: activity.evidenceFileReference ? RecordStatus.READY : RecordStatus.DRAFT,
        emissionFactorId: activity.emissionFactorId
      }
    });
  }
  for (const item of verificationItems) {
    await prisma.verificationItem.upsert({ where: { id: item.id }, update: {}, create: { id: item.id, title: item.title, itemType: item.type, status: item.status, owner: item.owner, dueDate: item.dueDate ? new Date(item.dueDate) : null, note: item.note } });
  }
}

main().finally(async () => prisma.$disconnect());
