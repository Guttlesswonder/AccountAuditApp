import type { ReadinessSummary } from '../types';

export function ReadinessPanel({ summary }: { summary: ReadinessSummary }) {
  return (
    <div className="rounded border bg-white p-4">
      <h3 className="text-sm font-semibold">Lens Confidence Summary</h3>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
        <div>Total: {summary.total}</div>
        <div>Blockers: {summary.blockers}</div>
        <div>Warnings: {summary.warnings}</div>
        <div>Opportunities: {summary.opportunities}</div>
      </div>
      <p className="mt-2 text-sm">Coverage: {summary.percentCoverage}%</p>
      <p className="text-sm text-slate-600">{summary.summary}</p>
    </div>
  );
}
