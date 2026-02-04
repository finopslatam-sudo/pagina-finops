'use client';

/* =====================================================
   ADMIN CLIENTS TABLE — FINOPSLATAM
===================================================== */

import { useState } from 'react';
import {
  useAdminClients,
  AdminClient,
} from '@/app/dashboard/admin/hooks/useAdminClients';
import EditClientDrawer from './drawers/EditClientDrawer';

export default function AdminClientsTable() {
  const { clients, loading, error, refresh } =
    useAdminClients();

  const [selectedClient, setSelectedClient] =
    useState<AdminClient | null>(null);

  /* =====================================================
     STATES
  ===================================================== */

  if (loading) {
    return (
      <p className="text-gray-400">
        Cargando empresas…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-500">
        {error}
      </p>
    );
  }

  if (!clients.length) {
    return (
      <p className="text-gray-400">
        No hay empresas registradas
      </p>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Empresa</th>
              <th className="p-4">Email</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="p-4 font-medium">
                  {client.company_name}
                </td>

                <td className="p-4">
                  {client.email}
                </td>

                <td className="p-4">
                  {client.contact_name ?? '—'}
                </td>

                <td className="p-4">
                  {client.is_active ? (
                    <span className="text-green-600 font-medium">
                      Activa
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Inactiva
                    </span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() =>
                      setSelectedClient(client)
                    }
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
         DRAWER
      ===================================================== */}

      {selectedClient && (
        <EditClientDrawer
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onSaved={() => {
            setSelectedClient(null);
            refresh();
          }}
        />
      )}
    </>
  );
}
