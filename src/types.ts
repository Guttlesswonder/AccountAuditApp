export type ReviewLens = 'relationship' | 'retention' | 'growth' | 'executive_review';
export type VisibleStatus = '' | 'Confirmed' | 'Unknown' | 'At Risk' | 'Opportunity' | 'Not Applicable' | 'Assumed';
export type Category = 'commercial' | 'people' | 'process' | 'technology' | 'risk';
export type ItemKind = 'coverage' | 'health' | 'risk' | 'opportunity';
export type ChecklistItemMode = 'simple' | 'flaggable';

export type ChecklistItem = {
  id: string;
  text: string;
  gate: ReviewLens[];
  category: Category;
  kind: ItemKind;
  mode: ChecklistItemMode;
  important?: boolean;
};

export type ChecklistSection = {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
};

export type ResponseRecord = {
  status: VisibleStatus;
  answer: string;
  followUpNote?: string;
  owner?: string;
  dueDate?: string;
  consequence?: string;
};

export type ProductAdoptionStatus = 'adopted' | 'not_adopted' | 'partial' | 'unknown';
export type ProductPlatform = 'Denticon' | 'Cloud 9' | 'Apteryx';
export type ProductCategory = 'core' | 'analytics' | 'ai' | 'rcm' | 'patient_experience' | 'integration' | 'imaging' | 'security';

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
  opportunityValue?: '' | 'high' | 'medium' | 'low';
};

export type ActionType = 'risk' | 'opportunity' | 'follow_up';
export type ActionItem = {
  id: string;
  title: string;
  relatedSection: string;
  type: ActionType;
  owner: string;
  dueDate: string;
  note: string;
  linkedItemId?: string;
};

export type TermsAttachmentMeta = {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
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
  hasDenticon: boolean;
  hasCloud9: boolean;
  hasApteryx: boolean;
  termsSummary: string;
  termsAttachment?: TermsAttachmentMeta;
  createdAt: string;
  updatedAt: string;
  responses: Record<string, ResponseRecord>;
  productAdoption: Record<string, ProductAdoption>;
  actions: ActionItem[];
  snapshots: Snapshot[];
};

export type AppState = { accounts: AccountRecord[]; currentAccountId: string };

export type ReadinessSummary = {
  total: number;
  blockers: number;
  opportunities: number;
  percentCoverage: number;
  confidenceLabel: 'Low' | 'Moderate' | 'Strong';
};
