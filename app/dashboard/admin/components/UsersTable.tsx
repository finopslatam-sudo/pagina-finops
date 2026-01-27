'use client';

import { AdminUser } from '../hooks/useAdminUsers';

interface Props {
  users: AdminUser[];
  onEdit?: (user: AdminUser) => void;
}

export function UsersTable({ users, onEdit }: Props) {
  if (!users.length) {
    return (
      <p className="text-sm text-gray-500">
        No hay usuarios
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-lg">
        <thead>
          <tr className="bg-gray-50 text-left text-sm">
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Empresa</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2 text-right">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const role =
              user.global_role ??
              user.client_role ??
              '—';

            return (
              <tr
                key={user.id}
                className="border-t text-sm"
              >
                <td className="px-4 py-2">
                  {user.email}
                </td>

                <td className="px-4 py-2">
                  {user.company_name ?? '—'}
                </td>

                <td className="px-4 py-2 capitalize">
                  {role}
                </td>

                <td className="px-4 py-2">
                  {user.is_active ? (
                    <span className="text-green-600">
                      Activo
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Inactivo
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-right">
                  {onEdit ? (
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                  ) : (
                    <span className="text-gray-400">
                      —
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
