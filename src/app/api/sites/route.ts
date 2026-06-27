import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getInventoryData } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { recordChange } from '@/lib/audit-log';

const siteSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional()
});

function requireDatabase() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not configured.' }, { status: 503 });
  }
  return null;
}

export async function GET() {
  return NextResponse.json({ ok: true, sites: (await getInventoryData()).sites });
}

export async function POST(request: NextRequest) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;

  const parsed = siteSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });

  const org = await prisma.organization.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!org) return NextResponse.json({ ok: false, error: 'No organization exists.' }, { status: 404 });

  const site = await prisma.$transaction(async (tx) => {
    const created = await tx.site.create({ data: { ...parsed.data, organizationId: org.id } });
    await recordChange({ entityType: 'Site', entityId: created.id, action: 'CREATE', description: 'Facility/site created.' }, tx);
    return created;
  });

  return NextResponse.json({ ok: true, id: site.id }, { status: 201 });
}
