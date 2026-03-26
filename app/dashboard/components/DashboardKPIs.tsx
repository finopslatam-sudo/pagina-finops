'use client';

import { formatUSD } from '@/app/lib/finopsFormat';
import type { DashboardResponse } from '../hooks/useDashboard';

interface Props {
  data: DashboardResponse;
}

export default function DashboardKPIs({ data }: Props) {
  const dl = data.cost.date_labels ?? {};

  const fmt = (iso: string) => {
    if (!iso) return iso;
    const [y, m, d] = iso.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
  };

  // Delta gasto actual vs mes anterior
  const prev = data.cost.previous_month_cost ?? 0;
  const curr = data.cost.current_month_partial ?? 0;
  const costDelta = prev > 0 ? ((curr - prev) / prev) * 100 : null;

  // Porcentaje de ahorro mensual
  const savingsPct = data.cost.monthly_savings_percentage ?? null;

  return (
    <div className="space-y-6">

      {/* FILA 1 — GASTOS MENSUALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PastelCard
          title="Gasto Mes Anterior"
          value={formatUSD(data.cost.previous_month_cost ?? data.cost.current_month_cost)}
          variant="blue"
          tooltip={dl.previous_month_start && dl.previous_month_end
            ? `Período: ${fmt(dl.previous_month_start)} al ${fmt(dl.previous_month_end)}`
            : 'Gasto total del mes cerrado anterior.'}
        />
        <PastelCard
          title="Gasto del Mes Actual"
          value={formatUSD(curr)}
          variant="sky"
          delta={costDelta}
          deltaPositiveIsGood={false}
          tooltip={dl.current_month_end
            ? `Acumulado hasta el ${fmt(dl.current_month_end)}`
            : 'Gastos acumulados hasta hoy.'}
        />
        <PastelCard
          title="Ahorro Mensual Acumulado"
          value={formatUSD(data.cost.potential_savings)}
          variant="green"
          delta={savingsPct}
          deltaPositiveIsGood={true}
          tooltip="Ahorros ya aplicados más oportunidades identificadas en el mes actual."
        />
      </div>

      {/* FILA 2 — FINDINGS & RIESGO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Findings */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-sm space-y-3">
          <p className="text-sm uppercase text-slate-600">Findings &amp; Optimization</p>
          <p className="text-3xl font-semibold text-slate-800">{data.findings.total ?? 0}</p>
          <div className="flex gap-3 text-xs font-medium">
            <span className="text-red-500">{data.findings.high ?? 0} alto</span>
            <span className="text-amber-500">{data.findings.medium ?? 0} medio</span>
            <span className="text-slate-400">{data.findings.low ?? 0} bajo</span>
          </div>
          <p className="text-xs text-slate-500">
            {data.findings.active ?? 0} activos · {data.findings.resolved ?? 0} resueltos
          </p>
        </div>

        {/* Ahorro de findings */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm space-y-3">
          <p className="text-sm uppercase text-slate-600">Ahorro mensual de Findings</p>
          <p className="text-3xl font-semibold text-slate-800">
            {formatUSD(data.findings.estimated_monthly_savings ?? data.cost.potential_savings ?? 0)}
          </p>
          <p className="text-xs text-slate-500">
            {data.findings.financial_opportunities ?? 0} oportunidades financieras
          </p>
          {data.roi_projection?.high_savings_opportunity_annual > 0 && (
            <p className="text-xs text-emerald-700 font-medium">
              Potencial anual: {formatUSD(data.roi_projection.high_savings_opportunity_annual)}
            </p>
          )}
        </div>

        <RiskDistributionCard
          high={data.risk.high ?? 0}
          medium={data.risk.medium ?? 0}
          low={data.risk.low ?? 0}
          riskScore={data.risk.risk_score ?? 0}
          riskLevel={data.risk.risk_level ?? '—'}
        />
      </div>

      {/* FILA 3 — OPERATIONAL METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <PastelCard title="Oportunidades de ahorro"   value={data.findings.financial_opportunities ?? 0} variant="green" />
        <PastelCard title="Revisiones recomendadas"   value={data.findings.review_recommendations ?? 0} variant="amber" />
        <PastelCard title="Recomendaciones Activas"   value={data.findings.active}                       variant="rose" />
        <PastelCard title="Cuentas AWS"               value={data.total_accounts ?? data.accounts}       variant="indigo" />
        <PastelCard title="Recursos Afectados"        value={data.resources_affected}                    variant="sky" />
      </div>
    </div>
  );
}

/* ─────────── Sub-components ─────────── */

function PastelCard({
  title, value, variant, tooltip, delta, deltaPositiveIsGood,
}: {
  title: string;
  value: string | number;
  variant: 'blue'|'green'|'amber'|'rose'|'indigo'|'sky'|'purple';
  tooltip?: string;
  delta?: number | null;
  deltaPositiveIsGood?: boolean;
}) {
  const styles = {
    blue: 'bg-blue-50', green: 'bg-emerald-50', amber: 'bg-amber-50',
    rose: 'bg-rose-50', indigo: 'bg-indigo-50', sky: 'bg-sky-50', purple: 'bg-purple-50',
  };

  const deltaColor = delta == null
    ? ''
    : (delta >= 0) === deltaPositiveIsGood
      ? 'text-emerald-600'
      : 'text-rose-500';

  return (
    <div className={`p-8 rounded-2xl border border-blue-300 shadow-sm ${styles[variant]}`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm uppercase text-slate-600">{title}</p>
        {tooltip && (
          <div className="group relative shrink-0">
            <button type="button" aria-label={`Info ${title}`}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-xs font-semibold text-slate-600 shadow-sm hover:bg-white">
              i
            </button>
            <div className="pointer-events-none absolute right-0 top-8 z-10 w-64 rounded-xl border border-slate-200 bg-white p-3 text-xs normal-case text-slate-600 opacity-0 shadow-lg group-hover:opacity-100 transition duration-200">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <p className="text-3xl font-semibold text-slate-800">{value}</p>
      {delta != null && (
        <p className={`text-xs font-medium mt-2 tabular-nums ${deltaColor}`}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}% vs mes anterior
        </p>
      )}
    </div>
  );
}

function RiskDistributionCard({
  high, medium, low, riskScore, riskLevel,
}: {
  high: number; medium: number; low: number; riskScore: number; riskLevel: string;
}) {
  const total = high + medium + low || 1;
  const pctHigh   = Math.round((high   / total) * 100);
  const pctMedium = Math.round((medium / total) * 100);
  const pctLow    = Math.round((low    / total) * 100);
  const levelColor: Record<string, string> = {
    critical: 'text-red-600', high: 'text-orange-500', medium: 'text-amber-500',
    low: 'text-emerald-600', minimal: 'text-emerald-600',
  };
  const textColor = levelColor[riskLevel?.toLowerCase()] ?? 'text-slate-700';
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm uppercase text-slate-600">Distribución por Riesgo</p>
        <span className={`text-xs font-semibold uppercase ${textColor}`}>{riskLevel}</span>
      </div>
      <div className="flex h-3 w-full rounded-full overflow-hidden mb-4">
        {pctHigh   > 0 && <div style={{ width: `${pctHigh}%`   }} className="bg-red-400" />}
        {pctMedium > 0 && <div style={{ width: `${pctMedium}%` }} className="bg-amber-400" />}
        {pctLow    > 0 && <div style={{ width: `${pctLow}%`    }} className="bg-emerald-400" />}
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-400" />Alto {high}</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-400" />Medio {medium}</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />Bajo {low}</span>
      </div>
      <p className="text-2xl font-semibold text-slate-800 mt-3">
        {riskScore}%
        <span className="text-sm font-normal text-slate-500 ml-1">risk score</span>
      </p>
    </div>
  );
}
