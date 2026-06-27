export type Role = 'Admin' | 'ESG Manager' | 'Data Owner' | 'Reviewer' | 'Viewer';
export type Scope = 'Scope 1' | 'Scope 2' | 'Scope 3';
export type DataQualityRating = 'High' | 'Medium' | 'Low' | 'Estimated';
export type RecordStatus = 'Draft' | 'Ready' | 'Reviewed' | 'Rejected' | 'Inactive';
export type FactorVerificationStatus = 'Demo' | 'Pending Review' | 'Verified';

export interface OrganizationProfile {
  id: string;
  name: string;
  reportingYear: number;
  baseYear: number;
  organizationalBoundary: string;
  operationalBoundary: string;
  consolidationApproach: string;
  assumptions: string[];
  exclusions: string[];
}

export interface Site {
  id: string;
  name: string;
  address: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface EmissionFactor {
  id: string;
  factorCode: string;
  factorName: string;
  activityType: string;
  gasType: string;
  unit: string;
  kgCO2ePerUnit: number;
  source: string;
  sourceYear: number;
  version: string;
  effectiveDate: string;
  expiryDate?: string;
  countryRegion: string;
  referenceNote: string;
  isActive: boolean;
  verificationStatus?: FactorVerificationStatus;
}

export interface ActivityRecord {
  id: string;
  reportingPeriod: string;
  month: string;
  siteId: string;
  departmentId: string;
  activityType: string;
  scope: Scope;
  category: string;
  quantity: number;
  unit: string;
  dataSource: string;
  evidenceFileReference?: string;
  responsiblePerson: string;
  remark?: string;
  dataQualityRating: DataQualityRating;
  status?: RecordStatus;
  emissionFactorId: string;
}

export interface EvidenceRecord {
  id: string;
  activityId: string;
  activityLabel?: string;
  evidenceType: string;
  fileName?: string;
  fileUrl?: string;
  documentDate?: string;
  dataPeriod?: string;
  owner?: string;
  status: RecordStatus;
  reviewerComment?: string;
  note?: string;
  uploadedAt?: string;
  source?: 'database' | 'sample';
}

export interface CalculationResult {
  activityId: string;
  emissionFactorId: string;
  emissionFactorVersion: string;
  originalQuantity: number;
  originalUnit: string;
  quantityUsed: number;
  unitUsed: string;
  kgCO2e: number;
  tCO2e: number;
  calculationVersion: number;
  formula: string;
  uncertaintyNote: string;
}

export interface VerificationItem {
  id: string;
  title: string;
  type: 'Evidence' | 'Internal Review' | 'Data Gap' | 'Verifier Question' | 'Audit Trail' | 'Change Log';
  status: 'Ready' | 'Needs Review' | 'Missing';
  owner: string;
  dueDate?: string;
  note: string;
}
