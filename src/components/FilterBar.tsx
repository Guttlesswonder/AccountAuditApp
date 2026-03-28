export type FilterState = { search: string; status: string; category: string; unresolvedOnly: boolean; owner: string };

export function FilterBar({ filter, onChange }: { filter: FilterState; onChange: (next: FilterState) => void }) {
  return (
    <div className="grid gap-2 rounded border bg-white p-3 md:grid-cols-5">
      <input className="rounded border p-1" placeholder="search" value={filter.search} onChange={(e) => onChange({ ...filter, search: e.target.value })} />
      <input className="rounded border p-1" placeholder="status" value={filter.status} onChange={(e) => onChange({ ...filter, status: e.target.value })} />
      <input className="rounded border p-1" placeholder="category" value={filter.category} onChange={(e) => onChange({ ...filter, category: e.target.value })} />
      <input className="rounded border p-1" placeholder="owner" value={filter.owner} onChange={(e) => onChange({ ...filter, owner: e.target.value })} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filter.unresolvedOnly} onChange={(e) => onChange({ ...filter, unresolvedOnly: e.target.checked })} />Unresolved only</label>
    </div>
  );
}
