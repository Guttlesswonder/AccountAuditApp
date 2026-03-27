import type { Snapshot } from '../types';

export function SnapshotPanel({ snapshots }: { snapshots: Snapshot[] }) {
  return <div className="rounded border bg-white p-3 text-sm">{[...snapshots].reverse().map((s) => <div key={s.id} className="border-b py-1">{new Date(s.createdAt).toLocaleString()} • {s.overallPosture} • {s.note}</div>)}</div>;
}
