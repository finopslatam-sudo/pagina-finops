'use client';

import { useAuth } from '@/app/context/AuthContext';

const MOCK_USERS = [
  {
    id: 1,
    email: 'contacto@finopslatam.com',
    global_role: 'root',
    is_active: true,
  },
  {
    id: 2,
    email: 'soporte@finopslatam.com',
    global_role: 'support',
    is_active: true,
  },
];

export default function UsersTable({ onEdit }: { onEdit: (u: any) => void }) {
  const { user } = useAuth();

  const canEdit = (target: any) => {
    if (user?.global_role === 'root') {
      return target.id !== user.id;
    }

    if (user?.global_role === 'support') {
      return target.global_role !== 'root';
    }

    return false;
  };

  const canInactivate = (target: any) => {
    if (target.id === user?.id) return false;
    if (target.global_role === 'root' && user?.global_role !== 'root') return false;
    return true;
  };

  return (
    <table className="w-full border rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Email</th>
          <th className="p-3">Rol</th>
          <th className="p-3">Estado</th>
          <th className="p-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_USERS.map((u) => (
          <tr key={u.id} className="border-t">
            <td className="p-3">{u.email}</td>
            <td className="p-3 text-center">{u.global_role}</td>
            <td className="p-3 text-center">
              {u.is_active ? 'Activo' : 'Inactivo'}
            </td>
            <td className="p-3 text-center space-x-2">
              {canEdit(u) && (
                <button
                  onClick={() => onEdit(u)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
              )}

              {canInactivate(u) && (
                <button className="text-red-600 hover:underline">
                  Inactivar
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
