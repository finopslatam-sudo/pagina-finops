'use client';


import PrivateRoute from '@/app/components/Auth/PrivateRoute';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';
import { useAuth } from '@/app/context/AuthContext';

function DashboardContent() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="p-6 text-gray-400">
        Cargando dashboard…
      </div>
    );
  }

  if (!user) {
    return null;
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

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}
