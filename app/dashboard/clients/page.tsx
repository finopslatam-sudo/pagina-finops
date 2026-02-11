'use client';

/* =====================================================
   PANEL DE CLIENTES — FINOPSLATAM (ADMIN)
===================================================== */

import { useState } from 'react';
import ClientsTable from './components/ClientsTable';
import EditClientModal from './components/EditClientModal';
import CreateClientModal from './components/CreateClientModal';
import { useAdminClients } from './hooks/useAdminClients';
import type { AdminClient } from './hooks/useAdminClients';

export default function ClientsPage() {
  const {
    clients,
    loading,
    error,
    updateClient,
    changeClientPlan,
    refresh,
  } = useAdminClients();

  const [selectedClient, setSelectedClient] =
    useState<AdminClient | null>(null);

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  return (
    <section className="max-w-7xl mx-auto px-6 py-6 space-y-6">

      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Panel de Clientes
          </h1>
          <p className="text-sm text-gray-500">
            Administración de empresas registradas.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Agregar cliente
        </button>
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
          onSave={async (data) => {
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

      {isCreateOpen && (
        <CreateClientModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={async () => {
            await refresh();
            setIsCreateOpen(false);
          }}
        />
      )}

    </section>
  );
}
