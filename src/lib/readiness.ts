import { allChecklistItems } from './checklist';
import type { ReadinessSummary, ResponseRecord, ReviewLens } from '../types';

export const calculateReadiness = (responses: Record<string, ResponseRecord>, lens: ReviewLens): ReadinessSummary => {
  const relevant = allChecklistItems().filter((i) => i.gate.includes(lens));
  let blockers = 0;
  let warnings = 0;
  let opportunities = 0;

  relevant.forEach((item) => {
    const r = responses[item.id];
    const missing = !r?.status || !r?.answer.trim();
    if (missing || r.status === 'Unknown' || r.status === 'At Risk') blockers += 1;
    if (r?.status === 'Assumed') warnings += 1;
    if (r?.status === 'Opportunity') opportunities += 1;
  });

  const covered = Math.max(0, relevant.length - blockers);
  const percentCoverage = relevant.length ? Math.round((covered / relevant.length) * 100) : 0;
  const confidence = blockers > 10 ? 'low' : blockers > 3 ? 'medium' : 'high';

  return {
    total: relevant.length,
    blockers,
    warnings,
    opportunities,
    percentCoverage,
    confidence,
    summary: `${confidence.toUpperCase()} confidence with ${blockers} blockers and ${warnings} warnings.`
  };
};

export const riskRegister = (responses: Record<string, ResponseRecord>) =>
  allChecklistItems()
    .filter((item) => {
      const r = responses[item.id];
      return r?.status === 'At Risk' || r?.status === 'Unknown' ||
      (item.weight === 'high' && (r?.status === 'Assumed' || !r?.status));
    })
    .map((item) => ({ item, response: responses[item.id] }));

export const actionQueue = (responses: Record<string, ResponseRecord>) =>
  allChecklistItems().flatMap((item) => {
    const r = responses[item.id];
    if (!r?.owner || !r?.dueDate || ['Confirmed', 'Not Applicable'].includes(r.status)) return [];
    return [{ itemId: item.id, question: item.text, owner: r.owner, dueDate: r.dueDate, status: r.status }];
  });
