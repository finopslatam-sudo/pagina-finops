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
}

// ============================
// PAGE
// ============================
export default function Dashboard() {
  const { user, planState } = useAuth();
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

        {/* CONTENT */}
        <section className="px-6 max-w-7xl mx-auto space-y-12">
          {user?.role === 'admin'
            ? <AdminDashboard />
            : <ClientDashboard />
          }
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-gray-400 mt-16 py-8 text-center text-sm">
          © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
        </footer>

      </main>
    </PrivateRoute>
  );
}
