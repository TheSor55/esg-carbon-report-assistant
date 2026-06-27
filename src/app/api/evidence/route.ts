import { NextRequest, NextResponse } from 'next/server';
import { EvidenceType } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { recordChange } from '@/lib/audit-log';
import { getActivityRecords, getEvidenceRecords, recordStatusToPrisma } from '@/lib/data';

const evidenceSchema = z.object({
  activityId: z.string().min(1),
  evidenceType: z.string().min(1),
  fileName: z.string().optional(),
  fileUrl: z.string().url().optional(),
  documentDate: z.coerce.date().optional(),
  dataPeriod: z.string().optional(),
  owner: z.string().optional(),
  status: z.enum(['Draft', 'Ready', 'Reviewed', 'Rejected', 'Inactive']).optional(),
  reviewerComment: z.string().optional(),
  note: z.string().optional()
});

function evidenceTypeToPrisma(value: string): EvidenceType {
  const normalized = value.trim().toUpperCase().replaceAll(' ', '_').replaceAll('-', '_');
  return Object.values(EvidenceType).includes(normalized as EvidenceType) ? (normalized as EvidenceType) : EvidenceType.OTHER;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = evidenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, evidence: { ...parsed.data, uploadedAt: new Date().toISOString(), source: 'sample' } });
  }

  const evidence = await prisma.$transaction(async (tx) => {
    const created = await tx.evidence.create({
      data: {
        activityDataId: parsed.data.activityId,
        evidenceType: evidenceTypeToPrisma(parsed.data.evidenceType),
      fileName: parsed.data.fileName,
      fileUrl: parsed.data.fileUrl,
      documentDate: parsed.data.documentDate,
      dataPeriod: parsed.data.dataPeriod,
      owner: parsed.data.owner,
      status: recordStatusToPrisma(parsed.data.status ?? 'Draft'),
      reviewerComment: parsed.data.reviewerComment,
      note: parsed.data.note
      }
    });
    await recordChange({ entityType: 'Evidence', entityId: created.id, action: 'CREATE', description: `Evidence metadata registered for activity ${created.activityDataId}.` }, tx);
    return created;
  });

  return NextResponse.json({ ok: true, evidence: { ...parsed.data, id: evidence.id, uploadedAt: evidence.uploadedAt.toISOString(), source: 'database' } });
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, evidence: await getEvidenceRecords() });
  }
  return NextResponse.json({ ok: true, evidence: await getEvidenceRecords() });
}
