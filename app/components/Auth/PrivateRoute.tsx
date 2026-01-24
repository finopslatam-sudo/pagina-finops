'use client';

/* =====================================================
   PRIVATE ROUTE — FINOPSLATAM
   Protección de rutas autenticadas
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { ReactNode } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import ForceChangePasswordModal from '@/app/components/Auth/ForceChangePasswordModal';

/* =====================================================
   TYPES
===================================================== */

interface PrivateRouteProps {
  children: ReactNode;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function PrivateRoute({
  children,
}: PrivateRouteProps) {
  const { user, isAuthReady } = useAuth();

  /* =====================================================
     LOADING STATE
     - Espera rehidratación del AuthContext
     - Evita renders inconsistentes
  ===================================================== */

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando sesión…
      </div>
    );
  }

  /* =====================================================
     USUARIO NO AUTENTICADO
     - AuthContext se encarga del logout
     - PrivateRoute NO redirige
  ===================================================== */

  if (!user) {
    return null;
  }

  /* =====================================================
     🔐 BLOQUEO DE SEGURIDAD CRÍTICO
     - Forzado por backend
     - UI completamente bloqueada
  ===================================================== */

  if (user.force_password_change) {
    /**
     * Reglas:
     * - No renderizar children
     * - No permitir navegación
     * - Modal bloquea toda la UI
     *
     * Este estado solo se libera
     * cuando el backend confirma el cambio
     */
    return <ForceChangePasswordModal />;
  }

  /* =====================================================
     ACCESO AUTORIZADO
  ===================================================== */

  return <>{children}</>;
}
