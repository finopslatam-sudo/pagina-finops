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

  const getRoleLabel = (user: AdminUser) => {
    if (user.type === 'global') {
      return user.global_role ?? '—';
    }
    return user.client_role ?? '—';
  };

  const canEditUser = (user: AdminUser) => {
    // ❌ Nunca editar root
    if (user.type === 'global' && user.global_role === 'root') {
      return false;
    }
    return true;
  };

  return (
    <table className="w-full text-sm border border-gray-200 rounded">
      <thead className="bg-gray-50">
        <tr>
          <th className="text-left px-3 py-2">Email</th>
          <th className="text-left px-3 py-2">Empresa</th>
          <th className="text-left px-3 py-2">Rol</th>
          <th className="text-left px-3 py-2">Estado</th>
          <th className="text-right px-3 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="border-t"
          >
            <td className="px-3 py-2">
              {user.email}
            </td>

            <td className="px-3 py-2">
              {user.company_name ?? '—'}
            </td>

            <td className="px-3 py-2">
              {getRoleLabel(user)}
            </td>

            <td className="px-3 py-2">
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

            <td className="px-3 py-2 text-right">
              {canEditUser(user) ? (
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
        ))}
      </tbody>
    </table>
  );
}
