import type { ChecklistSection, ReviewLens } from '../types';

const allGates: ReviewLens[] = ['relationship', 'retention', 'growth', 'executive_review'];
const rre: ReviewLens[] = ['relationship', 'retention', 'executive_review'];
const ge: ReviewLens[] = ['growth', 'executive_review'];

const buildItems = (
  prefix: string,
  category: ChecklistSection['items'][number]['category'],
  kind: ChecklistSection['items'][number]['kind'],
  gates: ReviewLens[],
  texts: string[]
) => texts.map((text, i) => ({ id: `${prefix}-${i + 1}`, text, category, kind, gate: gates, weight: i < 2 ? 'high' : 'medium' as const }));

export const checklistSections: ChecklistSection[] = [
  { id: 'commercial_context', title: 'Commercial Footprint & Contract Context', items: buildItems('commercial', 'commercial', 'coverage', allGates, [
    'Terms with the customer are clearly understood',
    'Current products purchased are confirmed',
    'Pricing model / commercial structure is understood',
    'Contract renewal timing is understood',
    'Known commercial friction points are identified',
    'Current software footprint is confirmed by platform',
    'Expansion constraints in current commercials are known'
  ]) },
  { id: 'stakeholders', title: 'Stakeholders & Organizational Coverage', items: buildItems('stakeholder', 'people', 'coverage', rre, [
    'Leadership stakeholders are identified', 'Clinical stakeholders are identified', 'Operations stakeholders are identified',
    'IT stakeholders are identified', 'RCM ownership is identified', 'Insurance ownership is identified', 'Marketing ownership is identified',
    'Support ownership is identified', 'Executive sponsor strength is understood', 'Day to day operational champion is identified',
    'Decision making hierarchy is understood', 'Signer / approver path is understood', 'Internal political dynamics are understood',
    'Relationship strength by stakeholder group is understood', 'Meeting cadence exists with the right stakeholder groups',
    'Turnover or champion fragility risk is identified'
  ]) },
  { id: 'priorities', title: 'Business Priorities, Growth Strategy, & Governance', items: buildItems('priority', 'process', 'health', allGates, [
    'Strategic priorities for the customer are known', 'Success metrics the customer cares about are known', 'Growth strategy is known',
    'Growth model is known, acquisition / de novo / both', 'Funding posture is known, PE backed / independent / other',
    'Last 12 month growth trend is understood', 'Influence over local practices is understood',
    'Standardization level across locations is understood', 'Areas already standardized are identified',
    'Areas they want to standardize are identified', 'Practice mix is understood, GP / ortho / specialty / mixed',
    'Governance model for operational decisions is understood', 'Urgency drivers or external business pressures are known'
  ]) },
  { id: 'process_adoption', title: 'Process, Adoption, & Operating Model', items: buildItems('process', 'process', 'health', rre, [
    'Core operational workflows are understood', 'Adoption quality of current software is understood', 'Process variation across locations is understood',
    'Centralized vs local operating model is understood', 'Decentralization is causing friction or not', 'Training model is understood',
    'Workflow owners are identified', 'Main process pain points are documented', 'Workarounds or shadow processes are documented',
    'Patient communication workflow is understood', 'Insurance processing workflow is understood',
    'Insurance processing is centralized vs office based', 'ERA / 835 usage is understood',
    'Third party vendors in insurance workflow are known', 'Collections impact from process design is understood',
    'Value realization evidence is known'
  ]) },
  { id: 'technology_data', title: 'Technology Stack, Data, & Environment', items: buildItems('tech', 'technology', 'health', allGates, [
    'Core systems are identified', 'System standardization vs fragmentation is understood', 'Imaging footprint is understood', '3D usage is understood',
    'AI tools in use are identified', 'AI partners in use are identified', 'Third party vendor stack is understood',
    'Services each third party vendor provides are understood', 'Vendor gaps or limitations are identified',
    'Preferred partner status is known where relevant', 'Vendor contract timing / change windows are known',
    'Data warehouse presence is understood', 'BI ownership model is known, in house vs outsourced', 'Key metrics tracked are known',
    'Reporting / export dependencies are known', 'Central data access requirements are known', 'Identity / SSO needs are understood',
    'Integration or manual bridge dependencies are known', 'Legacy systems still in use are known', 'Technology debt / complexity risks are known'
  ]) },
  { id: 'support_friction', title: 'Support, Friction, & Service Exposure', items: buildItems('support', 'risk', 'risk', rre, [
    'Open escalations are understood', 'Recurring support pain points are documented', 'Delivery or implementation failures are documented',
    'Service responsiveness concerns are documented', 'Product gaps affecting trust are documented', 'Known issue fatigue is identified',
    'Current sentiment toward vendor responsiveness is understood', 'Internal dependency risks on our side are identified',
    'Customer confidence in our partnership is assessed'
  ]) },
  { id: 'product_whitespace', title: 'Product Adoption & Whitespace', items: buildItems('whitespace', 'commercial', 'opportunity', [...ge, 'retention'], [
    'Current platform adoption is accurately mapped', 'Known operational gaps align to potential add on solutions',
    'Near term expansion opportunities are identified', 'Additional locations or business units outside current footprint are identified',
    'Add on blockers are understood', 'Budget / buying timing is understood', 'Next commercial motion is defined'
  ]) },
  { id: 'sentiment_action', title: 'Sentiment, Retention Risk, & Action Plan', items: buildItems('sentiment', 'risk', 'risk', allGates, [
    'Executive sentiment is understood', 'Operational sentiment is understood', 'IT sentiment is understood',
    'Relationship trend is improving / flat / declining', 'Retention risk factors are identified', 'Competitive risk is identified',
    'Pricing / billing risk is identified', 'Utilization risk is identified', 'Product fit risk is identified',
    'Churn or contraction signals are identified', 'Top 3 retention actions are defined', 'Top 3 growth actions are defined',
    'Internal owners are assigned', 'Customer facing next steps are defined', 'Executive escalation need is defined',
    'Product feedback loop need is defined'
  ]) }
];
