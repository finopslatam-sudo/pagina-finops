'use client';

/* =====================================================
   DASHBOARD PAGE
   Ruta: /dashboard
===================================================== */

import { useAuth } from '@/app/context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

export default function DashboardPage() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="p-6 text-gray-400">
        Cargando dashboard…
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-red-500 p-6">
        Acceso no autorizado
      </p>
    );
  }

  if (user.global_role) {
    return <AdminDashboard />;
  }
  
  if (user.client_role) {
    return <ClientDashboard />;
  }
  
  return (
    <p className="text-red-500 p-6">
      Usuario sin rol válido
    </p>
  );
  
}
