import type { ReadinessSummary } from '../types';

export function ReadinessPanel({ summary }: { summary: ReadinessSummary }) {
  return (
    <div className="rounded border bg-white p-3 text-sm">
      <p className="font-semibold">Executive Confidence</p>
      <p>{summary.confidenceLabel} ({summary.percentCoverage}% coverage)</p>
      <p>Relevant prompts: {summary.total} • Blockers: {summary.blockers} • Opportunities: {summary.opportunities}</p>
    </div>
  );
}
