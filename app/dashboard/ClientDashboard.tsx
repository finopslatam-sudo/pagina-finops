'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

import { useFindings } from './findings/hooks/useFindings';
import FindingsTable from './findings/components/FindingsTable';

import { useDashboard } from './hooks/useDashboard';
import { useInventory } from './hooks/useInventory';

import MonthlyCostChart from './components/finance/MonthlyCostChart';

export default function ClientDashboard() {
  const router = useRouter();
  const { user, token, isAuthReady, isStaff } = useAuth();

  const { data, loading, error } = useDashboard();
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
  if (loading || !data)
    return <p className="text-gray-400">Cargando dashboard…</p>;

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

      <div className="bg-slate-100 border border-blue-200 p-12 rounded-3xl shadow-sm space-y-8">

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

      {/* =====================================================
         2️⃣ FINANCIAL SNAPSHOT
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      <PastelCard
        title="Gasto Actual (Mes)"
        value={`$${data.cost.current_month_cost}`}
        variant="blue"
      />

      <PastelCard
        title="Ahorro Potencial"
        value={`$${data.cost.potential_savings}`}
        variant="green"
      />

      <PastelCard
        title="Potencial Optimización"
        value={`${data.cost.savings_percentage}%`}
        variant="amber"
      />

      </div>

      {/* =====================================================
         3️⃣ OPERATIONAL METRICS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      <PastelCard
        title="Findings Activos"
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

        {Object.keys(servicesMap).length === 0 ? (
          <p className="text-slate-500">
            No se detectaron servicios activos.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(servicesMap)
              .sort((a, b) => b[1] - a[1])
              .map(([service, count]) => (
                <div
                  key={service}
                  onClick={() =>
                    router.push(`/dashboard/findings?service=${service}`)
                  }
                  className="bg-sky-50 border border-sky-200 p-6 rounded-2xl hover:bg-sky-100 transition cursor-pointer"
                >
                  <p className="text-sm uppercase text-sky-700">
                    {service}
                  </p>
                  <p className="text-2xl font-semibold text-sky-900 mt-2">
                    {count}
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
   COMPONENTS
===================================================== */

function PastelCard({
  title,
  value,
  variant,
}: {
  title: string;
  value: string | number;
  variant:
    | 'blue'
    | 'green'
    | 'amber'
    | 'rose'
    | 'indigo'
    | 'sky';
}) {

  const styles = {
    blue: "bg-blue-50",
    green: "bg-emerald-50",
    amber: "bg-amber-50",
    rose: "bg-rose-50",
    indigo: "bg-indigo-50",
    sky: "bg-sky-50",
  };

  return (
    <div
      className={`p-8 rounded-2xl border border-blue-300 shadow-sm ${styles[variant]}`}
    >
      <p className="text-sm uppercase mb-2 text-slate-600">
        {title}
      </p>
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