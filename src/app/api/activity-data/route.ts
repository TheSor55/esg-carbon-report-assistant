import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getActivityRecords, qualityToPrisma, recordStatusToPrisma, scopeToPrisma } from '@/lib/data';
import { recordChange } from '@/lib/audit-log';
import { persistActivityCalculation } from '@/lib/persist-calculation';

const activitySchema = z.object({
  reportingPeriodId: z.string().min(1),
  month: z.string().min(7),
  siteId: z.string().min(1),
  departmentId: z.string().min(1),
  activityType: z.string().min(1),
  scope: z.enum(['Scope 1', 'Scope 2', 'Scope 3']),
  category: z.string().min(1),
  quantity: z.coerce.number().nonnegative(),
  unit: z.string().min(1),
  dataSource: z.string().min(1),
  evidenceFileReference: z.string().optional(),
  responsiblePerson: z.string().min(1),
  remark: z.string().optional(),
  dataQualityRating: z.enum(['High', 'Medium', 'Low', 'Estimated']),
  status: z.enum(['Draft', 'Ready', 'Reviewed', 'Rejected', 'Inactive']).optional(),
  emissionFactorId: z.string().min(1)
});

function requireDatabase() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not configured.' }, { status: 503 });
  }
  return null;
}

export async function GET() {
  return NextResponse.json({ ok: true, activities: await getActivityRecords() });
}

export async function POST(request: NextRequest) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;

  const parsed = activitySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const activity = await prisma.$transaction(async (tx) => {
    const created = await tx.activityData.create({
      data: {
        reportingPeriodId: parsed.data.reportingPeriodId,
        activityMonth: parsed.data.month,
        siteId: parsed.data.siteId,
        departmentId: parsed.data.departmentId,
        activityType: parsed.data.activityType,
        scope: scopeToPrisma(parsed.data.scope),
        category: parsed.data.category,
        originalQuantity: parsed.data.quantity,
        originalUnit: parsed.data.unit,
        dataSource: parsed.data.dataSource,
        evidenceFileRef: parsed.data.evidenceFileReference,
        responsiblePerson: parsed.data.responsiblePerson,
        remark: parsed.data.remark,
        dataQualityRating: qualityToPrisma(parsed.data.dataQualityRating),
        status: recordStatusToPrisma(parsed.data.status ?? 'Draft'),
        emissionFactorId: parsed.data.emissionFactorId
      }
    });
    await recordChange({ entityType: 'ActivityData', entityId: created.id, action: 'CREATE', description: 'Activity record created.' }, tx);
    await persistActivityCalculation(tx, created.id);
    return created;
  });

  return NextResponse.json({ ok: true, id: activity.id }, { status: 201 });
}
