'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

import { useDashboard } from './hooks/useDashboard';
import { useFindings } from './findings/hooks/useFindings';

import FindingsTable from './findings/components/FindingsTable';

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function ClientDashboard() {
  const router = useRouter();
  const { user, token, isAuthReady, isStaff } = useAuth();

  const { data, loading, error } = useDashboard();
  const { data: latestFindings } = useFindings({ page: 1 });

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

  /* ================= STATES ================= */

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading || !data)
    return <p className="text-gray-400">Cargando dashboard…</p>;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="space-y-12">

      {/* ================= EXECUTIVE SUMMARY ================= */}

      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-8 rounded-3xl shadow-2xl space-y-4">
        <h1 className="text-3xl font-bold">
          Overview
        </h1>

        <p className="opacity-90 text-lg">
          {data.executive_summary?.message ?? 'Análisis en progreso...'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">

          <ExecutiveBadge
            label="Overall Posture"
            value={data.executive_summary?.overall_posture ?? '—'}
          />

          <ExecutiveBadge
            label="Risk Score"
            value={`${data.risk?.risk_score ?? 0}%`}
          />

          <ExecutiveBadge
            label="Governance Score"
            value={`${data.governance?.compliance_percentage ?? 0}%`}
          />

        </div>
      </div>

      {/* ================= CORE METRICS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        <InfoCard
          title="Active Findings"
          value={data.findings.active}
        />

        <InfoCard
          title="Monthly Exposure"
          value={`$${data.executive_summary?.monthly_financial_exposure ?? 0}`}
        />

        <InfoCard
          title="AWS Accounts"
          value={data.accounts}
        />

        <InfoCard
          title="Affected Resources"
          value={data.resources_affected}
        />

      </div>

      {/* ================= LATEST FINDINGS ================= */}

      <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-4">
        <h2 className="text-xl font-semibold">
          Latest Findings
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
            View all findings →
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
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <p className="text-sm text-gray-500 mb-2">
        {title}
      </p>
      <p className="text-3xl font-bold text-gray-800">
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
    <div className="bg-white/20 p-4 rounded-xl">
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}