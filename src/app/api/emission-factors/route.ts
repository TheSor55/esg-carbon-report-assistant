import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { factorStatusToPrisma, getEmissionFactors } from '@/lib/data';
import { recordChange } from '@/lib/audit-log';

const factorSchema = z.object({
  factorCode: z.string().min(1),
  factorName: z.string().min(1),
  activityType: z.string().min(1),
  gasType: z.string().min(1),
  unit: z.string().min(1),
  kgCO2ePerUnit: z.coerce.number().nonnegative(),
  source: z.string().min(1),
  sourceYear: z.coerce.number().int(),
  version: z.string().min(1),
  effectiveDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional(),
  countryRegion: z.string().min(1),
  referenceNote: z.string().optional(),
  verificationStatus: z.enum(['Demo', 'Pending Review', 'Verified']).optional(),
  isActive: z.boolean().optional()
});

function requireDatabase() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not configured.' }, { status: 503 });
  }
  return null;
}

export async function GET() {
  return NextResponse.json({ ok: true, emissionFactors: await getEmissionFactors() });
}

export async function POST(request: NextRequest) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;

  const parsed = factorSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const factor = await prisma.$transaction(async (tx) => {
    const created = await tx.emissionFactor.create({
      data: {
        ...parsed.data,
        verificationStatus: factorStatusToPrisma(parsed.data.verificationStatus ?? 'Demo')
      }
    });
    await recordChange({ entityType: 'EmissionFactor', entityId: created.id, action: 'CREATE', description: `Emission factor ${created.factorCode} version ${created.version} created.` }, tx);
    return created;
  });
  return NextResponse.json({ ok: true, id: factor.id }, { status: 201 });
}
