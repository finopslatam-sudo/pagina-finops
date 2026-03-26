'use client';

import { formatUSD } from '@/app/lib/finopsFormat';
import type { DashboardResponse } from '../hooks/useDashboard';

interface Props {
  data: DashboardResponse | null;
  loading: boolean;
}

const POSTURE_STYLE: Record<string, string> = {
  EXCELLENT: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  GOOD:      'bg-blue-100 border-blue-300 text-blue-700',
  FAIR:      'bg-amber-100 border-amber-300 text-amber-700',
  POOR:      'bg-rose-100 border-rose-300 text-rose-700',
};

const RISK_BAR: Record<string, string> = {
  CRITICAL: 'bg-red-400', HIGH: 'bg-orange-400',
  MODERATE: 'bg-amber-400', LOW: 'bg-emerald-400',
};

const RISK_TEXT: Record<string, string> = {
  CRITICAL: 'text-red-600', HIGH: 'text-orange-500',
  MODERATE: 'text-amber-500', LOW: 'text-emerald-600',
};

function fmtSync(iso: string | null) {
  if (!iso) return 'Sin datos';
  return new Date(iso).toLocaleString('es-CL', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function ExecutiveOverview({ data, loading }: Props) {
  const riskScore  = data?.risk?.risk_score ?? 0;
  const riskLevel  = data?.risk?.risk_level ?? 'LOW';
  const govPct     = data?.governance?.compliance_percentage ?? 0;
  const posture    = data?.executive_summary?.overall_posture ?? '—';
  const exposure   = data?.executive_summary?.monthly_financial_exposure ?? 0;
  const annualExp  = data?.executive_summary?.annual_financial_exposure ?? 0;
  const govColor   = govPct >= 80 ? 'bg-emerald-400' : govPct >= 60 ? 'bg-amber-400' : 'bg-rose-400';

  return (
    <div className="bg-slate-200 border border-blue-300 rounded-3xl shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="px-8 lg:px-12 pt-8 lg:pt-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-slate-800">Executive Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Última sincronización: {fmtSync(data?.last_sync ?? null)}
          </p>
        </div>

        {!loading && data && (
          <span className={`text-xs font-bold uppercase px-4 py-1.5 rounded-full border ${POSTURE_STYLE[posture] ?? 'bg-slate-100 border-slate-300 text-slate-600'}`}>
            {posture}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="px-8 lg:px-12 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Mensaje ejecutivo */}
        {loading || !data ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-300 rounded-lg w-full" />
            <div className="h-4 bg-slate-300 rounded-lg w-5/6" />
            <div className="h-4 bg-slate-300 rounded-lg w-3/4" />
          </div>
        ) : (
          <p className="text-base text-slate-700 leading-relaxed">
            {data.executive_summary?.message}
          </p>
        )}

        {/* Métricas con visualización */}
        <div className="space-y-3">
          {loading || !data ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-blue-200 p-4 rounded-xl animate-pulse space-y-2">
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-2 w-full bg-slate-100 rounded-full" />
              </div>
            ))
          ) : (
            <>
              {/* Risk Score */}
              <div className="bg-white border border-blue-200 p-4 rounded-xl">
                <div className="flex justify-between mb-2">
                  <p className="text-xs uppercase text-slate-500 font-medium">Risk Score</p>
                  <span className={`text-xs font-bold uppercase ${RISK_TEXT[riskLevel] ?? 'text-slate-600'}`}>
                    {riskLevel}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${RISK_BAR[riskLevel] ?? 'bg-slate-400'}`}
                      style={{ width: `${riskScore}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-slate-800 w-14 text-right tabular-nums">
                    {riskScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {data.risk.high} alto · {data.risk.medium} medio · {data.risk.low} bajo
                </p>
              </div>

              {/* Governance */}
              <div className="bg-white border border-blue-200 p-4 rounded-xl">
                <div className="flex justify-between mb-2">
                  <p className="text-xs uppercase text-slate-500 font-medium">Governance</p>
                  <span className="text-xs text-slate-500">
                    {data.governance.compliant_resources} / {data.governance.total_resources} recursos
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${govColor}`}
                      style={{ width: `${govPct}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-slate-800 w-14 text-right tabular-nums">
                    {govPct}%
                  </span>
                </div>
              </div>

              {/* Exposición financiera */}
              {exposure > 0 && (
                <div className="bg-white border border-rose-200 p-4 rounded-xl">
                  <p className="text-xs uppercase text-slate-500 font-medium mb-1">
                    Exposición Financiera Mensual
                  </p>
                  <p className="text-xl font-bold text-rose-600 tabular-nums">{formatUSD(exposure)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Estimado anual: {formatUSD(annualExp)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
