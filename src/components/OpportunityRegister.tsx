import { opportunityRegister } from '../lib/opportunityRules';
import type { ProductAdoption, ResponseRecord } from '../types';

export function OpportunityRegister({ responses, adoption }: { responses: Record<string, ResponseRecord>; adoption: Record<string, ProductAdoption> }) {
  const rows = opportunityRegister(responses, adoption);
  return <div className="rounded border bg-white p-3 text-sm">{rows.map((r, i) => <div key={`${r.title}-${i}`} className="border-b py-1">{r.title} • {r.platform} • {r.whyItFits}</div>)}</div>;
}
