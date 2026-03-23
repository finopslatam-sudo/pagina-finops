'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DONUT_COLORS } from '../hooks/useGobernanza';

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
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

interface SeverityEntry {
  name: string;
  value: number;
}

interface FindingsData {
  total: number;
  active: number;
  resolved: number;
  high: number;
  medium: number;
  low: number;
  financial_opportunities: number;
  review_recommendations: number;
}

interface ExecutiveSummary {
  overall_posture: string;
  governance_status: string;
  primary_risk_driver: string;
  annual_financial_exposure: number;
  monthly_financial_exposure: number;
}

interface Props {
  severityData: SeverityEntry[];
  findings: FindingsData;
  resolvedPct: number;
  riskScore: number;
  exec: ExecutiveSummary;
  resourcesAffected: number;
  formatUSD: (n: number) => string;
}

export default function RiskBreakdown({
  severityData,
  findings: f,
  resolvedPct,
  riskScore,
  exec,
  resourcesAffected,
  formatUSD,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Severity donut */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Distribución por Severidad</h2>
          <p className="text-sm text-slate-500 mt-1">Findings activos clasificados por nivel de criticidad.</p>
        </div>

        {severityData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-4xl mb-3">✅</span>
            <p className="text-slate-600 font-medium">Sin findings activos</p>
            <p className="text-xs text-slate-400 mt-1">El entorno está completamente limpio</p>
          </div>
        ) : (
          <>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={95}
                    innerRadius={52}
                    label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {severityData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [
                      v,
                      n === 'HIGH' ? 'Alto' : n === 'MEDIUM' ? 'Medio' : 'Bajo',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Alto',  value: f.high,   color: 'bg-red-100 border-red-200 text-red-700' },
                { label: 'Medio', value: f.medium, color: 'bg-amber-100 border-amber-200 text-amber-700' },
                { label: 'Bajo',  value: f.low,    color: 'bg-blue-100 border-blue-200 text-blue-700' },
              ].map((s) => (
                <div key={s.label} className={`flex flex-col items-center rounded-xl border px-3 py-3 ${s.color}`}>
                  <span className="text-2xl font-bold">{s.value}</span>
                  <span className="text-xs mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Remediation progress */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
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
          <StatBox label="Total findings"       value={f.total}                      color="text-slate-700" />
          <StatBox label="Activos"              value={f.active}                     color="text-amber-600" />
          <StatBox label="Oportunidades fin."   value={f.financial_opportunities}    color="text-indigo-600" />
          <StatBox label="Revisiones"           value={f.review_recommendations}     color="text-purple-600" />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
          <p className="text-xs text-slate-500">Risk Score ponderado</p>
          <p className="text-2xl font-bold text-slate-800">{riskScore} pts</p>
          <p className="text-xs text-slate-400">HIGH ×5 · MEDIUM ×3 · LOW ×1</p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6 lg:col-span-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Resumen Ejecutivo</h2>
          <p className="text-sm text-slate-500 mt-1">Diagnóstico estratégico generado automáticamente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExecRow icon="🏛️" label="Postura general"            value={exec.overall_posture || '—'} />
          <ExecRow icon="📋" label="Estado de gobernanza"       value={exec.governance_status || '—'} />
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

    </div>
  );
}
