import { checklistSections } from '../data/checklist';
import type { ChecklistItem, ResponseRecord } from '../types';

export const emptyResponse = (): ResponseRecord => ({ status: '', answer: '', owner: '', dueDate: '', risk: '' });

export const allChecklistItems = (): ChecklistItem[] => checklistSections.flatMap((s) => s.items);

export const initialResponses = (): Record<string, ResponseRecord> =>
  allChecklistItems().reduce<Record<string, ResponseRecord>>((acc, item) => {
    acc[item.id] = emptyResponse();
    return acc;
  }, {});

export const mergeResponses = (
  current: Record<string, ResponseRecord>,
  incoming: Partial<Record<string, ResponseRecord>>
): Record<string, ResponseRecord> => {
  const seed = { ...initialResponses(), ...current };
  for (const [id, value] of Object.entries(incoming)) {
    if (!seed[id] || !value) continue;
    seed[id] = { ...seed[id], ...value };
  }
  return seed;
};
