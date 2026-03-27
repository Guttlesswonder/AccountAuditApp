export type ReviewLens = 'relationship' | 'retention' | 'growth' | 'executive_review';
export type Status = '' | 'Confirmed' | 'Assumed' | 'Unknown' | 'Not Applicable' | 'At Risk' | 'Opportunity';
export type Category = 'people' | 'process' | 'technology' | 'commercial' | 'risk';
export type ItemKind = 'coverage' | 'health' | 'risk' | 'opportunity';
export type Weight = 'low' | 'medium' | 'high';

export type ChecklistItem = {
  id: string;
  text: string;
  gate: ReviewLens[];
  category: Category;
  kind: ItemKind;
  weight?: Weight;
};

export type ChecklistSection = {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
};

export type ResponseRecord = {
  status: Status;
  answer: string;
  owner: string;
  dueDate: string;
  risk: string;
};

export type ProductAdoptionStatus = 'adopted' | 'not_adopted' | 'partial' | 'unknown';
export type ProductPlatform = 'Denticon' | 'Cloud9' | 'Apteryx';
export type ProductCategory =
  | 'core'
  | 'analytics'
  | 'ai'
  | 'payments'
  | 'rcm'
  | 'patient_experience'
  | 'integration'
  | 'imaging'
  | 'security';

export type ProductCatalogItem = {
  id: string;
  name: string;
  platform: ProductPlatform;
  category: ProductCategory;
  overlapsWith?: string[];
};

export type ProductAdoption = {
  productId: string;
  status: ProductAdoptionStatus;
  notes: string;
  owner: string;
  opportunityValue: '' | 'high' | 'medium' | 'low';
};

export type Snapshot = {
  id: string;
  createdAt: string;
  relationshipHealth: number;
  retentionRisk: number;
  growthPotential: number;
  operationalComplexity: number;
  overallPosture: 'Red' | 'Yellow' | 'Green' | 'Blue';
  note: string;
};

export type AccountRecord = {
  id: string;
  accountName: string;
  crmRef: string;
  accountManager: string;
  segment: string;
  reviewLens: ReviewLens;
  createdAt: string;
  updatedAt: string;
  responses: Record<string, ResponseRecord>;
  productAdoption: Record<string, ProductAdoption>;
  snapshots: Snapshot[];
};

export type AppState = {
  accounts: AccountRecord[];
  currentAccountId: string;
};

export type ReadinessSummary = {
  total: number;
  blockers: number;
  warnings: number;
  opportunities: number;
  percentCoverage: number;
  confidence: 'high' | 'medium' | 'low';
  summary: string;
};
