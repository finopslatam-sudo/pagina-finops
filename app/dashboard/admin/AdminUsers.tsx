'use client';

import { useState } from 'react';
import { useAdminUsers } from './hooks/useAdminUsers';
import { UsersTable } from './components/UsersTable';
import { AdminUser } from './hooks/useAdminUsers';

export default function AdminUsers() {
  const { users, loading, error, refetch } = useAdminUsers();
  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  if (loading) {
    return <p>Cargando usuarios…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        Usuarios del sistema
      </h2>

      <UsersTable
        users={users}
        onEdit={(user) => setSelectedUser(user)}
      />

      {/* Modal de edición (ya lo tienes) */}
      {selectedUser && (
        <div>
          {/* aquí conectas tu EditUserModal */}
        </div>
      )}
    </section>
  );
}
