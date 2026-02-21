'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

import { useFindings } from './findings/hooks/useFindings';
import { useFindingsStats } from './findings/hooks/useFindingsStats';
import FindingsTable from './findings/components/FindingsTable';
import { useDashboardSummary } from './hooks/useDashboardSummary';
import { useDashboardCosts } from './hooks/useDashboardCosts';

import DashboardFinancialKPIs from './components/finance/DashboardFinancialKPIs';
import MonthlyCostChart from './components/finance/MonthlyCostChart';
import ServiceBreakdownChart from './components/finance/ServiceBreakdownChart';

/* =====================================================
   TYPES
===================================================== */

interface ClientStats {
  client_id: number;
  user_count: number;
  active_services: number;
  plan: string | null;
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function ClientDashboard() {
  const router = useRouter();
  const { user, token, isAuthReady, isStaff } = useAuth();

  const [stats, setStats] = useState<ClientStats | null>(null);
  const [error, setError] = useState<string>('');

  /* ================= COSTS HOOK ================= */

  const {
    data: costsData,
    loading: costsLoading,
    error: costsError,
  } = useDashboardCosts();

  /* ================= ACCESS CONTROL ================= */

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

  /* ================= FETCH CLIENT STATS ================= */

  useEffect(() => {
    if (!isAuthReady || !user || !token) return;

    apiFetch<ClientStats>('/api/v1/reports/client/stats', {
      token,
    })
      .then((data) => {
        setStats(data);
        setError('');
      })
      .catch((err) => {
        console.error('CLIENT DASHBOARD ERROR:', err);
        setError(
          'No se pudieron cargar tus métricas. Intenta más tarde.'
        );
      });
  }, [isAuthReady, user, token]);

  /* ================= FINDINGS ================= */

  const {
    data: dashboardSummary,
    error: dashboardError,
  } = useDashboardSummary();

  const { data: latestFindings } = useFindings({
    page: 1,
  });

  /* ================= STATES ================= */

  if (error) return <p className="text-red-500">{error}</p>;
  if (dashboardError) return <p className="text-red-500">{dashboardError}</p>;
  if (!dashboardSummary) {
    return <p className="text-gray-400">Cargando tu dashboard…</p>;
  }

  /* ================= RENDER ================= */

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* HEADER */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenido a tu Dashboard FinOps
        </h1>
        <p className="opacity-90">
          Plan actual:{' '}
          <span className="font-semibold">
            {stats?.plan ?? 'Sin plan asignado'}
          </span>
        </p>
      </div>

      {/* CORE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        <InfoCard
          title="Findings activos"
          value={dashboardSummary.findings.active}
          accent="from-red-500 to-red-600"
        />

        <InfoCard
          title="Ahorro potencial mensual"
          value={`$${dashboardSummary.findings.estimated_monthly_savings}`}
          accent="from-green-500 to-emerald-600"
        />

        <InfoCard
          title="Cuentas AWS conectadas"
          value={dashboardSummary.accounts}
          accent="from-blue-500 to-indigo-600"
        />

        <InfoCard
          title="Recursos afectados"
          value={dashboardSummary.resources_affected}
          accent="from-purple-500 to-violet-600"
        />
      </div>

      {/* SERVICIOS EVALUADOS */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Servicios evaluados
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {costsData?.service_breakdown
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 8)
            .map((service) => (
              <div
                key={service.service}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border hover:shadow-md transition"
              >
                <p className="text-sm text-gray-500 truncate">
                  {service.service}
                </p>
                <p className="text-lg font-semibold">
                  ${service.amount.toFixed(2)}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* FINANCIAL SECTION */}
      {costsData && (
        <>
          <DashboardFinancialKPIs
            currentMonthCost={costsData.current_month_cost}
            potentialSavings={costsData.potential_savings}
            savingsPercentage={costsData.savings_percentage}
          />

          <MonthlyCostChart data={costsData.monthly_cost} />

        </>
      )}

      {/* LATEST FINDINGS */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-4">
        <h2 className="text-xl font-semibold">
          Últimos Findings Detectados
        </h2>

        <FindingsTable
          findings={(latestFindings ?? []).slice(0, 5)}
          onResolve={() => {}}
        />

        <div className="text-right">
          <button
            onClick={() => router.push('/dashboard/findings')}
            className="text-blue-600 font-medium hover:underline"
          >
            Ver todos los findings →
          </button>
        </div>
      </div>

    </div>
  );
}

/* =====================================================
   INFO CARD COMPONENT
===================================================== */
function InfoCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${accent}`}
    >
      <h3 className="text-sm uppercase tracking-wide opacity-80 mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}