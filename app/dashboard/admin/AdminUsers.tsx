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
     DERIVED DATA
  ============================ */

  const systemUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.role === 'root' ||
          u.role === 'admin' ||
          u.role === 'support'
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
      .forEach((user) => {
        if (!user.company_name) return;
  
        if (!map.has(user.company_name)) {
          map.set(user.company_name, []);
        }
        map.get(user.company_name)!.push(user);
      });
  
    return map;
  }, [users]);
  
  /* ============================
     STATES
  ============================ */

  if (loading) return <p>Cargando usuarios…</p>;
  if (error)
    return <p className="text-red-600">{error}</p>;

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
          onEdit={setSelectedUser}
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
                onEdit={setSelectedUser}
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
