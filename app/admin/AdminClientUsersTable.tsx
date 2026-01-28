'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import EditUserModal from './modals/EditUserModal';
import { AdminUser } from '@/app/dashboard/admin/hooks/useAdminUsers';

/* =====================================================
   TYPES
===================================================== */

interface UsersResponse {
  data: AdminUser[];
}

/* =====================================================
   COMPONENT
===================================================== */

export default function AdminClientUsersTable() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  /* =====================================================
     FETCH USERS
  ===================================================== */

  const loadUsers = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await apiFetch<UsersResponse>(
        '/api/admin/users',
        { token }
      );

      /**
       * Solo usuarios que pertenecen a un cliente
       * (client_id !== null)
       */
      const clientUsers = res.data.filter(
        (u) => u.client_id !== null
      );

      setUsers(clientUsers);
      setError('');
    } catch (err) {
      console.error('ADMIN CLIENT USERS ERROR:', err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  /* =====================================================
     STATES
  ===================================================== */

  if (loading) {
    return <p className="text-gray-400">Cargando usuarios…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (users.length === 0) {
    return (
      <p className="text-gray-400">
        No hay usuarios asociados a clientes
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
                  {user.company_name ?? '—'}
                </td>

                <td className="p-4">
                  {user.client_role ?? '—'}
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
