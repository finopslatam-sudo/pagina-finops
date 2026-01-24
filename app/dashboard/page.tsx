'use client';

/* =====================================================
   DASHBOARD ENTRYPOINT — FINOPSLATAM
   Decide qué dashboard renderizar según el rol
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';

import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

/* =====================================================
   COMPONENT
===================================================== */

export default function DashboardPage() {
  const { user, isAuthReady, isStaff } = useAuth();

  /* =====================================================
     LOADING STATE
     (rehidratación de sesión)
  ===================================================== */

  if (!isAuthReady) {
    return (
      <div className="p-6 text-gray-400">
        Cargando dashboard…
      </div>
    );
  }

  /**
   * ⚠️ user puede ser null brevemente
   * PrivateRoute se encarga de la redirección
   */
  if (!user) {
    return null;
  }

  /* =====================================================
     RENDER (ROLE-BASED)
  ===================================================== */

  return (
    <PrivateRoute>
      {isStaff ? (
        <AdminDashboard />
      ) : (
        <ClientDashboard />
      )}
    </PrivateRoute>
  );
}
