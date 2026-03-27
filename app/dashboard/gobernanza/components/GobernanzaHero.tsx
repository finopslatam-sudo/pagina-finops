const RISK_LABEL: Record<string, string> = {
  LOW: 'Bajo', MEDIUM: 'Medio', HIGH: 'Alto', CRITICAL: 'Crítico',
};
const RISK_COLOR: Record<string, string> = {
  LOW:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  MEDIUM:  'bg-amber-50 text-amber-700 border-amber-200',
  HIGH:    'bg-red-50 text-red-700 border-red-200',
  CRITICAL:'bg-rose-100 text-rose-800 border-rose-300',
};
const COMPLIANCE_COLOR = (pct: number) => {
  if (pct >= 80) return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600', label: 'Cumplimiento óptimo' };
  if (pct >= 50) return { bg: 'bg-amber-50 border-amber-200',   text: 'text-amber-600',   label: 'Requiere atención' };
  return              { bg: 'bg-red-50 border-red-200',         text: 'text-red-600',      label: 'Cumplimiento crítico' };
};

interface Props {
  data: {
    governance: { compliance_percentage: number };
    risk: { risk_level: string };
    executive_summary: { message: string };
    last_sync: string | null;
  };
  latest: { created_at?: string } | null;
  trend: unknown;
}

export default function GobernanzaHero({ data, latest, trend }: Props) {
  const riskKey       = (data.risk.risk_level ?? 'LOW').toUpperCase();
  const govPct        = data.governance.compliance_percentage;
  const complianceCol = COMPLIANCE_COLOR(govPct);
  const trendCount    = Array.isArray(trend) ? trend.length : 0;
  const lastSync      = data.last_sync ? new Date(data.last_sync).toLocaleString('es-CL') : null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-white to-white border border-indigo-200 rounded-3xl p-6 lg:p-10 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gobernanza & Compliance</h1>
          <p className="text-gray-600 mt-3 max-w-3xl leading-relaxed">
            {data.executive_summary.message || 'Evaluación integral del nivel de riesgo, madurez operativa y cumplimiento de buenas prácticas en tu entorno cloud.'}
          </p>
          <div className="flex flex-wrap gap-3 mt-5 text-sm">
            <span className={`px-3 py-1 rounded-full border font-medium ${RISK_COLOR[riskKey] ?? 'bg-slate-50 text-slate-700 border-slate-200'}`}>
              Riesgo {RISK_LABEL[riskKey] ?? riskKey}
            </span>
            {lastSync && (
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                Último sync: {lastSync}
              </span>
            )}
            {trendCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700">
                {trendCount} snapshots históricos
              </span>
            )}
            {latest?.created_at && (
              <span className="px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-700">
                Snapshot: {new Date(latest.created_at).toLocaleDateString('es-CL')}
              </span>
            )}
          </div>
        </div>

        <div className={`flex flex-col items-center justify-center rounded-2xl border px-8 py-5 ${complianceCol.bg}`}>
          <span className="text-xs uppercase tracking-wide text-slate-500 mb-1">Compliance</span>
          <span className={`text-4xl font-bold ${complianceCol.text}`}>{govPct}%</span>
          <span className="text-xs text-slate-500 mt-1">{complianceCol.label}</span>
        </div>
      </div>
    </div>
  );
}
