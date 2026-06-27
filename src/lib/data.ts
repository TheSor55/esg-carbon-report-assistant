import type { Prisma } from '@prisma/client';
import { DataQualityRating as PrismaDataQualityRating, FactorVerificationStatus as PrismaFactorVerificationStatus, RecordStatus as PrismaRecordStatus, Scope as PrismaScope } from '@prisma/client';
import { prisma } from './prisma';
import type { ActivityRecord, DataQualityRating, Department, EmissionFactor, EvidenceRecord, FactorVerificationStatus, OrganizationProfile, RecordStatus, Scope, Site, VerificationItem } from './types';
import { activities, departments, emissionFactors, organization, sites, verificationItems } from './sample-data';

export interface InventoryData {
  organization: OrganizationProfile;
  sites: Site[];
  departments: Department[];
  emissionFactors: EmissionFactor[];
  activities: ActivityRecord[];
  verificationItems: VerificationItem[];
  evidenceRecords: EvidenceRecord[];
  reportingPeriodId?: string;
  reportingPeriodLabel?: string;
  source: 'database' | 'sample';
}

const activityInclude = {
  reportingPeriod: true
} satisfies Prisma.ActivityDataInclude;

function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function splitLines(value: string | null | undefined): string[] {
  return value ? value.split('\n').filter(Boolean) : [];
}

function scopeFromPrisma(scope: PrismaScope): Scope {
  if (scope === PrismaScope.SCOPE_1) return 'Scope 1';
  if (scope === PrismaScope.SCOPE_2) return 'Scope 2';
  return 'Scope 3';
}

export function scopeToPrisma(scope: Scope): PrismaScope {
  if (scope === 'Scope 1') return PrismaScope.SCOPE_1;
  if (scope === 'Scope 2') return PrismaScope.SCOPE_2;
  return PrismaScope.SCOPE_3;
}

function qualityFromPrisma(rating: PrismaDataQualityRating): DataQualityRating {
  if (rating === PrismaDataQualityRating.HIGH) return 'High';
  if (rating === PrismaDataQualityRating.MEDIUM) return 'Medium';
  if (rating === PrismaDataQualityRating.LOW) return 'Low';
  return 'Estimated';
}

export function qualityToPrisma(rating: DataQualityRating): PrismaDataQualityRating {
  if (rating === 'High') return PrismaDataQualityRating.HIGH;
  if (rating === 'Medium') return PrismaDataQualityRating.MEDIUM;
  if (rating === 'Low') return PrismaDataQualityRating.LOW;
  return PrismaDataQualityRating.ESTIMATED;
}

function recordStatusFromPrisma(status: PrismaRecordStatus): RecordStatus {
  if (status === PrismaRecordStatus.READY) return 'Ready';
  if (status === PrismaRecordStatus.REVIEWED) return 'Reviewed';
  if (status === PrismaRecordStatus.REJECTED) return 'Rejected';
  if (status === PrismaRecordStatus.INACTIVE) return 'Inactive';
  return 'Draft';
}

export function recordStatusToPrisma(status: RecordStatus): PrismaRecordStatus {
  if (status === 'Ready') return PrismaRecordStatus.READY;
  if (status === 'Reviewed') return PrismaRecordStatus.REVIEWED;
  if (status === 'Rejected') return PrismaRecordStatus.REJECTED;
  if (status === 'Inactive') return PrismaRecordStatus.INACTIVE;
  return PrismaRecordStatus.DRAFT;
}

function factorStatusFromPrisma(status: PrismaFactorVerificationStatus): FactorVerificationStatus {
  if (status === PrismaFactorVerificationStatus.VERIFIED) return 'Verified';
  if (status === PrismaFactorVerificationStatus.PENDING_REVIEW) return 'Pending Review';
  return 'Demo';
}

export function factorStatusToPrisma(status: FactorVerificationStatus): PrismaFactorVerificationStatus {
  if (status === 'Verified') return PrismaFactorVerificationStatus.VERIFIED;
  if (status === 'Pending Review') return PrismaFactorVerificationStatus.PENDING_REVIEW;
  return PrismaFactorVerificationStatus.DEMO;
}

function formatDate(value: Date | null | undefined): string | undefined {
  return value ? value.toISOString().slice(0, 10) : undefined;
}

function sampleData(): InventoryData {
  return {
    organization,
    sites,
    departments,
    emissionFactors,
    activities,
    verificationItems,
    evidenceRecords: activities.map((activity) => ({
      id: 'sample-evidence-' + activity.id,
      activityId: activity.id,
      activityLabel: activity.activityType + ' / ' + activity.month,
      evidenceType: activity.dataSource,
      fileName: activity.evidenceFileReference,
      dataPeriod: activity.month,
      owner: activity.responsiblePerson,
      status: activity.evidenceFileReference ? 'Ready' : 'Draft',
      note: activity.evidenceFileReference ? 'Sample evidence reference' : 'Evidence missing',
      source: 'sample'
    })),
    reportingPeriodId: 'period-fy' + organization.reportingYear,
    reportingPeriodLabel: 'FY' + organization.reportingYear,
    source: 'sample'
  };
}

type DbActivity = Prisma.ActivityDataGetPayload<{ include: typeof activityInclude }>;

function mapActivity(activity: DbActivity): ActivityRecord {
  return {
    id: activity.id,
    reportingPeriod: activity.reportingPeriod.label,
    month: activity.activityMonth,
    siteId: activity.siteId,
    departmentId: activity.departmentId,
    activityType: activity.activityType,
    scope: scopeFromPrisma(activity.scope),
    category: activity.category,
    quantity: Number(activity.originalQuantity),
    unit: activity.originalUnit,
    dataSource: activity.dataSource,
    evidenceFileReference: activity.evidenceFileRef ?? undefined,
    responsiblePerson: activity.responsiblePerson,
    remark: activity.remark ?? undefined,
    dataQualityRating: qualityFromPrisma(activity.dataQualityRating),
    status: recordStatusFromPrisma(activity.status),
    emissionFactorId: activity.emissionFactorId
  };
}

function mapFactor(factor: Prisma.EmissionFactorGetPayload<object>): EmissionFactor {
  return {
    id: factor.id,
    factorCode: factor.factorCode,
    factorName: factor.factorName,
    activityType: factor.activityType,
    gasType: factor.gasType,
    unit: factor.unit,
    kgCO2ePerUnit: Number(factor.kgCO2ePerUnit),
    source: factor.source,
    sourceYear: factor.sourceYear,
    version: factor.version,
    effectiveDate: formatDate(factor.effectiveDate) ?? '',
    expiryDate: formatDate(factor.expiryDate),
    countryRegion: factor.countryRegion,
    referenceNote: factor.referenceNote ?? '',
    isActive: factor.isActive,
    verificationStatus: factorStatusFromPrisma(factor.verificationStatus)
  };
}

export async function getInventoryData(): Promise<InventoryData> {
  if (!hasDatabaseUrl()) return sampleData();

  try {
    const dbOrganization = await prisma.organization.findFirst({
      orderBy: { createdAt: 'asc' },
      include: {
        sites: { orderBy: { name: 'asc' } },
        departments: { orderBy: { name: 'asc' } },
        reportingPeriods: { orderBy: { startDate: 'desc' }, take: 1 }
      }
    });

    if (!dbOrganization) return sampleData();

    const [dbActivities, dbEmissionFactors, dbVerificationItems, dbEvidenceRecords] = await Promise.all([
      prisma.activityData.findMany({
        include: activityInclude,
        orderBy: [{ activityMonth: 'asc' }, { createdAt: 'asc' }]
      }),
      prisma.emissionFactor.findMany({
        orderBy: [{ factorCode: 'asc' }, { version: 'desc' }]
      }),
      prisma.verificationItem.findMany({
        orderBy: { createdAt: 'asc' }
      }),
      prisma.evidence.findMany({
        include: { activityData: { select: { id: true, activityType: true, activityMonth: true } } },
        orderBy: { uploadedAt: 'desc' }
      })
    ]);

    return {
      organization: {
        id: dbOrganization.id,
        name: dbOrganization.name,
        reportingYear: dbOrganization.reportingYear,
        baseYear: dbOrganization.baseYear ?? dbOrganization.reportingYear,
        organizationalBoundary: dbOrganization.organizationalBoundary,
        operationalBoundary: dbOrganization.operationalBoundary,
        consolidationApproach: dbOrganization.consolidationApproach,
        assumptions: splitLines(dbOrganization.assumptions),
        exclusions: splitLines(dbOrganization.exclusions)
      },
      sites: dbOrganization.sites.map((site) => ({ id: site.id, name: site.name, address: site.address ?? '' })),
      departments: dbOrganization.departments.map((department) => ({ id: department.id, name: department.name })),
      emissionFactors: dbEmissionFactors.map(mapFactor),
      activities: dbActivities.map(mapActivity),
      verificationItems: dbVerificationItems.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.itemType as VerificationItem['type'],
        status: item.status as VerificationItem['status'],
        owner: item.owner,
        dueDate: formatDate(item.dueDate),
        note: item.note ?? ''
      })),
      evidenceRecords: dbEvidenceRecords.map((item) => ({
        id: item.id,
        activityId: item.activityDataId,
        activityLabel: item.activityData.activityType + ' / ' + item.activityData.activityMonth,
        evidenceType: item.evidenceType,
        fileName: item.fileName ?? undefined,
        fileUrl: item.fileUrl ?? undefined,
        documentDate: formatDate(item.documentDate),
        dataPeriod: item.dataPeriod ?? undefined,
        owner: item.owner ?? undefined,
        status: recordStatusFromPrisma(item.status),
        reviewerComment: item.reviewerComment ?? undefined,
        note: item.note ?? undefined,
        uploadedAt: item.uploadedAt.toISOString(),
        source: 'database'
      })),
      reportingPeriodId: dbOrganization.reportingPeriods[0]?.id,
      reportingPeriodLabel: dbOrganization.reportingPeriods[0]?.label,
      source: 'database'
    };
  } catch (error) {
    console.warn('Falling back to sample data because Prisma data loading failed.', error);
    return sampleData();
  }
}

export async function getActivityRecords(): Promise<ActivityRecord[]> {
  return (await getInventoryData()).activities;
}

export async function getEmissionFactors(): Promise<EmissionFactor[]> {
  return (await getInventoryData()).emissionFactors;
}

export async function getEvidenceRecords(): Promise<EvidenceRecord[]> {
  return (await getInventoryData()).evidenceRecords;
}
