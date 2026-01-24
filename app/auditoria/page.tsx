'use client';

/* =====================================================
   AUDITORÍA — FINOPSLATAM
   Página protegida (requiere autenticación)
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import PrivateRoute from '@/app/components/Auth/PrivateRoute';

/* =====================================================
   COMPONENT
===================================================== */

/**
 * AuditoriaPage
 *
 * Vista protegida del módulo de Auditoría FinOps.
 *
 * Reglas de acceso:
 * - Requiere sesión válida (JWT)
 * - La validación se realiza vía <PrivateRoute />
 *
 * NOTA IMPORTANTE:
 * - Esta página NO valida roles
 * - NO valida plan
 * - NO accede directamente al AuthContext
 *
 * Toda la lógica de seguridad se delega a:
 * - AuthContext
 * - PrivateRoute
 *
 * Esto mantiene:
 * - separación de responsabilidades
 * - código auditable
 * - escalabilidad
 */
export default function AuditoriaPage() {
  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 p-6">

        {/* =========================
           HEADER
        ========================== */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">
            Auditoría FinOps
          </h1>
          <p className="text-gray-600">
            Módulo de análisis y control de costos cloud
          </p>
        </header>

        {/* =========================
           CONTENIDO
           (placeholder inicial)
        ========================== */}
        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <p className="text-gray-500">
            Próximamente: auditoría automática de costos,
            detección de recursos ociosos y reportes FinOps.
          </p>
        </section>

      </div>
    </PrivateRoute>
  );
}
