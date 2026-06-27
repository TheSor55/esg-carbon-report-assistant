import type { ActivityRecord, Department, EmissionFactor, OrganizationProfile, Site, VerificationItem } from './types';

export const organization: OrganizationProfile = {
  id: 'org-plastic-injection',
  name: 'Siam Precision Plastic Injection Co., Ltd.',
  reportingYear: 2026,
  baseYear: 2024,
  organizationalBoundary: 'Operational control over head office, plastic injection plant, warehouse, and company logistics fleet.',
  operationalBoundary: 'Scope 1, Scope 2, and material Scope 3 categories aligned with ISO 14064-1 and TGO CFO practices.',
  consolidationApproach: 'Operational control',
  assumptions: ['Grid electricity factor follows active TGO reference version in the factor master.', 'Business travel distance is based on booking records.', 'Waste treatment factors are selected by disposal method.'],
  exclusions: ['Employee-owned home office energy is excluded due to immateriality.', 'Minor office supplies are excluded pending supplier data availability.']
};

export const sites: Site[] = [
  { id: 'site-plant', name: 'Rayong Plastic Injection Plant', address: 'Rayong, Thailand' },
  { id: 'site-hq', name: 'Bangkok Head Office', address: 'Bangkok, Thailand' },
  { id: 'site-warehouse', name: 'Chonburi Finished Goods Warehouse', address: 'Chonburi, Thailand' }
];

export const departments: Department[] = [
  { id: 'dept-production', name: 'Production' },
  { id: 'dept-facilities', name: 'Facilities' },
  { id: 'dept-logistics', name: 'Logistics' },
  { id: 'dept-procurement', name: 'Procurement' },
  { id: 'dept-hr', name: 'Human Resources' }
];

export const emissionFactors: EmissionFactor[] = [
  { id: 'ef-diesel-v2026', factorCode: 'TGO-CFO-DIESEL', factorName: 'Diesel combustion', activityType: 'Mobile combustion', gasType: 'CO2e', unit: 'kgCO2e/L', kgCO2ePerUnit: 2.7446, source: 'TGO CFO Emission Factor Update', sourceYear: 2026, version: '2026.1', effectiveDate: '2026-01-01', countryRegion: 'Thailand', referenceNote: 'Seed value. Replace with verified TGO factor table during production setup.', isActive: true },
  { id: 'ef-electricity-v2026', factorCode: 'TGO-CFO-GRID-ELEC', factorName: 'Purchased grid electricity', activityType: 'Purchased electricity', gasType: 'CO2e', unit: 'kgCO2e/kWh', kgCO2ePerUnit: 0.4999, source: 'TGO CFO Emission Factor Update', sourceYear: 2026, version: '2026.1', effectiveDate: '2026-01-01', countryRegion: 'Thailand', referenceNote: 'Seed value. Keep historical versions and never overwrite.', isActive: true },
  { id: 'ef-lpg-v2026', factorCode: 'TGO-CFO-LPG', factorName: 'LPG stationary combustion', activityType: 'Stationary combustion', gasType: 'CO2e', unit: 'kgCO2e/kg', kgCO2ePerUnit: 3.0, source: 'TGO CFO Emission Factor Update', sourceYear: 2026, version: '2026.1', effectiveDate: '2026-01-01', countryRegion: 'Thailand', referenceNote: 'Sample seed data for boiler and dryer fuel.', isActive: true },
  { id: 'ef-r410a-v2026', factorCode: 'IPCC-R410A', factorName: 'R-410A refrigerant leakage', activityType: 'Refrigerant leakage', gasType: 'CO2e', unit: 'kgCO2e/kg', kgCO2ePerUnit: 2088, source: 'IPCC GWP reference via TGO working paper', sourceYear: 2026, version: '2026.1', effectiveDate: '2026-01-01', countryRegion: 'Global', referenceNote: 'Sample refrigerant GWP factor.', isActive: true },
  { id: 'ef-pp-resin-v2026', factorCode: 'TGO-CFP-PP-RESIN', factorName: 'Polypropylene resin', activityType: 'Purchased raw materials', gasType: 'CO2e', unit: 'kgCO2e/kg', kgCO2ePerUnit: 1.92, source: 'TGO CFP Emission Factor Update', sourceYear: 2026, version: '2026.1', effectiveDate: '2026-01-01', countryRegion: 'Thailand', referenceNote: 'Sample factor for plastic injection raw material hotspot analysis.', isActive: true },
  { id: 'ef-waste-v2026', factorCode: 'TGO-CFO-GENERAL-WASTE', factorName: 'General waste disposal', activityType: 'Waste disposal', gasType: 'CO2e', unit: 'kgCO2e/kg', kgCO2ePerUnit: 0.467, source: 'TGO CFO Emission Factor Update', sourceYear: 2026, version: '2026.1', effectiveDate: '2026-01-01', countryRegion: 'Thailand', referenceNote: 'Sample waste treatment factor.', isActive: true },
  { id: 'ef-water-v2026', factorCode: 'TGO-CFO-WATER', factorName: 'Municipal water consumption', activityType: 'Water consumption', gasType: 'CO2e', unit: 'kgCO2e/m3', kgCO2ePerUnit: 0.794, source: 'TGO CFO Emission Factor Update', sourceYear: 2026, version: '2026.1', effectiveDate: '2026-01-01', countryRegion: 'Thailand', referenceNote: 'Sample water supply factor.', isActive: true },
  { id: 'ef-air-v2026', factorCode: 'TGO-CFO-AIR-TRAVEL', factorName: 'Business air travel', activityType: 'Business travel', gasType: 'CO2e', unit: 'kgCO2e/km', kgCO2ePerUnit: 0.158, source: 'TGO CFO Emission Factor Update', sourceYear: 2026, version: '2026.1', effectiveDate: '2026-01-01', countryRegion: 'Thailand', referenceNote: 'Sample business travel factor.', isActive: true }
];

export const activities: ActivityRecord[] = [
  { id: 'act-elec-jan', reportingPeriod: 'FY2026', month: '2026-01', siteId: 'site-plant', departmentId: 'dept-production', activityType: 'Purchased electricity', scope: 'Scope 2', category: 'Purchased electricity', quantity: 480000, unit: 'kWh', dataSource: 'Electricity bill', evidenceFileReference: 'EV-2026-001', responsiblePerson: 'Facilities Manager', remark: 'Main injection molding line electricity', dataQualityRating: 'High', emissionFactorId: 'ef-electricity-v2026' },
  { id: 'act-elec-feb', reportingPeriod: 'FY2026', month: '2026-02', siteId: 'site-plant', departmentId: 'dept-production', activityType: 'Purchased electricity', scope: 'Scope 2', category: 'Purchased electricity', quantity: 455000, unit: 'kWh', dataSource: 'Electricity bill', evidenceFileReference: 'EV-2026-002', responsiblePerson: 'Facilities Manager', remark: 'Production electricity', dataQualityRating: 'High', emissionFactorId: 'ef-electricity-v2026' },
  { id: 'act-diesel-logistics', reportingPeriod: 'FY2026', month: '2026-01', siteId: 'site-plant', departmentId: 'dept-logistics', activityType: 'Mobile combustion', scope: 'Scope 1', category: 'Diesel fleet', quantity: 18500, unit: 'L', dataSource: 'Fuel invoice', evidenceFileReference: 'FUEL-2026-011', responsiblePerson: 'Logistics Lead', remark: 'Company-owned delivery trucks', dataQualityRating: 'High', emissionFactorId: 'ef-diesel-v2026' },
  { id: 'act-lpg-boiler', reportingPeriod: 'FY2026', month: '2026-02', siteId: 'site-plant', departmentId: 'dept-facilities', activityType: 'Stationary combustion', scope: 'Scope 1', category: 'LPG boiler', quantity: 12000, unit: 'kg', dataSource: 'Fuel invoice', evidenceFileReference: 'LPG-2026-002', responsiblePerson: 'Maintenance Supervisor', remark: 'Drying process heat', dataQualityRating: 'High', emissionFactorId: 'ef-lpg-v2026' },
  { id: 'act-r410a-service', reportingPeriod: 'FY2026', month: '2026-03', siteId: 'site-warehouse', departmentId: 'dept-facilities', activityType: 'Refrigerant leakage', scope: 'Scope 1', category: 'Refrigerant leakage', quantity: 18, unit: 'kg', dataSource: 'Service record', evidenceFileReference: 'REF-2026-003', responsiblePerson: 'Warehouse Engineer', remark: 'Cold room maintenance', dataQualityRating: 'Medium', emissionFactorId: 'ef-r410a-v2026' },
  { id: 'act-pp-resin', reportingPeriod: 'FY2026', month: '2026-01', siteId: 'site-plant', departmentId: 'dept-procurement', activityType: 'Purchased raw materials', scope: 'Scope 3', category: 'Purchased goods and services', quantity: 210000, unit: 'kg', dataSource: 'Purchase record', evidenceFileReference: 'PO-RESIN-2026-014', responsiblePerson: 'Procurement Manager', remark: 'PP resin for injection molding', dataQualityRating: 'Medium', emissionFactorId: 'ef-pp-resin-v2026' },
  { id: 'act-waste', reportingPeriod: 'FY2026', month: '2026-02', siteId: 'site-plant', departmentId: 'dept-production', activityType: 'Waste disposal', scope: 'Scope 3', category: 'Waste generated in operations', quantity: 32000, unit: 'kg', dataSource: 'Waste manifest', evidenceFileReference: 'WASTE-2026-002', responsiblePerson: 'EHS Officer', remark: 'General non-hazardous waste', dataQualityRating: 'High', emissionFactorId: 'ef-waste-v2026' },
  { id: 'act-water', reportingPeriod: 'FY2026', month: '2026-02', siteId: 'site-plant', departmentId: 'dept-facilities', activityType: 'Water consumption', scope: 'Scope 3', category: 'Water supply', quantity: 9800, unit: 'm3', dataSource: 'Water bill', evidenceFileReference: 'WATER-2026-002', responsiblePerson: 'Facilities Manager', remark: 'Cooling tower and domestic use', dataQualityRating: 'High', emissionFactorId: 'ef-water-v2026' },
  { id: 'act-business-travel', reportingPeriod: 'FY2026', month: '2026-03', siteId: 'site-hq', departmentId: 'dept-hr', activityType: 'Business travel', scope: 'Scope 3', category: 'Business travel', quantity: 88000, unit: 'km', dataSource: 'Travel booking report', responsiblePerson: 'HR Manager', remark: 'Regional supplier audits', dataQualityRating: 'Estimated', emissionFactorId: 'ef-air-v2026' }
];

export const verificationItems: VerificationItem[] = [
  { id: 'ver-1', title: 'Electricity bills for all reporting months', type: 'Evidence', status: 'Ready', owner: 'Facilities Manager', dueDate: '2026-04-15', note: 'January and February bills attached. Continue monthly tracking.' },
  { id: 'ver-2', title: 'Raw material factor selection review', type: 'Internal Review', status: 'Needs Review', owner: 'ESG Manager', dueDate: '2026-04-30', note: 'Confirm PP resin factor against latest TGO CFP reference.' },
  { id: 'ver-3', title: 'Business travel evidence file', type: 'Data Gap', status: 'Missing', owner: 'HR Manager', dueDate: '2026-04-20', note: 'Travel booking distance report needs source file upload.' },
  { id: 'ver-4', title: 'Calculation audit trail version 1', type: 'Audit Trail', status: 'Ready', owner: 'Reviewer', note: 'Every result references EF ID and version.' },
  { id: 'ver-5', title: 'Verifier question register', type: 'Verifier Question', status: 'Needs Review', owner: 'ESG Manager', note: 'Prepare response template for exclusions and base year assumptions.' }
];
