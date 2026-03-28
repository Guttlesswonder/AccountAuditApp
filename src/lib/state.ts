import { productCatalog } from '../data/productCatalog';
import type { AccountRecord, AppState, ProductAdoption } from '../types';
import { initialResponses, mergeResponses } from './checklist';

const emptyAdoption = (): Record<string, ProductAdoption> =>
  productCatalog.reduce((acc, product) => {
    acc[product.id] = { productId: product.id, status: 'unknown', notes: '', opportunityValue: '' };
    return acc;
  }, {} as Record<string, ProductAdoption>);

export const createAccount = (): AccountRecord => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    accountName: 'New Strategic Account',
    crmRef: '',
    accountManager: '',
    segment: '',
    reviewLens: 'executive_review',
    hasDenticon: true,
    hasCloud9: false,
    hasApteryx: false,
    termsSummary: '',
    createdAt: now,
    updatedAt: now,
    responses: initialResponses(),
    productAdoption: emptyAdoption(),
    actions: [],
    snapshots: []
  };
};

export const duplicateAccount = (record: AccountRecord): AccountRecord => ({
  ...record,
  id: crypto.randomUUID(),
  accountName: `${record.accountName} (Copy)`,
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
    productAdoption: { ...base.productAdoption, ...input.productAdoption },
    actions: input.actions ?? []
  };
};

export const normalizeAppState = (input?: Partial<AppState>): AppState => {
  const accounts = (input?.accounts ?? []).map(normalizeAccount);
  if (accounts.length === 0) {
    const account = createAccount();
    return { accounts: [account], currentAccountId: account.id };
  }
  const currentAccountId = input?.currentAccountId && accounts.some((a) => a.id === input.currentAccountId) ? input.currentAccountId : accounts[0].id;
  return { accounts, currentAccountId };
};

export const defaultState = (): AppState => normalizeAppState();
