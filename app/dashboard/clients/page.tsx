'use client';

/* =====================================================
   PANEL DE CLIENTES — FINOPSLATAM
===================================================== */

import AdminClientsTable from '@/app/admin/AdminClientsTable';

export default function ClientsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">
          Panel de Clientes
        </h1>

        <p className="text-sm text-gray-500">
          Administración de empresas registradas.
        </p>
      </header>

      <AdminClientsTable />
    </section>
  );
}
