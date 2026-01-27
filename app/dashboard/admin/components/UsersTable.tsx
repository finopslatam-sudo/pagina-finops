'use client';

import { AdminUser } from '../hooks/useAdminUsers';

interface Props {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
}

export function UsersTable({ users, onEdit }: Props) {
  if (users.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No hay usuarios registrados
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm">Email</th>
            <th className="px-4 py-2 text-left text-sm">Empresa</th>
            <th className="px-4 py-2 text-left text-sm">Rol</th>
            <th className="px-4 py-2 text-left text-sm">Estado</th>
            <th className="px-4 py-2 text-left text-sm">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-4 py-2 text-sm">
                {user.email}
              </td>

              <td className="px-4 py-2 text-sm">
                {user.company_name ?? '—'}
              </td>

              <td className="px-4 py-2 text-sm font-medium">
                {user.role}
              </td>

              <td className="px-4 py-2 text-sm">
                {user.is_active ? (
                  <span className="text-green-600">Activo</span>
                ) : (
                  <span className="text-red-600">Inactivo</span>
                )}
              </td>

              <td className="px-4 py-2 text-sm">
                {user.can_edit ? (
                  <button
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:underline"
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
  );
}
