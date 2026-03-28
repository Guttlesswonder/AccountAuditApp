import { describe, expect, it } from 'vitest';
import { initialResponses, mergeResponses } from './checklist';
import { LocalStorageProvider, STORAGE_KEY } from './storage/localStorageProvider';
import { createAccount, defaultState, duplicateAccount, normalizeAppState } from './state';
import { calculateReadiness, riskRegister } from './readiness';
import { deriveOpportunities } from './opportunityRules';
import { computeScores } from './scoring';
import { buildSectionRows } from './exportExcel';
import { importAppJson } from './exportJson';

describe('initial response generation', () => {
  it('creates responses for checklist', () => {
    const responses = initialResponses();
    expect(Object.keys(responses).length).toBeGreaterThan(40);
  });

  it('merges responses', () => {
    const merged = mergeResponses(initialResponses(), { 'commercial-1': { status: 'Confirmed', answer: 'yes', owner: '', dueDate: '', risk: '' } });
    expect(merged['commercial-1'].status).toBe('Confirmed');
  });
});

describe('storage load/save', () => {
  it('saves and loads', () => {
    const mock = new Map<string, string>();
    // @ts-expect-error test shim
    global.window = { localStorage: { getItem: (k: string) => mock.get(k) ?? null, setItem: (k: string, v: string) => mock.set(k, v) } };
    const provider = new LocalStorageProvider();
    const state = defaultState();
    provider.saveState(state);
    expect(mock.has(STORAGE_KEY)).toBe(true);
    expect(provider.loadState().accounts.length).toBe(1);
  });
});

describe('account create/duplicate/delete-ish', () => {
  it('creates and duplicates accounts', () => {
    const a = createAccount();
    const b = duplicateAccount(a);
    expect(a.id).not.toBe(b.id);
    const normalized = normalizeAppState({ accounts: [a, b], currentAccountId: b.id });
    expect(normalized.accounts).toHaveLength(2);
  });
});

describe('readiness/risk/opportunity/scoring', () => {
  it('derives summaries and scores', () => {
    const account = createAccount();
    account.responses['support-1'] = { status: 'At Risk', answer: 'major escalation', owner: 'AM', dueDate: '2026-03-01', risk: 'churn' };
    account.responses['process-10'] = { status: 'Unknown', answer: 'unknown patient communication', owner: '', dueDate: '', risk: '' };
    const readiness = calculateReadiness(account.responses, account.reviewLens);
    expect(readiness.blockers).toBeGreaterThan(0);
    expect(riskRegister(account.responses).length).toBeGreaterThan(0);
    expect(deriveOpportunities(account.responses, account.productAdoption).length).toBeGreaterThan(0);
    expect(computeScores(account.responses, account.productAdoption, account.reviewLens).overallPosture).toBeTruthy();
  });
});

describe('excel rows and json normalization', () => {
  it('builds section rows', () => {
    const account = createAccount();
    const rows = buildSectionRows(account, 'commercial_context');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('normalizes imported state', () => {
    const imported = importAppJson(JSON.stringify({ accounts: [{ accountName: 'A' }], currentAccountId: 'x' }));
    expect(imported.accounts[0].responses).toBeDefined();
    expect(imported.currentAccountId).toBe(imported.accounts[0].id);
  });
});
