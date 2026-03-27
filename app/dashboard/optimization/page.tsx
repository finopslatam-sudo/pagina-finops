'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';
import { apiFetch } from '@/app/lib/api';
import { useAwsAccount } from '../context/AwsAccountContext';
import { useDashboard } from '../hooks/useDashboard';
import AwsAccountSelector from '../components/AwsAccountSelector';
import { formatUSD } from '@/app/lib/finopsFormat';
import {
  KpiCard, Section, CoverageBar, CoverageRow,
  EducationalEmpty, RecommendationCard,
} from './components/OptimizationWidgets';

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
  const requestKey = token ? String(selectedAccount ?? "all") : "no-token";
  const [loadedKey, setLoadedKey] = useState<string>("no-token");
  const loadingFinops = !!token && loadedKey !== requestKey;

  useEffect(() => {
    if (!token) return;

    const accountQuery = selectedAccount ? `?aws_account_id=${selectedAccount}` : '';

    Promise.all([
      apiFetch<RIResponse>(`/api/client/finops/ri-coverage${accountQuery}`, {
        token,
        cacheTtlMs: 60 * 1000,
      }),
      apiFetch<SPResponse>(`/api/client/finops/sp-coverage${accountQuery}`, {
        token,
        cacheTtlMs: 60 * 1000,
      }),
    ])
      .then(([d2, d3]) => { setRI(d2); setSP(d3); })
      .catch(e => console.error('FinOps API error', e))
      .finally(() => setLoadedKey(requestKey));
  }, [token, selectedAccount, requestKey]);

  /* ── plan check ── */
  if (!hasFeature(user?.plan_code, 'optimization')) {
    return <div className="p-6 text-red-500">Este módulo requiere plan Professional o Enterprise</div>;
  }

  /* ── skeleton loader ── */
  if (loadingFinops) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-10 animate-pulse">
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
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-10">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-3xl p-5 lg:p-8 shadow-sm">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
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

