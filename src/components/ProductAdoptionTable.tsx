import { useMemo, useState } from 'react';
import { productCatalog } from '../data/productCatalog';
import type { ProductAdoption, ProductPlatform } from '../types';

export function ProductAdoptionTable({ adoption, hasDenticon, hasCloud9, hasApteryx, onChange, onPlatformChange }: {
  adoption: Record<string, ProductAdoption>;
  hasDenticon: boolean;
  hasCloud9: boolean;
  hasApteryx: boolean;
  onChange: (id: string, patch: Partial<ProductAdoption>) => void;
  onPlatformChange?: (patch: { hasDenticon?: boolean; hasCloud9?: boolean; hasApteryx?: boolean }) => void;
}) {
  const [showDetailed, setShowDetailed] = useState(false);
  const active: ProductPlatform[] = [hasDenticon && 'Denticon', hasCloud9 && 'Cloud 9', hasApteryx && 'Apteryx'].filter(Boolean) as ProductPlatform[];
  const inactive: ProductPlatform[] = (['Denticon', 'Cloud 9', 'Apteryx'] as ProductPlatform[]).filter((p) => !active.includes(p));

  const topWhitespace = useMemo(
    () => productCatalog
      .filter((p) => adoption[p.id]?.status === 'not_adopted' || adoption[p.id]?.status === 'partial')
      .slice(0, 5),
    [adoption]
  );

  const purchasedTodayCount = useMemo(
    () => Object.values(adoption).filter((row) => row.status === 'adopted').length,
    [adoption]
  );
  const expansionBlockers = useMemo(
    () => Object.values(adoption).filter((row) => row.status === 'not_adopted' && row.notes.trim()).slice(0, 5),
    [adoption]
  );

  const renderRows = (platform: ProductPlatform) => (
    <div className="space-y-2">
      {productCatalog.filter((p) => p.platform === platform).map((p) => (
        <div key={p.id} className="grid items-center gap-2 rounded border p-2 md:grid-cols-[220px_160px_1fr_130px]">
          <div className="text-sm font-medium">{p.name}</div>
          <select className="rounded border p-1" value={adoption[p.id].status} onChange={(e) => onChange(p.id, { status: e.target.value as ProductAdoption['status'] })}>
            <option value="unknown">unknown</option><option value="adopted">adopted</option><option value="partial">partial</option><option value="not_adopted">not adopted</option>
          </select>
          <input className="rounded border p-1" placeholder="Notes" value={adoption[p.id].notes} onChange={(e) => onChange(p.id, { notes: e.target.value })} />
          <select className="rounded border p-1" value={adoption[p.id].opportunityValue ?? ''} onChange={(e) => onChange(p.id, { opportunityValue: e.target.value as ProductAdoption['opportunityValue'] })}>
            <option value="">value</option><option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
          </select>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-3">
      <section className="rounded border bg-white p-3 text-sm">
        <h3 className="font-semibold">Platform Priority</h3>
        <div className="mt-2 flex flex-wrap gap-3">
          <label><input type="checkbox" checked={hasDenticon} onChange={(e) => onPlatformChange?.({ hasDenticon: e.target.checked })} /> Denticon</label>
          <label><input type="checkbox" checked={hasCloud9} onChange={(e) => onPlatformChange?.({ hasCloud9: e.target.checked })} /> Cloud 9</label>
          <label><input type="checkbox" checked={hasApteryx} onChange={(e) => onPlatformChange?.({ hasApteryx: e.target.checked })} /> Apteryx</label>
        </div>
      </section>

      <section className="rounded border bg-white p-3">
        <h3 className="font-semibold">Top Whitespace Opportunities</h3>
        <div className="mt-2 space-y-1 text-sm">{topWhitespace.map((p) => <div key={p.id}>• {p.platform}: {p.name}</div>)}</div>
        <p className="mt-2 text-sm text-slate-600">Purchased Today: {purchasedTodayCount}</p>
        {expansionBlockers.length > 0 && (
          <div className="mt-2 text-sm">
            <p className="font-medium">Expansion Blockers / Notes</p>
            {expansionBlockers.map((row, idx) => <p key={idx}>• {row.notes}</p>)}
          </div>
        )}
      </section>

      {active.map((platform) => <section key={platform} className="rounded border bg-white p-3"><h3 className="mb-2 font-semibold">{platform} (Active Platform Products)</h3>{renderRows(platform)}</section>)}

      <section className="rounded border bg-white p-3">
        <button className="text-sm font-semibold" onClick={() => setShowDetailed((s) => !s)}>{showDetailed ? 'Hide' : 'Show'} Other Platform Whitespace</button>
        {showDetailed && inactive.map((platform) => <div key={platform} className="mt-3"><h4 className="mb-2 text-sm font-semibold">{platform}</h4>{renderRows(platform)}</div>)}
      </section>
    </div>
  );
}
