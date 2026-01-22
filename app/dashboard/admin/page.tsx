'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AdminUsers from './AdminUsers';

export default function AdminPage() {
  const { user, isAuthReady, isStaff } = useAuth();
  const router = useRouter();

  // 🔐 Protección de ruta: solo staff (root | support)
  useEffect(() => {
    if (!isAuthReady) return;

    if (!user || !isStaff) {
      router.replace('/dashboard');
    }
  }, [user, isStaff, isAuthReady, router]);

  // ⏳ Evita render mientras se valida sesión
  if (!isAuthReady) {
    return (
      <div className="p-6 text-gray-400">
        Validando acceso…
      </div>
    );
  }

  // 🛑 Seguridad adicional
  if (!user || !isStaff) {
    return null;
  }

  // ✅ Panel real de administración (listado de usuarios)
  return <AdminUsers />;
}
