import { useEffect, useMemo, useState } from 'react';
import { checklistSections } from './data/checklist';
import { ActionQueue } from './components/ActionQueue';
import { FilterBar, type FilterState } from './components/FilterBar';
import { HeaderBar } from './components/HeaderBar';
import { MetricCard } from './components/MetricCard';
import { OpportunityRegister } from './components/OpportunityRegister';
import { ProductAdoptionTable } from './components/ProductAdoptionTable';
import { ReadinessPanel } from './components/ReadinessPanel';
import { RiskRegister } from './components/RiskRegister';
import { SectionItemCard } from './components/SectionItemCard';
import { Sidebar } from './components/Sidebar';
import { SnapshotPanel } from './components/SnapshotPanel';
import { exportAccountToExcel } from './lib/exportExcel';
import { exportAccountJson, exportAppJson, importAccountJson, importAppJson } from './lib/exportJson';
import { calculateReadiness } from './lib/readiness';
import { computeScores, createSnapshot } from './lib/scoring';
import { createStorageProvider } from './lib/storage';
import { createAccount, defaultState, duplicateAccount, normalizeAccount } from './lib/state';

const storage = createStorageProvider();

function download(filename: string, text: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = filename;
  a.click();
}

function App() {
  const [state, setState] = useState(() => storage.loadState() || defaultState());
  const [tab, setTab] = useState<'Summary' | 'Checklist' | 'Product Adoption' | 'Risk Register' | 'Opportunity Register' | 'Action Queue' | 'Snapshots'>('Summary');
  const [filter, setFilter] = useState<FilterState>({ search: '', status: '', category: '', unresolvedOnly: false, owner: '' });

  useEffect(() => { storage.saveState(state); }, [state]);

  const current = useMemo(() => state.accounts.find((a) => a.id === state.currentAccountId) ?? state.accounts[0], [state]);
  const readiness = useMemo(() => calculateReadiness(current.responses, current.reviewLens), [current]);
  const scores = useMemo(() => computeScores(current.responses, current.productAdoption, current.reviewLens), [current]);

  const updateCurrent = (updater: (account: typeof current) => typeof current) => {
    setState((s) => ({ ...s, accounts: s.accounts.map((a) => (a.id === current.id ? updater(a) : a)) }));
  };

  const importPrompt = (handler: (raw: string) => void) => {
    const raw = window.prompt('Paste JSON payload');
    if (!raw) return;
    handler(raw);
  };

  const filteredSections = checklistSections.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      const response = current.responses[item.id];
      const blob = `${item.text} ${response.answer}`.toLowerCase();
      if (filter.search && !blob.includes(filter.search.toLowerCase())) return false;
      if (filter.status && response.status !== filter.status) return false;
      if (filter.category && item.category !== filter.category) return false;
      if (filter.owner && !response.owner.toLowerCase().includes(filter.owner.toLowerCase())) return false;
      if (filter.unresolvedOnly && ['Confirmed', 'Not Applicable'].includes(response.status)) return false;
      return true;
    })
  }));

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
      <Sidebar
        accounts={state.accounts}
        currentAccountId={current.id}
        onSelect={(id) => setState((s) => ({ ...s, currentAccountId: id }))}
        onCreate={() => {
          const newAccount = createAccount();
          setState((s) => ({ ...s, accounts: [...s.accounts, newAccount], currentAccountId: newAccount.id }));
        }}
        onDuplicate={() => {
          const copy = duplicateAccount(current);
          setState((s) => ({ ...s, accounts: [...s.accounts, copy], currentAccountId: copy.id }));
        }}
        onDelete={() => {
          if (state.accounts.length === 1) return;
          const accounts = state.accounts.filter((a) => a.id !== current.id);
          setState((s) => ({ ...s, accounts, currentAccountId: accounts[0].id }));
        }}
        lens={current.reviewLens}
        onLens={(lens) => updateCurrent((a) => ({ ...a, reviewLens: lens, updatedAt: new Date().toISOString() }))}
      />
      <main className="space-y-3 p-3">
        <HeaderBar
          account={current}
          onUpdateMeta={(patch) => updateCurrent((a) => ({ ...a, ...patch, updatedAt: new Date().toISOString() }))}
          onExportAccount={() => download(`${current.accountName}.json`, exportAccountJson(current))}
          onExportAll={() => download('strategic-account-audit-state.json', exportAppJson(state))}
          onImportAccount={() => importPrompt((raw) => {
            const imported = normalizeAccount(importAccountJson(raw));
            setState((s) => ({ ...s, accounts: s.accounts.map((a) => (a.id === current.id ? imported : a)) }));
          })}
          onImportAll={() => importPrompt((raw) => setState(importAppJson(raw)))}
          onExportExcel={() => exportAccountToExcel(current)}
          onSnapshot={() => {
            const note = window.prompt('Optional snapshot note') ?? '';
            const snap = createSnapshot(current.responses, current.productAdoption, current.reviewLens, note);
            updateCurrent((a) => ({ ...a, snapshots: [...a.snapshots, snap], updatedAt: new Date().toISOString() }));
          }}
        />

        <div className="flex gap-2 text-sm">{(['Summary', 'Checklist', 'Product Adoption', 'Risk Register', 'Opportunity Register', 'Action Queue', 'Snapshots'] as const).map((t) => <button key={t} className={`rounded border px-2 py-1 ${tab === t ? 'bg-slate-900 text-white' : 'bg-white'}`} onClick={() => setTab(t)}>{t}</button>)}</div>

        {tab === 'Summary' && (
          <div className="space-y-3">
            <div className="grid gap-2 md:grid-cols-5">
              <MetricCard label="Overall Posture" value={scores.overallPosture} tone={scores.overallPosture === 'Red' ? 'bad' : scores.overallPosture === 'Yellow' ? 'warn' : 'good'} />
              <MetricCard label="Relationship Health" value={scores.relationshipHealth} />
              <MetricCard label="Retention Risk" value={scores.retentionRisk} tone={scores.retentionRisk > 50 ? 'bad' : 'warn'} />
              <MetricCard label="Growth Potential" value={scores.growthPotential} tone="good" />
              <MetricCard label="Operational Complexity" value={scores.operationalComplexity} tone="warn" />
            </div>
            <ReadinessPanel summary={readiness} />
            <RiskRegister responses={current.responses} />
            <OpportunityRegister responses={current.responses} adoption={current.productAdoption} />
            <ActionQueue responses={current.responses} />
          </div>
        )}

        {tab === 'Checklist' && (
          <div className="space-y-3">
            <FilterBar filter={filter} onChange={setFilter} />
            {filteredSections.map((section) => (
              <section key={section.id} className="space-y-2">
                <h2 className="font-semibold">{section.title}</h2>
                {section.items.map((item) => (
                  <SectionItemCard
                    key={item.id}
                    item={item}
                    response={current.responses[item.id]}
                    onChange={(patch) => updateCurrent((a) => ({ ...a, updatedAt: new Date().toISOString(), responses: { ...a.responses, [item.id]: { ...a.responses[item.id], ...patch } } }))}
                  />
                ))}
              </section>
            ))}
          </div>
        )}

        {tab === 'Product Adoption' && <ProductAdoptionTable adoption={current.productAdoption} onChange={(id, patch) => updateCurrent((a) => ({ ...a, productAdoption: { ...a.productAdoption, [id]: { ...a.productAdoption[id], ...patch } }, updatedAt: new Date().toISOString() }))} />}
        {tab === 'Risk Register' && <RiskRegister responses={current.responses} />}
        {tab === 'Opportunity Register' && <OpportunityRegister responses={current.responses} adoption={current.productAdoption} />}
        {tab === 'Action Queue' && <ActionQueue responses={current.responses} />}
        {tab === 'Snapshots' && <SnapshotPanel snapshots={current.snapshots} />}
      </main>
    </div>
  );
}

export default App;
