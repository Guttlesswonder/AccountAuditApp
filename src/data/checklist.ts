import type { ChecklistSection, ReviewLens } from '../types';

const allGates: ReviewLens[] = ['relationship', 'retention', 'growth', 'executive_review'];

const item = (
  id: string,
  text: string,
  category: ChecklistSection['items'][number]['category'],
  kind: ChecklistSection['items'][number]['kind'],
  mode: ChecklistSection['items'][number]['mode'] = 'simple',
  important = false
) => ({ id, text, category, kind, mode, important, gate: allGates });

export const checklistSections: ChecklistSection[] = [
  {
    id: 'commercial_terms',
    title: 'Commercial Footprint & Terms',
    description: 'Fast summary of terms, purchased footprint, and blockers.',
    items: [
      item('commercial-1', 'What are our terms with the customer, including renewal timing, pricing structure, and notable constraints?', 'commercial', 'coverage', 'flaggable', true),
      item('commercial-2', 'Which products have they purchased today?', 'commercial', 'coverage', 'simple', true),
      item('commercial-3', 'What is the current software footprint by platform, location type, or business unit?', 'commercial', 'coverage', 'simple'),
      item('commercial-4', 'Are there any commercial blockers or contract limitations affecting retention or expansion?', 'commercial', 'risk', 'flaggable', true)
    ]
  },
  {
    id: 'people_ownership',
    title: 'People & Ownership',
    description: 'Who matters, who owns what, and coverage quality.',
    items: [
      item('people-1', 'Who are the key contacts across Leadership, Clinical, Operations, and IT?', 'people', 'coverage', 'simple', true),
      item('people-2', 'Who oversees RCM, Insurance, IT, Marketing, and Support?', 'people', 'coverage', 'simple'),
      item('people-3', 'How are decisions made, and how much influence exists over individual practices?', 'people', 'health', 'simple'),
      item('people-4', 'Do we have strong stakeholder coverage, including executive sponsor and operational champion?', 'people', 'risk', 'flaggable', true)
    ]
  },
  {
    id: 'growth_practice',
    title: 'Growth Strategy & Practice Model',
    description: 'Growth motion, funding, standardization, and practice profile.',
    items: [
      item('growth-1', 'What are their growth plans, and do they grow via acquisition, de novo, or both?', 'commercial', 'opportunity', 'simple', true),
      item('growth-2', 'Are they PE backed, self-funded, or another structure affecting growth decisions?', 'commercial', 'coverage', 'simple'),
      item('growth-3', 'What growth have they seen in the last 12 months?', 'commercial', 'health', 'simple'),
      item('growth-4', 'What is standardized across locations, what varies, and what do they want standardized?', 'process', 'health', 'flaggable', true)
    ]
  },
  {
    id: 'operations_centralization',
    title: 'Operations & Centralization',
    description: 'Operating model, process friction, and revenue cycle execution.',
    items: [
      item('ops-1', 'Are systems and workflows managed centrally or by location?', 'process', 'coverage', 'simple', true),
      item('ops-2', 'If not centralized, is that causing frustration, inconsistency, or collection impact?', 'process', 'risk', 'flaggable', true),
      item('ops-3', 'How do they currently manage patient communication?', 'process', 'coverage', 'simple'),
      item('ops-4', 'How are insurance payments processed (office-level vs centralized), including ERA/835 and third-party dependencies?', 'process', 'risk', 'flaggable', true)
    ]
  },
  {
    id: 'technology_data_vendors',
    title: 'Technology, Data, & Vendors',
    description: 'Tech stack, BI maturity, partner landscape, and switching windows.',
    items: [
      item('tech-1', 'Are they using multiple systems or standardized platforms?', 'technology', 'health', 'simple', true),
      item('tech-2', 'Do they use 3D, AI, or advanced partners? If yes, which ones?', 'technology', 'opportunity', 'simple'),
      item('tech-3', 'Do they have a data warehouse and is BI handled in-house or outsourced?', 'technology', 'health', 'simple'),
      item('tech-4', 'What vendors are in place, what services do they provide, and where are the material gaps/limitations or timing constraints?', 'technology', 'risk', 'flaggable', true)
    ]
  },
  {
    id: 'health_risk_growth',
    title: 'Health, Risk, & Growth Opportunities',
    description: 'Executive POV on sentiment, risk, whitespace, and actions.',
    items: [
      item('health-1', 'What is the current overall sentiment (leadership, operational, technical)?', 'risk', 'health', 'flaggable', true),
      item('health-2', 'What are the top retention risks or pressure points right now?', 'risk', 'risk', 'flaggable', true),
      item('health-3', 'What are the top whitespace opportunities from gaps, unsold add-ons, expansion, or adjacent needs?', 'commercial', 'opportunity', 'flaggable', true),
      item('health-4', 'What are the top 3 next actions we should take internally or with the customer?', 'risk', 'coverage', 'flaggable', true)
    ]
  }
];
