'use client';

interface KpiCardProps {
  title: string;
  value: string;
  variant: 'blue' | 'sky' | 'green' | 'indigo' | 'purple' | 'amber' | 'rose';
  tooltip?: string;
}

const VARIANT_BG: Record<string, string> = {
  blue:   "bg-blue-50 border-blue-200",
  sky:    "bg-sky-50 border-sky-200",
  green:  "bg-emerald-50 border-emerald-200",
  indigo: "bg-indigo-50 border-indigo-200",
  purple: "bg-purple-50 border-purple-200",
  amber:  "bg-amber-50 border-amber-200",
  rose:   "bg-rose-50 border-rose-200",
};

export default function KpiCard({ title, value, variant, tooltip }: KpiCardProps) {
  return (
    <div className={`${VARIANT_BG[variant]} border rounded-2xl p-6 shadow-sm`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm uppercase text-slate-600">{title}</p>

        {tooltip ? (
          <div className="group relative shrink-0">
            <button
              type="button"
              aria-label={`Información sobre ${title}`}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-white"
            >
              i
            </button>
            <div className="pointer-events-none absolute right-0 top-8 z-10 w-64 rounded-xl border border-slate-200 bg-white p-3 text-xs normal-case text-slate-600 opacity-0 shadow-lg transition duration-200 group-hover:opacity-100">
              {tooltip}
            </div>
          </div>
        ) : null}
      </div>

      <p className="text-3xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}
