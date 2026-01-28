'use client';

/* =====================================================
   ADMIN USERS TABLE — FINOPSLATAM
   Usa hook de dominio (useAdminUsers)
===================================================== */

import { useAdminUsers } from '@/app/dashboard/admin/hooks/useAdminUsers';

export default function AdminUsersTable() {
  const { users, loading, error } = useAdminUsers();

  if (loading) {
    return <p className="text-gray-400">Cargando usuarios…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const platformUsers = users.filter(
    (u) => u.global_role !== null
  );

  if (platformUsers.length === 0) {
    return <p className="text-gray-400">No hay usuarios</p>;
  }

  return (
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
          {platformUsers.map((user) => (
            <tr key={user.id}>
              <td className="p-4 font-medium">
                {user.email}
              </td>
              <td className="p-4">
                {user.global_role}
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
              <td className="p-4 text-right text-gray-400">
                No editable
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
