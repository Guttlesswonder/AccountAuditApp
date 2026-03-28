import * as XLSX from 'xlsx';
import { checklistSections } from '../data/checklist';
import { productCatalog } from '../data/productCatalog';
import { deriveRiskRegister, topThreeActions } from './readiness';
import { topWhitespace } from './opportunityRules';
import { calculateReadiness } from './readiness';
import { computeScores } from './scoring';
import type { AccountRecord } from '../types';

const sectionRows = (account: AccountRecord, sectionId: string) => {
  const section = checklistSections.find((s) => s.id === sectionId);
  if (!section) return [];
  return section.items.map((item) => {
    const r = account.responses[item.id];
    return {
      prompt: item.text,
      status: r.status,
      answer: r.answer,
      followUpNote: r.followUpNote ?? '',
      owner: r.owner ?? '',
      dueDate: r.dueDate ?? '',
      consequence: r.consequence ?? ''
    };
  });
};

export const exportAccountToExcel = (account: AccountRecord) => {
  const wb = XLSX.utils.book_new();
  const platforms = { hasDenticon: account.hasDenticon, hasCloud9: account.hasCloud9, hasApteryx: account.hasApteryx };
  const scores = computeScores(account.responses, account.productAdoption, account.reviewLens, platforms);
  const readiness = calculateReadiness(account.responses, account.reviewLens);
  const risks = deriveRiskRegister(account.responses);
  const opportunities = topWhitespace(account.responses, account.productAdoption, platforms);

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet([
      {
        accountName: account.accountName,
        reviewLens: account.reviewLens,
        overallPosture: scores.overallPosture,
        relationshipHealth: scores.relationshipHealth,
        retentionRisk: scores.retentionRisk,
        growthPotential: scores.growthPotential,
        operationalComplexity: scores.operationalComplexity,
        confidence: readiness.confidenceLabel,
        termsSummary: account.termsSummary,
        termsFileName: account.termsAttachment?.fileName ?? '',
        termsUploadedAt: account.termsAttachment?.uploadedAt ?? '',
        termsAvailableLocally: account.termsAttachment ? 'yes' : 'no'
      }
    ]),
    'Summary'
  );

  const tabs: Array<[string, string]> = [
    ['commercial_terms', 'Commercial & Terms'],
    ['people_ownership', 'People & Ownership'],
    ['growth_practice', 'Growth & Practice Model'],
    ['operations_centralization', 'Operations & Centralization'],
    ['technology_data_vendors', 'Technology, Data & Vendors'],
    ['health_risk_growth', 'Health, Risk & Opportunities']
  ];

  tabs.forEach(([sectionId, title]) => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sectionRows(account, sectionId)), title));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productCatalog.map((p) => ({ platform: p.platform, product: p.name, category: p.category, ...account.productAdoption[p.id] }))), 'Product Adoption');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(account.actions), 'Action Register');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(account.snapshots), 'Snapshots');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(risks), 'Risk Register');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(opportunities), 'Opportunity Register');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(topThreeActions(account.actions)), 'Next 3 Actions');

  XLSX.writeFile(wb, `${account.accountName || 'account'}-v1-1.xlsx`);
};
