import { Card, PageHeader } from '@/components/ui';
import { OrganizationCrud } from '@/components/forms/organization-crud';
import { L, T } from '@/components/language-provider';
import { getInventoryData } from '@/lib/data';

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

export default async function OrganizationBoundaryPage() {
  const { departments, organization, sites, source } = await getInventoryData();
  return (
    <div>
      <PageHeader eyebrow="Organization & Boundary" title="Organization and reporting boundary" description="Defines reporting year, base year, organizational boundary, operational boundary, facilities, departments, assumptions, and exclusions." />
      <OrganizationCrud organization={organization} sites={sites} departments={departments} source={source} />
      <div className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <Card>
          <h2 className="mb-3 text-xl font-bold"><T>Organization profile</T></h2>
          <div className="grid gap-2">
            <p><strong><L en="Name" th="ชื่อองค์กร" />:</strong> {organization.name}</p>
            <p><strong><T>Reporting year</T>:</strong> {organization.reportingYear}</p>
            <p><strong><T>Base year</T>:</strong> {organization.baseYear}</p>
            <p><strong><T>Consolidation</T>:</strong> <L en={organization.consolidationApproach} th={organization.consolidationApproach === 'Operational control' ? 'การควบคุมการดำเนินงาน' : organization.consolidationApproach} /></p>
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 text-xl font-bold"><T>Boundary</T></h2>
          <p><L en={organization.organizationalBoundary} th="ขอบเขตองค์กรครอบคลุมสำนักงานใหญ่ โรงงานฉีดพลาสติก คลังสินค้า และยานพาหนะโลจิสติกส์ของบริษัท ภายใต้แนวทางการควบคุมการดำเนินงาน" /></p>
          <p className="mt-3 text-carbon-muted"><L en={organization.operationalBoundary} th="ขอบเขตการดำเนินงานครอบคลุม Scope 1, Scope 2 และหมวด Scope 3 ที่มีนัยสำคัญ ตาม ISO 14064-1 และแนวปฏิบัติ TGO CFO" /></p>
        </Card>
        <Card>
          <h2 className="mb-3 text-xl font-bold"><T>Facilities and sites</T></h2>
          <div className="grid gap-2">{sites.map((site) => <div key={site.id} className="border-b border-carbon-line pb-2"><strong>{site.name}</strong><br /><small className="text-carbon-muted">{site.address}</small></div>)}</div>
        </Card>
        <Card>
          <h2 className="mb-3 text-xl font-bold"><T>Business units and departments</T></h2>
          <div className="flex flex-wrap gap-2">{departments.map((department) => <span key={department.id} className="rounded-full bg-carbon-bg px-3 py-2 text-sm font-semibold">{department.name}</span>)}</div>
        </Card>
        <Card>
          <h2 className="mb-3 text-xl font-bold"><T>Assumptions</T></h2>
          <ul className="list-disc pl-5">{organization.assumptions.map((item) => <li key={item}><L en={item} th={assumptionTh(item)} /></li>)}</ul>
        </Card>
        <Card>
          <h2 className="mb-3 text-xl font-bold"><T>Exclusions</T></h2>
          <ul className="list-disc pl-5">{organization.exclusions.map((item) => <li key={item}><L en={item} th={exclusionTh(item)} /></li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
