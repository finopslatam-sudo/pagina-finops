'use client';

/* =====================================================
   ADMIN USERS TABLE — FINOPSLATAM
   Usa hook de dominio (useAdminUsers)
===================================================== */

import { useAdminUsers } from '@/app/dashboard/admin/hooks/useAdminUsers';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import EditUserModal from './modals/EditUserModal';


export default function AdminUsersTable() {
  const { users, loading, error } = useAdminUsers();
  const { user: actor } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const canEditUser = (target: any) => {
    if (!actor) return false;
  
    // Root puede editarse y editar support
    if (actor.global_role === 'root') {
      return target.global_role !== 'root' || target.id === actor.id;
    }
  
    // Support solo puede editarse a sí mismo
    if (actor.global_role === 'support') {
      return target.id === actor.id;
    }
  
    return false;
  };
  


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
  
                <td className="p-4 text-right">
                  {canEditUser(user) ? (
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
          }}
        />
      )}
    </>
  );
}  
