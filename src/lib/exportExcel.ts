import * as XLSX from 'xlsx';
import { checklistSections } from '../data/checklist';
import { productCatalog } from '../data/productCatalog';
import { actionQueue, calculateReadiness, riskRegister } from './readiness';
import { opportunityRegister } from './opportunityRules';
import { computeScores } from './scoring';
import type { AccountRecord } from '../types';

export const buildSectionRows = (account: AccountRecord, sectionId: string) => {
  const section = checklistSections.find((s) => s.id === sectionId);
  if (!section) return [];
  return section.items.map((item) => {
    const response = account.responses[item.id];
    return {
      id: item.id,
      question: item.text,
      category: item.category,
      kind: item.kind,
      gates: item.gate.join(', '),
      status: response.status,
      answer: response.answer,
      owner: response.owner,
      dueDate: response.dueDate,
      risk: response.risk
    };
  });
};

export const exportAccountToExcel = (account: AccountRecord) => {
  const wb = XLSX.utils.book_new();
  const scores = computeScores(account.responses, account.productAdoption, account.reviewLens);
  const readiness = calculateReadiness(account.responses, account.reviewLens);
  const risks = riskRegister(account.responses);
  const opportunities = opportunityRegister(account.responses, account.productAdoption);

  const summaryRows = [{ ...scores, accountName: account.accountName, crmRef: account.crmRef, accountManager: account.accountManager, reviewLens: account.reviewLens, blockerCount: readiness.blockers, warningCount: readiness.warnings, opportunityCount: readiness.opportunities, topRisks: risks.slice(0, 3).map((r) => r.item.text).join(' | '), topOpportunities: opportunities.slice(0, 3).map((o) => o.title).join(' | ') }];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), 'Summary');

  const map: Record<string, string> = { commercial_context: 'Commercial', stakeholders: 'Stakeholders', priorities: 'Priorities & Governance', process_adoption: 'Process & Adoption', technology_data: 'Technology & Data', support_friction: 'Support & Friction', sentiment_action: 'Sentiment & Action Plan' };
  Object.entries(map).forEach(([sectionId, title]) => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(buildSectionRows(account, sectionId)), title));

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productCatalog.map((p) => ({ platform: p.platform, product: p.name, category: p.category, ...account.productAdoption[p.id] }))), 'Product Adoption');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(risks.map((r) => ({ section: checklistSections.find((s) => s.items.some((i) => i.id === r.item.id))?.title, question: r.item.text, status: r.response.status, answer: r.response.answer, owner: r.response.owner, dueDate: r.response.dueDate, risk: r.response.risk, category: r.item.category, gates: r.item.gate.join(', ') }))), 'Risk Register');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(opportunities), 'Opportunity Register');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(actionQueue(account.responses)), 'Action Queue');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(account.snapshots), 'Snapshots');

  XLSX.writeFile(wb, `${account.accountName || 'account'}-audit.xlsx`);
};
