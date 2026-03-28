import { productCatalog } from '../data/productCatalog';
import type { ProductAdoption } from '../types';

export function ProductAdoptionTable({ adoption, onChange }: { adoption: Record<string, ProductAdoption>; onChange: (id: string, patch: Partial<ProductAdoption>) => void }) {
  return (
    <div className="space-y-3">
      {['Denticon', 'Cloud9', 'Apteryx'].map((platform) => (
        <section key={platform} className="rounded border bg-white p-3">
          <h3 className="font-semibold">{platform}</h3>
          <div className="mt-2 space-y-2">
            {productCatalog.filter((p) => p.platform === platform).map((p) => {
              const row = adoption[p.id];
              return (
                <div key={p.id} className="grid gap-2 md:grid-cols-5">
                  <div className="md:col-span-2">{p.name}</div>
                  <select className="rounded border p-1" value={row.status} onChange={(e) => onChange(p.id, { status: e.target.value as ProductAdoption['status'] })}>
                    <option value="unknown">unknown</option><option value="adopted">adopted</option><option value="partial">partial</option><option value="not_adopted">not_adopted</option>
                  </select>
                  <input className="rounded border p-1" placeholder="owner" value={row.owner} onChange={(e) => onChange(p.id, { owner: e.target.value })} />
                  <input className="rounded border p-1" placeholder="notes" value={row.notes} onChange={(e) => onChange(p.id, { notes: e.target.value })} />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
