'use client';

import type { ProjectItem } from '../types';
import { SERVICE_LABELS } from '../types';

interface Props {
  items: ProjectItem[];
  totalMonthly: number;
  totalAnnual: number;
  byService: Record<string, number>;
  onClear: () => void;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function Summary({ items, totalMonthly, totalAnnual, byService, onClear }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 lg:sticky lg:top-6">

      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-800 text-lg">Resumen del Proyecto</h2>
        {items.length > 0 && (
          <button onClick={onClear} className="text-xs text-rose-500 hover:text-rose-700 transition">
            Limpiar todo
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <p className="text-3xl">🧮</p>
          <p className="text-sm text-slate-400">
            Agrega servicios para ver el estimado de costos.
          </p>
        </div>
      ) : (
        <>
          {/* Total */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Costo mensual estimado</p>
            <p className="text-3xl font-bold mt-1">{fmt(totalMonthly)}</p>
            <p className="text-sm opacity-70 mt-1">
              Anual: <span className="font-semibold opacity-100">{fmt(totalAnnual)}</span>
            </p>
          </div>

          {/* Por servicio */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Por servicio</p>
            {Object.entries(byService)
              .sort(([, a], [, b]) => b - a)
              .map(([svc, cost]) => {
                const info = SERVICE_LABELS[svc as keyof typeof SERVICE_LABELS];
                const pct  = totalMonthly > 0 ? (cost / totalMonthly) * 100 : 0;
                return (
                  <div key={svc} className="flex items-center gap-2">
                    <span className="text-base shrink-0">{info?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-slate-600 truncate">{info?.label}</span>
                        <span className="font-semibold text-slate-800 shrink-0 ml-2">{fmt(cost)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Lista detallada */}
          <div className="border-t pt-4 space-y-1.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Recursos ({items.length})
            </p>
            {items.map(item => {
              const info = SERVICE_LABELS[item.config.type];
              return (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-500 truncate flex items-center gap-1">
                    <span>{info?.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-medium text-slate-800 shrink-0 ml-2">{fmt(item.monthlyCost)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
