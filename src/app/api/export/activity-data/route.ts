import { NextResponse } from 'next/server';
import { activityDataCsv } from '@/lib/exporters';
import { getActivityRecords } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const activities = await getActivityRecords();
  return new NextResponse(activityDataCsv(activities), { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="activity-data.csv"' } });
}
