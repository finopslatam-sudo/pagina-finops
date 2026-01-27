'use client';

import { useMemo, useState } from 'react';
import { useAdminUsers, AdminUser } from './hooks/useAdminUsers';
import { UsersTable } from './components/UsersTable';
import UserFormModal from './components/UserFormModal';

export default function AdminUsers() {
  const { users, loading, error } = useAdminUsers();
  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  const systemUsers = useMemo(
    () =>
      users.filter((u) =>
        ['root', 'admin', 'support'].includes(
          u.role ?? ''
        )
      ),
    [users]
  );

  const usersByClient = useMemo(() => {
    const map = new Map<string, AdminUser[]>();

    users
      .filter(
        (u) =>
          !['root', 'admin', 'support'].includes(
            u.role ?? ''
          )
      )
      .forEach((u) => {
        if (!u.company_name) return;
        if (!map.has(u.company_name)) {
          map.set(u.company_name, []);
        }
        map.get(u.company_name)!.push(u);
      });

    return map;
  }, [users]);

  if (loading) {
    return <p>Cargando usuarios…</p>;
  }

  if (error) {
    return (
      <p className="text-red-600">
        {error}
      </p>
    );
  }

  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios del sistema
        </h2>

        <UsersTable
          users={systemUsers}
          onEdit={setSelectedUser}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Clientes
        </h2>

        {[...usersByClient.entries()].map(
          ([company, list]) => (
            <div
              key={company}
              className="mb-8 border rounded-lg p-4"
            >
              <h3 className="text-lg font-medium mb-3">
                {company}
              </h3>

              <UsersTable
                users={list}
                onEdit={setSelectedUser}
              />
            </div>
          )
        )}
      </div>

      {selectedUser && (
        <UserFormModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          onSaved={() =>
            setSelectedUser(null)
          }
        />
      )}
    </section>
  );
}
