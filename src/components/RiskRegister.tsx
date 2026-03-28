import { deriveRiskRegister } from '../lib/readiness';
import type { ActionItem, ResponseRecord } from '../types';

export function RiskRegister({ responses, actions = [] }: { responses: Record<string, ResponseRecord>; actions?: ActionItem[] }) {
  const rows = deriveRiskRegister(responses);
  const linkedAction = (itemId: string) => actions.find((a) => a.linkedItemId === itemId);
  return (
    <div className="rounded border bg-white p-3">
      <h3 className="mb-2 font-semibold">Risk Register</h3>
      <div className="space-y-2 text-sm">{rows.map((r) => {
        const action = linkedAction(r.itemId);
        return <div key={r.itemId} className="rounded border p-2"><p className="font-medium">{r.prompt}</p><p className="text-slate-600">{r.section} • {r.status}</p><p>{r.answer}</p>{r.consequence && <p>Consequence: {r.consequence}</p>}{action && <p>Linked Action: {action.title || '(Untitled)'}</p>}</div>;
      })}</div>
    </div>
  );
}
