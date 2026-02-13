'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

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
    className={`bg-gradient-to-br ${accent} p-6 rounded-2xl border shadow-lg`}
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
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
     FETCH CLIENT STATS
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
     STATES
===================================================== */

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // 🔒 ENTERPRISE SAFE CHECK
  if (
    !stats ||
    typeof stats !== 'object' ||
    typeof stats.user_count !== 'number' ||
    typeof stats.active_services !== 'number'
  ) {
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
    <div className="space-y-10">

      <div>
        <h1 className="text-2xl font-semibold">
          Bienvenido a tu Dashboard FinOps
        </h1>
        <p className="text-gray-500">
          Plan actual:{' '}
          <span className="font-medium">
            {typeof stats.plan === 'string'
              ? stats.plan
              : 'Sin plan asignado'}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <InfoCard
          title="Usuarios asociados"
          value={stats.user_count}
          accent="from-blue-50 to-indigo-50"
        />

        <InfoCard
          title="Servicios cloud activos"
          value={stats.active_services}
          accent="from-green-50 to-emerald-50"
        />

        <InfoCard
          title="Estado del plan"
          value={
            typeof stats.plan === 'string'
              ? stats.plan
              : 'No asignado'
          }
          accent="from-purple-50 to-pink-50"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-md font-semibold mb-2">
            Gasto mensual cloud
          </h3>
          <p className="text-gray-400 text-sm">
            Próximamente: consumo real desde auditoría AWS.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-md font-semibold mb-2">
            Ahorro potencial
          </h3>
          <p className="text-gray-400 text-sm">
            Próximamente: recomendaciones FinOps automáticas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-md font-semibold mb-2">
            Proyecciones FinOps
          </h3>
          <p className="text-gray-400 text-sm">
            Próximamente: forecast y control presupuestario.
          </p>
        </div>

      </div>
    </div>
  );
}
