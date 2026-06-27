import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { recordChange } from '@/lib/audit-log';
import { recordStatusToPrisma } from '@/lib/data';

const updateEvidenceSchema = z.object({
  fileName: z.string().nullable().optional(),
  fileUrl: z.string().url().nullable().optional(),
  documentDate: z.coerce.date().nullable().optional(),
  dataPeriod: z.string().nullable().optional(),
  owner: z.string().nullable().optional(),
  status: z.enum(['Draft', 'Ready', 'Reviewed', 'Rejected', 'Inactive']).optional(),
  reviewerComment: z.string().nullable().optional(),
  note: z.string().nullable().optional()
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

  const parsed = updateEvidenceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.evidence.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        status: parsed.data.status ? recordStatusToPrisma(parsed.data.status) : undefined
      }
    });
    await recordChange({ entityType: 'Evidence', entityId: params.id, action: 'UPDATE', description: 'Evidence metadata updated.' }, tx);
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const missingDatabase = requireDatabase();
  if (missingDatabase) return missingDatabase;

  await prisma.$transaction(async (tx) => {
    await tx.evidence.delete({ where: { id: params.id } });
    await recordChange({ entityType: 'Evidence', entityId: params.id, action: 'DELETE', description: 'Evidence metadata deleted.' }, tx);
  });

  return NextResponse.json({ ok: true });
}
