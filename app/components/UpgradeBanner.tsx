'use client';

/* =====================================================
   UPGRADE BANNER — FINOPSLATAM
   Mensaje informativo de limitación por plan
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import Link from 'next/link';

/* =====================================================
   TYPES
===================================================== */

interface UpgradeBannerProps {
  /**
   * Nombre opcional del módulo bloqueado
   * (solo informativo)
   */
  featureName?: string;

  /**
   * Ruta a la página de planes
   */
  plansUrl?: string;
}

/* =====================================================
   COMPONENT
===================================================== */

/**
 * UpgradeBanner
 *
 * Componente UI informativo.
 *
 * Responsabilidad:
 * - Informar al usuario que su plan no incluye una funcionalidad
 * - Incentivar upgrade
 *
 * NO debe:
 * - Validar permisos
 * - Conocer planes reales
 * - Llamar APIs
 * - Decidir cuándo mostrarse
 *
 * El CONTENEDOR decide si se renderiza.
 */
export default function UpgradeBanner({
  featureName = 'esta funcionalidad',
  plansUrl = '/planes',
}: UpgradeBannerProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center">
      <h3 className="text-lg font-semibold mb-2">
        🚀 Desbloquea {featureName}
      </h3>

      <p className="text-gray-600 mb-4">
        Tu plan actual no incluye este módulo.
      </p>

      <Link
        href={plansUrl}
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Ver planes
      </Link>
    </div>
  );
}
