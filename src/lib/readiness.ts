import { checklistSections } from '../data/checklist';
import { allChecklistItems } from './checklist';
import type { ActionItem, ReadinessSummary, ResponseRecord, ReviewLens } from '../types';

export const calculateReadiness = (responses: Record<string, ResponseRecord>, lens: ReviewLens): ReadinessSummary => {
  const relevant = allChecklistItems().filter((item) => item.gate.includes(lens));
  const blockers = relevant.filter((item) => {
    const r = responses[item.id];
    return !r?.status || !r?.answer.trim() || r.status === 'Unknown' || r.status === 'At Risk';
  }).length;
  const opportunities = relevant.filter((item) => responses[item.id]?.status === 'Opportunity').length;
  const percentCoverage = relevant.length ? Math.round(((relevant.length - blockers) / relevant.length) * 100) : 0;
  const confidenceLabel = percentCoverage >= 75 ? 'Strong' : percentCoverage >= 45 ? 'Moderate' : 'Low';
  return { total: relevant.length, blockers, opportunities, percentCoverage, confidenceLabel };
};

export const deriveRiskRegister = (responses: Record<string, ResponseRecord>) =>
  allChecklistItems()
    .filter((item) => {
      const r = responses[item.id];
      return r?.status === 'At Risk' || (item.important && r?.status === 'Unknown');
    })
    .map((item) => {
      const section = checklistSections.find((s) => s.items.some((i) => i.id === item.id));
      const response = responses[item.id];
      return {
        itemId: item.id,
        section: section?.title ?? 'Unknown section',
        prompt: item.text,
        status: response.status,
        answer: response.answer,
        consequence: response.consequence ?? '',
        nextStep: response.followUpNote ?? ''
      };
    });

export const topThreeActions = (actions: ActionItem[]) =>
  [...actions].sort((a, b) => (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31')).slice(0, 3);
