import { checklistSections } from '../data/checklist';
import type { AccountRecord, ReviewLens } from '../types';

export function Sidebar({ accounts, currentAccountId, onSelect, onCreate, onDuplicate, onDelete, lens, onLens }: {
  accounts: AccountRecord[];
  currentAccountId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  lens: ReviewLens;
  onLens: (lens: ReviewLens) => void;
}) {
  return <aside className="space-y-3 border-r bg-white p-3">
    <h1 className="font-bold">Strategic Account Audit</h1>
    <select className="w-full rounded border p-1" value={currentAccountId} onChange={(e) => onSelect(e.target.value)}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.accountName}</option>)}</select>
    <div className="grid grid-cols-3 gap-1 text-sm">
      <button className="rounded border p-1" onClick={onCreate}>New</button>
      <button className="rounded border p-1" onClick={onDuplicate}>Duplicate</button>
      <button className="rounded border p-1" onClick={onDelete}>Delete</button>
    </div>
    <select className="w-full rounded border p-1" value={lens} onChange={(e) => onLens(e.target.value as ReviewLens)}>
      <option value="relationship">relationship</option><option value="retention">retention</option><option value="growth">growth</option><option value="executive_review">executive_review</option>
    </select>
    <nav className="space-y-1 text-sm">{checklistSections.map((s) => <div key={s.id} className="text-slate-700">• {s.title}</div>)}</nav>
  </aside>;
}
