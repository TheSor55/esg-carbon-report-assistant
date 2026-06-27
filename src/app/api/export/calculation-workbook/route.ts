import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { calculateInventory } from '@/lib/calculation-engine';
import { getInventoryData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { activities, emissionFactors } = await getInventoryData();
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ESG Carbon Report Assistant';
  const activitySheet = workbook.addWorksheet('Activity Data');
  activitySheet.addRow(['Activity ID', 'Period', 'Month', 'Scope', 'Category', 'Quantity', 'Unit', 'EF ID', 'Evidence']);
  activities.forEach((activity) => activitySheet.addRow([activity.id, activity.reportingPeriod, activity.month, activity.scope, activity.category, activity.quantity, activity.unit, activity.emissionFactorId, activity.evidenceFileReference || 'Missing']));
  const calcSheet = workbook.addWorksheet('Calculations');
  calcSheet.addRow(['Activity ID', 'Calculation Version', 'EF ID', 'EF Version', 'Quantity Used', 'Unit Used', 'kgCO2e', 'tCO2e', 'Formula']);
  calculateInventory(activities, emissionFactors).forEach((result) => calcSheet.addRow([result.activityId, result.calculationVersion, result.emissionFactorId, result.emissionFactorVersion, result.quantityUsed, result.unitUsed, result.kgCO2e, result.tCO2e, result.formula]));
  const buffer = await workbook.xlsx.writeBuffer();
  const bytes = new Uint8Array(buffer as ArrayBuffer);
  const body = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;

  return new NextResponse(body, {
    headers: {
      'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'content-disposition': 'attachment; filename="ghg-calculation-workbook.xlsx"'
    }
  });
}
