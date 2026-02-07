'use client';

import type { AdminClient } from '../hooks/useAdminClients';

interface Props {
  clients: AdminClient[];
  onEdit?: (client: AdminClient) => void;
}

export default function ClientsTableSection({ clients, onEdit }: Props) {
  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4">Empresa</th>
            <th className="p-4">Email</th>
            <th className="p-4">Contacto</th>
            <th className="p-4">Plan</th>
            <th className="p-4">Estado</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {clients.map(client => (
            <tr key={client.id}>
              <td className="p-4 font-medium">
                {client.company_name}
              </td>
              <td className="p-4">{client.email}</td>
              <td className="p-4">
                {client.contact_name ?? '—'}
              </td>
              <td className="p-4">
                {client.plan ?? '—'}
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
                {onEdit && (
                  <button
                    onClick={() => onEdit(client)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
