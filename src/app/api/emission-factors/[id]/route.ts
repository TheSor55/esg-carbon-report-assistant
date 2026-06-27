import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { factorStatusToPrisma } from '@/lib/data';
import { recordChange } from '@/lib/audit-log';

const updateFactorSchema = z.object({
  expiryDate: z.coerce.date().nullable().optional(),
  referenceNote: z.string().nullable().optional(),
  verificationStatus: z.enum(['Demo', 'Pending Review', 'Verified']).optional(),
  isActive: z.boolean().optional()
}).strict();

function requireDatabase() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not configured.' }, { status: 503 });
  }
  return null;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;

  const parsed = updateFactorSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.emissionFactor.update({
      where: { id: params.id },
      data: {
        expiryDate: parsed.data.expiryDate,
        referenceNote: parsed.data.referenceNote,
        verificationStatus: parsed.data.verificationStatus ? factorStatusToPrisma(parsed.data.verificationStatus) : undefined,
        isActive: parsed.data.isActive
      }
    });
    await recordChange({ entityType: 'EmissionFactor', entityId: params.id, action: 'UPDATE_METADATA', description: 'Emission factor metadata updated without changing factor value or version.' }, tx);
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;

  await prisma.$transaction(async (tx) => {
    await tx.emissionFactor.update({ where: { id: params.id }, data: { isActive: false } });
    await recordChange({ entityType: 'EmissionFactor', entityId: params.id, action: 'DEACTIVATE', description: 'Emission factor deactivated. Historical records remain preserved.' }, tx);
  });
  return NextResponse.json({ ok: true });
}
