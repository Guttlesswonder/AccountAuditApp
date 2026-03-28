import { actionQueue } from '../lib/readiness';
import type { ResponseRecord } from '../types';

export function ActionQueue({ responses }: { responses: Record<string, ResponseRecord> }) {
  const rows = actionQueue(responses);
  return <div className="rounded border bg-white p-3 text-sm">{rows.map((r) => <div key={r.itemId} className="border-b py-1">{r.question} • {r.owner} • {r.dueDate}</div>)}</div>;
}
