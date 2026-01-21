'use client';

import { useAuth } from '@/app/context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

export default function DashboardPage() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <div className="p-6">Cargando dashboard…</div>;
  }

  if (!user) {
    return null;
  }

  const isAdmin =
    user.global_role === 'root' ||
    user.global_role === 'support';

  return isAdmin ? <AdminDashboard /> : <ClientDashboard />;
}
