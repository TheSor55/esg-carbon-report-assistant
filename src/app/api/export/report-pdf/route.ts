import { NextResponse } from 'next/server';
import { calculateInventory } from '@/lib/calculation-engine';
import { generateGhgReport } from '@/lib/report-generator';
import { getInventoryData } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function GET() {
  const { activities, departments, emissionFactors, organization, sites, verificationItems } = await getInventoryData();
  const results = calculateInventory(activities, emissionFactors);
  const report = generateGhgReport({
    organization,
    activities,
    factors: emissionFactors,
    results,
    sites,
    departments,
    verificationItems
  });

  // TODO: Re-enable direct PDF generation after replacing pdfkit with a build-safe PDF renderer.
  // Current fallback returns printable HTML so production builds do not fail on missing Helvetica.afm.
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>ESG GHG Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #17211b; line-height: 1.6; }
    h1, h2 { color: #28724f; }
    .card { border: 1px solid #dce4db; border-radius: 8px; padding: 16px; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border-bottom: 1px solid #dce4db; padding: 8px; text-align: left; }
    .print { margin-bottom: 24px; }
    @media print { .print { display: none; } body { margin: 20px; } }
  </style>
</head>
<body>
  <button class="print" onclick="window.print()">Print / Save as PDF</button>

  <h1>ESG Carbon Report Assistant</h1>
  <p><strong>Organization:</strong> ${escapeHtml(organization.name)}</p>
  <p><strong>Reporting year:</strong> ${escapeHtml(organization.reportingYear)}</p>
  <p><strong>Base year:</strong> ${escapeHtml(organization.baseYear)}</p>

  <div class="card">
    <h2>Executive Summary</h2>
    <p>${escapeHtml(report.executiveSummary)}</p>
  </div>

  <div class="card">
    <h2>Methodology</h2>
    <p>${escapeHtml(report.methodology)}</p>
  </div>

  <div class="card">
    <h2>Inventory Summary</h2>
    <p><strong>Total:</strong> ${report.inventorySummary.totalTCO2e.toFixed(2)} tCO2e</p>
    <table>
      <thead>
        <tr><th>Scope</th><th>tCO2e</th></tr>
      </thead>
      <tbody>
        ${Object.entries(report.inventorySummary.scopeSummary)
          .map(([scope, value]) => `<tr><td>${escapeHtml(scope)}</td><td>${value.toFixed(2)}</td></tr>`)
          .join('')}
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2>Assumptions</h2>
    <ul>
      ${organization.assumptions.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
    </ul>
  </div>

  <div class="card">
    <h2>Exclusions</h2>
    <ul>
      ${organization.exclusions.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
    </ul>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'content-disposition': 'inline; filename="esg-ghg-report.html"'
    }
  });
}
