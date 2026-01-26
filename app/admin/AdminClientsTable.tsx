'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import EditClientModal from './modals/EditClientModal';

/* =====================================================
   TYPES
===================================================== */

interface Client {
  id: number;
  company_name: string;
  email: string;
  contact_name: string | null;
  phone: string | null;
  is_active: boolean | null;
}

interface ClientsResponse {
  clients: Client[];
}

/* =====================================================
   COMPONENT
===================================================== */

export default function AdminClientsTable() {
  const { token } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedClient, setSelectedClient] =
    useState<Client | null>(null);

  /* =====================================================
     FETCH CLIENTS
  ===================================================== */

  const loadClients = () => {
    if (!token) return;

    setLoading(true);

    apiFetch<ClientsResponse>('/api/admin/clients', { token })
      .then((data) => {
        setClients(data.clients || []);
        setError('');
      })
      .catch((err) => {
        console.error('ADMIN CLIENTS ERROR:', err);
        setError('No se pudieron cargar las empresas');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadClients();
  }, [token]);

  /* =====================================================
     STATES
  ===================================================== */

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
              <th className="p-4 text-right">Acciones</th>
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
                  {client.contact_name || '—'}
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
                    onClick={() => setSelectedClient(client)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
         MODAL
      ========================== */}
      {selectedClient && (
        <EditClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onSaved={() => {
            setSelectedClient(null);
            loadClients();
          }}
        />
      )}
    </>
  );
}
