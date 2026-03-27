import { formatUSD } from '@/app/lib/finopsFormat';

const RISK_LABEL: Record<string, string> = {
  LOW: 'Bajo', MEDIUM: 'Medio', HIGH: 'Alto', CRITICAL: 'Crítico',
};

interface Props {
  roi:  { projected_risk_score: number; projected_risk_level: string; projected_governance: number; high_savings_opportunity_monthly: number };
  risk: { risk_score: number; risk_level: string };
  gov:  { compliance_percentage: number };
}

export default function RoiProjection({ roi, risk, gov }: Props) {
  const riskKey = (risk.risk_level ?? 'LOW').toUpperCase();
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-3xl p-5 lg:p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Proyección de Mejora (ROI)</h2>
      <p className="text-sm text-slate-500 mb-8">
        Estimación del estado del entorno si se resuelven todos los findings activos de alta severidad.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <RoiCard
          label="Risk Score proyectado"
          current={`${risk.risk_score ?? 0} pts`}
          projected={`${roi.projected_risk_score ?? 0} pts`}
          positive={(roi.projected_risk_score ?? 0) < (risk.risk_score ?? 0)}
        />
        <RoiCard
          label="Nivel de riesgo proyectado"
          current={RISK_LABEL[riskKey] ?? riskKey}
          projected={RISK_LABEL[(roi.projected_risk_level ?? '').toUpperCase()] ?? roi.projected_risk_level ?? '—'}
          positive
        />
        <RoiCard
          label="Compliance proyectado"
          current={`${gov.compliance_percentage}%`}
          projected={`${roi.projected_governance ?? 0}%`}
          positive={(roi.projected_governance ?? 0) > gov.compliance_percentage}
        />
        <RoiCard
          label="Ahorro mensual HIGH"
          current="—"
          projected={roi.high_savings_opportunity_monthly > 0
            ? formatUSD(roi.high_savings_opportunity_monthly)
            : 'Sin datos'}
          positive
          hideCurrent
        />
      </div>
    </div>
  );
}

function RoiCard({ label, current, projected, positive, hideCurrent }: {
  label: string; current: string; projected: string; positive: boolean; hideCurrent?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      {!hideCurrent && (
        <div>
          <p className="text-xs text-slate-400">Actual</p>
          <p className="text-lg font-semibold text-slate-700">{current}</p>
        </div>
      )}
      <div>
        <p className="text-xs text-slate-400">Proyectado</p>
        <p className={`text-lg font-bold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>{projected}</p>
      </div>
      {positive && (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
          ↑ Mejora estimada
        </span>
      )}
    </div>
  );
}
