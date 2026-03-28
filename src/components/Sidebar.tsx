import { checklistSections } from '../data/checklist';
import type { AccountRecord } from '../types';

export function Sidebar({ accounts, currentAccountId, onSelect, onCreate, onDuplicate, onDelete }: {
  accounts: AccountRecord[];
  currentAccountId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <aside className="space-y-3 border-r bg-white p-3">
      <h1 className="font-bold">Strategic Account Audit v1.1</h1>
      <select className="w-full rounded border p-2" value={currentAccountId} onChange={(e) => onSelect(e.target.value)}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.accountName}</option>)}</select>
      <div className="grid grid-cols-3 gap-1 text-sm">
        <button className="rounded border p-1" onClick={onCreate}>New</button>
        <button className="rounded border p-1" onClick={onDuplicate}>Duplicate</button>
        <button className="rounded border p-1" onClick={onDelete}>Delete</button>
      </div>
      <div className="text-sm text-slate-700">
        <p className="font-semibold">6 Core Sections</p>
        {checklistSections.map((s) => <p key={s.id}>• {s.title}</p>)}
      </div>
    </aside>
  );
}
