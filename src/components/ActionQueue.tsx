import type { ActionItem, ActionType } from '../types';

const emptyAction = (): ActionItem => ({ id: crypto.randomUUID(), title: '', relatedSection: '', type: 'follow_up', owner: '', dueDate: '', note: '' });

export function ActionQueue({ actions, onChange, onAdd, onDelete }: {
  actions: ActionItem[];
  onChange: (id: string, patch: Partial<ActionItem>) => void;
  onAdd: (seed?: Partial<ActionItem>) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-2 rounded border bg-white p-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Action Register</h3>
        <button className="rounded border px-2 py-1 text-sm" onClick={() => onAdd(emptyAction())}>Add Action</button>
      </div>
      <div className="space-y-2">
        {actions.map((a) => (
          <div key={a.id} className="grid gap-2 rounded border p-2 md:grid-cols-6">
            <input className="rounded border p-1" placeholder="Title" value={a.title} onChange={(e) => onChange(a.id, { title: e.target.value })} />
            <input className="rounded border p-1" placeholder="Section" value={a.relatedSection} onChange={(e) => onChange(a.id, { relatedSection: e.target.value })} />
            <select className="rounded border p-1" value={a.type} onChange={(e) => onChange(a.id, { type: e.target.value as ActionType })}><option value="risk">risk</option><option value="opportunity">opportunity</option><option value="follow_up">follow up</option></select>
            <input className="rounded border p-1" placeholder="Owner" value={a.owner} onChange={(e) => onChange(a.id, { owner: e.target.value })} />
            <input className="rounded border p-1" type="date" value={a.dueDate} onChange={(e) => onChange(a.id, { dueDate: e.target.value })} />
            <input className="rounded border p-1" placeholder="Note" value={a.note} onChange={(e) => onChange(a.id, { note: e.target.value })} />
            <button className="rounded border px-2 py-1 text-sm md:col-span-6" onClick={() => onDelete(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
