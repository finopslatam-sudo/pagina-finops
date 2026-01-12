'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';

// ============================
// TIPOS
// ============================
interface User {
  contact_name?: string;
  company_name?: string;
  email?: string;
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

const ChartPlaceholder = ({ title }: { title: string }) => (
  <div className="bg-white border rounded-xl p-6 shadow">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="h-64 flex items-center justify-center text-gray-400">
      Gráfico próximamente
    </div>
  </div>
);

// ============================
// DASHBOARD ADMIN
// ============================
const AdminDashboard = () => {
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
        <KpiCard title="Usuarios activos" value={stats.active_users} color="green" />
        <KpiCard title="Usuarios inactivos" value={stats.inactive_users} color="red" />
        <KpiCard title="Planes activos" value={stats.users_by_plan.length} color="indigo" />
      </div>

      {/* GRÁFICOS */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartPlaceholder title="Usuarios activos vs inactivos" />
        <ChartPlaceholder title="Usuarios por plan" />
      </div>
    </>
  );
};

// ============================
// DASHBOARD CLIENTE (ACTUAL)
// ============================
const ClientDashboard = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gasto Mensual Cloud
        </h3>
        <img src="/ima1.png" className="rounded-lg mb-4 border" />
        <img src="/ima2.png" className="rounded-lg border" />
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ahorro Potencial
        </h3>
        <img src="/ima3.png" className="rounded-lg mb-4 border" />
        <img src="/ima4.png" className="rounded-lg border" />
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Proyecciones FinOps
        </h3>
        <img src="/ima5.png" className="rounded-lg mb-4 border" />
        <img src="/ima6.png" className="rounded-lg border" />
      </div>
    </div>
  </>
);

// ============================
// PAGE
// ============================
export default function Dashboard() {
  const { user, logout, planState } = useAuth();
  const safeUser: User = user || {};

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-white text-gray-900">

        {/* HEADER */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <span className="text-gray-700 font-medium text-lg block">
              Estás en tu sesión:{' '}
              {safeUser.contact_name ||
                safeUser.company_name ||
                safeUser.email}
            </span>

            {user?.role === 'admin' ? (
              <span className="text-sm text-purple-700 font-medium">
                Rol: Administrador del sistema
              </span>
            ) : (
              <span className="text-sm text-blue-600 font-medium">
                Plan contratado:{' '}
                {planState.status === 'assigned'
                  ? planState.plan.name
                  : 'No asignado'}
              </span>
            )}
          </div>
        </header>

        {/* HERO */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 mb-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Dashboard FinOps
            </h1>
            <p className="text-blue-100">
              Control y visibilidad centralizada
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="px-6 max-w-7xl mx-auto space-y-12">
          {user?.role === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-gray-400 mt-16 py-8 text-center text-sm">
          © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
        </footer>
      </main>
    </PrivateRoute>
  );
}
