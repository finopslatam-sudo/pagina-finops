'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

import { useFindings } from './findings/hooks/useFindings';
import FindingsTable from './findings/components/FindingsTable';

import { useDashboard } from './hooks/useDashboard';
import { useInventory } from './hooks/useInventory';

import MonthlyCostChart from './components/finance/MonthlyCostChart';

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function ClientDashboard() {
  const router = useRouter();
  const { user, token, isAuthReady, isStaff } = useAuth();

  const { data, loading, error } = useDashboard();
  const { data: latestFindings } = useFindings({ page: 1 });
  const { data: inventoryData, loading: inventoryLoading } = useInventory();

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

  return (
    <div className="space-y-14">

      {/* =====================================================
         1️⃣ EXECUTIVE OVERVIEW
      ===================================================== */}

      <div className="bg-blue-100 border border-blue-200 p-10 rounded-3xl shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-blue-900">
          Executive Overview
        </h1>

        <p className="text-blue-800 max-w-4xl">
          {data.executive_summary?.message}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <ExecutiveBadge label="Overall Posture" value={data.executive_summary?.overall_posture ?? '—'} />
          <ExecutiveBadge label="Risk Score" value={`${data.risk?.risk_score ?? 0}%`} />
          <ExecutiveBadge label="Governance" value={`${data.governance?.compliance_percentage ?? 0}%`} />
        </div>
      </div>

      {/* =====================================================
         2️⃣ FINANCIAL SNAPSHOT
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BlueCard title="Gasto Actual (Mes)" value={`$${data.cost.current_month_cost}`} />
        <BlueCard title="Ahorro Potencial" value={`$${data.cost.potential_savings}`} />
        <BlueCard title="Potencial Optimización" value={`${data.cost.savings_percentage}%`} />
      </div>

      {/* =====================================================
         3️⃣ OPERATIONAL METRICS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BlueCard title="Findings Activos" value={data.findings.active} />
        <BlueCard title="Cuentas AWS" value={data.accounts} />
        <BlueCard title="Recursos Afectados" value={data.resources_affected} />
      </div>

      {/* =====================================================
         4️⃣ SERVICIOS ESCANEADOS
      ===================================================== */}

      <div className="bg-white border border-blue-200 p-10 rounded-3xl shadow-sm space-y-6">
        <h2 className="text-2xl font-semibold text-blue-900">
          Servicios Escaneados
        </h2>

        {inventoryLoading && (
          <p className="text-blue-600">Cargando inventario...</p>
        )}

        {!inventoryLoading && inventoryData?.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(inventoryData.summary)
              .sort((a, b) => b[1] - a[1])
              .map(([service, count]) => (
                <div
                  key={service}
                  onClick={() =>
                    router.push(`/dashboard/findings?service=${service}`)
                  }
                  className="bg-blue-50 border border-blue-200 p-6 rounded-2xl hover:bg-blue-100 transition cursor-pointer"
                >
                  <p className="text-sm uppercase text-blue-700">
                    {service}
                  </p>
                  <p className="text-2xl font-bold text-blue-900 mt-2">
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
        <h2 className="text-2xl font-semibold text-blue-900 mb-6">
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
        <h2 className="text-2xl font-semibold text-blue-900">
          Últimos Findings Detectados
        </h2>

        <FindingsTable
          findings={(latestFindings ?? []).slice(0, 5)}
          onResolve={() => {}}
        />

        <div className="text-right">
          <button
            onClick={() => router.push('/dashboard/findings')}
            className="text-blue-700 font-medium hover:underline"
          >
            Ver todos los findings →
          </button>
        </div>
      </div>

    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function BlueCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl shadow-sm">
      <p className="text-sm uppercase text-blue-700 mb-2">
        {title}
      </p>
      <p className="text-3xl font-semibold text-blue-900">
        {value}
      </p>
    </div>
  );
}

function ExecutiveBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-blue-200 p-4 rounded-xl">
      <p className="text-sm text-blue-800">{label}</p>
      <p className="text-xl font-semibold text-blue-900">{value}</p>
    </div>
  );
}