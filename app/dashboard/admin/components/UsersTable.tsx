'use client';

import { AdminUser } from '../hooks/useAdminUsers';

interface Props {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
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
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">Email</th>
          <th className="text-left py-2">Empresa</th>
          <th className="text-left py-2">Rol</th>
          <th className="text-left py-2">Estado</th>
          <th className="text-left py-2">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="border-b last:border-0"
          >
            <td className="py-2">{user.email}</td>
            <td className="py-2">
              {user.company_name ?? '—'}
            </td>
            <td className="py-2">
              {user.role ?? '—'}
            </td>
            <td className="py-2">
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
            <td className="py-2">
              {user.can_edit ? (
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => onEdit(user)}
                >
                  Editar
                </button>
              ) : (
                '—'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
