'use client';

import { useDashboard } from '../hooks/useDashboard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';
import AwsAccountSelector from '../components/AwsAccountSelector';
import { useSnapshots } from '../hooks/useSnapshots';
import { formatUSD } from '@/app/lib/finopsFormat';

/* ─── helpers ─────────────────────────────────────────────── */

const RISK_LABEL: Record<string, string> = {
  LOW: 'Bajo', MEDIUM: 'Medio', HIGH: 'Alto', CRITICAL: 'Crítico',
};
const RISK_COLOR: Record<string, string> = {
  LOW:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  HIGH:   'bg-red-50 text-red-700 border-red-200',
  CRITICAL:'bg-rose-100 text-rose-800 border-rose-300',
};
const COMPLIANCE_COLOR = (pct: number) => {
  if (pct >= 80) return { stroke: '#10b981', text: 'text-emerald-600', label: 'Cumplimiento óptimo' };
  if (pct >= 50) return { stroke: '#f59e0b', text: 'text-amber-600',   label: 'Requiere atención' };
  return              { stroke: '#ef4444', text: 'text-red-600',       label: 'Cumplimiento crítico' };
};

/* SVG circular gauge */
function Gauge({ value, size = 180 }: { value: number; size?: number }) {
  const c = size / 2;
  const r = size * 0.38;
  const stroke = size * 0.072;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (pct / 100) * circumference;
  const col = COMPLIANCE_COLOR(pct);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={c} cy={c} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={c} cy={c} r={r} fill="none"
          stroke={col.stroke} strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${col.text}`}>{pct}%</span>
        <span className="text-xs text-slate-500 mt-0.5">compliance</span>
      </div>
    </div>
  );
}

const DONUT_COLORS = ['#f87171', '#fbbf24', '#60a5fa'];

/* ─── page ────────────────────────────────────────────────── */

export default function GobernanzaPage() {
  const { data, loading } = useDashboard();
  const { user } = useAuth();
  const { latest, trend } = useSnapshots();

  /* plan check */
  if (!hasFeature(user?.plan_code, 'gobernanza')) {
    return <div className="p-6 text-red-500">Este módulo requiere plan Professional o Enterprise</div>;
  }

  /* skeleton */
  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-6 space-y-10 animate-pulse">
        <div className="bg-slate-100 border border-slate-200 rounded-3xl p-10 space-y-4">
          <div className="h-8 w-72 bg-slate-200 rounded-xl" />
          <div className="h-4 w-full max-w-2xl bg-slate-200 rounded-lg" />
          <div className="flex gap-3 mt-2">
            <div className="h-7 w-40 bg-slate-200 rounded-full" />
            <div className="h-7 w-32 bg-slate-200 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-50 border rounded-2xl p-6 space-y-3">
              <div className="h-3 w-28 bg-slate-200 rounded" />
              <div className="h-8 w-20 bg-slate-200 rounded-lg" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border rounded-3xl p-8 space-y-4">
              <div className="h-6 w-44 bg-slate-200 rounded" />
              <div className="h-48 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* derived */
  const gov    = data.governance;
  const risk   = data.risk;
  const exec   = data.executive_summary;
  const roi    = data.roi_projection;
  const f      = data.findings;

  const riskKey        = (risk.risk_level ?? 'LOW').toUpperCase();
  const complianceCol  = COMPLIANCE_COLOR(gov.compliance_percentage);
  const resolvedPct    = f.total > 0 ? Math.round((f.resolved / f.total) * 100) : 0;
  const trendCount     = Array.isArray(trend) ? trend.length : 0;
  const lastSync       = data.last_sync ? new Date(data.last_sync).toLocaleString('es-CL') : null;

  const severityData = [
    { name: 'HIGH',   value: f.high },
    { name: 'MEDIUM', value: f.medium },
    { name: 'LOW',    value: f.low },
  ].filter(d => d.value > 0);

  const priorityServices: any[] = Array.isArray(data.priority_services) ? data.priority_services : [];

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-white border border-indigo-200 rounded-3xl p-10 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Gobernanza & Compliance</h1>
            <p className="text-gray-600 mt-3 max-w-3xl leading-relaxed">
              {exec.message || 'Evaluación integral del nivel de riesgo, madurez operativa y cumplimiento de buenas prácticas en tu entorno cloud.'}
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

          {/* Compliance score badge */}
          <div className={`flex flex-col items-center justify-center rounded-2xl border px-8 py-5 ${
            gov.compliance_percentage >= 80
              ? 'bg-emerald-50 border-emerald-200'
              : gov.compliance_percentage >= 50
              ? 'bg-amber-50 border-amber-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <span className="text-xs uppercase tracking-wide text-slate-500 mb-1">Compliance</span>
            <span className={`text-4xl font-bold ${complianceCol.text}`}>{gov.compliance_percentage}%</span>
            <span className="text-xs text-slate-500 mt-1">{complianceCol.label}</span>
          </div>
        </div>
      </div>

      {/* ── ACCOUNT FILTER ── */}
      <div className="flex items-center gap-4">
        <AwsAccountSelector />
      </div>

      {/* ── KPI CARDS ── */}
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

      {/* ── COMPLIANCE GAUGE + SEVERITY DONUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Gauge de compliance */}
        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Nivel de Compliance</h2>
            <p className="text-sm text-slate-500 mt-1">Recursos que cumplen las buenas prácticas de AWS sobre el total escaneado.</p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <Gauge value={gov.compliance_percentage} size={200} />

            <div className="w-full space-y-3">
              <ResourceBar
                label="Conformes"
                value={gov.compliant_resources}
                total={gov.total_resources}
                color="bg-emerald-500"
              />
              <ResourceBar
                label="No conformes"
                value={gov.non_compliant_resources}
                total={gov.total_resources}
                color="bg-red-400"
              />
            </div>
          </div>
        </div>

        {/* Donut severidad */}
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
                    <Pie data={severityData} dataKey="value" nameKey="name"
                      outerRadius={95} innerRadius={52}
                      label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {severityData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n === 'HIGH' ? 'Alto' : n === 'MEDIUM' ? 'Medio' : 'Bajo']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Alto',  value: f.high,   color: 'bg-red-100 border-red-200 text-red-700' },
                  { label: 'Medio', value: f.medium, color: 'bg-amber-100 border-amber-200 text-amber-700' },
                  { label: 'Bajo',  value: f.low,    color: 'bg-blue-100 border-blue-200 text-blue-700' },
                ].map(s => (
                  <div key={s.label} className={`flex flex-col items-center rounded-xl border px-3 py-3 ${s.color}`}>
                    <span className="text-2xl font-bold">{s.value}</span>
                    <span className="text-xs mt-0.5">{s.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* ── RESOLUCIÓN + EXECUTIVE SUMMARY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Progreso de resolución */}
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
            <StatBox label="Total findings"    value={f.total}             color="text-slate-700" />
            <StatBox label="Activos"           value={f.active}            color="text-amber-600" />
            <StatBox label="Oportunidades fin." value={f.financial_opportunities} color="text-indigo-600" />
            <StatBox label="Revisiones"        value={f.review_recommendations}  color="text-purple-600" />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <p className="text-xs text-slate-500">Risk Score ponderado</p>
            <p className="text-2xl font-bold text-slate-800">{risk.risk_score ?? 0} pts</p>
            <p className="text-xs text-slate-400">HIGH ×5 · MEDIUM ×3 · LOW ×1</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Resumen Ejecutivo</h2>
            <p className="text-sm text-slate-500 mt-1">Diagnóstico estratégico generado automáticamente.</p>
          </div>

          <div className="space-y-4">
            <ExecRow
              icon="🏛️"
              label="Postura general"
              value={exec.overall_posture || '—'}
            />
            <ExecRow
              icon="📋"
              label="Estado de gobernanza"
              value={exec.governance_status || '—'}
            />
            <ExecRow
              icon="⚠️"
              label="Principal driver de riesgo"
              value={exec.primary_risk_driver || '—'}
            />
            <ExecRow
              icon="💰"
              label="Exposición anual estimada"
              value={exec.annual_financial_exposure > 0
                ? formatUSD(exec.annual_financial_exposure)
                : 'Sin datos'}
            />
          </div>

          {data.resources_affected > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-rose-500 text-lg">🔴</span>
              <div>
                <p className="text-sm font-semibold text-rose-700">{data.resources_affected} recursos afectados</p>
                <p className="text-xs text-rose-500">Con findings activos en el inventario</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── ROI PROJECTION ── */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-3xl p-8 shadow-sm">
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

      {/* ── PRIORITY SERVICES ── */}
      {priorityServices.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Servicios Prioritarios</h2>
            <p className="text-sm text-slate-500 mt-1">Servicios con mayor concentración de riesgo que requieren atención inmediata.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorityServices.slice(0, 6).map((svc: any, i: number) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <p className="font-semibold text-slate-700 text-sm">{svc.service ?? svc.service_name ?? '—'}</p>
                {svc.high_findings != null && (
                  <p className="text-xs text-red-500">{svc.high_findings} findings HIGH</p>
                )}
                {svc.risk_score != null && (
                  <p className="text-xs text-slate-400">Risk score: {svc.risk_score}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

/* ─── UI components ──────────────────────────────────────── */

function KpiCard({ title, value, sub, variant }: {
  title: string; value: string | number; sub: string; variant: string;
}) {
  const bg: Record<string, string> = {
    green:  'bg-emerald-50 border-emerald-200',
    amber:  'bg-amber-50 border-amber-200',
    red:    'bg-red-50 border-red-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    purple: 'bg-purple-50 border-purple-200',
    rose:   'bg-rose-50 border-rose-200',
  };
  return (
    <div className={`${bg[variant] ?? 'bg-slate-50 border-slate-200'} border rounded-2xl p-6 shadow-sm`}>
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{title}</p>
      <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function ResourceBar({ label, value, total, color }: {
  label: string; value: number; total: number; color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span className="font-medium">{value} ({pct}%)</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
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
