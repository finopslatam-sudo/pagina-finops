'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AdminPanelView from './AdminPanelView';

export default function AdminPage() {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  /* =========================
     ROUTE GUARD
  ========================= */
  useEffect(() => {
    if (
      !user ||
      !user.role ||
      !['root', 'admin'].includes(user.role)
    ) {
      router.replace('/dashboard');
    }
  }, [user, isAuthReady, router]);

  /* =========================
     LOADING
  ========================= */
  if (!isAuthReady) {
    return <p className="text-gray-400">Cargando…</p>;
  }

  /* =========================
     HARD GUARD
  ========================= */
  if (
    !user ||
    !user.role ||
    !['root', 'admin'].includes(user.role)
  ) {
    return null;
  }

  /* =========================
     ACCESS GRANTED
  ========================= */
  return <AdminPanelView />;
}
