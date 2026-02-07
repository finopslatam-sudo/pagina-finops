'use client';

/* =====================================================
   PANEL DE CLIENTES — FINOPSLATAM (ADMIN)
===================================================== */

import ClientsTable from './components/ClientsTable';
import { useAdminClients } from './hooks/useAdminClients';

export default function ClientsPage() {
  const {
    clients,
    loading,
    error,
    changeClientPlan,
  } = useAdminClients();

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

      {/* TABLA DE CLIENTES */}
      <ClientsTable
        clients={clients}
        loading={loading}
        error={error}
        onChangePlan={changeClientPlan}
      />
    </section>
  );
}
