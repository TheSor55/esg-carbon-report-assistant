import { Card, PageHeader } from '@/components/ui';
import { L, T } from '@/components/language-provider';
import { calculateInventory } from '@/lib/calculation-engine';
import { generateGhgReport } from '@/lib/report-generator';
import { getInventoryData } from '@/lib/data';

function format(value: number) { return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value); }

export const dynamic = 'force-dynamic';

function assumptionTh(item: string) {
  if (item === 'Grid electricity factor follows active TGO reference version in the factor master.') return 'ปัจจัยไฟฟ้าอ้างอิงเวอร์ชัน TGO ที่ใช้งานอยู่ในทะเบียนปัจจัยการปล่อย';
  if (item === 'Business travel distance is based on booking records.') return 'ระยะทางการเดินทางธุรกิจอ้างอิงจากข้อมูลการจอง';
  if (item === 'Waste treatment factors are selected by disposal method.') return 'ปัจจัยการจัดการของเสียเลือกตามวิธีการกำจัด';
  return item;
}

function exclusionTh(item: string) {
  if (item === 'Employee-owned home office energy is excluded due to immateriality.') return 'ไม่รวมพลังงานสำนักงานที่บ้านของพนักงาน เนื่องจากไม่มีนัยสำคัญ';
  if (item === 'Minor office supplies are excluded pending supplier data availability.') return 'ไม่รวมวัสดุสำนักงานมูลค่าน้อย ระหว่างรอข้อมูลจากผู้ขาย';
  return item;
}

export default async function ReportsPage() {
  const { activities, departments, emissionFactors, organization, sites, verificationItems } = await getInventoryData();
  const results = calculateInventory(activities, emissionFactors);
  const report = generateGhgReport({ organization, activities, factors: emissionFactors, results, sites, departments, verificationItems });
  return (
    <div>
      <PageHeader eyebrow="ESG Report Generator" title="Structured ESG/GHG report" description="Report output includes reporting year, boundary, assumptions, exclusions, methodology, inventory summary, hotspots, evidence register, and verification readiness." />
      <div className="mb-4 flex flex-wrap gap-3"><a className="rounded-lg bg-carbon-green px-4 py-2 font-semibold text-white" href="/api/export/report-pdf"><T>Export PDF report</T></a><a className="rounded-lg bg-carbon-teal px-4 py-2 font-semibold text-white" href="/api/export/evidence-register"><T>Export evidence register</T></a></div>
      <div className="grid gap-4">
        <Card><h2 className="mb-2 text-xl font-bold"><T>Executive Summary</T></h2><p><L en={report.executiveSummary} th={`การปล่อยก๊าซเรือนกระจกรวม ${format(report.inventorySummary.totalTCO2e)} tCO2e สำหรับปีรายงาน ${organization.reportingYear} โดยแหล่งปล่อยสำคัญมาจากไฟฟ้าที่ซื้อและวัตถุดิบเม็ดพลาสติกโพลีโพรพิลีน`} /></p></Card>
        <Card><h2 className="mb-2 text-xl font-bold"><T>Organization Profile</T></h2><p>{organization.name} · <T>Reporting year</T> {organization.reportingYear} · <T>Base year</T> {organization.baseYear}</p></Card>
        <Card><h2 className="mb-2 text-xl font-bold"><T>Reporting Boundary</T></h2><p><L en={report.reportingBoundary.organizationalBoundary} th="ขอบเขตองค์กรครอบคลุมสำนักงานใหญ่ โรงงานฉีดพลาสติก คลังสินค้า และยานพาหนะโลจิสติกส์ของบริษัท ภายใต้แนวทางการควบคุมการดำเนินงาน" /></p><p className="mt-2 text-carbon-muted"><L en={report.reportingBoundary.operationalBoundary} th="ขอบเขตการดำเนินงานครอบคลุม Scope 1, Scope 2 และหมวด Scope 3 ที่มีนัยสำคัญ ตาม ISO 14064-1 และแนวปฏิบัติ TGO CFO" /></p></Card>
        <Card><h2 className="mb-2 text-xl font-bold"><T>Methodology</T></h2><p><L en={report.methodology} th="การคำนวณใช้สูตร การปล่อย = ข้อมูลกิจกรรม x ปัจจัยการปล่อย โดยเก็บปริมาณและหน่วยเดิมไว้เสมอ ผลการคำนวณเก็บรหัส EF และเวอร์ชัน EF เพื่อการตรวจสอบย้อนกลับ และไม่ควรเขียนทับเวอร์ชันผลคำนวณย้อนหลัง" /></p></Card>
        <Card><h2 className="mb-2 text-xl font-bold"><T>GHG Inventory Summary</T></h2><p className="text-3xl font-bold">{format(report.inventorySummary.totalTCO2e)} tCO2e</p><div className="mt-3 grid grid-cols-3 gap-3 max-md:grid-cols-1">{Object.entries(report.inventorySummary.scopeSummary).map(([scope, value]) => <div key={scope} className="rounded-lg bg-carbon-bg p-4"><p>{scope}</p><strong>{format(value)} tCO2e</strong></div>)}</div></Card>
        <Card><h2 className="mb-2 text-xl font-bold"><T>Significant emissions sources</T></h2><div className="grid gap-2">{report.significantSources.map((source) => <div key={source.activity + source.site} className="flex justify-between border-b border-carbon-line pb-2"><span>{source.category}<br /><small className="text-carbon-muted">{source.site} · {source.department}</small></span><strong>{format(source.tCO2e)} tCO2e</strong></div>)}</div></Card>
        <Card><h2 className="mb-2 text-xl font-bold"><T>Assumptions and exclusions</T></h2><ul className="list-disc pl-5">{organization.assumptions.map((item) => <li key={item}><L en={item} th={assumptionTh(item)} /></li>)}</ul><h3 className="mt-4 font-bold"><T>Exclusions</T></h3><ul className="list-disc pl-5">{organization.exclusions.map((item) => <li key={item}><L en={item} th={exclusionTh(item)} /></li>)}</ul></Card>
      </div>
    </div>
  );
}
