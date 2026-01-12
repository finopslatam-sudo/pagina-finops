'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

// ============================
// HELPERS UI (ADMIN)
// ============================
const colorMap: Record<string, string> = {
  gray: 'text-gray-600',
  green: 'text-green-600',
  red: 'text-red-600',
  indigo: 'text-indigo-600',
};

const KpiCard = ({
  title,
  value,
  color = 'gray',
}: {
  title: string;
  value: number | string;
  color?: keyof typeof colorMap;
}) => (
  <div className="bg-white border rounded-xl p-6 shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-3xl font-bold ${colorMap[color]}`}>
      {value}
    </p>
  </div>
);

const ChartPlaceholder = ({ title }: { title: string }) => (
  <div className="bg-white border rounded-xl p-6 shadow">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="h-64 flex items-center justify-center text-gray-400">
      Gráfico próximamente
    </div>
  </div>
);

// ============================
// ADMIN DASHBOARD
// ============================
export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, [token]);

  if (!stats) {
    return <p className="text-gray-500">Cargando métricas...</p>;
  }

  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Usuarios totales" value={stats.total_users} />
        <KpiCard
          title="Usuarios activos"
          value={stats.active_users}
          color="green"
        />
        <KpiCard
          title="Usuarios inactivos"
          value={stats.inactive_users}
          color="red"
        />
        <KpiCard
          title="Planes activos"
          value={stats.users_by_plan.length}
          color="indigo"
        />
      </div>

      {/* GRÁFICOS */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartPlaceholder title="Usuarios activos vs inactivos" />
        <ChartPlaceholder title="Usuarios por plan" />
      </div>
    </>
  );
}
