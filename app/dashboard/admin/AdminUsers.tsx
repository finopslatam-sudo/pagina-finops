'use client';

import { useMemo, useState } from 'react';
import {
  useAdminUsers,
  AdminUser,
} from './hooks/useAdminUsers';

import { UsersTable } from './components/UsersTable';
import UserFormModal from './components/UserFormModal';
import CreateUserModal from './components/CreateUserModal';

export default function AdminUsers() {
  const { users, loading, error, refetch } =
    useAdminUsers();

  /* ============================
     UI STATE
  ============================ */

  const [showCreate, setShowCreate] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  /* ============================
     USUARIOS DEL SISTEMA
     root | admin | support
  ============================ */

  const systemUsers = useMemo(() => {
    return users
      .filter((u) => u.global_role !== null)
      .sort((a, b) =>
        a.email.localeCompare(b.email)
      );
  }, [users]);

  /* ============================
     USUARIOS POR CLIENTE
  ============================ */

  const usersByClient = useMemo(() => {
    const map = new Map<
      string,
      AdminUser[]
    >();

    users
      .filter(
        (u) =>
          u.client_id !== null &&
          u.client_role !== null
      )
      .forEach((user) => {
        const company =
          user.company_name ??
          'Cliente sin nombre';

        if (!map.has(company)) {
          map.set(company, []);
        }

        map.get(company)!.push(user);
      });

    // ordenar usuarios por email dentro de cada cliente
    for (const [key, value] of map.entries()) {
      map.set(
        key,
        value.sort((a, b) =>
          a.email.localeCompare(b.email)
        )
      );
    }

    return map;
  }, [users]);

  /* ============================
     LOADING & ERROR STATES
  ============================ */

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-gray-600">
          Cargando usuarios…
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6">
        <p className="text-red-600">
          {error}
        </p>
      </section>
    );
  }

  /* ============================
     RENDER
  ============================ */

  return (
    <section className="space-y-10 p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          
        </h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Agregar Usuario
        </button>
      </div>

      {/* ============================
          USUARIOS DEL SISTEMA
      ============================ */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios del Sistema
        </h2>

        {systemUsers.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No hay usuarios del sistema
          </p>
        ) : (
          <UsersTable
            users={systemUsers}
            onEdit={setSelectedUser}
          />
        )}
      </div>

      {/* ============================
          USUARIOS DE CLIENTES
      ============================ */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios de Clientes
        </h2>

        {[...usersByClient.entries()].length ===
        0 ? (
          <p className="text-gray-500 text-sm">
            No hay usuarios comerciales
          </p>
        ) : (
          [...usersByClient.entries()]
            .sort((a, b) =>
              a[0].localeCompare(b[0])
            )
            .map(
              ([company, clientUsers]) => (
                <div
                  key={company}
                  className="mb-8 border rounded-lg p-4 shadow-sm"
                >
                  <h3 className="text-lg font-medium mb-3">
                    {company}
                  </h3>

                  <UsersTable
                    users={clientUsers}
                    onEdit={
                      setSelectedUser
                    }
                  />
                </div>
              )
            )
        )}
      </div>

      {/* ============================
          MODAL EDITAR
      ============================ */}
      {selectedUser && (
        <UserFormModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          onSaved={() => {
            setSelectedUser(null);
            refetch();
          }}
        />
      )}

      {/* ============================
          MODAL CREAR
      ============================ */}
      {showCreate && (
        <CreateUserModal
          onClose={() =>
            setShowCreate(false)
          }
          onCreated={refetch}
        />
      )}

    </section>
  );
}
