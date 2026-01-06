'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import ForceChangePasswordModal from '@/app/components/Auth/ForceChangePasswordModal';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  // 🔁 Redirección si no hay sesión
  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  // 🛑 No renderizar nada hasta que Auth esté definido
  if (!user) {
    return null;
  }

  return (
    <>
      {/* 🔐 Overlay obligatorio si corresponde */}
      {user.force_password_change && <ForceChangePasswordModal />}

      {/* ✅ CONTENIDO SIEMPRE PRESENTE */}
      {children}
    </>
  );
}
