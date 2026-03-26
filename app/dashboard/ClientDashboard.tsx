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

          {/* 4. SERVICIOS PRIORITARIOS */}
          <PriorityServices services={data.priority_services} router={router} />

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
   PRIORITY SERVICES — servicios ordenados por riesgo
===================================================== */

interface PriorityService {
  service: string;
  risk_score: number;
  risk_level: string;
  high: number;
  medium: number;
  low: number;
}

const RISK_CARD: Record<string, string> = {
  CRITICAL: 'bg-red-50 border-red-200',
  HIGH:     'bg-orange-50 border-orange-200',
  MODERATE: 'bg-amber-50 border-amber-200',
  LOW:      'bg-emerald-50 border-emerald-200',
};

const RISK_BADGE: Record<string, string> = {
  CRITICAL: 'text-red-600 bg-red-100',
  HIGH:     'text-orange-600 bg-orange-100',
  MODERATE: 'text-amber-600 bg-amber-100',
  LOW:      'text-emerald-600 bg-emerald-100',
};

function PriorityServices({
  services,
  router,
}: {
  services: Record<string, unknown>[];
  router: ReturnType<typeof useRouter>;
}) {
  if (!services?.length) return null;

  const list = services.slice(0, 6) as unknown as PriorityService[];

  return (
    <div className="bg-white border border-blue-200 p-8 lg:p-10 rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold text-slate-800">Servicios Prioritarios</h2>
        <p className="text-sm text-slate-500">Ordenados por nivel de riesgo</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {list.map((s) => (
          <div
            key={s.service}
            onClick={() => router.push(`/dashboard/findings?service=${s.service}`)}
            className={`border p-5 rounded-2xl hover:shadow-md transition cursor-pointer ${RISK_CARD[s.risk_level] ?? 'bg-sky-50 border-sky-200'}`}
          >
            <div className="flex items-start justify-between mb-3 gap-2">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{s.service}</p>
              <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full shrink-0 ${RISK_BADGE[s.risk_level] ?? 'text-sky-600 bg-sky-100'}`}>
                {s.risk_level}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 tabular-nums">{s.risk_score}%</p>
            <p className="text-xs text-slate-500 mt-0.5">risk score</p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs font-medium">
              {s.high   > 0 && <span className="text-red-500">{s.high} alto</span>}
              {s.medium > 0 && <span className="text-amber-500">{s.medium} medio</span>}
              {s.low    > 0 && <span className="text-slate-400">{s.low} bajo</span>}
            </div>
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
