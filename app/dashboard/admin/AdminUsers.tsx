'use client';

import { useMemo, useState } from 'react';
import { useAdminUsers, AdminUser } from './hooks/useAdminUsers';
import { UsersTable } from './components/UsersTable';
import UserFormModal from './components/UserFormModal';

export default function AdminUsers() {
  const { users, loading, error } = useAdminUsers();
  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  /* ============================
     USUARIOS DEL SISTEMA
  ============================ */
  const systemUsers = useMemo(
    () => users.filter((u) => u.global_role !== null),
    [users]
  );

  /* ============================
     USUARIOS POR CLIENTE
  ============================ */
  const usersByClient = useMemo(() => {
    const map = new Map<string, AdminUser[]>();

    users
      .filter((u) => u.client !== null)
      .forEach((user) => {
        const company = user.client!.company_name;
        if (!map.has(company)) {
          map.set(company, []);
        }
        map.get(company)!.push(user);
      });

    return map;
  }, [users]);

  if (loading) return <p>Cargando usuarios…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="space-y-10">
      {/* ============================
          USUARIOS DEL SISTEMA
      ============================ */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios del sistema
        </h2>

        <UsersTable
          users={systemUsers}
          onEdit={(u) => setSelectedUser(u)}
        />
      </div>

      {/* ============================
          CLIENTES
      ============================ */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Clientes
        </h2>

        {[...usersByClient.entries()].map(
          ([company, clientUsers]) => (
            <div
              key={company}
              className="mb-8 border rounded-lg p-4"
            >
              <h3 className="text-lg font-medium mb-3">
                {company}
              </h3>

              <UsersTable
                users={clientUsers}
                onEdit={(u) => setSelectedUser(u)}
              />
            </div>
          )
        )}
      </div>

      {/* ============================
          MODAL
      ============================ */}
      {selectedUser && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSaved={() => setSelectedUser(null)}
        />
      )}
    </section>
  );
}
