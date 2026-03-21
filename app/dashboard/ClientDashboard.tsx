'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

import { useFindings } from './findings/hooks/useFindings';
import FindingsTable from './findings/components/FindingsTable';

import { useDashboard } from './hooks/useDashboard';
import { useInventory } from './hooks/useInventory';

import MonthlyCostChart from './components/finance/MonthlyCostChart';

import AwsAccountSelector from "@/app/dashboard/components/AwsAccountSelector";

import { formatUSD, formatPercentage } from "@/app/lib/finopsFormat";

export default function ClientDashboard() {
  const router = useRouter();
  const { user, token, isAuthReady, isStaff } = useAuth();

  const { data, loading, error } = useDashboard();
  const dashboard = data;
  const { data: latestFindings } = useFindings({ page: 1 });
  const { data: inventoryData } = useInventory();

  useEffect(() => {
    if (!isAuthReady) return;

    if (!user || !token) {
      router.replace('/');
      return;
    }

    if (isStaff) {
      router.replace('/dashboard');
      return;
    }
  }, [isAuthReady, user, token, isStaff, router]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading || !data) return <DashboardSkeleton />;


  /* =====================================================
     Construcción robusta de servicios escaneados
  ===================================================== */

  const servicesMap: Record<string, number> = {};

  if (inventoryData?.summary) {
    Object.assign(servicesMap, inventoryData.summary);
  } else if (inventoryData?.resources) {
    inventoryData.resources.forEach((r: any) => {
      servicesMap[r.resource_type] =
        (servicesMap[r.resource_type] || 0) + 1;
    });
  }

  return (
    <div className="space-y-16">

      {/* =====================================================
         1️⃣ EXECUTIVE OVERVIEW
      ===================================================== */}

      <div className="bg-slate-200 border border-blue-300 p-12 rounded-3xl shadow-sm space-y-8">

        <h1 className="text-4xl font-semibold text-slate-800">
          Executive Overview
        </h1>

        <p className="text-lg text-slate-700 leading-relaxed">
          {data.executive_summary?.message}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">

          <ExecutiveBadge
            label="Overall Posture"
            value={data.executive_summary?.overall_posture ?? '—'}
          />

          <ExecutiveBadge
            label="Risk Score"
            value={`${data.risk?.risk_score ?? 0}%`}
          />

          <ExecutiveBadge
            label="Governance"
            value={`${data.governance?.compliance_percentage ?? 0}%`}
          />

        </div>
      </div>

      {/* ================= ACCOUNT FILTER ================= */}
      <div className="flex items-center gap-4 pt-2">
        <AwsAccountSelector />
      </div>

      {/* =====================================================
         2️⃣ FINANCIAL SNAPSHOT — 9 CARDS (3 FILAS × 3)
      ===================================================== */}

      {(() => {
        const dl = data.cost.date_labels ?? {};
        const fmt = (iso: string) => {
          if (!iso) return iso;
          const [y, m, d] = iso.split('-');
          const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
          return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
        };

        return (
          <div className="space-y-6">

            {/* FILA 1 — GASTOS MENSUALES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <PastelCard
                title="Gasto Mes Anterior"
                value={formatUSD(data.cost.previous_month_cost ?? data.cost.current_month_cost)}
                variant="blue"
                tooltip={
                  dl.previous_month_start && dl.previous_month_end
                    ? `Período de facturación: ${fmt(dl.previous_month_start)} al ${fmt(dl.previous_month_end)}`
                    : 'Gasto total del mes cerrado anterior.'
                }
              />

              <PastelCard
                title="Gasto del Mes Actual"
                value={formatUSD(data.cost.current_month_partial ?? 0)}
                variant="sky"
                tooltip={
                  dl.current_month_end
                    ? `Gastos acumulados hasta el ${fmt(dl.current_month_end)}`
                    : 'Gastos acumulados hasta el día de hoy.'
                }
              />

              <PastelCard
                title="Ahorro Mensual"
                value={formatUSD(data.cost.potential_savings)}
                variant="green"
                tooltip={
                  dl.previous_month_start && dl.previous_month_end
                    ? `Ahorro potencial estimado vs el mes anterior (${fmt(dl.previous_month_start)} – ${fmt(dl.previous_month_end)})`
                    : 'Ahorro potencial estimado comparado con el mes anterior.'
                }
              />

            </div>

            {/* FILA 2 — GASTOS ANUALES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <PastelCard
                title="Gasto Año Anterior"
                value={formatUSD(data.cost.previous_year_cost ?? 0)}
                variant="indigo"
                tooltip={
                  dl.previous_year_start && dl.previous_year_end
                    ? `Período: ${fmt(dl.previous_year_start)} al ${fmt(dl.previous_year_end)}`
                    : 'Gasto total del año anterior.'
                }
              />

              <PastelCard
                title="Gasto Año Actual"
                value={formatUSD(data.cost.current_year_ytd ?? 0)}
                variant="purple"
                tooltip={
                  dl.current_year_start && dl.current_year_end
                    ? `Suma de gastos del ${fmt(dl.current_year_start)} al ${fmt(dl.current_year_end)}`
                    : 'Gastos acumulados del año en curso hasta hoy.'
                }
              />

              <PastelCard
                title="Ahorro Estimado Anual"
                value={formatUSD(data.cost.annual_estimated_savings ?? 0)}
                variant="green"
                tooltip={
                  dl.current_year_end
                    ? `Proyección de ahorro anualizada al ${fmt(dl.current_year_end)}, basada en hallazgos activos.`
                    : 'Proyección de ahorro anualizada basada en hallazgos activos.'
                }
              />

            </div>

            {/* FILA 3 — PORCENTAJES DE AHORRO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <PastelCard
                title="Porcentaje de Ahorro Mensual"
                value={formatPercentage(data.cost.monthly_savings_percentage ?? data.cost.savings_percentage)}
                variant="amber"
              />

              <PastelCard
                title="Porcentaje de Ahorro Anual"
                value={formatPercentage(data.cost.annual_savings_percentage ?? 0)}
                variant="rose"
              />

              <PastelCard
                title="Porcentaje de Ahorro Actual"
                value={formatPercentage(data.cost.current_month_savings_percentage ?? 0)}
                variant="sky"
              />

            </div>

          </div>
        );
      })()}

      {/* =====================================================
         3️⃣ OPERATIONAL METRICS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8">

      <PastelCard
        title="Oportunidades de ahorro"
        value={data.findings.financial_opportunities ?? 0}
        variant="green"
      />

      <PastelCard
        title="Revisiones recomendadas"
        value={data.findings.review_recommendations ?? 0}
        variant="amber"
      />

      <PastelCard
        title="Recomendaciones Activas"
        value={data.findings.active}
        variant="rose"
      />

      <PastelCard
        title="Cuentas AWS"
        value={data.accounts}
        variant="indigo"
      />

      <PastelCard
        title="Recursos Afectados"
        value={data.resources_affected}
        variant="sky"
      />

      </div>

      {/* =====================================================
        4️⃣ SERVICIOS ESCANEADOS
      ===================================================== */}

      <div className="bg-white border border-blue-200 p-10 rounded-3xl shadow-sm space-y-8">

        <h2 className="text-2xl font-semibold text-slate-800">
          Servicios Escaneados
        </h2>

        {!dashboard || !dashboard.services_scanned || dashboard.services_scanned.length === 0 ? (
          <p className="text-slate-500">
            No se detectaron servicios activos.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dashboard.services_scanned
              .sort((a: any, b: any) => b.total_resources - a.total_resources)
              .map((service: any) => (
                <div
                  key={service.service}
                  onClick={() =>
                    router.push(`/dashboard/findings?service=${service.service}`)
                  }
                  className="bg-sky-50 border border-sky-200 p-6 rounded-2xl hover:bg-sky-100 transition cursor-pointer"
                >
                  <p className="text-sm uppercase text-sky-700">
                    {service.service}
                  </p>

                  <p className="text-2xl font-semibold text-sky-900 mt-2">
                    {service.total_resources}
                  </p>
                </div>
              ))}
          </div>
        )}

      </div>

      {/* =====================================================
         5️⃣ TENDENCIA DE COSTOS
      ===================================================== */}

      <div className="bg-white border border-blue-200 p-10 rounded-3xl shadow-sm">

        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Tendencia de Costos (6 meses)
        </h2>

        <MonthlyCostChart
          data={Array.isArray(data.cost.monthly_cost)
            ? data.cost.monthly_cost
            : []}
        />
      </div>

      {/* =====================================================
         6️⃣ ÚLTIMOS FINDINGS
      ===================================================== */}

      <div className="bg-white border border-blue-200 p-10 rounded-3xl shadow-sm space-y-6">

        <h2 className="text-2xl font-semibold text-slate-800">
          Últimos Findings Detectados
        </h2>

        <FindingsTable
          findings={(latestFindings ?? []).slice(0, 5)}
          onResolve={() => {}}
        />

      </div>

    </div>
  );
}

/* =====================================================
   SKELETON LOADER
===================================================== */

function DashboardSkeleton() {
  return (
    <div className="space-y-16 animate-pulse">

      {/* Executive Overview */}
      <div className="bg-slate-100 border border-slate-200 p-12 rounded-3xl space-y-6">
        <div className="h-9 w-64 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full max-w-2xl bg-slate-200 rounded-lg" />
        <div className="h-4 w-3/4 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-3 gap-6 pt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl h-16" />
          ))}
        </div>
      </div>

      {/* Account selector */}
      <div className="h-10 w-48 bg-slate-100 rounded-xl" />

      {/* KPI rows — 3×3 */}
      {[...Array(3)].map((_, row) => (
        <div key={row} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, col) => (
            <div key={col} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="h-3 w-40 bg-slate-200 rounded" />
              <div className="h-8 w-32 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      ))}

      {/* Operational metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-7 w-12 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-white border border-slate-200 p-10 rounded-3xl">
        <div className="h-6 w-48 bg-slate-200 rounded mb-6" />
        <div className="h-48 bg-slate-100 rounded-xl" />
      </div>

    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function PastelCard({
  title,
  value,
  variant,
  tooltip,
}: {
  title: string;
  value: string | number;
  variant:
    | 'blue'
    | 'green'
    | 'amber'
    | 'rose'
    | 'indigo'
    | 'sky'
    | 'purple';
  tooltip?: string;
}) {

  const styles = {
    blue: "bg-blue-50",
    green: "bg-emerald-50",
    amber: "bg-amber-50",
    rose: "bg-rose-50",
    indigo: "bg-indigo-50",
    sky: "bg-sky-50",
    purple: "bg-purple-50",
  };

  return (
    <div
      className={`p-8 rounded-2xl border border-blue-300 shadow-sm ${styles[variant]}`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm uppercase text-slate-600">
          {title}
        </p>

        {tooltip ? (
          <div className="group relative shrink-0">
            <button
              type="button"
              aria-label={`Informacion sobre ${title}`}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-white"
            >
              i
            </button>

            <div className="pointer-events-none absolute right-0 top-8 z-10 w-64 rounded-xl border border-slate-200 bg-white p-3 text-xs normal-case text-slate-600 opacity-0 shadow-lg transition duration-200 group-hover:opacity-100">
              {tooltip}
            </div>
          </div>
        ) : null}
      </div>

      <p className="text-3xl font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function ExecutiveBadge({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border border-blue-200 p-5 rounded-xl">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}
