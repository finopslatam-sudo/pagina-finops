import { formatUSD } from '@/app/lib/finopsFormat';

const RISK_LABEL: Record<string, string> = {
  LOW: 'Bajo', MEDIUM: 'Medio', HIGH: 'Alto', CRITICAL: 'Crítico',
};

interface Props {
  gov:  { compliance_percentage: number; compliant_resources: number; total_resources: number; non_compliant_resources: number };
  risk: { risk_score: number; risk_level: string };
  exec: { monthly_financial_exposure: number };
  f:    { active: number; resolved: number; total: number };
}

export default function GobernanzaKPIs({ gov, risk, exec, f }: Props) {
  const riskKey = (risk.risk_level ?? 'LOW').toUpperCase();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <KpiCard
        title="Risk Score"
        value={risk.risk_score ?? 0}
        sub={`Nivel: ${RISK_LABEL[riskKey] ?? riskKey}`}
        variant={riskKey === 'LOW' ? 'green' : riskKey === 'MEDIUM' ? 'amber' : 'red'}
      />
      <KpiCard
        title="Recursos conformes"
        value={`${gov.compliant_resources} / ${gov.total_resources}`}
        sub={`${gov.non_compliant_resources} no conformes`}
        variant="indigo"
      />
      <KpiCard
        title="Findings activos"
        value={f.active}
        sub={`${f.resolved} resueltos de ${f.total} totales`}
        variant="purple"
      />
      <KpiCard
        title="Exposición mensual"
        value={exec.monthly_financial_exposure > 0 ? formatUSD(exec.monthly_financial_exposure) : 'Sin datos'}
        sub="Riesgo financiero estimado"
        variant="rose"
      />
    </div>
  );
}

function KpiCard({ title, value, sub, variant }: {
  title: string; value: string | number; sub: string; variant: string;
}) {
  const bg: Record<string, string> = {
    green: 'bg-emerald-50 border-emerald-200', amber: 'bg-amber-50 border-amber-200',
    red:   'bg-red-50 border-red-200',         indigo: 'bg-indigo-50 border-indigo-200',
    purple:'bg-purple-50 border-purple-200',   rose:   'bg-rose-50 border-rose-200',
  };
  return (
    <div className={`${bg[variant] ?? 'bg-slate-50 border-slate-200'} border rounded-2xl p-6 shadow-sm`}>
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{title}</p>
      <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}
