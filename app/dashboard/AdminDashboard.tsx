'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

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

/* =====================================================
   TYPES
===================================================== */

/**
 * Contrato EXACTO con /api/admin/stats
 * NO agregar campos que el backend no entregue
 */
interface AdminStats {
  companies: {
    total: number;
    inactive: number;
  };
  users: {
    clients: number;
    admins: number;
    root: number;
    inactive: number;
  };
  plans: {
    in_use: number;
    usage: {
      plan: string;
      count: number;
    }[];
  };
}

/* =====================================================
   UI HELPERS
===================================================== */
const planShortLabelMap: Record<string, string> = {
  FINOPS_FOUNDATION: 'F. Foundation',
  FINOPS_PROFESSIONAL: 'F.Professional',
  FINOPS_ENTERPRISE: 'F. Enterprise',
};

const planLabelMap: Record<string, string> = {
  FINOPS_FOUNDATION: 'FinOps Foundation',
  FINOPS_PROFESSIONAL: 'FinOps Professional',
  FINOPS_ENTERPRISE: 'FinOps Enterprise',
};

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
  <div className={`border rounded-xl p-6 shadow-md ${accentMap[accent]}`}>
    <p className="text-sm opacity-80">{title}</p>
    <p className="text-3xl font-semibold">{value}</p>
  </div>
);

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function AdminDashboard() {
  const { user, token, isAuthReady } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string>('');

  /* =====================================================
     FETCH ADMIN STATS
  ===================================================== */

  useEffect(() => {
    if (!isAuthReady || !user || !token) return;

    const role = user.global_role;

    if (!role || !['root', 'admin', 'support'].includes(role)) {
      setError('No tienes permisos para ver esta sección');
      return;
    }

    apiFetch<AdminStats>('/api/admin/stats', { token })
      .then((data) => {
        setStats(data);
        setError('');
      })
      .catch((err) => {
        console.error('ADMIN STATS ERROR:', err);
        setError('No se pudieron cargar las métricas del sistema');
      });
  }, [isAuthReady, user, token]);

  /* =====================================================
     DERIVED DATA (VISUAL)
  ===================================================== */
  const plansChartData = useMemo(() => {
    if (!stats) return [];
  
    return stats.plans.usage.map((item) => ({
      plan: planShortLabelMap[item.plan] ?? item.plan,
      fullPlan: item.plan,
      count: item.count,
    }));
  }, [stats]);
  
  const usersPieData = useMemo(() => {
    if (!stats) return [];

    return [
      { name: 'Usuarios clientes', value: stats.users.clients },
      { name: 'Admins', value: stats.users.admins },
      { name: 'Root', value: stats.users.root },
    ];
  }, [stats]);

  const totalUsers = useMemo(() => {
    if (!stats) return 0;

    return (
      stats.users.clients +
      stats.users.admins +
      stats.users.root
    );
  }, [stats]);

  /* =====================================================
     STATES
===================================================== */

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!stats) {
    return <p className="text-gray-400">Cargando métricas…</p>;
  }

  /* =====================================================
     RENDER
===================================================== */

  return (
    <div className="space-y-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-1 rounded-xl">

      {/* =========================
         KPIs
      ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="Empresas totales"
          value={stats.companies.total}
          accent="blue"
        />
        <KpiCard
          title="Empresas inactivas"
          value={stats.companies.inactive}
          accent="red"
        />
        <KpiCard
          title="Usuarios totales"
          value={totalUsers}
          accent="green"
        />
        <KpiCard
          title="Planes activos"
          value={stats.plans.in_use}
          accent="indigo"
        />
      </div>

      {/* =========================
         GRÁFICOS
      ========================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* -------- PIE CHART -------- */}
        <div className="bg-white/80 border rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Distribución de usuarios por rol
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={usersPieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
              >
                <Cell fill="#22c55e" />
                <Cell fill="#3b82f6" />
                <Cell fill="#6366f1" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* -------- BAR CHART -------- */}
        <div className="bg-white/80 border rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Uso de planes por empresa
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={plansChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plan" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value, _name, props) => [
                  value,
                  props.payload.fullPlan,
                ]}
              />
              <Bar
                dataKey="count"
                fill="#6366F1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
