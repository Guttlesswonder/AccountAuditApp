import { riskRegister } from '../lib/readiness';
import type { ResponseRecord } from '../types';

export function RiskRegister({ responses }: { responses: Record<string, ResponseRecord> }) {
  const rows = riskRegister(responses);
  return <div className="rounded border bg-white p-3 text-sm">{rows.map((r) => <div key={r.item.id} className="border-b py-1">{r.item.text} • {r.response.status}</div>)}</div>;
}
