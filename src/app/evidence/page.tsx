import { T } from '@/components/language-provider';
import { Card, PageHeader, StatusPill } from '@/components/ui';
import { EvidenceCrud } from '@/components/forms/evidence-crud';
import { getInventoryData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function EvidencePage() {
  const { activities, evidenceRecords, source } = await getInventoryData();
  return (
    <div>
      <PageHeader eyebrow="Evidence Register" title="Evidence file upload and URL register" description="Phase 2 stores evidence file references and supports URL entry. Production upload storage can be backed by local storage, S3, SharePoint, or Google Drive." />
      <EvidenceCrud activities={activities} evidenceRecords={evidenceRecords} source={source} />
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-4 max-xl:grid-cols-1">
        <Card className="table-scroll">
          <h2 className="mb-3 text-xl font-bold"><T>Evidence status by activity</T></h2>
          <table className="w-full min-w-[760px] border-collapse text-sm"><thead><tr className="text-left text-carbon-muted"><th className="border-b p-3"><T>Activity</T></th><th className="border-b p-3"><T>Data source</T></th><th className="border-b p-3"><T>Evidence ref</T></th><th className="border-b p-3"><T>Owner</T></th><th className="border-b p-3"><T>Status</T></th></tr></thead><tbody>{activities.map((activity) => <tr key={activity.id}><td className="border-b p-3">{activity.activityType}</td><td className="border-b p-3">{activity.dataSource}</td><td className="border-b p-3">{activity.evidenceFileReference || <T>Missing</T>}</td><td className="border-b p-3">{activity.responsiblePerson}</td><td className="border-b p-3"><StatusPill status={activity.evidenceFileReference ? 'Ready' : 'Missing'} /></td></tr>)}</tbody></table>
        </Card>
      </div>
    </div>
  );
}
