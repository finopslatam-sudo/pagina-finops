import React from 'react';

function coverageColor(pct: number) {
  if (pct >= 70) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Cobertura óptima', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (pct >= 40) return { bar: 'bg-amber-400',   text: 'text-amber-600',   label: 'Cobertura parcial', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
  return             { bar: 'bg-red-400',         text: 'text-red-600',     label: 'Cobertura baja', badge: 'bg-red-50 text-red-700 border-red-200' };
}

export function KpiCard({
  title, value, sub, variant, valueClass,
}: {
  title: string; value: string; sub: string; variant: string; valueClass?: string;
}) {
  const bg: Record<string, string> = {
    indigo: 'bg-indigo-50 border-indigo-200',
    purple: 'bg-purple-50 border-purple-200',
    green:  'bg-emerald-50 border-emerald-200',
    slate:  'bg-slate-50 border-slate-200',
  };
  return (
    <div className={`${bg[variant] ?? bg.slate} border rounded-2xl p-6 shadow-sm`}>
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{title}</p>
      <p className={`text-2xl font-bold text-slate-800 ${valueClass ?? ''}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

export function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export function CoverageBar({ percentage }: { percentage: number }) {
  const c = coverageColor(percentage);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-4xl font-bold ${c.text}`}>{percentage}%</span>
        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${c.badge}`}>
          {c.label}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-4">
        <div
          className={`${c.bar} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400">
        <span>0%</span>
        <span className="text-amber-500">40% — Mínimo recomendado</span>
        <span className="text-emerald-500">70% — Óptimo</span>
        <span>100%</span>
      </div>
    </div>
  );
}

export function CoverageRow({ label, value }: { label: string; value: number }) {
  const c = coverageColor(value);
  return (
    <div className="flex items-center gap-4 bg-slate-50 border rounded-2xl p-4">
      <div className="flex-1">
        <p className="font-medium text-slate-700 text-sm mb-1">{label}</p>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className={`${c.bar} h-2 rounded-full`} style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
      </div>
      <span className={`text-sm font-bold ${c.text} w-12 text-right`}>{value}%</span>
      <span className={`text-xs px-2 py-0.5 rounded-full border ${c.badge}`}>{c.label}</span>
    </div>
  );
}

export function EducationalEmpty({ icon, title, description, tip }: {
  icon: string; title: string; description: string; tip: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <p className="font-semibold text-slate-700">{title}</p>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
        <p className="text-xs text-blue-700"><span className="font-semibold">Consejo:</span> {tip}</p>
      </div>
    </div>
  );
}

export function RecommendationCard({ icon, title, active, activeSub, inactiveSub, action, color }: {
  icon: string; title: string; active: boolean; activeSub: string;
  inactiveSub: string; action: string | null; color: string;
}) {
  const border: Record<string, string> = {
    indigo: 'border-indigo-200 bg-indigo-50',
    purple: 'border-purple-200 bg-purple-50',
  };
  const dot = active ? 'bg-emerald-400' : 'bg-slate-300';
  return (
    <div className={`border rounded-2xl p-6 space-y-3 ${border[color] ?? 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <p className="font-semibold text-slate-800">{title}</p>
        <span className={`ml-auto h-2.5 w-2.5 rounded-full ${dot}`} title={active ? 'Activo' : 'Inactivo'} />
      </div>
      <p className="text-sm text-slate-600">{active ? activeSub : inactiveSub}</p>
      {action && (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500">
          📋 {action}
        </div>
      )}
    </div>
  );
}
