'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useState } from 'react';

import { useAdminUsers } from './hooks/useAdminUsers';
import { useAdminClients } from './hooks/useAdminClients';

import UsersTable from './components/UsersTable';
import UserFormModal from './components/UserFormModal';
import CreateClientModal from './components/CreateClientModal';

import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   COMPONENT
===================================================== */

/**
 * AdminUsers
 *
 * Panel Administrativo — Usuarios y Clientes
 *
 * Responsabilidades:
 * - Visualizar TODOS los usuarios del sistema
 * - Crear clientes
 * - Crear usuarios asociados a clientes existentes
 *
 * Importante:
 * - NO contiene lógica de negocio
 * - Hooks son la capa de dominio
 */
export default function AdminUsers() {
  /* =========================
     DATA (HOOKS)
  ========================== */

  const {
    users,
    loading,
    error,
    refresh,
    createUser,
    setUserActive,
    deactivateUser,
    resetPassword,
  } = useAdminUsers();

  const {
    clients,
    refresh: refreshClients,
  } = useAdminClients();

  /* =========================
     AUTH / PERMISSIONS
  ========================== */

  const { user } = useAuth();

  /**
   * Solo ROOT o SUPPORT
   */
  const canManage =
    user?.global_role === 'root' ||
    user?.global_role === 'support';

  /* =========================
     UI STATE
  ========================== */

  const [showCreateUserModal, setShowCreateUserModal] =
    useState(false);

  const [showCreateClientModal, setShowCreateClientModal] =
    useState(false);

  /* =========================
     RENDER
  ========================== */

  return (
    <div className="space-y-6">

      {/* =========================
         HEADER
      ========================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold">
            Panel de Administración
          </h1>
          <p className="text-sm text-gray-600">
            Gestión de clientes y usuarios del sistema
          </p>
        </div>

        {/* ACCIONES ADMIN */}
        {canManage && (
          <div className="flex gap-3">

            <button
              onClick={() => setShowCreateClientModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              🏢 Crear cliente
            </button>

            <button
              onClick={() => setShowCreateUserModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ➕ Crear usuario
            </button>
          </div>
        )}
      </div>

      {/* =========================
         USERS TABLE
      ========================== */}
      <UsersTable
        users={users}
        loading={loading}
        error={error}
        onToggleActive={setUserActive}
        onDelete={deactivateUser}
        onResetPassword={resetPassword}
      />

      {/* =========================
         CREATE CLIENT MODAL
      ========================== */}
      {showCreateClientModal && (
        <CreateClientModal
          onClose={() => setShowCreateClientModal(false)}
          onCreate={async (payload) => {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/clients`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload),
              }
            );

            // Refresca usuarios (por ahora)
            await refresh();
            setShowCreateClientModal(false);
          }}
        />
      )}

      {/* =========================
         CREATE USER MODAL
      ========================== */}
      {showCreateUserModal && (
        <UserFormModal
          clients={clients}
          onClose={() => setShowCreateUserModal(false)}
          onCreate={async (payload) => {
            await createUser(payload);
            setShowCreateUserModal(false);
          }}
        />
      )}
    </div>
  );
}
