import { T } from '@/components/language-provider';
import { Card, PageHeader, StatusPill } from '@/components/ui';
import { calculateInventory } from '@/lib/calculation-engine';
import { getInventoryData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function VerificationPage() {
  const { activities, emissionFactors, verificationItems } = await getInventoryData();
  const results = calculateInventory(activities, emissionFactors);
  return (
    <div>
      <PageHeader eyebrow="Verification Preparation" title="Verification readiness workspace" description="Prepare evidence checklist, data gaps, verifier questions, calculation audit trail, and change log." />
      <div className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <Card><h2 className="mb-4 text-xl font-bold"><T>Checklist</T></h2><div className="grid gap-3">{verificationItems.map((item) => <div key={item.id} className="flex items-start justify-between gap-4 border-b border-carbon-line pb-3"><span><strong>{item.title}</strong><br /><small className="text-carbon-muted">{item.type} · {item.owner} · {item.note}</small></span><StatusPill status={item.status} /></div>)}</div></Card>
        <Card><h2 className="mb-4 text-xl font-bold"><T>Calculation audit trail</T></h2><div className="grid gap-3">{results.map((result) => <div key={result.activityId} className="border-b border-carbon-line pb-3"><strong>{result.activityId}</strong><p className="text-sm text-carbon-muted">{result.formula}</p><p className="text-sm"><T>Calculation version</T> {result.calculationVersion} · EF: {result.emissionFactorId} · <T>version</T> {result.emissionFactorVersion}</p></div>)}</div></Card>
        <Card><h2 className="mb-4 text-xl font-bold"><T>Data gap report</T></h2><div className="grid gap-3">{activities.filter((activity) => !activity.evidenceFileReference).length ? activities.filter((activity) => !activity.evidenceFileReference).map((activity) => <div key={activity.id} className="flex justify-between border-b border-carbon-line pb-3"><span>{activity.activityType}<br /><small className="text-carbon-muted"><T>Owner</T>: {activity.responsiblePerson}</small></span><StatusPill status="Missing" /></div>) : <p className="text-sm text-carbon-muted"><T>No missing evidence records.</T></p>}</div></Card>
        <Card><h2 className="mb-4 text-xl font-bold"><T>Change log</T></h2><div className="grid gap-3 text-sm"><p><T>v1 calculation created from active EF master version 2026.1.</T></p><p><T>EF updates must create new records and new calculation versions. Historical results are immutable by design.</T></p><p><T>Evidence upload metadata is represented by evidenceFileReference and planned database Evidence records.</T></p></div></Card>
      </div>
    </div>
  );
}
