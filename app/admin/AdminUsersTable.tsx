'use client';

import { useState } from 'react';
import { useAdminUsers, AdminUser } from '@/app/dashboard/admin/hooks/useAdminUsers';
import EditUserModal from './modals/EditUserModal';

export default function AdminUsersTable() {
  const { users, loading, error, refetch } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  if (loading) {
    return <p className="text-gray-400">Cargando usuarios…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (users.length === 0) {
    return <p className="text-gray-400">No hay usuarios</p>;
  }

  return (
    <>
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Rol</th>
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
                  {user.type === 'global'
                    ? user.global_role
                    : user.client_role}
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
                  {user.can_edit ? (
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedUser(user)}
                    >
                      Editar
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
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
            refetch(); // 🔄 refresca datos desde backend
          }}
        />
      )}
    </>
  );
}
