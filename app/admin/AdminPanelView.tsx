'use client';

/* =====================================================
   IMPORTS
===================================================== */

import AdminUsersTable from './AdminUsersTable';
import AdminClientsTable from './AdminClientsTable';
import AdminClientUsersTable from './AdminClientUsersTable';

/* =====================================================
   COMPONENT
===================================================== */

/**
 * AdminPanelView
 *
 * Contenido REAL del Panel de Administración.
 *
 * RESPONSABILIDADES:
 * - Renderizar secciones administrativas
 * - Componer tablas y modales
 *
 * NO HACE:
 * - Validaciones de permisos
 * - Guards de ruta
 *
 * (Eso ya lo hace app/admin/page.tsx)
 */

export default function AdminPanelView() {
  return (
    <div className="space-y-14 p-6">
      <p className="text-red-600 font-bold">
        DEBUG: AdminPanelView renderizado
      </p>

      {/* =================================================
         USUARIOS DE PLATAFORMA
      ================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios de Plataforma
        </h2>

        <AdminUsersTable />
      </section>

      {/* =================================================
         EMPRESAS / CLIENTES
      ================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Empresas
        </h2>

        <AdminClientsTable />
      </section>

      {/* =================================================
         USUARIOS DE EMPRESAS
      ================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios por Empresa
        </h2>

        <AdminClientUsersTable />
      </section>

    </div>
  );
}
