'use client';

import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

// ============================
// TIPOS
// ============================
interface User {
  contact_name?: string;
  company_name?: string;
  email?: string;
  role?: string;
}

// ============================
// PAGE
// ============================
export default function Dashboard() {
  const { user, planState } = useAuth();
  const safeUser: User = user || {};

  // ⛔️ Evita render prematuro
  if (!user) {
    return (
      <PrivateRoute>
        <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
          <p className="text-gray-400">Cargando dashboard…</p>
        </main>
      </PrivateRoute>
    );
  }

  const isAdmin =
    typeof user.role === 'string' &&
    user.role.toLowerCase() === 'admin';

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

            {isAdmin ? (
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
          {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-gray-400 mt-16 py-8 text-center text-sm">
          © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
        </footer>

      </main>
    </PrivateRoute>
  );
}
