'use client';

/* =====================================================
   COSTOS — FINOPSLATAM
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
 * CostosPage
 *
 * Vista protegida del módulo de Costos FinOps.
 *
 * Reglas de acceso:
 * - Requiere sesión válida (JWT)
 * - Validación delegada a <PrivateRoute />
 *
 * Importante:
 * - NO maneja AuthContext directamente
 * - NO valida roles ni planes
 * - NO ejecuta lógica de negocio
 *
 * Este diseño garantiza:
 * - separación de responsabilidades
 * - fácil auditoría
 * - escalabilidad futura (ETL, dashboards reales)
 */
export default function CostosPage() {
  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 p-6">

        {/* =========================
           HEADER
        ========================== */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">
            Costos Cloud
          </h1>
          <p className="text-gray-600">
            Visualización y control del gasto en la nube
          </p>
        </header>

        {/* =========================
           CONTENIDO
           (placeholder inicial)
        ========================== */}
        <section className="bg-white rounded-xl border p-6 shadow-sm">
          <p className="text-gray-500">
            Próximamente: dashboards de costos reales,
            desgloses por servicio, alertas y control presupuestario.
          </p>
        </section>

      </div>
    </PrivateRoute>
  );
}
