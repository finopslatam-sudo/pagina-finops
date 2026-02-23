'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

import { useFindings } from './findings/hooks/useFindings';
import FindingsTable from './findings/components/FindingsTable';

import { useDashboardSummary } from './hooks/useDashboardSummary';
import { useDashboardCosts } from './hooks/useDashboardCosts';

import DashboardFinancialKPIs from './components/finance/DashboardFinancialKPIs';
import MonthlyCostChart from './components/finance/MonthlyCostChart';

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function ClientDashboard() {
  const router = useRouter();
  const { user, token, isAuthReady, isStaff } = useAuth();

  const [error, setError] = useState<string>('');

  /* ================= COSTS ================= */

  const {
    data: costsData,
    error: costsError,
  } = useDashboardCosts();

  /* ================= SUMMARY ================= */

  const {
    data: dashboardSummary,
    error: dashboardError,
  } = useDashboardSummary();

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

  /* ================= FINDINGS ================= */

  const { data: latestFindings } = useFindings({ page: 1 });

  /* ================= STATES ================= */

  if (error) return <p className="text-red-500">{error}</p>;
  if (dashboardError) return <p className="text-red-500">{dashboardError}</p>;
  if (costsError) return <p className="text-red-500">{costsError}</p>;
  if (!dashboardSummary) return <p className="text-gray-400">Cargando dashboard…</p>;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="space-y-12">

      {/* ================= EXECUTIVE SUMMARY ================= */}

      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-8 rounded-3xl shadow-2xl space-y-4">
        <h1 className="text-3xl font-bold">
          Executive Overview
        </h1>

        <p className="opacity-90 text-lg">
          {dashboardSummary.executive_summary?.message ?? 'Cargando análisis ejecutivo...'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <ExecutiveBadge
            label="Postura General"
            value={dashboardSummary.executive_summary.overall_posture}
          />
          <ExecutiveBadge
            label="Risk Score"
            value={`${dashboardSummary.risk.risk_score}%`}
          />
          <ExecutiveBadge
            label="Governance"
            value={`${dashboardSummary.governance.compliance_percentage}%`}
          />
        </div>
      </div>

      {/* ================= CORE METRICS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <InfoCard
          title="Findings Activos"
          value={dashboardSummary.findings.active}
          accent="from-red-500 to-red-600"
        />

        <InfoCard
          title="Ahorro Potencial Mensual"
          value={`$${dashboardSummary.findings.estimated_monthly_savings}`}
          accent="from-green-500 to-emerald-600"
        />

        <InfoCard
          title="Cuentas AWS"
          value={dashboardSummary.accounts}
          accent="from-blue-500 to-indigo-600"
        />

        <InfoCard
          title="Recursos Afectados"
          value={dashboardSummary.resources_affected}
          accent="from-purple-500 to-violet-600"
        />
      </div>

      {/* ================= COSTS ================= */}

      {costsData && (
        <>
          <DashboardFinancialKPIs
            currentMonthCost={costsData.current_month_cost}
            potentialSavings={costsData.potential_savings}
            savingsPercentage={costsData.savings_percentage}
          />

          <div className="bg-white p-8 rounded-3xl border shadow-xl">
            <h2 className="text-xl font-semibold mb-6">
              Tendencia de Costos (6 meses)
            </h2>
            <MonthlyCostChart data={costsData.monthly_cost} />
          </div>
        </>
      )}

      {/* ================= LATEST FINDINGS ================= */}

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
   COMPONENTS
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
    <div className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${accent}`}>
      <h3 className="text-sm uppercase tracking-wide opacity-80 mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold">{value}</p>
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
    <div className="bg-white/20 p-4 rounded-xl">
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}