import { NextResponse } from 'next/server';
import { emissionFactorsCsv } from '@/lib/exporters';
import { getEmissionFactors } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const emissionFactors = await getEmissionFactors();
  return new NextResponse(emissionFactorsCsv(emissionFactors), { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="emission-factor-master.csv"' } });
}
