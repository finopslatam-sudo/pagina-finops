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
 * AdminPanel
 *
 * Contenido REAL del Panel de Administración.
 *
 * - Se asume que el acceso ya fue validado en page.tsx
 * - No contiene lógica de permisos
 * - Solo UI + composición
 */
export default function AdminPanel() {
  return (
    <div className="space-y-12">

      {/* ===============================
         USUARIOS DE PLATAFORMA
      =============================== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios de Plataforma
        </h2>

        <AdminUsersTable />
      </section>

      {/* ===============================
         EMPRESAS / CLIENTES
      =============================== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Empresas
        </h2>

        <AdminClientsTable />
      </section>

      {/* ===============================
         USUARIOS POR EMPRESA
      =============================== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios por Empresa
        </h2>

        <AdminClientUsersTable />
      </section>

      {/* =========================
    USUARIOS DE CLIENTES
    ========================== */}
    <section className="space-y-4">
        <h2 className="text-lg font-semibold">
            Usuarios de Empresas
        </h2>
        <AdminClientUsersTable />
    </section>

    </div>
  );
}
