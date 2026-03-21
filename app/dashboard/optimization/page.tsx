'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';
import { useAwsAccount } from '../context/AwsAccountContext';
import { useDashboard } from '../hooks/useDashboard';
import AwsAccountSelector from '../components/AwsAccountSelector';
import { formatUSD } from '@/app/lib/finopsFormat';

type RIResponse = {
  coverage_percentage: number;
  has_reserved_instances: boolean;
  has_data: boolean;
  period_days: number;
};

type SPResponse = {
  has_savings_plans: boolean;
  has_data: boolean;
  period_days: number;
  services: { service: string; coverage_percentage: number }[];
};

/* ─── helpers ─────────────────────────────────────────────── */

function coverageColor(pct: number) {
  if (pct >= 70) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Cobertura óptima', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (pct >= 40) return { bar: 'bg-amber-400',   text: 'text-amber-600',   label: 'Cobertura parcial', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
  return             { bar: 'bg-red-400',         text: 'text-red-600',     label: 'Cobertura baja', badge: 'bg-red-50 text-red-700 border-red-200' };
}

function overallStatus(ri: RIResponse | null, sp: SPResponse | null): { label: string; color: string } {
  const riPct  = ri?.has_reserved_instances  ? ri.coverage_percentage  : 0;
  const spPct  = sp?.has_savings_plans       ? (sp.services[0]?.coverage_percentage ?? 0) : 0;
  const max    = Math.max(riPct, spPct);
  if (max === 0)  return { label: 'Sin compromisos', color: 'text-slate-500' };
  if (max >= 70)  return { label: 'Óptimo',          color: 'text-emerald-600' };
  if (max >= 40)  return { label: 'Parcial',          color: 'text-amber-600' };
  return                  { label: 'Cobertura baja',  color: 'text-red-600' };
}

/* ─── page ────────────────────────────────────────────────── */

export default function OptimizationPage() {
  const { token, user } = useAuth();
  const { selectedAccount } = useAwsAccount();
  const { data: dash } = useDashboard();

  const [ri,             setRI]             = useState<RIResponse | null>(null);
  const [sp,             setSP]             = useState<SPResponse | null>(null);
  const [loadingFinops,  setLoadingFinops]  = useState(true);

  useEffect(() => {
    if (!token) { setLoadingFinops(false); return; }

    const accountQuery = selectedAccount ? `?aws_account_id=${selectedAccount}` : '';

    Promise.all([
      fetch(`/api/client/finops/ri-coverage${accountQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/api/client/finops/sp-coverage${accountQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([r2, r3]) => Promise.all([r2.json(), r3.json()]))
      .then(([d2, d3]) => { setRI(d2); setSP(d3); })
      .catch(e => console.error('FinOps API error', e))
      .finally(() => setLoadingFinops(false));
  }, [token, selectedAccount]);

  /* ── plan check ── */
  if (!hasFeature(user?.plan_code, 'optimization')) {
    return <div className="p-6 text-red-500">Este módulo requiere plan Professional o Enterprise</div>;
  }

  /* ── skeleton loader ── */
  if (loadingFinops) {
    return (
      <div className="max-w-7xl mx-auto px-6 space-y-10 animate-pulse">
        <div className="bg-slate-100 border border-slate-200 rounded-3xl p-8 space-y-4">
          <div className="h-8 w-96 bg-slate-200 rounded-xl" />
          <div className="h-4 w-full max-w-xl bg-slate-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="h-3 w-28 bg-slate-200 rounded" />
              <div className="h-8 w-20 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl space-y-4">
            <div className="h-6 w-56 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  /* ── derived values ── */
  const riPct    = ri?.has_reserved_instances ? ri.coverage_percentage : 0;
  const spPct    = sp?.has_savings_plans      ? (sp.services[0]?.coverage_percentage ?? 0) : 0;
  const status   = overallStatus(ri, sp);
  const savings  = dash?.findings?.estimated_monthly_savings ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Estrategia de Compromisos (RI & Savings Plans)
        </h1>
        <p className="text-gray-600 mt-3 max-w-3xl">
          Monitorea la cobertura y uso de Reserved Instances y Savings Plans para maximizar
          el valor de tus workloads en la nube y reducir el costo bajo demanda.
        </p>
      </div>

      {/* ── ACCOUNT FILTER ── */}
      <div className="flex items-center gap-4">
        <AwsAccountSelector />
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <KpiCard
          title="Cobertura RI"
          value={ri?.has_reserved_instances ? `${riPct}%` : 'Sin datos'}
          sub={ri?.has_reserved_instances ? coverageColor(riPct).label : 'No hay RIs activas'}
          variant="indigo"
        />

        <KpiCard
          title="Cobertura SP"
          value={sp?.has_savings_plans ? `${spPct}%` : 'Sin datos'}
          sub={sp?.has_savings_plans ? coverageColor(spPct).label : 'No hay Savings Plans'}
          variant="purple"
        />

        <KpiCard
          title="Ahorro Potencial"
          value={savings > 0 ? formatUSD(savings) : 'Sin datos'}
          sub="Estimado mensual desde findings"
          variant="green"
        />

        <KpiCard
          title="Estado General"
          value={status.label}
          valueClass={status.color}
          sub="Basado en cobertura activa"
          variant="slate"
        />

      </div>

      {/* ── RESERVED INSTANCES ── */}
      <Section title="Reserved Instances" subtitle="Porcentaje de uso cubierto por instancias reservadas en los últimos 30 días.">
        {ri?.has_reserved_instances ? (
          <CoverageBar percentage={riPct} />
        ) : (
          <EducationalEmpty
            icon="🏷️"
            title="No hay Reserved Instances activas"
            description="Las Reserved Instances permiten comprometerse a usar un tipo de instancia EC2 por 1 o 3 años a cambio de descuentos de hasta el 40% respecto al precio bajo demanda."
            tip="Recomendado cuando tienes instancias EC2 con uso sostenido (> 70% del tiempo). Revisa los findings de tipo EC2_RI en la sección Findings."
          />
        )}
      </Section>

      {/* ── SAVINGS PLANS ── */}
      <Section title="Savings Plans" subtitle="Cobertura de los compromisos de uso flexible por servicio.">
        {sp?.has_savings_plans ? (
          <div className="space-y-4">
            {sp.services.map((s, idx) => (
              <CoverageRow key={idx} label={s.service} value={s.coverage_percentage} />
            ))}
          </div>
        ) : (
          <EducationalEmpty
            icon="💡"
            title="No hay Savings Plans activos"
            description="Los Savings Plans ofrecen descuentos de hasta el 66% a cambio de comprometerte a un gasto mínimo por hora durante 1 o 3 años. Son más flexibles que las RIs porque aplican a múltiples tipos de instancia y servicios."
            tip="Ideal para workloads con patrones de uso predecibles en EC2, Lambda o Fargate. Evalúa el reporte SP_REVIEW en tu sección de Findings."
          />
        )}
      </Section>

      {/* ── RECOMENDACIONES ── */}
      <Section title="Recomendaciones de Optimización" subtitle="Acciones sugeridas según el estado actual de tus compromisos.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <RecommendationCard
            icon="🏷️"
            title="Reserved Instances"
            active={ri?.has_reserved_instances ?? false}
            activeSub={`Cobertura actual: ${riPct}% — ${riPct >= 70 ? 'En buen estado.' : 'Considera ampliar la cobertura.'}`}
            inactiveSub="Comprometerte con RIs en instancias de uso continuo puede reducir hasta un 40% el costo de EC2."
            action={riPct >= 70 ? null : 'Revisa los findings EC2_RI y LOW_RI_COVERAGE'}
            color="indigo"
          />

          <RecommendationCard
            icon="💡"
            title="Savings Plans"
            active={sp?.has_savings_plans ?? false}
            activeSub={`Cobertura activa en ${sp?.services.length ?? 0} servicio(s).`}
            inactiveSub="Los Savings Plans son más flexibles que las RIs y pueden aplicar ahorro en EC2, Lambda y Fargate automáticamente."
            action={sp?.has_savings_plans ? null : 'Revisa los findings SP_REVIEW para oportunidades identificadas'}
            color="purple"
          />

        </div>
      </Section>

    </div>
  );
}

/* ─── UI components ──────────────────────────────────────── */

function KpiCard({
  title, value, sub, variant, valueClass,
}: {
  title: string; value: string; sub: string; variant: string; valueClass?: string;
}) {
  const bg: Record<string, string> = {
    indigo: 'bg-indigo-50 border-indigo-200',
    purple: 'bg-purple-50 border-purple-200',
    green:  'bg-emerald-50 border-emerald-200',
    slate:  'bg-slate-50 border-slate-200',
  };
  return (
    <div className={`${bg[variant] ?? bg.slate} border rounded-2xl p-6 shadow-sm`}>
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{title}</p>
      <p className={`text-2xl font-bold text-slate-800 ${valueClass ?? ''}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function CoverageBar({ percentage }: { percentage: number }) {
  const c = coverageColor(percentage);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-4xl font-bold ${c.text}`}>{percentage}%</span>
        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${c.badge}`}>
          {c.label}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-4">
        <div
          className={`${c.bar} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400">
        <span>0%</span>
        <span className="text-amber-500">40% — Mínimo recomendado</span>
        <span className="text-emerald-500">70% — Óptimo</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function CoverageRow({ label, value }: { label: string; value: number }) {
  const c = coverageColor(value);
  return (
    <div className="flex items-center gap-4 bg-slate-50 border rounded-2xl p-4">
      <div className="flex-1">
        <p className="font-medium text-slate-700 text-sm mb-1">{label}</p>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className={`${c.bar} h-2 rounded-full`} style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
      </div>
      <span className={`text-sm font-bold ${c.text} w-12 text-right`}>{value}%</span>
      <span className={`text-xs px-2 py-0.5 rounded-full border ${c.badge}`}>{c.label}</span>
    </div>
  );
}

function EducationalEmpty({ icon, title, description, tip }: {
  icon: string; title: string; description: string; tip: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <p className="font-semibold text-slate-700">{title}</p>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
        <p className="text-xs text-blue-700"><span className="font-semibold">Consejo:</span> {tip}</p>
      </div>
    </div>
  );
}

function RecommendationCard({ icon, title, active, activeSub, inactiveSub, action, color }: {
  icon: string; title: string; active: boolean; activeSub: string;
  inactiveSub: string; action: string | null; color: string;
}) {
  const border: Record<string, string> = {
    indigo: 'border-indigo-200 bg-indigo-50',
    purple: 'border-purple-200 bg-purple-50',
  };
  const dot = active
    ? 'bg-emerald-400'
    : 'bg-slate-300';

  return (
    <div className={`border rounded-2xl p-6 space-y-3 ${border[color] ?? 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <p className="font-semibold text-slate-800">{title}</p>
        <span className={`ml-auto h-2.5 w-2.5 rounded-full ${dot}`} title={active ? 'Activo' : 'Inactivo'} />
      </div>
      <p className="text-sm text-slate-600">{active ? activeSub : inactiveSub}</p>
      {action && (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500">
          📋 {action}
        </div>
      )}
    </div>
  );
}
