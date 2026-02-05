'use client';

/* =====================================================
   CLIENTS TABLE — DOMAIN CLIENTS
===================================================== */

import { useAdminClients } from '@/app//dashboard/clients/hooks/useAdminClients';
import type { AdminClient } from '@/app//dashboard/clients/hooks/useAdminClients';

export default function ClientsTable() {
  const { clients, loading, error } = useAdminClients();

  if (loading) {
    return <p className="text-gray-400">Cargando empresas…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (clients.length === 0) {
    return (
      <p className="text-gray-400">
        No hay empresas registradas
      </p>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4">Empresa</th>
            <th className="p-4">Email</th>
            <th className="p-4">Contacto</th>
            <th className="p-4">Estado</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {clients.map((client: AdminClient) => (
            <tr key={client.id}>
              <td className="p-4 font-medium">
                {client.company_name}
              </td>
              <td className="p-4">{client.email}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
