'use client';

import { useEffect, useState } from 'react';
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
interface AdminStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  users_by_plan: {
    plan: string;
    count: number;
  }[];
}

// ============================
// HELPERS UI
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

// ============================
// ADMIN DASHBOARD
// ============================
export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string>('');

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar estadísticas');
        return res.json();
      })
      .then(setStats)
      .catch(() => {
        setError('No se pudieron cargar las métricas del sistema');
      });
  }, [token]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!stats) {
    return <p className="text-gray-500">Cargando métricas...</p>;
  }

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

      {/* GRÁFICOS */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Usuarios activos vs inactivos */}
        <div className="bg-white border rounded-xl p-6 shadow">
          <h3 className="font-semibold mb-4">
            Usuarios activos vs inactivos
          </h3>

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
        </div>

        {/* Usuarios por plan */}
        <div className="bg-white border rounded-xl p-6 shadow">
          <h3 className="font-semibold mb-4">
            Usuarios por plan
          </h3>

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
        </div>

      </div>
    </>
  );
}
