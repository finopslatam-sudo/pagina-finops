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
     COLAPSABLE STATE
  ============================ */
  const [openClients, setOpenClients] = useState<
    Record<string, boolean>
  >({});

  const toggleClient = (company: string) => {
    setOpenClients((prev) => ({
      ...prev,
      [company]: !prev[company],
    }));
  };

  /* ============================
     SYSTEM USERS
  ============================ */
  const systemUsers = useMemo(
    () => users.filter((u) => u.global_role !== null),
    [users]
  );

  /* ============================
     USERS BY CLIENT
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
          CLIENTES (COLAPSABLES)
      ============================ */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Clientes
        </h2>

        {[...usersByClient.entries()].map(
          ([company, clientUsers]) => {
            const isOpen = openClients[company];

            return (
              <div
                key={company}
                className="border rounded-lg mb-4"
              >
                {/* HEADER */}
                <button
                  onClick={() => toggleClient(company)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
                >
                  <span className="font-medium">
                    {company}
                  </span>
                  <span className="text-sm text-gray-600">
                    {clientUsers.length} usuarios{' '}
                    {isOpen ? '▾' : '▸'}
                  </span>
                </button>

                {/* BODY */}
                {isOpen && (
                  <div className="p-4">
                    <UsersTable
                      users={clientUsers}
                      onEdit={(u) =>
                        setSelectedUser(u)
                      }
                    />
                  </div>
                )}
              </div>
            );
          }
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
