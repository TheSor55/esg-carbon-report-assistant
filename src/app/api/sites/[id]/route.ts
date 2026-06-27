import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { recordChange } from '@/lib/audit-log';

const siteSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().nullable().optional()
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
  const parsed = siteSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  await prisma.$transaction(async (tx) => {
    await tx.site.update({ where: { id: params.id }, data: parsed.data });
    await recordChange({ entityType: 'Site', entityId: params.id, action: 'UPDATE', description: 'Facility/site updated.' }, tx);
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;
  const count = await prisma.activityData.count({ where: { siteId: params.id } });
  if (count) return NextResponse.json({ ok: false, error: 'Sites with activity records cannot be deleted.' }, { status: 409 });
  await prisma.$transaction(async (tx) => {
    await tx.site.delete({ where: { id: params.id } });
    await recordChange({ entityType: 'Site', entityId: params.id, action: 'DELETE', description: 'Facility/site deleted.' }, tx);
  });
  return NextResponse.json({ ok: true });
}
