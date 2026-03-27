interface Props {
  f:           { total: number; active: number; resolved: number; financial_opportunities: number; review_recommendations: number };
  risk:        { risk_score: number };
  resolvedPct: number;
}

export default function RemediationCard({ f, risk, resolvedPct }: Props) {
  return (
    <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Progreso de Remediación</h2>
        <p className="text-sm text-slate-500 mt-1">Avance en la resolución de findings identificados.</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Resueltos</span>
          <span className="font-semibold text-emerald-600">{resolvedPct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${resolvedPct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">{f.resolved} de {f.total} findings resueltos</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatBox label="Total findings"     value={f.total}                    color="text-slate-700" />
        <StatBox label="Activos"            value={f.active}                   color="text-amber-600" />
        <StatBox label="Oportunidades fin." value={f.financial_opportunities}  color="text-indigo-600" />
        <StatBox label="Revisiones"         value={f.review_recommendations}   color="text-purple-600" />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
        <p className="text-xs text-slate-500">Risk Score ponderado</p>
        <p className="text-2xl font-bold text-slate-800">{risk.risk_score ?? 0} pts</p>
        <p className="text-xs text-slate-400">HIGH ×5 · MEDIUM ×3 · LOW ×1</p>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
