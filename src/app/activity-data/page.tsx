import { Card, PageHeader, StatusPill } from '@/components/ui';
import { ActivityCrud } from '@/components/forms/activity-crud';
import { T } from '@/components/language-provider';
import { calculateInventory } from '@/lib/calculation-engine';
import { getInventoryData } from '@/lib/data';

function format(value: number) { return new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(value); }

export const dynamic = 'force-dynamic';

export default async function ActivityDataPage() {
  const { activities, departments, emissionFactors, organization, reportingPeriodId, reportingPeriodLabel, sites, source } = await getInventoryData();
  const resultMap = new Map(calculateInventory(activities, emissionFactors).map((result) => [result.activityId, result]));
  return (
    <div>
      <PageHeader eyebrow="Activity Data" title="Activity data management" description="Each record preserves original quantity, unit, evidence reference, responsible person, data quality, and emission factor ID." />
      <ActivityCrud activities={activities} departments={departments} emissionFactors={emissionFactors} sites={sites} source={source} reportingPeriodId={reportingPeriodId} reportingPeriodLabel={reportingPeriodLabel ?? 'FY' + organization.reportingYear} />
      <Card className="table-scroll">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead><tr className="text-left text-carbon-muted"><th className="border-b p-3"><T>Period</T></th><th className="border-b p-3"><T>Site</T></th><th className="border-b p-3"><T>Department</T></th><th className="border-b p-3"><T>Activity</T></th><th className="border-b p-3"><T>Scope</T></th><th className="border-b p-3"><T>Quantity</T></th><th className="border-b p-3"><T>EF ID</T></th><th className="border-b p-3">tCO2e</th><th className="border-b p-3"><T>Evidence</T></th><th className="border-b p-3"><T>Quality</T></th></tr></thead>
          <tbody>{activities.map((activity) => {
            const result = resultMap.get(activity.id);
            return <tr key={activity.id}><td className="border-b p-3">{activity.month}</td><td className="border-b p-3">{sites.find((site) => site.id === activity.siteId)?.name}</td><td className="border-b p-3">{departments.find((department) => department.id === activity.departmentId)?.name}</td><td className="border-b p-3">{activity.activityType}<br /><small className="text-carbon-muted">{activity.category}</small></td><td className="border-b p-3">{activity.scope}</td><td className="border-b p-3">{format(activity.quantity)} {activity.unit}</td><td className="border-b p-3">{activity.emissionFactorId}<br /><small className="text-carbon-muted">v{result?.emissionFactorVersion}</small></td><td className="border-b p-3 font-semibold">{format(result?.tCO2e || 0)}</td><td className="border-b p-3">{activity.evidenceFileReference ? <StatusPill status="Ready" /> : <StatusPill status="Missing" />}</td><td className="border-b p-3"><StatusPill status={activity.dataQualityRating} /></td></tr>;
          })}</tbody>
        </table>
      </Card>
      <div className="mt-4 flex flex-wrap gap-3"><a className="rounded-lg bg-carbon-green px-4 py-2 font-semibold text-white" href="/api/export/activity-data"><T>Export CSV</T></a><a className="rounded-lg bg-carbon-teal px-4 py-2 font-semibold text-white" href="/api/export/calculation-workbook"><T>Export Excel workbook</T></a></div>
    </div>
  );
}
