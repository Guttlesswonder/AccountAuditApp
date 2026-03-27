import { productCatalog } from '../data/productCatalog';
import type { AccountRecord, AppState, ProductAdoption } from '../types';
import { initialResponses, mergeResponses } from './checklist';

const emptyAdoptionRecord = (): Record<string, ProductAdoption> =>
  productCatalog.reduce((acc, p) => {
    acc[p.id] = { productId: p.id, status: 'unknown', notes: '', owner: '', opportunityValue: '' };
    return acc;
  }, {} as Record<string, ProductAdoption>);

export const createAccount = (): AccountRecord => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    accountName: 'New Account Audit',
    crmRef: '',
    accountManager: '',
    segment: '',
    reviewLens: 'relationship',
    createdAt: now,
    updatedAt: now,
    responses: initialResponses(),
    productAdoption: emptyAdoptionRecord(),
    snapshots: []
  };
};

export const duplicateAccount = (account: AccountRecord): AccountRecord => ({
  ...account,
  id: crypto.randomUUID(),
  accountName: `${account.accountName} (Copy)`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  snapshots: []
});

export const normalizeAccount = (input: Partial<AccountRecord>): AccountRecord => {
  const base = createAccount();
  return {
    ...base,
    ...input,
    responses: mergeResponses(base.responses, input.responses ?? {}),
    productAdoption: { ...base.productAdoption, ...input.productAdoption }
  };
};

export const normalizeAppState = (input?: Partial<AppState>): AppState => {
  const accounts = (input?.accounts ?? []).map(normalizeAccount);
  if (accounts.length === 0) {
    const created = createAccount();
    return { accounts: [created], currentAccountId: created.id };
  }
  return { accounts, currentAccountId: input?.currentAccountId && accounts.some((a) => a.id === input.currentAccountId) ? input.currentAccountId : accounts[0].id };
};

export const defaultState = (): AppState => normalizeAppState();
