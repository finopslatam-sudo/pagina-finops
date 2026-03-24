'use client';

/* =====================================================
   ADMIN SOPORTE — GUARD + ROUTE
===================================================== */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AdminSupportTickets from './AdminSupportTickets';

export default function AdminSoportePage() {
  const { user, isAuthReady, isStaff } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthReady) return;
    if (!user || !isStaff) {
      router.replace('/dashboard');
    }
  }, [user, isStaff, isAuthReady, router]);

  if (!isAuthReady) {
    return <div className="p-6 text-gray-400">Validando acceso…</div>;
  }

  if (!user || !isStaff) return null;

  return <AdminSupportTickets />;
}
