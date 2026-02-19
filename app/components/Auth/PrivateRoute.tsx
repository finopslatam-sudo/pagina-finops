'use client';

/* =====================================================
   PRIVATE ROUTE — FINOPSLATAM
   Protección de rutas autenticadas
===================================================== */

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import ForceChangePasswordModal from '@/app/components/Auth/ForceChangePasswordModal';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({
  children,
}: PrivateRouteProps) {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  /* =====================================================
     REDIRECT SI NO AUTENTICADO
  ===================================================== */

  useEffect(() => {
    if (isAuthReady && !user) {
      router.replace('/');
    }
  }, [isAuthReady, user, router]);

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando sesión…
      </div>
    );
  }

  /* =====================================================
     SI NO HAY USUARIO → EVITA FLICKER
  ===================================================== */

  if (!user) {
    return null;
  }

  /* =====================================================
     FORZAR CAMBIO DE PASSWORD
  ===================================================== */

  if (user.force_password_change) {
    return <ForceChangePasswordModal />;
  }

  /* =====================================================
     ACCESO AUTORIZADO
  ===================================================== */

  return <>{children}</>;
}
