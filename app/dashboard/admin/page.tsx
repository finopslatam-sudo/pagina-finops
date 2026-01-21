'use client';

import AdminDashboard from '../AdminDashboard';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isAuthReady, isStaff } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthReady) return;

    if (!user || !isStaff) {
      router.replace('/dashboard');
    }
  }, [user, isStaff, isAuthReady, router]);

  if (!user || !isStaff) return null;

  return <AdminDashboard />;
}
