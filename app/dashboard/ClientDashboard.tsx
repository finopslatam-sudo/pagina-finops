'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

import { useDashboard } from './hooks/useDashboard';
import { useFindings } from './findings/hooks/useFindings';

import ExecutiveOverview from './components/ExecutiveOverview';
import DashboardKPIs from './components/DashboardKPIs';
import MonthlyCostChart from './components/finance/MonthlyCostChart';
import FindingsTable from './findings/components/FindingsTable';
import AwsAccountSelector from './components/AwsAccountSelector';

/* =====================================================
   CLIENT DASHBOARD
   Carga progresiva: Executive Overview aparece
   inmediatamente; el resto carga cuando la API
   responde.
===================================================== */

export default function ClientDashboard() {
  const router = useRouter();
  const { user, token, isAuthReady, isStaff } = useAuth();

  const { data, loading, error } = useDashboard();
  const { data: latestFindings } = useFindings({ page: 1, perPage: 5 });

  useEffect(() => {
    if (!isAuthReady) return;
    if (!user || !token) { router.replace('/'); return; }
    if (isStaff)         { router.replace('/dashboard'); return; }
  }, [isAuthReady, user, token, isStaff, router]);

  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="space-y-12">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         1. EXECUTIVE OVERVIEW — visible inmediatamente
            muestra skeleton interno mientras carga
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <ExecutiveOverview data={data} loading={loading} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         El resto aparece una vez que la API responde
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {loading || !data ? (
        <BelowFoldSkeleton />
      ) : (
        <>
          {/* 2. SELECTOR DE CUENTA */}
          <div className="flex items-center gap-4">
            <AwsAccountSelector />
          </div>

          {/* 3. KPIs (Financial Snapshot + Operational Metrics) */}
          <DashboardKPIs data={data} />

          {/* 4. SERVICIOS ESCANEADOS */}
          <ServicesScanned data={data} router={router} />

          {/* 5. TENDENCIA DE COSTOS */}
          <div className="bg-white border border-blue-200 p-8 lg:p-10 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Tendencia de Costos (6 meses)
            </h2>
            <MonthlyCostChart
              data={Array.isArray(data.cost.monthly_cost) ? data.cost.monthly_cost : []}
            />
          </div>

          {/* 6. ÚLTIMOS FINDINGS */}
          <div className="bg-white border border-blue-200 p-8 lg:p-10 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800">
              Últimos Findings Detectados
            </h2>
            <FindingsTable
              findings={(latestFindings ?? []).slice(0, 5)}
              onResolve={() => {}}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* =====================================================
   SERVICIOS SCANNED — sección inline pequeña
===================================================== */

function ServicesScanned({
  data,
  router,
}: {
  data: NonNullable<ReturnType<typeof useDashboard>['data']>;
  router: ReturnType<typeof useRouter>;
}) {
  if (!data.services_scanned?.length) return null;

  return (
    <div className="bg-white border border-blue-200 p-8 lg:p-10 rounded-3xl shadow-sm space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800">Servicios Escaneados</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...data.services_scanned]
          .sort((a, b) => b.total_resources - a.total_resources)
          .map((s) => (
            <div
              key={s.service}
              onClick={() => router.push(`/dashboard/findings?service=${s.service}`)}
              className="bg-sky-50 border border-sky-200 p-6 rounded-2xl hover:bg-sky-100 transition cursor-pointer"
            >
              <p className="text-sm uppercase text-sky-700">{s.service}</p>
              <p className="text-2xl font-semibold text-sky-900 mt-2">{s.total_resources}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

/* =====================================================
   SKELETON — solo para la parte inferior
   (Executive Overview tiene su propio skeleton interno)
===================================================== */

function BelowFoldSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">

      {/* Selector placeholder */}
      <div className="h-10 w-48 bg-slate-100 rounded-xl" />

      {/* KPI rows */}
      {[...Array(2)].map((_, row) => (
        <div key={row} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, col) => (
            <div key={col} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="h-3 w-40 bg-slate-200 rounded" />
              <div className="h-8 w-32 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      ))}

      {/* Operational metrics row */}
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
