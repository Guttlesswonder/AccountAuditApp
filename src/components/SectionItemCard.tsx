import { statusNeedsFollowUp } from '../lib/checklist';
import type { ChecklistItem, ResponseRecord, VisibleStatus } from '../types';

const visibleStatuses: VisibleStatus[] = ['', 'Confirmed', 'Unknown', 'At Risk', 'Opportunity', 'Not Applicable'];

export function SectionItemCard({ item, response, onChange, onCreateAction }: {
  item: ChecklistItem;
  response: ResponseRecord;
  onChange: (patch: Partial<ResponseRecord>) => void;
  onCreateAction: () => void;
}) {
  const showFollowUp = statusNeedsFollowUp(response.status);
  return (
    <article className="rounded border bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-slate-900">{item.text}</p>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{item.category}</span>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-[180px_1fr]">
        <select className="rounded border p-2" value={response.status} onChange={(e) => onChange({ status: e.target.value as VisibleStatus })}>
          {visibleStatuses.map((s) => <option key={s} value={s}>{s || 'Select status'}</option>)}
        </select>
        <textarea className="rounded border p-2" placeholder="Short answer" value={response.answer} onChange={(e) => onChange({ answer: e.target.value })} />
      </div>
      {showFollowUp && (
        <div className="mt-2 grid gap-2 rounded border border-slate-200 bg-slate-50 p-2 md:grid-cols-3">
          <input className="rounded border p-2" placeholder="Owner (optional)" value={response.owner ?? ''} onChange={(e) => onChange({ owner: e.target.value })} />
          <input className="rounded border p-2" type="date" value={response.dueDate ?? ''} onChange={(e) => onChange({ dueDate: e.target.value })} />
          <button className="rounded border bg-white px-2" onClick={onCreateAction}>Create Action</button>
          <textarea className="rounded border p-2 md:col-span-3" placeholder={response.status === 'At Risk' ? 'Consequence / impact (optional)' : 'Follow-up note (optional)'} value={response.status === 'At Risk' ? response.consequence ?? '' : response.followUpNote ?? ''} onChange={(e) => onChange(response.status === 'At Risk' ? { consequence: e.target.value } : { followUpNote: e.target.value })} />
        </div>
      )}
    </article>
  );
}
