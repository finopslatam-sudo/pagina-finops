'use client';

/* =====================================================
   CLIENTS TABLE — ADMIN
===================================================== */

import type { AdminClient } from '../hooks/useAdminClients';

interface Props {
  clients: AdminClient[];
  loading: boolean;
  error: string | null;
  onEdit: (client: AdminClient) => void;
}

export default function ClientsTable({
  clients,
  loading,
  error,
  onEdit,
}: Props) {
  /* =========================
     STATES
  ========================== */

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

  /* =========================
     SPLIT CLIENTS
  ========================== */

  const systemClients = clients.filter(
    client => client.is_system === true
  );

  const businessClientsRaw = clients.filter(
    client => client.is_system === false
  );

  /* =========================
     GROUP BUSINESS CLIENTS
     (1 fila por empresa)
  ========================== */

  const businessClientsMap = new Map<string, AdminClient>();

  for (const client of businessClientsRaw) {
    // si ya existe la empresa, no la sobreescribimos
    if (!businessClientsMap.has(client.company_name)) {
      businessClientsMap.set(client.company_name, client);
    }
  }

  const businessClients = Array.from(
    businessClientsMap.values()
  );

  /* =========================
     RENDER
  ========================== */

  return (
    <div className="space-y-10">

      {/* =====================
         CLIENTES DEL SISTEMA
      ===================== */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        Clientes del sistema
      </h3>

      {systemClients.length === 0 ? (
        <p className="text-sm text-gray-500">
          No hay clientes del sistema
        </p>
      ) : (
        <ClientsTableSection
          clients={systemClients}
          onEdit={onEdit}
        />
      )}

      {/* =====================
         CLIENTES COMERCIALES
      ===================== */}
      <h3 className="text-lg font-semibold mt-10 mb-2">
        Clientes comerciales
      </h3>

      {businessClients.length === 0 ? (
        <p className="text-sm text-gray-500">
          No hay clientes comerciales
        </p>
      ) : (
        <ClientsTableSection
          clients={businessClients}
          onEdit={onEdit}
        />
      )}
    </div>
  );
}

/* =====================================================
   TABLE SECTION (REUTILIZABLE)
===================================================== */

interface SectionProps {
  clients: AdminClient[];
  onEdit: (client: AdminClient) => void;
}

function ClientsTableSection({
  clients,
  onEdit,
}: SectionProps) {
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

              <td className="p-4">
                {client.email}
              </td>

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
                <button
                  onClick={() => onEdit(client)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
