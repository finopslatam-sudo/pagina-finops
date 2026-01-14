'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

/* ============================
   TIPOS
============================ */
interface AdminStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  users_by_plan: {
    plan: string;
    count: number;
  }[];
}

/* ============================
   UI HELPERS
============================ */
const accentMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-700',
  indigo: 'bg-indigo-50 text-indigo-700',
};

const KpiCard = ({
  title,
  value,
  accent,
}: {
  title: string;
  value: number | string;
  accent: keyof typeof accentMap;
}) => (
  <div
    className={`border rounded-xl p-6 shadow-md ${accentMap[accent]}`}
  >
    <p className="text-sm opacity-80">{title}</p>
    <p className="text-3xl font-semibold">{value}</p>
  </div>
);

/* ============================
   MAIN COMPONENT
============================ */
export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://api.finopslatam.com';

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setStats)
      .catch(() =>
        setError(
          'No se pudieron cargar las métricas del sistema'
        )
      );
  }, [token, API_URL]);

  /* ============================
     EXPORTS
  ============================ */
  const exportFile = async (
    url: string,
    filename: string,
    errorMsg: string
  ) => {
    if (!token) return;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert(errorMsg);
      return;
    }

    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  /* ============================
     DERIVED DATA
  ============================ */
  const totalUsers = stats
    ? stats.active_users + stats.inactive_users
    : 0;

  const userStatusData = useMemo(() => {
    if (!stats || totalUsers === 0) {
      return [
        { name: 'Activos', value: 0 },
        { name: 'Inactivos', value: 0 },
      ];
    }

    const activePct = Math.round(
      (stats.active_users / totalUsers) * 100
    );

    return [
      { name: 'Activos', value: activePct },
      { name: 'Inactivos', value: 100 - activePct },
    ];
  }, [stats, totalUsers]);

  /* ============================
     STATES
  ============================ */
  if (error)
    return <p className="text-red-500">{error}</p>;

  if (!stats)
    return (
      <p className="text-gray-400">
        Cargando métricas…
      </p>
    );

  /* ============================
     RENDER
  ============================ */
  return (
    <div className="space-y-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-1 rounded-xl">

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="Usuarios totales"
          value={stats.total_users}
          accent="blue"
        />
        <KpiCard
          title="Usuarios activos"
          value={stats.active_users}
          accent="green"
        />
        <KpiCard
          title="Usuarios inactivos"
          value={stats.inactive_users}
          accent="red"
        />
        <KpiCard
          title="Planes activos"
          value={stats.users_by_plan.length}
          accent="indigo"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() =>
            exportFile(
              `${API_URL}/api/v1/reports/admin/pdf`,
              'finopslatam_admin_report.pdf',
              'Error al generar PDF'
            )
          }
          className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
        >
          Exportar PDF
        </button>

        <button
          onClick={() =>
            exportFile(
              `${API_URL}/api/v1/reports/admin/csv`,
              'finopslatam_admin_report.csv',
              'Error al generar CSV'
            )
          }
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-sm hover:bg-gray-200"
        >
          Exportar CSV
        </button>

        <button
          onClick={() =>
            exportFile(
              `${API_URL}/api/v1/reports/admin/xlsx`,
              'finopslatam_admin_report.xlsx',
              'Error al generar Excel'
            )
          }
          className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
        >
          Exportar Excel
        </button>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PIE */}
        <div className="bg-white/80 backdrop-blur border rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Estado de usuarios
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={userStatusData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                label={({ name, value }) =>
                  `${name}: ${value}%`
                }
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip
                formatter={(value) =>
                  typeof value === 'number' ? `${value}%` : value
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="bg-white/80 backdrop-blur border rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Usuarios por plan
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={stats.users_by_plan}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                allowDecimals={false}
              />
              <YAxis
                dataKey="plan"
                type="category"
                width={140}
              />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#6366F1"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
