'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AdminUsers from './AdminUsers';

/* =====================================================
   COMPONENT
===================================================== */

/**
 * AdminPage
 *
 * Guard de ruta para el panel de administración.
 *
 * - Solo accesible por usuarios STAFF (root | support)
 * - No renderiza UI hasta validar sesión
 * - Redirige de forma segura a /dashboard si no cumple permisos
 *
 * IMPORTANTE:
 * - No valida permisos de negocio
 * - El backend siempre vuelve a validar JWT + roles
 */
export default function AdminPage() {
  const { user, isAuthReady, isStaff } = useAuth();
  const router = useRouter();

  /* =====================================================
     ROUTE PROTECTION
     - Espera rehidratación
     - Bloquea acceso no autorizado
  ===================================================== */

  useEffect(() => {
    if (!isAuthReady) return;

    /**
     * Casos bloqueados:
     * - No autenticado
     * - Usuario cliente
     * - Token inválido (rehidratación fallida)
     */
    if (!user || !isStaff) {
      router.replace('/dashboard');
    }
  }, [user, isStaff, isAuthReady, router]);

  /* =====================================================
     LOADING STATE
     (rehidratación del AuthContext)
  ===================================================== */

  if (!isAuthReady) {
    return (
      <div className="p-6 text-gray-400">
        Validando acceso…
      </div>
    );
  }

  /* =====================================================
     HARD GUARD
     (evita render fantasma)
  ===================================================== */

  if (!user || !isStaff) {
    return null;
  }

  /* =====================================================
     ACCESS GRANTED
     - Renderiza panel real
  ===================================================== */

  return <AdminUsers />;
}