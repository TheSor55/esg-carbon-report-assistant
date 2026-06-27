import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getInventoryData } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { recordChange } from '@/lib/audit-log';

const organizationSchema = z.object({
  name: z.string().min(1),
  reportingYear: z.coerce.number().int(),
  baseYear: z.coerce.number().int().optional(),
  consolidationApproach: z.string().min(1),
  organizationalBoundary: z.string().min(1),
  operationalBoundary: z.string().min(1),
  assumptions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional()
});

function requireDatabase() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not configured.' }, { status: 503 });
  }
  return null;
}

export async function GET() {
  const data = await getInventoryData();
  return NextResponse.json({ ok: true, organization: data.organization, sites: data.sites, departments: data.departments, source: data.source });
}

export async function PATCH(request: NextRequest) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;

  const parsed = organizationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const org = await prisma.organization.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!org) return NextResponse.json({ ok: false, error: 'No organization exists.' }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    await tx.organization.update({
      where: { id: org.id },
      data: {
        name: parsed.data.name,
        reportingYear: parsed.data.reportingYear,
        baseYear: parsed.data.baseYear,
        consolidationApproach: parsed.data.consolidationApproach,
        organizationalBoundary: parsed.data.organizationalBoundary,
        operationalBoundary: parsed.data.operationalBoundary,
        assumptions: parsed.data.assumptions?.filter(Boolean).join('\n'),
        exclusions: parsed.data.exclusions?.filter(Boolean).join('\n')
      }
    });
    await recordChange({ entityType: 'Organization', entityId: org.id, action: 'UPDATE', description: 'Organization and boundary profile updated.' }, tx);
  });

  return NextResponse.json({ ok: true });
}
