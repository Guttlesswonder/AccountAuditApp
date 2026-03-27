type Props = { label: string; value: string | number; tone?: 'neutral' | 'good' | 'warn' | 'bad' };

const toneClass = {
  neutral: 'bg-white border-slate-200',
  good: 'bg-emerald-50 border-emerald-200',
  warn: 'bg-amber-50 border-amber-200',
  bad: 'bg-rose-50 border-rose-200'
};

export function MetricCard({ label, value, tone = 'neutral' }: Props) {
  return (
    <div className={`rounded border p-3 ${toneClass[tone]}`}>
      <p className="text-xs uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
