import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getInventoryData } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { recordChange } from '@/lib/audit-log';

const departmentSchema = z.object({
  name: z.string().min(1)
});

function requireDatabase() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not configured.' }, { status: 503 });
  }
  return null;
}

export async function GET() {
  return NextResponse.json({ ok: true, departments: (await getInventoryData()).departments });
}

export async function POST(request: NextRequest) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;
  const parsed = departmentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  const org = await prisma.organization.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!org) return NextResponse.json({ ok: false, error: 'No organization exists.' }, { status: 404 });
  const department = await prisma.$transaction(async (tx) => {
    const created = await tx.department.create({ data: { ...parsed.data, organizationId: org.id } });
    await recordChange({ entityType: 'Department', entityId: created.id, action: 'CREATE', description: 'Department created.' }, tx);
    return created;
  });
  return NextResponse.json({ ok: true, id: department.id }, { status: 201 });
}
