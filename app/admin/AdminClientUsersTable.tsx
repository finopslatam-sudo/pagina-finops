'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import EditUserModal from './modals/EditUserModal';

/* =====================================================
   TYPES
===================================================== */

interface ClientUser {
  id: number;
  email: string;
  global_role: string | null;
  client_role: string | null;
  is_active: boolean | null;
  client: {
    id: number;
    company_name: string;
  } | null;
}

/* =====================================================
   COMPONENT
===================================================== */

/**
 * AdminClientUsersTable
 *
 * Usuarios que pertenecen a empresas (clientes).
 *
 * - Excluye usuarios de plataforma
 * - Backend protegido por JWT
 * - Edición vía modal
 */
export default function AdminClientUsersTable() {
  const { token } = useAuth();

  const [users, setUsers] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedUser, setSelectedUser] =
    useState<ClientUser | null>(null);

  /* =====================================================
     FETCH USERS
  ===================================================== */

  const loadUsers = () => {
    if (!token) return;

    setLoading(true);

    apiFetch<ClientUser[]>('/api/admin/users', { token })
      .then((data) => {
        const clientUsers = data.filter(
          (u) => u.client && u.client.id
        );

        setUsers(clientUsers);
        setError('');
      })
      .catch((err) => {
        console.error('ADMIN CLIENT USERS ERROR:', err);
        setError('No se pudieron cargar los usuarios de clientes');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  /* =====================================================
     STATES
  ===================================================== */

  if (loading) {
    return (
      <p className="text-gray-400">
        Cargando usuarios de clientes…
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (users.length === 0) {
    return (
      <p className="text-gray-400">
        No hay usuarios asociados a empresas
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
              <th className="p-4">Usuario</th>
              <th className="p-4">Empresa</th>
              <th className="p-4">Rol cliente</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-4 font-medium">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.client?.company_name || '—'}
                </td>

                <td className="p-4">
                  {user.client_role || '—'}
                </td>

                <td className="p-4">
                  {user.is_active ? (
                    <span className="text-green-600 font-medium">
                      Activo
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Inactivo
                    </span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setSelectedUser(user)}
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
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSaved={() => {
            setSelectedUser(null);
            loadUsers();
          }}
        />
      )}
    </>
  );
}
