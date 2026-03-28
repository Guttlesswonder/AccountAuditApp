import { checklistSections } from '../data/checklist';
import type { ChecklistItem, ResponseRecord } from '../types';

export const emptyResponse = (): ResponseRecord => ({ status: '', answer: '' });

export const allChecklistItems = (): ChecklistItem[] => checklistSections.flatMap((s) => s.items);

export const initialResponses = (): Record<string, ResponseRecord> =>
  allChecklistItems().reduce((acc, item) => {
    acc[item.id] = emptyResponse();
    return acc;
  }, {} as Record<string, ResponseRecord>);

export const mergeResponses = (
  current: Record<string, ResponseRecord>,
  incoming: Partial<Record<string, ResponseRecord>>
): Record<string, ResponseRecord> => {
  const seed = { ...initialResponses(), ...current };
  Object.entries(incoming).forEach(([id, v]) => {
    if (!seed[id] || !v) return;
    seed[id] = { ...seed[id], ...v };
  });
  return seed;
};

export const statusNeedsFollowUp = (status: ResponseRecord['status']) => ['Unknown', 'At Risk', 'Opportunity'].includes(status);
