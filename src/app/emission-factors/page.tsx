import { T } from '@/components/language-provider';
import { Card, PageHeader, StatusPill } from '@/components/ui';
import { EmissionFactorCrud } from '@/components/forms/emission-factor-crud';
import { getInventoryData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function EmissionFactorsPage() {
  const { emissionFactors, source } = await getInventoryData();
  return (
    <div>
      <PageHeader eyebrow="Emission Factor Master" title="Emission factor master" description="Admins must create new versions instead of overwriting prior emission factor records. Calculation results preserve EF ID and version." />
      <EmissionFactorCrud factors={emissionFactors} source={source} />
      <Card className="table-scroll">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead><tr className="text-left text-carbon-muted"><th className="border-b p-3"><T>Code</T></th><th className="border-b p-3"><T>Factor name</T></th><th className="border-b p-3"><T>Activity type</T></th><th className="border-b p-3"><T>Gas</T></th><th className="border-b p-3"><T>Unit</T></th><th className="border-b p-3"><T>kgCO2e/unit</T></th><th className="border-b p-3"><T>Source</T></th><th className="border-b p-3"><T>Version</T></th><th className="border-b p-3"><T>Effective</T></th><th className="border-b p-3"><T>Status</T></th></tr></thead>
          <tbody>{emissionFactors.map((factor) => <tr key={factor.id}><td className="border-b p-3">{factor.factorCode}</td><td className="border-b p-3">{factor.factorName}<br /><small className="text-carbon-muted">{factor.referenceNote}</small></td><td className="border-b p-3">{factor.activityType}</td><td className="border-b p-3">{factor.gasType}</td><td className="border-b p-3">{factor.unit}</td><td className="border-b p-3 font-semibold">{factor.kgCO2ePerUnit}</td><td className="border-b p-3">{factor.source}<br /><small className="text-carbon-muted">{factor.countryRegion} · {factor.sourceYear}</small></td><td className="border-b p-3">{factor.version}</td><td className="border-b p-3">{factor.effectiveDate}</td><td className="border-b p-3"><StatusPill status={factor.isActive ? 'Active' : 'Inactive'} /></td></tr>)}</tbody>
        </table>
      </Card>
      <div className="mt-4 flex flex-wrap gap-3"><a className="rounded-lg bg-carbon-green px-4 py-2 font-semibold text-white" href="/api/export/emission-factors"><T>Export CSV</T></a><a className="rounded-lg border border-carbon-line bg-white px-4 py-2 font-semibold" href="/references/tgo/CFO%20Emission%20Factor%20Update.pdf" target="_blank"><T>Open TGO CFO PDF</T></a><a className="rounded-lg border border-carbon-line bg-white px-4 py-2 font-semibold" href="/references/tgo/CFP%20Emission%20Factor%20Update.pdf" target="_blank"><T>Open TGO CFP PDF</T></a></div>
    </div>
  );
}
