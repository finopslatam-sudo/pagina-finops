'use client';

import { useEffect, useState, useCallback } from 'react';
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
  Legend,
} from 'recharts';

// ============================
// TIPOS
// ============================
interface UsersByPlan {
  plan: string;
  count: number;
}

interface AdminStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  users_by_plan: UsersByPlan[];
}

// ============================
// HELPERS UI
// ============================
const colorMap = {
  gray: 'text-gray-600',
  green: 'text-green-600',
  red: 'text-red-600',
  indigo: 'text-indigo-600',
} as const;

const KpiCard = ({
  title,
  value,
  color = 'gray',
}: {
  title: string;
  value: number | string;
  color?: keyof typeof colorMap;
}) => (
  <div className="bg-white border rounded-xl p-6 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-3xl font-bold ${colorMap[color]}`}>
      {value}
    </p>
  </div>
);

// ============================
// ADMIN DASHBOARD
// ============================
export default function AdminDashboard() {
  const { token } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<'pdf' | 'csv' | null>(null);
  const [error, setError] = useState<string>('');

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

  // ============================
  // FETCH STATS
  // ============================
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError('');

    fetch(`${API_URL}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setStats({
          ...data,
          users_by_plan: data.users_by_plan ?? [],
        });
      })
      .catch(() => {
        setError('No se pudieron cargar las métricas del sistema');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, API_URL]);

  // ============================
  // EXPORT HELPERS
  // ============================
  const downloadFile = useCallback(
    async (endpoint: string, filename: string, type: 'pdf' | 'csv') => {
      if (!token) return;

      try {
        setExporting(type);

        const res = await fetch(`${API_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
      } catch {
        alert(`Error al generar ${type.toUpperCase()}`);
      } finally {
        setExporting(null);
      }
    },
    [API_URL, token]
  );

  const exportPDF = () =>
    downloadFile(
      '/api/v1/reports/admin/pdf',
      'finopslatam_admin_report.pdf',
      'pdf'
    );

  const exportCSV = () =>
    downloadFile(
      '/api/v1/reports/admin/csv',
      'finopslatam_admin_report.csv',
      'csv'
    );

  // ============================
  // UI STATES
  // ============================
  if (loading) {
    return (
      <p className="text-gray-500 animate-pulse">
        Cargando métricas del sistema…
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!stats) return null;

  const userStatusData = [
    { name: 'Activos', value: stats.active_users },
    { name: 'Inactivos', value: stats.inactive_users },
  ];

  const planColors = [
    '#6366F1',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
  ];

  // ============================
  // RENDER
  // ============================
  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Usuarios totales" value={stats.total_users} />
        <KpiCard title="Usuarios activos" value={stats.active_users} color="green" />
        <KpiCard title="Usuarios inactivos" value={stats.inactive_users} color="red" />
        <KpiCard
          title="Planes activos"
          value={stats.users_by_plan.length}
          color="indigo"
        />
      </div>

      {/* EXPORTACIONES */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={exportPDF}
          disabled={exporting !== null}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {exporting === 'pdf' ? 'Generando PDF…' : '📄 Exportar PDF'}
        </button>

        <button
          onClick={exportCSV}
          disabled={exporting !== null}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {exporting === 'csv' ? 'Generando CSV…' : '📊 Exportar CSV'}
        </button>
      </div>

      {/* GRÁFICOS */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usuarios activos vs inactivos */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">
            Usuarios activos vs inactivos
          </h3>

          {stats.total_users > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={userStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm">
              No hay datos para mostrar
            </p>
          )}
        </div>

        {/* Usuarios por plan */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">
            Usuarios por plan
          </h3>

          {stats.users_by_plan.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.users_by_plan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count">
                  {stats.users_by_plan.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={planColors[index % planColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm">
              No hay usuarios asociados a planes
            </p>
          )}
        </div>
      </div>
    </>
  );
}
