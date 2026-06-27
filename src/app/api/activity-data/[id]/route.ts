import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { qualityToPrisma, recordStatusToPrisma, scopeToPrisma } from '@/lib/data';
import { recordChange } from '@/lib/audit-log';
import { persistActivityCalculation } from '@/lib/persist-calculation';

const updateActivitySchema = z.object({
  reportingPeriodId: z.string().min(1).optional(),
  month: z.string().min(7).optional(),
  siteId: z.string().min(1).optional(),
  departmentId: z.string().min(1).optional(),
  activityType: z.string().min(1).optional(),
  scope: z.enum(['Scope 1', 'Scope 2', 'Scope 3']).optional(),
  category: z.string().min(1).optional(),
  quantity: z.coerce.number().nonnegative().optional(),
  unit: z.string().min(1).optional(),
  dataSource: z.string().min(1).optional(),
  evidenceFileReference: z.string().optional(),
  responsiblePerson: z.string().min(1).optional(),
  remark: z.string().optional(),
  dataQualityRating: z.enum(['High', 'Medium', 'Low', 'Estimated']).optional(),
  status: z.enum(['Draft', 'Ready', 'Reviewed', 'Rejected', 'Inactive']).optional(),
  emissionFactorId: z.string().min(1).optional()
});

function requireDatabase() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not configured.' }, { status: 503 });
  }
  return null;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;

  const parsed = updateActivitySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.activityData.update({
      where: { id: params.id },
      data: {
        reportingPeriodId: parsed.data.reportingPeriodId,
        activityMonth: parsed.data.month,
        siteId: parsed.data.siteId,
        departmentId: parsed.data.departmentId,
        activityType: parsed.data.activityType,
        scope: parsed.data.scope ? scopeToPrisma(parsed.data.scope) : undefined,
        category: parsed.data.category,
        originalQuantity: parsed.data.quantity,
        originalUnit: parsed.data.unit,
        dataSource: parsed.data.dataSource,
        evidenceFileRef: parsed.data.evidenceFileReference,
        responsiblePerson: parsed.data.responsiblePerson,
        remark: parsed.data.remark,
        dataQualityRating: parsed.data.dataQualityRating ? qualityToPrisma(parsed.data.dataQualityRating) : undefined,
        status: parsed.data.status ? recordStatusToPrisma(parsed.data.status) : undefined,
        emissionFactorId: parsed.data.emissionFactorId
      }
    });
    await recordChange({ entityType: 'ActivityData', entityId: params.id, action: 'UPDATE', description: 'Activity record updated.' }, tx);
    await persistActivityCalculation(tx, params.id);
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;

  const dependentCount = await prisma.calculationResult.count({ where: { activityDataId: params.id } });
  const evidenceCount = await prisma.evidence.count({ where: { activityDataId: params.id } });
  if (dependentCount || evidenceCount) {
    return NextResponse.json({ ok: false, error: 'Activity records with calculation results or evidence cannot be deleted.' }, { status: 409 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.activityData.delete({ where: { id: params.id } });
    await recordChange({ entityType: 'ActivityData', entityId: params.id, action: 'DELETE', description: 'Activity record deleted before calculation/evidence linkage.' }, tx);
  });
  return NextResponse.json({ ok: true });
}
