import { deriveOpportunities } from '../lib/opportunityRules';
import type { ProductAdoption, ResponseRecord } from '../types';

export function OpportunityRegister({ responses, adoption, platforms }: {
  responses: Record<string, ResponseRecord>;
  adoption: Record<string, ProductAdoption>;
  platforms: { hasDenticon: boolean; hasCloud9: boolean; hasApteryx: boolean };
}) {
  const rows = deriveOpportunities(responses, adoption, platforms);
  return (
    <div className="rounded border bg-white p-3">
      <h3 className="mb-2 font-semibold">Opportunity Register</h3>
      <div className="space-y-2 text-sm">{rows.map((r, i) => <div key={`${r.title}-${i}`} className="rounded border p-2"><p className="font-medium">{r.title}</p><p>{r.platform} • {r.category}</p><p>{r.whyItFits}</p></div>)}</div>
    </div>
  );
}
