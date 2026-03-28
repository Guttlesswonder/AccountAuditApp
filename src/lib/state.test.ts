import { describe, expect, it } from 'vitest';
import { initialResponses, mergeResponses, statusNeedsFollowUp } from './checklist';
import { LocalStorageProvider, STORAGE_KEY } from './storage/localStorageProvider';
import { createAccount, duplicateAccount, normalizeAppState } from './state';
import { calculateReadiness, deriveRiskRegister } from './readiness';
import { deriveOpportunities } from './opportunityRules';
import { computeScores, labelMetric } from './scoring';
import { importAppJson } from './exportJson';

describe('checklist response model', () => {
  it('builds initial responses and merges partial response', () => {
    const responses = initialResponses();
    expect(Object.keys(responses).length).toBe(24);
    const merged = mergeResponses(responses, { 'commercial-1': { status: 'Confirmed', answer: 'renews q3' } });
    expect(merged['commercial-1'].status).toBe('Confirmed');
  });

  it('shows follow up only for flagged states', () => {
    expect(statusNeedsFollowUp('Confirmed')).toBe(false);
    expect(statusNeedsFollowUp('At Risk')).toBe(true);
  });
});

describe('storage + account lifecycle', () => {
  it('loads and saves state using provider', () => {
    const map = new Map<string, string>();
    // @ts-expect-error local shim
    global.window = { localStorage: { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => map.set(k, v) } };
    const provider = new LocalStorageProvider();
    const state = normalizeAppState();
    provider.saveState(state);
    expect(map.has(STORAGE_KEY)).toBe(true);
    expect(provider.loadState().accounts.length).toBe(1);
  });

  it('creates and duplicates account', () => {
    const a = createAccount();
    const b = duplicateAccount(a);
    expect(a.id).not.toBe(b.id);
  });
});

describe('derived logic', () => {
  it('builds readiness, risk, opportunity, and score outputs', () => {
    const account = createAccount();
    account.responses['health-2'] = { status: 'At Risk', answer: 'retention pressure', consequence: 'churn risk' };
    account.responses['ops-3'] = { status: 'Unknown', answer: 'patient communication unclear', followUpNote: 'confirm workflow' };

    const readiness = calculateReadiness(account.responses, account.reviewLens);
    const risks = deriveRiskRegister(account.responses);
    const opportunities = deriveOpportunities(account.responses, account.productAdoption, { hasDenticon: true, hasCloud9: false, hasApteryx: false });
    const scores = computeScores(account.responses, account.productAdoption, account.reviewLens, { hasDenticon: true, hasCloud9: false, hasApteryx: false });

    expect(readiness.total).toBeGreaterThan(0);
    expect(risks.length).toBeGreaterThan(0);
    expect(opportunities.length).toBeGreaterThan(0);
    expect(labelMetric('relationship', scores.relationshipHealth)).toBeTruthy();
  });

  it('normalizes imported app json', () => {
    const imported = importAppJson(JSON.stringify({ accounts: [{ accountName: 'A' }] }));
    expect(imported.accounts[0].responses['commercial-1']).toBeDefined();
  });
});
