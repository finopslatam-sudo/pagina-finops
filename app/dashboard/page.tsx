'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/app/context/AuthContext';

const PrivateRoute = dynamic(
  () => import('@/app/components/Auth/PrivateRoute'),
  { ssr: false }
);

const AdminDashboard = dynamic(
  () => import('./AdminDashboard'),
  { ssr: false }
);

const ClientDashboard = dynamic(
  () => import('./ClientDashboard'),
  { ssr: false }
);

function DashboardContent() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="p-6 text-gray-400">
        Cargando dashboard…
      </div>
    );
  }

  if (!user) return null;

  /**
   * 🔵 Usuario sistema
   * Mantiene comportamiento actual
   */
  if (user.global_role) {
    return <AdminDashboard />;
  }

  /**
   * 🟢 Usuario cliente
   * Mantiene comportamiento actual
   */
  if (user.client_role) {
    return <ClientDashboard />;
  }

  return (
    <p className="text-red-500 p-6">
      Usuario sin rol válido
    </p>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}