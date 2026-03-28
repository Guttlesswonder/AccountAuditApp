import type { ChecklistItem, ResponseRecord, Status } from '../types';

const statuses: Status[] = ['', 'Confirmed', 'Assumed', 'Unknown', 'Not Applicable', 'At Risk', 'Opportunity'];

type Props = {
  item: ChecklistItem;
  response: ResponseRecord;
  onChange: (patch: Partial<ResponseRecord>) => void;
};

export function SectionItemCard({ item, response, onChange }: Props) {
  return (
    <article className="rounded border bg-white p-3">
      <p className="font-medium">{item.text}</p>
      <p className="mb-2 text-xs text-slate-500">{item.category} • {item.kind}</p>
      <div className="grid gap-2 md:grid-cols-2">
        <select className="rounded border p-2" value={response.status} onChange={(e) => onChange({ status: e.target.value as Status })}>
          {statuses.map((s) => <option key={s} value={s}>{s || 'Select status'}</option>)}
        </select>
        <input className="rounded border p-2" placeholder="Owner" value={response.owner} onChange={(e) => onChange({ owner: e.target.value })} />
        <input className="rounded border p-2" type="date" value={response.dueDate} onChange={(e) => onChange({ dueDate: e.target.value })} />
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Answer" value={response.answer} onChange={(e) => onChange({ answer: e.target.value })} />
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Risk / consequence" value={response.risk} onChange={(e) => onChange({ risk: e.target.value })} />
      </div>
    </article>
  );
}
