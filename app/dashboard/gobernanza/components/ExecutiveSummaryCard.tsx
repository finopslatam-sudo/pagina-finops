import { formatUSD } from '@/app/lib/finopsFormat';

interface Props {
  exec: {
    overall_posture: string;
    governance_status: string;
    primary_risk_driver: string;
    annual_financial_exposure: number;
  };
  resourcesAffected: number;
}

export default function ExecutiveSummaryCard({ exec, resourcesAffected }: Props) {
  return (
    <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Resumen Ejecutivo</h2>
        <p className="text-sm text-slate-500 mt-1">Diagnóstico estratégico generado automáticamente.</p>
      </div>

      <div className="space-y-4">
        <ExecRow icon="🏛️" label="Postura general"           value={exec.overall_posture || '—'} />
        <ExecRow icon="📋" label="Estado de gobernanza"      value={exec.governance_status || '—'} />
        <ExecRow icon="⚠️" label="Principal driver de riesgo" value={exec.primary_risk_driver || '—'} />
        <ExecRow
          icon="💰"
          label="Exposición anual estimada"
          value={exec.annual_financial_exposure > 0 ? formatUSD(exec.annual_financial_exposure) : 'Sin datos'}
        />
      </div>

      {resourcesAffected > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-rose-500 text-lg">🔴</span>
          <div>
            <p className="text-sm font-semibold text-rose-700">{resourcesAffected} recursos afectados</p>
            <p className="text-xs text-rose-500">Con findings activos en el inventario</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ExecRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
      <span className="text-lg mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}
