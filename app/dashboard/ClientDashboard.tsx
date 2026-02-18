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
   UI COMPONENTS
===================================================== */

const InfoCard = ({
  title,
  value,
  accent,
}: {
  title: string;
  value: string | number;
  accent: string;
}) => (
  <div
    className={`bg-linear-to-br ${accent} p-6 rounded-2xl border shadow-xl transition hover:shadow-2xl`}
  >
    <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
      {title}
    </h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function ClientDashboard() {
  const router = useRouter();
  const { user, token, isAuthReady, isStaff } = useAuth();

  const [stats, setStats] = useState<ClientStats | null>(null);
  const [error, setError] = useState<string>('');

  /* =====================================================
     ACCESS CONTROL
  ===================================================== */

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

  /* =====================================================
     FETCH CLIENT STATS (LEGACY)
  ===================================================== */

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

  /* =====================================================
     FINDINGS INTEGRATION
  ===================================================== */

  const { stats: findingsStats } = useFindingsStats();
  const {
    data: dashboardSummary,
    loading: dashboardLoading,
    error: dashboardError,
  } = useDashboardSummary();
  
  const { data: latestFindings } = useFindings({
    page: 1,
  });
  

  /* =====================================================
     STATES
===================================================== */
if (error) {
  return <p className="text-red-500">{error}</p>;
}

if (dashboardError) {
  return <p className="text-red-500">{dashboardError}</p>;
}

if (!dashboardSummary) {
  return (
    <p className="text-gray-400">
      Cargando tu dashboard…
    </p>
  );
}

/* =====================================================
     RENDER
===================================================== */

  return (
    <div className="space-y-12">

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
        value={dashboardSummary?.findings.active ?? 0}
        accent="from-red-50 to-orange-50"
      />

      <InfoCard
        title="Ahorro potencial mensual"
        value={`$${dashboardSummary?.findings.estimated_monthly_savings ?? 0}`}
        accent="from-green-50 to-emerald-50"
      />

      <InfoCard
        title="Cuentas AWS conectadas"
        value={dashboardSummary?.accounts ?? 0}
        accent="from-blue-50 to-indigo-50"
      />

      <InfoCard
        title="Recursos afectados"
        value={dashboardSummary?.resources_affected ?? 0}
        accent="from-purple-50 to-pink-50"
      />

      </div>


      {/* ENTERPRISE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="bg-white p-6 rounded-2xl border shadow-lg">
          <h3 className="text-md font-semibold mb-2">
            Gasto mensual cloud
          </h3>
          <p className="text-gray-400 text-sm">
            Próximamente: consumo real desde AWS Cost Explorer.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-lg">
          <h3 className="text-md font-semibold mb-2">
            Proyección de ahorro
          </h3>
          <p className="text-gray-400 text-sm">
            Basado en findings detectados y recomendaciones FinOps.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-lg">
          <h3 className="text-md font-semibold mb-2">
            Gobernanza & Compliance
          </h3>
          <p className="text-gray-400 text-sm">
            Estado de tagging y políticas de control.
          </p>
        </div>

      </div>

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
