import { useMemo, useState } from 'react';
import { productCatalog } from '../data/productCatalog';
import type { ProductAdoption, ProductPlatform } from '../types';

export function ProductAdoptionTable({ adoption, hasDenticon, hasCloud9, hasApteryx, onChange }: {
  adoption: Record<string, ProductAdoption>;
  hasDenticon: boolean;
  hasCloud9: boolean;
  hasApteryx: boolean;
  onChange: (id: string, patch: Partial<ProductAdoption>) => void;
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
      <section className="rounded border bg-white p-3">
        <h3 className="font-semibold">Top Whitespace Opportunities</h3>
        <div className="mt-2 space-y-1 text-sm">{topWhitespace.map((p) => <div key={p.id}>• {p.platform}: {p.name}</div>)}</div>
      </section>

      {active.map((platform) => <section key={platform} className="rounded border bg-white p-3"><h3 className="mb-2 font-semibold">{platform} (Active Platform Products)</h3>{renderRows(platform)}</section>)}

      <section className="rounded border bg-white p-3">
        <button className="text-sm font-semibold" onClick={() => setShowDetailed((s) => !s)}>{showDetailed ? 'Hide' : 'Show'} Other Platform Whitespace</button>
        {showDetailed && inactive.map((platform) => <div key={platform} className="mt-3"><h4 className="mb-2 text-sm font-semibold">{platform}</h4>{renderRows(platform)}</div>)}
      </section>
    </div>
  );
}
