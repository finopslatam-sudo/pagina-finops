'use client';

/* =====================================================
   PANEL DE CLIENTES — FINOPSLATAM (ADMIN)
===================================================== */

import { useState } from 'react';
import ClientsTable from './components/ClientsTable';
import EditClientModal from './components/EditClientModal';
import { useAdminClients } from './hooks/useAdminClients';
import type { AdminClient } from './hooks/useAdminClients';

export default function ClientsPage() {
  const {
    clients,
    loading,
    error,
    updateClient,
    changeClientPlan,
  } = useAdminClients();

  const [selectedClient, setSelectedClient] =
    useState<AdminClient | null>(null);

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

      <ClientsTable
        clients={clients}
        loading={loading}
        error={error}
        onEdit={setSelectedClient}
      />

      {selectedClient && (
        <EditClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onSave={async (data: {
            company_name: string;
            email: string;
            contact_name?: string;
            phone?: string;
            is_active: boolean;
            plan_id: number;
          }) => {
            await updateClient(
              selectedClient.id,
              data
            );

            if (data.plan_id) {
              await changeClientPlan(
                selectedClient.id,
                data.plan_id
              );
            }

          }}
        />
      )}
    </section>
  );
}
