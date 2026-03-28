import { useEffect, useMemo, useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { Sidebar } from './components/Sidebar';
import { checklistSections } from './data/checklist';
import { MetricCard } from './components/MetricCard';
import { ReadinessPanel } from './components/ReadinessPanel';
import { RiskRegister } from './components/RiskRegister';
import { OpportunityRegister } from './components/OpportunityRegister';
import { ActionQueue } from './components/ActionQueue';
import { ProductAdoptionTable } from './components/ProductAdoptionTable';
import { SectionItemCard } from './components/SectionItemCard';
import { SnapshotPanel } from './components/SnapshotPanel';
import { exportAccountToExcel } from './lib/exportExcel';
import { exportAccountJson, exportAppJson, importAccountJson, importAppJson } from './lib/exportJson';
import { createStorageProvider } from './lib/storage';
import { createAccount, defaultState, duplicateAccount, normalizeAccount } from './lib/state';
import { calculateReadiness, deriveRiskRegister, topThreeActions } from './lib/readiness';
import { computeScores, createSnapshot, labelMetric } from './lib/scoring';
import { topWhitespace } from './lib/opportunityRules';
import { termsStore } from './lib/attachments/indexedDbTermsStore';

const storage = createStorageProvider();

type Tab = 'Executive Summary' | 'Structured Audit' | 'Product Adoption' | 'Risk Register' | 'Opportunity Register' | 'Action Register' | 'Snapshots';

function download(name: string, payload: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = name;
  link.click();
}

function App() {
  const [state, setState] = useState(() => storage.loadState() || defaultState());
  const [tab, setTab] = useState<Tab>('Executive Summary');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => storage.saveState(state), [state]);

  const current = useMemo(() => state.accounts.find((a) => a.id === state.currentAccountId) ?? state.accounts[0], [state]);
  const platforms = useMemo(() => ({ hasDenticon: current.hasDenticon, hasCloud9: current.hasCloud9, hasApteryx: current.hasApteryx }), [current]);
  const readiness = useMemo(() => calculateReadiness(current.responses, current.reviewLens), [current]);
  const scores = useMemo(() => computeScores(current.responses, current.productAdoption, current.reviewLens, platforms), [current, platforms]);
  const topRisks = useMemo(() => deriveRiskRegister(current.responses).slice(0, 5), [current]);
  const whitespace = useMemo(() => topWhitespace(current.responses, current.productAdoption, platforms), [current, platforms]);
  const nextActions = useMemo(() => topThreeActions(current.actions), [current]);

  const updateCurrent = (updater: (prev: typeof current) => typeof current) =>
    setState((s) => ({ ...s, accounts: s.accounts.map((a) => (a.id === current.id ? updater(a) : a)) }));

  const addAction = (seed?: Partial<typeof current.actions[number]>) => {
    const action = {
      id: crypto.randomUUID(),
      title: seed?.title ?? '',
      relatedSection: seed?.relatedSection ?? '',
      type: seed?.type ?? 'follow_up',
      owner: seed?.owner ?? '',
      dueDate: seed?.dueDate ?? '',
      note: seed?.note ?? '',
      linkedItemId: seed?.linkedItemId
    };
    updateCurrent((a) => ({ ...a, actions: [...a.actions, action], updatedAt: new Date().toISOString() }));
  };

  const handleTermsUpload = async (file: File) => {
    const meta = { id: crypto.randomUUID(), fileName: file.name, fileSize: file.size, uploadedAt: new Date().toISOString() };
    await termsStore.save({ ...meta, accountId: current.id, blob: file });
    updateCurrent((a) => ({ ...a, termsAttachment: meta, updatedAt: new Date().toISOString() }));
  };

  const openTermsPdf = async () => {
    const file = await termsStore.get(current.id);
    if (!file) return;
    const url = URL.createObjectURL(file.blob);
    window.open(url, '_blank');
  };

  const removeTermsPdf = async () => {
    await termsStore.remove(current.id);
    updateCurrent((a) => ({ ...a, termsAttachment: undefined, updatedAt: new Date().toISOString() }));
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
      <Sidebar
        accounts={state.accounts}
        currentAccountId={current.id}
        onSelect={(id) => setState((s) => ({ ...s, currentAccountId: id }))}
        onCreate={() => {
          const account = createAccount();
          setState((s) => ({ ...s, accounts: [...s.accounts, account], currentAccountId: account.id }));
        }}
        onDuplicate={() => {
          const account = duplicateAccount(current);
          setState((s) => ({ ...s, accounts: [...s.accounts, account], currentAccountId: account.id }));
        }}
        onDelete={() => {
          if (state.accounts.length === 1) return;
          const accounts = state.accounts.filter((a) => a.id !== current.id);
          setState((s) => ({ ...s, accounts, currentAccountId: accounts[0].id }));
        }}
      />

      <main className="space-y-3 p-3">
        <HeaderBar
          account={current}
          onUpdate={(patch) => updateCurrent((a) => ({ ...a, ...patch, updatedAt: new Date().toISOString() }))}
          onExportAccount={() => download(`${current.accountName}.json`, exportAccountJson(current))}
          onExportAll={() => download('strategic-account-audit-state.json', exportAppJson(state))}
          onImportAccount={() => {
            const raw = window.prompt('Paste account JSON');
            if (!raw) return;
            const imported = normalizeAccount(importAccountJson(raw));
            updateCurrent(() => imported);
          }}
          onImportAll={() => {
            const raw = window.prompt('Paste app JSON');
            if (!raw) return;
            setState(importAppJson(raw));
          }}
          onExportExcel={() => exportAccountToExcel(current)}
          onSnapshot={() => {
            const note = window.prompt('Optional note') ?? '';
            const snapshot = createSnapshot(current.responses, current.productAdoption, current.reviewLens, platforms, note);
            updateCurrent((a) => ({ ...a, snapshots: [...a.snapshots, snapshot], updatedAt: new Date().toISOString() }));
          }}
        />

        <div className="flex flex-wrap gap-2 text-sm">
          {(['Executive Summary', 'Structured Audit', 'Product Adoption', 'Risk Register', 'Opportunity Register', 'Action Register', 'Snapshots'] as const).map((t) => (
            <button key={t} className={`rounded border px-2 py-1 ${tab === t ? 'bg-slate-900 text-white' : 'bg-white'}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === 'Executive Summary' && (
          <div className="space-y-3">
            <div className="grid gap-2 md:grid-cols-5">
              <MetricCard label="Overall Posture" value={scores.overallPosture} tone={scores.overallPosture === 'Red' ? 'bad' : scores.overallPosture === 'Yellow' ? 'warn' : 'good'} />
              <MetricCard label="Relationship Health" value={labelMetric('relationship', scores.relationshipHealth)} />
              <MetricCard label="Retention Risk" value={labelMetric('risk', scores.retentionRisk)} tone={scores.retentionRisk > 45 ? 'bad' : 'warn'} />
              <MetricCard label="Growth Potential" value={labelMetric('growth', scores.growthPotential)} tone="good" />
              <MetricCard label="Operational Complexity" value={labelMetric('complexity', scores.operationalComplexity)} tone="warn" />
            </div>
            <ReadinessPanel summary={readiness} />
            <div className="grid gap-3 md:grid-cols-2">
              <section className="rounded border bg-white p-3 text-sm"><h3 className="font-semibold">Terms at a Glance</h3><p className="mt-1 whitespace-pre-wrap">{current.termsSummary || 'No terms summary yet.'}</p></section>
              <section className="rounded border bg-white p-3 text-sm"><h3 className="font-semibold">Current Footprint</h3><p>Denticon: {current.hasDenticon ? 'Yes' : 'No'} • Cloud 9: {current.hasCloud9 ? 'Yes' : 'No'} • Apteryx: {current.hasApteryx ? 'Yes' : 'No'}</p></section>
            </div>
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <section className="rounded border bg-white p-3"><h3 className="font-semibold">Top Risks</h3>{topRisks.slice(0, 3).map((r) => <p key={r.itemId}>• {r.prompt}</p>)}</section>
              <section className="rounded border bg-white p-3"><h3 className="font-semibold">Top Opportunities</h3>{whitespace.slice(0, 3).map((o, i) => <p key={`${o.title}-${i}`}>• {o.title}</p>)}</section>
              <section className="rounded border bg-white p-3"><h3 className="font-semibold">Next 3 Actions</h3>{nextActions.map((a) => <p key={a.id}>• {a.title || '(Untitled action)'}</p>)}</section>
            </div>
          </div>
        )}

        {tab === 'Structured Audit' && (
          <div className="space-y-3">
            {checklistSections.map((section) => {
              const isOpen = expandedSections.includes(section.id);
              const answered = section.items.filter((item) => current.responses[item.id]?.status && current.responses[item.id]?.answer.trim()).length;
              return (
                <section key={section.id} className="rounded border bg-slate-50 p-2">
                  <button className="flex w-full items-center justify-between rounded bg-white p-2 text-left" onClick={() => setExpandedSections((v) => v.includes(section.id) ? v.filter((id) => id !== section.id) : [...v, section.id])}>
                    <span><span className="font-semibold">{section.title}</span><span className="ml-2 text-xs text-slate-500">{answered}/{section.items.length} complete</span></span>
                    <span>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="mt-2 space-y-2">
                      {section.id === 'commercial_terms' && (
                        <div className="rounded border bg-white p-3">
                          <h4 className="font-semibold">Terms Summary & Platform Flags</h4>
                          <textarea className="mt-2 w-full rounded border p-2" placeholder="Terms summary" value={current.termsSummary} onChange={(e) => updateCurrent((a) => ({ ...a, termsSummary: e.target.value, updatedAt: new Date().toISOString() }))} />
                          <div className="mt-2 flex flex-wrap gap-3 text-sm">
                            <label><input type="checkbox" checked={current.hasDenticon} onChange={(e) => updateCurrent((a) => ({ ...a, hasDenticon: e.target.checked }))} /> Denticon</label>
                            <label><input type="checkbox" checked={current.hasCloud9} onChange={(e) => updateCurrent((a) => ({ ...a, hasCloud9: e.target.checked }))} /> Cloud 9</label>
                            <label><input type="checkbox" checked={current.hasApteryx} onChange={(e) => updateCurrent((a) => ({ ...a, hasApteryx: e.target.checked }))} /> Apteryx</label>
                          </div>
                          <div className="mt-2 text-sm">
                            <input type="file" accept="application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleTermsUpload(file); }} />
                            <p className="text-xs text-slate-500">Stored locally in this browser only in v1.1.</p>
                            {current.termsAttachment && <p className="mt-1 text-xs">{current.termsAttachment.fileName} • {Math.round(current.termsAttachment.fileSize / 1024)}KB • {new Date(current.termsAttachment.uploadedAt).toLocaleString()}</p>}
                            <div className="mt-1 flex gap-2">{current.termsAttachment && <button className="rounded border px-2 py-1" onClick={() => void openTermsPdf()}>Open PDF</button>}{current.termsAttachment && <button className="rounded border px-2 py-1" onClick={() => void removeTermsPdf()}>Remove PDF</button>}</div>
                          </div>
                        </div>
                      )}
                      {section.items.map((item) => (
                        <SectionItemCard
                          key={item.id}
                          item={item}
                          response={current.responses[item.id]}
                          onChange={(patch) => updateCurrent((a) => ({ ...a, responses: { ...a.responses, [item.id]: { ...a.responses[item.id], ...patch } }, updatedAt: new Date().toISOString() }))}
                          onCreateAction={() => addAction({ title: `Follow up: ${item.text}`, relatedSection: section.title, type: current.responses[item.id].status === 'Opportunity' ? 'opportunity' : current.responses[item.id].status === 'At Risk' ? 'risk' : 'follow_up', note: current.responses[item.id].followUpNote || current.responses[item.id].consequence || '', linkedItemId: item.id })}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {tab === 'Product Adoption' && <ProductAdoptionTable adoption={current.productAdoption} hasDenticon={current.hasDenticon} hasCloud9={current.hasCloud9} hasApteryx={current.hasApteryx} onPlatformChange={(patch) => updateCurrent((a) => ({ ...a, ...patch, updatedAt: new Date().toISOString() }))} onChange={(id, patch) => updateCurrent((a) => ({ ...a, productAdoption: { ...a.productAdoption, [id]: { ...a.productAdoption[id], ...patch } }, updatedAt: new Date().toISOString() }))} />}
        {tab === 'Risk Register' && <RiskRegister responses={current.responses} actions={current.actions} />}
        {tab === 'Opportunity Register' && <OpportunityRegister responses={current.responses} adoption={current.productAdoption} platforms={platforms} />}
        {tab === 'Action Register' && <ActionQueue actions={current.actions} onAdd={(seed) => addAction(seed)} onChange={(id, patch) => updateCurrent((a) => ({ ...a, actions: a.actions.map((act) => act.id === id ? { ...act, ...patch } : act) }))} onDelete={(id) => updateCurrent((a) => ({ ...a, actions: a.actions.filter((act) => act.id !== id) }))} />}
        {tab === 'Snapshots' && <SnapshotPanel snapshots={current.snapshots} />}
      </main>
    </div>
  );
}

export default App;
