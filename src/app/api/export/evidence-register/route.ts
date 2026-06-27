import { NextResponse } from 'next/server';
import { evidenceRegisterCsv } from '@/lib/exporters';
import { getActivityRecords } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const activities = await getActivityRecords();
  return new NextResponse(evidenceRegisterCsv(activities), { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="verification-evidence-register.csv"' } });
}
