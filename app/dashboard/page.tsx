'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const PrivateRoute = dynamic(
  () => import('@/app/components/Auth/PrivateRoute'),
  { ssr: false }
);

function DashboardGateway() {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady || !user) return;

    // 🔵 STAFF → NO TOCAR ADMIN
    if (user.global_role) {
      router.replace('/dashboard/admin');
      return;
    }

    // 🟢 CLIENTE → NUEVA RUTA OVERVIEW
    if (user.client_role) {
      router.replace('/dashboard/overview');
      return;
    }

    router.replace('/');
  }, [isAuthReady, user, router]);

  if (!isAuthReady) {
    return (
      <div className="p-6 text-gray-400">
        Cargando dashboard…
      </div>
    );
  }

  return null;
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardGateway />
    </PrivateRoute>
  );
}